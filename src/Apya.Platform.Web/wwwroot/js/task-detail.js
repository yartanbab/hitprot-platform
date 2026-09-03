import { j as e, r as h, d as Ie, b as la } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { a as We } from "./QueryProvider-AIUp_Zk5.js";
import { u as re, a as ae, b as se } from "./query-vendor-Bf69L2iP.js";
import { D as oa, i as ca, g as pt, B as ne, I as Re, S as ye } from "./Dialog-BdNKdiS6.js";
import { C as Ra } from "./Combobox-Cgzidxen.js";
import { r as Fa } from "./httpClient-CRlyQ1eg.js";
import { R as ve, T as je, P as Ne, C as we, A as Ga, a as da, D as qa, b as Ya, c as Ua, d as _a, e as Oa } from "./ui-vendor-DaE-uom6.js";
import { d as xa } from "./draggableActivation-Ybw9Upbh.js";
function Va({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: i,
  footer: o,
  children: l
}) {
  return /* @__PURE__ */ e.jsx(
    oa,
    {
      open: t,
      onOpenChange: (n) => {
        n || a();
      },
      children: /* @__PURE__ */ e.jsx(
        ca,
        {
          title: r,
          fullscreen: s,
          onInteractOutside: (n) => {
            n.preventDefault(), a();
          },
          onEscapeKeyDown: (n) => {
            n.preventDefault(), a();
          },
          children: /* @__PURE__ */ e.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
            i,
            /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: l }),
            o
          ] })
        }
      )
    }
  );
}
function Ha({ title: t, header: a, footer: s, children: r }) {
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
function Qa({ isPrivate: t }) {
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
const mt = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, ft = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function Wa({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: i,
  fullscreen: o = !1
}) {
  const [l, n] = h.useState(!1), c = h.useRef(null);
  h.useEffect(() => {
    if (!l) return;
    const u = (g) => {
      c.current && !c.current.contains(g.target) && n(!1);
    }, x = (g) => {
      g.key === "Escape" && n(!1);
    };
    return document.addEventListener("mousedown", u), document.addEventListener("keydown", x), () => {
      document.removeEventListener("mousedown", u), document.removeEventListener("keydown", x);
    };
  }, [l]);
  const d = mt[t == null ? void 0 : t.status] ?? mt[1], b = ft[t == null ? void 0 : t.priority] ?? ft[2], p = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), n(!1);
  }, m = () => {
    var x, g, f, j;
    const u = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (x = navigator.clipboard) == null || x.writeText(u), (j = (f = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : f.info) == null || j.call(f, "Bağlantı kopyalandı."), n(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(pt, { variant: d.variant, children: d.text }),
        /* @__PURE__ */ e.jsx(pt, { variant: b.variant, children: b.text }),
        /* @__PURE__ */ e.jsx(Qa, { isPrivate: t == null ? void 0 : t.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": o ? "Küçült" : "Tam ekrana büyüt",
          onClick: i,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: o ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: c, children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": l,
            onClick: () => n((u) => !u),
            className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-ellipsis", "aria-hidden": "true" })
          }
        ),
        l && /* @__PURE__ */ e.jsxs(
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
                  onClick: m,
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
                      n(!1), r();
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
const Za = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function Ja({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: i }) {
  const o = Za(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: o ? `Son kayıt: ${o}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(ne, { variant: "secondary", onClick: r, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        ne,
        {
          variant: "primary",
          onClick: () => i == null ? void 0 : i(),
          disabled: !a || !i,
          isLoading: s,
          loadingText: "Kaydediliyor…",
          children: "Kaydet"
        }
      )
    ] })
  ] }) });
}
const Kt = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Xa = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function be({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function es({ value: t, onChange: a }) {
  const [s, r] = h.useState(""), i = () => {
    const o = s.trim();
    o && !t.includes(o) && a([...t, o]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((o) => /* @__PURE__ */ e.jsxs(pt, { variant: "neutral", children: [
      o,
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${o} etiketini kaldır`,
          onClick: () => a(t.filter((l) => l !== o)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, o)) }),
    /* @__PURE__ */ e.jsx(
      Re,
      {
        value: s,
        onChange: (o) => r(o.target.value),
        onKeyDown: (o) => {
          o.key === "Enter" || o.key === "," ? (o.preventDefault(), i()) : o.key === "Backspace" && !s && t.length && a(t.slice(0, -1));
        },
        onBlur: i,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function ts({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: i = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(be, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      Re,
      {
        id: "task-title",
        value: t.title,
        onChange: (o) => s("title", o.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(be, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (o) => s("status", Number(o.target.value)),
          className: Kt,
          children: Object.entries(mt).map(([o, l]) => /* @__PURE__ */ e.jsx("option", { value: o, children: l.text }, o))
        }
      ) }),
      /* @__PURE__ */ e.jsx(be, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (o) => s("priority", Number(o.target.value)),
          className: Kt,
          children: Object.entries(ft).map(([o, l]) => /* @__PURE__ */ e.jsx("option", { value: o, children: l.text }, o))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(be, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      Ra,
      {
        id: "task-assignee",
        options: r,
        value: t.assigneeId,
        onChange: (o) => s("assigneeId", o),
        placeholder: i ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: i
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(be, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        Re,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (o) => s("startDate", o.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(be, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        Re,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (o) => s("dueDate", o.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(be, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(es, { value: t.tagNames, onChange: (o) => s("tagNames", o) }) }),
    /* @__PURE__ */ e.jsx(be, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (o) => s("description", o.target.value),
        className: Xa
      }
    ) })
  ] });
}
const Mt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function Le({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function as({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(Le, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(Le, { label: "Oluşturulma zamanı", value: Mt(t.creationTime) }),
      /* @__PURE__ */ e.jsx(Le, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(Le, { label: "Son güncelleme zamanı", value: Mt(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(Le, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const ss = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", rs = "border-brand-500 text-text-primary";
function ns({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: i }) {
  const o = h.useRef(/* @__PURE__ */ new Map()), l = (c) => {
    var d;
    s(c.code), (d = o.current.get(c.code)) == null || d.focus();
  }, n = (c, d) => {
    c.key === "ArrowRight" ? (c.preventDefault(), l(t[(d + 1) % t.length])) : c.key === "ArrowLeft" ? (c.preventDefault(), l(t[(d - 1 + t.length) % t.length])) : c.key === "Home" ? (c.preventDefault(), l(t[0])) : c.key === "End" && (c.preventDefault(), l(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((c, d) => {
      const b = c.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (p) => {
            p ? o.current.set(c.code, p) : o.current.delete(c.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${c.code}`,
          "aria-selected": b,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: b ? 0 : -1,
          onClick: () => s(c.code),
          onKeyDown: (p) => n(p, d),
          className: `${ss} ${b ? rs : ""}`,
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
const is = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function ls({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [i, o] = h.useState(""), l = h.useMemo(() => {
    const n = i.trim().toLocaleLowerCase("tr-TR"), c = n ? t.filter((b) => b.title.toLocaleLowerCase("tr-TR").includes(n)) : t, d = /* @__PURE__ */ new Map();
    return c.forEach((b) => {
      const p = d.get(b.category) ?? [];
      p.push(b), d.set(b.category, p);
    }), d;
  }, [t, i]);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Özellik ekle",
      className: "absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl",
      children: [
        /* @__PURE__ */ e.jsx(
          Re,
          {
            autoFocus: !0,
            value: i,
            onChange: (n) => o(n.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          l.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...l.entries()].map(([n, c]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: is[n] ?? n }),
            c.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
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
          ] }, n))
        ] })
      ]
    }
  );
}
function os({ trail: t = [], current: a, onNavigate: s }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((r) => /* @__PURE__ */ e.jsxs(Ie.Fragment, { children: [
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
function cs(t) {
  var s, r, i;
  const a = (i = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : i.task;
  return a ? Promise.resolve(a.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function vt(t) {
  return re({
    queryKey: ["task-detail", t],
    queryFn: () => cs(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function et(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
function ua() {
  const [t, a] = h.useState(!1), [s, r] = h.useState(!1), i = h.useRef(null), o = h.useCallback(() => a(!0), []), l = h.useCallback(() => a(!1), []);
  h.useEffect(() => {
    if (!t) return;
    const d = (b) => {
      b.preventDefault(), b.returnValue = "";
    };
    return window.addEventListener("beforeunload", d), () => window.removeEventListener("beforeunload", d);
  }, [t]);
  const n = h.useCallback((d) => {
    if (!t) {
      d == null || d();
      return;
    }
    i.current = d ?? null, r(!0);
  }, [t]), c = h.useCallback((d) => {
    const b = i.current;
    return r(!1), i.current = null, d === "discard" && (a(!1), b == null || b()), d === "save" ? b : null;
  }, []);
  return { isDirty: t, markDirty: o, markClean: l, requestClose: n, pendingClose: s, resolvePendingClose: c };
}
const ds = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, jt = "task";
function pa() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(jt);
  return t && ds.test(t) ? t : null;
}
function ma() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(jt), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function fa(t, a) {
  const s = h.useRef(a);
  s.current = a, h.useEffect(() => {
    if (!t || pa() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(jt, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), h.useEffect(() => {
    const r = () => {
      var i;
      (i = s.current) == null || i.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const xs = {
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
function us(t) {
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
  } : xs;
}
function ba(t) {
  const [a, s] = h.useState(t == null ? void 0 : t.id), r = h.useMemo(() => us(t), [t]), [i, o] = h.useState(r), [l, n] = h.useState({});
  (t == null ? void 0 : t.id) !== a && (s(t == null ? void 0 : t.id), o(r), n({}));
  const c = h.useCallback((u, x) => {
    o((g) => ({ ...g, [u]: x }));
  }, []), d = h.useMemo(
    () => JSON.stringify(i) !== JSON.stringify(r),
    [i, r]
  ), b = h.useCallback(() => {
    const u = {};
    return i.title.trim() || (u.title = "Başlık zorunlu."), i.startDate || (u.startDate = "Başlangıç tarihi zorunlu."), i.dueDate && i.startDate && i.dueDate < i.startDate && (u.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), n(u), Object.keys(u).length === 0;
  }, [i]), p = h.useCallback(() => ({
    title: i.title.trim(),
    description: i.description || null,
    startDate: i.startDate,
    dueDate: i.dueDate || null,
    status: i.status,
    priority: i.priority,
    assigneeId: i.assigneeId,
    boardColumnId: (t == null ? void 0 : t.boardColumnId) ?? null,
    projectId: i.projectId ?? null,
    parentTaskId: (t == null ? void 0 : t.parentTaskId) ?? null,
    isPrivate: !!i.isPrivate,
    predecessorIds: (t == null ? void 0 : t.predecessorIds) ?? [],
    tagNames: i.tagNames,
    estimatedHours: i.estimatedHours,
    taskType: i.taskType || null,
    sprint: i.sprint || null
  }), [i, t]), m = h.useCallback(() => {
    o(r), n({});
  }, [r]);
  return { values: i, setField: c, isDirty: d, errors: l, validate: b, toUpdateDto: p, reset: m };
}
function It(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function ps() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ha() {
  var i;
  const t = re({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: ps,
    staleTime: 3e5,
    retry: !1
  }), a = ((i = t.data) == null ? void 0 : i.items) ?? [], s = a.map((o) => ({ value: o.id, label: It(o) })), r = new Map(a.map((o) => [o.id, It(o)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function bt() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function ms(t) {
  const a = bt();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ga(t) {
  const a = ae(), s = ["task-features", t], r = re({
    queryKey: s,
    queryFn: () => ms(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), o = se({
    mutationFn: (n) => Promise.resolve(bt().addFeature(t, n)),
    onSuccess: i
  }), l = se({
    mutationFn: (n) => Promise.resolve(bt().removeFeature(t, n)),
    onSuccess: i
  });
  return {
    assignedCodes: r.data ?? [],
    isLoading: r.isLoading,
    addFeature: o.mutateAsync,
    removeFeature: l.mutateAsync,
    mutatingCode: o.variables ?? l.variables ?? null,
    isMutating: o.isPending || l.isPending
  };
}
const Ze = {
  0: { label: "İptal", icon: "fa-ban", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  1: { label: "Yapılacak", icon: "fa-clock", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  2: { label: "Sürüyor", icon: "fa-spinner", bg: "bg-warning-subtle", fg: "text-warning", dot: "bg-warning" },
  3: { label: "Testte", icon: "fa-flask", bg: "bg-primary-subtle", fg: "text-primary", dot: "bg-primary" },
  4: { label: "Tamamlandı", icon: "fa-circle-check", bg: "bg-success-subtle", fg: "text-success", dot: "bg-success" }
}, ht = {
  1: { label: "Düşük", icon: "fa-arrow-down", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  2: { label: "Orta", icon: "fa-minus", bg: "bg-warning-subtle", fg: "text-warning" },
  3: { label: "Yüksek", icon: "fa-arrow-up", bg: "bg-negative-subtle", fg: "text-negative" },
  4: { label: "Kritik", icon: "fa-flag", bg: "bg-negative-subtle", fg: "text-negative" }
}, Je = [1, 2, 3, 4], fs = [1, 2, 3, 4], pe = (t) => Ze[t] ?? Ze[1], tt = (t) => ht[t] ?? ht[2];
function Ge(t) {
  if (!t) return "—";
  const a = String(t).trim().split(/\s+/).filter(Boolean);
  return a.length ? (a.length > 1 ? a[0][0] + a[a.length - 1][0] : a[0].slice(0, 2)).toUpperCase() : "—";
}
function qe(t) {
  return t ? "var(--apya-brand-500)" : "var(--apya-neutral-500)";
}
function ya(t, a = /* @__PURE__ */ new Date()) {
  if (!t) return { tone: "text-text-tertiary", hint: "" };
  const s = new Date(t);
  if (Number.isNaN(s.getTime())) return { tone: "text-text-tertiary", hint: "" };
  const r = Math.ceil((s.setHours(0, 0, 0, 0) - new Date(a).setHours(0, 0, 0, 0)) / 864e5);
  return r < 0 ? { tone: "text-negative", hint: `${Math.abs(r)} gün gecikti` } : r === 0 ? { tone: "text-warning", hint: "Bugün" } : r <= 3 ? { tone: "text-warning", hint: `${r} gün kaldı` } : { tone: "text-text-tertiary", hint: `${r} gün kaldı` };
}
const De = "rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden";
function Xe({ title: t, badge: a, action: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3.5 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: t }),
      a
    ] }),
    s
  ] });
}
function bs({ children: t, tone: a = "positive" }) {
  const s = a === "positive" ? "bg-success-subtle text-success" : "bg-neutral-subtle text-text-secondary";
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-full font-mono text-[11px] font-bold ${s}`, children: t });
}
function ze({ children: t, bg: a, fg: s }) {
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-[7px] text-[10.5px] font-bold ${a} ${s}`, children: t });
}
function me({ icon: t, title: a, description: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 px-6 py-10 text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-xl text-text-tertiary` }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: a }),
    s && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] leading-[1.55] text-text-tertiary max-w-[420px]", children: s })
  ] });
}
function at({ name: t, size: a = 24 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: qe(t), fontSize: a * 0.4 },
      title: t || void 0,
      children: Ge(t)
    }
  );
}
const st = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—", gt = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function va(t) {
  return t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toFixed(1)} MB` : "0 KB";
}
function rt(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = Math.floor(a / 3600), r = Math.floor(a % 3600 / 60);
  return !s && !r ? `${a}sn` : s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function hs(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = (r) => String(r).padStart(2, "0");
  return `${s(Math.floor(a / 3600))}:${s(Math.floor(a / 60) % 60)}:${s(a % 60)}`;
}
const ge = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  image: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  sheet: { icon: "fa-file-excel", bg: "bg-success-subtle", fg: "text-success" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  zip: { icon: "fa-file-zipper", bg: "bg-warning-subtle", fg: "text-warning" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
}, Rt = (t = "") => ja(t) === ge.image;
function ja(t = "") {
  var s;
  const a = ((s = t.split(".").pop()) == null ? void 0 : s.toLowerCase()) ?? "";
  return a === "pdf" ? ge.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(a) ? ge.image : ["doc", "docx", "odt", "rtf", "txt"].includes(a) ? ge.doc : ["xls", "xlsx", "csv", "ods"].includes(a) ? ge.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(a) ? ge.code : ["zip", "rar", "7z", "tar", "gz"].includes(a) ? ge.zip : ge.other;
}
function gs({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, i] = h.useState(""), [o, l] = h.useState(!1), n = ae(), c = (a == null ? void 0 : a.subTasks) ?? [], d = c.filter((u) => u.status === 4).length, b = () => n.invalidateQueries({ queryKey: ["task-detail", t] }), p = async () => {
    var x, g, f;
    const u = r.trim();
    if (u) {
      l(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: u,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), i(""), await b();
      } catch (j) {
        (f = (g = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : g.error) == null || f.call(g, (j == null ? void 0 : j.message) || "Alt görev eklenemedi.");
      } finally {
        l(!1);
      }
    }
  }, m = async (u, x) => {
    var g, f, j;
    u.stopPropagation();
    try {
      await Promise.resolve(window.apya.platform.tasks.task.updateStatus(x.id, x.status === 4 ? 1 : 4)), await b();
    } catch (w) {
      (j = (f = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : f.error) == null || j.call(f, (w == null ? void 0 : w.message) || "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        c.length > 0 && /* @__PURE__ */ e.jsxs(bs, { children: [
          d,
          "/",
          c.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: p,
          disabled: o || !r.trim(),
          className: `flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${o || !r.trim() ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            "Alt görev ekle"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: De, children: [
      c.map((u) => {
        const x = pe(u.status), g = u.status === 4;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => s == null ? void 0 : s(u.id, u.title),
            onKeyDown: (f) => {
              f.key === "Enter" && (s == null || s(u.id, u.title));
            },
            className: "flex items-center gap-3.5 px-4 py-3.5 border-t border-subtle first:border-t-0 hover:bg-surface-raised cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": `${u.title} tamamlandı işaretle`,
                  onClick: (f) => m(f, u),
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white cursor-pointer ${g ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: g && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: u.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${g ? "line-through text-text-tertiary" : "text-text-primary"}`, children: u.title }),
              /* @__PURE__ */ e.jsx(ze, { bg: x.bg, fg: x.fg, children: x.label }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: st(u.dueDate) }),
              /* @__PURE__ */ e.jsx(at, { name: u.assigneeName }),
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-right shrink-0 text-[10px] text-text-tertiary" })
            ]
          },
          u.id
        );
      }),
      /* @__PURE__ */ e.jsx("div", { className: "px-4 py-3 border-t border-subtle first:border-t-0", children: /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: r,
          onChange: (u) => i(u.target.value),
          onKeyDown: (u) => {
            u.key === "Enter" && p();
          },
          disabled: o,
          placeholder: "Yeni alt görev başlığı",
          className: "w-full h-9 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      ) })
    ] }),
    c.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz alt görev yok." })
  ] });
}
function Na() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function ys(t) {
  const a = Na();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function vs(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, i = Fa();
  i && (r.RequestVerificationToken = i);
  const o = await fetch(`/api/tasks/attachments/upload/${t}`, {
    method: "POST",
    credentials: "include",
    headers: r,
    body: s
  });
  let l = null;
  try {
    l = await o.json();
  } catch {
  }
  if (!o.ok || (l == null ? void 0 : l.success) === !1)
    throw new Error((l == null ? void 0 : l.error) || "Dosya yüklenemedi.");
  return l;
}
function Nt(t) {
  const a = ae(), s = ["task-attachments", t], r = re({
    queryKey: s,
    queryFn: () => ys(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), o = se({
    mutationFn: (n) => vs(t, n),
    onSuccess: i
  }), l = se({
    mutationFn: (n) => Promise.resolve(Na().deleteAttachment(n)),
    onSuccess: i
  });
  return {
    attachments: r.data ?? [],
    isLoading: r.isLoading,
    upload: o.mutateAsync,
    remove: l.mutateAsync,
    isUploading: o.isPending
  };
}
function js({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: i } = Nt(t), o = ae(), l = h.useRef(null), [n, c] = h.useState(!1), d = et("Platform.Tasks.ShareExternally"), b = async (u, x) => {
    var g, f, j;
    try {
      await window.apya.platform.tasks.taskShare.setAttachmentGuestVisibility(u, x), o.invalidateQueries({ queryKey: ["task-attachments", t] });
    } catch (w) {
      (j = (f = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : f.error) == null || j.call(f, (w == null ? void 0 : w.message) || "Görünürlük değiştirilemedi.");
    }
  }, p = async (u) => {
    var x, g, f, j, w, T;
    if (u)
      try {
        await s(u), (f = (g = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : g.success) == null || f.call(g, "Dosya yüklendi.");
      } catch (E) {
        (T = (w = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : w.error) == null || T.call(w, (E == null ? void 0 : E.message) || "Dosya yüklenemedi.");
      } finally {
        l.current && (l.current.value = "");
      }
  }, m = async (u, x) => {
    var g, f, j;
    try {
      await r(u);
    } catch (w) {
      (j = (f = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : f.error) == null || j.call(f, (w == null ? void 0 : w.message) || `${x} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: l,
        type: "file",
        className: "hidden",
        onChange: (u) => {
          var x;
          return p((x = u.target.files) == null ? void 0 : x[0]);
        },
        disabled: i
      }
    ),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "button",
        tabIndex: 0,
        onClick: () => {
          var u;
          return (u = l.current) == null ? void 0 : u.click();
        },
        onKeyDown: (u) => {
          var x;
          u.key === "Enter" && ((x = l.current) == null || x.click());
        },
        onDragOver: (u) => {
          u.preventDefault(), n || c(!0);
        },
        onDragLeave: () => c(!1),
        onDrop: (u) => {
          var x, g;
          u.preventDefault(), c(!1), p((g = (x = u.dataTransfer) == null ? void 0 : x.files) == null ? void 0 : g[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${n ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${i ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-[26px] ${n ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: i ? "Yükleniyor…" : n ? "Bırakın, yükleyelim" : "Dosyaları buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, PDF, DOCX · max 25MB" })
        ]
      }
    ),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3", children: a.map((u) => {
      const x = ja(u.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${x.bg} ${x.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: u.fileName, children: u.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: va(u.fileSize) })
              ] })
            ] }),
            d && !u.isGuestUpload && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 text-[11px] text-text-tertiary cursor-pointer", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: !!u.isVisibleToGuests,
                  onChange: (g) => b(u.id, g.target.checked)
                }
              ),
              "Dış paylaşımda görünsün"
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2.5 border-t border-subtle", children: [
              /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[11px] text-text-tertiary", children: [
                u.uploaderName,
                u.isGuestUpload ? " · dış" : ""
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-1 shrink-0", children: [
                /* @__PURE__ */ e.jsx(
                  "a",
                  {
                    href: u.downloadUrl,
                    target: "_blank",
                    rel: "noreferrer",
                    title: "İndir",
                    "aria-label": `${u.fileName} dosyasini indir`,
                    className: "flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-primary-subtle hover:text-primary",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-download text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Sil",
                    "aria-label": `${u.fileName} dosyasini sil`,
                    onClick: () => m(u.id, u.fileName),
                    className: "flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                )
              ] })
            ] })
          ]
        },
        u.id
      );
    }) })
  ] });
}
function He() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Ns(t) {
  const a = He();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function wt(t) {
  const a = ae(), s = ["task-checklist", t], r = re({
    queryKey: s,
    queryFn: () => Ns(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), o = se({
    mutationFn: (c) => Promise.resolve(He().addChecklistItem(t, c)),
    onSuccess: i
  }), l = se({
    mutationFn: (c) => Promise.resolve(He().toggleChecklistItem(c)),
    onSuccess: i
  }), n = se({
    mutationFn: (c) => Promise.resolve(He().deleteChecklistItem(c)),
    onSuccess: i
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: o.mutateAsync,
    toggleItem: l.mutateAsync,
    removeItem: n.mutateAsync
  };
}
function ws({ taskId: t }) {
  const { items: a, isLoading: s, addItem: r, toggleItem: i, removeItem: o } = wt(t), [l, n] = h.useState(""), c = a.filter((p) => p.isDone).length, d = a.length ? Math.round(c / a.length * 100) : 0, b = async () => {
    var m, u, x;
    const p = l.trim();
    if (!(!p || !t)) {
      n("");
      try {
        await r(p);
      } catch (g) {
        n(p), (x = (u = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : u.error) == null || x.call(u, (g == null ? void 0 : g.message) || "Madde eklenemedi.");
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
        /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
          c,
          "/",
          a.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: [
        "%",
        d
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mt-3.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
      "div",
      {
        className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
        style: { width: `${d}%` }
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
      s && a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 py-2 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
      !s && a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 py-2 text-[12.5px] text-text-tertiary", children: "Henüz madde yok. Aşağıdan ilk maddeyi ekleyin." }),
      a.map((p) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": p.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
            onClick: () => i(p.id).catch((m) => {
              var u, x, g;
              return (g = (x = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : x.error) == null ? void 0 : g.call(x, (m == null ? void 0 : m.message) || "Durum güncellenemedi.");
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
            "aria-label": `${p.text} maddesini sil`,
            onClick: () => o(p.id).catch((m) => {
              var u, x, g;
              return (g = (x = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : x.error) == null ? void 0 : g.call(x, (m == null ? void 0 : m.message) || "Madde silinemedi.");
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
          value: l,
          onChange: (p) => n(p.target.value),
          onKeyDown: (p) => {
            p.key === "Enter" && b();
          },
          placeholder: "Yeni madde yaz ve Enter'a bas…",
          "aria-label": "Yeni kontrol listesi maddesi",
          className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      )
    ] })
  ] });
}
function ks({ taskId: t, task: a }) {
  const [s, r] = h.useState(""), [i, o] = h.useState(null), [l, n] = h.useState(""), [c, d] = h.useState(!1), b = ae(), p = (a == null ? void 0 : a.comments) ?? [], m = async (x) => {
    var g, f, j, w, T, E;
    if (x == null || x.preventDefault(), !(!s.trim() || c)) {
      d(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), b.invalidateQueries({ queryKey: ["task-detail", t] }), (j = (f = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : f.success) == null || j.call(f, "Yorum eklendi.");
      } catch (S) {
        (E = (T = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : T.error) == null || E.call(T, (S == null ? void 0 : S.message) || "Yorum eklenemedi.");
      } finally {
        d(!1);
      }
    }
  }, u = async (x) => {
    var g, f, j, w, T, E;
    if (!(!l.trim() || c)) {
      d(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(x, l.trim())
        ), n(""), o(null), b.invalidateQueries({ queryKey: ["task-detail", t] }), (j = (f = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : f.success) == null || j.call(f, "Yanıt eklendi.");
      } catch (S) {
        (E = (T = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : T.error) == null || E.call(T, (S == null ? void 0 : S.message) || "Yanıt eklenemedi.");
      } finally {
        d(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("form", { onSubmit: m, className: "rounded-lg border border-default p-3 bg-surface-base", children: [
      /* @__PURE__ */ e.jsx(
        "textarea",
        {
          rows: 3,
          value: s,
          onChange: (x) => r(x.target.value),
          placeholder: "Bir yorum veya güncelleme yazın...",
          className: "w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ e.jsx(
        ne,
        {
          type: "submit",
          variant: "primary",
          disabled: !s.trim() || c,
          isLoading: c,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    p.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: p.map((x) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: x.creatorUserName || x.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: x.creationTime ? new Date(x.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: x.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        ne,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => o(i === x.id ? null : x.id),
          children: "Yanıtla"
        }
      ) }),
      i === x.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: l,
            onChange: (g) => n(g.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(ne, { variant: "ghost", size: "sm", onClick: () => o(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(ne, { variant: "primary", size: "sm", disabled: !l.trim() || c, onClick: () => u(x.id), children: "Gönder" })
        ] })
      ] }),
      x.replies && x.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: x.replies.map((g) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: g.creatorUserName || g.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: g.creationTime ? new Date(g.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: g.text })
      ] }, g.id)) })
    ] }, x.id)) })
  ] });
}
function nt() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.taskShare) ?? null;
}
function Ds(t) {
  const a = ae(), s = ["task-share-links", t], r = re({
    queryKey: s,
    queryFn: () => {
      const n = nt();
      return n ? Promise.resolve(n.getList(t)) : Promise.reject(new Error("Paylaşım servisi yüklenmedi."));
    },
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), o = se({
    mutationFn: (n) => Promise.resolve(nt().create({ ...n, taskId: t })),
    onSuccess: i
  }), l = se({
    mutationFn: (n) => Promise.resolve(nt().revoke(n)),
    onSuccess: i
  });
  return {
    links: r.data ?? [],
    /* isLoading DEĞİL isPending: kalıcı önbellek geri yüklenirken isLoading
       FALSE döner ama liste henüz yoktur; sekme o karede "henüz kimseyle
       paylaşılmadı" yazıyordu — paylaşımı olan görevde bile. */
    isPending: r.isPending,
    error: r.error,
    create: o.mutateAsync,
    revoke: l.mutateAsync,
    isCreating: o.isPending
  };
}
const Ft = {
  recipientName: "",
  recipientEmail: "",
  lifetimeDays: 14,
  allowComment: !0,
  allowUpload: !0,
  allowDownload: !0
};
function Cs(t) {
  return t ? new Date(t).toLocaleDateString("tr-TR") : "—";
}
function Ts({ taskId: t }) {
  const { links: a, isPending: s, create: r, revoke: i, isCreating: o } = Ds(t), [l, n] = h.useState(Ft), [c, d] = h.useState(null);
  if (!et("Platform.Tasks.ShareExternally"))
    return /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Görevi ekip dışıyla paylaşma yetkiniz yok." });
  const p = (f) => (j) => {
    const w = j.target.type === "checkbox" ? j.target.checked : j.target.value;
    n((T) => ({ ...T, [f]: w }));
  }, m = async (f) => {
    var j, w, T;
    if (f.preventDefault(), !!l.recipientName.trim())
      try {
        const E = await r({
          ...l,
          lifetimeDays: Number(l.lifetimeDays) || 14
        });
        d(E), n(Ft);
      } catch (E) {
        (T = (w = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : w.error) == null || T.call(w, (E == null ? void 0 : E.message) || "Paylaşım linki üretilemedi.");
      }
  }, u = (f) => `${window.location.origin}${f}`, x = (f) => {
    var j, w, T, E;
    (j = navigator.clipboard) == null || j.writeText(u(f)), (E = (T = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : T.info) == null || E.call(T, "Bağlantı kopyalandı.");
  }, g = async (f) => {
    var j, w, T;
    try {
      await i(f);
    } catch (E) {
      (T = (w = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : w.error) == null || T.call(w, (E == null ? void 0 : E.message) || "Bağlantı iptal edilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    c && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 rounded-[14px] border border-focus bg-primary-subtle p-3.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "text-[12.5px] font-bold text-text-primary", children: [
        "Bağlantı hazır — ",
        /* @__PURE__ */ e.jsx("span", { className: "font-normal", children: "şimdi kopyalayın, bir daha gösterilmeyecek." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("code", { className: "min-w-0 flex-1 truncate rounded-[8px] bg-surface-base px-2.5 py-2 font-mono text-[11.5px] text-text-secondary", children: u(c.url) }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => x(c.url),
            className: "rounded-[8px] bg-primary px-3 py-2 text-[12px] font-bold text-white cursor-pointer",
            children: "Kopyala"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => d(null),
            className: "rounded-[8px] px-3 py-2 text-[12px] font-bold text-text-tertiary cursor-pointer hover:text-text-primary",
            children: "Kapat"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("form", { onSubmit: m, className: "flex flex-col gap-2.5 rounded-[14px] border border-subtle bg-surface-base p-3.5", children: [
      /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary", children: "Yeni paylaşım bağlantısı" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2.5", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            required: !0,
            value: l.recipientName,
            onChange: p("recipientName"),
            placeholder: "Kime? (ad soyad)",
            className: "min-w-0 flex-[2_1_180px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "email",
            value: l.recipientEmail,
            onChange: p("recipientEmail"),
            placeholder: "E-posta (isteğe bağlı)",
            className: "min-w-0 flex-[2_1_180px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "number",
            min: "1",
            max: "90",
            value: l.lifetimeDays,
            onChange: p("lifetimeDays"),
            title: "Geçerlilik (gün)",
            className: "w-[92px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: l.allowComment, onChange: p("allowComment") }),
          "Yorum yazabilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: l.allowUpload, onChange: p("allowUpload") }),
          "Dosya yükleyebilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: l.allowDownload, onChange: p("allowDownload") }),
          "Dosya indirebilsin"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: "Bağlantı bu görevi ve alt görevlerini açar. Ekip içi yorumlar gösterilmez." }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "submit",
            disabled: o,
            className: "shrink-0 rounded-[8px] bg-primary px-3.5 py-2 text-[12px] font-bold text-white cursor-pointer disabled:opacity-60",
            children: o ? "Üretiliyor…" : "Bağlantı üret"
          }
        )
      ] })
    ] }),
    s ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görev henüz kimseyle paylaşılmadı." }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: a.map((f) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-subtle bg-surface-base p-3",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "truncate text-[12.5px] font-bold text-text-primary", children: [
              f.recipientName,
              f.recipientEmail ? /* @__PURE__ */ e.jsxs("span", { className: "font-normal text-text-tertiary", children: [
                " · ",
                f.recipientEmail
              ] }) : null
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "text-[11.5px] text-text-tertiary", children: [
              f.isActive ? `${Cs(f.expiresAt)} tarihine kadar geçerli` : f.revokedAt ? "İptal edildi" : "Süresi doldu",
              " · ",
              f.accessCount,
              " erişim",
              " · ",
              f.uploadCount,
              " dosya"
            ] })
          ] }),
          f.isActive && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => g(f.id),
              className: "shrink-0 rounded-[8px] px-3 py-1.5 text-[12px] font-bold text-text-negative cursor-pointer hover:bg-negative-subtle",
              children: "İptal et"
            }
          )
        ]
      },
      f.id
    )) })
  ] });
}
function Ss({ task: t }) {
  var s;
  const a = [];
  return t != null && t.creationTime && a.push({
    id: "created",
    icon: "fa-plus",
    bg: "bg-success-subtle",
    fg: "text-success",
    actor: t.creatorUserName || t.creatorName || "Sistem / Kullanıcı",
    event: "görevi oluşturdu",
    time: gt(t.creationTime)
  }), t != null && t.lastModificationTime && a.push({
    id: "modified",
    icon: "fa-pen",
    bg: "bg-warning-subtle",
    fg: "text-warning",
    actor: t.lastModifierUserName || t.lastModifierName || "Kullanıcı",
    event: "görevi güncelledi",
    time: gt(t.lastModificationTime)
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
    a.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Aktivite kaydı bulunamadı." }) }) : /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: a.map((r, i) => {
      const o = i === a.length - 1;
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
const Ee = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : null;
function $s({ label: t, value: a, hint: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4 px-3.5 py-3", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[12.5px] font-semibold text-text-secondary", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 text-right", children: [
      /* @__PURE__ */ e.jsx("span", { className: "block text-[12.5px] font-bold text-text-primary break-words", children: a ?? "—" }),
      s && /* @__PURE__ */ e.jsx("span", { className: "block text-[11px] text-text-tertiary", children: s })
    ] })
  ] });
}
function Es({ task: t = {}, nameById: a }) {
  const s = (i) => {
    var o;
    return i && ((o = a == null ? void 0 : a.get) == null ? void 0 : o.call(a, i)) || null;
  }, r = [
    { label: "Görev kodu", value: t.code || "—" },
    {
      label: "Oluşturulma",
      value: Ee(t.creationTime),
      hint: s(t.creatorId) ? `${s(t.creatorId)} tarafından` : null
    },
    {
      label: "Son güncelleme",
      value: Ee(t.lastModificationTime) ?? "Henüz güncellenmedi",
      hint: s(t.lastModifierId) ? `${s(t.lastModifierId)} tarafından` : null
    },
    { label: "Planlanan başlangıç", value: Ee(t.startDate) },
    { label: "Termin", value: Ee(t.dueDate) }
  ];
  return t.completedDate && r.push({ label: "Tamamlanma", value: Ee(t.completedDate) }), t.cancelledDate && r.push({
    label: "İptal",
    value: Ee(t.cancelledDate),
    hint: t.cancelReason || null
  }), /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-3.5 py-3 border-b border-subtle bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clock-rotate-left text-[13px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: "Kayıt bilgileri" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "divide-y divide-subtle", children: r.map((i) => /* @__PURE__ */ e.jsx($s, { ...i }, i.label)) })
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11.5px] text-text-tertiary", children: "Alan bazında değişiklik günlüğü (hangi alan, eski/yeni değer) henüz yayınlanmadı." })
  ] });
}
function ke(t, a) {
  const s = a || "TRY";
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: s, minimumFractionDigits: 2 }).format(t || 0);
  } catch {
    return `${(t || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${s}`.trim();
  }
}
function it({ label: t, value: a, tone: s, note: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: `font-mono text-[22px] font-bold tracking-[-.02em] ${s}`, style: { fontVariantNumeric: "tabular-nums" }, children: a }),
    r && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
  ] });
}
function Ps({ task: t, spentByCurrency: a }) {
  const s = t == null ? void 0 : t.plannedAmount;
  if (!(t != null && t.budgetLineId) || s == null)
    return null;
  const r = a, i = s - r, o = s > 0 ? Math.round(r / s * 100) : 0, l = i < 0;
  return /* @__PURE__ */ e.jsxs("div", { className: De, children: [
    /* @__PURE__ */ e.jsx(Xe, { title: "Bütçe bağı" }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-4 pb-4 pt-1 flex flex-col gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-semibold text-accent", children: t.budgetLineName || "Bütçe kalemi" }),
        t.budgetLineRemaining != null && /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "kalemde kalan ",
          ke(t.budgetLineRemaining, "TRY")
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3", children: [
        /* @__PURE__ */ e.jsx(lt, { label: "Görev bütçesi", value: ke(s, "TRY") }),
        /* @__PURE__ */ e.jsx(lt, { label: "Gerçekleşen", value: ke(r, "TRY") }),
        /* @__PURE__ */ e.jsx(
          lt,
          {
            label: "Kalan",
            value: ke(i, "TRY"),
            tone: l ? "text-negative" : "text-success"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: `h-full rounded-full ${l ? "bg-negative" : o >= 80 ? "bg-warning" : "bg-success"}`,
            style: { width: `${Math.min(Math.max(o, 0), 100)}%` }
          }
        ) }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-1 text-[11.5px] text-text-tertiary", children: [
          "%",
          o,
          l && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative", children: "· görev bütçesi aşıldı" })
        ] })
      ] })
    ] })
  ] });
}
function lt({ label: t, value: a, tone: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx(
      "span",
      {
        className: `font-mono text-[15px] font-bold ${s || "text-text-primary"}`,
        style: { fontVariantNumeric: "tabular-nums" },
        children: a
      }
    )
  ] });
}
function As({ task: t }) {
  const a = (t == null ? void 0 : t.expenses) || [], s = (t == null ? void 0 : t.incomes) || [], r = a.filter((c) => (c.currency || "TRY") === "TRY").reduce((c, d) => c + (d.amount || 0), 0), i = /* @__PURE__ */ e.jsx(Ps, { task: t, spentByCurrency: r });
  if (a.length === 0 && s.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      i,
      /* @__PURE__ */ e.jsxs("div", { className: De, children: [
        /* @__PURE__ */ e.jsx(Xe, { title: "Görev Finansı" }),
        /* @__PURE__ */ e.jsx(
          me,
          {
            icon: "fa-coins",
            title: "Kayıt yok",
            description: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
          }
        )
      ] })
    ] });
  const l = Array.from(new Set([...a, ...s].map((c) => c.currency || "TRY"))).map((c) => {
    const d = s.filter((p) => (p.currency || "TRY") === c).reduce((p, m) => p + (m.amount || 0), 0), b = a.filter((p) => (p.currency || "TRY") === c).reduce((p, m) => p + (m.amount || 0), 0);
    return { cur: c, inc: d, exp: b, net: d - b };
  }), n = [
    ...s.map((c) => ({ ...c, kind: "income" })),
    ...a.map((c) => ({ ...c, kind: "expense" }))
  ].sort((c, d) => new Date(d.date || 0) - new Date(c.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    i,
    l.map(({ cur: c, inc: d, exp: b, net: p }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(it, { label: `Toplam Gelir (${c})`, value: ke(d, c), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(it, { label: `Toplam Gider (${c})`, value: ke(b, c), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        it,
        {
          label: `Net Bakiye (${c})`,
          value: ke(p, c),
          tone: p >= 0 ? "text-success" : "text-negative",
          note: p >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, c)),
    /* @__PURE__ */ e.jsxs("div", { className: De, children: [
      /* @__PURE__ */ e.jsx(Xe, { title: "Finans kalemleri" }),
      n.map((c) => /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-7 w-7 rounded-lg bg-neutral-subtle text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c.kind === "income" ? "fa-arrow-down" : "fa-arrow-up"} text-[11px]` }) }),
            /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] font-semibold text-text-primary", children: c.title || (c.kind === "income" ? "Gelir" : "Gider") }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: st(c.date) }),
            c.kind === "income" ? /* @__PURE__ */ e.jsx(ze, { bg: "bg-success-subtle", fg: "text-success", children: "Gelir" }) : /* @__PURE__ */ e.jsx(ze, { bg: "bg-warning-subtle", fg: "text-warning", children: "Gider" }),
            /* @__PURE__ */ e.jsxs(
              "span",
              {
                className: `shrink-0 font-mono text-[12.5px] font-bold ${c.kind === "income" ? "text-success" : "text-text-primary"}`,
                style: { fontVariantNumeric: "tabular-nums" },
                children: [
                  c.kind === "income" ? "+" : "−",
                  ke(c.amount, c.currency)
                ]
              }
            )
          ]
        },
        `${c.kind}-${c.id}`
      ))
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11px] text-text-tertiary", children: "Kayıtlar Finans modülünden yönetilir; buraya göreve etiketlenmiş gider/gelirler yansır." })
  ] });
}
function zs({ taskId: t }) {
  const { attachments: a, isLoading: s, upload: r, remove: i, isUploading: o } = Nt(t), l = h.useRef(null), [n, c] = h.useState(!1), d = a.filter((m) => Rt(m.fileName)), b = async (m) => {
    var u, x, g, f, j, w, T, E, S;
    if (m) {
      if (!Rt(m.name)) {
        (g = (x = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : x.error) == null || g.call(x, "Galeriye yalnız görsel dosya yüklenebilir.");
        return;
      }
      try {
        await r(m), (w = (j = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : j.success) == null || w.call(j, "Görsel yüklendi.");
      } catch (z) {
        (S = (E = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : E.error) == null || S.call(E, (z == null ? void 0 : z.message) || "Görsel yüklenemedi.");
      } finally {
        l.current && (l.current.value = "");
      }
    }
  }, p = async (m, u) => {
    var x, g, f;
    try {
      await i(m);
    } catch (j) {
      (f = (g = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : g.error) == null || f.call(g, (j == null ? void 0 : j.message) || `${u} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: l,
        type: "file",
        accept: "image/*",
        className: "hidden",
        onChange: (m) => {
          var u;
          return b((u = m.target.files) == null ? void 0 : u[0]);
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
          var m;
          return (m = l.current) == null ? void 0 : m.click();
        },
        onKeyDown: (m) => {
          var u;
          m.key === "Enter" && ((u = l.current) == null || u.click());
        },
        onDragOver: (m) => {
          m.preventDefault(), n || c(!0);
        },
        onDragLeave: () => c(!1),
        onDrop: (m) => {
          var u, x;
          m.preventDefault(), c(!1), b((x = (u = m.dataTransfer) == null ? void 0 : u.files) == null ? void 0 : x[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${n ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${o ? "fa-circle-notch fa-spin" : "fa-images"} text-[26px] ${n ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: o ? "Yükleniyor…" : n ? "Bırakın, yükleyelim" : "Görselleri buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, JPG, GIF, WEBP, SVG · max 25MB" })
        ]
      }
    ),
    s && d.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !s && d.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görevde henüz görsel yok. Yüklediğiniz görseller Dosyalar sekmesinde de görünür." }),
    d.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3", children: d.map((m) => /* @__PURE__ */ e.jsxs(
      "figure",
      {
        className: "group relative m-0 flex flex-col overflow-hidden rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
        children: [
          /* @__PURE__ */ e.jsx(
            "a",
            {
              href: m.downloadUrl,
              target: "_blank",
              rel: "noreferrer",
              title: `${m.fileName} — tam boyutta aç`,
              className: "block aspect-[4/3] overflow-hidden bg-neutral-subtle",
              children: /* @__PURE__ */ e.jsx(
                "img",
                {
                  src: m.downloadUrl,
                  alt: m.fileName,
                  loading: "lazy",
                  className: "h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                }
              )
            }
          ),
          /* @__PURE__ */ e.jsxs("figcaption", { className: "flex items-center justify-between gap-2 p-2.5", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12px] font-bold text-text-primary", title: m.fileName, children: m.fileName }),
              /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: va(m.fileSize) })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                title: "Sil",
                "aria-label": `${m.fileName} gorselini sil`,
                onClick: () => p(m.id, m.fileName),
                className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
              }
            )
          ] })
        ]
      },
      m.id
    )) })
  ] });
}
const Bs = [
  { key: "title", label: "Başlık", align: "left" },
  { key: "status", label: "Durum", align: "left" },
  { key: "priority", label: "Öncelik", align: "left" },
  { key: "assignee", label: "Atanan", align: "left" },
  { key: "dueDate", label: "Termin", align: "right" }
];
function Gt(t, a) {
  switch (a) {
    case "title":
      return (t.title || "").toLocaleLowerCase("tr");
    case "status":
      return t.status ?? -1;
    case "priority":
      return t.priority ?? -1;
    case "assignee":
      return (t.assigneeName || "").toLocaleLowerCase("tr");
    case "dueDate":
      return t.dueDate ? new Date(t.dueDate).getTime() : null;
    default:
      return null;
  }
}
function Ls(t, a, s, r) {
  const i = Gt(t, s), o = Gt(a, s), l = i === null || i === "", n = o === null || o === "";
  return l && n ? 0 : l ? 1 : n ? -1 : i === o ? 0 : (i < o ? -1 : 1) * (r === "asc" ? 1 : -1);
}
function Ks({ task: t = {}, onOpenSubtask: a }) {
  const [s, r] = h.useState({ key: "dueDate", dir: "asc" }), i = (t == null ? void 0 : t.subTasks) ?? [], o = h.useMemo(
    () => [...i].sort((n, c) => Ls(n, c, s.key, s.dir)),
    [i, s.key, s.dir]
  ), l = (n) => r((c) => c.key === n ? { key: n, dir: c.dir === "asc" ? "desc" : "asc" } : { key: n, dir: "asc" });
  return i.length === 0 ? /* @__PURE__ */ e.jsx(
    me,
    {
      icon: "fa-table",
      title: "Alt görev yok",
      description: "Alt Görevler sekmesinden ekledikleriniz burada tablo olarak listelenir."
    }
  ) : /* @__PURE__ */ e.jsx("div", { className: `${De} overflow-x-auto`, children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse text-[12.5px]", children: [
    /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsx("tr", { className: "bg-surface-raised", children: Bs.map((n) => {
      const c = s.key === n.key;
      return /* @__PURE__ */ e.jsx(
        "th",
        {
          scope: "col",
          "aria-sort": c ? s.dir === "asc" ? "ascending" : "descending" : "none",
          className: `px-3.5 py-2.5 border-b border-subtle font-bold text-text-secondary whitespace-nowrap ${n.align === "right" ? "text-right" : "text-left"}`,
          children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => l(n.key),
              className: `inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer font-bold ${c ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`,
              children: [
                n.label,
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid text-[9px] ${c ? s.dir === "asc" ? "fa-arrow-up-short-wide" : "fa-arrow-down-wide-short" : "fa-sort opacity-40"}` })
              ]
            }
          )
        },
        n.key
      );
    }) }) }),
    /* @__PURE__ */ e.jsx("tbody", { children: o.map((n) => {
      const c = pe(n.status), d = tt(n.priority), b = ya(n.dueDate);
      return /* @__PURE__ */ e.jsxs(
        "tr",
        {
          onClick: () => a == null ? void 0 : a(n.id),
          className: "border-b border-subtle last:border-b-0 cursor-pointer hover:bg-surface-raised",
          children: [
            /* @__PURE__ */ e.jsxs("td", { className: "px-3.5 py-2.5 max-w-[320px]", children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: (p) => {
                    p.stopPropagation(), a == null || a(n.id);
                  },
                  title: n.title,
                  className: `block w-full truncate bg-transparent border-0 p-0 text-left font-semibold cursor-pointer ${n.status === 4 ? "line-through text-text-tertiary" : "text-text-primary"}`,
                  children: n.title
                }
              ),
              n.code && /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: n.code })
            ] }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(ze, { bg: c.bg, fg: c.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c.icon} text-[9px] mr-1` }),
              c.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(ze, { bg: d.bg, fg: d.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.icon} text-[9px] mr-1` }),
              d.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: n.assigneeName ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ e.jsx(at, { name: n.assigneeName, size: 22 }),
              /* @__PURE__ */ e.jsx("span", { className: "truncate text-text-secondary", children: n.assigneeName })
            ] }) : /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: "Atanmadı" }) }),
            /* @__PURE__ */ e.jsxs("td", { className: `px-3.5 py-2.5 text-right whitespace-nowrap ${b.tone}`, children: [
              n.dueDate ? st(n.dueDate) : "—",
              b.hint && /* @__PURE__ */ e.jsx("div", { className: "text-[11px]", children: b.hint })
            ] })
          ]
        },
        n.id
      );
    }) })
  ] }) });
}
function Ms({ taskId: t, task: a = {}, onOpenSubtask: s }) {
  const r = ae(), i = (a == null ? void 0 : a.subTasks) ?? [], [o, l] = h.useState(null), [n, c] = h.useState(null), d = async (b, p) => {
    var u, x, g;
    const m = i.find((f) => f.id === b);
    if (!(!m || m.status === p)) {
      c(b);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.updateStatus(b, p)), await r.invalidateQueries({ queryKey: ["task-detail", t] });
      } catch (f) {
        (g = (x = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : x.error) == null || g.call(x, (f == null ? void 0 : f.message) || "Alt görev durumu güncellenemedi.");
      } finally {
        c(null);
      }
    }
  };
  return i.length === 0 ? /* @__PURE__ */ e.jsx(
    me,
    {
      icon: "fa-table-columns",
      title: "Alt görev yok",
      description: "Alt Görevler sekmesinden ekledikleriniz burada duruma göre sütunlanır."
    }
  ) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(4,minmax(190px,1fr))] lt-1080:grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 items-start", children: Je.map((b) => {
    const p = pe(b), m = i.filter((x) => x.status === b), u = o === b;
    return /* @__PURE__ */ e.jsxs(
      "section",
      {
        "aria-label": `${p.label} sütunu`,
        onDragOver: (x) => {
          x.preventDefault(), o !== b && l(b);
        },
        onDragLeave: () => l((x) => x === b ? null : x),
        onDrop: (x) => {
          var f;
          x.preventDefault(), l(null);
          const g = (f = x.dataTransfer) == null ? void 0 : f.getData("text/plain");
          g && d(g, b);
        },
        className: `flex flex-col gap-2 p-2.5 rounded-2xl border bg-surface-raised min-h-[120px] transition-colors duration-fast ${u ? "border-focus bg-primary-subtle" : "border-subtle"}`,
        children: [
          /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-2 px-1", children: [
            /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${p.dot}` }),
            /* @__PURE__ */ e.jsx("h3", { className: "m-0 flex-1 text-[12px] font-bold text-text-primary", children: p.label }),
            /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: m.length })
          ] }),
          m.map((x) => {
            const g = tt(x.priority);
            return /* @__PURE__ */ e.jsxs(
              "article",
              {
                draggable: !0,
                onDragStart: (f) => {
                  var j;
                  return (j = f.dataTransfer) == null ? void 0 : j.setData("text/plain", x.id);
                },
                role: "button",
                tabIndex: 0,
                onClick: () => s == null ? void 0 : s(x.id),
                onKeyDown: (f) => {
                  f.key === "Enter" && (s == null || s(x.id));
                },
                className: `flex flex-col gap-2 p-2.5 rounded-[12px] border border-subtle bg-surface-base shadow-xs cursor-pointer hover:border-focus hover:shadow-md ${n === x.id ? "opacity-60" : ""}`,
                children: [
                  /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary line-clamp-2", children: x.title }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ e.jsxs("span", { className: `text-[10.5px] font-bold ${g.fg}`, children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${g.icon} text-[9px] mr-1` }),
                      g.label
                    ] }),
                    x.dueDate && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: st(x.dueDate) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2 border-t border-subtle", children: [
                    x.assigneeName ? /* @__PURE__ */ e.jsx(at, { name: x.assigneeName, size: 20 }) : /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] text-text-tertiary", children: "Atanmadı" }),
                    /* @__PURE__ */ e.jsx(
                      "select",
                      {
                        "aria-label": `${x.title} durumunu değiştir`,
                        value: x.status,
                        onClick: (f) => f.stopPropagation(),
                        onChange: (f) => d(x.id, Number(f.target.value)),
                        className: "h-[24px] px-1.5 rounded-[6px] border border-subtle bg-surface-base text-[10.5px] text-text-secondary cursor-pointer",
                        children: Je.map((f) => /* @__PURE__ */ e.jsx("option", { value: f, children: pe(f).label }, f))
                      }
                    )
                  ] })
                ]
              },
              x.id
            );
          })
        ]
      },
      b
    );
  }) });
}
const Is = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık"
], Rs = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], qt = (t) => String(t).padStart(2, "0"), wa = (t, a, s) => `${t}-${qt(a + 1)}-${qt(s)}`;
function yt(t) {
  if (!t) return null;
  const a = /^(\d{4}-\d{2}-\d{2})/.exec(String(t));
  return a ? a[1] : null;
}
function Fs(t, a) {
  const r = (new Date(t, a, 1).getDay() + 6) % 7, i = new Date(t, a + 1, 0).getDate(), o = [];
  for (let l = 0; l < 42; l++) {
    const n = l - r + 1;
    o.push(n >= 1 && n <= i ? { key: wa(t, a, n), day: n, inMonth: !0 } : { key: `bos-${l}`, day: null, inMonth: !1 });
  }
  return o;
}
function Gs(t) {
  const a = /* @__PURE__ */ new Map(), s = (r, i) => {
    const o = yt(r);
    o && (a.has(o) || a.set(o, []), a.get(o).push(i));
  };
  s(t == null ? void 0 : t.startDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "start", isSelf: !0, status: t == null ? void 0 : t.status }), s(t == null ? void 0 : t.dueDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "due", isSelf: !0, status: t == null ? void 0 : t.status });
  for (const r of (t == null ? void 0 : t.subTasks) ?? [])
    s(r.startDate, { id: r.id, title: r.title, kind: "start", isSelf: !1, status: r.status }), s(r.dueDate, { id: r.id, title: r.title, kind: "due", isSelf: !1, status: r.status });
  return a;
}
function qs({ task: t = {}, onOpenSubtask: a }) {
  const s = h.useMemo(() => Gs(t), [t]), [r, i] = h.useState(() => {
    const d = yt(t == null ? void 0 : t.startDate) ?? yt(t == null ? void 0 : t.dueDate);
    if (d) {
      const [p, m] = d.split("-").map(Number);
      return { year: p, month: m - 1 };
    }
    const b = /* @__PURE__ */ new Date();
    return { year: b.getFullYear(), month: b.getMonth() };
  }), o = h.useMemo(() => Fs(r.year, r.month), [r.year, r.month]), l = (d) => i(({ year: b, month: p }) => {
    const m = p + d;
    return { year: b + Math.floor(m / 12), month: (m % 12 + 12) % 12 };
  }), n = /* @__PURE__ */ new Date(), c = wa(n.getFullYear(), n.getMonth(), n.getDate());
  return s.size === 0 ? /* @__PURE__ */ e.jsx(
    me,
    {
      icon: "fa-calendar",
      title: "Takvimde gösterilecek tarih yok",
      description: "Göreve başlangıç veya termin tarihi girildiğinde burada aylık takvimde görünür."
    }
  ) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-3.5 py-3 border-b border-subtle bg-surface-raised", children: [
      /* @__PURE__ */ e.jsxs("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: [
        Is[r.month],
        " ",
        r.year
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Önceki ay",
            onClick: () => l(-1),
            className: "flex items-center justify-center h-7 w-7 rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-left text-[11px]" })
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => i({ year: n.getFullYear(), month: n.getMonth() }),
            className: "h-7 px-2.5 rounded-lg border border-subtle bg-surface-base text-[11.5px] font-semibold text-text-secondary hover:text-text-primary cursor-pointer",
            children: "Bugün"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Sonraki ay",
            onClick: () => l(1),
            className: "flex items-center justify-center h-7 w-7 rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-right text-[11px]" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-subtle bg-surface-raised", children: Rs.map((d) => /* @__PURE__ */ e.jsx("span", { className: "px-2 py-1.5 text-center text-[11px] font-bold text-text-tertiary", children: d }, d)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: o.map((d) => {
      const b = d.inMonth ? s.get(d.key) ?? [] : [], p = d.key === c;
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: `flex flex-col gap-1 min-h-[76px] p-1.5 border-r border-b border-subtle last-of-type:border-r-0 ${d.inMonth ? "" : "bg-surface-sunken"}`,
          children: [
            d.inMonth && /* @__PURE__ */ e.jsx("span", { className: `self-end font-mono text-[11px] font-bold ${p ? "flex items-center justify-center h-[18px] w-[18px] rounded-full bg-primary text-white" : "text-text-tertiary"}`, children: d.day }),
            b.map((m, u) => {
              const x = pe(m.status);
              return /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  title: `${m.title} — ${m.kind === "due" ? "termin" : "başlangıç"}`,
                  onClick: () => {
                    m.isSelf || a == null || a(m.id);
                  },
                  className: `flex items-center gap-1 w-full px-1.5 py-[3px] rounded-[6px] text-left text-[10.5px] font-semibold ${x.bg} ${x.fg} ${m.isSelf ? "cursor-default" : "cursor-pointer hover:brightness-95"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${m.kind === "due" ? "fa-flag-checkered" : "fa-play"} text-[8px] shrink-0` }),
                    /* @__PURE__ */ e.jsx("span", { className: "truncate", children: m.title })
                  ]
                },
                `${m.id}-${m.kind}-${u}`
              );
            })
          ]
        },
        d.key
      );
    }) })
  ] });
}
function Fe() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Ys(t) {
  const a = Fe();
  return a ? Promise.resolve(a.getDocuments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Us(t) {
  const a = ae(), s = ["task-documents", t], r = re({
    queryKey: s,
    queryFn: () => Ys(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), o = se({
    mutationFn: (c) => Promise.resolve(Fe().createDocument(t, c)),
    onSuccess: i
  }), l = se({
    mutationFn: ({ id: c, title: d, content: b }) => Promise.resolve(Fe().updateDocument(c, { title: d, content: b })),
    onSuccess: (c) => {
      i(), c != null && c.id && a.setQueryData(["task-document", c.id], c);
    }
  }), n = se({
    mutationFn: (c) => Promise.resolve(Fe().deleteDocument(c)),
    onSuccess: i
  });
  return {
    documents: r.data ?? [],
    isLoading: r.isLoading,
    createDocument: o.mutateAsync,
    updateDocument: l.mutateAsync,
    removeDocument: n.mutateAsync,
    isSaving: l.isPending
  };
}
function _s(t) {
  return re({
    queryKey: ["task-document", t],
    queryFn: () => Promise.resolve(Fe().getDocument(t)),
    enabled: !!t,
    retry: !1
  });
}
function Se(t) {
  return (t == null ? void 0 : t.closest('[role="dialog"]')) ?? void 0;
}
const Os = [
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
], Vs = '<table class="apya-rte-table"><tr><th>Kolon 1</th><th>Kolon 2</th></tr><tr><td>Değer</td><td>Değer</td></tr></table><p><br></p>', Hs = '<div class="apya-rte-imgph">görsel yer tutucu</div><p><br></p>';
function Qs(t) {
  return t ? /<[a-z][\s\S]*>/i.test(t) ? t : `<p>${t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>` : "";
}
function ka({ value: t, onChange: a, mentionName: s = "ekip arkadaşı" }) {
  const r = h.useRef(null), i = h.useRef(Qs(t)), [o, l] = h.useState(!1), [n, c] = h.useState("https://"), d = h.useRef(null), b = (f, j) => {
    var w, T;
    (w = r.current) == null || w.focus();
    try {
      document.execCommand(f, !1, j);
    } catch {
    }
    a == null || a(((T = r.current) == null ? void 0 : T.innerHTML) ?? "");
  }, p = () => {
    const f = window.getSelection();
    d.current = f && f.rangeCount ? f.getRangeAt(0).cloneRange() : null;
  }, m = () => {
    const f = d.current;
    if (!f) return;
    const j = window.getSelection();
    j.removeAllRanges(), j.addRange(f);
  }, u = () => {
    var j;
    const f = n.trim();
    l(!1), !(!f || f === "https://") && ((j = r.current) == null || j.focus(), m(), b("createLink", f), c("https://"));
  }, x = (f) => {
    switch (f.cmd) {
      case "link":
        p();
        return;
      case "image":
        b("insertHTML", Hs);
        return;
      case "table":
        b("insertHTML", Vs);
        return;
      case "mention":
        b("insertHTML", `<span class="apya-rte-mention">@${s}</span>&nbsp;`);
        return;
      default:
        b(f.cmd, f.arg);
    }
  }, g = "flex shrink-0 items-center justify-center h-7 w-7 rounded-[7px] border-0 bg-transparent text-text-secondary cursor-pointer hover:bg-surface-base hover:text-primary hover:shadow-xs";
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-[14px] border border-default bg-surface-base overflow-hidden shadow-xs", children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-0.5 px-2 py-1.5 border-b border-subtle bg-neutral-subtle overflow-x-auto custom-scrollbar", children: Os.map((f) => {
      const j = /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          title: f.title,
          onMouseDown: (w) => {
            w.preventDefault(), x(f);
          },
          className: `${g} ${f.gap ? "ml-1.5" : ""}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${f.regular ? "regular" : "solid"} ${f.icon} text-[12px]` })
        },
        f.cmd + f.icon
      );
      return f.cmd !== "link" ? j : /* @__PURE__ */ e.jsxs(ve, { modal: !0, open: o, onOpenChange: l, children: [
        /* @__PURE__ */ e.jsx(je, { asChild: !0, children: j }),
        /* @__PURE__ */ e.jsx(Ne, { container: Se(r.current), children: /* @__PURE__ */ e.jsxs(
          we,
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
                    value: n,
                    onChange: (w) => c(w.target.value),
                    onKeyDown: (w) => {
                      w.key === "Enter" && u();
                    },
                    className: "flex-1 min-w-0 h-[34px] px-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: u,
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
        onInput: (f) => a == null ? void 0 : a(f.currentTarget.innerHTML),
        className: "apya-rte-surface min-h-[150px] p-4 text-[13.5px] leading-[1.7] text-text-primary bg-surface-base focus:outline-none",
        dangerouslySetInnerHTML: { __html: i.current }
      }
    )
  ] });
}
function Ws({ taskId: t }) {
  const { documents: a, isLoading: s, createDocument: r, updateDocument: i, removeDocument: o, isSaving: l } = Us(t), [n, c] = h.useState(null), [d, b] = h.useState(""), [p, m] = h.useState(""), [u, x] = h.useState(!1), { data: g, isFetching: f } = _s(n);
  h.useEffect(() => {
    !g || g.id !== n || (b(g.title ?? ""), m(g.content ?? ""), x(!1));
  }, [g == null ? void 0 : g.id]);
  const j = async () => {
    var S, z, G;
    try {
      const A = await r("Yeni belge");
      A != null && A.id && c(A.id);
    } catch (A) {
      (G = (z = (S = window == null ? void 0 : window.abp) == null ? void 0 : S.notify) == null ? void 0 : z.error) == null || G.call(z, (A == null ? void 0 : A.message) || "Belge oluşturulamadı.");
    }
  }, w = async () => {
    var z, G, A, K, M, I, _, Q, O;
    const S = d.trim();
    if (!S) {
      (A = (G = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : G.error) == null || A.call(G, "Belge başlığı boş olamaz.");
      return;
    }
    try {
      await i({ id: n, title: S, content: p }), x(!1), (I = (M = (K = window == null ? void 0 : window.abp) == null ? void 0 : K.notify) == null ? void 0 : M.success) == null || I.call(M, "Belge kaydedildi.");
    } catch (Z) {
      (O = (Q = (_ = window == null ? void 0 : window.abp) == null ? void 0 : _.notify) == null ? void 0 : Q.error) == null || O.call(Q, (Z == null ? void 0 : Z.message) || "Belge kaydedilemedi.");
    }
  }, T = async (S, z) => {
    var G, A, K;
    try {
      await o(S), n === S && c(null);
    } catch (M) {
      (K = (A = (G = window == null ? void 0 : window.abp) == null ? void 0 : G.notify) == null ? void 0 : A.error) == null || K.call(A, (M == null ? void 0 : M.message) || `“${z}” silinemedi.`);
    }
  }, E = () => {
    u && !window.confirm("Kaydedilmemiş değişiklikleriniz var. Yine de kapatılsın mı?") || c(null);
  };
  return n ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: E,
          "aria-label": "Belge listesine dön",
          className: "flex items-center justify-center h-8 w-8 rounded-[9px] border border-subtle bg-surface-base text-text-tertiary hover:text-text-primary cursor-pointer",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-left text-[12px]" })
        }
      ),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: d,
          "aria-label": "Belge başlığı",
          onChange: (S) => {
            b(S.target.value), x(!0);
          },
          className: "flex-1 min-w-0 h-9 px-3 rounded-[10px] border border-subtle bg-surface-base text-[13.5px] font-bold text-text-primary focus:border-focus focus:shadow-focus focus:outline-none"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: w,
          disabled: l || !u,
          className: `flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[12.5px] font-bold ${l || !u ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l ? "fa-circle-notch fa-spin" : "fa-floppy-disk"} text-[11px]` }),
            l ? "Kaydediliyor…" : u ? "Kaydet" : "Kaydedildi"
          ]
        }
      )
    ] }),
    f && !g ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Belge yükleniyor…" }) : /* @__PURE__ */ e.jsx(
      ka,
      {
        value: p,
        onChange: (S) => {
          m(S), x(!0);
        }
      }
    )
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Belgeler" }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: j,
          className: "flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            "Yeni belge"
          ]
        }
      )
    ] }),
    s && a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !s && a.length === 0 && /* @__PURE__ */ e.jsx(
      me,
      {
        icon: "fa-file-lines",
        title: "Henüz belge yok",
        description: "Toplantı notu, teknik şartname ya da teslim tutanağı gibi metinleri buraya yazabilirsiniz."
      }
    ),
    a.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: a.map((S) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "group flex items-center gap-3 px-3.5 py-3 border-b border-subtle last:border-b-0 hover:bg-surface-raised",
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[14px]" }) }),
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => c(S.id),
              className: "flex-1 min-w-0 bg-transparent border-0 p-0 text-left cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[13px] font-bold text-text-primary", children: S.title }),
                /* @__PURE__ */ e.jsx("span", { className: "block text-[11.5px] text-text-tertiary", children: S.contentLength > 0 ? `${S.editorName} · ${gt(S.lastModificationTime ?? S.creationTime)}` : "Boş belge — açıp yazmaya başlayın" })
              ]
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              "aria-label": `${S.title} belgesini sil`,
              onClick: () => T(S.id, S.title),
              className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[12px]" })
            }
          )
        ]
      },
      S.id
    )) })
  ] });
}
const Zs = {
  0: "bg-neutral-400",
  1: "bg-text-tertiary",
  2: "bg-warning",
  3: "bg-primary",
  4: "bg-success"
};
function ot(t) {
  if (!t) return null;
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? null : a;
}
const Ke = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
function Js({ task: t = {} }) {
  const a = h.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((l, n) => ({
    id: l.id || `row-${n}`,
    name: l.title || "Başlıksız görev",
    isMain: !!l.__main,
    start: ot(l.startDate),
    end: ot(l.dueDate) || ot(l.completedDate),
    status: l.status ?? 1
  })), [t]), { min: s, span: r } = h.useMemo(() => {
    const o = a.flatMap((c) => [c.start, c.end]).filter(Boolean).map((c) => c.getTime());
    if (o.length === 0) return { min: null, span: 0 };
    const l = Math.min(...o), n = Math.max(...o);
    return { min: l, span: Math.max(1, n - l) };
  }, [a]), i = h.useMemo(() => s === null ? [] : [0, 1, 2, 3].map((o) => new Date(s + r * o / 4)), [s, r]);
  return s === null ? /* @__PURE__ */ e.jsx("div", { className: De, children: /* @__PURE__ */ e.jsx(
    me,
    {
      icon: "fa-bars-staggered",
      title: "Zaman çizelgesi çizilemiyor",
      description: "Görevde veya alt görevlerde başlangıç–bitiş tarihi tanımlı olmalı."
    }
  ) }) : /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Zaman çizelgesi" }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] text-text-tertiary", children: [
        Ke(new Date(s)),
        " – ",
        Ke(new Date(s + r))
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-4 gap-0 pl-[170px] mb-2 lt-860:pl-[110px]", children: i.map((o, l) => /* @__PURE__ */ e.jsx(
      "span",
      {
        className: "pl-2 border-l border-subtle text-[10.5px] font-bold uppercase tracking-[.06em] text-text-tertiary",
        children: Ke(o)
      },
      l
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: a.map((o) => {
      const l = o.start ? o.start.getTime() : s, n = o.end ? Math.max(o.end.getTime(), l) : l, c = (l - s) / r * 100, d = Math.max(2, (n - l) / r * 100), b = Math.max(1, Math.round((n - l) / 864e5));
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
            className: `absolute top-[7px] bottom-[7px] flex items-center px-2.5 rounded-[7px] shadow-xs ${Zs[o.status] || "bg-primary"}`,
            style: { left: `${c}%`, width: `${d}%` },
            title: `${Ke(o.start)} – ${Ke(o.end)}`,
            children: /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[10.5px] font-bold text-white", children: [
              b,
              "g"
            ] })
          }
        ) })
      ] }, o.id);
    }) })
  ] });
}
function Yt({ icon: t, iconTone: a, title: s, note: r, children: i }) {
  return /* @__PURE__ */ e.jsxs("div", { className: De, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[12px] ${a}` }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: s }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
    ] }),
    i
  ] });
}
function Xs({ task: t = {} }) {
  const a = ae(), s = t.predecessorIds || [], r = () => {
    var c, d, b;
    return (b = (d = (c = window == null ? void 0 : window.apya) == null ? void 0 : c.platform) == null ? void 0 : d.tasks) == null ? void 0 : b.task;
  }, { data: i = [], isLoading: o } = re({
    queryKey: ["task-predecessors", t.id, s],
    queryFn: async () => {
      const c = r();
      return c ? Promise.all(
        s.map(
          (d) => Promise.resolve(c.get(d)).catch(() => ({ id: d, title: "(erişilemeyen görev)", status: null, code: "—" }))
        )
      ) : [];
    },
    enabled: s.length > 0,
    staleTime: 3e4,
    retry: !1
  }), l = async (c) => {
    var d, b, p, m, u, x;
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
        predecessorIds: s.filter((g) => g !== c),
        tagNames: (t.tags ?? []).map((g) => g.name),
        estimatedHours: t.estimatedHours ?? null,
        taskType: t.taskType ?? null,
        sprint: t.sprint ?? null
      })), await a.invalidateQueries({ queryKey: ["task-detail", t.id] }), (p = (b = (d = window == null ? void 0 : window.abp) == null ? void 0 : d.notify) == null ? void 0 : b.info) == null || p.call(b, "Bağlantı kaldırıldı.");
    } catch (g) {
      (x = (u = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : u.error) == null || x.call(u, (g == null ? void 0 : g.message) || "Bağlantı kaldırılamadı.");
    }
  }, n = (c) => {
    var d, b, p;
    return (p = (b = (d = window == null ? void 0 : window.apya) == null ? void 0 : d.taskDetail) == null ? void 0 : b.open) == null ? void 0 : p.call(b, c);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsx(
      Yt,
      {
        icon: "fa-arrow-left-long",
        iconTone: "text-warning",
        title: "Öncül görevler",
        note: "bu görev başlamadan tamamlanmalı",
        children: s.length === 0 ? /* @__PURE__ */ e.jsx(me, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : o ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : i.map((c) => {
          const d = c.status == null ? null : pe(c.status);
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: c.code || "—" }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => n(c.id),
                    className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                    children: c.title || "Başlıksız görev"
                  }
                ),
                d && /* @__PURE__ */ e.jsx(ze, { bg: d.bg, fg: d.fg, children: d.label }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Bağlantıyı kaldır",
                    "aria-label": `${c.title} bağlantısını kaldır`,
                    onClick: () => l(c.id),
                    className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link-slash text-[10px]" })
                  }
                )
              ]
            },
            c.id
          );
        })
      }
    ),
    /* @__PURE__ */ e.jsx(
      Yt,
      {
        icon: "fa-arrow-right-long",
        iconTone: "text-primary",
        title: "Ardıl görevler",
        note: "bu görev bitince başlar",
        children: /* @__PURE__ */ e.jsx(
          me,
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
function Pe() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task) || null;
}
function er(t) {
  const a = ae(), s = ["task-timelogs", t], r = ["task-active-timelog"], i = re({
    queryKey: s,
    queryFn: () => {
      var d;
      return Promise.resolve((d = Pe()) == null ? void 0 : d.getTimeLogs(t));
    },
    enabled: !!t && !!Pe(),
    staleTime: 15e3,
    retry: !1
  }), o = re({
    queryKey: r,
    queryFn: () => {
      var d;
      return Promise.resolve((d = Pe()) == null ? void 0 : d.getActiveTimeLog());
    },
    enabled: !!Pe(),
    staleTime: 5e3,
    retry: !1
  }), l = () => {
    a.invalidateQueries({ queryKey: s }), a.invalidateQueries({ queryKey: r });
  }, n = se({
    mutationFn: () => {
      var d;
      return Promise.resolve((d = Pe()) == null ? void 0 : d.startTimeTracking(t));
    },
    onSuccess: l
  }), c = se({
    mutationFn: () => {
      var d;
      return Promise.resolve((d = Pe()) == null ? void 0 : d.stopTimeTracking(t));
    },
    onSuccess: l
  });
  return {
    logs: i.data ?? [],
    isLoading: i.isLoading,
    activeLog: o.data ?? null,
    start: n.mutateAsync,
    stop: c.mutateAsync,
    isMutating: n.isPending || c.isPending
  };
}
function Ut(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function tr({ taskId: t, task: a = {} }) {
  const s = er(t), r = s.activeLog && s.activeLog.taskId === t ? s.activeLog : null, [i, o] = h.useState(() => Date.now());
  h.useEffect(() => {
    if (!r) return;
    const x = setInterval(() => o(Date.now()), 1e3);
    return () => clearInterval(x);
  }, [r]);
  const l = r ? Math.max(0, Math.floor((i - new Date(r.startTime).getTime()) / 1e3)) : 0, c = s.logs.reduce((x, g) => x + (g.secondsSpent || 0), 0) + l, d = (a == null ? void 0 : a.estimatedHours) ?? null, b = d ? d * 3600 : 0, p = b ? Math.min(100, Math.round(c / b * 100)) : 0, m = b ? Math.max(0, b - c) : 0, u = async () => {
    var x, g, f;
    try {
      r ? await s.stop() : await s.start();
    } catch (j) {
      (f = (g = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : g.error) == null || f.call(g, (j == null ? void 0 : j.message) || "Zaman takibi güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-5 flex-wrap p-[22px] rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[18px]", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: u,
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
              children: hs(c)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary", children: r ? "Kayıt sürüyor" : "Sayaç duraklatıldı" })
        ] })
      ] }),
      b > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] font-bold text-text-secondary", children: "Tahmin kullanımı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
            rt(c),
            " / ",
            d,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-warning", style: { width: `${p}%` } }) }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "Kalan tahmini süre: ",
          rt(m)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: De, children: [
      /* @__PURE__ */ e.jsx(Xe, { title: "Zaman kayıtları" }),
      s.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : s.logs.length === 0 ? /* @__PURE__ */ e.jsx(
        me,
        {
          icon: "fa-stopwatch",
          title: "Henüz zaman kaydı yok",
          description: "Soldaki yeşil düğmeyle sayacı çalıştırın; durdurduğunuzda kayıt buraya düşer."
        }
      ) : s.logs.map((x) => {
        const g = !x.endTime;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
            children: [
              /* @__PURE__ */ e.jsx(at, { name: x.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: x.note || x.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                Ut(x.startTime),
                " → ",
                g ? "sürüyor" : Ut(x.endTime)
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary", children: g ? "Aktif" : rt(x.secondsSpent || 0) })
            ]
          },
          x.id
        );
      })
    ] })
  ] });
}
const Ye = [
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
    component: gs
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
    component: js
  },
  {
    // Alt görevlerin tablo/kanban görünümleri ve tarih takvimi — üçü de
    // görevin kendi `subTasks` koleksiyonundan beslenir, ek uç YOK.
    code: "subtask-table",
    title: "Tablo",
    icon: "fa-table",
    category: "gorev",
    isCore: !1,
    order: 6,
    permission: null,
    implemented: !0,
    component: Ks
  },
  {
    code: "subtask-board",
    title: "Kanban",
    icon: "fa-table-columns",
    category: "gorev",
    isCore: !1,
    order: 7,
    permission: null,
    implemented: !0,
    component: Ms
  },
  {
    code: "calendar",
    title: "Takvim",
    icon: "fa-calendar-days",
    category: "gorev",
    isCore: !1,
    order: 8,
    permission: null,
    implemented: !0,
    component: qs
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
    component: ws
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
    component: Js
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
    component: Xs
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
    component: As
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
    component: Es
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
    component: Ss,
    hidden: !0
    // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
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
    component: ks,
    hidden: !0
    // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
  },
  {
    // Ekip dışına açılan süreli linkler. permission dolu olduğu için "+" picker'da
    // yalnız yetkisi olana görünür; sekmenin kendisi de yetkiyi ayrıca kontrol eder
    // (izin sonradan alınmış bir görevde sekme atanmış kalabilir).
    code: "sharing",
    title: "Dış Paylaşım",
    icon: "fa-share-nodes",
    category: "iletisim",
    isCore: !1,
    order: 25,
    permission: "Platform.Tasks.ShareExternally",
    implemented: !0,
    component: Ts
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
    component: null,
    hidden: !0
    // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
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
    component: null,
    hidden: !0
    // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
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
    component: tr
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
    component: null,
    hidden: !0
    // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
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
    component: null,
    hidden: !0
    // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
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
    component: null,
    hidden: !0
    // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
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
    component: null,
    hidden: !0
    // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
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
    component: null,
    hidden: !0
    // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
  },
  {
    // Göreve bağlı zengin metin belgeleri (TaskDocument tablosu). Dosya
    // ekinden ayrıdır: ek yüklenen dosyayı, belge yazılan metni saklar.
    code: "documents",
    title: "Belge",
    icon: "fa-file-lines",
    category: "gorev",
    isCore: !1,
    order: 9,
    permission: null,
    implemented: !0,
    component: Ws
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
    component: zs
  }
];
function Da(t = []) {
  const a = new Set(t);
  return Ye.filter((s) => !s.hidden).filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function ar(t = []) {
  const a = new Set(t);
  return Ye.filter((s) => !s.hidden).filter((s) => !s.isCore).filter((s) => !s.permission || et(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let _e = null;
const Qe = /* @__PURE__ */ new Set(), ct = /* @__PURE__ */ new Set();
function _t() {
  Qe.forEach((t) => t());
}
function sr(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const ie = {
  open(t) {
    const a = sr(t);
    a && (_e = a, _t());
  },
  close() {
    _e = null, _t();
  },
  subscribe(t) {
    return Qe.add(t), () => Qe.delete(t);
  },
  getSnapshot() {
    return _e;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && ct.add(t);
  },
  emitResult() {
    ct.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    _e = null, Qe.clear(), ct.clear();
  }
}, Ot = "apya.taskDetail.fullscreen";
function Ca({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, i] = h.useState(t), [o, l] = h.useState([]), { data: n, isPending: c, isError: d, refetch: b } = vt(r), p = ua(), m = ba(n), u = ha(), x = ga(r), [g, f] = h.useState("general"), [j, w] = h.useState(!1), T = Ie.useRef(null), E = h.useMemo(
    () => Da(x.assignedCodes),
    [x.assignedCodes]
  ), S = h.useMemo(
    () => ar(x.assignedCodes),
    [x.assignedCodes]
  ), z = E.find((L) => L.code === g) ?? E[0];
  Ie.useEffect(() => {
    z.code !== g && f(z.code);
  }, [z, g]);
  const G = z == null ? void 0 : z.component, A = ae(), [K, M] = h.useState(
    () => {
      var L;
      return ((L = window.localStorage) == null ? void 0 : L.getItem(Ot)) === "1";
    }
  ), [I, _] = h.useState(!1), Q = h.useCallback(() => {
    ma(), s == null || s();
  }, [s]);
  fa(t, Q), Ie.useEffect(() => {
    m.isDirty ? p.markDirty() : p.markClean();
  });
  const O = h.useCallback(() => p.requestClose(Q), [p, Q]), Z = h.useCallback(() => {
    M((L) => {
      var U;
      const F = !L;
      return (U = window.localStorage) == null || U.setItem(Ot, F ? "1" : "0"), F;
    });
  }, []), V = et("Platform.Tasks.Delete"), [ee, N] = h.useState(!1), [v, y] = h.useState(!1), C = h.useCallback(async () => {
    var L, F, U, te, X, Ce;
    y(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (U = (F = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : F.info) == null || U.call(F, "Başarıyla silindi."), N(!1), p.markClean(), Q();
    } catch (xe) {
      (Ce = (X = (te = window == null ? void 0 : window.abp) == null ? void 0 : te.notify) == null ? void 0 : X.error) == null || Ce.call(X, (xe == null ? void 0 : xe.message) || "Görev silinemedi.");
    } finally {
      y(!1);
    }
  }, [r, p, Q]), P = h.useCallback(async () => {
    var L, F, U, te, X, Ce;
    if (!m.validate()) return !1;
    _(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, m.toUpdateDto())
      ), await A.invalidateQueries({ queryKey: ["task-detail", r] }), ie.emitResult(), (U = (F = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : F.success) == null || U.call(F, "Kaydedildi."), !0;
    } catch (xe) {
      return (Ce = (X = (te = window == null ? void 0 : window.abp) == null ? void 0 : te.notify) == null ? void 0 : X.error) == null || Ce.call(X, (xe == null ? void 0 : xe.message) || "Kaydedilemedi."), !1;
    } finally {
      _(!1);
    }
  }, [r, m, p, A]), W = h.useCallback(() => {
    P();
  }, [P]), ce = h.useCallback(async () => {
    const L = p.resolvePendingClose("save");
    await P() && (L == null || L());
  }, [p, P]), k = h.useCallback((L, F) => {
    p.requestClose(() => {
      l((U) => [...U, { id: r, title: (n == null ? void 0 : n.title) ?? "" }]), i(L), f("general"), p.markClean();
    });
  }, [p, r, n]), R = h.useCallback((L) => {
    p.requestClose(() => {
      l((F) => {
        const U = F.findIndex((te) => te.id === L);
        return U === -1 ? F : F.slice(0, U);
      }), i(L), f("general"), p.markClean();
    });
  }, [p]), B = h.useCallback(async (L) => {
    var F, U, te;
    try {
      await x.addFeature(L), f(L), w(!1);
    } catch (X) {
      (te = (U = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : U.error) == null || te.call(U, (X == null ? void 0 : X.message) || "Özellik eklenemedi.");
    }
  }, [x]), Y = h.useCallback(async (L) => {
    var F, U, te;
    try {
      await x.removeFeature(L), f((X) => X === L ? "general" : X);
    } catch (X) {
      (te = (U = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : U.error) == null || te.call(U, (X == null ? void 0 : X.message) || "Özellik kaldırılamadı.");
    }
  }, [x]);
  Ie.useEffect(() => {
    if (!j) return;
    const L = (U) => {
      T.current && !T.current.contains(U.target) && w(!1);
    }, F = (U) => {
      U.key === "Escape" && w(!1);
    };
    return document.addEventListener("mousedown", L), document.addEventListener("keydown", F), () => {
      document.removeEventListener("mousedown", L), document.removeEventListener("keydown", F);
    };
  }, [j]);
  const H = c ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(ye, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(ye, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(ye, { className: "h-24 w-full" })
  ] }) : d ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(ne, { variant: "ghost", onClick: () => b(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      os,
      {
        trail: o,
        current: { id: r, title: (n == null ? void 0 : n.title) ?? "" },
        onNavigate: R
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: T, children: [
      /* @__PURE__ */ e.jsx(
        ns,
        {
          tabs: E,
          activeCode: z.code,
          onSelect: (L) => {
            f(L), w(!1);
          },
          onOpenPicker: () => w((L) => !L),
          pickerOpen: j
        }
      ),
      j && /* @__PURE__ */ e.jsx(
        ls,
        {
          entries: S,
          busyCode: x.isMutating ? x.mutatingCode : null,
          onAdd: B,
          onRemove: Y
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${z.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          z.code === "general" ? /* @__PURE__ */ e.jsx(
            ts,
            {
              values: m.values,
              errors: m.errors,
              onFieldChange: m.setField,
              assigneeOptions: u.options,
              isLoadingAssignees: u.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(h.Suspense, { fallback: /* @__PURE__ */ e.jsx(ye, { className: "h-24 w-full" }), children: G && /* @__PURE__ */ e.jsx(
            G,
            {
              taskId: r,
              task: n,
              onOpenSubtask: k
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            as,
            {
              task: n,
              creatorName: u.nameById.get(n.creatorId),
              lastModifierName: u.nameById.get(n.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), le = a === "page" ? Ha : Va;
  return /* @__PURE__ */ e.jsxs(
    le,
    {
      open: !0,
      fullscreen: K,
      onRequestClose: O,
      title: n ? `Görev Detayı: ${n.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        Wa,
        {
          task: n ?? { title: "Yükleniyor…" },
          canDelete: V,
          fullscreen: K,
          onToggleFullscreen: Z,
          onClose: O,
          onDelete: () => N(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        Ja,
        {
          lastSavedAt: n == null ? void 0 : n.lastModificationTime,
          isDirty: p.isDirty,
          isSaving: I,
          onCancel: O,
          onSave: W
        }
      ),
      children: [
        H,
        p.pendingClose && /* @__PURE__ */ e.jsx(
          nr,
          {
            isSaving: I,
            onStay: () => p.resolvePendingClose("stay"),
            onDiscard: () => p.resolvePendingClose("discard"),
            onSaveAndClose: ce
          }
        ),
        ee && /* @__PURE__ */ e.jsx(
          rr,
          {
            taskTitle: (n == null ? void 0 : n.title) ?? "",
            busy: v,
            onCancel: () => N(!1),
            onConfirm: C
          }
        )
      ]
    }
  );
}
function rr({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [i, o] = h.useState(""), l = i.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    Ta,
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
        /* @__PURE__ */ e.jsx(ne, { variant: "secondary", onClick: s, disabled: a, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          ne,
          {
            variant: "destructive",
            onClick: r,
            disabled: !l,
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
            value: i,
            onChange: (n) => o(n.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function Ta({ label: t, title: a, description: s, children: r, actions: i }) {
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
        /* @__PURE__ */ e.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: i })
      ] })
    }
  );
}
function nr({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    Ta,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(ne, { variant: "secondary", onClick: a, disabled: t, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ e.jsx(ne, { variant: "destructive", onClick: s, disabled: t, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ e.jsx(ne, { variant: "primary", onClick: r, isLoading: t, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
const ir = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function lr({ isPrivate: t = !1, onChange: a = () => {
} }) {
  const s = !!t, [r, i] = h.useState(null);
  return /* @__PURE__ */ e.jsxs(ve, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(je, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
      "button",
      {
        ref: i,
        type: "button",
        className: "flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-default transition-all shadow-sm",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${s ? "fa-lock" : "fa-globe"} text-[11px] text-text-tertiary` }),
          /* @__PURE__ */ e.jsx("span", { children: s ? "Özel görev" : "Herkese açık" }),
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[10px] ml-0.5 text-text-tertiary" })
        ]
      }
    ) }),
    /* @__PURE__ */ e.jsx(Ne, { container: Se(r), children: /* @__PURE__ */ e.jsxs(
      we,
      {
        sideOffset: 8,
        align: "end",
        className: "z-50 w-[360px] rounded-2xl border border-subtle bg-surface-base p-4 shadow-float animate-in fade-in-50 zoom-in-95",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle pb-3 mb-3", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shield-halved text-primary text-base" }),
            /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary", children: "Görünürlük" })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: ir.map((o) => {
            const l = s === o.value;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => a(o.value),
                className: `flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${l ? "border-primary bg-primary-subtle/40" : "border-subtle hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${o.icon} text-base mt-0.5 ${l ? "text-primary" : "text-text-tertiary"}` }),
                  /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ e.jsx("h4", { className: "text-[13px] font-semibold text-text-primary", children: o.title }),
                      l && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ] }),
                    /* @__PURE__ */ e.jsx("p", { className: "text-[12px] text-text-tertiary mt-0.5", children: o.desc })
                  ] })
                ]
              },
              String(o.value)
            );
          }) }),
          /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-text-tertiary mt-3", children: "Değişiklik “Kaydet” ile uygulanır." }),
          /* @__PURE__ */ e.jsx(Ga, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const Vt = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto", or = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", cr = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" },
  { what: "Bağlantı kopyala", key: "⌘ L" }
];
function dr({ children: t }) {
  return /* @__PURE__ */ e.jsx(da, { asChild: !0, children: t });
}
function xr({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "inline-flex items-center h-[19px] px-1.5 rounded-[5px] border border-default border-b-2 bg-neutral-subtle font-mono text-[10px] font-semibold text-text-secondary", children: t });
}
function ur({
  task: t = {},
  presentation: a = "modal",
  onClose: s,
  isFullscreen: r,
  onToggleFullscreen: i,
  onFieldChange: o = () => {
  },
  statusValue: l,
  titleValue: n,
  isPrivateValue: c,
  isFavorite: d,
  onToggleFavorite: b,
  isWatched: p,
  onToggleWatch: m,
  onDuplicate: u,
  onArchive: x,
  onDelete: g,
  onOpenTransfer: f,
  onSaveAsTemplate: j,
  onConvertToSubtask: w,
  onExportPdf: T
}) {
  const [E, S] = h.useState(!1), [z, G] = h.useState(null), [A, K] = h.useState(!1), M = h.useRef(null), I = Se(z), _ = pe(l ?? t.status), Q = t.code || "GRV-—", O = () => {
    var N;
    (N = navigator.clipboard) == null || N.writeText(Q), S(!0), setTimeout(() => S(!1), 1800);
  }, Z = () => {
    var N, v, y, C;
    (N = navigator.clipboard) == null || N.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), (C = (y = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : y.success) == null || C.call(y, "Görev bağlantısı panoya kopyalandı.");
  }, V = (N) => () => {
    K(!1), N == null || N();
  }, ee = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", kbd: "⌘L", onClick: V(Z) },
    { label: "Çoğalt", icon: "fa-copy", kbd: "⌘D", onClick: V(u) },
    { label: "Başka projeye kopyala", icon: "fa-clone", onClick: V(() => f == null ? void 0 : f("copy")) },
    { label: "Şablon olarak kaydet", icon: "fa-bookmark", onClick: V(j) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, onClick: V(() => f == null ? void 0 : f("move")) },
    { label: "Alt göreve dönüştür", icon: "fa-diagram-project", onClick: V(w) },
    { label: p ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: V(m) },
    { label: "Arşivle", icon: "fa-box-archive", separator: !0, onClick: V(x) },
    { label: "Yazdır", icon: "fa-print", kbd: "⌘P", onClick: V(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: V(T) },
    { label: "Sil", icon: "fa-trash-can", kbd: "⌫", separator: !0, danger: !0, onClick: V(g) }
  ];
  return /* @__PURE__ */ e.jsxs("header", { ref: G, className: "shrink-0 px-6 lt-860:px-4 pt-[18px] pb-4 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: O,
            title: "Kodu kopyala",
            className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[11px] font-bold tracking-[.04em] cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[9px] opacity-70" }),
              /* @__PURE__ */ e.jsx("span", { children: Q }),
              /* @__PURE__ */ e.jsx("i", { className: `${E ? "fa-solid fa-check" : "fa-regular fa-copy"} text-[9px] opacity-60` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(ve, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(je, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] border border-default text-[12px] font-semibold cursor-pointer ${_.bg} ${_.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-current animate-pulse" }),
                /* @__PURE__ */ e.jsx("span", { children: _.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(Ne, { container: I, children: /* @__PURE__ */ e.jsxs(we, { sideOffset: 6, align: "start", className: `${Vt} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            Je.map((N) => {
              const v = Ze[N], y = (l ?? t.status) === N;
              return /* @__PURE__ */ e.jsx(dr, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => o("status", N),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${y ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${v.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: v.label }),
                    y && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, N);
            })
          ] }) })
        ] }),
        p && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 h-[26px] px-2.5 rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11.5px] font-semibold", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-eye text-[10px]" }),
          "Takip ediliyor"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
        /* @__PURE__ */ e.jsx("div", { className: "lt-860:hidden", children: /* @__PURE__ */ e.jsx(
          lr,
          {
            isPrivate: c ?? !!t.isPrivate,
            onChange: (N) => o("isPrivate", N)
          }
        ) }),
        /* @__PURE__ */ e.jsx("div", { className: "h-5 w-px bg-border-default mx-1" }),
        a === "modal" && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: i,
            title: r ? "Küçült" : "Tam ekran",
            className: `mobile:hidden flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${r ? "bg-primary-subtle text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r ? "fa-compress" : "fa-expand"} text-[12px]` })
          }
        ),
        /* @__PURE__ */ e.jsxs(ve, { modal: !0, open: A, onOpenChange: K, children: [
          /* @__PURE__ */ e.jsx(je, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer seçenekler",
              className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${A ? "bg-surface-hover text-text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(Ne, { container: I, children: /* @__PURE__ */ e.jsxs(
            we,
            {
              sideOffset: 6,
              align: "end",
              collisionBoundary: I ?? [],
              collisionPadding: 12,
              className: `${Vt} w-[244px]`,
              children: [
                ee.map((N) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: N.onClick,
                    className: [
                      or,
                      N.danger ? "text-negative" : "text-text-secondary",
                      N.separator ? "border-t border-subtle mt-[5px]" : ""
                    ].join(" "),
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${N.icon} text-[11px] w-[14px] opacity-75` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: N.label }),
                      N.kbd && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: N.kbd })
                    ]
                  },
                  N.label
                )),
                /* @__PURE__ */ e.jsxs("div", { className: "mt-1.5 pt-[9px] px-[9px] pb-[7px] border-t border-subtle", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 mb-[7px]", children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-keyboard text-[11px] text-text-tertiary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-[.09em] text-text-tertiary", children: "Kısayollar" })
                  ] }),
                  cr.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: N.what }),
                    /* @__PURE__ */ e.jsx(xr, { children: N.key })
                  ] }, N.what))
                ] })
              ]
            }
          ) })
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
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 min-w-0 mt-[9px]", children: [
      /* @__PURE__ */ e.jsx(
        "div",
        {
          ref: M,
          contentEditable: !0,
          suppressContentEditableWarning: !0,
          spellCheck: !1,
          onBlur: (N) => o("title", N.currentTarget.textContent.trim()),
          className: "flex-1 min-w-0 text-[24px] lt-560:text-[20px] font-extrabold tracking-[-.025em] leading-[1.2] text-text-primary px-2 -ml-2 py-[3px] rounded-[9px] border border-transparent cursor-text hover:bg-neutral-subtle hover:border-subtle focus:bg-neutral-subtle focus:border-focus focus:shadow-focus focus:outline-none",
          children: n ?? t.title ?? "Başlıksız görev"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: b,
          title: d ? "Favorilerden çıkar" : "Favorilere ekle",
          className: `flex items-center justify-center h-8 w-8 shrink-0 rounded-[9px] cursor-pointer ${d ? "bg-warning-subtle text-warning" : "text-text-tertiary hover:bg-surface-hover"}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${d ? "solid" : "regular"} fa-star text-[15px]` })
        }
      )
    ] })
  ] });
}
const Oe = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", Ht = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function he({ children: t }) {
  return /* @__PURE__ */ e.jsx(da, { asChild: !0, children: t });
}
function ue({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[7px] min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.08em] text-text-tertiary select-none", children: t }),
    a
  ] });
}
function Qt({ name: t, size: a = 26 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: qe(t), fontSize: a * 0.38 },
      children: Ge(t)
    }
  );
}
function Wt(t) {
  if (t == null) return "—";
  const a = Math.max(0, Math.round(Number(t) * 60)), s = Math.floor(a / 60), r = a % 60;
  return s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function pr({
  task: t = {},
  assigneeOptions: a = [],
  projectOptions: s = [],
  onFieldChange: r = () => {
  },
  statusValue: i,
  priorityValue: o,
  assigneeValue: l,
  projectValue: n,
  dueDateValue: c,
  startDateValue: d,
  tagsValue: b = [],
  progressPercent: p = 0,
  progressNote: m = "",
  onOpenTransfer: u
}) {
  var N, v;
  const [x, g] = h.useState(""), [f, j] = h.useState(""), [w, T] = h.useState(""), [E, S] = h.useState(!1), [z, G] = h.useState(null), A = pe(i ?? t.status), K = tt(o ?? t.priority), M = l ?? t.assigneeId ?? null, I = n ?? t.projectId ?? null, _ = ((N = a.find((y) => y.value === M)) == null ? void 0 : N.label) || t.assigneeName || "Atanmamış", Q = ((v = s.find((y) => y.value === I)) == null ? void 0 : v.label) || t.projectName || "Projesiz", O = ya(c ?? t.dueDate), Z = a.filter(
    (y) => !x || y.label.toLowerCase().includes(x.toLowerCase())
  ), V = s.filter(
    (y) => !f || y.label.toLowerCase().includes(f.toLowerCase())
  ), ee = () => {
    const y = w.trim();
    y && !b.includes(y) && r("tagNames", [...b, y]), T(""), S(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { ref: G, className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6", children: [
    /* @__PURE__ */ e.jsx(ue, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(ve, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(je, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx(Qt, { name: M ? _ : null }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: _ }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(Ne, { container: Se(z), children: /* @__PURE__ */ e.jsxs(we, { sideOffset: 6, align: "start", className: `${Oe} w-[264px]`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: x,
              onChange: (y) => g(y.target.value),
              placeholder: "Kişi ara…",
              className: Ht
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[230px] overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ e.jsx(he, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("assigneeId", null),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] text-left cursor-pointer ${M ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary font-semibold"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex h-6 w-6 items-center justify-center rounded-full bg-neutral-subtle text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-user-slash text-[9px]" }) }),
                /* @__PURE__ */ e.jsx("span", { children: "Atanmamış" })
              ]
            }
          ) }),
          a.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-2 py-1.5 text-[12px] text-text-tertiary", children: "Kullanıcı listesi yükleniyor…" }),
          Z.map((y) => /* @__PURE__ */ e.jsx(he, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("assigneeId", y.value),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${M === y.value ? "bg-primary-subtle" : "hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx(Qt, { name: y.label, size: 24 }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: y.label }),
                M === y.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
              ]
            }
          ) }, y.value))
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ e.jsxs(ue, { label: "Son tarih", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
        /* @__PURE__ */ e.jsx("i", { className: `fa-regular fa-calendar text-[13px] ${O.tone}` }),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "date",
            value: (c ?? t.dueDate ?? "").slice(0, 10),
            onChange: (y) => r("dueDate", y.target.value),
            className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
          }
        )
      ] }),
      O.hint && /* @__PURE__ */ e.jsx("span", { className: `-mt-0.5 text-[10.5px] font-semibold ${O.tone}`, children: O.hint })
    ] }),
    /* @__PURE__ */ e.jsx(ue, { label: "Başlangıç", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[13px] text-text-tertiary" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          value: (d ?? t.startDate ?? "").slice(0, 10),
          onChange: (y) => r("startDate", y.target.value),
          className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 pt-[5px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: [
          "%",
          p
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-medium text-text-tertiary", children: m })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "h-1.5 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "h-full rounded-full bg-primary transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
          style: { width: `${p}%` }
        }
      ) })
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(ve, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(je, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${A.bg} ${A.fg}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${A.icon} text-[11px]` }),
            /* @__PURE__ */ e.jsx("span", { children: A.label }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(Ne, { container: Se(z), children: /* @__PURE__ */ e.jsxs(we, { sideOffset: 6, align: "start", className: `${Oe} w-[196px]`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
        Je.map((y) => {
          const C = Ze[y], P = (i ?? t.status) === y;
          return /* @__PURE__ */ e.jsx(he, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("status", y),
              className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${P ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${C.dot}` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: C.label }),
                P && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
              ]
            }
          ) }, y);
        })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(ve, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(je, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${K.bg} ${K.fg}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${K.icon} text-[11px]` }),
            /* @__PURE__ */ e.jsx("span", { children: K.label }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(Ne, { container: Se(z), children: /* @__PURE__ */ e.jsxs(we, { sideOffset: 6, align: "start", className: `${Oe} w-[184px]`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
        fs.map((y) => {
          const C = ht[y], P = (o ?? t.priority) === y;
          return /* @__PURE__ */ e.jsx(he, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("priority", y),
              className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${P ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${C.icon} text-[11px] w-[13px]` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: C.label }),
                P && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
              ]
            }
          ) }, y);
        })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap min-h-8", children: [
      b.map((y) => /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "inline-flex items-center gap-1.5 h-6 px-2 rounded-[7px] border border-primary bg-primary-subtle text-primary text-[11.5px] font-bold",
          children: [
            /* @__PURE__ */ e.jsx("span", { children: y }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Etiketi kaldır",
                onClick: () => r("tagNames", b.filter((C) => C !== y)),
                className: "flex items-center p-0 border-0 bg-transparent text-current opacity-55 hover:opacity-100 hover:text-negative cursor-pointer",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
              }
            )
          ]
        },
        y
      )),
      E ? /* @__PURE__ */ e.jsx(
        "input",
        {
          autoFocus: !0,
          type: "text",
          value: w,
          onChange: (y) => T(y.target.value),
          onBlur: ee,
          onKeyDown: (y) => {
            y.key === "Enter" && ee(), y.key === "Escape" && (T(""), S(!1));
          },
          placeholder: "Etiket…",
          className: "h-6 w-24 px-2 rounded-[7px] border border-focus bg-surface-base text-text-primary text-[11.5px] shadow-focus focus:outline-none"
        }
      ) : /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          "aria-label": "Yeni etiket ekle",
          onClick: () => S(!0),
          className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-dashed border-strong bg-transparent text-text-tertiary text-[11.5px] font-semibold hover:border-focus hover:text-primary hover:bg-primary-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[9px]" }),
            "Etiket"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Proje", children: /* @__PURE__ */ e.jsxs(ve, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(je, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
      /* @__PURE__ */ e.jsx(Ne, { container: Se(z), children: /* @__PURE__ */ e.jsxs(we, { sideOffset: 6, align: "start", className: `${Oe} w-[250px]`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: f,
              onChange: (y) => j(y.target.value),
              placeholder: "Proje ara…",
              className: Ht
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[210px] overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ e.jsx(he, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("projectId", null),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${I ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-neutral-400" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Projesiz" })
              ]
            }
          ) }),
          V.map((y) => /* @__PURE__ */ e.jsx(he, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("projectId", y.value),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${I === y.value ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-primary" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: y.label }),
                I === y.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
              ]
            }
          ) }, y.value))
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-[7px] pt-[7px] border-t border-subtle", children: [
          /* @__PURE__ */ e.jsx(he, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => u == null ? void 0 : u("move"),
              className: "flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left text-text-secondary hover:bg-surface-hover hover:text-primary cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[11px] w-[14px] opacity-70" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Başka projeye taşı…" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(he, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => u == null ? void 0 : u("copy"),
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
    /* @__PURE__ */ e.jsx(ue, { label: "Harcanan / tahmin", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[9px] h-8", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock text-[13px] text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[13px] font-bold text-text-primary", children: Wt(t.spentHours ?? 0) }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[12px] text-text-tertiary", children: [
        "/ ",
        t.estimatedHours != null ? Wt(t.estimatedHours) : "—"
      ] })
    ] }) })
  ] }) });
}
function mr({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: i,
  onDragEnd: o,
  onReorderTo: l,
  onReorderDrop: n,
  onOpenPicker: c,
  counts: d = {},
  isDirty: b = !1
}) {
  const [p, m] = h.useState(!1);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-6 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 py-2.5 flex-1 min-w-0 overflow-x-auto custom-scrollbar", children: [
      s.map((u) => {
        const x = t === u.code, g = d[u.code] || 0;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            draggable: !0,
            title: "Sürükleyerek sırayı değiştirin",
            ...xa(() => a(u.code)),
            onDragStart: (f) => {
              i(u.code);
              try {
                f.dataTransfer.effectAllowed = "move", f.dataTransfer.setData("text/plain", u.code);
              } catch {
              }
            },
            onDragOver: (f) => {
              f.preventDefault(), l(u.code);
            },
            onDrop: (f) => {
              f.preventDefault(), n == null || n();
            },
            onDragEnd: o,
            className: [
              "flex shrink-0 items-center gap-2 h-[34px] px-[13px] rounded-[10px]",
              "text-[12.5px] whitespace-nowrap cursor-grab active:cursor-grabbing",
              "transition-opacity duration-fast",
              x ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
              r === u.code ? "opacity-35" : "opacity-100"
            ].join(" "),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-[11px] opacity-85` }),
              /* @__PURE__ */ e.jsx("span", { children: u.title }),
              g > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                "rounded-full text-[10px] font-extrabold",
                x ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
              ].join(" "), children: g })
            ]
          },
          u.code
        );
      }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          title: "Özellik ekle",
          onClick: () => {
            m(!1), c();
          },
          onMouseEnter: () => m(!0),
          onMouseLeave: () => m(!1),
          className: [
            "flex shrink-0 items-center gap-[7px] h-[34px] ml-1 rounded-[10px]",
            "border border-dashed border-primary bg-primary-subtle text-primary",
            "text-[12.5px] font-bold whitespace-nowrap cursor-pointer",
            "hover:border-solid",
            "transition-[padding] duration-[160ms] ease-[cubic-bezier(.16,1,.3,1)]",
            p ? "px-[13px]" : "px-[11px]"
          ].join(" "),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            p && /* @__PURE__ */ e.jsx("span", { className: "animate-fade-in-fast", children: "Özellik ekle" })
          ]
        }
      )
    ] }),
    b && /* @__PURE__ */ e.jsxs("span", { className: "flex shrink-0 items-center gap-[7px] h-[26px] px-2.5 rounded-full bg-warning-subtle text-warning text-[11px] font-bold", children: [
      /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-warning animate-pulse" }),
      "Taslak"
    ] })
  ] });
}
function fr({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: i,
  onDragEnd: o,
  onReorderTo: l,
  onReorderDrop: n,
  onOpenPicker: c,
  counts: d = {}
}) {
  return /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Görev özellikleri",
      className: "flex lt-860:hidden flex-col gap-[3px] w-[238px] shrink-0 py-4 px-3 border-r border-subtle bg-surface-base overflow-y-auto custom-scrollbar",
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "px-2.5 pt-1 pb-2 text-[10px] font-extrabold uppercase tracking-[.1em] text-text-tertiary", children: "Özellikler" }),
        s.map((b) => {
          const p = t === b.code, m = d[b.code] || 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              draggable: !0,
              title: "Sürükleyerek sırayı değiştirin",
              ...xa(() => a(b.code)),
              onDragStart: (u) => {
                i(b.code);
                try {
                  u.dataTransfer.effectAllowed = "move", u.dataTransfer.setData("text/plain", b.code);
                } catch {
                }
              },
              onDragOver: (u) => {
                u.preventDefault(), l(b.code);
              },
              onDrop: (u) => {
                u.preventDefault(), n == null || n();
              },
              onDragEnd: o,
              className: [
                "flex shrink-0 items-center gap-[11px] h-9 px-[11px] rounded-[9px]",
                "text-[12.5px] text-left cursor-grab active:cursor-grabbing",
                "transition-opacity duration-fast",
                p ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
                r === b.code ? "opacity-35" : "opacity-100"
              ].join(" "),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${b.icon} text-[12px] w-[15px] opacity-85` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: b.title }),
                m > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                  "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                  "rounded-full text-[10px] font-extrabold",
                  p ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
                ].join(" "), children: m })
              ]
            },
            b.code
          );
        }),
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: c,
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
function Ae({ label: t, value: a, avatarName: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 py-[9px] border-t border-subtle", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-tertiary shrink-0", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
      s && /* @__PURE__ */ e.jsx(
        "span",
        {
          className: "flex shrink-0 items-center justify-center h-[21px] w-[21px] rounded-full text-[color:var(--apya-avatar-fg)] text-[8.5px] font-bold",
          style: { background: qe(s) },
          children: Ge(s)
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", title: typeof a == "string" ? a : void 0, children: a || "—" })
    ] })
  ] });
}
const Zt = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "—";
function br({ task: t = {}, nameById: a }) {
  const s = (o, l) => {
    var n;
    return o || l && ((n = a == null ? void 0 : a.get) == null ? void 0 : n.call(a, l)) || null;
  }, r = s(t.creatorName, t.creatorId), i = t.lastModificationTime ? s(t.lastModifierName, t.lastModifierId) : null;
  return /* @__PURE__ */ e.jsx("aside", { className: "flex flex-col gap-3.5 min-w-0", children: /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Oluşturan", value: r || "Bilinmiyor", avatarName: r }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Oluşturma tarihi", value: Zt(t.creationTime) }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Güncelleyen", value: i || "—", avatarName: i }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Son güncelleme", value: Zt(t.lastModificationTime) }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Görev tipi", value: t.taskType }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Sprint", value: t.sprint })
  ] }) });
}
const Jt = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
function dt({ name: t, size: a = 32 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: qe(t), fontSize: a * 0.34 },
      children: Ge(t)
    }
  );
}
function Xt({ open: t, onClick: a }) {
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
const ea = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function hr({
  task: t = {},
  onFieldChange: a = () => {
  },
  descriptionValue: s,
  checklist: r,
  currentUserName: i = "Ben"
}) {
  const o = t == null ? void 0 : t.id, l = ae(), [n, c] = h.useState(!0), [d, b] = h.useState(""), p = (r == null ? void 0 : r.items) ?? [], m = p.filter((v) => v.isDone).length, u = p.length ? Math.round(m / p.length * 100) : 0, x = async () => {
    var y, C, P;
    const v = d.trim();
    if (!(!v || !o)) {
      b("");
      try {
        await r.addItem(v);
      } catch (W) {
        (P = (C = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : C.error) == null || P.call(C, (W == null ? void 0 : W.message) || "Madde eklenemedi.");
      }
    }
  }, [g, f] = h.useState(!0), [j, w] = h.useState(""), [T, E] = h.useState(!1), [S, z] = h.useState(!1), [G, A] = h.useState(null), [K, M] = h.useState(""), [I, _] = h.useState({}), { data: Q = [] } = re({
    queryKey: ["task-comments", o],
    queryFn: () => {
      var v, y, C, P;
      return Promise.resolve((P = (C = (y = (v = window == null ? void 0 : window.apya) == null ? void 0 : v.platform) == null ? void 0 : y.tasks) == null ? void 0 : C.task) == null ? void 0 : P.getComments(o));
    },
    enabled: !!o,
    staleTime: 1e4
  }), O = async () => {
    await l.invalidateQueries({ queryKey: ["task-comments", o] }), await l.invalidateQueries({ queryKey: ["task-detail", o] });
  }, Z = async () => {
    var y, C, P;
    const v = j.trim();
    if (!(!v || !o || S)) {
      z(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.addComment(o, v)), await O(), w("");
      } catch (W) {
        (P = (C = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : C.error) == null || P.call(C, (W == null ? void 0 : W.message) || "Yorum gönderilemedi.");
      } finally {
        z(!1);
      }
    }
  }, V = async (v) => {
    var C, P, W;
    const y = K.trim();
    if (!(!y || !o))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.replyToComment(v, y)), await O(), M(""), A(null);
      } catch (ce) {
        (W = (P = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : P.error) == null || W.call(P, (ce == null ? void 0 : ce.message) || "Yanıt gönderilemedi.");
      }
  }, ee = (v) => _((y) => {
    const C = y[v] ?? { liked: !1, count: 0 };
    return { ...y, [v]: { liked: !C.liked, count: C.count + (C.liked ? -1 : 1) } };
  }), N = !!j.trim() && !S;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-[9px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Açıklama" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Zengin metin · WYSIWYG" })
      ] }),
      /* @__PURE__ */ e.jsx(
        ka,
        {
          value: s ?? t.description ?? "",
          onChange: (v) => a("description", v),
          mentionName: i
        },
        o
      )
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: Jt, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
            m,
            "/",
            p.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(Xt, { open: n, onClick: () => c((v) => !v) })
      ] }),
      n && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 mt-3.5", children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
            style: { width: `${u}%` }
          }
        ) }),
        p.map((v) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              "aria-label": v.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
              onClick: () => r.toggleItem(v.id).catch((y) => {
                var C, P, W;
                return (W = (P = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : P.error) == null ? void 0 : W.call(P, (y == null ? void 0 : y.message) || "Durum güncellenemedi.");
              }),
              className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white cursor-pointer transition-colors duration-fast ${v.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
              children: v.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${v.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: v.text }),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              onClick: () => r.removeItem(v.id).catch((y) => {
                var C, P, W;
                return (W = (P = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : P.error) == null ? void 0 : W.call(P, (y == null ? void 0 : y.message) || "Madde silinemedi.");
              }),
              className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
            }
          )
        ] }, v.id)),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            value: d,
            onChange: (v) => b(v.target.value),
            onKeyDown: (v) => {
              v.key === "Enter" && x();
            },
            placeholder: "Yeni madde yaz ve Enter'a bas…",
            className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: Jt, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Yorumlar & güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: Q.length })
        ] }),
        /* @__PURE__ */ e.jsx(Xt, { open: g, onClick: () => f((v) => !v) })
      ] }),
      g && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(dt, { name: i }),
          /* @__PURE__ */ e.jsxs("div", { className: `flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${T ? "border-focus bg-surface-base shadow-focus" : "border-default bg-surface-raised"}`, children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                rows: 2,
                value: j,
                onChange: (v) => w(v.target.value),
                onFocus: () => E(!0),
                onBlur: () => E(!1),
                onKeyDown: (v) => {
                  v.key === "Enter" && (v.ctrlKey || v.metaKey) && (v.preventDefault(), Z());
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
              ].map((v) => /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  title: v.title,
                  onMouseDown: (y) => y.preventDefault(),
                  onClick: () => w((y) => y + v.add),
                  className: "flex items-center justify-center h-7 w-7 rounded-[7px] text-text-tertiary hover:bg-surface-hover hover:text-primary cursor-pointer",
                  children: /* @__PURE__ */ e.jsx("i", { className: `${v.icon} text-[12px]` })
                },
                v.title
              )) }),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: Z,
                  disabled: !N,
                  className: `flex items-center gap-[7px] h-[30px] px-3.5 rounded-[9px] text-[12px] font-bold shadow-xs ${N ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${S ? "fa-circle-notch fa-spin" : "fa-paper-plane"} text-[10px]` }),
                    "Gönder"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1", children: Q.map((v) => {
          const y = I[v.id] ?? { liked: !1, count: 0 };
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start py-3 border-t border-subtle", children: [
            /* @__PURE__ */ e.jsx(dt, { name: v.authorName }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: v.authorName }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: ea(v.creationTime) })
              ] }),
              /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[13px] leading-[1.65] text-text-secondary whitespace-pre-wrap", children: v.text }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 mt-[3px]", children: [
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => ee(v.id),
                    className: `flex items-center gap-1.5 h-[26px] px-[9px] rounded-full border text-[11px] font-semibold cursor-pointer ${y.liked ? "border-primary bg-primary-subtle text-primary" : "border-default bg-transparent text-text-tertiary hover:border-focus"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-thumbs-up text-[10px]" }),
                      y.count
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      A((C) => C === v.id ? null : v.id), M("");
                    },
                    className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-full text-text-tertiary text-[11px] font-semibold hover:bg-surface-hover hover:text-primary cursor-pointer",
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                      "Yanıtla"
                    ]
                  }
                )
              ] }),
              G === v.id && /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 mt-2 animate-fade-in-fast", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: K,
                    onChange: (C) => M(C.target.value),
                    onKeyDown: (C) => {
                      C.key === "Enter" && V(v.id);
                    },
                    placeholder: `@${v.authorName} kullanıcısına yanıt ver…`,
                    className: "flex-1 h-8 px-3 rounded-[9px] border border-focus bg-surface-base text-text-primary text-[12px] shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => V(v.id),
                    className: "h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover",
                    children: "Yanıtla"
                  }
                )
              ] }),
              (v.replies ?? []).map((C) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] mt-2.5 pl-3 border-l-2 border-default", children: [
                /* @__PURE__ */ e.jsx(dt, { name: C.authorName, size: 24 }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: C.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: ea(C.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-[3px] mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: C.text })
                ] })
              ] }, C.id))
            ] })
          ] }, v.id);
        }) })
      ] })
    ] })
  ] });
}
function gr({
  lastSavedAt: t,
  isDirty: a,
  isSaving: s,
  justSaved: r,
  onCancel: i,
  onSave: o
}) {
  const l = t ? new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(t)) : "—", n = s ? "fa-solid fa-circle-notch fa-spin" : r ? "fa-solid fa-check" : "fa-regular fa-floppy-disk", c = s ? "Kaydediliyor…" : r ? "Kaydedildi" : "Kaydet", d = a && !s;
  return /* @__PURE__ */ e.jsxs("footer", { className: "shrink-0 flex items-center justify-between gap-4 px-6 lt-860:px-4 py-3.5 border-t border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5 min-w-0 lt-560:hidden", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] text-[11.5px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock text-[11px]" }),
        "Son kayıt: ",
        /* @__PURE__ */ e.jsx("strong", { className: "font-semibold text-text-secondary", children: l })
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
          onClick: i,
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
            /* @__PURE__ */ e.jsx("i", { className: `${n} text-[11px]` }),
            c
          ]
        }
      )
    ] })
  ] });
}
const Sa = Object.fromEntries(Ye.map((t) => [t.code, t])), yr = {
  "subtask-table": { desc: "Alt görevlerin sıralanabilir tablosu", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  "subtask-board": { desc: "Alt görevleri duruma göre sütunlarda taşı", bg: "bg-primary-subtle", fg: "text-primary" },
  calendar: { desc: "Görev ve alt görev tarihleri aylık ızgarada", bg: "bg-primary-subtle", fg: "text-primary" },
  documents: { desc: "Göreve bağlı yazılı belgeler", bg: "bg-primary-subtle", fg: "text-primary" },
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
  history: { desc: "Kayıt bilgileri ve durum geçişleri", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  finance: { desc: "Maliyet merkezleri, bütçe ve harcamalar", bg: "bg-success-subtle", fg: "text-success" },
  gallery: { desc: "Göreve eklenen görsellerin ızgarası", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  ai: { desc: "Akıllı görev analizi, özet ve öneriler", bg: "bg-ai-subtle", fg: "text-ai-500" },
  automations: { desc: "Durum ve eylem tetikleyici kurallar", bg: "bg-ai-subtle", fg: "text-ai-500" },
  "custom-fields": { desc: "Göreve özel form alanları tanımlayın", bg: "bg-success-subtle", fg: "text-success" }
}, vr = [
  { title: "GÖREV & PLANLAMA", codes: ["subtask-table", "subtask-board", "calendar", "documents", "checklist", "gantt", "time-tracking", "dependencies", "risks", "approvals", "dashboard"] },
  { title: "İLETİŞİM", codes: ["comments", "emails"] },
  { title: "GEÇMİŞ & FİNANS", codes: ["activity", "history", "finance", "gallery"] },
  { title: "İLERİ ÖZELLİKLER & YAPAY ZEKA", codes: ["ai", "automations", "custom-fields"] }
], jr = /* @__PURE__ */ new Set([
  "risks",
  "dashboard",
  "comments",
  "emails",
  "custom-fields",
  "approvals",
  "ai",
  "automations"
]), Nr = (t) => jr.has(t);
function $a(t) {
  const a = Sa[t], s = yr[t];
  return a ? {
    code: t,
    title: a.title,
    icon: a.icon,
    desc: (s == null ? void 0 : s.desc) ?? "",
    bg: (s == null ? void 0 : s.bg) ?? "bg-neutral-subtle",
    fg: (s == null ? void 0 : s.fg) ?? "text-text-secondary"
  } : null;
}
function wr(t) {
  var a;
  return (a = Sa[t]) != null && a.hidden ? null : $a(t);
}
function kr(t = "") {
  const a = t.trim().toLowerCase();
  return vr.map((s) => ({
    title: s.title,
    items: s.codes.map(wr).filter(Boolean).filter((r) => !a || r.title.toLowerCase().includes(a) || r.desc.toLowerCase().includes(a))
  })).filter((s) => s.items.length > 0);
}
const ta = Ye.filter((t) => !t.hidden).length;
function aa({ code: t, onRemoveFeature: a, onOpenPicker: s, canRemove: r = !0 }) {
  const i = $a(t) ?? { title: t, desc: "", icon: "fa-cube", bg: "bg-neutral-subtle", fg: "text-text-secondary" };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-3 py-14 px-6 rounded-2xl border border-dashed border-strong bg-surface-base text-center", children: [
    /* @__PURE__ */ e.jsx("span", { className: `flex items-center justify-center h-14 w-14 rounded-2xl ${i.bg} ${i.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${i.icon} text-[22px]` }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-w-[420px]", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: i.title }),
      i.desc && /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] leading-[1.6] text-text-secondary", children: i.desc }),
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
function kt({ open: t, onClose: a, label: s, children: r }) {
  return /* @__PURE__ */ e.jsx(
    qa,
    {
      open: t,
      onOpenChange: (i) => {
        i || a == null || a();
      },
      children: /* @__PURE__ */ e.jsxs(Ya, { children: [
        /* @__PURE__ */ e.jsx(Ua, { className: "fixed inset-0", style: { pointerEvents: "none" } }),
        /* @__PURE__ */ e.jsx(_a, { asChild: !0, "aria-describedby": void 0, children: /* @__PURE__ */ e.jsxs("div", { className: "fixed inset-0 z-modal", children: [
          /* @__PURE__ */ e.jsx(Oa, { className: "sr-only", children: s }),
          r
        ] }) })
      ] })
    }
  );
}
function Dr({
  open: t,
  onClose: a,
  assignedCodes: s = [],
  onAddFeature: r,
  onGoToTab: i
}) {
  const [o, l] = h.useState("");
  if (h.useEffect(() => {
    t || l("");
  }, [t]), !t) return null;
  const n = new Set(s), c = kr(o), d = s.length + 3, b = (p) => {
    if (n.has(p)) {
      i == null || i(p), a == null || a();
      return;
    }
    r == null || r(p), a == null || a();
  };
  return /* @__PURE__ */ e.jsx(kt, { open: t, onClose: a, label: "Özellik ekle", children: /* @__PURE__ */ e.jsx(
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
          onClick: (p) => p.stopPropagation(),
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
                  onChange: (p) => l(p.target.value),
                  placeholder: `${ta} özellik arasında ara (Gantt, Finans, Risk, AI…)`,
                  className: "w-full h-[42px] pl-9 pr-3.5 rounded-xl border border-default bg-neutral-subtle text-text-primary text-[13px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                }
              )
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col gap-5 px-[22px] pt-3 pb-[22px] overflow-y-auto custom-scrollbar", children: [
              c.map((p) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[11px]", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.1em] text-text-tertiary", children: p.title }),
                  /* @__PURE__ */ e.jsx("span", { className: "flex-1 h-px bg-subtle" })
                ] }),
                /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[11px]", children: p.items.map((m) => {
                  const u = n.has(m.code);
                  return /* @__PURE__ */ e.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => b(m.code),
                      className: `group flex items-start gap-3 p-3.5 rounded-[15px] border text-left cursor-pointer hover:border-focus hover:shadow-md ${u ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                      children: [
                        /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-10 w-10 rounded-xl ${m.bg} ${m.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${m.icon} text-[15px]` }) }),
                        /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-[3px] min-w-0 flex-1", children: [
                          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-between gap-2", children: [
                            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: m.title }),
                            /* @__PURE__ */ e.jsx("span", { className: `shrink-0 text-[10.5px] font-extrabold ${u ? "text-primary" : "text-text-tertiary"}`, children: u ? "✓ Ekli" : "Ekle →" })
                          ] }),
                          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] leading-[1.5] text-text-tertiary", children: m.desc })
                        ] })
                      ]
                    },
                    m.code
                  );
                }) })
              ] }, p.title)),
              c.length === 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 py-12 text-center", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass text-3xl text-text-tertiary mb-2" }),
                /* @__PURE__ */ e.jsx("p", { className: "m-0 text-sm font-semibold text-text-primary", children: "Eşleşen özellik bulunamadı" }),
                /* @__PURE__ */ e.jsx("p", { className: "m-0 text-xs text-text-tertiary", children: "Lütfen farklı bir arama terimi deneyin." })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-[22px] py-3.5 border-t border-subtle bg-surface-raised text-[11.5px] text-text-tertiary", children: [
              /* @__PURE__ */ e.jsxs("span", { children: [
                "Toplam ",
                ta,
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
const Cr = [
  { key: "subtasks", label: "Alt görevler", countKey: "subtasks", unit: "alt görev" },
  { key: "checklist", label: "Kontrol listesi", countKey: "checklist", unit: "madde" },
  { key: "comments", label: "Yorumlar", countKey: "comments", unit: "yorum" },
  { key: "files", label: "Dosyalar", countKey: "files", unit: "dosya" },
  { key: "keepAssignee", label: "Sorumluyu koru", desc: "Aksi halde atanmamış gelir" },
  { key: "keepLinks", label: "Bağımlılıkları koru", desc: "Öncül / ardıl bağlantılar" },
  { key: "shiftDates", label: "Tarihleri bugüne kaydır", desc: "Başlangıç ve son tarih ötelenir" }
], sa = {
  subtasks: !0,
  checklist: !0,
  comments: !1,
  files: !0,
  keepAssignee: !0,
  keepLinks: !0,
  shiftDates: !1
};
function Tr({ on: t, onClick: a, label: s }) {
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
function Sr({
  open: t,
  mode: a = "move",
  onClose: s,
  onConfirm: r,
  projectOptions: i = [],
  currentProjectId: o,
  counts: l = {},
  onCreateProject: n
}) {
  const [c, d] = h.useState(a), [b, p] = h.useState([]), [m, u] = h.useState(""), [x, g] = h.useState(""), [f, j] = h.useState(sa), [w, T] = h.useState(!1);
  h.useEffect(() => {
    t && (d(a), p([]), u(""), g(""), j(sa));
  }, [t, a]);
  const E = h.useMemo(
    () => i.filter((N) => N.value && N.value !== o),
    [i, o]
  ), S = E.filter((N) => !m || N.label.toLowerCase().includes(m.toLowerCase())), z = E.length > 0 && b.length === E.length;
  if (!t) return null;
  const G = (N) => p((v) => v.includes(N) ? v.filter((y) => y !== N) : [...v, N]), A = (N) => {
    var v;
    return ((v = i.find((y) => y.value === N)) == null ? void 0 : v.label) ?? "";
  }, K = async () => {
    var v, y, C;
    const N = x.trim();
    if (!(!N || w)) {
      T(!0);
      try {
        const P = await (n == null ? void 0 : n(N));
        P && p((W) => [...W, P]), g("");
      } catch (P) {
        (C = (y = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : y.error) == null || C.call(y, (P == null ? void 0 : P.message) || "Proje oluşturulamadı.");
      } finally {
        T(!1);
      }
    }
  }, M = async () => {
    if (!(!b.length || w)) {
      T(!0);
      try {
        await (r == null ? void 0 : r({ mode: c, targetProjectIds: b, include: f }));
      } finally {
        T(!1);
      }
    }
  }, I = c === "move", _ = b.length, Q = I ? _ > 1 ? "Taşı ve kopyala" : "Taşı" : _ > 1 ? `${_} projeye kopyala` : "Kopyala", O = Object.values(f).filter(Boolean).length, Z = b.map(A).filter(Boolean), V = Z.length ? `${Z.length > 2 ? `${Z.slice(0, 2).join(", ")} +${Z.length - 2}` : Z.join(", ")} · ${O} seçenek açık` : `Proje seçilmedi · ${O} seçenek açık`, ee = (N) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${N ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return /* @__PURE__ */ e.jsx(kt, { open: t, onClose: s, label: I ? "Başka projeye taşı" : "Başka projelere kopyala", children: /* @__PURE__ */ e.jsx(
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
          "aria-label": I ? "Başka projeye taşı" : "Başka projelere kopyala",
          onClick: (N) => N.stopPropagation(),
          className: "flex flex-col w-full max-w-[760px] max-h-[88vh] rounded-[20px] border border-default bg-surface-base shadow-xl overflow-hidden animate-dialog-in",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-4 px-[22px] pt-5 pb-4 border-b border-subtle", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-10 w-10 rounded-[13px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-tree text-base" }) }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsx("h3", { className: "m-0 text-base font-extrabold tracking-[-.02em] text-text-primary", children: I ? "Başka projeye taşı" : "Başka projelere kopyala" }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 mb-0 text-[12px] leading-[1.5] text-text-tertiary", children: I ? "Görev ilk seçtiğiniz projeye taşınır; birden fazla seçerseniz kalanlara kopya oluşturulur." : "Görevin kopyası seçtiğiniz her projede oluşturulur; bu görev yerinde kalır." })
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
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => d("move"), className: ee(I), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[10px]" }),
                "Taşı"
              ] }),
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => d("copy"), className: ee(!I), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clone text-[10px]" }),
                "Kopyala"
              ] })
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 grid grid-cols-2 lt-860:grid-cols-1 gap-5 items-start px-[22px] pt-4 pb-5 overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px] min-w-0", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5", children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.08em] text-text-tertiary", children: [
                    "Hedef projeler · ",
                    _
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => p(z ? [] : E.map((N) => N.value)),
                      className: "p-0 border-0 bg-transparent text-primary text-[11px] font-bold cursor-pointer hover:underline",
                      children: z ? "Seçimi temizle" : "Tümünü seç"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: m,
                      onChange: (N) => u(N.target.value),
                      placeholder: "Proje ara…",
                      className: "w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar", children: [
                  S.map((N) => {
                    const v = b.includes(N.value), y = I && b[0] === N.value;
                    return /* @__PURE__ */ e.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => G(N.value),
                        className: `flex items-center gap-[11px] px-3 py-[11px] rounded-[11px] border text-left cursor-pointer hover:border-focus ${v ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                        children: [
                          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] rounded-[5px] border-[1.5px] text-white ${v ? "bg-primary border-primary" : "bg-transparent border-strong"}`, children: v && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" }) }),
                          /* @__PURE__ */ e.jsx("span", { className: "h-2.5 w-2.5 shrink-0 rounded-[3px] bg-primary" }),
                          /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: N.label }),
                          y && /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center h-5 px-2 rounded-md bg-primary text-white text-[10px] font-extrabold", children: "TAŞINACAK" })
                        ]
                      },
                      N.value
                    );
                  }),
                  S.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "py-6 text-center text-[12px] text-text-tertiary", children: "Uygun proje bulunamadı." })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[7px] mt-1", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: x,
                      onChange: (N) => g(N.target.value),
                      onKeyDown: (N) => {
                        N.key === "Enter" && (N.preventDefault(), K());
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
                      onClick: K,
                      disabled: !x.trim() || w,
                      className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-plus text-[12px]" })
                    }
                  )
                ] }),
                I && _ > 1 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle", children: [
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
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: Cr.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-px", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary", children: N.label }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: N.countKey ? `${l[N.countKey] ?? 0} ${N.unit}` : N.desc })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    Tr,
                    {
                      on: f[N.key],
                      label: N.label,
                      onClick: () => j((v) => ({ ...v, [N.key]: !v[N.key] }))
                    }
                  )
                ] }, N.key)) })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3.5 px-[22px] py-3.5 border-t border-subtle bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("span", { className: "min-w-0 truncate text-[11.5px] text-text-tertiary", children: V }),
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
                    onClick: M,
                    disabled: !_ || w,
                    className: `flex items-center gap-2 h-9 px-5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${_ && !w ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${w ? "fa-circle-notch fa-spin" : "fa-arrow-right"} text-[10px]` }),
                      Q
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
const $r = [
  { code: "general", title: "Genel", icon: "fa-circle-info" },
  { code: "checklist", title: "Kontrol", icon: "fa-square-check" },
  { code: "comments", title: "Yorumlar", icon: "fa-comments" },
  { code: "files", title: "Dosyalar", icon: "fa-paperclip" }
], Me = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  img: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
};
function Er(t = "") {
  var s;
  const a = (s = t.split(".").pop()) == null ? void 0 : s.toLowerCase();
  return a === "pdf" ? Me.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(a) ? Me.img : ["doc", "docx", "odt", "rtf"].includes(a) ? Me.doc : ["json", "js", "ts", "cs", "xml", "yml", "yaml"].includes(a) ? Me.code : Me.other;
}
const Pr = (t) => t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toFixed(1)} MB` : "—", Ar = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—", zr = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—";
function xt({ name: t, size: a = 22 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: qe(t), fontSize: a * 0.4 },
      children: Ge(t)
    }
  );
}
function Ve({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: t }),
    a
  ] });
}
function Br({
  subtaskId: t,
  parentCode: a,
  onClose: s,
  onOpenFull: r,
  onDeleted: i,
  currentUserName: o = "Ben"
}) {
  var P, W, ce;
  const l = ae(), { data: n } = vt(t), c = wt(t), d = Nt(t), [b, p] = h.useState("general"), [m, u] = h.useState(""), [x, g] = h.useState(""), [f, j] = h.useState(""), w = h.useRef(null), T = h.useRef(null);
  n && T.current !== n.id && (T.current = n.id, u(n.description ?? ""));
  const { data: E = [] } = re({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var k, R, B, Y;
      return Promise.resolve((Y = (B = (R = (k = window == null ? void 0 : window.apya) == null ? void 0 : k.platform) == null ? void 0 : R.tasks) == null ? void 0 : B.task) == null ? void 0 : Y.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4
  });
  if (h.useEffect(() => {
    const k = (R) => {
      R.key === "Escape" && (R.stopPropagation(), s == null || s());
    };
    return window.addEventListener("keydown", k), () => window.removeEventListener("keydown", k);
  }, [s]), !n) return null;
  const S = (ce = (W = (P = window == null ? void 0 : window.apya) == null ? void 0 : P.platform) == null ? void 0 : W.tasks) == null ? void 0 : ce.task, z = pe(n.status), G = tt(n.priority), A = c.items ?? [], K = A.filter((k) => k.isDone).length, M = A.length ? Math.round(K / A.length * 100) : 0, I = d.attachments ?? [], _ = { checklist: A.length, comments: E.length, files: I.length }, Q = async () => {
    await l.invalidateQueries({ queryKey: ["task-detail", t] });
  }, O = async (k) => {
    var R, B, Y;
    try {
      await Promise.resolve(S.update(n.id, {
        title: n.title,
        description: n.description ?? null,
        startDate: (n.startDate ?? "").slice(0, 10),
        dueDate: n.dueDate ? n.dueDate.slice(0, 10) : null,
        status: n.status,
        priority: n.priority,
        assigneeId: n.assigneeId ?? null,
        boardColumnId: n.boardColumnId ?? null,
        projectId: n.projectId ?? null,
        parentTaskId: n.parentTaskId ?? null,
        isPrivate: !!n.isPrivate,
        predecessorIds: n.predecessorIds ?? [],
        tagNames: (n.tags ?? []).map((H) => H.name),
        estimatedHours: n.estimatedHours ?? null,
        taskType: n.taskType ?? null,
        sprint: n.sprint ?? null,
        ...k
      })), await Q();
    } catch (H) {
      (Y = (B = (R = window == null ? void 0 : window.abp) == null ? void 0 : R.notify) == null ? void 0 : B.error) == null || Y.call(B, (H == null ? void 0 : H.message) || "Alt görev güncellenemedi.");
    }
  }, Z = () => O({ status: n.status >= 4 ? 1 : n.status + 1 }), V = () => O({ priority: n.priority >= 4 ? 1 : n.priority + 1 }), ee = () => {
    (n.description ?? "") !== m && O({ description: m || null });
  }, N = async () => {
    var R, B, Y;
    const k = x.trim();
    if (k) {
      g("");
      try {
        await c.addItem(k);
      } catch (H) {
        (Y = (B = (R = window == null ? void 0 : window.abp) == null ? void 0 : R.notify) == null ? void 0 : B.error) == null || Y.call(B, (H == null ? void 0 : H.message) || "Madde eklenemedi.");
      }
    }
  }, v = async () => {
    var R, B, Y;
    const k = f.trim();
    if (k) {
      j("");
      try {
        await Promise.resolve(S.addComment(n.id, k)), await l.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch (H) {
        (Y = (B = (R = window == null ? void 0 : window.abp) == null ? void 0 : R.notify) == null ? void 0 : B.error) == null || Y.call(B, (H == null ? void 0 : H.message) || "Yorum gönderilemedi.");
      }
    }
  }, y = async () => {
    var k, R, B;
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(S.delete(n.id)), i == null || i(n.id), s == null || s();
      } catch (Y) {
        (B = (R = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : R.error) == null || B.call(R, (Y == null ? void 0 : Y.message) || "Alt görev silinemedi.");
      }
  }, C = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
  return /* @__PURE__ */ e.jsxs(kt, { open: !0, onClose: s, label: `${n.code} alt görev detayı`, children: [
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
        "aria-label": `${n.code} alt görev detayı`,
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
                    onClick: () => r == null ? void 0 : r(n.id),
                    className: `${C} hover:bg-surface-hover hover:text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-up-right-from-square text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Alt görevi sil",
                    onClick: y,
                    className: `${C} hover:bg-negative-subtle hover:text-negative`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Kapat",
                    onClick: s,
                    className: `${C} hover:bg-surface-hover hover:text-text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[13px]" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[7px] flex-wrap", children: [
              /* @__PURE__ */ e.jsx("span", { className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[10.5px] font-bold tracking-[.04em]", children: n.code }),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: Z,
                  title: "Durumu değiştir",
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold cursor-pointer ${z.bg} ${z.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${z.icon} text-[10px]` }),
                    z.label
                  ]
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: V,
                  title: "Önceliği değiştir",
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold cursor-pointer ${G.bg} ${G.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${G.icon} text-[10px]` }),
                    G.label
                  ]
                }
              ),
              (n.tags ?? []).map((k) => /* @__PURE__ */ e.jsx("span", { className: "flex items-center h-6 px-[9px] rounded-[7px] border border-default bg-neutral-subtle text-text-secondary text-[11px] font-semibold", children: k.name }, k.id ?? k.name))
            ] }),
            /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[18px] font-extrabold tracking-[-.02em] leading-[1.3] text-text-primary", children: n.title }),
            /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 pt-1", children: [
              /* @__PURE__ */ e.jsx(Ve, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
                /* @__PURE__ */ e.jsx(xt, { name: n.assigneeName }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", children: n.assigneeName || "Atanmamış" })
              ] }) }),
              /* @__PURE__ */ e.jsx(Ve, { label: "Son tarih", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] h-[22px] text-[12.5px] font-semibold text-text-primary", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[11px] text-text-tertiary" }),
                zr(n.dueDate)
              ] }) }),
              /* @__PURE__ */ e.jsx(Ve, { label: "Süre", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-[22px] font-mono text-[12.5px] font-bold text-text-primary", children: [
                n.spentHours ?? 0,
                "s",
                /* @__PURE__ */ e.jsxs("span", { className: "font-medium text-text-tertiary", children: [
                  " / ",
                  n.estimatedHours != null ? `${n.estimatedHours}s` : "—"
                ] })
              ] }) }),
              /* @__PURE__ */ e.jsx(Ve, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-1.5 pt-[3px]", children: [
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
                  "%",
                  M
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: "block h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("span", { className: "block h-full rounded-full bg-success", style: { width: `${M}%` } }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: $r.map((k) => {
            const R = b === k.code, B = _[k.code] ?? 0;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => p(k.code),
                className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${R ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${k.icon} text-[11px] opacity-85` }),
                  /* @__PURE__ */ e.jsx("span", { children: k.title }),
                  B > 0 && /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-neutral-subtle text-text-tertiary text-[10px] font-extrabold", children: B })
                ]
              },
              k.code
            );
          }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar px-5 py-[18px] bg-surface-raised", children: [
            b === "general" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Açıklama" }),
              /* @__PURE__ */ e.jsx(
                "textarea",
                {
                  rows: 7,
                  value: m,
                  onChange: (k) => u(k.target.value),
                  onBlur: ee,
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
            b === "checklist" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px]", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Kontrol listesi" }),
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: [
                  K,
                  "/",
                  A.length
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-success", style: { width: `${M}%` } }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px] mt-1", children: [
                A.map((k) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] border border-subtle bg-surface-base hover:border-default", children: [
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Tamamlandı işaretle",
                      onClick: () => c.toggleItem(k.id),
                      className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white cursor-pointer ${k.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
                      children: k.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[12.5px] font-semibold ${k.isDone ? "line-through text-text-tertiary" : "text-text-primary"}`, children: k.text }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Maddeyi sil",
                      onClick: () => c.removeItem(k.id),
                      className: "flex shrink-0 items-center justify-center h-6 w-6 rounded-md text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[10px]" })
                    }
                  )
                ] }, k.id)),
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "text",
                    value: x,
                    onChange: (k) => g(k.target.value),
                    onKeyDown: (k) => {
                      k.key === "Enter" && N();
                    },
                    placeholder: "Yeni madde yaz ve Enter'a bas…",
                    className: "h-9 mt-1 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                )
              ] })
            ] }),
            b === "comments" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] items-start", children: [
                /* @__PURE__ */ e.jsx(xt, { name: o, size: 30 }),
                /* @__PURE__ */ e.jsx(
                  "textarea",
                  {
                    rows: 2,
                    value: f,
                    onChange: (k) => j(k.target.value),
                    onKeyDown: (k) => {
                      k.key === "Enter" && !k.shiftKey && (k.preventDefault(), v());
                    },
                    placeholder: "Yorum yaz ve Enter'a bas…",
                    className: "flex-1 min-w-0 px-3 py-2.5 rounded-[11px] border border-default bg-surface-base text-text-primary text-[12.5px] leading-[1.6] resize-none focus:border-focus focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: v,
                    "aria-label": "Yorumu gönder",
                    className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] ${f.trim() ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paper-plane text-[11px]" })
                  }
                )
              ] }),
              E.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-[7px] py-7 rounded-xl border border-dashed border-default", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-comments text-xl text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Henüz yorum yok" })
              ] }) : E.map((k) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 items-start p-3 rounded-xl border border-subtle bg-surface-base", children: [
                /* @__PURE__ */ e.jsx(xt, { name: k.authorName, size: 28 }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: k.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: Ar(k.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: k.text })
                ] })
              ] }, k.id))
            ] }),
            b === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  ref: w,
                  type: "file",
                  className: "hidden",
                  onChange: (k) => {
                    var B;
                    const R = (B = k.target.files) == null ? void 0 : B[0];
                    k.target.value = "", R && d.upload(R).catch((Y) => {
                      var H, le, L;
                      return (L = (le = (H = window == null ? void 0 : window.abp) == null ? void 0 : H.notify) == null ? void 0 : le.error) == null ? void 0 : L.call(le, (Y == null ? void 0 : Y.message) || "Dosya yüklenemedi.");
                    });
                  }
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    var k;
                    return (k = w.current) == null ? void 0 : k.click();
                  },
                  disabled: d.isUploading,
                  className: "flex flex-col items-center justify-center gap-[7px] p-6 rounded-[13px] border-2 border-dashed border-strong bg-surface-base cursor-pointer hover:border-focus hover:bg-primary-subtle disabled:opacity-60",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.isUploading ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-xl text-text-tertiary` }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: d.isUploading ? "Yükleniyor…" : "Dosya ekle" })
                  ]
                }
              ),
              I.map((k) => {
                const R = Er(k.fileName);
                return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${R.bg} ${R.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${R.icon} text-[13px]` }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: k.fileName }),
                    /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                      Pr(k.fileSize),
                      " · ",
                      k.uploaderName
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "a",
                    {
                      href: k.downloadUrl,
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
                      onClick: () => d.remove(k.id).catch((B) => {
                        var Y, H, le;
                        return (le = (H = (Y = window == null ? void 0 : window.abp) == null ? void 0 : Y.notify) == null ? void 0 : H.error) == null ? void 0 : le.call(H, (B == null ? void 0 : B.message) || "Dosya silinemedi.");
                      }),
                      className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                    }
                  )
                ] }, k.id);
              })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-5 py-3 border-t border-subtle bg-surface-base shrink-0", children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => r == null ? void 0 : r(n.id),
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
const Ea = "apya.taskDetail.tabOrder";
function Lr() {
  try {
    const t = localStorage.getItem(Ea);
    if (!t) return [];
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.filter((s) => typeof s == "string") : [];
  } catch {
    return [];
  }
}
function Kr(t) {
  try {
    localStorage.setItem(Ea, JSON.stringify(t));
  } catch {
  }
}
function Mr(t) {
  const [a, s] = h.useState(Lr), [r, i] = h.useState(null), o = h.useMemo(() => {
    const d = new Map(t.map((p) => [p.code, p])), b = [];
    for (const p of a) {
      const m = d.get(p);
      m && (b.push(m), d.delete(p));
    }
    for (const p of t)
      d.has(p.code) && b.push(p);
    return b;
  }, [t, a]), l = h.useCallback((d) => {
    s((b) => {
      const p = r;
      if (!p || p === d) return b;
      const m = b.length ? b.slice() : o.map((g) => g.code), u = m.indexOf(p), x = m.indexOf(d);
      return u === -1 || x === -1 ? b : (m.splice(u, 1), m.splice(x, 0, p), m);
    });
  }, [r, o]), n = h.useCallback((d) => i(d), []), c = h.useCallback(() => {
    i(null), s((d) => {
      const b = d.length ? d : o.map((p) => p.code);
      return Kr(b), b;
    });
  }, [o]);
  return { orderedTabs: o, draggingCode: r, handleDragStart: n, handleDragEnd: c, reorderTo: l };
}
function Ir() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Rr() {
  const t = re({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: Ir,
    staleTime: 3e5,
    retry: !1
  }), a = t.data ?? [], s = a.map((i) => ({ value: i.id, label: i.name })), r = new Map(a.map((i) => [i.id, i.name]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
const ra = "apya.taskDetail.fullscreen", J = {
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
function Fr(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function Pa({ taskId: t, presentation: a = "modal", onClose: s, switchToTask: r }) {
  var St, $t, Et, Pt, At, zt, Bt, Lt;
  const [i, o] = h.useState(t), { data: l, isPending: n, isError: c, refetch: d } = vt(i), b = ae(), p = ua(), m = ba(l), u = ha(), x = Rr(), g = ga(i), f = wt(i), [j, w] = h.useState("general"), [T, E] = h.useState(!1), [S, z] = h.useState(!1), [G, A] = h.useState(!1), [K, M] = h.useState(null), [I, _] = h.useState(null), [Q, O] = h.useState(!1), [Z, V] = h.useState(!1), [ee, N] = h.useState(() => {
    try {
      return localStorage.getItem(ra) === "true";
    } catch {
      return !1;
    }
  });
  fa(i);
  const [v, y] = h.useState(null);
  l != null && l.id && l.id !== v && (y(l.id), O(!!l.isFavorite), V(!!l.isWatched)), h.useEffect(() => {
    m.isDirty ? p.markDirty() : p.markClean();
  });
  const C = h.useCallback(() => {
    ma(), s == null || s();
  }, [s]), P = h.useCallback(() => p.requestClose(C), [p, C]), W = h.useCallback(() => {
    N((D) => {
      const $ = !D;
      try {
        localStorage.setItem(ra, String($));
      } catch {
      }
      return $;
    });
  }, []), ce = h.useMemo(
    () => Da(g.assignedCodes),
    [g.assignedCodes]
  ), k = Mr(ce), R = h.useMemo(() => {
    var D, $, q, oe, fe;
    return {
      subtasks: ((D = l == null ? void 0 : l.subTasks) == null ? void 0 : D.length) ?? 0,
      files: (($ = l == null ? void 0 : l.attachments) == null ? void 0 : $.length) ?? 0,
      dependencies: ((q = l == null ? void 0 : l.predecessorIds) == null ? void 0 : q.length) ?? 0,
      comments: ((oe = l == null ? void 0 : l.comments) == null ? void 0 : oe.length) ?? 0,
      checklist: ((fe = f.items) == null ? void 0 : fe.length) ?? 0
    };
  }, [l, f.items]), B = Ye.find((D) => D.code === j), Y = f.items ?? [], H = Y.filter((D) => D.isDone).length, le = Y.length ? Math.round(H / Y.length * 100) : 0, L = h.useCallback(async () => {
    if (!m.validate())
      return J.err("Zorunlu alanları kontrol edin."), !1;
    E(!0);
    try {
      return await Promise.resolve(window.apya.platform.tasks.task.update(i, m.toUpdateDto())), await b.invalidateQueries({ queryKey: ["task-detail", i] }), ie.emitResult(), z(!0), setTimeout(() => z(!1), 2e3), J.ok("Görev başarıyla güncellendi."), !0;
    } catch (D) {
      return J.err((D == null ? void 0 : D.message) || "Kaydedilemedi."), !1;
    } finally {
      E(!1);
    }
  }, [i, m, b]);
  h.useEffect(() => {
    const D = ($) => {
      if (($.ctrlKey || $.metaKey) && $.key.toLowerCase() === "s") {
        $.preventDefault(), m.isDirty && !T && L();
        return;
      }
      if ($.key === "Escape") {
        if (K) {
          $.stopPropagation(), M(null);
          return;
        }
        G && ($.stopPropagation(), A(!1));
      }
    };
    return window.addEventListener("keydown", D), () => window.removeEventListener("keydown", D);
  }, [L, m.isDirty, T, K, G]);
  const F = () => {
    var D, $, q;
    return (q = ($ = (D = window == null ? void 0 : window.apya) == null ? void 0 : D.platform) == null ? void 0 : $.tasks) == null ? void 0 : q.task;
  }, U = async () => {
    var $;
    const D = !Q;
    O(D);
    try {
      await Promise.resolve(($ = F()) == null ? void 0 : $.toggleFavorite(i));
    } catch (q) {
      O(!D), J.err((q == null ? void 0 : q.message) || "Favori güncellenemedi.");
    }
  }, te = () => {
    if (!i) return;
    const D = document.createElement("a");
    D.href = `/Tasks/Detail/${i}?handler=Pdf`, D.rel = "noopener", document.body.appendChild(D), D.click(), D.remove();
  }, X = async () => {
    var $;
    const D = !Z;
    V(D);
    try {
      await Promise.resolve(($ = F()) == null ? void 0 : $.toggleWatch(i)), J.info(D ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (q) {
      V(!D), J.err((q == null ? void 0 : q.message) || "Takip durumu güncellenemedi.");
    }
  }, Ce = async () => {
    var D, $;
    try {
      const q = await Promise.resolve((D = F()) == null ? void 0 : D.transfer(i, {
        mode: 2,
        // Copy
        targetProjectIds: l != null && l.projectId ? [l.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await b.invalidateQueries({ queryKey: ["task-detail"] }), J.ok("Görev çoğaltıldı.");
      const oe = ($ = q == null ? void 0 : q.createdTaskIds) == null ? void 0 : $[0];
      oe && o(oe);
    } catch (q) {
      J.err((q == null ? void 0 : q.message) || "Görev çoğaltılamadı.");
    }
  }, xe = async () => {
    var D;
    try {
      await Promise.resolve((D = F()) == null ? void 0 : D.updateStatus(i, 4)), await b.invalidateQueries({ queryKey: ["task-detail", i] }), J.info("Görev arşivlendi (Tamamlandı).");
    } catch ($) {
      J.err(($ == null ? void 0 : $.message) || "Görev arşivlenemedi.");
    }
  }, za = async () => {
    var D;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?"))
      try {
        await Promise.resolve((D = F()) == null ? void 0 : D.delete(i)), J.info("Görev silindi."), p.markClean(), C();
      } catch ($) {
        J.err(($ == null ? void 0 : $.message) || "Görev silinemedi.");
      }
  }, Ba = async (D) => {
    try {
      await g.addFeature(D), w(D), J.ok("Özellik başarıyla eklendi.");
    } catch ($) {
      J.err(($ == null ? void 0 : $.message) || "Özellik eklenemedi.");
    }
  }, Dt = async (D) => {
    try {
      await g.removeFeature(D), w("general"), J.info("Özellik görevden kaldırıldı.");
    } catch ($) {
      J.err(($ == null ? void 0 : $.message) || "Özellik kaldırılamadı.");
    }
  }, La = async (D) => {
    var oe, fe, de, $e, Te, Ue, Be;
    const $ = (($e = (de = (fe = (oe = window == null ? void 0 : window.apya) == null ? void 0 : oe.platform) == null ? void 0 : fe.application) == null ? void 0 : de.projects) == null ? void 0 : $e.project) ?? ((Be = (Ue = (Te = window == null ? void 0 : window.apya) == null ? void 0 : Te.platform) == null ? void 0 : Ue.projects) == null ? void 0 : Be.project);
    if (!($ != null && $.create)) throw new Error("Proje servisi yüklenmedi.");
    const q = await Promise.resolve($.create({
      name: D,
      code: Fr(D),
      currency: "TRY"
    }));
    return await b.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), J.ok(`“${D}” projesi oluşturuldu.`), (q == null ? void 0 : q.id) ?? q;
  }, Ka = async ({ mode: D, targetProjectIds: $, include: q }) => {
    var oe, fe;
    try {
      const de = await Promise.resolve((oe = F()) == null ? void 0 : oe.transfer(i, {
        mode: D === "move" ? 1 : 2,
        targetProjectIds: $,
        include: q
      }));
      await b.invalidateQueries({ queryKey: ["task-detail", i] });
      const $e = $.map((Ue) => {
        var Be;
        return (Be = x.options.find((Ia) => Ia.value === Ue)) == null ? void 0 : Be.label;
      }).filter(Boolean), Te = ((fe = de == null ? void 0 : de.createdTaskIds) == null ? void 0 : fe.length) ?? 0;
      J.ok(D === "move" ? Te ? `“${$e[0]}” projesine taşındı, ${Te} projeye kopyalandı.` : `Görev “${$e[0]}” projesine taşındı.` : Te > 1 ? `${Te} projeye kopyalandı.` : `Kopya “${$e[0]}” projesinde oluşturuldu.`), M(null);
    } catch (de) {
      J.err((de == null ? void 0 : de.message) || "Transfer tamamlanamadı.");
    }
  }, Ma = j === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)] gap-5 items-start", children: [
    /* @__PURE__ */ e.jsx(
      hr,
      {
        task: l,
        onFieldChange: m.setField,
        descriptionValue: m.values.description,
        checklist: f,
        currentUserName: (($t = (St = window == null ? void 0 : window.abp) == null ? void 0 : St.currentUser) == null ? void 0 : $t.name) || ((Pt = (Et = window == null ? void 0 : window.abp) == null ? void 0 : Et.currentUser) == null ? void 0 : Pt.userName) || "Ben"
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5", children: /* @__PURE__ */ e.jsx(br, { task: l, nameById: u.nameById }) })
  ] }) : Nr(j) ? /* @__PURE__ */ e.jsx(
    aa,
    {
      code: j,
      onRemoveFeature: Dt,
      onOpenPicker: () => A(!0),
      canRemove: !(B != null && B.isCore)
    }
  ) : /* @__PURE__ */ e.jsx(h.Suspense, { fallback: /* @__PURE__ */ e.jsx(ye, { className: "h-48 w-full" }), children: B != null && B.component ? /* @__PURE__ */ e.jsx(
    B.component,
    {
      taskId: i,
      task: l,
      nameById: u.nameById,
      onOpenSubtask: _
    }
  ) : /* @__PURE__ */ e.jsx(
    aa,
    {
      code: j,
      onRemoveFeature: Dt,
      onOpenPicker: () => A(!0),
      canRemove: !(B != null && B.isCore)
    }
  ) }), Ct = n ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(ye, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(ye, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(ye, { className: "h-64 w-full" })
  ] }) : c ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(ne, { variant: "ghost", onClick: () => d(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col flex-1 min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      ur,
      {
        task: l,
        presentation: a,
        onClose: P,
        isFullscreen: ee,
        onToggleFullscreen: W,
        onFieldChange: m.setField,
        statusValue: m.values.status,
        titleValue: l == null ? void 0 : l.title,
        isPrivateValue: m.values.isPrivate,
        isFavorite: Q,
        onToggleFavorite: U,
        isWatched: Z,
        onToggleWatch: X,
        onDuplicate: Ce,
        onArchive: xe,
        onDelete: za,
        onOpenTransfer: (D) => M({ mode: D }),
        onSaveAsTemplate: () => J.info("Şablon olarak kaydetme yakında."),
        onConvertToSubtask: () => J.info("Alt göreve dönüştürme yakında."),
        onExportPdf: te
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        pr,
        {
          task: l,
          assigneeOptions: u.options,
          projectOptions: x.options,
          onFieldChange: m.setField,
          statusValue: m.values.status,
          priorityValue: m.values.priority,
          assigneeValue: m.values.assigneeId,
          projectValue: m.values.projectId,
          dueDateValue: m.values.dueDate,
          startDateValue: m.values.startDate,
          tagsValue: m.values.tagNames,
          progressPercent: le,
          progressNote: `${H}/${Y.length} madde`,
          onOpenTransfer: (D) => M({ mode: D })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        a === "page" && /* @__PURE__ */ e.jsx(
          fr,
          {
            activeTab: j,
            onTabChange: w,
            orderedTabs: k.orderedTabs,
            draggingCode: k.draggingCode,
            onDragStart: k.handleDragStart,
            onDragEnd: k.handleDragEnd,
            onReorderTo: k.reorderTo,
            onReorderDrop: () => J.info("Sekme sırası güncellendi."),
            onOpenPicker: () => A(!0),
            counts: R
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: a === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            mr,
            {
              activeTab: j,
              onTabChange: w,
              orderedTabs: k.orderedTabs,
              draggingCode: k.draggingCode,
              onDragStart: k.handleDragStart,
              onDragEnd: k.handleDragEnd,
              onReorderTo: k.reorderTo,
              onReorderDrop: () => J.info("Sekme sırası güncellendi."),
              onOpenPicker: () => A(!0),
              counts: R,
              isDirty: m.isDirty
            }
          ) }),
          /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised", children: Ma })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(
      gr,
      {
        lastSavedAt: l == null ? void 0 : l.lastModificationTime,
        isDirty: m.isDirty,
        isSaving: T,
        justSaved: S,
        onCancel: P,
        onSave: L
      }
    )
  ] }), Tt = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      Dr,
      {
        open: G,
        onClose: () => A(!1),
        assignedCodes: g.assignedCodes,
        onAddFeature: Ba,
        onGoToTab: w
      }
    ),
    /* @__PURE__ */ e.jsx(
      Sr,
      {
        open: !!K,
        mode: (K == null ? void 0 : K.mode) ?? "move",
        onClose: () => M(null),
        onConfirm: Ka,
        projectOptions: x.options,
        currentProjectId: m.values.projectId,
        counts: R,
        onCreateProject: La
      }
    ),
    I && /* @__PURE__ */ e.jsx(
      Br,
      {
        subtaskId: I,
        parentCode: l == null ? void 0 : l.code,
        onClose: () => _(null),
        onOpenFull: (D) => {
          _(null), (r ?? o)(D);
        },
        onDeleted: () => b.invalidateQueries({ queryKey: ["task-detail", i] }),
        currentUserName: ((zt = (At = window == null ? void 0 : window.abp) == null ? void 0 : At.currentUser) == null ? void 0 : zt.name) || ((Lt = (Bt = window == null ? void 0 : window.abp) == null ? void 0 : Bt.currentUser) == null ? void 0 : Lt.userName) || "Ben"
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col w-full min-h-[calc(100vh-54px)] border-y border-subtle bg-surface-base", children: Ct }),
    Tt
  ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(oa, { open: !0, onOpenChange: (D) => {
      D || P();
    }, children: /* @__PURE__ */ e.jsx(
      ca,
      {
        title: l != null && l.title ? `Görev Detayı: ${l.title}` : "Görev Detayı",
        fullscreen: ee,
        className: ee ? "p-0 rounded-xl border border-default shadow-xl short:h-[100svh]" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl short:h-[100svh]",
        onInteractOutside: (D) => {
          var $, q;
          D.preventDefault(), !(G || K || I) && ((q = ($ = D.target) == null ? void 0 : $.closest) != null && q.call($, "[data-apya-overlay]") || P());
        },
        onEscapeKeyDown: (D) => {
          if (G || K || I) {
            D.preventDefault();
            return;
          }
          D.preventDefault(), P();
        },
        children: Ct
      }
    ) }),
    Tt
  ] });
}
function Gr() {
  var a;
  const t = h.useSyncExternalStore(
    ie.subscribe,
    ie.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(We, { children: /* @__PURE__ */ e.jsx(
    Pa,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        ie.close(), ie.emitResult();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(We, { children: /* @__PURE__ */ e.jsx(
    Ca,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        ie.close(), ie.emitResult();
      }
    },
    t
  ) }) : null;
}
function Aa() {
  var s;
  try {
    const r = new URLSearchParams(window.location.search).get("taskui");
    if (r === "v1" || r === "v2" || r === "v3") return r;
  } catch {
  }
  const t = document.getElementById("task-detail-island"), a = (s = t == null ? void 0 : t.dataset) == null ? void 0 : s.taskui;
  return a === "v1" || a === "v2" ? a : "v3";
}
function qr() {
  return Aa() === "v2";
}
function Yr() {
  return Aa() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = Yr();
window.apya.taskDetailV2Enabled = qr() && !window.apya.taskDetailV3Enabled;
const na = {
  open: (t) => {
    ie.open(t);
  },
  close: () => ie.close(),
  onResult: (t) => ie.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(na) : window.apya.taskDetail = na;
function ia() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = la(t), t._reactRoot.render(/* @__PURE__ */ e.jsx(Gr, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = pa();
    a && ie.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", ia) : ia();
function Ur({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(We, { children: /* @__PURE__ */ e.jsx(
    Pa,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(We, { children: /* @__PURE__ */ e.jsx(
    Ca,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) });
}
const ut = document.getElementById("task-detail-page-island");
if (ut) {
  const t = ut.getAttribute("data-task-id");
  t && la(ut).render(/* @__PURE__ */ e.jsx(Ur, { taskId: t }));
}
