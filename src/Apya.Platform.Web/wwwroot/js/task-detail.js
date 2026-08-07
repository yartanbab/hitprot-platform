import { j as e, r as p, d as U, b as ge } from "./react-vendor.js";
/* empty css      */
import { a as W } from "./QueryProvider.js";
import { u as _, a as M, b as I } from "./query-vendor.js";
import { D as $e, l as Ve, e as L, B as v, I as B, S as $ } from "./Dialog.js";
import { C as _e } from "./Combobox.js";
import { r as He } from "./httpClient.js";
import { R as Qe, T as Ze, P as Je, C as We, A as Xe } from "./ui-vendor.js";
function et({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: n,
  footer: i,
  children: d
}) {
  return /* @__PURE__ */ e.jsx(
    $e,
    {
      open: t,
      onOpenChange: (l) => {
        l || a();
      },
      children: /* @__PURE__ */ e.jsx(
        Ve,
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
            n,
            /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: d }),
            i
          ] })
        }
      )
    }
  );
}
function tt({ title: t, header: a, footer: s, children: r }) {
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
function at({ isPrivate: t }) {
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
const V = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, re = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function st({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: n,
  fullscreen: i = !1
}) {
  const [d, l] = p.useState(!1), c = p.useRef(null);
  p.useEffect(() => {
    if (!d) return;
    const y = (h) => {
      c.current && !c.current.contains(h.target) && l(!1);
    }, o = (h) => {
      h.key === "Escape" && l(!1);
    };
    return document.addEventListener("mousedown", y), document.addEventListener("keydown", o), () => {
      document.removeEventListener("mousedown", y), document.removeEventListener("keydown", o);
    };
  }, [d]);
  const u = V[t == null ? void 0 : t.status] ?? V[1], m = re[t == null ? void 0 : t.priority] ?? re[2], x = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), l(!1);
  }, f = () => {
    var o, h, b, N;
    const y = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (o = navigator.clipboard) == null || o.writeText(y), (N = (b = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : b.info) == null || N.call(b, "Bağlantı kopyalandı."), l(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(L, { variant: u.variant, children: u.text }),
        /* @__PURE__ */ e.jsx(L, { variant: m.variant, children: m.text }),
        /* @__PURE__ */ e.jsx(at, { isPrivate: t == null ? void 0 : t.isPrivate })
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
            "aria-expanded": d,
            onClick: () => l((y) => !y),
            className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-ellipsis", "aria-hidden": "true" })
          }
        ),
        d && /* @__PURE__ */ e.jsxs(
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
                  onClick: x,
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
const rt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function it({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: n }) {
  const i = rt(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: i ? `Son kayıt: ${i}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(v, { variant: "secondary", onClick: r, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        v,
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
const xe = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", nt = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function P({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function lt({ value: t, onChange: a }) {
  const [s, r] = p.useState(""), n = () => {
    const i = s.trim();
    i && !t.includes(i) && a([...t, i]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((i) => /* @__PURE__ */ e.jsxs(L, { variant: "neutral", children: [
      i,
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${i} etiketini kaldır`,
          onClick: () => a(t.filter((d) => d !== i)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, i)) }),
    /* @__PURE__ */ e.jsx(
      B,
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
function ot({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: n = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(P, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      B,
      {
        id: "task-title",
        value: t.title,
        onChange: (i) => s("title", i.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(P, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (i) => s("status", Number(i.target.value)),
          className: xe,
          children: Object.entries(V).map(([i, d]) => /* @__PURE__ */ e.jsx("option", { value: i, children: d.text }, i))
        }
      ) }),
      /* @__PURE__ */ e.jsx(P, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (i) => s("priority", Number(i.target.value)),
          className: xe,
          children: Object.entries(re).map(([i, d]) => /* @__PURE__ */ e.jsx("option", { value: i, children: d.text }, i))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(P, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      _e,
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
      /* @__PURE__ */ e.jsx(P, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        B,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (i) => s("startDate", i.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(P, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        B,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (i) => s("dueDate", i.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(P, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(lt, { value: t.tagNames, onChange: (i) => s("tagNames", i) }) }),
    /* @__PURE__ */ e.jsx(P, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (i) => s("description", i.target.value),
        className: nt
      }
    ) })
  ] });
}
const pe = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function Y({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function ct({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(Y, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(Y, { label: "Oluşturulma zamanı", value: pe(t.creationTime) }),
      /* @__PURE__ */ e.jsx(Y, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(Y, { label: "Son güncelleme zamanı", value: pe(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(Y, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const dt = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", ut = "border-brand-500 text-text-primary";
function mt({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: n }) {
  const i = p.useRef(/* @__PURE__ */ new Map()), d = (c) => {
    var u;
    s(c.code), (u = i.current.get(c.code)) == null || u.focus();
  }, l = (c, u) => {
    c.key === "ArrowRight" ? (c.preventDefault(), d(t[(u + 1) % t.length])) : c.key === "ArrowLeft" ? (c.preventDefault(), d(t[(u - 1 + t.length) % t.length])) : c.key === "Home" ? (c.preventDefault(), d(t[0])) : c.key === "End" && (c.preventDefault(), d(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((c, u) => {
      const m = c.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (x) => {
            x ? i.current.set(c.code, x) : i.current.delete(c.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${c.code}`,
          "aria-selected": m,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: m ? 0 : -1,
          onClick: () => s(c.code),
          onKeyDown: (x) => l(x, u),
          className: `${dt} ${m ? ut : ""}`,
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
const xt = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function pt({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [n, i] = p.useState(""), d = p.useMemo(() => {
    const l = n.trim().toLocaleLowerCase("tr-TR"), c = l ? t.filter((m) => m.title.toLocaleLowerCase("tr-TR").includes(l)) : t, u = /* @__PURE__ */ new Map();
    return c.forEach((m) => {
      const x = u.get(m.category) ?? [];
      x.push(m), u.set(m.category, x);
    }), u;
  }, [t, n]);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Özellik ekle",
      className: "absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl",
      children: [
        /* @__PURE__ */ e.jsx(
          B,
          {
            autoFocus: !0,
            value: n,
            onChange: (l) => i(l.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          d.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...d.entries()].map(([l, c]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: xt[l] ?? l }),
            c.map((u) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa ${u.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: u.title }),
              !u.implemented && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              u.implemented && !u.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === u.code,
                  onClick: () => a(u.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              u.implemented && u.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === u.code,
                  onClick: () => s(u.code),
                  className: "text-[13px] font-medium text-text-negative hover:underline disabled:opacity-50",
                  children: "Kaldır"
                }
              )
            ] }, u.code))
          ] }, l))
        ] })
      ]
    }
  );
}
function ft({ trail: t = [], current: a, onNavigate: s }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((r) => /* @__PURE__ */ e.jsxs(U.Fragment, { children: [
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
function ht(t) {
  var s, r, n;
  const a = (n = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : n.task;
  return a ? Promise.resolve(a.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function je(t) {
  return _({
    queryKey: ["task-detail", t],
    queryFn: () => ht(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function X(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
function yt() {
  const [t, a] = p.useState(!1), [s, r] = p.useState(!1), n = p.useRef(null), i = p.useCallback(() => a(!0), []), d = p.useCallback(() => a(!1), []);
  p.useEffect(() => {
    if (!t) return;
    const u = (m) => {
      m.preventDefault(), m.returnValue = "";
    };
    return window.addEventListener("beforeunload", u), () => window.removeEventListener("beforeunload", u);
  }, [t]);
  const l = p.useCallback((u) => {
    if (!t) {
      u == null || u();
      return;
    }
    n.current = u ?? null, r(!0);
  }, [t]), c = p.useCallback((u) => {
    const m = n.current;
    return r(!1), n.current = null, u === "discard" && (a(!1), m == null || m()), u === "save" ? m : null;
  }, []);
  return { isDirty: t, markDirty: i, markClean: d, requestClose: l, pendingClose: s, resolvePendingClose: c };
}
const bt = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, ne = "task";
function we() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(ne);
  return t && bt.test(t) ? t : null;
}
function vt() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(ne), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function gt(t, a) {
  const s = p.useRef(a);
  s.current = a, p.useEffect(() => {
    if (!t || we() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(ne, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), p.useEffect(() => {
    const r = () => {
      var n;
      (n = s.current) == null || n.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const jt = {
  title: "",
  description: "",
  startDate: "",
  dueDate: "",
  status: 1,
  priority: 2,
  assigneeId: null,
  tagNames: []
};
function wt(t) {
  return t ? {
    title: t.title ?? "",
    description: t.description ?? "",
    startDate: t.startDate ? t.startDate.slice(0, 10) : "",
    dueDate: t.dueDate ? t.dueDate.slice(0, 10) : "",
    status: t.status ?? 1,
    priority: t.priority ?? 2,
    assigneeId: t.assigneeId ?? null,
    tagNames: (t.tags ?? []).map((a) => a.name)
  } : jt;
}
function Nt(t) {
  const [a, s] = p.useState(t == null ? void 0 : t.id), r = p.useMemo(() => wt(t), [t]), [n, i] = p.useState(r), [d, l] = p.useState({});
  (t == null ? void 0 : t.id) !== a && (s(t == null ? void 0 : t.id), i(r), l({}));
  const c = p.useCallback((y, o) => {
    i((h) => ({ ...h, [y]: o }));
  }, []), u = p.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(r),
    [n, r]
  ), m = p.useCallback(() => {
    const y = {};
    return n.title.trim() || (y.title = "Başlık zorunlu."), n.startDate || (y.startDate = "Başlangıç tarihi zorunlu."), n.dueDate && n.startDate && n.dueDate < n.startDate && (y.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), l(y), Object.keys(y).length === 0;
  }, [n]), x = p.useCallback(() => ({
    title: n.title.trim(),
    description: n.description || null,
    startDate: n.startDate,
    dueDate: n.dueDate || null,
    status: n.status,
    priority: n.priority,
    assigneeId: n.assigneeId,
    boardColumnId: (t == null ? void 0 : t.boardColumnId) ?? null,
    projectId: (t == null ? void 0 : t.projectId) ?? null,
    parentTaskId: (t == null ? void 0 : t.parentTaskId) ?? null,
    isPrivate: !!(t != null && t.isPrivate),
    predecessorIds: (t == null ? void 0 : t.predecessorIds) ?? [],
    tagNames: n.tagNames
  }), [n, t]), f = p.useCallback(() => {
    i(r), l({});
  }, [r]);
  return { values: n, setField: c, isDirty: u, errors: d, validate: m, toUpdateDto: x, reset: f };
}
function fe(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function kt() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Tt() {
  var n;
  const t = _({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: kt,
    staleTime: 3e5,
    retry: !1
  }), a = ((n = t.data) == null ? void 0 : n.items) ?? [], s = a.map((i) => ({ value: i.id, label: fe(i) })), r = new Map(a.map((i) => [i.id, fe(i)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function ie() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Ct(t) {
  const a = ie();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Dt(t) {
  const a = M(), s = ["task-features", t], r = _({
    queryKey: s,
    queryFn: () => Ct(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = I({
    mutationFn: (l) => Promise.resolve(ie().addFeature(t, l)),
    onSuccess: n
  }), d = I({
    mutationFn: (l) => Promise.resolve(ie().removeFeature(t, l)),
    onSuccess: n
  });
  return {
    assignedCodes: r.data ?? [],
    isLoading: r.isLoading,
    addFeature: i.mutateAsync,
    removeFeature: d.mutateAsync,
    mutatingCode: i.variables ?? d.variables ?? null,
    isMutating: i.isPending || d.isPending
  };
}
function St({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, n] = p.useState(""), [i, d] = p.useState(!1), [l, c] = p.useState(null), u = M(), m = (a == null ? void 0 : a.subTasks) ?? [], x = () => u.invalidateQueries({ queryKey: ["task-detail", t] }), f = async () => {
    var h, b, N;
    const o = r.trim();
    if (o) {
      d(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: o,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), n(""), await x();
      } catch (T) {
        (N = (b = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : b.error) == null || N.call(b, (T == null ? void 0 : T.message) || "Alt görev eklenemedi.");
      } finally {
        d(!1);
      }
    }
  }, y = async (o) => {
    var h, b, N;
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(o)), await x();
    } catch (T) {
      (N = (b = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : b.error) == null || N.call(b, (T == null ? void 0 : T.message) || "Alt görev silinemedi.");
    } finally {
      c(null);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        B,
        {
          value: r,
          onChange: (o) => n(o.target.value),
          onKeyDown: (o) => {
            o.key === "Enter" && f();
          },
          placeholder: "Yeni alt görev başlığı",
          disabled: i
        }
      ),
      /* @__PURE__ */ e.jsx(v, { variant: "secondary", onClick: f, disabled: i || !r.trim(), children: "Alt Görev Ekle" })
    ] }),
    m.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz alt görev yok." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: m.map((o) => {
      var h, b;
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
          /* @__PURE__ */ e.jsx(L, { variant: ((h = V[o.status]) == null ? void 0 : h.variant) ?? "neutral", children: ((b = V[o.status]) == null ? void 0 : b.text) ?? o.status }),
          l === o.id ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary", children: "Emin misiniz?" }),
            /* @__PURE__ */ e.jsx(v, { variant: "destructive", onClick: () => y(o.id), children: "Evet, sil" }),
            /* @__PURE__ */ e.jsx(v, { variant: "ghost", onClick: () => c(null), children: "Vazgeç" })
          ] }) : /* @__PURE__ */ e.jsx(v, { variant: "ghost", onClick: () => c(o.id), "aria-label": `${o.title} alt görevini sil`, children: "Sil" })
        ] })
      ] }, o.id);
    }) })
  ] });
}
function Ne() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Et(t) {
  const a = Ne();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function zt(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, n = He();
  n && (r.RequestVerificationToken = n);
  const i = await fetch(`/api/tasks/attachments/upload/${t}`, {
    method: "POST",
    credentials: "include",
    headers: r,
    body: s
  });
  let d = null;
  try {
    d = await i.json();
  } catch {
  }
  if (!i.ok || (d == null ? void 0 : d.success) === !1)
    throw new Error((d == null ? void 0 : d.error) || "Dosya yüklenemedi.");
  return d;
}
function At(t) {
  const a = M(), s = ["task-attachments", t], r = _({
    queryKey: s,
    queryFn: () => Et(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = I({
    mutationFn: (l) => zt(t, l),
    onSuccess: n
  }), d = I({
    mutationFn: (l) => Promise.resolve(Ne().deleteAttachment(l)),
    onSuccess: n
  });
  return {
    attachments: r.data ?? [],
    isLoading: r.isLoading,
    upload: i.mutateAsync,
    remove: d.mutateAsync,
    isUploading: i.isPending
  };
}
function Lt(t) {
  return `${Math.round(t / 1024)} KB`;
}
function Pt({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: n } = At(t), i = p.useRef(null), d = async (c) => {
    var m, x, f, y, o, h, b;
    const u = (m = c.target.files) == null ? void 0 : m[0];
    if (u)
      try {
        await s(u), (y = (f = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : f.success) == null || y.call(f, "Dosya yüklendi.");
      } catch (N) {
        (b = (h = (o = window == null ? void 0 : window.abp) == null ? void 0 : o.notify) == null ? void 0 : h.error) == null || b.call(h, (N == null ? void 0 : N.message) || "Dosya yüklenemedi.");
      } finally {
        i.current && (i.current.value = "");
      }
  }, l = async (c, u) => {
    var m, x, f;
    try {
      await r(c);
    } catch (y) {
      (f = (x = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : x.error) == null || f.call(x, (y == null ? void 0 : y.message) || `${u} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("input", { ref: i, type: "file", onChange: d, className: "text-sm", disabled: n }),
      n && /* @__PURE__ */ e.jsx("span", { className: "text-sm text-text-tertiary", children: "Yükleniyor…" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: a.map((c) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between py-2", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("a", { href: c.downloadUrl, target: "_blank", rel: "noreferrer", className: "text-sm font-medium text-text-primary hover:underline", children: c.fileName }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-text-tertiary", children: [
          Lt(c.fileSize),
          " — ",
          c.uploaderName
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(v, { variant: "ghost", onClick: () => l(c.id, c.fileName), "aria-label": `${c.fileName} dosyasini sil`, children: "Sil" })
    ] }, c.id)) })
  ] });
}
function Z() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Rt(t) {
  const a = Z();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ft(t) {
  const a = M(), s = ["task-checklist", t], r = _({
    queryKey: s,
    queryFn: () => Rt(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = I({
    mutationFn: (c) => Promise.resolve(Z().addChecklistItem(t, c)),
    onSuccess: n
  }), d = I({
    mutationFn: (c) => Promise.resolve(Z().toggleChecklistItem(c)),
    onSuccess: n
  }), l = I({
    mutationFn: (c) => Promise.resolve(Z().deleteChecklistItem(c)),
    onSuccess: n
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: i.mutateAsync,
    toggleItem: d.mutateAsync,
    removeItem: l.mutateAsync
  };
}
function ke({ taskId: t }) {
  const { items: a, addItem: s, toggleItem: r, removeItem: n } = Ft(t), [i, d] = p.useState(""), l = async () => {
    var x, f, y;
    const m = i.trim();
    if (m)
      try {
        await s(m), d("");
      } catch (o) {
        (y = (f = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : f.error) == null || y.call(f, (o == null ? void 0 : o.message) || "Madde eklenemedi.");
      }
  }, c = async (m) => {
    var x, f, y;
    try {
      await r(m);
    } catch (o) {
      (y = (f = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : f.error) == null || y.call(f, (o == null ? void 0 : o.message) || "Madde güncellenemedi.");
    }
  }, u = async (m, x) => {
    var f, y, o;
    try {
      await n(m);
    } catch (h) {
      (o = (y = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : y.error) == null || o.call(y, (h == null ? void 0 : h.message) || `${x} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        B,
        {
          value: i,
          onChange: (m) => d(m.target.value),
          onKeyDown: (m) => {
            m.key === "Enter" && l();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ e.jsx(v, { variant: "secondary", onClick: l, disabled: !i.trim(), children: "Ekle" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz madde eklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "space-y-1.5", children: a.map((m) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-2 py-1", children: [
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
      /* @__PURE__ */ e.jsx(v, { variant: "ghost", onClick: () => u(m.id, m.text), "aria-label": `${m.text} maddesini sil`, children: "Sil" })
    ] }, m.id)) })
  ] });
}
function Te({ taskId: t, task: a }) {
  const [s, r] = p.useState(""), [n, i] = p.useState(null), [d, l] = p.useState(""), [c, u] = p.useState(!1), m = M(), x = (a == null ? void 0 : a.comments) ?? [], f = async (o) => {
    var h, b, N, T, C, E;
    if (o == null || o.preventDefault(), !(!s.trim() || c)) {
      u(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), m.invalidateQueries({ queryKey: ["task-detail", t] }), (N = (b = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : b.success) == null || N.call(b, "Yorum eklendi.");
      } catch (z) {
        (E = (C = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : C.error) == null || E.call(C, (z == null ? void 0 : z.message) || "Yorum eklenemedi.");
      } finally {
        u(!1);
      }
    }
  }, y = async (o) => {
    var h, b, N, T, C, E;
    if (!(!d.trim() || c)) {
      u(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(o, d.trim())
        ), l(""), i(null), m.invalidateQueries({ queryKey: ["task-detail", t] }), (N = (b = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : b.success) == null || N.call(b, "Yanıt eklendi.");
      } catch (z) {
        (E = (C = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : C.error) == null || E.call(C, (z == null ? void 0 : z.message) || "Yanıt eklenemedi.");
      } finally {
        u(!1);
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
          disabled: !s.trim() || c,
          isLoading: c,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    x.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: x.map((o) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
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
          onClick: () => i(n === o.id ? null : o.id),
          children: "Yanıtla"
        }
      ) }),
      n === o.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: d,
            onChange: (h) => l(h.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(v, { variant: "ghost", size: "sm", onClick: () => i(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(v, { variant: "primary", size: "sm", disabled: !d.trim() || c, onClick: () => y(o.id), children: "Gönder" })
        ] })
      ] }),
      o.replies && o.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: o.replies.map((h) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: h.creatorUserName || h.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: h.creationTime ? new Date(h.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: h.text })
      ] }, h.id)) })
    ] }, o.id)) })
  ] });
}
function It({ task: t }) {
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
function Bt({ task: t }) {
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
function Gt({ task: t }) {
  var u;
  const a = typeof window < "u" && !!((u = window == null ? void 0 : window.abp) != null && u.auth), s = a ? X("Platform.Expenses.Default") : !0, r = a ? X("Platform.Incomes.Default") : !0;
  if (!s && !r)
    return /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Finansal verileri görüntüleme yetkiniz bulunmuyor." });
  const n = (t == null ? void 0 : t.expenses) || [], i = (t == null ? void 0 : t.incomes) || [], d = n.reduce((m, x) => m + (x.amount || 0), 0), l = i.reduce((m, x) => m + (x.amount || 0), 0), c = l - d;
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
          d.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
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
function Q({ task: t }) {
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
const Ce = [
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
    component: St
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
    component: Pt
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
    component: ke
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
    component: Te
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
    component: It
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
    component: Bt
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
    component: Gt
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
    component: Q
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
    component: Q
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
    component: Q
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
    component: Q
  }
];
function De(t = []) {
  const a = new Set(t);
  return Ce.filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function Mt(t = []) {
  const a = new Set(t);
  return Ce.filter((s) => !s.isCore).filter((s) => !s.permission || X(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let G = null;
const J = /* @__PURE__ */ new Set(), ae = /* @__PURE__ */ new Set();
function he() {
  J.forEach((t) => t());
}
function Kt(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const S = {
  open(t) {
    const a = Kt(t);
    !a || a === G || (G = a, he());
  },
  close() {
    G !== null && (G = null, he());
  },
  subscribe(t) {
    return J.add(t), () => J.delete(t);
  },
  getSnapshot() {
    return G;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && ae.add(t);
  },
  emitResult() {
    ae.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    G = null, J.clear(), ae.clear();
  }
}, ye = "apya.taskDetail.fullscreen";
function Se({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, n] = p.useState(t), [i, d] = p.useState([]), { data: l, isLoading: c, isError: u, refetch: m } = je(r), x = yt(), f = Nt(l), y = Tt(), o = Dt(r), [h, b] = p.useState("general"), [N, T] = p.useState(!1), C = U.useRef(null), E = p.useMemo(
    () => De(o.assignedCodes),
    [o.assignedCodes]
  ), z = p.useMemo(
    () => Mt(o.assignedCodes),
    [o.assignedCodes]
  ), A = E.find((g) => g.code === h) ?? E[0];
  U.useEffect(() => {
    A.code !== h && b(A.code);
  }, [A, h]);
  const le = A == null ? void 0 : A.component, oe = M(), [ce, Ae] = p.useState(
    () => {
      var g;
      return ((g = window.localStorage) == null ? void 0 : g.getItem(ye)) === "1";
    }
  ), [de, ue] = p.useState(!1), K = p.useCallback(() => {
    vt(), s == null || s();
  }, [s]);
  gt(t, K), U.useEffect(() => {
    f.isDirty ? x.markDirty() : x.markClean();
  });
  const ee = p.useCallback(() => x.requestClose(K), [x, K]), Le = p.useCallback(() => {
    Ae((g) => {
      var w;
      const j = !g;
      return (w = window.localStorage) == null || w.setItem(ye, j ? "1" : "0"), j;
    });
  }, []), Pe = X("Platform.Tasks.Delete"), [Re, te] = p.useState(!1), [Fe, me] = p.useState(!1), Ie = p.useCallback(async () => {
    var g, j, w, D, k, O;
    me(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (w = (j = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : j.info) == null || w.call(j, "Başarıyla silindi."), te(!1), x.markClean(), K();
    } catch (F) {
      (O = (k = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : k.error) == null || O.call(k, (F == null ? void 0 : F.message) || "Görev silinemedi.");
    } finally {
      me(!1);
    }
  }, [r, x, K]), H = p.useCallback(async () => {
    var g, j, w, D, k, O;
    if (!f.validate()) return !1;
    ue(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, f.toUpdateDto())
      ), await oe.invalidateQueries({ queryKey: ["task-detail", r] }), S.emitResult(), (w = (j = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : j.success) == null || w.call(j, "Kaydedildi."), !0;
    } catch (F) {
      return (O = (k = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : k.error) == null || O.call(k, (F == null ? void 0 : F.message) || "Kaydedilemedi."), !1;
    } finally {
      ue(!1);
    }
  }, [r, f, x, oe]), Be = p.useCallback(() => {
    H();
  }, [H]), Ge = p.useCallback(async () => {
    const g = x.resolvePendingClose("save");
    await H() && (g == null || g());
  }, [x, H]), Me = p.useCallback((g, j) => {
    x.requestClose(() => {
      d((w) => [...w, { id: r, title: (l == null ? void 0 : l.title) ?? "" }]), n(g), b("general"), x.markClean();
    });
  }, [x, r, l]), Ke = p.useCallback((g) => {
    x.requestClose(() => {
      d((j) => {
        const w = j.findIndex((D) => D.id === g);
        return w === -1 ? j : j.slice(0, w);
      }), n(g), b("general"), x.markClean();
    });
  }, [x]), Oe = p.useCallback(async (g) => {
    var j, w, D;
    try {
      await o.addFeature(g), b(g), T(!1);
    } catch (k) {
      (D = (w = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : w.error) == null || D.call(w, (k == null ? void 0 : k.message) || "Özellik eklenemedi.");
    }
  }, [o]), Ye = p.useCallback(async (g) => {
    var j, w, D;
    try {
      await o.removeFeature(g), b((k) => k === g ? "general" : k);
    } catch (k) {
      (D = (w = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : w.error) == null || D.call(w, (k == null ? void 0 : k.message) || "Özellik kaldırılamadı.");
    }
  }, [o]);
  U.useEffect(() => {
    if (!N) return;
    const g = (w) => {
      C.current && !C.current.contains(w.target) && T(!1);
    }, j = (w) => {
      w.key === "Escape" && T(!1);
    };
    return document.addEventListener("mousedown", g), document.addEventListener("keydown", j), () => {
      document.removeEventListener("mousedown", g), document.removeEventListener("keydown", j);
    };
  }, [N]);
  const qe = c ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx($, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx($, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx($, { className: "h-24 w-full" })
  ] }) : u ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(v, { variant: "ghost", onClick: () => m(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      ft,
      {
        trail: i,
        current: { id: r, title: (l == null ? void 0 : l.title) ?? "" },
        onNavigate: Ke
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: C, children: [
      /* @__PURE__ */ e.jsx(
        mt,
        {
          tabs: E,
          activeCode: A.code,
          onSelect: (g) => {
            b(g), T(!1);
          },
          onOpenPicker: () => T((g) => !g),
          pickerOpen: N
        }
      ),
      N && /* @__PURE__ */ e.jsx(
        pt,
        {
          entries: z,
          busyCode: o.isMutating ? o.mutatingCode : null,
          onAdd: Oe,
          onRemove: Ye
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${A.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          A.code === "general" ? /* @__PURE__ */ e.jsx(
            ot,
            {
              values: f.values,
              errors: f.errors,
              onFieldChange: f.setField,
              assigneeOptions: y.options,
              isLoadingAssignees: y.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(p.Suspense, { fallback: /* @__PURE__ */ e.jsx($, { className: "h-24 w-full" }), children: le && /* @__PURE__ */ e.jsx(
            le,
            {
              taskId: r,
              task: l,
              onOpenSubtask: Me
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            ct,
            {
              task: l,
              creatorName: y.nameById.get(l.creatorId),
              lastModifierName: y.nameById.get(l.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), Ue = a === "page" ? tt : et;
  return /* @__PURE__ */ e.jsxs(
    Ue,
    {
      open: !0,
      fullscreen: ce,
      onRequestClose: ee,
      title: l ? `Görev Detayı: ${l.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        st,
        {
          task: l ?? { title: "Yükleniyor…" },
          canDelete: Pe,
          fullscreen: ce,
          onToggleFullscreen: Le,
          onClose: ee,
          onDelete: () => te(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        it,
        {
          lastSavedAt: l == null ? void 0 : l.lastModificationTime,
          isDirty: x.isDirty,
          isSaving: de,
          onCancel: ee,
          onSave: Be
        }
      ),
      children: [
        qe,
        x.pendingClose && /* @__PURE__ */ e.jsx(
          Yt,
          {
            isSaving: de,
            onStay: () => x.resolvePendingClose("stay"),
            onDiscard: () => x.resolvePendingClose("discard"),
            onSaveAndClose: Ge
          }
        ),
        Re && /* @__PURE__ */ e.jsx(
          Ot,
          {
            taskTitle: (l == null ? void 0 : l.title) ?? "",
            busy: Fe,
            onCancel: () => te(!1),
            onConfirm: Ie
          }
        )
      ]
    }
  );
}
function Ot({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [n, i] = p.useState(""), d = n.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    Ee,
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
            disabled: !d,
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
            onChange: (l) => i(l.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function Ee({ label: t, title: a, description: s, children: r, actions: n }) {
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
function Yt({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    Ee,
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
function qt({
  task: t,
  onClose: a,
  onToggleFullscreen: s,
  isFullscreen: r,
  presentation: n = "modal"
}) {
  var x;
  const [i, d] = p.useState(!1), l = [
    { id: 1, label: "Tamamlandı", color: "success" },
    { id: 2, label: "Devam Ediyor", color: "primary" },
    { id: 3, label: "Beklemede", color: "warning" }
  ], c = [
    { id: 1, label: "Kritik", color: "negative" },
    { id: 2, label: "Yüksek", color: "warning" },
    { id: 3, label: "Normal", color: "neutral" }
  ], u = l.find((f) => f.id === t.status) || l[0], m = c.find((f) => f.id === t.priority) || c[0];
  return /* @__PURE__ */ e.jsx("header", { className: "flex flex-col gap-[var(--apya-space-4)] border-b border-subtle p-[var(--apya-space-6)] pb-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsxs(L, { variant: "primary", className: "font-mono text-xs tracking-wider bg-primary-subtle text-primary", children: [
          "#",
          ((x = t.id) == null ? void 0 : x.substring(0, 8).toUpperCase()) || "OTL-2507"
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsxs(L, { variant: "success", className: "cursor-pointer hover:bg-success-hover transition-colors font-medium text-xs py-1 px-2.5", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-circle-check mr-1.5" }),
            u.label,
            " ",
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down ml-1 text-[10px]" })
          ] }),
          /* @__PURE__ */ e.jsxs(L, { variant: "negative", className: "cursor-pointer hover:bg-negative-hover transition-colors font-medium text-xs py-1 px-2.5", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-flag mr-1.5" }),
            m.label,
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
            onClick: () => d(!i),
            className: `flex h-8 w-8 items-center justify-center rounded-full transition-colors ${i ? "text-warning hover:bg-warning-subtle" : "text-text-tertiary hover:bg-surface-hover hover:text-text-secondary"}`,
            children: /* @__PURE__ */ e.jsx("i", { className: i ? "fa-solid fa-star text-lg" : "fa-regular fa-star text-lg" })
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
        n === "modal" && /* @__PURE__ */ e.jsx(
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
        n === "modal" && /* @__PURE__ */ e.jsx(
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
function R({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary uppercase tracking-wider", children: t }),
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center text-[13px] text-text-primary h-8", children: a })
  ] });
}
function Ut({ task: t }) {
  const a = "Yakup B.";
  return /* @__PURE__ */ e.jsx("div", { className: "px-[var(--apya-space-6)] py-[var(--apya-space-5)] bg-surface-base border-b border-subtle", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-y-[var(--apya-space-5)] gap-x-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsx(R, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-1.5 py-1 -ml-1.5 rounded-md transition-colors w-max", children: [
      /* @__PURE__ */ e.jsx("img", { src: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64", alt: a, className: "h-6 w-6 rounded-full border border-subtle" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: a })
    ] }) }),
    /* @__PURE__ */ e.jsx(R, { label: "Son Tarih", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-1.5 py-1 -ml-1.5 rounded-md transition-colors w-max", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-text-secondary", children: t.dueDate ? new Date(t.dueDate).toLocaleDateString("tr-TR") : "10.07.2026" })
    ] }) }),
    /* @__PURE__ */ e.jsx(R, { label: "Başlangıç", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-1.5 py-1 -ml-1.5 rounded-md transition-colors w-max", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-text-secondary", children: t.startDate ? new Date(t.startDate).toLocaleDateString("tr-TR") : "25.06.2026" })
    ] }) }),
    /* @__PURE__ */ e.jsx(R, { label: "Öncelik", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-flag text-negative" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: "Kritik" })
    ] }) }),
    /* @__PURE__ */ e.jsx(R, { label: "Durum", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-circle-check text-success" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: "Tamamlandı" })
    ] }) }),
    /* @__PURE__ */ e.jsx(R, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
      /* @__PURE__ */ e.jsx(L, { variant: "primary", className: "bg-primary-subtle text-primary hover:bg-primary-hover/20 cursor-pointer text-[11px] font-medium px-2 py-0.5", children: "Konaklama" }),
      /* @__PURE__ */ e.jsx(L, { variant: "primary", className: "bg-primary-subtle text-primary hover:bg-primary-hover/20 cursor-pointer text-[11px] font-medium px-2 py-0.5", children: "Anlaşma" }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "flex items-center justify-center h-[22px] w-[22px] rounded-full bg-surface-sunken border border-subtle text-text-tertiary hover:bg-surface-hover hover:text-text-secondary transition-colors", "aria-label": "Etiket ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[10px]" }) })
    ] }) }),
    /* @__PURE__ */ e.jsx(R, { label: "Proje", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-1.5 py-1 -ml-1.5 rounded-md transition-colors w-max", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: "Otel Projesi" })
    ] }) }),
    /* @__PURE__ */ e.jsx(R, { label: "Maliyet Merkezi", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-1.5 py-1 -ml-1.5 rounded-md transition-colors w-max", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-bullseye text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: "Merkez" })
    ] }) })
  ] }) });
}
const $t = [
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
function Vt({ assignedCodes: t = [] }) {
  const a = (s) => t.includes(s);
  return /* @__PURE__ */ e.jsxs(Qe, { children: [
    /* @__PURE__ */ e.jsx(Ze, { asChild: !0, children: /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        className: "flex h-8 w-8 items-center justify-center rounded-md border border-dashed border-text-tertiary text-text-tertiary hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:shadow-focus",
        "aria-label": "Özellik ekle",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[14px]" })
      }
    ) }),
    /* @__PURE__ */ e.jsx(Je, { children: /* @__PURE__ */ e.jsxs(
      We,
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
            $t.map((s) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", children: [
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
          /* @__PURE__ */ e.jsx(Xe, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
function _t({ activeTab: t, onTabChange: a, visibleTabs: s }) {
  const r = (n) => n === "subtasks" ? 4 : n === "files" ? 8 : n === "dependencies" ? 2 : n === "comments" ? 4 : null;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle bg-surface-base px-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsx("nav", { className: "flex items-center gap-6", "aria-label": "Görev sekmeleri", children: s.map((n) => {
      const i = t === n.code, d = r(n.code);
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => a(n.code),
          className: `
                                relative flex items-center gap-2 py-3.5 text-[13px] font-medium transition-colors
                                ${i ? "text-primary" : "text-text-secondary hover:text-text-primary"}
                            `,
          children: [
            n.title,
            d !== null && /* @__PURE__ */ e.jsx("span", { className: `
                                    flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold
                                    ${i ? "bg-primary-subtle text-primary" : "bg-surface-sunken text-text-tertiary border border-subtle"}
                                `, children: d }),
            i && /* @__PURE__ */ e.jsx("div", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" })
          ]
        },
        n.code
      );
    }) }),
    /* @__PURE__ */ e.jsx("div", { className: "py-2", children: /* @__PURE__ */ e.jsx(Vt, { assignedCodes: s.map((n) => n.code) }) })
  ] });
}
function q({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-start py-2", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary text-right font-medium max-w-[140px] truncate", title: typeof a == "string" ? a : "", children: a ?? "—" })
  ] });
}
function be({ label: t, name: a, avatar: s }) {
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
        /* @__PURE__ */ e.jsx(be, { label: "Oluşturan", name: "Yakup B.", avatar: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64" }),
        /* @__PURE__ */ e.jsx(q, { label: "Oluşturma Tarihi", value: a(t.creationTime) }),
        /* @__PURE__ */ e.jsx(be, { label: "Güncelleyen", name: "Yakup B.", avatar: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64" }),
        /* @__PURE__ */ e.jsx(q, { label: "Son Güncelleme", value: a(t.lastModificationTime) }),
        /* @__PURE__ */ e.jsx(q, { label: "Oluşturma Paneli", value: "Otomasyon" }),
        /* @__PURE__ */ e.jsx(q, { label: "Tahmini Süre", value: "15 gün" }),
        /* @__PURE__ */ e.jsx(q, { label: "Gerçekleşen Süre", value: "12 gün" })
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
function Qt() {
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
function Zt({ task: t }) {
  const [a, s] = p.useState(t.description || "Önce metne sonra mekke 60 kişilik detaylar dosyada belirtilmiş ve otel rezervasyonları yapılmıştır.");
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-semibold text-text-primary", children: "Açıklama" }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-[var(--apya-radius-md)] border border-subtle bg-surface-base focus-within:border-primary focus-within:shadow-focus transition-all", children: [
        /* @__PURE__ */ e.jsx(Qt, {}),
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
      /* @__PURE__ */ e.jsx("div", { className: "mt-2", children: /* @__PURE__ */ e.jsx(ke, { taskId: t.id, task: t }) })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-3 rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-base p-[var(--apya-space-5)]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between cursor-pointer group", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-semibold text-text-primary", children: "Yorumlar & Güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex h-5 w-5 items-center justify-center rounded-full bg-primary-subtle text-primary text-[10px] font-bold", children: "4" })
        ] }),
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-up text-text-tertiary group-hover:text-text-secondary transition-colors" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2", children: /* @__PURE__ */ e.jsx(Te, { taskId: t.id, task: t }) })
    ] })
  ] });
}
function ze({
  task: t,
  presentation: a = "modal",
  onClose: s,
  isFullscreen: r,
  onToggleFullscreen: n,
  switchToTask: i
}) {
  const { features: d, assignedFeatures: l, currentTaskId: c } = je(), [u, m] = p.useState("general"), x = De(l), f = x.find((y) => y.code === u) || x[0];
  return /* @__PURE__ */ e.jsxs("div", { className: "flex h-full flex-col bg-surface-sunken", children: [
    /* @__PURE__ */ e.jsx(
      qt,
      {
        task: t,
        onClose: s,
        isFullscreen: r,
        onToggleFullscreen: n,
        presentation: a
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-1 overflow-hidden", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-1 flex-col overflow-y-auto", children: [
      /* @__PURE__ */ e.jsx(Ut, { task: t }),
      /* @__PURE__ */ e.jsx(
        _t,
        {
          activeTab: u,
          onTabChange: m,
          visibleTabs: x
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "flex-1 p-[var(--apya-space-6)]", children: u === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col lg:flex-row gap-[var(--apya-space-6)]", children: [
        /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ e.jsx(Zt, { task: t }) }),
        /* @__PURE__ */ e.jsx("div", { className: "w-full lg:w-[320px] shrink-0", children: /* @__PURE__ */ e.jsx(Ht, { task: t }) })
      ] }) : (
        /* Other Feature Tabs (Subtasks, Files, etc.) */
        /* @__PURE__ */ e.jsx(p.Suspense, { fallback: /* @__PURE__ */ e.jsx($, { className: "h-48 w-full" }), children: f != null && f.component ? /* @__PURE__ */ e.jsx(
          f.component,
          {
            taskId: c,
            task: t,
            onOpenSubtask: i
          }
        ) : /* @__PURE__ */ e.jsxs("div", { className: "text-center py-12 text-text-tertiary border border-dashed border-subtle rounded-xl", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-person-digging text-4xl mb-4 opacity-50" }),
          /* @__PURE__ */ e.jsx("p", { children: "Bu sekme yapım aşamasında." })
        ] }) })
      ) })
    ] }) })
  ] });
}
function Jt() {
  var a;
  const t = p.useSyncExternalStore(
    S.subscribe,
    S.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(W, { children: /* @__PURE__ */ e.jsx(
    ze,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        S.close(), S.emitResult();
      }
    }
  ) }) : /* @__PURE__ */ e.jsx(W, { children: /* @__PURE__ */ e.jsx(
    Se,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        S.close(), S.emitResult();
      }
    }
  ) }) : null;
}
function Wt() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v2" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : !(window.localStorage.getItem("apya.taskDetail.v2") === "0");
  } catch {
    return !0;
  }
}
function Xt() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v3" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v2" || new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : window.localStorage.getItem("apya.taskDetail.v3") === "1" || !0;
  } catch {
    return !0;
  }
}
const ve = document.getElementById("task-detail-island");
if (ve && (window.apya = window.apya || {}, window.apya.taskDetailV3Enabled = Xt(), window.apya.taskDetailV2Enabled = Wt() && !window.apya.taskDetailV3Enabled, window.apya.taskDetail = {
  open: (t) => S.open(t),
  close: () => S.close(),
  onResult: (t) => S.onResult(t)
}, ge(ve).render(/* @__PURE__ */ e.jsx(Jt, {})), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled)) {
  const t = we();
  t && S.open(t);
}
function ea({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(W, { children: /* @__PURE__ */ e.jsx(
    ze,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(W, { children: /* @__PURE__ */ e.jsx(
    Se,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) });
}
const se = document.getElementById("task-detail-page-island");
if (se) {
  const t = se.getAttribute("data-task-id");
  t && ge(se).render(/* @__PURE__ */ e.jsx(ea, { taskId: t }));
}
