import { j as e, r as c, d as ce, a as lt, b as qe } from "./react-vendor.js";
/* empty css      */
import { a as je } from "./QueryProvider.js";
import { u as de, a as te, b as le } from "./query-vendor.js";
import { D as Ve, l as Ue, e as we, B as k, I as oe, S as ae } from "./Dialog.js";
import { C as ot } from "./Combobox.js";
import { r as ct } from "./httpClient.js";
import { R as me, T as pe, P as fe, C as be, A as dt } from "./ui-vendor.js";
function xt({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: n,
  footer: i,
  children: l
}) {
  return /* @__PURE__ */ e.jsx(
    Ve,
    {
      open: t,
      onOpenChange: (o) => {
        o || a();
      },
      children: /* @__PURE__ */ e.jsx(
        Ue,
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
function ut({ title: t, header: a, footer: s, children: r }) {
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
const he = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, Se = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function pt({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: n,
  fullscreen: i = !1
}) {
  const [l, o] = c.useState(!1), x = c.useRef(null);
  c.useEffect(() => {
    if (!l) return;
    const g = (y) => {
      x.current && !x.current.contains(y.target) && o(!1);
    }, d = (y) => {
      y.key === "Escape" && o(!1);
    };
    return document.addEventListener("mousedown", g), document.addEventListener("keydown", d), () => {
      document.removeEventListener("mousedown", g), document.removeEventListener("keydown", d);
    };
  }, [l]);
  const h = he[t == null ? void 0 : t.status] ?? he[1], p = Se[t == null ? void 0 : t.priority] ?? Se[2], f = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), o(!1);
  }, m = () => {
    var d, y, j, v;
    const g = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (d = navigator.clipboard) == null || d.writeText(g), (v = (j = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : j.info) == null || v.call(j, "Bağlantı kopyalandı."), o(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(we, { variant: h.variant, children: h.text }),
        /* @__PURE__ */ e.jsx(we, { variant: p.variant, children: p.text }),
        /* @__PURE__ */ e.jsx(mt, { isPrivate: t == null ? void 0 : t.isPrivate })
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
      /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: x, children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": l,
            onClick: () => o((g) => !g),
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
                  onClick: m,
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
const ft = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function bt({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: n }) {
  const i = ft(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: i ? `Son kayıt: ${i}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(k, { variant: "secondary", onClick: r, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        k,
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
const Ie = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", ht = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function se({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function yt({ value: t, onChange: a }) {
  const [s, r] = c.useState(""), n = () => {
    const i = s.trim();
    i && !t.includes(i) && a([...t, i]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((i) => /* @__PURE__ */ e.jsxs(we, { variant: "neutral", children: [
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
      oe,
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
function gt({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: n = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(se, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      oe,
      {
        id: "task-title",
        value: t.title,
        onChange: (i) => s("title", i.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(se, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (i) => s("status", Number(i.target.value)),
          className: Ie,
          children: Object.entries(he).map(([i, l]) => /* @__PURE__ */ e.jsx("option", { value: i, children: l.text }, i))
        }
      ) }),
      /* @__PURE__ */ e.jsx(se, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (i) => s("priority", Number(i.target.value)),
          className: Ie,
          children: Object.entries(Se).map(([i, l]) => /* @__PURE__ */ e.jsx("option", { value: i, children: l.text }, i))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(se, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      ot,
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
      /* @__PURE__ */ e.jsx(se, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        oe,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (i) => s("startDate", i.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(se, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        oe,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (i) => s("dueDate", i.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(se, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(yt, { value: t.tagNames, onChange: (i) => s("tagNames", i) }) }),
    /* @__PURE__ */ e.jsx(se, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (i) => s("description", i.target.value),
        className: ht
      }
    ) })
  ] });
}
const Le = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function ue({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function vt({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(ue, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(ue, { label: "Oluşturulma zamanı", value: Le(t.creationTime) }),
      /* @__PURE__ */ e.jsx(ue, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(ue, { label: "Son güncelleme zamanı", value: Le(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(ue, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const jt = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", wt = "border-brand-500 text-text-primary";
function Nt({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: n }) {
  const i = c.useRef(/* @__PURE__ */ new Map()), l = (x) => {
    var h;
    s(x.code), (h = i.current.get(x.code)) == null || h.focus();
  }, o = (x, h) => {
    x.key === "ArrowRight" ? (x.preventDefault(), l(t[(h + 1) % t.length])) : x.key === "ArrowLeft" ? (x.preventDefault(), l(t[(h - 1 + t.length) % t.length])) : x.key === "Home" ? (x.preventDefault(), l(t[0])) : x.key === "End" && (x.preventDefault(), l(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((x, h) => {
      const p = x.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (f) => {
            f ? i.current.set(x.code, f) : i.current.delete(x.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${x.code}`,
          "aria-selected": p,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: p ? 0 : -1,
          onClick: () => s(x.code),
          onKeyDown: (f) => o(f, h),
          className: `${jt} ${p ? wt : ""}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa ${x.icon}`, "aria-hidden": "true" }),
            x.title
          ]
        },
        x.code
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
const kt = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Ct({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [n, i] = c.useState(""), l = c.useMemo(() => {
    const o = n.trim().toLocaleLowerCase("tr-TR"), x = o ? t.filter((p) => p.title.toLocaleLowerCase("tr-TR").includes(o)) : t, h = /* @__PURE__ */ new Map();
    return x.forEach((p) => {
      const f = h.get(p.category) ?? [];
      f.push(p), h.set(p.category, f);
    }), h;
  }, [t, n]);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Özellik ekle",
      className: "absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl",
      children: [
        /* @__PURE__ */ e.jsx(
          oe,
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
          [...l.entries()].map(([o, x]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: kt[o] ?? o }),
            x.map((h) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa ${h.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: h.title }),
              !h.implemented && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              h.implemented && !h.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === h.code,
                  onClick: () => a(h.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              h.implemented && h.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === h.code,
                  onClick: () => s(h.code),
                  className: "text-[13px] font-medium text-text-negative hover:underline disabled:opacity-50",
                  children: "Kaldır"
                }
              )
            ] }, h.code))
          ] }, o))
        ] })
      ]
    }
  );
}
function Tt({ trail: t = [], current: a, onNavigate: s }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((r) => /* @__PURE__ */ e.jsxs(ce.Fragment, { children: [
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
function Dt(t) {
  var s, r, n;
  const a = (n = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : n.task;
  return a ? Promise.resolve(a.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function _e(t) {
  return de({
    queryKey: ["task-detail", t],
    queryFn: () => Dt(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function Ne(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
function Qe() {
  const [t, a] = c.useState(!1), [s, r] = c.useState(!1), n = c.useRef(null), i = c.useCallback(() => a(!0), []), l = c.useCallback(() => a(!1), []);
  c.useEffect(() => {
    if (!t) return;
    const h = (p) => {
      p.preventDefault(), p.returnValue = "";
    };
    return window.addEventListener("beforeunload", h), () => window.removeEventListener("beforeunload", h);
  }, [t]);
  const o = c.useCallback((h) => {
    if (!t) {
      h == null || h();
      return;
    }
    n.current = h ?? null, r(!0);
  }, [t]), x = c.useCallback((h) => {
    const p = n.current;
    return r(!1), n.current = null, h === "discard" && (a(!1), p == null || p()), h === "save" ? p : null;
  }, []);
  return { isDirty: t, markDirty: i, markClean: l, requestClose: o, pendingClose: s, resolvePendingClose: x };
}
const St = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, ze = "task";
function He() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(ze);
  return t && St.test(t) ? t : null;
}
function Ze() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(ze), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function We(t, a) {
  const s = c.useRef(a);
  s.current = a, c.useEffect(() => {
    if (!t || He() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(ze, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), c.useEffect(() => {
    const r = () => {
      var n;
      (n = s.current) == null || n.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const Et = {
  title: "",
  description: "",
  startDate: "",
  dueDate: "",
  status: 1,
  priority: 2,
  assigneeId: null,
  tagNames: []
};
function zt(t) {
  return t ? {
    title: t.title ?? "",
    description: t.description ?? "",
    startDate: t.startDate ? t.startDate.slice(0, 10) : "",
    dueDate: t.dueDate ? t.dueDate.slice(0, 10) : "",
    status: t.status ?? 1,
    priority: t.priority ?? 2,
    assigneeId: t.assigneeId ?? null,
    tagNames: (t.tags ?? []).map((a) => a.name)
  } : Et;
}
function Je(t) {
  const [a, s] = c.useState(t == null ? void 0 : t.id), r = c.useMemo(() => zt(t), [t]), [n, i] = c.useState(r), [l, o] = c.useState({});
  (t == null ? void 0 : t.id) !== a && (s(t == null ? void 0 : t.id), i(r), o({}));
  const x = c.useCallback((g, d) => {
    i((y) => ({ ...y, [g]: d }));
  }, []), h = c.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(r),
    [n, r]
  ), p = c.useCallback(() => {
    const g = {};
    return n.title.trim() || (g.title = "Başlık zorunlu."), n.startDate || (g.startDate = "Başlangıç tarihi zorunlu."), n.dueDate && n.startDate && n.dueDate < n.startDate && (g.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), o(g), Object.keys(g).length === 0;
  }, [n]), f = c.useCallback(() => ({
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
  }), [n, t]), m = c.useCallback(() => {
    i(r), o({});
  }, [r]);
  return { values: n, setField: x, isDirty: h, errors: l, validate: p, toUpdateDto: f, reset: m };
}
function Re(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function At() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Xe() {
  var n;
  const t = de({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: At,
    staleTime: 3e5,
    retry: !1
  }), a = ((n = t.data) == null ? void 0 : n.items) ?? [], s = a.map((i) => ({ value: i.id, label: Re(i) })), r = new Map(a.map((i) => [i.id, Re(i)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function Ee() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function It(t) {
  const a = Ee();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function et(t) {
  const a = te(), s = ["task-features", t], r = de({
    queryKey: s,
    queryFn: () => It(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = le({
    mutationFn: (o) => Promise.resolve(Ee().addFeature(t, o)),
    onSuccess: n
  }), l = le({
    mutationFn: (o) => Promise.resolve(Ee().removeFeature(t, o)),
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
function Lt({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, n] = c.useState(""), [i, l] = c.useState(!1), [o, x] = c.useState(null), h = te(), p = (a == null ? void 0 : a.subTasks) ?? [], f = () => h.invalidateQueries({ queryKey: ["task-detail", t] }), m = async () => {
    var y, j, v;
    const d = r.trim();
    if (d) {
      l(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: d,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), n(""), await f();
      } catch (u) {
        (v = (j = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : j.error) == null || v.call(j, (u == null ? void 0 : u.message) || "Alt görev eklenemedi.");
      } finally {
        l(!1);
      }
    }
  }, g = async (d) => {
    var y, j, v;
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(d)), await f();
    } catch (u) {
      (v = (j = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : j.error) == null || v.call(j, (u == null ? void 0 : u.message) || "Alt görev silinemedi.");
    } finally {
      x(null);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        oe,
        {
          value: r,
          onChange: (d) => n(d.target.value),
          onKeyDown: (d) => {
            d.key === "Enter" && m();
          },
          placeholder: "Yeni alt görev başlığı",
          disabled: i
        }
      ),
      /* @__PURE__ */ e.jsx(k, { variant: "secondary", onClick: m, disabled: i || !r.trim(), children: "Alt Görev Ekle" })
    ] }),
    p.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz alt görev yok." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: p.map((d) => {
      var y, j;
      return /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between py-2", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => s == null ? void 0 : s(d.id, d.title),
            className: "text-left text-sm font-medium text-text-primary hover:underline",
            children: d.title
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(we, { variant: ((y = he[d.status]) == null ? void 0 : y.variant) ?? "neutral", children: ((j = he[d.status]) == null ? void 0 : j.text) ?? d.status }),
          o === d.id ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary", children: "Emin misiniz?" }),
            /* @__PURE__ */ e.jsx(k, { variant: "destructive", onClick: () => g(d.id), children: "Evet, sil" }),
            /* @__PURE__ */ e.jsx(k, { variant: "ghost", onClick: () => x(null), children: "Vazgeç" })
          ] }) : /* @__PURE__ */ e.jsx(k, { variant: "ghost", onClick: () => x(d.id), "aria-label": `${d.title} alt görevini sil`, children: "Sil" })
        ] })
      ] }, d.id);
    }) })
  ] });
}
function tt() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Rt(t) {
  const a = tt();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function Pt(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, n = ct();
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
function Gt(t) {
  const a = te(), s = ["task-attachments", t], r = de({
    queryKey: s,
    queryFn: () => Rt(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = le({
    mutationFn: (o) => Pt(t, o),
    onSuccess: n
  }), l = le({
    mutationFn: (o) => Promise.resolve(tt().deleteAttachment(o)),
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
function Kt(t) {
  return `${Math.round(t / 1024)} KB`;
}
function Ft({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: n } = Gt(t), i = c.useRef(null), l = async (x) => {
    var p, f, m, g, d, y, j;
    const h = (p = x.target.files) == null ? void 0 : p[0];
    if (h)
      try {
        await s(h), (g = (m = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : m.success) == null || g.call(m, "Dosya yüklendi.");
      } catch (v) {
        (j = (y = (d = window == null ? void 0 : window.abp) == null ? void 0 : d.notify) == null ? void 0 : y.error) == null || j.call(y, (v == null ? void 0 : v.message) || "Dosya yüklenemedi.");
      } finally {
        i.current && (i.current.value = "");
      }
  }, o = async (x, h) => {
    var p, f, m;
    try {
      await r(x);
    } catch (g) {
      (m = (f = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : f.error) == null || m.call(f, (g == null ? void 0 : g.message) || `${h} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("input", { ref: i, type: "file", onChange: l, className: "text-sm", disabled: n }),
      n && /* @__PURE__ */ e.jsx("span", { className: "text-sm text-text-tertiary", children: "Yükleniyor…" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: a.map((x) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between py-2", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("a", { href: x.downloadUrl, target: "_blank", rel: "noreferrer", className: "text-sm font-medium text-text-primary hover:underline", children: x.fileName }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-text-tertiary", children: [
          Kt(x.fileSize),
          " — ",
          x.uploaderName
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(k, { variant: "ghost", onClick: () => o(x.id, x.fileName), "aria-label": `${x.fileName} dosyasini sil`, children: "Sil" })
    ] }, x.id)) })
  ] });
}
function ge() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Bt(t) {
  const a = ge();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function st(t) {
  const a = te(), s = ["task-checklist", t], r = de({
    queryKey: s,
    queryFn: () => Bt(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = le({
    mutationFn: (x) => Promise.resolve(ge().addChecklistItem(t, x)),
    onSuccess: n
  }), l = le({
    mutationFn: (x) => Promise.resolve(ge().toggleChecklistItem(x)),
    onSuccess: n
  }), o = le({
    mutationFn: (x) => Promise.resolve(ge().deleteChecklistItem(x)),
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
function Ot({ taskId: t }) {
  const { items: a, addItem: s, toggleItem: r, removeItem: n } = st(t), [i, l] = c.useState(""), o = async () => {
    var f, m, g;
    const p = i.trim();
    if (p)
      try {
        await s(p), l("");
      } catch (d) {
        (g = (m = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : m.error) == null || g.call(m, (d == null ? void 0 : d.message) || "Madde eklenemedi.");
      }
  }, x = async (p) => {
    var f, m, g;
    try {
      await r(p);
    } catch (d) {
      (g = (m = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : m.error) == null || g.call(m, (d == null ? void 0 : d.message) || "Madde güncellenemedi.");
    }
  }, h = async (p, f) => {
    var m, g, d;
    try {
      await n(p);
    } catch (y) {
      (d = (g = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : g.error) == null || d.call(g, (y == null ? void 0 : y.message) || `${f} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        oe,
        {
          value: i,
          onChange: (p) => l(p.target.value),
          onKeyDown: (p) => {
            p.key === "Enter" && o();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ e.jsx(k, { variant: "secondary", onClick: o, disabled: !i.trim(), children: "Ekle" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz madde eklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "space-y-1.5", children: a.map((p) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-2 py-1", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: p.isDone,
            onChange: () => x(p.id)
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: p.isDone ? "text-text-tertiary line-through" : "text-text-primary", children: p.text })
      ] }),
      /* @__PURE__ */ e.jsx(k, { variant: "ghost", onClick: () => h(p.id, p.text), "aria-label": `${p.text} maddesini sil`, children: "Sil" })
    ] }, p.id)) })
  ] });
}
function $t({ taskId: t, task: a }) {
  const [s, r] = c.useState(""), [n, i] = c.useState(null), [l, o] = c.useState(""), [x, h] = c.useState(!1), p = te(), f = (a == null ? void 0 : a.comments) ?? [], m = async (d) => {
    var y, j, v, u, w, D;
    if (d == null || d.preventDefault(), !(!s.trim() || x)) {
      h(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), p.invalidateQueries({ queryKey: ["task-detail", t] }), (v = (j = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : j.success) == null || v.call(j, "Yorum eklendi.");
      } catch (R) {
        (D = (w = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : w.error) == null || D.call(w, (R == null ? void 0 : R.message) || "Yorum eklenemedi.");
      } finally {
        h(!1);
      }
    }
  }, g = async (d) => {
    var y, j, v, u, w, D;
    if (!(!l.trim() || x)) {
      h(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(d, l.trim())
        ), o(""), i(null), p.invalidateQueries({ queryKey: ["task-detail", t] }), (v = (j = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : j.success) == null || v.call(j, "Yanıt eklendi.");
      } catch (R) {
        (D = (w = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : w.error) == null || D.call(w, (R == null ? void 0 : R.message) || "Yanıt eklenemedi.");
      } finally {
        h(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("form", { onSubmit: m, className: "rounded-lg border border-default p-3 bg-surface-base", children: [
      /* @__PURE__ */ e.jsx(
        "textarea",
        {
          rows: 3,
          value: s,
          onChange: (d) => r(d.target.value),
          placeholder: "Bir yorum veya güncelleme yazın...",
          className: "w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ e.jsx(
        k,
        {
          type: "submit",
          variant: "primary",
          disabled: !s.trim() || x,
          isLoading: x,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    f.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: f.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: d.creatorUserName || d.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: d.creationTime ? new Date(d.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: d.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        k,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => i(n === d.id ? null : d.id),
          children: "Yanıtla"
        }
      ) }),
      n === d.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
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
          /* @__PURE__ */ e.jsx(k, { variant: "ghost", size: "sm", onClick: () => i(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(k, { variant: "primary", size: "sm", disabled: !l.trim() || x, onClick: () => g(d.id), children: "Gönder" })
        ] })
      ] }),
      d.replies && d.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: d.replies.map((y) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: y.creatorUserName || y.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: y.creationTime ? new Date(y.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: y.text })
      ] }, y.id)) })
    ] }, d.id)) })
  ] });
}
function Mt({ task: t }) {
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
function Yt({ task: t }) {
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
function qt({ task: t }) {
  var h;
  const a = typeof window < "u" && !!((h = window == null ? void 0 : window.abp) != null && h.auth), s = a ? Ne("Platform.Expenses.Default") : !0, r = a ? Ne("Platform.Incomes.Default") : !0;
  if (!s && !r)
    return /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Finansal verileri görüntüleme yetkiniz bulunmuyor." });
  const n = (t == null ? void 0 : t.expenses) || [], i = (t == null ? void 0 : t.incomes) || [], l = n.reduce((p, f) => p + (f.amount || 0), 0), o = i.reduce((p, f) => p + (f.amount || 0), 0), x = o - l;
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated", children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Toplam Gelir" }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-base font-semibold text-text-positive", children: [
          o.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
          " ₺"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated", children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Toplam Gider" }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-base font-semibold text-text-negative", children: [
          l.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
          " ₺"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated", children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Net Bakiye" }),
        /* @__PURE__ */ e.jsxs("p", { className: `text-base font-semibold ${x >= 0 ? "text-text-positive" : "text-text-negative"}`, children: [
          x.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
          " ₺"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "rounded-lg border border-subtle p-3 bg-surface-base text-xs text-text-secondary", children: /* @__PURE__ */ e.jsx("p", { children: "Göreve bağlı detaylı harcama veya fatura ekleme işlemleri Finans Modülü üzerinden senkronize yönetilmektedir." }) })
  ] });
}
function Vt({ taskId: t, task: a }) {
  const [s, r] = c.useState("Month"), n = [
    { id: 1, name: "1. Otel Konaklama Anlaşması (Ana)", start: "25.06", end: "10.07", progress: 100, color: "bg-primary" },
    { id: 2, name: "2. Fiyat Tekliflerinin Alınması", start: "25.06", end: "30.06", progress: 100, color: "bg-success" },
    { id: 3, name: "3. Sözleşme Taslağının Hazırlanması", start: "01.07", end: "05.07", progress: 100, color: "bg-indigo-600" },
    { id: 4, name: "4. İmzaların Tamamlanması", start: "06.07", end: "10.07", progress: 80, color: "bg-warning" },
    { id: 5, name: "5. Rezervasyonların Sisteme İşlenmesi", start: "11.07", end: "15.07", progress: 20, color: "bg-amber-500" }
  ];
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-bars-staggered text-primary text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Gantt Zaman Çizelgesi" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 bg-surface-sunken p-1 rounded-lg border border-subtle", children: ["Day", "Week", "Month"].map((i) => /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => r(i),
          className: `px-3 py-1 text-xs font-semibold rounded-md transition-all ${s === i ? "bg-surface-base text-primary shadow-xs" : "text-text-tertiary hover:text-text-primary"}`,
          children: i === "Day" ? "Gün" : i === "Week" ? "Hafta" : "Ay"
        },
        i
      )) })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: n.map((i) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-3 rounded-xl bg-surface-sunken/40 border border-subtle/50 hover:bg-surface-hover/60 transition-all", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-[13px]", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: i.name }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-xs text-text-tertiary font-mono", children: [
          i.start,
          " - ",
          i.end,
          " (%",
          i.progress,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "w-full h-3 bg-surface-base rounded-full overflow-hidden border border-subtle", children: /* @__PURE__ */ e.jsx(
        "div",
        {
          className: `h-full ${i.color} rounded-full transition-all duration-500`,
          style: { width: `${i.progress}%` }
        }
      ) })
    ] }, i.id)) })
  ] });
}
function Ut({ taskId: t, task: a }) {
  const s = [
    { id: 1, code: "OTL-2490", title: "Otel Oda Kontratı Onayı", type: "Öncül (Predecessor)", status: "Tamamlandı", statusColor: "text-success bg-success-subtle" },
    { id: 2, code: "OTL-2510", title: "Finans Ödeme Emri Çıkarılması", type: "Ardıl (Successor)", status: "Bekliyor", statusColor: "text-warning bg-warning-subtle" }
  ];
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link text-primary text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "İlişkili Görevler & Bağımlılıklar" })
      ] }),
      /* @__PURE__ */ e.jsx(k, { size: "sm", variant: "outline", icon: "fa-plus", children: "Bağımlılık Ekle" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col divide-y divide-subtle/50", children: s.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between py-3.5 hover:bg-surface-hover/50 px-2 rounded-lg transition-colors", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-xs font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded", children: [
          "#",
          r.code
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: r.title }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-xs text-text-tertiary", children: [
          "(",
          r.type,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: `text-xs font-semibold px-2.5 py-0.5 rounded-md ${r.statusColor}`, children: r.status })
    ] }, r.id)) })
  ] });
}
function _t() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-warning text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Risk Yönetimi" })
      ] }),
      /* @__PURE__ */ e.jsx(k, { size: "sm", variant: "outline", icon: "fa-plus", children: "Yeni Risk Bildir" })
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
function Qt() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-stamp text-primary text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Onay Süreçleri & İmza Akışı" })
      ] }),
      /* @__PURE__ */ e.jsx(k, { size: "sm", variant: "primary", icon: "fa-check", children: "Onay İste" })
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
function Ht() {
  const [t, a] = c.useState(!1);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-stopwatch text-primary text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Zaman Takibi & Sayaç" })
      ] }),
      /* @__PURE__ */ e.jsx(
        k,
        {
          size: "sm",
          variant: t ? "destructive" : "primary",
          icon: t ? "fa-stop" : "fa-play",
          onClick: () => a(!t),
          children: t ? "Sayacı Durdur" : "Süre Başlat"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "p-4 rounded-xl bg-surface-sunken/40 border border-subtle flex flex-col gap-1", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-text-tertiary uppercase", children: "Toplam Harcanan Süre" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-2xl font-bold text-primary", children: "12 Saat 40 Dk" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "p-4 rounded-xl bg-surface-sunken/40 border border-subtle flex flex-col gap-1", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-text-tertiary uppercase", children: "Tahmini Kalan" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-2xl font-bold text-text-secondary", children: "3 Gün" })
      ] })
    ] })
  ] });
}
function Zt() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-sparkles text-indigo-600 text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Apya AI Asistan & Analiz" })
      ] }),
      /* @__PURE__ */ e.jsx(k, { size: "sm", variant: "primary", icon: "fa-wand-magic-sparkles", children: "Görevi Analiz Et" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 flex flex-col gap-2", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-indigo-900 dark:text-indigo-200", children: "AI Önerisi:" }),
      /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-indigo-700 dark:text-indigo-300 leading-relaxed", children: "Sözleşme taslağı incelendiğinde ödeme takviminin 15 gün vadeli olduğu tespit edildi. Finans ekibine bildirim gönderilmesi tavsiye edilir." })
    ] })
  ] });
}
function Wt() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-square-plus text-success text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Özel Alanlar (Custom Fields)" })
      ] }),
      /* @__PURE__ */ e.jsx(k, { size: "sm", variant: "outline", icon: "fa-plus", children: "Alan Ekle" })
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
function Jt() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-wand-magic-sparkles text-indigo-600 text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Görev Otomasyonları" })
      ] }),
      /* @__PURE__ */ e.jsx(k, { size: "sm", variant: "outline", icon: "fa-plus", children: "Kural Ekle" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "p-3.5 rounded-xl border border-subtle bg-surface-sunken/40 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-medium text-text-primary", children: "Görev 'Tamamlandı' olunca ilgili faturayı otomatik oluştur." }),
      /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-success bg-success-subtle px-2 py-0.5 rounded", children: "Aktif" })
    ] })
  ] });
}
function Xt() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-envelope text-primary text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Bağlantılı E-postalar" })
      ] }),
      /* @__PURE__ */ e.jsx(k, { size: "sm", variant: "outline", icon: "fa-plus", children: "E-posta Bağla" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "p-3.5 rounded-xl border border-subtle bg-surface-sunken/40 flex flex-col gap-1", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: "Otel Rezervasyon Teyidi ve Sözleşme Eki" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary", children: "Gönderen: info@hilton.com • 10.07.2026 09:15" })
    ] })
  ] });
}
function es() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-image text-indigo-600 text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Görsel Dosya Galerisi" })
      ] }),
      /* @__PURE__ */ e.jsx(k, { size: "sm", variant: "outline", icon: "fa-upload", children: "Görsel Yükle" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-3 gap-3", children: ["Otel_Lobi.jpg", "Oda_Tasarim.jpg", "Sozlesme_Imza.jpg"].map((t, a) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 p-2 rounded-xl border border-subtle bg-surface-sunken/40 items-center text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "h-20 w-full bg-surface-base rounded-lg flex items-center justify-center text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-image text-2xl" }) }),
      /* @__PURE__ */ e.jsx("span", { className: "text-xs font-medium text-text-primary truncate w-full mt-1", children: t })
    ] }, a)) })
  ] });
}
function ts() {
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
const Ae = [
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
    component: Lt
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
    component: Ft
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
    component: Ot
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
    component: Vt
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
    component: Ut
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
    component: qt
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
    component: Yt
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
    component: Mt
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
    component: $t
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
    component: _t
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
    component: Qt
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
    component: Ht
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
    component: ts
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
    component: Zt
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
    component: Wt
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
    component: Jt
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
    component: Xt
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
    component: es
  }
];
function at(t = []) {
  const a = new Set(t);
  return Ae.filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function ss(t = []) {
  const a = new Set(t);
  return Ae.filter((s) => !s.isCore).filter((s) => !s.permission || Ne(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let ye = null;
const ve = /* @__PURE__ */ new Set(), ke = /* @__PURE__ */ new Set();
function Pe() {
  ve.forEach((t) => t());
}
function as(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const H = {
  open(t) {
    const a = as(t);
    a && (ye = a, Pe());
  },
  close() {
    ye = null, Pe();
  },
  subscribe(t) {
    return ve.add(t), () => ve.delete(t);
  },
  getSnapshot() {
    return ye;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && ke.add(t);
  },
  emitResult() {
    ke.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    ye = null, ve.clear(), ke.clear();
  }
}, Ge = "apya.taskDetail.fullscreen";
function rt({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, n] = c.useState(t), [i, l] = c.useState([]), { data: o, isLoading: x, isError: h, refetch: p } = _e(r), f = Qe(), m = Je(o), g = Xe(), d = et(r), [y, j] = c.useState("general"), [v, u] = c.useState(!1), w = ce.useRef(null), D = c.useMemo(
    () => at(d.assignedCodes),
    [d.assignedCodes]
  ), R = c.useMemo(
    () => ss(d.assignedCodes),
    [d.assignedCodes]
  ), E = D.find((T) => T.code === y) ?? D[0];
  ce.useEffect(() => {
    E.code !== y && j(E.code);
  }, [E, y]);
  const $ = E == null ? void 0 : E.component, P = te(), [Q, V] = c.useState(
    () => {
      var T;
      return ((T = window.localStorage) == null ? void 0 : T.getItem(Ge)) === "1";
    }
  ), [ee, X] = c.useState(!1), Z = c.useCallback(() => {
    Ze(), s == null || s();
  }, [s]);
  We(t, Z), ce.useEffect(() => {
    m.isDirty ? f.markDirty() : f.markClean();
  });
  const z = c.useCallback(() => f.requestClose(Z), [f, Z]), K = c.useCallback(() => {
    V((T) => {
      var L;
      const I = !T;
      return (L = window.localStorage) == null || L.setItem(Ge, I ? "1" : "0"), I;
    });
  }, []), Y = Ne("Platform.Tasks.Delete"), [U, B] = c.useState(!1), [b, N] = c.useState(!1), C = c.useCallback(async () => {
    var T, I, L, _, F, xe;
    N(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (L = (I = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : I.info) == null || L.call(I, "Başarıyla silindi."), B(!1), f.markClean(), Z();
    } catch (ie) {
      (xe = (F = (_ = window == null ? void 0 : window.abp) == null ? void 0 : _.notify) == null ? void 0 : F.error) == null || xe.call(F, (ie == null ? void 0 : ie.message) || "Görev silinemedi.");
    } finally {
      N(!1);
    }
  }, [r, f, Z]), A = c.useCallback(async () => {
    var T, I, L, _, F, xe;
    if (!m.validate()) return !1;
    X(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, m.toUpdateDto())
      ), await P.invalidateQueries({ queryKey: ["task-detail", r] }), H.emitResult(), (L = (I = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : I.success) == null || L.call(I, "Kaydedildi."), !0;
    } catch (ie) {
      return (xe = (F = (_ = window == null ? void 0 : window.abp) == null ? void 0 : _.notify) == null ? void 0 : F.error) == null || xe.call(F, (ie == null ? void 0 : ie.message) || "Kaydedilemedi."), !1;
    } finally {
      X(!1);
    }
  }, [r, m, f, P]), S = c.useCallback(() => {
    A();
  }, [A]), G = c.useCallback(async () => {
    const T = f.resolvePendingClose("save");
    await A() && (T == null || T());
  }, [f, A]), O = c.useCallback((T, I) => {
    f.requestClose(() => {
      l((L) => [...L, { id: r, title: (o == null ? void 0 : o.title) ?? "" }]), n(T), j("general"), f.markClean();
    });
  }, [f, r, o]), M = c.useCallback((T) => {
    f.requestClose(() => {
      l((I) => {
        const L = I.findIndex((_) => _.id === T);
        return L === -1 ? I : I.slice(0, L);
      }), n(T), j("general"), f.markClean();
    });
  }, [f]), W = c.useCallback(async (T) => {
    var I, L, _;
    try {
      await d.addFeature(T), j(T), u(!1);
    } catch (F) {
      (_ = (L = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : L.error) == null || _.call(L, (F == null ? void 0 : F.message) || "Özellik eklenemedi.");
    }
  }, [d]), J = c.useCallback(async (T) => {
    var I, L, _;
    try {
      await d.removeFeature(T), j((F) => F === T ? "general" : F);
    } catch (F) {
      (_ = (L = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : L.error) == null || _.call(L, (F == null ? void 0 : F.message) || "Özellik kaldırılamadı.");
    }
  }, [d]);
  ce.useEffect(() => {
    if (!v) return;
    const T = (L) => {
      w.current && !w.current.contains(L.target) && u(!1);
    }, I = (L) => {
      L.key === "Escape" && u(!1);
    };
    return document.addEventListener("mousedown", T), document.addEventListener("keydown", I), () => {
      document.removeEventListener("mousedown", T), document.removeEventListener("keydown", I);
    };
  }, [v]);
  const re = x ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(ae, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(ae, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(ae, { className: "h-24 w-full" })
  ] }) : h ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(k, { variant: "ghost", onClick: () => p(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      Tt,
      {
        trail: i,
        current: { id: r, title: (o == null ? void 0 : o.title) ?? "" },
        onNavigate: M
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: w, children: [
      /* @__PURE__ */ e.jsx(
        Nt,
        {
          tabs: D,
          activeCode: E.code,
          onSelect: (T) => {
            j(T), u(!1);
          },
          onOpenPicker: () => u((T) => !T),
          pickerOpen: v
        }
      ),
      v && /* @__PURE__ */ e.jsx(
        Ct,
        {
          entries: R,
          busyCode: d.isMutating ? d.mutatingCode : null,
          onAdd: W,
          onRemove: J
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${E.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          E.code === "general" ? /* @__PURE__ */ e.jsx(
            gt,
            {
              values: m.values,
              errors: m.errors,
              onFieldChange: m.setField,
              assigneeOptions: g.options,
              isLoadingAssignees: g.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(c.Suspense, { fallback: /* @__PURE__ */ e.jsx(ae, { className: "h-24 w-full" }), children: $ && /* @__PURE__ */ e.jsx(
            $,
            {
              taskId: r,
              task: o,
              onOpenSubtask: O
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            vt,
            {
              task: o,
              creatorName: g.nameById.get(o.creatorId),
              lastModifierName: g.nameById.get(o.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), q = a === "page" ? ut : xt;
  return /* @__PURE__ */ e.jsxs(
    q,
    {
      open: !0,
      fullscreen: Q,
      onRequestClose: z,
      title: o ? `Görev Detayı: ${o.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        pt,
        {
          task: o ?? { title: "Yükleniyor…" },
          canDelete: Y,
          fullscreen: Q,
          onToggleFullscreen: K,
          onClose: z,
          onDelete: () => B(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        bt,
        {
          lastSavedAt: o == null ? void 0 : o.lastModificationTime,
          isDirty: f.isDirty,
          isSaving: ee,
          onCancel: z,
          onSave: S
        }
      ),
      children: [
        re,
        f.pendingClose && /* @__PURE__ */ e.jsx(
          is,
          {
            isSaving: ee,
            onStay: () => f.resolvePendingClose("stay"),
            onDiscard: () => f.resolvePendingClose("discard"),
            onSaveAndClose: G
          }
        ),
        U && /* @__PURE__ */ e.jsx(
          rs,
          {
            taskTitle: (o == null ? void 0 : o.title) ?? "",
            busy: b,
            onCancel: () => B(!1),
            onConfirm: C
          }
        )
      ]
    }
  );
}
function rs({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [n, i] = c.useState(""), l = n.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    it,
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
        /* @__PURE__ */ e.jsx(k, { variant: "secondary", onClick: s, disabled: a, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          k,
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
function it({ label: t, title: a, description: s, children: r, actions: n }) {
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
function is({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    it,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(k, { variant: "secondary", onClick: a, disabled: t, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ e.jsx(k, { variant: "destructive", onClick: s, disabled: t, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ e.jsx(k, { variant: "primary", onClick: r, isLoading: t, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
function ns() {
  return /* @__PURE__ */ e.jsxs(me, { children: [
    /* @__PURE__ */ e.jsx(pe, { asChild: !0, children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-default transition-all shadow-sm", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-lock text-[11px] text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { children: "Sınırlı erişim" }),
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[10px] ml-0.5 text-text-tertiary" })
    ] }) }),
    /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
      be,
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
                  k,
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
          /* @__PURE__ */ e.jsx(dt, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const Ce = [
  { id: 1, label: "Bekliyor", color: "bg-neutral-subtle text-text-secondary border-subtle", dot: "bg-gray-400" },
  { id: 2, label: "Sürüyor", color: "bg-warning-subtle text-warning border-warning/20", dot: "bg-warning" },
  { id: 3, label: "Testte", color: "bg-primary-subtle text-primary border-primary/20", dot: "bg-primary" },
  { id: 4, label: "Tamamlandı", color: "bg-success-subtle text-success border-success/20", dot: "bg-success" }
], Te = [
  { id: 1, label: "Düşük", color: "text-text-secondary bg-surface-sunken", icon: "fa-arrow-down" },
  { id: 2, label: "Orta", color: "text-warning bg-warning-subtle", icon: "fa-minus" },
  { id: 3, label: "Yüksek", color: "text-negative bg-negative-subtle", icon: "fa-arrow-up" },
  { id: 4, label: "Kritik", color: "text-negative bg-negative-subtle font-bold", icon: "fa-flag" }
];
function ls({
  task: t = {},
  onClose: a,
  onToggleFullscreen: s,
  isFullscreen: r,
  presentation: n = "modal",
  onFieldChange: i = () => {
  }
}) {
  const [l, o] = c.useState(!1), [x, h] = c.useState(t.status ?? 1), [p, f] = c.useState(t.priority ?? 2), m = Ce.find((v) => v.id === x) || Ce[0], g = Te.find((v) => v.id === p) || Te[1], d = t.code || (t.id ? `#OTL-${t.id.substring(0, 4).toUpperCase()}` : "#OTL-2507"), y = () => {
    var v, u, w, D;
    (v = navigator.clipboard) == null || v.writeText(d), o(!0), (D = (w = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : w.success) == null || D.call(w, `${d} panoya kopyalandı.`), setTimeout(() => o(!1), 2e3);
  }, j = () => {
    var u, w, D, R;
    const v = `${window.location.origin}/Tasks?task=${t.id || ""}`;
    (u = navigator.clipboard) == null || u.writeText(v), (R = (D = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : D.success) == null || R.call(D, "Görev bağlantısı panoya kopyalandı!");
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex flex-col gap-3.5 border-b border-subtle/80 bg-surface-base px-6 py-5", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 min-w-0 flex-1", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 flex-wrap", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: y,
            title: "Kodu Kopyala",
            className: "group flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary-subtle/60 border border-primary/20 text-primary font-mono text-[11px] font-bold tracking-wider hover:bg-primary-subtle hover:border-primary/40 transition-all shadow-xs",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[10px]" }),
              /* @__PURE__ */ e.jsx("span", { children: d.replace("#", "") }),
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l ? "fa-check text-success" : "fa-copy opacity-50 group-hover:opacity-100"} text-[10px] ml-0.5 transition-all` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(me, { children: [
          /* @__PURE__ */ e.jsx(pe, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold border transition-all cursor-pointer shadow-xs hover:opacity-90 ${m.color}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${m.dot} animate-pulse` }),
                /* @__PURE__ */ e.jsx("span", { children: m.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] opacity-70 ml-0.5" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
            be,
            {
              sideOffset: 4,
              align: "start",
              className: "z-50 w-44 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95",
              children: [
                /* @__PURE__ */ e.jsx("div", { className: "text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1", children: "Durumu Değiştir" }),
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: Ce.map((v) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      h(v.id), i("status", v.id);
                    },
                    className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${x === v.id ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${v.dot}` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: v.label }),
                      x === v.id && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ]
                  },
                  v.id
                )) })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ e.jsxs(me, { children: [
          /* @__PURE__ */ e.jsx(pe, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold border border-subtle transition-all cursor-pointer shadow-xs hover:bg-surface-hover ${g.color}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${g.icon} text-[11px]` }),
                /* @__PURE__ */ e.jsx("span", { children: g.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] opacity-70 ml-0.5" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
            be,
            {
              sideOffset: 4,
              align: "start",
              className: "z-50 w-40 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95",
              children: [
                /* @__PURE__ */ e.jsx("div", { className: "text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1", children: "Öncelik Seç" }),
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: Te.map((v) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      f(v.id), i("priority", v.id);
                    },
                    className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${p === v.id ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${v.icon} text-xs` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: v.label }),
                      p === v.id && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ]
                  },
                  v.id
                )) })
              ]
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-3 mt-1", children: /* @__PURE__ */ e.jsx(
        "h1",
        {
          contentEditable: !0,
          suppressContentEditableWarning: !0,
          onBlur: (v) => i("title", v.currentTarget.textContent),
          className: "text-[23px] font-bold tracking-tight text-text-primary hover:text-primary transition-colors focus:outline-none focus:bg-surface-sunken/40 px-1.5 py-0.5 -mx-1.5 rounded-lg cursor-text leading-tight truncate",
          children: t.title || "Başlıksız görev"
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
      /* @__PURE__ */ e.jsx(ns, {}),
      /* @__PURE__ */ e.jsx("div", { className: "h-5 w-px bg-subtle mx-1" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1", children: [
        n === "modal" && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: s,
            title: r ? "Küçült" : "Tam Ekran",
            className: "flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors",
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r ? "fa-compress" : "fa-expand"} text-xs` })
          }
        ),
        /* @__PURE__ */ e.jsxs(me, { children: [
          /* @__PURE__ */ e.jsx(pe, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer Seçenekler",
              className: "flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
            be,
            {
              sideOffset: 4,
              align: "end",
              className: "z-50 w-48 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95",
              children: [
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: j,
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
const Ke = {
  0: { label: "İptal", cls: "text-text-secondary bg-neutral-subtle", icon: "fa-ban" },
  1: { label: "Bekliyor", cls: "text-text-secondary bg-neutral-subtle", icon: "fa-clock" },
  2: { label: "Sürüyor", cls: "text-warning bg-warning-subtle", icon: "fa-spinner" },
  3: { label: "Testte", cls: "text-primary bg-primary-subtle", icon: "fa-flask" },
  4: { label: "Tamamlandı", cls: "text-success bg-success-subtle", icon: "fa-circle-check" }
}, Fe = {
  1: { label: "Düşük", cls: "text-text-secondary bg-surface-sunken", icon: "fa-arrow-down" },
  2: { label: "Orta", cls: "text-warning bg-warning-subtle", icon: "fa-minus" },
  3: { label: "Yüksek", cls: "text-negative bg-negative-subtle", icon: "fa-arrow-up" },
  4: { label: "Kritik", cls: "text-negative bg-negative-subtle", icon: "fa-flag" }
};
function ne({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-bold text-text-tertiary uppercase tracking-wider select-none", children: t }),
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center text-[13px] text-text-primary h-8 min-w-0", children: a })
  ] });
}
function os({
  task: t = {},
  assigneeOptions: a = [],
  onFieldChange: s = () => {
  }
}) {
  const [r, n] = c.useState(
    Array.isArray(t.tags) ? t.tags.map((u) => typeof u == "string" ? u : u == null ? void 0 : u.name).filter(Boolean) : []
  ), [i, l] = c.useState(""), [o, x] = c.useState(!1), [h, p] = c.useState(t.assigneeId ?? null), f = (u) => {
    if (u.key === "Enter" || u.type === "blur") {
      const w = i.trim();
      if (w && !r.includes(w)) {
        const D = [...r, w];
        n(D), s("tagNames", D);
      }
      l(""), x(!1);
    }
  }, m = (u) => {
    const w = r.filter((D) => D !== u);
    n(w), s("tagNames", w);
  }, g = (u) => {
    p(u), s("assigneeId", u);
  }, d = (u) => {
    if (!u) return "—";
    const w = new Date(u);
    return isNaN(w.getTime()) ? u : w.toISOString().split("T")[0];
  }, y = a.find((u) => u.value === h), j = (y == null ? void 0 : y.label) || t.assigneeName || "Atanmamış", v = `https://ui-avatars.com/api/?name=${encodeURIComponent(j)}&background=6366f1&color=fff&size=64`;
  return /* @__PURE__ */ e.jsx("div", { className: "px-[var(--apya-space-6)] py-[var(--apya-space-5)] bg-surface-base border-b border-subtle", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-y-[var(--apya-space-5)] gap-x-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsx(ne, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(me, { children: [
      /* @__PURE__ */ e.jsx(pe, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group focus-visible:outline-none focus-visible:shadow-focus",
          children: [
            /* @__PURE__ */ e.jsx("img", { src: v, alt: j, className: "h-6 w-6 rounded-full border border-subtle shrink-0 object-cover" }),
            /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary text-[13px] group-hover:text-primary transition-colors", children: j }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] text-text-tertiary ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(fe, { children: /* @__PURE__ */ e.jsxs(
        be,
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
                  onClick: () => g(null),
                  className: `flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-left transition-colors ${h ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary font-semibold"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "flex h-5 w-5 items-center justify-center rounded-full bg-surface-sunken text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-user-slash text-[9px]" }) }),
                    /* @__PURE__ */ e.jsx("span", { children: "Atanmamış" })
                  ]
                }
              ),
              a.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-2 py-1.5 text-[12px] text-text-tertiary", children: "Kullanıcı listesi yükleniyor…" }),
              a.map((u) => /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => g(u.value),
                  className: `flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-left transition-colors ${h === u.value ? "bg-primary-subtle text-primary font-semibold" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("img", { src: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.label)}&background=6366f1&color=fff&size=64`, alt: u.label, className: "h-5 w-5 rounded-full" }),
                    /* @__PURE__ */ e.jsx("span", { children: u.label })
                  ]
                },
                u.value
              ))
            ] })
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ e.jsx(ne, { label: "Son Tarih", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors group relative", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          value: d(t.dueDate),
          onChange: (u) => s("dueDate", u.target.value),
          className: "bg-transparent text-text-primary text-[13px] font-medium focus:outline-none cursor-pointer"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(ne, { label: "Başlangıç", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors group relative", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          value: d(t.startDate),
          onChange: (u) => s("startDate", u.target.value),
          className: "bg-transparent text-text-primary text-[13px] font-medium focus:outline-none cursor-pointer"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(ne, { label: "Öncelik", children: (() => {
      const u = Fe[t.priority] || Fe[2];
      return /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 text-[13px] font-medium", children: /* @__PURE__ */ e.jsxs("span", { className: `flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-semibold ${u.cls}`, children: [
        /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-xs` }),
        /* @__PURE__ */ e.jsx("span", { children: u.label })
      ] }) });
    })() }),
    /* @__PURE__ */ e.jsx(ne, { label: "Durum", children: (() => {
      const u = Ke[t.status] || Ke[1];
      return /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 text-[13px] font-medium", children: /* @__PURE__ */ e.jsxs("span", { className: `flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-semibold ${u.cls}`, children: [
        /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-xs` }),
        /* @__PURE__ */ e.jsx("span", { children: u.label })
      ] }) });
    })() }),
    /* @__PURE__ */ e.jsx(ne, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
      r.map((u) => /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "group inline-flex items-center gap-1 bg-primary-subtle text-primary text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors",
          children: [
            /* @__PURE__ */ e.jsx("span", { children: u }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: () => m(u),
                className: "opacity-0 group-hover:opacity-100 hover:text-negative transition-opacity ml-0.5",
                "aria-label": "Etiketi kaldır",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
              }
            )
          ]
        },
        u
      )),
      o ? /* @__PURE__ */ e.jsx(
        "input",
        {
          autoFocus: !0,
          type: "text",
          value: i,
          onChange: (u) => l(u.target.value),
          onKeyDown: f,
          onBlur: f,
          placeholder: "Etiket...",
          className: "h-6 w-16 px-1.5 text-[11px] rounded border border-primary bg-surface-base focus:outline-none"
        }
      ) : /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => x(!0),
          className: "flex items-center justify-center h-5 w-5 rounded-full bg-surface-sunken border border-subtle text-text-tertiary hover:bg-surface-hover hover:text-text-primary hover:border-primary transition-all",
          "aria-label": "Yeni etiket ekle",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[9px]" })
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(ne, { label: "Proje", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary group-hover:text-primary transition-colors text-[13px] truncate max-w-[140px]", children: t.projectName || "Projesiz" })
    ] }) })
  ] }) });
}
const cs = [
  {
    title: "GÖREV & PLANLAMA",
    items: [
      { code: "table", title: "Tablo", desc: "Veri tabloları oluşturun ve filtreleyin", icon: "fa-table-cells", color: "bg-primary-subtle text-primary border-primary/20" },
      { code: "gantt", title: "Gantt Çizelgesi", desc: "İnteraktif zaman çizelgesi ve aşamalar", icon: "fa-bars-staggered", color: "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 border-indigo-200" },
      { code: "timeline", title: "Zaman Çizelgesi", desc: "Görsel kilometre taşları ve timeline", icon: "fa-timeline", color: "bg-negative-subtle text-negative border-negative/20" },
      { code: "dashboard", title: "Gösterge Paneli", desc: "Özel KPI ve performans widget panelleri", icon: "fa-chart-pie", color: "bg-primary-subtle text-primary border-primary/20" },
      { code: "time-tracking", title: "Zaman Takibi", desc: "Canlı süre takibi, sayaç ve raporlama", icon: "fa-stopwatch", color: "bg-warning-subtle text-warning border-warning/20" },
      { code: "forms", title: "Formlar", desc: "Dinamik veri toplama formları", icon: "fa-clipboard-list", color: "bg-primary-subtle text-primary border-primary/20" },
      { code: "checklist", title: "Kontrol Listesi", desc: "Alt görev ve onay kontrol listeleri", icon: "fa-square-check", color: "bg-success-subtle text-success border-success/20" },
      { code: "risks", title: "Risk Yönetimi", desc: "Risk matrisi ve önleyici aksiyonlar", icon: "fa-triangle-exclamation", color: "bg-warning-subtle text-warning border-warning/20" },
      { code: "approvals", title: "Onay Süreçleri", desc: "Çok adımlı yönetici onay akışları", icon: "fa-stamp", color: "bg-primary-subtle text-primary border-primary/20" },
      { code: "dependencies", title: "İlişkili Görevler", desc: "Öncül ve ardıl görev bağlantıları", icon: "fa-link", color: "bg-surface-sunken text-text-secondary border-subtle" }
    ]
  },
  {
    title: "İLETİŞİM",
    items: [
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
];
function ds({
  assignedCodes: t = [],
  onAddFeature: a = () => {
  }
}) {
  const [s, r] = c.useState(!1), [n, i] = c.useState(""), [l, o] = c.useState(!1);
  c.useEffect(() => {
    o(!0);
  }, []);
  const x = (m) => t.includes(m), h = (m) => {
    a(m), r(!1);
  };
  c.useEffect(() => {
    const m = (g) => {
      g.key === "Escape" && s && r(!1);
    };
    return window.addEventListener("keydown", m), () => window.removeEventListener("keydown", m);
  }, [s]);
  const p = cs.map((m) => ({
    ...m,
    items: m.items.filter(
      (g) => g.title.toLowerCase().includes(n.toLowerCase()) || g.desc.toLowerCase().includes(n.toLowerCase()) || m.title.toLowerCase().includes(n.toLowerCase())
    )
  })).filter((m) => m.items.length > 0), f = s && l ? lt.createPortal(
    /* @__PURE__ */ e.jsx(
      "div",
      {
        className: "apya-feature-modal-root fixed inset-0 z-[99999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150",
        onClick: () => r(!1),
        children: /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "relative w-full max-w-3xl rounded-3xl border border-subtle bg-surface-base shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 fade-in duration-200",
            onClick: (m) => m.stopPropagation(),
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
                    value: n,
                    onChange: (m) => i(m.target.value),
                    placeholder: "17 özellik arasında ara (Gantt, Finans, AI, Formlar, Riskler...)",
                    className: "w-full h-10 pl-9 pr-4 text-[13px] rounded-xl border border-subtle bg-surface-base focus:border-primary focus:outline-none focus:shadow-focus transition-all text-text-primary placeholder:text-text-tertiary"
                  }
                ),
                n && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => i(""),
                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-circle-xmark text-xs" })
                  }
                )
              ] }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar", children: [
                p.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-bold text-text-tertiary tracking-widest uppercase", children: m.title }),
                    /* @__PURE__ */ e.jsx("div", { className: "flex-1 h-px bg-subtle/60" })
                  ] }),
                  /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3.5", children: m.items.map((g) => {
                    const d = x(g.code);
                    return /* @__PURE__ */ e.jsxs(
                      "div",
                      {
                        onClick: () => h(g.code),
                        className: `
                                                group flex items-start gap-4 rounded-2xl border p-4 transition-all cursor-pointer select-none
                                                ${d ? "border-primary/50 bg-primary-subtle/30 shadow-xs ring-1 ring-primary/30" : "border-subtle bg-surface-base hover:border-primary/60 hover:bg-surface-hover hover:shadow-md hover:-translate-y-0.5"}
                                            `,
                        children: [
                          /* @__PURE__ */ e.jsx("div", { className: `flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${g.color} shadow-xs text-lg group-hover:scale-105 transition-transform`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${g.icon}` }) }),
                          /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0 flex-1", children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                              /* @__PURE__ */ e.jsx("span", { className: "text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors truncate", children: g.title }),
                              d ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1 text-[11px] font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded-full border border-primary/20", children: [
                                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" }),
                                "Aktif"
                              ] }) : /* @__PURE__ */ e.jsxs("span", { className: "opacity-0 group-hover:opacity-100 text-xs font-semibold text-primary transition-opacity flex items-center gap-1", children: [
                                /* @__PURE__ */ e.jsx("span", { children: "Ekle" }),
                                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-right text-[10px]" })
                              ] })
                            ] }),
                            /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary leading-normal line-clamp-2", children: g.desc })
                          ] })
                        ]
                      },
                      g.code
                    );
                  }) })
                ] }, m.title)),
                p.length === 0 && /* @__PURE__ */ e.jsxs("div", { className: "py-12 text-center flex flex-col items-center gap-2", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass text-3xl text-text-tertiary mb-2" }),
                  /* @__PURE__ */ e.jsx("p", { className: "text-sm font-semibold text-text-primary", children: "Eşleşen özellik bulunamadı" }),
                  /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Lütfen farklı bir arama terimi deneyin." })
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-6 py-3.5 border-t border-subtle bg-surface-sunken/40 text-xs text-text-tertiary", children: [
                /* @__PURE__ */ e.jsx("span", { children: "Toplam 17 profesyonel modül ve sekme" }),
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
    /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        onClick: (m) => {
          m.preventDefault(), m.stopPropagation(), r(!0);
        },
        className: "flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-primary/50 bg-primary-subtle/30 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all focus:outline-none shadow-xs cursor-pointer active:scale-95",
        "aria-label": "Özellik ekle",
        title: "Özellik Ekle (+)",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-xs pointer-events-none" })
      }
    ),
    f
  ] });
}
function xs({
  activeTab: t = "general",
  onTabChange: a = () => {
  },
  visibleTabs: s = [],
  assignedCodes: r = [],
  onAddFeature: n = () => {
  }
}) {
  const i = (l) => l === "subtasks" ? 4 : l === "files" ? 8 : l === "dependencies" ? 2 : null;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-4 w-full py-1.5", children: [
    /* @__PURE__ */ e.jsx("nav", { className: "flex items-center gap-1.5 overflow-x-auto custom-scrollbar", "aria-label": "Görev Sekmeleri", children: s.map((l) => {
      const o = t === l.code, x = i(l.code);
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => a(l.code),
          className: `relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap select-none cursor-pointer ${o ? "text-primary bg-primary-subtle shadow-xs font-bold" : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"}`,
          children: [
            /* @__PURE__ */ e.jsx("span", { children: l.title }),
            x !== null && /* @__PURE__ */ e.jsx("span", { className: `flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full text-[10px] font-bold ${o ? "bg-primary text-white" : "bg-surface-sunken text-text-tertiary"}`, children: x }),
            o && /* @__PURE__ */ e.jsx("span", { className: "absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" })
          ]
        },
        l.code
      );
    }) }),
    /* @__PURE__ */ e.jsx("div", { className: "shrink-0 flex items-center", children: /* @__PURE__ */ e.jsx(
      ds,
      {
        assignedCodes: r,
        onAddFeature: n
      }
    ) })
  ] });
}
function Be({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-start py-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary text-right font-medium max-w-[150px] truncate", title: typeof a == "string" ? a : "", children: a ?? "—" })
  ] });
}
function Oe({ label: t, name: a, avatar: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-center py-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("img", { src: s, alt: a, className: "w-5 h-5 rounded-full border border-subtle object-cover" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary font-semibold", children: a })
    ] })
  ] });
}
function us({ task: t = {}, onDelete: a = () => {
}, nameById: s }) {
  const [r, n] = c.useState(!1), [i, l] = c.useState(!1), o = te(), x = (y, j) => {
    var v;
    return y || j && ((v = s == null ? void 0 : s.get) == null ? void 0 : v.call(s, j)) || "Bilinmiyor";
  }, h = x(t.creatorName, t.creatorId), p = t.lastModificationTime ? x(t.lastModifierName, t.lastModifierId) : "—", f = (y) => y ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(y)) : "—", m = () => {
    var j, v, u, w;
    const y = `${window.location.origin}/Tasks?task=${t.id || ""}`;
    (j = navigator.clipboard) == null || j.writeText(y), (w = (u = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : u.success) == null || w.call(u, "Görev bağlantısı panoya kopyalandı!");
  }, g = async () => {
    var y, j, v, u, w, D, R, E, $, P, Q;
    if (!(!t || r)) {
      n(!0);
      try {
        const V = (v = (j = (y = window == null ? void 0 : window.apya) == null ? void 0 : y.platform) == null ? void 0 : j.tasks) == null ? void 0 : v.task;
        if (V) {
          const ee = {
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
          }, X = await Promise.resolve(V.create(ee));
          await o.invalidateQueries({ queryKey: ["task-detail"] }), (D = (w = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : w.success) == null || D.call(w, "Görev başarıyla çoğaltıldı!"), (E = (R = window.apya) == null ? void 0 : R.taskDetail) != null && E.open && X && window.apya.taskDetail.open(X);
        }
      } catch (V) {
        (Q = (P = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : P.error) == null || Q.call(P, (V == null ? void 0 : V.message) || "Görev çoğaltılamadı.");
      } finally {
        n(!1);
      }
    }
  }, d = async () => {
    var y, j, v, u, w, D, R, E, $;
    if (!(!t.id || i)) {
      l(!0);
      try {
        const P = (v = (j = (y = window == null ? void 0 : window.apya) == null ? void 0 : y.platform) == null ? void 0 : j.tasks) == null ? void 0 : v.task;
        P && (await Promise.resolve(P.updateStatus(t.id, 4)), await o.invalidateQueries({ queryKey: ["task-detail", t.id] }), (D = (w = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : w.info) == null || D.call(w, "Görev arşivlendi (Tamamlandı)."));
      } catch (P) {
        ($ = (E = (R = window == null ? void 0 : window.abp) == null ? void 0 : R.notify) == null ? void 0 : E.error) == null || $.call(E, (P == null ? void 0 : P.message) || "Görev arşivlenemedi.");
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
          Oe,
          {
            label: "Oluşturan",
            name: h,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(h)}&background=6366f1&color=fff&size=64`
          }
        ),
        /* @__PURE__ */ e.jsx(Be, { label: "Oluşturma Tarihi", value: f(t.creationTime) }),
        /* @__PURE__ */ e.jsx(
          Oe,
          {
            label: "Güncelleyen",
            name: p,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(p)}&background=6366f1&color=fff&size=64`
          }
        ),
        /* @__PURE__ */ e.jsx(Be, { label: "Son Güncelleme", value: f(t.lastModificationTime) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs flex flex-col gap-2.5", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary mb-1", children: "Hızlı işlemler" }),
      /* @__PURE__ */ e.jsx(
        k,
        {
          type: "button",
          variant: "outline",
          onClick: m,
          className: "w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]",
          icon: "fa-link",
          children: "Bağlantıyı kopyala"
        }
      ),
      /* @__PURE__ */ e.jsx(
        k,
        {
          type: "button",
          variant: "outline",
          onClick: g,
          disabled: r,
          isLoading: r,
          className: "w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]",
          icon: "fa-copy",
          children: "Çoğalt"
        }
      ),
      /* @__PURE__ */ e.jsx(
        k,
        {
          type: "button",
          variant: "outline",
          onClick: d,
          disabled: i,
          isLoading: i,
          className: "w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]",
          icon: "fa-box-archive",
          children: "Arşivle"
        }
      ),
      /* @__PURE__ */ e.jsx(
        k,
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
function ms({ onFormat: t = () => {
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
function ps({ task: t = {}, onFieldChange: a = () => {
} }) {
  const s = t == null ? void 0 : t.id, r = te(), [n, i] = c.useState(t.description || ""), l = (b, N = "") => {
    const C = document.getElementById("task-v3-desc-input");
    if (!C) return;
    const A = C.selectionStart, S = C.selectionEnd, G = n.substring(A, S) || "metin", O = `${b}${G}${N}`, M = n.substring(0, A) + O + n.substring(S);
    i(M), a("description", M);
  }, o = st(s), [x, h] = c.useState(!0), [p, f] = c.useState(""), [m, g] = c.useState(!1), [d, y] = c.useState(!1), j = o.items ?? [], v = j.filter((b) => b.isDone || b.done).length, u = async (b) => {
    var N, C, A, S, G, O;
    if (b.key === "Enter" || b.type === "blur") {
      const M = p.trim();
      if (M && s) {
        y(!0);
        try {
          await o.addItem(M), (A = (C = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : C.success) == null || A.call(C, "Madde eklendi.");
        } catch (W) {
          (O = (G = (S = window == null ? void 0 : window.abp) == null ? void 0 : S.notify) == null ? void 0 : G.error) == null || O.call(G, (W == null ? void 0 : W.message) || "Madde eklenemedi.");
        } finally {
          y(!1);
        }
      }
      f(""), g(!1);
    }
  }, w = async (b) => {
    var N, C, A;
    if (!(typeof b == "string" && b.startsWith("mock-")))
      try {
        await o.toggleItem(b);
      } catch (S) {
        (A = (C = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : C.error) == null || A.call(C, (S == null ? void 0 : S.message) || "Durum güncellenemedi.");
      }
  }, D = async (b) => {
    var N, C, A, S, G, O;
    if (!(typeof b == "string" && b.startsWith("mock-")))
      try {
        await o.removeItem(b), (A = (C = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : C.info) == null || A.call(C, "Madde silindi.");
      } catch (M) {
        (O = (G = (S = window == null ? void 0 : window.abp) == null ? void 0 : S.notify) == null ? void 0 : G.error) == null || O.call(G, (M == null ? void 0 : M.message) || "Madde silinemedi.");
      }
  }, { data: R = [] } = de({
    queryKey: ["task-comments", s],
    queryFn: async () => {
      var N, C, A;
      const b = (A = (C = (N = window == null ? void 0 : window.apya) == null ? void 0 : N.platform) == null ? void 0 : C.tasks) == null ? void 0 : A.task;
      return !b || !s ? [] : await Promise.resolve(b.getComments(s));
    },
    enabled: !!s,
    staleTime: 1e4
  }), [E, $] = c.useState(""), [P, Q] = c.useState(!0), [V, ee] = c.useState(!1), [X, Z] = c.useState(null), [z, K] = c.useState(""), Y = R.length > 0 ? R : t.comments ?? [], U = async (b) => {
    var C, A, S, G, O, M, W, J, re;
    b.preventDefault();
    const N = E.trim();
    if (!(!N || !s)) {
      ee(!0);
      try {
        const q = (S = (A = (C = window == null ? void 0 : window.apya) == null ? void 0 : C.platform) == null ? void 0 : A.tasks) == null ? void 0 : S.task;
        q && (await Promise.resolve(q.addComment(s, N)), await r.invalidateQueries({ queryKey: ["task-comments", s] }), await r.invalidateQueries({ queryKey: ["task-detail", s] }), (M = (O = (G = window == null ? void 0 : window.abp) == null ? void 0 : G.notify) == null ? void 0 : O.success) == null || M.call(O, "Yorum gönderildi.")), $("");
      } catch (q) {
        (re = (J = (W = window == null ? void 0 : window.abp) == null ? void 0 : W.notify) == null ? void 0 : J.error) == null || re.call(J, (q == null ? void 0 : q.message) || "Yorum gönderilemedi.");
      } finally {
        ee(!1);
      }
    }
  }, B = async (b) => {
    var C, A, S, G, O, M, W, J, re;
    const N = z.trim();
    if (!(!N || !s))
      try {
        const q = (S = (A = (C = window == null ? void 0 : window.apya) == null ? void 0 : C.platform) == null ? void 0 : A.tasks) == null ? void 0 : S.task;
        q && (await Promise.resolve(q.replyToComment(b, N)), await r.invalidateQueries({ queryKey: ["task-comments", s] }), (M = (O = (G = window == null ? void 0 : window.abp) == null ? void 0 : G.notify) == null ? void 0 : O.success) == null || M.call(O, "Yanıt gönderildi.")), K(""), Z(null);
      } catch (q) {
        (re = (J = (W = window == null ? void 0 : window.abp) == null ? void 0 : W.notify) == null ? void 0 : J.error) == null || re.call(J, (q == null ? void 0 : q.message) || "Yanıt gönderilemedi.");
      }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-2.5", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary", children: "Açıklama" }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-subtle bg-surface-base focus-within:border-primary focus-within:shadow-focus transition-all overflow-hidden shadow-xs", children: [
        /* @__PURE__ */ e.jsx(ms, { onFormat: l }),
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            id: "task-v3-desc-input",
            className: "w-full min-h-[110px] p-4 text-[14px] leading-relaxed text-text-primary bg-transparent focus:outline-none resize-y font-sans",
            value: n,
            onChange: (b) => {
              i(b.target.value), a("description", b.target.value);
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
          onClick: () => h(!x),
          className: "flex items-center justify-between cursor-pointer select-none group",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors", children: "Kontrol Listesi" }),
              j.length > 0 && /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-text-tertiary bg-surface-sunken px-2 py-0.5 rounded-full", children: [
                v,
                "/",
                j.length
              ] })
            ] }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "text-text-tertiary group-hover:text-text-primary transition-colors", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid fa-chevron-up transition-transform duration-200 ${x ? "" : "rotate-180"}` }) })
          ]
        }
      ),
      x && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2.5 animate-in fade-in-50", children: [
        j.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden mb-1", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full bg-success transition-all duration-300",
            style: { width: `${v / j.length * 100}%` }
          }
        ) }),
        j.map((b) => {
          const N = b.isDone ?? b.done ?? !1;
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
                      checked: N,
                      onChange: () => w(b.id),
                      className: "h-4 w-4 rounded border-subtle text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `text-[13px] transition-all truncate ${N ? "line-through text-text-tertiary font-normal" : "text-text-primary font-medium"}`, children: b.text })
                ] }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => D(b.id),
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
        m ? /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 mt-1", children: /* @__PURE__ */ e.jsx(
          "input",
          {
            autoFocus: !0,
            type: "text",
            value: p,
            onChange: (b) => f(b.target.value),
            onKeyDown: u,
            onBlur: u,
            disabled: d,
            placeholder: "Yeni kontrol maddesi yazıp Enter'a basın...",
            className: "w-full h-9 px-3 text-[13px] rounded-lg border border-primary bg-surface-base focus:outline-none"
          }
        ) }) : /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => g(!0),
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
          onClick: () => Q(!P),
          className: "flex items-center justify-between cursor-pointer select-none group",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors", children: "Yorumlar & Güncellemeler" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-primary-subtle text-primary text-[11px] font-bold", children: Y.length })
            ] }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "text-text-tertiary group-hover:text-text-primary transition-colors", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid fa-chevron-up transition-transform duration-200 ${P ? "" : "rotate-180"}` }) })
          ]
        }
      ),
      P && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-5 animate-in fade-in-50", children: [
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
                value: E,
                onChange: (b) => $(b.target.value),
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
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => $((b) => b + " [Dosya] "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Dosya Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => $((b) => b + " [Görsel] "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Resim Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-image text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => $((b) => b + " 👍 "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Emoji", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-face-smile text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => $((b) => b + " @Yakup B. "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Bahset (@)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-at text-xs" }) })
              ] }),
              /* @__PURE__ */ e.jsx(
                k,
                {
                  type: "submit",
                  size: "sm",
                  disabled: !E.trim() || V,
                  isLoading: V,
                  className: "bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 h-8 rounded-lg shadow-sm",
                  icon: "fa-paper-plane",
                  children: "Gönder"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-4 divide-y divide-subtle/50", children: Y.map((b) => {
          const N = b.creatorName || b.author || "Yakup B.", C = `https://ui-avatars.com/api/?name=${encodeURIComponent(N)}&background=6366f1&color=fff&size=64`, A = b.creationTime ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(b.creationTime)) : b.date || "10.07.2026 09:30";
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-3 pt-3 items-start first:pt-0", children: [
            /* @__PURE__ */ e.jsx("img", { src: C, alt: N, className: "h-8 w-8 rounded-full border border-subtle shrink-0 object-cover" }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col gap-1", children: [
              /* @__PURE__ */ e.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: N }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary font-mono", children: A })
              ] }) }),
              /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap", children: b.text.split(" ").map((S, G) => S.startsWith("@") ? /* @__PURE__ */ e.jsxs("span", { className: "font-semibold text-primary bg-primary-subtle px-1 py-0.5 rounded mr-1", children: [
                S,
                " "
              ] }, G) : S + " ") }),
              /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-4 mt-1", children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => Z(X === b.id ? null : b.id),
                  className: "text-xs font-semibold text-text-tertiary hover:text-primary transition-colors flex items-center gap-1",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                    /* @__PURE__ */ e.jsx("span", { children: "Yanıtla" })
                  ]
                }
              ) }),
              X === b.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex gap-2 items-center animate-in fade-in-50", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: z,
                    onChange: (S) => K(S.target.value),
                    placeholder: `@${N} kullanıcısına yanıt ver...`,
                    onKeyDown: (S) => {
                      S.key === "Enter" && B(b.id);
                    },
                    className: "flex-1 h-8 px-3 text-[12px] rounded-lg border border-primary bg-surface-base focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(k, { size: "sm", onClick: () => B(b.id), className: "h-8 text-xs bg-primary text-white", children: "Yanıtla" })
              ] })
            ] })
          ] }, b.id);
        }) })
      ] })
    ] })
  ] });
}
function fs({
  lastSavedAt: t,
  isDirty: a,
  isSaving: s,
  onCancel: r,
  onSave: n
}) {
  const i = t ? new Intl.DateTimeFormat("tr-TR", {
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
        /* @__PURE__ */ e.jsx("strong", { className: "font-medium text-text-secondary", children: i })
      ] }),
      a && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 text-warning font-medium ml-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "h-2 w-2 rounded-full bg-warning animate-pulse" }),
        "Kaydedilmemiş değişiklikler var"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ e.jsx(
        k,
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
        k,
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
const $e = "apya.taskDetail.fullscreen";
function nt({
  taskId: t,
  presentation: a = "modal",
  onClose: s,
  switchToTask: r
}) {
  const [n, i] = c.useState(t), { data: l, isLoading: o, isError: x, refetch: h } = _e(n), p = te(), f = Qe(), m = Je(l), g = Xe(), d = et(n), [y, j] = c.useState("general"), [v, u] = c.useState(!1), [w, D] = c.useState(() => {
    try {
      return localStorage.getItem($e) === "true";
    } catch {
      return !1;
    }
  });
  We(n), ce.useEffect(() => {
    m.isDirty ? f.markDirty() : f.markClean();
  });
  const R = c.useCallback(() => {
    Ze(), s == null || s();
  }, [s]), E = c.useCallback(() => f.requestClose(R), [f, R]), $ = c.useCallback(() => {
    D((z) => {
      const K = !z;
      try {
        localStorage.setItem($e, String(K));
      } catch {
      }
      return K;
    });
  }, []), P = c.useMemo(
    () => at(d.assignedCodes),
    [d.assignedCodes]
  ), Q = Ae.find((z) => z.code === y) || P.find((z) => z.code === y) || P[0], V = c.useCallback(async () => {
    var z, K, Y, U, B, b;
    if (!m.validate()) return !1;
    u(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(n, m.toUpdateDto())
      ), await p.invalidateQueries({ queryKey: ["task-detail", n] }), H.emitResult(), (Y = (K = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : K.success) == null || Y.call(K, "Görev başarıyla güncellendi."), !0;
    } catch (N) {
      return (b = (B = (U = window == null ? void 0 : window.abp) == null ? void 0 : U.notify) == null ? void 0 : B.error) == null || b.call(B, (N == null ? void 0 : N.message) || "Kaydedilemedi."), !1;
    } finally {
      u(!1);
    }
  }, [n, m, p]), ee = c.useCallback(async () => {
    var z, K, Y, U, B, b;
    if (window.confirm("Bu görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.delete(n)), (Y = (K = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : K.info) == null || Y.call(K, "Görev silindi."), f.markClean(), R();
      } catch (N) {
        (b = (B = (U = window == null ? void 0 : window.abp) == null ? void 0 : U.notify) == null ? void 0 : B.error) == null || b.call(B, (N == null ? void 0 : N.message) || "Görev silinemedi.");
      }
  }, [n, f, R]), X = c.useCallback(async (z) => {
    var K, Y, U, B, b, N;
    try {
      await d.addFeature(z), j(z), (U = (Y = (K = window == null ? void 0 : window.abp) == null ? void 0 : K.notify) == null ? void 0 : Y.success) == null || U.call(Y, "Özellik başarıyla eklendi.");
    } catch (C) {
      (N = (b = (B = window == null ? void 0 : window.abp) == null ? void 0 : B.notify) == null ? void 0 : b.error) == null || N.call(b, (C == null ? void 0 : C.message) || "Özellik eklenemedi.");
    }
  }, [d]), Z = o ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(ae, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(ae, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(ae, { className: "h-64 w-full" })
  ] }) : x ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(k, { variant: "ghost", onClick: () => h(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      ls,
      {
        task: l,
        onClose: E,
        isFullscreen: w,
        onToggleFullscreen: $,
        presentation: a,
        onFieldChange: m.setField
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "overflow-y-auto max-h-[85vh] custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        os,
        {
          task: l,
          assigneeOptions: g.options,
          onFieldChange: m.setField
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "border-b border-subtle px-6 bg-surface-base", children: /* @__PURE__ */ e.jsx(
        xs,
        {
          activeTab: y,
          onTabChange: j,
          visibleTabs: P,
          assignedCodes: d.assignedCodes,
          onAddFeature: X
        }
      ) }),
      /* @__PURE__ */ e.jsx("div", { className: "p-6", children: y === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start", children: [
        /* @__PURE__ */ e.jsx("div", { className: "min-w-0 space-y-6", children: /* @__PURE__ */ e.jsx(
          ps,
          {
            task: l,
            onFieldChange: m.setField
          }
        ) }),
        /* @__PURE__ */ e.jsx("div", { className: "w-full shrink-0", children: /* @__PURE__ */ e.jsx(
          us,
          {
            task: l,
            onDelete: ee,
            nameById: g.nameById
          }
        ) })
      ] }) : /* @__PURE__ */ e.jsx(c.Suspense, { fallback: /* @__PURE__ */ e.jsx(ae, { className: "h-48 w-full" }), children: Q != null && Q.component ? /* @__PURE__ */ e.jsx(
        Q.component,
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
      fs,
      {
        lastSavedAt: l == null ? void 0 : l.lastModificationTime,
        isDirty: f.isDirty,
        isSaving: v,
        onCancel: E,
        onSave: V
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsx("div", { className: "w-full max-w-6xl mx-auto my-6 rounded-2xl border border-subtle bg-surface-base shadow-sm overflow-hidden", children: Z }) : /* @__PURE__ */ e.jsx(
    Ve,
    {
      open: !0,
      onOpenChange: (z) => {
        z || E();
      },
      children: /* @__PURE__ */ e.jsx(
        Ue,
        {
          title: l != null && l.title ? `Görev Detayı: ${l.title}` : "Görev Detayı",
          fullscreen: w,
          className: "max-w-6xl p-0 overflow-hidden rounded-2xl border border-subtle shadow-2xl bg-surface-base",
          onInteractOutside: (z) => {
            z.preventDefault(), E();
          },
          onEscapeKeyDown: (z) => {
            z.preventDefault(), E();
          },
          children: Z
        }
      )
    }
  );
}
function bs() {
  var a;
  const t = c.useSyncExternalStore(
    H.subscribe,
    H.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsx(
    nt,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        H.close(), H.emitResult();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsx(
    rt,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        H.close(), H.emitResult();
      }
    },
    t
  ) }) : null;
}
function hs() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v2" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : !(window.localStorage.getItem("apya.taskDetail.v2") === "0");
  } catch {
    return !0;
  }
}
function ys() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v3" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v2" || new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : window.localStorage.getItem("apya.taskDetail.v3") === "1" || !0;
  } catch {
    return !0;
  }
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = ys();
window.apya.taskDetailV2Enabled = hs() && !window.apya.taskDetailV3Enabled;
const Me = {
  open: (t) => {
    H.open(t);
  },
  close: () => H.close(),
  onResult: (t) => H.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(Me) : window.apya.taskDetail = Me;
function Ye() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = qe(t), t._reactRoot.render(/* @__PURE__ */ e.jsx(bs, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = He();
    a && H.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Ye) : Ye();
function gs({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsx(
    nt,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsx(
    rt,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) });
}
const De = document.getElementById("task-detail-page-island");
if (De) {
  const t = De.getAttribute("data-task-id");
  t && qe(De).render(/* @__PURE__ */ e.jsx(gs, { taskId: t }));
}
