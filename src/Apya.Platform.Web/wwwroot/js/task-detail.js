import { j as e, r as g, d as Re, b as da } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { a as et } from "./QueryProvider-AIUp_Zk5.js";
import { u as ee, a as re, b as se } from "./query-vendor-Bf69L2iP.js";
import { D as xa, i as ua, g as bt, B as ae, I as Ge, M as Ua, S as je } from "./Dialog-BdNKdiS6.js";
import { C as pa } from "./Combobox-Cgzidxen.js";
import { r as Oa } from "./httpClient-CRlyQ1eg.js";
import { R as Ne, T as we, P as ke, C as Ce, A as Va, a as ma, D as Ha, b as Qa, c as Wa, d as Za, e as Ja } from "./ui-vendor-DaE-uom6.js";
import { d as fa } from "./draggableActivation-Ybw9Upbh.js";
function Xa({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: i,
  footer: l,
  children: o
}) {
  return /* @__PURE__ */ e.jsx(
    xa,
    {
      open: t,
      onOpenChange: (n) => {
        n || a();
      },
      children: /* @__PURE__ */ e.jsx(
        ua,
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
function es({ title: t, header: a, footer: s, children: r }) {
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
function ts({ isPrivate: t }) {
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
const ht = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, gt = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function as({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: i,
  fullscreen: l = !1
}) {
  const [o, n] = g.useState(!1), d = g.useRef(null);
  g.useEffect(() => {
    if (!o) return;
    const u = (b) => {
      d.current && !d.current.contains(b.target) && n(!1);
    }, x = (b) => {
      b.key === "Escape" && n(!1);
    };
    return document.addEventListener("mousedown", u), document.addEventListener("keydown", x), () => {
      document.removeEventListener("mousedown", u), document.removeEventListener("keydown", x);
    };
  }, [o]);
  const p = ht[t == null ? void 0 : t.status] ?? ht[1], f = gt[t == null ? void 0 : t.priority] ?? gt[2], m = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), n(!1);
  }, c = () => {
    var x, b, y, h;
    const u = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (x = navigator.clipboard) == null || x.writeText(u), (h = (y = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : y.info) == null || h.call(y, "Bağlantı kopyalandı."), n(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(bt, { variant: p.variant, children: p.text }),
        /* @__PURE__ */ e.jsx(bt, { variant: f.variant, children: f.text }),
        /* @__PURE__ */ e.jsx(ts, { isPrivate: t == null ? void 0 : t.isPrivate })
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
      /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: d, children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": o,
            onClick: () => n((u) => !u),
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
                  onClick: c,
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
const ss = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function rs({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: i }) {
  const l = ss(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: l ? `Son kayıt: ${l}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(ae, { variant: "secondary", onClick: r, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        ae,
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
const Kt = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", ns = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function ge({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function is({ value: t, onChange: a }) {
  const [s, r] = g.useState(""), i = () => {
    const l = s.trim();
    l && !t.includes(l) && a([...t, l]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((l) => /* @__PURE__ */ e.jsxs(bt, { variant: "neutral", children: [
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
      Ge,
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
function ls({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: i = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(ge, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      Ge,
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
          className: Kt,
          children: Object.entries(ht).map(([l, o]) => /* @__PURE__ */ e.jsx("option", { value: l, children: o.text }, l))
        }
      ) }),
      /* @__PURE__ */ e.jsx(ge, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (l) => s("priority", Number(l.target.value)),
          className: Kt,
          children: Object.entries(gt).map(([l, o]) => /* @__PURE__ */ e.jsx("option", { value: l, children: o.text }, l))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(ge, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      pa,
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
      /* @__PURE__ */ e.jsx(ge, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        Ge,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (l) => s("startDate", l.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(ge, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        Ge,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (l) => s("dueDate", l.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(ge, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(is, { value: t.tagNames, onChange: (l) => s("tagNames", l) }) }),
    /* @__PURE__ */ e.jsx(ge, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (l) => s("description", l.target.value),
        className: ns
      }
    ) })
  ] });
}
const Mt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function Ie({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function os({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(Ie, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(Ie, { label: "Oluşturulma zamanı", value: Mt(t.creationTime) }),
      /* @__PURE__ */ e.jsx(Ie, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(Ie, { label: "Son güncelleme zamanı", value: Mt(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(Ie, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const cs = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", ds = "border-brand-500 text-text-primary";
function xs({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: i }) {
  const l = g.useRef(/* @__PURE__ */ new Map()), o = (d) => {
    var p;
    s(d.code), (p = l.current.get(d.code)) == null || p.focus();
  }, n = (d, p) => {
    d.key === "ArrowRight" ? (d.preventDefault(), o(t[(p + 1) % t.length])) : d.key === "ArrowLeft" ? (d.preventDefault(), o(t[(p - 1 + t.length) % t.length])) : d.key === "Home" ? (d.preventDefault(), o(t[0])) : d.key === "End" && (d.preventDefault(), o(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((d, p) => {
      const f = d.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (m) => {
            m ? l.current.set(d.code, m) : l.current.delete(d.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${d.code}`,
          "aria-selected": f,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: f ? 0 : -1,
          onClick: () => s(d.code),
          onKeyDown: (m) => n(m, p),
          className: `${cs} ${f ? ds : ""}`,
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
const us = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function ps({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [i, l] = g.useState(""), o = g.useMemo(() => {
    const n = i.trim().toLocaleLowerCase("tr-TR"), d = n ? t.filter((f) => f.title.toLocaleLowerCase("tr-TR").includes(n)) : t, p = /* @__PURE__ */ new Map();
    return d.forEach((f) => {
      const m = p.get(f.category) ?? [];
      m.push(f), p.set(f.category, m);
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
          Ge,
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
          [...o.entries()].map(([n, d]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: us[n] ?? n }),
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
          ] }, n))
        ] })
      ]
    }
  );
}
function ms({ trail: t = [], current: a, onNavigate: s }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((r) => /* @__PURE__ */ e.jsxs(Re.Fragment, { children: [
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
function fs(t) {
  var s, r, i;
  const a = (i = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : i.task;
  return a ? Promise.resolve(a.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Nt(t) {
  return ee({
    queryKey: ["task-detail", t],
    queryFn: () => fs(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function fe(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
function ba() {
  const [t, a] = g.useState(!1), [s, r] = g.useState(!1), i = g.useRef(null), l = g.useCallback(() => a(!0), []), o = g.useCallback(() => a(!1), []);
  g.useEffect(() => {
    if (!t) return;
    const p = (f) => {
      f.preventDefault(), f.returnValue = "";
    };
    return window.addEventListener("beforeunload", p), () => window.removeEventListener("beforeunload", p);
  }, [t]);
  const n = g.useCallback((p) => {
    if (!t) {
      p == null || p();
      return;
    }
    i.current = p ?? null, r(!0);
  }, [t]), d = g.useCallback((p) => {
    const f = i.current;
    return r(!1), i.current = null, p === "discard" && (a(!1), f == null || f()), p === "save" ? f : null;
  }, []);
  return { isDirty: t, markDirty: l, markClean: o, requestClose: n, pendingClose: s, resolvePendingClose: d };
}
const bs = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, wt = "task";
function ha() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(wt);
  return t && bs.test(t) ? t : null;
}
function ga() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(wt), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function ya(t, a) {
  const s = g.useRef(a);
  s.current = a, g.useEffect(() => {
    if (!t || ha() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(wt, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), g.useEffect(() => {
    const r = () => {
      var i;
      (i = s.current) == null || i.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const hs = {
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
function gs(t) {
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
  } : hs;
}
function va(t) {
  const [a, s] = g.useState(t == null ? void 0 : t.id), r = g.useMemo(() => gs(t), [t]), [i, l] = g.useState(r), [o, n] = g.useState({});
  (t == null ? void 0 : t.id) !== a && (s(t == null ? void 0 : t.id), l(r), n({}));
  const d = g.useCallback((u, x) => {
    l((b) => ({ ...b, [u]: x }));
  }, []), p = g.useMemo(
    () => JSON.stringify(i) !== JSON.stringify(r),
    [i, r]
  ), f = g.useCallback(() => {
    const u = {};
    return i.title.trim() || (u.title = "Başlık zorunlu."), i.startDate || (u.startDate = "Başlangıç tarihi zorunlu."), i.dueDate && i.startDate && i.dueDate < i.startDate && (u.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), n(u), Object.keys(u).length === 0;
  }, [i]), m = g.useCallback(() => ({
    title: i.title.trim(),
    description: i.description || null,
    startDate: i.startDate,
    dueDate: i.dueDate || null,
    status: i.status,
    priority: i.priority,
    assigneeId: i.assigneeId,
    boardColumnId: (t == null ? void 0 : t.boardColumnId) ?? null,
    projectId: i.projectId ?? null,
    parentTaskId: (t == null ? void 0 : t.parentTaskId) ?? null,
    isPrivate: !!i.isPrivate,
    predecessorIds: (t == null ? void 0 : t.predecessorIds) ?? [],
    tagNames: i.tagNames,
    estimatedHours: i.estimatedHours,
    taskType: i.taskType || null,
    sprint: i.sprint || null,
    /* DTO'dan DÜŞÜRÜLEMEZ: UpdateAsync bu iki alanı koşulsuz uyguluyor
       (task.SetBudgetLink), dolayısıyla gönderilmediklerinde görevin bütçe
       bağı HER kayıtta sessizce siliniyordu. Eski Razor modali aynı tuzağa
       karşı "koru" bloğu yazmıştı (Tasks/EditModal.cshtml.cs); burada alanlar
       form state'inde taşındığı için koruma kendiliğinden oluşuyor. */
    budgetLineId: i.budgetLineId ?? null,
    plannedAmount: i.plannedAmount ?? null
  }), [i, t]), c = g.useCallback(() => {
    l(r), n({});
  }, [r]);
  return { values: i, setField: d, isDirty: p, errors: o, validate: f, toUpdateDto: m, reset: c };
}
function Rt(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function ys() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ja() {
  var i;
  const t = ee({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: ys,
    staleTime: 3e5,
    retry: !1
  }), a = ((i = t.data) == null ? void 0 : i.items) ?? [], s = a.map((l) => ({ value: l.id, label: Rt(l) })), r = new Map(a.map((l) => [l.id, Rt(l)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function yt() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function vs(t) {
  const a = yt();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Na(t) {
  const a = re(), s = ["task-features", t], r = ee({
    queryKey: s,
    queryFn: () => vs(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), l = se({
    mutationFn: (n) => Promise.resolve(yt().addFeature(t, n)),
    onSuccess: i
  }), o = se({
    mutationFn: (n) => Promise.resolve(yt().removeFeature(t, n)),
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
const tt = {
  0: { label: "İptal", icon: "fa-ban", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  1: { label: "Yapılacak", icon: "fa-clock", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  2: { label: "Sürüyor", icon: "fa-spinner", bg: "bg-warning-subtle", fg: "text-warning", dot: "bg-warning" },
  3: { label: "Testte", icon: "fa-flask", bg: "bg-primary-subtle", fg: "text-primary", dot: "bg-primary" },
  4: { label: "Tamamlandı", icon: "fa-circle-check", bg: "bg-success-subtle", fg: "text-success", dot: "bg-success" }
}, vt = {
  1: { label: "Düşük", icon: "fa-arrow-down", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  2: { label: "Orta", icon: "fa-minus", bg: "bg-warning-subtle", fg: "text-warning" },
  3: { label: "Yüksek", icon: "fa-arrow-up", bg: "bg-negative-subtle", fg: "text-negative" },
  4: { label: "Kritik", icon: "fa-flag", bg: "bg-negative-subtle", fg: "text-negative" }
}, at = [1, 2, 3, 4], js = [1, 2, 3, 4], be = (t) => tt[t] ?? tt[1], rt = (t) => vt[t] ?? vt[2];
function _e(t) {
  if (!t) return "—";
  const a = String(t).trim().split(/\s+/).filter(Boolean);
  return a.length ? (a.length > 1 ? a[0][0] + a[a.length - 1][0] : a[0].slice(0, 2)).toUpperCase() : "—";
}
function Ue(t) {
  return t ? "var(--apya-brand-500)" : "var(--apya-neutral-500)";
}
function wa(t, a = /* @__PURE__ */ new Date()) {
  if (!t) return { tone: "text-text-tertiary", hint: "" };
  const s = new Date(t);
  if (Number.isNaN(s.getTime())) return { tone: "text-text-tertiary", hint: "" };
  const r = Math.ceil((s.setHours(0, 0, 0, 0) - new Date(a).setHours(0, 0, 0, 0)) / 864e5);
  return r < 0 ? { tone: "text-negative", hint: `${Math.abs(r)} gün gecikti` } : r === 0 ? { tone: "text-warning", hint: "Bugün" } : r <= 3 ? { tone: "text-warning", hint: `${r} gün kaldı` } : { tone: "text-text-tertiary", hint: `${r} gün kaldı` };
}
const ka = "rounded-2xl border border-subtle bg-surface-base shadow-xs", De = `${ka} overflow-hidden`;
function Ye({ title: t, badge: a, action: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3.5 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: t }),
      a
    ] }),
    s
  ] });
}
function Ca({ children: t, tone: a = "positive" }) {
  const s = a === "positive" ? "bg-success-subtle text-success" : "bg-neutral-subtle text-text-secondary";
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-full font-mono text-[11px] font-bold ${s}`, children: t });
}
function Pe({ children: t, bg: a, fg: s }) {
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-[7px] text-[10.5px] font-bold ${a} ${s}`, children: t });
}
function xe({ icon: t, title: a, description: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 px-6 py-10 text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-xl text-text-tertiary` }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: a }),
    s && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] leading-[1.55] text-text-tertiary max-w-[420px]", children: s })
  ] });
}
function nt({ name: t, size: a = 24 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Ue(t), fontSize: a * 0.4 },
      title: t || void 0,
      children: _e(t)
    }
  );
}
const Oe = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—", st = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function Da(t) {
  return t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : "0 KB";
}
function it(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = Math.floor(a / 3600), r = Math.floor(a % 3600 / 60);
  return !s && !r ? `${a}sn` : s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function Ns(t) {
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
}, Gt = (t = "") => Ta(t) === ve.image;
function Ta(t = "") {
  var s;
  const a = ((s = t.split(".").pop()) == null ? void 0 : s.toLowerCase()) ?? "";
  return a === "pdf" ? ve.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(a) ? ve.image : ["doc", "docx", "odt", "rtf", "txt"].includes(a) ? ve.doc : ["xls", "xlsx", "csv", "ods"].includes(a) ? ve.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(a) ? ve.code : ["zip", "rar", "7z", "tar", "gz"].includes(a) ? ve.zip : ve.other;
}
function ws({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, i] = g.useState(""), [l, o] = g.useState(!1), n = re(), d = (a == null ? void 0 : a.subTasks) ?? [], p = d.filter((u) => u.status === 4).length, f = () => n.invalidateQueries({ queryKey: ["task-detail", t] }), m = async () => {
    var x, b, y;
    const u = r.trim();
    if (u) {
      o(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: u,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), i(""), await f();
      } catch (h) {
        (y = (b = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : b.error) == null || y.call(b, (h == null ? void 0 : h.message) || "Alt görev eklenemedi.");
      } finally {
        o(!1);
      }
    }
  }, c = async (u, x) => {
    var b, y, h;
    u.stopPropagation();
    try {
      await Promise.resolve(window.apya.platform.tasks.task.updateStatus(x.id, x.status === 4 ? 1 : 4)), await f();
    } catch (j) {
      (h = (y = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : y.error) == null || h.call(y, (j == null ? void 0 : j.message) || "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        d.length > 0 && /* @__PURE__ */ e.jsxs(Ca, { children: [
          p,
          "/",
          d.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: m,
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
      d.map((u) => {
        const x = be(u.status), b = u.status === 4;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => s == null ? void 0 : s(u.id, u.title),
            onKeyDown: (y) => {
              y.key === "Enter" && (s == null || s(u.id, u.title));
            },
            className: "flex items-center gap-3.5 px-4 py-3.5 border-t border-subtle first:border-t-0 hover:bg-surface-raised cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": `${u.title} tamamlandı işaretle`,
                  onClick: (y) => c(y, u),
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white cursor-pointer ${b ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: b && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: u.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${b ? "line-through text-text-tertiary" : "text-text-primary"}`, children: u.title }),
              /* @__PURE__ */ e.jsx(Pe, { bg: x.bg, fg: x.fg, children: x.label }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: Oe(u.dueDate) }),
              /* @__PURE__ */ e.jsx(nt, { name: u.assigneeName }),
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-right shrink-0 text-[10px] text-text-tertiary" })
            ]
          },
          u.id
        );
      }),
      /* @__PURE__ */ e.jsx("div", { className: "px-4 py-3 border-t border-subtle first:border-t-0", children: /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: r,
          onChange: (u) => i(u.target.value),
          onKeyDown: (u) => {
            u.key === "Enter" && m();
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
function Sa() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function ks(t) {
  const a = Sa();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function Cs(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, i = Oa();
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
function kt(t) {
  const a = re(), s = ["task-attachments", t], r = ee({
    queryKey: s,
    queryFn: () => ks(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), l = se({
    mutationFn: (n) => Cs(t, n),
    onSuccess: i
  }), o = se({
    mutationFn: (n) => Promise.resolve(Sa().deleteAttachment(n)),
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
function Ds({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: i } = kt(t), l = re(), o = g.useRef(null), [n, d] = g.useState(!1), p = fe("Platform.Tasks.ShareExternally"), f = async (u, x) => {
    var b, y, h;
    try {
      await window.apya.platform.tasks.taskShare.setAttachmentGuestVisibility(u, x), l.invalidateQueries({ queryKey: ["task-attachments", t] });
    } catch (j) {
      (h = (y = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : y.error) == null || h.call(y, (j == null ? void 0 : j.message) || "Görünürlük değiştirilemedi.");
    }
  }, m = async (u) => {
    var x, b, y, h, j, C;
    if (u)
      try {
        await s(u), (y = (b = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : b.success) == null || y.call(b, "Dosya yüklendi.");
      } catch (T) {
        (C = (j = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : j.error) == null || C.call(j, (T == null ? void 0 : T.message) || "Dosya yüklenemedi.");
      } finally {
        o.current && (o.current.value = "");
      }
  }, c = async (u, x) => {
    var b, y, h;
    try {
      await r(u);
    } catch (j) {
      (h = (y = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : y.error) == null || h.call(y, (j == null ? void 0 : j.message) || `${x} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: o,
        type: "file",
        className: "hidden",
        onChange: (u) => {
          var x;
          return m((x = u.target.files) == null ? void 0 : x[0]);
        },
        disabled: i
      }
    ),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "button",
        tabIndex: 0,
        onClick: () => {
          var u;
          return (u = o.current) == null ? void 0 : u.click();
        },
        onKeyDown: (u) => {
          var x;
          u.key === "Enter" && ((x = o.current) == null || x.click());
        },
        onDragOver: (u) => {
          u.preventDefault(), n || d(!0);
        },
        onDragLeave: () => d(!1),
        onDrop: (u) => {
          var x, b;
          u.preventDefault(), d(!1), m((b = (x = u.dataTransfer) == null ? void 0 : x.files) == null ? void 0 : b[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${n ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${i ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-[26px] ${n ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: i ? "Yükleniyor…" : n ? "Bırakın, yükleyelim" : "Dosyaları buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, PDF, DOCX · max 25MB" })
        ]
      }
    ),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3", children: a.map((u) => {
      const x = Ta(u.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${x.bg} ${x.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: u.fileName, children: u.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: Da(u.fileSize) })
              ] })
            ] }),
            p && !u.isGuestUpload && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 text-[11px] text-text-tertiary cursor-pointer", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: !!u.isVisibleToGuests,
                  onChange: (b) => f(u.id, b.target.checked)
                }
              ),
              "Dış paylaşımda görünsün"
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2.5 border-t border-subtle", children: [
              /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[11px] text-text-tertiary", children: [
                u.uploaderName,
                u.isGuestUpload ? " · dış" : ""
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-1 shrink-0", children: [
                /* @__PURE__ */ e.jsx(
                  "a",
                  {
                    href: u.downloadUrl,
                    target: "_blank",
                    rel: "noreferrer",
                    title: "İndir",
                    "aria-label": `${u.fileName} dosyasini indir`,
                    className: "flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-primary-subtle hover:text-primary",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-download text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Sil",
                    "aria-label": `${u.fileName} dosyasini sil`,
                    onClick: () => c(u.id, u.fileName),
                    className: "flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                )
              ] })
            ] })
          ]
        },
        u.id
      );
    }) })
  ] });
}
function Je() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Ts(t) {
  const a = Je();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ct(t) {
  const a = re(), s = ["task-checklist", t], r = ee({
    queryKey: s,
    queryFn: () => Ts(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), l = se({
    mutationFn: (d) => Promise.resolve(Je().addChecklistItem(t, d)),
    onSuccess: i
  }), o = se({
    mutationFn: (d) => Promise.resolve(Je().toggleChecklistItem(d)),
    onSuccess: i
  }), n = se({
    mutationFn: (d) => Promise.resolve(Je().deleteChecklistItem(d)),
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
function Ss({ taskId: t }) {
  const { items: a, isLoading: s, addItem: r, toggleItem: i, removeItem: l } = Ct(t), [o, n] = g.useState(""), d = a.filter((m) => m.isDone).length, p = a.length ? Math.round(d / a.length * 100) : 0, f = async () => {
    var c, u, x;
    const m = o.trim();
    if (!(!m || !t)) {
      n("");
      try {
        await r(m);
      } catch (b) {
        n(m), (x = (u = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : u.error) == null || x.call(u, (b == null ? void 0 : b.message) || "Madde eklenemedi.");
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
        p
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mt-3.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
      "div",
      {
        className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
        style: { width: `${p}%` }
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
      s && a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 py-2 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
      !s && a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 py-2 text-[12.5px] text-text-tertiary", children: "Henüz madde yok. Aşağıdan ilk maddeyi ekleyin." }),
      a.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": m.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
            onClick: () => i(m.id).catch((c) => {
              var u, x, b;
              return (b = (x = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : x.error) == null ? void 0 : b.call(x, (c == null ? void 0 : c.message) || "Durum güncellenemedi.");
            }),
            className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white cursor-pointer transition-colors duration-fast ${m.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
            children: m.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${m.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: m.text }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            title: "Sil",
            "aria-label": `${m.text} maddesini sil`,
            onClick: () => l(m.id).catch((c) => {
              var u, x, b;
              return (b = (x = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : x.error) == null ? void 0 : b.call(x, (c == null ? void 0 : c.message) || "Madde silinemedi.");
            }),
            className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
          }
        )
      ] }, m.id)),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: o,
          onChange: (m) => n(m.target.value),
          onKeyDown: (m) => {
            m.key === "Enter" && f();
          },
          placeholder: "Yeni madde yaz ve Enter'a bas…",
          "aria-label": "Yeni kontrol listesi maddesi",
          className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      )
    ] })
  ] });
}
function $s({ taskId: t, task: a }) {
  const [s, r] = g.useState(""), [i, l] = g.useState(null), [o, n] = g.useState(""), [d, p] = g.useState(!1), f = re(), m = (a == null ? void 0 : a.comments) ?? [], c = async (x) => {
    var b, y, h, j, C, T;
    if (x == null || x.preventDefault(), !(!s.trim() || d)) {
      p(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), f.invalidateQueries({ queryKey: ["task-detail", t] }), (h = (y = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : y.success) == null || h.call(y, "Yorum eklendi.");
      } catch (D) {
        (T = (C = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : C.error) == null || T.call(C, (D == null ? void 0 : D.message) || "Yorum eklenemedi.");
      } finally {
        p(!1);
      }
    }
  }, u = async (x) => {
    var b, y, h, j, C, T;
    if (!(!o.trim() || d)) {
      p(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(x, o.trim())
        ), n(""), l(null), f.invalidateQueries({ queryKey: ["task-detail", t] }), (h = (y = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : y.success) == null || h.call(y, "Yanıt eklendi.");
      } catch (D) {
        (T = (C = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : C.error) == null || T.call(C, (D == null ? void 0 : D.message) || "Yanıt eklenemedi.");
      } finally {
        p(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("form", { onSubmit: c, className: "rounded-lg border border-default p-3 bg-surface-base", children: [
      /* @__PURE__ */ e.jsx(
        "textarea",
        {
          rows: 3,
          value: s,
          onChange: (x) => r(x.target.value),
          placeholder: "Bir yorum veya güncelleme yazın...",
          className: "w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ e.jsx(
        ae,
        {
          type: "submit",
          variant: "primary",
          disabled: !s.trim() || d,
          isLoading: d,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    m.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: m.map((x) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: x.creatorUserName || x.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: x.creationTime ? new Date(x.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: x.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        ae,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => l(i === x.id ? null : x.id),
          children: "Yanıtla"
        }
      ) }),
      i === x.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: o,
            onChange: (b) => n(b.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(ae, { variant: "ghost", size: "sm", onClick: () => l(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(ae, { variant: "primary", size: "sm", disabled: !o.trim() || d, onClick: () => u(x.id), children: "Gönder" })
        ] })
      ] }),
      x.replies && x.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: x.replies.map((b) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: b.creatorUserName || b.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: b.creationTime ? new Date(b.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: b.text })
      ] }, b.id)) })
    ] }, x.id)) })
  ] });
}
function lt() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.taskShare) ?? null;
}
function Ps(t) {
  const a = re(), s = ["task-share-links", t], r = ee({
    queryKey: s,
    queryFn: () => {
      const n = lt();
      return n ? Promise.resolve(n.getList(t)) : Promise.reject(new Error("Paylaşım servisi yüklenmedi."));
    },
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), l = se({
    mutationFn: (n) => Promise.resolve(lt().create({ ...n, taskId: t })),
    onSuccess: i
  }), o = se({
    mutationFn: (n) => Promise.resolve(lt().revoke(n)),
    onSuccess: i
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
const qt = {
  recipientName: "",
  recipientEmail: "",
  lifetimeDays: 14,
  allowComment: !0,
  allowUpload: !0,
  allowDownload: !0
};
function Es(t) {
  return t ? new Date(t).toLocaleDateString("tr-TR") : "—";
}
function Bs({ taskId: t }) {
  const { links: a, isPending: s, create: r, revoke: i, isCreating: l } = Ps(t), [o, n] = g.useState(qt), [d, p] = g.useState(null);
  if (!fe("Platform.Tasks.ShareExternally"))
    return /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Görevi ekip dışıyla paylaşma yetkiniz yok." });
  const m = (y) => (h) => {
    const j = h.target.type === "checkbox" ? h.target.checked : h.target.value;
    n((C) => ({ ...C, [y]: j }));
  }, c = async (y) => {
    var h, j, C;
    if (y.preventDefault(), !!o.recipientName.trim())
      try {
        const T = await r({
          ...o,
          lifetimeDays: Number(o.lifetimeDays) || 14
        });
        p(T), n(qt);
      } catch (T) {
        (C = (j = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : j.error) == null || C.call(j, (T == null ? void 0 : T.message) || "Paylaşım linki üretilemedi.");
      }
  }, u = (y) => `${window.location.origin}${y}`, x = (y) => {
    var h, j, C, T;
    (h = navigator.clipboard) == null || h.writeText(u(y)), (T = (C = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : C.info) == null || T.call(C, "Bağlantı kopyalandı.");
  }, b = async (y) => {
    var h, j, C;
    try {
      await i(y);
    } catch (T) {
      (C = (j = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : j.error) == null || C.call(j, (T == null ? void 0 : T.message) || "Bağlantı iptal edilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    d && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 rounded-[14px] border border-focus bg-primary-subtle p-3.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "text-[12.5px] font-bold text-text-primary", children: [
        "Bağlantı hazır — ",
        /* @__PURE__ */ e.jsx("span", { className: "font-normal", children: "şimdi kopyalayın, bir daha gösterilmeyecek." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("code", { className: "min-w-0 flex-1 truncate rounded-[8px] bg-surface-base px-2.5 py-2 font-mono text-[11.5px] text-text-secondary", children: u(d.url) }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => x(d.url),
            className: "rounded-[8px] bg-primary px-3 py-2 text-[12px] font-bold text-white cursor-pointer",
            children: "Kopyala"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => p(null),
            className: "rounded-[8px] px-3 py-2 text-[12px] font-bold text-text-tertiary cursor-pointer hover:text-text-primary",
            children: "Kapat"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("form", { onSubmit: c, className: "flex flex-col gap-2.5 rounded-[14px] border border-subtle bg-surface-base p-3.5", children: [
      /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary", children: "Yeni paylaşım bağlantısı" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2.5", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            required: !0,
            value: o.recipientName,
            onChange: m("recipientName"),
            placeholder: "Kime? (ad soyad)",
            className: "min-w-0 flex-[2_1_180px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "email",
            value: o.recipientEmail,
            onChange: m("recipientEmail"),
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
            onChange: m("lifetimeDays"),
            title: "Geçerlilik (gün)",
            className: "w-[92px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: o.allowComment, onChange: m("allowComment") }),
          "Yorum yazabilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: o.allowUpload, onChange: m("allowUpload") }),
          "Dosya yükleyebilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: o.allowDownload, onChange: m("allowDownload") }),
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
    s ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görev henüz kimseyle paylaşılmadı." }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: a.map((y) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-subtle bg-surface-base p-3",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "truncate text-[12.5px] font-bold text-text-primary", children: [
              y.recipientName,
              y.recipientEmail ? /* @__PURE__ */ e.jsxs("span", { className: "font-normal text-text-tertiary", children: [
                " · ",
                y.recipientEmail
              ] }) : null
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "text-[11.5px] text-text-tertiary", children: [
              y.isActive ? `${Es(y.expiresAt)} tarihine kadar geçerli` : y.revokedAt ? "İptal edildi" : "Süresi doldu",
              " · ",
              y.accessCount,
              " erişim",
              " · ",
              y.uploadCount,
              " dosya"
            ] })
          ] }),
          y.isActive && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => b(y.id),
              className: "shrink-0 rounded-[8px] px-3 py-1.5 text-[12px] font-bold text-text-negative cursor-pointer hover:bg-negative-subtle",
              children: "İptal et"
            }
          )
        ]
      },
      y.id
    )) })
  ] });
}
function Ls({ task: t }) {
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
    a.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Aktivite kaydı bulunamadı." }) }) : /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: a.map((r, i) => {
      const l = i === a.length - 1;
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
function As({ label: t, value: a, hint: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4 px-3.5 py-3", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[12.5px] font-semibold text-text-secondary", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 text-right", children: [
      /* @__PURE__ */ e.jsx("span", { className: "block text-[12.5px] font-bold text-text-primary break-words", children: a ?? "—" }),
      s && /* @__PURE__ */ e.jsx("span", { className: "block text-[11px] text-text-tertiary", children: s })
    ] })
  ] });
}
function zs({ task: t = {}, nameById: a }) {
  const s = (i) => {
    var l;
    return i && ((l = a == null ? void 0 : a.get) == null ? void 0 : l.call(a, i)) || null;
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
      /* @__PURE__ */ e.jsx("div", { className: "divide-y divide-subtle", children: r.map((i) => /* @__PURE__ */ e.jsx(As, { ...i }, i.label)) })
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11.5px] text-text-tertiary", children: "Alan bazında değişiklik günlüğü (hangi alan, eski/yeni değer) henüz yayınlanmadı." })
  ] });
}
function Fs(t) {
  var s, r, i;
  const a = (i = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.projectBudgets) == null ? void 0 : i.projectBudget;
  return a != null && a.getRecordFormLookup ? Promise.resolve(a.getRecordFormLookup(t)) : Promise.reject(new Error("Bütçe servisi yüklenmedi."));
}
function Is(t) {
  var i;
  const a = fe("Platform.Projects.ViewBudget"), s = ee({
    queryKey: ["task-detail", "budget-lines", t],
    queryFn: () => Fs(t),
    enabled: !!t && a,
    staleTime: 6e4,
    retry: !1
  }), r = ((i = s.data) == null ? void 0 : i.lines) ?? [];
  return {
    lines: r,
    options: r.map((l) => ({ value: l.id, label: l.code ? `${l.code} · ${l.name}` : l.name })),
    canViewBudget: a,
    isLoading: s.isLoading
  };
}
function me(t, a) {
  const s = a || "TRY";
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: s, minimumFractionDigits: 2 }).format(t || 0);
  } catch {
    return `${(t || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${s}`.trim();
  }
}
function ot(t, a, s) {
  var o, n, d, p, f;
  const r = (o = window == null ? void 0 : window.abp) == null ? void 0 : o.ModalManager;
  if (!r) {
    (p = (d = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.notify) == null ? void 0 : d.error) == null || p.call(d, "Kayıt formu yüklenemedi.");
    return;
  }
  const i = ((f = window == null ? void 0 : window.abp) == null ? void 0 : f.appPath) ?? "/", l = new r({ viewUrl: `${i}${t}?TaskId=${a}` });
  l.onResult(() => s == null ? void 0 : s()), l.open();
}
function Ks({ taskId: t }) {
  const a = re(), s = fe("Platform.Expenses.Create"), r = fe("Platform.Incomes.Create"), i = fe("Platform.Invoices.Create");
  if (!t || !s && !r && !i)
    return null;
  const l = () => a.invalidateQueries({ queryKey: ["task-detail", t] });
  return /* @__PURE__ */ e.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
    s && /* @__PURE__ */ e.jsxs(
      ae,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => ot("Expenses/CreateModal", t, l),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-up text-[11px]" }),
          "Gider ekle"
        ]
      }
    ),
    r && /* @__PURE__ */ e.jsxs(
      ae,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => ot("Incomes/CreateModal", t, l),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-down text-[11px]" }),
          "Gelir ekle"
        ]
      }
    ),
    i && /* @__PURE__ */ e.jsxs(
      ae,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => ot("Invoices/CreateModal", t, l),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-invoice text-[11px]" }),
          "Fatura ekle"
        ]
      }
    )
  ] });
}
const Yt = {
  0: { label: "Taslak", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  1: { label: "Gönderildi", bg: "bg-primary-subtle", fg: "text-primary" },
  2: { label: "Ödendi", bg: "bg-success-subtle", fg: "text-success" },
  3: { label: "İptal", bg: "bg-neutral-subtle", fg: "text-text-tertiary" },
  4: { label: "Gecikti", bg: "bg-negative-subtle", fg: "text-negative" }
};
function Ms({ invoices: t, action: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: De, children: [
    /* @__PURE__ */ e.jsx(Ye, { title: "Faturalar", action: a }),
    t.map((s) => {
      const r = Yt[s.status] ?? Yt[0];
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
              Oe(s.dueDate)
            ] }),
            /* @__PURE__ */ e.jsx(Pe, { bg: r.bg, fg: r.fg, children: r.label }),
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary",
                style: { fontVariantNumeric: "tabular-nums" },
                children: me(s.totalAmount, s.currency)
              }
            )
          ]
        },
        s.id
      );
    })
  ] });
}
function ct({ label: t, value: a, tone: s, note: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: `font-mono text-[22px] font-bold tracking-[-.02em] ${s}`, style: { fontVariantNumeric: "tabular-nums" }, children: a }),
    r && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
  ] });
}
function Rs({ options: t, isLoading: a, lineId: s, planned: r, onField: i }) {
  return a ? null : t.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12px] text-text-tertiary", children: "Bu projede bütçe kalemi tanımlı değil — kalemler Finans & Bütçe ekranından açılır." }) : /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Bütçe kalemi" }),
      /* @__PURE__ */ e.jsx(
        pa,
        {
          options: t,
          value: s ?? void 0,
          onChange: (l) => i("budgetLineId", l ?? null),
          placeholder: "Kalem seç",
          size: "sm"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Görev bütçesi" }),
      /* @__PURE__ */ e.jsx(
        Ua,
        {
          value: r,
          onValueChange: (l) => i("plannedAmount", l),
          currency: "TRY",
          min: 0,
          size: "sm",
          disabled: !s
        }
      )
    ] })
  ] });
}
function Gs({ task: t, form: a, spentByCurrency: s }) {
  const r = (a ? a.values.projectId : t == null ? void 0 : t.projectId) ?? null, { options: i, lines: l, canViewBudget: o, isLoading: n } = Is(r), d = !!a && o && !!r, p = (a ? a.values.budgetLineId : t == null ? void 0 : t.budgetLineId) ?? null, f = (a ? a.values.plannedAmount : t == null ? void 0 : t.plannedAmount) ?? null;
  if (!d && (!p || f == null))
    return null;
  const m = l.find((C) => C.id === p), c = m ? m.remainingAmount : t == null ? void 0 : t.budgetLineRemaining, u = s, x = !!p && f != null, b = (f ?? 0) - u, y = f > 0 ? Math.round(u / f * 100) : 0, h = b < 0, j = () => {
    a.setField("budgetLineId", null), a.setField("plannedAmount", null);
  };
  return (
    /* Kırpmayan kart ŞART: kalem seçicisinin listesi kartın içine absolute
       konumlanır, TAB_CARD'ın overflow-hidden'ı onu alt kenarda keserdi. */
    /* @__PURE__ */ e.jsxs("div", { className: ka, children: [
      /* @__PURE__ */ e.jsx(
        Ye,
        {
          title: "Bütçe bağı",
          action: d && p ? /* @__PURE__ */ e.jsx(ae, { type: "button", variant: "ghost", size: "sm", onClick: j, children: "Bağı kaldır" }) : null
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "px-4 pb-4 pt-1 flex flex-col gap-3", children: [
        d ? /* @__PURE__ */ e.jsx(
          Rs,
          {
            options: i,
            isLoading: n,
            lineId: p,
            planned: f,
            onField: a.setField
          }
        ) : /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-semibold text-accent", children: t.budgetLineName || "Bütçe kalemi" }) }),
        c != null && /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "kalemde kalan ",
          me(c, "TRY")
        ] }),
        x && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3", children: [
            /* @__PURE__ */ e.jsx(dt, { label: "Görev bütçesi", value: me(f, "TRY") }),
            /* @__PURE__ */ e.jsx(dt, { label: "Gerçekleşen", value: me(u, "TRY") }),
            /* @__PURE__ */ e.jsx(
              dt,
              {
                label: "Kalan",
                value: me(b, "TRY"),
                tone: h ? "text-negative" : "text-success"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
              "div",
              {
                className: `h-full rounded-full ${h ? "bg-negative" : y >= 80 ? "bg-warning" : "bg-success"}`,
                style: { width: `${Math.min(Math.max(y, 0), 100)}%` }
              }
            ) }),
            /* @__PURE__ */ e.jsxs("div", { className: "mt-1 text-[11.5px] text-text-tertiary", children: [
              "%",
              y,
              h && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative", children: "· görev bütçesi aşıldı" })
            ] })
          ] })
        ] })
      ] })
    ] })
  );
}
function dt({ label: t, value: a, tone: s }) {
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
function qs({ task: t, taskId: a, form: s }) {
  const r = (t == null ? void 0 : t.expenses) || [], i = (t == null ? void 0 : t.incomes) || [], l = (t == null ? void 0 : t.invoices) || [], o = r.filter((c) => (c.currency || "TRY") === "TRY").reduce((c, u) => c + (u.amount || 0), 0), n = /* @__PURE__ */ e.jsx(Gs, { task: t, form: s, spentByCurrency: o }), d = /* @__PURE__ */ e.jsx(Ks, { taskId: a ?? (t == null ? void 0 : t.id) });
  if (r.length === 0 && i.length === 0 && l.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      n,
      /* @__PURE__ */ e.jsxs("div", { className: De, children: [
        /* @__PURE__ */ e.jsx(Ye, { title: "Görev Finansı", action: d }),
        /* @__PURE__ */ e.jsx(
          xe,
          {
            icon: "fa-coins",
            title: "Kayıt yok",
            description: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
          }
        )
      ] })
    ] });
  const f = Array.from(new Set([...r, ...i].map((c) => c.currency || "TRY"))).map((c) => {
    const u = i.filter((b) => (b.currency || "TRY") === c).reduce((b, y) => b + (y.amount || 0), 0), x = r.filter((b) => (b.currency || "TRY") === c).reduce((b, y) => b + (y.amount || 0), 0);
    return { cur: c, inc: u, exp: x, net: u - x };
  }), m = [
    ...i.map((c) => ({ ...c, kind: "income" })),
    ...r.map((c) => ({ ...c, kind: "expense" }))
  ].sort((c, u) => new Date(u.date || 0) - new Date(c.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    n,
    f.map(({ cur: c, inc: u, exp: x, net: b }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(ct, { label: `Toplam Gelir (${c})`, value: me(u, c), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(ct, { label: `Toplam Gider (${c})`, value: me(x, c), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        ct,
        {
          label: `Net Bakiye (${c})`,
          value: me(b, c),
          tone: b >= 0 ? "text-success" : "text-negative",
          note: b >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, c)),
    l.length > 0 && /* @__PURE__ */ e.jsx(Ms, { invoices: l, action: m.length === 0 ? d : null }),
    m.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: De, children: [
      /* @__PURE__ */ e.jsx(Ye, { title: "Finans kalemleri", action: d }),
      m.map((c) => /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-7 w-7 rounded-lg bg-neutral-subtle text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c.kind === "income" ? "fa-arrow-down" : "fa-arrow-up"} text-[11px]` }) }),
            /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] font-semibold text-text-primary", children: c.title || (c.kind === "income" ? "Gelir" : "Gider") }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: Oe(c.date) }),
            c.kind === "income" ? /* @__PURE__ */ e.jsx(Pe, { bg: "bg-success-subtle", fg: "text-success", children: "Gelir" }) : /* @__PURE__ */ e.jsx(Pe, { bg: "bg-warning-subtle", fg: "text-warning", children: "Gider" }),
            /* @__PURE__ */ e.jsxs(
              "span",
              {
                className: `shrink-0 font-mono text-[12.5px] font-bold ${c.kind === "income" ? "text-success" : "text-text-primary"}`,
                style: { fontVariantNumeric: "tabular-nums" },
                children: [
                  c.kind === "income" ? "+" : "−",
                  me(c.amount, c.currency)
                ]
              }
            )
          ]
        },
        `${c.kind}-${c.id}`
      ))
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11px] text-text-tertiary", children: "Buradan eklenen kayıt göreve ve projesine etiketlenir; düzenleme/silme Finans modülünden yapılır." })
  ] });
}
function Ys({ taskId: t }) {
  const { attachments: a, isLoading: s, upload: r, remove: i, isUploading: l } = kt(t), o = g.useRef(null), [n, d] = g.useState(!1), p = a.filter((c) => Gt(c.fileName)), f = async (c) => {
    var u, x, b, y, h, j, C, T, D;
    if (c) {
      if (!Gt(c.name)) {
        (b = (x = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : x.error) == null || b.call(x, "Galeriye yalnız görsel dosya yüklenebilir.");
        return;
      }
      try {
        await r(c), (j = (h = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : h.success) == null || j.call(h, "Görsel yüklendi.");
      } catch (B) {
        (D = (T = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : T.error) == null || D.call(T, (B == null ? void 0 : B.message) || "Görsel yüklenemedi.");
      } finally {
        o.current && (o.current.value = "");
      }
    }
  }, m = async (c, u) => {
    var x, b, y;
    try {
      await i(c);
    } catch (h) {
      (y = (b = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : b.error) == null || y.call(b, (h == null ? void 0 : h.message) || `${u} silinemedi.`);
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
        onChange: (c) => {
          var u;
          return f((u = c.target.files) == null ? void 0 : u[0]);
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
          return (c = o.current) == null ? void 0 : c.click();
        },
        onKeyDown: (c) => {
          var u;
          c.key === "Enter" && ((u = o.current) == null || u.click());
        },
        onDragOver: (c) => {
          c.preventDefault(), n || d(!0);
        },
        onDragLeave: () => d(!1),
        onDrop: (c) => {
          var u, x;
          c.preventDefault(), d(!1), f((x = (u = c.dataTransfer) == null ? void 0 : u.files) == null ? void 0 : x[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${n ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l ? "fa-circle-notch fa-spin" : "fa-images"} text-[26px] ${n ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: l ? "Yükleniyor…" : n ? "Bırakın, yükleyelim" : "Görselleri buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, JPG, GIF, WEBP, SVG · max 25MB" })
        ]
      }
    ),
    s && p.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !s && p.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görevde henüz görsel yok. Yüklediğiniz görseller Dosyalar sekmesinde de görünür." }),
    p.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3", children: p.map((c) => /* @__PURE__ */ e.jsxs(
      "figure",
      {
        className: "group relative m-0 flex flex-col overflow-hidden rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
        children: [
          /* @__PURE__ */ e.jsx(
            "a",
            {
              href: c.downloadUrl,
              target: "_blank",
              rel: "noreferrer",
              title: `${c.fileName} — tam boyutta aç`,
              className: "block aspect-[4/3] overflow-hidden bg-neutral-subtle",
              children: /* @__PURE__ */ e.jsx(
                "img",
                {
                  src: c.downloadUrl,
                  alt: c.fileName,
                  loading: "lazy",
                  className: "h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                }
              )
            }
          ),
          /* @__PURE__ */ e.jsxs("figcaption", { className: "flex items-center justify-between gap-2 p-2.5", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12px] font-bold text-text-primary", title: c.fileName, children: c.fileName }),
              /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: Da(c.fileSize) })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                title: "Sil",
                "aria-label": `${c.fileName} gorselini sil`,
                onClick: () => m(c.id, c.fileName),
                className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
              }
            )
          ] })
        ]
      },
      c.id
    )) })
  ] });
}
const _s = [
  { key: "title", label: "Başlık", align: "left" },
  { key: "status", label: "Durum", align: "left" },
  { key: "priority", label: "Öncelik", align: "left" },
  { key: "assignee", label: "Atanan", align: "left" },
  { key: "dueDate", label: "Termin", align: "right" }
];
function _t(t, a) {
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
function Us(t, a, s, r) {
  const i = _t(t, s), l = _t(a, s), o = i === null || i === "", n = l === null || l === "";
  return o && n ? 0 : o ? 1 : n ? -1 : i === l ? 0 : (i < l ? -1 : 1) * (r === "asc" ? 1 : -1);
}
function Os({ task: t = {}, onOpenSubtask: a }) {
  const [s, r] = g.useState({ key: "dueDate", dir: "asc" }), i = (t == null ? void 0 : t.subTasks) ?? [], l = g.useMemo(
    () => [...i].sort((n, d) => Us(n, d, s.key, s.dir)),
    [i, s.key, s.dir]
  ), o = (n) => r((d) => d.key === n ? { key: n, dir: d.dir === "asc" ? "desc" : "asc" } : { key: n, dir: "asc" });
  return i.length === 0 ? /* @__PURE__ */ e.jsx(
    xe,
    {
      icon: "fa-table",
      title: "Alt görev yok",
      description: "Alt Görevler sekmesinden ekledikleriniz burada tablo olarak listelenir."
    }
  ) : /* @__PURE__ */ e.jsx("div", { className: `${De} overflow-x-auto`, children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse text-[12.5px]", children: [
    /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsx("tr", { className: "bg-surface-raised", children: _s.map((n) => {
      const d = s.key === n.key;
      return /* @__PURE__ */ e.jsx(
        "th",
        {
          scope: "col",
          "aria-sort": d ? s.dir === "asc" ? "ascending" : "descending" : "none",
          className: `px-3.5 py-2.5 border-b border-subtle font-bold text-text-secondary whitespace-nowrap ${n.align === "right" ? "text-right" : "text-left"}`,
          children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => o(n.key),
              className: `inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer font-bold ${d ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`,
              children: [
                n.label,
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid text-[9px] ${d ? s.dir === "asc" ? "fa-arrow-up-short-wide" : "fa-arrow-down-wide-short" : "fa-sort opacity-40"}` })
              ]
            }
          )
        },
        n.key
      );
    }) }) }),
    /* @__PURE__ */ e.jsx("tbody", { children: l.map((n) => {
      const d = be(n.status), p = rt(n.priority), f = wa(n.dueDate);
      return /* @__PURE__ */ e.jsxs(
        "tr",
        {
          onClick: () => a == null ? void 0 : a(n.id),
          className: "border-b border-subtle last:border-b-0 cursor-pointer hover:bg-surface-raised",
          children: [
            /* @__PURE__ */ e.jsxs("td", { className: "px-3.5 py-2.5 max-w-[320px]", children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: (m) => {
                    m.stopPropagation(), a == null || a(n.id);
                  },
                  title: n.title,
                  className: `block w-full truncate bg-transparent border-0 p-0 text-left font-semibold cursor-pointer ${n.status === 4 ? "line-through text-text-tertiary" : "text-text-primary"}`,
                  children: n.title
                }
              ),
              n.code && /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: n.code })
            ] }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(Pe, { bg: d.bg, fg: d.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.icon} text-[9px] mr-1` }),
              d.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(Pe, { bg: p.bg, fg: p.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${p.icon} text-[9px] mr-1` }),
              p.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: n.assigneeName ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ e.jsx(nt, { name: n.assigneeName, size: 22 }),
              /* @__PURE__ */ e.jsx("span", { className: "truncate text-text-secondary", children: n.assigneeName })
            ] }) : /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: "Atanmadı" }) }),
            /* @__PURE__ */ e.jsxs("td", { className: `px-3.5 py-2.5 text-right whitespace-nowrap ${f.tone}`, children: [
              n.dueDate ? Oe(n.dueDate) : "—",
              f.hint && /* @__PURE__ */ e.jsx("div", { className: "text-[11px]", children: f.hint })
            ] })
          ]
        },
        n.id
      );
    }) })
  ] }) });
}
function Vs({ taskId: t, task: a = {}, onOpenSubtask: s }) {
  const r = re(), i = (a == null ? void 0 : a.subTasks) ?? [], [l, o] = g.useState(null), [n, d] = g.useState(null), p = async (f, m) => {
    var u, x, b;
    const c = i.find((y) => y.id === f);
    if (!(!c || c.status === m)) {
      d(f);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.updateStatus(f, m)), await r.invalidateQueries({ queryKey: ["task-detail", t] });
      } catch (y) {
        (b = (x = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : x.error) == null || b.call(x, (y == null ? void 0 : y.message) || "Alt görev durumu güncellenemedi.");
      } finally {
        d(null);
      }
    }
  };
  return i.length === 0 ? /* @__PURE__ */ e.jsx(
    xe,
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 items-start", children: at.map((f) => {
      const m = be(f), c = i.filter((x) => x.status === f), u = l === f;
      return /* @__PURE__ */ e.jsxs(
        "section",
        {
          "aria-label": `${m.label} sütunu`,
          onDragOver: (x) => {
            x.preventDefault(), l !== f && o(f);
          },
          onDragLeave: () => o((x) => x === f ? null : x),
          onDrop: (x) => {
            var y;
            x.preventDefault(), o(null);
            const b = (y = x.dataTransfer) == null ? void 0 : y.getData("text/plain");
            b && p(b, f);
          },
          className: `flex flex-col gap-2 p-2.5 rounded-2xl border bg-surface-raised min-h-[120px] transition-colors duration-fast ${u ? "border-focus bg-primary-subtle" : "border-subtle"}`,
          children: [
            /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-2 px-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${m.dot}` }),
              /* @__PURE__ */ e.jsx("h3", { className: "m-0 flex-1 text-[12px] font-bold text-text-primary", children: m.label }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: c.length })
            ] }),
            c.map((x) => {
              const b = rt(x.priority);
              return /* @__PURE__ */ e.jsxs(
                "article",
                {
                  draggable: !0,
                  onDragStart: (y) => {
                    var h;
                    return (h = y.dataTransfer) == null ? void 0 : h.setData("text/plain", x.id);
                  },
                  role: "button",
                  tabIndex: 0,
                  onClick: () => s == null ? void 0 : s(x.id),
                  onKeyDown: (y) => {
                    y.key === "Enter" && (s == null || s(x.id));
                  },
                  className: `flex flex-col gap-2 p-2.5 rounded-[12px] border border-subtle bg-surface-base shadow-xs cursor-pointer hover:border-focus hover:shadow-md ${n === x.id ? "opacity-60" : ""}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary line-clamp-2", children: x.title }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                      /* @__PURE__ */ e.jsxs("span", { className: `text-[10.5px] font-bold ${b.fg}`, children: [
                        /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${b.icon} text-[9px] mr-1` }),
                        b.label
                      ] }),
                      x.dueDate && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: Oe(x.dueDate) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2 border-t border-subtle", children: [
                      x.assigneeName ? /* @__PURE__ */ e.jsx(nt, { name: x.assigneeName, size: 20 }) : /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] text-text-tertiary", children: "Atanmadı" }),
                      /* @__PURE__ */ e.jsx(
                        "select",
                        {
                          "aria-label": `${x.title} durumunu değiştir`,
                          value: x.status,
                          onClick: (y) => y.stopPropagation(),
                          onChange: (y) => p(x.id, Number(y.target.value)),
                          className: "h-[24px] px-1.5 rounded-[6px] border border-subtle bg-surface-base text-[10.5px] text-text-secondary cursor-pointer",
                          children: at.map((y) => /* @__PURE__ */ e.jsx("option", { value: y, children: be(y).label }, y))
                        }
                      )
                    ] })
                  ]
                },
                x.id
              );
            })
          ]
        },
        f
      );
    }) })
  );
}
const Hs = [
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
], Qs = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], Ut = (t) => String(t).padStart(2, "0"), $a = (t, a, s) => `${t}-${Ut(a + 1)}-${Ut(s)}`;
function jt(t) {
  if (!t) return null;
  const a = /^(\d{4}-\d{2}-\d{2})/.exec(String(t));
  return a ? a[1] : null;
}
function Ws(t, a) {
  const r = (new Date(t, a, 1).getDay() + 6) % 7, i = new Date(t, a + 1, 0).getDate(), l = [];
  for (let o = 0; o < 42; o++) {
    const n = o - r + 1;
    l.push(n >= 1 && n <= i ? { key: $a(t, a, n), day: n, inMonth: !0 } : { key: `bos-${o}`, day: null, inMonth: !1 });
  }
  return l;
}
function Zs(t) {
  const a = /* @__PURE__ */ new Map(), s = (r, i) => {
    const l = jt(r);
    l && (a.has(l) || a.set(l, []), a.get(l).push(i));
  };
  s(t == null ? void 0 : t.startDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "start", isSelf: !0, status: t == null ? void 0 : t.status }), s(t == null ? void 0 : t.dueDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "due", isSelf: !0, status: t == null ? void 0 : t.status });
  for (const r of (t == null ? void 0 : t.subTasks) ?? [])
    s(r.startDate, { id: r.id, title: r.title, kind: "start", isSelf: !1, status: r.status }), s(r.dueDate, { id: r.id, title: r.title, kind: "due", isSelf: !1, status: r.status });
  return a;
}
function Js({ task: t = {}, onOpenSubtask: a }) {
  const s = g.useMemo(() => Zs(t), [t]), [r, i] = g.useState(() => {
    const p = jt(t == null ? void 0 : t.startDate) ?? jt(t == null ? void 0 : t.dueDate);
    if (p) {
      const [m, c] = p.split("-").map(Number);
      return { year: m, month: c - 1 };
    }
    const f = /* @__PURE__ */ new Date();
    return { year: f.getFullYear(), month: f.getMonth() };
  }), l = g.useMemo(() => Ws(r.year, r.month), [r.year, r.month]), o = (p) => i(({ year: f, month: m }) => {
    const c = m + p;
    return { year: f + Math.floor(c / 12), month: (c % 12 + 12) % 12 };
  }), n = /* @__PURE__ */ new Date(), d = $a(n.getFullYear(), n.getMonth(), n.getDate());
  return s.size === 0 ? /* @__PURE__ */ e.jsx(
    xe,
    {
      icon: "fa-calendar",
      title: "Takvimde gösterilecek tarih yok",
      description: "Göreve başlangıç veya termin tarihi girildiğinde burada aylık takvimde görünür."
    }
  ) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-3.5 py-3 border-b border-subtle bg-surface-raised", children: [
      /* @__PURE__ */ e.jsxs("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: [
        Hs[r.month],
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
            onClick: () => i({ year: n.getFullYear(), month: n.getMonth() }),
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-subtle bg-surface-raised", children: Qs.map((p) => /* @__PURE__ */ e.jsx("span", { className: "px-2 py-1.5 text-center text-[11px] font-bold text-text-tertiary", children: p }, p)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: l.map((p) => {
      const f = p.inMonth ? s.get(p.key) ?? [] : [], m = p.key === d;
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: `flex flex-col gap-1 min-h-[76px] p-1.5 border-r border-b border-subtle last-of-type:border-r-0 ${p.inMonth ? "" : "bg-surface-sunken"}`,
          children: [
            p.inMonth && /* @__PURE__ */ e.jsx("span", { className: `self-end font-mono text-[11px] font-bold ${m ? "flex items-center justify-center h-[18px] w-[18px] rounded-full bg-primary text-white" : "text-text-tertiary"}`, children: p.day }),
            f.map((c, u) => {
              const x = be(c.status);
              return /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  title: `${c.title} — ${c.kind === "due" ? "termin" : "başlangıç"}`,
                  onClick: () => {
                    c.isSelf || a == null || a(c.id);
                  },
                  className: `flex items-center gap-1 w-full px-1.5 py-[3px] rounded-[6px] text-left text-[10.5px] font-semibold ${x.bg} ${x.fg} ${c.isSelf ? "cursor-default" : "cursor-pointer hover:brightness-95"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c.kind === "due" ? "fa-flag-checkered" : "fa-play"} text-[8px] shrink-0` }),
                    /* @__PURE__ */ e.jsx("span", { className: "truncate", children: c.title })
                  ]
                },
                `${c.id}-${c.kind}-${u}`
              );
            })
          ]
        },
        p.key
      );
    }) })
  ] });
}
function qe() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Xs(t) {
  const a = qe();
  return a ? Promise.resolve(a.getDocuments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function er(t) {
  const a = re(), s = ["task-documents", t], r = ee({
    queryKey: s,
    queryFn: () => Xs(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), l = se({
    mutationFn: (d) => Promise.resolve(qe().createDocument(t, d)),
    onSuccess: i
  }), o = se({
    mutationFn: ({ id: d, title: p, content: f }) => Promise.resolve(qe().updateDocument(d, { title: p, content: f })),
    onSuccess: (d) => {
      i(), d != null && d.id && a.setQueryData(["task-document", d.id], d);
    }
  }), n = se({
    mutationFn: (d) => Promise.resolve(qe().deleteDocument(d)),
    onSuccess: i
  });
  return {
    documents: r.data ?? [],
    isLoading: r.isLoading,
    createDocument: l.mutateAsync,
    updateDocument: o.mutateAsync,
    removeDocument: n.mutateAsync,
    isSaving: o.isPending
  };
}
function tr(t) {
  return ee({
    queryKey: ["task-document", t],
    queryFn: () => Promise.resolve(qe().getDocument(t)),
    enabled: !!t,
    retry: !1
  });
}
function $e(t) {
  return (t == null ? void 0 : t.closest('[role="dialog"]')) ?? void 0;
}
const ar = [
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
], sr = '<table class="apya-rte-table"><tr><th>Kolon 1</th><th>Kolon 2</th></tr><tr><td>Değer</td><td>Değer</td></tr></table><p><br></p>', rr = '<div class="apya-rte-imgph">görsel yer tutucu</div><p><br></p>';
function nr(t) {
  return t ? /<[a-z][\s\S]*>/i.test(t) ? t : `<p>${t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>` : "";
}
function Pa({ value: t, onChange: a, mentionName: s = "ekip arkadaşı", placeholder: r }) {
  const i = g.useRef(null), l = g.useRef(nr(t)), [o, n] = g.useState(!1), [d, p] = g.useState("https://"), f = g.useRef(null), m = (h, j) => {
    var C, T;
    (C = i.current) == null || C.focus();
    try {
      document.execCommand(h, !1, j);
    } catch {
    }
    a == null || a(((T = i.current) == null ? void 0 : T.innerHTML) ?? "");
  }, c = () => {
    const h = window.getSelection();
    f.current = h && h.rangeCount ? h.getRangeAt(0).cloneRange() : null;
  }, u = () => {
    const h = f.current;
    if (!h) return;
    const j = window.getSelection();
    j.removeAllRanges(), j.addRange(h);
  }, x = () => {
    var j;
    const h = d.trim();
    n(!1), !(!h || h === "https://") && ((j = i.current) == null || j.focus(), u(), m("createLink", h), p("https://"));
  }, b = (h) => {
    switch (h.cmd) {
      case "link":
        c();
        return;
      case "image":
        m("insertHTML", rr);
        return;
      case "table":
        m("insertHTML", sr);
        return;
      case "mention":
        m("insertHTML", `<span class="apya-rte-mention">@${s}</span>&nbsp;`);
        return;
      default:
        m(h.cmd, h.arg);
    }
  }, y = "flex shrink-0 items-center justify-center h-7 w-7 rounded-[7px] border-0 bg-transparent text-text-secondary cursor-pointer hover:bg-surface-base hover:text-primary hover:shadow-xs";
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-[14px] border border-default bg-surface-base overflow-hidden shadow-xs", children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-0.5 px-2 py-1.5 border-b border-subtle bg-neutral-subtle overflow-x-auto custom-scrollbar", children: ar.map((h) => {
      const j = /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          title: h.title,
          onMouseDown: (C) => {
            C.preventDefault(), b(h);
          },
          className: `${y} ${h.gap ? "ml-1.5" : ""}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${h.regular ? "regular" : "solid"} ${h.icon} text-[12px]` })
        },
        h.cmd + h.icon
      );
      return h.cmd !== "link" ? j : /* @__PURE__ */ e.jsxs(Ne, { modal: !0, open: o, onOpenChange: n, children: [
        /* @__PURE__ */ e.jsx(we, { asChild: !0, children: j }),
        /* @__PURE__ */ e.jsx(ke, { container: $e(i.current), children: /* @__PURE__ */ e.jsxs(
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
                    onChange: (C) => p(C.target.value),
                    onKeyDown: (C) => {
                      C.key === "Enter" && x();
                    },
                    className: "flex-1 min-w-0 h-[34px] px-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: x,
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
        ref: i,
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
function ir({ taskId: t }) {
  const { documents: a, isLoading: s, createDocument: r, updateDocument: i, removeDocument: l, isSaving: o } = er(t), [n, d] = g.useState(null), [p, f] = g.useState(""), [m, c] = g.useState(""), [u, x] = g.useState(!1), { data: b, isFetching: y } = tr(n);
  g.useEffect(() => {
    !b || b.id !== n || (f(b.title ?? ""), c(b.content ?? ""), x(!1));
  }, [b == null ? void 0 : b.id]);
  const h = async () => {
    var D, B, G;
    try {
      const L = await r("Yeni belge");
      L != null && L.id && d(L.id);
    } catch (L) {
      (G = (B = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : B.error) == null || G.call(B, (L == null ? void 0 : L.message) || "Belge oluşturulamadı.");
    }
  }, j = async () => {
    var B, G, L, F, I, K, U, Q, O;
    const D = p.trim();
    if (!D) {
      (L = (G = (B = window == null ? void 0 : window.abp) == null ? void 0 : B.notify) == null ? void 0 : G.error) == null || L.call(G, "Belge başlığı boş olamaz.");
      return;
    }
    try {
      await i({ id: n, title: D, content: m }), x(!1), (K = (I = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : I.success) == null || K.call(I, "Belge kaydedildi.");
    } catch (Z) {
      (O = (Q = (U = window == null ? void 0 : window.abp) == null ? void 0 : U.notify) == null ? void 0 : Q.error) == null || O.call(Q, (Z == null ? void 0 : Z.message) || "Belge kaydedilemedi.");
    }
  }, C = async (D, B) => {
    var G, L, F;
    try {
      await l(D), n === D && d(null);
    } catch (I) {
      (F = (L = (G = window == null ? void 0 : window.abp) == null ? void 0 : G.notify) == null ? void 0 : L.error) == null || F.call(L, (I == null ? void 0 : I.message) || `“${B}” silinemedi.`);
    }
  }, T = () => {
    u && !window.confirm("Kaydedilmemiş değişiklikleriniz var. Yine de kapatılsın mı?") || d(null);
  };
  return n ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
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
          value: p,
          "aria-label": "Belge başlığı",
          onChange: (D) => {
            f(D.target.value), x(!0);
          },
          className: "flex-1 min-w-0 h-9 px-3 rounded-[10px] border border-subtle bg-surface-base text-[13.5px] font-bold text-text-primary focus:border-focus focus:shadow-focus focus:outline-none"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: j,
          disabled: o || !u,
          className: `flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[12.5px] font-bold ${o || !u ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${o ? "fa-circle-notch fa-spin" : "fa-floppy-disk"} text-[11px]` }),
            o ? "Kaydediliyor…" : u ? "Kaydet" : "Kaydedildi"
          ]
        }
      )
    ] }),
    y && !b ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Belge yükleniyor…" }) : /* @__PURE__ */ e.jsx(
      Pa,
      {
        value: m,
        placeholder: "Belgeyi buraya yazın…",
        onChange: (D) => {
          c(D), x(!0);
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
      xe,
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
              onClick: () => C(D.id, D.title),
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
function ze() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function lr(t) {
  const a = ze();
  return a ? Promise.resolve(a.getLinkedForms(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function or(t) {
  const a = re(), s = ["task-forms", t], r = ee({
    queryKey: s,
    queryFn: () => lr(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), l = se({
    mutationFn: (d) => Promise.resolve(ze().linkForm(t, d)),
    onSuccess: i
  }), o = se({
    mutationFn: (d) => Promise.resolve(ze().unlinkForm(d)),
    onSuccess: i
  }), n = se({
    mutationFn: ({ linkId: d, value: p }) => Promise.resolve(ze().setFormGuestFillable(d, p)),
    onSuccess: i
  });
  return {
    forms: r.data ?? [],
    isLoading: r.isLoading,
    linkForm: l.mutateAsync,
    unlinkForm: o.mutateAsync,
    setGuestFillable: n.mutateAsync,
    isLinking: l.isPending
  };
}
function cr(t, a) {
  return ee({
    queryKey: ["task-form-options", t],
    queryFn: () => Promise.resolve(ze().getFormOptions(t)),
    enabled: !!t && !!a,
    retry: !1
  });
}
function dr(t, a) {
  return ee({
    queryKey: ["task-form-responses", t, a],
    queryFn: () => Promise.resolve(ze().getFormResponses(t, a)),
    enabled: !!t && !!a,
    retry: !1
  });
}
function xr({ taskId: t, documentId: a }) {
  const { data: s, isLoading: r } = dr(t, a);
  return r ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Yanıtlar yükleniyor…" }) : s != null && s.length ? /* @__PURE__ */ e.jsx("ul", { className: "m-0 list-none p-0", children: s.map((i) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-3 px-3.5 py-2 border-t border-subtle", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${i.isGuestSubmission ? "fa-user-clock" : "fa-user"} text-[10px] text-text-tertiary` }),
      /* @__PURE__ */ e.jsx("span", { className: "truncate text-[12.5px] text-text-primary", children: i.respondentName }),
      i.isGuestSubmission && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: "· dış" })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary", children: st(i.creationTime) })
  ] }, i.id)) }) : /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Bu görevde henüz yanıt yok." });
}
function ur({ taskId: t }) {
  const { forms: a, isLoading: s, linkForm: r, unlinkForm: i, setGuestFillable: l, isLinking: o } = or(t), [n, d] = g.useState(!1), [p, f] = g.useState(null), { data: m, isLoading: c } = cr(t, n), u = fe("Platform.Tasks.ShareExternally"), x = async (h) => {
    var j, C, T;
    try {
      await r(h), d(!1);
    } catch (D) {
      (T = (C = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : C.error) == null || T.call(C, (D == null ? void 0 : D.message) || "Form bağlanamadı.");
    }
  }, b = async (h) => {
    var j, C, T;
    if (window.confirm(`“${h.title}” bağlantısı kaldırılsın mı? Form ve toplanmış yanıtlar silinmez.`))
      try {
        await i(h.id);
      } catch (D) {
        (T = (C = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : C.error) == null || T.call(C, (D == null ? void 0 : D.message) || "Bağlantı kaldırılamadı.");
      }
  }, y = async (h, j) => {
    var C, T, D;
    try {
      await l({ linkId: h.id, value: j });
    } catch (B) {
      (D = (T = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : T.error) == null || D.call(T, (B == null ? void 0 : B.message) || "Ayar değiştirilemedi.");
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
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n ? "fa-xmark" : "fa-plus"} text-[11px]` }),
            n ? "Kapat" : "Form bağla"
          ]
        }
      )
    ] }),
    n && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-raised overflow-hidden", children: [
      c && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Formlar yükleniyor…" }),
      !c && !(m != null && m.length) && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Bağlanabilecek form yok. Önce Form Yönetimi'nden bir form oluşturun." }),
      m == null ? void 0 : m.map((h) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          disabled: h.isLinked || o,
          onClick: () => x(h.documentId),
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
    !s && a.length === 0 && !n && /* @__PURE__ */ e.jsx(
      xe,
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
            onClick: () => f((j) => j === h.documentId ? null : h.documentId),
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
        h.responseCount > 0 && /* @__PURE__ */ e.jsx(Ca, { children: h.responseCount }),
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
            onClick: () => b(h),
            className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[12px]" })
          }
        )
      ] }),
      u && h.isPublished && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 px-3.5 pb-3 text-[11.5px] text-text-secondary cursor-pointer", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: !!h.isGuestFillable,
            onChange: (j) => y(h, j.target.checked)
          }
        ),
        "Süreli paylaşım linkiyle ekip dışından da doldurulabilsin"
      ] }),
      p === h.documentId && /* @__PURE__ */ e.jsx(xr, { taskId: t, documentId: h.documentId })
    ] }, h.id))
  ] });
}
const pr = {
  0: "bg-neutral-400",
  1: "bg-text-tertiary",
  2: "bg-warning",
  3: "bg-primary",
  4: "bg-success"
};
function xt(t) {
  if (!t) return null;
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? null : a;
}
const Ke = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
function mr({ task: t = {} }) {
  const a = g.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((o, n) => ({
    id: o.id || `row-${n}`,
    name: o.title || "Başlıksız görev",
    isMain: !!o.__main,
    start: xt(o.startDate),
    end: xt(o.dueDate) || xt(o.completedDate),
    status: o.status ?? 1
  })), [t]), { min: s, span: r } = g.useMemo(() => {
    const l = a.flatMap((d) => [d.start, d.end]).filter(Boolean).map((d) => d.getTime());
    if (l.length === 0) return { min: null, span: 0 };
    const o = Math.min(...l), n = Math.max(...l);
    return { min: o, span: Math.max(1, n - o) };
  }, [a]), i = g.useMemo(() => s === null ? [] : [0, 1, 2, 3].map((l) => new Date(s + r * l / 4)), [s, r]);
  return s === null ? /* @__PURE__ */ e.jsx("div", { className: De, children: /* @__PURE__ */ e.jsx(
    xe,
    {
      icon: "fa-bars-staggered",
      title: "Zaman çizelgesi çizilemiyor",
      description: "Görevde veya alt görevlerde başlangıç–bitiş tarihi tanımlı olmalı."
    }
  ) }) : /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Zaman çizelgesi" }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] text-text-tertiary", children: [
        Ke(new Date(s)),
        " – ",
        Ke(new Date(s + r))
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-4 gap-0 pl-[170px] mb-2 lt-860:pl-[110px]", children: i.map((l, o) => /* @__PURE__ */ e.jsx(
      "span",
      {
        className: "pl-2 border-l border-subtle text-[10.5px] font-bold uppercase tracking-[.06em] text-text-tertiary",
        children: Ke(l)
      },
      o
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: a.map((l) => {
      const o = l.start ? l.start.getTime() : s, n = l.end ? Math.max(l.end.getTime(), o) : o, d = (o - s) / r * 100, p = Math.max(2, (n - o) / r * 100), f = Math.max(1, Math.round((n - o) / 864e5));
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
            className: `absolute top-[7px] bottom-[7px] flex items-center px-2.5 rounded-[7px] shadow-xs ${pr[l.status] || "bg-primary"}`,
            style: { left: `${d}%`, width: `${p}%` },
            title: `${Ke(l.start)} – ${Ke(l.end)}`,
            children: /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[10.5px] font-bold text-white", children: [
              f,
              "g"
            ] })
          }
        ) })
      ] }, l.id);
    }) })
  ] });
}
function Ot({ icon: t, iconTone: a, title: s, note: r, children: i }) {
  return /* @__PURE__ */ e.jsxs("div", { className: De, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[12px] ${a}` }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: s }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
    ] }),
    i
  ] });
}
function fr({ task: t = {} }) {
  const a = re(), s = t.predecessorIds || [], r = () => {
    var d, p, f;
    return (f = (p = (d = window == null ? void 0 : window.apya) == null ? void 0 : d.platform) == null ? void 0 : p.tasks) == null ? void 0 : f.task;
  }, { data: i = [], isLoading: l } = ee({
    queryKey: ["task-predecessors", t.id, s],
    queryFn: async () => {
      const d = r();
      return d ? Promise.all(
        s.map(
          (p) => Promise.resolve(d.get(p)).catch(() => ({ id: p, title: "(erişilemeyen görev)", status: null, code: "—" }))
        )
      ) : [];
    },
    enabled: s.length > 0,
    staleTime: 3e4,
    retry: !1
  }), o = async (d) => {
    var p, f, m, c, u, x;
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
        predecessorIds: s.filter((b) => b !== d),
        tagNames: (t.tags ?? []).map((b) => b.name),
        estimatedHours: t.estimatedHours ?? null,
        taskType: t.taskType ?? null,
        sprint: t.sprint ?? null
      })), await a.invalidateQueries({ queryKey: ["task-detail", t.id] }), (m = (f = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : f.info) == null || m.call(f, "Bağlantı kaldırıldı.");
    } catch (b) {
      (x = (u = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : u.error) == null || x.call(u, (b == null ? void 0 : b.message) || "Bağlantı kaldırılamadı.");
    }
  }, n = (d) => {
    var p, f, m;
    return (m = (f = (p = window == null ? void 0 : window.apya) == null ? void 0 : p.taskDetail) == null ? void 0 : f.open) == null ? void 0 : m.call(f, d);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsx(
      Ot,
      {
        icon: "fa-arrow-left-long",
        iconTone: "text-warning",
        title: "Öncül görevler",
        note: "bu görev başlamadan tamamlanmalı",
        children: s.length === 0 ? /* @__PURE__ */ e.jsx(xe, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : l ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : i.map((d) => {
          const p = d.status == null ? null : be(d.status);
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
                    onClick: () => n(d.id),
                    className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                    children: d.title || "Başlıksız görev"
                  }
                ),
                p && /* @__PURE__ */ e.jsx(Pe, { bg: p.bg, fg: p.fg, children: p.label }),
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
      Ot,
      {
        icon: "fa-arrow-right-long",
        iconTone: "text-primary",
        title: "Ardıl görevler",
        note: "bu görev bitince başlar",
        children: /* @__PURE__ */ e.jsx(
          xe,
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
function br(t) {
  const a = re(), s = ["task-timelogs", t], r = ["task-active-timelog"], i = ee({
    queryKey: s,
    queryFn: () => {
      var p;
      return Promise.resolve((p = Le()) == null ? void 0 : p.getTimeLogs(t));
    },
    enabled: !!t && !!Le(),
    staleTime: 15e3,
    retry: !1
  }), l = ee({
    queryKey: r,
    queryFn: () => {
      var p;
      return Promise.resolve((p = Le()) == null ? void 0 : p.getActiveTimeLog());
    },
    enabled: !!Le(),
    staleTime: 5e3,
    retry: !1
  }), o = () => {
    a.invalidateQueries({ queryKey: s }), a.invalidateQueries({ queryKey: r });
  }, n = se({
    mutationFn: () => {
      var p;
      return Promise.resolve((p = Le()) == null ? void 0 : p.startTimeTracking(t));
    },
    onSuccess: o
  }), d = se({
    mutationFn: () => {
      var p;
      return Promise.resolve((p = Le()) == null ? void 0 : p.stopTimeTracking(t));
    },
    onSuccess: o
  });
  return {
    logs: i.data ?? [],
    isLoading: i.isLoading,
    activeLog: l.data ?? null,
    start: n.mutateAsync,
    stop: d.mutateAsync,
    isMutating: n.isPending || d.isPending
  };
}
function Vt(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function hr({ taskId: t, task: a = {} }) {
  const s = br(t), r = s.activeLog && s.activeLog.taskId === t ? s.activeLog : null, [i, l] = g.useState(() => Date.now());
  g.useEffect(() => {
    if (!r) return;
    const x = setInterval(() => l(Date.now()), 1e3);
    return () => clearInterval(x);
  }, [r]);
  const o = r ? Math.max(0, Math.floor((i - new Date(r.startTime).getTime()) / 1e3)) : 0, d = s.logs.reduce((x, b) => x + (b.secondsSpent || 0), 0) + o, p = (a == null ? void 0 : a.estimatedHours) ?? null, f = p ? p * 3600 : 0, m = f ? Math.min(100, Math.round(d / f * 100)) : 0, c = f ? Math.max(0, f - d) : 0, u = async () => {
    var x, b, y;
    try {
      r ? await s.stop() : await s.start();
    } catch (h) {
      (y = (b = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : b.error) == null || y.call(b, (h == null ? void 0 : h.message) || "Zaman takibi güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-5 flex-wrap p-[22px] rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[18px]", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: u,
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
              children: Ns(d)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary", children: r ? "Kayıt sürüyor" : "Sayaç duraklatıldı" })
        ] })
      ] }),
      f > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] font-bold text-text-secondary", children: "Tahmin kullanımı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
            it(d),
            " / ",
            p,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-warning", style: { width: `${m}%` } }) }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "Kalan tahmini süre: ",
          it(c)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: De, children: [
      /* @__PURE__ */ e.jsx(Ye, { title: "Zaman kayıtları" }),
      s.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : s.logs.length === 0 ? /* @__PURE__ */ e.jsx(
        xe,
        {
          icon: "fa-stopwatch",
          title: "Henüz zaman kaydı yok",
          description: "Soldaki yeşil düğmeyle sayacı çalıştırın; durdurduğunuzda kayıt buraya düşer."
        }
      ) : s.logs.map((x) => {
        const b = !x.endTime;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
            children: [
              /* @__PURE__ */ e.jsx(nt, { name: x.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: x.note || x.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                Vt(x.startTime),
                " → ",
                b ? "sürüyor" : Vt(x.endTime)
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary", children: b ? "Aktif" : it(x.secondsSpent || 0) })
            ]
          },
          x.id
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
    component: ws
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
    component: Ds
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
    component: Os
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
    component: Vs
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
    component: Js
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
    component: Ss
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
    component: mr
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
    component: fr
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
    component: qs
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
    component: zs
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
    component: Ls,
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
    component: $s,
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
    component: Bs
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
    component: hr
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
    component: ir
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
    component: ur
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
    component: Ys
  }
];
function Ea(t = []) {
  const a = new Set(t);
  return Ve.filter((s) => !s.hidden).filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function gr(t = []) {
  const a = new Set(t);
  return Ve.filter((s) => !s.hidden).filter((s) => !s.isCore).filter((s) => !s.permission || fe(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let Qe = null;
const Xe = /* @__PURE__ */ new Set(), ut = /* @__PURE__ */ new Set();
function Ht() {
  Xe.forEach((t) => t());
}
function yr(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const ie = {
  open(t) {
    const a = yr(t);
    a && (Qe = a, Ht());
  },
  close() {
    Qe = null, Ht();
  },
  subscribe(t) {
    return Xe.add(t), () => Xe.delete(t);
  },
  getSnapshot() {
    return Qe;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && ut.add(t);
  },
  emitResult() {
    ut.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    Qe = null, Xe.clear(), ut.clear();
  }
}, Qt = "apya.taskDetail.fullscreen";
function Ba({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, i] = g.useState(t), [l, o] = g.useState([]), { data: n, isPending: d, isError: p, refetch: f } = Nt(r), m = ba(), c = va(n), u = ja(), x = Na(r), [b, y] = g.useState("general"), [h, j] = g.useState(!1), C = Re.useRef(null), T = g.useMemo(
    () => Ea(x.assignedCodes),
    [x.assignedCodes]
  ), D = g.useMemo(
    () => gr(x.assignedCodes),
    [x.assignedCodes]
  ), B = T.find((z) => z.code === b) ?? T[0];
  Re.useEffect(() => {
    B.code !== b && y(B.code);
  }, [B, b]);
  const G = B == null ? void 0 : B.component, L = re(), [F, I] = g.useState(
    () => {
      var z;
      return ((z = window.localStorage) == null ? void 0 : z.getItem(Qt)) === "1";
    }
  ), [K, U] = g.useState(!1), Q = g.useCallback(() => {
    ga(), s == null || s();
  }, [s]);
  ya(t, Q), Re.useEffect(() => {
    c.isDirty ? m.markDirty() : m.markClean();
  });
  const O = g.useCallback(() => m.requestClose(Q), [m, Q]), Z = g.useCallback(() => {
    I((z) => {
      var _;
      const R = !z;
      return (_ = window.localStorage) == null || _.setItem(Qt, R ? "1" : "0"), R;
    });
  }, []), V = fe("Platform.Tasks.Delete"), [te, w] = g.useState(!1), [N, v] = g.useState(!1), $ = g.useCallback(async () => {
    var z, R, _, ne, X, Te;
    v(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (_ = (R = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : R.info) == null || _.call(R, "Başarıyla silindi."), w(!1), m.markClean(), Q();
    } catch (ue) {
      (Te = (X = (ne = window == null ? void 0 : window.abp) == null ? void 0 : ne.notify) == null ? void 0 : X.error) == null || Te.call(X, (ue == null ? void 0 : ue.message) || "Görev silinemedi.");
    } finally {
      v(!1);
    }
  }, [r, m, Q]), E = g.useCallback(async () => {
    var z, R, _, ne, X, Te;
    if (!c.validate()) return !1;
    U(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, c.toUpdateDto())
      ), await L.invalidateQueries({ queryKey: ["task-detail", r] }), ie.emitResult(), (_ = (R = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : R.success) == null || _.call(R, "Kaydedildi."), !0;
    } catch (ue) {
      return (Te = (X = (ne = window == null ? void 0 : window.abp) == null ? void 0 : ne.notify) == null ? void 0 : X.error) == null || Te.call(X, (ue == null ? void 0 : ue.message) || "Kaydedilemedi."), !1;
    } finally {
      U(!1);
    }
  }, [r, c, m, L]), W = g.useCallback(() => {
    E();
  }, [E]), ce = g.useCallback(async () => {
    const z = m.resolvePendingClose("save");
    await E() && (z == null || z());
  }, [m, E]), k = g.useCallback((z, R) => {
    m.requestClose(() => {
      o((_) => [..._, { id: r, title: (n == null ? void 0 : n.title) ?? "" }]), i(z), y("general"), m.markClean();
    });
  }, [m, r, n]), M = g.useCallback((z) => {
    m.requestClose(() => {
      o((R) => {
        const _ = R.findIndex((ne) => ne.id === z);
        return _ === -1 ? R : R.slice(0, _);
      }), i(z), y("general"), m.markClean();
    });
  }, [m]), A = g.useCallback(async (z) => {
    var R, _, ne;
    try {
      await x.addFeature(z), y(z), j(!1);
    } catch (X) {
      (ne = (_ = (R = window == null ? void 0 : window.abp) == null ? void 0 : R.notify) == null ? void 0 : _.error) == null || ne.call(_, (X == null ? void 0 : X.message) || "Özellik eklenemedi.");
    }
  }, [x]), Y = g.useCallback(async (z) => {
    var R, _, ne;
    try {
      await x.removeFeature(z), y((X) => X === z ? "general" : X);
    } catch (X) {
      (ne = (_ = (R = window == null ? void 0 : window.abp) == null ? void 0 : R.notify) == null ? void 0 : _.error) == null || ne.call(_, (X == null ? void 0 : X.message) || "Özellik kaldırılamadı.");
    }
  }, [x]);
  Re.useEffect(() => {
    if (!h) return;
    const z = (_) => {
      C.current && !C.current.contains(_.target) && j(!1);
    }, R = (_) => {
      _.key === "Escape" && j(!1);
    };
    return document.addEventListener("mousedown", z), document.addEventListener("keydown", R), () => {
      document.removeEventListener("mousedown", z), document.removeEventListener("keydown", R);
    };
  }, [h]);
  const H = d ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(je, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(je, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(je, { className: "h-24 w-full" })
  ] }) : p ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(ae, { variant: "ghost", onClick: () => f(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      ms,
      {
        trail: l,
        current: { id: r, title: (n == null ? void 0 : n.title) ?? "" },
        onNavigate: M
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: C, children: [
      /* @__PURE__ */ e.jsx(
        xs,
        {
          tabs: T,
          activeCode: B.code,
          onSelect: (z) => {
            y(z), j(!1);
          },
          onOpenPicker: () => j((z) => !z),
          pickerOpen: h
        }
      ),
      h && /* @__PURE__ */ e.jsx(
        ps,
        {
          entries: D,
          busyCode: x.isMutating ? x.mutatingCode : null,
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
            ls,
            {
              values: c.values,
              errors: c.errors,
              onFieldChange: c.setField,
              assigneeOptions: u.options,
              isLoadingAssignees: u.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(g.Suspense, { fallback: /* @__PURE__ */ e.jsx(je, { className: "h-24 w-full" }), children: G && /* @__PURE__ */ e.jsx(
            G,
            {
              taskId: r,
              task: n,
              form: c,
              onOpenSubtask: k
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            os,
            {
              task: n,
              creatorName: u.nameById.get(n.creatorId),
              lastModifierName: u.nameById.get(n.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), le = a === "page" ? es : Xa;
  return /* @__PURE__ */ e.jsxs(
    le,
    {
      open: !0,
      fullscreen: F,
      onRequestClose: O,
      title: n ? `Görev Detayı: ${n.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        as,
        {
          task: n ?? { title: "Yükleniyor…" },
          canDelete: V,
          fullscreen: F,
          onToggleFullscreen: Z,
          onClose: O,
          onDelete: () => w(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        rs,
        {
          lastSavedAt: n == null ? void 0 : n.lastModificationTime,
          isDirty: m.isDirty,
          isSaving: K,
          onCancel: O,
          onSave: W
        }
      ),
      children: [
        H,
        m.pendingClose && /* @__PURE__ */ e.jsx(
          jr,
          {
            isSaving: K,
            onStay: () => m.resolvePendingClose("stay"),
            onDiscard: () => m.resolvePendingClose("discard"),
            onSaveAndClose: ce
          }
        ),
        te && /* @__PURE__ */ e.jsx(
          vr,
          {
            taskTitle: (n == null ? void 0 : n.title) ?? "",
            busy: N,
            onCancel: () => w(!1),
            onConfirm: $
          }
        )
      ]
    }
  );
}
function vr({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [i, l] = g.useState(""), o = i.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    La,
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
function La({ label: t, title: a, description: s, children: r, actions: i }) {
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
function jr({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    La,
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
const Nr = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function wr({ isPrivate: t = !1, onChange: a = () => {
} }) {
  const s = !!t, [r, i] = g.useState(null);
  return /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
      "button",
      {
        ref: i,
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
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: Nr.map((l) => {
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
          /* @__PURE__ */ e.jsx(Va, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const Wt = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto", kr = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", Cr = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" },
  { what: "Bağlantı kopyala", key: "⌘ L" }
];
function Dr({ children: t }) {
  return /* @__PURE__ */ e.jsx(ma, { asChild: !0, children: t });
}
function Tr({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "inline-flex items-center h-[19px] px-1.5 rounded-[5px] border border-default border-b-2 bg-neutral-subtle font-mono text-[10px] font-semibold text-text-secondary", children: t });
}
function Sr({
  task: t = {},
  presentation: a = "modal",
  onClose: s,
  isFullscreen: r,
  onToggleFullscreen: i,
  onFieldChange: l = () => {
  },
  statusValue: o,
  titleValue: n,
  isPrivateValue: d,
  isFavorite: p,
  onToggleFavorite: f,
  isWatched: m,
  onToggleWatch: c,
  onDuplicate: u,
  onArchive: x,
  onDelete: b,
  onOpenTransfer: y,
  onSaveAsTemplate: h,
  onConvertToSubtask: j,
  onExportPdf: C
}) {
  const [T, D] = g.useState(!1), [B, G] = g.useState(null), [L, F] = g.useState(!1), I = g.useRef(null), K = $e(B), U = be(o ?? t.status), Q = t.code || "GRV-—", O = () => {
    var w;
    (w = navigator.clipboard) == null || w.writeText(Q), D(!0), setTimeout(() => D(!1), 1800);
  }, Z = () => {
    var w, N, v, $;
    (w = navigator.clipboard) == null || w.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), ($ = (v = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : v.success) == null || $.call(v, "Görev bağlantısı panoya kopyalandı.");
  }, V = (w) => () => {
    F(!1), w == null || w();
  }, te = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", kbd: "⌘L", onClick: V(Z) },
    { label: "Çoğalt", icon: "fa-copy", kbd: "⌘D", onClick: V(u) },
    { label: "Başka projeye kopyala", icon: "fa-clone", onClick: V(() => y == null ? void 0 : y("copy")) },
    { label: "Şablon olarak kaydet", icon: "fa-bookmark", onClick: V(h) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, onClick: V(() => y == null ? void 0 : y("move")) },
    { label: "Alt göreve dönüştür", icon: "fa-diagram-project", onClick: V(j) },
    { label: m ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: V(c) },
    { label: "Arşivle", icon: "fa-box-archive", separator: !0, onClick: V(x) },
    { label: "Yazdır", icon: "fa-print", kbd: "⌘P", onClick: V(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: V(C) },
    { label: "Sil", icon: "fa-trash-can", kbd: "⌫", separator: !0, danger: !0, onClick: V(b) }
  ];
  return /* @__PURE__ */ e.jsxs("header", { ref: G, className: "shrink-0 px-6 lt-860:px-4 pt-[18px] pb-4 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: O,
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
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] border border-default text-[12px] font-semibold cursor-pointer ${U.bg} ${U.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-current animate-pulse" }),
                /* @__PURE__ */ e.jsx("span", { children: U.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(ke, { container: K, children: /* @__PURE__ */ e.jsxs(Ce, { sideOffset: 6, align: "start", className: `${Wt} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            at.map((w) => {
              const N = tt[w], v = (o ?? t.status) === w;
              return /* @__PURE__ */ e.jsx(Dr, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => l("status", w),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${v ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${N.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: N.label }),
                    v && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, w);
            })
          ] }) })
        ] }),
        m && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 h-[26px] px-2.5 rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11.5px] font-semibold", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-eye text-[10px]" }),
          "Takip ediliyor"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
        /* @__PURE__ */ e.jsx("div", { className: "lt-860:hidden", children: /* @__PURE__ */ e.jsx(
          wr,
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
            onClick: i,
            title: r ? "Küçült" : "Tam ekran",
            className: `mobile:hidden flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${r ? "bg-primary-subtle text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r ? "fa-compress" : "fa-expand"} text-[12px]` })
          }
        ),
        /* @__PURE__ */ e.jsxs(Ne, { modal: !0, open: L, onOpenChange: F, children: [
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
              className: `${Wt} w-[244px]`,
              children: [
                te.map((w) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: w.onClick,
                    className: [
                      kr,
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
                  Cr.map((w) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: w.what }),
                    /* @__PURE__ */ e.jsx(Tr, { children: w.key })
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
          children: n ?? t.title ?? "Başlıksız görev"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: f,
          title: p ? "Favorilerden çıkar" : "Favorilere ekle",
          className: `flex items-center justify-center h-8 w-8 shrink-0 rounded-[9px] cursor-pointer ${p ? "bg-warning-subtle text-warning" : "text-text-tertiary hover:bg-surface-hover"}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${p ? "solid" : "regular"} fa-star text-[15px]` })
        }
      )
    ] })
  ] });
}
const We = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", Zt = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function ye({ children: t }) {
  return /* @__PURE__ */ e.jsx(ma, { asChild: !0, children: t });
}
function pe({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[7px] min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.08em] text-text-tertiary select-none", children: t }),
    a
  ] });
}
function Jt({ name: t, size: a = 26 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Ue(t), fontSize: a * 0.38 },
      children: _e(t)
    }
  );
}
function Xt(t) {
  if (t == null) return "—";
  const a = Math.max(0, Math.round(Number(t) * 60)), s = Math.floor(a / 60), r = a % 60;
  return s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function $r({
  task: t = {},
  assigneeOptions: a = [],
  projectOptions: s = [],
  onFieldChange: r = () => {
  },
  statusValue: i,
  priorityValue: l,
  assigneeValue: o,
  projectValue: n,
  dueDateValue: d,
  startDateValue: p,
  tagsValue: f = [],
  progressPercent: m = 0,
  progressNote: c = "",
  onOpenTransfer: u
}) {
  var w, N;
  const [x, b] = g.useState(""), [y, h] = g.useState(""), [j, C] = g.useState(""), [T, D] = g.useState(!1), [B, G] = g.useState(null), L = be(i ?? t.status), F = rt(l ?? t.priority), I = o ?? t.assigneeId ?? null, K = n ?? t.projectId ?? null, U = ((w = a.find((v) => v.value === I)) == null ? void 0 : w.label) || t.assigneeName || "Atanmamış", Q = ((N = s.find((v) => v.value === K)) == null ? void 0 : N.label) || t.projectName || "Projesiz", O = wa(d ?? t.dueDate), Z = a.filter(
    (v) => !x || v.label.toLowerCase().includes(x.toLowerCase())
  ), V = s.filter(
    (v) => !y || v.label.toLowerCase().includes(y.toLowerCase())
  ), te = () => {
    const v = j.trim();
    v && !f.includes(v) && r("tagNames", [...f, v]), C(""), D(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { ref: G, className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6", children: [
    /* @__PURE__ */ e.jsx(pe, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx(Jt, { name: I ? U : null }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: U }),
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
              value: x,
              onChange: (v) => b(v.target.value),
              placeholder: "Kişi ara…",
              className: Zt
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
          Z.map((v) => /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("assigneeId", v.value),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${I === v.value ? "bg-primary-subtle" : "hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx(Jt, { name: v.label, size: 24 }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: v.label }),
                I === v.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
              ]
            }
          ) }, v.value))
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ e.jsxs(pe, { label: "Son tarih", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
        /* @__PURE__ */ e.jsx("i", { className: `fa-regular fa-calendar text-[13px] ${O.tone}` }),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "date",
            value: (d ?? t.dueDate ?? "").slice(0, 10),
            onChange: (v) => r("dueDate", v.target.value),
            className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
          }
        )
      ] }),
      O.hint && /* @__PURE__ */ e.jsx("span", { className: `-mt-0.5 text-[10.5px] font-semibold ${O.tone}`, children: O.hint })
    ] }),
    /* @__PURE__ */ e.jsx(pe, { label: "Başlangıç", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[13px] text-text-tertiary" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          value: (p ?? t.startDate ?? "").slice(0, 10),
          onChange: (v) => r("startDate", v.target.value),
          className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(pe, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 pt-[5px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: [
          "%",
          m
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-medium text-text-tertiary", children: c })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "h-1.5 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "h-full rounded-full bg-primary transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
          style: { width: `${m}%` }
        }
      ) })
    ] }) }),
    /* @__PURE__ */ e.jsx(pe, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
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
        at.map((v) => {
          const $ = tt[v], E = (i ?? t.status) === v;
          return /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("status", v),
              className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${E ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${$.dot}` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: $.label }),
                E && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
              ]
            }
          ) }, v);
        })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(pe, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${F.bg} ${F.fg}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${F.icon} text-[11px]` }),
            /* @__PURE__ */ e.jsx("span", { children: F.label }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ke, { container: $e(B), children: /* @__PURE__ */ e.jsxs(Ce, { sideOffset: 6, align: "start", className: `${We} w-[184px]`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
        js.map((v) => {
          const $ = vt[v], E = (l ?? t.priority) === v;
          return /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("priority", v),
              className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${E ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${$.icon} text-[11px] w-[13px]` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: $.label }),
                E && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
              ]
            }
          ) }, v);
        })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(pe, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap min-h-8", children: [
      f.map((v) => /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "inline-flex items-center gap-1.5 h-6 px-2 rounded-[7px] border border-primary bg-primary-subtle text-primary text-[11.5px] font-bold",
          children: [
            /* @__PURE__ */ e.jsx("span", { children: v }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Etiketi kaldır",
                onClick: () => r("tagNames", f.filter(($) => $ !== v)),
                className: "flex items-center p-0 border-0 bg-transparent text-current opacity-55 hover:opacity-100 hover:text-negative cursor-pointer",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
              }
            )
          ]
        },
        v
      )),
      T ? /* @__PURE__ */ e.jsx(
        "input",
        {
          autoFocus: !0,
          type: "text",
          value: j,
          onChange: (v) => C(v.target.value),
          onBlur: te,
          onKeyDown: (v) => {
            v.key === "Enter" && te(), v.key === "Escape" && (C(""), D(!1));
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
    /* @__PURE__ */ e.jsx(pe, { label: "Proje", children: /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
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
              value: y,
              onChange: (v) => h(v.target.value),
              placeholder: "Proje ara…",
              className: Zt
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
          V.map((v) => /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("projectId", v.value),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${K === v.value ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-primary" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: v.label }),
                K === v.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
              ]
            }
          ) }, v.value))
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-[7px] pt-[7px] border-t border-subtle", children: [
          /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => u == null ? void 0 : u("move"),
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
              onClick: () => u == null ? void 0 : u("copy"),
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
    /* @__PURE__ */ e.jsx(pe, { label: "Harcanan / tahmin", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[9px] h-8", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock text-[13px] text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[13px] font-bold text-text-primary", children: Xt(t.spentHours ?? 0) }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[12px] text-text-tertiary", children: [
        "/ ",
        t.estimatedHours != null ? Xt(t.estimatedHours) : "—"
      ] })
    ] }) })
  ] }) });
}
function Pr({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: i,
  onDragEnd: l,
  onReorderTo: o,
  onReorderDrop: n,
  onOpenPicker: d,
  counts: p = {},
  isDirty: f = !1
}) {
  const [m, c] = g.useState(!1);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-6 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 py-2.5 flex-1 min-w-0 overflow-x-auto custom-scrollbar", children: [
      s.map((u) => {
        const x = t === u.code, b = p[u.code] || 0;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            draggable: !0,
            title: "Sürükleyerek sırayı değiştirin",
            ...fa(() => a(u.code)),
            onDragStart: (y) => {
              i(u.code);
              try {
                y.dataTransfer.effectAllowed = "move", y.dataTransfer.setData("text/plain", u.code);
              } catch {
              }
            },
            onDragOver: (y) => {
              y.preventDefault(), o(u.code);
            },
            onDrop: (y) => {
              y.preventDefault(), n == null || n();
            },
            onDragEnd: l,
            className: [
              "flex shrink-0 items-center gap-2 h-[34px] px-[13px] rounded-[10px]",
              "text-[12.5px] whitespace-nowrap cursor-grab active:cursor-grabbing",
              "transition-opacity duration-fast",
              x ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
              r === u.code ? "opacity-35" : "opacity-100"
            ].join(" "),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-[11px] opacity-85` }),
              /* @__PURE__ */ e.jsx("span", { children: u.title }),
              b > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                "rounded-full text-[10px] font-extrabold",
                x ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
              ].join(" "), children: b })
            ]
          },
          u.code
        );
      }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          title: "Özellik ekle",
          onClick: () => {
            c(!1), d();
          },
          onMouseEnter: () => c(!0),
          onMouseLeave: () => c(!1),
          className: [
            "flex shrink-0 items-center gap-[7px] h-[34px] ml-1 rounded-[10px]",
            "border border-dashed border-primary bg-primary-subtle text-primary",
            "text-[12.5px] font-bold whitespace-nowrap cursor-pointer",
            "hover:border-solid",
            "transition-[padding] duration-[160ms] ease-[cubic-bezier(.16,1,.3,1)]",
            m ? "px-[13px]" : "px-[11px]"
          ].join(" "),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            m && /* @__PURE__ */ e.jsx("span", { className: "animate-fade-in-fast", children: "Özellik ekle" })
          ]
        }
      )
    ] }),
    f && /* @__PURE__ */ e.jsxs("span", { className: "flex shrink-0 items-center gap-[7px] h-[26px] px-2.5 rounded-full bg-warning-subtle text-warning text-[11px] font-bold", children: [
      /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-warning animate-pulse" }),
      "Taslak"
    ] })
  ] });
}
function Er({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: i,
  onDragEnd: l,
  onReorderTo: o,
  onReorderDrop: n,
  onOpenPicker: d,
  counts: p = {}
}) {
  return /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Görev özellikleri",
      className: "flex lt-860:hidden flex-col gap-[3px] w-[238px] shrink-0 py-4 px-3 border-r border-subtle bg-surface-base overflow-y-auto custom-scrollbar",
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "px-2.5 pt-1 pb-2 text-[10px] font-extrabold uppercase tracking-[.1em] text-text-tertiary", children: "Özellikler" }),
        s.map((f) => {
          const m = t === f.code, c = p[f.code] || 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              draggable: !0,
              title: "Sürükleyerek sırayı değiştirin",
              ...fa(() => a(f.code)),
              onDragStart: (u) => {
                i(f.code);
                try {
                  u.dataTransfer.effectAllowed = "move", u.dataTransfer.setData("text/plain", f.code);
                } catch {
                }
              },
              onDragOver: (u) => {
                u.preventDefault(), o(f.code);
              },
              onDrop: (u) => {
                u.preventDefault(), n == null || n();
              },
              onDragEnd: l,
              className: [
                "flex shrink-0 items-center gap-[11px] h-9 px-[11px] rounded-[9px]",
                "text-[12.5px] text-left cursor-grab active:cursor-grabbing",
                "transition-opacity duration-fast",
                m ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
                r === f.code ? "opacity-35" : "opacity-100"
              ].join(" "),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${f.icon} text-[12px] w-[15px] opacity-85` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: f.title }),
                c > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                  "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                  "rounded-full text-[10px] font-extrabold",
                  m ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
                ].join(" "), children: c })
              ]
            },
            f.code
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
          children: _e(s)
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", title: typeof a == "string" ? a : void 0, children: a || "—" })
    ] })
  ] });
}
const ea = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "—";
function Br({ task: t = {}, nameById: a }) {
  const s = (l, o) => {
    var n;
    return l || o && ((n = a == null ? void 0 : a.get) == null ? void 0 : n.call(a, o)) || null;
  }, r = s(t.creatorName, t.creatorId), i = t.lastModificationTime ? s(t.lastModifierName, t.lastModifierId) : null;
  return /* @__PURE__ */ e.jsx("aside", { className: "flex flex-col gap-3.5 min-w-0", children: /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Oluşturan", value: r || "Bilinmiyor", avatarName: r }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Oluşturma tarihi", value: ea(t.creationTime) }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Güncelleyen", value: i || "—", avatarName: i }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Son güncelleme", value: ea(t.lastModificationTime) }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Görev tipi", value: t.taskType }),
    /* @__PURE__ */ e.jsx(Ae, { label: "Sprint", value: t.sprint })
  ] }) });
}
const ta = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
function pt({ name: t, size: a = 32 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Ue(t), fontSize: a * 0.34 },
      children: _e(t)
    }
  );
}
function aa({ open: t, onClick: a }) {
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
const sa = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function Lr({
  task: t = {},
  onFieldChange: a = () => {
  },
  descriptionValue: s,
  checklist: r,
  currentUserName: i = "Ben"
}) {
  const l = t == null ? void 0 : t.id, o = re(), [n, d] = g.useState(!0), [p, f] = g.useState(""), m = (r == null ? void 0 : r.items) ?? [], c = m.filter((N) => N.isDone).length, u = m.length ? Math.round(c / m.length * 100) : 0, x = async () => {
    var v, $, E;
    const N = p.trim();
    if (!(!N || !l)) {
      f("");
      try {
        await r.addItem(N);
      } catch (W) {
        (E = ($ = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : $.error) == null || E.call($, (W == null ? void 0 : W.message) || "Madde eklenemedi.");
      }
    }
  }, [b, y] = g.useState(!0), [h, j] = g.useState(""), [C, T] = g.useState(!1), [D, B] = g.useState(!1), [G, L] = g.useState(null), [F, I] = g.useState(""), [K, U] = g.useState({}), { data: Q = [] } = ee({
    queryKey: ["task-comments", l],
    queryFn: () => {
      var N, v, $, E;
      return Promise.resolve((E = ($ = (v = (N = window == null ? void 0 : window.apya) == null ? void 0 : N.platform) == null ? void 0 : v.tasks) == null ? void 0 : $.task) == null ? void 0 : E.getComments(l));
    },
    enabled: !!l,
    staleTime: 1e4
  }), O = async () => {
    await o.invalidateQueries({ queryKey: ["task-comments", l] }), await o.invalidateQueries({ queryKey: ["task-detail", l] });
  }, Z = async () => {
    var v, $, E;
    const N = h.trim();
    if (!(!N || !l || D)) {
      B(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.addComment(l, N)), await O(), j("");
      } catch (W) {
        (E = ($ = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : $.error) == null || E.call($, (W == null ? void 0 : W.message) || "Yorum gönderilemedi.");
      } finally {
        B(!1);
      }
    }
  }, V = async (N) => {
    var $, E, W;
    const v = F.trim();
    if (!(!v || !l))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.replyToComment(N, v)), await O(), I(""), L(null);
      } catch (ce) {
        (W = (E = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : E.error) == null || W.call(E, (ce == null ? void 0 : ce.message) || "Yanıt gönderilemedi.");
      }
  }, te = (N) => U((v) => {
    const $ = v[N] ?? { liked: !1, count: 0 };
    return { ...v, [N]: { liked: !$.liked, count: $.count + ($.liked ? -1 : 1) } };
  }), w = !!h.trim() && !D;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-[9px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Açıklama" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Zengin metin · WYSIWYG" })
      ] }),
      /* @__PURE__ */ e.jsx(
        Pa,
        {
          value: s ?? t.description ?? "",
          onChange: (N) => a("description", N),
          mentionName: i
        },
        l
      )
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: ta, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
            c,
            "/",
            m.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(aa, { open: n, onClick: () => d((N) => !N) })
      ] }),
      n && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 mt-3.5", children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
            style: { width: `${u}%` }
          }
        ) }),
        m.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              "aria-label": N.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
              onClick: () => r.toggleItem(N.id).catch((v) => {
                var $, E, W;
                return (W = (E = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : E.error) == null ? void 0 : W.call(E, (v == null ? void 0 : v.message) || "Durum güncellenemedi.");
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
              onClick: () => r.removeItem(N.id).catch((v) => {
                var $, E, W;
                return (W = (E = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : E.error) == null ? void 0 : W.call(E, (v == null ? void 0 : v.message) || "Madde silinemedi.");
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
            value: p,
            onChange: (N) => f(N.target.value),
            onKeyDown: (N) => {
              N.key === "Enter" && x();
            },
            placeholder: "Yeni madde yaz ve Enter'a bas…",
            className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: ta, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Yorumlar & güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: Q.length })
        ] }),
        /* @__PURE__ */ e.jsx(aa, { open: b, onClick: () => y((N) => !N) })
      ] }),
      b && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(pt, { name: i }),
          /* @__PURE__ */ e.jsxs("div", { className: `flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${C ? "border-focus bg-surface-base shadow-focus" : "border-default bg-surface-raised"}`, children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                rows: 2,
                value: h,
                onChange: (N) => j(N.target.value),
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
                  onMouseDown: (v) => v.preventDefault(),
                  onClick: () => j((v) => v + N.add),
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
          const v = K[N.id] ?? { liked: !1, count: 0 };
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start py-3 border-t border-subtle", children: [
            /* @__PURE__ */ e.jsx(pt, { name: N.authorName }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: N.authorName }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: sa(N.creationTime) })
              ] }),
              /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[13px] leading-[1.65] text-text-secondary whitespace-pre-wrap", children: N.text }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 mt-[3px]", children: [
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => te(N.id),
                    className: `flex items-center gap-1.5 h-[26px] px-[9px] rounded-full border text-[11px] font-semibold cursor-pointer ${v.liked ? "border-primary bg-primary-subtle text-primary" : "border-default bg-transparent text-text-tertiary hover:border-focus"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-thumbs-up text-[10px]" }),
                      v.count
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
                    value: F,
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
                /* @__PURE__ */ e.jsx(pt, { name: $.authorName, size: 24 }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: $.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: sa($.creationTime) })
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
function Ar({
  lastSavedAt: t,
  isDirty: a,
  isSaving: s,
  justSaved: r,
  onCancel: i,
  onSave: l
}) {
  const o = t ? new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(t)) : "—", n = s ? "fa-solid fa-circle-notch fa-spin" : r ? "fa-solid fa-check" : "fa-regular fa-floppy-disk", d = s ? "Kaydediliyor…" : r ? "Kaydedildi" : "Kaydet", p = a && !s;
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
          onClick: i,
          className: "h-9 px-4 rounded-[10px] border border-default bg-surface-base text-text-secondary text-[13px] font-semibold hover:bg-surface-hover hover:text-text-primary cursor-pointer",
          children: "Vazgeç"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: l,
          disabled: !p,
          className: `flex items-center gap-2 h-9 px-[22px] rounded-[10px] text-white text-[13px] font-bold shadow-sm ${p ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `${n} text-[11px]` }),
            d
          ]
        }
      )
    ] })
  ] });
}
const Aa = Object.fromEntries(Ve.map((t) => [t.code, t])), zr = {
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
}, Fr = [
  { title: "GÖREV & PLANLAMA", codes: ["subtask-table", "subtask-board", "calendar", "documents", "forms", "checklist", "gantt", "time-tracking", "dependencies", "risks", "approvals", "dashboard"] },
  { title: "İLETİŞİM", codes: ["comments", "emails"] },
  { title: "GEÇMİŞ & FİNANS", codes: ["activity", "history", "finance", "gallery"] },
  { title: "İLERİ ÖZELLİKLER & YAPAY ZEKA", codes: ["ai", "automations", "custom-fields"] }
], Ir = /* @__PURE__ */ new Set([
  "risks",
  "dashboard",
  "comments",
  "emails",
  "custom-fields",
  "approvals",
  "ai",
  "automations"
]), Kr = (t) => Ir.has(t);
function za(t) {
  const a = Aa[t], s = zr[t];
  return a ? {
    code: t,
    title: a.title,
    icon: a.icon,
    desc: (s == null ? void 0 : s.desc) ?? "",
    bg: (s == null ? void 0 : s.bg) ?? "bg-neutral-subtle",
    fg: (s == null ? void 0 : s.fg) ?? "text-text-secondary"
  } : null;
}
function Mr(t) {
  var a;
  return (a = Aa[t]) != null && a.hidden ? null : za(t);
}
function Rr(t = "") {
  const a = t.trim().toLowerCase();
  return Fr.map((s) => ({
    title: s.title,
    items: s.codes.map(Mr).filter(Boolean).filter((r) => !a || r.title.toLowerCase().includes(a) || r.desc.toLowerCase().includes(a))
  })).filter((s) => s.items.length > 0);
}
function Gr(t = "") {
  return Rr(t).flatMap((a) => a.items);
}
const ra = Ve.filter((t) => !t.hidden).length;
function na({ code: t, onRemoveFeature: a, onOpenPicker: s, canRemove: r = !0 }) {
  const i = za(t) ?? { title: t, desc: "", icon: "fa-cube", bg: "bg-neutral-subtle", fg: "text-text-secondary" };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-3 py-14 px-6 rounded-2xl border border-dashed border-strong bg-surface-base text-center", children: [
    /* @__PURE__ */ e.jsx("span", { className: `flex items-center justify-center h-14 w-14 rounded-2xl ${i.bg} ${i.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${i.icon} text-[22px]` }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-w-[420px]", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: i.title }),
      i.desc && /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] leading-[1.6] text-text-secondary", children: i.desc }),
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
function Dt({ open: t, onClose: a, label: s, children: r }) {
  return /* @__PURE__ */ e.jsx(
    Ha,
    {
      open: t,
      onOpenChange: (i) => {
        i || a == null || a();
      },
      children: /* @__PURE__ */ e.jsxs(Qa, { children: [
        /* @__PURE__ */ e.jsx(Wa, { className: "fixed inset-0", style: { pointerEvents: "none" } }),
        /* @__PURE__ */ e.jsx(Za, { asChild: !0, "aria-describedby": void 0, children: /* @__PURE__ */ e.jsxs("div", { className: "fixed inset-0 z-modal", children: [
          /* @__PURE__ */ e.jsx(Ja, { className: "sr-only", children: s }),
          r
        ] }) })
      ] })
    }
  );
}
function qr({
  open: t,
  onClose: a,
  assignedCodes: s = [],
  onAddFeature: r,
  onGoToTab: i
}) {
  const [l, o] = g.useState("");
  if (g.useEffect(() => {
    t || o("");
  }, [t]), !t) return null;
  const n = new Set(s), d = Gr(l), p = s.length + 3, f = (m) => {
    if (n.has(m)) {
      i == null || i(m), a == null || a();
      return;
    }
    r == null || r(m), a == null || a();
  };
  return /* @__PURE__ */ e.jsx(Dt, { open: t, onClose: a, label: "Özellik ekle", children: /* @__PURE__ */ e.jsx(
    "div",
    {
      "data-apya-overlay": !0,
      className: "absolute inset-0 flex items-center justify-center p-6 mobile:p-3 bg-surface-overlay backdrop-blur-sm animate-fade-in-fast",
      onClick: a,
      role: "presentation",
      children: /* @__PURE__ */ e.jsxs(
        "div",
        {
          role: "dialog",
          "aria-modal": "true",
          "aria-label": "Özellik ekle",
          onClick: (m) => m.stopPropagation(),
          className: "flex flex-col w-full max-w-[840px] max-h-[86vh] rounded-[22px] border border-default bg-surface-base shadow-xl overflow-hidden animate-dialog-in",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-2.5 border-b border-subtle bg-surface-raised", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-8 w-8 rounded-[10px] bg-primary text-white shadow-md", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shapes text-[13px]" }) }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsx("h3", { className: "m-0 text-[14px] leading-tight font-extrabold tracking-[-.02em] text-text-primary", children: "Özellik ekle" }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 mb-0 text-[11px] leading-tight text-text-tertiary truncate", children: "Bir özelliğe tıklayarak görevinize yeni sekme ve fonksiyon ekleyin." })
                ] })
              ] }),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: a,
                  "aria-label": "Kapat",
                  className: "flex shrink-0 items-center justify-center h-8 w-8 rounded-[9px] text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer",
                  children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[15px]" })
                }
              )
            ] }),
            /* @__PURE__ */ e.jsx("div", { className: "px-4 pt-2.5", children: /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[13px] top-1/2 -translate-y-1/2 text-[12px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: l,
                  onChange: (m) => o(m.target.value),
                  placeholder: `${ra} özellik arasında ara (Gantt, Finans, Risk, AI…)`,
                  className: "w-full h-[36px] pl-9 pr-3.5 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                }
              )
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 px-4 pt-2.5 pb-4 overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-3 mobile:grid-cols-2 gap-2", children: d.map((m) => {
                const c = n.has(m.code);
                return /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => f(m.code),
                    className: `group flex items-center gap-2.5 p-2.5 rounded-xl border text-left cursor-pointer hover:border-focus hover:shadow-md ${c ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] ${m.bg} ${m.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${m.icon} text-[14px]` }) }),
                      /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col min-w-0 flex-1", children: [
                        /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-between gap-1.5", children: [
                          /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary truncate", children: m.title }),
                          /* @__PURE__ */ e.jsx("span", { className: `mobile:hidden shrink-0 text-[10px] font-extrabold ${c ? "text-primary" : "text-text-tertiary"}`, children: c ? "✓ Ekli" : "Ekle →" })
                        ] }),
                        /* @__PURE__ */ e.jsx("span", { className: "mobile:hidden text-[11px] leading-[1.35] text-text-tertiary line-clamp-2", children: m.desc })
                      ] })
                    ]
                  },
                  m.code
                );
              }) }),
              d.length === 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-1.5 py-10 text-center", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass text-2xl text-text-tertiary mb-1" }),
                /* @__PURE__ */ e.jsx("p", { className: "m-0 text-sm font-semibold text-text-primary", children: "Eşleşen özellik bulunamadı" }),
                /* @__PURE__ */ e.jsx("p", { className: "m-0 text-xs text-text-tertiary", children: "Lütfen farklı bir arama terimi deneyin." })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-2 border-t border-subtle bg-surface-raised text-[11px] text-text-tertiary", children: [
              /* @__PURE__ */ e.jsxs("span", { className: "truncate", children: [
                "Toplam ",
                ra,
                " modül · ",
                p,
                " tanesi bu göreve ekli"
              ] }),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: a,
                  className: "shrink-0 border-0 bg-transparent text-text-secondary text-[11px] font-bold cursor-pointer hover:text-primary",
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
const Yr = [
  { key: "subtasks", label: "Alt görevler", countKey: "subtasks", unit: "alt görev" },
  { key: "checklist", label: "Kontrol listesi", countKey: "checklist", unit: "madde" },
  { key: "comments", label: "Yorumlar", countKey: "comments", unit: "yorum" },
  { key: "files", label: "Dosyalar", countKey: "files", unit: "dosya" },
  { key: "keepAssignee", label: "Sorumluyu koru", desc: "Aksi halde atanmamış gelir" },
  { key: "keepLinks", label: "Bağımlılıkları koru", desc: "Öncül / ardıl bağlantılar" },
  { key: "shiftDates", label: "Tarihleri bugüne kaydır", desc: "Başlangıç ve son tarih ötelenir" }
], ia = {
  subtasks: !0,
  checklist: !0,
  comments: !1,
  files: !0,
  keepAssignee: !0,
  keepLinks: !0,
  shiftDates: !1
};
function _r({ on: t, onClick: a, label: s }) {
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
function Ur({
  open: t,
  mode: a = "move",
  onClose: s,
  onConfirm: r,
  projectOptions: i = [],
  currentProjectId: l,
  counts: o = {},
  onCreateProject: n
}) {
  const [d, p] = g.useState(a), [f, m] = g.useState([]), [c, u] = g.useState(""), [x, b] = g.useState(""), [y, h] = g.useState(ia), [j, C] = g.useState(!1);
  g.useEffect(() => {
    t && (p(a), m([]), u(""), b(""), h(ia));
  }, [t, a]);
  const T = g.useMemo(
    () => i.filter((w) => w.value && w.value !== l),
    [i, l]
  ), D = T.filter((w) => !c || w.label.toLowerCase().includes(c.toLowerCase())), B = T.length > 0 && f.length === T.length;
  if (!t) return null;
  const G = (w) => m((N) => N.includes(w) ? N.filter((v) => v !== w) : [...N, w]), L = (w) => {
    var N;
    return ((N = i.find((v) => v.value === w)) == null ? void 0 : N.label) ?? "";
  }, F = async () => {
    var N, v, $;
    const w = x.trim();
    if (!(!w || j)) {
      C(!0);
      try {
        const E = await (n == null ? void 0 : n(w));
        E && m((W) => [...W, E]), b("");
      } catch (E) {
        ($ = (v = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : v.error) == null || $.call(v, (E == null ? void 0 : E.message) || "Proje oluşturulamadı.");
      } finally {
        C(!1);
      }
    }
  }, I = async () => {
    if (!(!f.length || j)) {
      C(!0);
      try {
        await (r == null ? void 0 : r({ mode: d, targetProjectIds: f, include: y }));
      } finally {
        C(!1);
      }
    }
  }, K = d === "move", U = f.length, Q = K ? U > 1 ? "Taşı ve kopyala" : "Taşı" : U > 1 ? `${U} projeye kopyala` : "Kopyala", O = Object.values(y).filter(Boolean).length, Z = f.map(L).filter(Boolean), V = Z.length ? `${Z.length > 2 ? `${Z.slice(0, 2).join(", ")} +${Z.length - 2}` : Z.join(", ")} · ${O} seçenek açık` : `Proje seçilmedi · ${O} seçenek açık`, te = (w) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${w ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return /* @__PURE__ */ e.jsx(Dt, { open: t, onClose: s, label: K ? "Başka projeye taşı" : "Başka projelere kopyala", children: /* @__PURE__ */ e.jsx(
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
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => p("move"), className: te(K), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[10px]" }),
                "Taşı"
              ] }),
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => p("copy"), className: te(!K), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clone text-[10px]" }),
                "Kopyala"
              ] })
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 grid grid-cols-2 lt-860:grid-cols-1 gap-5 items-start px-[22px] pt-4 pb-5 overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px] min-w-0", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5", children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.08em] text-text-tertiary", children: [
                    "Hedef projeler · ",
                    U
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => m(B ? [] : T.map((w) => w.value)),
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
                      value: c,
                      onChange: (w) => u(w.target.value),
                      placeholder: "Proje ara…",
                      className: "w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar", children: [
                  D.map((w) => {
                    const N = f.includes(w.value), v = K && f[0] === w.value;
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
                          v && /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center h-5 px-2 rounded-md bg-primary text-white text-[10px] font-extrabold", children: "TAŞINACAK" })
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
                      value: x,
                      onChange: (w) => b(w.target.value),
                      onKeyDown: (w) => {
                        w.key === "Enter" && (w.preventDefault(), F());
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
                      onClick: F,
                      disabled: !x.trim() || j,
                      className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-plus text-[12px]" })
                    }
                  )
                ] }),
                K && U > 1 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle", children: [
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
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: Yr.map((w) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-px", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary", children: w.label }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: w.countKey ? `${o[w.countKey] ?? 0} ${w.unit}` : w.desc })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    _r,
                    {
                      on: y[w.key],
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
                    disabled: !U || j,
                    className: `flex items-center gap-2 h-9 px-5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${U && !j ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${j ? "fa-circle-notch fa-spin" : "fa-arrow-right"} text-[10px]` }),
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
const Or = [
  { code: "general", title: "Genel", icon: "fa-circle-info" },
  { code: "checklist", title: "Kontrol", icon: "fa-square-check" },
  { code: "comments", title: "Yorumlar", icon: "fa-comments" },
  { code: "files", title: "Dosyalar", icon: "fa-paperclip" }
], Me = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  img: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
};
function Vr(t = "") {
  var s;
  const a = (s = t.split(".").pop()) == null ? void 0 : s.toLowerCase();
  return a === "pdf" ? Me.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(a) ? Me.img : ["doc", "docx", "odt", "rtf"].includes(a) ? Me.doc : ["json", "js", "ts", "cs", "xml", "yml", "yaml"].includes(a) ? Me.code : Me.other;
}
const Hr = (t) => t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : "—", Qr = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—", Wr = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—";
function mt({ name: t, size: a = 22 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Ue(t), fontSize: a * 0.4 },
      children: _e(t)
    }
  );
}
function Ze({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: t }),
    a
  ] });
}
function Zr({
  subtaskId: t,
  parentCode: a,
  onClose: s,
  onOpenFull: r,
  onDeleted: i,
  currentUserName: l = "Ben"
}) {
  var E, W, ce;
  const o = re(), { data: n } = Nt(t), d = Ct(t), p = kt(t), [f, m] = g.useState("general"), [c, u] = g.useState(""), [x, b] = g.useState(""), [y, h] = g.useState(""), j = g.useRef(null), C = g.useRef(null);
  n && C.current !== n.id && (C.current = n.id, u(n.description ?? ""));
  const { data: T = [] } = ee({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var k, M, A, Y;
      return Promise.resolve((Y = (A = (M = (k = window == null ? void 0 : window.apya) == null ? void 0 : k.platform) == null ? void 0 : M.tasks) == null ? void 0 : A.task) == null ? void 0 : Y.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4
  });
  if (g.useEffect(() => {
    const k = (M) => {
      M.key === "Escape" && (M.stopPropagation(), s == null || s());
    };
    return window.addEventListener("keydown", k), () => window.removeEventListener("keydown", k);
  }, [s]), !n) return null;
  const D = (ce = (W = (E = window == null ? void 0 : window.apya) == null ? void 0 : E.platform) == null ? void 0 : W.tasks) == null ? void 0 : ce.task, B = be(n.status), G = rt(n.priority), L = d.items ?? [], F = L.filter((k) => k.isDone).length, I = L.length ? Math.round(F / L.length * 100) : 0, K = p.attachments ?? [], U = { checklist: L.length, comments: T.length, files: K.length }, Q = async () => {
    await o.invalidateQueries({ queryKey: ["task-detail", t] });
  }, O = async (k) => {
    var M, A, Y;
    try {
      await Promise.resolve(D.update(n.id, {
        title: n.title,
        description: n.description ?? null,
        startDate: (n.startDate ?? "").slice(0, 10),
        dueDate: n.dueDate ? n.dueDate.slice(0, 10) : null,
        status: n.status,
        priority: n.priority,
        assigneeId: n.assigneeId ?? null,
        boardColumnId: n.boardColumnId ?? null,
        projectId: n.projectId ?? null,
        parentTaskId: n.parentTaskId ?? null,
        isPrivate: !!n.isPrivate,
        predecessorIds: n.predecessorIds ?? [],
        tagNames: (n.tags ?? []).map((H) => H.name),
        estimatedHours: n.estimatedHours ?? null,
        taskType: n.taskType ?? null,
        sprint: n.sprint ?? null,
        ...k
      })), await Q();
    } catch (H) {
      (Y = (A = (M = window == null ? void 0 : window.abp) == null ? void 0 : M.notify) == null ? void 0 : A.error) == null || Y.call(A, (H == null ? void 0 : H.message) || "Alt görev güncellenemedi.");
    }
  }, Z = () => O({ status: n.status >= 4 ? 1 : n.status + 1 }), V = () => O({ priority: n.priority >= 4 ? 1 : n.priority + 1 }), te = () => {
    (n.description ?? "") !== c && O({ description: c || null });
  }, w = async () => {
    var M, A, Y;
    const k = x.trim();
    if (k) {
      b("");
      try {
        await d.addItem(k);
      } catch (H) {
        (Y = (A = (M = window == null ? void 0 : window.abp) == null ? void 0 : M.notify) == null ? void 0 : A.error) == null || Y.call(A, (H == null ? void 0 : H.message) || "Madde eklenemedi.");
      }
    }
  }, N = async () => {
    var M, A, Y;
    const k = y.trim();
    if (k) {
      h("");
      try {
        await Promise.resolve(D.addComment(n.id, k)), await o.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch (H) {
        (Y = (A = (M = window == null ? void 0 : window.abp) == null ? void 0 : M.notify) == null ? void 0 : A.error) == null || Y.call(A, (H == null ? void 0 : H.message) || "Yorum gönderilemedi.");
      }
    }
  }, v = async () => {
    var k, M, A;
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(D.delete(n.id)), i == null || i(n.id), s == null || s();
      } catch (Y) {
        (A = (M = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : M.error) == null || A.call(M, (Y == null ? void 0 : Y.message) || "Alt görev silinemedi.");
      }
  }, $ = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
  return /* @__PURE__ */ e.jsxs(Dt, { open: !0, onClose: s, label: `${n.code} alt görev detayı`, children: [
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
        "aria-label": `${n.code} alt görev detayı`,
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
                    onClick: () => r == null ? void 0 : r(n.id),
                    className: `${$} hover:bg-surface-hover hover:text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-up-right-from-square text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Alt görevi sil",
                    onClick: v,
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
              /* @__PURE__ */ e.jsx("span", { className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[10.5px] font-bold tracking-[.04em]", children: n.code }),
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
              (n.tags ?? []).map((k) => /* @__PURE__ */ e.jsx("span", { className: "flex items-center h-6 px-[9px] rounded-[7px] border border-default bg-neutral-subtle text-text-secondary text-[11px] font-semibold", children: k.name }, k.id ?? k.name))
            ] }),
            /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[18px] font-extrabold tracking-[-.02em] leading-[1.3] text-text-primary", children: n.title }),
            /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 pt-1", children: [
              /* @__PURE__ */ e.jsx(Ze, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
                /* @__PURE__ */ e.jsx(mt, { name: n.assigneeName }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", children: n.assigneeName || "Atanmamış" })
              ] }) }),
              /* @__PURE__ */ e.jsx(Ze, { label: "Son tarih", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] h-[22px] text-[12.5px] font-semibold text-text-primary", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[11px] text-text-tertiary" }),
                Wr(n.dueDate)
              ] }) }),
              /* @__PURE__ */ e.jsx(Ze, { label: "Süre", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-[22px] font-mono text-[12.5px] font-bold text-text-primary", children: [
                n.spentHours ?? 0,
                "s",
                /* @__PURE__ */ e.jsxs("span", { className: "font-medium text-text-tertiary", children: [
                  " / ",
                  n.estimatedHours != null ? `${n.estimatedHours}s` : "—"
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
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: Or.map((k) => {
            const M = f === k.code, A = U[k.code] ?? 0;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => m(k.code),
                className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${M ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${k.icon} text-[11px] opacity-85` }),
                  /* @__PURE__ */ e.jsx("span", { children: k.title }),
                  A > 0 && /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-neutral-subtle text-text-tertiary text-[10px] font-extrabold", children: A })
                ]
              },
              k.code
            );
          }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar px-5 py-[18px] bg-surface-raised", children: [
            f === "general" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Açıklama" }),
              /* @__PURE__ */ e.jsx(
                "textarea",
                {
                  rows: 7,
                  value: c,
                  onChange: (k) => u(k.target.value),
                  onBlur: te,
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
            f === "checklist" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px]", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Kontrol listesi" }),
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: [
                  F,
                  "/",
                  L.length
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-success", style: { width: `${I}%` } }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px] mt-1", children: [
                L.map((k) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] border border-subtle bg-surface-base hover:border-default", children: [
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Tamamlandı işaretle",
                      onClick: () => d.toggleItem(k.id),
                      className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white cursor-pointer ${k.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
                      children: k.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[12.5px] font-semibold ${k.isDone ? "line-through text-text-tertiary" : "text-text-primary"}`, children: k.text }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Maddeyi sil",
                      onClick: () => d.removeItem(k.id),
                      className: "flex shrink-0 items-center justify-center h-6 w-6 rounded-md text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[10px]" })
                    }
                  )
                ] }, k.id)),
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "text",
                    value: x,
                    onChange: (k) => b(k.target.value),
                    onKeyDown: (k) => {
                      k.key === "Enter" && w();
                    },
                    placeholder: "Yeni madde yaz ve Enter'a bas…",
                    className: "h-9 mt-1 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                )
              ] })
            ] }),
            f === "comments" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] items-start", children: [
                /* @__PURE__ */ e.jsx(mt, { name: l, size: 30 }),
                /* @__PURE__ */ e.jsx(
                  "textarea",
                  {
                    rows: 2,
                    value: y,
                    onChange: (k) => h(k.target.value),
                    onKeyDown: (k) => {
                      k.key === "Enter" && !k.shiftKey && (k.preventDefault(), N());
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
                    className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] ${y.trim() ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paper-plane text-[11px]" })
                  }
                )
              ] }),
              T.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-[7px] py-7 rounded-xl border border-dashed border-default", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-comments text-xl text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Henüz yorum yok" })
              ] }) : T.map((k) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 items-start p-3 rounded-xl border border-subtle bg-surface-base", children: [
                /* @__PURE__ */ e.jsx(mt, { name: k.authorName, size: 28 }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: k.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: Qr(k.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: k.text })
                ] })
              ] }, k.id))
            ] }),
            f === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  ref: j,
                  type: "file",
                  className: "hidden",
                  onChange: (k) => {
                    var A;
                    const M = (A = k.target.files) == null ? void 0 : A[0];
                    k.target.value = "", M && p.upload(M).catch((Y) => {
                      var H, le, z;
                      return (z = (le = (H = window == null ? void 0 : window.abp) == null ? void 0 : H.notify) == null ? void 0 : le.error) == null ? void 0 : z.call(le, (Y == null ? void 0 : Y.message) || "Dosya yüklenemedi.");
                    });
                  }
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    var k;
                    return (k = j.current) == null ? void 0 : k.click();
                  },
                  disabled: p.isUploading,
                  className: "flex flex-col items-center justify-center gap-[7px] p-6 rounded-[13px] border-2 border-dashed border-strong bg-surface-base cursor-pointer hover:border-focus hover:bg-primary-subtle disabled:opacity-60",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${p.isUploading ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-xl text-text-tertiary` }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: p.isUploading ? "Yükleniyor…" : "Dosya ekle" })
                  ]
                }
              ),
              K.map((k) => {
                const M = Vr(k.fileName);
                return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${M.bg} ${M.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${M.icon} text-[13px]` }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: k.fileName }),
                    /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                      Hr(k.fileSize),
                      " · ",
                      k.uploaderName
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "a",
                    {
                      href: k.downloadUrl,
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
                      onClick: () => p.remove(k.id).catch((A) => {
                        var Y, H, le;
                        return (le = (H = (Y = window == null ? void 0 : window.abp) == null ? void 0 : Y.notify) == null ? void 0 : H.error) == null ? void 0 : le.call(H, (A == null ? void 0 : A.message) || "Dosya silinemedi.");
                      }),
                      className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                    }
                  )
                ] }, k.id);
              })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-5 py-3 border-t border-subtle bg-surface-base shrink-0", children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => r == null ? void 0 : r(n.id),
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
const Fa = "apya.taskDetail.tabOrder";
function Jr() {
  try {
    const t = localStorage.getItem(Fa);
    if (!t) return [];
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.filter((s) => typeof s == "string") : [];
  } catch {
    return [];
  }
}
function Xr(t) {
  try {
    localStorage.setItem(Fa, JSON.stringify(t));
  } catch {
  }
}
function en(t) {
  const [a, s] = g.useState(Jr), [r, i] = g.useState(null), l = g.useMemo(() => {
    const p = new Map(t.map((m) => [m.code, m])), f = [];
    for (const m of a) {
      const c = p.get(m);
      c && (f.push(c), p.delete(m));
    }
    for (const m of t)
      p.has(m.code) && f.push(m);
    return f;
  }, [t, a]), o = g.useCallback((p) => {
    s((f) => {
      const m = r;
      if (!m || m === p) return f;
      const c = f.length ? f.slice() : l.map((b) => b.code), u = c.indexOf(m), x = c.indexOf(p);
      return u === -1 || x === -1 ? f : (c.splice(u, 1), c.splice(x, 0, m), c);
    });
  }, [r, l]), n = g.useCallback((p) => i(p), []), d = g.useCallback(() => {
    i(null), s((p) => {
      const f = p.length ? p : l.map((m) => m.code);
      return Xr(f), f;
    });
  }, [l]);
  return { orderedTabs: l, draggingCode: r, handleDragStart: n, handleDragEnd: d, reorderTo: o };
}
function tn() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function an() {
  const t = ee({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: tn,
    staleTime: 3e5,
    retry: !1
  }), a = t.data ?? [], s = a.map((i) => ({ value: i.id, label: i.name })), r = new Map(a.map((i) => [i.id, i.name]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
const la = "apya.taskDetail.fullscreen", J = {
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
function sn(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function Ia({ taskId: t, presentation: a = "modal", onClose: s, switchToTask: r }) {
  var Pt, Et, Bt, Lt, At, zt, Ft, It;
  const [i, l] = g.useState(t), { data: o, isPending: n, isError: d, refetch: p } = Nt(i), f = re(), m = ba(), c = va(o), u = ja(), x = an(), b = Na(i), y = Ct(i), [h, j] = g.useState("general"), [C, T] = g.useState(!1), [D, B] = g.useState(!1), [G, L] = g.useState(!1), [F, I] = g.useState(null), [K, U] = g.useState(null), [Q, O] = g.useState(!1), [Z, V] = g.useState(!1), [te, w] = g.useState(() => {
    try {
      return localStorage.getItem(la) === "true";
    } catch {
      return !1;
    }
  });
  ya(i);
  const [N, v] = g.useState(null);
  o != null && o.id && o.id !== N && (v(o.id), O(!!o.isFavorite), V(!!o.isWatched)), g.useEffect(() => {
    c.isDirty ? m.markDirty() : m.markClean();
  });
  const $ = g.useCallback(() => {
    ga(), s == null || s();
  }, [s]), E = g.useCallback(() => m.requestClose($), [m, $]), W = g.useCallback(() => {
    w((S) => {
      const P = !S;
      try {
        localStorage.setItem(la, String(P));
      } catch {
      }
      return P;
    });
  }, []), ce = g.useMemo(
    () => Ea(b.assignedCodes),
    [b.assignedCodes]
  ), k = en(ce), M = g.useMemo(() => {
    var S, P, q, oe, he;
    return {
      subtasks: ((S = o == null ? void 0 : o.subTasks) == null ? void 0 : S.length) ?? 0,
      files: ((P = o == null ? void 0 : o.attachments) == null ? void 0 : P.length) ?? 0,
      dependencies: ((q = o == null ? void 0 : o.predecessorIds) == null ? void 0 : q.length) ?? 0,
      comments: ((oe = o == null ? void 0 : o.comments) == null ? void 0 : oe.length) ?? 0,
      checklist: ((he = y.items) == null ? void 0 : he.length) ?? 0
    };
  }, [o, y.items]), A = Ve.find((S) => S.code === h), Y = y.items ?? [], H = Y.filter((S) => S.isDone).length, le = Y.length ? Math.round(H / Y.length * 100) : 0, z = g.useCallback(async () => {
    if (!c.validate())
      return J.err("Zorunlu alanları kontrol edin."), !1;
    T(!0);
    try {
      return await Promise.resolve(window.apya.platform.tasks.task.update(i, c.toUpdateDto())), await f.invalidateQueries({ queryKey: ["task-detail", i] }), ie.emitResult(), B(!0), setTimeout(() => B(!1), 2e3), J.ok("Görev başarıyla güncellendi."), !0;
    } catch (S) {
      return J.err((S == null ? void 0 : S.message) || "Kaydedilemedi."), !1;
    } finally {
      T(!1);
    }
  }, [i, c, f]);
  g.useEffect(() => {
    const S = (P) => {
      if ((P.ctrlKey || P.metaKey) && P.key.toLowerCase() === "s") {
        P.preventDefault(), c.isDirty && !C && z();
        return;
      }
      if (P.key === "Escape") {
        if (F) {
          P.stopPropagation(), I(null);
          return;
        }
        G && (P.stopPropagation(), L(!1));
      }
    };
    return window.addEventListener("keydown", S), () => window.removeEventListener("keydown", S);
  }, [z, c.isDirty, C, F, G]);
  const R = () => {
    var S, P, q;
    return (q = (P = (S = window == null ? void 0 : window.apya) == null ? void 0 : S.platform) == null ? void 0 : P.tasks) == null ? void 0 : q.task;
  }, _ = async () => {
    var P;
    const S = !Q;
    O(S);
    try {
      await Promise.resolve((P = R()) == null ? void 0 : P.toggleFavorite(i));
    } catch (q) {
      O(!S), J.err((q == null ? void 0 : q.message) || "Favori güncellenemedi.");
    }
  }, ne = () => {
    if (!i) return;
    const S = document.createElement("a");
    S.href = `/Tasks/Detail/${i}?handler=Pdf`, S.rel = "noopener", document.body.appendChild(S), S.click(), S.remove();
  }, X = async () => {
    var P;
    const S = !Z;
    V(S);
    try {
      await Promise.resolve((P = R()) == null ? void 0 : P.toggleWatch(i)), J.info(S ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (q) {
      V(!S), J.err((q == null ? void 0 : q.message) || "Takip durumu güncellenemedi.");
    }
  }, Te = async () => {
    var S, P;
    try {
      const q = await Promise.resolve((S = R()) == null ? void 0 : S.transfer(i, {
        mode: 2,
        // Copy
        targetProjectIds: o != null && o.projectId ? [o.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await f.invalidateQueries({ queryKey: ["task-detail"] }), J.ok("Görev çoğaltıldı.");
      const oe = (P = q == null ? void 0 : q.createdTaskIds) == null ? void 0 : P[0];
      oe && l(oe);
    } catch (q) {
      J.err((q == null ? void 0 : q.message) || "Görev çoğaltılamadı.");
    }
  }, ue = async () => {
    var S;
    try {
      await Promise.resolve((S = R()) == null ? void 0 : S.updateStatus(i, 4)), await f.invalidateQueries({ queryKey: ["task-detail", i] }), J.info("Görev arşivlendi (Tamamlandı).");
    } catch (P) {
      J.err((P == null ? void 0 : P.message) || "Görev arşivlenemedi.");
    }
  }, Ma = async () => {
    var S;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?"))
      try {
        await Promise.resolve((S = R()) == null ? void 0 : S.delete(i)), J.info("Görev silindi."), m.markClean(), $();
      } catch (P) {
        J.err((P == null ? void 0 : P.message) || "Görev silinemedi.");
      }
  }, Ra = async (S) => {
    try {
      await b.addFeature(S), j(S), J.ok("Özellik başarıyla eklendi.");
    } catch (P) {
      J.err((P == null ? void 0 : P.message) || "Özellik eklenemedi.");
    }
  }, Tt = async (S) => {
    try {
      await b.removeFeature(S), j("general"), J.info("Özellik görevden kaldırıldı.");
    } catch (P) {
      J.err((P == null ? void 0 : P.message) || "Özellik kaldırılamadı.");
    }
  }, Ga = async (S) => {
    var oe, he, de, Ee, Se, He, Fe;
    const P = ((Ee = (de = (he = (oe = window == null ? void 0 : window.apya) == null ? void 0 : oe.platform) == null ? void 0 : he.application) == null ? void 0 : de.projects) == null ? void 0 : Ee.project) ?? ((Fe = (He = (Se = window == null ? void 0 : window.apya) == null ? void 0 : Se.platform) == null ? void 0 : He.projects) == null ? void 0 : Fe.project);
    if (!(P != null && P.create)) throw new Error("Proje servisi yüklenmedi.");
    const q = await Promise.resolve(P.create({
      name: S,
      code: sn(S),
      currency: "TRY"
    }));
    return await f.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), J.ok(`“${S}” projesi oluşturuldu.`), (q == null ? void 0 : q.id) ?? q;
  }, qa = async ({ mode: S, targetProjectIds: P, include: q }) => {
    var oe, he;
    try {
      const de = await Promise.resolve((oe = R()) == null ? void 0 : oe.transfer(i, {
        mode: S === "move" ? 1 : 2,
        targetProjectIds: P,
        include: q
      }));
      await f.invalidateQueries({ queryKey: ["task-detail", i] });
      const Ee = P.map((He) => {
        var Fe;
        return (Fe = x.options.find((_a) => _a.value === He)) == null ? void 0 : Fe.label;
      }).filter(Boolean), Se = ((he = de == null ? void 0 : de.createdTaskIds) == null ? void 0 : he.length) ?? 0;
      J.ok(S === "move" ? Se ? `“${Ee[0]}” projesine taşındı, ${Se} projeye kopyalandı.` : `Görev “${Ee[0]}” projesine taşındı.` : Se > 1 ? `${Se} projeye kopyalandı.` : `Kopya “${Ee[0]}” projesinde oluşturuldu.`), I(null);
    } catch (de) {
      J.err((de == null ? void 0 : de.message) || "Transfer tamamlanamadı.");
    }
  }, Ya = h === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)] gap-5 items-start", children: [
    /* @__PURE__ */ e.jsx(
      Lr,
      {
        task: o,
        onFieldChange: c.setField,
        descriptionValue: c.values.description,
        checklist: y,
        currentUserName: ((Et = (Pt = window == null ? void 0 : window.abp) == null ? void 0 : Pt.currentUser) == null ? void 0 : Et.name) || ((Lt = (Bt = window == null ? void 0 : window.abp) == null ? void 0 : Bt.currentUser) == null ? void 0 : Lt.userName) || "Ben"
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5", children: /* @__PURE__ */ e.jsx(Br, { task: o, nameById: u.nameById }) })
  ] }) : Kr(h) ? /* @__PURE__ */ e.jsx(
    na,
    {
      code: h,
      onRemoveFeature: Tt,
      onOpenPicker: () => L(!0),
      canRemove: !(A != null && A.isCore)
    }
  ) : /* @__PURE__ */ e.jsx(g.Suspense, { fallback: /* @__PURE__ */ e.jsx(je, { className: "h-48 w-full" }), children: A != null && A.component ? /* @__PURE__ */ e.jsx(
    A.component,
    {
      taskId: i,
      task: o,
      form: c,
      nameById: u.nameById,
      onOpenSubtask: U
    }
  ) : /* @__PURE__ */ e.jsx(
    na,
    {
      code: h,
      onRemoveFeature: Tt,
      onOpenPicker: () => L(!0),
      canRemove: !(A != null && A.isCore)
    }
  ) }), St = n ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(je, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(je, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(je, { className: "h-64 w-full" })
  ] }) : d ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(ae, { variant: "ghost", onClick: () => p(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col flex-1 min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      Sr,
      {
        task: o,
        presentation: a,
        onClose: E,
        isFullscreen: te,
        onToggleFullscreen: W,
        onFieldChange: c.setField,
        statusValue: c.values.status,
        titleValue: o == null ? void 0 : o.title,
        isPrivateValue: c.values.isPrivate,
        isFavorite: Q,
        onToggleFavorite: _,
        isWatched: Z,
        onToggleWatch: X,
        onDuplicate: Te,
        onArchive: ue,
        onDelete: Ma,
        onOpenTransfer: (S) => I({ mode: S }),
        onSaveAsTemplate: () => J.info("Şablon olarak kaydetme yakında."),
        onConvertToSubtask: () => J.info("Alt göreve dönüştürme yakında."),
        onExportPdf: ne
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        $r,
        {
          task: o,
          assigneeOptions: u.options,
          projectOptions: x.options,
          onFieldChange: c.setField,
          statusValue: c.values.status,
          priorityValue: c.values.priority,
          assigneeValue: c.values.assigneeId,
          projectValue: c.values.projectId,
          dueDateValue: c.values.dueDate,
          startDateValue: c.values.startDate,
          tagsValue: c.values.tagNames,
          progressPercent: le,
          progressNote: `${H}/${Y.length} madde`,
          onOpenTransfer: (S) => I({ mode: S })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        a === "page" && /* @__PURE__ */ e.jsx(
          Er,
          {
            activeTab: h,
            onTabChange: j,
            orderedTabs: k.orderedTabs,
            draggingCode: k.draggingCode,
            onDragStart: k.handleDragStart,
            onDragEnd: k.handleDragEnd,
            onReorderTo: k.reorderTo,
            onReorderDrop: () => J.info("Sekme sırası güncellendi."),
            onOpenPicker: () => L(!0),
            counts: M
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: a === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            Pr,
            {
              activeTab: h,
              onTabChange: j,
              orderedTabs: k.orderedTabs,
              draggingCode: k.draggingCode,
              onDragStart: k.handleDragStart,
              onDragEnd: k.handleDragEnd,
              onReorderTo: k.reorderTo,
              onReorderDrop: () => J.info("Sekme sırası güncellendi."),
              onOpenPicker: () => L(!0),
              counts: M,
              isDirty: c.isDirty
            }
          ) }),
          /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised", children: Ya })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(
      Ar,
      {
        lastSavedAt: o == null ? void 0 : o.lastModificationTime,
        isDirty: c.isDirty,
        isSaving: C,
        justSaved: D,
        onCancel: E,
        onSave: z
      }
    )
  ] }), $t = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      qr,
      {
        open: G,
        onClose: () => L(!1),
        assignedCodes: b.assignedCodes,
        onAddFeature: Ra,
        onGoToTab: j
      }
    ),
    /* @__PURE__ */ e.jsx(
      Ur,
      {
        open: !!F,
        mode: (F == null ? void 0 : F.mode) ?? "move",
        onClose: () => I(null),
        onConfirm: qa,
        projectOptions: x.options,
        currentProjectId: c.values.projectId,
        counts: M,
        onCreateProject: Ga
      }
    ),
    K && /* @__PURE__ */ e.jsx(
      Zr,
      {
        subtaskId: K,
        parentCode: o == null ? void 0 : o.code,
        onClose: () => U(null),
        onOpenFull: (S) => {
          U(null), (r ?? l)(S);
        },
        onDeleted: () => f.invalidateQueries({ queryKey: ["task-detail", i] }),
        currentUserName: ((zt = (At = window == null ? void 0 : window.abp) == null ? void 0 : At.currentUser) == null ? void 0 : zt.name) || ((It = (Ft = window == null ? void 0 : window.abp) == null ? void 0 : Ft.currentUser) == null ? void 0 : It.userName) || "Ben"
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col w-full min-h-[calc(100vh-54px)] border-y border-subtle bg-surface-base", children: St }),
    $t
  ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(xa, { open: !0, onOpenChange: (S) => {
      S || E();
    }, children: /* @__PURE__ */ e.jsx(
      ua,
      {
        title: o != null && o.title ? `Görev Detayı: ${o.title}` : "Görev Detayı",
        fullscreen: te,
        className: te ? "p-0 rounded-xl border border-default shadow-xl short:h-[100svh]" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl short:h-[100svh]",
        onInteractOutside: (S) => {
          var P, q;
          S.preventDefault(), !(G || F || K) && ((q = (P = S.target) == null ? void 0 : P.closest) != null && q.call(P, "[data-apya-overlay]") || E());
        },
        onEscapeKeyDown: (S) => {
          if (G || F || K) {
            S.preventDefault();
            return;
          }
          S.preventDefault(), E();
        },
        children: St
      }
    ) }),
    $t
  ] });
}
function rn() {
  var a;
  const t = g.useSyncExternalStore(
    ie.subscribe,
    ie.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(et, { children: /* @__PURE__ */ e.jsx(
    Ia,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        ie.close(), ie.emitResult();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(et, { children: /* @__PURE__ */ e.jsx(
    Ba,
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
function Ka() {
  var s;
  try {
    const r = new URLSearchParams(window.location.search).get("taskui");
    if (r === "v1" || r === "v2" || r === "v3") return r;
  } catch {
  }
  const t = document.getElementById("task-detail-island"), a = (s = t == null ? void 0 : t.dataset) == null ? void 0 : s.taskui;
  return a === "v1" || a === "v2" ? a : "v3";
}
function nn() {
  return Ka() === "v2";
}
function ln() {
  return Ka() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = ln();
window.apya.taskDetailV2Enabled = nn() && !window.apya.taskDetailV3Enabled;
const oa = {
  open: (t) => {
    ie.open(t);
  },
  close: () => ie.close(),
  onResult: (t) => ie.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(oa) : window.apya.taskDetail = oa;
function ca() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = da(t), t._reactRoot.render(/* @__PURE__ */ e.jsx(rn, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = ha();
    a && ie.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", ca) : ca();
function on({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(et, { children: /* @__PURE__ */ e.jsx(
    Ia,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(et, { children: /* @__PURE__ */ e.jsx(
    Ba,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) });
}
const ft = document.getElementById("task-detail-page-island");
if (ft) {
  const t = ft.getAttribute("data-task-id");
  t && da(ft).render(/* @__PURE__ */ e.jsx(on, { taskId: t }));
}
