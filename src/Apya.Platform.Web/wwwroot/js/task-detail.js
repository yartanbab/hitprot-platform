import { j as e, r as d, d as X, b as Le } from "./react-vendor.js";
/* empty css      */
import { a as me } from "./QueryProvider.js";
import { u as oe, a as Z, b as H } from "./query-vendor.js";
import { D as Be, l as Fe, e as pe, B as N, I as Q, S as U } from "./Dialog.js";
import { C as lt } from "./Combobox.js";
import { r as nt } from "./httpClient.js";
import { R as ee, T as te, P as ae, C as se, A as Re } from "./ui-vendor.js";
function ot({
  open: t,
  onRequestClose: s,
  fullscreen: a,
  title: r,
  header: i,
  footer: l,
  children: o
}) {
  return /* @__PURE__ */ e.jsx(
    Be,
    {
      open: t,
      onOpenChange: (x) => {
        x || s();
      },
      children: /* @__PURE__ */ e.jsx(
        Fe,
        {
          title: r,
          fullscreen: a,
          onInteractOutside: (x) => {
            x.preventDefault(), s();
          },
          onEscapeKeyDown: (x) => {
            x.preventDefault(), s();
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
function ct({ title: t, header: s, footer: a, children: r }) {
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
function dt({ isPrivate: t }) {
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
const ne = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, ve = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function xt({
  task: t,
  canDelete: s,
  onClose: a,
  onDelete: r,
  onToggleFullscreen: i,
  fullscreen: l = !1
}) {
  const [o, x] = d.useState(!1), c = d.useRef(null);
  d.useEffect(() => {
    if (!o) return;
    const y = (f) => {
      c.current && !c.current.contains(f.target) && x(!1);
    }, n = (f) => {
      f.key === "Escape" && x(!1);
    };
    return document.addEventListener("mousedown", y), document.addEventListener("keydown", n), () => {
      document.removeEventListener("mousedown", y), document.removeEventListener("keydown", n);
    };
  }, [o]);
  const u = ne[t == null ? void 0 : t.status] ?? ne[1], m = ve[t == null ? void 0 : t.priority] ?? ve[2], p = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), x(!1);
  }, h = () => {
    var n, f, b, w;
    const y = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (n = navigator.clipboard) == null || n.writeText(y), (w = (b = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : b.info) == null || w.call(b, "Bağlantı kopyalandı."), x(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(pe, { variant: u.variant, children: u.text }),
        /* @__PURE__ */ e.jsx(pe, { variant: m.variant, children: m.text }),
        /* @__PURE__ */ e.jsx(dt, { isPrivate: t == null ? void 0 : t.isPrivate })
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
            onClick: () => x((y) => !y),
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
                  onClick: p,
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
                      x(!1), r();
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
const ut = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function mt({ lastSavedAt: t, isDirty: s, isSaving: a, onCancel: r, onSave: i }) {
  const l = ut(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: l ? `Son kayıt: ${l}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(N, { variant: "secondary", onClick: r, disabled: a, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
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
const ke = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", pt = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function O({ label: t, htmlFor: s, error: a, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: s, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    a && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: a })
  ] });
}
function ft({ value: t, onChange: s }) {
  const [a, r] = d.useState(""), i = () => {
    const l = a.trim();
    l && !t.includes(l) && s([...t, l]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((l) => /* @__PURE__ */ e.jsxs(pe, { variant: "neutral", children: [
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
      Q,
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
function ht({
  values: t,
  errors: s,
  onFieldChange: a,
  assigneeOptions: r = [],
  isLoadingAssignees: i = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(O, { label: "Başlık", htmlFor: "task-title", error: s.title, children: /* @__PURE__ */ e.jsx(
      Q,
      {
        id: "task-title",
        value: t.title,
        onChange: (l) => a("title", l.target.value),
        invalid: !!s.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(O, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (l) => a("status", Number(l.target.value)),
          className: ke,
          children: Object.entries(ne).map(([l, o]) => /* @__PURE__ */ e.jsx("option", { value: l, children: o.text }, l))
        }
      ) }),
      /* @__PURE__ */ e.jsx(O, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (l) => a("priority", Number(l.target.value)),
          className: ke,
          children: Object.entries(ve).map(([l, o]) => /* @__PURE__ */ e.jsx("option", { value: l, children: o.text }, l))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(O, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      lt,
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
      /* @__PURE__ */ e.jsx(O, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: s.startDate, children: /* @__PURE__ */ e.jsx(
        Q,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (l) => a("startDate", l.target.value),
          invalid: !!s.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(O, { label: "Son Tarih", htmlFor: "task-due", error: s.dueDate, children: /* @__PURE__ */ e.jsx(
        Q,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (l) => a("dueDate", l.target.value),
          invalid: !!s.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(O, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(ft, { value: t.tagNames, onChange: (l) => a("tagNames", l) }) }),
    /* @__PURE__ */ e.jsx(O, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (l) => a("description", l.target.value),
        className: pt
      }
    ) })
  ] });
}
const Ce = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function le({ label: t, value: s }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: s ?? "—" })
  ] });
}
function bt({ task: t, creatorName: s, lastModifierName: a }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(le, { label: "Oluşturan", value: s }),
      /* @__PURE__ */ e.jsx(le, { label: "Oluşturulma zamanı", value: Ce(t.creationTime) }),
      /* @__PURE__ */ e.jsx(le, { label: "Güncelleyen", value: a }),
      /* @__PURE__ */ e.jsx(le, { label: "Son güncelleme zamanı", value: Ce(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(le, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const yt = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", gt = "border-brand-500 text-text-primary";
function vt({ tabs: t, activeCode: s, onSelect: a, onOpenPicker: r, pickerOpen: i }) {
  const l = d.useRef(/* @__PURE__ */ new Map()), o = (c) => {
    var u;
    a(c.code), (u = l.current.get(c.code)) == null || u.focus();
  }, x = (c, u) => {
    c.key === "ArrowRight" ? (c.preventDefault(), o(t[(u + 1) % t.length])) : c.key === "ArrowLeft" ? (c.preventDefault(), o(t[(u - 1 + t.length) % t.length])) : c.key === "Home" ? (c.preventDefault(), o(t[0])) : c.key === "End" && (c.preventDefault(), o(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((c, u) => {
      const m = c.code === s;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (p) => {
            p ? l.current.set(c.code, p) : l.current.delete(c.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${c.code}`,
          "aria-selected": m,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: m ? 0 : -1,
          onClick: () => a(c.code),
          onKeyDown: (p) => x(p, u),
          className: `${yt} ${m ? gt : ""}`,
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
const jt = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function wt({ entries: t, onAdd: s, onRemove: a, busyCode: r }) {
  const [i, l] = d.useState(""), o = d.useMemo(() => {
    const x = i.trim().toLocaleLowerCase("tr-TR"), c = x ? t.filter((m) => m.title.toLocaleLowerCase("tr-TR").includes(x)) : t, u = /* @__PURE__ */ new Map();
    return c.forEach((m) => {
      const p = u.get(m.category) ?? [];
      p.push(m), u.set(m.category, p);
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
          Q,
          {
            autoFocus: !0,
            value: i,
            onChange: (x) => l(x.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          o.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...o.entries()].map(([x, c]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: jt[x] ?? x }),
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
          ] }, x))
        ] })
      ]
    }
  );
}
function Nt({ trail: t = [], current: s, onNavigate: a }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((r) => /* @__PURE__ */ e.jsxs(X.Fragment, { children: [
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
function kt(t) {
  var a, r, i;
  const s = (i = (r = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : r.tasks) == null ? void 0 : i.task;
  return s ? Promise.resolve(s.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Pe(t) {
  return oe({
    queryKey: ["task-detail", t],
    queryFn: () => kt(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function fe(t) {
  var s, a, r;
  return !!((r = (a = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.auth) == null ? void 0 : a.isGranted) != null && r.call(a, t));
}
function Ke() {
  const [t, s] = d.useState(!1), [a, r] = d.useState(!1), i = d.useRef(null), l = d.useCallback(() => s(!0), []), o = d.useCallback(() => s(!1), []);
  d.useEffect(() => {
    if (!t) return;
    const u = (m) => {
      m.preventDefault(), m.returnValue = "";
    };
    return window.addEventListener("beforeunload", u), () => window.removeEventListener("beforeunload", u);
  }, [t]);
  const x = d.useCallback((u) => {
    if (!t) {
      u == null || u();
      return;
    }
    i.current = u ?? null, r(!0);
  }, [t]), c = d.useCallback((u) => {
    const m = i.current;
    return r(!1), i.current = null, u === "discard" && (s(!1), m == null || m()), u === "save" ? m : null;
  }, []);
  return { isDirty: t, markDirty: l, markClean: o, requestClose: x, pendingClose: a, resolvePendingClose: c };
}
const Ct = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, we = "task";
function Ge() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(we);
  return t && Ct.test(t) ? t : null;
}
function Me() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(we), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function Oe(t, s) {
  const a = d.useRef(s);
  a.current = s, d.useEffect(() => {
    if (!t || Ge() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(we, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), d.useEffect(() => {
    const r = () => {
      var i;
      (i = a.current) == null || i.call(a);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const Tt = {
  title: "",
  description: "",
  startDate: "",
  dueDate: "",
  status: 1,
  priority: 2,
  assigneeId: null,
  tagNames: []
};
function Dt(t) {
  return t ? {
    title: t.title ?? "",
    description: t.description ?? "",
    startDate: t.startDate ? t.startDate.slice(0, 10) : "",
    dueDate: t.dueDate ? t.dueDate.slice(0, 10) : "",
    status: t.status ?? 1,
    priority: t.priority ?? 2,
    assigneeId: t.assigneeId ?? null,
    tagNames: (t.tags ?? []).map((s) => s.name)
  } : Tt;
}
function Ye(t) {
  const [s, a] = d.useState(t == null ? void 0 : t.id), r = d.useMemo(() => Dt(t), [t]), [i, l] = d.useState(r), [o, x] = d.useState({});
  (t == null ? void 0 : t.id) !== s && (a(t == null ? void 0 : t.id), l(r), x({}));
  const c = d.useCallback((y, n) => {
    l((f) => ({ ...f, [y]: n }));
  }, []), u = d.useMemo(
    () => JSON.stringify(i) !== JSON.stringify(r),
    [i, r]
  ), m = d.useCallback(() => {
    const y = {};
    return i.title.trim() || (y.title = "Başlık zorunlu."), i.startDate || (y.startDate = "Başlangıç tarihi zorunlu."), i.dueDate && i.startDate && i.dueDate < i.startDate && (y.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), x(y), Object.keys(y).length === 0;
  }, [i]), p = d.useCallback(() => ({
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
  }), [i, t]), h = d.useCallback(() => {
    l(r), x({});
  }, [r]);
  return { values: i, setField: c, isDirty: u, errors: o, validate: m, toUpdateDto: p, reset: h };
}
function Te(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function St() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function $e() {
  var i;
  const t = oe({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: St,
    staleTime: 3e5,
    retry: !1
  }), s = ((i = t.data) == null ? void 0 : i.items) ?? [], a = s.map((l) => ({ value: l.id, label: Te(l) })), r = new Map(s.map((l) => [l.id, Te(l)]));
  return { options: a, nameById: r, isLoading: t.isLoading };
}
function je() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Et(t) {
  const s = je();
  return s ? Promise.resolve(s.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ue(t) {
  const s = Z(), a = ["task-features", t], r = oe({
    queryKey: a,
    queryFn: () => Et(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => s.invalidateQueries({ queryKey: a }), l = H({
    mutationFn: (x) => Promise.resolve(je().addFeature(t, x)),
    onSuccess: i
  }), o = H({
    mutationFn: (x) => Promise.resolve(je().removeFeature(t, x)),
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
function zt({ taskId: t, task: s, onOpenSubtask: a }) {
  const [r, i] = d.useState(""), [l, o] = d.useState(!1), [x, c] = d.useState(null), u = Z(), m = (s == null ? void 0 : s.subTasks) ?? [], p = () => u.invalidateQueries({ queryKey: ["task-detail", t] }), h = async () => {
    var f, b, w;
    const n = r.trim();
    if (n) {
      o(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: n,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: s == null ? void 0 : s.projectId
        })), i(""), await p();
      } catch (g) {
        (w = (b = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : b.error) == null || w.call(b, (g == null ? void 0 : g.message) || "Alt görev eklenemedi.");
      } finally {
        o(!1);
      }
    }
  }, y = async (n) => {
    var f, b, w;
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(n)), await p();
    } catch (g) {
      (w = (b = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : b.error) == null || w.call(b, (g == null ? void 0 : g.message) || "Alt görev silinemedi.");
    } finally {
      c(null);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        Q,
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
      /* @__PURE__ */ e.jsx(N, { variant: "secondary", onClick: h, disabled: l || !r.trim(), children: "Alt Görev Ekle" })
    ] }),
    m.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz alt görev yok." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: m.map((n) => {
      var f, b;
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
          /* @__PURE__ */ e.jsx(pe, { variant: ((f = ne[n.status]) == null ? void 0 : f.variant) ?? "neutral", children: ((b = ne[n.status]) == null ? void 0 : b.text) ?? n.status }),
          x === n.id ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary", children: "Emin misiniz?" }),
            /* @__PURE__ */ e.jsx(N, { variant: "destructive", onClick: () => y(n.id), children: "Evet, sil" }),
            /* @__PURE__ */ e.jsx(N, { variant: "ghost", onClick: () => c(null), children: "Vazgeç" })
          ] }) : /* @__PURE__ */ e.jsx(N, { variant: "ghost", onClick: () => c(n.id), "aria-label": `${n.title} alt görevini sil`, children: "Sil" })
        ] })
      ] }, n.id);
    }) })
  ] });
}
function qe() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function At(t) {
  const s = qe();
  return s ? Promise.resolve(s.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function It(t, s) {
  const a = new FormData();
  a.append("file", s);
  const r = {}, i = nt();
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
  const s = Z(), a = ["task-attachments", t], r = oe({
    queryKey: a,
    queryFn: () => At(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => s.invalidateQueries({ queryKey: a }), l = H({
    mutationFn: (x) => It(t, x),
    onSuccess: i
  }), o = H({
    mutationFn: (x) => Promise.resolve(qe().deleteAttachment(x)),
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
function Bt(t) {
  return `${Math.round(t / 1024)} KB`;
}
function Ft({ taskId: t }) {
  const { attachments: s, upload: a, remove: r, isUploading: i } = Lt(t), l = d.useRef(null), o = async (c) => {
    var m, p, h, y, n, f, b;
    const u = (m = c.target.files) == null ? void 0 : m[0];
    if (u)
      try {
        await a(u), (y = (h = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : h.success) == null || y.call(h, "Dosya yüklendi.");
      } catch (w) {
        (b = (f = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.notify) == null ? void 0 : f.error) == null || b.call(f, (w == null ? void 0 : w.message) || "Dosya yüklenemedi.");
      } finally {
        l.current && (l.current.value = "");
      }
  }, x = async (c, u) => {
    var m, p, h;
    try {
      await r(c);
    } catch (y) {
      (h = (p = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : p.error) == null || h.call(p, (y == null ? void 0 : y.message) || `${u} silinemedi.`);
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
          Bt(c.fileSize),
          " — ",
          c.uploaderName
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(N, { variant: "ghost", onClick: () => x(c.id, c.fileName), "aria-label": `${c.fileName} dosyasini sil`, children: "Sil" })
    ] }, c.id)) })
  ] });
}
function xe() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Rt(t) {
  const s = xe();
  return s ? Promise.resolve(s.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Pt(t) {
  const s = Z(), a = ["task-checklist", t], r = oe({
    queryKey: a,
    queryFn: () => Rt(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => s.invalidateQueries({ queryKey: a }), l = H({
    mutationFn: (c) => Promise.resolve(xe().addChecklistItem(t, c)),
    onSuccess: i
  }), o = H({
    mutationFn: (c) => Promise.resolve(xe().toggleChecklistItem(c)),
    onSuccess: i
  }), x = H({
    mutationFn: (c) => Promise.resolve(xe().deleteChecklistItem(c)),
    onSuccess: i
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: l.mutateAsync,
    toggleItem: o.mutateAsync,
    removeItem: x.mutateAsync
  };
}
function Kt({ taskId: t }) {
  const { items: s, addItem: a, toggleItem: r, removeItem: i } = Pt(t), [l, o] = d.useState(""), x = async () => {
    var p, h, y;
    const m = l.trim();
    if (m)
      try {
        await a(m), o("");
      } catch (n) {
        (y = (h = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : h.error) == null || y.call(h, (n == null ? void 0 : n.message) || "Madde eklenemedi.");
      }
  }, c = async (m) => {
    var p, h, y;
    try {
      await r(m);
    } catch (n) {
      (y = (h = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : h.error) == null || y.call(h, (n == null ? void 0 : n.message) || "Madde güncellenemedi.");
    }
  }, u = async (m, p) => {
    var h, y, n;
    try {
      await i(m);
    } catch (f) {
      (n = (y = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : y.error) == null || n.call(y, (f == null ? void 0 : f.message) || `${p} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        Q,
        {
          value: l,
          onChange: (m) => o(m.target.value),
          onKeyDown: (m) => {
            m.key === "Enter" && x();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ e.jsx(N, { variant: "secondary", onClick: x, disabled: !l.trim(), children: "Ekle" })
    ] }),
    s.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz madde eklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "space-y-1.5", children: s.map((m) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-2 py-1", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: m.isDone,
            onChange: () => c(m.id)
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: m.isDone ? "text-text-tertiary line-through" : "text-text-primary", children: m.text })
      ] }),
      /* @__PURE__ */ e.jsx(N, { variant: "ghost", onClick: () => u(m.id, m.text), "aria-label": `${m.text} maddesini sil`, children: "Sil" })
    ] }, m.id)) })
  ] });
}
function Gt({ taskId: t, task: s }) {
  const [a, r] = d.useState(""), [i, l] = d.useState(null), [o, x] = d.useState(""), [c, u] = d.useState(!1), m = Z(), p = (s == null ? void 0 : s.comments) ?? [], h = async (n) => {
    var f, b, w, g, E, z;
    if (n == null || n.preventDefault(), !(!a.trim() || c)) {
      u(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, a.trim())
        ), r(""), m.invalidateQueries({ queryKey: ["task-detail", t] }), (w = (b = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : b.success) == null || w.call(b, "Yorum eklendi.");
      } catch (A) {
        (z = (E = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : E.error) == null || z.call(E, (A == null ? void 0 : A.message) || "Yorum eklenemedi.");
      } finally {
        u(!1);
      }
    }
  }, y = async (n) => {
    var f, b, w, g, E, z;
    if (!(!o.trim() || c)) {
      u(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(n, o.trim())
        ), x(""), l(null), m.invalidateQueries({ queryKey: ["task-detail", t] }), (w = (b = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : b.success) == null || w.call(b, "Yanıt eklendi.");
      } catch (A) {
        (z = (E = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : E.error) == null || z.call(E, (A == null ? void 0 : A.message) || "Yanıt eklenemedi.");
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
        N,
        {
          type: "submit",
          variant: "primary",
          disabled: !a.trim() || c,
          isLoading: c,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    p.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: p.map((n) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: n.creatorUserName || n.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: n.creationTime ? new Date(n.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: n.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        N,
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
            onChange: (f) => x(f.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(N, { variant: "ghost", size: "sm", onClick: () => l(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(N, { variant: "primary", size: "sm", disabled: !o.trim() || c, onClick: () => y(n.id), children: "Gönder" })
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
function Mt({ task: t }) {
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
function Ot({ task: t }) {
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
  const s = typeof window < "u" && !!((u = window == null ? void 0 : window.abp) != null && u.auth), a = s ? fe("Platform.Expenses.Default") : !0, r = s ? fe("Platform.Incomes.Default") : !0;
  if (!a && !r)
    return /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Finansal verileri görüntüleme yetkiniz bulunmuyor." });
  const i = (t == null ? void 0 : t.expenses) || [], l = (t == null ? void 0 : t.incomes) || [], o = i.reduce((m, p) => m + (p.amount || 0), 0), x = l.reduce((m, p) => m + (p.amount || 0), 0), c = x - o;
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated", children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Toplam Gelir" }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-base font-semibold text-text-positive", children: [
          x.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
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
function de({ task: t }) {
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
const Ve = [
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
    component: zt
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
    component: Ft
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
    component: Kt
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
    component: Mt
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
    component: Ot
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
    component: de
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
    component: de
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
    component: de
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
    component: de
  }
];
function _e(t = []) {
  const s = new Set(t);
  return Ve.filter((a) => a.implemented && (a.isCore || s.has(a.code))).sort((a, r) => a.order - r.order);
}
function $t(t = []) {
  const s = new Set(t);
  return Ve.filter((a) => !a.isCore).filter((a) => !a.permission || fe(a.permission)).map((a) => ({ ...a, isAssigned: s.has(a.code) })).sort((a, r) => a.order - r.order);
}
let W = null;
const ue = /* @__PURE__ */ new Set(), he = /* @__PURE__ */ new Set();
function De() {
  ue.forEach((t) => t());
}
function Ut(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const R = {
  open(t) {
    const s = Ut(t);
    !s || s === W || (W = s, De());
  },
  close() {
    W !== null && (W = null, De());
  },
  subscribe(t) {
    return ue.add(t), () => ue.delete(t);
  },
  getSnapshot() {
    return W;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && he.add(t);
  },
  emitResult() {
    he.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    W = null, ue.clear(), he.clear();
  }
}, Se = "apya.taskDetail.fullscreen";
function He({ taskId: t, presentation: s = "modal", onClose: a }) {
  const [r, i] = d.useState(t), [l, o] = d.useState([]), { data: x, isLoading: c, isError: u, refetch: m } = Pe(r), p = Ke(), h = Ye(x), y = $e(), n = Ue(r), [f, b] = d.useState("general"), [w, g] = d.useState(!1), E = X.useRef(null), z = d.useMemo(
    () => _e(n.assignedCodes),
    [n.assignedCodes]
  ), A = d.useMemo(
    () => $t(n.assignedCodes),
    [n.assignedCodes]
  ), L = z.find((j) => j.code === f) ?? z[0];
  X.useEffect(() => {
    L.code !== f && b(L.code);
  }, [L, f]);
  const J = L == null ? void 0 : L.component, v = Z(), [D, S] = d.useState(
    () => {
      var j;
      return ((j = window.localStorage) == null ? void 0 : j.getItem(Se)) === "1";
    }
  ), [q, re] = d.useState(!1), T = d.useCallback(() => {
    Me(), a == null || a();
  }, [a]);
  Oe(t, T), X.useEffect(() => {
    h.isDirty ? p.markDirty() : p.markClean();
  });
  const B = d.useCallback(() => p.requestClose(T), [p, T]), K = d.useCallback(() => {
    S((j) => {
      var C;
      const k = !j;
      return (C = window.localStorage) == null || C.setItem(Se, k ? "1" : "0"), k;
    });
  }, []), V = fe("Platform.Tasks.Delete"), [P, G] = d.useState(!1), [M, Ne] = d.useState(!1), Je = d.useCallback(async () => {
    var j, k, C, F, I, ie;
    Ne(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (C = (k = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : k.info) == null || C.call(k, "Başarıyla silindi."), G(!1), p.markClean(), T();
    } catch (_) {
      (ie = (I = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : I.error) == null || ie.call(I, (_ == null ? void 0 : _.message) || "Görev silinemedi.");
    } finally {
      Ne(!1);
    }
  }, [r, p, T]), ce = d.useCallback(async () => {
    var j, k, C, F, I, ie;
    if (!h.validate()) return !1;
    re(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, h.toUpdateDto())
      ), await v.invalidateQueries({ queryKey: ["task-detail", r] }), R.emitResult(), (C = (k = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : k.success) == null || C.call(k, "Kaydedildi."), !0;
    } catch (_) {
      return (ie = (I = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : I.error) == null || ie.call(I, (_ == null ? void 0 : _.message) || "Kaydedilemedi."), !1;
    } finally {
      re(!1);
    }
  }, [r, h, p, v]), We = d.useCallback(() => {
    ce();
  }, [ce]), Xe = d.useCallback(async () => {
    const j = p.resolvePendingClose("save");
    await ce() && (j == null || j());
  }, [p, ce]), et = d.useCallback((j, k) => {
    p.requestClose(() => {
      o((C) => [...C, { id: r, title: (x == null ? void 0 : x.title) ?? "" }]), i(j), b("general"), p.markClean();
    });
  }, [p, r, x]), tt = d.useCallback((j) => {
    p.requestClose(() => {
      o((k) => {
        const C = k.findIndex((F) => F.id === j);
        return C === -1 ? k : k.slice(0, C);
      }), i(j), b("general"), p.markClean();
    });
  }, [p]), at = d.useCallback(async (j) => {
    var k, C, F;
    try {
      await n.addFeature(j), b(j), g(!1);
    } catch (I) {
      (F = (C = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : C.error) == null || F.call(C, (I == null ? void 0 : I.message) || "Özellik eklenemedi.");
    }
  }, [n]), st = d.useCallback(async (j) => {
    var k, C, F;
    try {
      await n.removeFeature(j), b((I) => I === j ? "general" : I);
    } catch (I) {
      (F = (C = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : C.error) == null || F.call(C, (I == null ? void 0 : I.message) || "Özellik kaldırılamadı.");
    }
  }, [n]);
  X.useEffect(() => {
    if (!w) return;
    const j = (C) => {
      E.current && !E.current.contains(C.target) && g(!1);
    }, k = (C) => {
      C.key === "Escape" && g(!1);
    };
    return document.addEventListener("mousedown", j), document.addEventListener("keydown", k), () => {
      document.removeEventListener("mousedown", j), document.removeEventListener("keydown", k);
    };
  }, [w]);
  const rt = c ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(U, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(U, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(U, { className: "h-24 w-full" })
  ] }) : u ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(N, { variant: "ghost", onClick: () => m(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      Nt,
      {
        trail: l,
        current: { id: r, title: (x == null ? void 0 : x.title) ?? "" },
        onNavigate: tt
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: E, children: [
      /* @__PURE__ */ e.jsx(
        vt,
        {
          tabs: z,
          activeCode: L.code,
          onSelect: (j) => {
            b(j), g(!1);
          },
          onOpenPicker: () => g((j) => !j),
          pickerOpen: w
        }
      ),
      w && /* @__PURE__ */ e.jsx(
        wt,
        {
          entries: A,
          busyCode: n.isMutating ? n.mutatingCode : null,
          onAdd: at,
          onRemove: st
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${L.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          L.code === "general" ? /* @__PURE__ */ e.jsx(
            ht,
            {
              values: h.values,
              errors: h.errors,
              onFieldChange: h.setField,
              assigneeOptions: y.options,
              isLoadingAssignees: y.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(d.Suspense, { fallback: /* @__PURE__ */ e.jsx(U, { className: "h-24 w-full" }), children: J && /* @__PURE__ */ e.jsx(
            J,
            {
              taskId: r,
              task: x,
              onOpenSubtask: et
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            bt,
            {
              task: x,
              creatorName: y.nameById.get(x.creatorId),
              lastModifierName: y.nameById.get(x.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), it = s === "page" ? ct : ot;
  return /* @__PURE__ */ e.jsxs(
    it,
    {
      open: !0,
      fullscreen: D,
      onRequestClose: B,
      title: x ? `Görev Detayı: ${x.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        xt,
        {
          task: x ?? { title: "Yükleniyor…" },
          canDelete: V,
          fullscreen: D,
          onToggleFullscreen: K,
          onClose: B,
          onDelete: () => G(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        mt,
        {
          lastSavedAt: x == null ? void 0 : x.lastModificationTime,
          isDirty: p.isDirty,
          isSaving: q,
          onCancel: B,
          onSave: We
        }
      ),
      children: [
        rt,
        p.pendingClose && /* @__PURE__ */ e.jsx(
          Vt,
          {
            isSaving: q,
            onStay: () => p.resolvePendingClose("stay"),
            onDiscard: () => p.resolvePendingClose("discard"),
            onSaveAndClose: Xe
          }
        ),
        P && /* @__PURE__ */ e.jsx(
          qt,
          {
            taskTitle: (x == null ? void 0 : x.title) ?? "",
            busy: M,
            onCancel: () => G(!1),
            onConfirm: Je
          }
        )
      ]
    }
  );
}
function qt({ taskTitle: t, busy: s, onCancel: a, onConfirm: r }) {
  const [i, l] = d.useState(""), o = i.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    Qe,
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
        /* @__PURE__ */ e.jsx(N, { variant: "secondary", onClick: a, disabled: s, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          N,
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
            onChange: (x) => l(x.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function Qe({ label: t, title: s, description: a, children: r, actions: i }) {
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
function Vt({ isSaving: t, onStay: s, onDiscard: a, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    Qe,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(N, { variant: "secondary", onClick: s, disabled: t, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ e.jsx(N, { variant: "destructive", onClick: a, disabled: t, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ e.jsx(N, { variant: "primary", onClick: r, isLoading: t, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
function _t() {
  return /* @__PURE__ */ e.jsxs(ee, { children: [
    /* @__PURE__ */ e.jsx(te, { asChild: !0, children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-default transition-all shadow-sm", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-lock text-[11px] text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { children: "Sınırlı erişim" }),
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[10px] ml-0.5 text-text-tertiary" })
    ] }) }),
    /* @__PURE__ */ e.jsx(ae, { children: /* @__PURE__ */ e.jsxs(
      se,
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
                  N,
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
          /* @__PURE__ */ e.jsx(Re, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const be = [
  { id: 1, label: "Bekliyor", color: "bg-neutral-subtle text-text-secondary border-subtle", dot: "bg-gray-400" },
  { id: 2, label: "Sürüyor", color: "bg-warning-subtle text-warning border-warning/20", dot: "bg-warning" },
  { id: 3, label: "Testte", color: "bg-primary-subtle text-primary border-primary/20", dot: "bg-primary" },
  { id: 4, label: "Tamamlandı", color: "bg-success-subtle text-success border-success/20", dot: "bg-success" }
], ye = [
  { id: 1, label: "Düşük", color: "text-text-secondary bg-surface-sunken", icon: "fa-arrow-down" },
  { id: 2, label: "Orta", color: "text-warning bg-warning-subtle", icon: "fa-minus" },
  { id: 3, label: "Yüksek", color: "text-negative bg-negative-subtle", icon: "fa-arrow-up" },
  { id: 4, label: "Kritik", color: "text-negative bg-negative-subtle font-bold", icon: "fa-flag" }
];
function Ht({
  task: t = {},
  onClose: s,
  onToggleFullscreen: a,
  isFullscreen: r,
  presentation: i = "modal",
  onFieldChange: l = () => {
  }
}) {
  const [o, x] = d.useState(!1), [c, u] = d.useState(!1), [m, p] = d.useState(t.status || 4), [h, y] = d.useState(t.priority || 4), n = be.find((g) => g.id === m) || be[3], f = ye.find((g) => g.id === h) || ye[3], b = t.code || (t.id ? `#OTL-${t.id.substring(0, 4).toUpperCase()}` : "#OTL-2507"), w = () => {
    var g, E, z, A;
    (g = navigator.clipboard) == null || g.writeText(b), u(!0), (A = (z = (E = window == null ? void 0 : window.abp) == null ? void 0 : E.notify) == null ? void 0 : z.success) == null || A.call(z, `${b} panoya kopyalandı.`), setTimeout(() => u(!1), 2e3);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex flex-col gap-3.5 border-b border-subtle/80 bg-surface-base px-6 py-5", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 min-w-0 flex-1", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 flex-wrap", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: w,
            title: "Kodu Kopyala",
            className: "group flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary-subtle/60 border border-primary/20 text-primary font-mono text-[11px] font-bold tracking-wider hover:bg-primary-subtle hover:border-primary/40 transition-all shadow-xs",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[10px]" }),
              /* @__PURE__ */ e.jsx("span", { children: b.replace("#", "") }),
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c ? "fa-check text-success" : "fa-copy opacity-50 group-hover:opacity-100"} text-[10px] ml-0.5 transition-all` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(ee, { children: [
          /* @__PURE__ */ e.jsx(te, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold border transition-all cursor-pointer shadow-xs hover:opacity-90 ${n.color}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${n.dot} animate-pulse` }),
                /* @__PURE__ */ e.jsx("span", { children: n.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] opacity-70 ml-0.5" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(ae, { children: /* @__PURE__ */ e.jsxs(
            se,
            {
              sideOffset: 4,
              align: "start",
              className: "z-50 w-44 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95",
              children: [
                /* @__PURE__ */ e.jsx("div", { className: "text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1", children: "Durumu Değiştir" }),
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: be.map((g) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      p(g.id), l("status", g.id);
                    },
                    className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${m === g.id ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${g.dot}` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: g.label }),
                      m === g.id && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ]
                  },
                  g.id
                )) })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ e.jsxs(ee, { children: [
          /* @__PURE__ */ e.jsx(te, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold border border-subtle transition-all cursor-pointer shadow-xs hover:bg-surface-hover ${f.color}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${f.icon} text-[11px]` }),
                /* @__PURE__ */ e.jsx("span", { children: f.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] opacity-70 ml-0.5" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(ae, { children: /* @__PURE__ */ e.jsxs(
            se,
            {
              sideOffset: 4,
              align: "start",
              className: "z-50 w-40 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95",
              children: [
                /* @__PURE__ */ e.jsx("div", { className: "text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1", children: "Öncelik Seç" }),
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: ye.map((g) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      y(g.id), l("priority", g.id);
                    },
                    className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${h === g.id ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${g.icon} text-xs` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: g.label }),
                      h === g.id && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ]
                  },
                  g.id
                )) })
              ]
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 mt-1 group", children: [
        /* @__PURE__ */ e.jsx(
          "h1",
          {
            contentEditable: !0,
            suppressContentEditableWarning: !0,
            onBlur: (g) => l("title", g.currentTarget.textContent),
            className: "text-[23px] font-bold tracking-tight text-text-primary hover:text-primary transition-colors focus:outline-none focus:bg-surface-sunken/40 px-1.5 py-0.5 -mx-1.5 rounded-lg cursor-text leading-tight truncate",
            children: t.title || "Otel Konaklama Anlaşması"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => x(!o),
            className: `flex h-8 w-8 items-center justify-center rounded-lg transition-all ${o ? "text-amber-500 bg-amber-50 dark:bg-amber-950/30 scale-110" : "text-text-tertiary hover:bg-surface-hover hover:text-amber-500"}`,
            title: o ? "Favorilerden çıkar" : "Favorilere ekle",
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-${o ? "solid" : "regular"} fa-star text-lg transition-transform` })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
      /* @__PURE__ */ e.jsx(_t, {}),
      /* @__PURE__ */ e.jsx("div", { className: "h-5 w-px bg-subtle mx-1" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1", children: [
        i === "modal" && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: a,
            title: r ? "Küçült" : "Tam Ekran",
            className: "flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors",
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r ? "fa-compress" : "fa-expand"} text-xs` })
          }
        ),
        /* @__PURE__ */ e.jsxs(ee, { children: [
          /* @__PURE__ */ e.jsx(te, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer Seçenekler",
              className: "flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(ae, { children: /* @__PURE__ */ e.jsxs(
            se,
            {
              sideOffset: 4,
              align: "end",
              className: "z-50 w-48 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95",
              children: [
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: w,
                    className: "flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors text-left",
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link text-xs text-text-tertiary" }),
                      /* @__PURE__ */ e.jsx("span", { children: "Bağlantıyı Kopyala" })
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => window.print(),
                    className: "flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors text-left",
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-print text-xs text-text-tertiary" }),
                      /* @__PURE__ */ e.jsx("span", { children: "Yazdır" })
                    ]
                  }
                )
              ]
            }
          ) })
        ] }),
        i === "modal" && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: s,
            title: "Kapat (Esc)",
            className: "flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-negative-subtle hover:text-negative transition-colors ml-1",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-sm" })
          }
        )
      ] })
    ] })
  ] }) });
}
function Y({ label: t, children: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-bold text-text-tertiary uppercase tracking-wider select-none", children: t }),
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center text-[13px] text-text-primary h-8 min-w-0", children: s })
  ] });
}
function Qt({
  task: t = {},
  assigneeOptions: s = [],
  onFieldChange: a = () => {
  }
}) {
  const [r, i] = d.useState(
    Array.isArray(t.tags) && t.tags.length > 0 ? t.tags : ["Konaklama", "Anlaşma"]
  ), [l, o] = d.useState(""), [x, c] = d.useState(!1), u = (n) => {
    if (n.key === "Enter" || n.type === "blur") {
      const f = l.trim();
      if (f && !r.includes(f)) {
        const b = [...r, f];
        i(b), a("tags", b);
      }
      o(""), c(!1);
    }
  }, m = (n) => {
    const f = r.filter((b) => b !== n);
    i(f), a("tags", f);
  }, p = (n) => {
    if (!n) return "—";
    const f = new Date(n);
    return isNaN(f.getTime()) ? n : f.toISOString().split("T")[0];
  }, h = t.assigneeName || "Yakup B.", y = `https://ui-avatars.com/api/?name=${encodeURIComponent(h)}&background=6366f1&color=fff&size=64`;
  return /* @__PURE__ */ e.jsx("div", { className: "px-[var(--apya-space-6)] py-[var(--apya-space-5)] bg-surface-base border-b border-subtle", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-y-[var(--apya-space-5)] gap-x-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsx(Y, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(ee, { children: [
      /* @__PURE__ */ e.jsx(te, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
      /* @__PURE__ */ e.jsx(ae, { children: /* @__PURE__ */ e.jsxs(
        se,
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
    /* @__PURE__ */ e.jsx(Y, { label: "Son Tarih", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors group relative", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          value: p(t.dueDate),
          onChange: (n) => a("dueDate", n.target.value),
          className: "bg-transparent text-text-primary text-[13px] font-medium focus:outline-none cursor-pointer"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(Y, { label: "Başlangıç", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors group relative", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          value: p(t.startDate),
          onChange: (n) => a("startDate", n.target.value),
          className: "bg-transparent text-text-primary text-[13px] font-medium focus:outline-none cursor-pointer"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(Y, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 text-[13px] font-medium", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 text-negative bg-negative-subtle px-2.5 py-0.5 rounded-md font-semibold", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-flag text-xs" }),
      /* @__PURE__ */ e.jsx("span", { children: "Kritik" })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(Y, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 text-[13px] font-medium", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 text-success bg-success-subtle px-2.5 py-0.5 rounded-md font-semibold", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-circle-check text-xs" }),
      /* @__PURE__ */ e.jsx("span", { children: "Tamamlandı" })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(Y, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
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
                onClick: () => m(n),
                className: "opacity-0 group-hover:opacity-100 hover:text-negative transition-opacity ml-0.5",
                "aria-label": "Etiketi kaldır",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
              }
            )
          ]
        },
        n
      )),
      x ? /* @__PURE__ */ e.jsx(
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
    /* @__PURE__ */ e.jsx(Y, { label: "Proje", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary group-hover:text-primary transition-colors text-[13px] truncate max-w-[140px]", children: t.projectName || "Otel Projesi" })
    ] }) }),
    /* @__PURE__ */ e.jsx(Y, { label: "Maliyet Merkezi", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-bullseye text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary group-hover:text-primary transition-colors text-[13px]", children: "Merkez" })
    ] }) })
  ] }) });
}
function Zt({
  activeTab: t = "general",
  onTabChange: s = () => {
  },
  visibleTabs: a = []
}) {
  const r = (i) => i === "subtasks" ? 4 : i === "files" ? 8 : i === "dependencies" ? 2 : null;
  return /* @__PURE__ */ e.jsx("nav", { className: "flex items-center gap-1 overflow-x-auto custom-scrollbar py-2", "aria-label": "Görev Sekmeleri", children: a.map((i) => {
    const l = t === i.code, o = r(i.code);
    return /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => s(i.code),
        className: `relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap select-none ${l ? "text-primary bg-primary-subtle/80 shadow-xs" : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"}`,
        children: [
          /* @__PURE__ */ e.jsx("span", { children: i.title }),
          o !== null && /* @__PURE__ */ e.jsx("span", { className: `flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full text-[10px] font-bold ${l ? "bg-primary text-white" : "bg-surface-sunken text-text-tertiary"}`, children: o }),
          l && /* @__PURE__ */ e.jsx("span", { className: "absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" })
        ]
      },
      i.code
    );
  }) });
}
function $({ label: t, value: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-start py-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary text-right font-medium max-w-[150px] truncate", title: typeof s == "string" ? s : "", children: s ?? "—" })
  ] });
}
function Ee({ label: t, name: s, avatar: a }) {
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
  const [a, r] = d.useState(!1), i = (c) => c ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(c)) : "25.06.2026 14:30", l = () => {
    var u, m, p, h;
    const c = `${window.location.origin}/Tasks?task=${t.id || ""}`;
    (u = navigator.clipboard) == null || u.writeText(c), (h = (p = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : p.success) == null || h.call(p, "Görev bağlantısı panoya kopyalandı!");
  }, o = () => {
    var c, u, m;
    (m = (u = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : u.info) == null || m.call(u, "Görev başarıyla çoğaltıldı.");
  }, x = () => {
    var c, u, m;
    (m = (u = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : u.info) == null || m.call(u, "Görev arşive kaldırıldı.");
  };
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs flex flex-col", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary mb-2", children: "Detaylar" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col divide-y divide-subtle/50", children: [
        /* @__PURE__ */ e.jsx(
          Ee,
          {
            label: "Oluşturan",
            name: "Yakup B.",
            avatar: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64"
          }
        ),
        /* @__PURE__ */ e.jsx($, { label: "Oluşturma Tarihi", value: i(t.creationTime) }),
        /* @__PURE__ */ e.jsx(
          Ee,
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
        N,
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
        N,
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
        N,
        {
          type: "button",
          variant: "outline",
          onClick: x,
          className: "w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]",
          icon: "fa-box-archive",
          children: "Arşivle"
        }
      ),
      /* @__PURE__ */ e.jsx(
        N,
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
  const [a, r] = d.useState(
    t.description || "Önce medine sonra mekke 60 kişilik detaylar dosyada belirtilmiş ve otel rezervasyonları yapılmıştır."
  ), [i, l] = d.useState([
    { id: 1, text: "Otel listesi oluşturuldu", done: !0 },
    { id: 2, text: "Fiyat teklifleri alındı", done: !0 },
    { id: 3, text: "Sözleşme taslağı hazırlandı", done: !0 },
    { id: 4, text: "Sözleşme imzalandı", done: !0 }
  ]), [o, x] = d.useState(!0), [c, u] = d.useState(""), [m, p] = d.useState(!1), h = (v) => {
    l((D) => D.map(
      (S) => S.id === v ? { ...S, done: !S.done } : S
    ));
  }, y = (v) => {
    if (v.key === "Enter" || v.type === "blur") {
      const D = c.trim();
      D && l((S) => [...S, { id: Date.now(), text: D, done: !1 }]), u(""), p(!1);
    }
  }, n = (v) => {
    l((D) => D.filter((S) => S.id !== v));
  }, f = i.filter((v) => v.done).length, [b, w] = d.useState([
    {
      id: 1,
      author: "Elif A.",
      avatar: "https://ui-avatars.com/api/?name=Elif+A&background=ec4899&color=fff&size=64",
      date: "10.07.2026 09:30",
      text: "@Yakup B. Sözleşme dosyası güncellendi, kontrol eder misiniz?",
      likes: 2,
      hasLiked: !1
    }
  ]), [g, E] = d.useState(""), [z, A] = d.useState(!0), L = (v) => {
    v.preventDefault();
    const D = g.trim();
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
    w([S, ...b]), E("");
  }, J = (v) => {
    w((D) => D.map((S) => {
      if (S.id === v) {
        const q = !S.hasLiked;
        return {
          ...S,
          hasLiked: q,
          likes: q ? S.likes + 1 : S.likes - 1
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
            onChange: (v) => {
              r(v.target.value), s("description", v.target.value);
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
          onClick: () => x(!o),
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
        i.map((v) => /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "group flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-surface-hover/70 transition-colors",
            children: [
              /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: v.done,
                    onChange: () => h(v.id),
                    className: "h-4 w-4 rounded border-subtle text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { className: `text-[13px] transition-all truncate ${v.done ? "line-through text-text-tertiary font-normal" : "text-text-primary font-medium"}`, children: v.text })
              ] }),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => n(v.id),
                  className: "opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-negative transition-all p-1",
                  title: "Maddeyi Sil",
                  children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-trash-can text-xs" })
                }
              )
            ]
          },
          v.id
        )),
        m ? /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 mt-1", children: /* @__PURE__ */ e.jsx(
          "input",
          {
            autoFocus: !0,
            type: "text",
            value: c,
            onChange: (v) => u(v.target.value),
            onKeyDown: y,
            onBlur: y,
            placeholder: "Yeni kontrol maddesi yazıp Enter'a basın...",
            className: "w-full h-9 px-3 text-[13px] rounded-lg border border-primary bg-surface-base focus:outline-none"
          }
        ) }) : /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => p(!0),
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
          onClick: () => A(!z),
          className: "flex items-center justify-between cursor-pointer select-none group",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors", children: "Yorumlar & Güncellemeler" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-primary-subtle text-primary text-[11px] font-bold", children: b.length })
            ] }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "text-text-tertiary group-hover:text-text-primary transition-colors", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid fa-chevron-up transition-transform duration-200 ${z ? "" : "rotate-180"}` }) })
          ]
        }
      ),
      z && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-5 animate-in fade-in-50", children: [
        /* @__PURE__ */ e.jsxs("form", { onSubmit: L, className: "flex gap-3 items-start", children: [
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
                value: g,
                onChange: (v) => E(v.target.value),
                placeholder: "Bir yorum yazın... (@bahset, #görev)",
                rows: 2,
                className: "w-full p-3 text-[13px] bg-transparent focus:outline-none resize-none text-text-primary",
                onKeyDown: (v) => {
                  v.key === "Enter" && (v.ctrlKey || v.metaKey) && L(v);
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
                N,
                {
                  type: "submit",
                  size: "sm",
                  disabled: !g.trim(),
                  className: "bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 h-8 rounded-lg shadow-sm",
                  icon: "fa-paper-plane",
                  children: "Gönder"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-4 divide-y divide-subtle/50", children: b.map((v) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-3 pt-3 items-start first:pt-0", children: [
          /* @__PURE__ */ e.jsx("img", { src: v.avatar, alt: v.author, className: "h-8 w-8 rounded-full border border-subtle shrink-0" }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col gap-1", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: v.author }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary font-mono", children: v.date })
              ] }),
              /* @__PURE__ */ e.jsx("button", { type: "button", className: "text-text-tertiary hover:text-text-primary text-xs p-1", title: "İşlemler", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis" }) })
            ] }),
            /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap", children: v.text.split(" ").map((D, S) => D.startsWith("@") ? /* @__PURE__ */ e.jsxs("span", { className: "font-semibold text-primary bg-primary-subtle px-1 py-0.5 rounded mr-1", children: [
              D,
              " "
            ] }, S) : D + " ") }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-4 mt-1", children: [
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => J(v.id),
                  className: `flex items-center gap-1.5 text-xs font-medium transition-colors ${v.hasLiked ? "text-primary" : "text-text-tertiary hover:text-text-primary"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-thumbs-up" }),
                    /* @__PURE__ */ e.jsx("span", { children: v.likes > 0 ? v.likes : "Beğen" })
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
        ] }, v.id)) })
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
        N,
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
        N,
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
const ze = [
  {
    id: 1,
    user: "Yakup B.",
    avatar: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64",
    type: "status",
    category: "field",
    icon: "fa-arrows-rotate",
    iconColor: "text-primary bg-primary-subtle",
    text: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      "Görev durumu ",
      /* @__PURE__ */ e.jsx("strong", { className: "text-success font-semibold", children: "Tamamlandı" }),
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
    icon: "fa-paperclip",
    iconColor: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40",
    text: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      "Dosya eklendi: ",
      /* @__PURE__ */ e.jsx("strong", { className: "text-primary hover:underline cursor-pointer", children: "Sözleşme_v2.pdf" })
    ] }),
    date: "10.07.2026 09:30"
  },
  {
    id: 3,
    user: "Yakup B.",
    avatar: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64",
    type: "date",
    category: "field",
    icon: "fa-calendar",
    iconColor: "text-warning bg-warning-subtle",
    text: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      "Son tarih ",
      /* @__PURE__ */ e.jsx("strong", { className: "line-through opacity-70", children: "12.07.2026" }),
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
    icon: "fa-comment",
    iconColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
    text: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      "Yorum yaptı: ",
      /* @__PURE__ */ e.jsx("span", { className: "italic text-text-secondary", children: '"Otel kapasitesi onaylandı."' })
    ] }),
    date: "09.07.2026 11:10"
  },
  {
    id: 5,
    user: "Sistem",
    avatar: "",
    type: "system",
    category: "system",
    icon: "fa-gear",
    iconColor: "text-text-tertiary bg-surface-sunken",
    text: /* @__PURE__ */ e.jsx(e.Fragment, { children: "Görev oluşturuldu" }),
    date: "25.06.2026 14:30"
  }
];
function ta() {
  const [t, s] = d.useState("all"), a = t === "all" ? ze : ze.filter((r) => r.category === t);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-timeline text-primary text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "AKTİVİTE & GEÇMİŞ TAKİBİ" })
      ] }),
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
    /* @__PURE__ */ e.jsx("div", { className: "relative flex flex-col pl-4 before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-subtle/70", children: a.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "relative flex items-start gap-4 py-3 group", children: [
      /* @__PURE__ */ e.jsx("div", { className: "relative z-10 shrink-0", children: r.avatar ? /* @__PURE__ */ e.jsx(
        "img",
        {
          src: r.avatar,
          alt: r.user,
          className: "h-8 w-8 rounded-full border-2 border-surface-base shadow-xs object-cover"
        }
      ) : /* @__PURE__ */ e.jsx("div", { className: "h-8 w-8 rounded-full bg-surface-sunken border-2 border-surface-base flex items-center justify-center text-text-tertiary shadow-xs", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-server text-xs" }) }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-surface-sunken/40 group-hover:bg-surface-hover/80 border border-subtle/50 transition-all", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: `flex h-5 w-5 items-center justify-center rounded-full ${r.iconColor} text-[10px]`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r.icon}` }) }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: r.user }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-secondary", children: r.text })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary font-mono shrink-0", children: r.date })
      ] })
    ] }, r.id)) })
  ] });
}
const aa = [
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
function sa({ assignedCodes: t = [] }) {
  const s = (a) => t.includes(a);
  return /* @__PURE__ */ e.jsxs(ee, { children: [
    /* @__PURE__ */ e.jsx(te, { asChild: !0, children: /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        className: "flex h-8 w-8 items-center justify-center rounded-md border border-dashed border-text-tertiary text-text-tertiary hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:shadow-focus",
        "aria-label": "Özellik ekle",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[14px]" })
      }
    ) }),
    /* @__PURE__ */ e.jsx(ae, { children: /* @__PURE__ */ e.jsxs(
      se,
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
            aa.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", children: [
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
          /* @__PURE__ */ e.jsx(Re, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const Ae = "apya.taskDetail.fullscreen";
function Ze({
  taskId: t,
  presentation: s = "modal",
  onClose: a,
  switchToTask: r
}) {
  const [i, l] = d.useState(t), { data: o, isLoading: x, isError: c, refetch: u } = Pe(i), m = Z(), p = Ke(), h = Ye(o), y = $e(), n = Ue(i), [f, b] = d.useState("general"), [w, g] = d.useState(
    () => {
      var T;
      return ((T = window.localStorage) == null ? void 0 : T.getItem(Ae)) === "1";
    }
  ), [E, z] = d.useState(!1), A = d.useCallback(() => {
    Me(), a == null || a();
  }, [a]);
  Oe(t, A), X.useEffect(() => {
    h.isDirty ? p.markDirty() : p.markClean();
  });
  const L = d.useCallback(() => p.requestClose(A), [p, A]), J = d.useCallback(() => {
    g((T) => {
      var K;
      const B = !T;
      return (K = window.localStorage) == null || K.setItem(Ae, B ? "1" : "0"), B;
    });
  }, []), v = d.useMemo(
    () => _e(n.assignedCodes),
    [n.assignedCodes]
  ), D = v.find((T) => T.code === f) || v[0], S = d.useCallback(async () => {
    var T, B, K, V, P, G;
    if (!h.validate()) return !1;
    z(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(i, h.toUpdateDto())
      ), await m.invalidateQueries({ queryKey: ["task-detail", i] }), R.emitResult(), (K = (B = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : B.success) == null || K.call(B, "Görev başarıyla güncellendi."), !0;
    } catch (M) {
      return (G = (P = (V = window == null ? void 0 : window.abp) == null ? void 0 : V.notify) == null ? void 0 : P.error) == null || G.call(P, (M == null ? void 0 : M.message) || "Kaydedilemedi."), !1;
    } finally {
      z(!1);
    }
  }, [i, h, m]), q = d.useCallback(async () => {
    var T, B, K, V, P, G;
    if (window.confirm("Bu görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.delete(i)), (K = (B = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : B.info) == null || K.call(B, "Görev silindi."), p.markClean(), A();
      } catch (M) {
        (G = (P = (V = window == null ? void 0 : window.abp) == null ? void 0 : V.notify) == null ? void 0 : P.error) == null || G.call(P, (M == null ? void 0 : M.message) || "Görev silinemedi.");
      }
  }, [i, p, A]), re = x ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(U, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(U, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(U, { className: "h-64 w-full" })
  ] }) : c ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(N, { variant: "ghost", onClick: () => u(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      Ht,
      {
        task: o,
        onClose: L,
        isFullscreen: w,
        onToggleFullscreen: J,
        presentation: s
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "overflow-y-auto max-h-[85vh] custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        Qt,
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
            onTabChange: b,
            visibleTabs: v
          }
        ),
        /* @__PURE__ */ e.jsx("div", { className: "py-2", children: /* @__PURE__ */ e.jsx(sa, { assignedCodes: n.assignedCodes }) })
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
            onDelete: q
          }
        ) })
      ] }) : f === "history" || f === "activity" ? /* @__PURE__ */ e.jsx(ta, {}) : /* @__PURE__ */ e.jsx(d.Suspense, { fallback: /* @__PURE__ */ e.jsx(U, { className: "h-48 w-full" }), children: D != null && D.component ? /* @__PURE__ */ e.jsx(
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
        isDirty: p.isDirty,
        isSaving: E,
        onCancel: L,
        onSave: S
      }
    )
  ] });
  return s === "page" ? /* @__PURE__ */ e.jsx("div", { className: "w-full max-w-6xl mx-auto my-6 rounded-2xl border border-subtle bg-surface-base shadow-sm overflow-hidden", children: re }) : /* @__PURE__ */ e.jsx(
    Be,
    {
      open: !0,
      onOpenChange: (T) => {
        T || L();
      },
      children: /* @__PURE__ */ e.jsx(
        Fe,
        {
          title: o != null && o.title ? `Görev Detayı: ${o.title}` : "Görev Detayı",
          fullscreen: w,
          className: "max-w-6xl p-0 overflow-hidden rounded-2xl border border-subtle shadow-2xl bg-surface-base",
          onInteractOutside: (T) => {
            T.preventDefault(), L();
          },
          onEscapeKeyDown: (T) => {
            T.preventDefault(), L();
          },
          children: re
        }
      )
    }
  );
}
function ra() {
  var s;
  const t = d.useSyncExternalStore(
    R.subscribe,
    R.getSnapshot,
    () => null
  );
  return t ? (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(me, { children: /* @__PURE__ */ e.jsx(
    Ze,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        R.close(), R.emitResult();
      }
    }
  ) }) : /* @__PURE__ */ e.jsx(me, { children: /* @__PURE__ */ e.jsx(
    He,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        R.close(), R.emitResult();
      }
    }
  ) }) : null;
}
function ia() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v2" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : !(window.localStorage.getItem("apya.taskDetail.v2") === "0");
  } catch {
    return !0;
  }
}
function la() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v3" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v2" || new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : window.localStorage.getItem("apya.taskDetail.v3") === "1" || !0;
  } catch {
    return !0;
  }
}
const Ie = document.getElementById("task-detail-island");
if (Ie && (window.apya = window.apya || {}, window.apya.taskDetailV3Enabled = la(), window.apya.taskDetailV2Enabled = ia() && !window.apya.taskDetailV3Enabled, window.apya.taskDetail = {
  open: (t) => R.open(t),
  close: () => R.close(),
  onResult: (t) => R.onResult(t)
}, Le(Ie).render(/* @__PURE__ */ e.jsx(ra, {})), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled)) {
  const t = Ge();
  t && R.open(t);
}
function na({ taskId: t }) {
  var a;
  const s = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(me, { children: /* @__PURE__ */ e.jsx(
    Ze,
    {
      taskId: t,
      presentation: "page",
      onClose: s
    }
  ) }) : /* @__PURE__ */ e.jsx(me, { children: /* @__PURE__ */ e.jsx(
    He,
    {
      taskId: t,
      presentation: "page",
      onClose: s
    }
  ) });
}
const ge = document.getElementById("task-detail-page-island");
if (ge) {
  const t = ge.getAttribute("data-task-id");
  t && Le(ge).render(/* @__PURE__ */ e.jsx(na, { taskId: t }));
}
