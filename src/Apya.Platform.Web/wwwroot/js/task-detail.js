import { j as e, r as y, d as Ge, b as ua } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { a as et } from "./QueryProvider-AIUp_Zk5.js";
import { u as te, a as se, b as ae } from "./query-vendor-Bf69L2iP.js";
import { D as pa, i as ma, g as gt, B as ee, I as qe, M as Ha, S as je } from "./Dialog-BdNKdiS6.js";
import { C as fa } from "./Combobox-Cgzidxen.js";
import { r as Qa } from "./httpClient-CRlyQ1eg.js";
import { R as Ne, T as we, P as ke, C as Ce, A as Wa, a as ba, D as Za, b as Ja, c as Xa, d as es, e as ts } from "./ui-vendor-DaE-uom6.js";
import { d as ha } from "./draggableActivation-Ybw9Upbh.js";
function as({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: n,
  footer: l,
  children: o
}) {
  return /* @__PURE__ */ e.jsx(
    pa,
    {
      open: t,
      onOpenChange: (i) => {
        i || a();
      },
      children: /* @__PURE__ */ e.jsx(
        ma,
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
            n,
            /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: o }),
            l
          ] })
        }
      )
    }
  );
}
function ss({ title: t, header: a, footer: s, children: r }) {
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
function rs({ isPrivate: t }) {
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
const yt = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, vt = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function ns({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: n,
  fullscreen: l = !1
}) {
  const [o, i] = y.useState(!1), d = y.useRef(null);
  y.useEffect(() => {
    if (!o) return;
    const x = (m) => {
      d.current && !d.current.contains(m.target) && i(!1);
    }, c = (m) => {
      m.key === "Escape" && i(!1);
    };
    return document.addEventListener("mousedown", x), document.addEventListener("keydown", c), () => {
      document.removeEventListener("mousedown", x), document.removeEventListener("keydown", c);
    };
  }, [o]);
  const u = yt[t == null ? void 0 : t.status] ?? yt[1], b = vt[t == null ? void 0 : t.priority] ?? vt[2], f = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), i(!1);
  }, p = () => {
    var c, m, g, h;
    const x = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (c = navigator.clipboard) == null || c.writeText(x), (h = (g = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : g.info) == null || h.call(g, "Bağlantı kopyalandı."), i(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(gt, { variant: u.variant, children: u.text }),
        /* @__PURE__ */ e.jsx(gt, { variant: b.variant, children: b.text }),
        /* @__PURE__ */ e.jsx(rs, { isPrivate: t == null ? void 0 : t.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": l ? "Küçült" : "Tam ekrana büyüt",
          onClick: n,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: l ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: d, children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": o,
            onClick: () => i((x) => !x),
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
                  onClick: p,
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
const is = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function ls({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: n }) {
  const l = is(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: l ? `Son kayıt: ${l}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(ee, { variant: "secondary", onClick: r, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        ee,
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
const Rt = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", os = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function ge({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function cs({ value: t, onChange: a }) {
  const [s, r] = y.useState(""), n = () => {
    const l = s.trim();
    l && !t.includes(l) && a([...t, l]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((l) => /* @__PURE__ */ e.jsxs(gt, { variant: "neutral", children: [
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
      qe,
      {
        value: s,
        onChange: (l) => r(l.target.value),
        onKeyDown: (l) => {
          l.key === "Enter" || l.key === "," ? (l.preventDefault(), n()) : l.key === "Backspace" && !s && t.length && a(t.slice(0, -1));
        },
        onBlur: n,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function ds({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: n = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(ge, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      qe,
      {
        id: "task-title",
        value: t.title,
        onChange: (l) => s("title", l.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(ge, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (l) => s("status", Number(l.target.value)),
          className: Rt,
          children: Object.entries(yt).map(([l, o]) => /* @__PURE__ */ e.jsx("option", { value: l, children: o.text }, l))
        }
      ) }),
      /* @__PURE__ */ e.jsx(ge, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (l) => s("priority", Number(l.target.value)),
          className: Rt,
          children: Object.entries(vt).map(([l, o]) => /* @__PURE__ */ e.jsx("option", { value: l, children: o.text }, l))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(ge, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      fa,
      {
        id: "task-assignee",
        options: r,
        value: t.assigneeId,
        onChange: (l) => s("assigneeId", l),
        placeholder: n ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: n
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(ge, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        qe,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (l) => s("startDate", l.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(ge, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        qe,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (l) => s("dueDate", l.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(ge, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(cs, { value: t.tagNames, onChange: (l) => s("tagNames", l) }) }),
    /* @__PURE__ */ e.jsx(ge, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (l) => s("description", l.target.value),
        className: os
      }
    ) })
  ] });
}
const Gt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function Ke({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function xs({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(Ke, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(Ke, { label: "Oluşturulma zamanı", value: Gt(t.creationTime) }),
      /* @__PURE__ */ e.jsx(Ke, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(Ke, { label: "Son güncelleme zamanı", value: Gt(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(Ke, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const us = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", ps = "border-brand-500 text-text-primary";
function ms({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: n }) {
  const l = y.useRef(/* @__PURE__ */ new Map()), o = (d) => {
    var u;
    s(d.code), (u = l.current.get(d.code)) == null || u.focus();
  }, i = (d, u) => {
    d.key === "ArrowRight" ? (d.preventDefault(), o(t[(u + 1) % t.length])) : d.key === "ArrowLeft" ? (d.preventDefault(), o(t[(u - 1 + t.length) % t.length])) : d.key === "Home" ? (d.preventDefault(), o(t[0])) : d.key === "End" && (d.preventDefault(), o(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((d, u) => {
      const b = d.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (f) => {
            f ? l.current.set(d.code, f) : l.current.delete(d.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${d.code}`,
          "aria-selected": b,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: b ? 0 : -1,
          onClick: () => s(d.code),
          onKeyDown: (f) => i(f, u),
          className: `${us} ${b ? ps : ""}`,
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
const fs = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function bs({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [n, l] = y.useState(""), o = y.useMemo(() => {
    const i = n.trim().toLocaleLowerCase("tr-TR"), d = i ? t.filter((b) => b.title.toLocaleLowerCase("tr-TR").includes(i)) : t, u = /* @__PURE__ */ new Map();
    return d.forEach((b) => {
      const f = u.get(b.category) ?? [];
      f.push(b), u.set(b.category, f);
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
          qe,
          {
            autoFocus: !0,
            value: n,
            onChange: (i) => l(i.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          o.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...o.entries()].map(([i, d]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: fs[i] ?? i }),
            d.map((u) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
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
          ] }, i))
        ] })
      ]
    }
  );
}
function hs({ trail: t = [], current: a, onNavigate: s }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((r) => /* @__PURE__ */ e.jsxs(Ge.Fragment, { children: [
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
function gs(t) {
  var s, r, n;
  const a = (n = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : n.task;
  return a ? Promise.resolve(a.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function kt(t) {
  return te({
    queryKey: ["task-detail", t],
    queryFn: () => gs(t),
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
function ga() {
  const [t, a] = y.useState(!1), [s, r] = y.useState(!1), n = y.useRef(null), l = y.useCallback(() => a(!0), []), o = y.useCallback(() => a(!1), []);
  y.useEffect(() => {
    if (!t) return;
    const u = (b) => {
      b.preventDefault(), b.returnValue = "";
    };
    return window.addEventListener("beforeunload", u), () => window.removeEventListener("beforeunload", u);
  }, [t]);
  const i = y.useCallback((u) => {
    if (!t) {
      u == null || u();
      return;
    }
    n.current = u ?? null, r(!0);
  }, [t]), d = y.useCallback((u) => {
    const b = n.current;
    return r(!1), n.current = null, u === "discard" && (a(!1), b == null || b()), u === "save" ? b : null;
  }, []);
  return { isDirty: t, markDirty: l, markClean: o, requestClose: i, pendingClose: s, resolvePendingClose: d };
}
const ys = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, Ct = "task";
function ya() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(Ct);
  return t && ys.test(t) ? t : null;
}
function va() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(Ct), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function ja(t, a) {
  const s = y.useRef(a);
  s.current = a, y.useEffect(() => {
    if (!t || ya() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(Ct, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), y.useEffect(() => {
    const r = () => {
      var n;
      (n = s.current) == null || n.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const vs = {
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
  sprint: "",
  budgetLineId: null,
  plannedAmount: null
};
function js(t) {
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
    sprint: t.sprint ?? "",
    budgetLineId: t.budgetLineId ?? null,
    plannedAmount: t.plannedAmount ?? null
  } : vs;
}
function Na(t) {
  const [a, s] = y.useState(t == null ? void 0 : t.id), r = y.useMemo(() => js(t), [t]), [n, l] = y.useState(r), [o, i] = y.useState({});
  (t == null ? void 0 : t.id) !== a && (s(t == null ? void 0 : t.id), l(r), i({}));
  const d = y.useCallback((x, c) => {
    l((m) => ({ ...m, [x]: c }));
  }, []), u = y.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(r),
    [n, r]
  ), b = y.useCallback(() => {
    const x = {};
    return n.title.trim() || (x.title = "Başlık zorunlu."), n.startDate || (x.startDate = "Başlangıç tarihi zorunlu."), n.dueDate && n.startDate && n.dueDate < n.startDate && (x.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), i(x), Object.keys(x).length === 0;
  }, [n]), f = y.useCallback(() => ({
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
    tagNames: n.tagNames,
    estimatedHours: n.estimatedHours,
    taskType: n.taskType || null,
    sprint: n.sprint || null,
    /* DTO'dan DÜŞÜRÜLEMEZ: UpdateAsync bu iki alanı koşulsuz uyguluyor
       (task.SetBudgetLink), dolayısıyla gönderilmediklerinde görevin bütçe
       bağı HER kayıtta sessizce siliniyordu. Eski Razor modali aynı tuzağa
       karşı "koru" bloğu yazmıştı (Tasks/EditModal.cshtml.cs); burada alanlar
       form state'inde taşındığı için koruma kendiliğinden oluşuyor. */
    budgetLineId: n.budgetLineId ?? null,
    plannedAmount: n.plannedAmount ?? null
  }), [n, t]), p = y.useCallback(() => {
    l(r), i({});
  }, [r]);
  return { values: n, setField: d, isDirty: u, errors: o, validate: b, toUpdateDto: f, reset: p };
}
function qt(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function Ns() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function wa() {
  var n;
  const t = te({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Ns,
    staleTime: 3e5,
    retry: !1
  }), a = ((n = t.data) == null ? void 0 : n.items) ?? [], s = a.map((l) => ({ value: l.id, label: qt(l) })), r = new Map(a.map((l) => [l.id, qt(l)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function jt() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function ws(t) {
  const a = jt();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ka(t) {
  const a = se(), s = ["task-features", t], r = te({
    queryKey: s,
    queryFn: () => ws(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), l = ae({
    mutationFn: (i) => Promise.resolve(jt().addFeature(t, i)),
    onSuccess: n
  }), o = ae({
    mutationFn: (i) => Promise.resolve(jt().removeFeature(t, i)),
    onSuccess: n
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
const tt = {
  0: { label: "İptal", icon: "fa-ban", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  1: { label: "Yapılacak", icon: "fa-clock", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  2: { label: "Sürüyor", icon: "fa-spinner", bg: "bg-warning-subtle", fg: "text-warning", dot: "bg-warning" },
  3: { label: "Testte", icon: "fa-flask", bg: "bg-primary-subtle", fg: "text-primary", dot: "bg-primary" },
  4: { label: "Tamamlandı", icon: "fa-circle-check", bg: "bg-success-subtle", fg: "text-success", dot: "bg-success" }
}, Nt = {
  1: { label: "Düşük", icon: "fa-arrow-down", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  2: { label: "Orta", icon: "fa-minus", bg: "bg-warning-subtle", fg: "text-warning" },
  3: { label: "Yüksek", icon: "fa-arrow-up", bg: "bg-negative-subtle", fg: "text-negative" },
  4: { label: "Kritik", icon: "fa-flag", bg: "bg-negative-subtle", fg: "text-negative" }
}, at = [1, 2, 3, 4], ks = [1, 2, 3, 4], be = (t) => tt[t] ?? tt[1], it = (t) => Nt[t] ?? Nt[2];
function Oe(t) {
  if (!t) return "—";
  const a = String(t).trim().split(/\s+/).filter(Boolean);
  return a.length ? (a.length > 1 ? a[0][0] + a[a.length - 1][0] : a[0].slice(0, 2)).toUpperCase() : "—";
}
function Ue(t) {
  return t ? "var(--apya-brand-500)" : "var(--apya-neutral-500)";
}
function Ca(t, a = /* @__PURE__ */ new Date()) {
  if (!t) return { tone: "text-text-tertiary", hint: "" };
  const s = new Date(t);
  if (Number.isNaN(s.getTime())) return { tone: "text-text-tertiary", hint: "" };
  const r = Math.ceil((s.setHours(0, 0, 0, 0) - new Date(a).setHours(0, 0, 0, 0)) / 864e5);
  return r < 0 ? { tone: "text-negative", hint: `${Math.abs(r)} gün gecikti` } : r === 0 ? { tone: "text-warning", hint: "Bugün" } : r <= 3 ? { tone: "text-warning", hint: `${r} gün kaldı` } : { tone: "text-text-tertiary", hint: `${r} gün kaldı` };
}
const Da = "rounded-2xl border border-subtle bg-surface-base shadow-xs", De = `${Da} overflow-hidden`;
function _e({ title: t, badge: a, action: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3.5 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: t }),
      a
    ] }),
    s
  ] });
}
function Ta({ children: t, tone: a = "positive" }) {
  const s = a === "positive" ? "bg-success-subtle text-success" : "bg-neutral-subtle text-text-secondary";
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-full font-mono text-[11px] font-bold ${s}`, children: t });
}
function Ee({ children: t, bg: a, fg: s }) {
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-[7px] text-[10.5px] font-bold ${a} ${s}`, children: t });
}
function ue({ icon: t, title: a, description: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 px-6 py-10 text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-xl text-text-tertiary` }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: a }),
    s && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] leading-[1.55] text-text-tertiary max-w-[420px]", children: s })
  ] });
}
function lt({ name: t, size: a = 24 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Ue(t), fontSize: a * 0.4 },
      title: t || void 0,
      children: Oe(t)
    }
  );
}
const ze = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—", st = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function Sa(t) {
  return t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : "0 KB";
}
function ot(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = Math.floor(a / 3600), r = Math.floor(a % 3600 / 60);
  return !s && !r ? `${a}sn` : s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function Cs(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = (r) => String(r).padStart(2, "0");
  return `${s(Math.floor(a / 3600))}:${s(Math.floor(a / 60) % 60)}:${s(a % 60)}`;
}
const ve = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  image: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  sheet: { icon: "fa-file-excel", bg: "bg-success-subtle", fg: "text-success" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  zip: { icon: "fa-file-zipper", bg: "bg-warning-subtle", fg: "text-warning" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
}, Yt = (t = "") => $a(t) === ve.image;
function $a(t = "") {
  var s;
  const a = ((s = t.split(".").pop()) == null ? void 0 : s.toLowerCase()) ?? "";
  return a === "pdf" ? ve.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(a) ? ve.image : ["doc", "docx", "odt", "rtf", "txt"].includes(a) ? ve.doc : ["xls", "xlsx", "csv", "ods"].includes(a) ? ve.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(a) ? ve.code : ["zip", "rar", "7z", "tar", "gz"].includes(a) ? ve.zip : ve.other;
}
function Ds({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, n] = y.useState(""), [l, o] = y.useState(!1), i = se(), d = (a == null ? void 0 : a.subTasks) ?? [], u = d.filter((x) => x.status === 4).length, b = () => i.invalidateQueries({ queryKey: ["task-detail", t] }), f = async () => {
    var c, m, g;
    const x = r.trim();
    if (x) {
      o(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: x,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), n(""), await b();
      } catch (h) {
        (g = (m = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : m.error) == null || g.call(m, (h == null ? void 0 : h.message) || "Alt görev eklenemedi.");
      } finally {
        o(!1);
      }
    }
  }, p = async (x, c) => {
    var m, g, h;
    x.stopPropagation();
    try {
      await Promise.resolve(window.apya.platform.tasks.task.updateStatus(c.id, c.status === 4 ? 1 : 4)), await b();
    } catch (v) {
      (h = (g = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : g.error) == null || h.call(g, (v == null ? void 0 : v.message) || "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        d.length > 0 && /* @__PURE__ */ e.jsxs(Ta, { children: [
          u,
          "/",
          d.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: f,
          disabled: l || !r.trim(),
          className: `flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${l || !r.trim() ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            "Alt görev ekle"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: De, children: [
      d.map((x) => {
        const c = be(x.status), m = x.status === 4;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => s == null ? void 0 : s(x.id, x.title),
            onKeyDown: (g) => {
              g.key === "Enter" && (s == null || s(x.id, x.title));
            },
            className: "flex items-center gap-3.5 px-4 py-3.5 border-t border-subtle first:border-t-0 hover:bg-surface-raised cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": `${x.title} tamamlandı işaretle`,
                  onClick: (g) => p(g, x),
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white cursor-pointer ${m ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: m && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: x.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${m ? "line-through text-text-tertiary" : "text-text-primary"}`, children: x.title }),
              /* @__PURE__ */ e.jsx(Ee, { bg: c.bg, fg: c.fg, children: c.label }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: ze(x.dueDate) }),
              /* @__PURE__ */ e.jsx(lt, { name: x.assigneeName }),
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-right shrink-0 text-[10px] text-text-tertiary" })
            ]
          },
          x.id
        );
      }),
      /* @__PURE__ */ e.jsx("div", { className: "px-4 py-3 border-t border-subtle first:border-t-0", children: /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: r,
          onChange: (x) => n(x.target.value),
          onKeyDown: (x) => {
            x.key === "Enter" && f();
          },
          disabled: l,
          placeholder: "Yeni alt görev başlığı",
          className: "w-full h-9 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      ) })
    ] }),
    d.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz alt görev yok." })
  ] });
}
function Ea() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Ts(t) {
  const a = Ea();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function Ss(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, n = Qa();
  n && (r.RequestVerificationToken = n);
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
function Dt(t) {
  const a = se(), s = ["task-attachments", t], r = te({
    queryKey: s,
    queryFn: () => Ts(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), l = ae({
    mutationFn: (i) => Ss(t, i),
    onSuccess: n
  }), o = ae({
    mutationFn: (i) => Promise.resolve(Ea().deleteAttachment(i)),
    onSuccess: n
  });
  return {
    attachments: r.data ?? [],
    isLoading: r.isLoading,
    upload: l.mutateAsync,
    remove: o.mutateAsync,
    isUploading: l.isPending
  };
}
function $s({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: n } = Dt(t), l = se(), o = y.useRef(null), [i, d] = y.useState(!1), u = ce("Platform.Tasks.ShareExternally"), b = async (x, c) => {
    var m, g, h;
    try {
      await window.apya.platform.tasks.taskShare.setAttachmentGuestVisibility(x, c), l.invalidateQueries({ queryKey: ["task-attachments", t] });
    } catch (v) {
      (h = (g = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : g.error) == null || h.call(g, (v == null ? void 0 : v.message) || "Görünürlük değiştirilemedi.");
    }
  }, f = async (x) => {
    var c, m, g, h, v, k;
    if (x)
      try {
        await s(x), (g = (m = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : m.success) == null || g.call(m, "Dosya yüklendi.");
      } catch (T) {
        (k = (v = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : v.error) == null || k.call(v, (T == null ? void 0 : T.message) || "Dosya yüklenemedi.");
      } finally {
        o.current && (o.current.value = "");
      }
  }, p = async (x, c) => {
    var m, g, h;
    try {
      await r(x);
    } catch (v) {
      (h = (g = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : g.error) == null || h.call(g, (v == null ? void 0 : v.message) || `${c} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: o,
        type: "file",
        className: "hidden",
        onChange: (x) => {
          var c;
          return f((c = x.target.files) == null ? void 0 : c[0]);
        },
        disabled: n
      }
    ),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "button",
        tabIndex: 0,
        onClick: () => {
          var x;
          return (x = o.current) == null ? void 0 : x.click();
        },
        onKeyDown: (x) => {
          var c;
          x.key === "Enter" && ((c = o.current) == null || c.click());
        },
        onDragOver: (x) => {
          x.preventDefault(), i || d(!0);
        },
        onDragLeave: () => d(!1),
        onDrop: (x) => {
          var c, m;
          x.preventDefault(), d(!1), f((m = (c = x.dataTransfer) == null ? void 0 : c.files) == null ? void 0 : m[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${i ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-[26px] ${i ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: n ? "Yükleniyor…" : i ? "Bırakın, yükleyelim" : "Dosyaları buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, PDF, DOCX · max 25MB" })
        ]
      }
    ),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3", children: a.map((x) => {
      const c = $a(x.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${c.bg} ${c.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: x.fileName, children: x.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: Sa(x.fileSize) })
              ] })
            ] }),
            u && !x.isGuestUpload && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 text-[11px] text-text-tertiary cursor-pointer", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: !!x.isVisibleToGuests,
                  onChange: (m) => b(x.id, m.target.checked)
                }
              ),
              "Dış paylaşımda görünsün"
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2.5 border-t border-subtle", children: [
              /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[11px] text-text-tertiary", children: [
                x.uploaderName,
                x.isGuestUpload ? " · dış" : ""
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-1 shrink-0", children: [
                /* @__PURE__ */ e.jsx(
                  "a",
                  {
                    href: x.downloadUrl,
                    target: "_blank",
                    rel: "noreferrer",
                    title: "İndir",
                    "aria-label": `${x.fileName} dosyasini indir`,
                    className: "flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-primary-subtle hover:text-primary",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-download text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Sil",
                    "aria-label": `${x.fileName} dosyasini sil`,
                    onClick: () => p(x.id, x.fileName),
                    className: "flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                )
              ] })
            ] })
          ]
        },
        x.id
      );
    }) })
  ] });
}
function Je() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Es(t) {
  const a = Je();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Tt(t) {
  const a = se(), s = ["task-checklist", t], r = te({
    queryKey: s,
    queryFn: () => Es(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), l = ae({
    mutationFn: (d) => Promise.resolve(Je().addChecklistItem(t, d)),
    onSuccess: n
  }), o = ae({
    mutationFn: (d) => Promise.resolve(Je().toggleChecklistItem(d)),
    onSuccess: n
  }), i = ae({
    mutationFn: (d) => Promise.resolve(Je().deleteChecklistItem(d)),
    onSuccess: n
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: l.mutateAsync,
    toggleItem: o.mutateAsync,
    removeItem: i.mutateAsync
  };
}
function Ps({ taskId: t }) {
  const { items: a, isLoading: s, addItem: r, toggleItem: n, removeItem: l } = Tt(t), [o, i] = y.useState(""), d = a.filter((f) => f.isDone).length, u = a.length ? Math.round(d / a.length * 100) : 0, b = async () => {
    var p, x, c;
    const f = o.trim();
    if (!(!f || !t)) {
      i("");
      try {
        await r(f);
      } catch (m) {
        i(f), (c = (x = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : x.error) == null || c.call(x, (m == null ? void 0 : m.message) || "Madde eklenemedi.");
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
        /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
          d,
          "/",
          a.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: [
        "%",
        u
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mt-3.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
      "div",
      {
        className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
        style: { width: `${u}%` }
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
      s && a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 py-2 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
      !s && a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 py-2 text-[12.5px] text-text-tertiary", children: "Henüz madde yok. Aşağıdan ilk maddeyi ekleyin." }),
      a.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": f.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
            onClick: () => n(f.id).catch((p) => {
              var x, c, m;
              return (m = (c = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : c.error) == null ? void 0 : m.call(c, (p == null ? void 0 : p.message) || "Durum güncellenemedi.");
            }),
            className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white cursor-pointer transition-colors duration-fast ${f.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
            children: f.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${f.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: f.text }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            title: "Sil",
            "aria-label": `${f.text} maddesini sil`,
            onClick: () => l(f.id).catch((p) => {
              var x, c, m;
              return (m = (c = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : c.error) == null ? void 0 : m.call(c, (p == null ? void 0 : p.message) || "Madde silinemedi.");
            }),
            className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
          }
        )
      ] }, f.id)),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: o,
          onChange: (f) => i(f.target.value),
          onKeyDown: (f) => {
            f.key === "Enter" && b();
          },
          placeholder: "Yeni madde yaz ve Enter'a bas…",
          "aria-label": "Yeni kontrol listesi maddesi",
          className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      )
    ] })
  ] });
}
function Bs({ taskId: t, task: a }) {
  const [s, r] = y.useState(""), [n, l] = y.useState(null), [o, i] = y.useState(""), [d, u] = y.useState(!1), b = se(), f = (a == null ? void 0 : a.comments) ?? [], p = async (c) => {
    var m, g, h, v, k, T;
    if (c == null || c.preventDefault(), !(!s.trim() || d)) {
      u(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), b.invalidateQueries({ queryKey: ["task-detail", t] }), (h = (g = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : g.success) == null || h.call(g, "Yorum eklendi.");
      } catch (D) {
        (T = (k = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : k.error) == null || T.call(k, (D == null ? void 0 : D.message) || "Yorum eklenemedi.");
      } finally {
        u(!1);
      }
    }
  }, x = async (c) => {
    var m, g, h, v, k, T;
    if (!(!o.trim() || d)) {
      u(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(c, o.trim())
        ), i(""), l(null), b.invalidateQueries({ queryKey: ["task-detail", t] }), (h = (g = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : g.success) == null || h.call(g, "Yanıt eklendi.");
      } catch (D) {
        (T = (k = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : k.error) == null || T.call(k, (D == null ? void 0 : D.message) || "Yanıt eklenemedi.");
      } finally {
        u(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("form", { onSubmit: p, className: "rounded-lg border border-default p-3 bg-surface-base", children: [
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
        ee,
        {
          type: "submit",
          variant: "primary",
          disabled: !s.trim() || d,
          isLoading: d,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    f.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: f.map((c) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: c.creatorUserName || c.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: c.creationTime ? new Date(c.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: c.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        ee,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => l(n === c.id ? null : c.id),
          children: "Yanıtla"
        }
      ) }),
      n === c.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: o,
            onChange: (m) => i(m.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(ee, { variant: "ghost", size: "sm", onClick: () => l(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(ee, { variant: "primary", size: "sm", disabled: !o.trim() || d, onClick: () => x(c.id), children: "Gönder" })
        ] })
      ] }),
      c.replies && c.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: c.replies.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: m.creatorUserName || m.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: m.creationTime ? new Date(m.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: m.text })
      ] }, m.id)) })
    ] }, c.id)) })
  ] });
}
function ct() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.taskShare) ?? null;
}
function Ls(t) {
  const a = se(), s = ["task-share-links", t], r = te({
    queryKey: s,
    queryFn: () => {
      const i = ct();
      return i ? Promise.resolve(i.getList(t)) : Promise.reject(new Error("Paylaşım servisi yüklenmedi."));
    },
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), l = ae({
    mutationFn: (i) => Promise.resolve(ct().create({ ...i, taskId: t })),
    onSuccess: n
  }), o = ae({
    mutationFn: (i) => Promise.resolve(ct().revoke(i)),
    onSuccess: n
  });
  return {
    links: r.data ?? [],
    /* isLoading DEĞİL isPending: kalıcı önbellek geri yüklenirken isLoading
       FALSE döner ama liste henüz yoktur; sekme o karede "henüz kimseyle
       paylaşılmadı" yazıyordu — paylaşımı olan görevde bile. */
    isPending: r.isPending,
    error: r.error,
    create: l.mutateAsync,
    revoke: o.mutateAsync,
    isCreating: l.isPending
  };
}
const _t = {
  recipientName: "",
  recipientEmail: "",
  lifetimeDays: 14,
  allowComment: !0,
  allowUpload: !0,
  allowDownload: !0
};
function As(t) {
  return t ? new Date(t).toLocaleDateString("tr-TR") : "—";
}
function Fs({ taskId: t }) {
  const { links: a, isPending: s, create: r, revoke: n, isCreating: l } = Ls(t), [o, i] = y.useState(_t), [d, u] = y.useState(null);
  if (!ce("Platform.Tasks.ShareExternally"))
    return /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Görevi ekip dışıyla paylaşma yetkiniz yok." });
  const f = (g) => (h) => {
    const v = h.target.type === "checkbox" ? h.target.checked : h.target.value;
    i((k) => ({ ...k, [g]: v }));
  }, p = async (g) => {
    var h, v, k;
    if (g.preventDefault(), !!o.recipientName.trim())
      try {
        const T = await r({
          ...o,
          lifetimeDays: Number(o.lifetimeDays) || 14
        });
        u(T), i(_t);
      } catch (T) {
        (k = (v = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : v.error) == null || k.call(v, (T == null ? void 0 : T.message) || "Paylaşım linki üretilemedi.");
      }
  }, x = (g) => `${window.location.origin}${g}`, c = (g) => {
    var h, v, k, T;
    (h = navigator.clipboard) == null || h.writeText(x(g)), (T = (k = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : k.info) == null || T.call(k, "Bağlantı kopyalandı.");
  }, m = async (g) => {
    var h, v, k;
    try {
      await n(g);
    } catch (T) {
      (k = (v = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : v.error) == null || k.call(v, (T == null ? void 0 : T.message) || "Bağlantı iptal edilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    d && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 rounded-[14px] border border-focus bg-primary-subtle p-3.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "text-[12.5px] font-bold text-text-primary", children: [
        "Bağlantı hazır — ",
        /* @__PURE__ */ e.jsx("span", { className: "font-normal", children: "şimdi kopyalayın, bir daha gösterilmeyecek." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("code", { className: "min-w-0 flex-1 truncate rounded-[8px] bg-surface-base px-2.5 py-2 font-mono text-[11.5px] text-text-secondary", children: x(d.url) }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => c(d.url),
            className: "rounded-[8px] bg-primary px-3 py-2 text-[12px] font-bold text-white cursor-pointer",
            children: "Kopyala"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => u(null),
            className: "rounded-[8px] px-3 py-2 text-[12px] font-bold text-text-tertiary cursor-pointer hover:text-text-primary",
            children: "Kapat"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("form", { onSubmit: p, className: "flex flex-col gap-2.5 rounded-[14px] border border-subtle bg-surface-base p-3.5", children: [
      /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary", children: "Yeni paylaşım bağlantısı" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2.5", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            required: !0,
            value: o.recipientName,
            onChange: f("recipientName"),
            placeholder: "Kime? (ad soyad)",
            className: "min-w-0 flex-[2_1_180px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "email",
            value: o.recipientEmail,
            onChange: f("recipientEmail"),
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
            value: o.lifetimeDays,
            onChange: f("lifetimeDays"),
            title: "Geçerlilik (gün)",
            className: "w-[92px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: o.allowComment, onChange: f("allowComment") }),
          "Yorum yazabilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: o.allowUpload, onChange: f("allowUpload") }),
          "Dosya yükleyebilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: o.allowDownload, onChange: f("allowDownload") }),
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
    s ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görev henüz kimseyle paylaşılmadı." }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: a.map((g) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-subtle bg-surface-base p-3",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "truncate text-[12.5px] font-bold text-text-primary", children: [
              g.recipientName,
              g.recipientEmail ? /* @__PURE__ */ e.jsxs("span", { className: "font-normal text-text-tertiary", children: [
                " · ",
                g.recipientEmail
              ] }) : null
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "text-[11.5px] text-text-tertiary", children: [
              g.isActive ? `${As(g.expiresAt)} tarihine kadar geçerli` : g.revokedAt ? "İptal edildi" : "Süresi doldu",
              " · ",
              g.accessCount,
              " erişim",
              " · ",
              g.uploadCount,
              " dosya"
            ] })
          ] }),
          g.isActive && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => m(g.id),
              className: "shrink-0 rounded-[8px] px-3 py-1.5 text-[12px] font-bold text-text-negative cursor-pointer hover:bg-negative-subtle",
              children: "İptal et"
            }
          )
        ]
      },
      g.id
    )) })
  ] });
}
function zs({ task: t }) {
  var s;
  const a = [];
  return t != null && t.creationTime && a.push({
    id: "created",
    icon: "fa-plus",
    bg: "bg-success-subtle",
    fg: "text-success",
    actor: t.creatorUserName || t.creatorName || "Sistem / Kullanıcı",
    event: "görevi oluşturdu",
    time: st(t.creationTime)
  }), t != null && t.lastModificationTime && a.push({
    id: "modified",
    icon: "fa-pen",
    bg: "bg-warning-subtle",
    fg: "text-warning",
    actor: t.lastModifierUserName || t.lastModifierName || "Kullanıcı",
    event: "görevi güncelledi",
    time: st(t.lastModificationTime)
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
    a.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Aktivite kaydı bulunamadı." }) }) : /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: a.map((r, n) => {
      const l = n === a.length - 1;
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
const Be = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : null;
function Is({ label: t, value: a, hint: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4 px-3.5 py-3", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[12.5px] font-semibold text-text-secondary", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 text-right", children: [
      /* @__PURE__ */ e.jsx("span", { className: "block text-[12.5px] font-bold text-text-primary break-words", children: a ?? "—" }),
      s && /* @__PURE__ */ e.jsx("span", { className: "block text-[11px] text-text-tertiary", children: s })
    ] })
  ] });
}
function Ks({ task: t = {}, nameById: a }) {
  const s = (n) => {
    var l;
    return n && ((l = a == null ? void 0 : a.get) == null ? void 0 : l.call(a, n)) || null;
  }, r = [
    { label: "Görev kodu", value: t.code || "—" },
    {
      label: "Oluşturulma",
      value: Be(t.creationTime),
      hint: s(t.creatorId) ? `${s(t.creatorId)} tarafından` : null
    },
    {
      label: "Son güncelleme",
      value: Be(t.lastModificationTime) ?? "Henüz güncellenmedi",
      hint: s(t.lastModifierId) ? `${s(t.lastModifierId)} tarafından` : null
    },
    { label: "Planlanan başlangıç", value: Be(t.startDate) },
    { label: "Termin", value: Be(t.dueDate) }
  ];
  return t.completedDate && r.push({ label: "Tamamlanma", value: Be(t.completedDate) }), t.cancelledDate && r.push({
    label: "İptal",
    value: Be(t.cancelledDate),
    hint: t.cancelReason || null
  }), /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-3.5 py-3 border-b border-subtle bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clock-rotate-left text-[13px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: "Kayıt bilgileri" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "divide-y divide-subtle", children: r.map((n) => /* @__PURE__ */ e.jsx(Is, { ...n }, n.label)) })
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11.5px] text-text-tertiary", children: "Alan bazında değişiklik günlüğü (hangi alan, eski/yeni değer) henüz yayınlanmadı." })
  ] });
}
function Ms(t) {
  var s, r, n;
  const a = (n = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.projectBudgets) == null ? void 0 : n.projectBudget;
  return a != null && a.getRecordFormLookup ? Promise.resolve(a.getRecordFormLookup(t)) : Promise.reject(new Error("Bütçe servisi yüklenmedi."));
}
function Rs(t) {
  var n;
  const a = ce("Platform.Projects.ViewBudget"), s = te({
    queryKey: ["task-detail", "budget-lines", t],
    queryFn: () => Ms(t),
    enabled: !!t && a,
    staleTime: 6e4,
    retry: !1
  }), r = ((n = s.data) == null ? void 0 : n.lines) ?? [];
  return {
    lines: r,
    options: r.map((l) => ({ value: l.id, label: l.code ? `${l.code} · ${l.name}` : l.name })),
    canViewBudget: a,
    isLoading: s.isLoading
  };
}
function rt(t) {
  var s, r;
  const a = (r = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.ajax) == null ? void 0 : r.call(s, t);
  return a ? new Promise((n, l) => {
    a.done(n).fail(l);
  }) : Promise.reject(new Error("ABP köprüsü yüklenmedi."));
}
function nt(t, a = {}) {
  var n;
  const s = ((n = window == null ? void 0 : window.abp) == null ? void 0 : n.appPath) ?? "/", r = new URLSearchParams({ handler: t });
  return Object.entries(a).forEach(([l, o]) => {
    o != null && o !== "" && r.append(l, o);
  }), `${s}Documents/Matching?${r.toString()}`;
}
const Pa = () => ce("Platform.Documents.Default"), Gs = () => ce("Platform.Documents.ManageMeta");
function qs(t) {
  const a = !!t && Pa(), s = te({
    queryKey: ["task-detail", "expense-matches", t],
    queryFn: () => rt({ url: nt("Matches", { projectId: t }), type: "GET" }),
    enabled: a,
    staleTime: 6e4,
    retry: !1
  }), r = /* @__PURE__ */ new Map();
  return (s.data ?? []).forEach((n) => {
    r.has(n.expenseId) || r.set(n.expenseId, []), r.get(n.expenseId).push(n);
  }), { byExpense: r, enabled: a, isLoading: s.isLoading };
}
function Ys(t, a) {
  const s = te({
    queryKey: ["task-detail", "expense-candidates", t],
    queryFn: () => rt({ url: nt("Candidates", { expenseId: t }), type: "GET" }),
    enabled: !!t && a && Pa(),
    staleTime: 3e4,
    retry: !1
  });
  return { candidates: s.data ?? [], isLoading: s.isLoading };
}
function _s(t) {
  const a = se(), s = (l) => {
    a.invalidateQueries({ queryKey: ["task-detail", "expense-matches", t] }), a.invalidateQueries({ queryKey: ["task-detail", "expense-candidates", l] });
  }, r = ae({
    mutationFn: ({ documentFileId: l, expenseId: o, score: i }) => rt({
      url: nt("CreateMatch"),
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ documentFileId: l, expenseId: o, score: i ?? 0 })
    }),
    onSuccess: (l, o) => s(o.expenseId)
  }), n = ae({
    mutationFn: ({ matchId: l }) => rt({ url: nt("RemoveMatch", { matchId: l }), type: "POST" }),
    onSuccess: (l, o) => s(o.expenseId)
  });
  return { link: r, unlink: n, isBusy: r.isPending || n.isPending };
}
function Os(t) {
  return t == null ? "—" : new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 2 }).format(t);
}
function Us({ expenseId: t, projectId: a, matches: s }) {
  const { candidates: r, isLoading: n } = Ys(t, !0), { link: l, unlink: o, isBusy: i } = _s(a), d = Gs(), u = new Set(s.map((p) => p.documentFileId)), b = r.filter((p) => !u.has(p.documentFileId)), f = (p, x) => {
    var c, m, g;
    return (g = (m = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : m.error) == null ? void 0 : g.call(m, (p == null ? void 0 : p.message) || x);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3 px-4 pb-3.5 pt-1 bg-surface-raised", children: [
    s.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Bağlı evraklar" }),
      s.map((p) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-[11px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12px] text-text-primary", children: p.documentFileName }),
        p.annexNumber && /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary", children: [
          "EK-",
          p.annexNumber
        ] }),
        d && /* @__PURE__ */ e.jsx(
          ee,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            disabled: i,
            onClick: () => o.mutate(
              { matchId: p.id, expenseId: t },
              { onError: (x) => f(x, "Evrak bağı kaldırılamadı.") }
            ),
            children: "Kaldır"
          }
        )
      ] }, p.id))
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Aday evraklar" }),
      n && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Adaylar aranıyor…" }),
      !n && b.length === 0 && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Eşleşen aday yok. Evrak Belgeler modülünden yüklenip buradan bağlanır." }),
      b.map((p) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[11px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12px] text-text-primary", children: p.displayName }),
        /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
          Os(p.amount),
          " · ",
          ze(p.documentDate)
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: `shrink-0 font-mono text-[11px] font-bold ${p.isStrong ? "text-success" : "text-text-tertiary"}`, children: [
          "%",
          p.score
        ] }),
        d && /* @__PURE__ */ e.jsx(
          ee,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            disabled: i,
            onClick: () => l.mutate(
              { documentFileId: p.documentFileId, expenseId: t, score: p.score },
              { onError: (x) => f(x, "Evrak bağlanamadı.") }
            ),
            children: "Bağla"
          }
        )
      ] }, p.documentFileId))
    ] })
  ] });
}
function fe(t, a) {
  const s = a || "TRY";
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: s, minimumFractionDigits: 2 }).format(t || 0);
  } catch {
    return `${(t || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${s}`.trim();
  }
}
function dt(t, a, s) {
  var o, i, d, u, b;
  const r = (o = window == null ? void 0 : window.abp) == null ? void 0 : o.ModalManager;
  if (!r) {
    (u = (d = (i = window == null ? void 0 : window.abp) == null ? void 0 : i.notify) == null ? void 0 : d.error) == null || u.call(d, "Kayıt formu yüklenemedi.");
    return;
  }
  const n = ((b = window == null ? void 0 : window.abp) == null ? void 0 : b.appPath) ?? "/", l = new r({ viewUrl: `${n}${t}?TaskId=${a}` });
  l.onResult(() => s == null ? void 0 : s()), l.open();
}
function Vs({ taskId: t }) {
  const a = se(), s = ce("Platform.Expenses.Create"), r = ce("Platform.Incomes.Create"), n = ce("Platform.Invoices.Create");
  if (!t || !s && !r && !n)
    return null;
  const l = () => a.invalidateQueries({ queryKey: ["task-detail", t] });
  return /* @__PURE__ */ e.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
    s && /* @__PURE__ */ e.jsxs(
      ee,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => dt("Expenses/CreateModal", t, l),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-up text-[11px]" }),
          "Gider ekle"
        ]
      }
    ),
    r && /* @__PURE__ */ e.jsxs(
      ee,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => dt("Incomes/CreateModal", t, l),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-down text-[11px]" }),
          "Gelir ekle"
        ]
      }
    ),
    n && /* @__PURE__ */ e.jsxs(
      ee,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => dt("Invoices/CreateModal", t, l),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-invoice text-[11px]" }),
          "Fatura ekle"
        ]
      }
    )
  ] });
}
const Ot = {
  0: { label: "Taslak", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  1: { label: "Gönderildi", bg: "bg-primary-subtle", fg: "text-primary" },
  2: { label: "Ödendi", bg: "bg-success-subtle", fg: "text-success" },
  3: { label: "İptal", bg: "bg-neutral-subtle", fg: "text-text-tertiary" },
  4: { label: "Gecikti", bg: "bg-negative-subtle", fg: "text-negative" }
};
function Hs({ invoices: t, action: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: De, children: [
    /* @__PURE__ */ e.jsx(_e, { title: "Faturalar", action: a }),
    t.map((s) => {
      const r = Ot[s.status] ?? Ot[0];
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-7 w-7 rounded-lg bg-neutral-subtle text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-invoice text-[11px]" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "flex-1 min-w-0 truncate text-[12.5px] font-semibold text-text-primary", children: [
              s.invoiceNumber || "Fatura",
              /* @__PURE__ */ e.jsx("span", { className: "ml-2 font-normal text-text-tertiary", children: s.direction === 1 ? "Alış" : "Satış" })
            ] }),
            /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
              "vade ",
              ze(s.dueDate)
            ] }),
            /* @__PURE__ */ e.jsx(Ee, { bg: r.bg, fg: r.fg, children: r.label }),
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary",
                style: { fontVariantNumeric: "tabular-nums" },
                children: fe(s.totalAmount, s.currency)
              }
            )
          ]
        },
        s.id
      );
    })
  ] });
}
function Qs({ line: t, projectId: a, matches: s, docsEnabled: r }) {
  const [n, l] = y.useState(!1), o = t.kind === "income";
  return /* @__PURE__ */ e.jsxs("div", { className: "border-t border-subtle first:border-t-0", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5 px-4 py-3 hover:bg-surface-raised", children: [
      /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-7 w-7 rounded-lg bg-neutral-subtle text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${o ? "fa-arrow-down" : "fa-arrow-up"} text-[11px]` }) }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] font-semibold text-text-primary", children: t.title || (o ? "Gelir" : "Gider") }),
      r && /* @__PURE__ */ e.jsxs(
        ee,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          "aria-expanded": n,
          onClick: () => l((i) => !i),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-[11px]" }),
            s.length > 0 ? `Evrak ${s.length}` : "Evrak"
          ]
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: ze(t.date) }),
      o ? /* @__PURE__ */ e.jsx(Ee, { bg: "bg-success-subtle", fg: "text-success", children: "Gelir" }) : /* @__PURE__ */ e.jsx(Ee, { bg: "bg-warning-subtle", fg: "text-warning", children: "Gider" }),
      /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: `shrink-0 font-mono text-[12.5px] font-bold ${o ? "text-success" : "text-text-primary"}`,
          style: { fontVariantNumeric: "tabular-nums" },
          children: [
            o ? "+" : "−",
            fe(t.amount, t.currency)
          ]
        }
      )
    ] }),
    r && n && /* @__PURE__ */ e.jsx(Us, { expenseId: t.id, projectId: a, matches: s })
  ] });
}
function xt({ label: t, value: a, tone: s, note: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: `font-mono text-[22px] font-bold tracking-[-.02em] ${s}`, style: { fontVariantNumeric: "tabular-nums" }, children: a }),
    r && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
  ] });
}
function Ws({ options: t, isLoading: a, lineId: s, planned: r, onField: n }) {
  return a ? null : t.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12px] text-text-tertiary", children: "Bu projede bütçe kalemi tanımlı değil — kalemler Finans & Bütçe ekranından açılır." }) : /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Bütçe kalemi" }),
      /* @__PURE__ */ e.jsx(
        fa,
        {
          options: t,
          value: s ?? void 0,
          onChange: (l) => n("budgetLineId", l ?? null),
          placeholder: "Kalem seç",
          size: "sm"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Görev bütçesi" }),
      /* @__PURE__ */ e.jsx(
        Ha,
        {
          value: r,
          onValueChange: (l) => n("plannedAmount", l),
          currency: "TRY",
          min: 0,
          size: "sm",
          disabled: !s
        }
      )
    ] })
  ] });
}
function Zs({ task: t, form: a, spentByCurrency: s }) {
  const r = (a ? a.values.projectId : t == null ? void 0 : t.projectId) ?? null, { options: n, lines: l, canViewBudget: o, isLoading: i } = Rs(r), d = !!a && o && !!r, u = (a ? a.values.budgetLineId : t == null ? void 0 : t.budgetLineId) ?? null, b = (a ? a.values.plannedAmount : t == null ? void 0 : t.plannedAmount) ?? null;
  if (!d && (!u || b == null))
    return null;
  const f = l.find((k) => k.id === u), p = f ? f.remainingAmount : t == null ? void 0 : t.budgetLineRemaining, x = s, c = !!u && b != null, m = (b ?? 0) - x, g = b > 0 ? Math.round(x / b * 100) : 0, h = m < 0, v = () => {
    a.setField("budgetLineId", null), a.setField("plannedAmount", null);
  };
  return (
    /* Kırpmayan kart ŞART: kalem seçicisinin listesi kartın içine absolute
       konumlanır, TAB_CARD'ın overflow-hidden'ı onu alt kenarda keserdi. */
    /* @__PURE__ */ e.jsxs("div", { className: Da, children: [
      /* @__PURE__ */ e.jsx(
        _e,
        {
          title: "Bütçe bağı",
          action: d && u ? /* @__PURE__ */ e.jsx(ee, { type: "button", variant: "ghost", size: "sm", onClick: v, children: "Bağı kaldır" }) : null
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "px-4 pb-4 pt-1 flex flex-col gap-3", children: [
        d ? /* @__PURE__ */ e.jsx(
          Ws,
          {
            options: n,
            isLoading: i,
            lineId: u,
            planned: b,
            onField: a.setField
          }
        ) : /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-semibold text-accent", children: t.budgetLineName || "Bütçe kalemi" }) }),
        p != null && /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "kalemde kalan ",
          fe(p, "TRY")
        ] }),
        c && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3", children: [
            /* @__PURE__ */ e.jsx(ut, { label: "Görev bütçesi", value: fe(b, "TRY") }),
            /* @__PURE__ */ e.jsx(ut, { label: "Gerçekleşen", value: fe(x, "TRY") }),
            /* @__PURE__ */ e.jsx(
              ut,
              {
                label: "Kalan",
                value: fe(m, "TRY"),
                tone: h ? "text-negative" : "text-success"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
              "div",
              {
                className: `h-full rounded-full ${h ? "bg-negative" : g >= 80 ? "bg-warning" : "bg-success"}`,
                style: { width: `${Math.min(Math.max(g, 0), 100)}%` }
              }
            ) }),
            /* @__PURE__ */ e.jsxs("div", { className: "mt-1 text-[11.5px] text-text-tertiary", children: [
              "%",
              g,
              h && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative", children: "· görev bütçesi aşıldı" })
            ] })
          ] })
        ] })
      ] })
    ] })
  );
}
function ut({ label: t, value: a, tone: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx(
      "span",
      {
        className: `font-mono text-[15px] font-bold ${s || "text-text-primary"}`,
        style: { fontVariantNumeric: "tabular-nums" },
        children: a
      }
    )
  ] });
}
function Js({ task: t, taskId: a, form: s }) {
  const r = (t == null ? void 0 : t.expenses) || [], n = (t == null ? void 0 : t.incomes) || [], l = (t == null ? void 0 : t.invoices) || [], o = (s ? s.values.projectId : t == null ? void 0 : t.projectId) ?? null, { byExpense: i, enabled: d } = qs(o), u = r.filter((m) => (m.currency || "TRY") === "TRY").reduce((m, g) => m + (g.amount || 0), 0), b = /* @__PURE__ */ e.jsx(Zs, { task: t, form: s, spentByCurrency: u }), f = /* @__PURE__ */ e.jsx(Vs, { taskId: a ?? (t == null ? void 0 : t.id) });
  if (r.length === 0 && n.length === 0 && l.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      b,
      /* @__PURE__ */ e.jsxs("div", { className: De, children: [
        /* @__PURE__ */ e.jsx(_e, { title: "Görev Finansı", action: f }),
        /* @__PURE__ */ e.jsx(
          ue,
          {
            icon: "fa-coins",
            title: "Kayıt yok",
            description: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
          }
        )
      ] })
    ] });
  const x = Array.from(new Set([...r, ...n].map((m) => m.currency || "TRY"))).map((m) => {
    const g = n.filter((v) => (v.currency || "TRY") === m).reduce((v, k) => v + (k.amount || 0), 0), h = r.filter((v) => (v.currency || "TRY") === m).reduce((v, k) => v + (k.amount || 0), 0);
    return { cur: m, inc: g, exp: h, net: g - h };
  }), c = [
    ...n.map((m) => ({ ...m, kind: "income" })),
    ...r.map((m) => ({ ...m, kind: "expense" }))
  ].sort((m, g) => new Date(g.date || 0) - new Date(m.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    b,
    x.map(({ cur: m, inc: g, exp: h, net: v }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(xt, { label: `Toplam Gelir (${m})`, value: fe(g, m), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(xt, { label: `Toplam Gider (${m})`, value: fe(h, m), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        xt,
        {
          label: `Net Bakiye (${m})`,
          value: fe(v, m),
          tone: v >= 0 ? "text-success" : "text-negative",
          note: v >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, m)),
    l.length > 0 && /* @__PURE__ */ e.jsx(Hs, { invoices: l, action: c.length === 0 ? f : null }),
    c.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: De, children: [
      /* @__PURE__ */ e.jsx(_e, { title: "Finans kalemleri", action: f }),
      c.map((m) => /* @__PURE__ */ e.jsx(
        Qs,
        {
          line: m,
          projectId: o,
          matches: m.kind === "expense" ? i.get(m.id) ?? [] : [],
          docsEnabled: d && m.kind === "expense"
        },
        `${m.kind}-${m.id}`
      ))
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11px] text-text-tertiary", children: "Buradan eklenen kayıt göreve ve projesine etiketlenir; düzenleme/silme Finans modülünden yapılır. Evraklar Belgeler modülünde yaşar, buradan gidere bağlanır." })
  ] });
}
function Xs({ taskId: t }) {
  const { attachments: a, isLoading: s, upload: r, remove: n, isUploading: l } = Dt(t), o = y.useRef(null), [i, d] = y.useState(!1), u = a.filter((p) => Yt(p.fileName)), b = async (p) => {
    var x, c, m, g, h, v, k, T, D;
    if (p) {
      if (!Yt(p.name)) {
        (m = (c = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : c.error) == null || m.call(c, "Galeriye yalnız görsel dosya yüklenebilir.");
        return;
      }
      try {
        await r(p), (v = (h = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : h.success) == null || v.call(h, "Görsel yüklendi.");
      } catch (B) {
        (D = (T = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : T.error) == null || D.call(T, (B == null ? void 0 : B.message) || "Görsel yüklenemedi.");
      } finally {
        o.current && (o.current.value = "");
      }
    }
  }, f = async (p, x) => {
    var c, m, g;
    try {
      await n(p);
    } catch (h) {
      (g = (m = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : m.error) == null || g.call(m, (h == null ? void 0 : h.message) || `${x} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: o,
        type: "file",
        accept: "image/*",
        className: "hidden",
        onChange: (p) => {
          var x;
          return b((x = p.target.files) == null ? void 0 : x[0]);
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
          var p;
          return (p = o.current) == null ? void 0 : p.click();
        },
        onKeyDown: (p) => {
          var x;
          p.key === "Enter" && ((x = o.current) == null || x.click());
        },
        onDragOver: (p) => {
          p.preventDefault(), i || d(!0);
        },
        onDragLeave: () => d(!1),
        onDrop: (p) => {
          var x, c;
          p.preventDefault(), d(!1), b((c = (x = p.dataTransfer) == null ? void 0 : x.files) == null ? void 0 : c[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${i ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l ? "fa-circle-notch fa-spin" : "fa-images"} text-[26px] ${i ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: l ? "Yükleniyor…" : i ? "Bırakın, yükleyelim" : "Görselleri buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, JPG, GIF, WEBP, SVG · max 25MB" })
        ]
      }
    ),
    s && u.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !s && u.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görevde henüz görsel yok. Yüklediğiniz görseller Dosyalar sekmesinde de görünür." }),
    u.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3", children: u.map((p) => /* @__PURE__ */ e.jsxs(
      "figure",
      {
        className: "group relative m-0 flex flex-col overflow-hidden rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
        children: [
          /* @__PURE__ */ e.jsx(
            "a",
            {
              href: p.downloadUrl,
              target: "_blank",
              rel: "noreferrer",
              title: `${p.fileName} — tam boyutta aç`,
              className: "block aspect-[4/3] overflow-hidden bg-neutral-subtle",
              children: /* @__PURE__ */ e.jsx(
                "img",
                {
                  src: p.downloadUrl,
                  alt: p.fileName,
                  loading: "lazy",
                  className: "h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                }
              )
            }
          ),
          /* @__PURE__ */ e.jsxs("figcaption", { className: "flex items-center justify-between gap-2 p-2.5", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12px] font-bold text-text-primary", title: p.fileName, children: p.fileName }),
              /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: Sa(p.fileSize) })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                title: "Sil",
                "aria-label": `${p.fileName} gorselini sil`,
                onClick: () => f(p.id, p.fileName),
                className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
              }
            )
          ] })
        ]
      },
      p.id
    )) })
  ] });
}
const er = [
  { key: "title", label: "Başlık", align: "left" },
  { key: "status", label: "Durum", align: "left" },
  { key: "priority", label: "Öncelik", align: "left" },
  { key: "assignee", label: "Atanan", align: "left" },
  { key: "dueDate", label: "Termin", align: "right" }
];
function Ut(t, a) {
  switch (a) {
    case "title":
      return (t.title || "").toLocaleLowerCase("tr");
    case "status":
      return t.status ?? -1;
    case "priority":
      return t.priority ?? -1;
    case "assignee":
      return (t.assigneeName || "").toLocaleLowerCase("tr");
    case "dueDate":
      return t.dueDate ? new Date(t.dueDate).getTime() : null;
    default:
      return null;
  }
}
function tr(t, a, s, r) {
  const n = Ut(t, s), l = Ut(a, s), o = n === null || n === "", i = l === null || l === "";
  return o && i ? 0 : o ? 1 : i ? -1 : n === l ? 0 : (n < l ? -1 : 1) * (r === "asc" ? 1 : -1);
}
function ar({ task: t = {}, onOpenSubtask: a }) {
  const [s, r] = y.useState({ key: "dueDate", dir: "asc" }), n = (t == null ? void 0 : t.subTasks) ?? [], l = y.useMemo(
    () => [...n].sort((i, d) => tr(i, d, s.key, s.dir)),
    [n, s.key, s.dir]
  ), o = (i) => r((d) => d.key === i ? { key: i, dir: d.dir === "asc" ? "desc" : "asc" } : { key: i, dir: "asc" });
  return n.length === 0 ? /* @__PURE__ */ e.jsx(
    ue,
    {
      icon: "fa-table",
      title: "Alt görev yok",
      description: "Alt Görevler sekmesinden ekledikleriniz burada tablo olarak listelenir."
    }
  ) : /* @__PURE__ */ e.jsx("div", { className: `${De} overflow-x-auto`, children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse text-[12.5px]", children: [
    /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsx("tr", { className: "bg-surface-raised", children: er.map((i) => {
      const d = s.key === i.key;
      return /* @__PURE__ */ e.jsx(
        "th",
        {
          scope: "col",
          "aria-sort": d ? s.dir === "asc" ? "ascending" : "descending" : "none",
          className: `px-3.5 py-2.5 border-b border-subtle font-bold text-text-secondary whitespace-nowrap ${i.align === "right" ? "text-right" : "text-left"}`,
          children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => o(i.key),
              className: `inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer font-bold ${d ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`,
              children: [
                i.label,
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid text-[9px] ${d ? s.dir === "asc" ? "fa-arrow-up-short-wide" : "fa-arrow-down-wide-short" : "fa-sort opacity-40"}` })
              ]
            }
          )
        },
        i.key
      );
    }) }) }),
    /* @__PURE__ */ e.jsx("tbody", { children: l.map((i) => {
      const d = be(i.status), u = it(i.priority), b = Ca(i.dueDate);
      return /* @__PURE__ */ e.jsxs(
        "tr",
        {
          onClick: () => a == null ? void 0 : a(i.id),
          className: "border-b border-subtle last:border-b-0 cursor-pointer hover:bg-surface-raised",
          children: [
            /* @__PURE__ */ e.jsxs("td", { className: "px-3.5 py-2.5 max-w-[320px]", children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: (f) => {
                    f.stopPropagation(), a == null || a(i.id);
                  },
                  title: i.title,
                  className: `block w-full truncate bg-transparent border-0 p-0 text-left font-semibold cursor-pointer ${i.status === 4 ? "line-through text-text-tertiary" : "text-text-primary"}`,
                  children: i.title
                }
              ),
              i.code && /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: i.code })
            ] }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(Ee, { bg: d.bg, fg: d.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.icon} text-[9px] mr-1` }),
              d.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(Ee, { bg: u.bg, fg: u.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-[9px] mr-1` }),
              u.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: i.assigneeName ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ e.jsx(lt, { name: i.assigneeName, size: 22 }),
              /* @__PURE__ */ e.jsx("span", { className: "truncate text-text-secondary", children: i.assigneeName })
            ] }) : /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: "Atanmadı" }) }),
            /* @__PURE__ */ e.jsxs("td", { className: `px-3.5 py-2.5 text-right whitespace-nowrap ${b.tone}`, children: [
              i.dueDate ? ze(i.dueDate) : "—",
              b.hint && /* @__PURE__ */ e.jsx("div", { className: "text-[11px]", children: b.hint })
            ] })
          ]
        },
        i.id
      );
    }) })
  ] }) });
}
function sr({ taskId: t, task: a = {}, onOpenSubtask: s }) {
  const r = se(), n = (a == null ? void 0 : a.subTasks) ?? [], [l, o] = y.useState(null), [i, d] = y.useState(null), u = async (b, f) => {
    var x, c, m;
    const p = n.find((g) => g.id === b);
    if (!(!p || p.status === f)) {
      d(b);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.updateStatus(b, f)), await r.invalidateQueries({ queryKey: ["task-detail", t] });
      } catch (g) {
        (m = (c = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : c.error) == null || m.call(c, (g == null ? void 0 : g.message) || "Alt görev durumu güncellenemedi.");
      } finally {
        d(null);
      }
    }
  };
  return n.length === 0 ? /* @__PURE__ */ e.jsx(
    ue,
    {
      icon: "fa-table-columns",
      title: "Alt görev yok",
      description: "Alt Görevler sekmesinden ekledikleriniz burada duruma göre sütunlanır."
    }
  ) : (
    // 🔴 `grid-cols-[repeat(4,minmax(190px,1fr))]` KULLANMA: Tailwind bu keyfi
    // değer için kural ÜRETMİYOR (repeat(auto-fit,…) üretiliyor, repeat(4,…)
    // üretilmiyor) → sınıf HTML'de durur ama CSS'i yoktur ve ızgara sessizce
    // tek sütuna düşer. auto-fit zaten istediğimizi yapıyor: dört durum
    // sütunu geniş alanda yan yana, dar alanda alt alta sarar.
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 items-start", children: at.map((b) => {
      const f = be(b), p = n.filter((c) => c.status === b), x = l === b;
      return /* @__PURE__ */ e.jsxs(
        "section",
        {
          "aria-label": `${f.label} sütunu`,
          onDragOver: (c) => {
            c.preventDefault(), l !== b && o(b);
          },
          onDragLeave: () => o((c) => c === b ? null : c),
          onDrop: (c) => {
            var g;
            c.preventDefault(), o(null);
            const m = (g = c.dataTransfer) == null ? void 0 : g.getData("text/plain");
            m && u(m, b);
          },
          className: `flex flex-col gap-2 p-2.5 rounded-2xl border bg-surface-raised min-h-[120px] transition-colors duration-fast ${x ? "border-focus bg-primary-subtle" : "border-subtle"}`,
          children: [
            /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-2 px-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${f.dot}` }),
              /* @__PURE__ */ e.jsx("h3", { className: "m-0 flex-1 text-[12px] font-bold text-text-primary", children: f.label }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: p.length })
            ] }),
            p.map((c) => {
              const m = it(c.priority);
              return /* @__PURE__ */ e.jsxs(
                "article",
                {
                  draggable: !0,
                  onDragStart: (g) => {
                    var h;
                    return (h = g.dataTransfer) == null ? void 0 : h.setData("text/plain", c.id);
                  },
                  role: "button",
                  tabIndex: 0,
                  onClick: () => s == null ? void 0 : s(c.id),
                  onKeyDown: (g) => {
                    g.key === "Enter" && (s == null || s(c.id));
                  },
                  className: `flex flex-col gap-2 p-2.5 rounded-[12px] border border-subtle bg-surface-base shadow-xs cursor-pointer hover:border-focus hover:shadow-md ${i === c.id ? "opacity-60" : ""}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary line-clamp-2", children: c.title }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                      /* @__PURE__ */ e.jsxs("span", { className: `text-[10.5px] font-bold ${m.fg}`, children: [
                        /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${m.icon} text-[9px] mr-1` }),
                        m.label
                      ] }),
                      c.dueDate && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: ze(c.dueDate) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2 border-t border-subtle", children: [
                      c.assigneeName ? /* @__PURE__ */ e.jsx(lt, { name: c.assigneeName, size: 20 }) : /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] text-text-tertiary", children: "Atanmadı" }),
                      /* @__PURE__ */ e.jsx(
                        "select",
                        {
                          "aria-label": `${c.title} durumunu değiştir`,
                          value: c.status,
                          onClick: (g) => g.stopPropagation(),
                          onChange: (g) => u(c.id, Number(g.target.value)),
                          className: "h-[24px] px-1.5 rounded-[6px] border border-subtle bg-surface-base text-[10.5px] text-text-secondary cursor-pointer",
                          children: at.map((g) => /* @__PURE__ */ e.jsx("option", { value: g, children: be(g).label }, g))
                        }
                      )
                    ] })
                  ]
                },
                c.id
              );
            })
          ]
        },
        b
      );
    }) })
  );
}
const rr = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık"
], nr = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], Vt = (t) => String(t).padStart(2, "0"), Ba = (t, a, s) => `${t}-${Vt(a + 1)}-${Vt(s)}`;
function wt(t) {
  if (!t) return null;
  const a = /^(\d{4}-\d{2}-\d{2})/.exec(String(t));
  return a ? a[1] : null;
}
function ir(t, a) {
  const r = (new Date(t, a, 1).getDay() + 6) % 7, n = new Date(t, a + 1, 0).getDate(), l = [];
  for (let o = 0; o < 42; o++) {
    const i = o - r + 1;
    l.push(i >= 1 && i <= n ? { key: Ba(t, a, i), day: i, inMonth: !0 } : { key: `bos-${o}`, day: null, inMonth: !1 });
  }
  return l;
}
function lr(t) {
  const a = /* @__PURE__ */ new Map(), s = (r, n) => {
    const l = wt(r);
    l && (a.has(l) || a.set(l, []), a.get(l).push(n));
  };
  s(t == null ? void 0 : t.startDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "start", isSelf: !0, status: t == null ? void 0 : t.status }), s(t == null ? void 0 : t.dueDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "due", isSelf: !0, status: t == null ? void 0 : t.status });
  for (const r of (t == null ? void 0 : t.subTasks) ?? [])
    s(r.startDate, { id: r.id, title: r.title, kind: "start", isSelf: !1, status: r.status }), s(r.dueDate, { id: r.id, title: r.title, kind: "due", isSelf: !1, status: r.status });
  return a;
}
function or({ task: t = {}, onOpenSubtask: a }) {
  const s = y.useMemo(() => lr(t), [t]), [r, n] = y.useState(() => {
    const u = wt(t == null ? void 0 : t.startDate) ?? wt(t == null ? void 0 : t.dueDate);
    if (u) {
      const [f, p] = u.split("-").map(Number);
      return { year: f, month: p - 1 };
    }
    const b = /* @__PURE__ */ new Date();
    return { year: b.getFullYear(), month: b.getMonth() };
  }), l = y.useMemo(() => ir(r.year, r.month), [r.year, r.month]), o = (u) => n(({ year: b, month: f }) => {
    const p = f + u;
    return { year: b + Math.floor(p / 12), month: (p % 12 + 12) % 12 };
  }), i = /* @__PURE__ */ new Date(), d = Ba(i.getFullYear(), i.getMonth(), i.getDate());
  return s.size === 0 ? /* @__PURE__ */ e.jsx(
    ue,
    {
      icon: "fa-calendar",
      title: "Takvimde gösterilecek tarih yok",
      description: "Göreve başlangıç veya termin tarihi girildiğinde burada aylık takvimde görünür."
    }
  ) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-3.5 py-3 border-b border-subtle bg-surface-raised", children: [
      /* @__PURE__ */ e.jsxs("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: [
        rr[r.month],
        " ",
        r.year
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Önceki ay",
            onClick: () => o(-1),
            className: "flex items-center justify-center h-7 w-7 rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-left text-[11px]" })
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => n({ year: i.getFullYear(), month: i.getMonth() }),
            className: "h-7 px-2.5 rounded-lg border border-subtle bg-surface-base text-[11.5px] font-semibold text-text-secondary hover:text-text-primary cursor-pointer",
            children: "Bugün"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Sonraki ay",
            onClick: () => o(1),
            className: "flex items-center justify-center h-7 w-7 rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-right text-[11px]" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-subtle bg-surface-raised", children: nr.map((u) => /* @__PURE__ */ e.jsx("span", { className: "px-2 py-1.5 text-center text-[11px] font-bold text-text-tertiary", children: u }, u)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: l.map((u) => {
      const b = u.inMonth ? s.get(u.key) ?? [] : [], f = u.key === d;
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: `flex flex-col gap-1 min-h-[76px] p-1.5 border-r border-b border-subtle last-of-type:border-r-0 ${u.inMonth ? "" : "bg-surface-sunken"}`,
          children: [
            u.inMonth && /* @__PURE__ */ e.jsx("span", { className: `self-end font-mono text-[11px] font-bold ${f ? "flex items-center justify-center h-[18px] w-[18px] rounded-full bg-primary text-white" : "text-text-tertiary"}`, children: u.day }),
            b.map((p, x) => {
              const c = be(p.status);
              return /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  title: `${p.title} — ${p.kind === "due" ? "termin" : "başlangıç"}`,
                  onClick: () => {
                    p.isSelf || a == null || a(p.id);
                  },
                  className: `flex items-center gap-1 w-full px-1.5 py-[3px] rounded-[6px] text-left text-[10.5px] font-semibold ${c.bg} ${c.fg} ${p.isSelf ? "cursor-default" : "cursor-pointer hover:brightness-95"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${p.kind === "due" ? "fa-flag-checkered" : "fa-play"} text-[8px] shrink-0` }),
                    /* @__PURE__ */ e.jsx("span", { className: "truncate", children: p.title })
                  ]
                },
                `${p.id}-${p.kind}-${x}`
              );
            })
          ]
        },
        u.key
      );
    }) })
  ] });
}
function Ye() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function cr(t) {
  const a = Ye();
  return a ? Promise.resolve(a.getDocuments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function dr(t) {
  const a = se(), s = ["task-documents", t], r = te({
    queryKey: s,
    queryFn: () => cr(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), l = ae({
    mutationFn: (d) => Promise.resolve(Ye().createDocument(t, d)),
    onSuccess: n
  }), o = ae({
    mutationFn: ({ id: d, title: u, content: b }) => Promise.resolve(Ye().updateDocument(d, { title: u, content: b })),
    onSuccess: (d) => {
      n(), d != null && d.id && a.setQueryData(["task-document", d.id], d);
    }
  }), i = ae({
    mutationFn: (d) => Promise.resolve(Ye().deleteDocument(d)),
    onSuccess: n
  });
  return {
    documents: r.data ?? [],
    isLoading: r.isLoading,
    createDocument: l.mutateAsync,
    updateDocument: o.mutateAsync,
    removeDocument: i.mutateAsync,
    isSaving: o.isPending
  };
}
function xr(t) {
  return te({
    queryKey: ["task-document", t],
    queryFn: () => Promise.resolve(Ye().getDocument(t)),
    enabled: !!t,
    retry: !1
  });
}
function $e(t) {
  return (t == null ? void 0 : t.closest('[role="dialog"]')) ?? void 0;
}
const ur = [
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
], pr = '<table class="apya-rte-table"><tr><th>Kolon 1</th><th>Kolon 2</th></tr><tr><td>Değer</td><td>Değer</td></tr></table><p><br></p>', mr = '<div class="apya-rte-imgph">görsel yer tutucu</div><p><br></p>';
function fr(t) {
  return t ? /<[a-z][\s\S]*>/i.test(t) ? t : `<p>${t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>` : "";
}
function La({ value: t, onChange: a, mentionName: s = "ekip arkadaşı", placeholder: r }) {
  const n = y.useRef(null), l = y.useRef(fr(t)), [o, i] = y.useState(!1), [d, u] = y.useState("https://"), b = y.useRef(null), f = (h, v) => {
    var k, T;
    (k = n.current) == null || k.focus();
    try {
      document.execCommand(h, !1, v);
    } catch {
    }
    a == null || a(((T = n.current) == null ? void 0 : T.innerHTML) ?? "");
  }, p = () => {
    const h = window.getSelection();
    b.current = h && h.rangeCount ? h.getRangeAt(0).cloneRange() : null;
  }, x = () => {
    const h = b.current;
    if (!h) return;
    const v = window.getSelection();
    v.removeAllRanges(), v.addRange(h);
  }, c = () => {
    var v;
    const h = d.trim();
    i(!1), !(!h || h === "https://") && ((v = n.current) == null || v.focus(), x(), f("createLink", h), u("https://"));
  }, m = (h) => {
    switch (h.cmd) {
      case "link":
        p();
        return;
      case "image":
        f("insertHTML", mr);
        return;
      case "table":
        f("insertHTML", pr);
        return;
      case "mention":
        f("insertHTML", `<span class="apya-rte-mention">@${s}</span>&nbsp;`);
        return;
      default:
        f(h.cmd, h.arg);
    }
  }, g = "flex shrink-0 items-center justify-center h-7 w-7 rounded-[7px] border-0 bg-transparent text-text-secondary cursor-pointer hover:bg-surface-base hover:text-primary hover:shadow-xs";
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-[14px] border border-default bg-surface-base overflow-hidden shadow-xs", children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-0.5 px-2 py-1.5 border-b border-subtle bg-neutral-subtle overflow-x-auto custom-scrollbar", children: ur.map((h) => {
      const v = /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          title: h.title,
          onMouseDown: (k) => {
            k.preventDefault(), m(h);
          },
          className: `${g} ${h.gap ? "ml-1.5" : ""}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${h.regular ? "regular" : "solid"} ${h.icon} text-[12px]` })
        },
        h.cmd + h.icon
      );
      return h.cmd !== "link" ? v : /* @__PURE__ */ e.jsxs(Ne, { modal: !0, open: o, onOpenChange: i, children: [
        /* @__PURE__ */ e.jsx(we, { asChild: !0, children: v }),
        /* @__PURE__ */ e.jsx(ke, { container: $e(n.current), children: /* @__PURE__ */ e.jsxs(
          Ce,
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
                    value: d,
                    onChange: (k) => u(k.target.value),
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
        ref: n,
        contentEditable: !0,
        suppressContentEditableWarning: !0,
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": "Görev açıklaması",
        "data-ph": r ?? "Bu görevin detayları nelerdir? (@kişi, #etiket)…",
        onInput: (h) => a == null ? void 0 : a(h.currentTarget.innerHTML),
        className: "apya-rte-surface min-h-[150px] p-4 text-[13.5px] leading-[1.7] text-text-primary bg-surface-base focus:outline-none",
        dangerouslySetInnerHTML: { __html: l.current }
      }
    )
  ] });
}
function br({ taskId: t }) {
  const { documents: a, isLoading: s, createDocument: r, updateDocument: n, removeDocument: l, isSaving: o } = dr(t), [i, d] = y.useState(null), [u, b] = y.useState(""), [f, p] = y.useState(""), [x, c] = y.useState(!1), { data: m, isFetching: g } = xr(i);
  y.useEffect(() => {
    !m || m.id !== i || (b(m.title ?? ""), p(m.content ?? ""), c(!1));
  }, [m == null ? void 0 : m.id]);
  const h = async () => {
    var D, B, G;
    try {
      const L = await r("Yeni belge");
      L != null && L.id && d(L.id);
    } catch (L) {
      (G = (B = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : B.error) == null || G.call(B, (L == null ? void 0 : L.message) || "Belge oluşturulamadı.");
    }
  }, v = async () => {
    var B, G, L, z, I, K, O, Q, U;
    const D = u.trim();
    if (!D) {
      (L = (G = (B = window == null ? void 0 : window.abp) == null ? void 0 : B.notify) == null ? void 0 : G.error) == null || L.call(G, "Belge başlığı boş olamaz.");
      return;
    }
    try {
      await n({ id: i, title: D, content: f }), c(!1), (K = (I = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : I.success) == null || K.call(I, "Belge kaydedildi.");
    } catch (Z) {
      (U = (Q = (O = window == null ? void 0 : window.abp) == null ? void 0 : O.notify) == null ? void 0 : Q.error) == null || U.call(Q, (Z == null ? void 0 : Z.message) || "Belge kaydedilemedi.");
    }
  }, k = async (D, B) => {
    var G, L, z;
    try {
      await l(D), i === D && d(null);
    } catch (I) {
      (z = (L = (G = window == null ? void 0 : window.abp) == null ? void 0 : G.notify) == null ? void 0 : L.error) == null || z.call(L, (I == null ? void 0 : I.message) || `“${B}” silinemedi.`);
    }
  }, T = () => {
    x && !window.confirm("Kaydedilmemiş değişiklikleriniz var. Yine de kapatılsın mı?") || d(null);
  };
  return i ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: T,
          "aria-label": "Belge listesine dön",
          className: "flex items-center justify-center h-8 w-8 rounded-[9px] border border-subtle bg-surface-base text-text-tertiary hover:text-text-primary cursor-pointer",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-left text-[12px]" })
        }
      ),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: u,
          "aria-label": "Belge başlığı",
          onChange: (D) => {
            b(D.target.value), c(!0);
          },
          className: "flex-1 min-w-0 h-9 px-3 rounded-[10px] border border-subtle bg-surface-base text-[13.5px] font-bold text-text-primary focus:border-focus focus:shadow-focus focus:outline-none"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: v,
          disabled: o || !x,
          className: `flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[12.5px] font-bold ${o || !x ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${o ? "fa-circle-notch fa-spin" : "fa-floppy-disk"} text-[11px]` }),
            o ? "Kaydediliyor…" : x ? "Kaydet" : "Kaydedildi"
          ]
        }
      )
    ] }),
    g && !m ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Belge yükleniyor…" }) : /* @__PURE__ */ e.jsx(
      La,
      {
        value: f,
        placeholder: "Belgeyi buraya yazın…",
        onChange: (D) => {
          p(D), c(!0);
        }
      }
    )
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Belgeler" }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: h,
          className: "flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            "Yeni belge"
          ]
        }
      )
    ] }),
    s && a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !s && a.length === 0 && /* @__PURE__ */ e.jsx(
      ue,
      {
        icon: "fa-file-lines",
        title: "Henüz belge yok",
        description: "Toplantı notu, teknik şartname ya da teslim tutanağı gibi metinleri buraya yazabilirsiniz."
      }
    ),
    a.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: a.map((D) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "group flex items-center gap-3 px-3.5 py-3 border-b border-subtle last:border-b-0 hover:bg-surface-raised",
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[14px]" }) }),
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => d(D.id),
              className: "flex-1 min-w-0 bg-transparent border-0 p-0 text-left cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[13px] font-bold text-text-primary", children: D.title }),
                /* @__PURE__ */ e.jsx("span", { className: "block text-[11.5px] text-text-tertiary", children: D.contentLength > 0 ? `${D.editorName} · ${st(D.lastModificationTime ?? D.creationTime)}` : "Boş belge — açıp yazmaya başlayın" })
              ]
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              "aria-label": `${D.title} belgesini sil`,
              onClick: () => k(D.id, D.title),
              className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[12px]" })
            }
          )
        ]
      },
      D.id
    )) })
  ] });
}
function Fe() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function hr(t) {
  const a = Fe();
  return a ? Promise.resolve(a.getLinkedForms(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function gr(t) {
  const a = se(), s = ["task-forms", t], r = te({
    queryKey: s,
    queryFn: () => hr(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), l = ae({
    mutationFn: (d) => Promise.resolve(Fe().linkForm(t, d)),
    onSuccess: n
  }), o = ae({
    mutationFn: (d) => Promise.resolve(Fe().unlinkForm(d)),
    onSuccess: n
  }), i = ae({
    mutationFn: ({ linkId: d, value: u }) => Promise.resolve(Fe().setFormGuestFillable(d, u)),
    onSuccess: n
  });
  return {
    forms: r.data ?? [],
    isLoading: r.isLoading,
    linkForm: l.mutateAsync,
    unlinkForm: o.mutateAsync,
    setGuestFillable: i.mutateAsync,
    isLinking: l.isPending
  };
}
function yr(t, a) {
  return te({
    queryKey: ["task-form-options", t],
    queryFn: () => Promise.resolve(Fe().getFormOptions(t)),
    enabled: !!t && !!a,
    retry: !1
  });
}
function vr(t, a) {
  return te({
    queryKey: ["task-form-responses", t, a],
    queryFn: () => Promise.resolve(Fe().getFormResponses(t, a)),
    enabled: !!t && !!a,
    retry: !1
  });
}
function jr({ taskId: t, documentId: a }) {
  const { data: s, isLoading: r } = vr(t, a);
  return r ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Yanıtlar yükleniyor…" }) : s != null && s.length ? /* @__PURE__ */ e.jsx("ul", { className: "m-0 list-none p-0", children: s.map((n) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-3 px-3.5 py-2 border-t border-subtle", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n.isGuestSubmission ? "fa-user-clock" : "fa-user"} text-[10px] text-text-tertiary` }),
      /* @__PURE__ */ e.jsx("span", { className: "truncate text-[12.5px] text-text-primary", children: n.respondentName }),
      n.isGuestSubmission && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: "· dış" })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary", children: st(n.creationTime) })
  ] }, n.id)) }) : /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Bu görevde henüz yanıt yok." });
}
function Nr({ taskId: t }) {
  const { forms: a, isLoading: s, linkForm: r, unlinkForm: n, setGuestFillable: l, isLinking: o } = gr(t), [i, d] = y.useState(!1), [u, b] = y.useState(null), { data: f, isLoading: p } = yr(t, i), x = ce("Platform.Tasks.ShareExternally"), c = async (h) => {
    var v, k, T;
    try {
      await r(h), d(!1);
    } catch (D) {
      (T = (k = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : k.error) == null || T.call(k, (D == null ? void 0 : D.message) || "Form bağlanamadı.");
    }
  }, m = async (h) => {
    var v, k, T;
    if (window.confirm(`“${h.title}” bağlantısı kaldırılsın mı? Form ve toplanmış yanıtlar silinmez.`))
      try {
        await n(h.id);
      } catch (D) {
        (T = (k = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : k.error) == null || T.call(k, (D == null ? void 0 : D.message) || "Bağlantı kaldırılamadı.");
      }
  }, g = async (h, v) => {
    var k, T, D;
    try {
      await l({ linkId: h.id, value: v });
    } catch (B) {
      (D = (T = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : T.error) == null || D.call(T, (B == null ? void 0 : B.message) || "Ayar değiştirilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Formlar" }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => d((h) => !h),
          className: "flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${i ? "fa-xmark" : "fa-plus"} text-[11px]` }),
            i ? "Kapat" : "Form bağla"
          ]
        }
      )
    ] }),
    i && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-raised overflow-hidden", children: [
      p && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Formlar yükleniyor…" }),
      !p && !(f != null && f.length) && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Bağlanabilecek form yok. Önce Form Yönetimi'nden bir form oluşturun." }),
      f == null ? void 0 : f.map((h) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          disabled: h.isLinked || o,
          onClick: () => c(h.documentId),
          className: `flex items-center justify-between gap-3 px-3.5 py-2.5 border-b border-subtle last:border-b-0 text-left ${h.isLinked ? "cursor-not-allowed opacity-55" : "cursor-pointer hover:bg-surface-hover"}`,
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "truncate text-[12.5px] font-semibold text-text-primary", children: h.title }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[11px] text-text-tertiary", children: h.isLinked ? "zaten bağlı" : h.isPublished ? "yayında" : "taslak" })
          ]
        },
        h.documentId
      ))
    ] }),
    s && a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !s && a.length === 0 && !i && /* @__PURE__ */ e.jsx(
      ue,
      {
        icon: "fa-clipboard-list",
        title: "Göreve bağlı form yok",
        description: "Saha formu, kabul kontrol listesi ya da anket bağlayıp yanıtları bu görevin altında toplayabilirsiniz."
      }
    ),
    a.map((h) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-3.5 py-3", children: [
        /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clipboard-list text-[14px]" }) }),
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => b((v) => v === h.documentId ? null : h.documentId),
            className: "flex-1 min-w-0 bg-transparent border-0 p-0 text-left cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] font-bold text-text-primary", children: h.title }),
                !h.isPublished && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] font-bold text-warning", children: "taslak" })
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "block text-[11.5px] text-text-tertiary", children: h.responseCount > 0 ? `${h.responseCount} yanıt · bu görevde` : "Bu görevde henüz yanıt yok" })
            ]
          }
        ),
        h.responseCount > 0 && /* @__PURE__ */ e.jsx(Ta, { children: h.responseCount }),
        h.isPublished && h.slug && /* @__PURE__ */ e.jsx(
          "a",
          {
            href: `/f/${h.slug}?taskId=${h.taskId}`,
            target: "_blank",
            rel: "noreferrer",
            title: "Formu doldur",
            "aria-label": `${h.title} formunu doldur`,
            className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary hover:bg-primary-subtle hover:text-primary",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-up-right-from-square text-[11px]" })
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            title: "Bağlantıyı kaldır",
            "aria-label": `${h.title} bağlantısını kaldır`,
            onClick: () => m(h),
            className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[12px]" })
          }
        )
      ] }),
      x && h.isPublished && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 px-3.5 pb-3 text-[11.5px] text-text-secondary cursor-pointer", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: !!h.isGuestFillable,
            onChange: (v) => g(h, v.target.checked)
          }
        ),
        "Süreli paylaşım linkiyle ekip dışından da doldurulabilsin"
      ] }),
      u === h.documentId && /* @__PURE__ */ e.jsx(jr, { taskId: t, documentId: h.documentId })
    ] }, h.id))
  ] });
}
const wr = {
  0: "bg-neutral-400",
  1: "bg-text-tertiary",
  2: "bg-warning",
  3: "bg-primary",
  4: "bg-success"
};
function pt(t) {
  if (!t) return null;
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? null : a;
}
const Me = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
function kr({ task: t = {} }) {
  const a = y.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((o, i) => ({
    id: o.id || `row-${i}`,
    name: o.title || "Başlıksız görev",
    isMain: !!o.__main,
    start: pt(o.startDate),
    end: pt(o.dueDate) || pt(o.completedDate),
    status: o.status ?? 1
  })), [t]), { min: s, span: r } = y.useMemo(() => {
    const l = a.flatMap((d) => [d.start, d.end]).filter(Boolean).map((d) => d.getTime());
    if (l.length === 0) return { min: null, span: 0 };
    const o = Math.min(...l), i = Math.max(...l);
    return { min: o, span: Math.max(1, i - o) };
  }, [a]), n = y.useMemo(() => s === null ? [] : [0, 1, 2, 3].map((l) => new Date(s + r * l / 4)), [s, r]);
  return s === null ? /* @__PURE__ */ e.jsx("div", { className: De, children: /* @__PURE__ */ e.jsx(
    ue,
    {
      icon: "fa-bars-staggered",
      title: "Zaman çizelgesi çizilemiyor",
      description: "Görevde veya alt görevlerde başlangıç–bitiş tarihi tanımlı olmalı."
    }
  ) }) : /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Zaman çizelgesi" }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] text-text-tertiary", children: [
        Me(new Date(s)),
        " – ",
        Me(new Date(s + r))
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-4 gap-0 pl-[170px] mb-2 lt-860:pl-[110px]", children: n.map((l, o) => /* @__PURE__ */ e.jsx(
      "span",
      {
        className: "pl-2 border-l border-subtle text-[10.5px] font-bold uppercase tracking-[.06em] text-text-tertiary",
        children: Me(l)
      },
      o
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: a.map((l) => {
      const o = l.start ? l.start.getTime() : s, i = l.end ? Math.max(l.end.getTime(), o) : o, d = (o - s) / r * 100, u = Math.max(2, (i - o) / r * 100), b = Math.max(1, Math.round((i - o) / 864e5));
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
            className: `absolute top-[7px] bottom-[7px] flex items-center px-2.5 rounded-[7px] shadow-xs ${wr[l.status] || "bg-primary"}`,
            style: { left: `${d}%`, width: `${u}%` },
            title: `${Me(l.start)} – ${Me(l.end)}`,
            children: /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[10.5px] font-bold text-white", children: [
              b,
              "g"
            ] })
          }
        ) })
      ] }, l.id);
    }) })
  ] });
}
function Ht({ icon: t, iconTone: a, title: s, note: r, children: n }) {
  return /* @__PURE__ */ e.jsxs("div", { className: De, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[12px] ${a}` }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: s }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
    ] }),
    n
  ] });
}
function Cr({ task: t = {} }) {
  const a = se(), s = t.predecessorIds || [], r = () => {
    var d, u, b;
    return (b = (u = (d = window == null ? void 0 : window.apya) == null ? void 0 : d.platform) == null ? void 0 : u.tasks) == null ? void 0 : b.task;
  }, { data: n = [], isLoading: l } = te({
    queryKey: ["task-predecessors", t.id, s],
    queryFn: async () => {
      const d = r();
      return d ? Promise.all(
        s.map(
          (u) => Promise.resolve(d.get(u)).catch(() => ({ id: u, title: "(erişilemeyen görev)", status: null, code: "—" }))
        )
      ) : [];
    },
    enabled: s.length > 0,
    staleTime: 3e4,
    retry: !1
  }), o = async (d) => {
    var u, b, f, p, x, c;
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
        predecessorIds: s.filter((m) => m !== d),
        tagNames: (t.tags ?? []).map((m) => m.name),
        estimatedHours: t.estimatedHours ?? null,
        taskType: t.taskType ?? null,
        sprint: t.sprint ?? null
      })), await a.invalidateQueries({ queryKey: ["task-detail", t.id] }), (f = (b = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : b.info) == null || f.call(b, "Bağlantı kaldırıldı.");
    } catch (m) {
      (c = (x = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : x.error) == null || c.call(x, (m == null ? void 0 : m.message) || "Bağlantı kaldırılamadı.");
    }
  }, i = (d) => {
    var u, b, f;
    return (f = (b = (u = window == null ? void 0 : window.apya) == null ? void 0 : u.taskDetail) == null ? void 0 : b.open) == null ? void 0 : f.call(b, d);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsx(
      Ht,
      {
        icon: "fa-arrow-left-long",
        iconTone: "text-warning",
        title: "Öncül görevler",
        note: "bu görev başlamadan tamamlanmalı",
        children: s.length === 0 ? /* @__PURE__ */ e.jsx(ue, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : l ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : n.map((d) => {
          const u = d.status == null ? null : be(d.status);
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: d.code || "—" }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => i(d.id),
                    className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                    children: d.title || "Başlıksız görev"
                  }
                ),
                u && /* @__PURE__ */ e.jsx(Ee, { bg: u.bg, fg: u.fg, children: u.label }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Bağlantıyı kaldır",
                    "aria-label": `${d.title} bağlantısını kaldır`,
                    onClick: () => o(d.id),
                    className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link-slash text-[10px]" })
                  }
                )
              ]
            },
            d.id
          );
        })
      }
    ),
    /* @__PURE__ */ e.jsx(
      Ht,
      {
        icon: "fa-arrow-right-long",
        iconTone: "text-primary",
        title: "Ardıl görevler",
        note: "bu görev bitince başlar",
        children: /* @__PURE__ */ e.jsx(
          ue,
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
function Le() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task) || null;
}
function Dr(t) {
  const a = se(), s = ["task-timelogs", t], r = ["task-active-timelog"], n = te({
    queryKey: s,
    queryFn: () => {
      var u;
      return Promise.resolve((u = Le()) == null ? void 0 : u.getTimeLogs(t));
    },
    enabled: !!t && !!Le(),
    staleTime: 15e3,
    retry: !1
  }), l = te({
    queryKey: r,
    queryFn: () => {
      var u;
      return Promise.resolve((u = Le()) == null ? void 0 : u.getActiveTimeLog());
    },
    enabled: !!Le(),
    staleTime: 5e3,
    retry: !1
  }), o = () => {
    a.invalidateQueries({ queryKey: s }), a.invalidateQueries({ queryKey: r });
  }, i = ae({
    mutationFn: () => {
      var u;
      return Promise.resolve((u = Le()) == null ? void 0 : u.startTimeTracking(t));
    },
    onSuccess: o
  }), d = ae({
    mutationFn: () => {
      var u;
      return Promise.resolve((u = Le()) == null ? void 0 : u.stopTimeTracking(t));
    },
    onSuccess: o
  });
  return {
    logs: n.data ?? [],
    isLoading: n.isLoading,
    activeLog: l.data ?? null,
    start: i.mutateAsync,
    stop: d.mutateAsync,
    isMutating: i.isPending || d.isPending
  };
}
function Qt(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function Tr({ taskId: t, task: a = {} }) {
  const s = Dr(t), r = s.activeLog && s.activeLog.taskId === t ? s.activeLog : null, [n, l] = y.useState(() => Date.now());
  y.useEffect(() => {
    if (!r) return;
    const c = setInterval(() => l(Date.now()), 1e3);
    return () => clearInterval(c);
  }, [r]);
  const o = r ? Math.max(0, Math.floor((n - new Date(r.startTime).getTime()) / 1e3)) : 0, d = s.logs.reduce((c, m) => c + (m.secondsSpent || 0), 0) + o, u = (a == null ? void 0 : a.estimatedHours) ?? null, b = u ? u * 3600 : 0, f = b ? Math.min(100, Math.round(d / b * 100)) : 0, p = b ? Math.max(0, b - d) : 0, x = async () => {
    var c, m, g;
    try {
      r ? await s.stop() : await s.start();
    } catch (h) {
      (g = (m = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : m.error) == null || g.call(m, (h == null ? void 0 : h.message) || "Zaman takibi güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-5 flex-wrap p-[22px] rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[18px]", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: x,
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
              children: Cs(d)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary", children: r ? "Kayıt sürüyor" : "Sayaç duraklatıldı" })
        ] })
      ] }),
      b > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] font-bold text-text-secondary", children: "Tahmin kullanımı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
            ot(d),
            " / ",
            u,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-warning", style: { width: `${f}%` } }) }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "Kalan tahmini süre: ",
          ot(p)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: De, children: [
      /* @__PURE__ */ e.jsx(_e, { title: "Zaman kayıtları" }),
      s.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : s.logs.length === 0 ? /* @__PURE__ */ e.jsx(
        ue,
        {
          icon: "fa-stopwatch",
          title: "Henüz zaman kaydı yok",
          description: "Soldaki yeşil düğmeyle sayacı çalıştırın; durdurduğunuzda kayıt buraya düşer."
        }
      ) : s.logs.map((c) => {
        const m = !c.endTime;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
            children: [
              /* @__PURE__ */ e.jsx(lt, { name: c.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: c.note || c.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                Qt(c.startTime),
                " → ",
                m ? "sürüyor" : Qt(c.endTime)
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary", children: m ? "Aktif" : ot(c.secondsSpent || 0) })
            ]
          },
          c.id
        );
      })
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
    component: Ds
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
    component: $s
  },
  {
    // Alt görevlerin tablo/kanban görünümleri ve tarih takvimi — üçü de
    // görevin kendi `subTasks` koleksiyonundan beslenir, ek uç YOK.
    code: "subtask-table",
    title: "Tablo",
    icon: "fa-table",
    category: "gorev",
    isCore: !1,
    order: 6,
    permission: null,
    implemented: !0,
    component: ar
  },
  {
    code: "subtask-board",
    title: "Kanban",
    icon: "fa-table-columns",
    category: "gorev",
    isCore: !1,
    order: 7,
    permission: null,
    implemented: !0,
    component: sr
  },
  {
    code: "calendar",
    title: "Takvim",
    icon: "fa-calendar-days",
    category: "gorev",
    isCore: !1,
    order: 8,
    permission: null,
    implemented: !0,
    component: or
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
    component: Ps
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
    component: kr
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
    component: Cr
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
    component: Js
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
    component: Ks
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
    component: zs,
    hidden: !0
    // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
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
    component: Bs,
    hidden: !0
    // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
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
    component: Fs
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
    component: null,
    hidden: !0
    // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
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
    component: null,
    hidden: !0
    // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
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
    component: Tr
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
    component: null,
    hidden: !0
    // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
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
    component: null,
    hidden: !0
    // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
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
    component: null,
    hidden: !0
    // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
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
    component: null,
    hidden: !0
    // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
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
    component: null,
    hidden: !0
    // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
  },
  {
    // Göreve bağlı zengin metin belgeleri (TaskDocument tablosu). Dosya
    // ekinden ayrıdır: ek yüklenen dosyayı, belge yazılan metni saklar.
    code: "documents",
    title: "Belge",
    icon: "fa-file-lines",
    category: "gorev",
    isCore: !1,
    order: 9,
    permission: null,
    implemented: !0,
    component: br
  },
  {
    // Form KOPYALANMAZ: Form Yönetimi'ndeki bir AppDocument'e bağ kurulur.
    // Yanıtlar görev bağlamıyla (AppResponse.TaskId) toplanır.
    code: "forms",
    title: "Form",
    icon: "fa-clipboard-list",
    category: "gorev",
    isCore: !1,
    order: 9.5,
    permission: null,
    implemented: !0,
    component: Nr
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
    component: Xs
  }
];
function Aa(t = []) {
  const a = new Set(t);
  return Ve.filter((s) => !s.hidden).filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function Sr(t = []) {
  const a = new Set(t);
  return Ve.filter((s) => !s.hidden).filter((s) => !s.isCore).filter((s) => !s.permission || ce(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let Qe = null;
const Xe = /* @__PURE__ */ new Set(), mt = /* @__PURE__ */ new Set();
function Wt() {
  Xe.forEach((t) => t());
}
function $r(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const ie = {
  open(t) {
    const a = $r(t);
    a && (Qe = a, Wt());
  },
  close() {
    Qe = null, Wt();
  },
  subscribe(t) {
    return Xe.add(t), () => Xe.delete(t);
  },
  getSnapshot() {
    return Qe;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && mt.add(t);
  },
  emitResult() {
    mt.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    Qe = null, Xe.clear(), mt.clear();
  }
}, Zt = "apya.taskDetail.fullscreen";
function Fa({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, n] = y.useState(t), [l, o] = y.useState([]), { data: i, isPending: d, isError: u, refetch: b } = kt(r), f = ga(), p = Na(i), x = wa(), c = ka(r), [m, g] = y.useState("general"), [h, v] = y.useState(!1), k = Ge.useRef(null), T = y.useMemo(
    () => Aa(c.assignedCodes),
    [c.assignedCodes]
  ), D = y.useMemo(
    () => Sr(c.assignedCodes),
    [c.assignedCodes]
  ), B = T.find((F) => F.code === m) ?? T[0];
  Ge.useEffect(() => {
    B.code !== m && g(B.code);
  }, [B, m]);
  const G = B == null ? void 0 : B.component, L = se(), [z, I] = y.useState(
    () => {
      var F;
      return ((F = window.localStorage) == null ? void 0 : F.getItem(Zt)) === "1";
    }
  ), [K, O] = y.useState(!1), Q = y.useCallback(() => {
    va(), s == null || s();
  }, [s]);
  ja(t, Q), Ge.useEffect(() => {
    p.isDirty ? f.markDirty() : f.markClean();
  });
  const U = y.useCallback(() => f.requestClose(Q), [f, Q]), Z = y.useCallback(() => {
    I((F) => {
      var _;
      const R = !F;
      return (_ = window.localStorage) == null || _.setItem(Zt, R ? "1" : "0"), R;
    });
  }, []), V = ce("Platform.Tasks.Delete"), [re, w] = y.useState(!1), [N, j] = y.useState(!1), $ = y.useCallback(async () => {
    var F, R, _, ne, X, Te;
    j(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (_ = (R = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : R.info) == null || _.call(R, "Başarıyla silindi."), w(!1), f.markClean(), Q();
    } catch (pe) {
      (Te = (X = (ne = window == null ? void 0 : window.abp) == null ? void 0 : ne.notify) == null ? void 0 : X.error) == null || Te.call(X, (pe == null ? void 0 : pe.message) || "Görev silinemedi.");
    } finally {
      j(!1);
    }
  }, [r, f, Q]), P = y.useCallback(async () => {
    var F, R, _, ne, X, Te;
    if (!p.validate()) return !1;
    O(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, p.toUpdateDto())
      ), await L.invalidateQueries({ queryKey: ["task-detail", r] }), ie.emitResult(), (_ = (R = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : R.success) == null || _.call(R, "Kaydedildi."), !0;
    } catch (pe) {
      return (Te = (X = (ne = window == null ? void 0 : window.abp) == null ? void 0 : ne.notify) == null ? void 0 : X.error) == null || Te.call(X, (pe == null ? void 0 : pe.message) || "Kaydedilemedi."), !1;
    } finally {
      O(!1);
    }
  }, [r, p, f, L]), W = y.useCallback(() => {
    P();
  }, [P]), de = y.useCallback(async () => {
    const F = f.resolvePendingClose("save");
    await P() && (F == null || F());
  }, [f, P]), C = y.useCallback((F, R) => {
    f.requestClose(() => {
      o((_) => [..._, { id: r, title: (i == null ? void 0 : i.title) ?? "" }]), n(F), g("general"), f.markClean();
    });
  }, [f, r, i]), M = y.useCallback((F) => {
    f.requestClose(() => {
      o((R) => {
        const _ = R.findIndex((ne) => ne.id === F);
        return _ === -1 ? R : R.slice(0, _);
      }), n(F), g("general"), f.markClean();
    });
  }, [f]), A = y.useCallback(async (F) => {
    var R, _, ne;
    try {
      await c.addFeature(F), g(F), v(!1);
    } catch (X) {
      (ne = (_ = (R = window == null ? void 0 : window.abp) == null ? void 0 : R.notify) == null ? void 0 : _.error) == null || ne.call(_, (X == null ? void 0 : X.message) || "Özellik eklenemedi.");
    }
  }, [c]), Y = y.useCallback(async (F) => {
    var R, _, ne;
    try {
      await c.removeFeature(F), g((X) => X === F ? "general" : X);
    } catch (X) {
      (ne = (_ = (R = window == null ? void 0 : window.abp) == null ? void 0 : R.notify) == null ? void 0 : _.error) == null || ne.call(_, (X == null ? void 0 : X.message) || "Özellik kaldırılamadı.");
    }
  }, [c]);
  Ge.useEffect(() => {
    if (!h) return;
    const F = (_) => {
      k.current && !k.current.contains(_.target) && v(!1);
    }, R = (_) => {
      _.key === "Escape" && v(!1);
    };
    return document.addEventListener("mousedown", F), document.addEventListener("keydown", R), () => {
      document.removeEventListener("mousedown", F), document.removeEventListener("keydown", R);
    };
  }, [h]);
  const H = d ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(je, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(je, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(je, { className: "h-24 w-full" })
  ] }) : u ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(ee, { variant: "ghost", onClick: () => b(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      hs,
      {
        trail: l,
        current: { id: r, title: (i == null ? void 0 : i.title) ?? "" },
        onNavigate: M
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: k, children: [
      /* @__PURE__ */ e.jsx(
        ms,
        {
          tabs: T,
          activeCode: B.code,
          onSelect: (F) => {
            g(F), v(!1);
          },
          onOpenPicker: () => v((F) => !F),
          pickerOpen: h
        }
      ),
      h && /* @__PURE__ */ e.jsx(
        bs,
        {
          entries: D,
          busyCode: c.isMutating ? c.mutatingCode : null,
          onAdd: A,
          onRemove: Y
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${B.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          B.code === "general" ? /* @__PURE__ */ e.jsx(
            ds,
            {
              values: p.values,
              errors: p.errors,
              onFieldChange: p.setField,
              assigneeOptions: x.options,
              isLoadingAssignees: x.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(y.Suspense, { fallback: /* @__PURE__ */ e.jsx(je, { className: "h-24 w-full" }), children: G && /* @__PURE__ */ e.jsx(
            G,
            {
              taskId: r,
              task: i,
              form: p,
              onOpenSubtask: C
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            xs,
            {
              task: i,
              creatorName: x.nameById.get(i.creatorId),
              lastModifierName: x.nameById.get(i.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), le = a === "page" ? ss : as;
  return /* @__PURE__ */ e.jsxs(
    le,
    {
      open: !0,
      fullscreen: z,
      onRequestClose: U,
      title: i ? `Görev Detayı: ${i.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        ns,
        {
          task: i ?? { title: "Yükleniyor…" },
          canDelete: V,
          fullscreen: z,
          onToggleFullscreen: Z,
          onClose: U,
          onDelete: () => w(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        ls,
        {
          lastSavedAt: i == null ? void 0 : i.lastModificationTime,
          isDirty: f.isDirty,
          isSaving: K,
          onCancel: U,
          onSave: W
        }
      ),
      children: [
        H,
        f.pendingClose && /* @__PURE__ */ e.jsx(
          Pr,
          {
            isSaving: K,
            onStay: () => f.resolvePendingClose("stay"),
            onDiscard: () => f.resolvePendingClose("discard"),
            onSaveAndClose: de
          }
        ),
        re && /* @__PURE__ */ e.jsx(
          Er,
          {
            taskTitle: (i == null ? void 0 : i.title) ?? "",
            busy: N,
            onCancel: () => w(!1),
            onConfirm: $
          }
        )
      ]
    }
  );
}
function Er({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [n, l] = y.useState(""), o = n.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    za,
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
        /* @__PURE__ */ e.jsx(ee, { variant: "secondary", onClick: s, disabled: a, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          ee,
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
            value: n,
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
function za({ label: t, title: a, description: s, children: r, actions: n }) {
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
function Pr({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    za,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(ee, { variant: "secondary", onClick: a, disabled: t, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ e.jsx(ee, { variant: "destructive", onClick: s, disabled: t, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ e.jsx(ee, { variant: "primary", onClick: r, isLoading: t, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
const Br = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function Lr({ isPrivate: t = !1, onChange: a = () => {
} }) {
  const s = !!t, [r, n] = y.useState(null);
  return /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
      "button",
      {
        ref: n,
        type: "button",
        className: "flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-default transition-all shadow-sm",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${s ? "fa-lock" : "fa-globe"} text-[11px] text-text-tertiary` }),
          /* @__PURE__ */ e.jsx("span", { children: s ? "Özel görev" : "Herkese açık" }),
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[10px] ml-0.5 text-text-tertiary" })
        ]
      }
    ) }),
    /* @__PURE__ */ e.jsx(ke, { container: $e(r), children: /* @__PURE__ */ e.jsxs(
      Ce,
      {
        sideOffset: 8,
        align: "end",
        className: "z-50 w-[360px] rounded-2xl border border-subtle bg-surface-base p-4 shadow-float animate-in fade-in-50 zoom-in-95",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle pb-3 mb-3", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shield-halved text-primary text-base" }),
            /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary", children: "Görünürlük" })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: Br.map((l) => {
            const o = s === l.value;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => a(l.value),
                className: `flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${o ? "border-primary bg-primary-subtle/40" : "border-subtle hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l.icon} text-base mt-0.5 ${o ? "text-primary" : "text-text-tertiary"}` }),
                  /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ e.jsx("h4", { className: "text-[13px] font-semibold text-text-primary", children: l.title }),
                      o && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ] }),
                    /* @__PURE__ */ e.jsx("p", { className: "text-[12px] text-text-tertiary mt-0.5", children: l.desc })
                  ] })
                ]
              },
              String(l.value)
            );
          }) }),
          /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-text-tertiary mt-3", children: "Değişiklik “Kaydet” ile uygulanır." }),
          /* @__PURE__ */ e.jsx(Wa, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const Jt = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto", Ar = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", Fr = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" },
  { what: "Bağlantı kopyala", key: "⌘ L" }
];
function zr({ children: t }) {
  return /* @__PURE__ */ e.jsx(ba, { asChild: !0, children: t });
}
function Ir({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "inline-flex items-center h-[19px] px-1.5 rounded-[5px] border border-default border-b-2 bg-neutral-subtle font-mono text-[10px] font-semibold text-text-secondary", children: t });
}
function Kr({
  task: t = {},
  presentation: a = "modal",
  onClose: s,
  isFullscreen: r,
  onToggleFullscreen: n,
  onFieldChange: l = () => {
  },
  statusValue: o,
  titleValue: i,
  isPrivateValue: d,
  isFavorite: u,
  onToggleFavorite: b,
  isWatched: f,
  onToggleWatch: p,
  onDuplicate: x,
  onArchive: c,
  onDelete: m,
  onOpenTransfer: g,
  onSaveAsTemplate: h,
  onConvertToSubtask: v,
  onExportPdf: k
}) {
  const [T, D] = y.useState(!1), [B, G] = y.useState(null), [L, z] = y.useState(!1), I = y.useRef(null), K = $e(B), O = be(o ?? t.status), Q = t.code || "GRV-—", U = () => {
    var w;
    (w = navigator.clipboard) == null || w.writeText(Q), D(!0), setTimeout(() => D(!1), 1800);
  }, Z = () => {
    var w, N, j, $;
    (w = navigator.clipboard) == null || w.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), ($ = (j = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : j.success) == null || $.call(j, "Görev bağlantısı panoya kopyalandı.");
  }, V = (w) => () => {
    z(!1), w == null || w();
  }, re = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", kbd: "⌘L", onClick: V(Z) },
    { label: "Çoğalt", icon: "fa-copy", kbd: "⌘D", onClick: V(x) },
    { label: "Başka projeye kopyala", icon: "fa-clone", onClick: V(() => g == null ? void 0 : g("copy")) },
    { label: "Şablon olarak kaydet", icon: "fa-bookmark", onClick: V(h) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, onClick: V(() => g == null ? void 0 : g("move")) },
    { label: "Alt göreve dönüştür", icon: "fa-diagram-project", onClick: V(v) },
    { label: f ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: V(p) },
    { label: "Arşivle", icon: "fa-box-archive", separator: !0, onClick: V(c) },
    { label: "Yazdır", icon: "fa-print", kbd: "⌘P", onClick: V(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: V(k) },
    { label: "Sil", icon: "fa-trash-can", kbd: "⌫", separator: !0, danger: !0, onClick: V(m) }
  ];
  return /* @__PURE__ */ e.jsxs("header", { ref: G, className: "shrink-0 px-6 lt-860:px-4 pt-[18px] pb-4 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: U,
            title: "Kodu kopyala",
            className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[11px] font-bold tracking-[.04em] cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[9px] opacity-70" }),
              /* @__PURE__ */ e.jsx("span", { children: Q }),
              /* @__PURE__ */ e.jsx("i", { className: `${T ? "fa-solid fa-check" : "fa-regular fa-copy"} text-[9px] opacity-60` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] border border-default text-[12px] font-semibold cursor-pointer ${O.bg} ${O.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-current animate-pulse" }),
                /* @__PURE__ */ e.jsx("span", { children: O.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(ke, { container: K, children: /* @__PURE__ */ e.jsxs(Ce, { sideOffset: 6, align: "start", className: `${Jt} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            at.map((w) => {
              const N = tt[w], j = (o ?? t.status) === w;
              return /* @__PURE__ */ e.jsx(zr, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => l("status", w),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${j ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${N.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: N.label }),
                    j && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, w);
            })
          ] }) })
        ] }),
        f && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 h-[26px] px-2.5 rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11.5px] font-semibold", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-eye text-[10px]" }),
          "Takip ediliyor"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
        /* @__PURE__ */ e.jsx("div", { className: "lt-860:hidden", children: /* @__PURE__ */ e.jsx(
          Lr,
          {
            isPrivate: d ?? !!t.isPrivate,
            onChange: (w) => l("isPrivate", w)
          }
        ) }),
        /* @__PURE__ */ e.jsx("div", { className: "h-5 w-px bg-border-default mx-1" }),
        a === "modal" && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: n,
            title: r ? "Küçült" : "Tam ekran",
            className: `mobile:hidden flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${r ? "bg-primary-subtle text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r ? "fa-compress" : "fa-expand"} text-[12px]` })
          }
        ),
        /* @__PURE__ */ e.jsxs(Ne, { modal: !0, open: L, onOpenChange: z, children: [
          /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer seçenekler",
              className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${L ? "bg-surface-hover text-text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(ke, { container: K, children: /* @__PURE__ */ e.jsxs(
            Ce,
            {
              sideOffset: 6,
              align: "end",
              collisionBoundary: K ?? [],
              collisionPadding: 12,
              className: `${Jt} w-[244px]`,
              children: [
                re.map((w) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: w.onClick,
                    className: [
                      Ar,
                      w.danger ? "text-negative" : "text-text-secondary",
                      w.separator ? "border-t border-subtle mt-[5px]" : ""
                    ].join(" "),
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${w.icon} text-[11px] w-[14px] opacity-75` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: w.label }),
                      w.kbd && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: w.kbd })
                    ]
                  },
                  w.label
                )),
                /* @__PURE__ */ e.jsxs("div", { className: "mt-1.5 pt-[9px] px-[9px] pb-[7px] border-t border-subtle", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 mb-[7px]", children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-keyboard text-[11px] text-text-tertiary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-[.09em] text-text-tertiary", children: "Kısayollar" })
                  ] }),
                  Fr.map((w) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: w.what }),
                    /* @__PURE__ */ e.jsx(Ir, { children: w.key })
                  ] }, w.what))
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
          ref: I,
          contentEditable: !0,
          suppressContentEditableWarning: !0,
          spellCheck: !1,
          onBlur: (w) => l("title", w.currentTarget.textContent.trim()),
          className: "flex-1 min-w-0 text-[24px] lt-560:text-[20px] font-extrabold tracking-[-.025em] leading-[1.2] text-text-primary px-2 -ml-2 py-[3px] rounded-[9px] border border-transparent cursor-text hover:bg-neutral-subtle hover:border-subtle focus:bg-neutral-subtle focus:border-focus focus:shadow-focus focus:outline-none",
          children: i ?? t.title ?? "Başlıksız görev"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: b,
          title: u ? "Favorilerden çıkar" : "Favorilere ekle",
          className: `flex items-center justify-center h-8 w-8 shrink-0 rounded-[9px] cursor-pointer ${u ? "bg-warning-subtle text-warning" : "text-text-tertiary hover:bg-surface-hover"}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${u ? "solid" : "regular"} fa-star text-[15px]` })
        }
      )
    ] })
  ] });
}
const We = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", Xt = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function ye({ children: t }) {
  return /* @__PURE__ */ e.jsx(ba, { asChild: !0, children: t });
}
function me({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[7px] min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.08em] text-text-tertiary select-none", children: t }),
    a
  ] });
}
function ea({ name: t, size: a = 26 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Ue(t), fontSize: a * 0.38 },
      children: Oe(t)
    }
  );
}
function ta(t) {
  if (t == null) return "—";
  const a = Math.max(0, Math.round(Number(t) * 60)), s = Math.floor(a / 60), r = a % 60;
  return s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function Mr({
  task: t = {},
  assigneeOptions: a = [],
  projectOptions: s = [],
  onFieldChange: r = () => {
  },
  statusValue: n,
  priorityValue: l,
  assigneeValue: o,
  projectValue: i,
  dueDateValue: d,
  startDateValue: u,
  tagsValue: b = [],
  progressPercent: f = 0,
  progressNote: p = "",
  onOpenTransfer: x
}) {
  var w, N;
  const [c, m] = y.useState(""), [g, h] = y.useState(""), [v, k] = y.useState(""), [T, D] = y.useState(!1), [B, G] = y.useState(null), L = be(n ?? t.status), z = it(l ?? t.priority), I = o ?? t.assigneeId ?? null, K = i ?? t.projectId ?? null, O = ((w = a.find((j) => j.value === I)) == null ? void 0 : w.label) || t.assigneeName || "Atanmamış", Q = ((N = s.find((j) => j.value === K)) == null ? void 0 : N.label) || t.projectName || "Projesiz", U = Ca(d ?? t.dueDate), Z = a.filter(
    (j) => !c || j.label.toLowerCase().includes(c.toLowerCase())
  ), V = s.filter(
    (j) => !g || j.label.toLowerCase().includes(g.toLowerCase())
  ), re = () => {
    const j = v.trim();
    j && !b.includes(j) && r("tagNames", [...b, j]), k(""), D(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { ref: G, className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6", children: [
    /* @__PURE__ */ e.jsx(me, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx(ea, { name: I ? O : null }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: O }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ke, { container: $e(B), children: /* @__PURE__ */ e.jsxs(Ce, { sideOffset: 6, align: "start", className: `${We} w-[264px]`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: c,
              onChange: (j) => m(j.target.value),
              placeholder: "Kişi ara…",
              className: Xt
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[230px] overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("assigneeId", null),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] text-left cursor-pointer ${I ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary font-semibold"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex h-6 w-6 items-center justify-center rounded-full bg-neutral-subtle text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-user-slash text-[9px]" }) }),
                /* @__PURE__ */ e.jsx("span", { children: "Atanmamış" })
              ]
            }
          ) }),
          a.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-2 py-1.5 text-[12px] text-text-tertiary", children: "Kullanıcı listesi yükleniyor…" }),
          Z.map((j) => /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("assigneeId", j.value),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${I === j.value ? "bg-primary-subtle" : "hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx(ea, { name: j.label, size: 24 }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: j.label }),
                I === j.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
              ]
            }
          ) }, j.value))
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ e.jsxs(me, { label: "Son tarih", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
        /* @__PURE__ */ e.jsx("i", { className: `fa-regular fa-calendar text-[13px] ${U.tone}` }),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "date",
            value: (d ?? t.dueDate ?? "").slice(0, 10),
            onChange: (j) => r("dueDate", j.target.value),
            className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
          }
        )
      ] }),
      U.hint && /* @__PURE__ */ e.jsx("span", { className: `-mt-0.5 text-[10.5px] font-semibold ${U.tone}`, children: U.hint })
    ] }),
    /* @__PURE__ */ e.jsx(me, { label: "Başlangıç", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[13px] text-text-tertiary" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          value: (u ?? t.startDate ?? "").slice(0, 10),
          onChange: (j) => r("startDate", j.target.value),
          className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(me, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 pt-[5px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: [
          "%",
          f
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-medium text-text-tertiary", children: p })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "h-1.5 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "h-full rounded-full bg-primary transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
          style: { width: `${f}%` }
        }
      ) })
    ] }) }),
    /* @__PURE__ */ e.jsx(me, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${L.bg} ${L.fg}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${L.icon} text-[11px]` }),
            /* @__PURE__ */ e.jsx("span", { children: L.label }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ke, { container: $e(B), children: /* @__PURE__ */ e.jsxs(Ce, { sideOffset: 6, align: "start", className: `${We} w-[196px]`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
        at.map((j) => {
          const $ = tt[j], P = (n ?? t.status) === j;
          return /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("status", j),
              className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${P ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${$.dot}` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: $.label }),
                P && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
              ]
            }
          ) }, j);
        })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(me, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${z.bg} ${z.fg}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${z.icon} text-[11px]` }),
            /* @__PURE__ */ e.jsx("span", { children: z.label }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ke, { container: $e(B), children: /* @__PURE__ */ e.jsxs(Ce, { sideOffset: 6, align: "start", className: `${We} w-[184px]`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
        ks.map((j) => {
          const $ = Nt[j], P = (l ?? t.priority) === j;
          return /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("priority", j),
              className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${P ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${$.icon} text-[11px] w-[13px]` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: $.label }),
                P && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
              ]
            }
          ) }, j);
        })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(me, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap min-h-8", children: [
      b.map((j) => /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "inline-flex items-center gap-1.5 h-6 px-2 rounded-[7px] border border-primary bg-primary-subtle text-primary text-[11.5px] font-bold",
          children: [
            /* @__PURE__ */ e.jsx("span", { children: j }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Etiketi kaldır",
                onClick: () => r("tagNames", b.filter(($) => $ !== j)),
                className: "flex items-center p-0 border-0 bg-transparent text-current opacity-55 hover:opacity-100 hover:text-negative cursor-pointer",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
              }
            )
          ]
        },
        j
      )),
      T ? /* @__PURE__ */ e.jsx(
        "input",
        {
          autoFocus: !0,
          type: "text",
          value: v,
          onChange: (j) => k(j.target.value),
          onBlur: re,
          onKeyDown: (j) => {
            j.key === "Enter" && re(), j.key === "Escape" && (k(""), D(!1));
          },
          placeholder: "Etiket…",
          className: "h-6 w-24 px-2 rounded-[7px] border border-focus bg-surface-base text-text-primary text-[11.5px] shadow-focus focus:outline-none"
        }
      ) : /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          "aria-label": "Yeni etiket ekle",
          onClick: () => D(!0),
          className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-dashed border-strong bg-transparent text-text-tertiary text-[11.5px] font-semibold hover:border-focus hover:text-primary hover:bg-primary-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[9px]" }),
            "Etiket"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(me, { label: "Proje", children: /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-[13px] text-text-tertiary" }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: Q }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ke, { container: $e(B), children: /* @__PURE__ */ e.jsxs(Ce, { sideOffset: 6, align: "start", className: `${We} w-[250px]`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: g,
              onChange: (j) => h(j.target.value),
              placeholder: "Proje ara…",
              className: Xt
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[210px] overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("projectId", null),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${K ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-neutral-400" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Projesiz" })
              ]
            }
          ) }),
          V.map((j) => /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("projectId", j.value),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${K === j.value ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-primary" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: j.label }),
                K === j.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
              ]
            }
          ) }, j.value))
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-[7px] pt-[7px] border-t border-subtle", children: [
          /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => x == null ? void 0 : x("move"),
              className: "flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left text-text-secondary hover:bg-surface-hover hover:text-primary cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[11px] w-[14px] opacity-70" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Başka projeye taşı…" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => x == null ? void 0 : x("copy"),
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
    /* @__PURE__ */ e.jsx(me, { label: "Harcanan / tahmin", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[9px] h-8", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock text-[13px] text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[13px] font-bold text-text-primary", children: ta(t.spentHours ?? 0) }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[12px] text-text-tertiary", children: [
        "/ ",
        t.estimatedHours != null ? ta(t.estimatedHours) : "—"
      ] })
    ] }) })
  ] }) });
}
function Rr({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: n,
  onDragEnd: l,
  onReorderTo: o,
  onReorderDrop: i,
  onOpenPicker: d,
  counts: u = {},
  isDirty: b = !1
}) {
  const [f, p] = y.useState(!1);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-6 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 py-2.5 flex-1 min-w-0 overflow-x-auto custom-scrollbar", children: [
      s.map((x) => {
        const c = t === x.code, m = u[x.code] || 0;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            draggable: !0,
            title: "Sürükleyerek sırayı değiştirin",
            ...ha(() => a(x.code)),
            onDragStart: (g) => {
              n(x.code);
              try {
                g.dataTransfer.effectAllowed = "move", g.dataTransfer.setData("text/plain", x.code);
              } catch {
              }
            },
            onDragOver: (g) => {
              g.preventDefault(), o(x.code);
            },
            onDrop: (g) => {
              g.preventDefault(), i == null || i();
            },
            onDragEnd: l,
            className: [
              "flex shrink-0 items-center gap-2 h-[34px] px-[13px] rounded-[10px]",
              "text-[12.5px] whitespace-nowrap cursor-grab active:cursor-grabbing",
              "transition-opacity duration-fast",
              c ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
              r === x.code ? "opacity-35" : "opacity-100"
            ].join(" "),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x.icon} text-[11px] opacity-85` }),
              /* @__PURE__ */ e.jsx("span", { children: x.title }),
              m > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                "rounded-full text-[10px] font-extrabold",
                c ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
              ].join(" "), children: m })
            ]
          },
          x.code
        );
      }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          title: "Özellik ekle",
          onClick: () => {
            p(!1), d();
          },
          onMouseEnter: () => p(!0),
          onMouseLeave: () => p(!1),
          className: [
            "flex shrink-0 items-center gap-[7px] h-[34px] ml-1 rounded-[10px]",
            "border border-dashed border-primary bg-primary-subtle text-primary",
            "text-[12.5px] font-bold whitespace-nowrap cursor-pointer",
            "hover:border-solid",
            "transition-[padding] duration-[160ms] ease-[cubic-bezier(.16,1,.3,1)]",
            f ? "px-[13px]" : "px-[11px]"
          ].join(" "),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            f && /* @__PURE__ */ e.jsx("span", { className: "animate-fade-in-fast", children: "Özellik ekle" })
          ]
        }
      )
    ] }),
    b && /* @__PURE__ */ e.jsxs("span", { className: "flex shrink-0 items-center gap-[7px] h-[26px] px-2.5 rounded-full bg-warning-subtle text-warning text-[11px] font-bold", children: [
      /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-warning animate-pulse" }),
      "Taslak"
    ] })
  ] });
}
function Gr({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: n,
  onDragEnd: l,
  onReorderTo: o,
  onReorderDrop: i,
  onOpenPicker: d,
  counts: u = {}
}) {
  return /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Görev özellikleri",
      className: "flex lt-860:hidden flex-col gap-[3px] w-[238px] shrink-0 py-4 px-3 border-r border-subtle bg-surface-base overflow-y-auto custom-scrollbar",
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "px-2.5 pt-1 pb-2 text-[10px] font-extrabold uppercase tracking-[.1em] text-text-tertiary", children: "Özellikler" }),
        s.map((b) => {
          const f = t === b.code, p = u[b.code] || 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              draggable: !0,
              title: "Sürükleyerek sırayı değiştirin",
              ...ha(() => a(b.code)),
              onDragStart: (x) => {
                n(b.code);
                try {
                  x.dataTransfer.effectAllowed = "move", x.dataTransfer.setData("text/plain", b.code);
                } catch {
                }
              },
              onDragOver: (x) => {
                x.preventDefault(), o(b.code);
              },
              onDrop: (x) => {
                x.preventDefault(), i == null || i();
              },
              onDragEnd: l,
              className: [
                "flex shrink-0 items-center gap-[11px] h-9 px-[11px] rounded-[9px]",
                "text-[12.5px] text-left cursor-grab active:cursor-grabbing",
                "transition-opacity duration-fast",
                f ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
                r === b.code ? "opacity-35" : "opacity-100"
              ].join(" "),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${b.icon} text-[12px] w-[15px] opacity-85` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: b.title }),
                p > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                  "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                  "rounded-full text-[10px] font-extrabold",
                  f ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
                ].join(" "), children: p })
              ]
            },
            b.code
          );
        }),
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: d,
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
function Ae({ label: t, value: a, avatarName: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 py-[9px] border-t border-subtle", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-tertiary shrink-0", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
      s && /* @__PURE__ */ e.jsx(
        "span",
        {
          className: "flex shrink-0 items-center justify-center h-[21px] w-[21px] rounded-full text-[color:var(--apya-avatar-fg)] text-[8.5px] font-bold",
          style: { background: Ue(s) },
          children: Oe(s)
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", title: typeof a == "string" ? a : void 0, children: a || "—" })
    ] })
  ] });
}
const aa = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "—";
function qr({ task: t = {}, nameById: a }) {
  const s = (l, o) => {
    var i;
    return l || o && ((i = a == null ? void 0 : a.get) == null ? void 0 : i.call(a, o)) || null;
  }, r = s(t.creatorName, t.creatorId), n = t.lastModificationTime ? s(t.lastModifierName, t.lastModifierId) : null;
  return /* @__PURE__ */ e.jsx("aside", { className: "flex flex-col gap-3.5 min-w-0", children: /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Oluşturan", value: r || "Bilinmiyor", avatarName: r }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Oluşturma tarihi", value: aa(t.creationTime) }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Güncelleyen", value: n || "—", avatarName: n }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Son güncelleme", value: aa(t.lastModificationTime) }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Görev tipi", value: t.taskType }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Sprint", value: t.sprint })
  ] }) });
}
const sa = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
function ft({ name: t, size: a = 32 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Ue(t), fontSize: a * 0.34 },
      children: Oe(t)
    }
  );
}
function ra({ open: t, onClick: a }) {
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
const na = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function Yr({
  task: t = {},
  onFieldChange: a = () => {
  },
  descriptionValue: s,
  checklist: r,
  currentUserName: n = "Ben"
}) {
  const l = t == null ? void 0 : t.id, o = se(), [i, d] = y.useState(!0), [u, b] = y.useState(""), f = (r == null ? void 0 : r.items) ?? [], p = f.filter((N) => N.isDone).length, x = f.length ? Math.round(p / f.length * 100) : 0, c = async () => {
    var j, $, P;
    const N = u.trim();
    if (!(!N || !l)) {
      b("");
      try {
        await r.addItem(N);
      } catch (W) {
        (P = ($ = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : $.error) == null || P.call($, (W == null ? void 0 : W.message) || "Madde eklenemedi.");
      }
    }
  }, [m, g] = y.useState(!0), [h, v] = y.useState(""), [k, T] = y.useState(!1), [D, B] = y.useState(!1), [G, L] = y.useState(null), [z, I] = y.useState(""), [K, O] = y.useState({}), { data: Q = [] } = te({
    queryKey: ["task-comments", l],
    queryFn: () => {
      var N, j, $, P;
      return Promise.resolve((P = ($ = (j = (N = window == null ? void 0 : window.apya) == null ? void 0 : N.platform) == null ? void 0 : j.tasks) == null ? void 0 : $.task) == null ? void 0 : P.getComments(l));
    },
    enabled: !!l,
    staleTime: 1e4
  }), U = async () => {
    await o.invalidateQueries({ queryKey: ["task-comments", l] }), await o.invalidateQueries({ queryKey: ["task-detail", l] });
  }, Z = async () => {
    var j, $, P;
    const N = h.trim();
    if (!(!N || !l || D)) {
      B(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.addComment(l, N)), await U(), v("");
      } catch (W) {
        (P = ($ = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : $.error) == null || P.call($, (W == null ? void 0 : W.message) || "Yorum gönderilemedi.");
      } finally {
        B(!1);
      }
    }
  }, V = async (N) => {
    var $, P, W;
    const j = z.trim();
    if (!(!j || !l))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.replyToComment(N, j)), await U(), I(""), L(null);
      } catch (de) {
        (W = (P = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : P.error) == null || W.call(P, (de == null ? void 0 : de.message) || "Yanıt gönderilemedi.");
      }
  }, re = (N) => O((j) => {
    const $ = j[N] ?? { liked: !1, count: 0 };
    return { ...j, [N]: { liked: !$.liked, count: $.count + ($.liked ? -1 : 1) } };
  }), w = !!h.trim() && !D;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-[9px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Açıklama" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Zengin metin · WYSIWYG" })
      ] }),
      /* @__PURE__ */ e.jsx(
        La,
        {
          value: s ?? t.description ?? "",
          onChange: (N) => a("description", N),
          mentionName: n
        },
        l
      )
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: sa, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
            p,
            "/",
            f.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(ra, { open: i, onClick: () => d((N) => !N) })
      ] }),
      i && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 mt-3.5", children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
            style: { width: `${x}%` }
          }
        ) }),
        f.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              "aria-label": N.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
              onClick: () => r.toggleItem(N.id).catch((j) => {
                var $, P, W;
                return (W = (P = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : P.error) == null ? void 0 : W.call(P, (j == null ? void 0 : j.message) || "Durum güncellenemedi.");
              }),
              className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white cursor-pointer transition-colors duration-fast ${N.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
              children: N.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${N.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: N.text }),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              onClick: () => r.removeItem(N.id).catch((j) => {
                var $, P, W;
                return (W = (P = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : P.error) == null ? void 0 : W.call(P, (j == null ? void 0 : j.message) || "Madde silinemedi.");
              }),
              className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
            }
          )
        ] }, N.id)),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            value: u,
            onChange: (N) => b(N.target.value),
            onKeyDown: (N) => {
              N.key === "Enter" && c();
            },
            placeholder: "Yeni madde yaz ve Enter'a bas…",
            className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: sa, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Yorumlar & güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: Q.length })
        ] }),
        /* @__PURE__ */ e.jsx(ra, { open: m, onClick: () => g((N) => !N) })
      ] }),
      m && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(ft, { name: n }),
          /* @__PURE__ */ e.jsxs("div", { className: `flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${k ? "border-focus bg-surface-base shadow-focus" : "border-default bg-surface-raised"}`, children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                rows: 2,
                value: h,
                onChange: (N) => v(N.target.value),
                onFocus: () => T(!0),
                onBlur: () => T(!1),
                onKeyDown: (N) => {
                  N.key === "Enter" && (N.ctrlKey || N.metaKey) && (N.preventDefault(), Z());
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
              ].map((N) => /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  title: N.title,
                  onMouseDown: (j) => j.preventDefault(),
                  onClick: () => v((j) => j + N.add),
                  className: "flex items-center justify-center h-7 w-7 rounded-[7px] text-text-tertiary hover:bg-surface-hover hover:text-primary cursor-pointer",
                  children: /* @__PURE__ */ e.jsx("i", { className: `${N.icon} text-[12px]` })
                },
                N.title
              )) }),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: Z,
                  disabled: !w,
                  className: `flex items-center gap-[7px] h-[30px] px-3.5 rounded-[9px] text-[12px] font-bold shadow-xs ${w ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${D ? "fa-circle-notch fa-spin" : "fa-paper-plane"} text-[10px]` }),
                    "Gönder"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1", children: Q.map((N) => {
          const j = K[N.id] ?? { liked: !1, count: 0 };
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start py-3 border-t border-subtle", children: [
            /* @__PURE__ */ e.jsx(ft, { name: N.authorName }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: N.authorName }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: na(N.creationTime) })
              ] }),
              /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[13px] leading-[1.65] text-text-secondary whitespace-pre-wrap", children: N.text }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 mt-[3px]", children: [
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => re(N.id),
                    className: `flex items-center gap-1.5 h-[26px] px-[9px] rounded-full border text-[11px] font-semibold cursor-pointer ${j.liked ? "border-primary bg-primary-subtle text-primary" : "border-default bg-transparent text-text-tertiary hover:border-focus"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-thumbs-up text-[10px]" }),
                      j.count
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      L(($) => $ === N.id ? null : N.id), I("");
                    },
                    className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-full text-text-tertiary text-[11px] font-semibold hover:bg-surface-hover hover:text-primary cursor-pointer",
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                      "Yanıtla"
                    ]
                  }
                )
              ] }),
              G === N.id && /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 mt-2 animate-fade-in-fast", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: z,
                    onChange: ($) => I($.target.value),
                    onKeyDown: ($) => {
                      $.key === "Enter" && V(N.id);
                    },
                    placeholder: `@${N.authorName} kullanıcısına yanıt ver…`,
                    className: "flex-1 h-8 px-3 rounded-[9px] border border-focus bg-surface-base text-text-primary text-[12px] shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => V(N.id),
                    className: "h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover",
                    children: "Yanıtla"
                  }
                )
              ] }),
              (N.replies ?? []).map(($) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] mt-2.5 pl-3 border-l-2 border-default", children: [
                /* @__PURE__ */ e.jsx(ft, { name: $.authorName, size: 24 }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: $.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: na($.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-[3px] mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: $.text })
                ] })
              ] }, $.id))
            ] })
          ] }, N.id);
        }) })
      ] })
    ] })
  ] });
}
function _r({
  lastSavedAt: t,
  isDirty: a,
  isSaving: s,
  justSaved: r,
  onCancel: n,
  onSave: l
}) {
  const o = t ? new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(t)) : "—", i = s ? "fa-solid fa-circle-notch fa-spin" : r ? "fa-solid fa-check" : "fa-regular fa-floppy-disk", d = s ? "Kaydediliyor…" : r ? "Kaydedildi" : "Kaydet", u = a && !s;
  return /* @__PURE__ */ e.jsxs("footer", { className: "shrink-0 flex items-center justify-between gap-4 px-6 lt-860:px-4 py-3.5 border-t border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5 min-w-0 lt-560:hidden", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] text-[11.5px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock text-[11px]" }),
        "Son kayıt: ",
        /* @__PURE__ */ e.jsx("strong", { className: "font-semibold text-text-secondary", children: o })
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
          onClick: n,
          className: "h-9 px-4 rounded-[10px] border border-default bg-surface-base text-text-secondary text-[13px] font-semibold hover:bg-surface-hover hover:text-text-primary cursor-pointer",
          children: "Vazgeç"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: l,
          disabled: !u,
          className: `flex items-center gap-2 h-9 px-[22px] rounded-[10px] text-white text-[13px] font-bold shadow-sm ${u ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `${i} text-[11px]` }),
            d
          ]
        }
      )
    ] })
  ] });
}
const Ia = Object.fromEntries(Ve.map((t) => [t.code, t])), Or = {
  "subtask-table": { desc: "Alt görevlerin sıralanabilir tablosu", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  "subtask-board": { desc: "Alt görevleri duruma göre sütunlarda taşı", bg: "bg-primary-subtle", fg: "text-primary" },
  calendar: { desc: "Görev ve alt görev tarihleri aylık ızgarada", bg: "bg-primary-subtle", fg: "text-primary" },
  forms: { desc: "Form bağla, yanıtları görevde topla", bg: "bg-primary-subtle", fg: "text-primary" },
  documents: { desc: "Göreve bağlı yazılı belgeler", bg: "bg-primary-subtle", fg: "text-primary" },
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
  history: { desc: "Kayıt bilgileri ve durum geçişleri", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  finance: { desc: "Maliyet merkezleri, bütçe ve harcamalar", bg: "bg-success-subtle", fg: "text-success" },
  gallery: { desc: "Göreve eklenen görsellerin ızgarası", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  ai: { desc: "Akıllı görev analizi, özet ve öneriler", bg: "bg-ai-subtle", fg: "text-ai-500" },
  automations: { desc: "Durum ve eylem tetikleyici kurallar", bg: "bg-ai-subtle", fg: "text-ai-500" },
  "custom-fields": { desc: "Göreve özel form alanları tanımlayın", bg: "bg-success-subtle", fg: "text-success" }
}, Ur = [
  { title: "GÖREV & PLANLAMA", codes: ["subtask-table", "subtask-board", "calendar", "documents", "forms", "checklist", "gantt", "time-tracking", "dependencies", "risks", "approvals", "dashboard"] },
  { title: "İLETİŞİM", codes: ["comments", "emails"] },
  { title: "GEÇMİŞ & FİNANS", codes: ["activity", "history", "finance", "gallery"] },
  { title: "İLERİ ÖZELLİKLER & YAPAY ZEKA", codes: ["ai", "automations", "custom-fields"] }
], Vr = /* @__PURE__ */ new Set([
  "risks",
  "dashboard",
  "comments",
  "emails",
  "custom-fields",
  "approvals",
  "ai",
  "automations"
]), Hr = (t) => Vr.has(t);
function Ka(t) {
  const a = Ia[t], s = Or[t];
  return a ? {
    code: t,
    title: a.title,
    icon: a.icon,
    desc: (s == null ? void 0 : s.desc) ?? "",
    bg: (s == null ? void 0 : s.bg) ?? "bg-neutral-subtle",
    fg: (s == null ? void 0 : s.fg) ?? "text-text-secondary"
  } : null;
}
function Qr(t) {
  var a;
  return (a = Ia[t]) != null && a.hidden ? null : Ka(t);
}
function Wr(t = "") {
  const a = t.trim().toLowerCase();
  return Ur.map((s) => ({
    title: s.title,
    items: s.codes.map(Qr).filter(Boolean).filter((r) => !a || r.title.toLowerCase().includes(a) || r.desc.toLowerCase().includes(a))
  })).filter((s) => s.items.length > 0);
}
const ia = Ve.filter((t) => !t.hidden).length;
function la({ code: t, onRemoveFeature: a, onOpenPicker: s, canRemove: r = !0 }) {
  const n = Ka(t) ?? { title: t, desc: "", icon: "fa-cube", bg: "bg-neutral-subtle", fg: "text-text-secondary" };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-3 py-14 px-6 rounded-2xl border border-dashed border-strong bg-surface-base text-center", children: [
    /* @__PURE__ */ e.jsx("span", { className: `flex items-center justify-center h-14 w-14 rounded-2xl ${n.bg} ${n.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n.icon} text-[22px]` }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-w-[420px]", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: n.title }),
      n.desc && /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] leading-[1.6] text-text-secondary", children: n.desc }),
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
function St({ open: t, onClose: a, label: s, children: r }) {
  return /* @__PURE__ */ e.jsx(
    Za,
    {
      open: t,
      onOpenChange: (n) => {
        n || a == null || a();
      },
      children: /* @__PURE__ */ e.jsxs(Ja, { children: [
        /* @__PURE__ */ e.jsx(Xa, { className: "fixed inset-0", style: { pointerEvents: "none" } }),
        /* @__PURE__ */ e.jsx(es, { asChild: !0, "aria-describedby": void 0, children: /* @__PURE__ */ e.jsxs("div", { className: "fixed inset-0 z-modal", children: [
          /* @__PURE__ */ e.jsx(ts, { className: "sr-only", children: s }),
          r
        ] }) })
      ] })
    }
  );
}
function Zr({
  open: t,
  onClose: a,
  assignedCodes: s = [],
  onAddFeature: r,
  onGoToTab: n
}) {
  const [l, o] = y.useState("");
  if (y.useEffect(() => {
    t || o("");
  }, [t]), !t) return null;
  const i = new Set(s), d = Wr(l), u = s.length + 3, b = (f) => {
    if (i.has(f)) {
      n == null || n(f), a == null || a();
      return;
    }
    r == null || r(f), a == null || a();
  };
  return /* @__PURE__ */ e.jsx(St, { open: t, onClose: a, label: "Özellik ekle", children: /* @__PURE__ */ e.jsx(
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
          onClick: (f) => f.stopPropagation(),
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
                  onChange: (f) => o(f.target.value),
                  placeholder: `${ia} özellik arasında ara (Gantt, Finans, Risk, AI…)`,
                  className: "w-full h-[42px] pl-9 pr-3.5 rounded-xl border border-default bg-neutral-subtle text-text-primary text-[13px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                }
              )
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col gap-5 px-[22px] pt-3 pb-[22px] overflow-y-auto custom-scrollbar", children: [
              d.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[11px]", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.1em] text-text-tertiary", children: f.title }),
                  /* @__PURE__ */ e.jsx("span", { className: "flex-1 h-px bg-subtle" })
                ] }),
                /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[11px]", children: f.items.map((p) => {
                  const x = i.has(p.code);
                  return /* @__PURE__ */ e.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => b(p.code),
                      className: `group flex items-start gap-3 p-3.5 rounded-[15px] border text-left cursor-pointer hover:border-focus hover:shadow-md ${x ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                      children: [
                        /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-10 w-10 rounded-xl ${p.bg} ${p.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${p.icon} text-[15px]` }) }),
                        /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-[3px] min-w-0 flex-1", children: [
                          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-between gap-2", children: [
                            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: p.title }),
                            /* @__PURE__ */ e.jsx("span", { className: `shrink-0 text-[10.5px] font-extrabold ${x ? "text-primary" : "text-text-tertiary"}`, children: x ? "✓ Ekli" : "Ekle →" })
                          ] }),
                          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] leading-[1.5] text-text-tertiary", children: p.desc })
                        ] })
                      ]
                    },
                    p.code
                  );
                }) })
              ] }, f.title)),
              d.length === 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 py-12 text-center", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass text-3xl text-text-tertiary mb-2" }),
                /* @__PURE__ */ e.jsx("p", { className: "m-0 text-sm font-semibold text-text-primary", children: "Eşleşen özellik bulunamadı" }),
                /* @__PURE__ */ e.jsx("p", { className: "m-0 text-xs text-text-tertiary", children: "Lütfen farklı bir arama terimi deneyin." })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-[22px] py-3.5 border-t border-subtle bg-surface-raised text-[11.5px] text-text-tertiary", children: [
              /* @__PURE__ */ e.jsxs("span", { children: [
                "Toplam ",
                ia,
                " modül · ",
                u,
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
const Jr = [
  { key: "subtasks", label: "Alt görevler", countKey: "subtasks", unit: "alt görev" },
  { key: "checklist", label: "Kontrol listesi", countKey: "checklist", unit: "madde" },
  { key: "comments", label: "Yorumlar", countKey: "comments", unit: "yorum" },
  { key: "files", label: "Dosyalar", countKey: "files", unit: "dosya" },
  { key: "keepAssignee", label: "Sorumluyu koru", desc: "Aksi halde atanmamış gelir" },
  { key: "keepLinks", label: "Bağımlılıkları koru", desc: "Öncül / ardıl bağlantılar" },
  { key: "shiftDates", label: "Tarihleri bugüne kaydır", desc: "Başlangıç ve son tarih ötelenir" }
], oa = {
  subtasks: !0,
  checklist: !0,
  comments: !1,
  files: !0,
  keepAssignee: !0,
  keepLinks: !0,
  shiftDates: !1
};
function Xr({ on: t, onClick: a, label: s }) {
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
function en({
  open: t,
  mode: a = "move",
  onClose: s,
  onConfirm: r,
  projectOptions: n = [],
  currentProjectId: l,
  counts: o = {},
  onCreateProject: i
}) {
  const [d, u] = y.useState(a), [b, f] = y.useState([]), [p, x] = y.useState(""), [c, m] = y.useState(""), [g, h] = y.useState(oa), [v, k] = y.useState(!1);
  y.useEffect(() => {
    t && (u(a), f([]), x(""), m(""), h(oa));
  }, [t, a]);
  const T = y.useMemo(
    () => n.filter((w) => w.value && w.value !== l),
    [n, l]
  ), D = T.filter((w) => !p || w.label.toLowerCase().includes(p.toLowerCase())), B = T.length > 0 && b.length === T.length;
  if (!t) return null;
  const G = (w) => f((N) => N.includes(w) ? N.filter((j) => j !== w) : [...N, w]), L = (w) => {
    var N;
    return ((N = n.find((j) => j.value === w)) == null ? void 0 : N.label) ?? "";
  }, z = async () => {
    var N, j, $;
    const w = c.trim();
    if (!(!w || v)) {
      k(!0);
      try {
        const P = await (i == null ? void 0 : i(w));
        P && f((W) => [...W, P]), m("");
      } catch (P) {
        ($ = (j = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : j.error) == null || $.call(j, (P == null ? void 0 : P.message) || "Proje oluşturulamadı.");
      } finally {
        k(!1);
      }
    }
  }, I = async () => {
    if (!(!b.length || v)) {
      k(!0);
      try {
        await (r == null ? void 0 : r({ mode: d, targetProjectIds: b, include: g }));
      } finally {
        k(!1);
      }
    }
  }, K = d === "move", O = b.length, Q = K ? O > 1 ? "Taşı ve kopyala" : "Taşı" : O > 1 ? `${O} projeye kopyala` : "Kopyala", U = Object.values(g).filter(Boolean).length, Z = b.map(L).filter(Boolean), V = Z.length ? `${Z.length > 2 ? `${Z.slice(0, 2).join(", ")} +${Z.length - 2}` : Z.join(", ")} · ${U} seçenek açık` : `Proje seçilmedi · ${U} seçenek açık`, re = (w) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${w ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return /* @__PURE__ */ e.jsx(St, { open: t, onClose: s, label: K ? "Başka projeye taşı" : "Başka projelere kopyala", children: /* @__PURE__ */ e.jsx(
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
          "aria-label": K ? "Başka projeye taşı" : "Başka projelere kopyala",
          onClick: (w) => w.stopPropagation(),
          className: "flex flex-col w-full max-w-[760px] max-h-[88vh] rounded-[20px] border border-default bg-surface-base shadow-xl overflow-hidden animate-dialog-in",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-4 px-[22px] pt-5 pb-4 border-b border-subtle", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-10 w-10 rounded-[13px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-tree text-base" }) }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsx("h3", { className: "m-0 text-base font-extrabold tracking-[-.02em] text-text-primary", children: K ? "Başka projeye taşı" : "Başka projelere kopyala" }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 mb-0 text-[12px] leading-[1.5] text-text-tertiary", children: K ? "Görev ilk seçtiğiniz projeye taşınır; birden fazla seçerseniz kalanlara kopya oluşturulur." : "Görevin kopyası seçtiğiniz her projede oluşturulur; bu görev yerinde kalır." })
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
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => u("move"), className: re(K), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[10px]" }),
                "Taşı"
              ] }),
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => u("copy"), className: re(!K), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clone text-[10px]" }),
                "Kopyala"
              ] })
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 grid grid-cols-2 lt-860:grid-cols-1 gap-5 items-start px-[22px] pt-4 pb-5 overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px] min-w-0", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5", children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.08em] text-text-tertiary", children: [
                    "Hedef projeler · ",
                    O
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => f(B ? [] : T.map((w) => w.value)),
                      className: "p-0 border-0 bg-transparent text-primary text-[11px] font-bold cursor-pointer hover:underline",
                      children: B ? "Seçimi temizle" : "Tümünü seç"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: p,
                      onChange: (w) => x(w.target.value),
                      placeholder: "Proje ara…",
                      className: "w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar", children: [
                  D.map((w) => {
                    const N = b.includes(w.value), j = K && b[0] === w.value;
                    return /* @__PURE__ */ e.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => G(w.value),
                        className: `flex items-center gap-[11px] px-3 py-[11px] rounded-[11px] border text-left cursor-pointer hover:border-focus ${N ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                        children: [
                          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] rounded-[5px] border-[1.5px] text-white ${N ? "bg-primary border-primary" : "bg-transparent border-strong"}`, children: N && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" }) }),
                          /* @__PURE__ */ e.jsx("span", { className: "h-2.5 w-2.5 shrink-0 rounded-[3px] bg-primary" }),
                          /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: w.label }),
                          j && /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center h-5 px-2 rounded-md bg-primary text-white text-[10px] font-extrabold", children: "TAŞINACAK" })
                        ]
                      },
                      w.value
                    );
                  }),
                  D.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "py-6 text-center text-[12px] text-text-tertiary", children: "Uygun proje bulunamadı." })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[7px] mt-1", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: c,
                      onChange: (w) => m(w.target.value),
                      onKeyDown: (w) => {
                        w.key === "Enter" && (w.preventDefault(), z());
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
                      onClick: z,
                      disabled: !c.trim() || v,
                      className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-plus text-[12px]" })
                    }
                  )
                ] }),
                K && O > 1 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle", children: [
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
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: Jr.map((w) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-px", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary", children: w.label }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: w.countKey ? `${o[w.countKey] ?? 0} ${w.unit}` : w.desc })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    Xr,
                    {
                      on: g[w.key],
                      label: w.label,
                      onClick: () => h((N) => ({ ...N, [w.key]: !N[w.key] }))
                    }
                  )
                ] }, w.key)) })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3.5 px-[22px] py-3.5 border-t border-subtle bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("span", { className: "min-w-0 truncate text-[11.5px] text-text-tertiary", children: V }),
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
                    onClick: I,
                    disabled: !O || v,
                    className: `flex items-center gap-2 h-9 px-5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${O && !v ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${v ? "fa-circle-notch fa-spin" : "fa-arrow-right"} text-[10px]` }),
                      Q
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
const tn = [
  { code: "general", title: "Genel", icon: "fa-circle-info" },
  { code: "checklist", title: "Kontrol", icon: "fa-square-check" },
  { code: "comments", title: "Yorumlar", icon: "fa-comments" },
  { code: "files", title: "Dosyalar", icon: "fa-paperclip" }
], Re = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  img: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
};
function an(t = "") {
  var s;
  const a = (s = t.split(".").pop()) == null ? void 0 : s.toLowerCase();
  return a === "pdf" ? Re.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(a) ? Re.img : ["doc", "docx", "odt", "rtf"].includes(a) ? Re.doc : ["json", "js", "ts", "cs", "xml", "yml", "yaml"].includes(a) ? Re.code : Re.other;
}
const sn = (t) => t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : "—", rn = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—", nn = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—";
function bt({ name: t, size: a = 22 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Ue(t), fontSize: a * 0.4 },
      children: Oe(t)
    }
  );
}
function Ze({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: t }),
    a
  ] });
}
function ln({
  subtaskId: t,
  parentCode: a,
  onClose: s,
  onOpenFull: r,
  onDeleted: n,
  currentUserName: l = "Ben"
}) {
  var P, W, de;
  const o = se(), { data: i } = kt(t), d = Tt(t), u = Dt(t), [b, f] = y.useState("general"), [p, x] = y.useState(""), [c, m] = y.useState(""), [g, h] = y.useState(""), v = y.useRef(null), k = y.useRef(null);
  i && k.current !== i.id && (k.current = i.id, x(i.description ?? ""));
  const { data: T = [] } = te({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var C, M, A, Y;
      return Promise.resolve((Y = (A = (M = (C = window == null ? void 0 : window.apya) == null ? void 0 : C.platform) == null ? void 0 : M.tasks) == null ? void 0 : A.task) == null ? void 0 : Y.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4
  });
  if (y.useEffect(() => {
    const C = (M) => {
      M.key === "Escape" && (M.stopPropagation(), s == null || s());
    };
    return window.addEventListener("keydown", C), () => window.removeEventListener("keydown", C);
  }, [s]), !i) return null;
  const D = (de = (W = (P = window == null ? void 0 : window.apya) == null ? void 0 : P.platform) == null ? void 0 : W.tasks) == null ? void 0 : de.task, B = be(i.status), G = it(i.priority), L = d.items ?? [], z = L.filter((C) => C.isDone).length, I = L.length ? Math.round(z / L.length * 100) : 0, K = u.attachments ?? [], O = { checklist: L.length, comments: T.length, files: K.length }, Q = async () => {
    await o.invalidateQueries({ queryKey: ["task-detail", t] });
  }, U = async (C) => {
    var M, A, Y;
    try {
      await Promise.resolve(D.update(i.id, {
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
        tagNames: (i.tags ?? []).map((H) => H.name),
        estimatedHours: i.estimatedHours ?? null,
        taskType: i.taskType ?? null,
        sprint: i.sprint ?? null,
        ...C
      })), await Q();
    } catch (H) {
      (Y = (A = (M = window == null ? void 0 : window.abp) == null ? void 0 : M.notify) == null ? void 0 : A.error) == null || Y.call(A, (H == null ? void 0 : H.message) || "Alt görev güncellenemedi.");
    }
  }, Z = () => U({ status: i.status >= 4 ? 1 : i.status + 1 }), V = () => U({ priority: i.priority >= 4 ? 1 : i.priority + 1 }), re = () => {
    (i.description ?? "") !== p && U({ description: p || null });
  }, w = async () => {
    var M, A, Y;
    const C = c.trim();
    if (C) {
      m("");
      try {
        await d.addItem(C);
      } catch (H) {
        (Y = (A = (M = window == null ? void 0 : window.abp) == null ? void 0 : M.notify) == null ? void 0 : A.error) == null || Y.call(A, (H == null ? void 0 : H.message) || "Madde eklenemedi.");
      }
    }
  }, N = async () => {
    var M, A, Y;
    const C = g.trim();
    if (C) {
      h("");
      try {
        await Promise.resolve(D.addComment(i.id, C)), await o.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch (H) {
        (Y = (A = (M = window == null ? void 0 : window.abp) == null ? void 0 : M.notify) == null ? void 0 : A.error) == null || Y.call(A, (H == null ? void 0 : H.message) || "Yorum gönderilemedi.");
      }
    }
  }, j = async () => {
    var C, M, A;
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(D.delete(i.id)), n == null || n(i.id), s == null || s();
      } catch (Y) {
        (A = (M = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : M.error) == null || A.call(M, (Y == null ? void 0 : Y.message) || "Alt görev silinemedi.");
      }
  }, $ = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
  return /* @__PURE__ */ e.jsxs(St, { open: !0, onClose: s, label: `${i.code} alt görev detayı`, children: [
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
                    className: `${$} hover:bg-surface-hover hover:text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-up-right-from-square text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Alt görevi sil",
                    onClick: j,
                    className: `${$} hover:bg-negative-subtle hover:text-negative`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Kapat",
                    onClick: s,
                    className: `${$} hover:bg-surface-hover hover:text-text-primary`,
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
                  onClick: Z,
                  title: "Durumu değiştir",
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold cursor-pointer ${B.bg} ${B.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${B.icon} text-[10px]` }),
                    B.label
                  ]
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: V,
                  title: "Önceliği değiştir",
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold cursor-pointer ${G.bg} ${G.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${G.icon} text-[10px]` }),
                    G.label
                  ]
                }
              ),
              (i.tags ?? []).map((C) => /* @__PURE__ */ e.jsx("span", { className: "flex items-center h-6 px-[9px] rounded-[7px] border border-default bg-neutral-subtle text-text-secondary text-[11px] font-semibold", children: C.name }, C.id ?? C.name))
            ] }),
            /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[18px] font-extrabold tracking-[-.02em] leading-[1.3] text-text-primary", children: i.title }),
            /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 pt-1", children: [
              /* @__PURE__ */ e.jsx(Ze, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
                /* @__PURE__ */ e.jsx(bt, { name: i.assigneeName }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", children: i.assigneeName || "Atanmamış" })
              ] }) }),
              /* @__PURE__ */ e.jsx(Ze, { label: "Son tarih", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] h-[22px] text-[12.5px] font-semibold text-text-primary", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[11px] text-text-tertiary" }),
                nn(i.dueDate)
              ] }) }),
              /* @__PURE__ */ e.jsx(Ze, { label: "Süre", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-[22px] font-mono text-[12.5px] font-bold text-text-primary", children: [
                i.spentHours ?? 0,
                "s",
                /* @__PURE__ */ e.jsxs("span", { className: "font-medium text-text-tertiary", children: [
                  " / ",
                  i.estimatedHours != null ? `${i.estimatedHours}s` : "—"
                ] })
              ] }) }),
              /* @__PURE__ */ e.jsx(Ze, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-1.5 pt-[3px]", children: [
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
                  "%",
                  I
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: "block h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("span", { className: "block h-full rounded-full bg-success", style: { width: `${I}%` } }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: tn.map((C) => {
            const M = b === C.code, A = O[C.code] ?? 0;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => f(C.code),
                className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${M ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${C.icon} text-[11px] opacity-85` }),
                  /* @__PURE__ */ e.jsx("span", { children: C.title }),
                  A > 0 && /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-neutral-subtle text-text-tertiary text-[10px] font-extrabold", children: A })
                ]
              },
              C.code
            );
          }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar px-5 py-[18px] bg-surface-raised", children: [
            b === "general" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Açıklama" }),
              /* @__PURE__ */ e.jsx(
                "textarea",
                {
                  rows: 7,
                  value: p,
                  onChange: (C) => x(C.target.value),
                  onBlur: re,
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
            b === "checklist" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px]", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Kontrol listesi" }),
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: [
                  z,
                  "/",
                  L.length
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-success", style: { width: `${I}%` } }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px] mt-1", children: [
                L.map((C) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] border border-subtle bg-surface-base hover:border-default", children: [
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Tamamlandı işaretle",
                      onClick: () => d.toggleItem(C.id),
                      className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white cursor-pointer ${C.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
                      children: C.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[12.5px] font-semibold ${C.isDone ? "line-through text-text-tertiary" : "text-text-primary"}`, children: C.text }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Maddeyi sil",
                      onClick: () => d.removeItem(C.id),
                      className: "flex shrink-0 items-center justify-center h-6 w-6 rounded-md text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[10px]" })
                    }
                  )
                ] }, C.id)),
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "text",
                    value: c,
                    onChange: (C) => m(C.target.value),
                    onKeyDown: (C) => {
                      C.key === "Enter" && w();
                    },
                    placeholder: "Yeni madde yaz ve Enter'a bas…",
                    className: "h-9 mt-1 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                )
              ] })
            ] }),
            b === "comments" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] items-start", children: [
                /* @__PURE__ */ e.jsx(bt, { name: l, size: 30 }),
                /* @__PURE__ */ e.jsx(
                  "textarea",
                  {
                    rows: 2,
                    value: g,
                    onChange: (C) => h(C.target.value),
                    onKeyDown: (C) => {
                      C.key === "Enter" && !C.shiftKey && (C.preventDefault(), N());
                    },
                    placeholder: "Yorum yaz ve Enter'a bas…",
                    className: "flex-1 min-w-0 px-3 py-2.5 rounded-[11px] border border-default bg-surface-base text-text-primary text-[12.5px] leading-[1.6] resize-none focus:border-focus focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: N,
                    "aria-label": "Yorumu gönder",
                    className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] ${g.trim() ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paper-plane text-[11px]" })
                  }
                )
              ] }),
              T.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-[7px] py-7 rounded-xl border border-dashed border-default", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-comments text-xl text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Henüz yorum yok" })
              ] }) : T.map((C) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 items-start p-3 rounded-xl border border-subtle bg-surface-base", children: [
                /* @__PURE__ */ e.jsx(bt, { name: C.authorName, size: 28 }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: C.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: rn(C.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: C.text })
                ] })
              ] }, C.id))
            ] }),
            b === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  ref: v,
                  type: "file",
                  className: "hidden",
                  onChange: (C) => {
                    var A;
                    const M = (A = C.target.files) == null ? void 0 : A[0];
                    C.target.value = "", M && u.upload(M).catch((Y) => {
                      var H, le, F;
                      return (F = (le = (H = window == null ? void 0 : window.abp) == null ? void 0 : H.notify) == null ? void 0 : le.error) == null ? void 0 : F.call(le, (Y == null ? void 0 : Y.message) || "Dosya yüklenemedi.");
                    });
                  }
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    var C;
                    return (C = v.current) == null ? void 0 : C.click();
                  },
                  disabled: u.isUploading,
                  className: "flex flex-col items-center justify-center gap-[7px] p-6 rounded-[13px] border-2 border-dashed border-strong bg-surface-base cursor-pointer hover:border-focus hover:bg-primary-subtle disabled:opacity-60",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.isUploading ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-xl text-text-tertiary` }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: u.isUploading ? "Yükleniyor…" : "Dosya ekle" })
                  ]
                }
              ),
              K.map((C) => {
                const M = an(C.fileName);
                return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${M.bg} ${M.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${M.icon} text-[13px]` }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: C.fileName }),
                    /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                      sn(C.fileSize),
                      " · ",
                      C.uploaderName
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "a",
                    {
                      href: C.downloadUrl,
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
                      onClick: () => u.remove(C.id).catch((A) => {
                        var Y, H, le;
                        return (le = (H = (Y = window == null ? void 0 : window.abp) == null ? void 0 : Y.notify) == null ? void 0 : H.error) == null ? void 0 : le.call(H, (A == null ? void 0 : A.message) || "Dosya silinemedi.");
                      }),
                      className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                    }
                  )
                ] }, C.id);
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
const Ma = "apya.taskDetail.tabOrder";
function on() {
  try {
    const t = localStorage.getItem(Ma);
    if (!t) return [];
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.filter((s) => typeof s == "string") : [];
  } catch {
    return [];
  }
}
function cn(t) {
  try {
    localStorage.setItem(Ma, JSON.stringify(t));
  } catch {
  }
}
function dn(t) {
  const [a, s] = y.useState(on), [r, n] = y.useState(null), l = y.useMemo(() => {
    const u = new Map(t.map((f) => [f.code, f])), b = [];
    for (const f of a) {
      const p = u.get(f);
      p && (b.push(p), u.delete(f));
    }
    for (const f of t)
      u.has(f.code) && b.push(f);
    return b;
  }, [t, a]), o = y.useCallback((u) => {
    s((b) => {
      const f = r;
      if (!f || f === u) return b;
      const p = b.length ? b.slice() : l.map((m) => m.code), x = p.indexOf(f), c = p.indexOf(u);
      return x === -1 || c === -1 ? b : (p.splice(x, 1), p.splice(c, 0, f), p);
    });
  }, [r, l]), i = y.useCallback((u) => n(u), []), d = y.useCallback(() => {
    n(null), s((u) => {
      const b = u.length ? u : l.map((f) => f.code);
      return cn(b), b;
    });
  }, [l]);
  return { orderedTabs: l, draggingCode: r, handleDragStart: i, handleDragEnd: d, reorderTo: o };
}
function xn() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function un() {
  const t = te({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: xn,
    staleTime: 3e5,
    retry: !1
  }), a = t.data ?? [], s = a.map((n) => ({ value: n.id, label: n.name })), r = new Map(a.map((n) => [n.id, n.name]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
const ca = "apya.taskDetail.fullscreen", J = {
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
function pn(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function Ra({ taskId: t, presentation: a = "modal", onClose: s, switchToTask: r }) {
  var Bt, Lt, At, Ft, zt, It, Kt, Mt;
  const [n, l] = y.useState(t), { data: o, isPending: i, isError: d, refetch: u } = kt(n), b = se(), f = ga(), p = Na(o), x = wa(), c = un(), m = ka(n), g = Tt(n), [h, v] = y.useState("general"), [k, T] = y.useState(!1), [D, B] = y.useState(!1), [G, L] = y.useState(!1), [z, I] = y.useState(null), [K, O] = y.useState(null), [Q, U] = y.useState(!1), [Z, V] = y.useState(!1), [re, w] = y.useState(() => {
    try {
      return localStorage.getItem(ca) === "true";
    } catch {
      return !1;
    }
  });
  ja(n);
  const [N, j] = y.useState(null);
  o != null && o.id && o.id !== N && (j(o.id), U(!!o.isFavorite), V(!!o.isWatched)), y.useEffect(() => {
    p.isDirty ? f.markDirty() : f.markClean();
  });
  const $ = y.useCallback(() => {
    va(), s == null || s();
  }, [s]), P = y.useCallback(() => f.requestClose($), [f, $]), W = y.useCallback(() => {
    w((S) => {
      const E = !S;
      try {
        localStorage.setItem(ca, String(E));
      } catch {
      }
      return E;
    });
  }, []), de = y.useMemo(
    () => Aa(m.assignedCodes),
    [m.assignedCodes]
  ), C = dn(de), M = y.useMemo(() => {
    var S, E, q, oe, he;
    return {
      subtasks: ((S = o == null ? void 0 : o.subTasks) == null ? void 0 : S.length) ?? 0,
      files: ((E = o == null ? void 0 : o.attachments) == null ? void 0 : E.length) ?? 0,
      dependencies: ((q = o == null ? void 0 : o.predecessorIds) == null ? void 0 : q.length) ?? 0,
      comments: ((oe = o == null ? void 0 : o.comments) == null ? void 0 : oe.length) ?? 0,
      checklist: ((he = g.items) == null ? void 0 : he.length) ?? 0
    };
  }, [o, g.items]), A = Ve.find((S) => S.code === h), Y = g.items ?? [], H = Y.filter((S) => S.isDone).length, le = Y.length ? Math.round(H / Y.length * 100) : 0, F = y.useCallback(async () => {
    if (!p.validate())
      return J.err("Zorunlu alanları kontrol edin."), !1;
    T(!0);
    try {
      return await Promise.resolve(window.apya.platform.tasks.task.update(n, p.toUpdateDto())), await b.invalidateQueries({ queryKey: ["task-detail", n] }), ie.emitResult(), B(!0), setTimeout(() => B(!1), 2e3), J.ok("Görev başarıyla güncellendi."), !0;
    } catch (S) {
      return J.err((S == null ? void 0 : S.message) || "Kaydedilemedi."), !1;
    } finally {
      T(!1);
    }
  }, [n, p, b]);
  y.useEffect(() => {
    const S = (E) => {
      if ((E.ctrlKey || E.metaKey) && E.key.toLowerCase() === "s") {
        E.preventDefault(), p.isDirty && !k && F();
        return;
      }
      if (E.key === "Escape") {
        if (z) {
          E.stopPropagation(), I(null);
          return;
        }
        G && (E.stopPropagation(), L(!1));
      }
    };
    return window.addEventListener("keydown", S), () => window.removeEventListener("keydown", S);
  }, [F, p.isDirty, k, z, G]);
  const R = () => {
    var S, E, q;
    return (q = (E = (S = window == null ? void 0 : window.apya) == null ? void 0 : S.platform) == null ? void 0 : E.tasks) == null ? void 0 : q.task;
  }, _ = async () => {
    var E;
    const S = !Q;
    U(S);
    try {
      await Promise.resolve((E = R()) == null ? void 0 : E.toggleFavorite(n));
    } catch (q) {
      U(!S), J.err((q == null ? void 0 : q.message) || "Favori güncellenemedi.");
    }
  }, ne = () => {
    if (!n) return;
    const S = document.createElement("a");
    S.href = `/Tasks/Detail/${n}?handler=Pdf`, S.rel = "noopener", document.body.appendChild(S), S.click(), S.remove();
  }, X = async () => {
    var E;
    const S = !Z;
    V(S);
    try {
      await Promise.resolve((E = R()) == null ? void 0 : E.toggleWatch(n)), J.info(S ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (q) {
      V(!S), J.err((q == null ? void 0 : q.message) || "Takip durumu güncellenemedi.");
    }
  }, Te = async () => {
    var S, E;
    try {
      const q = await Promise.resolve((S = R()) == null ? void 0 : S.transfer(n, {
        mode: 2,
        // Copy
        targetProjectIds: o != null && o.projectId ? [o.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await b.invalidateQueries({ queryKey: ["task-detail"] }), J.ok("Görev çoğaltıldı.");
      const oe = (E = q == null ? void 0 : q.createdTaskIds) == null ? void 0 : E[0];
      oe && l(oe);
    } catch (q) {
      J.err((q == null ? void 0 : q.message) || "Görev çoğaltılamadı.");
    }
  }, pe = async () => {
    var S;
    try {
      await Promise.resolve((S = R()) == null ? void 0 : S.updateStatus(n, 4)), await b.invalidateQueries({ queryKey: ["task-detail", n] }), J.info("Görev arşivlendi (Tamamlandı).");
    } catch (E) {
      J.err((E == null ? void 0 : E.message) || "Görev arşivlenemedi.");
    }
  }, qa = async () => {
    var S;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?"))
      try {
        await Promise.resolve((S = R()) == null ? void 0 : S.delete(n)), J.info("Görev silindi."), f.markClean(), $();
      } catch (E) {
        J.err((E == null ? void 0 : E.message) || "Görev silinemedi.");
      }
  }, Ya = async (S) => {
    try {
      await m.addFeature(S), v(S), J.ok("Özellik başarıyla eklendi.");
    } catch (E) {
      J.err((E == null ? void 0 : E.message) || "Özellik eklenemedi.");
    }
  }, $t = async (S) => {
    try {
      await m.removeFeature(S), v("general"), J.info("Özellik görevden kaldırıldı.");
    } catch (E) {
      J.err((E == null ? void 0 : E.message) || "Özellik kaldırılamadı.");
    }
  }, _a = async (S) => {
    var oe, he, xe, Pe, Se, He, Ie;
    const E = ((Pe = (xe = (he = (oe = window == null ? void 0 : window.apya) == null ? void 0 : oe.platform) == null ? void 0 : he.application) == null ? void 0 : xe.projects) == null ? void 0 : Pe.project) ?? ((Ie = (He = (Se = window == null ? void 0 : window.apya) == null ? void 0 : Se.platform) == null ? void 0 : He.projects) == null ? void 0 : Ie.project);
    if (!(E != null && E.create)) throw new Error("Proje servisi yüklenmedi.");
    const q = await Promise.resolve(E.create({
      name: S,
      code: pn(S),
      currency: "TRY"
    }));
    return await b.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), J.ok(`“${S}” projesi oluşturuldu.`), (q == null ? void 0 : q.id) ?? q;
  }, Oa = async ({ mode: S, targetProjectIds: E, include: q }) => {
    var oe, he;
    try {
      const xe = await Promise.resolve((oe = R()) == null ? void 0 : oe.transfer(n, {
        mode: S === "move" ? 1 : 2,
        targetProjectIds: E,
        include: q
      }));
      await b.invalidateQueries({ queryKey: ["task-detail", n] });
      const Pe = E.map((He) => {
        var Ie;
        return (Ie = c.options.find((Va) => Va.value === He)) == null ? void 0 : Ie.label;
      }).filter(Boolean), Se = ((he = xe == null ? void 0 : xe.createdTaskIds) == null ? void 0 : he.length) ?? 0;
      J.ok(S === "move" ? Se ? `“${Pe[0]}” projesine taşındı, ${Se} projeye kopyalandı.` : `Görev “${Pe[0]}” projesine taşındı.` : Se > 1 ? `${Se} projeye kopyalandı.` : `Kopya “${Pe[0]}” projesinde oluşturuldu.`), I(null);
    } catch (xe) {
      J.err((xe == null ? void 0 : xe.message) || "Transfer tamamlanamadı.");
    }
  }, Ua = h === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)] gap-5 items-start", children: [
    /* @__PURE__ */ e.jsx(
      Yr,
      {
        task: o,
        onFieldChange: p.setField,
        descriptionValue: p.values.description,
        checklist: g,
        currentUserName: ((Lt = (Bt = window == null ? void 0 : window.abp) == null ? void 0 : Bt.currentUser) == null ? void 0 : Lt.name) || ((Ft = (At = window == null ? void 0 : window.abp) == null ? void 0 : At.currentUser) == null ? void 0 : Ft.userName) || "Ben"
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5", children: /* @__PURE__ */ e.jsx(qr, { task: o, nameById: x.nameById }) })
  ] }) : Hr(h) ? /* @__PURE__ */ e.jsx(
    la,
    {
      code: h,
      onRemoveFeature: $t,
      onOpenPicker: () => L(!0),
      canRemove: !(A != null && A.isCore)
    }
  ) : /* @__PURE__ */ e.jsx(y.Suspense, { fallback: /* @__PURE__ */ e.jsx(je, { className: "h-48 w-full" }), children: A != null && A.component ? /* @__PURE__ */ e.jsx(
    A.component,
    {
      taskId: n,
      task: o,
      form: p,
      nameById: x.nameById,
      onOpenSubtask: O
    }
  ) : /* @__PURE__ */ e.jsx(
    la,
    {
      code: h,
      onRemoveFeature: $t,
      onOpenPicker: () => L(!0),
      canRemove: !(A != null && A.isCore)
    }
  ) }), Et = i ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(je, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(je, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(je, { className: "h-64 w-full" })
  ] }) : d ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(ee, { variant: "ghost", onClick: () => u(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col flex-1 min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      Kr,
      {
        task: o,
        presentation: a,
        onClose: P,
        isFullscreen: re,
        onToggleFullscreen: W,
        onFieldChange: p.setField,
        statusValue: p.values.status,
        titleValue: o == null ? void 0 : o.title,
        isPrivateValue: p.values.isPrivate,
        isFavorite: Q,
        onToggleFavorite: _,
        isWatched: Z,
        onToggleWatch: X,
        onDuplicate: Te,
        onArchive: pe,
        onDelete: qa,
        onOpenTransfer: (S) => I({ mode: S }),
        onSaveAsTemplate: () => J.info("Şablon olarak kaydetme yakında."),
        onConvertToSubtask: () => J.info("Alt göreve dönüştürme yakında."),
        onExportPdf: ne
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        Mr,
        {
          task: o,
          assigneeOptions: x.options,
          projectOptions: c.options,
          onFieldChange: p.setField,
          statusValue: p.values.status,
          priorityValue: p.values.priority,
          assigneeValue: p.values.assigneeId,
          projectValue: p.values.projectId,
          dueDateValue: p.values.dueDate,
          startDateValue: p.values.startDate,
          tagsValue: p.values.tagNames,
          progressPercent: le,
          progressNote: `${H}/${Y.length} madde`,
          onOpenTransfer: (S) => I({ mode: S })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        a === "page" && /* @__PURE__ */ e.jsx(
          Gr,
          {
            activeTab: h,
            onTabChange: v,
            orderedTabs: C.orderedTabs,
            draggingCode: C.draggingCode,
            onDragStart: C.handleDragStart,
            onDragEnd: C.handleDragEnd,
            onReorderTo: C.reorderTo,
            onReorderDrop: () => J.info("Sekme sırası güncellendi."),
            onOpenPicker: () => L(!0),
            counts: M
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: a === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            Rr,
            {
              activeTab: h,
              onTabChange: v,
              orderedTabs: C.orderedTabs,
              draggingCode: C.draggingCode,
              onDragStart: C.handleDragStart,
              onDragEnd: C.handleDragEnd,
              onReorderTo: C.reorderTo,
              onReorderDrop: () => J.info("Sekme sırası güncellendi."),
              onOpenPicker: () => L(!0),
              counts: M,
              isDirty: p.isDirty
            }
          ) }),
          /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised", children: Ua })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(
      _r,
      {
        lastSavedAt: o == null ? void 0 : o.lastModificationTime,
        isDirty: p.isDirty,
        isSaving: k,
        justSaved: D,
        onCancel: P,
        onSave: F
      }
    )
  ] }), Pt = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      Zr,
      {
        open: G,
        onClose: () => L(!1),
        assignedCodes: m.assignedCodes,
        onAddFeature: Ya,
        onGoToTab: v
      }
    ),
    /* @__PURE__ */ e.jsx(
      en,
      {
        open: !!z,
        mode: (z == null ? void 0 : z.mode) ?? "move",
        onClose: () => I(null),
        onConfirm: Oa,
        projectOptions: c.options,
        currentProjectId: p.values.projectId,
        counts: M,
        onCreateProject: _a
      }
    ),
    K && /* @__PURE__ */ e.jsx(
      ln,
      {
        subtaskId: K,
        parentCode: o == null ? void 0 : o.code,
        onClose: () => O(null),
        onOpenFull: (S) => {
          O(null), (r ?? l)(S);
        },
        onDeleted: () => b.invalidateQueries({ queryKey: ["task-detail", n] }),
        currentUserName: ((It = (zt = window == null ? void 0 : window.abp) == null ? void 0 : zt.currentUser) == null ? void 0 : It.name) || ((Mt = (Kt = window == null ? void 0 : window.abp) == null ? void 0 : Kt.currentUser) == null ? void 0 : Mt.userName) || "Ben"
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col w-full min-h-[calc(100vh-54px)] border-y border-subtle bg-surface-base", children: Et }),
    Pt
  ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(pa, { open: !0, onOpenChange: (S) => {
      S || P();
    }, children: /* @__PURE__ */ e.jsx(
      ma,
      {
        title: o != null && o.title ? `Görev Detayı: ${o.title}` : "Görev Detayı",
        fullscreen: re,
        className: re ? "p-0 rounded-xl border border-default shadow-xl short:h-[100svh]" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl short:h-[100svh]",
        onInteractOutside: (S) => {
          var E, q;
          S.preventDefault(), !(G || z || K) && ((q = (E = S.target) == null ? void 0 : E.closest) != null && q.call(E, "[data-apya-overlay]") || P());
        },
        onEscapeKeyDown: (S) => {
          if (G || z || K) {
            S.preventDefault();
            return;
          }
          S.preventDefault(), P();
        },
        children: Et
      }
    ) }),
    Pt
  ] });
}
function mn() {
  var a;
  const t = y.useSyncExternalStore(
    ie.subscribe,
    ie.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(et, { children: /* @__PURE__ */ e.jsx(
    Ra,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        ie.close(), ie.emitResult();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(et, { children: /* @__PURE__ */ e.jsx(
    Fa,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        ie.close(), ie.emitResult();
      }
    },
    t
  ) }) : null;
}
function Ga() {
  var s;
  try {
    const r = new URLSearchParams(window.location.search).get("taskui");
    if (r === "v1" || r === "v2" || r === "v3") return r;
  } catch {
  }
  const t = document.getElementById("task-detail-island"), a = (s = t == null ? void 0 : t.dataset) == null ? void 0 : s.taskui;
  return a === "v1" || a === "v2" ? a : "v3";
}
function fn() {
  return Ga() === "v2";
}
function bn() {
  return Ga() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = bn();
window.apya.taskDetailV2Enabled = fn() && !window.apya.taskDetailV3Enabled;
const da = {
  open: (t) => {
    ie.open(t);
  },
  close: () => ie.close(),
  onResult: (t) => ie.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(da) : window.apya.taskDetail = da;
function xa() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = ua(t), t._reactRoot.render(/* @__PURE__ */ e.jsx(mn, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = ya();
    a && ie.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", xa) : xa();
function hn({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(et, { children: /* @__PURE__ */ e.jsx(
    Ra,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(et, { children: /* @__PURE__ */ e.jsx(
    Fa,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) });
}
const ht = document.getElementById("task-detail-page-island");
if (ht) {
  const t = ht.getAttribute("data-task-id");
  t && ua(ht).render(/* @__PURE__ */ e.jsx(hn, { taskId: t }));
}
