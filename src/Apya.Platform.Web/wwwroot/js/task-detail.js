import { j as e, r as x, d as xe, a as pt, b as Ze } from "./react-vendor.js";
/* empty css      */
import { a as Ne } from "./QueryProvider.js";
import { u as ae, a as te, b as se } from "./query-vendor.js";
import { D as We, l as Je, e as ke, B as C, I as ce, S as ie } from "./Dialog.js";
import { C as ft } from "./Combobox.js";
import { r as bt } from "./httpClient.js";
import { R as pe, T as fe, P as be, C as he, A as ht } from "./ui-vendor.js";
function yt({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: i,
  footer: n,
  children: l
}) {
  return /* @__PURE__ */ e.jsx(
    We,
    {
      open: t,
      onOpenChange: (o) => {
        o || a();
      },
      children: /* @__PURE__ */ e.jsx(
        Je,
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
            i,
            /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: l }),
            n
          ] })
        }
      )
    }
  );
}
function gt({ title: t, header: a, footer: s, children: r }) {
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
function vt({ isPrivate: t }) {
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
function jt({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: i,
  fullscreen: n = !1
}) {
  const [l, o] = x.useState(!1), d = x.useRef(null);
  x.useEffect(() => {
    if (!l) return;
    const g = (y) => {
      d.current && !d.current.contains(y.target) && o(!1);
    }, u = (y) => {
      y.key === "Escape" && o(!1);
    };
    return document.addEventListener("mousedown", g), document.addEventListener("keydown", u), () => {
      document.removeEventListener("mousedown", g), document.removeEventListener("keydown", u);
    };
  }, [l]);
  const c = ye[t == null ? void 0 : t.status] ?? ye[1], m = Ae[t == null ? void 0 : t.priority] ?? Ae[2], b = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), o(!1);
  }, f = () => {
    var u, y, v, w;
    const g = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (u = navigator.clipboard) == null || u.writeText(g), (w = (v = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : v.info) == null || w.call(v, "Bağlantı kopyalandı."), o(!1);
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
        /* @__PURE__ */ e.jsx(vt, { isPrivate: t == null ? void 0 : t.isPrivate })
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
const wt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function Nt({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: i }) {
  const n = wt(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: n ? `Son kayıt: ${n}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(C, { variant: "secondary", onClick: r, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        C,
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
const Pe = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", kt = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function re({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function Ct({ value: t, onChange: a }) {
  const [s, r] = x.useState(""), i = () => {
    const n = s.trim();
    n && !t.includes(n) && a([...t, n]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((n) => /* @__PURE__ */ e.jsxs(ke, { variant: "neutral", children: [
      n,
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${n} etiketini kaldır`,
          onClick: () => a(t.filter((l) => l !== n)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, n)) }),
    /* @__PURE__ */ e.jsx(
      ce,
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
function Tt({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: i = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(re, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      ce,
      {
        id: "task-title",
        value: t.title,
        onChange: (n) => s("title", n.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(re, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (n) => s("status", Number(n.target.value)),
          className: Pe,
          children: Object.entries(ye).map(([n, l]) => /* @__PURE__ */ e.jsx("option", { value: n, children: l.text }, n))
        }
      ) }),
      /* @__PURE__ */ e.jsx(re, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (n) => s("priority", Number(n.target.value)),
          className: Pe,
          children: Object.entries(Ae).map(([n, l]) => /* @__PURE__ */ e.jsx("option", { value: n, children: l.text }, n))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(re, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      ft,
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
      /* @__PURE__ */ e.jsx(re, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        ce,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (n) => s("startDate", n.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(re, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        ce,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (n) => s("dueDate", n.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(re, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(Ct, { value: t.tagNames, onChange: (n) => s("tagNames", n) }) }),
    /* @__PURE__ */ e.jsx(re, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (n) => s("description", n.target.value),
        className: kt
      }
    ) })
  ] });
}
const $e = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function me({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function Dt({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(me, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(me, { label: "Oluşturulma zamanı", value: $e(t.creationTime) }),
      /* @__PURE__ */ e.jsx(me, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(me, { label: "Son güncelleme zamanı", value: $e(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(me, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const St = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", Et = "border-brand-500 text-text-primary";
function zt({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: i }) {
  const n = x.useRef(/* @__PURE__ */ new Map()), l = (d) => {
    var c;
    s(d.code), (c = n.current.get(d.code)) == null || c.focus();
  }, o = (d, c) => {
    d.key === "ArrowRight" ? (d.preventDefault(), l(t[(c + 1) % t.length])) : d.key === "ArrowLeft" ? (d.preventDefault(), l(t[(c - 1 + t.length) % t.length])) : d.key === "Home" ? (d.preventDefault(), l(t[0])) : d.key === "End" && (d.preventDefault(), l(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((d, c) => {
      const m = d.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (b) => {
            b ? n.current.set(d.code, b) : n.current.delete(d.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${d.code}`,
          "aria-selected": m,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: m ? 0 : -1,
          onClick: () => s(d.code),
          onKeyDown: (b) => o(b, c),
          className: `${St} ${m ? Et : ""}`,
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
const At = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function It({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [i, n] = x.useState(""), l = x.useMemo(() => {
    const o = i.trim().toLocaleLowerCase("tr-TR"), d = o ? t.filter((m) => m.title.toLocaleLowerCase("tr-TR").includes(o)) : t, c = /* @__PURE__ */ new Map();
    return d.forEach((m) => {
      const b = c.get(m.category) ?? [];
      b.push(m), c.set(m.category, b);
    }), c;
  }, [t, i]);
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
            value: i,
            onChange: (o) => n(o.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          l.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...l.entries()].map(([o, d]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: At[o] ?? o }),
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
          ] }, o))
        ] })
      ]
    }
  );
}
function Rt({ trail: t = [], current: a, onNavigate: s }) {
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
  var s, r, i;
  const a = (i = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : i.task;
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
function et(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
function tt() {
  const [t, a] = x.useState(!1), [s, r] = x.useState(!1), i = x.useRef(null), n = x.useCallback(() => a(!0), []), l = x.useCallback(() => a(!1), []);
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
    i.current = c ?? null, r(!0);
  }, [t]), d = x.useCallback((c) => {
    const m = i.current;
    return r(!1), i.current = null, c === "discard" && (a(!1), m == null || m()), c === "save" ? m : null;
  }, []);
  return { isDirty: t, markDirty: n, markClean: l, requestClose: o, pendingClose: s, resolvePendingClose: d };
}
const Pt = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, Re = "task";
function st() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(Re);
  return t && Pt.test(t) ? t : null;
}
function at() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(Re), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function rt(t, a) {
  const s = x.useRef(a);
  s.current = a, x.useEffect(() => {
    if (!t || st() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(Re, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), x.useEffect(() => {
    const r = () => {
      var i;
      (i = s.current) == null || i.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const $t = {
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
function Ft(t) {
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
  } : $t;
}
function it(t) {
  const [a, s] = x.useState(t == null ? void 0 : t.id), r = x.useMemo(() => Ft(t), [t]), [i, n] = x.useState(r), [l, o] = x.useState({});
  (t == null ? void 0 : t.id) !== a && (s(t == null ? void 0 : t.id), n(r), o({}));
  const d = x.useCallback((g, u) => {
    n((y) => ({ ...y, [g]: u }));
  }, []), c = x.useMemo(
    () => JSON.stringify(i) !== JSON.stringify(r),
    [i, r]
  ), m = x.useCallback(() => {
    const g = {};
    return i.title.trim() || (g.title = "Başlık zorunlu."), i.startDate || (g.startDate = "Başlangıç tarihi zorunlu."), i.dueDate && i.startDate && i.dueDate < i.startDate && (g.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), o(g), Object.keys(g).length === 0;
  }, [i]), b = x.useCallback(() => ({
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
    isPrivate: !!i.isPrivate,
    predecessorIds: (t == null ? void 0 : t.predecessorIds) ?? [],
    tagNames: i.tagNames
  }), [i, t]), f = x.useCallback(() => {
    n(r), o({});
  }, [r]);
  return { values: i, setField: d, isDirty: c, errors: l, validate: m, toUpdateDto: b, reset: f };
}
function Fe(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function Gt() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function nt() {
  var i;
  const t = ae({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Gt,
    staleTime: 3e5,
    retry: !1
  }), a = ((i = t.data) == null ? void 0 : i.items) ?? [], s = a.map((n) => ({ value: n.id, label: Fe(n) })), r = new Map(a.map((n) => [n.id, Fe(n)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function Ie() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Kt(t) {
  const a = Ie();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function lt(t) {
  const a = te(), s = ["task-features", t], r = ae({
    queryKey: s,
    queryFn: () => Kt(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), n = se({
    mutationFn: (o) => Promise.resolve(Ie().addFeature(t, o)),
    onSuccess: i
  }), l = se({
    mutationFn: (o) => Promise.resolve(Ie().removeFeature(t, o)),
    onSuccess: i
  });
  return {
    assignedCodes: r.data ?? [],
    isLoading: r.isLoading,
    addFeature: n.mutateAsync,
    removeFeature: l.mutateAsync,
    mutatingCode: n.variables ?? l.variables ?? null,
    isMutating: n.isPending || l.isPending
  };
}
function Bt({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, i] = x.useState(""), [n, l] = x.useState(!1), [o, d] = x.useState(null), c = te(), m = (a == null ? void 0 : a.subTasks) ?? [], b = () => c.invalidateQueries({ queryKey: ["task-detail", t] }), f = async () => {
    var y, v, w;
    const u = r.trim();
    if (u) {
      l(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: u,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), i(""), await b();
      } catch (p) {
        (w = (v = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : v.error) == null || w.call(v, (p == null ? void 0 : p.message) || "Alt görev eklenemedi.");
      } finally {
        l(!1);
      }
    }
  }, g = async (u) => {
    var y, v, w;
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(u)), await b();
    } catch (p) {
      (w = (v = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : v.error) == null || w.call(v, (p == null ? void 0 : p.message) || "Alt görev silinemedi.");
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
          onChange: (u) => i(u.target.value),
          onKeyDown: (u) => {
            u.key === "Enter" && f();
          },
          placeholder: "Yeni alt görev başlığı",
          disabled: n
        }
      ),
      /* @__PURE__ */ e.jsx(C, { variant: "secondary", onClick: f, disabled: n || !r.trim(), children: "Alt Görev Ekle" })
    ] }),
    m.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz alt görev yok." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: m.map((u) => {
      var y, v;
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
          /* @__PURE__ */ e.jsx(ke, { variant: ((y = ye[u.status]) == null ? void 0 : y.variant) ?? "neutral", children: ((v = ye[u.status]) == null ? void 0 : v.text) ?? u.status }),
          o === u.id ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary", children: "Emin misiniz?" }),
            /* @__PURE__ */ e.jsx(C, { variant: "destructive", onClick: () => g(u.id), children: "Evet, sil" }),
            /* @__PURE__ */ e.jsx(C, { variant: "ghost", onClick: () => d(null), children: "Vazgeç" })
          ] }) : /* @__PURE__ */ e.jsx(C, { variant: "ghost", onClick: () => d(u.id), "aria-label": `${u.title} alt görevini sil`, children: "Sil" })
        ] })
      ] }, u.id);
    }) })
  ] });
}
function ot() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Mt(t) {
  const a = ot();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function Ot(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, i = bt();
  i && (r.RequestVerificationToken = i);
  const n = await fetch(`/api/tasks/attachments/upload/${t}`, {
    method: "POST",
    credentials: "include",
    headers: r,
    body: s
  });
  let l = null;
  try {
    l = await n.json();
  } catch {
  }
  if (!n.ok || (l == null ? void 0 : l.success) === !1)
    throw new Error((l == null ? void 0 : l.error) || "Dosya yüklenemedi.");
  return l;
}
function Yt(t) {
  const a = te(), s = ["task-attachments", t], r = ae({
    queryKey: s,
    queryFn: () => Mt(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), n = se({
    mutationFn: (o) => Ot(t, o),
    onSuccess: i
  }), l = se({
    mutationFn: (o) => Promise.resolve(ot().deleteAttachment(o)),
    onSuccess: i
  });
  return {
    attachments: r.data ?? [],
    isLoading: r.isLoading,
    upload: n.mutateAsync,
    remove: l.mutateAsync,
    isUploading: n.isPending
  };
}
function qt(t) {
  return `${Math.round(t / 1024)} KB`;
}
function Ut({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: i } = Yt(t), n = x.useRef(null), l = async (d) => {
    var m, b, f, g, u, y, v;
    const c = (m = d.target.files) == null ? void 0 : m[0];
    if (c)
      try {
        await s(c), (g = (f = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : f.success) == null || g.call(f, "Dosya yüklendi.");
      } catch (w) {
        (v = (y = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : y.error) == null || v.call(y, (w == null ? void 0 : w.message) || "Dosya yüklenemedi.");
      } finally {
        n.current && (n.current.value = "");
      }
  }, o = async (d, c) => {
    var m, b, f;
    try {
      await r(d);
    } catch (g) {
      (f = (b = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : b.error) == null || f.call(b, (g == null ? void 0 : g.message) || `${c} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("input", { ref: n, type: "file", onChange: l, className: "text-sm", disabled: i }),
      i && /* @__PURE__ */ e.jsx("span", { className: "text-sm text-text-tertiary", children: "Yükleniyor…" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: a.map((d) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between py-2", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("a", { href: d.downloadUrl, target: "_blank", rel: "noreferrer", className: "text-sm font-medium text-text-primary hover:underline", children: d.fileName }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-text-tertiary", children: [
          qt(d.fileSize),
          " — ",
          d.uploaderName
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(C, { variant: "ghost", onClick: () => o(d.id, d.fileName), "aria-label": `${d.fileName} dosyasini sil`, children: "Sil" })
    ] }, d.id)) })
  ] });
}
function je() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function _t(t) {
  const a = je();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ct(t) {
  const a = te(), s = ["task-checklist", t], r = ae({
    queryKey: s,
    queryFn: () => _t(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), n = se({
    mutationFn: (d) => Promise.resolve(je().addChecklistItem(t, d)),
    onSuccess: i
  }), l = se({
    mutationFn: (d) => Promise.resolve(je().toggleChecklistItem(d)),
    onSuccess: i
  }), o = se({
    mutationFn: (d) => Promise.resolve(je().deleteChecklistItem(d)),
    onSuccess: i
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: n.mutateAsync,
    toggleItem: l.mutateAsync,
    removeItem: o.mutateAsync
  };
}
function Vt({ taskId: t }) {
  const { items: a, addItem: s, toggleItem: r, removeItem: i } = ct(t), [n, l] = x.useState(""), o = async () => {
    var b, f, g;
    const m = n.trim();
    if (m)
      try {
        await s(m), l("");
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
      await i(m);
    } catch (y) {
      (u = (g = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : g.error) == null || u.call(g, (y == null ? void 0 : y.message) || `${b} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        ce,
        {
          value: n,
          onChange: (m) => l(m.target.value),
          onKeyDown: (m) => {
            m.key === "Enter" && o();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ e.jsx(C, { variant: "secondary", onClick: o, disabled: !n.trim(), children: "Ekle" })
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
      /* @__PURE__ */ e.jsx(C, { variant: "ghost", onClick: () => c(m.id, m.text), "aria-label": `${m.text} maddesini sil`, children: "Sil" })
    ] }, m.id)) })
  ] });
}
function Qt({ taskId: t, task: a }) {
  const [s, r] = x.useState(""), [i, n] = x.useState(null), [l, o] = x.useState(""), [d, c] = x.useState(!1), m = te(), b = (a == null ? void 0 : a.comments) ?? [], f = async (u) => {
    var y, v, w, p, N, L;
    if (u == null || u.preventDefault(), !(!s.trim() || d)) {
      c(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), m.invalidateQueries({ queryKey: ["task-detail", t] }), (w = (v = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : v.success) == null || w.call(v, "Yorum eklendi.");
      } catch ($) {
        (L = (N = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : N.error) == null || L.call(N, ($ == null ? void 0 : $.message) || "Yorum eklenemedi.");
      } finally {
        c(!1);
      }
    }
  }, g = async (u) => {
    var y, v, w, p, N, L;
    if (!(!l.trim() || d)) {
      c(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(u, l.trim())
        ), o(""), n(null), m.invalidateQueries({ queryKey: ["task-detail", t] }), (w = (v = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : v.success) == null || w.call(v, "Yanıt eklendi.");
      } catch ($) {
        (L = (N = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : N.error) == null || L.call(N, ($ == null ? void 0 : $.message) || "Yanıt eklenemedi.");
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
        C,
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
        C,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => n(i === u.id ? null : u.id),
          children: "Yanıtla"
        }
      ) }),
      i === u.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
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
          /* @__PURE__ */ e.jsx(C, { variant: "ghost", size: "sm", onClick: () => n(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(C, { variant: "primary", size: "sm", disabled: !l.trim() || d, onClick: () => g(u.id), children: "Gönder" })
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
function Ht({ task: t }) {
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
function Zt({ task: t }) {
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
function ge(t, a) {
  const s = a || "TRY";
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: s, minimumFractionDigits: 2 }).format(t || 0);
  } catch {
    return `${(t || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${s}`.trim();
  }
}
function Wt(t) {
  if (!t) return "";
  const a = new Date(t);
  return isNaN(a.getTime()) ? "" : new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(a);
}
function Jt({ task: t }) {
  const a = (t == null ? void 0 : t.expenses) || [], s = (t == null ? void 0 : t.incomes) || [];
  if (a.length === 0 && s.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 border-b border-subtle pb-4 mb-4", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-coins text-success text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Görev Finansı" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)." })
    ] });
  const i = Array.from(new Set([...a, ...s].map((l) => l.currency || "TRY"))).map((l) => {
    const o = s.filter((c) => (c.currency || "TRY") === l).reduce((c, m) => c + (m.amount || 0), 0), d = a.filter((c) => (c.currency || "TRY") === l).reduce((c, m) => c + (m.amount || 0), 0);
    return { cur: l, inc: o, exp: d, net: o - d };
  }), n = [
    ...s.map((l) => ({ ...l, kind: "income" })),
    ...a.map((l) => ({ ...l, kind: "expense" }))
  ].sort((l, o) => new Date(o.date || 0) - new Date(l.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs flex flex-col gap-5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-coins text-success text-base" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Görev Finansı" })
    ] }),
    i.map(({ cur: l, inc: o, exp: d, net: c }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
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
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col divide-y divide-subtle/50 rounded-xl border border-subtle overflow-hidden", children: n.map((l) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-3.5 py-2.5 bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
        /* @__PURE__ */ e.jsx("span", { className: `flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${l.kind === "income" ? "text-success bg-success-subtle" : "text-negative bg-negative-subtle"}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l.kind === "income" ? "fa-plus" : "fa-minus"}` }) }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-medium text-text-primary truncate", children: l.title || (l.kind === "income" ? "Gelir" : "Gider") }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: Wt(l.date) })
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
const Xt = { 0: 0, 1: 0, 2: 50, 3: 75, 4: 100 }, es = { 0: "bg-neutral-400", 1: "bg-text-tertiary", 2: "bg-warning", 3: "bg-primary", 4: "bg-success" };
function Ce(t) {
  if (!t) return null;
  const a = new Date(t);
  return isNaN(a.getTime()) ? null : a;
}
function Ge(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
}
function ts({ task: t = {} }) {
  const a = x.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((n, l) => ({
    id: n.id || `row-${l}`,
    name: n.title || "Başlıksız görev",
    isMain: !!n.__main,
    start: Ce(n.startDate),
    end: Ce(n.dueDate) || Ce(n.completedDate),
    status: n.status ?? 1
  })), [t]), { min: s, span: r } = x.useMemo(() => {
    const i = a.flatMap((o) => [o.start, o.end]).filter(Boolean).map((o) => o.getTime());
    if (i.length === 0) return { min: null, span: 0 };
    const n = Math.min(...i), l = Math.max(...i);
    return { min: n, span: Math.max(1, l - n) };
  }, [a]);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-bars-staggered text-primary text-base" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Gantt Zaman Çizelgesi" })
    ] }),
    s === null ? /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Zaman çizelgesi için görevde veya alt görevlerde başlangıç–bitiş tarihi tanımlı olmalı." }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: a.map((i) => {
      const n = i.start ? i.start.getTime() : s, l = i.end ? Math.max(i.end.getTime(), n) : n, o = (n - s) / r * 100, d = Math.max(2, (l - n) / r * 100), c = Xt[i.status] ?? 0, m = es[i.status] || "bg-primary";
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: `flex flex-col gap-1.5 p-3 rounded-xl border transition-all ${i.isMain ? "bg-primary-subtle/30 border-primary/20" : "bg-surface-sunken/40 border-subtle/50 hover:bg-surface-hover/60"}`,
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-[13px]", children: [
              /* @__PURE__ */ e.jsx("span", { className: `truncate ${i.isMain ? "font-bold text-text-primary" : "font-semibold text-text-secondary"}`, children: i.name }),
              /* @__PURE__ */ e.jsxs("span", { className: "text-xs text-text-tertiary font-mono shrink-0 ml-2", children: [
                Ge(i.start),
                " – ",
                Ge(i.end)
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "relative w-full h-3 bg-surface-base rounded-full overflow-hidden border border-subtle", children: [
              /* @__PURE__ */ e.jsx("div", { className: `absolute top-0 h-full ${m} rounded-full opacity-30`, style: { left: `${o}%`, width: `${d}%` } }),
              /* @__PURE__ */ e.jsx("div", { className: `absolute top-0 h-full ${m} rounded-full`, style: { left: `${o}%`, width: `${d * c / 100}%` } })
            ] })
          ]
        },
        i.id
      );
    }) })
  ] });
}
const ss = {
  0: { label: "İptal", cls: "text-text-secondary bg-neutral-subtle" },
  1: { label: "Bekliyor", cls: "text-text-secondary bg-neutral-subtle" },
  2: { label: "Sürüyor", cls: "text-warning bg-warning-subtle" },
  3: { label: "Testte", cls: "text-primary bg-primary-subtle" },
  4: { label: "Tamamlandı", cls: "text-success bg-success-subtle" }
};
function as({ task: t = {} }) {
  const a = (n) => {
    var l, o, d;
    return (d = (o = (l = window == null ? void 0 : window.apya) == null ? void 0 : l.taskDetail) == null ? void 0 : o.open) == null ? void 0 : d.call(o, n);
  }, s = t.predecessorIds || [], { data: r = [], isLoading: i } = ae({
    queryKey: ["task-predecessors", t.id, s],
    queryFn: async () => {
      var l, o, d;
      const n = (d = (o = (l = window == null ? void 0 : window.apya) == null ? void 0 : l.platform) == null ? void 0 : o.tasks) == null ? void 0 : d.task;
      return n ? Promise.all(
        s.map(
          (c) => Promise.resolve(n.get(c)).catch(() => ({ id: c, title: "(erişilemeyen görev)", status: null }))
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
    s.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : i ? /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-tertiary py-2", children: "Yükleniyor…" }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col divide-y divide-subtle/50", children: r.map((n) => {
      const l = ss[n.status] || null;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => a(n.id),
          className: "flex items-center justify-between py-3.5 hover:bg-surface-hover/50 px-2 rounded-lg transition-colors text-left",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-diagram-predecessor text-text-tertiary text-xs shrink-0" }),
              /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: n.title || "Başlıksız görev" })
            ] }),
            l && /* @__PURE__ */ e.jsx("span", { className: `text-xs font-semibold px-2.5 py-0.5 rounded-md shrink-0 ${l.cls}`, children: l.label })
          ]
        },
        n.id
      );
    }) })
  ] });
}
function de() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task) || null;
}
function rs(t) {
  const a = te(), s = ["task-timelogs", t], r = ["task-active-timelog"], i = ae({
    queryKey: s,
    queryFn: () => {
      var c;
      return Promise.resolve((c = de()) == null ? void 0 : c.getTimeLogs(t));
    },
    enabled: !!t && !!de(),
    staleTime: 15e3,
    retry: !1
  }), n = ae({
    queryKey: r,
    queryFn: () => {
      var c;
      return Promise.resolve((c = de()) == null ? void 0 : c.getActiveTimeLog());
    },
    enabled: !!de(),
    staleTime: 5e3,
    retry: !1
  }), l = () => {
    a.invalidateQueries({ queryKey: s }), a.invalidateQueries({ queryKey: r });
  }, o = se({
    mutationFn: () => {
      var c;
      return Promise.resolve((c = de()) == null ? void 0 : c.startTimeTracking(t));
    },
    onSuccess: l
  }), d = se({
    mutationFn: () => {
      var c;
      return Promise.resolve((c = de()) == null ? void 0 : c.stopTimeTracking(t));
    },
    onSuccess: l
  });
  return {
    logs: i.data ?? [],
    isLoading: i.isLoading,
    activeLog: n.data ?? null,
    start: o.mutateAsync,
    stop: d.mutateAsync,
    isMutating: o.isPending || d.isPending
  };
}
function is() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-warning text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Risk Yönetimi" })
      ] }),
      /* @__PURE__ */ e.jsx(C, { size: "sm", variant: "outline", icon: "fa-plus", children: "Yeni Risk Bildir" })
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
function ns() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-stamp text-primary text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Onay Süreçleri & İmza Akışı" })
      ] }),
      /* @__PURE__ */ e.jsx(C, { size: "sm", variant: "primary", icon: "fa-check", children: "Onay İste" })
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
function ls(t) {
  const a = Math.max(0, Math.floor(t));
  return `${Te(Math.floor(a / 3600))}:${Te(Math.floor(a % 3600 / 60))}:${Te(a % 60)}`;
}
function Ke(t) {
  const a = Math.max(0, Math.floor(t)), s = Math.floor(a / 3600), r = Math.floor(a % 3600 / 60);
  return s > 0 ? `${s}s ${r}dk` : r > 0 ? `${r}dk ${a % 60}sn` : `${a % 60}sn`;
}
function Be(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function os({ taskId: t }) {
  const a = rs(t), s = a.activeLog && a.activeLog.taskId === t ? a.activeLog : null, [r, i] = x.useState(() => Date.now());
  x.useEffect(() => {
    if (!s) return;
    const c = setInterval(() => i(Date.now()), 1e3);
    return () => clearInterval(c);
  }, [s]);
  const n = s ? Math.max(0, Math.floor((r - new Date(s.startTime).getTime()) / 1e3)) : 0, o = a.logs.reduce((c, m) => c + (m.secondsSpent || 0), 0) + n, d = async () => {
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
        C,
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
        /* @__PURE__ */ e.jsx("span", { className: "text-2xl font-bold text-primary", children: Ke(o) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: `p-4 rounded-xl border flex flex-col gap-1 ${s ? "bg-success-subtle/30 border-success/30" : "bg-surface-sunken/40 border-subtle"}`, children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-text-tertiary uppercase", children: "Aktif Sayaç" }),
        /* @__PURE__ */ e.jsx("span", { className: `text-2xl font-bold font-mono ${s ? "text-success" : "text-text-tertiary"}`, children: s ? ls(n) : "00:00:00" })
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
              Be(c.startTime),
              " → ",
              m ? "sürüyor" : Be(c.endTime)
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: `text-[12px] font-bold px-2 py-0.5 rounded-md ${m ? "text-success bg-success-subtle" : "text-text-secondary bg-surface-sunken"}`, children: m ? "Aktif" : Ke(c.secondsSpent || 0) })
        ] }, c.id);
      }) })
    ] })
  ] });
}
function cs() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-sparkles text-indigo-600 text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Apya AI Asistan & Analiz" })
      ] }),
      /* @__PURE__ */ e.jsx(C, { size: "sm", variant: "primary", icon: "fa-wand-magic-sparkles", children: "Görevi Analiz Et" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 flex flex-col gap-2", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-indigo-900 dark:text-indigo-200", children: "AI Önerisi:" }),
      /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-indigo-700 dark:text-indigo-300 leading-relaxed", children: "Sözleşme taslağı incelendiğinde ödeme takviminin 15 gün vadeli olduğu tespit edildi. Finans ekibine bildirim gönderilmesi tavsiye edilir." })
    ] })
  ] });
}
function ds() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-square-plus text-success text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Özel Alanlar (Custom Fields)" })
      ] }),
      /* @__PURE__ */ e.jsx(C, { size: "sm", variant: "outline", icon: "fa-plus", children: "Alan Ekle" })
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
function xs() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-wand-magic-sparkles text-indigo-600 text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Görev Otomasyonları" })
      ] }),
      /* @__PURE__ */ e.jsx(C, { size: "sm", variant: "outline", icon: "fa-plus", children: "Kural Ekle" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "p-3.5 rounded-xl border border-subtle bg-surface-sunken/40 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-medium text-text-primary", children: "Görev 'Tamamlandı' olunca ilgili faturayı otomatik oluştur." }),
      /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-success bg-success-subtle px-2 py-0.5 rounded", children: "Aktif" })
    ] })
  ] });
}
function us() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-envelope text-primary text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Bağlantılı E-postalar" })
      ] }),
      /* @__PURE__ */ e.jsx(C, { size: "sm", variant: "outline", icon: "fa-plus", children: "E-posta Bağla" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "p-3.5 rounded-xl border border-subtle bg-surface-sunken/40 flex flex-col gap-1", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: "Otel Rezervasyon Teyidi ve Sözleşme Eki" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary", children: "Gönderen: info@hilton.com • 10.07.2026 09:15" })
    ] })
  ] });
}
function ms() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-image text-indigo-600 text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Görsel Dosya Galerisi" })
      ] }),
      /* @__PURE__ */ e.jsx(C, { size: "sm", variant: "outline", icon: "fa-upload", children: "Görsel Yükle" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-3 gap-3", children: ["Otel_Lobi.jpg", "Oda_Tasarim.jpg", "Sozlesme_Imza.jpg"].map((t, a) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 p-2 rounded-xl border border-subtle bg-surface-sunken/40 items-center text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "h-20 w-full bg-surface-base rounded-lg flex items-center justify-center text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-image text-2xl" }) }),
      /* @__PURE__ */ e.jsx("span", { className: "text-xs font-medium text-text-primary truncate w-full mt-1", children: t })
    ] }, a)) })
  ] });
}
function ps() {
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
const Le = [
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
    component: Bt
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
    component: Ut
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
    component: ts
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
    component: as
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
    component: Jt
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
    component: Zt
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
    component: Ht
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
    component: Qt
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
    component: is
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
    component: ns
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
    component: os
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
    component: ps
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
    component: cs
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
    component: ds
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
    component: xs
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
    component: us
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
    component: ms
  }
];
function dt(t = []) {
  const a = new Set(t);
  return Le.filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function fs(t = []) {
  const a = new Set(t);
  return Le.filter((s) => !s.isCore).filter((s) => !s.permission || et(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let ve = null;
const we = /* @__PURE__ */ new Set(), De = /* @__PURE__ */ new Set();
function Me() {
  we.forEach((t) => t());
}
function bs(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const J = {
  open(t) {
    const a = bs(t);
    a && (ve = a, Me());
  },
  close() {
    ve = null, Me();
  },
  subscribe(t) {
    return we.add(t), () => we.delete(t);
  },
  getSnapshot() {
    return ve;
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
    ve = null, we.clear(), De.clear();
  }
}, Oe = "apya.taskDetail.fullscreen";
function xt({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, i] = x.useState(t), [n, l] = x.useState([]), { data: o, isLoading: d, isError: c, refetch: m } = Xe(r), b = tt(), f = it(o), g = nt(), u = lt(r), [y, v] = x.useState("general"), [w, p] = x.useState(!1), N = xe.useRef(null), L = x.useMemo(
    () => dt(u.assignedCodes),
    [u.assignedCodes]
  ), $ = x.useMemo(
    () => fs(u.assignedCodes),
    [u.assignedCodes]
  ), j = L.find((D) => D.code === y) ?? L[0];
  xe.useEffect(() => {
    j.code !== y && v(j.code);
  }, [j, y]);
  const P = j == null ? void 0 : j.component, S = te(), [G, K] = x.useState(
    () => {
      var D;
      return ((D = window.localStorage) == null ? void 0 : D.getItem(Oe)) === "1";
    }
  ), [W, Q] = x.useState(!1), U = x.useCallback(() => {
    at(), s == null || s();
  }, [s]);
  rt(t, U), xe.useEffect(() => {
    f.isDirty ? b.markDirty() : b.markClean();
  });
  const E = x.useCallback(() => b.requestClose(U), [b, U]), F = x.useCallback(() => {
    K((D) => {
      var R;
      const I = !D;
      return (R = window.localStorage) == null || R.setItem(Oe, I ? "1" : "0"), I;
    });
  }, []), _ = et("Platform.Tasks.Delete"), [H, O] = x.useState(!1), [h, k] = x.useState(!1), T = x.useCallback(async () => {
    var D, I, R, Z, M, ue;
    k(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (R = (I = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : I.info) == null || R.call(I, "Başarıyla silindi."), O(!1), b.markClean(), U();
    } catch (le) {
      (ue = (M = (Z = window == null ? void 0 : window.abp) == null ? void 0 : Z.notify) == null ? void 0 : M.error) == null || ue.call(M, (le == null ? void 0 : le.message) || "Görev silinemedi.");
    } finally {
      k(!1);
    }
  }, [r, b, U]), A = x.useCallback(async () => {
    var D, I, R, Z, M, ue;
    if (!f.validate()) return !1;
    Q(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, f.toUpdateDto())
      ), await S.invalidateQueries({ queryKey: ["task-detail", r] }), J.emitResult(), (R = (I = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : I.success) == null || R.call(I, "Kaydedildi."), !0;
    } catch (le) {
      return (ue = (M = (Z = window == null ? void 0 : window.abp) == null ? void 0 : Z.notify) == null ? void 0 : M.error) == null || ue.call(M, (le == null ? void 0 : le.message) || "Kaydedilemedi."), !1;
    } finally {
      Q(!1);
    }
  }, [r, f, b, S]), z = x.useCallback(() => {
    A();
  }, [A]), B = x.useCallback(async () => {
    const D = b.resolvePendingClose("save");
    await A() && (D == null || D());
  }, [b, A]), Y = x.useCallback((D, I) => {
    b.requestClose(() => {
      l((R) => [...R, { id: r, title: (o == null ? void 0 : o.title) ?? "" }]), i(D), v("general"), b.markClean();
    });
  }, [b, r, o]), q = x.useCallback((D) => {
    b.requestClose(() => {
      l((I) => {
        const R = I.findIndex((Z) => Z.id === D);
        return R === -1 ? I : I.slice(0, R);
      }), i(D), v("general"), b.markClean();
    });
  }, [b]), X = x.useCallback(async (D) => {
    var I, R, Z;
    try {
      await u.addFeature(D), v(D), p(!1);
    } catch (M) {
      (Z = (R = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : R.error) == null || Z.call(R, (M == null ? void 0 : M.message) || "Özellik eklenemedi.");
    }
  }, [u]), ee = x.useCallback(async (D) => {
    var I, R, Z;
    try {
      await u.removeFeature(D), v((M) => M === D ? "general" : M);
    } catch (M) {
      (Z = (R = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : R.error) == null || Z.call(R, (M == null ? void 0 : M.message) || "Özellik kaldırılamadı.");
    }
  }, [u]);
  xe.useEffect(() => {
    if (!w) return;
    const D = (R) => {
      N.current && !N.current.contains(R.target) && p(!1);
    }, I = (R) => {
      R.key === "Escape" && p(!1);
    };
    return document.addEventListener("mousedown", D), document.addEventListener("keydown", I), () => {
      document.removeEventListener("mousedown", D), document.removeEventListener("keydown", I);
    };
  }, [w]);
  const ne = d ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(ie, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(ie, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(ie, { className: "h-24 w-full" })
  ] }) : c ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(C, { variant: "ghost", onClick: () => m(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      Rt,
      {
        trail: n,
        current: { id: r, title: (o == null ? void 0 : o.title) ?? "" },
        onNavigate: q
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: N, children: [
      /* @__PURE__ */ e.jsx(
        zt,
        {
          tabs: L,
          activeCode: j.code,
          onSelect: (D) => {
            v(D), p(!1);
          },
          onOpenPicker: () => p((D) => !D),
          pickerOpen: w
        }
      ),
      w && /* @__PURE__ */ e.jsx(
        It,
        {
          entries: $,
          busyCode: u.isMutating ? u.mutatingCode : null,
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
            Tt,
            {
              values: f.values,
              errors: f.errors,
              onFieldChange: f.setField,
              assigneeOptions: g.options,
              isLoadingAssignees: g.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(x.Suspense, { fallback: /* @__PURE__ */ e.jsx(ie, { className: "h-24 w-full" }), children: P && /* @__PURE__ */ e.jsx(
            P,
            {
              taskId: r,
              task: o,
              onOpenSubtask: Y
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            Dt,
            {
              task: o,
              creatorName: g.nameById.get(o.creatorId),
              lastModifierName: g.nameById.get(o.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), V = a === "page" ? gt : yt;
  return /* @__PURE__ */ e.jsxs(
    V,
    {
      open: !0,
      fullscreen: G,
      onRequestClose: E,
      title: o ? `Görev Detayı: ${o.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        jt,
        {
          task: o ?? { title: "Yükleniyor…" },
          canDelete: _,
          fullscreen: G,
          onToggleFullscreen: F,
          onClose: E,
          onDelete: () => O(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        Nt,
        {
          lastSavedAt: o == null ? void 0 : o.lastModificationTime,
          isDirty: b.isDirty,
          isSaving: W,
          onCancel: E,
          onSave: z
        }
      ),
      children: [
        ne,
        b.pendingClose && /* @__PURE__ */ e.jsx(
          ys,
          {
            isSaving: W,
            onStay: () => b.resolvePendingClose("stay"),
            onDiscard: () => b.resolvePendingClose("discard"),
            onSaveAndClose: B
          }
        ),
        H && /* @__PURE__ */ e.jsx(
          hs,
          {
            taskTitle: (o == null ? void 0 : o.title) ?? "",
            busy: h,
            onCancel: () => O(!1),
            onConfirm: T
          }
        )
      ]
    }
  );
}
function hs({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [i, n] = x.useState(""), l = i.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    ut,
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
        /* @__PURE__ */ e.jsx(C, { variant: "secondary", onClick: s, disabled: a, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          C,
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
            value: i,
            onChange: (o) => n(o.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function ut({ label: t, title: a, description: s, children: r, actions: i }) {
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
function ys({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    ut,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(C, { variant: "secondary", onClick: a, disabled: t, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ e.jsx(C, { variant: "destructive", onClick: s, disabled: t, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ e.jsx(C, { variant: "primary", onClick: r, isLoading: t, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
const gs = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function vs({ isPrivate: t = !1, onChange: a = () => {
} }) {
  const s = !!t;
  return /* @__PURE__ */ e.jsxs(pe, { children: [
    /* @__PURE__ */ e.jsx(fe, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
    /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
      he,
      {
        sideOffset: 8,
        align: "end",
        className: "z-50 w-[360px] rounded-2xl border border-subtle bg-surface-base p-4 shadow-float animate-in fade-in-50 zoom-in-95",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle pb-3 mb-3", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shield-halved text-primary text-base" }),
            /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary", children: "Görünürlük" })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: gs.map((r) => {
            const i = s === r.value;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => a(r.value),
                className: `flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${i ? "border-primary bg-primary-subtle/40" : "border-subtle hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r.icon} text-base mt-0.5 ${i ? "text-primary" : "text-text-tertiary"}` }),
                  /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ e.jsx("h4", { className: "text-[13px] font-semibold text-text-primary", children: r.title }),
                      i && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ] }),
                    /* @__PURE__ */ e.jsx("p", { className: "text-[12px] text-text-tertiary mt-0.5", children: r.desc })
                  ] })
                ]
              },
              String(r.value)
            );
          }) }),
          /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-text-tertiary mt-3", children: "Değişiklik “Kaydet” ile uygulanır." }),
          /* @__PURE__ */ e.jsx(ht, { className: "fill-surface-base stroke-subtle" })
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
function js({
  task: t = {},
  onClose: a,
  onToggleFullscreen: s,
  isFullscreen: r,
  presentation: i = "modal",
  onFieldChange: n = () => {
  }
}) {
  const [l, o] = x.useState(!1), [d, c] = x.useState(t.status ?? 1), [m, b] = x.useState(t.priority ?? 2), [f, g] = x.useState(!!t.isPrivate), [u, y] = x.useState(!!t.isFavorite), v = Se.find((j) => j.id === d) || Se[0], w = Ee.find((j) => j.id === m) || Ee[1], p = t.code || (t.id ? `#OTL-${t.id.substring(0, 4).toUpperCase()}` : "#OTL-2507"), N = () => {
    var j, P, S, G;
    (j = navigator.clipboard) == null || j.writeText(p), o(!0), (G = (S = (P = window == null ? void 0 : window.abp) == null ? void 0 : P.notify) == null ? void 0 : S.success) == null || G.call(S, `${p} panoya kopyalandı.`), setTimeout(() => o(!1), 2e3);
  }, L = () => {
    var P, S, G, K;
    const j = `${window.location.origin}/Tasks?task=${t.id || ""}`;
    (P = navigator.clipboard) == null || P.writeText(j), (K = (G = (S = window == null ? void 0 : window.abp) == null ? void 0 : S.notify) == null ? void 0 : G.success) == null || K.call(G, "Görev bağlantısı panoya kopyalandı!");
  }, $ = async () => {
    var P, S, G, K, W, Q, U, E;
    const j = !u;
    y(j);
    try {
      await Promise.resolve((W = (K = (G = (S = (P = window == null ? void 0 : window.apya) == null ? void 0 : P.platform) == null ? void 0 : S.tasks) == null ? void 0 : G.task) == null ? void 0 : K.toggleFavorite) == null ? void 0 : W.call(K, t.id));
    } catch (F) {
      y(!j), (E = (U = (Q = window == null ? void 0 : window.abp) == null ? void 0 : Q.notify) == null ? void 0 : U.error) == null || E.call(U, (F == null ? void 0 : F.message) || "Favori güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex flex-col gap-3.5 border-b border-subtle/80 bg-surface-base px-6 py-5", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 min-w-0 flex-1", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 flex-wrap", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: N,
            title: "Kodu Kopyala",
            className: "group flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary-subtle/60 border border-primary/20 text-primary font-mono text-[11px] font-bold tracking-wider hover:bg-primary-subtle hover:border-primary/40 transition-all shadow-xs",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[10px]" }),
              /* @__PURE__ */ e.jsx("span", { children: p.replace("#", "") }),
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l ? "fa-check text-success" : "fa-copy opacity-50 group-hover:opacity-100"} text-[10px] ml-0.5 transition-all` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(pe, { children: [
          /* @__PURE__ */ e.jsx(fe, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold border transition-all cursor-pointer shadow-xs hover:opacity-90 ${v.color}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${v.dot} animate-pulse` }),
                /* @__PURE__ */ e.jsx("span", { children: v.label }),
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
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: Se.map((j) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      c(j.id), n("status", j.id);
                    },
                    className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${d === j.id ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${j.dot}` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: j.label }),
                      d === j.id && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ]
                  },
                  j.id
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
              className: `flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold border border-subtle transition-all cursor-pointer shadow-xs hover:bg-surface-hover ${w.color}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${w.icon} text-[11px]` }),
                /* @__PURE__ */ e.jsx("span", { children: w.label }),
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
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: Ee.map((j) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      b(j.id), n("priority", j.id);
                    },
                    className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${m === j.id ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${j.icon} text-xs` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: j.label }),
                      m === j.id && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
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
            onBlur: (j) => n("title", j.currentTarget.textContent),
            className: "text-[23px] font-bold tracking-tight text-text-primary hover:text-primary transition-colors focus:outline-none focus:bg-surface-sunken/40 px-1.5 py-0.5 -mx-1.5 rounded-lg cursor-text leading-tight truncate",
            children: t.title || "Başlıksız görev"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: $,
            className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${u ? "text-amber-500 bg-amber-50 dark:bg-amber-950/30" : "text-text-tertiary hover:bg-surface-hover hover:text-amber-500"}`,
            title: u ? "Favorilerden çıkar" : "Favorilere ekle",
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-${u ? "solid" : "regular"} fa-star text-lg` })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
      /* @__PURE__ */ e.jsx(
        vs,
        {
          isPrivate: f,
          onChange: (j) => {
            g(j), n("isPrivate", j);
          }
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "h-5 w-px bg-subtle mx-1" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1", children: [
        i === "modal" && /* @__PURE__ */ e.jsx(
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
                    onClick: L,
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
        i === "modal" && /* @__PURE__ */ e.jsx(
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
function ws({
  task: t = {},
  assigneeOptions: a = [],
  onFieldChange: s = () => {
  }
}) {
  const [r, i] = x.useState(
    Array.isArray(t.tags) ? t.tags.map((p) => typeof p == "string" ? p : p == null ? void 0 : p.name).filter(Boolean) : []
  ), [n, l] = x.useState(""), [o, d] = x.useState(!1), [c, m] = x.useState(t.assigneeId ?? null), b = (p) => {
    if (p.key === "Enter" || p.type === "blur") {
      const N = n.trim();
      if (N && !r.includes(N)) {
        const L = [...r, N];
        i(L), s("tagNames", L);
      }
      l(""), d(!1);
    }
  }, f = (p) => {
    const N = r.filter((L) => L !== p);
    i(N), s("tagNames", N);
  }, g = (p) => {
    m(p), s("assigneeId", p);
  }, u = (p) => {
    if (!p) return "—";
    const N = new Date(p);
    return isNaN(N.getTime()) ? p : N.toISOString().split("T")[0];
  }, y = a.find((p) => p.value === c), v = (y == null ? void 0 : y.label) || t.assigneeName || "Atanmamış", w = `https://ui-avatars.com/api/?name=${encodeURIComponent(v)}&background=6366f1&color=fff&size=64`;
  return /* @__PURE__ */ e.jsx("div", { className: "px-[var(--apya-space-6)] py-[var(--apya-space-5)] bg-surface-base border-b border-subtle", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-y-[var(--apya-space-5)] gap-x-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsx(oe, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(pe, { children: [
      /* @__PURE__ */ e.jsx(fe, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group focus-visible:outline-none focus-visible:shadow-focus",
          children: [
            /* @__PURE__ */ e.jsx("img", { src: w, alt: v, className: "h-6 w-6 rounded-full border border-subtle shrink-0 object-cover" }),
            /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary text-[13px] group-hover:text-primary transition-colors", children: v }),
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
      o ? /* @__PURE__ */ e.jsx(
        "input",
        {
          autoFocus: !0,
          type: "text",
          value: n,
          onChange: (p) => l(p.target.value),
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
const Ns = [
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
function ks({
  assignedCodes: t = [],
  onAddFeature: a = () => {
  }
}) {
  const [s, r] = x.useState(!1), [i, n] = x.useState(""), [l, o] = x.useState(!1);
  x.useEffect(() => {
    o(!0);
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
  const m = Ns.map((f) => ({
    ...f,
    items: f.items.filter(
      (g) => g.title.toLowerCase().includes(i.toLowerCase()) || g.desc.toLowerCase().includes(i.toLowerCase()) || f.title.toLowerCase().includes(i.toLowerCase())
    )
  })).filter((f) => f.items.length > 0), b = s && l ? pt.createPortal(
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
                    value: i,
                    onChange: (f) => n(f.target.value),
                    placeholder: "17 özellik arasında ara (Gantt, Finans, AI, Formlar, Riskler...)",
                    className: "w-full h-10 pl-9 pr-4 text-[13px] rounded-xl border border-subtle bg-surface-base focus:border-primary focus:outline-none focus:shadow-focus transition-all text-text-primary placeholder:text-text-tertiary"
                  }
                ),
                i && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => n(""),
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
function Cs({
  activeTab: t = "general",
  onTabChange: a = () => {
  },
  visibleTabs: s = [],
  assignedCodes: r = [],
  onAddFeature: i = () => {
  }
}) {
  const n = (l) => l === "subtasks" ? 4 : l === "files" ? 8 : l === "dependencies" ? 2 : null;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-4 w-full py-1.5", children: [
    /* @__PURE__ */ e.jsx("nav", { className: "flex items-center gap-1.5 overflow-x-auto custom-scrollbar", "aria-label": "Görev Sekmeleri", children: s.map((l) => {
      const o = t === l.code, d = n(l.code);
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => a(l.code),
          className: `relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap select-none cursor-pointer ${o ? "text-primary bg-primary-subtle shadow-xs font-bold" : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"}`,
          children: [
            /* @__PURE__ */ e.jsx("span", { children: l.title }),
            d !== null && /* @__PURE__ */ e.jsx("span", { className: `flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full text-[10px] font-bold ${o ? "bg-primary text-white" : "bg-surface-sunken text-text-tertiary"}`, children: d }),
            o && /* @__PURE__ */ e.jsx("span", { className: "absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" })
          ]
        },
        l.code
      );
    }) }),
    /* @__PURE__ */ e.jsx("div", { className: "shrink-0 flex items-center", children: /* @__PURE__ */ e.jsx(
      ks,
      {
        assignedCodes: r,
        onAddFeature: i
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
function _e({ label: t, name: a, avatar: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-center py-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("img", { src: s, alt: a, className: "w-5 h-5 rounded-full border border-subtle object-cover" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary font-semibold", children: a })
    ] })
  ] });
}
function Ts({ task: t = {}, onDelete: a = () => {
}, nameById: s }) {
  const [r, i] = x.useState(!1), [n, l] = x.useState(!1), o = te(), d = (y, v) => {
    var w;
    return y || v && ((w = s == null ? void 0 : s.get) == null ? void 0 : w.call(s, v)) || "Bilinmiyor";
  }, c = d(t.creatorName, t.creatorId), m = t.lastModificationTime ? d(t.lastModifierName, t.lastModifierId) : "—", b = (y) => y ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(y)) : "—", f = () => {
    var v, w, p, N;
    const y = `${window.location.origin}/Tasks?task=${t.id || ""}`;
    (v = navigator.clipboard) == null || v.writeText(y), (N = (p = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : p.success) == null || N.call(p, "Görev bağlantısı panoya kopyalandı!");
  }, g = async () => {
    var y, v, w, p, N, L, $, j, P, S, G;
    if (!(!t || r)) {
      i(!0);
      try {
        const K = (w = (v = (y = window == null ? void 0 : window.apya) == null ? void 0 : y.platform) == null ? void 0 : v.tasks) == null ? void 0 : w.task;
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
          await o.invalidateQueries({ queryKey: ["task-detail"] }), (L = (N = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : N.success) == null || L.call(N, "Görev başarıyla çoğaltıldı!"), (j = ($ = window.apya) == null ? void 0 : $.taskDetail) != null && j.open && Q && window.apya.taskDetail.open(Q);
        }
      } catch (K) {
        (G = (S = (P = window == null ? void 0 : window.abp) == null ? void 0 : P.notify) == null ? void 0 : S.error) == null || G.call(S, (K == null ? void 0 : K.message) || "Görev çoğaltılamadı.");
      } finally {
        i(!1);
      }
    }
  }, u = async () => {
    var y, v, w, p, N, L, $, j, P;
    if (!(!t.id || n)) {
      l(!0);
      try {
        const S = (w = (v = (y = window == null ? void 0 : window.apya) == null ? void 0 : y.platform) == null ? void 0 : v.tasks) == null ? void 0 : w.task;
        S && (await Promise.resolve(S.updateStatus(t.id, 4)), await o.invalidateQueries({ queryKey: ["task-detail", t.id] }), (L = (N = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : N.info) == null || L.call(N, "Görev arşivlendi (Tamamlandı)."));
      } catch (S) {
        (P = (j = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : j.error) == null || P.call(j, (S == null ? void 0 : S.message) || "Görev arşivlenemedi.");
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
        /* @__PURE__ */ e.jsx(Ue, { label: "Oluşturma Tarihi", value: b(t.creationTime) }),
        /* @__PURE__ */ e.jsx(
          _e,
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
        C,
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
        C,
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
        C,
        {
          type: "button",
          variant: "outline",
          onClick: u,
          disabled: n,
          isLoading: n,
          className: "w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]",
          icon: "fa-box-archive",
          children: "Arşivle"
        }
      ),
      /* @__PURE__ */ e.jsx(
        C,
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
function Ds({ onFormat: t = () => {
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
function Ss({ task: t = {}, onFieldChange: a = () => {
} }) {
  const s = t == null ? void 0 : t.id, r = te(), [i, n] = x.useState(t.description || ""), l = (h, k = "") => {
    const T = document.getElementById("task-v3-desc-input");
    if (!T) return;
    const A = T.selectionStart, z = T.selectionEnd, B = i.substring(A, z) || "metin", Y = `${h}${B}${k}`, q = i.substring(0, A) + Y + i.substring(z);
    n(q), a("description", q);
  }, o = ct(s), [d, c] = x.useState(!0), [m, b] = x.useState(""), [f, g] = x.useState(!1), [u, y] = x.useState(!1), v = o.items ?? [], w = v.filter((h) => h.isDone || h.done).length, p = async (h) => {
    var k, T, A, z, B, Y;
    if (h.key === "Enter" || h.type === "blur") {
      const q = m.trim();
      if (q && s) {
        y(!0);
        try {
          await o.addItem(q), (A = (T = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : T.success) == null || A.call(T, "Madde eklendi.");
        } catch (X) {
          (Y = (B = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : B.error) == null || Y.call(B, (X == null ? void 0 : X.message) || "Madde eklenemedi.");
        } finally {
          y(!1);
        }
      }
      b(""), g(!1);
    }
  }, N = async (h) => {
    var k, T, A;
    if (!(typeof h == "string" && h.startsWith("mock-")))
      try {
        await o.toggleItem(h);
      } catch (z) {
        (A = (T = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : T.error) == null || A.call(T, (z == null ? void 0 : z.message) || "Durum güncellenemedi.");
      }
  }, L = async (h) => {
    var k, T, A, z, B, Y;
    if (!(typeof h == "string" && h.startsWith("mock-")))
      try {
        await o.removeItem(h), (A = (T = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : T.info) == null || A.call(T, "Madde silindi.");
      } catch (q) {
        (Y = (B = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : B.error) == null || Y.call(B, (q == null ? void 0 : q.message) || "Madde silinemedi.");
      }
  }, { data: $ = [] } = ae({
    queryKey: ["task-comments", s],
    queryFn: async () => {
      var k, T, A;
      const h = (A = (T = (k = window == null ? void 0 : window.apya) == null ? void 0 : k.platform) == null ? void 0 : T.tasks) == null ? void 0 : A.task;
      return !h || !s ? [] : await Promise.resolve(h.getComments(s));
    },
    enabled: !!s,
    staleTime: 1e4
  }), [j, P] = x.useState(""), [S, G] = x.useState(!0), [K, W] = x.useState(!1), [Q, U] = x.useState(null), [E, F] = x.useState(""), _ = $.length > 0 ? $ : t.comments ?? [], H = async (h) => {
    var T, A, z, B, Y, q, X, ee, ne;
    h.preventDefault();
    const k = j.trim();
    if (!(!k || !s)) {
      W(!0);
      try {
        const V = (z = (A = (T = window == null ? void 0 : window.apya) == null ? void 0 : T.platform) == null ? void 0 : A.tasks) == null ? void 0 : z.task;
        V && (await Promise.resolve(V.addComment(s, k)), await r.invalidateQueries({ queryKey: ["task-comments", s] }), await r.invalidateQueries({ queryKey: ["task-detail", s] }), (q = (Y = (B = window == null ? void 0 : window.abp) == null ? void 0 : B.notify) == null ? void 0 : Y.success) == null || q.call(Y, "Yorum gönderildi.")), P("");
      } catch (V) {
        (ne = (ee = (X = window == null ? void 0 : window.abp) == null ? void 0 : X.notify) == null ? void 0 : ee.error) == null || ne.call(ee, (V == null ? void 0 : V.message) || "Yorum gönderilemedi.");
      } finally {
        W(!1);
      }
    }
  }, O = async (h) => {
    var T, A, z, B, Y, q, X, ee, ne;
    const k = E.trim();
    if (!(!k || !s))
      try {
        const V = (z = (A = (T = window == null ? void 0 : window.apya) == null ? void 0 : T.platform) == null ? void 0 : A.tasks) == null ? void 0 : z.task;
        V && (await Promise.resolve(V.replyToComment(h, k)), await r.invalidateQueries({ queryKey: ["task-comments", s] }), (q = (Y = (B = window == null ? void 0 : window.abp) == null ? void 0 : B.notify) == null ? void 0 : Y.success) == null || q.call(Y, "Yanıt gönderildi.")), F(""), U(null);
      } catch (V) {
        (ne = (ee = (X = window == null ? void 0 : window.abp) == null ? void 0 : X.notify) == null ? void 0 : ee.error) == null || ne.call(ee, (V == null ? void 0 : V.message) || "Yanıt gönderilemedi.");
      }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-2.5", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary", children: "Açıklama" }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-subtle bg-surface-base focus-within:border-primary focus-within:shadow-focus transition-all overflow-hidden shadow-xs", children: [
        /* @__PURE__ */ e.jsx(Ds, { onFormat: l }),
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            id: "task-v3-desc-input",
            className: "w-full min-h-[110px] p-4 text-[14px] leading-relaxed text-text-primary bg-transparent focus:outline-none resize-y font-sans",
            value: i,
            onChange: (h) => {
              n(h.target.value), a("description", h.target.value);
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
              v.length > 0 && /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-text-tertiary bg-surface-sunken px-2 py-0.5 rounded-full", children: [
                w,
                "/",
                v.length
              ] })
            ] }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "text-text-tertiary group-hover:text-text-primary transition-colors", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid fa-chevron-up transition-transform duration-200 ${d ? "" : "rotate-180"}` }) })
          ]
        }
      ),
      d && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2.5 animate-in fade-in-50", children: [
        v.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden mb-1", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full bg-success transition-all duration-300",
            style: { width: `${w / v.length * 100}%` }
          }
        ) }),
        v.map((h) => {
          const k = h.isDone ?? h.done ?? !1;
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
                      checked: k,
                      onChange: () => N(h.id),
                      className: "h-4 w-4 rounded border-subtle text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `text-[13px] transition-all truncate ${k ? "line-through text-text-tertiary font-normal" : "text-text-primary font-medium"}`, children: h.text })
                ] }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => L(h.id),
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
          onClick: () => G(!S),
          className: "flex items-center justify-between cursor-pointer select-none group",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors", children: "Yorumlar & Güncellemeler" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-primary-subtle text-primary text-[11px] font-bold", children: _.length })
            ] }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "text-text-tertiary group-hover:text-text-primary transition-colors", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid fa-chevron-up transition-transform duration-200 ${S ? "" : "rotate-180"}` }) })
          ]
        }
      ),
      S && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-5 animate-in fade-in-50", children: [
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
                value: j,
                onChange: (h) => P(h.target.value),
                placeholder: "Bir yorum yazın... (@bahset, #görev)",
                rows: 2,
                className: "w-full p-3 text-[13px] bg-transparent focus:outline-none resize-none text-text-primary",
                onKeyDown: (h) => {
                  h.key === "Enter" && (h.ctrlKey || h.metaKey) && H(h);
                }
              }
            ),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-t border-subtle/50 bg-surface-base", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 text-text-tertiary", children: [
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => P((h) => h + " [Dosya] "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Dosya Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => P((h) => h + " [Görsel] "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Resim Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-image text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => P((h) => h + " 👍 "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Emoji", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-face-smile text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => P((h) => h + " @Yakup B. "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Bahset (@)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-at text-xs" }) })
              ] }),
              /* @__PURE__ */ e.jsx(
                C,
                {
                  type: "submit",
                  size: "sm",
                  disabled: !j.trim() || K,
                  isLoading: K,
                  className: "bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 h-8 rounded-lg shadow-sm",
                  icon: "fa-paper-plane",
                  children: "Gönder"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-4 divide-y divide-subtle/50", children: _.map((h) => {
          const k = h.creatorName || h.author || "Yakup B.", T = `https://ui-avatars.com/api/?name=${encodeURIComponent(k)}&background=6366f1&color=fff&size=64`, A = h.creationTime ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(h.creationTime)) : h.date || "10.07.2026 09:30";
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-3 pt-3 items-start first:pt-0", children: [
            /* @__PURE__ */ e.jsx("img", { src: T, alt: k, className: "h-8 w-8 rounded-full border border-subtle shrink-0 object-cover" }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col gap-1", children: [
              /* @__PURE__ */ e.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: k }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary font-mono", children: A })
              ] }) }),
              /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap", children: h.text.split(" ").map((z, B) => z.startsWith("@") ? /* @__PURE__ */ e.jsxs("span", { className: "font-semibold text-primary bg-primary-subtle px-1 py-0.5 rounded mr-1", children: [
                z,
                " "
              ] }, B) : z + " ") }),
              /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-4 mt-1", children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => U(Q === h.id ? null : h.id),
                  className: "text-xs font-semibold text-text-tertiary hover:text-primary transition-colors flex items-center gap-1",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                    /* @__PURE__ */ e.jsx("span", { children: "Yanıtla" })
                  ]
                }
              ) }),
              Q === h.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex gap-2 items-center animate-in fade-in-50", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: E,
                    onChange: (z) => F(z.target.value),
                    placeholder: `@${k} kullanıcısına yanıt ver...`,
                    onKeyDown: (z) => {
                      z.key === "Enter" && O(h.id);
                    },
                    className: "flex-1 h-8 px-3 text-[12px] rounded-lg border border-primary bg-surface-base focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(C, { size: "sm", onClick: () => O(h.id), className: "h-8 text-xs bg-primary text-white", children: "Yanıtla" })
              ] })
            ] })
          ] }, h.id);
        }) })
      ] })
    ] })
  ] });
}
function Es({
  lastSavedAt: t,
  isDirty: a,
  isSaving: s,
  onCancel: r,
  onSave: i
}) {
  const n = t ? new Intl.DateTimeFormat("tr-TR", {
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
        /* @__PURE__ */ e.jsx("strong", { className: "font-medium text-text-secondary", children: n })
      ] }),
      a && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 text-warning font-medium ml-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "h-2 w-2 rounded-full bg-warning animate-pulse" }),
        "Kaydedilmemiş değişiklikler var"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ e.jsx(
        C,
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
        C,
        {
          type: "button",
          variant: "primary",
          size: "sm",
          onClick: i,
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
const Ve = "apya.taskDetail.fullscreen";
function mt({
  taskId: t,
  presentation: a = "modal",
  onClose: s,
  switchToTask: r
}) {
  const [i, n] = x.useState(t), { data: l, isLoading: o, isError: d, refetch: c } = Xe(i), m = te(), b = tt(), f = it(l), g = nt(), u = lt(i), [y, v] = x.useState("general"), [w, p] = x.useState(!1), [N, L] = x.useState(() => {
    try {
      return localStorage.getItem(Ve) === "true";
    } catch {
      return !1;
    }
  });
  rt(i), xe.useEffect(() => {
    f.isDirty ? b.markDirty() : b.markClean();
  });
  const $ = x.useCallback(() => {
    at(), s == null || s();
  }, [s]), j = x.useCallback(() => b.requestClose($), [b, $]), P = x.useCallback(() => {
    L((E) => {
      const F = !E;
      try {
        localStorage.setItem(Ve, String(F));
      } catch {
      }
      return F;
    });
  }, []), S = x.useMemo(
    () => dt(u.assignedCodes),
    [u.assignedCodes]
  ), G = Le.find((E) => E.code === y) || S.find((E) => E.code === y) || S[0], K = x.useCallback(async () => {
    var E, F, _, H, O, h;
    if (!f.validate()) return !1;
    p(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(i, f.toUpdateDto())
      ), await m.invalidateQueries({ queryKey: ["task-detail", i] }), J.emitResult(), (_ = (F = (E = window == null ? void 0 : window.abp) == null ? void 0 : E.notify) == null ? void 0 : F.success) == null || _.call(F, "Görev başarıyla güncellendi."), !0;
    } catch (k) {
      return (h = (O = (H = window == null ? void 0 : window.abp) == null ? void 0 : H.notify) == null ? void 0 : O.error) == null || h.call(O, (k == null ? void 0 : k.message) || "Kaydedilemedi."), !1;
    } finally {
      p(!1);
    }
  }, [i, f, m]), W = x.useCallback(async () => {
    var E, F, _, H, O, h;
    if (window.confirm("Bu görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.delete(i)), (_ = (F = (E = window == null ? void 0 : window.abp) == null ? void 0 : E.notify) == null ? void 0 : F.info) == null || _.call(F, "Görev silindi."), b.markClean(), $();
      } catch (k) {
        (h = (O = (H = window == null ? void 0 : window.abp) == null ? void 0 : H.notify) == null ? void 0 : O.error) == null || h.call(O, (k == null ? void 0 : k.message) || "Görev silinemedi.");
      }
  }, [i, b, $]), Q = x.useCallback(async (E) => {
    var F, _, H, O, h, k;
    try {
      await u.addFeature(E), v(E), (H = (_ = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : _.success) == null || H.call(_, "Özellik başarıyla eklendi.");
    } catch (T) {
      (k = (h = (O = window == null ? void 0 : window.abp) == null ? void 0 : O.notify) == null ? void 0 : h.error) == null || k.call(h, (T == null ? void 0 : T.message) || "Özellik eklenemedi.");
    }
  }, [u]), U = o ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(ie, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(ie, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(ie, { className: "h-64 w-full" })
  ] }) : d ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(C, { variant: "ghost", onClick: () => c(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      js,
      {
        task: l,
        onClose: j,
        isFullscreen: N,
        onToggleFullscreen: P,
        presentation: a,
        onFieldChange: f.setField
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "overflow-y-auto max-h-[85vh] custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        ws,
        {
          task: l,
          assigneeOptions: g.options,
          onFieldChange: f.setField
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "border-b border-subtle px-6 bg-surface-base", children: /* @__PURE__ */ e.jsx(
        Cs,
        {
          activeTab: y,
          onTabChange: v,
          visibleTabs: S,
          assignedCodes: u.assignedCodes,
          onAddFeature: Q
        }
      ) }),
      /* @__PURE__ */ e.jsx("div", { className: "p-6", children: y === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start", children: [
        /* @__PURE__ */ e.jsx("div", { className: "min-w-0 space-y-6", children: /* @__PURE__ */ e.jsx(
          Ss,
          {
            task: l,
            onFieldChange: f.setField
          }
        ) }),
        /* @__PURE__ */ e.jsx("div", { className: "w-full shrink-0", children: /* @__PURE__ */ e.jsx(
          Ts,
          {
            task: l,
            onDelete: W,
            nameById: g.nameById
          }
        ) })
      ] }) : /* @__PURE__ */ e.jsx(x.Suspense, { fallback: /* @__PURE__ */ e.jsx(ie, { className: "h-48 w-full" }), children: G != null && G.component ? /* @__PURE__ */ e.jsx(
        G.component,
        {
          taskId: i,
          task: l,
          onOpenSubtask: r
        }
      ) : /* @__PURE__ */ e.jsxs("div", { className: "text-center py-12 text-text-tertiary border border-dashed border-subtle rounded-xl", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-person-digging text-4xl mb-4 opacity-50" }),
        /* @__PURE__ */ e.jsx("p", { children: "Bu sekme yapım aşamasında." })
      ] }) }) })
    ] }),
    /* @__PURE__ */ e.jsx(
      Es,
      {
        lastSavedAt: l == null ? void 0 : l.lastModificationTime,
        isDirty: b.isDirty,
        isSaving: w,
        onCancel: j,
        onSave: K
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsx("div", { className: "w-full max-w-6xl mx-auto my-6 rounded-2xl border border-subtle bg-surface-base shadow-sm overflow-hidden", children: U }) : /* @__PURE__ */ e.jsx(
    We,
    {
      open: !0,
      onOpenChange: (E) => {
        E || j();
      },
      children: /* @__PURE__ */ e.jsx(
        Je,
        {
          title: l != null && l.title ? `Görev Detayı: ${l.title}` : "Görev Detayı",
          fullscreen: N,
          className: "max-w-6xl p-0 overflow-hidden rounded-2xl border border-subtle shadow-2xl bg-surface-base",
          onInteractOutside: (E) => {
            E.preventDefault(), j();
          },
          onEscapeKeyDown: (E) => {
            E.preventDefault(), j();
          },
          children: U
        }
      )
    }
  );
}
function zs() {
  var a;
  const t = x.useSyncExternalStore(
    J.subscribe,
    J.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsx(
    mt,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        J.close(), J.emitResult();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsx(
    xt,
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
function As() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v2" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : !(window.localStorage.getItem("apya.taskDetail.v2") === "0");
  } catch {
    return !0;
  }
}
function Is() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v3" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v2" || new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : window.localStorage.getItem("apya.taskDetail.v3") === "1" || !0;
  } catch {
    return !0;
  }
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = Is();
window.apya.taskDetailV2Enabled = As() && !window.apya.taskDetailV3Enabled;
const Qe = {
  open: (t) => {
    J.open(t);
  },
  close: () => J.close(),
  onResult: (t) => J.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(Qe) : window.apya.taskDetail = Qe;
function He() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = Ze(t), t._reactRoot.render(/* @__PURE__ */ e.jsx(zs, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = st();
    a && J.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", He) : He();
function Rs({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsx(
    mt,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsx(
    xt,
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
  t && Ze(ze).render(/* @__PURE__ */ e.jsx(Rs, { taskId: t }));
}
