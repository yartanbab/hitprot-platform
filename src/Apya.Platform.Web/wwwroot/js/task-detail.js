import { j as e, r as u, d as Z, b as ke } from "./react-vendor.js";
/* empty css      */
import { a as le } from "./QueryProvider.js";
import { u as ae, a as _, b as $ } from "./query-vendor.js";
import { D as Ce, l as Te, e as G, B as v, I as V, S as O } from "./Dialog.js";
import { C as tt } from "./Combobox.js";
import { r as at } from "./httpClient.js";
import { R as st, T as rt, P as it, C as nt, A as lt } from "./ui-vendor.js";
function ot({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: i,
  footer: n,
  children: c
}) {
  return /* @__PURE__ */ e.jsx(
    Ce,
    {
      open: t,
      onOpenChange: (l) => {
        l || a();
      },
      children: /* @__PURE__ */ e.jsx(
        Te,
        {
          title: r,
          fullscreen: s,
          onInteractOutside: (l) => {
            l.preventDefault(), a();
          },
          onEscapeKeyDown: (l) => {
            l.preventDefault(), a();
          },
          children: /* @__PURE__ */ e.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
            i,
            /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: c }),
            n
          ] })
        }
      )
    }
  );
}
function ct({ title: t, header: a, footer: s, children: r }) {
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
const te = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, me = {
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
  fullscreen: n = !1
}) {
  const [c, l] = u.useState(!1), d = u.useRef(null);
  u.useEffect(() => {
    if (!c) return;
    const y = (f) => {
      d.current && !d.current.contains(f.target) && l(!1);
    }, o = (f) => {
      f.key === "Escape" && l(!1);
    };
    return document.addEventListener("mousedown", y), document.addEventListener("keydown", o), () => {
      document.removeEventListener("mousedown", y), document.removeEventListener("keydown", o);
    };
  }, [c]);
  const p = te[t == null ? void 0 : t.status] ?? te[1], x = me[t == null ? void 0 : t.priority] ?? me[2], m = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), l(!1);
  }, h = () => {
    var o, f, b, N;
    const y = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (o = navigator.clipboard) == null || o.writeText(y), (N = (b = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : b.info) == null || N.call(b, "Bağlantı kopyalandı."), l(!1);
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
        /* @__PURE__ */ e.jsx(dt, { isPrivate: t == null ? void 0 : t.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": n ? "Küçült" : "Tam ekrana büyüt",
          onClick: i,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: n ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: d, children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": c,
            onClick: () => l((y) => !y),
            className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-ellipsis", "aria-hidden": "true" })
          }
        ),
        c && /* @__PURE__ */ e.jsxs(
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
                      l(!1), r();
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
const mt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function xt({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: i }) {
  const n = mt(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: n ? `Son kayıt: ${n}` : " " }),
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
const he = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", pt = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function K({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function ft({ value: t, onChange: a }) {
  const [s, r] = u.useState(""), i = () => {
    const n = s.trim();
    n && !t.includes(n) && a([...t, n]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((n) => /* @__PURE__ */ e.jsxs(G, { variant: "neutral", children: [
      n,
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${n} etiketini kaldır`,
          onClick: () => a(t.filter((c) => c !== n)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, n)) }),
    /* @__PURE__ */ e.jsx(
      V,
      {
        value: s,
        onChange: (n) => r(n.target.value),
        onKeyDown: (n) => {
          n.key === "Enter" || n.key === "," ? (n.preventDefault(), i()) : n.key === "Backspace" && !s && t.length && a(t.slice(0, -1));
        },
        onBlur: i,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function ht({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: i = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(K, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      V,
      {
        id: "task-title",
        value: t.title,
        onChange: (n) => s("title", n.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(K, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (n) => s("status", Number(n.target.value)),
          className: he,
          children: Object.entries(te).map(([n, c]) => /* @__PURE__ */ e.jsx("option", { value: n, children: c.text }, n))
        }
      ) }),
      /* @__PURE__ */ e.jsx(K, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (n) => s("priority", Number(n.target.value)),
          className: he,
          children: Object.entries(me).map(([n, c]) => /* @__PURE__ */ e.jsx("option", { value: n, children: c.text }, n))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(K, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      tt,
      {
        id: "task-assignee",
        options: r,
        value: t.assigneeId,
        onChange: (n) => s("assigneeId", n),
        placeholder: i ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: i
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(K, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        V,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (n) => s("startDate", n.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(K, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        V,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (n) => s("dueDate", n.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(K, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(ft, { value: t.tagNames, onChange: (n) => s("tagNames", n) }) }),
    /* @__PURE__ */ e.jsx(K, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (n) => s("description", n.target.value),
        className: pt
      }
    ) })
  ] });
}
const ye = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function X({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function yt({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(X, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(X, { label: "Oluşturulma zamanı", value: ye(t.creationTime) }),
      /* @__PURE__ */ e.jsx(X, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(X, { label: "Son güncelleme zamanı", value: ye(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(X, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const bt = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", vt = "border-brand-500 text-text-primary";
function gt({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: i }) {
  const n = u.useRef(/* @__PURE__ */ new Map()), c = (d) => {
    var p;
    s(d.code), (p = n.current.get(d.code)) == null || p.focus();
  }, l = (d, p) => {
    d.key === "ArrowRight" ? (d.preventDefault(), c(t[(p + 1) % t.length])) : d.key === "ArrowLeft" ? (d.preventDefault(), c(t[(p - 1 + t.length) % t.length])) : d.key === "Home" ? (d.preventDefault(), c(t[0])) : d.key === "End" && (d.preventDefault(), c(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((d, p) => {
      const x = d.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (m) => {
            m ? n.current.set(d.code, m) : n.current.delete(d.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${d.code}`,
          "aria-selected": x,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: x ? 0 : -1,
          onClick: () => s(d.code),
          onKeyDown: (m) => l(m, p),
          className: `${bt} ${x ? vt : ""}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa ${d.icon}`, "aria-hidden": "true" }),
            d.title
          ]
        },
        d.code
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
function wt({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [i, n] = u.useState(""), c = u.useMemo(() => {
    const l = i.trim().toLocaleLowerCase("tr-TR"), d = l ? t.filter((x) => x.title.toLocaleLowerCase("tr-TR").includes(l)) : t, p = /* @__PURE__ */ new Map();
    return d.forEach((x) => {
      const m = p.get(x.category) ?? [];
      m.push(x), p.set(x.category, m);
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
          V,
          {
            autoFocus: !0,
            value: i,
            onChange: (l) => n(l.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          c.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...c.entries()].map(([l, d]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: jt[l] ?? l }),
            d.map((p) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
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
          ] }, l))
        ] })
      ]
    }
  );
}
function Nt({ trail: t = [], current: a, onNavigate: s }) {
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
function kt(t) {
  var s, r, i;
  const a = (i = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : i.task;
  return a ? Promise.resolve(a.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function De(t) {
  return ae({
    queryKey: ["task-detail", t],
    queryFn: () => kt(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function oe(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
function Se() {
  const [t, a] = u.useState(!1), [s, r] = u.useState(!1), i = u.useRef(null), n = u.useCallback(() => a(!0), []), c = u.useCallback(() => a(!1), []);
  u.useEffect(() => {
    if (!t) return;
    const p = (x) => {
      x.preventDefault(), x.returnValue = "";
    };
    return window.addEventListener("beforeunload", p), () => window.removeEventListener("beforeunload", p);
  }, [t]);
  const l = u.useCallback((p) => {
    if (!t) {
      p == null || p();
      return;
    }
    i.current = p ?? null, r(!0);
  }, [t]), d = u.useCallback((p) => {
    const x = i.current;
    return r(!1), i.current = null, p === "discard" && (a(!1), x == null || x()), p === "save" ? x : null;
  }, []);
  return { isDirty: t, markDirty: n, markClean: c, requestClose: l, pendingClose: s, resolvePendingClose: d };
}
const Ct = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, pe = "task";
function Ee() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(pe);
  return t && Ct.test(t) ? t : null;
}
function ze() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(pe), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function Ae(t, a) {
  const s = u.useRef(a);
  s.current = a, u.useEffect(() => {
    if (!t || Ee() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(pe, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), u.useEffect(() => {
    const r = () => {
      var i;
      (i = s.current) == null || i.call(s);
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
    tagNames: (t.tags ?? []).map((a) => a.name)
  } : Tt;
}
function Le(t) {
  const [a, s] = u.useState(t == null ? void 0 : t.id), r = u.useMemo(() => Dt(t), [t]), [i, n] = u.useState(r), [c, l] = u.useState({});
  (t == null ? void 0 : t.id) !== a && (s(t == null ? void 0 : t.id), n(r), l({}));
  const d = u.useCallback((y, o) => {
    n((f) => ({ ...f, [y]: o }));
  }, []), p = u.useMemo(
    () => JSON.stringify(i) !== JSON.stringify(r),
    [i, r]
  ), x = u.useCallback(() => {
    const y = {};
    return i.title.trim() || (y.title = "Başlık zorunlu."), i.startDate || (y.startDate = "Başlangıç tarihi zorunlu."), i.dueDate && i.startDate && i.dueDate < i.startDate && (y.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), l(y), Object.keys(y).length === 0;
  }, [i]), m = u.useCallback(() => ({
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
  }), [i, t]), h = u.useCallback(() => {
    n(r), l({});
  }, [r]);
  return { values: i, setField: d, isDirty: p, errors: c, validate: x, toUpdateDto: m, reset: h };
}
function be(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function St() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Fe() {
  var i;
  const t = ae({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: St,
    staleTime: 3e5,
    retry: !1
  }), a = ((i = t.data) == null ? void 0 : i.items) ?? [], s = a.map((n) => ({ value: n.id, label: be(n) })), r = new Map(a.map((n) => [n.id, be(n)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function xe() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Et(t) {
  const a = xe();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Pe(t) {
  const a = _(), s = ["task-features", t], r = ae({
    queryKey: s,
    queryFn: () => Et(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), n = $({
    mutationFn: (l) => Promise.resolve(xe().addFeature(t, l)),
    onSuccess: i
  }), c = $({
    mutationFn: (l) => Promise.resolve(xe().removeFeature(t, l)),
    onSuccess: i
  });
  return {
    assignedCodes: r.data ?? [],
    isLoading: r.isLoading,
    addFeature: n.mutateAsync,
    removeFeature: c.mutateAsync,
    mutatingCode: n.variables ?? c.variables ?? null,
    isMutating: n.isPending || c.isPending
  };
}
function zt({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, i] = u.useState(""), [n, c] = u.useState(!1), [l, d] = u.useState(null), p = _(), x = (a == null ? void 0 : a.subTasks) ?? [], m = () => p.invalidateQueries({ queryKey: ["task-detail", t] }), h = async () => {
    var f, b, N;
    const o = r.trim();
    if (o) {
      c(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: o,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), i(""), await m();
      } catch (k) {
        (N = (b = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : b.error) == null || N.call(b, (k == null ? void 0 : k.message) || "Alt görev eklenemedi.");
      } finally {
        c(!1);
      }
    }
  }, y = async (o) => {
    var f, b, N;
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(o)), await m();
    } catch (k) {
      (N = (b = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : b.error) == null || N.call(b, (k == null ? void 0 : k.message) || "Alt görev silinemedi.");
    } finally {
      d(null);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        V,
        {
          value: r,
          onChange: (o) => i(o.target.value),
          onKeyDown: (o) => {
            o.key === "Enter" && h();
          },
          placeholder: "Yeni alt görev başlığı",
          disabled: n
        }
      ),
      /* @__PURE__ */ e.jsx(v, { variant: "secondary", onClick: h, disabled: n || !r.trim(), children: "Alt Görev Ekle" })
    ] }),
    x.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz alt görev yok." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: x.map((o) => {
      var f, b;
      return /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between py-2", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => s == null ? void 0 : s(o.id, o.title),
            className: "text-left text-sm font-medium text-text-primary hover:underline",
            children: o.title
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(G, { variant: ((f = te[o.status]) == null ? void 0 : f.variant) ?? "neutral", children: ((b = te[o.status]) == null ? void 0 : b.text) ?? o.status }),
          l === o.id ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary", children: "Emin misiniz?" }),
            /* @__PURE__ */ e.jsx(v, { variant: "destructive", onClick: () => y(o.id), children: "Evet, sil" }),
            /* @__PURE__ */ e.jsx(v, { variant: "ghost", onClick: () => d(null), children: "Vazgeç" })
          ] }) : /* @__PURE__ */ e.jsx(v, { variant: "ghost", onClick: () => d(o.id), "aria-label": `${o.title} alt görevini sil`, children: "Sil" })
        ] })
      ] }, o.id);
    }) })
  ] });
}
function Re() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function At(t) {
  const a = Re();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function Lt(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, i = at();
  i && (r.RequestVerificationToken = i);
  const n = await fetch(`/api/tasks/attachments/upload/${t}`, {
    method: "POST",
    credentials: "include",
    headers: r,
    body: s
  });
  let c = null;
  try {
    c = await n.json();
  } catch {
  }
  if (!n.ok || (c == null ? void 0 : c.success) === !1)
    throw new Error((c == null ? void 0 : c.error) || "Dosya yüklenemedi.");
  return c;
}
function Ft(t) {
  const a = _(), s = ["task-attachments", t], r = ae({
    queryKey: s,
    queryFn: () => At(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), n = $({
    mutationFn: (l) => Lt(t, l),
    onSuccess: i
  }), c = $({
    mutationFn: (l) => Promise.resolve(Re().deleteAttachment(l)),
    onSuccess: i
  });
  return {
    attachments: r.data ?? [],
    isLoading: r.isLoading,
    upload: n.mutateAsync,
    remove: c.mutateAsync,
    isUploading: n.isPending
  };
}
function Pt(t) {
  return `${Math.round(t / 1024)} KB`;
}
function Rt({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: i } = Ft(t), n = u.useRef(null), c = async (d) => {
    var x, m, h, y, o, f, b;
    const p = (x = d.target.files) == null ? void 0 : x[0];
    if (p)
      try {
        await s(p), (y = (h = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : h.success) == null || y.call(h, "Dosya yüklendi.");
      } catch (N) {
        (b = (f = (o = window == null ? void 0 : window.abp) == null ? void 0 : o.notify) == null ? void 0 : f.error) == null || b.call(f, (N == null ? void 0 : N.message) || "Dosya yüklenemedi.");
      } finally {
        n.current && (n.current.value = "");
      }
  }, l = async (d, p) => {
    var x, m, h;
    try {
      await r(d);
    } catch (y) {
      (h = (m = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : m.error) == null || h.call(m, (y == null ? void 0 : y.message) || `${p} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("input", { ref: n, type: "file", onChange: c, className: "text-sm", disabled: i }),
      i && /* @__PURE__ */ e.jsx("span", { className: "text-sm text-text-tertiary", children: "Yükleniyor…" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: a.map((d) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between py-2", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("a", { href: d.downloadUrl, target: "_blank", rel: "noreferrer", className: "text-sm font-medium text-text-primary hover:underline", children: d.fileName }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-text-tertiary", children: [
          Pt(d.fileSize),
          " — ",
          d.uploaderName
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(v, { variant: "ghost", onClick: () => l(d.id, d.fileName), "aria-label": `${d.fileName} dosyasini sil`, children: "Sil" })
    ] }, d.id)) })
  ] });
}
function ie() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function It(t) {
  const a = ie();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Bt(t) {
  const a = _(), s = ["task-checklist", t], r = ae({
    queryKey: s,
    queryFn: () => It(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), n = $({
    mutationFn: (d) => Promise.resolve(ie().addChecklistItem(t, d)),
    onSuccess: i
  }), c = $({
    mutationFn: (d) => Promise.resolve(ie().toggleChecklistItem(d)),
    onSuccess: i
  }), l = $({
    mutationFn: (d) => Promise.resolve(ie().deleteChecklistItem(d)),
    onSuccess: i
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: n.mutateAsync,
    toggleItem: c.mutateAsync,
    removeItem: l.mutateAsync
  };
}
function Ie({ taskId: t }) {
  const { items: a, addItem: s, toggleItem: r, removeItem: i } = Bt(t), [n, c] = u.useState(""), l = async () => {
    var m, h, y;
    const x = n.trim();
    if (x)
      try {
        await s(x), c("");
      } catch (o) {
        (y = (h = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : h.error) == null || y.call(h, (o == null ? void 0 : o.message) || "Madde eklenemedi.");
      }
  }, d = async (x) => {
    var m, h, y;
    try {
      await r(x);
    } catch (o) {
      (y = (h = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : h.error) == null || y.call(h, (o == null ? void 0 : o.message) || "Madde güncellenemedi.");
    }
  }, p = async (x, m) => {
    var h, y, o;
    try {
      await i(x);
    } catch (f) {
      (o = (y = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : y.error) == null || o.call(y, (f == null ? void 0 : f.message) || `${m} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        V,
        {
          value: n,
          onChange: (x) => c(x.target.value),
          onKeyDown: (x) => {
            x.key === "Enter" && l();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ e.jsx(v, { variant: "secondary", onClick: l, disabled: !n.trim(), children: "Ekle" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz madde eklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "space-y-1.5", children: a.map((x) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-2 py-1", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: x.isDone,
            onChange: () => d(x.id)
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: x.isDone ? "text-text-tertiary line-through" : "text-text-primary", children: x.text })
      ] }),
      /* @__PURE__ */ e.jsx(v, { variant: "ghost", onClick: () => p(x.id, x.text), "aria-label": `${x.text} maddesini sil`, children: "Sil" })
    ] }, x.id)) })
  ] });
}
function Be({ taskId: t, task: a }) {
  const [s, r] = u.useState(""), [i, n] = u.useState(null), [c, l] = u.useState(""), [d, p] = u.useState(!1), x = _(), m = (a == null ? void 0 : a.comments) ?? [], h = async (o) => {
    var f, b, N, k, D, S;
    if (o == null || o.preventDefault(), !(!s.trim() || d)) {
      p(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), x.invalidateQueries({ queryKey: ["task-detail", t] }), (N = (b = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : b.success) == null || N.call(b, "Yorum eklendi.");
      } catch (z) {
        (S = (D = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : D.error) == null || S.call(D, (z == null ? void 0 : z.message) || "Yorum eklenemedi.");
      } finally {
        p(!1);
      }
    }
  }, y = async (o) => {
    var f, b, N, k, D, S;
    if (!(!c.trim() || d)) {
      p(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(o, c.trim())
        ), l(""), n(null), x.invalidateQueries({ queryKey: ["task-detail", t] }), (N = (b = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : b.success) == null || N.call(b, "Yanıt eklendi.");
      } catch (z) {
        (S = (D = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : D.error) == null || S.call(D, (z == null ? void 0 : z.message) || "Yanıt eklenemedi.");
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
          onChange: (o) => r(o.target.value),
          placeholder: "Bir yorum veya güncelleme yazın...",
          className: "w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ e.jsx(
        v,
        {
          type: "submit",
          variant: "primary",
          disabled: !s.trim() || d,
          isLoading: d,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    m.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: m.map((o) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: o.creatorUserName || o.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: o.creationTime ? new Date(o.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: o.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        v,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => n(i === o.id ? null : o.id),
          children: "Yanıtla"
        }
      ) }),
      i === o.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: c,
            onChange: (f) => l(f.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(v, { variant: "ghost", size: "sm", onClick: () => n(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(v, { variant: "primary", size: "sm", disabled: !c.trim() || d, onClick: () => y(o.id), children: "Gönder" })
        ] })
      ] }),
      o.replies && o.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: o.replies.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: f.creatorUserName || f.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: f.creationTime ? new Date(f.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: f.text })
      ] }, f.id)) })
    ] }, o.id)) })
  ] });
}
function Gt({ task: t }) {
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
function Kt({ task: t }) {
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
function Mt({ task: t }) {
  var p;
  const a = typeof window < "u" && !!((p = window == null ? void 0 : window.abp) != null && p.auth), s = a ? oe("Platform.Expenses.Default") : !0, r = a ? oe("Platform.Incomes.Default") : !0;
  if (!s && !r)
    return /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Finansal verileri görüntüleme yetkiniz bulunmuyor." });
  const i = (t == null ? void 0 : t.expenses) || [], n = (t == null ? void 0 : t.incomes) || [], c = i.reduce((x, m) => x + (m.amount || 0), 0), l = n.reduce((x, m) => x + (m.amount || 0), 0), d = l - c;
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated", children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Toplam Gelir" }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-base font-semibold text-text-positive", children: [
          l.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
          " ₺"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated", children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Toplam Gider" }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-base font-semibold text-text-negative", children: [
          c.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
          " ₺"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated", children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Net Bakiye" }),
        /* @__PURE__ */ e.jsxs("p", { className: `text-base font-semibold ${d >= 0 ? "text-text-positive" : "text-text-negative"}`, children: [
          d.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
          " ₺"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "rounded-lg border border-subtle p-3 bg-surface-base text-xs text-text-secondary", children: /* @__PURE__ */ e.jsx("p", { children: "Göreve bağlı detaylı harcama veya fatura ekleme işlemleri Finans Modülü üzerinden senkronize yönetilmektedir." }) })
  ] });
}
function re({ task: t }) {
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
    component: Rt
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
    component: Ie
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
    component: Be
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
    component: Gt
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
    component: Kt
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
    component: Mt
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
    component: re
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
    component: re
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
    component: re
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
    component: re
  }
];
function Ke(t = []) {
  const a = new Set(t);
  return Ge.filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function Ot(t = []) {
  const a = new Set(t);
  return Ge.filter((s) => !s.isCore).filter((s) => !s.permission || oe(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let H = null;
const ne = /* @__PURE__ */ new Set(), de = /* @__PURE__ */ new Set();
function ve() {
  ne.forEach((t) => t());
}
function qt(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const F = {
  open(t) {
    const a = qt(t);
    !a || a === H || (H = a, ve());
  },
  close() {
    H !== null && (H = null, ve());
  },
  subscribe(t) {
    return ne.add(t), () => ne.delete(t);
  },
  getSnapshot() {
    return H;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && de.add(t);
  },
  emitResult() {
    de.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    H = null, ne.clear(), de.clear();
  }
}, ge = "apya.taskDetail.fullscreen";
function Me({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, i] = u.useState(t), [n, c] = u.useState([]), { data: l, isLoading: d, isError: p, refetch: x } = De(r), m = Se(), h = Le(l), y = Fe(), o = Pe(r), [f, b] = u.useState("general"), [N, k] = u.useState(!1), D = Z.useRef(null), S = u.useMemo(
    () => Ke(o.assignedCodes),
    [o.assignedCodes]
  ), z = u.useMemo(
    () => Ot(o.assignedCodes),
    [o.assignedCodes]
  ), P = S.find((g) => g.code === f) ?? S[0];
  Z.useEffect(() => {
    P.code !== f && b(P.code);
  }, [P, f]);
  const Q = P == null ? void 0 : P.component, q = _(), [J, C] = u.useState(
    () => {
      var g;
      return ((g = window.localStorage) == null ? void 0 : g.getItem(ge)) === "1";
    }
  ), [E, R] = u.useState(!1), I = u.useCallback(() => {
    ze(), s == null || s();
  }, [s]);
  Ae(t, I), Z.useEffect(() => {
    h.isDirty ? m.markDirty() : m.markClean();
  });
  const A = u.useCallback(() => m.requestClose(I), [m, I]), Y = u.useCallback(() => {
    C((g) => {
      var w;
      const j = !g;
      return (w = window.localStorage) == null || w.setItem(ge, j ? "1" : "0"), j;
    });
  }, []), B = oe("Platform.Tasks.Delete"), [Ue, ce] = u.useState(!1), [$e, fe] = u.useState(!1), Ve = u.useCallback(async () => {
    var g, j, w, L, T, W;
    fe(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (w = (j = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : j.info) == null || w.call(j, "Başarıyla silindi."), ce(!1), m.markClean(), I();
    } catch (U) {
      (W = (T = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : T.error) == null || W.call(T, (U == null ? void 0 : U.message) || "Görev silinemedi.");
    } finally {
      fe(!1);
    }
  }, [r, m, I]), se = u.useCallback(async () => {
    var g, j, w, L, T, W;
    if (!h.validate()) return !1;
    R(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, h.toUpdateDto())
      ), await q.invalidateQueries({ queryKey: ["task-detail", r] }), F.emitResult(), (w = (j = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : j.success) == null || w.call(j, "Kaydedildi."), !0;
    } catch (U) {
      return (W = (T = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : T.error) == null || W.call(T, (U == null ? void 0 : U.message) || "Kaydedilemedi."), !1;
    } finally {
      R(!1);
    }
  }, [r, h, m, q]), _e = u.useCallback(() => {
    se();
  }, [se]), Qe = u.useCallback(async () => {
    const g = m.resolvePendingClose("save");
    await se() && (g == null || g());
  }, [m, se]), He = u.useCallback((g, j) => {
    m.requestClose(() => {
      c((w) => [...w, { id: r, title: (l == null ? void 0 : l.title) ?? "" }]), i(g), b("general"), m.markClean();
    });
  }, [m, r, l]), Ze = u.useCallback((g) => {
    m.requestClose(() => {
      c((j) => {
        const w = j.findIndex((L) => L.id === g);
        return w === -1 ? j : j.slice(0, w);
      }), i(g), b("general"), m.markClean();
    });
  }, [m]), Je = u.useCallback(async (g) => {
    var j, w, L;
    try {
      await o.addFeature(g), b(g), k(!1);
    } catch (T) {
      (L = (w = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : w.error) == null || L.call(w, (T == null ? void 0 : T.message) || "Özellik eklenemedi.");
    }
  }, [o]), We = u.useCallback(async (g) => {
    var j, w, L;
    try {
      await o.removeFeature(g), b((T) => T === g ? "general" : T);
    } catch (T) {
      (L = (w = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : w.error) == null || L.call(w, (T == null ? void 0 : T.message) || "Özellik kaldırılamadı.");
    }
  }, [o]);
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
  const Xe = d ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(O, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(O, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(O, { className: "h-24 w-full" })
  ] }) : p ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(v, { variant: "ghost", onClick: () => x(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      Nt,
      {
        trail: n,
        current: { id: r, title: (l == null ? void 0 : l.title) ?? "" },
        onNavigate: Ze
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: D, children: [
      /* @__PURE__ */ e.jsx(
        gt,
        {
          tabs: S,
          activeCode: P.code,
          onSelect: (g) => {
            b(g), k(!1);
          },
          onOpenPicker: () => k((g) => !g),
          pickerOpen: N
        }
      ),
      N && /* @__PURE__ */ e.jsx(
        wt,
        {
          entries: z,
          busyCode: o.isMutating ? o.mutatingCode : null,
          onAdd: Je,
          onRemove: We
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${P.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          P.code === "general" ? /* @__PURE__ */ e.jsx(
            ht,
            {
              values: h.values,
              errors: h.errors,
              onFieldChange: h.setField,
              assigneeOptions: y.options,
              isLoadingAssignees: y.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(u.Suspense, { fallback: /* @__PURE__ */ e.jsx(O, { className: "h-24 w-full" }), children: Q && /* @__PURE__ */ e.jsx(
            Q,
            {
              taskId: r,
              task: l,
              onOpenSubtask: He
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            yt,
            {
              task: l,
              creatorName: y.nameById.get(l.creatorId),
              lastModifierName: y.nameById.get(l.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), et = a === "page" ? ct : ot;
  return /* @__PURE__ */ e.jsxs(
    et,
    {
      open: !0,
      fullscreen: J,
      onRequestClose: A,
      title: l ? `Görev Detayı: ${l.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        ut,
        {
          task: l ?? { title: "Yükleniyor…" },
          canDelete: B,
          fullscreen: J,
          onToggleFullscreen: Y,
          onClose: A,
          onDelete: () => ce(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        xt,
        {
          lastSavedAt: l == null ? void 0 : l.lastModificationTime,
          isDirty: m.isDirty,
          isSaving: E,
          onCancel: A,
          onSave: _e
        }
      ),
      children: [
        Xe,
        m.pendingClose && /* @__PURE__ */ e.jsx(
          Ut,
          {
            isSaving: E,
            onStay: () => m.resolvePendingClose("stay"),
            onDiscard: () => m.resolvePendingClose("discard"),
            onSaveAndClose: Qe
          }
        ),
        Ue && /* @__PURE__ */ e.jsx(
          Yt,
          {
            taskTitle: (l == null ? void 0 : l.title) ?? "",
            busy: $e,
            onCancel: () => ce(!1),
            onConfirm: Ve
          }
        )
      ]
    }
  );
}
function Yt({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [i, n] = u.useState(""), c = i.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    Oe,
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
            disabled: !c,
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
            onChange: (l) => n(l.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function Oe({ label: t, title: a, description: s, children: r, actions: i }) {
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
function Ut({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    Oe,
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
function $t({
  task: t,
  onClose: a,
  onToggleFullscreen: s,
  isFullscreen: r,
  presentation: i = "modal"
}) {
  var m;
  const [n, c] = u.useState(!1), l = [
    { id: 1, label: "Tamamlandı", color: "success" },
    { id: 2, label: "Devam Ediyor", color: "primary" },
    { id: 3, label: "Beklemede", color: "warning" }
  ], d = [
    { id: 1, label: "Kritik", color: "negative" },
    { id: 2, label: "Yüksek", color: "warning" },
    { id: 3, label: "Normal", color: "neutral" }
  ], p = l.find((h) => h.id === t.status) || l[0], x = d.find((h) => h.id === t.priority) || d[0];
  return /* @__PURE__ */ e.jsx("header", { className: "flex flex-col gap-[var(--apya-space-4)] border-b border-subtle p-[var(--apya-space-6)] pb-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsxs(G, { variant: "primary", className: "font-mono text-xs tracking-wider bg-primary-subtle text-primary", children: [
          "#",
          ((m = t.id) == null ? void 0 : m.substring(0, 8).toUpperCase()) || "OTL-2507"
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
            onClick: () => c(!n),
            className: `flex h-8 w-8 items-center justify-center rounded-full transition-colors ${n ? "text-warning hover:bg-warning-subtle" : "text-text-tertiary hover:bg-surface-hover hover:text-text-secondary"}`,
            children: /* @__PURE__ */ e.jsx("i", { className: n ? "fa-solid fa-star text-lg" : "fa-regular fa-star text-lg" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[var(--apya-space-3)]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-default transition-all shadow-sm", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-lock text-[11px]" }),
        "Sınırlı erişim",
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[10px] ml-1" })
      ] }),
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
function Vt({ task: t }) {
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
const _t = [
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
function qe({ assignedCodes: t = [] }) {
  const a = (s) => t.includes(s);
  return /* @__PURE__ */ e.jsxs(st, { children: [
    /* @__PURE__ */ e.jsx(rt, { asChild: !0, children: /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        className: "flex h-8 w-8 items-center justify-center rounded-md border border-dashed border-text-tertiary text-text-tertiary hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:shadow-focus",
        "aria-label": "Özellik ekle",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[14px]" })
      }
    ) }),
    /* @__PURE__ */ e.jsx(it, { children: /* @__PURE__ */ e.jsxs(
      nt,
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
            _t.map((s) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", children: [
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
          /* @__PURE__ */ e.jsx(lt, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
function Qt({ activeTab: t, onTabChange: a, visibleTabs: s }) {
  const r = (i) => i === "subtasks" ? 4 : i === "files" ? 8 : i === "dependencies" ? 2 : i === "comments" ? 4 : null;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle bg-surface-base px-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsx("nav", { className: "flex items-center gap-6", "aria-label": "Görev sekmeleri", children: s.map((i) => {
      const n = t === i.code, c = r(i.code);
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => a(i.code),
          className: `
                                relative flex items-center gap-2 py-3.5 text-[13px] font-medium transition-colors
                                ${n ? "text-primary" : "text-text-secondary hover:text-text-primary"}
                            `,
          children: [
            i.title,
            c !== null && /* @__PURE__ */ e.jsx("span", { className: `
                                    flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold
                                    ${n ? "bg-primary-subtle text-primary" : "bg-surface-sunken text-text-tertiary border border-subtle"}
                                `, children: c }),
            n && /* @__PURE__ */ e.jsx("div", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" })
          ]
        },
        i.code
      );
    }) }),
    /* @__PURE__ */ e.jsx("div", { className: "py-2", children: /* @__PURE__ */ e.jsx(qe, { assignedCodes: s.map((i) => i.code) }) })
  ] });
}
function ee({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-start py-2", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary text-right font-medium max-w-[140px] truncate", title: typeof a == "string" ? a : "", children: a ?? "—" })
  ] });
}
function je({ label: t, name: a, avatar: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-center py-2", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("img", { src: s, alt: a, className: "w-5 h-5 rounded-full" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary font-medium", children: a })
    ] })
  ] });
}
function Ht({ task: t }) {
  const a = (s) => s ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(s)) : "—";
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex flex-col gap-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-base p-[var(--apya-space-5)] flex flex-col", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-semibold text-text-primary mb-3", children: "Detaylar" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col divide-y divide-subtle/50", children: [
        /* @__PURE__ */ e.jsx(je, { label: "Oluşturan", name: "Yakup B.", avatar: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64" }),
        /* @__PURE__ */ e.jsx(ee, { label: "Oluşturma Tarihi", value: a(t.creationTime) }),
        /* @__PURE__ */ e.jsx(je, { label: "Güncelleyen", name: "Yakup B.", avatar: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64" }),
        /* @__PURE__ */ e.jsx(ee, { label: "Son Güncelleme", value: a(t.lastModificationTime) }),
        /* @__PURE__ */ e.jsx(ee, { label: "Oluşturma Paneli", value: "Otomasyon" }),
        /* @__PURE__ */ e.jsx(ee, { label: "Tahmini Süre", value: "15 gün" }),
        /* @__PURE__ */ e.jsx(ee, { label: "Gerçekleşen Süre", value: "12 gün" })
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
function Zt() {
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
function Jt({ task: t }) {
  const [a, s] = u.useState(t.description || "Önce metne sonra mekke 60 kişilik detaylar dosyada belirtilmiş ve otel rezervasyonları yapılmıştır.");
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-semibold text-text-primary", children: "Açıklama" }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-[var(--apya-radius-md)] border border-subtle bg-surface-base focus-within:border-primary focus-within:shadow-focus transition-all", children: [
        /* @__PURE__ */ e.jsx(Zt, {}),
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
      /* @__PURE__ */ e.jsx("div", { className: "mt-2", children: /* @__PURE__ */ e.jsx(Ie, { taskId: t.id, task: t }) })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-3 rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-base p-[var(--apya-space-5)]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between cursor-pointer group", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-semibold text-text-primary", children: "Yorumlar & Güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex h-5 w-5 items-center justify-center rounded-full bg-primary-subtle text-primary text-[10px] font-bold", children: "4" })
        ] }),
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-up text-text-tertiary group-hover:text-text-secondary transition-colors" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2", children: /* @__PURE__ */ e.jsx(Be, { taskId: t.id, task: t }) })
    ] })
  ] });
}
const we = "apya.taskDetail.fullscreen";
function Ye({
  taskId: t,
  presentation: a = "modal",
  onClose: s,
  switchToTask: r
}) {
  const [i, n] = u.useState(t), { data: c, isLoading: l, isError: d, refetch: p } = De(i), x = _(), m = Se(), h = Le(c);
  Fe();
  const y = Pe(i), [o, f] = u.useState("general"), [b, N] = u.useState(
    () => {
      var C;
      return ((C = window.localStorage) == null ? void 0 : C.getItem(we)) === "1";
    }
  ), [k, D] = u.useState(!1), S = u.useCallback(() => {
    ze(), s == null || s();
  }, [s]);
  Ae(t, S), Z.useEffect(() => {
    h.isDirty ? m.markDirty() : m.markClean();
  });
  const z = u.useCallback(() => m.requestClose(S), [m, S]), P = u.useCallback(() => {
    N((C) => {
      var R;
      const E = !C;
      return (R = window.localStorage) == null || R.setItem(we, E ? "1" : "0"), E;
    });
  }, []), Q = u.useMemo(
    () => Ke(y.assignedCodes),
    [y.assignedCodes]
  ), q = Q.find((C) => C.code === o) || Q[0];
  u.useCallback(async () => {
    var C, E, R, I, A, Y;
    if (!h.validate()) return !1;
    D(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(i, h.toUpdateDto())
      ), await x.invalidateQueries({ queryKey: ["task-detail", i] }), F.emitResult(), (R = (E = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : E.success) == null || R.call(E, "Görev başarıyla güncellendi."), !0;
    } catch (B) {
      return (Y = (A = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : A.error) == null || Y.call(A, (B == null ? void 0 : B.message) || "Kaydedilemedi."), !1;
    } finally {
      D(!1);
    }
  }, [i, h, x]), u.useCallback(async () => {
    var C, E, R, I, A, Y;
    if (window.confirm("Bu görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.delete(i)), (R = (E = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : E.info) == null || R.call(E, "Görev silindi."), m.markClean(), S();
      } catch (B) {
        (Y = (A = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : A.error) == null || Y.call(A, (B == null ? void 0 : B.message) || "Görev silinemedi.");
      }
  }, [i, m, S]);
  const J = l ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(O, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(O, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(O, { className: "h-64 w-full" })
  ] }) : d ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(v, { variant: "ghost", onClick: () => p(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      $t,
      {
        task: c,
        onClose: z,
        isFullscreen: b,
        onToggleFullscreen: P,
        presentation: a
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "overflow-y-auto max-h-[85vh] custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(Vt, { task: c }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle px-6 bg-surface-base", children: [
        /* @__PURE__ */ e.jsx(
          Qt,
          {
            activeTab: o,
            onTabChange: f,
            visibleTabs: Q
          }
        ),
        /* @__PURE__ */ e.jsx("div", { className: "py-2", children: /* @__PURE__ */ e.jsx(qe, { assignedCodes: y.assignedCodes }) })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-6", children: o === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start", children: [
        /* @__PURE__ */ e.jsx("div", { className: "min-w-0 space-y-6", children: /* @__PURE__ */ e.jsx(Jt, { task: c }) }),
        /* @__PURE__ */ e.jsx("div", { className: "w-full shrink-0", children: /* @__PURE__ */ e.jsx(Ht, { task: c }) })
      ] }) : /* @__PURE__ */ e.jsx(u.Suspense, { fallback: /* @__PURE__ */ e.jsx(O, { className: "h-48 w-full" }), children: q != null && q.component ? /* @__PURE__ */ e.jsx(
        q.component,
        {
          taskId: i,
          task: c,
          onOpenSubtask: r
        }
      ) : /* @__PURE__ */ e.jsxs("div", { className: "text-center py-12 text-text-tertiary border border-dashed border-subtle rounded-xl", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-person-digging text-4xl mb-4 opacity-50" }),
        /* @__PURE__ */ e.jsx("p", { children: "Bu sekme yapım aşamasında." })
      ] }) }) })
    ] })
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsx("div", { className: "w-full max-w-6xl mx-auto my-6 rounded-2xl border border-subtle bg-surface-base shadow-sm overflow-hidden", children: J }) : /* @__PURE__ */ e.jsx(
    Ce,
    {
      open: !0,
      onOpenChange: (C) => {
        C || z();
      },
      children: /* @__PURE__ */ e.jsx(
        Te,
        {
          title: c != null && c.title ? `Görev Detayı: ${c.title}` : "Görev Detayı",
          fullscreen: b,
          className: "max-w-6xl p-0 overflow-hidden rounded-2xl border border-subtle shadow-2xl bg-surface-base",
          onInteractOutside: (C) => {
            C.preventDefault(), z();
          },
          onEscapeKeyDown: (C) => {
            C.preventDefault(), z();
          },
          children: J
        }
      )
    }
  );
}
function Wt() {
  var a;
  const t = u.useSyncExternalStore(
    F.subscribe,
    F.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(le, { children: /* @__PURE__ */ e.jsx(
    Ye,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        F.close(), F.emitResult();
      }
    }
  ) }) : /* @__PURE__ */ e.jsx(le, { children: /* @__PURE__ */ e.jsx(
    Me,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        F.close(), F.emitResult();
      }
    }
  ) }) : null;
}
function Xt() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v2" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : !(window.localStorage.getItem("apya.taskDetail.v2") === "0");
  } catch {
    return !0;
  }
}
function ea() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v3" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v2" || new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : window.localStorage.getItem("apya.taskDetail.v3") === "1" || !0;
  } catch {
    return !0;
  }
}
const Ne = document.getElementById("task-detail-island");
if (Ne && (window.apya = window.apya || {}, window.apya.taskDetailV3Enabled = ea(), window.apya.taskDetailV2Enabled = Xt() && !window.apya.taskDetailV3Enabled, window.apya.taskDetail = {
  open: (t) => F.open(t),
  close: () => F.close(),
  onResult: (t) => F.onResult(t)
}, ke(Ne).render(/* @__PURE__ */ e.jsx(Wt, {})), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled)) {
  const t = Ee();
  t && F.open(t);
}
function ta({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(le, { children: /* @__PURE__ */ e.jsx(
    Ye,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(le, { children: /* @__PURE__ */ e.jsx(
    Me,
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
  t && ke(ue).render(/* @__PURE__ */ e.jsx(ta, { taskId: t }));
}
