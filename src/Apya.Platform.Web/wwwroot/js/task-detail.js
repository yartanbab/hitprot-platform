import { j as e, r as u, d as Be, b as Qt } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { a as He } from "./QueryProvider-AIUp_Zk5.js";
import { u as ne, a as se, b as oe } from "./query-vendor-Bf69L2iP.js";
import { D as Zt, i as Wt, g as nt, B as ae, I as Se, S as be } from "./Dialog-BdNKdiS6.js";
import { C as Ta } from "./Combobox-Cgzidxen.js";
import { r as Da } from "./httpClient-CRlyQ1eg.js";
import { R as he, T as ge, P as ye, C as ve, A as Sa, a as Jt, D as $a, b as Ea, c as Pa, d as Aa, e as Ia } from "./ui-vendor-DaE-uom6.js";
import { d as Xt } from "./draggableActivation-Ybw9Upbh.js";
function Ba({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: o,
  footer: l,
  children: n
}) {
  return /* @__PURE__ */ e.jsx(
    Zt,
    {
      open: t,
      onOpenChange: (i) => {
        i || a();
      },
      children: /* @__PURE__ */ e.jsx(
        Wt,
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
            o,
            /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: n }),
            l
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
const it = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, lt = {
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
  onToggleFullscreen: o,
  fullscreen: l = !1
}) {
  const [n, i] = u.useState(!1), p = u.useRef(null);
  u.useEffect(() => {
    if (!n) return;
    const c = (g) => {
      p.current && !p.current.contains(g.target) && i(!1);
    }, f = (g) => {
      g.key === "Escape" && i(!1);
    };
    return document.addEventListener("mousedown", c), document.addEventListener("keydown", f), () => {
      document.removeEventListener("mousedown", c), document.removeEventListener("keydown", f);
    };
  }, [n]);
  const d = it[t == null ? void 0 : t.status] ?? it[1], x = lt[t == null ? void 0 : t.priority] ?? lt[2], b = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), i(!1);
  }, y = () => {
    var f, g, m, N;
    const c = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (f = navigator.clipboard) == null || f.writeText(c), (N = (m = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : m.info) == null || N.call(m, "Bağlantı kopyalandı."), i(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(nt, { variant: d.variant, children: d.text }),
        /* @__PURE__ */ e.jsx(nt, { variant: x.variant, children: x.text }),
        /* @__PURE__ */ e.jsx(za, { isPrivate: t == null ? void 0 : t.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": l ? "Küçült" : "Tam ekrana büyüt",
          onClick: o,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: l ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
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
            onClick: () => i((c) => !c),
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
                  onClick: b,
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
                  onClick: y,
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
const Ra = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function Ma({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: o }) {
  const l = Ra(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: l ? `Son kayıt: ${l}` : " " }),
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
const Tt = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Fa = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function me({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function Ga({ value: t, onChange: a }) {
  const [s, r] = u.useState(""), o = () => {
    const l = s.trim();
    l && !t.includes(l) && a([...t, l]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((l) => /* @__PURE__ */ e.jsxs(nt, { variant: "neutral", children: [
      l,
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${l} etiketini kaldır`,
          onClick: () => a(t.filter((n) => n !== l)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, l)) }),
    /* @__PURE__ */ e.jsx(
      Se,
      {
        value: s,
        onChange: (l) => r(l.target.value),
        onKeyDown: (l) => {
          l.key === "Enter" || l.key === "," ? (l.preventDefault(), o()) : l.key === "Backspace" && !s && t.length && a(t.slice(0, -1));
        },
        onBlur: o,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function qa({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: o = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(me, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      Se,
      {
        id: "task-title",
        value: t.title,
        onChange: (l) => s("title", l.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(me, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (l) => s("status", Number(l.target.value)),
          className: Tt,
          children: Object.entries(it).map(([l, n]) => /* @__PURE__ */ e.jsx("option", { value: l, children: n.text }, l))
        }
      ) }),
      /* @__PURE__ */ e.jsx(me, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (l) => s("priority", Number(l.target.value)),
          className: Tt,
          children: Object.entries(lt).map(([l, n]) => /* @__PURE__ */ e.jsx("option", { value: l, children: n.text }, l))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(me, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      Ta,
      {
        id: "task-assignee",
        options: r,
        value: t.assigneeId,
        onChange: (l) => s("assigneeId", l),
        placeholder: o ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: o
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(me, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        Se,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (l) => s("startDate", l.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(me, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        Se,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (l) => s("dueDate", l.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(me, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(Ga, { value: t.tagNames, onChange: (l) => s("tagNames", l) }) }),
    /* @__PURE__ */ e.jsx(me, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (l) => s("description", l.target.value),
        className: Fa
      }
    ) })
  ] });
}
const Dt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
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
      /* @__PURE__ */ e.jsx(Pe, { label: "Oluşturulma zamanı", value: Dt(t.creationTime) }),
      /* @__PURE__ */ e.jsx(Pe, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(Pe, { label: "Son güncelleme zamanı", value: Dt(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(Pe, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const Ua = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", _a = "border-brand-500 text-text-primary";
function Ya({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: o }) {
  const l = u.useRef(/* @__PURE__ */ new Map()), n = (p) => {
    var d;
    s(p.code), (d = l.current.get(p.code)) == null || d.focus();
  }, i = (p, d) => {
    p.key === "ArrowRight" ? (p.preventDefault(), n(t[(d + 1) % t.length])) : p.key === "ArrowLeft" ? (p.preventDefault(), n(t[(d - 1 + t.length) % t.length])) : p.key === "Home" ? (p.preventDefault(), n(t[0])) : p.key === "End" && (p.preventDefault(), n(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((p, d) => {
      const x = p.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (b) => {
            b ? l.current.set(p.code, b) : l.current.delete(p.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${p.code}`,
          "aria-selected": x,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: x ? 0 : -1,
          onClick: () => s(p.code),
          onKeyDown: (b) => i(b, d),
          className: `${Ua} ${x ? _a : ""}`,
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
        "aria-expanded": o,
        onClick: r,
        className: "mx-1 grid h-8 w-8 flex-none place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" })
      }
    )
  ] });
}
const Ha = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Va({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [o, l] = u.useState(""), n = u.useMemo(() => {
    const i = o.trim().toLocaleLowerCase("tr-TR"), p = i ? t.filter((x) => x.title.toLocaleLowerCase("tr-TR").includes(i)) : t, d = /* @__PURE__ */ new Map();
    return p.forEach((x) => {
      const b = d.get(x.category) ?? [];
      b.push(x), d.set(x.category, b);
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
            onChange: (i) => l(i.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          n.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...n.entries()].map(([i, p]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: Ha[i] ?? i }),
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
function Qa({ trail: t = [], current: a, onNavigate: s }) {
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
function Za(t) {
  var s, r, o;
  const a = (o = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : o.task;
  return a ? Promise.resolve(a.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function xt(t) {
  return ne({
    queryKey: ["task-detail", t],
    queryFn: () => Za(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function Ze(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
function ea() {
  const [t, a] = u.useState(!1), [s, r] = u.useState(!1), o = u.useRef(null), l = u.useCallback(() => a(!0), []), n = u.useCallback(() => a(!1), []);
  u.useEffect(() => {
    if (!t) return;
    const d = (x) => {
      x.preventDefault(), x.returnValue = "";
    };
    return window.addEventListener("beforeunload", d), () => window.removeEventListener("beforeunload", d);
  }, [t]);
  const i = u.useCallback((d) => {
    if (!t) {
      d == null || d();
      return;
    }
    o.current = d ?? null, r(!0);
  }, [t]), p = u.useCallback((d) => {
    const x = o.current;
    return r(!1), o.current = null, d === "discard" && (a(!1), x == null || x()), d === "save" ? x : null;
  }, []);
  return { isDirty: t, markDirty: l, markClean: n, requestClose: i, pendingClose: s, resolvePendingClose: p };
}
const Wa = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, ut = "task";
function ta() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(ut);
  return t && Wa.test(t) ? t : null;
}
function aa() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(ut), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function sa(t, a) {
  const s = u.useRef(a);
  s.current = a, u.useEffect(() => {
    if (!t || ta() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(ut, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), u.useEffect(() => {
    const r = () => {
      var o;
      (o = s.current) == null || o.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const Ja = {
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
function Xa(t) {
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
  } : Ja;
}
function ra(t) {
  const [a, s] = u.useState(t == null ? void 0 : t.id), r = u.useMemo(() => Xa(t), [t]), [o, l] = u.useState(r), [n, i] = u.useState({});
  (t == null ? void 0 : t.id) !== a && (s(t == null ? void 0 : t.id), l(r), i({}));
  const p = u.useCallback((c, f) => {
    l((g) => ({ ...g, [c]: f }));
  }, []), d = u.useMemo(
    () => JSON.stringify(o) !== JSON.stringify(r),
    [o, r]
  ), x = u.useCallback(() => {
    const c = {};
    return o.title.trim() || (c.title = "Başlık zorunlu."), o.startDate || (c.startDate = "Başlangıç tarihi zorunlu."), o.dueDate && o.startDate && o.dueDate < o.startDate && (c.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), i(c), Object.keys(c).length === 0;
  }, [o]), b = u.useCallback(() => ({
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
  }), [o, t]), y = u.useCallback(() => {
    l(r), i({});
  }, [r]);
  return { values: o, setField: p, isDirty: d, errors: n, validate: x, toUpdateDto: b, reset: y };
}
function St(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function es() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function na() {
  var o;
  const t = ne({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: es,
    staleTime: 3e5,
    retry: !1
  }), a = ((o = t.data) == null ? void 0 : o.items) ?? [], s = a.map((l) => ({ value: l.id, label: St(l) })), r = new Map(a.map((l) => [l.id, St(l)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function ot() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function ts(t) {
  const a = ot();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ia(t) {
  const a = se(), s = ["task-features", t], r = ne({
    queryKey: s,
    queryFn: () => ts(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: s }), l = oe({
    mutationFn: (i) => Promise.resolve(ot().addFeature(t, i)),
    onSuccess: o
  }), n = oe({
    mutationFn: (i) => Promise.resolve(ot().removeFeature(t, i)),
    onSuccess: o
  });
  return {
    assignedCodes: r.data ?? [],
    isLoading: r.isLoading,
    addFeature: l.mutateAsync,
    removeFeature: n.mutateAsync,
    mutatingCode: l.variables ?? n.variables ?? null,
    isMutating: l.isPending || n.isPending
  };
}
const Ve = {
  0: { label: "İptal", icon: "fa-ban", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  1: { label: "Yapılacak", icon: "fa-clock", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  2: { label: "Sürüyor", icon: "fa-spinner", bg: "bg-warning-subtle", fg: "text-warning", dot: "bg-warning" },
  3: { label: "Testte", icon: "fa-flask", bg: "bg-primary-subtle", fg: "text-primary", dot: "bg-primary" },
  4: { label: "Tamamlandı", icon: "fa-circle-check", bg: "bg-success-subtle", fg: "text-success", dot: "bg-success" }
}, ct = {
  1: { label: "Düşük", icon: "fa-arrow-down", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  2: { label: "Orta", icon: "fa-minus", bg: "bg-warning-subtle", fg: "text-warning" },
  3: { label: "Yüksek", icon: "fa-arrow-up", bg: "bg-negative-subtle", fg: "text-negative" },
  4: { label: "Kritik", icon: "fa-flag", bg: "bg-negative-subtle", fg: "text-negative" }
}, la = [1, 2, 3, 4], as = [1, 2, 3, 4], ze = (t) => Ve[t] ?? Ve[1], oa = (t) => ct[t] ?? ct[2];
function Ke(t) {
  if (!t) return "—";
  const a = String(t).trim().split(/\s+/).filter(Boolean);
  return a.length ? (a.length > 1 ? a[0][0] + a[a.length - 1][0] : a[0].slice(0, 2)).toUpperCase() : "—";
}
function Re(t) {
  return t ? "var(--apya-brand-500)" : "var(--apya-neutral-500)";
}
function ss(t, a = /* @__PURE__ */ new Date()) {
  if (!t) return { tone: "text-text-tertiary", hint: "" };
  const s = new Date(t);
  if (Number.isNaN(s.getTime())) return { tone: "text-text-tertiary", hint: "" };
  const r = Math.ceil((s.setHours(0, 0, 0, 0) - new Date(a).setHours(0, 0, 0, 0)) / 864e5);
  return r < 0 ? { tone: "text-negative", hint: `${Math.abs(r)} gün gecikti` } : r === 0 ? { tone: "text-warning", hint: "Bugün" } : r <= 3 ? { tone: "text-warning", hint: `${r} gün kaldı` } : { tone: "text-text-tertiary", hint: `${r} gün kaldı` };
}
const $e = "rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden";
function dt({ title: t, badge: a, action: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3.5 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: t }),
      a
    ] }),
    s
  ] });
}
function rs({ children: t, tone: a = "positive" }) {
  const s = a === "positive" ? "bg-success-subtle text-success" : "bg-neutral-subtle text-text-secondary";
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-full font-mono text-[11px] font-bold ${s}`, children: t });
}
function Qe({ children: t, bg: a, fg: s }) {
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-[7px] text-[10.5px] font-bold ${a} ${s}`, children: t });
}
function Le({ icon: t, title: a, description: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 px-6 py-10 text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-xl text-text-tertiary` }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: a }),
    s && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] leading-[1.55] text-text-tertiary max-w-[420px]", children: s })
  ] });
}
function ca({ name: t, size: a = 24 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Re(t), fontSize: a * 0.4 },
      title: t || void 0,
      children: Ke(t)
    }
  );
}
const da = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—", $t = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function ns(t) {
  return t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toFixed(1)} MB` : "0 KB";
}
function We(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = Math.floor(a / 3600), r = Math.floor(a % 3600 / 60);
  return !s && !r ? `${a}sn` : s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function is(t) {
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
function ls(t = "") {
  var s;
  const a = ((s = t.split(".").pop()) == null ? void 0 : s.toLowerCase()) ?? "";
  return a === "pdf" ? Ne.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(a) ? Ne.image : ["doc", "docx", "odt", "rtf", "txt"].includes(a) ? Ne.doc : ["xls", "xlsx", "csv", "ods"].includes(a) ? Ne.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(a) ? Ne.code : ["zip", "rar", "7z", "tar", "gz"].includes(a) ? Ne.zip : Ne.other;
}
function os({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, o] = u.useState(""), [l, n] = u.useState(!1), i = se(), p = (a == null ? void 0 : a.subTasks) ?? [], d = p.filter((c) => c.status === 4).length, x = () => i.invalidateQueries({ queryKey: ["task-detail", t] }), b = async () => {
    var f, g, m;
    const c = r.trim();
    if (c) {
      n(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: c,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), o(""), await x();
      } catch (N) {
        (m = (g = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : g.error) == null || m.call(g, (N == null ? void 0 : N.message) || "Alt görev eklenemedi.");
      } finally {
        n(!1);
      }
    }
  }, y = async (c, f) => {
    var g, m, N;
    c.stopPropagation();
    try {
      await Promise.resolve(window.apya.platform.tasks.task.updateStatus(f.id, f.status === 4 ? 1 : 4)), await x();
    } catch (k) {
      (N = (m = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : m.error) == null || N.call(m, (k == null ? void 0 : k.message) || "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        p.length > 0 && /* @__PURE__ */ e.jsxs(rs, { children: [
          d,
          "/",
          p.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: b,
          disabled: l || !r.trim(),
          className: `flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${l || !r.trim() ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            "Alt görev ekle"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
      p.map((c) => {
        const f = ze(c.status), g = c.status === 4;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => s == null ? void 0 : s(c.id, c.title),
            onKeyDown: (m) => {
              m.key === "Enter" && (s == null || s(c.id, c.title));
            },
            className: "flex items-center gap-3.5 px-4 py-3.5 border-t border-subtle first:border-t-0 hover:bg-surface-raised cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": `${c.title} tamamlandı işaretle`,
                  onClick: (m) => y(m, c),
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white cursor-pointer ${g ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: g && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: c.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${g ? "line-through text-text-tertiary" : "text-text-primary"}`, children: c.title }),
              /* @__PURE__ */ e.jsx(Qe, { bg: f.bg, fg: f.fg, children: f.label }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: da(c.dueDate) }),
              /* @__PURE__ */ e.jsx(ca, { name: c.assigneeName }),
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-right shrink-0 text-[10px] text-text-tertiary" })
            ]
          },
          c.id
        );
      }),
      /* @__PURE__ */ e.jsx("div", { className: "px-4 py-3 border-t border-subtle first:border-t-0", children: /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: r,
          onChange: (c) => o(c.target.value),
          onKeyDown: (c) => {
            c.key === "Enter" && b();
          },
          disabled: l,
          placeholder: "Yeni alt görev başlığı",
          className: "w-full h-9 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      ) })
    ] }),
    p.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz alt görev yok." })
  ] });
}
function xa() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function cs(t) {
  const a = xa();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function ds(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, o = Da();
  o && (r.RequestVerificationToken = o);
  const l = await fetch(`/api/tasks/attachments/upload/${t}`, {
    method: "POST",
    credentials: "include",
    headers: r,
    body: s
  });
  let n = null;
  try {
    n = await l.json();
  } catch {
  }
  if (!l.ok || (n == null ? void 0 : n.success) === !1)
    throw new Error((n == null ? void 0 : n.error) || "Dosya yüklenemedi.");
  return n;
}
function ua(t) {
  const a = se(), s = ["task-attachments", t], r = ne({
    queryKey: s,
    queryFn: () => cs(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: s }), l = oe({
    mutationFn: (i) => ds(t, i),
    onSuccess: o
  }), n = oe({
    mutationFn: (i) => Promise.resolve(xa().deleteAttachment(i)),
    onSuccess: o
  });
  return {
    attachments: r.data ?? [],
    isLoading: r.isLoading,
    upload: l.mutateAsync,
    remove: n.mutateAsync,
    isUploading: l.isPending
  };
}
function xs({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: o } = ua(t), l = se(), n = u.useRef(null), [i, p] = u.useState(!1), d = Ze("Platform.Tasks.ShareExternally"), x = async (c, f) => {
    var g, m, N;
    try {
      await window.apya.platform.tasks.taskShare.setAttachmentGuestVisibility(c, f), l.invalidateQueries({ queryKey: ["task-attachments", t] });
    } catch (k) {
      (N = (m = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : m.error) == null || N.call(m, (k == null ? void 0 : k.message) || "Görünürlük değiştirilemedi.");
    }
  }, b = async (c) => {
    var f, g, m, N, k, S;
    if (c)
      try {
        await s(c), (m = (g = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : g.success) == null || m.call(g, "Dosya yüklendi.");
      } catch (E) {
        (S = (k = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : k.error) == null || S.call(k, (E == null ? void 0 : E.message) || "Dosya yüklenemedi.");
      } finally {
        n.current && (n.current.value = "");
      }
  }, y = async (c, f) => {
    var g, m, N;
    try {
      await r(c);
    } catch (k) {
      (N = (m = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : m.error) == null || N.call(m, (k == null ? void 0 : k.message) || `${f} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: n,
        type: "file",
        className: "hidden",
        onChange: (c) => {
          var f;
          return b((f = c.target.files) == null ? void 0 : f[0]);
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
          return (c = n.current) == null ? void 0 : c.click();
        },
        onKeyDown: (c) => {
          var f;
          c.key === "Enter" && ((f = n.current) == null || f.click());
        },
        onDragOver: (c) => {
          c.preventDefault(), i || p(!0);
        },
        onDragLeave: () => p(!1),
        onDrop: (c) => {
          var f, g;
          c.preventDefault(), p(!1), b((g = (f = c.dataTransfer) == null ? void 0 : f.files) == null ? void 0 : g[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${i ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${o ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-[26px] ${i ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: o ? "Yükleniyor…" : i ? "Bırakın, yükleyelim" : "Dosyaları buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, PDF, DOCX · max 25MB" })
        ]
      }
    ),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3", children: a.map((c) => {
      const f = ls(c.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${f.bg} ${f.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${f.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: c.fileName, children: c.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: ns(c.fileSize) })
              ] })
            ] }),
            d && !c.isGuestUpload && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 text-[11px] text-text-tertiary cursor-pointer", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: !!c.isVisibleToGuests,
                  onChange: (g) => x(c.id, g.target.checked)
                }
              ),
              "Dış paylaşımda görünsün"
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2.5 border-t border-subtle", children: [
              /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[11px] text-text-tertiary", children: [
                c.uploaderName,
                c.isGuestUpload ? " · dış" : ""
              ] }),
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
                    onClick: () => y(c.id, c.fileName),
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
function _e() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function us(t) {
  const a = _e();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function pt(t) {
  const a = se(), s = ["task-checklist", t], r = ne({
    queryKey: s,
    queryFn: () => us(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: s }), l = oe({
    mutationFn: (p) => Promise.resolve(_e().addChecklistItem(t, p)),
    onSuccess: o
  }), n = oe({
    mutationFn: (p) => Promise.resolve(_e().toggleChecklistItem(p)),
    onSuccess: o
  }), i = oe({
    mutationFn: (p) => Promise.resolve(_e().deleteChecklistItem(p)),
    onSuccess: o
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: l.mutateAsync,
    toggleItem: n.mutateAsync,
    removeItem: i.mutateAsync
  };
}
function ps({ taskId: t }) {
  const { items: a, addItem: s, toggleItem: r, removeItem: o } = pt(t), [l, n] = u.useState(""), i = async () => {
    var b, y, c;
    const x = l.trim();
    if (x)
      try {
        await s(x), n("");
      } catch (f) {
        (c = (y = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : y.error) == null || c.call(y, (f == null ? void 0 : f.message) || "Madde eklenemedi.");
      }
  }, p = async (x) => {
    var b, y, c;
    try {
      await r(x);
    } catch (f) {
      (c = (y = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : y.error) == null || c.call(y, (f == null ? void 0 : f.message) || "Madde güncellenemedi.");
    }
  }, d = async (x, b) => {
    var y, c, f;
    try {
      await o(x);
    } catch (g) {
      (f = (c = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : c.error) == null || f.call(c, (g == null ? void 0 : g.message) || `${b} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        Se,
        {
          value: l,
          onChange: (x) => n(x.target.value),
          onKeyDown: (x) => {
            x.key === "Enter" && i();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ e.jsx(ae, { variant: "secondary", onClick: i, disabled: !l.trim(), children: "Ekle" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz madde eklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "space-y-1.5", children: a.map((x) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-2 py-1", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: x.isDone,
            onChange: () => p(x.id)
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: x.isDone ? "text-text-tertiary line-through" : "text-text-primary", children: x.text })
      ] }),
      /* @__PURE__ */ e.jsx(ae, { variant: "ghost", onClick: () => d(x.id, x.text), "aria-label": `${x.text} maddesini sil`, children: "Sil" })
    ] }, x.id)) })
  ] });
}
function ms({ taskId: t, task: a }) {
  const [s, r] = u.useState(""), [o, l] = u.useState(null), [n, i] = u.useState(""), [p, d] = u.useState(!1), x = se(), b = (a == null ? void 0 : a.comments) ?? [], y = async (f) => {
    var g, m, N, k, S, E;
    if (f == null || f.preventDefault(), !(!s.trim() || p)) {
      d(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), x.invalidateQueries({ queryKey: ["task-detail", t] }), (N = (m = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : m.success) == null || N.call(m, "Yorum eklendi.");
      } catch (R) {
        (E = (S = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : S.error) == null || E.call(S, (R == null ? void 0 : R.message) || "Yorum eklenemedi.");
      } finally {
        d(!1);
      }
    }
  }, c = async (f) => {
    var g, m, N, k, S, E;
    if (!(!n.trim() || p)) {
      d(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(f, n.trim())
        ), i(""), l(null), x.invalidateQueries({ queryKey: ["task-detail", t] }), (N = (m = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : m.success) == null || N.call(m, "Yanıt eklendi.");
      } catch (R) {
        (E = (S = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : S.error) == null || E.call(S, (R == null ? void 0 : R.message) || "Yanıt eklenemedi.");
      } finally {
        d(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("form", { onSubmit: y, className: "rounded-lg border border-default p-3 bg-surface-base", children: [
      /* @__PURE__ */ e.jsx(
        "textarea",
        {
          rows: 3,
          value: s,
          onChange: (f) => r(f.target.value),
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
    b.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: b.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: f.creatorUserName || f.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: f.creationTime ? new Date(f.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: f.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        ae,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => l(o === f.id ? null : f.id),
          children: "Yanıtla"
        }
      ) }),
      o === f.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: n,
            onChange: (g) => i(g.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(ae, { variant: "ghost", size: "sm", onClick: () => l(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(ae, { variant: "primary", size: "sm", disabled: !n.trim() || p, onClick: () => c(f.id), children: "Gönder" })
        ] })
      ] }),
      f.replies && f.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: f.replies.map((g) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: g.creatorUserName || g.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: g.creationTime ? new Date(g.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: g.text })
      ] }, g.id)) })
    ] }, f.id)) })
  ] });
}
function Je() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.taskShare) ?? null;
}
function fs(t) {
  const a = se(), s = ["task-share-links", t], r = ne({
    queryKey: s,
    queryFn: () => {
      const i = Je();
      return i ? Promise.resolve(i.getList(t)) : Promise.reject(new Error("Paylaşım servisi yüklenmedi."));
    },
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: s }), l = oe({
    mutationFn: (i) => Promise.resolve(Je().create({ ...i, taskId: t })),
    onSuccess: o
  }), n = oe({
    mutationFn: (i) => Promise.resolve(Je().revoke(i)),
    onSuccess: o
  });
  return {
    links: r.data ?? [],
    /* isLoading DEĞİL isPending: kalıcı önbellek geri yüklenirken isLoading
       FALSE döner ama liste henüz yoktur; sekme o karede "henüz kimseyle
       paylaşılmadı" yazıyordu — paylaşımı olan görevde bile. */
    isPending: r.isPending,
    error: r.error,
    create: l.mutateAsync,
    revoke: n.mutateAsync,
    isCreating: l.isPending
  };
}
const Et = {
  recipientName: "",
  recipientEmail: "",
  lifetimeDays: 14,
  allowComment: !0,
  allowUpload: !0,
  allowDownload: !0
};
function bs(t) {
  return t ? new Date(t).toLocaleDateString("tr-TR") : "—";
}
function hs({ taskId: t }) {
  const { links: a, isPending: s, create: r, revoke: o, isCreating: l } = fs(t), [n, i] = u.useState(Et), [p, d] = u.useState(null);
  if (!Ze("Platform.Tasks.ShareExternally"))
    return /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Görevi ekip dışıyla paylaşma yetkiniz yok." });
  const b = (m) => (N) => {
    const k = N.target.type === "checkbox" ? N.target.checked : N.target.value;
    i((S) => ({ ...S, [m]: k }));
  }, y = async (m) => {
    var N, k, S;
    if (m.preventDefault(), !!n.recipientName.trim())
      try {
        const E = await r({
          ...n,
          lifetimeDays: Number(n.lifetimeDays) || 14
        });
        d(E), i(Et);
      } catch (E) {
        (S = (k = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : k.error) == null || S.call(k, (E == null ? void 0 : E.message) || "Paylaşım linki üretilemedi.");
      }
  }, c = (m) => `${window.location.origin}${m}`, f = (m) => {
    var N, k, S, E;
    (N = navigator.clipboard) == null || N.writeText(c(m)), (E = (S = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : S.info) == null || E.call(S, "Bağlantı kopyalandı.");
  }, g = async (m) => {
    var N, k, S;
    try {
      await o(m);
    } catch (E) {
      (S = (k = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : k.error) == null || S.call(k, (E == null ? void 0 : E.message) || "Bağlantı iptal edilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    p && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 rounded-[14px] border border-focus bg-primary-subtle p-3.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "text-[12.5px] font-bold text-text-primary", children: [
        "Bağlantı hazır — ",
        /* @__PURE__ */ e.jsx("span", { className: "font-normal", children: "şimdi kopyalayın, bir daha gösterilmeyecek." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("code", { className: "min-w-0 flex-1 truncate rounded-[8px] bg-surface-base px-2.5 py-2 font-mono text-[11.5px] text-text-secondary", children: c(p.url) }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => f(p.url),
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
    /* @__PURE__ */ e.jsxs("form", { onSubmit: y, className: "flex flex-col gap-2.5 rounded-[14px] border border-subtle bg-surface-base p-3.5", children: [
      /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary", children: "Yeni paylaşım bağlantısı" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2.5", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            required: !0,
            value: n.recipientName,
            onChange: b("recipientName"),
            placeholder: "Kime? (ad soyad)",
            className: "min-w-0 flex-[2_1_180px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "email",
            value: n.recipientEmail,
            onChange: b("recipientEmail"),
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
            value: n.lifetimeDays,
            onChange: b("lifetimeDays"),
            title: "Geçerlilik (gün)",
            className: "w-[92px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: n.allowComment, onChange: b("allowComment") }),
          "Yorum yazabilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: n.allowUpload, onChange: b("allowUpload") }),
          "Dosya yükleyebilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: n.allowDownload, onChange: b("allowDownload") }),
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
              m.isActive ? `${bs(m.expiresAt)} tarihine kadar geçerli` : m.revokedAt ? "İptal edildi" : "Süresi doldu",
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
function gs({ task: t }) {
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
      const l = o === a.length - 1;
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
function ys({ task: t }) {
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
function Xe({ label: t, value: a, tone: s, note: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: `font-mono text-[22px] font-bold tracking-[-.02em] ${s}`, style: { fontVariantNumeric: "tabular-nums" }, children: a }),
    r && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
  ] });
}
function vs({ task: t }) {
  const a = (t == null ? void 0 : t.expenses) || [], s = (t == null ? void 0 : t.incomes) || [];
  if (a.length === 0 && s.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
      /* @__PURE__ */ e.jsx(dt, { title: "Görev Finansı" }),
      /* @__PURE__ */ e.jsx(
        Le,
        {
          icon: "fa-coins",
          title: "Kayıt yok",
          description: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
        }
      )
    ] });
  const o = Array.from(new Set([...a, ...s].map((n) => n.currency || "TRY"))).map((n) => {
    const i = s.filter((d) => (d.currency || "TRY") === n).reduce((d, x) => d + (x.amount || 0), 0), p = a.filter((d) => (d.currency || "TRY") === n).reduce((d, x) => d + (x.amount || 0), 0);
    return { cur: n, inc: i, exp: p, net: i - p };
  }), l = [
    ...s.map((n) => ({ ...n, kind: "income" })),
    ...a.map((n) => ({ ...n, kind: "expense" }))
  ].sort((n, i) => new Date(i.date || 0) - new Date(n.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    o.map(({ cur: n, inc: i, exp: p, net: d }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(Xe, { label: `Toplam Gelir (${n})`, value: Ge(i, n), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(Xe, { label: `Toplam Gider (${n})`, value: Ge(p, n), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        Xe,
        {
          label: `Net Bakiye (${n})`,
          value: Ge(d, n),
          tone: d >= 0 ? "text-success" : "text-negative",
          note: d >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, n)),
    /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
      /* @__PURE__ */ e.jsx(dt, { title: "Finans kalemleri" }),
      l.map((n) => /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-7 w-7 rounded-lg bg-neutral-subtle text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n.kind === "income" ? "fa-arrow-down" : "fa-arrow-up"} text-[11px]` }) }),
            /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] font-semibold text-text-primary", children: n.title || (n.kind === "income" ? "Gelir" : "Gider") }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: da(n.date) }),
            n.kind === "income" ? /* @__PURE__ */ e.jsx(Qe, { bg: "bg-success-subtle", fg: "text-success", children: "Gelir" }) : /* @__PURE__ */ e.jsx(Qe, { bg: "bg-warning-subtle", fg: "text-warning", children: "Gider" }),
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
const js = {
  0: "bg-neutral-400",
  1: "bg-text-tertiary",
  2: "bg-warning",
  3: "bg-primary",
  4: "bg-success"
};
function et(t) {
  if (!t) return null;
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? null : a;
}
const Ae = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
function ws({ task: t = {} }) {
  const a = u.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((n, i) => ({
    id: n.id || `row-${i}`,
    name: n.title || "Başlıksız görev",
    isMain: !!n.__main,
    start: et(n.startDate),
    end: et(n.dueDate) || et(n.completedDate),
    status: n.status ?? 1
  })), [t]), { min: s, span: r } = u.useMemo(() => {
    const l = a.flatMap((p) => [p.start, p.end]).filter(Boolean).map((p) => p.getTime());
    if (l.length === 0) return { min: null, span: 0 };
    const n = Math.min(...l), i = Math.max(...l);
    return { min: n, span: Math.max(1, i - n) };
  }, [a]), o = u.useMemo(() => s === null ? [] : [0, 1, 2, 3].map((l) => new Date(s + r * l / 4)), [s, r]);
  return s === null ? /* @__PURE__ */ e.jsx("div", { className: $e, children: /* @__PURE__ */ e.jsx(
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
        Ae(new Date(s)),
        " – ",
        Ae(new Date(s + r))
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-4 gap-0 pl-[170px] mb-2 lt-860:pl-[110px]", children: o.map((l, n) => /* @__PURE__ */ e.jsx(
      "span",
      {
        className: "pl-2 border-l border-subtle text-[10.5px] font-bold uppercase tracking-[.06em] text-text-tertiary",
        children: Ae(l)
      },
      n
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: a.map((l) => {
      const n = l.start ? l.start.getTime() : s, i = l.end ? Math.max(l.end.getTime(), n) : n, p = (n - s) / r * 100, d = Math.max(2, (i - n) / r * 100), x = Math.max(1, Math.round((i - n) / 864e5));
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
            className: `absolute top-[7px] bottom-[7px] flex items-center px-2.5 rounded-[7px] shadow-xs ${js[l.status] || "bg-primary"}`,
            style: { left: `${p}%`, width: `${d}%` },
            title: `${Ae(l.start)} – ${Ae(l.end)}`,
            children: /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[10.5px] font-bold text-white", children: [
              x,
              "g"
            ] })
          }
        ) })
      ] }, l.id);
    }) })
  ] });
}
function Pt({ icon: t, iconTone: a, title: s, note: r, children: o }) {
  return /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[12px] ${a}` }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: s }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
    ] }),
    o
  ] });
}
function Ns({ task: t = {} }) {
  const a = se(), s = t.predecessorIds || [], r = () => {
    var p, d, x;
    return (x = (d = (p = window == null ? void 0 : window.apya) == null ? void 0 : p.platform) == null ? void 0 : d.tasks) == null ? void 0 : x.task;
  }, { data: o = [], isLoading: l } = ne({
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
    var d, x, b, y, c, f;
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
        predecessorIds: s.filter((g) => g !== p),
        tagNames: (t.tags ?? []).map((g) => g.name),
        estimatedHours: t.estimatedHours ?? null,
        taskType: t.taskType ?? null,
        sprint: t.sprint ?? null
      })), await a.invalidateQueries({ queryKey: ["task-detail", t.id] }), (b = (x = (d = window == null ? void 0 : window.abp) == null ? void 0 : d.notify) == null ? void 0 : x.info) == null || b.call(x, "Bağlantı kaldırıldı.");
    } catch (g) {
      (f = (c = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : c.error) == null || f.call(c, (g == null ? void 0 : g.message) || "Bağlantı kaldırılamadı.");
    }
  }, i = (p) => {
    var d, x, b;
    return (b = (x = (d = window == null ? void 0 : window.apya) == null ? void 0 : d.taskDetail) == null ? void 0 : x.open) == null ? void 0 : b.call(x, p);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsx(
      Pt,
      {
        icon: "fa-arrow-left-long",
        iconTone: "text-warning",
        title: "Öncül görevler",
        note: "bu görev başlamadan tamamlanmalı",
        children: s.length === 0 ? /* @__PURE__ */ e.jsx(Le, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : l ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : o.map((p) => {
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
                d && /* @__PURE__ */ e.jsx(Qe, { bg: d.bg, fg: d.fg, children: d.label }),
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
      Pt,
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
function Te() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task) || null;
}
function ks(t) {
  const a = se(), s = ["task-timelogs", t], r = ["task-active-timelog"], o = ne({
    queryKey: s,
    queryFn: () => {
      var d;
      return Promise.resolve((d = Te()) == null ? void 0 : d.getTimeLogs(t));
    },
    enabled: !!t && !!Te(),
    staleTime: 15e3,
    retry: !1
  }), l = ne({
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
  }, i = oe({
    mutationFn: () => {
      var d;
      return Promise.resolve((d = Te()) == null ? void 0 : d.startTimeTracking(t));
    },
    onSuccess: n
  }), p = oe({
    mutationFn: () => {
      var d;
      return Promise.resolve((d = Te()) == null ? void 0 : d.stopTimeTracking(t));
    },
    onSuccess: n
  });
  return {
    logs: o.data ?? [],
    isLoading: o.isLoading,
    activeLog: l.data ?? null,
    start: i.mutateAsync,
    stop: p.mutateAsync,
    isMutating: i.isPending || p.isPending
  };
}
function At(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function Cs({ taskId: t, task: a = {} }) {
  const s = ks(t), r = s.activeLog && s.activeLog.taskId === t ? s.activeLog : null, [o, l] = u.useState(() => Date.now());
  u.useEffect(() => {
    if (!r) return;
    const f = setInterval(() => l(Date.now()), 1e3);
    return () => clearInterval(f);
  }, [r]);
  const n = r ? Math.max(0, Math.floor((o - new Date(r.startTime).getTime()) / 1e3)) : 0, p = s.logs.reduce((f, g) => f + (g.secondsSpent || 0), 0) + n, d = (a == null ? void 0 : a.estimatedHours) ?? null, x = d ? d * 3600 : 0, b = x ? Math.min(100, Math.round(p / x * 100)) : 0, y = x ? Math.max(0, x - p) : 0, c = async () => {
    var f, g, m;
    try {
      r ? await s.stop() : await s.start();
    } catch (N) {
      (m = (g = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : g.error) == null || m.call(g, (N == null ? void 0 : N.message) || "Zaman takibi güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-5 flex-wrap p-[22px] rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[18px]", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: c,
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
              children: is(p)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary", children: r ? "Kayıt sürüyor" : "Sayaç duraklatıldı" })
        ] })
      ] }),
      x > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] font-bold text-text-secondary", children: "Tahmin kullanımı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
            We(p),
            " / ",
            d,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-warning", style: { width: `${b}%` } }) }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "Kalan tahmini süre: ",
          We(y)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
      /* @__PURE__ */ e.jsx(dt, { title: "Zaman kayıtları" }),
      s.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : s.logs.length === 0 ? /* @__PURE__ */ e.jsx(
        Le,
        {
          icon: "fa-stopwatch",
          title: "Henüz zaman kaydı yok",
          description: "Soldaki yeşil düğmeyle sayacı çalıştırın; durdurduğunuzda kayıt buraya düşer."
        }
      ) : s.logs.map((f) => {
        const g = !f.endTime;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
            children: [
              /* @__PURE__ */ e.jsx(ca, { name: f.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: f.note || f.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                At(f.startTime),
                " → ",
                g ? "sürüyor" : At(f.endTime)
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary", children: g ? "Aktif" : We(f.secondsSpent || 0) })
            ]
          },
          f.id
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
    component: os
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
    component: xs
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
    component: ps
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
    component: ws
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
    component: Ns
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
    component: vs
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
    component: ys
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
    component: gs
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
    component: ms
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
    component: hs
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
    component: Cs
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
function pa(t = []) {
  const a = new Set(t);
  return Me.filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function Ts(t = []) {
  const a = new Set(t);
  return Me.filter((s) => !s.isCore).filter((s) => !s.permission || Ze(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let qe = null;
const Ye = /* @__PURE__ */ new Set(), tt = /* @__PURE__ */ new Set();
function It() {
  Ye.forEach((t) => t());
}
function Ds(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const re = {
  open(t) {
    const a = Ds(t);
    a && (qe = a, It());
  },
  close() {
    qe = null, It();
  },
  subscribe(t) {
    return Ye.add(t), () => Ye.delete(t);
  },
  getSnapshot() {
    return qe;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && tt.add(t);
  },
  emitResult() {
    tt.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    qe = null, Ye.clear(), tt.clear();
  }
}, Bt = "apya.taskDetail.fullscreen";
function ma({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, o] = u.useState(t), [l, n] = u.useState([]), { data: i, isPending: p, isError: d, refetch: x } = xt(r), b = ea(), y = ra(i), c = na(), f = ia(r), [g, m] = u.useState("general"), [N, k] = u.useState(!1), S = Be.useRef(null), E = u.useMemo(
    () => pa(f.assignedCodes),
    [f.assignedCodes]
  ), R = u.useMemo(
    () => Ts(f.assignedCodes),
    [f.assignedCodes]
  ), K = E.find((A) => A.code === g) ?? E[0];
  Be.useEffect(() => {
    K.code !== g && m(K.code);
  }, [K, g]);
  const W = K == null ? void 0 : K.component, M = se(), [q, _] = u.useState(
    () => {
      var A;
      return ((A = window.localStorage) == null ? void 0 : A.getItem(Bt)) === "1";
    }
  ), [L, Y] = u.useState(!1), J = u.useCallback(() => {
    aa(), s == null || s();
  }, [s]);
  sa(t, J), Be.useEffect(() => {
    y.isDirty ? b.markDirty() : b.markClean();
  });
  const V = u.useCallback(() => b.requestClose(J), [b, J]), X = u.useCallback(() => {
    _((A) => {
      var G;
      const B = !A;
      return (G = window.localStorage) == null || G.setItem(Bt, B ? "1" : "0"), B;
    });
  }, []), O = Ze("Platform.Tasks.Delete"), [ee, j] = u.useState(!1), [v, h] = u.useState(!1), T = u.useCallback(async () => {
    var A, B, G, te, Z, je;
    h(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (G = (B = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : B.info) == null || G.call(B, "Başarıyla silindi."), j(!1), b.markClean(), J();
    } catch (xe) {
      (je = (Z = (te = window == null ? void 0 : window.abp) == null ? void 0 : te.notify) == null ? void 0 : Z.error) == null || je.call(Z, (xe == null ? void 0 : xe.message) || "Görev silinemedi.");
    } finally {
      h(!1);
    }
  }, [r, b, J]), $ = u.useCallback(async () => {
    var A, B, G, te, Z, je;
    if (!y.validate()) return !1;
    Y(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, y.toUpdateDto())
      ), await M.invalidateQueries({ queryKey: ["task-detail", r] }), re.emitResult(), (G = (B = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : B.success) == null || G.call(B, "Kaydedildi."), !0;
    } catch (xe) {
      return (je = (Z = (te = window == null ? void 0 : window.abp) == null ? void 0 : te.notify) == null ? void 0 : Z.error) == null || je.call(Z, (xe == null ? void 0 : xe.message) || "Kaydedilemedi."), !1;
    } finally {
      Y(!1);
    }
  }, [r, y, b, M]), H = u.useCallback(() => {
    $();
  }, [$]), ce = u.useCallback(async () => {
    const A = b.resolvePendingClose("save");
    await $() && (A == null || A());
  }, [b, $]), w = u.useCallback((A, B) => {
    b.requestClose(() => {
      n((G) => [...G, { id: r, title: (i == null ? void 0 : i.title) ?? "" }]), o(A), m("general"), b.markClean();
    });
  }, [b, r, i]), I = u.useCallback((A) => {
    b.requestClose(() => {
      n((B) => {
        const G = B.findIndex((te) => te.id === A);
        return G === -1 ? B : B.slice(0, G);
      }), o(A), m("general"), b.markClean();
    });
  }, [b]), P = u.useCallback(async (A) => {
    var B, G, te;
    try {
      await f.addFeature(A), m(A), k(!1);
    } catch (Z) {
      (te = (G = (B = window == null ? void 0 : window.abp) == null ? void 0 : B.notify) == null ? void 0 : G.error) == null || te.call(G, (Z == null ? void 0 : Z.message) || "Özellik eklenemedi.");
    }
  }, [f]), F = u.useCallback(async (A) => {
    var B, G, te;
    try {
      await f.removeFeature(A), m((Z) => Z === A ? "general" : Z);
    } catch (Z) {
      (te = (G = (B = window == null ? void 0 : window.abp) == null ? void 0 : B.notify) == null ? void 0 : G.error) == null || te.call(G, (Z == null ? void 0 : Z.message) || "Özellik kaldırılamadı.");
    }
  }, [f]);
  Be.useEffect(() => {
    if (!N) return;
    const A = (G) => {
      S.current && !S.current.contains(G.target) && k(!1);
    }, B = (G) => {
      G.key === "Escape" && k(!1);
    };
    return document.addEventListener("mousedown", A), document.addEventListener("keydown", B), () => {
      document.removeEventListener("mousedown", A), document.removeEventListener("keydown", B);
    };
  }, [N]);
  const U = p ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(be, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(be, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(be, { className: "h-24 w-full" })
  ] }) : d ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(ae, { variant: "ghost", onClick: () => x(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      Qa,
      {
        trail: l,
        current: { id: r, title: (i == null ? void 0 : i.title) ?? "" },
        onNavigate: I
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: S, children: [
      /* @__PURE__ */ e.jsx(
        Ya,
        {
          tabs: E,
          activeCode: K.code,
          onSelect: (A) => {
            m(A), k(!1);
          },
          onOpenPicker: () => k((A) => !A),
          pickerOpen: N
        }
      ),
      N && /* @__PURE__ */ e.jsx(
        Va,
        {
          entries: R,
          busyCode: f.isMutating ? f.mutatingCode : null,
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
        "aria-labelledby": `task-tab-${K.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          K.code === "general" ? /* @__PURE__ */ e.jsx(
            qa,
            {
              values: y.values,
              errors: y.errors,
              onFieldChange: y.setField,
              assigneeOptions: c.options,
              isLoadingAssignees: c.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(u.Suspense, { fallback: /* @__PURE__ */ e.jsx(be, { className: "h-24 w-full" }), children: W && /* @__PURE__ */ e.jsx(
            W,
            {
              taskId: r,
              task: i,
              onOpenSubtask: w
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            Oa,
            {
              task: i,
              creatorName: c.nameById.get(i.creatorId),
              lastModifierName: c.nameById.get(i.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), ie = a === "page" ? La : Ba;
  return /* @__PURE__ */ e.jsxs(
    ie,
    {
      open: !0,
      fullscreen: q,
      onRequestClose: V,
      title: i ? `Görev Detayı: ${i.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        Ka,
        {
          task: i ?? { title: "Yükleniyor…" },
          canDelete: O,
          fullscreen: q,
          onToggleFullscreen: X,
          onClose: V,
          onDelete: () => j(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        Ma,
        {
          lastSavedAt: i == null ? void 0 : i.lastModificationTime,
          isDirty: b.isDirty,
          isSaving: L,
          onCancel: V,
          onSave: H
        }
      ),
      children: [
        U,
        b.pendingClose && /* @__PURE__ */ e.jsx(
          $s,
          {
            isSaving: L,
            onStay: () => b.resolvePendingClose("stay"),
            onDiscard: () => b.resolvePendingClose("discard"),
            onSaveAndClose: ce
          }
        ),
        ee && /* @__PURE__ */ e.jsx(
          Ss,
          {
            taskTitle: (i == null ? void 0 : i.title) ?? "",
            busy: v,
            onCancel: () => j(!1),
            onConfirm: T
          }
        )
      ]
    }
  );
}
function Ss({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [o, l] = u.useState(""), n = o.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    fa,
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
            onChange: (i) => l(i.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function fa({ label: t, title: a, description: s, children: r, actions: o }) {
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
function $s({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    fa,
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
function ke(t) {
  return (t == null ? void 0 : t.closest('[role="dialog"]')) ?? void 0;
}
const Es = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function Ps({ isPrivate: t = !1, onChange: a = () => {
} }) {
  const s = !!t, [r, o] = u.useState(null);
  return /* @__PURE__ */ e.jsxs(he, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(ge, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
    /* @__PURE__ */ e.jsx(ye, { container: ke(r), children: /* @__PURE__ */ e.jsxs(
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
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: Es.map((l) => {
            const n = s === l.value;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => a(l.value),
                className: `flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${n ? "border-primary bg-primary-subtle/40" : "border-subtle hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l.icon} text-base mt-0.5 ${n ? "text-primary" : "text-text-tertiary"}` }),
                  /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ e.jsx("h4", { className: "text-[13px] font-semibold text-text-primary", children: l.title }),
                      n && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ] }),
                    /* @__PURE__ */ e.jsx("p", { className: "text-[12px] text-text-tertiary mt-0.5", children: l.desc })
                  ] })
                ]
              },
              String(l.value)
            );
          }) }),
          /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-text-tertiary mt-3", children: "Değişiklik “Kaydet” ile uygulanır." }),
          /* @__PURE__ */ e.jsx(Sa, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const Lt = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto", As = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", Is = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" },
  { what: "Bağlantı kopyala", key: "⌘ L" }
];
function Bs({ children: t }) {
  return /* @__PURE__ */ e.jsx(Jt, { asChild: !0, children: t });
}
function Ls({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "inline-flex items-center h-[19px] px-1.5 rounded-[5px] border border-default border-b-2 bg-neutral-subtle font-mono text-[10px] font-semibold text-text-secondary", children: t });
}
function zs({
  task: t = {},
  presentation: a = "modal",
  onClose: s,
  isFullscreen: r,
  onToggleFullscreen: o,
  onFieldChange: l = () => {
  },
  statusValue: n,
  titleValue: i,
  isPrivateValue: p,
  isFavorite: d,
  onToggleFavorite: x,
  isWatched: b,
  onToggleWatch: y,
  onDuplicate: c,
  onArchive: f,
  onDelete: g,
  onOpenTransfer: m,
  onSaveAsTemplate: N,
  onConvertToSubtask: k,
  onExportPdf: S
}) {
  const [E, R] = u.useState(!1), [K, W] = u.useState(null), [M, q] = u.useState(!1), _ = u.useRef(null), L = ke(K), Y = ze(n ?? t.status), J = t.code || "GRV-—", V = () => {
    var j;
    (j = navigator.clipboard) == null || j.writeText(J), R(!0), setTimeout(() => R(!1), 1800);
  }, X = () => {
    var j, v, h, T;
    (j = navigator.clipboard) == null || j.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), (T = (h = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : h.success) == null || T.call(h, "Görev bağlantısı panoya kopyalandı.");
  }, O = (j) => () => {
    q(!1), j == null || j();
  }, ee = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", kbd: "⌘L", onClick: O(X) },
    { label: "Çoğalt", icon: "fa-copy", kbd: "⌘D", onClick: O(c) },
    { label: "Başka projeye kopyala", icon: "fa-clone", onClick: O(() => m == null ? void 0 : m("copy")) },
    { label: "Şablon olarak kaydet", icon: "fa-bookmark", onClick: O(N) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, onClick: O(() => m == null ? void 0 : m("move")) },
    { label: "Alt göreve dönüştür", icon: "fa-diagram-project", onClick: O(k) },
    { label: b ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: O(y) },
    { label: "Arşivle", icon: "fa-box-archive", separator: !0, onClick: O(f) },
    { label: "Yazdır", icon: "fa-print", kbd: "⌘P", onClick: O(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: O(S) },
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
              /* @__PURE__ */ e.jsx("i", { className: `${E ? "fa-solid fa-check" : "fa-regular fa-copy"} text-[9px] opacity-60` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(he, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(ge, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] border border-default text-[12px] font-semibold cursor-pointer ${Y.bg} ${Y.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-current animate-pulse" }),
                /* @__PURE__ */ e.jsx("span", { children: Y.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(ye, { container: L, children: /* @__PURE__ */ e.jsxs(ve, { sideOffset: 6, align: "start", className: `${Lt} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            la.map((j) => {
              const v = Ve[j], h = (n ?? t.status) === j;
              return /* @__PURE__ */ e.jsx(Bs, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => l("status", j),
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
        b && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 h-[26px] px-2.5 rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11.5px] font-semibold", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-eye text-[10px]" }),
          "Takip ediliyor"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
        /* @__PURE__ */ e.jsx("div", { className: "lt-860:hidden", children: /* @__PURE__ */ e.jsx(
          Ps,
          {
            isPrivate: p ?? !!t.isPrivate,
            onChange: (j) => l("isPrivate", j)
          }
        ) }),
        /* @__PURE__ */ e.jsx("div", { className: "h-5 w-px bg-border-default mx-1" }),
        a === "modal" && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: o,
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
          /* @__PURE__ */ e.jsx(ye, { container: L, children: /* @__PURE__ */ e.jsxs(
            ve,
            {
              sideOffset: 6,
              align: "end",
              collisionBoundary: L ?? [],
              collisionPadding: 12,
              className: `${Lt} w-[244px]`,
              children: [
                ee.map((j) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: j.onClick,
                    className: [
                      As,
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
                  Is.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: j.what }),
                    /* @__PURE__ */ e.jsx(Ls, { children: j.key })
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
          ref: _,
          contentEditable: !0,
          suppressContentEditableWarning: !0,
          spellCheck: !1,
          onBlur: (j) => l("title", j.currentTarget.textContent.trim()),
          className: "flex-1 min-w-0 text-[24px] lt-560:text-[20px] font-extrabold tracking-[-.025em] leading-[1.2] text-text-primary px-2 -ml-2 py-[3px] rounded-[9px] border border-transparent cursor-text hover:bg-neutral-subtle hover:border-subtle focus:bg-neutral-subtle focus:border-focus focus:shadow-focus focus:outline-none",
          children: i ?? t.title ?? "Başlıksız görev"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: x,
          title: d ? "Favorilerden çıkar" : "Favorilere ekle",
          className: `flex items-center justify-center h-8 w-8 shrink-0 rounded-[9px] cursor-pointer ${d ? "bg-warning-subtle text-warning" : "text-text-tertiary hover:bg-surface-hover"}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${d ? "solid" : "regular"} fa-star text-[15px]` })
        }
      )
    ] })
  ] });
}
const Oe = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", zt = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function fe({ children: t }) {
  return /* @__PURE__ */ e.jsx(Jt, { asChild: !0, children: t });
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
      style: { height: a, width: a, background: Re(t), fontSize: a * 0.38 },
      children: Ke(t)
    }
  );
}
function Rt(t) {
  if (t == null) return "—";
  const a = Math.max(0, Math.round(Number(t) * 60)), s = Math.floor(a / 60), r = a % 60;
  return s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function Ks({
  task: t = {},
  assigneeOptions: a = [],
  projectOptions: s = [],
  onFieldChange: r = () => {
  },
  statusValue: o,
  priorityValue: l,
  assigneeValue: n,
  projectValue: i,
  dueDateValue: p,
  startDateValue: d,
  tagsValue: x = [],
  progressPercent: b = 0,
  progressNote: y = "",
  onOpenTransfer: c
}) {
  var j, v;
  const [f, g] = u.useState(""), [m, N] = u.useState(""), [k, S] = u.useState(""), [E, R] = u.useState(!1), [K, W] = u.useState(null), M = ze(o ?? t.status), q = oa(l ?? t.priority), _ = n ?? t.assigneeId ?? null, L = i ?? t.projectId ?? null, Y = ((j = a.find((h) => h.value === _)) == null ? void 0 : j.label) || t.assigneeName || "Atanmamış", J = ((v = s.find((h) => h.value === L)) == null ? void 0 : v.label) || t.projectName || "Projesiz", V = ss(p ?? t.dueDate), X = a.filter(
    (h) => !f || h.label.toLowerCase().includes(f.toLowerCase())
  ), O = s.filter(
    (h) => !m || h.label.toLowerCase().includes(m.toLowerCase())
  ), ee = () => {
    const h = k.trim();
    h && !x.includes(h) && r("tagNames", [...x, h]), S(""), R(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { ref: W, className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6", children: [
    /* @__PURE__ */ e.jsx(ue, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(he, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(ge, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx(Kt, { name: _ ? Y : null }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: Y }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ye, { container: ke(K), children: /* @__PURE__ */ e.jsxs(ve, { sideOffset: 6, align: "start", className: `${Oe} w-[264px]`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: f,
              onChange: (h) => g(h.target.value),
              placeholder: "Kişi ara…",
              className: zt
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[230px] overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
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
          X.map((h) => /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("assigneeId", h.value),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${_ === h.value ? "bg-primary-subtle" : "hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx(Kt, { name: h.label, size: 24 }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: h.label }),
                _ === h.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
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
            value: (p ?? t.dueDate ?? "").slice(0, 10),
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
          value: (d ?? t.startDate ?? "").slice(0, 10),
          onChange: (h) => r("startDate", h.target.value),
          className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 pt-[5px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: [
          "%",
          b
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-medium text-text-tertiary", children: y })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "h-1.5 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "h-full rounded-full bg-primary transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
          style: { width: `${b}%` }
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
      /* @__PURE__ */ e.jsx(ye, { container: ke(K), children: /* @__PURE__ */ e.jsxs(ve, { sideOffset: 6, align: "start", className: `${Oe} w-[196px]`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
        la.map((h) => {
          const T = Ve[h], $ = (o ?? t.status) === h;
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
      /* @__PURE__ */ e.jsx(ye, { container: ke(K), children: /* @__PURE__ */ e.jsxs(ve, { sideOffset: 6, align: "start", className: `${Oe} w-[184px]`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
        as.map((h) => {
          const T = ct[h], $ = (l ?? t.priority) === h;
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
      x.map((h) => /* @__PURE__ */ e.jsxs(
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
                onClick: () => r("tagNames", x.filter((T) => T !== h)),
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
            h.key === "Enter" && ee(), h.key === "Escape" && (S(""), R(!1));
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
      /* @__PURE__ */ e.jsx(ye, { container: ke(K), children: /* @__PURE__ */ e.jsxs(ve, { sideOffset: 6, align: "start", className: `${Oe} w-[250px]`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: m,
              onChange: (h) => N(h.target.value),
              placeholder: "Proje ara…",
              className: zt
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[210px] overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("projectId", null),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${L ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary"}`,
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
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${L === h.value ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-primary" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: h.label }),
                L === h.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
              ]
            }
          ) }, h.value))
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-[7px] pt-[7px] border-t border-subtle", children: [
          /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => c == null ? void 0 : c("move"),
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
              onClick: () => c == null ? void 0 : c("copy"),
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
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[13px] font-bold text-text-primary", children: Rt(t.spentHours ?? 0) }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[12px] text-text-tertiary", children: [
        "/ ",
        t.estimatedHours != null ? Rt(t.estimatedHours) : "—"
      ] })
    ] }) })
  ] }) });
}
function Rs({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: o,
  onDragEnd: l,
  onReorderTo: n,
  onReorderDrop: i,
  onOpenPicker: p,
  counts: d = {},
  isDirty: x = !1
}) {
  const [b, y] = u.useState(!1);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-6 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 py-2.5 flex-1 min-w-0 overflow-x-auto custom-scrollbar", children: [
      s.map((c) => {
        const f = t === c.code, g = d[c.code] || 0;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            draggable: !0,
            title: "Sürükleyerek sırayı değiştirin",
            ...Xt(() => a(c.code)),
            onDragStart: (m) => {
              o(c.code);
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
            onDragEnd: l,
            className: [
              "flex shrink-0 items-center gap-2 h-[34px] px-[13px] rounded-[10px]",
              "text-[12.5px] whitespace-nowrap cursor-grab active:cursor-grabbing",
              "transition-opacity duration-fast",
              f ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
              r === c.code ? "opacity-35" : "opacity-100"
            ].join(" "),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c.icon} text-[11px] opacity-85` }),
              /* @__PURE__ */ e.jsx("span", { children: c.title }),
              g > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                "rounded-full text-[10px] font-extrabold",
                f ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
              ].join(" "), children: g })
            ]
          },
          c.code
        );
      }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          title: "Özellik ekle",
          onClick: () => {
            y(!1), p();
          },
          onMouseEnter: () => y(!0),
          onMouseLeave: () => y(!1),
          className: [
            "flex shrink-0 items-center gap-[7px] h-[34px] ml-1 rounded-[10px]",
            "border border-dashed border-primary bg-primary-subtle text-primary",
            "text-[12.5px] font-bold whitespace-nowrap cursor-pointer",
            "hover:border-solid",
            "transition-[padding] duration-[160ms] ease-[cubic-bezier(.16,1,.3,1)]",
            b ? "px-[13px]" : "px-[11px]"
          ].join(" "),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            b && /* @__PURE__ */ e.jsx("span", { className: "animate-fade-in-fast", children: "Özellik ekle" })
          ]
        }
      )
    ] }),
    x && /* @__PURE__ */ e.jsxs("span", { className: "flex shrink-0 items-center gap-[7px] h-[26px] px-2.5 rounded-full bg-warning-subtle text-warning text-[11px] font-bold", children: [
      /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-warning animate-pulse" }),
      "Taslak"
    ] })
  ] });
}
function Ms({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: o,
  onDragEnd: l,
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
        s.map((x) => {
          const b = t === x.code, y = d[x.code] || 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              draggable: !0,
              title: "Sürükleyerek sırayı değiştirin",
              ...Xt(() => a(x.code)),
              onDragStart: (c) => {
                o(x.code);
                try {
                  c.dataTransfer.effectAllowed = "move", c.dataTransfer.setData("text/plain", x.code);
                } catch {
                }
              },
              onDragOver: (c) => {
                c.preventDefault(), n(x.code);
              },
              onDrop: (c) => {
                c.preventDefault(), i == null || i();
              },
              onDragEnd: l,
              className: [
                "flex shrink-0 items-center gap-[11px] h-9 px-[11px] rounded-[9px]",
                "text-[12.5px] text-left cursor-grab active:cursor-grabbing",
                "transition-opacity duration-fast",
                b ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
                r === x.code ? "opacity-35" : "opacity-100"
              ].join(" "),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x.icon} text-[12px] w-[15px] opacity-85` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: x.title }),
                y > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                  "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                  "rounded-full text-[10px] font-extrabold",
                  b ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
                ].join(" "), children: y })
              ]
            },
            x.code
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
function De({ label: t, value: a, avatarName: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 py-[9px] border-t border-subtle", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-tertiary shrink-0", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
      s && /* @__PURE__ */ e.jsx(
        "span",
        {
          className: "flex shrink-0 items-center justify-center h-[21px] w-[21px] rounded-full text-[color:var(--apya-avatar-fg)] text-[8.5px] font-bold",
          style: { background: Re(s) },
          children: Ke(s)
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", title: typeof a == "string" ? a : void 0, children: a || "—" })
    ] })
  ] });
}
const Mt = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "—";
function Fs({ task: t = {}, nameById: a }) {
  const s = (l, n) => {
    var i;
    return l || n && ((i = a == null ? void 0 : a.get) == null ? void 0 : i.call(a, n)) || null;
  }, r = s(t.creatorName, t.creatorId), o = t.lastModificationTime ? s(t.lastModifierName, t.lastModifierId) : null;
  return /* @__PURE__ */ e.jsx("aside", { className: "flex flex-col gap-3.5 min-w-0", children: /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsx(De, { label: "Oluşturan", value: r || "Bilinmiyor", avatarName: r }),
    /* @__PURE__ */ e.jsx(De, { label: "Oluşturma tarihi", value: Mt(t.creationTime) }),
    /* @__PURE__ */ e.jsx(De, { label: "Güncelleyen", value: o || "—", avatarName: o }),
    /* @__PURE__ */ e.jsx(De, { label: "Son güncelleme", value: Mt(t.lastModificationTime) }),
    /* @__PURE__ */ e.jsx(De, { label: "Görev tipi", value: t.taskType }),
    /* @__PURE__ */ e.jsx(De, { label: "Sprint", value: t.sprint })
  ] }) });
}
const Gs = [
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
], qs = '<table class="apya-rte-table"><tr><th>Kolon 1</th><th>Kolon 2</th></tr><tr><td>Değer</td><td>Değer</td></tr></table><p><br></p>', Os = '<div class="apya-rte-imgph">görsel yer tutucu</div><p><br></p>';
function Us(t) {
  return t ? /<[a-z][\s\S]*>/i.test(t) ? t : `<p>${t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>` : "";
}
function _s({ value: t, onChange: a, mentionName: s = "ekip arkadaşı" }) {
  const r = u.useRef(null), o = u.useRef(Us(t)), [l, n] = u.useState(!1), [i, p] = u.useState("https://"), d = u.useRef(null), x = (m, N) => {
    var k, S;
    (k = r.current) == null || k.focus();
    try {
      document.execCommand(m, !1, N);
    } catch {
    }
    a == null || a(((S = r.current) == null ? void 0 : S.innerHTML) ?? "");
  }, b = () => {
    const m = window.getSelection();
    d.current = m && m.rangeCount ? m.getRangeAt(0).cloneRange() : null;
  }, y = () => {
    const m = d.current;
    if (!m) return;
    const N = window.getSelection();
    N.removeAllRanges(), N.addRange(m);
  }, c = () => {
    var N;
    const m = i.trim();
    n(!1), !(!m || m === "https://") && ((N = r.current) == null || N.focus(), y(), x("createLink", m), p("https://"));
  }, f = (m) => {
    switch (m.cmd) {
      case "link":
        b();
        return;
      case "image":
        x("insertHTML", Os);
        return;
      case "table":
        x("insertHTML", qs);
        return;
      case "mention":
        x("insertHTML", `<span class="apya-rte-mention">@${s}</span>&nbsp;`);
        return;
      default:
        x(m.cmd, m.arg);
    }
  }, g = "flex shrink-0 items-center justify-center h-7 w-7 rounded-[7px] border-0 bg-transparent text-text-secondary cursor-pointer hover:bg-surface-base hover:text-primary hover:shadow-xs";
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-[14px] border border-default bg-surface-base overflow-hidden shadow-xs", children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-0.5 px-2 py-1.5 border-b border-subtle bg-neutral-subtle overflow-x-auto custom-scrollbar", children: Gs.map((m) => {
      const N = /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          title: m.title,
          onMouseDown: (k) => {
            k.preventDefault(), f(m);
          },
          className: `${g} ${m.gap ? "ml-1.5" : ""}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${m.regular ? "regular" : "solid"} ${m.icon} text-[12px]` })
        },
        m.cmd + m.icon
      );
      return m.cmd !== "link" ? N : /* @__PURE__ */ e.jsxs(he, { modal: !0, open: l, onOpenChange: n, children: [
        /* @__PURE__ */ e.jsx(ge, { asChild: !0, children: N }),
        /* @__PURE__ */ e.jsx(ye, { container: ke(r.current), children: /* @__PURE__ */ e.jsxs(
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
                    value: i,
                    onChange: (k) => p(k.target.value),
                    onKeyDown: (k) => {
                      k.key === "Enter" && c();
                    },
                    className: "flex-1 min-w-0 h-[34px] px-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: c,
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
        dangerouslySetInnerHTML: { __html: o.current }
      }
    )
  ] });
}
const Ft = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
function at({ name: t, size: a = 32 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Re(t), fontSize: a * 0.34 },
      children: Ke(t)
    }
  );
}
function Gt({ open: t, onClick: a }) {
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
const qt = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function Ys({
  task: t = {},
  onFieldChange: a = () => {
  },
  descriptionValue: s,
  checklist: r,
  currentUserName: o = "Ben"
}) {
  const l = t == null ? void 0 : t.id, n = se(), [i, p] = u.useState(!0), [d, x] = u.useState(""), b = (r == null ? void 0 : r.items) ?? [], y = b.filter((v) => v.isDone).length, c = b.length ? Math.round(y / b.length * 100) : 0, f = async () => {
    var h, T, $;
    const v = d.trim();
    if (!(!v || !l)) {
      x("");
      try {
        await r.addItem(v);
      } catch (H) {
        ($ = (T = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : T.error) == null || $.call(T, (H == null ? void 0 : H.message) || "Madde eklenemedi.");
      }
    }
  }, [g, m] = u.useState(!0), [N, k] = u.useState(""), [S, E] = u.useState(!1), [R, K] = u.useState(!1), [W, M] = u.useState(null), [q, _] = u.useState(""), [L, Y] = u.useState({}), { data: J = [] } = ne({
    queryKey: ["task-comments", l],
    queryFn: () => {
      var v, h, T, $;
      return Promise.resolve(($ = (T = (h = (v = window == null ? void 0 : window.apya) == null ? void 0 : v.platform) == null ? void 0 : h.tasks) == null ? void 0 : T.task) == null ? void 0 : $.getComments(l));
    },
    enabled: !!l,
    staleTime: 1e4
  }), V = async () => {
    await n.invalidateQueries({ queryKey: ["task-comments", l] }), await n.invalidateQueries({ queryKey: ["task-detail", l] });
  }, X = async () => {
    var h, T, $;
    const v = N.trim();
    if (!(!v || !l || R)) {
      K(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.addComment(l, v)), await V(), k("");
      } catch (H) {
        ($ = (T = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : T.error) == null || $.call(T, (H == null ? void 0 : H.message) || "Yorum gönderilemedi.");
      } finally {
        K(!1);
      }
    }
  }, O = async (v) => {
    var T, $, H;
    const h = q.trim();
    if (!(!h || !l))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.replyToComment(v, h)), await V(), _(""), M(null);
      } catch (ce) {
        (H = ($ = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : $.error) == null || H.call($, (ce == null ? void 0 : ce.message) || "Yanıt gönderilemedi.");
      }
  }, ee = (v) => Y((h) => {
    const T = h[v] ?? { liked: !1, count: 0 };
    return { ...h, [v]: { liked: !T.liked, count: T.count + (T.liked ? -1 : 1) } };
  }), j = !!N.trim() && !R;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-[9px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Açıklama" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Zengin metin · WYSIWYG" })
      ] }),
      /* @__PURE__ */ e.jsx(
        _s,
        {
          value: s ?? t.description ?? "",
          onChange: (v) => a("description", v),
          mentionName: o
        },
        l
      )
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: Ft, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
            y,
            "/",
            b.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(Gt, { open: i, onClick: () => p((v) => !v) })
      ] }),
      i && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 mt-3.5", children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
            style: { width: `${c}%` }
          }
        ) }),
        b.map((v) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
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
            value: d,
            onChange: (v) => x(v.target.value),
            onKeyDown: (v) => {
              v.key === "Enter" && f();
            },
            placeholder: "Yeni madde yaz ve Enter'a bas…",
            className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: Ft, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Yorumlar & güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: J.length })
        ] }),
        /* @__PURE__ */ e.jsx(Gt, { open: g, onClick: () => m((v) => !v) })
      ] }),
      g && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(at, { name: o }),
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
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${R ? "fa-circle-notch fa-spin" : "fa-paper-plane"} text-[10px]` }),
                    "Gönder"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1", children: J.map((v) => {
          const h = L[v.id] ?? { liked: !1, count: 0 };
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start py-3 border-t border-subtle", children: [
            /* @__PURE__ */ e.jsx(at, { name: v.authorName }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: v.authorName }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: qt(v.creationTime) })
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
                      M((T) => T === v.id ? null : v.id), _("");
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
                    onChange: (T) => _(T.target.value),
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
                /* @__PURE__ */ e.jsx(at, { name: T.authorName, size: 24 }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: T.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: qt(T.creationTime) })
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
function Hs({
  lastSavedAt: t,
  isDirty: a,
  isSaving: s,
  justSaved: r,
  onCancel: o,
  onSave: l
}) {
  const n = t ? new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(t)) : "—", i = s ? "fa-solid fa-circle-notch fa-spin" : r ? "fa-solid fa-check" : "fa-regular fa-floppy-disk", p = s ? "Kaydediliyor…" : r ? "Kaydedildi" : "Kaydet", d = a && !s;
  return /* @__PURE__ */ e.jsxs("footer", { className: "shrink-0 flex items-center justify-between gap-4 px-6 lt-860:px-4 py-3.5 border-t border-subtle bg-surface-base", children: [
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
          onClick: l,
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
const Vs = Object.fromEntries(Me.map((t) => [t.code, t])), Qs = {
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
}, Zs = [
  { title: "GÖREV & PLANLAMA", codes: ["checklist", "gantt", "time-tracking", "dependencies", "risks", "approvals", "dashboard"] },
  { title: "İLETİŞİM", codes: ["comments", "emails"] },
  { title: "GEÇMİŞ & FİNANS", codes: ["activity", "history", "finance", "gallery"] },
  { title: "İLERİ ÖZELLİKLER & YAPAY ZEKA", codes: ["ai", "automations", "custom-fields"] }
], Ws = /* @__PURE__ */ new Set([
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
]), Js = (t) => Ws.has(t);
function ba(t) {
  const a = Vs[t], s = Qs[t];
  return a ? {
    code: t,
    title: a.title,
    icon: a.icon,
    desc: (s == null ? void 0 : s.desc) ?? "",
    bg: (s == null ? void 0 : s.bg) ?? "bg-neutral-subtle",
    fg: (s == null ? void 0 : s.fg) ?? "text-text-secondary"
  } : null;
}
function Xs(t = "") {
  const a = t.trim().toLowerCase();
  return Zs.map((s) => ({
    title: s.title,
    items: s.codes.map(ba).filter(Boolean).filter((r) => !a || r.title.toLowerCase().includes(a) || r.desc.toLowerCase().includes(a))
  })).filter((s) => s.items.length > 0);
}
const Ot = Me.length;
function Ut({ code: t, onRemoveFeature: a, onOpenPicker: s, canRemove: r = !0 }) {
  const o = ba(t) ?? { title: t, desc: "", icon: "fa-cube", bg: "bg-neutral-subtle", fg: "text-text-secondary" };
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
function mt({ open: t, onClose: a, label: s, children: r }) {
  return /* @__PURE__ */ e.jsx(
    $a,
    {
      open: t,
      onOpenChange: (o) => {
        o || a == null || a();
      },
      children: /* @__PURE__ */ e.jsxs(Ea, { children: [
        /* @__PURE__ */ e.jsx(Pa, { className: "fixed inset-0", style: { pointerEvents: "none" } }),
        /* @__PURE__ */ e.jsx(Aa, { asChild: !0, "aria-describedby": void 0, children: /* @__PURE__ */ e.jsxs("div", { className: "fixed inset-0 z-modal", children: [
          /* @__PURE__ */ e.jsx(Ia, { className: "sr-only", children: s }),
          r
        ] }) })
      ] })
    }
  );
}
function er({
  open: t,
  onClose: a,
  assignedCodes: s = [],
  onAddFeature: r,
  onGoToTab: o
}) {
  const [l, n] = u.useState("");
  if (u.useEffect(() => {
    t || n("");
  }, [t]), !t) return null;
  const i = new Set(s), p = Xs(l), d = s.length + 3, x = (b) => {
    if (i.has(b)) {
      o == null || o(b), a == null || a();
      return;
    }
    r == null || r(b), a == null || a();
  };
  return /* @__PURE__ */ e.jsx(mt, { open: t, onClose: a, label: "Özellik ekle", children: /* @__PURE__ */ e.jsx(
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
          onClick: (b) => b.stopPropagation(),
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
                  onChange: (b) => n(b.target.value),
                  placeholder: `${Ot} özellik arasında ara (Gantt, Finans, Risk, AI…)`,
                  className: "w-full h-[42px] pl-9 pr-3.5 rounded-xl border border-default bg-neutral-subtle text-text-primary text-[13px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                }
              )
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col gap-5 px-[22px] pt-3 pb-[22px] overflow-y-auto custom-scrollbar", children: [
              p.map((b) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[11px]", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.1em] text-text-tertiary", children: b.title }),
                  /* @__PURE__ */ e.jsx("span", { className: "flex-1 h-px bg-subtle" })
                ] }),
                /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[11px]", children: b.items.map((y) => {
                  const c = i.has(y.code);
                  return /* @__PURE__ */ e.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => x(y.code),
                      className: `group flex items-start gap-3 p-3.5 rounded-[15px] border text-left cursor-pointer hover:border-focus hover:shadow-md ${c ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                      children: [
                        /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-10 w-10 rounded-xl ${y.bg} ${y.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${y.icon} text-[15px]` }) }),
                        /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-[3px] min-w-0 flex-1", children: [
                          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-between gap-2", children: [
                            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: y.title }),
                            /* @__PURE__ */ e.jsx("span", { className: `shrink-0 text-[10.5px] font-extrabold ${c ? "text-primary" : "text-text-tertiary"}`, children: c ? "✓ Ekli" : "Ekle →" })
                          ] }),
                          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] leading-[1.5] text-text-tertiary", children: y.desc })
                        ] })
                      ]
                    },
                    y.code
                  );
                }) })
              ] }, b.title)),
              p.length === 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 py-12 text-center", children: [
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
const tr = [
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
function ar({ on: t, onClick: a, label: s }) {
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
function sr({
  open: t,
  mode: a = "move",
  onClose: s,
  onConfirm: r,
  projectOptions: o = [],
  currentProjectId: l,
  counts: n = {},
  onCreateProject: i
}) {
  const [p, d] = u.useState(a), [x, b] = u.useState([]), [y, c] = u.useState(""), [f, g] = u.useState(""), [m, N] = u.useState(_t), [k, S] = u.useState(!1);
  u.useEffect(() => {
    t && (d(a), b([]), c(""), g(""), N(_t));
  }, [t, a]);
  const E = u.useMemo(
    () => o.filter((j) => j.value && j.value !== l),
    [o, l]
  ), R = E.filter((j) => !y || j.label.toLowerCase().includes(y.toLowerCase())), K = E.length > 0 && x.length === E.length;
  if (!t) return null;
  const W = (j) => b((v) => v.includes(j) ? v.filter((h) => h !== j) : [...v, j]), M = (j) => {
    var v;
    return ((v = o.find((h) => h.value === j)) == null ? void 0 : v.label) ?? "";
  }, q = async () => {
    var v, h, T;
    const j = f.trim();
    if (!(!j || k)) {
      S(!0);
      try {
        const $ = await (i == null ? void 0 : i(j));
        $ && b((H) => [...H, $]), g("");
      } catch ($) {
        (T = (h = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : h.error) == null || T.call(h, ($ == null ? void 0 : $.message) || "Proje oluşturulamadı.");
      } finally {
        S(!1);
      }
    }
  }, _ = async () => {
    if (!(!x.length || k)) {
      S(!0);
      try {
        await (r == null ? void 0 : r({ mode: p, targetProjectIds: x, include: m }));
      } finally {
        S(!1);
      }
    }
  }, L = p === "move", Y = x.length, J = L ? Y > 1 ? "Taşı ve kopyala" : "Taşı" : Y > 1 ? `${Y} projeye kopyala` : "Kopyala", V = Object.values(m).filter(Boolean).length, X = x.map(M).filter(Boolean), O = X.length ? `${X.length > 2 ? `${X.slice(0, 2).join(", ")} +${X.length - 2}` : X.join(", ")} · ${V} seçenek açık` : `Proje seçilmedi · ${V} seçenek açık`, ee = (j) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${j ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return /* @__PURE__ */ e.jsx(mt, { open: t, onClose: s, label: L ? "Başka projeye taşı" : "Başka projelere kopyala", children: /* @__PURE__ */ e.jsx(
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
          "aria-label": L ? "Başka projeye taşı" : "Başka projelere kopyala",
          onClick: (j) => j.stopPropagation(),
          className: "flex flex-col w-full max-w-[760px] max-h-[88vh] rounded-[20px] border border-default bg-surface-base shadow-xl overflow-hidden animate-dialog-in",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-4 px-[22px] pt-5 pb-4 border-b border-subtle", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-10 w-10 rounded-[13px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-tree text-base" }) }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsx("h3", { className: "m-0 text-base font-extrabold tracking-[-.02em] text-text-primary", children: L ? "Başka projeye taşı" : "Başka projelere kopyala" }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 mb-0 text-[12px] leading-[1.5] text-text-tertiary", children: L ? "Görev ilk seçtiğiniz projeye taşınır; birden fazla seçerseniz kalanlara kopya oluşturulur." : "Görevin kopyası seçtiğiniz her projede oluşturulur; bu görev yerinde kalır." })
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
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => d("move"), className: ee(L), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[10px]" }),
                "Taşı"
              ] }),
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => d("copy"), className: ee(!L), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clone text-[10px]" }),
                "Kopyala"
              ] })
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 grid grid-cols-2 lt-860:grid-cols-1 gap-5 items-start px-[22px] pt-4 pb-5 overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px] min-w-0", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5", children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.08em] text-text-tertiary", children: [
                    "Hedef projeler · ",
                    Y
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => b(K ? [] : E.map((j) => j.value)),
                      className: "p-0 border-0 bg-transparent text-primary text-[11px] font-bold cursor-pointer hover:underline",
                      children: K ? "Seçimi temizle" : "Tümünü seç"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: y,
                      onChange: (j) => c(j.target.value),
                      placeholder: "Proje ara…",
                      className: "w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar", children: [
                  R.map((j) => {
                    const v = x.includes(j.value), h = L && x[0] === j.value;
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
                  R.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "py-6 text-center text-[12px] text-text-tertiary", children: "Uygun proje bulunamadı." })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[7px] mt-1", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: f,
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
                      disabled: !f.trim() || k,
                      className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-plus text-[12px]" })
                    }
                  )
                ] }),
                L && Y > 1 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle", children: [
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
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: tr.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-px", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary", children: j.label }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: j.countKey ? `${n[j.countKey] ?? 0} ${j.unit}` : j.desc })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    ar,
                    {
                      on: m[j.key],
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
                    onClick: _,
                    disabled: !Y || k,
                    className: `flex items-center gap-2 h-9 px-5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${Y && !k ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
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
const rr = [
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
function nr(t = "") {
  var s;
  const a = (s = t.split(".").pop()) == null ? void 0 : s.toLowerCase();
  return a === "pdf" ? Ie.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(a) ? Ie.img : ["doc", "docx", "odt", "rtf"].includes(a) ? Ie.doc : ["json", "js", "ts", "cs", "xml", "yml", "yaml"].includes(a) ? Ie.code : Ie.other;
}
const ir = (t) => t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toFixed(1)} MB` : "—", lr = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—", or = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—";
function st({ name: t, size: a = 22 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Re(t), fontSize: a * 0.4 },
      children: Ke(t)
    }
  );
}
function Ue({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: t }),
    a
  ] });
}
function cr({
  subtaskId: t,
  parentCode: a,
  onClose: s,
  onOpenFull: r,
  onDeleted: o,
  currentUserName: l = "Ben"
}) {
  var $, H, ce;
  const n = se(), { data: i } = xt(t), p = pt(t), d = ua(t), [x, b] = u.useState("general"), [y, c] = u.useState(""), [f, g] = u.useState(""), [m, N] = u.useState(""), k = u.useRef(null), S = u.useRef(null);
  i && S.current !== i.id && (S.current = i.id, c(i.description ?? ""));
  const { data: E = [] } = ne({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var w, I, P, F;
      return Promise.resolve((F = (P = (I = (w = window == null ? void 0 : window.apya) == null ? void 0 : w.platform) == null ? void 0 : I.tasks) == null ? void 0 : P.task) == null ? void 0 : F.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4
  });
  if (u.useEffect(() => {
    const w = (I) => {
      I.key === "Escape" && (I.stopPropagation(), s == null || s());
    };
    return window.addEventListener("keydown", w), () => window.removeEventListener("keydown", w);
  }, [s]), !i) return null;
  const R = (ce = (H = ($ = window == null ? void 0 : window.apya) == null ? void 0 : $.platform) == null ? void 0 : H.tasks) == null ? void 0 : ce.task, K = ze(i.status), W = oa(i.priority), M = p.items ?? [], q = M.filter((w) => w.isDone).length, _ = M.length ? Math.round(q / M.length * 100) : 0, L = d.attachments ?? [], Y = { checklist: M.length, comments: E.length, files: L.length }, J = async () => {
    await n.invalidateQueries({ queryKey: ["task-detail", t] });
  }, V = async (w) => {
    var I, P, F;
    try {
      await Promise.resolve(R.update(i.id, {
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
        tagNames: (i.tags ?? []).map((U) => U.name),
        estimatedHours: i.estimatedHours ?? null,
        taskType: i.taskType ?? null,
        sprint: i.sprint ?? null,
        ...w
      })), await J();
    } catch (U) {
      (F = (P = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : P.error) == null || F.call(P, (U == null ? void 0 : U.message) || "Alt görev güncellenemedi.");
    }
  }, X = () => V({ status: i.status >= 4 ? 1 : i.status + 1 }), O = () => V({ priority: i.priority >= 4 ? 1 : i.priority + 1 }), ee = () => {
    (i.description ?? "") !== y && V({ description: y || null });
  }, j = async () => {
    var I, P, F;
    const w = f.trim();
    if (w) {
      g("");
      try {
        await p.addItem(w);
      } catch (U) {
        (F = (P = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : P.error) == null || F.call(P, (U == null ? void 0 : U.message) || "Madde eklenemedi.");
      }
    }
  }, v = async () => {
    var I, P, F;
    const w = m.trim();
    if (w) {
      N("");
      try {
        await Promise.resolve(R.addComment(i.id, w)), await n.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch (U) {
        (F = (P = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : P.error) == null || F.call(P, (U == null ? void 0 : U.message) || "Yorum gönderilemedi.");
      }
    }
  }, h = async () => {
    var w, I, P;
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(R.delete(i.id)), o == null || o(i.id), s == null || s();
      } catch (F) {
        (P = (I = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : I.error) == null || P.call(I, (F == null ? void 0 : F.message) || "Alt görev silinemedi.");
      }
  }, T = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
  return /* @__PURE__ */ e.jsxs(mt, { open: !0, onClose: s, label: `${i.code} alt görev detayı`, children: [
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
              /* @__PURE__ */ e.jsx("span", { className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[10.5px] font-bold tracking-[.04em]", children: i.code }),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: X,
                  title: "Durumu değiştir",
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold cursor-pointer ${K.bg} ${K.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${K.icon} text-[10px]` }),
                    K.label
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
              (i.tags ?? []).map((w) => /* @__PURE__ */ e.jsx("span", { className: "flex items-center h-6 px-[9px] rounded-[7px] border border-default bg-neutral-subtle text-text-secondary text-[11px] font-semibold", children: w.name }, w.id ?? w.name))
            ] }),
            /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[18px] font-extrabold tracking-[-.02em] leading-[1.3] text-text-primary", children: i.title }),
            /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 pt-1", children: [
              /* @__PURE__ */ e.jsx(Ue, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
                /* @__PURE__ */ e.jsx(st, { name: i.assigneeName }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", children: i.assigneeName || "Atanmamış" })
              ] }) }),
              /* @__PURE__ */ e.jsx(Ue, { label: "Son tarih", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] h-[22px] text-[12.5px] font-semibold text-text-primary", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[11px] text-text-tertiary" }),
                or(i.dueDate)
              ] }) }),
              /* @__PURE__ */ e.jsx(Ue, { label: "Süre", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-[22px] font-mono text-[12.5px] font-bold text-text-primary", children: [
                i.spentHours ?? 0,
                "s",
                /* @__PURE__ */ e.jsxs("span", { className: "font-medium text-text-tertiary", children: [
                  " / ",
                  i.estimatedHours != null ? `${i.estimatedHours}s` : "—"
                ] })
              ] }) }),
              /* @__PURE__ */ e.jsx(Ue, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-1.5 pt-[3px]", children: [
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
                  "%",
                  _
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: "block h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("span", { className: "block h-full rounded-full bg-success", style: { width: `${_}%` } }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: rr.map((w) => {
            const I = x === w.code, P = Y[w.code] ?? 0;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => b(w.code),
                className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${I ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
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
            x === "general" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Açıklama" }),
              /* @__PURE__ */ e.jsx(
                "textarea",
                {
                  rows: 7,
                  value: y,
                  onChange: (w) => c(w.target.value),
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
            x === "checklist" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px]", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Kontrol listesi" }),
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: [
                  q,
                  "/",
                  M.length
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-success", style: { width: `${_}%` } }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px] mt-1", children: [
                M.map((w) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] border border-subtle bg-surface-base hover:border-default", children: [
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Tamamlandı işaretle",
                      onClick: () => p.toggleItem(w.id),
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
                      onClick: () => p.removeItem(w.id),
                      className: "flex shrink-0 items-center justify-center h-6 w-6 rounded-md text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[10px]" })
                    }
                  )
                ] }, w.id)),
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "text",
                    value: f,
                    onChange: (w) => g(w.target.value),
                    onKeyDown: (w) => {
                      w.key === "Enter" && j();
                    },
                    placeholder: "Yeni madde yaz ve Enter'a bas…",
                    className: "h-9 mt-1 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                )
              ] })
            ] }),
            x === "comments" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] items-start", children: [
                /* @__PURE__ */ e.jsx(st, { name: l, size: 30 }),
                /* @__PURE__ */ e.jsx(
                  "textarea",
                  {
                    rows: 2,
                    value: m,
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
                    className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] ${m.trim() ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paper-plane text-[11px]" })
                  }
                )
              ] }),
              E.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-[7px] py-7 rounded-xl border border-dashed border-default", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-comments text-xl text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Henüz yorum yok" })
              ] }) : E.map((w) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 items-start p-3 rounded-xl border border-subtle bg-surface-base", children: [
                /* @__PURE__ */ e.jsx(st, { name: w.authorName, size: 28 }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: w.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: lr(w.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: w.text })
                ] })
              ] }, w.id))
            ] }),
            x === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  ref: k,
                  type: "file",
                  className: "hidden",
                  onChange: (w) => {
                    var P;
                    const I = (P = w.target.files) == null ? void 0 : P[0];
                    w.target.value = "", I && d.upload(I).catch((F) => {
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
              L.map((w) => {
                const I = nr(w.fileName);
                return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${I.bg} ${I.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${I.icon} text-[13px]` }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: w.fileName }),
                    /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                      ir(w.fileSize),
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
  ] });
}
const ha = "apya.taskDetail.tabOrder";
function dr() {
  try {
    const t = localStorage.getItem(ha);
    if (!t) return [];
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.filter((s) => typeof s == "string") : [];
  } catch {
    return [];
  }
}
function xr(t) {
  try {
    localStorage.setItem(ha, JSON.stringify(t));
  } catch {
  }
}
function ur(t) {
  const [a, s] = u.useState(dr), [r, o] = u.useState(null), l = u.useMemo(() => {
    const d = new Map(t.map((b) => [b.code, b])), x = [];
    for (const b of a) {
      const y = d.get(b);
      y && (x.push(y), d.delete(b));
    }
    for (const b of t)
      d.has(b.code) && x.push(b);
    return x;
  }, [t, a]), n = u.useCallback((d) => {
    s((x) => {
      const b = r;
      if (!b || b === d) return x;
      const y = x.length ? x.slice() : l.map((g) => g.code), c = y.indexOf(b), f = y.indexOf(d);
      return c === -1 || f === -1 ? x : (y.splice(c, 1), y.splice(f, 0, b), y);
    });
  }, [r, l]), i = u.useCallback((d) => o(d), []), p = u.useCallback(() => {
    o(null), s((d) => {
      const x = d.length ? d : l.map((b) => b.code);
      return xr(x), x;
    });
  }, [l]);
  return { orderedTabs: l, draggingCode: r, handleDragStart: i, handleDragEnd: p, reorderTo: n };
}
function pr() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function mr() {
  const t = ne({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: pr,
    staleTime: 3e5,
    retry: !1
  }), a = t.data ?? [], s = a.map((o) => ({ value: o.id, label: o.name })), r = new Map(a.map((o) => [o.id, o.name]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
const Yt = "apya.taskDetail.fullscreen", Q = {
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
function fr(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function ga({ taskId: t, presentation: a = "modal", onClose: s, switchToTask: r }) {
  var gt, yt, vt, jt, wt, Nt, kt, Ct;
  const [o, l] = u.useState(t), { data: n, isPending: i, isError: p, refetch: d } = xt(o), x = se(), b = ea(), y = ra(n), c = na(), f = mr(), g = ia(o), m = pt(o), [N, k] = u.useState("general"), [S, E] = u.useState(!1), [R, K] = u.useState(!1), [W, M] = u.useState(!1), [q, _] = u.useState(null), [L, Y] = u.useState(null), [J, V] = u.useState(!1), [X, O] = u.useState(!1), [ee, j] = u.useState(() => {
    try {
      return localStorage.getItem(Yt) === "true";
    } catch {
      return !1;
    }
  });
  sa(o);
  const [v, h] = u.useState(null);
  n != null && n.id && n.id !== v && (h(n.id), V(!!n.isFavorite), O(!!n.isWatched)), u.useEffect(() => {
    y.isDirty ? b.markDirty() : b.markClean();
  });
  const T = u.useCallback(() => {
    aa(), s == null || s();
  }, [s]), $ = u.useCallback(() => b.requestClose(T), [b, T]), H = u.useCallback(() => {
    j((C) => {
      const D = !C;
      try {
        localStorage.setItem(Yt, String(D));
      } catch {
      }
      return D;
    });
  }, []), ce = u.useMemo(
    () => pa(g.assignedCodes),
    [g.assignedCodes]
  ), w = ur(ce), I = u.useMemo(() => {
    var C, D, z, le, pe;
    return {
      subtasks: ((C = n == null ? void 0 : n.subTasks) == null ? void 0 : C.length) ?? 0,
      files: ((D = n == null ? void 0 : n.attachments) == null ? void 0 : D.length) ?? 0,
      dependencies: ((z = n == null ? void 0 : n.predecessorIds) == null ? void 0 : z.length) ?? 0,
      comments: ((le = n == null ? void 0 : n.comments) == null ? void 0 : le.length) ?? 0,
      checklist: ((pe = m.items) == null ? void 0 : pe.length) ?? 0
    };
  }, [n, m.items]), P = Me.find((C) => C.code === N), F = m.items ?? [], U = F.filter((C) => C.isDone).length, ie = F.length ? Math.round(U / F.length * 100) : 0, A = u.useCallback(async () => {
    if (!y.validate())
      return Q.err("Zorunlu alanları kontrol edin."), !1;
    E(!0);
    try {
      return await Promise.resolve(window.apya.platform.tasks.task.update(o, y.toUpdateDto())), await x.invalidateQueries({ queryKey: ["task-detail", o] }), re.emitResult(), K(!0), setTimeout(() => K(!1), 2e3), Q.ok("Görev başarıyla güncellendi."), !0;
    } catch (C) {
      return Q.err((C == null ? void 0 : C.message) || "Kaydedilemedi."), !1;
    } finally {
      E(!1);
    }
  }, [o, y, x]);
  u.useEffect(() => {
    const C = (D) => {
      if ((D.ctrlKey || D.metaKey) && D.key.toLowerCase() === "s") {
        D.preventDefault(), y.isDirty && !S && A();
        return;
      }
      if (D.key === "Escape") {
        if (q) {
          D.stopPropagation(), _(null);
          return;
        }
        W && (D.stopPropagation(), M(!1));
      }
    };
    return window.addEventListener("keydown", C), () => window.removeEventListener("keydown", C);
  }, [A, y.isDirty, S, q, W]);
  const B = () => {
    var C, D, z;
    return (z = (D = (C = window == null ? void 0 : window.apya) == null ? void 0 : C.platform) == null ? void 0 : D.tasks) == null ? void 0 : z.task;
  }, G = async () => {
    var D;
    const C = !J;
    V(C);
    try {
      await Promise.resolve((D = B()) == null ? void 0 : D.toggleFavorite(o));
    } catch (z) {
      V(!C), Q.err((z == null ? void 0 : z.message) || "Favori güncellenemedi.");
    }
  }, te = () => {
    if (!o) return;
    const C = document.createElement("a");
    C.href = `/Tasks/Detail/${o}?handler=Pdf`, C.rel = "noopener", document.body.appendChild(C), C.click(), C.remove();
  }, Z = async () => {
    var D;
    const C = !X;
    O(C);
    try {
      await Promise.resolve((D = B()) == null ? void 0 : D.toggleWatch(o)), Q.info(C ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (z) {
      O(!C), Q.err((z == null ? void 0 : z.message) || "Takip durumu güncellenemedi.");
    }
  }, je = async () => {
    var C, D;
    try {
      const z = await Promise.resolve((C = B()) == null ? void 0 : C.transfer(o, {
        mode: 2,
        // Copy
        targetProjectIds: n != null && n.projectId ? [n.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await x.invalidateQueries({ queryKey: ["task-detail"] }), Q.ok("Görev çoğaltıldı.");
      const le = (D = z == null ? void 0 : z.createdTaskIds) == null ? void 0 : D[0];
      le && l(le);
    } catch (z) {
      Q.err((z == null ? void 0 : z.message) || "Görev çoğaltılamadı.");
    }
  }, xe = async () => {
    var C;
    try {
      await Promise.resolve((C = B()) == null ? void 0 : C.updateStatus(o, 4)), await x.invalidateQueries({ queryKey: ["task-detail", o] }), Q.info("Görev arşivlendi (Tamamlandı).");
    } catch (D) {
      Q.err((D == null ? void 0 : D.message) || "Görev arşivlenemedi.");
    }
  }, va = async () => {
    var C;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?"))
      try {
        await Promise.resolve((C = B()) == null ? void 0 : C.delete(o)), Q.info("Görev silindi."), b.markClean(), T();
      } catch (D) {
        Q.err((D == null ? void 0 : D.message) || "Görev silinemedi.");
      }
  }, ja = async (C) => {
    try {
      await g.addFeature(C), k(C), Q.ok("Özellik başarıyla eklendi.");
    } catch (D) {
      Q.err((D == null ? void 0 : D.message) || "Özellik eklenemedi.");
    }
  }, ft = async (C) => {
    try {
      await g.removeFeature(C), k("general"), Q.info("Özellik görevden kaldırıldı.");
    } catch (D) {
      Q.err((D == null ? void 0 : D.message) || "Özellik kaldırılamadı.");
    }
  }, wa = async (C) => {
    var le, pe, de, Ce, we, Fe, Ee;
    const D = ((Ce = (de = (pe = (le = window == null ? void 0 : window.apya) == null ? void 0 : le.platform) == null ? void 0 : pe.application) == null ? void 0 : de.projects) == null ? void 0 : Ce.project) ?? ((Ee = (Fe = (we = window == null ? void 0 : window.apya) == null ? void 0 : we.platform) == null ? void 0 : Fe.projects) == null ? void 0 : Ee.project);
    if (!(D != null && D.create)) throw new Error("Proje servisi yüklenmedi.");
    const z = await Promise.resolve(D.create({
      name: C,
      code: fr(C),
      currency: "TRY"
    }));
    return await x.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), Q.ok(`“${C}” projesi oluşturuldu.`), (z == null ? void 0 : z.id) ?? z;
  }, Na = async ({ mode: C, targetProjectIds: D, include: z }) => {
    var le, pe;
    try {
      const de = await Promise.resolve((le = B()) == null ? void 0 : le.transfer(o, {
        mode: C === "move" ? 1 : 2,
        targetProjectIds: D,
        include: z
      }));
      await x.invalidateQueries({ queryKey: ["task-detail", o] });
      const Ce = D.map((Fe) => {
        var Ee;
        return (Ee = f.options.find((Ca) => Ca.value === Fe)) == null ? void 0 : Ee.label;
      }).filter(Boolean), we = ((pe = de == null ? void 0 : de.createdTaskIds) == null ? void 0 : pe.length) ?? 0;
      Q.ok(C === "move" ? we ? `“${Ce[0]}” projesine taşındı, ${we} projeye kopyalandı.` : `Görev “${Ce[0]}” projesine taşındı.` : we > 1 ? `${we} projeye kopyalandı.` : `Kopya “${Ce[0]}” projesinde oluşturuldu.`), _(null);
    } catch (de) {
      Q.err((de == null ? void 0 : de.message) || "Transfer tamamlanamadı.");
    }
  }, ka = N === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)] gap-5 items-start", children: [
    /* @__PURE__ */ e.jsx(
      Ys,
      {
        task: n,
        onFieldChange: y.setField,
        descriptionValue: y.values.description,
        checklist: m,
        currentUserName: ((yt = (gt = window == null ? void 0 : window.abp) == null ? void 0 : gt.currentUser) == null ? void 0 : yt.name) || ((jt = (vt = window == null ? void 0 : window.abp) == null ? void 0 : vt.currentUser) == null ? void 0 : jt.userName) || "Ben"
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5", children: /* @__PURE__ */ e.jsx(Fs, { task: n, nameById: c.nameById }) })
  ] }) : Js(N) ? /* @__PURE__ */ e.jsx(
    Ut,
    {
      code: N,
      onRemoveFeature: ft,
      onOpenPicker: () => M(!0),
      canRemove: !(P != null && P.isCore)
    }
  ) : /* @__PURE__ */ e.jsx(u.Suspense, { fallback: /* @__PURE__ */ e.jsx(be, { className: "h-48 w-full" }), children: P != null && P.component ? /* @__PURE__ */ e.jsx(
    P.component,
    {
      taskId: o,
      task: n,
      onOpenSubtask: Y
    }
  ) : /* @__PURE__ */ e.jsx(
    Ut,
    {
      code: N,
      onRemoveFeature: ft,
      onOpenPicker: () => M(!0),
      canRemove: !(P != null && P.isCore)
    }
  ) }), bt = i ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(be, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(be, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(be, { className: "h-64 w-full" })
  ] }) : p ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(ae, { variant: "ghost", onClick: () => d(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col flex-1 min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      zs,
      {
        task: n,
        presentation: a,
        onClose: $,
        isFullscreen: ee,
        onToggleFullscreen: H,
        onFieldChange: y.setField,
        statusValue: y.values.status,
        titleValue: n == null ? void 0 : n.title,
        isPrivateValue: y.values.isPrivate,
        isFavorite: J,
        onToggleFavorite: G,
        isWatched: X,
        onToggleWatch: Z,
        onDuplicate: je,
        onArchive: xe,
        onDelete: va,
        onOpenTransfer: (C) => _({ mode: C }),
        onSaveAsTemplate: () => Q.info("Şablon olarak kaydetme yakında."),
        onConvertToSubtask: () => Q.info("Alt göreve dönüştürme yakında."),
        onExportPdf: te
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        Ks,
        {
          task: n,
          assigneeOptions: c.options,
          projectOptions: f.options,
          onFieldChange: y.setField,
          statusValue: y.values.status,
          priorityValue: y.values.priority,
          assigneeValue: y.values.assigneeId,
          projectValue: y.values.projectId,
          dueDateValue: y.values.dueDate,
          startDateValue: y.values.startDate,
          tagsValue: y.values.tagNames,
          progressPercent: ie,
          progressNote: `${U}/${F.length} madde`,
          onOpenTransfer: (C) => _({ mode: C })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        a === "page" && /* @__PURE__ */ e.jsx(
          Ms,
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
            counts: I
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: a === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            Rs,
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
              counts: I,
              isDirty: y.isDirty
            }
          ) }),
          /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised", children: ka })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(
      Hs,
      {
        lastSavedAt: n == null ? void 0 : n.lastModificationTime,
        isDirty: y.isDirty,
        isSaving: S,
        justSaved: R,
        onCancel: $,
        onSave: A
      }
    )
  ] }), ht = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      er,
      {
        open: W,
        onClose: () => M(!1),
        assignedCodes: g.assignedCodes,
        onAddFeature: ja,
        onGoToTab: k
      }
    ),
    /* @__PURE__ */ e.jsx(
      sr,
      {
        open: !!q,
        mode: (q == null ? void 0 : q.mode) ?? "move",
        onClose: () => _(null),
        onConfirm: Na,
        projectOptions: f.options,
        currentProjectId: y.values.projectId,
        counts: I,
        onCreateProject: wa
      }
    ),
    L && /* @__PURE__ */ e.jsx(
      cr,
      {
        subtaskId: L,
        parentCode: n == null ? void 0 : n.code,
        onClose: () => Y(null),
        onOpenFull: (C) => {
          Y(null), (r ?? l)(C);
        },
        onDeleted: () => x.invalidateQueries({ queryKey: ["task-detail", o] }),
        currentUserName: ((Nt = (wt = window == null ? void 0 : window.abp) == null ? void 0 : wt.currentUser) == null ? void 0 : Nt.name) || ((Ct = (kt = window == null ? void 0 : window.abp) == null ? void 0 : kt.currentUser) == null ? void 0 : Ct.userName) || "Ben"
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col w-full min-h-[calc(100vh-54px)] border-y border-subtle bg-surface-base", children: bt }),
    ht
  ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(Zt, { open: !0, onOpenChange: (C) => {
      C || $();
    }, children: /* @__PURE__ */ e.jsx(
      Wt,
      {
        title: n != null && n.title ? `Görev Detayı: ${n.title}` : "Görev Detayı",
        fullscreen: ee,
        className: ee ? "p-0 rounded-xl border border-default shadow-xl short:h-[100svh]" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl short:h-[100svh]",
        onInteractOutside: (C) => {
          var D, z;
          C.preventDefault(), !(W || q || L) && ((z = (D = C.target) == null ? void 0 : D.closest) != null && z.call(D, "[data-apya-overlay]") || $());
        },
        onEscapeKeyDown: (C) => {
          if (W || q || L) {
            C.preventDefault();
            return;
          }
          C.preventDefault(), $();
        },
        children: bt
      }
    ) }),
    ht
  ] });
}
function br() {
  var a;
  const t = u.useSyncExternalStore(
    re.subscribe,
    re.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(He, { children: /* @__PURE__ */ e.jsx(
    ga,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        re.close(), re.emitResult();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(He, { children: /* @__PURE__ */ e.jsx(
    ma,
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
function ya() {
  var s;
  try {
    const r = new URLSearchParams(window.location.search).get("taskui");
    if (r === "v1" || r === "v2" || r === "v3") return r;
  } catch {
  }
  const t = document.getElementById("task-detail-island"), a = (s = t == null ? void 0 : t.dataset) == null ? void 0 : s.taskui;
  return a === "v1" || a === "v2" ? a : "v3";
}
function hr() {
  return ya() === "v2";
}
function gr() {
  return ya() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = gr();
window.apya.taskDetailV2Enabled = hr() && !window.apya.taskDetailV3Enabled;
const Ht = {
  open: (t) => {
    re.open(t);
  },
  close: () => re.close(),
  onResult: (t) => re.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(Ht) : window.apya.taskDetail = Ht;
function Vt() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = Qt(t), t._reactRoot.render(/* @__PURE__ */ e.jsx(br, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = ta();
    a && re.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Vt) : Vt();
function yr({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(He, { children: /* @__PURE__ */ e.jsx(
    ga,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(He, { children: /* @__PURE__ */ e.jsx(
    ma,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) });
}
const rt = document.getElementById("task-detail-page-island");
if (rt) {
  const t = rt.getAttribute("data-task-id");
  t && Qt(rt).render(/* @__PURE__ */ e.jsx(yr, { taskId: t }));
}
