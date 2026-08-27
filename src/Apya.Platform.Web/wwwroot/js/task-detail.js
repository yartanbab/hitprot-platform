import { j as e, r as x, d as Le, b as _t } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { a as He } from "./QueryProvider-AIUp_Zk5.js";
import { u as ie, a as le, b as ue } from "./query-vendor-Bf69L2iP.js";
import { D as Ht, i as Vt, g as st, B as ae, I as Se, S as be } from "./Dialog-BdNKdiS6.js";
import { C as Na } from "./Combobox-Cgzidxen.js";
import { r as ka } from "./httpClient-CRlyQ1eg.js";
import { R as he, T as ge, P as ye, C as ve, A as Ca, a as Qt, D as Ta, b as Da, c as Sa, d as $a, e as Ea } from "./ui-vendor-DaE-uom6.js";
function Pa({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: l,
  footer: i,
  children: n
}) {
  return /* @__PURE__ */ e.jsx(
    Ht,
    {
      open: t,
      onOpenChange: (o) => {
        o || a();
      },
      children: /* @__PURE__ */ e.jsx(
        Vt,
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
            l,
            /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: n }),
            i
          ] })
        }
      )
    }
  );
}
function Ia({ title: t, header: a, footer: s, children: r }) {
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
function Aa({ isPrivate: t }) {
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
function La({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: l,
  fullscreen: i = !1
}) {
  const [n, o] = x.useState(!1), p = x.useRef(null);
  x.useEffect(() => {
    if (!n) return;
    const m = (y) => {
      p.current && !p.current.contains(y.target) && o(!1);
    }, f = (y) => {
      y.key === "Escape" && o(!1);
    };
    return document.addEventListener("mousedown", m), document.addEventListener("keydown", f), () => {
      document.removeEventListener("mousedown", m), document.removeEventListener("keydown", f);
    };
  }, [n]);
  const d = rt[t == null ? void 0 : t.status] ?? rt[1], c = nt[t == null ? void 0 : t.priority] ?? nt[2], u = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), o(!1);
  }, b = () => {
    var f, y, g, k;
    const m = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (f = navigator.clipboard) == null || f.writeText(m), (k = (g = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : g.info) == null || k.call(g, "Bağlantı kopyalandı."), o(!1);
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
        /* @__PURE__ */ e.jsx(Aa, { isPrivate: t == null ? void 0 : t.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": i ? "Küçült" : "Tam ekrana büyüt",
          onClick: l,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: i ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
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
            onClick: () => o((m) => !m),
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
const Ba = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function za({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: l }) {
  const i = Ba(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: i ? `Son kayıt: ${i}` : " " }),
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
const kt = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Ka = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function me({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function Ra({ value: t, onChange: a }) {
  const [s, r] = x.useState(""), l = () => {
    const i = s.trim();
    i && !t.includes(i) && a([...t, i]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((i) => /* @__PURE__ */ e.jsxs(st, { variant: "neutral", children: [
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
          i.key === "Enter" || i.key === "," ? (i.preventDefault(), l()) : i.key === "Backspace" && !s && t.length && a(t.slice(0, -1));
        },
        onBlur: l,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function Ma({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: l = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(me, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      Se,
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
          className: kt,
          children: Object.entries(rt).map(([i, n]) => /* @__PURE__ */ e.jsx("option", { value: i, children: n.text }, i))
        }
      ) }),
      /* @__PURE__ */ e.jsx(me, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (i) => s("priority", Number(i.target.value)),
          className: kt,
          children: Object.entries(nt).map(([i, n]) => /* @__PURE__ */ e.jsx("option", { value: i, children: n.text }, i))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(me, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      Na,
      {
        id: "task-assignee",
        options: r,
        value: t.assigneeId,
        onChange: (i) => s("assigneeId", i),
        placeholder: l ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: l
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(me, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        Se,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (i) => s("startDate", i.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(me, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
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
    /* @__PURE__ */ e.jsx(me, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(Ra, { value: t.tagNames, onChange: (i) => s("tagNames", i) }) }),
    /* @__PURE__ */ e.jsx(me, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (i) => s("description", i.target.value),
        className: Ka
      }
    ) })
  ] });
}
const Ct = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function Pe({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function Fa({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(Pe, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(Pe, { label: "Oluşturulma zamanı", value: Ct(t.creationTime) }),
      /* @__PURE__ */ e.jsx(Pe, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(Pe, { label: "Son güncelleme zamanı", value: Ct(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(Pe, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const Ga = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", Oa = "border-brand-500 text-text-primary";
function qa({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: l }) {
  const i = x.useRef(/* @__PURE__ */ new Map()), n = (p) => {
    var d;
    s(p.code), (d = i.current.get(p.code)) == null || d.focus();
  }, o = (p, d) => {
    p.key === "ArrowRight" ? (p.preventDefault(), n(t[(d + 1) % t.length])) : p.key === "ArrowLeft" ? (p.preventDefault(), n(t[(d - 1 + t.length) % t.length])) : p.key === "Home" ? (p.preventDefault(), n(t[0])) : p.key === "End" && (p.preventDefault(), n(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((p, d) => {
      const c = p.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (u) => {
            u ? i.current.set(p.code, u) : i.current.delete(p.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${p.code}`,
          "aria-selected": c,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: c ? 0 : -1,
          onClick: () => s(p.code),
          onKeyDown: (u) => o(u, d),
          className: `${Ga} ${c ? Oa : ""}`,
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
const Ya = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Ua({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [l, i] = x.useState(""), n = x.useMemo(() => {
    const o = l.trim().toLocaleLowerCase("tr-TR"), p = o ? t.filter((c) => c.title.toLocaleLowerCase("tr-TR").includes(o)) : t, d = /* @__PURE__ */ new Map();
    return p.forEach((c) => {
      const u = d.get(c.category) ?? [];
      u.push(c), d.set(c.category, u);
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
          Se,
          {
            autoFocus: !0,
            value: l,
            onChange: (o) => i(o.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          n.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...n.entries()].map(([o, p]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: Ya[o] ?? o }),
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
          ] }, o))
        ] })
      ]
    }
  );
}
function _a({ trail: t = [], current: a, onNavigate: s }) {
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
function Ha(t) {
  var s, r, l;
  const a = (l = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : l.task;
  return a ? Promise.resolve(a.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ct(t) {
  return ie({
    queryKey: ["task-detail", t],
    queryFn: () => Ha(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function Zt(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
function Wt() {
  const [t, a] = x.useState(!1), [s, r] = x.useState(!1), l = x.useRef(null), i = x.useCallback(() => a(!0), []), n = x.useCallback(() => a(!1), []);
  x.useEffect(() => {
    if (!t) return;
    const d = (c) => {
      c.preventDefault(), c.returnValue = "";
    };
    return window.addEventListener("beforeunload", d), () => window.removeEventListener("beforeunload", d);
  }, [t]);
  const o = x.useCallback((d) => {
    if (!t) {
      d == null || d();
      return;
    }
    l.current = d ?? null, r(!0);
  }, [t]), p = x.useCallback((d) => {
    const c = l.current;
    return r(!1), l.current = null, d === "discard" && (a(!1), c == null || c()), d === "save" ? c : null;
  }, []);
  return { isDirty: t, markDirty: i, markClean: n, requestClose: o, pendingClose: s, resolvePendingClose: p };
}
const Va = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, dt = "task";
function Jt() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(dt);
  return t && Va.test(t) ? t : null;
}
function Xt() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(dt), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function ea(t, a) {
  const s = x.useRef(a);
  s.current = a, x.useEffect(() => {
    if (!t || Jt() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(dt, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), x.useEffect(() => {
    const r = () => {
      var l;
      (l = s.current) == null || l.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const Qa = {
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
function Za(t) {
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
  } : Qa;
}
function ta(t) {
  const [a, s] = x.useState(t == null ? void 0 : t.id), r = x.useMemo(() => Za(t), [t]), [l, i] = x.useState(r), [n, o] = x.useState({});
  (t == null ? void 0 : t.id) !== a && (s(t == null ? void 0 : t.id), i(r), o({}));
  const p = x.useCallback((m, f) => {
    i((y) => ({ ...y, [m]: f }));
  }, []), d = x.useMemo(
    () => JSON.stringify(l) !== JSON.stringify(r),
    [l, r]
  ), c = x.useCallback(() => {
    const m = {};
    return l.title.trim() || (m.title = "Başlık zorunlu."), l.startDate || (m.startDate = "Başlangıç tarihi zorunlu."), l.dueDate && l.startDate && l.dueDate < l.startDate && (m.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), o(m), Object.keys(m).length === 0;
  }, [l]), u = x.useCallback(() => ({
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
  }), [l, t]), b = x.useCallback(() => {
    i(r), o({});
  }, [r]);
  return { values: l, setField: p, isDirty: d, errors: n, validate: c, toUpdateDto: u, reset: b };
}
function Tt(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function Wa() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function aa() {
  var l;
  const t = ie({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Wa,
    staleTime: 3e5,
    retry: !1
  }), a = ((l = t.data) == null ? void 0 : l.items) ?? [], s = a.map((i) => ({ value: i.id, label: Tt(i) })), r = new Map(a.map((i) => [i.id, Tt(i)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function it() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Ja(t) {
  const a = it();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function sa(t) {
  const a = le(), s = ["task-features", t], r = ie({
    queryKey: s,
    queryFn: () => Ja(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), i = ue({
    mutationFn: (o) => Promise.resolve(it().addFeature(t, o)),
    onSuccess: l
  }), n = ue({
    mutationFn: (o) => Promise.resolve(it().removeFeature(t, o)),
    onSuccess: l
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
const Ve = {
  0: { label: "İptal", icon: "fa-ban", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  1: { label: "Yapılacak", icon: "fa-clock", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  2: { label: "Sürüyor", icon: "fa-spinner", bg: "bg-warning-subtle", fg: "text-warning", dot: "bg-warning" },
  3: { label: "Testte", icon: "fa-flask", bg: "bg-primary-subtle", fg: "text-primary", dot: "bg-primary" },
  4: { label: "Tamamlandı", icon: "fa-circle-check", bg: "bg-success-subtle", fg: "text-success", dot: "bg-success" }
}, lt = {
  1: { label: "Düşük", icon: "fa-arrow-down", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  2: { label: "Orta", icon: "fa-minus", bg: "bg-warning-subtle", fg: "text-warning" },
  3: { label: "Yüksek", icon: "fa-arrow-up", bg: "bg-negative-subtle", fg: "text-negative" },
  4: { label: "Kritik", icon: "fa-flag", bg: "bg-negative-subtle", fg: "text-negative" }
}, ra = [1, 2, 3, 4], Xa = [1, 2, 3, 4], ze = (t) => Ve[t] ?? Ve[1], na = (t) => lt[t] ?? lt[2];
function Ke(t) {
  if (!t) return "—";
  const a = String(t).trim().split(/\s+/).filter(Boolean);
  return a.length ? (a.length > 1 ? a[0][0] + a[a.length - 1][0] : a[0].slice(0, 2)).toUpperCase() : "—";
}
function Re(t) {
  return t ? "var(--apya-brand-500)" : "var(--apya-neutral-500)";
}
function es(t, a = /* @__PURE__ */ new Date()) {
  if (!t) return { tone: "text-text-tertiary", hint: "" };
  const s = new Date(t);
  if (Number.isNaN(s.getTime())) return { tone: "text-text-tertiary", hint: "" };
  const r = Math.ceil((s.setHours(0, 0, 0, 0) - new Date(a).setHours(0, 0, 0, 0)) / 864e5);
  return r < 0 ? { tone: "text-negative", hint: `${Math.abs(r)} gün gecikti` } : r === 0 ? { tone: "text-warning", hint: "Bugün" } : r <= 3 ? { tone: "text-warning", hint: `${r} gün kaldı` } : { tone: "text-text-tertiary", hint: `${r} gün kaldı` };
}
const $e = "rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden";
function ot({ title: t, badge: a, action: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3.5 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: t }),
      a
    ] }),
    s
  ] });
}
function ts({ children: t, tone: a = "positive" }) {
  const s = a === "positive" ? "bg-success-subtle text-success" : "bg-neutral-subtle text-text-secondary";
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-full font-mono text-[11px] font-bold ${s}`, children: t });
}
function Qe({ children: t, bg: a, fg: s }) {
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-[7px] text-[10.5px] font-bold ${a} ${s}`, children: t });
}
function Be({ icon: t, title: a, description: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 px-6 py-10 text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-xl text-text-tertiary` }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: a }),
    s && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] leading-[1.55] text-text-tertiary max-w-[420px]", children: s })
  ] });
}
function ia({ name: t, size: a = 24 }) {
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
const la = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—", Dt = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function as(t) {
  return t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toFixed(1)} MB` : "0 KB";
}
function Ze(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = Math.floor(a / 3600), r = Math.floor(a % 3600 / 60);
  return !s && !r ? `${a}sn` : s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function ss(t) {
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
function rs(t = "") {
  var s;
  const a = ((s = t.split(".").pop()) == null ? void 0 : s.toLowerCase()) ?? "";
  return a === "pdf" ? Ne.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(a) ? Ne.image : ["doc", "docx", "odt", "rtf", "txt"].includes(a) ? Ne.doc : ["xls", "xlsx", "csv", "ods"].includes(a) ? Ne.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(a) ? Ne.code : ["zip", "rar", "7z", "tar", "gz"].includes(a) ? Ne.zip : Ne.other;
}
function ns({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, l] = x.useState(""), [i, n] = x.useState(!1), o = le(), p = (a == null ? void 0 : a.subTasks) ?? [], d = p.filter((m) => m.status === 4).length, c = () => o.invalidateQueries({ queryKey: ["task-detail", t] }), u = async () => {
    var f, y, g;
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
      } catch (k) {
        (g = (y = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : y.error) == null || g.call(y, (k == null ? void 0 : k.message) || "Alt görev eklenemedi.");
      } finally {
        n(!1);
      }
    }
  }, b = async (m, f) => {
    var y, g, k;
    m.stopPropagation();
    try {
      await Promise.resolve(window.apya.platform.tasks.task.updateStatus(f.id, f.status === 4 ? 1 : 4)), await c();
    } catch (S) {
      (k = (g = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : g.error) == null || k.call(g, (S == null ? void 0 : S.message) || "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        p.length > 0 && /* @__PURE__ */ e.jsxs(ts, { children: [
          d,
          "/",
          p.length
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
      p.map((m) => {
        const f = ze(m.status), y = m.status === 4;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => s == null ? void 0 : s(m.id, m.title),
            onKeyDown: (g) => {
              g.key === "Enter" && (s == null || s(m.id, m.title));
            },
            className: "flex items-center gap-3.5 px-4 py-3.5 border-t border-subtle first:border-t-0 hover:bg-surface-raised cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": `${m.title} tamamlandı işaretle`,
                  onClick: (g) => b(g, m),
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white cursor-pointer ${y ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: y && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: m.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${y ? "line-through text-text-tertiary" : "text-text-primary"}`, children: m.title }),
              /* @__PURE__ */ e.jsx(Qe, { bg: f.bg, fg: f.fg, children: f.label }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: la(m.dueDate) }),
              /* @__PURE__ */ e.jsx(ia, { name: m.assigneeName }),
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
            m.key === "Enter" && u();
          },
          disabled: i,
          placeholder: "Yeni alt görev başlığı",
          className: "w-full h-9 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      ) })
    ] }),
    p.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz alt görev yok." })
  ] });
}
function oa() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function is(t) {
  const a = oa();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function ls(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, l = ka();
  l && (r.RequestVerificationToken = l);
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
function ca(t) {
  const a = le(), s = ["task-attachments", t], r = ie({
    queryKey: s,
    queryFn: () => is(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), i = ue({
    mutationFn: (o) => ls(t, o),
    onSuccess: l
  }), n = ue({
    mutationFn: (o) => Promise.resolve(oa().deleteAttachment(o)),
    onSuccess: l
  });
  return {
    attachments: r.data ?? [],
    isLoading: r.isLoading,
    upload: i.mutateAsync,
    remove: n.mutateAsync,
    isUploading: i.isPending
  };
}
function os({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: l } = ca(t), i = x.useRef(null), [n, o] = x.useState(!1), p = async (c) => {
    var u, b, m, f, y, g;
    if (c)
      try {
        await s(c), (m = (b = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : b.success) == null || m.call(b, "Dosya yüklendi.");
      } catch (k) {
        (g = (y = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : y.error) == null || g.call(y, (k == null ? void 0 : k.message) || "Dosya yüklenemedi.");
      } finally {
        i.current && (i.current.value = "");
      }
  }, d = async (c, u) => {
    var b, m, f;
    try {
      await r(c);
    } catch (y) {
      (f = (m = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : m.error) == null || f.call(m, (y == null ? void 0 : y.message) || `${u} silinemedi.`);
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
          return p((u = c.target.files) == null ? void 0 : u[0]);
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
          return (c = i.current) == null ? void 0 : c.click();
        },
        onKeyDown: (c) => {
          var u;
          c.key === "Enter" && ((u = i.current) == null || u.click());
        },
        onDragOver: (c) => {
          c.preventDefault(), n || o(!0);
        },
        onDragLeave: () => o(!1),
        onDrop: (c) => {
          var u, b;
          c.preventDefault(), o(!1), p((b = (u = c.dataTransfer) == null ? void 0 : u.files) == null ? void 0 : b[0]);
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
      const u = rs(c.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${u.bg} ${u.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: c.fileName, children: c.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: as(c.fileSize) })
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
function Ue() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function cs(t) {
  const a = Ue();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function xt(t) {
  const a = le(), s = ["task-checklist", t], r = ie({
    queryKey: s,
    queryFn: () => cs(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), i = ue({
    mutationFn: (p) => Promise.resolve(Ue().addChecklistItem(t, p)),
    onSuccess: l
  }), n = ue({
    mutationFn: (p) => Promise.resolve(Ue().toggleChecklistItem(p)),
    onSuccess: l
  }), o = ue({
    mutationFn: (p) => Promise.resolve(Ue().deleteChecklistItem(p)),
    onSuccess: l
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: i.mutateAsync,
    toggleItem: n.mutateAsync,
    removeItem: o.mutateAsync
  };
}
function ds({ taskId: t }) {
  const { items: a, addItem: s, toggleItem: r, removeItem: l } = xt(t), [i, n] = x.useState(""), o = async () => {
    var u, b, m;
    const c = i.trim();
    if (c)
      try {
        await s(c), n("");
      } catch (f) {
        (m = (b = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : b.error) == null || m.call(b, (f == null ? void 0 : f.message) || "Madde eklenemedi.");
      }
  }, p = async (c) => {
    var u, b, m;
    try {
      await r(c);
    } catch (f) {
      (m = (b = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : b.error) == null || m.call(b, (f == null ? void 0 : f.message) || "Madde güncellenemedi.");
    }
  }, d = async (c, u) => {
    var b, m, f;
    try {
      await l(c);
    } catch (y) {
      (f = (m = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : m.error) == null || f.call(m, (y == null ? void 0 : y.message) || `${u} silinemedi.`);
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
            c.key === "Enter" && o();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ e.jsx(ae, { variant: "secondary", onClick: o, disabled: !i.trim(), children: "Ekle" })
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
function xs({ taskId: t, task: a }) {
  const [s, r] = x.useState(""), [l, i] = x.useState(null), [n, o] = x.useState(""), [p, d] = x.useState(!1), c = le(), u = (a == null ? void 0 : a.comments) ?? [], b = async (f) => {
    var y, g, k, S, P, G;
    if (f == null || f.preventDefault(), !(!s.trim() || p)) {
      d(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), c.invalidateQueries({ queryKey: ["task-detail", t] }), (k = (g = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : g.success) == null || k.call(g, "Yorum eklendi.");
      } catch (K) {
        (G = (P = (S = window == null ? void 0 : window.abp) == null ? void 0 : S.notify) == null ? void 0 : P.error) == null || G.call(P, (K == null ? void 0 : K.message) || "Yorum eklenemedi.");
      } finally {
        d(!1);
      }
    }
  }, m = async (f) => {
    var y, g, k, S, P, G;
    if (!(!n.trim() || p)) {
      d(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(f, n.trim())
        ), o(""), i(null), c.invalidateQueries({ queryKey: ["task-detail", t] }), (k = (g = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : g.success) == null || k.call(g, "Yanıt eklendi.");
      } catch (K) {
        (G = (P = (S = window == null ? void 0 : window.abp) == null ? void 0 : S.notify) == null ? void 0 : P.error) == null || G.call(P, (K == null ? void 0 : K.message) || "Yanıt eklenemedi.");
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
    u.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: u.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
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
          onClick: () => i(l === f.id ? null : f.id),
          children: "Yanıtla"
        }
      ) }),
      l === f.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: n,
            onChange: (y) => o(y.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(ae, { variant: "ghost", size: "sm", onClick: () => i(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(ae, { variant: "primary", size: "sm", disabled: !n.trim() || p, onClick: () => m(f.id), children: "Gönder" })
        ] })
      ] }),
      f.replies && f.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: f.replies.map((y) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: y.creatorUserName || y.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: y.creationTime ? new Date(y.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: y.text })
      ] }, y.id)) })
    ] }, f.id)) })
  ] });
}
function us({ task: t }) {
  var s;
  const a = [];
  return t != null && t.creationTime && a.push({
    id: "created",
    icon: "fa-plus",
    bg: "bg-success-subtle",
    fg: "text-success",
    actor: t.creatorUserName || t.creatorName || "Sistem / Kullanıcı",
    event: "görevi oluşturdu",
    time: Dt(t.creationTime)
  }), t != null && t.lastModificationTime && a.push({
    id: "modified",
    icon: "fa-pen",
    bg: "bg-warning-subtle",
    fg: "text-warning",
    actor: t.lastModifierUserName || t.lastModifierName || "Kullanıcı",
    event: "görevi güncelledi",
    time: Dt(t.lastModificationTime)
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
      const i = l === a.length - 1;
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
function ps({ task: t }) {
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
function We({ label: t, value: a, tone: s, note: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: `font-mono text-[22px] font-bold tracking-[-.02em] ${s}`, style: { fontVariantNumeric: "tabular-nums" }, children: a }),
    r && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
  ] });
}
function ms({ task: t }) {
  const a = (t == null ? void 0 : t.expenses) || [], s = (t == null ? void 0 : t.incomes) || [];
  if (a.length === 0 && s.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
      /* @__PURE__ */ e.jsx(ot, { title: "Görev Finansı" }),
      /* @__PURE__ */ e.jsx(
        Be,
        {
          icon: "fa-coins",
          title: "Kayıt yok",
          description: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
        }
      )
    ] });
  const l = Array.from(new Set([...a, ...s].map((n) => n.currency || "TRY"))).map((n) => {
    const o = s.filter((d) => (d.currency || "TRY") === n).reduce((d, c) => d + (c.amount || 0), 0), p = a.filter((d) => (d.currency || "TRY") === n).reduce((d, c) => d + (c.amount || 0), 0);
    return { cur: n, inc: o, exp: p, net: o - p };
  }), i = [
    ...s.map((n) => ({ ...n, kind: "income" })),
    ...a.map((n) => ({ ...n, kind: "expense" }))
  ].sort((n, o) => new Date(o.date || 0) - new Date(n.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    l.map(({ cur: n, inc: o, exp: p, net: d }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(We, { label: `Toplam Gelir (${n})`, value: Ge(o, n), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(We, { label: `Toplam Gider (${n})`, value: Ge(p, n), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        We,
        {
          label: `Net Bakiye (${n})`,
          value: Ge(d, n),
          tone: d >= 0 ? "text-success" : "text-negative",
          note: d >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, n)),
    /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
      /* @__PURE__ */ e.jsx(ot, { title: "Finans kalemleri" }),
      i.map((n) => /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-7 w-7 rounded-lg bg-neutral-subtle text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n.kind === "income" ? "fa-arrow-down" : "fa-arrow-up"} text-[11px]` }) }),
            /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] font-semibold text-text-primary", children: n.title || (n.kind === "income" ? "Gelir" : "Gider") }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: la(n.date) }),
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
const fs = {
  0: "bg-neutral-400",
  1: "bg-text-tertiary",
  2: "bg-warning",
  3: "bg-primary",
  4: "bg-success"
};
function Je(t) {
  if (!t) return null;
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? null : a;
}
const Ie = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
function bs({ task: t = {} }) {
  const a = x.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((n, o) => ({
    id: n.id || `row-${o}`,
    name: n.title || "Başlıksız görev",
    isMain: !!n.__main,
    start: Je(n.startDate),
    end: Je(n.dueDate) || Je(n.completedDate),
    status: n.status ?? 1
  })), [t]), { min: s, span: r } = x.useMemo(() => {
    const i = a.flatMap((p) => [p.start, p.end]).filter(Boolean).map((p) => p.getTime());
    if (i.length === 0) return { min: null, span: 0 };
    const n = Math.min(...i), o = Math.max(...i);
    return { min: n, span: Math.max(1, o - n) };
  }, [a]), l = x.useMemo(() => s === null ? [] : [0, 1, 2, 3].map((i) => new Date(s + r * i / 4)), [s, r]);
  return s === null ? /* @__PURE__ */ e.jsx("div", { className: $e, children: /* @__PURE__ */ e.jsx(
    Be,
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-4 gap-0 pl-[170px] mb-2 lt-860:pl-[110px]", children: l.map((i, n) => /* @__PURE__ */ e.jsx(
      "span",
      {
        className: "pl-2 border-l border-subtle text-[10.5px] font-bold uppercase tracking-[.06em] text-text-tertiary",
        children: Ie(i)
      },
      n
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: a.map((i) => {
      const n = i.start ? i.start.getTime() : s, o = i.end ? Math.max(i.end.getTime(), n) : n, p = (n - s) / r * 100, d = Math.max(2, (o - n) / r * 100), c = Math.max(1, Math.round((o - n) / 864e5));
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
            className: `absolute top-[7px] bottom-[7px] flex items-center px-2.5 rounded-[7px] shadow-xs ${fs[i.status] || "bg-primary"}`,
            style: { left: `${p}%`, width: `${d}%` },
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
function St({ icon: t, iconTone: a, title: s, note: r, children: l }) {
  return /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[12px] ${a}` }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: s }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
    ] }),
    l
  ] });
}
function hs({ task: t = {} }) {
  const a = le(), s = t.predecessorIds || [], r = () => {
    var p, d, c;
    return (c = (d = (p = window == null ? void 0 : window.apya) == null ? void 0 : p.platform) == null ? void 0 : d.tasks) == null ? void 0 : c.task;
  }, { data: l = [], isLoading: i } = ie({
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
    var d, c, u, b, m, f;
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
        predecessorIds: s.filter((y) => y !== p),
        tagNames: (t.tags ?? []).map((y) => y.name),
        estimatedHours: t.estimatedHours ?? null,
        taskType: t.taskType ?? null,
        sprint: t.sprint ?? null
      })), await a.invalidateQueries({ queryKey: ["task-detail", t.id] }), (u = (c = (d = window == null ? void 0 : window.abp) == null ? void 0 : d.notify) == null ? void 0 : c.info) == null || u.call(c, "Bağlantı kaldırıldı.");
    } catch (y) {
      (f = (m = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : m.error) == null || f.call(m, (y == null ? void 0 : y.message) || "Bağlantı kaldırılamadı.");
    }
  }, o = (p) => {
    var d, c, u;
    return (u = (c = (d = window == null ? void 0 : window.apya) == null ? void 0 : d.taskDetail) == null ? void 0 : c.open) == null ? void 0 : u.call(c, p);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsx(
      St,
      {
        icon: "fa-arrow-left-long",
        iconTone: "text-warning",
        title: "Öncül görevler",
        note: "bu görev başlamadan tamamlanmalı",
        children: s.length === 0 ? /* @__PURE__ */ e.jsx(Be, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : i ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : l.map((p) => {
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
                    onClick: () => o(p.id),
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
      St,
      {
        icon: "fa-arrow-right-long",
        iconTone: "text-primary",
        title: "Ardıl görevler",
        note: "bu görev bitince başlar",
        children: /* @__PURE__ */ e.jsx(
          Be,
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
function gs(t) {
  const a = le(), s = ["task-timelogs", t], r = ["task-active-timelog"], l = ie({
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
  }, o = ue({
    mutationFn: () => {
      var d;
      return Promise.resolve((d = Te()) == null ? void 0 : d.startTimeTracking(t));
    },
    onSuccess: n
  }), p = ue({
    mutationFn: () => {
      var d;
      return Promise.resolve((d = Te()) == null ? void 0 : d.stopTimeTracking(t));
    },
    onSuccess: n
  });
  return {
    logs: l.data ?? [],
    isLoading: l.isLoading,
    activeLog: i.data ?? null,
    start: o.mutateAsync,
    stop: p.mutateAsync,
    isMutating: o.isPending || p.isPending
  };
}
function $t(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function ys({ taskId: t, task: a = {} }) {
  const s = gs(t), r = s.activeLog && s.activeLog.taskId === t ? s.activeLog : null, [l, i] = x.useState(() => Date.now());
  x.useEffect(() => {
    if (!r) return;
    const f = setInterval(() => i(Date.now()), 1e3);
    return () => clearInterval(f);
  }, [r]);
  const n = r ? Math.max(0, Math.floor((l - new Date(r.startTime).getTime()) / 1e3)) : 0, p = s.logs.reduce((f, y) => f + (y.secondsSpent || 0), 0) + n, d = (a == null ? void 0 : a.estimatedHours) ?? null, c = d ? d * 3600 : 0, u = c ? Math.min(100, Math.round(p / c * 100)) : 0, b = c ? Math.max(0, c - p) : 0, m = async () => {
    var f, y, g;
    try {
      r ? await s.stop() : await s.start();
    } catch (k) {
      (g = (y = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : y.error) == null || g.call(y, (k == null ? void 0 : k.message) || "Zaman takibi güncellenemedi.");
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
              children: ss(p)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary", children: r ? "Kayıt sürüyor" : "Sayaç duraklatıldı" })
        ] })
      ] }),
      c > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] font-bold text-text-secondary", children: "Tahmin kullanımı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
            Ze(p),
            " / ",
            d,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-warning", style: { width: `${u}%` } }) }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "Kalan tahmini süre: ",
          Ze(b)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
      /* @__PURE__ */ e.jsx(ot, { title: "Zaman kayıtları" }),
      s.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : s.logs.length === 0 ? /* @__PURE__ */ e.jsx(
        Be,
        {
          icon: "fa-stopwatch",
          title: "Henüz zaman kaydı yok",
          description: "Soldaki yeşil düğmeyle sayacı çalıştırın; durdurduğunuzda kayıt buraya düşer."
        }
      ) : s.logs.map((f) => {
        const y = !f.endTime;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
            children: [
              /* @__PURE__ */ e.jsx(ia, { name: f.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: f.note || f.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                $t(f.startTime),
                " → ",
                y ? "sürüyor" : $t(f.endTime)
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary", children: y ? "Aktif" : Ze(f.secondsSpent || 0) })
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
    component: ns
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
    component: os
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
    component: ds
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
    component: bs
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
    component: hs
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
    component: ms
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
    component: ps
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
    component: us
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
    component: xs
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
    component: ys
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
function da(t = []) {
  const a = new Set(t);
  return Me.filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function vs(t = []) {
  const a = new Set(t);
  return Me.filter((s) => !s.isCore).filter((s) => !s.permission || Zt(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let Oe = null;
const _e = /* @__PURE__ */ new Set(), Xe = /* @__PURE__ */ new Set();
function Et() {
  _e.forEach((t) => t());
}
function js(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const se = {
  open(t) {
    const a = js(t);
    a && (Oe = a, Et());
  },
  close() {
    Oe = null, Et();
  },
  subscribe(t) {
    return _e.add(t), () => _e.delete(t);
  },
  getSnapshot() {
    return Oe;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && Xe.add(t);
  },
  emitResult() {
    Xe.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    Oe = null, _e.clear(), Xe.clear();
  }
}, Pt = "apya.taskDetail.fullscreen";
function xa({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, l] = x.useState(t), [i, n] = x.useState([]), { data: o, isLoading: p, isError: d, refetch: c } = ct(r), u = Wt(), b = ta(o), m = aa(), f = sa(r), [y, g] = x.useState("general"), [k, S] = x.useState(!1), P = Le.useRef(null), G = x.useMemo(
    () => da(f.assignedCodes),
    [f.assignedCodes]
  ), K = x.useMemo(
    () => vs(f.assignedCodes),
    [f.assignedCodes]
  ), z = G.find((E) => E.code === y) ?? G[0];
  Le.useEffect(() => {
    z.code !== y && g(z.code);
  }, [z, y]);
  const W = z == null ? void 0 : z.component, R = le(), [O, U] = x.useState(
    () => {
      var E;
      return ((E = window.localStorage) == null ? void 0 : E.getItem(Pt)) === "1";
    }
  ), [L, _] = x.useState(!1), J = x.useCallback(() => {
    Xt(), s == null || s();
  }, [s]);
  ea(t, J), Le.useEffect(() => {
    b.isDirty ? u.markDirty() : u.markClean();
  });
  const V = x.useCallback(() => u.requestClose(J), [u, J]), X = x.useCallback(() => {
    U((E) => {
      var F;
      const A = !E;
      return (F = window.localStorage) == null || F.setItem(Pt, A ? "1" : "0"), A;
    });
  }, []), q = Zt("Platform.Tasks.Delete"), [ee, j] = x.useState(!1), [v, h] = x.useState(!1), C = x.useCallback(async () => {
    var E, A, F, te, Z, je;
    h(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (F = (A = (E = window == null ? void 0 : window.abp) == null ? void 0 : E.notify) == null ? void 0 : A.info) == null || F.call(A, "Başarıyla silindi."), j(!1), u.markClean(), J();
    } catch (de) {
      (je = (Z = (te = window == null ? void 0 : window.abp) == null ? void 0 : te.notify) == null ? void 0 : Z.error) == null || je.call(Z, (de == null ? void 0 : de.message) || "Görev silinemedi.");
    } finally {
      h(!1);
    }
  }, [r, u, J]), D = x.useCallback(async () => {
    var E, A, F, te, Z, je;
    if (!b.validate()) return !1;
    _(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, b.toUpdateDto())
      ), await R.invalidateQueries({ queryKey: ["task-detail", r] }), se.emitResult(), (F = (A = (E = window == null ? void 0 : window.abp) == null ? void 0 : E.notify) == null ? void 0 : A.success) == null || F.call(A, "Kaydedildi."), !0;
    } catch (de) {
      return (je = (Z = (te = window == null ? void 0 : window.abp) == null ? void 0 : te.notify) == null ? void 0 : Z.error) == null || je.call(Z, (de == null ? void 0 : de.message) || "Kaydedilemedi."), !1;
    } finally {
      _(!1);
    }
  }, [r, b, u, R]), H = x.useCallback(() => {
    D();
  }, [D]), oe = x.useCallback(async () => {
    const E = u.resolvePendingClose("save");
    await D() && (E == null || E());
  }, [u, D]), w = x.useCallback((E, A) => {
    u.requestClose(() => {
      n((F) => [...F, { id: r, title: (o == null ? void 0 : o.title) ?? "" }]), l(E), g("general"), u.markClean();
    });
  }, [u, r, o]), I = x.useCallback((E) => {
    u.requestClose(() => {
      n((A) => {
        const F = A.findIndex((te) => te.id === E);
        return F === -1 ? A : A.slice(0, F);
      }), l(E), g("general"), u.markClean();
    });
  }, [u]), $ = x.useCallback(async (E) => {
    var A, F, te;
    try {
      await f.addFeature(E), g(E), S(!1);
    } catch (Z) {
      (te = (F = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : F.error) == null || te.call(F, (Z == null ? void 0 : Z.message) || "Özellik eklenemedi.");
    }
  }, [f]), M = x.useCallback(async (E) => {
    var A, F, te;
    try {
      await f.removeFeature(E), g((Z) => Z === E ? "general" : Z);
    } catch (Z) {
      (te = (F = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : F.error) == null || te.call(F, (Z == null ? void 0 : Z.message) || "Özellik kaldırılamadı.");
    }
  }, [f]);
  Le.useEffect(() => {
    if (!k) return;
    const E = (F) => {
      P.current && !P.current.contains(F.target) && S(!1);
    }, A = (F) => {
      F.key === "Escape" && S(!1);
    };
    return document.addEventListener("mousedown", E), document.addEventListener("keydown", A), () => {
      document.removeEventListener("mousedown", E), document.removeEventListener("keydown", A);
    };
  }, [k]);
  const Y = p ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(be, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(be, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(be, { className: "h-24 w-full" })
  ] }) : d ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(ae, { variant: "ghost", onClick: () => c(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      _a,
      {
        trail: i,
        current: { id: r, title: (o == null ? void 0 : o.title) ?? "" },
        onNavigate: I
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: P, children: [
      /* @__PURE__ */ e.jsx(
        qa,
        {
          tabs: G,
          activeCode: z.code,
          onSelect: (E) => {
            g(E), S(!1);
          },
          onOpenPicker: () => S((E) => !E),
          pickerOpen: k
        }
      ),
      k && /* @__PURE__ */ e.jsx(
        Ua,
        {
          entries: K,
          busyCode: f.isMutating ? f.mutatingCode : null,
          onAdd: $,
          onRemove: M
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
            Ma,
            {
              values: b.values,
              errors: b.errors,
              onFieldChange: b.setField,
              assigneeOptions: m.options,
              isLoadingAssignees: m.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(x.Suspense, { fallback: /* @__PURE__ */ e.jsx(be, { className: "h-24 w-full" }), children: W && /* @__PURE__ */ e.jsx(
            W,
            {
              taskId: r,
              task: o,
              onOpenSubtask: w
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            Fa,
            {
              task: o,
              creatorName: m.nameById.get(o.creatorId),
              lastModifierName: m.nameById.get(o.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), re = a === "page" ? Ia : Pa;
  return /* @__PURE__ */ e.jsxs(
    re,
    {
      open: !0,
      fullscreen: O,
      onRequestClose: V,
      title: o ? `Görev Detayı: ${o.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        La,
        {
          task: o ?? { title: "Yükleniyor…" },
          canDelete: q,
          fullscreen: O,
          onToggleFullscreen: X,
          onClose: V,
          onDelete: () => j(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        za,
        {
          lastSavedAt: o == null ? void 0 : o.lastModificationTime,
          isDirty: u.isDirty,
          isSaving: L,
          onCancel: V,
          onSave: H
        }
      ),
      children: [
        Y,
        u.pendingClose && /* @__PURE__ */ e.jsx(
          Ns,
          {
            isSaving: L,
            onStay: () => u.resolvePendingClose("stay"),
            onDiscard: () => u.resolvePendingClose("discard"),
            onSaveAndClose: oe
          }
        ),
        ee && /* @__PURE__ */ e.jsx(
          ws,
          {
            taskTitle: (o == null ? void 0 : o.title) ?? "",
            busy: v,
            onCancel: () => j(!1),
            onConfirm: C
          }
        )
      ]
    }
  );
}
function ws({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [l, i] = x.useState(""), n = l.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    ua,
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
function ua({ label: t, title: a, description: s, children: r, actions: l }) {
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
function Ns({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    ua,
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
const ks = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function Cs({ isPrivate: t = !1, onChange: a = () => {
} }) {
  const s = !!t, [r, l] = x.useState(null);
  return /* @__PURE__ */ e.jsxs(he, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(ge, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
      "button",
      {
        ref: l,
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
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: ks.map((i) => {
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
          /* @__PURE__ */ e.jsx(Ca, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const It = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto", Ts = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", Ds = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" },
  { what: "Bağlantı kopyala", key: "⌘ L" }
];
function Ss({ children: t }) {
  return /* @__PURE__ */ e.jsx(Qt, { asChild: !0, children: t });
}
function $s({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "inline-flex items-center h-[19px] px-1.5 rounded-[5px] border border-default border-b-2 bg-neutral-subtle font-mono text-[10px] font-semibold text-text-secondary", children: t });
}
function Es({
  task: t = {},
  presentation: a = "modal",
  onClose: s,
  isFullscreen: r,
  onToggleFullscreen: l,
  onFieldChange: i = () => {
  },
  statusValue: n,
  titleValue: o,
  isPrivateValue: p,
  isFavorite: d,
  onToggleFavorite: c,
  isWatched: u,
  onToggleWatch: b,
  onDuplicate: m,
  onArchive: f,
  onDelete: y,
  onOpenTransfer: g,
  onSaveAsTemplate: k,
  onConvertToSubtask: S,
  onExportPdf: P
}) {
  const [G, K] = x.useState(!1), [z, W] = x.useState(null), [R, O] = x.useState(!1), U = x.useRef(null), L = ke(z), _ = ze(n ?? t.status), J = t.code || "GRV-—", V = () => {
    var j;
    (j = navigator.clipboard) == null || j.writeText(J), K(!0), setTimeout(() => K(!1), 1800);
  }, X = () => {
    var j, v, h, C;
    (j = navigator.clipboard) == null || j.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), (C = (h = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : h.success) == null || C.call(h, "Görev bağlantısı panoya kopyalandı.");
  }, q = (j) => () => {
    O(!1), j == null || j();
  }, ee = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", kbd: "⌘L", onClick: q(X) },
    { label: "Çoğalt", icon: "fa-copy", kbd: "⌘D", onClick: q(m) },
    { label: "Başka projeye kopyala", icon: "fa-clone", onClick: q(() => g == null ? void 0 : g("copy")) },
    { label: "Şablon olarak kaydet", icon: "fa-bookmark", onClick: q(k) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, onClick: q(() => g == null ? void 0 : g("move")) },
    { label: "Alt göreve dönüştür", icon: "fa-diagram-project", onClick: q(S) },
    { label: u ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: q(b) },
    { label: "Arşivle", icon: "fa-box-archive", separator: !0, onClick: q(f) },
    { label: "Yazdır", icon: "fa-print", kbd: "⌘P", onClick: q(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: q(P) },
    { label: "Sil", icon: "fa-trash-can", kbd: "⌫", separator: !0, danger: !0, onClick: q(y) }
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
              /* @__PURE__ */ e.jsx("i", { className: `${G ? "fa-solid fa-check" : "fa-regular fa-copy"} text-[9px] opacity-60` })
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
          /* @__PURE__ */ e.jsx(ye, { container: L, children: /* @__PURE__ */ e.jsxs(ve, { sideOffset: 6, align: "start", className: `${It} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            ra.map((j) => {
              const v = Ve[j], h = (n ?? t.status) === j;
              return /* @__PURE__ */ e.jsx(Ss, { children: /* @__PURE__ */ e.jsxs(
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
        u && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 h-[26px] px-2.5 rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11.5px] font-semibold", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-eye text-[10px]" }),
          "Takip ediliyor"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
        /* @__PURE__ */ e.jsx("div", { className: "lt-860:hidden", children: /* @__PURE__ */ e.jsx(
          Cs,
          {
            isPrivate: p ?? !!t.isPrivate,
            onChange: (j) => i("isPrivate", j)
          }
        ) }),
        /* @__PURE__ */ e.jsx("div", { className: "h-5 w-px bg-border-default mx-1" }),
        a === "modal" && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: l,
            title: r ? "Küçült" : "Tam ekran",
            className: `mobile:hidden flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${r ? "bg-primary-subtle text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r ? "fa-compress" : "fa-expand"} text-[12px]` })
          }
        ),
        /* @__PURE__ */ e.jsxs(he, { modal: !0, open: R, onOpenChange: O, children: [
          /* @__PURE__ */ e.jsx(ge, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer seçenekler",
              className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${R ? "bg-surface-hover text-text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
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
              className: `${It} w-[244px]`,
              children: [
                ee.map((j) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: j.onClick,
                    className: [
                      Ts,
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
                  Ds.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: j.what }),
                    /* @__PURE__ */ e.jsx($s, { children: j.key })
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
          onClick: c,
          title: d ? "Favorilerden çıkar" : "Favorilere ekle",
          className: `flex items-center justify-center h-8 w-8 shrink-0 rounded-[9px] cursor-pointer ${d ? "bg-warning-subtle text-warning" : "text-text-tertiary hover:bg-surface-hover"}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${d ? "solid" : "regular"} fa-star text-[15px]` })
        }
      )
    ] })
  ] });
}
const qe = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", At = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function fe({ children: t }) {
  return /* @__PURE__ */ e.jsx(Qt, { asChild: !0, children: t });
}
function xe({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[7px] min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.08em] text-text-tertiary select-none", children: t }),
    a
  ] });
}
function Lt({ name: t, size: a = 26 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Re(t), fontSize: a * 0.38 },
      children: Ke(t)
    }
  );
}
function Bt(t) {
  if (t == null) return "—";
  const a = Math.max(0, Math.round(Number(t) * 60)), s = Math.floor(a / 60), r = a % 60;
  return s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function Ps({
  task: t = {},
  assigneeOptions: a = [],
  projectOptions: s = [],
  onFieldChange: r = () => {
  },
  statusValue: l,
  priorityValue: i,
  assigneeValue: n,
  projectValue: o,
  dueDateValue: p,
  startDateValue: d,
  tagsValue: c = [],
  progressPercent: u = 0,
  progressNote: b = "",
  onOpenTransfer: m
}) {
  var j, v;
  const [f, y] = x.useState(""), [g, k] = x.useState(""), [S, P] = x.useState(""), [G, K] = x.useState(!1), [z, W] = x.useState(null), R = ze(l ?? t.status), O = na(i ?? t.priority), U = n ?? t.assigneeId ?? null, L = o ?? t.projectId ?? null, _ = ((j = a.find((h) => h.value === U)) == null ? void 0 : j.label) || t.assigneeName || "Atanmamış", J = ((v = s.find((h) => h.value === L)) == null ? void 0 : v.label) || t.projectName || "Projesiz", V = es(p ?? t.dueDate), X = a.filter(
    (h) => !f || h.label.toLowerCase().includes(f.toLowerCase())
  ), q = s.filter(
    (h) => !g || h.label.toLowerCase().includes(g.toLowerCase())
  ), ee = () => {
    const h = S.trim();
    h && !c.includes(h) && r("tagNames", [...c, h]), P(""), K(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { ref: W, className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6", children: [
    /* @__PURE__ */ e.jsx(xe, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(he, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(ge, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx(Lt, { name: U ? _ : null }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: _ }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ye, { container: ke(z), children: /* @__PURE__ */ e.jsxs(ve, { sideOffset: 6, align: "start", className: `${qe} w-[264px]`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: f,
              onChange: (h) => y(h.target.value),
              placeholder: "Kişi ara…",
              className: At
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
                /* @__PURE__ */ e.jsx(Lt, { name: h.label, size: 24 }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: h.label }),
                U === h.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
              ]
            }
          ) }, h.value))
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ e.jsxs(xe, { label: "Son tarih", children: [
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
    /* @__PURE__ */ e.jsx(xe, { label: "Başlangıç", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
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
    /* @__PURE__ */ e.jsx(xe, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 pt-[5px]", children: [
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
    /* @__PURE__ */ e.jsx(xe, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(he, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(ge, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
      /* @__PURE__ */ e.jsx(ye, { container: ke(z), children: /* @__PURE__ */ e.jsxs(ve, { sideOffset: 6, align: "start", className: `${qe} w-[196px]`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
        ra.map((h) => {
          const C = Ve[h], D = (l ?? t.status) === h;
          return /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("status", h),
              className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${D ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${C.dot}` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: C.label }),
                D && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
              ]
            }
          ) }, h);
        })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(xe, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(he, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(ge, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${O.bg} ${O.fg}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${O.icon} text-[11px]` }),
            /* @__PURE__ */ e.jsx("span", { children: O.label }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ye, { container: ke(z), children: /* @__PURE__ */ e.jsxs(ve, { sideOffset: 6, align: "start", className: `${qe} w-[184px]`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
        Xa.map((h) => {
          const C = lt[h], D = (i ?? t.priority) === h;
          return /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("priority", h),
              className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${D ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${C.icon} text-[11px] w-[13px]` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: C.label }),
                D && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
              ]
            }
          ) }, h);
        })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(xe, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap min-h-8", children: [
      c.map((h) => /* @__PURE__ */ e.jsxs(
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
                onClick: () => r("tagNames", c.filter((C) => C !== h)),
                className: "flex items-center p-0 border-0 bg-transparent text-current opacity-55 hover:opacity-100 hover:text-negative cursor-pointer",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
              }
            )
          ]
        },
        h
      )),
      G ? /* @__PURE__ */ e.jsx(
        "input",
        {
          autoFocus: !0,
          type: "text",
          value: S,
          onChange: (h) => P(h.target.value),
          onBlur: ee,
          onKeyDown: (h) => {
            h.key === "Enter" && ee(), h.key === "Escape" && (P(""), K(!1));
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
    /* @__PURE__ */ e.jsx(xe, { label: "Proje", children: /* @__PURE__ */ e.jsxs(he, { modal: !0, children: [
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
      /* @__PURE__ */ e.jsx(ye, { container: ke(z), children: /* @__PURE__ */ e.jsxs(ve, { sideOffset: 6, align: "start", className: `${qe} w-[250px]`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: g,
              onChange: (h) => k(h.target.value),
              placeholder: "Proje ara…",
              className: At
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
          q.map((h) => /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
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
              onClick: () => m == null ? void 0 : m("move"),
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
              onClick: () => m == null ? void 0 : m("copy"),
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
    /* @__PURE__ */ e.jsx(xe, { label: "Harcanan / tahmin", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[9px] h-8", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock text-[13px] text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[13px] font-bold text-text-primary", children: Bt(t.spentHours ?? 0) }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[12px] text-text-tertiary", children: [
        "/ ",
        t.estimatedHours != null ? Bt(t.estimatedHours) : "—"
      ] })
    ] }) })
  ] }) });
}
function Is({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: l,
  onDragEnd: i,
  onReorderTo: n,
  onReorderDrop: o,
  onOpenPicker: p,
  counts: d = {},
  isDirty: c = !1
}) {
  const [u, b] = x.useState(!1);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-6 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 py-2.5 flex-1 min-w-0 overflow-x-auto custom-scrollbar", children: [
      s.map((m) => {
        const f = t === m.code, y = d[m.code] || 0;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            draggable: !0,
            title: "Sürükleyerek sırayı değiştirin",
            onClick: () => a(m.code),
            onDragStart: (g) => {
              l(m.code);
              try {
                g.dataTransfer.effectAllowed = "move", g.dataTransfer.setData("text/plain", m.code);
              } catch {
              }
            },
            onDragOver: (g) => {
              g.preventDefault(), n(m.code);
            },
            onDrop: (g) => {
              g.preventDefault(), o == null || o();
            },
            onDragEnd: i,
            className: [
              "flex shrink-0 items-center gap-2 h-[34px] px-[13px] rounded-[10px]",
              "text-[12.5px] whitespace-nowrap cursor-grab active:cursor-grabbing",
              "transition-opacity duration-fast",
              f ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
              r === m.code ? "opacity-35" : "opacity-100"
            ].join(" "),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${m.icon} text-[11px] opacity-85` }),
              /* @__PURE__ */ e.jsx("span", { children: m.title }),
              y > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                "rounded-full text-[10px] font-extrabold",
                f ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
              ].join(" "), children: y })
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
            b(!1), p();
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
function As({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: l,
  onDragEnd: i,
  onReorderTo: n,
  onReorderDrop: o,
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
          const u = t === c.code, b = d[c.code] || 0;
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
                m.preventDefault(), o == null || o();
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
const zt = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "—";
function Ls({ task: t = {}, nameById: a }) {
  const s = (i, n) => {
    var o;
    return i || n && ((o = a == null ? void 0 : a.get) == null ? void 0 : o.call(a, n)) || null;
  }, r = s(t.creatorName, t.creatorId), l = t.lastModificationTime ? s(t.lastModifierName, t.lastModifierId) : null;
  return /* @__PURE__ */ e.jsx("aside", { className: "flex flex-col gap-3.5 min-w-0", children: /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsx(De, { label: "Oluşturan", value: r || "Bilinmiyor", avatarName: r }),
    /* @__PURE__ */ e.jsx(De, { label: "Oluşturma tarihi", value: zt(t.creationTime) }),
    /* @__PURE__ */ e.jsx(De, { label: "Güncelleyen", value: l || "—", avatarName: l }),
    /* @__PURE__ */ e.jsx(De, { label: "Son güncelleme", value: zt(t.lastModificationTime) }),
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
], zs = '<table class="apya-rte-table"><tr><th>Kolon 1</th><th>Kolon 2</th></tr><tr><td>Değer</td><td>Değer</td></tr></table><p><br></p>', Ks = '<div class="apya-rte-imgph">görsel yer tutucu</div><p><br></p>';
function Rs(t) {
  return t ? /<[a-z][\s\S]*>/i.test(t) ? t : `<p>${t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>` : "";
}
function Ms({ value: t, onChange: a, mentionName: s = "ekip arkadaşı" }) {
  const r = x.useRef(null), l = x.useRef(Rs(t)), [i, n] = x.useState(!1), [o, p] = x.useState("https://"), d = x.useRef(null), c = (g, k) => {
    var S, P;
    (S = r.current) == null || S.focus();
    try {
      document.execCommand(g, !1, k);
    } catch {
    }
    a == null || a(((P = r.current) == null ? void 0 : P.innerHTML) ?? "");
  }, u = () => {
    const g = window.getSelection();
    d.current = g && g.rangeCount ? g.getRangeAt(0).cloneRange() : null;
  }, b = () => {
    const g = d.current;
    if (!g) return;
    const k = window.getSelection();
    k.removeAllRanges(), k.addRange(g);
  }, m = () => {
    var k;
    const g = o.trim();
    n(!1), !(!g || g === "https://") && ((k = r.current) == null || k.focus(), b(), c("createLink", g), p("https://"));
  }, f = (g) => {
    switch (g.cmd) {
      case "link":
        u();
        return;
      case "image":
        c("insertHTML", Ks);
        return;
      case "table":
        c("insertHTML", zs);
        return;
      case "mention":
        c("insertHTML", `<span class="apya-rte-mention">@${s}</span>&nbsp;`);
        return;
      default:
        c(g.cmd, g.arg);
    }
  }, y = "flex shrink-0 items-center justify-center h-7 w-7 rounded-[7px] border-0 bg-transparent text-text-secondary cursor-pointer hover:bg-surface-base hover:text-primary hover:shadow-xs";
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-[14px] border border-default bg-surface-base overflow-hidden shadow-xs", children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-0.5 px-2 py-1.5 border-b border-subtle bg-neutral-subtle overflow-x-auto custom-scrollbar", children: Bs.map((g) => {
      const k = /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          title: g.title,
          onMouseDown: (S) => {
            S.preventDefault(), f(g);
          },
          className: `${y} ${g.gap ? "ml-1.5" : ""}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${g.regular ? "regular" : "solid"} ${g.icon} text-[12px]` })
        },
        g.cmd + g.icon
      );
      return g.cmd !== "link" ? k : /* @__PURE__ */ e.jsxs(he, { modal: !0, open: i, onOpenChange: n, children: [
        /* @__PURE__ */ e.jsx(ge, { asChild: !0, children: k }),
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
                    value: o,
                    onChange: (S) => p(S.target.value),
                    onKeyDown: (S) => {
                      S.key === "Enter" && m();
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
        onInput: (g) => a == null ? void 0 : a(g.currentTarget.innerHTML),
        className: "apya-rte-surface min-h-[150px] p-4 text-[13.5px] leading-[1.7] text-text-primary bg-surface-base focus:outline-none",
        dangerouslySetInnerHTML: { __html: l.current }
      }
    )
  ] });
}
const Kt = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
function et({ name: t, size: a = 32 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Re(t), fontSize: a * 0.34 },
      children: Ke(t)
    }
  );
}
function Rt({ open: t, onClick: a }) {
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
const Mt = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function Fs({
  task: t = {},
  onFieldChange: a = () => {
  },
  descriptionValue: s,
  checklist: r,
  currentUserName: l = "Ben"
}) {
  const i = t == null ? void 0 : t.id, n = le(), [o, p] = x.useState(!0), [d, c] = x.useState(""), u = (r == null ? void 0 : r.items) ?? [], b = u.filter((v) => v.isDone).length, m = u.length ? Math.round(b / u.length * 100) : 0, f = async () => {
    var h, C, D;
    const v = d.trim();
    if (!(!v || !i)) {
      c("");
      try {
        await r.addItem(v);
      } catch (H) {
        (D = (C = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : C.error) == null || D.call(C, (H == null ? void 0 : H.message) || "Madde eklenemedi.");
      }
    }
  }, [y, g] = x.useState(!0), [k, S] = x.useState(""), [P, G] = x.useState(!1), [K, z] = x.useState(!1), [W, R] = x.useState(null), [O, U] = x.useState(""), [L, _] = x.useState({}), { data: J = [] } = ie({
    queryKey: ["task-comments", i],
    queryFn: () => {
      var v, h, C, D;
      return Promise.resolve((D = (C = (h = (v = window == null ? void 0 : window.apya) == null ? void 0 : v.platform) == null ? void 0 : h.tasks) == null ? void 0 : C.task) == null ? void 0 : D.getComments(i));
    },
    enabled: !!i,
    staleTime: 1e4
  }), V = async () => {
    await n.invalidateQueries({ queryKey: ["task-comments", i] }), await n.invalidateQueries({ queryKey: ["task-detail", i] });
  }, X = async () => {
    var h, C, D;
    const v = k.trim();
    if (!(!v || !i || K)) {
      z(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.addComment(i, v)), await V(), S("");
      } catch (H) {
        (D = (C = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : C.error) == null || D.call(C, (H == null ? void 0 : H.message) || "Yorum gönderilemedi.");
      } finally {
        z(!1);
      }
    }
  }, q = async (v) => {
    var C, D, H;
    const h = O.trim();
    if (!(!h || !i))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.replyToComment(v, h)), await V(), U(""), R(null);
      } catch (oe) {
        (H = (D = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : D.error) == null || H.call(D, (oe == null ? void 0 : oe.message) || "Yanıt gönderilemedi.");
      }
  }, ee = (v) => _((h) => {
    const C = h[v] ?? { liked: !1, count: 0 };
    return { ...h, [v]: { liked: !C.liked, count: C.count + (C.liked ? -1 : 1) } };
  }), j = !!k.trim() && !K;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-[9px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Açıklama" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Zengin metin · WYSIWYG" })
      ] }),
      /* @__PURE__ */ e.jsx(
        Ms,
        {
          value: s ?? t.description ?? "",
          onChange: (v) => a("description", v),
          mentionName: l
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: Kt, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
            b,
            "/",
            u.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(Rt, { open: o, onClick: () => p((v) => !v) })
      ] }),
      o && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 mt-3.5", children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
            style: { width: `${m}%` }
          }
        ) }),
        u.map((v) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              "aria-label": v.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
              onClick: () => r.toggleItem(v.id).catch((h) => {
                var C, D, H;
                return (H = (D = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : D.error) == null ? void 0 : H.call(D, (h == null ? void 0 : h.message) || "Durum güncellenemedi.");
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
                var C, D, H;
                return (H = (D = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : D.error) == null ? void 0 : H.call(D, (h == null ? void 0 : h.message) || "Madde silinemedi.");
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
            onChange: (v) => c(v.target.value),
            onKeyDown: (v) => {
              v.key === "Enter" && f();
            },
            placeholder: "Yeni madde yaz ve Enter'a bas…",
            className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: Kt, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Yorumlar & güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: J.length })
        ] }),
        /* @__PURE__ */ e.jsx(Rt, { open: y, onClick: () => g((v) => !v) })
      ] }),
      y && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(et, { name: l }),
          /* @__PURE__ */ e.jsxs("div", { className: `flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${P ? "border-focus bg-surface-base shadow-focus" : "border-default bg-surface-raised"}`, children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                rows: 2,
                value: k,
                onChange: (v) => S(v.target.value),
                onFocus: () => G(!0),
                onBlur: () => G(!1),
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
                  onClick: () => S((h) => h + v.add),
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
          const h = L[v.id] ?? { liked: !1, count: 0 };
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start py-3 border-t border-subtle", children: [
            /* @__PURE__ */ e.jsx(et, { name: v.authorName }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: v.authorName }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: Mt(v.creationTime) })
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
                      R((C) => C === v.id ? null : v.id), U("");
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
                    value: O,
                    onChange: (C) => U(C.target.value),
                    onKeyDown: (C) => {
                      C.key === "Enter" && q(v.id);
                    },
                    placeholder: `@${v.authorName} kullanıcısına yanıt ver…`,
                    className: "flex-1 h-8 px-3 rounded-[9px] border border-focus bg-surface-base text-text-primary text-[12px] shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => q(v.id),
                    className: "h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover",
                    children: "Yanıtla"
                  }
                )
              ] }),
              (v.replies ?? []).map((C) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] mt-2.5 pl-3 border-l-2 border-default", children: [
                /* @__PURE__ */ e.jsx(et, { name: C.authorName, size: 24 }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: C.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: Mt(C.creationTime) })
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
function Gs({
  lastSavedAt: t,
  isDirty: a,
  isSaving: s,
  justSaved: r,
  onCancel: l,
  onSave: i
}) {
  const n = t ? new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(t)) : "—", o = s ? "fa-solid fa-circle-notch fa-spin" : r ? "fa-solid fa-check" : "fa-regular fa-floppy-disk", p = s ? "Kaydediliyor…" : r ? "Kaydedildi" : "Kaydet", d = a && !s;
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
          onClick: l,
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
            /* @__PURE__ */ e.jsx("i", { className: `${o} text-[11px]` }),
            p
          ]
        }
      )
    ] })
  ] });
}
const Os = Object.fromEntries(Me.map((t) => [t.code, t])), qs = {
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
}, Ys = [
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
]), _s = (t) => Us.has(t);
function pa(t) {
  const a = Os[t], s = qs[t];
  return a ? {
    code: t,
    title: a.title,
    icon: a.icon,
    desc: (s == null ? void 0 : s.desc) ?? "",
    bg: (s == null ? void 0 : s.bg) ?? "bg-neutral-subtle",
    fg: (s == null ? void 0 : s.fg) ?? "text-text-secondary"
  } : null;
}
function Hs(t = "") {
  const a = t.trim().toLowerCase();
  return Ys.map((s) => ({
    title: s.title,
    items: s.codes.map(pa).filter(Boolean).filter((r) => !a || r.title.toLowerCase().includes(a) || r.desc.toLowerCase().includes(a))
  })).filter((s) => s.items.length > 0);
}
const Ft = Me.length;
function Gt({ code: t, onRemoveFeature: a, onOpenPicker: s, canRemove: r = !0 }) {
  const l = pa(t) ?? { title: t, desc: "", icon: "fa-cube", bg: "bg-neutral-subtle", fg: "text-text-secondary" };
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
function ut({ open: t, onClose: a, label: s, children: r }) {
  return /* @__PURE__ */ e.jsx(
    Ta,
    {
      open: t,
      onOpenChange: (l) => {
        l || a == null || a();
      },
      children: /* @__PURE__ */ e.jsxs(Da, { children: [
        /* @__PURE__ */ e.jsx(Sa, { className: "fixed inset-0", style: { pointerEvents: "none" } }),
        /* @__PURE__ */ e.jsx($a, { asChild: !0, "aria-describedby": void 0, children: /* @__PURE__ */ e.jsxs("div", { className: "fixed inset-0 z-modal", children: [
          /* @__PURE__ */ e.jsx(Ea, { className: "sr-only", children: s }),
          r
        ] }) })
      ] })
    }
  );
}
function Vs({
  open: t,
  onClose: a,
  assignedCodes: s = [],
  onAddFeature: r,
  onGoToTab: l
}) {
  const [i, n] = x.useState("");
  if (x.useEffect(() => {
    t || n("");
  }, [t]), !t) return null;
  const o = new Set(s), p = Hs(i), d = s.length + 3, c = (u) => {
    if (o.has(u)) {
      l == null || l(u), a == null || a();
      return;
    }
    r == null || r(u), a == null || a();
  };
  return /* @__PURE__ */ e.jsx(ut, { open: t, onClose: a, label: "Özellik ekle", children: /* @__PURE__ */ e.jsx(
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
                  placeholder: `${Ft} özellik arasında ara (Gantt, Finans, Risk, AI…)`,
                  className: "w-full h-[42px] pl-9 pr-3.5 rounded-xl border border-default bg-neutral-subtle text-text-primary text-[13px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                }
              )
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col gap-5 px-[22px] pt-3 pb-[22px] overflow-y-auto custom-scrollbar", children: [
              p.map((u) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[11px]", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.1em] text-text-tertiary", children: u.title }),
                  /* @__PURE__ */ e.jsx("span", { className: "flex-1 h-px bg-subtle" })
                ] }),
                /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[11px]", children: u.items.map((b) => {
                  const m = o.has(b.code);
                  return /* @__PURE__ */ e.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => c(b.code),
                      className: `group flex items-start gap-3 p-3.5 rounded-[15px] border text-left cursor-pointer hover:border-focus hover:shadow-md ${m ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                      children: [
                        /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-10 w-10 rounded-xl ${b.bg} ${b.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${b.icon} text-[15px]` }) }),
                        /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-[3px] min-w-0 flex-1", children: [
                          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-between gap-2", children: [
                            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: b.title }),
                            /* @__PURE__ */ e.jsx("span", { className: `shrink-0 text-[10.5px] font-extrabold ${m ? "text-primary" : "text-text-tertiary"}`, children: m ? "✓ Ekli" : "Ekle →" })
                          ] }),
                          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] leading-[1.5] text-text-tertiary", children: b.desc })
                        ] })
                      ]
                    },
                    b.code
                  );
                }) })
              ] }, u.title)),
              p.length === 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 py-12 text-center", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass text-3xl text-text-tertiary mb-2" }),
                /* @__PURE__ */ e.jsx("p", { className: "m-0 text-sm font-semibold text-text-primary", children: "Eşleşen özellik bulunamadı" }),
                /* @__PURE__ */ e.jsx("p", { className: "m-0 text-xs text-text-tertiary", children: "Lütfen farklı bir arama terimi deneyin." })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-[22px] py-3.5 border-t border-subtle bg-surface-raised text-[11.5px] text-text-tertiary", children: [
              /* @__PURE__ */ e.jsxs("span", { children: [
                "Toplam ",
                Ft,
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
const Qs = [
  { key: "subtasks", label: "Alt görevler", countKey: "subtasks", unit: "alt görev" },
  { key: "checklist", label: "Kontrol listesi", countKey: "checklist", unit: "madde" },
  { key: "comments", label: "Yorumlar", countKey: "comments", unit: "yorum" },
  { key: "files", label: "Dosyalar", countKey: "files", unit: "dosya" },
  { key: "keepAssignee", label: "Sorumluyu koru", desc: "Aksi halde atanmamış gelir" },
  { key: "keepLinks", label: "Bağımlılıkları koru", desc: "Öncül / ardıl bağlantılar" },
  { key: "shiftDates", label: "Tarihleri bugüne kaydır", desc: "Başlangıç ve son tarih ötelenir" }
], Ot = {
  subtasks: !0,
  checklist: !0,
  comments: !1,
  files: !0,
  keepAssignee: !0,
  keepLinks: !0,
  shiftDates: !1
};
function Zs({ on: t, onClick: a, label: s }) {
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
function Ws({
  open: t,
  mode: a = "move",
  onClose: s,
  onConfirm: r,
  projectOptions: l = [],
  currentProjectId: i,
  counts: n = {},
  onCreateProject: o
}) {
  const [p, d] = x.useState(a), [c, u] = x.useState([]), [b, m] = x.useState(""), [f, y] = x.useState(""), [g, k] = x.useState(Ot), [S, P] = x.useState(!1);
  x.useEffect(() => {
    t && (d(a), u([]), m(""), y(""), k(Ot));
  }, [t, a]);
  const G = x.useMemo(
    () => l.filter((j) => j.value && j.value !== i),
    [l, i]
  ), K = G.filter((j) => !b || j.label.toLowerCase().includes(b.toLowerCase())), z = G.length > 0 && c.length === G.length;
  if (!t) return null;
  const W = (j) => u((v) => v.includes(j) ? v.filter((h) => h !== j) : [...v, j]), R = (j) => {
    var v;
    return ((v = l.find((h) => h.value === j)) == null ? void 0 : v.label) ?? "";
  }, O = async () => {
    var v, h, C;
    const j = f.trim();
    if (!(!j || S)) {
      P(!0);
      try {
        const D = await (o == null ? void 0 : o(j));
        D && u((H) => [...H, D]), y("");
      } catch (D) {
        (C = (h = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : h.error) == null || C.call(h, (D == null ? void 0 : D.message) || "Proje oluşturulamadı.");
      } finally {
        P(!1);
      }
    }
  }, U = async () => {
    if (!(!c.length || S)) {
      P(!0);
      try {
        await (r == null ? void 0 : r({ mode: p, targetProjectIds: c, include: g }));
      } finally {
        P(!1);
      }
    }
  }, L = p === "move", _ = c.length, J = L ? _ > 1 ? "Taşı ve kopyala" : "Taşı" : _ > 1 ? `${_} projeye kopyala` : "Kopyala", V = Object.values(g).filter(Boolean).length, X = c.map(R).filter(Boolean), q = X.length ? `${X.length > 2 ? `${X.slice(0, 2).join(", ")} +${X.length - 2}` : X.join(", ")} · ${V} seçenek açık` : `Proje seçilmedi · ${V} seçenek açık`, ee = (j) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${j ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return /* @__PURE__ */ e.jsx(ut, { open: t, onClose: s, label: L ? "Başka projeye taşı" : "Başka projelere kopyala", children: /* @__PURE__ */ e.jsx(
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
                    _
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => u(z ? [] : G.map((j) => j.value)),
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
                      onChange: (j) => m(j.target.value),
                      placeholder: "Proje ara…",
                      className: "w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar", children: [
                  K.map((j) => {
                    const v = c.includes(j.value), h = L && c[0] === j.value;
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
                      value: f,
                      onChange: (j) => y(j.target.value),
                      onKeyDown: (j) => {
                        j.key === "Enter" && (j.preventDefault(), O());
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
                      onClick: O,
                      disabled: !f.trim() || S,
                      className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-plus text-[12px]" })
                    }
                  )
                ] }),
                L && _ > 1 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle", children: [
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
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: Qs.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-px", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary", children: j.label }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: j.countKey ? `${n[j.countKey] ?? 0} ${j.unit}` : j.desc })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    Zs,
                    {
                      on: g[j.key],
                      label: j.label,
                      onClick: () => k((v) => ({ ...v, [j.key]: !v[j.key] }))
                    }
                  )
                ] }, j.key)) })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3.5 px-[22px] py-3.5 border-t border-subtle bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("span", { className: "min-w-0 truncate text-[11.5px] text-text-tertiary", children: q }),
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
                    disabled: !_ || S,
                    className: `flex items-center gap-2 h-9 px-5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${_ && !S ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${S ? "fa-circle-notch fa-spin" : "fa-arrow-right"} text-[10px]` }),
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
const Js = [
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
function Xs(t = "") {
  var s;
  const a = (s = t.split(".").pop()) == null ? void 0 : s.toLowerCase();
  return a === "pdf" ? Ae.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(a) ? Ae.img : ["doc", "docx", "odt", "rtf"].includes(a) ? Ae.doc : ["json", "js", "ts", "cs", "xml", "yml", "yaml"].includes(a) ? Ae.code : Ae.other;
}
const er = (t) => t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toFixed(1)} MB` : "—", tr = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—", ar = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—";
function tt({ name: t, size: a = 22 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Re(t), fontSize: a * 0.4 },
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
function sr({
  subtaskId: t,
  parentCode: a,
  onClose: s,
  onOpenFull: r,
  onDeleted: l,
  currentUserName: i = "Ben"
}) {
  var D, H, oe;
  const n = le(), { data: o } = ct(t), p = xt(t), d = ca(t), [c, u] = x.useState("general"), [b, m] = x.useState(""), [f, y] = x.useState(""), [g, k] = x.useState(""), S = x.useRef(null), P = x.useRef(null);
  o && P.current !== o.id && (P.current = o.id, m(o.description ?? ""));
  const { data: G = [] } = ie({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var w, I, $, M;
      return Promise.resolve((M = ($ = (I = (w = window == null ? void 0 : window.apya) == null ? void 0 : w.platform) == null ? void 0 : I.tasks) == null ? void 0 : $.task) == null ? void 0 : M.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4
  });
  if (x.useEffect(() => {
    const w = (I) => {
      I.key === "Escape" && (I.stopPropagation(), s == null || s());
    };
    return window.addEventListener("keydown", w), () => window.removeEventListener("keydown", w);
  }, [s]), !o) return null;
  const K = (oe = (H = (D = window == null ? void 0 : window.apya) == null ? void 0 : D.platform) == null ? void 0 : H.tasks) == null ? void 0 : oe.task, z = ze(o.status), W = na(o.priority), R = p.items ?? [], O = R.filter((w) => w.isDone).length, U = R.length ? Math.round(O / R.length * 100) : 0, L = d.attachments ?? [], _ = { checklist: R.length, comments: G.length, files: L.length }, J = async () => {
    await n.invalidateQueries({ queryKey: ["task-detail", t] });
  }, V = async (w) => {
    var I, $, M;
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
      (M = ($ = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : $.error) == null || M.call($, (Y == null ? void 0 : Y.message) || "Alt görev güncellenemedi.");
    }
  }, X = () => V({ status: o.status >= 4 ? 1 : o.status + 1 }), q = () => V({ priority: o.priority >= 4 ? 1 : o.priority + 1 }), ee = () => {
    (o.description ?? "") !== b && V({ description: b || null });
  }, j = async () => {
    var I, $, M;
    const w = f.trim();
    if (w) {
      y("");
      try {
        await p.addItem(w);
      } catch (Y) {
        (M = ($ = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : $.error) == null || M.call($, (Y == null ? void 0 : Y.message) || "Madde eklenemedi.");
      }
    }
  }, v = async () => {
    var I, $, M;
    const w = g.trim();
    if (w) {
      k("");
      try {
        await Promise.resolve(K.addComment(o.id, w)), await n.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch (Y) {
        (M = ($ = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : $.error) == null || M.call($, (Y == null ? void 0 : Y.message) || "Yorum gönderilemedi.");
      }
    }
  }, h = async () => {
    var w, I, $;
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(K.delete(o.id)), l == null || l(o.id), s == null || s();
      } catch (M) {
        ($ = (I = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : I.error) == null || $.call(I, (M == null ? void 0 : M.message) || "Alt görev silinemedi.");
      }
  }, C = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
  return /* @__PURE__ */ e.jsxs(ut, { open: !0, onClose: s, label: `${o.code} alt görev detayı`, children: [
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
                    className: `${C} hover:bg-surface-hover hover:text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-up-right-from-square text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Alt görevi sil",
                    onClick: h,
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
                  onClick: q,
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
                /* @__PURE__ */ e.jsx(tt, { name: o.assigneeName }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", children: o.assigneeName || "Atanmamış" })
              ] }) }),
              /* @__PURE__ */ e.jsx(Ye, { label: "Son tarih", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] h-[22px] text-[12.5px] font-semibold text-text-primary", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[11px] text-text-tertiary" }),
                ar(o.dueDate)
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
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: Js.map((w) => {
            const I = c === w.code, $ = _[w.code] ?? 0;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => u(w.code),
                className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${I ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${w.icon} text-[11px] opacity-85` }),
                  /* @__PURE__ */ e.jsx("span", { children: w.title }),
                  $ > 0 && /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-neutral-subtle text-text-tertiary text-[10px] font-extrabold", children: $ })
                ]
              },
              w.code
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
                  onChange: (w) => m(w.target.value),
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
            c === "checklist" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px]", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Kontrol listesi" }),
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: [
                  O,
                  "/",
                  R.length
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-success", style: { width: `${U}%` } }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px] mt-1", children: [
                R.map((w) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] border border-subtle bg-surface-base hover:border-default", children: [
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
            c === "comments" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] items-start", children: [
                /* @__PURE__ */ e.jsx(tt, { name: i, size: 30 }),
                /* @__PURE__ */ e.jsx(
                  "textarea",
                  {
                    rows: 2,
                    value: g,
                    onChange: (w) => k(w.target.value),
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
                    className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] ${g.trim() ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paper-plane text-[11px]" })
                  }
                )
              ] }),
              G.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-[7px] py-7 rounded-xl border border-dashed border-default", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-comments text-xl text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Henüz yorum yok" })
              ] }) : G.map((w) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 items-start p-3 rounded-xl border border-subtle bg-surface-base", children: [
                /* @__PURE__ */ e.jsx(tt, { name: w.authorName, size: 28 }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: w.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: tr(w.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: w.text })
                ] })
              ] }, w.id))
            ] }),
            c === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  ref: S,
                  type: "file",
                  className: "hidden",
                  onChange: (w) => {
                    var $;
                    const I = ($ = w.target.files) == null ? void 0 : $[0];
                    w.target.value = "", I && d.upload(I).catch((M) => {
                      var Y, re, E;
                      return (E = (re = (Y = window == null ? void 0 : window.abp) == null ? void 0 : Y.notify) == null ? void 0 : re.error) == null ? void 0 : E.call(re, (M == null ? void 0 : M.message) || "Dosya yüklenemedi.");
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
                    return (w = S.current) == null ? void 0 : w.click();
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
                const I = Xs(w.fileName);
                return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${I.bg} ${I.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${I.icon} text-[13px]` }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: w.fileName }),
                    /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                      er(w.fileSize),
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
                      onClick: () => d.remove(w.id).catch(($) => {
                        var M, Y, re;
                        return (re = (Y = (M = window == null ? void 0 : window.abp) == null ? void 0 : M.notify) == null ? void 0 : Y.error) == null ? void 0 : re.call(Y, ($ == null ? void 0 : $.message) || "Dosya silinemedi.");
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
const ma = "apya.taskDetail.tabOrder";
function rr() {
  try {
    const t = localStorage.getItem(ma);
    if (!t) return [];
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.filter((s) => typeof s == "string") : [];
  } catch {
    return [];
  }
}
function nr(t) {
  try {
    localStorage.setItem(ma, JSON.stringify(t));
  } catch {
  }
}
function ir(t) {
  const [a, s] = x.useState(rr), [r, l] = x.useState(null), i = x.useMemo(() => {
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
      const b = c.length ? c.slice() : i.map((y) => y.code), m = b.indexOf(u), f = b.indexOf(d);
      return m === -1 || f === -1 ? c : (b.splice(m, 1), b.splice(f, 0, u), b);
    });
  }, [r, i]), o = x.useCallback((d) => l(d), []), p = x.useCallback(() => {
    l(null), s((d) => {
      const c = d.length ? d : i.map((u) => u.code);
      return nr(c), c;
    });
  }, [i]);
  return { orderedTabs: i, draggingCode: r, handleDragStart: o, handleDragEnd: p, reorderTo: n };
}
function lr() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function or() {
  const t = ie({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: lr,
    staleTime: 3e5,
    retry: !1
  }), a = t.data ?? [], s = a.map((l) => ({ value: l.id, label: l.name })), r = new Map(a.map((l) => [l.id, l.name]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
const qt = "apya.taskDetail.fullscreen", Q = {
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
function cr(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function fa({ taskId: t, presentation: a = "modal", onClose: s, switchToTask: r }) {
  var bt, ht, gt, yt, vt, jt, wt, Nt;
  const [l, i] = x.useState(t), { data: n, isLoading: o, isError: p, refetch: d } = ct(l), c = le(), u = Wt(), b = ta(n), m = aa(), f = or(), y = sa(l), g = xt(l), [k, S] = x.useState("general"), [P, G] = x.useState(!1), [K, z] = x.useState(!1), [W, R] = x.useState(!1), [O, U] = x.useState(null), [L, _] = x.useState(null), [J, V] = x.useState(!1), [X, q] = x.useState(!1), [ee, j] = x.useState(() => {
    try {
      return localStorage.getItem(qt) === "true";
    } catch {
      return !1;
    }
  });
  ea(l);
  const [v, h] = x.useState(null);
  n != null && n.id && n.id !== v && (h(n.id), V(!!n.isFavorite), q(!!n.isWatched)), x.useEffect(() => {
    b.isDirty ? u.markDirty() : u.markClean();
  });
  const C = x.useCallback(() => {
    Xt(), s == null || s();
  }, [s]), D = x.useCallback(() => u.requestClose(C), [u, C]), H = x.useCallback(() => {
    j((N) => {
      const T = !N;
      try {
        localStorage.setItem(qt, String(T));
      } catch {
      }
      return T;
    });
  }, []), oe = x.useMemo(
    () => da(y.assignedCodes),
    [y.assignedCodes]
  ), w = ir(oe), I = x.useMemo(() => {
    var N, T, B, ne, pe;
    return {
      subtasks: ((N = n == null ? void 0 : n.subTasks) == null ? void 0 : N.length) ?? 0,
      files: ((T = n == null ? void 0 : n.attachments) == null ? void 0 : T.length) ?? 0,
      dependencies: ((B = n == null ? void 0 : n.predecessorIds) == null ? void 0 : B.length) ?? 0,
      comments: ((ne = n == null ? void 0 : n.comments) == null ? void 0 : ne.length) ?? 0,
      checklist: ((pe = g.items) == null ? void 0 : pe.length) ?? 0
    };
  }, [n, g.items]), $ = Me.find((N) => N.code === k), M = g.items ?? [], Y = M.filter((N) => N.isDone).length, re = M.length ? Math.round(Y / M.length * 100) : 0, E = x.useCallback(async () => {
    if (!b.validate())
      return Q.err("Zorunlu alanları kontrol edin."), !1;
    G(!0);
    try {
      return await Promise.resolve(window.apya.platform.tasks.task.update(l, b.toUpdateDto())), await c.invalidateQueries({ queryKey: ["task-detail", l] }), se.emitResult(), z(!0), setTimeout(() => z(!1), 2e3), Q.ok("Görev başarıyla güncellendi."), !0;
    } catch (N) {
      return Q.err((N == null ? void 0 : N.message) || "Kaydedilemedi."), !1;
    } finally {
      G(!1);
    }
  }, [l, b, c]);
  x.useEffect(() => {
    const N = (T) => {
      if ((T.ctrlKey || T.metaKey) && T.key.toLowerCase() === "s") {
        T.preventDefault(), b.isDirty && !P && E();
        return;
      }
      if (T.key === "Escape") {
        if (O) {
          T.stopPropagation(), U(null);
          return;
        }
        W && (T.stopPropagation(), R(!1));
      }
    };
    return window.addEventListener("keydown", N), () => window.removeEventListener("keydown", N);
  }, [E, b.isDirty, P, O, W]);
  const A = () => {
    var N, T, B;
    return (B = (T = (N = window == null ? void 0 : window.apya) == null ? void 0 : N.platform) == null ? void 0 : T.tasks) == null ? void 0 : B.task;
  }, F = async () => {
    var T;
    const N = !J;
    V(N);
    try {
      await Promise.resolve((T = A()) == null ? void 0 : T.toggleFavorite(l));
    } catch (B) {
      V(!N), Q.err((B == null ? void 0 : B.message) || "Favori güncellenemedi.");
    }
  }, te = () => {
    if (!l) return;
    const N = document.createElement("a");
    N.href = `/Tasks/Detail/${l}?handler=Pdf`, N.rel = "noopener", document.body.appendChild(N), N.click(), N.remove();
  }, Z = async () => {
    var T;
    const N = !X;
    q(N);
    try {
      await Promise.resolve((T = A()) == null ? void 0 : T.toggleWatch(l)), Q.info(N ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (B) {
      q(!N), Q.err((B == null ? void 0 : B.message) || "Takip durumu güncellenemedi.");
    }
  }, je = async () => {
    var N, T;
    try {
      const B = await Promise.resolve((N = A()) == null ? void 0 : N.transfer(l, {
        mode: 2,
        // Copy
        targetProjectIds: n != null && n.projectId ? [n.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await c.invalidateQueries({ queryKey: ["task-detail"] }), Q.ok("Görev çoğaltıldı.");
      const ne = (T = B == null ? void 0 : B.createdTaskIds) == null ? void 0 : T[0];
      ne && i(ne);
    } catch (B) {
      Q.err((B == null ? void 0 : B.message) || "Görev çoğaltılamadı.");
    }
  }, de = async () => {
    var N;
    try {
      await Promise.resolve((N = A()) == null ? void 0 : N.updateStatus(l, 4)), await c.invalidateQueries({ queryKey: ["task-detail", l] }), Q.info("Görev arşivlendi (Tamamlandı).");
    } catch (T) {
      Q.err((T == null ? void 0 : T.message) || "Görev arşivlenemedi.");
    }
  }, ha = async () => {
    var N;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?"))
      try {
        await Promise.resolve((N = A()) == null ? void 0 : N.delete(l)), Q.info("Görev silindi."), u.markClean(), C();
      } catch (T) {
        Q.err((T == null ? void 0 : T.message) || "Görev silinemedi.");
      }
  }, ga = async (N) => {
    try {
      await y.addFeature(N), S(N), Q.ok("Özellik başarıyla eklendi.");
    } catch (T) {
      Q.err((T == null ? void 0 : T.message) || "Özellik eklenemedi.");
    }
  }, pt = async (N) => {
    try {
      await y.removeFeature(N), S("general"), Q.info("Özellik görevden kaldırıldı.");
    } catch (T) {
      Q.err((T == null ? void 0 : T.message) || "Özellik kaldırılamadı.");
    }
  }, ya = async (N) => {
    var ne, pe, ce, Ce, we, Fe, Ee;
    const T = ((Ce = (ce = (pe = (ne = window == null ? void 0 : window.apya) == null ? void 0 : ne.platform) == null ? void 0 : pe.application) == null ? void 0 : ce.projects) == null ? void 0 : Ce.project) ?? ((Ee = (Fe = (we = window == null ? void 0 : window.apya) == null ? void 0 : we.platform) == null ? void 0 : Fe.projects) == null ? void 0 : Ee.project);
    if (!(T != null && T.create)) throw new Error("Proje servisi yüklenmedi.");
    const B = await Promise.resolve(T.create({
      name: N,
      code: cr(N),
      currency: "TRY"
    }));
    return await c.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), Q.ok(`“${N}” projesi oluşturuldu.`), (B == null ? void 0 : B.id) ?? B;
  }, va = async ({ mode: N, targetProjectIds: T, include: B }) => {
    var ne, pe;
    try {
      const ce = await Promise.resolve((ne = A()) == null ? void 0 : ne.transfer(l, {
        mode: N === "move" ? 1 : 2,
        targetProjectIds: T,
        include: B
      }));
      await c.invalidateQueries({ queryKey: ["task-detail", l] });
      const Ce = T.map((Fe) => {
        var Ee;
        return (Ee = f.options.find((wa) => wa.value === Fe)) == null ? void 0 : Ee.label;
      }).filter(Boolean), we = ((pe = ce == null ? void 0 : ce.createdTaskIds) == null ? void 0 : pe.length) ?? 0;
      Q.ok(N === "move" ? we ? `“${Ce[0]}” projesine taşındı, ${we} projeye kopyalandı.` : `Görev “${Ce[0]}” projesine taşındı.` : we > 1 ? `${we} projeye kopyalandı.` : `Kopya “${Ce[0]}” projesinde oluşturuldu.`), U(null);
    } catch (ce) {
      Q.err((ce == null ? void 0 : ce.message) || "Transfer tamamlanamadı.");
    }
  }, ja = k === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)] gap-5 items-start", children: [
    /* @__PURE__ */ e.jsx(
      Fs,
      {
        task: n,
        onFieldChange: b.setField,
        descriptionValue: b.values.description,
        checklist: g,
        currentUserName: ((ht = (bt = window == null ? void 0 : window.abp) == null ? void 0 : bt.currentUser) == null ? void 0 : ht.name) || ((yt = (gt = window == null ? void 0 : window.abp) == null ? void 0 : gt.currentUser) == null ? void 0 : yt.userName) || "Ben"
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5", children: /* @__PURE__ */ e.jsx(Ls, { task: n, nameById: m.nameById }) })
  ] }) : _s(k) ? /* @__PURE__ */ e.jsx(
    Gt,
    {
      code: k,
      onRemoveFeature: pt,
      onOpenPicker: () => R(!0),
      canRemove: !($ != null && $.isCore)
    }
  ) : /* @__PURE__ */ e.jsx(x.Suspense, { fallback: /* @__PURE__ */ e.jsx(be, { className: "h-48 w-full" }), children: $ != null && $.component ? /* @__PURE__ */ e.jsx(
    $.component,
    {
      taskId: l,
      task: n,
      onOpenSubtask: _
    }
  ) : /* @__PURE__ */ e.jsx(
    Gt,
    {
      code: k,
      onRemoveFeature: pt,
      onOpenPicker: () => R(!0),
      canRemove: !($ != null && $.isCore)
    }
  ) }), mt = o ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(be, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(be, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(be, { className: "h-64 w-full" })
  ] }) : p ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(ae, { variant: "ghost", onClick: () => d(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col flex-1 min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      Es,
      {
        task: n,
        presentation: a,
        onClose: D,
        isFullscreen: ee,
        onToggleFullscreen: H,
        onFieldChange: b.setField,
        statusValue: b.values.status,
        titleValue: n == null ? void 0 : n.title,
        isPrivateValue: b.values.isPrivate,
        isFavorite: J,
        onToggleFavorite: F,
        isWatched: X,
        onToggleWatch: Z,
        onDuplicate: je,
        onArchive: de,
        onDelete: ha,
        onOpenTransfer: (N) => U({ mode: N }),
        onSaveAsTemplate: () => Q.info("Şablon olarak kaydetme yakında."),
        onConvertToSubtask: () => Q.info("Alt göreve dönüştürme yakında."),
        onExportPdf: te
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        Ps,
        {
          task: n,
          assigneeOptions: m.options,
          projectOptions: f.options,
          onFieldChange: b.setField,
          statusValue: b.values.status,
          priorityValue: b.values.priority,
          assigneeValue: b.values.assigneeId,
          projectValue: b.values.projectId,
          dueDateValue: b.values.dueDate,
          startDateValue: b.values.startDate,
          tagsValue: b.values.tagNames,
          progressPercent: re,
          progressNote: `${Y}/${M.length} madde`,
          onOpenTransfer: (N) => U({ mode: N })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        a === "page" && /* @__PURE__ */ e.jsx(
          As,
          {
            activeTab: k,
            onTabChange: S,
            orderedTabs: w.orderedTabs,
            draggingCode: w.draggingCode,
            onDragStart: w.handleDragStart,
            onDragEnd: w.handleDragEnd,
            onReorderTo: w.reorderTo,
            onReorderDrop: () => Q.info("Sekme sırası güncellendi."),
            onOpenPicker: () => R(!0),
            counts: I
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: a === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            Is,
            {
              activeTab: k,
              onTabChange: S,
              orderedTabs: w.orderedTabs,
              draggingCode: w.draggingCode,
              onDragStart: w.handleDragStart,
              onDragEnd: w.handleDragEnd,
              onReorderTo: w.reorderTo,
              onReorderDrop: () => Q.info("Sekme sırası güncellendi."),
              onOpenPicker: () => R(!0),
              counts: I,
              isDirty: b.isDirty
            }
          ) }),
          /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised", children: ja })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(
      Gs,
      {
        lastSavedAt: n == null ? void 0 : n.lastModificationTime,
        isDirty: b.isDirty,
        isSaving: P,
        justSaved: K,
        onCancel: D,
        onSave: E
      }
    )
  ] }), ft = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      Vs,
      {
        open: W,
        onClose: () => R(!1),
        assignedCodes: y.assignedCodes,
        onAddFeature: ga,
        onGoToTab: S
      }
    ),
    /* @__PURE__ */ e.jsx(
      Ws,
      {
        open: !!O,
        mode: (O == null ? void 0 : O.mode) ?? "move",
        onClose: () => U(null),
        onConfirm: va,
        projectOptions: f.options,
        currentProjectId: b.values.projectId,
        counts: I,
        onCreateProject: ya
      }
    ),
    L && /* @__PURE__ */ e.jsx(
      sr,
      {
        subtaskId: L,
        parentCode: n == null ? void 0 : n.code,
        onClose: () => _(null),
        onOpenFull: (N) => {
          _(null), (r ?? i)(N);
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
    /* @__PURE__ */ e.jsx(Ht, { open: !0, onOpenChange: (N) => {
      N || D();
    }, children: /* @__PURE__ */ e.jsx(
      Vt,
      {
        title: n != null && n.title ? `Görev Detayı: ${n.title}` : "Görev Detayı",
        fullscreen: ee,
        className: ee ? "p-0 rounded-xl border border-default shadow-xl short:h-[100svh]" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl short:h-[100svh]",
        onInteractOutside: (N) => {
          var T, B;
          N.preventDefault(), !(W || O || L) && ((B = (T = N.target) == null ? void 0 : T.closest) != null && B.call(T, "[data-apya-overlay]") || D());
        },
        onEscapeKeyDown: (N) => {
          if (W || O || L) {
            N.preventDefault();
            return;
          }
          N.preventDefault(), D();
        },
        children: mt
      }
    ) }),
    ft
  ] });
}
function dr() {
  var a;
  const t = x.useSyncExternalStore(
    se.subscribe,
    se.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(He, { children: /* @__PURE__ */ e.jsx(
    fa,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        se.close(), se.emitResult();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(He, { children: /* @__PURE__ */ e.jsx(
    xa,
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
function ba() {
  var s;
  try {
    const r = new URLSearchParams(window.location.search).get("taskui");
    if (r === "v1" || r === "v2" || r === "v3") return r;
  } catch {
  }
  const t = document.getElementById("task-detail-island"), a = (s = t == null ? void 0 : t.dataset) == null ? void 0 : s.taskui;
  return a === "v1" || a === "v2" ? a : "v3";
}
function xr() {
  return ba() === "v2";
}
function ur() {
  return ba() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = ur();
window.apya.taskDetailV2Enabled = xr() && !window.apya.taskDetailV3Enabled;
const Yt = {
  open: (t) => {
    se.open(t);
  },
  close: () => se.close(),
  onResult: (t) => se.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(Yt) : window.apya.taskDetail = Yt;
function Ut() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = _t(t), t._reactRoot.render(/* @__PURE__ */ e.jsx(dr, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = Jt();
    a && se.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Ut) : Ut();
function pr({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(He, { children: /* @__PURE__ */ e.jsx(
    fa,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(He, { children: /* @__PURE__ */ e.jsx(
    xa,
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
  t && _t(at).render(/* @__PURE__ */ e.jsx(pr, { taskId: t }));
}
