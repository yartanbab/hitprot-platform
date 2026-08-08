import { j as e, r as d, d as Z, b as Ce } from "./react-vendor.js";
/* empty css      */
import { a as oe } from "./QueryProvider.js";
import { u as te, a as _, b as V } from "./query-vendor.js";
import { D as De, l as Se, e as G, B as v, I as $, S as Y } from "./Dialog.js";
import { C as nt } from "./Combobox.js";
import { r as ot } from "./httpClient.js";
import { R as Ee, T as ze, P as Ae, C as Fe, A as Le } from "./ui-vendor.js";
function ct({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: i,
  footer: l,
  children: o
}) {
  return /* @__PURE__ */ e.jsx(
    De,
    {
      open: t,
      onOpenChange: (n) => {
        n || a();
      },
      children: /* @__PURE__ */ e.jsx(
        Se,
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
function dt({ title: t, header: a, footer: s, children: r }) {
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
function mt({ isPrivate: t }) {
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
const ee = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, xe = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function ut({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: i,
  fullscreen: l = !1
}) {
  const [o, n] = d.useState(!1), m = d.useRef(null);
  d.useEffect(() => {
    if (!o) return;
    const y = (f) => {
      m.current && !m.current.contains(f.target) && n(!1);
    }, c = (f) => {
      f.key === "Escape" && n(!1);
    };
    return document.addEventListener("mousedown", y), document.addEventListener("keydown", c), () => {
      document.removeEventListener("mousedown", y), document.removeEventListener("keydown", c);
    };
  }, [o]);
  const p = ee[t == null ? void 0 : t.status] ?? ee[1], x = xe[t == null ? void 0 : t.priority] ?? xe[2], u = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), n(!1);
  }, h = () => {
    var c, f, b, N;
    const y = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (c = navigator.clipboard) == null || c.writeText(y), (N = (b = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : b.info) == null || N.call(b, "Bağlantı kopyalandı."), n(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(G, { variant: p.variant, children: p.text }),
        /* @__PURE__ */ e.jsx(G, { variant: x.variant, children: x.text }),
        /* @__PURE__ */ e.jsx(mt, { isPrivate: t == null ? void 0 : t.isPrivate })
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
      /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: m, children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": o,
            onClick: () => n((y) => !y),
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
const xt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function pt({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: i }) {
  const l = xt(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: l ? `Son kayıt: ${l}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(v, { variant: "secondary", onClick: r, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        v,
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
const ye = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", ft = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function K({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function ht({ value: t, onChange: a }) {
  const [s, r] = d.useState(""), i = () => {
    const l = s.trim();
    l && !t.includes(l) && a([...t, l]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((l) => /* @__PURE__ */ e.jsxs(G, { variant: "neutral", children: [
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
      $,
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
function yt({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: i = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(K, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      $,
      {
        id: "task-title",
        value: t.title,
        onChange: (l) => s("title", l.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(K, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (l) => s("status", Number(l.target.value)),
          className: ye,
          children: Object.entries(ee).map(([l, o]) => /* @__PURE__ */ e.jsx("option", { value: l, children: o.text }, l))
        }
      ) }),
      /* @__PURE__ */ e.jsx(K, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (l) => s("priority", Number(l.target.value)),
          className: ye,
          children: Object.entries(xe).map(([l, o]) => /* @__PURE__ */ e.jsx("option", { value: l, children: o.text }, l))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(K, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      nt,
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
      /* @__PURE__ */ e.jsx(K, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        $,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (l) => s("startDate", l.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(K, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        $,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (l) => s("dueDate", l.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(K, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(ht, { value: t.tagNames, onChange: (l) => s("tagNames", l) }) }),
    /* @__PURE__ */ e.jsx(K, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (l) => s("description", l.target.value),
        className: ft
      }
    ) })
  ] });
}
const be = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function W({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function bt({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(W, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(W, { label: "Oluşturulma zamanı", value: be(t.creationTime) }),
      /* @__PURE__ */ e.jsx(W, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(W, { label: "Son güncelleme zamanı", value: be(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(W, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const vt = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", gt = "border-brand-500 text-text-primary";
function jt({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: i }) {
  const l = d.useRef(/* @__PURE__ */ new Map()), o = (m) => {
    var p;
    s(m.code), (p = l.current.get(m.code)) == null || p.focus();
  }, n = (m, p) => {
    m.key === "ArrowRight" ? (m.preventDefault(), o(t[(p + 1) % t.length])) : m.key === "ArrowLeft" ? (m.preventDefault(), o(t[(p - 1 + t.length) % t.length])) : m.key === "Home" ? (m.preventDefault(), o(t[0])) : m.key === "End" && (m.preventDefault(), o(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((m, p) => {
      const x = m.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (u) => {
            u ? l.current.set(m.code, u) : l.current.delete(m.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${m.code}`,
          "aria-selected": x,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: x ? 0 : -1,
          onClick: () => s(m.code),
          onKeyDown: (u) => n(u, p),
          className: `${vt} ${x ? gt : ""}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa ${m.icon}`, "aria-hidden": "true" }),
            m.title
          ]
        },
        m.code
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
function Nt({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [i, l] = d.useState(""), o = d.useMemo(() => {
    const n = i.trim().toLocaleLowerCase("tr-TR"), m = n ? t.filter((x) => x.title.toLocaleLowerCase("tr-TR").includes(n)) : t, p = /* @__PURE__ */ new Map();
    return m.forEach((x) => {
      const u = p.get(x.category) ?? [];
      u.push(x), p.set(x.category, u);
    }), p;
  }, [t, i]);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Özellik ekle",
      className: "absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl",
      children: [
        /* @__PURE__ */ e.jsx(
          $,
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
          [...o.entries()].map(([n, m]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: wt[n] ?? n }),
            m.map((p) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa ${p.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: p.title }),
              !p.implemented && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              p.implemented && !p.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === p.code,
                  onClick: () => a(p.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              p.implemented && p.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === p.code,
                  onClick: () => s(p.code),
                  className: "text-[13px] font-medium text-text-negative hover:underline disabled:opacity-50",
                  children: "Kaldır"
                }
              )
            ] }, p.code))
          ] }, n))
        ] })
      ]
    }
  );
}
function kt({ trail: t = [], current: a, onNavigate: s }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((r) => /* @__PURE__ */ e.jsxs(Z.Fragment, { children: [
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
function Tt(t) {
  var s, r, i;
  const a = (i = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : i.task;
  return a ? Promise.resolve(a.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Re(t) {
  return te({
    queryKey: ["task-detail", t],
    queryFn: () => Tt(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function ce(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
function Pe() {
  const [t, a] = d.useState(!1), [s, r] = d.useState(!1), i = d.useRef(null), l = d.useCallback(() => a(!0), []), o = d.useCallback(() => a(!1), []);
  d.useEffect(() => {
    if (!t) return;
    const p = (x) => {
      x.preventDefault(), x.returnValue = "";
    };
    return window.addEventListener("beforeunload", p), () => window.removeEventListener("beforeunload", p);
  }, [t]);
  const n = d.useCallback((p) => {
    if (!t) {
      p == null || p();
      return;
    }
    i.current = p ?? null, r(!0);
  }, [t]), m = d.useCallback((p) => {
    const x = i.current;
    return r(!1), i.current = null, p === "discard" && (a(!1), x == null || x()), p === "save" ? x : null;
  }, []);
  return { isDirty: t, markDirty: l, markClean: o, requestClose: n, pendingClose: s, resolvePendingClose: m };
}
const Ct = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, fe = "task";
function Ie() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(fe);
  return t && Ct.test(t) ? t : null;
}
function Be() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(fe), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function Ge(t, a) {
  const s = d.useRef(a);
  s.current = a, d.useEffect(() => {
    if (!t || Ie() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(fe, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), d.useEffect(() => {
    const r = () => {
      var i;
      (i = s.current) == null || i.call(s);
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
    tagNames: (t.tags ?? []).map((a) => a.name)
  } : Dt;
}
function Ke(t) {
  const [a, s] = d.useState(t == null ? void 0 : t.id), r = d.useMemo(() => St(t), [t]), [i, l] = d.useState(r), [o, n] = d.useState({});
  (t == null ? void 0 : t.id) !== a && (s(t == null ? void 0 : t.id), l(r), n({}));
  const m = d.useCallback((y, c) => {
    l((f) => ({ ...f, [y]: c }));
  }, []), p = d.useMemo(
    () => JSON.stringify(i) !== JSON.stringify(r),
    [i, r]
  ), x = d.useCallback(() => {
    const y = {};
    return i.title.trim() || (y.title = "Başlık zorunlu."), i.startDate || (y.startDate = "Başlangıç tarihi zorunlu."), i.dueDate && i.startDate && i.dueDate < i.startDate && (y.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), n(y), Object.keys(y).length === 0;
  }, [i]), u = d.useCallback(() => ({
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
    l(r), n({});
  }, [r]);
  return { values: i, setField: m, isDirty: p, errors: o, validate: x, toUpdateDto: u, reset: h };
}
function ve(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function Et() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Me() {
  var i;
  const t = te({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Et,
    staleTime: 3e5,
    retry: !1
  }), a = ((i = t.data) == null ? void 0 : i.items) ?? [], s = a.map((l) => ({ value: l.id, label: ve(l) })), r = new Map(a.map((l) => [l.id, ve(l)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function pe() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function zt(t) {
  const a = pe();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ye(t) {
  const a = _(), s = ["task-features", t], r = te({
    queryKey: s,
    queryFn: () => zt(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), l = V({
    mutationFn: (n) => Promise.resolve(pe().addFeature(t, n)),
    onSuccess: i
  }), o = V({
    mutationFn: (n) => Promise.resolve(pe().removeFeature(t, n)),
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
function At({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, i] = d.useState(""), [l, o] = d.useState(!1), [n, m] = d.useState(null), p = _(), x = (a == null ? void 0 : a.subTasks) ?? [], u = () => p.invalidateQueries({ queryKey: ["task-detail", t] }), h = async () => {
    var f, b, N;
    const c = r.trim();
    if (c) {
      o(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: c,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), i(""), await u();
      } catch (k) {
        (N = (b = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : b.error) == null || N.call(b, (k == null ? void 0 : k.message) || "Alt görev eklenemedi.");
      } finally {
        o(!1);
      }
    }
  }, y = async (c) => {
    var f, b, N;
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(c)), await u();
    } catch (k) {
      (N = (b = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : b.error) == null || N.call(b, (k == null ? void 0 : k.message) || "Alt görev silinemedi.");
    } finally {
      m(null);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        $,
        {
          value: r,
          onChange: (c) => i(c.target.value),
          onKeyDown: (c) => {
            c.key === "Enter" && h();
          },
          placeholder: "Yeni alt görev başlığı",
          disabled: l
        }
      ),
      /* @__PURE__ */ e.jsx(v, { variant: "secondary", onClick: h, disabled: l || !r.trim(), children: "Alt Görev Ekle" })
    ] }),
    x.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz alt görev yok." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: x.map((c) => {
      var f, b;
      return /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between py-2", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => s == null ? void 0 : s(c.id, c.title),
            className: "text-left text-sm font-medium text-text-primary hover:underline",
            children: c.title
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(G, { variant: ((f = ee[c.status]) == null ? void 0 : f.variant) ?? "neutral", children: ((b = ee[c.status]) == null ? void 0 : b.text) ?? c.status }),
          n === c.id ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary", children: "Emin misiniz?" }),
            /* @__PURE__ */ e.jsx(v, { variant: "destructive", onClick: () => y(c.id), children: "Evet, sil" }),
            /* @__PURE__ */ e.jsx(v, { variant: "ghost", onClick: () => m(null), children: "Vazgeç" })
          ] }) : /* @__PURE__ */ e.jsx(v, { variant: "ghost", onClick: () => m(c.id), "aria-label": `${c.title} alt görevini sil`, children: "Sil" })
        ] })
      ] }, c.id);
    }) })
  ] });
}
function Oe() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Ft(t) {
  const a = Oe();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function Lt(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, i = ot();
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
function Rt(t) {
  const a = _(), s = ["task-attachments", t], r = te({
    queryKey: s,
    queryFn: () => Ft(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), l = V({
    mutationFn: (n) => Lt(t, n),
    onSuccess: i
  }), o = V({
    mutationFn: (n) => Promise.resolve(Oe().deleteAttachment(n)),
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
function Pt(t) {
  return `${Math.round(t / 1024)} KB`;
}
function It({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: i } = Rt(t), l = d.useRef(null), o = async (m) => {
    var x, u, h, y, c, f, b;
    const p = (x = m.target.files) == null ? void 0 : x[0];
    if (p)
      try {
        await s(p), (y = (h = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : h.success) == null || y.call(h, "Dosya yüklendi.");
      } catch (N) {
        (b = (f = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : f.error) == null || b.call(f, (N == null ? void 0 : N.message) || "Dosya yüklenemedi.");
      } finally {
        l.current && (l.current.value = "");
      }
  }, n = async (m, p) => {
    var x, u, h;
    try {
      await r(m);
    } catch (y) {
      (h = (u = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : u.error) == null || h.call(u, (y == null ? void 0 : y.message) || `${p} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("input", { ref: l, type: "file", onChange: o, className: "text-sm", disabled: i }),
      i && /* @__PURE__ */ e.jsx("span", { className: "text-sm text-text-tertiary", children: "Yükleniyor…" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: a.map((m) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between py-2", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("a", { href: m.downloadUrl, target: "_blank", rel: "noreferrer", className: "text-sm font-medium text-text-primary hover:underline", children: m.fileName }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-text-tertiary", children: [
          Pt(m.fileSize),
          " — ",
          m.uploaderName
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(v, { variant: "ghost", onClick: () => n(m.id, m.fileName), "aria-label": `${m.fileName} dosyasini sil`, children: "Sil" })
    ] }, m.id)) })
  ] });
}
function le() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Bt(t) {
  const a = le();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Gt(t) {
  const a = _(), s = ["task-checklist", t], r = te({
    queryKey: s,
    queryFn: () => Bt(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), l = V({
    mutationFn: (m) => Promise.resolve(le().addChecklistItem(t, m)),
    onSuccess: i
  }), o = V({
    mutationFn: (m) => Promise.resolve(le().toggleChecklistItem(m)),
    onSuccess: i
  }), n = V({
    mutationFn: (m) => Promise.resolve(le().deleteChecklistItem(m)),
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
function qe({ taskId: t }) {
  const { items: a, addItem: s, toggleItem: r, removeItem: i } = Gt(t), [l, o] = d.useState(""), n = async () => {
    var u, h, y;
    const x = l.trim();
    if (x)
      try {
        await s(x), o("");
      } catch (c) {
        (y = (h = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : h.error) == null || y.call(h, (c == null ? void 0 : c.message) || "Madde eklenemedi.");
      }
  }, m = async (x) => {
    var u, h, y;
    try {
      await r(x);
    } catch (c) {
      (y = (h = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : h.error) == null || y.call(h, (c == null ? void 0 : c.message) || "Madde güncellenemedi.");
    }
  }, p = async (x, u) => {
    var h, y, c;
    try {
      await i(x);
    } catch (f) {
      (c = (y = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : y.error) == null || c.call(y, (f == null ? void 0 : f.message) || `${u} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        $,
        {
          value: l,
          onChange: (x) => o(x.target.value),
          onKeyDown: (x) => {
            x.key === "Enter" && n();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ e.jsx(v, { variant: "secondary", onClick: n, disabled: !l.trim(), children: "Ekle" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz madde eklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "space-y-1.5", children: a.map((x) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-2 py-1", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: x.isDone,
            onChange: () => m(x.id)
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: x.isDone ? "text-text-tertiary line-through" : "text-text-primary", children: x.text })
      ] }),
      /* @__PURE__ */ e.jsx(v, { variant: "ghost", onClick: () => p(x.id, x.text), "aria-label": `${x.text} maddesini sil`, children: "Sil" })
    ] }, x.id)) })
  ] });
}
function Ue({ taskId: t, task: a }) {
  const [s, r] = d.useState(""), [i, l] = d.useState(null), [o, n] = d.useState(""), [m, p] = d.useState(!1), x = _(), u = (a == null ? void 0 : a.comments) ?? [], h = async (c) => {
    var f, b, N, k, D, S;
    if (c == null || c.preventDefault(), !(!s.trim() || m)) {
      p(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), x.invalidateQueries({ queryKey: ["task-detail", t] }), (N = (b = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : b.success) == null || N.call(b, "Yorum eklendi.");
      } catch (E) {
        (S = (D = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : D.error) == null || S.call(D, (E == null ? void 0 : E.message) || "Yorum eklenemedi.");
      } finally {
        p(!1);
      }
    }
  }, y = async (c) => {
    var f, b, N, k, D, S;
    if (!(!o.trim() || m)) {
      p(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(c, o.trim())
        ), n(""), l(null), x.invalidateQueries({ queryKey: ["task-detail", t] }), (N = (b = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : b.success) == null || N.call(b, "Yanıt eklendi.");
      } catch (E) {
        (S = (D = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : D.error) == null || S.call(D, (E == null ? void 0 : E.message) || "Yanıt eklenemedi.");
      } finally {
        p(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("form", { onSubmit: h, className: "rounded-lg border border-default p-3 bg-surface-base", children: [
      /* @__PURE__ */ e.jsx(
        "textarea",
        {
          rows: 3,
          value: s,
          onChange: (c) => r(c.target.value),
          placeholder: "Bir yorum veya güncelleme yazın...",
          className: "w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ e.jsx(
        v,
        {
          type: "submit",
          variant: "primary",
          disabled: !s.trim() || m,
          isLoading: m,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    u.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: u.map((c) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: c.creatorUserName || c.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: c.creationTime ? new Date(c.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: c.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        v,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => l(i === c.id ? null : c.id),
          children: "Yanıtla"
        }
      ) }),
      i === c.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: o,
            onChange: (f) => n(f.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(v, { variant: "ghost", size: "sm", onClick: () => l(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(v, { variant: "primary", size: "sm", disabled: !o.trim() || m, onClick: () => y(c.id), children: "Gönder" })
        ] })
      ] }),
      c.replies && c.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: c.replies.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: f.creatorUserName || f.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: f.creationTime ? new Date(f.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: f.text })
      ] }, f.id)) })
    ] }, c.id)) })
  ] });
}
function Kt({ task: t }) {
  const a = [];
  return t != null && t.creationTime && a.push({
    id: "created",
    type: "create",
    icon: "fa-plus",
    title: "Görev oluşturuldu",
    user: t.creatorUserName || t.creatorName || "Sistem / Kullanıcı",
    time: new Date(t.creationTime).toLocaleString("tr-TR")
  }), t != null && t.lastModificationTime && a.push({
    id: "modified",
    type: "update",
    icon: "fa-pen",
    title: "Görev güncellendi",
    user: t.lastModifierUserName || t.lastModifierName || "Kullanıcı",
    time: new Date(t.lastModificationTime).toLocaleString("tr-TR")
  }), t != null && t.attachments && t.attachments.length > 0 && a.push({
    id: "files",
    type: "file",
    icon: "fa-paperclip",
    title: `${t.attachments.length} dosya eki mevcut`,
    user: "Sistem",
    time: ""
  }), /* @__PURE__ */ e.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx("h4", { className: "text-sm font-semibold text-text-primary", children: "Aktivite Zaman Çizelgesi" }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Aktivite kaydı bulunamadı." }) : /* @__PURE__ */ e.jsx("div", { className: "relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-subtle", children: a.map((s) => /* @__PURE__ */ e.jsxs("div", { className: "relative flex items-start justify-between gap-3 text-xs", children: [
      /* @__PURE__ */ e.jsx("span", { className: "absolute -left-6 flex h-4 w-4 items-center justify-center rounded-full bg-surface-raised text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: `fa ${s.icon} text-[10px]`, "aria-hidden": "true" }) }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("p", { className: "font-medium text-text-primary", children: s.title }),
        s.user && /* @__PURE__ */ e.jsxs("span", { className: "text-text-tertiary", children: [
          "Yapan: ",
          s.user
        ] })
      ] }),
      s.time && /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary whitespace-nowrap", children: s.time })
    ] }, s.id)) })
  ] });
}
function Mt({ task: t }) {
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
function Yt({ task: t }) {
  var p;
  const a = typeof window < "u" && !!((p = window == null ? void 0 : window.abp) != null && p.auth), s = a ? ce("Platform.Expenses.Default") : !0, r = a ? ce("Platform.Incomes.Default") : !0;
  if (!s && !r)
    return /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Finansal verileri görüntüleme yetkiniz bulunmuyor." });
  const i = (t == null ? void 0 : t.expenses) || [], l = (t == null ? void 0 : t.incomes) || [], o = i.reduce((x, u) => x + (u.amount || 0), 0), n = l.reduce((x, u) => x + (u.amount || 0), 0), m = n - o;
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated", children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Toplam Gelir" }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-base font-semibold text-text-positive", children: [
          n.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
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
        /* @__PURE__ */ e.jsxs("p", { className: `text-base font-semibold ${m >= 0 ? "text-text-positive" : "text-text-negative"}`, children: [
          m.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
          " ₺"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "rounded-lg border border-subtle p-3 bg-surface-base text-xs text-text-secondary", children: /* @__PURE__ */ e.jsx("p", { children: "Göreve bağlı detaylı harcama veya fatura ekleme işlemleri Finans Modülü üzerinden senkronize yönetilmektedir." }) })
  ] });
}
function ie({ task: t }) {
  const a = (t == null ? void 0 : t.predecessorIds) || [];
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("h4", { className: "text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-diagram-project text-text-tertiary", "aria-hidden": "true" }),
        "Öncül Görev Bağımlılıkları (",
        a.length,
        ")"
      ] }),
      a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Bu görevin başlamasını engelleyen öncül bir görev tanımlanmamış." }) : /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-text-secondary", children: [
        a.length,
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
    component: At
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
    component: It
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
    component: qe
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
    component: Ue
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
    component: ie
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
    component: ie
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
    component: ie
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
    component: ie
  }
];
function $e(t = []) {
  const a = new Set(t);
  return Ve.filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function Ot(t = []) {
  const a = new Set(t);
  return Ve.filter((s) => !s.isCore).filter((s) => !s.permission || ce(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let Q = null;
const ne = /* @__PURE__ */ new Set(), me = /* @__PURE__ */ new Set();
function ge() {
  ne.forEach((t) => t());
}
function qt(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const L = {
  open(t) {
    const a = qt(t);
    !a || a === Q || (Q = a, ge());
  },
  close() {
    Q !== null && (Q = null, ge());
  },
  subscribe(t) {
    return ne.add(t), () => ne.delete(t);
  },
  getSnapshot() {
    return Q;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && me.add(t);
  },
  emitResult() {
    me.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    Q = null, ne.clear(), me.clear();
  }
}, je = "apya.taskDetail.fullscreen";
function _e({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, i] = d.useState(t), [l, o] = d.useState([]), { data: n, isLoading: m, isError: p, refetch: x } = Re(r), u = Pe(), h = Ke(n), y = Me(), c = Ye(r), [f, b] = d.useState("general"), [N, k] = d.useState(!1), D = Z.useRef(null), S = d.useMemo(
    () => $e(c.assignedCodes),
    [c.assignedCodes]
  ), E = d.useMemo(
    () => Ot(c.assignedCodes),
    [c.assignedCodes]
  ), R = S.find((g) => g.code === f) ?? S[0];
  Z.useEffect(() => {
    R.code !== f && b(R.code);
  }, [R, f]);
  const H = R == null ? void 0 : R.component, O = _(), [ae, se] = d.useState(
    () => {
      var g;
      return ((g = window.localStorage) == null ? void 0 : g.getItem(je)) === "1";
    }
  ), [T, z] = d.useState(!1), A = d.useCallback(() => {
    Be(), s == null || s();
  }, [s]);
  Ge(t, A), Z.useEffect(() => {
    h.isDirty ? u.markDirty() : u.markClean();
  });
  const I = d.useCallback(() => u.requestClose(A), [u, A]), P = d.useCallback(() => {
    se((g) => {
      var w;
      const j = !g;
      return (w = window.localStorage) == null || w.setItem(je, j ? "1" : "0"), j;
    });
  }, []), q = ce("Platform.Tasks.Delete"), [B, de] = d.useState(!1), [Je, he] = d.useState(!1), We = d.useCallback(async () => {
    var g, j, w, F, C, J;
    he(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (w = (j = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : j.info) == null || w.call(j, "Başarıyla silindi."), de(!1), u.markClean(), A();
    } catch (U) {
      (J = (C = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : C.error) == null || J.call(C, (U == null ? void 0 : U.message) || "Görev silinemedi.");
    } finally {
      he(!1);
    }
  }, [r, u, A]), re = d.useCallback(async () => {
    var g, j, w, F, C, J;
    if (!h.validate()) return !1;
    z(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, h.toUpdateDto())
      ), await O.invalidateQueries({ queryKey: ["task-detail", r] }), L.emitResult(), (w = (j = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : j.success) == null || w.call(j, "Kaydedildi."), !0;
    } catch (U) {
      return (J = (C = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : C.error) == null || J.call(C, (U == null ? void 0 : U.message) || "Kaydedilemedi."), !1;
    } finally {
      z(!1);
    }
  }, [r, h, u, O]), Xe = d.useCallback(() => {
    re();
  }, [re]), et = d.useCallback(async () => {
    const g = u.resolvePendingClose("save");
    await re() && (g == null || g());
  }, [u, re]), tt = d.useCallback((g, j) => {
    u.requestClose(() => {
      o((w) => [...w, { id: r, title: (n == null ? void 0 : n.title) ?? "" }]), i(g), b("general"), u.markClean();
    });
  }, [u, r, n]), at = d.useCallback((g) => {
    u.requestClose(() => {
      o((j) => {
        const w = j.findIndex((F) => F.id === g);
        return w === -1 ? j : j.slice(0, w);
      }), i(g), b("general"), u.markClean();
    });
  }, [u]), st = d.useCallback(async (g) => {
    var j, w, F;
    try {
      await c.addFeature(g), b(g), k(!1);
    } catch (C) {
      (F = (w = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : w.error) == null || F.call(w, (C == null ? void 0 : C.message) || "Özellik eklenemedi.");
    }
  }, [c]), rt = d.useCallback(async (g) => {
    var j, w, F;
    try {
      await c.removeFeature(g), b((C) => C === g ? "general" : C);
    } catch (C) {
      (F = (w = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : w.error) == null || F.call(w, (C == null ? void 0 : C.message) || "Özellik kaldırılamadı.");
    }
  }, [c]);
  Z.useEffect(() => {
    if (!N) return;
    const g = (w) => {
      D.current && !D.current.contains(w.target) && k(!1);
    }, j = (w) => {
      w.key === "Escape" && k(!1);
    };
    return document.addEventListener("mousedown", g), document.addEventListener("keydown", j), () => {
      document.removeEventListener("mousedown", g), document.removeEventListener("keydown", j);
    };
  }, [N]);
  const it = m ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(Y, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(Y, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(Y, { className: "h-24 w-full" })
  ] }) : p ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(v, { variant: "ghost", onClick: () => x(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      kt,
      {
        trail: l,
        current: { id: r, title: (n == null ? void 0 : n.title) ?? "" },
        onNavigate: at
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: D, children: [
      /* @__PURE__ */ e.jsx(
        jt,
        {
          tabs: S,
          activeCode: R.code,
          onSelect: (g) => {
            b(g), k(!1);
          },
          onOpenPicker: () => k((g) => !g),
          pickerOpen: N
        }
      ),
      N && /* @__PURE__ */ e.jsx(
        Nt,
        {
          entries: E,
          busyCode: c.isMutating ? c.mutatingCode : null,
          onAdd: st,
          onRemove: rt
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
            yt,
            {
              values: h.values,
              errors: h.errors,
              onFieldChange: h.setField,
              assigneeOptions: y.options,
              isLoadingAssignees: y.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(d.Suspense, { fallback: /* @__PURE__ */ e.jsx(Y, { className: "h-24 w-full" }), children: H && /* @__PURE__ */ e.jsx(
            H,
            {
              taskId: r,
              task: n,
              onOpenSubtask: tt
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            bt,
            {
              task: n,
              creatorName: y.nameById.get(n.creatorId),
              lastModifierName: y.nameById.get(n.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), lt = a === "page" ? dt : ct;
  return /* @__PURE__ */ e.jsxs(
    lt,
    {
      open: !0,
      fullscreen: ae,
      onRequestClose: I,
      title: n ? `Görev Detayı: ${n.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        ut,
        {
          task: n ?? { title: "Yükleniyor…" },
          canDelete: q,
          fullscreen: ae,
          onToggleFullscreen: P,
          onClose: I,
          onDelete: () => de(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        pt,
        {
          lastSavedAt: n == null ? void 0 : n.lastModificationTime,
          isDirty: u.isDirty,
          isSaving: T,
          onCancel: I,
          onSave: Xe
        }
      ),
      children: [
        it,
        u.pendingClose && /* @__PURE__ */ e.jsx(
          Vt,
          {
            isSaving: T,
            onStay: () => u.resolvePendingClose("stay"),
            onDiscard: () => u.resolvePendingClose("discard"),
            onSaveAndClose: et
          }
        ),
        B && /* @__PURE__ */ e.jsx(
          Ut,
          {
            taskTitle: (n == null ? void 0 : n.title) ?? "",
            busy: Je,
            onCancel: () => de(!1),
            onConfirm: We
          }
        )
      ]
    }
  );
}
function Ut({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [i, l] = d.useState(""), o = i.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    He,
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
        /* @__PURE__ */ e.jsx(v, { variant: "secondary", onClick: s, disabled: a, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          v,
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
function He({ label: t, title: a, description: s, children: r, actions: i }) {
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
function Vt({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    He,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(v, { variant: "secondary", onClick: a, disabled: t, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ e.jsx(v, { variant: "destructive", onClick: s, disabled: t, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ e.jsx(v, { variant: "primary", onClick: r, isLoading: t, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
function $t() {
  return /* @__PURE__ */ e.jsxs(Ee, { children: [
    /* @__PURE__ */ e.jsx(ze, { asChild: !0, children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-default transition-all shadow-sm", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-lock text-[11px] text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { children: "Sınırlı erişim" }),
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[10px] ml-0.5 text-text-tertiary" })
    ] }) }),
    /* @__PURE__ */ e.jsx(Ae, { children: /* @__PURE__ */ e.jsxs(
      Fe,
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
                  v,
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
          /* @__PURE__ */ e.jsx(Le, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
function _t({
  task: t,
  onClose: a,
  onToggleFullscreen: s,
  isFullscreen: r,
  presentation: i = "modal"
}) {
  var u;
  const [l, o] = d.useState(!1), n = [
    { id: 1, label: "Tamamlandı", color: "success" },
    { id: 2, label: "Devam Ediyor", color: "primary" },
    { id: 3, label: "Beklemede", color: "warning" }
  ], m = [
    { id: 1, label: "Kritik", color: "negative" },
    { id: 2, label: "Yüksek", color: "warning" },
    { id: 3, label: "Normal", color: "neutral" }
  ], p = n.find((h) => h.id === t.status) || n[0], x = m.find((h) => h.id === t.priority) || m[0];
  return /* @__PURE__ */ e.jsx("header", { className: "flex flex-col gap-[var(--apya-space-4)] border-b border-subtle p-[var(--apya-space-6)] pb-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsxs(G, { variant: "primary", className: "font-mono text-xs tracking-wider bg-primary-subtle text-primary", children: [
          "#",
          ((u = t.id) == null ? void 0 : u.substring(0, 8).toUpperCase()) || "OTL-2507"
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsxs(G, { variant: "success", className: "cursor-pointer hover:bg-success-hover transition-colors font-medium text-xs py-1 px-2.5", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-circle-check mr-1.5" }),
            p.label,
            " ",
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down ml-1 text-[10px]" })
          ] }),
          /* @__PURE__ */ e.jsxs(G, { variant: "negative", className: "cursor-pointer hover:bg-negative-hover transition-colors font-medium text-xs py-1 px-2.5", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-flag mr-1.5" }),
            x.label,
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
      /* @__PURE__ */ e.jsx($t, {}),
      /* @__PURE__ */ e.jsx("div", { className: "h-6 w-px bg-subtle mx-1" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1", children: [
        i === "modal" && /* @__PURE__ */ e.jsx(
          v,
          {
            variant: "ghost",
            size: "sm",
            icon: r ? "fa-compress" : "fa-expand",
            onClick: s,
            "aria-label": "Tam ekran",
            className: "h-9 w-9 p-0 rounded-[var(--apya-radius-md)] hover:bg-surface-hover"
          }
        ),
        /* @__PURE__ */ e.jsx(
          v,
          {
            variant: "ghost",
            size: "sm",
            icon: "fa-ellipsis",
            "aria-label": "Aksiyonlar",
            className: "h-9 w-9 p-0 rounded-[var(--apya-radius-md)] hover:bg-surface-hover"
          }
        ),
        i === "modal" && /* @__PURE__ */ e.jsx(
          v,
          {
            variant: "ghost",
            size: "sm",
            icon: "fa-xmark",
            onClick: a,
            "aria-label": "Kapat",
            className: "h-9 w-9 p-0 rounded-[var(--apya-radius-md)] hover:bg-negative-subtle hover:text-negative transition-colors"
          }
        )
      ] })
    ] })
  ] }) });
}
function M({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary uppercase tracking-wider", children: t }),
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center text-[13px] text-text-primary h-8", children: a })
  ] });
}
function Ht({ task: t }) {
  const a = "Yakup B.";
  return /* @__PURE__ */ e.jsx("div", { className: "px-[var(--apya-space-6)] py-[var(--apya-space-5)] bg-surface-base border-b border-subtle", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-y-[var(--apya-space-5)] gap-x-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsx(M, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-1.5 py-1 -ml-1.5 rounded-md transition-colors w-max", children: [
      /* @__PURE__ */ e.jsx("img", { src: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64", alt: a, className: "h-6 w-6 rounded-full border border-subtle" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: a })
    ] }) }),
    /* @__PURE__ */ e.jsx(M, { label: "Son Tarih", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-1.5 py-1 -ml-1.5 rounded-md transition-colors w-max", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-text-secondary", children: t.dueDate ? new Date(t.dueDate).toLocaleDateString("tr-TR") : "10.07.2026" })
    ] }) }),
    /* @__PURE__ */ e.jsx(M, { label: "Başlangıç", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-1.5 py-1 -ml-1.5 rounded-md transition-colors w-max", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-text-secondary", children: t.startDate ? new Date(t.startDate).toLocaleDateString("tr-TR") : "25.06.2026" })
    ] }) }),
    /* @__PURE__ */ e.jsx(M, { label: "Öncelik", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-flag text-negative" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: "Kritik" })
    ] }) }),
    /* @__PURE__ */ e.jsx(M, { label: "Durum", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-circle-check text-success" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: "Tamamlandı" })
    ] }) }),
    /* @__PURE__ */ e.jsx(M, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
      /* @__PURE__ */ e.jsx(G, { variant: "primary", className: "bg-primary-subtle text-primary hover:bg-primary-hover/20 cursor-pointer text-[11px] font-medium px-2 py-0.5", children: "Konaklama" }),
      /* @__PURE__ */ e.jsx(G, { variant: "primary", className: "bg-primary-subtle text-primary hover:bg-primary-hover/20 cursor-pointer text-[11px] font-medium px-2 py-0.5", children: "Anlaşma" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "flex items-center justify-center h-[22px] w-[22px] rounded-full bg-surface-sunken border border-subtle text-text-tertiary hover:bg-surface-hover hover:text-text-secondary transition-colors", "aria-label": "Etiket ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[10px]" }) })
    ] }) }),
    /* @__PURE__ */ e.jsx(M, { label: "Proje", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-1.5 py-1 -ml-1.5 rounded-md transition-colors w-max", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: "Otel Projesi" })
    ] }) }),
    /* @__PURE__ */ e.jsx(M, { label: "Maliyet Merkezi", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-1.5 py-1 -ml-1.5 rounded-md transition-colors w-max", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-bullseye text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: "Merkez" })
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
function Qe({ assignedCodes: t = [] }) {
  const a = (s) => t.includes(s);
  return /* @__PURE__ */ e.jsxs(Ee, { children: [
    /* @__PURE__ */ e.jsx(ze, { asChild: !0, children: /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        className: "flex h-8 w-8 items-center justify-center rounded-md border border-dashed border-text-tertiary text-text-tertiary hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:shadow-focus",
        "aria-label": "Özellik ekle",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[14px]" })
      }
    ) }),
    /* @__PURE__ */ e.jsx(Ae, { children: /* @__PURE__ */ e.jsxs(
      Fe,
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
            Qt.map((s) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", children: [
              /* @__PURE__ */ e.jsx("h4", { className: "text-[11px] font-bold text-text-tertiary tracking-widest uppercase pl-1", children: s.title }),
              /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-2 gap-3", children: s.items.map((r) => /* @__PURE__ */ e.jsxs(
                "div",
                {
                  className: `
                                                group flex items-start gap-4 rounded-xl border p-3 transition-all cursor-pointer
                                                ${a(r.code) ? "border-subtle bg-surface-sunken opacity-60 cursor-default" : "border-subtle bg-surface-base hover:border-primary hover:shadow-sm"}
                                            `,
                  children: [
                    /* @__PURE__ */ e.jsx("div", { className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${r.color}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r.icon} text-[16px]` }) }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-0.5", children: [
                      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: r.title }),
                        a(r.code) && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-success text-[12px]" })
                      ] }),
                      /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: r.desc })
                    ] })
                  ]
                },
                r.code
              )) })
            ] }, s.title))
          ] }),
          /* @__PURE__ */ e.jsx(Le, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
function Zt({ activeTab: t, onTabChange: a, visibleTabs: s }) {
  const r = (i) => i === "subtasks" ? 4 : i === "files" ? 8 : i === "dependencies" ? 2 : i === "comments" ? 4 : null;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle bg-surface-base px-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsx("nav", { className: "flex items-center gap-6", "aria-label": "Görev sekmeleri", children: s.map((i) => {
      const l = t === i.code, o = r(i.code);
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => a(i.code),
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
    /* @__PURE__ */ e.jsx("div", { className: "py-2", children: /* @__PURE__ */ e.jsx(Qe, { assignedCodes: s.map((i) => i.code) }) })
  ] });
}
function X({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-start py-2", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary text-right font-medium max-w-[140px] truncate", title: typeof a == "string" ? a : "", children: a ?? "—" })
  ] });
}
function we({ label: t, name: a, avatar: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-center py-2", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("img", { src: s, alt: a, className: "w-5 h-5 rounded-full" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary font-medium", children: a })
    ] })
  ] });
}
function Jt({ task: t }) {
  const a = (s) => s ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(s)) : "—";
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex flex-col gap-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-base p-[var(--apya-space-5)] flex flex-col", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-semibold text-text-primary mb-3", children: "Detaylar" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col divide-y divide-subtle/50", children: [
        /* @__PURE__ */ e.jsx(we, { label: "Oluşturan", name: "Yakup B.", avatar: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64" }),
        /* @__PURE__ */ e.jsx(X, { label: "Oluşturma Tarihi", value: a(t.creationTime) }),
        /* @__PURE__ */ e.jsx(we, { label: "Güncelleyen", name: "Yakup B.", avatar: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64" }),
        /* @__PURE__ */ e.jsx(X, { label: "Son Güncelleme", value: a(t.lastModificationTime) }),
        /* @__PURE__ */ e.jsx(X, { label: "Oluşturma Paneli", value: "Otomasyon" }),
        /* @__PURE__ */ e.jsx(X, { label: "Tahmini Süre", value: "15 gün" }),
        /* @__PURE__ */ e.jsx(X, { label: "Gerçekleşen Süre", value: "12 gün" })
      ] }),
      /* @__PURE__ */ e.jsxs("button", { type: "button", className: "mt-3 text-[13px] font-medium text-primary hover:text-primary-hover flex items-center justify-center gap-1 transition-colors", children: [
        "Daha fazla alan göster ",
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[10px]" })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-base p-[var(--apya-space-5)] flex flex-col gap-3", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-semibold text-text-primary mb-1", children: "Hızlı işlemler" }),
      /* @__PURE__ */ e.jsx(v, { variant: "outline", className: "w-full justify-start text-text-secondary h-10 border-subtle", icon: "fa-link", children: "Bağlantıyı kopyala" }),
      /* @__PURE__ */ e.jsx(v, { variant: "outline", className: "w-full justify-start text-text-secondary h-10 border-subtle", icon: "fa-copy", children: "Çoğalt" }),
      /* @__PURE__ */ e.jsx(v, { variant: "outline", className: "w-full justify-start text-text-secondary h-10 border-subtle", icon: "fa-box-archive", children: "Arşivle" }),
      /* @__PURE__ */ e.jsx(v, { variant: "outline", className: "w-full justify-start text-negative h-10 border-negative-subtle hover:bg-negative-subtle hover:border-negative transition-colors", icon: "fa-trash-can", children: "Sil" })
    ] })
  ] });
}
function Wt() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 border-b border-subtle bg-surface-base px-2 py-1.5 rounded-t-[var(--apya-radius-md)]", children: [
    /* @__PURE__ */ e.jsx(v, { variant: "ghost", size: "sm", icon: "fa-bold", className: "h-7 w-7 text-text-secondary" }),
    /* @__PURE__ */ e.jsx(v, { variant: "ghost", size: "sm", icon: "fa-italic", className: "h-7 w-7 text-text-secondary" }),
    /* @__PURE__ */ e.jsx(v, { variant: "ghost", size: "sm", icon: "fa-underline", className: "h-7 w-7 text-text-secondary" }),
    /* @__PURE__ */ e.jsx("div", { className: "h-4 w-px bg-subtle mx-1" }),
    /* @__PURE__ */ e.jsx(v, { variant: "ghost", size: "sm", icon: "fa-list-ul", className: "h-7 w-7 text-text-secondary" }),
    /* @__PURE__ */ e.jsx(v, { variant: "ghost", size: "sm", icon: "fa-list-ol", className: "h-7 w-7 text-text-secondary" }),
    /* @__PURE__ */ e.jsx(v, { variant: "ghost", size: "sm", icon: "fa-align-left", className: "h-7 w-7 text-text-secondary" }),
    /* @__PURE__ */ e.jsx("div", { className: "h-4 w-px bg-subtle mx-1" }),
    /* @__PURE__ */ e.jsx(v, { variant: "ghost", size: "sm", icon: "fa-link", className: "h-7 w-7 text-text-secondary" }),
    /* @__PURE__ */ e.jsx(v, { variant: "ghost", size: "sm", icon: "fa-image", className: "h-7 w-7 text-text-secondary" }),
    /* @__PURE__ */ e.jsx(v, { variant: "ghost", size: "sm", icon: "fa-code", className: "h-7 w-7 text-text-secondary" }),
    /* @__PURE__ */ e.jsx(v, { variant: "ghost", size: "sm", icon: "fa-at", className: "h-7 w-7 text-text-secondary" })
  ] });
}
function Xt({ task: t }) {
  const [a, s] = d.useState(t.description || "Önce metne sonra mekke 60 kişilik detaylar dosyada belirtilmiş ve otel rezervasyonları yapılmıştır.");
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-semibold text-text-primary", children: "Açıklama" }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-[var(--apya-radius-md)] border border-subtle bg-surface-base focus-within:border-primary focus-within:shadow-focus transition-all", children: [
        /* @__PURE__ */ e.jsx(Wt, {}),
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            className: "w-full min-h-[120px] p-3 text-[14px] text-text-primary bg-transparent focus:outline-none resize-y",
            value: a,
            onChange: (r) => s(r.target.value),
            placeholder: "Bir açıklama ekleyin..."
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-3 rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-base p-[var(--apya-space-5)]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between cursor-pointer group", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-semibold text-text-primary", children: "Kontrol Listesi" }),
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-up text-text-tertiary group-hover:text-text-secondary transition-colors" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2", children: /* @__PURE__ */ e.jsx(qe, { taskId: t.id, task: t }) })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-3 rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-base p-[var(--apya-space-5)]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between cursor-pointer group", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-semibold text-text-primary", children: "Yorumlar & Güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex h-5 w-5 items-center justify-center rounded-full bg-primary-subtle text-primary text-[10px] font-bold", children: "4" })
        ] }),
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-up text-text-tertiary group-hover:text-text-secondary transition-colors" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2", children: /* @__PURE__ */ e.jsx(Ue, { taskId: t.id, task: t }) })
    ] })
  ] });
}
function ea({
  lastSavedAt: t,
  isDirty: a,
  isSaving: s,
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
      a && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 text-warning font-medium ml-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "h-2 w-2 rounded-full bg-warning animate-pulse" }),
        "Kaydedilmemiş değişiklikler var"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ e.jsx(
        v,
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
        v,
        {
          type: "button",
          variant: "primary",
          size: "sm",
          onClick: i,
          disabled: !a || s,
          isLoading: s,
          loadingText: "Kaydediliyor…",
          className: "bg-primary hover:bg-primary-hover text-white px-6 font-medium shadow-sm transition-all rounded-lg",
          children: "Kaydet"
        }
      )
    ] })
  ] });
}
const Ne = [
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
  const [t, a] = d.useState("all"), s = t === "all" ? Ne : Ne.filter((r) => r.category === t);
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
          onClick: () => a(r.id),
          className: `px-3 py-1 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${t === r.id ? "bg-primary text-white shadow-sm" : "bg-surface-sunken text-text-secondary hover:bg-surface-hover hover:text-text-primary"}`,
          children: r.label
        },
        r.id
      )) })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col divide-y divide-subtle/50", children: s.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between py-3.5 hover:bg-surface-hover/50 px-2 rounded-lg transition-colors", children: [
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
const ke = "apya.taskDetail.fullscreen";
function Ze({
  taskId: t,
  presentation: a = "modal",
  onClose: s,
  switchToTask: r
}) {
  const [i, l] = d.useState(t), { data: o, isLoading: n, isError: m, refetch: p } = Re(i), x = _(), u = Pe(), h = Ke(o);
  Me();
  const y = Ye(i), [c, f] = d.useState("general"), [b, N] = d.useState(
    () => {
      var T;
      return ((T = window.localStorage) == null ? void 0 : T.getItem(ke)) === "1";
    }
  ), [k, D] = d.useState(!1), S = d.useCallback(() => {
    Be(), s == null || s();
  }, [s]);
  Ge(t, S), Z.useEffect(() => {
    h.isDirty ? u.markDirty() : u.markClean();
  });
  const E = d.useCallback(() => u.requestClose(S), [u, S]), R = d.useCallback(() => {
    N((T) => {
      var A;
      const z = !T;
      return (A = window.localStorage) == null || A.setItem(ke, z ? "1" : "0"), z;
    });
  }, []), H = d.useMemo(
    () => $e(y.assignedCodes),
    [y.assignedCodes]
  ), O = H.find((T) => T.code === c) || H[0], ae = d.useCallback(async () => {
    var T, z, A, I, P, q;
    if (!h.validate()) return !1;
    D(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(i, h.toUpdateDto())
      ), await x.invalidateQueries({ queryKey: ["task-detail", i] }), L.emitResult(), (A = (z = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : z.success) == null || A.call(z, "Görev başarıyla güncellendi."), !0;
    } catch (B) {
      return (q = (P = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : P.error) == null || q.call(P, (B == null ? void 0 : B.message) || "Kaydedilemedi."), !1;
    } finally {
      D(!1);
    }
  }, [i, h, x]);
  d.useCallback(async () => {
    var T, z, A, I, P, q;
    if (window.confirm("Bu görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.delete(i)), (A = (z = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : z.info) == null || A.call(z, "Görev silindi."), u.markClean(), S();
      } catch (B) {
        (q = (P = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : P.error) == null || q.call(P, (B == null ? void 0 : B.message) || "Görev silinemedi.");
      }
  }, [i, u, S]);
  const se = n ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(Y, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(Y, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(Y, { className: "h-64 w-full" })
  ] }) : m ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(v, { variant: "ghost", onClick: () => p(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      _t,
      {
        task: o,
        onClose: E,
        isFullscreen: b,
        onToggleFullscreen: R,
        presentation: a
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "overflow-y-auto max-h-[85vh] custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(Ht, { task: o }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle px-6 bg-surface-base", children: [
        /* @__PURE__ */ e.jsx(
          Zt,
          {
            activeTab: c,
            onTabChange: f,
            visibleTabs: H
          }
        ),
        /* @__PURE__ */ e.jsx("div", { className: "py-2", children: /* @__PURE__ */ e.jsx(Qe, { assignedCodes: y.assignedCodes }) })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-6", children: c === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start", children: [
        /* @__PURE__ */ e.jsx("div", { className: "min-w-0 space-y-6", children: /* @__PURE__ */ e.jsx(Xt, { task: o }) }),
        /* @__PURE__ */ e.jsx("div", { className: "w-full shrink-0", children: /* @__PURE__ */ e.jsx(Jt, { task: o }) })
      ] }) : c === "history" || c === "activity" ? /* @__PURE__ */ e.jsx(ta, {}) : /* @__PURE__ */ e.jsx(d.Suspense, { fallback: /* @__PURE__ */ e.jsx(Y, { className: "h-48 w-full" }), children: O != null && O.component ? /* @__PURE__ */ e.jsx(
        O.component,
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
        isDirty: u.isDirty,
        isSaving: k,
        onCancel: E,
        onSave: ae
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsx("div", { className: "w-full max-w-6xl mx-auto my-6 rounded-2xl border border-subtle bg-surface-base shadow-sm overflow-hidden", children: se }) : /* @__PURE__ */ e.jsx(
    De,
    {
      open: !0,
      onOpenChange: (T) => {
        T || E();
      },
      children: /* @__PURE__ */ e.jsx(
        Se,
        {
          title: o != null && o.title ? `Görev Detayı: ${o.title}` : "Görev Detayı",
          fullscreen: b,
          className: "max-w-6xl p-0 overflow-hidden rounded-2xl border border-subtle shadow-2xl bg-surface-base",
          onInteractOutside: (T) => {
            T.preventDefault(), E();
          },
          onEscapeKeyDown: (T) => {
            T.preventDefault(), E();
          },
          children: se
        }
      )
    }
  );
}
function aa() {
  var a;
  const t = d.useSyncExternalStore(
    L.subscribe,
    L.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(oe, { children: /* @__PURE__ */ e.jsx(
    Ze,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        L.close(), L.emitResult();
      }
    }
  ) }) : /* @__PURE__ */ e.jsx(oe, { children: /* @__PURE__ */ e.jsx(
    _e,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        L.close(), L.emitResult();
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
const Te = document.getElementById("task-detail-island");
if (Te && (window.apya = window.apya || {}, window.apya.taskDetailV3Enabled = ra(), window.apya.taskDetailV2Enabled = sa() && !window.apya.taskDetailV3Enabled, window.apya.taskDetail = {
  open: (t) => L.open(t),
  close: () => L.close(),
  onResult: (t) => L.onResult(t)
}, Ce(Te).render(/* @__PURE__ */ e.jsx(aa, {})), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled)) {
  const t = Ie();
  t && L.open(t);
}
function ia({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(oe, { children: /* @__PURE__ */ e.jsx(
    Ze,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(oe, { children: /* @__PURE__ */ e.jsx(
    _e,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) });
}
const ue = document.getElementById("task-detail-page-island");
if (ue) {
  const t = ue.getAttribute("data-task-id");
  t && Ce(ue).render(/* @__PURE__ */ e.jsx(ia, { taskId: t }));
}
