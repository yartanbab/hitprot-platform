import { j as e, r as x, d as fe, a as ht, b as We } from "./react-vendor.js";
/* empty css      */
import { a as Ne } from "./QueryProvider.js";
import { u as te, a as se, b as le } from "./query-vendor.js";
import { D as Je, l as Xe, e as ke, B as D, I as me, S as ce } from "./Dialog.js";
import { C as yt } from "./Combobox.js";
import { r as gt } from "./httpClient.js";
import { R as ae, T as re, P as ie, C as ne, A as vt } from "./ui-vendor.js";
function jt({
  open: t,
  onRequestClose: s,
  fullscreen: a,
  title: r,
  header: n,
  footer: i,
  children: l
}) {
  return /* @__PURE__ */ e.jsx(
    Je,
    {
      open: t,
      onOpenChange: (o) => {
        o || s();
      },
      children: /* @__PURE__ */ e.jsx(
        Xe,
        {
          title: r,
          fullscreen: a,
          onInteractOutside: (o) => {
            o.preventDefault(), s();
          },
          onEscapeKeyDown: (o) => {
            o.preventDefault(), s();
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
function wt({ title: t, header: s, footer: a, children: r }) {
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "flex h-full min-h-[calc(100vh-120px)] flex-col rounded-xl border border-default bg-surface-elevated shadow-sm",
      "aria-label": t,
      children: /* @__PURE__ */ e.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
        s,
        /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: r }),
        a
      ] })
    }
  );
}
function Nt({ isPrivate: t }) {
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
}, $e = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function kt({
  task: t,
  canDelete: s,
  onClose: a,
  onDelete: r,
  onToggleFullscreen: n,
  fullscreen: i = !1
}) {
  const [l, o] = x.useState(!1), d = x.useRef(null);
  x.useEffect(() => {
    if (!l) return;
    const w = (h) => {
      d.current && !d.current.contains(h.target) && o(!1);
    }, p = (h) => {
      h.key === "Escape" && o(!1);
    };
    return document.addEventListener("mousedown", w), document.addEventListener("keydown", p), () => {
      document.removeEventListener("mousedown", w), document.removeEventListener("keydown", p);
    };
  }, [l]);
  const c = ye[t == null ? void 0 : t.status] ?? ye[1], m = $e[t == null ? void 0 : t.priority] ?? $e[2], f = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), o(!1);
  }, g = () => {
    var p, h, u, v;
    const w = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (p = navigator.clipboard) == null || p.writeText(w), (v = (u = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : u.info) == null || v.call(u, "Bağlantı kopyalandı."), o(!1);
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
        /* @__PURE__ */ e.jsx(ke, { variant: m.variant, children: m.text }),
        /* @__PURE__ */ e.jsx(Nt, { isPrivate: t == null ? void 0 : t.isPrivate })
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
      /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: d, children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": l,
            onClick: () => o((w) => !w),
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
                  onClick: f,
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
              s && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
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
          onClick: a,
          className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] })
  ] }) });
}
const Ct = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function Tt({ lastSavedAt: t, isDirty: s, isSaving: a, onCancel: r, onSave: n }) {
  const i = Ct(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: i ? `Son kayıt: ${i}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(D, { variant: "secondary", onClick: r, disabled: a, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        D,
        {
          variant: "primary",
          onClick: () => n == null ? void 0 : n(),
          disabled: !s || !n,
          isLoading: a,
          loadingText: "Kaydediliyor…",
          children: "Kaydet"
        }
      )
    ] })
  ] }) });
}
const Ge = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Dt = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function oe({ label: t, htmlFor: s, error: a, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: s, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    a && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: a })
  ] });
}
function St({ value: t, onChange: s }) {
  const [a, r] = x.useState(""), n = () => {
    const i = a.trim();
    i && !t.includes(i) && s([...t, i]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((i) => /* @__PURE__ */ e.jsxs(ke, { variant: "neutral", children: [
      i,
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${i} etiketini kaldır`,
          onClick: () => s(t.filter((l) => l !== i)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, i)) }),
    /* @__PURE__ */ e.jsx(
      me,
      {
        value: a,
        onChange: (i) => r(i.target.value),
        onKeyDown: (i) => {
          i.key === "Enter" || i.key === "," ? (i.preventDefault(), n()) : i.key === "Backspace" && !a && t.length && s(t.slice(0, -1));
        },
        onBlur: n,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function Et({
  values: t,
  errors: s,
  onFieldChange: a,
  assigneeOptions: r = [],
  isLoadingAssignees: n = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(oe, { label: "Başlık", htmlFor: "task-title", error: s.title, children: /* @__PURE__ */ e.jsx(
      me,
      {
        id: "task-title",
        value: t.title,
        onChange: (i) => a("title", i.target.value),
        invalid: !!s.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(oe, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (i) => a("status", Number(i.target.value)),
          className: Ge,
          children: Object.entries(ye).map(([i, l]) => /* @__PURE__ */ e.jsx("option", { value: i, children: l.text }, i))
        }
      ) }),
      /* @__PURE__ */ e.jsx(oe, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (i) => a("priority", Number(i.target.value)),
          className: Ge,
          children: Object.entries($e).map(([i, l]) => /* @__PURE__ */ e.jsx("option", { value: i, children: l.text }, i))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(oe, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      yt,
      {
        id: "task-assignee",
        options: r,
        value: t.assigneeId,
        onChange: (i) => a("assigneeId", i),
        placeholder: n ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: n
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(oe, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: s.startDate, children: /* @__PURE__ */ e.jsx(
        me,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (i) => a("startDate", i.target.value),
          invalid: !!s.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(oe, { label: "Son Tarih", htmlFor: "task-due", error: s.dueDate, children: /* @__PURE__ */ e.jsx(
        me,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (i) => a("dueDate", i.target.value),
          invalid: !!s.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(oe, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(St, { value: t.tagNames, onChange: (i) => a("tagNames", i) }) }),
    /* @__PURE__ */ e.jsx(oe, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (i) => a("description", i.target.value),
        className: Dt
      }
    ) })
  ] });
}
const Fe = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function he({ label: t, value: s }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: s ?? "—" })
  ] });
}
function zt({ task: t, creatorName: s, lastModifierName: a }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(he, { label: "Oluşturan", value: s }),
      /* @__PURE__ */ e.jsx(he, { label: "Oluşturulma zamanı", value: Fe(t.creationTime) }),
      /* @__PURE__ */ e.jsx(he, { label: "Güncelleyen", value: a }),
      /* @__PURE__ */ e.jsx(he, { label: "Son güncelleme zamanı", value: Fe(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(he, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const At = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", It = "border-brand-500 text-text-primary";
function Pt({ tabs: t, activeCode: s, onSelect: a, onOpenPicker: r, pickerOpen: n }) {
  const i = x.useRef(/* @__PURE__ */ new Map()), l = (d) => {
    var c;
    a(d.code), (c = i.current.get(d.code)) == null || c.focus();
  }, o = (d, c) => {
    d.key === "ArrowRight" ? (d.preventDefault(), l(t[(c + 1) % t.length])) : d.key === "ArrowLeft" ? (d.preventDefault(), l(t[(c - 1 + t.length) % t.length])) : d.key === "Home" ? (d.preventDefault(), l(t[0])) : d.key === "End" && (d.preventDefault(), l(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((d, c) => {
      const m = d.code === s;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (f) => {
            f ? i.current.set(d.code, f) : i.current.delete(d.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${d.code}`,
          "aria-selected": m,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: m ? 0 : -1,
          onClick: () => a(d.code),
          onKeyDown: (f) => o(f, c),
          className: `${At} ${m ? It : ""}`,
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
        onClick: r,
        className: "mx-1 grid h-8 w-8 flex-none place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" })
      }
    )
  ] });
}
const $t = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Lt({ entries: t, onAdd: s, onRemove: a, busyCode: r }) {
  const [n, i] = x.useState(""), l = x.useMemo(() => {
    const o = n.trim().toLocaleLowerCase("tr-TR"), d = o ? t.filter((m) => m.title.toLocaleLowerCase("tr-TR").includes(o)) : t, c = /* @__PURE__ */ new Map();
    return d.forEach((m) => {
      const f = c.get(m.category) ?? [];
      f.push(m), c.set(m.category, f);
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
            onChange: (o) => i(o.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          l.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...l.entries()].map(([o, d]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: $t[o] ?? o }),
            d.map((c) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa ${c.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: c.title }),
              !c.implemented && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              c.implemented && !c.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === c.code,
                  onClick: () => s(c.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              c.implemented && c.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === c.code,
                  onClick: () => a(c.code),
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
function Rt({ trail: t = [], current: s, onNavigate: a }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((r) => /* @__PURE__ */ e.jsxs(fe.Fragment, { children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => a == null ? void 0 : a(r.id),
          className: "hover:underline hover:text-text-primary",
          children: r.title
        }
      ),
      /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "/" })
    ] }, r.id)),
    /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary", children: s.title })
  ] });
}
function Gt(t) {
  var a, r, n;
  const s = (n = (r = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : r.tasks) == null ? void 0 : n.task;
  return s ? Promise.resolve(s.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function et(t) {
  return te({
    queryKey: ["task-detail", t],
    queryFn: () => Gt(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function tt(t) {
  var s, a, r;
  return !!((r = (a = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.auth) == null ? void 0 : a.isGranted) != null && r.call(a, t));
}
function st() {
  const [t, s] = x.useState(!1), [a, r] = x.useState(!1), n = x.useRef(null), i = x.useCallback(() => s(!0), []), l = x.useCallback(() => s(!1), []);
  x.useEffect(() => {
    if (!t) return;
    const c = (m) => {
      m.preventDefault(), m.returnValue = "";
    };
    return window.addEventListener("beforeunload", c), () => window.removeEventListener("beforeunload", c);
  }, [t]);
  const o = x.useCallback((c) => {
    if (!t) {
      c == null || c();
      return;
    }
    n.current = c ?? null, r(!0);
  }, [t]), d = x.useCallback((c) => {
    const m = n.current;
    return r(!1), n.current = null, c === "discard" && (s(!1), m == null || m()), c === "save" ? m : null;
  }, []);
  return { isDirty: t, markDirty: i, markClean: l, requestClose: o, pendingClose: a, resolvePendingClose: d };
}
const Ft = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, Re = "task";
function at() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(Re);
  return t && Ft.test(t) ? t : null;
}
function rt() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(Re), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function it(t, s) {
  const a = x.useRef(s);
  a.current = s, x.useEffect(() => {
    if (!t || at() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(Re, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), x.useEffect(() => {
    const r = () => {
      var n;
      (n = a.current) == null || n.call(a);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const Kt = {
  title: "",
  description: "",
  startDate: "",
  dueDate: "",
  status: 1,
  priority: 2,
  assigneeId: null,
  tagNames: [],
  isPrivate: !1,
  projectId: null
};
function Bt(t) {
  return t ? {
    title: t.title ?? "",
    description: t.description ?? "",
    startDate: t.startDate ? t.startDate.slice(0, 10) : "",
    dueDate: t.dueDate ? t.dueDate.slice(0, 10) : "",
    status: t.status ?? 1,
    priority: t.priority ?? 2,
    assigneeId: t.assigneeId ?? null,
    tagNames: (t.tags ?? []).map((s) => s.name),
    isPrivate: !!t.isPrivate,
    projectId: t.projectId ?? null
  } : Kt;
}
function nt(t) {
  const [s, a] = x.useState(t == null ? void 0 : t.id), r = x.useMemo(() => Bt(t), [t]), [n, i] = x.useState(r), [l, o] = x.useState({});
  (t == null ? void 0 : t.id) !== s && (a(t == null ? void 0 : t.id), i(r), o({}));
  const d = x.useCallback((w, p) => {
    i((h) => ({ ...h, [w]: p }));
  }, []), c = x.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(r),
    [n, r]
  ), m = x.useCallback(() => {
    const w = {};
    return n.title.trim() || (w.title = "Başlık zorunlu."), n.startDate || (w.startDate = "Başlangıç tarihi zorunlu."), n.dueDate && n.startDate && n.dueDate < n.startDate && (w.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), o(w), Object.keys(w).length === 0;
  }, [n]), f = x.useCallback(() => ({
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
    tagNames: n.tagNames
  }), [n, t]), g = x.useCallback(() => {
    i(r), o({});
  }, [r]);
  return { values: n, setField: d, isDirty: c, errors: l, validate: m, toUpdateDto: f, reset: g };
}
function Ke(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function Mt() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function lt() {
  var n;
  const t = te({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Mt,
    staleTime: 3e5,
    retry: !1
  }), s = ((n = t.data) == null ? void 0 : n.items) ?? [], a = s.map((i) => ({ value: i.id, label: Ke(i) })), r = new Map(s.map((i) => [i.id, Ke(i)]));
  return { options: a, nameById: r, isLoading: t.isLoading };
}
function Le() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Ot(t) {
  const s = Le();
  return s ? Promise.resolve(s.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ot(t) {
  const s = se(), a = ["task-features", t], r = te({
    queryKey: a,
    queryFn: () => Ot(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => s.invalidateQueries({ queryKey: a }), i = le({
    mutationFn: (o) => Promise.resolve(Le().addFeature(t, o)),
    onSuccess: n
  }), l = le({
    mutationFn: (o) => Promise.resolve(Le().removeFeature(t, o)),
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
function Yt({ taskId: t, task: s, onOpenSubtask: a }) {
  const [r, n] = x.useState(""), [i, l] = x.useState(!1), [o, d] = x.useState(null), c = se(), m = (s == null ? void 0 : s.subTasks) ?? [], f = () => c.invalidateQueries({ queryKey: ["task-detail", t] }), g = async () => {
    var h, u, v;
    const p = r.trim();
    if (p) {
      l(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: p,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: s == null ? void 0 : s.projectId
        })), n(""), await f();
      } catch (N) {
        (v = (u = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : u.error) == null || v.call(u, (N == null ? void 0 : N.message) || "Alt görev eklenemedi.");
      } finally {
        l(!1);
      }
    }
  }, w = async (p) => {
    var h, u, v;
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(p)), await f();
    } catch (N) {
      (v = (u = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : u.error) == null || v.call(u, (N == null ? void 0 : N.message) || "Alt görev silinemedi.");
    } finally {
      d(null);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        me,
        {
          value: r,
          onChange: (p) => n(p.target.value),
          onKeyDown: (p) => {
            p.key === "Enter" && g();
          },
          placeholder: "Yeni alt görev başlığı",
          disabled: i
        }
      ),
      /* @__PURE__ */ e.jsx(D, { variant: "secondary", onClick: g, disabled: i || !r.trim(), children: "Alt Görev Ekle" })
    ] }),
    m.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz alt görev yok." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: m.map((p) => {
      var h, u;
      return /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between py-2", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => a == null ? void 0 : a(p.id, p.title),
            className: "text-left text-sm font-medium text-text-primary hover:underline",
            children: p.title
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(ke, { variant: ((h = ye[p.status]) == null ? void 0 : h.variant) ?? "neutral", children: ((u = ye[p.status]) == null ? void 0 : u.text) ?? p.status }),
          o === p.id ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary", children: "Emin misiniz?" }),
            /* @__PURE__ */ e.jsx(D, { variant: "destructive", onClick: () => w(p.id), children: "Evet, sil" }),
            /* @__PURE__ */ e.jsx(D, { variant: "ghost", onClick: () => d(null), children: "Vazgeç" })
          ] }) : /* @__PURE__ */ e.jsx(D, { variant: "ghost", onClick: () => d(p.id), "aria-label": `${p.title} alt görevini sil`, children: "Sil" })
        ] })
      ] }, p.id);
    }) })
  ] });
}
function ct() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function qt(t) {
  const s = ct();
  return s ? Promise.resolve(s.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function Vt(t, s) {
  const a = new FormData();
  a.append("file", s);
  const r = {}, n = gt();
  n && (r.RequestVerificationToken = n);
  const i = await fetch(`/api/tasks/attachments/upload/${t}`, {
    method: "POST",
    credentials: "include",
    headers: r,
    body: a
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
function _t(t) {
  const s = se(), a = ["task-attachments", t], r = te({
    queryKey: a,
    queryFn: () => qt(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => s.invalidateQueries({ queryKey: a }), i = le({
    mutationFn: (o) => Vt(t, o),
    onSuccess: n
  }), l = le({
    mutationFn: (o) => Promise.resolve(ct().deleteAttachment(o)),
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
function Ut(t) {
  return `${Math.round(t / 1024)} KB`;
}
function Qt({ taskId: t }) {
  const { attachments: s, upload: a, remove: r, isUploading: n } = _t(t), i = x.useRef(null), l = async (d) => {
    var m, f, g, w, p, h, u;
    const c = (m = d.target.files) == null ? void 0 : m[0];
    if (c)
      try {
        await a(c), (w = (g = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : g.success) == null || w.call(g, "Dosya yüklendi.");
      } catch (v) {
        (u = (h = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : h.error) == null || u.call(h, (v == null ? void 0 : v.message) || "Dosya yüklenemedi.");
      } finally {
        i.current && (i.current.value = "");
      }
  }, o = async (d, c) => {
    var m, f, g;
    try {
      await r(d);
    } catch (w) {
      (g = (f = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : f.error) == null || g.call(f, (w == null ? void 0 : w.message) || `${c} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("input", { ref: i, type: "file", onChange: l, className: "text-sm", disabled: n }),
      n && /* @__PURE__ */ e.jsx("span", { className: "text-sm text-text-tertiary", children: "Yükleniyor…" })
    ] }),
    s.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: s.map((d) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between py-2", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("a", { href: d.downloadUrl, target: "_blank", rel: "noreferrer", className: "text-sm font-medium text-text-primary hover:underline", children: d.fileName }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-text-tertiary", children: [
          Ut(d.fileSize),
          " — ",
          d.uploaderName
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(D, { variant: "ghost", onClick: () => o(d.id, d.fileName), "aria-label": `${d.fileName} dosyasini sil`, children: "Sil" })
    ] }, d.id)) })
  ] });
}
function je() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Ht(t) {
  const s = je();
  return s ? Promise.resolve(s.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function dt(t) {
  const s = se(), a = ["task-checklist", t], r = te({
    queryKey: a,
    queryFn: () => Ht(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => s.invalidateQueries({ queryKey: a }), i = le({
    mutationFn: (d) => Promise.resolve(je().addChecklistItem(t, d)),
    onSuccess: n
  }), l = le({
    mutationFn: (d) => Promise.resolve(je().toggleChecklistItem(d)),
    onSuccess: n
  }), o = le({
    mutationFn: (d) => Promise.resolve(je().deleteChecklistItem(d)),
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
function Zt({ taskId: t }) {
  const { items: s, addItem: a, toggleItem: r, removeItem: n } = dt(t), [i, l] = x.useState(""), o = async () => {
    var f, g, w;
    const m = i.trim();
    if (m)
      try {
        await a(m), l("");
      } catch (p) {
        (w = (g = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : g.error) == null || w.call(g, (p == null ? void 0 : p.message) || "Madde eklenemedi.");
      }
  }, d = async (m) => {
    var f, g, w;
    try {
      await r(m);
    } catch (p) {
      (w = (g = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : g.error) == null || w.call(g, (p == null ? void 0 : p.message) || "Madde güncellenemedi.");
    }
  }, c = async (m, f) => {
    var g, w, p;
    try {
      await n(m);
    } catch (h) {
      (p = (w = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : w.error) == null || p.call(w, (h == null ? void 0 : h.message) || `${f} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        me,
        {
          value: i,
          onChange: (m) => l(m.target.value),
          onKeyDown: (m) => {
            m.key === "Enter" && o();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ e.jsx(D, { variant: "secondary", onClick: o, disabled: !i.trim(), children: "Ekle" })
    ] }),
    s.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz madde eklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "space-y-1.5", children: s.map((m) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-2 py-1", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: m.isDone,
            onChange: () => d(m.id)
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: m.isDone ? "text-text-tertiary line-through" : "text-text-primary", children: m.text })
      ] }),
      /* @__PURE__ */ e.jsx(D, { variant: "ghost", onClick: () => c(m.id, m.text), "aria-label": `${m.text} maddesini sil`, children: "Sil" })
    ] }, m.id)) })
  ] });
}
function Wt({ taskId: t, task: s }) {
  const [a, r] = x.useState(""), [n, i] = x.useState(null), [l, o] = x.useState(""), [d, c] = x.useState(!1), m = se(), f = (s == null ? void 0 : s.comments) ?? [], g = async (p) => {
    var h, u, v, N, T, B;
    if (p == null || p.preventDefault(), !(!a.trim() || d)) {
      c(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, a.trim())
        ), r(""), m.invalidateQueries({ queryKey: ["task-detail", t] }), (v = (u = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : u.success) == null || v.call(u, "Yorum eklendi.");
      } catch (M) {
        (B = (T = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : T.error) == null || B.call(T, (M == null ? void 0 : M.message) || "Yorum eklenemedi.");
      } finally {
        c(!1);
      }
    }
  }, w = async (p) => {
    var h, u, v, N, T, B;
    if (!(!l.trim() || d)) {
      c(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(p, l.trim())
        ), o(""), i(null), m.invalidateQueries({ queryKey: ["task-detail", t] }), (v = (u = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : u.success) == null || v.call(u, "Yanıt eklendi.");
      } catch (M) {
        (B = (T = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : T.error) == null || B.call(T, (M == null ? void 0 : M.message) || "Yanıt eklenemedi.");
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
          value: a,
          onChange: (p) => r(p.target.value),
          placeholder: "Bir yorum veya güncelleme yazın...",
          className: "w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ e.jsx(
        D,
        {
          type: "submit",
          variant: "primary",
          disabled: !a.trim() || d,
          isLoading: d,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    f.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: f.map((p) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: p.creatorUserName || p.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: p.creationTime ? new Date(p.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: p.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        D,
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
            onChange: (h) => o(h.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(D, { variant: "ghost", size: "sm", onClick: () => i(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(D, { variant: "primary", size: "sm", disabled: !l.trim() || d, onClick: () => w(p.id), children: "Gönder" })
        ] })
      ] }),
      p.replies && p.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: p.replies.map((h) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: h.creatorUserName || h.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: h.creationTime ? new Date(h.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: h.text })
      ] }, h.id)) })
    ] }, p.id)) })
  ] });
}
function Jt({ task: t }) {
  const s = [];
  return t != null && t.creationTime && s.push({
    id: "created",
    type: "create",
    icon: "fa-plus",
    title: "Görev oluşturuldu",
    user: t.creatorUserName || t.creatorName || "Sistem / Kullanıcı",
    time: new Date(t.creationTime).toLocaleString("tr-TR")
  }), t != null && t.lastModificationTime && s.push({
    id: "modified",
    type: "update",
    icon: "fa-pen",
    title: "Görev güncellendi",
    user: t.lastModifierUserName || t.lastModifierName || "Kullanıcı",
    time: new Date(t.lastModificationTime).toLocaleString("tr-TR")
  }), t != null && t.attachments && t.attachments.length > 0 && s.push({
    id: "files",
    type: "file",
    icon: "fa-paperclip",
    title: `${t.attachments.length} dosya eki mevcut`,
    user: "Sistem",
    time: ""
  }), /* @__PURE__ */ e.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx("h4", { className: "text-sm font-semibold text-text-primary", children: "Aktivite Zaman Çizelgesi" }),
    s.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Aktivite kaydı bulunamadı." }) : /* @__PURE__ */ e.jsx("div", { className: "relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-subtle", children: s.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "relative flex items-start justify-between gap-3 text-xs", children: [
      /* @__PURE__ */ e.jsx("span", { className: "absolute -left-6 flex h-4 w-4 items-center justify-center rounded-full bg-surface-raised text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: `fa ${a.icon} text-[10px]`, "aria-hidden": "true" }) }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("p", { className: "font-medium text-text-primary", children: a.title }),
        a.user && /* @__PURE__ */ e.jsxs("span", { className: "text-text-tertiary", children: [
          "Yapan: ",
          a.user
        ] })
      ] }),
      a.time && /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary whitespace-nowrap", children: a.time })
    ] }, a.id)) })
  ] });
}
function Xt({ task: t }) {
  const s = [
    { label: "Görev ID", value: (t == null ? void 0 : t.id) || "-" },
    { label: "Oluşturan", value: (t == null ? void 0 : t.creatorUserName) || (t == null ? void 0 : t.creatorName) || "Bilinmiyor" },
    { label: "Oluşturulma Tarihi", value: t != null && t.creationTime ? new Date(t.creationTime).toLocaleString("tr-TR") : "-" },
    { label: "Son Güncelleyen", value: (t == null ? void 0 : t.lastModifierUserName) || (t == null ? void 0 : t.lastModifierName) || "Henüz güncellenmedi" },
    { label: "Son Güncelleme Tarihi", value: t != null && t.lastModificationTime ? new Date(t.lastModificationTime).toLocaleString("tr-TR") : "-" },
    { label: "Proje ID", value: (t == null ? void 0 : t.projectId) || "Genel Projesiz Görev" }
  ];
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsx("h4", { className: "text-sm font-semibold text-text-primary", children: "Teknik Audit & Değişiklik Geçmişi" }),
    /* @__PURE__ */ e.jsx("div", { className: "rounded-lg border border-default divide-y divide-border-subtle bg-surface-elevated", children: s.map((a, r) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between p-3 text-xs", children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: a.label }),
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-text-primary", children: a.value })
    ] }, r)) })
  ] });
}
function ge(t, s) {
  const a = s || "TRY";
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: a, minimumFractionDigits: 2 }).format(t || 0);
  } catch {
    return `${(t || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${a}`.trim();
  }
}
function es(t) {
  if (!t) return "";
  const s = new Date(t);
  return isNaN(s.getTime()) ? "" : new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(s);
}
function ts({ task: t }) {
  const s = (t == null ? void 0 : t.expenses) || [], a = (t == null ? void 0 : t.incomes) || [];
  if (s.length === 0 && a.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 border-b border-subtle pb-4 mb-4", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-coins text-success text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Görev Finansı" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)." })
    ] });
  const n = Array.from(new Set([...s, ...a].map((l) => l.currency || "TRY"))).map((l) => {
    const o = a.filter((c) => (c.currency || "TRY") === l).reduce((c, m) => c + (m.amount || 0), 0), d = s.filter((c) => (c.currency || "TRY") === l).reduce((c, m) => c + (m.amount || 0), 0);
    return { cur: l, inc: o, exp: d, net: o - d };
  }), i = [
    ...a.map((l) => ({ ...l, kind: "income" })),
    ...s.map((l) => ({ ...l, kind: "expense" }))
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
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col divide-y divide-subtle/50 rounded-xl border border-subtle overflow-hidden", children: i.map((l) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-3.5 py-2.5 bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
        /* @__PURE__ */ e.jsx("span", { className: `flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${l.kind === "income" ? "text-success bg-success-subtle" : "text-negative bg-negative-subtle"}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l.kind === "income" ? "fa-plus" : "fa-minus"}` }) }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-medium text-text-primary truncate", children: l.title || (l.kind === "income" ? "Gelir" : "Gider") }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: es(l.date) })
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
const ss = { 0: 0, 1: 0, 2: 50, 3: 75, 4: 100 }, as = { 0: "bg-neutral-400", 1: "bg-text-tertiary", 2: "bg-warning", 3: "bg-primary", 4: "bg-success" };
function Te(t) {
  if (!t) return null;
  const s = new Date(t);
  return isNaN(s.getTime()) ? null : s;
}
function Be(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
}
function rs({ task: t = {} }) {
  const s = x.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((i, l) => ({
    id: i.id || `row-${l}`,
    name: i.title || "Başlıksız görev",
    isMain: !!i.__main,
    start: Te(i.startDate),
    end: Te(i.dueDate) || Te(i.completedDate),
    status: i.status ?? 1
  })), [t]), { min: a, span: r } = x.useMemo(() => {
    const n = s.flatMap((o) => [o.start, o.end]).filter(Boolean).map((o) => o.getTime());
    if (n.length === 0) return { min: null, span: 0 };
    const i = Math.min(...n), l = Math.max(...n);
    return { min: i, span: Math.max(1, l - i) };
  }, [s]);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-bars-staggered text-primary text-base" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Gantt Zaman Çizelgesi" })
    ] }),
    a === null ? /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Zaman çizelgesi için görevde veya alt görevlerde başlangıç–bitiş tarihi tanımlı olmalı." }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: s.map((n) => {
      const i = n.start ? n.start.getTime() : a, l = n.end ? Math.max(n.end.getTime(), i) : i, o = (i - a) / r * 100, d = Math.max(2, (l - i) / r * 100), c = ss[n.status] ?? 0, m = as[n.status] || "bg-primary";
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
              /* @__PURE__ */ e.jsx("div", { className: `absolute top-0 h-full ${m} rounded-full opacity-30`, style: { left: `${o}%`, width: `${d}%` } }),
              /* @__PURE__ */ e.jsx("div", { className: `absolute top-0 h-full ${m} rounded-full`, style: { left: `${o}%`, width: `${d * c / 100}%` } })
            ] })
          ]
        },
        n.id
      );
    }) })
  ] });
}
const is = {
  0: { label: "İptal", cls: "text-text-secondary bg-neutral-subtle" },
  1: { label: "Bekliyor", cls: "text-text-secondary bg-neutral-subtle" },
  2: { label: "Sürüyor", cls: "text-warning bg-warning-subtle" },
  3: { label: "Testte", cls: "text-primary bg-primary-subtle" },
  4: { label: "Tamamlandı", cls: "text-success bg-success-subtle" }
};
function ns({ task: t = {} }) {
  const s = (i) => {
    var l, o, d;
    return (d = (o = (l = window == null ? void 0 : window.apya) == null ? void 0 : l.taskDetail) == null ? void 0 : o.open) == null ? void 0 : d.call(o, i);
  }, a = t.predecessorIds || [], { data: r = [], isLoading: n } = te({
    queryKey: ["task-predecessors", t.id, a],
    queryFn: async () => {
      var l, o, d;
      const i = (d = (o = (l = window == null ? void 0 : window.apya) == null ? void 0 : l.platform) == null ? void 0 : o.tasks) == null ? void 0 : d.task;
      return i ? Promise.all(
        a.map(
          (c) => Promise.resolve(i.get(c)).catch(() => ({ id: c, title: "(erişilemeyen görev)", status: null }))
        )
      ) : [];
    },
    enabled: a.length > 0,
    staleTime: 3e4,
    retry: !1
  });
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link text-primary text-base" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Öncül Görevler (Bağımlılıklar)" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : n ? /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Yükleniyor…" }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col divide-y divide-subtle/50", children: r.map((i) => {
      const l = is[i.status] || null;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => s(i.id),
          className: "flex items-center justify-between py-3.5 hover:bg-surface-hover/50 px-2 rounded-lg transition-colors text-left",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-diagram-predecessor text-text-tertiary text-xs shrink-0" }),
              /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: i.title || "Başlıksız görev" })
            ] }),
            l && /* @__PURE__ */ e.jsx("span", { className: `text-xs font-semibold px-2.5 py-0.5 rounded-md shrink-0 ${l.cls}`, children: l.label })
          ]
        },
        i.id
      );
    }) })
  ] });
}
function pe() {
  var t, s, a;
  return ((a = (s = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : s.tasks) == null ? void 0 : a.task) || null;
}
function ls(t) {
  const s = se(), a = ["task-timelogs", t], r = ["task-active-timelog"], n = te({
    queryKey: a,
    queryFn: () => {
      var c;
      return Promise.resolve((c = pe()) == null ? void 0 : c.getTimeLogs(t));
    },
    enabled: !!t && !!pe(),
    staleTime: 15e3,
    retry: !1
  }), i = te({
    queryKey: r,
    queryFn: () => {
      var c;
      return Promise.resolve((c = pe()) == null ? void 0 : c.getActiveTimeLog());
    },
    enabled: !!pe(),
    staleTime: 5e3,
    retry: !1
  }), l = () => {
    s.invalidateQueries({ queryKey: a }), s.invalidateQueries({ queryKey: r });
  }, o = le({
    mutationFn: () => {
      var c;
      return Promise.resolve((c = pe()) == null ? void 0 : c.startTimeTracking(t));
    },
    onSuccess: l
  }), d = le({
    mutationFn: () => {
      var c;
      return Promise.resolve((c = pe()) == null ? void 0 : c.stopTimeTracking(t));
    },
    onSuccess: l
  });
  return {
    logs: n.data ?? [],
    isLoading: n.isLoading,
    activeLog: i.data ?? null,
    start: o.mutateAsync,
    stop: d.mutateAsync,
    isMutating: o.isPending || d.isPending
  };
}
function os() {
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
function cs() {
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
function ds(t) {
  const s = Math.max(0, Math.floor(t));
  return `${De(Math.floor(s / 3600))}:${De(Math.floor(s % 3600 / 60))}:${De(s % 60)}`;
}
function Me(t) {
  const s = Math.max(0, Math.floor(t)), a = Math.floor(s / 3600), r = Math.floor(s % 3600 / 60);
  return a > 0 ? `${a}s ${r}dk` : r > 0 ? `${r}dk ${s % 60}sn` : `${s % 60}sn`;
}
function Oe(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function xs({ taskId: t }) {
  const s = ls(t), a = s.activeLog && s.activeLog.taskId === t ? s.activeLog : null, [r, n] = x.useState(() => Date.now());
  x.useEffect(() => {
    if (!a) return;
    const c = setInterval(() => n(Date.now()), 1e3);
    return () => clearInterval(c);
  }, [a]);
  const i = a ? Math.max(0, Math.floor((r - new Date(a.startTime).getTime()) / 1e3)) : 0, o = s.logs.reduce((c, m) => c + (m.secondsSpent || 0), 0) + i, d = async () => {
    var c, m, f;
    try {
      a ? await s.stop() : await s.start();
    } catch (g) {
      (f = (m = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : m.error) == null || f.call(m, (g == null ? void 0 : g.message) || "Zaman takibi güncellenemedi.");
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
          variant: a ? "destructive" : "primary",
          icon: a ? "fa-stop" : "fa-play",
          onClick: d,
          disabled: s.isMutating,
          isLoading: s.isMutating,
          children: a ? "Sayacı Durdur" : "Süre Başlat"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "p-4 rounded-xl bg-surface-sunken/40 border border-subtle flex flex-col gap-1", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-text-tertiary uppercase", children: "Toplam Harcanan Süre" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-2xl font-bold text-primary", children: Me(o) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: `p-4 rounded-xl border flex flex-col gap-1 ${a ? "bg-success-subtle/30 border-success/30" : "bg-surface-sunken/40 border-subtle"}`, children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-text-tertiary uppercase", children: "Aktif Sayaç" }),
        /* @__PURE__ */ e.jsx("span", { className: `text-2xl font-bold font-mono ${a ? "text-success" : "text-text-tertiary"}`, children: a ? ds(i) : "00:00:00" })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ e.jsx("h4", { className: "text-[13px] font-bold text-text-secondary", children: "Kayıtlar" }),
      s.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Yükleniyor…" }) : s.logs.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Henüz zaman kaydı yok. “Süre Başlat” ile sayacı çalıştırın." }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col divide-y divide-subtle/50 rounded-xl border border-subtle overflow-hidden", children: s.logs.map((c) => {
        const m = !c.endTime;
        return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-3.5 py-2.5 bg-surface-base", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0", children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: c.userName || "Kullanıcı" }),
            /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary font-mono", children: [
              Oe(c.startTime),
              " → ",
              m ? "sürüyor" : Oe(c.endTime)
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: `text-[12px] font-bold px-2 py-0.5 rounded-md ${m ? "text-success bg-success-subtle" : "text-text-secondary bg-surface-sunken"}`, children: m ? "Aktif" : Me(c.secondsSpent || 0) })
        ] }, c.id);
      }) })
    ] })
  ] });
}
function us() {
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
function ms() {
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
function ps() {
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
function fs() {
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
function bs() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-image text-indigo-600 text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Görsel Dosya Galerisi" })
      ] }),
      /* @__PURE__ */ e.jsx(D, { size: "sm", variant: "outline", icon: "fa-upload", children: "Görsel Yükle" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-3 gap-3", children: ["Otel_Lobi.jpg", "Oda_Tasarim.jpg", "Sozlesme_Imza.jpg"].map((t, s) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 p-2 rounded-xl border border-subtle bg-surface-sunken/40 items-center text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "h-20 w-full bg-surface-base rounded-lg flex items-center justify-center text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-image text-2xl" }) }),
      /* @__PURE__ */ e.jsx("span", { className: "text-xs font-medium text-text-primary truncate w-full mt-1", children: t })
    ] }, s)) })
  ] });
}
function hs() {
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
    component: Yt
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
    component: Qt
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
    component: Zt
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
    component: rs
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
    component: ns
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
    component: ts
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
    component: Xt
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
    component: Jt
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
    component: Wt
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
    component: os
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
    component: cs
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
    component: xs
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
    component: hs
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
    component: us
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
    component: ms
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
    component: ps
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
    component: fs
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
    component: bs
  }
];
function xt(t = []) {
  const s = new Set(t);
  return Ce.filter((a) => a.implemented && (a.isCore || s.has(a.code))).sort((a, r) => a.order - r.order);
}
function ys(t = []) {
  const s = new Set(t);
  return Ce.filter((a) => !a.isCore).filter((a) => !a.permission || tt(a.permission)).map((a) => ({ ...a, isAssigned: s.has(a.code) })).sort((a, r) => a.order - r.order);
}
let ve = null;
const we = /* @__PURE__ */ new Set(), Se = /* @__PURE__ */ new Set();
function Ye() {
  we.forEach((t) => t());
}
function gs(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const J = {
  open(t) {
    const s = gs(t);
    s && (ve = s, Ye());
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
function ut({ taskId: t, presentation: s = "modal", onClose: a }) {
  const [r, n] = x.useState(t), [i, l] = x.useState([]), { data: o, isLoading: d, isError: c, refetch: m } = et(r), f = st(), g = nt(o), w = lt(), p = ot(r), [h, u] = x.useState("general"), [v, N] = x.useState(!1), T = fe.useRef(null), B = x.useMemo(
    () => xt(p.assignedCodes),
    [p.assignedCodes]
  ), M = x.useMemo(
    () => ys(p.assignedCodes),
    [p.assignedCodes]
  ), j = B.find((E) => E.code === h) ?? B[0];
  fe.useEffect(() => {
    j.code !== h && u(j.code);
  }, [j, h]);
  const z = j == null ? void 0 : j.component, S = se(), [G, F] = x.useState(
    () => {
      var E;
      return ((E = window.localStorage) == null ? void 0 : E.getItem(qe)) === "1";
    }
  ), [y, I] = x.useState(!1), K = x.useCallback(() => {
    rt(), a == null || a();
  }, [a]);
  it(t, K), fe.useEffect(() => {
    g.isDirty ? f.markDirty() : f.markClean();
  });
  const W = x.useCallback(() => f.requestClose(K), [f, K]), P = x.useCallback(() => {
    F((E) => {
      var R;
      const L = !E;
      return (R = window.localStorage) == null || R.setItem(qe, L ? "1" : "0"), L;
    });
  }, []), Y = tt("Platform.Tasks.Delete"), [U, Q] = x.useState(!1), [b, C] = x.useState(!1), k = x.useCallback(async () => {
    var E, L, R, Z, q, be;
    C(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (R = (L = (E = window == null ? void 0 : window.abp) == null ? void 0 : E.notify) == null ? void 0 : L.info) == null || R.call(L, "Başarıyla silindi."), Q(!1), f.markClean(), K();
    } catch (xe) {
      (be = (q = (Z = window == null ? void 0 : window.abp) == null ? void 0 : Z.notify) == null ? void 0 : q.error) == null || be.call(q, (xe == null ? void 0 : xe.message) || "Görev silinemedi.");
    } finally {
      C(!1);
    }
  }, [r, f, K]), A = x.useCallback(async () => {
    var E, L, R, Z, q, be;
    if (!g.validate()) return !1;
    I(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, g.toUpdateDto())
      ), await S.invalidateQueries({ queryKey: ["task-detail", r] }), J.emitResult(), (R = (L = (E = window == null ? void 0 : window.abp) == null ? void 0 : E.notify) == null ? void 0 : L.success) == null || R.call(L, "Kaydedildi."), !0;
    } catch (xe) {
      return (be = (q = (Z = window == null ? void 0 : window.abp) == null ? void 0 : Z.notify) == null ? void 0 : q.error) == null || be.call(q, (xe == null ? void 0 : xe.message) || "Kaydedilemedi."), !1;
    } finally {
      I(!1);
    }
  }, [r, g, f, S]), $ = x.useCallback(() => {
    A();
  }, [A]), O = x.useCallback(async () => {
    const E = f.resolvePendingClose("save");
    await A() && (E == null || E());
  }, [f, A]), V = x.useCallback((E, L) => {
    f.requestClose(() => {
      l((R) => [...R, { id: r, title: (o == null ? void 0 : o.title) ?? "" }]), n(E), u("general"), f.markClean();
    });
  }, [f, r, o]), _ = x.useCallback((E) => {
    f.requestClose(() => {
      l((L) => {
        const R = L.findIndex((Z) => Z.id === E);
        return R === -1 ? L : L.slice(0, R);
      }), n(E), u("general"), f.markClean();
    });
  }, [f]), X = x.useCallback(async (E) => {
    var L, R, Z;
    try {
      await p.addFeature(E), u(E), N(!1);
    } catch (q) {
      (Z = (R = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : R.error) == null || Z.call(R, (q == null ? void 0 : q.message) || "Özellik eklenemedi.");
    }
  }, [p]), ee = x.useCallback(async (E) => {
    var L, R, Z;
    try {
      await p.removeFeature(E), u((q) => q === E ? "general" : q);
    } catch (q) {
      (Z = (R = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : R.error) == null || Z.call(R, (q == null ? void 0 : q.message) || "Özellik kaldırılamadı.");
    }
  }, [p]);
  fe.useEffect(() => {
    if (!v) return;
    const E = (R) => {
      T.current && !T.current.contains(R.target) && N(!1);
    }, L = (R) => {
      R.key === "Escape" && N(!1);
    };
    return document.addEventListener("mousedown", E), document.addEventListener("keydown", L), () => {
      document.removeEventListener("mousedown", E), document.removeEventListener("keydown", L);
    };
  }, [v]);
  const de = d ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(ce, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(ce, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(ce, { className: "h-24 w-full" })
  ] }) : c ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(D, { variant: "ghost", onClick: () => m(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      Rt,
      {
        trail: i,
        current: { id: r, title: (o == null ? void 0 : o.title) ?? "" },
        onNavigate: _
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: T, children: [
      /* @__PURE__ */ e.jsx(
        Pt,
        {
          tabs: B,
          activeCode: j.code,
          onSelect: (E) => {
            u(E), N(!1);
          },
          onOpenPicker: () => N((E) => !E),
          pickerOpen: v
        }
      ),
      v && /* @__PURE__ */ e.jsx(
        Lt,
        {
          entries: M,
          busyCode: p.isMutating ? p.mutatingCode : null,
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
        "aria-labelledby": `task-tab-${j.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          j.code === "general" ? /* @__PURE__ */ e.jsx(
            Et,
            {
              values: g.values,
              errors: g.errors,
              onFieldChange: g.setField,
              assigneeOptions: w.options,
              isLoadingAssignees: w.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(x.Suspense, { fallback: /* @__PURE__ */ e.jsx(ce, { className: "h-24 w-full" }), children: z && /* @__PURE__ */ e.jsx(
            z,
            {
              taskId: r,
              task: o,
              onOpenSubtask: V
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            zt,
            {
              task: o,
              creatorName: w.nameById.get(o.creatorId),
              lastModifierName: w.nameById.get(o.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), H = s === "page" ? wt : jt;
  return /* @__PURE__ */ e.jsxs(
    H,
    {
      open: !0,
      fullscreen: G,
      onRequestClose: W,
      title: o ? `Görev Detayı: ${o.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        kt,
        {
          task: o ?? { title: "Yükleniyor…" },
          canDelete: Y,
          fullscreen: G,
          onToggleFullscreen: P,
          onClose: W,
          onDelete: () => Q(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        Tt,
        {
          lastSavedAt: o == null ? void 0 : o.lastModificationTime,
          isDirty: f.isDirty,
          isSaving: y,
          onCancel: W,
          onSave: $
        }
      ),
      children: [
        de,
        f.pendingClose && /* @__PURE__ */ e.jsx(
          js,
          {
            isSaving: y,
            onStay: () => f.resolvePendingClose("stay"),
            onDiscard: () => f.resolvePendingClose("discard"),
            onSaveAndClose: O
          }
        ),
        U && /* @__PURE__ */ e.jsx(
          vs,
          {
            taskTitle: (o == null ? void 0 : o.title) ?? "",
            busy: b,
            onCancel: () => Q(!1),
            onConfirm: k
          }
        )
      ]
    }
  );
}
function vs({ taskTitle: t, busy: s, onCancel: a, onConfirm: r }) {
  const [n, i] = x.useState(""), l = n.trim() === "SİL";
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
        /* @__PURE__ */ e.jsx(D, { variant: "secondary", onClick: a, disabled: s, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          D,
          {
            variant: "destructive",
            onClick: r,
            disabled: !l,
            isLoading: s,
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
function mt({ label: t, title: s, description: a, children: r, actions: n }) {
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      role: "alertdialog",
      "aria-modal": "true",
      "aria-label": t,
      className: "absolute inset-0 z-popover grid place-items-center bg-surface-overlay p-4",
      children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-xl border border-default bg-surface-elevated p-[var(--apya-space-5)] shadow-xl", children: [
        /* @__PURE__ */ e.jsx("h3", { className: "text-base font-semibold text-text-primary", children: s }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-sm text-text-secondary", children: a }),
        r,
        /* @__PURE__ */ e.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: n })
      ] })
    }
  );
}
function js({ isSaving: t, onStay: s, onDiscard: a, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    mt,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(D, { variant: "secondary", onClick: s, disabled: t, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ e.jsx(D, { variant: "destructive", onClick: a, disabled: t, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ e.jsx(D, { variant: "primary", onClick: r, isLoading: t, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
const ws = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function Ns({ isPrivate: t = !1, onChange: s = () => {
} }) {
  const a = !!t;
  return /* @__PURE__ */ e.jsxs(ae, { children: [
    /* @__PURE__ */ e.jsx(re, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        className: "flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-default transition-all shadow-sm",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${a ? "fa-lock" : "fa-globe"} text-[11px] text-text-tertiary` }),
          /* @__PURE__ */ e.jsx("span", { children: a ? "Özel görev" : "Herkese açık" }),
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[10px] ml-0.5 text-text-tertiary" })
        ]
      }
    ) }),
    /* @__PURE__ */ e.jsx(ie, { children: /* @__PURE__ */ e.jsxs(
      ne,
      {
        sideOffset: 8,
        align: "end",
        className: "z-50 w-[360px] rounded-2xl border border-subtle bg-surface-base p-4 shadow-float animate-in fade-in-50 zoom-in-95",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle pb-3 mb-3", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shield-halved text-primary text-base" }),
            /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary", children: "Görünürlük" })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: ws.map((r) => {
            const n = a === r.value;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => s(r.value),
                className: `flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${n ? "border-primary bg-primary-subtle/40" : "border-subtle hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r.icon} text-base mt-0.5 ${n ? "text-primary" : "text-text-tertiary"}` }),
                  /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ e.jsx("h4", { className: "text-[13px] font-semibold text-text-primary", children: r.title }),
                      n && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ] }),
                    /* @__PURE__ */ e.jsx("p", { className: "text-[12px] text-text-tertiary mt-0.5", children: r.desc })
                  ] })
                ]
              },
              String(r.value)
            );
          }) }),
          /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-text-tertiary mt-3", children: "Değişiklik “Kaydet” ile uygulanır." }),
          /* @__PURE__ */ e.jsx(vt, { className: "fill-surface-base stroke-subtle" })
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
function ks({
  task: t = {},
  onClose: s,
  onToggleFullscreen: a,
  isFullscreen: r,
  presentation: n = "modal",
  onFieldChange: i = () => {
  },
  statusValue: l,
  priorityValue: o
}) {
  const [d, c] = x.useState(!1), [m, f] = x.useState(!!t.isPrivate), [g, w] = x.useState(!!t.isFavorite), p = l ?? t.status ?? 1, h = o ?? t.priority ?? 2, u = Ee.find((j) => j.id === p) || Ee[0], v = ze.find((j) => j.id === h) || ze[1], N = t.code || (t.id ? `#OTL-${t.id.substring(0, 4).toUpperCase()}` : "#OTL-2507"), T = () => {
    var j, z, S, G;
    (j = navigator.clipboard) == null || j.writeText(N), c(!0), (G = (S = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : S.success) == null || G.call(S, `${N} panoya kopyalandı.`), setTimeout(() => c(!1), 2e3);
  }, B = () => {
    var z, S, G, F;
    const j = `${window.location.origin}/Tasks?task=${t.id || ""}`;
    (z = navigator.clipboard) == null || z.writeText(j), (F = (G = (S = window == null ? void 0 : window.abp) == null ? void 0 : S.notify) == null ? void 0 : G.success) == null || F.call(G, "Görev bağlantısı panoya kopyalandı!");
  }, M = async () => {
    var z, S, G, F, y, I, K, W;
    const j = !g;
    w(j);
    try {
      await Promise.resolve((y = (F = (G = (S = (z = window == null ? void 0 : window.apya) == null ? void 0 : z.platform) == null ? void 0 : S.tasks) == null ? void 0 : G.task) == null ? void 0 : F.toggleFavorite) == null ? void 0 : y.call(F, t.id));
    } catch (P) {
      w(!j), (W = (K = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : K.error) == null || W.call(K, (P == null ? void 0 : P.message) || "Favori güncellenemedi.");
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
              /* @__PURE__ */ e.jsx("span", { children: N.replace("#", "") }),
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d ? "fa-check text-success" : "fa-copy opacity-50 group-hover:opacity-100"} text-[10px] ml-0.5 transition-all` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(ae, { children: [
          /* @__PURE__ */ e.jsx(re, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold border transition-all cursor-pointer shadow-xs hover:opacity-90 ${u.color}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${u.dot} animate-pulse` }),
                /* @__PURE__ */ e.jsx("span", { children: u.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] opacity-70 ml-0.5" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(ie, { children: /* @__PURE__ */ e.jsxs(
            ne,
            {
              sideOffset: 4,
              align: "start",
              className: "z-50 w-44 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95",
              children: [
                /* @__PURE__ */ e.jsx("div", { className: "text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1", children: "Durumu Değiştir" }),
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: Ee.map((j) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => i("status", j.id),
                    className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${p === j.id ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${j.dot}` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: j.label }),
                      p === j.id && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ]
                  },
                  j.id
                )) })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ e.jsxs(ae, { children: [
          /* @__PURE__ */ e.jsx(re, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
          /* @__PURE__ */ e.jsx(ie, { children: /* @__PURE__ */ e.jsxs(
            ne,
            {
              sideOffset: 4,
              align: "start",
              className: "z-50 w-40 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95",
              children: [
                /* @__PURE__ */ e.jsx("div", { className: "text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1", children: "Öncelik Seç" }),
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: ze.map((j) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => i("priority", j.id),
                    className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${h === j.id ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${j.icon} text-xs` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: j.label }),
                      h === j.id && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ]
                  },
                  j.id
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
            onBlur: (j) => i("title", j.currentTarget.textContent),
            className: "text-[23px] font-bold tracking-tight text-text-primary hover:text-primary transition-colors focus:outline-none focus:bg-surface-sunken/40 px-1.5 py-0.5 -mx-1.5 rounded-lg cursor-text leading-tight truncate",
            children: t.title || "Başlıksız görev"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: M,
            className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${g ? "text-amber-500 bg-amber-50 dark:bg-amber-950/30" : "text-text-tertiary hover:bg-surface-hover hover:text-amber-500"}`,
            title: g ? "Favorilerden çıkar" : "Favorilere ekle",
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-${g ? "solid" : "regular"} fa-star text-lg` })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
      /* @__PURE__ */ e.jsx(
        Ns,
        {
          isPrivate: m,
          onChange: (j) => {
            f(j), i("isPrivate", j);
          }
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "h-5 w-px bg-subtle mx-1" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1", children: [
        n === "modal" && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: a,
            title: r ? "Küçült" : "Tam Ekran",
            className: "flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors",
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r ? "fa-compress" : "fa-expand"} text-xs` })
          }
        ),
        /* @__PURE__ */ e.jsxs(ae, { children: [
          /* @__PURE__ */ e.jsx(re, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer Seçenekler",
              className: "flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(ie, { children: /* @__PURE__ */ e.jsxs(
            ne,
            {
              sideOffset: 4,
              align: "end",
              className: "z-50 w-48 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95",
              children: [
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: B,
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
            onClick: s,
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
function ue({ label: t, children: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-bold text-text-tertiary uppercase tracking-wider select-none", children: t }),
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center text-[13px] text-text-primary h-8 min-w-0", children: s })
  ] });
}
function Cs({
  task: t = {},
  assigneeOptions: s = [],
  projectOptions: a = [],
  onFieldChange: r = () => {
  },
  statusValue: n,
  priorityValue: i,
  assigneeValue: l,
  projectValue: o
}) {
  const d = n ?? t.status ?? 1, c = i ?? t.priority ?? 2, m = o ?? t.projectId ?? null, f = a.find((y) => y.value === m), g = (f == null ? void 0 : f.label) || t.projectName || "Projesiz", [w, p] = x.useState(
    Array.isArray(t.tags) ? t.tags.map((y) => typeof y == "string" ? y : y == null ? void 0 : y.name).filter(Boolean) : []
  ), [h, u] = x.useState(""), [v, N] = x.useState(!1), T = l ?? t.assigneeId ?? null, B = (y) => {
    if (y.key === "Enter" || y.type === "blur") {
      const I = h.trim();
      if (I && !w.includes(I)) {
        const K = [...w, I];
        p(K), r("tagNames", K);
      }
      u(""), N(!1);
    }
  }, M = (y) => {
    const I = w.filter((K) => K !== y);
    p(I), r("tagNames", I);
  }, j = (y) => {
    r("assigneeId", y);
  }, z = (y) => {
    if (!y) return "—";
    const I = new Date(y);
    return isNaN(I.getTime()) ? y : I.toISOString().split("T")[0];
  }, S = s.find((y) => y.value === T), G = (S == null ? void 0 : S.label) || t.assigneeName || "Atanmamış", F = `https://ui-avatars.com/api/?name=${encodeURIComponent(G)}&background=6366f1&color=fff&size=64`;
  return /* @__PURE__ */ e.jsx("div", { className: "px-[var(--apya-space-6)] py-[var(--apya-space-5)] bg-surface-base border-b border-subtle", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-y-[var(--apya-space-5)] gap-x-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsx(ue, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(ae, { children: [
      /* @__PURE__ */ e.jsx(re, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group focus-visible:outline-none focus-visible:shadow-focus",
          children: [
            /* @__PURE__ */ e.jsx("img", { src: F, alt: G, className: "h-6 w-6 rounded-full border border-subtle shrink-0 object-cover" }),
            /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary text-[13px] group-hover:text-primary transition-colors", children: G }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] text-text-tertiary ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ie, { children: /* @__PURE__ */ e.jsxs(
        ne,
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
                  onClick: () => j(null),
                  className: `flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-left transition-colors ${T ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary font-semibold"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "flex h-5 w-5 items-center justify-center rounded-full bg-surface-sunken text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-user-slash text-[9px]" }) }),
                    /* @__PURE__ */ e.jsx("span", { children: "Atanmamış" })
                  ]
                }
              ),
              s.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-2 py-1.5 text-[12px] text-text-tertiary", children: "Kullanıcı listesi yükleniyor…" }),
              s.map((y) => /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => j(y.value),
                  className: `flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-left transition-colors ${T === y.value ? "bg-primary-subtle text-primary font-semibold" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("img", { src: `https://ui-avatars.com/api/?name=${encodeURIComponent(y.label)}&background=6366f1&color=fff&size=64`, alt: y.label, className: "h-5 w-5 rounded-full" }),
                    /* @__PURE__ */ e.jsx("span", { children: y.label })
                  ]
                },
                y.value
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
          value: z(t.dueDate),
          onChange: (y) => r("dueDate", y.target.value),
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
          value: z(t.startDate),
          onChange: (y) => r("startDate", y.target.value),
          className: "bg-transparent text-text-primary text-[13px] font-medium focus:outline-none cursor-pointer"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Öncelik", children: /* @__PURE__ */ e.jsxs(ae, { children: [
      /* @__PURE__ */ e.jsx(re, { asChild: !0, children: /* @__PURE__ */ e.jsx("button", { type: "button", className: "flex items-center rounded-md cursor-pointer hover:opacity-90 transition-all focus-visible:outline-none focus-visible:shadow-focus", children: (() => {
        const y = Ie[c] || Ie[2];
        return /* @__PURE__ */ e.jsxs("span", { className: `flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[13px] font-semibold ${y.cls}`, children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${y.icon} text-xs` }),
          /* @__PURE__ */ e.jsx("span", { children: y.label }),
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] opacity-70 ml-0.5" })
        ] });
      })() }) }),
      /* @__PURE__ */ e.jsx(ie, { children: /* @__PURE__ */ e.jsxs(ne, { sideOffset: 6, align: "start", className: "z-50 w-40 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95", children: [
        /* @__PURE__ */ e.jsx("div", { className: "text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1", children: "Öncelik Seç" }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: [1, 2, 3, 4].map((y) => {
          const I = Ie[y], K = c === y;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("priority", y),
              className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${K ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${I.icon} text-xs` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: I.label }),
                K && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
              ]
            },
            y
          );
        }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Durum", children: /* @__PURE__ */ e.jsxs(ae, { children: [
      /* @__PURE__ */ e.jsx(re, { asChild: !0, children: /* @__PURE__ */ e.jsx("button", { type: "button", className: "flex items-center rounded-md cursor-pointer hover:opacity-90 transition-all focus-visible:outline-none focus-visible:shadow-focus", children: (() => {
        const y = Ae[d] || Ae[1];
        return /* @__PURE__ */ e.jsxs("span", { className: `flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[13px] font-semibold ${y.cls}`, children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${y.icon} text-xs` }),
          /* @__PURE__ */ e.jsx("span", { children: y.label }),
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] opacity-70 ml-0.5" })
        ] });
      })() }) }),
      /* @__PURE__ */ e.jsx(ie, { children: /* @__PURE__ */ e.jsxs(ne, { sideOffset: 6, align: "start", className: "z-50 w-44 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95", children: [
        /* @__PURE__ */ e.jsx("div", { className: "text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1", children: "Durumu Değiştir" }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: [1, 2, 3, 4].map((y) => {
          const I = Ae[y], K = d === y;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("status", y),
              className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${K ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${I.icon} text-xs` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: I.label }),
                K && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
              ]
            },
            y
          );
        }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
      w.map((y) => /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "group inline-flex items-center gap-1 bg-primary-subtle text-primary text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors",
          children: [
            /* @__PURE__ */ e.jsx("span", { children: y }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: () => M(y),
                className: "opacity-0 group-hover:opacity-100 hover:text-negative transition-opacity ml-0.5",
                "aria-label": "Etiketi kaldır",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
              }
            )
          ]
        },
        y
      )),
      v ? /* @__PURE__ */ e.jsx(
        "input",
        {
          autoFocus: !0,
          type: "text",
          value: h,
          onChange: (y) => u(y.target.value),
          onKeyDown: B,
          onBlur: B,
          placeholder: "Etiket...",
          className: "h-6 w-16 px-1.5 text-[11px] rounded border border-primary bg-surface-base focus:outline-none"
        }
      ) : /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => N(!0),
          className: "flex items-center justify-center h-5 w-5 rounded-full bg-surface-sunken border border-subtle text-text-tertiary hover:bg-surface-hover hover:text-text-primary hover:border-primary transition-all",
          "aria-label": "Yeni etiket ekle",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[9px]" })
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(ue, { label: "Proje", children: /* @__PURE__ */ e.jsxs(ae, { children: [
      /* @__PURE__ */ e.jsx(re, { asChild: !0, children: /* @__PURE__ */ e.jsxs("button", { type: "button", className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group focus-visible:outline-none focus-visible:shadow-focus", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
        /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary group-hover:text-primary transition-colors text-[13px] truncate max-w-[140px]", children: g }),
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] text-text-tertiary ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" })
      ] }) }),
      /* @__PURE__ */ e.jsx(ie, { children: /* @__PURE__ */ e.jsxs(ne, { sideOffset: 6, align: "start", className: "z-50 w-56 rounded-xl border border-subtle bg-surface-base p-2 shadow-float animate-in fade-in-50 zoom-in-95", children: [
        /* @__PURE__ */ e.jsx("div", { className: "text-[11px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1 mb-1", children: "Proje Seç" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 max-h-56 overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("projectId", null),
              className: `flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-left transition-colors ${m ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary font-semibold"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex h-5 w-5 items-center justify-center rounded-md bg-surface-sunken text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ban text-[9px]" }) }),
                /* @__PURE__ */ e.jsx("span", { children: "Projesiz" })
              ]
            }
          ),
          a.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-2 py-1.5 text-[12px] text-text-tertiary", children: "Proje listesi yükleniyor…" }),
          a.map((y) => /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("projectId", y.value),
              className: `flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-left transition-colors ${m === y.value ? "bg-primary-subtle text-primary font-semibold" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex h-5 w-5 items-center justify-center rounded-md bg-surface-sunken text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder text-[9px]" }) }),
                /* @__PURE__ */ e.jsx("span", { className: "truncate", children: y.label })
              ]
            },
            y.value
          ))
        ] })
      ] }) })
    ] }) })
  ] }) });
}
const Ts = ["checklist", "time-tracking", "gantt", "dependencies", "finance", "comments", "activity", "history"], Ds = Object.fromEntries(Ce.map((t) => [t.code, t])), pt = [
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
], Ve = pt.reduce((t, s) => t + s.items.length, 0);
function Ss({
  assignedCodes: t = [],
  onAddFeature: s = () => {
  }
}) {
  const [a, r] = x.useState(!1), [n, i] = x.useState(!1), [l, o] = x.useState(""), [d, c] = x.useState(!1);
  x.useEffect(() => {
    c(!0);
  }, []);
  const m = (u) => t.includes(u), f = (u) => {
    s(u), r(!1), i(!1);
  }, g = () => {
    r(!1), o(""), i(!0);
  };
  x.useEffect(() => {
    const u = (v) => {
      v.key === "Escape" && n && i(!1);
    };
    return window.addEventListener("keydown", u), () => window.removeEventListener("keydown", u);
  }, [n]);
  const w = Ts.map((u) => Ds[u]).filter(Boolean), p = pt.map((u) => ({
    ...u,
    items: u.items.filter(
      (v) => v.title.toLowerCase().includes(l.toLowerCase()) || v.desc.toLowerCase().includes(l.toLowerCase()) || u.title.toLowerCase().includes(l.toLowerCase())
    )
  })).filter((u) => u.items.length > 0), h = n && d ? ht.createPortal(
    /* @__PURE__ */ e.jsx(
      "div",
      {
        className: "apya-feature-modal-root fixed inset-0 z-[99999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150",
        onClick: () => i(!1),
        children: /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "relative w-full max-w-3xl rounded-3xl border border-subtle bg-surface-base shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 fade-in duration-200",
            onClick: (u) => u.stopPropagation(),
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
                    onClick: () => i(!1),
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
                    onChange: (u) => o(u.target.value),
                    placeholder: `${Ve} özellik arasında ara (Gantt, Finans, AI, Riskler...)`,
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
                p.map((u) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-bold text-text-tertiary tracking-widest uppercase", children: u.title }),
                    /* @__PURE__ */ e.jsx("div", { className: "flex-1 h-px bg-subtle/60" })
                  ] }),
                  /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3.5", children: u.items.map((v) => {
                    const N = m(v.code);
                    return /* @__PURE__ */ e.jsxs(
                      "div",
                      {
                        onClick: () => f(v.code),
                        className: `
                                                group flex items-start gap-4 rounded-2xl border p-4 transition-all cursor-pointer select-none
                                                ${N ? "border-primary/50 bg-primary-subtle/30 shadow-xs ring-1 ring-primary/30" : "border-subtle bg-surface-base hover:border-primary/60 hover:bg-surface-hover hover:shadow-md hover:-translate-y-0.5"}
                                            `,
                        children: [
                          /* @__PURE__ */ e.jsx("div", { className: `flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${v.color} shadow-xs text-lg group-hover:scale-105 transition-transform`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${v.icon}` }) }),
                          /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0 flex-1", children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                              /* @__PURE__ */ e.jsx("span", { className: "text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors truncate", children: v.title }),
                              N ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1 text-[11px] font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded-full border border-primary/20", children: [
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
                ] }, u.title)),
                p.length === 0 && /* @__PURE__ */ e.jsxs("div", { className: "py-12 text-center flex flex-col items-center gap-2", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass text-3xl text-text-tertiary mb-2" }),
                  /* @__PURE__ */ e.jsx("p", { className: "text-sm font-semibold text-text-primary", children: "Eşleşen özellik bulunamadı" }),
                  /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Lütfen farklı bir arama terimi deneyin." })
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-6 py-3.5 border-t border-subtle bg-surface-sunken/40 text-xs text-text-tertiary", children: [
                /* @__PURE__ */ e.jsxs("span", { children: [
                  "Toplam ",
                  Ve,
                  " profesyonel modül ve sekme"
                ] }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => i(!1),
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
    /* @__PURE__ */ e.jsxs(ae, { open: a, onOpenChange: r, children: [
      /* @__PURE__ */ e.jsx(re, { asChild: !0, children: /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-primary/50 bg-primary-subtle/30 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all focus:outline-none shadow-xs cursor-pointer active:scale-95",
          "aria-label": "Özellik ekle",
          title: "Özellik Ekle (+)",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-xs pointer-events-none" })
        }
      ) }),
      /* @__PURE__ */ e.jsx(ie, { children: /* @__PURE__ */ e.jsxs(
        ne,
        {
          align: "end",
          sideOffset: 6,
          className: "z-[99999999] w-72 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95",
          children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-2.5 py-1.5 text-[11px] font-bold text-text-tertiary uppercase tracking-wider", children: "Görünüm / özellik ekle" }),
            /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5 max-h-[320px] overflow-y-auto custom-scrollbar", children: w.map((u) => {
              const v = m(u.code);
              return /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  disabled: v,
                  onClick: () => f(u.code),
                  className: `flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors ${v ? "opacity-60 cursor-default" : "hover:bg-surface-hover cursor-pointer"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-sunken text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-xs` }) }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[13px] font-medium text-text-primary truncate", children: u.title }),
                    v && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary shrink-0" })
                  ]
                },
                u.code
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
function Es({
  activeTab: t = "general",
  onTabChange: s = () => {
  },
  visibleTabs: a = [],
  assignedCodes: r = [],
  onAddFeature: n = () => {
  },
  task: i = {}
}) {
  const l = (o) => {
    var c, m, f, g;
    let d = 0;
    return o === "subtasks" ? d = ((c = i.subTasks) == null ? void 0 : c.length) ?? 0 : o === "files" ? d = ((m = i.attachments) == null ? void 0 : m.length) ?? 0 : o === "dependencies" ? d = ((f = i.predecessorIds) == null ? void 0 : f.length) ?? 0 : o === "comments" && (d = ((g = i.comments) == null ? void 0 : g.length) ?? 0), d > 0 ? d : null;
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-4 w-full py-1.5", children: [
    /* @__PURE__ */ e.jsx("nav", { className: "flex items-center gap-1.5 overflow-x-auto custom-scrollbar", "aria-label": "Görev Sekmeleri", children: a.map((o) => {
      const d = t === o.code, c = l(o.code);
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => s(o.code),
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
      Ss,
      {
        assignedCodes: r,
        onAddFeature: n
      }
    ) })
  ] });
}
function _e({ label: t, value: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-start py-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary text-right font-medium max-w-[150px] truncate", title: typeof s == "string" ? s : "", children: s ?? "—" })
  ] });
}
function Ue({ label: t, name: s, avatar: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-center py-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("img", { src: a, alt: s, className: "w-5 h-5 rounded-full border border-subtle object-cover" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary font-semibold", children: s })
    ] })
  ] });
}
function zs({ task: t = {}, onDelete: s = () => {
}, nameById: a }) {
  const [r, n] = x.useState(!1), [i, l] = x.useState(!1), o = se(), d = (h, u) => {
    var v;
    return h || u && ((v = a == null ? void 0 : a.get) == null ? void 0 : v.call(a, u)) || "Bilinmiyor";
  }, c = d(t.creatorName, t.creatorId), m = t.lastModificationTime ? d(t.lastModifierName, t.lastModifierId) : "—", f = (h) => h ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(h)) : "—", g = () => {
    var u, v, N, T;
    const h = `${window.location.origin}/Tasks?task=${t.id || ""}`;
    (u = navigator.clipboard) == null || u.writeText(h), (T = (N = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : N.success) == null || T.call(N, "Görev bağlantısı panoya kopyalandı!");
  }, w = async () => {
    var h, u, v, N, T, B, M, j, z, S, G;
    if (!(!t || r)) {
      n(!0);
      try {
        const F = (v = (u = (h = window == null ? void 0 : window.apya) == null ? void 0 : h.platform) == null ? void 0 : u.tasks) == null ? void 0 : v.task;
        if (F) {
          const y = {
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
          }, I = await Promise.resolve(F.create(y));
          await o.invalidateQueries({ queryKey: ["task-detail"] }), (B = (T = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : T.success) == null || B.call(T, "Görev başarıyla çoğaltıldı!"), (j = (M = window.apya) == null ? void 0 : M.taskDetail) != null && j.open && I && window.apya.taskDetail.open(I);
        }
      } catch (F) {
        (G = (S = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : S.error) == null || G.call(S, (F == null ? void 0 : F.message) || "Görev çoğaltılamadı.");
      } finally {
        n(!1);
      }
    }
  }, p = async () => {
    var h, u, v, N, T, B, M, j, z;
    if (!(!t.id || i)) {
      l(!0);
      try {
        const S = (v = (u = (h = window == null ? void 0 : window.apya) == null ? void 0 : h.platform) == null ? void 0 : u.tasks) == null ? void 0 : v.task;
        S && (await Promise.resolve(S.updateStatus(t.id, 4)), await o.invalidateQueries({ queryKey: ["task-detail", t.id] }), (B = (T = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : T.info) == null || B.call(T, "Görev arşivlendi (Tamamlandı)."));
      } catch (S) {
        (z = (j = (M = window == null ? void 0 : window.abp) == null ? void 0 : M.notify) == null ? void 0 : j.error) == null || z.call(j, (S == null ? void 0 : S.message) || "Görev arşivlenemedi.");
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
          Ue,
          {
            label: "Oluşturan",
            name: c,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c)}&background=6366f1&color=fff&size=64`
          }
        ),
        /* @__PURE__ */ e.jsx(_e, { label: "Oluşturma Tarihi", value: f(t.creationTime) }),
        /* @__PURE__ */ e.jsx(
          Ue,
          {
            label: "Güncelleyen",
            name: m,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(m)}&background=6366f1&color=fff&size=64`
          }
        ),
        /* @__PURE__ */ e.jsx(_e, { label: "Son Güncelleme", value: f(t.lastModificationTime) })
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
          onClick: w,
          disabled: r,
          isLoading: r,
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
          onClick: p,
          disabled: i,
          isLoading: i,
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
          onClick: s,
          className: "w-full justify-start text-negative hover:bg-negative-subtle hover:border-negative/40 h-10 border-negative/20 font-semibold rounded-xl text-[13px] transition-colors mt-1",
          icon: "fa-trash-can",
          children: "Sil"
        }
      )
    ] })
  ] });
}
function As({ onFormat: t = () => {
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
function Is({ task: t = {}, onFieldChange: s = () => {
} }) {
  const a = t == null ? void 0 : t.id, r = se(), [n, i] = x.useState(t.description || ""), l = (b, C = "") => {
    const k = document.getElementById("task-v3-desc-input");
    if (!k) return;
    const A = k.selectionStart, $ = k.selectionEnd, O = n.substring(A, $) || "metin", V = `${b}${O}${C}`, _ = n.substring(0, A) + V + n.substring($);
    i(_), s("description", _);
  }, o = dt(a), [d, c] = x.useState(!0), [m, f] = x.useState(""), [g, w] = x.useState(!1), [p, h] = x.useState(!1), u = o.items ?? [], v = u.filter((b) => b.isDone || b.done).length, N = async (b) => {
    var C, k, A, $, O, V;
    if (b.key === "Enter" || b.type === "blur") {
      const _ = m.trim();
      if (_ && a) {
        h(!0);
        try {
          await o.addItem(_), (A = (k = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : k.success) == null || A.call(k, "Madde eklendi.");
        } catch (X) {
          (V = (O = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : O.error) == null || V.call(O, (X == null ? void 0 : X.message) || "Madde eklenemedi.");
        } finally {
          h(!1);
        }
      }
      f(""), w(!1);
    }
  }, T = async (b) => {
    var C, k, A;
    if (!(typeof b == "string" && b.startsWith("mock-")))
      try {
        await o.toggleItem(b);
      } catch ($) {
        (A = (k = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : k.error) == null || A.call(k, ($ == null ? void 0 : $.message) || "Durum güncellenemedi.");
      }
  }, B = async (b) => {
    var C, k, A, $, O, V;
    if (!(typeof b == "string" && b.startsWith("mock-")))
      try {
        await o.removeItem(b), (A = (k = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : k.info) == null || A.call(k, "Madde silindi.");
      } catch (_) {
        (V = (O = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : O.error) == null || V.call(O, (_ == null ? void 0 : _.message) || "Madde silinemedi.");
      }
  }, { data: M = [] } = te({
    queryKey: ["task-comments", a],
    queryFn: async () => {
      var C, k, A;
      const b = (A = (k = (C = window == null ? void 0 : window.apya) == null ? void 0 : C.platform) == null ? void 0 : k.tasks) == null ? void 0 : A.task;
      return !b || !a ? [] : await Promise.resolve(b.getComments(a));
    },
    enabled: !!a,
    staleTime: 1e4
  }), [j, z] = x.useState(""), [S, G] = x.useState(!0), [F, y] = x.useState(!1), [I, K] = x.useState(null), [W, P] = x.useState(""), Y = M.length > 0 ? M : t.comments ?? [], U = async (b) => {
    var k, A, $, O, V, _, X, ee, de;
    b.preventDefault();
    const C = j.trim();
    if (!(!C || !a)) {
      y(!0);
      try {
        const H = ($ = (A = (k = window == null ? void 0 : window.apya) == null ? void 0 : k.platform) == null ? void 0 : A.tasks) == null ? void 0 : $.task;
        H && (await Promise.resolve(H.addComment(a, C)), await r.invalidateQueries({ queryKey: ["task-comments", a] }), await r.invalidateQueries({ queryKey: ["task-detail", a] }), (_ = (V = (O = window == null ? void 0 : window.abp) == null ? void 0 : O.notify) == null ? void 0 : V.success) == null || _.call(V, "Yorum gönderildi.")), z("");
      } catch (H) {
        (de = (ee = (X = window == null ? void 0 : window.abp) == null ? void 0 : X.notify) == null ? void 0 : ee.error) == null || de.call(ee, (H == null ? void 0 : H.message) || "Yorum gönderilemedi.");
      } finally {
        y(!1);
      }
    }
  }, Q = async (b) => {
    var k, A, $, O, V, _, X, ee, de;
    const C = W.trim();
    if (!(!C || !a))
      try {
        const H = ($ = (A = (k = window == null ? void 0 : window.apya) == null ? void 0 : k.platform) == null ? void 0 : A.tasks) == null ? void 0 : $.task;
        H && (await Promise.resolve(H.replyToComment(b, C)), await r.invalidateQueries({ queryKey: ["task-comments", a] }), (_ = (V = (O = window == null ? void 0 : window.abp) == null ? void 0 : O.notify) == null ? void 0 : V.success) == null || _.call(V, "Yanıt gönderildi.")), P(""), K(null);
      } catch (H) {
        (de = (ee = (X = window == null ? void 0 : window.abp) == null ? void 0 : X.notify) == null ? void 0 : ee.error) == null || de.call(ee, (H == null ? void 0 : H.message) || "Yanıt gönderilemedi.");
      }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-2.5", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary", children: "Açıklama" }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-subtle bg-surface-base focus-within:border-primary focus-within:shadow-focus transition-all overflow-hidden shadow-xs", children: [
        /* @__PURE__ */ e.jsx(As, { onFormat: l }),
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            id: "task-v3-desc-input",
            className: "w-full min-h-[110px] p-4 text-[14px] leading-relaxed text-text-primary bg-transparent focus:outline-none resize-y font-sans",
            value: n,
            onChange: (b) => {
              i(b.target.value), s("description", b.target.value);
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
              u.length > 0 && /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-text-tertiary bg-surface-sunken px-2 py-0.5 rounded-full", children: [
                v,
                "/",
                u.length
              ] })
            ] }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "text-text-tertiary group-hover:text-text-primary transition-colors", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid fa-chevron-up transition-transform duration-200 ${d ? "" : "rotate-180"}` }) })
          ]
        }
      ),
      d && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2.5 animate-in fade-in-50", children: [
        u.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden mb-1", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full bg-success transition-all duration-300",
            style: { width: `${v / u.length * 100}%` }
          }
        ) }),
        u.map((b) => {
          const C = b.isDone ?? b.done ?? !1;
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
                      onChange: () => T(b.id),
                      className: "h-4 w-4 rounded border-subtle text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `text-[13px] transition-all truncate ${C ? "line-through text-text-tertiary font-normal" : "text-text-primary font-medium"}`, children: b.text })
                ] }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => B(b.id),
                    className: "opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-negative transition-all p-1",
                    title: "Maddeyi Sil",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-trash-can text-xs" })
                  }
                )
              ]
            },
            b.id
          );
        }),
        g ? /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 mt-1", children: /* @__PURE__ */ e.jsx(
          "input",
          {
            autoFocus: !0,
            type: "text",
            value: m,
            onChange: (b) => f(b.target.value),
            onKeyDown: N,
            onBlur: N,
            disabled: p,
            placeholder: "Yeni kontrol maddesi yazıp Enter'a basın...",
            className: "w-full h-9 px-3 text-[13px] rounded-lg border border-primary bg-surface-base focus:outline-none"
          }
        ) }) : /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => w(!0),
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
          onClick: () => G(!S),
          className: "flex items-center justify-between cursor-pointer select-none group",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors", children: "Yorumlar & Güncellemeler" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-primary-subtle text-primary text-[11px] font-bold", children: Y.length })
            ] }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "text-text-tertiary group-hover:text-text-primary transition-colors", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid fa-chevron-up transition-transform duration-200 ${S ? "" : "rotate-180"}` }) })
          ]
        }
      ),
      S && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-5 animate-in fade-in-50", children: [
        /* @__PURE__ */ e.jsxs("form", { onSubmit: U, className: "flex gap-3 items-start", children: [
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
                value: j,
                onChange: (b) => z(b.target.value),
                placeholder: "Bir yorum yazın... (@bahset, #görev)",
                rows: 2,
                className: "w-full p-3 text-[13px] bg-transparent focus:outline-none resize-none text-text-primary",
                onKeyDown: (b) => {
                  b.key === "Enter" && (b.ctrlKey || b.metaKey) && U(b);
                }
              }
            ),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-t border-subtle/50 bg-surface-base", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 text-text-tertiary", children: [
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => z((b) => b + " [Dosya] "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Dosya Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => z((b) => b + " [Görsel] "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Resim Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-image text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => z((b) => b + " 👍 "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Emoji", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-face-smile text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => z((b) => b + " @Yakup B. "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Bahset (@)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-at text-xs" }) })
              ] }),
              /* @__PURE__ */ e.jsx(
                D,
                {
                  type: "submit",
                  size: "sm",
                  disabled: !j.trim() || F,
                  isLoading: F,
                  className: "bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 h-8 rounded-lg shadow-sm",
                  icon: "fa-paper-plane",
                  children: "Gönder"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-4 divide-y divide-subtle/50", children: Y.map((b) => {
          const C = b.creatorName || b.author || "Yakup B.", k = `https://ui-avatars.com/api/?name=${encodeURIComponent(C)}&background=6366f1&color=fff&size=64`, A = b.creationTime ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(b.creationTime)) : b.date || "10.07.2026 09:30";
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-3 pt-3 items-start first:pt-0", children: [
            /* @__PURE__ */ e.jsx("img", { src: k, alt: C, className: "h-8 w-8 rounded-full border border-subtle shrink-0 object-cover" }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col gap-1", children: [
              /* @__PURE__ */ e.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: C }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary font-mono", children: A })
              ] }) }),
              /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap", children: b.text.split(" ").map(($, O) => $.startsWith("@") ? /* @__PURE__ */ e.jsxs("span", { className: "font-semibold text-primary bg-primary-subtle px-1 py-0.5 rounded mr-1", children: [
                $,
                " "
              ] }, O) : $ + " ") }),
              /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-4 mt-1", children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => K(I === b.id ? null : b.id),
                  className: "text-xs font-semibold text-text-tertiary hover:text-primary transition-colors flex items-center gap-1",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                    /* @__PURE__ */ e.jsx("span", { children: "Yanıtla" })
                  ]
                }
              ) }),
              I === b.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex gap-2 items-center animate-in fade-in-50", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: W,
                    onChange: ($) => P($.target.value),
                    placeholder: `@${C} kullanıcısına yanıt ver...`,
                    onKeyDown: ($) => {
                      $.key === "Enter" && Q(b.id);
                    },
                    className: "flex-1 h-8 px-3 text-[12px] rounded-lg border border-primary bg-surface-base focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(D, { size: "sm", onClick: () => Q(b.id), className: "h-8 text-xs bg-primary text-white", children: "Yanıtla" })
              ] })
            ] })
          ] }, b.id);
        }) })
      ] })
    ] })
  ] });
}
function Ps({
  lastSavedAt: t,
  isDirty: s,
  isSaving: a,
  onCancel: r,
  onSave: n
}) {
  const i = t ? new Intl.DateTimeFormat("tr-TR", {
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
        /* @__PURE__ */ e.jsx("strong", { className: "font-medium text-text-secondary", children: i })
      ] }),
      s && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 text-warning font-medium ml-2", children: [
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
          onClick: r,
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
          disabled: !s || a,
          isLoading: a,
          loadingText: "Kaydediliyor…",
          className: "bg-primary hover:bg-primary-hover text-white px-6 font-medium shadow-sm transition-all rounded-lg",
          children: "Kaydet"
        }
      )
    ] })
  ] });
}
function $s() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ls() {
  const t = te({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: $s,
    staleTime: 3e5,
    retry: !1
  }), s = t.data ?? [], a = s.map((n) => ({ value: n.id, label: n.name })), r = new Map(s.map((n) => [n.id, n.name]));
  return { options: a, nameById: r, isLoading: t.isLoading };
}
const Qe = "apya.taskDetail.fullscreen";
function ft({
  taskId: t,
  presentation: s = "modal",
  onClose: a,
  switchToTask: r
}) {
  const [n, i] = x.useState(t), { data: l, isLoading: o, isError: d, refetch: c } = et(n), m = se(), f = st(), g = nt(l), w = lt(), p = Ls(), h = ot(n), [u, v] = x.useState("general"), [N, T] = x.useState(!1), [B, M] = x.useState(() => {
    try {
      return localStorage.getItem(Qe) === "true";
    } catch {
      return !1;
    }
  });
  it(n), fe.useEffect(() => {
    g.isDirty ? f.markDirty() : f.markClean();
  });
  const j = x.useCallback(() => {
    rt(), a == null || a();
  }, [a]), z = x.useCallback(() => f.requestClose(j), [f, j]), S = x.useCallback(() => {
    M((P) => {
      const Y = !P;
      try {
        localStorage.setItem(Qe, String(Y));
      } catch {
      }
      return Y;
    });
  }, []), G = x.useMemo(
    () => xt(h.assignedCodes),
    [h.assignedCodes]
  ), F = Ce.find((P) => P.code === u) || G.find((P) => P.code === u) || G[0], y = x.useCallback(async () => {
    var P, Y, U, Q, b, C;
    if (!g.validate()) return !1;
    T(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(n, g.toUpdateDto())
      ), await m.invalidateQueries({ queryKey: ["task-detail", n] }), J.emitResult(), (U = (Y = (P = window == null ? void 0 : window.abp) == null ? void 0 : P.notify) == null ? void 0 : Y.success) == null || U.call(Y, "Görev başarıyla güncellendi."), !0;
    } catch (k) {
      return (C = (b = (Q = window == null ? void 0 : window.abp) == null ? void 0 : Q.notify) == null ? void 0 : b.error) == null || C.call(b, (k == null ? void 0 : k.message) || "Kaydedilemedi."), !1;
    } finally {
      T(!1);
    }
  }, [n, g, m]), I = x.useCallback(async () => {
    var P, Y, U, Q, b, C;
    if (window.confirm("Bu görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.delete(n)), (U = (Y = (P = window == null ? void 0 : window.abp) == null ? void 0 : P.notify) == null ? void 0 : Y.info) == null || U.call(Y, "Görev silindi."), f.markClean(), j();
      } catch (k) {
        (C = (b = (Q = window == null ? void 0 : window.abp) == null ? void 0 : Q.notify) == null ? void 0 : b.error) == null || C.call(b, (k == null ? void 0 : k.message) || "Görev silinemedi.");
      }
  }, [n, f, j]), K = x.useCallback(async (P) => {
    var Y, U, Q, b, C, k;
    try {
      await h.addFeature(P), v(P), (Q = (U = (Y = window == null ? void 0 : window.abp) == null ? void 0 : Y.notify) == null ? void 0 : U.success) == null || Q.call(U, "Özellik başarıyla eklendi.");
    } catch (A) {
      (k = (C = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : C.error) == null || k.call(C, (A == null ? void 0 : A.message) || "Özellik eklenemedi.");
    }
  }, [h]), W = o ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(ce, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(ce, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(ce, { className: "h-64 w-full" })
  ] }) : d ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(D, { variant: "ghost", onClick: () => c(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      ks,
      {
        task: l,
        onClose: z,
        isFullscreen: B,
        onToggleFullscreen: S,
        presentation: s,
        onFieldChange: g.setField,
        statusValue: g.values.status,
        priorityValue: g.values.priority
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "overflow-y-auto max-h-[85vh] custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        Cs,
        {
          task: l,
          assigneeOptions: w.options,
          projectOptions: p.options,
          onFieldChange: g.setField,
          statusValue: g.values.status,
          priorityValue: g.values.priority,
          assigneeValue: g.values.assigneeId,
          projectValue: g.values.projectId
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "border-b border-subtle px-6 bg-surface-base", children: /* @__PURE__ */ e.jsx(
        Es,
        {
          activeTab: u,
          onTabChange: v,
          visibleTabs: G,
          assignedCodes: h.assignedCodes,
          onAddFeature: K,
          task: l
        }
      ) }),
      /* @__PURE__ */ e.jsx("div", { className: "p-6", children: u === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start", children: [
        /* @__PURE__ */ e.jsx("div", { className: "min-w-0 space-y-6", children: /* @__PURE__ */ e.jsx(
          Is,
          {
            task: l,
            onFieldChange: g.setField
          }
        ) }),
        /* @__PURE__ */ e.jsx("div", { className: "w-full shrink-0", children: /* @__PURE__ */ e.jsx(
          zs,
          {
            task: l,
            onDelete: I,
            nameById: w.nameById
          }
        ) })
      ] }) : /* @__PURE__ */ e.jsx(x.Suspense, { fallback: /* @__PURE__ */ e.jsx(ce, { className: "h-48 w-full" }), children: F != null && F.component ? /* @__PURE__ */ e.jsx(
        F.component,
        {
          taskId: n,
          task: l,
          onOpenSubtask: r
        }
      ) : /* @__PURE__ */ e.jsxs("div", { className: "text-center py-12 text-text-tertiary border border-dashed border-subtle rounded-xl", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-person-digging text-4xl mb-4 opacity-50" }),
        /* @__PURE__ */ e.jsx("p", { children: "Bu sekme yapım aşamasında." })
      ] }) }) })
    ] }),
    /* @__PURE__ */ e.jsx(
      Ps,
      {
        lastSavedAt: l == null ? void 0 : l.lastModificationTime,
        isDirty: f.isDirty,
        isSaving: N,
        onCancel: z,
        onSave: y
      }
    )
  ] });
  return s === "page" ? /* @__PURE__ */ e.jsx("div", { className: "w-full max-w-6xl mx-auto my-6 rounded-2xl border border-subtle bg-surface-base shadow-sm overflow-hidden", children: W }) : /* @__PURE__ */ e.jsx(
    Je,
    {
      open: !0,
      onOpenChange: (P) => {
        P || z();
      },
      children: /* @__PURE__ */ e.jsx(
        Xe,
        {
          title: l != null && l.title ? `Görev Detayı: ${l.title}` : "Görev Detayı",
          fullscreen: B,
          className: "max-w-6xl p-0 overflow-hidden rounded-2xl border border-subtle shadow-2xl bg-surface-base",
          onInteractOutside: (P) => {
            P.preventDefault(), z();
          },
          onEscapeKeyDown: (P) => {
            P.preventDefault(), z();
          },
          children: W
        }
      )
    }
  );
}
function Rs() {
  var s;
  const t = x.useSyncExternalStore(
    J.subscribe,
    J.getSnapshot,
    () => null
  );
  return t ? (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsx(
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
function bt() {
  var a;
  try {
    const r = new URLSearchParams(window.location.search).get("taskui");
    if (r === "v1" || r === "v2" || r === "v3") return r;
  } catch {
  }
  const t = document.getElementById("task-detail-island"), s = (a = t == null ? void 0 : t.dataset) == null ? void 0 : a.taskui;
  return s === "v1" || s === "v2" ? s : "v3";
}
function Gs() {
  return bt() === "v2";
}
function Fs() {
  return bt() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = Fs();
window.apya.taskDetailV2Enabled = Gs() && !window.apya.taskDetailV3Enabled;
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
    const s = at();
    s && J.open(s);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Ze) : Ze();
function Ks({ taskId: t }) {
  var a;
  const s = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsx(
    ft,
    {
      taskId: t,
      presentation: "page",
      onClose: s
    }
  ) }) : /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsx(
    ut,
    {
      taskId: t,
      presentation: "page",
      onClose: s
    }
  ) });
}
const Pe = document.getElementById("task-detail-page-island");
if (Pe) {
  const t = Pe.getAttribute("data-task-id");
  t && We(Pe).render(/* @__PURE__ */ e.jsx(Ks, { taskId: t }));
}
