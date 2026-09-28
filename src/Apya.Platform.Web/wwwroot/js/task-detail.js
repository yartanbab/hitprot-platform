import { j as e, r as y, d as Ge, b as ga } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { a as st } from "./QueryProvider-CMEXdgTM.js";
import { u as ee, a as ae, b as te } from "./query-vendor-Bf69L2iP.js";
import { D as ya, h as va, e as vt, B as X, I as qe, M as rs, S as je } from "./Dialog-Bky2XNdc.js";
import { C as ja } from "./Combobox-D5mSMyzC.js";
import { i as Ve, a as Oe, s as fe, p as ot, d as Na, b as rt, R as wa, c as $e, S as ka, e as ns, P as is } from "./RichTextEditorV3-mZ6z1BBZ.js";
import { r as ls } from "./httpClient-DePjXdo1.js";
import { R as Ne, T as we, P as ke, C as Ce, A as os, a as Ct, D as cs, b as ds, c as xs, d as us, e as ps } from "./ui-vendor-DaE-uom6.js";
import { d as Ca } from "./draggableActivation-Ybw9Upbh.js";
import { i as ms } from "./dataChanged-DR0MWWqM.js";
function fs({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: i,
  footer: o,
  children: n
}) {
  return /* @__PURE__ */ e.jsx(
    ya,
    {
      open: t,
      onOpenChange: (l) => {
        l || a();
      },
      children: /* @__PURE__ */ e.jsx(
        va,
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
            i,
            /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: n }),
            o
          ] })
        }
      )
    }
  );
}
function bs({ title: t, header: a, footer: s, children: r }) {
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
function hs({ isPrivate: t }) {
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
const jt = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, Nt = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function gs({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: i,
  fullscreen: o = !1
}) {
  const [n, l] = y.useState(!1), p = y.useRef(null);
  y.useEffect(() => {
    if (!n) return;
    const f = (g) => {
      p.current && !p.current.contains(g.target) && l(!1);
    }, c = (g) => {
      g.key === "Escape" && l(!1);
    };
    return document.addEventListener("mousedown", f), document.addEventListener("keydown", c), () => {
      document.removeEventListener("mousedown", f), document.removeEventListener("keydown", c);
    };
  }, [n]);
  const x = jt[t == null ? void 0 : t.status] ?? jt[1], m = Nt[t == null ? void 0 : t.priority] ?? Nt[2], h = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), l(!1);
  }, d = () => {
    var c, g, u, b;
    const f = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (c = navigator.clipboard) == null || c.writeText(f), (b = (u = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : u.info) == null || b.call(u, "Bağlantı kopyalandı."), l(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(vt, { variant: x.variant, children: x.text }),
        /* @__PURE__ */ e.jsx(vt, { variant: m.variant, children: m.text }),
        /* @__PURE__ */ e.jsx(hs, { isPrivate: t == null ? void 0 : t.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": o ? "Küçült" : "Tam ekrana büyüt",
          onClick: i,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: o ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: p, children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": n,
            onClick: () => l((f) => !f),
            className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-ellipsis", "aria-hidden": "true" })
          }
        ),
        n && /* @__PURE__ */ e.jsxs(
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
                  onClick: h,
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
                  onClick: d,
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
const ys = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function vs({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: i }) {
  const o = ys(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: o ? `Son kayıt: ${o}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(X, { variant: "secondary", onClick: r, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        X,
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
const qt = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", js = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function ge({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function Ns({ value: t, onChange: a }) {
  const [s, r] = y.useState(""), i = () => {
    const o = s.trim();
    o && !t.includes(o) && a([...t, o]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((o) => /* @__PURE__ */ e.jsxs(vt, { variant: "neutral", children: [
      o,
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${o} etiketini kaldır`,
          onClick: () => a(t.filter((n) => n !== o)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, o)) }),
    /* @__PURE__ */ e.jsx(
      qe,
      {
        value: s,
        onChange: (o) => r(o.target.value),
        onKeyDown: (o) => {
          o.key === "Enter" || o.key === "," ? (o.preventDefault(), i()) : o.key === "Backspace" && !s && t.length && a(t.slice(0, -1));
        },
        onBlur: i,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function ws({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: i = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(ge, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      qe,
      {
        id: "task-title",
        value: t.title,
        onChange: (o) => s("title", o.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(ge, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (o) => s("status", Number(o.target.value)),
          className: qt,
          children: Object.entries(jt).map(([o, n]) => /* @__PURE__ */ e.jsx("option", { value: o, children: n.text }, o))
        }
      ) }),
      /* @__PURE__ */ e.jsx(ge, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (o) => s("priority", Number(o.target.value)),
          className: qt,
          children: Object.entries(Nt).map(([o, n]) => /* @__PURE__ */ e.jsx("option", { value: o, children: n.text }, o))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(ge, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      ja,
      {
        id: "task-assignee",
        options: r,
        value: t.assigneeId,
        onChange: (o) => s("assigneeId", o),
        placeholder: i ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: i
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(ge, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        qe,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (o) => s("startDate", o.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(ge, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        qe,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (o) => s("dueDate", o.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(ge, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(Ns, { value: t.tagNames, onChange: (o) => s("tagNames", o) }) }),
    /* @__PURE__ */ e.jsx(ge, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (o) => s("description", o.target.value),
        className: js
      }
    ) })
  ] });
}
const Yt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function Me({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function ks({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(Me, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(Me, { label: "Oluşturulma zamanı", value: Yt(t.creationTime) }),
      /* @__PURE__ */ e.jsx(Me, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(Me, { label: "Son güncelleme zamanı", value: Yt(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(Me, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const Cs = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", Ds = "border-brand-500 text-text-primary";
function Ts({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: i }) {
  const o = y.useRef(/* @__PURE__ */ new Map()), n = (p) => {
    var x;
    s(p.code), (x = o.current.get(p.code)) == null || x.focus();
  }, l = (p, x) => {
    p.key === "ArrowRight" ? (p.preventDefault(), n(t[(x + 1) % t.length])) : p.key === "ArrowLeft" ? (p.preventDefault(), n(t[(x - 1 + t.length) % t.length])) : p.key === "Home" ? (p.preventDefault(), n(t[0])) : p.key === "End" && (p.preventDefault(), n(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((p, x) => {
      const m = p.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (h) => {
            h ? o.current.set(p.code, h) : o.current.delete(p.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${p.code}`,
          "aria-selected": m,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: m ? 0 : -1,
          onClick: () => s(p.code),
          onKeyDown: (h) => l(h, x),
          className: `${Cs} ${m ? Ds : ""}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa ${p.icon}`, "aria-hidden": "true" }),
            p.title
          ]
        },
        p.code
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
const Ss = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function $s({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [i, o] = y.useState(""), n = y.useMemo(() => {
    const l = i.trim().toLocaleLowerCase("tr-TR"), p = l ? t.filter((m) => m.title.toLocaleLowerCase("tr-TR").includes(l)) : t, x = /* @__PURE__ */ new Map();
    return p.forEach((m) => {
      const h = x.get(m.category) ?? [];
      h.push(m), x.set(m.category, h);
    }), x;
  }, [t, i]);
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
            value: i,
            onChange: (l) => o(l.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          n.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...n.entries()].map(([l, p]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: Ss[l] ?? l }),
            p.map((x) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa ${x.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: x.title }),
              !x.implemented && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              x.implemented && !x.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === x.code,
                  onClick: () => a(x.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              x.implemented && x.isAssigned && /* @__PURE__ */ e.jsx(
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
function Ps({ trail: t = [], current: a, onNavigate: s }) {
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
function Es(t) {
  var s, r, i;
  const a = (i = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : i.task;
  return a ? Promise.resolve(a.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Dt(t) {
  return ee({
    queryKey: ["task-detail", t],
    queryFn: () => Es(t),
    enabled: !!t,
    /* Detay düzenlenebilir canlı kayıt: kanban, liste ve proje konsolu aynı
       görevi React Query dışından değiştiriyor. Her açılışta (modal yeni
       QueryClient kurar), göreve dönüşte ve sekme odağında yeniden çekilir;
       oturum önbelleğine yazılmaz. Gelen yeni değer useTaskForm'da kullanıcının
       dokunmadığı alanlara işlenir (rebase). */
    staleTime: 0,
    meta: { persist: !1 },
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function ie(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
function Da() {
  const [t, a] = y.useState(!1), [s, r] = y.useState(!1), i = y.useRef(null), o = y.useCallback(() => a(!0), []), n = y.useCallback(() => a(!1), []);
  y.useEffect(() => {
    if (!t) return;
    const x = (m) => {
      m.preventDefault(), m.returnValue = "";
    };
    return window.addEventListener("beforeunload", x), () => window.removeEventListener("beforeunload", x);
  }, [t]);
  const l = y.useCallback((x) => {
    if (!t) {
      x == null || x();
      return;
    }
    i.current = x ?? null, r(!0);
  }, [t]), p = y.useCallback((x) => {
    const m = i.current;
    return r(!1), i.current = null, x === "discard" && (a(!1), m == null || m()), x === "save" ? m : null;
  }, []);
  return { isDirty: t, markDirty: o, markClean: n, requestClose: l, pendingClose: s, resolvePendingClose: p };
}
const As = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, Tt = "task";
function Ta() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(Tt);
  return t && As.test(t) ? t : null;
}
function Sa() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(Tt), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function $a(t, a) {
  const s = y.useRef(a);
  s.current = a, y.useEffect(() => {
    if (!t || Ta() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(Tt, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), y.useEffect(() => {
    const r = () => {
      var i;
      (i = s.current) == null || i.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const Bs = {
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
function _t(t) {
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
  } : Bs;
}
const Pa = (t, a) => JSON.stringify(t) === JSON.stringify(a);
function Ut(t, a, s) {
  const r = {};
  for (const i of Object.keys(s)) r[i] = Pa(t[i], a[i]) ? s[i] : t[i];
  return r;
}
function Ea(t) {
  const [a, s] = y.useState(t == null ? void 0 : t.id), r = y.useMemo(() => _t(t), [t]), [i, o] = y.useState(r), [n, l] = y.useState(r), [p, x] = y.useState({});
  if ((t == null ? void 0 : t.id) !== a || r !== i && !Pa(r, i)) {
    const u = (t == null ? void 0 : t.id) !== void 0 && t.id === a;
    s(t == null ? void 0 : t.id), o(r), l(u ? Ut(n, i, r) : r), u || x({});
  }
  const m = y.useCallback((u, b) => {
    l((j) => ({ ...j, [u]: b }));
  }, []), h = y.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(r),
    [n, r]
  ), d = y.useCallback(() => {
    const u = {};
    return n.title.trim() || (u.title = "Başlık zorunlu."), n.startDate || (u.startDate = "Başlangıç tarihi zorunlu."), n.dueDate && n.startDate && n.dueDate < n.startDate && (u.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), x(u), Object.keys(u).length === 0;
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
  }), [n, t]), c = y.useCallback(() => {
    l(r), x({});
  }, [r]), g = y.useCallback((u, b) => {
    if (!b) return;
    const j = _t(b);
    l((w) => Ut(w, u, j));
  }, []);
  return { values: n, setField: m, isDirty: h, errors: p, validate: d, toUpdateDto: f, reset: c, commitSaved: g };
}
function Vt(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function Fs() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Aa() {
  var i;
  const t = ee({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Fs,
    staleTime: 3e5,
    retry: !1
  }), a = ((i = t.data) == null ? void 0 : i.items) ?? [], s = a.map((o) => ({ value: o.id, label: Vt(o) })), r = new Map(a.map((o) => [o.id, Vt(o)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function wt() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function zs(t) {
  const a = wt();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ba(t) {
  const a = ae(), s = ["task-features", t], r = ee({
    queryKey: s,
    queryFn: () => zs(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), o = te({
    mutationFn: (l) => Promise.resolve(wt().addFeature(t, l)),
    onSuccess: i
  }), n = te({
    mutationFn: (l) => Promise.resolve(wt().removeFeature(t, l)),
    onSuccess: i
  });
  return {
    assignedCodes: r.data ?? [],
    isLoading: r.isLoading,
    addFeature: o.mutateAsync,
    removeFeature: n.mutateAsync,
    mutatingCode: o.variables ?? n.variables ?? null,
    isMutating: o.isPending || n.isPending
  };
}
function _e(t) {
  var r, i;
  const a = (i = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.currentUser) == null ? void 0 : i.id, s = !!(a && ((t == null ? void 0 : t.creatorId) === a || (t == null ? void 0 : t.assigneeId) === a)) || ie("Platform.Projects.ManageTeam");
  return {
    canManage: s,
    canEdit: s && ie("Platform.Tasks.Edit"),
    canChangeStatus: s && ie("Platform.Tasks.ChangeStatus"),
    canDelete: s && ie("Platform.Tasks.Delete")
  };
}
const Fa = "rounded-2xl border border-subtle bg-surface-base shadow-xs", De = `${Fa} overflow-hidden`;
function Ue({ title: t, badge: a, action: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3.5 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: t }),
      a
    ] }),
    s
  ] });
}
function za({ children: t, tone: a = "positive" }) {
  const s = a === "positive" ? "bg-success-subtle text-success" : "bg-neutral-subtle text-text-secondary";
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-full font-mono text-[11px] font-bold ${s}`, children: t });
}
function Pe({ children: t, bg: a, fg: s }) {
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-[7px] text-[10.5px] font-bold ${a} ${s}`, children: t });
}
function de({ icon: t, title: a, description: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 px-6 py-10 text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-xl text-text-tertiary` }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: a }),
    s && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] leading-[1.55] text-text-tertiary max-w-[420px]", children: s })
  ] });
}
function ct({ name: t, size: a = 24 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Oe(t), fontSize: a * 0.4 },
      title: t || void 0,
      children: Ve(t)
    }
  );
}
const Le = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—", nt = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function La(t) {
  return t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : "0 KB";
}
function dt(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = Math.floor(a / 3600), r = Math.floor(a % 3600 / 60);
  return !s && !r ? `${a}sn` : s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function Ls(t) {
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
}, Ot = (t = "") => Ia(t) === ve.image;
function Ia(t = "") {
  var s;
  const a = ((s = t.split(".").pop()) == null ? void 0 : s.toLowerCase()) ?? "";
  return a === "pdf" ? ve.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(a) ? ve.image : ["doc", "docx", "odt", "rtf", "txt"].includes(a) ? ve.doc : ["xls", "xlsx", "csv", "ods"].includes(a) ? ve.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(a) ? ve.code : ["zip", "rar", "7z", "tar", "gz"].includes(a) ? ve.zip : ve.other;
}
function Is({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, i] = y.useState(""), [o, n] = y.useState(!1), l = ae(), p = (a == null ? void 0 : a.subTasks) ?? [], x = p.filter((f) => f.status === 4).length, m = () => l.invalidateQueries({ queryKey: ["task-detail", t] }), h = async () => {
    var c, g, u;
    const f = r.trim();
    if (f) {
      n(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: f,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), i(""), await m();
      } catch (b) {
        (u = (g = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : g.error) == null || u.call(g, (b == null ? void 0 : b.message) || "Alt görev eklenemedi.");
      } finally {
        n(!1);
      }
    }
  }, d = async (f, c) => {
    var g, u, b;
    f.stopPropagation();
    try {
      await Promise.resolve(window.apya.platform.tasks.task.updateStatus(c.id, c.status === 4 ? 1 : 4)), await m();
    } catch (j) {
      (b = (u = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : u.error) == null || b.call(u, (j == null ? void 0 : j.message) || "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        p.length > 0 && /* @__PURE__ */ e.jsxs(za, { children: [
          x,
          "/",
          p.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: h,
          disabled: o || !r.trim(),
          className: `flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${o || !r.trim() ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            "Alt görev ekle"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: De, children: [
      p.map((f) => {
        const c = fe(f.status), g = f.status === 4, u = _e(f).canChangeStatus;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => s == null ? void 0 : s(f.id, f.title),
            onKeyDown: (b) => {
              b.key === "Enter" && (s == null || s(f.id, f.title));
            },
            className: "flex items-center gap-3.5 px-4 py-3.5 border-t border-subtle first:border-t-0 hover:bg-surface-raised cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": `${f.title} tamamlandı işaretle`,
                  onClick: (b) => d(b, f),
                  disabled: !u,
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white ${u ? "cursor-pointer" : "cursor-default"} ${g ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: g && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: f.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${g ? "line-through text-text-tertiary" : "text-text-primary"}`, children: f.title }),
              /* @__PURE__ */ e.jsx(Pe, { bg: c.bg, fg: c.fg, children: c.label }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: Le(f.dueDate) }),
              /* @__PURE__ */ e.jsx(ct, { name: f.assigneeName }),
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-right shrink-0 text-[10px] text-text-tertiary" })
            ]
          },
          f.id
        );
      }),
      /* @__PURE__ */ e.jsx("div", { className: "px-4 py-3 border-t border-subtle first:border-t-0", children: /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: r,
          onChange: (f) => i(f.target.value),
          onKeyDown: (f) => {
            f.key === "Enter" && h();
          },
          disabled: o,
          placeholder: "Yeni alt görev başlığı",
          className: "w-full h-9 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      ) })
    ] }),
    p.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz alt görev yok." })
  ] });
}
function Ma() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Ms(t) {
  const a = Ma();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function Ks(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, i = ls();
  i && (r.RequestVerificationToken = i);
  const o = await fetch(`/api/tasks/attachments/upload/${t}`, {
    method: "POST",
    credentials: "include",
    headers: r,
    body: s
  });
  let n = null;
  try {
    n = await o.json();
  } catch {
  }
  if (!o.ok || (n == null ? void 0 : n.success) === !1)
    throw new Error((n == null ? void 0 : n.error) || "Dosya yüklenemedi.");
  return n;
}
function St(t) {
  const a = ae(), s = ["task-attachments", t], r = ee({
    queryKey: s,
    queryFn: () => Ms(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), o = te({
    mutationFn: (l) => Ks(t, l),
    onSuccess: i
  }), n = te({
    mutationFn: (l) => Promise.resolve(Ma().deleteAttachment(l)),
    onSuccess: i
  });
  return {
    attachments: r.data ?? [],
    isLoading: r.isLoading,
    upload: o.mutateAsync,
    remove: n.mutateAsync,
    isUploading: o.isPending
  };
}
function Rs({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: i } = St(t), o = ae(), n = y.useRef(null), [l, p] = y.useState(!1), x = ie("Platform.Tasks.ShareExternally"), m = async (f, c) => {
    var g, u, b;
    try {
      await window.apya.platform.tasks.taskShare.setAttachmentGuestVisibility(f, c), o.invalidateQueries({ queryKey: ["task-attachments", t] });
    } catch (j) {
      (b = (u = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : u.error) == null || b.call(u, (j == null ? void 0 : j.message) || "Görünürlük değiştirilemedi.");
    }
  }, h = async (f) => {
    var c, g, u, b, j, w;
    if (f)
      try {
        await s(f), (u = (g = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : g.success) == null || u.call(g, "Dosya yüklendi.");
      } catch (k) {
        (w = (j = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : j.error) == null || w.call(j, (k == null ? void 0 : k.message) || "Dosya yüklenemedi.");
      } finally {
        n.current && (n.current.value = "");
      }
  }, d = async (f, c) => {
    var g, u, b;
    try {
      await r(f);
    } catch (j) {
      (b = (u = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : u.error) == null || b.call(u, (j == null ? void 0 : j.message) || `${c} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: n,
        type: "file",
        className: "hidden",
        onChange: (f) => {
          var c;
          return h((c = f.target.files) == null ? void 0 : c[0]);
        },
        disabled: i
      }
    ),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3", children: a.map((f) => {
      const c = Ia(f.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${c.bg} ${c.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: f.fileName, children: f.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: La(f.fileSize) })
              ] })
            ] }),
            x && !f.isGuestUpload && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 text-[11px] text-text-tertiary cursor-pointer", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: !!f.isVisibleToGuests,
                  onChange: (g) => m(f.id, g.target.checked)
                }
              ),
              "Dış paylaşımda görünsün"
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2.5 border-t border-subtle", children: [
              /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[11px] text-text-tertiary", children: [
                f.uploaderName,
                f.isGuestUpload ? " · dış" : ""
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-1 shrink-0", children: [
                /* @__PURE__ */ e.jsx(
                  "a",
                  {
                    href: f.downloadUrl,
                    target: "_blank",
                    rel: "noreferrer",
                    title: "İndir",
                    "aria-label": `${f.fileName} dosyasini indir`,
                    className: "flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-primary-subtle hover:text-primary",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-download text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Sil",
                    "aria-label": `${f.fileName} dosyasini sil`,
                    onClick: () => d(f.id, f.fileName),
                    className: "flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                )
              ] })
            ] })
          ]
        },
        f.id
      );
    }) }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "button",
        tabIndex: 0,
        onClick: () => {
          var f;
          return (f = n.current) == null ? void 0 : f.click();
        },
        onKeyDown: (f) => {
          var c;
          f.key === "Enter" && ((c = n.current) == null || c.click());
        },
        onDragOver: (f) => {
          f.preventDefault(), l || p(!0);
        },
        onDragLeave: () => p(!1),
        onDrop: (f) => {
          var c, g;
          f.preventDefault(), p(!1), h((g = (c = f.dataTransfer) == null ? void 0 : c.files) == null ? void 0 : g[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${l ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${i ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-[26px] ${l ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: i ? "Yükleniyor…" : l ? "Bırakın, yükleyelim" : "Dosyaları buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, PDF, DOCX · max 25MB" })
        ]
      }
    )
  ] });
}
function tt() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Gs(t) {
  const a = tt();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function $t(t) {
  const a = ae(), s = ["task-checklist", t], r = ee({
    queryKey: s,
    queryFn: () => Gs(t),
    enabled: !!t,
    staleTime: 3e4,
    /* toggleChecklistItem ters çevirir; bayat gösterim yanlış yöne yazar (proje
       konsolu paneli aynı maddeyi React Query dışından değiştiriyor). */
    meta: { persist: !1 },
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), o = te({
    mutationFn: (p) => Promise.resolve(tt().addChecklistItem(t, p)),
    onSuccess: i
  }), n = te({
    mutationFn: (p) => Promise.resolve(tt().toggleChecklistItem(p)),
    onSuccess: i
  }), l = te({
    mutationFn: (p) => Promise.resolve(tt().deleteChecklistItem(p)),
    onSuccess: i
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: o.mutateAsync,
    toggleItem: n.mutateAsync,
    removeItem: l.mutateAsync
  };
}
function qs({ taskId: t, readOnly: a = !1 }) {
  const { items: s, isLoading: r, addItem: i, toggleItem: o, removeItem: n } = $t(t), [l, p] = y.useState(""), x = s.filter((d) => d.isDone).length, m = s.length ? Math.round(x / s.length * 100) : 0, h = async () => {
    var f, c, g;
    const d = l.trim();
    if (!(!d || !t)) {
      p("");
      try {
        await i(d);
      } catch (u) {
        p(d), (g = (c = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : c.error) == null || g.call(c, (u == null ? void 0 : u.message) || "Madde eklenemedi.");
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
        /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
          x,
          "/",
          s.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: [
        "%",
        m
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mt-3.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
      "div",
      {
        className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
        style: { width: `${m}%` }
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
      r && s.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 py-2 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
      !r && s.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 py-2 text-[12.5px] text-text-tertiary", children: a ? "Henüz madde yok." : "Henüz madde yok. Aşağıdan ilk maddeyi ekleyin." }),
      s.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            disabled: a,
            "aria-label": d.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
            onClick: () => o(d.id).catch((f) => {
              var c, g, u;
              return (u = (g = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : g.error) == null ? void 0 : u.call(g, (f == null ? void 0 : f.message) || "Durum güncellenemedi.");
            }),
            className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${a ? "cursor-default" : "cursor-pointer"} transition-colors duration-fast ${d.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
            children: d.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${d.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: d.text }),
        !a && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            title: "Sil",
            "aria-label": `${d.text} maddesini sil`,
            onClick: () => n(d.id).catch((f) => {
              var c, g, u;
              return (u = (g = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : g.error) == null ? void 0 : u.call(g, (f == null ? void 0 : f.message) || "Madde silinemedi.");
            }),
            className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
          }
        )
      ] }, d.id)),
      !a && /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: l,
          onChange: (d) => p(d.target.value),
          onKeyDown: (d) => {
            d.key === "Enter" && h();
          },
          placeholder: "Yeni madde yaz ve Enter'a bas…",
          "aria-label": "Yeni kontrol listesi maddesi",
          className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      )
    ] })
  ] });
}
function Ys({ taskId: t, task: a }) {
  const [s, r] = y.useState(""), [i, o] = y.useState(null), [n, l] = y.useState(""), [p, x] = y.useState(!1), m = ae(), h = (a == null ? void 0 : a.comments) ?? [], d = async (c) => {
    var g, u, b, j, w, k;
    if (c == null || c.preventDefault(), !(!s.trim() || p)) {
      x(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), m.invalidateQueries({ queryKey: ["task-detail", t] }), (b = (u = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : u.success) == null || b.call(u, "Yorum eklendi.");
      } catch (T) {
        (k = (w = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : w.error) == null || k.call(w, (T == null ? void 0 : T.message) || "Yorum eklenemedi.");
      } finally {
        x(!1);
      }
    }
  }, f = async (c) => {
    var g, u, b, j, w, k;
    if (!(!n.trim() || p)) {
      x(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(c, n.trim())
        ), l(""), o(null), m.invalidateQueries({ queryKey: ["task-detail", t] }), (b = (u = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : u.success) == null || b.call(u, "Yanıt eklendi.");
      } catch (T) {
        (k = (w = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : w.error) == null || k.call(w, (T == null ? void 0 : T.message) || "Yanıt eklenemedi.");
      } finally {
        x(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("form", { onSubmit: d, className: "rounded-lg border border-default p-3 bg-surface-base", children: [
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
        X,
        {
          type: "submit",
          variant: "primary",
          disabled: !s.trim() || p,
          isLoading: p,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    h.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: h.map((c) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: c.creatorUserName || c.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: c.creationTime ? new Date(c.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: c.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        X,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => o(i === c.id ? null : c.id),
          children: "Yanıtla"
        }
      ) }),
      i === c.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: n,
            onChange: (g) => l(g.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(X, { variant: "ghost", size: "sm", onClick: () => o(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(X, { variant: "primary", size: "sm", disabled: !n.trim() || p, onClick: () => f(c.id), children: "Gönder" })
        ] })
      ] }),
      c.replies && c.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: c.replies.map((g) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: g.creatorUserName || g.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: g.creationTime ? new Date(g.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: g.text })
      ] }, g.id)) })
    ] }, c.id)) })
  ] });
}
function xt() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.taskShare) ?? null;
}
function _s(t) {
  const a = ae(), s = ["task-share-links", t], r = ee({
    queryKey: s,
    queryFn: () => {
      const l = xt();
      return l ? Promise.resolve(l.getList(t)) : Promise.reject(new Error("Paylaşım servisi yüklenmedi."));
    },
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), o = te({
    mutationFn: (l) => Promise.resolve(xt().create({ ...l, taskId: t })),
    onSuccess: i
  }), n = te({
    mutationFn: (l) => Promise.resolve(xt().revoke(l)),
    onSuccess: i
  });
  return {
    links: r.data ?? [],
    /* isLoading DEĞİL isPending: kalıcı önbellek geri yüklenirken isLoading
       FALSE döner ama liste henüz yoktur; sekme o karede "henüz kimseyle
       paylaşılmadı" yazıyordu — paylaşımı olan görevde bile. */
    isPending: r.isPending,
    error: r.error,
    create: o.mutateAsync,
    revoke: n.mutateAsync,
    isCreating: o.isPending
  };
}
const Qt = {
  recipientName: "",
  recipientEmail: "",
  lifetimeDays: 14,
  allowComment: !0,
  allowUpload: !0,
  allowDownload: !0
};
function Us(t) {
  return t ? new Date(t).toLocaleDateString("tr-TR") : "—";
}
function Vs({ taskId: t }) {
  const { links: a, isPending: s, create: r, revoke: i, isCreating: o } = _s(t), [n, l] = y.useState(Qt), [p, x] = y.useState(null);
  if (!ie("Platform.Tasks.ShareExternally"))
    return /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Görevi ekip dışıyla paylaşma yetkiniz yok." });
  const h = (u) => (b) => {
    const j = b.target.type === "checkbox" ? b.target.checked : b.target.value;
    l((w) => ({ ...w, [u]: j }));
  }, d = async (u) => {
    var b, j, w;
    if (u.preventDefault(), !!n.recipientName.trim())
      try {
        const k = await r({
          ...n,
          lifetimeDays: Number(n.lifetimeDays) || 14
        });
        x(k), l(Qt);
      } catch (k) {
        (w = (j = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : j.error) == null || w.call(j, (k == null ? void 0 : k.message) || "Paylaşım linki üretilemedi.");
      }
  }, f = (u) => `${window.location.origin}${u}`, c = (u) => {
    var b, j, w, k;
    (b = navigator.clipboard) == null || b.writeText(f(u)), (k = (w = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : w.info) == null || k.call(w, "Bağlantı kopyalandı.");
  }, g = async (u) => {
    var b, j, w;
    try {
      await i(u);
    } catch (k) {
      (w = (j = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : j.error) == null || w.call(j, (k == null ? void 0 : k.message) || "Bağlantı iptal edilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    p && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 rounded-[14px] border border-focus bg-primary-subtle p-3.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "text-[12.5px] font-bold text-text-primary", children: [
        "Bağlantı hazır — ",
        /* @__PURE__ */ e.jsx("span", { className: "font-normal", children: "şimdi kopyalayın, bir daha gösterilmeyecek." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("code", { className: "min-w-0 flex-1 truncate rounded-[8px] bg-surface-base px-2.5 py-2 font-mono text-[11.5px] text-text-secondary", children: f(p.url) }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => c(p.url),
            className: "rounded-[8px] bg-primary px-3 py-2 text-[12px] font-bold text-white cursor-pointer",
            children: "Kopyala"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => x(null),
            className: "rounded-[8px] px-3 py-2 text-[12px] font-bold text-text-tertiary cursor-pointer hover:text-text-primary",
            children: "Kapat"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("form", { onSubmit: d, className: "flex flex-col gap-2.5 rounded-[14px] border border-subtle bg-surface-base p-3.5", children: [
      /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary", children: "Yeni paylaşım bağlantısı" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2.5", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            required: !0,
            value: n.recipientName,
            onChange: h("recipientName"),
            placeholder: "Kime? (ad soyad)",
            className: "min-w-0 flex-[2_1_180px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "email",
            value: n.recipientEmail,
            onChange: h("recipientEmail"),
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
            value: n.lifetimeDays,
            onChange: h("lifetimeDays"),
            title: "Geçerlilik (gün)",
            className: "w-[92px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: n.allowComment, onChange: h("allowComment") }),
          "Yorum yazabilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: n.allowUpload, onChange: h("allowUpload") }),
          "Dosya yükleyebilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: n.allowDownload, onChange: h("allowDownload") }),
          "Dosya indirebilsin"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: "Bağlantı bu görevi ve alt görevlerini açar. Ekip içi yorumlar gösterilmez." }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "submit",
            disabled: o,
            className: "shrink-0 rounded-[8px] bg-primary px-3.5 py-2 text-[12px] font-bold text-white cursor-pointer disabled:opacity-60",
            children: o ? "Üretiliyor…" : "Bağlantı üret"
          }
        )
      ] })
    ] }),
    s ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görev henüz kimseyle paylaşılmadı." }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: a.map((u) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-subtle bg-surface-base p-3",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "truncate text-[12.5px] font-bold text-text-primary", children: [
              u.recipientName,
              u.recipientEmail ? /* @__PURE__ */ e.jsxs("span", { className: "font-normal text-text-tertiary", children: [
                " · ",
                u.recipientEmail
              ] }) : null
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "text-[11.5px] text-text-tertiary", children: [
              u.isActive ? `${Us(u.expiresAt)} tarihine kadar geçerli` : u.revokedAt ? "İptal edildi" : "Süresi doldu",
              " · ",
              u.accessCount,
              " erişim",
              " · ",
              u.uploadCount,
              " dosya"
            ] })
          ] }),
          u.isActive && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => g(u.id),
              className: "shrink-0 rounded-[8px] px-3 py-1.5 text-[12px] font-bold text-text-negative cursor-pointer hover:bg-negative-subtle",
              children: "İptal et"
            }
          )
        ]
      },
      u.id
    )) })
  ] });
}
function Os({ task: t }) {
  var s;
  const a = [];
  return t != null && t.creationTime && a.push({
    id: "created",
    icon: "fa-plus",
    bg: "bg-success-subtle",
    fg: "text-success",
    actor: t.creatorUserName || t.creatorName || "Sistem / Kullanıcı",
    event: "görevi oluşturdu",
    time: nt(t.creationTime)
  }), t != null && t.lastModificationTime && a.push({
    id: "modified",
    icon: "fa-pen",
    bg: "bg-warning-subtle",
    fg: "text-warning",
    actor: t.lastModifierUserName || t.lastModifierName || "Kullanıcı",
    event: "görevi güncelledi",
    time: nt(t.lastModificationTime)
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
      const o = i === a.length - 1;
      return /* @__PURE__ */ e.jsxs("div", { className: `flex items-start gap-3.5 ${o ? "" : "pb-[18px]"}`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center shrink-0 self-stretch", children: [
          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-7 w-7 rounded-full ${r.bg} ${r.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r.icon} text-[11px]` }) }),
          !o && /* @__PURE__ */ e.jsx("span", { className: "flex-1 w-0.5 mt-1.5 rounded-sm bg-subtle" })
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
const Ae = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : null;
function Qs({ label: t, value: a, hint: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4 px-3.5 py-3", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[12.5px] font-semibold text-text-secondary", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 text-right", children: [
      /* @__PURE__ */ e.jsx("span", { className: "block text-[12.5px] font-bold text-text-primary break-words", children: a ?? "—" }),
      s && /* @__PURE__ */ e.jsx("span", { className: "block text-[11px] text-text-tertiary", children: s })
    ] })
  ] });
}
function Hs({ task: t = {}, nameById: a }) {
  const s = (i) => {
    var o;
    return i && ((o = a == null ? void 0 : a.get) == null ? void 0 : o.call(a, i)) || null;
  }, r = [
    { label: "Görev kodu", value: t.code || "—" },
    {
      label: "Oluşturulma",
      value: Ae(t.creationTime),
      hint: s(t.creatorId) ? `${s(t.creatorId)} tarafından` : null
    },
    {
      label: "Son güncelleme",
      value: Ae(t.lastModificationTime) ?? "Henüz güncellenmedi",
      hint: s(t.lastModifierId) ? `${s(t.lastModifierId)} tarafından` : null
    },
    { label: "Planlanan başlangıç", value: Ae(t.startDate) },
    { label: "Termin", value: Ae(t.dueDate) }
  ];
  return t.completedDate && r.push({ label: "Tamamlanma", value: Ae(t.completedDate) }), t.cancelledDate && r.push({
    label: "İptal",
    value: Ae(t.cancelledDate),
    hint: t.cancelReason || null
  }), /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-3.5 py-3 border-b border-subtle bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clock-rotate-left text-[13px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: "Kayıt bilgileri" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "divide-y divide-subtle", children: r.map((i) => /* @__PURE__ */ e.jsx(Qs, { ...i }, i.label)) })
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11.5px] text-text-tertiary", children: "Alan bazında değişiklik günlüğü (hangi alan, eski/yeni değer) henüz yayınlanmadı." })
  ] });
}
function Js(t) {
  var s, r, i;
  const a = (i = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.projectBudgets) == null ? void 0 : i.projectBudget;
  return a != null && a.getRecordFormLookup ? Promise.resolve(a.getRecordFormLookup(t)) : Promise.reject(new Error("Bütçe servisi yüklenmedi."));
}
function Ws(t) {
  var i;
  const a = ie("Platform.Projects.ViewBudget"), s = ee({
    queryKey: ["task-detail", "budget-lines", t],
    queryFn: () => Js(t),
    enabled: !!t && a,
    staleTime: 6e4,
    retry: !1
  }), r = ((i = s.data) == null ? void 0 : i.lines) ?? [];
  return {
    lines: r,
    options: r.map((o) => ({ value: o.id, label: o.code ? `${o.code} · ${o.name}` : o.name })),
    canViewBudget: a,
    isLoading: s.isLoading
  };
}
function it(t) {
  var s, r;
  const a = (r = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.ajax) == null ? void 0 : r.call(s, t);
  return a ? new Promise((i, o) => {
    a.done(i).fail(o);
  }) : Promise.reject(new Error("ABP köprüsü yüklenmedi."));
}
function lt(t, a = {}) {
  var i;
  const s = ((i = window == null ? void 0 : window.abp) == null ? void 0 : i.appPath) ?? "/", r = new URLSearchParams({ handler: t });
  return Object.entries(a).forEach(([o, n]) => {
    n != null && n !== "" && r.append(o, n);
  }), `${s}Documents/Matching?${r.toString()}`;
}
const Ka = () => ie("Platform.Documents.Default"), Zs = () => ie("Platform.Documents.ManageMeta");
function Xs(t) {
  const a = !!t && Ka(), s = ee({
    queryKey: ["task-detail", "expense-matches", t],
    queryFn: () => it({ url: lt("Matches", { projectId: t }), type: "GET" }),
    enabled: a,
    staleTime: 6e4,
    meta: { persist: !1 },
    retry: !1
  }), r = /* @__PURE__ */ new Map();
  return (s.data ?? []).forEach((i) => {
    r.has(i.expenseId) || r.set(i.expenseId, []), r.get(i.expenseId).push(i);
  }), { byExpense: r, enabled: a, isLoading: s.isLoading };
}
function er(t, a) {
  const s = ee({
    queryKey: ["task-detail", "expense-candidates", t],
    queryFn: () => it({ url: lt("Candidates", { expenseId: t }), type: "GET" }),
    enabled: !!t && a && Ka(),
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  });
  return { candidates: s.data ?? [], isLoading: s.isLoading };
}
function tr(t) {
  const a = ae(), s = (o) => {
    a.invalidateQueries({ queryKey: ["task-detail", "expense-matches", t] }), a.invalidateQueries({ queryKey: ["task-detail", "expense-candidates", o] });
  }, r = te({
    mutationFn: ({ documentFileId: o, expenseId: n, score: l }) => it({
      url: lt("CreateMatch"),
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ documentFileId: o, expenseId: n, score: l ?? 0 })
    }),
    onSuccess: (o, n) => s(n.expenseId)
  }), i = te({
    mutationFn: ({ matchId: o }) => it({ url: lt("RemoveMatch", { matchId: o }), type: "POST" }),
    onSuccess: (o, n) => s(n.expenseId)
  });
  return { link: r, unlink: i, isBusy: r.isPending || i.isPending };
}
function ar(t) {
  return t == null ? "—" : new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 2 }).format(t);
}
function sr({ expenseId: t, projectId: a, matches: s }) {
  const { candidates: r, isLoading: i } = er(t, !0), { link: o, unlink: n, isBusy: l } = tr(a), p = Zs(), x = new Set(s.map((d) => d.documentFileId)), m = r.filter((d) => !x.has(d.documentFileId)), h = (d, f) => {
    var c, g, u;
    return (u = (g = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : g.error) == null ? void 0 : u.call(g, (d == null ? void 0 : d.message) || f);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3 px-4 pb-3.5 pt-1 bg-surface-raised", children: [
    s.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Bağlı evraklar" }),
      s.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-[11px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12px] text-text-primary", children: d.documentFileName }),
        d.annexNumber && /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary", children: [
          "EK-",
          d.annexNumber
        ] }),
        p && /* @__PURE__ */ e.jsx(
          X,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            disabled: l,
            onClick: () => n.mutate(
              { matchId: d.id, expenseId: t },
              { onError: (f) => h(f, "Evrak bağı kaldırılamadı.") }
            ),
            children: "Kaldır"
          }
        )
      ] }, d.id))
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Aday evraklar" }),
      i && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Adaylar aranıyor…" }),
      !i && m.length === 0 && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Eşleşen aday yok. Evrak Belgeler modülünden yüklenip buradan bağlanır." }),
      m.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[11px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12px] text-text-primary", children: d.displayName }),
        /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
          ar(d.amount),
          " · ",
          Le(d.documentDate)
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: `shrink-0 font-mono text-[11px] font-bold ${d.isStrong ? "text-success" : "text-text-tertiary"}`, children: [
          "%",
          d.score
        ] }),
        p && /* @__PURE__ */ e.jsx(
          X,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            disabled: l,
            onClick: () => o.mutate(
              { documentFileId: d.documentFileId, expenseId: t, score: d.score },
              { onError: (f) => h(f, "Evrak bağlanamadı.") }
            ),
            children: "Bağla"
          }
        )
      ] }, d.documentFileId))
    ] })
  ] });
}
function me(t, a) {
  const s = a || "TRY";
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: s, minimumFractionDigits: 2 }).format(t || 0);
  } catch {
    return `${(t || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${s}`.trim();
  }
}
function ut(t, a, s) {
  var n, l, p, x, m;
  const r = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.ModalManager;
  if (!r) {
    (x = (p = (l = window == null ? void 0 : window.abp) == null ? void 0 : l.notify) == null ? void 0 : p.error) == null || x.call(p, "Kayıt formu yüklenemedi.");
    return;
  }
  const i = ((m = window == null ? void 0 : window.abp) == null ? void 0 : m.appPath) ?? "/", o = new r({ viewUrl: `${i}${t}?TaskId=${a}` });
  o.onResult(() => s == null ? void 0 : s()), o.open();
}
function rr({ taskId: t }) {
  const a = ae(), s = ie("Platform.Expenses.Create"), r = ie("Platform.Incomes.Create"), i = ie("Platform.Invoices.Create");
  if (!t || !s && !r && !i)
    return null;
  const o = () => a.invalidateQueries({ queryKey: ["task-detail", t] });
  return /* @__PURE__ */ e.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
    s && /* @__PURE__ */ e.jsxs(
      X,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => ut("Expenses/CreateModal", t, o),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-up text-[11px]" }),
          "Gider ekle"
        ]
      }
    ),
    r && /* @__PURE__ */ e.jsxs(
      X,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => ut("Incomes/CreateModal", t, o),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-down text-[11px]" }),
          "Gelir ekle"
        ]
      }
    ),
    i && /* @__PURE__ */ e.jsxs(
      X,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => ut("Invoices/CreateModal", t, o),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-invoice text-[11px]" }),
          "Fatura ekle"
        ]
      }
    )
  ] });
}
const Ht = {
  0: { label: "Taslak", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  1: { label: "Gönderildi", bg: "bg-primary-subtle", fg: "text-primary" },
  2: { label: "Ödendi", bg: "bg-success-subtle", fg: "text-success" },
  3: { label: "İptal", bg: "bg-neutral-subtle", fg: "text-text-tertiary" },
  4: { label: "Gecikti", bg: "bg-negative-subtle", fg: "text-negative" }
};
function nr({ invoices: t, action: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: De, children: [
    /* @__PURE__ */ e.jsx(Ue, { title: "Faturalar", action: a }),
    t.map((s) => {
      const r = Ht[s.status] ?? Ht[0];
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
              Le(s.dueDate)
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
function ir({ line: t, projectId: a, matches: s, docsEnabled: r }) {
  const [i, o] = y.useState(!1), n = t.kind === "income";
  return /* @__PURE__ */ e.jsxs("div", { className: "border-t border-subtle first:border-t-0", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5 px-4 py-3 hover:bg-surface-raised", children: [
      /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-7 w-7 rounded-lg bg-neutral-subtle text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n ? "fa-arrow-down" : "fa-arrow-up"} text-[11px]` }) }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] font-semibold text-text-primary", children: t.title || (n ? "Gelir" : "Gider") }),
      r && /* @__PURE__ */ e.jsxs(
        X,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          "aria-expanded": i,
          onClick: () => o((l) => !l),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-[11px]" }),
            s.length > 0 ? `Evrak ${s.length}` : "Evrak"
          ]
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: Le(t.date) }),
      n ? /* @__PURE__ */ e.jsx(Pe, { bg: "bg-success-subtle", fg: "text-success", children: "Gelir" }) : /* @__PURE__ */ e.jsx(Pe, { bg: "bg-warning-subtle", fg: "text-warning", children: "Gider" }),
      /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: `shrink-0 font-mono text-[12.5px] font-bold ${n ? "text-success" : "text-text-primary"}`,
          style: { fontVariantNumeric: "tabular-nums" },
          children: [
            n ? "+" : "−",
            me(t.amount, t.currency)
          ]
        }
      )
    ] }),
    r && i && /* @__PURE__ */ e.jsx(sr, { expenseId: t.id, projectId: a, matches: s })
  ] });
}
function pt({ label: t, value: a, tone: s, note: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: `font-mono text-[22px] font-bold tracking-[-.02em] ${s}`, style: { fontVariantNumeric: "tabular-nums" }, children: a }),
    r && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
  ] });
}
function lr({ options: t, isLoading: a, lineId: s, planned: r, onField: i }) {
  return a ? null : t.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12px] text-text-tertiary", children: "Bu projede bütçe kalemi tanımlı değil — kalemler Finans & Bütçe ekranından açılır." }) : /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Bütçe kalemi" }),
      /* @__PURE__ */ e.jsx(
        ja,
        {
          options: t,
          value: s ?? void 0,
          onChange: (o) => i("budgetLineId", o ?? null),
          placeholder: "Kalem seç",
          size: "sm"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Görev bütçesi" }),
      /* @__PURE__ */ e.jsx(
        rs,
        {
          value: r,
          onValueChange: (o) => i("plannedAmount", o),
          currency: "TRY",
          min: 0,
          size: "sm",
          disabled: !s
        }
      )
    ] })
  ] });
}
function or({ task: t, form: a, spentByCurrency: s, readOnly: r }) {
  const i = (a ? a.values.projectId : t == null ? void 0 : t.projectId) ?? null, { options: o, lines: n, canViewBudget: l, isLoading: p } = Ws(i), x = !!a && !r && l && !!i, m = (a ? a.values.budgetLineId : t == null ? void 0 : t.budgetLineId) ?? null, h = (a ? a.values.plannedAmount : t == null ? void 0 : t.plannedAmount) ?? null;
  if (!x && (!m || h == null))
    return null;
  const d = n.find((k) => k.id === m), f = d ? d.remainingAmount : t == null ? void 0 : t.budgetLineRemaining, c = s, g = !!m && h != null, u = (h ?? 0) - c, b = h > 0 ? Math.round(c / h * 100) : 0, j = u < 0, w = () => {
    a.setField("budgetLineId", null), a.setField("plannedAmount", null);
  };
  return (
    /* Kırpmayan kart ŞART: kalem seçicisinin listesi kartın içine absolute
       konumlanır, TAB_CARD'ın overflow-hidden'ı onu alt kenarda keserdi. */
    /* @__PURE__ */ e.jsxs("div", { className: Fa, children: [
      /* @__PURE__ */ e.jsx(
        Ue,
        {
          title: "Bütçe bağı",
          action: x && m ? /* @__PURE__ */ e.jsx(X, { type: "button", variant: "ghost", size: "sm", onClick: w, children: "Bağı kaldır" }) : null
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "px-4 pb-4 pt-1 flex flex-col gap-3", children: [
        x ? /* @__PURE__ */ e.jsx(
          lr,
          {
            options: o,
            isLoading: p,
            lineId: m,
            planned: h,
            onField: a.setField
          }
        ) : /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-semibold text-accent", children: t.budgetLineName || "Bütçe kalemi" }) }),
        f != null && /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "kalemde kalan ",
          me(f, "TRY")
        ] }),
        g && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3", children: [
            /* @__PURE__ */ e.jsx(mt, { label: "Görev bütçesi", value: me(h, "TRY") }),
            /* @__PURE__ */ e.jsx(mt, { label: "Gerçekleşen", value: me(c, "TRY") }),
            /* @__PURE__ */ e.jsx(
              mt,
              {
                label: "Kalan",
                value: me(u, "TRY"),
                tone: j ? "text-negative" : "text-success"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
              "div",
              {
                className: `h-full rounded-full ${j ? "bg-negative" : b >= 80 ? "bg-warning" : "bg-success"}`,
                style: { width: `${Math.min(Math.max(b, 0), 100)}%` }
              }
            ) }),
            /* @__PURE__ */ e.jsxs("div", { className: "mt-1 text-[11.5px] text-text-tertiary", children: [
              "%",
              b,
              j && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative", children: "· görev bütçesi aşıldı" })
            ] })
          ] })
        ] })
      ] })
    ] })
  );
}
function mt({ label: t, value: a, tone: s }) {
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
function cr({ task: t, taskId: a, form: s, readOnly: r = !1 }) {
  const i = (t == null ? void 0 : t.expenses) || [], o = (t == null ? void 0 : t.incomes) || [], n = (t == null ? void 0 : t.invoices) || [], l = (s ? s.values.projectId : t == null ? void 0 : t.projectId) ?? null, { byExpense: p, enabled: x } = Xs(l), m = i.filter((u) => (u.currency || "TRY") === "TRY").reduce((u, b) => u + (b.amount || 0), 0), h = /* @__PURE__ */ e.jsx(or, { task: t, form: s, spentByCurrency: m, readOnly: r }), d = /* @__PURE__ */ e.jsx(rr, { taskId: a ?? (t == null ? void 0 : t.id) });
  if (i.length === 0 && o.length === 0 && n.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      h,
      /* @__PURE__ */ e.jsxs("div", { className: De, children: [
        /* @__PURE__ */ e.jsx(Ue, { title: "Görev Finansı", action: d }),
        /* @__PURE__ */ e.jsx(
          de,
          {
            icon: "fa-coins",
            title: "Kayıt yok",
            description: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
          }
        )
      ] })
    ] });
  const c = Array.from(new Set([...i, ...o].map((u) => u.currency || "TRY"))).map((u) => {
    const b = o.filter((w) => (w.currency || "TRY") === u).reduce((w, k) => w + (k.amount || 0), 0), j = i.filter((w) => (w.currency || "TRY") === u).reduce((w, k) => w + (k.amount || 0), 0);
    return { cur: u, inc: b, exp: j, net: b - j };
  }), g = [
    ...o.map((u) => ({ ...u, kind: "income" })),
    ...i.map((u) => ({ ...u, kind: "expense" }))
  ].sort((u, b) => new Date(b.date || 0) - new Date(u.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    h,
    c.map(({ cur: u, inc: b, exp: j, net: w }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(pt, { label: `Toplam Gelir (${u})`, value: me(b, u), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(pt, { label: `Toplam Gider (${u})`, value: me(j, u), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        pt,
        {
          label: `Net Bakiye (${u})`,
          value: me(w, u),
          tone: w >= 0 ? "text-success" : "text-negative",
          note: w >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, u)),
    n.length > 0 && /* @__PURE__ */ e.jsx(nr, { invoices: n, action: g.length === 0 ? d : null }),
    g.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: De, children: [
      /* @__PURE__ */ e.jsx(Ue, { title: "Finans kalemleri", action: d }),
      g.map((u) => /* @__PURE__ */ e.jsx(
        ir,
        {
          line: u,
          projectId: l,
          matches: u.kind === "expense" ? p.get(u.id) ?? [] : [],
          docsEnabled: x && u.kind === "expense"
        },
        `${u.kind}-${u.id}`
      ))
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11px] text-text-tertiary", children: "Buradan eklenen kayıt göreve ve projesine etiketlenir; düzenleme/silme Finans modülünden yapılır. Evraklar Belgeler modülünde yaşar, buradan gidere bağlanır." })
  ] });
}
function dr({ taskId: t }) {
  const { attachments: a, isLoading: s, upload: r, remove: i, isUploading: o } = St(t), n = y.useRef(null), [l, p] = y.useState(!1), x = a.filter((d) => Ot(d.fileName)), m = async (d) => {
    var f, c, g, u, b, j, w, k, T;
    if (d) {
      if (!Ot(d.name)) {
        (g = (c = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : c.error) == null || g.call(c, "Galeriye yalnız görsel dosya yüklenebilir.");
        return;
      }
      try {
        await r(d), (j = (b = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : b.success) == null || j.call(b, "Görsel yüklendi.");
      } catch (z) {
        (T = (k = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : k.error) == null || T.call(k, (z == null ? void 0 : z.message) || "Görsel yüklenemedi.");
      } finally {
        n.current && (n.current.value = "");
      }
    }
  }, h = async (d, f) => {
    var c, g, u;
    try {
      await i(d);
    } catch (b) {
      (u = (g = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : g.error) == null || u.call(g, (b == null ? void 0 : b.message) || `${f} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: n,
        type: "file",
        accept: "image/*",
        className: "hidden",
        onChange: (d) => {
          var f;
          return m((f = d.target.files) == null ? void 0 : f[0]);
        },
        disabled: o
      }
    ),
    s && x.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !s && x.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görevde henüz görsel yok. Yüklediğiniz görseller Dosyalar sekmesinde de görünür." }),
    x.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3", children: x.map((d) => /* @__PURE__ */ e.jsxs(
      "figure",
      {
        className: "group relative m-0 flex flex-col overflow-hidden rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
        children: [
          /* @__PURE__ */ e.jsx(
            "a",
            {
              href: d.downloadUrl,
              target: "_blank",
              rel: "noreferrer",
              title: `${d.fileName} — tam boyutta aç`,
              className: "block aspect-[4/3] overflow-hidden bg-neutral-subtle",
              children: /* @__PURE__ */ e.jsx(
                "img",
                {
                  src: d.downloadUrl,
                  alt: d.fileName,
                  loading: "lazy",
                  className: "h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                }
              )
            }
          ),
          /* @__PURE__ */ e.jsxs("figcaption", { className: "flex items-center justify-between gap-2 p-2.5", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12px] font-bold text-text-primary", title: d.fileName, children: d.fileName }),
              /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: La(d.fileSize) })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                title: "Sil",
                "aria-label": `${d.fileName} gorselini sil`,
                onClick: () => h(d.id, d.fileName),
                className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
              }
            )
          ] })
        ]
      },
      d.id
    )) }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "button",
        tabIndex: 0,
        onClick: () => {
          var d;
          return (d = n.current) == null ? void 0 : d.click();
        },
        onKeyDown: (d) => {
          var f;
          d.key === "Enter" && ((f = n.current) == null || f.click());
        },
        onDragOver: (d) => {
          d.preventDefault(), l || p(!0);
        },
        onDragLeave: () => p(!1),
        onDrop: (d) => {
          var f, c;
          d.preventDefault(), p(!1), m((c = (f = d.dataTransfer) == null ? void 0 : f.files) == null ? void 0 : c[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${l ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${o ? "fa-circle-notch fa-spin" : "fa-images"} text-[26px] ${l ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: o ? "Yükleniyor…" : l ? "Bırakın, yükleyelim" : "Görselleri buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, JPG, GIF, WEBP, SVG · max 25MB" })
        ]
      }
    )
  ] });
}
const xr = [
  { key: "title", label: "Başlık", align: "left" },
  { key: "status", label: "Durum", align: "left" },
  { key: "priority", label: "Öncelik", align: "left" },
  { key: "assignee", label: "Atanan", align: "left" },
  { key: "dueDate", label: "Termin", align: "right" }
];
function Jt(t, a) {
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
function ur(t, a, s, r) {
  const i = Jt(t, s), o = Jt(a, s), n = i === null || i === "", l = o === null || o === "";
  return n && l ? 0 : n ? 1 : l ? -1 : i === o ? 0 : (i < o ? -1 : 1) * (r === "asc" ? 1 : -1);
}
function pr({ task: t = {}, onOpenSubtask: a }) {
  const [s, r] = y.useState({ key: "dueDate", dir: "asc" }), i = (t == null ? void 0 : t.subTasks) ?? [], o = y.useMemo(
    () => [...i].sort((l, p) => ur(l, p, s.key, s.dir)),
    [i, s.key, s.dir]
  ), n = (l) => r((p) => p.key === l ? { key: l, dir: p.dir === "asc" ? "desc" : "asc" } : { key: l, dir: "asc" });
  return i.length === 0 ? /* @__PURE__ */ e.jsx(
    de,
    {
      icon: "fa-table",
      title: "Alt görev yok",
      description: "Alt Görevler sekmesinden ekledikleriniz burada tablo olarak listelenir."
    }
  ) : /* @__PURE__ */ e.jsx("div", { className: `${De} overflow-x-auto`, children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse text-[12.5px]", children: [
    /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsx("tr", { className: "bg-surface-raised", children: xr.map((l) => {
      const p = s.key === l.key;
      return /* @__PURE__ */ e.jsx(
        "th",
        {
          scope: "col",
          "aria-sort": p ? s.dir === "asc" ? "ascending" : "descending" : "none",
          className: `px-3.5 py-2.5 border-b border-subtle font-bold text-text-secondary whitespace-nowrap ${l.align === "right" ? "text-right" : "text-left"}`,
          children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => n(l.key),
              className: `inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer font-bold ${p ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`,
              children: [
                l.label,
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid text-[9px] ${p ? s.dir === "asc" ? "fa-arrow-up-short-wide" : "fa-arrow-down-wide-short" : "fa-sort opacity-40"}` })
              ]
            }
          )
        },
        l.key
      );
    }) }) }),
    /* @__PURE__ */ e.jsx("tbody", { children: o.map((l) => {
      const p = fe(l.status), x = ot(l.priority), m = Na(l.dueDate);
      return /* @__PURE__ */ e.jsxs(
        "tr",
        {
          onClick: () => a == null ? void 0 : a(l.id),
          className: "border-b border-subtle last:border-b-0 cursor-pointer hover:bg-surface-raised",
          children: [
            /* @__PURE__ */ e.jsxs("td", { className: "px-3.5 py-2.5 max-w-[320px]", children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: (h) => {
                    h.stopPropagation(), a == null || a(l.id);
                  },
                  title: l.title,
                  className: `block w-full truncate bg-transparent border-0 p-0 text-left font-semibold cursor-pointer ${l.status === 4 ? "line-through text-text-tertiary" : "text-text-primary"}`,
                  children: l.title
                }
              ),
              l.code && /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: l.code })
            ] }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(Pe, { bg: p.bg, fg: p.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${p.icon} text-[9px] mr-1` }),
              p.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(Pe, { bg: x.bg, fg: x.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x.icon} text-[9px] mr-1` }),
              x.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: l.assigneeName ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ e.jsx(ct, { name: l.assigneeName, size: 22 }),
              /* @__PURE__ */ e.jsx("span", { className: "truncate text-text-secondary", children: l.assigneeName })
            ] }) : /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: "Atanmadı" }) }),
            /* @__PURE__ */ e.jsxs("td", { className: `px-3.5 py-2.5 text-right whitespace-nowrap ${m.tone}`, children: [
              l.dueDate ? Le(l.dueDate) : "—",
              m.hint && /* @__PURE__ */ e.jsx("div", { className: "text-[11px]", children: m.hint })
            ] })
          ]
        },
        l.id
      );
    }) })
  ] }) });
}
function mr({ taskId: t, task: a = {}, onOpenSubtask: s }) {
  const r = ae(), i = (a == null ? void 0 : a.subTasks) ?? [], [o, n] = y.useState(null), [l, p] = y.useState(null), x = async (m, h) => {
    var f, c, g;
    const d = i.find((u) => u.id === m);
    if (!(!d || d.status === h || !_e(d).canChangeStatus)) {
      p(m);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.updateStatus(m, h)), await r.invalidateQueries({ queryKey: ["task-detail", t] });
      } catch (u) {
        (g = (c = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : c.error) == null || g.call(c, (u == null ? void 0 : u.message) || "Alt görev durumu güncellenemedi.");
      } finally {
        p(null);
      }
    }
  };
  return i.length === 0 ? /* @__PURE__ */ e.jsx(
    de,
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 items-start", children: rt.map((m) => {
      const h = fe(m), d = i.filter((c) => c.status === m), f = o === m;
      return /* @__PURE__ */ e.jsxs(
        "section",
        {
          "aria-label": `${h.label} sütunu`,
          onDragOver: (c) => {
            c.preventDefault(), o !== m && n(m);
          },
          onDragLeave: () => n((c) => c === m ? null : c),
          onDrop: (c) => {
            var u;
            c.preventDefault(), n(null);
            const g = (u = c.dataTransfer) == null ? void 0 : u.getData("text/plain");
            g && x(g, m);
          },
          className: `flex flex-col gap-2 p-2.5 rounded-2xl border bg-surface-raised min-h-[120px] transition-colors duration-fast ${f ? "border-focus bg-primary-subtle" : "border-subtle"}`,
          children: [
            /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-2 px-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${h.dot}` }),
              /* @__PURE__ */ e.jsx("h3", { className: "m-0 flex-1 text-[12px] font-bold text-text-primary", children: h.label }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: d.length })
            ] }),
            d.map((c) => {
              const g = ot(c.priority), u = _e(c).canChangeStatus;
              return /* @__PURE__ */ e.jsxs(
                "article",
                {
                  draggable: u,
                  onDragStart: (b) => {
                    var j;
                    return (j = b.dataTransfer) == null ? void 0 : j.setData("text/plain", c.id);
                  },
                  role: "button",
                  tabIndex: 0,
                  onClick: () => s == null ? void 0 : s(c.id),
                  onKeyDown: (b) => {
                    b.key === "Enter" && (s == null || s(c.id));
                  },
                  className: `flex flex-col gap-2 p-2.5 rounded-[12px] border border-subtle bg-surface-base shadow-xs cursor-pointer hover:border-focus hover:shadow-md ${l === c.id ? "opacity-60" : ""}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary line-clamp-2", children: c.title }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                      /* @__PURE__ */ e.jsxs("span", { className: `text-[10.5px] font-bold ${g.fg}`, children: [
                        /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${g.icon} text-[9px] mr-1` }),
                        g.label
                      ] }),
                      c.dueDate && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: Le(c.dueDate) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2 border-t border-subtle", children: [
                      c.assigneeName ? /* @__PURE__ */ e.jsx(ct, { name: c.assigneeName, size: 20 }) : /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] text-text-tertiary", children: "Atanmadı" }),
                      /* @__PURE__ */ e.jsx(
                        "select",
                        {
                          "aria-label": `${c.title} durumunu değiştir`,
                          value: c.status,
                          onClick: (b) => b.stopPropagation(),
                          onChange: (b) => x(c.id, Number(b.target.value)),
                          disabled: !u,
                          className: `h-[24px] px-1.5 rounded-[6px] border border-subtle bg-surface-base text-[10.5px] text-text-secondary ${u ? "cursor-pointer" : "cursor-default"}`,
                          children: rt.map((b) => /* @__PURE__ */ e.jsx("option", { value: b, children: fe(b).label }, b))
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
        m
      );
    }) })
  );
}
const fr = [
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
], br = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], Wt = (t) => String(t).padStart(2, "0"), Ra = (t, a, s) => `${t}-${Wt(a + 1)}-${Wt(s)}`;
function kt(t) {
  if (!t) return null;
  const a = /^(\d{4}-\d{2}-\d{2})/.exec(String(t));
  return a ? a[1] : null;
}
function hr(t, a) {
  const r = (new Date(t, a, 1).getDay() + 6) % 7, i = new Date(t, a + 1, 0).getDate(), o = [];
  for (let n = 0; n < 42; n++) {
    const l = n - r + 1;
    o.push(l >= 1 && l <= i ? { key: Ra(t, a, l), day: l, inMonth: !0 } : { key: `bos-${n}`, day: null, inMonth: !1 });
  }
  return o;
}
function gr(t) {
  const a = /* @__PURE__ */ new Map(), s = (r, i) => {
    const o = kt(r);
    o && (a.has(o) || a.set(o, []), a.get(o).push(i));
  };
  s(t == null ? void 0 : t.startDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "start", isSelf: !0, status: t == null ? void 0 : t.status }), s(t == null ? void 0 : t.dueDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "due", isSelf: !0, status: t == null ? void 0 : t.status });
  for (const r of (t == null ? void 0 : t.subTasks) ?? [])
    s(r.startDate, { id: r.id, title: r.title, kind: "start", isSelf: !1, status: r.status }), s(r.dueDate, { id: r.id, title: r.title, kind: "due", isSelf: !1, status: r.status });
  return a;
}
function yr({ task: t = {}, onOpenSubtask: a }) {
  const s = y.useMemo(() => gr(t), [t]), [r, i] = y.useState(() => {
    const x = kt(t == null ? void 0 : t.startDate) ?? kt(t == null ? void 0 : t.dueDate);
    if (x) {
      const [h, d] = x.split("-").map(Number);
      return { year: h, month: d - 1 };
    }
    const m = /* @__PURE__ */ new Date();
    return { year: m.getFullYear(), month: m.getMonth() };
  }), o = y.useMemo(() => hr(r.year, r.month), [r.year, r.month]), n = (x) => i(({ year: m, month: h }) => {
    const d = h + x;
    return { year: m + Math.floor(d / 12), month: (d % 12 + 12) % 12 };
  }), l = /* @__PURE__ */ new Date(), p = Ra(l.getFullYear(), l.getMonth(), l.getDate());
  return s.size === 0 ? /* @__PURE__ */ e.jsx(
    de,
    {
      icon: "fa-calendar",
      title: "Takvimde gösterilecek tarih yok",
      description: "Göreve başlangıç veya termin tarihi girildiğinde burada aylık takvimde görünür."
    }
  ) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-3.5 py-3 border-b border-subtle bg-surface-raised", children: [
      /* @__PURE__ */ e.jsxs("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: [
        fr[r.month],
        " ",
        r.year
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Önceki ay",
            onClick: () => n(-1),
            className: "flex items-center justify-center h-7 w-7 rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-left text-[11px]" })
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => i({ year: l.getFullYear(), month: l.getMonth() }),
            className: "h-7 px-2.5 rounded-lg border border-subtle bg-surface-base text-[11.5px] font-semibold text-text-secondary hover:text-text-primary cursor-pointer",
            children: "Bugün"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Sonraki ay",
            onClick: () => n(1),
            className: "flex items-center justify-center h-7 w-7 rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-right text-[11px]" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-subtle bg-surface-raised", children: br.map((x) => /* @__PURE__ */ e.jsx("span", { className: "px-2 py-1.5 text-center text-[11px] font-bold text-text-tertiary", children: x }, x)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: o.map((x) => {
      const m = x.inMonth ? s.get(x.key) ?? [] : [], h = x.key === p;
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: `flex flex-col gap-1 min-h-[76px] p-1.5 border-r border-b border-subtle last-of-type:border-r-0 ${x.inMonth ? "" : "bg-surface-sunken"}`,
          children: [
            x.inMonth && /* @__PURE__ */ e.jsx("span", { className: `self-end font-mono text-[11px] font-bold ${h ? "flex items-center justify-center h-[18px] w-[18px] rounded-full bg-primary text-white" : "text-text-tertiary"}`, children: x.day }),
            m.map((d, f) => {
              const c = fe(d.status);
              return /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  title: `${d.title} — ${d.kind === "due" ? "termin" : "başlangıç"}`,
                  onClick: () => {
                    d.isSelf || a == null || a(d.id);
                  },
                  className: `flex items-center gap-1 w-full px-1.5 py-[3px] rounded-[6px] text-left text-[10.5px] font-semibold ${c.bg} ${c.fg} ${d.isSelf ? "cursor-default" : "cursor-pointer hover:brightness-95"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.kind === "due" ? "fa-flag-checkered" : "fa-play"} text-[8px] shrink-0` }),
                    /* @__PURE__ */ e.jsx("span", { className: "truncate", children: d.title })
                  ]
                },
                `${d.id}-${d.kind}-${f}`
              );
            })
          ]
        },
        x.key
      );
    }) })
  ] });
}
function Ye() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function vr(t) {
  const a = Ye();
  return a ? Promise.resolve(a.getDocuments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function jr(t) {
  const a = ae(), s = ["task-documents", t], r = ee({
    queryKey: s,
    queryFn: () => vr(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), o = te({
    mutationFn: (p) => Promise.resolve(Ye().createDocument(t, p)),
    onSuccess: i
  }), n = te({
    mutationFn: ({ id: p, title: x, content: m }) => Promise.resolve(Ye().updateDocument(p, { title: x, content: m })),
    onSuccess: (p) => {
      i(), p != null && p.id && a.setQueryData(["task-document", p.id], p);
    }
  }), l = te({
    mutationFn: (p) => Promise.resolve(Ye().deleteDocument(p)),
    onSuccess: i
  });
  return {
    documents: r.data ?? [],
    isLoading: r.isLoading,
    createDocument: o.mutateAsync,
    updateDocument: n.mutateAsync,
    removeDocument: l.mutateAsync,
    isSaving: n.isPending
  };
}
function Nr(t) {
  return ee({
    queryKey: ["task-document", t],
    queryFn: () => Promise.resolve(Ye().getDocument(t)),
    enabled: !!t,
    /* Kayıt tam değiştirir (updateDocument {id,title,content}); bayat gövdeden
       kaydetmek başka ekranda yapılan değişikliği ezer. */
    meta: { persist: !1 },
    retry: !1
  });
}
function wr({ taskId: t }) {
  const { documents: a, isLoading: s, createDocument: r, updateDocument: i, removeDocument: o, isSaving: n } = jr(t), [l, p] = y.useState(null), [x, m] = y.useState(""), [h, d] = y.useState(""), [f, c] = y.useState(!1), { data: g, isFetching: u } = Nr(l);
  y.useEffect(() => {
    !g || g.id !== l || (m(g.title ?? ""), d(g.content ?? ""), c(!1));
  }, [g == null ? void 0 : g.id]);
  const b = async () => {
    var T, z, R;
    try {
      const M = await r("Yeni belge");
      M != null && M.id && p(M.id);
    } catch (M) {
      (R = (z = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : z.error) == null || R.call(z, (M == null ? void 0 : M.message) || "Belge oluşturulamadı.");
    }
  }, j = async () => {
    var z, R, M, q, Y, K, _, O, Q;
    const T = x.trim();
    if (!T) {
      (M = (R = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : R.error) == null || M.call(R, "Belge başlığı boş olamaz.");
      return;
    }
    try {
      await i({ id: l, title: T, content: h }), c(!1), (K = (Y = (q = window == null ? void 0 : window.abp) == null ? void 0 : q.notify) == null ? void 0 : Y.success) == null || K.call(Y, "Belge kaydedildi.");
    } catch (U) {
      (Q = (O = (_ = window == null ? void 0 : window.abp) == null ? void 0 : _.notify) == null ? void 0 : O.error) == null || Q.call(O, (U == null ? void 0 : U.message) || "Belge kaydedilemedi.");
    }
  }, w = async (T, z) => {
    var R, M, q;
    try {
      await o(T), l === T && p(null);
    } catch (Y) {
      (q = (M = (R = window == null ? void 0 : window.abp) == null ? void 0 : R.notify) == null ? void 0 : M.error) == null || q.call(M, (Y == null ? void 0 : Y.message) || `“${z}” silinemedi.`);
    }
  }, k = () => {
    f && !window.confirm("Kaydedilmemiş değişiklikleriniz var. Yine de kapatılsın mı?") || p(null);
  };
  return l ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: k,
          "aria-label": "Belge listesine dön",
          className: "flex items-center justify-center h-8 w-8 rounded-[9px] border border-subtle bg-surface-base text-text-tertiary hover:text-text-primary cursor-pointer",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-left text-[12px]" })
        }
      ),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: x,
          "aria-label": "Belge başlığı",
          onChange: (T) => {
            m(T.target.value), c(!0);
          },
          className: "flex-1 min-w-0 h-9 px-3 rounded-[10px] border border-subtle bg-surface-base text-[13.5px] font-bold text-text-primary focus:border-focus focus:shadow-focus focus:outline-none"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: j,
          disabled: n || !f,
          className: `flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[12.5px] font-bold ${n || !f ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n ? "fa-circle-notch fa-spin" : "fa-floppy-disk"} text-[11px]` }),
            n ? "Kaydediliyor…" : f ? "Kaydet" : "Kaydedildi"
          ]
        }
      )
    ] }),
    u && !g ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Belge yükleniyor…" }) : /* @__PURE__ */ e.jsx(
      wa,
      {
        value: h,
        placeholder: "Belgeyi buraya yazın…",
        onChange: (T) => {
          d(T), c(!0);
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
          onClick: b,
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
      de,
      {
        icon: "fa-file-lines",
        title: "Henüz belge yok",
        description: "Toplantı notu, teknik şartname ya da teslim tutanağı gibi metinleri buraya yazabilirsiniz."
      }
    ),
    a.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: a.map((T) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "group flex items-center gap-3 px-3.5 py-3 border-b border-subtle last:border-b-0 hover:bg-surface-raised",
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[14px]" }) }),
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => p(T.id),
              className: "flex-1 min-w-0 bg-transparent border-0 p-0 text-left cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[13px] font-bold text-text-primary", children: T.title }),
                /* @__PURE__ */ e.jsx("span", { className: "block text-[11.5px] text-text-tertiary", children: T.contentLength > 0 ? `${T.editorName} · ${nt(T.lastModificationTime ?? T.creationTime)}` : "Boş belge — açıp yazmaya başlayın" })
              ]
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              "aria-label": `${T.title} belgesini sil`,
              onClick: () => w(T.id, T.title),
              className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[12px]" })
            }
          )
        ]
      },
      T.id
    )) })
  ] });
}
function ze() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function kr(t) {
  const a = ze();
  return a ? Promise.resolve(a.getLinkedForms(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Cr(t) {
  const a = ae(), s = ["task-forms", t], r = ee({
    queryKey: s,
    queryFn: () => kr(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), i = () => a.invalidateQueries({ queryKey: s }), o = te({
    mutationFn: (p) => Promise.resolve(ze().linkForm(t, p)),
    onSuccess: i
  }), n = te({
    mutationFn: (p) => Promise.resolve(ze().unlinkForm(p)),
    onSuccess: i
  }), l = te({
    mutationFn: ({ linkId: p, value: x }) => Promise.resolve(ze().setFormGuestFillable(p, x)),
    onSuccess: i
  });
  return {
    forms: r.data ?? [],
    isLoading: r.isLoading,
    linkForm: o.mutateAsync,
    unlinkForm: n.mutateAsync,
    setGuestFillable: l.mutateAsync,
    isLinking: o.isPending
  };
}
function Dr(t, a) {
  return ee({
    queryKey: ["task-form-options", t],
    queryFn: () => Promise.resolve(ze().getFormOptions(t)),
    enabled: !!t && !!a,
    meta: { persist: !1 },
    retry: !1
  });
}
function Tr(t, a) {
  return ee({
    queryKey: ["task-form-responses", t, a],
    queryFn: () => Promise.resolve(ze().getFormResponses(t, a)),
    enabled: !!t && !!a,
    meta: { persist: !1 },
    retry: !1
  });
}
function Sr({ taskId: t, documentId: a }) {
  const { data: s, isLoading: r } = Tr(t, a);
  return r ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Yanıtlar yükleniyor…" }) : s != null && s.length ? /* @__PURE__ */ e.jsx("ul", { className: "m-0 list-none p-0", children: s.map((i) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-3 px-3.5 py-2 border-t border-subtle", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${i.isGuestSubmission ? "fa-user-clock" : "fa-user"} text-[10px] text-text-tertiary` }),
      /* @__PURE__ */ e.jsx("span", { className: "truncate text-[12.5px] text-text-primary", children: i.respondentName }),
      i.isGuestSubmission && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: "· dış" })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary", children: nt(i.creationTime) })
  ] }, i.id)) }) : /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Bu görevde henüz yanıt yok." });
}
function $r({ taskId: t }) {
  const { forms: a, isLoading: s, linkForm: r, unlinkForm: i, setGuestFillable: o, isLinking: n } = Cr(t), [l, p] = y.useState(!1), [x, m] = y.useState(null), { data: h, isLoading: d } = Dr(t, l), f = ie("Platform.Tasks.ShareExternally"), c = async (b) => {
    var j, w, k;
    try {
      await r(b), p(!1);
    } catch (T) {
      (k = (w = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : w.error) == null || k.call(w, (T == null ? void 0 : T.message) || "Form bağlanamadı.");
    }
  }, g = async (b) => {
    var j, w, k;
    if (window.confirm(`“${b.title}” bağlantısı kaldırılsın mı? Form ve toplanmış yanıtlar silinmez.`))
      try {
        await i(b.id);
      } catch (T) {
        (k = (w = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : w.error) == null || k.call(w, (T == null ? void 0 : T.message) || "Bağlantı kaldırılamadı.");
      }
  }, u = async (b, j) => {
    var w, k, T;
    try {
      await o({ linkId: b.id, value: j });
    } catch (z) {
      (T = (k = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : k.error) == null || T.call(k, (z == null ? void 0 : z.message) || "Ayar değiştirilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Formlar" }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => p((b) => !b),
          className: "flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l ? "fa-xmark" : "fa-plus"} text-[11px]` }),
            l ? "Kapat" : "Form bağla"
          ]
        }
      )
    ] }),
    l && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-raised overflow-hidden", children: [
      d && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Formlar yükleniyor…" }),
      !d && !(h != null && h.length) && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Bağlanabilecek form yok. Önce Form Yönetimi'nden bir form oluşturun." }),
      h == null ? void 0 : h.map((b) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          disabled: b.isLinked || n,
          onClick: () => c(b.documentId),
          className: `flex items-center justify-between gap-3 px-3.5 py-2.5 border-b border-subtle last:border-b-0 text-left ${b.isLinked ? "cursor-not-allowed opacity-55" : "cursor-pointer hover:bg-surface-hover"}`,
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "truncate text-[12.5px] font-semibold text-text-primary", children: b.title }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[11px] text-text-tertiary", children: b.isLinked ? "zaten bağlı" : b.isPublished ? "yayında" : "taslak" })
          ]
        },
        b.documentId
      ))
    ] }),
    s && a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !s && a.length === 0 && !l && /* @__PURE__ */ e.jsx(
      de,
      {
        icon: "fa-clipboard-list",
        title: "Göreve bağlı form yok",
        description: "Saha formu, kabul kontrol listesi ya da anket bağlayıp yanıtları bu görevin altında toplayabilirsiniz."
      }
    ),
    a.map((b) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-3.5 py-3", children: [
        /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clipboard-list text-[14px]" }) }),
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => m((j) => j === b.documentId ? null : b.documentId),
            className: "flex-1 min-w-0 bg-transparent border-0 p-0 text-left cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] font-bold text-text-primary", children: b.title }),
                !b.isPublished && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] font-bold text-warning", children: "taslak" })
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "block text-[11.5px] text-text-tertiary", children: b.responseCount > 0 ? `${b.responseCount} yanıt · bu görevde` : "Bu görevde henüz yanıt yok" })
            ]
          }
        ),
        b.responseCount > 0 && /* @__PURE__ */ e.jsx(za, { children: b.responseCount }),
        b.isPublished && b.slug && /* @__PURE__ */ e.jsx(
          "a",
          {
            href: `/f/${b.slug}?taskId=${b.taskId}`,
            target: "_blank",
            rel: "noreferrer",
            title: "Formu doldur",
            "aria-label": `${b.title} formunu doldur`,
            className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary hover:bg-primary-subtle hover:text-primary",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-up-right-from-square text-[11px]" })
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            title: "Bağlantıyı kaldır",
            "aria-label": `${b.title} bağlantısını kaldır`,
            onClick: () => g(b),
            className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[12px]" })
          }
        )
      ] }),
      f && b.isPublished && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 px-3.5 pb-3 text-[11.5px] text-text-secondary cursor-pointer", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: !!b.isGuestFillable,
            onChange: (j) => u(b, j.target.checked)
          }
        ),
        "Süreli paylaşım linkiyle ekip dışından da doldurulabilsin"
      ] }),
      x === b.documentId && /* @__PURE__ */ e.jsx(Sr, { taskId: t, documentId: b.documentId })
    ] }, b.id))
  ] });
}
const Pr = {
  0: "bg-neutral-400",
  1: "bg-text-tertiary",
  2: "bg-warning",
  3: "bg-primary",
  4: "bg-success"
};
function ft(t) {
  if (!t) return null;
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? null : a;
}
const Ke = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
function Er({ task: t = {} }) {
  const a = y.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((n, l) => ({
    id: n.id || `row-${l}`,
    name: n.title || "Başlıksız görev",
    isMain: !!n.__main,
    start: ft(n.startDate),
    end: ft(n.dueDate) || ft(n.completedDate),
    status: n.status ?? 1
  })), [t]), { min: s, span: r } = y.useMemo(() => {
    const o = a.flatMap((p) => [p.start, p.end]).filter(Boolean).map((p) => p.getTime());
    if (o.length === 0) return { min: null, span: 0 };
    const n = Math.min(...o), l = Math.max(...o);
    return { min: n, span: Math.max(1, l - n) };
  }, [a]), i = y.useMemo(() => s === null ? [] : [0, 1, 2, 3].map((o) => new Date(s + r * o / 4)), [s, r]);
  return s === null ? /* @__PURE__ */ e.jsx("div", { className: De, children: /* @__PURE__ */ e.jsx(
    de,
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-4 gap-0 pl-[170px] mb-2 lt-860:pl-[110px]", children: i.map((o, n) => /* @__PURE__ */ e.jsx(
      "span",
      {
        className: "pl-2 border-l border-subtle text-[10.5px] font-bold uppercase tracking-[.06em] text-text-tertiary",
        children: Ke(o)
      },
      n
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: a.map((o) => {
      const n = o.start ? o.start.getTime() : s, l = o.end ? Math.max(o.end.getTime(), n) : n, p = (n - s) / r * 100, x = Math.max(2, (l - n) / r * 100), m = Math.max(1, Math.round((l - n) / 864e5));
      return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-0 h-9", children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            className: `w-[170px] lt-860:w-[110px] shrink-0 pr-3 truncate text-[12.5px] ${o.isMain ? "font-bold text-text-primary" : "font-semibold text-text-secondary"}`,
            title: o.name,
            children: o.name
          }
        ),
        /* @__PURE__ */ e.jsx("div", { className: "relative flex-1 h-full rounded-lg bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: `absolute top-[7px] bottom-[7px] flex items-center px-2.5 rounded-[7px] shadow-xs ${Pr[o.status] || "bg-primary"}`,
            style: { left: `${p}%`, width: `${x}%` },
            title: `${Ke(o.start)} – ${Ke(o.end)}`,
            children: /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[10.5px] font-bold text-white", children: [
              m,
              "g"
            ] })
          }
        ) })
      ] }, o.id);
    }) })
  ] });
}
function Ga(t, a = {}) {
  return {
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
    predecessorIds: t.predecessorIds ?? [],
    tagNames: (t.tags ?? []).map((s) => s.name),
    estimatedHours: t.estimatedHours ?? null,
    taskType: t.taskType ?? null,
    sprint: t.sprint ?? null,
    budgetLineId: t.budgetLineId ?? null,
    plannedAmount: t.plannedAmount ?? null,
    ...a
  };
}
function Zt({ icon: t, iconTone: a, title: s, note: r, children: i }) {
  return /* @__PURE__ */ e.jsxs("div", { className: De, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[12px] ${a}` }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: s }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
    ] }),
    i
  ] });
}
function Ar({ task: t = {}, readOnly: a = !1 }) {
  const s = ae(), r = t.predecessorIds || [], i = () => {
    var x, m, h;
    return (h = (m = (x = window == null ? void 0 : window.apya) == null ? void 0 : x.platform) == null ? void 0 : m.tasks) == null ? void 0 : h.task;
  }, { data: o = [], isLoading: n } = ee({
    queryKey: ["task-predecessors", t.id, r],
    queryFn: async () => {
      const x = i();
      return x ? Promise.all(
        r.map(
          (m) => Promise.resolve(x.get(m)).catch(() => ({ id: m, title: "(erişilemeyen görev)", status: null, code: "—" }))
        )
      ) : [];
    },
    enabled: r.length > 0,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = async (x) => {
    var m, h, d, f, c, g;
    try {
      await Promise.resolve(i().update(t.id, Ga(t, {
        predecessorIds: r.filter((u) => u !== x)
      }))), await s.invalidateQueries({ queryKey: ["task-detail", t.id] }), (d = (h = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : h.info) == null || d.call(h, "Bağlantı kaldırıldı.");
    } catch (u) {
      (g = (c = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : c.error) == null || g.call(c, (u == null ? void 0 : u.message) || "Bağlantı kaldırılamadı.");
    }
  }, p = (x) => {
    var m, h, d;
    return (d = (h = (m = window == null ? void 0 : window.apya) == null ? void 0 : m.taskDetail) == null ? void 0 : h.open) == null ? void 0 : d.call(h, x);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsx(
      Zt,
      {
        icon: "fa-arrow-left-long",
        iconTone: "text-warning",
        title: "Öncül görevler",
        note: "bu görev başlamadan tamamlanmalı",
        children: r.length === 0 ? /* @__PURE__ */ e.jsx(de, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : n ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : o.map((x) => {
          const m = x.status == null ? null : fe(x.status);
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: x.code || "—" }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => p(x.id),
                    className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                    children: x.title || "Başlıksız görev"
                  }
                ),
                m && /* @__PURE__ */ e.jsx(Pe, { bg: m.bg, fg: m.fg, children: m.label }),
                !a && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Bağlantıyı kaldır",
                    "aria-label": `${x.title} bağlantısını kaldır`,
                    onClick: () => l(x.id),
                    className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link-slash text-[10px]" })
                  }
                )
              ]
            },
            x.id
          );
        })
      }
    ),
    /* @__PURE__ */ e.jsx(
      Zt,
      {
        icon: "fa-arrow-right-long",
        iconTone: "text-primary",
        title: "Ardıl görevler",
        note: "bu görev bitince başlar",
        children: /* @__PURE__ */ e.jsx(
          de,
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
function Be() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task) || null;
}
function Br(t) {
  const a = ae(), s = ["task-timelogs", t], r = ["task-active-timelog"], i = ee({
    queryKey: s,
    queryFn: () => {
      var x;
      return Promise.resolve((x = Be()) == null ? void 0 : x.getTimeLogs(t));
    },
    enabled: !!t && !!Be(),
    staleTime: 15e3,
    meta: { persist: !1 },
    retry: !1
  }), o = ee({
    queryKey: r,
    /* Kayıt yokken uç 204 döner, proxy undefined çözer; TanStack v5 undefined'ı
       hata sayıp önceki çalışan kaydı ekranda bırakır (sayaç durmazdı). */
    queryFn: () => {
      var x;
      return Promise.resolve((x = Be()) == null ? void 0 : x.getActiveTimeLog()).then((m) => m ?? null);
    },
    enabled: !!Be(),
    staleTime: 5e3,
    /* Canlı sayaç kanbandan da başlatılıp durduruluyor; açılışlar arasında taşınmaz. */
    meta: { persist: !1 },
    retry: !1
  }), n = () => {
    a.invalidateQueries({ queryKey: s }), a.invalidateQueries({ queryKey: r });
  }, l = te({
    mutationFn: () => {
      var x;
      return Promise.resolve((x = Be()) == null ? void 0 : x.startTimeTracking(t));
    },
    onSuccess: n
  }), p = te({
    mutationFn: () => {
      var x;
      return Promise.resolve((x = Be()) == null ? void 0 : x.stopTimeTracking(t));
    },
    onSuccess: n
  });
  return {
    logs: i.data ?? [],
    isLoading: i.isLoading,
    activeLog: o.data ?? null,
    start: l.mutateAsync,
    stop: p.mutateAsync,
    isMutating: l.isPending || p.isPending
  };
}
function Xt(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function Fr({ taskId: t, task: a = {} }) {
  const s = Br(t), r = s.activeLog && s.activeLog.taskId === t ? s.activeLog : null, [i, o] = y.useState(() => Date.now());
  y.useEffect(() => {
    if (!r) return;
    const c = setInterval(() => o(Date.now()), 1e3);
    return () => clearInterval(c);
  }, [r]);
  const n = r ? Math.max(0, Math.floor((i - new Date(r.startTime).getTime()) / 1e3)) : 0, p = s.logs.reduce((c, g) => c + (g.secondsSpent || 0), 0) + n, x = (a == null ? void 0 : a.estimatedHours) ?? null, m = x ? x * 3600 : 0, h = m ? Math.min(100, Math.round(p / m * 100)) : 0, d = m ? Math.max(0, m - p) : 0, f = async () => {
    var c, g, u;
    try {
      r ? await s.stop() : await s.start();
    } catch (b) {
      (u = (g = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : g.error) == null || u.call(g, (b == null ? void 0 : b.message) || "Zaman takibi güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-5 flex-wrap p-[22px] rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[18px]", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: f,
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
              children: Ls(p)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary", children: r ? "Kayıt sürüyor" : "Sayaç duraklatıldı" })
        ] })
      ] }),
      m > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] font-bold text-text-secondary", children: "Tahmin kullanımı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
            dt(p),
            " / ",
            x,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-warning", style: { width: `${h}%` } }) }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "Kalan tahmini süre: ",
          dt(d)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: De, children: [
      /* @__PURE__ */ e.jsx(Ue, { title: "Zaman kayıtları" }),
      s.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : s.logs.length === 0 ? /* @__PURE__ */ e.jsx(
        de,
        {
          icon: "fa-stopwatch",
          title: "Henüz zaman kaydı yok",
          description: "Soldaki yeşil düğmeyle sayacı çalıştırın; durdurduğunuzda kayıt buraya düşer."
        }
      ) : s.logs.map((c) => {
        const g = !c.endTime;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
            children: [
              /* @__PURE__ */ e.jsx(ct, { name: c.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: c.note || c.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                Xt(c.startTime),
                " → ",
                g ? "sürüyor" : Xt(c.endTime)
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary", children: g ? "Aktif" : dt(c.secondsSpent || 0) })
            ]
          },
          c.id
        );
      })
    ] })
  ] });
}
const Qe = [
  {
    code: "general",
    title: "Genel",
    icon: "fa-circle-info",
    category: "gorev",
    isCore: !0,
    order: 0,
    permission: null,
    implemented: !0,
    component: null,
    surfaces: ["task"]
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
    component: Is,
    surfaces: ["task"]
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
    component: Rs,
    surfaces: ["task"]
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
    component: pr,
    surfaces: ["task"]
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
    component: mr,
    surfaces: ["task"]
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
    component: yr,
    surfaces: ["task", "project", "tasks"]
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
    component: qs,
    surfaces: ["task", "project"]
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
    component: Er,
    surfaces: ["task", "project", "tasks"]
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
    component: Ar,
    surfaces: ["task", "project"]
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
    component: cr,
    // Proje ve /Tasks yüzeylerinde Finans katalog modülü değil SABİT sekme
    // (bütçe kapılı) — o yüzden yalnız 'task'.
    surfaces: ["task"]
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
    component: Hs,
    surfaces: ["task", "project"]
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
    component: Os,
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
    component: Ys,
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
    component: Vs,
    surfaces: ["task"]
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
    component: Fr,
    surfaces: ["task"]
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
    hidden: !0,
    // GİZLİ (2026-09-03) — bkz. dosya sonundaki not
    // `hidden` yalnız GÖREV DETAYI yüzeyini kapatır; /Tasks'ta Gösterge
    // Paneli sabit pano olarak zaten var, proje yüzeyi PR-2'de açılacak.
    surfaces: ["project", "tasks"]
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
    component: wr,
    surfaces: ["task", "project"]
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
    component: $r,
    surfaces: ["task", "project"]
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
    component: dr,
    surfaces: ["task", "project", "tasks"]
  }
];
function qa(t = []) {
  const a = new Set(t);
  return Qe.filter((s) => !s.hidden).filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function Ya(t = []) {
  const a = new Set(t);
  return Qe.filter((s) => !s.hidden).filter((s) => !s.isCore).filter((s) => !s.permission || ie(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let We = null;
const at = /* @__PURE__ */ new Set(), bt = /* @__PURE__ */ new Set();
let Ze = !1;
function ea() {
  at.forEach((t) => t());
}
function zr(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const Z = {
  open(t) {
    const a = zr(t);
    a && (We = a, ea());
  },
  close() {
    We = null, ea();
  },
  subscribe(t) {
    return at.add(t), () => at.delete(t);
  },
  getSnapshot() {
    return We;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && bt.add(t);
  },
  emitResult() {
    Ze = !1, bt.forEach((t) => t());
  },
  /** Adada bir yazma oldu ya da başladı — kapanışta liste/kanban tazelensin. */
  markChanged() {
    Ze = !0;
  },
  /** Yalnız yazma olduysa sonuç yayınlar: salt bakıp kapatmak sayfayı yeniden yüklemez.
      'this' kullanılmaz; metot referansla da geçirilebilir. */
  emitResultIfChanged() {
    Ze && Z.emitResult();
  },
  /** Yalnız testler için. */
  reset() {
    We = null, Ze = !1, at.clear(), bt.clear();
  }
}, ta = "apya.taskDetail.fullscreen";
function _a({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, i] = y.useState(t), [o, n] = y.useState([]), { data: l, isPending: p, isError: x, refetch: m } = Dt(r), h = Da(), d = Ea(l), f = Aa(), c = Ba(r), [g, u] = y.useState("general"), [b, j] = y.useState(!1), w = Ge.useRef(null), k = y.useMemo(
    () => qa(c.assignedCodes),
    [c.assignedCodes]
  ), T = y.useMemo(
    () => Ya(c.assignedCodes),
    [c.assignedCodes]
  ), z = k.find((S) => S.code === g) ?? k[0];
  Ge.useEffect(() => {
    z.code !== g && u(z.code);
  }, [z, g]);
  const R = z == null ? void 0 : z.component, M = ae(), [q, Y] = y.useState(
    () => {
      var S;
      return ((S = window.localStorage) == null ? void 0 : S.getItem(ta)) === "1";
    }
  ), [K, _] = y.useState(!1), O = y.useCallback(() => {
    Sa(), s == null || s();
  }, [s]);
  $a(t, O), Ge.useEffect(() => {
    d.isDirty ? h.markDirty() : h.markClean();
  });
  const Q = y.useCallback(() => h.requestClose(O), [h, O]), U = y.useCallback(() => {
    Y((S) => {
      var F;
      const A = !S;
      return (F = window.localStorage) == null || F.setItem(ta, A ? "1" : "0"), A;
    });
  }, []), re = ie("Platform.Tasks.Delete"), [se, E] = y.useState(!1), [L, N] = y.useState(!1), v = y.useCallback(async () => {
    var S, A, F, J, H, Te;
    N(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (F = (A = (S = window == null ? void 0 : window.abp) == null ? void 0 : S.notify) == null ? void 0 : A.info) == null || F.call(A, "Başarıyla silindi."), E(!1), h.markClean(), O();
    } catch (ue) {
      (Te = (H = (J = window == null ? void 0 : window.abp) == null ? void 0 : J.notify) == null ? void 0 : H.error) == null || Te.call(H, (ue == null ? void 0 : ue.message) || "Görev silinemedi.");
    } finally {
      N(!1);
    }
  }, [r, h, O]), $ = y.useCallback(async () => {
    var S, A, F, J, H, Te;
    if (!d.validate()) return !1;
    _(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, d.toUpdateDto())
      ), await M.invalidateQueries({ queryKey: ["task-detail", r] }), Z.emitResult(), (F = (A = (S = window == null ? void 0 : window.abp) == null ? void 0 : S.notify) == null ? void 0 : A.success) == null || F.call(A, "Kaydedildi."), !0;
    } catch (ue) {
      return (Te = (H = (J = window == null ? void 0 : window.abp) == null ? void 0 : J.notify) == null ? void 0 : H.error) == null || Te.call(H, (ue == null ? void 0 : ue.message) || "Kaydedilemedi."), !1;
    } finally {
      _(!1);
    }
  }, [r, d, h, M]), B = y.useCallback(() => {
    $();
  }, [$]), V = y.useCallback(async () => {
    const S = h.resolvePendingClose("save");
    await $() && (S == null || S());
  }, [h, $]), le = y.useCallback((S, A) => {
    h.requestClose(() => {
      n((F) => [...F, { id: r, title: (l == null ? void 0 : l.title) ?? "" }]), i(S), u("general"), h.markClean();
    });
  }, [h, r, l]), be = y.useCallback((S) => {
    h.requestClose(() => {
      n((A) => {
        const F = A.findIndex((J) => J.id === S);
        return F === -1 ? A : A.slice(0, F);
      }), i(S), u("general"), h.markClean();
    });
  }, [h]), ne = y.useCallback(async (S) => {
    var A, F, J;
    try {
      await c.addFeature(S), u(S), j(!1);
    } catch (H) {
      (J = (F = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : F.error) == null || J.call(F, (H == null ? void 0 : H.message) || "Özellik eklenemedi.");
    }
  }, [c]), xe = y.useCallback(async (S) => {
    var A, F, J;
    try {
      await c.removeFeature(S), u((H) => H === S ? "general" : H);
    } catch (H) {
      (J = (F = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : F.error) == null || J.call(F, (H == null ? void 0 : H.message) || "Özellik kaldırılamadı.");
    }
  }, [c]);
  Ge.useEffect(() => {
    if (!b) return;
    const S = (F) => {
      w.current && !w.current.contains(F.target) && j(!1);
    }, A = (F) => {
      F.key === "Escape" && j(!1);
    };
    return document.addEventListener("mousedown", S), document.addEventListener("keydown", A), () => {
      document.removeEventListener("mousedown", S), document.removeEventListener("keydown", A);
    };
  }, [b]);
  const C = p ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(je, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(je, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(je, { className: "h-24 w-full" })
  ] }) : x ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(X, { variant: "ghost", onClick: () => m(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      Ps,
      {
        trail: o,
        current: { id: r, title: (l == null ? void 0 : l.title) ?? "" },
        onNavigate: be
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: w, children: [
      /* @__PURE__ */ e.jsx(
        Ts,
        {
          tabs: k,
          activeCode: z.code,
          onSelect: (S) => {
            u(S), j(!1);
          },
          onOpenPicker: () => j((S) => !S),
          pickerOpen: b
        }
      ),
      b && /* @__PURE__ */ e.jsx(
        $s,
        {
          entries: T,
          busyCode: c.isMutating ? c.mutatingCode : null,
          onAdd: ne,
          onRemove: xe
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${z.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          z.code === "general" ? /* @__PURE__ */ e.jsx(
            ws,
            {
              values: d.values,
              errors: d.errors,
              onFieldChange: d.setField,
              assigneeOptions: f.options,
              isLoadingAssignees: f.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(y.Suspense, { fallback: /* @__PURE__ */ e.jsx(je, { className: "h-24 w-full" }), children: R && /* @__PURE__ */ e.jsx(
            R,
            {
              taskId: r,
              task: l,
              form: d,
              onOpenSubtask: le
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            ks,
            {
              task: l,
              creatorName: f.nameById.get(l.creatorId),
              lastModifierName: f.nameById.get(l.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), G = a === "page" ? bs : fs;
  return /* @__PURE__ */ e.jsxs(
    G,
    {
      open: !0,
      fullscreen: q,
      onRequestClose: Q,
      title: l ? `Görev Detayı: ${l.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        gs,
        {
          task: l ?? { title: "Yükleniyor…" },
          canDelete: re,
          fullscreen: q,
          onToggleFullscreen: U,
          onClose: Q,
          onDelete: () => E(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        vs,
        {
          lastSavedAt: l == null ? void 0 : l.lastModificationTime,
          isDirty: h.isDirty,
          isSaving: K,
          onCancel: Q,
          onSave: B
        }
      ),
      children: [
        C,
        h.pendingClose && /* @__PURE__ */ e.jsx(
          Ir,
          {
            isSaving: K,
            onStay: () => h.resolvePendingClose("stay"),
            onDiscard: () => h.resolvePendingClose("discard"),
            onSaveAndClose: V
          }
        ),
        se && /* @__PURE__ */ e.jsx(
          Lr,
          {
            taskTitle: (l == null ? void 0 : l.title) ?? "",
            busy: L,
            onCancel: () => E(!1),
            onConfirm: v
          }
        )
      ]
    }
  );
}
function Lr({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [i, o] = y.useState(""), n = i.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    Ua,
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
        /* @__PURE__ */ e.jsx(X, { variant: "secondary", onClick: s, disabled: a, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          X,
          {
            variant: "destructive",
            onClick: r,
            disabled: !n,
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
            onChange: (l) => o(l.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function Ua({ label: t, title: a, description: s, children: r, actions: i }) {
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
function Ir({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    Ua,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(X, { variant: "secondary", onClick: a, disabled: t, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ e.jsx(X, { variant: "destructive", onClick: s, disabled: t, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ e.jsx(X, { variant: "primary", onClick: r, isLoading: t, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
const Mr = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function Kr({ isPrivate: t = !1, onChange: a = () => {
}, disabled: s = !1 }) {
  const r = !!t, [i, o] = y.useState(null);
  return /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
      "button",
      {
        ref: o,
        type: "button",
        disabled: s,
        className: `flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary transition-all shadow-sm ${s ? "cursor-default" : "cursor-pointer hover:bg-surface-hover hover:border-default"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r ? "fa-lock" : "fa-globe"} text-[11px] text-text-tertiary` }),
          /* @__PURE__ */ e.jsx("span", { children: r ? "Özel görev" : "Herkese açık" }),
          !s && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[10px] ml-0.5 text-text-tertiary" })
        ]
      }
    ) }),
    /* @__PURE__ */ e.jsx(ke, { container: $e(i), children: /* @__PURE__ */ e.jsxs(
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
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: Mr.map((n) => {
            const l = r === n.value;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => a(n.value),
                className: `flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${l ? "border-primary bg-primary-subtle/40" : "border-subtle hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n.icon} text-base mt-0.5 ${l ? "text-primary" : "text-text-tertiary"}` }),
                  /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ e.jsx("h4", { className: "text-[13px] font-semibold text-text-primary", children: n.title }),
                      l && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ] }),
                    /* @__PURE__ */ e.jsx("p", { className: "text-[12px] text-text-tertiary mt-0.5", children: n.desc })
                  ] })
                ]
              },
              String(n.value)
            );
          }) }),
          /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-text-tertiary mt-3", children: "Değişiklik “Kaydet” ile uygulanır." }),
          /* @__PURE__ */ e.jsx(os, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const aa = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto", Rr = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", Gr = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" },
  { what: "Bağlantı kopyala", key: "⌘ L" }
];
function qr({ children: t }) {
  return /* @__PURE__ */ e.jsx(Ct, { asChild: !0, children: t });
}
function Yr({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "inline-flex items-center h-[19px] px-1.5 rounded-[5px] border border-default border-b-2 bg-neutral-subtle font-mono text-[10px] font-semibold text-text-secondary", children: t });
}
function _r({
  task: t = {},
  presentation: a = "modal",
  onClose: s,
  isFullscreen: r,
  onToggleFullscreen: i,
  onFieldChange: o = () => {
  },
  statusValue: n,
  titleValue: l,
  isPrivateValue: p,
  isFavorite: x,
  onToggleFavorite: m,
  isWatched: h,
  onToggleWatch: d,
  onDuplicate: f,
  onArchive: c,
  onDelete: g,
  onOpenTransfer: u,
  onSaveAsTemplate: b,
  onConvertToSubtask: j,
  onExportPdf: w,
  /* Yetki (root hesaplar; sunucudaki EnsureCanMutateTaskAsync ile aynı kural). Eskiden
     menü ve alanlar herkese açıktı, yetkisiz kullanıcı tıklayınca 403 alıyordu. */
  canEdit: k = !0,
  canChangeStatus: T = !0,
  canDelete: z = !0
}) {
  const [R, M] = y.useState(!1), [q, Y] = y.useState(null), [K, _] = y.useState(!1), O = y.useRef(null), Q = $e(q), U = fe(n ?? t.status), re = t.code || "GRV-—", se = () => {
    var v;
    (v = navigator.clipboard) == null || v.writeText(re), M(!0), setTimeout(() => M(!1), 1800);
  }, E = () => {
    var v, $, B, V;
    (v = navigator.clipboard) == null || v.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), (V = (B = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : B.success) == null || V.call(B, "Görev bağlantısı panoya kopyalandı.");
  }, L = (v) => () => {
    _(!1), v == null || v();
  }, N = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", kbd: "⌘L", onClick: L(E) },
    { label: "Çoğalt", icon: "fa-copy", kbd: "⌘D", allowed: k, onClick: L(f) },
    { label: "Başka projeye kopyala", icon: "fa-clone", allowed: k, onClick: L(() => u == null ? void 0 : u("copy")) },
    { label: "Şablon olarak kaydet", icon: "fa-bookmark", allowed: k, onClick: L(b) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, allowed: k, onClick: L(() => u == null ? void 0 : u("move")) },
    { label: "Alt göreve dönüştür", icon: "fa-diagram-project", allowed: k, onClick: L(j) },
    { label: h ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: L(d) },
    { label: "Arşivle", icon: "fa-box-archive", separator: !0, allowed: T, onClick: L(c) },
    { label: "Yazdır", icon: "fa-print", kbd: "⌘P", onClick: L(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: L(w) },
    { label: "Sil", icon: "fa-trash-can", kbd: "⌫", separator: !0, danger: !0, allowed: z, onClick: L(g) }
  ].filter((v) => v.allowed !== !1);
  return /* @__PURE__ */ e.jsxs("header", { ref: Y, className: "shrink-0 px-6 lt-860:px-4 pt-[18px] pb-4 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: se,
            title: "Kodu kopyala",
            className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[11px] font-bold tracking-[.04em] cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[9px] opacity-70" }),
              /* @__PURE__ */ e.jsx("span", { children: re }),
              /* @__PURE__ */ e.jsx("i", { className: `${R ? "fa-solid fa-check" : "fa-regular fa-copy"} text-[9px] opacity-60` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              disabled: !k,
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] border border-default text-[12px] font-semibold ${k ? "cursor-pointer" : "cursor-default"} ${U.bg} ${U.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-current animate-pulse" }),
                /* @__PURE__ */ e.jsx("span", { children: U.label }),
                k && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(ke, { container: Q, children: /* @__PURE__ */ e.jsxs(Ce, { sideOffset: 6, align: "start", className: `${aa} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            rt.map((v) => {
              const $ = ka[v], B = (n ?? t.status) === v;
              return /* @__PURE__ */ e.jsx(qr, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => o("status", v),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${B ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${$.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: $.label }),
                    B && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, v);
            })
          ] }) })
        ] }),
        h && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 h-[26px] px-2.5 rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11.5px] font-semibold", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-eye text-[10px]" }),
          "Takip ediliyor"
        ] }),
        !k && /* @__PURE__ */ e.jsxs(
          "span",
          {
            title: "Bu görevi yalnız oluşturan, atanan kişi ya da ekip yöneticisi düzenleyebilir. Yorum yazabilirsiniz.",
            className: "flex items-center gap-1.5 h-[26px] px-2.5 rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11.5px] font-semibold",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-lock text-[10px]" }),
              "Salt okunur"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
        /* @__PURE__ */ e.jsx("div", { className: "lt-860:hidden", children: /* @__PURE__ */ e.jsx(
          Kr,
          {
            isPrivate: p ?? !!t.isPrivate,
            onChange: (v) => o("isPrivate", v),
            disabled: !k
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
        /* @__PURE__ */ e.jsxs(Ne, { modal: !0, open: K, onOpenChange: _, children: [
          /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer seçenekler",
              className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${K ? "bg-surface-hover text-text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(ke, { container: Q, children: /* @__PURE__ */ e.jsxs(
            Ce,
            {
              sideOffset: 6,
              align: "end",
              collisionBoundary: Q ?? [],
              collisionPadding: 12,
              className: `${aa} w-[244px]`,
              children: [
                N.map((v) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: v.onClick,
                    className: [
                      Rr,
                      v.danger ? "text-negative" : "text-text-secondary",
                      v.separator ? "border-t border-subtle mt-[5px]" : ""
                    ].join(" "),
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${v.icon} text-[11px] w-[14px] opacity-75` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: v.label }),
                      v.kbd && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: v.kbd })
                    ]
                  },
                  v.label
                )),
                /* @__PURE__ */ e.jsxs("div", { className: "mt-1.5 pt-[9px] px-[9px] pb-[7px] border-t border-subtle", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 mb-[7px]", children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-keyboard text-[11px] text-text-tertiary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-[.09em] text-text-tertiary", children: "Kısayollar" })
                  ] }),
                  Gr.map((v) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: v.what }),
                    /* @__PURE__ */ e.jsx(Yr, { children: v.key })
                  ] }, v.what))
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
          ref: O,
          contentEditable: k,
          suppressContentEditableWarning: !0,
          spellCheck: !1,
          onBlur: k ? (v) => o("title", v.currentTarget.textContent.trim()) : void 0,
          className: `flex-1 min-w-0 text-[24px] lt-560:text-[20px] font-extrabold tracking-[-.025em] leading-[1.2] text-text-primary px-2 -ml-2 py-[3px] rounded-[9px] border border-transparent ${k ? "cursor-text hover:bg-neutral-subtle hover:border-subtle focus:bg-neutral-subtle focus:border-focus focus:shadow-focus focus:outline-none" : ""}`,
          children: l ?? t.title ?? "Başlıksız görev"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: m,
          title: x ? "Favorilerden çıkar" : "Favorilere ekle",
          className: `flex items-center justify-center h-8 w-8 shrink-0 rounded-[9px] cursor-pointer ${x ? "bg-warning-subtle text-warning" : "text-text-tertiary hover:bg-surface-hover"}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${x ? "solid" : "regular"} fa-star text-[15px]` })
        }
      )
    ] })
  ] });
}
const Xe = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", sa = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function ye({ children: t }) {
  return /* @__PURE__ */ e.jsx(Ct, { asChild: !0, children: t });
}
function pe({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[7px] min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.08em] text-text-tertiary select-none", children: t }),
    a
  ] });
}
function ra({ name: t, size: a = 26 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Oe(t), fontSize: a * 0.38 },
      children: Ve(t)
    }
  );
}
function na(t) {
  if (t == null) return "—";
  const a = Math.max(0, Math.round(Number(t) * 60)), s = Math.floor(a / 60), r = a % 60;
  return s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function Ur({
  task: t = {},
  assigneeOptions: a = [],
  projectOptions: s = [],
  onFieldChange: r = () => {
  },
  statusValue: i,
  priorityValue: o,
  assigneeValue: n,
  projectValue: l,
  dueDateValue: p,
  startDateValue: x,
  tagsValue: m = [],
  progressPercent: h = 0,
  progressNote: d = "",
  onOpenTransfer: f,
  /* Düzenleme yetkisi yoksa ızgara salt okunur: tüm alanlar forma, oradan UpdateAsync'e
     gider; yetkisiz kullanıcı değiştirip Kaydet'te 403 alıyordu. */
  readOnly: c = !1
}) {
  var L, N;
  const [g, u] = y.useState(""), [b, j] = y.useState(""), [w, k] = y.useState(""), [T, z] = y.useState(!1), [R, M] = y.useState(null), q = fe(i ?? t.status), Y = ot(o ?? t.priority), K = n ?? t.assigneeId ?? null, _ = l ?? t.projectId ?? null, O = ((L = a.find((v) => v.value === K)) == null ? void 0 : L.label) || t.assigneeName || "Atanmamış", Q = ((N = s.find((v) => v.value === _)) == null ? void 0 : N.label) || t.projectName || "Projesiz", U = Na(p ?? t.dueDate), re = a.filter(
    (v) => !g || v.label.toLowerCase().includes(g.toLowerCase())
  ), se = s.filter(
    (v) => !b || v.label.toLowerCase().includes(b.toLowerCase())
  ), E = () => {
    const v = w.trim();
    v && !m.includes(v) && r("tagNames", [...m, v]), k(""), z(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { ref: M, className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsx(
    "fieldset",
    {
      disabled: c,
      className: "m-0 p-0 border-0 min-w-0 [&:disabled_label]:pointer-events-none [&_:disabled]:pointer-events-none [&:disabled_.fa-chevron-down]:hidden",
      children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6", children: [
        /* @__PURE__ */ e.jsx(pe, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx(ra, { name: K ? O : null }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: O }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(ke, { container: $e(R), children: /* @__PURE__ */ e.jsxs(Ce, { sideOffset: 6, align: "start", className: `${Xe} w-[264px]`, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: g,
                  onChange: (v) => u(v.target.value),
                  placeholder: "Kişi ara…",
                  className: sa
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[230px] overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("assigneeId", null),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] text-left cursor-pointer ${K ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary font-semibold"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "flex h-6 w-6 items-center justify-center rounded-full bg-neutral-subtle text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-user-slash text-[9px]" }) }),
                    /* @__PURE__ */ e.jsx("span", { children: "Atanmamış" })
                  ]
                }
              ) }),
              a.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-2 py-1.5 text-[12px] text-text-tertiary", children: "Kullanıcı listesi yükleniyor…" }),
              re.map((v) => /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("assigneeId", v.value),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${K === v.value ? "bg-primary-subtle" : "hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx(ra, { name: v.label, size: 24 }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: v.label }),
                    K === v.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
                  ]
                }
              ) }, v.value))
            ] })
          ] }) })
        ] }) }),
        /* @__PURE__ */ e.jsxs(pe, { label: "Son tarih", children: [
          /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-regular fa-calendar text-[13px] ${U.tone}` }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "date",
                value: (p ?? t.dueDate ?? "").slice(0, 10),
                onChange: (v) => r("dueDate", v.target.value),
                className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
              }
            )
          ] }),
          U.hint && /* @__PURE__ */ e.jsx("span", { className: `-mt-0.5 text-[10.5px] font-semibold ${U.tone}`, children: U.hint })
        ] }),
        /* @__PURE__ */ e.jsx(pe, { label: "Başlangıç", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[13px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "date",
              value: (x ?? t.startDate ?? "").slice(0, 10),
              onChange: (v) => r("startDate", v.target.value),
              className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
            }
          )
        ] }) }),
        /* @__PURE__ */ e.jsx(pe, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 pt-[5px]", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
            /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: [
              "%",
              h
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-medium text-text-tertiary", children: d })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "h-1.5 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
            "div",
            {
              className: "h-full rounded-full bg-primary transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
              style: { width: `${h}%` }
            }
          ) })
        ] }) }),
        /* @__PURE__ */ e.jsx(pe, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${q.bg} ${q.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${q.icon} text-[11px]` }),
                /* @__PURE__ */ e.jsx("span", { children: q.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(ke, { container: $e(R), children: /* @__PURE__ */ e.jsxs(Ce, { sideOffset: 6, align: "start", className: `${Xe} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            rt.map((v) => {
              const $ = ka[v], B = (i ?? t.status) === v;
              return /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("status", v),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${B ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${$.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: $.label }),
                    B && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
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
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${Y.bg} ${Y.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${Y.icon} text-[11px]` }),
                /* @__PURE__ */ e.jsx("span", { children: Y.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(ke, { container: $e(R), children: /* @__PURE__ */ e.jsxs(Ce, { sideOffset: 6, align: "start", className: `${Xe} w-[184px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
            ns.map((v) => {
              const $ = is[v], B = (o ?? t.priority) === v;
              return /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("priority", v),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${B ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${$.icon} text-[11px] w-[13px]` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: $.label }),
                    B && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, v);
            })
          ] }) })
        ] }) }) }),
        /* @__PURE__ */ e.jsx(pe, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap min-h-8", children: [
          m.map((v) => /* @__PURE__ */ e.jsxs(
            "span",
            {
              className: "inline-flex items-center gap-1.5 h-6 px-2 rounded-[7px] border border-primary bg-primary-subtle text-primary text-[11.5px] font-bold",
              children: [
                /* @__PURE__ */ e.jsx("span", { children: v }),
                !c && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Etiketi kaldır",
                    onClick: () => r("tagNames", m.filter(($) => $ !== v)),
                    className: "flex items-center p-0 border-0 bg-transparent text-current opacity-55 hover:opacity-100 hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
                  }
                )
              ]
            },
            v
          )),
          c ? m.length === 0 && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "—" }) : T ? /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: w,
              onChange: (v) => k(v.target.value),
              onBlur: E,
              onKeyDown: (v) => {
                v.key === "Enter" && E(), v.key === "Escape" && (k(""), z(!1));
              },
              placeholder: "Etiket…",
              className: "h-6 w-24 px-2 rounded-[7px] border border-focus bg-surface-base text-text-primary text-[11.5px] shadow-focus focus:outline-none"
            }
          ) : /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              "aria-label": "Yeni etiket ekle",
              onClick: () => z(!0),
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
          /* @__PURE__ */ e.jsx(ke, { container: $e(R), children: /* @__PURE__ */ e.jsxs(Ce, { sideOffset: 6, align: "start", className: `${Xe} w-[250px]`, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: b,
                  onChange: (v) => j(v.target.value),
                  placeholder: "Proje ara…",
                  className: sa
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[210px] overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("projectId", null),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${_ ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-neutral-400" }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Projesiz" })
                  ]
                }
              ) }),
              se.map((v) => /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("projectId", v.value),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${_ === v.value ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-primary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: v.label }),
                    _ === v.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
                  ]
                }
              ) }, v.value))
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-[7px] pt-[7px] border-t border-subtle", children: [
              /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => f == null ? void 0 : f("move"),
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
                  onClick: () => f == null ? void 0 : f("copy"),
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
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[13px] font-bold text-text-primary", children: na(t.spentHours ?? 0) }),
          /* @__PURE__ */ e.jsxs("span", { className: "text-[12px] text-text-tertiary", children: [
            "/ ",
            t.estimatedHours != null ? na(t.estimatedHours) : "—"
          ] })
        ] }) })
      ] })
    }
  ) });
}
const Vr = "z-popover w-[225px] rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto";
function Pt({ entries: t = [], onPick: a, children: s }) {
  const [r, i] = y.useState(null), o = $e(r);
  return /* @__PURE__ */ e.jsx("span", { ref: i, className: "contents", children: /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(we, { asChild: !0, children: s }),
    /* @__PURE__ */ e.jsx(ke, { container: o, children: /* @__PURE__ */ e.jsxs(Ce, { sideOffset: 6, align: "start", collisionPadding: 12, className: Vr, children: [
      /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Özellik ekle" }),
      t.map((n) => /* @__PURE__ */ e.jsx(Ct, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => a == null ? void 0 : a(n.code, n.isAssigned),
          className: [
            "flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px]",
            "text-[12.5px] font-semibold text-left cursor-pointer",
            n.isAssigned ? "text-text-tertiary hover:bg-surface-hover" : "text-text-primary hover:bg-surface-hover"
          ].join(" "),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n.icon} text-[12px] w-[15px] opacity-85`, "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: n.title }),
            n.isAssigned && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10px] font-extrabold text-primary", children: "✓ açık" })
          ]
        }
      ) }, n.code)),
      t.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-[9px] py-[7px] text-[11.5px] text-text-tertiary", children: "Eklenecek başka özellik yok." })
    ] }) })
  ] }) });
}
function Or({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: i,
  onDragEnd: o,
  onReorderTo: n,
  onReorderDrop: l,
  pickerEntries: p = [],
  onPickFeature: x,
  counts: m = {},
  isDirty: h = !1
}) {
  const [d, f] = y.useState(!1);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-6 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 py-2.5 flex-1 min-w-0 overflow-x-auto custom-scrollbar", children: [
      s.map((c) => {
        const g = t === c.code, u = m[c.code] || 0;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            draggable: !0,
            title: "Sürükleyerek sırayı değiştirin",
            ...Ca(() => a(c.code)),
            onDragStart: (b) => {
              i(c.code);
              try {
                b.dataTransfer.effectAllowed = "move", b.dataTransfer.setData("text/plain", c.code);
              } catch {
              }
            },
            onDragOver: (b) => {
              b.preventDefault(), n(c.code);
            },
            onDrop: (b) => {
              b.preventDefault(), l == null || l();
            },
            onDragEnd: o,
            className: [
              "flex shrink-0 items-center gap-2 h-[34px] px-[13px] rounded-[10px]",
              "text-[12.5px] whitespace-nowrap cursor-grab active:cursor-grabbing",
              "transition-opacity duration-fast",
              g ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
              r === c.code ? "opacity-35" : "opacity-100"
            ].join(" "),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c.icon} text-[11px] opacity-85` }),
              /* @__PURE__ */ e.jsx("span", { children: c.title }),
              u > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                "rounded-full text-[10px] font-extrabold",
                g ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
              ].join(" "), children: u })
            ]
          },
          c.code
        );
      }),
      /* @__PURE__ */ e.jsx(Pt, { entries: p, onPick: x, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          title: "Özellik ekle",
          onClick: () => f(!1),
          onMouseEnter: () => f(!0),
          onMouseLeave: () => f(!1),
          className: [
            "flex shrink-0 items-center gap-[7px] h-[34px] ml-1 rounded-[10px]",
            "border border-dashed border-primary bg-primary-subtle text-primary",
            "text-[12.5px] font-bold whitespace-nowrap cursor-pointer",
            "hover:border-solid",
            "transition-[padding] duration-[160ms] ease-[cubic-bezier(.16,1,.3,1)]",
            d ? "px-[13px]" : "px-[11px]"
          ].join(" "),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            d && /* @__PURE__ */ e.jsx("span", { className: "animate-fade-in-fast", children: "Özellik ekle" })
          ]
        }
      ) })
    ] }),
    h && /* @__PURE__ */ e.jsxs("span", { className: "flex shrink-0 items-center gap-[7px] h-[26px] px-2.5 rounded-full bg-warning-subtle text-warning text-[11px] font-bold", children: [
      /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-warning animate-pulse" }),
      "Taslak"
    ] })
  ] });
}
function Qr({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: i,
  onDragEnd: o,
  onReorderTo: n,
  onReorderDrop: l,
  pickerEntries: p = [],
  onPickFeature: x,
  counts: m = {}
}) {
  return /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Görev özellikleri",
      className: "flex lt-860:hidden flex-col gap-[3px] w-[238px] shrink-0 py-4 px-3 border-r border-subtle bg-surface-base overflow-y-auto custom-scrollbar",
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "px-2.5 pt-1 pb-2 text-[10px] font-extrabold uppercase tracking-[.1em] text-text-tertiary", children: "Özellikler" }),
        s.map((h) => {
          const d = t === h.code, f = m[h.code] || 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              draggable: !0,
              title: "Sürükleyerek sırayı değiştirin",
              ...Ca(() => a(h.code)),
              onDragStart: (c) => {
                i(h.code);
                try {
                  c.dataTransfer.effectAllowed = "move", c.dataTransfer.setData("text/plain", h.code);
                } catch {
                }
              },
              onDragOver: (c) => {
                c.preventDefault(), n(h.code);
              },
              onDrop: (c) => {
                c.preventDefault(), l == null || l();
              },
              onDragEnd: o,
              className: [
                "flex shrink-0 items-center gap-[11px] h-9 px-[11px] rounded-[9px]",
                "text-[12.5px] text-left cursor-grab active:cursor-grabbing",
                "transition-opacity duration-fast",
                d ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
                r === h.code ? "opacity-35" : "opacity-100"
              ].join(" "),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${h.icon} text-[12px] w-[15px] opacity-85` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: h.title }),
                f > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                  "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                  "rounded-full text-[10px] font-extrabold",
                  d ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
                ].join(" "), children: f })
              ]
            },
            h.code
          );
        }),
        /* @__PURE__ */ e.jsx(Pt, { entries: p, onPick: x, children: /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: "flex shrink-0 items-center gap-[11px] h-9 mt-1.5 px-[11px] rounded-[9px] border border-dashed border-primary bg-primary-subtle text-primary text-[12.5px] font-bold text-left cursor-pointer hover:border-solid",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px] w-[15px]" }),
              /* @__PURE__ */ e.jsx("span", { children: "Özellik ekle" })
            ]
          }
        ) })
      ]
    }
  );
}
function Fe({ label: t, value: a, avatarName: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 py-[9px] border-t border-subtle", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-tertiary shrink-0", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
      s && /* @__PURE__ */ e.jsx(
        "span",
        {
          className: "flex shrink-0 items-center justify-center h-[21px] w-[21px] rounded-full text-[color:var(--apya-avatar-fg)] text-[8.5px] font-bold",
          style: { background: Oe(s) },
          children: Ve(s)
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", title: typeof a == "string" ? a : void 0, children: a || "—" })
    ] })
  ] });
}
const ia = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "—";
function Hr({ task: t = {}, nameById: a }) {
  const s = (o, n) => {
    var l;
    return o || n && ((l = a == null ? void 0 : a.get) == null ? void 0 : l.call(a, n)) || null;
  }, r = s(t.creatorName, t.creatorId), i = t.lastModificationTime ? s(t.lastModifierName, t.lastModifierId) : null;
  return /* @__PURE__ */ e.jsx("aside", { className: "flex flex-col gap-3.5 min-w-0", children: /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsx(Fe, { label: "Oluşturan", value: r || "Bilinmiyor", avatarName: r }),
    /* @__PURE__ */ e.jsx(Fe, { label: "Oluşturma tarihi", value: ia(t.creationTime) }),
    /* @__PURE__ */ e.jsx(Fe, { label: "Güncelleyen", value: i || "—", avatarName: i }),
    /* @__PURE__ */ e.jsx(Fe, { label: "Son güncelleme", value: ia(t.lastModificationTime) }),
    /* @__PURE__ */ e.jsx(Fe, { label: "Görev tipi", value: t.taskType }),
    /* @__PURE__ */ e.jsx(Fe, { label: "Sprint", value: t.sprint })
  ] }) });
}
const la = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
function ht({ name: t, size: a = 32 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Oe(t), fontSize: a * 0.34 },
      children: Ve(t)
    }
  );
}
function oa({ open: t, onClick: a }) {
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
const ca = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function Jr({
  task: t = {},
  onFieldChange: a = () => {
  },
  descriptionValue: s,
  checklist: r,
  currentUserName: i = "Ben",
  /* Düzenleme yetkisi yoksa açıklama ve kontrol listesi salt okunur. Yorumlar açık
     kalır: görevi görebilen herkes yorum yazabilir (ürün kararı, 2026-09-28). */
  readOnly: o = !1
}) {
  const n = t == null ? void 0 : t.id, l = ae(), [p, x] = y.useState(!0), [m, h] = y.useState(""), d = (r == null ? void 0 : r.items) ?? [], f = d.filter((N) => N.isDone).length, c = d.length ? Math.round(f / d.length * 100) : 0, g = async () => {
    var v, $, B;
    const N = m.trim();
    if (!(!N || !n)) {
      h("");
      try {
        await r.addItem(N);
      } catch (V) {
        (B = ($ = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : $.error) == null || B.call($, (V == null ? void 0 : V.message) || "Madde eklenemedi.");
      }
    }
  }, [u, b] = y.useState(!0), [j, w] = y.useState(""), [k, T] = y.useState(!1), [z, R] = y.useState(!1), [M, q] = y.useState(null), [Y, K] = y.useState(""), [_, O] = y.useState({}), { data: Q = [] } = ee({
    queryKey: ["task-comments", n],
    queryFn: () => {
      var N, v, $, B;
      return Promise.resolve((B = ($ = (v = (N = window == null ? void 0 : window.apya) == null ? void 0 : N.platform) == null ? void 0 : v.tasks) == null ? void 0 : $.task) == null ? void 0 : B.getComments(n));
    },
    enabled: !!n,
    staleTime: 1e4,
    meta: { persist: !1 }
  }), U = async () => {
    await l.invalidateQueries({ queryKey: ["task-comments", n] }), await l.invalidateQueries({ queryKey: ["task-detail", n] });
  }, re = async () => {
    var v, $, B;
    const N = j.trim();
    if (!(!N || !n || z)) {
      R(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.addComment(n, N)), await U(), w("");
      } catch (V) {
        (B = ($ = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : $.error) == null || B.call($, (V == null ? void 0 : V.message) || "Yorum gönderilemedi.");
      } finally {
        R(!1);
      }
    }
  }, se = async (N) => {
    var $, B, V;
    const v = Y.trim();
    if (!(!v || !n))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.replyToComment(N, v)), await U(), K(""), q(null);
      } catch (le) {
        (V = (B = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : B.error) == null || V.call(B, (le == null ? void 0 : le.message) || "Yanıt gönderilemedi.");
      }
  }, E = (N) => O((v) => {
    const $ = v[N] ?? { liked: !1, count: 0 };
    return { ...v, [N]: { liked: !$.liked, count: $.count + ($.liked ? -1 : 1) } };
  }), L = !!j.trim() && !z;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-[9px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Açıklama" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Zengin metin · WYSIWYG" })
      ] }),
      /* @__PURE__ */ e.jsx(
        wa,
        {
          value: s ?? t.description ?? "",
          onChange: (N) => a("description", N),
          mentionName: i,
          readOnly: o
        },
        n
      )
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: la, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
            f,
            "/",
            d.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(oa, { open: p, onClick: () => x((N) => !N) })
      ] }),
      p && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 mt-3.5", children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
            style: { width: `${c}%` }
          }
        ) }),
        d.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              disabled: o,
              "aria-label": N.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
              onClick: () => r.toggleItem(N.id).catch((v) => {
                var $, B, V;
                return (V = (B = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : B.error) == null ? void 0 : V.call(B, (v == null ? void 0 : v.message) || "Durum güncellenemedi.");
              }),
              className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${o ? "cursor-default" : "cursor-pointer"} transition-colors duration-fast ${N.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
              children: N.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${N.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: N.text }),
          !o && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              onClick: () => r.removeItem(N.id).catch((v) => {
                var $, B, V;
                return (V = (B = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : B.error) == null ? void 0 : V.call(B, (v == null ? void 0 : v.message) || "Madde silinemedi.");
              }),
              className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
            }
          )
        ] }, N.id)),
        !o && /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            value: m,
            onChange: (N) => h(N.target.value),
            onKeyDown: (N) => {
              N.key === "Enter" && g();
            },
            placeholder: "Yeni madde yaz ve Enter'a bas…",
            className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: la, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Yorumlar & güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: Q.length })
        ] }),
        /* @__PURE__ */ e.jsx(oa, { open: u, onClick: () => b((N) => !N) })
      ] }),
      u && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(ht, { name: i }),
          /* @__PURE__ */ e.jsxs("div", { className: `flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${k ? "border-focus bg-surface-base shadow-focus" : "border-default bg-surface-raised"}`, children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                rows: 2,
                value: j,
                onChange: (N) => w(N.target.value),
                onFocus: () => T(!0),
                onBlur: () => T(!1),
                onKeyDown: (N) => {
                  N.key === "Enter" && (N.ctrlKey || N.metaKey) && (N.preventDefault(), re());
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
                  onClick: () => w((v) => v + N.add),
                  className: "flex items-center justify-center h-7 w-7 rounded-[7px] text-text-tertiary hover:bg-surface-hover hover:text-primary cursor-pointer",
                  children: /* @__PURE__ */ e.jsx("i", { className: `${N.icon} text-[12px]` })
                },
                N.title
              )) }),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: re,
                  disabled: !L,
                  className: `flex items-center gap-[7px] h-[30px] px-3.5 rounded-[9px] text-[12px] font-bold shadow-xs ${L ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${z ? "fa-circle-notch fa-spin" : "fa-paper-plane"} text-[10px]` }),
                    "Gönder"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1", children: Q.map((N) => {
          const v = _[N.id] ?? { liked: !1, count: 0 };
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start py-3 border-t border-subtle", children: [
            /* @__PURE__ */ e.jsx(ht, { name: N.authorName }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: N.authorName }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: ca(N.creationTime) })
              ] }),
              /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[13px] leading-[1.65] text-text-secondary whitespace-pre-wrap", children: N.text }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 mt-[3px]", children: [
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => E(N.id),
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
                      q(($) => $ === N.id ? null : N.id), K("");
                    },
                    className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-full text-text-tertiary text-[11px] font-semibold hover:bg-surface-hover hover:text-primary cursor-pointer",
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                      "Yanıtla"
                    ]
                  }
                )
              ] }),
              M === N.id && /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 mt-2 animate-fade-in-fast", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: Y,
                    onChange: ($) => K($.target.value),
                    onKeyDown: ($) => {
                      $.key === "Enter" && se(N.id);
                    },
                    placeholder: `@${N.authorName} kullanıcısına yanıt ver…`,
                    className: "flex-1 h-8 px-3 rounded-[9px] border border-focus bg-surface-base text-text-primary text-[12px] shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => se(N.id),
                    className: "h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover",
                    children: "Yanıtla"
                  }
                )
              ] }),
              (N.replies ?? []).map(($) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] mt-2.5 pl-3 border-l-2 border-default", children: [
                /* @__PURE__ */ e.jsx(ht, { name: $.authorName, size: 24 }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: $.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: ca($.creationTime) })
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
function Wr({
  lastSavedAt: t,
  isDirty: a,
  isSaving: s,
  justSaved: r,
  onCancel: i,
  onSave: o
}) {
  const n = t ? new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(t)) : "—", l = s ? "fa-solid fa-circle-notch fa-spin" : r ? "fa-solid fa-check" : "fa-regular fa-floppy-disk", p = s ? "Kaydediliyor…" : r ? "Kaydedildi" : "Kaydet", x = a && !s;
  return /* @__PURE__ */ e.jsxs("footer", { className: "shrink-0 flex items-center justify-between gap-4 px-6 lt-860:px-4 py-3.5 border-t border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5 min-w-0 lt-560:hidden", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] text-[11.5px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock text-[11px]" }),
        "Son kayıt: ",
        /* @__PURE__ */ e.jsx("strong", { className: "font-semibold text-text-secondary", children: n })
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
          onClick: o,
          disabled: !x,
          className: `flex items-center gap-2 h-9 px-[22px] rounded-[10px] text-white text-[13px] font-bold shadow-sm ${x ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `${l} text-[11px]` }),
            p
          ]
        }
      )
    ] })
  ] });
}
const Zr = Object.fromEntries(Qe.map((t) => [t.code, t])), Xr = {
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
}, en = /* @__PURE__ */ new Set([
  "risks",
  "dashboard",
  "comments",
  "emails",
  "custom-fields",
  "approvals",
  "ai",
  "automations"
]), tn = (t) => en.has(t);
function an(t) {
  const a = Zr[t], s = Xr[t];
  return a ? {
    code: t,
    title: a.title,
    icon: a.icon,
    desc: (s == null ? void 0 : s.desc) ?? "",
    bg: (s == null ? void 0 : s.bg) ?? "bg-neutral-subtle",
    fg: (s == null ? void 0 : s.fg) ?? "text-text-secondary"
  } : null;
}
Qe.filter((t) => !t.hidden).length;
function da({ code: t, onRemoveFeature: a, pickerEntries: s = [], onPickFeature: r, canRemove: i = !0 }) {
  const o = an(t) ?? { title: t, desc: "", icon: "fa-cube", bg: "bg-neutral-subtle", fg: "text-text-secondary" };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-3 py-14 px-6 rounded-2xl border border-dashed border-strong bg-surface-base text-center", children: [
    /* @__PURE__ */ e.jsx("span", { className: `flex items-center justify-center h-14 w-14 rounded-2xl ${o.bg} ${o.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${o.icon} text-[22px]` }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-w-[420px]", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: o.title }),
      o.desc && /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] leading-[1.6] text-text-secondary", children: o.desc }),
      /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-center gap-[7px] mt-1.5 text-[11.5px] font-semibold text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-person-digging text-[11px]" }),
        "Bu sekme yapım aşamasında."
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 mt-1.5", children: [
      i && /* @__PURE__ */ e.jsxs(
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
      /* @__PURE__ */ e.jsx(Pt, { entries: s, onPick: r, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shapes text-[10px]" }),
            "Başka özellik ekle"
          ]
        }
      ) })
    ] })
  ] });
}
function Va({ open: t, onClose: a, label: s, children: r }) {
  return /* @__PURE__ */ e.jsx(
    cs,
    {
      open: t,
      onOpenChange: (i) => {
        i || a == null || a();
      },
      children: /* @__PURE__ */ e.jsxs(ds, { children: [
        /* @__PURE__ */ e.jsx(xs, { className: "fixed inset-0", style: { pointerEvents: "none" } }),
        /* @__PURE__ */ e.jsx(us, { asChild: !0, "aria-describedby": void 0, children: /* @__PURE__ */ e.jsxs("div", { className: "fixed inset-0 z-modal", children: [
          /* @__PURE__ */ e.jsx(ps, { className: "sr-only", children: s }),
          r
        ] }) })
      ] })
    }
  );
}
const sn = [
  { key: "subtasks", label: "Alt görevler", countKey: "subtasks", unit: "alt görev" },
  { key: "checklist", label: "Kontrol listesi", countKey: "checklist", unit: "madde" },
  { key: "comments", label: "Yorumlar", countKey: "comments", unit: "yorum" },
  { key: "files", label: "Dosyalar", countKey: "files", unit: "dosya" },
  { key: "keepAssignee", label: "Sorumluyu koru", desc: "Aksi halde atanmamış gelir" },
  { key: "keepLinks", label: "Bağımlılıkları koru", desc: "Öncül / ardıl bağlantılar" },
  { key: "shiftDates", label: "Tarihleri bugüne kaydır", desc: "Başlangıç ve son tarih ötelenir" }
], xa = {
  subtasks: !0,
  checklist: !0,
  comments: !1,
  files: !0,
  keepAssignee: !0,
  keepLinks: !0,
  shiftDates: !1
};
function rn({ on: t, onClick: a, label: s }) {
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
function nn({
  open: t,
  mode: a = "move",
  onClose: s,
  onConfirm: r,
  projectOptions: i = [],
  currentProjectId: o,
  counts: n = {},
  onCreateProject: l
}) {
  const [p, x] = y.useState(a), [m, h] = y.useState([]), [d, f] = y.useState(""), [c, g] = y.useState(""), [u, b] = y.useState(xa), [j, w] = y.useState(!1);
  y.useEffect(() => {
    t && (x(a), h([]), f(""), g(""), b(xa));
  }, [t, a]);
  const k = y.useMemo(
    () => i.filter((E) => E.value && E.value !== o),
    [i, o]
  ), T = k.filter((E) => !d || E.label.toLowerCase().includes(d.toLowerCase())), z = k.length > 0 && m.length === k.length;
  if (!t) return null;
  const R = (E) => h((L) => L.includes(E) ? L.filter((N) => N !== E) : [...L, E]), M = (E) => {
    var L;
    return ((L = i.find((N) => N.value === E)) == null ? void 0 : L.label) ?? "";
  }, q = async () => {
    var L, N, v;
    const E = c.trim();
    if (!(!E || j)) {
      w(!0);
      try {
        const $ = await (l == null ? void 0 : l(E));
        $ && h((B) => [...B, $]), g("");
      } catch ($) {
        (v = (N = (L = window == null ? void 0 : window.abp) == null ? void 0 : L.notify) == null ? void 0 : N.error) == null || v.call(N, ($ == null ? void 0 : $.message) || "Proje oluşturulamadı.");
      } finally {
        w(!1);
      }
    }
  }, Y = async () => {
    if (!(!m.length || j)) {
      w(!0);
      try {
        await (r == null ? void 0 : r({ mode: p, targetProjectIds: m, include: u }));
      } finally {
        w(!1);
      }
    }
  }, K = p === "move", _ = m.length, O = K ? _ > 1 ? "Taşı ve kopyala" : "Taşı" : _ > 1 ? `${_} projeye kopyala` : "Kopyala", Q = Object.values(u).filter(Boolean).length, U = m.map(M).filter(Boolean), re = U.length ? `${U.length > 2 ? `${U.slice(0, 2).join(", ")} +${U.length - 2}` : U.join(", ")} · ${Q} seçenek açık` : `Proje seçilmedi · ${Q} seçenek açık`, se = (E) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${E ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return /* @__PURE__ */ e.jsx(Va, { open: t, onClose: s, label: K ? "Başka projeye taşı" : "Başka projelere kopyala", children: /* @__PURE__ */ e.jsx(
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
          onClick: (E) => E.stopPropagation(),
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
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => x("move"), className: se(K), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[10px]" }),
                "Taşı"
              ] }),
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => x("copy"), className: se(!K), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clone text-[10px]" }),
                "Kopyala"
              ] })
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 grid grid-cols-2 lt-860:grid-cols-1 gap-5 items-start px-[22px] pt-4 pb-5 overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px] min-w-0", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5", children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.08em] text-text-tertiary", children: [
                    "Hedef projeler · ",
                    _
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => h(z ? [] : k.map((E) => E.value)),
                      className: "p-0 border-0 bg-transparent text-primary text-[11px] font-bold cursor-pointer hover:underline",
                      children: z ? "Seçimi temizle" : "Tümünü seç"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: d,
                      onChange: (E) => f(E.target.value),
                      placeholder: "Proje ara…",
                      className: "w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar", children: [
                  T.map((E) => {
                    const L = m.includes(E.value), N = K && m[0] === E.value;
                    return /* @__PURE__ */ e.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => R(E.value),
                        className: `flex items-center gap-[11px] px-3 py-[11px] rounded-[11px] border text-left cursor-pointer hover:border-focus ${L ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                        children: [
                          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] rounded-[5px] border-[1.5px] text-white ${L ? "bg-primary border-primary" : "bg-transparent border-strong"}`, children: L && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" }) }),
                          /* @__PURE__ */ e.jsx("span", { className: "h-2.5 w-2.5 shrink-0 rounded-[3px] bg-primary" }),
                          /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: E.label }),
                          N && /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center h-5 px-2 rounded-md bg-primary text-white text-[10px] font-extrabold", children: "TAŞINACAK" })
                        ]
                      },
                      E.value
                    );
                  }),
                  T.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "py-6 text-center text-[12px] text-text-tertiary", children: "Uygun proje bulunamadı." })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[7px] mt-1", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: c,
                      onChange: (E) => g(E.target.value),
                      onKeyDown: (E) => {
                        E.key === "Enter" && (E.preventDefault(), q());
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
                      onClick: q,
                      disabled: !c.trim() || j,
                      className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-plus text-[12px]" })
                    }
                  )
                ] }),
                K && _ > 1 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle", children: [
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
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: sn.map((E) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-px", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary", children: E.label }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: E.countKey ? `${n[E.countKey] ?? 0} ${E.unit}` : E.desc })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    rn,
                    {
                      on: u[E.key],
                      label: E.label,
                      onClick: () => b((L) => ({ ...L, [E.key]: !L[E.key] }))
                    }
                  )
                ] }, E.key)) })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3.5 px-[22px] py-3.5 border-t border-subtle bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("span", { className: "min-w-0 truncate text-[11.5px] text-text-tertiary", children: re }),
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
                    onClick: Y,
                    disabled: !_ || j,
                    className: `flex items-center gap-2 h-9 px-5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${_ && !j ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${j ? "fa-circle-notch fa-spin" : "fa-arrow-right"} text-[10px]` }),
                      O
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
const ln = [
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
function on(t = "") {
  var s;
  const a = (s = t.split(".").pop()) == null ? void 0 : s.toLowerCase();
  return a === "pdf" ? Re.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(a) ? Re.img : ["doc", "docx", "odt", "rtf"].includes(a) ? Re.doc : ["json", "js", "ts", "cs", "xml", "yml", "yaml"].includes(a) ? Re.code : Re.other;
}
const cn = (t) => t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : "—", dn = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—", xn = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—";
function gt({ name: t, size: a = 22 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Oe(t), fontSize: a * 0.4 },
      children: Ve(t)
    }
  );
}
function et({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: t }),
    a
  ] });
}
function un({
  subtaskId: t,
  parentCode: a,
  onClose: s,
  onOpenFull: r,
  onDeleted: i,
  currentUserName: o = "Ben"
}) {
  var be, ne, xe;
  const n = ae(), { data: l } = Dt(t), p = $t(t), x = St(t), [m, h] = y.useState("general"), [d, f] = y.useState(""), [c, g] = y.useState(""), [u, b] = y.useState(""), j = y.useRef(null), w = y.useRef(null);
  l && w.current !== l.id && (w.current = l.id, f(l.description ?? ""));
  const { data: k = [] } = ee({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var C, G, S, A;
      return Promise.resolve((A = (S = (G = (C = window == null ? void 0 : window.apya) == null ? void 0 : C.platform) == null ? void 0 : G.tasks) == null ? void 0 : S.task) == null ? void 0 : A.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4,
    meta: { persist: !1 }
  });
  if (y.useEffect(() => {
    const C = (G) => {
      G.key === "Escape" && (G.stopPropagation(), s == null || s());
    };
    return window.addEventListener("keydown", C), () => window.removeEventListener("keydown", C);
  }, [s]), !l) return null;
  const { canEdit: T, canChangeStatus: z, canDelete: R } = _e(l), M = (xe = (ne = (be = window == null ? void 0 : window.apya) == null ? void 0 : be.platform) == null ? void 0 : ne.tasks) == null ? void 0 : xe.task, q = fe(l.status), Y = ot(l.priority), K = p.items ?? [], _ = K.filter((C) => C.isDone).length, O = K.length ? Math.round(_ / K.length * 100) : 0, Q = x.attachments ?? [], U = { checklist: K.length, comments: k.length, files: Q.length }, re = async () => {
    await n.invalidateQueries({ queryKey: ["task-detail", t] });
  }, se = async (C) => {
    var G, S, A;
    try {
      await Promise.resolve(C()), await re();
    } catch (F) {
      (A = (S = (G = window == null ? void 0 : window.abp) == null ? void 0 : G.notify) == null ? void 0 : S.error) == null || A.call(S, (F == null ? void 0 : F.message) || "Alt görev güncellenemedi.");
    }
  }, E = (C) => se(() => M.update(l.id, Ga(l, C))), L = () => se(() => M.updateStatus(l.id, l.status >= 4 ? 1 : l.status + 1)), N = () => se(() => M.setPriority(l.id, l.priority >= 4 ? 1 : l.priority + 1)), v = () => {
    (l.description ?? "") !== d && E({ description: d || null });
  }, $ = async () => {
    var G, S, A;
    const C = c.trim();
    if (C) {
      g("");
      try {
        await p.addItem(C);
      } catch (F) {
        (A = (S = (G = window == null ? void 0 : window.abp) == null ? void 0 : G.notify) == null ? void 0 : S.error) == null || A.call(S, (F == null ? void 0 : F.message) || "Madde eklenemedi.");
      }
    }
  }, B = async () => {
    var G, S, A;
    const C = u.trim();
    if (C) {
      b("");
      try {
        await Promise.resolve(M.addComment(l.id, C)), await n.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch (F) {
        (A = (S = (G = window == null ? void 0 : window.abp) == null ? void 0 : G.notify) == null ? void 0 : S.error) == null || A.call(S, (F == null ? void 0 : F.message) || "Yorum gönderilemedi.");
      }
    }
  }, V = async () => {
    var C, G, S;
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(M.delete(l.id)), i == null || i(l.id), s == null || s();
      } catch (A) {
        (S = (G = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : G.error) == null || S.call(G, (A == null ? void 0 : A.message) || "Alt görev silinemedi.");
      }
  }, le = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
  return /* @__PURE__ */ e.jsxs(Va, { open: !0, onClose: s, label: `${l.code} alt görev detayı`, children: [
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
        "aria-label": `${l.code} alt görev detayı`,
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
                    onClick: () => r == null ? void 0 : r(l.id),
                    className: `${le} hover:bg-surface-hover hover:text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-up-right-from-square text-[11px]" })
                  }
                ),
                R && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Alt görevi sil",
                    onClick: V,
                    className: `${le} hover:bg-negative-subtle hover:text-negative`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Kapat",
                    onClick: s,
                    className: `${le} hover:bg-surface-hover hover:text-text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[13px]" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[7px] flex-wrap", children: [
              /* @__PURE__ */ e.jsx("span", { className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[10.5px] font-bold tracking-[.04em]", children: l.code }),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: L,
                  title: "Durumu değiştir",
                  disabled: !z,
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold ${z ? "cursor-pointer" : "cursor-default"} ${q.bg} ${q.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${q.icon} text-[10px]` }),
                    q.label
                  ]
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: N,
                  title: "Önceliği değiştir",
                  disabled: !T,
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold ${T ? "cursor-pointer" : "cursor-default"} ${Y.bg} ${Y.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${Y.icon} text-[10px]` }),
                    Y.label
                  ]
                }
              ),
              (l.tags ?? []).map((C) => /* @__PURE__ */ e.jsx("span", { className: "flex items-center h-6 px-[9px] rounded-[7px] border border-default bg-neutral-subtle text-text-secondary text-[11px] font-semibold", children: C.name }, C.id ?? C.name)),
              !T && /* @__PURE__ */ e.jsxs(
                "span",
                {
                  title: "Bu alt görevi yalnız oluşturan, atanan kişi ya da ekip yöneticisi düzenleyebilir. Yorum yazabilirsiniz.",
                  className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11px] font-semibold",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-lock text-[10px]" }),
                    "Salt okunur"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[18px] font-extrabold tracking-[-.02em] leading-[1.3] text-text-primary", children: l.title }),
            /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 pt-1", children: [
              /* @__PURE__ */ e.jsx(et, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
                /* @__PURE__ */ e.jsx(gt, { name: l.assigneeName }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", children: l.assigneeName || "Atanmamış" })
              ] }) }),
              /* @__PURE__ */ e.jsx(et, { label: "Son tarih", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] h-[22px] text-[12.5px] font-semibold text-text-primary", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[11px] text-text-tertiary" }),
                xn(l.dueDate)
              ] }) }),
              /* @__PURE__ */ e.jsx(et, { label: "Süre", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-[22px] font-mono text-[12.5px] font-bold text-text-primary", children: [
                l.spentHours ?? 0,
                "s",
                /* @__PURE__ */ e.jsxs("span", { className: "font-medium text-text-tertiary", children: [
                  " / ",
                  l.estimatedHours != null ? `${l.estimatedHours}s` : "—"
                ] })
              ] }) }),
              /* @__PURE__ */ e.jsx(et, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-1.5 pt-[3px]", children: [
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
                  "%",
                  O
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: "block h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("span", { className: "block h-full rounded-full bg-success", style: { width: `${O}%` } }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: ln.map((C) => {
            const G = m === C.code, S = U[C.code] ?? 0;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => h(C.code),
                className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${G ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${C.icon} text-[11px] opacity-85` }),
                  /* @__PURE__ */ e.jsx("span", { children: C.title }),
                  S > 0 && /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-neutral-subtle text-text-tertiary text-[10px] font-extrabold", children: S })
                ]
              },
              C.code
            );
          }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar px-5 py-[18px] bg-surface-raised", children: [
            m === "general" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Açıklama" }),
              /* @__PURE__ */ e.jsx(
                "textarea",
                {
                  rows: 7,
                  value: d,
                  onChange: (C) => f(C.target.value),
                  onBlur: T ? v : void 0,
                  readOnly: !T,
                  placeholder: T ? "Bu alt görevin detayları…" : "Açıklama yok.",
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
            m === "checklist" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px]", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Kontrol listesi" }),
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: [
                  _,
                  "/",
                  K.length
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-success", style: { width: `${O}%` } }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px] mt-1", children: [
                K.map((C) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] border border-subtle bg-surface-base hover:border-default", children: [
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Tamamlandı işaretle",
                      onClick: () => p.toggleItem(C.id),
                      disabled: !T,
                      className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${T ? "cursor-pointer" : "cursor-default"} ${C.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
                      children: C.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[12.5px] font-semibold ${C.isDone ? "line-through text-text-tertiary" : "text-text-primary"}`, children: C.text }),
                  T && /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Maddeyi sil",
                      onClick: () => p.removeItem(C.id),
                      className: "flex shrink-0 items-center justify-center h-6 w-6 rounded-md text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[10px]" })
                    }
                  )
                ] }, C.id)),
                T && /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "text",
                    value: c,
                    onChange: (C) => g(C.target.value),
                    onKeyDown: (C) => {
                      C.key === "Enter" && $();
                    },
                    placeholder: "Yeni madde yaz ve Enter'a bas…",
                    className: "h-9 mt-1 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                )
              ] })
            ] }),
            m === "comments" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] items-start", children: [
                /* @__PURE__ */ e.jsx(gt, { name: o, size: 30 }),
                /* @__PURE__ */ e.jsx(
                  "textarea",
                  {
                    rows: 2,
                    value: u,
                    onChange: (C) => b(C.target.value),
                    onKeyDown: (C) => {
                      C.key === "Enter" && !C.shiftKey && (C.preventDefault(), B());
                    },
                    placeholder: "Yorum yaz ve Enter'a bas…",
                    className: "flex-1 min-w-0 px-3 py-2.5 rounded-[11px] border border-default bg-surface-base text-text-primary text-[12.5px] leading-[1.6] resize-none focus:border-focus focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: B,
                    "aria-label": "Yorumu gönder",
                    className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] ${u.trim() ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paper-plane text-[11px]" })
                  }
                )
              ] }),
              k.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-[7px] py-7 rounded-xl border border-dashed border-default", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-comments text-xl text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Henüz yorum yok" })
              ] }) : k.map((C) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 items-start p-3 rounded-xl border border-subtle bg-surface-base", children: [
                /* @__PURE__ */ e.jsx(gt, { name: C.authorName, size: 28 }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: C.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: dn(C.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: C.text })
                ] })
              ] }, C.id))
            ] }),
            m === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  ref: j,
                  type: "file",
                  className: "hidden",
                  onChange: (C) => {
                    var S;
                    const G = (S = C.target.files) == null ? void 0 : S[0];
                    C.target.value = "", G && x.upload(G).catch((A) => {
                      var F, J, H;
                      return (H = (J = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : J.error) == null ? void 0 : H.call(J, (A == null ? void 0 : A.message) || "Dosya yüklenemedi.");
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
                    return (C = j.current) == null ? void 0 : C.click();
                  },
                  disabled: x.isUploading,
                  className: "flex flex-col items-center justify-center gap-[7px] p-6 rounded-[13px] border-2 border-dashed border-strong bg-surface-base cursor-pointer hover:border-focus hover:bg-primary-subtle disabled:opacity-60",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x.isUploading ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-xl text-text-tertiary` }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: x.isUploading ? "Yükleniyor…" : "Dosya ekle" })
                  ]
                }
              ),
              Q.map((C) => {
                const G = on(C.fileName);
                return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${G.bg} ${G.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${G.icon} text-[13px]` }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: C.fileName }),
                    /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                      cn(C.fileSize),
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
                      onClick: () => x.remove(C.id).catch((S) => {
                        var A, F, J;
                        return (J = (F = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : F.error) == null ? void 0 : J.call(F, (S == null ? void 0 : S.message) || "Dosya silinemedi.");
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
                onClick: () => r == null ? void 0 : r(l.id),
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
const Oa = "apya.taskDetail.tabOrder", pn = "taskdetail";
function ua() {
  try {
    const t = localStorage.getItem(Oa);
    if (!t) return [];
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.filter((s) => typeof s == "string") : [];
  } catch {
    return [];
  }
}
function mn(t) {
  try {
    localStorage.setItem(Oa, JSON.stringify(t));
  } catch {
  }
}
function pa() {
  const t = document.querySelector("[data-tab-order]"), a = t == null ? void 0 : t.getAttribute("data-tab-order");
  if (!a) return null;
  try {
    const s = JSON.parse(a);
    return Array.isArray(s) ? s.map((r) => r == null ? void 0 : r.kind).filter((r) => typeof r == "string") : null;
  } catch {
    return null;
  }
}
function ma(t) {
  try {
    const a = (document.cookie.match(/XSRF-TOKEN=([^;]+)/) || [])[1];
    fetch("/api/app/shell/set-board-tabs", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        RequestVerificationToken: a ? decodeURIComponent(a) : ""
      },
      body: JSON.stringify({
        scope: pn,
        tabs: t.map((s) => ({ kind: s, ref: "", title: "" }))
      })
    }).catch(() => {
    });
  } catch {
  }
}
function fn(t) {
  const [a, s] = y.useState(() => pa() ?? ua()), [r, i] = y.useState(null);
  y.useEffect(() => {
    if (pa() === null) {
      const x = ua();
      x.length && ma(x);
    }
  }, []);
  const o = y.useMemo(() => {
    const x = new Map(t.map((h) => [h.code, h])), m = [];
    for (const h of a) {
      const d = x.get(h);
      d && (m.push(d), x.delete(h));
    }
    for (const h of t)
      x.has(h.code) && m.push(h);
    return m;
  }, [t, a]), n = y.useCallback((x) => {
    s((m) => {
      const h = r;
      if (!h || h === x) return m;
      const d = m.length ? m.slice() : o.map((g) => g.code), f = d.indexOf(h), c = d.indexOf(x);
      return f === -1 || c === -1 ? m : (d.splice(f, 1), d.splice(c, 0, h), d);
    });
  }, [r, o]), l = y.useCallback((x) => i(x), []), p = y.useCallback(() => {
    i(null), s((x) => {
      const m = x.length ? x : o.map((h) => h.code);
      return mn(m), ma(m), m;
    });
  }, [o]);
  return { orderedTabs: o, draggingCode: r, handleDragStart: l, handleDragEnd: p, reorderTo: n };
}
function bn() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function hn() {
  const t = ee({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: bn,
    staleTime: 3e5,
    retry: !1
  }), a = t.data ?? [], s = a.map((i) => ({ value: i.id, label: i.name })), r = new Map(a.map((i) => [i.id, i.name]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
const fa = "apya.taskDetail.fullscreen", W = {
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
function gn(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function Qa({ taskId: t, presentation: a = "modal", onClose: s, switchToTask: r }) {
  var Ft, zt, Lt, It, Mt, Kt, Rt, Gt;
  const [i, o] = y.useState(t), { data: n, isPending: l, isError: p, refetch: x } = Dt(i), m = ae(), h = Da(), d = Ea(n), f = Aa(), c = hn(), g = Ba(i), u = $t(i), [b, j] = y.useState("general"), [w, k] = y.useState(!1), [T, z] = y.useState(!1), [R, M] = y.useState(null), [q, Y] = y.useState(null), [K, _] = y.useState(!1), [O, Q] = y.useState(!1), [U, re] = y.useState(() => {
    try {
      return localStorage.getItem(fa) === "true";
    } catch {
      return !1;
    }
  });
  $a(i);
  const [se, E] = y.useState(null);
  n != null && n.id && n.id !== se && (E(n.id), _(!!n.isFavorite), Q(!!n.isWatched)), y.useEffect(() => {
    d.isDirty ? h.markDirty() : h.markClean();
  }), y.useEffect(() => {
    const D = m.getQueryCache().subscribe((I) => {
      var oe;
      I.type === "updated" && ((oe = I.action) == null ? void 0 : oe.type) === "invalidate" && !ms(I.query.queryKey) && Z.markChanged();
    }), P = m.getMutationCache().subscribe((I) => {
      I.type === "added" && Z.markChanged();
    });
    return () => {
      D(), P();
    };
  }, [m]);
  const L = y.useCallback(() => {
    Sa(), s == null || s();
  }, [s]), N = y.useCallback(() => h.requestClose(L), [h, L]), v = y.useCallback(() => {
    re((D) => {
      const P = !D;
      try {
        localStorage.setItem(fa, String(P));
      } catch {
      }
      return P;
    });
  }, []), $ = y.useMemo(
    () => qa(g.assignedCodes),
    [g.assignedCodes]
  ), B = fn($), V = y.useMemo(
    () => Ya(g.assignedCodes),
    [g.assignedCodes]
  ), le = (D, P) => {
    if (P) {
      j(D);
      return;
    }
    Wa(D);
  }, be = y.useMemo(() => {
    var D, P, I, oe, he;
    return {
      subtasks: ((D = n == null ? void 0 : n.subTasks) == null ? void 0 : D.length) ?? 0,
      files: ((P = n == null ? void 0 : n.attachments) == null ? void 0 : P.length) ?? 0,
      dependencies: ((I = n == null ? void 0 : n.predecessorIds) == null ? void 0 : I.length) ?? 0,
      comments: ((oe = n == null ? void 0 : n.comments) == null ? void 0 : oe.length) ?? 0,
      checklist: ((he = u.items) == null ? void 0 : he.length) ?? 0
    };
  }, [n, u.items]), ne = Qe.find((D) => D.code === b), xe = u.items ?? [], C = xe.filter((D) => D.isDone).length, G = xe.length ? Math.round(C / xe.length * 100) : 0, S = y.useCallback(async () => {
    if (!d.validate())
      return W.err("Zorunlu alanları kontrol edin."), !1;
    k(!0);
    try {
      const D = d.values, P = await Promise.resolve(window.apya.platform.tasks.task.update(i, d.toUpdateDto()));
      await m.invalidateQueries({ queryKey: ["task-detail", i] });
      const I = m.getQueryState(["task-detail", i]);
      return d.commitSaved(D, (I == null ? void 0 : I.status) === "success" ? I.data : P), Z.emitResult(), z(!0), setTimeout(() => z(!1), 2e3), W.ok("Görev başarıyla güncellendi."), !0;
    } catch (D) {
      return W.err((D == null ? void 0 : D.message) || "Kaydedilemedi."), !1;
    } finally {
      k(!1);
    }
  }, [i, d, m]);
  y.useEffect(() => {
    const D = (P) => {
      if ((P.ctrlKey || P.metaKey) && P.key.toLowerCase() === "s") {
        P.preventDefault(), d.isDirty && !w && S();
        return;
      }
      P.key === "Escape" && R && (P.stopPropagation(), M(null));
    };
    return window.addEventListener("keydown", D), () => window.removeEventListener("keydown", D);
  }, [S, d.isDirty, w, R]);
  const A = () => {
    var D, P, I;
    return (I = (P = (D = window == null ? void 0 : window.apya) == null ? void 0 : D.platform) == null ? void 0 : P.tasks) == null ? void 0 : I.task;
  }, F = async () => {
    var P;
    const D = !K;
    _(D), Z.markChanged();
    try {
      await Promise.resolve((P = A()) == null ? void 0 : P.toggleFavorite(i));
    } catch (I) {
      _(!D), W.err((I == null ? void 0 : I.message) || "Favori güncellenemedi.");
    }
  }, J = () => {
    if (!i) return;
    const D = document.createElement("a");
    D.href = `/Tasks/Detail/${i}?handler=Pdf`, D.rel = "noopener", document.body.appendChild(D), D.click(), D.remove();
  }, H = async () => {
    var P;
    const D = !O;
    Q(D), Z.markChanged();
    try {
      await Promise.resolve((P = A()) == null ? void 0 : P.toggleWatch(i)), W.info(D ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (I) {
      Q(!D), W.err((I == null ? void 0 : I.message) || "Takip durumu güncellenemedi.");
    }
  }, Te = async () => {
    var D, P;
    Z.markChanged();
    try {
      const I = await Promise.resolve((D = A()) == null ? void 0 : D.transfer(i, {
        mode: 2,
        // Copy
        targetProjectIds: n != null && n.projectId ? [n.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await m.invalidateQueries({ queryKey: ["task-detail"] }), W.ok("Görev çoğaltıldı.");
      const oe = (P = I == null ? void 0 : I.createdTaskIds) == null ? void 0 : P[0];
      oe && o(oe);
    } catch (I) {
      W.err((I == null ? void 0 : I.message) || "Görev çoğaltılamadı.");
    }
  }, ue = async () => {
    var D;
    Z.markChanged();
    try {
      await Promise.resolve((D = A()) == null ? void 0 : D.updateStatus(i, 4)), await m.invalidateQueries({ queryKey: ["task-detail", i] }), d.setField("status", 4), W.info("Görev arşivlendi (Tamamlandı).");
    } catch (P) {
      W.err((P == null ? void 0 : P.message) || "Görev arşivlenemedi.");
    }
  }, Ja = async () => {
    var D;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?")) {
      Z.markChanged();
      try {
        await Promise.resolve((D = A()) == null ? void 0 : D.delete(i)), W.info("Görev silindi."), h.markClean(), L();
      } catch (P) {
        W.err((P == null ? void 0 : P.message) || "Görev silinemedi.");
      }
    }
  }, Wa = async (D) => {
    try {
      await g.addFeature(D), j(D), W.ok("Özellik başarıyla eklendi.");
    } catch (P) {
      W.err((P == null ? void 0 : P.message) || "Özellik eklenemedi.");
    }
  }, Et = async (D) => {
    try {
      await g.removeFeature(D), j("general"), W.info("Özellik görevden kaldırıldı.");
    } catch (P) {
      W.err((P == null ? void 0 : P.message) || "Özellik kaldırılamadı.");
    }
  }, Za = async (D) => {
    var oe, he, ce, Ee, Se, Je, Ie;
    const P = ((Ee = (ce = (he = (oe = window == null ? void 0 : window.apya) == null ? void 0 : oe.platform) == null ? void 0 : he.application) == null ? void 0 : ce.projects) == null ? void 0 : Ee.project) ?? ((Ie = (Je = (Se = window == null ? void 0 : window.apya) == null ? void 0 : Se.platform) == null ? void 0 : Je.projects) == null ? void 0 : Ie.project);
    if (!(P != null && P.create)) throw new Error("Proje servisi yüklenmedi.");
    const I = await Promise.resolve(P.create({
      name: D,
      code: gn(D),
      currency: "TRY"
    }));
    return await m.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), W.ok(`“${D}” projesi oluşturuldu.`), (I == null ? void 0 : I.id) ?? I;
  }, Xa = async ({ mode: D, targetProjectIds: P, include: I }) => {
    var oe, he;
    Z.markChanged();
    try {
      const ce = await Promise.resolve((oe = A()) == null ? void 0 : oe.transfer(i, {
        mode: D === "move" ? 1 : 2,
        targetProjectIds: P,
        include: I
      }));
      await m.invalidateQueries({ queryKey: ["task-detail", i] }), D === "move" && d.setField("projectId", P[0]);
      const Ee = P.map((Je) => {
        var Ie;
        return (Ie = c.options.find((ss) => ss.value === Je)) == null ? void 0 : Ie.label;
      }).filter(Boolean), Se = ((he = ce == null ? void 0 : ce.createdTaskIds) == null ? void 0 : he.length) ?? 0;
      W.ok(D === "move" ? Se ? `“${Ee[0]}” projesine taşındı, ${Se} projeye kopyalandı.` : `Görev “${Ee[0]}” projesine taşındı.` : Se > 1 ? `${Se} projeye kopyalandı.` : `Kopya “${Ee[0]}” projesinde oluşturuldu.`), M(null);
    } catch (ce) {
      W.err((ce == null ? void 0 : ce.message) || "Transfer tamamlanamadı.");
    }
  }, { canEdit: He, canChangeStatus: es, canDelete: ts } = _e(n), as = b === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)] gap-5 items-start", children: [
    /* @__PURE__ */ e.jsx(
      Jr,
      {
        task: n,
        onFieldChange: d.setField,
        descriptionValue: d.values.description,
        checklist: u,
        readOnly: !He,
        currentUserName: ((zt = (Ft = window == null ? void 0 : window.abp) == null ? void 0 : Ft.currentUser) == null ? void 0 : zt.name) || ((It = (Lt = window == null ? void 0 : window.abp) == null ? void 0 : Lt.currentUser) == null ? void 0 : It.userName) || "Ben"
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5", children: /* @__PURE__ */ e.jsx(Hr, { task: n, nameById: f.nameById }) })
  ] }) : tn(b) ? /* @__PURE__ */ e.jsx(
    da,
    {
      code: b,
      onRemoveFeature: Et,
      pickerEntries: V,
      onPickFeature: le,
      canRemove: !(ne != null && ne.isCore)
    }
  ) : /* @__PURE__ */ e.jsx(y.Suspense, { fallback: /* @__PURE__ */ e.jsx(je, { className: "h-48 w-full" }), children: ne != null && ne.component ? /* @__PURE__ */ e.jsx(
    ne.component,
    {
      taskId: i,
      task: n,
      form: d,
      nameById: f.nameById,
      onOpenSubtask: Y,
      readOnly: !He
    }
  ) : /* @__PURE__ */ e.jsx(
    da,
    {
      code: b,
      onRemoveFeature: Et,
      pickerEntries: V,
      onPickFeature: le,
      canRemove: !(ne != null && ne.isCore)
    }
  ) }), At = l ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(je, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(je, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(je, { className: "h-64 w-full" })
  ] }) : p ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(X, { variant: "ghost", onClick: () => x(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col flex-1 min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      _r,
      {
        task: n,
        presentation: a,
        onClose: N,
        isFullscreen: U,
        onToggleFullscreen: v,
        onFieldChange: d.setField,
        statusValue: d.values.status,
        titleValue: n == null ? void 0 : n.title,
        isPrivateValue: d.values.isPrivate,
        isFavorite: K,
        onToggleFavorite: F,
        isWatched: O,
        onToggleWatch: H,
        onDuplicate: Te,
        onArchive: ue,
        onDelete: Ja,
        onOpenTransfer: (D) => M({ mode: D }),
        onSaveAsTemplate: () => W.info("Şablon olarak kaydetme yakında."),
        onConvertToSubtask: () => W.info("Alt göreve dönüştürme yakında."),
        onExportPdf: J,
        canEdit: He,
        canChangeStatus: es,
        canDelete: ts
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        Ur,
        {
          task: n,
          assigneeOptions: f.options,
          projectOptions: c.options,
          onFieldChange: d.setField,
          statusValue: d.values.status,
          priorityValue: d.values.priority,
          assigneeValue: d.values.assigneeId,
          projectValue: d.values.projectId,
          dueDateValue: d.values.dueDate,
          startDateValue: d.values.startDate,
          tagsValue: d.values.tagNames,
          progressPercent: G,
          progressNote: `${C}/${xe.length} madde`,
          onOpenTransfer: (D) => M({ mode: D }),
          readOnly: !He
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        a === "page" && /* @__PURE__ */ e.jsx(
          Qr,
          {
            activeTab: b,
            onTabChange: j,
            orderedTabs: B.orderedTabs,
            draggingCode: B.draggingCode,
            onDragStart: B.handleDragStart,
            onDragEnd: B.handleDragEnd,
            onReorderTo: B.reorderTo,
            onReorderDrop: () => W.info("Sekme sırası güncellendi."),
            pickerEntries: V,
            onPickFeature: le,
            counts: be
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: a === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            Or,
            {
              activeTab: b,
              onTabChange: j,
              orderedTabs: B.orderedTabs,
              draggingCode: B.draggingCode,
              onDragStart: B.handleDragStart,
              onDragEnd: B.handleDragEnd,
              onReorderTo: B.reorderTo,
              onReorderDrop: () => W.info("Sekme sırası güncellendi."),
              pickerEntries: V,
              onPickFeature: le,
              counts: be,
              isDirty: d.isDirty
            }
          ) }),
          /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised", children: as })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(
      Wr,
      {
        lastSavedAt: n == null ? void 0 : n.lastModificationTime,
        isDirty: d.isDirty,
        isSaving: w,
        justSaved: T,
        onCancel: N,
        onSave: S
      }
    )
  ] }), Bt = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      nn,
      {
        open: !!R,
        mode: (R == null ? void 0 : R.mode) ?? "move",
        onClose: () => M(null),
        onConfirm: Xa,
        projectOptions: c.options,
        currentProjectId: d.values.projectId,
        counts: be,
        onCreateProject: Za
      }
    ),
    q && /* @__PURE__ */ e.jsx(
      un,
      {
        subtaskId: q,
        parentCode: n == null ? void 0 : n.code,
        onClose: () => Y(null),
        onOpenFull: (D) => {
          Y(null), (r ?? o)(D);
        },
        onDeleted: () => m.invalidateQueries({ queryKey: ["task-detail", i] }),
        currentUserName: ((Kt = (Mt = window == null ? void 0 : window.abp) == null ? void 0 : Mt.currentUser) == null ? void 0 : Kt.name) || ((Gt = (Rt = window == null ? void 0 : window.abp) == null ? void 0 : Rt.currentUser) == null ? void 0 : Gt.userName) || "Ben"
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col w-full min-h-[calc(100vh-54px)] border-y border-subtle bg-surface-base", children: At }),
    Bt
  ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(ya, { open: !0, onOpenChange: (D) => {
      D || N();
    }, children: /* @__PURE__ */ e.jsx(
      va,
      {
        title: n != null && n.title ? `Görev Detayı: ${n.title}` : "Görev Detayı",
        fullscreen: U,
        className: U ? "p-0 rounded-xl border border-default shadow-xl short:h-[100svh]" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl short:h-[100svh]",
        onInteractOutside: (D) => {
          var P, I;
          D.preventDefault(), !(R || q) && ((I = (P = D.target) == null ? void 0 : P.closest) != null && I.call(P, "[data-apya-overlay]") || N());
        },
        onEscapeKeyDown: (D) => {
          if (R || q) {
            D.preventDefault();
            return;
          }
          D.preventDefault(), N();
        },
        children: At
      }
    ) }),
    Bt
  ] });
}
function yn() {
  var a;
  const t = y.useSyncExternalStore(
    Z.subscribe,
    Z.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(st, { children: /* @__PURE__ */ e.jsx(
    Qa,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        Z.close(), Z.emitResultIfChanged();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(st, { children: /* @__PURE__ */ e.jsx(
    _a,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        Z.close(), Z.emitResult();
      }
    },
    t
  ) }) : null;
}
function Ha() {
  var s;
  try {
    const r = new URLSearchParams(window.location.search).get("taskui");
    if (r === "v1" || r === "v2" || r === "v3") return r;
  } catch {
  }
  const t = document.getElementById("task-detail-island"), a = (s = t == null ? void 0 : t.dataset) == null ? void 0 : s.taskui;
  return a === "v1" || a === "v2" ? a : "v3";
}
function vn() {
  return Ha() === "v2";
}
function jn() {
  return Ha() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = jn();
window.apya.taskDetailV2Enabled = vn() && !window.apya.taskDetailV3Enabled;
const ba = {
  open: (t) => {
    Z.open(t);
  },
  close: () => Z.close(),
  onResult: (t) => Z.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(ba) : window.apya.taskDetail = ba;
function ha() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = ga(t), t._reactRoot.render(/* @__PURE__ */ e.jsx(yn, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = Ta();
    a && Z.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", ha) : ha();
function Nn({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(st, { children: /* @__PURE__ */ e.jsx(
    Qa,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(st, { children: /* @__PURE__ */ e.jsx(
    _a,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) });
}
const yt = document.getElementById("task-detail-page-island");
if (yt) {
  const t = yt.getAttribute("data-task-id");
  t && ga(yt).render(/* @__PURE__ */ e.jsx(Nn, { taskId: t }));
}
