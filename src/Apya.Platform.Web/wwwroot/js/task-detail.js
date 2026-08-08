import { j as e, r as x, d as xe, a as mt, b as Ze } from "./react-vendor.js";
/* empty css      */
import { a as we } from "./QueryProvider.js";
import { u as ae, a as ee, b as se } from "./query-vendor.js";
import { D as We, l as Je, e as Ne, B as k, I as ce, S as ie } from "./Dialog.js";
import { C as pt } from "./Combobox.js";
import { r as ft } from "./httpClient.js";
import { R as pe, T as fe, P as be, C as he, A as bt } from "./ui-vendor.js";
function ht({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: n,
  footer: i,
  children: o
}) {
  return /* @__PURE__ */ e.jsx(
    We,
    {
      open: t,
      onOpenChange: (l) => {
        l || a();
      },
      children: /* @__PURE__ */ e.jsx(
        Je,
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
            /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: o }),
            i
          ] })
        }
      )
    }
  );
}
function yt({ title: t, header: a, footer: s, children: r }) {
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
function gt({ isPrivate: t }) {
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
}, Ae = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function vt({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: n,
  fullscreen: i = !1
}) {
  const [o, l] = x.useState(!1), d = x.useRef(null);
  x.useEffect(() => {
    if (!o) return;
    const g = (y) => {
      d.current && !d.current.contains(y.target) && l(!1);
    }, u = (y) => {
      y.key === "Escape" && l(!1);
    };
    return document.addEventListener("mousedown", g), document.addEventListener("keydown", u), () => {
      document.removeEventListener("mousedown", g), document.removeEventListener("keydown", u);
    };
  }, [o]);
  const c = ye[t == null ? void 0 : t.status] ?? ye[1], m = Ae[t == null ? void 0 : t.priority] ?? Ae[2], b = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), l(!1);
  }, f = () => {
    var u, y, j, v;
    const g = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (u = navigator.clipboard) == null || u.writeText(g), (v = (j = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : j.info) == null || v.call(j, "Bağlantı kopyalandı."), l(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(Ne, { variant: c.variant, children: c.text }),
        /* @__PURE__ */ e.jsx(Ne, { variant: m.variant, children: m.text }),
        /* @__PURE__ */ e.jsx(gt, { isPrivate: t == null ? void 0 : t.isPrivate })
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
            "aria-expanded": o,
            onClick: () => l((g) => !g),
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
const jt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function wt({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: n }) {
  const i = jt(t);
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
const Pe = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Nt = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function re({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function kt({ value: t, onChange: a }) {
  const [s, r] = x.useState(""), n = () => {
    const i = s.trim();
    i && !t.includes(i) && a([...t, i]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((i) => /* @__PURE__ */ e.jsxs(Ne, { variant: "neutral", children: [
      i,
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${i} etiketini kaldır`,
          onClick: () => a(t.filter((o) => o !== i)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, i)) }),
    /* @__PURE__ */ e.jsx(
      ce,
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
function Ct({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: n = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(re, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      ce,
      {
        id: "task-title",
        value: t.title,
        onChange: (i) => s("title", i.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(re, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (i) => s("status", Number(i.target.value)),
          className: Pe,
          children: Object.entries(ye).map(([i, o]) => /* @__PURE__ */ e.jsx("option", { value: i, children: o.text }, i))
        }
      ) }),
      /* @__PURE__ */ e.jsx(re, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (i) => s("priority", Number(i.target.value)),
          className: Pe,
          children: Object.entries(Ae).map(([i, o]) => /* @__PURE__ */ e.jsx("option", { value: i, children: o.text }, i))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(re, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      pt,
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
      /* @__PURE__ */ e.jsx(re, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        ce,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (i) => s("startDate", i.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(re, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        ce,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (i) => s("dueDate", i.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(re, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(kt, { value: t.tagNames, onChange: (i) => s("tagNames", i) }) }),
    /* @__PURE__ */ e.jsx(re, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (i) => s("description", i.target.value),
        className: Nt
      }
    ) })
  ] });
}
const Ke = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function me({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function Tt({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(me, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(me, { label: "Oluşturulma zamanı", value: Ke(t.creationTime) }),
      /* @__PURE__ */ e.jsx(me, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(me, { label: "Son güncelleme zamanı", value: Ke(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(me, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const Dt = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", St = "border-brand-500 text-text-primary";
function Et({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: n }) {
  const i = x.useRef(/* @__PURE__ */ new Map()), o = (d) => {
    var c;
    s(d.code), (c = i.current.get(d.code)) == null || c.focus();
  }, l = (d, c) => {
    d.key === "ArrowRight" ? (d.preventDefault(), o(t[(c + 1) % t.length])) : d.key === "ArrowLeft" ? (d.preventDefault(), o(t[(c - 1 + t.length) % t.length])) : d.key === "Home" ? (d.preventDefault(), o(t[0])) : d.key === "End" && (d.preventDefault(), o(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((d, c) => {
      const m = d.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (b) => {
            b ? i.current.set(d.code, b) : i.current.delete(d.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${d.code}`,
          "aria-selected": m,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: m ? 0 : -1,
          onClick: () => s(d.code),
          onKeyDown: (b) => l(b, c),
          className: `${Dt} ${m ? St : ""}`,
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
const zt = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function At({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [n, i] = x.useState(""), o = x.useMemo(() => {
    const l = n.trim().toLocaleLowerCase("tr-TR"), d = l ? t.filter((m) => m.title.toLocaleLowerCase("tr-TR").includes(l)) : t, c = /* @__PURE__ */ new Map();
    return d.forEach((m) => {
      const b = c.get(m.category) ?? [];
      b.push(m), c.set(m.category, b);
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
          ce,
          {
            autoFocus: !0,
            value: n,
            onChange: (l) => i(l.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          o.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...o.entries()].map(([l, d]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: zt[l] ?? l }),
            d.map((c) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa ${c.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: c.title }),
              !c.implemented && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              c.implemented && !c.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === c.code,
                  onClick: () => a(c.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              c.implemented && c.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === c.code,
                  onClick: () => s(c.code),
                  className: "text-[13px] font-medium text-text-negative hover:underline disabled:opacity-50",
                  children: "Kaldır"
                }
              )
            ] }, c.code))
          ] }, l))
        ] })
      ]
    }
  );
}
function It({ trail: t = [], current: a, onNavigate: s }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((r) => /* @__PURE__ */ e.jsxs(xe.Fragment, { children: [
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
function Lt(t) {
  var s, r, n;
  const a = (n = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : n.task;
  return a ? Promise.resolve(a.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Xe(t) {
  return ae({
    queryKey: ["task-detail", t],
    queryFn: () => Lt(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function ke(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
function et() {
  const [t, a] = x.useState(!1), [s, r] = x.useState(!1), n = x.useRef(null), i = x.useCallback(() => a(!0), []), o = x.useCallback(() => a(!1), []);
  x.useEffect(() => {
    if (!t) return;
    const c = (m) => {
      m.preventDefault(), m.returnValue = "";
    };
    return window.addEventListener("beforeunload", c), () => window.removeEventListener("beforeunload", c);
  }, [t]);
  const l = x.useCallback((c) => {
    if (!t) {
      c == null || c();
      return;
    }
    n.current = c ?? null, r(!0);
  }, [t]), d = x.useCallback((c) => {
    const m = n.current;
    return r(!1), n.current = null, c === "discard" && (a(!1), m == null || m()), c === "save" ? m : null;
  }, []);
  return { isDirty: t, markDirty: i, markClean: o, requestClose: l, pendingClose: s, resolvePendingClose: d };
}
const Rt = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, Le = "task";
function tt() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(Le);
  return t && Rt.test(t) ? t : null;
}
function st() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(Le), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function at(t, a) {
  const s = x.useRef(a);
  s.current = a, x.useEffect(() => {
    if (!t || tt() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(Le, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), x.useEffect(() => {
    const r = () => {
      var n;
      (n = s.current) == null || n.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const Pt = {
  title: "",
  description: "",
  startDate: "",
  dueDate: "",
  status: 1,
  priority: 2,
  assigneeId: null,
  tagNames: []
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
    tagNames: (t.tags ?? []).map((a) => a.name)
  } : Pt;
}
function rt(t) {
  const [a, s] = x.useState(t == null ? void 0 : t.id), r = x.useMemo(() => Kt(t), [t]), [n, i] = x.useState(r), [o, l] = x.useState({});
  (t == null ? void 0 : t.id) !== a && (s(t == null ? void 0 : t.id), i(r), l({}));
  const d = x.useCallback((g, u) => {
    i((y) => ({ ...y, [g]: u }));
  }, []), c = x.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(r),
    [n, r]
  ), m = x.useCallback(() => {
    const g = {};
    return n.title.trim() || (g.title = "Başlık zorunlu."), n.startDate || (g.startDate = "Başlangıç tarihi zorunlu."), n.dueDate && n.startDate && n.dueDate < n.startDate && (g.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), l(g), Object.keys(g).length === 0;
  }, [n]), b = x.useCallback(() => ({
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
  }), [n, t]), f = x.useCallback(() => {
    i(r), l({});
  }, [r]);
  return { values: n, setField: d, isDirty: c, errors: o, validate: m, toUpdateDto: b, reset: f };
}
function Ge(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function Gt() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function it() {
  var n;
  const t = ae({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Gt,
    staleTime: 3e5,
    retry: !1
  }), a = ((n = t.data) == null ? void 0 : n.items) ?? [], s = a.map((i) => ({ value: i.id, label: Ge(i) })), r = new Map(a.map((i) => [i.id, Ge(i)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function Ie() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Bt(t) {
  const a = Ie();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function nt(t) {
  const a = ee(), s = ["task-features", t], r = ae({
    queryKey: s,
    queryFn: () => Bt(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = se({
    mutationFn: (l) => Promise.resolve(Ie().addFeature(t, l)),
    onSuccess: n
  }), o = se({
    mutationFn: (l) => Promise.resolve(Ie().removeFeature(t, l)),
    onSuccess: n
  });
  return {
    assignedCodes: r.data ?? [],
    isLoading: r.isLoading,
    addFeature: i.mutateAsync,
    removeFeature: o.mutateAsync,
    mutatingCode: i.variables ?? o.variables ?? null,
    isMutating: i.isPending || o.isPending
  };
}
function Ft({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, n] = x.useState(""), [i, o] = x.useState(!1), [l, d] = x.useState(null), c = ee(), m = (a == null ? void 0 : a.subTasks) ?? [], b = () => c.invalidateQueries({ queryKey: ["task-detail", t] }), f = async () => {
    var y, j, v;
    const u = r.trim();
    if (u) {
      o(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: u,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), n(""), await b();
      } catch (p) {
        (v = (j = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : j.error) == null || v.call(j, (p == null ? void 0 : p.message) || "Alt görev eklenemedi.");
      } finally {
        o(!1);
      }
    }
  }, g = async (u) => {
    var y, j, v;
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(u)), await b();
    } catch (p) {
      (v = (j = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : j.error) == null || v.call(j, (p == null ? void 0 : p.message) || "Alt görev silinemedi.");
    } finally {
      d(null);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        ce,
        {
          value: r,
          onChange: (u) => n(u.target.value),
          onKeyDown: (u) => {
            u.key === "Enter" && f();
          },
          placeholder: "Yeni alt görev başlığı",
          disabled: i
        }
      ),
      /* @__PURE__ */ e.jsx(k, { variant: "secondary", onClick: f, disabled: i || !r.trim(), children: "Alt Görev Ekle" })
    ] }),
    m.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz alt görev yok." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: m.map((u) => {
      var y, j;
      return /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between py-2", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => s == null ? void 0 : s(u.id, u.title),
            className: "text-left text-sm font-medium text-text-primary hover:underline",
            children: u.title
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(Ne, { variant: ((y = ye[u.status]) == null ? void 0 : y.variant) ?? "neutral", children: ((j = ye[u.status]) == null ? void 0 : j.text) ?? u.status }),
          l === u.id ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary", children: "Emin misiniz?" }),
            /* @__PURE__ */ e.jsx(k, { variant: "destructive", onClick: () => g(u.id), children: "Evet, sil" }),
            /* @__PURE__ */ e.jsx(k, { variant: "ghost", onClick: () => d(null), children: "Vazgeç" })
          ] }) : /* @__PURE__ */ e.jsx(k, { variant: "ghost", onClick: () => d(u.id), "aria-label": `${u.title} alt görevini sil`, children: "Sil" })
        ] })
      ] }, u.id);
    }) })
  ] });
}
function lt() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Mt(t) {
  const a = lt();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function $t(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, n = ft();
  n && (r.RequestVerificationToken = n);
  const i = await fetch(`/api/tasks/attachments/upload/${t}`, {
    method: "POST",
    credentials: "include",
    headers: r,
    body: s
  });
  let o = null;
  try {
    o = await i.json();
  } catch {
  }
  if (!i.ok || (o == null ? void 0 : o.success) === !1)
    throw new Error((o == null ? void 0 : o.error) || "Dosya yüklenemedi.");
  return o;
}
function Ot(t) {
  const a = ee(), s = ["task-attachments", t], r = ae({
    queryKey: s,
    queryFn: () => Mt(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = se({
    mutationFn: (l) => $t(t, l),
    onSuccess: n
  }), o = se({
    mutationFn: (l) => Promise.resolve(lt().deleteAttachment(l)),
    onSuccess: n
  });
  return {
    attachments: r.data ?? [],
    isLoading: r.isLoading,
    upload: i.mutateAsync,
    remove: o.mutateAsync,
    isUploading: i.isPending
  };
}
function Yt(t) {
  return `${Math.round(t / 1024)} KB`;
}
function qt({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: n } = Ot(t), i = x.useRef(null), o = async (d) => {
    var m, b, f, g, u, y, j;
    const c = (m = d.target.files) == null ? void 0 : m[0];
    if (c)
      try {
        await s(c), (g = (f = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : f.success) == null || g.call(f, "Dosya yüklendi.");
      } catch (v) {
        (j = (y = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : y.error) == null || j.call(y, (v == null ? void 0 : v.message) || "Dosya yüklenemedi.");
      } finally {
        i.current && (i.current.value = "");
      }
  }, l = async (d, c) => {
    var m, b, f;
    try {
      await r(d);
    } catch (g) {
      (f = (b = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : b.error) == null || f.call(b, (g == null ? void 0 : g.message) || `${c} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("input", { ref: i, type: "file", onChange: o, className: "text-sm", disabled: n }),
      n && /* @__PURE__ */ e.jsx("span", { className: "text-sm text-text-tertiary", children: "Yükleniyor…" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: a.map((d) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between py-2", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("a", { href: d.downloadUrl, target: "_blank", rel: "noreferrer", className: "text-sm font-medium text-text-primary hover:underline", children: d.fileName }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-text-tertiary", children: [
          Yt(d.fileSize),
          " — ",
          d.uploaderName
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(k, { variant: "ghost", onClick: () => l(d.id, d.fileName), "aria-label": `${d.fileName} dosyasini sil`, children: "Sil" })
    ] }, d.id)) })
  ] });
}
function ve() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Ut(t) {
  const a = ve();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ot(t) {
  const a = ee(), s = ["task-checklist", t], r = ae({
    queryKey: s,
    queryFn: () => Ut(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = se({
    mutationFn: (d) => Promise.resolve(ve().addChecklistItem(t, d)),
    onSuccess: n
  }), o = se({
    mutationFn: (d) => Promise.resolve(ve().toggleChecklistItem(d)),
    onSuccess: n
  }), l = se({
    mutationFn: (d) => Promise.resolve(ve().deleteChecklistItem(d)),
    onSuccess: n
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: i.mutateAsync,
    toggleItem: o.mutateAsync,
    removeItem: l.mutateAsync
  };
}
function Vt({ taskId: t }) {
  const { items: a, addItem: s, toggleItem: r, removeItem: n } = ot(t), [i, o] = x.useState(""), l = async () => {
    var b, f, g;
    const m = i.trim();
    if (m)
      try {
        await s(m), o("");
      } catch (u) {
        (g = (f = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : f.error) == null || g.call(f, (u == null ? void 0 : u.message) || "Madde eklenemedi.");
      }
  }, d = async (m) => {
    var b, f, g;
    try {
      await r(m);
    } catch (u) {
      (g = (f = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : f.error) == null || g.call(f, (u == null ? void 0 : u.message) || "Madde güncellenemedi.");
    }
  }, c = async (m, b) => {
    var f, g, u;
    try {
      await n(m);
    } catch (y) {
      (u = (g = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : g.error) == null || u.call(g, (y == null ? void 0 : y.message) || `${b} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        ce,
        {
          value: i,
          onChange: (m) => o(m.target.value),
          onKeyDown: (m) => {
            m.key === "Enter" && l();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ e.jsx(k, { variant: "secondary", onClick: l, disabled: !i.trim(), children: "Ekle" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz madde eklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "space-y-1.5", children: a.map((m) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-2 py-1", children: [
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
      /* @__PURE__ */ e.jsx(k, { variant: "ghost", onClick: () => c(m.id, m.text), "aria-label": `${m.text} maddesini sil`, children: "Sil" })
    ] }, m.id)) })
  ] });
}
function _t({ taskId: t, task: a }) {
  const [s, r] = x.useState(""), [n, i] = x.useState(null), [o, l] = x.useState(""), [d, c] = x.useState(!1), m = ee(), b = (a == null ? void 0 : a.comments) ?? [], f = async (u) => {
    var y, j, v, p, w, D;
    if (u == null || u.preventDefault(), !(!s.trim() || d)) {
      c(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), m.invalidateQueries({ queryKey: ["task-detail", t] }), (v = (j = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : j.success) == null || v.call(j, "Yorum eklendi.");
      } catch (R) {
        (D = (w = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : w.error) == null || D.call(w, (R == null ? void 0 : R.message) || "Yorum eklenemedi.");
      } finally {
        c(!1);
      }
    }
  }, g = async (u) => {
    var y, j, v, p, w, D;
    if (!(!o.trim() || d)) {
      c(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(u, o.trim())
        ), l(""), i(null), m.invalidateQueries({ queryKey: ["task-detail", t] }), (v = (j = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : j.success) == null || v.call(j, "Yanıt eklendi.");
      } catch (R) {
        (D = (w = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : w.error) == null || D.call(w, (R == null ? void 0 : R.message) || "Yanıt eklenemedi.");
      } finally {
        c(!1);
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
          onChange: (u) => r(u.target.value),
          placeholder: "Bir yorum veya güncelleme yazın...",
          className: "w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ e.jsx(
        k,
        {
          type: "submit",
          variant: "primary",
          disabled: !s.trim() || d,
          isLoading: d,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    b.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: b.map((u) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: u.creatorUserName || u.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: u.creationTime ? new Date(u.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: u.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        k,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => i(n === u.id ? null : u.id),
          children: "Yanıtla"
        }
      ) }),
      n === u.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: o,
            onChange: (y) => l(y.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(k, { variant: "ghost", size: "sm", onClick: () => i(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(k, { variant: "primary", size: "sm", disabled: !o.trim() || d, onClick: () => g(u.id), children: "Gönder" })
        ] })
      ] }),
      u.replies && u.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: u.replies.map((y) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: y.creatorUserName || y.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: y.creationTime ? new Date(y.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: y.text })
      ] }, y.id)) })
    ] }, u.id)) })
  ] });
}
function Qt({ task: t }) {
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
function Ht({ task: t }) {
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
function Zt({ task: t }) {
  var c;
  const a = typeof window < "u" && !!((c = window == null ? void 0 : window.abp) != null && c.auth), s = a ? ke("Platform.Expenses.Default") : !0, r = a ? ke("Platform.Incomes.Default") : !0;
  if (!s && !r)
    return /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Finansal verileri görüntüleme yetkiniz bulunmuyor." });
  const n = (t == null ? void 0 : t.expenses) || [], i = (t == null ? void 0 : t.incomes) || [], o = n.reduce((m, b) => m + (b.amount || 0), 0), l = i.reduce((m, b) => m + (b.amount || 0), 0), d = l - o;
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
          o.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
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
const Wt = { 0: 0, 1: 0, 2: 50, 3: 75, 4: 100 }, Jt = { 0: "bg-neutral-400", 1: "bg-text-tertiary", 2: "bg-warning", 3: "bg-primary", 4: "bg-success" };
function Ce(t) {
  if (!t) return null;
  const a = new Date(t);
  return isNaN(a.getTime()) ? null : a;
}
function Be(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
}
function Xt({ task: t = {} }) {
  const a = x.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((i, o) => ({
    id: i.id || `row-${o}`,
    name: i.title || "Başlıksız görev",
    isMain: !!i.__main,
    start: Ce(i.startDate),
    end: Ce(i.dueDate) || Ce(i.completedDate),
    status: i.status ?? 1
  })), [t]), { min: s, span: r } = x.useMemo(() => {
    const n = a.flatMap((l) => [l.start, l.end]).filter(Boolean).map((l) => l.getTime());
    if (n.length === 0) return { min: null, span: 0 };
    const i = Math.min(...n), o = Math.max(...n);
    return { min: i, span: Math.max(1, o - i) };
  }, [a]);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-bars-staggered text-primary text-base" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Gantt Zaman Çizelgesi" })
    ] }),
    s === null ? /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Zaman çizelgesi için görevde veya alt görevlerde başlangıç–bitiş tarihi tanımlı olmalı." }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: a.map((n) => {
      const i = n.start ? n.start.getTime() : s, o = n.end ? Math.max(n.end.getTime(), i) : i, l = (i - s) / r * 100, d = Math.max(2, (o - i) / r * 100), c = Wt[n.status] ?? 0, m = Jt[n.status] || "bg-primary";
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
              /* @__PURE__ */ e.jsx("div", { className: `absolute top-0 h-full ${m} rounded-full opacity-30`, style: { left: `${l}%`, width: `${d}%` } }),
              /* @__PURE__ */ e.jsx("div", { className: `absolute top-0 h-full ${m} rounded-full`, style: { left: `${l}%`, width: `${d * c / 100}%` } })
            ] })
          ]
        },
        n.id
      );
    }) })
  ] });
}
const es = {
  0: { label: "İptal", cls: "text-text-secondary bg-neutral-subtle" },
  1: { label: "Bekliyor", cls: "text-text-secondary bg-neutral-subtle" },
  2: { label: "Sürüyor", cls: "text-warning bg-warning-subtle" },
  3: { label: "Testte", cls: "text-primary bg-primary-subtle" },
  4: { label: "Tamamlandı", cls: "text-success bg-success-subtle" }
};
function ts({ task: t = {} }) {
  const a = (i) => {
    var o, l, d;
    return (d = (l = (o = window == null ? void 0 : window.apya) == null ? void 0 : o.taskDetail) == null ? void 0 : l.open) == null ? void 0 : d.call(l, i);
  }, s = t.predecessorIds || [], { data: r = [], isLoading: n } = ae({
    queryKey: ["task-predecessors", t.id, s],
    queryFn: async () => {
      var o, l, d;
      const i = (d = (l = (o = window == null ? void 0 : window.apya) == null ? void 0 : o.platform) == null ? void 0 : l.tasks) == null ? void 0 : d.task;
      return i ? Promise.all(
        s.map(
          (c) => Promise.resolve(i.get(c)).catch(() => ({ id: c, title: "(erişilemeyen görev)", status: null }))
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
    s.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : n ? /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Yükleniyor…" }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col divide-y divide-subtle/50", children: r.map((i) => {
      const o = es[i.status] || null;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => a(i.id),
          className: "flex items-center justify-between py-3.5 hover:bg-surface-hover/50 px-2 rounded-lg transition-colors text-left",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-diagram-predecessor text-text-tertiary text-xs shrink-0" }),
              /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: i.title || "Başlıksız görev" })
            ] }),
            o && /* @__PURE__ */ e.jsx("span", { className: `text-xs font-semibold px-2.5 py-0.5 rounded-md shrink-0 ${o.cls}`, children: o.label })
          ]
        },
        i.id
      );
    }) })
  ] });
}
function de() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task) || null;
}
function ss(t) {
  const a = ee(), s = ["task-timelogs", t], r = ["task-active-timelog"], n = ae({
    queryKey: s,
    queryFn: () => {
      var c;
      return Promise.resolve((c = de()) == null ? void 0 : c.getTimeLogs(t));
    },
    enabled: !!t && !!de(),
    staleTime: 15e3,
    retry: !1
  }), i = ae({
    queryKey: r,
    queryFn: () => {
      var c;
      return Promise.resolve((c = de()) == null ? void 0 : c.getActiveTimeLog());
    },
    enabled: !!de(),
    staleTime: 5e3,
    retry: !1
  }), o = () => {
    a.invalidateQueries({ queryKey: s }), a.invalidateQueries({ queryKey: r });
  }, l = se({
    mutationFn: () => {
      var c;
      return Promise.resolve((c = de()) == null ? void 0 : c.startTimeTracking(t));
    },
    onSuccess: o
  }), d = se({
    mutationFn: () => {
      var c;
      return Promise.resolve((c = de()) == null ? void 0 : c.stopTimeTracking(t));
    },
    onSuccess: o
  });
  return {
    logs: n.data ?? [],
    isLoading: n.isLoading,
    activeLog: i.data ?? null,
    start: l.mutateAsync,
    stop: d.mutateAsync,
    isMutating: l.isPending || d.isPending
  };
}
function as() {
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
function rs() {
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
function Te(t) {
  return String(t).padStart(2, "0");
}
function is(t) {
  const a = Math.max(0, Math.floor(t));
  return `${Te(Math.floor(a / 3600))}:${Te(Math.floor(a % 3600 / 60))}:${Te(a % 60)}`;
}
function Fe(t) {
  const a = Math.max(0, Math.floor(t)), s = Math.floor(a / 3600), r = Math.floor(a % 3600 / 60);
  return s > 0 ? `${s}s ${r}dk` : r > 0 ? `${r}dk ${a % 60}sn` : `${a % 60}sn`;
}
function Me(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function ns({ taskId: t }) {
  const a = ss(t), s = a.activeLog && a.activeLog.taskId === t ? a.activeLog : null, [r, n] = x.useState(() => Date.now());
  x.useEffect(() => {
    if (!s) return;
    const c = setInterval(() => n(Date.now()), 1e3);
    return () => clearInterval(c);
  }, [s]);
  const i = s ? Math.max(0, Math.floor((r - new Date(s.startTime).getTime()) / 1e3)) : 0, l = a.logs.reduce((c, m) => c + (m.secondsSpent || 0), 0) + i, d = async () => {
    var c, m, b;
    try {
      s ? await a.stop() : await a.start();
    } catch (f) {
      (b = (m = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : m.error) == null || b.call(m, (f == null ? void 0 : f.message) || "Zaman takibi güncellenemedi.");
    }
  };
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
        /* @__PURE__ */ e.jsx("span", { className: "text-2xl font-bold text-primary", children: Fe(l) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: `p-4 rounded-xl border flex flex-col gap-1 ${s ? "bg-success-subtle/30 border-success/30" : "bg-surface-sunken/40 border-subtle"}`, children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-text-tertiary uppercase", children: "Aktif Sayaç" }),
        /* @__PURE__ */ e.jsx("span", { className: `text-2xl font-bold font-mono ${s ? "text-success" : "text-text-tertiary"}`, children: s ? is(i) : "00:00:00" })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ e.jsx("h4", { className: "text-[13px] font-bold text-text-secondary", children: "Kayıtlar" }),
      a.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Yükleniyor…" }) : a.logs.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Henüz zaman kaydı yok. “Süre Başlat” ile sayacı çalıştırın." }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col divide-y divide-subtle/50 rounded-xl border border-subtle overflow-hidden", children: a.logs.map((c) => {
        const m = !c.endTime;
        return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-3.5 py-2.5 bg-surface-base", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0", children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: c.userName || "Kullanıcı" }),
            /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary font-mono", children: [
              Me(c.startTime),
              " → ",
              m ? "sürüyor" : Me(c.endTime)
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: `text-[12px] font-bold px-2 py-0.5 rounded-md ${m ? "text-success bg-success-subtle" : "text-text-secondary bg-surface-sunken"}`, children: m ? "Aktif" : Fe(c.secondsSpent || 0) })
        ] }, c.id);
      }) })
    ] })
  ] });
}
function ls() {
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
function os() {
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
function cs() {
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
function ds() {
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
function xs() {
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
function us() {
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
const Re = [
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
    component: Ft
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
    component: qt
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
    component: Vt
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
    component: Xt
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
    component: ts
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
    component: Zt
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
    component: Ht
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
    component: Qt
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
    component: _t
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
    component: as
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
    component: rs
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
    component: ns
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
    component: us
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
    component: ls
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
    component: os
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
    component: cs
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
    component: ds
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
    component: xs
  }
];
function ct(t = []) {
  const a = new Set(t);
  return Re.filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function ms(t = []) {
  const a = new Set(t);
  return Re.filter((s) => !s.isCore).filter((s) => !s.permission || ke(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let ge = null;
const je = /* @__PURE__ */ new Set(), De = /* @__PURE__ */ new Set();
function $e() {
  je.forEach((t) => t());
}
function ps(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const H = {
  open(t) {
    const a = ps(t);
    a && (ge = a, $e());
  },
  close() {
    ge = null, $e();
  },
  subscribe(t) {
    return je.add(t), () => je.delete(t);
  },
  getSnapshot() {
    return ge;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && De.add(t);
  },
  emitResult() {
    De.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    ge = null, je.clear(), De.clear();
  }
}, Oe = "apya.taskDetail.fullscreen";
function dt({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, n] = x.useState(t), [i, o] = x.useState([]), { data: l, isLoading: d, isError: c, refetch: m } = Xe(r), b = et(), f = rt(l), g = it(), u = nt(r), [y, j] = x.useState("general"), [v, p] = x.useState(!1), w = xe.useRef(null), D = x.useMemo(
    () => ct(u.assignedCodes),
    [u.assignedCodes]
  ), R = x.useMemo(
    () => ms(u.assignedCodes),
    [u.assignedCodes]
  ), E = D.find((T) => T.code === y) ?? D[0];
  xe.useEffect(() => {
    E.code !== y && j(E.code);
  }, [E, y]);
  const $ = E == null ? void 0 : E.component, P = ee(), [Q, U] = x.useState(
    () => {
      var T;
      return ((T = window.localStorage) == null ? void 0 : T.getItem(Oe)) === "1";
    }
  ), [te, X] = x.useState(!1), Z = x.useCallback(() => {
    st(), s == null || s();
  }, [s]);
  at(t, Z), xe.useEffect(() => {
    f.isDirty ? b.markDirty() : b.markClean();
  });
  const z = x.useCallback(() => b.requestClose(Z), [b, Z]), G = x.useCallback(() => {
    U((T) => {
      var L;
      const I = !T;
      return (L = window.localStorage) == null || L.setItem(Oe, I ? "1" : "0"), I;
    });
  }, []), Y = ke("Platform.Tasks.Delete"), [V, F] = x.useState(!1), [h, N] = x.useState(!1), C = x.useCallback(async () => {
    var T, I, L, _, B, ue;
    N(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (L = (I = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : I.info) == null || L.call(I, "Başarıyla silindi."), F(!1), b.markClean(), Z();
    } catch (le) {
      (ue = (B = (_ = window == null ? void 0 : window.abp) == null ? void 0 : _.notify) == null ? void 0 : B.error) == null || ue.call(B, (le == null ? void 0 : le.message) || "Görev silinemedi.");
    } finally {
      N(!1);
    }
  }, [r, b, Z]), A = x.useCallback(async () => {
    var T, I, L, _, B, ue;
    if (!f.validate()) return !1;
    X(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, f.toUpdateDto())
      ), await P.invalidateQueries({ queryKey: ["task-detail", r] }), H.emitResult(), (L = (I = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : I.success) == null || L.call(I, "Kaydedildi."), !0;
    } catch (le) {
      return (ue = (B = (_ = window == null ? void 0 : window.abp) == null ? void 0 : _.notify) == null ? void 0 : B.error) == null || ue.call(B, (le == null ? void 0 : le.message) || "Kaydedilemedi."), !1;
    } finally {
      X(!1);
    }
  }, [r, f, b, P]), S = x.useCallback(() => {
    A();
  }, [A]), K = x.useCallback(async () => {
    const T = b.resolvePendingClose("save");
    await A() && (T == null || T());
  }, [b, A]), M = x.useCallback((T, I) => {
    b.requestClose(() => {
      o((L) => [...L, { id: r, title: (l == null ? void 0 : l.title) ?? "" }]), n(T), j("general"), b.markClean();
    });
  }, [b, r, l]), O = x.useCallback((T) => {
    b.requestClose(() => {
      o((I) => {
        const L = I.findIndex((_) => _.id === T);
        return L === -1 ? I : I.slice(0, L);
      }), n(T), j("general"), b.markClean();
    });
  }, [b]), W = x.useCallback(async (T) => {
    var I, L, _;
    try {
      await u.addFeature(T), j(T), p(!1);
    } catch (B) {
      (_ = (L = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : L.error) == null || _.call(L, (B == null ? void 0 : B.message) || "Özellik eklenemedi.");
    }
  }, [u]), J = x.useCallback(async (T) => {
    var I, L, _;
    try {
      await u.removeFeature(T), j((B) => B === T ? "general" : B);
    } catch (B) {
      (_ = (L = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : L.error) == null || _.call(L, (B == null ? void 0 : B.message) || "Özellik kaldırılamadı.");
    }
  }, [u]);
  xe.useEffect(() => {
    if (!v) return;
    const T = (L) => {
      w.current && !w.current.contains(L.target) && p(!1);
    }, I = (L) => {
      L.key === "Escape" && p(!1);
    };
    return document.addEventListener("mousedown", T), document.addEventListener("keydown", I), () => {
      document.removeEventListener("mousedown", T), document.removeEventListener("keydown", I);
    };
  }, [v]);
  const ne = d ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(ie, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(ie, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(ie, { className: "h-24 w-full" })
  ] }) : c ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(k, { variant: "ghost", onClick: () => m(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      It,
      {
        trail: i,
        current: { id: r, title: (l == null ? void 0 : l.title) ?? "" },
        onNavigate: O
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: w, children: [
      /* @__PURE__ */ e.jsx(
        Et,
        {
          tabs: D,
          activeCode: E.code,
          onSelect: (T) => {
            j(T), p(!1);
          },
          onOpenPicker: () => p((T) => !T),
          pickerOpen: v
        }
      ),
      v && /* @__PURE__ */ e.jsx(
        At,
        {
          entries: R,
          busyCode: u.isMutating ? u.mutatingCode : null,
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
            Ct,
            {
              values: f.values,
              errors: f.errors,
              onFieldChange: f.setField,
              assigneeOptions: g.options,
              isLoadingAssignees: g.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(x.Suspense, { fallback: /* @__PURE__ */ e.jsx(ie, { className: "h-24 w-full" }), children: $ && /* @__PURE__ */ e.jsx(
            $,
            {
              taskId: r,
              task: l,
              onOpenSubtask: M
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            Tt,
            {
              task: l,
              creatorName: g.nameById.get(l.creatorId),
              lastModifierName: g.nameById.get(l.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), q = a === "page" ? yt : ht;
  return /* @__PURE__ */ e.jsxs(
    q,
    {
      open: !0,
      fullscreen: Q,
      onRequestClose: z,
      title: l ? `Görev Detayı: ${l.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        vt,
        {
          task: l ?? { title: "Yükleniyor…" },
          canDelete: Y,
          fullscreen: Q,
          onToggleFullscreen: G,
          onClose: z,
          onDelete: () => F(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        wt,
        {
          lastSavedAt: l == null ? void 0 : l.lastModificationTime,
          isDirty: b.isDirty,
          isSaving: te,
          onCancel: z,
          onSave: S
        }
      ),
      children: [
        ne,
        b.pendingClose && /* @__PURE__ */ e.jsx(
          bs,
          {
            isSaving: te,
            onStay: () => b.resolvePendingClose("stay"),
            onDiscard: () => b.resolvePendingClose("discard"),
            onSaveAndClose: K
          }
        ),
        V && /* @__PURE__ */ e.jsx(
          fs,
          {
            taskTitle: (l == null ? void 0 : l.title) ?? "",
            busy: h,
            onCancel: () => F(!1),
            onConfirm: C
          }
        )
      ]
    }
  );
}
function fs({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [n, i] = x.useState(""), o = n.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    xt,
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
function xt({ label: t, title: a, description: s, children: r, actions: n }) {
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
function bs({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    xt,
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
function hs() {
  return /* @__PURE__ */ e.jsxs(pe, { children: [
    /* @__PURE__ */ e.jsx(fe, { asChild: !0, children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-default transition-all shadow-sm", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-lock text-[11px] text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { children: "Sınırlı erişim" }),
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[10px] ml-0.5 text-text-tertiary" })
    ] }) }),
    /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
      he,
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
          /* @__PURE__ */ e.jsx(bt, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const Se = [
  { id: 1, label: "Bekliyor", color: "bg-neutral-subtle text-text-secondary border-subtle", dot: "bg-gray-400" },
  { id: 2, label: "Sürüyor", color: "bg-warning-subtle text-warning border-warning/20", dot: "bg-warning" },
  { id: 3, label: "Testte", color: "bg-primary-subtle text-primary border-primary/20", dot: "bg-primary" },
  { id: 4, label: "Tamamlandı", color: "bg-success-subtle text-success border-success/20", dot: "bg-success" }
], Ee = [
  { id: 1, label: "Düşük", color: "text-text-secondary bg-surface-sunken", icon: "fa-arrow-down" },
  { id: 2, label: "Orta", color: "text-warning bg-warning-subtle", icon: "fa-minus" },
  { id: 3, label: "Yüksek", color: "text-negative bg-negative-subtle", icon: "fa-arrow-up" },
  { id: 4, label: "Kritik", color: "text-negative bg-negative-subtle font-bold", icon: "fa-flag" }
];
function ys({
  task: t = {},
  onClose: a,
  onToggleFullscreen: s,
  isFullscreen: r,
  presentation: n = "modal",
  onFieldChange: i = () => {
  }
}) {
  const [o, l] = x.useState(!1), [d, c] = x.useState(t.status ?? 1), [m, b] = x.useState(t.priority ?? 2), f = Se.find((v) => v.id === d) || Se[0], g = Ee.find((v) => v.id === m) || Ee[1], u = t.code || (t.id ? `#OTL-${t.id.substring(0, 4).toUpperCase()}` : "#OTL-2507"), y = () => {
    var v, p, w, D;
    (v = navigator.clipboard) == null || v.writeText(u), l(!0), (D = (w = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : w.success) == null || D.call(w, `${u} panoya kopyalandı.`), setTimeout(() => l(!1), 2e3);
  }, j = () => {
    var p, w, D, R;
    const v = `${window.location.origin}/Tasks?task=${t.id || ""}`;
    (p = navigator.clipboard) == null || p.writeText(v), (R = (D = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : D.success) == null || R.call(D, "Görev bağlantısı panoya kopyalandı!");
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
              /* @__PURE__ */ e.jsx("span", { children: u.replace("#", "") }),
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${o ? "fa-check text-success" : "fa-copy opacity-50 group-hover:opacity-100"} text-[10px] ml-0.5 transition-all` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(pe, { children: [
          /* @__PURE__ */ e.jsx(fe, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
          /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
            he,
            {
              sideOffset: 4,
              align: "start",
              className: "z-50 w-44 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95",
              children: [
                /* @__PURE__ */ e.jsx("div", { className: "text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1", children: "Durumu Değiştir" }),
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: Se.map((v) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      c(v.id), i("status", v.id);
                    },
                    className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${d === v.id ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${v.dot}` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: v.label }),
                      d === v.id && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ]
                  },
                  v.id
                )) })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ e.jsxs(pe, { children: [
          /* @__PURE__ */ e.jsx(fe, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
          /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
            he,
            {
              sideOffset: 4,
              align: "start",
              className: "z-50 w-40 rounded-xl border border-subtle bg-surface-base p-1.5 shadow-float animate-in fade-in-50 zoom-in-95",
              children: [
                /* @__PURE__ */ e.jsx("div", { className: "text-[10px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1", children: "Öncelik Seç" }),
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: Ee.map((v) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      b(v.id), i("priority", v.id);
                    },
                    className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${m === v.id ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${v.icon} text-xs` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: v.label }),
                      m === v.id && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
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
      /* @__PURE__ */ e.jsx(hs, {}),
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
        /* @__PURE__ */ e.jsxs(pe, { children: [
          /* @__PURE__ */ e.jsx(fe, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer Seçenekler",
              className: "flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
            he,
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
const Ye = {
  0: { label: "İptal", cls: "text-text-secondary bg-neutral-subtle", icon: "fa-ban" },
  1: { label: "Bekliyor", cls: "text-text-secondary bg-neutral-subtle", icon: "fa-clock" },
  2: { label: "Sürüyor", cls: "text-warning bg-warning-subtle", icon: "fa-spinner" },
  3: { label: "Testte", cls: "text-primary bg-primary-subtle", icon: "fa-flask" },
  4: { label: "Tamamlandı", cls: "text-success bg-success-subtle", icon: "fa-circle-check" }
}, qe = {
  1: { label: "Düşük", cls: "text-text-secondary bg-surface-sunken", icon: "fa-arrow-down" },
  2: { label: "Orta", cls: "text-warning bg-warning-subtle", icon: "fa-minus" },
  3: { label: "Yüksek", cls: "text-negative bg-negative-subtle", icon: "fa-arrow-up" },
  4: { label: "Kritik", cls: "text-negative bg-negative-subtle", icon: "fa-flag" }
};
function oe({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-bold text-text-tertiary uppercase tracking-wider select-none", children: t }),
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center text-[13px] text-text-primary h-8 min-w-0", children: a })
  ] });
}
function gs({
  task: t = {},
  assigneeOptions: a = [],
  onFieldChange: s = () => {
  }
}) {
  const [r, n] = x.useState(
    Array.isArray(t.tags) ? t.tags.map((p) => typeof p == "string" ? p : p == null ? void 0 : p.name).filter(Boolean) : []
  ), [i, o] = x.useState(""), [l, d] = x.useState(!1), [c, m] = x.useState(t.assigneeId ?? null), b = (p) => {
    if (p.key === "Enter" || p.type === "blur") {
      const w = i.trim();
      if (w && !r.includes(w)) {
        const D = [...r, w];
        n(D), s("tagNames", D);
      }
      o(""), d(!1);
    }
  }, f = (p) => {
    const w = r.filter((D) => D !== p);
    n(w), s("tagNames", w);
  }, g = (p) => {
    m(p), s("assigneeId", p);
  }, u = (p) => {
    if (!p) return "—";
    const w = new Date(p);
    return isNaN(w.getTime()) ? p : w.toISOString().split("T")[0];
  }, y = a.find((p) => p.value === c), j = (y == null ? void 0 : y.label) || t.assigneeName || "Atanmamış", v = `https://ui-avatars.com/api/?name=${encodeURIComponent(j)}&background=6366f1&color=fff&size=64`;
  return /* @__PURE__ */ e.jsx("div", { className: "px-[var(--apya-space-6)] py-[var(--apya-space-5)] bg-surface-base border-b border-subtle", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-y-[var(--apya-space-5)] gap-x-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsx(oe, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(pe, { children: [
      /* @__PURE__ */ e.jsx(fe, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
      /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
        he,
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
                  className: `flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-left transition-colors ${c ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary font-semibold"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "flex h-5 w-5 items-center justify-center rounded-full bg-surface-sunken text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-user-slash text-[9px]" }) }),
                    /* @__PURE__ */ e.jsx("span", { children: "Atanmamış" })
                  ]
                }
              ),
              a.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-2 py-1.5 text-[12px] text-text-tertiary", children: "Kullanıcı listesi yükleniyor…" }),
              a.map((p) => /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => g(p.value),
                  className: `flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-left transition-colors ${c === p.value ? "bg-primary-subtle text-primary font-semibold" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("img", { src: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.label)}&background=6366f1&color=fff&size=64`, alt: p.label, className: "h-5 w-5 rounded-full" }),
                    /* @__PURE__ */ e.jsx("span", { children: p.label })
                  ]
                },
                p.value
              ))
            ] })
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ e.jsx(oe, { label: "Son Tarih", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors group relative", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          value: u(t.dueDate),
          onChange: (p) => s("dueDate", p.target.value),
          className: "bg-transparent text-text-primary text-[13px] font-medium focus:outline-none cursor-pointer"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(oe, { label: "Başlangıç", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors group relative", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          value: u(t.startDate),
          onChange: (p) => s("startDate", p.target.value),
          className: "bg-transparent text-text-primary text-[13px] font-medium focus:outline-none cursor-pointer"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(oe, { label: "Öncelik", children: (() => {
      const p = qe[t.priority] || qe[2];
      return /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 text-[13px] font-medium", children: /* @__PURE__ */ e.jsxs("span", { className: `flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-semibold ${p.cls}`, children: [
        /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${p.icon} text-xs` }),
        /* @__PURE__ */ e.jsx("span", { children: p.label })
      ] }) });
    })() }),
    /* @__PURE__ */ e.jsx(oe, { label: "Durum", children: (() => {
      const p = Ye[t.status] || Ye[1];
      return /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 text-[13px] font-medium", children: /* @__PURE__ */ e.jsxs("span", { className: `flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-semibold ${p.cls}`, children: [
        /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${p.icon} text-xs` }),
        /* @__PURE__ */ e.jsx("span", { children: p.label })
      ] }) });
    })() }),
    /* @__PURE__ */ e.jsx(oe, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
      r.map((p) => /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "group inline-flex items-center gap-1 bg-primary-subtle text-primary text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors",
          children: [
            /* @__PURE__ */ e.jsx("span", { children: p }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: () => f(p),
                className: "opacity-0 group-hover:opacity-100 hover:text-negative transition-opacity ml-0.5",
                "aria-label": "Etiketi kaldır",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
              }
            )
          ]
        },
        p
      )),
      l ? /* @__PURE__ */ e.jsx(
        "input",
        {
          autoFocus: !0,
          type: "text",
          value: i,
          onChange: (p) => o(p.target.value),
          onKeyDown: b,
          onBlur: b,
          placeholder: "Etiket...",
          className: "h-6 w-16 px-1.5 text-[11px] rounded border border-primary bg-surface-base focus:outline-none"
        }
      ) : /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => d(!0),
          className: "flex items-center justify-center h-5 w-5 rounded-full bg-surface-sunken border border-subtle text-text-tertiary hover:bg-surface-hover hover:text-text-primary hover:border-primary transition-all",
          "aria-label": "Yeni etiket ekle",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[9px]" })
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(oe, { label: "Proje", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary group-hover:text-primary transition-colors text-[13px] truncate max-w-[140px]", children: t.projectName || "Projesiz" })
    ] }) })
  ] }) });
}
const vs = [
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
function js({
  assignedCodes: t = [],
  onAddFeature: a = () => {
  }
}) {
  const [s, r] = x.useState(!1), [n, i] = x.useState(""), [o, l] = x.useState(!1);
  x.useEffect(() => {
    l(!0);
  }, []);
  const d = (f) => t.includes(f), c = (f) => {
    a(f), r(!1);
  };
  x.useEffect(() => {
    const f = (g) => {
      g.key === "Escape" && s && r(!1);
    };
    return window.addEventListener("keydown", f), () => window.removeEventListener("keydown", f);
  }, [s]);
  const m = vs.map((f) => ({
    ...f,
    items: f.items.filter(
      (g) => g.title.toLowerCase().includes(n.toLowerCase()) || g.desc.toLowerCase().includes(n.toLowerCase()) || f.title.toLowerCase().includes(n.toLowerCase())
    )
  })).filter((f) => f.items.length > 0), b = s && o ? mt.createPortal(
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
                    value: n,
                    onChange: (f) => i(f.target.value),
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
                m.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-bold text-text-tertiary tracking-widest uppercase", children: f.title }),
                    /* @__PURE__ */ e.jsx("div", { className: "flex-1 h-px bg-subtle/60" })
                  ] }),
                  /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3.5", children: f.items.map((g) => {
                    const u = d(g.code);
                    return /* @__PURE__ */ e.jsxs(
                      "div",
                      {
                        onClick: () => c(g.code),
                        className: `
                                                group flex items-start gap-4 rounded-2xl border p-4 transition-all cursor-pointer select-none
                                                ${u ? "border-primary/50 bg-primary-subtle/30 shadow-xs ring-1 ring-primary/30" : "border-subtle bg-surface-base hover:border-primary/60 hover:bg-surface-hover hover:shadow-md hover:-translate-y-0.5"}
                                            `,
                        children: [
                          /* @__PURE__ */ e.jsx("div", { className: `flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${g.color} shadow-xs text-lg group-hover:scale-105 transition-transform`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${g.icon}` }) }),
                          /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0 flex-1", children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                              /* @__PURE__ */ e.jsx("span", { className: "text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors truncate", children: g.title }),
                              u ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1 text-[11px] font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded-full border border-primary/20", children: [
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
                ] }, f.title)),
                m.length === 0 && /* @__PURE__ */ e.jsxs("div", { className: "py-12 text-center flex flex-col items-center gap-2", children: [
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
        onClick: (f) => {
          f.preventDefault(), f.stopPropagation(), r(!0);
        },
        className: "flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-primary/50 bg-primary-subtle/30 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all focus:outline-none shadow-xs cursor-pointer active:scale-95",
        "aria-label": "Özellik ekle",
        title: "Özellik Ekle (+)",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-xs pointer-events-none" })
      }
    ),
    b
  ] });
}
function ws({
  activeTab: t = "general",
  onTabChange: a = () => {
  },
  visibleTabs: s = [],
  assignedCodes: r = [],
  onAddFeature: n = () => {
  }
}) {
  const i = (o) => o === "subtasks" ? 4 : o === "files" ? 8 : o === "dependencies" ? 2 : null;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-4 w-full py-1.5", children: [
    /* @__PURE__ */ e.jsx("nav", { className: "flex items-center gap-1.5 overflow-x-auto custom-scrollbar", "aria-label": "Görev Sekmeleri", children: s.map((o) => {
      const l = t === o.code, d = i(o.code);
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => a(o.code),
          className: `relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap select-none cursor-pointer ${l ? "text-primary bg-primary-subtle shadow-xs font-bold" : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"}`,
          children: [
            /* @__PURE__ */ e.jsx("span", { children: o.title }),
            d !== null && /* @__PURE__ */ e.jsx("span", { className: `flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full text-[10px] font-bold ${l ? "bg-primary text-white" : "bg-surface-sunken text-text-tertiary"}`, children: d }),
            l && /* @__PURE__ */ e.jsx("span", { className: "absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" })
          ]
        },
        o.code
      );
    }) }),
    /* @__PURE__ */ e.jsx("div", { className: "shrink-0 flex items-center", children: /* @__PURE__ */ e.jsx(
      js,
      {
        assignedCodes: r,
        onAddFeature: n
      }
    ) })
  ] });
}
function Ue({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-start py-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary text-right font-medium max-w-[150px] truncate", title: typeof a == "string" ? a : "", children: a ?? "—" })
  ] });
}
function Ve({ label: t, name: a, avatar: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-center py-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("img", { src: s, alt: a, className: "w-5 h-5 rounded-full border border-subtle object-cover" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary font-semibold", children: a })
    ] })
  ] });
}
function Ns({ task: t = {}, onDelete: a = () => {
}, nameById: s }) {
  const [r, n] = x.useState(!1), [i, o] = x.useState(!1), l = ee(), d = (y, j) => {
    var v;
    return y || j && ((v = s == null ? void 0 : s.get) == null ? void 0 : v.call(s, j)) || "Bilinmiyor";
  }, c = d(t.creatorName, t.creatorId), m = t.lastModificationTime ? d(t.lastModifierName, t.lastModifierId) : "—", b = (y) => y ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(y)) : "—", f = () => {
    var j, v, p, w;
    const y = `${window.location.origin}/Tasks?task=${t.id || ""}`;
    (j = navigator.clipboard) == null || j.writeText(y), (w = (p = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : p.success) == null || w.call(p, "Görev bağlantısı panoya kopyalandı!");
  }, g = async () => {
    var y, j, v, p, w, D, R, E, $, P, Q;
    if (!(!t || r)) {
      n(!0);
      try {
        const U = (v = (j = (y = window == null ? void 0 : window.apya) == null ? void 0 : y.platform) == null ? void 0 : j.tasks) == null ? void 0 : v.task;
        if (U) {
          const te = {
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
          }, X = await Promise.resolve(U.create(te));
          await l.invalidateQueries({ queryKey: ["task-detail"] }), (D = (w = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : w.success) == null || D.call(w, "Görev başarıyla çoğaltıldı!"), (E = (R = window.apya) == null ? void 0 : R.taskDetail) != null && E.open && X && window.apya.taskDetail.open(X);
        }
      } catch (U) {
        (Q = (P = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : P.error) == null || Q.call(P, (U == null ? void 0 : U.message) || "Görev çoğaltılamadı.");
      } finally {
        n(!1);
      }
    }
  }, u = async () => {
    var y, j, v, p, w, D, R, E, $;
    if (!(!t.id || i)) {
      o(!0);
      try {
        const P = (v = (j = (y = window == null ? void 0 : window.apya) == null ? void 0 : y.platform) == null ? void 0 : j.tasks) == null ? void 0 : v.task;
        P && (await Promise.resolve(P.updateStatus(t.id, 4)), await l.invalidateQueries({ queryKey: ["task-detail", t.id] }), (D = (w = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : w.info) == null || D.call(w, "Görev arşivlendi (Tamamlandı)."));
      } catch (P) {
        ($ = (E = (R = window == null ? void 0 : window.abp) == null ? void 0 : R.notify) == null ? void 0 : E.error) == null || $.call(E, (P == null ? void 0 : P.message) || "Görev arşivlenemedi.");
      } finally {
        o(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs flex flex-col", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary mb-2", children: "Detaylar" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col divide-y divide-subtle/50", children: [
        /* @__PURE__ */ e.jsx(
          Ve,
          {
            label: "Oluşturan",
            name: c,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c)}&background=6366f1&color=fff&size=64`
          }
        ),
        /* @__PURE__ */ e.jsx(Ue, { label: "Oluşturma Tarihi", value: b(t.creationTime) }),
        /* @__PURE__ */ e.jsx(
          Ve,
          {
            label: "Güncelleyen",
            name: m,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(m)}&background=6366f1&color=fff&size=64`
          }
        ),
        /* @__PURE__ */ e.jsx(Ue, { label: "Son Güncelleme", value: b(t.lastModificationTime) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs flex flex-col gap-2.5", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary mb-1", children: "Hızlı işlemler" }),
      /* @__PURE__ */ e.jsx(
        k,
        {
          type: "button",
          variant: "outline",
          onClick: f,
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
          onClick: u,
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
function ks({ onFormat: t = () => {
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
function Cs({ task: t = {}, onFieldChange: a = () => {
} }) {
  const s = t == null ? void 0 : t.id, r = ee(), [n, i] = x.useState(t.description || ""), o = (h, N = "") => {
    const C = document.getElementById("task-v3-desc-input");
    if (!C) return;
    const A = C.selectionStart, S = C.selectionEnd, K = n.substring(A, S) || "metin", M = `${h}${K}${N}`, O = n.substring(0, A) + M + n.substring(S);
    i(O), a("description", O);
  }, l = ot(s), [d, c] = x.useState(!0), [m, b] = x.useState(""), [f, g] = x.useState(!1), [u, y] = x.useState(!1), j = l.items ?? [], v = j.filter((h) => h.isDone || h.done).length, p = async (h) => {
    var N, C, A, S, K, M;
    if (h.key === "Enter" || h.type === "blur") {
      const O = m.trim();
      if (O && s) {
        y(!0);
        try {
          await l.addItem(O), (A = (C = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : C.success) == null || A.call(C, "Madde eklendi.");
        } catch (W) {
          (M = (K = (S = window == null ? void 0 : window.abp) == null ? void 0 : S.notify) == null ? void 0 : K.error) == null || M.call(K, (W == null ? void 0 : W.message) || "Madde eklenemedi.");
        } finally {
          y(!1);
        }
      }
      b(""), g(!1);
    }
  }, w = async (h) => {
    var N, C, A;
    if (!(typeof h == "string" && h.startsWith("mock-")))
      try {
        await l.toggleItem(h);
      } catch (S) {
        (A = (C = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : C.error) == null || A.call(C, (S == null ? void 0 : S.message) || "Durum güncellenemedi.");
      }
  }, D = async (h) => {
    var N, C, A, S, K, M;
    if (!(typeof h == "string" && h.startsWith("mock-")))
      try {
        await l.removeItem(h), (A = (C = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : C.info) == null || A.call(C, "Madde silindi.");
      } catch (O) {
        (M = (K = (S = window == null ? void 0 : window.abp) == null ? void 0 : S.notify) == null ? void 0 : K.error) == null || M.call(K, (O == null ? void 0 : O.message) || "Madde silinemedi.");
      }
  }, { data: R = [] } = ae({
    queryKey: ["task-comments", s],
    queryFn: async () => {
      var N, C, A;
      const h = (A = (C = (N = window == null ? void 0 : window.apya) == null ? void 0 : N.platform) == null ? void 0 : C.tasks) == null ? void 0 : A.task;
      return !h || !s ? [] : await Promise.resolve(h.getComments(s));
    },
    enabled: !!s,
    staleTime: 1e4
  }), [E, $] = x.useState(""), [P, Q] = x.useState(!0), [U, te] = x.useState(!1), [X, Z] = x.useState(null), [z, G] = x.useState(""), Y = R.length > 0 ? R : t.comments ?? [], V = async (h) => {
    var C, A, S, K, M, O, W, J, ne;
    h.preventDefault();
    const N = E.trim();
    if (!(!N || !s)) {
      te(!0);
      try {
        const q = (S = (A = (C = window == null ? void 0 : window.apya) == null ? void 0 : C.platform) == null ? void 0 : A.tasks) == null ? void 0 : S.task;
        q && (await Promise.resolve(q.addComment(s, N)), await r.invalidateQueries({ queryKey: ["task-comments", s] }), await r.invalidateQueries({ queryKey: ["task-detail", s] }), (O = (M = (K = window == null ? void 0 : window.abp) == null ? void 0 : K.notify) == null ? void 0 : M.success) == null || O.call(M, "Yorum gönderildi.")), $("");
      } catch (q) {
        (ne = (J = (W = window == null ? void 0 : window.abp) == null ? void 0 : W.notify) == null ? void 0 : J.error) == null || ne.call(J, (q == null ? void 0 : q.message) || "Yorum gönderilemedi.");
      } finally {
        te(!1);
      }
    }
  }, F = async (h) => {
    var C, A, S, K, M, O, W, J, ne;
    const N = z.trim();
    if (!(!N || !s))
      try {
        const q = (S = (A = (C = window == null ? void 0 : window.apya) == null ? void 0 : C.platform) == null ? void 0 : A.tasks) == null ? void 0 : S.task;
        q && (await Promise.resolve(q.replyToComment(h, N)), await r.invalidateQueries({ queryKey: ["task-comments", s] }), (O = (M = (K = window == null ? void 0 : window.abp) == null ? void 0 : K.notify) == null ? void 0 : M.success) == null || O.call(M, "Yanıt gönderildi.")), G(""), Z(null);
      } catch (q) {
        (ne = (J = (W = window == null ? void 0 : window.abp) == null ? void 0 : W.notify) == null ? void 0 : J.error) == null || ne.call(J, (q == null ? void 0 : q.message) || "Yanıt gönderilemedi.");
      }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-2.5", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary", children: "Açıklama" }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-subtle bg-surface-base focus-within:border-primary focus-within:shadow-focus transition-all overflow-hidden shadow-xs", children: [
        /* @__PURE__ */ e.jsx(ks, { onFormat: o }),
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            id: "task-v3-desc-input",
            className: "w-full min-h-[110px] p-4 text-[14px] leading-relaxed text-text-primary bg-transparent focus:outline-none resize-y font-sans",
            value: n,
            onChange: (h) => {
              i(h.target.value), a("description", h.target.value);
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
              j.length > 0 && /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-text-tertiary bg-surface-sunken px-2 py-0.5 rounded-full", children: [
                v,
                "/",
                j.length
              ] })
            ] }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "text-text-tertiary group-hover:text-text-primary transition-colors", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid fa-chevron-up transition-transform duration-200 ${d ? "" : "rotate-180"}` }) })
          ]
        }
      ),
      d && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2.5 animate-in fade-in-50", children: [
        j.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden mb-1", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full bg-success transition-all duration-300",
            style: { width: `${v / j.length * 100}%` }
          }
        ) }),
        j.map((h) => {
          const N = h.isDone ?? h.done ?? !1;
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
                      onChange: () => w(h.id),
                      className: "h-4 w-4 rounded border-subtle text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `text-[13px] transition-all truncate ${N ? "line-through text-text-tertiary font-normal" : "text-text-primary font-medium"}`, children: h.text })
                ] }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => D(h.id),
                    className: "opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-negative transition-all p-1",
                    title: "Maddeyi Sil",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-trash-can text-xs" })
                  }
                )
              ]
            },
            h.id
          );
        }),
        f ? /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 mt-1", children: /* @__PURE__ */ e.jsx(
          "input",
          {
            autoFocus: !0,
            type: "text",
            value: m,
            onChange: (h) => b(h.target.value),
            onKeyDown: p,
            onBlur: p,
            disabled: u,
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
        /* @__PURE__ */ e.jsxs("form", { onSubmit: V, className: "flex gap-3 items-start", children: [
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
                onChange: (h) => $(h.target.value),
                placeholder: "Bir yorum yazın... (@bahset, #görev)",
                rows: 2,
                className: "w-full p-3 text-[13px] bg-transparent focus:outline-none resize-none text-text-primary",
                onKeyDown: (h) => {
                  h.key === "Enter" && (h.ctrlKey || h.metaKey) && V(h);
                }
              }
            ),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-t border-subtle/50 bg-surface-base", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 text-text-tertiary", children: [
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => $((h) => h + " [Dosya] "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Dosya Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => $((h) => h + " [Görsel] "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Resim Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-image text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => $((h) => h + " 👍 "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Emoji", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-face-smile text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => $((h) => h + " @Yakup B. "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Bahset (@)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-at text-xs" }) })
              ] }),
              /* @__PURE__ */ e.jsx(
                k,
                {
                  type: "submit",
                  size: "sm",
                  disabled: !E.trim() || U,
                  isLoading: U,
                  className: "bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 h-8 rounded-lg shadow-sm",
                  icon: "fa-paper-plane",
                  children: "Gönder"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-4 divide-y divide-subtle/50", children: Y.map((h) => {
          const N = h.creatorName || h.author || "Yakup B.", C = `https://ui-avatars.com/api/?name=${encodeURIComponent(N)}&background=6366f1&color=fff&size=64`, A = h.creationTime ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(h.creationTime)) : h.date || "10.07.2026 09:30";
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-3 pt-3 items-start first:pt-0", children: [
            /* @__PURE__ */ e.jsx("img", { src: C, alt: N, className: "h-8 w-8 rounded-full border border-subtle shrink-0 object-cover" }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col gap-1", children: [
              /* @__PURE__ */ e.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: N }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary font-mono", children: A })
              ] }) }),
              /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap", children: h.text.split(" ").map((S, K) => S.startsWith("@") ? /* @__PURE__ */ e.jsxs("span", { className: "font-semibold text-primary bg-primary-subtle px-1 py-0.5 rounded mr-1", children: [
                S,
                " "
              ] }, K) : S + " ") }),
              /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-4 mt-1", children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => Z(X === h.id ? null : h.id),
                  className: "text-xs font-semibold text-text-tertiary hover:text-primary transition-colors flex items-center gap-1",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                    /* @__PURE__ */ e.jsx("span", { children: "Yanıtla" })
                  ]
                }
              ) }),
              X === h.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex gap-2 items-center animate-in fade-in-50", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: z,
                    onChange: (S) => G(S.target.value),
                    placeholder: `@${N} kullanıcısına yanıt ver...`,
                    onKeyDown: (S) => {
                      S.key === "Enter" && F(h.id);
                    },
                    className: "flex-1 h-8 px-3 text-[12px] rounded-lg border border-primary bg-surface-base focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(k, { size: "sm", onClick: () => F(h.id), className: "h-8 text-xs bg-primary text-white", children: "Yanıtla" })
              ] })
            ] })
          ] }, h.id);
        }) })
      ] })
    ] })
  ] });
}
function Ts({
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
const _e = "apya.taskDetail.fullscreen";
function ut({
  taskId: t,
  presentation: a = "modal",
  onClose: s,
  switchToTask: r
}) {
  const [n, i] = x.useState(t), { data: o, isLoading: l, isError: d, refetch: c } = Xe(n), m = ee(), b = et(), f = rt(o), g = it(), u = nt(n), [y, j] = x.useState("general"), [v, p] = x.useState(!1), [w, D] = x.useState(() => {
    try {
      return localStorage.getItem(_e) === "true";
    } catch {
      return !1;
    }
  });
  at(n), xe.useEffect(() => {
    f.isDirty ? b.markDirty() : b.markClean();
  });
  const R = x.useCallback(() => {
    st(), s == null || s();
  }, [s]), E = x.useCallback(() => b.requestClose(R), [b, R]), $ = x.useCallback(() => {
    D((z) => {
      const G = !z;
      try {
        localStorage.setItem(_e, String(G));
      } catch {
      }
      return G;
    });
  }, []), P = x.useMemo(
    () => ct(u.assignedCodes),
    [u.assignedCodes]
  ), Q = Re.find((z) => z.code === y) || P.find((z) => z.code === y) || P[0], U = x.useCallback(async () => {
    var z, G, Y, V, F, h;
    if (!f.validate()) return !1;
    p(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(n, f.toUpdateDto())
      ), await m.invalidateQueries({ queryKey: ["task-detail", n] }), H.emitResult(), (Y = (G = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : G.success) == null || Y.call(G, "Görev başarıyla güncellendi."), !0;
    } catch (N) {
      return (h = (F = (V = window == null ? void 0 : window.abp) == null ? void 0 : V.notify) == null ? void 0 : F.error) == null || h.call(F, (N == null ? void 0 : N.message) || "Kaydedilemedi."), !1;
    } finally {
      p(!1);
    }
  }, [n, f, m]), te = x.useCallback(async () => {
    var z, G, Y, V, F, h;
    if (window.confirm("Bu görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.delete(n)), (Y = (G = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : G.info) == null || Y.call(G, "Görev silindi."), b.markClean(), R();
      } catch (N) {
        (h = (F = (V = window == null ? void 0 : window.abp) == null ? void 0 : V.notify) == null ? void 0 : F.error) == null || h.call(F, (N == null ? void 0 : N.message) || "Görev silinemedi.");
      }
  }, [n, b, R]), X = x.useCallback(async (z) => {
    var G, Y, V, F, h, N;
    try {
      await u.addFeature(z), j(z), (V = (Y = (G = window == null ? void 0 : window.abp) == null ? void 0 : G.notify) == null ? void 0 : Y.success) == null || V.call(Y, "Özellik başarıyla eklendi.");
    } catch (C) {
      (N = (h = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : h.error) == null || N.call(h, (C == null ? void 0 : C.message) || "Özellik eklenemedi.");
    }
  }, [u]), Z = l ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(ie, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(ie, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(ie, { className: "h-64 w-full" })
  ] }) : d ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(k, { variant: "ghost", onClick: () => c(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      ys,
      {
        task: o,
        onClose: E,
        isFullscreen: w,
        onToggleFullscreen: $,
        presentation: a,
        onFieldChange: f.setField
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "overflow-y-auto max-h-[85vh] custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        gs,
        {
          task: o,
          assigneeOptions: g.options,
          onFieldChange: f.setField
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "border-b border-subtle px-6 bg-surface-base", children: /* @__PURE__ */ e.jsx(
        ws,
        {
          activeTab: y,
          onTabChange: j,
          visibleTabs: P,
          assignedCodes: u.assignedCodes,
          onAddFeature: X
        }
      ) }),
      /* @__PURE__ */ e.jsx("div", { className: "p-6", children: y === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start", children: [
        /* @__PURE__ */ e.jsx("div", { className: "min-w-0 space-y-6", children: /* @__PURE__ */ e.jsx(
          Cs,
          {
            task: o,
            onFieldChange: f.setField
          }
        ) }),
        /* @__PURE__ */ e.jsx("div", { className: "w-full shrink-0", children: /* @__PURE__ */ e.jsx(
          Ns,
          {
            task: o,
            onDelete: te,
            nameById: g.nameById
          }
        ) })
      ] }) : /* @__PURE__ */ e.jsx(x.Suspense, { fallback: /* @__PURE__ */ e.jsx(ie, { className: "h-48 w-full" }), children: Q != null && Q.component ? /* @__PURE__ */ e.jsx(
        Q.component,
        {
          taskId: n,
          task: o,
          onOpenSubtask: r
        }
      ) : /* @__PURE__ */ e.jsxs("div", { className: "text-center py-12 text-text-tertiary border border-dashed border-subtle rounded-xl", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-person-digging text-4xl mb-4 opacity-50" }),
        /* @__PURE__ */ e.jsx("p", { children: "Bu sekme yapım aşamasında." })
      ] }) }) })
    ] }),
    /* @__PURE__ */ e.jsx(
      Ts,
      {
        lastSavedAt: o == null ? void 0 : o.lastModificationTime,
        isDirty: b.isDirty,
        isSaving: v,
        onCancel: E,
        onSave: U
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsx("div", { className: "w-full max-w-6xl mx-auto my-6 rounded-2xl border border-subtle bg-surface-base shadow-sm overflow-hidden", children: Z }) : /* @__PURE__ */ e.jsx(
    We,
    {
      open: !0,
      onOpenChange: (z) => {
        z || E();
      },
      children: /* @__PURE__ */ e.jsx(
        Je,
        {
          title: o != null && o.title ? `Görev Detayı: ${o.title}` : "Görev Detayı",
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
function Ds() {
  var a;
  const t = x.useSyncExternalStore(
    H.subscribe,
    H.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(we, { children: /* @__PURE__ */ e.jsx(
    ut,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        H.close(), H.emitResult();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(we, { children: /* @__PURE__ */ e.jsx(
    dt,
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
function Ss() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v2" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : !(window.localStorage.getItem("apya.taskDetail.v2") === "0");
  } catch {
    return !0;
  }
}
function Es() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v3" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v2" || new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : window.localStorage.getItem("apya.taskDetail.v3") === "1" || !0;
  } catch {
    return !0;
  }
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = Es();
window.apya.taskDetailV2Enabled = Ss() && !window.apya.taskDetailV3Enabled;
const Qe = {
  open: (t) => {
    H.open(t);
  },
  close: () => H.close(),
  onResult: (t) => H.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(Qe) : window.apya.taskDetail = Qe;
function He() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = Ze(t), t._reactRoot.render(/* @__PURE__ */ e.jsx(Ds, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = tt();
    a && H.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", He) : He();
function zs({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(we, { children: /* @__PURE__ */ e.jsx(
    ut,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(we, { children: /* @__PURE__ */ e.jsx(
    dt,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) });
}
const ze = document.getElementById("task-detail-page-island");
if (ze) {
  const t = ze.getAttribute("data-task-id");
  t && Ze(ze).render(/* @__PURE__ */ e.jsx(zs, { taskId: t }));
}
