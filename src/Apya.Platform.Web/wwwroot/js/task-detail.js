import { j as e, r as b, b as _e } from "./react-vendor-D7YDiBbi.js";
import { t as de, n as S, E as gs, e as vs, R as js, m as Ta, I as Ns, a as ws } from "./index-DgpuJ91w.js";
import { D as Tt, g as St, d as Nt, B as re, I as Ue, M as ks } from "./Dialog-D3HpJNIB.js";
import { a as lt } from "./QueryProvider-D2Hvqdr9.js";
import { u as te, a as ne, b as se } from "./query-vendor-Db2mwxYI.js";
import { C as Sa } from "./Combobox-CHhgTuMW.js";
import { U as $t, u as $a } from "./useDirtyGuard-D_9NgM7w.js";
import { i as He, a as Je, s as be, p as xt, d as Pa, b as Jt, R as Ea, c as Pe, e as Ba, f as Ia, g as Cs, P as Ds } from "./RichTextEditorV3-CNzWfphS.js";
import { r as Ts } from "./httpClient-BNoyY5yK.js";
import { S as we } from "./Skeleton-C92LWNeC.js";
import { R as ke, T as Ce, P as De, C as Te, A as Ss, a as Pt, D as $s, b as Ps, c as Es, d as Bs, e as Is } from "./ui-vendor-UYevF8mE.js";
import { d as Fa } from "./draggableActivation-Ybw9Upbh.js";
import { i as Fs } from "./dataChanged-CDwwWMH8.js";
function As({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: l,
  footer: o,
  children: n
}) {
  return /* @__PURE__ */ e.jsx(
    Tt,
    {
      open: t,
      onOpenChange: (i) => {
        i || a();
      },
      children: /* @__PURE__ */ e.jsx(
        St,
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
            l,
            /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: n }),
            o
          ] })
        }
      )
    }
  );
}
function zs({ title: t, header: a, footer: s, children: r }) {
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
function Ls({ isPrivate: t }) {
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
const wt = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, kt = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function Ms({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: l,
  fullscreen: o = !1
}) {
  const [n, i] = b.useState(!1), m = b.useRef(null);
  b.useEffect(() => {
    if (!n) return;
    const c = (g) => {
      m.current && !m.current.contains(g.target) && i(!1);
    }, u = (g) => {
      g.key === "Escape" && i(!1);
    };
    return document.addEventListener("mousedown", c), document.addEventListener("keydown", u), () => {
      document.removeEventListener("mousedown", c), document.removeEventListener("keydown", u);
    };
  }, [n]);
  const d = wt[t == null ? void 0 : t.status] ?? wt[1], f = kt[t == null ? void 0 : t.priority] ?? kt[2], x = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), i(!1);
  }, p = () => {
    var u, g, y, h;
    const c = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (u = navigator.clipboard) == null || u.writeText(c), (h = (y = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : y.info) == null || h.call(y, "Bağlantı kopyalandı."), i(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(Nt, { variant: d.variant, children: d.text }),
        /* @__PURE__ */ e.jsx(Nt, { variant: f.variant, children: f.text }),
        /* @__PURE__ */ e.jsx(Ls, { isPrivate: t == null ? void 0 : t.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": o ? "Küçült" : "Tam ekrana büyüt",
          onClick: l,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: o ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: m, children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": n,
            onClick: () => i((c) => !c),
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
                  onClick: x,
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
const Ks = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function Rs({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: l }) {
  const o = Ks(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: o ? `Son kayıt: ${o}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(re, { variant: "secondary", onClick: r, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        re,
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
const Wt = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", qs = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function ve({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function Gs({ value: t, onChange: a }) {
  const [s, r] = b.useState(""), l = () => {
    const o = s.trim();
    o && !t.includes(o) && a([...t, o]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((o) => /* @__PURE__ */ e.jsxs(Nt, { variant: "neutral", children: [
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
      Ue,
      {
        value: s,
        onChange: (o) => r(o.target.value),
        onKeyDown: (o) => {
          o.key === "Enter" || o.key === "," ? (o.preventDefault(), l()) : o.key === "Backspace" && !s && t.length && a(t.slice(0, -1));
        },
        onBlur: l,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function Ys({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: l = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(ve, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      Ue,
      {
        id: "task-title",
        value: t.title,
        onChange: (o) => s("title", o.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(ve, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (o) => s("status", Number(o.target.value)),
          className: Wt,
          children: Object.entries(wt).map(([o, n]) => /* @__PURE__ */ e.jsx("option", { value: o, children: n.text }, o))
        }
      ) }),
      /* @__PURE__ */ e.jsx(ve, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (o) => s("priority", Number(o.target.value)),
          className: Wt,
          children: Object.entries(kt).map(([o, n]) => /* @__PURE__ */ e.jsx("option", { value: o, children: n.text }, o))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(ve, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      Sa,
      {
        id: "task-assignee",
        options: r,
        value: t.assigneeId,
        onChange: (o) => s("assigneeId", o),
        placeholder: l ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: l
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(ve, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        Ue,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (o) => s("startDate", o.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(ve, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        Ue,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (o) => s("dueDate", o.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(ve, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(Gs, { value: t.tagNames, onChange: (o) => s("tagNames", o) }) }),
    /* @__PURE__ */ e.jsx(ve, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (o) => s("description", o.target.value),
        className: qs
      }
    ) })
  ] });
}
const Zt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function qe({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function _s({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(qe, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(qe, { label: "Oluşturulma zamanı", value: Zt(t.creationTime) }),
      /* @__PURE__ */ e.jsx(qe, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(qe, { label: "Son güncelleme zamanı", value: Zt(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(qe, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const Us = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", Vs = "border-brand-500 text-text-primary";
function Os({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: l }) {
  const o = b.useRef(/* @__PURE__ */ new Map()), n = (m) => {
    var d;
    s(m.code), (d = o.current.get(m.code)) == null || d.focus();
  }, i = (m, d) => {
    m.key === "ArrowRight" ? (m.preventDefault(), n(t[(d + 1) % t.length])) : m.key === "ArrowLeft" ? (m.preventDefault(), n(t[(d - 1 + t.length) % t.length])) : m.key === "Home" ? (m.preventDefault(), n(t[0])) : m.key === "End" && (m.preventDefault(), n(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((m, d) => {
      const f = m.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (x) => {
            x ? o.current.set(m.code, x) : o.current.delete(m.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${m.code}`,
          "aria-selected": f,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: f ? 0 : -1,
          onClick: () => s(m.code),
          onKeyDown: (x) => i(x, d),
          className: `${Us} ${f ? Vs : ""}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa ${m.icon}`, "aria-hidden": "true" }),
            m.title
          ]
        },
        m.code
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
const Qs = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Hs({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [l, o] = b.useState(""), n = b.useMemo(() => {
    const i = l.trim().toLocaleLowerCase("tr-TR"), m = i ? t.filter((f) => f.title.toLocaleLowerCase("tr-TR").includes(i)) : t, d = /* @__PURE__ */ new Map();
    return m.forEach((f) => {
      const x = d.get(f.category) ?? [];
      x.push(f), d.set(f.category, x);
    }), d;
  }, [t, l]);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Özellik ekle",
      className: "absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl",
      children: [
        /* @__PURE__ */ e.jsx(
          Ue,
          {
            autoFocus: !0,
            value: l,
            onChange: (i) => o(i.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          n.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...n.entries()].map(([i, m]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: Qs[i] ?? i }),
            m.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa ${d.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: d.title }),
              !d.implemented && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              d.implemented && !d.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === d.code,
                  onClick: () => a(d.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              d.implemented && d.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === d.code,
                  onClick: () => s(d.code),
                  className: "text-[13px] font-medium text-text-negative hover:underline disabled:opacity-50",
                  children: "Kaldır"
                }
              )
            ] }, d.code))
          ] }, i))
        ] })
      ]
    }
  );
}
function Js({ trail: t = [], current: a, onNavigate: s }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((r) => /* @__PURE__ */ e.jsxs(_e.Fragment, { children: [
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
function Ws(t) {
  var r, l, o;
  const a = (o = (l = (r = window == null ? void 0 : window.apya) == null ? void 0 : r.platform) == null ? void 0 : l.tasks) == null ? void 0 : o.task;
  if (!a) return Promise.reject(new Error("ABP görev servisi yüklenmedi."));
  const s = a.get(t);
  return Promise.resolve(s).catch((n) => {
    var m;
    const i = (m = s == null ? void 0 : s.jqXHR) == null ? void 0 : m.status;
    throw n && typeof n == "object" && n.status == null && i && (n.status = i), n;
  });
}
function Et(t) {
  return te({
    queryKey: ["task-detail", t],
    queryFn: () => Ws(t),
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
function oe(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
const Zs = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, Bt = "task";
function Aa() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(Bt);
  return t && Zs.test(t) ? t : null;
}
function It() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(Bt), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function za(t, a) {
  const s = b.useRef(a);
  s.current = a, b.useEffect(() => {
    if (!t || Aa() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(Bt, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), b.useEffect(() => {
    const r = () => {
      var l;
      (l = s.current) == null || l.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const Xs = {
  title: "",
  description: "",
  startDate: "",
  dueDate: "",
  status: 1,
  boardColumnId: null,
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
function Xt(t) {
  return t ? {
    title: t.title ?? "",
    description: t.description ?? "",
    startDate: t.startDate ? t.startDate.slice(0, 10) : "",
    dueDate: t.dueDate ? t.dueDate.slice(0, 10) : "",
    status: t.status ?? 1,
    /* Özel kanban kolonu bağı: Durum menüsünde özel kolon bir durum gibi seçilir. */
    boardColumnId: t.boardColumnId ?? null,
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
  } : Xs;
}
const La = (t, a) => JSON.stringify(t) === JSON.stringify(a);
function ea(t, a, s) {
  const r = {};
  for (const l of Object.keys(s)) r[l] = La(t[l], a[l]) ? s[l] : t[l];
  return r;
}
function Ma(t) {
  const [a, s] = b.useState(t == null ? void 0 : t.id), r = b.useMemo(() => Xt(t), [t]), [l, o] = b.useState(r), [n, i] = b.useState(r), [m, d] = b.useState({});
  if ((t == null ? void 0 : t.id) !== a || r !== l && !La(r, l)) {
    const y = (t == null ? void 0 : t.id) !== void 0 && t.id === a;
    s(t == null ? void 0 : t.id), o(r), i(y ? ea(n, l, r) : r), y || d({});
  }
  const f = b.useCallback((y, h) => {
    i((w) => ({ ...w, [y]: h })), d((w) => {
      if (!w[y] && !(y === "startDate" && w.dueDate)) return w;
      const C = { ...w };
      return delete C[y], y === "startDate" && delete C.dueDate, C;
    });
  }, []), x = b.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(r),
    [n, r]
  ), p = b.useCallback(() => {
    const y = {};
    return n.title.trim() || (y.title = de("Tasks:Detail:Validation:TitleRequired", "Başlık zorunlu.")), n.startDate || (y.startDate = de("Tasks:Detail:Validation:StartDateRequired", "Başlangıç tarihi zorunlu.")), n.dueDate && n.startDate && n.dueDate < n.startDate && (y.dueDate = de("Tasks:Detail:Validation:DueBeforeStart", "Son tarih başlangıç tarihinden önce olamaz.")), d(y), Object.keys(y).length === 0;
  }, [n]), c = b.useCallback(() => ({
    title: n.title.trim(),
    description: n.description || null,
    startDate: n.startDate,
    dueDate: n.dueDate || null,
    status: n.status,
    priority: n.priority,
    assigneeId: n.assigneeId,
    boardColumnId: n.boardColumnId ?? null,
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
  }), [n, t]), u = b.useCallback(() => {
    i(r), d({});
  }, [r]), g = b.useCallback((y, h) => {
    if (!h) return;
    const w = Xt(h);
    i((C) => ea(C, y, w));
  }, []);
  return { values: n, setField: f, isDirty: x, errors: m, validate: p, toUpdateDto: c, reset: u, commitSaved: g };
}
function ta(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function er() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ka() {
  var l;
  const t = te({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: er,
    staleTime: 3e5,
    retry: !1
  }), a = ((l = t.data) == null ? void 0 : l.items) ?? [], s = a.map((o) => ({ value: o.id, label: ta(o) })), r = new Map(a.map((o) => [o.id, ta(o)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function Ct() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function tr(t) {
  const a = Ct();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ra(t) {
  const a = ne(), s = ["task-features", t], r = te({
    queryKey: s,
    queryFn: () => tr(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = se({
    mutationFn: (i) => Promise.resolve(Ct().addFeature(t, i)),
    onSuccess: l
  }), n = se({
    mutationFn: (i) => Promise.resolve(Ct().removeFeature(t, i)),
    onSuccess: l
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
function Oe(t) {
  var r, l;
  const a = (l = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.currentUser) == null ? void 0 : l.id, s = !!(a && ((t == null ? void 0 : t.creatorId) === a || (t == null ? void 0 : t.assigneeId) === a)) || oe("Platform.Projects.ManageTeam");
  return {
    canManage: s,
    canEdit: s && oe("Platform.Tasks.Edit"),
    canChangeStatus: s && oe("Platform.Tasks.ChangeStatus"),
    canDelete: s && oe("Platform.Tasks.Delete")
  };
}
const qa = "rounded-2xl border border-subtle bg-surface-base shadow-xs", Se = `${qa} overflow-hidden`;
function Qe({ title: t, badge: a, action: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3.5 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: t }),
      a
    ] }),
    s
  ] });
}
function Ga({ children: t, tone: a = "positive" }) {
  const s = a === "positive" ? "bg-success-subtle text-success" : "bg-neutral-subtle text-text-secondary";
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-full font-mono text-[11px] font-bold ${s}`, children: t });
}
function Ee({ children: t, bg: a, fg: s }) {
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-[7px] text-[10.5px] font-bold ${a} ${s}`, children: t });
}
function pe({ icon: t, title: a, description: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 px-6 py-10 text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-xl text-text-tertiary` }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: a }),
    s && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] leading-[1.55] text-text-tertiary max-w-[420px]", children: s })
  ] });
}
function ut({ name: t, size: a = 24 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Je(t), fontSize: a * 0.4 },
      title: t || void 0,
      children: He(t)
    }
  );
}
const Me = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—", ot = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function Ya(t) {
  return t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : "0 KB";
}
function pt(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = Math.floor(a / 3600), r = Math.floor(a % 3600 / 60);
  return !s && !r ? `${a}sn` : s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function ar(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = (r) => String(r).padStart(2, "0");
  return `${s(Math.floor(a / 3600))}:${s(Math.floor(a / 60) % 60)}:${s(a % 60)}`;
}
const Ne = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  image: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  sheet: { icon: "fa-file-excel", bg: "bg-success-subtle", fg: "text-success" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  zip: { icon: "fa-file-zipper", bg: "bg-warning-subtle", fg: "text-warning" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
}, aa = (t = "") => _a(t) === Ne.image;
function _a(t = "") {
  var s;
  const a = ((s = t.split(".").pop()) == null ? void 0 : s.toLowerCase()) ?? "";
  return a === "pdf" ? Ne.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(a) ? Ne.image : ["doc", "docx", "odt", "rtf", "txt"].includes(a) ? Ne.doc : ["xls", "xlsx", "csv", "ods"].includes(a) ? Ne.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(a) ? Ne.code : ["zip", "rar", "7z", "tar", "gz"].includes(a) ? Ne.zip : Ne.other;
}
function sr({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, l] = b.useState(""), [o, n] = b.useState(!1), i = ne(), m = (a == null ? void 0 : a.subTasks) ?? [], d = m.filter((c) => c.status === 4).length, f = () => i.invalidateQueries({ queryKey: ["task-detail", t] }), x = async () => {
    const c = r.trim();
    if (c) {
      n(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: c,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), l(""), await f();
      } catch (u) {
        S(u, "Alt görev eklenemedi.");
      } finally {
        n(!1);
      }
    }
  }, p = async (c, u) => {
    c.stopPropagation();
    try {
      await Promise.resolve(window.apya.platform.tasks.task.updateStatus(u.id, u.status === 4 ? 1 : 4)), await f();
    } catch (g) {
      S(g, "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        m.length > 0 && /* @__PURE__ */ e.jsxs(Ga, { children: [
          d,
          "/",
          m.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: x,
          disabled: o || !r.trim(),
          className: `flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${o || !r.trim() ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            "Alt görev ekle"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
      m.map((c) => {
        const u = be(c.status), g = c.status === 4, y = Oe(c).canChangeStatus;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => s == null ? void 0 : s(c.id, c.title),
            onKeyDown: (h) => {
              h.key === "Enter" && (s == null || s(c.id, c.title));
            },
            className: "flex items-center gap-3.5 px-4 py-3.5 border-t border-subtle first:border-t-0 hover:bg-surface-raised cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": `${c.title} tamamlandı işaretle`,
                  onClick: (h) => p(h, c),
                  disabled: !y,
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white ${y ? "cursor-pointer" : "cursor-default"} ${g ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: g && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: c.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${g ? "line-through text-text-tertiary" : "text-text-primary"}`, children: c.title }),
              /* @__PURE__ */ e.jsx(Ee, { bg: u.bg, fg: u.fg, children: u.label }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: Me(c.dueDate) }),
              /* @__PURE__ */ e.jsx(ut, { name: c.assigneeName }),
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-right shrink-0 text-[10px] text-text-tertiary" })
            ]
          },
          c.id
        );
      }),
      /* @__PURE__ */ e.jsx("div", { className: "px-4 py-3 border-t border-subtle first:border-t-0", children: /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: r,
          onChange: (c) => l(c.target.value),
          onKeyDown: (c) => {
            c.key === "Enter" && x();
          },
          disabled: o,
          placeholder: "Yeni alt görev başlığı",
          className: "w-full h-9 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      ) })
    ] }),
    m.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz alt görev yok." })
  ] });
}
function Ua() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function rr(t) {
  const a = Ua();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function nr(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, l = Ts();
  l && (r.RequestVerificationToken = l);
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
function Ft(t) {
  const a = ne(), s = ["task-attachments", t], r = te({
    queryKey: s,
    queryFn: () => rr(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = se({
    mutationFn: (i) => nr(t, i),
    onSuccess: l
  }), n = se({
    mutationFn: (i) => Promise.resolve(Ua().deleteAttachment(i)),
    onSuccess: l
  });
  return {
    attachments: r.data ?? [],
    isLoading: r.isLoading,
    upload: o.mutateAsync,
    remove: n.mutateAsync,
    isUploading: o.isPending
  };
}
function ir({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: l } = Ft(t), o = ne(), n = b.useRef(null), [i, m] = b.useState(!1), d = oe("Platform.Tasks.ShareExternally"), f = async (c, u) => {
    try {
      await window.apya.platform.tasks.taskShare.setAttachmentGuestVisibility(c, u), o.invalidateQueries({ queryKey: ["task-attachments", t] });
    } catch (g) {
      S(g, "Görünürlük değiştirilemedi.");
    }
  }, x = async (c) => {
    var u, g, y;
    if (c)
      try {
        await s(c), (y = (g = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : g.success) == null || y.call(g, "Dosya yüklendi.");
      } catch (h) {
        S(h, "Dosya yüklenemedi.");
      } finally {
        n.current && (n.current.value = "");
      }
  }, p = async (c, u) => {
    try {
      await r(c);
    } catch (g) {
      S(g, `${u} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: n,
        type: "file",
        className: "hidden",
        onChange: (c) => {
          var u;
          return x((u = c.target.files) == null ? void 0 : u[0]);
        },
        disabled: l
      }
    ),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3", children: a.map((c) => {
      const u = _a(c.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${u.bg} ${u.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: c.fileName, children: c.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: Ya(c.fileSize) })
              ] })
            ] }),
            d && !c.isGuestUpload && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 text-[11px] text-text-tertiary cursor-pointer", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: !!c.isVisibleToGuests,
                  onChange: (g) => f(c.id, g.target.checked)
                }
              ),
              "Dış paylaşımda görünsün"
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2.5 border-t border-subtle", children: [
              /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[11px] text-text-tertiary", children: [
                c.uploaderName,
                c.isGuestUpload ? " · dış" : ""
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-1 shrink-0", children: [
                /* @__PURE__ */ e.jsx(
                  "a",
                  {
                    href: c.downloadUrl,
                    target: "_blank",
                    rel: "noreferrer",
                    title: "İndir",
                    "aria-label": `${c.fileName} dosyasini indir`,
                    className: "flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-primary-subtle hover:text-primary",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-download text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Sil",
                    "aria-label": `${c.fileName} dosyasini sil`,
                    onClick: () => p(c.id, c.fileName),
                    className: "flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                )
              ] })
            ] })
          ]
        },
        c.id
      );
    }) }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "button",
        tabIndex: 0,
        onClick: () => {
          var c;
          return (c = n.current) == null ? void 0 : c.click();
        },
        onKeyDown: (c) => {
          var u;
          c.key === "Enter" && ((u = n.current) == null || u.click());
        },
        onDragOver: (c) => {
          c.preventDefault(), i || m(!0);
        },
        onDragLeave: () => m(!1),
        onDrop: (c) => {
          var u, g;
          c.preventDefault(), m(!1), x((g = (u = c.dataTransfer) == null ? void 0 : u.files) == null ? void 0 : g[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${i ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-[26px] ${i ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: l ? "Yükleniyor…" : i ? "Bırakın, yükleyelim" : "Dosyaları buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, PDF, DOCX · max 25MB" })
        ]
      }
    )
  ] });
}
function nt() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function lr(t) {
  const a = nt();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function At(t) {
  const a = ne(), s = ["task-checklist", t], r = te({
    queryKey: s,
    queryFn: () => lr(t),
    enabled: !!t,
    staleTime: 3e4,
    /* toggleChecklistItem ters çevirir; bayat gösterim yanlış yöne yazar (proje
       konsolu paneli aynı maddeyi React Query dışından değiştiriyor). */
    meta: { persist: !1 },
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = se({
    mutationFn: (m) => Promise.resolve(nt().addChecklistItem(t, m)),
    onSuccess: l
  }), n = se({
    mutationFn: (m) => Promise.resolve(nt().toggleChecklistItem(m)),
    onSuccess: l
  }), i = se({
    mutationFn: (m) => Promise.resolve(nt().deleteChecklistItem(m)),
    onSuccess: l
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: o.mutateAsync,
    toggleItem: n.mutateAsync,
    removeItem: i.mutateAsync
  };
}
function or({ taskId: t, readOnly: a = !1 }) {
  const { items: s, isLoading: r, addItem: l, toggleItem: o, removeItem: n } = At(t), [i, m] = b.useState(""), d = s.filter((p) => p.isDone).length, f = s.length ? Math.round(d / s.length * 100) : 0, x = async () => {
    const p = i.trim();
    if (!(!p || !t)) {
      m("");
      try {
        await l(p);
      } catch (c) {
        m(p), S(c, "Madde eklenemedi.");
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
          s.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: [
        "%",
        f
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mt-3.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
      "div",
      {
        className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
        style: { width: `${f}%` }
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
      r && s.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 py-2 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
      !r && s.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 py-2 text-[12.5px] text-text-tertiary", children: a ? "Henüz madde yok." : "Henüz madde yok. Aşağıdan ilk maddeyi ekleyin." }),
      s.map((p) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            disabled: a,
            "aria-label": p.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
            onClick: () => o(p.id).catch((c) => S(c, "Durum güncellenemedi.")),
            className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${a ? "cursor-default" : "cursor-pointer"} transition-colors duration-fast ${p.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
            children: p.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${p.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: p.text }),
        !a && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            title: "Sil",
            "aria-label": `${p.text} maddesini sil`,
            onClick: () => n(p.id).catch((c) => S(c, "Madde silinemedi.")),
            className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
          }
        )
      ] }, p.id)),
      !a && /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: i,
          onChange: (p) => m(p.target.value),
          onKeyDown: (p) => {
            p.key === "Enter" && x();
          },
          placeholder: "Yeni madde yaz ve Enter'a bas…",
          "aria-label": "Yeni kontrol listesi maddesi",
          className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      )
    ] })
  ] });
}
function cr({ taskId: t, task: a }) {
  const [s, r] = b.useState(""), [l, o] = b.useState(null), [n, i] = b.useState(""), [m, d] = b.useState(!1), f = ne(), x = (a == null ? void 0 : a.comments) ?? [], p = async (u) => {
    var g, y, h;
    if (u == null || u.preventDefault(), !(!s.trim() || m)) {
      d(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), f.invalidateQueries({ queryKey: ["task-detail", t] }), (h = (y = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : y.success) == null || h.call(y, "Yorum eklendi.");
      } catch (w) {
        S(w, "Yorum eklenemedi.");
      } finally {
        d(!1);
      }
    }
  }, c = async (u) => {
    var g, y, h;
    if (!(!n.trim() || m)) {
      d(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(u, n.trim())
        ), i(""), o(null), f.invalidateQueries({ queryKey: ["task-detail", t] }), (h = (y = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : y.success) == null || h.call(y, "Yanıt eklendi.");
      } catch (w) {
        S(w, "Yanıt eklenemedi.");
      } finally {
        d(!1);
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
          onChange: (u) => r(u.target.value),
          placeholder: "Bir yorum veya güncelleme yazın...",
          className: "w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ e.jsx(
        re,
        {
          type: "submit",
          variant: "primary",
          disabled: !s.trim() || m,
          isLoading: m,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    x.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: x.map((u) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: u.creatorUserName || u.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: u.creationTime ? new Date(u.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: u.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        re,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => o(l === u.id ? null : u.id),
          children: "Yanıtla"
        }
      ) }),
      l === u.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: n,
            onChange: (g) => i(g.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(re, { variant: "ghost", size: "sm", onClick: () => o(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(re, { variant: "primary", size: "sm", disabled: !n.trim() || m, onClick: () => c(u.id), children: "Gönder" })
        ] })
      ] }),
      u.replies && u.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: u.replies.map((g) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: g.creatorUserName || g.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: g.creationTime ? new Date(g.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: g.text })
      ] }, g.id)) })
    ] }, u.id)) })
  ] });
}
function mt() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.taskShare) ?? null;
}
function dr(t) {
  const a = ne(), s = ["task-share-links", t], r = te({
    queryKey: s,
    queryFn: () => {
      const i = mt();
      return i ? Promise.resolve(i.getList(t)) : Promise.reject(new Error("Paylaşım servisi yüklenmedi."));
    },
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = se({
    mutationFn: (i) => Promise.resolve(mt().create({ ...i, taskId: t })),
    onSuccess: l
  }), n = se({
    mutationFn: (i) => Promise.resolve(mt().revoke(i)),
    onSuccess: l
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
const sa = {
  recipientName: "",
  recipientEmail: "",
  lifetimeDays: 14,
  allowComment: !0,
  allowUpload: !0,
  allowDownload: !0
};
function xr(t) {
  return t ? new Date(t).toLocaleDateString("tr-TR") : "—";
}
function ur({ taskId: t }) {
  const { links: a, isPending: s, create: r, revoke: l, isCreating: o } = dr(t), [n, i] = b.useState(sa), [m, d] = b.useState(null);
  if (!oe("Platform.Tasks.ShareExternally"))
    return /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Görevi ekip dışıyla paylaşma yetkiniz yok." });
  const x = (y) => (h) => {
    const w = h.target.type === "checkbox" ? h.target.checked : h.target.value;
    i((C) => ({ ...C, [y]: w }));
  }, p = async (y) => {
    if (y.preventDefault(), !!n.recipientName.trim())
      try {
        const h = await r({
          ...n,
          lifetimeDays: Number(n.lifetimeDays) || 14
        });
        d(h), i(sa);
      } catch (h) {
        S(h, "Paylaşım linki üretilemedi.");
      }
  }, c = (y) => `${window.location.origin}${y}`, u = (y) => {
    var h, w, C, A;
    (h = navigator.clipboard) == null || h.writeText(c(y)), (A = (C = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : C.info) == null || A.call(C, "Bağlantı kopyalandı.");
  }, g = async (y) => {
    try {
      await l(y);
    } catch (h) {
      S(h, "Bağlantı iptal edilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    m && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 rounded-[14px] border border-focus bg-primary-subtle p-3.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "text-[12.5px] font-bold text-text-primary", children: [
        "Bağlantı hazır — ",
        /* @__PURE__ */ e.jsx("span", { className: "font-normal", children: "şimdi kopyalayın, bir daha gösterilmeyecek." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("code", { className: "min-w-0 flex-1 truncate rounded-[8px] bg-surface-base px-2.5 py-2 font-mono text-[11.5px] text-text-secondary", children: c(m.url) }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => u(m.url),
            className: "rounded-[8px] bg-primary px-3 py-2 text-[12px] font-bold text-white cursor-pointer",
            children: "Kopyala"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => d(null),
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
            value: n.recipientName,
            onChange: x("recipientName"),
            placeholder: "Kime? (ad soyad)",
            className: "min-w-0 flex-[2_1_180px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "email",
            value: n.recipientEmail,
            onChange: x("recipientEmail"),
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
            onChange: x("lifetimeDays"),
            title: "Geçerlilik (gün)",
            className: "w-[92px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: n.allowComment, onChange: x("allowComment") }),
          "Yorum yazabilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: n.allowUpload, onChange: x("allowUpload") }),
          "Dosya yükleyebilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: n.allowDownload, onChange: x("allowDownload") }),
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
              y.isActive ? `${xr(y.expiresAt)} tarihine kadar geçerli` : y.revokedAt ? "İptal edildi" : "Süresi doldu",
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
              onClick: () => g(y.id),
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
function pr({ task: t }) {
  var s;
  const a = [];
  return t != null && t.creationTime && a.push({
    id: "created",
    icon: "fa-plus",
    bg: "bg-success-subtle",
    fg: "text-success",
    actor: t.creatorUserName || t.creatorName || "Sistem / Kullanıcı",
    event: "görevi oluşturdu",
    time: ot(t.creationTime)
  }), t != null && t.lastModificationTime && a.push({
    id: "modified",
    icon: "fa-pen",
    bg: "bg-warning-subtle",
    fg: "text-warning",
    actor: t.lastModifierUserName || t.lastModifierName || "Kullanıcı",
    event: "görevi güncelledi",
    time: ot(t.lastModificationTime)
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
    a.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Aktivite kaydı bulunamadı." }) }) : /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: a.map((r, l) => {
      const o = l === a.length - 1;
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
const Fe = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : null;
function mr({ label: t, value: a, hint: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4 px-3.5 py-3", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[12.5px] font-semibold text-text-secondary", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 text-right", children: [
      /* @__PURE__ */ e.jsx("span", { className: "block text-[12.5px] font-bold text-text-primary break-words", children: a ?? "—" }),
      s && /* @__PURE__ */ e.jsx("span", { className: "block text-[11px] text-text-tertiary", children: s })
    ] })
  ] });
}
function fr({ task: t = {}, nameById: a }) {
  const s = (l) => {
    var o;
    return l && ((o = a == null ? void 0 : a.get) == null ? void 0 : o.call(a, l)) || null;
  }, r = [
    { label: "Görev kodu", value: t.code || "—" },
    {
      label: "Oluşturulma",
      value: Fe(t.creationTime),
      hint: s(t.creatorId) ? `${s(t.creatorId)} tarafından` : null
    },
    {
      label: "Son güncelleme",
      value: Fe(t.lastModificationTime) ?? "Henüz güncellenmedi",
      hint: s(t.lastModifierId) ? `${s(t.lastModifierId)} tarafından` : null
    },
    { label: "Planlanan başlangıç", value: Fe(t.startDate) },
    { label: "Termin", value: Fe(t.dueDate) }
  ];
  return t.completedDate && r.push({ label: "Tamamlanma", value: Fe(t.completedDate) }), t.cancelledDate && r.push({
    label: "İptal",
    value: Fe(t.cancelledDate),
    hint: t.cancelReason || null
  }), /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-3.5 py-3 border-b border-subtle bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clock-rotate-left text-[13px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: "Kayıt bilgileri" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "divide-y divide-subtle", children: r.map((l) => /* @__PURE__ */ e.jsx(mr, { ...l }, l.label)) })
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11.5px] text-text-tertiary", children: "Alan bazında değişiklik günlüğü (hangi alan, eski/yeni değer) henüz yayınlanmadı." })
  ] });
}
function br(t) {
  var s, r, l;
  const a = (l = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.projectBudgets) == null ? void 0 : l.projectBudget;
  return a != null && a.getRecordFormLookup ? Promise.resolve(a.getRecordFormLookup(t)) : Promise.reject(new Error("Bütçe servisi yüklenmedi."));
}
function hr(t) {
  var l;
  const a = oe("Platform.Projects.ViewBudget"), s = te({
    queryKey: ["task-detail", "budget-lines", t],
    queryFn: () => br(t),
    enabled: !!t && a,
    staleTime: 6e4,
    retry: !1
  }), r = ((l = s.data) == null ? void 0 : l.lines) ?? [];
  return {
    lines: r,
    options: r.map((o) => ({ value: o.id, label: o.code ? `${o.code} · ${o.name}` : o.name })),
    canViewBudget: a,
    isLoading: s.isLoading
  };
}
function ct(t) {
  var s, r;
  const a = (r = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.ajax) == null ? void 0 : r.call(s, t);
  return a ? new Promise((l, o) => {
    a.done(l).fail(o);
  }) : Promise.reject(new Error("ABP köprüsü yüklenmedi."));
}
function dt(t, a = {}) {
  var l;
  const s = ((l = window == null ? void 0 : window.abp) == null ? void 0 : l.appPath) ?? "/", r = new URLSearchParams({ handler: t });
  return Object.entries(a).forEach(([o, n]) => {
    n != null && n !== "" && r.append(o, n);
  }), `${s}Documents/Matching?${r.toString()}`;
}
const Va = () => oe("Platform.Documents"), yr = () => oe("Platform.Documents.ManageMeta");
function gr(t) {
  const a = !!t && Va(), s = te({
    queryKey: ["task-detail", "expense-matches", t],
    queryFn: () => ct({ url: dt("Matches", { projectId: t }), type: "GET" }),
    enabled: a,
    staleTime: 6e4,
    meta: { persist: !1 },
    retry: !1
  }), r = /* @__PURE__ */ new Map();
  return (s.data ?? []).forEach((l) => {
    r.has(l.expenseId) || r.set(l.expenseId, []), r.get(l.expenseId).push(l);
  }), { byExpense: r, enabled: a, isLoading: s.isLoading };
}
function vr(t, a) {
  const s = te({
    queryKey: ["task-detail", "expense-candidates", t],
    queryFn: () => ct({ url: dt("Candidates", { expenseId: t }), type: "GET" }),
    enabled: !!t && a && Va(),
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  });
  return { candidates: s.data ?? [], isLoading: s.isLoading };
}
function jr(t) {
  const a = ne(), s = (o) => {
    a.invalidateQueries({ queryKey: ["task-detail", "expense-matches", t] }), a.invalidateQueries({ queryKey: ["task-detail", "expense-candidates", o] });
  }, r = se({
    mutationFn: ({ documentFileId: o, expenseId: n, score: i }) => ct({
      url: dt("CreateMatch"),
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ documentFileId: o, expenseId: n, score: i ?? 0 })
    }),
    onSuccess: (o, n) => s(n.expenseId)
  }), l = se({
    mutationFn: ({ matchId: o }) => ct({ url: dt("RemoveMatch", { matchId: o }), type: "POST" }),
    onSuccess: (o, n) => s(n.expenseId)
  });
  return { link: r, unlink: l, isBusy: r.isPending || l.isPending };
}
function Nr(t) {
  return t == null ? "—" : new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 2 }).format(t);
}
function wr({ expenseId: t, projectId: a, matches: s }) {
  const { candidates: r, isLoading: l } = vr(t, !0), { link: o, unlink: n, isBusy: i } = jr(a), m = yr(), d = new Set(s.map((x) => x.documentFileId)), f = r.filter((x) => !d.has(x.documentFileId));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3 px-4 pb-3.5 pt-1 bg-surface-raised", children: [
    s.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Bağlı evraklar" }),
      s.map((x) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-[11px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12px] text-text-primary", children: x.documentFileName }),
        x.annexNumber && /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary", children: [
          "EK-",
          x.annexNumber
        ] }),
        m && /* @__PURE__ */ e.jsx(
          re,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            disabled: i,
            onClick: () => n.mutate(
              { matchId: x.id, expenseId: t },
              { onError: (p) => S(p, "Evrak bağı kaldırılamadı.") }
            ),
            children: "Kaldır"
          }
        )
      ] }, x.id))
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Aday evraklar" }),
      l && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Adaylar aranıyor…" }),
      !l && f.length === 0 && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Eşleşen aday yok. Evrak Belgeler modülünden yüklenip buradan bağlanır." }),
      f.map((x) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[11px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12px] text-text-primary", children: x.displayName }),
        /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
          Nr(x.amount),
          " · ",
          Me(x.documentDate)
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: `shrink-0 font-mono text-[11px] font-bold ${x.isStrong ? "text-success" : "text-text-tertiary"}`, children: [
          "%",
          x.score
        ] }),
        m && /* @__PURE__ */ e.jsx(
          re,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            disabled: i,
            onClick: () => o.mutate(
              { documentFileId: x.documentFileId, expenseId: t, score: x.score },
              { onError: (p) => S(p, "Evrak bağlanamadı.") }
            ),
            children: "Bağla"
          }
        )
      ] }, x.documentFileId))
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
const kr = ["pointerdown", "focusin", "wheel", "touchmove"], Cr = (t) => t.stopPropagation();
function Dr(t, a, s, r) {
  var m, d, f, x, p, c, u;
  const l = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.ModalManager;
  if (!l) {
    (x = (f = (d = window == null ? void 0 : window.abp) == null ? void 0 : d.notify) == null ? void 0 : f.error) == null || x.call(f, "Kayıt formu yüklenemedi."), r == null || r();
    return;
  }
  const o = ((p = window == null ? void 0 : window.abp) == null ? void 0 : p.appPath) ?? "/";
  (u = (c = document.activeElement) == null ? void 0 : c.blur) == null || u.call(c);
  const n = new l({ viewUrl: `${o}${t}?TaskId=${a}` });
  n.onResult(() => s == null ? void 0 : s()), n.onOpen(() => r == null ? void 0 : r()), n.open();
  const i = document.getElementById(n.getModalId());
  i && (i.setAttribute("data-apya-overlay", "abp-modal"), i.style.pointerEvents = "auto", kr.forEach((g) => i.addEventListener(g, Cr, { passive: !0 }))), setTimeout(() => r == null ? void 0 : r(), 1e4);
}
function Tr({ taskId: t }) {
  const a = ne(), [s, r] = b.useState(null), l = oe("Platform.Expenses.Create"), o = oe("Platform.Incomes.Create"), n = oe("Platform.Invoices.Create");
  if (!t || !l && !o && !n)
    return null;
  const i = () => a.invalidateQueries({ queryKey: ["task-detail", t] }), m = (d) => {
    s || (r(d), Dr(d, t, i, () => r((f) => f === d ? null : f)));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
    l && /* @__PURE__ */ e.jsxs(
      re,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        isLoading: s === "Expenses/CreateModal",
        disabled: !!s,
        onClick: () => m("Expenses/CreateModal"),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-up text-[11px]" }),
          "Gider ekle"
        ]
      }
    ),
    o && /* @__PURE__ */ e.jsxs(
      re,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        isLoading: s === "Incomes/CreateModal",
        disabled: !!s,
        onClick: () => m("Incomes/CreateModal"),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-down text-[11px]" }),
          "Gelir ekle"
        ]
      }
    ),
    n && /* @__PURE__ */ e.jsxs(
      re,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        isLoading: s === "Invoices/CreateModal",
        disabled: !!s,
        onClick: () => m("Invoices/CreateModal"),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-invoice text-[11px]" }),
          "Fatura ekle"
        ]
      }
    )
  ] });
}
const ra = {
  0: { label: "Taslak", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  1: { label: "Gönderildi", bg: "bg-primary-subtle", fg: "text-primary" },
  2: { label: "Ödendi", bg: "bg-success-subtle", fg: "text-success" },
  3: { label: "İptal", bg: "bg-neutral-subtle", fg: "text-text-tertiary" },
  4: { label: "Gecikti", bg: "bg-negative-subtle", fg: "text-negative" }
};
function Sr({ invoices: t, action: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
    /* @__PURE__ */ e.jsx(Qe, { title: "Faturalar", action: a }),
    t.map((s) => {
      const r = ra[s.status] ?? ra[0];
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
              Me(s.dueDate)
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
function $r({ line: t, projectId: a, matches: s, docsEnabled: r }) {
  const [l, o] = b.useState(!1), n = t.kind === "income";
  return /* @__PURE__ */ e.jsxs("div", { className: "border-t border-subtle first:border-t-0", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5 px-4 py-3 hover:bg-surface-raised", children: [
      /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-7 w-7 rounded-lg bg-neutral-subtle text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n ? "fa-arrow-down" : "fa-arrow-up"} text-[11px]` }) }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] font-semibold text-text-primary", children: t.title || (n ? "Gelir" : "Gider") }),
      r && /* @__PURE__ */ e.jsxs(
        re,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          "aria-expanded": l,
          onClick: () => o((i) => !i),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-[11px]" }),
            s.length > 0 ? `Evrak ${s.length}` : "Evrak"
          ]
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: Me(t.date) }),
      n ? /* @__PURE__ */ e.jsx(Ee, { bg: "bg-success-subtle", fg: "text-success", children: "Gelir" }) : /* @__PURE__ */ e.jsx(Ee, { bg: "bg-warning-subtle", fg: "text-warning", children: "Gider" }),
      /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: `shrink-0 font-mono text-[12.5px] font-bold ${n ? "text-success" : "text-text-primary"}`,
          style: { fontVariantNumeric: "tabular-nums" },
          children: [
            n ? "+" : "−",
            fe(t.amount, t.currency)
          ]
        }
      )
    ] }),
    r && l && /* @__PURE__ */ e.jsx(wr, { expenseId: t.id, projectId: a, matches: s })
  ] });
}
function ft({ label: t, value: a, tone: s, note: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: `font-mono text-[22px] font-bold tracking-[-.02em] ${s}`, style: { fontVariantNumeric: "tabular-nums" }, children: a }),
    r && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
  ] });
}
function Pr({ options: t, isLoading: a, lineId: s, planned: r, onField: l }) {
  return a ? null : t.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12px] text-text-tertiary", children: "Bu projede bütçe kalemi tanımlı değil — kalemler Finans & Bütçe ekranından açılır." }) : /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Bütçe kalemi" }),
      /* @__PURE__ */ e.jsx(
        Sa,
        {
          options: t,
          value: s ?? void 0,
          onChange: (o) => l("budgetLineId", o ?? null),
          placeholder: "Kalem seç",
          size: "sm"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Görev bütçesi" }),
      /* @__PURE__ */ e.jsx(
        ks,
        {
          value: r,
          onValueChange: (o) => l("plannedAmount", o),
          currency: "TRY",
          min: 0,
          size: "sm",
          disabled: !s
        }
      )
    ] })
  ] });
}
function Er({ task: t, form: a, spentByCurrency: s, readOnly: r }) {
  const l = (a ? a.values.projectId : t == null ? void 0 : t.projectId) ?? null, { options: o, lines: n, canViewBudget: i, isLoading: m } = hr(l), d = !!a && !r && i && !!l, f = (a ? a.values.budgetLineId : t == null ? void 0 : t.budgetLineId) ?? null, x = (a ? a.values.plannedAmount : t == null ? void 0 : t.plannedAmount) ?? null;
  if (!d && (!f || x == null))
    return null;
  const p = n.find((A) => A.id === f), c = p ? p.remainingAmount : t == null ? void 0 : t.budgetLineRemaining, u = s, g = !!f && x != null, y = (x ?? 0) - u, h = x > 0 ? Math.round(u / x * 100) : 0, w = y < 0, C = () => {
    a.setField("budgetLineId", null), a.setField("plannedAmount", null);
  };
  return (
    /* Kırpmayan kart ŞART: kalem seçicisinin listesi kartın içine absolute
       konumlanır, TAB_CARD'ın overflow-hidden'ı onu alt kenarda keserdi. */
    /* @__PURE__ */ e.jsxs("div", { className: qa, children: [
      /* @__PURE__ */ e.jsx(
        Qe,
        {
          title: "Bütçe bağı",
          action: d && f ? /* @__PURE__ */ e.jsx(re, { type: "button", variant: "ghost", size: "sm", onClick: C, children: "Bağı kaldır" }) : null
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "px-4 pb-4 pt-1 flex flex-col gap-3", children: [
        d ? /* @__PURE__ */ e.jsx(
          Pr,
          {
            options: o,
            isLoading: m,
            lineId: f,
            planned: x,
            onField: a.setField
          }
        ) : /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-semibold text-accent", children: t.budgetLineName || "Bütçe kalemi" }) }),
        c != null && /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "kalemde kalan ",
          fe(c, "TRY")
        ] }),
        g && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3", children: [
            /* @__PURE__ */ e.jsx(bt, { label: "Görev bütçesi", value: fe(x, "TRY") }),
            /* @__PURE__ */ e.jsx(bt, { label: "Gerçekleşen", value: fe(u, "TRY") }),
            /* @__PURE__ */ e.jsx(
              bt,
              {
                label: "Kalan",
                value: fe(y, "TRY"),
                tone: w ? "text-negative" : "text-success"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
              "div",
              {
                className: `h-full rounded-full ${w ? "bg-negative" : h >= 80 ? "bg-warning" : "bg-success"}`,
                style: { width: `${Math.min(Math.max(h, 0), 100)}%` }
              }
            ) }),
            /* @__PURE__ */ e.jsxs("div", { className: "mt-1 text-[11.5px] text-text-tertiary", children: [
              "%",
              h,
              w && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative", children: "· görev bütçesi aşıldı" })
            ] })
          ] })
        ] })
      ] })
    ] })
  );
}
function bt({ label: t, value: a, tone: s }) {
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
function Br({ task: t, taskId: a, form: s, readOnly: r = !1 }) {
  const l = (t == null ? void 0 : t.expenses) || [], o = (t == null ? void 0 : t.incomes) || [], n = (t == null ? void 0 : t.invoices) || [], i = (s ? s.values.projectId : t == null ? void 0 : t.projectId) ?? null, { byExpense: m, enabled: d } = gr(i), f = l.filter((y) => (y.currency || "TRY") === "TRY").reduce((y, h) => y + (h.amount || 0), 0), x = /* @__PURE__ */ e.jsx(Er, { task: t, form: s, spentByCurrency: f, readOnly: r }), p = /* @__PURE__ */ e.jsx(Tr, { taskId: a ?? (t == null ? void 0 : t.id) });
  if (l.length === 0 && o.length === 0 && n.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      x,
      /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
        /* @__PURE__ */ e.jsx(Qe, { title: "Görev Finansı", action: p }),
        /* @__PURE__ */ e.jsx(
          pe,
          {
            icon: "fa-coins",
            title: "Kayıt yok",
            description: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
          }
        )
      ] })
    ] });
  const u = Array.from(new Set([...l, ...o].map((y) => y.currency || "TRY"))).map((y) => {
    const h = o.filter((C) => (C.currency || "TRY") === y).reduce((C, A) => C + (A.amount || 0), 0), w = l.filter((C) => (C.currency || "TRY") === y).reduce((C, A) => C + (A.amount || 0), 0);
    return { cur: y, inc: h, exp: w, net: h - w };
  }), g = [
    ...o.map((y) => ({ ...y, kind: "income" })),
    ...l.map((y) => ({ ...y, kind: "expense" }))
  ].sort((y, h) => new Date(h.date || 0) - new Date(y.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    x,
    u.map(({ cur: y, inc: h, exp: w, net: C }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(ft, { label: `Toplam Gelir (${y})`, value: fe(h, y), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(ft, { label: `Toplam Gider (${y})`, value: fe(w, y), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        ft,
        {
          label: `Net Bakiye (${y})`,
          value: fe(C, y),
          tone: C >= 0 ? "text-success" : "text-negative",
          note: C >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, y)),
    n.length > 0 && /* @__PURE__ */ e.jsx(Sr, { invoices: n, action: g.length === 0 ? p : null }),
    g.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
      /* @__PURE__ */ e.jsx(Qe, { title: "Finans kalemleri", action: p }),
      g.map((y) => /* @__PURE__ */ e.jsx(
        $r,
        {
          line: y,
          projectId: i,
          matches: y.kind === "expense" ? m.get(y.id) ?? [] : [],
          docsEnabled: d && y.kind === "expense"
        },
        `${y.kind}-${y.id}`
      ))
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11px] text-text-tertiary", children: "Buradan eklenen kayıt göreve ve projesine etiketlenir; düzenleme/silme Finans modülünden yapılır. Evraklar Belgeler modülünde yaşar, buradan gidere bağlanır." })
  ] });
}
function Ir({ taskId: t }) {
  const { attachments: a, isLoading: s, upload: r, remove: l, isUploading: o } = Ft(t), n = b.useRef(null), [i, m] = b.useState(!1), d = a.filter((p) => aa(p.fileName)), f = async (p) => {
    var c, u, g, y, h, w;
    if (p) {
      if (!aa(p.name)) {
        (g = (u = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : u.error) == null || g.call(u, "Galeriye yalnız görsel dosya yüklenebilir.");
        return;
      }
      try {
        await r(p), (w = (h = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : h.success) == null || w.call(h, "Görsel yüklendi.");
      } catch (C) {
        S(C, "Görsel yüklenemedi.");
      } finally {
        n.current && (n.current.value = "");
      }
    }
  }, x = async (p, c) => {
    try {
      await l(p);
    } catch (u) {
      S(u, `${c} silinemedi.`);
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
        onChange: (p) => {
          var c;
          return f((c = p.target.files) == null ? void 0 : c[0]);
        },
        disabled: o
      }
    ),
    s && d.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !s && d.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görevde henüz görsel yok. Yüklediğiniz görseller Dosyalar sekmesinde de görünür." }),
    d.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3", children: d.map((p) => /* @__PURE__ */ e.jsxs(
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
              /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: Ya(p.fileSize) })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                title: "Sil",
                "aria-label": `${p.fileName} gorselini sil`,
                onClick: () => x(p.id, p.fileName),
                className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
              }
            )
          ] })
        ]
      },
      p.id
    )) }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "button",
        tabIndex: 0,
        onClick: () => {
          var p;
          return (p = n.current) == null ? void 0 : p.click();
        },
        onKeyDown: (p) => {
          var c;
          p.key === "Enter" && ((c = n.current) == null || c.click());
        },
        onDragOver: (p) => {
          p.preventDefault(), i || m(!0);
        },
        onDragLeave: () => m(!1),
        onDrop: (p) => {
          var c, u;
          p.preventDefault(), m(!1), f((u = (c = p.dataTransfer) == null ? void 0 : c.files) == null ? void 0 : u[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${i ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${o ? "fa-circle-notch fa-spin" : "fa-images"} text-[26px] ${i ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: o ? "Yükleniyor…" : i ? "Bırakın, yükleyelim" : "Görselleri buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, JPG, GIF, WEBP, SVG · max 25MB" })
        ]
      }
    )
  ] });
}
const Fr = [
  { key: "title", label: "Başlık", align: "left" },
  { key: "status", label: "Durum", align: "left" },
  { key: "priority", label: "Öncelik", align: "left" },
  { key: "assignee", label: "Atanan", align: "left" },
  { key: "dueDate", label: "Termin", align: "right" }
];
function na(t, a) {
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
function Ar(t, a, s, r) {
  const l = na(t, s), o = na(a, s), n = l === null || l === "", i = o === null || o === "";
  return n && i ? 0 : n ? 1 : i ? -1 : l === o ? 0 : (l < o ? -1 : 1) * (r === "asc" ? 1 : -1);
}
function zr({ task: t = {}, onOpenSubtask: a }) {
  const [s, r] = b.useState({ key: "dueDate", dir: "asc" }), l = (t == null ? void 0 : t.subTasks) ?? [], o = b.useMemo(
    () => [...l].sort((i, m) => Ar(i, m, s.key, s.dir)),
    [l, s.key, s.dir]
  ), n = (i) => r((m) => m.key === i ? { key: i, dir: m.dir === "asc" ? "desc" : "asc" } : { key: i, dir: "asc" });
  return l.length === 0 ? /* @__PURE__ */ e.jsx(
    pe,
    {
      icon: "fa-table",
      title: "Alt görev yok",
      description: "Alt Görevler sekmesinden ekledikleriniz burada tablo olarak listelenir."
    }
  ) : /* @__PURE__ */ e.jsx("div", { className: `${Se} overflow-x-auto`, children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse text-[12.5px]", children: [
    /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsx("tr", { className: "bg-surface-raised", children: Fr.map((i) => {
      const m = s.key === i.key;
      return /* @__PURE__ */ e.jsx(
        "th",
        {
          scope: "col",
          "aria-sort": m ? s.dir === "asc" ? "ascending" : "descending" : "none",
          className: `px-3.5 py-2.5 border-b border-subtle font-bold text-text-secondary whitespace-nowrap ${i.align === "right" ? "text-right" : "text-left"}`,
          children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => n(i.key),
              className: `inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer font-bold ${m ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`,
              children: [
                i.label,
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid text-[9px] ${m ? s.dir === "asc" ? "fa-arrow-up-short-wide" : "fa-arrow-down-wide-short" : "fa-sort opacity-40"}` })
              ]
            }
          )
        },
        i.key
      );
    }) }) }),
    /* @__PURE__ */ e.jsx("tbody", { children: o.map((i) => {
      const m = be(i.status), d = xt(i.priority), f = Pa(i.dueDate);
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
                  onClick: (x) => {
                    x.stopPropagation(), a == null || a(i.id);
                  },
                  title: i.title,
                  className: `block w-full truncate bg-transparent border-0 p-0 text-left font-semibold cursor-pointer ${i.status === 4 ? "line-through text-text-tertiary" : "text-text-primary"}`,
                  children: i.title
                }
              ),
              i.code && /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: i.code })
            ] }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(Ee, { bg: m.bg, fg: m.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${m.icon} text-[9px] mr-1` }),
              m.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(Ee, { bg: d.bg, fg: d.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.icon} text-[9px] mr-1` }),
              d.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: i.assigneeName ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ e.jsx(ut, { name: i.assigneeName, size: 22 }),
              /* @__PURE__ */ e.jsx("span", { className: "truncate text-text-secondary", children: i.assigneeName })
            ] }) : /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: "Atanmadı" }) }),
            /* @__PURE__ */ e.jsxs("td", { className: `px-3.5 py-2.5 text-right whitespace-nowrap ${f.tone}`, children: [
              i.dueDate ? Me(i.dueDate) : "—",
              f.hint && /* @__PURE__ */ e.jsx("div", { className: "text-[11px]", children: f.hint })
            ] })
          ]
        },
        i.id
      );
    }) })
  ] }) });
}
function Lr({ taskId: t, task: a = {}, onOpenSubtask: s }) {
  const r = ne(), l = (a == null ? void 0 : a.subTasks) ?? [], [o, n] = b.useState(null), [i, m] = b.useState(null), d = async (f, x) => {
    const p = l.find((c) => c.id === f);
    if (!(!p || p.status === x || !Oe(p).canChangeStatus)) {
      m(f);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.updateStatus(f, x)), await r.invalidateQueries({ queryKey: ["task-detail", t] });
      } catch (c) {
        S(c, "Alt görev durumu güncellenemedi.");
      } finally {
        m(null);
      }
    }
  };
  return l.length === 0 ? /* @__PURE__ */ e.jsx(
    pe,
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 items-start", children: Jt.map((f) => {
      const x = be(f), p = l.filter((u) => u.status === f), c = o === f;
      return /* @__PURE__ */ e.jsxs(
        "section",
        {
          "aria-label": `${x.label} sütunu`,
          onDragOver: (u) => {
            u.preventDefault(), o !== f && n(f);
          },
          onDragLeave: () => n((u) => u === f ? null : u),
          onDrop: (u) => {
            var y;
            u.preventDefault(), n(null);
            const g = (y = u.dataTransfer) == null ? void 0 : y.getData("text/plain");
            g && d(g, f);
          },
          className: `flex flex-col gap-2 p-2.5 rounded-2xl border bg-surface-raised min-h-[120px] transition-colors duration-fast ${c ? "border-focus bg-primary-subtle" : "border-subtle"}`,
          children: [
            /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-2 px-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${x.dot}` }),
              /* @__PURE__ */ e.jsx("h3", { className: "m-0 flex-1 text-[12px] font-bold text-text-primary", children: x.label }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: p.length })
            ] }),
            p.map((u) => {
              const g = xt(u.priority), y = Oe(u).canChangeStatus;
              return /* @__PURE__ */ e.jsxs(
                "article",
                {
                  draggable: y,
                  onDragStart: (h) => {
                    var w;
                    return (w = h.dataTransfer) == null ? void 0 : w.setData("text/plain", u.id);
                  },
                  role: "button",
                  tabIndex: 0,
                  onClick: () => s == null ? void 0 : s(u.id),
                  onKeyDown: (h) => {
                    h.key === "Enter" && (s == null || s(u.id));
                  },
                  className: `flex flex-col gap-2 p-2.5 rounded-[12px] border border-subtle bg-surface-base shadow-xs cursor-pointer hover:border-focus hover:shadow-md ${i === u.id ? "opacity-60" : ""}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary line-clamp-2", children: u.title }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                      /* @__PURE__ */ e.jsxs("span", { className: `text-[10.5px] font-bold ${g.fg}`, children: [
                        /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${g.icon} text-[9px] mr-1` }),
                        g.label
                      ] }),
                      u.dueDate && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: Me(u.dueDate) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2 border-t border-subtle", children: [
                      u.assigneeName ? /* @__PURE__ */ e.jsx(ut, { name: u.assigneeName, size: 20 }) : /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] text-text-tertiary", children: "Atanmadı" }),
                      /* @__PURE__ */ e.jsx(
                        "select",
                        {
                          "aria-label": `${u.title} durumunu değiştir`,
                          value: u.status,
                          onClick: (h) => h.stopPropagation(),
                          onChange: (h) => d(u.id, Number(h.target.value)),
                          disabled: !y,
                          className: `h-[24px] px-1.5 rounded-[6px] border border-subtle bg-surface-base text-[10.5px] text-text-secondary ${y ? "cursor-pointer" : "cursor-default"}`,
                          children: Jt.map((h) => /* @__PURE__ */ e.jsx("option", { value: h, children: be(h).label }, h))
                        }
                      )
                    ] })
                  ]
                },
                u.id
              );
            })
          ]
        },
        f
      );
    }) })
  );
}
const Mr = [
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
], Kr = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], ia = (t) => String(t).padStart(2, "0"), Oa = (t, a, s) => `${t}-${ia(a + 1)}-${ia(s)}`;
function Dt(t) {
  if (!t) return null;
  const a = /^(\d{4}-\d{2}-\d{2})/.exec(String(t));
  return a ? a[1] : null;
}
function Rr(t, a) {
  const r = (new Date(t, a, 1).getDay() + 6) % 7, l = new Date(t, a + 1, 0).getDate(), o = [];
  for (let n = 0; n < 42; n++) {
    const i = n - r + 1;
    o.push(i >= 1 && i <= l ? { key: Oa(t, a, i), day: i, inMonth: !0 } : { key: `bos-${n}`, day: null, inMonth: !1 });
  }
  return o;
}
function qr(t) {
  const a = /* @__PURE__ */ new Map(), s = (r, l) => {
    const o = Dt(r);
    o && (a.has(o) || a.set(o, []), a.get(o).push(l));
  };
  s(t == null ? void 0 : t.startDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "start", isSelf: !0, status: t == null ? void 0 : t.status }), s(t == null ? void 0 : t.dueDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "due", isSelf: !0, status: t == null ? void 0 : t.status });
  for (const r of (t == null ? void 0 : t.subTasks) ?? [])
    s(r.startDate, { id: r.id, title: r.title, kind: "start", isSelf: !1, status: r.status }), s(r.dueDate, { id: r.id, title: r.title, kind: "due", isSelf: !1, status: r.status });
  return a;
}
function Gr({ task: t = {}, onOpenSubtask: a }) {
  const s = b.useMemo(() => qr(t), [t]), [r, l] = b.useState(() => {
    const d = Dt(t == null ? void 0 : t.startDate) ?? Dt(t == null ? void 0 : t.dueDate);
    if (d) {
      const [x, p] = d.split("-").map(Number);
      return { year: x, month: p - 1 };
    }
    const f = /* @__PURE__ */ new Date();
    return { year: f.getFullYear(), month: f.getMonth() };
  }), o = b.useMemo(() => Rr(r.year, r.month), [r.year, r.month]), n = (d) => l(({ year: f, month: x }) => {
    const p = x + d;
    return { year: f + Math.floor(p / 12), month: (p % 12 + 12) % 12 };
  }), i = /* @__PURE__ */ new Date(), m = Oa(i.getFullYear(), i.getMonth(), i.getDate());
  return s.size === 0 ? /* @__PURE__ */ e.jsx(
    pe,
    {
      icon: "fa-calendar",
      title: "Takvimde gösterilecek tarih yok",
      description: "Göreve başlangıç veya termin tarihi girildiğinde burada aylık takvimde görünür."
    }
  ) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-3.5 py-3 border-b border-subtle bg-surface-raised", children: [
      /* @__PURE__ */ e.jsxs("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: [
        Mr[r.month],
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
            onClick: () => l({ year: i.getFullYear(), month: i.getMonth() }),
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-subtle bg-surface-raised", children: Kr.map((d) => /* @__PURE__ */ e.jsx("span", { className: "px-2 py-1.5 text-center text-[11px] font-bold text-text-tertiary", children: d }, d)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: o.map((d) => {
      const f = d.inMonth ? s.get(d.key) ?? [] : [], x = d.key === m;
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: `flex flex-col gap-1 min-h-[76px] p-1.5 border-r border-b border-subtle last-of-type:border-r-0 ${d.inMonth ? "" : "bg-surface-sunken"}`,
          children: [
            d.inMonth && /* @__PURE__ */ e.jsx("span", { className: `self-end font-mono text-[11px] font-bold ${x ? "flex items-center justify-center h-[18px] w-[18px] rounded-full bg-primary text-white" : "text-text-tertiary"}`, children: d.day }),
            f.map((p, c) => {
              const u = be(p.status);
              return /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  title: `${p.title} — ${p.kind === "due" ? "termin" : "başlangıç"}`,
                  onClick: () => {
                    p.isSelf || a == null || a(p.id);
                  },
                  className: `flex items-center gap-1 w-full px-1.5 py-[3px] rounded-[6px] text-left text-[10.5px] font-semibold ${u.bg} ${u.fg} ${p.isSelf ? "cursor-default" : "cursor-pointer hover:brightness-95"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${p.kind === "due" ? "fa-flag-checkered" : "fa-play"} text-[8px] shrink-0` }),
                    /* @__PURE__ */ e.jsx("span", { className: "truncate", children: p.title })
                  ]
                },
                `${p.id}-${p.kind}-${c}`
              );
            })
          ]
        },
        d.key
      );
    }) })
  ] });
}
function Ve() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Yr(t) {
  const a = Ve();
  return a ? Promise.resolve(a.getDocuments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function _r(t) {
  const a = ne(), s = ["task-documents", t], r = te({
    queryKey: s,
    queryFn: () => Yr(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = se({
    mutationFn: (m) => Promise.resolve(Ve().createDocument(t, m)),
    onSuccess: l
  }), n = se({
    mutationFn: ({ id: m, title: d, content: f }) => Promise.resolve(Ve().updateDocument(m, { title: d, content: f })),
    onSuccess: (m) => {
      l(), m != null && m.id && a.setQueryData(["task-document", m.id], m);
    }
  }), i = se({
    mutationFn: (m) => Promise.resolve(Ve().deleteDocument(m)),
    onSuccess: l
  });
  return {
    documents: r.data ?? [],
    isLoading: r.isLoading,
    createDocument: o.mutateAsync,
    updateDocument: n.mutateAsync,
    removeDocument: i.mutateAsync,
    isSaving: n.isPending
  };
}
function Ur(t) {
  return te({
    queryKey: ["task-document", t],
    queryFn: () => Promise.resolve(Ve().getDocument(t)),
    enabled: !!t,
    /* Kayıt tam değiştirir (updateDocument {id,title,content}); bayat gövdeden
       kaydetmek başka ekranda yapılan değişikliği ezer. */
    meta: { persist: !1 },
    retry: !1
  });
}
function Vr({ taskId: t }) {
  const { documents: a, isLoading: s, createDocument: r, updateDocument: l, removeDocument: o, isSaving: n } = _r(t), [i, m] = b.useState(null), [d, f] = b.useState(""), [x, p] = b.useState(""), [c, u] = b.useState(!1), [g, y] = b.useState(!1), { data: h, isFetching: w } = Ur(i);
  b.useEffect(() => {
    !h || h.id !== i || (f(h.title ?? ""), p(h.content ?? ""), u(!1));
  }, [h == null ? void 0 : h.id]);
  const C = async () => {
    try {
      const P = await r("Yeni belge");
      P != null && P.id && m(P.id);
    } catch (P) {
      S(P, "Belge oluşturulamadı.");
    }
  }, A = async () => {
    var Q, Y, _, B, K, U;
    const P = d.trim();
    if (!P)
      return (_ = (Y = (Q = window == null ? void 0 : window.abp) == null ? void 0 : Q.notify) == null ? void 0 : Y.error) == null || _.call(Y, "Belge başlığı boş olamaz."), !1;
    try {
      return await l({ id: i, title: P, content: x }), u(!1), (U = (K = (B = window == null ? void 0 : window.abp) == null ? void 0 : B.notify) == null ? void 0 : K.success) == null || U.call(K, "Belge kaydedildi."), !0;
    } catch (H) {
      return S(H, "Belge kaydedilemedi."), !1;
    }
  }, E = async (P, Q) => {
    try {
      await o(P), i === P && m(null);
    } catch (Y) {
      S(Y, `“${Q}” silinemedi.`);
    }
  }, G = () => {
    if (c) {
      y(!0);
      return;
    }
    m(null);
  };
  return i ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: G,
          "aria-label": "Belge listesine dön",
          className: "flex items-center justify-center h-8 w-8 rounded-[9px] border border-subtle bg-surface-base text-text-tertiary hover:text-text-primary cursor-pointer",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-left text-[12px]" })
        }
      ),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: d,
          "aria-label": "Belge başlığı",
          onChange: (P) => {
            f(P.target.value), u(!0);
          },
          className: "flex-1 min-w-0 h-9 px-3 rounded-[10px] border border-subtle bg-surface-base text-[13.5px] font-bold text-text-primary focus:border-focus focus:shadow-focus focus:outline-none"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: A,
          disabled: n || !c,
          className: `flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[12.5px] font-bold ${n || !c ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n ? "fa-circle-notch fa-spin" : "fa-floppy-disk"} text-[11px]` }),
            n ? "Kaydediliyor…" : c ? "Kaydet" : "Kaydedildi"
          ]
        }
      )
    ] }),
    w && !h ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Belge yükleniyor…" }) : /* @__PURE__ */ e.jsx(
      Ea,
      {
        value: x,
        placeholder: "Belgeyi buraya yazın…",
        onChange: (P) => {
          p(P), u(!0);
        }
      }
    ),
    /* @__PURE__ */ e.jsx(
      $t,
      {
        open: g,
        isSaving: n,
        onStay: () => y(!1),
        onDiscard: () => {
          y(!1), u(!1), m(null);
        },
        onSave: async () => {
          const P = await A();
          y(!1), P && m(null);
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
          onClick: C,
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
      pe,
      {
        icon: "fa-file-lines",
        title: "Henüz belge yok",
        description: "Toplantı notu, teknik şartname ya da teslim tutanağı gibi metinleri buraya yazabilirsiniz."
      }
    ),
    a.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: a.map((P) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "group flex items-center gap-3 px-3.5 py-3 border-b border-subtle last:border-b-0 hover:bg-surface-raised",
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[14px]" }) }),
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => m(P.id),
              className: "flex-1 min-w-0 bg-transparent border-0 p-0 text-left cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[13px] font-bold text-text-primary", children: P.title }),
                /* @__PURE__ */ e.jsx("span", { className: "block text-[11.5px] text-text-tertiary", children: P.contentLength > 0 ? `${P.editorName} · ${ot(P.lastModificationTime ?? P.creationTime)}` : "Boş belge — açıp yazmaya başlayın" })
              ]
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              "aria-label": `${P.title} belgesini sil`,
              onClick: () => E(P.id, P.title),
              className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[12px]" })
            }
          )
        ]
      },
      P.id
    )) })
  ] });
}
function Le() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Or(t) {
  const a = Le();
  return a ? Promise.resolve(a.getLinkedForms(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Qr(t) {
  const a = ne(), s = ["task-forms", t], r = te({
    queryKey: s,
    queryFn: () => Or(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = se({
    mutationFn: (m) => Promise.resolve(Le().linkForm(t, m)),
    onSuccess: l
  }), n = se({
    mutationFn: (m) => Promise.resolve(Le().unlinkForm(m)),
    onSuccess: l
  }), i = se({
    mutationFn: ({ linkId: m, value: d }) => Promise.resolve(Le().setFormGuestFillable(m, d)),
    onSuccess: l
  });
  return {
    forms: r.data ?? [],
    isLoading: r.isLoading,
    linkForm: o.mutateAsync,
    unlinkForm: n.mutateAsync,
    setGuestFillable: i.mutateAsync,
    isLinking: o.isPending
  };
}
function Hr(t, a) {
  return te({
    queryKey: ["task-form-options", t],
    queryFn: () => Promise.resolve(Le().getFormOptions(t)),
    enabled: !!t && !!a,
    meta: { persist: !1 },
    retry: !1
  });
}
function Jr(t, a) {
  return te({
    queryKey: ["task-form-responses", t, a],
    queryFn: () => Promise.resolve(Le().getFormResponses(t, a)),
    enabled: !!t && !!a,
    meta: { persist: !1 },
    retry: !1
  });
}
function Wr({ taskId: t, documentId: a }) {
  const { data: s, isLoading: r } = Jr(t, a);
  return r ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Yanıtlar yükleniyor…" }) : s != null && s.length ? /* @__PURE__ */ e.jsx("ul", { className: "m-0 list-none p-0", children: s.map((l) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-3 px-3.5 py-2 border-t border-subtle", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l.isGuestSubmission ? "fa-user-clock" : "fa-user"} text-[10px] text-text-tertiary` }),
      /* @__PURE__ */ e.jsx("span", { className: "truncate text-[12.5px] text-text-primary", children: l.respondentName }),
      l.isGuestSubmission && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: "· dış" })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary", children: ot(l.creationTime) })
  ] }, l.id)) }) : /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Bu görevde henüz yanıt yok." });
}
function Zr({ taskId: t }) {
  const { forms: a, isLoading: s, linkForm: r, unlinkForm: l, setGuestFillable: o, isLinking: n } = Qr(t), [i, m] = b.useState(!1), [d, f] = b.useState(null), { data: x, isLoading: p } = Hr(t, i), c = oe("Platform.Tasks.ShareExternally"), u = async (h) => {
    try {
      await r(h), m(!1);
    } catch (w) {
      S(w, "Form bağlanamadı.");
    }
  }, g = async (h) => {
    if (window.confirm(`“${h.title}” bağlantısı kaldırılsın mı? Form ve toplanmış yanıtlar silinmez.`))
      try {
        await l(h.id);
      } catch (w) {
        S(w, "Bağlantı kaldırılamadı.");
      }
  }, y = async (h, w) => {
    try {
      await o({ linkId: h.id, value: w });
    } catch (C) {
      S(C, "Ayar değiştirilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Formlar" }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => m((h) => !h),
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
      !p && !(x != null && x.length) && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Bağlanabilecek form yok. Önce Form Yönetimi'nden bir form oluşturun." }),
      x == null ? void 0 : x.map((h) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          disabled: h.isLinked || n,
          onClick: () => u(h.documentId),
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
      pe,
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
            onClick: () => f((w) => w === h.documentId ? null : h.documentId),
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
        h.responseCount > 0 && /* @__PURE__ */ e.jsx(Ga, { children: h.responseCount }),
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
            onClick: () => g(h),
            className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[12px]" })
          }
        )
      ] }),
      c && h.isPublished && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 px-3.5 pb-3 text-[11.5px] text-text-secondary cursor-pointer", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: !!h.isGuestFillable,
            onChange: (w) => y(h, w.target.checked)
          }
        ),
        "Süreli paylaşım linkiyle ekip dışından da doldurulabilsin"
      ] }),
      d === h.documentId && /* @__PURE__ */ e.jsx(Wr, { taskId: t, documentId: h.documentId })
    ] }, h.id))
  ] });
}
const Xr = {
  0: "bg-neutral-400",
  1: "bg-text-tertiary",
  2: "bg-warning",
  3: "bg-primary",
  4: "bg-success"
};
function ht(t) {
  if (!t) return null;
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? null : a;
}
const Ge = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
function en({ task: t = {} }) {
  const a = b.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((n, i) => ({
    id: n.id || `row-${i}`,
    name: n.title || "Başlıksız görev",
    isMain: !!n.__main,
    start: ht(n.startDate),
    end: ht(n.dueDate) || ht(n.completedDate),
    status: n.status ?? 1
  })), [t]), { min: s, span: r } = b.useMemo(() => {
    const o = a.flatMap((m) => [m.start, m.end]).filter(Boolean).map((m) => m.getTime());
    if (o.length === 0) return { min: null, span: 0 };
    const n = Math.min(...o), i = Math.max(...o);
    return { min: n, span: Math.max(1, i - n) };
  }, [a]), l = b.useMemo(() => s === null ? [] : [0, 1, 2, 3].map((o) => new Date(s + r * o / 4)), [s, r]);
  return s === null ? /* @__PURE__ */ e.jsx("div", { className: Se, children: /* @__PURE__ */ e.jsx(
    pe,
    {
      icon: "fa-bars-staggered",
      title: "Zaman çizelgesi çizilemiyor",
      description: "Görevde veya alt görevlerde başlangıç–bitiş tarihi tanımlı olmalı."
    }
  ) }) : /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Zaman çizelgesi" }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] text-text-tertiary", children: [
        Ge(new Date(s)),
        " – ",
        Ge(new Date(s + r))
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-4 gap-0 pl-[170px] mb-2 lt-860:pl-[110px]", children: l.map((o, n) => /* @__PURE__ */ e.jsx(
      "span",
      {
        className: "pl-2 border-l border-subtle text-[10.5px] font-bold uppercase tracking-[.06em] text-text-tertiary",
        children: Ge(o)
      },
      n
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: a.map((o) => {
      const n = o.start ? o.start.getTime() : s, i = o.end ? Math.max(o.end.getTime(), n) : n, m = (n - s) / r * 100, d = Math.max(2, (i - n) / r * 100), f = Math.max(1, Math.round((i - n) / 864e5));
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
            className: `absolute top-[7px] bottom-[7px] flex items-center px-2.5 rounded-[7px] shadow-xs ${Xr[o.status] || "bg-primary"}`,
            style: { left: `${m}%`, width: `${d}%` },
            title: `${Ge(o.start)} – ${Ge(o.end)}`,
            children: /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[10.5px] font-bold text-white", children: [
              f,
              "g"
            ] })
          }
        ) })
      ] }, o.id);
    }) })
  ] });
}
function Qa(t, a = {}) {
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
function la({ icon: t, iconTone: a, title: s, note: r, children: l }) {
  return /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[12px] ${a}` }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: s }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
    ] }),
    l
  ] });
}
function tn({ task: t = {}, readOnly: a = !1 }) {
  const s = ne(), r = t.predecessorIds || [], l = () => {
    var d, f, x;
    return (x = (f = (d = window == null ? void 0 : window.apya) == null ? void 0 : d.platform) == null ? void 0 : f.tasks) == null ? void 0 : x.task;
  }, { data: o = [], isLoading: n } = te({
    queryKey: ["task-predecessors", t.id, r],
    queryFn: async () => {
      const d = l();
      return d ? Promise.all(
        r.map(
          (f) => Promise.resolve(d.get(f)).catch(() => ({ id: f, title: "(erişilemeyen görev)", status: null, code: "—" }))
        )
      ) : [];
    },
    enabled: r.length > 0,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), i = async (d) => {
    var f, x, p;
    try {
      await Promise.resolve(l().update(t.id, Qa(t, {
        predecessorIds: r.filter((c) => c !== d)
      }))), await s.invalidateQueries({ queryKey: ["task-detail", t.id] }), (p = (x = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : x.info) == null || p.call(x, "Bağlantı kaldırıldı.");
    } catch (c) {
      S(c, "Bağlantı kaldırılamadı.");
    }
  }, m = (d) => {
    var f, x, p;
    return (p = (x = (f = window == null ? void 0 : window.apya) == null ? void 0 : f.taskDetail) == null ? void 0 : x.open) == null ? void 0 : p.call(x, d);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsx(
      la,
      {
        icon: "fa-arrow-left-long",
        iconTone: "text-warning",
        title: "Öncül görevler",
        note: "bu görev başlamadan tamamlanmalı",
        children: r.length === 0 ? /* @__PURE__ */ e.jsx(pe, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : n ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : o.map((d) => {
          const f = d.status == null ? null : be(d.status);
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
                    onClick: () => m(d.id),
                    className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                    children: d.title || "Başlıksız görev"
                  }
                ),
                f && /* @__PURE__ */ e.jsx(Ee, { bg: f.bg, fg: f.fg, children: f.label }),
                !a && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Bağlantıyı kaldır",
                    "aria-label": `${d.title} bağlantısını kaldır`,
                    onClick: () => i(d.id),
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
      la,
      {
        icon: "fa-arrow-right-long",
        iconTone: "text-primary",
        title: "Ardıl görevler",
        note: "bu görev bitince başlar",
        children: /* @__PURE__ */ e.jsx(
          pe,
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
function Ae() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task) || null;
}
function an(t) {
  const a = ne(), s = ["task-timelogs", t], r = ["task-active-timelog"], l = te({
    queryKey: s,
    queryFn: () => {
      var d;
      return Promise.resolve((d = Ae()) == null ? void 0 : d.getTimeLogs(t));
    },
    enabled: !!t && !!Ae(),
    staleTime: 15e3,
    meta: { persist: !1 },
    retry: !1
  }), o = te({
    queryKey: r,
    /* Kayıt yokken uç 204 döner, proxy undefined çözer; TanStack v5 undefined'ı
       hata sayıp önceki çalışan kaydı ekranda bırakır (sayaç durmazdı). */
    queryFn: () => {
      var d;
      return Promise.resolve((d = Ae()) == null ? void 0 : d.getActiveTimeLog()).then((f) => f ?? null);
    },
    enabled: !!Ae(),
    staleTime: 5e3,
    /* Canlı sayaç kanbandan da başlatılıp durduruluyor; açılışlar arasında taşınmaz. */
    meta: { persist: !1 },
    retry: !1
  }), n = () => {
    a.invalidateQueries({ queryKey: s }), a.invalidateQueries({ queryKey: r });
  }, i = se({
    mutationFn: () => {
      var d;
      return Promise.resolve((d = Ae()) == null ? void 0 : d.startTimeTracking(t));
    },
    onSuccess: n
  }), m = se({
    mutationFn: () => {
      var d;
      return Promise.resolve((d = Ae()) == null ? void 0 : d.stopTimeTracking(t));
    },
    onSuccess: n
  });
  return {
    logs: l.data ?? [],
    isLoading: l.isLoading,
    activeLog: o.data ?? null,
    start: i.mutateAsync,
    stop: m.mutateAsync,
    isMutating: i.isPending || m.isPending
  };
}
function oa(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function sn({ taskId: t, task: a = {} }) {
  const s = an(t), r = s.activeLog && s.activeLog.taskId === t ? s.activeLog : null, [l, o] = b.useState(() => Date.now());
  b.useEffect(() => {
    if (!r) return;
    const u = setInterval(() => o(Date.now()), 1e3);
    return () => clearInterval(u);
  }, [r]);
  const n = r ? Math.max(0, Math.floor((l - new Date(r.startTime).getTime()) / 1e3)) : 0, m = s.logs.reduce((u, g) => u + (g.secondsSpent || 0), 0) + n, d = (a == null ? void 0 : a.estimatedHours) ?? null, f = d ? d * 3600 : 0, x = f ? Math.min(100, Math.round(m / f * 100)) : 0, p = f ? Math.max(0, f - m) : 0, c = async () => {
    try {
      r ? await s.stop() : await s.start();
    } catch (u) {
      S(u, "Zaman takibi güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-5 flex-wrap p-[22px] rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[18px]", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: c,
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
              children: ar(m)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary", children: r ? "Kayıt sürüyor" : "Sayaç duraklatıldı" })
        ] })
      ] }),
      f > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] font-bold text-text-secondary", children: "Tahmin kullanımı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
            pt(m),
            " / ",
            d,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-warning", style: { width: `${x}%` } }) }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "Kalan tahmini süre: ",
          pt(p)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
      /* @__PURE__ */ e.jsx(Qe, { title: "Zaman kayıtları" }),
      s.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : s.logs.length === 0 ? /* @__PURE__ */ e.jsx(
        pe,
        {
          icon: "fa-stopwatch",
          title: "Henüz zaman kaydı yok",
          description: "Soldaki yeşil düğmeyle sayacı çalıştırın; durdurduğunuzda kayıt buraya düşer."
        }
      ) : s.logs.map((u) => {
        const g = !u.endTime;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
            children: [
              /* @__PURE__ */ e.jsx(ut, { name: u.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: u.note || u.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                oa(u.startTime),
                " → ",
                g ? "sürüyor" : oa(u.endTime)
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary", children: g ? "Aktif" : pt(u.secondsSpent || 0) })
            ]
          },
          u.id
        );
      })
    ] })
  ] });
}
const We = [
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
    component: sr,
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
    component: ir,
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
    component: zr,
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
    component: Lr,
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
    component: Gr,
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
    component: or,
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
    component: en,
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
    component: tn,
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
    component: Br,
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
    component: fr,
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
    component: pr,
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
    component: cr,
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
    component: ur,
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
    component: sn,
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
    component: Vr,
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
    component: Zr,
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
    component: Ir,
    surfaces: ["task", "project", "tasks"]
  }
];
function Ha(t = []) {
  const a = new Set(t);
  return We.filter((s) => !s.hidden).filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function Ja(t = []) {
  const a = new Set(t);
  return We.filter((s) => !s.hidden).filter((s) => !s.isCore).filter((s) => !s.permission || oe(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let tt = null;
const it = /* @__PURE__ */ new Set(), yt = /* @__PURE__ */ new Set();
let at = !1;
function ca() {
  it.forEach((t) => t());
}
function rn(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const W = {
  open(t) {
    const a = rn(t);
    a && (tt = a, ca());
  },
  close() {
    tt = null, ca();
  },
  subscribe(t) {
    return it.add(t), () => it.delete(t);
  },
  getSnapshot() {
    return tt;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && yt.add(t);
  },
  emitResult() {
    at = !1, yt.forEach((t) => t());
  },
  /** Adada bir yazma oldu ya da başladı — kapanışta liste/kanban tazelensin. */
  markChanged() {
    at = !0;
  },
  /** Yalnız yazma olduysa sonuç yayınlar: salt bakıp kapatmak sayfayı yeniden yüklemez.
      'this' kullanılmaz; metot referansla da geçirilebilir. */
  emitResultIfChanged() {
    at && W.emitResult();
  },
  /** Yalnız testler için. */
  reset() {
    tt = null, at = !1, it.clear(), yt.clear();
  }
}, da = "apya.taskDetail.fullscreen";
function Wa({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, l] = b.useState(t), [o, n] = b.useState([]), { data: i, isPending: m, isError: d, refetch: f } = Et(r), x = $a(), p = Ma(i), c = Ka(), u = Ra(r), [g, y] = b.useState("general"), [h, w] = b.useState(!1), C = _e.useRef(null), A = b.useMemo(
    () => Ha(u.assignedCodes),
    [u.assignedCodes]
  ), E = b.useMemo(
    () => Ja(u.assignedCodes),
    [u.assignedCodes]
  ), G = A.find((F) => F.code === g) ?? A[0];
  _e.useEffect(() => {
    G.code !== g && y(G.code);
  }, [G, g]);
  const P = G == null ? void 0 : G.component, Q = ne(), [Y, _] = b.useState(
    () => {
      var F;
      return ((F = window.localStorage) == null ? void 0 : F.getItem(da)) === "1";
    }
  ), [B, K] = b.useState(!1), [U, H] = b.useState(!1), V = b.useCallback(() => {
    It(), s == null || s();
  }, [s]);
  za(a === "page" ? null : t, V), _e.useEffect(() => {
    p.isDirty ? x.markDirty() : x.markClean();
  });
  const ee = b.useCallback(() => {
    B || (H(!1), x.requestClose(V));
  }, [x, V, B]), Z = b.useCallback(() => {
    _((F) => {
      var ae;
      const q = !F;
      return (ae = window.localStorage) == null || ae.setItem(da, q ? "1" : "0"), q;
    });
  }, []), D = oe("Platform.Tasks.Delete"), [z, v] = b.useState(!1), [L, M] = b.useState(!1), le = b.useCallback(async () => {
    var F, q, ae;
    M(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (ae = (q = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : q.info) == null || ae.call(q, "Başarıyla silindi."), v(!1), x.markClean(), V();
    } catch (he) {
      S(he, "Görev silinemedi.");
    } finally {
      M(!1);
    }
  }, [r, x, V]), ie = b.useCallback(async () => {
    var F, q, ae;
    if (!p.validate()) return !1;
    K(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, p.toUpdateDto())
      ), await Q.invalidateQueries({ queryKey: ["task-detail", r] }), W.emitResult(), (ae = (q = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : q.success) == null || ae.call(q, "Kaydedildi."), !0;
    } catch (he) {
      return S(he, "Kaydedilemedi."), !1;
    } finally {
      K(!1);
    }
  }, [r, p, x, Q]), X = b.useCallback(() => {
    ie();
  }, [ie]), ue = b.useCallback(async () => {
    if (H(!1), !p.validate()) {
      x.resolvePendingClose("stay"), y("general");
      return;
    }
    await ie() ? x.resolvePendingClose("saved") : H(!0);
  }, [x, p, ie]), $ = b.useCallback((F, q) => {
    x.requestClose(() => {
      n((ae) => [...ae, { id: r, title: (i == null ? void 0 : i.title) ?? "" }]), l(F), y("general"), x.markClean();
    });
  }, [x, r, i]), J = b.useCallback((F) => {
    x.requestClose(() => {
      n((q) => {
        const ae = q.findIndex((he) => he.id === F);
        return ae === -1 ? q : q.slice(0, ae);
      }), l(F), y("general"), x.markClean();
    });
  }, [x]), N = b.useCallback(async (F) => {
    try {
      await u.addFeature(F), y(F), w(!1);
    } catch (q) {
      S(q, "Özellik eklenemedi.");
    }
  }, [u]), R = b.useCallback(async (F) => {
    try {
      await u.removeFeature(F), y((q) => q === F ? "general" : q);
    } catch (q) {
      S(q, "Özellik kaldırılamadı.");
    }
  }, [u]);
  _e.useEffect(() => {
    if (!h) return;
    const F = (ae) => {
      C.current && !C.current.contains(ae.target) && w(!1);
    }, q = (ae) => {
      ae.key === "Escape" && w(!1);
    };
    return document.addEventListener("mousedown", F), document.addEventListener("keydown", q), () => {
      document.removeEventListener("mousedown", F), document.removeEventListener("keydown", q);
    };
  }, [h]);
  const k = m ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(we, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(we, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(we, { className: "h-24 w-full" })
  ] }) : d && !i ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(re, { variant: "ghost", onClick: () => f(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      Js,
      {
        trail: o,
        current: { id: r, title: (i == null ? void 0 : i.title) ?? "" },
        onNavigate: J
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: C, children: [
      /* @__PURE__ */ e.jsx(
        Os,
        {
          tabs: A,
          activeCode: G.code,
          onSelect: (F) => {
            y(F), w(!1);
          },
          onOpenPicker: () => w((F) => !F),
          pickerOpen: h
        }
      ),
      h && /* @__PURE__ */ e.jsx(
        Hs,
        {
          entries: E,
          busyCode: u.isMutating ? u.mutatingCode : null,
          onAdd: N,
          onRemove: R
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${G.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          G.code === "general" ? /* @__PURE__ */ e.jsx(
            Ys,
            {
              values: p.values,
              errors: p.errors,
              onFieldChange: p.setField,
              assigneeOptions: c.options,
              isLoadingAssignees: c.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(b.Suspense, { fallback: /* @__PURE__ */ e.jsx(we, { className: "h-24 w-full" }), children: P && /* @__PURE__ */ e.jsx(
            P,
            {
              taskId: r,
              task: i,
              form: p,
              onOpenSubtask: $
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            _s,
            {
              task: i,
              creatorName: c.nameById.get(i.creatorId),
              lastModifierName: c.nameById.get(i.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), O = a === "page" ? zs : As;
  return /* @__PURE__ */ e.jsxs(
    O,
    {
      open: !0,
      fullscreen: Y,
      onRequestClose: ee,
      title: i ? `Görev Detayı: ${i.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        Ms,
        {
          task: i ?? { title: "Yükleniyor…" },
          canDelete: D,
          fullscreen: Y,
          onToggleFullscreen: Z,
          onClose: ee,
          onDelete: () => v(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        Rs,
        {
          lastSavedAt: i == null ? void 0 : i.lastModificationTime,
          isDirty: x.isDirty,
          isSaving: B,
          onCancel: ee,
          onSave: X
        }
      ),
      children: [
        k,
        /* @__PURE__ */ e.jsx(
          $t,
          {
            open: x.pendingClose,
            isSaving: B,
            errorText: U ? de("Common:Unsaved:SaveFailed", "Kaydedilemedi. Düzenlemeye dönebilir ya da değişiklikleri atabilirsiniz.") : void 0,
            onStay: () => {
              H(!1), x.resolvePendingClose("stay");
            },
            onDiscard: () => {
              H(!1), p.reset(), x.resolvePendingClose("discard");
            },
            onSave: ue
          }
        ),
        z && /* @__PURE__ */ e.jsx(
          nn,
          {
            taskTitle: (i == null ? void 0 : i.title) ?? "",
            busy: L,
            onCancel: () => v(!1),
            onConfirm: le
          }
        )
      ]
    }
  );
}
function nn({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [l, o] = b.useState(""), n = l.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    ln,
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
        /* @__PURE__ */ e.jsx(re, { variant: "secondary", onClick: s, disabled: a, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          re,
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
            value: l,
            onChange: (i) => o(i.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function ln({ label: t, title: a, description: s, children: r, actions: l }) {
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
const on = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function cn({ isPrivate: t = !1, onChange: a = () => {
}, disabled: s = !1 }) {
  const r = !!t, [l, o] = b.useState(null);
  return /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
    /* @__PURE__ */ e.jsx(De, { container: Pe(l), children: /* @__PURE__ */ e.jsxs(
      Te,
      {
        sideOffset: 8,
        align: "end",
        className: "z-50 w-[360px] rounded-2xl border border-subtle bg-surface-base p-4 shadow-float animate-in fade-in-50 zoom-in-95",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle pb-3 mb-3", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shield-halved text-primary text-base" }),
            /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary", children: "Görünürlük" })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: on.map((n) => {
            const i = r === n.value;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => a(n.value),
                className: `flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${i ? "border-primary bg-primary-subtle/40" : "border-subtle hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n.icon} text-base mt-0.5 ${i ? "text-primary" : "text-text-tertiary"}` }),
                  /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ e.jsx("h4", { className: "text-[13px] font-semibold text-text-primary", children: n.title }),
                      i && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ] }),
                    /* @__PURE__ */ e.jsx("p", { className: "text-[12px] text-text-tertiary mt-0.5", children: n.desc })
                  ] })
                ]
              },
              String(n.value)
            );
          }) }),
          /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-text-tertiary mt-3", children: "Değişiklik “Kaydet” ile uygulanır." }),
          /* @__PURE__ */ e.jsx(Ss, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const xa = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto", dn = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", xn = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" },
  { what: "Bağlantı kopyala", key: "⌘ L" }
];
function un({ children: t }) {
  return /* @__PURE__ */ e.jsx(Pt, { asChild: !0, children: t });
}
function pn({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "inline-flex items-center h-[19px] px-1.5 rounded-[5px] border border-default border-b-2 bg-neutral-subtle font-mono text-[10px] font-semibold text-text-secondary", children: t });
}
function mn({
  task: t = {},
  presentation: a = "modal",
  onClose: s,
  isFullscreen: r,
  onToggleFullscreen: l,
  onFieldChange: o = () => {
  },
  statusValue: n,
  /* Projenin kanban kolonları (useBoardColumns): özel kolon da bir durum seçeneğidir. */
  boardColumns: i,
  boardColumnValue: m,
  titleValue: d,
  /* Doğrulama hatası (useTaskForm.errors.title): başlığın altında gösterilir. */
  titleError: f,
  isPrivateValue: x,
  isFavorite: p,
  onToggleFavorite: c,
  isWatched: u,
  onToggleWatch: g,
  onDuplicate: y,
  onArchive: h,
  onDelete: w,
  onOpenTransfer: C,
  onExportPdf: A,
  /* Yetki (root hesaplar; sunucudaki EnsureCanMutateTaskAsync ile aynı kural). Eskiden
     menü ve alanlar herkese açıktı, yetkisiz kullanıcı tıklayınca 403 alıyordu. */
  canEdit: E = !0,
  canChangeStatus: G = !0,
  canDelete: P = !0
}) {
  const [Q, Y] = b.useState(!1), [_, B] = b.useState(null), [K, U] = b.useState(!1), H = b.useRef(null), V = b.useId(), ee = Pe(_), Z = n ?? t.status, D = Ba(i), z = Ia(
    D,
    Z,
    m === void 0 ? t.boardColumnId : m
  ), v = { ...be(Z), ...z ? { label: z.label } : {} }, L = ($) => {
    o("status", $.status), o("boardColumnId", $.boardColumnId);
  }, M = t.code || "GRV-—", le = () => {
    var $;
    ($ = navigator.clipboard) == null || $.writeText(M), Y(!0), setTimeout(() => Y(!1), 1800);
  }, ie = () => {
    var $, J, N, R;
    ($ = navigator.clipboard) == null || $.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), (R = (N = (J = window == null ? void 0 : window.abp) == null ? void 0 : J.notify) == null ? void 0 : N.success) == null || R.call(N, "Görev bağlantısı panoya kopyalandı.");
  }, X = ($) => () => {
    U(!1), $ == null || $();
  }, ue = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", kbd: "⌘L", onClick: X(ie) },
    { label: "Çoğalt", icon: "fa-copy", kbd: "⌘D", allowed: E, onClick: X(y) },
    { label: "Başka projeye kopyala", icon: "fa-clone", allowed: E, onClick: X(() => C == null ? void 0 : C("copy")) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, allowed: E, onClick: X(() => C == null ? void 0 : C("move")) },
    { label: u ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: X(g) },
    { label: "Arşivle", icon: "fa-box-archive", separator: !0, allowed: G, onClick: X(h) },
    { label: "Yazdır", icon: "fa-print", kbd: "⌘P", onClick: X(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: X(A) },
    { label: "Sil", icon: "fa-trash-can", kbd: "⌫", separator: !0, danger: !0, allowed: P, onClick: X(w) }
  ].filter(($) => $.allowed !== !1);
  return /* @__PURE__ */ e.jsxs("header", { ref: B, className: "shrink-0 px-6 lt-860:px-4 pt-[18px] pb-4 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: le,
            title: "Kodu kopyala",
            className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[11px] font-bold tracking-[.04em] cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[9px] opacity-70" }),
              /* @__PURE__ */ e.jsx("span", { children: M }),
              /* @__PURE__ */ e.jsx("i", { className: `${Q ? "fa-solid fa-check" : "fa-regular fa-copy"} text-[9px] opacity-60` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              disabled: !E,
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] border border-default text-[12px] font-semibold ${E ? "cursor-pointer" : "cursor-default"} ${v.bg} ${v.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-current animate-pulse" }),
                /* @__PURE__ */ e.jsx("span", { children: v.label }),
                E && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: ee, children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${xa} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            D.map(($) => {
              const J = (z == null ? void 0 : z.key) === $.key;
              return /* @__PURE__ */ e.jsx(un, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => L($),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${J ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${$.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: $.label }),
                    J && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, $.key);
            })
          ] }) })
        ] }),
        u && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 h-[26px] px-2.5 rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11.5px] font-semibold", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-eye text-[10px]" }),
          "Takip ediliyor"
        ] }),
        !E && /* @__PURE__ */ e.jsxs(
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
          cn,
          {
            isPrivate: x ?? !!t.isPrivate,
            onChange: ($) => o("isPrivate", $),
            disabled: !E
          }
        ) }),
        /* @__PURE__ */ e.jsx("div", { className: "h-5 w-px bg-border-default mx-1" }),
        a === "modal" && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: l,
            title: r ? "Küçült" : "Tam ekran",
            className: `mobile:hidden flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${r ? "bg-primary-subtle text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r ? "fa-compress" : "fa-expand"} text-[12px]` })
          }
        ),
        /* @__PURE__ */ e.jsxs(ke, { modal: !0, open: K, onOpenChange: U, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer seçenekler",
              className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${K ? "bg-surface-hover text-text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: ee, children: /* @__PURE__ */ e.jsxs(
            Te,
            {
              sideOffset: 6,
              align: "end",
              collisionBoundary: ee ?? [],
              collisionPadding: 12,
              className: `${xa} w-[244px]`,
              children: [
                ue.map(($) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: $.onClick,
                    className: [
                      dn,
                      $.danger ? "text-negative" : "text-text-secondary",
                      $.separator ? "border-t border-subtle mt-[5px]" : ""
                    ].join(" "),
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${$.icon} text-[11px] w-[14px] opacity-75` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: $.label }),
                      $.kbd && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: $.kbd })
                    ]
                  },
                  $.label
                )),
                /* @__PURE__ */ e.jsxs("div", { className: "mt-1.5 pt-[9px] px-[9px] pb-[7px] border-t border-subtle", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 mb-[7px]", children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-keyboard text-[11px] text-text-tertiary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-[.09em] text-text-tertiary", children: "Kısayollar" })
                  ] }),
                  xn.map(($) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: $.what }),
                    /* @__PURE__ */ e.jsx(pn, { children: $.key })
                  ] }, $.what))
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
          ref: H,
          role: "textbox",
          "aria-label": de("Tasks:Detail:TitleLabel", "Görev başlığı"),
          "aria-readonly": !E || void 0,
          "aria-invalid": !!f || void 0,
          "aria-describedby": f ? V : void 0,
          contentEditable: E,
          suppressContentEditableWarning: !0,
          spellCheck: !1,
          onInput: E ? ($) => o("title", $.currentTarget.textContent.trim()) : void 0,
          onBlur: E ? ($) => o("title", $.currentTarget.textContent.trim()) : void 0,
          className: `flex-1 min-w-0 text-[24px] lt-560:text-[20px] font-extrabold tracking-[-.025em] leading-[1.2] text-text-primary px-2 -ml-2 py-[3px] rounded-[9px] border ${f ? "border-negative" : "border-transparent"} ${E ? `cursor-text hover:bg-neutral-subtle focus:bg-neutral-subtle focus:shadow-focus focus:outline-none ${f ? "" : "hover:border-subtle focus:border-focus"}` : ""}`,
          children: d ?? t.title ?? "Başlıksız görev"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: c,
          title: p ? "Favorilerden çıkar" : "Favorilere ekle",
          className: `flex items-center justify-center h-8 w-8 shrink-0 rounded-[9px] cursor-pointer ${p ? "bg-warning-subtle text-warning" : "text-text-tertiary hover:bg-surface-hover"}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${p ? "solid" : "regular"} fa-star text-[15px]` })
        }
      )
    ] }),
    f && /* @__PURE__ */ e.jsx("p", { id: V, role: "alert", className: "mt-1 mb-0 text-[12px] font-semibold text-negative", children: f })
  ] });
}
const st = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", ua = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function je({ children: t }) {
  return /* @__PURE__ */ e.jsx(Pt, { asChild: !0, children: t });
}
function me({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[7px] min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.08em] text-text-tertiary select-none", children: t }),
    a
  ] });
}
function pa({ name: t, size: a = 26 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Je(t), fontSize: a * 0.38 },
      children: He(t)
    }
  );
}
function ma(t) {
  if (t == null) return "—";
  const a = Math.max(0, Math.round(Number(t) * 60)), s = Math.floor(a / 60), r = a % 60;
  return s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function fn({
  task: t = {},
  assigneeOptions: a = [],
  projectOptions: s = [],
  onFieldChange: r = () => {
  },
  statusValue: l,
  /* Projenin kanban kolonları (useBoardColumns): özel kolon da bir durum seçeneğidir. */
  boardColumns: o,
  boardColumnValue: n,
  priorityValue: i,
  assigneeValue: m,
  projectValue: d,
  dueDateValue: f,
  startDateValue: x,
  tagsValue: p = [],
  progressPercent: c = 0,
  progressNote: u = "",
  onOpenTransfer: g,
  /* Düzenleme yetkisi yoksa ızgara salt okunur: tüm alanlar forma, oradan UpdateAsync'e
     gider; yetkisiz kullanıcı değiştirip Kaydet'te 403 alıyordu. */
  readOnly: y = !1,
  /* Doğrulama hataları (useTaskForm.errors): ilgili hücrenin altında gösterilir. */
  startDateError: h,
  dueDateError: w
}) {
  var N, R;
  const C = b.useId(), A = b.useId(), [E, G] = b.useState(""), [P, Q] = b.useState(""), [Y, _] = b.useState(""), [B, K] = b.useState(!1), [U, H] = b.useState(null), V = l ?? t.status, ee = Ba(o), Z = Ia(
    ee,
    V,
    n === void 0 ? t.boardColumnId : n
  ), D = { ...be(V), ...Z ? { label: Z.label } : {} }, z = (k) => {
    r("status", k.status), r("boardColumnId", k.boardColumnId);
  }, v = xt(i ?? t.priority), L = m ?? t.assigneeId ?? null, M = d ?? t.projectId ?? null, le = ((N = a.find((k) => k.value === L)) == null ? void 0 : N.label) || t.assigneeName || "Atanmamış", ie = ((R = s.find((k) => k.value === M)) == null ? void 0 : R.label) || t.projectName || "Projesiz", X = Pa(f ?? t.dueDate), ue = a.filter(
    (k) => !E || k.label.toLowerCase().includes(E.toLowerCase())
  ), $ = s.filter(
    (k) => !P || k.label.toLowerCase().includes(P.toLowerCase())
  ), J = () => {
    const k = Y.trim();
    k && !p.includes(k) && r("tagNames", [...p, k]), _(""), K(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { ref: H, className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsx(
    "fieldset",
    {
      disabled: y,
      className: "m-0 p-0 border-0 min-w-0 [&:disabled_label]:pointer-events-none [&_:disabled]:pointer-events-none [&:disabled_.fa-chevron-down]:hidden",
      children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6", children: [
        /* @__PURE__ */ e.jsx(me, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx(pa, { name: L ? le : null }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: le }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: Pe(U), children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${st} w-[264px]`, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: E,
                  onChange: (k) => G(k.target.value),
                  placeholder: "Kişi ara…",
                  className: ua
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[230px] overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("assigneeId", null),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] text-left cursor-pointer ${L ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary font-semibold"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "flex h-6 w-6 items-center justify-center rounded-full bg-neutral-subtle text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-user-slash text-[9px]" }) }),
                    /* @__PURE__ */ e.jsx("span", { children: "Atanmamış" })
                  ]
                }
              ) }),
              a.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-2 py-1.5 text-[12px] text-text-tertiary", children: "Kullanıcı listesi yükleniyor…" }),
              ue.map((k) => /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("assigneeId", k.value),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${L === k.value ? "bg-primary-subtle" : "hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx(pa, { name: k.label, size: 24 }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: k.label }),
                    L === k.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
                  ]
                }
              ) }, k.value))
            ] })
          ] }) })
        ] }) }),
        /* @__PURE__ */ e.jsxs(me, { label: "Son tarih", children: [
          /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-regular fa-calendar text-[13px] ${X.tone}` }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "date",
                value: (f ?? t.dueDate ?? "").slice(0, 10),
                onChange: (k) => r("dueDate", k.target.value),
                "aria-label": "Son tarih",
                "aria-invalid": !!w || void 0,
                "aria-describedby": w ? C : void 0,
                className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
              }
            )
          ] }),
          w ? /* @__PURE__ */ e.jsx("span", { id: C, role: "alert", className: "-mt-0.5 text-[10.5px] font-semibold text-negative", children: w }) : X.hint && /* @__PURE__ */ e.jsx("span", { className: `-mt-0.5 text-[10.5px] font-semibold ${X.tone}`, children: X.hint })
        ] }),
        /* @__PURE__ */ e.jsxs(me, { label: "Başlangıç", children: [
          /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[13px] text-text-tertiary" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "date",
                value: (x ?? t.startDate ?? "").slice(0, 10),
                onChange: (k) => r("startDate", k.target.value),
                "aria-label": "Başlangıç",
                "aria-invalid": !!h || void 0,
                "aria-describedby": h ? A : void 0,
                className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
              }
            )
          ] }),
          h && /* @__PURE__ */ e.jsx("span", { id: A, role: "alert", className: "-mt-0.5 text-[10.5px] font-semibold text-negative", children: h })
        ] }),
        /* @__PURE__ */ e.jsx(me, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 pt-[5px]", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
            /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: [
              "%",
              c
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-medium text-text-tertiary", children: u })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "h-1.5 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
            "div",
            {
              className: "h-full rounded-full bg-primary transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
              style: { width: `${c}%` }
            }
          ) })
        ] }) }),
        /* @__PURE__ */ e.jsx(me, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${D.bg} ${D.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${D.icon} text-[11px]` }),
                /* @__PURE__ */ e.jsx("span", { children: D.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: Pe(U), children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${st} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            ee.map((k) => {
              const O = (Z == null ? void 0 : Z.key) === k.key;
              return /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => z(k),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${O ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${k.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: k.label }),
                    O && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, k.key);
            })
          ] }) })
        ] }) }) }),
        /* @__PURE__ */ e.jsx(me, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${v.bg} ${v.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${v.icon} text-[11px]` }),
                /* @__PURE__ */ e.jsx("span", { children: v.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: Pe(U), children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${st} w-[184px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
            Cs.map((k) => {
              const O = Ds[k], F = (i ?? t.priority) === k;
              return /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("priority", k),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${F ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${O.icon} text-[11px] w-[13px]` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: O.label }),
                    F && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, k);
            })
          ] }) })
        ] }) }) }),
        /* @__PURE__ */ e.jsx(me, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap min-h-8", children: [
          p.map((k) => /* @__PURE__ */ e.jsxs(
            "span",
            {
              className: "inline-flex items-center gap-1.5 h-6 px-2 rounded-[7px] border border-primary bg-primary-subtle text-primary text-[11.5px] font-bold",
              children: [
                /* @__PURE__ */ e.jsx("span", { children: k }),
                !y && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Etiketi kaldır",
                    onClick: () => r("tagNames", p.filter((O) => O !== k)),
                    className: "flex items-center p-0 border-0 bg-transparent text-current opacity-55 hover:opacity-100 hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
                  }
                )
              ]
            },
            k
          )),
          y ? p.length === 0 && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "—" }) : B ? /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: Y,
              onChange: (k) => _(k.target.value),
              onBlur: J,
              onKeyDown: (k) => {
                k.key === "Enter" && J(), k.key === "Escape" && (_(""), K(!1));
              },
              placeholder: "Etiket…",
              className: "h-6 w-24 px-2 rounded-[7px] border border-focus bg-surface-base text-text-primary text-[11.5px] shadow-focus focus:outline-none"
            }
          ) : /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              "aria-label": "Yeni etiket ekle",
              onClick: () => K(!0),
              className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-dashed border-strong bg-transparent text-text-tertiary text-[11.5px] font-semibold hover:border-focus hover:text-primary hover:bg-primary-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[9px]" }),
                "Etiket"
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ e.jsx(me, { label: "Proje", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-[13px] text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: ie }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: Pe(U), children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${st} w-[250px]`, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: P,
                  onChange: (k) => Q(k.target.value),
                  placeholder: "Proje ara…",
                  className: ua
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[210px] overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("projectId", null),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${M ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-neutral-400" }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Projesiz" })
                  ]
                }
              ) }),
              $.map((k) => /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("projectId", k.value),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${M === k.value ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-primary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: k.label }),
                    M === k.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
                  ]
                }
              ) }, k.value))
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-[7px] pt-[7px] border-t border-subtle", children: [
              /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => g == null ? void 0 : g("move"),
                  className: "flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left text-text-secondary hover:bg-surface-hover hover:text-primary cursor-pointer",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[11px] w-[14px] opacity-70" }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Başka projeye taşı…" })
                  ]
                }
              ) }),
              /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => g == null ? void 0 : g("copy"),
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
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[13px] font-bold text-text-primary", children: ma(t.spentHours ?? 0) }),
          /* @__PURE__ */ e.jsxs("span", { className: "text-[12px] text-text-tertiary", children: [
            "/ ",
            t.estimatedHours != null ? ma(t.estimatedHours) : "—"
          ] })
        ] }) })
      ] })
    }
  ) });
}
const bn = "z-popover w-[225px] rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto";
function zt({ entries: t = [], onPick: a, children: s }) {
  const [r, l] = b.useState(null), o = Pe(r);
  return /* @__PURE__ */ e.jsx("span", { ref: l, className: "contents", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: s }),
    /* @__PURE__ */ e.jsx(De, { container: o, children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", collisionPadding: 12, className: bn, children: [
      /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Özellik ekle" }),
      t.map((n) => /* @__PURE__ */ e.jsx(Pt, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
function hn({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: l,
  onDragEnd: o,
  onReorderTo: n,
  onReorderDrop: i,
  pickerEntries: m = [],
  onPickFeature: d,
  counts: f = {},
  isDirty: x = !1
}) {
  const [p, c] = b.useState(!1);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-6 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 py-2.5 flex-1 min-w-0 overflow-x-auto custom-scrollbar", children: [
      s.map((u) => {
        const g = t === u.code, y = f[u.code] || 0;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            draggable: !0,
            title: "Sürükleyerek sırayı değiştirin",
            ...Fa(() => a(u.code)),
            onDragStart: (h) => {
              l(u.code);
              try {
                h.dataTransfer.effectAllowed = "move", h.dataTransfer.setData("text/plain", u.code);
              } catch {
              }
            },
            onDragOver: (h) => {
              h.preventDefault(), n(u.code);
            },
            onDrop: (h) => {
              h.preventDefault(), i == null || i();
            },
            onDragEnd: o,
            className: [
              "flex shrink-0 items-center gap-2 h-[34px] px-[13px] rounded-[10px]",
              "text-[12.5px] whitespace-nowrap cursor-grab active:cursor-grabbing",
              "transition-opacity duration-fast",
              g ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
              r === u.code ? "opacity-35" : "opacity-100"
            ].join(" "),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-[11px] opacity-85` }),
              /* @__PURE__ */ e.jsx("span", { children: u.title }),
              y > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                "rounded-full text-[10px] font-extrabold",
                g ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
              ].join(" "), children: y })
            ]
          },
          u.code
        );
      }),
      /* @__PURE__ */ e.jsx(zt, { entries: m, onPick: d, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          title: "Özellik ekle",
          onClick: () => c(!1),
          onMouseEnter: () => c(!0),
          onMouseLeave: () => c(!1),
          className: [
            "flex shrink-0 items-center gap-[7px] h-[34px] ml-1 rounded-[10px]",
            "border border-dashed border-primary bg-primary-subtle text-primary",
            "text-[12.5px] font-bold whitespace-nowrap cursor-pointer",
            "hover:border-solid",
            "transition-[padding] duration-[160ms] ease-[cubic-bezier(.16,1,.3,1)]",
            p ? "px-[13px]" : "px-[11px]"
          ].join(" "),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            p && /* @__PURE__ */ e.jsx("span", { className: "animate-fade-in-fast", children: "Özellik ekle" })
          ]
        }
      ) })
    ] }),
    x && /* @__PURE__ */ e.jsxs("span", { className: "flex shrink-0 items-center gap-[7px] h-[26px] px-2.5 rounded-full bg-warning-subtle text-warning text-[11px] font-bold", children: [
      /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-warning animate-pulse" }),
      "Taslak"
    ] })
  ] });
}
function yn({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: l,
  onDragEnd: o,
  onReorderTo: n,
  onReorderDrop: i,
  pickerEntries: m = [],
  onPickFeature: d,
  counts: f = {}
}) {
  return /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Görev özellikleri",
      className: "flex lt-860:hidden flex-col gap-[3px] w-[238px] shrink-0 py-4 px-3 border-r border-subtle bg-surface-base overflow-y-auto custom-scrollbar",
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "px-2.5 pt-1 pb-2 text-[10px] font-extrabold uppercase tracking-[.1em] text-text-tertiary", children: "Özellikler" }),
        s.map((x) => {
          const p = t === x.code, c = f[x.code] || 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              draggable: !0,
              title: "Sürükleyerek sırayı değiştirin",
              ...Fa(() => a(x.code)),
              onDragStart: (u) => {
                l(x.code);
                try {
                  u.dataTransfer.effectAllowed = "move", u.dataTransfer.setData("text/plain", x.code);
                } catch {
                }
              },
              onDragOver: (u) => {
                u.preventDefault(), n(x.code);
              },
              onDrop: (u) => {
                u.preventDefault(), i == null || i();
              },
              onDragEnd: o,
              className: [
                "flex shrink-0 items-center gap-[11px] h-9 px-[11px] rounded-[9px]",
                "text-[12.5px] text-left cursor-grab active:cursor-grabbing",
                "transition-opacity duration-fast",
                p ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
                r === x.code ? "opacity-35" : "opacity-100"
              ].join(" "),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x.icon} text-[12px] w-[15px] opacity-85` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: x.title }),
                c > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                  "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                  "rounded-full text-[10px] font-extrabold",
                  p ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
                ].join(" "), children: c })
              ]
            },
            x.code
          );
        }),
        /* @__PURE__ */ e.jsx(zt, { entries: m, onPick: d, children: /* @__PURE__ */ e.jsxs(
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
function ze({ label: t, value: a, avatarName: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 py-[9px] border-t border-subtle", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-tertiary shrink-0", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
      s && /* @__PURE__ */ e.jsx(
        "span",
        {
          className: "flex shrink-0 items-center justify-center h-[21px] w-[21px] rounded-full text-[color:var(--apya-avatar-fg)] text-[8.5px] font-bold",
          style: { background: Je(s) },
          children: He(s)
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", title: typeof a == "string" ? a : void 0, children: a || "—" })
    ] })
  ] });
}
const fa = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "—";
function gn({ task: t = {}, nameById: a }) {
  const s = (o, n) => {
    var i;
    return o || n && ((i = a == null ? void 0 : a.get) == null ? void 0 : i.call(a, n)) || null;
  }, r = s(t.creatorName, t.creatorId), l = t.lastModificationTime ? s(t.lastModifierName, t.lastModifierId) : null;
  return /* @__PURE__ */ e.jsx("aside", { className: "flex flex-col gap-3.5 min-w-0", children: /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsx(ze, { label: "Oluşturan", value: r || "Bilinmiyor", avatarName: r }),
    /* @__PURE__ */ e.jsx(ze, { label: "Oluşturma tarihi", value: fa(t.creationTime) }),
    /* @__PURE__ */ e.jsx(ze, { label: "Güncelleyen", value: l || "—", avatarName: l }),
    /* @__PURE__ */ e.jsx(ze, { label: "Son güncelleme", value: fa(t.lastModificationTime) }),
    /* @__PURE__ */ e.jsx(ze, { label: "Görev tipi", value: t.taskType }),
    /* @__PURE__ */ e.jsx(ze, { label: "Sprint", value: t.sprint })
  ] }) });
}
const ba = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
function gt({ name: t, size: a = 32 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Je(t), fontSize: a * 0.34 },
      children: He(t)
    }
  );
}
function ha({ open: t, onClick: a }) {
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
const ya = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function vn({
  task: t = {},
  onFieldChange: a = () => {
  },
  descriptionValue: s,
  checklist: r,
  currentUserName: l = "Ben",
  /* Düzenleme yetkisi yoksa açıklama ve kontrol listesi salt okunur. Yorumlar açık
     kalır: görevi görebilen herkes yorum yazabilir (ürün kararı, 2026-09-28). */
  readOnly: o = !1
}) {
  const n = t == null ? void 0 : t.id, i = ne(), [m, d] = b.useState(!0), [f, x] = b.useState(""), p = (r == null ? void 0 : r.items) ?? [], c = p.filter((v) => v.isDone).length, u = p.length ? Math.round(c / p.length * 100) : 0, g = async () => {
    const v = f.trim();
    if (!(!v || !n)) {
      x("");
      try {
        await r.addItem(v);
      } catch (L) {
        x((M) => M || v), S(L, "Madde eklenemedi.");
      }
    }
  }, [y, h] = b.useState(!0), [w, C] = b.useState(""), [A, E] = b.useState(!1), [G, P] = b.useState(!1), [Q, Y] = b.useState(null), [_, B] = b.useState(""), [K, U] = b.useState({}), { data: H = [] } = te({
    queryKey: ["task-comments", n],
    queryFn: () => {
      var v, L, M, le;
      return Promise.resolve((le = (M = (L = (v = window == null ? void 0 : window.apya) == null ? void 0 : v.platform) == null ? void 0 : L.tasks) == null ? void 0 : M.task) == null ? void 0 : le.getComments(n));
    },
    enabled: !!n,
    staleTime: 1e4,
    meta: { persist: !1 }
  }), V = async () => {
    await i.invalidateQueries({ queryKey: ["task-comments", n] }), await i.invalidateQueries({ queryKey: ["task-detail", n] });
  }, ee = async () => {
    const v = w.trim();
    if (!(!v || !n || G)) {
      P(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.addComment(n, v)), await V(), C("");
      } catch (L) {
        S(L, "Yorum gönderilemedi.");
      } finally {
        P(!1);
      }
    }
  }, Z = async (v) => {
    const L = _.trim();
    if (!(!L || !n))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.replyToComment(v, L)), await V(), B(""), Y(null);
      } catch (M) {
        S(M, "Yanıt gönderilemedi.");
      }
  }, D = (v) => U((L) => {
    const M = L[v] ?? { liked: !1, count: 0 };
    return { ...L, [v]: { liked: !M.liked, count: M.count + (M.liked ? -1 : 1) } };
  }), z = !!w.trim() && !G;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-[9px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Açıklama" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Zengin metin · WYSIWYG" })
      ] }),
      /* @__PURE__ */ e.jsx(
        Ea,
        {
          value: s ?? t.description ?? "",
          onChange: (v) => a("description", v),
          mentionName: l,
          readOnly: o
        },
        n
      )
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: ba, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
            c,
            "/",
            p.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(ha, { open: m, onClick: () => d((v) => !v) })
      ] }),
      m && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 mt-3.5", children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
            style: { width: `${u}%` }
          }
        ) }),
        p.map((v) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              disabled: o,
              "aria-label": v.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
              onClick: () => r.toggleItem(v.id).catch((L) => S(L, "Durum güncellenemedi.")),
              className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${o ? "cursor-default" : "cursor-pointer"} transition-colors duration-fast ${v.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
              children: v.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${v.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: v.text }),
          !o && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              onClick: () => r.removeItem(v.id).catch((L) => S(L, "Madde silinemedi.")),
              className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
            }
          )
        ] }, v.id)),
        !o && /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            value: f,
            onChange: (v) => x(v.target.value),
            onKeyDown: (v) => {
              v.key === "Enter" && g();
            },
            placeholder: "Yeni madde yaz ve Enter'a bas…",
            className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: ba, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Yorumlar & güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: H.length })
        ] }),
        /* @__PURE__ */ e.jsx(ha, { open: y, onClick: () => h((v) => !v) })
      ] }),
      y && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(gt, { name: l }),
          /* @__PURE__ */ e.jsxs("div", { className: `flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${A ? "border-focus bg-surface-base shadow-focus" : "border-default bg-surface-raised"}`, children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                rows: 2,
                value: w,
                onChange: (v) => C(v.target.value),
                onFocus: () => E(!0),
                onBlur: () => E(!1),
                onKeyDown: (v) => {
                  v.key === "Enter" && (v.ctrlKey || v.metaKey) && (v.preventDefault(), ee());
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
              ].map((v) => /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  title: v.title,
                  onMouseDown: (L) => L.preventDefault(),
                  onClick: () => C((L) => L + v.add),
                  className: "flex items-center justify-center h-7 w-7 rounded-[7px] text-text-tertiary hover:bg-surface-hover hover:text-primary cursor-pointer",
                  children: /* @__PURE__ */ e.jsx("i", { className: `${v.icon} text-[12px]` })
                },
                v.title
              )) }),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: ee,
                  disabled: !z,
                  className: `flex items-center gap-[7px] h-[30px] px-3.5 rounded-[9px] text-[12px] font-bold shadow-xs ${z ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${G ? "fa-circle-notch fa-spin" : "fa-paper-plane"} text-[10px]` }),
                    "Gönder"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1", children: H.map((v) => {
          const L = K[v.id] ?? { liked: !1, count: 0 };
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start py-3 border-t border-subtle", children: [
            /* @__PURE__ */ e.jsx(gt, { name: v.authorName }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: v.authorName }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: ya(v.creationTime) })
              ] }),
              /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[13px] leading-[1.65] text-text-secondary whitespace-pre-wrap", children: v.text }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 mt-[3px]", children: [
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => D(v.id),
                    className: `flex items-center gap-1.5 h-[26px] px-[9px] rounded-full border text-[11px] font-semibold cursor-pointer ${L.liked ? "border-primary bg-primary-subtle text-primary" : "border-default bg-transparent text-text-tertiary hover:border-focus"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-thumbs-up text-[10px]" }),
                      L.count
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      Y((M) => M === v.id ? null : v.id), B("");
                    },
                    className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-full text-text-tertiary text-[11px] font-semibold hover:bg-surface-hover hover:text-primary cursor-pointer",
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                      "Yanıtla"
                    ]
                  }
                )
              ] }),
              Q === v.id && /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 mt-2 animate-fade-in-fast", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: _,
                    onChange: (M) => B(M.target.value),
                    onKeyDown: (M) => {
                      M.key === "Enter" && Z(v.id);
                    },
                    placeholder: `@${v.authorName} kullanıcısına yanıt ver…`,
                    className: "flex-1 h-8 px-3 rounded-[9px] border border-focus bg-surface-base text-text-primary text-[12px] shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => Z(v.id),
                    className: "h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover",
                    children: "Yanıtla"
                  }
                )
              ] }),
              (v.replies ?? []).map((M) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] mt-2.5 pl-3 border-l-2 border-default", children: [
                /* @__PURE__ */ e.jsx(gt, { name: M.authorName, size: 24 }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: M.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: ya(M.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-[3px] mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: M.text })
                ] })
              ] }, M.id))
            ] })
          ] }, v.id);
        }) })
      ] })
    ] })
  ] });
}
function jn({
  lastSavedAt: t,
  isDirty: a,
  isSaving: s,
  justSaved: r,
  onCancel: l,
  onSave: o
}) {
  const n = t ? new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(t)) : "—", i = s ? "fa-solid fa-circle-notch fa-spin" : r ? "fa-solid fa-check" : "fa-regular fa-floppy-disk", m = s ? "Kaydediliyor…" : r ? "Kaydedildi" : "Kaydet", d = a && !s;
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
          onClick: l,
          disabled: s,
          className: "h-9 px-4 rounded-[10px] border border-default bg-surface-base text-text-secondary text-[13px] font-semibold hover:bg-surface-hover hover:text-text-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          children: "Vazgeç"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: o,
          disabled: !d,
          className: `flex items-center gap-2 h-9 px-[22px] rounded-[10px] text-white text-[13px] font-bold shadow-sm ${d ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `${i} text-[11px]` }),
            m
          ]
        }
      )
    ] })
  ] });
}
const Nn = Object.fromEntries(We.map((t) => [t.code, t])), wn = {
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
}, kn = /* @__PURE__ */ new Set([
  "risks",
  "dashboard",
  "comments",
  "emails",
  "custom-fields",
  "approvals",
  "ai",
  "automations"
]), Cn = (t) => kn.has(t);
function Dn(t) {
  const a = Nn[t], s = wn[t];
  return a ? {
    code: t,
    title: a.title,
    icon: a.icon,
    desc: (s == null ? void 0 : s.desc) ?? "",
    bg: (s == null ? void 0 : s.bg) ?? "bg-neutral-subtle",
    fg: (s == null ? void 0 : s.fg) ?? "text-text-secondary"
  } : null;
}
We.filter((t) => !t.hidden).length;
function ga({ code: t, onRemoveFeature: a, pickerEntries: s = [], onPickFeature: r, canRemove: l = !0 }) {
  const o = Dn(t) ?? { title: t, desc: "", icon: "fa-cube", bg: "bg-neutral-subtle", fg: "text-text-secondary" };
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
      l && /* @__PURE__ */ e.jsxs(
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
      /* @__PURE__ */ e.jsx(zt, { entries: s, onPick: r, children: /* @__PURE__ */ e.jsxs(
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
function Za({ open: t, onClose: a, label: s, children: r }) {
  return /* @__PURE__ */ e.jsx(
    $s,
    {
      open: t,
      onOpenChange: (l) => {
        l || a == null || a();
      },
      children: /* @__PURE__ */ e.jsxs(Ps, { children: [
        /* @__PURE__ */ e.jsx(Es, { className: "fixed inset-0", style: { pointerEvents: "none" } }),
        /* @__PURE__ */ e.jsx(Bs, { asChild: !0, "aria-describedby": void 0, children: /* @__PURE__ */ e.jsxs("div", { className: "fixed inset-0 z-modal", children: [
          /* @__PURE__ */ e.jsx(Is, { className: "sr-only", children: s }),
          r
        ] }) })
      ] })
    }
  );
}
const Tn = [
  { key: "subtasks", label: "Alt görevler", countKey: "subtasks", unit: "alt görev" },
  { key: "checklist", label: "Kontrol listesi", countKey: "checklist", unit: "madde" },
  { key: "comments", label: "Yorumlar", countKey: "comments", unit: "yorum" },
  { key: "files", label: "Dosyalar", countKey: "files", unit: "dosya" },
  { key: "keepAssignee", label: "Sorumluyu koru", desc: "Aksi halde atanmamış gelir" },
  { key: "keepLinks", label: "Bağımlılıkları koru", desc: "Öncül / ardıl bağlantılar" },
  { key: "shiftDates", label: "Tarihleri bugüne kaydır", desc: "Başlangıç ve son tarih ötelenir" }
], va = {
  subtasks: !0,
  checklist: !0,
  comments: !1,
  files: !0,
  keepAssignee: !0,
  keepLinks: !0,
  shiftDates: !1
};
function Sn({ on: t, onClick: a, label: s }) {
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
function $n({
  open: t,
  mode: a = "move",
  onClose: s,
  onConfirm: r,
  projectOptions: l = [],
  currentProjectId: o,
  counts: n = {},
  onCreateProject: i
}) {
  const [m, d] = b.useState(a), [f, x] = b.useState([]), [p, c] = b.useState(""), [u, g] = b.useState(""), [y, h] = b.useState(va), [w, C] = b.useState(!1);
  b.useEffect(() => {
    t && (d(a), x([]), c(""), g(""), h(va));
  }, [t, a]);
  const A = b.useMemo(
    () => l.filter((D) => D.value && D.value !== o),
    [l, o]
  ), E = A.filter((D) => !p || D.label.toLowerCase().includes(p.toLowerCase())), G = A.length > 0 && f.length === A.length;
  if (!t) return null;
  const P = (D) => x((z) => z.includes(D) ? z.filter((v) => v !== D) : [...z, D]), Q = (D) => {
    var z;
    return ((z = l.find((v) => v.value === D)) == null ? void 0 : z.label) ?? "";
  }, Y = async () => {
    const D = u.trim();
    if (!(!D || w)) {
      C(!0);
      try {
        const z = await (i == null ? void 0 : i(D));
        z && x((v) => [...v, z]), g("");
      } catch (z) {
        S(z, "Proje oluşturulamadı.");
      } finally {
        C(!1);
      }
    }
  }, _ = async () => {
    if (!(!f.length || w)) {
      C(!0);
      try {
        await (r == null ? void 0 : r({ mode: m, targetProjectIds: f, include: y }));
      } finally {
        C(!1);
      }
    }
  }, B = m === "move", K = f.length, U = B ? K > 1 ? "Taşı ve kopyala" : "Taşı" : K > 1 ? `${K} projeye kopyala` : "Kopyala", H = Object.values(y).filter(Boolean).length, V = f.map(Q).filter(Boolean), ee = V.length ? `${V.length > 2 ? `${V.slice(0, 2).join(", ")} +${V.length - 2}` : V.join(", ")} · ${H} seçenek açık` : `Proje seçilmedi · ${H} seçenek açık`, Z = (D) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${D ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return /* @__PURE__ */ e.jsx(Za, { open: t, onClose: s, label: B ? "Başka projeye taşı" : "Başka projelere kopyala", children: /* @__PURE__ */ e.jsx(
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
          "aria-label": B ? "Başka projeye taşı" : "Başka projelere kopyala",
          onClick: (D) => D.stopPropagation(),
          className: "flex flex-col w-full max-w-[760px] max-h-[88vh] rounded-[20px] border border-default bg-surface-base shadow-xl overflow-hidden animate-dialog-in",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-4 px-[22px] pt-5 pb-4 border-b border-subtle", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-10 w-10 rounded-[13px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-tree text-base" }) }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsx("h3", { className: "m-0 text-base font-extrabold tracking-[-.02em] text-text-primary", children: B ? "Başka projeye taşı" : "Başka projelere kopyala" }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 mb-0 text-[12px] leading-[1.5] text-text-tertiary", children: B ? "Görev ilk seçtiğiniz projeye taşınır; birden fazla seçerseniz kalanlara kopya oluşturulur." : "Görevin kopyası seçtiğiniz her projede oluşturulur; bu görev yerinde kalır." })
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
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => d("move"), className: Z(B), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[10px]" }),
                "Taşı"
              ] }),
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => d("copy"), className: Z(!B), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clone text-[10px]" }),
                "Kopyala"
              ] })
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 grid grid-cols-2 lt-860:grid-cols-1 gap-5 items-start px-[22px] pt-4 pb-5 overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px] min-w-0", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5", children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.08em] text-text-tertiary", children: [
                    "Hedef projeler · ",
                    K
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => x(G ? [] : A.map((D) => D.value)),
                      className: "p-0 border-0 bg-transparent text-primary text-[11px] font-bold cursor-pointer hover:underline",
                      children: G ? "Seçimi temizle" : "Tümünü seç"
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
                      onChange: (D) => c(D.target.value),
                      placeholder: "Proje ara…",
                      className: "w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar", children: [
                  E.map((D) => {
                    const z = f.includes(D.value), v = B && f[0] === D.value;
                    return /* @__PURE__ */ e.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => P(D.value),
                        className: `flex items-center gap-[11px] px-3 py-[11px] rounded-[11px] border text-left cursor-pointer hover:border-focus ${z ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                        children: [
                          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] rounded-[5px] border-[1.5px] text-white ${z ? "bg-primary border-primary" : "bg-transparent border-strong"}`, children: z && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" }) }),
                          /* @__PURE__ */ e.jsx("span", { className: "h-2.5 w-2.5 shrink-0 rounded-[3px] bg-primary" }),
                          /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: D.label }),
                          v && /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center h-5 px-2 rounded-md bg-primary text-white text-[10px] font-extrabold", children: "TAŞINACAK" })
                        ]
                      },
                      D.value
                    );
                  }),
                  E.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "py-6 text-center text-[12px] text-text-tertiary", children: "Uygun proje bulunamadı." })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[7px] mt-1", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: u,
                      onChange: (D) => g(D.target.value),
                      onKeyDown: (D) => {
                        D.key === "Enter" && (D.preventDefault(), Y());
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
                      onClick: Y,
                      disabled: !u.trim() || w,
                      className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-plus text-[12px]" })
                    }
                  )
                ] }),
                B && K > 1 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle", children: [
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
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: Tn.map((D) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-px", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary", children: D.label }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: D.countKey ? `${n[D.countKey] ?? 0} ${D.unit}` : D.desc })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    Sn,
                    {
                      on: y[D.key],
                      label: D.label,
                      onClick: () => h((z) => ({ ...z, [D.key]: !z[D.key] }))
                    }
                  )
                ] }, D.key)) })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3.5 px-[22px] py-3.5 border-t border-subtle bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("span", { className: "min-w-0 truncate text-[11.5px] text-text-tertiary", children: ee }),
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
                    onClick: _,
                    disabled: !K || w,
                    className: `flex items-center gap-2 h-9 px-5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${K && !w ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${w ? "fa-circle-notch fa-spin" : "fa-arrow-right"} text-[10px]` }),
                      U
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
const Pn = [
  { code: "general", title: "Genel", icon: "fa-circle-info" },
  { code: "checklist", title: "Kontrol", icon: "fa-square-check" },
  { code: "comments", title: "Yorumlar", icon: "fa-comments" },
  { code: "files", title: "Dosyalar", icon: "fa-paperclip" }
], Ye = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  img: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
};
function En(t = "") {
  var s;
  const a = (s = t.split(".").pop()) == null ? void 0 : s.toLowerCase();
  return a === "pdf" ? Ye.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(a) ? Ye.img : ["doc", "docx", "odt", "rtf"].includes(a) ? Ye.doc : ["json", "js", "ts", "cs", "xml", "yml", "yaml"].includes(a) ? Ye.code : Ye.other;
}
const Bn = (t) => t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : "—", In = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—", Fn = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—";
function vt({ name: t, size: a = 22 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Je(t), fontSize: a * 0.4 },
      children: He(t)
    }
  );
}
function rt({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: t }),
    a
  ] });
}
function An({
  subtaskId: t,
  parentCode: a,
  onClose: s,
  onOpenFull: r,
  onDeleted: l,
  currentUserName: o = "Ben"
}) {
  var ue, $, J;
  const n = ne(), { data: i } = Et(t), m = At(t), d = Ft(t), [f, x] = b.useState("general"), [p, c] = b.useState(""), [u, g] = b.useState(""), [y, h] = b.useState(""), w = b.useRef(null), C = b.useRef(null);
  i && C.current !== i.id && (C.current = i.id, c(i.description ?? ""));
  const { data: A = [] } = te({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var N, R, k, O;
      return Promise.resolve((O = (k = (R = (N = window == null ? void 0 : window.apya) == null ? void 0 : N.platform) == null ? void 0 : R.tasks) == null ? void 0 : k.task) == null ? void 0 : O.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4,
    meta: { persist: !1 }
  });
  if (b.useEffect(() => {
    const N = (R) => {
      R.key === "Escape" && (R.stopPropagation(), s == null || s());
    };
    return window.addEventListener("keydown", N), () => window.removeEventListener("keydown", N);
  }, [s]), !i) return null;
  const { canEdit: E, canChangeStatus: G, canDelete: P } = Oe(i), Q = (J = ($ = (ue = window == null ? void 0 : window.apya) == null ? void 0 : ue.platform) == null ? void 0 : $.tasks) == null ? void 0 : J.task, Y = be(i.status), _ = xt(i.priority), B = m.items ?? [], K = B.filter((N) => N.isDone).length, U = B.length ? Math.round(K / B.length * 100) : 0, H = d.attachments ?? [], V = { checklist: B.length, comments: A.length, files: H.length }, ee = async () => {
    await n.invalidateQueries({ queryKey: ["task-detail", t] });
  }, Z = async (N) => {
    try {
      await Promise.resolve(N()), await ee();
    } catch (R) {
      S(R, "Alt görev güncellenemedi.");
    }
  }, D = (N) => Z(() => Q.update(i.id, Qa(i, N))), z = () => Z(() => Q.updateStatus(i.id, i.status >= 4 ? 1 : i.status + 1)), v = () => Z(() => Q.setPriority(i.id, i.priority >= 4 ? 1 : i.priority + 1)), L = () => {
    (i.description ?? "") !== p && D({ description: p || null });
  }, M = async () => {
    const N = u.trim();
    if (N) {
      g("");
      try {
        await m.addItem(N);
      } catch (R) {
        S(R, "Madde eklenemedi.");
      }
    }
  }, le = async () => {
    const N = y.trim();
    if (N) {
      h("");
      try {
        await Promise.resolve(Q.addComment(i.id, N)), await n.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch (R) {
        S(R, "Yorum gönderilemedi.");
      }
    }
  }, ie = async () => {
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(Q.delete(i.id)), l == null || l(i.id), s == null || s();
      } catch (N) {
        S(N, "Alt görev silinemedi.");
      }
  }, X = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
  return /* @__PURE__ */ e.jsxs(Za, { open: !0, onClose: s, label: `${i.code} alt görev detayı`, children: [
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
                    className: `${X} hover:bg-surface-hover hover:text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-up-right-from-square text-[11px]" })
                  }
                ),
                P && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Alt görevi sil",
                    onClick: ie,
                    className: `${X} hover:bg-negative-subtle hover:text-negative`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Kapat",
                    onClick: s,
                    className: `${X} hover:bg-surface-hover hover:text-text-primary`,
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
                  onClick: z,
                  title: "Durumu değiştir",
                  disabled: !G,
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold ${G ? "cursor-pointer" : "cursor-default"} ${Y.bg} ${Y.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${Y.icon} text-[10px]` }),
                    Y.label
                  ]
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: v,
                  title: "Önceliği değiştir",
                  disabled: !E,
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold ${E ? "cursor-pointer" : "cursor-default"} ${_.bg} ${_.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${_.icon} text-[10px]` }),
                    _.label
                  ]
                }
              ),
              (i.tags ?? []).map((N) => /* @__PURE__ */ e.jsx("span", { className: "flex items-center h-6 px-[9px] rounded-[7px] border border-default bg-neutral-subtle text-text-secondary text-[11px] font-semibold", children: N.name }, N.id ?? N.name)),
              !E && /* @__PURE__ */ e.jsxs(
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
            /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[18px] font-extrabold tracking-[-.02em] leading-[1.3] text-text-primary", children: i.title }),
            /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 pt-1", children: [
              /* @__PURE__ */ e.jsx(rt, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
                /* @__PURE__ */ e.jsx(vt, { name: i.assigneeName }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", children: i.assigneeName || "Atanmamış" })
              ] }) }),
              /* @__PURE__ */ e.jsx(rt, { label: "Son tarih", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] h-[22px] text-[12.5px] font-semibold text-text-primary", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[11px] text-text-tertiary" }),
                Fn(i.dueDate)
              ] }) }),
              /* @__PURE__ */ e.jsx(rt, { label: "Süre", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-[22px] font-mono text-[12.5px] font-bold text-text-primary", children: [
                i.spentHours ?? 0,
                "s",
                /* @__PURE__ */ e.jsxs("span", { className: "font-medium text-text-tertiary", children: [
                  " / ",
                  i.estimatedHours != null ? `${i.estimatedHours}s` : "—"
                ] })
              ] }) }),
              /* @__PURE__ */ e.jsx(rt, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-1.5 pt-[3px]", children: [
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
                  "%",
                  U
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: "block h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("span", { className: "block h-full rounded-full bg-success", style: { width: `${U}%` } }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: Pn.map((N) => {
            const R = f === N.code, k = V[N.code] ?? 0;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => x(N.code),
                className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${R ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${N.icon} text-[11px] opacity-85` }),
                  /* @__PURE__ */ e.jsx("span", { children: N.title }),
                  k > 0 && /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-neutral-subtle text-text-tertiary text-[10px] font-extrabold", children: k })
                ]
              },
              N.code
            );
          }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar px-5 py-[18px] bg-surface-raised", children: [
            f === "general" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Açıklama" }),
              /* @__PURE__ */ e.jsx(
                "textarea",
                {
                  rows: 7,
                  value: p,
                  onChange: (N) => c(N.target.value),
                  onBlur: E ? L : void 0,
                  readOnly: !E,
                  placeholder: E ? "Bu alt görevin detayları…" : "Açıklama yok.",
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
                  K,
                  "/",
                  B.length
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-success", style: { width: `${U}%` } }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px] mt-1", children: [
                B.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] border border-subtle bg-surface-base hover:border-default", children: [
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Tamamlandı işaretle",
                      onClick: () => m.toggleItem(N.id),
                      disabled: !E,
                      className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${E ? "cursor-pointer" : "cursor-default"} ${N.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
                      children: N.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[12.5px] font-semibold ${N.isDone ? "line-through text-text-tertiary" : "text-text-primary"}`, children: N.text }),
                  E && /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Maddeyi sil",
                      onClick: () => m.removeItem(N.id),
                      className: "flex shrink-0 items-center justify-center h-6 w-6 rounded-md text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[10px]" })
                    }
                  )
                ] }, N.id)),
                E && /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "text",
                    value: u,
                    onChange: (N) => g(N.target.value),
                    onKeyDown: (N) => {
                      N.key === "Enter" && M();
                    },
                    placeholder: "Yeni madde yaz ve Enter'a bas…",
                    className: "h-9 mt-1 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                )
              ] })
            ] }),
            f === "comments" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] items-start", children: [
                /* @__PURE__ */ e.jsx(vt, { name: o, size: 30 }),
                /* @__PURE__ */ e.jsx(
                  "textarea",
                  {
                    rows: 2,
                    value: y,
                    onChange: (N) => h(N.target.value),
                    onKeyDown: (N) => {
                      N.key === "Enter" && !N.shiftKey && (N.preventDefault(), le());
                    },
                    placeholder: "Yorum yaz ve Enter'a bas…",
                    className: "flex-1 min-w-0 px-3 py-2.5 rounded-[11px] border border-default bg-surface-base text-text-primary text-[12.5px] leading-[1.6] resize-none focus:border-focus focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: le,
                    "aria-label": "Yorumu gönder",
                    className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] ${y.trim() ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paper-plane text-[11px]" })
                  }
                )
              ] }),
              A.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-[7px] py-7 rounded-xl border border-dashed border-default", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-comments text-xl text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Henüz yorum yok" })
              ] }) : A.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 items-start p-3 rounded-xl border border-subtle bg-surface-base", children: [
                /* @__PURE__ */ e.jsx(vt, { name: N.authorName, size: 28 }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: N.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: In(N.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: N.text })
                ] })
              ] }, N.id))
            ] }),
            f === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  ref: w,
                  type: "file",
                  className: "hidden",
                  onChange: (N) => {
                    var k;
                    const R = (k = N.target.files) == null ? void 0 : k[0];
                    N.target.value = "", R && d.upload(R).catch((O) => S(O, "Dosya yüklenemedi."));
                  }
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    var N;
                    return (N = w.current) == null ? void 0 : N.click();
                  },
                  disabled: d.isUploading,
                  className: "flex flex-col items-center justify-center gap-[7px] p-6 rounded-[13px] border-2 border-dashed border-strong bg-surface-base cursor-pointer hover:border-focus hover:bg-primary-subtle disabled:opacity-60",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.isUploading ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-xl text-text-tertiary` }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: d.isUploading ? "Yükleniyor…" : "Dosya ekle" })
                  ]
                }
              ),
              H.map((N) => {
                const R = En(N.fileName);
                return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${R.bg} ${R.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${R.icon} text-[13px]` }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: N.fileName }),
                    /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                      Bn(N.fileSize),
                      " · ",
                      N.uploaderName
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "a",
                    {
                      href: N.downloadUrl,
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
                      onClick: () => d.remove(N.id).catch((k) => S(k, "Dosya silinemedi.")),
                      className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                    }
                  )
                ] }, N.id);
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
const Xa = "apya.taskDetail.tabOrder", zn = "taskdetail";
function ja() {
  try {
    const t = localStorage.getItem(Xa);
    if (!t) return [];
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.filter((s) => typeof s == "string") : [];
  } catch {
    return [];
  }
}
function Ln(t) {
  try {
    localStorage.setItem(Xa, JSON.stringify(t));
  } catch {
  }
}
function Na() {
  const t = document.querySelector("[data-tab-order]"), a = t == null ? void 0 : t.getAttribute("data-tab-order");
  if (!a) return null;
  try {
    const s = JSON.parse(a);
    return Array.isArray(s) ? s.map((r) => r == null ? void 0 : r.kind).filter((r) => typeof r == "string") : null;
  } catch {
    return null;
  }
}
function wa(t) {
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
        scope: zn,
        tabs: t.map((s) => ({ kind: s, ref: "", title: "" }))
      })
    }).catch(() => {
    });
  } catch {
  }
}
function Mn(t) {
  const [a, s] = b.useState(() => Na() ?? ja()), [r, l] = b.useState(null);
  b.useEffect(() => {
    if (Na() === null) {
      const d = ja();
      d.length && wa(d);
    }
  }, []);
  const o = b.useMemo(() => {
    const d = new Map(t.map((x) => [x.code, x])), f = [];
    for (const x of a) {
      const p = d.get(x);
      p && (f.push(p), d.delete(x));
    }
    for (const x of t)
      d.has(x.code) && f.push(x);
    return f;
  }, [t, a]), n = b.useCallback((d) => {
    s((f) => {
      const x = r;
      if (!x || x === d) return f;
      const p = f.length ? f.slice() : o.map((g) => g.code), c = p.indexOf(x), u = p.indexOf(d);
      return c === -1 || u === -1 ? f : (p.splice(c, 1), p.splice(u, 0, x), p);
    });
  }, [r, o]), i = b.useCallback((d) => l(d), []), m = b.useCallback(() => {
    l(null), s((d) => {
      const f = d.length ? d : o.map((x) => x.code);
      return Ln(f), wa(f), f;
    });
  }, [o]);
  return { orderedTabs: o, draggingCode: r, handleDragStart: i, handleDragEnd: m, reorderTo: n };
}
function Kn() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Rn() {
  const t = te({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: Kn,
    staleTime: 3e5,
    retry: !1
  }), a = t.data ?? [], s = a.map((l) => ({ value: l.id, label: l.name })), r = new Map(a.map((l) => [l.id, l.name]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function qn(t) {
  var s, r, l;
  const a = (l = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.projects) == null ? void 0 : l.boardColumn;
  return a ? Promise.resolve(a.getListByProject(t, { abpHandleError: !1 })) : Promise.resolve([]);
}
function Gn(t) {
  const a = te({
    queryKey: ["task-detail", "board-columns", t],
    queryFn: () => qn(t),
    enabled: !!t,
    staleTime: 6e4,
    retry: !1,
    /* Kolonlar panoda her an yeniden adlandırılıp eklenebilir — kalıcı önbellekten
       bayat seçenek gelmesin. */
    meta: { persist: !1 }
  });
  return t ? a.data ?? [] : [];
}
const ka = "apya.taskDetail.fullscreen", xe = {
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
function Yn(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function es({ taskId: t, presentation: a = "modal", onClose: s, switchToTask: r }) {
  var Gt, Yt, _t, Ut, Vt, Ot, Qt, Ht;
  const [l, o] = b.useState(t), { data: n, isPending: i, isError: m, error: d, refetch: f } = Et(l), x = ne(), p = $a(), c = Ma(n), u = Ka(), g = Rn(), y = Gn(
    n != null && n.projectId && c.values.projectId === n.projectId ? n.projectId : null
  ), h = Ra(l), w = At(l), [C, A] = b.useState("general"), [E, G] = b.useState(!1), [P, Q] = b.useState(!1), [Y, _] = b.useState(!1), [B, K] = b.useState(null), [U, H] = b.useState(null), [V, ee] = b.useState(!1), [Z, D] = b.useState(!1), [z, v] = b.useState(() => {
    try {
      return localStorage.getItem(ka) === "true";
    } catch {
      return !1;
    }
  });
  za(a === "page" ? null : l);
  const [L, M] = b.useState(null);
  n != null && n.id && n.id !== L && (M(n.id), ee(!!n.isFavorite), D(!!n.isWatched)), b.useEffect(() => {
    c.isDirty ? p.markDirty() : p.markClean();
  }), b.useEffect(() => {
    const j = x.getQueryCache().subscribe((I) => {
      var ce;
      I.type === "updated" && ((ce = I.action) == null ? void 0 : ce.type) === "invalidate" && !Fs(I.query.queryKey) && W.markChanged();
    }), T = x.getMutationCache().subscribe((I) => {
      I.type === "added" && W.markChanged();
    });
    return () => {
      j(), T();
    };
  }, [x]);
  const le = b.useCallback(() => {
    It(), s == null || s();
  }, [s]), ie = b.useCallback(() => {
    E || (_(!1), p.requestClose(le));
  }, [p, le, E]), X = (j) => {
    _(!1), p.requestClose(() => (r ?? o)(j));
  }, ue = b.useCallback(() => {
    v((j) => {
      const T = !j;
      try {
        localStorage.setItem(ka, String(T));
      } catch {
      }
      return T;
    });
  }, []), $ = b.useMemo(
    () => Ha(h.assignedCodes),
    [h.assignedCodes]
  ), J = Mn($), N = b.useMemo(
    () => Ja(h.assignedCodes),
    [h.assignedCodes]
  ), R = (j, T) => {
    if (T) {
      A(j);
      return;
    }
    us(j);
  }, k = b.useMemo(() => {
    var j, T, I, ce, ye;
    return {
      subtasks: ((j = n == null ? void 0 : n.subTasks) == null ? void 0 : j.length) ?? 0,
      files: ((T = n == null ? void 0 : n.attachments) == null ? void 0 : T.length) ?? 0,
      dependencies: ((I = n == null ? void 0 : n.predecessorIds) == null ? void 0 : I.length) ?? 0,
      comments: ((ce = n == null ? void 0 : n.comments) == null ? void 0 : ce.length) ?? 0,
      checklist: ((ye = w.items) == null ? void 0 : ye.length) ?? 0
    };
  }, [n, w.items]), O = We.find((j) => j.code === C), F = w.items ?? [], q = F.filter((j) => j.isDone).length, ae = F.length ? Math.round(q / F.length * 100) : 0, he = b.useRef(null), [Lt, as] = b.useState(0), Mt = () => c.validate() ? !0 : (xe.err(de("Tasks:Detail:Validation:Summary", "Kaydedilemedi: işaretli alanları düzeltin.")), as((j) => j + 1), !1);
  b.useEffect(() => {
    var T, I;
    if (!Lt) return;
    const j = (T = he.current) == null ? void 0 : T.querySelector('[aria-invalid="true"]');
    j == null || j.focus(), (I = j == null ? void 0 : j.scrollIntoView) == null || I.call(j, { block: "nearest" });
  }, [Lt]);
  const Ze = b.useCallback(async () => {
    if (!Mt()) return !1;
    G(!0);
    try {
      const j = c.values, T = await Promise.resolve(window.apya.platform.tasks.task.update(l, c.toUpdateDto()));
      await x.invalidateQueries({ queryKey: ["task-detail", l] });
      const I = x.getQueryState(["task-detail", l]);
      return c.commitSaved(j, (I == null ? void 0 : I.status) === "success" ? I.data : T), W.emitResult(), Q(!0), setTimeout(() => Q(!1), 2e3), xe.ok("Görev başarıyla güncellendi."), !0;
    } catch (j) {
      return S(j, "Kaydedilemedi."), !1;
    } finally {
      G(!1);
    }
  }, [l, c, x]), ss = () => {
    _(!1), p.resolvePendingClose("stay");
  }, rs = () => {
    _(!1), c.reset(), p.resolvePendingClose("discard");
  }, ns = async () => {
    if (_(!1), !Mt()) {
      p.resolvePendingClose("stay");
      return;
    }
    await Ze() ? p.resolvePendingClose("saved") : _(!0);
  };
  b.useEffect(() => {
    const j = (T) => {
      if ((T.ctrlKey || T.metaKey) && T.key.toLowerCase() === "s") {
        T.preventDefault(), c.isDirty && !E && !p.pendingClose && Ze();
        return;
      }
      T.key === "Escape" && B && (T.stopPropagation(), K(null));
    };
    return window.addEventListener("keydown", j), () => window.removeEventListener("keydown", j);
  }, [Ze, c.isDirty, E, B, p.pendingClose]);
  const Be = () => {
    var j, T, I;
    return (I = (T = (j = window == null ? void 0 : window.apya) == null ? void 0 : j.platform) == null ? void 0 : T.tasks) == null ? void 0 : I.task;
  }, is = async () => {
    var T;
    const j = !V;
    ee(j), W.markChanged();
    try {
      await Promise.resolve((T = Be()) == null ? void 0 : T.toggleFavorite(l));
    } catch (I) {
      ee(!j), S(I, "Favori güncellenemedi.");
    }
  }, ls = () => {
    if (!l) return;
    const j = document.createElement("a");
    j.href = `/Tasks/Detail/${l}?handler=Pdf`, j.rel = "noopener", document.body.appendChild(j), j.click(), j.remove();
  }, os = async () => {
    var T;
    const j = !Z;
    D(j), W.markChanged();
    try {
      await Promise.resolve((T = Be()) == null ? void 0 : T.toggleWatch(l)), xe.info(j ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (I) {
      D(!j), S(I, "Takip durumu güncellenemedi.");
    }
  }, cs = async () => {
    var j, T;
    W.markChanged();
    try {
      const I = await Promise.resolve((j = Be()) == null ? void 0 : j.transfer(l, {
        mode: 2,
        // Copy
        targetProjectIds: n != null && n.projectId ? [n.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await x.invalidateQueries({ queryKey: ["task-detail"] }), xe.ok("Görev çoğaltıldı.");
      const ce = (T = I == null ? void 0 : I.createdTaskIds) == null ? void 0 : T[0];
      ce && X(ce);
    } catch (I) {
      S(I, "Görev çoğaltılamadı.");
    }
  }, ds = async () => {
    var j, T;
    W.markChanged();
    try {
      await Promise.resolve((j = Be()) == null ? void 0 : j.updateStatus(l, 4)), await x.invalidateQueries({ queryKey: ["task-detail", l] }), c.setField("status", 4), c.setField(
        "boardColumnId",
        ((T = x.getQueryData(["task-detail", l])) == null ? void 0 : T.boardColumnId) ?? null
      ), xe.info("Görev arşivlendi (Tamamlandı).");
    } catch (I) {
      S(I, "Görev arşivlenemedi.");
    }
  }, xs = async () => {
    var j;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?")) {
      W.markChanged();
      try {
        await Promise.resolve((j = Be()) == null ? void 0 : j.delete(l)), xe.info("Görev silindi."), p.markClean(), le();
      } catch (T) {
        S(T, "Görev silinemedi.");
      }
    }
  }, us = async (j) => {
    try {
      await h.addFeature(j), A(j), xe.ok("Özellik başarıyla eklendi.");
    } catch (T) {
      S(T, "Özellik eklenemedi.");
    }
  }, Kt = async (j) => {
    try {
      await h.removeFeature(j), A("general"), xe.info("Özellik görevden kaldırıldı.");
    } catch (T) {
      S(T, "Özellik kaldırılamadı.");
    }
  }, ps = async (j) => {
    var ce, ye, ge, Ie, $e, et, Re;
    const T = ((Ie = (ge = (ye = (ce = window == null ? void 0 : window.apya) == null ? void 0 : ce.platform) == null ? void 0 : ye.application) == null ? void 0 : ge.projects) == null ? void 0 : Ie.project) ?? ((Re = (et = ($e = window == null ? void 0 : window.apya) == null ? void 0 : $e.platform) == null ? void 0 : et.projects) == null ? void 0 : Re.project);
    if (!(T != null && T.create)) throw new Error("Proje servisi yüklenmedi.");
    const I = await Promise.resolve(T.create({
      name: j,
      code: Yn(j),
      currency: "TRY"
    }));
    return await x.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), xe.ok(`“${j}” projesi oluşturuldu.`), (I == null ? void 0 : I.id) ?? I;
  }, ms = async ({ mode: j, targetProjectIds: T, include: I }) => {
    var ce, ye;
    W.markChanged();
    try {
      const ge = await Promise.resolve((ce = Be()) == null ? void 0 : ce.transfer(l, {
        mode: j === "move" ? 1 : 2,
        targetProjectIds: T,
        include: I
      }));
      await x.invalidateQueries({ queryKey: ["task-detail", l] }), j === "move" && c.setField("projectId", T[0]);
      const Ie = T.map((et) => {
        var Re;
        return (Re = g.options.find((ys) => ys.value === et)) == null ? void 0 : Re.label;
      }).filter(Boolean), $e = ((ye = ge == null ? void 0 : ge.createdTaskIds) == null ? void 0 : ye.length) ?? 0;
      xe.ok(j === "move" ? $e ? `“${Ie[0]}” projesine taşındı, ${$e} projeye kopyalandı.` : `Görev “${Ie[0]}” projesine taşındı.` : $e > 1 ? `${$e} projeye kopyalandı.` : `Kopya “${Ie[0]}” projesinde oluşturuldu.`), K(null);
    } catch (ge) {
      S(ge, "Transfer tamamlanamadı.");
    }
  }, { canEdit: Xe, canChangeStatus: fs, canDelete: bs } = Oe(n), hs = C === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)] gap-5 items-start", children: [
    /* @__PURE__ */ e.jsx(
      vn,
      {
        task: n,
        onFieldChange: c.setField,
        descriptionValue: c.values.description,
        checklist: w,
        readOnly: !Xe,
        currentUserName: ((Yt = (Gt = window == null ? void 0 : window.abp) == null ? void 0 : Gt.currentUser) == null ? void 0 : Yt.name) || ((Ut = (_t = window == null ? void 0 : window.abp) == null ? void 0 : _t.currentUser) == null ? void 0 : Ut.userName) || "Ben"
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5", children: /* @__PURE__ */ e.jsx(gn, { task: n, nameById: u.nameById }) })
  ] }) : Cn(C) ? /* @__PURE__ */ e.jsx(
    ga,
    {
      code: C,
      onRemoveFeature: Kt,
      pickerEntries: N,
      onPickFeature: R,
      canRemove: !(O != null && O.isCore)
    }
  ) : /* @__PURE__ */ e.jsx(b.Suspense, { fallback: /* @__PURE__ */ e.jsx(we, { className: "h-48 w-full" }), children: O != null && O.component ? /* @__PURE__ */ e.jsx(
    O.component,
    {
      taskId: l,
      task: n,
      form: c,
      nameById: u.nameById,
      onOpenSubtask: H,
      readOnly: !Xe
    }
  ) : /* @__PURE__ */ e.jsx(
    ga,
    {
      code: C,
      onRemoveFeature: Kt,
      pickerEntries: N,
      onPickFeature: R,
      canRemove: !(O != null && O.isCore)
    }
  ) }), Ke = m && ((d == null ? void 0 : d.status) === 404 || (d == null ? void 0 : d.status) === 403) ? d.status : null, Rt = i ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(we, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(we, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(we, { className: "h-64 w-full" })
  ] }) : Ke ? /* @__PURE__ */ e.jsx(
    gs,
    {
      variant: Ke === 404 ? "error" : "locked",
      icon: Ke === 404 ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-magnifying-glass" }) : void 0,
      title: Ke === 404 ? de("Tasks:Detail:NotFound:Title", "Bu görev bulunamadı") : de("Tasks:Detail:Forbidden:Title", "Bu görevi görüntüleyemezsiniz"),
      description: Ke === 404 ? de("Tasks:Detail:NotFound:Body", "Görev silinmiş ya da bağlantı eskimiş olabilir.") : vs(d),
      action: a === "page" ? /* @__PURE__ */ e.jsx(re, { asChild: !0, size: "sm", children: /* @__PURE__ */ e.jsxs("a", { href: "/Tasks", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-left", "aria-hidden": "true" }),
        de("Tasks:Detail:BackToList", "Görevlere dön")
      ] }) }) : /* @__PURE__ */ e.jsx(re, { variant: "secondary", size: "sm", onClick: ie, children: de("Common:Close", "Kapat") })
    }
  ) : m && !n ? (
    /* Yalnız İLK yükleme hatası. Görev ekrandayken düşen tazeleme (odak dönüşü, kayıt sonrası
       yeniden çekme; oturum düşünce 401) formu sökmez: yazılanlar görünür kalır, sonraki
       başarılı tazeleme forma işlenir (useTaskForm rebase). */
    /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
      /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
      /* @__PURE__ */ e.jsx(js, { onRetry: f })
    ] })
  ) : /* @__PURE__ */ e.jsxs("div", { ref: he, className: "flex flex-col flex-1 min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      mn,
      {
        task: n,
        presentation: a,
        onClose: ie,
        isFullscreen: z,
        onToggleFullscreen: ue,
        onFieldChange: c.setField,
        statusValue: c.values.status,
        boardColumns: y,
        boardColumnValue: c.values.boardColumnId,
        titleValue: n == null ? void 0 : n.title,
        titleError: c.errors.title,
        isPrivateValue: c.values.isPrivate,
        isFavorite: V,
        onToggleFavorite: is,
        isWatched: Z,
        onToggleWatch: os,
        onDuplicate: cs,
        onArchive: ds,
        onDelete: xs,
        onOpenTransfer: (j) => K({ mode: j }),
        onExportPdf: ls,
        canEdit: Xe,
        canChangeStatus: fs,
        canDelete: bs
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        fn,
        {
          task: n,
          assigneeOptions: u.options,
          projectOptions: g.options,
          onFieldChange: c.setField,
          statusValue: c.values.status,
          boardColumns: y,
          boardColumnValue: c.values.boardColumnId,
          priorityValue: c.values.priority,
          assigneeValue: c.values.assigneeId,
          projectValue: c.values.projectId,
          dueDateValue: c.values.dueDate,
          startDateValue: c.values.startDate,
          startDateError: c.errors.startDate,
          dueDateError: c.errors.dueDate,
          tagsValue: c.values.tagNames,
          progressPercent: ae,
          progressNote: `${q}/${F.length} madde`,
          onOpenTransfer: (j) => K({ mode: j }),
          readOnly: !Xe
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        a === "page" && /* @__PURE__ */ e.jsx(
          yn,
          {
            activeTab: C,
            onTabChange: A,
            orderedTabs: J.orderedTabs,
            draggingCode: J.draggingCode,
            onDragStart: J.handleDragStart,
            onDragEnd: J.handleDragEnd,
            onReorderTo: J.reorderTo,
            onReorderDrop: () => xe.info("Sekme sırası güncellendi."),
            pickerEntries: N,
            onPickFeature: R,
            counts: k
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: a === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            hn,
            {
              activeTab: C,
              onTabChange: A,
              orderedTabs: J.orderedTabs,
              draggingCode: J.draggingCode,
              onDragStart: J.handleDragStart,
              onDragEnd: J.handleDragEnd,
              onReorderTo: J.reorderTo,
              onReorderDrop: () => xe.info("Sekme sırası güncellendi."),
              pickerEntries: N,
              onPickFeature: R,
              counts: k,
              isDirty: c.isDirty
            }
          ) }),
          /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised", children: hs })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(
      jn,
      {
        lastSavedAt: n == null ? void 0 : n.lastModificationTime,
        isDirty: c.isDirty,
        isSaving: E,
        justSaved: P,
        onCancel: ie,
        onSave: Ze
      }
    )
  ] }), qt = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      $n,
      {
        open: !!B,
        mode: (B == null ? void 0 : B.mode) ?? "move",
        onClose: () => K(null),
        onConfirm: ms,
        projectOptions: g.options,
        currentProjectId: c.values.projectId,
        counts: k,
        onCreateProject: ps
      }
    ),
    U && /* @__PURE__ */ e.jsx(
      An,
      {
        subtaskId: U,
        parentCode: n == null ? void 0 : n.code,
        onClose: () => H(null),
        onOpenFull: (j) => {
          H(null), X(j);
        },
        onDeleted: () => x.invalidateQueries({ queryKey: ["task-detail", l] }),
        currentUserName: ((Ot = (Vt = window == null ? void 0 : window.abp) == null ? void 0 : Vt.currentUser) == null ? void 0 : Ot.name) || ((Ht = (Qt = window == null ? void 0 : window.abp) == null ? void 0 : Qt.currentUser) == null ? void 0 : Ht.userName) || "Ben"
      }
    ),
    /* @__PURE__ */ e.jsx(
      $t,
      {
        open: p.pendingClose,
        isSaving: E,
        errorText: Y ? de("Common:Unsaved:SaveFailed", "Kaydedilemedi. Düzenlemeye dönebilir ya da değişiklikleri atabilirsiniz.") : void 0,
        onStay: ss,
        onDiscard: rs,
        onSave: ns
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col w-full min-h-[calc(100vh-54px)] border-y border-subtle bg-surface-base", children: Rt }),
    qt
  ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(Tt, { open: !0, onOpenChange: (j) => {
      j || ie();
    }, children: /* @__PURE__ */ e.jsx(
      St,
      {
        title: n != null && n.title ? `Görev Detayı: ${n.title}` : "Görev Detayı",
        fullscreen: z,
        className: z ? "p-0 rounded-xl border border-default shadow-xl short:h-[100svh]" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl short:h-[100svh]",
        onInteractOutside: (j) => {
          var T, I;
          j.preventDefault(), !(B || U || p.pendingClose) && ((I = (T = j.target) == null ? void 0 : T.closest) != null && I.call(T, "[data-apya-overlay]") || ie());
        },
        onEscapeKeyDown: (j) => {
          if (B || U) {
            j.preventDefault();
            return;
          }
          if (document.querySelector(".modal.show")) {
            j.preventDefault();
            return;
          }
          j.preventDefault(), ie();
        },
        children: Rt
      }
    ) }),
    qt
  ] });
}
function _n() {
  const t = b.useSyncExternalStore(
    W.subscribe,
    W.getSnapshot,
    () => null
  );
  return t ? /* @__PURE__ */ e.jsx(Ns, { name: "task-detail", fallback: (a) => /* @__PURE__ */ e.jsx(Un, { ...a }), children: /* @__PURE__ */ e.jsx(Vn, { taskId: t }) }) : null;
}
function Un(t) {
  const a = () => {
    var s;
    It(), W.close(), (s = window.apya) != null && s.taskDetailV3Enabled ? W.emitResultIfChanged() : W.emitResult();
  };
  return /* @__PURE__ */ e.jsx(Tt, { open: !0, onOpenChange: (s) => {
    s || a();
  }, children: /* @__PURE__ */ e.jsx(
    St,
    {
      title: de("Common:SectionError:Title", "Bu bölüm gösterilemedi"),
      className: "w-full max-w-[480px] h-auto tablet:min-h-0 justify-center p-6",
      children: /* @__PURE__ */ e.jsx(ws, { ...t, onClose: a })
    }
  ) });
}
function Vn({ taskId: t }) {
  var a;
  return (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(lt, { children: /* @__PURE__ */ e.jsx(
    es,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        W.close(), W.emitResultIfChanged();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(lt, { children: /* @__PURE__ */ e.jsx(
    Wa,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        W.close(), W.emitResult();
      }
    },
    t
  ) });
}
function ts() {
  var s;
  try {
    const r = new URLSearchParams(window.location.search).get("taskui");
    if (r === "v1" || r === "v2" || r === "v3") return r;
  } catch {
  }
  const t = document.getElementById("task-detail-island"), a = (s = t == null ? void 0 : t.dataset) == null ? void 0 : s.taskui;
  return a === "v1" || a === "v2" ? a : "v3";
}
function On() {
  return ts() === "v2";
}
function Qn() {
  return ts() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = Qn();
window.apya.taskDetailV2Enabled = On() && !window.apya.taskDetailV3Enabled;
const Ca = {
  open: (t) => {
    W.open(t);
  },
  close: () => W.close(),
  onResult: (t) => W.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(Ca) : window.apya.taskDetail = Ca;
function Da() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = Ta(t, "task-detail", /* @__PURE__ */ e.jsx(_n, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = Aa();
    a && W.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Da) : Da();
function Hn({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(lt, { children: /* @__PURE__ */ e.jsx(
    es,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(lt, { children: /* @__PURE__ */ e.jsx(
    Wa,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) });
}
const jt = document.getElementById("task-detail-page-island");
if (jt) {
  const t = jt.getAttribute("data-task-id");
  t && Ta(jt, "task-detail-page", /* @__PURE__ */ e.jsx(Hn, { taskId: t }));
}
