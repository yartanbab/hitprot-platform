import { j as e, r as f, b as _e } from "./react-vendor-D7YDiBbi.js";
import { t as de, n as P, E as gs, e as vs, R as js, m as Sa, I as Ns, a as ws } from "./index-DgpuJ91w.js";
import { D as St, g as $t, d as Nt, B as ae, I as Ue, M as ks } from "./Dialog-D3HpJNIB.js";
import { a as lt } from "./QueryProvider-D2Hvqdr9.js";
import { u as Z, a as se, b as te } from "./query-vendor-Db2mwxYI.js";
import { C as $a } from "./Combobox-CHhgTuMW.js";
import { U as Pt, u as Pa } from "./useDirtyGuard-D_9NgM7w.js";
import { i as He, a as Je, s as pe, p as xt, d as Ea, b as Wt, R as Ba, c as Ee, e as Ia, f as Fa, g as Cs, P as Ds } from "./RichTextEditorV3-CNzWfphS.js";
import { r as Ts } from "./httpClient-BNoyY5yK.js";
import { S as we } from "./Skeleton-C92LWNeC.js";
import { R as ke, T as Ce, P as De, C as Te, A as Ss, a as Et, D as $s, b as Ps, c as Es, d as Bs, e as Is } from "./ui-vendor-UYevF8mE.js";
import { d as Aa } from "./draggableActivation-Ybw9Upbh.js";
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
    St,
    {
      open: t,
      onOpenChange: (i) => {
        i || a();
      },
      children: /* @__PURE__ */ e.jsx(
        $t,
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
  const [n, i] = f.useState(!1), u = f.useRef(null);
  f.useEffect(() => {
    if (!n) return;
    const c = (v) => {
      u.current && !u.current.contains(v.target) && i(!1);
    }, d = (v) => {
      v.key === "Escape" && i(!1);
    };
    return document.addEventListener("mousedown", c), document.addEventListener("keydown", d), () => {
      document.removeEventListener("mousedown", c), document.removeEventListener("keydown", d);
    };
  }, [n]);
  const m = wt[t == null ? void 0 : t.status] ?? wt[1], h = kt[t == null ? void 0 : t.priority] ?? kt[2], p = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), i(!1);
  }, x = () => {
    var d, v, y, b;
    const c = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (d = navigator.clipboard) == null || d.writeText(c), (b = (y = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : y.info) == null || b.call(y, "Bağlantı kopyalandı."), i(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(Nt, { variant: m.variant, children: m.text }),
        /* @__PURE__ */ e.jsx(Nt, { variant: h.variant, children: h.text }),
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
      /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: u, children: [
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
                  onClick: x,
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
      /* @__PURE__ */ e.jsx(ae, { variant: "secondary", onClick: r, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        ae,
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
const Zt = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", qs = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function ve({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function Gs({ value: t, onChange: a }) {
  const [s, r] = f.useState(""), l = () => {
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
          className: Zt,
          children: Object.entries(wt).map(([o, n]) => /* @__PURE__ */ e.jsx("option", { value: o, children: n.text }, o))
        }
      ) }),
      /* @__PURE__ */ e.jsx(ve, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (o) => s("priority", Number(o.target.value)),
          className: Zt,
          children: Object.entries(kt).map(([o, n]) => /* @__PURE__ */ e.jsx("option", { value: o, children: n.text }, o))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(ve, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      $a,
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
const Xt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
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
      /* @__PURE__ */ e.jsx(qe, { label: "Oluşturulma zamanı", value: Xt(t.creationTime) }),
      /* @__PURE__ */ e.jsx(qe, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(qe, { label: "Son güncelleme zamanı", value: Xt(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(qe, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const Us = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", Vs = "border-brand-500 text-text-primary";
function Os({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: l }) {
  const o = f.useRef(/* @__PURE__ */ new Map()), n = (u) => {
    var m;
    s(u.code), (m = o.current.get(u.code)) == null || m.focus();
  }, i = (u, m) => {
    u.key === "ArrowRight" ? (u.preventDefault(), n(t[(m + 1) % t.length])) : u.key === "ArrowLeft" ? (u.preventDefault(), n(t[(m - 1 + t.length) % t.length])) : u.key === "Home" ? (u.preventDefault(), n(t[0])) : u.key === "End" && (u.preventDefault(), n(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((u, m) => {
      const h = u.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (p) => {
            p ? o.current.set(u.code, p) : o.current.delete(u.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${u.code}`,
          "aria-selected": h,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: h ? 0 : -1,
          onClick: () => s(u.code),
          onKeyDown: (p) => i(p, m),
          className: `${Us} ${h ? Vs : ""}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa ${u.icon}`, "aria-hidden": "true" }),
            u.title
          ]
        },
        u.code
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
  const [l, o] = f.useState(""), n = f.useMemo(() => {
    const i = l.trim().toLocaleLowerCase("tr-TR"), u = i ? t.filter((h) => h.title.toLocaleLowerCase("tr-TR").includes(i)) : t, m = /* @__PURE__ */ new Map();
    return u.forEach((h) => {
      const p = m.get(h.category) ?? [];
      p.push(h), m.set(h.category, p);
    }), m;
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
          [...n.entries()].map(([i, u]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: Qs[i] ?? i }),
            u.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa ${m.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: m.title }),
              !m.implemented && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              m.implemented && !m.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === m.code,
                  onClick: () => a(m.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              m.implemented && m.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === m.code,
                  onClick: () => s(m.code),
                  className: "text-[13px] font-medium text-text-negative hover:underline disabled:opacity-50",
                  children: "Kaldır"
                }
              )
            ] }, m.code))
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
    var u;
    const i = (u = s == null ? void 0 : s.jqXHR) == null ? void 0 : u.status;
    throw n && typeof n == "object" && n.status == null && i && (n.status = i), n;
  });
}
function Bt(t) {
  return Z({
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
function ne(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
const Zs = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, It = "task";
function za() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(It);
  return t && Zs.test(t) ? t : null;
}
function Ft() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(It), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function La(t, a) {
  const s = f.useRef(a);
  s.current = a, f.useEffect(() => {
    if (!t || za() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(It, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), f.useEffect(() => {
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
function ea(t) {
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
const Ma = (t, a) => JSON.stringify(t) === JSON.stringify(a);
function ta(t, a, s) {
  const r = {};
  for (const l of Object.keys(s)) r[l] = Ma(t[l], a[l]) ? s[l] : t[l];
  return r;
}
function Ka(t) {
  const [a, s] = f.useState(t == null ? void 0 : t.id), r = f.useMemo(() => ea(t), [t]), [l, o] = f.useState(r), [n, i] = f.useState(r), [u, m] = f.useState({});
  if ((t == null ? void 0 : t.id) !== a || r !== l && !Ma(r, l)) {
    const y = (t == null ? void 0 : t.id) !== void 0 && t.id === a;
    s(t == null ? void 0 : t.id), o(r), i(y ? ta(n, l, r) : r), y || m({});
  }
  const h = f.useCallback((y, b) => {
    i((g) => ({ ...g, [y]: b })), m((g) => {
      if (!g[y] && !(y === "startDate" && g.dueDate)) return g;
      const j = { ...g };
      return delete j[y], y === "startDate" && delete j.dueDate, j;
    });
  }, []), p = f.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(r),
    [n, r]
  ), x = f.useCallback(() => {
    const y = {};
    return n.title.trim() || (y.title = de("Tasks:Detail:Validation:TitleRequired", "Başlık zorunlu.")), n.startDate || (y.startDate = de("Tasks:Detail:Validation:StartDateRequired", "Başlangıç tarihi zorunlu.")), n.dueDate && n.startDate && n.dueDate < n.startDate && (y.dueDate = de("Tasks:Detail:Validation:DueBeforeStart", "Son tarih başlangıç tarihinden önce olamaz.")), m(y), Object.keys(y).length === 0;
  }, [n]), c = f.useCallback(() => ({
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
  }), [n, t]), d = f.useCallback(() => {
    i(r), m({});
  }, [r]), v = f.useCallback((y, b) => {
    if (!b) return;
    const g = ea(b);
    i((j) => ta(j, y, g));
  }, []);
  return { values: n, setField: h, isDirty: p, errors: u, validate: x, toUpdateDto: c, reset: d, commitSaved: v };
}
function aa(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function er() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ra() {
  var l;
  const t = Z({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: er,
    staleTime: 3e5,
    retry: !1
  }), a = ((l = t.data) == null ? void 0 : l.items) ?? [], s = a.map((o) => ({ value: o.id, label: aa(o) })), r = new Map(a.map((o) => [o.id, aa(o)]));
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
function qa(t) {
  const a = se(), s = ["task-features", t], r = Z({
    queryKey: s,
    queryFn: () => tr(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = te({
    mutationFn: (i) => Promise.resolve(Ct().addFeature(t, i)),
    onSuccess: l
  }), n = te({
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
  const a = (l = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.currentUser) == null ? void 0 : l.id, s = !!(a && ((t == null ? void 0 : t.creatorId) === a || (t == null ? void 0 : t.assigneeId) === a)) || ne("Platform.Projects.ManageTeam");
  return {
    canManage: s,
    canEdit: s && ne("Platform.Tasks.Edit"),
    canChangeStatus: s && ne("Platform.Tasks.ChangeStatus"),
    canDelete: s && ne("Platform.Tasks.Delete")
  };
}
const Ga = "rounded-2xl border border-subtle bg-surface-base shadow-xs", Se = `${Ga} overflow-hidden`;
function Qe({ title: t, badge: a, action: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3.5 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: t }),
      a
    ] }),
    s
  ] });
}
function Ya({ children: t, tone: a = "positive" }) {
  const s = a === "positive" ? "bg-success-subtle text-success" : "bg-neutral-subtle text-text-secondary";
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-full font-mono text-[11px] font-bold ${s}`, children: t });
}
function $e({ children: t, bg: a, fg: s }) {
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-[7px] text-[10.5px] font-bold ${a} ${s}`, children: t });
}
function me({ icon: t, title: a, description: s }) {
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
function _a(t) {
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
}, sa = (t = "") => Ua(t) === Ne.image;
function Ua(t = "") {
  var s;
  const a = ((s = t.split(".").pop()) == null ? void 0 : s.toLowerCase()) ?? "";
  return a === "pdf" ? Ne.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(a) ? Ne.image : ["doc", "docx", "odt", "rtf", "txt"].includes(a) ? Ne.doc : ["xls", "xlsx", "csv", "ods"].includes(a) ? Ne.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(a) ? Ne.code : ["zip", "rar", "7z", "tar", "gz"].includes(a) ? Ne.zip : Ne.other;
}
function sr({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, l] = f.useState(""), [o, n] = f.useState(!1), i = se(), u = (a == null ? void 0 : a.subTasks) ?? [], m = u.filter((c) => c.status === 4).length, h = () => i.invalidateQueries({ queryKey: ["task-detail", t] }), p = async () => {
    const c = r.trim();
    if (c) {
      n(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: c,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), l(""), await h();
      } catch (d) {
        P(d, "Alt görev eklenemedi.");
      } finally {
        n(!1);
      }
    }
  }, x = async (c, d) => {
    c.stopPropagation();
    try {
      await Promise.resolve(window.apya.platform.tasks.task.updateStatus(d.id, d.status === 4 ? 1 : 4)), await h();
    } catch (v) {
      P(v, "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        u.length > 0 && /* @__PURE__ */ e.jsxs(Ya, { children: [
          m,
          "/",
          u.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: p,
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
      u.map((c) => {
        const d = pe(c.status), v = c.status === 4, y = Oe(c).canChangeStatus;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => s == null ? void 0 : s(c.id, c.title),
            onKeyDown: (b) => {
              b.key === "Enter" && (s == null || s(c.id, c.title));
            },
            className: "flex items-center gap-3.5 px-4 py-3.5 border-t border-subtle first:border-t-0 hover:bg-surface-raised cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": `${c.title} tamamlandı işaretle`,
                  onClick: (b) => x(b, c),
                  disabled: !y,
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white ${y ? "cursor-pointer" : "cursor-default"} ${v ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: v && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: c.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${v ? "line-through text-text-tertiary" : "text-text-primary"}`, children: c.title }),
              /* @__PURE__ */ e.jsx($e, { bg: d.bg, fg: d.fg, children: d.label }),
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
            c.key === "Enter" && p();
          },
          disabled: o,
          placeholder: "Yeni alt görev başlığı",
          className: "w-full h-9 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      ) })
    ] }),
    u.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz alt görev yok." })
  ] });
}
function Va() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function rr(t) {
  const a = Va();
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
function At(t) {
  const a = se(), s = ["task-attachments", t], r = Z({
    queryKey: s,
    queryFn: () => rr(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = te({
    mutationFn: (i) => nr(t, i),
    onSuccess: l
  }), n = te({
    mutationFn: (i) => Promise.resolve(Va().deleteAttachment(i)),
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
  const { attachments: a, upload: s, remove: r, isUploading: l } = At(t), o = se(), n = f.useRef(null), [i, u] = f.useState(!1), m = ne("Platform.Tasks.ShareExternally"), h = async (c, d) => {
    try {
      await window.apya.platform.tasks.taskShare.setAttachmentGuestVisibility(c, d), o.invalidateQueries({ queryKey: ["task-attachments", t] });
    } catch (v) {
      P(v, "Görünürlük değiştirilemedi.");
    }
  }, p = async (c) => {
    var d, v, y;
    if (c)
      try {
        await s(c), (y = (v = (d = window == null ? void 0 : window.abp) == null ? void 0 : d.notify) == null ? void 0 : v.success) == null || y.call(v, "Dosya yüklendi.");
      } catch (b) {
        P(b, "Dosya yüklenemedi.");
      } finally {
        n.current && (n.current.value = "");
      }
  }, x = async (c, d) => {
    try {
      await r(c);
    } catch (v) {
      P(v, `${d} silinemedi.`);
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
          var d;
          return p((d = c.target.files) == null ? void 0 : d[0]);
        },
        disabled: l
      }
    ),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3", children: a.map((c) => {
      const d = Ua(c.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${d.bg} ${d.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: c.fileName, children: c.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: _a(c.fileSize) })
              ] })
            ] }),
            m && !c.isGuestUpload && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 text-[11px] text-text-tertiary cursor-pointer", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: !!c.isVisibleToGuests,
                  onChange: (v) => h(c.id, v.target.checked)
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
                    onClick: () => x(c.id, c.fileName),
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
          var d;
          c.key === "Enter" && ((d = n.current) == null || d.click());
        },
        onDragOver: (c) => {
          c.preventDefault(), i || u(!0);
        },
        onDragLeave: () => u(!1),
        onDrop: (c) => {
          var d, v;
          c.preventDefault(), u(!1), p((v = (d = c.dataTransfer) == null ? void 0 : d.files) == null ? void 0 : v[0]);
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
function zt(t) {
  const a = se(), s = ["task-checklist", t], r = Z({
    queryKey: s,
    queryFn: () => lr(t),
    enabled: !!t,
    staleTime: 3e4,
    /* toggleChecklistItem ters çevirir; bayat gösterim yanlış yöne yazar (proje
       konsolu paneli aynı maddeyi React Query dışından değiştiriyor). */
    meta: { persist: !1 },
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = te({
    mutationFn: (u) => Promise.resolve(nt().addChecklistItem(t, u)),
    onSuccess: l
  }), n = te({
    mutationFn: (u) => Promise.resolve(nt().toggleChecklistItem(u)),
    onSuccess: l
  }), i = te({
    mutationFn: (u) => Promise.resolve(nt().deleteChecklistItem(u)),
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
  const { items: s, isLoading: r, addItem: l, toggleItem: o, removeItem: n } = zt(t), [i, u] = f.useState(""), m = s.filter((x) => x.isDone).length, h = s.length ? Math.round(m / s.length * 100) : 0, p = async () => {
    const x = i.trim();
    if (!(!x || !t)) {
      u("");
      try {
        await l(x);
      } catch (c) {
        u(x), P(c, "Madde eklenemedi.");
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
        /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
          m,
          "/",
          s.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: [
        "%",
        h
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mt-3.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
      "div",
      {
        className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
        style: { width: `${h}%` }
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
      r && s.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 py-2 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
      !r && s.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 py-2 text-[12.5px] text-text-tertiary", children: a ? "Henüz madde yok." : "Henüz madde yok. Aşağıdan ilk maddeyi ekleyin." }),
      s.map((x) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            disabled: a,
            "aria-label": x.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
            onClick: () => o(x.id).catch((c) => P(c, "Durum güncellenemedi.")),
            className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${a ? "cursor-default" : "cursor-pointer"} transition-colors duration-fast ${x.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
            children: x.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${x.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: x.text }),
        !a && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            title: "Sil",
            "aria-label": `${x.text} maddesini sil`,
            onClick: () => n(x.id).catch((c) => P(c, "Madde silinemedi.")),
            className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
          }
        )
      ] }, x.id)),
      !a && /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: i,
          onChange: (x) => u(x.target.value),
          onKeyDown: (x) => {
            x.key === "Enter" && p();
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
  const [s, r] = f.useState(""), [l, o] = f.useState(null), [n, i] = f.useState(""), [u, m] = f.useState(!1), h = se(), p = (a == null ? void 0 : a.comments) ?? [], x = async (d) => {
    var v, y, b;
    if (d == null || d.preventDefault(), !(!s.trim() || u)) {
      m(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), h.invalidateQueries({ queryKey: ["task-detail", t] }), (b = (y = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : y.success) == null || b.call(y, "Yorum eklendi.");
      } catch (g) {
        P(g, "Yorum eklenemedi.");
      } finally {
        m(!1);
      }
    }
  }, c = async (d) => {
    var v, y, b;
    if (!(!n.trim() || u)) {
      m(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(d, n.trim())
        ), i(""), o(null), h.invalidateQueries({ queryKey: ["task-detail", t] }), (b = (y = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : y.success) == null || b.call(y, "Yanıt eklendi.");
      } catch (g) {
        P(g, "Yanıt eklenemedi.");
      } finally {
        m(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("form", { onSubmit: x, className: "rounded-lg border border-default p-3 bg-surface-base", children: [
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
        ae,
        {
          type: "submit",
          variant: "primary",
          disabled: !s.trim() || u,
          isLoading: u,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    p.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: p.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: d.creatorUserName || d.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: d.creationTime ? new Date(d.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: d.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        ae,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => o(l === d.id ? null : d.id),
          children: "Yanıtla"
        }
      ) }),
      l === d.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: n,
            onChange: (v) => i(v.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(ae, { variant: "ghost", size: "sm", onClick: () => o(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(ae, { variant: "primary", size: "sm", disabled: !n.trim() || u, onClick: () => c(d.id), children: "Gönder" })
        ] })
      ] }),
      d.replies && d.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: d.replies.map((v) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: v.creatorUserName || v.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: v.creationTime ? new Date(v.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: v.text })
      ] }, v.id)) })
    ] }, d.id)) })
  ] });
}
function mt() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.taskShare) ?? null;
}
function dr(t) {
  const a = se(), s = ["task-share-links", t], r = Z({
    queryKey: s,
    queryFn: () => {
      const i = mt();
      return i ? Promise.resolve(i.getList(t)) : Promise.reject(new Error("Paylaşım servisi yüklenmedi."));
    },
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = te({
    mutationFn: (i) => Promise.resolve(mt().create({ ...i, taskId: t })),
    onSuccess: l
  }), n = te({
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
const ra = {
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
  const { links: a, isPending: s, create: r, revoke: l, isCreating: o } = dr(t), [n, i] = f.useState(ra), [u, m] = f.useState(null);
  if (!ne("Platform.Tasks.ShareExternally"))
    return /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Görevi ekip dışıyla paylaşma yetkiniz yok." });
  const p = (y) => (b) => {
    const g = b.target.type === "checkbox" ? b.target.checked : b.target.value;
    i((j) => ({ ...j, [y]: g }));
  }, x = async (y) => {
    if (y.preventDefault(), !!n.recipientName.trim())
      try {
        const b = await r({
          ...n,
          lifetimeDays: Number(n.lifetimeDays) || 14
        });
        m(b), i(ra);
      } catch (b) {
        P(b, "Paylaşım linki üretilemedi.");
      }
  }, c = (y) => `${window.location.origin}${y}`, d = (y) => {
    var b, g, j, T;
    (b = navigator.clipboard) == null || b.writeText(c(y)), (T = (j = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : j.info) == null || T.call(j, "Bağlantı kopyalandı.");
  }, v = async (y) => {
    try {
      await l(y);
    } catch (b) {
      P(b, "Bağlantı iptal edilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    u && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 rounded-[14px] border border-focus bg-primary-subtle p-3.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "text-[12.5px] font-bold text-text-primary", children: [
        "Bağlantı hazır — ",
        /* @__PURE__ */ e.jsx("span", { className: "font-normal", children: "şimdi kopyalayın, bir daha gösterilmeyecek." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("code", { className: "min-w-0 flex-1 truncate rounded-[8px] bg-surface-base px-2.5 py-2 font-mono text-[11.5px] text-text-secondary", children: c(u.url) }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => d(u.url),
            className: "rounded-[8px] bg-primary px-3 py-2 text-[12px] font-bold text-white cursor-pointer",
            children: "Kopyala"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => m(null),
            className: "rounded-[8px] px-3 py-2 text-[12px] font-bold text-text-tertiary cursor-pointer hover:text-text-primary",
            children: "Kapat"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("form", { onSubmit: x, className: "flex flex-col gap-2.5 rounded-[14px] border border-subtle bg-surface-base p-3.5", children: [
      /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary", children: "Yeni paylaşım bağlantısı" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2.5", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            required: !0,
            value: n.recipientName,
            onChange: p("recipientName"),
            placeholder: "Kime? (ad soyad)",
            className: "min-w-0 flex-[2_1_180px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "email",
            value: n.recipientEmail,
            onChange: p("recipientEmail"),
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
            onChange: p("lifetimeDays"),
            title: "Geçerlilik (gün)",
            className: "w-[92px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: n.allowComment, onChange: p("allowComment") }),
          "Yorum yazabilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: n.allowUpload, onChange: p("allowUpload") }),
          "Dosya yükleyebilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: n.allowDownload, onChange: p("allowDownload") }),
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
              onClick: () => v(y.id),
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
  const a = ne("Platform.Projects.ViewBudget"), s = Z({
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
const Oa = () => ne("Platform.Documents"), yr = () => ne("Platform.Documents.ManageMeta");
function gr(t) {
  const a = !!t && Oa(), s = Z({
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
  const s = Z({
    queryKey: ["task-detail", "expense-candidates", t],
    queryFn: () => ct({ url: dt("Candidates", { expenseId: t }), type: "GET" }),
    enabled: !!t && a && Oa(),
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  });
  return { candidates: s.data ?? [], isLoading: s.isLoading };
}
function jr(t) {
  const a = se(), s = (o) => {
    a.invalidateQueries({ queryKey: ["task-detail", "expense-matches", t] }), a.invalidateQueries({ queryKey: ["task-detail", "expense-candidates", o] });
  }, r = te({
    mutationFn: ({ documentFileId: o, expenseId: n, score: i }) => ct({
      url: dt("CreateMatch"),
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ documentFileId: o, expenseId: n, score: i ?? 0 })
    }),
    onSuccess: (o, n) => s(n.expenseId)
  }), l = te({
    mutationFn: ({ matchId: o }) => ct({ url: dt("RemoveMatch", { matchId: o }), type: "POST" }),
    onSuccess: (o, n) => s(n.expenseId)
  });
  return { link: r, unlink: l, isBusy: r.isPending || l.isPending };
}
function Nr(t) {
  return t == null ? "—" : new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 2 }).format(t);
}
function wr({ expenseId: t, projectId: a, matches: s }) {
  const { candidates: r, isLoading: l } = vr(t, !0), { link: o, unlink: n, isBusy: i } = jr(a), u = yr(), m = new Set(s.map((p) => p.documentFileId)), h = r.filter((p) => !m.has(p.documentFileId));
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
        u && /* @__PURE__ */ e.jsx(
          ae,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            disabled: i,
            onClick: () => n.mutate(
              { matchId: p.id, expenseId: t },
              { onError: (x) => P(x, "Evrak bağı kaldırılamadı.") }
            ),
            children: "Kaldır"
          }
        )
      ] }, p.id))
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Aday evraklar" }),
      l && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Adaylar aranıyor…" }),
      !l && h.length === 0 && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Eşleşen aday yok. Evrak Belgeler modülünden yüklenip buradan bağlanır." }),
      h.map((p) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[11px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12px] text-text-primary", children: p.displayName }),
        /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
          Nr(p.amount),
          " · ",
          Me(p.documentDate)
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: `shrink-0 font-mono text-[11px] font-bold ${p.isStrong ? "text-success" : "text-text-tertiary"}`, children: [
          "%",
          p.score
        ] }),
        u && /* @__PURE__ */ e.jsx(
          ae,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            disabled: i,
            onClick: () => o.mutate(
              { documentFileId: p.documentFileId, expenseId: t, score: p.score },
              { onError: (x) => P(x, "Evrak bağlanamadı.") }
            ),
            children: "Bağla"
          }
        )
      ] }, p.documentFileId))
    ] })
  ] });
}
function be(t, a) {
  const s = a || "TRY";
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: s, minimumFractionDigits: 2 }).format(t || 0);
  } catch {
    return `${(t || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${s}`.trim();
  }
}
const kr = ["pointerdown", "focusin", "wheel", "touchmove"], Cr = (t) => t.stopPropagation();
function Dr(t, a, s, r) {
  var u, m, h, p, x, c, d;
  const l = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.ModalManager;
  if (!l) {
    (p = (h = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : h.error) == null || p.call(h, "Kayıt formu yüklenemedi."), r == null || r();
    return;
  }
  const o = ((x = window == null ? void 0 : window.abp) == null ? void 0 : x.appPath) ?? "/";
  (d = (c = document.activeElement) == null ? void 0 : c.blur) == null || d.call(c);
  const n = new l({ viewUrl: `${o}${t}?TaskId=${a}` });
  n.onResult(() => s == null ? void 0 : s()), n.onOpen(() => r == null ? void 0 : r()), n.open();
  const i = document.getElementById(n.getModalId());
  i && (i.setAttribute("data-apya-overlay", "abp-modal"), i.style.pointerEvents = "auto", kr.forEach((v) => i.addEventListener(v, Cr, { passive: !0 }))), setTimeout(() => r == null ? void 0 : r(), 1e4);
}
function Tr({ taskId: t }) {
  const a = se(), [s, r] = f.useState(null), l = ne("Platform.Expenses.Create"), o = ne("Platform.Incomes.Create"), n = ne("Platform.Invoices.Create");
  if (!t || !l && !o && !n)
    return null;
  const i = () => a.invalidateQueries({ queryKey: ["task-detail", t] }), u = (m) => {
    s || (r(m), Dr(m, t, i, () => r((h) => h === m ? null : h)));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
    l && /* @__PURE__ */ e.jsxs(
      ae,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        isLoading: s === "Expenses/CreateModal",
        disabled: !!s,
        onClick: () => u("Expenses/CreateModal"),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-up text-[11px]" }),
          "Gider ekle"
        ]
      }
    ),
    o && /* @__PURE__ */ e.jsxs(
      ae,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        isLoading: s === "Incomes/CreateModal",
        disabled: !!s,
        onClick: () => u("Incomes/CreateModal"),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-down text-[11px]" }),
          "Gelir ekle"
        ]
      }
    ),
    n && /* @__PURE__ */ e.jsxs(
      ae,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        isLoading: s === "Invoices/CreateModal",
        disabled: !!s,
        onClick: () => u("Invoices/CreateModal"),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-invoice text-[11px]" }),
          "Fatura ekle"
        ]
      }
    )
  ] });
}
const na = {
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
      const r = na[s.status] ?? na[0];
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
            /* @__PURE__ */ e.jsx($e, { bg: r.bg, fg: r.fg, children: r.label }),
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary",
                style: { fontVariantNumeric: "tabular-nums" },
                children: be(s.totalAmount, s.currency)
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
  const [l, o] = f.useState(!1), n = t.kind === "income";
  return /* @__PURE__ */ e.jsxs("div", { className: "border-t border-subtle first:border-t-0", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5 px-4 py-3 hover:bg-surface-raised", children: [
      /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-7 w-7 rounded-lg bg-neutral-subtle text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n ? "fa-arrow-down" : "fa-arrow-up"} text-[11px]` }) }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] font-semibold text-text-primary", children: t.title || (n ? "Gelir" : "Gider") }),
      r && /* @__PURE__ */ e.jsxs(
        ae,
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
      n ? /* @__PURE__ */ e.jsx($e, { bg: "bg-success-subtle", fg: "text-success", children: "Gelir" }) : /* @__PURE__ */ e.jsx($e, { bg: "bg-warning-subtle", fg: "text-warning", children: "Gider" }),
      /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: `shrink-0 font-mono text-[12.5px] font-bold ${n ? "text-success" : "text-text-primary"}`,
          style: { fontVariantNumeric: "tabular-nums" },
          children: [
            n ? "+" : "−",
            be(t.amount, t.currency)
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
        $a,
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
  const l = (a ? a.values.projectId : t == null ? void 0 : t.projectId) ?? null, { options: o, lines: n, canViewBudget: i, isLoading: u } = hr(l), m = !!a && !r && i && !!l, h = (a ? a.values.budgetLineId : t == null ? void 0 : t.budgetLineId) ?? null, p = (a ? a.values.plannedAmount : t == null ? void 0 : t.plannedAmount) ?? null;
  if (!m && (!h || p == null))
    return null;
  const x = n.find((T) => T.id === h), c = x ? x.remainingAmount : t == null ? void 0 : t.budgetLineRemaining, d = s, v = !!h && p != null, y = (p ?? 0) - d, b = p > 0 ? Math.round(d / p * 100) : 0, g = y < 0, j = () => {
    a.setField("budgetLineId", null), a.setField("plannedAmount", null);
  };
  return (
    /* Kırpmayan kart ŞART: kalem seçicisinin listesi kartın içine absolute
       konumlanır, TAB_CARD'ın overflow-hidden'ı onu alt kenarda keserdi. */
    /* @__PURE__ */ e.jsxs("div", { className: Ga, children: [
      /* @__PURE__ */ e.jsx(
        Qe,
        {
          title: "Bütçe bağı",
          action: m && h ? /* @__PURE__ */ e.jsx(ae, { type: "button", variant: "ghost", size: "sm", onClick: j, children: "Bağı kaldır" }) : null
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "px-4 pb-4 pt-1 flex flex-col gap-3", children: [
        m ? /* @__PURE__ */ e.jsx(
          Pr,
          {
            options: o,
            isLoading: u,
            lineId: h,
            planned: p,
            onField: a.setField
          }
        ) : /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-semibold text-accent", children: t.budgetLineName || "Bütçe kalemi" }) }),
        c != null && /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "kalemde kalan ",
          be(c, "TRY")
        ] }),
        v && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3", children: [
            /* @__PURE__ */ e.jsx(bt, { label: "Görev bütçesi", value: be(p, "TRY") }),
            /* @__PURE__ */ e.jsx(bt, { label: "Gerçekleşen", value: be(d, "TRY") }),
            /* @__PURE__ */ e.jsx(
              bt,
              {
                label: "Kalan",
                value: be(y, "TRY"),
                tone: g ? "text-negative" : "text-success"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
              "div",
              {
                className: `h-full rounded-full ${g ? "bg-negative" : b >= 80 ? "bg-warning" : "bg-success"}`,
                style: { width: `${Math.min(Math.max(b, 0), 100)}%` }
              }
            ) }),
            /* @__PURE__ */ e.jsxs("div", { className: "mt-1 text-[11.5px] text-text-tertiary", children: [
              "%",
              b,
              g && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative", children: "· görev bütçesi aşıldı" })
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
  const l = (t == null ? void 0 : t.expenses) || [], o = (t == null ? void 0 : t.incomes) || [], n = (t == null ? void 0 : t.invoices) || [], i = (s ? s.values.projectId : t == null ? void 0 : t.projectId) ?? null, { byExpense: u, enabled: m } = gr(i), h = l.filter((y) => (y.currency || "TRY") === "TRY").reduce((y, b) => y + (b.amount || 0), 0), p = /* @__PURE__ */ e.jsx(Er, { task: t, form: s, spentByCurrency: h, readOnly: r }), x = /* @__PURE__ */ e.jsx(Tr, { taskId: a ?? (t == null ? void 0 : t.id) });
  if (l.length === 0 && o.length === 0 && n.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      p,
      /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
        /* @__PURE__ */ e.jsx(Qe, { title: "Görev Finansı", action: x }),
        /* @__PURE__ */ e.jsx(
          me,
          {
            icon: "fa-coins",
            title: "Kayıt yok",
            description: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
          }
        )
      ] })
    ] });
  const d = Array.from(new Set([...l, ...o].map((y) => y.currency || "TRY"))).map((y) => {
    const b = o.filter((j) => (j.currency || "TRY") === y).reduce((j, T) => j + (T.amount || 0), 0), g = l.filter((j) => (j.currency || "TRY") === y).reduce((j, T) => j + (T.amount || 0), 0);
    return { cur: y, inc: b, exp: g, net: b - g };
  }), v = [
    ...o.map((y) => ({ ...y, kind: "income" })),
    ...l.map((y) => ({ ...y, kind: "expense" }))
  ].sort((y, b) => new Date(b.date || 0) - new Date(y.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    p,
    d.map(({ cur: y, inc: b, exp: g, net: j }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(ft, { label: `Toplam Gelir (${y})`, value: be(b, y), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(ft, { label: `Toplam Gider (${y})`, value: be(g, y), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        ft,
        {
          label: `Net Bakiye (${y})`,
          value: be(j, y),
          tone: j >= 0 ? "text-success" : "text-negative",
          note: j >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, y)),
    n.length > 0 && /* @__PURE__ */ e.jsx(Sr, { invoices: n, action: v.length === 0 ? x : null }),
    v.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
      /* @__PURE__ */ e.jsx(Qe, { title: "Finans kalemleri", action: x }),
      v.map((y) => /* @__PURE__ */ e.jsx(
        $r,
        {
          line: y,
          projectId: i,
          matches: y.kind === "expense" ? u.get(y.id) ?? [] : [],
          docsEnabled: m && y.kind === "expense"
        },
        `${y.kind}-${y.id}`
      ))
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11px] text-text-tertiary", children: "Buradan eklenen kayıt göreve ve projesine etiketlenir; düzenleme/silme Finans modülünden yapılır. Evraklar Belgeler modülünde yaşar, buradan gidere bağlanır." })
  ] });
}
function Ir({ taskId: t }) {
  const { attachments: a, isLoading: s, upload: r, remove: l, isUploading: o } = At(t), n = f.useRef(null), [i, u] = f.useState(!1), m = a.filter((x) => sa(x.fileName)), h = async (x) => {
    var c, d, v, y, b, g;
    if (x) {
      if (!sa(x.name)) {
        (v = (d = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : d.error) == null || v.call(d, "Galeriye yalnız görsel dosya yüklenebilir.");
        return;
      }
      try {
        await r(x), (g = (b = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : b.success) == null || g.call(b, "Görsel yüklendi.");
      } catch (j) {
        P(j, "Görsel yüklenemedi.");
      } finally {
        n.current && (n.current.value = "");
      }
    }
  }, p = async (x, c) => {
    try {
      await l(x);
    } catch (d) {
      P(d, `${c} silinemedi.`);
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
        onChange: (x) => {
          var c;
          return h((c = x.target.files) == null ? void 0 : c[0]);
        },
        disabled: o
      }
    ),
    s && m.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !s && m.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görevde henüz görsel yok. Yüklediğiniz görseller Dosyalar sekmesinde de görünür." }),
    m.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3", children: m.map((x) => /* @__PURE__ */ e.jsxs(
      "figure",
      {
        className: "group relative m-0 flex flex-col overflow-hidden rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
        children: [
          /* @__PURE__ */ e.jsx(
            "a",
            {
              href: x.downloadUrl,
              target: "_blank",
              rel: "noreferrer",
              title: `${x.fileName} — tam boyutta aç`,
              className: "block aspect-[4/3] overflow-hidden bg-neutral-subtle",
              children: /* @__PURE__ */ e.jsx(
                "img",
                {
                  src: x.downloadUrl,
                  alt: x.fileName,
                  loading: "lazy",
                  className: "h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                }
              )
            }
          ),
          /* @__PURE__ */ e.jsxs("figcaption", { className: "flex items-center justify-between gap-2 p-2.5", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12px] font-bold text-text-primary", title: x.fileName, children: x.fileName }),
              /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: _a(x.fileSize) })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                title: "Sil",
                "aria-label": `${x.fileName} gorselini sil`,
                onClick: () => p(x.id, x.fileName),
                className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
              }
            )
          ] })
        ]
      },
      x.id
    )) }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "button",
        tabIndex: 0,
        onClick: () => {
          var x;
          return (x = n.current) == null ? void 0 : x.click();
        },
        onKeyDown: (x) => {
          var c;
          x.key === "Enter" && ((c = n.current) == null || c.click());
        },
        onDragOver: (x) => {
          x.preventDefault(), i || u(!0);
        },
        onDragLeave: () => u(!1),
        onDrop: (x) => {
          var c, d;
          x.preventDefault(), u(!1), h((d = (c = x.dataTransfer) == null ? void 0 : c.files) == null ? void 0 : d[0]);
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
function ia(t, a) {
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
  const l = ia(t, s), o = ia(a, s), n = l === null || l === "", i = o === null || o === "";
  return n && i ? 0 : n ? 1 : i ? -1 : l === o ? 0 : (l < o ? -1 : 1) * (r === "asc" ? 1 : -1);
}
function zr({ task: t = {}, onOpenSubtask: a }) {
  const [s, r] = f.useState({ key: "dueDate", dir: "asc" }), l = (t == null ? void 0 : t.subTasks) ?? [], o = f.useMemo(
    () => [...l].sort((i, u) => Ar(i, u, s.key, s.dir)),
    [l, s.key, s.dir]
  ), n = (i) => r((u) => u.key === i ? { key: i, dir: u.dir === "asc" ? "desc" : "asc" } : { key: i, dir: "asc" });
  return l.length === 0 ? /* @__PURE__ */ e.jsx(
    me,
    {
      icon: "fa-table",
      title: "Alt görev yok",
      description: "Alt Görevler sekmesinden ekledikleriniz burada tablo olarak listelenir."
    }
  ) : /* @__PURE__ */ e.jsx("div", { className: `${Se} overflow-x-auto`, children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse text-[12.5px]", children: [
    /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsx("tr", { className: "bg-surface-raised", children: Fr.map((i) => {
      const u = s.key === i.key;
      return /* @__PURE__ */ e.jsx(
        "th",
        {
          scope: "col",
          "aria-sort": u ? s.dir === "asc" ? "ascending" : "descending" : "none",
          className: `px-3.5 py-2.5 border-b border-subtle font-bold text-text-secondary whitespace-nowrap ${i.align === "right" ? "text-right" : "text-left"}`,
          children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => n(i.key),
              className: `inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer font-bold ${u ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`,
              children: [
                i.label,
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid text-[9px] ${u ? s.dir === "asc" ? "fa-arrow-up-short-wide" : "fa-arrow-down-wide-short" : "fa-sort opacity-40"}` })
              ]
            }
          )
        },
        i.key
      );
    }) }) }),
    /* @__PURE__ */ e.jsx("tbody", { children: o.map((i) => {
      const u = pe(i.status), m = xt(i.priority), h = Ea(i.dueDate);
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
                  onClick: (p) => {
                    p.stopPropagation(), a == null || a(i.id);
                  },
                  title: i.title,
                  className: `block w-full truncate bg-transparent border-0 p-0 text-left font-semibold cursor-pointer ${i.status === 4 ? "line-through text-text-tertiary" : "text-text-primary"}`,
                  children: i.title
                }
              ),
              i.code && /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: i.code })
            ] }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs($e, { bg: u.bg, fg: u.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-[9px] mr-1` }),
              u.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs($e, { bg: m.bg, fg: m.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${m.icon} text-[9px] mr-1` }),
              m.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: i.assigneeName ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ e.jsx(ut, { name: i.assigneeName, size: 22 }),
              /* @__PURE__ */ e.jsx("span", { className: "truncate text-text-secondary", children: i.assigneeName })
            ] }) : /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: "Atanmadı" }) }),
            /* @__PURE__ */ e.jsxs("td", { className: `px-3.5 py-2.5 text-right whitespace-nowrap ${h.tone}`, children: [
              i.dueDate ? Me(i.dueDate) : "—",
              h.hint && /* @__PURE__ */ e.jsx("div", { className: "text-[11px]", children: h.hint })
            ] })
          ]
        },
        i.id
      );
    }) })
  ] }) });
}
function Lr({ taskId: t, task: a = {}, onOpenSubtask: s }) {
  const r = se(), l = (a == null ? void 0 : a.subTasks) ?? [], [o, n] = f.useState(null), [i, u] = f.useState(null), m = async (h, p) => {
    const x = l.find((c) => c.id === h);
    if (!(!x || x.status === p || !Oe(x).canChangeStatus)) {
      u(h);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.updateStatus(h, p)), await r.invalidateQueries({ queryKey: ["task-detail", t] });
      } catch (c) {
        P(c, "Alt görev durumu güncellenemedi.");
      } finally {
        u(null);
      }
    }
  };
  return l.length === 0 ? /* @__PURE__ */ e.jsx(
    me,
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 items-start", children: Wt.map((h) => {
      const p = pe(h), x = l.filter((d) => d.status === h), c = o === h;
      return /* @__PURE__ */ e.jsxs(
        "section",
        {
          "aria-label": `${p.label} sütunu`,
          onDragOver: (d) => {
            d.preventDefault(), o !== h && n(h);
          },
          onDragLeave: () => n((d) => d === h ? null : d),
          onDrop: (d) => {
            var y;
            d.preventDefault(), n(null);
            const v = (y = d.dataTransfer) == null ? void 0 : y.getData("text/plain");
            v && m(v, h);
          },
          className: `flex flex-col gap-2 p-2.5 rounded-2xl border bg-surface-raised min-h-[120px] transition-colors duration-fast ${c ? "border-focus bg-primary-subtle" : "border-subtle"}`,
          children: [
            /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-2 px-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${p.dot}` }),
              /* @__PURE__ */ e.jsx("h3", { className: "m-0 flex-1 text-[12px] font-bold text-text-primary", children: p.label }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: x.length })
            ] }),
            x.map((d) => {
              const v = xt(d.priority), y = Oe(d).canChangeStatus;
              return /* @__PURE__ */ e.jsxs(
                "article",
                {
                  draggable: y,
                  onDragStart: (b) => {
                    var g;
                    return (g = b.dataTransfer) == null ? void 0 : g.setData("text/plain", d.id);
                  },
                  role: "button",
                  tabIndex: 0,
                  onClick: () => s == null ? void 0 : s(d.id),
                  onKeyDown: (b) => {
                    b.key === "Enter" && (s == null || s(d.id));
                  },
                  className: `flex flex-col gap-2 p-2.5 rounded-[12px] border border-subtle bg-surface-base shadow-xs cursor-pointer hover:border-focus hover:shadow-md ${i === d.id ? "opacity-60" : ""}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary line-clamp-2", children: d.title }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                      /* @__PURE__ */ e.jsxs("span", { className: `text-[10.5px] font-bold ${v.fg}`, children: [
                        /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${v.icon} text-[9px] mr-1` }),
                        v.label
                      ] }),
                      d.dueDate && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: Me(d.dueDate) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2 border-t border-subtle", children: [
                      d.assigneeName ? /* @__PURE__ */ e.jsx(ut, { name: d.assigneeName, size: 20 }) : /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] text-text-tertiary", children: "Atanmadı" }),
                      /* @__PURE__ */ e.jsx(
                        "select",
                        {
                          "aria-label": `${d.title} durumunu değiştir`,
                          value: d.status,
                          onClick: (b) => b.stopPropagation(),
                          onChange: (b) => m(d.id, Number(b.target.value)),
                          disabled: !y,
                          className: `h-[24px] px-1.5 rounded-[6px] border border-subtle bg-surface-base text-[10.5px] text-text-secondary ${y ? "cursor-pointer" : "cursor-default"}`,
                          children: Wt.map((b) => /* @__PURE__ */ e.jsx("option", { value: b, children: pe(b).label }, b))
                        }
                      )
                    ] })
                  ]
                },
                d.id
              );
            })
          ]
        },
        h
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
], Kr = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], la = (t) => String(t).padStart(2, "0"), Qa = (t, a, s) => `${t}-${la(a + 1)}-${la(s)}`;
function Dt(t) {
  if (!t) return null;
  const a = /^(\d{4}-\d{2}-\d{2})/.exec(String(t));
  return a ? a[1] : null;
}
function Rr(t, a) {
  const r = (new Date(t, a, 1).getDay() + 6) % 7, l = new Date(t, a + 1, 0).getDate(), o = [];
  for (let n = 0; n < 42; n++) {
    const i = n - r + 1;
    o.push(i >= 1 && i <= l ? { key: Qa(t, a, i), day: i, inMonth: !0 } : { key: `bos-${n}`, day: null, inMonth: !1 });
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
  const s = f.useMemo(() => qr(t), [t]), [r, l] = f.useState(() => {
    const m = Dt(t == null ? void 0 : t.startDate) ?? Dt(t == null ? void 0 : t.dueDate);
    if (m) {
      const [p, x] = m.split("-").map(Number);
      return { year: p, month: x - 1 };
    }
    const h = /* @__PURE__ */ new Date();
    return { year: h.getFullYear(), month: h.getMonth() };
  }), o = f.useMemo(() => Rr(r.year, r.month), [r.year, r.month]), n = (m) => l(({ year: h, month: p }) => {
    const x = p + m;
    return { year: h + Math.floor(x / 12), month: (x % 12 + 12) % 12 };
  }), i = /* @__PURE__ */ new Date(), u = Qa(i.getFullYear(), i.getMonth(), i.getDate());
  return s.size === 0 ? /* @__PURE__ */ e.jsx(
    me,
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-subtle bg-surface-raised", children: Kr.map((m) => /* @__PURE__ */ e.jsx("span", { className: "px-2 py-1.5 text-center text-[11px] font-bold text-text-tertiary", children: m }, m)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: o.map((m) => {
      const h = m.inMonth ? s.get(m.key) ?? [] : [], p = m.key === u;
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: `flex flex-col gap-1 min-h-[76px] p-1.5 border-r border-b border-subtle last-of-type:border-r-0 ${m.inMonth ? "" : "bg-surface-sunken"}`,
          children: [
            m.inMonth && /* @__PURE__ */ e.jsx("span", { className: `self-end font-mono text-[11px] font-bold ${p ? "flex items-center justify-center h-[18px] w-[18px] rounded-full bg-primary text-white" : "text-text-tertiary"}`, children: m.day }),
            h.map((x, c) => {
              const d = pe(x.status);
              return /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  title: `${x.title} — ${x.kind === "due" ? "termin" : "başlangıç"}`,
                  onClick: () => {
                    x.isSelf || a == null || a(x.id);
                  },
                  className: `flex items-center gap-1 w-full px-1.5 py-[3px] rounded-[6px] text-left text-[10.5px] font-semibold ${d.bg} ${d.fg} ${x.isSelf ? "cursor-default" : "cursor-pointer hover:brightness-95"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x.kind === "due" ? "fa-flag-checkered" : "fa-play"} text-[8px] shrink-0` }),
                    /* @__PURE__ */ e.jsx("span", { className: "truncate", children: x.title })
                  ]
                },
                `${x.id}-${x.kind}-${c}`
              );
            })
          ]
        },
        m.key
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
  const a = se(), s = ["task-documents", t], r = Z({
    queryKey: s,
    queryFn: () => Yr(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = te({
    mutationFn: (u) => Promise.resolve(Ve().createDocument(t, u)),
    onSuccess: l
  }), n = te({
    mutationFn: ({ id: u, title: m, content: h }) => Promise.resolve(Ve().updateDocument(u, { title: m, content: h })),
    onSuccess: (u) => {
      l(), u != null && u.id && a.setQueryData(["task-document", u.id], u);
    }
  }), i = te({
    mutationFn: (u) => Promise.resolve(Ve().deleteDocument(u)),
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
  return Z({
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
  const { documents: a, isLoading: s, createDocument: r, updateDocument: l, removeDocument: o, isSaving: n } = _r(t), [i, u] = f.useState(null), [m, h] = f.useState(""), [p, x] = f.useState(""), [c, d] = f.useState(!1), [v, y] = f.useState(!1), { data: b, isFetching: g } = Ur(i);
  f.useEffect(() => {
    !b || b.id !== i || (h(b.title ?? ""), x(b.content ?? ""), d(!1));
  }, [b == null ? void 0 : b.id]);
  const j = async () => {
    try {
      const B = await r("Yeni belge");
      B != null && B.id && u(B.id);
    } catch (B) {
      P(B, "Belge oluşturulamadı.");
    }
  }, T = async () => {
    var O, q, G, I, L, _;
    const B = m.trim();
    if (!B)
      return (G = (q = (O = window == null ? void 0 : window.abp) == null ? void 0 : O.notify) == null ? void 0 : q.error) == null || G.call(q, "Belge başlığı boş olamaz."), !1;
    try {
      return await l({ id: i, title: B, content: p }), d(!1), (_ = (L = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : L.success) == null || _.call(L, "Belge kaydedildi."), !0;
    } catch (Q) {
      return P(Q, "Belge kaydedilemedi."), !1;
    }
  }, $ = async (B, O) => {
    try {
      await o(B), i === B && u(null);
    } catch (q) {
      P(q, `“${O}” silinemedi.`);
    }
  }, K = () => {
    if (c) {
      y(!0);
      return;
    }
    u(null);
  };
  return i ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: K,
          "aria-label": "Belge listesine dön",
          className: "flex items-center justify-center h-8 w-8 rounded-[9px] border border-subtle bg-surface-base text-text-tertiary hover:text-text-primary cursor-pointer",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-left text-[12px]" })
        }
      ),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: m,
          "aria-label": "Belge başlığı",
          onChange: (B) => {
            h(B.target.value), d(!0);
          },
          className: "flex-1 min-w-0 h-9 px-3 rounded-[10px] border border-subtle bg-surface-base text-[13.5px] font-bold text-text-primary focus:border-focus focus:shadow-focus focus:outline-none"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: T,
          disabled: n || !c,
          className: `flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[12.5px] font-bold ${n || !c ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n ? "fa-circle-notch fa-spin" : "fa-floppy-disk"} text-[11px]` }),
            n ? "Kaydediliyor…" : c ? "Kaydet" : "Kaydedildi"
          ]
        }
      )
    ] }),
    g && !b ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Belge yükleniyor…" }) : /* @__PURE__ */ e.jsx(
      Ba,
      {
        value: p,
        placeholder: "Belgeyi buraya yazın…",
        onChange: (B) => {
          x(B), d(!0);
        }
      }
    ),
    /* @__PURE__ */ e.jsx(
      Pt,
      {
        open: v,
        isSaving: n,
        onStay: () => y(!1),
        onDiscard: () => {
          y(!1), d(!1), u(null);
        },
        onSave: async () => {
          const B = await T();
          y(!1), B && u(null);
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
          onClick: j,
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
      me,
      {
        icon: "fa-file-lines",
        title: "Henüz belge yok",
        description: "Toplantı notu, teknik şartname ya da teslim tutanağı gibi metinleri buraya yazabilirsiniz."
      }
    ),
    a.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: a.map((B) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "group flex items-center gap-3 px-3.5 py-3 border-b border-subtle last:border-b-0 hover:bg-surface-raised",
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[14px]" }) }),
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => u(B.id),
              className: "flex-1 min-w-0 bg-transparent border-0 p-0 text-left cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[13px] font-bold text-text-primary", children: B.title }),
                /* @__PURE__ */ e.jsx("span", { className: "block text-[11.5px] text-text-tertiary", children: B.contentLength > 0 ? `${B.editorName} · ${ot(B.lastModificationTime ?? B.creationTime)}` : "Boş belge — açıp yazmaya başlayın" })
              ]
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              "aria-label": `${B.title} belgesini sil`,
              onClick: () => $(B.id, B.title),
              className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[12px]" })
            }
          )
        ]
      },
      B.id
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
  const a = se(), s = ["task-forms", t], r = Z({
    queryKey: s,
    queryFn: () => Or(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = te({
    mutationFn: (u) => Promise.resolve(Le().linkForm(t, u)),
    onSuccess: l
  }), n = te({
    mutationFn: (u) => Promise.resolve(Le().unlinkForm(u)),
    onSuccess: l
  }), i = te({
    mutationFn: ({ linkId: u, value: m }) => Promise.resolve(Le().setFormGuestFillable(u, m)),
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
  return Z({
    queryKey: ["task-form-options", t],
    queryFn: () => Promise.resolve(Le().getFormOptions(t)),
    enabled: !!t && !!a,
    meta: { persist: !1 },
    retry: !1
  });
}
function Jr(t, a) {
  return Z({
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
  const { forms: a, isLoading: s, linkForm: r, unlinkForm: l, setGuestFillable: o, isLinking: n } = Qr(t), [i, u] = f.useState(!1), [m, h] = f.useState(null), { data: p, isLoading: x } = Hr(t, i), c = ne("Platform.Tasks.ShareExternally"), d = async (b) => {
    try {
      await r(b), u(!1);
    } catch (g) {
      P(g, "Form bağlanamadı.");
    }
  }, v = async (b) => {
    if (window.confirm(`“${b.title}” bağlantısı kaldırılsın mı? Form ve toplanmış yanıtlar silinmez.`))
      try {
        await l(b.id);
      } catch (g) {
        P(g, "Bağlantı kaldırılamadı.");
      }
  }, y = async (b, g) => {
    try {
      await o({ linkId: b.id, value: g });
    } catch (j) {
      P(j, "Ayar değiştirilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Formlar" }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => u((b) => !b),
          className: "flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${i ? "fa-xmark" : "fa-plus"} text-[11px]` }),
            i ? "Kapat" : "Form bağla"
          ]
        }
      )
    ] }),
    i && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-raised overflow-hidden", children: [
      x && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Formlar yükleniyor…" }),
      !x && !(p != null && p.length) && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Bağlanabilecek form yok. Önce Form Yönetimi'nden bir form oluşturun." }),
      p == null ? void 0 : p.map((b) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          disabled: b.isLinked || n,
          onClick: () => d(b.documentId),
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
    !s && a.length === 0 && !i && /* @__PURE__ */ e.jsx(
      me,
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
            onClick: () => h((g) => g === b.documentId ? null : b.documentId),
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
        b.responseCount > 0 && /* @__PURE__ */ e.jsx(Ya, { children: b.responseCount }),
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
            onClick: () => v(b),
            className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[12px]" })
          }
        )
      ] }),
      c && b.isPublished && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 px-3.5 pb-3 text-[11.5px] text-text-secondary cursor-pointer", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: !!b.isGuestFillable,
            onChange: (g) => y(b, g.target.checked)
          }
        ),
        "Süreli paylaşım linkiyle ekip dışından da doldurulabilsin"
      ] }),
      m === b.documentId && /* @__PURE__ */ e.jsx(Wr, { taskId: t, documentId: b.documentId })
    ] }, b.id))
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
  const a = f.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((n, i) => ({
    id: n.id || `row-${i}`,
    name: n.title || "Başlıksız görev",
    isMain: !!n.__main,
    start: ht(n.startDate),
    end: ht(n.dueDate) || ht(n.completedDate),
    status: n.status ?? 1
  })), [t]), { min: s, span: r } = f.useMemo(() => {
    const o = a.flatMap((u) => [u.start, u.end]).filter(Boolean).map((u) => u.getTime());
    if (o.length === 0) return { min: null, span: 0 };
    const n = Math.min(...o), i = Math.max(...o);
    return { min: n, span: Math.max(1, i - n) };
  }, [a]), l = f.useMemo(() => s === null ? [] : [0, 1, 2, 3].map((o) => new Date(s + r * o / 4)), [s, r]);
  return s === null ? /* @__PURE__ */ e.jsx("div", { className: Se, children: /* @__PURE__ */ e.jsx(
    me,
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
      const n = o.start ? o.start.getTime() : s, i = o.end ? Math.max(o.end.getTime(), n) : n, u = (n - s) / r * 100, m = Math.max(2, (i - n) / r * 100), h = Math.max(1, Math.round((i - n) / 864e5));
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
            style: { left: `${u}%`, width: `${m}%` },
            title: `${Ge(o.start)} – ${Ge(o.end)}`,
            children: /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[10.5px] font-bold text-white", children: [
              h,
              "g"
            ] })
          }
        ) })
      ] }, o.id);
    }) })
  ] });
}
function Tt(t, a = {}) {
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
function oa({ icon: t, iconTone: a, title: s, note: r, children: l }) {
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
  const s = se(), r = t.predecessorIds || [], l = () => {
    var g, j, T;
    return (T = (j = (g = window == null ? void 0 : window.apya) == null ? void 0 : g.platform) == null ? void 0 : j.tasks) == null ? void 0 : T.task;
  }, { data: o = [] } = Z({
    queryKey: ["task-dependency-candidates", t.projectId ?? null],
    queryFn: async () => {
      var j;
      const g = await Promise.resolve((j = l()) == null ? void 0 : j.getList({ projectId: t.projectId || void 0, maxResultCount: 1e3 }));
      return (g == null ? void 0 : g.items) ?? [];
    },
    enabled: !!t.id,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), { data: n = [], isLoading: i } = Z({
    queryKey: ["task-dependency-edges", t.projectId ?? null],
    queryFn: async () => {
      var g;
      return await Promise.resolve((g = l()) == null ? void 0 : g.getProjectDependencies(t.projectId || void 0)) ?? [];
    },
    enabled: !!t.id,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), u = f.useMemo(() => new Map(o.map((g) => [g.id, g])), [o]), m = n.filter((g) => g.predecessorTaskId === t.id).map((g) => g.taskId), h = o.filter((g) => g.id !== t.id && !r.includes(g.id) && !m.includes(g.id)), [p, x] = f.useState(""), { data: c = [], isLoading: d } = Z({
    queryKey: ["task-predecessors", t.id, r],
    queryFn: async () => {
      const g = l();
      return g ? Promise.all(
        r.map(
          (j) => Promise.resolve(g.get(j)).catch(() => ({ id: j, title: "(erişilemeyen görev)", status: null, code: "—" }))
        )
      ) : [];
    },
    enabled: r.length > 0,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), v = async (g) => {
    var j, T, $;
    try {
      await Promise.resolve(l().update(t.id, Tt(t, {
        predecessorIds: r.filter((K) => K !== g)
      }))), await s.invalidateQueries({ queryKey: ["task-detail", t.id] }), await s.invalidateQueries({ queryKey: ["task-dependency-edges"] }), ($ = (T = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : T.info) == null || $.call(T, "Bağlantı kaldırıldı.");
    } catch (K) {
      P(K, "Bağlantı kaldırılamadı.");
    }
  }, y = async () => {
    var g, j, T;
    if (p)
      try {
        await Promise.resolve(l().update(t.id, Tt(t, {
          predecessorIds: [...r, p]
        }))), x(""), await s.invalidateQueries({ queryKey: ["task-detail", t.id] }), await s.invalidateQueries({ queryKey: ["task-dependency-edges"] }), (T = (j = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : j.success) == null || T.call(j, "Öncül eklendi.");
      } catch ($) {
        P($, "Öncül eklenemedi.");
      }
  }, b = (g) => {
    var j, T, $;
    return ($ = (T = (j = window == null ? void 0 : window.apya) == null ? void 0 : j.taskDetail) == null ? void 0 : T.open) == null ? void 0 : $.call(T, g);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsxs(
      oa,
      {
        icon: "fa-arrow-left-long",
        iconTone: "text-warning",
        title: "Öncül görevler",
        note: "bu görev başlamadan tamamlanmalı",
        children: [
          r.length === 0 ? /* @__PURE__ */ e.jsx(me, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : d ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : c.map((g) => {
            const j = g.status == null ? null : pe(g.status);
            return /* @__PURE__ */ e.jsxs(
              "div",
              {
                className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
                children: [
                  /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: g.code || "—" }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => b(g.id),
                      className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                      children: g.title || "Başlıksız görev"
                    }
                  ),
                  j && /* @__PURE__ */ e.jsx($e, { bg: j.bg, fg: j.fg, children: j.label }),
                  !a && /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      title: "Bağlantıyı kaldır",
                      "aria-label": `${g.title} bağlantısını kaldır`,
                      onClick: () => v(g.id),
                      className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link-slash text-[10px]" })
                    }
                  )
                ]
              },
              g.id
            );
          }),
          !a && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-4 py-3 border-t border-subtle", children: [
            /* @__PURE__ */ e.jsxs(
              "select",
              {
                "aria-label": "Öncül görev seç",
                value: p,
                onChange: (g) => x(g.target.value),
                className: "flex-1 min-w-0 h-8 px-2.5 rounded-[9px] border border-default bg-surface-base text-text-primary text-[12.5px]",
                children: [
                  /* @__PURE__ */ e.jsx("option", { value: "", children: h.length ? "Öncül görev seçin…" : "Eklenebilecek görev yok" }),
                  h.map((g) => /* @__PURE__ */ e.jsx("option", { value: g.id, children: (g.code ? g.code + " · " : "") + (g.title || "Başlıksız görev") }, g.id))
                ]
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: y,
                disabled: !p,
                className: "shrink-0 h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed",
                children: "Öncül ekle"
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ e.jsx(
      oa,
      {
        icon: "fa-arrow-right-long",
        iconTone: "text-primary",
        title: "Ardıl görevler",
        note: "bu görev bitince başlar",
        children: i ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : m.length === 0 ? /* @__PURE__ */ e.jsx(me, { icon: "fa-diagram-project", title: "Ardıl görev yok", description: "Bu görevi öncül olarak gösteren bir görev yok." }) : m.map((g) => {
          const j = u.get(g), T = j && j.status != null ? pe(j.status) : null;
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: (j == null ? void 0 : j.code) || "—" }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => b(g),
                    className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                    children: (j == null ? void 0 : j.title) || "(erişilemeyen görev)"
                  }
                ),
                T && /* @__PURE__ */ e.jsx($e, { bg: T.bg, fg: T.fg, children: T.label })
              ]
            },
            g
          );
        })
      }
    )
  ] });
}
function Ae() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task) || null;
}
function an(t) {
  const a = se(), s = ["task-timelogs", t], r = ["task-active-timelog"], l = Z({
    queryKey: s,
    queryFn: () => {
      var m;
      return Promise.resolve((m = Ae()) == null ? void 0 : m.getTimeLogs(t));
    },
    enabled: !!t && !!Ae(),
    staleTime: 15e3,
    meta: { persist: !1 },
    retry: !1
  }), o = Z({
    queryKey: r,
    /* Kayıt yokken uç 204 döner, proxy undefined çözer; TanStack v5 undefined'ı
       hata sayıp önceki çalışan kaydı ekranda bırakır (sayaç durmazdı). */
    queryFn: () => {
      var m;
      return Promise.resolve((m = Ae()) == null ? void 0 : m.getActiveTimeLog()).then((h) => h ?? null);
    },
    enabled: !!Ae(),
    staleTime: 5e3,
    /* Canlı sayaç kanbandan da başlatılıp durduruluyor; açılışlar arasında taşınmaz. */
    meta: { persist: !1 },
    retry: !1
  }), n = () => {
    a.invalidateQueries({ queryKey: s }), a.invalidateQueries({ queryKey: r });
  }, i = te({
    mutationFn: () => {
      var m;
      return Promise.resolve((m = Ae()) == null ? void 0 : m.startTimeTracking(t));
    },
    onSuccess: n
  }), u = te({
    mutationFn: () => {
      var m;
      return Promise.resolve((m = Ae()) == null ? void 0 : m.stopTimeTracking(t));
    },
    onSuccess: n
  });
  return {
    logs: l.data ?? [],
    isLoading: l.isLoading,
    activeLog: o.data ?? null,
    start: i.mutateAsync,
    stop: u.mutateAsync,
    isMutating: i.isPending || u.isPending
  };
}
function ca(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function sn({ taskId: t, task: a = {} }) {
  const s = an(t), r = s.activeLog && s.activeLog.taskId === t ? s.activeLog : null, [l, o] = f.useState(() => Date.now());
  f.useEffect(() => {
    if (!r) return;
    const d = setInterval(() => o(Date.now()), 1e3);
    return () => clearInterval(d);
  }, [r]);
  const n = r ? Math.max(0, Math.floor((l - new Date(r.startTime).getTime()) / 1e3)) : 0, u = s.logs.reduce((d, v) => d + (v.secondsSpent || 0), 0) + n, m = (a == null ? void 0 : a.estimatedHours) ?? null, h = m ? m * 3600 : 0, p = h ? Math.min(100, Math.round(u / h * 100)) : 0, x = h ? Math.max(0, h - u) : 0, c = async () => {
    try {
      r ? await s.stop() : await s.start();
    } catch (d) {
      P(d, "Zaman takibi güncellenemedi.");
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
              children: ar(u)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary", children: r ? "Kayıt sürüyor" : "Sayaç duraklatıldı" })
        ] })
      ] }),
      h > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] font-bold text-text-secondary", children: "Tahmin kullanımı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
            pt(u),
            " / ",
            m,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-warning", style: { width: `${p}%` } }) }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "Kalan tahmini süre: ",
          pt(x)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
      /* @__PURE__ */ e.jsx(Qe, { title: "Zaman kayıtları" }),
      s.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : s.logs.length === 0 ? /* @__PURE__ */ e.jsx(
        me,
        {
          icon: "fa-stopwatch",
          title: "Henüz zaman kaydı yok",
          description: "Soldaki yeşil düğmeyle sayacı çalıştırın; durdurduğunuzda kayıt buraya düşer."
        }
      ) : s.logs.map((d) => {
        const v = !d.endTime;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
            children: [
              /* @__PURE__ */ e.jsx(ut, { name: d.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: d.note || d.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                ca(d.startTime),
                " → ",
                v ? "sürüyor" : ca(d.endTime)
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary", children: v ? "Aktif" : pt(d.secondsSpent || 0) })
            ]
          },
          d.id
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
  return We.filter((s) => !s.hidden).filter((s) => !s.isCore).filter((s) => !s.permission || ne(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let tt = null;
const it = /* @__PURE__ */ new Set(), yt = /* @__PURE__ */ new Set();
let at = !1;
function da() {
  it.forEach((t) => t());
}
function rn(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const J = {
  open(t) {
    const a = rn(t);
    a && (tt = a, da());
  },
  close() {
    tt = null, da();
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
    at && J.emitResult();
  },
  /** Yalnız testler için. */
  reset() {
    tt = null, at = !1, it.clear(), yt.clear();
  }
}, xa = "apya.taskDetail.fullscreen";
function Wa({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, l] = f.useState(t), [o, n] = f.useState([]), { data: i, isPending: u, isError: m, refetch: h } = Bt(r), p = Pa(), x = Ka(i), c = Ra(), d = qa(r), [v, y] = f.useState("general"), [b, g] = f.useState(!1), j = _e.useRef(null), T = f.useMemo(
    () => Ha(d.assignedCodes),
    [d.assignedCodes]
  ), $ = f.useMemo(
    () => Ja(d.assignedCodes),
    [d.assignedCodes]
  ), K = T.find((z) => z.code === v) ?? T[0];
  _e.useEffect(() => {
    K.code !== v && y(K.code);
  }, [K, v]);
  const B = K == null ? void 0 : K.component, O = se(), [q, G] = f.useState(
    () => {
      var z;
      return ((z = window.localStorage) == null ? void 0 : z.getItem(xa)) === "1";
    }
  ), [I, L] = f.useState(!1), [_, Q] = f.useState(!1), U = f.useCallback(() => {
    Ft(), s == null || s();
  }, [s]);
  La(a === "page" ? null : t, U), _e.useEffect(() => {
    x.isDirty ? p.markDirty() : p.markClean();
  });
  const X = f.useCallback(() => {
    I || (Q(!1), p.requestClose(U));
  }, [p, U, I]), C = f.useCallback(() => {
    G((z) => {
      var ee;
      const R = !z;
      return (ee = window.localStorage) == null || ee.setItem(xa, R ? "1" : "0"), R;
    });
  }, []), N = ne("Platform.Tasks.Delete"), [F, Y] = f.useState(!1), [oe, ie] = f.useState(!1), ce = f.useCallback(async () => {
    var z, R, ee;
    ie(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (ee = (R = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : R.info) == null || ee.call(R, "Başarıyla silindi."), Y(!1), p.markClean(), U();
    } catch (he) {
      P(he, "Görev silinemedi.");
    } finally {
      ie(!1);
    }
  }, [r, p, U]), re = f.useCallback(async () => {
    var z, R, ee;
    if (!x.validate()) return !1;
    L(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, x.toUpdateDto())
      ), await O.invalidateQueries({ queryKey: ["task-detail", r] }), J.emitResult(), (ee = (R = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : R.success) == null || ee.call(R, "Kaydedildi."), !0;
    } catch (he) {
      return P(he, "Kaydedilemedi."), !1;
    } finally {
      L(!1);
    }
  }, [r, x, p, O]), W = f.useCallback(() => {
    re();
  }, [re]), ue = f.useCallback(async () => {
    if (Q(!1), !x.validate()) {
      p.resolvePendingClose("stay"), y("general");
      return;
    }
    await re() ? p.resolvePendingClose("saved") : Q(!0);
  }, [p, x, re]), E = f.useCallback((z, R) => {
    p.requestClose(() => {
      n((ee) => [...ee, { id: r, title: (i == null ? void 0 : i.title) ?? "" }]), l(z), y("general"), p.markClean();
    });
  }, [p, r, i]), H = f.useCallback((z) => {
    p.requestClose(() => {
      n((R) => {
        const ee = R.findIndex((he) => he.id === z);
        return ee === -1 ? R : R.slice(0, ee);
      }), l(z), y("general"), p.markClean();
    });
  }, [p]), k = f.useCallback(async (z) => {
    try {
      await d.addFeature(z), y(z), g(!1);
    } catch (R) {
      P(R, "Özellik eklenemedi.");
    }
  }, [d]), M = f.useCallback(async (z) => {
    try {
      await d.removeFeature(z), y((R) => R === z ? "general" : R);
    } catch (R) {
      P(R, "Özellik kaldırılamadı.");
    }
  }, [d]);
  _e.useEffect(() => {
    if (!b) return;
    const z = (ee) => {
      j.current && !j.current.contains(ee.target) && g(!1);
    }, R = (ee) => {
      ee.key === "Escape" && g(!1);
    };
    return document.addEventListener("mousedown", z), document.addEventListener("keydown", R), () => {
      document.removeEventListener("mousedown", z), document.removeEventListener("keydown", R);
    };
  }, [b]);
  const D = u ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(we, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(we, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(we, { className: "h-24 w-full" })
  ] }) : m && !i ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(ae, { variant: "ghost", onClick: () => h(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      Js,
      {
        trail: o,
        current: { id: r, title: (i == null ? void 0 : i.title) ?? "" },
        onNavigate: H
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: j, children: [
      /* @__PURE__ */ e.jsx(
        Os,
        {
          tabs: T,
          activeCode: K.code,
          onSelect: (z) => {
            y(z), g(!1);
          },
          onOpenPicker: () => g((z) => !z),
          pickerOpen: b
        }
      ),
      b && /* @__PURE__ */ e.jsx(
        Hs,
        {
          entries: $,
          busyCode: d.isMutating ? d.mutatingCode : null,
          onAdd: k,
          onRemove: M
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${K.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          K.code === "general" ? /* @__PURE__ */ e.jsx(
            Ys,
            {
              values: x.values,
              errors: x.errors,
              onFieldChange: x.setField,
              assigneeOptions: c.options,
              isLoadingAssignees: c.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(f.Suspense, { fallback: /* @__PURE__ */ e.jsx(we, { className: "h-24 w-full" }), children: B && /* @__PURE__ */ e.jsx(
            B,
            {
              taskId: r,
              task: i,
              form: x,
              onOpenSubtask: E
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
  ] }), V = a === "page" ? zs : As;
  return /* @__PURE__ */ e.jsxs(
    V,
    {
      open: !0,
      fullscreen: q,
      onRequestClose: X,
      title: i ? `Görev Detayı: ${i.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        Ms,
        {
          task: i ?? { title: "Yükleniyor…" },
          canDelete: N,
          fullscreen: q,
          onToggleFullscreen: C,
          onClose: X,
          onDelete: () => Y(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        Rs,
        {
          lastSavedAt: i == null ? void 0 : i.lastModificationTime,
          isDirty: p.isDirty,
          isSaving: I,
          onCancel: X,
          onSave: W
        }
      ),
      children: [
        D,
        /* @__PURE__ */ e.jsx(
          Pt,
          {
            open: p.pendingClose,
            isSaving: I,
            errorText: _ ? de("Common:Unsaved:SaveFailed", "Kaydedilemedi. Düzenlemeye dönebilir ya da değişiklikleri atabilirsiniz.") : void 0,
            onStay: () => {
              Q(!1), p.resolvePendingClose("stay");
            },
            onDiscard: () => {
              Q(!1), x.reset(), p.resolvePendingClose("discard");
            },
            onSave: ue
          }
        ),
        F && /* @__PURE__ */ e.jsx(
          nn,
          {
            taskTitle: (i == null ? void 0 : i.title) ?? "",
            busy: oe,
            onCancel: () => Y(!1),
            onConfirm: ce
          }
        )
      ]
    }
  );
}
function nn({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [l, o] = f.useState(""), n = l.trim() === "SİL";
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
        /* @__PURE__ */ e.jsx(ae, { variant: "secondary", onClick: s, disabled: a, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          ae,
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
  const r = !!t, [l, o] = f.useState(null);
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
    /* @__PURE__ */ e.jsx(De, { container: Ee(l), children: /* @__PURE__ */ e.jsxs(
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
const ua = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto", dn = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", xn = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" }
];
function un({ children: t }) {
  return /* @__PURE__ */ e.jsx(Et, { asChild: !0, children: t });
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
  boardColumnValue: u,
  titleValue: m,
  /* Doğrulama hatası (useTaskForm.errors.title): başlığın altında gösterilir. */
  titleError: h,
  isPrivateValue: p,
  isFavorite: x,
  onToggleFavorite: c,
  isWatched: d,
  onToggleWatch: v,
  onDuplicate: y,
  onArchive: b,
  onDelete: g,
  onOpenTransfer: j,
  onExportPdf: T,
  /* Yetki (root hesaplar; sunucudaki EnsureCanMutateTaskAsync ile aynı kural). Eskiden
     menü ve alanlar herkese açıktı, yetkisiz kullanıcı tıklayınca 403 alıyordu. */
  canEdit: $ = !0,
  canChangeStatus: K = !0,
  canDelete: B = !0
}) {
  const [O, q] = f.useState(!1), [G, I] = f.useState(null), [L, _] = f.useState(!1), Q = f.useRef(null), U = f.useId(), X = Ee(G), C = n ?? t.status, N = Ia(i), F = Fa(
    N,
    C,
    u === void 0 ? t.boardColumnId : u
  ), Y = { ...pe(C), ...F ? { label: F.label } : {} }, oe = (E) => {
    o("status", E.status), o("boardColumnId", E.boardColumnId);
  }, ie = t.code || "GRV-—", ce = () => {
    var E;
    (E = navigator.clipboard) == null || E.writeText(ie), q(!0), setTimeout(() => q(!1), 1800);
  }, re = () => {
    var E, H, k, M;
    (E = navigator.clipboard) == null || E.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), (M = (k = (H = window == null ? void 0 : window.abp) == null ? void 0 : H.notify) == null ? void 0 : k.success) == null || M.call(k, "Görev bağlantısı panoya kopyalandı.");
  }, W = (E) => () => {
    _(!1), E == null || E();
  }, ue = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", onClick: W(re) },
    { label: "Çoğalt", icon: "fa-copy", allowed: $, onClick: W(y) },
    { label: "Başka projeye kopyala", icon: "fa-clone", allowed: $, onClick: W(() => j == null ? void 0 : j("copy")) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, allowed: $, onClick: W(() => j == null ? void 0 : j("move")) },
    { label: d ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: W(v) },
    { label: "Arşivle", icon: "fa-box-archive", separator: !0, allowed: K, onClick: W(b) },
    { label: "Yazdır", icon: "fa-print", kbd: "Ctrl P", onClick: W(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: W(T) },
    { label: "Sil", icon: "fa-trash-can", separator: !0, danger: !0, allowed: B, onClick: W(g) }
  ].filter((E) => E.allowed !== !1);
  return /* @__PURE__ */ e.jsxs("header", { ref: I, className: "shrink-0 px-6 lt-860:px-4 pt-[18px] pb-4 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: ce,
            title: "Kodu kopyala",
            className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[11px] font-bold tracking-[.04em] cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[9px] opacity-70" }),
              /* @__PURE__ */ e.jsx("span", { children: ie }),
              /* @__PURE__ */ e.jsx("i", { className: `${O ? "fa-solid fa-check" : "fa-regular fa-copy"} text-[9px] opacity-60` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              disabled: !$,
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] border border-default text-[12px] font-semibold ${$ ? "cursor-pointer" : "cursor-default"} ${Y.bg} ${Y.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-current animate-pulse" }),
                /* @__PURE__ */ e.jsx("span", { children: Y.label }),
                $ && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: X, children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${ua} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            N.map((E) => {
              const H = (F == null ? void 0 : F.key) === E.key;
              return /* @__PURE__ */ e.jsx(un, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => oe(E),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${H ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${E.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: E.label }),
                    H && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, E.key);
            })
          ] }) })
        ] }),
        d && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 h-[26px] px-2.5 rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11.5px] font-semibold", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-eye text-[10px]" }),
          "Takip ediliyor"
        ] }),
        !$ && /* @__PURE__ */ e.jsxs(
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
            isPrivate: p ?? !!t.isPrivate,
            onChange: (E) => o("isPrivate", E),
            disabled: !$
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
        /* @__PURE__ */ e.jsxs(ke, { modal: !0, open: L, onOpenChange: _, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer seçenekler",
              className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${L ? "bg-surface-hover text-text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: X, children: /* @__PURE__ */ e.jsxs(
            Te,
            {
              sideOffset: 6,
              align: "end",
              collisionBoundary: X ?? [],
              collisionPadding: 12,
              className: `${ua} w-[244px]`,
              children: [
                ue.map((E) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: E.onClick,
                    className: [
                      dn,
                      E.danger ? "text-negative" : "text-text-secondary",
                      E.separator ? "border-t border-subtle mt-[5px]" : ""
                    ].join(" "),
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${E.icon} text-[11px] w-[14px] opacity-75` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: E.label }),
                      E.kbd && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: E.kbd })
                    ]
                  },
                  E.label
                )),
                /* @__PURE__ */ e.jsxs("div", { className: "mt-1.5 pt-[9px] px-[9px] pb-[7px] border-t border-subtle", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 mb-[7px]", children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-keyboard text-[11px] text-text-tertiary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-[.09em] text-text-tertiary", children: "Kısayollar" })
                  ] }),
                  xn.map((E) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: E.what }),
                    /* @__PURE__ */ e.jsx(pn, { children: E.key })
                  ] }, E.what))
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
          ref: Q,
          role: "textbox",
          "aria-label": de("Tasks:Detail:TitleLabel", "Görev başlığı"),
          "aria-readonly": !$ || void 0,
          "aria-invalid": !!h || void 0,
          "aria-describedby": h ? U : void 0,
          contentEditable: $,
          suppressContentEditableWarning: !0,
          spellCheck: !1,
          onInput: $ ? (E) => o("title", E.currentTarget.textContent.trim()) : void 0,
          onBlur: $ ? (E) => o("title", E.currentTarget.textContent.trim()) : void 0,
          className: `flex-1 min-w-0 text-[24px] lt-560:text-[20px] font-extrabold tracking-[-.025em] leading-[1.2] text-text-primary px-2 -ml-2 py-[3px] rounded-[9px] border ${h ? "border-negative" : "border-transparent"} ${$ ? `cursor-text hover:bg-neutral-subtle focus:bg-neutral-subtle focus:shadow-focus focus:outline-none ${h ? "" : "hover:border-subtle focus:border-focus"}` : ""}`,
          children: m ?? t.title ?? "Başlıksız görev"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: c,
          title: x ? "Favorilerden çıkar" : "Favorilere ekle",
          className: `flex items-center justify-center h-8 w-8 shrink-0 rounded-[9px] cursor-pointer ${x ? "bg-warning-subtle text-warning" : "text-text-tertiary hover:bg-surface-hover"}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${x ? "solid" : "regular"} fa-star text-[15px]` })
        }
      )
    ] }),
    h && /* @__PURE__ */ e.jsx("p", { id: U, role: "alert", className: "mt-1 mb-0 text-[12px] font-semibold text-negative", children: h })
  ] });
}
const st = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", pa = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function je({ children: t }) {
  return /* @__PURE__ */ e.jsx(Et, { asChild: !0, children: t });
}
function fe({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[7px] min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.08em] text-text-tertiary select-none", children: t }),
    a
  ] });
}
function ma({ name: t, size: a = 26 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Je(t), fontSize: a * 0.38 },
      children: He(t)
    }
  );
}
function fa(t) {
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
  assigneeValue: u,
  projectValue: m,
  dueDateValue: h,
  startDateValue: p,
  tagsValue: x = [],
  progressPercent: c = 0,
  progressNote: d = "",
  onOpenTransfer: v,
  /* Düzenleme yetkisi yoksa ızgara salt okunur: tüm alanlar forma, oradan UpdateAsync'e
     gider; yetkisiz kullanıcı değiştirip Kaydet'te 403 alıyordu. */
  readOnly: y = !1,
  /* Doğrulama hataları (useTaskForm.errors): ilgili hücrenin altında gösterilir. */
  startDateError: b,
  dueDateError: g
}) {
  var k, M;
  const j = f.useId(), T = f.useId(), [$, K] = f.useState(""), [B, O] = f.useState(""), [q, G] = f.useState(""), [I, L] = f.useState(!1), [_, Q] = f.useState(null), U = l ?? t.status, X = Ia(o), C = Fa(
    X,
    U,
    n === void 0 ? t.boardColumnId : n
  ), N = { ...pe(U), ...C ? { label: C.label } : {} }, F = (D) => {
    r("status", D.status), r("boardColumnId", D.boardColumnId);
  }, Y = xt(i ?? t.priority), oe = u ?? t.assigneeId ?? null, ie = m ?? t.projectId ?? null, ce = ((k = a.find((D) => D.value === oe)) == null ? void 0 : k.label) || t.assigneeName || "Atanmamış", re = ((M = s.find((D) => D.value === ie)) == null ? void 0 : M.label) || t.projectName || "Projesiz", W = Ea(h ?? t.dueDate), ue = a.filter(
    (D) => !$ || D.label.toLowerCase().includes($.toLowerCase())
  ), E = s.filter(
    (D) => !B || D.label.toLowerCase().includes(B.toLowerCase())
  ), H = () => {
    const D = q.trim();
    D && !x.includes(D) && r("tagNames", [...x, D]), G(""), L(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { ref: Q, className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsx(
    "fieldset",
    {
      disabled: y,
      className: "m-0 p-0 border-0 min-w-0 [&:disabled_label]:pointer-events-none [&_:disabled]:pointer-events-none [&:disabled_.fa-chevron-down]:hidden",
      children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6", children: [
        /* @__PURE__ */ e.jsx(fe, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx(ma, { name: oe ? ce : null }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: ce }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: Ee(_), children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${st} w-[264px]`, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: $,
                  onChange: (D) => K(D.target.value),
                  placeholder: "Kişi ara…",
                  className: pa
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[230px] overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("assigneeId", null),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] text-left cursor-pointer ${oe ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary font-semibold"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "flex h-6 w-6 items-center justify-center rounded-full bg-neutral-subtle text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-user-slash text-[9px]" }) }),
                    /* @__PURE__ */ e.jsx("span", { children: "Atanmamış" })
                  ]
                }
              ) }),
              a.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-2 py-1.5 text-[12px] text-text-tertiary", children: "Kullanıcı listesi yükleniyor…" }),
              ue.map((D) => /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("assigneeId", D.value),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${oe === D.value ? "bg-primary-subtle" : "hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx(ma, { name: D.label, size: 24 }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: D.label }),
                    oe === D.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
                  ]
                }
              ) }, D.value))
            ] })
          ] }) })
        ] }) }),
        /* @__PURE__ */ e.jsxs(fe, { label: "Son tarih", children: [
          /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-regular fa-calendar text-[13px] ${W.tone}` }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "date",
                value: (h ?? t.dueDate ?? "").slice(0, 10),
                onChange: (D) => r("dueDate", D.target.value),
                "aria-label": "Son tarih",
                "aria-invalid": !!g || void 0,
                "aria-describedby": g ? j : void 0,
                className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
              }
            )
          ] }),
          g ? /* @__PURE__ */ e.jsx("span", { id: j, role: "alert", className: "-mt-0.5 text-[10.5px] font-semibold text-negative", children: g }) : W.hint && /* @__PURE__ */ e.jsx("span", { className: `-mt-0.5 text-[10.5px] font-semibold ${W.tone}`, children: W.hint })
        ] }),
        /* @__PURE__ */ e.jsxs(fe, { label: "Başlangıç", children: [
          /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[13px] text-text-tertiary" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "date",
                value: (p ?? t.startDate ?? "").slice(0, 10),
                onChange: (D) => r("startDate", D.target.value),
                "aria-label": "Başlangıç",
                "aria-invalid": !!b || void 0,
                "aria-describedby": b ? T : void 0,
                className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
              }
            )
          ] }),
          b && /* @__PURE__ */ e.jsx("span", { id: T, role: "alert", className: "-mt-0.5 text-[10.5px] font-semibold text-negative", children: b })
        ] }),
        /* @__PURE__ */ e.jsx(fe, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 pt-[5px]", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
            /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: [
              "%",
              c
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-medium text-text-tertiary", children: d })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "h-1.5 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
            "div",
            {
              className: "h-full rounded-full bg-primary transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
              style: { width: `${c}%` }
            }
          ) })
        ] }) }),
        /* @__PURE__ */ e.jsx(fe, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${N.bg} ${N.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${N.icon} text-[11px]` }),
                /* @__PURE__ */ e.jsx("span", { children: N.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: Ee(_), children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${st} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            X.map((D) => {
              const V = (C == null ? void 0 : C.key) === D.key;
              return /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => F(D),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${V ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${D.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: D.label }),
                    V && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, D.key);
            })
          ] }) })
        ] }) }) }),
        /* @__PURE__ */ e.jsx(fe, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
          /* @__PURE__ */ e.jsx(De, { container: Ee(_), children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${st} w-[184px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
            Cs.map((D) => {
              const V = Ds[D], z = (i ?? t.priority) === D;
              return /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("priority", D),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${z ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${V.icon} text-[11px] w-[13px]` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: V.label }),
                    z && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, D);
            })
          ] }) })
        ] }) }) }),
        /* @__PURE__ */ e.jsx(fe, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap min-h-8", children: [
          x.map((D) => /* @__PURE__ */ e.jsxs(
            "span",
            {
              className: "inline-flex items-center gap-1.5 h-6 px-2 rounded-[7px] border border-primary bg-primary-subtle text-primary text-[11.5px] font-bold",
              children: [
                /* @__PURE__ */ e.jsx("span", { children: D }),
                !y && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Etiketi kaldır",
                    onClick: () => r("tagNames", x.filter((V) => V !== D)),
                    className: "flex items-center p-0 border-0 bg-transparent text-current opacity-55 hover:opacity-100 hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
                  }
                )
              ]
            },
            D
          )),
          y ? x.length === 0 && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "—" }) : I ? /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: q,
              onChange: (D) => G(D.target.value),
              onBlur: H,
              onKeyDown: (D) => {
                D.key === "Enter" && H(), D.key === "Escape" && (G(""), L(!1));
              },
              placeholder: "Etiket…",
              className: "h-6 w-24 px-2 rounded-[7px] border border-focus bg-surface-base text-text-primary text-[11.5px] shadow-focus focus:outline-none"
            }
          ) : /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              "aria-label": "Yeni etiket ekle",
              onClick: () => L(!0),
              className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-dashed border-strong bg-transparent text-text-tertiary text-[11.5px] font-semibold hover:border-focus hover:text-primary hover:bg-primary-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[9px]" }),
                "Etiket"
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ e.jsx(fe, { label: "Proje", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-[13px] text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: re }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: Ee(_), children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${st} w-[250px]`, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: B,
                  onChange: (D) => O(D.target.value),
                  placeholder: "Proje ara…",
                  className: pa
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[210px] overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("projectId", null),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${ie ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-neutral-400" }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Projesiz" })
                  ]
                }
              ) }),
              E.map((D) => /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("projectId", D.value),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${ie === D.value ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-primary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: D.label }),
                    ie === D.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
                  ]
                }
              ) }, D.value))
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-[7px] pt-[7px] border-t border-subtle", children: [
              /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => v == null ? void 0 : v("move"),
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
                  onClick: () => v == null ? void 0 : v("copy"),
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
        /* @__PURE__ */ e.jsx(fe, { label: "Harcanan / tahmin", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[9px] h-8", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock text-[13px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[13px] font-bold text-text-primary", children: fa(t.spentHours ?? 0) }),
          /* @__PURE__ */ e.jsxs("span", { className: "text-[12px] text-text-tertiary", children: [
            "/ ",
            t.estimatedHours != null ? fa(t.estimatedHours) : "—"
          ] })
        ] }) })
      ] })
    }
  ) });
}
const bn = "z-popover w-[225px] rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto";
function Lt({ entries: t = [], onPick: a, children: s }) {
  const [r, l] = f.useState(null), o = Ee(r);
  return /* @__PURE__ */ e.jsx("span", { ref: l, className: "contents", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: s }),
    /* @__PURE__ */ e.jsx(De, { container: o, children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", collisionPadding: 12, className: bn, children: [
      /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Özellik ekle" }),
      t.map((n) => /* @__PURE__ */ e.jsx(Et, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
  pickerEntries: u = [],
  onPickFeature: m,
  counts: h = {},
  isDirty: p = !1
}) {
  const [x, c] = f.useState(!1);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-6 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 py-2.5 flex-1 min-w-0 overflow-x-auto custom-scrollbar", children: [
      s.map((d) => {
        const v = t === d.code, y = h[d.code] || 0;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            draggable: !0,
            title: "Sürükleyerek sırayı değiştirin",
            ...Aa(() => a(d.code)),
            onDragStart: (b) => {
              l(d.code);
              try {
                b.dataTransfer.effectAllowed = "move", b.dataTransfer.setData("text/plain", d.code);
              } catch {
              }
            },
            onDragOver: (b) => {
              b.preventDefault(), n(d.code);
            },
            onDrop: (b) => {
              b.preventDefault(), i == null || i();
            },
            onDragEnd: o,
            className: [
              "flex shrink-0 items-center gap-2 h-[34px] px-[13px] rounded-[10px]",
              "text-[12.5px] whitespace-nowrap cursor-grab active:cursor-grabbing",
              "transition-opacity duration-fast",
              v ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
              r === d.code ? "opacity-35" : "opacity-100"
            ].join(" "),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.icon} text-[11px] opacity-85` }),
              /* @__PURE__ */ e.jsx("span", { children: d.title }),
              y > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                "rounded-full text-[10px] font-extrabold",
                v ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
              ].join(" "), children: y })
            ]
          },
          d.code
        );
      }),
      /* @__PURE__ */ e.jsx(Lt, { entries: u, onPick: m, children: /* @__PURE__ */ e.jsxs(
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
            x ? "px-[13px]" : "px-[11px]"
          ].join(" "),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            x && /* @__PURE__ */ e.jsx("span", { className: "animate-fade-in-fast", children: "Özellik ekle" })
          ]
        }
      ) })
    ] }),
    p && /* @__PURE__ */ e.jsxs("span", { className: "flex shrink-0 items-center gap-[7px] h-[26px] px-2.5 rounded-full bg-warning-subtle text-warning text-[11px] font-bold", children: [
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
  pickerEntries: u = [],
  onPickFeature: m,
  counts: h = {}
}) {
  return /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Görev özellikleri",
      className: "flex lt-860:hidden flex-col gap-[3px] w-[238px] shrink-0 py-4 px-3 border-r border-subtle bg-surface-base overflow-y-auto custom-scrollbar",
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "px-2.5 pt-1 pb-2 text-[10px] font-extrabold uppercase tracking-[.1em] text-text-tertiary", children: "Özellikler" }),
        s.map((p) => {
          const x = t === p.code, c = h[p.code] || 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              draggable: !0,
              title: "Sürükleyerek sırayı değiştirin",
              ...Aa(() => a(p.code)),
              onDragStart: (d) => {
                l(p.code);
                try {
                  d.dataTransfer.effectAllowed = "move", d.dataTransfer.setData("text/plain", p.code);
                } catch {
                }
              },
              onDragOver: (d) => {
                d.preventDefault(), n(p.code);
              },
              onDrop: (d) => {
                d.preventDefault(), i == null || i();
              },
              onDragEnd: o,
              className: [
                "flex shrink-0 items-center gap-[11px] h-9 px-[11px] rounded-[9px]",
                "text-[12.5px] text-left cursor-grab active:cursor-grabbing",
                "transition-opacity duration-fast",
                x ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
                r === p.code ? "opacity-35" : "opacity-100"
              ].join(" "),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${p.icon} text-[12px] w-[15px] opacity-85` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: p.title }),
                c > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                  "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                  "rounded-full text-[10px] font-extrabold",
                  x ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
                ].join(" "), children: c })
              ]
            },
            p.code
          );
        }),
        /* @__PURE__ */ e.jsx(Lt, { entries: u, onPick: m, children: /* @__PURE__ */ e.jsxs(
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
const ba = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
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
    /* @__PURE__ */ e.jsx(ze, { label: "Oluşturma tarihi", value: ba(t.creationTime) }),
    /* @__PURE__ */ e.jsx(ze, { label: "Güncelleyen", value: l || "—", avatarName: l }),
    /* @__PURE__ */ e.jsx(ze, { label: "Son güncelleme", value: ba(t.lastModificationTime) }),
    /* @__PURE__ */ e.jsx(ze, { label: "Görev tipi", value: t.taskType }),
    /* @__PURE__ */ e.jsx(ze, { label: "Sprint", value: t.sprint })
  ] }) });
}
const ha = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
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
function ya({ open: t, onClick: a, label: s }) {
  return /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: a,
      "aria-expanded": t,
      "aria-label": `${s} — ${t ? "daralt" : "genişlet"}`,
      title: t ? "Daralt" : "Genişlet",
      className: "flex items-center justify-center h-7 w-7 rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer",
      children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t ? "fa-chevron-up" : "fa-chevron-down"} text-[12px]` })
    }
  );
}
const ga = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
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
  const n = t == null ? void 0 : t.id, i = se(), [u, m] = f.useState(!0), [h, p] = f.useState(""), x = (r == null ? void 0 : r.items) ?? [], c = x.filter((C) => C.isDone).length, d = x.length ? Math.round(c / x.length * 100) : 0, v = async () => {
    const C = h.trim();
    if (!(!C || !n)) {
      p("");
      try {
        await r.addItem(C);
      } catch (N) {
        p((F) => F || C), P(N, "Madde eklenemedi.");
      }
    }
  }, [y, b] = f.useState(!0), [g, j] = f.useState(""), [T, $] = f.useState(!1), [K, B] = f.useState(!1), [O, q] = f.useState(null), [G, I] = f.useState(""), { data: L = [] } = Z({
    queryKey: ["task-comments", n],
    queryFn: () => {
      var C, N, F, Y;
      return Promise.resolve((Y = (F = (N = (C = window == null ? void 0 : window.apya) == null ? void 0 : C.platform) == null ? void 0 : N.tasks) == null ? void 0 : F.task) == null ? void 0 : Y.getComments(n));
    },
    enabled: !!n,
    staleTime: 1e4,
    meta: { persist: !1 }
  }), _ = async () => {
    await i.invalidateQueries({ queryKey: ["task-comments", n] }), await i.invalidateQueries({ queryKey: ["task-detail", n] });
  }, Q = async () => {
    const C = g.trim();
    if (!(!C || !n || K)) {
      B(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.addComment(n, C)), await _(), j("");
      } catch (N) {
        P(N, "Yorum gönderilemedi.");
      } finally {
        B(!1);
      }
    }
  }, U = async (C) => {
    const N = G.trim();
    if (!(!N || !n))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.replyToComment(C, N)), await _(), I(""), q(null);
      } catch (F) {
        P(F, "Yanıt gönderilemedi.");
      }
  }, X = !!g.trim() && !K;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-[9px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Açıklama" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Zengin metin · WYSIWYG" })
      ] }),
      /* @__PURE__ */ e.jsx(
        Ba,
        {
          value: s ?? t.description ?? "",
          onChange: (C) => a("description", C),
          mentionName: l,
          readOnly: o
        },
        n
      )
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: ha, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
            c,
            "/",
            x.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(ya, { label: "Kontrol listesi", open: u, onClick: () => m((C) => !C) })
      ] }),
      u && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 mt-3.5", children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
            style: { width: `${d}%` }
          }
        ) }),
        x.map((C) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              disabled: o,
              "aria-label": C.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
              onClick: () => r.toggleItem(C.id).catch((N) => P(N, "Durum güncellenemedi.")),
              className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${o ? "cursor-default" : "cursor-pointer"} transition-colors duration-fast ${C.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
              children: C.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${C.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: C.text }),
          !o && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              onClick: () => r.removeItem(C.id).catch((N) => P(N, "Madde silinemedi.")),
              className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
            }
          )
        ] }, C.id)),
        !o && /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            value: h,
            onChange: (C) => p(C.target.value),
            onKeyDown: (C) => {
              C.key === "Enter" && v();
            },
            placeholder: "Yeni madde yaz ve Enter'a bas…",
            className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: ha, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Yorumlar & güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: L.length })
        ] }),
        /* @__PURE__ */ e.jsx(ya, { label: "Yorumlar", open: y, onClick: () => b((C) => !C) })
      ] }),
      y && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(gt, { name: l }),
          /* @__PURE__ */ e.jsxs("div", { className: `flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${T ? "border-focus bg-surface-base shadow-focus" : "border-default bg-surface-raised"}`, children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                rows: 2,
                value: g,
                onChange: (C) => j(C.target.value),
                onFocus: () => $(!0),
                onBlur: () => $(!1),
                onKeyDown: (C) => {
                  C.key === "Enter" && (C.ctrlKey || C.metaKey) && (C.preventDefault(), Q());
                },
                placeholder: "Bir yorum yazın… (Ctrl+Enter ile gönder)",
                className: "w-full p-3 border-0 bg-transparent text-text-primary text-[13px] leading-[1.6] resize-none focus:outline-none"
              }
            ),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-2.5 py-[7px] border-t border-subtle bg-surface-base", children: [
              /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-0.5", children: [
                { icon: "fa-regular fa-face-smile", title: "👍 ekle", add: " 👍 " }
              ].map((C) => /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  title: C.title,
                  onMouseDown: (N) => N.preventDefault(),
                  onClick: () => j((N) => N + C.add),
                  className: "flex items-center justify-center h-7 w-7 rounded-[7px] text-text-tertiary hover:bg-surface-hover hover:text-primary cursor-pointer",
                  children: /* @__PURE__ */ e.jsx("i", { className: `${C.icon} text-[12px]` })
                },
                C.title
              )) }),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: Q,
                  disabled: !X,
                  className: `flex items-center gap-[7px] h-[30px] px-3.5 rounded-[9px] text-[12px] font-bold shadow-xs ${X ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${K ? "fa-circle-notch fa-spin" : "fa-paper-plane"} text-[10px]` }),
                    "Gönder"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1", children: L.map((C) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start py-3 border-t border-subtle", children: [
          /* @__PURE__ */ e.jsx(gt, { name: C.authorName }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: C.authorName }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: ga(C.creationTime) })
            ] }),
            /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[13px] leading-[1.65] text-text-secondary whitespace-pre-wrap", children: C.text }),
            /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1.5 mt-[3px]", children: /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  q((N) => N === C.id ? null : C.id), I("");
                },
                className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-full text-text-tertiary text-[11px] font-semibold hover:bg-surface-hover hover:text-primary cursor-pointer",
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                  "Yanıtla"
                ]
              }
            ) }),
            O === C.id && /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 mt-2 animate-fade-in-fast", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: G,
                  onChange: (N) => I(N.target.value),
                  onKeyDown: (N) => {
                    N.key === "Enter" && U(C.id);
                  },
                  placeholder: `@${C.authorName} kullanıcısına yanıt ver…`,
                  className: "flex-1 h-8 px-3 rounded-[9px] border border-focus bg-surface-base text-text-primary text-[12px] shadow-focus focus:outline-none"
                }
              ),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => U(C.id),
                  className: "h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover",
                  children: "Yanıtla"
                }
              )
            ] }),
            (C.replies ?? []).map((N) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] mt-2.5 pl-3 border-l-2 border-default", children: [
              /* @__PURE__ */ e.jsx(gt, { name: N.authorName, size: 24 }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: N.authorName }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: ga(N.creationTime) })
                ] }),
                /* @__PURE__ */ e.jsx("p", { className: "mt-[3px] mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: N.text })
              ] })
            ] }, N.id))
          ] })
        ] }, C.id)) })
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
  onSave: o,
  sticky: n = !1
}) {
  const i = t ? new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(t)) : "—", u = s ? "fa-solid fa-circle-notch fa-spin" : r ? "fa-solid fa-check" : "fa-regular fa-floppy-disk", m = s ? "Kaydediliyor…" : r ? "Kaydedildi" : "Kaydet", h = a && !s;
  return /* @__PURE__ */ e.jsxs("footer", { className: `${n ? "sticky bottom-0 z-10 " : ""}shrink-0 flex items-center justify-between gap-4 px-6 lt-860:px-4 py-3.5 border-t border-subtle bg-surface-base`, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5 min-w-0 lt-560:hidden", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] text-[11.5px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock text-[11px]" }),
        "Son kayıt: ",
        /* @__PURE__ */ e.jsx("strong", { className: "font-semibold text-text-secondary", children: i })
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
          disabled: !h,
          className: `flex items-center gap-2 h-9 px-[22px] rounded-[10px] text-white text-[13px] font-bold shadow-sm ${h ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `${u} text-[11px]` }),
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
function va({ code: t, onRemoveFeature: a, pickerEntries: s = [], onPickFeature: r, canRemove: l = !0 }) {
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
      /* @__PURE__ */ e.jsx(Lt, { entries: s, onPick: r, children: /* @__PURE__ */ e.jsxs(
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
], ja = {
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
  const [u, m] = f.useState(a), [h, p] = f.useState([]), [x, c] = f.useState(""), [d, v] = f.useState(""), [y, b] = f.useState(ja), [g, j] = f.useState(!1);
  f.useEffect(() => {
    t && (m(a), p([]), c(""), v(""), b(ja));
  }, [t, a]);
  const T = f.useMemo(
    () => l.filter((N) => N.value && N.value !== o),
    [l, o]
  ), $ = T.filter((N) => !x || N.label.toLowerCase().includes(x.toLowerCase())), K = T.length > 0 && h.length === T.length;
  if (!t) return null;
  const B = (N) => p((F) => F.includes(N) ? F.filter((Y) => Y !== N) : [...F, N]), O = (N) => {
    var F;
    return ((F = l.find((Y) => Y.value === N)) == null ? void 0 : F.label) ?? "";
  }, q = async () => {
    const N = d.trim();
    if (!(!N || g)) {
      j(!0);
      try {
        const F = await (i == null ? void 0 : i(N));
        F && p((Y) => [...Y, F]), v("");
      } catch (F) {
        P(F, "Proje oluşturulamadı.");
      } finally {
        j(!1);
      }
    }
  }, G = async () => {
    if (!(!h.length || g)) {
      j(!0);
      try {
        await (r == null ? void 0 : r({ mode: u, targetProjectIds: h, include: y }));
      } finally {
        j(!1);
      }
    }
  }, I = u === "move", L = h.length, _ = I ? L > 1 ? "Taşı ve kopyala" : "Taşı" : L > 1 ? `${L} projeye kopyala` : "Kopyala", Q = Object.values(y).filter(Boolean).length, U = h.map(O).filter(Boolean), X = U.length ? `${U.length > 2 ? `${U.slice(0, 2).join(", ")} +${U.length - 2}` : U.join(", ")} · ${Q} seçenek açık` : `Proje seçilmedi · ${Q} seçenek açık`, C = (N) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${N ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return /* @__PURE__ */ e.jsx(Za, { open: t, onClose: s, label: I ? "Başka projeye taşı" : "Başka projelere kopyala", children: /* @__PURE__ */ e.jsx(
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
          "aria-label": I ? "Başka projeye taşı" : "Başka projelere kopyala",
          onClick: (N) => N.stopPropagation(),
          className: "flex flex-col w-full max-w-[760px] max-h-[88vh] rounded-[20px] border border-default bg-surface-base shadow-xl overflow-hidden animate-dialog-in",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-4 px-[22px] pt-5 pb-4 border-b border-subtle", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-10 w-10 rounded-[13px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-tree text-base" }) }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsx("h3", { className: "m-0 text-base font-extrabold tracking-[-.02em] text-text-primary", children: I ? "Başka projeye taşı" : "Başka projelere kopyala" }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 mb-0 text-[12px] leading-[1.5] text-text-tertiary", children: I ? "Görev ilk seçtiğiniz projeye taşınır; birden fazla seçerseniz kalanlara kopya oluşturulur." : "Görevin kopyası seçtiğiniz her projede oluşturulur; bu görev yerinde kalır." })
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
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => m("move"), className: C(I), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[10px]" }),
                "Taşı"
              ] }),
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => m("copy"), className: C(!I), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clone text-[10px]" }),
                "Kopyala"
              ] })
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 grid grid-cols-2 lt-860:grid-cols-1 gap-5 items-start px-[22px] pt-4 pb-5 overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px] min-w-0", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5", children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.08em] text-text-tertiary", children: [
                    "Hedef projeler · ",
                    L
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => p(K ? [] : T.map((N) => N.value)),
                      className: "p-0 border-0 bg-transparent text-primary text-[11px] font-bold cursor-pointer hover:underline",
                      children: K ? "Seçimi temizle" : "Tümünü seç"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: x,
                      onChange: (N) => c(N.target.value),
                      placeholder: "Proje ara…",
                      className: "w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar", children: [
                  $.map((N) => {
                    const F = h.includes(N.value), Y = I && h[0] === N.value;
                    return /* @__PURE__ */ e.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => B(N.value),
                        className: `flex items-center gap-[11px] px-3 py-[11px] rounded-[11px] border text-left cursor-pointer hover:border-focus ${F ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                        children: [
                          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] rounded-[5px] border-[1.5px] text-white ${F ? "bg-primary border-primary" : "bg-transparent border-strong"}`, children: F && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" }) }),
                          /* @__PURE__ */ e.jsx("span", { className: "h-2.5 w-2.5 shrink-0 rounded-[3px] bg-primary" }),
                          /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: N.label }),
                          Y && /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center h-5 px-2 rounded-md bg-primary text-white text-[10px] font-extrabold", children: "TAŞINACAK" })
                        ]
                      },
                      N.value
                    );
                  }),
                  $.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "py-6 text-center text-[12px] text-text-tertiary", children: "Uygun proje bulunamadı." })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[7px] mt-1", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: d,
                      onChange: (N) => v(N.target.value),
                      onKeyDown: (N) => {
                        N.key === "Enter" && (N.preventDefault(), q());
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
                      disabled: !d.trim() || g,
                      className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-plus text-[12px]" })
                    }
                  )
                ] }),
                I && L > 1 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle", children: [
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
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: Tn.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-px", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary", children: N.label }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: N.countKey ? `${n[N.countKey] ?? 0} ${N.unit}` : N.desc })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    Sn,
                    {
                      on: y[N.key],
                      label: N.label,
                      onClick: () => b((F) => ({ ...F, [N.key]: !F[N.key] }))
                    }
                  )
                ] }, N.key)) })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3.5 px-[22px] py-3.5 border-t border-subtle bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("span", { className: "min-w-0 truncate text-[11.5px] text-text-tertiary", children: X }),
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
                    onClick: G,
                    disabled: !L || g,
                    className: `flex items-center gap-2 h-9 px-5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${L && !g ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${g ? "fa-circle-notch fa-spin" : "fa-arrow-right"} text-[10px]` }),
                      _
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
  var ue, E, H;
  const n = se(), { data: i } = Bt(t), u = zt(t), m = At(t), [h, p] = f.useState("general"), [x, c] = f.useState(""), [d, v] = f.useState(""), [y, b] = f.useState(""), g = f.useRef(null), j = f.useRef(null);
  i && j.current !== i.id && (j.current = i.id, c(i.description ?? ""));
  const { data: T = [] } = Z({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var k, M, D, V;
      return Promise.resolve((V = (D = (M = (k = window == null ? void 0 : window.apya) == null ? void 0 : k.platform) == null ? void 0 : M.tasks) == null ? void 0 : D.task) == null ? void 0 : V.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4,
    meta: { persist: !1 }
  });
  if (f.useEffect(() => {
    const k = (M) => {
      M.key === "Escape" && (M.stopPropagation(), s == null || s());
    };
    return window.addEventListener("keydown", k), () => window.removeEventListener("keydown", k);
  }, [s]), !i) return null;
  const { canEdit: $, canChangeStatus: K, canDelete: B } = Oe(i), O = (H = (E = (ue = window == null ? void 0 : window.apya) == null ? void 0 : ue.platform) == null ? void 0 : E.tasks) == null ? void 0 : H.task, q = pe(i.status), G = xt(i.priority), I = u.items ?? [], L = I.filter((k) => k.isDone).length, _ = I.length ? Math.round(L / I.length * 100) : 0, Q = m.attachments ?? [], U = { checklist: I.length, comments: T.length, files: Q.length }, X = async () => {
    await n.invalidateQueries({ queryKey: ["task-detail", t] });
  }, C = async (k) => {
    try {
      await Promise.resolve(k()), await X();
    } catch (M) {
      P(M, "Alt görev güncellenemedi.");
    }
  }, N = (k) => C(() => O.update(i.id, Tt(i, k))), F = () => C(() => O.updateStatus(i.id, i.status >= 4 ? 1 : i.status + 1)), Y = () => C(() => O.setPriority(i.id, i.priority >= 4 ? 1 : i.priority + 1)), oe = () => {
    (i.description ?? "") !== x && N({ description: x || null });
  }, ie = async () => {
    const k = d.trim();
    if (k) {
      v("");
      try {
        await u.addItem(k);
      } catch (M) {
        P(M, "Madde eklenemedi.");
      }
    }
  }, ce = async () => {
    const k = y.trim();
    if (k) {
      b("");
      try {
        await Promise.resolve(O.addComment(i.id, k)), await n.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch (M) {
        P(M, "Yorum gönderilemedi.");
      }
    }
  }, re = async () => {
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(O.delete(i.id)), l == null || l(i.id), s == null || s();
      } catch (k) {
        P(k, "Alt görev silinemedi.");
      }
  }, W = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
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
                    className: `${W} hover:bg-surface-hover hover:text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-up-right-from-square text-[11px]" })
                  }
                ),
                B && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Alt görevi sil",
                    onClick: re,
                    className: `${W} hover:bg-negative-subtle hover:text-negative`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Kapat",
                    onClick: s,
                    className: `${W} hover:bg-surface-hover hover:text-text-primary`,
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
                  onClick: F,
                  title: "Durumu değiştir",
                  disabled: !K,
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold ${K ? "cursor-pointer" : "cursor-default"} ${q.bg} ${q.fg}`,
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
                  onClick: Y,
                  title: "Önceliği değiştir",
                  disabled: !$,
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold ${$ ? "cursor-pointer" : "cursor-default"} ${G.bg} ${G.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${G.icon} text-[10px]` }),
                    G.label
                  ]
                }
              ),
              (i.tags ?? []).map((k) => /* @__PURE__ */ e.jsx("span", { className: "flex items-center h-6 px-[9px] rounded-[7px] border border-default bg-neutral-subtle text-text-secondary text-[11px] font-semibold", children: k.name }, k.id ?? k.name)),
              !$ && /* @__PURE__ */ e.jsxs(
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
                  _
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: "block h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("span", { className: "block h-full rounded-full bg-success", style: { width: `${_}%` } }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: Pn.map((k) => {
            const M = h === k.code, D = U[k.code] ?? 0;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => p(k.code),
                className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${M ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${k.icon} text-[11px] opacity-85` }),
                  /* @__PURE__ */ e.jsx("span", { children: k.title }),
                  D > 0 && /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-neutral-subtle text-text-tertiary text-[10px] font-extrabold", children: D })
                ]
              },
              k.code
            );
          }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar px-5 py-[18px] bg-surface-raised", children: [
            h === "general" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Açıklama" }),
              /* @__PURE__ */ e.jsx(
                "textarea",
                {
                  rows: 7,
                  value: x,
                  onChange: (k) => c(k.target.value),
                  onBlur: $ ? oe : void 0,
                  readOnly: !$,
                  placeholder: $ ? "Bu alt görevin detayları…" : "Açıklama yok.",
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
            h === "checklist" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px]", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Kontrol listesi" }),
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: [
                  L,
                  "/",
                  I.length
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-success", style: { width: `${_}%` } }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px] mt-1", children: [
                I.map((k) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] border border-subtle bg-surface-base hover:border-default", children: [
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Tamamlandı işaretle",
                      onClick: () => u.toggleItem(k.id),
                      disabled: !$,
                      className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${$ ? "cursor-pointer" : "cursor-default"} ${k.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
                      children: k.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[12.5px] font-semibold ${k.isDone ? "line-through text-text-tertiary" : "text-text-primary"}`, children: k.text }),
                  $ && /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Maddeyi sil",
                      onClick: () => u.removeItem(k.id),
                      className: "flex shrink-0 items-center justify-center h-6 w-6 rounded-md text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[10px]" })
                    }
                  )
                ] }, k.id)),
                $ && /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "text",
                    value: d,
                    onChange: (k) => v(k.target.value),
                    onKeyDown: (k) => {
                      k.key === "Enter" && ie();
                    },
                    placeholder: "Yeni madde yaz ve Enter'a bas…",
                    className: "h-9 mt-1 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                )
              ] })
            ] }),
            h === "comments" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] items-start", children: [
                /* @__PURE__ */ e.jsx(vt, { name: o, size: 30 }),
                /* @__PURE__ */ e.jsx(
                  "textarea",
                  {
                    rows: 2,
                    value: y,
                    onChange: (k) => b(k.target.value),
                    onKeyDown: (k) => {
                      k.key === "Enter" && !k.shiftKey && (k.preventDefault(), ce());
                    },
                    placeholder: "Yorum yaz ve Enter'a bas…",
                    className: "flex-1 min-w-0 px-3 py-2.5 rounded-[11px] border border-default bg-surface-base text-text-primary text-[12.5px] leading-[1.6] resize-none focus:border-focus focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: ce,
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
                /* @__PURE__ */ e.jsx(vt, { name: k.authorName, size: 28 }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: k.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: In(k.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: k.text })
                ] })
              ] }, k.id))
            ] }),
            h === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  ref: g,
                  type: "file",
                  className: "hidden",
                  onChange: (k) => {
                    var D;
                    const M = (D = k.target.files) == null ? void 0 : D[0];
                    k.target.value = "", M && m.upload(M).catch((V) => P(V, "Dosya yüklenemedi."));
                  }
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    var k;
                    return (k = g.current) == null ? void 0 : k.click();
                  },
                  disabled: m.isUploading,
                  className: "flex flex-col items-center justify-center gap-[7px] p-6 rounded-[13px] border-2 border-dashed border-strong bg-surface-base cursor-pointer hover:border-focus hover:bg-primary-subtle disabled:opacity-60",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${m.isUploading ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-xl text-text-tertiary` }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: m.isUploading ? "Yükleniyor…" : "Dosya ekle" })
                  ]
                }
              ),
              Q.map((k) => {
                const M = En(k.fileName);
                return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${M.bg} ${M.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${M.icon} text-[13px]` }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: k.fileName }),
                    /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                      Bn(k.fileSize),
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
                      onClick: () => m.remove(k.id).catch((D) => P(D, "Dosya silinemedi.")),
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
function Na() {
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
function wa() {
  const t = document.querySelector("[data-tab-order]"), a = t == null ? void 0 : t.getAttribute("data-tab-order");
  if (!a) return null;
  try {
    const s = JSON.parse(a);
    return Array.isArray(s) ? s.map((r) => r == null ? void 0 : r.kind).filter((r) => typeof r == "string") : null;
  } catch {
    return null;
  }
}
function ka(t) {
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
  const [a, s] = f.useState(() => wa() ?? Na()), [r, l] = f.useState(null);
  f.useEffect(() => {
    if (wa() === null) {
      const m = Na();
      m.length && ka(m);
    }
  }, []);
  const o = f.useMemo(() => {
    const m = new Map(t.map((p) => [p.code, p])), h = [];
    for (const p of a) {
      const x = m.get(p);
      x && (h.push(x), m.delete(p));
    }
    for (const p of t)
      m.has(p.code) && h.push(p);
    return h;
  }, [t, a]), n = f.useCallback((m) => {
    s((h) => {
      const p = r;
      if (!p || p === m) return h;
      const x = h.length ? h.slice() : o.map((v) => v.code), c = x.indexOf(p), d = x.indexOf(m);
      return c === -1 || d === -1 ? h : (x.splice(c, 1), x.splice(d, 0, p), x);
    });
  }, [r, o]), i = f.useCallback((m) => l(m), []), u = f.useCallback(() => {
    l(null), s((m) => {
      const h = m.length ? m : o.map((p) => p.code);
      return Ln(h), ka(h), h;
    });
  }, [o]);
  return { orderedTabs: o, draggingCode: r, handleDragStart: i, handleDragEnd: u, reorderTo: n };
}
function Kn(t) {
  const a = f.useRef(null);
  f.useEffect(() => {
    if (!(!t || typeof document > "u")) {
      if (a.current === null) {
        const s = document.title.lastIndexOf(" | ");
        a.current = s >= 0 ? document.title.slice(s) : "";
      }
      document.title = t + a.current;
    }
  }, [t]);
}
function Rn() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function qn() {
  const t = Z({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: Rn,
    staleTime: 3e5,
    retry: !1
  }), a = t.data ?? [], s = a.map((l) => ({ value: l.id, label: l.name })), r = new Map(a.map((l) => [l.id, l.name]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function Gn(t) {
  var s, r, l;
  const a = (l = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.projects) == null ? void 0 : l.boardColumn;
  return a ? Promise.resolve(a.getListByProject(t, { abpHandleError: !1 })) : Promise.resolve([]);
}
function Yn(t) {
  const a = Z({
    queryKey: ["task-detail", "board-columns", t],
    queryFn: () => Gn(t),
    enabled: !!t,
    staleTime: 6e4,
    retry: !1,
    /* Kolonlar panoda her an yeniden adlandırılıp eklenebilir — kalıcı önbellekten
       bayat seçenek gelmesin. */
    meta: { persist: !1 }
  });
  return t ? a.data ?? [] : [];
}
const Ca = "apya.taskDetail.fullscreen", xe = {
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
function _n(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function es({ taskId: t, presentation: a = "modal", onClose: s, switchToTask: r }) {
  var Yt, _t, Ut, Vt, Ot, Qt, Ht, Jt;
  const [l, o] = f.useState(t), { data: n, isPending: i, isError: u, error: m, refetch: h } = Bt(l), p = se(), x = Pa(), c = Ka(n), d = Ra(), v = qn(), y = Yn(
    n != null && n.projectId && c.values.projectId === n.projectId ? n.projectId : null
  ), b = qa(l), g = zt(l), [j, T] = f.useState("general"), [$, K] = f.useState(!1), [B, O] = f.useState(!1), [q, G] = f.useState(!1), [I, L] = f.useState(null), [_, Q] = f.useState(null), [U, X] = f.useState(!1), [C, N] = f.useState(!1), [F, Y] = f.useState(() => {
    try {
      return localStorage.getItem(Ca) === "true";
    } catch {
      return !1;
    }
  });
  La(a === "page" ? null : l), Kn(a === "page" ? n == null ? void 0 : n.title : null);
  const [oe, ie] = f.useState(null);
  n != null && n.id && n.id !== oe && (ie(n.id), X(!!n.isFavorite), N(!!n.isWatched)), f.useEffect(() => {
    c.isDirty ? x.markDirty() : x.markClean();
  }), f.useEffect(() => {
    const w = p.getQueryCache().subscribe((A) => {
      var le;
      A.type === "updated" && ((le = A.action) == null ? void 0 : le.type) === "invalidate" && !Fs(A.query.queryKey) && J.markChanged();
    }), S = p.getMutationCache().subscribe((A) => {
      A.type === "added" && J.markChanged();
    });
    return () => {
      w(), S();
    };
  }, [p]);
  const ce = f.useCallback(() => {
    Ft(), s == null || s();
  }, [s]), re = f.useCallback(() => {
    $ || (G(!1), x.requestClose(ce));
  }, [x, ce, $]), W = (w) => {
    G(!1), x.requestClose(() => (r ?? o)(w));
  }, ue = f.useCallback(() => {
    Y((w) => {
      const S = !w;
      try {
        localStorage.setItem(Ca, String(S));
      } catch {
      }
      return S;
    });
  }, []), E = f.useMemo(
    () => Ha(b.assignedCodes),
    [b.assignedCodes]
  ), H = Mn(E), k = f.useMemo(
    () => Ja(b.assignedCodes),
    [b.assignedCodes]
  ), M = (w, S) => {
    if (S) {
      T(w);
      return;
    }
    us(w);
  }, D = f.useMemo(() => {
    var w, S, A, le, ye;
    return {
      subtasks: ((w = n == null ? void 0 : n.subTasks) == null ? void 0 : w.length) ?? 0,
      files: ((S = n == null ? void 0 : n.attachments) == null ? void 0 : S.length) ?? 0,
      dependencies: ((A = n == null ? void 0 : n.predecessorIds) == null ? void 0 : A.length) ?? 0,
      comments: ((le = n == null ? void 0 : n.comments) == null ? void 0 : le.length) ?? 0,
      checklist: ((ye = g.items) == null ? void 0 : ye.length) ?? 0
    };
  }, [n, g.items]), V = We.find((w) => w.code === j), z = g.items ?? [], R = z.filter((w) => w.isDone).length, ee = z.length ? Math.round(R / z.length * 100) : 0, he = f.useRef(null), [Mt, as] = f.useState(0), Kt = () => c.validate() ? !0 : (xe.err(de("Tasks:Detail:Validation:Summary", "Kaydedilemedi: işaretli alanları düzeltin.")), as((w) => w + 1), !1);
  f.useEffect(() => {
    var S, A;
    if (!Mt) return;
    const w = (S = he.current) == null ? void 0 : S.querySelector('[aria-invalid="true"]');
    w == null || w.focus(), (A = w == null ? void 0 : w.scrollIntoView) == null || A.call(w, { block: "nearest" });
  }, [Mt]);
  const Ze = f.useCallback(async () => {
    if (!Kt()) return !1;
    K(!0);
    try {
      const w = c.values, S = await Promise.resolve(window.apya.platform.tasks.task.update(l, c.toUpdateDto()));
      await p.invalidateQueries({ queryKey: ["task-detail", l] });
      const A = p.getQueryState(["task-detail", l]);
      return c.commitSaved(w, (A == null ? void 0 : A.status) === "success" ? A.data : S), J.emitResult(), O(!0), setTimeout(() => O(!1), 2e3), xe.ok("Görev başarıyla güncellendi."), !0;
    } catch (w) {
      return P(w, "Kaydedilemedi."), !1;
    } finally {
      K(!1);
    }
  }, [l, c, p]), ss = () => {
    G(!1), x.resolvePendingClose("stay");
  }, rs = () => {
    G(!1), c.reset(), x.resolvePendingClose("discard");
  }, ns = async () => {
    if (G(!1), !Kt()) {
      x.resolvePendingClose("stay");
      return;
    }
    await Ze() ? x.resolvePendingClose("saved") : G(!0);
  };
  f.useEffect(() => {
    const w = (S) => {
      if ((S.ctrlKey || S.metaKey) && S.key.toLowerCase() === "s") {
        S.preventDefault(), c.isDirty && !$ && !x.pendingClose && Ze();
        return;
      }
      S.key === "Escape" && I && (S.stopPropagation(), L(null));
    };
    return window.addEventListener("keydown", w), () => window.removeEventListener("keydown", w);
  }, [Ze, c.isDirty, $, I, x.pendingClose]);
  const Be = () => {
    var w, S, A;
    return (A = (S = (w = window == null ? void 0 : window.apya) == null ? void 0 : w.platform) == null ? void 0 : S.tasks) == null ? void 0 : A.task;
  }, is = async () => {
    var S;
    const w = !U;
    X(w), J.markChanged();
    try {
      await Promise.resolve((S = Be()) == null ? void 0 : S.toggleFavorite(l));
    } catch (A) {
      X(!w), P(A, "Favori güncellenemedi.");
    }
  }, ls = () => {
    if (!l) return;
    const w = document.createElement("a");
    w.href = `/Tasks/Detail/${l}?handler=Pdf`, w.rel = "noopener", document.body.appendChild(w), w.click(), w.remove();
  }, os = async () => {
    var S;
    const w = !C;
    N(w), J.markChanged();
    try {
      await Promise.resolve((S = Be()) == null ? void 0 : S.toggleWatch(l)), xe.info(w ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (A) {
      N(!w), P(A, "Takip durumu güncellenemedi.");
    }
  }, cs = async () => {
    var w, S;
    J.markChanged();
    try {
      const A = await Promise.resolve((w = Be()) == null ? void 0 : w.transfer(l, {
        mode: 2,
        // Copy
        targetProjectIds: n != null && n.projectId ? [n.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await p.invalidateQueries({ queryKey: ["task-detail"] }), xe.ok("Görev çoğaltıldı.");
      const le = (S = A == null ? void 0 : A.createdTaskIds) == null ? void 0 : S[0];
      le && W(le);
    } catch (A) {
      P(A, "Görev çoğaltılamadı.");
    }
  }, ds = async () => {
    var w, S;
    J.markChanged();
    try {
      await Promise.resolve((w = Be()) == null ? void 0 : w.updateStatus(l, 4)), await p.invalidateQueries({ queryKey: ["task-detail", l] }), c.setField("status", 4), c.setField(
        "boardColumnId",
        ((S = p.getQueryData(["task-detail", l])) == null ? void 0 : S.boardColumnId) ?? null
      ), xe.info("Görev arşivlendi (Tamamlandı).");
    } catch (A) {
      P(A, "Görev arşivlenemedi.");
    }
  }, xs = async () => {
    var w;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?")) {
      J.markChanged();
      try {
        await Promise.resolve((w = Be()) == null ? void 0 : w.delete(l)), xe.info("Görev silindi."), x.markClean(), ce();
      } catch (S) {
        P(S, "Görev silinemedi.");
      }
    }
  }, us = async (w) => {
    try {
      await b.addFeature(w), T(w), xe.ok("Özellik başarıyla eklendi.");
    } catch (S) {
      P(S, "Özellik eklenemedi.");
    }
  }, Rt = async (w) => {
    try {
      await b.removeFeature(w), T("general"), xe.info("Özellik görevden kaldırıldı.");
    } catch (S) {
      P(S, "Özellik kaldırılamadı.");
    }
  }, ps = async (w) => {
    var le, ye, ge, Ie, Pe, et, Re;
    const S = ((Ie = (ge = (ye = (le = window == null ? void 0 : window.apya) == null ? void 0 : le.platform) == null ? void 0 : ye.application) == null ? void 0 : ge.projects) == null ? void 0 : Ie.project) ?? ((Re = (et = (Pe = window == null ? void 0 : window.apya) == null ? void 0 : Pe.platform) == null ? void 0 : et.projects) == null ? void 0 : Re.project);
    if (!(S != null && S.create)) throw new Error("Proje servisi yüklenmedi.");
    const A = await Promise.resolve(S.create({
      name: w,
      code: _n(w),
      currency: "TRY"
    }));
    return await p.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), xe.ok(`“${w}” projesi oluşturuldu.`), (A == null ? void 0 : A.id) ?? A;
  }, ms = async ({ mode: w, targetProjectIds: S, include: A }) => {
    var le, ye;
    J.markChanged();
    try {
      const ge = await Promise.resolve((le = Be()) == null ? void 0 : le.transfer(l, {
        mode: w === "move" ? 1 : 2,
        targetProjectIds: S,
        include: A
      }));
      await p.invalidateQueries({ queryKey: ["task-detail", l] }), w === "move" && c.setField("projectId", S[0]);
      const Ie = S.map((et) => {
        var Re;
        return (Re = v.options.find((ys) => ys.value === et)) == null ? void 0 : Re.label;
      }).filter(Boolean), Pe = ((ye = ge == null ? void 0 : ge.createdTaskIds) == null ? void 0 : ye.length) ?? 0;
      xe.ok(w === "move" ? Pe ? `“${Ie[0]}” projesine taşındı, ${Pe} projeye kopyalandı.` : `Görev “${Ie[0]}” projesine taşındı.` : Pe > 1 ? `${Pe} projeye kopyalandı.` : `Kopya “${Ie[0]}” projesinde oluşturuldu.`), L(null);
    } catch (ge) {
      P(ge, "Transfer tamamlanamadı.");
    }
  }, { canEdit: Xe, canChangeStatus: fs, canDelete: bs } = Oe(n), hs = j === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)] gap-5 items-start", children: [
    /* @__PURE__ */ e.jsx(
      vn,
      {
        task: n,
        onFieldChange: c.setField,
        descriptionValue: c.values.description,
        checklist: g,
        readOnly: !Xe,
        currentUserName: ((_t = (Yt = window == null ? void 0 : window.abp) == null ? void 0 : Yt.currentUser) == null ? void 0 : _t.name) || ((Vt = (Ut = window == null ? void 0 : window.abp) == null ? void 0 : Ut.currentUser) == null ? void 0 : Vt.userName) || "Ben"
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5", children: /* @__PURE__ */ e.jsx(gn, { task: n, nameById: d.nameById }) })
  ] }) : Cn(j) ? /* @__PURE__ */ e.jsx(
    va,
    {
      code: j,
      onRemoveFeature: Rt,
      pickerEntries: k,
      onPickFeature: M,
      canRemove: !(V != null && V.isCore)
    }
  ) : /* @__PURE__ */ e.jsx(f.Suspense, { fallback: /* @__PURE__ */ e.jsx(we, { className: "h-48 w-full" }), children: V != null && V.component ? /* @__PURE__ */ e.jsx(
    V.component,
    {
      taskId: l,
      task: n,
      form: c,
      nameById: d.nameById,
      onOpenSubtask: Q,
      readOnly: !Xe
    }
  ) : /* @__PURE__ */ e.jsx(
    va,
    {
      code: j,
      onRemoveFeature: Rt,
      pickerEntries: k,
      onPickFeature: M,
      canRemove: !(V != null && V.isCore)
    }
  ) }), Ke = u && ((m == null ? void 0 : m.status) === 404 || (m == null ? void 0 : m.status) === 403) ? m.status : null, qt = i ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(we, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(we, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(we, { className: "h-64 w-full" })
  ] }) : Ke ? /* @__PURE__ */ e.jsx(
    gs,
    {
      variant: Ke === 404 ? "error" : "locked",
      icon: Ke === 404 ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-magnifying-glass" }) : void 0,
      title: Ke === 404 ? de("Tasks:Detail:NotFound:Title", "Bu görev bulunamadı") : de("Tasks:Detail:Forbidden:Title", "Bu görevi görüntüleyemezsiniz"),
      description: Ke === 404 ? de("Tasks:Detail:NotFound:Body", "Görev silinmiş ya da bağlantı eskimiş olabilir.") : vs(m),
      action: a === "page" ? /* @__PURE__ */ e.jsx(ae, { asChild: !0, size: "sm", children: /* @__PURE__ */ e.jsxs("a", { href: "/Tasks", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-left", "aria-hidden": "true" }),
        de("Tasks:Detail:BackToList", "Görevlere dön")
      ] }) }) : /* @__PURE__ */ e.jsx(ae, { variant: "secondary", size: "sm", onClick: re, children: de("Common:Close", "Kapat") })
    }
  ) : u && !n ? (
    /* Yalnız İLK yükleme hatası. Görev ekrandayken düşen tazeleme (odak dönüşü, kayıt sonrası
       yeniden çekme; oturum düşünce 401) formu sökmez: yazılanlar görünür kalır, sonraki
       başarılı tazeleme forma işlenir (useTaskForm rebase). */
    /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
      /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
      /* @__PURE__ */ e.jsx(js, { onRetry: h })
    ] })
  ) : /* @__PURE__ */ e.jsxs("div", { ref: he, className: "flex flex-col flex-1 min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      mn,
      {
        task: n,
        presentation: a,
        onClose: re,
        isFullscreen: F,
        onToggleFullscreen: ue,
        onFieldChange: c.setField,
        statusValue: c.values.status,
        boardColumns: y,
        boardColumnValue: c.values.boardColumnId,
        titleValue: n == null ? void 0 : n.title,
        titleError: c.errors.title,
        isPrivateValue: c.values.isPrivate,
        isFavorite: U,
        onToggleFavorite: is,
        isWatched: C,
        onToggleWatch: os,
        onDuplicate: cs,
        onArchive: ds,
        onDelete: xs,
        onOpenTransfer: (w) => L({ mode: w }),
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
          assigneeOptions: d.options,
          projectOptions: v.options,
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
          progressPercent: ee,
          progressNote: `${R}/${z.length} madde`,
          onOpenTransfer: (w) => L({ mode: w }),
          readOnly: !Xe
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        a === "page" && /* @__PURE__ */ e.jsx(
          yn,
          {
            activeTab: j,
            onTabChange: T,
            orderedTabs: H.orderedTabs,
            draggingCode: H.draggingCode,
            onDragStart: H.handleDragStart,
            onDragEnd: H.handleDragEnd,
            onReorderTo: H.reorderTo,
            onReorderDrop: () => xe.info("Sekme sırası güncellendi."),
            pickerEntries: k,
            onPickFeature: M,
            counts: D
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: a === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            hn,
            {
              activeTab: j,
              onTabChange: T,
              orderedTabs: H.orderedTabs,
              draggingCode: H.draggingCode,
              onDragStart: H.handleDragStart,
              onDragEnd: H.handleDragEnd,
              onReorderTo: H.reorderTo,
              onReorderDrop: () => xe.info("Sekme sırası güncellendi."),
              pickerEntries: k,
              onPickFeature: M,
              counts: D,
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
        isSaving: $,
        justSaved: B,
        onCancel: re,
        onSave: Ze,
        sticky: a === "page"
      }
    )
  ] }), Gt = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      $n,
      {
        open: !!I,
        mode: (I == null ? void 0 : I.mode) ?? "move",
        onClose: () => L(null),
        onConfirm: ms,
        projectOptions: v.options,
        currentProjectId: c.values.projectId,
        counts: D,
        onCreateProject: ps
      }
    ),
    _ && /* @__PURE__ */ e.jsx(
      An,
      {
        subtaskId: _,
        parentCode: n == null ? void 0 : n.code,
        onClose: () => Q(null),
        onOpenFull: (w) => {
          Q(null), W(w);
        },
        onDeleted: () => p.invalidateQueries({ queryKey: ["task-detail", l] }),
        currentUserName: ((Qt = (Ot = window == null ? void 0 : window.abp) == null ? void 0 : Ot.currentUser) == null ? void 0 : Qt.name) || ((Jt = (Ht = window == null ? void 0 : window.abp) == null ? void 0 : Ht.currentUser) == null ? void 0 : Jt.userName) || "Ben"
      }
    ),
    /* @__PURE__ */ e.jsx(
      Pt,
      {
        open: x.pendingClose,
        isSaving: $,
        errorText: q ? de("Common:Unsaved:SaveFailed", "Kaydedilemedi. Düzenlemeye dönebilir ya da değişiklikleri atabilirsiniz.") : void 0,
        onStay: ss,
        onDiscard: rs,
        onSave: ns
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col w-full min-h-[calc(100vh-54px)] border-y border-subtle bg-surface-base", children: qt }),
    Gt
  ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(St, { open: !0, onOpenChange: (w) => {
      w || re();
    }, children: /* @__PURE__ */ e.jsx(
      $t,
      {
        title: n != null && n.title ? `Görev Detayı: ${n.title}` : "Görev Detayı",
        fullscreen: F,
        className: F ? "p-0 rounded-xl border border-default shadow-xl short:h-[100svh]" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl short:h-[100svh]",
        onInteractOutside: (w) => {
          var S, A;
          w.preventDefault(), !(I || _ || x.pendingClose) && ((A = (S = w.target) == null ? void 0 : S.closest) != null && A.call(S, "[data-apya-overlay]") || re());
        },
        onEscapeKeyDown: (w) => {
          if (I || _) {
            w.preventDefault();
            return;
          }
          if (document.querySelector(".modal.show")) {
            w.preventDefault();
            return;
          }
          w.preventDefault(), re();
        },
        children: qt
      }
    ) }),
    Gt
  ] });
}
function Un(t) {
  window.location.assign("/Tasks/Detail/" + encodeURIComponent(t));
}
function Vn() {
  const t = f.useSyncExternalStore(
    J.subscribe,
    J.getSnapshot,
    () => null
  );
  return t ? /* @__PURE__ */ e.jsx(Ns, { name: "task-detail", fallback: (a) => /* @__PURE__ */ e.jsx(On, { ...a }), children: /* @__PURE__ */ e.jsx(Qn, { taskId: t }) }) : null;
}
function On(t) {
  const a = () => {
    var s;
    Ft(), J.close(), (s = window.apya) != null && s.taskDetailV3Enabled ? J.emitResultIfChanged() : J.emitResult();
  };
  return /* @__PURE__ */ e.jsx(St, { open: !0, onOpenChange: (s) => {
    s || a();
  }, children: /* @__PURE__ */ e.jsx(
    $t,
    {
      title: de("Common:SectionError:Title", "Bu bölüm gösterilemedi"),
      className: "w-full max-w-[480px] h-auto tablet:min-h-0 justify-center p-6",
      children: /* @__PURE__ */ e.jsx(ws, { ...t, onClose: a })
    }
  ) });
}
function Qn({ taskId: t }) {
  var a;
  return (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(lt, { children: /* @__PURE__ */ e.jsx(
    es,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        J.close(), J.emitResultIfChanged();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(lt, { children: /* @__PURE__ */ e.jsx(
    Wa,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        J.close(), J.emitResult();
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
function Hn() {
  return ts() === "v2";
}
function Jn() {
  return ts() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = Jn();
window.apya.taskDetailV2Enabled = Hn() && !window.apya.taskDetailV3Enabled;
const Da = {
  open: (t) => {
    J.open(t);
  },
  close: () => J.close(),
  onResult: (t) => J.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(Da) : window.apya.taskDetail = Da;
function Ta() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = Sa(t, "task-detail", /* @__PURE__ */ e.jsx(Vn, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = za();
    a && J.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Ta) : Ta();
function Wn({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(lt, { children: /* @__PURE__ */ e.jsx(
    es,
    {
      taskId: t,
      presentation: "page",
      onClose: a,
      switchToTask: Un
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
  t && Sa(jt, "task-detail-page", /* @__PURE__ */ e.jsx(Wn, { taskId: t }));
}
