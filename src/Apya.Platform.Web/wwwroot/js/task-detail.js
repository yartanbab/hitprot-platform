import { j as e, r as m, d as Be, b as Zt } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { a as He } from "./QueryProvider-AIUp_Zk5.js";
import { u as ne, a as se, b as oe } from "./query-vendor-Bf69L2iP.js";
import { D as Wt, i as Jt, g as lt, B as ae, I as Ee, S as be } from "./Dialog-BdNKdiS6.js";
import { C as Da } from "./Combobox-Cgzidxen.js";
import { r as Sa } from "./httpClient-CRlyQ1eg.js";
import { R as he, T as ge, P as ye, C as ve, A as $a, a as Xt, D as Ea, b as Pa, c as La, d as Aa, e as Ia } from "./ui-vendor-DaE-uom6.js";
import { d as ea } from "./draggableActivation-Ybw9Upbh.js";
function Ba({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: n,
  footer: i,
  children: l
}) {
  return /* @__PURE__ */ e.jsx(
    Wt,
    {
      open: t,
      onOpenChange: (o) => {
        o || a();
      },
      children: /* @__PURE__ */ e.jsx(
        Jt,
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
function za({ title: t, header: a, footer: s, children: r }) {
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
function Ra({ isPrivate: t }) {
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
const ot = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, ct = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function Ka({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: n,
  fullscreen: i = !1
}) {
  const [l, o] = m.useState(!1), c = m.useRef(null);
  m.useEffect(() => {
    if (!l) return;
    const d = (y) => {
      c.current && !c.current.contains(y.target) && o(!1);
    }, b = (y) => {
      y.key === "Escape" && o(!1);
    };
    return document.addEventListener("mousedown", d), document.addEventListener("keydown", b), () => {
      document.removeEventListener("mousedown", d), document.removeEventListener("keydown", b);
    };
  }, [l]);
  const x = ot[t == null ? void 0 : t.status] ?? ot[1], u = ct[t == null ? void 0 : t.priority] ?? ct[2], p = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), o(!1);
  }, g = () => {
    var b, y, f, N;
    const d = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (b = navigator.clipboard) == null || b.writeText(d), (N = (f = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : f.info) == null || N.call(f, "Bağlantı kopyalandı."), o(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(lt, { variant: x.variant, children: x.text }),
        /* @__PURE__ */ e.jsx(lt, { variant: u.variant, children: u.text }),
        /* @__PURE__ */ e.jsx(Ra, { isPrivate: t == null ? void 0 : t.isPrivate })
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
const Ma = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function Fa({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: n }) {
  const i = Ma(t);
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
const Dt = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Ga = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function me({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function qa({ value: t, onChange: a }) {
  const [s, r] = m.useState(""), n = () => {
    const i = s.trim();
    i && !t.includes(i) && a([...t, i]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((i) => /* @__PURE__ */ e.jsxs(lt, { variant: "neutral", children: [
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
      Ee,
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
function Oa({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: n = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(me, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      Ee,
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
          className: Dt,
          children: Object.entries(ot).map(([i, l]) => /* @__PURE__ */ e.jsx("option", { value: i, children: l.text }, i))
        }
      ) }),
      /* @__PURE__ */ e.jsx(me, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (i) => s("priority", Number(i.target.value)),
          className: Dt,
          children: Object.entries(ct).map(([i, l]) => /* @__PURE__ */ e.jsx("option", { value: i, children: l.text }, i))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(me, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      Da,
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
        Ee,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (i) => s("startDate", i.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(me, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        Ee,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (i) => s("dueDate", i.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(me, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(qa, { value: t.tagNames, onChange: (i) => s("tagNames", i) }) }),
    /* @__PURE__ */ e.jsx(me, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (i) => s("description", i.target.value),
        className: Ga
      }
    ) })
  ] });
}
const St = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function Le({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function Ya({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(Le, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(Le, { label: "Oluşturulma zamanı", value: St(t.creationTime) }),
      /* @__PURE__ */ e.jsx(Le, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(Le, { label: "Son güncelleme zamanı", value: St(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(Le, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const Ua = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", _a = "border-brand-500 text-text-primary";
function Ha({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: n }) {
  const i = m.useRef(/* @__PURE__ */ new Map()), l = (c) => {
    var x;
    s(c.code), (x = i.current.get(c.code)) == null || x.focus();
  }, o = (c, x) => {
    c.key === "ArrowRight" ? (c.preventDefault(), l(t[(x + 1) % t.length])) : c.key === "ArrowLeft" ? (c.preventDefault(), l(t[(x - 1 + t.length) % t.length])) : c.key === "Home" ? (c.preventDefault(), l(t[0])) : c.key === "End" && (c.preventDefault(), l(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((c, x) => {
      const u = c.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (p) => {
            p ? i.current.set(c.code, p) : i.current.delete(c.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${c.code}`,
          "aria-selected": u,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: u ? 0 : -1,
          onClick: () => s(c.code),
          onKeyDown: (p) => o(p, x),
          className: `${Ua} ${u ? _a : ""}`,
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
const Va = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Qa({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [n, i] = m.useState(""), l = m.useMemo(() => {
    const o = n.trim().toLocaleLowerCase("tr-TR"), c = o ? t.filter((u) => u.title.toLocaleLowerCase("tr-TR").includes(o)) : t, x = /* @__PURE__ */ new Map();
    return c.forEach((u) => {
      const p = x.get(u.category) ?? [];
      p.push(u), x.set(u.category, p);
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
          Ee,
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
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: Va[o] ?? o }),
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
function Za({ trail: t = [], current: a, onNavigate: s }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((r) => /* @__PURE__ */ e.jsxs(Be.Fragment, { children: [
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
function Wa(t) {
  var s, r, n;
  const a = (n = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : n.task;
  return a ? Promise.resolve(a.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ut(t) {
  return ne({
    queryKey: ["task-detail", t],
    queryFn: () => Wa(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function We(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
function ta() {
  const [t, a] = m.useState(!1), [s, r] = m.useState(!1), n = m.useRef(null), i = m.useCallback(() => a(!0), []), l = m.useCallback(() => a(!1), []);
  m.useEffect(() => {
    if (!t) return;
    const x = (u) => {
      u.preventDefault(), u.returnValue = "";
    };
    return window.addEventListener("beforeunload", x), () => window.removeEventListener("beforeunload", x);
  }, [t]);
  const o = m.useCallback((x) => {
    if (!t) {
      x == null || x();
      return;
    }
    n.current = x ?? null, r(!0);
  }, [t]), c = m.useCallback((x) => {
    const u = n.current;
    return r(!1), n.current = null, x === "discard" && (a(!1), u == null || u()), x === "save" ? u : null;
  }, []);
  return { isDirty: t, markDirty: i, markClean: l, requestClose: o, pendingClose: s, resolvePendingClose: c };
}
const Ja = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, pt = "task";
function aa() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(pt);
  return t && Ja.test(t) ? t : null;
}
function sa() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(pt), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function ra(t, a) {
  const s = m.useRef(a);
  s.current = a, m.useEffect(() => {
    if (!t || aa() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(pt, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), m.useEffect(() => {
    const r = () => {
      var n;
      (n = s.current) == null || n.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const Xa = {
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
function es(t) {
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
  } : Xa;
}
function na(t) {
  const [a, s] = m.useState(t == null ? void 0 : t.id), r = m.useMemo(() => es(t), [t]), [n, i] = m.useState(r), [l, o] = m.useState({});
  (t == null ? void 0 : t.id) !== a && (s(t == null ? void 0 : t.id), i(r), o({}));
  const c = m.useCallback((d, b) => {
    i((y) => ({ ...y, [d]: b }));
  }, []), x = m.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(r),
    [n, r]
  ), u = m.useCallback(() => {
    const d = {};
    return n.title.trim() || (d.title = "Başlık zorunlu."), n.startDate || (d.startDate = "Başlangıç tarihi zorunlu."), n.dueDate && n.startDate && n.dueDate < n.startDate && (d.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), o(d), Object.keys(d).length === 0;
  }, [n]), p = m.useCallback(() => ({
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
  }), [n, t]), g = m.useCallback(() => {
    i(r), o({});
  }, [r]);
  return { values: n, setField: c, isDirty: x, errors: l, validate: u, toUpdateDto: p, reset: g };
}
function $t(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function ts() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ia() {
  var n;
  const t = ne({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: ts,
    staleTime: 3e5,
    retry: !1
  }), a = ((n = t.data) == null ? void 0 : n.items) ?? [], s = a.map((i) => ({ value: i.id, label: $t(i) })), r = new Map(a.map((i) => [i.id, $t(i)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function dt() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function as(t) {
  const a = dt();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function la(t) {
  const a = se(), s = ["task-features", t], r = ne({
    queryKey: s,
    queryFn: () => as(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = oe({
    mutationFn: (o) => Promise.resolve(dt().addFeature(t, o)),
    onSuccess: n
  }), l = oe({
    mutationFn: (o) => Promise.resolve(dt().removeFeature(t, o)),
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
const Ve = {
  0: { label: "İptal", icon: "fa-ban", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  1: { label: "Yapılacak", icon: "fa-clock", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  2: { label: "Sürüyor", icon: "fa-spinner", bg: "bg-warning-subtle", fg: "text-warning", dot: "bg-warning" },
  3: { label: "Testte", icon: "fa-flask", bg: "bg-primary-subtle", fg: "text-primary", dot: "bg-primary" },
  4: { label: "Tamamlandı", icon: "fa-circle-check", bg: "bg-success-subtle", fg: "text-success", dot: "bg-success" }
}, xt = {
  1: { label: "Düşük", icon: "fa-arrow-down", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  2: { label: "Orta", icon: "fa-minus", bg: "bg-warning-subtle", fg: "text-warning" },
  3: { label: "Yüksek", icon: "fa-arrow-up", bg: "bg-negative-subtle", fg: "text-negative" },
  4: { label: "Kritik", icon: "fa-flag", bg: "bg-negative-subtle", fg: "text-negative" }
}, oa = [1, 2, 3, 4], ss = [1, 2, 3, 4], Re = (t) => Ve[t] ?? Ve[1], ca = (t) => xt[t] ?? xt[2];
function Ke(t) {
  if (!t) return "—";
  const a = String(t).trim().split(/\s+/).filter(Boolean);
  return a.length ? (a.length > 1 ? a[0][0] + a[a.length - 1][0] : a[0].slice(0, 2)).toUpperCase() : "—";
}
function Me(t) {
  return t ? "var(--apya-brand-500)" : "var(--apya-neutral-500)";
}
function rs(t, a = /* @__PURE__ */ new Date()) {
  if (!t) return { tone: "text-text-tertiary", hint: "" };
  const s = new Date(t);
  if (Number.isNaN(s.getTime())) return { tone: "text-text-tertiary", hint: "" };
  const r = Math.ceil((s.setHours(0, 0, 0, 0) - new Date(a).setHours(0, 0, 0, 0)) / 864e5);
  return r < 0 ? { tone: "text-negative", hint: `${Math.abs(r)} gün gecikti` } : r === 0 ? { tone: "text-warning", hint: "Bugün" } : r <= 3 ? { tone: "text-warning", hint: `${r} gün kaldı` } : { tone: "text-text-tertiary", hint: `${r} gün kaldı` };
}
const Te = "rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden";
function Qe({ title: t, badge: a, action: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3.5 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: t }),
      a
    ] }),
    s
  ] });
}
function ns({ children: t, tone: a = "positive" }) {
  const s = a === "positive" ? "bg-success-subtle text-success" : "bg-neutral-subtle text-text-secondary";
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-full font-mono text-[11px] font-bold ${s}`, children: t });
}
function Ze({ children: t, bg: a, fg: s }) {
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-[7px] text-[10.5px] font-bold ${a} ${s}`, children: t });
}
function ze({ icon: t, title: a, description: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 px-6 py-10 text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-xl text-text-tertiary` }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: a }),
    s && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] leading-[1.55] text-text-tertiary max-w-[420px]", children: s })
  ] });
}
function da({ name: t, size: a = 24 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Me(t), fontSize: a * 0.4 },
      title: t || void 0,
      children: Ke(t)
    }
  );
}
const xa = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—", Et = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function is(t) {
  return t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toFixed(1)} MB` : "0 KB";
}
function Je(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = Math.floor(a / 3600), r = Math.floor(a % 3600 / 60);
  return !s && !r ? `${a}sn` : s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function ls(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = (r) => String(r).padStart(2, "0");
  return `${s(Math.floor(a / 3600))}:${s(Math.floor(a / 60) % 60)}:${s(a % 60)}`;
}
const ke = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  image: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  sheet: { icon: "fa-file-excel", bg: "bg-success-subtle", fg: "text-success" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  zip: { icon: "fa-file-zipper", bg: "bg-warning-subtle", fg: "text-warning" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
};
function os(t = "") {
  var s;
  const a = ((s = t.split(".").pop()) == null ? void 0 : s.toLowerCase()) ?? "";
  return a === "pdf" ? ke.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(a) ? ke.image : ["doc", "docx", "odt", "rtf", "txt"].includes(a) ? ke.doc : ["xls", "xlsx", "csv", "ods"].includes(a) ? ke.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(a) ? ke.code : ["zip", "rar", "7z", "tar", "gz"].includes(a) ? ke.zip : ke.other;
}
function cs({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, n] = m.useState(""), [i, l] = m.useState(!1), o = se(), c = (a == null ? void 0 : a.subTasks) ?? [], x = c.filter((d) => d.status === 4).length, u = () => o.invalidateQueries({ queryKey: ["task-detail", t] }), p = async () => {
    var b, y, f;
    const d = r.trim();
    if (d) {
      l(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: d,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), n(""), await u();
      } catch (N) {
        (f = (y = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : y.error) == null || f.call(y, (N == null ? void 0 : N.message) || "Alt görev eklenemedi.");
      } finally {
        l(!1);
      }
    }
  }, g = async (d, b) => {
    var y, f, N;
    d.stopPropagation();
    try {
      await Promise.resolve(window.apya.platform.tasks.task.updateStatus(b.id, b.status === 4 ? 1 : 4)), await u();
    } catch (k) {
      (N = (f = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : f.error) == null || N.call(f, (k == null ? void 0 : k.message) || "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        c.length > 0 && /* @__PURE__ */ e.jsxs(ns, { children: [
          x,
          "/",
          c.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: p,
          disabled: i || !r.trim(),
          className: `flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${i || !r.trim() ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            "Alt görev ekle"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: Te, children: [
      c.map((d) => {
        const b = Re(d.status), y = d.status === 4;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => s == null ? void 0 : s(d.id, d.title),
            onKeyDown: (f) => {
              f.key === "Enter" && (s == null || s(d.id, d.title));
            },
            className: "flex items-center gap-3.5 px-4 py-3.5 border-t border-subtle first:border-t-0 hover:bg-surface-raised cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": `${d.title} tamamlandı işaretle`,
                  onClick: (f) => g(f, d),
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white cursor-pointer ${y ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: y && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: d.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${y ? "line-through text-text-tertiary" : "text-text-primary"}`, children: d.title }),
              /* @__PURE__ */ e.jsx(Ze, { bg: b.bg, fg: b.fg, children: b.label }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: xa(d.dueDate) }),
              /* @__PURE__ */ e.jsx(da, { name: d.assigneeName }),
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
            d.key === "Enter" && p();
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
function ua() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function ds(t) {
  const a = ua();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function xs(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, n = Sa();
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
function pa(t) {
  const a = se(), s = ["task-attachments", t], r = ne({
    queryKey: s,
    queryFn: () => ds(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = oe({
    mutationFn: (o) => xs(t, o),
    onSuccess: n
  }), l = oe({
    mutationFn: (o) => Promise.resolve(ua().deleteAttachment(o)),
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
function us({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: n } = pa(t), i = se(), l = m.useRef(null), [o, c] = m.useState(!1), x = We("Platform.Tasks.ShareExternally"), u = async (d, b) => {
    var y, f, N;
    try {
      await window.apya.platform.tasks.taskShare.setAttachmentGuestVisibility(d, b), i.invalidateQueries({ queryKey: ["task-attachments", t] });
    } catch (k) {
      (N = (f = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : f.error) == null || N.call(f, (k == null ? void 0 : k.message) || "Görünürlük değiştirilemedi.");
    }
  }, p = async (d) => {
    var b, y, f, N, k, S;
    if (d)
      try {
        await s(d), (f = (y = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : y.success) == null || f.call(y, "Dosya yüklendi.");
      } catch (E) {
        (S = (k = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : k.error) == null || S.call(k, (E == null ? void 0 : E.message) || "Dosya yüklenemedi.");
      } finally {
        l.current && (l.current.value = "");
      }
  }, g = async (d, b) => {
    var y, f, N;
    try {
      await r(d);
    } catch (k) {
      (N = (f = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : f.error) == null || N.call(f, (k == null ? void 0 : k.message) || `${b} silinemedi.`);
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
          var b;
          return p((b = d.target.files) == null ? void 0 : b[0]);
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
          var b;
          d.key === "Enter" && ((b = l.current) == null || b.click());
        },
        onDragOver: (d) => {
          d.preventDefault(), o || c(!0);
        },
        onDragLeave: () => c(!1),
        onDrop: (d) => {
          var b, y;
          d.preventDefault(), c(!1), p((y = (b = d.dataTransfer) == null ? void 0 : b.files) == null ? void 0 : y[0]);
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
      const b = os(d.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${b.bg} ${b.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${b.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: d.fileName, children: d.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: is(d.fileSize) })
              ] })
            ] }),
            x && !d.isGuestUpload && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 text-[11px] text-text-tertiary cursor-pointer", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: !!d.isVisibleToGuests,
                  onChange: (y) => u(d.id, y.target.checked)
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
                    onClick: () => g(d.id, d.fileName),
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
function Ue() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function ps(t) {
  const a = Ue();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function mt(t) {
  const a = se(), s = ["task-checklist", t], r = ne({
    queryKey: s,
    queryFn: () => ps(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = oe({
    mutationFn: (c) => Promise.resolve(Ue().addChecklistItem(t, c)),
    onSuccess: n
  }), l = oe({
    mutationFn: (c) => Promise.resolve(Ue().toggleChecklistItem(c)),
    onSuccess: n
  }), o = oe({
    mutationFn: (c) => Promise.resolve(Ue().deleteChecklistItem(c)),
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
function ms({ taskId: t }) {
  const { items: a, addItem: s, toggleItem: r, removeItem: n } = mt(t), [i, l] = m.useState(""), o = async () => {
    var p, g, d;
    const u = i.trim();
    if (u)
      try {
        await s(u), l("");
      } catch (b) {
        (d = (g = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : g.error) == null || d.call(g, (b == null ? void 0 : b.message) || "Madde eklenemedi.");
      }
  }, c = async (u) => {
    var p, g, d;
    try {
      await r(u);
    } catch (b) {
      (d = (g = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : g.error) == null || d.call(g, (b == null ? void 0 : b.message) || "Madde güncellenemedi.");
    }
  }, x = async (u, p) => {
    var g, d, b;
    try {
      await n(u);
    } catch (y) {
      (b = (d = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : d.error) == null || b.call(d, (y == null ? void 0 : y.message) || `${p} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        Ee,
        {
          value: i,
          onChange: (u) => l(u.target.value),
          onKeyDown: (u) => {
            u.key === "Enter" && o();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ e.jsx(ae, { variant: "secondary", onClick: o, disabled: !i.trim(), children: "Ekle" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz madde eklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "space-y-1.5", children: a.map((u) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-2 py-1", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: u.isDone,
            onChange: () => c(u.id)
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: u.isDone ? "text-text-tertiary line-through" : "text-text-primary", children: u.text })
      ] }),
      /* @__PURE__ */ e.jsx(ae, { variant: "ghost", onClick: () => x(u.id, u.text), "aria-label": `${u.text} maddesini sil`, children: "Sil" })
    ] }, u.id)) })
  ] });
}
function fs({ taskId: t, task: a }) {
  const [s, r] = m.useState(""), [n, i] = m.useState(null), [l, o] = m.useState(""), [c, x] = m.useState(!1), u = se(), p = (a == null ? void 0 : a.comments) ?? [], g = async (b) => {
    var y, f, N, k, S, E;
    if (b == null || b.preventDefault(), !(!s.trim() || c)) {
      x(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), u.invalidateQueries({ queryKey: ["task-detail", t] }), (N = (f = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : f.success) == null || N.call(f, "Yorum eklendi.");
      } catch (K) {
        (E = (S = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : S.error) == null || E.call(S, (K == null ? void 0 : K.message) || "Yorum eklenemedi.");
      } finally {
        x(!1);
      }
    }
  }, d = async (b) => {
    var y, f, N, k, S, E;
    if (!(!l.trim() || c)) {
      x(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(b, l.trim())
        ), o(""), i(null), u.invalidateQueries({ queryKey: ["task-detail", t] }), (N = (f = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : f.success) == null || N.call(f, "Yanıt eklendi.");
      } catch (K) {
        (E = (S = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : S.error) == null || E.call(S, (K == null ? void 0 : K.message) || "Yanıt eklenemedi.");
      } finally {
        x(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("form", { onSubmit: g, className: "rounded-lg border border-default p-3 bg-surface-base", children: [
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
          disabled: !s.trim() || c,
          isLoading: c,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    p.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: p.map((b) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
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
          onClick: () => i(n === b.id ? null : b.id),
          children: "Yanıtla"
        }
      ) }),
      n === b.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: l,
            onChange: (y) => o(y.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(ae, { variant: "ghost", size: "sm", onClick: () => i(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(ae, { variant: "primary", size: "sm", disabled: !l.trim() || c, onClick: () => d(b.id), children: "Gönder" })
        ] })
      ] }),
      b.replies && b.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: b.replies.map((y) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: y.creatorUserName || y.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: y.creationTime ? new Date(y.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: y.text })
      ] }, y.id)) })
    ] }, b.id)) })
  ] });
}
function Xe() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.taskShare) ?? null;
}
function bs(t) {
  const a = se(), s = ["task-share-links", t], r = ne({
    queryKey: s,
    queryFn: () => {
      const o = Xe();
      return o ? Promise.resolve(o.getList(t)) : Promise.reject(new Error("Paylaşım servisi yüklenmedi."));
    },
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = oe({
    mutationFn: (o) => Promise.resolve(Xe().create({ ...o, taskId: t })),
    onSuccess: n
  }), l = oe({
    mutationFn: (o) => Promise.resolve(Xe().revoke(o)),
    onSuccess: n
  });
  return {
    links: r.data ?? [],
    isLoading: r.isLoading,
    error: r.error,
    create: i.mutateAsync,
    revoke: l.mutateAsync,
    isCreating: i.isPending
  };
}
const Pt = {
  recipientName: "",
  recipientEmail: "",
  lifetimeDays: 14,
  allowComment: !0,
  allowUpload: !0,
  allowDownload: !0
};
function hs(t) {
  return t ? new Date(t).toLocaleDateString("tr-TR") : "—";
}
function gs({ taskId: t }) {
  const { links: a, isLoading: s, create: r, revoke: n, isCreating: i } = bs(t), [l, o] = m.useState(Pt), [c, x] = m.useState(null);
  if (!We("Platform.Tasks.ShareExternally"))
    return /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Görevi ekip dışıyla paylaşma yetkiniz yok." });
  const p = (f) => (N) => {
    const k = N.target.type === "checkbox" ? N.target.checked : N.target.value;
    o((S) => ({ ...S, [f]: k }));
  }, g = async (f) => {
    var N, k, S;
    if (f.preventDefault(), !!l.recipientName.trim())
      try {
        const E = await r({
          ...l,
          lifetimeDays: Number(l.lifetimeDays) || 14
        });
        x(E), o(Pt);
      } catch (E) {
        (S = (k = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : k.error) == null || S.call(k, (E == null ? void 0 : E.message) || "Paylaşım linki üretilemedi.");
      }
  }, d = (f) => `${window.location.origin}${f}`, b = (f) => {
    var N, k, S, E;
    (N = navigator.clipboard) == null || N.writeText(d(f)), (E = (S = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : S.info) == null || E.call(S, "Bağlantı kopyalandı.");
  }, y = async (f) => {
    var N, k, S;
    try {
      await n(f);
    } catch (E) {
      (S = (k = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : k.error) == null || S.call(k, (E == null ? void 0 : E.message) || "Bağlantı iptal edilemedi.");
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
            onClick: () => b(c.url),
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
    /* @__PURE__ */ e.jsxs("form", { onSubmit: g, className: "flex flex-col gap-2.5 rounded-[14px] border border-subtle bg-surface-base p-3.5", children: [
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
            disabled: i,
            className: "shrink-0 rounded-[8px] bg-primary px-3.5 py-2 text-[12px] font-bold text-white cursor-pointer disabled:opacity-60",
            children: i ? "Üretiliyor…" : "Bağlantı üret"
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
              f.isActive ? `${hs(f.expiresAt)} tarihine kadar geçerli` : f.revokedAt ? "İptal edildi" : "Süresi doldu",
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
              onClick: () => y(f.id),
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
function ys({ task: t }) {
  var s;
  const a = [];
  return t != null && t.creationTime && a.push({
    id: "created",
    icon: "fa-plus",
    bg: "bg-success-subtle",
    fg: "text-success",
    actor: t.creatorUserName || t.creatorName || "Sistem / Kullanıcı",
    event: "görevi oluşturdu",
    time: Et(t.creationTime)
  }), t != null && t.lastModificationTime && a.push({
    id: "modified",
    icon: "fa-pen",
    bg: "bg-warning-subtle",
    fg: "text-warning",
    actor: t.lastModifierUserName || t.lastModifierName || "Kullanıcı",
    event: "görevi güncelledi",
    time: Et(t.lastModificationTime)
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
function vs({ task: t }) {
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
function je(t, a) {
  const s = a || "TRY";
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: s, minimumFractionDigits: 2 }).format(t || 0);
  } catch {
    return `${(t || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${s}`.trim();
  }
}
function et({ label: t, value: a, tone: s, note: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: `font-mono text-[22px] font-bold tracking-[-.02em] ${s}`, style: { fontVariantNumeric: "tabular-nums" }, children: a }),
    r && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
  ] });
}
function js({ task: t, spentByCurrency: a }) {
  const s = t == null ? void 0 : t.plannedAmount;
  if (!(t != null && t.budgetLineId) || s == null)
    return null;
  const r = a, n = s - r, i = s > 0 ? Math.round(r / s * 100) : 0, l = n < 0;
  return /* @__PURE__ */ e.jsxs("div", { className: Te, children: [
    /* @__PURE__ */ e.jsx(Qe, { title: "Bütçe bağı" }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-4 pb-4 pt-1 flex flex-col gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-semibold text-accent", children: t.budgetLineName || "Bütçe kalemi" }),
        t.budgetLineRemaining != null && /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "kalemde kalan ",
          je(t.budgetLineRemaining, "TRY")
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3", children: [
        /* @__PURE__ */ e.jsx(tt, { label: "Görev bütçesi", value: je(s, "TRY") }),
        /* @__PURE__ */ e.jsx(tt, { label: "Gerçekleşen", value: je(r, "TRY") }),
        /* @__PURE__ */ e.jsx(
          tt,
          {
            label: "Kalan",
            value: je(n, "TRY"),
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
function tt({ label: t, value: a, tone: s }) {
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
function ws({ task: t }) {
  const a = (t == null ? void 0 : t.expenses) || [], s = (t == null ? void 0 : t.incomes) || [], r = a.filter((c) => (c.currency || "TRY") === "TRY").reduce((c, x) => c + (x.amount || 0), 0), n = /* @__PURE__ */ e.jsx(js, { task: t, spentByCurrency: r });
  if (a.length === 0 && s.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      n,
      /* @__PURE__ */ e.jsxs("div", { className: Te, children: [
        /* @__PURE__ */ e.jsx(Qe, { title: "Görev Finansı" }),
        /* @__PURE__ */ e.jsx(
          ze,
          {
            icon: "fa-coins",
            title: "Kayıt yok",
            description: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
          }
        )
      ] })
    ] });
  const l = Array.from(new Set([...a, ...s].map((c) => c.currency || "TRY"))).map((c) => {
    const x = s.filter((p) => (p.currency || "TRY") === c).reduce((p, g) => p + (g.amount || 0), 0), u = a.filter((p) => (p.currency || "TRY") === c).reduce((p, g) => p + (g.amount || 0), 0);
    return { cur: c, inc: x, exp: u, net: x - u };
  }), o = [
    ...s.map((c) => ({ ...c, kind: "income" })),
    ...a.map((c) => ({ ...c, kind: "expense" }))
  ].sort((c, x) => new Date(x.date || 0) - new Date(c.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    n,
    l.map(({ cur: c, inc: x, exp: u, net: p }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(et, { label: `Toplam Gelir (${c})`, value: je(x, c), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(et, { label: `Toplam Gider (${c})`, value: je(u, c), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        et,
        {
          label: `Net Bakiye (${c})`,
          value: je(p, c),
          tone: p >= 0 ? "text-success" : "text-negative",
          note: p >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, c)),
    /* @__PURE__ */ e.jsxs("div", { className: Te, children: [
      /* @__PURE__ */ e.jsx(Qe, { title: "Finans kalemleri" }),
      o.map((c) => /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-7 w-7 rounded-lg bg-neutral-subtle text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c.kind === "income" ? "fa-arrow-down" : "fa-arrow-up"} text-[11px]` }) }),
            /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] font-semibold text-text-primary", children: c.title || (c.kind === "income" ? "Gelir" : "Gider") }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: xa(c.date) }),
            c.kind === "income" ? /* @__PURE__ */ e.jsx(Ze, { bg: "bg-success-subtle", fg: "text-success", children: "Gelir" }) : /* @__PURE__ */ e.jsx(Ze, { bg: "bg-warning-subtle", fg: "text-warning", children: "Gider" }),
            /* @__PURE__ */ e.jsxs(
              "span",
              {
                className: `shrink-0 font-mono text-[12.5px] font-bold ${c.kind === "income" ? "text-success" : "text-text-primary"}`,
                style: { fontVariantNumeric: "tabular-nums" },
                children: [
                  c.kind === "income" ? "+" : "−",
                  je(c.amount, c.currency)
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
const Ns = {
  0: "bg-neutral-400",
  1: "bg-text-tertiary",
  2: "bg-warning",
  3: "bg-primary",
  4: "bg-success"
};
function at(t) {
  if (!t) return null;
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? null : a;
}
const Ae = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
function ks({ task: t = {} }) {
  const a = m.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((l, o) => ({
    id: l.id || `row-${o}`,
    name: l.title || "Başlıksız görev",
    isMain: !!l.__main,
    start: at(l.startDate),
    end: at(l.dueDate) || at(l.completedDate),
    status: l.status ?? 1
  })), [t]), { min: s, span: r } = m.useMemo(() => {
    const i = a.flatMap((c) => [c.start, c.end]).filter(Boolean).map((c) => c.getTime());
    if (i.length === 0) return { min: null, span: 0 };
    const l = Math.min(...i), o = Math.max(...i);
    return { min: l, span: Math.max(1, o - l) };
  }, [a]), n = m.useMemo(() => s === null ? [] : [0, 1, 2, 3].map((i) => new Date(s + r * i / 4)), [s, r]);
  return s === null ? /* @__PURE__ */ e.jsx("div", { className: Te, children: /* @__PURE__ */ e.jsx(
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
        Ae(new Date(s)),
        " – ",
        Ae(new Date(s + r))
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-4 gap-0 pl-[170px] mb-2 lt-860:pl-[110px]", children: n.map((i, l) => /* @__PURE__ */ e.jsx(
      "span",
      {
        className: "pl-2 border-l border-subtle text-[10.5px] font-bold uppercase tracking-[.06em] text-text-tertiary",
        children: Ae(i)
      },
      l
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: a.map((i) => {
      const l = i.start ? i.start.getTime() : s, o = i.end ? Math.max(i.end.getTime(), l) : l, c = (l - s) / r * 100, x = Math.max(2, (o - l) / r * 100), u = Math.max(1, Math.round((o - l) / 864e5));
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
            className: `absolute top-[7px] bottom-[7px] flex items-center px-2.5 rounded-[7px] shadow-xs ${Ns[i.status] || "bg-primary"}`,
            style: { left: `${c}%`, width: `${x}%` },
            title: `${Ae(i.start)} – ${Ae(i.end)}`,
            children: /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[10.5px] font-bold text-white", children: [
              u,
              "g"
            ] })
          }
        ) })
      ] }, i.id);
    }) })
  ] });
}
function Lt({ icon: t, iconTone: a, title: s, note: r, children: n }) {
  return /* @__PURE__ */ e.jsxs("div", { className: Te, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[12px] ${a}` }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: s }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
    ] }),
    n
  ] });
}
function Cs({ task: t = {} }) {
  const a = se(), s = t.predecessorIds || [], r = () => {
    var c, x, u;
    return (u = (x = (c = window == null ? void 0 : window.apya) == null ? void 0 : c.platform) == null ? void 0 : x.tasks) == null ? void 0 : u.task;
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
    var x, u, p, g, d, b;
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
        predecessorIds: s.filter((y) => y !== c),
        tagNames: (t.tags ?? []).map((y) => y.name),
        estimatedHours: t.estimatedHours ?? null,
        taskType: t.taskType ?? null,
        sprint: t.sprint ?? null
      })), await a.invalidateQueries({ queryKey: ["task-detail", t.id] }), (p = (u = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : u.info) == null || p.call(u, "Bağlantı kaldırıldı.");
    } catch (y) {
      (b = (d = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : d.error) == null || b.call(d, (y == null ? void 0 : y.message) || "Bağlantı kaldırılamadı.");
    }
  }, o = (c) => {
    var x, u, p;
    return (p = (u = (x = window == null ? void 0 : window.apya) == null ? void 0 : x.taskDetail) == null ? void 0 : u.open) == null ? void 0 : p.call(u, c);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsx(
      Lt,
      {
        icon: "fa-arrow-left-long",
        iconTone: "text-warning",
        title: "Öncül görevler",
        note: "bu görev başlamadan tamamlanmalı",
        children: s.length === 0 ? /* @__PURE__ */ e.jsx(ze, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : i ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : n.map((c) => {
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
                x && /* @__PURE__ */ e.jsx(Ze, { bg: x.bg, fg: x.fg, children: x.label }),
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
      Lt,
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
function Se() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task) || null;
}
function Ts(t) {
  const a = se(), s = ["task-timelogs", t], r = ["task-active-timelog"], n = ne({
    queryKey: s,
    queryFn: () => {
      var x;
      return Promise.resolve((x = Se()) == null ? void 0 : x.getTimeLogs(t));
    },
    enabled: !!t && !!Se(),
    staleTime: 15e3,
    retry: !1
  }), i = ne({
    queryKey: r,
    queryFn: () => {
      var x;
      return Promise.resolve((x = Se()) == null ? void 0 : x.getActiveTimeLog());
    },
    enabled: !!Se(),
    staleTime: 5e3,
    retry: !1
  }), l = () => {
    a.invalidateQueries({ queryKey: s }), a.invalidateQueries({ queryKey: r });
  }, o = oe({
    mutationFn: () => {
      var x;
      return Promise.resolve((x = Se()) == null ? void 0 : x.startTimeTracking(t));
    },
    onSuccess: l
  }), c = oe({
    mutationFn: () => {
      var x;
      return Promise.resolve((x = Se()) == null ? void 0 : x.stopTimeTracking(t));
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
function At(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function Ds({ taskId: t, task: a = {} }) {
  const s = Ts(t), r = s.activeLog && s.activeLog.taskId === t ? s.activeLog : null, [n, i] = m.useState(() => Date.now());
  m.useEffect(() => {
    if (!r) return;
    const b = setInterval(() => i(Date.now()), 1e3);
    return () => clearInterval(b);
  }, [r]);
  const l = r ? Math.max(0, Math.floor((n - new Date(r.startTime).getTime()) / 1e3)) : 0, c = s.logs.reduce((b, y) => b + (y.secondsSpent || 0), 0) + l, x = (a == null ? void 0 : a.estimatedHours) ?? null, u = x ? x * 3600 : 0, p = u ? Math.min(100, Math.round(c / u * 100)) : 0, g = u ? Math.max(0, u - c) : 0, d = async () => {
    var b, y, f;
    try {
      r ? await s.stop() : await s.start();
    } catch (N) {
      (f = (y = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : y.error) == null || f.call(y, (N == null ? void 0 : N.message) || "Zaman takibi güncellenemedi.");
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
              children: ls(c)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary", children: r ? "Kayıt sürüyor" : "Sayaç duraklatıldı" })
        ] })
      ] }),
      u > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] font-bold text-text-secondary", children: "Tahmin kullanımı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
            Je(c),
            " / ",
            x,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-warning", style: { width: `${p}%` } }) }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "Kalan tahmini süre: ",
          Je(g)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: Te, children: [
      /* @__PURE__ */ e.jsx(Qe, { title: "Zaman kayıtları" }),
      s.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : s.logs.length === 0 ? /* @__PURE__ */ e.jsx(
        ze,
        {
          icon: "fa-stopwatch",
          title: "Henüz zaman kaydı yok",
          description: "Soldaki yeşil düğmeyle sayacı çalıştırın; durdurduğunuzda kayıt buraya düşer."
        }
      ) : s.logs.map((b) => {
        const y = !b.endTime;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
            children: [
              /* @__PURE__ */ e.jsx(da, { name: b.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: b.note || b.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                At(b.startTime),
                " → ",
                y ? "sürüyor" : At(b.endTime)
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary", children: y ? "Aktif" : Je(b.secondsSpent || 0) })
            ]
          },
          b.id
        );
      })
    ] })
  ] });
}
const Fe = [
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
    component: cs
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
    component: us
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
    component: ms
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
    component: ks
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
    component: Cs
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
    component: ws
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
    component: vs
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
    component: ys
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
    component: fs
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
    component: gs
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
    component: Ds
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
function ma(t = []) {
  const a = new Set(t);
  return Fe.filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function Ss(t = []) {
  const a = new Set(t);
  return Fe.filter((s) => !s.isCore).filter((s) => !s.permission || We(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let qe = null;
const _e = /* @__PURE__ */ new Set(), st = /* @__PURE__ */ new Set();
function It() {
  _e.forEach((t) => t());
}
function $s(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const re = {
  open(t) {
    const a = $s(t);
    a && (qe = a, It());
  },
  close() {
    qe = null, It();
  },
  subscribe(t) {
    return _e.add(t), () => _e.delete(t);
  },
  getSnapshot() {
    return qe;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && st.add(t);
  },
  emitResult() {
    st.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    qe = null, _e.clear(), st.clear();
  }
}, Bt = "apya.taskDetail.fullscreen";
function fa({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, n] = m.useState(t), [i, l] = m.useState([]), { data: o, isLoading: c, isError: x, refetch: u } = ut(r), p = ta(), g = na(o), d = ia(), b = la(r), [y, f] = m.useState("general"), [N, k] = m.useState(!1), S = Be.useRef(null), E = m.useMemo(
    () => ma(b.assignedCodes),
    [b.assignedCodes]
  ), K = m.useMemo(
    () => Ss(b.assignedCodes),
    [b.assignedCodes]
  ), R = E.find((L) => L.code === y) ?? E[0];
  Be.useEffect(() => {
    R.code !== y && f(R.code);
  }, [R, y]);
  const W = R == null ? void 0 : R.component, M = se(), [q, U] = m.useState(
    () => {
      var L;
      return ((L = window.localStorage) == null ? void 0 : L.getItem(Bt)) === "1";
    }
  ), [B, _] = m.useState(!1), J = m.useCallback(() => {
    sa(), s == null || s();
  }, [s]);
  ra(t, J), Be.useEffect(() => {
    g.isDirty ? p.markDirty() : p.markClean();
  });
  const V = m.useCallback(() => p.requestClose(J), [p, J]), X = m.useCallback(() => {
    U((L) => {
      var G;
      const I = !L;
      return (G = window.localStorage) == null || G.setItem(Bt, I ? "1" : "0"), I;
    });
  }, []), O = We("Platform.Tasks.Delete"), [ee, j] = m.useState(!1), [v, h] = m.useState(!1), T = m.useCallback(async () => {
    var L, I, G, te, Z, we;
    h(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (G = (I = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : I.info) == null || G.call(I, "Başarıyla silindi."), j(!1), p.markClean(), J();
    } catch (xe) {
      (we = (Z = (te = window == null ? void 0 : window.abp) == null ? void 0 : te.notify) == null ? void 0 : Z.error) == null || we.call(Z, (xe == null ? void 0 : xe.message) || "Görev silinemedi.");
    } finally {
      h(!1);
    }
  }, [r, p, J]), $ = m.useCallback(async () => {
    var L, I, G, te, Z, we;
    if (!g.validate()) return !1;
    _(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, g.toUpdateDto())
      ), await M.invalidateQueries({ queryKey: ["task-detail", r] }), re.emitResult(), (G = (I = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : I.success) == null || G.call(I, "Kaydedildi."), !0;
    } catch (xe) {
      return (we = (Z = (te = window == null ? void 0 : window.abp) == null ? void 0 : te.notify) == null ? void 0 : Z.error) == null || we.call(Z, (xe == null ? void 0 : xe.message) || "Kaydedilemedi."), !1;
    } finally {
      _(!1);
    }
  }, [r, g, p, M]), H = m.useCallback(() => {
    $();
  }, [$]), ce = m.useCallback(async () => {
    const L = p.resolvePendingClose("save");
    await $() && (L == null || L());
  }, [p, $]), w = m.useCallback((L, I) => {
    p.requestClose(() => {
      l((G) => [...G, { id: r, title: (o == null ? void 0 : o.title) ?? "" }]), n(L), f("general"), p.markClean();
    });
  }, [p, r, o]), A = m.useCallback((L) => {
    p.requestClose(() => {
      l((I) => {
        const G = I.findIndex((te) => te.id === L);
        return G === -1 ? I : I.slice(0, G);
      }), n(L), f("general"), p.markClean();
    });
  }, [p]), P = m.useCallback(async (L) => {
    var I, G, te;
    try {
      await b.addFeature(L), f(L), k(!1);
    } catch (Z) {
      (te = (G = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : G.error) == null || te.call(G, (Z == null ? void 0 : Z.message) || "Özellik eklenemedi.");
    }
  }, [b]), F = m.useCallback(async (L) => {
    var I, G, te;
    try {
      await b.removeFeature(L), f((Z) => Z === L ? "general" : Z);
    } catch (Z) {
      (te = (G = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : G.error) == null || te.call(G, (Z == null ? void 0 : Z.message) || "Özellik kaldırılamadı.");
    }
  }, [b]);
  Be.useEffect(() => {
    if (!N) return;
    const L = (G) => {
      S.current && !S.current.contains(G.target) && k(!1);
    }, I = (G) => {
      G.key === "Escape" && k(!1);
    };
    return document.addEventListener("mousedown", L), document.addEventListener("keydown", I), () => {
      document.removeEventListener("mousedown", L), document.removeEventListener("keydown", I);
    };
  }, [N]);
  const Y = c ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(be, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(be, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(be, { className: "h-24 w-full" })
  ] }) : x ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(ae, { variant: "ghost", onClick: () => u(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      Za,
      {
        trail: i,
        current: { id: r, title: (o == null ? void 0 : o.title) ?? "" },
        onNavigate: A
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: S, children: [
      /* @__PURE__ */ e.jsx(
        Ha,
        {
          tabs: E,
          activeCode: R.code,
          onSelect: (L) => {
            f(L), k(!1);
          },
          onOpenPicker: () => k((L) => !L),
          pickerOpen: N
        }
      ),
      N && /* @__PURE__ */ e.jsx(
        Qa,
        {
          entries: K,
          busyCode: b.isMutating ? b.mutatingCode : null,
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
        "aria-labelledby": `task-tab-${R.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          R.code === "general" ? /* @__PURE__ */ e.jsx(
            Oa,
            {
              values: g.values,
              errors: g.errors,
              onFieldChange: g.setField,
              assigneeOptions: d.options,
              isLoadingAssignees: d.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(m.Suspense, { fallback: /* @__PURE__ */ e.jsx(be, { className: "h-24 w-full" }), children: W && /* @__PURE__ */ e.jsx(
            W,
            {
              taskId: r,
              task: o,
              onOpenSubtask: w
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            Ya,
            {
              task: o,
              creatorName: d.nameById.get(o.creatorId),
              lastModifierName: d.nameById.get(o.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), ie = a === "page" ? za : Ba;
  return /* @__PURE__ */ e.jsxs(
    ie,
    {
      open: !0,
      fullscreen: q,
      onRequestClose: V,
      title: o ? `Görev Detayı: ${o.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        Ka,
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
        Fa,
        {
          lastSavedAt: o == null ? void 0 : o.lastModificationTime,
          isDirty: p.isDirty,
          isSaving: B,
          onCancel: V,
          onSave: H
        }
      ),
      children: [
        Y,
        p.pendingClose && /* @__PURE__ */ e.jsx(
          Ps,
          {
            isSaving: B,
            onStay: () => p.resolvePendingClose("stay"),
            onDiscard: () => p.resolvePendingClose("discard"),
            onSaveAndClose: ce
          }
        ),
        ee && /* @__PURE__ */ e.jsx(
          Es,
          {
            taskTitle: (o == null ? void 0 : o.title) ?? "",
            busy: v,
            onCancel: () => j(!1),
            onConfirm: T
          }
        )
      ]
    }
  );
}
function Es({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [n, i] = m.useState(""), l = n.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    ba,
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
function ba({ label: t, title: a, description: s, children: r, actions: n }) {
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
function Ps({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    ba,
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
const Ls = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function As({ isPrivate: t = !1, onChange: a = () => {
} }) {
  const s = !!t, [r, n] = m.useState(null);
  return /* @__PURE__ */ e.jsxs(he, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(ge, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
    /* @__PURE__ */ e.jsx(ye, { container: Ce(r), children: /* @__PURE__ */ e.jsxs(
      ve,
      {
        sideOffset: 8,
        align: "end",
        className: "z-50 w-[360px] rounded-2xl border border-subtle bg-surface-base p-4 shadow-float animate-in fade-in-50 zoom-in-95",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle pb-3 mb-3", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shield-halved text-primary text-base" }),
            /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary", children: "Görünürlük" })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: Ls.map((i) => {
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
          /* @__PURE__ */ e.jsx($a, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const zt = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto", Is = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", Bs = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" },
  { what: "Bağlantı kopyala", key: "⌘ L" }
];
function zs({ children: t }) {
  return /* @__PURE__ */ e.jsx(Xt, { asChild: !0, children: t });
}
function Rs({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "inline-flex items-center h-[19px] px-1.5 rounded-[5px] border border-default border-b-2 bg-neutral-subtle font-mono text-[10px] font-semibold text-text-secondary", children: t });
}
function Ks({
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
  onToggleFavorite: u,
  isWatched: p,
  onToggleWatch: g,
  onDuplicate: d,
  onArchive: b,
  onDelete: y,
  onOpenTransfer: f,
  onSaveAsTemplate: N,
  onConvertToSubtask: k,
  onExportPdf: S
}) {
  const [E, K] = m.useState(!1), [R, W] = m.useState(null), [M, q] = m.useState(!1), U = m.useRef(null), B = Ce(R), _ = Re(l ?? t.status), J = t.code || "GRV-—", V = () => {
    var j;
    (j = navigator.clipboard) == null || j.writeText(J), K(!0), setTimeout(() => K(!1), 1800);
  }, X = () => {
    var j, v, h, T;
    (j = navigator.clipboard) == null || j.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), (T = (h = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : h.success) == null || T.call(h, "Görev bağlantısı panoya kopyalandı.");
  }, O = (j) => () => {
    q(!1), j == null || j();
  }, ee = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", kbd: "⌘L", onClick: O(X) },
    { label: "Çoğalt", icon: "fa-copy", kbd: "⌘D", onClick: O(d) },
    { label: "Başka projeye kopyala", icon: "fa-clone", onClick: O(() => f == null ? void 0 : f("copy")) },
    { label: "Şablon olarak kaydet", icon: "fa-bookmark", onClick: O(N) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, onClick: O(() => f == null ? void 0 : f("move")) },
    { label: "Alt göreve dönüştür", icon: "fa-diagram-project", onClick: O(k) },
    { label: p ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: O(g) },
    { label: "Arşivle", icon: "fa-box-archive", separator: !0, onClick: O(b) },
    { label: "Yazdır", icon: "fa-print", kbd: "⌘P", onClick: O(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: O(S) },
    { label: "Sil", icon: "fa-trash-can", kbd: "⌫", separator: !0, danger: !0, onClick: O(y) }
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
              /* @__PURE__ */ e.jsx("i", { className: `${E ? "fa-solid fa-check" : "fa-regular fa-copy"} text-[9px] opacity-60` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(he, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(ge, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
          /* @__PURE__ */ e.jsx(ye, { container: B, children: /* @__PURE__ */ e.jsxs(ve, { sideOffset: 6, align: "start", className: `${zt} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            oa.map((j) => {
              const v = Ve[j], h = (l ?? t.status) === j;
              return /* @__PURE__ */ e.jsx(zs, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => i("status", j),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${h ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${v.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: v.label }),
                    h && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, j);
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
          As,
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
        /* @__PURE__ */ e.jsxs(he, { modal: !0, open: M, onOpenChange: q, children: [
          /* @__PURE__ */ e.jsx(ge, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer seçenekler",
              className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${M ? "bg-surface-hover text-text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(ye, { container: B, children: /* @__PURE__ */ e.jsxs(
            ve,
            {
              sideOffset: 6,
              align: "end",
              collisionBoundary: B ?? [],
              collisionPadding: 12,
              className: `${zt} w-[244px]`,
              children: [
                ee.map((j) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: j.onClick,
                    className: [
                      Is,
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
                  Bs.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: j.what }),
                    /* @__PURE__ */ e.jsx(Rs, { children: j.key })
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
          onClick: u,
          title: x ? "Favorilerden çıkar" : "Favorilere ekle",
          className: `flex items-center justify-center h-8 w-8 shrink-0 rounded-[9px] cursor-pointer ${x ? "bg-warning-subtle text-warning" : "text-text-tertiary hover:bg-surface-hover"}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${x ? "solid" : "regular"} fa-star text-[15px]` })
        }
      )
    ] })
  ] });
}
const Oe = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", Rt = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function fe({ children: t }) {
  return /* @__PURE__ */ e.jsx(Xt, { asChild: !0, children: t });
}
function ue({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[7px] min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.08em] text-text-tertiary select-none", children: t }),
    a
  ] });
}
function Kt({ name: t, size: a = 26 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Me(t), fontSize: a * 0.38 },
      children: Ke(t)
    }
  );
}
function Mt(t) {
  if (t == null) return "—";
  const a = Math.max(0, Math.round(Number(t) * 60)), s = Math.floor(a / 60), r = a % 60;
  return s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function Ms({
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
  tagsValue: u = [],
  progressPercent: p = 0,
  progressNote: g = "",
  onOpenTransfer: d
}) {
  var j, v;
  const [b, y] = m.useState(""), [f, N] = m.useState(""), [k, S] = m.useState(""), [E, K] = m.useState(!1), [R, W] = m.useState(null), M = Re(n ?? t.status), q = ca(i ?? t.priority), U = l ?? t.assigneeId ?? null, B = o ?? t.projectId ?? null, _ = ((j = a.find((h) => h.value === U)) == null ? void 0 : j.label) || t.assigneeName || "Atanmamış", J = ((v = s.find((h) => h.value === B)) == null ? void 0 : v.label) || t.projectName || "Projesiz", V = rs(c ?? t.dueDate), X = a.filter(
    (h) => !b || h.label.toLowerCase().includes(b.toLowerCase())
  ), O = s.filter(
    (h) => !f || h.label.toLowerCase().includes(f.toLowerCase())
  ), ee = () => {
    const h = k.trim();
    h && !u.includes(h) && r("tagNames", [...u, h]), S(""), K(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { ref: W, className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6", children: [
    /* @__PURE__ */ e.jsx(ue, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(he, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(ge, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx(Kt, { name: U ? _ : null }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: _ }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ye, { container: Ce(R), children: /* @__PURE__ */ e.jsxs(ve, { sideOffset: 6, align: "start", className: `${Oe} w-[264px]`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: b,
              onChange: (h) => y(h.target.value),
              placeholder: "Kişi ara…",
              className: Rt
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
          X.map((h) => /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("assigneeId", h.value),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${U === h.value ? "bg-primary-subtle" : "hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx(Kt, { name: h.label, size: 24 }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: h.label }),
                U === h.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
              ]
            }
          ) }, h.value))
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
            onChange: (h) => r("dueDate", h.target.value),
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
          onChange: (h) => r("startDate", h.target.value),
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
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-medium text-text-tertiary", children: g })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "h-1.5 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "h-full rounded-full bg-primary transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
          style: { width: `${p}%` }
        }
      ) })
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(he, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(ge, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
      /* @__PURE__ */ e.jsx(ye, { container: Ce(R), children: /* @__PURE__ */ e.jsxs(ve, { sideOffset: 6, align: "start", className: `${Oe} w-[196px]`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
        oa.map((h) => {
          const T = Ve[h], $ = (n ?? t.status) === h;
          return /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("status", h),
              className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${$ ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${T.dot}` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: T.label }),
                $ && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
              ]
            }
          ) }, h);
        })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(he, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(ge, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
      /* @__PURE__ */ e.jsx(ye, { container: Ce(R), children: /* @__PURE__ */ e.jsxs(ve, { sideOffset: 6, align: "start", className: `${Oe} w-[184px]`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
        ss.map((h) => {
          const T = xt[h], $ = (i ?? t.priority) === h;
          return /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("priority", h),
              className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${$ ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${T.icon} text-[11px] w-[13px]` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: T.label }),
                $ && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
              ]
            }
          ) }, h);
        })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap min-h-8", children: [
      u.map((h) => /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "inline-flex items-center gap-1.5 h-6 px-2 rounded-[7px] border border-primary bg-primary-subtle text-primary text-[11.5px] font-bold",
          children: [
            /* @__PURE__ */ e.jsx("span", { children: h }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Etiketi kaldır",
                onClick: () => r("tagNames", u.filter((T) => T !== h)),
                className: "flex items-center p-0 border-0 bg-transparent text-current opacity-55 hover:opacity-100 hover:text-negative cursor-pointer",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
              }
            )
          ]
        },
        h
      )),
      E ? /* @__PURE__ */ e.jsx(
        "input",
        {
          autoFocus: !0,
          type: "text",
          value: k,
          onChange: (h) => S(h.target.value),
          onBlur: ee,
          onKeyDown: (h) => {
            h.key === "Enter" && ee(), h.key === "Escape" && (S(""), K(!1));
          },
          placeholder: "Etiket…",
          className: "h-6 w-24 px-2 rounded-[7px] border border-focus bg-surface-base text-text-primary text-[11.5px] shadow-focus focus:outline-none"
        }
      ) : /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          "aria-label": "Yeni etiket ekle",
          onClick: () => K(!0),
          className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-dashed border-strong bg-transparent text-text-tertiary text-[11.5px] font-semibold hover:border-focus hover:text-primary hover:bg-primary-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[9px]" }),
            "Etiket"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Proje", children: /* @__PURE__ */ e.jsxs(he, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(ge, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
      /* @__PURE__ */ e.jsx(ye, { container: Ce(R), children: /* @__PURE__ */ e.jsxs(ve, { sideOffset: 6, align: "start", className: `${Oe} w-[250px]`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: f,
              onChange: (h) => N(h.target.value),
              placeholder: "Proje ara…",
              className: Rt
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[210px] overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("projectId", null),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${B ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-neutral-400" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Projesiz" })
              ]
            }
          ) }),
          O.map((h) => /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("projectId", h.value),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${B === h.value ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-primary" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: h.label }),
                B === h.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
              ]
            }
          ) }, h.value))
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
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[13px] font-bold text-text-primary", children: Mt(t.spentHours ?? 0) }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[12px] text-text-tertiary", children: [
        "/ ",
        t.estimatedHours != null ? Mt(t.estimatedHours) : "—"
      ] })
    ] }) })
  ] }) });
}
function Fs({
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
  isDirty: u = !1
}) {
  const [p, g] = m.useState(!1);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-6 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 py-2.5 flex-1 min-w-0 overflow-x-auto custom-scrollbar", children: [
      s.map((d) => {
        const b = t === d.code, y = x[d.code] || 0;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            draggable: !0,
            title: "Sürükleyerek sırayı değiştirin",
            ...ea(() => a(d.code)),
            onDragStart: (f) => {
              n(d.code);
              try {
                f.dataTransfer.effectAllowed = "move", f.dataTransfer.setData("text/plain", d.code);
              } catch {
              }
            },
            onDragOver: (f) => {
              f.preventDefault(), l(d.code);
            },
            onDrop: (f) => {
              f.preventDefault(), o == null || o();
            },
            onDragEnd: i,
            className: [
              "flex shrink-0 items-center gap-2 h-[34px] px-[13px] rounded-[10px]",
              "text-[12.5px] whitespace-nowrap cursor-grab active:cursor-grabbing",
              "transition-opacity duration-fast",
              b ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
              r === d.code ? "opacity-35" : "opacity-100"
            ].join(" "),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.icon} text-[11px] opacity-85` }),
              /* @__PURE__ */ e.jsx("span", { children: d.title }),
              y > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                "rounded-full text-[10px] font-extrabold",
                b ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
              ].join(" "), children: y })
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
            g(!1), c();
          },
          onMouseEnter: () => g(!0),
          onMouseLeave: () => g(!1),
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
    u && /* @__PURE__ */ e.jsxs("span", { className: "flex shrink-0 items-center gap-[7px] h-[26px] px-2.5 rounded-full bg-warning-subtle text-warning text-[11px] font-bold", children: [
      /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-warning animate-pulse" }),
      "Taslak"
    ] })
  ] });
}
function Gs({
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
        s.map((u) => {
          const p = t === u.code, g = x[u.code] || 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              draggable: !0,
              title: "Sürükleyerek sırayı değiştirin",
              ...ea(() => a(u.code)),
              onDragStart: (d) => {
                n(u.code);
                try {
                  d.dataTransfer.effectAllowed = "move", d.dataTransfer.setData("text/plain", u.code);
                } catch {
                }
              },
              onDragOver: (d) => {
                d.preventDefault(), l(u.code);
              },
              onDrop: (d) => {
                d.preventDefault(), o == null || o();
              },
              onDragEnd: i,
              className: [
                "flex shrink-0 items-center gap-[11px] h-9 px-[11px] rounded-[9px]",
                "text-[12.5px] text-left cursor-grab active:cursor-grabbing",
                "transition-opacity duration-fast",
                p ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
                r === u.code ? "opacity-35" : "opacity-100"
              ].join(" "),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-[12px] w-[15px] opacity-85` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: u.title }),
                g > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                  "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                  "rounded-full text-[10px] font-extrabold",
                  p ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
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
function $e({ label: t, value: a, avatarName: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 py-[9px] border-t border-subtle", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-tertiary shrink-0", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
      s && /* @__PURE__ */ e.jsx(
        "span",
        {
          className: "flex shrink-0 items-center justify-center h-[21px] w-[21px] rounded-full text-[color:var(--apya-avatar-fg)] text-[8.5px] font-bold",
          style: { background: Me(s) },
          children: Ke(s)
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", title: typeof a == "string" ? a : void 0, children: a || "—" })
    ] })
  ] });
}
const Ft = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "—";
function qs({ task: t = {}, nameById: a }) {
  const s = (i, l) => {
    var o;
    return i || l && ((o = a == null ? void 0 : a.get) == null ? void 0 : o.call(a, l)) || null;
  }, r = s(t.creatorName, t.creatorId), n = t.lastModificationTime ? s(t.lastModifierName, t.lastModifierId) : null;
  return /* @__PURE__ */ e.jsx("aside", { className: "flex flex-col gap-3.5 min-w-0", children: /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsx($e, { label: "Oluşturan", value: r || "Bilinmiyor", avatarName: r }),
    /* @__PURE__ */ e.jsx($e, { label: "Oluşturma tarihi", value: Ft(t.creationTime) }),
    /* @__PURE__ */ e.jsx($e, { label: "Güncelleyen", value: n || "—", avatarName: n }),
    /* @__PURE__ */ e.jsx($e, { label: "Son güncelleme", value: Ft(t.lastModificationTime) }),
    /* @__PURE__ */ e.jsx($e, { label: "Görev tipi", value: t.taskType }),
    /* @__PURE__ */ e.jsx($e, { label: "Sprint", value: t.sprint })
  ] }) });
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
], Ys = '<table class="apya-rte-table"><tr><th>Kolon 1</th><th>Kolon 2</th></tr><tr><td>Değer</td><td>Değer</td></tr></table><p><br></p>', Us = '<div class="apya-rte-imgph">görsel yer tutucu</div><p><br></p>';
function _s(t) {
  return t ? /<[a-z][\s\S]*>/i.test(t) ? t : `<p>${t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>` : "";
}
function Hs({ value: t, onChange: a, mentionName: s = "ekip arkadaşı" }) {
  const r = m.useRef(null), n = m.useRef(_s(t)), [i, l] = m.useState(!1), [o, c] = m.useState("https://"), x = m.useRef(null), u = (f, N) => {
    var k, S;
    (k = r.current) == null || k.focus();
    try {
      document.execCommand(f, !1, N);
    } catch {
    }
    a == null || a(((S = r.current) == null ? void 0 : S.innerHTML) ?? "");
  }, p = () => {
    const f = window.getSelection();
    x.current = f && f.rangeCount ? f.getRangeAt(0).cloneRange() : null;
  }, g = () => {
    const f = x.current;
    if (!f) return;
    const N = window.getSelection();
    N.removeAllRanges(), N.addRange(f);
  }, d = () => {
    var N;
    const f = o.trim();
    l(!1), !(!f || f === "https://") && ((N = r.current) == null || N.focus(), g(), u("createLink", f), c("https://"));
  }, b = (f) => {
    switch (f.cmd) {
      case "link":
        p();
        return;
      case "image":
        u("insertHTML", Us);
        return;
      case "table":
        u("insertHTML", Ys);
        return;
      case "mention":
        u("insertHTML", `<span class="apya-rte-mention">@${s}</span>&nbsp;`);
        return;
      default:
        u(f.cmd, f.arg);
    }
  }, y = "flex shrink-0 items-center justify-center h-7 w-7 rounded-[7px] border-0 bg-transparent text-text-secondary cursor-pointer hover:bg-surface-base hover:text-primary hover:shadow-xs";
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-[14px] border border-default bg-surface-base overflow-hidden shadow-xs", children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-0.5 px-2 py-1.5 border-b border-subtle bg-neutral-subtle overflow-x-auto custom-scrollbar", children: Os.map((f) => {
      const N = /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          title: f.title,
          onMouseDown: (k) => {
            k.preventDefault(), b(f);
          },
          className: `${y} ${f.gap ? "ml-1.5" : ""}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${f.regular ? "regular" : "solid"} ${f.icon} text-[12px]` })
        },
        f.cmd + f.icon
      );
      return f.cmd !== "link" ? N : /* @__PURE__ */ e.jsxs(he, { modal: !0, open: i, onOpenChange: l, children: [
        /* @__PURE__ */ e.jsx(ge, { asChild: !0, children: N }),
        /* @__PURE__ */ e.jsx(ye, { container: Ce(r.current), children: /* @__PURE__ */ e.jsxs(
          ve,
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
        onInput: (f) => a == null ? void 0 : a(f.currentTarget.innerHTML),
        className: "apya-rte-surface min-h-[150px] p-4 text-[13.5px] leading-[1.7] text-text-primary bg-surface-base focus:outline-none",
        dangerouslySetInnerHTML: { __html: n.current }
      }
    )
  ] });
}
const Gt = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
function rt({ name: t, size: a = 32 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Me(t), fontSize: a * 0.34 },
      children: Ke(t)
    }
  );
}
function qt({ open: t, onClick: a }) {
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
const Ot = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function Vs({
  task: t = {},
  onFieldChange: a = () => {
  },
  descriptionValue: s,
  checklist: r,
  currentUserName: n = "Ben"
}) {
  const i = t == null ? void 0 : t.id, l = se(), [o, c] = m.useState(!0), [x, u] = m.useState(""), p = (r == null ? void 0 : r.items) ?? [], g = p.filter((v) => v.isDone).length, d = p.length ? Math.round(g / p.length * 100) : 0, b = async () => {
    var h, T, $;
    const v = x.trim();
    if (!(!v || !i)) {
      u("");
      try {
        await r.addItem(v);
      } catch (H) {
        ($ = (T = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : T.error) == null || $.call(T, (H == null ? void 0 : H.message) || "Madde eklenemedi.");
      }
    }
  }, [y, f] = m.useState(!0), [N, k] = m.useState(""), [S, E] = m.useState(!1), [K, R] = m.useState(!1), [W, M] = m.useState(null), [q, U] = m.useState(""), [B, _] = m.useState({}), { data: J = [] } = ne({
    queryKey: ["task-comments", i],
    queryFn: () => {
      var v, h, T, $;
      return Promise.resolve(($ = (T = (h = (v = window == null ? void 0 : window.apya) == null ? void 0 : v.platform) == null ? void 0 : h.tasks) == null ? void 0 : T.task) == null ? void 0 : $.getComments(i));
    },
    enabled: !!i,
    staleTime: 1e4
  }), V = async () => {
    await l.invalidateQueries({ queryKey: ["task-comments", i] }), await l.invalidateQueries({ queryKey: ["task-detail", i] });
  }, X = async () => {
    var h, T, $;
    const v = N.trim();
    if (!(!v || !i || K)) {
      R(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.addComment(i, v)), await V(), k("");
      } catch (H) {
        ($ = (T = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : T.error) == null || $.call(T, (H == null ? void 0 : H.message) || "Yorum gönderilemedi.");
      } finally {
        R(!1);
      }
    }
  }, O = async (v) => {
    var T, $, H;
    const h = q.trim();
    if (!(!h || !i))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.replyToComment(v, h)), await V(), U(""), M(null);
      } catch (ce) {
        (H = ($ = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : $.error) == null || H.call($, (ce == null ? void 0 : ce.message) || "Yanıt gönderilemedi.");
      }
  }, ee = (v) => _((h) => {
    const T = h[v] ?? { liked: !1, count: 0 };
    return { ...h, [v]: { liked: !T.liked, count: T.count + (T.liked ? -1 : 1) } };
  }), j = !!N.trim() && !K;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-[9px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Açıklama" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Zengin metin · WYSIWYG" })
      ] }),
      /* @__PURE__ */ e.jsx(
        Hs,
        {
          value: s ?? t.description ?? "",
          onChange: (v) => a("description", v),
          mentionName: n
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: Gt, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
            g,
            "/",
            p.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(qt, { open: o, onClick: () => c((v) => !v) })
      ] }),
      o && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 mt-3.5", children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
            style: { width: `${d}%` }
          }
        ) }),
        p.map((v) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              "aria-label": v.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
              onClick: () => r.toggleItem(v.id).catch((h) => {
                var T, $, H;
                return (H = ($ = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : $.error) == null ? void 0 : H.call($, (h == null ? void 0 : h.message) || "Durum güncellenemedi.");
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
              onClick: () => r.removeItem(v.id).catch((h) => {
                var T, $, H;
                return (H = ($ = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : $.error) == null ? void 0 : H.call($, (h == null ? void 0 : h.message) || "Madde silinemedi.");
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
            onChange: (v) => u(v.target.value),
            onKeyDown: (v) => {
              v.key === "Enter" && b();
            },
            placeholder: "Yeni madde yaz ve Enter'a bas…",
            className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: Gt, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Yorumlar & güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: J.length })
        ] }),
        /* @__PURE__ */ e.jsx(qt, { open: y, onClick: () => f((v) => !v) })
      ] }),
      y && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(rt, { name: n }),
          /* @__PURE__ */ e.jsxs("div", { className: `flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${S ? "border-focus bg-surface-base shadow-focus" : "border-default bg-surface-raised"}`, children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                rows: 2,
                value: N,
                onChange: (v) => k(v.target.value),
                onFocus: () => E(!0),
                onBlur: () => E(!1),
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
                  onMouseDown: (h) => h.preventDefault(),
                  onClick: () => k((h) => h + v.add),
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
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${K ? "fa-circle-notch fa-spin" : "fa-paper-plane"} text-[10px]` }),
                    "Gönder"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1", children: J.map((v) => {
          const h = B[v.id] ?? { liked: !1, count: 0 };
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start py-3 border-t border-subtle", children: [
            /* @__PURE__ */ e.jsx(rt, { name: v.authorName }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: v.authorName }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: Ot(v.creationTime) })
              ] }),
              /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[13px] leading-[1.65] text-text-secondary whitespace-pre-wrap", children: v.text }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 mt-[3px]", children: [
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => ee(v.id),
                    className: `flex items-center gap-1.5 h-[26px] px-[9px] rounded-full border text-[11px] font-semibold cursor-pointer ${h.liked ? "border-primary bg-primary-subtle text-primary" : "border-default bg-transparent text-text-tertiary hover:border-focus"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-thumbs-up text-[10px]" }),
                      h.count
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      M((T) => T === v.id ? null : v.id), U("");
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
                    onChange: (T) => U(T.target.value),
                    onKeyDown: (T) => {
                      T.key === "Enter" && O(v.id);
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
              (v.replies ?? []).map((T) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] mt-2.5 pl-3 border-l-2 border-default", children: [
                /* @__PURE__ */ e.jsx(rt, { name: T.authorName, size: 24 }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: T.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: Ot(T.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-[3px] mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: T.text })
                ] })
              ] }, T.id))
            ] })
          ] }, v.id);
        }) })
      ] })
    ] })
  ] });
}
function Qs({
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
const Zs = Object.fromEntries(Fe.map((t) => [t.code, t])), Ws = {
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
}, Js = [
  { title: "GÖREV & PLANLAMA", codes: ["checklist", "gantt", "time-tracking", "dependencies", "risks", "approvals", "dashboard"] },
  { title: "İLETİŞİM", codes: ["comments", "emails"] },
  { title: "GEÇMİŞ & FİNANS", codes: ["activity", "history", "finance", "gallery"] },
  { title: "İLERİ ÖZELLİKLER & YAPAY ZEKA", codes: ["ai", "automations", "custom-fields"] }
], Xs = /* @__PURE__ */ new Set([
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
]), er = (t) => Xs.has(t);
function ha(t) {
  const a = Zs[t], s = Ws[t];
  return a ? {
    code: t,
    title: a.title,
    icon: a.icon,
    desc: (s == null ? void 0 : s.desc) ?? "",
    bg: (s == null ? void 0 : s.bg) ?? "bg-neutral-subtle",
    fg: (s == null ? void 0 : s.fg) ?? "text-text-secondary"
  } : null;
}
function tr(t = "") {
  const a = t.trim().toLowerCase();
  return Js.map((s) => ({
    title: s.title,
    items: s.codes.map(ha).filter(Boolean).filter((r) => !a || r.title.toLowerCase().includes(a) || r.desc.toLowerCase().includes(a))
  })).filter((s) => s.items.length > 0);
}
const Yt = Fe.length;
function Ut({ code: t, onRemoveFeature: a, onOpenPicker: s, canRemove: r = !0 }) {
  const n = ha(t) ?? { title: t, desc: "", icon: "fa-cube", bg: "bg-neutral-subtle", fg: "text-text-secondary" };
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
function ft({ open: t, onClose: a, label: s, children: r }) {
  return /* @__PURE__ */ e.jsx(
    Ea,
    {
      open: t,
      onOpenChange: (n) => {
        n || a == null || a();
      },
      children: /* @__PURE__ */ e.jsxs(Pa, { children: [
        /* @__PURE__ */ e.jsx(La, { className: "fixed inset-0", style: { pointerEvents: "none" } }),
        /* @__PURE__ */ e.jsx(Aa, { asChild: !0, "aria-describedby": void 0, children: /* @__PURE__ */ e.jsxs("div", { className: "fixed inset-0 z-modal", children: [
          /* @__PURE__ */ e.jsx(Ia, { className: "sr-only", children: s }),
          r
        ] }) })
      ] })
    }
  );
}
function ar({
  open: t,
  onClose: a,
  assignedCodes: s = [],
  onAddFeature: r,
  onGoToTab: n
}) {
  const [i, l] = m.useState("");
  if (m.useEffect(() => {
    t || l("");
  }, [t]), !t) return null;
  const o = new Set(s), c = tr(i), x = s.length + 3, u = (p) => {
    if (o.has(p)) {
      n == null || n(p), a == null || a();
      return;
    }
    r == null || r(p), a == null || a();
  };
  return /* @__PURE__ */ e.jsx(ft, { open: t, onClose: a, label: "Özellik ekle", children: /* @__PURE__ */ e.jsx(
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
                  value: i,
                  onChange: (p) => l(p.target.value),
                  placeholder: `${Yt} özellik arasında ara (Gantt, Finans, Risk, AI…)`,
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
                /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[11px]", children: p.items.map((g) => {
                  const d = o.has(g.code);
                  return /* @__PURE__ */ e.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => u(g.code),
                      className: `group flex items-start gap-3 p-3.5 rounded-[15px] border text-left cursor-pointer hover:border-focus hover:shadow-md ${d ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                      children: [
                        /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-10 w-10 rounded-xl ${g.bg} ${g.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${g.icon} text-[15px]` }) }),
                        /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-[3px] min-w-0 flex-1", children: [
                          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-between gap-2", children: [
                            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: g.title }),
                            /* @__PURE__ */ e.jsx("span", { className: `shrink-0 text-[10.5px] font-extrabold ${d ? "text-primary" : "text-text-tertiary"}`, children: d ? "✓ Ekli" : "Ekle →" })
                          ] }),
                          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] leading-[1.5] text-text-tertiary", children: g.desc })
                        ] })
                      ]
                    },
                    g.code
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
                Yt,
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
const sr = [
  { key: "subtasks", label: "Alt görevler", countKey: "subtasks", unit: "alt görev" },
  { key: "checklist", label: "Kontrol listesi", countKey: "checklist", unit: "madde" },
  { key: "comments", label: "Yorumlar", countKey: "comments", unit: "yorum" },
  { key: "files", label: "Dosyalar", countKey: "files", unit: "dosya" },
  { key: "keepAssignee", label: "Sorumluyu koru", desc: "Aksi halde atanmamış gelir" },
  { key: "keepLinks", label: "Bağımlılıkları koru", desc: "Öncül / ardıl bağlantılar" },
  { key: "shiftDates", label: "Tarihleri bugüne kaydır", desc: "Başlangıç ve son tarih ötelenir" }
], _t = {
  subtasks: !0,
  checklist: !0,
  comments: !1,
  files: !0,
  keepAssignee: !0,
  keepLinks: !0,
  shiftDates: !1
};
function rr({ on: t, onClick: a, label: s }) {
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
function nr({
  open: t,
  mode: a = "move",
  onClose: s,
  onConfirm: r,
  projectOptions: n = [],
  currentProjectId: i,
  counts: l = {},
  onCreateProject: o
}) {
  const [c, x] = m.useState(a), [u, p] = m.useState([]), [g, d] = m.useState(""), [b, y] = m.useState(""), [f, N] = m.useState(_t), [k, S] = m.useState(!1);
  m.useEffect(() => {
    t && (x(a), p([]), d(""), y(""), N(_t));
  }, [t, a]);
  const E = m.useMemo(
    () => n.filter((j) => j.value && j.value !== i),
    [n, i]
  ), K = E.filter((j) => !g || j.label.toLowerCase().includes(g.toLowerCase())), R = E.length > 0 && u.length === E.length;
  if (!t) return null;
  const W = (j) => p((v) => v.includes(j) ? v.filter((h) => h !== j) : [...v, j]), M = (j) => {
    var v;
    return ((v = n.find((h) => h.value === j)) == null ? void 0 : v.label) ?? "";
  }, q = async () => {
    var v, h, T;
    const j = b.trim();
    if (!(!j || k)) {
      S(!0);
      try {
        const $ = await (o == null ? void 0 : o(j));
        $ && p((H) => [...H, $]), y("");
      } catch ($) {
        (T = (h = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : h.error) == null || T.call(h, ($ == null ? void 0 : $.message) || "Proje oluşturulamadı.");
      } finally {
        S(!1);
      }
    }
  }, U = async () => {
    if (!(!u.length || k)) {
      S(!0);
      try {
        await (r == null ? void 0 : r({ mode: c, targetProjectIds: u, include: f }));
      } finally {
        S(!1);
      }
    }
  }, B = c === "move", _ = u.length, J = B ? _ > 1 ? "Taşı ve kopyala" : "Taşı" : _ > 1 ? `${_} projeye kopyala` : "Kopyala", V = Object.values(f).filter(Boolean).length, X = u.map(M).filter(Boolean), O = X.length ? `${X.length > 2 ? `${X.slice(0, 2).join(", ")} +${X.length - 2}` : X.join(", ")} · ${V} seçenek açık` : `Proje seçilmedi · ${V} seçenek açık`, ee = (j) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${j ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return /* @__PURE__ */ e.jsx(ft, { open: t, onClose: s, label: B ? "Başka projeye taşı" : "Başka projelere kopyala", children: /* @__PURE__ */ e.jsx(
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
          "aria-label": B ? "Başka projeye taşı" : "Başka projelere kopyala",
          onClick: (j) => j.stopPropagation(),
          className: "flex flex-col w-full max-w-[760px] max-h-[88vh] rounded-[20px] border border-default bg-surface-base shadow-xl overflow-hidden animate-dialog-in",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-4 px-[22px] pt-5 pb-4 border-b border-subtle", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-10 w-10 rounded-[13px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-tree text-base" }) }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsx("h3", { className: "m-0 text-base font-extrabold tracking-[-.02em] text-text-primary", children: B ? "Başka projeye taşı" : "Başka projelere kopyala" }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 mb-0 text-[12px] leading-[1.5] text-text-tertiary", children: B ? "Görev ilk seçtiğiniz projeye taşınır; birden fazla seçerseniz kalanlara kopya oluşturulur." : "Görevin kopyası seçtiğiniz her projede oluşturulur; bu görev yerinde kalır." })
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
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => x("move"), className: ee(B), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[10px]" }),
                "Taşı"
              ] }),
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => x("copy"), className: ee(!B), children: [
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
                      onClick: () => p(R ? [] : E.map((j) => j.value)),
                      className: "p-0 border-0 bg-transparent text-primary text-[11px] font-bold cursor-pointer hover:underline",
                      children: R ? "Seçimi temizle" : "Tümünü seç"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: g,
                      onChange: (j) => d(j.target.value),
                      placeholder: "Proje ara…",
                      className: "w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar", children: [
                  K.map((j) => {
                    const v = u.includes(j.value), h = B && u[0] === j.value;
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
                          h && /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center h-5 px-2 rounded-md bg-primary text-white text-[10px] font-extrabold", children: "TAŞINACAK" })
                        ]
                      },
                      j.value
                    );
                  }),
                  K.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "py-6 text-center text-[12px] text-text-tertiary", children: "Uygun proje bulunamadı." })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[7px] mt-1", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: b,
                      onChange: (j) => y(j.target.value),
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
                      disabled: !b.trim() || k,
                      className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-plus text-[12px]" })
                    }
                  )
                ] }),
                B && _ > 1 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle", children: [
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
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: sr.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-px", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary", children: j.label }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: j.countKey ? `${l[j.countKey] ?? 0} ${j.unit}` : j.desc })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    rr,
                    {
                      on: f[j.key],
                      label: j.label,
                      onClick: () => N((v) => ({ ...v, [j.key]: !v[j.key] }))
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
const ir = [
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
function lr(t = "") {
  var s;
  const a = (s = t.split(".").pop()) == null ? void 0 : s.toLowerCase();
  return a === "pdf" ? Ie.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(a) ? Ie.img : ["doc", "docx", "odt", "rtf"].includes(a) ? Ie.doc : ["json", "js", "ts", "cs", "xml", "yml", "yaml"].includes(a) ? Ie.code : Ie.other;
}
const or = (t) => t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toFixed(1)} MB` : "—", cr = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—", dr = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—";
function nt({ name: t, size: a = 22 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Me(t), fontSize: a * 0.4 },
      children: Ke(t)
    }
  );
}
function Ye({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: t }),
    a
  ] });
}
function xr({
  subtaskId: t,
  parentCode: a,
  onClose: s,
  onOpenFull: r,
  onDeleted: n,
  currentUserName: i = "Ben"
}) {
  var $, H, ce;
  const l = se(), { data: o } = ut(t), c = mt(t), x = pa(t), [u, p] = m.useState("general"), [g, d] = m.useState(""), [b, y] = m.useState(""), [f, N] = m.useState(""), k = m.useRef(null), S = m.useRef(null);
  o && S.current !== o.id && (S.current = o.id, d(o.description ?? ""));
  const { data: E = [] } = ne({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var w, A, P, F;
      return Promise.resolve((F = (P = (A = (w = window == null ? void 0 : window.apya) == null ? void 0 : w.platform) == null ? void 0 : A.tasks) == null ? void 0 : P.task) == null ? void 0 : F.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4
  });
  if (m.useEffect(() => {
    const w = (A) => {
      A.key === "Escape" && (A.stopPropagation(), s == null || s());
    };
    return window.addEventListener("keydown", w), () => window.removeEventListener("keydown", w);
  }, [s]), !o) return null;
  const K = (ce = (H = ($ = window == null ? void 0 : window.apya) == null ? void 0 : $.platform) == null ? void 0 : H.tasks) == null ? void 0 : ce.task, R = Re(o.status), W = ca(o.priority), M = c.items ?? [], q = M.filter((w) => w.isDone).length, U = M.length ? Math.round(q / M.length * 100) : 0, B = x.attachments ?? [], _ = { checklist: M.length, comments: E.length, files: B.length }, J = async () => {
    await l.invalidateQueries({ queryKey: ["task-detail", t] });
  }, V = async (w) => {
    var A, P, F;
    try {
      await Promise.resolve(K.update(o.id, {
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
        ...w
      })), await J();
    } catch (Y) {
      (F = (P = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : P.error) == null || F.call(P, (Y == null ? void 0 : Y.message) || "Alt görev güncellenemedi.");
    }
  }, X = () => V({ status: o.status >= 4 ? 1 : o.status + 1 }), O = () => V({ priority: o.priority >= 4 ? 1 : o.priority + 1 }), ee = () => {
    (o.description ?? "") !== g && V({ description: g || null });
  }, j = async () => {
    var A, P, F;
    const w = b.trim();
    if (w) {
      y("");
      try {
        await c.addItem(w);
      } catch (Y) {
        (F = (P = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : P.error) == null || F.call(P, (Y == null ? void 0 : Y.message) || "Madde eklenemedi.");
      }
    }
  }, v = async () => {
    var A, P, F;
    const w = f.trim();
    if (w) {
      N("");
      try {
        await Promise.resolve(K.addComment(o.id, w)), await l.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch (Y) {
        (F = (P = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : P.error) == null || F.call(P, (Y == null ? void 0 : Y.message) || "Yorum gönderilemedi.");
      }
    }
  }, h = async () => {
    var w, A, P;
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(K.delete(o.id)), n == null || n(o.id), s == null || s();
      } catch (F) {
        (P = (A = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : A.error) == null || P.call(A, (F == null ? void 0 : F.message) || "Alt görev silinemedi.");
      }
  }, T = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
  return /* @__PURE__ */ e.jsxs(ft, { open: !0, onClose: s, label: `${o.code} alt görev detayı`, children: [
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
                    className: `${T} hover:bg-surface-hover hover:text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-up-right-from-square text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Alt görevi sil",
                    onClick: h,
                    className: `${T} hover:bg-negative-subtle hover:text-negative`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Kapat",
                    onClick: s,
                    className: `${T} hover:bg-surface-hover hover:text-text-primary`,
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
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold cursor-pointer ${R.bg} ${R.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${R.icon} text-[10px]` }),
                    R.label
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
              (o.tags ?? []).map((w) => /* @__PURE__ */ e.jsx("span", { className: "flex items-center h-6 px-[9px] rounded-[7px] border border-default bg-neutral-subtle text-text-secondary text-[11px] font-semibold", children: w.name }, w.id ?? w.name))
            ] }),
            /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[18px] font-extrabold tracking-[-.02em] leading-[1.3] text-text-primary", children: o.title }),
            /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 pt-1", children: [
              /* @__PURE__ */ e.jsx(Ye, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
                /* @__PURE__ */ e.jsx(nt, { name: o.assigneeName }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", children: o.assigneeName || "Atanmamış" })
              ] }) }),
              /* @__PURE__ */ e.jsx(Ye, { label: "Son tarih", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] h-[22px] text-[12.5px] font-semibold text-text-primary", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[11px] text-text-tertiary" }),
                dr(o.dueDate)
              ] }) }),
              /* @__PURE__ */ e.jsx(Ye, { label: "Süre", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-[22px] font-mono text-[12.5px] font-bold text-text-primary", children: [
                o.spentHours ?? 0,
                "s",
                /* @__PURE__ */ e.jsxs("span", { className: "font-medium text-text-tertiary", children: [
                  " / ",
                  o.estimatedHours != null ? `${o.estimatedHours}s` : "—"
                ] })
              ] }) }),
              /* @__PURE__ */ e.jsx(Ye, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-1.5 pt-[3px]", children: [
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
                  "%",
                  U
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: "block h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("span", { className: "block h-full rounded-full bg-success", style: { width: `${U}%` } }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: ir.map((w) => {
            const A = u === w.code, P = _[w.code] ?? 0;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => p(w.code),
                className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${A ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
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
            u === "general" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Açıklama" }),
              /* @__PURE__ */ e.jsx(
                "textarea",
                {
                  rows: 7,
                  value: g,
                  onChange: (w) => d(w.target.value),
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
            u === "checklist" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px]", children: [
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
                M.map((w) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] border border-subtle bg-surface-base hover:border-default", children: [
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
                    value: b,
                    onChange: (w) => y(w.target.value),
                    onKeyDown: (w) => {
                      w.key === "Enter" && j();
                    },
                    placeholder: "Yeni madde yaz ve Enter'a bas…",
                    className: "h-9 mt-1 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                )
              ] })
            ] }),
            u === "comments" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] items-start", children: [
                /* @__PURE__ */ e.jsx(nt, { name: i, size: 30 }),
                /* @__PURE__ */ e.jsx(
                  "textarea",
                  {
                    rows: 2,
                    value: f,
                    onChange: (w) => N(w.target.value),
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
                    className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] ${f.trim() ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paper-plane text-[11px]" })
                  }
                )
              ] }),
              E.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-[7px] py-7 rounded-xl border border-dashed border-default", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-comments text-xl text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Henüz yorum yok" })
              ] }) : E.map((w) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 items-start p-3 rounded-xl border border-subtle bg-surface-base", children: [
                /* @__PURE__ */ e.jsx(nt, { name: w.authorName, size: 28 }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: w.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: cr(w.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: w.text })
                ] })
              ] }, w.id))
            ] }),
            u === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  ref: k,
                  type: "file",
                  className: "hidden",
                  onChange: (w) => {
                    var P;
                    const A = (P = w.target.files) == null ? void 0 : P[0];
                    w.target.value = "", A && x.upload(A).catch((F) => {
                      var Y, ie, L;
                      return (L = (ie = (Y = window == null ? void 0 : window.abp) == null ? void 0 : Y.notify) == null ? void 0 : ie.error) == null ? void 0 : L.call(ie, (F == null ? void 0 : F.message) || "Dosya yüklenemedi.");
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
                  disabled: x.isUploading,
                  className: "flex flex-col items-center justify-center gap-[7px] p-6 rounded-[13px] border-2 border-dashed border-strong bg-surface-base cursor-pointer hover:border-focus hover:bg-primary-subtle disabled:opacity-60",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x.isUploading ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-xl text-text-tertiary` }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: x.isUploading ? "Yükleniyor…" : "Dosya ekle" })
                  ]
                }
              ),
              B.map((w) => {
                const A = lr(w.fileName);
                return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${A.bg} ${A.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${A.icon} text-[13px]` }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: w.fileName }),
                    /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                      or(w.fileSize),
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
                      onClick: () => x.remove(w.id).catch((P) => {
                        var F, Y, ie;
                        return (ie = (Y = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : Y.error) == null ? void 0 : ie.call(Y, (P == null ? void 0 : P.message) || "Dosya silinemedi.");
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
const ga = "apya.taskDetail.tabOrder";
function ur() {
  try {
    const t = localStorage.getItem(ga);
    if (!t) return [];
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.filter((s) => typeof s == "string") : [];
  } catch {
    return [];
  }
}
function pr(t) {
  try {
    localStorage.setItem(ga, JSON.stringify(t));
  } catch {
  }
}
function mr(t) {
  const [a, s] = m.useState(ur), [r, n] = m.useState(null), i = m.useMemo(() => {
    const x = new Map(t.map((p) => [p.code, p])), u = [];
    for (const p of a) {
      const g = x.get(p);
      g && (u.push(g), x.delete(p));
    }
    for (const p of t)
      x.has(p.code) && u.push(p);
    return u;
  }, [t, a]), l = m.useCallback((x) => {
    s((u) => {
      const p = r;
      if (!p || p === x) return u;
      const g = u.length ? u.slice() : i.map((y) => y.code), d = g.indexOf(p), b = g.indexOf(x);
      return d === -1 || b === -1 ? u : (g.splice(d, 1), g.splice(b, 0, p), g);
    });
  }, [r, i]), o = m.useCallback((x) => n(x), []), c = m.useCallback(() => {
    n(null), s((x) => {
      const u = x.length ? x : i.map((p) => p.code);
      return pr(u), u;
    });
  }, [i]);
  return { orderedTabs: i, draggingCode: r, handleDragStart: o, handleDragEnd: c, reorderTo: l };
}
function fr() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function br() {
  const t = ne({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: fr,
    staleTime: 3e5,
    retry: !1
  }), a = t.data ?? [], s = a.map((n) => ({ value: n.id, label: n.name })), r = new Map(a.map((n) => [n.id, n.name]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
const Ht = "apya.taskDetail.fullscreen", Q = {
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
function hr(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function ya({ taskId: t, presentation: a = "modal", onClose: s, switchToTask: r }) {
  var yt, vt, jt, wt, Nt, kt, Ct, Tt;
  const [n, i] = m.useState(t), { data: l, isLoading: o, isError: c, refetch: x } = ut(n), u = se(), p = ta(), g = na(l), d = ia(), b = br(), y = la(n), f = mt(n), [N, k] = m.useState("general"), [S, E] = m.useState(!1), [K, R] = m.useState(!1), [W, M] = m.useState(!1), [q, U] = m.useState(null), [B, _] = m.useState(null), [J, V] = m.useState(!1), [X, O] = m.useState(!1), [ee, j] = m.useState(() => {
    try {
      return localStorage.getItem(Ht) === "true";
    } catch {
      return !1;
    }
  });
  ra(n);
  const [v, h] = m.useState(null);
  l != null && l.id && l.id !== v && (h(l.id), V(!!l.isFavorite), O(!!l.isWatched)), m.useEffect(() => {
    g.isDirty ? p.markDirty() : p.markClean();
  });
  const T = m.useCallback(() => {
    sa(), s == null || s();
  }, [s]), $ = m.useCallback(() => p.requestClose(T), [p, T]), H = m.useCallback(() => {
    j((C) => {
      const D = !C;
      try {
        localStorage.setItem(Ht, String(D));
      } catch {
      }
      return D;
    });
  }, []), ce = m.useMemo(
    () => ma(y.assignedCodes),
    [y.assignedCodes]
  ), w = mr(ce), A = m.useMemo(() => {
    var C, D, z, le, pe;
    return {
      subtasks: ((C = l == null ? void 0 : l.subTasks) == null ? void 0 : C.length) ?? 0,
      files: ((D = l == null ? void 0 : l.attachments) == null ? void 0 : D.length) ?? 0,
      dependencies: ((z = l == null ? void 0 : l.predecessorIds) == null ? void 0 : z.length) ?? 0,
      comments: ((le = l == null ? void 0 : l.comments) == null ? void 0 : le.length) ?? 0,
      checklist: ((pe = f.items) == null ? void 0 : pe.length) ?? 0
    };
  }, [l, f.items]), P = Fe.find((C) => C.code === N), F = f.items ?? [], Y = F.filter((C) => C.isDone).length, ie = F.length ? Math.round(Y / F.length * 100) : 0, L = m.useCallback(async () => {
    if (!g.validate())
      return Q.err("Zorunlu alanları kontrol edin."), !1;
    E(!0);
    try {
      return await Promise.resolve(window.apya.platform.tasks.task.update(n, g.toUpdateDto())), await u.invalidateQueries({ queryKey: ["task-detail", n] }), re.emitResult(), R(!0), setTimeout(() => R(!1), 2e3), Q.ok("Görev başarıyla güncellendi."), !0;
    } catch (C) {
      return Q.err((C == null ? void 0 : C.message) || "Kaydedilemedi."), !1;
    } finally {
      E(!1);
    }
  }, [n, g, u]);
  m.useEffect(() => {
    const C = (D) => {
      if ((D.ctrlKey || D.metaKey) && D.key.toLowerCase() === "s") {
        D.preventDefault(), g.isDirty && !S && L();
        return;
      }
      if (D.key === "Escape") {
        if (q) {
          D.stopPropagation(), U(null);
          return;
        }
        W && (D.stopPropagation(), M(!1));
      }
    };
    return window.addEventListener("keydown", C), () => window.removeEventListener("keydown", C);
  }, [L, g.isDirty, S, q, W]);
  const I = () => {
    var C, D, z;
    return (z = (D = (C = window == null ? void 0 : window.apya) == null ? void 0 : C.platform) == null ? void 0 : D.tasks) == null ? void 0 : z.task;
  }, G = async () => {
    var D;
    const C = !J;
    V(C);
    try {
      await Promise.resolve((D = I()) == null ? void 0 : D.toggleFavorite(n));
    } catch (z) {
      V(!C), Q.err((z == null ? void 0 : z.message) || "Favori güncellenemedi.");
    }
  }, te = () => {
    if (!n) return;
    const C = document.createElement("a");
    C.href = `/Tasks/Detail/${n}?handler=Pdf`, C.rel = "noopener", document.body.appendChild(C), C.click(), C.remove();
  }, Z = async () => {
    var D;
    const C = !X;
    O(C);
    try {
      await Promise.resolve((D = I()) == null ? void 0 : D.toggleWatch(n)), Q.info(C ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (z) {
      O(!C), Q.err((z == null ? void 0 : z.message) || "Takip durumu güncellenemedi.");
    }
  }, we = async () => {
    var C, D;
    try {
      const z = await Promise.resolve((C = I()) == null ? void 0 : C.transfer(n, {
        mode: 2,
        // Copy
        targetProjectIds: l != null && l.projectId ? [l.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await u.invalidateQueries({ queryKey: ["task-detail"] }), Q.ok("Görev çoğaltıldı.");
      const le = (D = z == null ? void 0 : z.createdTaskIds) == null ? void 0 : D[0];
      le && i(le);
    } catch (z) {
      Q.err((z == null ? void 0 : z.message) || "Görev çoğaltılamadı.");
    }
  }, xe = async () => {
    var C;
    try {
      await Promise.resolve((C = I()) == null ? void 0 : C.updateStatus(n, 4)), await u.invalidateQueries({ queryKey: ["task-detail", n] }), Q.info("Görev arşivlendi (Tamamlandı).");
    } catch (D) {
      Q.err((D == null ? void 0 : D.message) || "Görev arşivlenemedi.");
    }
  }, ja = async () => {
    var C;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?"))
      try {
        await Promise.resolve((C = I()) == null ? void 0 : C.delete(n)), Q.info("Görev silindi."), p.markClean(), T();
      } catch (D) {
        Q.err((D == null ? void 0 : D.message) || "Görev silinemedi.");
      }
  }, wa = async (C) => {
    try {
      await y.addFeature(C), k(C), Q.ok("Özellik başarıyla eklendi.");
    } catch (D) {
      Q.err((D == null ? void 0 : D.message) || "Özellik eklenemedi.");
    }
  }, bt = async (C) => {
    try {
      await y.removeFeature(C), k("general"), Q.info("Özellik görevden kaldırıldı.");
    } catch (D) {
      Q.err((D == null ? void 0 : D.message) || "Özellik kaldırılamadı.");
    }
  }, Na = async (C) => {
    var le, pe, de, De, Ne, Ge, Pe;
    const D = ((De = (de = (pe = (le = window == null ? void 0 : window.apya) == null ? void 0 : le.platform) == null ? void 0 : pe.application) == null ? void 0 : de.projects) == null ? void 0 : De.project) ?? ((Pe = (Ge = (Ne = window == null ? void 0 : window.apya) == null ? void 0 : Ne.platform) == null ? void 0 : Ge.projects) == null ? void 0 : Pe.project);
    if (!(D != null && D.create)) throw new Error("Proje servisi yüklenmedi.");
    const z = await Promise.resolve(D.create({
      name: C,
      code: hr(C),
      currency: "TRY"
    }));
    return await u.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), Q.ok(`“${C}” projesi oluşturuldu.`), (z == null ? void 0 : z.id) ?? z;
  }, ka = async ({ mode: C, targetProjectIds: D, include: z }) => {
    var le, pe;
    try {
      const de = await Promise.resolve((le = I()) == null ? void 0 : le.transfer(n, {
        mode: C === "move" ? 1 : 2,
        targetProjectIds: D,
        include: z
      }));
      await u.invalidateQueries({ queryKey: ["task-detail", n] });
      const De = D.map((Ge) => {
        var Pe;
        return (Pe = b.options.find((Ta) => Ta.value === Ge)) == null ? void 0 : Pe.label;
      }).filter(Boolean), Ne = ((pe = de == null ? void 0 : de.createdTaskIds) == null ? void 0 : pe.length) ?? 0;
      Q.ok(C === "move" ? Ne ? `“${De[0]}” projesine taşındı, ${Ne} projeye kopyalandı.` : `Görev “${De[0]}” projesine taşındı.` : Ne > 1 ? `${Ne} projeye kopyalandı.` : `Kopya “${De[0]}” projesinde oluşturuldu.`), U(null);
    } catch (de) {
      Q.err((de == null ? void 0 : de.message) || "Transfer tamamlanamadı.");
    }
  }, Ca = N === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)] gap-5 items-start", children: [
    /* @__PURE__ */ e.jsx(
      Vs,
      {
        task: l,
        onFieldChange: g.setField,
        descriptionValue: g.values.description,
        checklist: f,
        currentUserName: ((vt = (yt = window == null ? void 0 : window.abp) == null ? void 0 : yt.currentUser) == null ? void 0 : vt.name) || ((wt = (jt = window == null ? void 0 : window.abp) == null ? void 0 : jt.currentUser) == null ? void 0 : wt.userName) || "Ben"
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5", children: /* @__PURE__ */ e.jsx(qs, { task: l, nameById: d.nameById }) })
  ] }) : er(N) ? /* @__PURE__ */ e.jsx(
    Ut,
    {
      code: N,
      onRemoveFeature: bt,
      onOpenPicker: () => M(!0),
      canRemove: !(P != null && P.isCore)
    }
  ) : /* @__PURE__ */ e.jsx(m.Suspense, { fallback: /* @__PURE__ */ e.jsx(be, { className: "h-48 w-full" }), children: P != null && P.component ? /* @__PURE__ */ e.jsx(
    P.component,
    {
      taskId: n,
      task: l,
      onOpenSubtask: _
    }
  ) : /* @__PURE__ */ e.jsx(
    Ut,
    {
      code: N,
      onRemoveFeature: bt,
      onOpenPicker: () => M(!0),
      canRemove: !(P != null && P.isCore)
    }
  ) }), ht = o ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(be, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(be, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(be, { className: "h-64 w-full" })
  ] }) : c ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(ae, { variant: "ghost", onClick: () => x(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col flex-1 min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      Ks,
      {
        task: l,
        presentation: a,
        onClose: $,
        isFullscreen: ee,
        onToggleFullscreen: H,
        onFieldChange: g.setField,
        statusValue: g.values.status,
        titleValue: l == null ? void 0 : l.title,
        isPrivateValue: g.values.isPrivate,
        isFavorite: J,
        onToggleFavorite: G,
        isWatched: X,
        onToggleWatch: Z,
        onDuplicate: we,
        onArchive: xe,
        onDelete: ja,
        onOpenTransfer: (C) => U({ mode: C }),
        onSaveAsTemplate: () => Q.info("Şablon olarak kaydetme yakında."),
        onConvertToSubtask: () => Q.info("Alt göreve dönüştürme yakında."),
        onExportPdf: te
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        Ms,
        {
          task: l,
          assigneeOptions: d.options,
          projectOptions: b.options,
          onFieldChange: g.setField,
          statusValue: g.values.status,
          priorityValue: g.values.priority,
          assigneeValue: g.values.assigneeId,
          projectValue: g.values.projectId,
          dueDateValue: g.values.dueDate,
          startDateValue: g.values.startDate,
          tagsValue: g.values.tagNames,
          progressPercent: ie,
          progressNote: `${Y}/${F.length} madde`,
          onOpenTransfer: (C) => U({ mode: C })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        a === "page" && /* @__PURE__ */ e.jsx(
          Gs,
          {
            activeTab: N,
            onTabChange: k,
            orderedTabs: w.orderedTabs,
            draggingCode: w.draggingCode,
            onDragStart: w.handleDragStart,
            onDragEnd: w.handleDragEnd,
            onReorderTo: w.reorderTo,
            onReorderDrop: () => Q.info("Sekme sırası güncellendi."),
            onOpenPicker: () => M(!0),
            counts: A
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: a === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            Fs,
            {
              activeTab: N,
              onTabChange: k,
              orderedTabs: w.orderedTabs,
              draggingCode: w.draggingCode,
              onDragStart: w.handleDragStart,
              onDragEnd: w.handleDragEnd,
              onReorderTo: w.reorderTo,
              onReorderDrop: () => Q.info("Sekme sırası güncellendi."),
              onOpenPicker: () => M(!0),
              counts: A,
              isDirty: g.isDirty
            }
          ) }),
          /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised", children: Ca })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(
      Qs,
      {
        lastSavedAt: l == null ? void 0 : l.lastModificationTime,
        isDirty: g.isDirty,
        isSaving: S,
        justSaved: K,
        onCancel: $,
        onSave: L
      }
    )
  ] }), gt = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      ar,
      {
        open: W,
        onClose: () => M(!1),
        assignedCodes: y.assignedCodes,
        onAddFeature: wa,
        onGoToTab: k
      }
    ),
    /* @__PURE__ */ e.jsx(
      nr,
      {
        open: !!q,
        mode: (q == null ? void 0 : q.mode) ?? "move",
        onClose: () => U(null),
        onConfirm: ka,
        projectOptions: b.options,
        currentProjectId: g.values.projectId,
        counts: A,
        onCreateProject: Na
      }
    ),
    B && /* @__PURE__ */ e.jsx(
      xr,
      {
        subtaskId: B,
        parentCode: l == null ? void 0 : l.code,
        onClose: () => _(null),
        onOpenFull: (C) => {
          _(null), (r ?? i)(C);
        },
        onDeleted: () => u.invalidateQueries({ queryKey: ["task-detail", n] }),
        currentUserName: ((kt = (Nt = window == null ? void 0 : window.abp) == null ? void 0 : Nt.currentUser) == null ? void 0 : kt.name) || ((Tt = (Ct = window == null ? void 0 : window.abp) == null ? void 0 : Ct.currentUser) == null ? void 0 : Tt.userName) || "Ben"
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col w-full min-h-[calc(100vh-54px)] border-y border-subtle bg-surface-base", children: ht }),
    gt
  ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(Wt, { open: !0, onOpenChange: (C) => {
      C || $();
    }, children: /* @__PURE__ */ e.jsx(
      Jt,
      {
        title: l != null && l.title ? `Görev Detayı: ${l.title}` : "Görev Detayı",
        fullscreen: ee,
        className: ee ? "p-0 rounded-xl border border-default shadow-xl short:h-[100svh]" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl short:h-[100svh]",
        onInteractOutside: (C) => {
          var D, z;
          C.preventDefault(), !(W || q || B) && ((z = (D = C.target) == null ? void 0 : D.closest) != null && z.call(D, "[data-apya-overlay]") || $());
        },
        onEscapeKeyDown: (C) => {
          if (W || q || B) {
            C.preventDefault();
            return;
          }
          C.preventDefault(), $();
        },
        children: ht
      }
    ) }),
    gt
  ] });
}
function gr() {
  var a;
  const t = m.useSyncExternalStore(
    re.subscribe,
    re.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(He, { children: /* @__PURE__ */ e.jsx(
    ya,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        re.close(), re.emitResult();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(He, { children: /* @__PURE__ */ e.jsx(
    fa,
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
function va() {
  var s;
  try {
    const r = new URLSearchParams(window.location.search).get("taskui");
    if (r === "v1" || r === "v2" || r === "v3") return r;
  } catch {
  }
  const t = document.getElementById("task-detail-island"), a = (s = t == null ? void 0 : t.dataset) == null ? void 0 : s.taskui;
  return a === "v1" || a === "v2" ? a : "v3";
}
function yr() {
  return va() === "v2";
}
function vr() {
  return va() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = vr();
window.apya.taskDetailV2Enabled = yr() && !window.apya.taskDetailV3Enabled;
const Vt = {
  open: (t) => {
    re.open(t);
  },
  close: () => re.close(),
  onResult: (t) => re.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(Vt) : window.apya.taskDetail = Vt;
function Qt() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = Zt(t), t._reactRoot.render(/* @__PURE__ */ e.jsx(gr, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = aa();
    a && re.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Qt) : Qt();
function jr({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(He, { children: /* @__PURE__ */ e.jsx(
    ya,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(He, { children: /* @__PURE__ */ e.jsx(
    fa,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) });
}
const it = document.getElementById("task-detail-page-island");
if (it) {
  const t = it.getAttribute("data-task-id");
  t && Zt(it).render(/* @__PURE__ */ e.jsx(jr, { taskId: t }));
}
