import { j as e, r as d, d as xe, b as Oe } from "./react-vendor.js";
/* empty css      */
import { a as Ne } from "./QueryProvider.js";
import { u as he, a as X, b as oe } from "./query-vendor.js";
import { D as Ye, l as qe, e as ke, B as T, I as ce, S as se } from "./Dialog.js";
import { C as lt } from "./Combobox.js";
import { r as ot } from "./httpClient.js";
import { R as ue, T as me, P as pe, C as fe, A as Ue } from "./ui-vendor.js";
function ct({
  open: t,
  onRequestClose: s,
  fullscreen: a,
  title: r,
  header: i,
  footer: l,
  children: o
}) {
  return /* @__PURE__ */ e.jsx(
    Ye,
    {
      open: t,
      onOpenChange: (c) => {
        c || s();
      },
      children: /* @__PURE__ */ e.jsx(
        qe,
        {
          title: r,
          fullscreen: a,
          onInteractOutside: (c) => {
            c.preventDefault(), s();
          },
          onEscapeKeyDown: (c) => {
            c.preventDefault(), s();
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
function dt({ title: t, header: s, footer: a, children: r }) {
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
function xt({ isPrivate: t }) {
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
const ge = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, ze = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function ut({
  task: t,
  canDelete: s,
  onClose: a,
  onDelete: r,
  onToggleFullscreen: i,
  fullscreen: l = !1
}) {
  const [o, c] = d.useState(!1), x = d.useRef(null);
  d.useEffect(() => {
    if (!o) return;
    const y = (u) => {
      x.current && !x.current.contains(u.target) && c(!1);
    }, n = (u) => {
      u.key === "Escape" && c(!1);
    };
    return document.addEventListener("mousedown", y), document.addEventListener("keydown", n), () => {
      document.removeEventListener("mousedown", y), document.removeEventListener("keydown", n);
    };
  }, [o]);
  const h = ge[t == null ? void 0 : t.status] ?? ge[1], f = ze[t == null ? void 0 : t.priority] ?? ze[2], m = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), c(!1);
  }, g = () => {
    var n, u, b, j;
    const y = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (n = navigator.clipboard) == null || n.writeText(y), (j = (b = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : b.info) == null || j.call(b, "Bağlantı kopyalandı."), c(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(ke, { variant: h.variant, children: h.text }),
        /* @__PURE__ */ e.jsx(ke, { variant: f.variant, children: f.text }),
        /* @__PURE__ */ e.jsx(xt, { isPrivate: t == null ? void 0 : t.isPrivate })
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
      /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: x, children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": o,
            onClick: () => c((y) => !y),
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
                  onClick: g,
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
                      c(!1), r();
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
const mt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function pt({ lastSavedAt: t, isDirty: s, isSaving: a, onCancel: r, onSave: i }) {
  const l = mt(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: l ? `Son kayıt: ${l}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(T, { variant: "secondary", onClick: r, disabled: a, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        T,
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
const Be = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", ft = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function ee({ label: t, htmlFor: s, error: a, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: s, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    a && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: a })
  ] });
}
function ht({ value: t, onChange: s }) {
  const [a, r] = d.useState(""), i = () => {
    const l = a.trim();
    l && !t.includes(l) && s([...t, l]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((l) => /* @__PURE__ */ e.jsxs(ke, { variant: "neutral", children: [
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
      ce,
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
function bt({
  values: t,
  errors: s,
  onFieldChange: a,
  assigneeOptions: r = [],
  isLoadingAssignees: i = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(ee, { label: "Başlık", htmlFor: "task-title", error: s.title, children: /* @__PURE__ */ e.jsx(
      ce,
      {
        id: "task-title",
        value: t.title,
        onChange: (l) => a("title", l.target.value),
        invalid: !!s.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(ee, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (l) => a("status", Number(l.target.value)),
          className: Be,
          children: Object.entries(ge).map(([l, o]) => /* @__PURE__ */ e.jsx("option", { value: l, children: o.text }, l))
        }
      ) }),
      /* @__PURE__ */ e.jsx(ee, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (l) => a("priority", Number(l.target.value)),
          className: Be,
          children: Object.entries(ze).map(([l, o]) => /* @__PURE__ */ e.jsx("option", { value: l, children: o.text }, l))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(ee, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
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
      /* @__PURE__ */ e.jsx(ee, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: s.startDate, children: /* @__PURE__ */ e.jsx(
        ce,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (l) => a("startDate", l.target.value),
          invalid: !!s.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(ee, { label: "Son Tarih", htmlFor: "task-due", error: s.dueDate, children: /* @__PURE__ */ e.jsx(
        ce,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (l) => a("dueDate", l.target.value),
          invalid: !!s.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(ee, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(ht, { value: t.tagNames, onChange: (l) => a("tagNames", l) }) }),
    /* @__PURE__ */ e.jsx(ee, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (l) => a("description", l.target.value),
        className: ft
      }
    ) })
  ] });
}
const Re = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function ye({ label: t, value: s }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: s ?? "—" })
  ] });
}
function yt({ task: t, creatorName: s, lastModifierName: a }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(ye, { label: "Oluşturan", value: s }),
      /* @__PURE__ */ e.jsx(ye, { label: "Oluşturulma zamanı", value: Re(t.creationTime) }),
      /* @__PURE__ */ e.jsx(ye, { label: "Güncelleyen", value: a }),
      /* @__PURE__ */ e.jsx(ye, { label: "Son güncelleme zamanı", value: Re(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(ye, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const gt = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", vt = "border-brand-500 text-text-primary";
function jt({ tabs: t, activeCode: s, onSelect: a, onOpenPicker: r, pickerOpen: i }) {
  const l = d.useRef(/* @__PURE__ */ new Map()), o = (x) => {
    var h;
    a(x.code), (h = l.current.get(x.code)) == null || h.focus();
  }, c = (x, h) => {
    x.key === "ArrowRight" ? (x.preventDefault(), o(t[(h + 1) % t.length])) : x.key === "ArrowLeft" ? (x.preventDefault(), o(t[(h - 1 + t.length) % t.length])) : x.key === "Home" ? (x.preventDefault(), o(t[0])) : x.key === "End" && (x.preventDefault(), o(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((x, h) => {
      const f = x.code === s;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (m) => {
            m ? l.current.set(x.code, m) : l.current.delete(x.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${x.code}`,
          "aria-selected": f,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: f ? 0 : -1,
          onClick: () => a(x.code),
          onKeyDown: (m) => c(m, h),
          className: `${gt} ${f ? vt : ""}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa ${x.icon}`, "aria-hidden": "true" }),
            x.title
          ]
        },
        x.code
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
const wt = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Nt({ entries: t, onAdd: s, onRemove: a, busyCode: r }) {
  const [i, l] = d.useState(""), o = d.useMemo(() => {
    const c = i.trim().toLocaleLowerCase("tr-TR"), x = c ? t.filter((f) => f.title.toLocaleLowerCase("tr-TR").includes(c)) : t, h = /* @__PURE__ */ new Map();
    return x.forEach((f) => {
      const m = h.get(f.category) ?? [];
      m.push(f), h.set(f.category, m);
    }), h;
  }, [t, i]);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Özellik ekle",
      className: "absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl",
      children: [
        /* @__PURE__ */ e.jsx(
          ce,
          {
            autoFocus: !0,
            value: i,
            onChange: (c) => l(c.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          o.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...o.entries()].map(([c, x]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: wt[c] ?? c }),
            x.map((h) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa ${h.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: h.title }),
              !h.implemented && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              h.implemented && !h.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === h.code,
                  onClick: () => s(h.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              h.implemented && h.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === h.code,
                  onClick: () => a(h.code),
                  className: "text-[13px] font-medium text-text-negative hover:underline disabled:opacity-50",
                  children: "Kaldır"
                }
              )
            ] }, h.code))
          ] }, c))
        ] })
      ]
    }
  );
}
function kt({ trail: t = [], current: s, onNavigate: a }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((r) => /* @__PURE__ */ e.jsxs(xe.Fragment, { children: [
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
function Ct(t) {
  var a, r, i;
  const s = (i = (r = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : r.tasks) == null ? void 0 : i.task;
  return s ? Promise.resolve(s.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ve(t) {
  return he({
    queryKey: ["task-detail", t],
    queryFn: () => Ct(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function Ce(t) {
  var s, a, r;
  return !!((r = (a = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.auth) == null ? void 0 : a.isGranted) != null && r.call(a, t));
}
function _e() {
  const [t, s] = d.useState(!1), [a, r] = d.useState(!1), i = d.useRef(null), l = d.useCallback(() => s(!0), []), o = d.useCallback(() => s(!1), []);
  d.useEffect(() => {
    if (!t) return;
    const h = (f) => {
      f.preventDefault(), f.returnValue = "";
    };
    return window.addEventListener("beforeunload", h), () => window.removeEventListener("beforeunload", h);
  }, [t]);
  const c = d.useCallback((h) => {
    if (!t) {
      h == null || h();
      return;
    }
    i.current = h ?? null, r(!0);
  }, [t]), x = d.useCallback((h) => {
    const f = i.current;
    return r(!1), i.current = null, h === "discard" && (s(!1), f == null || f()), h === "save" ? f : null;
  }, []);
  return { isDirty: t, markDirty: l, markClean: o, requestClose: c, pendingClose: a, resolvePendingClose: x };
}
const Tt = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, Ae = "task";
function Qe() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(Ae);
  return t && Tt.test(t) ? t : null;
}
function He() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(Ae), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function Ze(t, s) {
  const a = d.useRef(s);
  a.current = s, d.useEffect(() => {
    if (!t || Qe() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(Ae, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), d.useEffect(() => {
    const r = () => {
      var i;
      (i = a.current) == null || i.call(a);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const Dt = {
  title: "",
  description: "",
  startDate: "",
  dueDate: "",
  status: 1,
  priority: 2,
  assigneeId: null,
  tagNames: []
};
function St(t) {
  return t ? {
    title: t.title ?? "",
    description: t.description ?? "",
    startDate: t.startDate ? t.startDate.slice(0, 10) : "",
    dueDate: t.dueDate ? t.dueDate.slice(0, 10) : "",
    status: t.status ?? 1,
    priority: t.priority ?? 2,
    assigneeId: t.assigneeId ?? null,
    tagNames: (t.tags ?? []).map((s) => s.name)
  } : Dt;
}
function We(t) {
  const [s, a] = d.useState(t == null ? void 0 : t.id), r = d.useMemo(() => St(t), [t]), [i, l] = d.useState(r), [o, c] = d.useState({});
  (t == null ? void 0 : t.id) !== s && (a(t == null ? void 0 : t.id), l(r), c({}));
  const x = d.useCallback((y, n) => {
    l((u) => ({ ...u, [y]: n }));
  }, []), h = d.useMemo(
    () => JSON.stringify(i) !== JSON.stringify(r),
    [i, r]
  ), f = d.useCallback(() => {
    const y = {};
    return i.title.trim() || (y.title = "Başlık zorunlu."), i.startDate || (y.startDate = "Başlangıç tarihi zorunlu."), i.dueDate && i.startDate && i.dueDate < i.startDate && (y.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), c(y), Object.keys(y).length === 0;
  }, [i]), m = d.useCallback(() => ({
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
  }), [i, t]), g = d.useCallback(() => {
    l(r), c({});
  }, [r]);
  return { values: i, setField: x, isDirty: h, errors: o, validate: f, toUpdateDto: m, reset: g };
}
function Le(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function Et() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Je() {
  var i;
  const t = he({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Et,
    staleTime: 3e5,
    retry: !1
  }), s = ((i = t.data) == null ? void 0 : i.items) ?? [], a = s.map((l) => ({ value: l.id, label: Le(l) })), r = new Map(s.map((l) => [l.id, Le(l)]));
  return { options: a, nameById: r, isLoading: t.isLoading };
}
function Ie() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function zt(t) {
  const s = Ie();
  return s ? Promise.resolve(s.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Xe(t) {
  const s = X(), a = ["task-features", t], r = he({
    queryKey: a,
    queryFn: () => zt(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => s.invalidateQueries({ queryKey: a }), l = oe({
    mutationFn: (c) => Promise.resolve(Ie().addFeature(t, c)),
    onSuccess: i
  }), o = oe({
    mutationFn: (c) => Promise.resolve(Ie().removeFeature(t, c)),
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
function It({ taskId: t, task: s, onOpenSubtask: a }) {
  const [r, i] = d.useState(""), [l, o] = d.useState(!1), [c, x] = d.useState(null), h = X(), f = (s == null ? void 0 : s.subTasks) ?? [], m = () => h.invalidateQueries({ queryKey: ["task-detail", t] }), g = async () => {
    var u, b, j;
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
      } catch (v) {
        (j = (b = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : b.error) == null || j.call(b, (v == null ? void 0 : v.message) || "Alt görev eklenemedi.");
      } finally {
        o(!1);
      }
    }
  }, y = async (n) => {
    var u, b, j;
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(n)), await m();
    } catch (v) {
      (j = (b = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : b.error) == null || j.call(b, (v == null ? void 0 : v.message) || "Alt görev silinemedi.");
    } finally {
      x(null);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        ce,
        {
          value: r,
          onChange: (n) => i(n.target.value),
          onKeyDown: (n) => {
            n.key === "Enter" && g();
          },
          placeholder: "Yeni alt görev başlığı",
          disabled: l
        }
      ),
      /* @__PURE__ */ e.jsx(T, { variant: "secondary", onClick: g, disabled: l || !r.trim(), children: "Alt Görev Ekle" })
    ] }),
    f.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz alt görev yok." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: f.map((n) => {
      var u, b;
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
          /* @__PURE__ */ e.jsx(ke, { variant: ((u = ge[n.status]) == null ? void 0 : u.variant) ?? "neutral", children: ((b = ge[n.status]) == null ? void 0 : b.text) ?? n.status }),
          c === n.id ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary", children: "Emin misiniz?" }),
            /* @__PURE__ */ e.jsx(T, { variant: "destructive", onClick: () => y(n.id), children: "Evet, sil" }),
            /* @__PURE__ */ e.jsx(T, { variant: "ghost", onClick: () => x(null), children: "Vazgeç" })
          ] }) : /* @__PURE__ */ e.jsx(T, { variant: "ghost", onClick: () => x(n.id), "aria-label": `${n.title} alt görevini sil`, children: "Sil" })
        ] })
      ] }, n.id);
    }) })
  ] });
}
function et() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function At(t) {
  const s = et();
  return s ? Promise.resolve(s.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function Bt(t, s) {
  const a = new FormData();
  a.append("file", s);
  const r = {}, i = ot();
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
function Rt(t) {
  const s = X(), a = ["task-attachments", t], r = he({
    queryKey: a,
    queryFn: () => At(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => s.invalidateQueries({ queryKey: a }), l = oe({
    mutationFn: (c) => Bt(t, c),
    onSuccess: i
  }), o = oe({
    mutationFn: (c) => Promise.resolve(et().deleteAttachment(c)),
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
function Lt(t) {
  return `${Math.round(t / 1024)} KB`;
}
function Ft({ taskId: t }) {
  const { attachments: s, upload: a, remove: r, isUploading: i } = Rt(t), l = d.useRef(null), o = async (x) => {
    var f, m, g, y, n, u, b;
    const h = (f = x.target.files) == null ? void 0 : f[0];
    if (h)
      try {
        await a(h), (y = (g = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : g.success) == null || y.call(g, "Dosya yüklendi.");
      } catch (j) {
        (b = (u = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.notify) == null ? void 0 : u.error) == null || b.call(u, (j == null ? void 0 : j.message) || "Dosya yüklenemedi.");
      } finally {
        l.current && (l.current.value = "");
      }
  }, c = async (x, h) => {
    var f, m, g;
    try {
      await r(x);
    } catch (y) {
      (g = (m = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : m.error) == null || g.call(m, (y == null ? void 0 : y.message) || `${h} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("input", { ref: l, type: "file", onChange: o, className: "text-sm", disabled: i }),
      i && /* @__PURE__ */ e.jsx("span", { className: "text-sm text-text-tertiary", children: "Yükleniyor…" })
    ] }),
    s.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: s.map((x) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between py-2", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("a", { href: x.downloadUrl, target: "_blank", rel: "noreferrer", className: "text-sm font-medium text-text-primary hover:underline", children: x.fileName }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-text-tertiary", children: [
          Lt(x.fileSize),
          " — ",
          x.uploaderName
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(T, { variant: "ghost", onClick: () => c(x.id, x.fileName), "aria-label": `${x.fileName} dosyasini sil`, children: "Sil" })
    ] }, x.id)) })
  ] });
}
function je() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Pt(t) {
  const s = je();
  return s ? Promise.resolve(s.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function tt(t) {
  const s = X(), a = ["task-checklist", t], r = he({
    queryKey: a,
    queryFn: () => Pt(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => s.invalidateQueries({ queryKey: a }), l = oe({
    mutationFn: (x) => Promise.resolve(je().addChecklistItem(t, x)),
    onSuccess: i
  }), o = oe({
    mutationFn: (x) => Promise.resolve(je().toggleChecklistItem(x)),
    onSuccess: i
  }), c = oe({
    mutationFn: (x) => Promise.resolve(je().deleteChecklistItem(x)),
    onSuccess: i
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: l.mutateAsync,
    toggleItem: o.mutateAsync,
    removeItem: c.mutateAsync
  };
}
function Kt({ taskId: t }) {
  const { items: s, addItem: a, toggleItem: r, removeItem: i } = tt(t), [l, o] = d.useState(""), c = async () => {
    var m, g, y;
    const f = l.trim();
    if (f)
      try {
        await a(f), o("");
      } catch (n) {
        (y = (g = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : g.error) == null || y.call(g, (n == null ? void 0 : n.message) || "Madde eklenemedi.");
      }
  }, x = async (f) => {
    var m, g, y;
    try {
      await r(f);
    } catch (n) {
      (y = (g = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : g.error) == null || y.call(g, (n == null ? void 0 : n.message) || "Madde güncellenemedi.");
    }
  }, h = async (f, m) => {
    var g, y, n;
    try {
      await i(f);
    } catch (u) {
      (n = (y = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : y.error) == null || n.call(y, (u == null ? void 0 : u.message) || `${m} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        ce,
        {
          value: l,
          onChange: (f) => o(f.target.value),
          onKeyDown: (f) => {
            f.key === "Enter" && c();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ e.jsx(T, { variant: "secondary", onClick: c, disabled: !l.trim(), children: "Ekle" })
    ] }),
    s.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz madde eklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "space-y-1.5", children: s.map((f) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-2 py-1", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: f.isDone,
            onChange: () => x(f.id)
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: f.isDone ? "text-text-tertiary line-through" : "text-text-primary", children: f.text })
      ] }),
      /* @__PURE__ */ e.jsx(T, { variant: "ghost", onClick: () => h(f.id, f.text), "aria-label": `${f.text} maddesini sil`, children: "Sil" })
    ] }, f.id)) })
  ] });
}
function Gt({ taskId: t, task: s }) {
  const [a, r] = d.useState(""), [i, l] = d.useState(null), [o, c] = d.useState(""), [x, h] = d.useState(!1), f = X(), m = (s == null ? void 0 : s.comments) ?? [], g = async (n) => {
    var u, b, j, v, R, E;
    if (n == null || n.preventDefault(), !(!a.trim() || x)) {
      h(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, a.trim())
        ), r(""), f.invalidateQueries({ queryKey: ["task-detail", t] }), (j = (b = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : b.success) == null || j.call(b, "Yorum eklendi.");
      } catch (z) {
        (E = (R = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : R.error) == null || E.call(R, (z == null ? void 0 : z.message) || "Yorum eklenemedi.");
      } finally {
        h(!1);
      }
    }
  }, y = async (n) => {
    var u, b, j, v, R, E;
    if (!(!o.trim() || x)) {
      h(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(n, o.trim())
        ), c(""), l(null), f.invalidateQueries({ queryKey: ["task-detail", t] }), (j = (b = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : b.success) == null || j.call(b, "Yanıt eklendi.");
      } catch (z) {
        (E = (R = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : R.error) == null || E.call(R, (z == null ? void 0 : z.message) || "Yanıt eklenemedi.");
      } finally {
        h(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("form", { onSubmit: g, className: "rounded-lg border border-default p-3 bg-surface-base", children: [
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
        T,
        {
          type: "submit",
          variant: "primary",
          disabled: !a.trim() || x,
          isLoading: x,
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
        T,
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
            onChange: (u) => c(u.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(T, { variant: "ghost", size: "sm", onClick: () => l(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(T, { variant: "primary", size: "sm", disabled: !o.trim() || x, onClick: () => y(n.id), children: "Gönder" })
        ] })
      ] }),
      n.replies && n.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: n.replies.map((u) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: u.creatorUserName || u.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: u.creationTime ? new Date(u.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: u.text })
      ] }, u.id)) })
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
function $t({ task: t }) {
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
function Ot({ task: t }) {
  var h;
  const s = typeof window < "u" && !!((h = window == null ? void 0 : window.abp) != null && h.auth), a = s ? Ce("Platform.Expenses.Default") : !0, r = s ? Ce("Platform.Incomes.Default") : !0;
  if (!a && !r)
    return /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Finansal verileri görüntüleme yetkiniz bulunmuyor." });
  const i = (t == null ? void 0 : t.expenses) || [], l = (t == null ? void 0 : t.incomes) || [], o = i.reduce((f, m) => f + (m.amount || 0), 0), c = l.reduce((f, m) => f + (m.amount || 0), 0), x = c - o;
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated", children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Toplam Gelir" }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-base font-semibold text-text-positive", children: [
          c.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
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
        /* @__PURE__ */ e.jsxs("p", { className: `text-base font-semibold ${x >= 0 ? "text-text-positive" : "text-text-negative"}`, children: [
          x.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
          " ₺"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "rounded-lg border border-subtle p-3 bg-surface-base text-xs text-text-secondary", children: /* @__PURE__ */ e.jsx("p", { children: "Göreve bağlı detaylı harcama veya fatura ekleme işlemleri Finans Modülü üzerinden senkronize yönetilmektedir." }) })
  ] });
}
function ve({ task: t }) {
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
const at = [
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
    component: It
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
    component: $t
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
    component: Ot
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
    component: ve
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
    component: ve
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
    component: ve
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
    component: ve
  }
];
function st(t = []) {
  const s = new Set(t);
  return at.filter((a) => a.implemented && (a.isCore || s.has(a.code))).sort((a, r) => a.order - r.order);
}
function Yt(t = []) {
  const s = new Set(t);
  return at.filter((a) => !a.isCore).filter((a) => !a.permission || Ce(a.permission)).map((a) => ({ ...a, isAssigned: s.has(a.code) })).sort((a, r) => a.order - r.order);
}
let de = null;
const we = /* @__PURE__ */ new Set(), Te = /* @__PURE__ */ new Set();
function Fe() {
  we.forEach((t) => t());
}
function qt(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const _ = {
  open(t) {
    const s = qt(t);
    !s || s === de || (de = s, Fe());
  },
  close() {
    de !== null && (de = null, Fe());
  },
  subscribe(t) {
    return we.add(t), () => we.delete(t);
  },
  getSnapshot() {
    return de;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && Te.add(t);
  },
  emitResult() {
    Te.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    de = null, we.clear(), Te.clear();
  }
}, Pe = "apya.taskDetail.fullscreen";
function rt({ taskId: t, presentation: s = "modal", onClose: a }) {
  const [r, i] = d.useState(t), [l, o] = d.useState([]), { data: c, isLoading: x, isError: h, refetch: f } = Ve(r), m = _e(), g = We(c), y = Je(), n = Xe(r), [u, b] = d.useState("general"), [j, v] = d.useState(!1), R = xe.useRef(null), E = d.useMemo(
    () => st(n.assignedCodes),
    [n.assignedCodes]
  ), z = d.useMemo(
    () => Yt(n.assignedCodes),
    [n.assignedCodes]
  ), C = E.find((k) => k.code === u) ?? E[0];
  xe.useEffect(() => {
    C.code !== u && b(C.code);
  }, [C, u]);
  const q = C == null ? void 0 : C.component, $ = X(), [Q, J] = d.useState(
    () => {
      var k;
      return ((k = window.localStorage) == null ? void 0 : k.getItem(Pe)) === "1";
    }
  ), [re, ie] = d.useState(!1), H = d.useCallback(() => {
    He(), a == null || a();
  }, [a]);
  Ze(t, H), xe.useEffect(() => {
    g.isDirty ? m.markDirty() : m.markClean();
  });
  const D = d.useCallback(() => m.requestClose(H), [m, H]), F = d.useCallback(() => {
    J((k) => {
      var B;
      const A = !k;
      return (B = window.localStorage) == null || B.setItem(Pe, A ? "1" : "0"), A;
    });
  }, []), M = Ce("Platform.Tasks.Delete"), [U, K] = d.useState(!1), [p, w] = d.useState(!1), N = d.useCallback(async () => {
    var k, A, B, V, P, be;
    w(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (B = (A = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : A.info) == null || B.call(A, "Başarıyla silindi."), K(!1), m.markClean(), H();
    } catch (le) {
      (be = (P = (V = window == null ? void 0 : window.abp) == null ? void 0 : V.notify) == null ? void 0 : P.error) == null || be.call(P, (le == null ? void 0 : le.message) || "Görev silinemedi.");
    } finally {
      w(!1);
    }
  }, [r, m, H]), I = d.useCallback(async () => {
    var k, A, B, V, P, be;
    if (!g.validate()) return !1;
    ie(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, g.toUpdateDto())
      ), await $.invalidateQueries({ queryKey: ["task-detail", r] }), _.emitResult(), (B = (A = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : A.success) == null || B.call(A, "Kaydedildi."), !0;
    } catch (le) {
      return (be = (P = (V = window == null ? void 0 : window.abp) == null ? void 0 : V.notify) == null ? void 0 : P.error) == null || be.call(P, (le == null ? void 0 : le.message) || "Kaydedilemedi."), !1;
    } finally {
      ie(!1);
    }
  }, [r, g, m, $]), S = d.useCallback(() => {
    I();
  }, [I]), L = d.useCallback(async () => {
    const k = m.resolvePendingClose("save");
    await I() && (k == null || k());
  }, [m, I]), G = d.useCallback((k, A) => {
    m.requestClose(() => {
      o((B) => [...B, { id: r, title: (c == null ? void 0 : c.title) ?? "" }]), i(k), b("general"), m.markClean();
    });
  }, [m, r, c]), O = d.useCallback((k) => {
    m.requestClose(() => {
      o((A) => {
        const B = A.findIndex((V) => V.id === k);
        return B === -1 ? A : A.slice(0, B);
      }), i(k), b("general"), m.markClean();
    });
  }, [m]), Z = d.useCallback(async (k) => {
    var A, B, V;
    try {
      await n.addFeature(k), b(k), v(!1);
    } catch (P) {
      (V = (B = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : B.error) == null || V.call(B, (P == null ? void 0 : P.message) || "Özellik eklenemedi.");
    }
  }, [n]), W = d.useCallback(async (k) => {
    var A, B, V;
    try {
      await n.removeFeature(k), b((P) => P === k ? "general" : P);
    } catch (P) {
      (V = (B = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : B.error) == null || V.call(B, (P == null ? void 0 : P.message) || "Özellik kaldırılamadı.");
    }
  }, [n]);
  xe.useEffect(() => {
    if (!j) return;
    const k = (B) => {
      R.current && !R.current.contains(B.target) && v(!1);
    }, A = (B) => {
      B.key === "Escape" && v(!1);
    };
    return document.addEventListener("mousedown", k), document.addEventListener("keydown", A), () => {
      document.removeEventListener("mousedown", k), document.removeEventListener("keydown", A);
    };
  }, [j]);
  const ne = x ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(se, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(se, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(se, { className: "h-24 w-full" })
  ] }) : h ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(T, { variant: "ghost", onClick: () => f(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      kt,
      {
        trail: l,
        current: { id: r, title: (c == null ? void 0 : c.title) ?? "" },
        onNavigate: O
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: R, children: [
      /* @__PURE__ */ e.jsx(
        jt,
        {
          tabs: E,
          activeCode: C.code,
          onSelect: (k) => {
            b(k), v(!1);
          },
          onOpenPicker: () => v((k) => !k),
          pickerOpen: j
        }
      ),
      j && /* @__PURE__ */ e.jsx(
        Nt,
        {
          entries: z,
          busyCode: n.isMutating ? n.mutatingCode : null,
          onAdd: Z,
          onRemove: W
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${C.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          C.code === "general" ? /* @__PURE__ */ e.jsx(
            bt,
            {
              values: g.values,
              errors: g.errors,
              onFieldChange: g.setField,
              assigneeOptions: y.options,
              isLoadingAssignees: y.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(d.Suspense, { fallback: /* @__PURE__ */ e.jsx(se, { className: "h-24 w-full" }), children: q && /* @__PURE__ */ e.jsx(
            q,
            {
              taskId: r,
              task: c,
              onOpenSubtask: G
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            yt,
            {
              task: c,
              creatorName: y.nameById.get(c.creatorId),
              lastModifierName: y.nameById.get(c.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), Y = s === "page" ? dt : ct;
  return /* @__PURE__ */ e.jsxs(
    Y,
    {
      open: !0,
      fullscreen: Q,
      onRequestClose: D,
      title: c ? `Görev Detayı: ${c.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        ut,
        {
          task: c ?? { title: "Yükleniyor…" },
          canDelete: M,
          fullscreen: Q,
          onToggleFullscreen: F,
          onClose: D,
          onDelete: () => K(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        pt,
        {
          lastSavedAt: c == null ? void 0 : c.lastModificationTime,
          isDirty: m.isDirty,
          isSaving: re,
          onCancel: D,
          onSave: S
        }
      ),
      children: [
        ne,
        m.pendingClose && /* @__PURE__ */ e.jsx(
          Vt,
          {
            isSaving: re,
            onStay: () => m.resolvePendingClose("stay"),
            onDiscard: () => m.resolvePendingClose("discard"),
            onSaveAndClose: L
          }
        ),
        U && /* @__PURE__ */ e.jsx(
          Ut,
          {
            taskTitle: (c == null ? void 0 : c.title) ?? "",
            busy: p,
            onCancel: () => K(!1),
            onConfirm: N
          }
        )
      ]
    }
  );
}
function Ut({ taskTitle: t, busy: s, onCancel: a, onConfirm: r }) {
  const [i, l] = d.useState(""), o = i.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    it,
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
        /* @__PURE__ */ e.jsx(T, { variant: "secondary", onClick: a, disabled: s, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          T,
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
            onChange: (c) => l(c.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function it({ label: t, title: s, description: a, children: r, actions: i }) {
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
    it,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(T, { variant: "secondary", onClick: s, disabled: t, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ e.jsx(T, { variant: "destructive", onClick: a, disabled: t, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ e.jsx(T, { variant: "primary", onClick: r, isLoading: t, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
function _t() {
  return /* @__PURE__ */ e.jsxs(ue, { children: [
    /* @__PURE__ */ e.jsx(me, { asChild: !0, children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-default transition-all shadow-sm", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-lock text-[11px] text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { children: "Sınırlı erişim" }),
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[10px] ml-0.5 text-text-tertiary" })
    ] }) }),
    /* @__PURE__ */ e.jsx(pe, { children: /* @__PURE__ */ e.jsxs(
      fe,
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
                  T,
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
          /* @__PURE__ */ e.jsx(Ue, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const De = [
  { id: 1, label: "Bekliyor", color: "bg-neutral-subtle text-text-secondary border-subtle", dot: "bg-gray-400" },
  { id: 2, label: "Sürüyor", color: "bg-warning-subtle text-warning border-warning/20", dot: "bg-warning" },
  { id: 3, label: "Testte", color: "bg-primary-subtle text-primary border-primary/20", dot: "bg-primary" },
  { id: 4, label: "Tamamlandı", color: "bg-success-subtle text-success border-success/20", dot: "bg-success" }
], Se = [
  { id: 1, label: "Düşük", color: "text-text-secondary bg-surface-sunken", icon: "fa-arrow-down" },
  { id: 2, label: "Orta", color: "text-warning bg-warning-subtle", icon: "fa-minus" },
  { id: 3, label: "Yüksek", color: "text-negative bg-negative-subtle", icon: "fa-arrow-up" },
  { id: 4, label: "Kritik", color: "text-negative bg-negative-subtle font-bold", icon: "fa-flag" }
];
function Qt({
  task: t = {},
  onClose: s,
  onToggleFullscreen: a,
  isFullscreen: r,
  presentation: i = "modal",
  onFieldChange: l = () => {
  }
}) {
  const [o, c] = d.useState(!1), [x, h] = d.useState(!1), [f, m] = d.useState(t.status || 4), [g, y] = d.useState(t.priority || 4), n = De.find((v) => v.id === f) || De[3], u = Se.find((v) => v.id === g) || Se[3], b = t.code || (t.id ? `#OTL-${t.id.substring(0, 4).toUpperCase()}` : "#OTL-2507"), j = () => {
    var v, R, E, z;
    (v = navigator.clipboard) == null || v.writeText(b), h(!0), (z = (E = (R = window == null ? void 0 : window.abp) == null ? void 0 : R.notify) == null ? void 0 : E.success) == null || z.call(E, `${b} panoya kopyalandı.`), setTimeout(() => h(!1), 2e3);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex flex-col gap-3.5 border-b border-subtle/80 bg-surface-base px-6 py-5", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 min-w-0 flex-1", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 flex-wrap", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: j,
            title: "Kodu Kopyala",
            className: "group flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary-subtle/60 border border-primary/20 text-primary font-mono text-[11px] font-bold tracking-wider hover:bg-primary-subtle hover:border-primary/40 transition-all shadow-xs",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[10px]" }),
              /* @__PURE__ */ e.jsx("span", { children: b.replace("#", "") }),
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x ? "fa-check text-success" : "fa-copy opacity-50 group-hover:opacity-100"} text-[10px] ml-0.5 transition-all` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(ue, { children: [
          /* @__PURE__ */ e.jsx(me, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
          /* @__PURE__ */ e.jsx(pe, { children: /* @__PURE__ */ e.jsxs(
            fe,
            {
              sideOffset: 4,
              align: "start",
              className: "z-50 w-44 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95",
              children: [
                /* @__PURE__ */ e.jsx("div", { className: "text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1", children: "Durumu Değiştir" }),
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: De.map((v) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      m(v.id), l("status", v.id);
                    },
                    className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${f === v.id ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${v.dot}` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: v.label }),
                      f === v.id && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ]
                  },
                  v.id
                )) })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ e.jsxs(ue, { children: [
          /* @__PURE__ */ e.jsx(me, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold border border-subtle transition-all cursor-pointer shadow-xs hover:bg-surface-hover ${u.color}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-[11px]` }),
                /* @__PURE__ */ e.jsx("span", { children: u.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] opacity-70 ml-0.5" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(pe, { children: /* @__PURE__ */ e.jsxs(
            fe,
            {
              sideOffset: 4,
              align: "start",
              className: "z-50 w-40 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95",
              children: [
                /* @__PURE__ */ e.jsx("div", { className: "text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1", children: "Öncelik Seç" }),
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: Se.map((v) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      y(v.id), l("priority", v.id);
                    },
                    className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${g === v.id ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${v.icon} text-xs` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: v.label }),
                      g === v.id && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ]
                  },
                  v.id
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
            onBlur: (v) => l("title", v.currentTarget.textContent),
            className: "text-[23px] font-bold tracking-tight text-text-primary hover:text-primary transition-colors focus:outline-none focus:bg-surface-sunken/40 px-1.5 py-0.5 -mx-1.5 rounded-lg cursor-text leading-tight truncate",
            children: t.title || "Otel Konaklama Anlaşması"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => c(!o),
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
        /* @__PURE__ */ e.jsxs(ue, { children: [
          /* @__PURE__ */ e.jsx(me, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer Seçenekler",
              className: "flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(pe, { children: /* @__PURE__ */ e.jsxs(
            fe,
            {
              sideOffset: 4,
              align: "end",
              className: "z-50 w-48 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95",
              children: [
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: j,
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
function te({ label: t, children: s }) {
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
  const [r, i] = d.useState(
    Array.isArray(t.tags) && t.tags.length > 0 ? t.tags : ["Konaklama", "Anlaşma"]
  ), [l, o] = d.useState(""), [c, x] = d.useState(!1), h = (n) => {
    if (n.key === "Enter" || n.type === "blur") {
      const u = l.trim();
      if (u && !r.includes(u)) {
        const b = [...r, u];
        i(b), a("tags", b);
      }
      o(""), x(!1);
    }
  }, f = (n) => {
    const u = r.filter((b) => b !== n);
    i(u), a("tags", u);
  }, m = (n) => {
    if (!n) return "—";
    const u = new Date(n);
    return isNaN(u.getTime()) ? n : u.toISOString().split("T")[0];
  }, g = t.assigneeName || "Yakup B.", y = `https://ui-avatars.com/api/?name=${encodeURIComponent(g)}&background=6366f1&color=fff&size=64`;
  return /* @__PURE__ */ e.jsx("div", { className: "px-[var(--apya-space-6)] py-[var(--apya-space-5)] bg-surface-base border-b border-subtle", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-y-[var(--apya-space-5)] gap-x-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsx(te, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(ue, { children: [
      /* @__PURE__ */ e.jsx(me, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group focus-visible:outline-none focus-visible:shadow-focus",
          children: [
            /* @__PURE__ */ e.jsx("img", { src: y, alt: g, className: "h-6 w-6 rounded-full border border-subtle shrink-0 object-cover" }),
            /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary text-[13px] group-hover:text-primary transition-colors", children: g }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] text-text-tertiary ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(pe, { children: /* @__PURE__ */ e.jsxs(
        fe,
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
                className: `flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-left transition-colors ${g === n ? "bg-primary-subtle text-primary font-semibold" : "text-text-primary hover:bg-surface-hover"}`,
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
    /* @__PURE__ */ e.jsx(te, { label: "Son Tarih", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors group relative", children: [
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
    /* @__PURE__ */ e.jsx(te, { label: "Başlangıç", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors group relative", children: [
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
    /* @__PURE__ */ e.jsx(te, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 text-[13px] font-medium", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 text-negative bg-negative-subtle px-2.5 py-0.5 rounded-md font-semibold", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-flag text-xs" }),
      /* @__PURE__ */ e.jsx("span", { children: "Kritik" })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(te, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 text-[13px] font-medium", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 text-success bg-success-subtle px-2.5 py-0.5 rounded-md font-semibold", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-circle-check text-xs" }),
      /* @__PURE__ */ e.jsx("span", { children: "Tamamlandı" })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(te, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
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
                onClick: () => f(n),
                className: "opacity-0 group-hover:opacity-100 hover:text-negative transition-opacity ml-0.5",
                "aria-label": "Etiketi kaldır",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
              }
            )
          ]
        },
        n
      )),
      c ? /* @__PURE__ */ e.jsx(
        "input",
        {
          autoFocus: !0,
          type: "text",
          value: l,
          onChange: (n) => o(n.target.value),
          onKeyDown: h,
          onBlur: h,
          placeholder: "Etiket...",
          className: "h-6 w-16 px-1.5 text-[11px] rounded border border-primary bg-surface-base focus:outline-none"
        }
      ) : /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => x(!0),
          className: "flex items-center justify-center h-5 w-5 rounded-full bg-surface-sunken border border-subtle text-text-tertiary hover:bg-surface-hover hover:text-text-primary hover:border-primary transition-all",
          "aria-label": "Yeni etiket ekle",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[9px]" })
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(te, { label: "Proje", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary group-hover:text-primary transition-colors text-[13px] truncate max-w-[140px]", children: t.projectName || "Otel Projesi" })
    ] }) }),
    /* @__PURE__ */ e.jsx(te, { label: "Maliyet Merkezi", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group", children: [
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
function ae({ label: t, value: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-start py-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary text-right font-medium max-w-[150px] truncate", title: typeof s == "string" ? s : "", children: s ?? "—" })
  ] });
}
function Ke({ label: t, name: s, avatar: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-center py-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("img", { src: a, alt: s, className: "w-5 h-5 rounded-full border border-subtle object-cover" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary font-semibold", children: s })
    ] })
  ] });
}
function Wt({ task: t = {}, onDelete: s = () => {
} }) {
  const [a, r] = d.useState(!1), [i, l] = d.useState(!1), [o, c] = d.useState(!1), x = X(), h = (y) => y ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(y)) : "25.06.2026 14:30", f = () => {
    var n, u, b, j;
    const y = `${window.location.origin}/Tasks?task=${t.id || ""}`;
    (n = navigator.clipboard) == null || n.writeText(y), (j = (b = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : b.success) == null || j.call(b, "Görev bağlantısı panoya kopyalandı!");
  }, m = async () => {
    var y, n, u, b, j, v, R, E, z, C, q;
    if (!(!t || i)) {
      l(!0);
      try {
        const $ = (u = (n = (y = window == null ? void 0 : window.apya) == null ? void 0 : y.platform) == null ? void 0 : n.tasks) == null ? void 0 : u.task;
        if ($) {
          const Q = {
            title: `Kopya - ${t.title || "Görev"}`,
            description: t.description || "",
            startDate: t.startDate ? new Date(t.startDate).toISOString().slice(0, 10) : (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
            dueDate: t.dueDate ? new Date(t.dueDate).toISOString().slice(0, 10) : null,
            status: 1,
            // Todo
            priority: t.priority || 2,
            projectId: t.projectId,
            assigneeId: t.assigneeId,
            isPrivate: t.isPrivate || !1
          }, J = await Promise.resolve($.create(Q));
          await x.invalidateQueries({ queryKey: ["task-detail"] }), (v = (j = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : j.success) == null || v.call(j, "Görev başarıyla çoğaltıldı!"), (E = (R = window.apya) == null ? void 0 : R.taskDetail) != null && E.open && J && window.apya.taskDetail.open(J);
        }
      } catch ($) {
        (q = (C = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : C.error) == null || q.call(C, ($ == null ? void 0 : $.message) || "Görev çoğaltılamadı.");
      } finally {
        l(!1);
      }
    }
  }, g = async () => {
    var y, n, u, b, j, v, R, E, z;
    if (!(!t.id || o)) {
      c(!0);
      try {
        const C = (u = (n = (y = window == null ? void 0 : window.apya) == null ? void 0 : y.platform) == null ? void 0 : n.tasks) == null ? void 0 : u.task;
        C && (await Promise.resolve(C.updateStatus(t.id, 4)), await x.invalidateQueries({ queryKey: ["task-detail", t.id] }), (v = (j = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : j.info) == null || v.call(j, "Görev arşivlendi (Tamamlandı)."));
      } catch (C) {
        (z = (E = (R = window == null ? void 0 : window.abp) == null ? void 0 : R.notify) == null ? void 0 : E.error) == null || z.call(E, (C == null ? void 0 : C.message) || "Görev arşivlenemedi.");
      } finally {
        c(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs flex flex-col", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary mb-2", children: "Detaylar" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col divide-y divide-subtle/50", children: [
        /* @__PURE__ */ e.jsx(
          Ke,
          {
            label: "Oluşturan",
            name: t.creatorName || "Yakup B.",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.creatorName || "Yakup B.")}&background=6366f1&color=fff&size=64`
          }
        ),
        /* @__PURE__ */ e.jsx(ae, { label: "Oluşturma Tarihi", value: h(t.creationTime) }),
        /* @__PURE__ */ e.jsx(
          Ke,
          {
            label: "Güncelleyen",
            name: t.lastModifierName || "Yakup B.",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.lastModifierName || "Yakup B.")}&background=6366f1&color=fff&size=64`
          }
        ),
        /* @__PURE__ */ e.jsx(ae, { label: "Son Güncelleme", value: h(t.lastModificationTime) }),
        /* @__PURE__ */ e.jsx(ae, { label: "Oluşturma Paneli", value: "25.06.2026 14:30" }),
        /* @__PURE__ */ e.jsx(ae, { label: "Tahmini Süre", value: "15 gün" }),
        /* @__PURE__ */ e.jsx(ae, { label: "Gerçekleşen Süre", value: "12 gün" }),
        a && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col divide-y divide-subtle/50 animate-in fade-in-50", children: [
          /* @__PURE__ */ e.jsx(ae, { label: "Özel Alanlar", value: "Vize, Otel" }),
          /* @__PURE__ */ e.jsx(ae, { label: "Kategori", value: "Operasyon" }),
          /* @__PURE__ */ e.jsx(ae, { label: "SLA Seviyesi", value: "Standart (48s)" })
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
        T,
        {
          type: "button",
          variant: "outline",
          onClick: f,
          className: "w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]",
          icon: "fa-link",
          children: "Bağlantıyı kopyala"
        }
      ),
      /* @__PURE__ */ e.jsx(
        T,
        {
          type: "button",
          variant: "outline",
          onClick: m,
          disabled: i,
          isLoading: i,
          className: "w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]",
          icon: "fa-copy",
          children: "Çoğalt"
        }
      ),
      /* @__PURE__ */ e.jsx(
        T,
        {
          type: "button",
          variant: "outline",
          onClick: g,
          disabled: o,
          isLoading: o,
          className: "w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]",
          icon: "fa-box-archive",
          children: "Arşivle"
        }
      ),
      /* @__PURE__ */ e.jsx(
        T,
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
function Jt({ onFormat: t = () => {
} }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-0.5 border-b border-subtle bg-surface-sunken/40 px-2 py-1.5 rounded-t-xl overflow-x-auto custom-scrollbar", children: [
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("**", "**"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Kalın (Ctrl+B)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-bold text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("*", "*"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "İtalik (Ctrl+I)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-italic text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("<u>", "</u>"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Altı Çizili (Ctrl+U)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-underline text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("~~", "~~"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Üstü Çizili", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-strikethrough text-xs" }) }),
    /* @__PURE__ */ e.jsx("div", { className: "h-4 w-px bg-subtle mx-1 shrink-0" }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t(`
- `, ""), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Madde İşaretli Liste", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-list-ul text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t(`
1. `, ""), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Numaralı Liste", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-list-ol text-xs" }) }),
    /* @__PURE__ */ e.jsx("div", { className: "h-4 w-px bg-subtle mx-1 shrink-0" }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("[", "](url)"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Bağlantı Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("![Resim](", ")"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Görsel Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-image text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t(`
| Kolon 1 | Kolon 2 |
|---|---|
| Değer 1 | Değer 2 |
`, ""), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Tablo Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-table-cells text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("@", " "), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Kişi Bahset (@)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-at text-xs" }) })
  ] });
}
function Xt({ task: t = {}, onFieldChange: s = () => {
} }) {
  const a = t == null ? void 0 : t.id, r = X(), [i, l] = d.useState(t.description || ""), o = (p, w = "") => {
    const N = document.getElementById("task-v3-desc-input");
    if (!N) return;
    const I = N.selectionStart, S = N.selectionEnd, L = i.substring(I, S) || "metin", G = `${p}${L}${w}`, O = i.substring(0, I) + G + i.substring(S);
    l(O), s("description", O);
  }, c = tt(a), [x, h] = d.useState(!0), [f, m] = d.useState(""), [g, y] = d.useState(!1), [n, u] = d.useState(!1), b = c.items && c.items.length > 0 ? c.items : [
    { id: "mock-1", text: "Otel listesi oluşturuldu", isDone: !0 },
    { id: "mock-2", text: "Fiyat teklifleri alındı", isDone: !0 },
    { id: "mock-3", text: "Sözleşme taslağı hazırlandı", isDone: !0 },
    { id: "mock-4", text: "Sözleşme imzalandı", isDone: !0 }
  ], j = b.filter((p) => p.isDone || p.done).length, v = async (p) => {
    var w, N, I, S, L, G;
    if (p.key === "Enter" || p.type === "blur") {
      const O = f.trim();
      if (O && a) {
        u(!0);
        try {
          await c.addItem(O), (I = (N = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : N.success) == null || I.call(N, "Madde eklendi.");
        } catch (Z) {
          (G = (L = (S = window == null ? void 0 : window.abp) == null ? void 0 : S.notify) == null ? void 0 : L.error) == null || G.call(L, (Z == null ? void 0 : Z.message) || "Madde eklenemedi.");
        } finally {
          u(!1);
        }
      }
      m(""), y(!1);
    }
  }, R = async (p) => {
    var w, N, I;
    if (!(typeof p == "string" && p.startsWith("mock-")))
      try {
        await c.toggleItem(p);
      } catch (S) {
        (I = (N = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : N.error) == null || I.call(N, (S == null ? void 0 : S.message) || "Durum güncellenemedi.");
      }
  }, E = async (p) => {
    var w, N, I, S, L, G;
    if (!(typeof p == "string" && p.startsWith("mock-")))
      try {
        await c.removeItem(p), (I = (N = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : N.info) == null || I.call(N, "Madde silindi.");
      } catch (O) {
        (G = (L = (S = window == null ? void 0 : window.abp) == null ? void 0 : S.notify) == null ? void 0 : L.error) == null || G.call(L, (O == null ? void 0 : O.message) || "Madde silinemedi.");
      }
  }, { data: z = [] } = he({
    queryKey: ["task-comments", a],
    queryFn: async () => {
      var w, N, I;
      const p = (I = (N = (w = window == null ? void 0 : window.apya) == null ? void 0 : w.platform) == null ? void 0 : N.tasks) == null ? void 0 : I.task;
      return !p || !a ? [] : await Promise.resolve(p.getComments(a));
    },
    enabled: !!a,
    staleTime: 1e4
  }), [C, q] = d.useState(""), [$, Q] = d.useState(!0), [J, re] = d.useState(!1), [ie, H] = d.useState(null), [D, F] = d.useState(""), M = z.length > 0 ? z : t.comments && t.comments.length > 0 ? t.comments : [
    {
      id: "mock-c1",
      creatorName: "Elif A.",
      creationTime: "2026-07-10T09:30:00Z",
      text: "@Yakup B. Sözleşme dosyası güncellendi, kontrol eder misiniz?"
    }
  ], U = async (p) => {
    var N, I, S, L, G, O, Z, W, ne;
    p.preventDefault();
    const w = C.trim();
    if (!(!w || !a)) {
      re(!0);
      try {
        const Y = (S = (I = (N = window == null ? void 0 : window.apya) == null ? void 0 : N.platform) == null ? void 0 : I.tasks) == null ? void 0 : S.task;
        Y && (await Promise.resolve(Y.addComment(a, w)), await r.invalidateQueries({ queryKey: ["task-comments", a] }), await r.invalidateQueries({ queryKey: ["task-detail", a] }), (O = (G = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : G.success) == null || O.call(G, "Yorum gönderildi.")), q("");
      } catch (Y) {
        (ne = (W = (Z = window == null ? void 0 : window.abp) == null ? void 0 : Z.notify) == null ? void 0 : W.error) == null || ne.call(W, (Y == null ? void 0 : Y.message) || "Yorum gönderilemedi.");
      } finally {
        re(!1);
      }
    }
  }, K = async (p) => {
    var N, I, S, L, G, O, Z, W, ne;
    const w = D.trim();
    if (!(!w || !a))
      try {
        const Y = (S = (I = (N = window == null ? void 0 : window.apya) == null ? void 0 : N.platform) == null ? void 0 : I.tasks) == null ? void 0 : S.task;
        Y && (await Promise.resolve(Y.replyToComment(p, w)), await r.invalidateQueries({ queryKey: ["task-comments", a] }), (O = (G = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : G.success) == null || O.call(G, "Yanıt gönderildi.")), F(""), H(null);
      } catch (Y) {
        (ne = (W = (Z = window == null ? void 0 : window.abp) == null ? void 0 : Z.notify) == null ? void 0 : W.error) == null || ne.call(W, (Y == null ? void 0 : Y.message) || "Yanıt gönderilemedi.");
      }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-2.5", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary", children: "Açıklama" }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-subtle bg-surface-base focus-within:border-primary focus-within:shadow-focus transition-all overflow-hidden shadow-xs", children: [
        /* @__PURE__ */ e.jsx(Jt, { onFormat: o }),
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            id: "task-v3-desc-input",
            className: "w-full min-h-[110px] p-4 text-[14px] leading-relaxed text-text-primary bg-transparent focus:outline-none resize-y font-sans",
            value: i,
            onChange: (p) => {
              l(p.target.value), s("description", p.target.value);
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
          onClick: () => h(!x),
          className: "flex items-center justify-between cursor-pointer select-none group",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors", children: "Kontrol Listesi" }),
              b.length > 0 && /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-text-tertiary bg-surface-sunken px-2 py-0.5 rounded-full", children: [
                j,
                "/",
                b.length
              ] })
            ] }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "text-text-tertiary group-hover:text-text-primary transition-colors", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid fa-chevron-up transition-transform duration-200 ${x ? "" : "rotate-180"}` }) })
          ]
        }
      ),
      x && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2.5 animate-in fade-in-50", children: [
        b.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden mb-1", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full bg-success transition-all duration-300",
            style: { width: `${j / b.length * 100}%` }
          }
        ) }),
        b.map((p) => {
          const w = p.isDone ?? p.done ?? !1;
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: "group flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-surface-hover/70 transition-colors",
              children: [
                /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: w,
                      onChange: () => R(p.id),
                      className: "h-4 w-4 rounded border-subtle text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `text-[13px] transition-all truncate ${w ? "line-through text-text-tertiary font-normal" : "text-text-primary font-medium"}`, children: p.text })
                ] }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => E(p.id),
                    className: "opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-negative transition-all p-1",
                    title: "Maddeyi Sil",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-trash-can text-xs" })
                  }
                )
              ]
            },
            p.id
          );
        }),
        g ? /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 mt-1", children: /* @__PURE__ */ e.jsx(
          "input",
          {
            autoFocus: !0,
            type: "text",
            value: f,
            onChange: (p) => m(p.target.value),
            onKeyDown: v,
            onBlur: v,
            disabled: n,
            placeholder: "Yeni kontrol maddesi yazıp Enter'a basın...",
            className: "w-full h-9 px-3 text-[13px] rounded-lg border border-primary bg-surface-base focus:outline-none"
          }
        ) }) : /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => y(!0),
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
          onClick: () => Q(!$),
          className: "flex items-center justify-between cursor-pointer select-none group",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors", children: "Yorumlar & Güncellemeler" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-primary-subtle text-primary text-[11px] font-bold", children: M.length })
            ] }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "text-text-tertiary group-hover:text-text-primary transition-colors", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid fa-chevron-up transition-transform duration-200 ${$ ? "" : "rotate-180"}` }) })
          ]
        }
      ),
      $ && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-5 animate-in fade-in-50", children: [
        /* @__PURE__ */ e.jsxs("form", { onSubmit: U, className: "flex gap-3 items-start", children: [
          /* @__PURE__ */ e.jsx(
            "img",
            {
              src: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64",
              alt: "Yakup",
              className: "h-8 w-8 rounded-full border border-subtle mt-1 shrink-0 object-cover"
            }
          ),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col rounded-xl border border-subtle bg-surface-sunken/40 focus-within:bg-surface-base focus-within:border-primary focus-within:shadow-focus transition-all overflow-hidden", children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                value: C,
                onChange: (p) => q(p.target.value),
                placeholder: "Bir yorum yazın... (@bahset, #görev)",
                rows: 2,
                className: "w-full p-3 text-[13px] bg-transparent focus:outline-none resize-none text-text-primary",
                onKeyDown: (p) => {
                  p.key === "Enter" && (p.ctrlKey || p.metaKey) && U(p);
                }
              }
            ),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-t border-subtle/50 bg-surface-base", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 text-text-tertiary", children: [
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => q((p) => p + " [Dosya] "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Dosya Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => q((p) => p + " [Görsel] "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Resim Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-image text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => q((p) => p + " 👍 "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Emoji", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-face-smile text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => q((p) => p + " @Yakup B. "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Bahset (@)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-at text-xs" }) })
              ] }),
              /* @__PURE__ */ e.jsx(
                T,
                {
                  type: "submit",
                  size: "sm",
                  disabled: !C.trim() || J,
                  isLoading: J,
                  className: "bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 h-8 rounded-lg shadow-sm",
                  icon: "fa-paper-plane",
                  children: "Gönder"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-4 divide-y divide-subtle/50", children: M.map((p) => {
          const w = p.creatorName || p.author || "Yakup B.", N = `https://ui-avatars.com/api/?name=${encodeURIComponent(w)}&background=6366f1&color=fff&size=64`, I = p.creationTime ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(p.creationTime)) : p.date || "10.07.2026 09:30";
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-3 pt-3 items-start first:pt-0", children: [
            /* @__PURE__ */ e.jsx("img", { src: N, alt: w, className: "h-8 w-8 rounded-full border border-subtle shrink-0 object-cover" }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col gap-1", children: [
              /* @__PURE__ */ e.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: w }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary font-mono", children: I })
              ] }) }),
              /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap", children: p.text.split(" ").map((S, L) => S.startsWith("@") ? /* @__PURE__ */ e.jsxs("span", { className: "font-semibold text-primary bg-primary-subtle px-1 py-0.5 rounded mr-1", children: [
                S,
                " "
              ] }, L) : S + " ") }),
              /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-4 mt-1", children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => H(ie === p.id ? null : p.id),
                  className: "text-xs font-semibold text-text-tertiary hover:text-primary transition-colors flex items-center gap-1",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                    /* @__PURE__ */ e.jsx("span", { children: "Yanıtla" })
                  ]
                }
              ) }),
              ie === p.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex gap-2 items-center animate-in fade-in-50", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: D,
                    onChange: (S) => F(S.target.value),
                    placeholder: `@${w} kullanıcısına yanıt ver...`,
                    onKeyDown: (S) => {
                      S.key === "Enter" && K(p.id);
                    },
                    className: "flex-1 h-8 px-3 text-[12px] rounded-lg border border-primary bg-surface-base focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(T, { size: "sm", onClick: () => K(p.id), className: "h-8 text-xs bg-primary text-white", children: "Yanıtla" })
              ] })
            ] })
          ] }, p.id);
        }) })
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
        T,
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
        T,
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
const Ge = [
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
  const [t, s] = d.useState("all"), a = t === "all" ? Ge : Ge.filter((r) => r.category === t);
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
      { code: "gantt", title: "Gantt", desc: "Zaman çizelgesi görünümü", icon: "fa-bars-staggered", color: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600" },
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
      { code: "emails", title: "E-postalar", desc: "E-posta entegrasyonu", icon: "fa-envelope", color: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600" }
    ]
  },
  {
    title: "GEÇMİŞ",
    items: [
      { code: "history", title: "Aktiviteler", desc: "Aktivite akışı", icon: "fa-file-lines", color: "bg-primary-subtle text-primary" }
    ]
  },
  {
    title: "FİNANS",
    items: [
      { code: "finance", title: "Finans", desc: "Bütçe ve maliyetler", icon: "fa-coins", color: "bg-success-subtle text-success" },
      { code: "files", title: "Dosya Galerisi", desc: "Görsel dosya yönetimi", icon: "fa-image", color: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600" }
    ]
  },
  {
    title: "İLERİ ÖZELLİKLER",
    items: [
      { code: "custom-fields", title: "Özel Alanlar", desc: "Özel alanlar ekleyin", icon: "fa-square-plus", color: "bg-success-subtle text-success" },
      { code: "automations", title: "Otomasyonlar", desc: "Otomatik işlemler", icon: "fa-wand-magic-sparkles", color: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600" },
      { code: "ai", title: "Yapay Zeka", desc: "AI analiz ve öneriler", icon: "fa-sparkles", color: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600" }
    ]
  }
];
function sa({
  assignedCodes: t = [],
  onAddFeature: s = () => {
  }
}) {
  const [a, r] = d.useState(!1), i = (o) => t.includes(o), l = (o) => {
    s(o), r(!1);
  };
  return /* @__PURE__ */ e.jsxs(ue, { open: a, onOpenChange: r, children: [
    /* @__PURE__ */ e.jsx(me, { asChild: !0, children: /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        className: "flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-subtle text-text-tertiary hover:border-primary hover:text-primary hover:bg-primary-subtle/30 transition-all focus-visible:outline-none focus-visible:shadow-focus",
        "aria-label": "Özellik ekle",
        title: "Özellik Ekle (+)",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[13px]" })
      }
    ) }),
    /* @__PURE__ */ e.jsx(pe, { children: /* @__PURE__ */ e.jsxs(
      fe,
      {
        sideOffset: 8,
        align: "end",
        className: "z-50 w-[760px] rounded-2xl border border-subtle bg-surface-base p-6 shadow-float will-change-[transform,opacity] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-subtle", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shapes text-primary text-base" }),
                /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary tracking-wide", children: "ÖZELLİK EKLEME SİSTEMİ" })
              ] }),
              /* @__PURE__ */ e.jsx("p", { className: "text-[12px] text-text-tertiary", children: "+ ikonuna tıklayınca açılan menü ile göreve yeni özellikler/sekme eklenir." })
            ] }),
            aa.map((o) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx("h4", { className: "text-[11px] font-bold text-text-tertiary tracking-widest uppercase pl-1", children: o.title }),
              /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-2 gap-3", children: o.items.map((c) => {
                const x = i(c.code);
                return /* @__PURE__ */ e.jsxs(
                  "div",
                  {
                    onClick: () => l(c.code),
                    className: `
                                                    group flex items-start gap-3.5 rounded-xl border p-3 transition-all cursor-pointer select-none
                                                    ${x ? "border-primary/40 bg-primary-subtle/30 shadow-xs" : "border-subtle bg-surface-base hover:border-primary/60 hover:bg-surface-hover hover:shadow-xs"}
                                                `,
                    children: [
                      /* @__PURE__ */ e.jsx("div", { className: `flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${c.color}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c.icon} text-[15px]` }) }),
                      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-0.5 min-w-0 flex-1", children: [
                        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                          /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: c.title }),
                          x && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1 text-[11px] font-semibold text-primary", children: [
                            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" }),
                            "Aktif"
                          ] })
                        ] }),
                        /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary truncate", children: c.desc })
                      ] })
                    ]
                  },
                  c.code
                );
              }) })
            ] }, o.title))
          ] }),
          /* @__PURE__ */ e.jsx(Ue, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const Me = "apya.taskDetail.fullscreen";
function nt({
  taskId: t,
  presentation: s = "modal",
  onClose: a,
  switchToTask: r
}) {
  const [i, l] = d.useState(t), { data: o, isLoading: c, isError: x, refetch: h } = Ve(i), f = X(), m = _e(), g = We(o), y = Je(), n = Xe(i), [u, b] = d.useState("general"), [j, v] = d.useState(
    () => {
      var D;
      return ((D = window.localStorage) == null ? void 0 : D.getItem(Me)) === "1";
    }
  ), [R, E] = d.useState(!1), z = d.useCallback(() => {
    He(), a == null || a();
  }, [a]);
  Ze(t, z), xe.useEffect(() => {
    g.isDirty ? m.markDirty() : m.markClean();
  });
  const C = d.useCallback(() => m.requestClose(z), [m, z]), q = d.useCallback(() => {
    v((D) => {
      var M;
      const F = !D;
      return (M = window.localStorage) == null || M.setItem(Me, F ? "1" : "0"), F;
    });
  }, []), $ = d.useMemo(
    () => st(n.assignedCodes),
    [n.assignedCodes]
  ), Q = $.find((D) => D.code === u) || $[0], J = d.useCallback(async () => {
    var D, F, M, U, K, p;
    if (!g.validate()) return !1;
    E(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(i, g.toUpdateDto())
      ), await f.invalidateQueries({ queryKey: ["task-detail", i] }), _.emitResult(), (M = (F = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : F.success) == null || M.call(F, "Görev başarıyla güncellendi."), !0;
    } catch (w) {
      return (p = (K = (U = window == null ? void 0 : window.abp) == null ? void 0 : U.notify) == null ? void 0 : K.error) == null || p.call(K, (w == null ? void 0 : w.message) || "Kaydedilemedi."), !1;
    } finally {
      E(!1);
    }
  }, [i, g, f]), re = d.useCallback(async () => {
    var D, F, M, U, K, p;
    if (window.confirm("Bu görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.delete(i)), (M = (F = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : F.info) == null || M.call(F, "Görev silindi."), m.markClean(), z();
      } catch (w) {
        (p = (K = (U = window == null ? void 0 : window.abp) == null ? void 0 : U.notify) == null ? void 0 : K.error) == null || p.call(K, (w == null ? void 0 : w.message) || "Görev silinemedi.");
      }
  }, [i, m, z]), ie = d.useCallback(async (D) => {
    var F, M, U, K, p, w;
    try {
      await n.addFeature(D), b(D), (U = (M = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : M.success) == null || U.call(M, "Özellik başarıyla eklendi.");
    } catch (N) {
      (w = (p = (K = window == null ? void 0 : window.abp) == null ? void 0 : K.notify) == null ? void 0 : p.error) == null || w.call(p, (N == null ? void 0 : N.message) || "Özellik eklenemedi.");
    }
  }, [n]), H = c ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(se, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(se, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(se, { className: "h-64 w-full" })
  ] }) : x ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(T, { variant: "ghost", onClick: () => h(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      Qt,
      {
        task: o,
        onClose: C,
        isFullscreen: j,
        onToggleFullscreen: q,
        presentation: s,
        onFieldChange: g.setField
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "overflow-y-auto max-h-[85vh] custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        Ht,
        {
          task: o,
          assigneeOptions: y.options,
          onFieldChange: g.setField
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle px-6 bg-surface-base", children: [
        /* @__PURE__ */ e.jsx(
          Zt,
          {
            activeTab: u,
            onTabChange: b,
            visibleTabs: $
          }
        ),
        /* @__PURE__ */ e.jsx("div", { className: "py-2", children: /* @__PURE__ */ e.jsx(
          sa,
          {
            assignedCodes: n.assignedCodes,
            onAddFeature: ie
          }
        ) })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-6", children: u === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start", children: [
        /* @__PURE__ */ e.jsx("div", { className: "min-w-0 space-y-6", children: /* @__PURE__ */ e.jsx(
          Xt,
          {
            task: o,
            onFieldChange: g.setField
          }
        ) }),
        /* @__PURE__ */ e.jsx("div", { className: "w-full shrink-0", children: /* @__PURE__ */ e.jsx(
          Wt,
          {
            task: o,
            onDelete: re
          }
        ) })
      ] }) : u === "history" || u === "activity" ? /* @__PURE__ */ e.jsx(ta, {}) : /* @__PURE__ */ e.jsx(d.Suspense, { fallback: /* @__PURE__ */ e.jsx(se, { className: "h-48 w-full" }), children: Q != null && Q.component ? /* @__PURE__ */ e.jsx(
        Q.component,
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
        isSaving: R,
        onCancel: C,
        onSave: J
      }
    )
  ] });
  return s === "page" ? /* @__PURE__ */ e.jsx("div", { className: "w-full max-w-6xl mx-auto my-6 rounded-2xl border border-subtle bg-surface-base shadow-sm overflow-hidden", children: H }) : /* @__PURE__ */ e.jsx(
    Ye,
    {
      open: !0,
      onOpenChange: (D) => {
        D || C();
      },
      children: /* @__PURE__ */ e.jsx(
        qe,
        {
          title: o != null && o.title ? `Görev Detayı: ${o.title}` : "Görev Detayı",
          fullscreen: j,
          className: "max-w-6xl p-0 overflow-hidden rounded-2xl border border-subtle shadow-2xl bg-surface-base",
          onInteractOutside: (D) => {
            D.preventDefault(), C();
          },
          onEscapeKeyDown: (D) => {
            D.preventDefault(), C();
          },
          children: H
        }
      )
    }
  );
}
function ra() {
  var s;
  const t = d.useSyncExternalStore(
    _.subscribe,
    _.getSnapshot,
    () => null
  );
  return t ? (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsx(
    nt,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        _.close(), _.emitResult();
      }
    }
  ) }) : /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsx(
    rt,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        _.close(), _.emitResult();
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
function na() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v3" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v2" || new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : window.localStorage.getItem("apya.taskDetail.v3") === "1" || !0;
  } catch {
    return !0;
  }
}
const $e = document.getElementById("task-detail-island");
if ($e && (window.apya = window.apya || {}, window.apya.taskDetailV3Enabled = na(), window.apya.taskDetailV2Enabled = ia() && !window.apya.taskDetailV3Enabled, window.apya.taskDetail = {
  open: (t) => _.open(t),
  close: () => _.close(),
  onResult: (t) => _.onResult(t)
}, Oe($e).render(/* @__PURE__ */ e.jsx(ra, {})), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled)) {
  const t = Qe();
  t && _.open(t);
}
function la({ taskId: t }) {
  var a;
  const s = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsx(
    nt,
    {
      taskId: t,
      presentation: "page",
      onClose: s
    }
  ) }) : /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsx(
    rt,
    {
      taskId: t,
      presentation: "page",
      onClose: s
    }
  ) });
}
const Ee = document.getElementById("task-detail-page-island");
if (Ee) {
  const t = Ee.getAttribute("data-task-id");
  t && Oe(Ee).render(/* @__PURE__ */ e.jsx(la, { taskId: t }));
}
