import { j as e, r as d, d as xe, b as Me } from "./react-vendor.js";
/* empty css      */
import { a as Ne } from "./QueryProvider.js";
import { u as be, a as J, b as oe } from "./query-vendor.js";
import { D as Ye, l as $e, e as we, B as N, I as ce, S as re } from "./Dialog.js";
import { C as it } from "./Combobox.js";
import { r as lt } from "./httpClient.js";
import { R as ue, T as me, P as pe, C as fe, A as qe } from "./ui-vendor.js";
function nt({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: l,
  footer: i,
  children: o
}) {
  return /* @__PURE__ */ e.jsx(
    Ye,
    {
      open: t,
      onOpenChange: (c) => {
        c || a();
      },
      children: /* @__PURE__ */ e.jsx(
        $e,
        {
          title: r,
          fullscreen: s,
          onInteractOutside: (c) => {
            c.preventDefault(), a();
          },
          onEscapeKeyDown: (c) => {
            c.preventDefault(), a();
          },
          children: /* @__PURE__ */ e.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
            l,
            /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: o }),
            i
          ] })
        }
      )
    }
  );
}
function ot({ title: t, header: a, footer: s, children: r }) {
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
function ct({ isPrivate: t }) {
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
const ge = {
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
function dt({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: l,
  fullscreen: i = !1
}) {
  const [o, c] = d.useState(!1), x = d.useRef(null);
  d.useEffect(() => {
    if (!o) return;
    const y = (u) => {
      x.current && !x.current.contains(u.target) && c(!1);
    }, n = (u) => {
      u.key === "Escape" && c(!1);
    };
    return document.addEventListener("mousedown", y), document.addEventListener("keydown", n), () => {
      document.removeEventListener("mousedown", y), document.removeEventListener("keydown", n);
    };
  }, [o]);
  const b = ge[t == null ? void 0 : t.status] ?? ge[1], f = Se[t == null ? void 0 : t.priority] ?? Se[2], p = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), c(!1);
  }, g = () => {
    var n, u, h, j;
    const y = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (n = navigator.clipboard) == null || n.writeText(y), (j = (h = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : h.info) == null || j.call(h, "Bağlantı kopyalandı."), c(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(we, { variant: b.variant, children: b.text }),
        /* @__PURE__ */ e.jsx(we, { variant: f.variant, children: f.text }),
        /* @__PURE__ */ e.jsx(ct, { isPrivate: t == null ? void 0 : t.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": i ? "Küçült" : "Tam ekrana büyüt",
          onClick: l,
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
            "aria-expanded": o,
            onClick: () => c((y) => !y),
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
                  onClick: p,
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
                      c(!1), r();
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
const xt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function ut({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: l }) {
  const i = xt(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: i ? `Son kayıt: ${i}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(N, { variant: "secondary", onClick: r, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        N,
        {
          variant: "primary",
          onClick: () => l == null ? void 0 : l(),
          disabled: !a || !l,
          isLoading: s,
          loadingText: "Kaydediliyor…",
          children: "Kaydet"
        }
      )
    ] })
  ] }) });
}
const Ie = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", mt = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function te({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function pt({ value: t, onChange: a }) {
  const [s, r] = d.useState(""), l = () => {
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
          i.key === "Enter" || i.key === "," ? (i.preventDefault(), l()) : i.key === "Backspace" && !s && t.length && a(t.slice(0, -1));
        },
        onBlur: l,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function ft({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: l = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(te, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      ce,
      {
        id: "task-title",
        value: t.title,
        onChange: (i) => s("title", i.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(te, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (i) => s("status", Number(i.target.value)),
          className: Ie,
          children: Object.entries(ge).map(([i, o]) => /* @__PURE__ */ e.jsx("option", { value: i, children: o.text }, i))
        }
      ) }),
      /* @__PURE__ */ e.jsx(te, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (i) => s("priority", Number(i.target.value)),
          className: Ie,
          children: Object.entries(Se).map(([i, o]) => /* @__PURE__ */ e.jsx("option", { value: i, children: o.text }, i))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(te, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      it,
      {
        id: "task-assignee",
        options: r,
        value: t.assigneeId,
        onChange: (i) => s("assigneeId", i),
        placeholder: l ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: l
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(te, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        ce,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (i) => s("startDate", i.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(te, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
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
    /* @__PURE__ */ e.jsx(te, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(pt, { value: t.tagNames, onChange: (i) => s("tagNames", i) }) }),
    /* @__PURE__ */ e.jsx(te, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (i) => s("description", i.target.value),
        className: mt
      }
    ) })
  ] });
}
const Be = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function ye({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function bt({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(ye, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(ye, { label: "Oluşturulma zamanı", value: Be(t.creationTime) }),
      /* @__PURE__ */ e.jsx(ye, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(ye, { label: "Son güncelleme zamanı", value: Be(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(ye, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const ht = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", yt = "border-brand-500 text-text-primary";
function gt({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: l }) {
  const i = d.useRef(/* @__PURE__ */ new Map()), o = (x) => {
    var b;
    s(x.code), (b = i.current.get(x.code)) == null || b.focus();
  }, c = (x, b) => {
    x.key === "ArrowRight" ? (x.preventDefault(), o(t[(b + 1) % t.length])) : x.key === "ArrowLeft" ? (x.preventDefault(), o(t[(b - 1 + t.length) % t.length])) : x.key === "Home" ? (x.preventDefault(), o(t[0])) : x.key === "End" && (x.preventDefault(), o(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((x, b) => {
      const f = x.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (p) => {
            p ? i.current.set(x.code, p) : i.current.delete(x.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${x.code}`,
          "aria-selected": f,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: f ? 0 : -1,
          onClick: () => s(x.code),
          onKeyDown: (p) => c(p, b),
          className: `${ht} ${f ? yt : ""}`,
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
        "aria-expanded": l,
        onClick: r,
        className: "mx-1 grid h-8 w-8 flex-none place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" })
      }
    )
  ] });
}
const vt = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function jt({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [l, i] = d.useState(""), o = d.useMemo(() => {
    const c = l.trim().toLocaleLowerCase("tr-TR"), x = c ? t.filter((f) => f.title.toLocaleLowerCase("tr-TR").includes(c)) : t, b = /* @__PURE__ */ new Map();
    return x.forEach((f) => {
      const p = b.get(f.category) ?? [];
      p.push(f), b.set(f.category, p);
    }), b;
  }, [t, l]);
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
            value: l,
            onChange: (c) => i(c.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          o.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...o.entries()].map(([c, x]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: vt[c] ?? c }),
            x.map((b) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa ${b.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: b.title }),
              !b.implemented && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              b.implemented && !b.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === b.code,
                  onClick: () => a(b.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              b.implemented && b.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === b.code,
                  onClick: () => s(b.code),
                  className: "text-[13px] font-medium text-text-negative hover:underline disabled:opacity-50",
                  children: "Kaldır"
                }
              )
            ] }, b.code))
          ] }, c))
        ] })
      ]
    }
  );
}
function Nt({ trail: t = [], current: a, onNavigate: s }) {
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
function wt(t) {
  var s, r, l;
  const a = (l = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : l.task;
  return a ? Promise.resolve(a.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ve(t) {
  return be({
    queryKey: ["task-detail", t],
    queryFn: () => wt(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function Ue(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
function _e() {
  const [t, a] = d.useState(!1), [s, r] = d.useState(!1), l = d.useRef(null), i = d.useCallback(() => a(!0), []), o = d.useCallback(() => a(!1), []);
  d.useEffect(() => {
    if (!t) return;
    const b = (f) => {
      f.preventDefault(), f.returnValue = "";
    };
    return window.addEventListener("beforeunload", b), () => window.removeEventListener("beforeunload", b);
  }, [t]);
  const c = d.useCallback((b) => {
    if (!t) {
      b == null || b();
      return;
    }
    l.current = b ?? null, r(!0);
  }, [t]), x = d.useCallback((b) => {
    const f = l.current;
    return r(!1), l.current = null, b === "discard" && (a(!1), f == null || f()), b === "save" ? f : null;
  }, []);
  return { isDirty: t, markDirty: i, markClean: o, requestClose: c, pendingClose: s, resolvePendingClose: x };
}
const kt = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, Ee = "task";
function He() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(Ee);
  return t && kt.test(t) ? t : null;
}
function Ct() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(Ee), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function Qe(t, a) {
  const s = d.useRef(a);
  s.current = a, d.useEffect(() => {
    if (!t || He() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(Ee, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), d.useEffect(() => {
    const r = () => {
      var l;
      (l = s.current) == null || l.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const Tt = {
  title: "",
  description: "",
  startDate: "",
  dueDate: "",
  status: 1,
  priority: 2,
  assigneeId: null,
  tagNames: []
};
function Dt(t) {
  return t ? {
    title: t.title ?? "",
    description: t.description ?? "",
    startDate: t.startDate ? t.startDate.slice(0, 10) : "",
    dueDate: t.dueDate ? t.dueDate.slice(0, 10) : "",
    status: t.status ?? 1,
    priority: t.priority ?? 2,
    assigneeId: t.assigneeId ?? null,
    tagNames: (t.tags ?? []).map((a) => a.name)
  } : Tt;
}
function Ze(t) {
  const [a, s] = d.useState(t == null ? void 0 : t.id), r = d.useMemo(() => Dt(t), [t]), [l, i] = d.useState(r), [o, c] = d.useState({});
  (t == null ? void 0 : t.id) !== a && (s(t == null ? void 0 : t.id), i(r), c({}));
  const x = d.useCallback((y, n) => {
    i((u) => ({ ...u, [y]: n }));
  }, []), b = d.useMemo(
    () => JSON.stringify(l) !== JSON.stringify(r),
    [l, r]
  ), f = d.useCallback(() => {
    const y = {};
    return l.title.trim() || (y.title = "Başlık zorunlu."), l.startDate || (y.startDate = "Başlangıç tarihi zorunlu."), l.dueDate && l.startDate && l.dueDate < l.startDate && (y.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), c(y), Object.keys(y).length === 0;
  }, [l]), p = d.useCallback(() => ({
    title: l.title.trim(),
    description: l.description || null,
    startDate: l.startDate,
    dueDate: l.dueDate || null,
    status: l.status,
    priority: l.priority,
    assigneeId: l.assigneeId,
    boardColumnId: (t == null ? void 0 : t.boardColumnId) ?? null,
    projectId: (t == null ? void 0 : t.projectId) ?? null,
    parentTaskId: (t == null ? void 0 : t.parentTaskId) ?? null,
    isPrivate: !!(t != null && t.isPrivate),
    predecessorIds: (t == null ? void 0 : t.predecessorIds) ?? [],
    tagNames: l.tagNames
  }), [l, t]), g = d.useCallback(() => {
    i(r), c({});
  }, [r]);
  return { values: l, setField: x, isDirty: b, errors: o, validate: f, toUpdateDto: p, reset: g };
}
function Ke(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function St() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function We() {
  var l;
  const t = be({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: St,
    staleTime: 3e5,
    retry: !1
  }), a = ((l = t.data) == null ? void 0 : l.items) ?? [], s = a.map((i) => ({ value: i.id, label: Ke(i) })), r = new Map(a.map((i) => [i.id, Ke(i)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function ze() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function zt(t) {
  const a = ze();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Je(t) {
  const a = J(), s = ["task-features", t], r = be({
    queryKey: s,
    queryFn: () => zt(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), i = oe({
    mutationFn: (c) => Promise.resolve(ze().addFeature(t, c)),
    onSuccess: l
  }), o = oe({
    mutationFn: (c) => Promise.resolve(ze().removeFeature(t, c)),
    onSuccess: l
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
function Et({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, l] = d.useState(""), [i, o] = d.useState(!1), [c, x] = d.useState(null), b = J(), f = (a == null ? void 0 : a.subTasks) ?? [], p = () => b.invalidateQueries({ queryKey: ["task-detail", t] }), g = async () => {
    var u, h, j;
    const n = r.trim();
    if (n) {
      o(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: n,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), l(""), await p();
      } catch (v) {
        (j = (h = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : h.error) == null || j.call(h, (v == null ? void 0 : v.message) || "Alt görev eklenemedi.");
      } finally {
        o(!1);
      }
    }
  }, y = async (n) => {
    var u, h, j;
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(n)), await p();
    } catch (v) {
      (j = (h = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : h.error) == null || j.call(h, (v == null ? void 0 : v.message) || "Alt görev silinemedi.");
    } finally {
      x(null);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        ce,
        {
          value: r,
          onChange: (n) => l(n.target.value),
          onKeyDown: (n) => {
            n.key === "Enter" && g();
          },
          placeholder: "Yeni alt görev başlığı",
          disabled: i
        }
      ),
      /* @__PURE__ */ e.jsx(N, { variant: "secondary", onClick: g, disabled: i || !r.trim(), children: "Alt Görev Ekle" })
    ] }),
    f.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz alt görev yok." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: f.map((n) => {
      var u, h;
      return /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between py-2", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => s == null ? void 0 : s(n.id, n.title),
            className: "text-left text-sm font-medium text-text-primary hover:underline",
            children: n.title
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(we, { variant: ((u = ge[n.status]) == null ? void 0 : u.variant) ?? "neutral", children: ((h = ge[n.status]) == null ? void 0 : h.text) ?? n.status }),
          c === n.id ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary", children: "Emin misiniz?" }),
            /* @__PURE__ */ e.jsx(N, { variant: "destructive", onClick: () => y(n.id), children: "Evet, sil" }),
            /* @__PURE__ */ e.jsx(N, { variant: "ghost", onClick: () => x(null), children: "Vazgeç" })
          ] }) : /* @__PURE__ */ e.jsx(N, { variant: "ghost", onClick: () => x(n.id), "aria-label": `${n.title} alt görevini sil`, children: "Sil" })
        ] })
      ] }, n.id);
    }) })
  ] });
}
function Xe() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function At(t) {
  const a = Xe();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function It(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, l = lt();
  l && (r.RequestVerificationToken = l);
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
function Bt(t) {
  const a = J(), s = ["task-attachments", t], r = be({
    queryKey: s,
    queryFn: () => At(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), i = oe({
    mutationFn: (c) => It(t, c),
    onSuccess: l
  }), o = oe({
    mutationFn: (c) => Promise.resolve(Xe().deleteAttachment(c)),
    onSuccess: l
  });
  return {
    attachments: r.data ?? [],
    isLoading: r.isLoading,
    upload: i.mutateAsync,
    remove: o.mutateAsync,
    isUploading: i.isPending
  };
}
function Kt(t) {
  return `${Math.round(t / 1024)} KB`;
}
function Rt({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: l } = Bt(t), i = d.useRef(null), o = async (x) => {
    var f, p, g, y, n, u, h;
    const b = (f = x.target.files) == null ? void 0 : f[0];
    if (b)
      try {
        await s(b), (y = (g = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : g.success) == null || y.call(g, "Dosya yüklendi.");
      } catch (j) {
        (h = (u = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.notify) == null ? void 0 : u.error) == null || h.call(u, (j == null ? void 0 : j.message) || "Dosya yüklenemedi.");
      } finally {
        i.current && (i.current.value = "");
      }
  }, c = async (x, b) => {
    var f, p, g;
    try {
      await r(x);
    } catch (y) {
      (g = (p = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : p.error) == null || g.call(p, (y == null ? void 0 : y.message) || `${b} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("input", { ref: i, type: "file", onChange: o, className: "text-sm", disabled: l }),
      l && /* @__PURE__ */ e.jsx("span", { className: "text-sm text-text-tertiary", children: "Yükleniyor…" })
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
      /* @__PURE__ */ e.jsx(N, { variant: "ghost", onClick: () => c(x.id, x.fileName), "aria-label": `${x.fileName} dosyasini sil`, children: "Sil" })
    ] }, x.id)) })
  ] });
}
function ve() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Gt(t) {
  const a = ve();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function et(t) {
  const a = J(), s = ["task-checklist", t], r = be({
    queryKey: s,
    queryFn: () => Gt(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), i = oe({
    mutationFn: (x) => Promise.resolve(ve().addChecklistItem(t, x)),
    onSuccess: l
  }), o = oe({
    mutationFn: (x) => Promise.resolve(ve().toggleChecklistItem(x)),
    onSuccess: l
  }), c = oe({
    mutationFn: (x) => Promise.resolve(ve().deleteChecklistItem(x)),
    onSuccess: l
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: i.mutateAsync,
    toggleItem: o.mutateAsync,
    removeItem: c.mutateAsync
  };
}
function Lt({ taskId: t }) {
  const { items: a, addItem: s, toggleItem: r, removeItem: l } = et(t), [i, o] = d.useState(""), c = async () => {
    var p, g, y;
    const f = i.trim();
    if (f)
      try {
        await s(f), o("");
      } catch (n) {
        (y = (g = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : g.error) == null || y.call(g, (n == null ? void 0 : n.message) || "Madde eklenemedi.");
      }
  }, x = async (f) => {
    var p, g, y;
    try {
      await r(f);
    } catch (n) {
      (y = (g = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : g.error) == null || y.call(g, (n == null ? void 0 : n.message) || "Madde güncellenemedi.");
    }
  }, b = async (f, p) => {
    var g, y, n;
    try {
      await l(f);
    } catch (u) {
      (n = (y = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : y.error) == null || n.call(y, (u == null ? void 0 : u.message) || `${p} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        ce,
        {
          value: i,
          onChange: (f) => o(f.target.value),
          onKeyDown: (f) => {
            f.key === "Enter" && c();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ e.jsx(N, { variant: "secondary", onClick: c, disabled: !i.trim(), children: "Ekle" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz madde eklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "space-y-1.5", children: a.map((f) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-2 py-1", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: f.isDone,
            onChange: () => x(f.id)
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: f.isDone ? "text-text-tertiary line-through" : "text-text-primary", children: f.text })
      ] }),
      /* @__PURE__ */ e.jsx(N, { variant: "ghost", onClick: () => b(f.id, f.text), "aria-label": `${f.text} maddesini sil`, children: "Sil" })
    ] }, f.id)) })
  ] });
}
function Ft({ taskId: t, task: a }) {
  const [s, r] = d.useState(""), [l, i] = d.useState(null), [o, c] = d.useState(""), [x, b] = d.useState(!1), f = J(), p = (a == null ? void 0 : a.comments) ?? [], g = async (n) => {
    var u, h, j, v, S, K;
    if (n == null || n.preventDefault(), !(!s.trim() || x)) {
      b(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), f.invalidateQueries({ queryKey: ["task-detail", t] }), (j = (h = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : h.success) == null || j.call(h, "Yorum eklendi.");
      } catch (z) {
        (K = (S = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : S.error) == null || K.call(S, (z == null ? void 0 : z.message) || "Yorum eklenemedi.");
      } finally {
        b(!1);
      }
    }
  }, y = async (n) => {
    var u, h, j, v, S, K;
    if (!(!o.trim() || x)) {
      b(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(n, o.trim())
        ), c(""), i(null), f.invalidateQueries({ queryKey: ["task-detail", t] }), (j = (h = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : h.success) == null || j.call(h, "Yanıt eklendi.");
      } catch (z) {
        (K = (S = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : S.error) == null || K.call(S, (z == null ? void 0 : z.message) || "Yanıt eklenemedi.");
      } finally {
        b(!1);
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
          onChange: (n) => r(n.target.value),
          placeholder: "Bir yorum veya güncelleme yazın...",
          className: "w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ e.jsx(
        N,
        {
          type: "submit",
          variant: "primary",
          disabled: !s.trim() || x,
          isLoading: x,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    p.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: p.map((n) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: n.creatorUserName || n.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: n.creationTime ? new Date(n.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: n.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        N,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => i(l === n.id ? null : n.id),
          children: "Yanıtla"
        }
      ) }),
      l === n.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: o,
            onChange: (u) => c(u.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(N, { variant: "ghost", size: "sm", onClick: () => i(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(N, { variant: "primary", size: "sm", disabled: !o.trim() || x, onClick: () => y(n.id), children: "Gönder" })
        ] })
      ] }),
      n.replies && n.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: n.replies.map((u) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: u.creatorUserName || u.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: u.creationTime ? new Date(u.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: u.text })
      ] }, u.id)) })
    ] }, n.id)) })
  ] });
}
function Pt({ task: t }) {
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
function Ot({ task: t }) {
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
function Mt({ taskId: t, task: a }) {
  const [s, r] = d.useState("Month"), l = [
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
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-3", children: l.map((i) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-3 rounded-xl bg-surface-sunken/40 border border-subtle/50 hover:bg-surface-hover/60 transition-all", children: [
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
function Yt({ taskId: t, task: a }) {
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
      /* @__PURE__ */ e.jsx(N, { size: "sm", variant: "outline", icon: "fa-plus", children: "Bağımlılık Ekle" })
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
function $t({ taskId: t, task: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-coins text-success text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Görev Bütçesi & Maliyet Analizi" })
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "text-xs font-mono font-bold bg-success-subtle text-success px-2.5 py-1 rounded-lg", children: "Bütçe Sağlıklı" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "p-4 rounded-xl bg-surface-sunken/40 border border-subtle flex flex-col gap-1", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-text-tertiary uppercase tracking-wider", children: "Tahsis Edilen Bütçe" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-2xl font-bold text-text-primary", children: "₺ 120.000" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "p-4 rounded-xl bg-surface-sunken/40 border border-subtle flex flex-col gap-1", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-text-tertiary uppercase tracking-wider", children: "Harcanan Tutar" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-2xl font-bold text-primary", children: "₺ 84.500" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "p-4 rounded-xl bg-surface-sunken/40 border border-subtle flex flex-col gap-1", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-text-tertiary uppercase tracking-wider", children: "Kalan Bütçe" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-2xl font-bold text-success", children: "₺ 35.500" })
      ] })
    ] })
  ] });
}
function qt() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-warning text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Risk Yönetimi" })
      ] }),
      /* @__PURE__ */ e.jsx(N, { size: "sm", variant: "outline", icon: "fa-plus", children: "Yeni Risk Bildir" })
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
function Vt() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-stamp text-primary text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Onay Süreçleri & İmza Akışı" })
      ] }),
      /* @__PURE__ */ e.jsx(N, { size: "sm", variant: "primary", icon: "fa-check", children: "Onay İste" })
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
function Ut() {
  const [t, a] = d.useState(!1);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-stopwatch text-primary text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Zaman Takibi & Sayaç" })
      ] }),
      /* @__PURE__ */ e.jsx(
        N,
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
function _t() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-sparkles text-indigo-600 text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Apya AI Asistan & Analiz" })
      ] }),
      /* @__PURE__ */ e.jsx(N, { size: "sm", variant: "primary", icon: "fa-wand-magic-sparkles", children: "Görevi Analiz Et" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 flex flex-col gap-2", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-indigo-900 dark:text-indigo-200", children: "AI Önerisi:" }),
      /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-indigo-700 dark:text-indigo-300 leading-relaxed", children: "Sözleşme taslağı incelendiğinde ödeme takviminin 15 gün vadeli olduğu tespit edildi. Finans ekibine bildirim gönderilmesi tavsiye edilir." })
    ] })
  ] });
}
function Ht() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-square-plus text-success text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Özel Alanlar (Custom Fields)" })
      ] }),
      /* @__PURE__ */ e.jsx(N, { size: "sm", variant: "outline", icon: "fa-plus", children: "Alan Ekle" })
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
function Qt() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-wand-magic-sparkles text-indigo-600 text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Görev Otomasyonları" })
      ] }),
      /* @__PURE__ */ e.jsx(N, { size: "sm", variant: "outline", icon: "fa-plus", children: "Kural Ekle" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "p-3.5 rounded-xl border border-subtle bg-surface-sunken/40 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-medium text-text-primary", children: "Görev 'Tamamlandı' olunca ilgili faturayı otomatik oluştur." }),
      /* @__PURE__ */ e.jsx("span", { className: "text-xs font-bold text-success bg-success-subtle px-2 py-0.5 rounded", children: "Aktif" })
    ] })
  ] });
}
function Zt() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-envelope text-primary text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Bağlantılı E-postalar" })
      ] }),
      /* @__PURE__ */ e.jsx(N, { size: "sm", variant: "outline", icon: "fa-plus", children: "E-posta Bağla" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "p-3.5 rounded-xl border border-subtle bg-surface-sunken/40 flex flex-col gap-1", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: "Otel Rezervasyon Teyidi ve Sözleşme Eki" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary", children: "Gönderen: info@hilton.com • 10.07.2026 09:15" })
    ] })
  ] });
}
function Wt() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-image text-indigo-600 text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "Görsel Dosya Galerisi" })
      ] }),
      /* @__PURE__ */ e.jsx(N, { size: "sm", variant: "outline", icon: "fa-upload", children: "Görsel Yükle" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-3 gap-3", children: ["Otel_Lobi.jpg", "Oda_Tasarim.jpg", "Sozlesme_Imza.jpg"].map((t, a) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 p-2 rounded-xl border border-subtle bg-surface-sunken/40 items-center text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "h-20 w-full bg-surface-base rounded-lg flex items-center justify-center text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-image text-2xl" }) }),
      /* @__PURE__ */ e.jsx("span", { className: "text-xs font-medium text-text-primary truncate w-full mt-1", children: t })
    ] }, a)) })
  ] });
}
function Jt() {
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
    component: Et
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
    component: Rt
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
    component: Lt
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
    component: Mt
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
    component: Yt
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
    component: $t
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
    component: Ot
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
    component: Pt
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
    component: Ft
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
    component: qt
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
    component: Vt
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
    component: Ut
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
    component: Jt
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
    component: _t
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
    component: Ht
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
    component: Qt
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
    component: Zt
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
    component: Wt
  }
];
function tt(t = []) {
  const a = new Set(t);
  return Ae.filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function Xt(t = []) {
  const a = new Set(t);
  return Ae.filter((s) => !s.isCore).filter((s) => !s.permission || Ue(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let de = null;
const je = /* @__PURE__ */ new Set(), ke = /* @__PURE__ */ new Set();
function Re() {
  je.forEach((t) => t());
}
function es(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const H = {
  open(t) {
    const a = es(t);
    !a || a === de || (de = a, Re());
  },
  close() {
    de !== null && (de = null, Re());
  },
  subscribe(t) {
    return je.add(t), () => je.delete(t);
  },
  getSnapshot() {
    return de;
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
    de = null, je.clear(), ke.clear();
  }
}, Ge = "apya.taskDetail.fullscreen";
function st({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, l] = d.useState(t), [i, o] = d.useState([]), { data: c, isLoading: x, isError: b, refetch: f } = Ve(r), p = _e(), g = Ze(c), y = We(), n = Je(r), [u, h] = d.useState("general"), [j, v] = d.useState(!1), S = xe.useRef(null), K = d.useMemo(
    () => tt(n.assignedCodes),
    [n.assignedCodes]
  ), z = d.useMemo(
    () => Xt(n.assignedCodes),
    [n.assignedCodes]
  ), E = K.find((k) => k.code === u) ?? K[0];
  xe.useEffect(() => {
    E.code !== u && h(E.code);
  }, [E, u]);
  const $ = E == null ? void 0 : E.component, P = J(), [X, W] = d.useState(
    () => {
      var k;
      return ((k = window.localStorage) == null ? void 0 : k.getItem(Ge)) === "1";
    }
  ), [ie, ee] = d.useState(!1), T = d.useCallback(() => {
    Ct(), s == null || s();
  }, [s]);
  Qe(t, T), xe.useEffect(() => {
    g.isDirty ? p.markDirty() : p.markClean();
  });
  const R = d.useCallback(() => p.requestClose(T), [p, T]), q = d.useCallback(() => {
    W((k) => {
      var B;
      const I = !k;
      return (B = window.localStorage) == null || B.setItem(Ge, I ? "1" : "0"), I;
    });
  }, []), U = Ue("Platform.Tasks.Delete"), [O, M] = d.useState(!1), [m, w] = d.useState(!1), C = d.useCallback(async () => {
    var k, I, B, _, L, he;
    w(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (B = (I = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : I.info) == null || B.call(I, "Başarıyla silindi."), M(!1), p.markClean(), T();
    } catch (ne) {
      (he = (L = (_ = window == null ? void 0 : window.abp) == null ? void 0 : _.notify) == null ? void 0 : L.error) == null || he.call(L, (ne == null ? void 0 : ne.message) || "Görev silinemedi.");
    } finally {
      w(!1);
    }
  }, [r, p, T]), A = d.useCallback(async () => {
    var k, I, B, _, L, he;
    if (!g.validate()) return !1;
    ee(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, g.toUpdateDto())
      ), await P.invalidateQueries({ queryKey: ["task-detail", r] }), H.emitResult(), (B = (I = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : I.success) == null || B.call(I, "Kaydedildi."), !0;
    } catch (ne) {
      return (he = (L = (_ = window == null ? void 0 : window.abp) == null ? void 0 : _.notify) == null ? void 0 : L.error) == null || he.call(L, (ne == null ? void 0 : ne.message) || "Kaydedilemedi."), !1;
    } finally {
      ee(!1);
    }
  }, [r, g, p, P]), D = d.useCallback(() => {
    A();
  }, [A]), G = d.useCallback(async () => {
    const k = p.resolvePendingClose("save");
    await A() && (k == null || k());
  }, [p, A]), F = d.useCallback((k, I) => {
    p.requestClose(() => {
      o((B) => [...B, { id: r, title: (c == null ? void 0 : c.title) ?? "" }]), l(k), h("general"), p.markClean();
    });
  }, [p, r, c]), Y = d.useCallback((k) => {
    p.requestClose(() => {
      o((I) => {
        const B = I.findIndex((_) => _.id === k);
        return B === -1 ? I : I.slice(0, B);
      }), l(k), h("general"), p.markClean();
    });
  }, [p]), Q = d.useCallback(async (k) => {
    var I, B, _;
    try {
      await n.addFeature(k), h(k), v(!1);
    } catch (L) {
      (_ = (B = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : B.error) == null || _.call(B, (L == null ? void 0 : L.message) || "Özellik eklenemedi.");
    }
  }, [n]), Z = d.useCallback(async (k) => {
    var I, B, _;
    try {
      await n.removeFeature(k), h((L) => L === k ? "general" : L);
    } catch (L) {
      (_ = (B = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : B.error) == null || _.call(B, (L == null ? void 0 : L.message) || "Özellik kaldırılamadı.");
    }
  }, [n]);
  xe.useEffect(() => {
    if (!j) return;
    const k = (B) => {
      S.current && !S.current.contains(B.target) && v(!1);
    }, I = (B) => {
      B.key === "Escape" && v(!1);
    };
    return document.addEventListener("mousedown", k), document.addEventListener("keydown", I), () => {
      document.removeEventListener("mousedown", k), document.removeEventListener("keydown", I);
    };
  }, [j]);
  const le = x ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(re, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(re, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(re, { className: "h-24 w-full" })
  ] }) : b ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(N, { variant: "ghost", onClick: () => f(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      Nt,
      {
        trail: i,
        current: { id: r, title: (c == null ? void 0 : c.title) ?? "" },
        onNavigate: Y
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: S, children: [
      /* @__PURE__ */ e.jsx(
        gt,
        {
          tabs: K,
          activeCode: E.code,
          onSelect: (k) => {
            h(k), v(!1);
          },
          onOpenPicker: () => v((k) => !k),
          pickerOpen: j
        }
      ),
      j && /* @__PURE__ */ e.jsx(
        jt,
        {
          entries: z,
          busyCode: n.isMutating ? n.mutatingCode : null,
          onAdd: Q,
          onRemove: Z
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
            ft,
            {
              values: g.values,
              errors: g.errors,
              onFieldChange: g.setField,
              assigneeOptions: y.options,
              isLoadingAssignees: y.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(d.Suspense, { fallback: /* @__PURE__ */ e.jsx(re, { className: "h-24 w-full" }), children: $ && /* @__PURE__ */ e.jsx(
            $,
            {
              taskId: r,
              task: c,
              onOpenSubtask: F
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            bt,
            {
              task: c,
              creatorName: y.nameById.get(c.creatorId),
              lastModifierName: y.nameById.get(c.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), V = a === "page" ? ot : nt;
  return /* @__PURE__ */ e.jsxs(
    V,
    {
      open: !0,
      fullscreen: X,
      onRequestClose: R,
      title: c ? `Görev Detayı: ${c.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        dt,
        {
          task: c ?? { title: "Yükleniyor…" },
          canDelete: U,
          fullscreen: X,
          onToggleFullscreen: q,
          onClose: R,
          onDelete: () => M(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        ut,
        {
          lastSavedAt: c == null ? void 0 : c.lastModificationTime,
          isDirty: p.isDirty,
          isSaving: ie,
          onCancel: R,
          onSave: D
        }
      ),
      children: [
        le,
        p.pendingClose && /* @__PURE__ */ e.jsx(
          ss,
          {
            isSaving: ie,
            onStay: () => p.resolvePendingClose("stay"),
            onDiscard: () => p.resolvePendingClose("discard"),
            onSaveAndClose: G
          }
        ),
        O && /* @__PURE__ */ e.jsx(
          ts,
          {
            taskTitle: (c == null ? void 0 : c.title) ?? "",
            busy: m,
            onCancel: () => M(!1),
            onConfirm: C
          }
        )
      ]
    }
  );
}
function ts({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [l, i] = d.useState(""), o = l.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    at,
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
        /* @__PURE__ */ e.jsx(N, { variant: "secondary", onClick: s, disabled: a, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          N,
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
            value: l,
            onChange: (c) => i(c.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function at({ label: t, title: a, description: s, children: r, actions: l }) {
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
        /* @__PURE__ */ e.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: l })
      ] })
    }
  );
}
function ss({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    at,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(N, { variant: "secondary", onClick: a, disabled: t, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ e.jsx(N, { variant: "destructive", onClick: s, disabled: t, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ e.jsx(N, { variant: "primary", onClick: r, isLoading: t, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
function as() {
  return /* @__PURE__ */ e.jsxs(ue, { children: [
    /* @__PURE__ */ e.jsx(me, { asChild: !0, children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-default transition-all shadow-sm", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-lock text-[11px] text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { children: "Sınırlı erişim" }),
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[10px] ml-0.5 text-text-tertiary" })
    ] }) }),
    /* @__PURE__ */ e.jsx(pe, { children: /* @__PURE__ */ e.jsxs(
      fe,
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
                  N,
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
          /* @__PURE__ */ e.jsx(qe, { className: "fill-surface-base stroke-subtle" })
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
function rs({
  task: t = {},
  onClose: a,
  onToggleFullscreen: s,
  isFullscreen: r,
  presentation: l = "modal",
  onFieldChange: i = () => {
  }
}) {
  const [o, c] = d.useState(!1), [x, b] = d.useState(!1), [f, p] = d.useState(t.status || 4), [g, y] = d.useState(t.priority || 4), n = Ce.find((v) => v.id === f) || Ce[3], u = Te.find((v) => v.id === g) || Te[3], h = t.code || (t.id ? `#OTL-${t.id.substring(0, 4).toUpperCase()}` : "#OTL-2507"), j = () => {
    var v, S, K, z;
    (v = navigator.clipboard) == null || v.writeText(h), b(!0), (z = (K = (S = window == null ? void 0 : window.abp) == null ? void 0 : S.notify) == null ? void 0 : K.success) == null || z.call(K, `${h} panoya kopyalandı.`), setTimeout(() => b(!1), 2e3);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex flex-col gap-3.5 border-b border-subtle/80 bg-surface-base px-6 py-5", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 min-w-0 flex-1", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 flex-wrap", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: j,
            title: "Kodu Kopyala",
            className: "group flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary-subtle/60 border border-primary/20 text-primary font-mono text-[11px] font-bold tracking-wider hover:bg-primary-subtle hover:border-primary/40 transition-all shadow-xs",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[10px]" }),
              /* @__PURE__ */ e.jsx("span", { children: h.replace("#", "") }),
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x ? "fa-check text-success" : "fa-copy opacity-50 group-hover:opacity-100"} text-[10px] ml-0.5 transition-all` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(ue, { children: [
          /* @__PURE__ */ e.jsx(me, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold border transition-all cursor-pointer shadow-xs hover:opacity-90 ${n.color}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${n.dot} animate-pulse` }),
                /* @__PURE__ */ e.jsx("span", { children: n.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] opacity-70 ml-0.5" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(pe, { children: /* @__PURE__ */ e.jsxs(
            fe,
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
                      p(v.id), i("status", v.id);
                    },
                    className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${f === v.id ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${v.dot}` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: v.label }),
                      f === v.id && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ]
                  },
                  v.id
                )) })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ e.jsxs(ue, { children: [
          /* @__PURE__ */ e.jsx(me, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold border border-subtle transition-all cursor-pointer shadow-xs hover:bg-surface-hover ${u.color}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-[11px]` }),
                /* @__PURE__ */ e.jsx("span", { children: u.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] opacity-70 ml-0.5" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(pe, { children: /* @__PURE__ */ e.jsxs(
            fe,
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
                      y(v.id), i("priority", v.id);
                    },
                    className: `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-left transition-colors ${g === v.id ? "bg-primary-subtle text-primary font-bold" : "text-text-primary hover:bg-surface-hover"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${v.icon} text-xs` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: v.label }),
                      g === v.id && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ]
                  },
                  v.id
                )) })
              ]
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 mt-1 group", children: [
        /* @__PURE__ */ e.jsx(
          "h1",
          {
            contentEditable: !0,
            suppressContentEditableWarning: !0,
            onBlur: (v) => i("title", v.currentTarget.textContent),
            className: "text-[23px] font-bold tracking-tight text-text-primary hover:text-primary transition-colors focus:outline-none focus:bg-surface-sunken/40 px-1.5 py-0.5 -mx-1.5 rounded-lg cursor-text leading-tight truncate",
            children: t.title || "Otel Konaklama Anlaşması"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => c(!o),
            className: `flex h-8 w-8 items-center justify-center rounded-lg transition-all ${o ? "text-amber-500 bg-amber-50 dark:bg-amber-950/30 scale-110" : "text-text-tertiary hover:bg-surface-hover hover:text-amber-500"}`,
            title: o ? "Favorilerden çıkar" : "Favorilere ekle",
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-${o ? "solid" : "regular"} fa-star text-lg transition-transform` })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
      /* @__PURE__ */ e.jsx(as, {}),
      /* @__PURE__ */ e.jsx("div", { className: "h-5 w-px bg-subtle mx-1" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1", children: [
        l === "modal" && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: s,
            title: r ? "Küçült" : "Tam Ekran",
            className: "flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors",
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r ? "fa-compress" : "fa-expand"} text-xs` })
          }
        ),
        /* @__PURE__ */ e.jsxs(ue, { children: [
          /* @__PURE__ */ e.jsx(me, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer Seçenekler",
              className: "flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(pe, { children: /* @__PURE__ */ e.jsxs(
            fe,
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
        l === "modal" && /* @__PURE__ */ e.jsx(
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
function se({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-bold text-text-tertiary uppercase tracking-wider select-none", children: t }),
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center text-[13px] text-text-primary h-8 min-w-0", children: a })
  ] });
}
function is({
  task: t = {},
  assigneeOptions: a = [],
  onFieldChange: s = () => {
  }
}) {
  const [r, l] = d.useState(
    Array.isArray(t.tags) && t.tags.length > 0 ? t.tags : ["Konaklama", "Anlaşma"]
  ), [i, o] = d.useState(""), [c, x] = d.useState(!1), b = (n) => {
    if (n.key === "Enter" || n.type === "blur") {
      const u = i.trim();
      if (u && !r.includes(u)) {
        const h = [...r, u];
        l(h), s("tags", h);
      }
      o(""), x(!1);
    }
  }, f = (n) => {
    const u = r.filter((h) => h !== n);
    l(u), s("tags", u);
  }, p = (n) => {
    if (!n) return "—";
    const u = new Date(n);
    return isNaN(u.getTime()) ? n : u.toISOString().split("T")[0];
  }, g = t.assigneeName || "Yakup B.", y = `https://ui-avatars.com/api/?name=${encodeURIComponent(g)}&background=6366f1&color=fff&size=64`;
  return /* @__PURE__ */ e.jsx("div", { className: "px-[var(--apya-space-6)] py-[var(--apya-space-5)] bg-surface-base border-b border-subtle", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-y-[var(--apya-space-5)] gap-x-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsx(se, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(ue, { children: [
      /* @__PURE__ */ e.jsx(me, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group focus-visible:outline-none focus-visible:shadow-focus",
          children: [
            /* @__PURE__ */ e.jsx("img", { src: y, alt: g, className: "h-6 w-6 rounded-full border border-subtle shrink-0 object-cover" }),
            /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary text-[13px] group-hover:text-primary transition-colors", children: g }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] text-text-tertiary ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(pe, { children: /* @__PURE__ */ e.jsxs(
        fe,
        {
          sideOffset: 6,
          align: "start",
          className: "z-50 w-56 rounded-xl border border-subtle bg-surface-base p-2 shadow-float animate-in fade-in-50 zoom-in-95",
          children: [
            /* @__PURE__ */ e.jsx("div", { className: "text-[11px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1 mb-1", children: "Kişi Ata" }),
            /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1 max-h-48 overflow-y-auto custom-scrollbar", children: ["Yakup B.", "Elif A.", "Mehmet K.", "Ayşe D."].map((n) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => s("assigneeName", n),
                className: `flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-left transition-colors ${g === n ? "bg-primary-subtle text-primary font-semibold" : "text-text-primary hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("img", { src: `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=6366f1&color=fff&size=64`, alt: n, className: "h-5 w-5 rounded-full" }),
                  /* @__PURE__ */ e.jsx("span", { children: n })
                ]
              },
              n
            )) })
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ e.jsx(se, { label: "Son Tarih", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors group relative", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          value: p(t.dueDate),
          onChange: (n) => s("dueDate", n.target.value),
          className: "bg-transparent text-text-primary text-[13px] font-medium focus:outline-none cursor-pointer"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(se, { label: "Başlangıç", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors group relative", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          value: p(t.startDate),
          onChange: (n) => s("startDate", n.target.value),
          className: "bg-transparent text-text-primary text-[13px] font-medium focus:outline-none cursor-pointer"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(se, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 text-[13px] font-medium", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 text-negative bg-negative-subtle px-2.5 py-0.5 rounded-md font-semibold", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-flag text-xs" }),
      /* @__PURE__ */ e.jsx("span", { children: "Kritik" })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(se, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 text-[13px] font-medium", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 text-success bg-success-subtle px-2.5 py-0.5 rounded-md font-semibold", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-circle-check text-xs" }),
      /* @__PURE__ */ e.jsx("span", { children: "Tamamlandı" })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(se, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
      r.map((n) => /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "group inline-flex items-center gap-1 bg-primary-subtle text-primary text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors",
          children: [
            /* @__PURE__ */ e.jsx("span", { children: n }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: () => f(n),
                className: "opacity-0 group-hover:opacity-100 hover:text-negative transition-opacity ml-0.5",
                "aria-label": "Etiketi kaldır",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
              }
            )
          ]
        },
        n
      )),
      c ? /* @__PURE__ */ e.jsx(
        "input",
        {
          autoFocus: !0,
          type: "text",
          value: i,
          onChange: (n) => o(n.target.value),
          onKeyDown: b,
          onBlur: b,
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
    /* @__PURE__ */ e.jsx(se, { label: "Proje", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary group-hover:text-primary transition-colors text-[13px] truncate max-w-[140px]", children: t.projectName || "Otel Projesi" })
    ] }) }),
    /* @__PURE__ */ e.jsx(se, { label: "Maliyet Merkezi", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-bullseye text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary group-hover:text-primary transition-colors text-[13px]", children: "Merkez" })
    ] }) })
  ] }) });
}
function ls({
  activeTab: t = "general",
  onTabChange: a = () => {
  },
  visibleTabs: s = []
}) {
  const r = (l) => l === "subtasks" ? 4 : l === "files" ? 8 : l === "dependencies" ? 2 : null;
  return /* @__PURE__ */ e.jsx("nav", { className: "flex items-center gap-1 overflow-x-auto custom-scrollbar py-2", "aria-label": "Görev Sekmeleri", children: s.map((l) => {
    const i = t === l.code, o = r(l.code);
    return /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: () => a(l.code),
        className: `relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap select-none ${i ? "text-primary bg-primary-subtle/80 shadow-xs" : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"}`,
        children: [
          /* @__PURE__ */ e.jsx("span", { children: l.title }),
          o !== null && /* @__PURE__ */ e.jsx("span", { className: `flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full text-[10px] font-bold ${i ? "bg-primary text-white" : "bg-surface-sunken text-text-tertiary"}`, children: o }),
          i && /* @__PURE__ */ e.jsx("span", { className: "absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" })
        ]
      },
      l.code
    );
  }) });
}
function ae({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-start py-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary text-right font-medium max-w-[150px] truncate", title: typeof a == "string" ? a : "", children: a ?? "—" })
  ] });
}
function Le({ label: t, name: a, avatar: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-center py-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("img", { src: s, alt: a, className: "w-5 h-5 rounded-full border border-subtle object-cover" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary font-semibold", children: a })
    ] })
  ] });
}
function ns({ task: t = {}, onDelete: a = () => {
} }) {
  const [s, r] = d.useState(!1), [l, i] = d.useState(!1), [o, c] = d.useState(!1), x = J(), b = (y) => y ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(y)) : "25.06.2026 14:30", f = () => {
    var n, u, h, j;
    const y = `${window.location.origin}/Tasks?task=${t.id || ""}`;
    (n = navigator.clipboard) == null || n.writeText(y), (j = (h = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : h.success) == null || j.call(h, "Görev bağlantısı panoya kopyalandı!");
  }, p = async () => {
    var y, n, u, h, j, v, S, K, z, E, $;
    if (!(!t || l)) {
      i(!0);
      try {
        const P = (u = (n = (y = window == null ? void 0 : window.apya) == null ? void 0 : y.platform) == null ? void 0 : n.tasks) == null ? void 0 : u.task;
        if (P) {
          const X = {
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
          }, W = await Promise.resolve(P.create(X));
          await x.invalidateQueries({ queryKey: ["task-detail"] }), (v = (j = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : j.success) == null || v.call(j, "Görev başarıyla çoğaltıldı!"), (K = (S = window.apya) == null ? void 0 : S.taskDetail) != null && K.open && W && window.apya.taskDetail.open(W);
        }
      } catch (P) {
        ($ = (E = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : E.error) == null || $.call(E, (P == null ? void 0 : P.message) || "Görev çoğaltılamadı.");
      } finally {
        i(!1);
      }
    }
  }, g = async () => {
    var y, n, u, h, j, v, S, K, z;
    if (!(!t.id || o)) {
      c(!0);
      try {
        const E = (u = (n = (y = window == null ? void 0 : window.apya) == null ? void 0 : y.platform) == null ? void 0 : n.tasks) == null ? void 0 : u.task;
        E && (await Promise.resolve(E.updateStatus(t.id, 4)), await x.invalidateQueries({ queryKey: ["task-detail", t.id] }), (v = (j = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : j.info) == null || v.call(j, "Görev arşivlendi (Tamamlandı)."));
      } catch (E) {
        (z = (K = (S = window == null ? void 0 : window.abp) == null ? void 0 : S.notify) == null ? void 0 : K.error) == null || z.call(K, (E == null ? void 0 : E.message) || "Görev arşivlenemedi.");
      } finally {
        c(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs flex flex-col", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary mb-2", children: "Detaylar" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col divide-y divide-subtle/50", children: [
        /* @__PURE__ */ e.jsx(
          Le,
          {
            label: "Oluşturan",
            name: t.creatorName || "Yakup B.",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.creatorName || "Yakup B.")}&background=6366f1&color=fff&size=64`
          }
        ),
        /* @__PURE__ */ e.jsx(ae, { label: "Oluşturma Tarihi", value: b(t.creationTime) }),
        /* @__PURE__ */ e.jsx(
          Le,
          {
            label: "Güncelleyen",
            name: t.lastModifierName || "Yakup B.",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.lastModifierName || "Yakup B.")}&background=6366f1&color=fff&size=64`
          }
        ),
        /* @__PURE__ */ e.jsx(ae, { label: "Son Güncelleme", value: b(t.lastModificationTime) }),
        /* @__PURE__ */ e.jsx(ae, { label: "Oluşturma Paneli", value: "25.06.2026 14:30" }),
        /* @__PURE__ */ e.jsx(ae, { label: "Tahmini Süre", value: "15 gün" }),
        /* @__PURE__ */ e.jsx(ae, { label: "Gerçekleşen Süre", value: "12 gün" }),
        s && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col divide-y divide-subtle/50 animate-in fade-in-50", children: [
          /* @__PURE__ */ e.jsx(ae, { label: "Özel Alanlar", value: "Vize, Otel" }),
          /* @__PURE__ */ e.jsx(ae, { label: "Kategori", value: "Operasyon" }),
          /* @__PURE__ */ e.jsx(ae, { label: "SLA Seviyesi", value: "Standart (48s)" })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => r(!s),
          className: "mt-3 text-[13px] font-semibold text-primary hover:text-primary-hover flex items-center justify-center gap-1.5 transition-colors py-1 rounded-lg hover:bg-primary-subtle",
          children: [
            /* @__PURE__ */ e.jsx("span", { children: s ? "Daha az alan göster" : "Daha fazla alan göster" }),
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid fa-chevron-down text-[10px] transition-transform ${s ? "rotate-180" : ""}` })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs flex flex-col gap-2.5", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary mb-1", children: "Hızlı işlemler" }),
      /* @__PURE__ */ e.jsx(
        N,
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
        N,
        {
          type: "button",
          variant: "outline",
          onClick: p,
          disabled: l,
          isLoading: l,
          className: "w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]",
          icon: "fa-copy",
          children: "Çoğalt"
        }
      ),
      /* @__PURE__ */ e.jsx(
        N,
        {
          type: "button",
          variant: "outline",
          onClick: g,
          disabled: o,
          isLoading: o,
          className: "w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]",
          icon: "fa-box-archive",
          children: "Arşivle"
        }
      ),
      /* @__PURE__ */ e.jsx(
        N,
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
function os({ onFormat: t = () => {
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
function cs({ task: t = {}, onFieldChange: a = () => {
} }) {
  const s = t == null ? void 0 : t.id, r = J(), [l, i] = d.useState(t.description || ""), o = (m, w = "") => {
    const C = document.getElementById("task-v3-desc-input");
    if (!C) return;
    const A = C.selectionStart, D = C.selectionEnd, G = l.substring(A, D) || "metin", F = `${m}${G}${w}`, Y = l.substring(0, A) + F + l.substring(D);
    i(Y), a("description", Y);
  }, c = et(s), [x, b] = d.useState(!0), [f, p] = d.useState(""), [g, y] = d.useState(!1), [n, u] = d.useState(!1), h = c.items && c.items.length > 0 ? c.items : [
    { id: "mock-1", text: "Otel listesi oluşturuldu", isDone: !0 },
    { id: "mock-2", text: "Fiyat teklifleri alındı", isDone: !0 },
    { id: "mock-3", text: "Sözleşme taslağı hazırlandı", isDone: !0 },
    { id: "mock-4", text: "Sözleşme imzalandı", isDone: !0 }
  ], j = h.filter((m) => m.isDone || m.done).length, v = async (m) => {
    var w, C, A, D, G, F;
    if (m.key === "Enter" || m.type === "blur") {
      const Y = f.trim();
      if (Y && s) {
        u(!0);
        try {
          await c.addItem(Y), (A = (C = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : C.success) == null || A.call(C, "Madde eklendi.");
        } catch (Q) {
          (F = (G = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : G.error) == null || F.call(G, (Q == null ? void 0 : Q.message) || "Madde eklenemedi.");
        } finally {
          u(!1);
        }
      }
      p(""), y(!1);
    }
  }, S = async (m) => {
    var w, C, A;
    if (!(typeof m == "string" && m.startsWith("mock-")))
      try {
        await c.toggleItem(m);
      } catch (D) {
        (A = (C = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : C.error) == null || A.call(C, (D == null ? void 0 : D.message) || "Durum güncellenemedi.");
      }
  }, K = async (m) => {
    var w, C, A, D, G, F;
    if (!(typeof m == "string" && m.startsWith("mock-")))
      try {
        await c.removeItem(m), (A = (C = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : C.info) == null || A.call(C, "Madde silindi.");
      } catch (Y) {
        (F = (G = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : G.error) == null || F.call(G, (Y == null ? void 0 : Y.message) || "Madde silinemedi.");
      }
  }, { data: z = [] } = be({
    queryKey: ["task-comments", s],
    queryFn: async () => {
      var w, C, A;
      const m = (A = (C = (w = window == null ? void 0 : window.apya) == null ? void 0 : w.platform) == null ? void 0 : C.tasks) == null ? void 0 : A.task;
      return !m || !s ? [] : await Promise.resolve(m.getComments(s));
    },
    enabled: !!s,
    staleTime: 1e4
  }), [E, $] = d.useState(""), [P, X] = d.useState(!0), [W, ie] = d.useState(!1), [ee, T] = d.useState(null), [R, q] = d.useState(""), U = z.length > 0 ? z : t.comments && t.comments.length > 0 ? t.comments : [
    {
      id: "mock-c1",
      creatorName: "Elif A.",
      creationTime: "2026-07-10T09:30:00Z",
      text: "@Yakup B. Sözleşme dosyası güncellendi, kontrol eder misiniz?"
    }
  ], O = async (m) => {
    var C, A, D, G, F, Y, Q, Z, le;
    m.preventDefault();
    const w = E.trim();
    if (!(!w || !s)) {
      ie(!0);
      try {
        const V = (D = (A = (C = window == null ? void 0 : window.apya) == null ? void 0 : C.platform) == null ? void 0 : A.tasks) == null ? void 0 : D.task;
        V && (await Promise.resolve(V.addComment(s, w)), await r.invalidateQueries({ queryKey: ["task-comments", s] }), await r.invalidateQueries({ queryKey: ["task-detail", s] }), (Y = (F = (G = window == null ? void 0 : window.abp) == null ? void 0 : G.notify) == null ? void 0 : F.success) == null || Y.call(F, "Yorum gönderildi.")), $("");
      } catch (V) {
        (le = (Z = (Q = window == null ? void 0 : window.abp) == null ? void 0 : Q.notify) == null ? void 0 : Z.error) == null || le.call(Z, (V == null ? void 0 : V.message) || "Yorum gönderilemedi.");
      } finally {
        ie(!1);
      }
    }
  }, M = async (m) => {
    var C, A, D, G, F, Y, Q, Z, le;
    const w = R.trim();
    if (!(!w || !s))
      try {
        const V = (D = (A = (C = window == null ? void 0 : window.apya) == null ? void 0 : C.platform) == null ? void 0 : A.tasks) == null ? void 0 : D.task;
        V && (await Promise.resolve(V.replyToComment(m, w)), await r.invalidateQueries({ queryKey: ["task-comments", s] }), (Y = (F = (G = window == null ? void 0 : window.abp) == null ? void 0 : G.notify) == null ? void 0 : F.success) == null || Y.call(F, "Yanıt gönderildi.")), q(""), T(null);
      } catch (V) {
        (le = (Z = (Q = window == null ? void 0 : window.abp) == null ? void 0 : Q.notify) == null ? void 0 : Z.error) == null || le.call(Z, (V == null ? void 0 : V.message) || "Yanıt gönderilemedi.");
      }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-2.5", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary", children: "Açıklama" }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-subtle bg-surface-base focus-within:border-primary focus-within:shadow-focus transition-all overflow-hidden shadow-xs", children: [
        /* @__PURE__ */ e.jsx(os, { onFormat: o }),
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            id: "task-v3-desc-input",
            className: "w-full min-h-[110px] p-4 text-[14px] leading-relaxed text-text-primary bg-transparent focus:outline-none resize-y font-sans",
            value: l,
            onChange: (m) => {
              i(m.target.value), a("description", m.target.value);
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
          onClick: () => b(!x),
          className: "flex items-center justify-between cursor-pointer select-none group",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors", children: "Kontrol Listesi" }),
              h.length > 0 && /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-text-tertiary bg-surface-sunken px-2 py-0.5 rounded-full", children: [
                j,
                "/",
                h.length
              ] })
            ] }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "text-text-tertiary group-hover:text-text-primary transition-colors", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid fa-chevron-up transition-transform duration-200 ${x ? "" : "rotate-180"}` }) })
          ]
        }
      ),
      x && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2.5 animate-in fade-in-50", children: [
        h.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden mb-1", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full bg-success transition-all duration-300",
            style: { width: `${j / h.length * 100}%` }
          }
        ) }),
        h.map((m) => {
          const w = m.isDone ?? m.done ?? !1;
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
                      checked: w,
                      onChange: () => S(m.id),
                      className: "h-4 w-4 rounded border-subtle text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `text-[13px] transition-all truncate ${w ? "line-through text-text-tertiary font-normal" : "text-text-primary font-medium"}`, children: m.text })
                ] }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => K(m.id),
                    className: "opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-negative transition-all p-1",
                    title: "Maddeyi Sil",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-trash-can text-xs" })
                  }
                )
              ]
            },
            m.id
          );
        }),
        g ? /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 mt-1", children: /* @__PURE__ */ e.jsx(
          "input",
          {
            autoFocus: !0,
            type: "text",
            value: f,
            onChange: (m) => p(m.target.value),
            onKeyDown: v,
            onBlur: v,
            disabled: n,
            placeholder: "Yeni kontrol maddesi yazıp Enter'a basın...",
            className: "w-full h-9 px-3 text-[13px] rounded-lg border border-primary bg-surface-base focus:outline-none"
          }
        ) }) : /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => y(!0),
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
          onClick: () => X(!P),
          className: "flex items-center justify-between cursor-pointer select-none group",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors", children: "Yorumlar & Güncellemeler" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-primary-subtle text-primary text-[11px] font-bold", children: U.length })
            ] }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "text-text-tertiary group-hover:text-text-primary transition-colors", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid fa-chevron-up transition-transform duration-200 ${P ? "" : "rotate-180"}` }) })
          ]
        }
      ),
      P && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-5 animate-in fade-in-50", children: [
        /* @__PURE__ */ e.jsxs("form", { onSubmit: O, className: "flex gap-3 items-start", children: [
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
                onChange: (m) => $(m.target.value),
                placeholder: "Bir yorum yazın... (@bahset, #görev)",
                rows: 2,
                className: "w-full p-3 text-[13px] bg-transparent focus:outline-none resize-none text-text-primary",
                onKeyDown: (m) => {
                  m.key === "Enter" && (m.ctrlKey || m.metaKey) && O(m);
                }
              }
            ),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-t border-subtle/50 bg-surface-base", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 text-text-tertiary", children: [
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => $((m) => m + " [Dosya] "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Dosya Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => $((m) => m + " [Görsel] "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Resim Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-image text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => $((m) => m + " 👍 "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Emoji", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-face-smile text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => $((m) => m + " @Yakup B. "), className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Bahset (@)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-at text-xs" }) })
              ] }),
              /* @__PURE__ */ e.jsx(
                N,
                {
                  type: "submit",
                  size: "sm",
                  disabled: !E.trim() || W,
                  isLoading: W,
                  className: "bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 h-8 rounded-lg shadow-sm",
                  icon: "fa-paper-plane",
                  children: "Gönder"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-4 divide-y divide-subtle/50", children: U.map((m) => {
          const w = m.creatorName || m.author || "Yakup B.", C = `https://ui-avatars.com/api/?name=${encodeURIComponent(w)}&background=6366f1&color=fff&size=64`, A = m.creationTime ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(m.creationTime)) : m.date || "10.07.2026 09:30";
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-3 pt-3 items-start first:pt-0", children: [
            /* @__PURE__ */ e.jsx("img", { src: C, alt: w, className: "h-8 w-8 rounded-full border border-subtle shrink-0 object-cover" }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col gap-1", children: [
              /* @__PURE__ */ e.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: w }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary font-mono", children: A })
              ] }) }),
              /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap", children: m.text.split(" ").map((D, G) => D.startsWith("@") ? /* @__PURE__ */ e.jsxs("span", { className: "font-semibold text-primary bg-primary-subtle px-1 py-0.5 rounded mr-1", children: [
                D,
                " "
              ] }, G) : D + " ") }),
              /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-4 mt-1", children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => T(ee === m.id ? null : m.id),
                  className: "text-xs font-semibold text-text-tertiary hover:text-primary transition-colors flex items-center gap-1",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                    /* @__PURE__ */ e.jsx("span", { children: "Yanıtla" })
                  ]
                }
              ) }),
              ee === m.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex gap-2 items-center animate-in fade-in-50", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: R,
                    onChange: (D) => q(D.target.value),
                    placeholder: `@${w} kullanıcısına yanıt ver...`,
                    onKeyDown: (D) => {
                      D.key === "Enter" && M(m.id);
                    },
                    className: "flex-1 h-8 px-3 text-[12px] rounded-lg border border-primary bg-surface-base focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(N, { size: "sm", onClick: () => M(m.id), className: "h-8 text-xs bg-primary text-white", children: "Yanıtla" })
              ] })
            ] })
          ] }, m.id);
        }) })
      ] })
    ] })
  ] });
}
function ds({
  lastSavedAt: t,
  isDirty: a,
  isSaving: s,
  onCancel: r,
  onSave: l
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
        N,
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
        N,
        {
          type: "button",
          variant: "primary",
          size: "sm",
          onClick: l,
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
const Fe = [
  {
    id: 1,
    user: "Yakup B.",
    avatar: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64",
    type: "status",
    category: "field",
    icon: "fa-arrows-rotate",
    iconColor: "text-primary bg-primary-subtle",
    text: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      "Görev durumu ",
      /* @__PURE__ */ e.jsx("strong", { className: "text-success font-semibold", children: "Tamamlandı" }),
      " olarak değiştirildi"
    ] }),
    date: "10.07.2026 09:45"
  },
  {
    id: 2,
    user: "Elif A.",
    avatar: "https://ui-avatars.com/api/?name=Elif+A&background=ec4899&color=fff&size=64",
    type: "file",
    category: "files",
    icon: "fa-paperclip",
    iconColor: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40",
    text: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      "Dosya eklendi: ",
      /* @__PURE__ */ e.jsx("strong", { className: "text-primary hover:underline cursor-pointer", children: "Sözleşme_v2.pdf" })
    ] }),
    date: "10.07.2026 09:30"
  },
  {
    id: 3,
    user: "Yakup B.",
    avatar: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64",
    type: "date",
    category: "field",
    icon: "fa-calendar",
    iconColor: "text-warning bg-warning-subtle",
    text: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      "Son tarih ",
      /* @__PURE__ */ e.jsx("strong", { className: "line-through opacity-70", children: "12.07.2026" }),
      "'dan ",
      /* @__PURE__ */ e.jsx("strong", { children: "10.07.2026" }),
      " olarak değiştirildi"
    ] }),
    date: "09.07.2026 16:20"
  },
  {
    id: 4,
    user: "Mehmet K.",
    avatar: "https://ui-avatars.com/api/?name=Mehmet+K&background=10b981&color=fff&size=64",
    type: "comment",
    category: "comments",
    icon: "fa-comment",
    iconColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
    text: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      "Yorum yaptı: ",
      /* @__PURE__ */ e.jsx("span", { className: "italic text-text-secondary", children: '"Otel kapasitesi onaylandı."' })
    ] }),
    date: "09.07.2026 11:10"
  },
  {
    id: 5,
    user: "Sistem",
    avatar: "",
    type: "system",
    category: "system",
    icon: "fa-gear",
    iconColor: "text-text-tertiary bg-surface-sunken",
    text: /* @__PURE__ */ e.jsx(e.Fragment, { children: "Görev oluşturuldu" }),
    date: "25.06.2026 14:30"
  }
];
function xs() {
  const [t, a] = d.useState("all"), s = t === "all" ? Fe : Fe.filter((r) => r.category === t);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6 shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-timeline text-primary text-base" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "AKTİVİTE & GEÇMİŞ TAKİBİ" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1", children: [
        { id: "all", label: "Tümü" },
        { id: "field", label: "Alan Değişiklikleri" },
        { id: "comments", label: "Yorumlar" },
        { id: "files", label: "Dosyalar" },
        { id: "system", label: "Sistem" },
        { id: "finance", label: "Finans" }
      ].map((r) => /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => a(r.id),
          className: `px-3 py-1 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${t === r.id ? "bg-primary text-white shadow-sm" : "bg-surface-sunken text-text-secondary hover:bg-surface-hover hover:text-text-primary"}`,
          children: r.label
        },
        r.id
      )) })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "relative flex flex-col pl-4 before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-subtle/70", children: s.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "relative flex items-start gap-4 py-3 group", children: [
      /* @__PURE__ */ e.jsx("div", { className: "relative z-10 shrink-0", children: r.avatar ? /* @__PURE__ */ e.jsx(
        "img",
        {
          src: r.avatar,
          alt: r.user,
          className: "h-8 w-8 rounded-full border-2 border-surface-base shadow-xs object-cover"
        }
      ) : /* @__PURE__ */ e.jsx("div", { className: "h-8 w-8 rounded-full bg-surface-sunken border-2 border-surface-base flex items-center justify-center text-text-tertiary shadow-xs", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-server text-xs" }) }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-surface-sunken/40 group-hover:bg-surface-hover/80 border border-subtle/50 transition-all", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: `flex h-5 w-5 items-center justify-center rounded-full ${r.iconColor} text-[10px]`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r.icon}` }) }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: r.user }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-secondary", children: r.text })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary font-mono shrink-0", children: r.date })
      ] })
    ] }, r.id)) })
  ] });
}
const us = [
  {
    title: "GÖREV & PLANLAMA",
    items: [
      { code: "table", title: "Tablo", desc: "Veri tabloları oluşturun", icon: "fa-table-cells", color: "bg-primary-subtle text-primary" },
      { code: "gantt", title: "Gantt", desc: "Zaman çizelgesi görünümü", icon: "fa-bars-staggered", color: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600" },
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
      { code: "emails", title: "E-postalar", desc: "E-posta entegrasyonu", icon: "fa-envelope", color: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600" }
    ]
  },
  {
    title: "GEÇMİŞ & AKTİVİTE",
    items: [
      { code: "activity", title: "Aktiviteler", desc: "Aktivite akışı", icon: "fa-timeline", color: "bg-primary-subtle text-primary" },
      { code: "history", title: "Geçmiş", desc: "Kronolojik değişiklikler", icon: "fa-clock-rotate-left", color: "bg-primary-subtle text-primary" }
    ]
  },
  {
    title: "FİNANS & MEDYA",
    items: [
      { code: "finance", title: "Finans", desc: "Bütçe ve maliyetler", icon: "fa-coins", color: "bg-success-subtle text-success" },
      { code: "gallery", title: "Dosya Galerisi", desc: "Görsel dosya yönetimi", icon: "fa-image", color: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600" }
    ]
  },
  {
    title: "İLERİ ÖZELLİKLER",
    items: [
      { code: "custom-fields", title: "Özel Alanlar", desc: "Özel alanlar ekleyin", icon: "fa-square-plus", color: "bg-success-subtle text-success" },
      { code: "automations", title: "Otomasyonlar", desc: "Otomatik işlemler", icon: "fa-wand-magic-sparkles", color: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600" },
      { code: "ai", title: "Yapay Zeka", desc: "AI analiz ve öneriler", icon: "fa-sparkles", color: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600" }
    ]
  }
];
function ms({
  assignedCodes: t = [],
  onAddFeature: a = () => {
  }
}) {
  const [s, r] = d.useState(!1), l = (o) => t.includes(o), i = (o) => {
    a(o), r(!1);
  };
  return /* @__PURE__ */ e.jsxs(ue, { open: s, onOpenChange: r, children: [
    /* @__PURE__ */ e.jsx(me, { asChild: !0, children: /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        onClick: () => r(!s),
        className: "flex h-9 w-9 items-center justify-center rounded-xl border border-dashed border-primary/40 bg-primary-subtle/30 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all focus-visible:outline-none focus-visible:shadow-focus shadow-xs cursor-pointer active:scale-95",
        "aria-label": "Özellik ekle",
        title: "Özellik Ekle (+)",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-sm" })
      }
    ) }),
    /* @__PURE__ */ e.jsx(pe, { children: /* @__PURE__ */ e.jsxs(
      fe,
      {
        sideOffset: 10,
        align: "end",
        className: "z-[9999] w-[780px] rounded-2xl border border-subtle bg-surface-base p-6 shadow-2xl animate-in fade-in-50 zoom-in-95",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 max-h-[72vh] overflow-y-auto pr-2 custom-scrollbar", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-subtle", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shapes text-primary text-lg" }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("h3", { className: "text-[16px] font-bold text-text-primary tracking-wide", children: "ÖZELLİK EKLEME SİSTEMİ" }),
                  /* @__PURE__ */ e.jsx("p", { className: "text-[12px] text-text-tertiary", children: "Bir özelliğe tıklayarak göreve yeni sekme ve fonksiyon ekleyin." })
                ] })
              ] }),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => r(!1),
                  className: "h-8 w-8 rounded-lg flex items-center justify-center text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors",
                  children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-sm" })
                }
              )
            ] }),
            us.map((o) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx("h4", { className: "text-[11px] font-bold text-text-tertiary tracking-widest uppercase pl-1", children: o.title }),
              /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: o.items.map((c) => {
                const x = l(c.code);
                return /* @__PURE__ */ e.jsxs(
                  "div",
                  {
                    onClick: () => i(c.code),
                    className: `
                                                    group flex items-start gap-3.5 rounded-xl border p-3 transition-all cursor-pointer select-none
                                                    ${x ? "border-primary/50 bg-primary-subtle/40 shadow-xs ring-1 ring-primary/20" : "border-subtle bg-surface-base hover:border-primary/60 hover:bg-surface-hover hover:shadow-xs"}
                                                `,
                    children: [
                      /* @__PURE__ */ e.jsx("div", { className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.color} shadow-xs text-base`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c.icon}` }) }),
                      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-0.5 min-w-0 flex-1", children: [
                        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                          /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary group-hover:text-primary transition-colors truncate", children: c.title }),
                          x && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1 text-[11px] font-bold text-primary bg-primary-subtle px-1.5 py-0.5 rounded", children: [
                            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" }),
                            "Aktif"
                          ] })
                        ] }),
                        /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary truncate", children: c.desc })
                      ] })
                    ]
                  },
                  c.code
                );
              }) })
            ] }, o.title))
          ] }),
          /* @__PURE__ */ e.jsx(qe, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const Pe = "apya.taskDetail.fullscreen";
function rt({
  taskId: t,
  presentation: a = "modal",
  onClose: s,
  switchToTask: r
}) {
  const [l, i] = d.useState(t), { data: o, isLoading: c, isError: x, refetch: b } = Ve(l), f = J(), p = _e(), g = Ze(o), y = We(), n = Je(l), [u, h] = d.useState("general"), [j, v] = d.useState(!1), [S, K] = d.useState(() => {
    try {
      return localStorage.getItem(Pe) === "true";
    } catch {
      return !1;
    }
  });
  Qe(l), xe.useEffect(() => {
    g.isDirty ? p.markDirty() : p.markClean();
  });
  const z = d.useCallback(() => p.requestClose(s), [p, s]), E = d.useCallback(() => {
    K((T) => {
      const R = !T;
      try {
        localStorage.setItem(Pe, String(R));
      } catch {
      }
      return R;
    });
  }, []), $ = d.useMemo(
    () => tt(n.assignedCodes),
    [n.assignedCodes]
  ), P = Ae.find((T) => T.code === u) || $.find((T) => T.code === u) || $[0], X = d.useCallback(async () => {
    var T, R, q, U, O, M;
    if (!g.validate()) return !1;
    v(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(l, g.toUpdateDto())
      ), await f.invalidateQueries({ queryKey: ["task-detail", l] }), H.emitResult(), (q = (R = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : R.success) == null || q.call(R, "Görev başarıyla güncellendi."), !0;
    } catch (m) {
      return (M = (O = (U = window == null ? void 0 : window.abp) == null ? void 0 : U.notify) == null ? void 0 : O.error) == null || M.call(O, (m == null ? void 0 : m.message) || "Kaydedilemedi."), !1;
    } finally {
      v(!1);
    }
  }, [l, g, f]), W = d.useCallback(async () => {
    var T, R, q, U, O, M;
    if (window.confirm("Bu görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.delete(l)), (q = (R = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : R.info) == null || q.call(R, "Görev silindi."), p.markClean(), closeNow();
      } catch (m) {
        (M = (O = (U = window == null ? void 0 : window.abp) == null ? void 0 : U.notify) == null ? void 0 : O.error) == null || M.call(O, (m == null ? void 0 : m.message) || "Görev silinemedi.");
      }
  }, [l, p, closeNow]), ie = d.useCallback(async (T) => {
    var R, q, U, O, M, m;
    try {
      await n.addFeature(T), h(T), (U = (q = (R = window == null ? void 0 : window.abp) == null ? void 0 : R.notify) == null ? void 0 : q.success) == null || U.call(q, "Özellik başarıyla eklendi.");
    } catch (w) {
      (m = (M = (O = window == null ? void 0 : window.abp) == null ? void 0 : O.notify) == null ? void 0 : M.error) == null || m.call(M, (w == null ? void 0 : w.message) || "Özellik eklenemedi.");
    }
  }, [n]), ee = c ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(re, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(re, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(re, { className: "h-64 w-full" })
  ] }) : x ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(N, { variant: "ghost", onClick: () => b(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      rs,
      {
        task: o,
        onClose: z,
        isFullscreen: S,
        onToggleFullscreen: E,
        presentation: a,
        onFieldChange: g.setField
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "overflow-y-auto max-h-[85vh] custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        is,
        {
          task: o,
          assigneeOptions: y.options,
          onFieldChange: g.setField
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle px-6 bg-surface-base", children: [
        /* @__PURE__ */ e.jsx(
          ls,
          {
            activeTab: u,
            onTabChange: h,
            visibleTabs: $
          }
        ),
        /* @__PURE__ */ e.jsx("div", { className: "py-2", children: /* @__PURE__ */ e.jsx(
          ms,
          {
            assignedCodes: n.assignedCodes,
            onAddFeature: ie
          }
        ) })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-6", children: u === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start", children: [
        /* @__PURE__ */ e.jsx("div", { className: "min-w-0 space-y-6", children: /* @__PURE__ */ e.jsx(
          cs,
          {
            task: o,
            onFieldChange: g.setField
          }
        ) }),
        /* @__PURE__ */ e.jsx("div", { className: "w-full shrink-0", children: /* @__PURE__ */ e.jsx(
          ns,
          {
            task: o,
            onDelete: W
          }
        ) })
      ] }) : u === "history" || u === "activity" ? /* @__PURE__ */ e.jsx(xs, {}) : /* @__PURE__ */ e.jsx(d.Suspense, { fallback: /* @__PURE__ */ e.jsx(re, { className: "h-48 w-full" }), children: P != null && P.component ? /* @__PURE__ */ e.jsx(
        P.component,
        {
          taskId: l,
          task: o,
          onOpenSubtask: r
        }
      ) : /* @__PURE__ */ e.jsxs("div", { className: "text-center py-12 text-text-tertiary border border-dashed border-subtle rounded-xl", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-person-digging text-4xl mb-4 opacity-50" }),
        /* @__PURE__ */ e.jsx("p", { children: "Bu sekme yapım aşamasında." })
      ] }) }) })
    ] }),
    /* @__PURE__ */ e.jsx(
      ds,
      {
        lastSavedAt: o == null ? void 0 : o.lastModificationTime,
        isDirty: p.isDirty,
        isSaving: j,
        onCancel: z,
        onSave: X
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsx("div", { className: "w-full max-w-6xl mx-auto my-6 rounded-2xl border border-subtle bg-surface-base shadow-sm overflow-hidden", children: ee }) : /* @__PURE__ */ e.jsx(
    Ye,
    {
      open: !0,
      onOpenChange: (T) => {
        T || z();
      },
      children: /* @__PURE__ */ e.jsx(
        $e,
        {
          title: o != null && o.title ? `Görev Detayı: ${o.title}` : "Görev Detayı",
          fullscreen: S,
          className: "max-w-6xl p-0 overflow-hidden rounded-2xl border border-subtle shadow-2xl bg-surface-base",
          onInteractOutside: (T) => {
            T.preventDefault(), z();
          },
          onEscapeKeyDown: (T) => {
            T.preventDefault(), z();
          },
          children: ee
        }
      )
    }
  );
}
function ps() {
  var a;
  const t = d.useSyncExternalStore(
    H.subscribe,
    H.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsx(
    rt,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        H.close(), H.emitResult();
      }
    }
  ) }) : /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsx(
    st,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        H.close(), H.emitResult();
      }
    }
  ) }) : null;
}
function fs() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v2" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : !(window.localStorage.getItem("apya.taskDetail.v2") === "0");
  } catch {
    return !0;
  }
}
function bs() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v3" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v2" || new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : window.localStorage.getItem("apya.taskDetail.v3") === "1" || !0;
  } catch {
    return !0;
  }
}
const Oe = document.getElementById("task-detail-island");
if (Oe && (window.apya = window.apya || {}, window.apya.taskDetailV3Enabled = bs(), window.apya.taskDetailV2Enabled = fs() && !window.apya.taskDetailV3Enabled, window.apya.taskDetail = {
  open: (t) => H.open(t),
  close: () => H.close(),
  onResult: (t) => H.onResult(t)
}, Me(Oe).render(/* @__PURE__ */ e.jsx(ps, {})), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled)) {
  const t = He();
  t && H.open(t);
}
function hs({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsx(
    rt,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsx(
    st,
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
  t && Me(De).render(/* @__PURE__ */ e.jsx(hs, { taskId: t }));
}
