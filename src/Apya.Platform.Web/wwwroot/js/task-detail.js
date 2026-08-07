import { j as t, r as m, d as q, b as ye } from "./react-vendor.js";
/* empty css      */
import { a as he } from "./QueryProvider.js";
import { u as Y, a as B, b as L } from "./query-vendor.js";
import { D as Be, l as Ge, e as H, B as C, I as R, S as $ } from "./Dialog.js";
import { C as Me } from "./Combobox.js";
import { r as Ke } from "./httpClient.js";
function qe({
  open: e,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: n,
  footer: i,
  children: d
}) {
  return /* @__PURE__ */ t.jsx(
    Be,
    {
      open: e,
      onOpenChange: (l) => {
        l || a();
      },
      children: /* @__PURE__ */ t.jsx(
        Ge,
        {
          title: r,
          fullscreen: s,
          onInteractOutside: (l) => {
            l.preventDefault(), a();
          },
          onEscapeKeyDown: (l) => {
            l.preventDefault(), a();
          },
          children: /* @__PURE__ */ t.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
            n,
            /* @__PURE__ */ t.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: d }),
            i
          ] })
        }
      )
    }
  );
}
function Ue({ title: e, header: a, footer: s, children: r }) {
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      className: "flex h-full min-h-[calc(100vh-120px)] flex-col rounded-xl border border-default bg-surface-elevated shadow-sm",
      "aria-label": e,
      children: /* @__PURE__ */ t.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
        a,
        /* @__PURE__ */ t.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: r }),
        s
      ] })
    }
  );
}
function Ye({ isPrivate: e }) {
  return e ? /* @__PURE__ */ t.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1.5 text-[13px] text-text-secondary",
      title: "Bu görev yalnızca yetkilendirilmiş kullanıcılar tarafından görüntülenebilir.",
      children: [
        /* @__PURE__ */ t.jsx("i", { className: "fa fa-lock text-text-tertiary", "aria-hidden": "true" }),
        "Sınırlı erişim"
      ]
    }
  ) : null;
}
const U = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, te = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function Oe({
  task: e,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: n,
  fullscreen: i = !1
}) {
  const [d, l] = m.useState(!1), c = m.useRef(null);
  m.useEffect(() => {
    if (!d) return;
    const y = (f) => {
      c.current && !c.current.contains(f.target) && l(!1);
    }, o = (f) => {
      f.key === "Escape" && l(!1);
    };
    return document.addEventListener("mousedown", y), document.addEventListener("keydown", o), () => {
      document.removeEventListener("mousedown", y), document.removeEventListener("keydown", o);
    };
  }, [d]);
  const x = U[e == null ? void 0 : e.status] ?? U[1], u = te[e == null ? void 0 : e.priority] ?? te[2], p = () => {
    e != null && e.id && window.open(`/Tasks/Detail/${e.id}`, "_blank"), l(!1);
  }, h = () => {
    var o, f, v, w;
    const y = `${window.location.origin}/Tasks/Detail/${e.id}`;
    (o = navigator.clipboard) == null || o.writeText(y), (w = (v = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : v.info) == null || w.call(v, "Bağlantı kopyalandı."), l(!1);
  };
  return /* @__PURE__ */ t.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ t.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ t.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ t.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: e == null ? void 0 : e.title }),
      /* @__PURE__ */ t.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ t.jsx(H, { variant: x.variant, children: x.text }),
        /* @__PURE__ */ t.jsx(H, { variant: u.variant, children: u.text }),
        /* @__PURE__ */ t.jsx(Ye, { isPrivate: e == null ? void 0 : e.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          "aria-label": i ? "Küçült" : "Tam ekrana büyüt",
          onClick: n,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ t.jsx("i", { className: i ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ t.jsxs("div", { className: "relative", ref: c, children: [
        /* @__PURE__ */ t.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": d,
            onClick: () => l((y) => !y),
            className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
            children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-ellipsis", "aria-hidden": "true" })
          }
        ),
        d && /* @__PURE__ */ t.jsxs(
          "div",
          {
            role: "menu",
            className: "absolute right-0 z-popover mt-1 w-56 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated py-1 shadow-xl",
            children: [
              /* @__PURE__ */ t.jsxs(
                "button",
                {
                  type: "button",
                  role: "menuitem",
                  onClick: p,
                  className: "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-raised",
                  children: [
                    /* @__PURE__ */ t.jsx("i", { className: "fa fa-arrow-up-right-from-square w-4 text-text-tertiary", "aria-hidden": "true" }),
                    "Yeni sekmede aç"
                  ]
                }
              ),
              /* @__PURE__ */ t.jsxs(
                "button",
                {
                  type: "button",
                  role: "menuitem",
                  onClick: h,
                  className: "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-raised",
                  children: [
                    /* @__PURE__ */ t.jsx("i", { className: "fa fa-link w-4 text-text-tertiary", "aria-hidden": "true" }),
                    "Bağlantıyı kopyala"
                  ]
                }
              ),
              /* @__PURE__ */ t.jsxs(
                "button",
                {
                  type: "button",
                  role: "menuitem",
                  disabled: !0,
                  title: "Yakında",
                  className: "flex w-full cursor-not-allowed items-center gap-2 px-3 py-2 text-left text-sm text-text-tertiary",
                  children: [
                    /* @__PURE__ */ t.jsx("i", { className: "fa fa-copy w-4", "aria-hidden": "true" }),
                    "Çoğalt",
                    /* @__PURE__ */ t.jsx("span", { className: "ml-auto text-[11px]", children: "Yakında" })
                  ]
                }
              ),
              /* @__PURE__ */ t.jsxs(
                "button",
                {
                  type: "button",
                  role: "menuitem",
                  disabled: !0,
                  title: "Yakında",
                  className: "flex w-full cursor-not-allowed items-center gap-2 px-3 py-2 text-left text-sm text-text-tertiary",
                  children: [
                    /* @__PURE__ */ t.jsx("i", { className: "fa fa-box-archive w-4", "aria-hidden": "true" }),
                    "Arşivle",
                    /* @__PURE__ */ t.jsx("span", { className: "ml-auto text-[11px]", children: "Yakında" })
                  ]
                }
              ),
              a && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
                /* @__PURE__ */ t.jsx("div", { className: "my-1 h-px bg-border-subtle" }),
                /* @__PURE__ */ t.jsxs(
                  "button",
                  {
                    type: "button",
                    role: "menuitem",
                    onClick: () => {
                      l(!1), r();
                    },
                    className: "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-negative hover:bg-surface-raised",
                    children: [
                      /* @__PURE__ */ t.jsx("i", { className: "fa fa-trash w-4", "aria-hidden": "true" }),
                      "Sil"
                    ]
                  }
                )
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          "aria-label": "Kapat",
          onClick: s,
          className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] })
  ] }) });
}
const $e = (e) => e ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(e)) : null;
function _e({ lastSavedAt: e, isDirty: a, isSaving: s, onCancel: r, onSave: n }) {
  const i = $e(e);
  return /* @__PURE__ */ t.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: i ? `Son kayıt: ${i}` : " " }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ t.jsx(C, { variant: "secondary", onClick: r, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ t.jsx(
        C,
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
const de = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Ve = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function P({ label: e, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: e }),
    r,
    s && /* @__PURE__ */ t.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function Qe({ value: e, onChange: a }) {
  const [s, r] = m.useState(""), n = () => {
    const i = s.trim();
    i && !e.includes(i) && a([...e, i]), r("");
  };
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: e.map((i) => /* @__PURE__ */ t.jsxs(H, { variant: "neutral", children: [
      i,
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${i} etiketini kaldır`,
          onClick: () => a(e.filter((d) => d !== i)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, i)) }),
    /* @__PURE__ */ t.jsx(
      R,
      {
        value: s,
        onChange: (i) => r(i.target.value),
        onKeyDown: (i) => {
          i.key === "Enter" || i.key === "," ? (i.preventDefault(), n()) : i.key === "Backspace" && !s && e.length && a(e.slice(0, -1));
        },
        onBlur: n,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function He({
  values: e,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: n = !1
}) {
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx(P, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ t.jsx(
      R,
      {
        id: "task-title",
        value: e.title,
        onChange: (i) => s("title", i.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ t.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ t.jsx(P, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ t.jsx(
        "select",
        {
          id: "task-status",
          value: e.status,
          onChange: (i) => s("status", Number(i.target.value)),
          className: de,
          children: Object.entries(U).map(([i, d]) => /* @__PURE__ */ t.jsx("option", { value: i, children: d.text }, i))
        }
      ) }),
      /* @__PURE__ */ t.jsx(P, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ t.jsx(
        "select",
        {
          id: "task-priority",
          value: e.priority,
          onChange: (i) => s("priority", Number(i.target.value)),
          className: de,
          children: Object.entries(te).map(([i, d]) => /* @__PURE__ */ t.jsx("option", { value: i, children: d.text }, i))
        }
      ) })
    ] }),
    /* @__PURE__ */ t.jsx(P, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ t.jsx(
      Me,
      {
        id: "task-assignee",
        options: r,
        value: e.assigneeId,
        onChange: (i) => s("assigneeId", i),
        placeholder: n ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: n
      }
    ) }),
    /* @__PURE__ */ t.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ t.jsx(P, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ t.jsx(
        R,
        {
          id: "task-start",
          type: "date",
          value: e.startDate,
          onChange: (i) => s("startDate", i.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ t.jsx(P, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ t.jsx(
        R,
        {
          id: "task-due",
          type: "date",
          value: e.dueDate,
          onChange: (i) => s("dueDate", i.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ t.jsx(P, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ t.jsx(Qe, { value: e.tagNames, onChange: (i) => s("tagNames", i) }) }),
    /* @__PURE__ */ t.jsx(P, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ t.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: e.description,
        onChange: (i) => s("description", i.target.value),
        className: Ve
      }
    ) })
  ] });
}
const ue = (e) => e ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(e)) : "—";
function K({ label: e, value: a }) {
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("dt", { className: "text-[13px] text-text-tertiary", children: e }),
    /* @__PURE__ */ t.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function Ze({ task: e, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ t.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ t.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ t.jsx(K, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ t.jsx(K, { label: "Oluşturulma zamanı", value: ue(e.creationTime) }),
      /* @__PURE__ */ t.jsx(K, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ t.jsx(K, { label: "Son güncelleme zamanı", value: ue(e.lastModificationTime) }),
      /* @__PURE__ */ t.jsx(K, { label: "Proje", value: e.projectName })
    ] })
  ] });
}
const Je = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", We = "border-brand-500 text-text-primary";
function Xe({ tabs: e, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: n }) {
  const i = m.useRef(/* @__PURE__ */ new Map()), d = (c) => {
    var x;
    s(c.code), (x = i.current.get(c.code)) == null || x.focus();
  }, l = (c, x) => {
    c.key === "ArrowRight" ? (c.preventDefault(), d(e[(x + 1) % e.length])) : c.key === "ArrowLeft" ? (c.preventDefault(), d(e[(x - 1 + e.length) % e.length])) : c.key === "Home" ? (c.preventDefault(), d(e[0])) : c.key === "End" && (c.preventDefault(), d(e[e.length - 1]));
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ t.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: e.map((c, x) => {
      const u = c.code === a;
      return /* @__PURE__ */ t.jsxs(
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
          onKeyDown: (p) => l(p, x),
          className: `${Je} ${u ? We : ""}`,
          children: [
            /* @__PURE__ */ t.jsx("i", { className: `fa ${c.icon}`, "aria-hidden": "true" }),
            c.title
          ]
        },
        c.code
      );
    }) }),
    /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        "aria-label": "Özellik ekle",
        "aria-haspopup": "dialog",
        "aria-expanded": n,
        onClick: r,
        className: "mx-1 grid h-8 w-8 flex-none place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
        children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" })
      }
    )
  ] });
}
const et = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function tt({ entries: e, onAdd: a, onRemove: s, busyCode: r }) {
  const [n, i] = m.useState(""), d = m.useMemo(() => {
    const l = n.trim().toLocaleLowerCase("tr-TR"), c = l ? e.filter((u) => u.title.toLocaleLowerCase("tr-TR").includes(l)) : e, x = /* @__PURE__ */ new Map();
    return c.forEach((u) => {
      const p = x.get(u.category) ?? [];
      p.push(u), x.set(u.category, p);
    }), x;
  }, [e, n]);
  return /* @__PURE__ */ t.jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Özellik ekle",
      className: "absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl",
      children: [
        /* @__PURE__ */ t.jsx(
          R,
          {
            autoFocus: !0,
            value: n,
            onChange: (l) => i(l.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ t.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          d.size === 0 && /* @__PURE__ */ t.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...d.entries()].map(([l, c]) => /* @__PURE__ */ t.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ t.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: et[l] ?? l }),
            c.map((x) => /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ t.jsx("i", { className: `fa ${x.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ t.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: x.title }),
              !x.implemented && /* @__PURE__ */ t.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              x.implemented && !x.isAssigned && /* @__PURE__ */ t.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === x.code,
                  onClick: () => a(x.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              x.implemented && x.isAssigned && /* @__PURE__ */ t.jsx(
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
          ] }, l))
        ] })
      ]
    }
  );
}
function at({ trail: e = [], current: a, onNavigate: s }) {
  return e.length === 0 ? null : /* @__PURE__ */ t.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    e.map((r) => /* @__PURE__ */ t.jsxs(q.Fragment, { children: [
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          onClick: () => s == null ? void 0 : s(r.id),
          className: "hover:underline hover:text-text-primary",
          children: r.title
        }
      ),
      /* @__PURE__ */ t.jsx("span", { "aria-hidden": "true", children: "/" })
    ] }, r.id)),
    /* @__PURE__ */ t.jsx("span", { className: "font-medium text-text-primary", children: a.title })
  ] });
}
function st(e) {
  var s, r, n;
  const a = (n = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : n.task;
  return a ? Promise.resolve(a.get(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function rt(e) {
  return Y({
    queryKey: ["task-detail", e],
    queryFn: () => st(e),
    enabled: !!e,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function Z(e) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, e));
}
function it() {
  const [e, a] = m.useState(!1), [s, r] = m.useState(!1), n = m.useRef(null), i = m.useCallback(() => a(!0), []), d = m.useCallback(() => a(!1), []);
  m.useEffect(() => {
    if (!e) return;
    const x = (u) => {
      u.preventDefault(), u.returnValue = "";
    };
    return window.addEventListener("beforeunload", x), () => window.removeEventListener("beforeunload", x);
  }, [e]);
  const l = m.useCallback((x) => {
    if (!e) {
      x == null || x();
      return;
    }
    n.current = x ?? null, r(!0);
  }, [e]), c = m.useCallback((x) => {
    const u = n.current;
    return r(!1), n.current = null, x === "discard" && (a(!1), u == null || u()), x === "save" ? u : null;
  }, []);
  return { isDirty: e, markDirty: i, markClean: d, requestClose: l, pendingClose: s, resolvePendingClose: c };
}
const nt = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, se = "task";
function ve() {
  if (typeof window > "u") return null;
  const e = new URLSearchParams(window.location.search).get(se);
  return e && nt.test(e) ? e : null;
}
function lt() {
  if (typeof window > "u") return;
  const e = new URL(window.location.href);
  e.searchParams.delete(se), window.history.replaceState(null, "", e.pathname + e.search + e.hash);
}
function ot(e, a) {
  const s = m.useRef(a);
  s.current = a, m.useEffect(() => {
    if (!e || ve() === e) return;
    const r = new URL(window.location.href);
    r.searchParams.set(se, e), window.history.pushState({ apyaTask: e }, "", r.pathname + r.search + r.hash);
  }, [e]), m.useEffect(() => {
    const r = () => {
      var n;
      (n = s.current) == null || n.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const ct = {
  title: "",
  description: "",
  startDate: "",
  dueDate: "",
  status: 1,
  priority: 2,
  assigneeId: null,
  tagNames: []
};
function dt(e) {
  return e ? {
    title: e.title ?? "",
    description: e.description ?? "",
    startDate: e.startDate ? e.startDate.slice(0, 10) : "",
    dueDate: e.dueDate ? e.dueDate.slice(0, 10) : "",
    status: e.status ?? 1,
    priority: e.priority ?? 2,
    assigneeId: e.assigneeId ?? null,
    tagNames: (e.tags ?? []).map((a) => a.name)
  } : ct;
}
function ut(e) {
  const [a, s] = m.useState(e == null ? void 0 : e.id), r = m.useMemo(() => dt(e), [e]), [n, i] = m.useState(r), [d, l] = m.useState({});
  (e == null ? void 0 : e.id) !== a && (s(e == null ? void 0 : e.id), i(r), l({}));
  const c = m.useCallback((y, o) => {
    i((f) => ({ ...f, [y]: o }));
  }, []), x = m.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(r),
    [n, r]
  ), u = m.useCallback(() => {
    const y = {};
    return n.title.trim() || (y.title = "Başlık zorunlu."), n.startDate || (y.startDate = "Başlangıç tarihi zorunlu."), n.dueDate && n.startDate && n.dueDate < n.startDate && (y.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), l(y), Object.keys(y).length === 0;
  }, [n]), p = m.useCallback(() => ({
    title: n.title.trim(),
    description: n.description || null,
    startDate: n.startDate,
    dueDate: n.dueDate || null,
    status: n.status,
    priority: n.priority,
    assigneeId: n.assigneeId,
    boardColumnId: (e == null ? void 0 : e.boardColumnId) ?? null,
    projectId: (e == null ? void 0 : e.projectId) ?? null,
    parentTaskId: (e == null ? void 0 : e.parentTaskId) ?? null,
    isPrivate: !!(e != null && e.isPrivate),
    predecessorIds: (e == null ? void 0 : e.predecessorIds) ?? [],
    tagNames: n.tagNames
  }), [n, e]), h = m.useCallback(() => {
    i(r), l({});
  }, [r]);
  return { values: n, setField: c, isDirty: x, errors: d, validate: u, toUpdateDto: p, reset: h };
}
function me(e) {
  return [e.name, e.surname].filter(Boolean).join(" ") || e.userName;
}
function mt() {
  var a, s, r;
  const e = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return e ? Promise.resolve(e.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function xt() {
  var n;
  const e = Y({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: mt,
    staleTime: 3e5,
    retry: !1
  }), a = ((n = e.data) == null ? void 0 : n.items) ?? [], s = a.map((i) => ({ value: i.id, label: me(i) })), r = new Map(a.map((i) => [i.id, me(i)]));
  return { options: s, nameById: r, isLoading: e.isLoading };
}
function ae() {
  var a, s, r;
  const e = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return e || null;
}
function pt(e) {
  const a = ae();
  return a ? Promise.resolve(a.getFeatureAssignments(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ft(e) {
  const a = B(), s = ["task-features", e], r = Y({
    queryKey: s,
    queryFn: () => pt(e),
    enabled: !!e,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = L({
    mutationFn: (l) => Promise.resolve(ae().addFeature(e, l)),
    onSuccess: n
  }), d = L({
    mutationFn: (l) => Promise.resolve(ae().removeFeature(e, l)),
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
function yt({ taskId: e, task: a, onOpenSubtask: s }) {
  const [r, n] = m.useState(""), [i, d] = m.useState(!1), [l, c] = m.useState(null), x = B(), u = (a == null ? void 0 : a.subTasks) ?? [], p = () => x.invalidateQueries({ queryKey: ["task-detail", e] }), h = async () => {
    var f, v, w;
    const o = r.trim();
    if (o) {
      d(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: o,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: e,
          projectId: a == null ? void 0 : a.projectId
        })), n(""), await p();
      } catch (k) {
        (w = (v = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : v.error) == null || w.call(v, (k == null ? void 0 : k.message) || "Alt görev eklenemedi.");
      } finally {
        d(!1);
      }
    }
  }, y = async (o) => {
    var f, v, w;
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(o)), await p();
    } catch (k) {
      (w = (v = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : v.error) == null || w.call(v, (k == null ? void 0 : k.message) || "Alt görev silinemedi.");
    } finally {
      c(null);
    }
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ t.jsx(
        R,
        {
          value: r,
          onChange: (o) => n(o.target.value),
          onKeyDown: (o) => {
            o.key === "Enter" && h();
          },
          placeholder: "Yeni alt görev başlığı",
          disabled: i
        }
      ),
      /* @__PURE__ */ t.jsx(C, { variant: "secondary", onClick: h, disabled: i || !r.trim(), children: "Alt Görev Ekle" })
    ] }),
    u.length === 0 ? /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz alt görev yok." }) : /* @__PURE__ */ t.jsx("ul", { className: "divide-y divide-border-default", children: u.map((o) => {
      var f, v;
      return /* @__PURE__ */ t.jsxs("li", { className: "flex items-center justify-between py-2", children: [
        /* @__PURE__ */ t.jsx(
          "button",
          {
            type: "button",
            onClick: () => s == null ? void 0 : s(o.id, o.title),
            className: "text-left text-sm font-medium text-text-primary hover:underline",
            children: o.title
          }
        ),
        /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ t.jsx(H, { variant: ((f = U[o.status]) == null ? void 0 : f.variant) ?? "neutral", children: ((v = U[o.status]) == null ? void 0 : v.text) ?? o.status }),
          l === o.id ? /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
            /* @__PURE__ */ t.jsx("span", { className: "text-xs text-text-tertiary", children: "Emin misiniz?" }),
            /* @__PURE__ */ t.jsx(C, { variant: "destructive", onClick: () => y(o.id), children: "Evet, sil" }),
            /* @__PURE__ */ t.jsx(C, { variant: "ghost", onClick: () => c(null), children: "Vazgeç" })
          ] }) : /* @__PURE__ */ t.jsx(C, { variant: "ghost", onClick: () => c(o.id), "aria-label": `${o.title} alt görevini sil`, children: "Sil" })
        ] })
      ] }, o.id);
    }) })
  ] });
}
function ge() {
  var a, s, r;
  const e = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return e || null;
}
function ht(e) {
  const a = ge();
  return a ? Promise.resolve(a.getAttachments(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function vt(e, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, n = Ke();
  n && (r.RequestVerificationToken = n);
  const i = await fetch(`/api/tasks/attachments/upload/${e}`, {
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
function gt(e) {
  const a = B(), s = ["task-attachments", e], r = Y({
    queryKey: s,
    queryFn: () => ht(e),
    enabled: !!e,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = L({
    mutationFn: (l) => vt(e, l),
    onSuccess: n
  }), d = L({
    mutationFn: (l) => Promise.resolve(ge().deleteAttachment(l)),
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
function bt(e) {
  return `${Math.round(e / 1024)} KB`;
}
function jt({ taskId: e }) {
  const { attachments: a, upload: s, remove: r, isUploading: n } = gt(e), i = m.useRef(null), d = async (c) => {
    var u, p, h, y, o, f, v;
    const x = (u = c.target.files) == null ? void 0 : u[0];
    if (x)
      try {
        await s(x), (y = (h = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : h.success) == null || y.call(h, "Dosya yüklendi.");
      } catch (w) {
        (v = (f = (o = window == null ? void 0 : window.abp) == null ? void 0 : o.notify) == null ? void 0 : f.error) == null || v.call(f, (w == null ? void 0 : w.message) || "Dosya yüklenemedi.");
      } finally {
        i.current && (i.current.value = "");
      }
  }, l = async (c, x) => {
    var u, p, h;
    try {
      await r(c);
    } catch (y) {
      (h = (p = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : p.error) == null || h.call(p, (y == null ? void 0 : y.message) || `${x} silinemedi.`);
    }
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ t.jsx("input", { ref: i, type: "file", onChange: d, className: "text-sm", disabled: n }),
      n && /* @__PURE__ */ t.jsx("span", { className: "text-sm text-text-tertiary", children: "Yükleniyor…" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ t.jsx("ul", { className: "divide-y divide-border-default", children: a.map((c) => /* @__PURE__ */ t.jsxs("li", { className: "flex items-center justify-between py-2", children: [
      /* @__PURE__ */ t.jsxs("div", { children: [
        /* @__PURE__ */ t.jsx("a", { href: c.downloadUrl, target: "_blank", rel: "noreferrer", className: "text-sm font-medium text-text-primary hover:underline", children: c.fileName }),
        /* @__PURE__ */ t.jsxs("p", { className: "text-xs text-text-tertiary", children: [
          bt(c.fileSize),
          " — ",
          c.uploaderName
        ] })
      ] }),
      /* @__PURE__ */ t.jsx(C, { variant: "ghost", onClick: () => l(c.id, c.fileName), "aria-label": `${c.fileName} dosyasini sil`, children: "Sil" })
    ] }, c.id)) })
  ] });
}
function V() {
  var a, s, r;
  const e = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return e || null;
}
function wt(e) {
  const a = V();
  return a ? Promise.resolve(a.getChecklistItems(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Nt(e) {
  const a = B(), s = ["task-checklist", e], r = Y({
    queryKey: s,
    queryFn: () => wt(e),
    enabled: !!e,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = L({
    mutationFn: (c) => Promise.resolve(V().addChecklistItem(e, c)),
    onSuccess: n
  }), d = L({
    mutationFn: (c) => Promise.resolve(V().toggleChecklistItem(c)),
    onSuccess: n
  }), l = L({
    mutationFn: (c) => Promise.resolve(V().deleteChecklistItem(c)),
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
function kt({ taskId: e }) {
  const { items: a, addItem: s, toggleItem: r, removeItem: n } = Nt(e), [i, d] = m.useState(""), l = async () => {
    var p, h, y;
    const u = i.trim();
    if (u)
      try {
        await s(u), d("");
      } catch (o) {
        (y = (h = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : h.error) == null || y.call(h, (o == null ? void 0 : o.message) || "Madde eklenemedi.");
      }
  }, c = async (u) => {
    var p, h, y;
    try {
      await r(u);
    } catch (o) {
      (y = (h = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : h.error) == null || y.call(h, (o == null ? void 0 : o.message) || "Madde güncellenemedi.");
    }
  }, x = async (u, p) => {
    var h, y, o;
    try {
      await n(u);
    } catch (f) {
      (o = (y = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : y.error) == null || o.call(y, (f == null ? void 0 : f.message) || `${p} silinemedi.`);
    }
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ t.jsx(
        R,
        {
          value: i,
          onChange: (u) => d(u.target.value),
          onKeyDown: (u) => {
            u.key === "Enter" && l();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ t.jsx(C, { variant: "secondary", onClick: l, disabled: !i.trim(), children: "Ekle" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz madde eklenmemiş." }) : /* @__PURE__ */ t.jsx("ul", { className: "space-y-1.5", children: a.map((u) => /* @__PURE__ */ t.jsxs("li", { className: "flex items-center justify-between gap-2 py-1", children: [
      /* @__PURE__ */ t.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ t.jsx(
          "input",
          {
            type: "checkbox",
            checked: u.isDone,
            onChange: () => c(u.id)
          }
        ),
        /* @__PURE__ */ t.jsx("span", { className: u.isDone ? "text-text-tertiary line-through" : "text-text-primary", children: u.text })
      ] }),
      /* @__PURE__ */ t.jsx(C, { variant: "ghost", onClick: () => x(u.id, u.text), "aria-label": `${u.text} maddesini sil`, children: "Sil" })
    ] }, u.id)) })
  ] });
}
function Ct({ taskId: e, task: a }) {
  const [s, r] = m.useState(""), [n, i] = m.useState(null), [d, l] = m.useState(""), [c, x] = m.useState(!1), u = B(), p = (a == null ? void 0 : a.comments) ?? [], h = async (o) => {
    var f, v, w, k, T, S;
    if (o == null || o.preventDefault(), !(!s.trim() || c)) {
      x(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(e, s.trim())
        ), r(""), u.invalidateQueries({ queryKey: ["task-detail", e] }), (w = (v = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : v.success) == null || w.call(v, "Yorum eklendi.");
      } catch (E) {
        (S = (T = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : T.error) == null || S.call(T, (E == null ? void 0 : E.message) || "Yorum eklenemedi.");
      } finally {
        x(!1);
      }
    }
  }, y = async (o) => {
    var f, v, w, k, T, S;
    if (!(!d.trim() || c)) {
      x(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(o, d.trim())
        ), l(""), i(null), u.invalidateQueries({ queryKey: ["task-detail", e] }), (w = (v = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : v.success) == null || w.call(v, "Yanıt eklendi.");
      } catch (E) {
        (S = (T = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : T.error) == null || S.call(T, (E == null ? void 0 : E.message) || "Yanıt eklenemedi.");
      } finally {
        x(!1);
      }
    }
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ t.jsxs("form", { onSubmit: h, className: "rounded-lg border border-default p-3 bg-surface-base", children: [
      /* @__PURE__ */ t.jsx(
        "textarea",
        {
          rows: 3,
          value: s,
          onChange: (o) => r(o.target.value),
          placeholder: "Bir yorum veya güncelleme yazın...",
          className: "w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
        }
      ),
      /* @__PURE__ */ t.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ t.jsx(
        C,
        {
          type: "submit",
          variant: "primary",
          disabled: !s.trim() || c,
          isLoading: c,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    p.length === 0 ? /* @__PURE__ */ t.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ t.jsx("div", { className: "space-y-3", children: p.map((o) => /* @__PURE__ */ t.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ t.jsx("span", { className: "font-semibold text-text-primary", children: o.creatorUserName || o.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ t.jsx("span", { children: o.creationTime ? new Date(o.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: o.text }),
      /* @__PURE__ */ t.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ t.jsx(
        C,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => i(n === o.id ? null : o.id),
          children: "Yanıtla"
        }
      ) }),
      n === o.id && /* @__PURE__ */ t.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ t.jsx(
          "textarea",
          {
            rows: 2,
            value: d,
            onChange: (f) => l(f.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ t.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ t.jsx(C, { variant: "ghost", size: "sm", onClick: () => i(null), children: "İptal" }),
          /* @__PURE__ */ t.jsx(C, { variant: "primary", size: "sm", disabled: !d.trim() || c, onClick: () => y(o.id), children: "Gönder" })
        ] })
      ] }),
      o.replies && o.replies.length > 0 && /* @__PURE__ */ t.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: o.replies.map((f) => /* @__PURE__ */ t.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ t.jsx("span", { className: "font-medium text-text-secondary", children: f.creatorUserName || f.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ t.jsx("span", { children: f.creationTime ? new Date(f.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-primary", children: f.text })
      ] }, f.id)) })
    ] }, o.id)) })
  ] });
}
function Tt({ task: e }) {
  const a = [];
  return e != null && e.creationTime && a.push({
    id: "created",
    type: "create",
    icon: "fa-plus",
    title: "Görev oluşturuldu",
    user: e.creatorUserName || e.creatorName || "Sistem / Kullanıcı",
    time: new Date(e.creationTime).toLocaleString("tr-TR")
  }), e != null && e.lastModificationTime && a.push({
    id: "modified",
    type: "update",
    icon: "fa-pen",
    title: "Görev güncellendi",
    user: e.lastModifierUserName || e.lastModifierName || "Kullanıcı",
    time: new Date(e.lastModificationTime).toLocaleString("tr-TR")
  }), e != null && e.attachments && e.attachments.length > 0 && a.push({
    id: "files",
    type: "file",
    icon: "fa-paperclip",
    title: `${e.attachments.length} dosya eki mevcut`,
    user: "Sistem",
    time: ""
  }), /* @__PURE__ */ t.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ t.jsx("h4", { className: "text-sm font-semibold text-text-primary", children: "Aktivite Zaman Çizelgesi" }),
    a.length === 0 ? /* @__PURE__ */ t.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Aktivite kaydı bulunamadı." }) : /* @__PURE__ */ t.jsx("div", { className: "relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-subtle", children: a.map((s) => /* @__PURE__ */ t.jsxs("div", { className: "relative flex items-start justify-between gap-3 text-xs", children: [
      /* @__PURE__ */ t.jsx("span", { className: "absolute -left-6 flex h-4 w-4 items-center justify-center rounded-full bg-surface-raised text-text-tertiary", children: /* @__PURE__ */ t.jsx("i", { className: `fa ${s.icon} text-[10px]`, "aria-hidden": "true" }) }),
      /* @__PURE__ */ t.jsxs("div", { children: [
        /* @__PURE__ */ t.jsx("p", { className: "font-medium text-text-primary", children: s.title }),
        s.user && /* @__PURE__ */ t.jsxs("span", { className: "text-text-tertiary", children: [
          "Yapan: ",
          s.user
        ] })
      ] }),
      s.time && /* @__PURE__ */ t.jsx("span", { className: "text-text-tertiary whitespace-nowrap", children: s.time })
    ] }, s.id)) })
  ] });
}
function Dt({ task: e }) {
  const a = [
    { label: "Görev ID", value: (e == null ? void 0 : e.id) || "-" },
    { label: "Oluşturan", value: (e == null ? void 0 : e.creatorUserName) || (e == null ? void 0 : e.creatorName) || "Bilinmiyor" },
    { label: "Oluşturulma Tarihi", value: e != null && e.creationTime ? new Date(e.creationTime).toLocaleString("tr-TR") : "-" },
    { label: "Son Güncelleyen", value: (e == null ? void 0 : e.lastModifierUserName) || (e == null ? void 0 : e.lastModifierName) || "Henüz güncellenmedi" },
    { label: "Son Güncelleme Tarihi", value: e != null && e.lastModificationTime ? new Date(e.lastModificationTime).toLocaleString("tr-TR") : "-" },
    { label: "Proje ID", value: (e == null ? void 0 : e.projectId) || "Genel Projesiz Görev" }
  ];
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ t.jsx("h4", { className: "text-sm font-semibold text-text-primary", children: "Teknik Audit & Değişiklik Geçmişi" }),
    /* @__PURE__ */ t.jsx("div", { className: "rounded-lg border border-default divide-y divide-border-subtle bg-surface-elevated", children: a.map((s, r) => /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between p-3 text-xs", children: [
      /* @__PURE__ */ t.jsx("span", { className: "font-medium text-text-secondary", children: s.label }),
      /* @__PURE__ */ t.jsx("span", { className: "font-mono text-text-primary", children: s.value })
    ] }, r)) })
  ] });
}
function St({ task: e }) {
  var x;
  const a = typeof window < "u" && !!((x = window == null ? void 0 : window.abp) != null && x.auth), s = a ? Z("Platform.Expenses.Default") : !0, r = a ? Z("Platform.Incomes.Default") : !0;
  if (!s && !r)
    return /* @__PURE__ */ t.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Finansal verileri görüntüleme yetkiniz bulunmuyor." });
  const n = (e == null ? void 0 : e.expenses) || [], i = (e == null ? void 0 : e.incomes) || [], d = n.reduce((u, p) => u + (p.amount || 0), 0), l = i.reduce((u, p) => u + (p.amount || 0), 0), c = l - d;
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated", children: [
        /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-tertiary", children: "Toplam Gelir" }),
        /* @__PURE__ */ t.jsxs("p", { className: "text-base font-semibold text-text-positive", children: [
          l.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
          " ₺"
        ] })
      ] }),
      /* @__PURE__ */ t.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated", children: [
        /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-tertiary", children: "Toplam Gider" }),
        /* @__PURE__ */ t.jsxs("p", { className: "text-base font-semibold text-text-negative", children: [
          d.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
          " ₺"
        ] })
      ] }),
      /* @__PURE__ */ t.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated", children: [
        /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-tertiary", children: "Net Bakiye" }),
        /* @__PURE__ */ t.jsxs("p", { className: `text-base font-semibold ${c >= 0 ? "text-text-positive" : "text-text-negative"}`, children: [
          c.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
          " ₺"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "rounded-lg border border-subtle p-3 bg-surface-base text-xs text-text-secondary", children: /* @__PURE__ */ t.jsx("p", { children: "Göreve bağlı detaylı harcama veya fatura ekleme işlemleri Finans Modülü üzerinden senkronize yönetilmektedir." }) })
  ] });
}
function _({ task: e }) {
  const a = (e == null ? void 0 : e.predecessorIds) || [];
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ t.jsxs("h4", { className: "text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-2", children: [
        /* @__PURE__ */ t.jsx("i", { className: "fa fa-diagram-project text-text-tertiary", "aria-hidden": "true" }),
        "Öncül Görev Bağımlılıkları (",
        a.length,
        ")"
      ] }),
      a.length === 0 ? /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-tertiary", children: "Bu görevin başlamasını engelleyen öncül bir görev tanımlanmamış." }) : /* @__PURE__ */ t.jsxs("p", { className: "text-xs text-text-secondary", children: [
        a.length,
        " adet bağlı öncül görev tanımlı."
      ] })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ t.jsxs("h4", { className: "text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-2", children: [
        /* @__PURE__ */ t.jsx("i", { className: "fa fa-stopwatch text-text-tertiary", "aria-hidden": "true" }),
        "Zaman Takibi (Time Logs)"
      ] }),
      /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-tertiary", children: "Zaman sayacı ve iş yükü logları aktiftir." })
    ] })
  ] });
}
const be = [
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
    component: yt
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
    component: jt
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
    component: kt
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
    component: Ct
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
    component: Tt
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
    component: Dt
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
    component: St
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
    component: _
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
    component: _
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
    component: _
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
    component: _
  }
];
function Et(e = []) {
  const a = new Set(e);
  return be.filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function Ft(e = []) {
  const a = new Set(e);
  return be.filter((s) => !s.isCore).filter((s) => !s.permission || Z(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let z = null;
const Q = /* @__PURE__ */ new Set(), X = /* @__PURE__ */ new Set();
function xe() {
  Q.forEach((e) => e());
}
function At(e) {
  return typeof e == "string" && e ? e : e && typeof e == "object" && typeof e.id == "string" && e.id ? e.id : null;
}
const A = {
  open(e) {
    const a = At(e);
    !a || a === z || (z = a, xe());
  },
  close() {
    z !== null && (z = null, xe());
  },
  subscribe(e) {
    return Q.add(e), () => Q.delete(e);
  },
  getSnapshot() {
    return z;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(e) {
    typeof e == "function" && X.add(e);
  },
  emitResult() {
    X.forEach((e) => e());
  },
  /** Yalnız testler için. */
  reset() {
    z = null, Q.clear(), X.clear();
  }
}, pe = "apya.taskDetail.fullscreen";
function je({ taskId: e, presentation: a = "modal", onClose: s }) {
  const [r, n] = m.useState(e), [i, d] = m.useState([]), { data: l, isLoading: c, isError: x, refetch: u } = rt(r), p = it(), h = ut(l), y = xt(), o = ft(r), [f, v] = m.useState("general"), [w, k] = m.useState(!1), T = q.useRef(null), S = m.useMemo(
    () => Et(o.assignedCodes),
    [o.assignedCodes]
  ), E = m.useMemo(
    () => Ft(o.assignedCodes),
    [o.assignedCodes]
  ), F = S.find((g) => g.code === f) ?? S[0];
  q.useEffect(() => {
    F.code !== f && v(F.code);
  }, [F, f]);
  const re = F == null ? void 0 : F.component, ie = B(), [ne, Ne] = m.useState(
    () => {
      var g;
      return ((g = window.localStorage) == null ? void 0 : g.getItem(pe)) === "1";
    }
  ), [le, oe] = m.useState(!1), G = m.useCallback(() => {
    lt(), s == null || s();
  }, [s]);
  ot(e, G), q.useEffect(() => {
    h.isDirty ? p.markDirty() : p.markClean();
  });
  const J = m.useCallback(() => p.requestClose(G), [p, G]), ke = m.useCallback(() => {
    Ne((g) => {
      var j;
      const b = !g;
      return (j = window.localStorage) == null || j.setItem(pe, b ? "1" : "0"), b;
    });
  }, []), Ce = Z("Platform.Tasks.Delete"), [Te, W] = m.useState(!1), [De, ce] = m.useState(!1), Se = m.useCallback(async () => {
    var g, b, j, D, N, M;
    ce(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (j = (b = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : b.info) == null || j.call(b, "Başarıyla silindi."), W(!1), p.markClean(), G();
    } catch (I) {
      (M = (N = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : N.error) == null || M.call(N, (I == null ? void 0 : I.message) || "Görev silinemedi.");
    } finally {
      ce(!1);
    }
  }, [r, p, G]), O = m.useCallback(async () => {
    var g, b, j, D, N, M;
    if (!h.validate()) return !1;
    oe(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, h.toUpdateDto())
      ), await ie.invalidateQueries({ queryKey: ["task-detail", r] }), A.emitResult(), (j = (b = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : b.success) == null || j.call(b, "Kaydedildi."), !0;
    } catch (I) {
      return (M = (N = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : N.error) == null || M.call(N, (I == null ? void 0 : I.message) || "Kaydedilemedi."), !1;
    } finally {
      oe(!1);
    }
  }, [r, h, p, ie]), Ee = m.useCallback(() => {
    O();
  }, [O]), Fe = m.useCallback(async () => {
    const g = p.resolvePendingClose("save");
    await O() && (g == null || g());
  }, [p, O]), Ae = m.useCallback((g, b) => {
    p.requestClose(() => {
      d((j) => [...j, { id: r, title: (l == null ? void 0 : l.title) ?? "" }]), n(g), v("general"), p.markClean();
    });
  }, [p, r, l]), Pe = m.useCallback((g) => {
    p.requestClose(() => {
      d((b) => {
        const j = b.findIndex((D) => D.id === g);
        return j === -1 ? b : b.slice(0, j);
      }), n(g), v("general"), p.markClean();
    });
  }, [p]), Ie = m.useCallback(async (g) => {
    var b, j, D;
    try {
      await o.addFeature(g), v(g), k(!1);
    } catch (N) {
      (D = (j = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : j.error) == null || D.call(j, (N == null ? void 0 : N.message) || "Özellik eklenemedi.");
    }
  }, [o]), Le = m.useCallback(async (g) => {
    var b, j, D;
    try {
      await o.removeFeature(g), v((N) => N === g ? "general" : N);
    } catch (N) {
      (D = (j = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : j.error) == null || D.call(j, (N == null ? void 0 : N.message) || "Özellik kaldırılamadı.");
    }
  }, [o]);
  q.useEffect(() => {
    if (!w) return;
    const g = (j) => {
      T.current && !T.current.contains(j.target) && k(!1);
    }, b = (j) => {
      j.key === "Escape" && k(!1);
    };
    return document.addEventListener("mousedown", g), document.addEventListener("keydown", b), () => {
      document.removeEventListener("mousedown", g), document.removeEventListener("keydown", b);
    };
  }, [w]);
  const Re = c ? /* @__PURE__ */ t.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ t.jsx($, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ t.jsx($, { className: "h-24 w-full" }),
    /* @__PURE__ */ t.jsx($, { className: "h-24 w-full" })
  ] }) : x ? /* @__PURE__ */ t.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ t.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ t.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ t.jsx(C, { variant: "ghost", onClick: () => u(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ t.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx(
      at,
      {
        trail: i,
        current: { id: r, title: (l == null ? void 0 : l.title) ?? "" },
        onNavigate: Pe
      }
    ),
    /* @__PURE__ */ t.jsxs("div", { className: "relative", ref: T, children: [
      /* @__PURE__ */ t.jsx(
        Xe,
        {
          tabs: S,
          activeCode: F.code,
          onSelect: (g) => {
            v(g), k(!1);
          },
          onOpenPicker: () => k((g) => !g),
          pickerOpen: w
        }
      ),
      w && /* @__PURE__ */ t.jsx(
        tt,
        {
          entries: E,
          busyCode: o.isMutating ? o.mutatingCode : null,
          onAdd: Ie,
          onRemove: Le
        }
      )
    ] }),
    /* @__PURE__ */ t.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${F.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          F.code === "general" ? /* @__PURE__ */ t.jsx(
            He,
            {
              values: h.values,
              errors: h.errors,
              onFieldChange: h.setField,
              assigneeOptions: y.options,
              isLoadingAssignees: y.isLoading
            }
          ) : /* @__PURE__ */ t.jsx(m.Suspense, { fallback: /* @__PURE__ */ t.jsx($, { className: "h-24 w-full" }), children: re && /* @__PURE__ */ t.jsx(
            re,
            {
              taskId: r,
              task: l,
              onOpenSubtask: Ae
            }
          ) }),
          /* @__PURE__ */ t.jsx(
            Ze,
            {
              task: l,
              creatorName: y.nameById.get(l.creatorId),
              lastModifierName: y.nameById.get(l.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), ze = a === "page" ? Ue : qe;
  return /* @__PURE__ */ t.jsxs(
    ze,
    {
      open: !0,
      fullscreen: ne,
      onRequestClose: J,
      title: l ? `Görev Detayı: ${l.title}` : "Görev Detayı",
      header: /* @__PURE__ */ t.jsx(
        Oe,
        {
          task: l ?? { title: "Yükleniyor…" },
          canDelete: Ce,
          fullscreen: ne,
          onToggleFullscreen: ke,
          onClose: J,
          onDelete: () => W(!0)
        }
      ),
      footer: /* @__PURE__ */ t.jsx(
        _e,
        {
          lastSavedAt: l == null ? void 0 : l.lastModificationTime,
          isDirty: p.isDirty,
          isSaving: le,
          onCancel: J,
          onSave: Ee
        }
      ),
      children: [
        Re,
        p.pendingClose && /* @__PURE__ */ t.jsx(
          It,
          {
            isSaving: le,
            onStay: () => p.resolvePendingClose("stay"),
            onDiscard: () => p.resolvePendingClose("discard"),
            onSaveAndClose: Fe
          }
        ),
        Te && /* @__PURE__ */ t.jsx(
          Pt,
          {
            taskTitle: (l == null ? void 0 : l.title) ?? "",
            busy: De,
            onCancel: () => W(!1),
            onConfirm: Se
          }
        )
      ]
    }
  );
}
function Pt({ taskTitle: e, busy: a, onCancel: s, onConfirm: r }) {
  const [n, i] = m.useState(""), d = n.trim() === "SİL";
  return /* @__PURE__ */ t.jsxs(
    we,
    {
      label: "Görev silinecek",
      title: "Görev silinecek",
      description: /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        /* @__PURE__ */ t.jsx("strong", { className: "text-text-primary", children: e }),
        " kalıcı olarak silinecek. Onaylamak için aşağıya ",
        /* @__PURE__ */ t.jsx("strong", { children: "SİL" }),
        " yazın."
      ] }),
      actions: /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        /* @__PURE__ */ t.jsx(C, { variant: "secondary", onClick: s, disabled: a, children: "İptal" }),
        /* @__PURE__ */ t.jsx(
          C,
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
        /* @__PURE__ */ t.jsx("label", { htmlFor: "delete-confirm", className: "sr-only", children: "Onay metni" }),
        /* @__PURE__ */ t.jsx(
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
function we({ label: e, title: a, description: s, children: r, actions: n }) {
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      role: "alertdialog",
      "aria-modal": "true",
      "aria-label": e,
      className: "absolute inset-0 z-popover grid place-items-center bg-surface-overlay p-4",
      children: /* @__PURE__ */ t.jsxs("div", { className: "w-full max-w-md rounded-xl border border-default bg-surface-elevated p-[var(--apya-space-5)] shadow-xl", children: [
        /* @__PURE__ */ t.jsx("h3", { className: "text-base font-semibold text-text-primary", children: a }),
        /* @__PURE__ */ t.jsx("p", { className: "mt-2 text-sm text-text-secondary", children: s }),
        r,
        /* @__PURE__ */ t.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: n })
      ] })
    }
  );
}
function It({ isSaving: e, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ t.jsx(
    we,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        /* @__PURE__ */ t.jsx(C, { variant: "secondary", onClick: a, disabled: e, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ t.jsx(C, { variant: "destructive", onClick: s, disabled: e, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ t.jsx(C, { variant: "primary", onClick: r, isLoading: e, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
function Lt() {
  const e = m.useSyncExternalStore(
    A.subscribe,
    A.getSnapshot,
    () => null
  );
  return e ? /* @__PURE__ */ t.jsx(he, { children: /* @__PURE__ */ t.jsx(
    je,
    {
      taskId: e,
      presentation: "modal",
      onClose: () => {
        A.close(), A.emitResult();
      }
    }
  ) }) : null;
}
function Rt() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v2" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : !(window.localStorage.getItem("apya.taskDetail.v2") === "0");
  } catch {
    return !0;
  }
}
const fe = document.getElementById("task-detail-island");
if (fe && (window.apya = window.apya || {}, window.apya.taskDetailV2Enabled = Rt(), window.apya.taskDetail = {
  open: (e) => A.open(e),
  close: () => A.close(),
  onResult: (e) => A.onResult(e)
}, ye(fe).render(/* @__PURE__ */ t.jsx(Lt, {})), window.apya.taskDetailV2Enabled)) {
  const e = ve();
  e && A.open(e);
}
function zt({ taskId: e }) {
  return /* @__PURE__ */ t.jsx(he, { children: /* @__PURE__ */ t.jsx(
    je,
    {
      taskId: e,
      presentation: "page",
      onClose: () => {
        window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
      }
    }
  ) });
}
const ee = document.getElementById("task-detail-page-island");
if (ee) {
  const e = ee.getAttribute("data-task-id");
  e && ye(ee).render(/* @__PURE__ */ t.jsx(zt, { taskId: e }));
}
