import { j as t, r as c, d as z, b as Ae } from "./react-vendor.js";
/* empty css      */
import { a as Pe } from "./QueryProvider.js";
import { u as q, a as K, b as F } from "./query-vendor.js";
import { D as Le, l as Ie, e as $, B as N, I as A, S as G } from "./Dialog.js";
import { C as Be } from "./Combobox.js";
import { r as Re } from "./httpClient.js";
function ze({
  open: e,
  onRequestClose: s,
  fullscreen: a,
  title: n,
  header: i,
  footer: r,
  children: d
}) {
  return /* @__PURE__ */ t.jsx(
    Le,
    {
      open: e,
      onOpenChange: (o) => {
        o || s();
      },
      children: /* @__PURE__ */ t.jsx(
        Ie,
        {
          title: n,
          fullscreen: a,
          onInteractOutside: (o) => {
            o.preventDefault(), s();
          },
          onEscapeKeyDown: (o) => {
            o.preventDefault(), s();
          },
          children: /* @__PURE__ */ t.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
            i,
            /* @__PURE__ */ t.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: d }),
            r
          ] })
        }
      )
    }
  );
}
function qe({ isPrivate: e }) {
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
const Y = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, Z = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function Ke({
  task: e,
  canDelete: s,
  onClose: a,
  onDelete: n,
  onToggleFullscreen: i,
  fullscreen: r = !1
}) {
  const [d, o] = c.useState(!1), l = c.useRef(null);
  c.useEffect(() => {
    if (!d) return;
    const m = (h) => {
      l.current && !l.current.contains(h.target) && o(!1);
    }, f = (h) => {
      h.key === "Escape" && o(!1);
    };
    return document.addEventListener("mousedown", m), document.addEventListener("keydown", f), () => {
      document.removeEventListener("mousedown", m), document.removeEventListener("keydown", f);
    };
  }, [d]);
  const u = Y[e == null ? void 0 : e.status] ?? Y[1], y = Z[e == null ? void 0 : e.priority] ?? Z[2], p = () => {
    var f, h, b, j;
    const m = `${window.location.origin}/Tasks/Detail/${e.id}`;
    (f = navigator.clipboard) == null || f.writeText(m), (j = (b = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : b.info) == null || j.call(b, "Bağlantı kopyalandı."), o(!1);
  };
  return /* @__PURE__ */ t.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ t.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ t.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ t.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: e == null ? void 0 : e.title }),
      /* @__PURE__ */ t.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ t.jsx($, { variant: u.variant, children: u.text }),
        /* @__PURE__ */ t.jsx($, { variant: y.variant, children: y.text }),
        /* @__PURE__ */ t.jsx(qe, { isPrivate: e == null ? void 0 : e.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          "aria-label": r ? "Küçült" : "Tam ekrana büyüt",
          onClick: i,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ t.jsx("i", { className: r ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ t.jsxs("div", { className: "relative", ref: l, children: [
        /* @__PURE__ */ t.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": d,
            onClick: () => o((m) => !m),
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
              s && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
                /* @__PURE__ */ t.jsx("div", { className: "my-1 h-px bg-border-subtle" }),
                /* @__PURE__ */ t.jsxs(
                  "button",
                  {
                    type: "button",
                    role: "menuitem",
                    onClick: () => {
                      o(!1), n();
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
          onClick: a,
          className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] })
  ] }) });
}
const Me = (e) => e ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(e)) : null;
function Ge({ lastSavedAt: e, isDirty: s, isSaving: a, onCancel: n, onSave: i }) {
  const r = Me(e);
  return /* @__PURE__ */ t.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: r ? `Son kayıt: ${r}` : " " }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ t.jsx(N, { variant: "secondary", onClick: n, disabled: a, children: "Vazgeç" }),
      /* @__PURE__ */ t.jsx(
        N,
        {
          variant: "primary",
          onClick: () => i == null ? void 0 : i(),
          disabled: !s || !i,
          isLoading: a,
          loadingText: "Kaydediliyor…",
          children: "Kaydet"
        }
      )
    ] })
  ] }) });
}
const ie = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Oe = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function S({ label: e, htmlFor: s, error: a, children: n }) {
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("label", { htmlFor: s, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: e }),
    n,
    a && /* @__PURE__ */ t.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: a })
  ] });
}
function Ue({ value: e, onChange: s }) {
  const [a, n] = c.useState(""), i = () => {
    const r = a.trim();
    r && !e.includes(r) && s([...e, r]), n("");
  };
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: e.map((r) => /* @__PURE__ */ t.jsxs($, { variant: "neutral", children: [
      r,
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${r} etiketini kaldır`,
          onClick: () => s(e.filter((d) => d !== r)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, r)) }),
    /* @__PURE__ */ t.jsx(
      A,
      {
        value: a,
        onChange: (r) => n(r.target.value),
        onKeyDown: (r) => {
          r.key === "Enter" || r.key === "," ? (r.preventDefault(), i()) : r.key === "Backspace" && !a && e.length && s(e.slice(0, -1));
        },
        onBlur: i,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function $e({
  values: e,
  errors: s,
  onFieldChange: a,
  assigneeOptions: n = [],
  isLoadingAssignees: i = !1
}) {
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx(S, { label: "Başlık", htmlFor: "task-title", error: s.title, children: /* @__PURE__ */ t.jsx(
      A,
      {
        id: "task-title",
        value: e.title,
        onChange: (r) => a("title", r.target.value),
        invalid: !!s.title
      }
    ) }),
    /* @__PURE__ */ t.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ t.jsx(S, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ t.jsx(
        "select",
        {
          id: "task-status",
          value: e.status,
          onChange: (r) => a("status", Number(r.target.value)),
          className: ie,
          children: Object.entries(Y).map(([r, d]) => /* @__PURE__ */ t.jsx("option", { value: r, children: d.text }, r))
        }
      ) }),
      /* @__PURE__ */ t.jsx(S, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ t.jsx(
        "select",
        {
          id: "task-priority",
          value: e.priority,
          onChange: (r) => a("priority", Number(r.target.value)),
          className: ie,
          children: Object.entries(Z).map(([r, d]) => /* @__PURE__ */ t.jsx("option", { value: r, children: d.text }, r))
        }
      ) })
    ] }),
    /* @__PURE__ */ t.jsx(S, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ t.jsx(
      Be,
      {
        id: "task-assignee",
        options: n,
        value: e.assigneeId,
        onChange: (r) => a("assigneeId", r),
        placeholder: i ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: i
      }
    ) }),
    /* @__PURE__ */ t.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ t.jsx(S, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: s.startDate, children: /* @__PURE__ */ t.jsx(
        A,
        {
          id: "task-start",
          type: "date",
          value: e.startDate,
          onChange: (r) => a("startDate", r.target.value),
          invalid: !!s.startDate
        }
      ) }),
      /* @__PURE__ */ t.jsx(S, { label: "Son Tarih", htmlFor: "task-due", error: s.dueDate, children: /* @__PURE__ */ t.jsx(
        A,
        {
          id: "task-due",
          type: "date",
          value: e.dueDate,
          onChange: (r) => a("dueDate", r.target.value),
          invalid: !!s.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ t.jsx(S, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ t.jsx(Ue, { value: e.tagNames, onChange: (r) => a("tagNames", r) }) }),
    /* @__PURE__ */ t.jsx(S, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ t.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: e.description,
        onChange: (r) => a("description", r.target.value),
        className: Oe
      }
    ) })
  ] });
}
const le = (e) => e ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(e)) : "—";
function R({ label: e, value: s }) {
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("dt", { className: "text-[13px] text-text-tertiary", children: e }),
    /* @__PURE__ */ t.jsx("dd", { className: "mt-0.5 text-text-primary", children: s ?? "—" })
  ] });
}
function Ye({ task: e, creatorName: s, lastModifierName: a }) {
  return /* @__PURE__ */ t.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ t.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ t.jsx(R, { label: "Oluşturan", value: s }),
      /* @__PURE__ */ t.jsx(R, { label: "Oluşturulma zamanı", value: le(e.creationTime) }),
      /* @__PURE__ */ t.jsx(R, { label: "Güncelleyen", value: a }),
      /* @__PURE__ */ t.jsx(R, { label: "Son güncelleme zamanı", value: le(e.lastModificationTime) }),
      /* @__PURE__ */ t.jsx(R, { label: "Proje", value: e.projectName })
    ] })
  ] });
}
const _e = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", Ve = "border-brand-500 text-text-primary";
function Qe({ tabs: e, activeCode: s, onSelect: a, onOpenPicker: n, pickerOpen: i }) {
  const r = c.useRef(/* @__PURE__ */ new Map()), d = (l) => {
    var u;
    a(l.code), (u = r.current.get(l.code)) == null || u.focus();
  }, o = (l, u) => {
    l.key === "ArrowRight" ? (l.preventDefault(), d(e[(u + 1) % e.length])) : l.key === "ArrowLeft" ? (l.preventDefault(), d(e[(u - 1 + e.length) % e.length])) : l.key === "Home" ? (l.preventDefault(), d(e[0])) : l.key === "End" && (l.preventDefault(), d(e[e.length - 1]));
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ t.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: e.map((l, u) => {
      const y = l.code === s;
      return /* @__PURE__ */ t.jsxs(
        "button",
        {
          ref: (p) => {
            p ? r.current.set(l.code, p) : r.current.delete(l.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${l.code}`,
          "aria-selected": y,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: y ? 0 : -1,
          onClick: () => a(l.code),
          onKeyDown: (p) => o(p, u),
          className: `${_e} ${y ? Ve : ""}`,
          children: [
            /* @__PURE__ */ t.jsx("i", { className: `fa ${l.icon}`, "aria-hidden": "true" }),
            l.title
          ]
        },
        l.code
      );
    }) }),
    /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        "aria-label": "Özellik ekle",
        "aria-haspopup": "dialog",
        "aria-expanded": i,
        onClick: n,
        className: "mx-1 grid h-8 w-8 flex-none place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
        children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" })
      }
    )
  ] });
}
const He = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Je({ entries: e, onAdd: s, onRemove: a, busyCode: n }) {
  const [i, r] = c.useState(""), d = c.useMemo(() => {
    const o = i.trim().toLocaleLowerCase("tr-TR"), l = o ? e.filter((y) => y.title.toLocaleLowerCase("tr-TR").includes(o)) : e, u = /* @__PURE__ */ new Map();
    return l.forEach((y) => {
      const p = u.get(y.category) ?? [];
      p.push(y), u.set(y.category, p);
    }), u;
  }, [e, i]);
  return /* @__PURE__ */ t.jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Özellik ekle",
      className: "absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl",
      children: [
        /* @__PURE__ */ t.jsx(
          A,
          {
            autoFocus: !0,
            value: i,
            onChange: (o) => r(o.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ t.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          d.size === 0 && /* @__PURE__ */ t.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...d.entries()].map(([o, l]) => /* @__PURE__ */ t.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ t.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: He[o] ?? o }),
            l.map((u) => /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ t.jsx("i", { className: `fa ${u.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ t.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: u.title }),
              !u.implemented && /* @__PURE__ */ t.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              u.implemented && !u.isAssigned && /* @__PURE__ */ t.jsx(
                "button",
                {
                  type: "button",
                  disabled: n === u.code,
                  onClick: () => s(u.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              u.implemented && u.isAssigned && /* @__PURE__ */ t.jsx(
                "button",
                {
                  type: "button",
                  disabled: n === u.code,
                  onClick: () => a(u.code),
                  className: "text-[13px] font-medium text-text-negative hover:underline disabled:opacity-50",
                  children: "Kaldır"
                }
              )
            ] }, u.code))
          ] }, o))
        ] })
      ]
    }
  );
}
function Ze({ trail: e = [], current: s, onNavigate: a }) {
  return e.length === 0 ? null : /* @__PURE__ */ t.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    e.map((n) => /* @__PURE__ */ t.jsxs(z.Fragment, { children: [
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          onClick: () => a == null ? void 0 : a(n.id),
          className: "hover:underline hover:text-text-primary",
          children: n.title
        }
      ),
      /* @__PURE__ */ t.jsx("span", { "aria-hidden": "true", children: "/" })
    ] }, n.id)),
    /* @__PURE__ */ t.jsx("span", { className: "font-medium text-text-primary", children: s.title })
  ] });
}
function We(e) {
  var a, n, i;
  const s = (i = (n = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : n.tasks) == null ? void 0 : i.task;
  return s ? Promise.resolve(s.get(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Xe(e) {
  return q({
    queryKey: ["task-detail", e],
    queryFn: () => We(e),
    enabled: !!e,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function me(e) {
  var s, a, n;
  return !!((n = (a = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.auth) == null ? void 0 : a.isGranted) != null && n.call(a, e));
}
function et() {
  const [e, s] = c.useState(!1), [a, n] = c.useState(!1), i = c.useRef(null), r = c.useCallback(() => s(!0), []), d = c.useCallback(() => s(!1), []);
  c.useEffect(() => {
    if (!e) return;
    const u = (y) => {
      y.preventDefault(), y.returnValue = "";
    };
    return window.addEventListener("beforeunload", u), () => window.removeEventListener("beforeunload", u);
  }, [e]);
  const o = c.useCallback((u) => {
    if (!e) {
      u == null || u();
      return;
    }
    i.current = u ?? null, n(!0);
  }, [e]), l = c.useCallback((u) => {
    const y = i.current;
    return n(!1), i.current = null, u === "discard" && (s(!1), y == null || y()), u === "save" ? y : null;
  }, []);
  return { isDirty: e, markDirty: r, markClean: d, requestClose: o, pendingClose: a, resolvePendingClose: l };
}
const tt = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, X = "task";
function pe() {
  if (typeof window > "u") return null;
  const e = new URLSearchParams(window.location.search).get(X);
  return e && tt.test(e) ? e : null;
}
function at() {
  if (typeof window > "u") return;
  const e = new URL(window.location.href);
  e.searchParams.delete(X), window.history.replaceState(null, "", e.pathname + e.search + e.hash);
}
function st(e, s) {
  const a = c.useRef(s);
  a.current = s, c.useEffect(() => {
    if (!e || pe() === e) return;
    const n = new URL(window.location.href);
    n.searchParams.set(X, e), window.history.pushState({ apyaTask: e }, "", n.pathname + n.search + n.hash);
  }, [e]), c.useEffect(() => {
    const n = () => {
      var i;
      (i = a.current) == null || i.call(a);
    };
    return window.addEventListener("popstate", n), () => window.removeEventListener("popstate", n);
  }, []);
}
const nt = {
  title: "",
  description: "",
  startDate: "",
  dueDate: "",
  status: 1,
  priority: 2,
  assigneeId: null,
  tagNames: []
};
function rt(e) {
  return e ? {
    title: e.title ?? "",
    description: e.description ?? "",
    startDate: e.startDate ? e.startDate.slice(0, 10) : "",
    dueDate: e.dueDate ? e.dueDate.slice(0, 10) : "",
    status: e.status ?? 1,
    priority: e.priority ?? 2,
    assigneeId: e.assigneeId ?? null,
    tagNames: (e.tags ?? []).map((s) => s.name)
  } : nt;
}
function it(e) {
  const [s, a] = c.useState(e == null ? void 0 : e.id), n = c.useMemo(() => rt(e), [e]), [i, r] = c.useState(n), [d, o] = c.useState({});
  (e == null ? void 0 : e.id) !== s && (a(e == null ? void 0 : e.id), r(n), o({}));
  const l = c.useCallback((f, h) => {
    r((b) => ({ ...b, [f]: h }));
  }, []), u = c.useMemo(
    () => JSON.stringify(i) !== JSON.stringify(n),
    [i, n]
  ), y = c.useCallback(() => {
    const f = {};
    return i.title.trim() || (f.title = "Başlık zorunlu."), i.startDate || (f.startDate = "Başlangıç tarihi zorunlu."), i.dueDate && i.startDate && i.dueDate < i.startDate && (f.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), o(f), Object.keys(f).length === 0;
  }, [i]), p = c.useCallback(() => ({
    title: i.title.trim(),
    description: i.description || null,
    startDate: i.startDate,
    dueDate: i.dueDate || null,
    status: i.status,
    priority: i.priority,
    assigneeId: i.assigneeId,
    boardColumnId: (e == null ? void 0 : e.boardColumnId) ?? null,
    projectId: (e == null ? void 0 : e.projectId) ?? null,
    parentTaskId: (e == null ? void 0 : e.parentTaskId) ?? null,
    isPrivate: !!(e != null && e.isPrivate),
    predecessorIds: (e == null ? void 0 : e.predecessorIds) ?? [],
    tagNames: i.tagNames
  }), [i, e]), m = c.useCallback(() => {
    r(n), o({});
  }, [n]);
  return { values: i, setField: l, isDirty: u, errors: d, validate: y, toUpdateDto: p, reset: m };
}
function oe(e) {
  return [e.name, e.surname].filter(Boolean).join(" ") || e.userName;
}
function lt() {
  var s, a, n;
  const e = (n = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : n.task;
  return e ? Promise.resolve(e.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ot() {
  var i;
  const e = q({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: lt,
    staleTime: 3e5,
    retry: !1
  }), s = ((i = e.data) == null ? void 0 : i.items) ?? [], a = s.map((r) => ({ value: r.id, label: oe(r) })), n = new Map(s.map((r) => [r.id, oe(r)]));
  return { options: a, nameById: n, isLoading: e.isLoading };
}
function W() {
  var s, a, n;
  const e = (n = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : n.task;
  return e || null;
}
function ct(e) {
  const s = W();
  return s ? Promise.resolve(s.getFeatureAssignments(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function dt(e) {
  const s = K(), a = ["task-features", e], n = q({
    queryKey: a,
    queryFn: () => ct(e),
    enabled: !!e,
    staleTime: 3e4,
    retry: !1
  }), i = () => s.invalidateQueries({ queryKey: a }), r = F({
    mutationFn: (o) => Promise.resolve(W().addFeature(e, o)),
    onSuccess: i
  }), d = F({
    mutationFn: (o) => Promise.resolve(W().removeFeature(e, o)),
    onSuccess: i
  });
  return {
    assignedCodes: n.data ?? [],
    isLoading: n.isLoading,
    addFeature: r.mutateAsync,
    removeFeature: d.mutateAsync,
    mutatingCode: r.variables ?? d.variables ?? null,
    isMutating: r.isPending || d.isPending
  };
}
function ut({ taskId: e, task: s, onOpenSubtask: a }) {
  const [n, i] = c.useState(""), [r, d] = c.useState(!1), o = K(), l = (s == null ? void 0 : s.subTasks) ?? [], u = () => o.invalidateQueries({ queryKey: ["task-detail", e] }), y = async () => {
    var f, h, b;
    const m = n.trim();
    if (m) {
      d(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: m,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: e,
          projectId: s == null ? void 0 : s.projectId
        })), i(""), await u();
      } catch (j) {
        (b = (h = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : h.error) == null || b.call(h, (j == null ? void 0 : j.message) || "Alt görev eklenemedi.");
      } finally {
        d(!1);
      }
    }
  }, p = async (m) => {
    var f, h, b;
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(m)), await u();
    } catch (j) {
      (b = (h = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : h.error) == null || b.call(h, (j == null ? void 0 : j.message) || "Alt görev silinemedi.");
    }
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ t.jsx(
        A,
        {
          value: n,
          onChange: (m) => i(m.target.value),
          onKeyDown: (m) => {
            m.key === "Enter" && y();
          },
          placeholder: "Yeni alt görev başlığı",
          disabled: r
        }
      ),
      /* @__PURE__ */ t.jsx(N, { variant: "secondary", onClick: y, disabled: r || !n.trim(), children: "Alt Görev Ekle" })
    ] }),
    l.length === 0 ? /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz alt görev yok." }) : /* @__PURE__ */ t.jsx("ul", { className: "divide-y divide-border-default", children: l.map((m) => {
      var f;
      return /* @__PURE__ */ t.jsxs("li", { className: "flex items-center justify-between py-2", children: [
        /* @__PURE__ */ t.jsx(
          "button",
          {
            type: "button",
            onClick: () => a == null ? void 0 : a(m.id, m.title),
            className: "text-left text-sm font-medium text-text-primary hover:underline",
            children: m.title
          }
        ),
        /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ t.jsx($, { variant: "neutral", children: ((f = Y[m.status]) == null ? void 0 : f.text) ?? m.status }),
          /* @__PURE__ */ t.jsx(N, { variant: "ghost", onClick: () => p(m.id), "aria-label": `${m.title} alt görevini sil`, children: "Sil" })
        ] })
      ] }, m.id);
    }) })
  ] });
}
function fe() {
  var s, a, n;
  const e = (n = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : n.task;
  return e || null;
}
function mt(e) {
  const s = fe();
  return s ? Promise.resolve(s.getAttachments(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function pt(e, s) {
  const a = new FormData();
  a.append("file", s);
  const n = {}, i = Re();
  i && (n.RequestVerificationToken = i);
  const r = await fetch(`/api/tasks/attachments/upload/${e}`, {
    method: "POST",
    credentials: "include",
    headers: n,
    body: a
  }), d = await r.json();
  if (!r.ok || (d == null ? void 0 : d.success) === !1)
    throw new Error((d == null ? void 0 : d.error) || "Dosya yüklenemedi.");
  return d;
}
function ft(e) {
  const s = K(), a = ["task-attachments", e], n = q({
    queryKey: a,
    queryFn: () => mt(e),
    enabled: !!e,
    staleTime: 3e4,
    retry: !1
  }), i = () => s.invalidateQueries({ queryKey: a }), r = F({
    mutationFn: (o) => pt(e, o),
    onSuccess: i
  }), d = F({
    mutationFn: (o) => Promise.resolve(fe().deleteAttachment(o)),
    onSuccess: i
  });
  return {
    attachments: n.data ?? [],
    isLoading: n.isLoading,
    upload: r.mutateAsync,
    remove: d.mutateAsync,
    isUploading: r.isPending
  };
}
function xt(e) {
  return `${Math.round(e / 1024)} KB`;
}
function yt({ taskId: e }) {
  const { attachments: s, upload: a, remove: n, isUploading: i } = ft(e), r = c.useRef(null), d = async (l) => {
    var y, p, m, f, h, b, j;
    const u = (y = l.target.files) == null ? void 0 : y[0];
    if (u)
      try {
        await a(u), (f = (m = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : m.success) == null || f.call(m, "Dosya yüklendi.");
      } catch (T) {
        (j = (b = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : b.error) == null || j.call(b, (T == null ? void 0 : T.message) || "Dosya yüklenemedi.");
      } finally {
        r.current && (r.current.value = "");
      }
  }, o = async (l, u) => {
    var y, p, m;
    try {
      await n(l);
    } catch (f) {
      (m = (p = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : p.error) == null || m.call(p, (f == null ? void 0 : f.message) || `${u} silinemedi.`);
    }
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ t.jsx("input", { ref: r, type: "file", onChange: d, className: "text-sm", disabled: i }),
      i && /* @__PURE__ */ t.jsx("span", { className: "text-sm text-text-tertiary", children: "Yükleniyor…" })
    ] }),
    s.length === 0 ? /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ t.jsx("ul", { className: "divide-y divide-border-default", children: s.map((l) => /* @__PURE__ */ t.jsxs("li", { className: "flex items-center justify-between py-2", children: [
      /* @__PURE__ */ t.jsxs("div", { children: [
        /* @__PURE__ */ t.jsx("a", { href: l.downloadUrl, target: "_blank", rel: "noreferrer", className: "text-sm font-medium text-text-primary hover:underline", children: l.fileName }),
        /* @__PURE__ */ t.jsxs("p", { className: "text-xs text-text-tertiary", children: [
          xt(l.fileSize),
          " — ",
          l.uploaderName
        ] })
      ] }),
      /* @__PURE__ */ t.jsx(N, { variant: "ghost", onClick: () => o(l.id, l.fileName), "aria-label": `${l.fileName} dosyasini sil`, children: "Sil" })
    ] }, l.id)) })
  ] });
}
function O() {
  var s, a, n;
  const e = (n = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : n.task;
  return e || null;
}
function ht(e) {
  const s = O();
  return s ? Promise.resolve(s.getChecklistItems(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function vt(e) {
  const s = K(), a = ["task-checklist", e], n = q({
    queryKey: a,
    queryFn: () => ht(e),
    enabled: !!e,
    staleTime: 3e4,
    retry: !1
  }), i = () => s.invalidateQueries({ queryKey: a }), r = F({
    mutationFn: (l) => Promise.resolve(O().addChecklistItem(e, l)),
    onSuccess: i
  }), d = F({
    mutationFn: (l) => Promise.resolve(O().toggleChecklistItem(l)),
    onSuccess: i
  }), o = F({
    mutationFn: (l) => Promise.resolve(O().deleteChecklistItem(l)),
    onSuccess: i
  });
  return {
    items: n.data ?? [],
    isLoading: n.isLoading,
    addItem: r.mutateAsync,
    toggleItem: d.mutateAsync,
    removeItem: o.mutateAsync
  };
}
function gt({ taskId: e }) {
  const { items: s, addItem: a, toggleItem: n, removeItem: i } = vt(e), [r, d] = c.useState(""), o = async () => {
    const l = r.trim();
    l && (await a(l), d(""));
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ t.jsx(
        A,
        {
          value: r,
          onChange: (l) => d(l.target.value),
          onKeyDown: (l) => {
            l.key === "Enter" && o();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ t.jsx(N, { variant: "secondary", onClick: o, disabled: !r.trim(), children: "Ekle" })
    ] }),
    s.length === 0 ? /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz madde eklenmemiş." }) : /* @__PURE__ */ t.jsx("ul", { className: "space-y-1.5", children: s.map((l) => /* @__PURE__ */ t.jsxs("li", { className: "flex items-center justify-between gap-2 py-1", children: [
      /* @__PURE__ */ t.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ t.jsx(
          "input",
          {
            type: "checkbox",
            checked: l.isDone,
            onChange: () => n(l.id)
          }
        ),
        /* @__PURE__ */ t.jsx("span", { className: l.isDone ? "text-text-tertiary line-through" : "text-text-primary", children: l.text })
      ] }),
      /* @__PURE__ */ t.jsx(N, { variant: "ghost", onClick: () => i(l.id), "aria-label": `${l.text} maddesini sil`, children: "Sil" })
    ] }, l.id)) })
  ] });
}
const xe = [
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
    component: ut
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
    component: yt
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
    component: gt
  },
  {
    code: "comments",
    title: "Yorumlar",
    icon: "fa-comments",
    category: "iletisim",
    isCore: !1,
    order: 20,
    permission: null,
    implemented: !1,
    component: null
  },
  {
    code: "activity",
    title: "Aktiviteler",
    icon: "fa-timeline",
    category: "gecmis",
    isCore: !1,
    order: 30,
    permission: null,
    implemented: !1,
    component: null
  },
  {
    code: "history",
    title: "Geçmiş",
    icon: "fa-clock-rotate-left",
    category: "gecmis",
    isCore: !1,
    order: 31,
    permission: null,
    implemented: !1,
    component: null
  },
  {
    code: "finance",
    title: "Finans",
    icon: "fa-coins",
    category: "finans",
    isCore: !1,
    order: 40,
    permission: null,
    implemented: !1,
    component: null
  },
  {
    code: "dependencies",
    title: "Bağımlılıklar",
    icon: "fa-diagram-project",
    category: "ileri",
    isCore: !1,
    order: 50,
    permission: null,
    implemented: !1,
    component: null
  },
  {
    code: "risks",
    title: "Riskler",
    icon: "fa-triangle-exclamation",
    category: "ileri",
    isCore: !1,
    order: 51,
    permission: null,
    implemented: !1,
    component: null
  },
  {
    code: "approvals",
    title: "Onaylar",
    icon: "fa-stamp",
    category: "ileri",
    isCore: !1,
    order: 52,
    permission: null,
    implemented: !1,
    component: null
  },
  {
    code: "time-tracking",
    title: "Zaman Takibi",
    icon: "fa-stopwatch",
    category: "ileri",
    isCore: !1,
    order: 53,
    permission: null,
    implemented: !1,
    component: null
  }
];
function bt(e = []) {
  const s = new Set(e);
  return xe.filter((a) => a.implemented && (a.isCore || s.has(a.code))).sort((a, n) => a.order - n.order);
}
function jt(e = []) {
  const s = new Set(e);
  return xe.filter((a) => !a.isCore).filter((a) => !a.permission || me(a.permission)).map((a) => ({ ...a, isAssigned: s.has(a.code) })).sort((a, n) => a.order - n.order);
}
let P = null;
const U = /* @__PURE__ */ new Set(), J = /* @__PURE__ */ new Set();
function ce() {
  U.forEach((e) => e());
}
function wt(e) {
  return typeof e == "string" && e ? e : e && typeof e == "object" && typeof e.id == "string" && e.id ? e.id : null;
}
const D = {
  open(e) {
    const s = wt(e);
    !s || s === P || (P = s, ce());
  },
  close() {
    P !== null && (P = null, ce());
  },
  subscribe(e) {
    return U.add(e), () => U.delete(e);
  },
  getSnapshot() {
    return P;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(e) {
    typeof e == "function" && J.add(e);
  },
  emitResult() {
    J.forEach((e) => e());
  },
  /** Yalnız testler için. */
  reset() {
    P = null, U.clear(), J.clear();
  }
}, de = "apya.taskDetail.fullscreen";
function kt({ taskId: e, presentation: s = "modal", onClose: a }) {
  const [n, i] = c.useState(e), [r, d] = c.useState([]), { data: o, isLoading: l, isError: u, refetch: y } = Xe(n), p = et(), m = it(o), f = ot(), h = dt(n), [b, j] = c.useState("general"), [T, L] = c.useState(!1), _ = z.useRef(null), V = c.useMemo(
    () => bt(h.assignedCodes),
    [h.assignedCodes]
  ), he = c.useMemo(
    () => jt(h.assignedCodes),
    [h.assignedCodes]
  ), C = V.find((x) => x.code === b) ?? V[0];
  z.useEffect(() => {
    C.code !== b && j(C.code);
  }, [C, b]);
  const ee = C == null ? void 0 : C.component, te = K(), [ae, ve] = c.useState(
    () => {
      var x;
      return ((x = window.localStorage) == null ? void 0 : x.getItem(de)) === "1";
    }
  ), [se, ne] = c.useState(!1), I = c.useCallback(() => {
    at(), a == null || a();
  }, [a]);
  st(e, I), z.useEffect(() => {
    m.isDirty ? p.markDirty() : p.markClean();
  });
  const Q = c.useCallback(() => p.requestClose(I), [p, I]), ge = c.useCallback(() => {
    ve((x) => {
      var g;
      const v = !x;
      return (g = window.localStorage) == null || g.setItem(de, v ? "1" : "0"), v;
    });
  }, []), be = me("Platform.Tasks.Delete"), [je, H] = c.useState(!1), [we, re] = c.useState(!1), ke = c.useCallback(async () => {
    var x, v, g, k, w, B;
    re(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(n)), (g = (v = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : v.info) == null || g.call(v, "Başarıyla silindi."), H(!1), p.markClean(), I();
    } catch (E) {
      (B = (w = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : w.error) == null || B.call(w, (E == null ? void 0 : E.message) || "Görev silinemedi.");
    } finally {
      re(!1);
    }
  }, [n, p, I]), M = c.useCallback(async () => {
    var x, v, g, k, w, B;
    if (!m.validate()) return !1;
    ne(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(n, m.toUpdateDto())
      ), await te.invalidateQueries({ queryKey: ["task-detail", n] }), D.emitResult(), (g = (v = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : v.success) == null || g.call(v, "Kaydedildi."), !0;
    } catch (E) {
      return (B = (w = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : w.error) == null || B.call(w, (E == null ? void 0 : E.message) || "Kaydedilemedi."), !1;
    } finally {
      ne(!1);
    }
  }, [n, m, p, te]), Ne = c.useCallback(() => {
    M();
  }, [M]), Ce = c.useCallback(async () => {
    const x = p.resolvePendingClose("save");
    await M() && (x == null || x());
  }, [p, M]), De = c.useCallback((x, v) => {
    p.requestClose(() => {
      d((g) => [...g, { id: n, title: (o == null ? void 0 : o.title) ?? "" }]), i(x), j("general"), p.markClean();
    });
  }, [p, n, o]), Te = c.useCallback((x) => {
    p.requestClose(() => {
      d((v) => {
        const g = v.findIndex((k) => k.id === x);
        return g === -1 ? v : v.slice(0, g);
      }), i(x), j("general"), p.markClean();
    });
  }, [p]), Se = c.useCallback(async (x) => {
    var v, g, k;
    try {
      await h.addFeature(x), j(x), L(!1);
    } catch (w) {
      (k = (g = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : g.error) == null || k.call(g, (w == null ? void 0 : w.message) || "Özellik eklenemedi.");
    }
  }, [h]), Ee = c.useCallback(async (x) => {
    var v, g, k;
    try {
      await h.removeFeature(x), j((w) => w === x ? "general" : w);
    } catch (w) {
      (k = (g = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : g.error) == null || k.call(g, (w == null ? void 0 : w.message) || "Özellik kaldırılamadı.");
    }
  }, [h]);
  z.useEffect(() => {
    if (!T) return;
    const x = (g) => {
      _.current && !_.current.contains(g.target) && L(!1);
    }, v = (g) => {
      g.key === "Escape" && L(!1);
    };
    return document.addEventListener("mousedown", x), document.addEventListener("keydown", v), () => {
      document.removeEventListener("mousedown", x), document.removeEventListener("keydown", v);
    };
  }, [T]);
  const Fe = l ? /* @__PURE__ */ t.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ t.jsx(G, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ t.jsx(G, { className: "h-24 w-full" }),
    /* @__PURE__ */ t.jsx(G, { className: "h-24 w-full" })
  ] }) : u ? /* @__PURE__ */ t.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ t.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ t.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ t.jsx(N, { variant: "ghost", onClick: () => y(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ t.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx(
      Ze,
      {
        trail: r,
        current: { id: n, title: (o == null ? void 0 : o.title) ?? "" },
        onNavigate: Te
      }
    ),
    /* @__PURE__ */ t.jsxs("div", { className: "relative", ref: _, children: [
      /* @__PURE__ */ t.jsx(
        Qe,
        {
          tabs: V,
          activeCode: C.code,
          onSelect: (x) => {
            j(x), L(!1);
          },
          onOpenPicker: () => L((x) => !x),
          pickerOpen: T
        }
      ),
      T && /* @__PURE__ */ t.jsx(
        Je,
        {
          entries: he,
          busyCode: h.isMutating ? h.mutatingCode : null,
          onAdd: Se,
          onRemove: Ee
        }
      )
    ] }),
    /* @__PURE__ */ t.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${C.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          C.code === "general" ? /* @__PURE__ */ t.jsx(
            $e,
            {
              values: m.values,
              errors: m.errors,
              onFieldChange: m.setField,
              assigneeOptions: f.options,
              isLoadingAssignees: f.isLoading
            }
          ) : /* @__PURE__ */ t.jsx(c.Suspense, { fallback: /* @__PURE__ */ t.jsx(G, { className: "h-24 w-full" }), children: ee && /* @__PURE__ */ t.jsx(
            ee,
            {
              taskId: n,
              task: o,
              onOpenSubtask: De
            }
          ) }),
          /* @__PURE__ */ t.jsx(
            Ye,
            {
              task: o,
              creatorName: f.nameById.get(o.creatorId),
              lastModifierName: f.nameById.get(o.lastModifierId)
            }
          )
        ]
      }
    )
  ] });
  return /* @__PURE__ */ t.jsxs(
    ze,
    {
      open: !0,
      fullscreen: ae,
      onRequestClose: Q,
      title: o ? `Görev Detayı: ${o.title}` : "Görev Detayı",
      header: /* @__PURE__ */ t.jsx(
        Ke,
        {
          task: o ?? { title: "Yükleniyor…" },
          canDelete: be,
          fullscreen: ae,
          onToggleFullscreen: ge,
          onClose: Q,
          onDelete: () => H(!0)
        }
      ),
      footer: /* @__PURE__ */ t.jsx(
        Ge,
        {
          lastSavedAt: o == null ? void 0 : o.lastModificationTime,
          isDirty: p.isDirty,
          isSaving: se,
          onCancel: Q,
          onSave: Ne
        }
      ),
      children: [
        Fe,
        p.pendingClose && /* @__PURE__ */ t.jsx(
          Ct,
          {
            isSaving: se,
            onStay: () => p.resolvePendingClose("stay"),
            onDiscard: () => p.resolvePendingClose("discard"),
            onSaveAndClose: Ce
          }
        ),
        je && /* @__PURE__ */ t.jsx(
          Nt,
          {
            taskTitle: (o == null ? void 0 : o.title) ?? "",
            busy: we,
            onCancel: () => H(!1),
            onConfirm: ke
          }
        )
      ]
    }
  );
}
function Nt({ taskTitle: e, busy: s, onCancel: a, onConfirm: n }) {
  const [i, r] = c.useState(""), d = i.trim() === "SİL";
  return /* @__PURE__ */ t.jsxs(
    ye,
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
        /* @__PURE__ */ t.jsx(N, { variant: "secondary", onClick: a, disabled: s, children: "İptal" }),
        /* @__PURE__ */ t.jsx(
          N,
          {
            variant: "destructive",
            onClick: n,
            disabled: !d,
            isLoading: s,
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
            value: i,
            onChange: (o) => r(o.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function ye({ label: e, title: s, description: a, children: n, actions: i }) {
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      role: "alertdialog",
      "aria-modal": "true",
      "aria-label": e,
      className: "absolute inset-0 z-popover grid place-items-center bg-surface-overlay p-4",
      children: /* @__PURE__ */ t.jsxs("div", { className: "w-full max-w-md rounded-xl border border-default bg-surface-elevated p-[var(--apya-space-5)] shadow-xl", children: [
        /* @__PURE__ */ t.jsx("h3", { className: "text-base font-semibold text-text-primary", children: s }),
        /* @__PURE__ */ t.jsx("p", { className: "mt-2 text-sm text-text-secondary", children: a }),
        n,
        /* @__PURE__ */ t.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: i })
      ] })
    }
  );
}
function Ct({ isSaving: e, onStay: s, onDiscard: a, onSaveAndClose: n }) {
  return /* @__PURE__ */ t.jsx(
    ye,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        /* @__PURE__ */ t.jsx(N, { variant: "secondary", onClick: s, disabled: e, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ t.jsx(N, { variant: "destructive", onClick: a, disabled: e, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ t.jsx(N, { variant: "primary", onClick: n, isLoading: e, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
function Dt() {
  const e = c.useSyncExternalStore(
    D.subscribe,
    D.getSnapshot,
    () => null
  );
  return e ? /* @__PURE__ */ t.jsx(Pe, { children: /* @__PURE__ */ t.jsx(
    kt,
    {
      taskId: e,
      presentation: "modal",
      onClose: () => {
        D.close(), D.emitResult();
      }
    }
  ) }) : null;
}
function Tt() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v2" ? !0 : window.localStorage.getItem("apya.taskDetail.v2") === "1";
  } catch {
    return !1;
  }
}
const ue = document.getElementById("task-detail-island");
if (ue && (window.apya = window.apya || {}, window.apya.taskDetailV2Enabled = Tt(), window.apya.taskDetail = {
  open: (e) => D.open(e),
  close: () => D.close(),
  onResult: (e) => D.onResult(e)
}, Ae(ue).render(/* @__PURE__ */ t.jsx(Dt, {})), window.apya.taskDetailV2Enabled)) {
  const e = pe();
  e && D.open(e);
}
