import { j as e, r as u, d as Ae, a as ct, b as Ht } from "./react-vendor.js";
/* empty css      */
import { a as Ue } from "./QueryProvider.js";
import { u as ie, a as le, b as xe } from "./query-vendor.js";
import { D as Vt, l as Qt, e as st, B as ae, I as De, S as fe } from "./Dialog.js";
import { C as ka } from "./Combobox.js";
import { r as Ca } from "./httpClient.js";
import { R as be, T as he, P as ge, C as ye, A as Ta, a as Zt } from "./ui-vendor.js";
function Da({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: l,
  footer: o,
  children: n
}) {
  return /* @__PURE__ */ e.jsx(
    Vt,
    {
      open: t,
      onOpenChange: (i) => {
        i || a();
      },
      children: /* @__PURE__ */ e.jsx(
        Qt,
        {
          title: r,
          fullscreen: s,
          onInteractOutside: (i) => {
            i.preventDefault(), a();
          },
          onEscapeKeyDown: (i) => {
            i.preventDefault(), a();
          },
          children: /* @__PURE__ */ e.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
            l,
            /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: n }),
            o
          ] })
        }
      )
    }
  );
}
function Sa({ title: t, header: a, footer: s, children: r }) {
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
function $a({ isPrivate: t }) {
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
const rt = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, nt = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function Ea({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: l,
  fullscreen: o = !1
}) {
  const [n, i] = u.useState(!1), p = u.useRef(null);
  u.useEffect(() => {
    if (!n) return;
    const m = (h) => {
      p.current && !p.current.contains(h.target) && i(!1);
    }, b = (h) => {
      h.key === "Escape" && i(!1);
    };
    return document.addEventListener("mousedown", m), document.addEventListener("keydown", b), () => {
      document.removeEventListener("mousedown", m), document.removeEventListener("keydown", b);
    };
  }, [n]);
  const d = rt[t == null ? void 0 : t.status] ?? rt[1], c = nt[t == null ? void 0 : t.priority] ?? nt[2], x = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), i(!1);
  }, f = () => {
    var b, h, y, j;
    const m = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (b = navigator.clipboard) == null || b.writeText(m), (j = (y = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : y.info) == null || j.call(y, "Bağlantı kopyalandı."), i(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(st, { variant: d.variant, children: d.text }),
        /* @__PURE__ */ e.jsx(st, { variant: c.variant, children: c.text }),
        /* @__PURE__ */ e.jsx($a, { isPrivate: t == null ? void 0 : t.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": o ? "Küçült" : "Tam ekrana büyüt",
          onClick: l,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: o ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: p, children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": n,
            onClick: () => i((m) => !m),
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
                  onClick: x,
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
                  onClick: f,
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
                      i(!1), r();
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
const Pa = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function Ia({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: l }) {
  const o = Pa(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: o ? `Son kayıt: ${o}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(ae, { variant: "secondary", onClick: r, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        ae,
        {
          variant: "primary",
          onClick: () => l == null ? void 0 : l(),
          disabled: !a || !l,
          isLoading: s,
          loadingText: "Kaydediliyor…",
          children: "Kaydet"
        }
      )
    ] })
  ] }) });
}
const kt = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Aa = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function pe({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function La({ value: t, onChange: a }) {
  const [s, r] = u.useState(""), l = () => {
    const o = s.trim();
    o && !t.includes(o) && a([...t, o]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((o) => /* @__PURE__ */ e.jsxs(st, { variant: "neutral", children: [
      o,
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${o} etiketini kaldır`,
          onClick: () => a(t.filter((n) => n !== o)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, o)) }),
    /* @__PURE__ */ e.jsx(
      De,
      {
        value: s,
        onChange: (o) => r(o.target.value),
        onKeyDown: (o) => {
          o.key === "Enter" || o.key === "," ? (o.preventDefault(), l()) : o.key === "Backspace" && !s && t.length && a(t.slice(0, -1));
        },
        onBlur: l,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function za({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: l = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(pe, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      De,
      {
        id: "task-title",
        value: t.title,
        onChange: (o) => s("title", o.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(pe, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (o) => s("status", Number(o.target.value)),
          className: kt,
          children: Object.entries(rt).map(([o, n]) => /* @__PURE__ */ e.jsx("option", { value: o, children: n.text }, o))
        }
      ) }),
      /* @__PURE__ */ e.jsx(pe, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (o) => s("priority", Number(o.target.value)),
          className: kt,
          children: Object.entries(nt).map(([o, n]) => /* @__PURE__ */ e.jsx("option", { value: o, children: n.text }, o))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(pe, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      ka,
      {
        id: "task-assignee",
        options: r,
        value: t.assigneeId,
        onChange: (o) => s("assigneeId", o),
        placeholder: l ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: l
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(pe, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        De,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (o) => s("startDate", o.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(pe, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        De,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (o) => s("dueDate", o.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(pe, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(La, { value: t.tagNames, onChange: (o) => s("tagNames", o) }) }),
    /* @__PURE__ */ e.jsx(pe, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (o) => s("description", o.target.value),
        className: Aa
      }
    ) })
  ] });
}
const Ct = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function Ee({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function Ba({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(Ee, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(Ee, { label: "Oluşturulma zamanı", value: Ct(t.creationTime) }),
      /* @__PURE__ */ e.jsx(Ee, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(Ee, { label: "Son güncelleme zamanı", value: Ct(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(Ee, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const Ka = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", Ra = "border-brand-500 text-text-primary";
function Ma({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: l }) {
  const o = u.useRef(/* @__PURE__ */ new Map()), n = (p) => {
    var d;
    s(p.code), (d = o.current.get(p.code)) == null || d.focus();
  }, i = (p, d) => {
    p.key === "ArrowRight" ? (p.preventDefault(), n(t[(d + 1) % t.length])) : p.key === "ArrowLeft" ? (p.preventDefault(), n(t[(d - 1 + t.length) % t.length])) : p.key === "Home" ? (p.preventDefault(), n(t[0])) : p.key === "End" && (p.preventDefault(), n(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((p, d) => {
      const c = p.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (x) => {
            x ? o.current.set(p.code, x) : o.current.delete(p.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${p.code}`,
          "aria-selected": c,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: c ? 0 : -1,
          onClick: () => s(p.code),
          onKeyDown: (x) => i(x, d),
          className: `${Ka} ${c ? Ra : ""}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa ${p.icon}`, "aria-hidden": "true" }),
            p.title
          ]
        },
        p.code
      );
    }) }),
    /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        "aria-label": "Özellik ekle",
        "aria-haspopup": "dialog",
        "aria-expanded": l,
        onClick: r,
        className: "mx-1 grid h-8 w-8 flex-none place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" })
      }
    )
  ] });
}
const Fa = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Ga({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [l, o] = u.useState(""), n = u.useMemo(() => {
    const i = l.trim().toLocaleLowerCase("tr-TR"), p = i ? t.filter((c) => c.title.toLocaleLowerCase("tr-TR").includes(i)) : t, d = /* @__PURE__ */ new Map();
    return p.forEach((c) => {
      const x = d.get(c.category) ?? [];
      x.push(c), d.set(c.category, x);
    }), d;
  }, [t, l]);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Özellik ekle",
      className: "absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl",
      children: [
        /* @__PURE__ */ e.jsx(
          De,
          {
            autoFocus: !0,
            value: l,
            onChange: (i) => o(i.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          n.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...n.entries()].map(([i, p]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: Fa[i] ?? i }),
            p.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
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
          ] }, i))
        ] })
      ]
    }
  );
}
function Oa({ trail: t = [], current: a, onNavigate: s }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((r) => /* @__PURE__ */ e.jsxs(Ae.Fragment, { children: [
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
function qa(t) {
  var s, r, l;
  const a = (l = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : l.task;
  return a ? Promise.resolve(a.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function dt(t) {
  return ie({
    queryKey: ["task-detail", t],
    queryFn: () => qa(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function Wt(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
function Jt() {
  const [t, a] = u.useState(!1), [s, r] = u.useState(!1), l = u.useRef(null), o = u.useCallback(() => a(!0), []), n = u.useCallback(() => a(!1), []);
  u.useEffect(() => {
    if (!t) return;
    const d = (c) => {
      c.preventDefault(), c.returnValue = "";
    };
    return window.addEventListener("beforeunload", d), () => window.removeEventListener("beforeunload", d);
  }, [t]);
  const i = u.useCallback((d) => {
    if (!t) {
      d == null || d();
      return;
    }
    l.current = d ?? null, r(!0);
  }, [t]), p = u.useCallback((d) => {
    const c = l.current;
    return r(!1), l.current = null, d === "discard" && (a(!1), c == null || c()), d === "save" ? c : null;
  }, []);
  return { isDirty: t, markDirty: o, markClean: n, requestClose: i, pendingClose: s, resolvePendingClose: p };
}
const _a = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, xt = "task";
function Xt() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(xt);
  return t && _a.test(t) ? t : null;
}
function ea() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(xt), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function ta(t, a) {
  const s = u.useRef(a);
  s.current = a, u.useEffect(() => {
    if (!t || Xt() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(xt, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), u.useEffect(() => {
    const r = () => {
      var l;
      (l = s.current) == null || l.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const Ua = {
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
function Ya(t) {
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
  } : Ua;
}
function aa(t) {
  const [a, s] = u.useState(t == null ? void 0 : t.id), r = u.useMemo(() => Ya(t), [t]), [l, o] = u.useState(r), [n, i] = u.useState({});
  (t == null ? void 0 : t.id) !== a && (s(t == null ? void 0 : t.id), o(r), i({}));
  const p = u.useCallback((m, b) => {
    o((h) => ({ ...h, [m]: b }));
  }, []), d = u.useMemo(
    () => JSON.stringify(l) !== JSON.stringify(r),
    [l, r]
  ), c = u.useCallback(() => {
    const m = {};
    return l.title.trim() || (m.title = "Başlık zorunlu."), l.startDate || (m.startDate = "Başlangıç tarihi zorunlu."), l.dueDate && l.startDate && l.dueDate < l.startDate && (m.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), i(m), Object.keys(m).length === 0;
  }, [l]), x = u.useCallback(() => ({
    title: l.title.trim(),
    description: l.description || null,
    startDate: l.startDate,
    dueDate: l.dueDate || null,
    status: l.status,
    priority: l.priority,
    assigneeId: l.assigneeId,
    boardColumnId: (t == null ? void 0 : t.boardColumnId) ?? null,
    projectId: l.projectId ?? null,
    parentTaskId: (t == null ? void 0 : t.parentTaskId) ?? null,
    isPrivate: !!l.isPrivate,
    predecessorIds: (t == null ? void 0 : t.predecessorIds) ?? [],
    tagNames: l.tagNames,
    estimatedHours: l.estimatedHours,
    taskType: l.taskType || null,
    sprint: l.sprint || null
  }), [l, t]), f = u.useCallback(() => {
    o(r), i({});
  }, [r]);
  return { values: l, setField: p, isDirty: d, errors: n, validate: c, toUpdateDto: x, reset: f };
}
function Tt(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function Ha() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function sa() {
  var l;
  const t = ie({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Ha,
    staleTime: 3e5,
    retry: !1
  }), a = ((l = t.data) == null ? void 0 : l.items) ?? [], s = a.map((o) => ({ value: o.id, label: Tt(o) })), r = new Map(a.map((o) => [o.id, Tt(o)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function it() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Va(t) {
  const a = it();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ra(t) {
  const a = le(), s = ["task-features", t], r = ie({
    queryKey: s,
    queryFn: () => Va(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = xe({
    mutationFn: (i) => Promise.resolve(it().addFeature(t, i)),
    onSuccess: l
  }), n = xe({
    mutationFn: (i) => Promise.resolve(it().removeFeature(t, i)),
    onSuccess: l
  });
  return {
    assignedCodes: r.data ?? [],
    isLoading: r.isLoading,
    addFeature: o.mutateAsync,
    removeFeature: n.mutateAsync,
    mutatingCode: o.variables ?? n.variables ?? null,
    isMutating: o.isPending || n.isPending
  };
}
const Ye = {
  0: { label: "İptal", icon: "fa-ban", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  1: { label: "Bekliyor", icon: "fa-clock", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  2: { label: "Sürüyor", icon: "fa-spinner", bg: "bg-warning-subtle", fg: "text-warning", dot: "bg-warning" },
  3: { label: "Testte", icon: "fa-flask", bg: "bg-primary-subtle", fg: "text-primary", dot: "bg-primary" },
  4: { label: "Tamamlandı", icon: "fa-circle-check", bg: "bg-success-subtle", fg: "text-success", dot: "bg-success" }
}, lt = {
  1: { label: "Düşük", icon: "fa-arrow-down", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  2: { label: "Orta", icon: "fa-minus", bg: "bg-warning-subtle", fg: "text-warning" },
  3: { label: "Yüksek", icon: "fa-arrow-up", bg: "bg-negative-subtle", fg: "text-negative" },
  4: { label: "Kritik", icon: "fa-flag", bg: "bg-negative-subtle", fg: "text-negative" }
}, na = [1, 2, 3, 4], Qa = [1, 2, 3, 4], ze = (t) => Ye[t] ?? Ye[1], ia = (t) => lt[t] ?? lt[2];
function Be(t) {
  return t ? t.trim().split(/\s+/).map((a) => a[0]).join("").slice(0, 2).toUpperCase() : "—";
}
const Dt = ["#4F46E5", "#0EA5E9", "#059669", "#D97706", "#DB2777", "#7C3AED"];
function Ke(t) {
  if (!t) return "#9CA3AF";
  let a = 0;
  for (let s = 0; s < t.length; s++) a = a * 31 + t.charCodeAt(s) | 0;
  return Dt[Math.abs(a) % Dt.length];
}
function Za(t, a = /* @__PURE__ */ new Date()) {
  if (!t) return { tone: "text-text-tertiary", hint: "" };
  const s = new Date(t);
  if (Number.isNaN(s.getTime())) return { tone: "text-text-tertiary", hint: "" };
  const r = Math.ceil((s.setHours(0, 0, 0, 0) - new Date(a).setHours(0, 0, 0, 0)) / 864e5);
  return r < 0 ? { tone: "text-negative", hint: `${Math.abs(r)} gün gecikti` } : r === 0 ? { tone: "text-warning", hint: "Bugün" } : r <= 3 ? { tone: "text-warning", hint: `${r} gün kaldı` } : { tone: "text-text-tertiary", hint: `${r} gün kaldı` };
}
const Se = "rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden";
function ot({ title: t, badge: a, action: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3.5 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: t }),
      a
    ] }),
    s
  ] });
}
function Wa({ children: t, tone: a = "positive" }) {
  const s = a === "positive" ? "bg-success-subtle text-success" : "bg-neutral-subtle text-text-secondary";
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-full font-mono text-[11px] font-bold ${s}`, children: t });
}
function He({ children: t, bg: a, fg: s }) {
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-[7px] text-[10.5px] font-bold ${a} ${s}`, children: t });
}
function Le({ icon: t, title: a, description: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 px-6 py-10 text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-xl text-text-tertiary` }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: a }),
    s && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] leading-[1.55] text-text-tertiary max-w-[420px]", children: s })
  ] });
}
function la({ name: t, size: a = 24 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-white font-bold",
      style: { height: a, width: a, background: Ke(t), fontSize: a * 0.4 },
      title: t || void 0,
      children: Be(t)
    }
  );
}
const oa = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—", St = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function Ja(t) {
  return t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toFixed(1)} MB` : "0 KB";
}
function Ve(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = Math.floor(a / 3600), r = Math.floor(a % 3600 / 60);
  return !s && !r ? `${a}sn` : s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function Xa(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = (r) => String(r).padStart(2, "0");
  return `${s(Math.floor(a / 3600))}:${s(Math.floor(a / 60) % 60)}:${s(a % 60)}`;
}
const we = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  image: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  sheet: { icon: "fa-file-excel", bg: "bg-success-subtle", fg: "text-success" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  zip: { icon: "fa-file-zipper", bg: "bg-warning-subtle", fg: "text-warning" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
};
function es(t = "") {
  var s;
  const a = ((s = t.split(".").pop()) == null ? void 0 : s.toLowerCase()) ?? "";
  return a === "pdf" ? we.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(a) ? we.image : ["doc", "docx", "odt", "rtf", "txt"].includes(a) ? we.doc : ["xls", "xlsx", "csv", "ods"].includes(a) ? we.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(a) ? we.code : ["zip", "rar", "7z", "tar", "gz"].includes(a) ? we.zip : we.other;
}
function ts({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, l] = u.useState(""), [o, n] = u.useState(!1), i = le(), p = (a == null ? void 0 : a.subTasks) ?? [], d = p.filter((m) => m.status === 4).length, c = () => i.invalidateQueries({ queryKey: ["task-detail", t] }), x = async () => {
    var b, h, y;
    const m = r.trim();
    if (m) {
      n(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: m,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), l(""), await c();
      } catch (j) {
        (y = (h = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : h.error) == null || y.call(h, (j == null ? void 0 : j.message) || "Alt görev eklenemedi.");
      } finally {
        n(!1);
      }
    }
  }, f = async (m, b) => {
    var h, y, j;
    m.stopPropagation();
    try {
      await Promise.resolve(window.apya.platform.tasks.task.updateStatus(b.id, b.status === 4 ? 1 : 4)), await c();
    } catch (D) {
      (j = (y = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : y.error) == null || j.call(y, (D == null ? void 0 : D.message) || "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        p.length > 0 && /* @__PURE__ */ e.jsxs(Wa, { children: [
          d,
          "/",
          p.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: x,
          disabled: o || !r.trim(),
          className: `flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${o || !r.trim() ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            "Alt görev ekle"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
      p.map((m) => {
        const b = ze(m.status), h = m.status === 4;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => s == null ? void 0 : s(m.id, m.title),
            onKeyDown: (y) => {
              y.key === "Enter" && (s == null || s(m.id, m.title));
            },
            className: "flex items-center gap-3.5 px-4 py-3.5 border-t border-subtle first:border-t-0 hover:bg-surface-raised cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": `${m.title} tamamlandı işaretle`,
                  onClick: (y) => f(y, m),
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white cursor-pointer ${h ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: h && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: m.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${h ? "line-through text-text-tertiary" : "text-text-primary"}`, children: m.title }),
              /* @__PURE__ */ e.jsx(He, { bg: b.bg, fg: b.fg, children: b.label }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: oa(m.dueDate) }),
              /* @__PURE__ */ e.jsx(la, { name: m.assigneeName }),
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-right shrink-0 text-[10px] text-text-tertiary" })
            ]
          },
          m.id
        );
      }),
      /* @__PURE__ */ e.jsx("div", { className: "px-4 py-3 border-t border-subtle first:border-t-0", children: /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: r,
          onChange: (m) => l(m.target.value),
          onKeyDown: (m) => {
            m.key === "Enter" && x();
          },
          disabled: o,
          placeholder: "Yeni alt görev başlığı",
          className: "w-full h-9 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      ) })
    ] }),
    p.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz alt görev yok." })
  ] });
}
function ca() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function as(t) {
  const a = ca();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function ss(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, l = Ca();
  l && (r.RequestVerificationToken = l);
  const o = await fetch(`/api/tasks/attachments/upload/${t}`, {
    method: "POST",
    credentials: "include",
    headers: r,
    body: s
  });
  let n = null;
  try {
    n = await o.json();
  } catch {
  }
  if (!o.ok || (n == null ? void 0 : n.success) === !1)
    throw new Error((n == null ? void 0 : n.error) || "Dosya yüklenemedi.");
  return n;
}
function da(t) {
  const a = le(), s = ["task-attachments", t], r = ie({
    queryKey: s,
    queryFn: () => as(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = xe({
    mutationFn: (i) => ss(t, i),
    onSuccess: l
  }), n = xe({
    mutationFn: (i) => Promise.resolve(ca().deleteAttachment(i)),
    onSuccess: l
  });
  return {
    attachments: r.data ?? [],
    isLoading: r.isLoading,
    upload: o.mutateAsync,
    remove: n.mutateAsync,
    isUploading: o.isPending
  };
}
function rs({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: l } = da(t), o = u.useRef(null), [n, i] = u.useState(!1), p = async (c) => {
    var x, f, m, b, h, y;
    if (c)
      try {
        await s(c), (m = (f = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : f.success) == null || m.call(f, "Dosya yüklendi.");
      } catch (j) {
        (y = (h = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : h.error) == null || y.call(h, (j == null ? void 0 : j.message) || "Dosya yüklenemedi.");
      } finally {
        o.current && (o.current.value = "");
      }
  }, d = async (c, x) => {
    var f, m, b;
    try {
      await r(c);
    } catch (h) {
      (b = (m = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : m.error) == null || b.call(m, (h == null ? void 0 : h.message) || `${x} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: o,
        type: "file",
        className: "hidden",
        onChange: (c) => {
          var x;
          return p((x = c.target.files) == null ? void 0 : x[0]);
        },
        disabled: l
      }
    ),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "button",
        tabIndex: 0,
        onClick: () => {
          var c;
          return (c = o.current) == null ? void 0 : c.click();
        },
        onKeyDown: (c) => {
          var x;
          c.key === "Enter" && ((x = o.current) == null || x.click());
        },
        onDragOver: (c) => {
          c.preventDefault(), n || i(!0);
        },
        onDragLeave: () => i(!1),
        onDrop: (c) => {
          var x, f;
          c.preventDefault(), i(!1), p((f = (x = c.dataTransfer) == null ? void 0 : x.files) == null ? void 0 : f[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${n ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-[26px] ${n ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: l ? "Yükleniyor…" : n ? "Bırakın, yükleyelim" : "Dosyaları buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, PDF, DOCX · max 25MB" })
        ]
      }
    ),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3", children: a.map((c) => {
      const x = es(c.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${x.bg} ${x.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: c.fileName, children: c.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: Ja(c.fileSize) })
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
function qe() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function ns(t) {
  const a = qe();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ut(t) {
  const a = le(), s = ["task-checklist", t], r = ie({
    queryKey: s,
    queryFn: () => ns(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = xe({
    mutationFn: (p) => Promise.resolve(qe().addChecklistItem(t, p)),
    onSuccess: l
  }), n = xe({
    mutationFn: (p) => Promise.resolve(qe().toggleChecklistItem(p)),
    onSuccess: l
  }), i = xe({
    mutationFn: (p) => Promise.resolve(qe().deleteChecklistItem(p)),
    onSuccess: l
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: o.mutateAsync,
    toggleItem: n.mutateAsync,
    removeItem: i.mutateAsync
  };
}
function is({ taskId: t }) {
  const { items: a, addItem: s, toggleItem: r, removeItem: l } = ut(t), [o, n] = u.useState(""), i = async () => {
    var x, f, m;
    const c = o.trim();
    if (c)
      try {
        await s(c), n("");
      } catch (b) {
        (m = (f = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : f.error) == null || m.call(f, (b == null ? void 0 : b.message) || "Madde eklenemedi.");
      }
  }, p = async (c) => {
    var x, f, m;
    try {
      await r(c);
    } catch (b) {
      (m = (f = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : f.error) == null || m.call(f, (b == null ? void 0 : b.message) || "Madde güncellenemedi.");
    }
  }, d = async (c, x) => {
    var f, m, b;
    try {
      await l(c);
    } catch (h) {
      (b = (m = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : m.error) == null || b.call(m, (h == null ? void 0 : h.message) || `${x} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        De,
        {
          value: o,
          onChange: (c) => n(c.target.value),
          onKeyDown: (c) => {
            c.key === "Enter" && i();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ e.jsx(ae, { variant: "secondary", onClick: i, disabled: !o.trim(), children: "Ekle" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz madde eklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "space-y-1.5", children: a.map((c) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-2 py-1", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: c.isDone,
            onChange: () => p(c.id)
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: c.isDone ? "text-text-tertiary line-through" : "text-text-primary", children: c.text })
      ] }),
      /* @__PURE__ */ e.jsx(ae, { variant: "ghost", onClick: () => d(c.id, c.text), "aria-label": `${c.text} maddesini sil`, children: "Sil" })
    ] }, c.id)) })
  ] });
}
function ls({ taskId: t, task: a }) {
  const [s, r] = u.useState(""), [l, o] = u.useState(null), [n, i] = u.useState(""), [p, d] = u.useState(!1), c = le(), x = (a == null ? void 0 : a.comments) ?? [], f = async (b) => {
    var h, y, j, D, A, R;
    if (b == null || b.preventDefault(), !(!s.trim() || p)) {
      d(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), c.invalidateQueries({ queryKey: ["task-detail", t] }), (j = (y = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : y.success) == null || j.call(y, "Yorum eklendi.");
      } catch (F) {
        (R = (A = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : A.error) == null || R.call(A, (F == null ? void 0 : F.message) || "Yorum eklenemedi.");
      } finally {
        d(!1);
      }
    }
  }, m = async (b) => {
    var h, y, j, D, A, R;
    if (!(!n.trim() || p)) {
      d(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(b, n.trim())
        ), i(""), o(null), c.invalidateQueries({ queryKey: ["task-detail", t] }), (j = (y = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : y.success) == null || j.call(y, "Yanıt eklendi.");
      } catch (F) {
        (R = (A = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : A.error) == null || R.call(A, (F == null ? void 0 : F.message) || "Yanıt eklenemedi.");
      } finally {
        d(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("form", { onSubmit: f, className: "rounded-lg border border-default p-3 bg-surface-base", children: [
      /* @__PURE__ */ e.jsx(
        "textarea",
        {
          rows: 3,
          value: s,
          onChange: (b) => r(b.target.value),
          placeholder: "Bir yorum veya güncelleme yazın...",
          className: "w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ e.jsx(
        ae,
        {
          type: "submit",
          variant: "primary",
          disabled: !s.trim() || p,
          isLoading: p,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    x.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: x.map((b) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: b.creatorUserName || b.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: b.creationTime ? new Date(b.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: b.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        ae,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => o(l === b.id ? null : b.id),
          children: "Yanıtla"
        }
      ) }),
      l === b.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: n,
            onChange: (h) => i(h.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(ae, { variant: "ghost", size: "sm", onClick: () => o(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(ae, { variant: "primary", size: "sm", disabled: !n.trim() || p, onClick: () => m(b.id), children: "Gönder" })
        ] })
      ] }),
      b.replies && b.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: b.replies.map((h) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: h.creatorUserName || h.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: h.creationTime ? new Date(h.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: h.text })
      ] }, h.id)) })
    ] }, b.id)) })
  ] });
}
function os({ task: t }) {
  var s;
  const a = [];
  return t != null && t.creationTime && a.push({
    id: "created",
    icon: "fa-plus",
    bg: "bg-success-subtle",
    fg: "text-success",
    actor: t.creatorUserName || t.creatorName || "Sistem / Kullanıcı",
    event: "görevi oluşturdu",
    time: St(t.creationTime)
  }), t != null && t.lastModificationTime && a.push({
    id: "modified",
    icon: "fa-pen",
    bg: "bg-warning-subtle",
    fg: "text-warning",
    actor: t.lastModifierUserName || t.lastModifierName || "Kullanıcı",
    event: "görevi güncelledi",
    time: St(t.lastModificationTime)
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
    a.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Aktivite kaydı bulunamadı." }) }) : /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: a.map((r, l) => {
      const o = l === a.length - 1;
      return /* @__PURE__ */ e.jsxs("div", { className: `flex items-start gap-3.5 ${o ? "" : "pb-[18px]"}`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center shrink-0 self-stretch", children: [
          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-7 w-7 rounded-full ${r.bg} ${r.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r.icon} text-[11px]` }) }),
          !o && /* @__PURE__ */ e.jsx("span", { className: "flex-1 w-0.5 mt-1.5 rounded-sm bg-subtle" })
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
function cs({ task: t }) {
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
function Fe(t, a) {
  const s = a || "TRY";
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: s, minimumFractionDigits: 2 }).format(t || 0);
  } catch {
    return `${(t || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${s}`.trim();
  }
}
function Qe({ label: t, value: a, tone: s, note: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: `font-mono text-[22px] font-bold tracking-[-.02em] ${s}`, style: { fontVariantNumeric: "tabular-nums" }, children: a }),
    r && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
  ] });
}
function ds({ task: t }) {
  const a = (t == null ? void 0 : t.expenses) || [], s = (t == null ? void 0 : t.incomes) || [];
  if (a.length === 0 && s.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
      /* @__PURE__ */ e.jsx(ot, { title: "Görev Finansı" }),
      /* @__PURE__ */ e.jsx(
        Le,
        {
          icon: "fa-coins",
          title: "Kayıt yok",
          description: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
        }
      )
    ] });
  const l = Array.from(new Set([...a, ...s].map((n) => n.currency || "TRY"))).map((n) => {
    const i = s.filter((d) => (d.currency || "TRY") === n).reduce((d, c) => d + (c.amount || 0), 0), p = a.filter((d) => (d.currency || "TRY") === n).reduce((d, c) => d + (c.amount || 0), 0);
    return { cur: n, inc: i, exp: p, net: i - p };
  }), o = [
    ...s.map((n) => ({ ...n, kind: "income" })),
    ...a.map((n) => ({ ...n, kind: "expense" }))
  ].sort((n, i) => new Date(i.date || 0) - new Date(n.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    l.map(({ cur: n, inc: i, exp: p, net: d }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(Qe, { label: `Toplam Gelir (${n})`, value: Fe(i, n), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(Qe, { label: `Toplam Gider (${n})`, value: Fe(p, n), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        Qe,
        {
          label: `Net Bakiye (${n})`,
          value: Fe(d, n),
          tone: d >= 0 ? "text-success" : "text-negative",
          note: d >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, n)),
    /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
      /* @__PURE__ */ e.jsx(ot, { title: "Finans kalemleri" }),
      o.map((n) => /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-7 w-7 rounded-lg bg-neutral-subtle text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n.kind === "income" ? "fa-arrow-down" : "fa-arrow-up"} text-[11px]` }) }),
            /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] font-semibold text-text-primary", children: n.title || (n.kind === "income" ? "Gelir" : "Gider") }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: oa(n.date) }),
            n.kind === "income" ? /* @__PURE__ */ e.jsx(He, { bg: "bg-success-subtle", fg: "text-success", children: "Gelir" }) : /* @__PURE__ */ e.jsx(He, { bg: "bg-warning-subtle", fg: "text-warning", children: "Gider" }),
            /* @__PURE__ */ e.jsxs(
              "span",
              {
                className: `shrink-0 font-mono text-[12.5px] font-bold ${n.kind === "income" ? "text-success" : "text-text-primary"}`,
                style: { fontVariantNumeric: "tabular-nums" },
                children: [
                  n.kind === "income" ? "+" : "−",
                  Fe(n.amount, n.currency)
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
const xs = {
  0: "bg-neutral-400",
  1: "bg-text-tertiary",
  2: "bg-warning",
  3: "bg-primary",
  4: "bg-success"
};
function Ze(t) {
  if (!t) return null;
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? null : a;
}
const Pe = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
function us({ task: t = {} }) {
  const a = u.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((n, i) => ({
    id: n.id || `row-${i}`,
    name: n.title || "Başlıksız görev",
    isMain: !!n.__main,
    start: Ze(n.startDate),
    end: Ze(n.dueDate) || Ze(n.completedDate),
    status: n.status ?? 1
  })), [t]), { min: s, span: r } = u.useMemo(() => {
    const o = a.flatMap((p) => [p.start, p.end]).filter(Boolean).map((p) => p.getTime());
    if (o.length === 0) return { min: null, span: 0 };
    const n = Math.min(...o), i = Math.max(...o);
    return { min: n, span: Math.max(1, i - n) };
  }, [a]), l = u.useMemo(() => s === null ? [] : [0, 1, 2, 3].map((o) => new Date(s + r * o / 4)), [s, r]);
  return s === null ? /* @__PURE__ */ e.jsx("div", { className: Se, children: /* @__PURE__ */ e.jsx(
    Le,
    {
      icon: "fa-bars-staggered",
      title: "Zaman çizelgesi çizilemiyor",
      description: "Görevde veya alt görevlerde başlangıç–bitiş tarihi tanımlı olmalı."
    }
  ) }) : /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Zaman çizelgesi" }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] text-text-tertiary", children: [
        Pe(new Date(s)),
        " – ",
        Pe(new Date(s + r))
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-4 gap-0 pl-[170px] mb-2 lt-860:pl-[110px]", children: l.map((o, n) => /* @__PURE__ */ e.jsx(
      "span",
      {
        className: "pl-2 border-l border-subtle text-[10.5px] font-bold uppercase tracking-[.06em] text-text-tertiary",
        children: Pe(o)
      },
      n
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: a.map((o) => {
      const n = o.start ? o.start.getTime() : s, i = o.end ? Math.max(o.end.getTime(), n) : n, p = (n - s) / r * 100, d = Math.max(2, (i - n) / r * 100), c = Math.max(1, Math.round((i - n) / 864e5));
      return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-0 h-9", children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            className: `w-[170px] lt-860:w-[110px] shrink-0 pr-3 truncate text-[12.5px] ${o.isMain ? "font-bold text-text-primary" : "font-semibold text-text-secondary"}`,
            title: o.name,
            children: o.name
          }
        ),
        /* @__PURE__ */ e.jsx("div", { className: "relative flex-1 h-full rounded-lg bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: `absolute top-[7px] bottom-[7px] flex items-center px-2.5 rounded-[7px] shadow-xs ${xs[o.status] || "bg-primary"}`,
            style: { left: `${p}%`, width: `${d}%` },
            title: `${Pe(o.start)} – ${Pe(o.end)}`,
            children: /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[10.5px] font-bold text-white", children: [
              c,
              "g"
            ] })
          }
        ) })
      ] }, o.id);
    }) })
  ] });
}
function $t({ icon: t, iconTone: a, title: s, note: r, children: l }) {
  return /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[12px] ${a}` }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: s }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
    ] }),
    l
  ] });
}
function ps({ task: t = {} }) {
  const a = le(), s = t.predecessorIds || [], r = () => {
    var p, d, c;
    return (c = (d = (p = window == null ? void 0 : window.apya) == null ? void 0 : p.platform) == null ? void 0 : d.tasks) == null ? void 0 : c.task;
  }, { data: l = [], isLoading: o } = ie({
    queryKey: ["task-predecessors", t.id, s],
    queryFn: async () => {
      const p = r();
      return p ? Promise.all(
        s.map(
          (d) => Promise.resolve(p.get(d)).catch(() => ({ id: d, title: "(erişilemeyen görev)", status: null, code: "—" }))
        )
      ) : [];
    },
    enabled: s.length > 0,
    staleTime: 3e4,
    retry: !1
  }), n = async (p) => {
    var d, c, x, f, m, b;
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
        predecessorIds: s.filter((h) => h !== p),
        tagNames: (t.tags ?? []).map((h) => h.name),
        estimatedHours: t.estimatedHours ?? null,
        taskType: t.taskType ?? null,
        sprint: t.sprint ?? null
      })), await a.invalidateQueries({ queryKey: ["task-detail", t.id] }), (x = (c = (d = window == null ? void 0 : window.abp) == null ? void 0 : d.notify) == null ? void 0 : c.info) == null || x.call(c, "Bağlantı kaldırıldı.");
    } catch (h) {
      (b = (m = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : m.error) == null || b.call(m, (h == null ? void 0 : h.message) || "Bağlantı kaldırılamadı.");
    }
  }, i = (p) => {
    var d, c, x;
    return (x = (c = (d = window == null ? void 0 : window.apya) == null ? void 0 : d.taskDetail) == null ? void 0 : c.open) == null ? void 0 : x.call(c, p);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsx(
      $t,
      {
        icon: "fa-arrow-left-long",
        iconTone: "text-warning",
        title: "Öncül görevler",
        note: "bu görev başlamadan tamamlanmalı",
        children: s.length === 0 ? /* @__PURE__ */ e.jsx(Le, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : o ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : l.map((p) => {
          const d = p.status == null ? null : ze(p.status);
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: p.code || "—" }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => i(p.id),
                    className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                    children: p.title || "Başlıksız görev"
                  }
                ),
                d && /* @__PURE__ */ e.jsx(He, { bg: d.bg, fg: d.fg, children: d.label }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Bağlantıyı kaldır",
                    "aria-label": `${p.title} bağlantısını kaldır`,
                    onClick: () => n(p.id),
                    className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link-slash text-[10px]" })
                  }
                )
              ]
            },
            p.id
          );
        })
      }
    ),
    /* @__PURE__ */ e.jsx(
      $t,
      {
        icon: "fa-arrow-right-long",
        iconTone: "text-primary",
        title: "Ardıl görevler",
        note: "bu görev bitince başlar",
        children: /* @__PURE__ */ e.jsx(
          Le,
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
function Ce() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task) || null;
}
function ms(t) {
  const a = le(), s = ["task-timelogs", t], r = ["task-active-timelog"], l = ie({
    queryKey: s,
    queryFn: () => {
      var d;
      return Promise.resolve((d = Ce()) == null ? void 0 : d.getTimeLogs(t));
    },
    enabled: !!t && !!Ce(),
    staleTime: 15e3,
    retry: !1
  }), o = ie({
    queryKey: r,
    queryFn: () => {
      var d;
      return Promise.resolve((d = Ce()) == null ? void 0 : d.getActiveTimeLog());
    },
    enabled: !!Ce(),
    staleTime: 5e3,
    retry: !1
  }), n = () => {
    a.invalidateQueries({ queryKey: s }), a.invalidateQueries({ queryKey: r });
  }, i = xe({
    mutationFn: () => {
      var d;
      return Promise.resolve((d = Ce()) == null ? void 0 : d.startTimeTracking(t));
    },
    onSuccess: n
  }), p = xe({
    mutationFn: () => {
      var d;
      return Promise.resolve((d = Ce()) == null ? void 0 : d.stopTimeTracking(t));
    },
    onSuccess: n
  });
  return {
    logs: l.data ?? [],
    isLoading: l.isLoading,
    activeLog: o.data ?? null,
    start: i.mutateAsync,
    stop: p.mutateAsync,
    isMutating: i.isPending || p.isPending
  };
}
function Et(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function fs({ taskId: t, task: a = {} }) {
  const s = ms(t), r = s.activeLog && s.activeLog.taskId === t ? s.activeLog : null, [l, o] = u.useState(() => Date.now());
  u.useEffect(() => {
    if (!r) return;
    const b = setInterval(() => o(Date.now()), 1e3);
    return () => clearInterval(b);
  }, [r]);
  const n = r ? Math.max(0, Math.floor((l - new Date(r.startTime).getTime()) / 1e3)) : 0, p = s.logs.reduce((b, h) => b + (h.secondsSpent || 0), 0) + n, d = (a == null ? void 0 : a.estimatedHours) ?? null, c = d ? d * 3600 : 0, x = c ? Math.min(100, Math.round(p / c * 100)) : 0, f = c ? Math.max(0, c - p) : 0, m = async () => {
    var b, h, y;
    try {
      r ? await s.stop() : await s.start();
    } catch (j) {
      (y = (h = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : h.error) == null || y.call(h, (j == null ? void 0 : j.message) || "Zaman takibi güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-5 flex-wrap p-[22px] rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[18px]", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: m,
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
              children: Xa(p)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary", children: r ? "Kayıt sürüyor" : "Sayaç duraklatıldı" })
        ] })
      ] }),
      c > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] font-bold text-text-secondary", children: "Tahmin kullanımı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
            Ve(p),
            " / ",
            d,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-warning", style: { width: `${x}%` } }) }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "Kalan tahmini süre: ",
          Ve(f)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
      /* @__PURE__ */ e.jsx(ot, { title: "Zaman kayıtları" }),
      s.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : s.logs.length === 0 ? /* @__PURE__ */ e.jsx(
        Le,
        {
          icon: "fa-stopwatch",
          title: "Henüz zaman kaydı yok",
          description: "Soldaki yeşil düğmeyle sayacı çalıştırın; durdurduğunuzda kayıt buraya düşer."
        }
      ) : s.logs.map((b) => {
        const h = !b.endTime;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
            children: [
              /* @__PURE__ */ e.jsx(la, { name: b.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: b.note || b.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                Et(b.startTime),
                " → ",
                h ? "sürüyor" : Et(b.endTime)
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary", children: h ? "Aktif" : Ve(b.secondsSpent || 0) })
            ]
          },
          b.id
        );
      })
    ] })
  ] });
}
const Re = [
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
    component: ts
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
    component: rs
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
    component: is
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
    component: us
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
    component: ps
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
    component: ds
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
    component: cs
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
    component: os
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
    component: ls
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
    component: fs
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
function xa(t = []) {
  const a = new Set(t);
  return Re.filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function bs(t = []) {
  const a = new Set(t);
  return Re.filter((s) => !s.isCore).filter((s) => !s.permission || Wt(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let Ge = null;
const _e = /* @__PURE__ */ new Set(), We = /* @__PURE__ */ new Set();
function Pt() {
  _e.forEach((t) => t());
}
function hs(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const se = {
  open(t) {
    const a = hs(t);
    a && (Ge = a, Pt());
  },
  close() {
    Ge = null, Pt();
  },
  subscribe(t) {
    return _e.add(t), () => _e.delete(t);
  },
  getSnapshot() {
    return Ge;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && We.add(t);
  },
  emitResult() {
    We.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    Ge = null, _e.clear(), We.clear();
  }
}, It = "apya.taskDetail.fullscreen";
function ua({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, l] = u.useState(t), [o, n] = u.useState([]), { data: i, isLoading: p, isError: d, refetch: c } = dt(r), x = Jt(), f = aa(i), m = sa(), b = ra(r), [h, y] = u.useState("general"), [j, D] = u.useState(!1), A = Ae.useRef(null), R = u.useMemo(
    () => xa(b.assignedCodes),
    [b.assignedCodes]
  ), F = u.useMemo(
    () => bs(b.assignedCodes),
    [b.assignedCodes]
  ), B = R.find((I) => I.code === h) ?? R[0];
  Ae.useEffect(() => {
    B.code !== h && y(B.code);
  }, [B, h]);
  const H = B == null ? void 0 : B.component, _ = le(), [Q, U] = u.useState(
    () => {
      var I;
      return ((I = window.localStorage) == null ? void 0 : I.getItem(It)) === "1";
    }
  ), [q, Z] = u.useState(!1), ee = u.useCallback(() => {
    ea(), s == null || s();
  }, [s]);
  ta(t, ee), Ae.useEffect(() => {
    f.isDirty ? x.markDirty() : x.markClean();
  });
  const J = u.useCallback(() => x.requestClose(ee), [x, ee]), M = u.useCallback(() => {
    U((I) => {
      var O;
      const z = !I;
      return (O = window.localStorage) == null || O.setItem(It, z ? "1" : "0"), z;
    });
  }, []), k = Wt("Platform.Tasks.Delete"), [C, w] = u.useState(!1), [g, S] = u.useState(!1), $ = u.useCallback(async () => {
    var I, z, O, te, X, ve;
    S(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (O = (z = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : z.info) == null || O.call(z, "Başarıyla silindi."), w(!1), x.markClean(), ee();
    } catch (de) {
      (ve = (X = (te = window == null ? void 0 : window.abp) == null ? void 0 : te.notify) == null ? void 0 : X.error) == null || ve.call(X, (de == null ? void 0 : de.message) || "Görev silinemedi.");
    } finally {
      S(!1);
    }
  }, [r, x, ee]), E = u.useCallback(async () => {
    var I, z, O, te, X, ve;
    if (!f.validate()) return !1;
    Z(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, f.toUpdateDto())
      ), await _.invalidateQueries({ queryKey: ["task-detail", r] }), se.emitResult(), (O = (z = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : z.success) == null || O.call(z, "Kaydedildi."), !0;
    } catch (de) {
      return (ve = (X = (te = window == null ? void 0 : window.abp) == null ? void 0 : te.notify) == null ? void 0 : X.error) == null || ve.call(X, (de == null ? void 0 : de.message) || "Kaydedilemedi."), !1;
    } finally {
      Z(!1);
    }
  }, [r, f, x, _]), V = u.useCallback(() => {
    E();
  }, [E]), oe = u.useCallback(async () => {
    const I = x.resolvePendingClose("save");
    await E() && (I == null || I());
  }, [x, E]), v = u.useCallback((I, z) => {
    x.requestClose(() => {
      n((O) => [...O, { id: r, title: (i == null ? void 0 : i.title) ?? "" }]), l(I), y("general"), x.markClean();
    });
  }, [x, r, i]), L = u.useCallback((I) => {
    x.requestClose(() => {
      n((z) => {
        const O = z.findIndex((te) => te.id === I);
        return O === -1 ? z : z.slice(0, O);
      }), l(I), y("general"), x.markClean();
    });
  }, [x]), P = u.useCallback(async (I) => {
    var z, O, te;
    try {
      await b.addFeature(I), y(I), D(!1);
    } catch (X) {
      (te = (O = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : O.error) == null || te.call(O, (X == null ? void 0 : X.message) || "Özellik eklenemedi.");
    }
  }, [b]), G = u.useCallback(async (I) => {
    var z, O, te;
    try {
      await b.removeFeature(I), y((X) => X === I ? "general" : X);
    } catch (X) {
      (te = (O = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : O.error) == null || te.call(O, (X == null ? void 0 : X.message) || "Özellik kaldırılamadı.");
    }
  }, [b]);
  Ae.useEffect(() => {
    if (!j) return;
    const I = (O) => {
      A.current && !A.current.contains(O.target) && D(!1);
    }, z = (O) => {
      O.key === "Escape" && D(!1);
    };
    return document.addEventListener("mousedown", I), document.addEventListener("keydown", z), () => {
      document.removeEventListener("mousedown", I), document.removeEventListener("keydown", z);
    };
  }, [j]);
  const Y = p ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(fe, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(fe, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(fe, { className: "h-24 w-full" })
  ] }) : d ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(ae, { variant: "ghost", onClick: () => c(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      Oa,
      {
        trail: o,
        current: { id: r, title: (i == null ? void 0 : i.title) ?? "" },
        onNavigate: L
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: A, children: [
      /* @__PURE__ */ e.jsx(
        Ma,
        {
          tabs: R,
          activeCode: B.code,
          onSelect: (I) => {
            y(I), D(!1);
          },
          onOpenPicker: () => D((I) => !I),
          pickerOpen: j
        }
      ),
      j && /* @__PURE__ */ e.jsx(
        Ga,
        {
          entries: F,
          busyCode: b.isMutating ? b.mutatingCode : null,
          onAdd: P,
          onRemove: G
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${B.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          B.code === "general" ? /* @__PURE__ */ e.jsx(
            za,
            {
              values: f.values,
              errors: f.errors,
              onFieldChange: f.setField,
              assigneeOptions: m.options,
              isLoadingAssignees: m.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(u.Suspense, { fallback: /* @__PURE__ */ e.jsx(fe, { className: "h-24 w-full" }), children: H && /* @__PURE__ */ e.jsx(
            H,
            {
              taskId: r,
              task: i,
              onOpenSubtask: v
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            Ba,
            {
              task: i,
              creatorName: m.nameById.get(i.creatorId),
              lastModifierName: m.nameById.get(i.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), re = a === "page" ? Sa : Da;
  return /* @__PURE__ */ e.jsxs(
    re,
    {
      open: !0,
      fullscreen: Q,
      onRequestClose: J,
      title: i ? `Görev Detayı: ${i.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        Ea,
        {
          task: i ?? { title: "Yükleniyor…" },
          canDelete: k,
          fullscreen: Q,
          onToggleFullscreen: M,
          onClose: J,
          onDelete: () => w(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        Ia,
        {
          lastSavedAt: i == null ? void 0 : i.lastModificationTime,
          isDirty: x.isDirty,
          isSaving: q,
          onCancel: J,
          onSave: V
        }
      ),
      children: [
        Y,
        x.pendingClose && /* @__PURE__ */ e.jsx(
          ys,
          {
            isSaving: q,
            onStay: () => x.resolvePendingClose("stay"),
            onDiscard: () => x.resolvePendingClose("discard"),
            onSaveAndClose: oe
          }
        ),
        C && /* @__PURE__ */ e.jsx(
          gs,
          {
            taskTitle: (i == null ? void 0 : i.title) ?? "",
            busy: g,
            onCancel: () => w(!1),
            onConfirm: $
          }
        )
      ]
    }
  );
}
function gs({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [l, o] = u.useState(""), n = l.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    pa,
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
            value: l,
            onChange: (i) => o(i.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function pa({ label: t, title: a, description: s, children: r, actions: l }) {
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
        /* @__PURE__ */ e.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: l })
      ] })
    }
  );
}
function ys({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    pa,
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
const vs = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function js({ isPrivate: t = !1, onChange: a = () => {
} }) {
  const s = !!t;
  return /* @__PURE__ */ e.jsxs(be, { children: [
    /* @__PURE__ */ e.jsx(he, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        className: "flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-default transition-all shadow-sm",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${s ? "fa-lock" : "fa-globe"} text-[11px] text-text-tertiary` }),
          /* @__PURE__ */ e.jsx("span", { children: s ? "Özel görev" : "Herkese açık" }),
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[10px] ml-0.5 text-text-tertiary" })
        ]
      }
    ) }),
    /* @__PURE__ */ e.jsx(ge, { children: /* @__PURE__ */ e.jsxs(
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
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: vs.map((r) => {
            const l = s === r.value;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => a(r.value),
                className: `flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${l ? "border-primary bg-primary-subtle/40" : "border-subtle hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r.icon} text-base mt-0.5 ${l ? "text-primary" : "text-text-tertiary"}` }),
                  /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ e.jsx("h4", { className: "text-[13px] font-semibold text-text-primary", children: r.title }),
                      l && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ] }),
                    /* @__PURE__ */ e.jsx("p", { className: "text-[12px] text-text-tertiary mt-0.5", children: r.desc })
                  ] })
                ]
              },
              String(r.value)
            );
          }) }),
          /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-text-tertiary mt-3", children: "Değişiklik “Kaydet” ile uygulanır." }),
          /* @__PURE__ */ e.jsx(Ta, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const Je = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast", ws = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", Ns = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" },
  { what: "Bağlantı kopyala", key: "⌘ L" }
];
function At({ children: t }) {
  return /* @__PURE__ */ e.jsx(Zt, { asChild: !0, children: t });
}
function ks({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "inline-flex items-center h-[19px] px-1.5 rounded-[5px] border border-default border-b-2 bg-neutral-subtle font-mono text-[10px] font-semibold text-text-secondary", children: t });
}
function Cs({
  task: t = {},
  presentation: a = "modal",
  onClose: s,
  isFullscreen: r,
  onToggleFullscreen: l,
  onFieldChange: o = () => {
  },
  statusValue: n,
  priorityValue: i,
  titleValue: p,
  isPrivateValue: d,
  isFavorite: c,
  onToggleFavorite: x,
  isWatched: f,
  onToggleWatch: m,
  onDuplicate: b,
  onArchive: h,
  onDelete: y,
  onOpenTransfer: j,
  onSaveAsTemplate: D,
  onConvertToSubtask: A,
  onExportPdf: R
}) {
  const [F, B] = u.useState(!1), [H, _] = u.useState(!1), Q = u.useRef(null), U = ze(n ?? t.status), q = ia(i ?? t.priority), Z = t.code || "GRV-—", ee = () => {
    var C;
    (C = navigator.clipboard) == null || C.writeText(Z), B(!0), setTimeout(() => B(!1), 1800);
  }, J = () => {
    var C, w, g, S;
    (C = navigator.clipboard) == null || C.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), (S = (g = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : g.success) == null || S.call(g, "Görev bağlantısı panoya kopyalandı.");
  }, M = (C) => () => {
    _(!1), C == null || C();
  }, k = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", kbd: "⌘L", onClick: M(J) },
    { label: "Çoğalt", icon: "fa-copy", kbd: "⌘D", onClick: M(b) },
    { label: "Başka projeye kopyala", icon: "fa-clone", onClick: M(() => j == null ? void 0 : j("copy")) },
    { label: "Şablon olarak kaydet", icon: "fa-bookmark", onClick: M(D) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, onClick: M(() => j == null ? void 0 : j("move")) },
    { label: "Alt göreve dönüştür", icon: "fa-diagram-project", onClick: M(A) },
    { label: f ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: M(m) },
    { label: "Arşivle", icon: "fa-box-archive", separator: !0, onClick: M(h) },
    { label: "Yazdır", icon: "fa-print", kbd: "⌘P", onClick: M(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: M(R) },
    { label: "Sil", icon: "fa-trash-can", kbd: "⌫", separator: !0, danger: !0, onClick: M(y) }
  ];
  return /* @__PURE__ */ e.jsx("header", { className: "px-6 pt-[18px] pb-4 border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px] min-w-0 flex-1", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: ee,
            title: "Kodu kopyala",
            className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[11px] font-bold tracking-[.04em] cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[9px] opacity-70" }),
              /* @__PURE__ */ e.jsx("span", { children: Z }),
              /* @__PURE__ */ e.jsx("i", { className: `${F ? "fa-solid fa-check" : "fa-regular fa-copy"} text-[9px] opacity-60` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(be, { children: [
          /* @__PURE__ */ e.jsx(he, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] border border-default text-[12px] font-semibold cursor-pointer ${U.bg} ${U.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-current animate-pulse" }),
                /* @__PURE__ */ e.jsx("span", { children: U.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(ge, { children: /* @__PURE__ */ e.jsxs(ye, { sideOffset: 6, align: "start", className: `${Je} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            na.map((C) => {
              const w = Ye[C], g = (n ?? t.status) === C;
              return /* @__PURE__ */ e.jsx(At, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => o("status", C),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${g ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${w.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: w.label }),
                    g && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, C);
            })
          ] }) })
        ] }),
        /* @__PURE__ */ e.jsxs(be, { children: [
          /* @__PURE__ */ e.jsx(he, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] border border-default text-[12px] font-semibold cursor-pointer ${q.bg} ${q.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${q.icon} text-[10px]` }),
                /* @__PURE__ */ e.jsx("span", { children: q.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(ge, { children: /* @__PURE__ */ e.jsxs(ye, { sideOffset: 6, align: "start", className: `${Je} w-[184px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
            Qa.map((C) => {
              const w = lt[C], g = (i ?? t.priority) === C;
              return /* @__PURE__ */ e.jsx(At, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => o("priority", C),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${g ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${w.icon} text-[11px] w-[13px]` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: w.label }),
                    g && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, C);
            })
          ] }) })
        ] }),
        f && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 h-[26px] px-2.5 rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11.5px] font-semibold", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-eye text-[10px]" }),
          "Takip ediliyor"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
        /* @__PURE__ */ e.jsx(
          "div",
          {
            ref: Q,
            contentEditable: !0,
            suppressContentEditableWarning: !0,
            spellCheck: !1,
            onBlur: (C) => o("title", C.currentTarget.textContent.trim()),
            className: "text-[24px] lt-560:text-[20px] font-extrabold tracking-[-.025em] leading-[1.2] text-text-primary px-2 -ml-2 py-[3px] rounded-[9px] border border-transparent cursor-text min-w-[60px] hover:bg-neutral-subtle hover:border-subtle focus:bg-neutral-subtle focus:border-focus focus:shadow-focus focus:outline-none",
            children: p ?? t.title ?? "Başlıksız görev"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: x,
            title: c ? "Favorilerden çıkar" : "Favorilere ekle",
            className: `flex items-center justify-center h-8 w-8 shrink-0 rounded-[9px] cursor-pointer ${c ? "bg-warning-subtle text-warning" : "text-text-tertiary hover:bg-surface-hover"}`,
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-${c ? "solid" : "regular"} fa-star text-[15px]` })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
      /* @__PURE__ */ e.jsx("div", { className: "lt-860:hidden", children: /* @__PURE__ */ e.jsx(
        js,
        {
          isPrivate: d ?? !!t.isPrivate,
          onChange: (C) => o("isPrivate", C)
        }
      ) }),
      /* @__PURE__ */ e.jsx("div", { className: "h-5 w-px bg-border-default mx-1" }),
      a === "modal" && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: l,
          title: r ? "Küçült" : "Tam ekran",
          className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${r ? "bg-primary-subtle text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r ? "fa-compress" : "fa-expand"} text-[12px]` })
        }
      ),
      /* @__PURE__ */ e.jsxs(be, { open: H, onOpenChange: _, children: [
        /* @__PURE__ */ e.jsx(he, { asChild: !0, children: /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            title: "Diğer seçenekler",
            className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${H ? "bg-surface-hover text-text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
          }
        ) }),
        /* @__PURE__ */ e.jsx(ge, { children: /* @__PURE__ */ e.jsxs(ye, { sideOffset: 6, align: "end", className: `${Je} w-[244px]`, children: [
          k.map((C) => /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: C.onClick,
              className: [
                ws,
                C.danger ? "text-negative" : "text-text-secondary",
                C.separator ? "border-t border-subtle mt-[5px]" : ""
              ].join(" "),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${C.icon} text-[11px] w-[14px] opacity-75` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: C.label }),
                C.kbd && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: C.kbd })
              ]
            },
            C.label
          )),
          /* @__PURE__ */ e.jsxs("div", { className: "mt-1.5 pt-[9px] px-[9px] pb-[7px] border-t border-subtle", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-keyboard text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-[.09em] text-text-tertiary", children: "Kısayollar" })
            ] }),
            Ns.map((C) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: C.what }),
              /* @__PURE__ */ e.jsx(ks, { children: C.key })
            ] }, C.what))
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
const Xe = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", Lt = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function Ne({ children: t }) {
  return /* @__PURE__ */ e.jsx(Zt, { asChild: !0, children: t });
}
function me({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[7px] min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.08em] text-text-tertiary select-none", children: t }),
    a
  ] });
}
function zt({ name: t, size: a = 26 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-white font-bold",
      style: { height: a, width: a, background: Ke(t), fontSize: a * 0.38 },
      children: Be(t)
    }
  );
}
function Bt(t) {
  if (t == null) return "—";
  const a = Math.max(0, Math.round(Number(t) * 60)), s = Math.floor(a / 60), r = a % 60;
  return s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function Ts({
  task: t = {},
  assigneeOptions: a = [],
  projectOptions: s = [],
  onFieldChange: r = () => {
  },
  statusValue: l,
  assigneeValue: o,
  projectValue: n,
  dueDateValue: i,
  startDateValue: p,
  tagsValue: d = [],
  progressPercent: c = 0,
  progressNote: x = "",
  onOpenTransfer: f
}) {
  var J, M;
  const [m, b] = u.useState(""), [h, y] = u.useState(""), [j, D] = u.useState(""), [A, R] = u.useState(!1), F = ze(l ?? t.status), B = o ?? t.assigneeId ?? null, H = n ?? t.projectId ?? null, _ = ((J = a.find((k) => k.value === B)) == null ? void 0 : J.label) || t.assigneeName || "Atanmamış", Q = ((M = s.find((k) => k.value === H)) == null ? void 0 : M.label) || t.projectName || "Projesiz", U = Za(i ?? t.dueDate), q = a.filter(
    (k) => !m || k.label.toLowerCase().includes(m.toLowerCase())
  ), Z = s.filter(
    (k) => !h || k.label.toLowerCase().includes(h.toLowerCase())
  ), ee = () => {
    const k = j.trim();
    k && !d.includes(k) && r("tagNames", [...d, k]), D(""), R(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6", children: [
    /* @__PURE__ */ e.jsx(me, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(be, { children: [
      /* @__PURE__ */ e.jsx(he, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx(zt, { name: B ? _ : null }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: _ }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ge, { children: /* @__PURE__ */ e.jsxs(ye, { sideOffset: 6, align: "start", className: `${Xe} w-[264px]`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: m,
              onChange: (k) => b(k.target.value),
              placeholder: "Kişi ara…",
              className: Lt
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[230px] overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
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
          q.map((k) => /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("assigneeId", k.value),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${B === k.value ? "bg-primary-subtle" : "hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx(zt, { name: k.label, size: 24 }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: k.label }),
                B === k.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
              ]
            }
          ) }, k.value))
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ e.jsxs(me, { label: "Son tarih", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
        /* @__PURE__ */ e.jsx("i", { className: `fa-regular fa-calendar text-[13px] ${U.tone}` }),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "date",
            value: (i ?? t.dueDate ?? "").slice(0, 10),
            onChange: (k) => r("dueDate", k.target.value),
            className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
          }
        )
      ] }),
      U.hint && /* @__PURE__ */ e.jsx("span", { className: `-mt-0.5 text-[10.5px] font-semibold ${U.tone}`, children: U.hint })
    ] }),
    /* @__PURE__ */ e.jsx(me, { label: "Başlangıç", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[13px] text-text-tertiary" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          value: (p ?? t.startDate ?? "").slice(0, 10),
          onChange: (k) => r("startDate", k.target.value),
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
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-medium text-text-tertiary", children: x })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "h-1.5 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "h-full rounded-full bg-primary transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
          style: { width: `${c}%` }
        }
      ) })
    ] }) }),
    /* @__PURE__ */ e.jsx(me, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(be, { children: [
      /* @__PURE__ */ e.jsx(he, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${F.bg} ${F.fg}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${F.icon} text-[11px]` }),
            /* @__PURE__ */ e.jsx("span", { children: F.label }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ge, { children: /* @__PURE__ */ e.jsxs(ye, { sideOffset: 6, align: "start", className: `${Xe} w-[196px]`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
        na.map((k) => {
          const C = Ye[k], w = (l ?? t.status) === k;
          return /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("status", k),
              className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${w ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${C.dot}` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: C.label }),
                w && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
              ]
            }
          ) }, k);
        })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(me, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap min-h-8", children: [
      d.map((k) => /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "inline-flex items-center gap-1.5 h-6 px-2 rounded-[7px] border border-primary bg-primary-subtle text-primary text-[11.5px] font-bold",
          children: [
            /* @__PURE__ */ e.jsx("span", { children: k }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Etiketi kaldır",
                onClick: () => r("tagNames", d.filter((C) => C !== k)),
                className: "flex items-center p-0 border-0 bg-transparent text-current opacity-55 hover:opacity-100 hover:text-negative cursor-pointer",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
              }
            )
          ]
        },
        k
      )),
      A ? /* @__PURE__ */ e.jsx(
        "input",
        {
          autoFocus: !0,
          type: "text",
          value: j,
          onChange: (k) => D(k.target.value),
          onBlur: ee,
          onKeyDown: (k) => {
            k.key === "Enter" && ee(), k.key === "Escape" && (D(""), R(!1));
          },
          placeholder: "Etiket…",
          className: "h-6 w-24 px-2 rounded-[7px] border border-focus bg-surface-base text-text-primary text-[11.5px] shadow-focus focus:outline-none"
        }
      ) : /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          "aria-label": "Yeni etiket ekle",
          onClick: () => R(!0),
          className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-dashed border-strong bg-transparent text-text-tertiary text-[11.5px] font-semibold hover:border-focus hover:text-primary hover:bg-primary-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[9px]" }),
            "Etiket"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(me, { label: "Proje", children: /* @__PURE__ */ e.jsxs(be, { children: [
      /* @__PURE__ */ e.jsx(he, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-[13px] text-text-tertiary" }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: Q }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ge, { children: /* @__PURE__ */ e.jsxs(ye, { sideOffset: 6, align: "start", className: `${Xe} w-[250px]`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: h,
              onChange: (k) => y(k.target.value),
              placeholder: "Proje ara…",
              className: Lt
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[210px] overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("projectId", null),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${H ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-neutral-400" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Projesiz" })
              ]
            }
          ) }),
          Z.map((k) => /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("projectId", k.value),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${H === k.value ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-primary" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: k.label }),
                H === k.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
              ]
            }
          ) }, k.value))
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-[7px] pt-[7px] border-t border-subtle", children: [
          /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => f == null ? void 0 : f("move"),
              className: "flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left text-text-secondary hover:bg-surface-hover hover:text-primary cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[11px] w-[14px] opacity-70" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Başka projeye taşı…" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => f == null ? void 0 : f("copy"),
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
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[13px] font-bold text-text-primary", children: Bt(t.spentHours ?? 0) }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[12px] text-text-tertiary", children: [
        "/ ",
        t.estimatedHours != null ? Bt(t.estimatedHours) : "—"
      ] })
    ] }) })
  ] }) });
}
function Ds({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: l,
  onDragEnd: o,
  onReorderTo: n,
  onReorderDrop: i,
  onOpenPicker: p,
  counts: d = {},
  isDirty: c = !1
}) {
  const [x, f] = u.useState(!1);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-6 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 py-2.5 flex-1 min-w-0 overflow-x-auto custom-scrollbar", children: [
      s.map((m) => {
        const b = t === m.code, h = d[m.code] || 0;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            draggable: !0,
            title: "Sürükleyerek sırayı değiştirin",
            onClick: () => a(m.code),
            onDragStart: (y) => {
              l(m.code);
              try {
                y.dataTransfer.effectAllowed = "move", y.dataTransfer.setData("text/plain", m.code);
              } catch {
              }
            },
            onDragOver: (y) => {
              y.preventDefault(), n(m.code);
            },
            onDrop: (y) => {
              y.preventDefault(), i == null || i();
            },
            onDragEnd: o,
            className: [
              "flex shrink-0 items-center gap-2 h-[34px] px-[13px] rounded-[10px]",
              "text-[12.5px] whitespace-nowrap cursor-grab active:cursor-grabbing",
              "transition-opacity duration-fast",
              b ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
              r === m.code ? "opacity-35" : "opacity-100"
            ].join(" "),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${m.icon} text-[11px] opacity-85` }),
              /* @__PURE__ */ e.jsx("span", { children: m.title }),
              h > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                "rounded-full text-[10px] font-extrabold",
                b ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
              ].join(" "), children: h })
            ]
          },
          m.code
        );
      }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          title: "Özellik ekle",
          onClick: () => {
            f(!1), p();
          },
          onMouseEnter: () => f(!0),
          onMouseLeave: () => f(!1),
          className: [
            "flex shrink-0 items-center gap-[7px] h-[34px] ml-1 rounded-[10px]",
            "border border-dashed border-primary bg-primary-subtle text-primary",
            "text-[12.5px] font-bold whitespace-nowrap cursor-pointer",
            "hover:border-solid",
            "transition-[padding] duration-[160ms] ease-[cubic-bezier(.16,1,.3,1)]",
            x ? "px-[13px]" : "px-[11px]"
          ].join(" "),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            x && /* @__PURE__ */ e.jsx("span", { className: "animate-fade-in-fast", children: "Özellik ekle" })
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
function Ss({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: l,
  onDragEnd: o,
  onReorderTo: n,
  onReorderDrop: i,
  onOpenPicker: p,
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
          const x = t === c.code, f = d[c.code] || 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              draggable: !0,
              title: "Sürükleyerek sırayı değiştirin",
              onClick: () => a(c.code),
              onDragStart: (m) => {
                l(c.code);
                try {
                  m.dataTransfer.effectAllowed = "move", m.dataTransfer.setData("text/plain", c.code);
                } catch {
                }
              },
              onDragOver: (m) => {
                m.preventDefault(), n(c.code);
              },
              onDrop: (m) => {
                m.preventDefault(), i == null || i();
              },
              onDragEnd: o,
              className: [
                "flex shrink-0 items-center gap-[11px] h-9 px-[11px] rounded-[9px]",
                "text-[12.5px] text-left cursor-grab active:cursor-grabbing",
                "transition-opacity duration-fast",
                x ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
                r === c.code ? "opacity-35" : "opacity-100"
              ].join(" "),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c.icon} text-[12px] w-[15px] opacity-85` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: c.title }),
                f > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                  "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                  "rounded-full text-[10px] font-extrabold",
                  x ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
                ].join(" "), children: f })
              ]
            },
            c.code
          );
        }),
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: p,
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
function Te({ label: t, value: a, avatarName: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 py-[9px] border-t border-subtle", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-tertiary shrink-0", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
      s && /* @__PURE__ */ e.jsx(
        "span",
        {
          className: "flex shrink-0 items-center justify-center h-[21px] w-[21px] rounded-full text-white text-[8.5px] font-bold",
          style: { background: Ke(s) },
          children: Be(s)
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", title: typeof a == "string" ? a : void 0, children: a || "—" })
    ] })
  ] });
}
const Kt = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "—";
function $s({ task: t = {}, nameById: a }) {
  const s = (o, n) => {
    var i;
    return o || n && ((i = a == null ? void 0 : a.get) == null ? void 0 : i.call(a, n)) || null;
  }, r = s(t.creatorName, t.creatorId), l = t.lastModificationTime ? s(t.lastModifierName, t.lastModifierId) : null;
  return /* @__PURE__ */ e.jsx("aside", { className: "flex flex-col gap-3.5 min-w-0", children: /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsx(Te, { label: "Oluşturan", value: r || "Bilinmiyor", avatarName: r }),
    /* @__PURE__ */ e.jsx(Te, { label: "Oluşturma tarihi", value: Kt(t.creationTime) }),
    /* @__PURE__ */ e.jsx(Te, { label: "Güncelleyen", value: l || "—", avatarName: l }),
    /* @__PURE__ */ e.jsx(Te, { label: "Son güncelleme", value: Kt(t.lastModificationTime) }),
    /* @__PURE__ */ e.jsx(Te, { label: "Görev tipi", value: t.taskType }),
    /* @__PURE__ */ e.jsx(Te, { label: "Sprint", value: t.sprint })
  ] }) });
}
const Es = [
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
], Ps = '<table class="apya-rte-table"><tr><th>Kolon 1</th><th>Kolon 2</th></tr><tr><td>Değer</td><td>Değer</td></tr></table><p><br></p>', Is = '<div class="apya-rte-imgph">görsel yer tutucu</div><p><br></p>';
function As(t) {
  return t ? /<[a-z][\s\S]*>/i.test(t) ? t : `<p>${t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>` : "";
}
function Ls({ value: t, onChange: a, mentionName: s = "ekip arkadaşı" }) {
  const r = u.useRef(null), l = u.useRef(As(t)), [o, n] = u.useState(!1), [i, p] = u.useState("https://"), d = u.useRef(null), c = (y, j) => {
    var D, A;
    (D = r.current) == null || D.focus();
    try {
      document.execCommand(y, !1, j);
    } catch {
    }
    a == null || a(((A = r.current) == null ? void 0 : A.innerHTML) ?? "");
  }, x = () => {
    const y = window.getSelection();
    d.current = y && y.rangeCount ? y.getRangeAt(0).cloneRange() : null;
  }, f = () => {
    const y = d.current;
    if (!y) return;
    const j = window.getSelection();
    j.removeAllRanges(), j.addRange(y);
  }, m = () => {
    var j;
    const y = i.trim();
    n(!1), !(!y || y === "https://") && ((j = r.current) == null || j.focus(), f(), c("createLink", y), p("https://"));
  }, b = (y) => {
    switch (y.cmd) {
      case "link":
        x(), n(!0);
        return;
      case "image":
        c("insertHTML", Is);
        return;
      case "table":
        c("insertHTML", Ps);
        return;
      case "mention":
        c("insertHTML", `<span class="apya-rte-mention">@${s}</span>&nbsp;`);
        return;
      default:
        c(y.cmd, y.arg);
    }
  }, h = "flex shrink-0 items-center justify-center h-7 w-7 rounded-[7px] border-0 bg-transparent text-text-secondary cursor-pointer hover:bg-surface-base hover:text-primary hover:shadow-xs";
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-[14px] border border-default bg-surface-base overflow-hidden shadow-xs", children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-0.5 px-2 py-1.5 border-b border-subtle bg-neutral-subtle overflow-x-auto custom-scrollbar", children: Es.map((y) => {
      const j = /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          title: y.title,
          onMouseDown: (D) => {
            D.preventDefault(), b(y);
          },
          className: `${h} ${y.gap ? "ml-1.5" : ""}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${y.regular ? "regular" : "solid"} ${y.icon} text-[12px]` })
        },
        y.cmd + y.icon
      );
      return y.cmd !== "link" ? j : /* @__PURE__ */ e.jsxs(be, { open: o, onOpenChange: n, children: [
        /* @__PURE__ */ e.jsx(he, { asChild: !0, children: j }),
        /* @__PURE__ */ e.jsx(ge, { children: /* @__PURE__ */ e.jsxs(
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
                    value: i,
                    onChange: (D) => p(D.target.value),
                    onKeyDown: (D) => {
                      D.key === "Enter" && m();
                    },
                    className: "flex-1 min-w-0 h-[34px] px-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: m,
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
        onInput: (y) => a == null ? void 0 : a(y.currentTarget.innerHTML),
        className: "apya-rte-surface min-h-[150px] p-4 text-[13.5px] leading-[1.7] text-text-primary bg-surface-base focus:outline-none",
        dangerouslySetInnerHTML: { __html: l.current }
      }
    )
  ] });
}
const Rt = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
function et({ name: t, size: a = 32 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-white font-bold",
      style: { height: a, width: a, background: Ke(t), fontSize: a * 0.34 },
      children: Be(t)
    }
  );
}
function Mt({ open: t, onClick: a }) {
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
const Ft = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function zs({
  task: t = {},
  onFieldChange: a = () => {
  },
  descriptionValue: s,
  checklist: r,
  currentUserName: l = "Ben"
}) {
  const o = t == null ? void 0 : t.id, n = le(), [i, p] = u.useState(!0), [d, c] = u.useState(""), x = (r == null ? void 0 : r.items) ?? [], f = x.filter((g) => g.isDone).length, m = x.length ? Math.round(f / x.length * 100) : 0, b = async () => {
    var S, $, E;
    const g = d.trim();
    if (!(!g || !o)) {
      c("");
      try {
        await r.addItem(g);
      } catch (V) {
        (E = ($ = (S = window == null ? void 0 : window.abp) == null ? void 0 : S.notify) == null ? void 0 : $.error) == null || E.call($, (V == null ? void 0 : V.message) || "Madde eklenemedi.");
      }
    }
  }, [h, y] = u.useState(!0), [j, D] = u.useState(""), [A, R] = u.useState(!1), [F, B] = u.useState(!1), [H, _] = u.useState(null), [Q, U] = u.useState(""), [q, Z] = u.useState({}), { data: ee = [] } = ie({
    queryKey: ["task-comments", o],
    queryFn: () => {
      var g, S, $, E;
      return Promise.resolve((E = ($ = (S = (g = window == null ? void 0 : window.apya) == null ? void 0 : g.platform) == null ? void 0 : S.tasks) == null ? void 0 : $.task) == null ? void 0 : E.getComments(o));
    },
    enabled: !!o,
    staleTime: 1e4
  }), J = async () => {
    await n.invalidateQueries({ queryKey: ["task-comments", o] }), await n.invalidateQueries({ queryKey: ["task-detail", o] });
  }, M = async () => {
    var S, $, E;
    const g = j.trim();
    if (!(!g || !o || F)) {
      B(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.addComment(o, g)), await J(), D("");
      } catch (V) {
        (E = ($ = (S = window == null ? void 0 : window.abp) == null ? void 0 : S.notify) == null ? void 0 : $.error) == null || E.call($, (V == null ? void 0 : V.message) || "Yorum gönderilemedi.");
      } finally {
        B(!1);
      }
    }
  }, k = async (g) => {
    var $, E, V;
    const S = Q.trim();
    if (!(!S || !o))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.replyToComment(g, S)), await J(), U(""), _(null);
      } catch (oe) {
        (V = (E = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : E.error) == null || V.call(E, (oe == null ? void 0 : oe.message) || "Yanıt gönderilemedi.");
      }
  }, C = (g) => Z((S) => {
    const $ = S[g] ?? { liked: !1, count: 0 };
    return { ...S, [g]: { liked: !$.liked, count: $.count + ($.liked ? -1 : 1) } };
  }), w = !!j.trim() && !F;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-[9px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Açıklama" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Zengin metin · WYSIWYG" })
      ] }),
      /* @__PURE__ */ e.jsx(
        Ls,
        {
          value: s ?? t.description ?? "",
          onChange: (g) => a("description", g),
          mentionName: l
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: Rt, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
            f,
            "/",
            x.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(Mt, { open: i, onClick: () => p((g) => !g) })
      ] }),
      i && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 mt-3.5", children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
            style: { width: `${m}%` }
          }
        ) }),
        x.map((g) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              "aria-label": g.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
              onClick: () => r.toggleItem(g.id).catch((S) => {
                var $, E, V;
                return (V = (E = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : E.error) == null ? void 0 : V.call(E, (S == null ? void 0 : S.message) || "Durum güncellenemedi.");
              }),
              className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white cursor-pointer transition-colors duration-fast ${g.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
              children: g.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${g.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: g.text }),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              onClick: () => r.removeItem(g.id).catch((S) => {
                var $, E, V;
                return (V = (E = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : E.error) == null ? void 0 : V.call(E, (S == null ? void 0 : S.message) || "Madde silinemedi.");
              }),
              className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
            }
          )
        ] }, g.id)),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            value: d,
            onChange: (g) => c(g.target.value),
            onKeyDown: (g) => {
              g.key === "Enter" && b();
            },
            placeholder: "Yeni madde yaz ve Enter'a bas…",
            className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: Rt, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Yorumlar & güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: ee.length })
        ] }),
        /* @__PURE__ */ e.jsx(Mt, { open: h, onClick: () => y((g) => !g) })
      ] }),
      h && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(et, { name: l }),
          /* @__PURE__ */ e.jsxs("div", { className: `flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${A ? "border-focus bg-surface-base shadow-focus" : "border-default bg-surface-raised"}`, children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                rows: 2,
                value: j,
                onChange: (g) => D(g.target.value),
                onFocus: () => R(!0),
                onBlur: () => R(!1),
                onKeyDown: (g) => {
                  g.key === "Enter" && (g.ctrlKey || g.metaKey) && (g.preventDefault(), M());
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
              ].map((g) => /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  title: g.title,
                  onMouseDown: (S) => S.preventDefault(),
                  onClick: () => D((S) => S + g.add),
                  className: "flex items-center justify-center h-7 w-7 rounded-[7px] text-text-tertiary hover:bg-surface-hover hover:text-primary cursor-pointer",
                  children: /* @__PURE__ */ e.jsx("i", { className: `${g.icon} text-[12px]` })
                },
                g.title
              )) }),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: M,
                  disabled: !w,
                  className: `flex items-center gap-[7px] h-[30px] px-3.5 rounded-[9px] text-[12px] font-bold shadow-xs ${w ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${F ? "fa-circle-notch fa-spin" : "fa-paper-plane"} text-[10px]` }),
                    "Gönder"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1", children: ee.map((g) => {
          const S = q[g.id] ?? { liked: !1, count: 0 };
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start py-3 border-t border-subtle", children: [
            /* @__PURE__ */ e.jsx(et, { name: g.authorName }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: g.authorName }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: Ft(g.creationTime) })
              ] }),
              /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[13px] leading-[1.65] text-text-secondary whitespace-pre-wrap", children: g.text }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 mt-[3px]", children: [
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => C(g.id),
                    className: `flex items-center gap-1.5 h-[26px] px-[9px] rounded-full border text-[11px] font-semibold cursor-pointer ${S.liked ? "border-primary bg-primary-subtle text-primary" : "border-default bg-transparent text-text-tertiary hover:border-focus"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-thumbs-up text-[10px]" }),
                      S.count
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      _(($) => $ === g.id ? null : g.id), U("");
                    },
                    className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-full text-text-tertiary text-[11px] font-semibold hover:bg-surface-hover hover:text-primary cursor-pointer",
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                      "Yanıtla"
                    ]
                  }
                )
              ] }),
              H === g.id && /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 mt-2 animate-fade-in-fast", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: Q,
                    onChange: ($) => U($.target.value),
                    onKeyDown: ($) => {
                      $.key === "Enter" && k(g.id);
                    },
                    placeholder: `@${g.authorName} kullanıcısına yanıt ver…`,
                    className: "flex-1 h-8 px-3 rounded-[9px] border border-focus bg-surface-base text-text-primary text-[12px] shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => k(g.id),
                    className: "h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover",
                    children: "Yanıtla"
                  }
                )
              ] }),
              (g.replies ?? []).map(($) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] mt-2.5 pl-3 border-l-2 border-default", children: [
                /* @__PURE__ */ e.jsx(et, { name: $.authorName, size: 24 }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: $.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: Ft($.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-[3px] mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: $.text })
                ] })
              ] }, $.id))
            ] })
          ] }, g.id);
        }) })
      ] })
    ] })
  ] });
}
function Bs({
  lastSavedAt: t,
  isDirty: a,
  isSaving: s,
  justSaved: r,
  onCancel: l,
  onSave: o
}) {
  const n = t ? new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(t)) : "—", i = s ? "fa-solid fa-circle-notch fa-spin" : r ? "fa-solid fa-check" : "fa-regular fa-floppy-disk", p = s ? "Kaydediliyor…" : r ? "Kaydedildi" : "Kaydet", d = a && !s;
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
          onClick: l,
          className: "h-9 px-4 rounded-[10px] border border-default bg-surface-base text-text-secondary text-[13px] font-semibold hover:bg-surface-hover hover:text-text-primary cursor-pointer",
          children: "Vazgeç"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: o,
          disabled: !d,
          className: `flex items-center gap-2 h-9 px-[22px] rounded-[10px] text-white text-[13px] font-bold shadow-sm ${d ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `${i} text-[11px]` }),
            p
          ]
        }
      )
    ] })
  ] });
}
const Ks = Object.fromEntries(Re.map((t) => [t.code, t])), Rs = {
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
}, Ms = [
  { title: "GÖREV & PLANLAMA", codes: ["checklist", "gantt", "time-tracking", "dependencies", "risks", "approvals", "dashboard"] },
  { title: "İLETİŞİM", codes: ["comments", "emails"] },
  { title: "GEÇMİŞ & FİNANS", codes: ["activity", "history", "finance", "gallery"] },
  { title: "İLERİ ÖZELLİKLER & YAPAY ZEKA", codes: ["ai", "automations", "custom-fields"] }
], Fs = /* @__PURE__ */ new Set([
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
]), Gs = (t) => Fs.has(t);
function ma(t) {
  const a = Ks[t], s = Rs[t];
  return a ? {
    code: t,
    title: a.title,
    icon: a.icon,
    desc: (s == null ? void 0 : s.desc) ?? "",
    bg: (s == null ? void 0 : s.bg) ?? "bg-neutral-subtle",
    fg: (s == null ? void 0 : s.fg) ?? "text-text-secondary"
  } : null;
}
function Os(t = "") {
  const a = t.trim().toLowerCase();
  return Ms.map((s) => ({
    title: s.title,
    items: s.codes.map(ma).filter(Boolean).filter((r) => !a || r.title.toLowerCase().includes(a) || r.desc.toLowerCase().includes(a))
  })).filter((s) => s.items.length > 0);
}
const Gt = Re.length;
function Ot({ code: t, onRemoveFeature: a, onOpenPicker: s, canRemove: r = !0 }) {
  const l = ma(t) ?? { title: t, desc: "", icon: "fa-cube", bg: "bg-neutral-subtle", fg: "text-text-secondary" };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-3 py-14 px-6 rounded-2xl border border-dashed border-strong bg-surface-base text-center", children: [
    /* @__PURE__ */ e.jsx("span", { className: `flex items-center justify-center h-14 w-14 rounded-2xl ${l.bg} ${l.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l.icon} text-[22px]` }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-w-[420px]", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: l.title }),
      l.desc && /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] leading-[1.6] text-text-secondary", children: l.desc }),
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
function qs({
  open: t,
  onClose: a,
  assignedCodes: s = [],
  onAddFeature: r,
  onGoToTab: l
}) {
  const [o, n] = u.useState("");
  if (u.useEffect(() => {
    t || n("");
  }, [t]), !t) return null;
  const i = new Set(s), p = Os(o), d = s.length + 3, c = (x) => {
    if (i.has(x)) {
      l == null || l(x), a == null || a();
      return;
    }
    r == null || r(x), a == null || a();
  };
  return ct.createPortal(
    /* @__PURE__ */ e.jsx(
      "div",
      {
        "data-apya-overlay": !0,
        className: "fixed inset-0 z-modal flex items-center justify-center p-6 bg-surface-overlay backdrop-blur-sm animate-fade-in-fast",
        onClick: a,
        role: "presentation",
        children: /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "Özellik ekle",
            onClick: (x) => x.stopPropagation(),
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
                    value: o,
                    onChange: (x) => n(x.target.value),
                    placeholder: `${Gt} özellik arasında ara (Gantt, Finans, Risk, AI…)`,
                    className: "w-full h-[42px] pl-9 pr-3.5 rounded-xl border border-default bg-neutral-subtle text-text-primary text-[13px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                )
              ] }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col gap-5 px-[22px] pt-3 pb-[22px] overflow-y-auto custom-scrollbar", children: [
                p.map((x) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[11px]", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.1em] text-text-tertiary", children: x.title }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 h-px bg-subtle" })
                  ] }),
                  /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[11px]", children: x.items.map((f) => {
                    const m = i.has(f.code);
                    return /* @__PURE__ */ e.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => c(f.code),
                        className: `group flex items-start gap-3 p-3.5 rounded-[15px] border text-left cursor-pointer hover:border-focus hover:shadow-md ${m ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                        children: [
                          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-10 w-10 rounded-xl ${f.bg} ${f.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${f.icon} text-[15px]` }) }),
                          /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-[3px] min-w-0 flex-1", children: [
                            /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-between gap-2", children: [
                              /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: f.title }),
                              /* @__PURE__ */ e.jsx("span", { className: `shrink-0 text-[10.5px] font-extrabold ${m ? "text-primary" : "text-text-tertiary"}`, children: m ? "✓ Ekli" : "Ekle →" })
                            ] }),
                            /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] leading-[1.5] text-text-tertiary", children: f.desc })
                          ] })
                        ]
                      },
                      f.code
                    );
                  }) })
                ] }, x.title)),
                p.length === 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 py-12 text-center", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass text-3xl text-text-tertiary mb-2" }),
                  /* @__PURE__ */ e.jsx("p", { className: "m-0 text-sm font-semibold text-text-primary", children: "Eşleşen özellik bulunamadı" }),
                  /* @__PURE__ */ e.jsx("p", { className: "m-0 text-xs text-text-tertiary", children: "Lütfen farklı bir arama terimi deneyin." })
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-[22px] py-3.5 border-t border-subtle bg-surface-raised text-[11.5px] text-text-tertiary", children: [
                /* @__PURE__ */ e.jsxs("span", { children: [
                  "Toplam ",
                  Gt,
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
    ),
    document.body
  );
}
const _s = [
  { key: "subtasks", label: "Alt görevler", countKey: "subtasks", unit: "alt görev" },
  { key: "checklist", label: "Kontrol listesi", countKey: "checklist", unit: "madde" },
  { key: "comments", label: "Yorumlar", countKey: "comments", unit: "yorum" },
  { key: "files", label: "Dosyalar", countKey: "files", unit: "dosya" },
  { key: "keepAssignee", label: "Sorumluyu koru", desc: "Aksi halde atanmamış gelir" },
  { key: "keepLinks", label: "Bağımlılıkları koru", desc: "Öncül / ardıl bağlantılar" },
  { key: "shiftDates", label: "Tarihleri bugüne kaydır", desc: "Başlangıç ve son tarih ötelenir" }
], qt = {
  subtasks: !0,
  checklist: !0,
  comments: !1,
  files: !0,
  keepAssignee: !0,
  keepLinks: !0,
  shiftDates: !1
};
function Us({ on: t, onClick: a, label: s }) {
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
function Ys({
  open: t,
  mode: a = "move",
  onClose: s,
  onConfirm: r,
  projectOptions: l = [],
  currentProjectId: o,
  counts: n = {},
  onCreateProject: i
}) {
  const [p, d] = u.useState(a), [c, x] = u.useState([]), [f, m] = u.useState(""), [b, h] = u.useState(""), [y, j] = u.useState(qt), [D, A] = u.useState(!1);
  u.useEffect(() => {
    t && (d(a), x([]), m(""), h(""), j(qt));
  }, [t, a]);
  const R = u.useMemo(
    () => l.filter((w) => w.value && w.value !== o),
    [l, o]
  ), F = R.filter((w) => !f || w.label.toLowerCase().includes(f.toLowerCase())), B = R.length > 0 && c.length === R.length;
  if (!t) return null;
  const H = (w) => x((g) => g.includes(w) ? g.filter((S) => S !== w) : [...g, w]), _ = (w) => {
    var g;
    return ((g = l.find((S) => S.value === w)) == null ? void 0 : g.label) ?? "";
  }, Q = async () => {
    var g, S, $;
    const w = b.trim();
    if (!(!w || D)) {
      A(!0);
      try {
        const E = await (i == null ? void 0 : i(w));
        E && x((V) => [...V, E]), h("");
      } catch (E) {
        ($ = (S = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : S.error) == null || $.call(S, (E == null ? void 0 : E.message) || "Proje oluşturulamadı.");
      } finally {
        A(!1);
      }
    }
  }, U = async () => {
    if (!(!c.length || D)) {
      A(!0);
      try {
        await (r == null ? void 0 : r({ mode: p, targetProjectIds: c, include: y }));
      } finally {
        A(!1);
      }
    }
  }, q = p === "move", Z = c.length, ee = q ? Z > 1 ? "Taşı ve kopyala" : "Taşı" : Z > 1 ? `${Z} projeye kopyala` : "Kopyala", J = Object.values(y).filter(Boolean).length, M = c.map(_).filter(Boolean), k = M.length ? `${M.length > 2 ? `${M.slice(0, 2).join(", ")} +${M.length - 2}` : M.join(", ")} · ${J} seçenek açık` : `Proje seçilmedi · ${J} seçenek açık`, C = (w) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${w ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return ct.createPortal(
    /* @__PURE__ */ e.jsx(
      "div",
      {
        "data-apya-overlay": !0,
        className: "fixed inset-0 z-modal flex items-center justify-center p-6 bg-surface-overlay backdrop-blur-sm animate-fade-in-fast",
        onClick: s,
        role: "presentation",
        children: /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "dialog",
            "aria-modal": "true",
            "aria-label": q ? "Başka projeye taşı" : "Başka projelere kopyala",
            onClick: (w) => w.stopPropagation(),
            className: "flex flex-col w-full max-w-[760px] max-h-[88vh] rounded-[20px] border border-default bg-surface-base shadow-xl overflow-hidden animate-dialog-in",
            children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-4 px-[22px] pt-5 pb-4 border-b border-subtle", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-10 w-10 rounded-[13px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-tree text-base" }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ e.jsx("h3", { className: "m-0 text-base font-extrabold tracking-[-.02em] text-text-primary", children: q ? "Başka projeye taşı" : "Başka projelere kopyala" }),
                    /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 mb-0 text-[12px] leading-[1.5] text-text-tertiary", children: q ? "Görev ilk seçtiğiniz projeye taşınır; birden fazla seçerseniz kalanlara kopya oluşturulur." : "Görevin kopyası seçtiğiniz her projede oluşturulur; bu görev yerinde kalır." })
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
                /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => d("move"), className: C(q), children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[10px]" }),
                  "Taşı"
                ] }),
                /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => d("copy"), className: C(!q), children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clone text-[10px]" }),
                  "Kopyala"
                ] })
              ] }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex-1 grid grid-cols-2 lt-860:grid-cols-1 gap-5 items-start px-[22px] pt-4 pb-5 overflow-y-auto custom-scrollbar", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px] min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5", children: [
                    /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.08em] text-text-tertiary", children: [
                      "Hedef projeler · ",
                      Z
                    ] }),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => x(B ? [] : R.map((w) => w.value)),
                        className: "p-0 border-0 bg-transparent text-primary text-[11px] font-bold cursor-pointer hover:underline",
                        children: B ? "Seçimi temizle" : "Tümünü seç"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
                    /* @__PURE__ */ e.jsx(
                      "input",
                      {
                        type: "text",
                        value: f,
                        onChange: (w) => m(w.target.value),
                        placeholder: "Proje ara…",
                        className: "w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar", children: [
                    F.map((w) => {
                      const g = c.includes(w.value), S = q && c[0] === w.value;
                      return /* @__PURE__ */ e.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => H(w.value),
                          className: `flex items-center gap-[11px] px-3 py-[11px] rounded-[11px] border text-left cursor-pointer hover:border-focus ${g ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                          children: [
                            /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] rounded-[5px] border-[1.5px] text-white ${g ? "bg-primary border-primary" : "bg-transparent border-strong"}`, children: g && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" }) }),
                            /* @__PURE__ */ e.jsx("span", { className: "h-2.5 w-2.5 shrink-0 rounded-[3px] bg-primary" }),
                            /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: w.label }),
                            S && /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center h-5 px-2 rounded-md bg-primary text-white text-[10px] font-extrabold", children: "TAŞINACAK" })
                          ]
                        },
                        w.value
                      );
                    }),
                    F.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "py-6 text-center text-[12px] text-text-tertiary", children: "Uygun proje bulunamadı." })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[7px] mt-1", children: [
                    /* @__PURE__ */ e.jsx(
                      "input",
                      {
                        type: "text",
                        value: b,
                        onChange: (w) => h(w.target.value),
                        onKeyDown: (w) => {
                          w.key === "Enter" && (w.preventDefault(), Q());
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
                        onClick: Q,
                        disabled: !b.trim() || D,
                        className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                        children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-plus text-[12px]" })
                      }
                    )
                  ] }),
                  q && Z > 1 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle", children: [
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
                  /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: _s.map((w) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised", children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-px", children: [
                      /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary", children: w.label }),
                      /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: w.countKey ? `${n[w.countKey] ?? 0} ${w.unit}` : w.desc })
                    ] }),
                    /* @__PURE__ */ e.jsx(
                      Us,
                      {
                        on: y[w.key],
                        label: w.label,
                        onClick: () => j((g) => ({ ...g, [w.key]: !g[w.key] }))
                      }
                    )
                  ] }, w.key)) })
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3.5 px-[22px] py-3.5 border-t border-subtle bg-surface-raised", children: [
                /* @__PURE__ */ e.jsx("span", { className: "min-w-0 truncate text-[11.5px] text-text-tertiary", children: k }),
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
                      onClick: U,
                      disabled: !Z || D,
                      className: `flex items-center gap-2 h-9 px-5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${Z && !D ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
                      children: [
                        /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${D ? "fa-circle-notch fa-spin" : "fa-arrow-right"} text-[10px]` }),
                        ee
                      ]
                    }
                  )
                ] })
              ] })
            ]
          }
        )
      }
    ),
    document.body
  );
}
const Hs = [
  { code: "general", title: "Genel", icon: "fa-circle-info" },
  { code: "checklist", title: "Kontrol", icon: "fa-square-check" },
  { code: "comments", title: "Yorumlar", icon: "fa-comments" },
  { code: "files", title: "Dosyalar", icon: "fa-paperclip" }
], Ie = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  img: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
};
function Vs(t = "") {
  var s;
  const a = (s = t.split(".").pop()) == null ? void 0 : s.toLowerCase();
  return a === "pdf" ? Ie.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(a) ? Ie.img : ["doc", "docx", "odt", "rtf"].includes(a) ? Ie.doc : ["json", "js", "ts", "cs", "xml", "yml", "yaml"].includes(a) ? Ie.code : Ie.other;
}
const Qs = (t) => t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toFixed(1)} MB` : "—", Zs = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—", Ws = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—";
function tt({ name: t, size: a = 22 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-white font-bold",
      style: { height: a, width: a, background: Ke(t), fontSize: a * 0.4 },
      children: Be(t)
    }
  );
}
function Oe({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: t }),
    a
  ] });
}
function Js({
  subtaskId: t,
  parentCode: a,
  onClose: s,
  onOpenFull: r,
  onDeleted: l,
  currentUserName: o = "Ben"
}) {
  var E, V, oe;
  const n = le(), { data: i } = dt(t), p = ut(t), d = da(t), [c, x] = u.useState("general"), [f, m] = u.useState(""), [b, h] = u.useState(""), [y, j] = u.useState(""), D = u.useRef(null), A = u.useRef(null);
  i && A.current !== i.id && (A.current = i.id, m(i.description ?? ""));
  const { data: R = [] } = ie({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var v, L, P, G;
      return Promise.resolve((G = (P = (L = (v = window == null ? void 0 : window.apya) == null ? void 0 : v.platform) == null ? void 0 : L.tasks) == null ? void 0 : P.task) == null ? void 0 : G.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4
  });
  if (u.useEffect(() => {
    const v = (L) => {
      L.key === "Escape" && (L.stopPropagation(), s == null || s());
    };
    return window.addEventListener("keydown", v), () => window.removeEventListener("keydown", v);
  }, [s]), !i) return null;
  const F = (oe = (V = (E = window == null ? void 0 : window.apya) == null ? void 0 : E.platform) == null ? void 0 : V.tasks) == null ? void 0 : oe.task, B = ze(i.status), H = ia(i.priority), _ = p.items ?? [], Q = _.filter((v) => v.isDone).length, U = _.length ? Math.round(Q / _.length * 100) : 0, q = d.attachments ?? [], Z = { checklist: _.length, comments: R.length, files: q.length }, ee = async () => {
    await n.invalidateQueries({ queryKey: ["task-detail", t] });
  }, J = async (v) => {
    var L, P, G;
    try {
      await Promise.resolve(F.update(i.id, {
        title: i.title,
        description: i.description ?? null,
        startDate: (i.startDate ?? "").slice(0, 10),
        dueDate: i.dueDate ? i.dueDate.slice(0, 10) : null,
        status: i.status,
        priority: i.priority,
        assigneeId: i.assigneeId ?? null,
        boardColumnId: i.boardColumnId ?? null,
        projectId: i.projectId ?? null,
        parentTaskId: i.parentTaskId ?? null,
        isPrivate: !!i.isPrivate,
        predecessorIds: i.predecessorIds ?? [],
        tagNames: (i.tags ?? []).map((Y) => Y.name),
        estimatedHours: i.estimatedHours ?? null,
        taskType: i.taskType ?? null,
        sprint: i.sprint ?? null,
        ...v
      })), await ee();
    } catch (Y) {
      (G = (P = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : P.error) == null || G.call(P, (Y == null ? void 0 : Y.message) || "Alt görev güncellenemedi.");
    }
  }, M = () => J({ status: i.status >= 4 ? 1 : i.status + 1 }), k = () => J({ priority: i.priority >= 4 ? 1 : i.priority + 1 }), C = () => {
    (i.description ?? "") !== f && J({ description: f || null });
  }, w = async () => {
    var L, P, G;
    const v = b.trim();
    if (v) {
      h("");
      try {
        await p.addItem(v);
      } catch (Y) {
        (G = (P = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : P.error) == null || G.call(P, (Y == null ? void 0 : Y.message) || "Madde eklenemedi.");
      }
    }
  }, g = async () => {
    var L, P, G;
    const v = y.trim();
    if (v) {
      j("");
      try {
        await Promise.resolve(F.addComment(i.id, v)), await n.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch (Y) {
        (G = (P = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : P.error) == null || G.call(P, (Y == null ? void 0 : Y.message) || "Yorum gönderilemedi.");
      }
    }
  }, S = async () => {
    var v, L, P;
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(F.delete(i.id)), l == null || l(i.id), s == null || s();
      } catch (G) {
        (P = (L = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : L.error) == null || P.call(L, (G == null ? void 0 : G.message) || "Alt görev silinemedi.");
      }
  }, $ = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
  return ct.createPortal(
    /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx(
        "div",
        {
          "data-apya-overlay": !0,
          className: "fixed inset-0 z-modal-backdrop bg-surface-overlay animate-fade-in-fast",
          onClick: s,
          role: "presentation"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "aside",
        {
          role: "dialog",
          "aria-modal": "true",
          "aria-label": `${i.code} alt görev detayı`,
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
                      onClick: () => r == null ? void 0 : r(i.id),
                      className: `${$} hover:bg-surface-hover hover:text-primary`,
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-up-right-from-square text-[11px]" })
                    }
                  ),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      title: "Alt görevi sil",
                      onClick: S,
                      className: `${$} hover:bg-negative-subtle hover:text-negative`,
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                    }
                  ),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      title: "Kapat",
                      onClick: s,
                      className: `${$} hover:bg-surface-hover hover:text-text-primary`,
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[13px]" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[7px] flex-wrap", children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[10.5px] font-bold tracking-[.04em]", children: i.code }),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: M,
                    title: "Durumu değiştir",
                    className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold cursor-pointer ${B.bg} ${B.fg}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${B.icon} text-[10px]` }),
                      B.label
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: k,
                    title: "Önceliği değiştir",
                    className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold cursor-pointer ${H.bg} ${H.fg}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${H.icon} text-[10px]` }),
                      H.label
                    ]
                  }
                ),
                (i.tags ?? []).map((v) => /* @__PURE__ */ e.jsx("span", { className: "flex items-center h-6 px-[9px] rounded-[7px] border border-default bg-neutral-subtle text-text-secondary text-[11px] font-semibold", children: v.name }, v.id ?? v.name))
              ] }),
              /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[18px] font-extrabold tracking-[-.02em] leading-[1.3] text-text-primary", children: i.title }),
              /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 pt-1", children: [
                /* @__PURE__ */ e.jsx(Oe, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
                  /* @__PURE__ */ e.jsx(tt, { name: i.assigneeName }),
                  /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", children: i.assigneeName || "Atanmamış" })
                ] }) }),
                /* @__PURE__ */ e.jsx(Oe, { label: "Son tarih", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] h-[22px] text-[12.5px] font-semibold text-text-primary", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[11px] text-text-tertiary" }),
                  Ws(i.dueDate)
                ] }) }),
                /* @__PURE__ */ e.jsx(Oe, { label: "Süre", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-[22px] font-mono text-[12.5px] font-bold text-text-primary", children: [
                  i.spentHours ?? 0,
                  "s",
                  /* @__PURE__ */ e.jsxs("span", { className: "font-medium text-text-tertiary", children: [
                    " / ",
                    i.estimatedHours != null ? `${i.estimatedHours}s` : "—"
                  ] })
                ] }) }),
                /* @__PURE__ */ e.jsx(Oe, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-1.5 pt-[3px]", children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
                    "%",
                    U
                  ] }),
                  /* @__PURE__ */ e.jsx("span", { className: "block h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("span", { className: "block h-full rounded-full bg-success", style: { width: `${U}%` } }) })
                ] }) })
              ] })
            ] }),
            /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: Hs.map((v) => {
              const L = c === v.code, P = Z[v.code] ?? 0;
              return /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => x(v.code),
                  className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${L ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${v.icon} text-[11px] opacity-85` }),
                    /* @__PURE__ */ e.jsx("span", { children: v.title }),
                    P > 0 && /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-neutral-subtle text-text-tertiary text-[10px] font-extrabold", children: P })
                  ]
                },
                v.code
              );
            }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar px-5 py-[18px] bg-surface-raised", children: [
              c === "general" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Açıklama" }),
                /* @__PURE__ */ e.jsx(
                  "textarea",
                  {
                    rows: 7,
                    value: f,
                    onChange: (v) => m(v.target.value),
                    onBlur: C,
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
                    Q,
                    "/",
                    _.length
                  ] })
                ] }),
                /* @__PURE__ */ e.jsx("div", { className: "h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-success", style: { width: `${U}%` } }) }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px] mt-1", children: [
                  _.map((v) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] border border-subtle bg-surface-base hover:border-default", children: [
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        "aria-label": "Tamamlandı işaretle",
                        onClick: () => p.toggleItem(v.id),
                        className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white cursor-pointer ${v.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
                        children: v.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                      }
                    ),
                    /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[12.5px] font-semibold ${v.isDone ? "line-through text-text-tertiary" : "text-text-primary"}`, children: v.text }),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        "aria-label": "Maddeyi sil",
                        onClick: () => p.removeItem(v.id),
                        className: "flex shrink-0 items-center justify-center h-6 w-6 rounded-md text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
                        children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[10px]" })
                      }
                    )
                  ] }, v.id)),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: b,
                      onChange: (v) => h(v.target.value),
                      onKeyDown: (v) => {
                        v.key === "Enter" && w();
                      },
                      placeholder: "Yeni madde yaz ve Enter'a bas…",
                      className: "h-9 mt-1 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  )
                ] })
              ] }),
              c === "comments" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] items-start", children: [
                  /* @__PURE__ */ e.jsx(tt, { name: o, size: 30 }),
                  /* @__PURE__ */ e.jsx(
                    "textarea",
                    {
                      rows: 2,
                      value: y,
                      onChange: (v) => j(v.target.value),
                      onKeyDown: (v) => {
                        v.key === "Enter" && !v.shiftKey && (v.preventDefault(), g());
                      },
                      placeholder: "Yorum yaz ve Enter'a bas…",
                      className: "flex-1 min-w-0 px-3 py-2.5 rounded-[11px] border border-default bg-surface-base text-text-primary text-[12.5px] leading-[1.6] resize-none focus:border-focus focus:shadow-focus focus:outline-none"
                    }
                  ),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: g,
                      "aria-label": "Yorumu gönder",
                      className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] ${y.trim() ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paper-plane text-[11px]" })
                    }
                  )
                ] }),
                R.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-[7px] py-7 rounded-xl border border-dashed border-default", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-comments text-xl text-text-tertiary" }),
                  /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Henüz yorum yok" })
                ] }) : R.map((v) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 items-start p-3 rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx(tt, { name: v.authorName, size: 28 }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
                      /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: v.authorName }),
                      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: Zs(v.creationTime) })
                    ] }),
                    /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: v.text })
                  ] })
                ] }, v.id))
              ] }),
              c === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    ref: D,
                    type: "file",
                    className: "hidden",
                    onChange: (v) => {
                      var P;
                      const L = (P = v.target.files) == null ? void 0 : P[0];
                      v.target.value = "", L && d.upload(L).catch((G) => {
                        var Y, re, I;
                        return (I = (re = (Y = window == null ? void 0 : window.abp) == null ? void 0 : Y.notify) == null ? void 0 : re.error) == null ? void 0 : I.call(re, (G == null ? void 0 : G.message) || "Dosya yüklenemedi.");
                      });
                    }
                  }
                ),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      var v;
                      return (v = D.current) == null ? void 0 : v.click();
                    },
                    disabled: d.isUploading,
                    className: "flex flex-col items-center justify-center gap-[7px] p-6 rounded-[13px] border-2 border-dashed border-strong bg-surface-base cursor-pointer hover:border-focus hover:bg-primary-subtle disabled:opacity-60",
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.isUploading ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-xl text-text-tertiary` }),
                      /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: d.isUploading ? "Yükleniyor…" : "Dosya ekle" })
                    ]
                  }
                ),
                q.map((v) => {
                  const L = Vs(v.fileName);
                  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                    /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${L.bg} ${L.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${L.icon} text-[13px]` }) }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: v.fileName }),
                      /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                        Qs(v.fileSize),
                        " · ",
                        v.uploaderName
                      ] })
                    ] }),
                    /* @__PURE__ */ e.jsx(
                      "a",
                      {
                        href: v.downloadUrl,
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
                        onClick: () => d.remove(v.id).catch((P) => {
                          var G, Y, re;
                          return (re = (Y = (G = window == null ? void 0 : window.abp) == null ? void 0 : G.notify) == null ? void 0 : Y.error) == null ? void 0 : re.call(Y, (P == null ? void 0 : P.message) || "Dosya silinemedi.");
                        }),
                        className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                        children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                      }
                    )
                  ] }, v.id);
                })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-5 py-3 border-t border-subtle bg-surface-base shrink-0", children: [
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r == null ? void 0 : r(i.id),
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
    ] }),
    document.body
  );
}
const fa = "apya.taskDetail.tabOrder";
function Xs() {
  try {
    const t = localStorage.getItem(fa);
    if (!t) return [];
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.filter((s) => typeof s == "string") : [];
  } catch {
    return [];
  }
}
function er(t) {
  try {
    localStorage.setItem(fa, JSON.stringify(t));
  } catch {
  }
}
function tr(t) {
  const [a, s] = u.useState(Xs), [r, l] = u.useState(null), o = u.useMemo(() => {
    const d = new Map(t.map((x) => [x.code, x])), c = [];
    for (const x of a) {
      const f = d.get(x);
      f && (c.push(f), d.delete(x));
    }
    for (const x of t)
      d.has(x.code) && c.push(x);
    return c;
  }, [t, a]), n = u.useCallback((d) => {
    s((c) => {
      const x = r;
      if (!x || x === d) return c;
      const f = c.length ? c.slice() : o.map((h) => h.code), m = f.indexOf(x), b = f.indexOf(d);
      return m === -1 || b === -1 ? c : (f.splice(m, 1), f.splice(b, 0, x), f);
    });
  }, [r, o]), i = u.useCallback((d) => l(d), []), p = u.useCallback(() => {
    l(null), s((d) => {
      const c = d.length ? d : o.map((x) => x.code);
      return er(c), c;
    });
  }, [o]);
  return { orderedTabs: o, draggingCode: r, handleDragStart: i, handleDragEnd: p, reorderTo: n };
}
function ar() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function sr() {
  const t = ie({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: ar,
    staleTime: 3e5,
    retry: !1
  }), a = t.data ?? [], s = a.map((l) => ({ value: l.id, label: l.name })), r = new Map(a.map((l) => [l.id, l.name]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
const _t = "apya.taskDetail.fullscreen", W = {
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
function rr(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function ba({ taskId: t, presentation: a = "modal", onClose: s, switchToTask: r }) {
  var bt, ht, gt, yt, vt, jt, wt, Nt;
  const [l, o] = u.useState(t), { data: n, isLoading: i, isError: p, refetch: d } = dt(l), c = le(), x = Jt(), f = aa(n), m = sa(), b = sr(), h = ra(l), y = ut(l), [j, D] = u.useState("general"), [A, R] = u.useState(!1), [F, B] = u.useState(!1), [H, _] = u.useState(!1), [Q, U] = u.useState(null), [q, Z] = u.useState(null), [ee, J] = u.useState(!1), [M, k] = u.useState(!1), [C, w] = u.useState(() => {
    try {
      return localStorage.getItem(_t) === "true";
    } catch {
      return !1;
    }
  });
  ta(l);
  const [g, S] = u.useState(null);
  n != null && n.id && n.id !== g && (S(n.id), J(!!n.isFavorite), k(!!n.isWatched)), u.useEffect(() => {
    f.isDirty ? x.markDirty() : x.markClean();
  });
  const $ = u.useCallback(() => {
    ea(), s == null || s();
  }, [s]), E = u.useCallback(() => x.requestClose($), [x, $]), V = u.useCallback(() => {
    w((N) => {
      const T = !N;
      try {
        localStorage.setItem(_t, String(T));
      } catch {
      }
      return T;
    });
  }, []), oe = u.useMemo(
    () => xa(h.assignedCodes),
    [h.assignedCodes]
  ), v = tr(oe), L = u.useMemo(() => {
    var N, T, K, ne, ue;
    return {
      subtasks: ((N = n == null ? void 0 : n.subTasks) == null ? void 0 : N.length) ?? 0,
      files: ((T = n == null ? void 0 : n.attachments) == null ? void 0 : T.length) ?? 0,
      dependencies: ((K = n == null ? void 0 : n.predecessorIds) == null ? void 0 : K.length) ?? 0,
      comments: ((ne = n == null ? void 0 : n.comments) == null ? void 0 : ne.length) ?? 0,
      checklist: ((ue = y.items) == null ? void 0 : ue.length) ?? 0
    };
  }, [n, y.items]), P = Re.find((N) => N.code === j), G = y.items ?? [], Y = G.filter((N) => N.isDone).length, re = G.length ? Math.round(Y / G.length * 100) : 0, I = u.useCallback(async () => {
    if (!f.validate())
      return W.err("Zorunlu alanları kontrol edin."), !1;
    R(!0);
    try {
      return await Promise.resolve(window.apya.platform.tasks.task.update(l, f.toUpdateDto())), await c.invalidateQueries({ queryKey: ["task-detail", l] }), se.emitResult(), B(!0), setTimeout(() => B(!1), 2e3), W.ok("Görev başarıyla güncellendi."), !0;
    } catch (N) {
      return W.err((N == null ? void 0 : N.message) || "Kaydedilemedi."), !1;
    } finally {
      R(!1);
    }
  }, [l, f, c]);
  u.useEffect(() => {
    const N = (T) => {
      if ((T.ctrlKey || T.metaKey) && T.key.toLowerCase() === "s") {
        T.preventDefault(), f.isDirty && !A && I();
        return;
      }
      if (T.key === "Escape") {
        if (Q) {
          T.stopPropagation(), U(null);
          return;
        }
        H && (T.stopPropagation(), _(!1));
      }
    };
    return window.addEventListener("keydown", N), () => window.removeEventListener("keydown", N);
  }, [I, f.isDirty, A, Q, H]);
  const z = () => {
    var N, T, K;
    return (K = (T = (N = window == null ? void 0 : window.apya) == null ? void 0 : N.platform) == null ? void 0 : T.tasks) == null ? void 0 : K.task;
  }, O = async () => {
    var T;
    const N = !ee;
    J(N);
    try {
      await Promise.resolve((T = z()) == null ? void 0 : T.toggleFavorite(l));
    } catch (K) {
      J(!N), W.err((K == null ? void 0 : K.message) || "Favori güncellenemedi.");
    }
  }, te = () => {
    if (!l) return;
    const N = document.createElement("a");
    N.href = `/Tasks/Detail/${l}?handler=Pdf`, N.rel = "noopener", document.body.appendChild(N), N.click(), N.remove();
  }, X = async () => {
    var T;
    const N = !M;
    k(N);
    try {
      await Promise.resolve((T = z()) == null ? void 0 : T.toggleWatch(l)), W.info(N ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (K) {
      k(!N), W.err((K == null ? void 0 : K.message) || "Takip durumu güncellenemedi.");
    }
  }, ve = async () => {
    var N, T;
    try {
      const K = await Promise.resolve((N = z()) == null ? void 0 : N.transfer(l, {
        mode: 2,
        // Copy
        targetProjectIds: n != null && n.projectId ? [n.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await c.invalidateQueries({ queryKey: ["task-detail"] }), W.ok("Görev çoğaltıldı.");
      const ne = (T = K == null ? void 0 : K.createdTaskIds) == null ? void 0 : T[0];
      ne && o(ne);
    } catch (K) {
      W.err((K == null ? void 0 : K.message) || "Görev çoğaltılamadı.");
    }
  }, de = async () => {
    var N;
    try {
      await Promise.resolve((N = z()) == null ? void 0 : N.updateStatus(l, 4)), await c.invalidateQueries({ queryKey: ["task-detail", l] }), W.info("Görev arşivlendi (Tamamlandı).");
    } catch (T) {
      W.err((T == null ? void 0 : T.message) || "Görev arşivlenemedi.");
    }
  }, ga = async () => {
    var N;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?"))
      try {
        await Promise.resolve((N = z()) == null ? void 0 : N.delete(l)), W.info("Görev silindi."), x.markClean(), $();
      } catch (T) {
        W.err((T == null ? void 0 : T.message) || "Görev silinemedi.");
      }
  }, ya = async (N) => {
    try {
      await h.addFeature(N), D(N), W.ok("Özellik başarıyla eklendi.");
    } catch (T) {
      W.err((T == null ? void 0 : T.message) || "Özellik eklenemedi.");
    }
  }, pt = async (N) => {
    try {
      await h.removeFeature(N), D("general"), W.info("Özellik görevden kaldırıldı.");
    } catch (T) {
      W.err((T == null ? void 0 : T.message) || "Özellik kaldırılamadı.");
    }
  }, va = async (N) => {
    var ne, ue, ce, ke, je, Me, $e;
    const T = ((ke = (ce = (ue = (ne = window == null ? void 0 : window.apya) == null ? void 0 : ne.platform) == null ? void 0 : ue.application) == null ? void 0 : ce.projects) == null ? void 0 : ke.project) ?? (($e = (Me = (je = window == null ? void 0 : window.apya) == null ? void 0 : je.platform) == null ? void 0 : Me.projects) == null ? void 0 : $e.project);
    if (!(T != null && T.create)) throw new Error("Proje servisi yüklenmedi.");
    const K = await Promise.resolve(T.create({
      name: N,
      code: rr(N),
      currency: "TRY"
    }));
    return await c.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), W.ok(`“${N}” projesi oluşturuldu.`), (K == null ? void 0 : K.id) ?? K;
  }, ja = async ({ mode: N, targetProjectIds: T, include: K }) => {
    var ne, ue;
    try {
      const ce = await Promise.resolve((ne = z()) == null ? void 0 : ne.transfer(l, {
        mode: N === "move" ? 1 : 2,
        targetProjectIds: T,
        include: K
      }));
      await c.invalidateQueries({ queryKey: ["task-detail", l] });
      const ke = T.map((Me) => {
        var $e;
        return ($e = b.options.find((Na) => Na.value === Me)) == null ? void 0 : $e.label;
      }).filter(Boolean), je = ((ue = ce == null ? void 0 : ce.createdTaskIds) == null ? void 0 : ue.length) ?? 0;
      W.ok(N === "move" ? je ? `“${ke[0]}” projesine taşındı, ${je} projeye kopyalandı.` : `Görev “${ke[0]}” projesine taşındı.` : je > 1 ? `${je} projeye kopyalandı.` : `Kopya “${ke[0]}” projesinde oluşturuldu.`), U(null);
    } catch (ce) {
      W.err((ce == null ? void 0 : ce.message) || "Transfer tamamlanamadı.");
    }
  }, wa = j === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)] gap-5 items-start", children: [
    /* @__PURE__ */ e.jsx(
      zs,
      {
        task: n,
        onFieldChange: f.setField,
        descriptionValue: f.values.description,
        checklist: y,
        currentUserName: ((ht = (bt = window == null ? void 0 : window.abp) == null ? void 0 : bt.currentUser) == null ? void 0 : ht.name) || ((yt = (gt = window == null ? void 0 : window.abp) == null ? void 0 : gt.currentUser) == null ? void 0 : yt.userName) || "Ben"
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5", children: /* @__PURE__ */ e.jsx($s, { task: n, nameById: m.nameById }) })
  ] }) : Gs(j) ? /* @__PURE__ */ e.jsx(
    Ot,
    {
      code: j,
      onRemoveFeature: pt,
      onOpenPicker: () => _(!0),
      canRemove: !(P != null && P.isCore)
    }
  ) : /* @__PURE__ */ e.jsx(u.Suspense, { fallback: /* @__PURE__ */ e.jsx(fe, { className: "h-48 w-full" }), children: P != null && P.component ? /* @__PURE__ */ e.jsx(
    P.component,
    {
      taskId: l,
      task: n,
      onOpenSubtask: Z
    }
  ) : /* @__PURE__ */ e.jsx(
    Ot,
    {
      code: j,
      onRemoveFeature: pt,
      onOpenPicker: () => _(!0),
      canRemove: !(P != null && P.isCore)
    }
  ) }), mt = i ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(fe, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(fe, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(fe, { className: "h-64 w-full" })
  ] }) : p ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(ae, { variant: "ghost", onClick: () => d(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col flex-1 min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      Cs,
      {
        task: n,
        presentation: a,
        onClose: E,
        isFullscreen: C,
        onToggleFullscreen: V,
        onFieldChange: f.setField,
        statusValue: f.values.status,
        priorityValue: f.values.priority,
        titleValue: n == null ? void 0 : n.title,
        isPrivateValue: f.values.isPrivate,
        isFavorite: ee,
        onToggleFavorite: O,
        isWatched: M,
        onToggleWatch: X,
        onDuplicate: ve,
        onArchive: de,
        onDelete: ga,
        onOpenTransfer: (N) => U({ mode: N }),
        onSaveAsTemplate: () => W.info("Şablon olarak kaydetme yakında."),
        onConvertToSubtask: () => W.info("Alt göreve dönüştürme yakında."),
        onExportPdf: te
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        Ts,
        {
          task: n,
          assigneeOptions: m.options,
          projectOptions: b.options,
          onFieldChange: f.setField,
          statusValue: f.values.status,
          assigneeValue: f.values.assigneeId,
          projectValue: f.values.projectId,
          dueDateValue: f.values.dueDate,
          startDateValue: f.values.startDate,
          tagsValue: f.values.tagNames,
          progressPercent: re,
          progressNote: `${Y}/${G.length} madde`,
          onOpenTransfer: (N) => U({ mode: N })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        a === "page" && /* @__PURE__ */ e.jsx(
          Ss,
          {
            activeTab: j,
            onTabChange: D,
            orderedTabs: v.orderedTabs,
            draggingCode: v.draggingCode,
            onDragStart: v.handleDragStart,
            onDragEnd: v.handleDragEnd,
            onReorderTo: v.reorderTo,
            onReorderDrop: () => W.info("Sekme sırası güncellendi."),
            onOpenPicker: () => _(!0),
            counts: L
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: a === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            Ds,
            {
              activeTab: j,
              onTabChange: D,
              orderedTabs: v.orderedTabs,
              draggingCode: v.draggingCode,
              onDragStart: v.handleDragStart,
              onDragEnd: v.handleDragEnd,
              onReorderTo: v.reorderTo,
              onReorderDrop: () => W.info("Sekme sırası güncellendi."),
              onOpenPicker: () => _(!0),
              counts: L,
              isDirty: f.isDirty
            }
          ) }),
          /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised", children: wa })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(
      Bs,
      {
        lastSavedAt: n == null ? void 0 : n.lastModificationTime,
        isDirty: f.isDirty,
        isSaving: A,
        justSaved: F,
        onCancel: E,
        onSave: I
      }
    )
  ] }), ft = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      qs,
      {
        open: H,
        onClose: () => _(!1),
        assignedCodes: h.assignedCodes,
        onAddFeature: ya,
        onGoToTab: D
      }
    ),
    /* @__PURE__ */ e.jsx(
      Ys,
      {
        open: !!Q,
        mode: (Q == null ? void 0 : Q.mode) ?? "move",
        onClose: () => U(null),
        onConfirm: ja,
        projectOptions: b.options,
        currentProjectId: f.values.projectId,
        counts: L,
        onCreateProject: va
      }
    ),
    q && /* @__PURE__ */ e.jsx(
      Js,
      {
        subtaskId: q,
        parentCode: n == null ? void 0 : n.code,
        onClose: () => Z(null),
        onOpenFull: (N) => {
          Z(null), (r ?? o)(N);
        },
        onDeleted: () => c.invalidateQueries({ queryKey: ["task-detail", l] }),
        currentUserName: ((jt = (vt = window == null ? void 0 : window.abp) == null ? void 0 : vt.currentUser) == null ? void 0 : jt.name) || ((Nt = (wt = window == null ? void 0 : window.abp) == null ? void 0 : wt.currentUser) == null ? void 0 : Nt.userName) || "Ben"
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col w-full min-h-[calc(100vh-54px)] border-y border-subtle bg-surface-base", children: mt }),
    ft
  ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(Vt, { open: !0, onOpenChange: (N) => {
      N || E();
    }, children: /* @__PURE__ */ e.jsx(
      Qt,
      {
        title: n != null && n.title ? `Görev Detayı: ${n.title}` : "Görev Detayı",
        fullscreen: C,
        className: C ? "p-0 rounded-xl border border-default shadow-xl" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl",
        onInteractOutside: (N) => {
          var T, K;
          N.preventDefault(), !(H || Q || q) && ((K = (T = N.target) == null ? void 0 : T.closest) != null && K.call(T, "[data-apya-overlay]") || E());
        },
        onEscapeKeyDown: (N) => {
          if (H || Q || q) {
            N.preventDefault();
            return;
          }
          N.preventDefault(), E();
        },
        children: mt
      }
    ) }),
    ft
  ] });
}
function nr() {
  var a;
  const t = u.useSyncExternalStore(
    se.subscribe,
    se.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(Ue, { children: /* @__PURE__ */ e.jsx(
    ba,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        se.close(), se.emitResult();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(Ue, { children: /* @__PURE__ */ e.jsx(
    ua,
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
function ha() {
  var s;
  try {
    const r = new URLSearchParams(window.location.search).get("taskui");
    if (r === "v1" || r === "v2" || r === "v3") return r;
  } catch {
  }
  const t = document.getElementById("task-detail-island"), a = (s = t == null ? void 0 : t.dataset) == null ? void 0 : s.taskui;
  return a === "v1" || a === "v2" ? a : "v3";
}
function ir() {
  return ha() === "v2";
}
function lr() {
  return ha() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = lr();
window.apya.taskDetailV2Enabled = ir() && !window.apya.taskDetailV3Enabled;
const Ut = {
  open: (t) => {
    se.open(t);
  },
  close: () => se.close(),
  onResult: (t) => se.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(Ut) : window.apya.taskDetail = Ut;
function Yt() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = Ht(t), t._reactRoot.render(/* @__PURE__ */ e.jsx(nr, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = Xt();
    a && se.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Yt) : Yt();
function or({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(Ue, { children: /* @__PURE__ */ e.jsx(
    ba,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(Ue, { children: /* @__PURE__ */ e.jsx(
    ua,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) });
}
const at = document.getElementById("task-detail-page-island");
if (at) {
  const t = at.getAttribute("data-task-id");
  t && Ht(at).render(/* @__PURE__ */ e.jsx(or, { taskId: t }));
}
