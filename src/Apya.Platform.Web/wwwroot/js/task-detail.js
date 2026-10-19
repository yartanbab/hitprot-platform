import { j as e, r as f, b as _e } from "./react-vendor-D7YDiBbi.js";
import { t as xe, n as P, E as ys, e as gs, R as vs, m as Ca, I as js, a as Ns } from "./index-DgpuJ91w.js";
import { D as $t, g as Pt, d as wt, B as se, I as Ue, M as ws } from "./Dialog-D3HpJNIB.js";
import { a as ot } from "./QueryProvider-D2Hvqdr9.js";
import { u as J, a as re, b as te } from "./query-vendor-Db2mwxYI.js";
import { C as Da } from "./Combobox-CHhgTuMW.js";
import { U as Et, u as Ta } from "./useDirtyGuard-D_9NgM7w.js";
import { i as He, a as We, s as be, p as ut, d as Sa, b as Ot, R as $a, c as Fe, e as Pa, f as Ea, g as ks, P as Cs } from "./RichTextEditorV3-CsU1qQrh.js";
import { r as Ds } from "./httpClient-BNoyY5yK.js";
import { S as ke } from "./Skeleton-C92LWNeC.js";
import { R as Ce, T as De, P as Te, C as Se, A as Ts, a as Bt, D as Ss, b as $s, c as Ps, d as Es, e as Bs } from "./ui-vendor-UYevF8mE.js";
import { d as Ba } from "./draggableActivation-Ybw9Upbh.js";
import { i as Is } from "./dataChanged-CDwwWMH8.js";
function Fs({
  open: t,
  onRequestClose: s,
  fullscreen: a,
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
        i || s();
      },
      children: /* @__PURE__ */ e.jsx(
        Pt,
        {
          title: r,
          fullscreen: a,
          onInteractOutside: (i) => {
            i.preventDefault(), s();
          },
          onEscapeKeyDown: (i) => {
            i.preventDefault(), s();
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
function As({ title: t, header: s, footer: a, children: r }) {
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "flex h-full min-h-[calc(100vh-120px)] flex-col rounded-xl border border-default bg-surface-elevated shadow-sm",
      "aria-label": t,
      children: /* @__PURE__ */ e.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
        s,
        /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: r }),
        a
      ] })
    }
  );
}
function zs({ isPrivate: t }) {
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
function Ls({
  task: t,
  canDelete: s,
  onClose: a,
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
  const m = kt[t == null ? void 0 : t.status] ?? kt[1], h = Ct[t == null ? void 0 : t.priority] ?? Ct[2], p = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), i(!1);
  }, x = () => {
    var d, N, y, b;
    const c = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (d = navigator.clipboard) == null || d.writeText(c), (b = (y = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : y.info) == null || b.call(y, "Bağlantı kopyalandı."), i(!1);
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
        /* @__PURE__ */ e.jsx(wt, { variant: h.variant, children: h.text }),
        /* @__PURE__ */ e.jsx(zs, { isPrivate: t == null ? void 0 : t.isPrivate })
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
              s && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
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
          onClick: a,
          className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] })
  ] }) });
}
const Ms = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function Ks({ lastSavedAt: t, isDirty: s, isSaving: a, onCancel: r, onSave: l }) {
  const o = Ms(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: o ? `Son kayıt: ${o}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(se, { variant: "secondary", onClick: r, disabled: a, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        se,
        {
          variant: "primary",
          onClick: () => l == null ? void 0 : l(),
          disabled: !s || !l,
          isLoading: a,
          loadingText: "Kaydediliyor…",
          children: "Kaydet"
        }
      )
    ] })
  ] }) });
}
const Qt = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Rs = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function je({ label: t, htmlFor: s, error: a, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: s, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    a && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: a })
  ] });
}
function qs({ value: t, onChange: s }) {
  const [a, r] = f.useState(""), l = () => {
    const o = a.trim();
    o && !t.includes(o) && s([...t, o]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((o) => /* @__PURE__ */ e.jsxs(wt, { variant: "neutral", children: [
      o,
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${o} etiketini kaldır`,
          onClick: () => s(t.filter((n) => n !== o)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, o)) }),
    /* @__PURE__ */ e.jsx(
      Ue,
      {
        value: a,
        onChange: (o) => r(o.target.value),
        onKeyDown: (o) => {
          o.key === "Enter" || o.key === "," ? (o.preventDefault(), l()) : o.key === "Backspace" && !a && t.length && s(t.slice(0, -1));
        },
        onBlur: l,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function Gs({
  values: t,
  errors: s,
  onFieldChange: a,
  assigneeOptions: r = [],
  isLoadingAssignees: l = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(je, { label: "Başlık", htmlFor: "task-title", error: s.title, children: /* @__PURE__ */ e.jsx(
      Ue,
      {
        id: "task-title",
        value: t.title,
        onChange: (o) => a("title", o.target.value),
        invalid: !!s.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(je, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (o) => a("status", Number(o.target.value)),
          className: Qt,
          children: Object.entries(kt).map(([o, n]) => /* @__PURE__ */ e.jsx("option", { value: o, children: n.text }, o))
        }
      ) }),
      /* @__PURE__ */ e.jsx(je, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (o) => a("priority", Number(o.target.value)),
          className: Qt,
          children: Object.entries(Ct).map(([o, n]) => /* @__PURE__ */ e.jsx("option", { value: o, children: n.text }, o))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(je, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      Da,
      {
        id: "task-assignee",
        options: r,
        value: t.assigneeId,
        onChange: (o) => a("assigneeId", o),
        placeholder: l ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: l
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(je, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: s.startDate, children: /* @__PURE__ */ e.jsx(
        Ue,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (o) => a("startDate", o.target.value),
          invalid: !!s.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(je, { label: "Son Tarih", htmlFor: "task-due", error: s.dueDate, children: /* @__PURE__ */ e.jsx(
        Ue,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (o) => a("dueDate", o.target.value),
          invalid: !!s.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(je, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(qs, { value: t.tagNames, onChange: (o) => a("tagNames", o) }) }),
    /* @__PURE__ */ e.jsx(je, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (o) => a("description", o.target.value),
        className: Rs
      }
    ) })
  ] });
}
const Ht = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function qe({ label: t, value: s }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: s ?? "—" })
  ] });
}
function Ys({ task: t, creatorName: s, lastModifierName: a }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(qe, { label: "Oluşturan", value: s }),
      /* @__PURE__ */ e.jsx(qe, { label: "Oluşturulma zamanı", value: Ht(t.creationTime) }),
      /* @__PURE__ */ e.jsx(qe, { label: "Güncelleyen", value: a }),
      /* @__PURE__ */ e.jsx(qe, { label: "Son güncelleme zamanı", value: Ht(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(qe, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const _s = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", Us = "border-brand-500 text-text-primary";
function Vs({ tabs: t, activeCode: s, onSelect: a, onOpenPicker: r, pickerOpen: l }) {
  const o = f.useRef(/* @__PURE__ */ new Map()), n = (u) => {
    var m;
    a(u.code), (m = o.current.get(u.code)) == null || m.focus();
  }, i = (u, m) => {
    u.key === "ArrowRight" ? (u.preventDefault(), n(t[(m + 1) % t.length])) : u.key === "ArrowLeft" ? (u.preventDefault(), n(t[(m - 1 + t.length) % t.length])) : u.key === "Home" ? (u.preventDefault(), n(t[0])) : u.key === "End" && (u.preventDefault(), n(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((u, m) => {
      const h = u.code === s;
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
          onClick: () => a(u.code),
          onKeyDown: (p) => i(p, m),
          className: `${_s} ${h ? Us : ""}`,
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
const Os = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Qs({ entries: t, onAdd: s, onRemove: a, busyCode: r }) {
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
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: Os[i] ?? i }),
            u.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa ${m.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: m.title }),
              !m.implemented && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              m.implemented && !m.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === m.code,
                  onClick: () => s(m.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              m.implemented && m.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === m.code,
                  onClick: () => a(m.code),
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
function Hs({ trail: t = [], current: s, onNavigate: a }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((r) => /* @__PURE__ */ e.jsxs(_e.Fragment, { children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => a == null ? void 0 : a(r.id),
          className: "hover:underline hover:text-text-primary",
          children: r.title
        }
      ),
      /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "/" })
    ] }, r.id)),
    /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary", children: s.title })
  ] });
}
function Ws(t) {
  var r, l, o;
  const s = (o = (l = (r = window == null ? void 0 : window.apya) == null ? void 0 : r.platform) == null ? void 0 : l.tasks) == null ? void 0 : o.task;
  if (!s) return Promise.reject(new Error("ABP görev servisi yüklenmedi."));
  const a = s.get(t);
  return Promise.resolve(a).catch((n) => {
    var u;
    const i = (u = a == null ? void 0 : a.jqXHR) == null ? void 0 : u.status;
    throw n && typeof n == "object" && n.status == null && i && (n.status = i), n;
  });
}
function It(t) {
  return J({
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
function de(t) {
  var s, a, r;
  return !!((r = (a = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.auth) == null ? void 0 : a.isGranted) != null && r.call(a, t));
}
const Js = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, Ft = "task";
function Ia() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(Ft);
  return t && Js.test(t) ? t : null;
}
function At() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(Ft), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function Fa(t, s) {
  const a = f.useRef(s);
  a.current = s, f.useEffect(() => {
    if (!t || Ia() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(Ft, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), f.useEffect(() => {
    const r = () => {
      var l;
      (l = a.current) == null || l.call(a);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const Zs = {
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
function Wt(t) {
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
    tagNames: (t.tags ?? []).map((s) => s.name),
    isPrivate: !!t.isPrivate,
    projectId: t.projectId ?? null,
    estimatedHours: t.estimatedHours ?? null,
    taskType: t.taskType ?? "",
    sprint: t.sprint ?? "",
    budgetLineId: t.budgetLineId ?? null,
    plannedAmount: t.plannedAmount ?? null
  } : Zs;
}
const Aa = (t, s) => JSON.stringify(t) === JSON.stringify(s);
function Jt(t, s, a) {
  const r = {};
  for (const l of Object.keys(a)) r[l] = Aa(t[l], s[l]) ? a[l] : t[l];
  return r;
}
function za(t) {
  const [s, a] = f.useState(t == null ? void 0 : t.id), r = f.useMemo(() => Wt(t), [t]), [l, o] = f.useState(r), [n, i] = f.useState(r), [u, m] = f.useState({});
  if ((t == null ? void 0 : t.id) !== s || r !== l && !Aa(r, l)) {
    const y = (t == null ? void 0 : t.id) !== void 0 && t.id === s;
    a(t == null ? void 0 : t.id), o(r), i(y ? Jt(n, l, r) : r), y || m({});
  }
  const h = f.useCallback((y, b) => {
    i((v) => ({ ...v, [y]: b })), m((v) => {
      if (!v[y] && !(y === "startDate" && v.dueDate)) return v;
      const w = { ...v };
      return delete w[y], y === "startDate" && delete w.dueDate, w;
    });
  }, []), p = f.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(r),
    [n, r]
  ), x = f.useCallback(() => {
    const y = {};
    return n.title.trim() || (y.title = xe("Tasks:Detail:Validation:TitleRequired", "Başlık zorunlu.")), n.startDate || (y.startDate = xe("Tasks:Detail:Validation:StartDateRequired", "Başlangıç tarihi zorunlu.")), n.dueDate && n.startDate && n.dueDate < n.startDate && (y.dueDate = xe("Tasks:Detail:Validation:DueBeforeStart", "Son tarih başlangıç tarihinden önce olamaz.")), m(y), Object.keys(y).length === 0;
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
  }, [r]), N = f.useCallback((y, b) => {
    if (!b) return;
    const v = Wt(b);
    i((w) => Jt(w, y, v));
  }, []);
  return { values: n, setField: h, isDirty: p, errors: u, validate: x, toUpdateDto: c, reset: d, commitSaved: N };
}
function Zt(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function Xs() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function La() {
  var l;
  const t = J({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Xs,
    staleTime: 3e5,
    retry: !1
  }), s = ((l = t.data) == null ? void 0 : l.items) ?? [], a = s.map((o) => ({ value: o.id, label: Zt(o) })), r = new Map(s.map((o) => [o.id, Zt(o)]));
  return { options: a, nameById: r, isLoading: t.isLoading };
}
function Dt() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function er(t) {
  const s = Dt();
  return s ? Promise.resolve(s.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ma(t) {
  const s = re(), a = ["task-features", t], r = J({
    queryKey: a,
    queryFn: () => er(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => s.invalidateQueries({ queryKey: a }), o = te({
    mutationFn: (i) => Promise.resolve(Dt().addFeature(t, i)),
    onSuccess: l
  }), n = te({
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
  const s = (l = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.currentUser) == null ? void 0 : l.id, a = !!(s && ((t == null ? void 0 : t.creatorId) === s || (t == null ? void 0 : t.assigneeId) === s)) || de("Platform.Projects.ManageTeam");
  return {
    canManage: a,
    canEdit: a && de("Platform.Tasks.Edit"),
    canChangeStatus: a && de("Platform.Tasks.ChangeStatus"),
    canDelete: a && de("Platform.Tasks.Delete")
  };
}
const Ka = "rounded-2xl border border-subtle bg-surface-base shadow-xs", $e = `${Ka} overflow-hidden`;
function Qe({ title: t, badge: s, action: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3.5 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: t }),
      s
    ] }),
    a
  ] });
}
function Ra({ children: t, tone: s = "positive" }) {
  const a = s === "positive" ? "bg-success-subtle text-success" : "bg-neutral-subtle text-text-secondary";
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-full font-mono text-[11px] font-bold ${a}`, children: t });
}
function Pe({ children: t, bg: s, fg: a }) {
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-[7px] text-[10.5px] font-bold ${s} ${a}`, children: t });
}
function he({ icon: t, title: s, description: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 px-6 py-10 text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-xl text-text-tertiary` }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: s }),
    a && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] leading-[1.55] text-text-tertiary max-w-[420px]", children: a })
  ] });
}
function pt({ name: t, size: s = 24 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: s, width: s, background: We(t), fontSize: s * 0.4 },
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
function qa(t) {
  return t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : "0 KB";
}
function mt(t) {
  const s = Math.max(0, Math.floor(t || 0)), a = Math.floor(s / 3600), r = Math.floor(s % 3600 / 60);
  return !a && !r ? `${s}sn` : a ? r ? `${a}s ${r}dk` : `${a}s` : `${r}dk`;
}
function tr(t) {
  const s = Math.max(0, Math.floor(t || 0)), a = (r) => String(r).padStart(2, "0");
  return `${a(Math.floor(s / 3600))}:${a(Math.floor(s / 60) % 60)}:${a(s % 60)}`;
}
const we = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  image: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  sheet: { icon: "fa-file-excel", bg: "bg-success-subtle", fg: "text-success" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  zip: { icon: "fa-file-zipper", bg: "bg-warning-subtle", fg: "text-warning" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
}, Xt = (t = "") => Ga(t) === we.image;
function Ga(t = "") {
  var a;
  const s = ((a = t.split(".").pop()) == null ? void 0 : a.toLowerCase()) ?? "";
  return s === "pdf" ? we.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(s) ? we.image : ["doc", "docx", "odt", "rtf", "txt"].includes(s) ? we.doc : ["xls", "xlsx", "csv", "ods"].includes(s) ? we.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(s) ? we.code : ["zip", "rar", "7z", "tar", "gz"].includes(s) ? we.zip : we.other;
}
function ar({ taskId: t, task: s, onOpenSubtask: a }) {
  const [r, l] = f.useState(""), [o, n] = f.useState(!1), i = re(), u = (s == null ? void 0 : s.subTasks) ?? [], m = u.filter((c) => c.status === 4).length, h = () => i.invalidateQueries({ queryKey: ["task-detail", t] }), p = async () => {
    const c = r.trim();
    if (c) {
      n(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: c,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: s == null ? void 0 : s.projectId
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
    } catch (N) {
      P(N, "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        u.length > 0 && /* @__PURE__ */ e.jsxs(Ra, { children: [
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
    /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
      u.map((c) => {
        const d = be(c.status), N = c.status === 4, y = Oe(c).canChangeStatus;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => a == null ? void 0 : a(c.id, c.title),
            onKeyDown: (b) => {
              b.key === "Enter" && (a == null || a(c.id, c.title));
            },
            className: "flex items-center gap-3.5 px-4 py-3.5 border-t border-subtle first:border-t-0 hover:bg-surface-raised cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": N ? `${c.title} tamamlandı işaretini kaldır` : `${c.title} tamamlandı işaretle`,
                  onClick: (b) => x(b, c),
                  disabled: !y,
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white ${y ? "cursor-pointer" : "cursor-default"} ${N ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: N && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: c.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${N ? "line-through text-text-tertiary" : "text-text-primary"}`, children: c.title }),
              /* @__PURE__ */ e.jsx(Pe, { bg: d.bg, fg: d.fg, children: d.label }),
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
function Ya() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function sr(t) {
  const s = Ya();
  return s ? Promise.resolve(s.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function rr(t, s) {
  const a = new FormData();
  a.append("file", s);
  const r = {}, l = Ds();
  l && (r.RequestVerificationToken = l);
  const o = await fetch(`/api/tasks/attachments/upload/${t}`, {
    method: "POST",
    credentials: "include",
    headers: r,
    body: a
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
  const s = re(), a = ["task-attachments", t], r = J({
    queryKey: a,
    queryFn: () => sr(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => s.invalidateQueries({ queryKey: a }), o = te({
    mutationFn: (i) => rr(t, i),
    onSuccess: l
  }), n = te({
    mutationFn: (i) => Promise.resolve(Ya().deleteAttachment(i)),
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
function nr({ taskId: t }) {
  const { attachments: s, upload: a, remove: r, isUploading: l } = zt(t), o = re(), n = f.useRef(null), [i, u] = f.useState(!1), m = de("Platform.Tasks.ShareExternally"), h = async (c, d) => {
    try {
      await window.apya.platform.tasks.taskShare.setAttachmentGuestVisibility(c, d), o.invalidateQueries({ queryKey: ["task-attachments", t] });
    } catch (N) {
      P(N, "Görünürlük değiştirilemedi.");
    }
  }, p = async (c) => {
    var d, N, y;
    if (c)
      try {
        await a(c), (y = (N = (d = window == null ? void 0 : window.abp) == null ? void 0 : d.notify) == null ? void 0 : N.success) == null || y.call(N, "Dosya yüklendi.");
      } catch (b) {
        P(b, "Dosya yüklenemedi.");
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
    s.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3", children: s.map((c) => {
      const d = Ga(c.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${d.bg} ${d.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: c.fileName, children: c.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: qa(c.fileSize) })
              ] })
            ] }),
            m && !c.isGuestUpload && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 text-[11px] text-text-tertiary cursor-pointer", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: !!c.isVisibleToGuests,
                  onChange: (N) => h(c.id, N.target.checked)
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
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function ir(t) {
  const s = it();
  return s ? Promise.resolve(s.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Lt(t) {
  const s = re(), a = ["task-checklist", t], r = J({
    queryKey: a,
    queryFn: () => ir(t),
    enabled: !!t,
    staleTime: 3e4,
    /* toggleChecklistItem ters çevirir; bayat gösterim yanlış yöne yazar (proje
       konsolu paneli aynı maddeyi React Query dışından değiştiriyor). */
    meta: { persist: !1 },
    retry: !1
  }), l = () => s.invalidateQueries({ queryKey: a }), o = te({
    mutationFn: (u) => Promise.resolve(it().addChecklistItem(t, u)),
    onSuccess: l
  }), n = te({
    mutationFn: (u) => Promise.resolve(it().toggleChecklistItem(u)),
    onSuccess: l
  }), i = te({
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
function lr({ taskId: t, readOnly: s = !1 }) {
  const { items: a, isLoading: r, addItem: l, toggleItem: o, removeItem: n } = Lt(t), [i, u] = f.useState(""), m = a.filter((x) => x.isDone).length, h = a.length ? Math.round(m / a.length * 100) : 0, p = async () => {
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
          a.length
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
      r && a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 py-2 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
      !r && a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 py-2 text-[12.5px] text-text-tertiary", children: s ? "Henüz madde yok." : "Henüz madde yok. Aşağıdan ilk maddeyi ekleyin." }),
      a.map((x) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            disabled: s,
            "aria-label": x.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
            onClick: () => o(x.id).catch((c) => P(c, "Durum güncellenemedi.")),
            className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${s ? "cursor-default" : "cursor-pointer"} transition-colors duration-fast ${x.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
            children: x.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${x.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: x.text }),
        !s && /* @__PURE__ */ e.jsx(
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
      !s && /* @__PURE__ */ e.jsx(
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
function or({ taskId: t, task: s }) {
  const [a, r] = f.useState(""), [l, o] = f.useState(null), [n, i] = f.useState(""), [u, m] = f.useState(!1), h = re(), p = (s == null ? void 0 : s.comments) ?? [], x = async (d) => {
    var N, y, b;
    if (d == null || d.preventDefault(), !(!a.trim() || u)) {
      m(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, a.trim())
        ), r(""), h.invalidateQueries({ queryKey: ["task-detail", t] }), (b = (y = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : y.success) == null || b.call(y, "Yorum eklendi.");
      } catch (v) {
        P(v, "Yorum eklenemedi.");
      } finally {
        m(!1);
      }
    }
  }, c = async (d) => {
    var N, y, b;
    if (!(!n.trim() || u)) {
      m(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(d, n.trim())
        ), i(""), o(null), h.invalidateQueries({ queryKey: ["task-detail", t] }), (b = (y = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : y.success) == null || b.call(y, "Yanıt eklendi.");
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
          value: a,
          onChange: (d) => r(d.target.value),
          placeholder: "Bir yorum veya güncelleme yazın...",
          className: "w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ e.jsx(
        se,
        {
          type: "submit",
          variant: "primary",
          disabled: !a.trim() || u,
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
        se,
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
          /* @__PURE__ */ e.jsx(se, { variant: "ghost", size: "sm", onClick: () => o(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(se, { variant: "primary", size: "sm", disabled: !n.trim() || u, onClick: () => c(d.id), children: "Gönder" })
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
  var t, s, a;
  return ((a = (s = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : s.tasks) == null ? void 0 : a.taskShare) ?? null;
}
function cr(t) {
  const s = re(), a = ["task-share-links", t], r = J({
    queryKey: a,
    queryFn: () => {
      const i = ft();
      return i ? Promise.resolve(i.getList(t)) : Promise.reject(new Error("Paylaşım servisi yüklenmedi."));
    },
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => s.invalidateQueries({ queryKey: a }), o = te({
    mutationFn: (i) => Promise.resolve(ft().create({ ...i, taskId: t })),
    onSuccess: l
  }), n = te({
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
const ea = {
  recipientName: "",
  recipientEmail: "",
  lifetimeDays: 14,
  allowComment: !0,
  allowUpload: !0,
  allowDownload: !0
};
function dr(t) {
  return t ? new Date(t).toLocaleDateString("tr-TR") : "—";
}
function xr({ taskId: t }) {
  const { links: s, isPending: a, create: r, revoke: l, isCreating: o } = cr(t), [n, i] = f.useState(ea), [u, m] = f.useState(null);
  if (!de("Platform.Tasks.ShareExternally"))
    return /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Görevi ekip dışıyla paylaşma yetkiniz yok." });
  const p = (y) => (b) => {
    const v = b.target.type === "checkbox" ? b.target.checked : b.target.value;
    i((w) => ({ ...w, [y]: v }));
  }, x = async (y) => {
    if (y.preventDefault(), !!n.recipientName.trim())
      try {
        const b = await r({
          ...n,
          recipientName: n.recipientName.trim(),
          // QA-41: boş e-posta "yok" demektir; "" gönderilirse sunucu doğrulaması reddeder.
          recipientEmail: n.recipientEmail.trim() || null,
          lifetimeDays: Number(n.lifetimeDays) || 14
        });
        m(b), i(ea);
      } catch (b) {
        P(b, "Paylaşım linki üretilemedi.");
      }
  }, c = (y) => `${window.location.origin}${y}`, d = (y) => {
    var b, v, w, D;
    (b = navigator.clipboard) == null || b.writeText(c(y)), (D = (w = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : w.info) == null || D.call(w, "Bağlantı kopyalandı.");
  }, N = async (y) => {
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
    a ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : s.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görev henüz kimseyle paylaşılmadı." }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: s.map((y) => /* @__PURE__ */ e.jsxs(
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
              y.isActive ? `${dr(y.expiresAt)} tarihine kadar geçerli` : y.revokedAt ? "İptal edildi" : "Süresi doldu",
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
              onClick: () => N(y.id),
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
function ur({ task: t }) {
  var a;
  const s = [];
  return t != null && t.creationTime && s.push({
    id: "created",
    icon: "fa-plus",
    bg: "bg-success-subtle",
    fg: "text-success",
    actor: t.creatorUserName || t.creatorName || "Sistem / Kullanıcı",
    event: "görevi oluşturdu",
    time: ct(t.creationTime)
  }), t != null && t.lastModificationTime && s.push({
    id: "modified",
    icon: "fa-pen",
    bg: "bg-warning-subtle",
    fg: "text-warning",
    actor: t.lastModifierUserName || t.lastModifierName || "Kullanıcı",
    event: "görevi güncelledi",
    time: ct(t.lastModificationTime)
  }), (a = t == null ? void 0 : t.attachments) != null && a.length && s.push({
    id: "files",
    icon: "fa-paperclip",
    bg: "bg-primary-subtle",
    fg: "text-primary",
    actor: "Sistem",
    event: `${t.attachments.length} dosya eki mevcut`,
    time: ""
  }), /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx("h4", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Aktivite Zaman Çizelgesi" }),
    s.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Aktivite kaydı bulunamadı." }) }) : /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: s.map((r, l) => {
      const o = l === s.length - 1;
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
function pr({ label: t, value: s, hint: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4 px-3.5 py-3", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[12.5px] font-semibold text-text-secondary", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 text-right", children: [
      /* @__PURE__ */ e.jsx("span", { className: "block text-[12.5px] font-bold text-text-primary break-words", children: s ?? "—" }),
      a && /* @__PURE__ */ e.jsx("span", { className: "block text-[11px] text-text-tertiary", children: a })
    ] })
  ] });
}
function mr({ task: t = {}, nameById: s }) {
  const a = (l) => {
    var o;
    return l && ((o = s == null ? void 0 : s.get) == null ? void 0 : o.call(s, l)) || null;
  }, r = [
    { label: "Görev kodu", value: t.code || "—" },
    {
      label: "Oluşturulma",
      value: Ae(t.creationTime),
      hint: a(t.creatorId) ? `${a(t.creatorId)} tarafından` : null
    },
    {
      label: "Son güncelleme",
      value: Ae(t.lastModificationTime) ?? "Henüz güncellenmedi",
      hint: a(t.lastModifierId) ? `${a(t.lastModifierId)} tarafından` : null
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
      /* @__PURE__ */ e.jsx("div", { className: "divide-y divide-subtle", children: r.map((l) => /* @__PURE__ */ e.jsx(pr, { ...l }, l.label)) })
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11.5px] text-text-tertiary", children: "Alan bazında değişiklik günlüğü (hangi alan, eski/yeni değer) henüz yayınlanmadı." })
  ] });
}
function fr(t) {
  var a, r, l;
  const s = (l = (r = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : r.projectBudgets) == null ? void 0 : l.projectBudget;
  return s != null && s.getRecordFormLookup ? Promise.resolve(s.getRecordFormLookup(t)) : Promise.reject(new Error("Bütçe servisi yüklenmedi."));
}
function br(t) {
  var l;
  const s = de("Platform.Projects.ViewBudget"), a = J({
    queryKey: ["task-detail", "budget-lines", t],
    queryFn: () => fr(t),
    enabled: !!t && s,
    staleTime: 6e4,
    retry: !1
  }), r = ((l = a.data) == null ? void 0 : l.lines) ?? [];
  return {
    lines: r,
    options: r.map((o) => ({ value: o.id, label: o.code ? `${o.code} · ${o.name}` : o.name })),
    canViewBudget: s,
    isLoading: a.isLoading
  };
}
function dt(t) {
  var a, r;
  const s = (r = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.ajax) == null ? void 0 : r.call(a, t);
  return s ? new Promise((l, o) => {
    s.done(l).fail(o);
  }) : Promise.reject(new Error("ABP köprüsü yüklenmedi."));
}
function xt(t, s = {}) {
  var l;
  const a = ((l = window == null ? void 0 : window.abp) == null ? void 0 : l.appPath) ?? "/", r = new URLSearchParams({ handler: t });
  return Object.entries(s).forEach(([o, n]) => {
    n != null && n !== "" && r.append(o, n);
  }), `${a}Documents/Matching?${r.toString()}`;
}
const _a = () => de("Platform.Documents"), hr = () => de("Platform.Documents.ManageMeta");
function yr(t) {
  const s = !!t && _a(), a = J({
    queryKey: ["task-detail", "expense-matches", t],
    queryFn: () => dt({ url: xt("Matches", { projectId: t }), type: "GET" }),
    enabled: s,
    staleTime: 6e4,
    meta: { persist: !1 },
    retry: !1
  }), r = /* @__PURE__ */ new Map();
  return (a.data ?? []).forEach((l) => {
    r.has(l.expenseId) || r.set(l.expenseId, []), r.get(l.expenseId).push(l);
  }), { byExpense: r, enabled: s, isLoading: a.isLoading };
}
function gr(t, s) {
  const a = J({
    queryKey: ["task-detail", "expense-candidates", t],
    queryFn: () => dt({ url: xt("Candidates", { expenseId: t }), type: "GET" }),
    enabled: !!t && s && _a(),
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  });
  return { candidates: a.data ?? [], isLoading: a.isLoading };
}
function vr(t) {
  const s = re(), a = (o) => {
    s.invalidateQueries({ queryKey: ["task-detail", "expense-matches", t] }), s.invalidateQueries({ queryKey: ["task-detail", "expense-candidates", o] });
  }, r = te({
    mutationFn: ({ documentFileId: o, expenseId: n, score: i }) => dt({
      url: xt("CreateMatch"),
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ documentFileId: o, expenseId: n, score: i ?? 0 })
    }),
    onSuccess: (o, n) => a(n.expenseId)
  }), l = te({
    mutationFn: ({ matchId: o }) => dt({ url: xt("RemoveMatch", { matchId: o }), type: "POST" }),
    onSuccess: (o, n) => a(n.expenseId)
  });
  return { link: r, unlink: l, isBusy: r.isPending || l.isPending };
}
function jr(t) {
  return t == null ? "—" : new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 2 }).format(t);
}
function Nr({ expenseId: t, projectId: s, matches: a }) {
  const { candidates: r, isLoading: l } = gr(t, !0), { link: o, unlink: n, isBusy: i } = vr(s), u = hr(), m = new Set(a.map((p) => p.documentFileId)), h = r.filter((p) => !m.has(p.documentFileId));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3 px-4 pb-3.5 pt-1 bg-surface-raised", children: [
    a.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Bağlı evraklar" }),
      a.map((p) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-[11px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12px] text-text-primary", children: p.documentFileName }),
        p.annexNumber && /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary", children: [
          "EK-",
          p.annexNumber
        ] }),
        u && /* @__PURE__ */ e.jsx(
          se,
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
          jr(p.amount),
          " · ",
          Me(p.documentDate)
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: `shrink-0 font-mono text-[11px] font-bold ${p.isStrong ? "text-success" : "text-text-tertiary"}`, children: [
          "%",
          p.score
        ] }),
        u && /* @__PURE__ */ e.jsx(
          se,
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
function ge(t, s) {
  const a = s || "TRY";
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: a, minimumFractionDigits: 2 }).format(t || 0);
  } catch {
    return `${(t || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${a}`.trim();
  }
}
const wr = ["pointerdown", "focusin", "wheel", "touchmove"], kr = (t) => t.stopPropagation();
function Cr(t, s, a, r) {
  var u, m, h, p, x, c, d;
  const l = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.ModalManager;
  if (!l) {
    (p = (h = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : h.error) == null || p.call(h, "Kayıt formu yüklenemedi."), r == null || r();
    return;
  }
  const o = ((x = window == null ? void 0 : window.abp) == null ? void 0 : x.appPath) ?? "/";
  (d = (c = document.activeElement) == null ? void 0 : c.blur) == null || d.call(c);
  const n = new l({ viewUrl: `${o}${t}?TaskId=${s}` });
  n.onResult(() => a == null ? void 0 : a()), n.onOpen(() => r == null ? void 0 : r()), n.open();
  const i = document.getElementById(n.getModalId());
  i && (i.setAttribute("data-apya-overlay", "abp-modal"), i.style.pointerEvents = "auto", wr.forEach((N) => i.addEventListener(N, kr, { passive: !0 }))), setTimeout(() => r == null ? void 0 : r(), 1e4);
}
function Dr({ taskId: t }) {
  const s = re(), [a, r] = f.useState(null), l = de("Platform.Expenses.Create"), o = de("Platform.Incomes.Create"), n = de("Platform.Invoices.Create");
  if (!t || !l && !o && !n)
    return null;
  const i = () => s.invalidateQueries({ queryKey: ["task-detail", t] }), u = (m) => {
    a || (r(m), Cr(m, t, i, () => r((h) => h === m ? null : h)));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
    l && /* @__PURE__ */ e.jsxs(
      se,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        isLoading: a === "Expenses/CreateModal",
        disabled: !!a,
        onClick: () => u("Expenses/CreateModal"),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-up text-[11px]" }),
          "Gider ekle"
        ]
      }
    ),
    o && /* @__PURE__ */ e.jsxs(
      se,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        isLoading: a === "Incomes/CreateModal",
        disabled: !!a,
        onClick: () => u("Incomes/CreateModal"),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-down text-[11px]" }),
          "Gelir ekle"
        ]
      }
    ),
    n && /* @__PURE__ */ e.jsxs(
      se,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        isLoading: a === "Invoices/CreateModal",
        disabled: !!a,
        onClick: () => u("Invoices/CreateModal"),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-invoice text-[11px]" }),
          "Fatura ekle"
        ]
      }
    )
  ] });
}
const ta = {
  0: { label: "Taslak", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  1: { label: "Gönderildi", bg: "bg-primary-subtle", fg: "text-primary" },
  2: { label: "Ödendi", bg: "bg-success-subtle", fg: "text-success" },
  3: { label: "İptal", bg: "bg-neutral-subtle", fg: "text-text-tertiary" },
  4: { label: "Gecikti", bg: "bg-negative-subtle", fg: "text-negative" }
};
function Tr({ invoices: t, action: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
    /* @__PURE__ */ e.jsx(Qe, { title: "Faturalar", action: s }),
    t.map((a) => {
      const r = ta[a.status] ?? ta[0];
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-7 w-7 rounded-lg bg-neutral-subtle text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-invoice text-[11px]" }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "flex-1 min-w-0 truncate text-[12.5px] font-semibold text-text-primary", children: [
              a.invoiceNumber || "Fatura",
              /* @__PURE__ */ e.jsx("span", { className: "ml-2 font-normal text-text-tertiary", children: a.direction === 1 ? "Alış" : "Satış" })
            ] }),
            /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
              "vade ",
              Me(a.dueDate)
            ] }),
            /* @__PURE__ */ e.jsx(Pe, { bg: r.bg, fg: r.fg, children: r.label }),
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary",
                style: { fontVariantNumeric: "tabular-nums" },
                children: ge(a.totalAmount, a.currency)
              }
            )
          ]
        },
        a.id
      );
    })
  ] });
}
function Sr({ line: t, projectId: s, matches: a, docsEnabled: r }) {
  const [l, o] = f.useState(!1), n = t.kind === "income";
  return /* @__PURE__ */ e.jsxs("div", { className: "border-t border-subtle first:border-t-0", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5 px-4 py-3 hover:bg-surface-raised", children: [
      /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-7 w-7 rounded-lg bg-neutral-subtle text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n ? "fa-arrow-down" : "fa-arrow-up"} text-[11px]` }) }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] font-semibold text-text-primary", children: t.title || (n ? "Gelir" : "Gider") }),
      r && /* @__PURE__ */ e.jsxs(
        se,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          "aria-expanded": l,
          onClick: () => o((i) => !i),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-[11px]" }),
            a.length > 0 ? `Evrak ${a.length}` : "Evrak"
          ]
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: Me(t.date) }),
      n ? /* @__PURE__ */ e.jsx(Pe, { bg: "bg-success-subtle", fg: "text-success", children: "Gelir" }) : /* @__PURE__ */ e.jsx(Pe, { bg: "bg-warning-subtle", fg: "text-warning", children: "Gider" }),
      /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: `shrink-0 font-mono text-[12.5px] font-bold ${n ? "text-success" : "text-text-primary"}`,
          style: { fontVariantNumeric: "tabular-nums" },
          children: [
            n ? "+" : "−",
            ge(t.amount, t.currency)
          ]
        }
      )
    ] }),
    r && l && /* @__PURE__ */ e.jsx(Nr, { expenseId: t.id, projectId: s, matches: a })
  ] });
}
function bt({ label: t, value: s, tone: a, note: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: `font-mono text-[22px] font-bold tracking-[-.02em] ${a}`, style: { fontVariantNumeric: "tabular-nums" }, children: s }),
    r && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
  ] });
}
function $r({ options: t, isLoading: s, lineId: a, planned: r, onField: l }) {
  return s ? null : t.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12px] text-text-tertiary", children: "Bu projede bütçe kalemi tanımlı değil — kalemler Finans & Bütçe ekranından açılır." }) : /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Bütçe kalemi" }),
      /* @__PURE__ */ e.jsx(
        Da,
        {
          options: t,
          value: a ?? void 0,
          onChange: (o) => l("budgetLineId", o ?? null),
          placeholder: "Kalem seç",
          size: "sm"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Görev bütçesi" }),
      /* @__PURE__ */ e.jsx(
        ws,
        {
          value: r,
          onValueChange: (o) => l("plannedAmount", o),
          currency: "TRY",
          min: 0,
          size: "sm",
          disabled: !a
        }
      )
    ] })
  ] });
}
function Pr({ task: t, form: s, spentByCurrency: a, readOnly: r }) {
  const l = (s ? s.values.projectId : t == null ? void 0 : t.projectId) ?? null, { options: o, lines: n, canViewBudget: i, isLoading: u } = br(l), m = !!s && !r && i && !!l, h = (s ? s.values.budgetLineId : t == null ? void 0 : t.budgetLineId) ?? null, p = (s ? s.values.plannedAmount : t == null ? void 0 : t.plannedAmount) ?? null;
  if (!m && (!h || p == null))
    return null;
  const x = n.find((D) => D.id === h), c = x ? x.remainingAmount : t == null ? void 0 : t.budgetLineRemaining, d = a, N = !!h && p != null, y = (p ?? 0) - d, b = p > 0 ? Math.round(d / p * 100) : 0, v = y < 0, w = () => {
    s.setField("budgetLineId", null), s.setField("plannedAmount", null);
  };
  return (
    /* Kırpmayan kart ŞART: kalem seçicisinin listesi kartın içine absolute
       konumlanır, TAB_CARD'ın overflow-hidden'ı onu alt kenarda keserdi. */
    /* @__PURE__ */ e.jsxs("div", { className: Ka, children: [
      /* @__PURE__ */ e.jsx(
        Qe,
        {
          title: "Bütçe bağı",
          action: m && h ? /* @__PURE__ */ e.jsx(se, { type: "button", variant: "ghost", size: "sm", onClick: w, children: "Bağı kaldır" }) : null
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "px-4 pb-4 pt-1 flex flex-col gap-3", children: [
        m ? /* @__PURE__ */ e.jsx(
          $r,
          {
            options: o,
            isLoading: u,
            lineId: h,
            planned: p,
            onField: s.setField
          }
        ) : /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-semibold text-accent", children: t.budgetLineName || "Bütçe kalemi" }) }),
        c != null && /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "kalemde kalan ",
          ge(c, "TRY")
        ] }),
        N && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3", children: [
            /* @__PURE__ */ e.jsx(ht, { label: "Görev bütçesi", value: ge(p, "TRY") }),
            /* @__PURE__ */ e.jsx(ht, { label: "Gerçekleşen", value: ge(d, "TRY") }),
            /* @__PURE__ */ e.jsx(
              ht,
              {
                label: "Kalan",
                value: ge(y, "TRY"),
                tone: v ? "text-negative" : "text-success"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
              "div",
              {
                className: `h-full rounded-full ${v ? "bg-negative" : b >= 80 ? "bg-warning" : "bg-success"}`,
                style: { width: `${Math.min(Math.max(b, 0), 100)}%` }
              }
            ) }),
            /* @__PURE__ */ e.jsxs("div", { className: "mt-1 text-[11.5px] text-text-tertiary", children: [
              "%",
              b,
              v && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative", children: "· görev bütçesi aşıldı" })
            ] })
          ] })
        ] })
      ] })
    ] })
  );
}
function ht({ label: t, value: s, tone: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx(
      "span",
      {
        className: `font-mono text-[15px] font-bold ${a || "text-text-primary"}`,
        style: { fontVariantNumeric: "tabular-nums" },
        children: s
      }
    )
  ] });
}
function Er({ task: t, taskId: s, form: a, readOnly: r = !1 }) {
  const l = (t == null ? void 0 : t.expenses) || [], o = (t == null ? void 0 : t.incomes) || [], n = (t == null ? void 0 : t.invoices) || [], i = (a ? a.values.projectId : t == null ? void 0 : t.projectId) ?? null, { byExpense: u, enabled: m } = yr(i), h = l.filter((y) => (y.currency || "TRY") === "TRY").reduce((y, b) => y + (b.amount || 0), 0), p = /* @__PURE__ */ e.jsx(Pr, { task: t, form: a, spentByCurrency: h, readOnly: r }), x = /* @__PURE__ */ e.jsx(Dr, { taskId: s ?? (t == null ? void 0 : t.id) });
  if (l.length === 0 && o.length === 0 && n.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      p,
      /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
        /* @__PURE__ */ e.jsx(Qe, { title: "Görev Finansı", action: x }),
        /* @__PURE__ */ e.jsx(
          he,
          {
            icon: "fa-coins",
            title: "Kayıt yok",
            description: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
          }
        )
      ] })
    ] });
  const d = Array.from(new Set([...l, ...o].map((y) => y.currency || "TRY"))).map((y) => {
    const b = o.filter((w) => (w.currency || "TRY") === y).reduce((w, D) => w + (D.amount || 0), 0), v = l.filter((w) => (w.currency || "TRY") === y).reduce((w, D) => w + (D.amount || 0), 0);
    return { cur: y, inc: b, exp: v, net: b - v };
  }), N = [
    ...o.map((y) => ({ ...y, kind: "income" })),
    ...l.map((y) => ({ ...y, kind: "expense" }))
  ].sort((y, b) => new Date(b.date || 0) - new Date(y.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    p,
    d.map(({ cur: y, inc: b, exp: v, net: w }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(bt, { label: `Toplam Gelir (${y})`, value: ge(b, y), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(bt, { label: `Toplam Gider (${y})`, value: ge(v, y), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        bt,
        {
          label: `Net Bakiye (${y})`,
          value: ge(w, y),
          tone: w >= 0 ? "text-success" : "text-negative",
          note: w >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, y)),
    n.length > 0 && /* @__PURE__ */ e.jsx(Tr, { invoices: n, action: N.length === 0 ? x : null }),
    N.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
      /* @__PURE__ */ e.jsx(Qe, { title: "Finans kalemleri", action: x }),
      N.map((y) => /* @__PURE__ */ e.jsx(
        Sr,
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
function Br({ taskId: t }) {
  const { attachments: s, isLoading: a, upload: r, remove: l, isUploading: o } = zt(t), n = f.useRef(null), [i, u] = f.useState(!1), m = s.filter((x) => Xt(x.fileName)), h = async (x) => {
    var c, d, N, y, b, v;
    if (x) {
      if (!Xt(x.name)) {
        (N = (d = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : d.error) == null || N.call(d, "Galeriye yalnız görsel dosya yüklenebilir.");
        return;
      }
      try {
        await r(x), (v = (b = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : b.success) == null || v.call(b, "Görsel yüklendi.");
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
          return h((c = x.target.files) == null ? void 0 : c[0]);
        },
        disabled: o
      }
    ),
    a && m.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !a && m.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görevde henüz görsel yok. Yüklediğiniz görseller Dosyalar sekmesinde de görünür." }),
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
              /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: qa(x.fileSize) })
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
const Ir = [
  { key: "title", label: "Başlık", align: "left" },
  { key: "status", label: "Durum", align: "left" },
  { key: "priority", label: "Öncelik", align: "left" },
  { key: "assignee", label: "Atanan", align: "left" },
  { key: "dueDate", label: "Termin", align: "right" }
];
function aa(t, s) {
  switch (s) {
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
function Fr(t, s, a, r) {
  const l = aa(t, a), o = aa(s, a), n = l === null || l === "", i = o === null || o === "";
  return n && i ? 0 : n ? 1 : i ? -1 : l === o ? 0 : (l < o ? -1 : 1) * (r === "asc" ? 1 : -1);
}
function Ar({ task: t = {}, onOpenSubtask: s }) {
  const [a, r] = f.useState({ key: "dueDate", dir: "asc" }), l = (t == null ? void 0 : t.subTasks) ?? [], o = f.useMemo(
    () => [...l].sort((i, u) => Fr(i, u, a.key, a.dir)),
    [l, a.key, a.dir]
  ), n = (i) => r((u) => u.key === i ? { key: i, dir: u.dir === "asc" ? "desc" : "asc" } : { key: i, dir: "asc" });
  return l.length === 0 ? /* @__PURE__ */ e.jsx(
    he,
    {
      icon: "fa-table",
      title: "Alt görev yok",
      description: "Alt Görevler sekmesinden ekledikleriniz burada tablo olarak listelenir."
    }
  ) : /* @__PURE__ */ e.jsx("div", { className: `${$e} overflow-x-auto`, children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse text-[12.5px]", children: [
    /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsx("tr", { className: "bg-surface-raised", children: Ir.map((i) => {
      const u = a.key === i.key;
      return /* @__PURE__ */ e.jsx(
        "th",
        {
          scope: "col",
          "aria-sort": u ? a.dir === "asc" ? "ascending" : "descending" : "none",
          className: `px-3.5 py-2.5 border-b border-subtle font-bold text-text-secondary whitespace-nowrap ${i.align === "right" ? "text-right" : "text-left"}`,
          children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => n(i.key),
              className: `inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer font-bold ${u ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`,
              children: [
                i.label,
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid text-[9px] ${u ? a.dir === "asc" ? "fa-arrow-up-short-wide" : "fa-arrow-down-wide-short" : "fa-sort opacity-40"}` })
              ]
            }
          )
        },
        i.key
      );
    }) }) }),
    /* @__PURE__ */ e.jsx("tbody", { children: o.map((i) => {
      const u = be(i.status), m = ut(i.priority), h = Sa(i.dueDate);
      return /* @__PURE__ */ e.jsxs(
        "tr",
        {
          onClick: () => s == null ? void 0 : s(i.id),
          className: "border-b border-subtle last:border-b-0 cursor-pointer hover:bg-surface-raised",
          children: [
            /* @__PURE__ */ e.jsxs("td", { className: "px-3.5 py-2.5 max-w-[320px]", children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: (p) => {
                    p.stopPropagation(), s == null || s(i.id);
                  },
                  title: i.title,
                  className: `block w-full truncate bg-transparent border-0 p-0 text-left font-semibold cursor-pointer ${i.status === 4 ? "line-through text-text-tertiary" : "text-text-primary"}`,
                  children: i.title
                }
              ),
              i.code && /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: i.code })
            ] }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(Pe, { bg: u.bg, fg: u.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-[9px] mr-1` }),
              u.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(Pe, { bg: m.bg, fg: m.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${m.icon} text-[9px] mr-1` }),
              m.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: i.assigneeName ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ e.jsx(pt, { name: i.assigneeName, size: 22 }),
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
function zr({ taskId: t, task: s = {}, onOpenSubtask: a }) {
  const r = re(), l = (s == null ? void 0 : s.subTasks) ?? [], [o, n] = f.useState(null), [i, u] = f.useState(null), m = async (h, p) => {
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
    he,
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 items-start", children: Ot.map((h) => {
      const p = be(h), x = l.filter((d) => d.status === h), c = o === h;
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
            const N = (y = d.dataTransfer) == null ? void 0 : y.getData("text/plain");
            N && m(N, h);
          },
          className: `flex flex-col gap-2 p-2.5 rounded-2xl border bg-surface-raised min-h-[120px] transition-colors duration-fast ${c ? "border-focus bg-primary-subtle" : "border-subtle"}`,
          children: [
            /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-2 px-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${p.dot}` }),
              /* @__PURE__ */ e.jsx("h3", { className: "m-0 flex-1 text-[12px] font-bold text-text-primary", children: p.label }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: x.length })
            ] }),
            x.map((d) => {
              const N = ut(d.priority), y = Oe(d).canChangeStatus;
              return /* @__PURE__ */ e.jsxs(
                "article",
                {
                  draggable: y,
                  onDragStart: (b) => {
                    var v;
                    return (v = b.dataTransfer) == null ? void 0 : v.setData("text/plain", d.id);
                  },
                  role: "button",
                  tabIndex: 0,
                  onClick: () => a == null ? void 0 : a(d.id),
                  onKeyDown: (b) => {
                    b.key === "Enter" && (a == null || a(d.id));
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
                          onClick: (b) => b.stopPropagation(),
                          onChange: (b) => m(d.id, Number(b.target.value)),
                          disabled: !y,
                          className: `h-[24px] px-1.5 rounded-[6px] border border-subtle bg-surface-base text-[10.5px] text-text-secondary ${y ? "cursor-pointer" : "cursor-default"}`,
                          children: Ot.map((b) => /* @__PURE__ */ e.jsx("option", { value: b, children: be(b).label }, b))
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
const Lr = [
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
], Mr = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], sa = (t) => String(t).padStart(2, "0"), Ua = (t, s, a) => `${t}-${sa(s + 1)}-${sa(a)}`;
function Tt(t) {
  if (!t) return null;
  const s = /^(\d{4}-\d{2}-\d{2})/.exec(String(t));
  return s ? s[1] : null;
}
function Kr(t, s) {
  const r = (new Date(t, s, 1).getDay() + 6) % 7, l = new Date(t, s + 1, 0).getDate(), o = [];
  for (let n = 0; n < 42; n++) {
    const i = n - r + 1;
    o.push(i >= 1 && i <= l ? { key: Ua(t, s, i), day: i, inMonth: !0 } : { key: `bos-${n}`, day: null, inMonth: !1 });
  }
  return o;
}
function Rr(t) {
  const s = /* @__PURE__ */ new Map(), a = (r, l) => {
    const o = Tt(r);
    o && (s.has(o) || s.set(o, []), s.get(o).push(l));
  };
  a(t == null ? void 0 : t.startDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "start", isSelf: !0, status: t == null ? void 0 : t.status }), a(t == null ? void 0 : t.dueDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "due", isSelf: !0, status: t == null ? void 0 : t.status });
  for (const r of (t == null ? void 0 : t.subTasks) ?? [])
    a(r.startDate, { id: r.id, title: r.title, kind: "start", isSelf: !1, status: r.status }), a(r.dueDate, { id: r.id, title: r.title, kind: "due", isSelf: !1, status: r.status });
  return s;
}
function qr({ task: t = {}, onOpenSubtask: s }) {
  const a = f.useMemo(() => Rr(t), [t]), [r, l] = f.useState(() => {
    const m = Tt(t == null ? void 0 : t.startDate) ?? Tt(t == null ? void 0 : t.dueDate);
    if (m) {
      const [p, x] = m.split("-").map(Number);
      return { year: p, month: x - 1 };
    }
    const h = /* @__PURE__ */ new Date();
    return { year: h.getFullYear(), month: h.getMonth() };
  }), o = f.useMemo(() => Kr(r.year, r.month), [r.year, r.month]), n = (m) => l(({ year: h, month: p }) => {
    const x = p + m;
    return { year: h + Math.floor(x / 12), month: (x % 12 + 12) % 12 };
  }), i = /* @__PURE__ */ new Date(), u = Ua(i.getFullYear(), i.getMonth(), i.getDate());
  return a.size === 0 ? /* @__PURE__ */ e.jsx(
    he,
    {
      icon: "fa-calendar",
      title: "Takvimde gösterilecek tarih yok",
      description: "Göreve başlangıç veya termin tarihi girildiğinde burada aylık takvimde görünür."
    }
  ) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-3.5 py-3 border-b border-subtle bg-surface-raised", children: [
      /* @__PURE__ */ e.jsxs("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: [
        Lr[r.month],
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-subtle bg-surface-raised", children: Mr.map((m) => /* @__PURE__ */ e.jsx("span", { className: "px-2 py-1.5 text-center text-[11px] font-bold text-text-tertiary", children: m }, m)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: o.map((m) => {
      const h = m.inMonth ? a.get(m.key) ?? [] : [], p = m.key === u;
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: `flex flex-col gap-1 min-h-[76px] p-1.5 border-r border-b border-subtle last-of-type:border-r-0 ${m.inMonth ? "" : "bg-surface-sunken"}`,
          children: [
            m.inMonth && /* @__PURE__ */ e.jsx("span", { className: `self-end font-mono text-[11px] font-bold ${p ? "flex items-center justify-center h-[18px] w-[18px] rounded-full bg-primary text-white" : "text-text-tertiary"}`, children: m.day }),
            h.map((x, c) => {
              const d = be(x.status);
              return /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  title: `${x.title} — ${x.kind === "due" ? "termin" : "başlangıç"}`,
                  onClick: () => {
                    x.isSelf || s == null || s(x.id);
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
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Gr(t) {
  const s = Ve();
  return s ? Promise.resolve(s.getDocuments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Yr(t) {
  const s = re(), a = ["task-documents", t], r = J({
    queryKey: a,
    queryFn: () => Gr(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => s.invalidateQueries({ queryKey: a }), o = te({
    mutationFn: (u) => Promise.resolve(Ve().createDocument(t, u)),
    onSuccess: l
  }), n = te({
    mutationFn: ({ id: u, title: m, content: h }) => Promise.resolve(Ve().updateDocument(u, { title: m, content: h })),
    onSuccess: (u) => {
      l(), u != null && u.id && s.setQueryData(["task-document", u.id], u);
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
function _r(t) {
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
function Ur({ taskId: t }) {
  const { documents: s, isLoading: a, createDocument: r, updateDocument: l, removeDocument: o, isSaving: n } = Yr(t), [i, u] = f.useState(null), [m, h] = f.useState(""), [p, x] = f.useState(""), [c, d] = f.useState(!1), [N, y] = f.useState(!1), { data: b, isFetching: v } = _r(i);
  f.useEffect(() => {
    !b || b.id !== i || (h(b.title ?? ""), x(b.content ?? ""), d(!1));
  }, [b == null ? void 0 : b.id]);
  const w = async () => {
    try {
      const E = await r("Yeni belge");
      E != null && E.id && u(E.id);
    } catch (E) {
      P(E, "Belge oluşturulamadı.");
    }
  }, D = async () => {
    var O, Y, q, F, M, U;
    const E = m.trim();
    if (!E)
      return (q = (Y = (O = window == null ? void 0 : window.abp) == null ? void 0 : O.notify) == null ? void 0 : Y.error) == null || q.call(Y, "Belge başlığı boş olamaz."), !1;
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
            h(E.target.value), d(!0);
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
    v && !b ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Belge yükleniyor…" }) : /* @__PURE__ */ e.jsx(
      $a,
      {
        value: p,
        ariaLabel: "Belge içeriği",
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
        onStay: () => y(!1),
        onDiscard: () => {
          y(!1), d(!1), u(null);
        },
        onSave: async () => {
          const E = await D();
          y(!1), E && u(null);
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
    a && s.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !a && s.length === 0 && /* @__PURE__ */ e.jsx(
      he,
      {
        icon: "fa-file-lines",
        title: "Henüz belge yok",
        description: "Toplantı notu, teknik şartname ya da teslim tutanağı gibi metinleri buraya yazabilirsiniz."
      }
    ),
    s.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: s.map((E) => /* @__PURE__ */ e.jsxs(
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
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Vr(t) {
  const s = Le();
  return s ? Promise.resolve(s.getLinkedForms(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Or(t) {
  const s = re(), a = ["task-forms", t], r = J({
    queryKey: a,
    queryFn: () => Vr(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => s.invalidateQueries({ queryKey: a }), o = te({
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
function Qr(t, s) {
  return J({
    queryKey: ["task-form-options", t],
    queryFn: () => Promise.resolve(Le().getFormOptions(t)),
    enabled: !!t && !!s,
    meta: { persist: !1 },
    retry: !1
  });
}
function Hr(t, s) {
  return J({
    queryKey: ["task-form-responses", t, s],
    queryFn: () => Promise.resolve(Le().getFormResponses(t, s)),
    enabled: !!t && !!s,
    meta: { persist: !1 },
    retry: !1
  });
}
function Wr({ taskId: t, documentId: s }) {
  const { data: a, isLoading: r } = Hr(t, s);
  return r ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Yanıtlar yükleniyor…" }) : a != null && a.length ? /* @__PURE__ */ e.jsx("ul", { className: "m-0 list-none p-0", children: a.map((l) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-3 px-3.5 py-2 border-t border-subtle", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l.isGuestSubmission ? "fa-user-clock" : "fa-user"} text-[10px] text-text-tertiary` }),
      /* @__PURE__ */ e.jsx("span", { className: "truncate text-[12.5px] text-text-primary", children: l.respondentName }),
      l.isGuestSubmission && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: "· dış" })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary", children: ct(l.creationTime) })
  ] }, l.id)) }) : /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Bu görevde henüz yanıt yok." });
}
function Jr({ taskId: t }) {
  const { forms: s, isLoading: a, linkForm: r, unlinkForm: l, setGuestFillable: o, isLinking: n } = Or(t), [i, u] = f.useState(!1), [m, h] = f.useState(null), { data: p, isLoading: x } = Qr(t, i), c = de("Platform.Tasks.ShareExternally"), d = async (b) => {
    try {
      await r(b), u(!1);
    } catch (v) {
      P(v, "Form bağlanamadı.");
    }
  }, N = async (b) => {
    if (window.confirm(`“${b.title}” bağlantısı kaldırılsın mı? Form ve toplanmış yanıtlar silinmez.`))
      try {
        await l(b.id);
      } catch (v) {
        P(v, "Bağlantı kaldırılamadı.");
      }
  }, y = async (b, v) => {
    try {
      await o({ linkId: b.id, value: v });
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
    a && s.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !a && s.length === 0 && !i && /* @__PURE__ */ e.jsx(
      he,
      {
        icon: "fa-clipboard-list",
        title: "Göreve bağlı form yok",
        description: "Saha formu, kabul kontrol listesi ya da anket bağlayıp yanıtları bu görevin altında toplayabilirsiniz."
      }
    ),
    s.map((b) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-3.5 py-3", children: [
        /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clipboard-list text-[14px]" }) }),
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => h((v) => v === b.documentId ? null : b.documentId),
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
        b.responseCount > 0 && /* @__PURE__ */ e.jsx(Ra, { children: b.responseCount }),
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
            onClick: () => N(b),
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
            onChange: (v) => y(b, v.target.checked)
          }
        ),
        "Süreli paylaşım linkiyle ekip dışından da doldurulabilsin"
      ] }),
      m === b.documentId && /* @__PURE__ */ e.jsx(Wr, { taskId: t, documentId: b.documentId })
    ] }, b.id))
  ] });
}
const Zr = {
  0: "bg-neutral-400",
  1: "bg-text-tertiary",
  2: "bg-warning",
  3: "bg-primary",
  4: "bg-success"
};
function yt(t) {
  if (!t) return null;
  const s = new Date(t);
  return Number.isNaN(s.getTime()) ? null : s;
}
const Ge = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
function Xr({ task: t = {} }) {
  const s = f.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((n, i) => ({
    id: n.id || `row-${i}`,
    name: n.title || "Başlıksız görev",
    isMain: !!n.__main,
    start: yt(n.startDate),
    end: yt(n.dueDate) || yt(n.completedDate),
    status: n.status ?? 1
  })), [t]), { min: a, span: r } = f.useMemo(() => {
    const o = s.flatMap((u) => [u.start, u.end]).filter(Boolean).map((u) => u.getTime());
    if (o.length === 0) return { min: null, span: 0 };
    const n = Math.min(...o), i = Math.max(...o);
    return { min: n, span: Math.max(1, i - n) };
  }, [s]), l = f.useMemo(() => a === null ? [] : [0, 1, 2, 3].map((o) => new Date(a + r * o / 4)), [a, r]);
  return a === null ? /* @__PURE__ */ e.jsx("div", { className: $e, children: /* @__PURE__ */ e.jsx(
    he,
    {
      icon: "fa-bars-staggered",
      title: "Zaman çizelgesi çizilemiyor",
      description: "Görevde veya alt görevlerde başlangıç–bitiş tarihi tanımlı olmalı."
    }
  ) }) : /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Zaman çizelgesi" }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] text-text-tertiary", children: [
        Ge(new Date(a)),
        " – ",
        Ge(new Date(a + r))
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
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: s.map((o) => {
      const n = o.start ? o.start.getTime() : a, i = o.end ? Math.max(o.end.getTime(), n) : n, u = (n - a) / r * 100, m = Math.max(2, (i - n) / r * 100), h = Math.max(1, Math.round((i - n) / 864e5));
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
            className: `absolute top-[7px] bottom-[7px] flex items-center px-2.5 rounded-[7px] shadow-xs ${Zr[o.status] || "bg-primary"}`,
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
function St(t, s = {}) {
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
    tagNames: (t.tags ?? []).map((a) => a.name),
    estimatedHours: t.estimatedHours ?? null,
    taskType: t.taskType ?? null,
    sprint: t.sprint ?? null,
    budgetLineId: t.budgetLineId ?? null,
    plannedAmount: t.plannedAmount ?? null,
    ...s
  };
}
function ra({ icon: t, iconTone: s, title: a, note: r, children: l }) {
  return /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[12px] ${s}` }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: a }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
    ] }),
    l
  ] });
}
function en({ task: t = {}, readOnly: s = !1 }) {
  const a = re(), r = t.predecessorIds || [], l = () => {
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
  }), u = f.useMemo(() => new Map(o.map((v) => [v.id, v])), [o]), m = n.filter((v) => v.predecessorTaskId === t.id).map((v) => v.taskId), h = o.filter((v) => v.id !== t.id && !r.includes(v.id) && !m.includes(v.id)), [p, x] = f.useState(""), { data: c = [], isLoading: d } = J({
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
      }))), await a.invalidateQueries({ queryKey: ["task-detail", t.id] }), await a.invalidateQueries({ queryKey: ["task-dependency-edges"] }), (I = (D = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : D.info) == null || I.call(D, "Bağlantı kaldırıldı.");
    } catch (B) {
      P(B, "Bağlantı kaldırılamadı.");
    }
  }, y = async () => {
    var v, w, D;
    if (p)
      try {
        await Promise.resolve(l().update(t.id, St(t, {
          predecessorIds: [...r, p]
        }))), x(""), await a.invalidateQueries({ queryKey: ["task-detail", t.id] }), await a.invalidateQueries({ queryKey: ["task-dependency-edges"] }), (D = (w = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : w.success) == null || D.call(w, "Öncül eklendi.");
      } catch (I) {
        P(I, "Öncül eklenemedi.");
      }
  }, b = (v) => {
    var w, D, I;
    return (I = (D = (w = window == null ? void 0 : window.apya) == null ? void 0 : w.taskDetail) == null ? void 0 : D.open) == null ? void 0 : I.call(D, v);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsxs(
      ra,
      {
        icon: "fa-arrow-left-long",
        iconTone: "text-warning",
        title: "Öncül görevler",
        note: "bu görev başlamadan tamamlanmalı",
        children: [
          r.length === 0 ? /* @__PURE__ */ e.jsx(he, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : d ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : c.map((v) => {
            const w = v.status == null ? null : be(v.status);
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
                      onClick: () => b(v.id),
                      className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                      children: v.title || "Başlıksız görev"
                    }
                  ),
                  w && /* @__PURE__ */ e.jsx(Pe, { bg: w.bg, fg: w.fg, children: w.label }),
                  !s && /* @__PURE__ */ e.jsx(
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
          !s && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-4 py-3 border-t border-subtle", children: [
            /* @__PURE__ */ e.jsxs(
              "select",
              {
                "aria-label": "Öncül görev seç",
                value: p,
                onChange: (v) => x(v.target.value),
                className: "flex-1 min-w-0 h-8 px-2.5 rounded-[9px] border border-default bg-surface-base text-text-primary text-[12.5px]",
                children: [
                  /* @__PURE__ */ e.jsx("option", { value: "", children: h.length ? "Öncül görev seçin…" : "Eklenebilecek görev yok" }),
                  h.map((v) => /* @__PURE__ */ e.jsx("option", { value: v.id, children: (v.code ? v.code + " · " : "") + (v.title || "Başlıksız görev") }, v.id))
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
      ra,
      {
        icon: "fa-arrow-right-long",
        iconTone: "text-primary",
        title: "Ardıl görevler",
        note: "bu görev bitince başlar",
        children: i ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : m.length === 0 ? /* @__PURE__ */ e.jsx(he, { icon: "fa-diagram-project", title: "Ardıl görev yok", description: "Bu görevi öncül olarak gösteren bir görev yok." }) : m.map((v) => {
          const w = u.get(v), D = w && w.status != null ? be(w.status) : null;
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
                    onClick: () => b(v),
                    className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                    children: (w == null ? void 0 : w.title) || "(erişilemeyen görev)"
                  }
                ),
                D && /* @__PURE__ */ e.jsx(Pe, { bg: D.bg, fg: D.fg, children: D.label })
              ]
            },
            v
          );
        })
      }
    )
  ] });
}
function ze() {
  var t, s, a;
  return ((a = (s = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : s.tasks) == null ? void 0 : a.task) || null;
}
function tn(t) {
  const s = re(), a = ["task-timelogs", t], r = ["task-active-timelog"], l = J({
    queryKey: a,
    queryFn: () => {
      var m;
      return Promise.resolve((m = ze()) == null ? void 0 : m.getTimeLogs(t));
    },
    enabled: !!t && !!ze(),
    staleTime: 15e3,
    meta: { persist: !1 },
    retry: !1
  }), o = J({
    queryKey: r,
    /* Kayıt yokken uç 204 döner, proxy undefined çözer; TanStack v5 undefined'ı
       hata sayıp önceki çalışan kaydı ekranda bırakır (sayaç durmazdı). */
    queryFn: () => {
      var m;
      return Promise.resolve((m = ze()) == null ? void 0 : m.getActiveTimeLog()).then((h) => h ?? null);
    },
    enabled: !!ze(),
    staleTime: 5e3,
    /* Canlı sayaç kanbandan da başlatılıp durduruluyor; açılışlar arasında taşınmaz. */
    meta: { persist: !1 },
    retry: !1
  }), n = () => {
    s.invalidateQueries({ queryKey: a }), s.invalidateQueries({ queryKey: r });
  }, i = te({
    mutationFn: () => {
      var m;
      return Promise.resolve((m = ze()) == null ? void 0 : m.startTimeTracking(t));
    },
    onSuccess: n
  }), u = te({
    mutationFn: () => {
      var m;
      return Promise.resolve((m = ze()) == null ? void 0 : m.stopTimeTracking(t));
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
function na(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function an({ taskId: t, task: s = {} }) {
  const a = tn(t), r = a.activeLog && a.activeLog.taskId === t ? a.activeLog : null, [l, o] = f.useState(() => Date.now());
  f.useEffect(() => {
    if (!r) return;
    const d = setInterval(() => o(Date.now()), 1e3);
    return () => clearInterval(d);
  }, [r]);
  const n = r ? Math.max(0, Math.floor((l - new Date(r.startTime).getTime()) / 1e3)) : 0, u = a.logs.reduce((d, N) => d + (N.secondsSpent || 0), 0) + n, m = (s == null ? void 0 : s.estimatedHours) ?? null, h = m ? m * 3600 : 0, p = h ? Math.min(100, Math.round(u / h * 100)) : 0, x = h ? Math.max(0, h - u) : 0, c = async () => {
    try {
      r ? await a.stop() : await a.start();
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
            disabled: a.isMutating,
            "aria-label": r ? "Sayacı durdur" : "Süre başlat",
            className: `flex shrink-0 items-center justify-center h-[58px] w-[58px] rounded-full text-white shadow-md cursor-pointer disabled:opacity-60 ${r ? "bg-negative" : "bg-success"}`,
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${a.isMutating ? "fa-circle-notch fa-spin" : r ? "fa-pause" : "fa-play"} text-[19px]` })
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px]", children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "font-mono text-[32px] font-bold tracking-[-.03em] text-text-primary",
              style: { fontVariantNumeric: "tabular-nums" },
              children: tr(u)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary", children: r ? "Kayıt sürüyor" : "Sayaç duraklatıldı" })
        ] })
      ] }),
      h > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]", children: [
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
    /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
      /* @__PURE__ */ e.jsx(Qe, { title: "Zaman kayıtları" }),
      a.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : a.logs.length === 0 ? /* @__PURE__ */ e.jsx(
        he,
        {
          icon: "fa-stopwatch",
          title: "Henüz zaman kaydı yok",
          description: "Soldaki yeşil düğmeyle sayacı çalıştırın; durdurduğunuzda kayıt buraya düşer."
        }
      ) : a.logs.map((d) => {
        const N = !d.endTime;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
            children: [
              /* @__PURE__ */ e.jsx(pt, { name: d.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: d.note || d.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                na(d.startTime),
                " → ",
                N ? "sürüyor" : na(d.endTime)
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
const Je = [
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
    component: ar,
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
    component: nr,
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
    component: Ar,
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
    component: zr,
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
    component: qr,
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
    component: lr,
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
    component: Xr,
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
    component: en,
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
    component: Er,
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
    component: mr,
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
    component: ur,
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
    component: or,
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
    component: xr,
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
    component: an,
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
    component: Ur,
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
    component: Jr,
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
    component: Br,
    surfaces: ["task", "project", "tasks"]
  }
];
function Va(t = []) {
  const s = new Set(t);
  return Je.filter((a) => !a.hidden).filter((a) => a.implemented && (a.isCore || s.has(a.code))).sort((a, r) => a.order - r.order);
}
function Oa(t = []) {
  const s = new Set(t);
  return Je.filter((a) => !a.hidden).filter((a) => !a.isCore).filter((a) => !a.permission || de(a.permission)).map((a) => ({ ...a, isAssigned: s.has(a.code) })).sort((a, r) => a.order - r.order);
}
let tt = null;
const lt = /* @__PURE__ */ new Set(), gt = /* @__PURE__ */ new Set();
let at = !1;
function ia() {
  lt.forEach((t) => t());
}
function sn(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const W = {
  open(t) {
    const s = sn(t);
    s && (tt = s, ia());
  },
  close() {
    tt = null, ia();
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
    at && W.emitResult();
  },
  /** Yalnız testler için. */
  reset() {
    tt = null, at = !1, lt.clear(), gt.clear();
  }
}, la = "apya.taskDetail.fullscreen";
function Qa({ taskId: t, presentation: s = "modal", onClose: a }) {
  const [r, l] = f.useState(t), [o, n] = f.useState([]), { data: i, isPending: u, isError: m, refetch: h } = It(r), p = Ta(), x = za(i), c = La(), d = Ma(r), [N, y] = f.useState("general"), [b, v] = f.useState(!1), w = _e.useRef(null), D = f.useMemo(
    () => Va(d.assignedCodes),
    [d.assignedCodes]
  ), I = f.useMemo(
    () => Oa(d.assignedCodes),
    [d.assignedCodes]
  ), B = D.find((z) => z.code === N) ?? D[0];
  _e.useEffect(() => {
    B.code !== N && y(B.code);
  }, [B, N]);
  const E = B == null ? void 0 : B.component, O = re(), [Y, q] = f.useState(
    () => {
      var z;
      return ((z = window.localStorage) == null ? void 0 : z.getItem(la)) === "1";
    }
  ), [F, M] = f.useState(!1), [U, _] = f.useState(!1), V = f.useCallback(() => {
    At(), a == null || a();
  }, [a]);
  Fa(s === "page" ? null : t, V), _e.useEffect(() => {
    x.isDirty ? p.markDirty() : p.markClean();
  });
  const X = f.useCallback(() => {
    F || (_(!1), p.requestClose(V));
  }, [p, V, F]), Q = f.useCallback(() => {
    q((z) => {
      var G;
      const K = !z;
      return (G = window.localStorage) == null || G.setItem(la, K ? "1" : "0"), K;
    });
  }, []), T = de("Platform.Tasks.Delete"), [L, R] = f.useState(!1), [ee, le] = f.useState(!1), oe = f.useCallback(async () => {
    var z, K, G;
    le(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (G = (K = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : K.info) == null || G.call(K, "Başarıyla silindi."), R(!1), p.markClean(), V();
    } catch (fe) {
      P(fe, "Görev silinemedi.");
    } finally {
      le(!1);
    }
  }, [r, p, V]), ce = f.useCallback(async () => {
    var z, K, G;
    if (!x.validate()) return !1;
    M(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, x.toUpdateDto())
      ), await O.invalidateQueries({ queryKey: ["task-detail", r] }), W.emitResult(), (G = (K = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : K.success) == null || G.call(K, "Kaydedildi."), !0;
    } catch (fe) {
      return P(fe, "Kaydedilemedi."), !1;
    } finally {
      M(!1);
    }
  }, [r, x, p, O]), ne = f.useCallback(() => {
    ce();
  }, [ce]), H = f.useCallback(async () => {
    if (_(!1), !x.validate()) {
      p.resolvePendingClose("stay"), y("general");
      return;
    }
    await ce() ? p.resolvePendingClose("saved") : _(!0);
  }, [p, x, ce]), ae = f.useCallback((z, K) => {
    p.requestClose(() => {
      n((G) => [...G, { id: r, title: (i == null ? void 0 : i.title) ?? "" }]), l(z), y("general"), p.markClean();
    });
  }, [p, r, i]), g = f.useCallback((z) => {
    p.requestClose(() => {
      n((K) => {
        const G = K.findIndex((fe) => fe.id === z);
        return G === -1 ? K : K.slice(0, G);
      }), l(z), y("general"), p.markClean();
    });
  }, [p]), j = f.useCallback(async (z) => {
    try {
      await d.addFeature(z), y(z), v(!1);
    } catch (K) {
      P(K, "Özellik eklenemedi.");
    }
  }, [d]), $ = f.useCallback(async (z) => {
    try {
      await d.removeFeature(z), y((K) => K === z ? "general" : K);
    } catch (K) {
      P(K, "Özellik kaldırılamadı.");
    }
  }, [d]);
  _e.useEffect(() => {
    if (!b) return;
    const z = (G) => {
      w.current && !w.current.contains(G.target) && v(!1);
    }, K = (G) => {
      G.key === "Escape" && v(!1);
    };
    return document.addEventListener("mousedown", z), document.addEventListener("keydown", K), () => {
      document.removeEventListener("mousedown", z), document.removeEventListener("keydown", K);
    };
  }, [b]);
  const k = u ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(ke, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(ke, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(ke, { className: "h-24 w-full" })
  ] }) : m && !i ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(se, { variant: "ghost", onClick: () => h(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      Hs,
      {
        trail: o,
        current: { id: r, title: (i == null ? void 0 : i.title) ?? "" },
        onNavigate: g
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: w, children: [
      /* @__PURE__ */ e.jsx(
        Vs,
        {
          tabs: D,
          activeCode: B.code,
          onSelect: (z) => {
            y(z), v(!1);
          },
          onOpenPicker: () => v((z) => !z),
          pickerOpen: b
        }
      ),
      b && /* @__PURE__ */ e.jsx(
        Qs,
        {
          entries: I,
          busyCode: d.isMutating ? d.mutatingCode : null,
          onAdd: j,
          onRemove: $
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
            Gs,
            {
              values: x.values,
              errors: x.errors,
              onFieldChange: x.setField,
              assigneeOptions: c.options,
              isLoadingAssignees: c.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(f.Suspense, { fallback: /* @__PURE__ */ e.jsx(ke, { className: "h-24 w-full" }), children: E && /* @__PURE__ */ e.jsx(
            E,
            {
              taskId: r,
              task: i,
              form: x,
              onOpenSubtask: ae
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            Ys,
            {
              task: i,
              creatorName: c.nameById.get(i.creatorId),
              lastModifierName: c.nameById.get(i.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), Z = s === "page" ? As : Fs;
  return /* @__PURE__ */ e.jsxs(
    Z,
    {
      open: !0,
      fullscreen: Y,
      onRequestClose: X,
      title: i ? `Görev Detayı: ${i.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        Ls,
        {
          task: i ?? { title: "Yükleniyor…" },
          canDelete: T,
          fullscreen: Y,
          onToggleFullscreen: Q,
          onClose: X,
          onDelete: () => R(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        Ks,
        {
          lastSavedAt: i == null ? void 0 : i.lastModificationTime,
          isDirty: p.isDirty,
          isSaving: F,
          onCancel: X,
          onSave: ne
        }
      ),
      children: [
        k,
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
            onSave: H
          }
        ),
        L && /* @__PURE__ */ e.jsx(
          rn,
          {
            taskTitle: (i == null ? void 0 : i.title) ?? "",
            busy: ee,
            onCancel: () => R(!1),
            onConfirm: oe
          }
        )
      ]
    }
  );
}
function rn({ taskTitle: t, busy: s, onCancel: a, onConfirm: r }) {
  const [l, o] = f.useState(""), n = l.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    nn,
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
        /* @__PURE__ */ e.jsx(se, { variant: "secondary", onClick: a, disabled: s, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          se,
          {
            variant: "destructive",
            onClick: r,
            disabled: !n,
            isLoading: s,
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
function nn({ label: t, title: s, description: a, children: r, actions: l }) {
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      role: "alertdialog",
      "aria-modal": "true",
      "aria-label": t,
      className: "absolute inset-0 z-popover grid place-items-center bg-surface-overlay p-4",
      children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-xl border border-default bg-surface-elevated p-[var(--apya-space-5)] shadow-xl", children: [
        /* @__PURE__ */ e.jsx("h3", { className: "text-base font-semibold text-text-primary", children: s }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-sm text-text-secondary", children: a }),
        r,
        /* @__PURE__ */ e.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: l })
      ] })
    }
  );
}
const ln = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function on({ isPrivate: t = !1, onChange: s = () => {
}, disabled: a = !1 }) {
  const r = !!t, [l, o] = f.useState(null);
  return /* @__PURE__ */ e.jsxs(Ce, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(De, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
      "button",
      {
        ref: o,
        type: "button",
        disabled: a,
        className: `flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary transition-all shadow-sm ${a ? "cursor-default" : "cursor-pointer hover:bg-surface-hover hover:border-default"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r ? "fa-lock" : "fa-globe"} text-[11px] text-text-tertiary` }),
          /* @__PURE__ */ e.jsx("span", { children: r ? "Özel görev" : "Herkese açık" }),
          !a && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[10px] ml-0.5 text-text-tertiary" })
        ]
      }
    ) }),
    /* @__PURE__ */ e.jsx(Te, { container: Fe(l), children: /* @__PURE__ */ e.jsxs(
      Se,
      {
        sideOffset: 8,
        align: "end",
        className: "z-50 w-[360px] rounded-2xl border border-subtle bg-surface-base p-4 shadow-float animate-in fade-in-50 zoom-in-95",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle pb-3 mb-3", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shield-halved text-primary text-base" }),
            /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary", children: "Görünürlük" })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: ln.map((n) => {
            const i = r === n.value;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => s(n.value),
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
          /* @__PURE__ */ e.jsx(Ts, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const oa = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto", cn = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", dn = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" }
];
function xn({ children: t }) {
  return /* @__PURE__ */ e.jsx(Bt, { asChild: !0, children: t });
}
function un({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "inline-flex items-center h-[19px] px-1.5 rounded-[5px] border border-default border-b-2 bg-neutral-subtle font-mono text-[10px] font-semibold text-text-secondary", children: t });
}
function pn({
  task: t = {},
  presentation: s = "modal",
  onClose: a,
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
  onToggleWatch: N,
  onDuplicate: y,
  onArchive: b,
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
  const [Y, q] = f.useState(!1), [F, M] = f.useState(null), [U, _] = f.useState(!1), V = f.useRef(null), X = f.useId(), Q = Fe(F), T = n ?? t.status, L = Pa(i), R = Ea(
    L,
    T,
    u === void 0 ? t.boardColumnId : u
  ), ee = { ...be(T), ...R ? { label: R.label } : {} }, le = (g) => {
    o("status", g.status), o("boardColumnId", g.boardColumnId);
  }, oe = t.code || "GRV-—", ce = () => {
    var g;
    (g = navigator.clipboard) == null || g.writeText(oe), q(!0), setTimeout(() => q(!1), 1800);
  }, ne = () => {
    var g, j, $, k;
    (g = navigator.clipboard) == null || g.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), (k = ($ = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : $.success) == null || k.call($, "Görev bağlantısı panoya kopyalandı.");
  }, H = (g) => () => {
    _(!1), g == null || g();
  }, ae = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", onClick: H(ne) },
    { label: "Çoğalt", icon: "fa-copy", allowed: B, onClick: H(y) },
    { label: "Başka projeye kopyala", icon: "fa-clone", allowed: B, onClick: H(() => D == null ? void 0 : D("copy")) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, allowed: B, onClick: H(() => D == null ? void 0 : D("move")) },
    { label: d ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: H(N) },
    { label: "Arşivle", icon: "fa-box-archive", separator: !0, allowed: E, onClick: H(b) },
    { label: "Görevi iptal et", icon: "fa-ban", allowed: E && t.status !== 0, onClick: H(v) },
    { label: "Yazdır", icon: "fa-print", kbd: "Ctrl P", onClick: H(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: H(I) },
    { label: "Sil", icon: "fa-trash-can", separator: !0, danger: !0, allowed: O, onClick: H(w) }
  ].filter((g) => g.allowed !== !1);
  return /* @__PURE__ */ e.jsxs("header", { ref: M, className: "shrink-0 px-6 lt-860:px-4 pt-[18px] pb-4 border-b border-subtle bg-surface-base", children: [
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
              /* @__PURE__ */ e.jsx("span", { children: oe }),
              /* @__PURE__ */ e.jsx("i", { className: `${Y ? "fa-solid fa-check" : "fa-regular fa-copy"} text-[9px] opacity-60` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(Ce, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(De, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              disabled: !B,
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] border border-default text-[12px] font-semibold ${B ? "cursor-pointer" : "cursor-default"} ${ee.bg} ${ee.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-current animate-pulse" }),
                /* @__PURE__ */ e.jsx("span", { children: ee.label }),
                B && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(Te, { container: Q, children: /* @__PURE__ */ e.jsxs(Se, { sideOffset: 6, align: "start", className: `${oa} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            L.map((g) => {
              const j = (R == null ? void 0 : R.key) === g.key;
              return /* @__PURE__ */ e.jsx(xn, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => le(g),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${j ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${g.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: g.label }),
                    j && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, g.key);
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
          on,
          {
            isPrivate: p ?? !!t.isPrivate,
            onChange: (g) => o("isPrivate", g),
            disabled: !B
          }
        ) }),
        /* @__PURE__ */ e.jsx("div", { className: "h-5 w-px bg-border-default mx-1" }),
        s === "modal" && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: l,
            title: r ? "Küçült" : "Tam ekran",
            className: `mobile:hidden flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${r ? "bg-primary-subtle text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r ? "fa-compress" : "fa-expand"} text-[12px]` })
          }
        ),
        /* @__PURE__ */ e.jsxs(Ce, { modal: !0, open: U, onOpenChange: _, children: [
          /* @__PURE__ */ e.jsx(De, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer seçenekler",
              className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${U ? "bg-surface-hover text-text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(Te, { container: Q, children: /* @__PURE__ */ e.jsxs(
            Se,
            {
              sideOffset: 6,
              align: "end",
              collisionBoundary: Q ?? [],
              collisionPadding: 12,
              className: `${oa} w-[244px]`,
              children: [
                ae.map((g) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: g.onClick,
                    className: [
                      cn,
                      g.danger ? "text-negative" : "text-text-secondary",
                      g.separator ? "border-t border-subtle mt-[5px]" : ""
                    ].join(" "),
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${g.icon} text-[11px] w-[14px] opacity-75` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: g.label }),
                      g.kbd && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: g.kbd })
                    ]
                  },
                  g.label
                )),
                /* @__PURE__ */ e.jsxs("div", { className: "mt-1.5 pt-[9px] px-[9px] pb-[7px] border-t border-subtle", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 mb-[7px]", children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-keyboard text-[11px] text-text-tertiary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-[.09em] text-text-tertiary", children: "Kısayollar" })
                  ] }),
                  dn.map((g) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: g.what }),
                    /* @__PURE__ */ e.jsx(un, { children: g.key })
                  ] }, g.what))
                ] })
              ]
            }
          ) })
        ] }),
        s === "modal" && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: a,
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
          "aria-invalid": !!h || void 0,
          "aria-describedby": h ? X : void 0,
          contentEditable: B,
          suppressContentEditableWarning: !0,
          spellCheck: !1,
          onInput: B ? (g) => o("title", g.currentTarget.textContent.trim()) : void 0,
          onBlur: B ? (g) => o("title", g.currentTarget.textContent.trim()) : void 0,
          className: `flex-1 min-w-0 text-[24px] lt-560:text-[20px] font-extrabold tracking-[-.025em] leading-[1.2] text-text-primary px-2 -ml-2 py-[3px] rounded-[9px] border ${h ? "border-negative" : "border-transparent"} ${B ? `cursor-text hover:bg-neutral-subtle focus:bg-neutral-subtle focus:shadow-focus focus:outline-none ${h ? "" : "hover:border-subtle focus:border-focus"}` : ""}`,
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
    h && /* @__PURE__ */ e.jsx("p", { id: X, role: "alert", className: "mt-1 mb-0 text-[12px] font-semibold text-negative", children: h })
  ] });
}
const st = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", ca = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function Ne({ children: t }) {
  return /* @__PURE__ */ e.jsx(Bt, { asChild: !0, children: t });
}
function ye({ label: t, children: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[7px] min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.08em] text-text-tertiary select-none", children: t }),
    s
  ] });
}
function da({ name: t, size: s = 26 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: s, width: s, background: We(t), fontSize: s * 0.38 },
      children: He(t)
    }
  );
}
function xa(t) {
  if (t == null) return "—";
  const s = Math.max(0, Math.round(Number(t) * 60)), a = Math.floor(s / 60), r = s % 60;
  return a ? r ? `${a}s ${r}dk` : `${a}s` : `${r}dk`;
}
function mn({
  task: t = {},
  assigneeOptions: s = [],
  projectOptions: a = [],
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
  onOpenTransfer: N,
  /* Düzenleme yetkisi yoksa ızgara salt okunur: tüm alanlar forma, oradan UpdateAsync'e
     gider; yetkisiz kullanıcı değiştirip Kaydet'te 403 alıyordu. */
  readOnly: y = !1,
  /* Doğrulama hataları (useTaskForm.errors): ilgili hücrenin altında gösterilir. */
  startDateError: b,
  dueDateError: v
}) {
  var j, $;
  const w = f.useId(), D = f.useId(), [I, B] = f.useState(""), [E, O] = f.useState(""), [Y, q] = f.useState(""), [F, M] = f.useState(!1), [U, _] = f.useState(null), V = l ?? t.status, X = Pa(o), Q = Ea(
    X,
    V,
    n === void 0 ? t.boardColumnId : n
  ), T = { ...be(V), ...Q ? { label: Q.label } : {} }, L = (k) => {
    r("status", k.status), r("boardColumnId", k.boardColumnId);
  }, R = ut(i ?? t.priority), ee = u ?? t.assigneeId ?? null, le = m ?? t.projectId ?? null, oe = ((j = s.find((k) => k.value === ee)) == null ? void 0 : j.label) || t.assigneeName || "Atanmamış", ce = (($ = a.find((k) => k.value === le)) == null ? void 0 : $.label) || t.projectName || "Projesiz", ne = Sa(h ?? t.dueDate), H = s.filter(
    (k) => !I || k.label.toLowerCase().includes(I.toLowerCase())
  ), ae = a.filter(
    (k) => !E || k.label.toLowerCase().includes(E.toLowerCase())
  ), g = () => {
    const k = Y.trim();
    k && !x.includes(k) && r("tagNames", [...x, k]), q(""), M(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { ref: _, className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsx(
    "fieldset",
    {
      disabled: y,
      className: "m-0 p-0 border-0 min-w-0 [&:disabled_label]:pointer-events-none [&_:disabled]:pointer-events-none [&:disabled_.fa-chevron-down]:hidden",
      children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6", children: [
        /* @__PURE__ */ e.jsx(ye, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(Ce, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(De, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx(da, { name: ee ? oe : null }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: oe }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(Te, { container: Fe(U), children: /* @__PURE__ */ e.jsxs(Se, { sideOffset: 6, align: "start", className: `${st} w-[264px]`, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: I,
                  onChange: (k) => B(k.target.value),
                  placeholder: "Kişi ara…",
                  className: ca
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[230px] overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("assigneeId", null),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] text-left cursor-pointer ${ee ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary font-semibold"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "flex h-6 w-6 items-center justify-center rounded-full bg-neutral-subtle text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-user-slash text-[9px]" }) }),
                    /* @__PURE__ */ e.jsx("span", { children: "Atanmamış" })
                  ]
                }
              ) }),
              s.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-2 py-1.5 text-[12px] text-text-tertiary", children: "Kullanıcı listesi yükleniyor…" }),
              H.map((k) => /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("assigneeId", k.value),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${ee === k.value ? "bg-primary-subtle" : "hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx(da, { name: k.label, size: 24 }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: k.label }),
                    ee === k.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
                  ]
                }
              ) }, k.value))
            ] })
          ] }) })
        ] }) }),
        /* @__PURE__ */ e.jsxs(ye, { label: "Son tarih", children: [
          /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-regular fa-calendar text-[13px] ${ne.tone}` }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "date",
                value: (h ?? t.dueDate ?? "").slice(0, 10),
                onChange: (k) => r("dueDate", k.target.value),
                "aria-label": "Son tarih",
                "aria-invalid": !!v || void 0,
                "aria-describedby": v ? w : void 0,
                className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
              }
            )
          ] }),
          v ? /* @__PURE__ */ e.jsx("span", { id: w, role: "alert", className: "-mt-0.5 text-[10.5px] font-semibold text-negative", children: v }) : ne.hint && /* @__PURE__ */ e.jsx("span", { className: `-mt-0.5 text-[10.5px] font-semibold ${ne.tone}`, children: ne.hint })
        ] }),
        /* @__PURE__ */ e.jsxs(ye, { label: "Başlangıç", children: [
          /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[13px] text-text-tertiary" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "date",
                value: (p ?? t.startDate ?? "").slice(0, 10),
                onChange: (k) => r("startDate", k.target.value),
                "aria-label": "Başlangıç",
                "aria-invalid": !!b || void 0,
                "aria-describedby": b ? D : void 0,
                className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
              }
            )
          ] }),
          b && /* @__PURE__ */ e.jsx("span", { id: D, role: "alert", className: "-mt-0.5 text-[10.5px] font-semibold text-negative", children: b })
        ] }),
        /* @__PURE__ */ e.jsx(ye, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 pt-[5px]", children: [
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
        /* @__PURE__ */ e.jsx(ye, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(Ce, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(De, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
          /* @__PURE__ */ e.jsx(Te, { container: Fe(U), children: /* @__PURE__ */ e.jsxs(Se, { sideOffset: 6, align: "start", className: `${st} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            X.map((k) => {
              const Z = (Q == null ? void 0 : Q.key) === k.key;
              return /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => L(k),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${Z ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${k.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: k.label }),
                    Z && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, k.key);
            })
          ] }) })
        ] }) }) }),
        /* @__PURE__ */ e.jsx(ye, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(Ce, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(De, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
          /* @__PURE__ */ e.jsx(Te, { container: Fe(U), children: /* @__PURE__ */ e.jsxs(Se, { sideOffset: 6, align: "start", className: `${st} w-[184px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
            ks.map((k) => {
              const Z = Cs[k], z = (i ?? t.priority) === k;
              return /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("priority", k),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${z ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${Z.icon} text-[11px] w-[13px]` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: Z.label }),
                    z && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, k);
            })
          ] }) })
        ] }) }) }),
        /* @__PURE__ */ e.jsx(ye, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap min-h-8", children: [
          x.map((k) => /* @__PURE__ */ e.jsxs(
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
                    onClick: () => r("tagNames", x.filter((Z) => Z !== k)),
                    className: "flex items-center p-0 border-0 bg-transparent text-current opacity-55 hover:opacity-100 hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
                  }
                )
              ]
            },
            k
          )),
          y ? x.length === 0 && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "—" }) : F ? /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: Y,
              onChange: (k) => q(k.target.value),
              onBlur: g,
              onKeyDown: (k) => {
                k.key === "Enter" && g(), k.key === "Escape" && (q(""), M(!1));
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
        /* @__PURE__ */ e.jsx(ye, { label: "Proje", children: /* @__PURE__ */ e.jsxs(Ce, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(De, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-[13px] text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: ce }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(Te, { container: Fe(U), children: /* @__PURE__ */ e.jsxs(Se, { sideOffset: 6, align: "start", className: `${st} w-[250px]`, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: E,
                  onChange: (k) => O(k.target.value),
                  placeholder: "Proje ara…",
                  className: ca
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[210px] overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("projectId", null),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${le ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-neutral-400" }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Projesiz" })
                  ]
                }
              ) }),
              ae.map((k) => /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("projectId", k.value),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${le === k.value ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-primary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: k.label }),
                    le === k.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
                  ]
                }
              ) }, k.value))
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-[7px] pt-[7px] border-t border-subtle", children: [
              /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
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
              /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
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
        /* @__PURE__ */ e.jsx(ye, { label: "Harcanan / tahmin", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[9px] h-8", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock text-[13px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[13px] font-bold text-text-primary", children: xa(t.spentHours ?? 0) }),
          /* @__PURE__ */ e.jsxs("span", { className: "text-[12px] text-text-tertiary", children: [
            "/ ",
            t.estimatedHours != null ? xa(t.estimatedHours) : "—"
          ] })
        ] }) })
      ] })
    }
  ) });
}
const fn = "z-popover w-[225px] rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto";
function Mt({ entries: t = [], onPick: s, children: a }) {
  const [r, l] = f.useState(null), o = Fe(r);
  return /* @__PURE__ */ e.jsx("span", { ref: l, className: "contents", children: /* @__PURE__ */ e.jsxs(Ce, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(De, { asChild: !0, children: a }),
    /* @__PURE__ */ e.jsx(Te, { container: o, children: /* @__PURE__ */ e.jsxs(Se, { sideOffset: 6, align: "start", collisionPadding: 12, className: fn, children: [
      /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Özellik ekle" }),
      t.map((n) => /* @__PURE__ */ e.jsx(Bt, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => s == null ? void 0 : s(n.code, n.isAssigned),
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
function bn({
  activeTab: t,
  onTabChange: s,
  orderedTabs: a = [],
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
      a.map((d) => {
        const N = t === d.code, y = h[d.code] || 0;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            draggable: !0,
            title: "Sürükleyerek sırayı değiştirin",
            ...Ba(() => s(d.code)),
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
              N ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
              r === d.code ? "opacity-35" : "opacity-100"
            ].join(" "),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.icon} text-[11px] opacity-85` }),
              /* @__PURE__ */ e.jsx("span", { children: d.title }),
              y > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                "rounded-full text-[10px] font-extrabold",
                N ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
              ].join(" "), children: y })
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
function hn({
  activeTab: t,
  onTabChange: s,
  orderedTabs: a = [],
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
        a.map((p) => {
          const x = t === p.code, c = h[p.code] || 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              draggable: !0,
              title: "Sürükleyerek sırayı değiştirin",
              ...Ba(() => s(p.code)),
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
function Ie({ label: t, value: s, avatarName: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 py-[9px] border-t border-subtle", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-tertiary shrink-0", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
      a && /* @__PURE__ */ e.jsx(
        "span",
        {
          className: "flex shrink-0 items-center justify-center h-[21px] w-[21px] rounded-full text-[color:var(--apya-avatar-fg)] text-[8.5px] font-bold",
          style: { background: We(a) },
          children: He(a)
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", title: typeof s == "string" ? s : void 0, children: s || "—" })
    ] })
  ] });
}
const ua = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "—";
function yn({ task: t = {}, nameById: s }) {
  const a = (o, n) => {
    var i;
    return o || n && ((i = s == null ? void 0 : s.get) == null ? void 0 : i.call(s, n)) || null;
  }, r = a(t.creatorName, t.creatorId), l = t.lastModificationTime ? a(t.lastModifierName, t.lastModifierId) : null;
  return /* @__PURE__ */ e.jsx("aside", { className: "flex flex-col gap-3.5 min-w-0", children: /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsx(Ie, { label: "Oluşturan", value: r || "Bilinmiyor", avatarName: r }),
    /* @__PURE__ */ e.jsx(Ie, { label: "Oluşturma tarihi", value: ua(t.creationTime) }),
    /* @__PURE__ */ e.jsx(Ie, { label: "Güncelleyen", value: l || "—", avatarName: l }),
    /* @__PURE__ */ e.jsx(Ie, { label: "Son güncelleme", value: ua(t.lastModificationTime) }),
    /* @__PURE__ */ e.jsx(Ie, { label: "Görev tipi", value: t.taskType }),
    /* @__PURE__ */ e.jsx(Ie, { label: "Sprint", value: t.sprint }),
    /* @__PURE__ */ e.jsx(Ie, { label: "İzleyenler", value: (t.watcherNames || []).join(", ") || "Kimse izlemiyor" })
  ] }) });
}
const pa = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
function vt({ name: t, size: s = 32 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: s, width: s, background: We(t), fontSize: s * 0.34 },
      children: He(t)
    }
  );
}
function ma({ open: t, onClick: s, label: a }) {
  return /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: s,
      "aria-expanded": t,
      "aria-label": `${a} — ${t ? "daralt" : "genişlet"}`,
      title: t ? "Daralt" : "Genişlet",
      className: "flex items-center justify-center h-7 w-7 rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer",
      children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t ? "fa-chevron-up" : "fa-chevron-down"} text-[12px]` })
    }
  );
}
const rt = (t) => [t == null ? void 0 : t.name, t == null ? void 0 : t.surname].filter(Boolean).join(" ") || (t == null ? void 0 : t.userName) || "", fa = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function gn({
  task: t = {},
  onFieldChange: s = () => {
  },
  descriptionValue: a,
  checklist: r,
  currentUserName: l = "Ben",
  /* Düzenleme yetkisi yoksa açıklama ve kontrol listesi salt okunur. Yorumlar açık
     kalır: görevi görebilen herkes yorum yazabilir (ürün kararı, 2026-09-28). */
  readOnly: o = !1
}) {
  const n = t == null ? void 0 : t.id, i = re(), [u, m] = f.useState(!0), [h, p] = f.useState(""), x = (r == null ? void 0 : r.items) ?? [], c = x.filter((g) => g.isDone).length, d = x.length ? Math.round(c / x.length * 100) : 0, N = async () => {
    const g = h.trim();
    if (!(!g || !n)) {
      p("");
      try {
        await r.addItem(g);
      } catch (j) {
        p(($) => $ || g), P(j, "Madde eklenemedi.");
      }
    }
  }, [y, b] = f.useState(!0), [v, w] = f.useState(""), [D, I] = f.useState(!1), [B, E] = f.useState(!1), [O, Y] = f.useState(null), [q, F] = f.useState(""), [M, U] = f.useState([]), [_, V] = f.useState(!1), [X, Q] = f.useState(""), { data: T, isFetched: L } = J({
    queryKey: ["task-users-lookup"],
    queryFn: () => {
      var g, j, $, k;
      return Promise.resolve((k = ($ = (j = (g = window == null ? void 0 : window.apya) == null ? void 0 : g.platform) == null ? void 0 : j.tasks) == null ? void 0 : $.task) == null ? void 0 : k.getUsersLookup()).then((Z) => (Z == null ? void 0 : Z.items) ?? []);
    },
    enabled: _,
    staleTime: 6e4,
    meta: { persist: !1 }
  }), R = X.trim().toLocaleLowerCase("tr-TR"), ee = (T ?? []).filter((g) => !R || `${rt(g)} ${g.userName ?? ""}`.toLocaleLowerCase("tr-TR").includes(R)), le = (g) => {
    const j = rt(g);
    w(($) => `${$ && !/\s$/.test($) ? `${$} ` : $}@${j} `), U(($) => $.some((k) => k.id === g.id) ? $ : [...$, { id: g.id, label: j }]), V(!1), Q("");
  }, { data: oe = [] } = J({
    queryKey: ["task-comments", n],
    queryFn: () => {
      var g, j, $, k;
      return Promise.resolve((k = ($ = (j = (g = window == null ? void 0 : window.apya) == null ? void 0 : g.platform) == null ? void 0 : j.tasks) == null ? void 0 : $.task) == null ? void 0 : k.getComments(n));
    },
    enabled: !!n,
    staleTime: 1e4,
    meta: { persist: !1 }
  }), ce = async () => {
    await i.invalidateQueries({ queryKey: ["task-comments", n] }), await i.invalidateQueries({ queryKey: ["task-detail", n] });
  }, ne = async () => {
    const g = v.trim();
    if (!(!g || !n || B)) {
      E(!0);
      try {
        const j = M.filter(($) => g.includes(`@${$.label}`)).map(($) => $.id);
        await Promise.resolve(window.apya.platform.tasks.task.addComment(n, g, j)), await ce(), w(""), U([]);
      } catch (j) {
        P(j, "Yorum gönderilemedi.");
      } finally {
        E(!1);
      }
    }
  }, H = async (g) => {
    const j = q.trim();
    if (!(!j || !n))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.replyToComment(g, j)), await ce(), F(""), Y(null);
      } catch ($) {
        P($, "Yanıt gönderilemedi.");
      }
  }, ae = !!v.trim() && !B;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-[9px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Açıklama" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Zengin metin · WYSIWYG" })
      ] }),
      /* @__PURE__ */ e.jsx(
        $a,
        {
          value: a ?? t.description ?? "",
          onChange: (g) => s("description", g),
          readOnly: o
        },
        n
      )
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: pa, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
            c,
            "/",
            x.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(ma, { label: "Kontrol listesi", open: u, onClick: () => m((g) => !g) })
      ] }),
      u && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 mt-3.5", children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
            style: { width: `${d}%` }
          }
        ) }),
        x.map((g) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              disabled: o,
              "aria-label": g.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
              onClick: () => r.toggleItem(g.id).catch((j) => P(j, "Durum güncellenemedi.")),
              className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${o ? "cursor-default" : "cursor-pointer"} transition-colors duration-fast ${g.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
              children: g.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${g.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: g.text }),
          !o && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              onClick: () => r.removeItem(g.id).catch((j) => P(j, "Madde silinemedi.")),
              className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
            }
          )
        ] }, g.id)),
        !o && /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            value: h,
            onChange: (g) => p(g.target.value),
            onKeyDown: (g) => {
              g.key === "Enter" && N();
            },
            placeholder: "Yeni madde yaz ve Enter'a bas…",
            className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: pa, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Yorumlar & güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: oe.length })
        ] }),
        /* @__PURE__ */ e.jsx(ma, { label: "Yorumlar", open: y, onClick: () => b((g) => !g) })
      ] }),
      y && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(vt, { name: l }),
          /* @__PURE__ */ e.jsxs("div", { className: `flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${D ? "border-focus bg-surface-base shadow-focus" : "border-default bg-surface-raised"}`, children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                rows: 2,
                value: v,
                onChange: (g) => w(g.target.value),
                onFocus: () => I(!0),
                onBlur: () => I(!1),
                onKeyDown: (g) => {
                  g.key === "Enter" && (g.ctrlKey || g.metaKey) && (g.preventDefault(), ne());
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
                    onMouseDown: (g) => g.preventDefault(),
                    onClick: () => V((g) => !g),
                    className: `flex items-center justify-center h-7 w-7 rounded-[7px] hover:bg-surface-hover hover:text-primary cursor-pointer ${_ ? "text-primary" : "text-text-tertiary"}`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-at text-[12px]" })
                  }
                ),
                [
                  { icon: "fa-regular fa-face-smile", title: "👍 ekle", add: " 👍 " }
                ].map((g) => /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: g.title,
                    onMouseDown: (j) => j.preventDefault(),
                    onClick: () => w((j) => j + g.add),
                    className: "flex items-center justify-center h-7 w-7 rounded-[7px] text-text-tertiary hover:bg-surface-hover hover:text-primary cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: `${g.icon} text-[12px]` })
                  },
                  g.title
                ))
              ] }),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: ne,
                  disabled: !ae,
                  className: `flex items-center gap-[7px] h-[30px] px-3.5 rounded-[9px] text-[12px] font-bold shadow-xs ${ae ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
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
              onBlur: (g) => {
                g.currentTarget.contains(g.relatedTarget) || V(!1);
              },
              className: "absolute left-[43px] top-full z-20 mt-1 w-64 min-w-[200px] max-w-[calc(100%-43px)] rounded-[11px] border border-default bg-surface-base p-1.5 shadow-lg",
              children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: X,
                    onChange: (g) => Q(g.target.value),
                    onKeyDown: (g) => {
                      g.key === "Escape" && (g.preventDefault(), V(!1)), g.key === "Enter" && ee[0] && (g.preventDefault(), le(ee[0]));
                    },
                    placeholder: "Kişi ara…",
                    "aria-label": "Kişi ara",
                    className: "mb-1 h-8 w-full rounded-[8px] border border-default bg-surface-raised px-2.5 text-[12px] text-text-primary focus:border-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsxs("ul", { className: "m-0 max-h-56 list-none overflow-y-auto p-0", children: [
                  ee.map((g) => /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => le(g),
                      className: "w-full rounded-[7px] px-2.5 py-1.5 text-left text-[12.5px] text-text-primary hover:bg-surface-hover cursor-pointer",
                      children: [
                        rt(g),
                        g.userName && rt(g) !== g.userName && /* @__PURE__ */ e.jsxs("span", { className: "ml-1 text-[11px] text-text-tertiary", children: [
                          "(",
                          g.userName,
                          ")"
                        ] })
                      ]
                    }
                  ) }, g.id)),
                  !ee.length && /* @__PURE__ */ e.jsx("li", { className: "px-2.5 py-2 text-[12px] text-text-tertiary", children: L ? "Eşleşen kişi yok" : "Yükleniyor…" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1", children: oe.map((g) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start py-3 border-t border-subtle", children: [
          /* @__PURE__ */ e.jsx(vt, { name: g.authorName }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: g.authorName }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: fa(g.creationTime) })
            ] }),
            /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[13px] leading-[1.65] text-text-secondary whitespace-pre-wrap", children: g.text }),
            /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1.5 mt-[3px]", children: /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  Y((j) => j === g.id ? null : g.id), F("");
                },
                className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-full text-text-tertiary text-[11px] font-semibold hover:bg-surface-hover hover:text-primary cursor-pointer",
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                  "Yanıtla"
                ]
              }
            ) }),
            O === g.id && /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 mt-2 animate-fade-in-fast", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: q,
                  onChange: (j) => F(j.target.value),
                  onKeyDown: (j) => {
                    j.key === "Enter" && H(g.id);
                  },
                  placeholder: `@${g.authorName} kullanıcısına yanıt ver…`,
                  className: "flex-1 h-8 px-3 rounded-[9px] border border-focus bg-surface-base text-text-primary text-[12px] shadow-focus focus:outline-none"
                }
              ),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => H(g.id),
                  className: "h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover",
                  children: "Yanıtla"
                }
              )
            ] }),
            (g.replies ?? []).map((j) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] mt-2.5 pl-3 border-l-2 border-default", children: [
              /* @__PURE__ */ e.jsx(vt, { name: j.authorName, size: 24 }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: j.authorName }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: fa(j.creationTime) })
                ] }),
                /* @__PURE__ */ e.jsx("p", { className: "mt-[3px] mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: j.text })
              ] })
            ] }, j.id))
          ] })
        ] }, g.id)) })
      ] })
    ] })
  ] });
}
function vn({
  lastSavedAt: t,
  isDirty: s,
  isSaving: a,
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
  }).format(new Date(t)) : "—", u = a ? "fa-solid fa-circle-notch fa-spin" : r ? "fa-solid fa-check" : "fa-regular fa-floppy-disk", m = a ? "Kaydediliyor…" : r ? "Kaydedildi" : "Kaydet", h = s && !a;
  return /* @__PURE__ */ e.jsxs("footer", { className: `${n ? "sticky bottom-0 z-10 " : ""}shrink-0 flex items-center justify-between gap-4 px-6 lt-860:px-4 py-3.5 border-t border-subtle bg-surface-base`, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5 min-w-0 lt-560:hidden", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] text-[11.5px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock text-[11px]" }),
        "Son kayıt: ",
        /* @__PURE__ */ e.jsx("strong", { className: "font-semibold text-text-secondary", children: i })
      ] }),
      s && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] text-[11.5px] font-semibold text-warning", children: [
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
          disabled: a,
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
const jn = Object.fromEntries(Je.map((t) => [t.code, t])), Nn = {
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
}, wn = /* @__PURE__ */ new Set([
  "risks",
  "dashboard",
  "comments",
  "emails",
  "custom-fields",
  "approvals",
  "ai",
  "automations"
]), kn = (t) => wn.has(t);
function Cn(t) {
  const s = jn[t], a = Nn[t];
  return s ? {
    code: t,
    title: s.title,
    icon: s.icon,
    desc: (a == null ? void 0 : a.desc) ?? "",
    bg: (a == null ? void 0 : a.bg) ?? "bg-neutral-subtle",
    fg: (a == null ? void 0 : a.fg) ?? "text-text-secondary"
  } : null;
}
Je.filter((t) => !t.hidden).length;
function ba({ code: t, onRemoveFeature: s, pickerEntries: a = [], onPickFeature: r, canRemove: l = !0 }) {
  const o = Cn(t) ?? { title: t, desc: "", icon: "fa-cube", bg: "bg-neutral-subtle", fg: "text-text-secondary" };
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
          onClick: () => s == null ? void 0 : s(t),
          className: "flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] border border-default bg-surface-base text-text-secondary text-[12.5px] font-semibold cursor-pointer hover:bg-negative-subtle hover:border-negative hover:text-negative",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[10px]" }),
            "Bu özelliği kaldır"
          ]
        }
      ),
      /* @__PURE__ */ e.jsx(Mt, { entries: a, onPick: r, children: /* @__PURE__ */ e.jsxs(
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
function Ha({ open: t, onClose: s, label: a, children: r }) {
  return /* @__PURE__ */ e.jsx(
    Ss,
    {
      open: t,
      onOpenChange: (l) => {
        l || s == null || s();
      },
      children: /* @__PURE__ */ e.jsxs($s, { children: [
        /* @__PURE__ */ e.jsx(Ps, { className: "fixed inset-0", style: { pointerEvents: "none" } }),
        /* @__PURE__ */ e.jsx(Es, { asChild: !0, "aria-describedby": void 0, children: /* @__PURE__ */ e.jsxs("div", { className: "fixed inset-0 z-modal", children: [
          /* @__PURE__ */ e.jsx(Bs, { className: "sr-only", children: a }),
          r
        ] }) })
      ] })
    }
  );
}
const Dn = [
  { key: "subtasks", label: "Alt görevler", countKey: "subtasks", unit: "alt görev" },
  { key: "checklist", label: "Kontrol listesi", countKey: "checklist", unit: "madde" },
  { key: "comments", label: "Yorumlar", countKey: "comments", unit: "yorum" },
  { key: "files", label: "Dosyalar", countKey: "files", unit: "dosya" },
  { key: "keepAssignee", label: "Sorumluyu koru", desc: "Aksi halde atanmamış gelir" },
  { key: "keepLinks", label: "Bağımlılıkları koru", desc: "Öncül / ardıl bağlantılar" },
  { key: "shiftDates", label: "Tarihleri bugüne kaydır", desc: "Başlangıç ve son tarih ötelenir" }
], ha = {
  subtasks: !0,
  checklist: !0,
  comments: !1,
  files: !0,
  keepAssignee: !0,
  keepLinks: !0,
  shiftDates: !1
};
function Tn({ on: t, onClick: s, label: a }) {
  return /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": t,
      "aria-label": a,
      onClick: s,
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
function Sn({
  open: t,
  mode: s = "move",
  onClose: a,
  onConfirm: r,
  projectOptions: l = [],
  currentProjectId: o,
  counts: n = {},
  onCreateProject: i
}) {
  const [u, m] = f.useState(s), [h, p] = f.useState([]), [x, c] = f.useState(""), [d, N] = f.useState(""), [y, b] = f.useState(ha), [v, w] = f.useState(!1);
  f.useEffect(() => {
    t && (m(s), p([]), c(""), N(""), b(ha));
  }, [t, s]);
  const D = f.useMemo(
    () => l.filter((T) => T.value && T.value !== o),
    [l, o]
  ), I = D.filter((T) => !x || T.label.toLowerCase().includes(x.toLowerCase())), B = D.length > 0 && h.length === D.length;
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
  }, q = async () => {
    if (!(!h.length || v)) {
      w(!0);
      try {
        await (r == null ? void 0 : r({ mode: u, targetProjectIds: h, include: y }));
      } finally {
        w(!1);
      }
    }
  }, F = u === "move", M = h.length, U = F ? M > 1 ? "Taşı ve kopyala" : "Taşı" : M > 1 ? `${M} projeye kopyala` : "Kopyala", _ = Object.values(y).filter(Boolean).length, V = h.map(O).filter(Boolean), X = V.length ? `${V.length > 2 ? `${V.slice(0, 2).join(", ")} +${V.length - 2}` : V.join(", ")} · ${_} seçenek açık` : `Proje seçilmedi · ${_} seçenek açık`, Q = (T) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${T ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return /* @__PURE__ */ e.jsx(Ha, { open: t, onClose: a, label: F ? "Başka projeye taşı" : "Başka projelere kopyala", children: /* @__PURE__ */ e.jsx(
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
                  onClick: a,
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
                    const L = h.includes(T.value), R = F && h[0] === T.value;
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
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: Dn.map((T) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-px", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary", children: T.label }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: T.countKey ? `${n[T.countKey] ?? 0} ${T.unit}` : T.desc })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    Tn,
                    {
                      on: y[T.key],
                      label: T.label,
                      onClick: () => b((L) => ({ ...L, [T.key]: !L[T.key] }))
                    }
                  )
                ] }, T.key)) })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3.5 px-[22px] py-3.5 border-t border-subtle bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("span", { className: "min-w-0 truncate text-[11.5px] text-text-tertiary", children: X }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 shrink-0", children: [
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: a,
                    className: "h-9 px-4 rounded-[10px] border border-default bg-surface-base text-text-secondary text-[12.5px] font-semibold hover:bg-surface-hover hover:text-text-primary cursor-pointer",
                    children: "Vazgeç"
                  }
                ),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: q,
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
const $n = [
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
function Pn(t = "") {
  var a;
  const s = (a = t.split(".").pop()) == null ? void 0 : a.toLowerCase();
  return s === "pdf" ? Ye.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(s) ? Ye.img : ["doc", "docx", "odt", "rtf"].includes(s) ? Ye.doc : ["json", "js", "ts", "cs", "xml", "yml", "yaml"].includes(s) ? Ye.code : Ye.other;
}
const En = (t) => t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : "—", Bn = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—", In = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—";
function jt({ name: t, size: s = 22 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: s, width: s, background: We(t), fontSize: s * 0.4 },
      children: He(t)
    }
  );
}
function nt({ label: t, children: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: t }),
    s
  ] });
}
function Fn({
  subtaskId: t,
  parentCode: s,
  onClose: a,
  onOpenFull: r,
  onDeleted: l,
  currentUserName: o = "Ben"
}) {
  var H, ae, g;
  const n = re(), { data: i } = It(t), u = Lt(t), m = zt(t), [h, p] = f.useState("general"), [x, c] = f.useState(""), [d, N] = f.useState(""), [y, b] = f.useState(""), v = f.useRef(null), w = f.useRef(null);
  i && w.current !== i.id && (w.current = i.id, c(i.description ?? ""));
  const { data: D = [] } = J({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var j, $, k, Z;
      return Promise.resolve((Z = (k = ($ = (j = window == null ? void 0 : window.apya) == null ? void 0 : j.platform) == null ? void 0 : $.tasks) == null ? void 0 : k.task) == null ? void 0 : Z.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4,
    meta: { persist: !1 }
  });
  if (f.useEffect(() => {
    const j = ($) => {
      $.key === "Escape" && ($.stopPropagation(), a == null || a());
    };
    return window.addEventListener("keydown", j), () => window.removeEventListener("keydown", j);
  }, [a]), !i) return null;
  const { canEdit: I, canChangeStatus: B, canDelete: E } = Oe(i), O = (g = (ae = (H = window == null ? void 0 : window.apya) == null ? void 0 : H.platform) == null ? void 0 : ae.tasks) == null ? void 0 : g.task, Y = be(i.status), q = ut(i.priority), F = u.items ?? [], M = F.filter((j) => j.isDone).length, U = F.length ? Math.round(M / F.length * 100) : 0, _ = m.attachments ?? [], V = { checklist: F.length, comments: D.length, files: _.length }, X = async () => {
    await n.invalidateQueries({ queryKey: ["task-detail", t] });
  }, Q = async (j) => {
    try {
      await Promise.resolve(j()), await X();
    } catch ($) {
      P($, "Alt görev güncellenemedi.");
    }
  }, T = (j) => Q(() => O.update(i.id, St(i, j))), L = () => Q(() => O.updateStatus(i.id, i.status >= 4 ? 1 : i.status + 1)), R = () => Q(() => O.setPriority(i.id, i.priority >= 4 ? 1 : i.priority + 1)), ee = () => {
    (i.description ?? "") !== x && T({ description: x || null });
  }, le = async () => {
    const j = d.trim();
    if (j) {
      N("");
      try {
        await u.addItem(j);
      } catch ($) {
        P($, "Madde eklenemedi.");
      }
    }
  }, oe = async () => {
    const j = y.trim();
    if (j) {
      b("");
      try {
        await Promise.resolve(O.addComment(i.id, j)), await n.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch ($) {
        P($, "Yorum gönderilemedi.");
      }
    }
  }, ce = async () => {
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(O.delete(i.id)), l == null || l(i.id), a == null || a();
      } catch (j) {
        P(j, "Alt görev silinemedi.");
      }
  }, ne = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
  return /* @__PURE__ */ e.jsxs(Ha, { open: !0, onClose: a, label: `${i.code} alt görev detayı`, children: [
    /* @__PURE__ */ e.jsx(
      "div",
      {
        "data-apya-overlay": !0,
        className: "absolute inset-0 bg-surface-overlay animate-fade-in-fast",
        onClick: a,
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
                  s,
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
                    className: `${ne} hover:bg-surface-hover hover:text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-up-right-from-square text-[11px]" })
                  }
                ),
                E && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Alt görevi sil",
                    onClick: ce,
                    className: `${ne} hover:bg-negative-subtle hover:text-negative`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Kapat",
                    onClick: a,
                    className: `${ne} hover:bg-surface-hover hover:text-text-primary`,
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
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold ${I ? "cursor-pointer" : "cursor-default"} ${q.bg} ${q.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${q.icon} text-[10px]` }),
                    q.label
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
                In(i.dueDate)
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
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: $n.map((j) => {
            const $ = h === j.code, k = V[j.code] ?? 0;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => p(j.code),
                className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${$ ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${j.icon} text-[11px] opacity-85` }),
                  /* @__PURE__ */ e.jsx("span", { children: j.title }),
                  k > 0 && /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-neutral-subtle text-text-tertiary text-[10px] font-extrabold", children: k })
                ]
              },
              j.code
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
                  onChange: (j) => c(j.target.value),
                  onBlur: I ? ee : void 0,
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
            h === "checklist" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px]", children: [
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
                      j.key === "Enter" && le();
                    },
                    placeholder: "Yeni madde yaz ve Enter'a bas…",
                    className: "h-9 mt-1 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                )
              ] })
            ] }),
            h === "comments" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] items-start", children: [
                /* @__PURE__ */ e.jsx(jt, { name: o, size: 30 }),
                /* @__PURE__ */ e.jsx(
                  "textarea",
                  {
                    rows: 2,
                    value: y,
                    onChange: (j) => b(j.target.value),
                    onKeyDown: (j) => {
                      j.key === "Enter" && !j.shiftKey && (j.preventDefault(), oe());
                    },
                    placeholder: "Yorum yaz ve Enter'a bas…",
                    className: "flex-1 min-w-0 px-3 py-2.5 rounded-[11px] border border-default bg-surface-base text-text-primary text-[12.5px] leading-[1.6] resize-none focus:border-focus focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: oe,
                    "aria-label": "Yorumu gönder",
                    className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] ${y.trim() ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
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
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: Bn(j.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: j.text })
                ] })
              ] }, j.id))
            ] }),
            h === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  ref: v,
                  type: "file",
                  className: "hidden",
                  onChange: (j) => {
                    var k;
                    const $ = (k = j.target.files) == null ? void 0 : k[0];
                    j.target.value = "", $ && m.upload($).catch((Z) => P(Z, "Dosya yüklenemedi."));
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
                const $ = Pn(j.fileName);
                return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${$.bg} ${$.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${$.icon} text-[13px]` }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: j.fileName }),
                    /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                      En(j.fileSize),
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
                      onClick: () => m.remove(j.id).catch((k) => P(k, "Dosya silinemedi.")),
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
                onClick: a,
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
const Wa = "apya.taskDetail.tabOrder", An = "taskdetail";
function ya() {
  try {
    const t = localStorage.getItem(Wa);
    if (!t) return [];
    const s = JSON.parse(t);
    return Array.isArray(s) ? s.filter((a) => typeof a == "string") : [];
  } catch {
    return [];
  }
}
function zn(t) {
  try {
    localStorage.setItem(Wa, JSON.stringify(t));
  } catch {
  }
}
function ga() {
  const t = document.querySelector("[data-tab-order]"), s = t == null ? void 0 : t.getAttribute("data-tab-order");
  if (!s) return null;
  try {
    const a = JSON.parse(s);
    return Array.isArray(a) ? a.map((r) => r == null ? void 0 : r.kind).filter((r) => typeof r == "string") : null;
  } catch {
    return null;
  }
}
function va(t) {
  try {
    const s = (document.cookie.match(/XSRF-TOKEN=([^;]+)/) || [])[1];
    fetch("/api/app/shell/set-board-tabs", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        RequestVerificationToken: s ? decodeURIComponent(s) : ""
      },
      body: JSON.stringify({
        scope: An,
        tabs: t.map((a) => ({ kind: a, ref: "", title: "" }))
      })
    }).catch(() => {
    });
  } catch {
  }
}
function Ln(t) {
  const [s, a] = f.useState(() => ga() ?? ya()), [r, l] = f.useState(null);
  f.useEffect(() => {
    if (ga() === null) {
      const m = ya();
      m.length && va(m);
    }
  }, []);
  const o = f.useMemo(() => {
    const m = new Map(t.map((p) => [p.code, p])), h = [];
    for (const p of s) {
      const x = m.get(p);
      x && (h.push(x), m.delete(p));
    }
    for (const p of t)
      m.has(p.code) && h.push(p);
    return h;
  }, [t, s]), n = f.useCallback((m) => {
    a((h) => {
      const p = r;
      if (!p || p === m) return h;
      const x = h.length ? h.slice() : o.map((N) => N.code), c = x.indexOf(p), d = x.indexOf(m);
      return c === -1 || d === -1 ? h : (x.splice(c, 1), x.splice(d, 0, p), x);
    });
  }, [r, o]), i = f.useCallback((m) => l(m), []), u = f.useCallback(() => {
    l(null), a((m) => {
      const h = m.length ? m : o.map((p) => p.code);
      return zn(h), va(h), h;
    });
  }, [o]);
  return { orderedTabs: o, draggingCode: r, handleDragStart: i, handleDragEnd: u, reorderTo: n };
}
function Mn(t) {
  const s = f.useRef(null);
  f.useEffect(() => {
    if (!(!t || typeof document > "u")) {
      if (s.current === null) {
        const a = document.title.lastIndexOf(" | ");
        s.current = a >= 0 ? document.title.slice(a) : "";
      }
      document.title = t + s.current;
    }
  }, [t]);
}
function Kn() {
  const [t, s] = f.useState(0), a = f.useRef(null), r = f.useCallback((l) => {
    var o;
    (o = a.current) == null || o.disconnect(), a.current = null, l && (s(l.getBoundingClientRect().width), !(typeof ResizeObserver > "u") && (a.current = new ResizeObserver((n) => {
      for (const i of n) s(i.contentRect.width);
    }), a.current.observe(l)));
  }, []);
  return f.useEffect(() => () => {
    var l;
    return (l = a.current) == null ? void 0 : l.disconnect();
  }, []), [r, t];
}
const Rn = 780;
function qn(t) {
  return t > 0 && t < Rn;
}
function Gn() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Yn() {
  const t = J({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: Gn,
    staleTime: 3e5,
    retry: !1
  }), s = t.data ?? [], a = _n(s), r = new Map(s.map((l) => [l.id, l.name]));
  return { options: a, nameById: r, isLoading: t.isLoading };
}
function _n(t) {
  const s = /* @__PURE__ */ new Map();
  return t.forEach((a) => s.set(a.name, (s.get(a.name) ?? 0) + 1)), t.map((a) => ({
    value: a.id,
    label: s.get(a.name) > 1 && a.code ? `${a.name} · ${a.code}` : a.name
  }));
}
function Un(t) {
  var a, r, l;
  const s = (l = (r = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : r.projects) == null ? void 0 : l.boardColumn;
  return s ? Promise.resolve(s.getListByProject(t, { abpHandleError: !1 })) : Promise.resolve([]);
}
function Vn(t) {
  const s = J({
    queryKey: ["task-detail", "board-columns", t],
    queryFn: () => Un(t),
    enabled: !!t,
    staleTime: 6e4,
    retry: !1,
    /* Kolonlar panoda her an yeniden adlandırılıp eklenebilir — kalıcı önbellekten
       bayat seçenek gelmesin. */
    meta: { persist: !1 }
  });
  return t ? s.data ?? [] : [];
}
const ja = "apya.taskDetail.fullscreen", ue = {
  ok: (t) => {
    var s, a, r;
    return (r = (a = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.notify) == null ? void 0 : a.success) == null ? void 0 : r.call(a, t);
  },
  info: (t) => {
    var s, a, r;
    return (r = (a = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.notify) == null ? void 0 : a.info) == null ? void 0 : r.call(a, t);
  },
  err: (t) => {
    var s, a, r;
    return (r = (a = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.notify) == null ? void 0 : a.error) == null ? void 0 : r.call(a, t);
  }
};
function On(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function Na() {
  var a;
  const t = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.currentUser;
  return [t == null ? void 0 : t.name, t == null ? void 0 : t.surName].filter((r) => r && String(r).trim()).join(" ").trim() || (t == null ? void 0 : t.userName) || "Ben";
}
function Ja({ taskId: t, presentation: s = "modal", onClose: a, switchToTask: r }) {
  const [l, o] = f.useState(t), { data: n, isPending: i, isError: u, error: m, refetch: h } = It(l), p = re(), x = Ta(), c = za(n), d = La(), N = Yn(), y = Vn(
    n != null && n.projectId && c.values.projectId === n.projectId ? n.projectId : null
  ), b = Ma(l), v = Lt(l), [w, D] = f.useState("general"), [I, B] = f.useState(!1), [E, O] = f.useState(!1), [Y, q] = f.useState(!1), [F, M] = f.useState(null), [U, _] = f.useState(null), [V, X] = f.useState(!1), [Q, T] = f.useState(!1), [L, R] = f.useState(() => {
    try {
      return localStorage.getItem(ja) === "true";
    } catch {
      return !1;
    }
  });
  Fa(s === "page" ? null : l), Mn(s === "page" ? n == null ? void 0 : n.title : null);
  const [ee, le] = Kn(), oe = qn(le), [ce, ne] = f.useState(null);
  n != null && n.id && n.id !== ce && (ne(n.id), X(!!n.isFavorite), T(!!n.isWatched)), f.useEffect(() => {
    c.isDirty ? x.markDirty() : x.markClean();
  }), f.useEffect(() => {
    const C = p.getQueryCache().subscribe((A) => {
      var ie;
      A.type === "updated" && ((ie = A.action) == null ? void 0 : ie.type) === "invalidate" && !Is(A.query.queryKey) && W.markChanged();
    }), S = p.getMutationCache().subscribe((A) => {
      A.type === "added" && W.markChanged();
    });
    return () => {
      C(), S();
    };
  }, [p]);
  const H = f.useCallback(() => {
    At(), a == null || a();
  }, [a]), ae = f.useCallback(() => {
    I || (q(!1), x.requestClose(H));
  }, [x, H, I]), g = (C) => {
    q(!1), x.requestClose(() => (r ?? o)(C));
  }, j = f.useCallback(() => {
    R((C) => {
      const S = !C;
      try {
        localStorage.setItem(ja, String(S));
      } catch {
      }
      return S;
    });
  }, []), $ = f.useMemo(
    () => Va(b.assignedCodes),
    [b.assignedCodes]
  ), k = Ln($), Z = f.useMemo(
    () => Oa(b.assignedCodes),
    [b.assignedCodes]
  ), z = (C, S) => {
    if (S) {
      D(C);
      return;
    }
    xs(C);
  }, K = f.useMemo(() => {
    var C, S, A, ie, pe;
    return {
      subtasks: ((C = n == null ? void 0 : n.subTasks) == null ? void 0 : C.length) ?? 0,
      files: ((S = n == null ? void 0 : n.attachments) == null ? void 0 : S.length) ?? 0,
      dependencies: ((A = n == null ? void 0 : n.predecessorIds) == null ? void 0 : A.length) ?? 0,
      comments: ((ie = n == null ? void 0 : n.comments) == null ? void 0 : ie.length) ?? 0,
      checklist: ((pe = v.items) == null ? void 0 : pe.length) ?? 0
    };
  }, [n, v.items]), G = Je.find((C) => C.code === w), fe = v.items ?? [], Kt = fe.filter((C) => C.isDone).length, Xa = fe.length ? Math.round(Kt / fe.length * 100) : 0, Rt = f.useRef(null), [qt, es] = f.useState(0), Gt = () => c.validate() ? !0 : (ue.err(xe("Tasks:Detail:Validation:Summary", "Kaydedilemedi: işaretli alanları düzeltin.")), es((C) => C + 1), !1);
  f.useEffect(() => {
    var S, A;
    if (!qt) return;
    const C = (S = Rt.current) == null ? void 0 : S.querySelector('[aria-invalid="true"]');
    C == null || C.focus(), (A = C == null ? void 0 : C.scrollIntoView) == null || A.call(C, { block: "nearest" });
  }, [qt]);
  const Ze = f.useCallback(async () => {
    if (!Gt()) return !1;
    B(!0);
    try {
      const C = c.values, S = await Promise.resolve(window.apya.platform.tasks.task.update(l, c.toUpdateDto()));
      await p.invalidateQueries({ queryKey: ["task-detail", l] });
      const A = p.getQueryState(["task-detail", l]);
      return c.commitSaved(C, (A == null ? void 0 : A.status) === "success" ? A.data : S), W.emitResult(), O(!0), setTimeout(() => O(!1), 2e3), ue.ok("Görev başarıyla güncellendi."), !0;
    } catch (C) {
      return P(C, "Kaydedilemedi."), !1;
    } finally {
      B(!1);
    }
  }, [l, c, p]), ts = () => {
    q(!1), x.resolvePendingClose("stay");
  }, as = () => {
    q(!1), c.reset(), x.resolvePendingClose("discard");
  }, ss = async () => {
    if (q(!1), !Gt()) {
      x.resolvePendingClose("stay");
      return;
    }
    await Ze() ? x.resolvePendingClose("saved") : q(!0);
  };
  f.useEffect(() => {
    const C = (S) => {
      if ((S.ctrlKey || S.metaKey) && S.key.toLowerCase() === "s") {
        S.preventDefault(), c.isDirty && !I && !x.pendingClose && Ze();
        return;
      }
      S.key === "Escape" && F && (S.stopPropagation(), M(null));
    };
    return window.addEventListener("keydown", C), () => window.removeEventListener("keydown", C);
  }, [Ze, c.isDirty, I, F, x.pendingClose]);
  const Ee = () => {
    var C, S, A;
    return (A = (S = (C = window == null ? void 0 : window.apya) == null ? void 0 : C.platform) == null ? void 0 : S.tasks) == null ? void 0 : A.task;
  }, rs = async () => {
    var S;
    const C = !V;
    X(C), W.markChanged();
    try {
      await Promise.resolve((S = Ee()) == null ? void 0 : S.toggleFavorite(l));
    } catch (A) {
      X(!C), P(A, "Favori güncellenemedi.");
    }
  }, ns = () => {
    if (!l) return;
    const C = document.createElement("a");
    C.href = `/Tasks/Detail/${l}?handler=Pdf`, C.rel = "noopener", document.body.appendChild(C), C.click(), C.remove();
  }, is = async () => {
    var S;
    const C = !Q;
    T(C), W.markChanged();
    try {
      await Promise.resolve((S = Ee()) == null ? void 0 : S.toggleWatch(l)), ue.info(C ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (A) {
      T(!C), P(A, "Takip durumu güncellenemedi.");
    }
  }, ls = async () => {
    var C, S;
    W.markChanged();
    try {
      const A = await Promise.resolve((C = Ee()) == null ? void 0 : C.transfer(l, {
        mode: 2,
        // Copy
        targetProjectIds: n != null && n.projectId ? [n.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await p.invalidateQueries({ queryKey: ["task-detail"] }), ue.ok("Görev çoğaltıldı.");
      const ie = (S = A == null ? void 0 : A.createdTaskIds) == null ? void 0 : S[0];
      ie && g(ie);
    } catch (A) {
      P(A, "Görev çoğaltılamadı.");
    }
  }, Yt = async (C, S, A, ie) => {
    var pe, me;
    W.markChanged();
    try {
      await Promise.resolve(ie ? ie() : (pe = Ee()) == null ? void 0 : pe.updateStatus(l, C)), await p.invalidateQueries({ queryKey: ["task-detail", l] }), c.setField("status", C), c.setField(
        "boardColumnId",
        ((me = p.getQueryData(["task-detail", l])) == null ? void 0 : me.boardColumnId) ?? null
      ), ue.info(S);
    } catch (ve) {
      P(ve, A);
    }
  }, os = () => Yt(4, "Görev arşivlendi (Tamamlandı).", "Görev arşivlenemedi."), cs = async () => {
    let C = null;
    if (window.Swal) {
      const S = await window.Swal.fire({
        title: "Görev iptal edilsin mi?",
        input: "text",
        inputLabel: "İptal nedeni (isteğe bağlı)",
        inputAttributes: { maxlength: 256 },
        showCancelButton: !0,
        confirmButtonText: "İptal et",
        cancelButtonText: "Vazgeç"
      });
      if (!S.isConfirmed) return;
      C = (S.value || "").trim() || null;
    }
    await Yt(
      0,
      "Görev iptal edildi.",
      "Görev iptal edilemedi.",
      () => {
        var S;
        return (S = Ee()) == null ? void 0 : S.cancel(l, C);
      }
    );
  }, ds = async () => {
    var C;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?")) {
      W.markChanged();
      try {
        await Promise.resolve((C = Ee()) == null ? void 0 : C.delete(l)), ue.info("Görev silindi."), x.markClean(), H();
      } catch (S) {
        P(S, "Görev silinemedi.");
      }
    }
  }, xs = async (C) => {
    try {
      await b.addFeature(C), D(C), ue.ok("Özellik başarıyla eklendi.");
    } catch (S) {
      P(S, "Özellik eklenemedi.");
    }
  }, _t = async (C) => {
    try {
      await b.removeFeature(C), D("general"), ue.info("Özellik görevden kaldırıldı.");
    } catch (S) {
      P(S, "Özellik kaldırılamadı.");
    }
  }, us = async (C) => {
    var ie, pe, me, ve, Be, et, Re;
    const S = ((ve = (me = (pe = (ie = window == null ? void 0 : window.apya) == null ? void 0 : ie.platform) == null ? void 0 : pe.application) == null ? void 0 : me.projects) == null ? void 0 : ve.project) ?? ((Re = (et = (Be = window == null ? void 0 : window.apya) == null ? void 0 : Be.platform) == null ? void 0 : et.projects) == null ? void 0 : Re.project);
    if (!(S != null && S.create)) throw new Error("Proje servisi yüklenmedi.");
    const A = await Promise.resolve(S.create({
      name: C,
      code: On(C),
      currency: "TRY"
    }));
    return await p.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), ue.ok(`“${C}” projesi oluşturuldu.`), (A == null ? void 0 : A.id) ?? A;
  }, ps = async ({ mode: C, targetProjectIds: S, include: A }) => {
    var ie, pe;
    W.markChanged();
    try {
      const me = await Promise.resolve((ie = Ee()) == null ? void 0 : ie.transfer(l, {
        mode: C === "move" ? 1 : 2,
        targetProjectIds: S,
        include: A
      }));
      await p.invalidateQueries({ queryKey: ["task-detail", l] }), C === "move" && c.setField("projectId", S[0]);
      const ve = S.map((et) => {
        var Re;
        return (Re = N.options.find((hs) => hs.value === et)) == null ? void 0 : Re.label;
      }).filter(Boolean), Be = ((pe = me == null ? void 0 : me.createdTaskIds) == null ? void 0 : pe.length) ?? 0;
      ue.ok(C === "move" ? Be ? `“${ve[0]}” projesine taşındı, ${Be} projeye kopyalandı.` : `Görev “${ve[0]}” projesine taşındı.` : Be > 1 ? `${Be} projeye kopyalandı.` : `Kopya “${ve[0]}” projesinde oluşturuldu.`), M(null);
    } catch (me) {
      P(me, "Transfer tamamlanamadı.");
    }
  }, { canEdit: Xe, canChangeStatus: ms, canDelete: fs } = Oe(n), bs = w === "general" ? /* @__PURE__ */ e.jsxs(
    "div",
    {
      ref: ee,
      className: `grid gap-5 items-start ${oe ? "grid-cols-[minmax(0,1fr)]" : "grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)]"}`,
      children: [
        /* @__PURE__ */ e.jsx(
          gn,
          {
            task: n,
            onFieldChange: c.setField,
            descriptionValue: c.values.description,
            checklist: v,
            readOnly: !Xe,
            currentUserName: Na()
          }
        ),
        /* @__PURE__ */ e.jsx(
          "div",
          {
            className: oe ? "w-full grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3.5" : "w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5",
            children: /* @__PURE__ */ e.jsx(yn, { task: n, nameById: d.nameById })
          }
        )
      ]
    }
  ) : kn(w) ? /* @__PURE__ */ e.jsx(
    ba,
    {
      code: w,
      onRemoveFeature: _t,
      pickerEntries: Z,
      onPickFeature: z,
      canRemove: !(G != null && G.isCore)
    }
  ) : /* @__PURE__ */ e.jsx(f.Suspense, { fallback: /* @__PURE__ */ e.jsx(ke, { className: "h-48 w-full" }), children: G != null && G.component ? /* @__PURE__ */ e.jsx(
    G.component,
    {
      taskId: l,
      task: n,
      form: c,
      nameById: d.nameById,
      onOpenSubtask: _,
      readOnly: !Xe
    }
  ) : /* @__PURE__ */ e.jsx(
    ba,
    {
      code: w,
      onRemoveFeature: _t,
      pickerEntries: Z,
      onPickFeature: z,
      canRemove: !(G != null && G.isCore)
    }
  ) }), Ke = u && ((m == null ? void 0 : m.status) === 404 || (m == null ? void 0 : m.status) === 403) ? m.status : null, Ut = i ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(ke, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(ke, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(ke, { className: "h-64 w-full" })
  ] }) : Ke ? /* @__PURE__ */ e.jsx(
    ys,
    {
      variant: Ke === 404 ? "error" : "locked",
      icon: Ke === 404 ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-magnifying-glass" }) : void 0,
      title: Ke === 404 ? xe("Tasks:Detail:NotFound:Title", "Bu görev bulunamadı") : xe("Tasks:Detail:Forbidden:Title", "Bu görevi görüntüleyemezsiniz"),
      description: Ke === 404 ? xe("Tasks:Detail:NotFound:Body", "Görev silinmiş ya da bağlantı eskimiş olabilir.") : gs(m),
      action: s === "page" ? /* @__PURE__ */ e.jsx(se, { asChild: !0, size: "sm", children: /* @__PURE__ */ e.jsxs("a", { href: "/Tasks", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-left", "aria-hidden": "true" }),
        xe("Tasks:Detail:BackToList", "Görevlere dön")
      ] }) }) : /* @__PURE__ */ e.jsx(se, { variant: "secondary", size: "sm", onClick: ae, children: xe("Common:Close", "Kapat") })
    }
  ) : u && !n ? (
    /* Yalnız İLK yükleme hatası. Görev ekrandayken düşen tazeleme (odak dönüşü, kayıt sonrası
       yeniden çekme; oturum düşünce 401) formu sökmez: yazılanlar görünür kalır, sonraki
       başarılı tazeleme forma işlenir (useTaskForm rebase). */
    /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
      /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
      /* @__PURE__ */ e.jsx(vs, { onRetry: h })
    ] })
  ) : /* @__PURE__ */ e.jsxs("div", { ref: Rt, className: "flex flex-col flex-1 min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      pn,
      {
        task: n,
        presentation: s,
        onClose: ae,
        isFullscreen: L,
        onToggleFullscreen: j,
        onFieldChange: c.setField,
        statusValue: c.values.status,
        boardColumns: y,
        boardColumnValue: c.values.boardColumnId,
        titleValue: n == null ? void 0 : n.title,
        titleError: c.errors.title,
        isPrivateValue: c.values.isPrivate,
        isFavorite: V,
        onToggleFavorite: rs,
        isWatched: Q,
        onToggleWatch: is,
        onDuplicate: ls,
        onArchive: os,
        onCancelTask: cs,
        onDelete: ds,
        onOpenTransfer: (C) => M({ mode: C }),
        onExportPdf: ns,
        canEdit: Xe,
        canChangeStatus: ms,
        canDelete: fs
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        mn,
        {
          task: n,
          assigneeOptions: d.options,
          projectOptions: N.options,
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
          progressPercent: Xa,
          progressNote: `${Kt}/${fe.length} madde`,
          onOpenTransfer: (C) => M({ mode: C }),
          readOnly: !Xe
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        s === "page" && /* @__PURE__ */ e.jsx(
          hn,
          {
            activeTab: w,
            onTabChange: D,
            orderedTabs: k.orderedTabs,
            draggingCode: k.draggingCode,
            onDragStart: k.handleDragStart,
            onDragEnd: k.handleDragEnd,
            onReorderTo: k.reorderTo,
            onReorderDrop: () => ue.info("Sekme sırası güncellendi."),
            pickerEntries: Z,
            onPickFeature: z,
            counts: K
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: s === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            bn,
            {
              activeTab: w,
              onTabChange: D,
              orderedTabs: k.orderedTabs,
              draggingCode: k.draggingCode,
              onDragStart: k.handleDragStart,
              onDragEnd: k.handleDragEnd,
              onReorderTo: k.reorderTo,
              onReorderDrop: () => ue.info("Sekme sırası güncellendi."),
              pickerEntries: Z,
              onPickFeature: z,
              counts: K,
              isDirty: c.isDirty
            }
          ) }),
          /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised", children: bs })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(
      vn,
      {
        lastSavedAt: n == null ? void 0 : n.lastModificationTime,
        isDirty: c.isDirty,
        isSaving: I,
        justSaved: E,
        onCancel: ae,
        onSave: Ze,
        sticky: s === "page"
      }
    )
  ] }), Vt = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      Sn,
      {
        open: !!F,
        mode: (F == null ? void 0 : F.mode) ?? "move",
        onClose: () => M(null),
        onConfirm: ps,
        projectOptions: N.options,
        currentProjectId: c.values.projectId,
        counts: K,
        onCreateProject: us
      }
    ),
    U && /* @__PURE__ */ e.jsx(
      Fn,
      {
        subtaskId: U,
        parentCode: n == null ? void 0 : n.code,
        onClose: () => _(null),
        onOpenFull: (C) => {
          _(null), g(C);
        },
        onDeleted: () => p.invalidateQueries({ queryKey: ["task-detail", l] }),
        currentUserName: Na()
      }
    ),
    /* @__PURE__ */ e.jsx(
      Et,
      {
        open: x.pendingClose,
        isSaving: I,
        errorText: Y ? xe("Common:Unsaved:SaveFailed", "Kaydedilemedi. Düzenlemeye dönebilir ya da değişiklikleri atabilirsiniz.") : void 0,
        onStay: ts,
        onDiscard: as,
        onSave: ss
      }
    )
  ] });
  return s === "page" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col w-full min-h-[calc(100vh-54px)] border-y border-subtle bg-surface-base", children: Ut }),
    Vt
  ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx($t, { open: !0, onOpenChange: (C) => {
      C || ae();
    }, children: /* @__PURE__ */ e.jsx(
      Pt,
      {
        title: n != null && n.title ? `Görev Detayı: ${n.title}` : "Görev Detayı",
        fullscreen: L,
        className: L ? "p-0 rounded-xl border border-default shadow-xl short:h-[100svh]" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl short:h-[100svh]",
        onInteractOutside: (C) => {
          var S, A;
          C.preventDefault(), !(F || U || x.pendingClose) && ((A = (S = C.target) == null ? void 0 : S.closest) != null && A.call(S, "[data-apya-overlay]") || ae());
        },
        onEscapeKeyDown: (C) => {
          if (F || U) {
            C.preventDefault();
            return;
          }
          if (document.querySelector(".modal.show")) {
            C.preventDefault();
            return;
          }
          C.preventDefault(), ae();
        },
        children: Ut
      }
    ) }),
    Vt
  ] });
}
function Qn(t) {
  window.location.assign("/Tasks/Detail/" + encodeURIComponent(t));
}
function Hn() {
  const t = f.useSyncExternalStore(
    W.subscribe,
    W.getSnapshot,
    () => null
  );
  return t ? /* @__PURE__ */ e.jsx(js, { name: "task-detail", fallback: (s) => /* @__PURE__ */ e.jsx(Wn, { ...s }), children: /* @__PURE__ */ e.jsx(Jn, { taskId: t }) }) : null;
}
function Wn(t) {
  const s = () => {
    var a;
    At(), W.close(), (a = window.apya) != null && a.taskDetailV3Enabled ? W.emitResultIfChanged() : W.emitResult();
  };
  return /* @__PURE__ */ e.jsx($t, { open: !0, onOpenChange: (a) => {
    a || s();
  }, children: /* @__PURE__ */ e.jsx(
    Pt,
    {
      title: xe("Common:SectionError:Title", "Bu bölüm gösterilemedi"),
      className: "w-full max-w-[480px] h-auto tablet:min-h-0 justify-center p-6",
      children: /* @__PURE__ */ e.jsx(Ns, { ...t, onClose: s })
    }
  ) });
}
function Jn({ taskId: t }) {
  var s;
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(ot, { children: /* @__PURE__ */ e.jsx(
    Ja,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        W.close(), W.emitResultIfChanged();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(ot, { children: /* @__PURE__ */ e.jsx(
    Qa,
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
function Za() {
  var a;
  try {
    const r = new URLSearchParams(window.location.search).get("taskui");
    if (r === "v1" || r === "v2" || r === "v3") return r;
  } catch {
  }
  const t = document.getElementById("task-detail-island"), s = (a = t == null ? void 0 : t.dataset) == null ? void 0 : a.taskui;
  return s === "v1" || s === "v2" ? s : "v3";
}
function Zn() {
  return Za() === "v2";
}
function Xn() {
  return Za() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = Xn();
window.apya.taskDetailV2Enabled = Zn() && !window.apya.taskDetailV3Enabled;
const wa = {
  open: (t) => {
    W.open(t);
  },
  close: () => W.close(),
  onResult: (t) => W.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(wa) : window.apya.taskDetail = wa;
function ka() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = Ca(t, "task-detail", /* @__PURE__ */ e.jsx(Hn, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const s = Ia();
    s && W.open(s);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", ka) : ka();
function ei({ taskId: t }) {
  var a;
  const s = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(ot, { children: /* @__PURE__ */ e.jsx(
    Ja,
    {
      taskId: t,
      presentation: "page",
      onClose: s,
      switchToTask: Qn
    }
  ) }) : /* @__PURE__ */ e.jsx(ot, { children: /* @__PURE__ */ e.jsx(
    Qa,
    {
      taskId: t,
      presentation: "page",
      onClose: s
    }
  ) });
}
const Nt = document.getElementById("task-detail-page-island");
if (Nt) {
  const t = Nt.getAttribute("data-task-id");
  t && Ca(Nt, "task-detail-page", /* @__PURE__ */ e.jsx(ei, { taskId: t }));
}
