import { j as e, r as f, d as Ie, b as Xt } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { a as Ve } from "./QueryProvider-AIUp_Zk5.js";
import { u as ne, a as se, b as oe } from "./query-vendor-Bf69L2iP.js";
import { D as ea, i as ta, g as ot, B as ae, I as Be, S as he } from "./Dialog-BdNKdiS6.js";
import { C as Aa } from "./Combobox-Cgzidxen.js";
import { r as za } from "./httpClient-CRlyQ1eg.js";
import { R as ge, T as ye, P as ve, C as je, A as La, a as aa, D as Ia, b as Ba, c as Ka, d as Ra, e as Ma } from "./ui-vendor-DaE-uom6.js";
import { d as sa } from "./draggableActivation-Ybw9Upbh.js";
function Fa({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: n,
  footer: i,
  children: l
}) {
  return /* @__PURE__ */ e.jsx(
    ea,
    {
      open: t,
      onOpenChange: (o) => {
        o || a();
      },
      children: /* @__PURE__ */ e.jsx(
        ta,
        {
          title: r,
          fullscreen: s,
          onInteractOutside: (o) => {
            o.preventDefault(), a();
          },
          onEscapeKeyDown: (o) => {
            o.preventDefault(), a();
          },
          children: /* @__PURE__ */ e.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
            n,
            /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: l }),
            i
          ] })
        }
      )
    }
  );
}
function Ga({ title: t, header: a, footer: s, children: r }) {
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
function qa({ isPrivate: t }) {
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
const ct = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, dt = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function Oa({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: n,
  fullscreen: i = !1
}) {
  const [l, o] = f.useState(!1), c = f.useRef(null);
  f.useEffect(() => {
    if (!l) return;
    const d = (g) => {
      c.current && !c.current.contains(g.target) && o(!1);
    }, p = (g) => {
      g.key === "Escape" && o(!1);
    };
    return document.addEventListener("mousedown", d), document.addEventListener("keydown", p), () => {
      document.removeEventListener("mousedown", d), document.removeEventListener("keydown", p);
    };
  }, [l]);
  const x = ct[t == null ? void 0 : t.status] ?? ct[1], h = dt[t == null ? void 0 : t.priority] ?? dt[2], u = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), o(!1);
  }, b = () => {
    var p, g, m, w;
    const d = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (p = navigator.clipboard) == null || p.writeText(d), (w = (m = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : m.info) == null || w.call(m, "Bağlantı kopyalandı."), o(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(ot, { variant: x.variant, children: x.text }),
        /* @__PURE__ */ e.jsx(ot, { variant: h.variant, children: h.text }),
        /* @__PURE__ */ e.jsx(qa, { isPrivate: t == null ? void 0 : t.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": i ? "Küçült" : "Tam ekrana büyüt",
          onClick: n,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: i ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
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
            onClick: () => o((d) => !d),
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
                      o(!1), r();
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
const Ya = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function Ua({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: n }) {
  const i = Ya(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: i ? `Son kayıt: ${i}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(ae, { variant: "secondary", onClick: r, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        ae,
        {
          variant: "primary",
          onClick: () => n == null ? void 0 : n(),
          disabled: !a || !n,
          isLoading: s,
          loadingText: "Kaydediliyor…",
          children: "Kaydet"
        }
      )
    ] })
  ] }) });
}
const $t = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", _a = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function me({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function Ha({ value: t, onChange: a }) {
  const [s, r] = f.useState(""), n = () => {
    const i = s.trim();
    i && !t.includes(i) && a([...t, i]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((i) => /* @__PURE__ */ e.jsxs(ot, { variant: "neutral", children: [
      i,
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${i} etiketini kaldır`,
          onClick: () => a(t.filter((l) => l !== i)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, i)) }),
    /* @__PURE__ */ e.jsx(
      Be,
      {
        value: s,
        onChange: (i) => r(i.target.value),
        onKeyDown: (i) => {
          i.key === "Enter" || i.key === "," ? (i.preventDefault(), n()) : i.key === "Backspace" && !s && t.length && a(t.slice(0, -1));
        },
        onBlur: n,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function Va({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: n = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(me, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      Be,
      {
        id: "task-title",
        value: t.title,
        onChange: (i) => s("title", i.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(me, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (i) => s("status", Number(i.target.value)),
          className: $t,
          children: Object.entries(ct).map(([i, l]) => /* @__PURE__ */ e.jsx("option", { value: i, children: l.text }, i))
        }
      ) }),
      /* @__PURE__ */ e.jsx(me, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (i) => s("priority", Number(i.target.value)),
          className: $t,
          children: Object.entries(dt).map(([i, l]) => /* @__PURE__ */ e.jsx("option", { value: i, children: l.text }, i))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(me, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      Aa,
      {
        id: "task-assignee",
        options: r,
        value: t.assigneeId,
        onChange: (i) => s("assigneeId", i),
        placeholder: n ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: n
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(me, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        Be,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (i) => s("startDate", i.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(me, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        Be,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (i) => s("dueDate", i.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(me, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(Ha, { value: t.tagNames, onChange: (i) => s("tagNames", i) }) }),
    /* @__PURE__ */ e.jsx(me, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (i) => s("description", i.target.value),
        className: _a
      }
    ) })
  ] });
}
const Et = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function Ae({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function Qa({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(Ae, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(Ae, { label: "Oluşturulma zamanı", value: Et(t.creationTime) }),
      /* @__PURE__ */ e.jsx(Ae, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(Ae, { label: "Son güncelleme zamanı", value: Et(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(Ae, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const Za = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", Wa = "border-brand-500 text-text-primary";
function Ja({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: n }) {
  const i = f.useRef(/* @__PURE__ */ new Map()), l = (c) => {
    var x;
    s(c.code), (x = i.current.get(c.code)) == null || x.focus();
  }, o = (c, x) => {
    c.key === "ArrowRight" ? (c.preventDefault(), l(t[(x + 1) % t.length])) : c.key === "ArrowLeft" ? (c.preventDefault(), l(t[(x - 1 + t.length) % t.length])) : c.key === "Home" ? (c.preventDefault(), l(t[0])) : c.key === "End" && (c.preventDefault(), l(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((c, x) => {
      const h = c.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (u) => {
            u ? i.current.set(c.code, u) : i.current.delete(c.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${c.code}`,
          "aria-selected": h,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: h ? 0 : -1,
          onClick: () => s(c.code),
          onKeyDown: (u) => o(u, x),
          className: `${Za} ${h ? Wa : ""}`,
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
        "aria-expanded": n,
        onClick: r,
        className: "mx-1 grid h-8 w-8 flex-none place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" })
      }
    )
  ] });
}
const Xa = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function es({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [n, i] = f.useState(""), l = f.useMemo(() => {
    const o = n.trim().toLocaleLowerCase("tr-TR"), c = o ? t.filter((h) => h.title.toLocaleLowerCase("tr-TR").includes(o)) : t, x = /* @__PURE__ */ new Map();
    return c.forEach((h) => {
      const u = x.get(h.category) ?? [];
      u.push(h), x.set(h.category, u);
    }), x;
  }, [t, n]);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Özellik ekle",
      className: "absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl",
      children: [
        /* @__PURE__ */ e.jsx(
          Be,
          {
            autoFocus: !0,
            value: n,
            onChange: (o) => i(o.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          l.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...l.entries()].map(([o, c]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: Xa[o] ?? o }),
            c.map((x) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa ${x.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: x.title }),
              !x.implemented && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              x.implemented && !x.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === x.code,
                  onClick: () => a(x.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              x.implemented && x.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === x.code,
                  onClick: () => s(x.code),
                  className: "text-[13px] font-medium text-text-negative hover:underline disabled:opacity-50",
                  children: "Kaldır"
                }
              )
            ] }, x.code))
          ] }, o))
        ] })
      ]
    }
  );
}
function ts({ trail: t = [], current: a, onNavigate: s }) {
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
function as(t) {
  var s, r, n;
  const a = (n = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : n.task;
  return a ? Promise.resolve(a.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function pt(t) {
  return ne({
    queryKey: ["task-detail", t],
    queryFn: () => as(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function Je(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
function ra() {
  const [t, a] = f.useState(!1), [s, r] = f.useState(!1), n = f.useRef(null), i = f.useCallback(() => a(!0), []), l = f.useCallback(() => a(!1), []);
  f.useEffect(() => {
    if (!t) return;
    const x = (h) => {
      h.preventDefault(), h.returnValue = "";
    };
    return window.addEventListener("beforeunload", x), () => window.removeEventListener("beforeunload", x);
  }, [t]);
  const o = f.useCallback((x) => {
    if (!t) {
      x == null || x();
      return;
    }
    n.current = x ?? null, r(!0);
  }, [t]), c = f.useCallback((x) => {
    const h = n.current;
    return r(!1), n.current = null, x === "discard" && (a(!1), h == null || h()), x === "save" ? h : null;
  }, []);
  return { isDirty: t, markDirty: i, markClean: l, requestClose: o, pendingClose: s, resolvePendingClose: c };
}
const ss = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, mt = "task";
function na() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(mt);
  return t && ss.test(t) ? t : null;
}
function ia() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(mt), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function la(t, a) {
  const s = f.useRef(a);
  s.current = a, f.useEffect(() => {
    if (!t || na() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(mt, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), f.useEffect(() => {
    const r = () => {
      var n;
      (n = s.current) == null || n.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const rs = {
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
function ns(t) {
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
  } : rs;
}
function oa(t) {
  const [a, s] = f.useState(t == null ? void 0 : t.id), r = f.useMemo(() => ns(t), [t]), [n, i] = f.useState(r), [l, o] = f.useState({});
  (t == null ? void 0 : t.id) !== a && (s(t == null ? void 0 : t.id), i(r), o({}));
  const c = f.useCallback((d, p) => {
    i((g) => ({ ...g, [d]: p }));
  }, []), x = f.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(r),
    [n, r]
  ), h = f.useCallback(() => {
    const d = {};
    return n.title.trim() || (d.title = "Başlık zorunlu."), n.startDate || (d.startDate = "Başlangıç tarihi zorunlu."), n.dueDate && n.startDate && n.dueDate < n.startDate && (d.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), o(d), Object.keys(d).length === 0;
  }, [n]), u = f.useCallback(() => ({
    title: n.title.trim(),
    description: n.description || null,
    startDate: n.startDate,
    dueDate: n.dueDate || null,
    status: n.status,
    priority: n.priority,
    assigneeId: n.assigneeId,
    boardColumnId: (t == null ? void 0 : t.boardColumnId) ?? null,
    projectId: n.projectId ?? null,
    parentTaskId: (t == null ? void 0 : t.parentTaskId) ?? null,
    isPrivate: !!n.isPrivate,
    predecessorIds: (t == null ? void 0 : t.predecessorIds) ?? [],
    tagNames: n.tagNames,
    estimatedHours: n.estimatedHours,
    taskType: n.taskType || null,
    sprint: n.sprint || null
  }), [n, t]), b = f.useCallback(() => {
    i(r), o({});
  }, [r]);
  return { values: n, setField: c, isDirty: x, errors: l, validate: h, toUpdateDto: u, reset: b };
}
function Pt(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function is() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ca() {
  var n;
  const t = ne({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: is,
    staleTime: 3e5,
    retry: !1
  }), a = ((n = t.data) == null ? void 0 : n.items) ?? [], s = a.map((i) => ({ value: i.id, label: Pt(i) })), r = new Map(a.map((i) => [i.id, Pt(i)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function xt() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function ls(t) {
  const a = xt();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function da(t) {
  const a = se(), s = ["task-features", t], r = ne({
    queryKey: s,
    queryFn: () => ls(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = oe({
    mutationFn: (o) => Promise.resolve(xt().addFeature(t, o)),
    onSuccess: n
  }), l = oe({
    mutationFn: (o) => Promise.resolve(xt().removeFeature(t, o)),
    onSuccess: n
  });
  return {
    assignedCodes: r.data ?? [],
    isLoading: r.isLoading,
    addFeature: i.mutateAsync,
    removeFeature: l.mutateAsync,
    mutatingCode: i.variables ?? l.variables ?? null,
    isMutating: i.isPending || l.isPending
  };
}
const Qe = {
  0: { label: "İptal", icon: "fa-ban", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  1: { label: "Yapılacak", icon: "fa-clock", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  2: { label: "Sürüyor", icon: "fa-spinner", bg: "bg-warning-subtle", fg: "text-warning", dot: "bg-warning" },
  3: { label: "Testte", icon: "fa-flask", bg: "bg-primary-subtle", fg: "text-primary", dot: "bg-primary" },
  4: { label: "Tamamlandı", icon: "fa-circle-check", bg: "bg-success-subtle", fg: "text-success", dot: "bg-success" }
}, ut = {
  1: { label: "Düşük", icon: "fa-arrow-down", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  2: { label: "Orta", icon: "fa-minus", bg: "bg-warning-subtle", fg: "text-warning" },
  3: { label: "Yüksek", icon: "fa-arrow-up", bg: "bg-negative-subtle", fg: "text-negative" },
  4: { label: "Kritik", icon: "fa-flag", bg: "bg-negative-subtle", fg: "text-negative" }
}, xa = [1, 2, 3, 4], os = [1, 2, 3, 4], Re = (t) => Qe[t] ?? Qe[1], ua = (t) => ut[t] ?? ut[2];
function Me(t) {
  if (!t) return "—";
  const a = String(t).trim().split(/\s+/).filter(Boolean);
  return a.length ? (a.length > 1 ? a[0][0] + a[a.length - 1][0] : a[0].slice(0, 2)).toUpperCase() : "—";
}
function Fe(t) {
  return t ? "var(--apya-brand-500)" : "var(--apya-neutral-500)";
}
function cs(t, a = /* @__PURE__ */ new Date()) {
  if (!t) return { tone: "text-text-tertiary", hint: "" };
  const s = new Date(t);
  if (Number.isNaN(s.getTime())) return { tone: "text-text-tertiary", hint: "" };
  const r = Math.ceil((s.setHours(0, 0, 0, 0) - new Date(a).setHours(0, 0, 0, 0)) / 864e5);
  return r < 0 ? { tone: "text-negative", hint: `${Math.abs(r)} gün gecikti` } : r === 0 ? { tone: "text-warning", hint: "Bugün" } : r <= 3 ? { tone: "text-warning", hint: `${r} gün kaldı` } : { tone: "text-text-tertiary", hint: `${r} gün kaldı` };
}
const De = "rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden";
function Ze({ title: t, badge: a, action: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3.5 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: t }),
      a
    ] }),
    s
  ] });
}
function ds({ children: t, tone: a = "positive" }) {
  const s = a === "positive" ? "bg-success-subtle text-success" : "bg-neutral-subtle text-text-secondary";
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-full font-mono text-[11px] font-bold ${s}`, children: t });
}
function We({ children: t, bg: a, fg: s }) {
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-[7px] text-[10.5px] font-bold ${a} ${s}`, children: t });
}
function Ke({ icon: t, title: a, description: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 px-6 py-10 text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-xl text-text-tertiary` }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: a }),
    s && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] leading-[1.55] text-text-tertiary max-w-[420px]", children: s })
  ] });
}
function pa({ name: t, size: a = 24 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Fe(t), fontSize: a * 0.4 },
      title: t || void 0,
      children: Me(t)
    }
  );
}
const ma = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—", At = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function fa(t) {
  return t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toFixed(1)} MB` : "0 KB";
}
function Xe(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = Math.floor(a / 3600), r = Math.floor(a % 3600 / 60);
  return !s && !r ? `${a}sn` : s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function xs(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = (r) => String(r).padStart(2, "0");
  return `${s(Math.floor(a / 3600))}:${s(Math.floor(a / 60) % 60)}:${s(a % 60)}`;
}
const be = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  image: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  sheet: { icon: "fa-file-excel", bg: "bg-success-subtle", fg: "text-success" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  zip: { icon: "fa-file-zipper", bg: "bg-warning-subtle", fg: "text-warning" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
}, zt = (t = "") => ba(t) === be.image;
function ba(t = "") {
  var s;
  const a = ((s = t.split(".").pop()) == null ? void 0 : s.toLowerCase()) ?? "";
  return a === "pdf" ? be.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(a) ? be.image : ["doc", "docx", "odt", "rtf", "txt"].includes(a) ? be.doc : ["xls", "xlsx", "csv", "ods"].includes(a) ? be.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(a) ? be.code : ["zip", "rar", "7z", "tar", "gz"].includes(a) ? be.zip : be.other;
}
function us({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, n] = f.useState(""), [i, l] = f.useState(!1), o = se(), c = (a == null ? void 0 : a.subTasks) ?? [], x = c.filter((d) => d.status === 4).length, h = () => o.invalidateQueries({ queryKey: ["task-detail", t] }), u = async () => {
    var p, g, m;
    const d = r.trim();
    if (d) {
      l(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: d,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), n(""), await h();
      } catch (w) {
        (m = (g = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : g.error) == null || m.call(g, (w == null ? void 0 : w.message) || "Alt görev eklenemedi.");
      } finally {
        l(!1);
      }
    }
  }, b = async (d, p) => {
    var g, m, w;
    d.stopPropagation();
    try {
      await Promise.resolve(window.apya.platform.tasks.task.updateStatus(p.id, p.status === 4 ? 1 : 4)), await h();
    } catch (k) {
      (w = (m = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : m.error) == null || w.call(m, (k == null ? void 0 : k.message) || "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        c.length > 0 && /* @__PURE__ */ e.jsxs(ds, { children: [
          x,
          "/",
          c.length
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
    /* @__PURE__ */ e.jsxs("div", { className: De, children: [
      c.map((d) => {
        const p = Re(d.status), g = d.status === 4;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => s == null ? void 0 : s(d.id, d.title),
            onKeyDown: (m) => {
              m.key === "Enter" && (s == null || s(d.id, d.title));
            },
            className: "flex items-center gap-3.5 px-4 py-3.5 border-t border-subtle first:border-t-0 hover:bg-surface-raised cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": `${d.title} tamamlandı işaretle`,
                  onClick: (m) => b(m, d),
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white cursor-pointer ${g ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: g && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: d.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${g ? "line-through text-text-tertiary" : "text-text-primary"}`, children: d.title }),
              /* @__PURE__ */ e.jsx(We, { bg: p.bg, fg: p.fg, children: p.label }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: ma(d.dueDate) }),
              /* @__PURE__ */ e.jsx(pa, { name: d.assigneeName }),
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-right shrink-0 text-[10px] text-text-tertiary" })
            ]
          },
          d.id
        );
      }),
      /* @__PURE__ */ e.jsx("div", { className: "px-4 py-3 border-t border-subtle first:border-t-0", children: /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: r,
          onChange: (d) => n(d.target.value),
          onKeyDown: (d) => {
            d.key === "Enter" && u();
          },
          disabled: i,
          placeholder: "Yeni alt görev başlığı",
          className: "w-full h-9 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      ) })
    ] }),
    c.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz alt görev yok." })
  ] });
}
function ha() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function ps(t) {
  const a = ha();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function ms(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, n = za();
  n && (r.RequestVerificationToken = n);
  const i = await fetch(`/api/tasks/attachments/upload/${t}`, {
    method: "POST",
    credentials: "include",
    headers: r,
    body: s
  });
  let l = null;
  try {
    l = await i.json();
  } catch {
  }
  if (!i.ok || (l == null ? void 0 : l.success) === !1)
    throw new Error((l == null ? void 0 : l.error) || "Dosya yüklenemedi.");
  return l;
}
function ft(t) {
  const a = se(), s = ["task-attachments", t], r = ne({
    queryKey: s,
    queryFn: () => ps(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = oe({
    mutationFn: (o) => ms(t, o),
    onSuccess: n
  }), l = oe({
    mutationFn: (o) => Promise.resolve(ha().deleteAttachment(o)),
    onSuccess: n
  });
  return {
    attachments: r.data ?? [],
    isLoading: r.isLoading,
    upload: i.mutateAsync,
    remove: l.mutateAsync,
    isUploading: i.isPending
  };
}
function fs({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: n } = ft(t), i = se(), l = f.useRef(null), [o, c] = f.useState(!1), x = Je("Platform.Tasks.ShareExternally"), h = async (d, p) => {
    var g, m, w;
    try {
      await window.apya.platform.tasks.taskShare.setAttachmentGuestVisibility(d, p), i.invalidateQueries({ queryKey: ["task-attachments", t] });
    } catch (k) {
      (w = (m = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : m.error) == null || w.call(m, (k == null ? void 0 : k.message) || "Görünürlük değiştirilemedi.");
    }
  }, u = async (d) => {
    var p, g, m, w, k, T;
    if (d)
      try {
        await s(d), (m = (g = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : g.success) == null || m.call(g, "Dosya yüklendi.");
      } catch ($) {
        (T = (k = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : k.error) == null || T.call(k, ($ == null ? void 0 : $.message) || "Dosya yüklenemedi.");
      } finally {
        l.current && (l.current.value = "");
      }
  }, b = async (d, p) => {
    var g, m, w;
    try {
      await r(d);
    } catch (k) {
      (w = (m = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : m.error) == null || w.call(m, (k == null ? void 0 : k.message) || `${p} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: l,
        type: "file",
        className: "hidden",
        onChange: (d) => {
          var p;
          return u((p = d.target.files) == null ? void 0 : p[0]);
        },
        disabled: n
      }
    ),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "button",
        tabIndex: 0,
        onClick: () => {
          var d;
          return (d = l.current) == null ? void 0 : d.click();
        },
        onKeyDown: (d) => {
          var p;
          d.key === "Enter" && ((p = l.current) == null || p.click());
        },
        onDragOver: (d) => {
          d.preventDefault(), o || c(!0);
        },
        onDragLeave: () => c(!1),
        onDrop: (d) => {
          var p, g;
          d.preventDefault(), c(!1), u((g = (p = d.dataTransfer) == null ? void 0 : p.files) == null ? void 0 : g[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${o ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-[26px] ${o ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: n ? "Yükleniyor…" : o ? "Bırakın, yükleyelim" : "Dosyaları buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, PDF, DOCX · max 25MB" })
        ]
      }
    ),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3", children: a.map((d) => {
      const p = ba(d.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${p.bg} ${p.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${p.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: d.fileName, children: d.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: fa(d.fileSize) })
              ] })
            ] }),
            x && !d.isGuestUpload && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 text-[11px] text-text-tertiary cursor-pointer", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: !!d.isVisibleToGuests,
                  onChange: (g) => h(d.id, g.target.checked)
                }
              ),
              "Dış paylaşımda görünsün"
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2.5 border-t border-subtle", children: [
              /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[11px] text-text-tertiary", children: [
                d.uploaderName,
                d.isGuestUpload ? " · dış" : ""
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-1 shrink-0", children: [
                /* @__PURE__ */ e.jsx(
                  "a",
                  {
                    href: d.downloadUrl,
                    target: "_blank",
                    rel: "noreferrer",
                    title: "İndir",
                    "aria-label": `${d.fileName} dosyasini indir`,
                    className: "flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-primary-subtle hover:text-primary",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-download text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Sil",
                    "aria-label": `${d.fileName} dosyasini sil`,
                    onClick: () => b(d.id, d.fileName),
                    className: "flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                )
              ] })
            ] })
          ]
        },
        d.id
      );
    }) })
  ] });
}
function _e() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function bs(t) {
  const a = _e();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function bt(t) {
  const a = se(), s = ["task-checklist", t], r = ne({
    queryKey: s,
    queryFn: () => bs(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = oe({
    mutationFn: (c) => Promise.resolve(_e().addChecklistItem(t, c)),
    onSuccess: n
  }), l = oe({
    mutationFn: (c) => Promise.resolve(_e().toggleChecklistItem(c)),
    onSuccess: n
  }), o = oe({
    mutationFn: (c) => Promise.resolve(_e().deleteChecklistItem(c)),
    onSuccess: n
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: i.mutateAsync,
    toggleItem: l.mutateAsync,
    removeItem: o.mutateAsync
  };
}
function hs({ taskId: t }) {
  const { items: a, isLoading: s, addItem: r, toggleItem: n, removeItem: i } = bt(t), [l, o] = f.useState(""), c = a.filter((u) => u.isDone).length, x = a.length ? Math.round(c / a.length * 100) : 0, h = async () => {
    var b, d, p;
    const u = l.trim();
    if (!(!u || !t)) {
      o("");
      try {
        await r(u);
      } catch (g) {
        o(u), (p = (d = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : d.error) == null || p.call(d, (g == null ? void 0 : g.message) || "Madde eklenemedi.");
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
        x
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mt-3.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
      "div",
      {
        className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
        style: { width: `${x}%` }
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
      s && a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 py-2 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
      !s && a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 py-2 text-[12.5px] text-text-tertiary", children: "Henüz madde yok. Aşağıdan ilk maddeyi ekleyin." }),
      a.map((u) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": u.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
            onClick: () => n(u.id).catch((b) => {
              var d, p, g;
              return (g = (p = (d = window == null ? void 0 : window.abp) == null ? void 0 : d.notify) == null ? void 0 : p.error) == null ? void 0 : g.call(p, (b == null ? void 0 : b.message) || "Durum güncellenemedi.");
            }),
            className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white cursor-pointer transition-colors duration-fast ${u.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
            children: u.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${u.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: u.text }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            title: "Sil",
            "aria-label": `${u.text} maddesini sil`,
            onClick: () => i(u.id).catch((b) => {
              var d, p, g;
              return (g = (p = (d = window == null ? void 0 : window.abp) == null ? void 0 : d.notify) == null ? void 0 : p.error) == null ? void 0 : g.call(p, (b == null ? void 0 : b.message) || "Madde silinemedi.");
            }),
            className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
          }
        )
      ] }, u.id)),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: l,
          onChange: (u) => o(u.target.value),
          onKeyDown: (u) => {
            u.key === "Enter" && h();
          },
          placeholder: "Yeni madde yaz ve Enter'a bas…",
          "aria-label": "Yeni kontrol listesi maddesi",
          className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      )
    ] })
  ] });
}
function gs({ taskId: t, task: a }) {
  const [s, r] = f.useState(""), [n, i] = f.useState(null), [l, o] = f.useState(""), [c, x] = f.useState(!1), h = se(), u = (a == null ? void 0 : a.comments) ?? [], b = async (p) => {
    var g, m, w, k, T, $;
    if (p == null || p.preventDefault(), !(!s.trim() || c)) {
      x(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), h.invalidateQueries({ queryKey: ["task-detail", t] }), (w = (m = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : m.success) == null || w.call(m, "Yorum eklendi.");
      } catch (B) {
        ($ = (T = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : T.error) == null || $.call(T, (B == null ? void 0 : B.message) || "Yorum eklenemedi.");
      } finally {
        x(!1);
      }
    }
  }, d = async (p) => {
    var g, m, w, k, T, $;
    if (!(!l.trim() || c)) {
      x(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(p, l.trim())
        ), o(""), i(null), h.invalidateQueries({ queryKey: ["task-detail", t] }), (w = (m = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : m.success) == null || w.call(m, "Yanıt eklendi.");
      } catch (B) {
        ($ = (T = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : T.error) == null || $.call(T, (B == null ? void 0 : B.message) || "Yanıt eklenemedi.");
      } finally {
        x(!1);
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
          onChange: (p) => r(p.target.value),
          placeholder: "Bir yorum veya güncelleme yazın...",
          className: "w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ e.jsx(
        ae,
        {
          type: "submit",
          variant: "primary",
          disabled: !s.trim() || c,
          isLoading: c,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    u.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: u.map((p) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: p.creatorUserName || p.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: p.creationTime ? new Date(p.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: p.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        ae,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => i(n === p.id ? null : p.id),
          children: "Yanıtla"
        }
      ) }),
      n === p.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: l,
            onChange: (g) => o(g.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(ae, { variant: "ghost", size: "sm", onClick: () => i(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(ae, { variant: "primary", size: "sm", disabled: !l.trim() || c, onClick: () => d(p.id), children: "Gönder" })
        ] })
      ] }),
      p.replies && p.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: p.replies.map((g) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: g.creatorUserName || g.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: g.creationTime ? new Date(g.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: g.text })
      ] }, g.id)) })
    ] }, p.id)) })
  ] });
}
function et() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.taskShare) ?? null;
}
function ys(t) {
  const a = se(), s = ["task-share-links", t], r = ne({
    queryKey: s,
    queryFn: () => {
      const o = et();
      return o ? Promise.resolve(o.getList(t)) : Promise.reject(new Error("Paylaşım servisi yüklenmedi."));
    },
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = oe({
    mutationFn: (o) => Promise.resolve(et().create({ ...o, taskId: t })),
    onSuccess: n
  }), l = oe({
    mutationFn: (o) => Promise.resolve(et().revoke(o)),
    onSuccess: n
  });
  return {
    links: r.data ?? [],
    /* isLoading DEĞİL isPending: kalıcı önbellek geri yüklenirken isLoading
       FALSE döner ama liste henüz yoktur; sekme o karede "henüz kimseyle
       paylaşılmadı" yazıyordu — paylaşımı olan görevde bile. */
    isPending: r.isPending,
    error: r.error,
    create: i.mutateAsync,
    revoke: l.mutateAsync,
    isCreating: i.isPending
  };
}
const Lt = {
  recipientName: "",
  recipientEmail: "",
  lifetimeDays: 14,
  allowComment: !0,
  allowUpload: !0,
  allowDownload: !0
};
function vs(t) {
  return t ? new Date(t).toLocaleDateString("tr-TR") : "—";
}
function js({ taskId: t }) {
  const { links: a, isPending: s, create: r, revoke: n, isCreating: i } = ys(t), [l, o] = f.useState(Lt), [c, x] = f.useState(null);
  if (!Je("Platform.Tasks.ShareExternally"))
    return /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Görevi ekip dışıyla paylaşma yetkiniz yok." });
  const u = (m) => (w) => {
    const k = w.target.type === "checkbox" ? w.target.checked : w.target.value;
    o((T) => ({ ...T, [m]: k }));
  }, b = async (m) => {
    var w, k, T;
    if (m.preventDefault(), !!l.recipientName.trim())
      try {
        const $ = await r({
          ...l,
          lifetimeDays: Number(l.lifetimeDays) || 14
        });
        x($), o(Lt);
      } catch ($) {
        (T = (k = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : k.error) == null || T.call(k, ($ == null ? void 0 : $.message) || "Paylaşım linki üretilemedi.");
      }
  }, d = (m) => `${window.location.origin}${m}`, p = (m) => {
    var w, k, T, $;
    (w = navigator.clipboard) == null || w.writeText(d(m)), ($ = (T = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : T.info) == null || $.call(T, "Bağlantı kopyalandı.");
  }, g = async (m) => {
    var w, k, T;
    try {
      await n(m);
    } catch ($) {
      (T = (k = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : k.error) == null || T.call(k, ($ == null ? void 0 : $.message) || "Bağlantı iptal edilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    c && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 rounded-[14px] border border-focus bg-primary-subtle p-3.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "text-[12.5px] font-bold text-text-primary", children: [
        "Bağlantı hazır — ",
        /* @__PURE__ */ e.jsx("span", { className: "font-normal", children: "şimdi kopyalayın, bir daha gösterilmeyecek." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("code", { className: "min-w-0 flex-1 truncate rounded-[8px] bg-surface-base px-2.5 py-2 font-mono text-[11.5px] text-text-secondary", children: d(c.url) }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => p(c.url),
            className: "rounded-[8px] bg-primary px-3 py-2 text-[12px] font-bold text-white cursor-pointer",
            children: "Kopyala"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => x(null),
            className: "rounded-[8px] px-3 py-2 text-[12px] font-bold text-text-tertiary cursor-pointer hover:text-text-primary",
            children: "Kapat"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("form", { onSubmit: b, className: "flex flex-col gap-2.5 rounded-[14px] border border-subtle bg-surface-base p-3.5", children: [
      /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary", children: "Yeni paylaşım bağlantısı" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2.5", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            required: !0,
            value: l.recipientName,
            onChange: u("recipientName"),
            placeholder: "Kime? (ad soyad)",
            className: "min-w-0 flex-[2_1_180px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "email",
            value: l.recipientEmail,
            onChange: u("recipientEmail"),
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
            onChange: u("lifetimeDays"),
            title: "Geçerlilik (gün)",
            className: "w-[92px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: l.allowComment, onChange: u("allowComment") }),
          "Yorum yazabilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: l.allowUpload, onChange: u("allowUpload") }),
          "Dosya yükleyebilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: l.allowDownload, onChange: u("allowDownload") }),
          "Dosya indirebilsin"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: "Bağlantı bu görevi ve alt görevlerini açar. Ekip içi yorumlar gösterilmez." }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "submit",
            disabled: i,
            className: "shrink-0 rounded-[8px] bg-primary px-3.5 py-2 text-[12px] font-bold text-white cursor-pointer disabled:opacity-60",
            children: i ? "Üretiliyor…" : "Bağlantı üret"
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
              m.isActive ? `${vs(m.expiresAt)} tarihine kadar geçerli` : m.revokedAt ? "İptal edildi" : "Süresi doldu",
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
function ws({ task: t }) {
  var s;
  const a = [];
  return t != null && t.creationTime && a.push({
    id: "created",
    icon: "fa-plus",
    bg: "bg-success-subtle",
    fg: "text-success",
    actor: t.creatorUserName || t.creatorName || "Sistem / Kullanıcı",
    event: "görevi oluşturdu",
    time: At(t.creationTime)
  }), t != null && t.lastModificationTime && a.push({
    id: "modified",
    icon: "fa-pen",
    bg: "bg-warning-subtle",
    fg: "text-warning",
    actor: t.lastModifierUserName || t.lastModifierName || "Kullanıcı",
    event: "görevi güncelledi",
    time: At(t.lastModificationTime)
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
    a.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Aktivite kaydı bulunamadı." }) }) : /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: a.map((r, n) => {
      const i = n === a.length - 1;
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
const Se = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : null;
function Ns({ label: t, value: a, hint: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4 px-3.5 py-3", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[12.5px] font-semibold text-text-secondary", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 text-right", children: [
      /* @__PURE__ */ e.jsx("span", { className: "block text-[12.5px] font-bold text-text-primary break-words", children: a ?? "—" }),
      s && /* @__PURE__ */ e.jsx("span", { className: "block text-[11px] text-text-tertiary", children: s })
    ] })
  ] });
}
function ks({ task: t = {}, nameById: a }) {
  const s = (n) => {
    var i;
    return n && ((i = a == null ? void 0 : a.get) == null ? void 0 : i.call(a, n)) || null;
  }, r = [
    { label: "Görev kodu", value: t.code || "—" },
    {
      label: "Oluşturulma",
      value: Se(t.creationTime),
      hint: s(t.creatorId) ? `${s(t.creatorId)} tarafından` : null
    },
    {
      label: "Son güncelleme",
      value: Se(t.lastModificationTime) ?? "Henüz güncellenmedi",
      hint: s(t.lastModifierId) ? `${s(t.lastModifierId)} tarafından` : null
    },
    { label: "Planlanan başlangıç", value: Se(t.startDate) },
    { label: "Termin", value: Se(t.dueDate) }
  ];
  return t.completedDate && r.push({ label: "Tamamlanma", value: Se(t.completedDate) }), t.cancelledDate && r.push({
    label: "İptal",
    value: Se(t.cancelledDate),
    hint: t.cancelReason || null
  }), /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-3.5 py-3 border-b border-subtle bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clock-rotate-left text-[13px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: "Kayıt bilgileri" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "divide-y divide-subtle", children: r.map((n) => /* @__PURE__ */ e.jsx(Ns, { ...n }, n.label)) })
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
function tt({ label: t, value: a, tone: s, note: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: `font-mono text-[22px] font-bold tracking-[-.02em] ${s}`, style: { fontVariantNumeric: "tabular-nums" }, children: a }),
    r && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
  ] });
}
function Cs({ task: t, spentByCurrency: a }) {
  const s = t == null ? void 0 : t.plannedAmount;
  if (!(t != null && t.budgetLineId) || s == null)
    return null;
  const r = a, n = s - r, i = s > 0 ? Math.round(r / s * 100) : 0, l = n < 0;
  return /* @__PURE__ */ e.jsxs("div", { className: De, children: [
    /* @__PURE__ */ e.jsx(Ze, { title: "Bütçe bağı" }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-4 pb-4 pt-1 flex flex-col gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-semibold text-accent", children: t.budgetLineName || "Bütçe kalemi" }),
        t.budgetLineRemaining != null && /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "kalemde kalan ",
          we(t.budgetLineRemaining, "TRY")
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3", children: [
        /* @__PURE__ */ e.jsx(at, { label: "Görev bütçesi", value: we(s, "TRY") }),
        /* @__PURE__ */ e.jsx(at, { label: "Gerçekleşen", value: we(r, "TRY") }),
        /* @__PURE__ */ e.jsx(
          at,
          {
            label: "Kalan",
            value: we(n, "TRY"),
            tone: l ? "text-negative" : "text-success"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: `h-full rounded-full ${l ? "bg-negative" : i >= 80 ? "bg-warning" : "bg-success"}`,
            style: { width: `${Math.min(Math.max(i, 0), 100)}%` }
          }
        ) }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-1 text-[11.5px] text-text-tertiary", children: [
          "%",
          i,
          l && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative", children: "· görev bütçesi aşıldı" })
        ] })
      ] })
    ] })
  ] });
}
function at({ label: t, value: a, tone: s }) {
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
function Ds({ task: t }) {
  const a = (t == null ? void 0 : t.expenses) || [], s = (t == null ? void 0 : t.incomes) || [], r = a.filter((c) => (c.currency || "TRY") === "TRY").reduce((c, x) => c + (x.amount || 0), 0), n = /* @__PURE__ */ e.jsx(Cs, { task: t, spentByCurrency: r });
  if (a.length === 0 && s.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      n,
      /* @__PURE__ */ e.jsxs("div", { className: De, children: [
        /* @__PURE__ */ e.jsx(Ze, { title: "Görev Finansı" }),
        /* @__PURE__ */ e.jsx(
          Ke,
          {
            icon: "fa-coins",
            title: "Kayıt yok",
            description: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
          }
        )
      ] })
    ] });
  const l = Array.from(new Set([...a, ...s].map((c) => c.currency || "TRY"))).map((c) => {
    const x = s.filter((u) => (u.currency || "TRY") === c).reduce((u, b) => u + (b.amount || 0), 0), h = a.filter((u) => (u.currency || "TRY") === c).reduce((u, b) => u + (b.amount || 0), 0);
    return { cur: c, inc: x, exp: h, net: x - h };
  }), o = [
    ...s.map((c) => ({ ...c, kind: "income" })),
    ...a.map((c) => ({ ...c, kind: "expense" }))
  ].sort((c, x) => new Date(x.date || 0) - new Date(c.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    n,
    l.map(({ cur: c, inc: x, exp: h, net: u }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(tt, { label: `Toplam Gelir (${c})`, value: we(x, c), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(tt, { label: `Toplam Gider (${c})`, value: we(h, c), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        tt,
        {
          label: `Net Bakiye (${c})`,
          value: we(u, c),
          tone: u >= 0 ? "text-success" : "text-negative",
          note: u >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, c)),
    /* @__PURE__ */ e.jsxs("div", { className: De, children: [
      /* @__PURE__ */ e.jsx(Ze, { title: "Finans kalemleri" }),
      o.map((c) => /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-7 w-7 rounded-lg bg-neutral-subtle text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c.kind === "income" ? "fa-arrow-down" : "fa-arrow-up"} text-[11px]` }) }),
            /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] font-semibold text-text-primary", children: c.title || (c.kind === "income" ? "Gelir" : "Gider") }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: ma(c.date) }),
            c.kind === "income" ? /* @__PURE__ */ e.jsx(We, { bg: "bg-success-subtle", fg: "text-success", children: "Gelir" }) : /* @__PURE__ */ e.jsx(We, { bg: "bg-warning-subtle", fg: "text-warning", children: "Gider" }),
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
function Ts({ taskId: t }) {
  const { attachments: a, isLoading: s, upload: r, remove: n, isUploading: i } = ft(t), l = f.useRef(null), [o, c] = f.useState(!1), x = a.filter((b) => zt(b.fileName)), h = async (b) => {
    var d, p, g, m, w, k, T, $, B;
    if (b) {
      if (!zt(b.name)) {
        (g = (p = (d = window == null ? void 0 : window.abp) == null ? void 0 : d.notify) == null ? void 0 : p.error) == null || g.call(p, "Galeriye yalnız görsel dosya yüklenebilir.");
        return;
      }
      try {
        await r(b), (k = (w = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : w.success) == null || k.call(w, "Görsel yüklendi.");
      } catch (z) {
        (B = ($ = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : $.error) == null || B.call($, (z == null ? void 0 : z.message) || "Görsel yüklenemedi.");
      } finally {
        l.current && (l.current.value = "");
      }
    }
  }, u = async (b, d) => {
    var p, g, m;
    try {
      await n(b);
    } catch (w) {
      (m = (g = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : g.error) == null || m.call(g, (w == null ? void 0 : w.message) || `${d} silinemedi.`);
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
        onChange: (b) => {
          var d;
          return h((d = b.target.files) == null ? void 0 : d[0]);
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
          var b;
          return (b = l.current) == null ? void 0 : b.click();
        },
        onKeyDown: (b) => {
          var d;
          b.key === "Enter" && ((d = l.current) == null || d.click());
        },
        onDragOver: (b) => {
          b.preventDefault(), o || c(!0);
        },
        onDragLeave: () => c(!1),
        onDrop: (b) => {
          var d, p;
          b.preventDefault(), c(!1), h((p = (d = b.dataTransfer) == null ? void 0 : d.files) == null ? void 0 : p[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${o ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${i ? "fa-circle-notch fa-spin" : "fa-images"} text-[26px] ${o ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: i ? "Yükleniyor…" : o ? "Bırakın, yükleyelim" : "Görselleri buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, JPG, GIF, WEBP, SVG · max 25MB" })
        ]
      }
    ),
    s && x.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !s && x.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görevde henüz görsel yok. Yüklediğiniz görseller Dosyalar sekmesinde de görünür." }),
    x.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3", children: x.map((b) => /* @__PURE__ */ e.jsxs(
      "figure",
      {
        className: "group relative m-0 flex flex-col overflow-hidden rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
        children: [
          /* @__PURE__ */ e.jsx(
            "a",
            {
              href: b.downloadUrl,
              target: "_blank",
              rel: "noreferrer",
              title: `${b.fileName} — tam boyutta aç`,
              className: "block aspect-[4/3] overflow-hidden bg-neutral-subtle",
              children: /* @__PURE__ */ e.jsx(
                "img",
                {
                  src: b.downloadUrl,
                  alt: b.fileName,
                  loading: "lazy",
                  className: "h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                }
              )
            }
          ),
          /* @__PURE__ */ e.jsxs("figcaption", { className: "flex items-center justify-between gap-2 p-2.5", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12px] font-bold text-text-primary", title: b.fileName, children: b.fileName }),
              /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: fa(b.fileSize) })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                title: "Sil",
                "aria-label": `${b.fileName} gorselini sil`,
                onClick: () => u(b.id, b.fileName),
                className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
              }
            )
          ] })
        ]
      },
      b.id
    )) })
  ] });
}
const Ss = {
  0: "bg-neutral-400",
  1: "bg-text-tertiary",
  2: "bg-warning",
  3: "bg-primary",
  4: "bg-success"
};
function st(t) {
  if (!t) return null;
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? null : a;
}
const ze = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
function $s({ task: t = {} }) {
  const a = f.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((l, o) => ({
    id: l.id || `row-${o}`,
    name: l.title || "Başlıksız görev",
    isMain: !!l.__main,
    start: st(l.startDate),
    end: st(l.dueDate) || st(l.completedDate),
    status: l.status ?? 1
  })), [t]), { min: s, span: r } = f.useMemo(() => {
    const i = a.flatMap((c) => [c.start, c.end]).filter(Boolean).map((c) => c.getTime());
    if (i.length === 0) return { min: null, span: 0 };
    const l = Math.min(...i), o = Math.max(...i);
    return { min: l, span: Math.max(1, o - l) };
  }, [a]), n = f.useMemo(() => s === null ? [] : [0, 1, 2, 3].map((i) => new Date(s + r * i / 4)), [s, r]);
  return s === null ? /* @__PURE__ */ e.jsx("div", { className: De, children: /* @__PURE__ */ e.jsx(
    Ke,
    {
      icon: "fa-bars-staggered",
      title: "Zaman çizelgesi çizilemiyor",
      description: "Görevde veya alt görevlerde başlangıç–bitiş tarihi tanımlı olmalı."
    }
  ) }) : /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Zaman çizelgesi" }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] text-text-tertiary", children: [
        ze(new Date(s)),
        " – ",
        ze(new Date(s + r))
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-4 gap-0 pl-[170px] mb-2 lt-860:pl-[110px]", children: n.map((i, l) => /* @__PURE__ */ e.jsx(
      "span",
      {
        className: "pl-2 border-l border-subtle text-[10.5px] font-bold uppercase tracking-[.06em] text-text-tertiary",
        children: ze(i)
      },
      l
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: a.map((i) => {
      const l = i.start ? i.start.getTime() : s, o = i.end ? Math.max(i.end.getTime(), l) : l, c = (l - s) / r * 100, x = Math.max(2, (o - l) / r * 100), h = Math.max(1, Math.round((o - l) / 864e5));
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
            className: `absolute top-[7px] bottom-[7px] flex items-center px-2.5 rounded-[7px] shadow-xs ${Ss[i.status] || "bg-primary"}`,
            style: { left: `${c}%`, width: `${x}%` },
            title: `${ze(i.start)} – ${ze(i.end)}`,
            children: /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[10.5px] font-bold text-white", children: [
              h,
              "g"
            ] })
          }
        ) })
      ] }, i.id);
    }) })
  ] });
}
function It({ icon: t, iconTone: a, title: s, note: r, children: n }) {
  return /* @__PURE__ */ e.jsxs("div", { className: De, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[12px] ${a}` }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: s }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
    ] }),
    n
  ] });
}
function Es({ task: t = {} }) {
  const a = se(), s = t.predecessorIds || [], r = () => {
    var c, x, h;
    return (h = (x = (c = window == null ? void 0 : window.apya) == null ? void 0 : c.platform) == null ? void 0 : x.tasks) == null ? void 0 : h.task;
  }, { data: n = [], isLoading: i } = ne({
    queryKey: ["task-predecessors", t.id, s],
    queryFn: async () => {
      const c = r();
      return c ? Promise.all(
        s.map(
          (x) => Promise.resolve(c.get(x)).catch(() => ({ id: x, title: "(erişilemeyen görev)", status: null, code: "—" }))
        )
      ) : [];
    },
    enabled: s.length > 0,
    staleTime: 3e4,
    retry: !1
  }), l = async (c) => {
    var x, h, u, b, d, p;
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
      })), await a.invalidateQueries({ queryKey: ["task-detail", t.id] }), (u = (h = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : h.info) == null || u.call(h, "Bağlantı kaldırıldı.");
    } catch (g) {
      (p = (d = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : d.error) == null || p.call(d, (g == null ? void 0 : g.message) || "Bağlantı kaldırılamadı.");
    }
  }, o = (c) => {
    var x, h, u;
    return (u = (h = (x = window == null ? void 0 : window.apya) == null ? void 0 : x.taskDetail) == null ? void 0 : h.open) == null ? void 0 : u.call(h, c);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsx(
      It,
      {
        icon: "fa-arrow-left-long",
        iconTone: "text-warning",
        title: "Öncül görevler",
        note: "bu görev başlamadan tamamlanmalı",
        children: s.length === 0 ? /* @__PURE__ */ e.jsx(Ke, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : i ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : n.map((c) => {
          const x = c.status == null ? null : Re(c.status);
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
                    onClick: () => o(c.id),
                    className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                    children: c.title || "Başlıksız görev"
                  }
                ),
                x && /* @__PURE__ */ e.jsx(We, { bg: x.bg, fg: x.fg, children: x.label }),
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
      It,
      {
        icon: "fa-arrow-right-long",
        iconTone: "text-primary",
        title: "Ardıl görevler",
        note: "bu görev bitince başlar",
        children: /* @__PURE__ */ e.jsx(
          Ke,
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
function $e() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task) || null;
}
function Ps(t) {
  const a = se(), s = ["task-timelogs", t], r = ["task-active-timelog"], n = ne({
    queryKey: s,
    queryFn: () => {
      var x;
      return Promise.resolve((x = $e()) == null ? void 0 : x.getTimeLogs(t));
    },
    enabled: !!t && !!$e(),
    staleTime: 15e3,
    retry: !1
  }), i = ne({
    queryKey: r,
    queryFn: () => {
      var x;
      return Promise.resolve((x = $e()) == null ? void 0 : x.getActiveTimeLog());
    },
    enabled: !!$e(),
    staleTime: 5e3,
    retry: !1
  }), l = () => {
    a.invalidateQueries({ queryKey: s }), a.invalidateQueries({ queryKey: r });
  }, o = oe({
    mutationFn: () => {
      var x;
      return Promise.resolve((x = $e()) == null ? void 0 : x.startTimeTracking(t));
    },
    onSuccess: l
  }), c = oe({
    mutationFn: () => {
      var x;
      return Promise.resolve((x = $e()) == null ? void 0 : x.stopTimeTracking(t));
    },
    onSuccess: l
  });
  return {
    logs: n.data ?? [],
    isLoading: n.isLoading,
    activeLog: i.data ?? null,
    start: o.mutateAsync,
    stop: c.mutateAsync,
    isMutating: o.isPending || c.isPending
  };
}
function Bt(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function As({ taskId: t, task: a = {} }) {
  const s = Ps(t), r = s.activeLog && s.activeLog.taskId === t ? s.activeLog : null, [n, i] = f.useState(() => Date.now());
  f.useEffect(() => {
    if (!r) return;
    const p = setInterval(() => i(Date.now()), 1e3);
    return () => clearInterval(p);
  }, [r]);
  const l = r ? Math.max(0, Math.floor((n - new Date(r.startTime).getTime()) / 1e3)) : 0, c = s.logs.reduce((p, g) => p + (g.secondsSpent || 0), 0) + l, x = (a == null ? void 0 : a.estimatedHours) ?? null, h = x ? x * 3600 : 0, u = h ? Math.min(100, Math.round(c / h * 100)) : 0, b = h ? Math.max(0, h - c) : 0, d = async () => {
    var p, g, m;
    try {
      r ? await s.stop() : await s.start();
    } catch (w) {
      (m = (g = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : g.error) == null || m.call(g, (w == null ? void 0 : w.message) || "Zaman takibi güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-5 flex-wrap p-[22px] rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[18px]", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: d,
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
              children: xs(c)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary", children: r ? "Kayıt sürüyor" : "Sayaç duraklatıldı" })
        ] })
      ] }),
      h > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] font-bold text-text-secondary", children: "Tahmin kullanımı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
            Xe(c),
            " / ",
            x,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-warning", style: { width: `${u}%` } }) }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "Kalan tahmini süre: ",
          Xe(b)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: De, children: [
      /* @__PURE__ */ e.jsx(Ze, { title: "Zaman kayıtları" }),
      s.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : s.logs.length === 0 ? /* @__PURE__ */ e.jsx(
        Ke,
        {
          icon: "fa-stopwatch",
          title: "Henüz zaman kaydı yok",
          description: "Soldaki yeşil düğmeyle sayacı çalıştırın; durdurduğunuzda kayıt buraya düşer."
        }
      ) : s.logs.map((p) => {
        const g = !p.endTime;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
            children: [
              /* @__PURE__ */ e.jsx(pa, { name: p.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: p.note || p.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                Bt(p.startTime),
                " → ",
                g ? "sürüyor" : Bt(p.endTime)
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary", children: g ? "Aktif" : Xe(p.secondsSpent || 0) })
            ]
          },
          p.id
        );
      })
    ] })
  ] });
}
const Ge = [
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
    component: us
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
    component: fs
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
    component: hs
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
    component: $s
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
    component: Es
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
    component: Ds
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
    component: ks
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
    component: ws,
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
    component: gs,
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
    component: js
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
    component: As
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
    component: Ts
  }
];
function ga(t = []) {
  const a = new Set(t);
  return Ge.filter((s) => !s.hidden).filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function zs(t = []) {
  const a = new Set(t);
  return Ge.filter((s) => !s.hidden).filter((s) => !s.isCore).filter((s) => !s.permission || Je(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let Oe = null;
const He = /* @__PURE__ */ new Set(), rt = /* @__PURE__ */ new Set();
function Kt() {
  He.forEach((t) => t());
}
function Ls(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const re = {
  open(t) {
    const a = Ls(t);
    a && (Oe = a, Kt());
  },
  close() {
    Oe = null, Kt();
  },
  subscribe(t) {
    return He.add(t), () => He.delete(t);
  },
  getSnapshot() {
    return Oe;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && rt.add(t);
  },
  emitResult() {
    rt.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    Oe = null, He.clear(), rt.clear();
  }
}, Rt = "apya.taskDetail.fullscreen";
function ya({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, n] = f.useState(t), [i, l] = f.useState([]), { data: o, isPending: c, isError: x, refetch: h } = pt(r), u = ra(), b = oa(o), d = ca(), p = da(r), [g, m] = f.useState("general"), [w, k] = f.useState(!1), T = Ie.useRef(null), $ = f.useMemo(
    () => ga(p.assignedCodes),
    [p.assignedCodes]
  ), B = f.useMemo(
    () => zs(p.assignedCodes),
    [p.assignedCodes]
  ), z = $.find((A) => A.code === g) ?? $[0];
  Ie.useEffect(() => {
    z.code !== g && m(z.code);
  }, [z, g]);
  const W = z == null ? void 0 : z.component, M = se(), [q, U] = f.useState(
    () => {
      var A;
      return ((A = window.localStorage) == null ? void 0 : A.getItem(Rt)) === "1";
    }
  ), [K, _] = f.useState(!1), J = f.useCallback(() => {
    ia(), s == null || s();
  }, [s]);
  la(t, J), Ie.useEffect(() => {
    b.isDirty ? u.markDirty() : u.markClean();
  });
  const V = f.useCallback(() => u.requestClose(J), [u, J]), X = f.useCallback(() => {
    U((A) => {
      var G;
      const I = !A;
      return (G = window.localStorage) == null || G.setItem(Rt, I ? "1" : "0"), I;
    });
  }, []), O = Je("Platform.Tasks.Delete"), [ee, j] = f.useState(!1), [v, y] = f.useState(!1), D = f.useCallback(async () => {
    var A, I, G, te, Z, Ne;
    y(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (G = (I = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : I.info) == null || G.call(I, "Başarıyla silindi."), j(!1), u.markClean(), J();
    } catch (xe) {
      (Ne = (Z = (te = window == null ? void 0 : window.abp) == null ? void 0 : te.notify) == null ? void 0 : Z.error) == null || Ne.call(Z, (xe == null ? void 0 : xe.message) || "Görev silinemedi.");
    } finally {
      y(!1);
    }
  }, [r, u, J]), E = f.useCallback(async () => {
    var A, I, G, te, Z, Ne;
    if (!b.validate()) return !1;
    _(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, b.toUpdateDto())
      ), await M.invalidateQueries({ queryKey: ["task-detail", r] }), re.emitResult(), (G = (I = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : I.success) == null || G.call(I, "Kaydedildi."), !0;
    } catch (xe) {
      return (Ne = (Z = (te = window == null ? void 0 : window.abp) == null ? void 0 : te.notify) == null ? void 0 : Z.error) == null || Ne.call(Z, (xe == null ? void 0 : xe.message) || "Kaydedilemedi."), !1;
    } finally {
      _(!1);
    }
  }, [r, b, u, M]), H = f.useCallback(() => {
    E();
  }, [E]), ce = f.useCallback(async () => {
    const A = u.resolvePendingClose("save");
    await E() && (A == null || A());
  }, [u, E]), N = f.useCallback((A, I) => {
    u.requestClose(() => {
      l((G) => [...G, { id: r, title: (o == null ? void 0 : o.title) ?? "" }]), n(A), m("general"), u.markClean();
    });
  }, [u, r, o]), L = f.useCallback((A) => {
    u.requestClose(() => {
      l((I) => {
        const G = I.findIndex((te) => te.id === A);
        return G === -1 ? I : I.slice(0, G);
      }), n(A), m("general"), u.markClean();
    });
  }, [u]), P = f.useCallback(async (A) => {
    var I, G, te;
    try {
      await p.addFeature(A), m(A), k(!1);
    } catch (Z) {
      (te = (G = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : G.error) == null || te.call(G, (Z == null ? void 0 : Z.message) || "Özellik eklenemedi.");
    }
  }, [p]), F = f.useCallback(async (A) => {
    var I, G, te;
    try {
      await p.removeFeature(A), m((Z) => Z === A ? "general" : Z);
    } catch (Z) {
      (te = (G = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : G.error) == null || te.call(G, (Z == null ? void 0 : Z.message) || "Özellik kaldırılamadı.");
    }
  }, [p]);
  Ie.useEffect(() => {
    if (!w) return;
    const A = (G) => {
      T.current && !T.current.contains(G.target) && k(!1);
    }, I = (G) => {
      G.key === "Escape" && k(!1);
    };
    return document.addEventListener("mousedown", A), document.addEventListener("keydown", I), () => {
      document.removeEventListener("mousedown", A), document.removeEventListener("keydown", I);
    };
  }, [w]);
  const Y = c ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(he, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(he, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(he, { className: "h-24 w-full" })
  ] }) : x ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(ae, { variant: "ghost", onClick: () => h(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      ts,
      {
        trail: i,
        current: { id: r, title: (o == null ? void 0 : o.title) ?? "" },
        onNavigate: L
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: T, children: [
      /* @__PURE__ */ e.jsx(
        Ja,
        {
          tabs: $,
          activeCode: z.code,
          onSelect: (A) => {
            m(A), k(!1);
          },
          onOpenPicker: () => k((A) => !A),
          pickerOpen: w
        }
      ),
      w && /* @__PURE__ */ e.jsx(
        es,
        {
          entries: B,
          busyCode: p.isMutating ? p.mutatingCode : null,
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
            Va,
            {
              values: b.values,
              errors: b.errors,
              onFieldChange: b.setField,
              assigneeOptions: d.options,
              isLoadingAssignees: d.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(f.Suspense, { fallback: /* @__PURE__ */ e.jsx(he, { className: "h-24 w-full" }), children: W && /* @__PURE__ */ e.jsx(
            W,
            {
              taskId: r,
              task: o,
              onOpenSubtask: N
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            Qa,
            {
              task: o,
              creatorName: d.nameById.get(o.creatorId),
              lastModifierName: d.nameById.get(o.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), ie = a === "page" ? Ga : Fa;
  return /* @__PURE__ */ e.jsxs(
    ie,
    {
      open: !0,
      fullscreen: q,
      onRequestClose: V,
      title: o ? `Görev Detayı: ${o.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        Oa,
        {
          task: o ?? { title: "Yükleniyor…" },
          canDelete: O,
          fullscreen: q,
          onToggleFullscreen: X,
          onClose: V,
          onDelete: () => j(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        Ua,
        {
          lastSavedAt: o == null ? void 0 : o.lastModificationTime,
          isDirty: u.isDirty,
          isSaving: K,
          onCancel: V,
          onSave: H
        }
      ),
      children: [
        Y,
        u.pendingClose && /* @__PURE__ */ e.jsx(
          Bs,
          {
            isSaving: K,
            onStay: () => u.resolvePendingClose("stay"),
            onDiscard: () => u.resolvePendingClose("discard"),
            onSaveAndClose: ce
          }
        ),
        ee && /* @__PURE__ */ e.jsx(
          Is,
          {
            taskTitle: (o == null ? void 0 : o.title) ?? "",
            busy: v,
            onCancel: () => j(!1),
            onConfirm: D
          }
        )
      ]
    }
  );
}
function Is({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [n, i] = f.useState(""), l = n.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    va,
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
            value: n,
            onChange: (o) => i(o.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function va({ label: t, title: a, description: s, children: r, actions: n }) {
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
        /* @__PURE__ */ e.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: n })
      ] })
    }
  );
}
function Bs({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    va,
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
function Ce(t) {
  return (t == null ? void 0 : t.closest('[role="dialog"]')) ?? void 0;
}
const Ks = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function Rs({ isPrivate: t = !1, onChange: a = () => {
} }) {
  const s = !!t, [r, n] = f.useState(null);
  return /* @__PURE__ */ e.jsxs(ge, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(ye, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
      "button",
      {
        ref: n,
        type: "button",
        className: "flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-default transition-all shadow-sm",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${s ? "fa-lock" : "fa-globe"} text-[11px] text-text-tertiary` }),
          /* @__PURE__ */ e.jsx("span", { children: s ? "Özel görev" : "Herkese açık" }),
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[10px] ml-0.5 text-text-tertiary" })
        ]
      }
    ) }),
    /* @__PURE__ */ e.jsx(ve, { container: Ce(r), children: /* @__PURE__ */ e.jsxs(
      je,
      {
        sideOffset: 8,
        align: "end",
        className: "z-50 w-[360px] rounded-2xl border border-subtle bg-surface-base p-4 shadow-float animate-in fade-in-50 zoom-in-95",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle pb-3 mb-3", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shield-halved text-primary text-base" }),
            /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary", children: "Görünürlük" })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: Ks.map((i) => {
            const l = s === i.value;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => a(i.value),
                className: `flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${l ? "border-primary bg-primary-subtle/40" : "border-subtle hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${i.icon} text-base mt-0.5 ${l ? "text-primary" : "text-text-tertiary"}` }),
                  /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ e.jsx("h4", { className: "text-[13px] font-semibold text-text-primary", children: i.title }),
                      l && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ] }),
                    /* @__PURE__ */ e.jsx("p", { className: "text-[12px] text-text-tertiary mt-0.5", children: i.desc })
                  ] })
                ]
              },
              String(i.value)
            );
          }) }),
          /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-text-tertiary mt-3", children: "Değişiklik “Kaydet” ile uygulanır." }),
          /* @__PURE__ */ e.jsx(La, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const Mt = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto", Ms = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", Fs = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" },
  { what: "Bağlantı kopyala", key: "⌘ L" }
];
function Gs({ children: t }) {
  return /* @__PURE__ */ e.jsx(aa, { asChild: !0, children: t });
}
function qs({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "inline-flex items-center h-[19px] px-1.5 rounded-[5px] border border-default border-b-2 bg-neutral-subtle font-mono text-[10px] font-semibold text-text-secondary", children: t });
}
function Os({
  task: t = {},
  presentation: a = "modal",
  onClose: s,
  isFullscreen: r,
  onToggleFullscreen: n,
  onFieldChange: i = () => {
  },
  statusValue: l,
  titleValue: o,
  isPrivateValue: c,
  isFavorite: x,
  onToggleFavorite: h,
  isWatched: u,
  onToggleWatch: b,
  onDuplicate: d,
  onArchive: p,
  onDelete: g,
  onOpenTransfer: m,
  onSaveAsTemplate: w,
  onConvertToSubtask: k,
  onExportPdf: T
}) {
  const [$, B] = f.useState(!1), [z, W] = f.useState(null), [M, q] = f.useState(!1), U = f.useRef(null), K = Ce(z), _ = Re(l ?? t.status), J = t.code || "GRV-—", V = () => {
    var j;
    (j = navigator.clipboard) == null || j.writeText(J), B(!0), setTimeout(() => B(!1), 1800);
  }, X = () => {
    var j, v, y, D;
    (j = navigator.clipboard) == null || j.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), (D = (y = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : y.success) == null || D.call(y, "Görev bağlantısı panoya kopyalandı.");
  }, O = (j) => () => {
    q(!1), j == null || j();
  }, ee = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", kbd: "⌘L", onClick: O(X) },
    { label: "Çoğalt", icon: "fa-copy", kbd: "⌘D", onClick: O(d) },
    { label: "Başka projeye kopyala", icon: "fa-clone", onClick: O(() => m == null ? void 0 : m("copy")) },
    { label: "Şablon olarak kaydet", icon: "fa-bookmark", onClick: O(w) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, onClick: O(() => m == null ? void 0 : m("move")) },
    { label: "Alt göreve dönüştür", icon: "fa-diagram-project", onClick: O(k) },
    { label: u ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: O(b) },
    { label: "Arşivle", icon: "fa-box-archive", separator: !0, onClick: O(p) },
    { label: "Yazdır", icon: "fa-print", kbd: "⌘P", onClick: O(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: O(T) },
    { label: "Sil", icon: "fa-trash-can", kbd: "⌫", separator: !0, danger: !0, onClick: O(g) }
  ];
  return /* @__PURE__ */ e.jsxs("header", { ref: W, className: "shrink-0 px-6 lt-860:px-4 pt-[18px] pb-4 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: V,
            title: "Kodu kopyala",
            className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[11px] font-bold tracking-[.04em] cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[9px] opacity-70" }),
              /* @__PURE__ */ e.jsx("span", { children: J }),
              /* @__PURE__ */ e.jsx("i", { className: `${$ ? "fa-solid fa-check" : "fa-regular fa-copy"} text-[9px] opacity-60` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(ge, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(ye, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
          /* @__PURE__ */ e.jsx(ve, { container: K, children: /* @__PURE__ */ e.jsxs(je, { sideOffset: 6, align: "start", className: `${Mt} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            xa.map((j) => {
              const v = Qe[j], y = (l ?? t.status) === j;
              return /* @__PURE__ */ e.jsx(Gs, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => i("status", j),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${y ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${v.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: v.label }),
                    y && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, j);
            })
          ] }) })
        ] }),
        u && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 h-[26px] px-2.5 rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11.5px] font-semibold", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-eye text-[10px]" }),
          "Takip ediliyor"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
        /* @__PURE__ */ e.jsx("div", { className: "lt-860:hidden", children: /* @__PURE__ */ e.jsx(
          Rs,
          {
            isPrivate: c ?? !!t.isPrivate,
            onChange: (j) => i("isPrivate", j)
          }
        ) }),
        /* @__PURE__ */ e.jsx("div", { className: "h-5 w-px bg-border-default mx-1" }),
        a === "modal" && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: n,
            title: r ? "Küçült" : "Tam ekran",
            className: `mobile:hidden flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${r ? "bg-primary-subtle text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r ? "fa-compress" : "fa-expand"} text-[12px]` })
          }
        ),
        /* @__PURE__ */ e.jsxs(ge, { modal: !0, open: M, onOpenChange: q, children: [
          /* @__PURE__ */ e.jsx(ye, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer seçenekler",
              className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${M ? "bg-surface-hover text-text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(ve, { container: K, children: /* @__PURE__ */ e.jsxs(
            je,
            {
              sideOffset: 6,
              align: "end",
              collisionBoundary: K ?? [],
              collisionPadding: 12,
              className: `${Mt} w-[244px]`,
              children: [
                ee.map((j) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: j.onClick,
                    className: [
                      Ms,
                      j.danger ? "text-negative" : "text-text-secondary",
                      j.separator ? "border-t border-subtle mt-[5px]" : ""
                    ].join(" "),
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${j.icon} text-[11px] w-[14px] opacity-75` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: j.label }),
                      j.kbd && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: j.kbd })
                    ]
                  },
                  j.label
                )),
                /* @__PURE__ */ e.jsxs("div", { className: "mt-1.5 pt-[9px] px-[9px] pb-[7px] border-t border-subtle", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 mb-[7px]", children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-keyboard text-[11px] text-text-tertiary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-[.09em] text-text-tertiary", children: "Kısayollar" })
                  ] }),
                  Fs.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: j.what }),
                    /* @__PURE__ */ e.jsx(qs, { children: j.key })
                  ] }, j.what))
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
          ref: U,
          contentEditable: !0,
          suppressContentEditableWarning: !0,
          spellCheck: !1,
          onBlur: (j) => i("title", j.currentTarget.textContent.trim()),
          className: "flex-1 min-w-0 text-[24px] lt-560:text-[20px] font-extrabold tracking-[-.025em] leading-[1.2] text-text-primary px-2 -ml-2 py-[3px] rounded-[9px] border border-transparent cursor-text hover:bg-neutral-subtle hover:border-subtle focus:bg-neutral-subtle focus:border-focus focus:shadow-focus focus:outline-none",
          children: o ?? t.title ?? "Başlıksız görev"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: h,
          title: x ? "Favorilerden çıkar" : "Favorilere ekle",
          className: `flex items-center justify-center h-8 w-8 shrink-0 rounded-[9px] cursor-pointer ${x ? "bg-warning-subtle text-warning" : "text-text-tertiary hover:bg-surface-hover"}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${x ? "solid" : "regular"} fa-star text-[15px]` })
        }
      )
    ] })
  ] });
}
const Ye = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", Ft = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function fe({ children: t }) {
  return /* @__PURE__ */ e.jsx(aa, { asChild: !0, children: t });
}
function ue({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[7px] min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.08em] text-text-tertiary select-none", children: t }),
    a
  ] });
}
function Gt({ name: t, size: a = 26 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Fe(t), fontSize: a * 0.38 },
      children: Me(t)
    }
  );
}
function qt(t) {
  if (t == null) return "—";
  const a = Math.max(0, Math.round(Number(t) * 60)), s = Math.floor(a / 60), r = a % 60;
  return s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function Ys({
  task: t = {},
  assigneeOptions: a = [],
  projectOptions: s = [],
  onFieldChange: r = () => {
  },
  statusValue: n,
  priorityValue: i,
  assigneeValue: l,
  projectValue: o,
  dueDateValue: c,
  startDateValue: x,
  tagsValue: h = [],
  progressPercent: u = 0,
  progressNote: b = "",
  onOpenTransfer: d
}) {
  var j, v;
  const [p, g] = f.useState(""), [m, w] = f.useState(""), [k, T] = f.useState(""), [$, B] = f.useState(!1), [z, W] = f.useState(null), M = Re(n ?? t.status), q = ua(i ?? t.priority), U = l ?? t.assigneeId ?? null, K = o ?? t.projectId ?? null, _ = ((j = a.find((y) => y.value === U)) == null ? void 0 : j.label) || t.assigneeName || "Atanmamış", J = ((v = s.find((y) => y.value === K)) == null ? void 0 : v.label) || t.projectName || "Projesiz", V = cs(c ?? t.dueDate), X = a.filter(
    (y) => !p || y.label.toLowerCase().includes(p.toLowerCase())
  ), O = s.filter(
    (y) => !m || y.label.toLowerCase().includes(m.toLowerCase())
  ), ee = () => {
    const y = k.trim();
    y && !h.includes(y) && r("tagNames", [...h, y]), T(""), B(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { ref: W, className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6", children: [
    /* @__PURE__ */ e.jsx(ue, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(ge, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(ye, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx(Gt, { name: U ? _ : null }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: _ }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ve, { container: Ce(z), children: /* @__PURE__ */ e.jsxs(je, { sideOffset: 6, align: "start", className: `${Ye} w-[264px]`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: p,
              onChange: (y) => g(y.target.value),
              placeholder: "Kişi ara…",
              className: Ft
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[230px] overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("assigneeId", null),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] text-left cursor-pointer ${U ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary font-semibold"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex h-6 w-6 items-center justify-center rounded-full bg-neutral-subtle text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-user-slash text-[9px]" }) }),
                /* @__PURE__ */ e.jsx("span", { children: "Atanmamış" })
              ]
            }
          ) }),
          a.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-2 py-1.5 text-[12px] text-text-tertiary", children: "Kullanıcı listesi yükleniyor…" }),
          X.map((y) => /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("assigneeId", y.value),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${U === y.value ? "bg-primary-subtle" : "hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx(Gt, { name: y.label, size: 24 }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: y.label }),
                U === y.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
              ]
            }
          ) }, y.value))
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ e.jsxs(ue, { label: "Son tarih", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
        /* @__PURE__ */ e.jsx("i", { className: `fa-regular fa-calendar text-[13px] ${V.tone}` }),
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
      V.hint && /* @__PURE__ */ e.jsx("span", { className: `-mt-0.5 text-[10.5px] font-semibold ${V.tone}`, children: V.hint })
    ] }),
    /* @__PURE__ */ e.jsx(ue, { label: "Başlangıç", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[13px] text-text-tertiary" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          value: (x ?? t.startDate ?? "").slice(0, 10),
          onChange: (y) => r("startDate", y.target.value),
          className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 pt-[5px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: [
          "%",
          u
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-medium text-text-tertiary", children: b })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "h-1.5 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "h-full rounded-full bg-primary transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
          style: { width: `${u}%` }
        }
      ) })
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(ge, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(ye, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${M.bg} ${M.fg}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${M.icon} text-[11px]` }),
            /* @__PURE__ */ e.jsx("span", { children: M.label }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ve, { container: Ce(z), children: /* @__PURE__ */ e.jsxs(je, { sideOffset: 6, align: "start", className: `${Ye} w-[196px]`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
        xa.map((y) => {
          const D = Qe[y], E = (n ?? t.status) === y;
          return /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("status", y),
              className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${E ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${D.dot}` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: D.label }),
                E && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
              ]
            }
          ) }, y);
        })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(ge, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(ye, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
      /* @__PURE__ */ e.jsx(ve, { container: Ce(z), children: /* @__PURE__ */ e.jsxs(je, { sideOffset: 6, align: "start", className: `${Ye} w-[184px]`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
        os.map((y) => {
          const D = ut[y], E = (i ?? t.priority) === y;
          return /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("priority", y),
              className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${E ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${D.icon} text-[11px] w-[13px]` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: D.label }),
                E && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
              ]
            }
          ) }, y);
        })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap min-h-8", children: [
      h.map((y) => /* @__PURE__ */ e.jsxs(
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
                onClick: () => r("tagNames", h.filter((D) => D !== y)),
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
            y.key === "Enter" && ee(), y.key === "Escape" && (T(""), B(!1));
          },
          placeholder: "Etiket…",
          className: "h-6 w-24 px-2 rounded-[7px] border border-focus bg-surface-base text-text-primary text-[11.5px] shadow-focus focus:outline-none"
        }
      ) : /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          "aria-label": "Yeni etiket ekle",
          onClick: () => B(!0),
          className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-dashed border-strong bg-transparent text-text-tertiary text-[11.5px] font-semibold hover:border-focus hover:text-primary hover:bg-primary-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[9px]" }),
            "Etiket"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Proje", children: /* @__PURE__ */ e.jsxs(ge, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(ye, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
      /* @__PURE__ */ e.jsx(ve, { container: Ce(z), children: /* @__PURE__ */ e.jsxs(je, { sideOffset: 6, align: "start", className: `${Ye} w-[250px]`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: m,
              onChange: (y) => w(y.target.value),
              placeholder: "Proje ara…",
              className: Ft
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[210px] overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
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
          O.map((y) => /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
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
          /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => d == null ? void 0 : d("move"),
              className: "flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left text-text-secondary hover:bg-surface-hover hover:text-primary cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[11px] w-[14px] opacity-70" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Başka projeye taşı…" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => d == null ? void 0 : d("copy"),
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
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[13px] font-bold text-text-primary", children: qt(t.spentHours ?? 0) }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[12px] text-text-tertiary", children: [
        "/ ",
        t.estimatedHours != null ? qt(t.estimatedHours) : "—"
      ] })
    ] }) })
  ] }) });
}
function Us({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: n,
  onDragEnd: i,
  onReorderTo: l,
  onReorderDrop: o,
  onOpenPicker: c,
  counts: x = {},
  isDirty: h = !1
}) {
  const [u, b] = f.useState(!1);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-6 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 py-2.5 flex-1 min-w-0 overflow-x-auto custom-scrollbar", children: [
      s.map((d) => {
        const p = t === d.code, g = x[d.code] || 0;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            draggable: !0,
            title: "Sürükleyerek sırayı değiştirin",
            ...sa(() => a(d.code)),
            onDragStart: (m) => {
              n(d.code);
              try {
                m.dataTransfer.effectAllowed = "move", m.dataTransfer.setData("text/plain", d.code);
              } catch {
              }
            },
            onDragOver: (m) => {
              m.preventDefault(), l(d.code);
            },
            onDrop: (m) => {
              m.preventDefault(), o == null || o();
            },
            onDragEnd: i,
            className: [
              "flex shrink-0 items-center gap-2 h-[34px] px-[13px] rounded-[10px]",
              "text-[12.5px] whitespace-nowrap cursor-grab active:cursor-grabbing",
              "transition-opacity duration-fast",
              p ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
              r === d.code ? "opacity-35" : "opacity-100"
            ].join(" "),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.icon} text-[11px] opacity-85` }),
              /* @__PURE__ */ e.jsx("span", { children: d.title }),
              g > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                "rounded-full text-[10px] font-extrabold",
                p ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
              ].join(" "), children: g })
            ]
          },
          d.code
        );
      }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          title: "Özellik ekle",
          onClick: () => {
            b(!1), c();
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
    h && /* @__PURE__ */ e.jsxs("span", { className: "flex shrink-0 items-center gap-[7px] h-[26px] px-2.5 rounded-full bg-warning-subtle text-warning text-[11px] font-bold", children: [
      /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-warning animate-pulse" }),
      "Taslak"
    ] })
  ] });
}
function _s({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: n,
  onDragEnd: i,
  onReorderTo: l,
  onReorderDrop: o,
  onOpenPicker: c,
  counts: x = {}
}) {
  return /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Görev özellikleri",
      className: "flex lt-860:hidden flex-col gap-[3px] w-[238px] shrink-0 py-4 px-3 border-r border-subtle bg-surface-base overflow-y-auto custom-scrollbar",
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "px-2.5 pt-1 pb-2 text-[10px] font-extrabold uppercase tracking-[.1em] text-text-tertiary", children: "Özellikler" }),
        s.map((h) => {
          const u = t === h.code, b = x[h.code] || 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              draggable: !0,
              title: "Sürükleyerek sırayı değiştirin",
              ...sa(() => a(h.code)),
              onDragStart: (d) => {
                n(h.code);
                try {
                  d.dataTransfer.effectAllowed = "move", d.dataTransfer.setData("text/plain", h.code);
                } catch {
                }
              },
              onDragOver: (d) => {
                d.preventDefault(), l(h.code);
              },
              onDrop: (d) => {
                d.preventDefault(), o == null || o();
              },
              onDragEnd: i,
              className: [
                "flex shrink-0 items-center gap-[11px] h-9 px-[11px] rounded-[9px]",
                "text-[12.5px] text-left cursor-grab active:cursor-grabbing",
                "transition-opacity duration-fast",
                u ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
                r === h.code ? "opacity-35" : "opacity-100"
              ].join(" "),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${h.icon} text-[12px] w-[15px] opacity-85` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: h.title }),
                b > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                  "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                  "rounded-full text-[10px] font-extrabold",
                  u ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
                ].join(" "), children: b })
              ]
            },
            h.code
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
function Ee({ label: t, value: a, avatarName: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 py-[9px] border-t border-subtle", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-tertiary shrink-0", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
      s && /* @__PURE__ */ e.jsx(
        "span",
        {
          className: "flex shrink-0 items-center justify-center h-[21px] w-[21px] rounded-full text-[color:var(--apya-avatar-fg)] text-[8.5px] font-bold",
          style: { background: Fe(s) },
          children: Me(s)
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", title: typeof a == "string" ? a : void 0, children: a || "—" })
    ] })
  ] });
}
const Ot = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "—";
function Hs({ task: t = {}, nameById: a }) {
  const s = (i, l) => {
    var o;
    return i || l && ((o = a == null ? void 0 : a.get) == null ? void 0 : o.call(a, l)) || null;
  }, r = s(t.creatorName, t.creatorId), n = t.lastModificationTime ? s(t.lastModifierName, t.lastModifierId) : null;
  return /* @__PURE__ */ e.jsx("aside", { className: "flex flex-col gap-3.5 min-w-0", children: /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsx(Ee, { label: "Oluşturan", value: r || "Bilinmiyor", avatarName: r }),
    /* @__PURE__ */ e.jsx(Ee, { label: "Oluşturma tarihi", value: Ot(t.creationTime) }),
    /* @__PURE__ */ e.jsx(Ee, { label: "Güncelleyen", value: n || "—", avatarName: n }),
    /* @__PURE__ */ e.jsx(Ee, { label: "Son güncelleme", value: Ot(t.lastModificationTime) }),
    /* @__PURE__ */ e.jsx(Ee, { label: "Görev tipi", value: t.taskType }),
    /* @__PURE__ */ e.jsx(Ee, { label: "Sprint", value: t.sprint })
  ] }) });
}
const Vs = [
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
], Qs = '<table class="apya-rte-table"><tr><th>Kolon 1</th><th>Kolon 2</th></tr><tr><td>Değer</td><td>Değer</td></tr></table><p><br></p>', Zs = '<div class="apya-rte-imgph">görsel yer tutucu</div><p><br></p>';
function Ws(t) {
  return t ? /<[a-z][\s\S]*>/i.test(t) ? t : `<p>${t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>` : "";
}
function Js({ value: t, onChange: a, mentionName: s = "ekip arkadaşı" }) {
  const r = f.useRef(null), n = f.useRef(Ws(t)), [i, l] = f.useState(!1), [o, c] = f.useState("https://"), x = f.useRef(null), h = (m, w) => {
    var k, T;
    (k = r.current) == null || k.focus();
    try {
      document.execCommand(m, !1, w);
    } catch {
    }
    a == null || a(((T = r.current) == null ? void 0 : T.innerHTML) ?? "");
  }, u = () => {
    const m = window.getSelection();
    x.current = m && m.rangeCount ? m.getRangeAt(0).cloneRange() : null;
  }, b = () => {
    const m = x.current;
    if (!m) return;
    const w = window.getSelection();
    w.removeAllRanges(), w.addRange(m);
  }, d = () => {
    var w;
    const m = o.trim();
    l(!1), !(!m || m === "https://") && ((w = r.current) == null || w.focus(), b(), h("createLink", m), c("https://"));
  }, p = (m) => {
    switch (m.cmd) {
      case "link":
        u();
        return;
      case "image":
        h("insertHTML", Zs);
        return;
      case "table":
        h("insertHTML", Qs);
        return;
      case "mention":
        h("insertHTML", `<span class="apya-rte-mention">@${s}</span>&nbsp;`);
        return;
      default:
        h(m.cmd, m.arg);
    }
  }, g = "flex shrink-0 items-center justify-center h-7 w-7 rounded-[7px] border-0 bg-transparent text-text-secondary cursor-pointer hover:bg-surface-base hover:text-primary hover:shadow-xs";
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-[14px] border border-default bg-surface-base overflow-hidden shadow-xs", children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-0.5 px-2 py-1.5 border-b border-subtle bg-neutral-subtle overflow-x-auto custom-scrollbar", children: Vs.map((m) => {
      const w = /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          title: m.title,
          onMouseDown: (k) => {
            k.preventDefault(), p(m);
          },
          className: `${g} ${m.gap ? "ml-1.5" : ""}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${m.regular ? "regular" : "solid"} ${m.icon} text-[12px]` })
        },
        m.cmd + m.icon
      );
      return m.cmd !== "link" ? w : /* @__PURE__ */ e.jsxs(ge, { modal: !0, open: i, onOpenChange: l, children: [
        /* @__PURE__ */ e.jsx(ye, { asChild: !0, children: w }),
        /* @__PURE__ */ e.jsx(ve, { container: Ce(r.current), children: /* @__PURE__ */ e.jsxs(
          je,
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
                    value: o,
                    onChange: (k) => c(k.target.value),
                    onKeyDown: (k) => {
                      k.key === "Enter" && d();
                    },
                    className: "flex-1 min-w-0 h-[34px] px-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: d,
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
        dangerouslySetInnerHTML: { __html: n.current }
      }
    )
  ] });
}
const Yt = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
function nt({ name: t, size: a = 32 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Fe(t), fontSize: a * 0.34 },
      children: Me(t)
    }
  );
}
function Ut({ open: t, onClick: a }) {
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
const _t = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function Xs({
  task: t = {},
  onFieldChange: a = () => {
  },
  descriptionValue: s,
  checklist: r,
  currentUserName: n = "Ben"
}) {
  const i = t == null ? void 0 : t.id, l = se(), [o, c] = f.useState(!0), [x, h] = f.useState(""), u = (r == null ? void 0 : r.items) ?? [], b = u.filter((v) => v.isDone).length, d = u.length ? Math.round(b / u.length * 100) : 0, p = async () => {
    var y, D, E;
    const v = x.trim();
    if (!(!v || !i)) {
      h("");
      try {
        await r.addItem(v);
      } catch (H) {
        (E = (D = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : D.error) == null || E.call(D, (H == null ? void 0 : H.message) || "Madde eklenemedi.");
      }
    }
  }, [g, m] = f.useState(!0), [w, k] = f.useState(""), [T, $] = f.useState(!1), [B, z] = f.useState(!1), [W, M] = f.useState(null), [q, U] = f.useState(""), [K, _] = f.useState({}), { data: J = [] } = ne({
    queryKey: ["task-comments", i],
    queryFn: () => {
      var v, y, D, E;
      return Promise.resolve((E = (D = (y = (v = window == null ? void 0 : window.apya) == null ? void 0 : v.platform) == null ? void 0 : y.tasks) == null ? void 0 : D.task) == null ? void 0 : E.getComments(i));
    },
    enabled: !!i,
    staleTime: 1e4
  }), V = async () => {
    await l.invalidateQueries({ queryKey: ["task-comments", i] }), await l.invalidateQueries({ queryKey: ["task-detail", i] });
  }, X = async () => {
    var y, D, E;
    const v = w.trim();
    if (!(!v || !i || B)) {
      z(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.addComment(i, v)), await V(), k("");
      } catch (H) {
        (E = (D = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : D.error) == null || E.call(D, (H == null ? void 0 : H.message) || "Yorum gönderilemedi.");
      } finally {
        z(!1);
      }
    }
  }, O = async (v) => {
    var D, E, H;
    const y = q.trim();
    if (!(!y || !i))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.replyToComment(v, y)), await V(), U(""), M(null);
      } catch (ce) {
        (H = (E = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : E.error) == null || H.call(E, (ce == null ? void 0 : ce.message) || "Yanıt gönderilemedi.");
      }
  }, ee = (v) => _((y) => {
    const D = y[v] ?? { liked: !1, count: 0 };
    return { ...y, [v]: { liked: !D.liked, count: D.count + (D.liked ? -1 : 1) } };
  }), j = !!w.trim() && !B;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-[9px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Açıklama" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Zengin metin · WYSIWYG" })
      ] }),
      /* @__PURE__ */ e.jsx(
        Js,
        {
          value: s ?? t.description ?? "",
          onChange: (v) => a("description", v),
          mentionName: n
        },
        i
      )
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: Yt, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
            b,
            "/",
            u.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(Ut, { open: o, onClick: () => c((v) => !v) })
      ] }),
      o && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 mt-3.5", children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
            style: { width: `${d}%` }
          }
        ) }),
        u.map((v) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              "aria-label": v.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
              onClick: () => r.toggleItem(v.id).catch((y) => {
                var D, E, H;
                return (H = (E = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : E.error) == null ? void 0 : H.call(E, (y == null ? void 0 : y.message) || "Durum güncellenemedi.");
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
                var D, E, H;
                return (H = (E = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : E.error) == null ? void 0 : H.call(E, (y == null ? void 0 : y.message) || "Madde silinemedi.");
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
            value: x,
            onChange: (v) => h(v.target.value),
            onKeyDown: (v) => {
              v.key === "Enter" && p();
            },
            placeholder: "Yeni madde yaz ve Enter'a bas…",
            className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: Yt, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Yorumlar & güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: J.length })
        ] }),
        /* @__PURE__ */ e.jsx(Ut, { open: g, onClick: () => m((v) => !v) })
      ] }),
      g && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(nt, { name: n }),
          /* @__PURE__ */ e.jsxs("div", { className: `flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${T ? "border-focus bg-surface-base shadow-focus" : "border-default bg-surface-raised"}`, children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                rows: 2,
                value: w,
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
                  disabled: !j,
                  className: `flex items-center gap-[7px] h-[30px] px-3.5 rounded-[9px] text-[12px] font-bold shadow-xs ${j ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${B ? "fa-circle-notch fa-spin" : "fa-paper-plane"} text-[10px]` }),
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
            /* @__PURE__ */ e.jsx(nt, { name: v.authorName }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: v.authorName }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: _t(v.creationTime) })
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
                      M((D) => D === v.id ? null : v.id), U("");
                    },
                    className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-full text-text-tertiary text-[11px] font-semibold hover:bg-surface-hover hover:text-primary cursor-pointer",
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                      "Yanıtla"
                    ]
                  }
                )
              ] }),
              W === v.id && /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 mt-2 animate-fade-in-fast", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: q,
                    onChange: (D) => U(D.target.value),
                    onKeyDown: (D) => {
                      D.key === "Enter" && O(v.id);
                    },
                    placeholder: `@${v.authorName} kullanıcısına yanıt ver…`,
                    className: "flex-1 h-8 px-3 rounded-[9px] border border-focus bg-surface-base text-text-primary text-[12px] shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => O(v.id),
                    className: "h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover",
                    children: "Yanıtla"
                  }
                )
              ] }),
              (v.replies ?? []).map((D) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] mt-2.5 pl-3 border-l-2 border-default", children: [
                /* @__PURE__ */ e.jsx(nt, { name: D.authorName, size: 24 }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: D.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: _t(D.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-[3px] mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: D.text })
                ] })
              ] }, D.id))
            ] })
          ] }, v.id);
        }) })
      ] })
    ] })
  ] });
}
function er({
  lastSavedAt: t,
  isDirty: a,
  isSaving: s,
  justSaved: r,
  onCancel: n,
  onSave: i
}) {
  const l = t ? new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(t)) : "—", o = s ? "fa-solid fa-circle-notch fa-spin" : r ? "fa-solid fa-check" : "fa-regular fa-floppy-disk", c = s ? "Kaydediliyor…" : r ? "Kaydedildi" : "Kaydet", x = a && !s;
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
          onClick: n,
          className: "h-9 px-4 rounded-[10px] border border-default bg-surface-base text-text-secondary text-[13px] font-semibold hover:bg-surface-hover hover:text-text-primary cursor-pointer",
          children: "Vazgeç"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: i,
          disabled: !x,
          className: `flex items-center gap-2 h-9 px-[22px] rounded-[10px] text-white text-[13px] font-bold shadow-sm ${x ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `${o} text-[11px]` }),
            c
          ]
        }
      )
    ] })
  ] });
}
const ja = Object.fromEntries(Ge.map((t) => [t.code, t])), tr = {
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
}, ar = [
  { title: "GÖREV & PLANLAMA", codes: ["checklist", "gantt", "time-tracking", "dependencies", "risks", "approvals", "dashboard"] },
  { title: "İLETİŞİM", codes: ["comments", "emails"] },
  { title: "GEÇMİŞ & FİNANS", codes: ["activity", "history", "finance", "gallery"] },
  { title: "İLERİ ÖZELLİKLER & YAPAY ZEKA", codes: ["ai", "automations", "custom-fields"] }
], sr = /* @__PURE__ */ new Set([
  "risks",
  "dashboard",
  "comments",
  "emails",
  "custom-fields",
  "approvals",
  "ai",
  "automations"
]), rr = (t) => sr.has(t);
function wa(t) {
  const a = ja[t], s = tr[t];
  return a ? {
    code: t,
    title: a.title,
    icon: a.icon,
    desc: (s == null ? void 0 : s.desc) ?? "",
    bg: (s == null ? void 0 : s.bg) ?? "bg-neutral-subtle",
    fg: (s == null ? void 0 : s.fg) ?? "text-text-secondary"
  } : null;
}
function nr(t) {
  var a;
  return (a = ja[t]) != null && a.hidden ? null : wa(t);
}
function ir(t = "") {
  const a = t.trim().toLowerCase();
  return ar.map((s) => ({
    title: s.title,
    items: s.codes.map(nr).filter(Boolean).filter((r) => !a || r.title.toLowerCase().includes(a) || r.desc.toLowerCase().includes(a))
  })).filter((s) => s.items.length > 0);
}
const Ht = Ge.filter((t) => !t.hidden).length;
function Vt({ code: t, onRemoveFeature: a, onOpenPicker: s, canRemove: r = !0 }) {
  const n = wa(t) ?? { title: t, desc: "", icon: "fa-cube", bg: "bg-neutral-subtle", fg: "text-text-secondary" };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-3 py-14 px-6 rounded-2xl border border-dashed border-strong bg-surface-base text-center", children: [
    /* @__PURE__ */ e.jsx("span", { className: `flex items-center justify-center h-14 w-14 rounded-2xl ${n.bg} ${n.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n.icon} text-[22px]` }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-w-[420px]", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: n.title }),
      n.desc && /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] leading-[1.6] text-text-secondary", children: n.desc }),
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
function ht({ open: t, onClose: a, label: s, children: r }) {
  return /* @__PURE__ */ e.jsx(
    Ia,
    {
      open: t,
      onOpenChange: (n) => {
        n || a == null || a();
      },
      children: /* @__PURE__ */ e.jsxs(Ba, { children: [
        /* @__PURE__ */ e.jsx(Ka, { className: "fixed inset-0", style: { pointerEvents: "none" } }),
        /* @__PURE__ */ e.jsx(Ra, { asChild: !0, "aria-describedby": void 0, children: /* @__PURE__ */ e.jsxs("div", { className: "fixed inset-0 z-modal", children: [
          /* @__PURE__ */ e.jsx(Ma, { className: "sr-only", children: s }),
          r
        ] }) })
      ] })
    }
  );
}
function lr({
  open: t,
  onClose: a,
  assignedCodes: s = [],
  onAddFeature: r,
  onGoToTab: n
}) {
  const [i, l] = f.useState("");
  if (f.useEffect(() => {
    t || l("");
  }, [t]), !t) return null;
  const o = new Set(s), c = ir(i), x = s.length + 3, h = (u) => {
    if (o.has(u)) {
      n == null || n(u), a == null || a();
      return;
    }
    r == null || r(u), a == null || a();
  };
  return /* @__PURE__ */ e.jsx(ht, { open: t, onClose: a, label: "Özellik ekle", children: /* @__PURE__ */ e.jsx(
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
                  onChange: (u) => l(u.target.value),
                  placeholder: `${Ht} özellik arasında ara (Gantt, Finans, Risk, AI…)`,
                  className: "w-full h-[42px] pl-9 pr-3.5 rounded-xl border border-default bg-neutral-subtle text-text-primary text-[13px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                }
              )
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col gap-5 px-[22px] pt-3 pb-[22px] overflow-y-auto custom-scrollbar", children: [
              c.map((u) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[11px]", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.1em] text-text-tertiary", children: u.title }),
                  /* @__PURE__ */ e.jsx("span", { className: "flex-1 h-px bg-subtle" })
                ] }),
                /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[11px]", children: u.items.map((b) => {
                  const d = o.has(b.code);
                  return /* @__PURE__ */ e.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => h(b.code),
                      className: `group flex items-start gap-3 p-3.5 rounded-[15px] border text-left cursor-pointer hover:border-focus hover:shadow-md ${d ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                      children: [
                        /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-10 w-10 rounded-xl ${b.bg} ${b.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${b.icon} text-[15px]` }) }),
                        /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-[3px] min-w-0 flex-1", children: [
                          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-between gap-2", children: [
                            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: b.title }),
                            /* @__PURE__ */ e.jsx("span", { className: `shrink-0 text-[10.5px] font-extrabold ${d ? "text-primary" : "text-text-tertiary"}`, children: d ? "✓ Ekli" : "Ekle →" })
                          ] }),
                          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] leading-[1.5] text-text-tertiary", children: b.desc })
                        ] })
                      ]
                    },
                    b.code
                  );
                }) })
              ] }, u.title)),
              c.length === 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 py-12 text-center", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass text-3xl text-text-tertiary mb-2" }),
                /* @__PURE__ */ e.jsx("p", { className: "m-0 text-sm font-semibold text-text-primary", children: "Eşleşen özellik bulunamadı" }),
                /* @__PURE__ */ e.jsx("p", { className: "m-0 text-xs text-text-tertiary", children: "Lütfen farklı bir arama terimi deneyin." })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-[22px] py-3.5 border-t border-subtle bg-surface-raised text-[11.5px] text-text-tertiary", children: [
              /* @__PURE__ */ e.jsxs("span", { children: [
                "Toplam ",
                Ht,
                " modül · ",
                x,
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
const or = [
  { key: "subtasks", label: "Alt görevler", countKey: "subtasks", unit: "alt görev" },
  { key: "checklist", label: "Kontrol listesi", countKey: "checklist", unit: "madde" },
  { key: "comments", label: "Yorumlar", countKey: "comments", unit: "yorum" },
  { key: "files", label: "Dosyalar", countKey: "files", unit: "dosya" },
  { key: "keepAssignee", label: "Sorumluyu koru", desc: "Aksi halde atanmamış gelir" },
  { key: "keepLinks", label: "Bağımlılıkları koru", desc: "Öncül / ardıl bağlantılar" },
  { key: "shiftDates", label: "Tarihleri bugüne kaydır", desc: "Başlangıç ve son tarih ötelenir" }
], Qt = {
  subtasks: !0,
  checklist: !0,
  comments: !1,
  files: !0,
  keepAssignee: !0,
  keepLinks: !0,
  shiftDates: !1
};
function cr({ on: t, onClick: a, label: s }) {
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
function dr({
  open: t,
  mode: a = "move",
  onClose: s,
  onConfirm: r,
  projectOptions: n = [],
  currentProjectId: i,
  counts: l = {},
  onCreateProject: o
}) {
  const [c, x] = f.useState(a), [h, u] = f.useState([]), [b, d] = f.useState(""), [p, g] = f.useState(""), [m, w] = f.useState(Qt), [k, T] = f.useState(!1);
  f.useEffect(() => {
    t && (x(a), u([]), d(""), g(""), w(Qt));
  }, [t, a]);
  const $ = f.useMemo(
    () => n.filter((j) => j.value && j.value !== i),
    [n, i]
  ), B = $.filter((j) => !b || j.label.toLowerCase().includes(b.toLowerCase())), z = $.length > 0 && h.length === $.length;
  if (!t) return null;
  const W = (j) => u((v) => v.includes(j) ? v.filter((y) => y !== j) : [...v, j]), M = (j) => {
    var v;
    return ((v = n.find((y) => y.value === j)) == null ? void 0 : v.label) ?? "";
  }, q = async () => {
    var v, y, D;
    const j = p.trim();
    if (!(!j || k)) {
      T(!0);
      try {
        const E = await (o == null ? void 0 : o(j));
        E && u((H) => [...H, E]), g("");
      } catch (E) {
        (D = (y = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : y.error) == null || D.call(y, (E == null ? void 0 : E.message) || "Proje oluşturulamadı.");
      } finally {
        T(!1);
      }
    }
  }, U = async () => {
    if (!(!h.length || k)) {
      T(!0);
      try {
        await (r == null ? void 0 : r({ mode: c, targetProjectIds: h, include: m }));
      } finally {
        T(!1);
      }
    }
  }, K = c === "move", _ = h.length, J = K ? _ > 1 ? "Taşı ve kopyala" : "Taşı" : _ > 1 ? `${_} projeye kopyala` : "Kopyala", V = Object.values(m).filter(Boolean).length, X = h.map(M).filter(Boolean), O = X.length ? `${X.length > 2 ? `${X.slice(0, 2).join(", ")} +${X.length - 2}` : X.join(", ")} · ${V} seçenek açık` : `Proje seçilmedi · ${V} seçenek açık`, ee = (j) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${j ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return /* @__PURE__ */ e.jsx(ht, { open: t, onClose: s, label: K ? "Başka projeye taşı" : "Başka projelere kopyala", children: /* @__PURE__ */ e.jsx(
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
          onClick: (j) => j.stopPropagation(),
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
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => x("move"), className: ee(K), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[10px]" }),
                "Taşı"
              ] }),
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => x("copy"), className: ee(!K), children: [
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
                      onClick: () => u(z ? [] : $.map((j) => j.value)),
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
                      value: b,
                      onChange: (j) => d(j.target.value),
                      placeholder: "Proje ara…",
                      className: "w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar", children: [
                  B.map((j) => {
                    const v = h.includes(j.value), y = K && h[0] === j.value;
                    return /* @__PURE__ */ e.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => W(j.value),
                        className: `flex items-center gap-[11px] px-3 py-[11px] rounded-[11px] border text-left cursor-pointer hover:border-focus ${v ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                        children: [
                          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] rounded-[5px] border-[1.5px] text-white ${v ? "bg-primary border-primary" : "bg-transparent border-strong"}`, children: v && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" }) }),
                          /* @__PURE__ */ e.jsx("span", { className: "h-2.5 w-2.5 shrink-0 rounded-[3px] bg-primary" }),
                          /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: j.label }),
                          y && /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center h-5 px-2 rounded-md bg-primary text-white text-[10px] font-extrabold", children: "TAŞINACAK" })
                        ]
                      },
                      j.value
                    );
                  }),
                  B.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "py-6 text-center text-[12px] text-text-tertiary", children: "Uygun proje bulunamadı." })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[7px] mt-1", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: p,
                      onChange: (j) => g(j.target.value),
                      onKeyDown: (j) => {
                        j.key === "Enter" && (j.preventDefault(), q());
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
                      disabled: !p.trim() || k,
                      className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-plus text-[12px]" })
                    }
                  )
                ] }),
                K && _ > 1 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle", children: [
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
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: or.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-px", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary", children: j.label }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: j.countKey ? `${l[j.countKey] ?? 0} ${j.unit}` : j.desc })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    cr,
                    {
                      on: m[j.key],
                      label: j.label,
                      onClick: () => w((v) => ({ ...v, [j.key]: !v[j.key] }))
                    }
                  )
                ] }, j.key)) })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3.5 px-[22px] py-3.5 border-t border-subtle bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("span", { className: "min-w-0 truncate text-[11.5px] text-text-tertiary", children: O }),
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
                    disabled: !_ || k,
                    className: `flex items-center gap-2 h-9 px-5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${_ && !k ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
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
const xr = [
  { code: "general", title: "Genel", icon: "fa-circle-info" },
  { code: "checklist", title: "Kontrol", icon: "fa-square-check" },
  { code: "comments", title: "Yorumlar", icon: "fa-comments" },
  { code: "files", title: "Dosyalar", icon: "fa-paperclip" }
], Le = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  img: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
};
function ur(t = "") {
  var s;
  const a = (s = t.split(".").pop()) == null ? void 0 : s.toLowerCase();
  return a === "pdf" ? Le.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(a) ? Le.img : ["doc", "docx", "odt", "rtf"].includes(a) ? Le.doc : ["json", "js", "ts", "cs", "xml", "yml", "yaml"].includes(a) ? Le.code : Le.other;
}
const pr = (t) => t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toFixed(1)} MB` : "—", mr = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—", fr = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—";
function it({ name: t, size: a = 22 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Fe(t), fontSize: a * 0.4 },
      children: Me(t)
    }
  );
}
function Ue({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: t }),
    a
  ] });
}
function br({
  subtaskId: t,
  parentCode: a,
  onClose: s,
  onOpenFull: r,
  onDeleted: n,
  currentUserName: i = "Ben"
}) {
  var E, H, ce;
  const l = se(), { data: o } = pt(t), c = bt(t), x = ft(t), [h, u] = f.useState("general"), [b, d] = f.useState(""), [p, g] = f.useState(""), [m, w] = f.useState(""), k = f.useRef(null), T = f.useRef(null);
  o && T.current !== o.id && (T.current = o.id, d(o.description ?? ""));
  const { data: $ = [] } = ne({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var N, L, P, F;
      return Promise.resolve((F = (P = (L = (N = window == null ? void 0 : window.apya) == null ? void 0 : N.platform) == null ? void 0 : L.tasks) == null ? void 0 : P.task) == null ? void 0 : F.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4
  });
  if (f.useEffect(() => {
    const N = (L) => {
      L.key === "Escape" && (L.stopPropagation(), s == null || s());
    };
    return window.addEventListener("keydown", N), () => window.removeEventListener("keydown", N);
  }, [s]), !o) return null;
  const B = (ce = (H = (E = window == null ? void 0 : window.apya) == null ? void 0 : E.platform) == null ? void 0 : H.tasks) == null ? void 0 : ce.task, z = Re(o.status), W = ua(o.priority), M = c.items ?? [], q = M.filter((N) => N.isDone).length, U = M.length ? Math.round(q / M.length * 100) : 0, K = x.attachments ?? [], _ = { checklist: M.length, comments: $.length, files: K.length }, J = async () => {
    await l.invalidateQueries({ queryKey: ["task-detail", t] });
  }, V = async (N) => {
    var L, P, F;
    try {
      await Promise.resolve(B.update(o.id, {
        title: o.title,
        description: o.description ?? null,
        startDate: (o.startDate ?? "").slice(0, 10),
        dueDate: o.dueDate ? o.dueDate.slice(0, 10) : null,
        status: o.status,
        priority: o.priority,
        assigneeId: o.assigneeId ?? null,
        boardColumnId: o.boardColumnId ?? null,
        projectId: o.projectId ?? null,
        parentTaskId: o.parentTaskId ?? null,
        isPrivate: !!o.isPrivate,
        predecessorIds: o.predecessorIds ?? [],
        tagNames: (o.tags ?? []).map((Y) => Y.name),
        estimatedHours: o.estimatedHours ?? null,
        taskType: o.taskType ?? null,
        sprint: o.sprint ?? null,
        ...N
      })), await J();
    } catch (Y) {
      (F = (P = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : P.error) == null || F.call(P, (Y == null ? void 0 : Y.message) || "Alt görev güncellenemedi.");
    }
  }, X = () => V({ status: o.status >= 4 ? 1 : o.status + 1 }), O = () => V({ priority: o.priority >= 4 ? 1 : o.priority + 1 }), ee = () => {
    (o.description ?? "") !== b && V({ description: b || null });
  }, j = async () => {
    var L, P, F;
    const N = p.trim();
    if (N) {
      g("");
      try {
        await c.addItem(N);
      } catch (Y) {
        (F = (P = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : P.error) == null || F.call(P, (Y == null ? void 0 : Y.message) || "Madde eklenemedi.");
      }
    }
  }, v = async () => {
    var L, P, F;
    const N = m.trim();
    if (N) {
      w("");
      try {
        await Promise.resolve(B.addComment(o.id, N)), await l.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch (Y) {
        (F = (P = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : P.error) == null || F.call(P, (Y == null ? void 0 : Y.message) || "Yorum gönderilemedi.");
      }
    }
  }, y = async () => {
    var N, L, P;
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(B.delete(o.id)), n == null || n(o.id), s == null || s();
      } catch (F) {
        (P = (L = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : L.error) == null || P.call(L, (F == null ? void 0 : F.message) || "Alt görev silinemedi.");
      }
  }, D = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
  return /* @__PURE__ */ e.jsxs(ht, { open: !0, onClose: s, label: `${o.code} alt görev detayı`, children: [
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
        "aria-label": `${o.code} alt görev detayı`,
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
                    onClick: () => r == null ? void 0 : r(o.id),
                    className: `${D} hover:bg-surface-hover hover:text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-up-right-from-square text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Alt görevi sil",
                    onClick: y,
                    className: `${D} hover:bg-negative-subtle hover:text-negative`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Kapat",
                    onClick: s,
                    className: `${D} hover:bg-surface-hover hover:text-text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[13px]" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[7px] flex-wrap", children: [
              /* @__PURE__ */ e.jsx("span", { className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[10.5px] font-bold tracking-[.04em]", children: o.code }),
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
                  onClick: O,
                  title: "Önceliği değiştir",
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold cursor-pointer ${W.bg} ${W.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${W.icon} text-[10px]` }),
                    W.label
                  ]
                }
              ),
              (o.tags ?? []).map((N) => /* @__PURE__ */ e.jsx("span", { className: "flex items-center h-6 px-[9px] rounded-[7px] border border-default bg-neutral-subtle text-text-secondary text-[11px] font-semibold", children: N.name }, N.id ?? N.name))
            ] }),
            /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[18px] font-extrabold tracking-[-.02em] leading-[1.3] text-text-primary", children: o.title }),
            /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 pt-1", children: [
              /* @__PURE__ */ e.jsx(Ue, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
                /* @__PURE__ */ e.jsx(it, { name: o.assigneeName }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", children: o.assigneeName || "Atanmamış" })
              ] }) }),
              /* @__PURE__ */ e.jsx(Ue, { label: "Son tarih", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] h-[22px] text-[12.5px] font-semibold text-text-primary", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[11px] text-text-tertiary" }),
                fr(o.dueDate)
              ] }) }),
              /* @__PURE__ */ e.jsx(Ue, { label: "Süre", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-[22px] font-mono text-[12.5px] font-bold text-text-primary", children: [
                o.spentHours ?? 0,
                "s",
                /* @__PURE__ */ e.jsxs("span", { className: "font-medium text-text-tertiary", children: [
                  " / ",
                  o.estimatedHours != null ? `${o.estimatedHours}s` : "—"
                ] })
              ] }) }),
              /* @__PURE__ */ e.jsx(Ue, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-1.5 pt-[3px]", children: [
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
                  "%",
                  U
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: "block h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("span", { className: "block h-full rounded-full bg-success", style: { width: `${U}%` } }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: xr.map((N) => {
            const L = h === N.code, P = _[N.code] ?? 0;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => u(N.code),
                className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${L ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${N.icon} text-[11px] opacity-85` }),
                  /* @__PURE__ */ e.jsx("span", { children: N.title }),
                  P > 0 && /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-neutral-subtle text-text-tertiary text-[10px] font-extrabold", children: P })
                ]
              },
              N.code
            );
          }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar px-5 py-[18px] bg-surface-raised", children: [
            h === "general" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Açıklama" }),
              /* @__PURE__ */ e.jsx(
                "textarea",
                {
                  rows: 7,
                  value: b,
                  onChange: (N) => d(N.target.value),
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
            h === "checklist" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px]", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Kontrol listesi" }),
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: [
                  q,
                  "/",
                  M.length
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-success", style: { width: `${U}%` } }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px] mt-1", children: [
                M.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] border border-subtle bg-surface-base hover:border-default", children: [
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Tamamlandı işaretle",
                      onClick: () => c.toggleItem(N.id),
                      className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white cursor-pointer ${N.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
                      children: N.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[12.5px] font-semibold ${N.isDone ? "line-through text-text-tertiary" : "text-text-primary"}`, children: N.text }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Maddeyi sil",
                      onClick: () => c.removeItem(N.id),
                      className: "flex shrink-0 items-center justify-center h-6 w-6 rounded-md text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[10px]" })
                    }
                  )
                ] }, N.id)),
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "text",
                    value: p,
                    onChange: (N) => g(N.target.value),
                    onKeyDown: (N) => {
                      N.key === "Enter" && j();
                    },
                    placeholder: "Yeni madde yaz ve Enter'a bas…",
                    className: "h-9 mt-1 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                )
              ] })
            ] }),
            h === "comments" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] items-start", children: [
                /* @__PURE__ */ e.jsx(it, { name: i, size: 30 }),
                /* @__PURE__ */ e.jsx(
                  "textarea",
                  {
                    rows: 2,
                    value: m,
                    onChange: (N) => w(N.target.value),
                    onKeyDown: (N) => {
                      N.key === "Enter" && !N.shiftKey && (N.preventDefault(), v());
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
              ] }) : $.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 items-start p-3 rounded-xl border border-subtle bg-surface-base", children: [
                /* @__PURE__ */ e.jsx(it, { name: N.authorName, size: 28 }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: N.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: mr(N.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: N.text })
                ] })
              ] }, N.id))
            ] }),
            h === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  ref: k,
                  type: "file",
                  className: "hidden",
                  onChange: (N) => {
                    var P;
                    const L = (P = N.target.files) == null ? void 0 : P[0];
                    N.target.value = "", L && x.upload(L).catch((F) => {
                      var Y, ie, A;
                      return (A = (ie = (Y = window == null ? void 0 : window.abp) == null ? void 0 : Y.notify) == null ? void 0 : ie.error) == null ? void 0 : A.call(ie, (F == null ? void 0 : F.message) || "Dosya yüklenemedi.");
                    });
                  }
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    var N;
                    return (N = k.current) == null ? void 0 : N.click();
                  },
                  disabled: x.isUploading,
                  className: "flex flex-col items-center justify-center gap-[7px] p-6 rounded-[13px] border-2 border-dashed border-strong bg-surface-base cursor-pointer hover:border-focus hover:bg-primary-subtle disabled:opacity-60",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x.isUploading ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-xl text-text-tertiary` }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: x.isUploading ? "Yükleniyor…" : "Dosya ekle" })
                  ]
                }
              ),
              K.map((N) => {
                const L = ur(N.fileName);
                return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${L.bg} ${L.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${L.icon} text-[13px]` }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: N.fileName }),
                    /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                      pr(N.fileSize),
                      " · ",
                      N.uploaderName
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "a",
                    {
                      href: N.downloadUrl,
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
                      onClick: () => x.remove(N.id).catch((P) => {
                        var F, Y, ie;
                        return (ie = (Y = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : Y.error) == null ? void 0 : ie.call(Y, (P == null ? void 0 : P.message) || "Dosya silinemedi.");
                      }),
                      className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                    }
                  )
                ] }, N.id);
              })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-5 py-3 border-t border-subtle bg-surface-base shrink-0", children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => r == null ? void 0 : r(o.id),
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
const Na = "apya.taskDetail.tabOrder";
function hr() {
  try {
    const t = localStorage.getItem(Na);
    if (!t) return [];
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.filter((s) => typeof s == "string") : [];
  } catch {
    return [];
  }
}
function gr(t) {
  try {
    localStorage.setItem(Na, JSON.stringify(t));
  } catch {
  }
}
function yr(t) {
  const [a, s] = f.useState(hr), [r, n] = f.useState(null), i = f.useMemo(() => {
    const x = new Map(t.map((u) => [u.code, u])), h = [];
    for (const u of a) {
      const b = x.get(u);
      b && (h.push(b), x.delete(u));
    }
    for (const u of t)
      x.has(u.code) && h.push(u);
    return h;
  }, [t, a]), l = f.useCallback((x) => {
    s((h) => {
      const u = r;
      if (!u || u === x) return h;
      const b = h.length ? h.slice() : i.map((g) => g.code), d = b.indexOf(u), p = b.indexOf(x);
      return d === -1 || p === -1 ? h : (b.splice(d, 1), b.splice(p, 0, u), b);
    });
  }, [r, i]), o = f.useCallback((x) => n(x), []), c = f.useCallback(() => {
    n(null), s((x) => {
      const h = x.length ? x : i.map((u) => u.code);
      return gr(h), h;
    });
  }, [i]);
  return { orderedTabs: i, draggingCode: r, handleDragStart: o, handleDragEnd: c, reorderTo: l };
}
function vr() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function jr() {
  const t = ne({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: vr,
    staleTime: 3e5,
    retry: !1
  }), a = t.data ?? [], s = a.map((n) => ({ value: n.id, label: n.name })), r = new Map(a.map((n) => [n.id, n.name]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
const Zt = "apya.taskDetail.fullscreen", Q = {
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
function wr(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function ka({ taskId: t, presentation: a = "modal", onClose: s, switchToTask: r }) {
  var jt, wt, Nt, kt, Ct, Dt, Tt, St;
  const [n, i] = f.useState(t), { data: l, isPending: o, isError: c, refetch: x } = pt(n), h = se(), u = ra(), b = oa(l), d = ca(), p = jr(), g = da(n), m = bt(n), [w, k] = f.useState("general"), [T, $] = f.useState(!1), [B, z] = f.useState(!1), [W, M] = f.useState(!1), [q, U] = f.useState(null), [K, _] = f.useState(null), [J, V] = f.useState(!1), [X, O] = f.useState(!1), [ee, j] = f.useState(() => {
    try {
      return localStorage.getItem(Zt) === "true";
    } catch {
      return !1;
    }
  });
  la(n);
  const [v, y] = f.useState(null);
  l != null && l.id && l.id !== v && (y(l.id), V(!!l.isFavorite), O(!!l.isWatched)), f.useEffect(() => {
    b.isDirty ? u.markDirty() : u.markClean();
  });
  const D = f.useCallback(() => {
    ia(), s == null || s();
  }, [s]), E = f.useCallback(() => u.requestClose(D), [u, D]), H = f.useCallback(() => {
    j((C) => {
      const S = !C;
      try {
        localStorage.setItem(Zt, String(S));
      } catch {
      }
      return S;
    });
  }, []), ce = f.useMemo(
    () => ga(g.assignedCodes),
    [g.assignedCodes]
  ), N = yr(ce), L = f.useMemo(() => {
    var C, S, R, le, pe;
    return {
      subtasks: ((C = l == null ? void 0 : l.subTasks) == null ? void 0 : C.length) ?? 0,
      files: ((S = l == null ? void 0 : l.attachments) == null ? void 0 : S.length) ?? 0,
      dependencies: ((R = l == null ? void 0 : l.predecessorIds) == null ? void 0 : R.length) ?? 0,
      comments: ((le = l == null ? void 0 : l.comments) == null ? void 0 : le.length) ?? 0,
      checklist: ((pe = m.items) == null ? void 0 : pe.length) ?? 0
    };
  }, [l, m.items]), P = Ge.find((C) => C.code === w), F = m.items ?? [], Y = F.filter((C) => C.isDone).length, ie = F.length ? Math.round(Y / F.length * 100) : 0, A = f.useCallback(async () => {
    if (!b.validate())
      return Q.err("Zorunlu alanları kontrol edin."), !1;
    $(!0);
    try {
      return await Promise.resolve(window.apya.platform.tasks.task.update(n, b.toUpdateDto())), await h.invalidateQueries({ queryKey: ["task-detail", n] }), re.emitResult(), z(!0), setTimeout(() => z(!1), 2e3), Q.ok("Görev başarıyla güncellendi."), !0;
    } catch (C) {
      return Q.err((C == null ? void 0 : C.message) || "Kaydedilemedi."), !1;
    } finally {
      $(!1);
    }
  }, [n, b, h]);
  f.useEffect(() => {
    const C = (S) => {
      if ((S.ctrlKey || S.metaKey) && S.key.toLowerCase() === "s") {
        S.preventDefault(), b.isDirty && !T && A();
        return;
      }
      if (S.key === "Escape") {
        if (q) {
          S.stopPropagation(), U(null);
          return;
        }
        W && (S.stopPropagation(), M(!1));
      }
    };
    return window.addEventListener("keydown", C), () => window.removeEventListener("keydown", C);
  }, [A, b.isDirty, T, q, W]);
  const I = () => {
    var C, S, R;
    return (R = (S = (C = window == null ? void 0 : window.apya) == null ? void 0 : C.platform) == null ? void 0 : S.tasks) == null ? void 0 : R.task;
  }, G = async () => {
    var S;
    const C = !J;
    V(C);
    try {
      await Promise.resolve((S = I()) == null ? void 0 : S.toggleFavorite(n));
    } catch (R) {
      V(!C), Q.err((R == null ? void 0 : R.message) || "Favori güncellenemedi.");
    }
  }, te = () => {
    if (!n) return;
    const C = document.createElement("a");
    C.href = `/Tasks/Detail/${n}?handler=Pdf`, C.rel = "noopener", document.body.appendChild(C), C.click(), C.remove();
  }, Z = async () => {
    var S;
    const C = !X;
    O(C);
    try {
      await Promise.resolve((S = I()) == null ? void 0 : S.toggleWatch(n)), Q.info(C ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (R) {
      O(!C), Q.err((R == null ? void 0 : R.message) || "Takip durumu güncellenemedi.");
    }
  }, Ne = async () => {
    var C, S;
    try {
      const R = await Promise.resolve((C = I()) == null ? void 0 : C.transfer(n, {
        mode: 2,
        // Copy
        targetProjectIds: l != null && l.projectId ? [l.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await h.invalidateQueries({ queryKey: ["task-detail"] }), Q.ok("Görev çoğaltıldı.");
      const le = (S = R == null ? void 0 : R.createdTaskIds) == null ? void 0 : S[0];
      le && i(le);
    } catch (R) {
      Q.err((R == null ? void 0 : R.message) || "Görev çoğaltılamadı.");
    }
  }, xe = async () => {
    var C;
    try {
      await Promise.resolve((C = I()) == null ? void 0 : C.updateStatus(n, 4)), await h.invalidateQueries({ queryKey: ["task-detail", n] }), Q.info("Görev arşivlendi (Tamamlandı).");
    } catch (S) {
      Q.err((S == null ? void 0 : S.message) || "Görev arşivlenemedi.");
    }
  }, Da = async () => {
    var C;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?"))
      try {
        await Promise.resolve((C = I()) == null ? void 0 : C.delete(n)), Q.info("Görev silindi."), u.markClean(), D();
      } catch (S) {
        Q.err((S == null ? void 0 : S.message) || "Görev silinemedi.");
      }
  }, Ta = async (C) => {
    try {
      await g.addFeature(C), k(C), Q.ok("Özellik başarıyla eklendi.");
    } catch (S) {
      Q.err((S == null ? void 0 : S.message) || "Özellik eklenemedi.");
    }
  }, gt = async (C) => {
    try {
      await g.removeFeature(C), k("general"), Q.info("Özellik görevden kaldırıldı.");
    } catch (S) {
      Q.err((S == null ? void 0 : S.message) || "Özellik kaldırılamadı.");
    }
  }, Sa = async (C) => {
    var le, pe, de, Te, ke, qe, Pe;
    const S = ((Te = (de = (pe = (le = window == null ? void 0 : window.apya) == null ? void 0 : le.platform) == null ? void 0 : pe.application) == null ? void 0 : de.projects) == null ? void 0 : Te.project) ?? ((Pe = (qe = (ke = window == null ? void 0 : window.apya) == null ? void 0 : ke.platform) == null ? void 0 : qe.projects) == null ? void 0 : Pe.project);
    if (!(S != null && S.create)) throw new Error("Proje servisi yüklenmedi.");
    const R = await Promise.resolve(S.create({
      name: C,
      code: wr(C),
      currency: "TRY"
    }));
    return await h.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), Q.ok(`“${C}” projesi oluşturuldu.`), (R == null ? void 0 : R.id) ?? R;
  }, $a = async ({ mode: C, targetProjectIds: S, include: R }) => {
    var le, pe;
    try {
      const de = await Promise.resolve((le = I()) == null ? void 0 : le.transfer(n, {
        mode: C === "move" ? 1 : 2,
        targetProjectIds: S,
        include: R
      }));
      await h.invalidateQueries({ queryKey: ["task-detail", n] });
      const Te = S.map((qe) => {
        var Pe;
        return (Pe = p.options.find((Pa) => Pa.value === qe)) == null ? void 0 : Pe.label;
      }).filter(Boolean), ke = ((pe = de == null ? void 0 : de.createdTaskIds) == null ? void 0 : pe.length) ?? 0;
      Q.ok(C === "move" ? ke ? `“${Te[0]}” projesine taşındı, ${ke} projeye kopyalandı.` : `Görev “${Te[0]}” projesine taşındı.` : ke > 1 ? `${ke} projeye kopyalandı.` : `Kopya “${Te[0]}” projesinde oluşturuldu.`), U(null);
    } catch (de) {
      Q.err((de == null ? void 0 : de.message) || "Transfer tamamlanamadı.");
    }
  }, Ea = w === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)] gap-5 items-start", children: [
    /* @__PURE__ */ e.jsx(
      Xs,
      {
        task: l,
        onFieldChange: b.setField,
        descriptionValue: b.values.description,
        checklist: m,
        currentUserName: ((wt = (jt = window == null ? void 0 : window.abp) == null ? void 0 : jt.currentUser) == null ? void 0 : wt.name) || ((kt = (Nt = window == null ? void 0 : window.abp) == null ? void 0 : Nt.currentUser) == null ? void 0 : kt.userName) || "Ben"
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5", children: /* @__PURE__ */ e.jsx(Hs, { task: l, nameById: d.nameById }) })
  ] }) : rr(w) ? /* @__PURE__ */ e.jsx(
    Vt,
    {
      code: w,
      onRemoveFeature: gt,
      onOpenPicker: () => M(!0),
      canRemove: !(P != null && P.isCore)
    }
  ) : /* @__PURE__ */ e.jsx(f.Suspense, { fallback: /* @__PURE__ */ e.jsx(he, { className: "h-48 w-full" }), children: P != null && P.component ? /* @__PURE__ */ e.jsx(
    P.component,
    {
      taskId: n,
      task: l,
      nameById: d.nameById,
      onOpenSubtask: _
    }
  ) : /* @__PURE__ */ e.jsx(
    Vt,
    {
      code: w,
      onRemoveFeature: gt,
      onOpenPicker: () => M(!0),
      canRemove: !(P != null && P.isCore)
    }
  ) }), yt = o ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(he, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(he, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(he, { className: "h-64 w-full" })
  ] }) : c ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(ae, { variant: "ghost", onClick: () => x(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col flex-1 min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      Os,
      {
        task: l,
        presentation: a,
        onClose: E,
        isFullscreen: ee,
        onToggleFullscreen: H,
        onFieldChange: b.setField,
        statusValue: b.values.status,
        titleValue: l == null ? void 0 : l.title,
        isPrivateValue: b.values.isPrivate,
        isFavorite: J,
        onToggleFavorite: G,
        isWatched: X,
        onToggleWatch: Z,
        onDuplicate: Ne,
        onArchive: xe,
        onDelete: Da,
        onOpenTransfer: (C) => U({ mode: C }),
        onSaveAsTemplate: () => Q.info("Şablon olarak kaydetme yakında."),
        onConvertToSubtask: () => Q.info("Alt göreve dönüştürme yakında."),
        onExportPdf: te
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        Ys,
        {
          task: l,
          assigneeOptions: d.options,
          projectOptions: p.options,
          onFieldChange: b.setField,
          statusValue: b.values.status,
          priorityValue: b.values.priority,
          assigneeValue: b.values.assigneeId,
          projectValue: b.values.projectId,
          dueDateValue: b.values.dueDate,
          startDateValue: b.values.startDate,
          tagsValue: b.values.tagNames,
          progressPercent: ie,
          progressNote: `${Y}/${F.length} madde`,
          onOpenTransfer: (C) => U({ mode: C })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        a === "page" && /* @__PURE__ */ e.jsx(
          _s,
          {
            activeTab: w,
            onTabChange: k,
            orderedTabs: N.orderedTabs,
            draggingCode: N.draggingCode,
            onDragStart: N.handleDragStart,
            onDragEnd: N.handleDragEnd,
            onReorderTo: N.reorderTo,
            onReorderDrop: () => Q.info("Sekme sırası güncellendi."),
            onOpenPicker: () => M(!0),
            counts: L
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: a === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            Us,
            {
              activeTab: w,
              onTabChange: k,
              orderedTabs: N.orderedTabs,
              draggingCode: N.draggingCode,
              onDragStart: N.handleDragStart,
              onDragEnd: N.handleDragEnd,
              onReorderTo: N.reorderTo,
              onReorderDrop: () => Q.info("Sekme sırası güncellendi."),
              onOpenPicker: () => M(!0),
              counts: L,
              isDirty: b.isDirty
            }
          ) }),
          /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised", children: Ea })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(
      er,
      {
        lastSavedAt: l == null ? void 0 : l.lastModificationTime,
        isDirty: b.isDirty,
        isSaving: T,
        justSaved: B,
        onCancel: E,
        onSave: A
      }
    )
  ] }), vt = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      lr,
      {
        open: W,
        onClose: () => M(!1),
        assignedCodes: g.assignedCodes,
        onAddFeature: Ta,
        onGoToTab: k
      }
    ),
    /* @__PURE__ */ e.jsx(
      dr,
      {
        open: !!q,
        mode: (q == null ? void 0 : q.mode) ?? "move",
        onClose: () => U(null),
        onConfirm: $a,
        projectOptions: p.options,
        currentProjectId: b.values.projectId,
        counts: L,
        onCreateProject: Sa
      }
    ),
    K && /* @__PURE__ */ e.jsx(
      br,
      {
        subtaskId: K,
        parentCode: l == null ? void 0 : l.code,
        onClose: () => _(null),
        onOpenFull: (C) => {
          _(null), (r ?? i)(C);
        },
        onDeleted: () => h.invalidateQueries({ queryKey: ["task-detail", n] }),
        currentUserName: ((Dt = (Ct = window == null ? void 0 : window.abp) == null ? void 0 : Ct.currentUser) == null ? void 0 : Dt.name) || ((St = (Tt = window == null ? void 0 : window.abp) == null ? void 0 : Tt.currentUser) == null ? void 0 : St.userName) || "Ben"
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col w-full min-h-[calc(100vh-54px)] border-y border-subtle bg-surface-base", children: yt }),
    vt
  ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(ea, { open: !0, onOpenChange: (C) => {
      C || E();
    }, children: /* @__PURE__ */ e.jsx(
      ta,
      {
        title: l != null && l.title ? `Görev Detayı: ${l.title}` : "Görev Detayı",
        fullscreen: ee,
        className: ee ? "p-0 rounded-xl border border-default shadow-xl short:h-[100svh]" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl short:h-[100svh]",
        onInteractOutside: (C) => {
          var S, R;
          C.preventDefault(), !(W || q || K) && ((R = (S = C.target) == null ? void 0 : S.closest) != null && R.call(S, "[data-apya-overlay]") || E());
        },
        onEscapeKeyDown: (C) => {
          if (W || q || K) {
            C.preventDefault();
            return;
          }
          C.preventDefault(), E();
        },
        children: yt
      }
    ) }),
    vt
  ] });
}
function Nr() {
  var a;
  const t = f.useSyncExternalStore(
    re.subscribe,
    re.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(Ve, { children: /* @__PURE__ */ e.jsx(
    ka,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        re.close(), re.emitResult();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(Ve, { children: /* @__PURE__ */ e.jsx(
    ya,
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
function Ca() {
  var s;
  try {
    const r = new URLSearchParams(window.location.search).get("taskui");
    if (r === "v1" || r === "v2" || r === "v3") return r;
  } catch {
  }
  const t = document.getElementById("task-detail-island"), a = (s = t == null ? void 0 : t.dataset) == null ? void 0 : s.taskui;
  return a === "v1" || a === "v2" ? a : "v3";
}
function kr() {
  return Ca() === "v2";
}
function Cr() {
  return Ca() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = Cr();
window.apya.taskDetailV2Enabled = kr() && !window.apya.taskDetailV3Enabled;
const Wt = {
  open: (t) => {
    re.open(t);
  },
  close: () => re.close(),
  onResult: (t) => re.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(Wt) : window.apya.taskDetail = Wt;
function Jt() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = Xt(t), t._reactRoot.render(/* @__PURE__ */ e.jsx(Nr, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = na();
    a && re.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Jt) : Jt();
function Dr({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(Ve, { children: /* @__PURE__ */ e.jsx(
    ka,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(Ve, { children: /* @__PURE__ */ e.jsx(
    ya,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) });
}
const lt = document.getElementById("task-detail-page-island");
if (lt) {
  const t = lt.getAttribute("data-task-id");
  t && Xt(lt).render(/* @__PURE__ */ e.jsx(Dr, { taskId: t }));
}
