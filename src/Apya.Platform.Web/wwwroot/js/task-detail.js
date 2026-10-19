import { j as e, r as f, b as _e } from "./react-vendor-D7YDiBbi.js";
import { t as xe, n as P, E as fs, e as bs, R as hs, m as wa, I as ys, a as gs } from "./index-DgpuJ91w.js";
import { D as $t, g as Pt, d as wt, B as re, I as Ue, M as vs } from "./Dialog-D3HpJNIB.js";
import { a as ot } from "./QueryProvider-D2Hvqdr9.js";
import { u as J, a as ne, b as ae } from "./query-vendor-Db2mwxYI.js";
import { C as ka } from "./Combobox-CHhgTuMW.js";
import { U as Et, u as Ca } from "./useDirtyGuard-D_9NgM7w.js";
import { i as He, a as Je, s as fe, p as ut, d as Da, b as Ut, R as Ta, c as Ee, e as Sa, f as $a, g as js, P as Ns } from "./RichTextEditorV3-Bh6Kk-DM.js";
import { r as ws } from "./httpClient-BNoyY5yK.js";
import { S as we } from "./Skeleton-C92LWNeC.js";
import { R as ke, T as Ce, P as De, C as Te, A as ks, a as Bt, D as Cs, b as Ds, c as Ts, d as Ss, e as $s } from "./ui-vendor-UYevF8mE.js";
import { d as Pa } from "./draggableActivation-Ybw9Upbh.js";
import { i as Ps } from "./dataChanged-CDwwWMH8.js";
function Es({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: l,
  footer: o,
  children: n
}) {
  return /* @__PURE__ */ e.jsx(
    $t,
    {
      open: t,
      onOpenChange: (i) => {
        i || a();
      },
      children: /* @__PURE__ */ e.jsx(
        Pt,
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
function Bs({ title: t, header: a, footer: s, children: r }) {
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
function Is({ isPrivate: t }) {
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
const kt = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, Ct = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function Fs({
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
    const c = (N) => {
      u.current && !u.current.contains(N.target) && i(!1);
    }, d = (N) => {
      N.key === "Escape" && i(!1);
    };
    return document.addEventListener("mousedown", c), document.addEventListener("keydown", d), () => {
      document.removeEventListener("mousedown", c), document.removeEventListener("keydown", d);
    };
  }, [n]);
  const m = kt[t == null ? void 0 : t.status] ?? kt[1], y = Ct[t == null ? void 0 : t.priority] ?? Ct[2], p = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), i(!1);
  }, x = () => {
    var d, N, g, h;
    const c = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (d = navigator.clipboard) == null || d.writeText(c), (h = (g = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : g.info) == null || h.call(g, "Bağlantı kopyalandı."), i(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(wt, { variant: m.variant, children: m.text }),
        /* @__PURE__ */ e.jsx(wt, { variant: y.variant, children: y.text }),
        /* @__PURE__ */ e.jsx(Is, { isPrivate: t == null ? void 0 : t.isPrivate })
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
const As = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function zs({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: l }) {
  const o = As(t);
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
const Vt = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Ls = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function ve({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function Ms({ value: t, onChange: a }) {
  const [s, r] = f.useState(""), l = () => {
    const o = s.trim();
    o && !t.includes(o) && a([...t, o]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((o) => /* @__PURE__ */ e.jsxs(wt, { variant: "neutral", children: [
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
function Ks({
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
          className: Vt,
          children: Object.entries(kt).map(([o, n]) => /* @__PURE__ */ e.jsx("option", { value: o, children: n.text }, o))
        }
      ) }),
      /* @__PURE__ */ e.jsx(ve, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (o) => s("priority", Number(o.target.value)),
          className: Vt,
          children: Object.entries(Ct).map(([o, n]) => /* @__PURE__ */ e.jsx("option", { value: o, children: n.text }, o))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(ve, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      ka,
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
    /* @__PURE__ */ e.jsx(ve, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(Ms, { value: t.tagNames, onChange: (o) => s("tagNames", o) }) }),
    /* @__PURE__ */ e.jsx(ve, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (o) => s("description", o.target.value),
        className: Ls
      }
    ) })
  ] });
}
const Ot = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function qe({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function Rs({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(qe, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(qe, { label: "Oluşturulma zamanı", value: Ot(t.creationTime) }),
      /* @__PURE__ */ e.jsx(qe, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(qe, { label: "Son güncelleme zamanı", value: Ot(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(qe, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const qs = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", Gs = "border-brand-500 text-text-primary";
function Ys({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: l }) {
  const o = f.useRef(/* @__PURE__ */ new Map()), n = (u) => {
    var m;
    s(u.code), (m = o.current.get(u.code)) == null || m.focus();
  }, i = (u, m) => {
    u.key === "ArrowRight" ? (u.preventDefault(), n(t[(m + 1) % t.length])) : u.key === "ArrowLeft" ? (u.preventDefault(), n(t[(m - 1 + t.length) % t.length])) : u.key === "Home" ? (u.preventDefault(), n(t[0])) : u.key === "End" && (u.preventDefault(), n(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((u, m) => {
      const y = u.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (p) => {
            p ? o.current.set(u.code, p) : o.current.delete(u.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${u.code}`,
          "aria-selected": y,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: y ? 0 : -1,
          onClick: () => s(u.code),
          onKeyDown: (p) => i(p, m),
          className: `${qs} ${y ? Gs : ""}`,
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
const _s = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Us({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [l, o] = f.useState(""), n = f.useMemo(() => {
    const i = l.trim().toLocaleLowerCase("tr-TR"), u = i ? t.filter((y) => y.title.toLocaleLowerCase("tr-TR").includes(i)) : t, m = /* @__PURE__ */ new Map();
    return u.forEach((y) => {
      const p = m.get(y.category) ?? [];
      p.push(y), m.set(y.category, p);
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
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: _s[i] ?? i }),
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
function Vs({ trail: t = [], current: a, onNavigate: s }) {
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
function Os(t) {
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
function It(t) {
  return J({
    queryKey: ["task-detail", t],
    queryFn: () => Os(t),
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
function ce(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
const Qs = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, Ft = "task";
function Ea() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(Ft);
  return t && Qs.test(t) ? t : null;
}
function At() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(Ft), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function Ba(t, a) {
  const s = f.useRef(a);
  s.current = a, f.useEffect(() => {
    if (!t || Ea() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(Ft, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), f.useEffect(() => {
    const r = () => {
      var l;
      (l = s.current) == null || l.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const Hs = {
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
function Qt(t) {
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
  } : Hs;
}
const Ia = (t, a) => JSON.stringify(t) === JSON.stringify(a);
function Ht(t, a, s) {
  const r = {};
  for (const l of Object.keys(s)) r[l] = Ia(t[l], a[l]) ? s[l] : t[l];
  return r;
}
function Fa(t) {
  const [a, s] = f.useState(t == null ? void 0 : t.id), r = f.useMemo(() => Qt(t), [t]), [l, o] = f.useState(r), [n, i] = f.useState(r), [u, m] = f.useState({});
  if ((t == null ? void 0 : t.id) !== a || r !== l && !Ia(r, l)) {
    const g = (t == null ? void 0 : t.id) !== void 0 && t.id === a;
    s(t == null ? void 0 : t.id), o(r), i(g ? Ht(n, l, r) : r), g || m({});
  }
  const y = f.useCallback((g, h) => {
    i((v) => ({ ...v, [g]: h })), m((v) => {
      if (!v[g] && !(g === "startDate" && v.dueDate)) return v;
      const w = { ...v };
      return delete w[g], g === "startDate" && delete w.dueDate, w;
    });
  }, []), p = f.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(r),
    [n, r]
  ), x = f.useCallback(() => {
    const g = {};
    return n.title.trim() || (g.title = xe("Tasks:Detail:Validation:TitleRequired", "Başlık zorunlu.")), n.startDate || (g.startDate = xe("Tasks:Detail:Validation:StartDateRequired", "Başlangıç tarihi zorunlu.")), n.dueDate && n.startDate && n.dueDate < n.startDate && (g.dueDate = xe("Tasks:Detail:Validation:DueBeforeStart", "Son tarih başlangıç tarihinden önce olamaz.")), m(g), Object.keys(g).length === 0;
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
  }, [r]), N = f.useCallback((g, h) => {
    if (!h) return;
    const v = Qt(h);
    i((w) => Ht(w, g, v));
  }, []);
  return { values: n, setField: y, isDirty: p, errors: u, validate: x, toUpdateDto: c, reset: d, commitSaved: N };
}
function Jt(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function Js() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Aa() {
  var l;
  const t = J({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Js,
    staleTime: 3e5,
    retry: !1
  }), a = ((l = t.data) == null ? void 0 : l.items) ?? [], s = a.map((o) => ({ value: o.id, label: Jt(o) })), r = new Map(a.map((o) => [o.id, Jt(o)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function Dt() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Ws(t) {
  const a = Dt();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function za(t) {
  const a = ne(), s = ["task-features", t], r = J({
    queryKey: s,
    queryFn: () => Ws(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = ae({
    mutationFn: (i) => Promise.resolve(Dt().addFeature(t, i)),
    onSuccess: l
  }), n = ae({
    mutationFn: (i) => Promise.resolve(Dt().removeFeature(t, i)),
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
  const a = (l = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.currentUser) == null ? void 0 : l.id, s = !!(a && ((t == null ? void 0 : t.creatorId) === a || (t == null ? void 0 : t.assigneeId) === a)) || ce("Platform.Projects.ManageTeam");
  return {
    canManage: s,
    canEdit: s && ce("Platform.Tasks.Edit"),
    canChangeStatus: s && ce("Platform.Tasks.ChangeStatus"),
    canDelete: s && ce("Platform.Tasks.Delete")
  };
}
const La = "rounded-2xl border border-subtle bg-surface-base shadow-xs", Se = `${La} overflow-hidden`;
function Qe({ title: t, badge: a, action: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3.5 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: t }),
      a
    ] }),
    s
  ] });
}
function Ma({ children: t, tone: a = "positive" }) {
  const s = a === "positive" ? "bg-success-subtle text-success" : "bg-neutral-subtle text-text-secondary";
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-full font-mono text-[11px] font-bold ${s}`, children: t });
}
function $e({ children: t, bg: a, fg: s }) {
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-[7px] text-[10.5px] font-bold ${a} ${s}`, children: t });
}
function be({ icon: t, title: a, description: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 px-6 py-10 text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-xl text-text-tertiary` }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: a }),
    s && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] leading-[1.55] text-text-tertiary max-w-[420px]", children: s })
  ] });
}
function pt({ name: t, size: a = 24 }) {
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
const Me = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—", ct = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function Ka(t) {
  return t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : "0 KB";
}
function mt(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = Math.floor(a / 3600), r = Math.floor(a % 3600 / 60);
  return !s && !r ? `${a}sn` : s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function Zs(t) {
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
}, Wt = (t = "") => Ra(t) === Ne.image;
function Ra(t = "") {
  var s;
  const a = ((s = t.split(".").pop()) == null ? void 0 : s.toLowerCase()) ?? "";
  return a === "pdf" ? Ne.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(a) ? Ne.image : ["doc", "docx", "odt", "rtf", "txt"].includes(a) ? Ne.doc : ["xls", "xlsx", "csv", "ods"].includes(a) ? Ne.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(a) ? Ne.code : ["zip", "rar", "7z", "tar", "gz"].includes(a) ? Ne.zip : Ne.other;
}
function Xs({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, l] = f.useState(""), [o, n] = f.useState(!1), i = ne(), u = (a == null ? void 0 : a.subTasks) ?? [], m = u.filter((c) => c.status === 4).length, y = () => i.invalidateQueries({ queryKey: ["task-detail", t] }), p = async () => {
    const c = r.trim();
    if (c) {
      n(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: c,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), l(""), await y();
      } catch (d) {
        P(d, "Alt görev eklenemedi.");
      } finally {
        n(!1);
      }
    }
  }, x = async (c, d) => {
    c.stopPropagation();
    try {
      await Promise.resolve(window.apya.platform.tasks.task.updateStatus(d.id, d.status === 4 ? 1 : 4)), await y();
    } catch (N) {
      P(N, "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        u.length > 0 && /* @__PURE__ */ e.jsxs(Ma, { children: [
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
        const d = fe(c.status), N = c.status === 4, g = Oe(c).canChangeStatus;
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
                  onClick: (h) => x(h, c),
                  disabled: !g,
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white ${g ? "cursor-pointer" : "cursor-default"} ${N ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: N && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: c.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${N ? "line-through text-text-tertiary" : "text-text-primary"}`, children: c.title }),
              /* @__PURE__ */ e.jsx($e, { bg: d.bg, fg: d.fg, children: d.label }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: Me(c.dueDate) }),
              /* @__PURE__ */ e.jsx(pt, { name: c.assigneeName }),
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
function qa() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function er(t) {
  const a = qa();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function tr(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, l = ws();
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
function zt(t) {
  const a = ne(), s = ["task-attachments", t], r = J({
    queryKey: s,
    queryFn: () => er(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = ae({
    mutationFn: (i) => tr(t, i),
    onSuccess: l
  }), n = ae({
    mutationFn: (i) => Promise.resolve(qa().deleteAttachment(i)),
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
function ar({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: l } = zt(t), o = ne(), n = f.useRef(null), [i, u] = f.useState(!1), m = ce("Platform.Tasks.ShareExternally"), y = async (c, d) => {
    try {
      await window.apya.platform.tasks.taskShare.setAttachmentGuestVisibility(c, d), o.invalidateQueries({ queryKey: ["task-attachments", t] });
    } catch (N) {
      P(N, "Görünürlük değiştirilemedi.");
    }
  }, p = async (c) => {
    var d, N, g;
    if (c)
      try {
        await s(c), (g = (N = (d = window == null ? void 0 : window.abp) == null ? void 0 : d.notify) == null ? void 0 : N.success) == null || g.call(N, "Dosya yüklendi.");
      } catch (h) {
        P(h, "Dosya yüklenemedi.");
      } finally {
        n.current && (n.current.value = "");
      }
  }, x = async (c, d) => {
    try {
      await r(c);
    } catch (N) {
      P(N, `${d} silinemedi.`);
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
      const d = Ra(c.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${d.bg} ${d.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: c.fileName, children: c.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: Ka(c.fileSize) })
              ] })
            ] }),
            m && !c.isGuestUpload && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 text-[11px] text-text-tertiary cursor-pointer", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: !!c.isVisibleToGuests,
                  onChange: (N) => y(c.id, N.target.checked)
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
          var d, N;
          c.preventDefault(), u(!1), p((N = (d = c.dataTransfer) == null ? void 0 : d.files) == null ? void 0 : N[0]);
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
function it() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function sr(t) {
  const a = it();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Lt(t) {
  const a = ne(), s = ["task-checklist", t], r = J({
    queryKey: s,
    queryFn: () => sr(t),
    enabled: !!t,
    staleTime: 3e4,
    /* toggleChecklistItem ters çevirir; bayat gösterim yanlış yöne yazar (proje
       konsolu paneli aynı maddeyi React Query dışından değiştiriyor). */
    meta: { persist: !1 },
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = ae({
    mutationFn: (u) => Promise.resolve(it().addChecklistItem(t, u)),
    onSuccess: l
  }), n = ae({
    mutationFn: (u) => Promise.resolve(it().toggleChecklistItem(u)),
    onSuccess: l
  }), i = ae({
    mutationFn: (u) => Promise.resolve(it().deleteChecklistItem(u)),
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
function rr({ taskId: t, readOnly: a = !1 }) {
  const { items: s, isLoading: r, addItem: l, toggleItem: o, removeItem: n } = Lt(t), [i, u] = f.useState(""), m = s.filter((x) => x.isDone).length, y = s.length ? Math.round(m / s.length * 100) : 0, p = async () => {
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
        y
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mt-3.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
      "div",
      {
        className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
        style: { width: `${y}%` }
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
function nr({ taskId: t, task: a }) {
  const [s, r] = f.useState(""), [l, o] = f.useState(null), [n, i] = f.useState(""), [u, m] = f.useState(!1), y = ne(), p = (a == null ? void 0 : a.comments) ?? [], x = async (d) => {
    var N, g, h;
    if (d == null || d.preventDefault(), !(!s.trim() || u)) {
      m(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), y.invalidateQueries({ queryKey: ["task-detail", t] }), (h = (g = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : g.success) == null || h.call(g, "Yorum eklendi.");
      } catch (v) {
        P(v, "Yorum eklenemedi.");
      } finally {
        m(!1);
      }
    }
  }, c = async (d) => {
    var N, g, h;
    if (!(!n.trim() || u)) {
      m(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(d, n.trim())
        ), i(""), o(null), y.invalidateQueries({ queryKey: ["task-detail", t] }), (h = (g = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : g.success) == null || h.call(g, "Yanıt eklendi.");
      } catch (v) {
        P(v, "Yanıt eklenemedi.");
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
        re,
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
        re,
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
            onChange: (N) => i(N.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(re, { variant: "ghost", size: "sm", onClick: () => o(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(re, { variant: "primary", size: "sm", disabled: !n.trim() || u, onClick: () => c(d.id), children: "Gönder" })
        ] })
      ] }),
      d.replies && d.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: d.replies.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: N.creatorUserName || N.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: N.creationTime ? new Date(N.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: N.text })
      ] }, N.id)) })
    ] }, d.id)) })
  ] });
}
function ft() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.taskShare) ?? null;
}
function ir(t) {
  const a = ne(), s = ["task-share-links", t], r = J({
    queryKey: s,
    queryFn: () => {
      const i = ft();
      return i ? Promise.resolve(i.getList(t)) : Promise.reject(new Error("Paylaşım servisi yüklenmedi."));
    },
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = ae({
    mutationFn: (i) => Promise.resolve(ft().create({ ...i, taskId: t })),
    onSuccess: l
  }), n = ae({
    mutationFn: (i) => Promise.resolve(ft().revoke(i)),
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
const Zt = {
  recipientName: "",
  recipientEmail: "",
  lifetimeDays: 14,
  allowComment: !0,
  allowUpload: !0,
  allowDownload: !0
};
function lr(t) {
  return t ? new Date(t).toLocaleDateString("tr-TR") : "—";
}
function or({ taskId: t }) {
  const { links: a, isPending: s, create: r, revoke: l, isCreating: o } = ir(t), [n, i] = f.useState(Zt), [u, m] = f.useState(null);
  if (!ce("Platform.Tasks.ShareExternally"))
    return /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Görevi ekip dışıyla paylaşma yetkiniz yok." });
  const p = (g) => (h) => {
    const v = h.target.type === "checkbox" ? h.target.checked : h.target.value;
    i((w) => ({ ...w, [g]: v }));
  }, x = async (g) => {
    if (g.preventDefault(), !!n.recipientName.trim())
      try {
        const h = await r({
          ...n,
          recipientName: n.recipientName.trim(),
          // QA-41: boş e-posta "yok" demektir; "" gönderilirse sunucu doğrulaması reddeder.
          recipientEmail: n.recipientEmail.trim() || null,
          lifetimeDays: Number(n.lifetimeDays) || 14
        });
        m(h), i(Zt);
      } catch (h) {
        P(h, "Paylaşım linki üretilemedi.");
      }
  }, c = (g) => `${window.location.origin}${g}`, d = (g) => {
    var h, v, w, D;
    (h = navigator.clipboard) == null || h.writeText(c(g)), (D = (w = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : w.info) == null || D.call(w, "Bağlantı kopyalandı.");
  }, N = async (g) => {
    try {
      await l(g);
    } catch (h) {
      P(h, "Bağlantı iptal edilemedi.");
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
            "aria-label": "Alıcının adı soyadı",
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
            "aria-label": "Alıcının e-postası (isteğe bağlı)",
            className: "min-w-0 flex-[2_1_180px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        ),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 text-[12px] text-text-secondary", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "number",
              min: "1",
              max: "90",
              value: n.lifetimeDays,
              onChange: p("lifetimeDays"),
              title: "Geçerlilik (gün)",
              "aria-label": "Geçerlilik süresi (gün)",
              className: "w-[72px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
            }
          ),
          "gün geçerli"
        ] })
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
              g.isActive ? `${lr(g.expiresAt)} tarihine kadar geçerli` : g.revokedAt ? "İptal edildi" : "Süresi doldu",
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
              onClick: () => N(g.id),
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
function cr({ task: t }) {
  var s;
  const a = [];
  return t != null && t.creationTime && a.push({
    id: "created",
    icon: "fa-plus",
    bg: "bg-success-subtle",
    fg: "text-success",
    actor: t.creatorUserName || t.creatorName || "Sistem / Kullanıcı",
    event: "görevi oluşturdu",
    time: ct(t.creationTime)
  }), t != null && t.lastModificationTime && a.push({
    id: "modified",
    icon: "fa-pen",
    bg: "bg-warning-subtle",
    fg: "text-warning",
    actor: t.lastModifierUserName || t.lastModifierName || "Kullanıcı",
    event: "görevi güncelledi",
    time: ct(t.lastModificationTime)
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
function dr({ label: t, value: a, hint: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4 px-3.5 py-3", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[12.5px] font-semibold text-text-secondary", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 text-right", children: [
      /* @__PURE__ */ e.jsx("span", { className: "block text-[12.5px] font-bold text-text-primary break-words", children: a ?? "—" }),
      s && /* @__PURE__ */ e.jsx("span", { className: "block text-[11px] text-text-tertiary", children: s })
    ] })
  ] });
}
function xr({ task: t = {}, nameById: a }) {
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
      /* @__PURE__ */ e.jsx("div", { className: "divide-y divide-subtle", children: r.map((l) => /* @__PURE__ */ e.jsx(dr, { ...l }, l.label)) })
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11.5px] text-text-tertiary", children: "Alan bazında değişiklik günlüğü (hangi alan, eski/yeni değer) henüz yayınlanmadı." })
  ] });
}
function ur(t) {
  var s, r, l;
  const a = (l = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.projectBudgets) == null ? void 0 : l.projectBudget;
  return a != null && a.getRecordFormLookup ? Promise.resolve(a.getRecordFormLookup(t)) : Promise.reject(new Error("Bütçe servisi yüklenmedi."));
}
function pr(t) {
  var l;
  const a = ce("Platform.Projects.ViewBudget"), s = J({
    queryKey: ["task-detail", "budget-lines", t],
    queryFn: () => ur(t),
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
function dt(t) {
  var s, r;
  const a = (r = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.ajax) == null ? void 0 : r.call(s, t);
  return a ? new Promise((l, o) => {
    a.done(l).fail(o);
  }) : Promise.reject(new Error("ABP köprüsü yüklenmedi."));
}
function xt(t, a = {}) {
  var l;
  const s = ((l = window == null ? void 0 : window.abp) == null ? void 0 : l.appPath) ?? "/", r = new URLSearchParams({ handler: t });
  return Object.entries(a).forEach(([o, n]) => {
    n != null && n !== "" && r.append(o, n);
  }), `${s}Documents/Matching?${r.toString()}`;
}
const Ga = () => ce("Platform.Documents"), mr = () => ce("Platform.Documents.ManageMeta");
function fr(t) {
  const a = !!t && Ga(), s = J({
    queryKey: ["task-detail", "expense-matches", t],
    queryFn: () => dt({ url: xt("Matches", { projectId: t }), type: "GET" }),
    enabled: a,
    staleTime: 6e4,
    meta: { persist: !1 },
    retry: !1
  }), r = /* @__PURE__ */ new Map();
  return (s.data ?? []).forEach((l) => {
    r.has(l.expenseId) || r.set(l.expenseId, []), r.get(l.expenseId).push(l);
  }), { byExpense: r, enabled: a, isLoading: s.isLoading };
}
function br(t, a) {
  const s = J({
    queryKey: ["task-detail", "expense-candidates", t],
    queryFn: () => dt({ url: xt("Candidates", { expenseId: t }), type: "GET" }),
    enabled: !!t && a && Ga(),
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  });
  return { candidates: s.data ?? [], isLoading: s.isLoading };
}
function hr(t) {
  const a = ne(), s = (o) => {
    a.invalidateQueries({ queryKey: ["task-detail", "expense-matches", t] }), a.invalidateQueries({ queryKey: ["task-detail", "expense-candidates", o] });
  }, r = ae({
    mutationFn: ({ documentFileId: o, expenseId: n, score: i }) => dt({
      url: xt("CreateMatch"),
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ documentFileId: o, expenseId: n, score: i ?? 0 })
    }),
    onSuccess: (o, n) => s(n.expenseId)
  }), l = ae({
    mutationFn: ({ matchId: o }) => dt({ url: xt("RemoveMatch", { matchId: o }), type: "POST" }),
    onSuccess: (o, n) => s(n.expenseId)
  });
  return { link: r, unlink: l, isBusy: r.isPending || l.isPending };
}
function yr(t) {
  return t == null ? "—" : new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 2 }).format(t);
}
function gr({ expenseId: t, projectId: a, matches: s }) {
  const { candidates: r, isLoading: l } = br(t, !0), { link: o, unlink: n, isBusy: i } = hr(a), u = mr(), m = new Set(s.map((p) => p.documentFileId)), y = r.filter((p) => !m.has(p.documentFileId));
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
          re,
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
      !l && y.length === 0 && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Eşleşen aday yok. Evrak Belgeler modülünden yüklenip buradan bağlanır." }),
      y.map((p) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[11px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12px] text-text-primary", children: p.displayName }),
        /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
          yr(p.amount),
          " · ",
          Me(p.documentDate)
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: `shrink-0 font-mono text-[11px] font-bold ${p.isStrong ? "text-success" : "text-text-tertiary"}`, children: [
          "%",
          p.score
        ] }),
        u && /* @__PURE__ */ e.jsx(
          re,
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
function ye(t, a) {
  const s = a || "TRY";
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: s, minimumFractionDigits: 2 }).format(t || 0);
  } catch {
    return `${(t || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${s}`.trim();
  }
}
const vr = ["pointerdown", "focusin", "wheel", "touchmove"], jr = (t) => t.stopPropagation();
function Nr(t, a, s, r) {
  var u, m, y, p, x, c, d;
  const l = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.ModalManager;
  if (!l) {
    (p = (y = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : y.error) == null || p.call(y, "Kayıt formu yüklenemedi."), r == null || r();
    return;
  }
  const o = ((x = window == null ? void 0 : window.abp) == null ? void 0 : x.appPath) ?? "/";
  (d = (c = document.activeElement) == null ? void 0 : c.blur) == null || d.call(c);
  const n = new l({ viewUrl: `${o}${t}?TaskId=${a}` });
  n.onResult(() => s == null ? void 0 : s()), n.onOpen(() => r == null ? void 0 : r()), n.open();
  const i = document.getElementById(n.getModalId());
  i && (i.setAttribute("data-apya-overlay", "abp-modal"), i.style.pointerEvents = "auto", vr.forEach((N) => i.addEventListener(N, jr, { passive: !0 }))), setTimeout(() => r == null ? void 0 : r(), 1e4);
}
function wr({ taskId: t }) {
  const a = ne(), [s, r] = f.useState(null), l = ce("Platform.Expenses.Create"), o = ce("Platform.Incomes.Create"), n = ce("Platform.Invoices.Create");
  if (!t || !l && !o && !n)
    return null;
  const i = () => a.invalidateQueries({ queryKey: ["task-detail", t] }), u = (m) => {
    s || (r(m), Nr(m, t, i, () => r((y) => y === m ? null : y)));
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
        onClick: () => u("Expenses/CreateModal"),
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
        onClick: () => u("Incomes/CreateModal"),
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
        onClick: () => u("Invoices/CreateModal"),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-invoice text-[11px]" }),
          "Fatura ekle"
        ]
      }
    )
  ] });
}
const Xt = {
  0: { label: "Taslak", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  1: { label: "Gönderildi", bg: "bg-primary-subtle", fg: "text-primary" },
  2: { label: "Ödendi", bg: "bg-success-subtle", fg: "text-success" },
  3: { label: "İptal", bg: "bg-neutral-subtle", fg: "text-text-tertiary" },
  4: { label: "Gecikti", bg: "bg-negative-subtle", fg: "text-negative" }
};
function kr({ invoices: t, action: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
    /* @__PURE__ */ e.jsx(Qe, { title: "Faturalar", action: a }),
    t.map((s) => {
      const r = Xt[s.status] ?? Xt[0];
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
                children: ye(s.totalAmount, s.currency)
              }
            )
          ]
        },
        s.id
      );
    })
  ] });
}
function Cr({ line: t, projectId: a, matches: s, docsEnabled: r }) {
  const [l, o] = f.useState(!1), n = t.kind === "income";
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
      n ? /* @__PURE__ */ e.jsx($e, { bg: "bg-success-subtle", fg: "text-success", children: "Gelir" }) : /* @__PURE__ */ e.jsx($e, { bg: "bg-warning-subtle", fg: "text-warning", children: "Gider" }),
      /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: `shrink-0 font-mono text-[12.5px] font-bold ${n ? "text-success" : "text-text-primary"}`,
          style: { fontVariantNumeric: "tabular-nums" },
          children: [
            n ? "+" : "−",
            ye(t.amount, t.currency)
          ]
        }
      )
    ] }),
    r && l && /* @__PURE__ */ e.jsx(gr, { expenseId: t.id, projectId: a, matches: s })
  ] });
}
function bt({ label: t, value: a, tone: s, note: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: `font-mono text-[22px] font-bold tracking-[-.02em] ${s}`, style: { fontVariantNumeric: "tabular-nums" }, children: a }),
    r && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
  ] });
}
function Dr({ options: t, isLoading: a, lineId: s, planned: r, onField: l }) {
  return a ? null : t.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12px] text-text-tertiary", children: "Bu projede bütçe kalemi tanımlı değil — kalemler Finans & Bütçe ekranından açılır." }) : /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Bütçe kalemi" }),
      /* @__PURE__ */ e.jsx(
        ka,
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
        vs,
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
function Tr({ task: t, form: a, spentByCurrency: s, readOnly: r }) {
  const l = (a ? a.values.projectId : t == null ? void 0 : t.projectId) ?? null, { options: o, lines: n, canViewBudget: i, isLoading: u } = pr(l), m = !!a && !r && i && !!l, y = (a ? a.values.budgetLineId : t == null ? void 0 : t.budgetLineId) ?? null, p = (a ? a.values.plannedAmount : t == null ? void 0 : t.plannedAmount) ?? null;
  if (!m && (!y || p == null))
    return null;
  const x = n.find((D) => D.id === y), c = x ? x.remainingAmount : t == null ? void 0 : t.budgetLineRemaining, d = s, N = !!y && p != null, g = (p ?? 0) - d, h = p > 0 ? Math.round(d / p * 100) : 0, v = g < 0, w = () => {
    a.setField("budgetLineId", null), a.setField("plannedAmount", null);
  };
  return (
    /* Kırpmayan kart ŞART: kalem seçicisinin listesi kartın içine absolute
       konumlanır, TAB_CARD'ın overflow-hidden'ı onu alt kenarda keserdi. */
    /* @__PURE__ */ e.jsxs("div", { className: La, children: [
      /* @__PURE__ */ e.jsx(
        Qe,
        {
          title: "Bütçe bağı",
          action: m && y ? /* @__PURE__ */ e.jsx(re, { type: "button", variant: "ghost", size: "sm", onClick: w, children: "Bağı kaldır" }) : null
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "px-4 pb-4 pt-1 flex flex-col gap-3", children: [
        m ? /* @__PURE__ */ e.jsx(
          Dr,
          {
            options: o,
            isLoading: u,
            lineId: y,
            planned: p,
            onField: a.setField
          }
        ) : /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-semibold text-accent", children: t.budgetLineName || "Bütçe kalemi" }) }),
        c != null && /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "kalemde kalan ",
          ye(c, "TRY")
        ] }),
        N && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3", children: [
            /* @__PURE__ */ e.jsx(ht, { label: "Görev bütçesi", value: ye(p, "TRY") }),
            /* @__PURE__ */ e.jsx(ht, { label: "Gerçekleşen", value: ye(d, "TRY") }),
            /* @__PURE__ */ e.jsx(
              ht,
              {
                label: "Kalan",
                value: ye(g, "TRY"),
                tone: v ? "text-negative" : "text-success"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
              "div",
              {
                className: `h-full rounded-full ${v ? "bg-negative" : h >= 80 ? "bg-warning" : "bg-success"}`,
                style: { width: `${Math.min(Math.max(h, 0), 100)}%` }
              }
            ) }),
            /* @__PURE__ */ e.jsxs("div", { className: "mt-1 text-[11.5px] text-text-tertiary", children: [
              "%",
              h,
              v && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative", children: "· görev bütçesi aşıldı" })
            ] })
          ] })
        ] })
      ] })
    ] })
  );
}
function ht({ label: t, value: a, tone: s }) {
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
function Sr({ task: t, taskId: a, form: s, readOnly: r = !1 }) {
  const l = (t == null ? void 0 : t.expenses) || [], o = (t == null ? void 0 : t.incomes) || [], n = (t == null ? void 0 : t.invoices) || [], i = (s ? s.values.projectId : t == null ? void 0 : t.projectId) ?? null, { byExpense: u, enabled: m } = fr(i), y = l.filter((g) => (g.currency || "TRY") === "TRY").reduce((g, h) => g + (h.amount || 0), 0), p = /* @__PURE__ */ e.jsx(Tr, { task: t, form: s, spentByCurrency: y, readOnly: r }), x = /* @__PURE__ */ e.jsx(wr, { taskId: a ?? (t == null ? void 0 : t.id) });
  if (l.length === 0 && o.length === 0 && n.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      p,
      /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
        /* @__PURE__ */ e.jsx(Qe, { title: "Görev Finansı", action: x }),
        /* @__PURE__ */ e.jsx(
          be,
          {
            icon: "fa-coins",
            title: "Kayıt yok",
            description: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
          }
        )
      ] })
    ] });
  const d = Array.from(new Set([...l, ...o].map((g) => g.currency || "TRY"))).map((g) => {
    const h = o.filter((w) => (w.currency || "TRY") === g).reduce((w, D) => w + (D.amount || 0), 0), v = l.filter((w) => (w.currency || "TRY") === g).reduce((w, D) => w + (D.amount || 0), 0);
    return { cur: g, inc: h, exp: v, net: h - v };
  }), N = [
    ...o.map((g) => ({ ...g, kind: "income" })),
    ...l.map((g) => ({ ...g, kind: "expense" }))
  ].sort((g, h) => new Date(h.date || 0) - new Date(g.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    p,
    d.map(({ cur: g, inc: h, exp: v, net: w }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(bt, { label: `Toplam Gelir (${g})`, value: ye(h, g), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(bt, { label: `Toplam Gider (${g})`, value: ye(v, g), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        bt,
        {
          label: `Net Bakiye (${g})`,
          value: ye(w, g),
          tone: w >= 0 ? "text-success" : "text-negative",
          note: w >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, g)),
    n.length > 0 && /* @__PURE__ */ e.jsx(kr, { invoices: n, action: N.length === 0 ? x : null }),
    N.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
      /* @__PURE__ */ e.jsx(Qe, { title: "Finans kalemleri", action: x }),
      N.map((g) => /* @__PURE__ */ e.jsx(
        Cr,
        {
          line: g,
          projectId: i,
          matches: g.kind === "expense" ? u.get(g.id) ?? [] : [],
          docsEnabled: m && g.kind === "expense"
        },
        `${g.kind}-${g.id}`
      ))
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11px] text-text-tertiary", children: "Buradan eklenen kayıt göreve ve projesine etiketlenir; düzenleme/silme Finans modülünden yapılır. Evraklar Belgeler modülünde yaşar, buradan gidere bağlanır." })
  ] });
}
function $r({ taskId: t }) {
  const { attachments: a, isLoading: s, upload: r, remove: l, isUploading: o } = zt(t), n = f.useRef(null), [i, u] = f.useState(!1), m = a.filter((x) => Wt(x.fileName)), y = async (x) => {
    var c, d, N, g, h, v;
    if (x) {
      if (!Wt(x.name)) {
        (N = (d = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : d.error) == null || N.call(d, "Galeriye yalnız görsel dosya yüklenebilir.");
        return;
      }
      try {
        await r(x), (v = (h = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : h.success) == null || v.call(h, "Görsel yüklendi.");
      } catch (w) {
        P(w, "Görsel yüklenemedi.");
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
          return y((c = x.target.files) == null ? void 0 : c[0]);
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
              /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: Ka(x.fileSize) })
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
          x.preventDefault(), u(!1), y((d = (c = x.dataTransfer) == null ? void 0 : c.files) == null ? void 0 : d[0]);
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
const Pr = [
  { key: "title", label: "Başlık", align: "left" },
  { key: "status", label: "Durum", align: "left" },
  { key: "priority", label: "Öncelik", align: "left" },
  { key: "assignee", label: "Atanan", align: "left" },
  { key: "dueDate", label: "Termin", align: "right" }
];
function ea(t, a) {
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
function Er(t, a, s, r) {
  const l = ea(t, s), o = ea(a, s), n = l === null || l === "", i = o === null || o === "";
  return n && i ? 0 : n ? 1 : i ? -1 : l === o ? 0 : (l < o ? -1 : 1) * (r === "asc" ? 1 : -1);
}
function Br({ task: t = {}, onOpenSubtask: a }) {
  const [s, r] = f.useState({ key: "dueDate", dir: "asc" }), l = (t == null ? void 0 : t.subTasks) ?? [], o = f.useMemo(
    () => [...l].sort((i, u) => Er(i, u, s.key, s.dir)),
    [l, s.key, s.dir]
  ), n = (i) => r((u) => u.key === i ? { key: i, dir: u.dir === "asc" ? "desc" : "asc" } : { key: i, dir: "asc" });
  return l.length === 0 ? /* @__PURE__ */ e.jsx(
    be,
    {
      icon: "fa-table",
      title: "Alt görev yok",
      description: "Alt Görevler sekmesinden ekledikleriniz burada tablo olarak listelenir."
    }
  ) : /* @__PURE__ */ e.jsx("div", { className: `${Se} overflow-x-auto`, children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse text-[12.5px]", children: [
    /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsx("tr", { className: "bg-surface-raised", children: Pr.map((i) => {
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
      const u = fe(i.status), m = ut(i.priority), y = Da(i.dueDate);
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
              /* @__PURE__ */ e.jsx(pt, { name: i.assigneeName, size: 22 }),
              /* @__PURE__ */ e.jsx("span", { className: "truncate text-text-secondary", children: i.assigneeName })
            ] }) : /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: "Atanmadı" }) }),
            /* @__PURE__ */ e.jsxs("td", { className: `px-3.5 py-2.5 text-right whitespace-nowrap ${y.tone}`, children: [
              i.dueDate ? Me(i.dueDate) : "—",
              y.hint && /* @__PURE__ */ e.jsx("div", { className: "text-[11px]", children: y.hint })
            ] })
          ]
        },
        i.id
      );
    }) })
  ] }) });
}
function Ir({ taskId: t, task: a = {}, onOpenSubtask: s }) {
  const r = ne(), l = (a == null ? void 0 : a.subTasks) ?? [], [o, n] = f.useState(null), [i, u] = f.useState(null), m = async (y, p) => {
    const x = l.find((c) => c.id === y);
    if (!(!x || x.status === p || !Oe(x).canChangeStatus)) {
      u(y);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.updateStatus(y, p)), await r.invalidateQueries({ queryKey: ["task-detail", t] });
      } catch (c) {
        P(c, "Alt görev durumu güncellenemedi.");
      } finally {
        u(null);
      }
    }
  };
  return l.length === 0 ? /* @__PURE__ */ e.jsx(
    be,
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 items-start", children: Ut.map((y) => {
      const p = fe(y), x = l.filter((d) => d.status === y), c = o === y;
      return /* @__PURE__ */ e.jsxs(
        "section",
        {
          "aria-label": `${p.label} sütunu`,
          onDragOver: (d) => {
            d.preventDefault(), o !== y && n(y);
          },
          onDragLeave: () => n((d) => d === y ? null : d),
          onDrop: (d) => {
            var g;
            d.preventDefault(), n(null);
            const N = (g = d.dataTransfer) == null ? void 0 : g.getData("text/plain");
            N && m(N, y);
          },
          className: `flex flex-col gap-2 p-2.5 rounded-2xl border bg-surface-raised min-h-[120px] transition-colors duration-fast ${c ? "border-focus bg-primary-subtle" : "border-subtle"}`,
          children: [
            /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-2 px-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${p.dot}` }),
              /* @__PURE__ */ e.jsx("h3", { className: "m-0 flex-1 text-[12px] font-bold text-text-primary", children: p.label }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: x.length })
            ] }),
            x.map((d) => {
              const N = ut(d.priority), g = Oe(d).canChangeStatus;
              return /* @__PURE__ */ e.jsxs(
                "article",
                {
                  draggable: g,
                  onDragStart: (h) => {
                    var v;
                    return (v = h.dataTransfer) == null ? void 0 : v.setData("text/plain", d.id);
                  },
                  role: "button",
                  tabIndex: 0,
                  onClick: () => s == null ? void 0 : s(d.id),
                  onKeyDown: (h) => {
                    h.key === "Enter" && (s == null || s(d.id));
                  },
                  className: `flex flex-col gap-2 p-2.5 rounded-[12px] border border-subtle bg-surface-base shadow-xs cursor-pointer hover:border-focus hover:shadow-md ${i === d.id ? "opacity-60" : ""}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary line-clamp-2", children: d.title }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                      /* @__PURE__ */ e.jsxs("span", { className: `text-[10.5px] font-bold ${N.fg}`, children: [
                        /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${N.icon} text-[9px] mr-1` }),
                        N.label
                      ] }),
                      d.dueDate && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: Me(d.dueDate) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2 border-t border-subtle", children: [
                      d.assigneeName ? /* @__PURE__ */ e.jsx(pt, { name: d.assigneeName, size: 20 }) : /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] text-text-tertiary", children: "Atanmadı" }),
                      /* @__PURE__ */ e.jsx(
                        "select",
                        {
                          "aria-label": `${d.title} durumunu değiştir`,
                          value: d.status,
                          onClick: (h) => h.stopPropagation(),
                          onChange: (h) => m(d.id, Number(h.target.value)),
                          disabled: !g,
                          className: `h-[24px] px-1.5 rounded-[6px] border border-subtle bg-surface-base text-[10.5px] text-text-secondary ${g ? "cursor-pointer" : "cursor-default"}`,
                          children: Ut.map((h) => /* @__PURE__ */ e.jsx("option", { value: h, children: fe(h).label }, h))
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
        y
      );
    }) })
  );
}
const Fr = [
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
], Ar = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], ta = (t) => String(t).padStart(2, "0"), Ya = (t, a, s) => `${t}-${ta(a + 1)}-${ta(s)}`;
function Tt(t) {
  if (!t) return null;
  const a = /^(\d{4}-\d{2}-\d{2})/.exec(String(t));
  return a ? a[1] : null;
}
function zr(t, a) {
  const r = (new Date(t, a, 1).getDay() + 6) % 7, l = new Date(t, a + 1, 0).getDate(), o = [];
  for (let n = 0; n < 42; n++) {
    const i = n - r + 1;
    o.push(i >= 1 && i <= l ? { key: Ya(t, a, i), day: i, inMonth: !0 } : { key: `bos-${n}`, day: null, inMonth: !1 });
  }
  return o;
}
function Lr(t) {
  const a = /* @__PURE__ */ new Map(), s = (r, l) => {
    const o = Tt(r);
    o && (a.has(o) || a.set(o, []), a.get(o).push(l));
  };
  s(t == null ? void 0 : t.startDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "start", isSelf: !0, status: t == null ? void 0 : t.status }), s(t == null ? void 0 : t.dueDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "due", isSelf: !0, status: t == null ? void 0 : t.status });
  for (const r of (t == null ? void 0 : t.subTasks) ?? [])
    s(r.startDate, { id: r.id, title: r.title, kind: "start", isSelf: !1, status: r.status }), s(r.dueDate, { id: r.id, title: r.title, kind: "due", isSelf: !1, status: r.status });
  return a;
}
function Mr({ task: t = {}, onOpenSubtask: a }) {
  const s = f.useMemo(() => Lr(t), [t]), [r, l] = f.useState(() => {
    const m = Tt(t == null ? void 0 : t.startDate) ?? Tt(t == null ? void 0 : t.dueDate);
    if (m) {
      const [p, x] = m.split("-").map(Number);
      return { year: p, month: x - 1 };
    }
    const y = /* @__PURE__ */ new Date();
    return { year: y.getFullYear(), month: y.getMonth() };
  }), o = f.useMemo(() => zr(r.year, r.month), [r.year, r.month]), n = (m) => l(({ year: y, month: p }) => {
    const x = p + m;
    return { year: y + Math.floor(x / 12), month: (x % 12 + 12) % 12 };
  }), i = /* @__PURE__ */ new Date(), u = Ya(i.getFullYear(), i.getMonth(), i.getDate());
  return s.size === 0 ? /* @__PURE__ */ e.jsx(
    be,
    {
      icon: "fa-calendar",
      title: "Takvimde gösterilecek tarih yok",
      description: "Göreve başlangıç veya termin tarihi girildiğinde burada aylık takvimde görünür."
    }
  ) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-3.5 py-3 border-b border-subtle bg-surface-raised", children: [
      /* @__PURE__ */ e.jsxs("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: [
        Fr[r.month],
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-subtle bg-surface-raised", children: Ar.map((m) => /* @__PURE__ */ e.jsx("span", { className: "px-2 py-1.5 text-center text-[11px] font-bold text-text-tertiary", children: m }, m)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: o.map((m) => {
      const y = m.inMonth ? s.get(m.key) ?? [] : [], p = m.key === u;
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: `flex flex-col gap-1 min-h-[76px] p-1.5 border-r border-b border-subtle last-of-type:border-r-0 ${m.inMonth ? "" : "bg-surface-sunken"}`,
          children: [
            m.inMonth && /* @__PURE__ */ e.jsx("span", { className: `self-end font-mono text-[11px] font-bold ${p ? "flex items-center justify-center h-[18px] w-[18px] rounded-full bg-primary text-white" : "text-text-tertiary"}`, children: m.day }),
            y.map((x, c) => {
              const d = fe(x.status);
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
function Kr(t) {
  const a = Ve();
  return a ? Promise.resolve(a.getDocuments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Rr(t) {
  const a = ne(), s = ["task-documents", t], r = J({
    queryKey: s,
    queryFn: () => Kr(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = ae({
    mutationFn: (u) => Promise.resolve(Ve().createDocument(t, u)),
    onSuccess: l
  }), n = ae({
    mutationFn: ({ id: u, title: m, content: y }) => Promise.resolve(Ve().updateDocument(u, { title: m, content: y })),
    onSuccess: (u) => {
      l(), u != null && u.id && a.setQueryData(["task-document", u.id], u);
    }
  }), i = ae({
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
function qr(t) {
  return J({
    queryKey: ["task-document", t],
    queryFn: () => Promise.resolve(Ve().getDocument(t)),
    enabled: !!t,
    /* Kayıt tam değiştirir (updateDocument {id,title,content}); bayat gövdeden
       kaydetmek başka ekranda yapılan değişikliği ezer. */
    meta: { persist: !1 },
    retry: !1
  });
}
function Gr({ taskId: t }) {
  const { documents: a, isLoading: s, createDocument: r, updateDocument: l, removeDocument: o, isSaving: n } = Rr(t), [i, u] = f.useState(null), [m, y] = f.useState(""), [p, x] = f.useState(""), [c, d] = f.useState(!1), [N, g] = f.useState(!1), { data: h, isFetching: v } = qr(i);
  f.useEffect(() => {
    !h || h.id !== i || (y(h.title ?? ""), x(h.content ?? ""), d(!1));
  }, [h == null ? void 0 : h.id]);
  const w = async () => {
    try {
      const E = await r("Yeni belge");
      E != null && E.id && u(E.id);
    } catch (E) {
      P(E, "Belge oluşturulamadı.");
    }
  }, D = async () => {
    var O, Y, G, F, M, U;
    const E = m.trim();
    if (!E)
      return (G = (Y = (O = window == null ? void 0 : window.abp) == null ? void 0 : O.notify) == null ? void 0 : Y.error) == null || G.call(Y, "Belge başlığı boş olamaz."), !1;
    try {
      return await l({ id: i, title: E, content: p }), d(!1), (U = (M = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : M.success) == null || U.call(M, "Belge kaydedildi."), !0;
    } catch (_) {
      return P(_, "Belge kaydedilemedi."), !1;
    }
  }, I = async (E, O) => {
    try {
      await o(E), i === E && u(null);
    } catch (Y) {
      P(Y, `“${O}” silinemedi.`);
    }
  }, B = () => {
    if (c) {
      g(!0);
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
          onClick: B,
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
          onChange: (E) => {
            y(E.target.value), d(!0);
          },
          className: "flex-1 min-w-0 h-9 px-3 rounded-[10px] border border-subtle bg-surface-base text-[13.5px] font-bold text-text-primary focus:border-focus focus:shadow-focus focus:outline-none"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: D,
          disabled: n || !c,
          className: `flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[12.5px] font-bold ${n || !c ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n ? "fa-circle-notch fa-spin" : "fa-floppy-disk"} text-[11px]` }),
            n ? "Kaydediliyor…" : c ? "Kaydet" : "Kaydedildi"
          ]
        }
      )
    ] }),
    v && !h ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Belge yükleniyor…" }) : /* @__PURE__ */ e.jsx(
      Ta,
      {
        value: p,
        placeholder: "Belgeyi buraya yazın…",
        onChange: (E) => {
          x(E), d(!0);
        }
      }
    ),
    /* @__PURE__ */ e.jsx(
      Et,
      {
        open: N,
        isSaving: n,
        onStay: () => g(!1),
        onDiscard: () => {
          g(!1), d(!1), u(null);
        },
        onSave: async () => {
          const E = await D();
          g(!1), E && u(null);
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
          onClick: w,
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
      be,
      {
        icon: "fa-file-lines",
        title: "Henüz belge yok",
        description: "Toplantı notu, teknik şartname ya da teslim tutanağı gibi metinleri buraya yazabilirsiniz."
      }
    ),
    a.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: a.map((E) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "group flex items-center gap-3 px-3.5 py-3 border-b border-subtle last:border-b-0 hover:bg-surface-raised",
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[14px]" }) }),
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => u(E.id),
              className: "flex-1 min-w-0 bg-transparent border-0 p-0 text-left cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[13px] font-bold text-text-primary", children: E.title }),
                /* @__PURE__ */ e.jsx("span", { className: "block text-[11.5px] text-text-tertiary", children: E.contentLength > 0 ? `${E.editorName} · ${ct(E.lastModificationTime ?? E.creationTime)}` : "Boş belge — açıp yazmaya başlayın" })
              ]
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              "aria-label": `${E.title} belgesini sil`,
              onClick: () => I(E.id, E.title),
              className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[12px]" })
            }
          )
        ]
      },
      E.id
    )) })
  ] });
}
function Le() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Yr(t) {
  const a = Le();
  return a ? Promise.resolve(a.getLinkedForms(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function _r(t) {
  const a = ne(), s = ["task-forms", t], r = J({
    queryKey: s,
    queryFn: () => Yr(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => a.invalidateQueries({ queryKey: s }), o = ae({
    mutationFn: (u) => Promise.resolve(Le().linkForm(t, u)),
    onSuccess: l
  }), n = ae({
    mutationFn: (u) => Promise.resolve(Le().unlinkForm(u)),
    onSuccess: l
  }), i = ae({
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
function Ur(t, a) {
  return J({
    queryKey: ["task-form-options", t],
    queryFn: () => Promise.resolve(Le().getFormOptions(t)),
    enabled: !!t && !!a,
    meta: { persist: !1 },
    retry: !1
  });
}
function Vr(t, a) {
  return J({
    queryKey: ["task-form-responses", t, a],
    queryFn: () => Promise.resolve(Le().getFormResponses(t, a)),
    enabled: !!t && !!a,
    meta: { persist: !1 },
    retry: !1
  });
}
function Or({ taskId: t, documentId: a }) {
  const { data: s, isLoading: r } = Vr(t, a);
  return r ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Yanıtlar yükleniyor…" }) : s != null && s.length ? /* @__PURE__ */ e.jsx("ul", { className: "m-0 list-none p-0", children: s.map((l) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-3 px-3.5 py-2 border-t border-subtle", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l.isGuestSubmission ? "fa-user-clock" : "fa-user"} text-[10px] text-text-tertiary` }),
      /* @__PURE__ */ e.jsx("span", { className: "truncate text-[12.5px] text-text-primary", children: l.respondentName }),
      l.isGuestSubmission && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: "· dış" })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary", children: ct(l.creationTime) })
  ] }, l.id)) }) : /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Bu görevde henüz yanıt yok." });
}
function Qr({ taskId: t }) {
  const { forms: a, isLoading: s, linkForm: r, unlinkForm: l, setGuestFillable: o, isLinking: n } = _r(t), [i, u] = f.useState(!1), [m, y] = f.useState(null), { data: p, isLoading: x } = Ur(t, i), c = ce("Platform.Tasks.ShareExternally"), d = async (h) => {
    try {
      await r(h), u(!1);
    } catch (v) {
      P(v, "Form bağlanamadı.");
    }
  }, N = async (h) => {
    if (window.confirm(`“${h.title}” bağlantısı kaldırılsın mı? Form ve toplanmış yanıtlar silinmez.`))
      try {
        await l(h.id);
      } catch (v) {
        P(v, "Bağlantı kaldırılamadı.");
      }
  }, g = async (h, v) => {
    try {
      await o({ linkId: h.id, value: v });
    } catch (w) {
      P(w, "Ayar değiştirilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Formlar" }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => u((h) => !h),
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
      p == null ? void 0 : p.map((h) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          disabled: h.isLinked || n,
          onClick: () => d(h.documentId),
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
      be,
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
            onClick: () => y((v) => v === h.documentId ? null : h.documentId),
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
        h.responseCount > 0 && /* @__PURE__ */ e.jsx(Ma, { children: h.responseCount }),
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
            onClick: () => N(h),
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
            onChange: (v) => g(h, v.target.checked)
          }
        ),
        "Süreli paylaşım linkiyle ekip dışından da doldurulabilsin"
      ] }),
      m === h.documentId && /* @__PURE__ */ e.jsx(Or, { taskId: t, documentId: h.documentId })
    ] }, h.id))
  ] });
}
const Hr = {
  0: "bg-neutral-400",
  1: "bg-text-tertiary",
  2: "bg-warning",
  3: "bg-primary",
  4: "bg-success"
};
function yt(t) {
  if (!t) return null;
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? null : a;
}
const Ge = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
function Jr({ task: t = {} }) {
  const a = f.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((n, i) => ({
    id: n.id || `row-${i}`,
    name: n.title || "Başlıksız görev",
    isMain: !!n.__main,
    start: yt(n.startDate),
    end: yt(n.dueDate) || yt(n.completedDate),
    status: n.status ?? 1
  })), [t]), { min: s, span: r } = f.useMemo(() => {
    const o = a.flatMap((u) => [u.start, u.end]).filter(Boolean).map((u) => u.getTime());
    if (o.length === 0) return { min: null, span: 0 };
    const n = Math.min(...o), i = Math.max(...o);
    return { min: n, span: Math.max(1, i - n) };
  }, [a]), l = f.useMemo(() => s === null ? [] : [0, 1, 2, 3].map((o) => new Date(s + r * o / 4)), [s, r]);
  return s === null ? /* @__PURE__ */ e.jsx("div", { className: Se, children: /* @__PURE__ */ e.jsx(
    be,
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
      const n = o.start ? o.start.getTime() : s, i = o.end ? Math.max(o.end.getTime(), n) : n, u = (n - s) / r * 100, m = Math.max(2, (i - n) / r * 100), y = Math.max(1, Math.round((i - n) / 864e5));
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
            className: `absolute top-[7px] bottom-[7px] flex items-center px-2.5 rounded-[7px] shadow-xs ${Hr[o.status] || "bg-primary"}`,
            style: { left: `${u}%`, width: `${m}%` },
            title: `${Ge(o.start)} – ${Ge(o.end)}`,
            children: /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[10.5px] font-bold text-white", children: [
              y,
              "g"
            ] })
          }
        ) })
      ] }, o.id);
    }) })
  ] });
}
function St(t, a = {}) {
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
function aa({ icon: t, iconTone: a, title: s, note: r, children: l }) {
  return /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[12px] ${a}` }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: s }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
    ] }),
    l
  ] });
}
function Wr({ task: t = {}, readOnly: a = !1 }) {
  const s = ne(), r = t.predecessorIds || [], l = () => {
    var v, w, D;
    return (D = (w = (v = window == null ? void 0 : window.apya) == null ? void 0 : v.platform) == null ? void 0 : w.tasks) == null ? void 0 : D.task;
  }, { data: o = [] } = J({
    queryKey: ["task-dependency-candidates", t.projectId ?? null],
    queryFn: async () => {
      var w;
      const v = await Promise.resolve((w = l()) == null ? void 0 : w.getList({ projectId: t.projectId || void 0, maxResultCount: 1e3 }));
      return (v == null ? void 0 : v.items) ?? [];
    },
    enabled: !!t.id,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), { data: n = [], isLoading: i } = J({
    queryKey: ["task-dependency-edges", t.projectId ?? null],
    queryFn: async () => {
      var v;
      return await Promise.resolve((v = l()) == null ? void 0 : v.getProjectDependencies(t.projectId || void 0)) ?? [];
    },
    enabled: !!t.id,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), u = f.useMemo(() => new Map(o.map((v) => [v.id, v])), [o]), m = n.filter((v) => v.predecessorTaskId === t.id).map((v) => v.taskId), y = o.filter((v) => v.id !== t.id && !r.includes(v.id) && !m.includes(v.id)), [p, x] = f.useState(""), { data: c = [], isLoading: d } = J({
    queryKey: ["task-predecessors", t.id, r],
    queryFn: async () => {
      const v = l();
      return v ? Promise.all(
        r.map(
          (w) => Promise.resolve(v.get(w)).catch(() => ({ id: w, title: "(erişilemeyen görev)", status: null, code: "—" }))
        )
      ) : [];
    },
    enabled: r.length > 0,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), N = async (v) => {
    var w, D, I;
    try {
      await Promise.resolve(l().update(t.id, St(t, {
        predecessorIds: r.filter((B) => B !== v)
      }))), await s.invalidateQueries({ queryKey: ["task-detail", t.id] }), await s.invalidateQueries({ queryKey: ["task-dependency-edges"] }), (I = (D = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : D.info) == null || I.call(D, "Bağlantı kaldırıldı.");
    } catch (B) {
      P(B, "Bağlantı kaldırılamadı.");
    }
  }, g = async () => {
    var v, w, D;
    if (p)
      try {
        await Promise.resolve(l().update(t.id, St(t, {
          predecessorIds: [...r, p]
        }))), x(""), await s.invalidateQueries({ queryKey: ["task-detail", t.id] }), await s.invalidateQueries({ queryKey: ["task-dependency-edges"] }), (D = (w = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : w.success) == null || D.call(w, "Öncül eklendi.");
      } catch (I) {
        P(I, "Öncül eklenemedi.");
      }
  }, h = (v) => {
    var w, D, I;
    return (I = (D = (w = window == null ? void 0 : window.apya) == null ? void 0 : w.taskDetail) == null ? void 0 : D.open) == null ? void 0 : I.call(D, v);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsxs(
      aa,
      {
        icon: "fa-arrow-left-long",
        iconTone: "text-warning",
        title: "Öncül görevler",
        note: "bu görev başlamadan tamamlanmalı",
        children: [
          r.length === 0 ? /* @__PURE__ */ e.jsx(be, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : d ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : c.map((v) => {
            const w = v.status == null ? null : fe(v.status);
            return /* @__PURE__ */ e.jsxs(
              "div",
              {
                className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
                children: [
                  /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: v.code || "—" }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => h(v.id),
                      className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                      children: v.title || "Başlıksız görev"
                    }
                  ),
                  w && /* @__PURE__ */ e.jsx($e, { bg: w.bg, fg: w.fg, children: w.label }),
                  !a && /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      title: "Bağlantıyı kaldır",
                      "aria-label": `${v.title} bağlantısını kaldır`,
                      onClick: () => N(v.id),
                      className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link-slash text-[10px]" })
                    }
                  )
                ]
              },
              v.id
            );
          }),
          !a && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-4 py-3 border-t border-subtle", children: [
            /* @__PURE__ */ e.jsxs(
              "select",
              {
                "aria-label": "Öncül görev seç",
                value: p,
                onChange: (v) => x(v.target.value),
                className: "flex-1 min-w-0 h-8 px-2.5 rounded-[9px] border border-default bg-surface-base text-text-primary text-[12.5px]",
                children: [
                  /* @__PURE__ */ e.jsx("option", { value: "", children: y.length ? "Öncül görev seçin…" : "Eklenebilecek görev yok" }),
                  y.map((v) => /* @__PURE__ */ e.jsx("option", { value: v.id, children: (v.code ? v.code + " · " : "") + (v.title || "Başlıksız görev") }, v.id))
                ]
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: g,
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
      aa,
      {
        icon: "fa-arrow-right-long",
        iconTone: "text-primary",
        title: "Ardıl görevler",
        note: "bu görev bitince başlar",
        children: i ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : m.length === 0 ? /* @__PURE__ */ e.jsx(be, { icon: "fa-diagram-project", title: "Ardıl görev yok", description: "Bu görevi öncül olarak gösteren bir görev yok." }) : m.map((v) => {
          const w = u.get(v), D = w && w.status != null ? fe(w.status) : null;
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: (w == null ? void 0 : w.code) || "—" }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => h(v),
                    className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                    children: (w == null ? void 0 : w.title) || "(erişilemeyen görev)"
                  }
                ),
                D && /* @__PURE__ */ e.jsx($e, { bg: D.bg, fg: D.fg, children: D.label })
              ]
            },
            v
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
function Zr(t) {
  const a = ne(), s = ["task-timelogs", t], r = ["task-active-timelog"], l = J({
    queryKey: s,
    queryFn: () => {
      var m;
      return Promise.resolve((m = Ae()) == null ? void 0 : m.getTimeLogs(t));
    },
    enabled: !!t && !!Ae(),
    staleTime: 15e3,
    meta: { persist: !1 },
    retry: !1
  }), o = J({
    queryKey: r,
    /* Kayıt yokken uç 204 döner, proxy undefined çözer; TanStack v5 undefined'ı
       hata sayıp önceki çalışan kaydı ekranda bırakır (sayaç durmazdı). */
    queryFn: () => {
      var m;
      return Promise.resolve((m = Ae()) == null ? void 0 : m.getActiveTimeLog()).then((y) => y ?? null);
    },
    enabled: !!Ae(),
    staleTime: 5e3,
    /* Canlı sayaç kanbandan da başlatılıp durduruluyor; açılışlar arasında taşınmaz. */
    meta: { persist: !1 },
    retry: !1
  }), n = () => {
    a.invalidateQueries({ queryKey: s }), a.invalidateQueries({ queryKey: r });
  }, i = ae({
    mutationFn: () => {
      var m;
      return Promise.resolve((m = Ae()) == null ? void 0 : m.startTimeTracking(t));
    },
    onSuccess: n
  }), u = ae({
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
function sa(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function Xr({ taskId: t, task: a = {} }) {
  const s = Zr(t), r = s.activeLog && s.activeLog.taskId === t ? s.activeLog : null, [l, o] = f.useState(() => Date.now());
  f.useEffect(() => {
    if (!r) return;
    const d = setInterval(() => o(Date.now()), 1e3);
    return () => clearInterval(d);
  }, [r]);
  const n = r ? Math.max(0, Math.floor((l - new Date(r.startTime).getTime()) / 1e3)) : 0, u = s.logs.reduce((d, N) => d + (N.secondsSpent || 0), 0) + n, m = (a == null ? void 0 : a.estimatedHours) ?? null, y = m ? m * 3600 : 0, p = y ? Math.min(100, Math.round(u / y * 100)) : 0, x = y ? Math.max(0, y - u) : 0, c = async () => {
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
              children: Zs(u)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary", children: r ? "Kayıt sürüyor" : "Sayaç duraklatıldı" })
        ] })
      ] }),
      y > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] font-bold text-text-secondary", children: "Tahmin kullanımı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
            mt(u),
            " / ",
            m,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-warning", style: { width: `${p}%` } }) }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "Kalan tahmini süre: ",
          mt(x)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
      /* @__PURE__ */ e.jsx(Qe, { title: "Zaman kayıtları" }),
      s.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : s.logs.length === 0 ? /* @__PURE__ */ e.jsx(
        be,
        {
          icon: "fa-stopwatch",
          title: "Henüz zaman kaydı yok",
          description: "Soldaki yeşil düğmeyle sayacı çalıştırın; durdurduğunuzda kayıt buraya düşer."
        }
      ) : s.logs.map((d) => {
        const N = !d.endTime;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
            children: [
              /* @__PURE__ */ e.jsx(pt, { name: d.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: d.note || d.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                sa(d.startTime),
                " → ",
                N ? "sürüyor" : sa(d.endTime)
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary", children: N ? "Aktif" : mt(d.secondsSpent || 0) })
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
    component: Xs,
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
    component: ar,
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
    component: Br,
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
    component: Ir,
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
    component: Mr,
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
    component: rr,
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
    component: Jr,
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
    component: Wr,
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
    component: Sr,
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
    component: xr,
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
    component: cr,
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
    component: nr,
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
    component: or,
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
    component: Xr,
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
    component: Gr,
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
    component: Qr,
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
    component: $r,
    surfaces: ["task", "project", "tasks"]
  }
];
function _a(t = []) {
  const a = new Set(t);
  return We.filter((s) => !s.hidden).filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function Ua(t = []) {
  const a = new Set(t);
  return We.filter((s) => !s.hidden).filter((s) => !s.isCore).filter((s) => !s.permission || ce(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let tt = null;
const lt = /* @__PURE__ */ new Set(), gt = /* @__PURE__ */ new Set();
let at = !1;
function ra() {
  lt.forEach((t) => t());
}
function en(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const H = {
  open(t) {
    const a = en(t);
    a && (tt = a, ra());
  },
  close() {
    tt = null, ra();
  },
  subscribe(t) {
    return lt.add(t), () => lt.delete(t);
  },
  getSnapshot() {
    return tt;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && gt.add(t);
  },
  emitResult() {
    at = !1, gt.forEach((t) => t());
  },
  /** Adada bir yazma oldu ya da başladı — kapanışta liste/kanban tazelensin. */
  markChanged() {
    at = !0;
  },
  /** Yalnız yazma olduysa sonuç yayınlar: salt bakıp kapatmak sayfayı yeniden yüklemez.
      'this' kullanılmaz; metot referansla da geçirilebilir. */
  emitResultIfChanged() {
    at && H.emitResult();
  },
  /** Yalnız testler için. */
  reset() {
    tt = null, at = !1, lt.clear(), gt.clear();
  }
}, na = "apya.taskDetail.fullscreen";
function Va({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, l] = f.useState(t), [o, n] = f.useState([]), { data: i, isPending: u, isError: m, refetch: y } = It(r), p = Ca(), x = Fa(i), c = Aa(), d = za(r), [N, g] = f.useState("general"), [h, v] = f.useState(!1), w = _e.useRef(null), D = f.useMemo(
    () => _a(d.assignedCodes),
    [d.assignedCodes]
  ), I = f.useMemo(
    () => Ua(d.assignedCodes),
    [d.assignedCodes]
  ), B = D.find((z) => z.code === N) ?? D[0];
  _e.useEffect(() => {
    B.code !== N && g(B.code);
  }, [B, N]);
  const E = B == null ? void 0 : B.component, O = ne(), [Y, G] = f.useState(
    () => {
      var z;
      return ((z = window.localStorage) == null ? void 0 : z.getItem(na)) === "1";
    }
  ), [F, M] = f.useState(!1), [U, _] = f.useState(!1), V = f.useCallback(() => {
    At(), s == null || s();
  }, [s]);
  Ba(a === "page" ? null : t, V), _e.useEffect(() => {
    x.isDirty ? p.markDirty() : p.markClean();
  });
  const Z = f.useCallback(() => {
    F || (_(!1), p.requestClose(V));
  }, [p, V, F]), Q = f.useCallback(() => {
    G((z) => {
      var te;
      const K = !z;
      return (te = window.localStorage) == null || te.setItem(na, K ? "1" : "0"), K;
    });
  }, []), T = ce("Platform.Tasks.Delete"), [L, R] = f.useState(!1), [X, oe] = f.useState(!1), ie = f.useCallback(async () => {
    var z, K, te;
    oe(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (te = (K = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : K.info) == null || te.call(K, "Başarıyla silindi."), R(!1), p.markClean(), V();
    } catch (ge) {
      P(ge, "Görev silinemedi.");
    } finally {
      oe(!1);
    }
  }, [r, p, V]), ee = f.useCallback(async () => {
    var z, K, te;
    if (!x.validate()) return !1;
    M(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, x.toUpdateDto())
      ), await O.invalidateQueries({ queryKey: ["task-detail", r] }), H.emitResult(), (te = (K = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : K.success) == null || te.call(K, "Kaydedildi."), !0;
    } catch (ge) {
      return P(ge, "Kaydedilemedi."), !1;
    } finally {
      M(!1);
    }
  }, [r, x, p, O]), se = f.useCallback(() => {
    ee();
  }, [ee]), W = f.useCallback(async () => {
    if (_(!1), !x.validate()) {
      p.resolvePendingClose("stay"), g("general");
      return;
    }
    await ee() ? p.resolvePendingClose("saved") : _(!0);
  }, [p, x, ee]), de = f.useCallback((z, K) => {
    p.requestClose(() => {
      n((te) => [...te, { id: r, title: (i == null ? void 0 : i.title) ?? "" }]), l(z), g("general"), p.markClean();
    });
  }, [p, r, i]), b = f.useCallback((z) => {
    p.requestClose(() => {
      n((K) => {
        const te = K.findIndex((ge) => ge.id === z);
        return te === -1 ? K : K.slice(0, te);
      }), l(z), g("general"), p.markClean();
    });
  }, [p]), j = f.useCallback(async (z) => {
    try {
      await d.addFeature(z), g(z), v(!1);
    } catch (K) {
      P(K, "Özellik eklenemedi.");
    }
  }, [d]), S = f.useCallback(async (z) => {
    try {
      await d.removeFeature(z), g((K) => K === z ? "general" : K);
    } catch (K) {
      P(K, "Özellik kaldırılamadı.");
    }
  }, [d]);
  _e.useEffect(() => {
    if (!h) return;
    const z = (te) => {
      w.current && !w.current.contains(te.target) && v(!1);
    }, K = (te) => {
      te.key === "Escape" && v(!1);
    };
    return document.addEventListener("mousedown", z), document.addEventListener("keydown", K), () => {
      document.removeEventListener("mousedown", z), document.removeEventListener("keydown", K);
    };
  }, [h]);
  const C = u ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(we, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(we, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(we, { className: "h-24 w-full" })
  ] }) : m && !i ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(re, { variant: "ghost", onClick: () => y(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      Vs,
      {
        trail: o,
        current: { id: r, title: (i == null ? void 0 : i.title) ?? "" },
        onNavigate: b
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: w, children: [
      /* @__PURE__ */ e.jsx(
        Ys,
        {
          tabs: D,
          activeCode: B.code,
          onSelect: (z) => {
            g(z), v(!1);
          },
          onOpenPicker: () => v((z) => !z),
          pickerOpen: h
        }
      ),
      h && /* @__PURE__ */ e.jsx(
        Us,
        {
          entries: I,
          busyCode: d.isMutating ? d.mutatingCode : null,
          onAdd: j,
          onRemove: S
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
            Ks,
            {
              values: x.values,
              errors: x.errors,
              onFieldChange: x.setField,
              assigneeOptions: c.options,
              isLoadingAssignees: c.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(f.Suspense, { fallback: /* @__PURE__ */ e.jsx(we, { className: "h-24 w-full" }), children: E && /* @__PURE__ */ e.jsx(
            E,
            {
              taskId: r,
              task: i,
              form: x,
              onOpenSubtask: de
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            Rs,
            {
              task: i,
              creatorName: c.nameById.get(i.creatorId),
              lastModifierName: c.nameById.get(i.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), q = a === "page" ? Bs : Es;
  return /* @__PURE__ */ e.jsxs(
    q,
    {
      open: !0,
      fullscreen: Y,
      onRequestClose: Z,
      title: i ? `Görev Detayı: ${i.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        Fs,
        {
          task: i ?? { title: "Yükleniyor…" },
          canDelete: T,
          fullscreen: Y,
          onToggleFullscreen: Q,
          onClose: Z,
          onDelete: () => R(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        zs,
        {
          lastSavedAt: i == null ? void 0 : i.lastModificationTime,
          isDirty: p.isDirty,
          isSaving: F,
          onCancel: Z,
          onSave: se
        }
      ),
      children: [
        C,
        /* @__PURE__ */ e.jsx(
          Et,
          {
            open: p.pendingClose,
            isSaving: F,
            errorText: U ? xe("Common:Unsaved:SaveFailed", "Kaydedilemedi. Düzenlemeye dönebilir ya da değişiklikleri atabilirsiniz.") : void 0,
            onStay: () => {
              _(!1), p.resolvePendingClose("stay");
            },
            onDiscard: () => {
              _(!1), x.reset(), p.resolvePendingClose("discard");
            },
            onSave: W
          }
        ),
        L && /* @__PURE__ */ e.jsx(
          tn,
          {
            taskTitle: (i == null ? void 0 : i.title) ?? "",
            busy: X,
            onCancel: () => R(!1),
            onConfirm: ie
          }
        )
      ]
    }
  );
}
function tn({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [l, o] = f.useState(""), n = l.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    an,
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
function an({ label: t, title: a, description: s, children: r, actions: l }) {
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
const sn = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function rn({ isPrivate: t = !1, onChange: a = () => {
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
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: sn.map((n) => {
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
          /* @__PURE__ */ e.jsx(ks, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const ia = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto", nn = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", ln = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" }
];
function on({ children: t }) {
  return /* @__PURE__ */ e.jsx(Bt, { asChild: !0, children: t });
}
function cn({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "inline-flex items-center h-[19px] px-1.5 rounded-[5px] border border-default border-b-2 bg-neutral-subtle font-mono text-[10px] font-semibold text-text-secondary", children: t });
}
function dn({
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
  titleError: y,
  isPrivateValue: p,
  isFavorite: x,
  onToggleFavorite: c,
  isWatched: d,
  onToggleWatch: N,
  onDuplicate: g,
  onArchive: h,
  onCancelTask: v,
  onDelete: w,
  onOpenTransfer: D,
  onExportPdf: I,
  /* Yetki (root hesaplar; sunucudaki EnsureCanMutateTaskAsync ile aynı kural). Eskiden
     menü ve alanlar herkese açıktı, yetkisiz kullanıcı tıklayınca 403 alıyordu. */
  canEdit: B = !0,
  canChangeStatus: E = !0,
  canDelete: O = !0
}) {
  const [Y, G] = f.useState(!1), [F, M] = f.useState(null), [U, _] = f.useState(!1), V = f.useRef(null), Z = f.useId(), Q = Ee(F), T = n ?? t.status, L = Sa(i), R = $a(
    L,
    T,
    u === void 0 ? t.boardColumnId : u
  ), X = { ...fe(T), ...R ? { label: R.label } : {} }, oe = (b) => {
    o("status", b.status), o("boardColumnId", b.boardColumnId);
  }, ie = t.code || "GRV-—", ee = () => {
    var b;
    (b = navigator.clipboard) == null || b.writeText(ie), G(!0), setTimeout(() => G(!1), 1800);
  }, se = () => {
    var b, j, S, C;
    (b = navigator.clipboard) == null || b.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), (C = (S = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : S.success) == null || C.call(S, "Görev bağlantısı panoya kopyalandı.");
  }, W = (b) => () => {
    _(!1), b == null || b();
  }, de = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", onClick: W(se) },
    { label: "Çoğalt", icon: "fa-copy", allowed: B, onClick: W(g) },
    { label: "Başka projeye kopyala", icon: "fa-clone", allowed: B, onClick: W(() => D == null ? void 0 : D("copy")) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, allowed: B, onClick: W(() => D == null ? void 0 : D("move")) },
    { label: d ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: W(N) },
    { label: "Arşivle", icon: "fa-box-archive", separator: !0, allowed: E, onClick: W(h) },
    { label: "Görevi iptal et", icon: "fa-ban", allowed: E && t.status !== 0, onClick: W(v) },
    { label: "Yazdır", icon: "fa-print", kbd: "Ctrl P", onClick: W(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: W(I) },
    { label: "Sil", icon: "fa-trash-can", separator: !0, danger: !0, allowed: O, onClick: W(w) }
  ].filter((b) => b.allowed !== !1);
  return /* @__PURE__ */ e.jsxs("header", { ref: M, className: "shrink-0 px-6 lt-860:px-4 pt-[18px] pb-4 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: ee,
            title: "Kodu kopyala",
            className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[11px] font-bold tracking-[.04em] cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[9px] opacity-70" }),
              /* @__PURE__ */ e.jsx("span", { children: ie }),
              /* @__PURE__ */ e.jsx("i", { className: `${Y ? "fa-solid fa-check" : "fa-regular fa-copy"} text-[9px] opacity-60` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              disabled: !B,
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] border border-default text-[12px] font-semibold ${B ? "cursor-pointer" : "cursor-default"} ${X.bg} ${X.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-current animate-pulse" }),
                /* @__PURE__ */ e.jsx("span", { children: X.label }),
                B && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: Q, children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${ia} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            L.map((b) => {
              const j = (R == null ? void 0 : R.key) === b.key;
              return /* @__PURE__ */ e.jsx(on, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => oe(b),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${j ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${b.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: b.label }),
                    j && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, b.key);
            })
          ] }) })
        ] }),
        d && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 h-[26px] px-2.5 rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11.5px] font-semibold", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-eye text-[10px]" }),
          "Takip ediliyor"
        ] }),
        !B && /* @__PURE__ */ e.jsxs(
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
          rn,
          {
            isPrivate: p ?? !!t.isPrivate,
            onChange: (b) => o("isPrivate", b),
            disabled: !B
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
        /* @__PURE__ */ e.jsxs(ke, { modal: !0, open: U, onOpenChange: _, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer seçenekler",
              className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${U ? "bg-surface-hover text-text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: Q, children: /* @__PURE__ */ e.jsxs(
            Te,
            {
              sideOffset: 6,
              align: "end",
              collisionBoundary: Q ?? [],
              collisionPadding: 12,
              className: `${ia} w-[244px]`,
              children: [
                de.map((b) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: b.onClick,
                    className: [
                      nn,
                      b.danger ? "text-negative" : "text-text-secondary",
                      b.separator ? "border-t border-subtle mt-[5px]" : ""
                    ].join(" "),
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${b.icon} text-[11px] w-[14px] opacity-75` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: b.label }),
                      b.kbd && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: b.kbd })
                    ]
                  },
                  b.label
                )),
                /* @__PURE__ */ e.jsxs("div", { className: "mt-1.5 pt-[9px] px-[9px] pb-[7px] border-t border-subtle", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 mb-[7px]", children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-keyboard text-[11px] text-text-tertiary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-[.09em] text-text-tertiary", children: "Kısayollar" })
                  ] }),
                  ln.map((b) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: b.what }),
                    /* @__PURE__ */ e.jsx(cn, { children: b.key })
                  ] }, b.what))
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
          ref: V,
          role: "textbox",
          "aria-label": xe("Tasks:Detail:TitleLabel", "Görev başlığı"),
          "aria-readonly": !B || void 0,
          "aria-invalid": !!y || void 0,
          "aria-describedby": y ? Z : void 0,
          contentEditable: B,
          suppressContentEditableWarning: !0,
          spellCheck: !1,
          onInput: B ? (b) => o("title", b.currentTarget.textContent.trim()) : void 0,
          onBlur: B ? (b) => o("title", b.currentTarget.textContent.trim()) : void 0,
          className: `flex-1 min-w-0 text-[24px] lt-560:text-[20px] font-extrabold tracking-[-.025em] leading-[1.2] text-text-primary px-2 -ml-2 py-[3px] rounded-[9px] border ${y ? "border-negative" : "border-transparent"} ${B ? `cursor-text hover:bg-neutral-subtle focus:bg-neutral-subtle focus:shadow-focus focus:outline-none ${y ? "" : "hover:border-subtle focus:border-focus"}` : ""}`,
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
    y && /* @__PURE__ */ e.jsx("p", { id: Z, role: "alert", className: "mt-1 mb-0 text-[12px] font-semibold text-negative", children: y })
  ] });
}
const st = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", la = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function je({ children: t }) {
  return /* @__PURE__ */ e.jsx(Bt, { asChild: !0, children: t });
}
function he({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[7px] min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.08em] text-text-tertiary select-none", children: t }),
    a
  ] });
}
function oa({ name: t, size: a = 26 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Je(t), fontSize: a * 0.38 },
      children: He(t)
    }
  );
}
function ca(t) {
  if (t == null) return "—";
  const a = Math.max(0, Math.round(Number(t) * 60)), s = Math.floor(a / 60), r = a % 60;
  return s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function xn({
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
  dueDateValue: y,
  startDateValue: p,
  tagsValue: x = [],
  progressPercent: c = 0,
  progressNote: d = "",
  onOpenTransfer: N,
  /* Düzenleme yetkisi yoksa ızgara salt okunur: tüm alanlar forma, oradan UpdateAsync'e
     gider; yetkisiz kullanıcı değiştirip Kaydet'te 403 alıyordu. */
  readOnly: g = !1,
  /* Doğrulama hataları (useTaskForm.errors): ilgili hücrenin altında gösterilir. */
  startDateError: h,
  dueDateError: v
}) {
  var j, S;
  const w = f.useId(), D = f.useId(), [I, B] = f.useState(""), [E, O] = f.useState(""), [Y, G] = f.useState(""), [F, M] = f.useState(!1), [U, _] = f.useState(null), V = l ?? t.status, Z = Sa(o), Q = $a(
    Z,
    V,
    n === void 0 ? t.boardColumnId : n
  ), T = { ...fe(V), ...Q ? { label: Q.label } : {} }, L = (C) => {
    r("status", C.status), r("boardColumnId", C.boardColumnId);
  }, R = ut(i ?? t.priority), X = u ?? t.assigneeId ?? null, oe = m ?? t.projectId ?? null, ie = ((j = a.find((C) => C.value === X)) == null ? void 0 : j.label) || t.assigneeName || "Atanmamış", ee = ((S = s.find((C) => C.value === oe)) == null ? void 0 : S.label) || t.projectName || "Projesiz", se = Da(y ?? t.dueDate), W = a.filter(
    (C) => !I || C.label.toLowerCase().includes(I.toLowerCase())
  ), de = s.filter(
    (C) => !E || C.label.toLowerCase().includes(E.toLowerCase())
  ), b = () => {
    const C = Y.trim();
    C && !x.includes(C) && r("tagNames", [...x, C]), G(""), M(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { ref: _, className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsx(
    "fieldset",
    {
      disabled: g,
      className: "m-0 p-0 border-0 min-w-0 [&:disabled_label]:pointer-events-none [&_:disabled]:pointer-events-none [&:disabled_.fa-chevron-down]:hidden",
      children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6", children: [
        /* @__PURE__ */ e.jsx(he, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx(oa, { name: X ? ie : null }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: ie }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: Ee(U), children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${st} w-[264px]`, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: I,
                  onChange: (C) => B(C.target.value),
                  placeholder: "Kişi ara…",
                  className: la
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[230px] overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("assigneeId", null),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] text-left cursor-pointer ${X ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary font-semibold"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "flex h-6 w-6 items-center justify-center rounded-full bg-neutral-subtle text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-user-slash text-[9px]" }) }),
                    /* @__PURE__ */ e.jsx("span", { children: "Atanmamış" })
                  ]
                }
              ) }),
              a.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-2 py-1.5 text-[12px] text-text-tertiary", children: "Kullanıcı listesi yükleniyor…" }),
              W.map((C) => /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("assigneeId", C.value),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${X === C.value ? "bg-primary-subtle" : "hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx(oa, { name: C.label, size: 24 }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: C.label }),
                    X === C.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
                  ]
                }
              ) }, C.value))
            ] })
          ] }) })
        ] }) }),
        /* @__PURE__ */ e.jsxs(he, { label: "Son tarih", children: [
          /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-regular fa-calendar text-[13px] ${se.tone}` }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "date",
                value: (y ?? t.dueDate ?? "").slice(0, 10),
                onChange: (C) => r("dueDate", C.target.value),
                "aria-label": "Son tarih",
                "aria-invalid": !!v || void 0,
                "aria-describedby": v ? w : void 0,
                className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
              }
            )
          ] }),
          v ? /* @__PURE__ */ e.jsx("span", { id: w, role: "alert", className: "-mt-0.5 text-[10.5px] font-semibold text-negative", children: v }) : se.hint && /* @__PURE__ */ e.jsx("span", { className: `-mt-0.5 text-[10.5px] font-semibold ${se.tone}`, children: se.hint })
        ] }),
        /* @__PURE__ */ e.jsxs(he, { label: "Başlangıç", children: [
          /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[13px] text-text-tertiary" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "date",
                value: (p ?? t.startDate ?? "").slice(0, 10),
                onChange: (C) => r("startDate", C.target.value),
                "aria-label": "Başlangıç",
                "aria-invalid": !!h || void 0,
                "aria-describedby": h ? D : void 0,
                className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
              }
            )
          ] }),
          h && /* @__PURE__ */ e.jsx("span", { id: D, role: "alert", className: "-mt-0.5 text-[10.5px] font-semibold text-negative", children: h })
        ] }),
        /* @__PURE__ */ e.jsx(he, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 pt-[5px]", children: [
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
        /* @__PURE__ */ e.jsx(he, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${T.bg} ${T.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${T.icon} text-[11px]` }),
                /* @__PURE__ */ e.jsx("span", { children: T.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: Ee(U), children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${st} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            Z.map((C) => {
              const q = (Q == null ? void 0 : Q.key) === C.key;
              return /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => L(C),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${q ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${C.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: C.label }),
                    q && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, C.key);
            })
          ] }) })
        ] }) }) }),
        /* @__PURE__ */ e.jsx(he, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${R.bg} ${R.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${R.icon} text-[11px]` }),
                /* @__PURE__ */ e.jsx("span", { children: R.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: Ee(U), children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${st} w-[184px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
            js.map((C) => {
              const q = Ns[C], z = (i ?? t.priority) === C;
              return /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("priority", C),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${z ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${q.icon} text-[11px] w-[13px]` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: q.label }),
                    z && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, C);
            })
          ] }) })
        ] }) }) }),
        /* @__PURE__ */ e.jsx(he, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap min-h-8", children: [
          x.map((C) => /* @__PURE__ */ e.jsxs(
            "span",
            {
              className: "inline-flex items-center gap-1.5 h-6 px-2 rounded-[7px] border border-primary bg-primary-subtle text-primary text-[11.5px] font-bold",
              children: [
                /* @__PURE__ */ e.jsx("span", { children: C }),
                !g && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Etiketi kaldır",
                    onClick: () => r("tagNames", x.filter((q) => q !== C)),
                    className: "flex items-center p-0 border-0 bg-transparent text-current opacity-55 hover:opacity-100 hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
                  }
                )
              ]
            },
            C
          )),
          g ? x.length === 0 && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "—" }) : F ? /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: Y,
              onChange: (C) => G(C.target.value),
              onBlur: b,
              onKeyDown: (C) => {
                C.key === "Enter" && b(), C.key === "Escape" && (G(""), M(!1));
              },
              placeholder: "Etiket…",
              className: "h-6 w-24 px-2 rounded-[7px] border border-focus bg-surface-base text-text-primary text-[11.5px] shadow-focus focus:outline-none"
            }
          ) : /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              "aria-label": "Yeni etiket ekle",
              onClick: () => M(!0),
              className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-dashed border-strong bg-transparent text-text-tertiary text-[11.5px] font-semibold hover:border-focus hover:text-primary hover:bg-primary-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[9px]" }),
                "Etiket"
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ e.jsx(he, { label: "Proje", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-[13px] text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: ee }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: Ee(U), children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${st} w-[250px]`, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: E,
                  onChange: (C) => O(C.target.value),
                  placeholder: "Proje ara…",
                  className: la
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[210px] overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("projectId", null),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${oe ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-neutral-400" }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Projesiz" })
                  ]
                }
              ) }),
              de.map((C) => /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("projectId", C.value),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${oe === C.value ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-primary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: C.label }),
                    oe === C.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
                  ]
                }
              ) }, C.value))
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-[7px] pt-[7px] border-t border-subtle", children: [
              /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => N == null ? void 0 : N("move"),
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
                  onClick: () => N == null ? void 0 : N("copy"),
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
        /* @__PURE__ */ e.jsx(he, { label: "Harcanan / tahmin", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[9px] h-8", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock text-[13px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[13px] font-bold text-text-primary", children: ca(t.spentHours ?? 0) }),
          /* @__PURE__ */ e.jsxs("span", { className: "text-[12px] text-text-tertiary", children: [
            "/ ",
            t.estimatedHours != null ? ca(t.estimatedHours) : "—"
          ] })
        ] }) })
      ] })
    }
  ) });
}
const un = "z-popover w-[225px] rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto";
function Mt({ entries: t = [], onPick: a, children: s }) {
  const [r, l] = f.useState(null), o = Ee(r);
  return /* @__PURE__ */ e.jsx("span", { ref: l, className: "contents", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: s }),
    /* @__PURE__ */ e.jsx(De, { container: o, children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", collisionPadding: 12, className: un, children: [
      /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Özellik ekle" }),
      t.map((n) => /* @__PURE__ */ e.jsx(Bt, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
function pn({
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
  counts: y = {},
  isDirty: p = !1
}) {
  const [x, c] = f.useState(!1);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-6 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 py-2.5 flex-1 min-w-0 overflow-x-auto custom-scrollbar", children: [
      s.map((d) => {
        const N = t === d.code, g = y[d.code] || 0;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            draggable: !0,
            title: "Sürükleyerek sırayı değiştirin",
            ...Pa(() => a(d.code)),
            onDragStart: (h) => {
              l(d.code);
              try {
                h.dataTransfer.effectAllowed = "move", h.dataTransfer.setData("text/plain", d.code);
              } catch {
              }
            },
            onDragOver: (h) => {
              h.preventDefault(), n(d.code);
            },
            onDrop: (h) => {
              h.preventDefault(), i == null || i();
            },
            onDragEnd: o,
            className: [
              "flex shrink-0 items-center gap-2 h-[34px] px-[13px] rounded-[10px]",
              "text-[12.5px] whitespace-nowrap cursor-grab active:cursor-grabbing",
              "transition-opacity duration-fast",
              N ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
              r === d.code ? "opacity-35" : "opacity-100"
            ].join(" "),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.icon} text-[11px] opacity-85` }),
              /* @__PURE__ */ e.jsx("span", { children: d.title }),
              g > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                "rounded-full text-[10px] font-extrabold",
                N ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
              ].join(" "), children: g })
            ]
          },
          d.code
        );
      }),
      /* @__PURE__ */ e.jsx(Mt, { entries: u, onPick: m, children: /* @__PURE__ */ e.jsxs(
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
function mn({
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
  counts: y = {}
}) {
  return /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Görev özellikleri",
      className: "flex lt-860:hidden flex-col gap-[3px] w-[238px] shrink-0 py-4 px-3 border-r border-subtle bg-surface-base overflow-y-auto custom-scrollbar",
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "px-2.5 pt-1 pb-2 text-[10px] font-extrabold uppercase tracking-[.1em] text-text-tertiary", children: "Özellikler" }),
        s.map((p) => {
          const x = t === p.code, c = y[p.code] || 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              draggable: !0,
              title: "Sürükleyerek sırayı değiştirin",
              ...Pa(() => a(p.code)),
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
        /* @__PURE__ */ e.jsx(Mt, { entries: u, onPick: m, children: /* @__PURE__ */ e.jsxs(
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
const da = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "—";
function fn({ task: t = {}, nameById: a }) {
  const s = (o, n) => {
    var i;
    return o || n && ((i = a == null ? void 0 : a.get) == null ? void 0 : i.call(a, n)) || null;
  }, r = s(t.creatorName, t.creatorId), l = t.lastModificationTime ? s(t.lastModifierName, t.lastModifierId) : null;
  return /* @__PURE__ */ e.jsx("aside", { className: "flex flex-col gap-3.5 min-w-0", children: /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsx(ze, { label: "Oluşturan", value: r || "Bilinmiyor", avatarName: r }),
    /* @__PURE__ */ e.jsx(ze, { label: "Oluşturma tarihi", value: da(t.creationTime) }),
    /* @__PURE__ */ e.jsx(ze, { label: "Güncelleyen", value: l || "—", avatarName: l }),
    /* @__PURE__ */ e.jsx(ze, { label: "Son güncelleme", value: da(t.lastModificationTime) }),
    /* @__PURE__ */ e.jsx(ze, { label: "Görev tipi", value: t.taskType }),
    /* @__PURE__ */ e.jsx(ze, { label: "Sprint", value: t.sprint })
  ] }) });
}
const xa = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
function vt({ name: t, size: a = 32 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Je(t), fontSize: a * 0.34 },
      children: He(t)
    }
  );
}
function ua({ open: t, onClick: a, label: s }) {
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
const rt = (t) => [t == null ? void 0 : t.name, t == null ? void 0 : t.surname].filter(Boolean).join(" ") || (t == null ? void 0 : t.userName) || "", pa = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function bn({
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
  const n = t == null ? void 0 : t.id, i = ne(), [u, m] = f.useState(!0), [y, p] = f.useState(""), x = (r == null ? void 0 : r.items) ?? [], c = x.filter((b) => b.isDone).length, d = x.length ? Math.round(c / x.length * 100) : 0, N = async () => {
    const b = y.trim();
    if (!(!b || !n)) {
      p("");
      try {
        await r.addItem(b);
      } catch (j) {
        p((S) => S || b), P(j, "Madde eklenemedi.");
      }
    }
  }, [g, h] = f.useState(!0), [v, w] = f.useState(""), [D, I] = f.useState(!1), [B, E] = f.useState(!1), [O, Y] = f.useState(null), [G, F] = f.useState(""), [M, U] = f.useState([]), [_, V] = f.useState(!1), [Z, Q] = f.useState(""), { data: T, isFetched: L } = J({
    queryKey: ["task-users-lookup"],
    queryFn: () => {
      var b, j, S, C;
      return Promise.resolve((C = (S = (j = (b = window == null ? void 0 : window.apya) == null ? void 0 : b.platform) == null ? void 0 : j.tasks) == null ? void 0 : S.task) == null ? void 0 : C.getUsersLookup()).then((q) => (q == null ? void 0 : q.items) ?? []);
    },
    enabled: _,
    staleTime: 6e4,
    meta: { persist: !1 }
  }), R = Z.trim().toLocaleLowerCase("tr-TR"), X = (T ?? []).filter((b) => !R || `${rt(b)} ${b.userName ?? ""}`.toLocaleLowerCase("tr-TR").includes(R)), oe = (b) => {
    const j = rt(b);
    w((S) => `${S && !/\s$/.test(S) ? `${S} ` : S}@${j} `), U((S) => S.some((C) => C.id === b.id) ? S : [...S, { id: b.id, label: j }]), V(!1), Q("");
  }, { data: ie = [] } = J({
    queryKey: ["task-comments", n],
    queryFn: () => {
      var b, j, S, C;
      return Promise.resolve((C = (S = (j = (b = window == null ? void 0 : window.apya) == null ? void 0 : b.platform) == null ? void 0 : j.tasks) == null ? void 0 : S.task) == null ? void 0 : C.getComments(n));
    },
    enabled: !!n,
    staleTime: 1e4,
    meta: { persist: !1 }
  }), ee = async () => {
    await i.invalidateQueries({ queryKey: ["task-comments", n] }), await i.invalidateQueries({ queryKey: ["task-detail", n] });
  }, se = async () => {
    const b = v.trim();
    if (!(!b || !n || B)) {
      E(!0);
      try {
        const j = M.filter((S) => b.includes(`@${S.label}`)).map((S) => S.id);
        await Promise.resolve(window.apya.platform.tasks.task.addComment(n, b, j)), await ee(), w(""), U([]);
      } catch (j) {
        P(j, "Yorum gönderilemedi.");
      } finally {
        E(!1);
      }
    }
  }, W = async (b) => {
    const j = G.trim();
    if (!(!j || !n))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.replyToComment(b, j)), await ee(), F(""), Y(null);
      } catch (S) {
        P(S, "Yanıt gönderilemedi.");
      }
  }, de = !!v.trim() && !B;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-[9px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Açıklama" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Zengin metin · WYSIWYG" })
      ] }),
      /* @__PURE__ */ e.jsx(
        Ta,
        {
          value: s ?? t.description ?? "",
          onChange: (b) => a("description", b),
          readOnly: o
        },
        n
      )
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: xa, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
            c,
            "/",
            x.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(ua, { label: "Kontrol listesi", open: u, onClick: () => m((b) => !b) })
      ] }),
      u && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 mt-3.5", children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
            style: { width: `${d}%` }
          }
        ) }),
        x.map((b) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              disabled: o,
              "aria-label": b.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
              onClick: () => r.toggleItem(b.id).catch((j) => P(j, "Durum güncellenemedi.")),
              className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${o ? "cursor-default" : "cursor-pointer"} transition-colors duration-fast ${b.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
              children: b.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${b.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: b.text }),
          !o && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              onClick: () => r.removeItem(b.id).catch((j) => P(j, "Madde silinemedi.")),
              className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
            }
          )
        ] }, b.id)),
        !o && /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            value: y,
            onChange: (b) => p(b.target.value),
            onKeyDown: (b) => {
              b.key === "Enter" && N();
            },
            placeholder: "Yeni madde yaz ve Enter'a bas…",
            className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: xa, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Yorumlar & güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: ie.length })
        ] }),
        /* @__PURE__ */ e.jsx(ua, { label: "Yorumlar", open: g, onClick: () => h((b) => !b) })
      ] }),
      g && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(vt, { name: l }),
          /* @__PURE__ */ e.jsxs("div", { className: `flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${D ? "border-focus bg-surface-base shadow-focus" : "border-default bg-surface-raised"}`, children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                rows: 2,
                value: v,
                onChange: (b) => w(b.target.value),
                onFocus: () => I(!0),
                onBlur: () => I(!1),
                onKeyDown: (b) => {
                  b.key === "Enter" && (b.ctrlKey || b.metaKey) && (b.preventDefault(), se());
                },
                placeholder: "Bir yorum yazın… (Ctrl+Enter ile gönder)",
                className: "w-full p-3 border-0 bg-transparent text-text-primary text-[13px] leading-[1.6] resize-none focus:outline-none"
              }
            ),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-2.5 py-[7px] border-t border-subtle bg-surface-base", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-0.5", children: [
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Kişi bahset",
                    "aria-label": "Kişi bahset",
                    "aria-haspopup": "dialog",
                    "aria-expanded": _,
                    onMouseDown: (b) => b.preventDefault(),
                    onClick: () => V((b) => !b),
                    className: `flex items-center justify-center h-7 w-7 rounded-[7px] hover:bg-surface-hover hover:text-primary cursor-pointer ${_ ? "text-primary" : "text-text-tertiary"}`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-at text-[12px]" })
                  }
                ),
                [
                  { icon: "fa-regular fa-face-smile", title: "👍 ekle", add: " 👍 " }
                ].map((b) => /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: b.title,
                    onMouseDown: (j) => j.preventDefault(),
                    onClick: () => w((j) => j + b.add),
                    className: "flex items-center justify-center h-7 w-7 rounded-[7px] text-text-tertiary hover:bg-surface-hover hover:text-primary cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: `${b.icon} text-[12px]` })
                  },
                  b.title
                ))
              ] }),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: se,
                  disabled: !de,
                  className: `flex items-center gap-[7px] h-[30px] px-3.5 rounded-[9px] text-[12px] font-bold shadow-xs ${de ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${B ? "fa-circle-notch fa-spin" : "fa-paper-plane"} text-[10px]` }),
                    "Gönder"
                  ]
                }
              )
            ] })
          ] }),
          _ && /* @__PURE__ */ e.jsxs(
            "div",
            {
              role: "dialog",
              "aria-label": "Bahsedilecek kişi",
              onBlur: (b) => {
                b.currentTarget.contains(b.relatedTarget) || V(!1);
              },
              className: "absolute left-[43px] top-full z-20 mt-1 w-64 min-w-[200px] max-w-[calc(100%-43px)] rounded-[11px] border border-default bg-surface-base p-1.5 shadow-lg",
              children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: Z,
                    onChange: (b) => Q(b.target.value),
                    onKeyDown: (b) => {
                      b.key === "Escape" && (b.preventDefault(), V(!1)), b.key === "Enter" && X[0] && (b.preventDefault(), oe(X[0]));
                    },
                    placeholder: "Kişi ara…",
                    "aria-label": "Kişi ara",
                    className: "mb-1 h-8 w-full rounded-[8px] border border-default bg-surface-raised px-2.5 text-[12px] text-text-primary focus:border-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsxs("ul", { className: "m-0 max-h-56 list-none overflow-y-auto p-0", children: [
                  X.map((b) => /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => oe(b),
                      className: "w-full rounded-[7px] px-2.5 py-1.5 text-left text-[12.5px] text-text-primary hover:bg-surface-hover cursor-pointer",
                      children: [
                        rt(b),
                        b.userName && rt(b) !== b.userName && /* @__PURE__ */ e.jsxs("span", { className: "ml-1 text-[11px] text-text-tertiary", children: [
                          "(",
                          b.userName,
                          ")"
                        ] })
                      ]
                    }
                  ) }, b.id)),
                  !X.length && /* @__PURE__ */ e.jsx("li", { className: "px-2.5 py-2 text-[12px] text-text-tertiary", children: L ? "Eşleşen kişi yok" : "Yükleniyor…" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1", children: ie.map((b) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start py-3 border-t border-subtle", children: [
          /* @__PURE__ */ e.jsx(vt, { name: b.authorName }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: b.authorName }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: pa(b.creationTime) })
            ] }),
            /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[13px] leading-[1.65] text-text-secondary whitespace-pre-wrap", children: b.text }),
            /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1.5 mt-[3px]", children: /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  Y((j) => j === b.id ? null : b.id), F("");
                },
                className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-full text-text-tertiary text-[11px] font-semibold hover:bg-surface-hover hover:text-primary cursor-pointer",
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                  "Yanıtla"
                ]
              }
            ) }),
            O === b.id && /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 mt-2 animate-fade-in-fast", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: G,
                  onChange: (j) => F(j.target.value),
                  onKeyDown: (j) => {
                    j.key === "Enter" && W(b.id);
                  },
                  placeholder: `@${b.authorName} kullanıcısına yanıt ver…`,
                  className: "flex-1 h-8 px-3 rounded-[9px] border border-focus bg-surface-base text-text-primary text-[12px] shadow-focus focus:outline-none"
                }
              ),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => W(b.id),
                  className: "h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover",
                  children: "Yanıtla"
                }
              )
            ] }),
            (b.replies ?? []).map((j) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] mt-2.5 pl-3 border-l-2 border-default", children: [
              /* @__PURE__ */ e.jsx(vt, { name: j.authorName, size: 24 }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: j.authorName }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: pa(j.creationTime) })
                ] }),
                /* @__PURE__ */ e.jsx("p", { className: "mt-[3px] mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: j.text })
              ] })
            ] }, j.id))
          ] })
        ] }, b.id)) })
      ] })
    ] })
  ] });
}
function hn({
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
  }).format(new Date(t)) : "—", u = s ? "fa-solid fa-circle-notch fa-spin" : r ? "fa-solid fa-check" : "fa-regular fa-floppy-disk", m = s ? "Kaydediliyor…" : r ? "Kaydedildi" : "Kaydet", y = a && !s;
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
          disabled: !y,
          className: `flex items-center gap-2 h-9 px-[22px] rounded-[10px] text-white text-[13px] font-bold shadow-sm ${y ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `${u} text-[11px]` }),
            m
          ]
        }
      )
    ] })
  ] });
}
const yn = Object.fromEntries(We.map((t) => [t.code, t])), gn = {
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
}, vn = /* @__PURE__ */ new Set([
  "risks",
  "dashboard",
  "comments",
  "emails",
  "custom-fields",
  "approvals",
  "ai",
  "automations"
]), jn = (t) => vn.has(t);
function Nn(t) {
  const a = yn[t], s = gn[t];
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
function ma({ code: t, onRemoveFeature: a, pickerEntries: s = [], onPickFeature: r, canRemove: l = !0 }) {
  const o = Nn(t) ?? { title: t, desc: "", icon: "fa-cube", bg: "bg-neutral-subtle", fg: "text-text-secondary" };
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
      /* @__PURE__ */ e.jsx(Mt, { entries: s, onPick: r, children: /* @__PURE__ */ e.jsxs(
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
function Oa({ open: t, onClose: a, label: s, children: r }) {
  return /* @__PURE__ */ e.jsx(
    Cs,
    {
      open: t,
      onOpenChange: (l) => {
        l || a == null || a();
      },
      children: /* @__PURE__ */ e.jsxs(Ds, { children: [
        /* @__PURE__ */ e.jsx(Ts, { className: "fixed inset-0", style: { pointerEvents: "none" } }),
        /* @__PURE__ */ e.jsx(Ss, { asChild: !0, "aria-describedby": void 0, children: /* @__PURE__ */ e.jsxs("div", { className: "fixed inset-0 z-modal", children: [
          /* @__PURE__ */ e.jsx($s, { className: "sr-only", children: s }),
          r
        ] }) })
      ] })
    }
  );
}
const wn = [
  { key: "subtasks", label: "Alt görevler", countKey: "subtasks", unit: "alt görev" },
  { key: "checklist", label: "Kontrol listesi", countKey: "checklist", unit: "madde" },
  { key: "comments", label: "Yorumlar", countKey: "comments", unit: "yorum" },
  { key: "files", label: "Dosyalar", countKey: "files", unit: "dosya" },
  { key: "keepAssignee", label: "Sorumluyu koru", desc: "Aksi halde atanmamış gelir" },
  { key: "keepLinks", label: "Bağımlılıkları koru", desc: "Öncül / ardıl bağlantılar" },
  { key: "shiftDates", label: "Tarihleri bugüne kaydır", desc: "Başlangıç ve son tarih ötelenir" }
], fa = {
  subtasks: !0,
  checklist: !0,
  comments: !1,
  files: !0,
  keepAssignee: !0,
  keepLinks: !0,
  shiftDates: !1
};
function kn({ on: t, onClick: a, label: s }) {
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
function Cn({
  open: t,
  mode: a = "move",
  onClose: s,
  onConfirm: r,
  projectOptions: l = [],
  currentProjectId: o,
  counts: n = {},
  onCreateProject: i
}) {
  const [u, m] = f.useState(a), [y, p] = f.useState([]), [x, c] = f.useState(""), [d, N] = f.useState(""), [g, h] = f.useState(fa), [v, w] = f.useState(!1);
  f.useEffect(() => {
    t && (m(a), p([]), c(""), N(""), h(fa));
  }, [t, a]);
  const D = f.useMemo(
    () => l.filter((T) => T.value && T.value !== o),
    [l, o]
  ), I = D.filter((T) => !x || T.label.toLowerCase().includes(x.toLowerCase())), B = D.length > 0 && y.length === D.length;
  if (!t) return null;
  const E = (T) => p((L) => L.includes(T) ? L.filter((R) => R !== T) : [...L, T]), O = (T) => {
    var L;
    return ((L = l.find((R) => R.value === T)) == null ? void 0 : L.label) ?? "";
  }, Y = async () => {
    const T = d.trim();
    if (!(!T || v)) {
      w(!0);
      try {
        const L = await (i == null ? void 0 : i(T));
        L && p((R) => [...R, L]), N("");
      } catch (L) {
        P(L, "Proje oluşturulamadı.");
      } finally {
        w(!1);
      }
    }
  }, G = async () => {
    if (!(!y.length || v)) {
      w(!0);
      try {
        await (r == null ? void 0 : r({ mode: u, targetProjectIds: y, include: g }));
      } finally {
        w(!1);
      }
    }
  }, F = u === "move", M = y.length, U = F ? M > 1 ? "Taşı ve kopyala" : "Taşı" : M > 1 ? `${M} projeye kopyala` : "Kopyala", _ = Object.values(g).filter(Boolean).length, V = y.map(O).filter(Boolean), Z = V.length ? `${V.length > 2 ? `${V.slice(0, 2).join(", ")} +${V.length - 2}` : V.join(", ")} · ${_} seçenek açık` : `Proje seçilmedi · ${_} seçenek açık`, Q = (T) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${T ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return /* @__PURE__ */ e.jsx(Oa, { open: t, onClose: s, label: F ? "Başka projeye taşı" : "Başka projelere kopyala", children: /* @__PURE__ */ e.jsx(
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
          "aria-label": F ? "Başka projeye taşı" : "Başka projelere kopyala",
          onClick: (T) => T.stopPropagation(),
          className: "flex flex-col w-full max-w-[760px] max-h-[88vh] rounded-[20px] border border-default bg-surface-base shadow-xl overflow-hidden animate-dialog-in",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-4 px-[22px] pt-5 pb-4 border-b border-subtle", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-10 w-10 rounded-[13px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-tree text-base" }) }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsx("h3", { className: "m-0 text-base font-extrabold tracking-[-.02em] text-text-primary", children: F ? "Başka projeye taşı" : "Başka projelere kopyala" }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 mb-0 text-[12px] leading-[1.5] text-text-tertiary", children: F ? "Görev ilk seçtiğiniz projeye taşınır; birden fazla seçerseniz kalanlara kopya oluşturulur." : "Görevin kopyası seçtiğiniz her projede oluşturulur; bu görev yerinde kalır." })
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
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => m("move"), className: Q(F), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[10px]" }),
                "Taşı"
              ] }),
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => m("copy"), className: Q(!F), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clone text-[10px]" }),
                "Kopyala"
              ] })
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 grid grid-cols-2 lt-860:grid-cols-1 gap-5 items-start px-[22px] pt-4 pb-5 overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px] min-w-0", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5", children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.08em] text-text-tertiary", children: [
                    "Hedef projeler · ",
                    M
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => p(B ? [] : D.map((T) => T.value)),
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
                      value: x,
                      onChange: (T) => c(T.target.value),
                      placeholder: "Proje ara…",
                      className: "w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar", children: [
                  I.map((T) => {
                    const L = y.includes(T.value), R = F && y[0] === T.value;
                    return /* @__PURE__ */ e.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => E(T.value),
                        className: `flex items-center gap-[11px] px-3 py-[11px] rounded-[11px] border text-left cursor-pointer hover:border-focus ${L ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                        children: [
                          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] rounded-[5px] border-[1.5px] text-white ${L ? "bg-primary border-primary" : "bg-transparent border-strong"}`, children: L && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" }) }),
                          /* @__PURE__ */ e.jsx("span", { className: "h-2.5 w-2.5 shrink-0 rounded-[3px] bg-primary" }),
                          /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: T.label }),
                          R && /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center h-5 px-2 rounded-md bg-primary text-white text-[10px] font-extrabold", children: "TAŞINACAK" })
                        ]
                      },
                      T.value
                    );
                  }),
                  I.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "py-6 text-center text-[12px] text-text-tertiary", children: "Uygun proje bulunamadı." })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[7px] mt-1", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: d,
                      onChange: (T) => N(T.target.value),
                      onKeyDown: (T) => {
                        T.key === "Enter" && (T.preventDefault(), Y());
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
                      disabled: !d.trim() || v,
                      className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-plus text-[12px]" })
                    }
                  )
                ] }),
                F && M > 1 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle", children: [
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
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: wn.map((T) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-px", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary", children: T.label }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: T.countKey ? `${n[T.countKey] ?? 0} ${T.unit}` : T.desc })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    kn,
                    {
                      on: g[T.key],
                      label: T.label,
                      onClick: () => h((L) => ({ ...L, [T.key]: !L[T.key] }))
                    }
                  )
                ] }, T.key)) })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3.5 px-[22px] py-3.5 border-t border-subtle bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("span", { className: "min-w-0 truncate text-[11.5px] text-text-tertiary", children: Z }),
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
                    disabled: !M || v,
                    className: `flex items-center gap-2 h-9 px-5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${M && !v ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${v ? "fa-circle-notch fa-spin" : "fa-arrow-right"} text-[10px]` }),
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
const Dn = [
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
function Tn(t = "") {
  var s;
  const a = (s = t.split(".").pop()) == null ? void 0 : s.toLowerCase();
  return a === "pdf" ? Ye.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(a) ? Ye.img : ["doc", "docx", "odt", "rtf"].includes(a) ? Ye.doc : ["json", "js", "ts", "cs", "xml", "yml", "yaml"].includes(a) ? Ye.code : Ye.other;
}
const Sn = (t) => t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : "—", $n = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—", Pn = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—";
function jt({ name: t, size: a = 22 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Je(t), fontSize: a * 0.4 },
      children: He(t)
    }
  );
}
function nt({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: t }),
    a
  ] });
}
function En({
  subtaskId: t,
  parentCode: a,
  onClose: s,
  onOpenFull: r,
  onDeleted: l,
  currentUserName: o = "Ben"
}) {
  var W, de, b;
  const n = ne(), { data: i } = It(t), u = Lt(t), m = zt(t), [y, p] = f.useState("general"), [x, c] = f.useState(""), [d, N] = f.useState(""), [g, h] = f.useState(""), v = f.useRef(null), w = f.useRef(null);
  i && w.current !== i.id && (w.current = i.id, c(i.description ?? ""));
  const { data: D = [] } = J({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var j, S, C, q;
      return Promise.resolve((q = (C = (S = (j = window == null ? void 0 : window.apya) == null ? void 0 : j.platform) == null ? void 0 : S.tasks) == null ? void 0 : C.task) == null ? void 0 : q.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4,
    meta: { persist: !1 }
  });
  if (f.useEffect(() => {
    const j = (S) => {
      S.key === "Escape" && (S.stopPropagation(), s == null || s());
    };
    return window.addEventListener("keydown", j), () => window.removeEventListener("keydown", j);
  }, [s]), !i) return null;
  const { canEdit: I, canChangeStatus: B, canDelete: E } = Oe(i), O = (b = (de = (W = window == null ? void 0 : window.apya) == null ? void 0 : W.platform) == null ? void 0 : de.tasks) == null ? void 0 : b.task, Y = fe(i.status), G = ut(i.priority), F = u.items ?? [], M = F.filter((j) => j.isDone).length, U = F.length ? Math.round(M / F.length * 100) : 0, _ = m.attachments ?? [], V = { checklist: F.length, comments: D.length, files: _.length }, Z = async () => {
    await n.invalidateQueries({ queryKey: ["task-detail", t] });
  }, Q = async (j) => {
    try {
      await Promise.resolve(j()), await Z();
    } catch (S) {
      P(S, "Alt görev güncellenemedi.");
    }
  }, T = (j) => Q(() => O.update(i.id, St(i, j))), L = () => Q(() => O.updateStatus(i.id, i.status >= 4 ? 1 : i.status + 1)), R = () => Q(() => O.setPriority(i.id, i.priority >= 4 ? 1 : i.priority + 1)), X = () => {
    (i.description ?? "") !== x && T({ description: x || null });
  }, oe = async () => {
    const j = d.trim();
    if (j) {
      N("");
      try {
        await u.addItem(j);
      } catch (S) {
        P(S, "Madde eklenemedi.");
      }
    }
  }, ie = async () => {
    const j = g.trim();
    if (j) {
      h("");
      try {
        await Promise.resolve(O.addComment(i.id, j)), await n.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch (S) {
        P(S, "Yorum gönderilemedi.");
      }
    }
  }, ee = async () => {
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(O.delete(i.id)), l == null || l(i.id), s == null || s();
      } catch (j) {
        P(j, "Alt görev silinemedi.");
      }
  }, se = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
  return /* @__PURE__ */ e.jsxs(Oa, { open: !0, onClose: s, label: `${i.code} alt görev detayı`, children: [
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
                    className: `${se} hover:bg-surface-hover hover:text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-up-right-from-square text-[11px]" })
                  }
                ),
                E && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Alt görevi sil",
                    onClick: ee,
                    className: `${se} hover:bg-negative-subtle hover:text-negative`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Kapat",
                    onClick: s,
                    className: `${se} hover:bg-surface-hover hover:text-text-primary`,
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
                  onClick: L,
                  title: "Durumu değiştir",
                  disabled: !B,
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold ${B ? "cursor-pointer" : "cursor-default"} ${Y.bg} ${Y.fg}`,
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
                  onClick: R,
                  title: "Önceliği değiştir",
                  disabled: !I,
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold ${I ? "cursor-pointer" : "cursor-default"} ${G.bg} ${G.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${G.icon} text-[10px]` }),
                    G.label
                  ]
                }
              ),
              (i.tags ?? []).map((j) => /* @__PURE__ */ e.jsx("span", { className: "flex items-center h-6 px-[9px] rounded-[7px] border border-default bg-neutral-subtle text-text-secondary text-[11px] font-semibold", children: j.name }, j.id ?? j.name)),
              !I && /* @__PURE__ */ e.jsxs(
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
              /* @__PURE__ */ e.jsx(nt, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
                /* @__PURE__ */ e.jsx(jt, { name: i.assigneeName }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", children: i.assigneeName || "Atanmamış" })
              ] }) }),
              /* @__PURE__ */ e.jsx(nt, { label: "Son tarih", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] h-[22px] text-[12.5px] font-semibold text-text-primary", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[11px] text-text-tertiary" }),
                Pn(i.dueDate)
              ] }) }),
              /* @__PURE__ */ e.jsx(nt, { label: "Süre", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-[22px] font-mono text-[12.5px] font-bold text-text-primary", children: [
                i.spentHours ?? 0,
                "s",
                /* @__PURE__ */ e.jsxs("span", { className: "font-medium text-text-tertiary", children: [
                  " / ",
                  i.estimatedHours != null ? `${i.estimatedHours}s` : "—"
                ] })
              ] }) }),
              /* @__PURE__ */ e.jsx(nt, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-1.5 pt-[3px]", children: [
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
                  "%",
                  U
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: "block h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("span", { className: "block h-full rounded-full bg-success", style: { width: `${U}%` } }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: Dn.map((j) => {
            const S = y === j.code, C = V[j.code] ?? 0;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => p(j.code),
                className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${S ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${j.icon} text-[11px] opacity-85` }),
                  /* @__PURE__ */ e.jsx("span", { children: j.title }),
                  C > 0 && /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-neutral-subtle text-text-tertiary text-[10px] font-extrabold", children: C })
                ]
              },
              j.code
            );
          }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar px-5 py-[18px] bg-surface-raised", children: [
            y === "general" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Açıklama" }),
              /* @__PURE__ */ e.jsx(
                "textarea",
                {
                  rows: 7,
                  value: x,
                  onChange: (j) => c(j.target.value),
                  onBlur: I ? X : void 0,
                  readOnly: !I,
                  placeholder: I ? "Bu alt görevin detayları…" : "Açıklama yok.",
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
            y === "checklist" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px]", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Kontrol listesi" }),
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: [
                  M,
                  "/",
                  F.length
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-success", style: { width: `${U}%` } }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px] mt-1", children: [
                F.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] border border-subtle bg-surface-base hover:border-default", children: [
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Tamamlandı işaretle",
                      onClick: () => u.toggleItem(j.id),
                      disabled: !I,
                      className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${I ? "cursor-pointer" : "cursor-default"} ${j.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
                      children: j.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[12.5px] font-semibold ${j.isDone ? "line-through text-text-tertiary" : "text-text-primary"}`, children: j.text }),
                  I && /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Maddeyi sil",
                      onClick: () => u.removeItem(j.id),
                      className: "flex shrink-0 items-center justify-center h-6 w-6 rounded-md text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[10px]" })
                    }
                  )
                ] }, j.id)),
                I && /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "text",
                    value: d,
                    onChange: (j) => N(j.target.value),
                    onKeyDown: (j) => {
                      j.key === "Enter" && oe();
                    },
                    placeholder: "Yeni madde yaz ve Enter'a bas…",
                    className: "h-9 mt-1 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                )
              ] })
            ] }),
            y === "comments" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] items-start", children: [
                /* @__PURE__ */ e.jsx(jt, { name: o, size: 30 }),
                /* @__PURE__ */ e.jsx(
                  "textarea",
                  {
                    rows: 2,
                    value: g,
                    onChange: (j) => h(j.target.value),
                    onKeyDown: (j) => {
                      j.key === "Enter" && !j.shiftKey && (j.preventDefault(), ie());
                    },
                    placeholder: "Yorum yaz ve Enter'a bas…",
                    className: "flex-1 min-w-0 px-3 py-2.5 rounded-[11px] border border-default bg-surface-base text-text-primary text-[12.5px] leading-[1.6] resize-none focus:border-focus focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: ie,
                    "aria-label": "Yorumu gönder",
                    className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] ${g.trim() ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paper-plane text-[11px]" })
                  }
                )
              ] }),
              D.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-[7px] py-7 rounded-xl border border-dashed border-default", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-comments text-xl text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Henüz yorum yok" })
              ] }) : D.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 items-start p-3 rounded-xl border border-subtle bg-surface-base", children: [
                /* @__PURE__ */ e.jsx(jt, { name: j.authorName, size: 28 }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: j.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: $n(j.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: j.text })
                ] })
              ] }, j.id))
            ] }),
            y === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  ref: v,
                  type: "file",
                  className: "hidden",
                  onChange: (j) => {
                    var C;
                    const S = (C = j.target.files) == null ? void 0 : C[0];
                    j.target.value = "", S && m.upload(S).catch((q) => P(q, "Dosya yüklenemedi."));
                  }
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    var j;
                    return (j = v.current) == null ? void 0 : j.click();
                  },
                  disabled: m.isUploading,
                  className: "flex flex-col items-center justify-center gap-[7px] p-6 rounded-[13px] border-2 border-dashed border-strong bg-surface-base cursor-pointer hover:border-focus hover:bg-primary-subtle disabled:opacity-60",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${m.isUploading ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-xl text-text-tertiary` }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: m.isUploading ? "Yükleniyor…" : "Dosya ekle" })
                  ]
                }
              ),
              _.map((j) => {
                const S = Tn(j.fileName);
                return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${S.bg} ${S.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${S.icon} text-[13px]` }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: j.fileName }),
                    /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                      Sn(j.fileSize),
                      " · ",
                      j.uploaderName
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "a",
                    {
                      href: j.downloadUrl,
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
                      onClick: () => m.remove(j.id).catch((C) => P(C, "Dosya silinemedi.")),
                      className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                    }
                  )
                ] }, j.id);
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
const Qa = "apya.taskDetail.tabOrder", Bn = "taskdetail";
function ba() {
  try {
    const t = localStorage.getItem(Qa);
    if (!t) return [];
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.filter((s) => typeof s == "string") : [];
  } catch {
    return [];
  }
}
function In(t) {
  try {
    localStorage.setItem(Qa, JSON.stringify(t));
  } catch {
  }
}
function ha() {
  const t = document.querySelector("[data-tab-order]"), a = t == null ? void 0 : t.getAttribute("data-tab-order");
  if (!a) return null;
  try {
    const s = JSON.parse(a);
    return Array.isArray(s) ? s.map((r) => r == null ? void 0 : r.kind).filter((r) => typeof r == "string") : null;
  } catch {
    return null;
  }
}
function ya(t) {
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
        scope: Bn,
        tabs: t.map((s) => ({ kind: s, ref: "", title: "" }))
      })
    }).catch(() => {
    });
  } catch {
  }
}
function Fn(t) {
  const [a, s] = f.useState(() => ha() ?? ba()), [r, l] = f.useState(null);
  f.useEffect(() => {
    if (ha() === null) {
      const m = ba();
      m.length && ya(m);
    }
  }, []);
  const o = f.useMemo(() => {
    const m = new Map(t.map((p) => [p.code, p])), y = [];
    for (const p of a) {
      const x = m.get(p);
      x && (y.push(x), m.delete(p));
    }
    for (const p of t)
      m.has(p.code) && y.push(p);
    return y;
  }, [t, a]), n = f.useCallback((m) => {
    s((y) => {
      const p = r;
      if (!p || p === m) return y;
      const x = y.length ? y.slice() : o.map((N) => N.code), c = x.indexOf(p), d = x.indexOf(m);
      return c === -1 || d === -1 ? y : (x.splice(c, 1), x.splice(d, 0, p), x);
    });
  }, [r, o]), i = f.useCallback((m) => l(m), []), u = f.useCallback(() => {
    l(null), s((m) => {
      const y = m.length ? m : o.map((p) => p.code);
      return In(y), ya(y), y;
    });
  }, [o]);
  return { orderedTabs: o, draggingCode: r, handleDragStart: i, handleDragEnd: u, reorderTo: n };
}
function An(t) {
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
function zn() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ln() {
  const t = J({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: zn,
    staleTime: 3e5,
    retry: !1
  }), a = t.data ?? [], s = a.map((l) => ({ value: l.id, label: l.name })), r = new Map(a.map((l) => [l.id, l.name]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function Mn(t) {
  var s, r, l;
  const a = (l = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.projects) == null ? void 0 : l.boardColumn;
  return a ? Promise.resolve(a.getListByProject(t, { abpHandleError: !1 })) : Promise.resolve([]);
}
function Kn(t) {
  const a = J({
    queryKey: ["task-detail", "board-columns", t],
    queryFn: () => Mn(t),
    enabled: !!t,
    staleTime: 6e4,
    retry: !1,
    /* Kolonlar panoda her an yeniden adlandırılıp eklenebilir — kalıcı önbellekten
       bayat seçenek gelmesin. */
    meta: { persist: !1 }
  });
  return t ? a.data ?? [] : [];
}
const ga = "apya.taskDetail.fullscreen", ue = {
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
function Rn(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function va() {
  var s;
  const t = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.currentUser;
  return [t == null ? void 0 : t.name, t == null ? void 0 : t.surName].filter((r) => r && String(r).trim()).join(" ").trim() || (t == null ? void 0 : t.userName) || "Ben";
}
function Ha({ taskId: t, presentation: a = "modal", onClose: s, switchToTask: r }) {
  const [l, o] = f.useState(t), { data: n, isPending: i, isError: u, error: m, refetch: y } = It(l), p = ne(), x = Ca(), c = Fa(n), d = Aa(), N = Ln(), g = Kn(
    n != null && n.projectId && c.values.projectId === n.projectId ? n.projectId : null
  ), h = za(l), v = Lt(l), [w, D] = f.useState("general"), [I, B] = f.useState(!1), [E, O] = f.useState(!1), [Y, G] = f.useState(!1), [F, M] = f.useState(null), [U, _] = f.useState(null), [V, Z] = f.useState(!1), [Q, T] = f.useState(!1), [L, R] = f.useState(() => {
    try {
      return localStorage.getItem(ga) === "true";
    } catch {
      return !1;
    }
  });
  Ba(a === "page" ? null : l), An(a === "page" ? n == null ? void 0 : n.title : null);
  const [X, oe] = f.useState(null);
  n != null && n.id && n.id !== X && (oe(n.id), Z(!!n.isFavorite), T(!!n.isWatched)), f.useEffect(() => {
    c.isDirty ? x.markDirty() : x.markClean();
  }), f.useEffect(() => {
    const k = p.getQueryCache().subscribe((A) => {
      var le;
      A.type === "updated" && ((le = A.action) == null ? void 0 : le.type) === "invalidate" && !Ps(A.query.queryKey) && H.markChanged();
    }), $ = p.getMutationCache().subscribe((A) => {
      A.type === "added" && H.markChanged();
    });
    return () => {
      k(), $();
    };
  }, [p]);
  const ie = f.useCallback(() => {
    At(), s == null || s();
  }, [s]), ee = f.useCallback(() => {
    I || (G(!1), x.requestClose(ie));
  }, [x, ie, I]), se = (k) => {
    G(!1), x.requestClose(() => (r ?? o)(k));
  }, W = f.useCallback(() => {
    R((k) => {
      const $ = !k;
      try {
        localStorage.setItem(ga, String($));
      } catch {
      }
      return $;
    });
  }, []), de = f.useMemo(
    () => _a(h.assignedCodes),
    [h.assignedCodes]
  ), b = Fn(de), j = f.useMemo(
    () => Ua(h.assignedCodes),
    [h.assignedCodes]
  ), S = (k, $) => {
    if ($) {
      D(k);
      return;
    }
    os(k);
  }, C = f.useMemo(() => {
    var k, $, A, le, pe;
    return {
      subtasks: ((k = n == null ? void 0 : n.subTasks) == null ? void 0 : k.length) ?? 0,
      files: (($ = n == null ? void 0 : n.attachments) == null ? void 0 : $.length) ?? 0,
      dependencies: ((A = n == null ? void 0 : n.predecessorIds) == null ? void 0 : A.length) ?? 0,
      comments: ((le = n == null ? void 0 : n.comments) == null ? void 0 : le.length) ?? 0,
      checklist: ((pe = v.items) == null ? void 0 : pe.length) ?? 0
    };
  }, [n, v.items]), q = We.find((k) => k.code === w), z = v.items ?? [], K = z.filter((k) => k.isDone).length, te = z.length ? Math.round(K / z.length * 100) : 0, ge = f.useRef(null), [Kt, Wa] = f.useState(0), Rt = () => c.validate() ? !0 : (ue.err(xe("Tasks:Detail:Validation:Summary", "Kaydedilemedi: işaretli alanları düzeltin.")), Wa((k) => k + 1), !1);
  f.useEffect(() => {
    var $, A;
    if (!Kt) return;
    const k = ($ = ge.current) == null ? void 0 : $.querySelector('[aria-invalid="true"]');
    k == null || k.focus(), (A = k == null ? void 0 : k.scrollIntoView) == null || A.call(k, { block: "nearest" });
  }, [Kt]);
  const Ze = f.useCallback(async () => {
    if (!Rt()) return !1;
    B(!0);
    try {
      const k = c.values, $ = await Promise.resolve(window.apya.platform.tasks.task.update(l, c.toUpdateDto()));
      await p.invalidateQueries({ queryKey: ["task-detail", l] });
      const A = p.getQueryState(["task-detail", l]);
      return c.commitSaved(k, (A == null ? void 0 : A.status) === "success" ? A.data : $), H.emitResult(), O(!0), setTimeout(() => O(!1), 2e3), ue.ok("Görev başarıyla güncellendi."), !0;
    } catch (k) {
      return P(k, "Kaydedilemedi."), !1;
    } finally {
      B(!1);
    }
  }, [l, c, p]), Za = () => {
    G(!1), x.resolvePendingClose("stay");
  }, Xa = () => {
    G(!1), c.reset(), x.resolvePendingClose("discard");
  }, es = async () => {
    if (G(!1), !Rt()) {
      x.resolvePendingClose("stay");
      return;
    }
    await Ze() ? x.resolvePendingClose("saved") : G(!0);
  };
  f.useEffect(() => {
    const k = ($) => {
      if (($.ctrlKey || $.metaKey) && $.key.toLowerCase() === "s") {
        $.preventDefault(), c.isDirty && !I && !x.pendingClose && Ze();
        return;
      }
      $.key === "Escape" && F && ($.stopPropagation(), M(null));
    };
    return window.addEventListener("keydown", k), () => window.removeEventListener("keydown", k);
  }, [Ze, c.isDirty, I, F, x.pendingClose]);
  const Be = () => {
    var k, $, A;
    return (A = ($ = (k = window == null ? void 0 : window.apya) == null ? void 0 : k.platform) == null ? void 0 : $.tasks) == null ? void 0 : A.task;
  }, ts = async () => {
    var $;
    const k = !V;
    Z(k), H.markChanged();
    try {
      await Promise.resolve(($ = Be()) == null ? void 0 : $.toggleFavorite(l));
    } catch (A) {
      Z(!k), P(A, "Favori güncellenemedi.");
    }
  }, as = () => {
    if (!l) return;
    const k = document.createElement("a");
    k.href = `/Tasks/Detail/${l}?handler=Pdf`, k.rel = "noopener", document.body.appendChild(k), k.click(), k.remove();
  }, ss = async () => {
    var $;
    const k = !Q;
    T(k), H.markChanged();
    try {
      await Promise.resolve(($ = Be()) == null ? void 0 : $.toggleWatch(l)), ue.info(k ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (A) {
      T(!k), P(A, "Takip durumu güncellenemedi.");
    }
  }, rs = async () => {
    var k, $;
    H.markChanged();
    try {
      const A = await Promise.resolve((k = Be()) == null ? void 0 : k.transfer(l, {
        mode: 2,
        // Copy
        targetProjectIds: n != null && n.projectId ? [n.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await p.invalidateQueries({ queryKey: ["task-detail"] }), ue.ok("Görev çoğaltıldı.");
      const le = ($ = A == null ? void 0 : A.createdTaskIds) == null ? void 0 : $[0];
      le && se(le);
    } catch (A) {
      P(A, "Görev çoğaltılamadı.");
    }
  }, qt = async (k, $, A) => {
    var le, pe;
    H.markChanged();
    try {
      await Promise.resolve((le = Be()) == null ? void 0 : le.updateStatus(l, k)), await p.invalidateQueries({ queryKey: ["task-detail", l] }), c.setField("status", k), c.setField(
        "boardColumnId",
        ((pe = p.getQueryData(["task-detail", l])) == null ? void 0 : pe.boardColumnId) ?? null
      ), ue.info($);
    } catch (me) {
      P(me, A);
    }
  }, ns = () => qt(4, "Görev arşivlendi (Tamamlandı).", "Görev arşivlenemedi."), is = () => qt(0, "Görev iptal edildi.", "Görev iptal edilemedi."), ls = async () => {
    var k;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?")) {
      H.markChanged();
      try {
        await Promise.resolve((k = Be()) == null ? void 0 : k.delete(l)), ue.info("Görev silindi."), x.markClean(), ie();
      } catch ($) {
        P($, "Görev silinemedi.");
      }
    }
  }, os = async (k) => {
    try {
      await h.addFeature(k), D(k), ue.ok("Özellik başarıyla eklendi.");
    } catch ($) {
      P($, "Özellik eklenemedi.");
    }
  }, Gt = async (k) => {
    try {
      await h.removeFeature(k), D("general"), ue.info("Özellik görevden kaldırıldı.");
    } catch ($) {
      P($, "Özellik kaldırılamadı.");
    }
  }, cs = async (k) => {
    var le, pe, me, Ie, Pe, et, Re;
    const $ = ((Ie = (me = (pe = (le = window == null ? void 0 : window.apya) == null ? void 0 : le.platform) == null ? void 0 : pe.application) == null ? void 0 : me.projects) == null ? void 0 : Ie.project) ?? ((Re = (et = (Pe = window == null ? void 0 : window.apya) == null ? void 0 : Pe.platform) == null ? void 0 : et.projects) == null ? void 0 : Re.project);
    if (!($ != null && $.create)) throw new Error("Proje servisi yüklenmedi.");
    const A = await Promise.resolve($.create({
      name: k,
      code: Rn(k),
      currency: "TRY"
    }));
    return await p.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), ue.ok(`“${k}” projesi oluşturuldu.`), (A == null ? void 0 : A.id) ?? A;
  }, ds = async ({ mode: k, targetProjectIds: $, include: A }) => {
    var le, pe;
    H.markChanged();
    try {
      const me = await Promise.resolve((le = Be()) == null ? void 0 : le.transfer(l, {
        mode: k === "move" ? 1 : 2,
        targetProjectIds: $,
        include: A
      }));
      await p.invalidateQueries({ queryKey: ["task-detail", l] }), k === "move" && c.setField("projectId", $[0]);
      const Ie = $.map((et) => {
        var Re;
        return (Re = N.options.find((ms) => ms.value === et)) == null ? void 0 : Re.label;
      }).filter(Boolean), Pe = ((pe = me == null ? void 0 : me.createdTaskIds) == null ? void 0 : pe.length) ?? 0;
      ue.ok(k === "move" ? Pe ? `“${Ie[0]}” projesine taşındı, ${Pe} projeye kopyalandı.` : `Görev “${Ie[0]}” projesine taşındı.` : Pe > 1 ? `${Pe} projeye kopyalandı.` : `Kopya “${Ie[0]}” projesinde oluşturuldu.`), M(null);
    } catch (me) {
      P(me, "Transfer tamamlanamadı.");
    }
  }, { canEdit: Xe, canChangeStatus: xs, canDelete: us } = Oe(n), ps = w === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)] gap-5 items-start", children: [
    /* @__PURE__ */ e.jsx(
      bn,
      {
        task: n,
        onFieldChange: c.setField,
        descriptionValue: c.values.description,
        checklist: v,
        readOnly: !Xe,
        currentUserName: va()
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5", children: /* @__PURE__ */ e.jsx(fn, { task: n, nameById: d.nameById }) })
  ] }) : jn(w) ? /* @__PURE__ */ e.jsx(
    ma,
    {
      code: w,
      onRemoveFeature: Gt,
      pickerEntries: j,
      onPickFeature: S,
      canRemove: !(q != null && q.isCore)
    }
  ) : /* @__PURE__ */ e.jsx(f.Suspense, { fallback: /* @__PURE__ */ e.jsx(we, { className: "h-48 w-full" }), children: q != null && q.component ? /* @__PURE__ */ e.jsx(
    q.component,
    {
      taskId: l,
      task: n,
      form: c,
      nameById: d.nameById,
      onOpenSubtask: _,
      readOnly: !Xe
    }
  ) : /* @__PURE__ */ e.jsx(
    ma,
    {
      code: w,
      onRemoveFeature: Gt,
      pickerEntries: j,
      onPickFeature: S,
      canRemove: !(q != null && q.isCore)
    }
  ) }), Ke = u && ((m == null ? void 0 : m.status) === 404 || (m == null ? void 0 : m.status) === 403) ? m.status : null, Yt = i ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(we, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(we, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(we, { className: "h-64 w-full" })
  ] }) : Ke ? /* @__PURE__ */ e.jsx(
    fs,
    {
      variant: Ke === 404 ? "error" : "locked",
      icon: Ke === 404 ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-magnifying-glass" }) : void 0,
      title: Ke === 404 ? xe("Tasks:Detail:NotFound:Title", "Bu görev bulunamadı") : xe("Tasks:Detail:Forbidden:Title", "Bu görevi görüntüleyemezsiniz"),
      description: Ke === 404 ? xe("Tasks:Detail:NotFound:Body", "Görev silinmiş ya da bağlantı eskimiş olabilir.") : bs(m),
      action: a === "page" ? /* @__PURE__ */ e.jsx(re, { asChild: !0, size: "sm", children: /* @__PURE__ */ e.jsxs("a", { href: "/Tasks", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-left", "aria-hidden": "true" }),
        xe("Tasks:Detail:BackToList", "Görevlere dön")
      ] }) }) : /* @__PURE__ */ e.jsx(re, { variant: "secondary", size: "sm", onClick: ee, children: xe("Common:Close", "Kapat") })
    }
  ) : u && !n ? (
    /* Yalnız İLK yükleme hatası. Görev ekrandayken düşen tazeleme (odak dönüşü, kayıt sonrası
       yeniden çekme; oturum düşünce 401) formu sökmez: yazılanlar görünür kalır, sonraki
       başarılı tazeleme forma işlenir (useTaskForm rebase). */
    /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
      /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
      /* @__PURE__ */ e.jsx(hs, { onRetry: y })
    ] })
  ) : /* @__PURE__ */ e.jsxs("div", { ref: ge, className: "flex flex-col flex-1 min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      dn,
      {
        task: n,
        presentation: a,
        onClose: ee,
        isFullscreen: L,
        onToggleFullscreen: W,
        onFieldChange: c.setField,
        statusValue: c.values.status,
        boardColumns: g,
        boardColumnValue: c.values.boardColumnId,
        titleValue: n == null ? void 0 : n.title,
        titleError: c.errors.title,
        isPrivateValue: c.values.isPrivate,
        isFavorite: V,
        onToggleFavorite: ts,
        isWatched: Q,
        onToggleWatch: ss,
        onDuplicate: rs,
        onArchive: ns,
        onCancelTask: is,
        onDelete: ls,
        onOpenTransfer: (k) => M({ mode: k }),
        onExportPdf: as,
        canEdit: Xe,
        canChangeStatus: xs,
        canDelete: us
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        xn,
        {
          task: n,
          assigneeOptions: d.options,
          projectOptions: N.options,
          onFieldChange: c.setField,
          statusValue: c.values.status,
          boardColumns: g,
          boardColumnValue: c.values.boardColumnId,
          priorityValue: c.values.priority,
          assigneeValue: c.values.assigneeId,
          projectValue: c.values.projectId,
          dueDateValue: c.values.dueDate,
          startDateValue: c.values.startDate,
          startDateError: c.errors.startDate,
          dueDateError: c.errors.dueDate,
          tagsValue: c.values.tagNames,
          progressPercent: te,
          progressNote: `${K}/${z.length} madde`,
          onOpenTransfer: (k) => M({ mode: k }),
          readOnly: !Xe
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        a === "page" && /* @__PURE__ */ e.jsx(
          mn,
          {
            activeTab: w,
            onTabChange: D,
            orderedTabs: b.orderedTabs,
            draggingCode: b.draggingCode,
            onDragStart: b.handleDragStart,
            onDragEnd: b.handleDragEnd,
            onReorderTo: b.reorderTo,
            onReorderDrop: () => ue.info("Sekme sırası güncellendi."),
            pickerEntries: j,
            onPickFeature: S,
            counts: C
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: a === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            pn,
            {
              activeTab: w,
              onTabChange: D,
              orderedTabs: b.orderedTabs,
              draggingCode: b.draggingCode,
              onDragStart: b.handleDragStart,
              onDragEnd: b.handleDragEnd,
              onReorderTo: b.reorderTo,
              onReorderDrop: () => ue.info("Sekme sırası güncellendi."),
              pickerEntries: j,
              onPickFeature: S,
              counts: C,
              isDirty: c.isDirty
            }
          ) }),
          /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised", children: ps })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(
      hn,
      {
        lastSavedAt: n == null ? void 0 : n.lastModificationTime,
        isDirty: c.isDirty,
        isSaving: I,
        justSaved: E,
        onCancel: ee,
        onSave: Ze,
        sticky: a === "page"
      }
    )
  ] }), _t = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      Cn,
      {
        open: !!F,
        mode: (F == null ? void 0 : F.mode) ?? "move",
        onClose: () => M(null),
        onConfirm: ds,
        projectOptions: N.options,
        currentProjectId: c.values.projectId,
        counts: C,
        onCreateProject: cs
      }
    ),
    U && /* @__PURE__ */ e.jsx(
      En,
      {
        subtaskId: U,
        parentCode: n == null ? void 0 : n.code,
        onClose: () => _(null),
        onOpenFull: (k) => {
          _(null), se(k);
        },
        onDeleted: () => p.invalidateQueries({ queryKey: ["task-detail", l] }),
        currentUserName: va()
      }
    ),
    /* @__PURE__ */ e.jsx(
      Et,
      {
        open: x.pendingClose,
        isSaving: I,
        errorText: Y ? xe("Common:Unsaved:SaveFailed", "Kaydedilemedi. Düzenlemeye dönebilir ya da değişiklikleri atabilirsiniz.") : void 0,
        onStay: Za,
        onDiscard: Xa,
        onSave: es
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col w-full min-h-[calc(100vh-54px)] border-y border-subtle bg-surface-base", children: Yt }),
    _t
  ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx($t, { open: !0, onOpenChange: (k) => {
      k || ee();
    }, children: /* @__PURE__ */ e.jsx(
      Pt,
      {
        title: n != null && n.title ? `Görev Detayı: ${n.title}` : "Görev Detayı",
        fullscreen: L,
        className: L ? "p-0 rounded-xl border border-default shadow-xl short:h-[100svh]" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl short:h-[100svh]",
        onInteractOutside: (k) => {
          var $, A;
          k.preventDefault(), !(F || U || x.pendingClose) && ((A = ($ = k.target) == null ? void 0 : $.closest) != null && A.call($, "[data-apya-overlay]") || ee());
        },
        onEscapeKeyDown: (k) => {
          if (F || U) {
            k.preventDefault();
            return;
          }
          if (document.querySelector(".modal.show")) {
            k.preventDefault();
            return;
          }
          k.preventDefault(), ee();
        },
        children: Yt
      }
    ) }),
    _t
  ] });
}
function qn(t) {
  window.location.assign("/Tasks/Detail/" + encodeURIComponent(t));
}
function Gn() {
  const t = f.useSyncExternalStore(
    H.subscribe,
    H.getSnapshot,
    () => null
  );
  return t ? /* @__PURE__ */ e.jsx(ys, { name: "task-detail", fallback: (a) => /* @__PURE__ */ e.jsx(Yn, { ...a }), children: /* @__PURE__ */ e.jsx(_n, { taskId: t }) }) : null;
}
function Yn(t) {
  const a = () => {
    var s;
    At(), H.close(), (s = window.apya) != null && s.taskDetailV3Enabled ? H.emitResultIfChanged() : H.emitResult();
  };
  return /* @__PURE__ */ e.jsx($t, { open: !0, onOpenChange: (s) => {
    s || a();
  }, children: /* @__PURE__ */ e.jsx(
    Pt,
    {
      title: xe("Common:SectionError:Title", "Bu bölüm gösterilemedi"),
      className: "w-full max-w-[480px] h-auto tablet:min-h-0 justify-center p-6",
      children: /* @__PURE__ */ e.jsx(gs, { ...t, onClose: a })
    }
  ) });
}
function _n({ taskId: t }) {
  var a;
  return (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(ot, { children: /* @__PURE__ */ e.jsx(
    Ha,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        H.close(), H.emitResultIfChanged();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(ot, { children: /* @__PURE__ */ e.jsx(
    Va,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        H.close(), H.emitResult();
      }
    },
    t
  ) });
}
function Ja() {
  var s;
  try {
    const r = new URLSearchParams(window.location.search).get("taskui");
    if (r === "v1" || r === "v2" || r === "v3") return r;
  } catch {
  }
  const t = document.getElementById("task-detail-island"), a = (s = t == null ? void 0 : t.dataset) == null ? void 0 : s.taskui;
  return a === "v1" || a === "v2" ? a : "v3";
}
function Un() {
  return Ja() === "v2";
}
function Vn() {
  return Ja() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = Vn();
window.apya.taskDetailV2Enabled = Un() && !window.apya.taskDetailV3Enabled;
const ja = {
  open: (t) => {
    H.open(t);
  },
  close: () => H.close(),
  onResult: (t) => H.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(ja) : window.apya.taskDetail = ja;
function Na() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = wa(t, "task-detail", /* @__PURE__ */ e.jsx(Gn, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = Ea();
    a && H.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Na) : Na();
function On({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(ot, { children: /* @__PURE__ */ e.jsx(
    Ha,
    {
      taskId: t,
      presentation: "page",
      onClose: a,
      switchToTask: qn
    }
  ) }) : /* @__PURE__ */ e.jsx(ot, { children: /* @__PURE__ */ e.jsx(
    Va,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) });
}
const Nt = document.getElementById("task-detail-page-island");
if (Nt) {
  const t = Nt.getAttribute("data-task-id");
  t && wa(Nt, "task-detail-page", /* @__PURE__ */ e.jsx(On, { taskId: t }));
}
