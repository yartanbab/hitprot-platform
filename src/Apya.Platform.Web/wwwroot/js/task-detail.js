import { j as e, r as u, d as fe, a as bt, b as We } from "./react-vendor.js";
/* empty css      */
import { a as Ne } from "./QueryProvider.js";
import { u as ae, a as te, b as se } from "./query-vendor.js";
import { D as Je, l as Xe, e as ke, B as D, I as me, S as ie } from "./Dialog.js";
import { C as ht } from "./Combobox.js";
import { r as yt } from "./httpClient.js";
import { R as ne, T as le, P as oe, C as ce, A as gt } from "./ui-vendor.js";
function vt({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: i,
  header: n,
  footer: r,
  children: l
}) {
  return /* @__PURE__ */ e.jsx(
    Je,
    {
      open: t,
      onOpenChange: (o) => {
        o || a();
      },
      children: /* @__PURE__ */ e.jsx(
        Xe,
        {
          title: i,
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
            r
          ] })
        }
      )
    }
  );
}
function jt({ title: t, header: a, footer: s, children: i }) {
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "flex h-full min-h-[calc(100vh-120px)] flex-col rounded-xl border border-default bg-surface-elevated shadow-sm",
      "aria-label": t,
      children: /* @__PURE__ */ e.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
        a,
        /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: i }),
        s
      ] })
    }
  );
}
function wt({ isPrivate: t }) {
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
const ye = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, Le = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function Nt({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: i,
  onToggleFullscreen: n,
  fullscreen: r = !1
}) {
  const [l, o] = u.useState(!1), d = u.useRef(null);
  u.useEffect(() => {
    if (!l) return;
    const j = (h) => {
      d.current && !d.current.contains(h.target) && o(!1);
    }, m = (h) => {
      h.key === "Escape" && o(!1);
    };
    return document.addEventListener("mousedown", j), document.addEventListener("keydown", m), () => {
      document.removeEventListener("mousedown", j), document.removeEventListener("keydown", m);
    };
  }, [l]);
  const c = ye[t == null ? void 0 : t.status] ?? ye[1], p = Le[t == null ? void 0 : t.priority] ?? Le[2], b = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), o(!1);
  }, g = () => {
    var m, h, f, v;
    const j = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (m = navigator.clipboard) == null || m.writeText(j), (v = (f = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : f.info) == null || v.call(f, "Bağlantı kopyalandı."), o(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(ke, { variant: c.variant, children: c.text }),
        /* @__PURE__ */ e.jsx(ke, { variant: p.variant, children: p.text }),
        /* @__PURE__ */ e.jsx(wt, { isPrivate: t == null ? void 0 : t.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": r ? "Küçült" : "Tam ekrana büyüt",
          onClick: n,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: r ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: d, children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": l,
            onClick: () => o((j) => !j),
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
                      o(!1), i();
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
const kt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function Ct({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: i, onSave: n }) {
  const r = kt(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: r ? `Son kayıt: ${r}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(D, { variant: "secondary", onClick: i, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        D,
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
const Ge = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Tt = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function re({ label: t, htmlFor: a, error: s, children: i }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    i,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function Dt({ value: t, onChange: a }) {
  const [s, i] = u.useState(""), n = () => {
    const r = s.trim();
    r && !t.includes(r) && a([...t, r]), i("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((r) => /* @__PURE__ */ e.jsxs(ke, { variant: "neutral", children: [
      r,
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${r} etiketini kaldır`,
          onClick: () => a(t.filter((l) => l !== r)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, r)) }),
    /* @__PURE__ */ e.jsx(
      me,
      {
        value: s,
        onChange: (r) => i(r.target.value),
        onKeyDown: (r) => {
          r.key === "Enter" || r.key === "," ? (r.preventDefault(), n()) : r.key === "Backspace" && !s && t.length && a(t.slice(0, -1));
        },
        onBlur: n,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function St({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: i = [],
  isLoadingAssignees: n = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(re, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      me,
      {
        id: "task-title",
        value: t.title,
        onChange: (r) => s("title", r.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(re, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (r) => s("status", Number(r.target.value)),
          className: Ge,
          children: Object.entries(ye).map(([r, l]) => /* @__PURE__ */ e.jsx("option", { value: r, children: l.text }, r))
        }
      ) }),
      /* @__PURE__ */ e.jsx(re, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (r) => s("priority", Number(r.target.value)),
          className: Ge,
          children: Object.entries(Le).map(([r, l]) => /* @__PURE__ */ e.jsx("option", { value: r, children: l.text }, r))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(re, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      ht,
      {
        id: "task-assignee",
        options: i,
        value: t.assigneeId,
        onChange: (r) => s("assigneeId", r),
        placeholder: n ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: n
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(re, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        me,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (r) => s("startDate", r.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(re, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        me,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (r) => s("dueDate", r.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(re, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(Dt, { value: t.tagNames, onChange: (r) => s("tagNames", r) }) }),
    /* @__PURE__ */ e.jsx(re, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (r) => s("description", r.target.value),
        className: Tt
      }
    ) })
  ] });
}
const Fe = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function he({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function Et({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(he, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(he, { label: "Oluşturulma zamanı", value: Fe(t.creationTime) }),
      /* @__PURE__ */ e.jsx(he, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(he, { label: "Son güncelleme zamanı", value: Fe(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(he, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const zt = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", At = "border-brand-500 text-text-primary";
function It({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: i, pickerOpen: n }) {
  const r = u.useRef(/* @__PURE__ */ new Map()), l = (d) => {
    var c;
    s(d.code), (c = r.current.get(d.code)) == null || c.focus();
  }, o = (d, c) => {
    d.key === "ArrowRight" ? (d.preventDefault(), l(t[(c + 1) % t.length])) : d.key === "ArrowLeft" ? (d.preventDefault(), l(t[(c - 1 + t.length) % t.length])) : d.key === "Home" ? (d.preventDefault(), l(t[0])) : d.key === "End" && (d.preventDefault(), l(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((d, c) => {
      const p = d.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (b) => {
            b ? r.current.set(d.code, b) : r.current.delete(d.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${d.code}`,
          "aria-selected": p,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: p ? 0 : -1,
          onClick: () => s(d.code),
          onKeyDown: (b) => o(b, c),
          className: `${zt} ${p ? At : ""}`,
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
        "aria-expanded": n,
        onClick: i,
        className: "mx-1 grid h-8 w-8 flex-none place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" })
      }
    )
  ] });
}
const Rt = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Lt({ entries: t, onAdd: a, onRemove: s, busyCode: i }) {
  const [n, r] = u.useState(""), l = u.useMemo(() => {
    const o = n.trim().toLocaleLowerCase("tr-TR"), d = o ? t.filter((p) => p.title.toLocaleLowerCase("tr-TR").includes(o)) : t, c = /* @__PURE__ */ new Map();
    return d.forEach((p) => {
      const b = c.get(p.category) ?? [];
      b.push(p), c.set(p.category, b);
    }), c;
  }, [t, n]);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Özellik ekle",
      className: "absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl",
      children: [
        /* @__PURE__ */ e.jsx(
          me,
          {
            autoFocus: !0,
            value: n,
            onChange: (o) => r(o.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          l.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...l.entries()].map(([o, d]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: Rt[o] ?? o }),
            d.map((c) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa ${c.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: c.title }),
              !c.implemented && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              c.implemented && !c.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: i === c.code,
                  onClick: () => a(c.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              c.implemented && c.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: i === c.code,
                  onClick: () => s(c.code),
                  className: "text-[13px] font-medium text-text-negative hover:underline disabled:opacity-50",
                  children: "Kaldır"
                }
              )
            ] }, c.code))
          ] }, o))
        ] })
      ]
    }
  );
}
function $t({ trail: t = [], current: a, onNavigate: s }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((i) => /* @__PURE__ */ e.jsxs(fe.Fragment, { children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => s == null ? void 0 : s(i.id),
          className: "hover:underline hover:text-text-primary",
          children: i.title
        }
      ),
      /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "/" })
    ] }, i.id)),
    /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary", children: a.title })
  ] });
}
function Pt(t) {
  var s, i, n;
  const a = (n = (i = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : i.tasks) == null ? void 0 : n.task;
  return a ? Promise.resolve(a.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function et(t) {
  return ae({
    queryKey: ["task-detail", t],
    queryFn: () => Pt(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function tt(t) {
  var a, s, i;
  return !!((i = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && i.call(s, t));
}
function st() {
  const [t, a] = u.useState(!1), [s, i] = u.useState(!1), n = u.useRef(null), r = u.useCallback(() => a(!0), []), l = u.useCallback(() => a(!1), []);
  u.useEffect(() => {
    if (!t) return;
    const c = (p) => {
      p.preventDefault(), p.returnValue = "";
    };
    return window.addEventListener("beforeunload", c), () => window.removeEventListener("beforeunload", c);
  }, [t]);
  const o = u.useCallback((c) => {
    if (!t) {
      c == null || c();
      return;
    }
    n.current = c ?? null, i(!0);
  }, [t]), d = u.useCallback((c) => {
    const p = n.current;
    return i(!1), n.current = null, c === "discard" && (a(!1), p == null || p()), c === "save" ? p : null;
  }, []);
  return { isDirty: t, markDirty: r, markClean: l, requestClose: o, pendingClose: s, resolvePendingClose: d };
}
const Gt = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, Pe = "task";
function at() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(Pe);
  return t && Gt.test(t) ? t : null;
}
function rt() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(Pe), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function it(t, a) {
  const s = u.useRef(a);
  s.current = a, u.useEffect(() => {
    if (!t || at() === t) return;
    const i = new URL(window.location.href);
    i.searchParams.set(Pe, t), window.history.pushState({ apyaTask: t }, "", i.pathname + i.search + i.hash);
  }, [t]), u.useEffect(() => {
    const i = () => {
      var n;
      (n = s.current) == null || n.call(s);
    };
    return window.addEventListener("popstate", i), () => window.removeEventListener("popstate", i);
  }, []);
}
const Ft = {
  title: "",
  description: "",
  startDate: "",
  dueDate: "",
  status: 1,
  priority: 2,
  assigneeId: null,
  tagNames: [],
  isPrivate: !1
};
function Kt(t) {
  return t ? {
    title: t.title ?? "",
    description: t.description ?? "",
    startDate: t.startDate ? t.startDate.slice(0, 10) : "",
    dueDate: t.dueDate ? t.dueDate.slice(0, 10) : "",
    status: t.status ?? 1,
    priority: t.priority ?? 2,
    assigneeId: t.assigneeId ?? null,
    tagNames: (t.tags ?? []).map((a) => a.name),
    isPrivate: !!t.isPrivate
  } : Ft;
}
function nt(t) {
  const [a, s] = u.useState(t == null ? void 0 : t.id), i = u.useMemo(() => Kt(t), [t]), [n, r] = u.useState(i), [l, o] = u.useState({});
  (t == null ? void 0 : t.id) !== a && (s(t == null ? void 0 : t.id), r(i), o({}));
  const d = u.useCallback((j, m) => {
    r((h) => ({ ...h, [j]: m }));
  }, []), c = u.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(i),
    [n, i]
  ), p = u.useCallback(() => {
    const j = {};
    return n.title.trim() || (j.title = "Başlık zorunlu."), n.startDate || (j.startDate = "Başlangıç tarihi zorunlu."), n.dueDate && n.startDate && n.dueDate < n.startDate && (j.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), o(j), Object.keys(j).length === 0;
  }, [n]), b = u.useCallback(() => ({
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
    isPrivate: !!n.isPrivate,
    predecessorIds: (t == null ? void 0 : t.predecessorIds) ?? [],
    tagNames: n.tagNames
  }), [n, t]), g = u.useCallback(() => {
    r(i), o({});
  }, [i]);
  return { values: n, setField: d, isDirty: c, errors: l, validate: p, toUpdateDto: b, reset: g };
}
function Ke(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function Bt() {
  var a, s, i;
  const t = (i = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : i.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function lt() {
  var n;
  const t = ae({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Bt,
    staleTime: 3e5,
    retry: !1
  }), a = ((n = t.data) == null ? void 0 : n.items) ?? [], s = a.map((r) => ({ value: r.id, label: Ke(r) })), i = new Map(a.map((r) => [r.id, Ke(r)]));
  return { options: s, nameById: i, isLoading: t.isLoading };
}
function $e() {
  var a, s, i;
  const t = (i = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : i.task;
  return t || null;
}
function Mt(t) {
  const a = $e();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ot(t) {
  const a = te(), s = ["task-features", t], i = ae({
    queryKey: s,
    queryFn: () => Mt(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), r = se({
    mutationFn: (o) => Promise.resolve($e().addFeature(t, o)),
    onSuccess: n
  }), l = se({
    mutationFn: (o) => Promise.resolve($e().removeFeature(t, o)),
    onSuccess: n
  });
  return {
    assignedCodes: i.data ?? [],
    isLoading: i.isLoading,
    addFeature: r.mutateAsync,
    removeFeature: l.mutateAsync,
    mutatingCode: r.variables ?? l.variables ?? null,
    isMutating: r.isPending || l.isPending
  };
}
function Ot({ taskId: t, task: a, onOpenSubtask: s }) {
  const [i, n] = u.useState(""), [r, l] = u.useState(!1), [o, d] = u.useState(null), c = te(), p = (a == null ? void 0 : a.subTasks) ?? [], b = () => c.invalidateQueries({ queryKey: ["task-detail", t] }), g = async () => {
    var h, f, v;
    const m = i.trim();
    if (m) {
      l(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: m,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), n(""), await b();
      } catch (w) {
        (v = (f = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : f.error) == null || v.call(f, (w == null ? void 0 : w.message) || "Alt görev eklenemedi.");
      } finally {
        l(!1);
      }
    }
  }, j = async (m) => {
    var h, f, v;
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(m)), await b();
    } catch (w) {
      (v = (f = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : f.error) == null || v.call(f, (w == null ? void 0 : w.message) || "Alt görev silinemedi.");
    } finally {
      d(null);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        me,
        {
          value: i,
          onChange: (m) => n(m.target.value),
          onKeyDown: (m) => {
            m.key === "Enter" && g();
          },
          placeholder: "Yeni alt görev başlığı",
          disabled: r
        }
      ),
      /* @__PURE__ */ e.jsx(D, { variant: "secondary", onClick: g, disabled: r || !i.trim(), children: "Alt Görev Ekle" })
    ] }),
    p.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz alt görev yok." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: p.map((m) => {
      var h, f;
      return /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between py-2", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => s == null ? void 0 : s(m.id, m.title),
            className: "text-left text-sm font-medium text-text-primary hover:underline",
            children: m.title
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(ke, { variant: ((h = ye[m.status]) == null ? void 0 : h.variant) ?? "neutral", children: ((f = ye[m.status]) == null ? void 0 : f.text) ?? m.status }),
          o === m.id ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary", children: "Emin misiniz?" }),
            /* @__PURE__ */ e.jsx(D, { variant: "destructive", onClick: () => j(m.id), children: "Evet, sil" }),
            /* @__PURE__ */ e.jsx(D, { variant: "ghost", onClick: () => d(null), children: "Vazgeç" })
          ] }) : /* @__PURE__ */ e.jsx(D, { variant: "ghost", onClick: () => d(m.id), "aria-label": `${m.title} alt görevini sil`, children: "Sil" })
        ] })
      ] }, m.id);
    }) })
  ] });
}
function ct() {
  var a, s, i;
  const t = (i = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : i.task;
  return t || null;
}
function Yt(t) {
  const a = ct();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function qt(t, a) {
  const s = new FormData();
  s.append("file", a);
  const i = {}, n = yt();
  n && (i.RequestVerificationToken = n);
  const r = await fetch(`/api/tasks/attachments/upload/${t}`, {
    method: "POST",
    credentials: "include",
    headers: i,
    body: s
  });
  let l = null;
  try {
    l = await r.json();
  } catch {
  }
  if (!r.ok || (l == null ? void 0 : l.success) === !1)
    throw new Error((l == null ? void 0 : l.error) || "Dosya yüklenemedi.");
  return l;
}
function Ut(t) {
  const a = te(), s = ["task-attachments", t], i = ae({
    queryKey: s,
    queryFn: () => Yt(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), r = se({
    mutationFn: (o) => qt(t, o),
    onSuccess: n
  }), l = se({
    mutationFn: (o) => Promise.resolve(ct().deleteAttachment(o)),
    onSuccess: n
  });
  return {
    attachments: i.data ?? [],
    isLoading: i.isLoading,
    upload: r.mutateAsync,
    remove: l.mutateAsync,
    isUploading: r.isPending
  };
}
function Vt(t) {
  return `${Math.round(t / 1024)} KB`;
}
function _t({ taskId: t }) {
  const { attachments: a, upload: s, remove: i, isUploading: n } = Ut(t), r = u.useRef(null), l = async (d) => {
    var p, b, g, j, m, h, f;
    const c = (p = d.target.files) == null ? void 0 : p[0];
    if (c)
      try {
        await s(c), (j = (g = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : g.success) == null || j.call(g, "Dosya yüklendi.");
      } catch (v) {
        (f = (h = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : h.error) == null || f.call(h, (v == null ? void 0 : v.message) || "Dosya yüklenemedi.");
      } finally {
        r.current && (r.current.value = "");
      }
  }, o = async (d, c) => {
    var p, b, g;
    try {
      await i(d);
    } catch (j) {
      (g = (b = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : b.error) == null || g.call(b, (j == null ? void 0 : j.message) || `${c} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("input", { ref: r, type: "file", onChange: l, className: "text-sm", disabled: n }),
      n && /* @__PURE__ */ e.jsx("span", { className: "text-sm text-text-tertiary", children: "Yükleniyor…" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: a.map((d) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between py-2", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("a", { href: d.downloadUrl, target: "_blank", rel: "noreferrer", className: "text-sm font-medium text-text-primary hover:underline", children: d.fileName }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-text-tertiary", children: [
          Vt(d.fileSize),
          " — ",
          d.uploaderName
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(D, { variant: "ghost", onClick: () => o(d.id, d.fileName), "aria-label": `${d.fileName} dosyasini sil`, children: "Sil" })
    ] }, d.id)) })
  ] });
}
function je() {
  var a, s, i;
  const t = (i = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : i.task;
  return t || null;
}
function Qt(t) {
  const a = je();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function dt(t) {
  const a = te(), s = ["task-checklist", t], i = ae({
    queryKey: s,
    queryFn: () => Qt(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), r = se({
    mutationFn: (d) => Promise.resolve(je().addChecklistItem(t, d)),
    onSuccess: n
  }), l = se({
    mutationFn: (d) => Promise.resolve(je().toggleChecklistItem(d)),
    onSuccess: n
  }), o = se({
    mutationFn: (d) => Promise.resolve(je().deleteChecklistItem(d)),
    onSuccess: n
  });
  return {
    items: i.data ?? [],
    isLoading: i.isLoading,
    addItem: r.mutateAsync,
    toggleItem: l.mutateAsync,
    removeItem: o.mutateAsync
  };
}
function Ht({ taskId: t }) {
  const { items: a, addItem: s, toggleItem: i, removeItem: n } = dt(t), [r, l] = u.useState(""), o = async () => {
    var b, g, j;
    const p = r.trim();
    if (p)
      try {
        await s(p), l("");
      } catch (m) {
        (j = (g = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : g.error) == null || j.call(g, (m == null ? void 0 : m.message) || "Madde eklenemedi.");
      }
  }, d = async (p) => {
    var b, g, j;
    try {
      await i(p);
    } catch (m) {
      (j = (g = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : g.error) == null || j.call(g, (m == null ? void 0 : m.message) || "Madde güncellenemedi.");
    }
  }, c = async (p, b) => {
    var g, j, m;
    try {
      await n(p);
    } catch (h) {
      (m = (j = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : j.error) == null || m.call(j, (h == null ? void 0 : h.message) || `${b} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        me,
        {
          value: r,
          onChange: (p) => l(p.target.value),
          onKeyDown: (p) => {
            p.key === "Enter" && o();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ e.jsx(D, { variant: "secondary", onClick: o, disabled: !r.trim(), children: "Ekle" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz madde eklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "space-y-1.5", children: a.map((p) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-2 py-1", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: p.isDone,
            onChange: () => d(p.id)
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: p.isDone ? "text-text-tertiary line-through" : "text-text-primary", children: p.text })
      ] }),
      /* @__PURE__ */ e.jsx(D, { variant: "ghost", onClick: () => c(p.id, p.text), "aria-label": `${p.text} maddesini sil`, children: "Sil" })
    ] }, p.id)) })
  ] });
}
function Zt({ taskId: t, task: a }) {
  const [s, i] = u.useState(""), [n, r] = u.useState(null), [l, o] = u.useState(""), [d, c] = u.useState(!1), p = te(), b = (a == null ? void 0 : a.comments) ?? [], g = async (m) => {
    var h, f, v, w, T, P;
    if (m == null || m.preventDefault(), !(!s.trim() || d)) {
      c(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), i(""), p.invalidateQueries({ queryKey: ["task-detail", t] }), (v = (f = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : f.success) == null || v.call(f, "Yorum eklendi.");
      } catch (I) {
        (P = (T = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : T.error) == null || P.call(T, (I == null ? void 0 : I.message) || "Yorum eklenemedi.");
      } finally {
        c(!1);
      }
    }
  }, j = async (m) => {
    var h, f, v, w, T, P;
    if (!(!l.trim() || d)) {
      c(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(m, l.trim())
        ), o(""), r(null), p.invalidateQueries({ queryKey: ["task-detail", t] }), (v = (f = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : f.success) == null || v.call(f, "Yanıt eklendi.");
      } catch (I) {
        (P = (T = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : T.error) == null || P.call(T, (I == null ? void 0 : I.message) || "Yanıt eklenemedi.");
      } finally {
        c(!1);
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
          onChange: (m) => i(m.target.value),
          placeholder: "Bir yorum veya güncelleme yazın...",
          className: "w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ e.jsx(
        D,
        {
          type: "submit",
          variant: "primary",
          disabled: !s.trim() || d,
          isLoading: d,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    b.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: b.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: m.creatorUserName || m.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: m.creationTime ? new Date(m.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: m.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        D,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => r(n === m.id ? null : m.id),
          children: "Yanıtla"
        }
      ) }),
      n === m.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: l,
            onChange: (h) => o(h.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(D, { variant: "ghost", size: "sm", onClick: () => r(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(D, { variant: "primary", size: "sm", disabled: !l.trim() || d, onClick: () => j(m.id), children: "Gönder" })
        ] })
      ] }),
      m.replies && m.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: m.replies.map((h) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: h.creatorUserName || h.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: h.creationTime ? new Date(h.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: h.text })
      ] }, h.id)) })
    ] }, m.id)) })
  ] });
}
function Wt({ task: t }) {
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
function Jt({ task: t }) {
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
    /* @__PURE__ */ e.jsx("div", { className: "rounded-lg border border-default divide-y divide-border-subtle bg-surface-elevated", children: a.map((s, i) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between p-3 text-xs", children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: s.label }),
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-text-primary", children: s.value })
    ] }, i)) })
  ] });
}
function ge(t, a) {
  const s = a || "TRY";
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: s, minimumFractionDigits: 2 }).format(t || 0);
  } catch {
    return `${(t || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${s}`.trim();
  }
}
function Xt(t) {
  if (!t) return "";
  const a = new Date(t);
  return isNaN(a.getTime()) ? "" : new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(a);
}
function es({ task: t }) {
  const a = (t == null ? void 0 : t.expenses) || [], s = (t == null ? void 0 : t.incomes) || [];
  if (a.length === 0 && s.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 border-b border-subtle pb-4 mb-4", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-coins text-success text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Görev Finansı" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)." })
    ] });
  const n = Array.from(new Set([...a, ...s].map((l) => l.currency || "TRY"))).map((l) => {
    const o = s.filter((c) => (c.currency || "TRY") === l).reduce((c, p) => c + (p.amount || 0), 0), d = a.filter((c) => (c.currency || "TRY") === l).reduce((c, p) => c + (p.amount || 0), 0);
    return { cur: l, inc: o, exp: d, net: o - d };
  }), r = [
    ...s.map((l) => ({ ...l, kind: "income" })),
    ...a.map((l) => ({ ...l, kind: "expense" }))
  ].sort((l, o) => new Date(o.date || 0) - new Date(l.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs flex flex-col gap-5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-coins text-success text-base" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Görev Finansı" })
    ] }),
    n.map(({ cur: l, inc: o, exp: d, net: c }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-subtle p-3 bg-surface-sunken/40", children: [
        /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-text-tertiary", children: [
          "Toplam Gelir (",
          l,
          ")"
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-base font-semibold text-success", children: ge(o, l) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-subtle p-3 bg-surface-sunken/40", children: [
        /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-text-tertiary", children: [
          "Toplam Gider (",
          l,
          ")"
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-base font-semibold text-negative", children: ge(d, l) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-subtle p-3 bg-surface-sunken/40", children: [
        /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-text-tertiary", children: [
          "Net Bakiye (",
          l,
          ")"
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: `text-base font-semibold ${c >= 0 ? "text-success" : "text-negative"}`, children: ge(c, l) })
      ] })
    ] }, l)),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col divide-y divide-subtle/50 rounded-xl border border-subtle overflow-hidden", children: r.map((l) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-3.5 py-2.5 bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
        /* @__PURE__ */ e.jsx("span", { className: `flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${l.kind === "income" ? "text-success bg-success-subtle" : "text-negative bg-negative-subtle"}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l.kind === "income" ? "fa-plus" : "fa-minus"}` }) }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-medium text-text-primary truncate", children: l.title || (l.kind === "income" ? "Gelir" : "Gider") }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: Xt(l.date) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: `text-[13px] font-semibold shrink-0 ${l.kind === "income" ? "text-success" : "text-negative"}`, children: [
        l.kind === "income" ? "+" : "−",
        ge(l.amount, l.currency)
      ] })
    ] }, `${l.kind}-${l.id}`)) }),
    /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-text-tertiary", children: "Kayıtlar Finans modülünden yönetilir; buraya göreve etiketlenmiş gider/gelirler yansır." })
  ] });
}
const ts = { 0: 0, 1: 0, 2: 50, 3: 75, 4: 100 }, ss = { 0: "bg-neutral-400", 1: "bg-text-tertiary", 2: "bg-warning", 3: "bg-primary", 4: "bg-success" };
function Te(t) {
  if (!t) return null;
  const a = new Date(t);
  return isNaN(a.getTime()) ? null : a;
}
function Be(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
}
function as({ task: t = {} }) {
  const a = u.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((r, l) => ({
    id: r.id || `row-${l}`,
    name: r.title || "Başlıksız görev",
    isMain: !!r.__main,
    start: Te(r.startDate),
    end: Te(r.dueDate) || Te(r.completedDate),
    status: r.status ?? 1
  })), [t]), { min: s, span: i } = u.useMemo(() => {
    const n = a.flatMap((o) => [o.start, o.end]).filter(Boolean).map((o) => o.getTime());
    if (n.length === 0) return { min: null, span: 0 };
    const r = Math.min(...n), l = Math.max(...n);
    return { min: r, span: Math.max(1, l - r) };
  }, [a]);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-bars-staggered text-primary text-base" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Gantt Zaman Çizelgesi" })
    ] }),
    s === null ? /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Zaman çizelgesi için görevde veya alt görevlerde başlangıç–bitiş tarihi tanımlı olmalı." }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: a.map((n) => {
      const r = n.start ? n.start.getTime() : s, l = n.end ? Math.max(n.end.getTime(), r) : r, o = (r - s) / i * 100, d = Math.max(2, (l - r) / i * 100), c = ts[n.status] ?? 0, p = ss[n.status] || "bg-primary";
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: `flex flex-col gap-1.5 p-3 rounded-xl border transition-all ${n.isMain ? "bg-primary-subtle/30 border-primary/20" : "bg-surface-sunken/40 border-subtle/50 hover:bg-surface-hover/60"}`,
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-[13px]", children: [
              /* @__PURE__ */ e.jsx("span", { className: `truncate ${n.isMain ? "font-bold text-text-primary" : "font-semibold text-text-secondary"}`, children: n.name }),
              /* @__PURE__ */ e.jsxs("span", { className: "text-xs text-text-tertiary font-mono shrink-0 ml-2", children: [
                Be(n.start),
                " – ",
                Be(n.end)
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "relative w-full h-3 bg-surface-base rounded-full overflow-hidden border border-subtle", children: [
              /* @__PURE__ */ e.jsx("div", { className: `absolute top-0 h-full ${p} rounded-full opacity-30`, style: { left: `${o}%`, width: `${d}%` } }),
              /* @__PURE__ */ e.jsx("div", { className: `absolute top-0 h-full ${p} rounded-full`, style: { left: `${o}%`, width: `${d * c / 100}%` } })
            ] })
          ]
        },
        n.id
      );
    }) })
  ] });
}
const rs = {
  0: { label: "İptal", cls: "text-text-secondary bg-neutral-subtle" },
  1: { label: "Bekliyor", cls: "text-text-secondary bg-neutral-subtle" },
  2: { label: "Sürüyor", cls: "text-warning bg-warning-subtle" },
  3: { label: "Testte", cls: "text-primary bg-primary-subtle" },
  4: { label: "Tamamlandı", cls: "text-success bg-success-subtle" }
};
function is({ task: t = {} }) {
  const a = (r) => {
    var l, o, d;
    return (d = (o = (l = window == null ? void 0 : window.apya) == null ? void 0 : l.taskDetail) == null ? void 0 : o.open) == null ? void 0 : d.call(o, r);
  }, s = t.predecessorIds || [], { data: i = [], isLoading: n } = ae({
    queryKey: ["task-predecessors", t.id, s],
    queryFn: async () => {
      var l, o, d;
      const r = (d = (o = (l = window == null ? void 0 : window.apya) == null ? void 0 : l.platform) == null ? void 0 : o.tasks) == null ? void 0 : d.task;
      return r ? Promise.all(
        s.map(
          (c) => Promise.resolve(r.get(c)).catch(() => ({ id: c, title: "(erişilemeyen görev)", status: null }))
        )
      ) : [];
    },
    enabled: s.length > 0,
    staleTime: 3e4,
    retry: !1
  });
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link text-primary text-base" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Öncül Görevler (Bağımlılıklar)" })
    ] }),
    s.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : n ? /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Yükleniyor…" }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col divide-y divide-subtle/50", children: i.map((r) => {
      const l = rs[r.status] || null;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => a(r.id),
          className: "flex items-center justify-between py-3.5 hover:bg-surface-hover/50 px-2 rounded-lg transition-colors text-left",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-diagram-predecessor text-text-tertiary text-xs shrink-0" }),
              /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: r.title || "Başlıksız görev" })
            ] }),
            l && /* @__PURE__ */ e.jsx("span", { className: `text-xs font-semibold px-2.5 py-0.5 rounded-md shrink-0 ${l.cls}`, children: l.label })
          ]
        },
        r.id
      );
    }) })
  ] });
}
function pe() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task) || null;
}
function ns(t) {
  const a = te(), s = ["task-timelogs", t], i = ["task-active-timelog"], n = ae({
    queryKey: s,
    queryFn: () => {
      var c;
      return Promise.resolve((c = pe()) == null ? void 0 : c.getTimeLogs(t));
    },
    enabled: !!t && !!pe(),
    staleTime: 15e3,
    retry: !1
  }), r = ae({
    queryKey: i,
    queryFn: () => {
      var c;
      return Promise.resolve((c = pe()) == null ? void 0 : c.getActiveTimeLog());
    },
    enabled: !!pe(),
    staleTime: 5e3,
    retry: !1
  }), l = () => {
    a.invalidateQueries({ queryKey: s }), a.invalidateQueries({ queryKey: i });
  }, o = se({
    mutationFn: () => {
      var c;
      return Promise.resolve((c = pe()) == null ? void 0 : c.startTimeTracking(t));
    },
    onSuccess: l
  }), d = se({
    mutationFn: () => {
      var c;
      return Promise.resolve((c = pe()) == null ? void 0 : c.stopTimeTracking(t));
    },
    onSuccess: l
  });
  return {
    logs: n.data ?? [],
    isLoading: n.isLoading,
    activeLog: r.data ?? null,
    start: o.mutateAsync,
    stop: d.mutateAsync,
    isMutating: o.isPending || d.isPending
  };
}
function ls() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-warning text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Risk Yönetimi" })
      ] }),
      /* @__PURE__ */ e.jsx(D, { size: "sm", variant: "outline", icon: "fa-plus", children: "Yeni Risk Bildir" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "p-4 rounded-xl bg-surface-sunken/40 border border-subtle flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: "Otel Kontenjan Doluluk Riski" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-secondary", children: "Yüksek sezonda ekstra oda ihtiyacı doğabilir." })
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-warning bg-warning-subtle px-2.5 py-1 rounded-md", children: "Orta Risk" })
    ] })
  ] });
}
function os() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-stamp text-primary text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Onay Süreçleri & İmza Akışı" })
      ] }),
      /* @__PURE__ */ e.jsx(D, { size: "sm", variant: "primary", icon: "fa-check", children: "Onay İste" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between p-3.5 rounded-xl bg-success-subtle/30 border border-success/30", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-circle-check text-success text-lg" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: "Operasyon Direktörlüğü Onayı" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary", children: "Yakup B. tarafından 10.07.2026'da onaylandı." })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-success", children: "Onaylandı" })
    ] })
  ] });
}
function De(t) {
  return String(t).padStart(2, "0");
}
function cs(t) {
  const a = Math.max(0, Math.floor(t));
  return `${De(Math.floor(a / 3600))}:${De(Math.floor(a % 3600 / 60))}:${De(a % 60)}`;
}
function Me(t) {
  const a = Math.max(0, Math.floor(t)), s = Math.floor(a / 3600), i = Math.floor(a % 3600 / 60);
  return s > 0 ? `${s}s ${i}dk` : i > 0 ? `${i}dk ${a % 60}sn` : `${a % 60}sn`;
}
function Oe(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function ds({ taskId: t }) {
  const a = ns(t), s = a.activeLog && a.activeLog.taskId === t ? a.activeLog : null, [i, n] = u.useState(() => Date.now());
  u.useEffect(() => {
    if (!s) return;
    const c = setInterval(() => n(Date.now()), 1e3);
    return () => clearInterval(c);
  }, [s]);
  const r = s ? Math.max(0, Math.floor((i - new Date(s.startTime).getTime()) / 1e3)) : 0, o = a.logs.reduce((c, p) => c + (p.secondsSpent || 0), 0) + r, d = async () => {
    var c, p, b;
    try {
      s ? await a.stop() : await a.start();
    } catch (g) {
      (b = (p = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : p.error) == null || b.call(p, (g == null ? void 0 : g.message) || "Zaman takibi güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-stopwatch text-primary text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Zaman Takibi & Sayaç" })
      ] }),
      /* @__PURE__ */ e.jsx(
        D,
        {
          size: "sm",
          variant: s ? "destructive" : "primary",
          icon: s ? "fa-stop" : "fa-play",
          onClick: d,
          disabled: a.isMutating,
          isLoading: a.isMutating,
          children: s ? "Sayacı Durdur" : "Süre Başlat"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "p-4 rounded-xl bg-surface-sunken/40 border border-subtle flex flex-col gap-1", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-text-tertiary uppercase", children: "Toplam Harcanan Süre" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-2xl font-bold text-primary", children: Me(o) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: `p-4 rounded-xl border flex flex-col gap-1 ${s ? "bg-success-subtle/30 border-success/30" : "bg-surface-sunken/40 border-subtle"}`, children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-text-tertiary uppercase", children: "Aktif Sayaç" }),
        /* @__PURE__ */ e.jsx("span", { className: `text-2xl font-bold font-mono ${s ? "text-success" : "text-text-tertiary"}`, children: s ? cs(r) : "00:00:00" })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ e.jsx("h4", { className: "text-[13px] font-bold text-text-secondary", children: "Kayıtlar" }),
      a.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Yükleniyor…" }) : a.logs.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Henüz zaman kaydı yok. “Süre Başlat” ile sayacı çalıştırın." }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col divide-y divide-subtle/50 rounded-xl border border-subtle overflow-hidden", children: a.logs.map((c) => {
        const p = !c.endTime;
        return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-3.5 py-2.5 bg-surface-base", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0", children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: c.userName || "Kullanıcı" }),
            /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary font-mono", children: [
              Oe(c.startTime),
              " → ",
              p ? "sürüyor" : Oe(c.endTime)
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: `text-[12px] font-bold px-2 py-0.5 rounded-md ${p ? "text-success bg-success-subtle" : "text-text-secondary bg-surface-sunken"}`, children: p ? "Aktif" : Me(c.secondsSpent || 0) })
        ] }, c.id);
      }) })
    ] })
  ] });
}
function xs() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-sparkles text-indigo-600 text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Apya AI Asistan & Analiz" })
      ] }),
      /* @__PURE__ */ e.jsx(D, { size: "sm", variant: "primary", icon: "fa-wand-magic-sparkles", children: "Görevi Analiz Et" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 flex flex-col gap-2", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-indigo-900 dark:text-indigo-200", children: "AI Önerisi:" }),
      /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-indigo-700 dark:text-indigo-300 leading-relaxed", children: "Sözleşme taslağı incelendiğinde ödeme takviminin 15 gün vadeli olduğu tespit edildi. Finans ekibine bildirim gönderilmesi tavsiye edilir." })
    ] })
  ] });
}
function us() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-square-plus text-success text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Özel Alanlar (Custom Fields)" })
      ] }),
      /* @__PURE__ */ e.jsx(D, { size: "sm", variant: "outline", icon: "fa-plus", children: "Alan Ekle" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "p-3.5 rounded-xl border border-subtle bg-surface-sunken/40 flex flex-col gap-1", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-text-tertiary", children: "Vize Kontenjanı" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-sm font-semibold text-text-primary", children: "60 Kişi" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "p-3.5 rounded-xl border border-subtle bg-surface-sunken/40 flex flex-col gap-1", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-text-tertiary", children: "Uçuş Kodu" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-sm font-semibold text-text-primary", children: "TK-1492" })
      ] })
    ] })
  ] });
}
function ms() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-wand-magic-sparkles text-indigo-600 text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Görev Otomasyonları" })
      ] }),
      /* @__PURE__ */ e.jsx(D, { size: "sm", variant: "outline", icon: "fa-plus", children: "Kural Ekle" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "p-3.5 rounded-xl border border-subtle bg-surface-sunken/40 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-medium text-text-primary", children: "Görev 'Tamamlandı' olunca ilgili faturayı otomatik oluştur." }),
      /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-success bg-success-subtle px-2 py-0.5 rounded", children: "Aktif" })
    ] })
  ] });
}
function ps() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-envelope text-primary text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Bağlantılı E-postalar" })
      ] }),
      /* @__PURE__ */ e.jsx(D, { size: "sm", variant: "outline", icon: "fa-plus", children: "E-posta Bağla" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "p-3.5 rounded-xl border border-subtle bg-surface-sunken/40 flex flex-col gap-1", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: "Otel Rezervasyon Teyidi ve Sözleşme Eki" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary", children: "Gönderen: info@hilton.com • 10.07.2026 09:15" })
    ] })
  ] });
}
function fs() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-image text-indigo-600 text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Görsel Dosya Galerisi" })
      ] }),
      /* @__PURE__ */ e.jsx(D, { size: "sm", variant: "outline", icon: "fa-upload", children: "Görsel Yükle" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-3 gap-3", children: ["Otel_Lobi.jpg", "Oda_Tasarim.jpg", "Sozlesme_Imza.jpg"].map((t, a) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 p-2 rounded-xl border border-subtle bg-surface-sunken/40 items-center text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "h-20 w-full bg-surface-base rounded-lg flex items-center justify-center text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-image text-2xl" }) }),
      /* @__PURE__ */ e.jsx("span", { className: "text-xs font-medium text-text-primary truncate w-full mt-1", children: t })
    ] }, a)) })
  ] });
}
function bs() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chart-pie text-primary text-base" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Gösterge Paneli (KPI & Metrikler)" })
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "p-4 rounded-xl bg-surface-sunken/40 border border-subtle text-center", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-text-tertiary", children: "Tamamlanma Oranı" }),
        /* @__PURE__ */ e.jsx("div", { className: "text-2xl font-bold text-success mt-1", children: "%100" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "p-4 rounded-xl bg-surface-sunken/40 border border-subtle text-center", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-text-tertiary", children: "Verimlilik Skoru" }),
        /* @__PURE__ */ e.jsx("div", { className: "text-2xl font-bold text-primary mt-1", children: "9.8 / 10" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "p-4 rounded-xl bg-surface-sunken/40 border border-subtle text-center", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-text-tertiary", children: "Gecikme" }),
        /* @__PURE__ */ e.jsx("div", { className: "text-2xl font-bold text-text-secondary mt-1", children: "0 Gün" })
      ] })
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
    component: Ot
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
    component: _t
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
    component: Ht
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
    component: as
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
    component: is
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
    component: es
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
    component: Jt
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
    component: Wt
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
    component: Zt
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
    component: ls
  },
  {
    code: "approvals",
    title: "Onaylar",
    icon: "fa-stamp",
    category: "gorev",
    isCore: !1,
    order: 22,
    permission: null,
    implemented: !0,
    component: os
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
    component: ds
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
    component: bs
  },
  {
    code: "ai",
    title: "Yapay Zeka",
    icon: "fa-sparkles",
    category: "ileri",
    isCore: !1,
    order: 30,
    permission: null,
    implemented: !0,
    component: xs
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
    component: us
  },
  {
    code: "automations",
    title: "Otomasyonlar",
    icon: "fa-wand-magic-sparkles",
    category: "ileri",
    isCore: !1,
    order: 32,
    permission: null,
    implemented: !0,
    component: ms
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
    component: ps
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
    component: fs
  }
];
function xt(t = []) {
  const a = new Set(t);
  return Ce.filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, i) => s.order - i.order);
}
function hs(t = []) {
  const a = new Set(t);
  return Ce.filter((s) => !s.isCore).filter((s) => !s.permission || tt(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, i) => s.order - i.order);
}
let ve = null;
const we = /* @__PURE__ */ new Set(), Se = /* @__PURE__ */ new Set();
function Ye() {
  we.forEach((t) => t());
}
function ys(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const J = {
  open(t) {
    const a = ys(t);
    a && (ve = a, Ye());
  },
  close() {
    ve = null, Ye();
  },
  subscribe(t) {
    return we.add(t), () => we.delete(t);
  },
  getSnapshot() {
    return ve;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && Se.add(t);
  },
  emitResult() {
    Se.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    ve = null, we.clear(), Se.clear();
  }
}, qe = "apya.taskDetail.fullscreen";
function ut({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [i, n] = u.useState(t), [r, l] = u.useState([]), { data: o, isLoading: d, isError: c, refetch: p } = et(i), b = st(), g = nt(o), j = lt(), m = ot(i), [h, f] = u.useState("general"), [v, w] = u.useState(!1), T = fe.useRef(null), P = u.useMemo(
    () => xt(m.assignedCodes),
    [m.assignedCodes]
  ), I = u.useMemo(
    () => hs(m.assignedCodes),
    [m.assignedCodes]
  ), x = P.find((E) => E.code === h) ?? P[0];
  fe.useEffect(() => {
    x.code !== h && f(x.code);
  }, [x, h]);
  const k = x == null ? void 0 : x.component, N = te(), [F, K] = u.useState(
    () => {
      var E;
      return ((E = window.localStorage) == null ? void 0 : E.getItem(qe)) === "1";
    }
  ), [W, Q] = u.useState(!1), U = u.useCallback(() => {
    rt(), s == null || s();
  }, [s]);
  it(t, U), fe.useEffect(() => {
    g.isDirty ? b.markDirty() : b.markClean();
  });
  const z = u.useCallback(() => b.requestClose(U), [b, U]), G = u.useCallback(() => {
    K((E) => {
      var $;
      const L = !E;
      return ($ = window.localStorage) == null || $.setItem(qe, L ? "1" : "0"), L;
    });
  }, []), V = tt("Platform.Tasks.Delete"), [H, O] = u.useState(!1), [y, C] = u.useState(!1), S = u.useCallback(async () => {
    var E, L, $, Z, M, be;
    C(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(i)), ($ = (L = (E = window == null ? void 0 : window.abp) == null ? void 0 : E.notify) == null ? void 0 : L.info) == null || $.call(L, "Başarıyla silindi."), O(!1), b.markClean(), U();
    } catch (xe) {
      (be = (M = (Z = window == null ? void 0 : window.abp) == null ? void 0 : Z.notify) == null ? void 0 : M.error) == null || be.call(M, (xe == null ? void 0 : xe.message) || "Görev silinemedi.");
    } finally {
      C(!1);
    }
  }, [i, b, U]), R = u.useCallback(async () => {
    var E, L, $, Z, M, be;
    if (!g.validate()) return !1;
    Q(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(i, g.toUpdateDto())
      ), await N.invalidateQueries({ queryKey: ["task-detail", i] }), J.emitResult(), ($ = (L = (E = window == null ? void 0 : window.abp) == null ? void 0 : E.notify) == null ? void 0 : L.success) == null || $.call(L, "Kaydedildi."), !0;
    } catch (xe) {
      return (be = (M = (Z = window == null ? void 0 : window.abp) == null ? void 0 : Z.notify) == null ? void 0 : M.error) == null || be.call(M, (xe == null ? void 0 : xe.message) || "Kaydedilemedi."), !1;
    } finally {
      Q(!1);
    }
  }, [i, g, b, N]), A = u.useCallback(() => {
    R();
  }, [R]), B = u.useCallback(async () => {
    const E = b.resolvePendingClose("save");
    await R() && (E == null || E());
  }, [b, R]), Y = u.useCallback((E, L) => {
    b.requestClose(() => {
      l(($) => [...$, { id: i, title: (o == null ? void 0 : o.title) ?? "" }]), n(E), f("general"), b.markClean();
    });
  }, [b, i, o]), q = u.useCallback((E) => {
    b.requestClose(() => {
      l((L) => {
        const $ = L.findIndex((Z) => Z.id === E);
        return $ === -1 ? L : L.slice(0, $);
      }), n(E), f("general"), b.markClean();
    });
  }, [b]), X = u.useCallback(async (E) => {
    var L, $, Z;
    try {
      await m.addFeature(E), f(E), w(!1);
    } catch (M) {
      (Z = ($ = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : $.error) == null || Z.call($, (M == null ? void 0 : M.message) || "Özellik eklenemedi.");
    }
  }, [m]), ee = u.useCallback(async (E) => {
    var L, $, Z;
    try {
      await m.removeFeature(E), f((M) => M === E ? "general" : M);
    } catch (M) {
      (Z = ($ = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : $.error) == null || Z.call($, (M == null ? void 0 : M.message) || "Özellik kaldırılamadı.");
    }
  }, [m]);
  fe.useEffect(() => {
    if (!v) return;
    const E = ($) => {
      T.current && !T.current.contains($.target) && w(!1);
    }, L = ($) => {
      $.key === "Escape" && w(!1);
    };
    return document.addEventListener("mousedown", E), document.addEventListener("keydown", L), () => {
      document.removeEventListener("mousedown", E), document.removeEventListener("keydown", L);
    };
  }, [v]);
  const de = d ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(ie, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(ie, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(ie, { className: "h-24 w-full" })
  ] }) : c ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(D, { variant: "ghost", onClick: () => p(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      $t,
      {
        trail: r,
        current: { id: i, title: (o == null ? void 0 : o.title) ?? "" },
        onNavigate: q
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: T, children: [
      /* @__PURE__ */ e.jsx(
        It,
        {
          tabs: P,
          activeCode: x.code,
          onSelect: (E) => {
            f(E), w(!1);
          },
          onOpenPicker: () => w((E) => !E),
          pickerOpen: v
        }
      ),
      v && /* @__PURE__ */ e.jsx(
        Lt,
        {
          entries: I,
          busyCode: m.isMutating ? m.mutatingCode : null,
          onAdd: X,
          onRemove: ee
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${x.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          x.code === "general" ? /* @__PURE__ */ e.jsx(
            St,
            {
              values: g.values,
              errors: g.errors,
              onFieldChange: g.setField,
              assigneeOptions: j.options,
              isLoadingAssignees: j.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(u.Suspense, { fallback: /* @__PURE__ */ e.jsx(ie, { className: "h-24 w-full" }), children: k && /* @__PURE__ */ e.jsx(
            k,
            {
              taskId: i,
              task: o,
              onOpenSubtask: Y
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            Et,
            {
              task: o,
              creatorName: j.nameById.get(o.creatorId),
              lastModifierName: j.nameById.get(o.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), _ = a === "page" ? jt : vt;
  return /* @__PURE__ */ e.jsxs(
    _,
    {
      open: !0,
      fullscreen: F,
      onRequestClose: z,
      title: o ? `Görev Detayı: ${o.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        Nt,
        {
          task: o ?? { title: "Yükleniyor…" },
          canDelete: V,
          fullscreen: F,
          onToggleFullscreen: G,
          onClose: z,
          onDelete: () => O(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        Ct,
        {
          lastSavedAt: o == null ? void 0 : o.lastModificationTime,
          isDirty: b.isDirty,
          isSaving: W,
          onCancel: z,
          onSave: A
        }
      ),
      children: [
        de,
        b.pendingClose && /* @__PURE__ */ e.jsx(
          vs,
          {
            isSaving: W,
            onStay: () => b.resolvePendingClose("stay"),
            onDiscard: () => b.resolvePendingClose("discard"),
            onSaveAndClose: B
          }
        ),
        H && /* @__PURE__ */ e.jsx(
          gs,
          {
            taskTitle: (o == null ? void 0 : o.title) ?? "",
            busy: y,
            onCancel: () => O(!1),
            onConfirm: S
          }
        )
      ]
    }
  );
}
function gs({ taskTitle: t, busy: a, onCancel: s, onConfirm: i }) {
  const [n, r] = u.useState(""), l = n.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    mt,
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
        /* @__PURE__ */ e.jsx(D, { variant: "secondary", onClick: s, disabled: a, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          D,
          {
            variant: "destructive",
            onClick: i,
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
function mt({ label: t, title: a, description: s, children: i, actions: n }) {
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
        i,
        /* @__PURE__ */ e.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: n })
      ] })
    }
  );
}
function vs({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: i }) {
  return /* @__PURE__ */ e.jsx(
    mt,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(D, { variant: "secondary", onClick: a, disabled: t, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ e.jsx(D, { variant: "destructive", onClick: s, disabled: t, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ e.jsx(D, { variant: "primary", onClick: i, isLoading: t, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
const js = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function ws({ isPrivate: t = !1, onChange: a = () => {
} }) {
  const s = !!t;
  return /* @__PURE__ */ e.jsxs(ne, { children: [
    /* @__PURE__ */ e.jsx(le, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        className: "flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-default transition-all shadow-sm",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${s ? "fa-lock" : "fa-globe"} text-[11px] text-text-tertiary` }),
          /* @__PURE__ */ e.jsx("span", { children: s ? "Özel görev" : "Herkese açık" }),
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[10px] ml-0.5 text-text-tertiary" })
        ]
      }
    ) }),
    /* @__PURE__ */ e.jsx(oe, { children: /* @__PURE__ */ e.jsxs(
      ce,
      {
        sideOffset: 8,
        align: "end",
        className: "z-50 w-[360px] rounded-2xl border border-subtle bg-surface-base p-4 shadow-float animate-in fade-in-50 zoom-in-95",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle pb-3 mb-3", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shield-halved text-primary text-base" }),
            /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary", children: "Görünürlük" })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: js.map((i) => {
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
          /* @__PURE__ */ e.jsx(gt, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const Ee = [
  { id: 1, label: "Bekliyor", color: "bg-neutral-subtle text-text-secondary border-subtle", dot: "bg-gray-400" },
  { id: 2, label: "Sürüyor", color: "bg-warning-subtle text-warning border-warning/20", dot: "bg-warning" },
  { id: 3, label: "Testte", color: "bg-primary-subtle text-primary border-primary/20", dot: "bg-primary" },
  { id: 4, label: "Tamamlandı", color: "bg-success-subtle text-success border-success/20", dot: "bg-success" }
], ze = [
  { id: 1, label: "Düşük", color: "text-text-secondary bg-surface-sunken", icon: "fa-arrow-down" },
  { id: 2, label: "Orta", color: "text-warning bg-warning-subtle", icon: "fa-minus" },
  { id: 3, label: "Yüksek", color: "text-negative bg-negative-subtle", icon: "fa-arrow-up" },
  { id: 4, label: "Kritik", color: "text-negative bg-negative-subtle font-bold", icon: "fa-flag" }
];
function Ns({
  task: t = {},
  onClose: a,
  onToggleFullscreen: s,
  isFullscreen: i,
  presentation: n = "modal",
  onFieldChange: r = () => {
  },
  statusValue: l,
  priorityValue: o
}) {
  const [d, c] = u.useState(!1), [p, b] = u.useState(!!t.isPrivate), [g, j] = u.useState(!!t.isFavorite), m = l ?? t.status ?? 1, h = o ?? t.priority ?? 2, f = Ee.find((x) => x.id === m) || Ee[0], v = ze.find((x) => x.id === h) || ze[1], w = t.code || (t.id ? `#OTL-${t.id.substring(0, 4).toUpperCase()}` : "#OTL-2507"), T = () => {
    var x, k, N, F;
    (x = navigator.clipboard) == null || x.writeText(w), c(!0), (F = (N = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : N.success) == null || F.call(N, `${w} panoya kopyalandı.`), setTimeout(() => c(!1), 2e3);
  }, P = () => {
    var k, N, F, K;
    const x = `${window.location.origin}/Tasks?task=${t.id || ""}`;
    (k = navigator.clipboard) == null || k.writeText(x), (K = (F = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : F.success) == null || K.call(F, "Görev bağlantısı panoya kopyalandı!");
  }, I = async () => {
    var k, N, F, K, W, Q, U, z;
    const x = !g;
    j(x);
    try {
      await Promise.resolve((W = (K = (F = (N = (k = window == null ? void 0 : window.apya) == null ? void 0 : k.platform) == null ? void 0 : N.tasks) == null ? void 0 : F.task) == null ? void 0 : K.toggleFavorite) == null ? void 0 : W.call(K, t.id));
    } catch (G) {
      j(!x), (z = (U = (Q = window == null ? void 0 : window.abp) == null ? void 0 : Q.notify) == null ? void 0 : U.error) == null || z.call(U, (G == null ? void 0 : G.message) || "Favori güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex flex-col gap-3.5 border-b border-subtle/80 bg-surface-base px-6 py-5", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 min-w-0 flex-1", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 flex-wrap", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: T,
            title: "Kodu Kopyala",
            className: "group flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary-subtle/60 border border-primary/20 text-primary font-mono text-[11px] font-bold tracking-wider hover:bg-primary-subtle hover:border-primary/40 transition-all shadow-xs",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[10px]" }),
              /* @__PURE__ */ e.jsx("span", { children: w.replace("#", "") }),
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d ? "fa-check text-success" : "fa-copy opacity-50 group-hover:opacity-100"} text-[10px] ml-0.5 transition-all` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(ne, { children: [
          /* @__PURE__ */ e.jsx(le, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold border transition-all cursor-pointer shadow-xs hover:opacity-90 ${f.color}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${f.dot} animate-pulse` }),
                /* @__PURE__ */ e.jsx("span", { children: f.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] opacity-70 ml-0.5" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(oe, { children: /* @__PURE__ */ e.jsxs(
            ce,
            {
              sideOffset: 4,
              align: "start",
              className: "z-50 w-44 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95",
              children: [
                /* @__PURE__ */ e.jsx("div", { className: "text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1", children: "Durumu Değiştir" }),
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: Ee.map((x) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => r("status", x.id),
                    className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${m === x.id ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${x.dot}` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: x.label }),
                      m === x.id && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ]
                  },
                  x.id
                )) })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ e.jsxs(ne, { children: [
          /* @__PURE__ */ e.jsx(le, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold border border-subtle transition-all cursor-pointer shadow-xs hover:bg-surface-hover ${v.color}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${v.icon} text-[11px]` }),
                /* @__PURE__ */ e.jsx("span", { children: v.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] opacity-70 ml-0.5" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(oe, { children: /* @__PURE__ */ e.jsxs(
            ce,
            {
              sideOffset: 4,
              align: "start",
              className: "z-50 w-40 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95",
              children: [
                /* @__PURE__ */ e.jsx("div", { className: "text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1", children: "Öncelik Seç" }),
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: ze.map((x) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => r("priority", x.id),
                    className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${h === x.id ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x.icon} text-xs` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: x.label }),
                      h === x.id && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ]
                  },
                  x.id
                )) })
              ]
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 mt-1", children: [
        /* @__PURE__ */ e.jsx(
          "h1",
          {
            contentEditable: !0,
            suppressContentEditableWarning: !0,
            onBlur: (x) => r("title", x.currentTarget.textContent),
            className: "text-[23px] font-bold tracking-tight text-text-primary hover:text-primary transition-colors focus:outline-none focus:bg-surface-sunken/40 px-1.5 py-0.5 -mx-1.5 rounded-lg cursor-text leading-tight truncate",
            children: t.title || "Başlıksız görev"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: I,
            className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${g ? "text-amber-500 bg-amber-50 dark:bg-amber-950/30" : "text-text-tertiary hover:bg-surface-hover hover:text-amber-500"}`,
            title: g ? "Favorilerden çıkar" : "Favorilere ekle",
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-${g ? "solid" : "regular"} fa-star text-lg` })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
      /* @__PURE__ */ e.jsx(
        ws,
        {
          isPrivate: p,
          onChange: (x) => {
            b(x), r("isPrivate", x);
          }
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "h-5 w-px bg-subtle mx-1" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1", children: [
        n === "modal" && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: s,
            title: i ? "Küçült" : "Tam Ekran",
            className: "flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors",
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${i ? "fa-compress" : "fa-expand"} text-xs` })
          }
        ),
        /* @__PURE__ */ e.jsxs(ne, { children: [
          /* @__PURE__ */ e.jsx(le, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer Seçenekler",
              className: "flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(oe, { children: /* @__PURE__ */ e.jsxs(
            ce,
            {
              sideOffset: 4,
              align: "end",
              className: "z-50 w-48 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95",
              children: [
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: P,
                    className: "flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors text-left",
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link text-xs text-text-tertiary" }),
                      /* @__PURE__ */ e.jsx("span", { children: "Bağlantıyı Kopyala" })
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => window.print(),
                    className: "flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors text-left",
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-print text-xs text-text-tertiary" }),
                      /* @__PURE__ */ e.jsx("span", { children: "Yazdır" })
                    ]
                  }
                )
              ]
            }
          ) })
        ] }),
        n === "modal" && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: a,
            title: "Kapat (Esc)",
            className: "flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-negative-subtle hover:text-negative transition-colors ml-1",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-sm" })
          }
        )
      ] })
    ] })
  ] }) });
}
const Ae = {
  0: { label: "İptal", cls: "text-text-secondary bg-neutral-subtle", icon: "fa-ban" },
  1: { label: "Bekliyor", cls: "text-text-secondary bg-neutral-subtle", icon: "fa-clock" },
  2: { label: "Sürüyor", cls: "text-warning bg-warning-subtle", icon: "fa-spinner" },
  3: { label: "Testte", cls: "text-primary bg-primary-subtle", icon: "fa-flask" },
  4: { label: "Tamamlandı", cls: "text-success bg-success-subtle", icon: "fa-circle-check" }
}, Ie = {
  1: { label: "Düşük", cls: "text-text-secondary bg-surface-sunken", icon: "fa-arrow-down" },
  2: { label: "Orta", cls: "text-warning bg-warning-subtle", icon: "fa-minus" },
  3: { label: "Yüksek", cls: "text-negative bg-negative-subtle", icon: "fa-arrow-up" },
  4: { label: "Kritik", cls: "text-negative bg-negative-subtle", icon: "fa-flag" }
};
function ue({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-bold text-text-tertiary uppercase tracking-wider select-none", children: t }),
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center text-[13px] text-text-primary h-8 min-w-0", children: a })
  ] });
}
function ks({
  task: t = {},
  assigneeOptions: a = [],
  onFieldChange: s = () => {
  },
  statusValue: i,
  priorityValue: n,
  assigneeValue: r
}) {
  const l = i ?? t.status ?? 1, o = n ?? t.priority ?? 2, [d, c] = u.useState(
    Array.isArray(t.tags) ? t.tags.map((x) => typeof x == "string" ? x : x == null ? void 0 : x.name).filter(Boolean) : []
  ), [p, b] = u.useState(""), [g, j] = u.useState(!1), m = r ?? t.assigneeId ?? null, h = (x) => {
    if (x.key === "Enter" || x.type === "blur") {
      const k = p.trim();
      if (k && !d.includes(k)) {
        const N = [...d, k];
        c(N), s("tagNames", N);
      }
      b(""), j(!1);
    }
  }, f = (x) => {
    const k = d.filter((N) => N !== x);
    c(k), s("tagNames", k);
  }, v = (x) => {
    s("assigneeId", x);
  }, w = (x) => {
    if (!x) return "—";
    const k = new Date(x);
    return isNaN(k.getTime()) ? x : k.toISOString().split("T")[0];
  }, T = a.find((x) => x.value === m), P = (T == null ? void 0 : T.label) || t.assigneeName || "Atanmamış", I = `https://ui-avatars.com/api/?name=${encodeURIComponent(P)}&background=6366f1&color=fff&size=64`;
  return /* @__PURE__ */ e.jsx("div", { className: "px-[var(--apya-space-6)] py-[var(--apya-space-5)] bg-surface-base border-b border-subtle", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-y-[var(--apya-space-5)] gap-x-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsx(ue, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(ne, { children: [
      /* @__PURE__ */ e.jsx(le, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group focus-visible:outline-none focus-visible:shadow-focus",
          children: [
            /* @__PURE__ */ e.jsx("img", { src: I, alt: P, className: "h-6 w-6 rounded-full border border-subtle shrink-0 object-cover" }),
            /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary text-[13px] group-hover:text-primary transition-colors", children: P }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] text-text-tertiary ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(oe, { children: /* @__PURE__ */ e.jsxs(
        ce,
        {
          sideOffset: 6,
          align: "start",
          className: "z-50 w-56 rounded-xl border border-subtle bg-surface-base p-2 shadow-float animate-in fade-in-50 zoom-in-95",
          children: [
            /* @__PURE__ */ e.jsx("div", { className: "text-[11px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1 mb-1", children: "Kişi Ata" }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 max-h-48 overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => v(null),
                  className: `flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-left transition-colors ${m ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary font-semibold"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "flex h-5 w-5 items-center justify-center rounded-full bg-surface-sunken text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-user-slash text-[9px]" }) }),
                    /* @__PURE__ */ e.jsx("span", { children: "Atanmamış" })
                  ]
                }
              ),
              a.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-2 py-1.5 text-[12px] text-text-tertiary", children: "Kullanıcı listesi yükleniyor…" }),
              a.map((x) => /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => v(x.value),
                  className: `flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-left transition-colors ${m === x.value ? "bg-primary-subtle text-primary font-semibold" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("img", { src: `https://ui-avatars.com/api/?name=${encodeURIComponent(x.label)}&background=6366f1&color=fff&size=64`, alt: x.label, className: "h-5 w-5 rounded-full" }),
                    /* @__PURE__ */ e.jsx("span", { children: x.label })
                  ]
                },
                x.value
              ))
            ] })
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Son Tarih", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors group relative", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          value: w(t.dueDate),
          onChange: (x) => s("dueDate", x.target.value),
          className: "bg-transparent text-text-primary text-[13px] font-medium focus:outline-none cursor-pointer"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Başlangıç", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors group relative", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          value: w(t.startDate),
          onChange: (x) => s("startDate", x.target.value),
          className: "bg-transparent text-text-primary text-[13px] font-medium focus:outline-none cursor-pointer"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Öncelik", children: /* @__PURE__ */ e.jsxs(ne, { children: [
      /* @__PURE__ */ e.jsx(le, { asChild: !0, children: /* @__PURE__ */ e.jsx("button", { type: "button", className: "flex items-center rounded-md cursor-pointer hover:opacity-90 transition-all focus-visible:outline-none focus-visible:shadow-focus", children: (() => {
        const x = Ie[o] || Ie[2];
        return /* @__PURE__ */ e.jsxs("span", { className: `flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[13px] font-semibold ${x.cls}`, children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x.icon} text-xs` }),
          /* @__PURE__ */ e.jsx("span", { children: x.label }),
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] opacity-70 ml-0.5" })
        ] });
      })() }) }),
      /* @__PURE__ */ e.jsx(oe, { children: /* @__PURE__ */ e.jsxs(ce, { sideOffset: 6, align: "start", className: "z-50 w-40 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95", children: [
        /* @__PURE__ */ e.jsx("div", { className: "text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1", children: "Öncelik Seç" }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: [1, 2, 3, 4].map((x) => {
          const k = Ie[x], N = o === x;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => s("priority", x),
              className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${N ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${k.icon} text-xs` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: k.label }),
                N && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
              ]
            },
            x
          );
        }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Durum", children: /* @__PURE__ */ e.jsxs(ne, { children: [
      /* @__PURE__ */ e.jsx(le, { asChild: !0, children: /* @__PURE__ */ e.jsx("button", { type: "button", className: "flex items-center rounded-md cursor-pointer hover:opacity-90 transition-all focus-visible:outline-none focus-visible:shadow-focus", children: (() => {
        const x = Ae[l] || Ae[1];
        return /* @__PURE__ */ e.jsxs("span", { className: `flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[13px] font-semibold ${x.cls}`, children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x.icon} text-xs` }),
          /* @__PURE__ */ e.jsx("span", { children: x.label }),
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] opacity-70 ml-0.5" })
        ] });
      })() }) }),
      /* @__PURE__ */ e.jsx(oe, { children: /* @__PURE__ */ e.jsxs(ce, { sideOffset: 6, align: "start", className: "z-50 w-44 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95", children: [
        /* @__PURE__ */ e.jsx("div", { className: "text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1", children: "Durumu Değiştir" }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: [1, 2, 3, 4].map((x) => {
          const k = Ae[x], N = l === x;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => s("status", x),
              className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${N ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${k.icon} text-xs` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: k.label }),
                N && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
              ]
            },
            x
          );
        }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
      d.map((x) => /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "group inline-flex items-center gap-1 bg-primary-subtle text-primary text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors",
          children: [
            /* @__PURE__ */ e.jsx("span", { children: x }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: () => f(x),
                className: "opacity-0 group-hover:opacity-100 hover:text-negative transition-opacity ml-0.5",
                "aria-label": "Etiketi kaldır",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
              }
            )
          ]
        },
        x
      )),
      g ? /* @__PURE__ */ e.jsx(
        "input",
        {
          autoFocus: !0,
          type: "text",
          value: p,
          onChange: (x) => b(x.target.value),
          onKeyDown: h,
          onBlur: h,
          placeholder: "Etiket...",
          className: "h-6 w-16 px-1.5 text-[11px] rounded border border-primary bg-surface-base focus:outline-none"
        }
      ) : /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => j(!0),
          className: "flex items-center justify-center h-5 w-5 rounded-full bg-surface-sunken border border-subtle text-text-tertiary hover:bg-surface-hover hover:text-text-primary hover:border-primary transition-all",
          "aria-label": "Yeni etiket ekle",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[9px]" })
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Proje", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-text-tertiary text-sm" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary text-[13px] truncate max-w-[140px]", children: t.projectName || "Projesiz" })
    ] }) })
  ] }) });
}
const Cs = ["checklist", "time-tracking", "gantt", "dependencies", "finance", "comments", "activity", "history"], Ts = Object.fromEntries(Ce.map((t) => [t.code, t])), pt = [
  {
    title: "GÖREV & PLANLAMA",
    items: [
      { code: "gantt", title: "Gantt Çizelgesi", desc: "İnteraktif zaman çizelgesi ve aşamalar", icon: "fa-bars-staggered", color: "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 border-indigo-200" },
      { code: "dashboard", title: "Gösterge Paneli", desc: "Özel KPI ve performans widget panelleri", icon: "fa-chart-pie", color: "bg-primary-subtle text-primary border-primary/20" },
      { code: "time-tracking", title: "Zaman Takibi", desc: "Canlı süre takibi, sayaç ve raporlama", icon: "fa-stopwatch", color: "bg-warning-subtle text-warning border-warning/20" },
      { code: "checklist", title: "Kontrol Listesi", desc: "Alt görev ve onay kontrol listeleri", icon: "fa-square-check", color: "bg-success-subtle text-success border-success/20" },
      { code: "risks", title: "Risk Yönetimi", desc: "Risk matrisi ve önleyici aksiyonlar", icon: "fa-triangle-exclamation", color: "bg-warning-subtle text-warning border-warning/20" },
      { code: "approvals", title: "Onay Süreçleri", desc: "Çok adımlı yönetici onay akışları", icon: "fa-stamp", color: "bg-primary-subtle text-primary border-primary/20" },
      { code: "dependencies", title: "İlişkili Görevler", desc: "Öncül ve ardıl görev bağlantıları", icon: "fa-link", color: "bg-surface-sunken text-text-secondary border-subtle" }
    ]
  },
  {
    title: "İLETİŞİM",
    items: [
      { code: "comments", title: "Yorumlar", desc: "Görev yorumları ve @bahsetmeler", icon: "fa-comments", color: "bg-primary-subtle text-primary border-primary/20" },
      { code: "emails", title: "E-postalar", desc: "Görevle bağlantılı e-posta entegrasyonu", icon: "fa-envelope", color: "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 border-indigo-200" }
    ]
  },
  {
    title: "GEÇMİŞ & AKTİVİTE",
    items: [
      { code: "activity", title: "Aktiviteler", desc: "Tüm sistem olayları ve zaman akışı", icon: "fa-timeline", color: "bg-primary-subtle text-primary border-primary/20" },
      { code: "history", title: "Geçmiş & Versiyon", desc: "Kronolojik alan ve metin geçmişi", icon: "fa-clock-rotate-left", color: "bg-primary-subtle text-primary border-primary/20" }
    ]
  },
  {
    title: "FİNANS & MEDYA",
    items: [
      { code: "finance", title: "Finans & Bütçe", desc: "Maliyet merkezleri, bütçe ve harcamalar", icon: "fa-coins", color: "bg-success-subtle text-success border-success/20" },
      { code: "gallery", title: "Dosya Galerisi", desc: "Görsel medya ve dosya önizleme", icon: "fa-image", color: "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 border-indigo-200" }
    ]
  },
  {
    title: "İLERİ ÖZELLİKLER & YAPAY ZEKA",
    items: [
      { code: "custom-fields", title: "Özel Alanlar", desc: "Görevinize özel form alanları tanımlayın", icon: "fa-square-plus", color: "bg-success-subtle text-success border-success/20" },
      { code: "automations", title: "Otomasyonlar", desc: "Durum ve eylem tetikleyici kurallar", icon: "fa-wand-magic-sparkles", color: "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 border-indigo-200" },
      { code: "ai", title: "Apya Yapay Zeka", desc: "Akıllı görev analizi, özet ve öneriler", icon: "fa-sparkles", color: "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 border-indigo-200" }
    ]
  }
], Ue = pt.reduce((t, a) => t + a.items.length, 0);
function Ds({
  assignedCodes: t = [],
  onAddFeature: a = () => {
  }
}) {
  const [s, i] = u.useState(!1), [n, r] = u.useState(!1), [l, o] = u.useState(""), [d, c] = u.useState(!1);
  u.useEffect(() => {
    c(!0);
  }, []);
  const p = (f) => t.includes(f), b = (f) => {
    a(f), i(!1), r(!1);
  }, g = () => {
    i(!1), o(""), r(!0);
  };
  u.useEffect(() => {
    const f = (v) => {
      v.key === "Escape" && n && r(!1);
    };
    return window.addEventListener("keydown", f), () => window.removeEventListener("keydown", f);
  }, [n]);
  const j = Cs.map((f) => Ts[f]).filter(Boolean), m = pt.map((f) => ({
    ...f,
    items: f.items.filter(
      (v) => v.title.toLowerCase().includes(l.toLowerCase()) || v.desc.toLowerCase().includes(l.toLowerCase()) || f.title.toLowerCase().includes(l.toLowerCase())
    )
  })).filter((f) => f.items.length > 0), h = n && d ? bt.createPortal(
    /* @__PURE__ */ e.jsx(
      "div",
      {
        className: "apya-feature-modal-root fixed inset-0 z-[99999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150",
        onClick: () => r(!1),
        children: /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "relative w-full max-w-3xl rounded-3xl border border-subtle bg-surface-base shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 fade-in duration-200",
            onClick: (f) => f.stopPropagation(),
            children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between p-6 border-b border-subtle bg-surface-sunken/50", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ e.jsx("div", { className: "h-10 w-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shapes text-lg" }) }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-bold text-text-primary tracking-tight", children: "ÖZELLİK EKLEME SİSTEMİ" }),
                    /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Bir özelliğe tıklayarak görevinize yeni sekme ve fonksiyonlar ekleyin." })
                  ] })
                ] }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => r(!1),
                    className: "h-9 w-9 rounded-xl flex items-center justify-center text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-base" })
                  }
                )
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "px-6 pt-4 pb-2", children: /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary text-xs" }),
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "text",
                    autoFocus: !0,
                    value: l,
                    onChange: (f) => o(f.target.value),
                    placeholder: `${Ue} özellik arasında ara (Gantt, Finans, AI, Riskler...)`,
                    className: "w-full h-10 pl-9 pr-4 text-[13px] rounded-xl border border-subtle bg-surface-base focus:border-primary focus:outline-none focus:shadow-focus transition-all text-text-primary placeholder:text-text-tertiary"
                  }
                ),
                l && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => o(""),
                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-circle-xmark text-xs" })
                  }
                )
              ] }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar", children: [
                m.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-bold text-text-tertiary tracking-widest uppercase", children: f.title }),
                    /* @__PURE__ */ e.jsx("div", { className: "flex-1 h-px bg-subtle/60" })
                  ] }),
                  /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3.5", children: f.items.map((v) => {
                    const w = p(v.code);
                    return /* @__PURE__ */ e.jsxs(
                      "div",
                      {
                        onClick: () => b(v.code),
                        className: `
                                                group flex items-start gap-4 rounded-2xl border p-4 transition-all cursor-pointer select-none
                                                ${w ? "border-primary/50 bg-primary-subtle/30 shadow-xs ring-1 ring-primary/30" : "border-subtle bg-surface-base hover:border-primary/60 hover:bg-surface-hover hover:shadow-md hover:-translate-y-0.5"}
                                            `,
                        children: [
                          /* @__PURE__ */ e.jsx("div", { className: `flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${v.color} shadow-xs text-lg group-hover:scale-105 transition-transform`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${v.icon}` }) }),
                          /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0 flex-1", children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                              /* @__PURE__ */ e.jsx("span", { className: "text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors truncate", children: v.title }),
                              w ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1 text-[11px] font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded-full border border-primary/20", children: [
                                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" }),
                                "Aktif"
                              ] }) : /* @__PURE__ */ e.jsxs("span", { className: "opacity-0 group-hover:opacity-100 text-xs font-semibold text-primary transition-opacity flex items-center gap-1", children: [
                                /* @__PURE__ */ e.jsx("span", { children: "Ekle" }),
                                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-right text-[10px]" })
                              ] })
                            ] }),
                            /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary leading-normal line-clamp-2", children: v.desc })
                          ] })
                        ]
                      },
                      v.code
                    );
                  }) })
                ] }, f.title)),
                m.length === 0 && /* @__PURE__ */ e.jsxs("div", { className: "py-12 text-center flex flex-col items-center gap-2", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass text-3xl text-text-tertiary mb-2" }),
                  /* @__PURE__ */ e.jsx("p", { className: "text-sm font-semibold text-text-primary", children: "Eşleşen özellik bulunamadı" }),
                  /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Lütfen farklı bir arama terimi deneyin." })
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-6 py-3.5 border-t border-subtle bg-surface-sunken/40 text-xs text-text-tertiary", children: [
                /* @__PURE__ */ e.jsxs("span", { children: [
                  "Toplam ",
                  Ue,
                  " profesyonel modül ve sekme"
                ] }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => r(!1),
                    className: "text-xs font-bold text-text-primary hover:text-primary transition-colors cursor-pointer",
                    children: "Kapat (ESC)"
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    document.body
  ) : null;
  return /* @__PURE__ */ e.jsxs("div", { className: "relative inline-flex items-center", children: [
    /* @__PURE__ */ e.jsxs(ne, { open: s, onOpenChange: i, children: [
      /* @__PURE__ */ e.jsx(le, { asChild: !0, children: /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-primary/50 bg-primary-subtle/30 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all focus:outline-none shadow-xs cursor-pointer active:scale-95",
          "aria-label": "Özellik ekle",
          title: "Özellik Ekle (+)",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-xs pointer-events-none" })
        }
      ) }),
      /* @__PURE__ */ e.jsx(oe, { children: /* @__PURE__ */ e.jsxs(
        ce,
        {
          align: "end",
          sideOffset: 6,
          className: "z-[99999999] w-72 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95",
          children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-2.5 py-1.5 text-[11px] font-bold text-text-tertiary uppercase tracking-wider", children: "Görünüm / özellik ekle" }),
            /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5 max-h-[320px] overflow-y-auto custom-scrollbar", children: j.map((f) => {
              const v = p(f.code);
              return /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  disabled: v,
                  onClick: () => b(f.code),
                  className: `flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors ${v ? "opacity-60 cursor-default" : "hover:bg-surface-hover cursor-pointer"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-sunken text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${f.icon} text-xs` }) }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[13px] font-medium text-text-primary truncate", children: f.title }),
                    v && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary shrink-0" })
                  ]
                },
                f.code
              );
            }) }),
            /* @__PURE__ */ e.jsx("div", { className: "my-1 h-px bg-subtle" }),
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: g,
                className: "flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] font-semibold text-primary hover:bg-primary-subtle transition-colors cursor-pointer",
                children: [
                  /* @__PURE__ */ e.jsx("span", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-grip text-xs" }) }),
                  /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-left", children: "Daha fazla özellik keşfet…" }),
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-right text-[10px] opacity-60" })
                ]
              }
            )
          ]
        }
      ) })
    ] }),
    h
  ] });
}
function Ss({
  activeTab: t = "general",
  onTabChange: a = () => {
  },
  visibleTabs: s = [],
  assignedCodes: i = [],
  onAddFeature: n = () => {
  },
  task: r = {}
}) {
  const l = (o) => {
    var c, p, b, g;
    let d = 0;
    return o === "subtasks" ? d = ((c = r.subTasks) == null ? void 0 : c.length) ?? 0 : o === "files" ? d = ((p = r.attachments) == null ? void 0 : p.length) ?? 0 : o === "dependencies" ? d = ((b = r.predecessorIds) == null ? void 0 : b.length) ?? 0 : o === "comments" && (d = ((g = r.comments) == null ? void 0 : g.length) ?? 0), d > 0 ? d : null;
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-4 w-full py-1.5", children: [
    /* @__PURE__ */ e.jsx("nav", { className: "flex items-center gap-1.5 overflow-x-auto custom-scrollbar", "aria-label": "Görev Sekmeleri", children: s.map((o) => {
      const d = t === o.code, c = l(o.code);
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => a(o.code),
          className: `relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap select-none cursor-pointer ${d ? "text-primary bg-primary-subtle shadow-xs font-bold" : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"}`,
          children: [
            /* @__PURE__ */ e.jsx("span", { children: o.title }),
            c !== null && /* @__PURE__ */ e.jsx("span", { className: `flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full text-[10px] font-bold ${d ? "bg-primary text-white" : "bg-surface-sunken text-text-tertiary"}`, children: c }),
            d && /* @__PURE__ */ e.jsx("span", { className: "absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" })
          ]
        },
        o.code
      );
    }) }),
    /* @__PURE__ */ e.jsx("div", { className: "shrink-0 flex items-center", children: /* @__PURE__ */ e.jsx(
      Ds,
      {
        assignedCodes: i,
        onAddFeature: n
      }
    ) })
  ] });
}
function Ve({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-start py-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary text-right font-medium max-w-[150px] truncate", title: typeof a == "string" ? a : "", children: a ?? "—" })
  ] });
}
function _e({ label: t, name: a, avatar: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-center py-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("img", { src: s, alt: a, className: "w-5 h-5 rounded-full border border-subtle object-cover" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary font-semibold", children: a })
    ] })
  ] });
}
function Es({ task: t = {}, onDelete: a = () => {
}, nameById: s }) {
  const [i, n] = u.useState(!1), [r, l] = u.useState(!1), o = te(), d = (h, f) => {
    var v;
    return h || f && ((v = s == null ? void 0 : s.get) == null ? void 0 : v.call(s, f)) || "Bilinmiyor";
  }, c = d(t.creatorName, t.creatorId), p = t.lastModificationTime ? d(t.lastModifierName, t.lastModifierId) : "—", b = (h) => h ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(h)) : "—", g = () => {
    var f, v, w, T;
    const h = `${window.location.origin}/Tasks?task=${t.id || ""}`;
    (f = navigator.clipboard) == null || f.writeText(h), (T = (w = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : w.success) == null || T.call(w, "Görev bağlantısı panoya kopyalandı!");
  }, j = async () => {
    var h, f, v, w, T, P, I, x, k, N, F;
    if (!(!t || i)) {
      n(!0);
      try {
        const K = (v = (f = (h = window == null ? void 0 : window.apya) == null ? void 0 : h.platform) == null ? void 0 : f.tasks) == null ? void 0 : v.task;
        if (K) {
          const W = {
            title: `Kopya - ${t.title || "Görev"}`,
            description: t.description || "",
            startDate: t.startDate ? new Date(t.startDate).toISOString().slice(0, 10) : (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
            dueDate: t.dueDate ? new Date(t.dueDate).toISOString().slice(0, 10) : null,
            status: 1,
            // Todo
            priority: t.priority || 2,
            projectId: t.projectId,
            assigneeId: t.assigneeId,
            isPrivate: t.isPrivate || !1
          }, Q = await Promise.resolve(K.create(W));
          await o.invalidateQueries({ queryKey: ["task-detail"] }), (P = (T = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : T.success) == null || P.call(T, "Görev başarıyla çoğaltıldı!"), (x = (I = window.apya) == null ? void 0 : I.taskDetail) != null && x.open && Q && window.apya.taskDetail.open(Q);
        }
      } catch (K) {
        (F = (N = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : N.error) == null || F.call(N, (K == null ? void 0 : K.message) || "Görev çoğaltılamadı.");
      } finally {
        n(!1);
      }
    }
  }, m = async () => {
    var h, f, v, w, T, P, I, x, k;
    if (!(!t.id || r)) {
      l(!0);
      try {
        const N = (v = (f = (h = window == null ? void 0 : window.apya) == null ? void 0 : h.platform) == null ? void 0 : f.tasks) == null ? void 0 : v.task;
        N && (await Promise.resolve(N.updateStatus(t.id, 4)), await o.invalidateQueries({ queryKey: ["task-detail", t.id] }), (P = (T = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : T.info) == null || P.call(T, "Görev arşivlendi (Tamamlandı)."));
      } catch (N) {
        (k = (x = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : x.error) == null || k.call(x, (N == null ? void 0 : N.message) || "Görev arşivlenemedi.");
      } finally {
        l(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs flex flex-col", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary mb-2", children: "Detaylar" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col divide-y divide-subtle/50", children: [
        /* @__PURE__ */ e.jsx(
          _e,
          {
            label: "Oluşturan",
            name: c,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c)}&background=6366f1&color=fff&size=64`
          }
        ),
        /* @__PURE__ */ e.jsx(Ve, { label: "Oluşturma Tarihi", value: b(t.creationTime) }),
        /* @__PURE__ */ e.jsx(
          _e,
          {
            label: "Güncelleyen",
            name: p,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(p)}&background=6366f1&color=fff&size=64`
          }
        ),
        /* @__PURE__ */ e.jsx(Ve, { label: "Son Güncelleme", value: b(t.lastModificationTime) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs flex flex-col gap-2.5", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary mb-1", children: "Hızlı işlemler" }),
      /* @__PURE__ */ e.jsx(
        D,
        {
          type: "button",
          variant: "outline",
          onClick: g,
          className: "w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]",
          icon: "fa-link",
          children: "Bağlantıyı kopyala"
        }
      ),
      /* @__PURE__ */ e.jsx(
        D,
        {
          type: "button",
          variant: "outline",
          onClick: j,
          disabled: i,
          isLoading: i,
          className: "w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]",
          icon: "fa-copy",
          children: "Çoğalt"
        }
      ),
      /* @__PURE__ */ e.jsx(
        D,
        {
          type: "button",
          variant: "outline",
          onClick: m,
          disabled: r,
          isLoading: r,
          className: "w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]",
          icon: "fa-box-archive",
          children: "Arşivle"
        }
      ),
      /* @__PURE__ */ e.jsx(
        D,
        {
          type: "button",
          variant: "outline",
          onClick: a,
          className: "w-full justify-start text-negative hover:bg-negative-subtle hover:border-negative/40 h-10 border-negative/20 font-semibold rounded-xl text-[13px] transition-colors mt-1",
          icon: "fa-trash-can",
          children: "Sil"
        }
      )
    ] })
  ] });
}
function zs({ onFormat: t = () => {
} }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-0.5 border-b border-subtle bg-surface-sunken/40 px-2 py-1.5 rounded-t-xl overflow-x-auto custom-scrollbar", children: [
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("**", "**"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Kalın (Ctrl+B)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-bold text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("*", "*"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "İtalik (Ctrl+I)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-italic text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("<u>", "</u>"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Altı Çizili (Ctrl+U)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-underline text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("~~", "~~"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Üstü Çizili", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-strikethrough text-xs" }) }),
    /* @__PURE__ */ e.jsx("div", { className: "h-4 w-px bg-subtle mx-1 shrink-0" }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t(`
- `, ""), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Madde İşaretli Liste", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-list-ul text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t(`
1. `, ""), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Numaralı Liste", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-list-ol text-xs" }) }),
    /* @__PURE__ */ e.jsx("div", { className: "h-4 w-px bg-subtle mx-1 shrink-0" }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("[", "](url)"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Bağlantı Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("![Resim](", ")"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Görsel Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-image text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t(`
| Kolon 1 | Kolon 2 |
|---|---|
| Değer 1 | Değer 2 |
`, ""), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Tablo Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-table-cells text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("@", " "), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Kişi Bahset (@)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-at text-xs" }) })
  ] });
}
function As({ task: t = {}, onFieldChange: a = () => {
} }) {
  const s = t == null ? void 0 : t.id, i = te(), [n, r] = u.useState(t.description || ""), l = (y, C = "") => {
    const S = document.getElementById("task-v3-desc-input");
    if (!S) return;
    const R = S.selectionStart, A = S.selectionEnd, B = n.substring(R, A) || "metin", Y = `${y}${B}${C}`, q = n.substring(0, R) + Y + n.substring(A);
    r(q), a("description", q);
  }, o = dt(s), [d, c] = u.useState(!0), [p, b] = u.useState(""), [g, j] = u.useState(!1), [m, h] = u.useState(!1), f = o.items ?? [], v = f.filter((y) => y.isDone || y.done).length, w = async (y) => {
    var C, S, R, A, B, Y;
    if (y.key === "Enter" || y.type === "blur") {
      const q = p.trim();
      if (q && s) {
        h(!0);
        try {
          await o.addItem(q), (R = (S = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : S.success) == null || R.call(S, "Madde eklendi.");
        } catch (X) {
          (Y = (B = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : B.error) == null || Y.call(B, (X == null ? void 0 : X.message) || "Madde eklenemedi.");
        } finally {
          h(!1);
        }
      }
      b(""), j(!1);
    }
  }, T = async (y) => {
    var C, S, R;
    if (!(typeof y == "string" && y.startsWith("mock-")))
      try {
        await o.toggleItem(y);
      } catch (A) {
        (R = (S = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : S.error) == null || R.call(S, (A == null ? void 0 : A.message) || "Durum güncellenemedi.");
      }
  }, P = async (y) => {
    var C, S, R, A, B, Y;
    if (!(typeof y == "string" && y.startsWith("mock-")))
      try {
        await o.removeItem(y), (R = (S = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : S.info) == null || R.call(S, "Madde silindi.");
      } catch (q) {
        (Y = (B = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : B.error) == null || Y.call(B, (q == null ? void 0 : q.message) || "Madde silinemedi.");
      }
  }, { data: I = [] } = ae({
    queryKey: ["task-comments", s],
    queryFn: async () => {
      var C, S, R;
      const y = (R = (S = (C = window == null ? void 0 : window.apya) == null ? void 0 : C.platform) == null ? void 0 : S.tasks) == null ? void 0 : R.task;
      return !y || !s ? [] : await Promise.resolve(y.getComments(s));
    },
    enabled: !!s,
    staleTime: 1e4
  }), [x, k] = u.useState(""), [N, F] = u.useState(!0), [K, W] = u.useState(!1), [Q, U] = u.useState(null), [z, G] = u.useState(""), V = I.length > 0 ? I : t.comments ?? [], H = async (y) => {
    var S, R, A, B, Y, q, X, ee, de;
    y.preventDefault();
    const C = x.trim();
    if (!(!C || !s)) {
      W(!0);
      try {
        const _ = (A = (R = (S = window == null ? void 0 : window.apya) == null ? void 0 : S.platform) == null ? void 0 : R.tasks) == null ? void 0 : A.task;
        _ && (await Promise.resolve(_.addComment(s, C)), await i.invalidateQueries({ queryKey: ["task-comments", s] }), await i.invalidateQueries({ queryKey: ["task-detail", s] }), (q = (Y = (B = window == null ? void 0 : window.abp) == null ? void 0 : B.notify) == null ? void 0 : Y.success) == null || q.call(Y, "Yorum gönderildi.")), k("");
      } catch (_) {
        (de = (ee = (X = window == null ? void 0 : window.abp) == null ? void 0 : X.notify) == null ? void 0 : ee.error) == null || de.call(ee, (_ == null ? void 0 : _.message) || "Yorum gönderilemedi.");
      } finally {
        W(!1);
      }
    }
  }, O = async (y) => {
    var S, R, A, B, Y, q, X, ee, de;
    const C = z.trim();
    if (!(!C || !s))
      try {
        const _ = (A = (R = (S = window == null ? void 0 : window.apya) == null ? void 0 : S.platform) == null ? void 0 : R.tasks) == null ? void 0 : A.task;
        _ && (await Promise.resolve(_.replyToComment(y, C)), await i.invalidateQueries({ queryKey: ["task-comments", s] }), (q = (Y = (B = window == null ? void 0 : window.abp) == null ? void 0 : B.notify) == null ? void 0 : Y.success) == null || q.call(Y, "Yanıt gönderildi.")), G(""), U(null);
      } catch (_) {
        (de = (ee = (X = window == null ? void 0 : window.abp) == null ? void 0 : X.notify) == null ? void 0 : ee.error) == null || de.call(ee, (_ == null ? void 0 : _.message) || "Yanıt gönderilemedi.");
      }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-2.5", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary", children: "Açıklama" }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-subtle bg-surface-base focus-within:border-primary focus-within:shadow-focus transition-all overflow-hidden shadow-xs", children: [
        /* @__PURE__ */ e.jsx(zs, { onFormat: l }),
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            id: "task-v3-desc-input",
            className: "w-full min-h-[110px] p-4 text-[14px] leading-relaxed text-text-primary bg-transparent focus:outline-none resize-y font-sans",
            value: n,
            onChange: (y) => {
              r(y.target.value), a("description", y.target.value);
            },
            placeholder: "Bu görevin detayları nelerdir? (@kişi, #etiket)..."
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs transition-all", children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          onClick: () => c(!d),
          className: "flex items-center justify-between cursor-pointer select-none group",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors", children: "Kontrol Listesi" }),
              f.length > 0 && /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-text-tertiary bg-surface-sunken px-2 py-0.5 rounded-full", children: [
                v,
                "/",
                f.length
              ] })
            ] }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "text-text-tertiary group-hover:text-text-primary transition-colors", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid fa-chevron-up transition-transform duration-200 ${d ? "" : "rotate-180"}` }) })
          ]
        }
      ),
      d && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2.5 animate-in fade-in-50", children: [
        f.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden mb-1", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full bg-success transition-all duration-300",
            style: { width: `${v / f.length * 100}%` }
          }
        ) }),
        f.map((y) => {
          const C = y.isDone ?? y.done ?? !1;
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: "group flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-surface-hover/70 transition-colors",
              children: [
                /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: C,
                      onChange: () => T(y.id),
                      className: "h-4 w-4 rounded border-subtle text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `text-[13px] transition-all truncate ${C ? "line-through text-text-tertiary font-normal" : "text-text-primary font-medium"}`, children: y.text })
                ] }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => P(y.id),
                    className: "opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-negative transition-all p-1",
                    title: "Maddeyi Sil",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-trash-can text-xs" })
                  }
                )
              ]
            },
            y.id
          );
        }),
        g ? /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 mt-1", children: /* @__PURE__ */ e.jsx(
          "input",
          {
            autoFocus: !0,
            type: "text",
            value: p,
            onChange: (y) => b(y.target.value),
            onKeyDown: w,
            onBlur: w,
            disabled: m,
            placeholder: "Yeni kontrol maddesi yazıp Enter'a basın...",
            className: "w-full h-9 px-3 text-[13px] rounded-lg border border-primary bg-surface-base focus:outline-none"
          }
        ) }) : /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => j(!0),
            className: "flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary-hover transition-colors mt-1 px-2 py-1 w-max rounded-lg hover:bg-primary-subtle",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
              /* @__PURE__ */ e.jsx("span", { children: "Yeni madde ekle" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs transition-all", children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          onClick: () => F(!N),
          className: "flex items-center justify-between cursor-pointer select-none group",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors", children: "Yorumlar & Güncellemeler" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-primary-subtle text-primary text-[11px] font-bold", children: V.length })
            ] }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "text-text-tertiary group-hover:text-text-primary transition-colors", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid fa-chevron-up transition-transform duration-200 ${N ? "" : "rotate-180"}` }) })
          ]
        }
      ),
      N && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-5 animate-in fade-in-50", children: [
        /* @__PURE__ */ e.jsxs("form", { onSubmit: H, className: "flex gap-3 items-start", children: [
          /* @__PURE__ */ e.jsx(
            "img",
            {
              src: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64",
              alt: "Yakup",
              className: "h-8 w-8 rounded-full border border-subtle mt-1 shrink-0 object-cover"
            }
          ),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col rounded-xl border border-subtle bg-surface-sunken/40 focus-within:bg-surface-base focus-within:border-primary focus-within:shadow-focus transition-all overflow-hidden", children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                value: x,
                onChange: (y) => k(y.target.value),
                placeholder: "Bir yorum yazın... (@bahset, #görev)",
                rows: 2,
                className: "w-full p-3 text-[13px] bg-transparent focus:outline-none resize-none text-text-primary",
                onKeyDown: (y) => {
                  y.key === "Enter" && (y.ctrlKey || y.metaKey) && H(y);
                }
              }
            ),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-t border-subtle/50 bg-surface-base", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 text-text-tertiary", children: [
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => k((y) => y + " [Dosya] "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Dosya Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => k((y) => y + " [Görsel] "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Resim Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-image text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => k((y) => y + " 👍 "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Emoji", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-face-smile text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => k((y) => y + " @Yakup B. "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Bahset (@)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-at text-xs" }) })
              ] }),
              /* @__PURE__ */ e.jsx(
                D,
                {
                  type: "submit",
                  size: "sm",
                  disabled: !x.trim() || K,
                  isLoading: K,
                  className: "bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 h-8 rounded-lg shadow-sm",
                  icon: "fa-paper-plane",
                  children: "Gönder"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-4 divide-y divide-subtle/50", children: V.map((y) => {
          const C = y.creatorName || y.author || "Yakup B.", S = `https://ui-avatars.com/api/?name=${encodeURIComponent(C)}&background=6366f1&color=fff&size=64`, R = y.creationTime ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(y.creationTime)) : y.date || "10.07.2026 09:30";
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-3 pt-3 items-start first:pt-0", children: [
            /* @__PURE__ */ e.jsx("img", { src: S, alt: C, className: "h-8 w-8 rounded-full border border-subtle shrink-0 object-cover" }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col gap-1", children: [
              /* @__PURE__ */ e.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: C }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary font-mono", children: R })
              ] }) }),
              /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap", children: y.text.split(" ").map((A, B) => A.startsWith("@") ? /* @__PURE__ */ e.jsxs("span", { className: "font-semibold text-primary bg-primary-subtle px-1 py-0.5 rounded mr-1", children: [
                A,
                " "
              ] }, B) : A + " ") }),
              /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-4 mt-1", children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => U(Q === y.id ? null : y.id),
                  className: "text-xs font-semibold text-text-tertiary hover:text-primary transition-colors flex items-center gap-1",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                    /* @__PURE__ */ e.jsx("span", { children: "Yanıtla" })
                  ]
                }
              ) }),
              Q === y.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex gap-2 items-center animate-in fade-in-50", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: z,
                    onChange: (A) => G(A.target.value),
                    placeholder: `@${C} kullanıcısına yanıt ver...`,
                    onKeyDown: (A) => {
                      A.key === "Enter" && O(y.id);
                    },
                    className: "flex-1 h-8 px-3 text-[12px] rounded-lg border border-primary bg-surface-base focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(D, { size: "sm", onClick: () => O(y.id), className: "h-8 text-xs bg-primary text-white", children: "Yanıtla" })
              ] })
            ] })
          ] }, y.id);
        }) })
      ] })
    ] })
  ] });
}
function Is({
  lastSavedAt: t,
  isDirty: a,
  isSaving: s,
  onCancel: i,
  onSave: n
}) {
  const r = t ? new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(t)) : "—";
  return /* @__PURE__ */ e.jsxs("footer", { className: "flex items-center justify-between border-t border-subtle bg-surface-base px-6 py-4 mt-auto", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-xs text-text-tertiary", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock" }),
      /* @__PURE__ */ e.jsxs("span", { children: [
        "Son kayıt: ",
        /* @__PURE__ */ e.jsx("strong", { className: "font-medium text-text-secondary", children: r })
      ] }),
      a && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 text-warning font-medium ml-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "h-2 w-2 rounded-full bg-warning animate-pulse" }),
        "Kaydedilmemiş değişiklikler var"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ e.jsx(
        D,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          onClick: i,
          className: "text-text-secondary hover:bg-surface-hover px-4",
          children: "Vazgeç"
        }
      ),
      /* @__PURE__ */ e.jsx(
        D,
        {
          type: "button",
          variant: "primary",
          size: "sm",
          onClick: n,
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
const Qe = "apya.taskDetail.fullscreen";
function ft({
  taskId: t,
  presentation: a = "modal",
  onClose: s,
  switchToTask: i
}) {
  const [n, r] = u.useState(t), { data: l, isLoading: o, isError: d, refetch: c } = et(n), p = te(), b = st(), g = nt(l), j = lt(), m = ot(n), [h, f] = u.useState("general"), [v, w] = u.useState(!1), [T, P] = u.useState(() => {
    try {
      return localStorage.getItem(Qe) === "true";
    } catch {
      return !1;
    }
  });
  it(n), fe.useEffect(() => {
    g.isDirty ? b.markDirty() : b.markClean();
  });
  const I = u.useCallback(() => {
    rt(), s == null || s();
  }, [s]), x = u.useCallback(() => b.requestClose(I), [b, I]), k = u.useCallback(() => {
    P((z) => {
      const G = !z;
      try {
        localStorage.setItem(Qe, String(G));
      } catch {
      }
      return G;
    });
  }, []), N = u.useMemo(
    () => xt(m.assignedCodes),
    [m.assignedCodes]
  ), F = Ce.find((z) => z.code === h) || N.find((z) => z.code === h) || N[0], K = u.useCallback(async () => {
    var z, G, V, H, O, y;
    if (!g.validate()) return !1;
    w(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(n, g.toUpdateDto())
      ), await p.invalidateQueries({ queryKey: ["task-detail", n] }), J.emitResult(), (V = (G = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : G.success) == null || V.call(G, "Görev başarıyla güncellendi."), !0;
    } catch (C) {
      return (y = (O = (H = window == null ? void 0 : window.abp) == null ? void 0 : H.notify) == null ? void 0 : O.error) == null || y.call(O, (C == null ? void 0 : C.message) || "Kaydedilemedi."), !1;
    } finally {
      w(!1);
    }
  }, [n, g, p]), W = u.useCallback(async () => {
    var z, G, V, H, O, y;
    if (window.confirm("Bu görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.delete(n)), (V = (G = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : G.info) == null || V.call(G, "Görev silindi."), b.markClean(), I();
      } catch (C) {
        (y = (O = (H = window == null ? void 0 : window.abp) == null ? void 0 : H.notify) == null ? void 0 : O.error) == null || y.call(O, (C == null ? void 0 : C.message) || "Görev silinemedi.");
      }
  }, [n, b, I]), Q = u.useCallback(async (z) => {
    var G, V, H, O, y, C;
    try {
      await m.addFeature(z), f(z), (H = (V = (G = window == null ? void 0 : window.abp) == null ? void 0 : G.notify) == null ? void 0 : V.success) == null || H.call(V, "Özellik başarıyla eklendi.");
    } catch (S) {
      (C = (y = (O = window == null ? void 0 : window.abp) == null ? void 0 : O.notify) == null ? void 0 : y.error) == null || C.call(y, (S == null ? void 0 : S.message) || "Özellik eklenemedi.");
    }
  }, [m]), U = o ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(ie, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(ie, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(ie, { className: "h-64 w-full" })
  ] }) : d ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(D, { variant: "ghost", onClick: () => c(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      Ns,
      {
        task: l,
        onClose: x,
        isFullscreen: T,
        onToggleFullscreen: k,
        presentation: a,
        onFieldChange: g.setField,
        statusValue: g.values.status,
        priorityValue: g.values.priority
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "overflow-y-auto max-h-[85vh] custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        ks,
        {
          task: l,
          assigneeOptions: j.options,
          onFieldChange: g.setField,
          statusValue: g.values.status,
          priorityValue: g.values.priority,
          assigneeValue: g.values.assigneeId
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "border-b border-subtle px-6 bg-surface-base", children: /* @__PURE__ */ e.jsx(
        Ss,
        {
          activeTab: h,
          onTabChange: f,
          visibleTabs: N,
          assignedCodes: m.assignedCodes,
          onAddFeature: Q,
          task: l
        }
      ) }),
      /* @__PURE__ */ e.jsx("div", { className: "p-6", children: h === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start", children: [
        /* @__PURE__ */ e.jsx("div", { className: "min-w-0 space-y-6", children: /* @__PURE__ */ e.jsx(
          As,
          {
            task: l,
            onFieldChange: g.setField
          }
        ) }),
        /* @__PURE__ */ e.jsx("div", { className: "w-full shrink-0", children: /* @__PURE__ */ e.jsx(
          Es,
          {
            task: l,
            onDelete: W,
            nameById: j.nameById
          }
        ) })
      ] }) : /* @__PURE__ */ e.jsx(u.Suspense, { fallback: /* @__PURE__ */ e.jsx(ie, { className: "h-48 w-full" }), children: F != null && F.component ? /* @__PURE__ */ e.jsx(
        F.component,
        {
          taskId: n,
          task: l,
          onOpenSubtask: i
        }
      ) : /* @__PURE__ */ e.jsxs("div", { className: "text-center py-12 text-text-tertiary border border-dashed border-subtle rounded-xl", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-person-digging text-4xl mb-4 opacity-50" }),
        /* @__PURE__ */ e.jsx("p", { children: "Bu sekme yapım aşamasında." })
      ] }) }) })
    ] }),
    /* @__PURE__ */ e.jsx(
      Is,
      {
        lastSavedAt: l == null ? void 0 : l.lastModificationTime,
        isDirty: b.isDirty,
        isSaving: v,
        onCancel: x,
        onSave: K
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsx("div", { className: "w-full max-w-6xl mx-auto my-6 rounded-2xl border border-subtle bg-surface-base shadow-sm overflow-hidden", children: U }) : /* @__PURE__ */ e.jsx(
    Je,
    {
      open: !0,
      onOpenChange: (z) => {
        z || x();
      },
      children: /* @__PURE__ */ e.jsx(
        Xe,
        {
          title: l != null && l.title ? `Görev Detayı: ${l.title}` : "Görev Detayı",
          fullscreen: T,
          className: "max-w-6xl p-0 overflow-hidden rounded-2xl border border-subtle shadow-2xl bg-surface-base",
          onInteractOutside: (z) => {
            z.preventDefault(), x();
          },
          onEscapeKeyDown: (z) => {
            z.preventDefault(), x();
          },
          children: U
        }
      )
    }
  );
}
function Rs() {
  var a;
  const t = u.useSyncExternalStore(
    J.subscribe,
    J.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsx(
    ft,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        J.close(), J.emitResult();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsx(
    ut,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        J.close(), J.emitResult();
      }
    },
    t
  ) }) : null;
}
function Ls() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v2" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : !(window.localStorage.getItem("apya.taskDetail.v2") === "0");
  } catch {
    return !0;
  }
}
function $s() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v3" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v2" || new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : window.localStorage.getItem("apya.taskDetail.v3") === "1" || !0;
  } catch {
    return !0;
  }
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = $s();
window.apya.taskDetailV2Enabled = Ls() && !window.apya.taskDetailV3Enabled;
const He = {
  open: (t) => {
    J.open(t);
  },
  close: () => J.close(),
  onResult: (t) => J.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(He) : window.apya.taskDetail = He;
function Ze() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = We(t), t._reactRoot.render(/* @__PURE__ */ e.jsx(Rs, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = at();
    a && J.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Ze) : Ze();
function Ps({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsx(
    ft,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsx(
    ut,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) });
}
const Re = document.getElementById("task-detail-page-island");
if (Re) {
  const t = Re.getAttribute("data-task-id");
  t && We(Re).render(/* @__PURE__ */ e.jsx(Ps, { taskId: t }));
}
