import { j as e, r as h, d as Me, b as ia } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { a as Qe } from "./QueryProvider-AIUp_Zk5.js";
import { u as ne, a as ae, b as oe } from "./query-vendor-Bf69L2iP.js";
import { D as la, i as oa, g as ut, B as se, I as Re, S as ge } from "./Dialog-BdNKdiS6.js";
import { C as Ka } from "./Combobox-Cgzidxen.js";
import { r as Ma } from "./httpClient-CRlyQ1eg.js";
import { R as ye, T as ve, P as je, C as Ne, A as Ra, a as ca, D as Fa, b as Ga, c as qa, d as Ya, e as Ua } from "./ui-vendor-DaE-uom6.js";
import { d as da } from "./draggableActivation-Ybw9Upbh.js";
function _a({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: i,
  footer: l,
  children: o
}) {
  return /* @__PURE__ */ e.jsx(
    la,
    {
      open: t,
      onOpenChange: (n) => {
        n || a();
      },
      children: /* @__PURE__ */ e.jsx(
        oa,
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
            /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: o }),
            l
          ] })
        }
      )
    }
  );
}
function Oa({ title: t, header: a, footer: s, children: r }) {
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
function Va({ isPrivate: t }) {
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
const pt = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, mt = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function Ha({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: i,
  fullscreen: l = !1
}) {
  const [o, n] = h.useState(!1), c = h.useRef(null);
  h.useEffect(() => {
    if (!o) return;
    const u = (g) => {
      c.current && !c.current.contains(g.target) && n(!1);
    }, x = (g) => {
      g.key === "Escape" && n(!1);
    };
    return document.addEventListener("mousedown", u), document.addEventListener("keydown", x), () => {
      document.removeEventListener("mousedown", u), document.removeEventListener("keydown", x);
    };
  }, [o]);
  const d = pt[t == null ? void 0 : t.status] ?? pt[1], b = mt[t == null ? void 0 : t.priority] ?? mt[2], p = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), n(!1);
  }, f = () => {
    var x, g, m, j;
    const u = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (x = navigator.clipboard) == null || x.writeText(u), (j = (m = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : m.info) == null || j.call(m, "Bağlantı kopyalandı."), n(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(ut, { variant: d.variant, children: d.text }),
        /* @__PURE__ */ e.jsx(ut, { variant: b.variant, children: b.text }),
        /* @__PURE__ */ e.jsx(Va, { isPrivate: t == null ? void 0 : t.isPrivate })
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
            onClick: () => n((u) => !u),
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
const Qa = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function Wa({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: i }) {
  const l = Qa(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: l ? `Son kayıt: ${l}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(se, { variant: "secondary", onClick: r, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        se,
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
const Lt = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Za = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function fe({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function Ja({ value: t, onChange: a }) {
  const [s, r] = h.useState(""), i = () => {
    const l = s.trim();
    l && !t.includes(l) && a([...t, l]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((l) => /* @__PURE__ */ e.jsxs(ut, { variant: "neutral", children: [
      l,
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${l} etiketini kaldır`,
          onClick: () => a(t.filter((o) => o !== l)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, l)) }),
    /* @__PURE__ */ e.jsx(
      Re,
      {
        value: s,
        onChange: (l) => r(l.target.value),
        onKeyDown: (l) => {
          l.key === "Enter" || l.key === "," ? (l.preventDefault(), i()) : l.key === "Backspace" && !s && t.length && a(t.slice(0, -1));
        },
        onBlur: i,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function Xa({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: i = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(fe, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      Re,
      {
        id: "task-title",
        value: t.title,
        onChange: (l) => s("title", l.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(fe, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (l) => s("status", Number(l.target.value)),
          className: Lt,
          children: Object.entries(pt).map(([l, o]) => /* @__PURE__ */ e.jsx("option", { value: l, children: o.text }, l))
        }
      ) }),
      /* @__PURE__ */ e.jsx(fe, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (l) => s("priority", Number(l.target.value)),
          className: Lt,
          children: Object.entries(mt).map(([l, o]) => /* @__PURE__ */ e.jsx("option", { value: l, children: o.text }, l))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(fe, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      Ka,
      {
        id: "task-assignee",
        options: r,
        value: t.assigneeId,
        onChange: (l) => s("assigneeId", l),
        placeholder: i ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: i
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(fe, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        Re,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (l) => s("startDate", l.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(fe, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        Re,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (l) => s("dueDate", l.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(fe, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(Ja, { value: t.tagNames, onChange: (l) => s("tagNames", l) }) }),
    /* @__PURE__ */ e.jsx(fe, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (l) => s("description", l.target.value),
        className: Za
      }
    ) })
  ] });
}
const Bt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function Be({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function es({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(Be, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(Be, { label: "Oluşturulma zamanı", value: Bt(t.creationTime) }),
      /* @__PURE__ */ e.jsx(Be, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(Be, { label: "Son güncelleme zamanı", value: Bt(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(Be, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const ts = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", as = "border-brand-500 text-text-primary";
function ss({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: i }) {
  const l = h.useRef(/* @__PURE__ */ new Map()), o = (c) => {
    var d;
    s(c.code), (d = l.current.get(c.code)) == null || d.focus();
  }, n = (c, d) => {
    c.key === "ArrowRight" ? (c.preventDefault(), o(t[(d + 1) % t.length])) : c.key === "ArrowLeft" ? (c.preventDefault(), o(t[(d - 1 + t.length) % t.length])) : c.key === "Home" ? (c.preventDefault(), o(t[0])) : c.key === "End" && (c.preventDefault(), o(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((c, d) => {
      const b = c.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (p) => {
            p ? l.current.set(c.code, p) : l.current.delete(c.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${c.code}`,
          "aria-selected": b,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: b ? 0 : -1,
          onClick: () => s(c.code),
          onKeyDown: (p) => n(p, d),
          className: `${ts} ${b ? as : ""}`,
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
const rs = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function ns({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [i, l] = h.useState(""), o = h.useMemo(() => {
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
            onChange: (n) => l(n.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          o.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...o.entries()].map(([n, c]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: rs[n] ?? n }),
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
function is({ trail: t = [], current: a, onNavigate: s }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((r) => /* @__PURE__ */ e.jsxs(Me.Fragment, { children: [
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
function ls(t) {
  var s, r, i;
  const a = (i = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : i.task;
  return a ? Promise.resolve(a.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function gt(t) {
  return ne({
    queryKey: ["task-detail", t],
    queryFn: () => ls(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function Xe(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
function xa() {
  const [t, a] = h.useState(!1), [s, r] = h.useState(!1), i = h.useRef(null), l = h.useCallback(() => a(!0), []), o = h.useCallback(() => a(!1), []);
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
  return { isDirty: t, markDirty: l, markClean: o, requestClose: n, pendingClose: s, resolvePendingClose: c };
}
const os = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, yt = "task";
function ua() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(yt);
  return t && os.test(t) ? t : null;
}
function pa() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(yt), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function ma(t, a) {
  const s = h.useRef(a);
  s.current = a, h.useEffect(() => {
    if (!t || ua() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(yt, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), h.useEffect(() => {
    const r = () => {
      var i;
      (i = s.current) == null || i.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const cs = {
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
function ds(t) {
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
  } : cs;
}
function fa(t) {
  const [a, s] = h.useState(t == null ? void 0 : t.id), r = h.useMemo(() => ds(t), [t]), [i, l] = h.useState(r), [o, n] = h.useState({});
  (t == null ? void 0 : t.id) !== a && (s(t == null ? void 0 : t.id), l(r), n({}));
  const c = h.useCallback((u, x) => {
    l((g) => ({ ...g, [u]: x }));
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
  }), [i, t]), f = h.useCallback(() => {
    l(r), n({});
  }, [r]);
  return { values: i, setField: c, isDirty: d, errors: o, validate: b, toUpdateDto: p, reset: f };
}
function It(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function xs() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ba() {
  var i;
  const t = ne({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: xs,
    staleTime: 3e5,
    retry: !1
  }), a = ((i = t.data) == null ? void 0 : i.items) ?? [], s = a.map((l) => ({ value: l.id, label: It(l) })), r = new Map(a.map((l) => [l.id, It(l)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function ft() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function us(t) {
  const a = ft();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ha(t) {
  const a = ae(), s = ["task-features", t], r = ne({
    queryKey: s,
    queryFn: () => us(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), l = oe({
    mutationFn: (n) => Promise.resolve(ft().addFeature(t, n)),
    onSuccess: i
  }), o = oe({
    mutationFn: (n) => Promise.resolve(ft().removeFeature(t, n)),
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
const We = {
  0: { label: "İptal", icon: "fa-ban", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  1: { label: "Yapılacak", icon: "fa-clock", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  2: { label: "Sürüyor", icon: "fa-spinner", bg: "bg-warning-subtle", fg: "text-warning", dot: "bg-warning" },
  3: { label: "Testte", icon: "fa-flask", bg: "bg-primary-subtle", fg: "text-primary", dot: "bg-primary" },
  4: { label: "Tamamlandı", icon: "fa-circle-check", bg: "bg-success-subtle", fg: "text-success", dot: "bg-success" }
}, bt = {
  1: { label: "Düşük", icon: "fa-arrow-down", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  2: { label: "Orta", icon: "fa-minus", bg: "bg-warning-subtle", fg: "text-warning" },
  3: { label: "Yüksek", icon: "fa-arrow-up", bg: "bg-negative-subtle", fg: "text-negative" },
  4: { label: "Kritik", icon: "fa-flag", bg: "bg-negative-subtle", fg: "text-negative" }
}, Ze = [1, 2, 3, 4], ps = [1, 2, 3, 4], pe = (t) => We[t] ?? We[1], et = (t) => bt[t] ?? bt[2];
function Fe(t) {
  if (!t) return "—";
  const a = String(t).trim().split(/\s+/).filter(Boolean);
  return a.length ? (a.length > 1 ? a[0][0] + a[a.length - 1][0] : a[0].slice(0, 2)).toUpperCase() : "—";
}
function Ge(t) {
  return t ? "var(--apya-brand-500)" : "var(--apya-neutral-500)";
}
function ga(t, a = /* @__PURE__ */ new Date()) {
  if (!t) return { tone: "text-text-tertiary", hint: "" };
  const s = new Date(t);
  if (Number.isNaN(s.getTime())) return { tone: "text-text-tertiary", hint: "" };
  const r = Math.ceil((s.setHours(0, 0, 0, 0) - new Date(a).setHours(0, 0, 0, 0)) / 864e5);
  return r < 0 ? { tone: "text-negative", hint: `${Math.abs(r)} gün gecikti` } : r === 0 ? { tone: "text-warning", hint: "Bugün" } : r <= 3 ? { tone: "text-warning", hint: `${r} gün kaldı` } : { tone: "text-text-tertiary", hint: `${r} gün kaldı` };
}
const ke = "rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden";
function Je({ title: t, badge: a, action: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3.5 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: t }),
      a
    ] }),
    s
  ] });
}
function ms({ children: t, tone: a = "positive" }) {
  const s = a === "positive" ? "bg-success-subtle text-success" : "bg-neutral-subtle text-text-secondary";
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-full font-mono text-[11px] font-bold ${s}`, children: t });
}
function ze({ children: t, bg: a, fg: s }) {
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-[7px] text-[10.5px] font-bold ${a} ${s}`, children: t });
}
function De({ icon: t, title: a, description: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 px-6 py-10 text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-xl text-text-tertiary` }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: a }),
    s && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] leading-[1.55] text-text-tertiary max-w-[420px]", children: s })
  ] });
}
function tt({ name: t, size: a = 24 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Ge(t), fontSize: a * 0.4 },
      title: t || void 0,
      children: Fe(t)
    }
  );
}
const at = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—", Kt = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function ya(t) {
  return t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toFixed(1)} MB` : "0 KB";
}
function st(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = Math.floor(a / 3600), r = Math.floor(a % 3600 / 60);
  return !s && !r ? `${a}sn` : s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function fs(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = (r) => String(r).padStart(2, "0");
  return `${s(Math.floor(a / 3600))}:${s(Math.floor(a / 60) % 60)}:${s(a % 60)}`;
}
const he = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  image: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  sheet: { icon: "fa-file-excel", bg: "bg-success-subtle", fg: "text-success" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  zip: { icon: "fa-file-zipper", bg: "bg-warning-subtle", fg: "text-warning" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
}, Mt = (t = "") => va(t) === he.image;
function va(t = "") {
  var s;
  const a = ((s = t.split(".").pop()) == null ? void 0 : s.toLowerCase()) ?? "";
  return a === "pdf" ? he.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(a) ? he.image : ["doc", "docx", "odt", "rtf", "txt"].includes(a) ? he.doc : ["xls", "xlsx", "csv", "ods"].includes(a) ? he.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(a) ? he.code : ["zip", "rar", "7z", "tar", "gz"].includes(a) ? he.zip : he.other;
}
function bs({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, i] = h.useState(""), [l, o] = h.useState(!1), n = ae(), c = (a == null ? void 0 : a.subTasks) ?? [], d = c.filter((u) => u.status === 4).length, b = () => n.invalidateQueries({ queryKey: ["task-detail", t] }), p = async () => {
    var x, g, m;
    const u = r.trim();
    if (u) {
      o(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: u,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), i(""), await b();
      } catch (j) {
        (m = (g = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : g.error) == null || m.call(g, (j == null ? void 0 : j.message) || "Alt görev eklenemedi.");
      } finally {
        o(!1);
      }
    }
  }, f = async (u, x) => {
    var g, m, j;
    u.stopPropagation();
    try {
      await Promise.resolve(window.apya.platform.tasks.task.updateStatus(x.id, x.status === 4 ? 1 : 4)), await b();
    } catch (k) {
      (j = (m = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : m.error) == null || j.call(m, (k == null ? void 0 : k.message) || "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        c.length > 0 && /* @__PURE__ */ e.jsxs(ms, { children: [
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
          disabled: l || !r.trim(),
          className: `flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${l || !r.trim() ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            "Alt görev ekle"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: ke, children: [
      c.map((u) => {
        const x = pe(u.status), g = u.status === 4;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => s == null ? void 0 : s(u.id, u.title),
            onKeyDown: (m) => {
              m.key === "Enter" && (s == null || s(u.id, u.title));
            },
            className: "flex items-center gap-3.5 px-4 py-3.5 border-t border-subtle first:border-t-0 hover:bg-surface-raised cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": `${u.title} tamamlandı işaretle`,
                  onClick: (m) => f(m, u),
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white cursor-pointer ${g ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: g && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: u.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${g ? "line-through text-text-tertiary" : "text-text-primary"}`, children: u.title }),
              /* @__PURE__ */ e.jsx(ze, { bg: x.bg, fg: x.fg, children: x.label }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: at(u.dueDate) }),
              /* @__PURE__ */ e.jsx(tt, { name: u.assigneeName }),
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
          disabled: l,
          placeholder: "Yeni alt görev başlığı",
          className: "w-full h-9 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      ) })
    ] }),
    c.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz alt görev yok." })
  ] });
}
function ja() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function hs(t) {
  const a = ja();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function gs(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, i = Ma();
  i && (r.RequestVerificationToken = i);
  const l = await fetch(`/api/tasks/attachments/upload/${t}`, {
    method: "POST",
    credentials: "include",
    headers: r,
    body: s
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
function vt(t) {
  const a = ae(), s = ["task-attachments", t], r = ne({
    queryKey: s,
    queryFn: () => hs(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), l = oe({
    mutationFn: (n) => gs(t, n),
    onSuccess: i
  }), o = oe({
    mutationFn: (n) => Promise.resolve(ja().deleteAttachment(n)),
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
function ys({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: i } = vt(t), l = ae(), o = h.useRef(null), [n, c] = h.useState(!1), d = Xe("Platform.Tasks.ShareExternally"), b = async (u, x) => {
    var g, m, j;
    try {
      await window.apya.platform.tasks.taskShare.setAttachmentGuestVisibility(u, x), l.invalidateQueries({ queryKey: ["task-attachments", t] });
    } catch (k) {
      (j = (m = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : m.error) == null || j.call(m, (k == null ? void 0 : k.message) || "Görünürlük değiştirilemedi.");
    }
  }, p = async (u) => {
    var x, g, m, j, k, T;
    if (u)
      try {
        await s(u), (m = (g = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : g.success) == null || m.call(g, "Dosya yüklendi.");
      } catch ($) {
        (T = (k = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : k.error) == null || T.call(k, ($ == null ? void 0 : $.message) || "Dosya yüklenemedi.");
      } finally {
        o.current && (o.current.value = "");
      }
  }, f = async (u, x) => {
    var g, m, j;
    try {
      await r(u);
    } catch (k) {
      (j = (m = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : m.error) == null || j.call(m, (k == null ? void 0 : k.message) || `${x} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: o,
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
          return (u = o.current) == null ? void 0 : u.click();
        },
        onKeyDown: (u) => {
          var x;
          u.key === "Enter" && ((x = o.current) == null || x.click());
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
      const x = va(u.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${x.bg} ${x.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: u.fileName, children: u.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: ya(u.fileSize) })
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
                    onClick: () => f(u.id, u.fileName),
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
function Ve() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function vs(t) {
  const a = Ve();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function jt(t) {
  const a = ae(), s = ["task-checklist", t], r = ne({
    queryKey: s,
    queryFn: () => vs(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), l = oe({
    mutationFn: (c) => Promise.resolve(Ve().addChecklistItem(t, c)),
    onSuccess: i
  }), o = oe({
    mutationFn: (c) => Promise.resolve(Ve().toggleChecklistItem(c)),
    onSuccess: i
  }), n = oe({
    mutationFn: (c) => Promise.resolve(Ve().deleteChecklistItem(c)),
    onSuccess: i
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: l.mutateAsync,
    toggleItem: o.mutateAsync,
    removeItem: n.mutateAsync
  };
}
function js({ taskId: t }) {
  const { items: a, isLoading: s, addItem: r, toggleItem: i, removeItem: l } = jt(t), [o, n] = h.useState(""), c = a.filter((p) => p.isDone).length, d = a.length ? Math.round(c / a.length * 100) : 0, b = async () => {
    var f, u, x;
    const p = o.trim();
    if (!(!p || !t)) {
      n("");
      try {
        await r(p);
      } catch (g) {
        n(p), (x = (u = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : u.error) == null || x.call(u, (g == null ? void 0 : g.message) || "Madde eklenemedi.");
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
            onClick: () => i(p.id).catch((f) => {
              var u, x, g;
              return (g = (x = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : x.error) == null ? void 0 : g.call(x, (f == null ? void 0 : f.message) || "Durum güncellenemedi.");
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
            onClick: () => l(p.id).catch((f) => {
              var u, x, g;
              return (g = (x = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : x.error) == null ? void 0 : g.call(x, (f == null ? void 0 : f.message) || "Madde silinemedi.");
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
          value: o,
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
function Ns({ taskId: t, task: a }) {
  const [s, r] = h.useState(""), [i, l] = h.useState(null), [o, n] = h.useState(""), [c, d] = h.useState(!1), b = ae(), p = (a == null ? void 0 : a.comments) ?? [], f = async (x) => {
    var g, m, j, k, T, $;
    if (x == null || x.preventDefault(), !(!s.trim() || c)) {
      d(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), b.invalidateQueries({ queryKey: ["task-detail", t] }), (j = (m = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : m.success) == null || j.call(m, "Yorum eklendi.");
      } catch (I) {
        ($ = (T = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : T.error) == null || $.call(T, (I == null ? void 0 : I.message) || "Yorum eklenemedi.");
      } finally {
        d(!1);
      }
    }
  }, u = async (x) => {
    var g, m, j, k, T, $;
    if (!(!o.trim() || c)) {
      d(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(x, o.trim())
        ), n(""), l(null), b.invalidateQueries({ queryKey: ["task-detail", t] }), (j = (m = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : m.success) == null || j.call(m, "Yanıt eklendi.");
      } catch (I) {
        ($ = (T = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : T.error) == null || $.call(T, (I == null ? void 0 : I.message) || "Yanıt eklenemedi.");
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
          onChange: (x) => r(x.target.value),
          placeholder: "Bir yorum veya güncelleme yazın...",
          className: "w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ e.jsx(
        se,
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
        se,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => l(i === x.id ? null : x.id),
          children: "Yanıtla"
        }
      ) }),
      i === x.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: o,
            onChange: (g) => n(g.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(se, { variant: "ghost", size: "sm", onClick: () => l(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(se, { variant: "primary", size: "sm", disabled: !o.trim() || c, onClick: () => u(x.id), children: "Gönder" })
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
function rt() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.taskShare) ?? null;
}
function ws(t) {
  const a = ae(), s = ["task-share-links", t], r = ne({
    queryKey: s,
    queryFn: () => {
      const n = rt();
      return n ? Promise.resolve(n.getList(t)) : Promise.reject(new Error("Paylaşım servisi yüklenmedi."));
    },
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), l = oe({
    mutationFn: (n) => Promise.resolve(rt().create({ ...n, taskId: t })),
    onSuccess: i
  }), o = oe({
    mutationFn: (n) => Promise.resolve(rt().revoke(n)),
    onSuccess: i
  });
  return {
    links: r.data ?? [],
    /* isLoading DEĞİL isPending: kalıcı önbellek geri yüklenirken isLoading
       FALSE döner ama liste henüz yoktur; sekme o karede "henüz kimseyle
       paylaşılmadı" yazıyordu — paylaşımı olan görevde bile. */
    isPending: r.isPending,
    error: r.error,
    create: l.mutateAsync,
    revoke: o.mutateAsync,
    isCreating: l.isPending
  };
}
const Rt = {
  recipientName: "",
  recipientEmail: "",
  lifetimeDays: 14,
  allowComment: !0,
  allowUpload: !0,
  allowDownload: !0
};
function ks(t) {
  return t ? new Date(t).toLocaleDateString("tr-TR") : "—";
}
function Ds({ taskId: t }) {
  const { links: a, isPending: s, create: r, revoke: i, isCreating: l } = ws(t), [o, n] = h.useState(Rt), [c, d] = h.useState(null);
  if (!Xe("Platform.Tasks.ShareExternally"))
    return /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Görevi ekip dışıyla paylaşma yetkiniz yok." });
  const p = (m) => (j) => {
    const k = j.target.type === "checkbox" ? j.target.checked : j.target.value;
    n((T) => ({ ...T, [m]: k }));
  }, f = async (m) => {
    var j, k, T;
    if (m.preventDefault(), !!o.recipientName.trim())
      try {
        const $ = await r({
          ...o,
          lifetimeDays: Number(o.lifetimeDays) || 14
        });
        d($), n(Rt);
      } catch ($) {
        (T = (k = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : k.error) == null || T.call(k, ($ == null ? void 0 : $.message) || "Paylaşım linki üretilemedi.");
      }
  }, u = (m) => `${window.location.origin}${m}`, x = (m) => {
    var j, k, T, $;
    (j = navigator.clipboard) == null || j.writeText(u(m)), ($ = (T = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : T.info) == null || $.call(T, "Bağlantı kopyalandı.");
  }, g = async (m) => {
    var j, k, T;
    try {
      await i(m);
    } catch ($) {
      (T = (k = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : k.error) == null || T.call(k, ($ == null ? void 0 : $.message) || "Bağlantı iptal edilemedi.");
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
    /* @__PURE__ */ e.jsxs("form", { onSubmit: f, className: "flex flex-col gap-2.5 rounded-[14px] border border-subtle bg-surface-base p-3.5", children: [
      /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary", children: "Yeni paylaşım bağlantısı" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2.5", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            required: !0,
            value: o.recipientName,
            onChange: p("recipientName"),
            placeholder: "Kime? (ad soyad)",
            className: "min-w-0 flex-[2_1_180px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "email",
            value: o.recipientEmail,
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
            value: o.lifetimeDays,
            onChange: p("lifetimeDays"),
            title: "Geçerlilik (gün)",
            className: "w-[92px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: o.allowComment, onChange: p("allowComment") }),
          "Yorum yazabilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: o.allowUpload, onChange: p("allowUpload") }),
          "Dosya yükleyebilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: o.allowDownload, onChange: p("allowDownload") }),
          "Dosya indirebilsin"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: "Bağlantı bu görevi ve alt görevlerini açar. Ekip içi yorumlar gösterilmez." }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "submit",
            disabled: l,
            className: "shrink-0 rounded-[8px] bg-primary px-3.5 py-2 text-[12px] font-bold text-white cursor-pointer disabled:opacity-60",
            children: l ? "Üretiliyor…" : "Bağlantı üret"
          }
        )
      ] })
    ] }),
    s ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görev henüz kimseyle paylaşılmadı." }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: a.map((m) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-subtle bg-surface-base p-3",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "truncate text-[12.5px] font-bold text-text-primary", children: [
              m.recipientName,
              m.recipientEmail ? /* @__PURE__ */ e.jsxs("span", { className: "font-normal text-text-tertiary", children: [
                " · ",
                m.recipientEmail
              ] }) : null
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "text-[11.5px] text-text-tertiary", children: [
              m.isActive ? `${ks(m.expiresAt)} tarihine kadar geçerli` : m.revokedAt ? "İptal edildi" : "Süresi doldu",
              " · ",
              m.accessCount,
              " erişim",
              " · ",
              m.uploadCount,
              " dosya"
            ] })
          ] }),
          m.isActive && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => g(m.id),
              className: "shrink-0 rounded-[8px] px-3 py-1.5 text-[12px] font-bold text-text-negative cursor-pointer hover:bg-negative-subtle",
              children: "İptal et"
            }
          )
        ]
      },
      m.id
    )) })
  ] });
}
function Cs({ task: t }) {
  var s;
  const a = [];
  return t != null && t.creationTime && a.push({
    id: "created",
    icon: "fa-plus",
    bg: "bg-success-subtle",
    fg: "text-success",
    actor: t.creatorUserName || t.creatorName || "Sistem / Kullanıcı",
    event: "görevi oluşturdu",
    time: Kt(t.creationTime)
  }), t != null && t.lastModificationTime && a.push({
    id: "modified",
    icon: "fa-pen",
    bg: "bg-warning-subtle",
    fg: "text-warning",
    actor: t.lastModifierUserName || t.lastModifierName || "Kullanıcı",
    event: "görevi güncelledi",
    time: Kt(t.lastModificationTime)
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
      const l = i === a.length - 1;
      return /* @__PURE__ */ e.jsxs("div", { className: `flex items-start gap-3.5 ${l ? "" : "pb-[18px]"}`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center shrink-0 self-stretch", children: [
          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-7 w-7 rounded-full ${r.bg} ${r.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r.icon} text-[11px]` }) }),
          !l && /* @__PURE__ */ e.jsx("span", { className: "flex-1 w-0.5 mt-1.5 rounded-sm bg-subtle" })
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
function Ts({ label: t, value: a, hint: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4 px-3.5 py-3", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[12.5px] font-semibold text-text-secondary", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 text-right", children: [
      /* @__PURE__ */ e.jsx("span", { className: "block text-[12.5px] font-bold text-text-primary break-words", children: a ?? "—" }),
      s && /* @__PURE__ */ e.jsx("span", { className: "block text-[11px] text-text-tertiary", children: s })
    ] })
  ] });
}
function Ss({ task: t = {}, nameById: a }) {
  const s = (i) => {
    var l;
    return i && ((l = a == null ? void 0 : a.get) == null ? void 0 : l.call(a, i)) || null;
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
      /* @__PURE__ */ e.jsx("div", { className: "divide-y divide-subtle", children: r.map((i) => /* @__PURE__ */ e.jsx(Ts, { ...i }, i.label)) })
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11.5px] text-text-tertiary", children: "Alan bazında değişiklik günlüğü (hangi alan, eski/yeni değer) henüz yayınlanmadı." })
  ] });
}
function we(t, a) {
  const s = a || "TRY";
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: s, minimumFractionDigits: 2 }).format(t || 0);
  } catch {
    return `${(t || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${s}`.trim();
  }
}
function nt({ label: t, value: a, tone: s, note: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: `font-mono text-[22px] font-bold tracking-[-.02em] ${s}`, style: { fontVariantNumeric: "tabular-nums" }, children: a }),
    r && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
  ] });
}
function $s({ task: t, spentByCurrency: a }) {
  const s = t == null ? void 0 : t.plannedAmount;
  if (!(t != null && t.budgetLineId) || s == null)
    return null;
  const r = a, i = s - r, l = s > 0 ? Math.round(r / s * 100) : 0, o = i < 0;
  return /* @__PURE__ */ e.jsxs("div", { className: ke, children: [
    /* @__PURE__ */ e.jsx(Je, { title: "Bütçe bağı" }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-4 pb-4 pt-1 flex flex-col gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-semibold text-accent", children: t.budgetLineName || "Bütçe kalemi" }),
        t.budgetLineRemaining != null && /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "kalemde kalan ",
          we(t.budgetLineRemaining, "TRY")
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3", children: [
        /* @__PURE__ */ e.jsx(it, { label: "Görev bütçesi", value: we(s, "TRY") }),
        /* @__PURE__ */ e.jsx(it, { label: "Gerçekleşen", value: we(r, "TRY") }),
        /* @__PURE__ */ e.jsx(
          it,
          {
            label: "Kalan",
            value: we(i, "TRY"),
            tone: o ? "text-negative" : "text-success"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: `h-full rounded-full ${o ? "bg-negative" : l >= 80 ? "bg-warning" : "bg-success"}`,
            style: { width: `${Math.min(Math.max(l, 0), 100)}%` }
          }
        ) }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-1 text-[11.5px] text-text-tertiary", children: [
          "%",
          l,
          o && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative", children: "· görev bütçesi aşıldı" })
        ] })
      ] })
    ] })
  ] });
}
function it({ label: t, value: a, tone: s }) {
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
function Es({ task: t }) {
  const a = (t == null ? void 0 : t.expenses) || [], s = (t == null ? void 0 : t.incomes) || [], r = a.filter((c) => (c.currency || "TRY") === "TRY").reduce((c, d) => c + (d.amount || 0), 0), i = /* @__PURE__ */ e.jsx($s, { task: t, spentByCurrency: r });
  if (a.length === 0 && s.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      i,
      /* @__PURE__ */ e.jsxs("div", { className: ke, children: [
        /* @__PURE__ */ e.jsx(Je, { title: "Görev Finansı" }),
        /* @__PURE__ */ e.jsx(
          De,
          {
            icon: "fa-coins",
            title: "Kayıt yok",
            description: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
          }
        )
      ] })
    ] });
  const o = Array.from(new Set([...a, ...s].map((c) => c.currency || "TRY"))).map((c) => {
    const d = s.filter((p) => (p.currency || "TRY") === c).reduce((p, f) => p + (f.amount || 0), 0), b = a.filter((p) => (p.currency || "TRY") === c).reduce((p, f) => p + (f.amount || 0), 0);
    return { cur: c, inc: d, exp: b, net: d - b };
  }), n = [
    ...s.map((c) => ({ ...c, kind: "income" })),
    ...a.map((c) => ({ ...c, kind: "expense" }))
  ].sort((c, d) => new Date(d.date || 0) - new Date(c.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    i,
    o.map(({ cur: c, inc: d, exp: b, net: p }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(nt, { label: `Toplam Gelir (${c})`, value: we(d, c), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(nt, { label: `Toplam Gider (${c})`, value: we(b, c), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        nt,
        {
          label: `Net Bakiye (${c})`,
          value: we(p, c),
          tone: p >= 0 ? "text-success" : "text-negative",
          note: p >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, c)),
    /* @__PURE__ */ e.jsxs("div", { className: ke, children: [
      /* @__PURE__ */ e.jsx(Je, { title: "Finans kalemleri" }),
      n.map((c) => /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-7 w-7 rounded-lg bg-neutral-subtle text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c.kind === "income" ? "fa-arrow-down" : "fa-arrow-up"} text-[11px]` }) }),
            /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] font-semibold text-text-primary", children: c.title || (c.kind === "income" ? "Gelir" : "Gider") }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: at(c.date) }),
            c.kind === "income" ? /* @__PURE__ */ e.jsx(ze, { bg: "bg-success-subtle", fg: "text-success", children: "Gelir" }) : /* @__PURE__ */ e.jsx(ze, { bg: "bg-warning-subtle", fg: "text-warning", children: "Gider" }),
            /* @__PURE__ */ e.jsxs(
              "span",
              {
                className: `shrink-0 font-mono text-[12.5px] font-bold ${c.kind === "income" ? "text-success" : "text-text-primary"}`,
                style: { fontVariantNumeric: "tabular-nums" },
                children: [
                  c.kind === "income" ? "+" : "−",
                  we(c.amount, c.currency)
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
function Ps({ taskId: t }) {
  const { attachments: a, isLoading: s, upload: r, remove: i, isUploading: l } = vt(t), o = h.useRef(null), [n, c] = h.useState(!1), d = a.filter((f) => Mt(f.fileName)), b = async (f) => {
    var u, x, g, m, j, k, T, $, I;
    if (f) {
      if (!Mt(f.name)) {
        (g = (x = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : x.error) == null || g.call(x, "Galeriye yalnız görsel dosya yüklenebilir.");
        return;
      }
      try {
        await r(f), (k = (j = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : j.success) == null || k.call(j, "Görsel yüklendi.");
      } catch (z) {
        (I = ($ = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : $.error) == null || I.call($, (z == null ? void 0 : z.message) || "Görsel yüklenemedi.");
      } finally {
        o.current && (o.current.value = "");
      }
    }
  }, p = async (f, u) => {
    var x, g, m;
    try {
      await i(f);
    } catch (j) {
      (m = (g = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : g.error) == null || m.call(g, (j == null ? void 0 : j.message) || `${u} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: o,
        type: "file",
        accept: "image/*",
        className: "hidden",
        onChange: (f) => {
          var u;
          return b((u = f.target.files) == null ? void 0 : u[0]);
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
          var f;
          return (f = o.current) == null ? void 0 : f.click();
        },
        onKeyDown: (f) => {
          var u;
          f.key === "Enter" && ((u = o.current) == null || u.click());
        },
        onDragOver: (f) => {
          f.preventDefault(), n || c(!0);
        },
        onDragLeave: () => c(!1),
        onDrop: (f) => {
          var u, x;
          f.preventDefault(), c(!1), b((x = (u = f.dataTransfer) == null ? void 0 : u.files) == null ? void 0 : x[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${n ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l ? "fa-circle-notch fa-spin" : "fa-images"} text-[26px] ${n ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: l ? "Yükleniyor…" : n ? "Bırakın, yükleyelim" : "Görselleri buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, JPG, GIF, WEBP, SVG · max 25MB" })
        ]
      }
    ),
    s && d.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !s && d.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görevde henüz görsel yok. Yüklediğiniz görseller Dosyalar sekmesinde de görünür." }),
    d.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3", children: d.map((f) => /* @__PURE__ */ e.jsxs(
      "figure",
      {
        className: "group relative m-0 flex flex-col overflow-hidden rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
        children: [
          /* @__PURE__ */ e.jsx(
            "a",
            {
              href: f.downloadUrl,
              target: "_blank",
              rel: "noreferrer",
              title: `${f.fileName} — tam boyutta aç`,
              className: "block aspect-[4/3] overflow-hidden bg-neutral-subtle",
              children: /* @__PURE__ */ e.jsx(
                "img",
                {
                  src: f.downloadUrl,
                  alt: f.fileName,
                  loading: "lazy",
                  className: "h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                }
              )
            }
          ),
          /* @__PURE__ */ e.jsxs("figcaption", { className: "flex items-center justify-between gap-2 p-2.5", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12px] font-bold text-text-primary", title: f.fileName, children: f.fileName }),
              /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: ya(f.fileSize) })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                title: "Sil",
                "aria-label": `${f.fileName} gorselini sil`,
                onClick: () => p(f.id, f.fileName),
                className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
              }
            )
          ] })
        ]
      },
      f.id
    )) })
  ] });
}
const As = [
  { key: "title", label: "Başlık", align: "left" },
  { key: "status", label: "Durum", align: "left" },
  { key: "priority", label: "Öncelik", align: "left" },
  { key: "assignee", label: "Atanan", align: "left" },
  { key: "dueDate", label: "Termin", align: "right" }
];
function Ft(t, a) {
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
function zs(t, a, s, r) {
  const i = Ft(t, s), l = Ft(a, s), o = i === null || i === "", n = l === null || l === "";
  return o && n ? 0 : o ? 1 : n ? -1 : i === l ? 0 : (i < l ? -1 : 1) * (r === "asc" ? 1 : -1);
}
function Ls({ task: t = {}, onOpenSubtask: a }) {
  const [s, r] = h.useState({ key: "dueDate", dir: "asc" }), i = (t == null ? void 0 : t.subTasks) ?? [], l = h.useMemo(
    () => [...i].sort((n, c) => zs(n, c, s.key, s.dir)),
    [i, s.key, s.dir]
  ), o = (n) => r((c) => c.key === n ? { key: n, dir: c.dir === "asc" ? "desc" : "asc" } : { key: n, dir: "asc" });
  return i.length === 0 ? /* @__PURE__ */ e.jsx(
    De,
    {
      icon: "fa-table",
      title: "Alt görev yok",
      description: "Alt Görevler sekmesinden ekledikleriniz burada tablo olarak listelenir."
    }
  ) : /* @__PURE__ */ e.jsx("div", { className: `${ke} overflow-x-auto`, children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse text-[12.5px]", children: [
    /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsx("tr", { className: "bg-surface-raised", children: As.map((n) => {
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
              onClick: () => o(n.key),
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
    /* @__PURE__ */ e.jsx("tbody", { children: l.map((n) => {
      const c = pe(n.status), d = et(n.priority), b = ga(n.dueDate);
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
              /* @__PURE__ */ e.jsx(tt, { name: n.assigneeName, size: 22 }),
              /* @__PURE__ */ e.jsx("span", { className: "truncate text-text-secondary", children: n.assigneeName })
            ] }) : /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: "Atanmadı" }) }),
            /* @__PURE__ */ e.jsxs("td", { className: `px-3.5 py-2.5 text-right whitespace-nowrap ${b.tone}`, children: [
              n.dueDate ? at(n.dueDate) : "—",
              b.hint && /* @__PURE__ */ e.jsx("div", { className: "text-[11px]", children: b.hint })
            ] })
          ]
        },
        n.id
      );
    }) })
  ] }) });
}
function Bs({ taskId: t, task: a = {}, onOpenSubtask: s }) {
  const r = ae(), i = (a == null ? void 0 : a.subTasks) ?? [], [l, o] = h.useState(null), [n, c] = h.useState(null), d = async (b, p) => {
    var u, x, g;
    const f = i.find((m) => m.id === b);
    if (!(!f || f.status === p)) {
      c(b);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.updateStatus(b, p)), await r.invalidateQueries({ queryKey: ["task-detail", t] });
      } catch (m) {
        (g = (x = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : x.error) == null || g.call(x, (m == null ? void 0 : m.message) || "Alt görev durumu güncellenemedi.");
      } finally {
        c(null);
      }
    }
  };
  return i.length === 0 ? /* @__PURE__ */ e.jsx(
    De,
    {
      icon: "fa-table-columns",
      title: "Alt görev yok",
      description: "Alt Görevler sekmesinden ekledikleriniz burada duruma göre sütunlanır."
    }
  ) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(4,minmax(190px,1fr))] lt-1080:grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 items-start", children: Ze.map((b) => {
    const p = pe(b), f = i.filter((x) => x.status === b), u = l === b;
    return /* @__PURE__ */ e.jsxs(
      "section",
      {
        "aria-label": `${p.label} sütunu`,
        onDragOver: (x) => {
          x.preventDefault(), l !== b && o(b);
        },
        onDragLeave: () => o((x) => x === b ? null : x),
        onDrop: (x) => {
          var m;
          x.preventDefault(), o(null);
          const g = (m = x.dataTransfer) == null ? void 0 : m.getData("text/plain");
          g && d(g, b);
        },
        className: `flex flex-col gap-2 p-2.5 rounded-2xl border bg-surface-raised min-h-[120px] transition-colors duration-fast ${u ? "border-focus bg-primary-subtle" : "border-subtle"}`,
        children: [
          /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-2 px-1", children: [
            /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${p.dot}` }),
            /* @__PURE__ */ e.jsx("h3", { className: "m-0 flex-1 text-[12px] font-bold text-text-primary", children: p.label }),
            /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: f.length })
          ] }),
          f.map((x) => {
            const g = et(x.priority);
            return /* @__PURE__ */ e.jsxs(
              "article",
              {
                draggable: !0,
                onDragStart: (m) => {
                  var j;
                  return (j = m.dataTransfer) == null ? void 0 : j.setData("text/plain", x.id);
                },
                role: "button",
                tabIndex: 0,
                onClick: () => s == null ? void 0 : s(x.id),
                onKeyDown: (m) => {
                  m.key === "Enter" && (s == null || s(x.id));
                },
                className: `flex flex-col gap-2 p-2.5 rounded-[12px] border border-subtle bg-surface-base shadow-xs cursor-pointer hover:border-focus hover:shadow-md ${n === x.id ? "opacity-60" : ""}`,
                children: [
                  /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary line-clamp-2", children: x.title }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ e.jsxs("span", { className: `text-[10.5px] font-bold ${g.fg}`, children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${g.icon} text-[9px] mr-1` }),
                      g.label
                    ] }),
                    x.dueDate && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: at(x.dueDate) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2 border-t border-subtle", children: [
                    x.assigneeName ? /* @__PURE__ */ e.jsx(tt, { name: x.assigneeName, size: 20 }) : /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] text-text-tertiary", children: "Atanmadı" }),
                    /* @__PURE__ */ e.jsx(
                      "select",
                      {
                        "aria-label": `${x.title} durumunu değiştir`,
                        value: x.status,
                        onClick: (m) => m.stopPropagation(),
                        onChange: (m) => d(x.id, Number(m.target.value)),
                        className: "h-[24px] px-1.5 rounded-[6px] border border-subtle bg-surface-base text-[10.5px] text-text-secondary cursor-pointer",
                        children: Ze.map((m) => /* @__PURE__ */ e.jsx("option", { value: m, children: pe(m).label }, m))
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
], Ks = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], Gt = (t) => String(t).padStart(2, "0"), Na = (t, a, s) => `${t}-${Gt(a + 1)}-${Gt(s)}`;
function ht(t) {
  if (!t) return null;
  const a = /^(\d{4}-\d{2}-\d{2})/.exec(String(t));
  return a ? a[1] : null;
}
function Ms(t, a) {
  const r = (new Date(t, a, 1).getDay() + 6) % 7, i = new Date(t, a + 1, 0).getDate(), l = [];
  for (let o = 0; o < 42; o++) {
    const n = o - r + 1;
    l.push(n >= 1 && n <= i ? { key: Na(t, a, n), day: n, inMonth: !0 } : { key: `bos-${o}`, day: null, inMonth: !1 });
  }
  return l;
}
function Rs(t) {
  const a = /* @__PURE__ */ new Map(), s = (r, i) => {
    const l = ht(r);
    l && (a.has(l) || a.set(l, []), a.get(l).push(i));
  };
  s(t == null ? void 0 : t.startDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "start", isSelf: !0, status: t == null ? void 0 : t.status }), s(t == null ? void 0 : t.dueDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "due", isSelf: !0, status: t == null ? void 0 : t.status });
  for (const r of (t == null ? void 0 : t.subTasks) ?? [])
    s(r.startDate, { id: r.id, title: r.title, kind: "start", isSelf: !1, status: r.status }), s(r.dueDate, { id: r.id, title: r.title, kind: "due", isSelf: !1, status: r.status });
  return a;
}
function Fs({ task: t = {}, onOpenSubtask: a }) {
  const s = h.useMemo(() => Rs(t), [t]), [r, i] = h.useState(() => {
    const d = ht(t == null ? void 0 : t.startDate) ?? ht(t == null ? void 0 : t.dueDate);
    if (d) {
      const [p, f] = d.split("-").map(Number);
      return { year: p, month: f - 1 };
    }
    const b = /* @__PURE__ */ new Date();
    return { year: b.getFullYear(), month: b.getMonth() };
  }), l = h.useMemo(() => Ms(r.year, r.month), [r.year, r.month]), o = (d) => i(({ year: b, month: p }) => {
    const f = p + d;
    return { year: b + Math.floor(f / 12), month: (f % 12 + 12) % 12 };
  }), n = /* @__PURE__ */ new Date(), c = Na(n.getFullYear(), n.getMonth(), n.getDate());
  return s.size === 0 ? /* @__PURE__ */ e.jsx(
    De,
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
            onClick: () => o(-1),
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
            onClick: () => o(1),
            className: "flex items-center justify-center h-7 w-7 rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-right text-[11px]" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-subtle bg-surface-raised", children: Ks.map((d) => /* @__PURE__ */ e.jsx("span", { className: "px-2 py-1.5 text-center text-[11px] font-bold text-text-tertiary", children: d }, d)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: l.map((d) => {
      const b = d.inMonth ? s.get(d.key) ?? [] : [], p = d.key === c;
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: `flex flex-col gap-1 min-h-[76px] p-1.5 border-r border-b border-subtle last-of-type:border-r-0 ${d.inMonth ? "" : "bg-surface-sunken"}`,
          children: [
            d.inMonth && /* @__PURE__ */ e.jsx("span", { className: `self-end font-mono text-[11px] font-bold ${p ? "flex items-center justify-center h-[18px] w-[18px] rounded-full bg-primary text-white" : "text-text-tertiary"}`, children: d.day }),
            b.map((f, u) => {
              const x = pe(f.status);
              return /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  title: `${f.title} — ${f.kind === "due" ? "termin" : "başlangıç"}`,
                  onClick: () => {
                    f.isSelf || a == null || a(f.id);
                  },
                  className: `flex items-center gap-1 w-full px-1.5 py-[3px] rounded-[6px] text-left text-[10.5px] font-semibold ${x.bg} ${x.fg} ${f.isSelf ? "cursor-default" : "cursor-pointer hover:brightness-95"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${f.kind === "due" ? "fa-flag-checkered" : "fa-play"} text-[8px] shrink-0` }),
                    /* @__PURE__ */ e.jsx("span", { className: "truncate", children: f.title })
                  ]
                },
                `${f.id}-${f.kind}-${u}`
              );
            })
          ]
        },
        d.key
      );
    }) })
  ] });
}
const Gs = {
  0: "bg-neutral-400",
  1: "bg-text-tertiary",
  2: "bg-warning",
  3: "bg-primary",
  4: "bg-success"
};
function lt(t) {
  if (!t) return null;
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? null : a;
}
const Ie = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
function qs({ task: t = {} }) {
  const a = h.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((o, n) => ({
    id: o.id || `row-${n}`,
    name: o.title || "Başlıksız görev",
    isMain: !!o.__main,
    start: lt(o.startDate),
    end: lt(o.dueDate) || lt(o.completedDate),
    status: o.status ?? 1
  })), [t]), { min: s, span: r } = h.useMemo(() => {
    const l = a.flatMap((c) => [c.start, c.end]).filter(Boolean).map((c) => c.getTime());
    if (l.length === 0) return { min: null, span: 0 };
    const o = Math.min(...l), n = Math.max(...l);
    return { min: o, span: Math.max(1, n - o) };
  }, [a]), i = h.useMemo(() => s === null ? [] : [0, 1, 2, 3].map((l) => new Date(s + r * l / 4)), [s, r]);
  return s === null ? /* @__PURE__ */ e.jsx("div", { className: ke, children: /* @__PURE__ */ e.jsx(
    De,
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-4 gap-0 pl-[170px] mb-2 lt-860:pl-[110px]", children: i.map((l, o) => /* @__PURE__ */ e.jsx(
      "span",
      {
        className: "pl-2 border-l border-subtle text-[10.5px] font-bold uppercase tracking-[.06em] text-text-tertiary",
        children: Ie(l)
      },
      o
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: a.map((l) => {
      const o = l.start ? l.start.getTime() : s, n = l.end ? Math.max(l.end.getTime(), o) : o, c = (o - s) / r * 100, d = Math.max(2, (n - o) / r * 100), b = Math.max(1, Math.round((n - o) / 864e5));
      return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-0 h-9", children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            className: `w-[170px] lt-860:w-[110px] shrink-0 pr-3 truncate text-[12.5px] ${l.isMain ? "font-bold text-text-primary" : "font-semibold text-text-secondary"}`,
            title: l.name,
            children: l.name
          }
        ),
        /* @__PURE__ */ e.jsx("div", { className: "relative flex-1 h-full rounded-lg bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: `absolute top-[7px] bottom-[7px] flex items-center px-2.5 rounded-[7px] shadow-xs ${Gs[l.status] || "bg-primary"}`,
            style: { left: `${c}%`, width: `${d}%` },
            title: `${Ie(l.start)} – ${Ie(l.end)}`,
            children: /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[10.5px] font-bold text-white", children: [
              b,
              "g"
            ] })
          }
        ) })
      ] }, l.id);
    }) })
  ] });
}
function qt({ icon: t, iconTone: a, title: s, note: r, children: i }) {
  return /* @__PURE__ */ e.jsxs("div", { className: ke, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[12px] ${a}` }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: s }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
    ] }),
    i
  ] });
}
function Ys({ task: t = {} }) {
  const a = ae(), s = t.predecessorIds || [], r = () => {
    var c, d, b;
    return (b = (d = (c = window == null ? void 0 : window.apya) == null ? void 0 : c.platform) == null ? void 0 : d.tasks) == null ? void 0 : b.task;
  }, { data: i = [], isLoading: l } = ne({
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
  }), o = async (c) => {
    var d, b, p, f, u, x;
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
      (x = (u = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : u.error) == null || x.call(u, (g == null ? void 0 : g.message) || "Bağlantı kaldırılamadı.");
    }
  }, n = (c) => {
    var d, b, p;
    return (p = (b = (d = window == null ? void 0 : window.apya) == null ? void 0 : d.taskDetail) == null ? void 0 : b.open) == null ? void 0 : p.call(b, c);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsx(
      qt,
      {
        icon: "fa-arrow-left-long",
        iconTone: "text-warning",
        title: "Öncül görevler",
        note: "bu görev başlamadan tamamlanmalı",
        children: s.length === 0 ? /* @__PURE__ */ e.jsx(De, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : l ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : i.map((c) => {
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
                    onClick: () => o(c.id),
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
      qt,
      {
        icon: "fa-arrow-right-long",
        iconTone: "text-primary",
        title: "Ardıl görevler",
        note: "bu görev bitince başlar",
        children: /* @__PURE__ */ e.jsx(
          De,
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
function Us(t) {
  const a = ae(), s = ["task-timelogs", t], r = ["task-active-timelog"], i = ne({
    queryKey: s,
    queryFn: () => {
      var d;
      return Promise.resolve((d = Pe()) == null ? void 0 : d.getTimeLogs(t));
    },
    enabled: !!t && !!Pe(),
    staleTime: 15e3,
    retry: !1
  }), l = ne({
    queryKey: r,
    queryFn: () => {
      var d;
      return Promise.resolve((d = Pe()) == null ? void 0 : d.getActiveTimeLog());
    },
    enabled: !!Pe(),
    staleTime: 5e3,
    retry: !1
  }), o = () => {
    a.invalidateQueries({ queryKey: s }), a.invalidateQueries({ queryKey: r });
  }, n = oe({
    mutationFn: () => {
      var d;
      return Promise.resolve((d = Pe()) == null ? void 0 : d.startTimeTracking(t));
    },
    onSuccess: o
  }), c = oe({
    mutationFn: () => {
      var d;
      return Promise.resolve((d = Pe()) == null ? void 0 : d.stopTimeTracking(t));
    },
    onSuccess: o
  });
  return {
    logs: i.data ?? [],
    isLoading: i.isLoading,
    activeLog: l.data ?? null,
    start: n.mutateAsync,
    stop: c.mutateAsync,
    isMutating: n.isPending || c.isPending
  };
}
function Yt(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function _s({ taskId: t, task: a = {} }) {
  const s = Us(t), r = s.activeLog && s.activeLog.taskId === t ? s.activeLog : null, [i, l] = h.useState(() => Date.now());
  h.useEffect(() => {
    if (!r) return;
    const x = setInterval(() => l(Date.now()), 1e3);
    return () => clearInterval(x);
  }, [r]);
  const o = r ? Math.max(0, Math.floor((i - new Date(r.startTime).getTime()) / 1e3)) : 0, c = s.logs.reduce((x, g) => x + (g.secondsSpent || 0), 0) + o, d = (a == null ? void 0 : a.estimatedHours) ?? null, b = d ? d * 3600 : 0, p = b ? Math.min(100, Math.round(c / b * 100)) : 0, f = b ? Math.max(0, b - c) : 0, u = async () => {
    var x, g, m;
    try {
      r ? await s.stop() : await s.start();
    } catch (j) {
      (m = (g = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : g.error) == null || m.call(g, (j == null ? void 0 : j.message) || "Zaman takibi güncellenemedi.");
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
              children: fs(c)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary", children: r ? "Kayıt sürüyor" : "Sayaç duraklatıldı" })
        ] })
      ] }),
      b > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] font-bold text-text-secondary", children: "Tahmin kullanımı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
            st(c),
            " / ",
            d,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-warning", style: { width: `${p}%` } }) }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "Kalan tahmini süre: ",
          st(f)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: ke, children: [
      /* @__PURE__ */ e.jsx(Je, { title: "Zaman kayıtları" }),
      s.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : s.logs.length === 0 ? /* @__PURE__ */ e.jsx(
        De,
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
              /* @__PURE__ */ e.jsx(tt, { name: x.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: x.note || x.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                Yt(x.startTime),
                " → ",
                g ? "sürüyor" : Yt(x.endTime)
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary", children: g ? "Aktif" : st(x.secondsSpent || 0) })
            ]
          },
          x.id
        );
      })
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
    component: bs
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
    component: ys
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
    component: Ls
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
    component: Bs
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
    component: Fs
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
    component: js
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
    component: qs
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
    component: Ys
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
    component: Es
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
    component: Ss
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
    component: Cs,
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
    component: Ns,
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
    component: Ds
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
    component: _s
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
    code: "gallery",
    title: "Dosya Galerisi",
    icon: "fa-image",
    category: "finans",
    isCore: !1,
    order: 34,
    permission: null,
    implemented: !0,
    component: Ps
  }
];
function wa(t = []) {
  const a = new Set(t);
  return qe.filter((s) => !s.hidden).filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function Os(t = []) {
  const a = new Set(t);
  return qe.filter((s) => !s.hidden).filter((s) => !s.isCore).filter((s) => !s.permission || Xe(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let Ue = null;
const He = /* @__PURE__ */ new Set(), ot = /* @__PURE__ */ new Set();
function Ut() {
  He.forEach((t) => t());
}
function Vs(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const re = {
  open(t) {
    const a = Vs(t);
    a && (Ue = a, Ut());
  },
  close() {
    Ue = null, Ut();
  },
  subscribe(t) {
    return He.add(t), () => He.delete(t);
  },
  getSnapshot() {
    return Ue;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && ot.add(t);
  },
  emitResult() {
    ot.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    Ue = null, He.clear(), ot.clear();
  }
}, _t = "apya.taskDetail.fullscreen";
function ka({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, i] = h.useState(t), [l, o] = h.useState([]), { data: n, isPending: c, isError: d, refetch: b } = gt(r), p = xa(), f = fa(n), u = ba(), x = ha(r), [g, m] = h.useState("general"), [j, k] = h.useState(!1), T = Me.useRef(null), $ = h.useMemo(
    () => wa(x.assignedCodes),
    [x.assignedCodes]
  ), I = h.useMemo(
    () => Os(x.assignedCodes),
    [x.assignedCodes]
  ), z = $.find((A) => A.code === g) ?? $[0];
  Me.useEffect(() => {
    z.code !== g && m(z.code);
  }, [z, g]);
  const Z = z == null ? void 0 : z.component, R = ae(), [q, _] = h.useState(
    () => {
      var A;
      return ((A = window.localStorage) == null ? void 0 : A.getItem(_t)) === "1";
    }
  ), [K, O] = h.useState(!1), J = h.useCallback(() => {
    pa(), s == null || s();
  }, [s]);
  ma(t, J), Me.useEffect(() => {
    f.isDirty ? p.markDirty() : p.markClean();
  });
  const H = h.useCallback(() => p.requestClose(J), [p, J]), X = h.useCallback(() => {
    _((A) => {
      var G;
      const B = !A;
      return (G = window.localStorage) == null || G.setItem(_t, B ? "1" : "0"), B;
    });
  }, []), Y = Xe("Platform.Tasks.Delete"), [ee, N] = h.useState(!1), [v, y] = h.useState(!1), C = h.useCallback(async () => {
    var A, B, G, te, W, Ce;
    y(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (G = (B = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : B.info) == null || G.call(B, "Başarıyla silindi."), N(!1), p.markClean(), J();
    } catch (xe) {
      (Ce = (W = (te = window == null ? void 0 : window.abp) == null ? void 0 : te.notify) == null ? void 0 : W.error) == null || Ce.call(W, (xe == null ? void 0 : xe.message) || "Görev silinemedi.");
    } finally {
      y(!1);
    }
  }, [r, p, J]), E = h.useCallback(async () => {
    var A, B, G, te, W, Ce;
    if (!f.validate()) return !1;
    O(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, f.toUpdateDto())
      ), await R.invalidateQueries({ queryKey: ["task-detail", r] }), re.emitResult(), (G = (B = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : B.success) == null || G.call(B, "Kaydedildi."), !0;
    } catch (xe) {
      return (Ce = (W = (te = window == null ? void 0 : window.abp) == null ? void 0 : te.notify) == null ? void 0 : W.error) == null || Ce.call(W, (xe == null ? void 0 : xe.message) || "Kaydedilemedi."), !1;
    } finally {
      O(!1);
    }
  }, [r, f, p, R]), V = h.useCallback(() => {
    E();
  }, [E]), ce = h.useCallback(async () => {
    const A = p.resolvePendingClose("save");
    await E() && (A == null || A());
  }, [p, E]), w = h.useCallback((A, B) => {
    p.requestClose(() => {
      o((G) => [...G, { id: r, title: (n == null ? void 0 : n.title) ?? "" }]), i(A), m("general"), p.markClean();
    });
  }, [p, r, n]), L = h.useCallback((A) => {
    p.requestClose(() => {
      o((B) => {
        const G = B.findIndex((te) => te.id === A);
        return G === -1 ? B : B.slice(0, G);
      }), i(A), m("general"), p.markClean();
    });
  }, [p]), P = h.useCallback(async (A) => {
    var B, G, te;
    try {
      await x.addFeature(A), m(A), k(!1);
    } catch (W) {
      (te = (G = (B = window == null ? void 0 : window.abp) == null ? void 0 : B.notify) == null ? void 0 : G.error) == null || te.call(G, (W == null ? void 0 : W.message) || "Özellik eklenemedi.");
    }
  }, [x]), F = h.useCallback(async (A) => {
    var B, G, te;
    try {
      await x.removeFeature(A), m((W) => W === A ? "general" : W);
    } catch (W) {
      (te = (G = (B = window == null ? void 0 : window.abp) == null ? void 0 : B.notify) == null ? void 0 : G.error) == null || te.call(G, (W == null ? void 0 : W.message) || "Özellik kaldırılamadı.");
    }
  }, [x]);
  Me.useEffect(() => {
    if (!j) return;
    const A = (G) => {
      T.current && !T.current.contains(G.target) && k(!1);
    }, B = (G) => {
      G.key === "Escape" && k(!1);
    };
    return document.addEventListener("mousedown", A), document.addEventListener("keydown", B), () => {
      document.removeEventListener("mousedown", A), document.removeEventListener("keydown", B);
    };
  }, [j]);
  const U = c ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(ge, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(ge, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(ge, { className: "h-24 w-full" })
  ] }) : d ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(se, { variant: "ghost", onClick: () => b(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      is,
      {
        trail: l,
        current: { id: r, title: (n == null ? void 0 : n.title) ?? "" },
        onNavigate: L
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: T, children: [
      /* @__PURE__ */ e.jsx(
        ss,
        {
          tabs: $,
          activeCode: z.code,
          onSelect: (A) => {
            m(A), k(!1);
          },
          onOpenPicker: () => k((A) => !A),
          pickerOpen: j
        }
      ),
      j && /* @__PURE__ */ e.jsx(
        ns,
        {
          entries: I,
          busyCode: x.isMutating ? x.mutatingCode : null,
          onAdd: P,
          onRemove: F
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
            Xa,
            {
              values: f.values,
              errors: f.errors,
              onFieldChange: f.setField,
              assigneeOptions: u.options,
              isLoadingAssignees: u.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(h.Suspense, { fallback: /* @__PURE__ */ e.jsx(ge, { className: "h-24 w-full" }), children: Z && /* @__PURE__ */ e.jsx(
            Z,
            {
              taskId: r,
              task: n,
              onOpenSubtask: w
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            es,
            {
              task: n,
              creatorName: u.nameById.get(n.creatorId),
              lastModifierName: u.nameById.get(n.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), ie = a === "page" ? Oa : _a;
  return /* @__PURE__ */ e.jsxs(
    ie,
    {
      open: !0,
      fullscreen: q,
      onRequestClose: H,
      title: n ? `Görev Detayı: ${n.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        Ha,
        {
          task: n ?? { title: "Yükleniyor…" },
          canDelete: Y,
          fullscreen: q,
          onToggleFullscreen: X,
          onClose: H,
          onDelete: () => N(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        Wa,
        {
          lastSavedAt: n == null ? void 0 : n.lastModificationTime,
          isDirty: p.isDirty,
          isSaving: K,
          onCancel: H,
          onSave: V
        }
      ),
      children: [
        U,
        p.pendingClose && /* @__PURE__ */ e.jsx(
          Qs,
          {
            isSaving: K,
            onStay: () => p.resolvePendingClose("stay"),
            onDiscard: () => p.resolvePendingClose("discard"),
            onSaveAndClose: ce
          }
        ),
        ee && /* @__PURE__ */ e.jsx(
          Hs,
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
function Hs({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [i, l] = h.useState(""), o = i.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    Da,
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
        /* @__PURE__ */ e.jsx(se, { variant: "secondary", onClick: s, disabled: a, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          se,
          {
            variant: "destructive",
            onClick: r,
            disabled: !o,
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
            onChange: (n) => l(n.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function Da({ label: t, title: a, description: s, children: r, actions: i }) {
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
function Qs({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    Da,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(se, { variant: "secondary", onClick: a, disabled: t, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ e.jsx(se, { variant: "destructive", onClick: s, disabled: t, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ e.jsx(se, { variant: "primary", onClick: r, isLoading: t, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
function Se(t) {
  return (t == null ? void 0 : t.closest('[role="dialog"]')) ?? void 0;
}
const Ws = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function Zs({ isPrivate: t = !1, onChange: a = () => {
} }) {
  const s = !!t, [r, i] = h.useState(null);
  return /* @__PURE__ */ e.jsxs(ye, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(ve, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
    /* @__PURE__ */ e.jsx(je, { container: Se(r), children: /* @__PURE__ */ e.jsxs(
      Ne,
      {
        sideOffset: 8,
        align: "end",
        className: "z-50 w-[360px] rounded-2xl border border-subtle bg-surface-base p-4 shadow-float animate-in fade-in-50 zoom-in-95",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle pb-3 mb-3", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shield-halved text-primary text-base" }),
            /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary", children: "Görünürlük" })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: Ws.map((l) => {
            const o = s === l.value;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => a(l.value),
                className: `flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${o ? "border-primary bg-primary-subtle/40" : "border-subtle hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l.icon} text-base mt-0.5 ${o ? "text-primary" : "text-text-tertiary"}` }),
                  /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ e.jsx("h4", { className: "text-[13px] font-semibold text-text-primary", children: l.title }),
                      o && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ] }),
                    /* @__PURE__ */ e.jsx("p", { className: "text-[12px] text-text-tertiary mt-0.5", children: l.desc })
                  ] })
                ]
              },
              String(l.value)
            );
          }) }),
          /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-text-tertiary mt-3", children: "Değişiklik “Kaydet” ile uygulanır." }),
          /* @__PURE__ */ e.jsx(Ra, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const Ot = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto", Js = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", Xs = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" },
  { what: "Bağlantı kopyala", key: "⌘ L" }
];
function er({ children: t }) {
  return /* @__PURE__ */ e.jsx(ca, { asChild: !0, children: t });
}
function tr({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "inline-flex items-center h-[19px] px-1.5 rounded-[5px] border border-default border-b-2 bg-neutral-subtle font-mono text-[10px] font-semibold text-text-secondary", children: t });
}
function ar({
  task: t = {},
  presentation: a = "modal",
  onClose: s,
  isFullscreen: r,
  onToggleFullscreen: i,
  onFieldChange: l = () => {
  },
  statusValue: o,
  titleValue: n,
  isPrivateValue: c,
  isFavorite: d,
  onToggleFavorite: b,
  isWatched: p,
  onToggleWatch: f,
  onDuplicate: u,
  onArchive: x,
  onDelete: g,
  onOpenTransfer: m,
  onSaveAsTemplate: j,
  onConvertToSubtask: k,
  onExportPdf: T
}) {
  const [$, I] = h.useState(!1), [z, Z] = h.useState(null), [R, q] = h.useState(!1), _ = h.useRef(null), K = Se(z), O = pe(o ?? t.status), J = t.code || "GRV-—", H = () => {
    var N;
    (N = navigator.clipboard) == null || N.writeText(J), I(!0), setTimeout(() => I(!1), 1800);
  }, X = () => {
    var N, v, y, C;
    (N = navigator.clipboard) == null || N.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), (C = (y = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : y.success) == null || C.call(y, "Görev bağlantısı panoya kopyalandı.");
  }, Y = (N) => () => {
    q(!1), N == null || N();
  }, ee = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", kbd: "⌘L", onClick: Y(X) },
    { label: "Çoğalt", icon: "fa-copy", kbd: "⌘D", onClick: Y(u) },
    { label: "Başka projeye kopyala", icon: "fa-clone", onClick: Y(() => m == null ? void 0 : m("copy")) },
    { label: "Şablon olarak kaydet", icon: "fa-bookmark", onClick: Y(j) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, onClick: Y(() => m == null ? void 0 : m("move")) },
    { label: "Alt göreve dönüştür", icon: "fa-diagram-project", onClick: Y(k) },
    { label: p ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: Y(f) },
    { label: "Arşivle", icon: "fa-box-archive", separator: !0, onClick: Y(x) },
    { label: "Yazdır", icon: "fa-print", kbd: "⌘P", onClick: Y(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: Y(T) },
    { label: "Sil", icon: "fa-trash-can", kbd: "⌫", separator: !0, danger: !0, onClick: Y(g) }
  ];
  return /* @__PURE__ */ e.jsxs("header", { ref: Z, className: "shrink-0 px-6 lt-860:px-4 pt-[18px] pb-4 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: H,
            title: "Kodu kopyala",
            className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[11px] font-bold tracking-[.04em] cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[9px] opacity-70" }),
              /* @__PURE__ */ e.jsx("span", { children: J }),
              /* @__PURE__ */ e.jsx("i", { className: `${$ ? "fa-solid fa-check" : "fa-regular fa-copy"} text-[9px] opacity-60` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(ye, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(ve, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
          /* @__PURE__ */ e.jsx(je, { container: K, children: /* @__PURE__ */ e.jsxs(Ne, { sideOffset: 6, align: "start", className: `${Ot} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            Ze.map((N) => {
              const v = We[N], y = (o ?? t.status) === N;
              return /* @__PURE__ */ e.jsx(er, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => l("status", N),
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
          Zs,
          {
            isPrivate: c ?? !!t.isPrivate,
            onChange: (N) => l("isPrivate", N)
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
        /* @__PURE__ */ e.jsxs(ye, { modal: !0, open: R, onOpenChange: q, children: [
          /* @__PURE__ */ e.jsx(ve, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer seçenekler",
              className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${R ? "bg-surface-hover text-text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(je, { container: K, children: /* @__PURE__ */ e.jsxs(
            Ne,
            {
              sideOffset: 6,
              align: "end",
              collisionBoundary: K ?? [],
              collisionPadding: 12,
              className: `${Ot} w-[244px]`,
              children: [
                ee.map((N) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: N.onClick,
                    className: [
                      Js,
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
                  Xs.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: N.what }),
                    /* @__PURE__ */ e.jsx(tr, { children: N.key })
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
          ref: _,
          contentEditable: !0,
          suppressContentEditableWarning: !0,
          spellCheck: !1,
          onBlur: (N) => l("title", N.currentTarget.textContent.trim()),
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
const _e = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", Vt = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function be({ children: t }) {
  return /* @__PURE__ */ e.jsx(ca, { asChild: !0, children: t });
}
function ue({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[7px] min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.08em] text-text-tertiary select-none", children: t }),
    a
  ] });
}
function Ht({ name: t, size: a = 26 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Ge(t), fontSize: a * 0.38 },
      children: Fe(t)
    }
  );
}
function Qt(t) {
  if (t == null) return "—";
  const a = Math.max(0, Math.round(Number(t) * 60)), s = Math.floor(a / 60), r = a % 60;
  return s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function sr({
  task: t = {},
  assigneeOptions: a = [],
  projectOptions: s = [],
  onFieldChange: r = () => {
  },
  statusValue: i,
  priorityValue: l,
  assigneeValue: o,
  projectValue: n,
  dueDateValue: c,
  startDateValue: d,
  tagsValue: b = [],
  progressPercent: p = 0,
  progressNote: f = "",
  onOpenTransfer: u
}) {
  var N, v;
  const [x, g] = h.useState(""), [m, j] = h.useState(""), [k, T] = h.useState(""), [$, I] = h.useState(!1), [z, Z] = h.useState(null), R = pe(i ?? t.status), q = et(l ?? t.priority), _ = o ?? t.assigneeId ?? null, K = n ?? t.projectId ?? null, O = ((N = a.find((y) => y.value === _)) == null ? void 0 : N.label) || t.assigneeName || "Atanmamış", J = ((v = s.find((y) => y.value === K)) == null ? void 0 : v.label) || t.projectName || "Projesiz", H = ga(c ?? t.dueDate), X = a.filter(
    (y) => !x || y.label.toLowerCase().includes(x.toLowerCase())
  ), Y = s.filter(
    (y) => !m || y.label.toLowerCase().includes(m.toLowerCase())
  ), ee = () => {
    const y = k.trim();
    y && !b.includes(y) && r("tagNames", [...b, y]), T(""), I(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { ref: Z, className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6", children: [
    /* @__PURE__ */ e.jsx(ue, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(ye, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(ve, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx(Ht, { name: _ ? O : null }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: O }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(je, { container: Se(z), children: /* @__PURE__ */ e.jsxs(Ne, { sideOffset: 6, align: "start", className: `${_e} w-[264px]`, children: [
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
              className: Vt
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[230px] overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("assigneeId", null),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] text-left cursor-pointer ${_ ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary font-semibold"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex h-6 w-6 items-center justify-center rounded-full bg-neutral-subtle text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-user-slash text-[9px]" }) }),
                /* @__PURE__ */ e.jsx("span", { children: "Atanmamış" })
              ]
            }
          ) }),
          a.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-2 py-1.5 text-[12px] text-text-tertiary", children: "Kullanıcı listesi yükleniyor…" }),
          X.map((y) => /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("assigneeId", y.value),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${_ === y.value ? "bg-primary-subtle" : "hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx(Ht, { name: y.label, size: 24 }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: y.label }),
                _ === y.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
              ]
            }
          ) }, y.value))
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ e.jsxs(ue, { label: "Son tarih", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
        /* @__PURE__ */ e.jsx("i", { className: `fa-regular fa-calendar text-[13px] ${H.tone}` }),
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
      H.hint && /* @__PURE__ */ e.jsx("span", { className: `-mt-0.5 text-[10.5px] font-semibold ${H.tone}`, children: H.hint })
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
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-medium text-text-tertiary", children: f })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "h-1.5 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "h-full rounded-full bg-primary transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
          style: { width: `${p}%` }
        }
      ) })
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(ye, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(ve, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${R.bg} ${R.fg}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${R.icon} text-[11px]` }),
            /* @__PURE__ */ e.jsx("span", { children: R.label }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(je, { container: Se(z), children: /* @__PURE__ */ e.jsxs(Ne, { sideOffset: 6, align: "start", className: `${_e} w-[196px]`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
        Ze.map((y) => {
          const C = We[y], E = (i ?? t.status) === y;
          return /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("status", y),
              className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${E ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${C.dot}` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: C.label }),
                E && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
              ]
            }
          ) }, y);
        })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(ye, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(ve, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${q.bg} ${q.fg}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${q.icon} text-[11px]` }),
            /* @__PURE__ */ e.jsx("span", { children: q.label }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(je, { container: Se(z), children: /* @__PURE__ */ e.jsxs(Ne, { sideOffset: 6, align: "start", className: `${_e} w-[184px]`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
        ps.map((y) => {
          const C = bt[y], E = (l ?? t.priority) === y;
          return /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("priority", y),
              className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${E ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${C.icon} text-[11px] w-[13px]` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: C.label }),
                E && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
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
      $ ? /* @__PURE__ */ e.jsx(
        "input",
        {
          autoFocus: !0,
          type: "text",
          value: k,
          onChange: (y) => T(y.target.value),
          onBlur: ee,
          onKeyDown: (y) => {
            y.key === "Enter" && ee(), y.key === "Escape" && (T(""), I(!1));
          },
          placeholder: "Etiket…",
          className: "h-6 w-24 px-2 rounded-[7px] border border-focus bg-surface-base text-text-primary text-[11.5px] shadow-focus focus:outline-none"
        }
      ) : /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          "aria-label": "Yeni etiket ekle",
          onClick: () => I(!0),
          className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-dashed border-strong bg-transparent text-text-tertiary text-[11.5px] font-semibold hover:border-focus hover:text-primary hover:bg-primary-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[9px]" }),
            "Etiket"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Proje", children: /* @__PURE__ */ e.jsxs(ye, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(ve, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-[13px] text-text-tertiary" }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: J }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(je, { container: Se(z), children: /* @__PURE__ */ e.jsxs(Ne, { sideOffset: 6, align: "start", className: `${_e} w-[250px]`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: m,
              onChange: (y) => j(y.target.value),
              placeholder: "Proje ara…",
              className: Vt
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[210px] overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("projectId", null),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${K ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-neutral-400" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Projesiz" })
              ]
            }
          ) }),
          Y.map((y) => /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("projectId", y.value),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${K === y.value ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-primary" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: y.label }),
                K === y.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
              ]
            }
          ) }, y.value))
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-[7px] pt-[7px] border-t border-subtle", children: [
          /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
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
          /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
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
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[13px] font-bold text-text-primary", children: Qt(t.spentHours ?? 0) }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[12px] text-text-tertiary", children: [
        "/ ",
        t.estimatedHours != null ? Qt(t.estimatedHours) : "—"
      ] })
    ] }) })
  ] }) });
}
function rr({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: i,
  onDragEnd: l,
  onReorderTo: o,
  onReorderDrop: n,
  onOpenPicker: c,
  counts: d = {},
  isDirty: b = !1
}) {
  const [p, f] = h.useState(!1);
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
            ...da(() => a(u.code)),
            onDragStart: (m) => {
              i(u.code);
              try {
                m.dataTransfer.effectAllowed = "move", m.dataTransfer.setData("text/plain", u.code);
              } catch {
              }
            },
            onDragOver: (m) => {
              m.preventDefault(), o(u.code);
            },
            onDrop: (m) => {
              m.preventDefault(), n == null || n();
            },
            onDragEnd: l,
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
            f(!1), c();
          },
          onMouseEnter: () => f(!0),
          onMouseLeave: () => f(!1),
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
function nr({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: i,
  onDragEnd: l,
  onReorderTo: o,
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
          const p = t === b.code, f = d[b.code] || 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              draggable: !0,
              title: "Sürükleyerek sırayı değiştirin",
              ...da(() => a(b.code)),
              onDragStart: (u) => {
                i(b.code);
                try {
                  u.dataTransfer.effectAllowed = "move", u.dataTransfer.setData("text/plain", b.code);
                } catch {
                }
              },
              onDragOver: (u) => {
                u.preventDefault(), o(b.code);
              },
              onDrop: (u) => {
                u.preventDefault(), n == null || n();
              },
              onDragEnd: l,
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
                f > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                  "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                  "rounded-full text-[10px] font-extrabold",
                  p ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
                ].join(" "), children: f })
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
          style: { background: Ge(s) },
          children: Fe(s)
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", title: typeof a == "string" ? a : void 0, children: a || "—" })
    ] })
  ] });
}
const Wt = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "—";
function ir({ task: t = {}, nameById: a }) {
  const s = (l, o) => {
    var n;
    return l || o && ((n = a == null ? void 0 : a.get) == null ? void 0 : n.call(a, o)) || null;
  }, r = s(t.creatorName, t.creatorId), i = t.lastModificationTime ? s(t.lastModifierName, t.lastModifierId) : null;
  return /* @__PURE__ */ e.jsx("aside", { className: "flex flex-col gap-3.5 min-w-0", children: /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Oluşturan", value: r || "Bilinmiyor", avatarName: r }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Oluşturma tarihi", value: Wt(t.creationTime) }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Güncelleyen", value: i || "—", avatarName: i }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Son güncelleme", value: Wt(t.lastModificationTime) }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Görev tipi", value: t.taskType }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Sprint", value: t.sprint })
  ] }) });
}
const lr = [
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
], or = '<table class="apya-rte-table"><tr><th>Kolon 1</th><th>Kolon 2</th></tr><tr><td>Değer</td><td>Değer</td></tr></table><p><br></p>', cr = '<div class="apya-rte-imgph">görsel yer tutucu</div><p><br></p>';
function dr(t) {
  return t ? /<[a-z][\s\S]*>/i.test(t) ? t : `<p>${t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>` : "";
}
function xr({ value: t, onChange: a, mentionName: s = "ekip arkadaşı" }) {
  const r = h.useRef(null), i = h.useRef(dr(t)), [l, o] = h.useState(!1), [n, c] = h.useState("https://"), d = h.useRef(null), b = (m, j) => {
    var k, T;
    (k = r.current) == null || k.focus();
    try {
      document.execCommand(m, !1, j);
    } catch {
    }
    a == null || a(((T = r.current) == null ? void 0 : T.innerHTML) ?? "");
  }, p = () => {
    const m = window.getSelection();
    d.current = m && m.rangeCount ? m.getRangeAt(0).cloneRange() : null;
  }, f = () => {
    const m = d.current;
    if (!m) return;
    const j = window.getSelection();
    j.removeAllRanges(), j.addRange(m);
  }, u = () => {
    var j;
    const m = n.trim();
    o(!1), !(!m || m === "https://") && ((j = r.current) == null || j.focus(), f(), b("createLink", m), c("https://"));
  }, x = (m) => {
    switch (m.cmd) {
      case "link":
        p();
        return;
      case "image":
        b("insertHTML", cr);
        return;
      case "table":
        b("insertHTML", or);
        return;
      case "mention":
        b("insertHTML", `<span class="apya-rte-mention">@${s}</span>&nbsp;`);
        return;
      default:
        b(m.cmd, m.arg);
    }
  }, g = "flex shrink-0 items-center justify-center h-7 w-7 rounded-[7px] border-0 bg-transparent text-text-secondary cursor-pointer hover:bg-surface-base hover:text-primary hover:shadow-xs";
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-[14px] border border-default bg-surface-base overflow-hidden shadow-xs", children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-0.5 px-2 py-1.5 border-b border-subtle bg-neutral-subtle overflow-x-auto custom-scrollbar", children: lr.map((m) => {
      const j = /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          title: m.title,
          onMouseDown: (k) => {
            k.preventDefault(), x(m);
          },
          className: `${g} ${m.gap ? "ml-1.5" : ""}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${m.regular ? "regular" : "solid"} ${m.icon} text-[12px]` })
        },
        m.cmd + m.icon
      );
      return m.cmd !== "link" ? j : /* @__PURE__ */ e.jsxs(ye, { modal: !0, open: l, onOpenChange: o, children: [
        /* @__PURE__ */ e.jsx(ve, { asChild: !0, children: j }),
        /* @__PURE__ */ e.jsx(je, { container: Se(r.current), children: /* @__PURE__ */ e.jsxs(
          Ne,
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
                    onChange: (k) => c(k.target.value),
                    onKeyDown: (k) => {
                      k.key === "Enter" && u();
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
        onInput: (m) => a == null ? void 0 : a(m.currentTarget.innerHTML),
        className: "apya-rte-surface min-h-[150px] p-4 text-[13.5px] leading-[1.7] text-text-primary bg-surface-base focus:outline-none",
        dangerouslySetInnerHTML: { __html: i.current }
      }
    )
  ] });
}
const Zt = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
function ct({ name: t, size: a = 32 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Ge(t), fontSize: a * 0.34 },
      children: Fe(t)
    }
  );
}
function Jt({ open: t, onClick: a }) {
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
const Xt = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function ur({
  task: t = {},
  onFieldChange: a = () => {
  },
  descriptionValue: s,
  checklist: r,
  currentUserName: i = "Ben"
}) {
  const l = t == null ? void 0 : t.id, o = ae(), [n, c] = h.useState(!0), [d, b] = h.useState(""), p = (r == null ? void 0 : r.items) ?? [], f = p.filter((v) => v.isDone).length, u = p.length ? Math.round(f / p.length * 100) : 0, x = async () => {
    var y, C, E;
    const v = d.trim();
    if (!(!v || !l)) {
      b("");
      try {
        await r.addItem(v);
      } catch (V) {
        (E = (C = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : C.error) == null || E.call(C, (V == null ? void 0 : V.message) || "Madde eklenemedi.");
      }
    }
  }, [g, m] = h.useState(!0), [j, k] = h.useState(""), [T, $] = h.useState(!1), [I, z] = h.useState(!1), [Z, R] = h.useState(null), [q, _] = h.useState(""), [K, O] = h.useState({}), { data: J = [] } = ne({
    queryKey: ["task-comments", l],
    queryFn: () => {
      var v, y, C, E;
      return Promise.resolve((E = (C = (y = (v = window == null ? void 0 : window.apya) == null ? void 0 : v.platform) == null ? void 0 : y.tasks) == null ? void 0 : C.task) == null ? void 0 : E.getComments(l));
    },
    enabled: !!l,
    staleTime: 1e4
  }), H = async () => {
    await o.invalidateQueries({ queryKey: ["task-comments", l] }), await o.invalidateQueries({ queryKey: ["task-detail", l] });
  }, X = async () => {
    var y, C, E;
    const v = j.trim();
    if (!(!v || !l || I)) {
      z(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.addComment(l, v)), await H(), k("");
      } catch (V) {
        (E = (C = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : C.error) == null || E.call(C, (V == null ? void 0 : V.message) || "Yorum gönderilemedi.");
      } finally {
        z(!1);
      }
    }
  }, Y = async (v) => {
    var C, E, V;
    const y = q.trim();
    if (!(!y || !l))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.replyToComment(v, y)), await H(), _(""), R(null);
      } catch (ce) {
        (V = (E = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : E.error) == null || V.call(E, (ce == null ? void 0 : ce.message) || "Yanıt gönderilemedi.");
      }
  }, ee = (v) => O((y) => {
    const C = y[v] ?? { liked: !1, count: 0 };
    return { ...y, [v]: { liked: !C.liked, count: C.count + (C.liked ? -1 : 1) } };
  }), N = !!j.trim() && !I;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-[9px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Açıklama" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Zengin metin · WYSIWYG" })
      ] }),
      /* @__PURE__ */ e.jsx(
        xr,
        {
          value: s ?? t.description ?? "",
          onChange: (v) => a("description", v),
          mentionName: i
        },
        l
      )
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: Zt, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
            f,
            "/",
            p.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(Jt, { open: n, onClick: () => c((v) => !v) })
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
                var C, E, V;
                return (V = (E = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : E.error) == null ? void 0 : V.call(E, (y == null ? void 0 : y.message) || "Durum güncellenemedi.");
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
                var C, E, V;
                return (V = (E = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : E.error) == null ? void 0 : V.call(E, (y == null ? void 0 : y.message) || "Madde silinemedi.");
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
    /* @__PURE__ */ e.jsxs("section", { className: Zt, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Yorumlar & güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: J.length })
        ] }),
        /* @__PURE__ */ e.jsx(Jt, { open: g, onClick: () => m((v) => !v) })
      ] }),
      g && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(ct, { name: i }),
          /* @__PURE__ */ e.jsxs("div", { className: `flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${T ? "border-focus bg-surface-base shadow-focus" : "border-default bg-surface-raised"}`, children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                rows: 2,
                value: j,
                onChange: (v) => k(v.target.value),
                onFocus: () => $(!0),
                onBlur: () => $(!1),
                onKeyDown: (v) => {
                  v.key === "Enter" && (v.ctrlKey || v.metaKey) && (v.preventDefault(), X());
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
                  onClick: () => k((y) => y + v.add),
                  className: "flex items-center justify-center h-7 w-7 rounded-[7px] text-text-tertiary hover:bg-surface-hover hover:text-primary cursor-pointer",
                  children: /* @__PURE__ */ e.jsx("i", { className: `${v.icon} text-[12px]` })
                },
                v.title
              )) }),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: X,
                  disabled: !N,
                  className: `flex items-center gap-[7px] h-[30px] px-3.5 rounded-[9px] text-[12px] font-bold shadow-xs ${N ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${I ? "fa-circle-notch fa-spin" : "fa-paper-plane"} text-[10px]` }),
                    "Gönder"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1", children: J.map((v) => {
          const y = K[v.id] ?? { liked: !1, count: 0 };
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start py-3 border-t border-subtle", children: [
            /* @__PURE__ */ e.jsx(ct, { name: v.authorName }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: v.authorName }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: Xt(v.creationTime) })
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
                      R((C) => C === v.id ? null : v.id), _("");
                    },
                    className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-full text-text-tertiary text-[11px] font-semibold hover:bg-surface-hover hover:text-primary cursor-pointer",
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                      "Yanıtla"
                    ]
                  }
                )
              ] }),
              Z === v.id && /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 mt-2 animate-fade-in-fast", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: q,
                    onChange: (C) => _(C.target.value),
                    onKeyDown: (C) => {
                      C.key === "Enter" && Y(v.id);
                    },
                    placeholder: `@${v.authorName} kullanıcısına yanıt ver…`,
                    className: "flex-1 h-8 px-3 rounded-[9px] border border-focus bg-surface-base text-text-primary text-[12px] shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => Y(v.id),
                    className: "h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover",
                    children: "Yanıtla"
                  }
                )
              ] }),
              (v.replies ?? []).map((C) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] mt-2.5 pl-3 border-l-2 border-default", children: [
                /* @__PURE__ */ e.jsx(ct, { name: C.authorName, size: 24 }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: C.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: Xt(C.creationTime) })
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
function pr({
  lastSavedAt: t,
  isDirty: a,
  isSaving: s,
  justSaved: r,
  onCancel: i,
  onSave: l
}) {
  const o = t ? new Intl.DateTimeFormat("tr-TR", {
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
        /* @__PURE__ */ e.jsx("strong", { className: "font-semibold text-text-secondary", children: o })
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
          onClick: l,
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
const Ca = Object.fromEntries(qe.map((t) => [t.code, t])), mr = {
  "subtask-table": { desc: "Alt görevlerin sıralanabilir tablosu", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  "subtask-board": { desc: "Alt görevleri duruma göre sütunlarda taşı", bg: "bg-primary-subtle", fg: "text-primary" },
  calendar: { desc: "Görev ve alt görev tarihleri aylık ızgarada", bg: "bg-primary-subtle", fg: "text-primary" },
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
}, fr = [
  { title: "GÖREV & PLANLAMA", codes: ["subtask-table", "subtask-board", "calendar", "checklist", "gantt", "time-tracking", "dependencies", "risks", "approvals", "dashboard"] },
  { title: "İLETİŞİM", codes: ["comments", "emails"] },
  { title: "GEÇMİŞ & FİNANS", codes: ["activity", "history", "finance", "gallery"] },
  { title: "İLERİ ÖZELLİKLER & YAPAY ZEKA", codes: ["ai", "automations", "custom-fields"] }
], br = /* @__PURE__ */ new Set([
  "risks",
  "dashboard",
  "comments",
  "emails",
  "custom-fields",
  "approvals",
  "ai",
  "automations"
]), hr = (t) => br.has(t);
function Ta(t) {
  const a = Ca[t], s = mr[t];
  return a ? {
    code: t,
    title: a.title,
    icon: a.icon,
    desc: (s == null ? void 0 : s.desc) ?? "",
    bg: (s == null ? void 0 : s.bg) ?? "bg-neutral-subtle",
    fg: (s == null ? void 0 : s.fg) ?? "text-text-secondary"
  } : null;
}
function gr(t) {
  var a;
  return (a = Ca[t]) != null && a.hidden ? null : Ta(t);
}
function yr(t = "") {
  const a = t.trim().toLowerCase();
  return fr.map((s) => ({
    title: s.title,
    items: s.codes.map(gr).filter(Boolean).filter((r) => !a || r.title.toLowerCase().includes(a) || r.desc.toLowerCase().includes(a))
  })).filter((s) => s.items.length > 0);
}
const ea = qe.filter((t) => !t.hidden).length;
function ta({ code: t, onRemoveFeature: a, onOpenPicker: s, canRemove: r = !0 }) {
  const i = Ta(t) ?? { title: t, desc: "", icon: "fa-cube", bg: "bg-neutral-subtle", fg: "text-text-secondary" };
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
function Nt({ open: t, onClose: a, label: s, children: r }) {
  return /* @__PURE__ */ e.jsx(
    Fa,
    {
      open: t,
      onOpenChange: (i) => {
        i || a == null || a();
      },
      children: /* @__PURE__ */ e.jsxs(Ga, { children: [
        /* @__PURE__ */ e.jsx(qa, { className: "fixed inset-0", style: { pointerEvents: "none" } }),
        /* @__PURE__ */ e.jsx(Ya, { asChild: !0, "aria-describedby": void 0, children: /* @__PURE__ */ e.jsxs("div", { className: "fixed inset-0 z-modal", children: [
          /* @__PURE__ */ e.jsx(Ua, { className: "sr-only", children: s }),
          r
        ] }) })
      ] })
    }
  );
}
function vr({
  open: t,
  onClose: a,
  assignedCodes: s = [],
  onAddFeature: r,
  onGoToTab: i
}) {
  const [l, o] = h.useState("");
  if (h.useEffect(() => {
    t || o("");
  }, [t]), !t) return null;
  const n = new Set(s), c = yr(l), d = s.length + 3, b = (p) => {
    if (n.has(p)) {
      i == null || i(p), a == null || a();
      return;
    }
    r == null || r(p), a == null || a();
  };
  return /* @__PURE__ */ e.jsx(Nt, { open: t, onClose: a, label: "Özellik ekle", children: /* @__PURE__ */ e.jsx(
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
                  value: l,
                  onChange: (p) => o(p.target.value),
                  placeholder: `${ea} özellik arasında ara (Gantt, Finans, Risk, AI…)`,
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
                /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[11px]", children: p.items.map((f) => {
                  const u = n.has(f.code);
                  return /* @__PURE__ */ e.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => b(f.code),
                      className: `group flex items-start gap-3 p-3.5 rounded-[15px] border text-left cursor-pointer hover:border-focus hover:shadow-md ${u ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                      children: [
                        /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-10 w-10 rounded-xl ${f.bg} ${f.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${f.icon} text-[15px]` }) }),
                        /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-[3px] min-w-0 flex-1", children: [
                          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-between gap-2", children: [
                            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: f.title }),
                            /* @__PURE__ */ e.jsx("span", { className: `shrink-0 text-[10.5px] font-extrabold ${u ? "text-primary" : "text-text-tertiary"}`, children: u ? "✓ Ekli" : "Ekle →" })
                          ] }),
                          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] leading-[1.5] text-text-tertiary", children: f.desc })
                        ] })
                      ]
                    },
                    f.code
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
                ea,
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
const jr = [
  { key: "subtasks", label: "Alt görevler", countKey: "subtasks", unit: "alt görev" },
  { key: "checklist", label: "Kontrol listesi", countKey: "checklist", unit: "madde" },
  { key: "comments", label: "Yorumlar", countKey: "comments", unit: "yorum" },
  { key: "files", label: "Dosyalar", countKey: "files", unit: "dosya" },
  { key: "keepAssignee", label: "Sorumluyu koru", desc: "Aksi halde atanmamış gelir" },
  { key: "keepLinks", label: "Bağımlılıkları koru", desc: "Öncül / ardıl bağlantılar" },
  { key: "shiftDates", label: "Tarihleri bugüne kaydır", desc: "Başlangıç ve son tarih ötelenir" }
], aa = {
  subtasks: !0,
  checklist: !0,
  comments: !1,
  files: !0,
  keepAssignee: !0,
  keepLinks: !0,
  shiftDates: !1
};
function Nr({ on: t, onClick: a, label: s }) {
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
function wr({
  open: t,
  mode: a = "move",
  onClose: s,
  onConfirm: r,
  projectOptions: i = [],
  currentProjectId: l,
  counts: o = {},
  onCreateProject: n
}) {
  const [c, d] = h.useState(a), [b, p] = h.useState([]), [f, u] = h.useState(""), [x, g] = h.useState(""), [m, j] = h.useState(aa), [k, T] = h.useState(!1);
  h.useEffect(() => {
    t && (d(a), p([]), u(""), g(""), j(aa));
  }, [t, a]);
  const $ = h.useMemo(
    () => i.filter((N) => N.value && N.value !== l),
    [i, l]
  ), I = $.filter((N) => !f || N.label.toLowerCase().includes(f.toLowerCase())), z = $.length > 0 && b.length === $.length;
  if (!t) return null;
  const Z = (N) => p((v) => v.includes(N) ? v.filter((y) => y !== N) : [...v, N]), R = (N) => {
    var v;
    return ((v = i.find((y) => y.value === N)) == null ? void 0 : v.label) ?? "";
  }, q = async () => {
    var v, y, C;
    const N = x.trim();
    if (!(!N || k)) {
      T(!0);
      try {
        const E = await (n == null ? void 0 : n(N));
        E && p((V) => [...V, E]), g("");
      } catch (E) {
        (C = (y = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : y.error) == null || C.call(y, (E == null ? void 0 : E.message) || "Proje oluşturulamadı.");
      } finally {
        T(!1);
      }
    }
  }, _ = async () => {
    if (!(!b.length || k)) {
      T(!0);
      try {
        await (r == null ? void 0 : r({ mode: c, targetProjectIds: b, include: m }));
      } finally {
        T(!1);
      }
    }
  }, K = c === "move", O = b.length, J = K ? O > 1 ? "Taşı ve kopyala" : "Taşı" : O > 1 ? `${O} projeye kopyala` : "Kopyala", H = Object.values(m).filter(Boolean).length, X = b.map(R).filter(Boolean), Y = X.length ? `${X.length > 2 ? `${X.slice(0, 2).join(", ")} +${X.length - 2}` : X.join(", ")} · ${H} seçenek açık` : `Proje seçilmedi · ${H} seçenek açık`, ee = (N) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${N ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return /* @__PURE__ */ e.jsx(Nt, { open: t, onClose: s, label: K ? "Başka projeye taşı" : "Başka projelere kopyala", children: /* @__PURE__ */ e.jsx(
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
          "aria-label": K ? "Başka projeye taşı" : "Başka projelere kopyala",
          onClick: (N) => N.stopPropagation(),
          className: "flex flex-col w-full max-w-[760px] max-h-[88vh] rounded-[20px] border border-default bg-surface-base shadow-xl overflow-hidden animate-dialog-in",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-4 px-[22px] pt-5 pb-4 border-b border-subtle", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-10 w-10 rounded-[13px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-tree text-base" }) }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsx("h3", { className: "m-0 text-base font-extrabold tracking-[-.02em] text-text-primary", children: K ? "Başka projeye taşı" : "Başka projelere kopyala" }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 mb-0 text-[12px] leading-[1.5] text-text-tertiary", children: K ? "Görev ilk seçtiğiniz projeye taşınır; birden fazla seçerseniz kalanlara kopya oluşturulur." : "Görevin kopyası seçtiğiniz her projede oluşturulur; bu görev yerinde kalır." })
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
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => d("move"), className: ee(K), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[10px]" }),
                "Taşı"
              ] }),
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => d("copy"), className: ee(!K), children: [
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
                      onClick: () => p(z ? [] : $.map((N) => N.value)),
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
                      value: f,
                      onChange: (N) => u(N.target.value),
                      placeholder: "Proje ara…",
                      className: "w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar", children: [
                  I.map((N) => {
                    const v = b.includes(N.value), y = K && b[0] === N.value;
                    return /* @__PURE__ */ e.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => Z(N.value),
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
                  I.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "py-6 text-center text-[12px] text-text-tertiary", children: "Uygun proje bulunamadı." })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[7px] mt-1", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: x,
                      onChange: (N) => g(N.target.value),
                      onKeyDown: (N) => {
                        N.key === "Enter" && (N.preventDefault(), q());
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
                      onClick: q,
                      disabled: !x.trim() || k,
                      className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-plus text-[12px]" })
                    }
                  )
                ] }),
                K && O > 1 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle", children: [
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
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: jr.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-px", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary", children: N.label }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: N.countKey ? `${o[N.countKey] ?? 0} ${N.unit}` : N.desc })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    Nr,
                    {
                      on: m[N.key],
                      label: N.label,
                      onClick: () => j((v) => ({ ...v, [N.key]: !v[N.key] }))
                    }
                  )
                ] }, N.key)) })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3.5 px-[22px] py-3.5 border-t border-subtle bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("span", { className: "min-w-0 truncate text-[11.5px] text-text-tertiary", children: Y }),
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
                    onClick: _,
                    disabled: !O || k,
                    className: `flex items-center gap-2 h-9 px-5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${O && !k ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${k ? "fa-circle-notch fa-spin" : "fa-arrow-right"} text-[10px]` }),
                      J
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
const kr = [
  { code: "general", title: "Genel", icon: "fa-circle-info" },
  { code: "checklist", title: "Kontrol", icon: "fa-square-check" },
  { code: "comments", title: "Yorumlar", icon: "fa-comments" },
  { code: "files", title: "Dosyalar", icon: "fa-paperclip" }
], Ke = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  img: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
};
function Dr(t = "") {
  var s;
  const a = (s = t.split(".").pop()) == null ? void 0 : s.toLowerCase();
  return a === "pdf" ? Ke.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(a) ? Ke.img : ["doc", "docx", "odt", "rtf"].includes(a) ? Ke.doc : ["json", "js", "ts", "cs", "xml", "yml", "yaml"].includes(a) ? Ke.code : Ke.other;
}
const Cr = (t) => t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toFixed(1)} MB` : "—", Tr = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—", Sr = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—";
function dt({ name: t, size: a = 22 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Ge(t), fontSize: a * 0.4 },
      children: Fe(t)
    }
  );
}
function Oe({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: t }),
    a
  ] });
}
function $r({
  subtaskId: t,
  parentCode: a,
  onClose: s,
  onOpenFull: r,
  onDeleted: i,
  currentUserName: l = "Ben"
}) {
  var E, V, ce;
  const o = ae(), { data: n } = gt(t), c = jt(t), d = vt(t), [b, p] = h.useState("general"), [f, u] = h.useState(""), [x, g] = h.useState(""), [m, j] = h.useState(""), k = h.useRef(null), T = h.useRef(null);
  n && T.current !== n.id && (T.current = n.id, u(n.description ?? ""));
  const { data: $ = [] } = ne({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var w, L, P, F;
      return Promise.resolve((F = (P = (L = (w = window == null ? void 0 : window.apya) == null ? void 0 : w.platform) == null ? void 0 : L.tasks) == null ? void 0 : P.task) == null ? void 0 : F.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4
  });
  if (h.useEffect(() => {
    const w = (L) => {
      L.key === "Escape" && (L.stopPropagation(), s == null || s());
    };
    return window.addEventListener("keydown", w), () => window.removeEventListener("keydown", w);
  }, [s]), !n) return null;
  const I = (ce = (V = (E = window == null ? void 0 : window.apya) == null ? void 0 : E.platform) == null ? void 0 : V.tasks) == null ? void 0 : ce.task, z = pe(n.status), Z = et(n.priority), R = c.items ?? [], q = R.filter((w) => w.isDone).length, _ = R.length ? Math.round(q / R.length * 100) : 0, K = d.attachments ?? [], O = { checklist: R.length, comments: $.length, files: K.length }, J = async () => {
    await o.invalidateQueries({ queryKey: ["task-detail", t] });
  }, H = async (w) => {
    var L, P, F;
    try {
      await Promise.resolve(I.update(n.id, {
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
        tagNames: (n.tags ?? []).map((U) => U.name),
        estimatedHours: n.estimatedHours ?? null,
        taskType: n.taskType ?? null,
        sprint: n.sprint ?? null,
        ...w
      })), await J();
    } catch (U) {
      (F = (P = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : P.error) == null || F.call(P, (U == null ? void 0 : U.message) || "Alt görev güncellenemedi.");
    }
  }, X = () => H({ status: n.status >= 4 ? 1 : n.status + 1 }), Y = () => H({ priority: n.priority >= 4 ? 1 : n.priority + 1 }), ee = () => {
    (n.description ?? "") !== f && H({ description: f || null });
  }, N = async () => {
    var L, P, F;
    const w = x.trim();
    if (w) {
      g("");
      try {
        await c.addItem(w);
      } catch (U) {
        (F = (P = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : P.error) == null || F.call(P, (U == null ? void 0 : U.message) || "Madde eklenemedi.");
      }
    }
  }, v = async () => {
    var L, P, F;
    const w = m.trim();
    if (w) {
      j("");
      try {
        await Promise.resolve(I.addComment(n.id, w)), await o.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch (U) {
        (F = (P = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : P.error) == null || F.call(P, (U == null ? void 0 : U.message) || "Yorum gönderilemedi.");
      }
    }
  }, y = async () => {
    var w, L, P;
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(I.delete(n.id)), i == null || i(n.id), s == null || s();
      } catch (F) {
        (P = (L = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : L.error) == null || P.call(L, (F == null ? void 0 : F.message) || "Alt görev silinemedi.");
      }
  }, C = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
  return /* @__PURE__ */ e.jsxs(Nt, { open: !0, onClose: s, label: `${n.code} alt görev detayı`, children: [
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
                  onClick: X,
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
                  onClick: Y,
                  title: "Önceliği değiştir",
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold cursor-pointer ${Z.bg} ${Z.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${Z.icon} text-[10px]` }),
                    Z.label
                  ]
                }
              ),
              (n.tags ?? []).map((w) => /* @__PURE__ */ e.jsx("span", { className: "flex items-center h-6 px-[9px] rounded-[7px] border border-default bg-neutral-subtle text-text-secondary text-[11px] font-semibold", children: w.name }, w.id ?? w.name))
            ] }),
            /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[18px] font-extrabold tracking-[-.02em] leading-[1.3] text-text-primary", children: n.title }),
            /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 pt-1", children: [
              /* @__PURE__ */ e.jsx(Oe, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
                /* @__PURE__ */ e.jsx(dt, { name: n.assigneeName }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", children: n.assigneeName || "Atanmamış" })
              ] }) }),
              /* @__PURE__ */ e.jsx(Oe, { label: "Son tarih", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] h-[22px] text-[12.5px] font-semibold text-text-primary", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[11px] text-text-tertiary" }),
                Sr(n.dueDate)
              ] }) }),
              /* @__PURE__ */ e.jsx(Oe, { label: "Süre", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-[22px] font-mono text-[12.5px] font-bold text-text-primary", children: [
                n.spentHours ?? 0,
                "s",
                /* @__PURE__ */ e.jsxs("span", { className: "font-medium text-text-tertiary", children: [
                  " / ",
                  n.estimatedHours != null ? `${n.estimatedHours}s` : "—"
                ] })
              ] }) }),
              /* @__PURE__ */ e.jsx(Oe, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-1.5 pt-[3px]", children: [
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
                  "%",
                  _
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: "block h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("span", { className: "block h-full rounded-full bg-success", style: { width: `${_}%` } }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: kr.map((w) => {
            const L = b === w.code, P = O[w.code] ?? 0;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => p(w.code),
                className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${L ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${w.icon} text-[11px] opacity-85` }),
                  /* @__PURE__ */ e.jsx("span", { children: w.title }),
                  P > 0 && /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-neutral-subtle text-text-tertiary text-[10px] font-extrabold", children: P })
                ]
              },
              w.code
            );
          }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar px-5 py-[18px] bg-surface-raised", children: [
            b === "general" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Açıklama" }),
              /* @__PURE__ */ e.jsx(
                "textarea",
                {
                  rows: 7,
                  value: f,
                  onChange: (w) => u(w.target.value),
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
                  q,
                  "/",
                  R.length
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-success", style: { width: `${_}%` } }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px] mt-1", children: [
                R.map((w) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] border border-subtle bg-surface-base hover:border-default", children: [
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Tamamlandı işaretle",
                      onClick: () => c.toggleItem(w.id),
                      className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white cursor-pointer ${w.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
                      children: w.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[12.5px] font-semibold ${w.isDone ? "line-through text-text-tertiary" : "text-text-primary"}`, children: w.text }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Maddeyi sil",
                      onClick: () => c.removeItem(w.id),
                      className: "flex shrink-0 items-center justify-center h-6 w-6 rounded-md text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[10px]" })
                    }
                  )
                ] }, w.id)),
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "text",
                    value: x,
                    onChange: (w) => g(w.target.value),
                    onKeyDown: (w) => {
                      w.key === "Enter" && N();
                    },
                    placeholder: "Yeni madde yaz ve Enter'a bas…",
                    className: "h-9 mt-1 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                )
              ] })
            ] }),
            b === "comments" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] items-start", children: [
                /* @__PURE__ */ e.jsx(dt, { name: l, size: 30 }),
                /* @__PURE__ */ e.jsx(
                  "textarea",
                  {
                    rows: 2,
                    value: m,
                    onChange: (w) => j(w.target.value),
                    onKeyDown: (w) => {
                      w.key === "Enter" && !w.shiftKey && (w.preventDefault(), v());
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
                    className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] ${m.trim() ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paper-plane text-[11px]" })
                  }
                )
              ] }),
              $.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-[7px] py-7 rounded-xl border border-dashed border-default", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-comments text-xl text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Henüz yorum yok" })
              ] }) : $.map((w) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 items-start p-3 rounded-xl border border-subtle bg-surface-base", children: [
                /* @__PURE__ */ e.jsx(dt, { name: w.authorName, size: 28 }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: w.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: Tr(w.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: w.text })
                ] })
              ] }, w.id))
            ] }),
            b === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  ref: k,
                  type: "file",
                  className: "hidden",
                  onChange: (w) => {
                    var P;
                    const L = (P = w.target.files) == null ? void 0 : P[0];
                    w.target.value = "", L && d.upload(L).catch((F) => {
                      var U, ie, A;
                      return (A = (ie = (U = window == null ? void 0 : window.abp) == null ? void 0 : U.notify) == null ? void 0 : ie.error) == null ? void 0 : A.call(ie, (F == null ? void 0 : F.message) || "Dosya yüklenemedi.");
                    });
                  }
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    var w;
                    return (w = k.current) == null ? void 0 : w.click();
                  },
                  disabled: d.isUploading,
                  className: "flex flex-col items-center justify-center gap-[7px] p-6 rounded-[13px] border-2 border-dashed border-strong bg-surface-base cursor-pointer hover:border-focus hover:bg-primary-subtle disabled:opacity-60",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.isUploading ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-xl text-text-tertiary` }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: d.isUploading ? "Yükleniyor…" : "Dosya ekle" })
                  ]
                }
              ),
              K.map((w) => {
                const L = Dr(w.fileName);
                return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${L.bg} ${L.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${L.icon} text-[13px]` }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: w.fileName }),
                    /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                      Cr(w.fileSize),
                      " · ",
                      w.uploaderName
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "a",
                    {
                      href: w.downloadUrl,
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
                      onClick: () => d.remove(w.id).catch((P) => {
                        var F, U, ie;
                        return (ie = (U = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : U.error) == null ? void 0 : ie.call(U, (P == null ? void 0 : P.message) || "Dosya silinemedi.");
                      }),
                      className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                    }
                  )
                ] }, w.id);
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
const Sa = "apya.taskDetail.tabOrder";
function Er() {
  try {
    const t = localStorage.getItem(Sa);
    if (!t) return [];
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.filter((s) => typeof s == "string") : [];
  } catch {
    return [];
  }
}
function Pr(t) {
  try {
    localStorage.setItem(Sa, JSON.stringify(t));
  } catch {
  }
}
function Ar(t) {
  const [a, s] = h.useState(Er), [r, i] = h.useState(null), l = h.useMemo(() => {
    const d = new Map(t.map((p) => [p.code, p])), b = [];
    for (const p of a) {
      const f = d.get(p);
      f && (b.push(f), d.delete(p));
    }
    for (const p of t)
      d.has(p.code) && b.push(p);
    return b;
  }, [t, a]), o = h.useCallback((d) => {
    s((b) => {
      const p = r;
      if (!p || p === d) return b;
      const f = b.length ? b.slice() : l.map((g) => g.code), u = f.indexOf(p), x = f.indexOf(d);
      return u === -1 || x === -1 ? b : (f.splice(u, 1), f.splice(x, 0, p), f);
    });
  }, [r, l]), n = h.useCallback((d) => i(d), []), c = h.useCallback(() => {
    i(null), s((d) => {
      const b = d.length ? d : l.map((p) => p.code);
      return Pr(b), b;
    });
  }, [l]);
  return { orderedTabs: l, draggingCode: r, handleDragStart: n, handleDragEnd: c, reorderTo: o };
}
function zr() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Lr() {
  const t = ne({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: zr,
    staleTime: 3e5,
    retry: !1
  }), a = t.data ?? [], s = a.map((i) => ({ value: i.id, label: i.name })), r = new Map(a.map((i) => [i.id, i.name]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
const sa = "apya.taskDetail.fullscreen", Q = {
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
function Br(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function $a({ taskId: t, presentation: a = "modal", onClose: s, switchToTask: r }) {
  var Ct, Tt, St, $t, Et, Pt, At, zt;
  const [i, l] = h.useState(t), { data: o, isPending: n, isError: c, refetch: d } = gt(i), b = ae(), p = xa(), f = fa(o), u = ba(), x = Lr(), g = ha(i), m = jt(i), [j, k] = h.useState("general"), [T, $] = h.useState(!1), [I, z] = h.useState(!1), [Z, R] = h.useState(!1), [q, _] = h.useState(null), [K, O] = h.useState(null), [J, H] = h.useState(!1), [X, Y] = h.useState(!1), [ee, N] = h.useState(() => {
    try {
      return localStorage.getItem(sa) === "true";
    } catch {
      return !1;
    }
  });
  ma(i);
  const [v, y] = h.useState(null);
  o != null && o.id && o.id !== v && (y(o.id), H(!!o.isFavorite), Y(!!o.isWatched)), h.useEffect(() => {
    f.isDirty ? p.markDirty() : p.markClean();
  });
  const C = h.useCallback(() => {
    pa(), s == null || s();
  }, [s]), E = h.useCallback(() => p.requestClose(C), [p, C]), V = h.useCallback(() => {
    N((D) => {
      const S = !D;
      try {
        localStorage.setItem(sa, String(S));
      } catch {
      }
      return S;
    });
  }, []), ce = h.useMemo(
    () => wa(g.assignedCodes),
    [g.assignedCodes]
  ), w = Ar(ce), L = h.useMemo(() => {
    var D, S, M, le, me;
    return {
      subtasks: ((D = o == null ? void 0 : o.subTasks) == null ? void 0 : D.length) ?? 0,
      files: ((S = o == null ? void 0 : o.attachments) == null ? void 0 : S.length) ?? 0,
      dependencies: ((M = o == null ? void 0 : o.predecessorIds) == null ? void 0 : M.length) ?? 0,
      comments: ((le = o == null ? void 0 : o.comments) == null ? void 0 : le.length) ?? 0,
      checklist: ((me = m.items) == null ? void 0 : me.length) ?? 0
    };
  }, [o, m.items]), P = qe.find((D) => D.code === j), F = m.items ?? [], U = F.filter((D) => D.isDone).length, ie = F.length ? Math.round(U / F.length * 100) : 0, A = h.useCallback(async () => {
    if (!f.validate())
      return Q.err("Zorunlu alanları kontrol edin."), !1;
    $(!0);
    try {
      return await Promise.resolve(window.apya.platform.tasks.task.update(i, f.toUpdateDto())), await b.invalidateQueries({ queryKey: ["task-detail", i] }), re.emitResult(), z(!0), setTimeout(() => z(!1), 2e3), Q.ok("Görev başarıyla güncellendi."), !0;
    } catch (D) {
      return Q.err((D == null ? void 0 : D.message) || "Kaydedilemedi."), !1;
    } finally {
      $(!1);
    }
  }, [i, f, b]);
  h.useEffect(() => {
    const D = (S) => {
      if ((S.ctrlKey || S.metaKey) && S.key.toLowerCase() === "s") {
        S.preventDefault(), f.isDirty && !T && A();
        return;
      }
      if (S.key === "Escape") {
        if (q) {
          S.stopPropagation(), _(null);
          return;
        }
        Z && (S.stopPropagation(), R(!1));
      }
    };
    return window.addEventListener("keydown", D), () => window.removeEventListener("keydown", D);
  }, [A, f.isDirty, T, q, Z]);
  const B = () => {
    var D, S, M;
    return (M = (S = (D = window == null ? void 0 : window.apya) == null ? void 0 : D.platform) == null ? void 0 : S.tasks) == null ? void 0 : M.task;
  }, G = async () => {
    var S;
    const D = !J;
    H(D);
    try {
      await Promise.resolve((S = B()) == null ? void 0 : S.toggleFavorite(i));
    } catch (M) {
      H(!D), Q.err((M == null ? void 0 : M.message) || "Favori güncellenemedi.");
    }
  }, te = () => {
    if (!i) return;
    const D = document.createElement("a");
    D.href = `/Tasks/Detail/${i}?handler=Pdf`, D.rel = "noopener", document.body.appendChild(D), D.click(), D.remove();
  }, W = async () => {
    var S;
    const D = !X;
    Y(D);
    try {
      await Promise.resolve((S = B()) == null ? void 0 : S.toggleWatch(i)), Q.info(D ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (M) {
      Y(!D), Q.err((M == null ? void 0 : M.message) || "Takip durumu güncellenemedi.");
    }
  }, Ce = async () => {
    var D, S;
    try {
      const M = await Promise.resolve((D = B()) == null ? void 0 : D.transfer(i, {
        mode: 2,
        // Copy
        targetProjectIds: o != null && o.projectId ? [o.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await b.invalidateQueries({ queryKey: ["task-detail"] }), Q.ok("Görev çoğaltıldı.");
      const le = (S = M == null ? void 0 : M.createdTaskIds) == null ? void 0 : S[0];
      le && l(le);
    } catch (M) {
      Q.err((M == null ? void 0 : M.message) || "Görev çoğaltılamadı.");
    }
  }, xe = async () => {
    var D;
    try {
      await Promise.resolve((D = B()) == null ? void 0 : D.updateStatus(i, 4)), await b.invalidateQueries({ queryKey: ["task-detail", i] }), Q.info("Görev arşivlendi (Tamamlandı).");
    } catch (S) {
      Q.err((S == null ? void 0 : S.message) || "Görev arşivlenemedi.");
    }
  }, Pa = async () => {
    var D;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?"))
      try {
        await Promise.resolve((D = B()) == null ? void 0 : D.delete(i)), Q.info("Görev silindi."), p.markClean(), C();
      } catch (S) {
        Q.err((S == null ? void 0 : S.message) || "Görev silinemedi.");
      }
  }, Aa = async (D) => {
    try {
      await g.addFeature(D), k(D), Q.ok("Özellik başarıyla eklendi.");
    } catch (S) {
      Q.err((S == null ? void 0 : S.message) || "Özellik eklenemedi.");
    }
  }, wt = async (D) => {
    try {
      await g.removeFeature(D), k("general"), Q.info("Özellik görevden kaldırıldı.");
    } catch (S) {
      Q.err((S == null ? void 0 : S.message) || "Özellik kaldırılamadı.");
    }
  }, za = async (D) => {
    var le, me, de, $e, Te, Ye, Le;
    const S = (($e = (de = (me = (le = window == null ? void 0 : window.apya) == null ? void 0 : le.platform) == null ? void 0 : me.application) == null ? void 0 : de.projects) == null ? void 0 : $e.project) ?? ((Le = (Ye = (Te = window == null ? void 0 : window.apya) == null ? void 0 : Te.platform) == null ? void 0 : Ye.projects) == null ? void 0 : Le.project);
    if (!(S != null && S.create)) throw new Error("Proje servisi yüklenmedi.");
    const M = await Promise.resolve(S.create({
      name: D,
      code: Br(D),
      currency: "TRY"
    }));
    return await b.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), Q.ok(`“${D}” projesi oluşturuldu.`), (M == null ? void 0 : M.id) ?? M;
  }, La = async ({ mode: D, targetProjectIds: S, include: M }) => {
    var le, me;
    try {
      const de = await Promise.resolve((le = B()) == null ? void 0 : le.transfer(i, {
        mode: D === "move" ? 1 : 2,
        targetProjectIds: S,
        include: M
      }));
      await b.invalidateQueries({ queryKey: ["task-detail", i] });
      const $e = S.map((Ye) => {
        var Le;
        return (Le = x.options.find((Ia) => Ia.value === Ye)) == null ? void 0 : Le.label;
      }).filter(Boolean), Te = ((me = de == null ? void 0 : de.createdTaskIds) == null ? void 0 : me.length) ?? 0;
      Q.ok(D === "move" ? Te ? `“${$e[0]}” projesine taşındı, ${Te} projeye kopyalandı.` : `Görev “${$e[0]}” projesine taşındı.` : Te > 1 ? `${Te} projeye kopyalandı.` : `Kopya “${$e[0]}” projesinde oluşturuldu.`), _(null);
    } catch (de) {
      Q.err((de == null ? void 0 : de.message) || "Transfer tamamlanamadı.");
    }
  }, Ba = j === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)] gap-5 items-start", children: [
    /* @__PURE__ */ e.jsx(
      ur,
      {
        task: o,
        onFieldChange: f.setField,
        descriptionValue: f.values.description,
        checklist: m,
        currentUserName: ((Tt = (Ct = window == null ? void 0 : window.abp) == null ? void 0 : Ct.currentUser) == null ? void 0 : Tt.name) || (($t = (St = window == null ? void 0 : window.abp) == null ? void 0 : St.currentUser) == null ? void 0 : $t.userName) || "Ben"
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5", children: /* @__PURE__ */ e.jsx(ir, { task: o, nameById: u.nameById }) })
  ] }) : hr(j) ? /* @__PURE__ */ e.jsx(
    ta,
    {
      code: j,
      onRemoveFeature: wt,
      onOpenPicker: () => R(!0),
      canRemove: !(P != null && P.isCore)
    }
  ) : /* @__PURE__ */ e.jsx(h.Suspense, { fallback: /* @__PURE__ */ e.jsx(ge, { className: "h-48 w-full" }), children: P != null && P.component ? /* @__PURE__ */ e.jsx(
    P.component,
    {
      taskId: i,
      task: o,
      nameById: u.nameById,
      onOpenSubtask: O
    }
  ) : /* @__PURE__ */ e.jsx(
    ta,
    {
      code: j,
      onRemoveFeature: wt,
      onOpenPicker: () => R(!0),
      canRemove: !(P != null && P.isCore)
    }
  ) }), kt = n ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(ge, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(ge, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(ge, { className: "h-64 w-full" })
  ] }) : c ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(se, { variant: "ghost", onClick: () => d(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col flex-1 min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      ar,
      {
        task: o,
        presentation: a,
        onClose: E,
        isFullscreen: ee,
        onToggleFullscreen: V,
        onFieldChange: f.setField,
        statusValue: f.values.status,
        titleValue: o == null ? void 0 : o.title,
        isPrivateValue: f.values.isPrivate,
        isFavorite: J,
        onToggleFavorite: G,
        isWatched: X,
        onToggleWatch: W,
        onDuplicate: Ce,
        onArchive: xe,
        onDelete: Pa,
        onOpenTransfer: (D) => _({ mode: D }),
        onSaveAsTemplate: () => Q.info("Şablon olarak kaydetme yakında."),
        onConvertToSubtask: () => Q.info("Alt göreve dönüştürme yakında."),
        onExportPdf: te
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        sr,
        {
          task: o,
          assigneeOptions: u.options,
          projectOptions: x.options,
          onFieldChange: f.setField,
          statusValue: f.values.status,
          priorityValue: f.values.priority,
          assigneeValue: f.values.assigneeId,
          projectValue: f.values.projectId,
          dueDateValue: f.values.dueDate,
          startDateValue: f.values.startDate,
          tagsValue: f.values.tagNames,
          progressPercent: ie,
          progressNote: `${U}/${F.length} madde`,
          onOpenTransfer: (D) => _({ mode: D })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        a === "page" && /* @__PURE__ */ e.jsx(
          nr,
          {
            activeTab: j,
            onTabChange: k,
            orderedTabs: w.orderedTabs,
            draggingCode: w.draggingCode,
            onDragStart: w.handleDragStart,
            onDragEnd: w.handleDragEnd,
            onReorderTo: w.reorderTo,
            onReorderDrop: () => Q.info("Sekme sırası güncellendi."),
            onOpenPicker: () => R(!0),
            counts: L
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: a === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            rr,
            {
              activeTab: j,
              onTabChange: k,
              orderedTabs: w.orderedTabs,
              draggingCode: w.draggingCode,
              onDragStart: w.handleDragStart,
              onDragEnd: w.handleDragEnd,
              onReorderTo: w.reorderTo,
              onReorderDrop: () => Q.info("Sekme sırası güncellendi."),
              onOpenPicker: () => R(!0),
              counts: L,
              isDirty: f.isDirty
            }
          ) }),
          /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised", children: Ba })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(
      pr,
      {
        lastSavedAt: o == null ? void 0 : o.lastModificationTime,
        isDirty: f.isDirty,
        isSaving: T,
        justSaved: I,
        onCancel: E,
        onSave: A
      }
    )
  ] }), Dt = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      vr,
      {
        open: Z,
        onClose: () => R(!1),
        assignedCodes: g.assignedCodes,
        onAddFeature: Aa,
        onGoToTab: k
      }
    ),
    /* @__PURE__ */ e.jsx(
      wr,
      {
        open: !!q,
        mode: (q == null ? void 0 : q.mode) ?? "move",
        onClose: () => _(null),
        onConfirm: La,
        projectOptions: x.options,
        currentProjectId: f.values.projectId,
        counts: L,
        onCreateProject: za
      }
    ),
    K && /* @__PURE__ */ e.jsx(
      $r,
      {
        subtaskId: K,
        parentCode: o == null ? void 0 : o.code,
        onClose: () => O(null),
        onOpenFull: (D) => {
          O(null), (r ?? l)(D);
        },
        onDeleted: () => b.invalidateQueries({ queryKey: ["task-detail", i] }),
        currentUserName: ((Pt = (Et = window == null ? void 0 : window.abp) == null ? void 0 : Et.currentUser) == null ? void 0 : Pt.name) || ((zt = (At = window == null ? void 0 : window.abp) == null ? void 0 : At.currentUser) == null ? void 0 : zt.userName) || "Ben"
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col w-full min-h-[calc(100vh-54px)] border-y border-subtle bg-surface-base", children: kt }),
    Dt
  ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(la, { open: !0, onOpenChange: (D) => {
      D || E();
    }, children: /* @__PURE__ */ e.jsx(
      oa,
      {
        title: o != null && o.title ? `Görev Detayı: ${o.title}` : "Görev Detayı",
        fullscreen: ee,
        className: ee ? "p-0 rounded-xl border border-default shadow-xl short:h-[100svh]" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl short:h-[100svh]",
        onInteractOutside: (D) => {
          var S, M;
          D.preventDefault(), !(Z || q || K) && ((M = (S = D.target) == null ? void 0 : S.closest) != null && M.call(S, "[data-apya-overlay]") || E());
        },
        onEscapeKeyDown: (D) => {
          if (Z || q || K) {
            D.preventDefault();
            return;
          }
          D.preventDefault(), E();
        },
        children: kt
      }
    ) }),
    Dt
  ] });
}
function Ir() {
  var a;
  const t = h.useSyncExternalStore(
    re.subscribe,
    re.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(Qe, { children: /* @__PURE__ */ e.jsx(
    $a,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        re.close(), re.emitResult();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(Qe, { children: /* @__PURE__ */ e.jsx(
    ka,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        re.close(), re.emitResult();
      }
    },
    t
  ) }) : null;
}
function Ea() {
  var s;
  try {
    const r = new URLSearchParams(window.location.search).get("taskui");
    if (r === "v1" || r === "v2" || r === "v3") return r;
  } catch {
  }
  const t = document.getElementById("task-detail-island"), a = (s = t == null ? void 0 : t.dataset) == null ? void 0 : s.taskui;
  return a === "v1" || a === "v2" ? a : "v3";
}
function Kr() {
  return Ea() === "v2";
}
function Mr() {
  return Ea() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = Mr();
window.apya.taskDetailV2Enabled = Kr() && !window.apya.taskDetailV3Enabled;
const ra = {
  open: (t) => {
    re.open(t);
  },
  close: () => re.close(),
  onResult: (t) => re.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(ra) : window.apya.taskDetail = ra;
function na() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = ia(t), t._reactRoot.render(/* @__PURE__ */ e.jsx(Ir, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = ua();
    a && re.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", na) : na();
function Rr({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(Qe, { children: /* @__PURE__ */ e.jsx(
    $a,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(Qe, { children: /* @__PURE__ */ e.jsx(
    ka,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) });
}
const xt = document.getElementById("task-detail-page-island");
if (xt) {
  const t = xt.getAttribute("data-task-id");
  t && ia(xt).render(/* @__PURE__ */ e.jsx(Rr, { taskId: t }));
}
