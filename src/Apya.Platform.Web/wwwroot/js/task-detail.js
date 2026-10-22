import { j as e, r as p, b as Me } from "./react-vendor-D7YDiBbi.js";
import { t as ue, n as E, E as ys, e as gs, R as vs, m as Da, I as js, a as Ns } from "./index-DgpuJ91w.js";
import { D as It, g as Ft, d as Tt, B as re, I as He, M as ws } from "./Dialog-D3HpJNIB.js";
import { a as dt } from "./QueryProvider-D2Hvqdr9.js";
import { u as Q, a as ne, b as te } from "./query-vendor-Db2mwxYI.js";
import { C as Ta } from "./Combobox-CHhgTuMW.js";
import { U as At, u as Sa } from "./useDirtyGuard-D_9NgM7w.js";
import { i as Xe, a as et, s as he, p as ft, d as $a, b as Qt, R as Pa, c as ze, e as Ea, f as Ba, g as ks, P as Cs } from "./RichTextEditorV3-CsU1qQrh.js";
import { r as Ds } from "./httpClient-BNoyY5yK.js";
import { S as Ce } from "./Skeleton-C92LWNeC.js";
import { R as De, T as Te, P as Se, C as $e, A as Ts, a as zt, D as Ss, b as $s, c as Ps, d as Es, e as Bs } from "./ui-vendor-UYevF8mE.js";
import { d as Ia } from "./draggableActivation-Ybw9Upbh.js";
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
    It,
    {
      open: t,
      onOpenChange: (i) => {
        i || s();
      },
      children: /* @__PURE__ */ e.jsx(
        Ft,
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
const St = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, $t = {
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
  const [n, i] = p.useState(!1), x = p.useRef(null);
  p.useEffect(() => {
    if (!n) return;
    const b = (N) => {
      x.current && !x.current.contains(N.target) && i(!1);
    }, f = (N) => {
      N.key === "Escape" && i(!1);
    };
    return document.addEventListener("mousedown", b), document.addEventListener("keydown", f), () => {
      document.removeEventListener("mousedown", b), document.removeEventListener("keydown", f);
    };
  }, [n]);
  const u = St[t == null ? void 0 : t.status] ?? St[1], h = $t[t == null ? void 0 : t.priority] ?? $t[2], m = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), i(!1);
  }, d = () => {
    var f, N, y, w;
    const b = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (f = navigator.clipboard) == null || f.writeText(b), (w = (y = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : y.info) == null || w.call(y, "Bağlantı kopyalandı."), i(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(Tt, { variant: u.variant, children: u.text }),
        /* @__PURE__ */ e.jsx(Tt, { variant: h.variant, children: h.text }),
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
      /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: x, children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": n,
            onClick: () => i((b) => !b),
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
      /* @__PURE__ */ e.jsx(re, { variant: "secondary", onClick: r, disabled: a, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        re,
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
const Ht = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Rs = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function Ne({ label: t, htmlFor: s, error: a, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: s, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    a && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: a })
  ] });
}
function qs({ value: t, onChange: s }) {
  const [a, r] = p.useState(""), l = () => {
    const o = a.trim();
    o && !t.includes(o) && s([...t, o]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((o) => /* @__PURE__ */ e.jsxs(Tt, { variant: "neutral", children: [
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
      He,
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
    /* @__PURE__ */ e.jsx(Ne, { label: "Başlık", htmlFor: "task-title", error: s.title, children: /* @__PURE__ */ e.jsx(
      He,
      {
        id: "task-title",
        value: t.title,
        onChange: (o) => a("title", o.target.value),
        invalid: !!s.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(Ne, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (o) => a("status", Number(o.target.value)),
          className: Ht,
          children: Object.entries(St).map(([o, n]) => /* @__PURE__ */ e.jsx("option", { value: o, children: n.text }, o))
        }
      ) }),
      /* @__PURE__ */ e.jsx(Ne, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (o) => a("priority", Number(o.target.value)),
          className: Ht,
          children: Object.entries($t).map(([o, n]) => /* @__PURE__ */ e.jsx("option", { value: o, children: n.text }, o))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(Ne, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      Ta,
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
      /* @__PURE__ */ e.jsx(Ne, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: s.startDate, children: /* @__PURE__ */ e.jsx(
        He,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (o) => a("startDate", o.target.value),
          invalid: !!s.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(Ne, { label: "Son Tarih", htmlFor: "task-due", error: s.dueDate, children: /* @__PURE__ */ e.jsx(
        He,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (o) => a("dueDate", o.target.value),
          invalid: !!s.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(Ne, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(qs, { value: t.tagNames, onChange: (o) => a("tagNames", o) }) }),
    /* @__PURE__ */ e.jsx(Ne, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
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
const Wt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function _e({ label: t, value: s }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: s ?? "—" })
  ] });
}
function Ys({ task: t, creatorName: s, lastModifierName: a }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(_e, { label: "Oluşturan", value: s }),
      /* @__PURE__ */ e.jsx(_e, { label: "Oluşturulma zamanı", value: Wt(t.creationTime) }),
      /* @__PURE__ */ e.jsx(_e, { label: "Güncelleyen", value: a }),
      /* @__PURE__ */ e.jsx(_e, { label: "Son güncelleme zamanı", value: Wt(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(_e, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const Us = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", _s = "border-brand-500 text-text-primary";
function Vs({ tabs: t, activeCode: s, onSelect: a, onOpenPicker: r, pickerOpen: l }) {
  const o = p.useRef(/* @__PURE__ */ new Map()), n = (x) => {
    var u;
    a(x.code), (u = o.current.get(x.code)) == null || u.focus();
  }, i = (x, u) => {
    x.key === "ArrowRight" ? (x.preventDefault(), n(t[(u + 1) % t.length])) : x.key === "ArrowLeft" ? (x.preventDefault(), n(t[(u - 1 + t.length) % t.length])) : x.key === "Home" ? (x.preventDefault(), n(t[0])) : x.key === "End" && (x.preventDefault(), n(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((x, u) => {
      const h = x.code === s;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (m) => {
            m ? o.current.set(x.code, m) : o.current.delete(x.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${x.code}`,
          "aria-selected": h,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: h ? 0 : -1,
          onClick: () => a(x.code),
          onKeyDown: (m) => i(m, u),
          className: `${Us} ${h ? _s : ""}`,
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
const Os = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Qs({ entries: t, onAdd: s, onRemove: a, busyCode: r }) {
  const [l, o] = p.useState(""), n = p.useMemo(() => {
    const i = l.trim().toLocaleLowerCase("tr-TR"), x = i ? t.filter((h) => h.title.toLocaleLowerCase("tr-TR").includes(i)) : t, u = /* @__PURE__ */ new Map();
    return x.forEach((h) => {
      const m = u.get(h.category) ?? [];
      m.push(h), u.set(h.category, m);
    }), u;
  }, [t, l]);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Özellik ekle",
      className: "absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl",
      children: [
        /* @__PURE__ */ e.jsx(
          He,
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
          [...n.entries()].map(([i, x]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: Os[i] ?? i }),
            x.map((u) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa ${u.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: u.title }),
              !u.implemented && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              u.implemented && !u.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === u.code,
                  onClick: () => s(u.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              u.implemented && u.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === u.code,
                  onClick: () => a(u.code),
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
function Hs({ trail: t = [], current: s, onNavigate: a }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((r) => /* @__PURE__ */ e.jsxs(Me.Fragment, { children: [
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
    var x;
    const i = (x = a == null ? void 0 : a.jqXHR) == null ? void 0 : x.status;
    throw n && typeof n == "object" && n.status == null && i && (n.status = i), n;
  });
}
function Lt(t) {
  return Q({
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
  var s, a, r;
  return !!((r = (a = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.auth) == null ? void 0 : a.isGranted) != null && r.call(a, t));
}
const Js = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, Mt = "task";
function Fa() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(Mt);
  return t && Js.test(t) ? t : null;
}
function Kt() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(Mt), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function Aa(t, s) {
  const a = p.useRef(s);
  a.current = s, p.useEffect(() => {
    if (!t || Fa() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(Mt, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), p.useEffect(() => {
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
function Jt(t) {
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
const za = (t, s) => JSON.stringify(t) === JSON.stringify(s);
function Zt(t, s, a) {
  const r = {};
  for (const l of Object.keys(a)) r[l] = za(t[l], s[l]) ? a[l] : t[l];
  return r;
}
function La(t) {
  const [s, a] = p.useState(t == null ? void 0 : t.id), r = p.useMemo(() => Jt(t), [t]), [l, o] = p.useState(r), [n, i] = p.useState(r), [x, u] = p.useState({});
  if ((t == null ? void 0 : t.id) !== s || r !== l && !za(r, l)) {
    const y = (t == null ? void 0 : t.id) !== void 0 && t.id === s;
    a(t == null ? void 0 : t.id), o(r), i(y ? Zt(n, l, r) : r), y || u({});
  }
  const h = p.useCallback((y, w) => {
    i((c) => ({ ...c, [y]: w })), u((c) => {
      if (!c[y] && !(y === "startDate" && c.dueDate)) return c;
      const v = { ...c };
      return delete v[y], y === "startDate" && delete v.dueDate, v;
    });
  }, []), m = p.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(r),
    [n, r]
  ), d = p.useCallback(() => {
    const y = {};
    return n.title.trim() || (y.title = ue("Tasks:Detail:Validation:TitleRequired", "Başlık zorunlu.")), n.startDate || (y.startDate = ue("Tasks:Detail:Validation:StartDateRequired", "Başlangıç tarihi zorunlu.")), n.dueDate && n.startDate && n.dueDate < n.startDate && (y.dueDate = ue("Tasks:Detail:Validation:DueBeforeStart", "Son tarih başlangıç tarihinden önce olamaz.")), u(y), Object.keys(y).length === 0;
  }, [n]), b = p.useCallback(() => ({
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
  }), [n, t]), f = p.useCallback(() => {
    i(r), u({});
  }, [r]), N = p.useCallback((y, w) => {
    if (!w) return;
    const c = Jt(w);
    i((v) => Zt(v, y, c));
  }, []);
  return { values: n, setField: h, isDirty: m, errors: x, validate: d, toUpdateDto: b, reset: f, commitSaved: N };
}
function Xt(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function Xs() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ma() {
  var l;
  const t = Q({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Xs,
    staleTime: 3e5,
    retry: !1
  }), s = ((l = t.data) == null ? void 0 : l.items) ?? [], a = s.map((o) => ({ value: o.id, label: Xt(o) })), r = new Map(s.map((o) => [o.id, Xt(o)]));
  return { options: a, nameById: r, isLoading: t.isLoading };
}
function Pt() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function er(t) {
  const s = Pt();
  return s ? Promise.resolve(s.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ka(t) {
  const s = ne(), a = ["task-features", t], r = Q({
    queryKey: a,
    queryFn: () => er(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => s.invalidateQueries({ queryKey: a }), o = te({
    mutationFn: (i) => Promise.resolve(Pt().addFeature(t, i)),
    onSuccess: l
  }), n = te({
    mutationFn: (i) => Promise.resolve(Pt().removeFeature(t, i)),
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
function Je(t) {
  var r, l;
  const s = (l = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.currentUser) == null ? void 0 : l.id, a = !!(s && ((t == null ? void 0 : t.creatorId) === s || (t == null ? void 0 : t.assigneeId) === s)) || oe("Platform.Projects.ManageTeam");
  return {
    canManage: a,
    canEdit: a && oe("Platform.Tasks.Edit"),
    canChangeStatus: a && oe("Platform.Tasks.ChangeStatus"),
    canDelete: a && oe("Platform.Tasks.Delete")
  };
}
const Ra = "rounded-2xl border border-subtle bg-surface-base shadow-xs", Pe = `${Ra} overflow-hidden`;
function Ze({ title: t, badge: s, action: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3.5 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: t }),
      s
    ] }),
    a
  ] });
}
function qa({ children: t, tone: s = "positive" }) {
  const a = s === "positive" ? "bg-success-subtle text-success" : "bg-neutral-subtle text-text-secondary";
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-full font-mono text-[11px] font-bold ${a}`, children: t });
}
function Ee({ children: t, bg: s, fg: a }) {
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-[7px] text-[10.5px] font-bold ${s} ${a}`, children: t });
}
function ye({ icon: t, title: s, description: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 px-6 py-10 text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-xl text-text-tertiary` }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: s }),
    a && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] leading-[1.55] text-text-tertiary max-w-[420px]", children: a })
  ] });
}
function bt({ name: t, size: s = 24 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: s, width: s, background: et(t), fontSize: s * 0.4 },
      title: t || void 0,
      children: Xe(t)
    }
  );
}
const Re = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—", xt = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function Ga(t) {
  return t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : "0 KB";
}
function yt(t) {
  const s = Math.max(0, Math.floor(t || 0)), a = Math.floor(s / 3600), r = Math.floor(s % 3600 / 60);
  return !a && !r ? `${s}sn` : a ? r ? `${a}s ${r}dk` : `${a}s` : `${r}dk`;
}
function tr(t) {
  const s = Math.max(0, Math.floor(t || 0)), a = (r) => String(r).padStart(2, "0");
  return `${a(Math.floor(s / 3600))}:${a(Math.floor(s / 60) % 60)}:${a(s % 60)}`;
}
const ke = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  image: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  sheet: { icon: "fa-file-excel", bg: "bg-success-subtle", fg: "text-success" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  zip: { icon: "fa-file-zipper", bg: "bg-warning-subtle", fg: "text-warning" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
}, ea = (t = "") => Ya(t) === ke.image;
function Ya(t = "") {
  var a;
  const s = ((a = t.split(".").pop()) == null ? void 0 : a.toLowerCase()) ?? "";
  return s === "pdf" ? ke.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(s) ? ke.image : ["doc", "docx", "odt", "rtf", "txt"].includes(s) ? ke.doc : ["xls", "xlsx", "csv", "ods"].includes(s) ? ke.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(s) ? ke.code : ["zip", "rar", "7z", "tar", "gz"].includes(s) ? ke.zip : ke.other;
}
function ar({ taskId: t, task: s, onOpenSubtask: a }) {
  const [r, l] = p.useState(""), [o, n] = p.useState(!1), i = ne(), x = (s == null ? void 0 : s.subTasks) ?? [], u = x.filter((b) => b.status === 4).length, h = () => i.invalidateQueries({ queryKey: ["task-detail", t] }), m = async () => {
    const b = r.trim();
    if (b) {
      n(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: b,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: s == null ? void 0 : s.projectId
        })), l(""), await h();
      } catch (f) {
        E(f, "Alt görev eklenemedi.");
      } finally {
        n(!1);
      }
    }
  }, d = async (b, f) => {
    b.stopPropagation();
    try {
      await Promise.resolve(window.apya.platform.tasks.task.updateStatus(f.id, f.status === 4 ? 1 : 4)), await h();
    } catch (N) {
      E(N, "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        x.length > 0 && /* @__PURE__ */ e.jsxs(qa, { children: [
          u,
          "/",
          x.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: m,
          disabled: o || !r.trim(),
          className: `flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${o || !r.trim() ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            "Alt görev ekle"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: Pe, children: [
      x.map((b) => {
        const f = he(b.status), N = b.status === 4, y = Je(b).canChangeStatus;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => a == null ? void 0 : a(b.id, b.title),
            onKeyDown: (w) => {
              w.key === "Enter" && (a == null || a(b.id, b.title));
            },
            className: "flex items-center gap-3.5 px-4 py-3.5 border-t border-subtle first:border-t-0 hover:bg-surface-raised cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": N ? `${b.title} tamamlandı işaretini kaldır` : `${b.title} tamamlandı işaretle`,
                  onClick: (w) => d(w, b),
                  disabled: !y,
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white ${y ? "cursor-pointer" : "cursor-default"} ${N ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: N && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: b.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${N ? "line-through text-text-tertiary" : "text-text-primary"}`, children: b.title }),
              /* @__PURE__ */ e.jsx(Ee, { bg: f.bg, fg: f.fg, children: f.label }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: Re(b.dueDate) }),
              /* @__PURE__ */ e.jsx(bt, { name: b.assigneeName }),
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-right shrink-0 text-[10px] text-text-tertiary" })
            ]
          },
          b.id
        );
      }),
      /* @__PURE__ */ e.jsx("div", { className: "px-4 py-3 border-t border-subtle first:border-t-0", children: /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: r,
          onChange: (b) => l(b.target.value),
          onKeyDown: (b) => {
            b.key === "Enter" && m();
          },
          disabled: o,
          placeholder: "Yeni alt görev başlığı",
          className: "w-full h-9 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      ) })
    ] }),
    x.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz alt görev yok." })
  ] });
}
function Ua() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function sr(t) {
  const s = Ua();
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
function ht(t, { enabled: s = !0 } = {}) {
  const a = ne(), r = ["task-attachments", t], l = Q({
    queryKey: r,
    queryFn: () => sr(t),
    enabled: !!t && s,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: r }), n = te({
    mutationFn: (x) => rr(t, x),
    onSuccess: o
  }), i = te({
    mutationFn: (x) => Promise.resolve(Ua().deleteAttachment(x)),
    onSuccess: o
  });
  return {
    attachments: l.data ?? [],
    isLoading: l.isLoading,
    upload: n.mutateAsync,
    remove: i.mutateAsync,
    isUploading: n.isPending
  };
}
function nr({ taskId: t, readOnly: s = !1 }) {
  var y, w;
  const { attachments: a, upload: r, remove: l, isUploading: o } = ht(t), n = ne(), i = p.useRef(null), [x, u] = p.useState(!1), h = oe("Platform.Tasks.ShareExternally"), m = (w = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.currentUser) == null ? void 0 : w.id, d = (c) => !s || oe("Platform.Tasks.Edit") && !!m && c.creatorId === m, b = async (c, v) => {
    try {
      await window.apya.platform.tasks.taskShare.setAttachmentGuestVisibility(c, v), n.invalidateQueries({ queryKey: ["task-attachments", t] });
    } catch (D) {
      E(D, "Görünürlük değiştirilemedi.");
    }
  }, f = async (c) => {
    var v, D, $;
    if (c)
      try {
        await r(c), ($ = (D = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : D.success) == null || $.call(D, "Dosya yüklendi.");
      } catch (K) {
        E(K, "Dosya yüklenemedi.");
      } finally {
        i.current && (i.current.value = "");
      }
  }, N = async (c, v) => {
    try {
      await l(c);
    } catch (D) {
      E(D, `${v} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: i,
        type: "file",
        className: "hidden",
        onChange: (c) => {
          var v;
          return f((v = c.target.files) == null ? void 0 : v[0]);
        },
        disabled: o
      }
    ),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3", children: a.map((c) => {
      const v = Ya(c.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${v.bg} ${v.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${v.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: c.fileName, children: c.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: Ga(c.fileSize) })
              ] })
            ] }),
            h && !c.isGuestUpload && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 text-[11px] text-text-tertiary cursor-pointer", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: !!c.isVisibleToGuests,
                  onChange: (D) => b(c.id, D.target.checked)
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
                d(c) && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Sil",
                    "aria-label": `${c.fileName} dosyasini sil`,
                    onClick: () => N(c.id, c.fileName),
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
          return (c = i.current) == null ? void 0 : c.click();
        },
        onKeyDown: (c) => {
          var v;
          c.key === "Enter" && ((v = i.current) == null || v.click());
        },
        onDragOver: (c) => {
          c.preventDefault(), x || u(!0);
        },
        onDragLeave: () => u(!1),
        onDrop: (c) => {
          var v, D;
          c.preventDefault(), u(!1), f((D = (v = c.dataTransfer) == null ? void 0 : v.files) == null ? void 0 : D[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${x ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${o ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-[26px] ${x ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: o ? "Yükleniyor…" : x ? "Bırakın, yükleyelim" : "Dosyaları buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, PDF, DOCX · max 25MB" })
        ]
      }
    )
  ] });
}
function ot() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function ir(t) {
  const s = ot();
  return s ? Promise.resolve(s.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Rt(t) {
  const s = ne(), a = ["task-checklist", t], r = Q({
    queryKey: a,
    queryFn: () => ir(t),
    enabled: !!t,
    staleTime: 3e4,
    /* toggleChecklistItem ters çevirir; bayat gösterim yanlış yöne yazar (proje
       konsolu paneli aynı maddeyi React Query dışından değiştiriyor). */
    meta: { persist: !1 },
    retry: !1
  }), l = () => s.invalidateQueries({ queryKey: a }), o = te({
    mutationFn: (x) => Promise.resolve(ot().addChecklistItem(t, x)),
    onSuccess: l
  }), n = te({
    mutationFn: (x) => Promise.resolve(ot().toggleChecklistItem(x)),
    onSuccess: l
  }), i = te({
    mutationFn: (x) => Promise.resolve(ot().deleteChecklistItem(x)),
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
  const { items: a, isLoading: r, addItem: l, toggleItem: o, removeItem: n } = Rt(t), [i, x] = p.useState(""), u = a.filter((d) => d.isDone).length, h = a.length ? Math.round(u / a.length * 100) : 0, m = async () => {
    const d = i.trim();
    if (!(!d || !t)) {
      x("");
      try {
        await l(d);
      } catch (b) {
        x(d), E(b, "Madde eklenemedi.");
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
        /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
          u,
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
      a.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            disabled: s,
            "aria-label": d.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
            onClick: () => o(d.id).catch((b) => E(b, "Durum güncellenemedi.")),
            className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${s ? "cursor-default" : "cursor-pointer"} transition-colors duration-fast ${d.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
            children: d.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${d.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: d.text }),
        !s && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            title: "Sil",
            "aria-label": `${d.text} maddesini sil`,
            onClick: () => n(d.id).catch((b) => E(b, "Madde silinemedi.")),
            className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
          }
        )
      ] }, d.id)),
      !s && /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: i,
          onChange: (d) => x(d.target.value),
          onKeyDown: (d) => {
            d.key === "Enter" && m();
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
  const [a, r] = p.useState(""), [l, o] = p.useState(null), [n, i] = p.useState(""), [x, u] = p.useState(!1), h = ne(), m = (s == null ? void 0 : s.comments) ?? [], d = async (f) => {
    var N, y, w;
    if (f == null || f.preventDefault(), !(!a.trim() || x)) {
      u(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, a.trim())
        ), r(""), h.invalidateQueries({ queryKey: ["task-detail", t] }), (w = (y = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : y.success) == null || w.call(y, "Yorum eklendi.");
      } catch (c) {
        E(c, "Yorum eklenemedi.");
      } finally {
        u(!1);
      }
    }
  }, b = async (f) => {
    var N, y, w;
    if (!(!n.trim() || x)) {
      u(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(f, n.trim())
        ), i(""), o(null), h.invalidateQueries({ queryKey: ["task-detail", t] }), (w = (y = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : y.success) == null || w.call(y, "Yanıt eklendi.");
      } catch (c) {
        E(c, "Yanıt eklenemedi.");
      } finally {
        u(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("form", { onSubmit: d, className: "rounded-lg border border-default p-3 bg-surface-base", children: [
      /* @__PURE__ */ e.jsx(
        "textarea",
        {
          rows: 3,
          value: a,
          onChange: (f) => r(f.target.value),
          placeholder: "Bir yorum veya güncelleme yazın...",
          className: "w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ e.jsx(
        re,
        {
          type: "submit",
          variant: "primary",
          disabled: !a.trim() || x,
          isLoading: x,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    m.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: m.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: f.creatorUserName || f.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: f.creationTime ? new Date(f.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: f.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        re,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => o(l === f.id ? null : f.id),
          children: "Yanıtla"
        }
      ) }),
      l === f.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
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
          /* @__PURE__ */ e.jsx(re, { variant: "primary", size: "sm", disabled: !n.trim() || x, onClick: () => b(f.id), children: "Gönder" })
        ] })
      ] }),
      f.replies && f.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: f.replies.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: N.creatorUserName || N.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: N.creationTime ? new Date(N.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: N.text })
      ] }, N.id)) })
    ] }, f.id)) })
  ] });
}
function gt() {
  var t, s, a;
  return ((a = (s = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : s.tasks) == null ? void 0 : a.taskShare) ?? null;
}
function cr(t) {
  const s = ne(), a = ["task-share-links", t], r = Q({
    queryKey: a,
    queryFn: () => {
      const i = gt();
      return i ? Promise.resolve(i.getList(t)) : Promise.reject(new Error("Paylaşım servisi yüklenmedi."));
    },
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => s.invalidateQueries({ queryKey: a }), o = te({
    mutationFn: (i) => Promise.resolve(gt().create({ ...i, taskId: t })),
    onSuccess: l
  }), n = te({
    mutationFn: (i) => Promise.resolve(gt().revoke(i)),
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
const ta = {
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
  const { links: s, isPending: a, create: r, revoke: l, isCreating: o } = cr(t), [n, i] = p.useState(ta), [x, u] = p.useState(null);
  if (!oe("Platform.Tasks.ShareExternally"))
    return /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Görevi ekip dışıyla paylaşma yetkiniz yok." });
  const m = (y) => (w) => {
    const c = w.target.type === "checkbox" ? w.target.checked : w.target.value;
    i((v) => ({ ...v, [y]: c }));
  }, d = async (y) => {
    if (y.preventDefault(), !!n.recipientName.trim())
      try {
        const w = await r({
          ...n,
          recipientName: n.recipientName.trim(),
          // QA-41: boş e-posta "yok" demektir; "" gönderilirse sunucu doğrulaması reddeder.
          recipientEmail: n.recipientEmail.trim() || null,
          lifetimeDays: Number(n.lifetimeDays) || 14
        });
        u(w), i(ta);
      } catch (w) {
        E(w, "Paylaşım linki üretilemedi.");
      }
  }, b = (y) => `${window.location.origin}${y}`, f = (y) => {
    var w, c, v, D;
    (w = navigator.clipboard) == null || w.writeText(b(y)), (D = (v = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : v.info) == null || D.call(v, "Bağlantı kopyalandı.");
  }, N = async (y) => {
    try {
      await l(y);
    } catch (w) {
      E(w, "Bağlantı iptal edilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    x && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 rounded-[14px] border border-focus bg-primary-subtle p-3.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "text-[12.5px] font-bold text-text-primary", children: [
        "Bağlantı hazır — ",
        /* @__PURE__ */ e.jsx("span", { className: "font-normal", children: "şimdi kopyalayın, bir daha gösterilmeyecek." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("code", { className: "min-w-0 flex-1 truncate rounded-[8px] bg-surface-base px-2.5 py-2 font-mono text-[11.5px] text-text-secondary", children: b(x.url) }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => f(x.url),
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
    /* @__PURE__ */ e.jsxs("form", { onSubmit: d, className: "flex flex-col gap-2.5 rounded-[14px] border border-subtle bg-surface-base p-3.5", children: [
      /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary", children: "Yeni paylaşım bağlantısı" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2.5", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            required: !0,
            value: n.recipientName,
            onChange: m("recipientName"),
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
            onChange: m("recipientEmail"),
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
              onChange: m("lifetimeDays"),
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
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: n.allowComment, onChange: m("allowComment") }),
          "Yorum yazabilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: n.allowUpload, onChange: m("allowUpload") }),
          "Dosya yükleyebilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: n.allowDownload, onChange: m("allowDownload") }),
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
    time: xt(t.creationTime)
  }), t != null && t.lastModificationTime && s.push({
    id: "modified",
    icon: "fa-pen",
    bg: "bg-warning-subtle",
    fg: "text-warning",
    actor: t.lastModifierUserName || t.lastModifierName || "Kullanıcı",
    event: "görevi güncelledi",
    time: xt(t.lastModificationTime)
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
function mr(t, s) {
  return Q({
    queryKey: ["task-history", t, s ?? null],
    queryFn: () => {
      var r, l, o;
      const a = (o = (l = (r = window == null ? void 0 : window.apya) == null ? void 0 : r.platform) == null ? void 0 : l.tasks) == null ? void 0 : o.task;
      return a ? Promise.resolve(a.getHistory(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
    },
    enabled: !!t,
    meta: { persist: !1 }
  });
}
function fr({ entry: t }) {
  return /* @__PURE__ */ e.jsxs("li", { className: "flex flex-col gap-1 px-3.5 py-3", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "text-[12px] text-text-tertiary", children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-mono", children: Ae(t.changeTime) }),
      t.changedBy ? ` · ${t.changedBy}` : "",
      t.kind !== "Güncellendi" ? ` · ${t.kind}` : ""
    ] }),
    t.changes.map((s, a) => /* @__PURE__ */ e.jsxs("span", { className: "text-[12.5px] text-text-primary", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "font-semibold", children: [
        s.field,
        ":"
      ] }),
      " ",
      s.oldValue != null && /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary line-through", children: s.oldValue }),
      s.oldValue != null && " → ",
      /* @__PURE__ */ e.jsx("span", { className: "font-semibold", children: s.newValue ?? "—" })
    ] }, a))
  ] });
}
function br({ task: t = {}, nameById: s }) {
  const a = (n) => {
    var i;
    return n && ((i = s == null ? void 0 : s.get) == null ? void 0 : i.call(s, n)) || null;
  }, r = mr(t.id, t.lastModificationTime), l = r.data ?? [], o = [
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
  return t.completedDate && o.push({ label: "Tamamlanma", value: Ae(t.completedDate) }), t.cancelledDate && o.push({
    label: "İptal",
    value: Ae(t.cancelledDate),
    hint: t.cancelReason || null
  }), /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-3.5 py-3 border-b border-subtle bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clock-rotate-left text-[13px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: "Kayıt bilgileri" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "divide-y divide-subtle", children: o.map((n) => /* @__PURE__ */ e.jsx(pr, { ...n }, n.label)) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-3.5 py-3 border-b border-subtle bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-list-ul text-[13px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: "Değişiklik geçmişi" })
      ] }),
      r.isPending && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
      r.isError && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Geçmiş yüklenemedi." }),
      r.isSuccess && !l.length && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Henüz kayıtlı değişiklik yok." }),
      l.length > 0 && /* @__PURE__ */ e.jsx("ul", { className: "m-0 p-0 list-none divide-y divide-subtle", children: l.map((n, i) => /* @__PURE__ */ e.jsx(fr, { entry: n }, i)) })
    ] })
  ] });
}
function hr(t) {
  var a, r, l;
  const s = (l = (r = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : r.projectBudgets) == null ? void 0 : l.projectBudget;
  return s != null && s.getRecordFormLookup ? Promise.resolve(s.getRecordFormLookup(t)) : Promise.reject(new Error("Bütçe servisi yüklenmedi."));
}
function yr(t) {
  var l;
  const s = oe("Platform.Projects.ViewBudget"), a = Q({
    queryKey: ["task-detail", "budget-lines", t],
    queryFn: () => hr(t),
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
function ut(t) {
  var a, r;
  const s = (r = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.ajax) == null ? void 0 : r.call(a, t);
  return s ? new Promise((l, o) => {
    s.done(l).fail(o);
  }) : Promise.reject(new Error("ABP köprüsü yüklenmedi."));
}
function pt(t, s = {}) {
  var l;
  const a = ((l = window == null ? void 0 : window.abp) == null ? void 0 : l.appPath) ?? "/", r = new URLSearchParams({ handler: t });
  return Object.entries(s).forEach(([o, n]) => {
    n != null && n !== "" && r.append(o, n);
  }), `${a}Documents/Matching?${r.toString()}`;
}
const _a = () => oe("Platform.Documents"), gr = () => oe("Platform.Documents.ManageMeta");
function vr(t) {
  const s = !!t && _a(), a = Q({
    queryKey: ["task-detail", "expense-matches", t],
    queryFn: () => ut({ url: pt("Matches", { projectId: t }), type: "GET" }),
    enabled: s,
    staleTime: 6e4,
    meta: { persist: !1 },
    retry: !1
  }), r = /* @__PURE__ */ new Map();
  return (a.data ?? []).forEach((l) => {
    r.has(l.expenseId) || r.set(l.expenseId, []), r.get(l.expenseId).push(l);
  }), { byExpense: r, enabled: s, isLoading: a.isLoading };
}
function jr(t, s) {
  const a = Q({
    queryKey: ["task-detail", "expense-candidates", t],
    queryFn: () => ut({ url: pt("Candidates", { expenseId: t }), type: "GET" }),
    enabled: !!t && s && _a(),
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  });
  return { candidates: a.data ?? [], isLoading: a.isLoading };
}
function Nr(t) {
  const s = ne(), a = (o) => {
    s.invalidateQueries({ queryKey: ["task-detail", "expense-matches", t] }), s.invalidateQueries({ queryKey: ["task-detail", "expense-candidates", o] });
  }, r = te({
    mutationFn: ({ documentFileId: o, expenseId: n, score: i }) => ut({
      url: pt("CreateMatch"),
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ documentFileId: o, expenseId: n, score: i ?? 0 })
    }),
    onSuccess: (o, n) => a(n.expenseId)
  }), l = te({
    mutationFn: ({ matchId: o }) => ut({ url: pt("RemoveMatch", { matchId: o }), type: "POST" }),
    onSuccess: (o, n) => a(n.expenseId)
  });
  return { link: r, unlink: l, isBusy: r.isPending || l.isPending };
}
function wr(t) {
  return t == null ? "—" : new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 2 }).format(t);
}
function kr({ expenseId: t, projectId: s, matches: a }) {
  const { candidates: r, isLoading: l } = jr(t, !0), { link: o, unlink: n, isBusy: i } = Nr(s), x = gr(), u = new Set(a.map((m) => m.documentFileId)), h = r.filter((m) => !u.has(m.documentFileId));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3 px-4 pb-3.5 pt-1 bg-surface-raised", children: [
    a.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Bağlı evraklar" }),
      a.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-[11px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12px] text-text-primary", children: m.documentFileName }),
        m.annexNumber && /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary", children: [
          "EK-",
          m.annexNumber
        ] }),
        x && /* @__PURE__ */ e.jsx(
          re,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            disabled: i,
            onClick: () => n.mutate(
              { matchId: m.id, expenseId: t },
              { onError: (d) => E(d, "Evrak bağı kaldırılamadı.") }
            ),
            children: "Kaldır"
          }
        )
      ] }, m.id))
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Aday evraklar" }),
      l && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Adaylar aranıyor…" }),
      !l && h.length === 0 && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Eşleşen aday yok. Evrak Belgeler modülünden yüklenip buradan bağlanır." }),
      h.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[11px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12px] text-text-primary", children: m.displayName }),
        /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
          wr(m.amount),
          " · ",
          Re(m.documentDate)
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: `shrink-0 font-mono text-[11px] font-bold ${m.isStrong ? "text-success" : "text-text-tertiary"}`, children: [
          "%",
          m.score
        ] }),
        x && /* @__PURE__ */ e.jsx(
          re,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            disabled: i,
            onClick: () => o.mutate(
              { documentFileId: m.documentFileId, expenseId: t, score: m.score },
              { onError: (d) => E(d, "Evrak bağlanamadı.") }
            ),
            children: "Bağla"
          }
        )
      ] }, m.documentFileId))
    ] })
  ] });
}
function ve(t, s) {
  const a = s || "TRY";
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: a, minimumFractionDigits: 2 }).format(t || 0);
  } catch {
    return `${(t || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${a}`.trim();
  }
}
const Cr = ["pointerdown", "focusin", "wheel", "touchmove"], Dr = (t) => t.stopPropagation();
function Tr(t, s, a, r) {
  var x, u, h, m, d, b, f;
  const l = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.ModalManager;
  if (!l) {
    (m = (h = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : h.error) == null || m.call(h, "Kayıt formu yüklenemedi."), r == null || r();
    return;
  }
  const o = ((d = window == null ? void 0 : window.abp) == null ? void 0 : d.appPath) ?? "/";
  (f = (b = document.activeElement) == null ? void 0 : b.blur) == null || f.call(b);
  const n = new l({ viewUrl: `${o}${t}?TaskId=${s}` });
  n.onResult(() => a == null ? void 0 : a()), n.onOpen(() => r == null ? void 0 : r()), n.open();
  const i = document.getElementById(n.getModalId());
  i && (i.setAttribute("data-apya-overlay", "abp-modal"), i.style.pointerEvents = "auto", Cr.forEach((N) => i.addEventListener(N, Dr, { passive: !0 }))), setTimeout(() => r == null ? void 0 : r(), 1e4);
}
function Sr({ taskId: t }) {
  const s = ne(), [a, r] = p.useState(null), l = oe("Platform.Expenses.Create"), o = oe("Platform.Incomes.Create"), n = oe("Platform.Invoices.Create");
  if (!t || !l && !o && !n)
    return null;
  const i = () => s.invalidateQueries({ queryKey: ["task-detail", t] }), x = (u) => {
    a || (r(u), Tr(u, t, i, () => r((h) => h === u ? null : h)));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
    l && /* @__PURE__ */ e.jsxs(
      re,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        isLoading: a === "Expenses/CreateModal",
        disabled: !!a,
        onClick: () => x("Expenses/CreateModal"),
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
        isLoading: a === "Incomes/CreateModal",
        disabled: !!a,
        onClick: () => x("Incomes/CreateModal"),
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
        isLoading: a === "Invoices/CreateModal",
        disabled: !!a,
        onClick: () => x("Invoices/CreateModal"),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-invoice text-[11px]" }),
          "Fatura ekle"
        ]
      }
    )
  ] });
}
const aa = {
  0: { label: "Taslak", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  1: { label: "Gönderildi", bg: "bg-primary-subtle", fg: "text-primary" },
  2: { label: "Ödendi", bg: "bg-success-subtle", fg: "text-success" },
  3: { label: "İptal", bg: "bg-neutral-subtle", fg: "text-text-tertiary" },
  4: { label: "Gecikti", bg: "bg-negative-subtle", fg: "text-negative" }
};
function $r({ invoices: t, action: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: Pe, children: [
    /* @__PURE__ */ e.jsx(Ze, { title: "Faturalar", action: s }),
    t.map((a) => {
      const r = aa[a.status] ?? aa[0];
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
              Re(a.dueDate)
            ] }),
            /* @__PURE__ */ e.jsx(Ee, { bg: r.bg, fg: r.fg, children: r.label }),
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary",
                style: { fontVariantNumeric: "tabular-nums" },
                children: ve(a.totalAmount, a.currency)
              }
            )
          ]
        },
        a.id
      );
    })
  ] });
}
function Pr({ line: t, projectId: s, matches: a, docsEnabled: r }) {
  const [l, o] = p.useState(!1), n = t.kind === "income";
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
            a.length > 0 ? `Evrak ${a.length}` : "Evrak"
          ]
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: Re(t.date) }),
      n ? /* @__PURE__ */ e.jsx(Ee, { bg: "bg-success-subtle", fg: "text-success", children: "Gelir" }) : /* @__PURE__ */ e.jsx(Ee, { bg: "bg-warning-subtle", fg: "text-warning", children: "Gider" }),
      /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: `shrink-0 font-mono text-[12.5px] font-bold ${n ? "text-success" : "text-text-primary"}`,
          style: { fontVariantNumeric: "tabular-nums" },
          children: [
            n ? "+" : "−",
            ve(t.amount, t.currency)
          ]
        }
      )
    ] }),
    r && l && /* @__PURE__ */ e.jsx(kr, { expenseId: t.id, projectId: s, matches: a })
  ] });
}
function vt({ label: t, value: s, tone: a, note: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: `font-mono text-[22px] font-bold tracking-[-.02em] ${a}`, style: { fontVariantNumeric: "tabular-nums" }, children: s }),
    r && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
  ] });
}
function Er({ options: t, isLoading: s, lineId: a, planned: r, onField: l }) {
  return s ? null : t.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12px] text-text-tertiary", children: "Bu projede bütçe kalemi tanımlı değil — kalemler Finans & Bütçe ekranından açılır." }) : /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Bütçe kalemi" }),
      /* @__PURE__ */ e.jsx(
        Ta,
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
function Br({ task: t, form: s, spentByCurrency: a, readOnly: r }) {
  const l = (s ? s.values.projectId : t == null ? void 0 : t.projectId) ?? null, { options: o, lines: n, canViewBudget: i, isLoading: x } = yr(l), u = !!s && !r && i && !!l, h = (s ? s.values.budgetLineId : t == null ? void 0 : t.budgetLineId) ?? null, m = (s ? s.values.plannedAmount : t == null ? void 0 : t.plannedAmount) ?? null;
  if (!u && (!h || m == null))
    return null;
  const d = n.find((D) => D.id === h), b = d ? d.remainingAmount : t == null ? void 0 : t.budgetLineRemaining, f = a, N = !!h && m != null, y = (m ?? 0) - f, w = m > 0 ? Math.round(f / m * 100) : 0, c = y < 0, v = () => {
    s.setField("budgetLineId", null), s.setField("plannedAmount", null);
  };
  return (
    /* Kırpmayan kart ŞART: kalem seçicisinin listesi kartın içine absolute
       konumlanır, TAB_CARD'ın overflow-hidden'ı onu alt kenarda keserdi. */
    /* @__PURE__ */ e.jsxs("div", { className: Ra, children: [
      /* @__PURE__ */ e.jsx(
        Ze,
        {
          title: "Bütçe bağı",
          action: u && h ? /* @__PURE__ */ e.jsx(re, { type: "button", variant: "ghost", size: "sm", onClick: v, children: "Bağı kaldır" }) : null
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "px-4 pb-4 pt-1 flex flex-col gap-3", children: [
        u ? /* @__PURE__ */ e.jsx(
          Er,
          {
            options: o,
            isLoading: x,
            lineId: h,
            planned: m,
            onField: s.setField
          }
        ) : /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-semibold text-accent", children: t.budgetLineName || "Bütçe kalemi" }) }),
        b != null && /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "kalemde kalan ",
          ve(b, "TRY")
        ] }),
        N && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3", children: [
            /* @__PURE__ */ e.jsx(jt, { label: "Görev bütçesi", value: ve(m, "TRY") }),
            /* @__PURE__ */ e.jsx(jt, { label: "Gerçekleşen", value: ve(f, "TRY") }),
            /* @__PURE__ */ e.jsx(
              jt,
              {
                label: "Kalan",
                value: ve(y, "TRY"),
                tone: c ? "text-negative" : "text-success"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
              "div",
              {
                className: `h-full rounded-full ${c ? "bg-negative" : w >= 80 ? "bg-warning" : "bg-success"}`,
                style: { width: `${Math.min(Math.max(w, 0), 100)}%` }
              }
            ) }),
            /* @__PURE__ */ e.jsxs("div", { className: "mt-1 text-[11.5px] text-text-tertiary", children: [
              "%",
              w,
              c && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative", children: "· görev bütçesi aşıldı" })
            ] })
          ] })
        ] })
      ] })
    ] })
  );
}
function jt({ label: t, value: s, tone: a }) {
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
function Ir({ task: t, taskId: s, form: a, readOnly: r = !1 }) {
  const l = (t == null ? void 0 : t.expenses) || [], o = (t == null ? void 0 : t.incomes) || [], n = (t == null ? void 0 : t.invoices) || [], i = (a ? a.values.projectId : t == null ? void 0 : t.projectId) ?? null, { byExpense: x, enabled: u } = vr(i), h = l.filter((y) => (y.currency || "TRY") === "TRY").reduce((y, w) => y + (w.amount || 0), 0), m = /* @__PURE__ */ e.jsx(Br, { task: t, form: a, spentByCurrency: h, readOnly: r }), d = /* @__PURE__ */ e.jsx(Sr, { taskId: s ?? (t == null ? void 0 : t.id) });
  if (l.length === 0 && o.length === 0 && n.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      m,
      /* @__PURE__ */ e.jsxs("div", { className: Pe, children: [
        /* @__PURE__ */ e.jsx(Ze, { title: "Görev Finansı", action: d }),
        /* @__PURE__ */ e.jsx(
          ye,
          {
            icon: "fa-coins",
            title: "Kayıt yok",
            description: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
          }
        )
      ] })
    ] });
  const f = Array.from(new Set([...l, ...o].map((y) => y.currency || "TRY"))).map((y) => {
    const w = o.filter((v) => (v.currency || "TRY") === y).reduce((v, D) => v + (D.amount || 0), 0), c = l.filter((v) => (v.currency || "TRY") === y).reduce((v, D) => v + (D.amount || 0), 0);
    return { cur: y, inc: w, exp: c, net: w - c };
  }), N = [
    ...o.map((y) => ({ ...y, kind: "income" })),
    ...l.map((y) => ({ ...y, kind: "expense" }))
  ].sort((y, w) => new Date(w.date || 0) - new Date(y.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    m,
    f.map(({ cur: y, inc: w, exp: c, net: v }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(vt, { label: `Toplam Gelir (${y})`, value: ve(w, y), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(vt, { label: `Toplam Gider (${y})`, value: ve(c, y), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        vt,
        {
          label: `Net Bakiye (${y})`,
          value: ve(v, y),
          tone: v >= 0 ? "text-success" : "text-negative",
          note: v >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, y)),
    n.length > 0 && /* @__PURE__ */ e.jsx($r, { invoices: n, action: N.length === 0 ? d : null }),
    N.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: Pe, children: [
      /* @__PURE__ */ e.jsx(Ze, { title: "Finans kalemleri", action: d }),
      N.map((y) => /* @__PURE__ */ e.jsx(
        Pr,
        {
          line: y,
          projectId: i,
          matches: y.kind === "expense" ? x.get(y.id) ?? [] : [],
          docsEnabled: u && y.kind === "expense"
        },
        `${y.kind}-${y.id}`
      ))
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11px] text-text-tertiary", children: "Buradan eklenen kayıt göreve ve projesine etiketlenir; düzenleme/silme Finans modülünden yapılır. Evraklar Belgeler modülünde yaşar, buradan gidere bağlanır." })
  ] });
}
function Fr({ taskId: t }) {
  const { attachments: s, isLoading: a, upload: r, remove: l, isUploading: o } = ht(t), n = p.useRef(null), [i, x] = p.useState(!1), u = s.filter((d) => ea(d.fileName)), h = async (d) => {
    var b, f, N, y, w, c;
    if (d) {
      if (!ea(d.name)) {
        (N = (f = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : f.error) == null || N.call(f, "Galeriye yalnız görsel dosya yüklenebilir.");
        return;
      }
      try {
        await r(d), (c = (w = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : w.success) == null || c.call(w, "Görsel yüklendi.");
      } catch (v) {
        E(v, "Görsel yüklenemedi.");
      } finally {
        n.current && (n.current.value = "");
      }
    }
  }, m = async (d, b) => {
    try {
      await l(d);
    } catch (f) {
      E(f, `${b} silinemedi.`);
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
          var b;
          return h((b = d.target.files) == null ? void 0 : b[0]);
        },
        disabled: o
      }
    ),
    a && u.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !a && u.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görevde henüz görsel yok. Yüklediğiniz görseller Dosyalar sekmesinde de görünür." }),
    u.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3", children: u.map((d) => /* @__PURE__ */ e.jsxs(
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
              /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: Ga(d.fileSize) })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                title: "Sil",
                "aria-label": `${d.fileName} gorselini sil`,
                onClick: () => m(d.id, d.fileName),
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
          var b;
          d.key === "Enter" && ((b = n.current) == null || b.click());
        },
        onDragOver: (d) => {
          d.preventDefault(), i || x(!0);
        },
        onDragLeave: () => x(!1),
        onDrop: (d) => {
          var b, f;
          d.preventDefault(), x(!1), h((f = (b = d.dataTransfer) == null ? void 0 : b.files) == null ? void 0 : f[0]);
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
const Ar = [
  { key: "title", label: "Başlık", align: "left" },
  { key: "status", label: "Durum", align: "left" },
  { key: "priority", label: "Öncelik", align: "left" },
  { key: "assignee", label: "Atanan", align: "left" },
  { key: "dueDate", label: "Termin", align: "right" }
];
function sa(t, s) {
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
function zr(t, s, a, r) {
  const l = sa(t, a), o = sa(s, a), n = l === null || l === "", i = o === null || o === "";
  return n && i ? 0 : n ? 1 : i ? -1 : l === o ? 0 : (l < o ? -1 : 1) * (r === "asc" ? 1 : -1);
}
function Lr({ task: t = {}, onOpenSubtask: s }) {
  const [a, r] = p.useState({ key: "dueDate", dir: "asc" }), l = (t == null ? void 0 : t.subTasks) ?? [], o = p.useMemo(
    () => [...l].sort((i, x) => zr(i, x, a.key, a.dir)),
    [l, a.key, a.dir]
  ), n = (i) => r((x) => x.key === i ? { key: i, dir: x.dir === "asc" ? "desc" : "asc" } : { key: i, dir: "asc" });
  return l.length === 0 ? /* @__PURE__ */ e.jsx(
    ye,
    {
      icon: "fa-table",
      title: "Alt görev yok",
      description: "Alt Görevler sekmesinden ekledikleriniz burada tablo olarak listelenir."
    }
  ) : /* @__PURE__ */ e.jsx("div", { className: `${Pe} overflow-x-auto`, children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse text-[12.5px]", children: [
    /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsx("tr", { className: "bg-surface-raised", children: Ar.map((i) => {
      const x = a.key === i.key;
      return /* @__PURE__ */ e.jsx(
        "th",
        {
          scope: "col",
          "aria-sort": x ? a.dir === "asc" ? "ascending" : "descending" : "none",
          className: `px-3.5 py-2.5 border-b border-subtle font-bold text-text-secondary whitespace-nowrap ${i.align === "right" ? "text-right" : "text-left"}`,
          children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => n(i.key),
              className: `inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer font-bold ${x ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`,
              children: [
                i.label,
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid text-[9px] ${x ? a.dir === "asc" ? "fa-arrow-up-short-wide" : "fa-arrow-down-wide-short" : "fa-sort opacity-40"}` })
              ]
            }
          )
        },
        i.key
      );
    }) }) }),
    /* @__PURE__ */ e.jsx("tbody", { children: o.map((i) => {
      const x = he(i.status), u = ft(i.priority), h = $a(i.dueDate);
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
                  onClick: (m) => {
                    m.stopPropagation(), s == null || s(i.id);
                  },
                  title: i.title,
                  className: `block w-full truncate bg-transparent border-0 p-0 text-left font-semibold cursor-pointer ${i.status === 4 ? "line-through text-text-tertiary" : "text-text-primary"}`,
                  children: i.title
                }
              ),
              i.code && /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: i.code })
            ] }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(Ee, { bg: x.bg, fg: x.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x.icon} text-[9px] mr-1` }),
              x.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(Ee, { bg: u.bg, fg: u.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-[9px] mr-1` }),
              u.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: i.assigneeName ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ e.jsx(bt, { name: i.assigneeName, size: 22 }),
              /* @__PURE__ */ e.jsx("span", { className: "truncate text-text-secondary", children: i.assigneeName })
            ] }) : /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: "Atanmadı" }) }),
            /* @__PURE__ */ e.jsxs("td", { className: `px-3.5 py-2.5 text-right whitespace-nowrap ${h.tone}`, children: [
              i.dueDate ? Re(i.dueDate) : "—",
              h.hint && /* @__PURE__ */ e.jsx("div", { className: "text-[11px]", children: h.hint })
            ] })
          ]
        },
        i.id
      );
    }) })
  ] }) });
}
function Mr({ taskId: t, task: s = {}, onOpenSubtask: a }) {
  const r = ne(), l = (s == null ? void 0 : s.subTasks) ?? [], [o, n] = p.useState(null), [i, x] = p.useState(null), u = async (h, m) => {
    const d = l.find((b) => b.id === h);
    if (!(!d || d.status === m || !Je(d).canChangeStatus)) {
      x(h);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.updateStatus(h, m)), await r.invalidateQueries({ queryKey: ["task-detail", t] });
      } catch (b) {
        E(b, "Alt görev durumu güncellenemedi.");
      } finally {
        x(null);
      }
    }
  };
  return l.length === 0 ? /* @__PURE__ */ e.jsx(
    ye,
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 items-start", children: Qt.map((h) => {
      const m = he(h), d = l.filter((f) => f.status === h), b = o === h;
      return /* @__PURE__ */ e.jsxs(
        "section",
        {
          "aria-label": `${m.label} sütunu`,
          onDragOver: (f) => {
            f.preventDefault(), o !== h && n(h);
          },
          onDragLeave: () => n((f) => f === h ? null : f),
          onDrop: (f) => {
            var y;
            f.preventDefault(), n(null);
            const N = (y = f.dataTransfer) == null ? void 0 : y.getData("text/plain");
            N && u(N, h);
          },
          className: `flex flex-col gap-2 p-2.5 rounded-2xl border bg-surface-raised min-h-[120px] transition-colors duration-fast ${b ? "border-focus bg-primary-subtle" : "border-subtle"}`,
          children: [
            /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-2 px-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${m.dot}` }),
              /* @__PURE__ */ e.jsx("h3", { className: "m-0 flex-1 text-[12px] font-bold text-text-primary", children: m.label }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: d.length })
            ] }),
            d.map((f) => {
              const N = ft(f.priority), y = Je(f).canChangeStatus;
              return /* @__PURE__ */ e.jsxs(
                "article",
                {
                  draggable: y,
                  onDragStart: (w) => {
                    var c;
                    return (c = w.dataTransfer) == null ? void 0 : c.setData("text/plain", f.id);
                  },
                  role: "button",
                  tabIndex: 0,
                  onClick: () => a == null ? void 0 : a(f.id),
                  onKeyDown: (w) => {
                    w.key === "Enter" && (a == null || a(f.id));
                  },
                  className: `flex flex-col gap-2 p-2.5 rounded-[12px] border border-subtle bg-surface-base shadow-xs cursor-pointer hover:border-focus hover:shadow-md ${i === f.id ? "opacity-60" : ""}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary line-clamp-2", children: f.title }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                      /* @__PURE__ */ e.jsxs("span", { className: `text-[10.5px] font-bold ${N.fg}`, children: [
                        /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${N.icon} text-[9px] mr-1` }),
                        N.label
                      ] }),
                      f.dueDate && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: Re(f.dueDate) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2 border-t border-subtle", children: [
                      f.assigneeName ? /* @__PURE__ */ e.jsx(bt, { name: f.assigneeName, size: 20 }) : /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] text-text-tertiary", children: "Atanmadı" }),
                      /* @__PURE__ */ e.jsx(
                        "select",
                        {
                          "aria-label": `${f.title} durumunu değiştir`,
                          value: f.status,
                          onClick: (w) => w.stopPropagation(),
                          onChange: (w) => u(f.id, Number(w.target.value)),
                          disabled: !y,
                          className: `h-[24px] px-1.5 rounded-[6px] border border-subtle bg-surface-base text-[10.5px] text-text-secondary ${y ? "cursor-pointer" : "cursor-default"}`,
                          children: Qt.map((w) => /* @__PURE__ */ e.jsx("option", { value: w, children: he(w).label }, w))
                        }
                      )
                    ] })
                  ]
                },
                f.id
              );
            })
          ]
        },
        h
      );
    }) })
  );
}
const Kr = [
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
], Rr = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], ra = (t) => String(t).padStart(2, "0"), Va = (t, s, a) => `${t}-${ra(s + 1)}-${ra(a)}`;
function Et(t) {
  if (!t) return null;
  const s = /^(\d{4}-\d{2}-\d{2})/.exec(String(t));
  return s ? s[1] : null;
}
function qr(t, s) {
  const r = (new Date(t, s, 1).getDay() + 6) % 7, l = new Date(t, s + 1, 0).getDate(), o = [];
  for (let n = 0; n < 42; n++) {
    const i = n - r + 1;
    o.push(i >= 1 && i <= l ? { key: Va(t, s, i), day: i, inMonth: !0 } : { key: `bos-${n}`, day: null, inMonth: !1 });
  }
  return o;
}
function Gr(t) {
  const s = /* @__PURE__ */ new Map(), a = (r, l) => {
    const o = Et(r);
    o && (s.has(o) || s.set(o, []), s.get(o).push(l));
  };
  a(t == null ? void 0 : t.startDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "start", isSelf: !0, status: t == null ? void 0 : t.status }), a(t == null ? void 0 : t.dueDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "due", isSelf: !0, status: t == null ? void 0 : t.status });
  for (const r of (t == null ? void 0 : t.subTasks) ?? [])
    a(r.startDate, { id: r.id, title: r.title, kind: "start", isSelf: !1, status: r.status }), a(r.dueDate, { id: r.id, title: r.title, kind: "due", isSelf: !1, status: r.status });
  return s;
}
function Yr({ task: t = {}, onOpenSubtask: s }) {
  const a = p.useMemo(() => Gr(t), [t]), [r, l] = p.useState(() => {
    const u = Et(t == null ? void 0 : t.startDate) ?? Et(t == null ? void 0 : t.dueDate);
    if (u) {
      const [m, d] = u.split("-").map(Number);
      return { year: m, month: d - 1 };
    }
    const h = /* @__PURE__ */ new Date();
    return { year: h.getFullYear(), month: h.getMonth() };
  }), o = p.useMemo(() => qr(r.year, r.month), [r.year, r.month]), n = (u) => l(({ year: h, month: m }) => {
    const d = m + u;
    return { year: h + Math.floor(d / 12), month: (d % 12 + 12) % 12 };
  }), i = /* @__PURE__ */ new Date(), x = Va(i.getFullYear(), i.getMonth(), i.getDate());
  return a.size === 0 ? /* @__PURE__ */ e.jsx(
    ye,
    {
      icon: "fa-calendar",
      title: "Takvimde gösterilecek tarih yok",
      description: "Göreve başlangıç veya termin tarihi girildiğinde burada aylık takvimde görünür."
    }
  ) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-3.5 py-3 border-b border-subtle bg-surface-raised", children: [
      /* @__PURE__ */ e.jsxs("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: [
        Kr[r.month],
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-subtle bg-surface-raised", children: Rr.map((u) => /* @__PURE__ */ e.jsx("span", { className: "px-2 py-1.5 text-center text-[11px] font-bold text-text-tertiary", children: u }, u)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: o.map((u) => {
      const h = u.inMonth ? a.get(u.key) ?? [] : [], m = u.key === x;
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: `flex flex-col gap-1 min-h-[76px] p-1.5 border-r border-b border-subtle last-of-type:border-r-0 ${u.inMonth ? "" : "bg-surface-sunken"}`,
          children: [
            u.inMonth && /* @__PURE__ */ e.jsx("span", { className: `self-end font-mono text-[11px] font-bold ${m ? "flex items-center justify-center h-[18px] w-[18px] rounded-full bg-primary text-white" : "text-text-tertiary"}`, children: u.day }),
            h.map((d, b) => {
              const f = he(d.status);
              return /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  title: `${d.title} — ${d.kind === "due" ? "termin" : "başlangıç"}`,
                  onClick: () => {
                    d.isSelf || s == null || s(d.id);
                  },
                  className: `flex items-center gap-1 w-full px-1.5 py-[3px] rounded-[6px] text-left text-[10.5px] font-semibold ${f.bg} ${f.fg} ${d.isSelf ? "cursor-default" : "cursor-pointer hover:brightness-95"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.kind === "due" ? "fa-flag-checkered" : "fa-play"} text-[8px] shrink-0` }),
                    /* @__PURE__ */ e.jsx("span", { className: "truncate", children: d.title })
                  ]
                },
                `${d.id}-${d.kind}-${b}`
              );
            })
          ]
        },
        u.key
      );
    }) })
  ] });
}
function We() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Ur(t) {
  const s = We();
  return s ? Promise.resolve(s.getDocuments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function _r(t) {
  const s = ne(), a = ["task-documents", t], r = Q({
    queryKey: a,
    queryFn: () => Ur(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => s.invalidateQueries({ queryKey: a }), o = te({
    mutationFn: (x) => Promise.resolve(We().createDocument(t, x)),
    onSuccess: l
  }), n = te({
    mutationFn: ({ id: x, title: u, content: h }) => Promise.resolve(We().updateDocument(x, { title: u, content: h })),
    onSuccess: (x) => {
      l(), x != null && x.id && s.setQueryData(["task-document", x.id], x);
    }
  }), i = te({
    mutationFn: (x) => Promise.resolve(We().deleteDocument(x)),
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
function Vr(t) {
  return Q({
    queryKey: ["task-document", t],
    queryFn: () => Promise.resolve(We().getDocument(t)),
    enabled: !!t,
    /* Kayıt tam değiştirir (updateDocument {id,title,content}); bayat gövdeden
       kaydetmek başka ekranda yapılan değişikliği ezer. */
    meta: { persist: !1 },
    retry: !1
  });
}
function Or({ taskId: t, readOnly: s = !1 }) {
  const { documents: a, isLoading: r, createDocument: l, updateDocument: o, removeDocument: n, isSaving: i } = _r(t), [x, u] = p.useState(null), [h, m] = p.useState(""), [d, b] = p.useState(""), [f, N] = p.useState(!1), [y, w] = p.useState(!1), { data: c, isFetching: v } = Vr(x);
  p.useEffect(() => {
    !c || c.id !== x || (m(c.title ?? ""), b(c.content ?? ""), N(!1));
  }, [c == null ? void 0 : c.id]);
  const D = async () => {
    try {
      const B = await l("Yeni belge");
      B != null && B.id && u(B.id);
    } catch (B) {
      E(B, "Belge oluşturulamadı.");
    }
  }, $ = async () => {
    var O, q, L, G, U, _;
    const B = h.trim();
    if (!B)
      return (L = (q = (O = window == null ? void 0 : window.abp) == null ? void 0 : O.notify) == null ? void 0 : q.error) == null || L.call(q, "Belge başlığı boş olamaz."), !1;
    try {
      return await o({ id: x, title: B, content: d }), N(!1), (_ = (U = (G = window == null ? void 0 : window.abp) == null ? void 0 : G.notify) == null ? void 0 : U.success) == null || _.call(U, "Belge kaydedildi."), !0;
    } catch (Y) {
      return E(Y, "Belge kaydedilemedi."), !1;
    }
  }, K = async (B, O) => {
    try {
      await n(B), x === B && u(null);
    } catch (q) {
      E(q, `“${O}” silinemedi.`);
    }
  }, X = () => {
    if (f) {
      w(!0);
      return;
    }
    u(null);
  };
  return x ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: X,
          "aria-label": "Belge listesine dön",
          className: "flex items-center justify-center h-8 w-8 rounded-[9px] border border-subtle bg-surface-base text-text-tertiary hover:text-text-primary cursor-pointer",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-left text-[12px]" })
        }
      ),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: h,
          readOnly: s,
          "aria-label": "Belge başlığı",
          onChange: (B) => {
            m(B.target.value), N(!0);
          },
          className: "flex-1 min-w-0 h-9 px-3 rounded-[10px] border border-subtle bg-surface-base text-[13.5px] font-bold text-text-primary focus:border-focus focus:shadow-focus focus:outline-none"
        }
      ),
      !s && /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: $,
          disabled: i || !f,
          className: `flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[12.5px] font-bold ${i || !f ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${i ? "fa-circle-notch fa-spin" : "fa-floppy-disk"} text-[11px]` }),
            i ? "Kaydediliyor…" : f ? "Kaydet" : "Kaydedildi"
          ]
        }
      )
    ] }),
    v && !c ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Belge yükleniyor…" }) : /* @__PURE__ */ e.jsx(
      Pa,
      {
        value: d,
        ariaLabel: "Belge içeriği",
        placeholder: "Belgeyi buraya yazın…",
        readOnly: s,
        onChange: (B) => {
          b(B), N(!0);
        }
      }
    ),
    /* @__PURE__ */ e.jsx(
      At,
      {
        open: y,
        isSaving: i,
        onStay: () => w(!1),
        onDiscard: () => {
          w(!1), N(!1), u(null);
        },
        onSave: async () => {
          const B = await $();
          w(!1), B && u(null);
        }
      }
    )
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Belgeler" }),
      !s && /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: D,
          className: "flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            "Yeni belge"
          ]
        }
      )
    ] }),
    r && a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !r && a.length === 0 && /* @__PURE__ */ e.jsx(
      ye,
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
                /* @__PURE__ */ e.jsx("span", { className: "block text-[11.5px] text-text-tertiary", children: B.contentLength > 0 ? `${B.editorName} · ${xt(B.lastModificationTime ?? B.creationTime)}` : "Boş belge — açıp yazmaya başlayın" })
              ]
            }
          ),
          !s && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              "aria-label": `${B.title} belgesini sil`,
              onClick: () => K(B.id, B.title),
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
function Ke() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Qr(t) {
  const s = Ke();
  return s ? Promise.resolve(s.getLinkedForms(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Hr(t) {
  const s = ne(), a = ["task-forms", t], r = Q({
    queryKey: a,
    queryFn: () => Qr(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), l = () => s.invalidateQueries({ queryKey: a }), o = te({
    mutationFn: (x) => Promise.resolve(Ke().linkForm(t, x)),
    onSuccess: l
  }), n = te({
    mutationFn: (x) => Promise.resolve(Ke().unlinkForm(x)),
    onSuccess: l
  }), i = te({
    mutationFn: ({ linkId: x, value: u }) => Promise.resolve(Ke().setFormGuestFillable(x, u)),
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
function Wr(t, s) {
  return Q({
    queryKey: ["task-form-options", t],
    queryFn: () => Promise.resolve(Ke().getFormOptions(t)),
    enabled: !!t && !!s,
    meta: { persist: !1 },
    retry: !1
  });
}
function Jr(t, s) {
  return Q({
    queryKey: ["task-form-responses", t, s],
    queryFn: () => Promise.resolve(Ke().getFormResponses(t, s)),
    enabled: !!t && !!s,
    meta: { persist: !1 },
    retry: !1
  });
}
function Zr({ taskId: t, documentId: s }) {
  const { data: a, isLoading: r } = Jr(t, s);
  return r ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Yanıtlar yükleniyor…" }) : a != null && a.length ? /* @__PURE__ */ e.jsx("ul", { className: "m-0 list-none p-0", children: a.map((l) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-3 px-3.5 py-2 border-t border-subtle", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l.isGuestSubmission ? "fa-user-clock" : "fa-user"} text-[10px] text-text-tertiary` }),
      /* @__PURE__ */ e.jsx("span", { className: "truncate text-[12.5px] text-text-primary", children: l.respondentName }),
      l.isGuestSubmission && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: "· dış" })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary", children: xt(l.creationTime) })
  ] }, l.id)) }) : /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Bu görevde henüz yanıt yok." });
}
function Xr({ taskId: t, readOnly: s = !1 }) {
  const { forms: a, isLoading: r, linkForm: l, unlinkForm: o, setGuestFillable: n, isLinking: i } = Hr(t), [x, u] = p.useState(!1), [h, m] = p.useState(null), { data: d, isLoading: b } = Wr(t, x), f = oe("Platform.Tasks.ShareExternally"), N = async (c) => {
    try {
      await l(c), u(!1);
    } catch (v) {
      E(v, "Form bağlanamadı.");
    }
  }, y = async (c) => {
    if (window.confirm(`“${c.title}” bağlantısı kaldırılsın mı? Form ve toplanmış yanıtlar silinmez.`))
      try {
        await o(c.id);
      } catch (v) {
        E(v, "Bağlantı kaldırılamadı.");
      }
  }, w = async (c, v) => {
    try {
      await n({ linkId: c.id, value: v });
    } catch (D) {
      E(D, "Ayar değiştirilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Formlar" }),
      !s && /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => u((c) => !c),
          className: "flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x ? "fa-xmark" : "fa-plus"} text-[11px]` }),
            x ? "Kapat" : "Form bağla"
          ]
        }
      )
    ] }),
    x && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-raised overflow-hidden", children: [
      b && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Formlar yükleniyor…" }),
      !b && !(d != null && d.length) && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Bağlanabilecek form yok. Önce Form Yönetimi'nden bir form oluşturun." }),
      d == null ? void 0 : d.map((c) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          disabled: c.isLinked || i,
          onClick: () => N(c.documentId),
          className: `flex items-center justify-between gap-3 px-3.5 py-2.5 border-b border-subtle last:border-b-0 text-left ${c.isLinked ? "cursor-not-allowed opacity-55" : "cursor-pointer hover:bg-surface-hover"}`,
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "truncate text-[12.5px] font-semibold text-text-primary", children: c.title }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[11px] text-text-tertiary", children: c.isLinked ? "zaten bağlı" : c.isPublished ? "yayında" : "taslak" })
          ]
        },
        c.documentId
      ))
    ] }),
    r && a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !r && a.length === 0 && !x && /* @__PURE__ */ e.jsx(
      ye,
      {
        icon: "fa-clipboard-list",
        title: "Göreve bağlı form yok",
        description: "Saha formu, kabul kontrol listesi ya da anket bağlayıp yanıtları bu görevin altında toplayabilirsiniz."
      }
    ),
    a.map((c) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-3.5 py-3", children: [
        /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clipboard-list text-[14px]" }) }),
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => m((v) => v === c.documentId ? null : c.documentId),
            className: "flex-1 min-w-0 bg-transparent border-0 p-0 text-left cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] font-bold text-text-primary", children: c.title }),
                !c.isPublished && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] font-bold text-warning", children: "taslak" })
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "block text-[11.5px] text-text-tertiary", children: c.responseCount > 0 ? `${c.responseCount} yanıt · bu görevde` : "Bu görevde henüz yanıt yok" })
            ]
          }
        ),
        c.responseCount > 0 && /* @__PURE__ */ e.jsx(qa, { children: c.responseCount }),
        c.isPublished && c.slug && /* @__PURE__ */ e.jsx(
          "a",
          {
            href: `/f/${c.slug}?taskId=${c.taskId}`,
            target: "_blank",
            rel: "noreferrer",
            title: "Formu doldur",
            "aria-label": `${c.title} formunu doldur`,
            className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary hover:bg-primary-subtle hover:text-primary",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-up-right-from-square text-[11px]" })
          }
        ),
        !s && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            title: "Bağlantıyı kaldır",
            "aria-label": `${c.title} bağlantısını kaldır`,
            onClick: () => y(c),
            className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[12px]" })
          }
        )
      ] }),
      f && !s && c.isPublished && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 px-3.5 pb-3 text-[11.5px] text-text-secondary cursor-pointer", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: !!c.isGuestFillable,
            onChange: (v) => w(c, v.target.checked)
          }
        ),
        "Süreli paylaşım linkiyle ekip dışından da doldurulabilsin"
      ] }),
      h === c.documentId && /* @__PURE__ */ e.jsx(Zr, { taskId: t, documentId: c.documentId })
    ] }, c.id))
  ] });
}
const en = {
  0: "bg-neutral-400",
  1: "bg-text-tertiary",
  2: "bg-warning",
  3: "bg-primary",
  4: "bg-success"
};
function Nt(t) {
  if (!t) return null;
  const s = new Date(t);
  return Number.isNaN(s.getTime()) ? null : s;
}
const Ve = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
function tn({ task: t = {} }) {
  const s = p.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((n, i) => ({
    id: n.id || `row-${i}`,
    name: n.title || "Başlıksız görev",
    isMain: !!n.__main,
    start: Nt(n.startDate),
    end: Nt(n.dueDate) || Nt(n.completedDate),
    status: n.status ?? 1
  })), [t]), { min: a, span: r } = p.useMemo(() => {
    const o = s.flatMap((x) => [x.start, x.end]).filter(Boolean).map((x) => x.getTime());
    if (o.length === 0) return { min: null, span: 0 };
    const n = Math.min(...o), i = Math.max(...o);
    return { min: n, span: Math.max(1, i - n) };
  }, [s]), l = p.useMemo(() => a === null ? [] : [0, 1, 2, 3].map((o) => new Date(a + r * o / 4)), [a, r]);
  return a === null ? /* @__PURE__ */ e.jsx("div", { className: Pe, children: /* @__PURE__ */ e.jsx(
    ye,
    {
      icon: "fa-bars-staggered",
      title: "Zaman çizelgesi çizilemiyor",
      description: "Görevde veya alt görevlerde başlangıç–bitiş tarihi tanımlı olmalı."
    }
  ) }) : /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Zaman çizelgesi" }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] text-text-tertiary", children: [
        Ve(new Date(a)),
        " – ",
        Ve(new Date(a + r))
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-4 gap-0 pl-[170px] mb-2 lt-860:pl-[110px]", children: l.map((o, n) => /* @__PURE__ */ e.jsx(
      "span",
      {
        className: "pl-2 border-l border-subtle text-[10.5px] font-bold uppercase tracking-[.06em] text-text-tertiary",
        children: Ve(o)
      },
      n
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: s.map((o) => {
      const n = o.start ? o.start.getTime() : a, i = o.end ? Math.max(o.end.getTime(), n) : n, x = (n - a) / r * 100, u = Math.max(2, (i - n) / r * 100), h = Math.max(1, Math.round((i - n) / 864e5));
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
            className: `absolute top-[7px] bottom-[7px] flex items-center px-2.5 rounded-[7px] shadow-xs ${en[o.status] || "bg-primary"}`,
            style: { left: `${x}%`, width: `${u}%` },
            title: `${Ve(o.start)} – ${Ve(o.end)}`,
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
function Bt(t, s = {}) {
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
function na({ icon: t, iconTone: s, title: a, note: r, children: l }) {
  return /* @__PURE__ */ e.jsxs("div", { className: Pe, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[12px] ${s}` }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: a }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
    ] }),
    l
  ] });
}
function an({ task: t = {}, readOnly: s = !1 }) {
  const a = ne(), r = t.predecessorIds || [], l = () => {
    var c, v, D;
    return (D = (v = (c = window == null ? void 0 : window.apya) == null ? void 0 : c.platform) == null ? void 0 : v.tasks) == null ? void 0 : D.task;
  }, { data: o = [] } = Q({
    queryKey: ["task-dependency-candidates", t.projectId ?? null],
    queryFn: async () => {
      var v;
      const c = await Promise.resolve((v = l()) == null ? void 0 : v.getList({ projectId: t.projectId || void 0, maxResultCount: 1e3 }));
      return (c == null ? void 0 : c.items) ?? [];
    },
    enabled: !!t.id,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), { data: n = [], isLoading: i } = Q({
    queryKey: ["task-dependency-edges", t.projectId ?? null],
    queryFn: async () => {
      var c;
      return await Promise.resolve((c = l()) == null ? void 0 : c.getProjectDependencies(t.projectId || void 0)) ?? [];
    },
    enabled: !!t.id,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), x = p.useMemo(() => new Map(o.map((c) => [c.id, c])), [o]), u = n.filter((c) => c.predecessorTaskId === t.id).map((c) => c.taskId), h = o.filter((c) => c.id !== t.id && !r.includes(c.id) && !u.includes(c.id)), [m, d] = p.useState(""), { data: b = [], isLoading: f } = Q({
    queryKey: ["task-predecessors", t.id, r],
    queryFn: async () => {
      const c = l();
      return c ? Promise.all(
        r.map(
          (v) => Promise.resolve(c.get(v)).catch(() => ({ id: v, title: "(erişilemeyen görev)", status: null, code: "—" }))
        )
      ) : [];
    },
    enabled: r.length > 0,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), N = async (c) => {
    var v, D, $;
    try {
      await Promise.resolve(l().update(t.id, Bt(t, {
        predecessorIds: r.filter((K) => K !== c)
      }))), await a.invalidateQueries({ queryKey: ["task-detail", t.id] }), await a.invalidateQueries({ queryKey: ["task-dependency-edges"] }), ($ = (D = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : D.info) == null || $.call(D, "Bağlantı kaldırıldı.");
    } catch (K) {
      E(K, "Bağlantı kaldırılamadı.");
    }
  }, y = async () => {
    var c, v, D;
    if (m)
      try {
        await Promise.resolve(l().update(t.id, Bt(t, {
          predecessorIds: [...r, m]
        }))), d(""), await a.invalidateQueries({ queryKey: ["task-detail", t.id] }), await a.invalidateQueries({ queryKey: ["task-dependency-edges"] }), (D = (v = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : v.success) == null || D.call(v, "Öncül eklendi.");
      } catch ($) {
        E($, "Öncül eklenemedi.");
      }
  }, w = (c) => {
    var v, D, $;
    return ($ = (D = (v = window == null ? void 0 : window.apya) == null ? void 0 : v.taskDetail) == null ? void 0 : D.open) == null ? void 0 : $.call(D, c);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsxs(
      na,
      {
        icon: "fa-arrow-left-long",
        iconTone: "text-warning",
        title: "Öncül görevler",
        note: "bu görev başlamadan tamamlanmalı",
        children: [
          r.length === 0 ? /* @__PURE__ */ e.jsx(ye, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : f ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : b.map((c) => {
            const v = c.status == null ? null : he(c.status);
            return /* @__PURE__ */ e.jsxs(
              "div",
              {
                className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
                children: [
                  /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: c.code || "—" }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => w(c.id),
                      className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                      children: c.title || "Başlıksız görev"
                    }
                  ),
                  v && /* @__PURE__ */ e.jsx(Ee, { bg: v.bg, fg: v.fg, children: v.label }),
                  !s && /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      title: "Bağlantıyı kaldır",
                      "aria-label": `${c.title} bağlantısını kaldır`,
                      onClick: () => N(c.id),
                      className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link-slash text-[10px]" })
                    }
                  )
                ]
              },
              c.id
            );
          }),
          !s && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-4 py-3 border-t border-subtle", children: [
            /* @__PURE__ */ e.jsxs(
              "select",
              {
                "aria-label": "Öncül görev seç",
                value: m,
                onChange: (c) => d(c.target.value),
                className: "flex-1 min-w-0 h-8 px-2.5 rounded-[9px] border border-default bg-surface-base text-text-primary text-[12.5px]",
                children: [
                  /* @__PURE__ */ e.jsx("option", { value: "", children: h.length ? "Öncül görev seçin…" : "Eklenebilecek görev yok" }),
                  h.map((c) => /* @__PURE__ */ e.jsx("option", { value: c.id, children: (c.code ? c.code + " · " : "") + (c.title || "Başlıksız görev") }, c.id))
                ]
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: y,
                disabled: !m,
                className: "shrink-0 h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed",
                children: "Öncül ekle"
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ e.jsx(
      na,
      {
        icon: "fa-arrow-right-long",
        iconTone: "text-primary",
        title: "Ardıl görevler",
        note: "bu görev bitince başlar",
        children: i ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : u.length === 0 ? /* @__PURE__ */ e.jsx(ye, { icon: "fa-diagram-project", title: "Ardıl görev yok", description: "Bu görevi öncül olarak gösteren bir görev yok." }) : u.map((c) => {
          const v = x.get(c), D = v && v.status != null ? he(v.status) : null;
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: (v == null ? void 0 : v.code) || "—" }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => w(c),
                    className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                    children: (v == null ? void 0 : v.title) || "(erişilemeyen görev)"
                  }
                ),
                D && /* @__PURE__ */ e.jsx(Ee, { bg: D.bg, fg: D.fg, children: D.label })
              ]
            },
            c
          );
        })
      }
    )
  ] });
}
function Le() {
  var t, s, a;
  return ((a = (s = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : s.tasks) == null ? void 0 : a.task) || null;
}
function sn(t) {
  const s = ne(), a = ["task-timelogs", t], r = ["task-active-timelog"], l = Q({
    queryKey: a,
    queryFn: () => {
      var u;
      return Promise.resolve((u = Le()) == null ? void 0 : u.getTimeLogs(t));
    },
    enabled: !!t && !!Le(),
    staleTime: 15e3,
    meta: { persist: !1 },
    retry: !1
  }), o = Q({
    queryKey: r,
    /* Kayıt yokken uç 204 döner, proxy undefined çözer; TanStack v5 undefined'ı
       hata sayıp önceki çalışan kaydı ekranda bırakır (sayaç durmazdı). */
    queryFn: () => {
      var u;
      return Promise.resolve((u = Le()) == null ? void 0 : u.getActiveTimeLog()).then((h) => h ?? null);
    },
    enabled: !!Le(),
    staleTime: 5e3,
    /* Canlı sayaç kanbandan da başlatılıp durduruluyor; açılışlar arasında taşınmaz. */
    meta: { persist: !1 },
    retry: !1
  }), n = () => {
    s.invalidateQueries({ queryKey: a }), s.invalidateQueries({ queryKey: r });
  }, i = te({
    mutationFn: () => {
      var u;
      return Promise.resolve((u = Le()) == null ? void 0 : u.startTimeTracking(t));
    },
    onSuccess: n
  }), x = te({
    mutationFn: () => {
      var u;
      return Promise.resolve((u = Le()) == null ? void 0 : u.stopTimeTracking(t));
    },
    onSuccess: n
  });
  return {
    logs: l.data ?? [],
    isLoading: l.isLoading,
    activeLog: o.data ?? null,
    start: i.mutateAsync,
    stop: x.mutateAsync,
    isMutating: i.isPending || x.isPending
  };
}
function ia(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function rn({ taskId: t, task: s = {} }) {
  const a = sn(t), r = a.activeLog && a.activeLog.taskId === t ? a.activeLog : null, [l, o] = p.useState(() => Date.now());
  p.useEffect(() => {
    if (!r) return;
    const f = setInterval(() => o(Date.now()), 1e3);
    return () => clearInterval(f);
  }, [r]);
  const n = r ? Math.max(0, Math.floor((l - new Date(r.startTime).getTime()) / 1e3)) : 0, x = a.logs.reduce((f, N) => f + (N.secondsSpent || 0), 0) + n, u = (s == null ? void 0 : s.estimatedHours) ?? null, h = u ? u * 3600 : 0, m = h ? Math.min(100, Math.round(x / h * 100)) : 0, d = h ? Math.max(0, h - x) : 0, b = async () => {
    try {
      r ? await a.stop() : await a.start();
    } catch (f) {
      E(f, "Zaman takibi güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-5 flex-wrap p-[22px] rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[18px]", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: b,
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
              children: tr(x)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary", children: r ? "Kayıt sürüyor" : "Sayaç duraklatıldı" })
        ] })
      ] }),
      h > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] font-bold text-text-secondary", children: "Tahmin kullanımı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
            yt(x),
            " / ",
            u,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-warning", style: { width: `${m}%` } }) }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "Kalan tahmini süre: ",
          yt(d)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: Pe, children: [
      /* @__PURE__ */ e.jsx(Ze, { title: "Zaman kayıtları" }),
      a.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : a.logs.length === 0 ? /* @__PURE__ */ e.jsx(
        ye,
        {
          icon: "fa-stopwatch",
          title: "Henüz zaman kaydı yok",
          description: "Soldaki yeşil düğmeyle sayacı çalıştırın; durdurduğunuzda kayıt buraya düşer."
        }
      ) : a.logs.map((f) => {
        const N = !f.endTime;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
            children: [
              /* @__PURE__ */ e.jsx(bt, { name: f.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: f.note || f.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                ia(f.startTime),
                " → ",
                N ? "sürüyor" : ia(f.endTime)
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary", children: N ? "Aktif" : yt(f.secondsSpent || 0) })
            ]
          },
          f.id
        );
      })
    ] })
  ] });
}
const tt = [
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
    component: Lr,
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
    component: Mr,
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
    component: Yr,
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
    component: tn,
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
    component: an,
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
    component: Ir,
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
    component: br,
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
    component: rn,
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
    component: Or,
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
    component: Xr,
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
    component: Fr,
    surfaces: ["task", "project", "tasks"]
  }
];
function Oa(t = []) {
  const s = new Set(t);
  return tt.filter((a) => !a.hidden).filter((a) => a.implemented && (a.isCore || s.has(a.code))).sort((a, r) => a.order - r.order);
}
function Qa(t = []) {
  const s = new Set(t);
  return tt.filter((a) => !a.hidden).filter((a) => !a.isCore).filter((a) => !a.permission || oe(a.permission)).map((a) => ({ ...a, isAssigned: s.has(a.code) })).sort((a, r) => a.order - r.order);
}
let rt = null;
const ct = /* @__PURE__ */ new Set(), wt = /* @__PURE__ */ new Set();
let nt = !1;
function la() {
  ct.forEach((t) => t());
}
function nn(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const W = {
  open(t) {
    const s = nn(t);
    s && (rt = s, la());
  },
  close() {
    rt = null, la();
  },
  subscribe(t) {
    return ct.add(t), () => ct.delete(t);
  },
  getSnapshot() {
    return rt;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && wt.add(t);
  },
  emitResult() {
    nt = !1, wt.forEach((t) => t());
  },
  /** Adada bir yazma oldu ya da başladı — kapanışta liste/kanban tazelensin. */
  markChanged() {
    nt = !0;
  },
  /** Yalnız yazma olduysa sonuç yayınlar: salt bakıp kapatmak sayfayı yeniden yüklemez.
      'this' kullanılmaz; metot referansla da geçirilebilir. */
  emitResultIfChanged() {
    nt && W.emitResult();
  },
  /** Yalnız testler için. */
  reset() {
    rt = null, nt = !1, ct.clear(), wt.clear();
  }
}, oa = "apya.taskDetail.fullscreen";
function Ha({ taskId: t, presentation: s = "modal", onClose: a }) {
  const [r, l] = p.useState(t), [o, n] = p.useState([]), { data: i, isPending: x, isError: u, refetch: h } = Lt(r), m = Sa(), d = La(i), b = Ma(), f = Ka(r), [N, y] = p.useState("general"), [w, c] = p.useState(!1), v = Me.useRef(null), D = p.useMemo(
    () => Oa(f.assignedCodes),
    [f.assignedCodes]
  ), $ = p.useMemo(
    () => Qa(f.assignedCodes),
    [f.assignedCodes]
  ), K = D.find((I) => I.code === N) ?? D[0];
  Me.useEffect(() => {
    K.code !== N && y(K.code);
  }, [K, N]);
  const X = K == null ? void 0 : K.component, B = ne(), [O, q] = p.useState(
    () => {
      var I;
      return ((I = window.localStorage) == null ? void 0 : I.getItem(oa)) === "1";
    }
  ), [L, G] = p.useState(!1), [U, _] = p.useState(!1), Y = p.useCallback(() => {
    Kt(), a == null || a();
  }, [a]);
  Aa(s === "page" ? null : t, Y), Me.useEffect(() => {
    d.isDirty ? m.markDirty() : m.markClean();
  });
  const Z = p.useCallback(() => {
    L || (_(!1), m.requestClose(Y));
  }, [m, Y, L]), J = p.useCallback(() => {
    q((I) => {
      var R;
      const z = !I;
      return (R = window.localStorage) == null || R.setItem(oa, z ? "1" : "0"), z;
    });
  }, []), S = oe("Platform.Tasks.Delete"), [M, V] = p.useState(!1), [ae, ie] = p.useState(!1), ce = p.useCallback(async () => {
    var I, z, R;
    ie(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (R = (z = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : z.info) == null || R.call(z, "Başarıyla silindi."), V(!1), m.markClean(), Y();
    } catch (xe) {
      E(xe, "Görev silinemedi.");
    } finally {
      ie(!1);
    }
  }, [r, m, Y]), se = p.useCallback(async () => {
    var I, z, R;
    if (!d.validate()) return !1;
    G(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, d.toUpdateDto())
      ), await B.invalidateQueries({ queryKey: ["task-detail", r] }), W.emitResult(), (R = (z = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : z.success) == null || R.call(z, "Kaydedildi."), !0;
    } catch (xe) {
      return E(xe, "Kaydedilemedi."), !1;
    } finally {
      G(!1);
    }
  }, [r, d, m, B]), H = p.useCallback(() => {
    se();
  }, [se]), de = p.useCallback(async () => {
    if (_(!1), !d.validate()) {
      m.resolvePendingClose("stay"), y("general");
      return;
    }
    await se() ? m.resolvePendingClose("saved") : _(!0);
  }, [m, d, se]), P = p.useCallback((I, z) => {
    m.requestClose(() => {
      n((R) => [...R, { id: r, title: (i == null ? void 0 : i.title) ?? "" }]), l(I), y("general"), m.markClean();
    });
  }, [m, r, i]), ee = p.useCallback((I) => {
    m.requestClose(() => {
      n((z) => {
        const R = z.findIndex((xe) => xe.id === I);
        return R === -1 ? z : z.slice(0, R);
      }), l(I), y("general"), m.markClean();
    });
  }, [m]), C = p.useCallback(async (I) => {
    try {
      await f.addFeature(I), y(I), c(!1);
    } catch (z) {
      E(z, "Özellik eklenemedi.");
    }
  }, [f]), g = p.useCallback(async (I) => {
    try {
      await f.removeFeature(I), y((z) => z === I ? "general" : z);
    } catch (z) {
      E(z, "Özellik kaldırılamadı.");
    }
  }, [f]);
  Me.useEffect(() => {
    if (!w) return;
    const I = (R) => {
      v.current && !v.current.contains(R.target) && c(!1);
    }, z = (R) => {
      R.key === "Escape" && c(!1);
    };
    return document.addEventListener("mousedown", I), document.addEventListener("keydown", z), () => {
      document.removeEventListener("mousedown", I), document.removeEventListener("keydown", z);
    };
  }, [w]);
  const j = x ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(Ce, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(Ce, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(Ce, { className: "h-24 w-full" })
  ] }) : u && !i ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(re, { variant: "ghost", onClick: () => h(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      Hs,
      {
        trail: o,
        current: { id: r, title: (i == null ? void 0 : i.title) ?? "" },
        onNavigate: ee
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: v, children: [
      /* @__PURE__ */ e.jsx(
        Vs,
        {
          tabs: D,
          activeCode: K.code,
          onSelect: (I) => {
            y(I), c(!1);
          },
          onOpenPicker: () => c((I) => !I),
          pickerOpen: w
        }
      ),
      w && /* @__PURE__ */ e.jsx(
        Qs,
        {
          entries: $,
          busyCode: f.isMutating ? f.mutatingCode : null,
          onAdd: C,
          onRemove: g
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
            Gs,
            {
              values: d.values,
              errors: d.errors,
              onFieldChange: d.setField,
              assigneeOptions: b.options,
              isLoadingAssignees: b.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(p.Suspense, { fallback: /* @__PURE__ */ e.jsx(Ce, { className: "h-24 w-full" }), children: X && /* @__PURE__ */ e.jsx(
            X,
            {
              taskId: r,
              task: i,
              form: d,
              onOpenSubtask: P
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            Ys,
            {
              task: i,
              creatorName: b.nameById.get(i.creatorId),
              lastModifierName: b.nameById.get(i.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), F = s === "page" ? As : Fs;
  return /* @__PURE__ */ e.jsxs(
    F,
    {
      open: !0,
      fullscreen: O,
      onRequestClose: Z,
      title: i ? `Görev Detayı: ${i.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        Ls,
        {
          task: i ?? { title: "Yükleniyor…" },
          canDelete: S,
          fullscreen: O,
          onToggleFullscreen: J,
          onClose: Z,
          onDelete: () => V(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        Ks,
        {
          lastSavedAt: i == null ? void 0 : i.lastModificationTime,
          isDirty: m.isDirty,
          isSaving: L,
          onCancel: Z,
          onSave: H
        }
      ),
      children: [
        j,
        /* @__PURE__ */ e.jsx(
          At,
          {
            open: m.pendingClose,
            isSaving: L,
            errorText: U ? ue("Common:Unsaved:SaveFailed", "Kaydedilemedi. Düzenlemeye dönebilir ya da değişiklikleri atabilirsiniz.") : void 0,
            onStay: () => {
              _(!1), m.resolvePendingClose("stay");
            },
            onDiscard: () => {
              _(!1), d.reset(), m.resolvePendingClose("discard");
            },
            onSave: de
          }
        ),
        M && /* @__PURE__ */ e.jsx(
          ln,
          {
            taskTitle: (i == null ? void 0 : i.title) ?? "",
            busy: ae,
            onCancel: () => V(!1),
            onConfirm: ce
          }
        )
      ]
    }
  );
}
function ln({ taskTitle: t, busy: s, onCancel: a, onConfirm: r }) {
  const [l, o] = p.useState(""), n = l.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    on,
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
        /* @__PURE__ */ e.jsx(re, { variant: "secondary", onClick: a, disabled: s, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          re,
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
function on({ label: t, title: s, description: a, children: r, actions: l }) {
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
const cn = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function dn({ isPrivate: t = !1, onChange: s = () => {
}, disabled: a = !1 }) {
  const r = !!t, [l, o] = p.useState(null);
  return /* @__PURE__ */ e.jsxs(De, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(Te, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
    /* @__PURE__ */ e.jsx(Se, { container: ze(l), children: /* @__PURE__ */ e.jsxs(
      $e,
      {
        sideOffset: 8,
        align: "end",
        className: "z-50 w-[360px] rounded-2xl border border-subtle bg-surface-base p-4 shadow-float animate-in fade-in-50 zoom-in-95",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle pb-3 mb-3", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shield-halved text-primary text-base" }),
            /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary", children: "Görünürlük" })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: cn.map((n) => {
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
const ca = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto", xn = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", un = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" }
];
function pn({ children: t }) {
  return /* @__PURE__ */ e.jsx(zt, { asChild: !0, children: t });
}
function mn({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "inline-flex items-center h-[19px] px-1.5 rounded-[5px] border border-default border-b-2 bg-neutral-subtle font-mono text-[10px] font-semibold text-text-secondary", children: t });
}
function fn({
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
  boardColumnValue: x,
  titleValue: u,
  /* Doğrulama hatası (useTaskForm.errors.title): başlığın altında gösterilir. */
  titleError: h,
  isPrivateValue: m,
  isFavorite: d,
  onToggleFavorite: b,
  isWatched: f,
  onToggleWatch: N,
  onDuplicate: y,
  onCancelTask: w,
  onDelete: c,
  onOpenTransfer: v,
  onExportPdf: D,
  /* Yetki (root hesaplar; sunucudaki EnsureCanMutateTaskAsync ile aynı kural). Eskiden
     menü ve alanlar herkese açıktı, yetkisiz kullanıcı tıklayınca 403 alıyordu. */
  canEdit: $ = !0,
  canChangeStatus: K = !0,
  canDelete: X = !0
}) {
  const [B, O] = p.useState(!1), [q, L] = p.useState(null), [G, U] = p.useState(!1), _ = p.useRef(null), Y = p.useId(), Z = ze(q), J = n ?? t.status, S = Ea(i), M = Ba(
    S,
    J,
    x === void 0 ? t.boardColumnId : x
  ), V = { ...he(J), ...M ? { label: M.label } : {} }, ae = (P) => {
    o("status", P.status), o("boardColumnId", P.boardColumnId);
  }, ie = t.code || "GRV-—", ce = () => {
    var P;
    (P = navigator.clipboard) == null || P.writeText(ie), O(!0), setTimeout(() => O(!1), 1800);
  }, se = () => {
    var P, ee, C, g;
    (P = navigator.clipboard) == null || P.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), (g = (C = (ee = window == null ? void 0 : window.abp) == null ? void 0 : ee.notify) == null ? void 0 : C.success) == null || g.call(C, "Görev bağlantısı panoya kopyalandı.");
  }, H = (P) => () => {
    U(!1), P == null || P();
  }, de = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", onClick: H(se) },
    { label: "Çoğalt", icon: "fa-copy", allowed: $, onClick: H(y) },
    { label: "Başka projeye kopyala", icon: "fa-clone", allowed: $, onClick: H(() => v == null ? void 0 : v("copy")) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, allowed: $, onClick: H(() => v == null ? void 0 : v("move")) },
    { label: f ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: H(N) },
    { label: "Görevi iptal et", icon: "fa-ban", separator: !0, allowed: K && t.status !== 0, onClick: H(w) },
    { label: "Yazdır", icon: "fa-print", kbd: "Ctrl P", onClick: H(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: H(D) },
    { label: "Sil", icon: "fa-trash-can", separator: !0, danger: !0, allowed: X, onClick: H(c) }
  ].filter((P) => P.allowed !== !1);
  return /* @__PURE__ */ e.jsxs("header", { ref: L, className: "shrink-0 px-6 lt-860:px-4 pt-[18px] pb-4 border-b border-subtle bg-surface-base", children: [
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
              /* @__PURE__ */ e.jsx("i", { className: `${B ? "fa-solid fa-check" : "fa-regular fa-copy"} text-[9px] opacity-60` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(De, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Te, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              disabled: !$,
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] border border-default text-[12px] font-semibold ${$ ? "cursor-pointer" : "cursor-default"} ${V.bg} ${V.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-current animate-pulse" }),
                /* @__PURE__ */ e.jsx("span", { children: V.label }),
                $ && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(Se, { container: Z, children: /* @__PURE__ */ e.jsxs($e, { sideOffset: 6, align: "start", className: `${ca} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            S.map((P) => {
              const ee = (M == null ? void 0 : M.key) === P.key;
              return /* @__PURE__ */ e.jsx(pn, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => ae(P),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${ee ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${P.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: P.label }),
                    ee && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, P.key);
            })
          ] }) })
        ] }),
        f && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 h-[26px] px-2.5 rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11.5px] font-semibold", children: [
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
          dn,
          {
            isPrivate: m ?? !!t.isPrivate,
            onChange: (P) => o("isPrivate", P),
            disabled: !$
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
        /* @__PURE__ */ e.jsxs(De, { modal: !0, open: G, onOpenChange: U, children: [
          /* @__PURE__ */ e.jsx(Te, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer seçenekler",
              className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${G ? "bg-surface-hover text-text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(Se, { container: Z, children: /* @__PURE__ */ e.jsxs(
            $e,
            {
              sideOffset: 6,
              align: "end",
              collisionBoundary: Z ?? [],
              collisionPadding: 12,
              className: `${ca} w-[244px]`,
              children: [
                de.map((P) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: P.onClick,
                    className: [
                      xn,
                      P.danger ? "text-negative" : "text-text-secondary",
                      P.separator ? "border-t border-subtle mt-[5px]" : ""
                    ].join(" "),
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${P.icon} text-[11px] w-[14px] opacity-75` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: P.label }),
                      P.kbd && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: P.kbd })
                    ]
                  },
                  P.label
                )),
                /* @__PURE__ */ e.jsxs("div", { className: "mt-1.5 pt-[9px] px-[9px] pb-[7px] border-t border-subtle", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 mb-[7px]", children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-keyboard text-[11px] text-text-tertiary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-[.09em] text-text-tertiary", children: "Kısayollar" })
                  ] }),
                  un.map((P) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: P.what }),
                    /* @__PURE__ */ e.jsx(mn, { children: P.key })
                  ] }, P.what))
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
          ref: _,
          role: "textbox",
          "aria-label": ue("Tasks:Detail:TitleLabel", "Görev başlığı"),
          "aria-readonly": !$ || void 0,
          "aria-invalid": !!h || void 0,
          "aria-describedby": h ? Y : void 0,
          contentEditable: $,
          suppressContentEditableWarning: !0,
          spellCheck: !1,
          onInput: $ ? (P) => o("title", P.currentTarget.textContent.trim()) : void 0,
          onBlur: $ ? (P) => o("title", P.currentTarget.textContent.trim()) : void 0,
          className: `flex-1 min-w-0 text-[24px] lt-560:text-[20px] font-extrabold tracking-[-.025em] leading-[1.2] text-text-primary px-2 -ml-2 py-[3px] rounded-[9px] border ${h ? "border-negative" : "border-transparent"} ${$ ? `cursor-text hover:bg-neutral-subtle focus:bg-neutral-subtle focus:shadow-focus focus:outline-none ${h ? "" : "hover:border-subtle focus:border-focus"}` : ""}`,
          children: u ?? t.title ?? "Başlıksız görev"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: b,
          title: d ? "Favorilerden çıkar" : "Favorilere ekle",
          className: `flex items-center justify-center h-8 w-8 shrink-0 rounded-[9px] cursor-pointer ${d ? "bg-warning-subtle text-warning" : "text-text-tertiary hover:bg-surface-hover"}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${d ? "solid" : "regular"} fa-star text-[15px]` })
        }
      )
    ] }),
    h && /* @__PURE__ */ e.jsx("p", { id: Y, role: "alert", className: "mt-1 mb-0 text-[12px] font-semibold text-negative", children: h })
  ] });
}
const it = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", da = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function we({ children: t }) {
  return /* @__PURE__ */ e.jsx(zt, { asChild: !0, children: t });
}
function ge({ label: t, children: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[7px] min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.08em] text-text-tertiary select-none", children: t }),
    s
  ] });
}
function xa({ name: t, size: s = 26 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: s, width: s, background: et(t), fontSize: s * 0.38 },
      children: Xe(t)
    }
  );
}
function ua(t) {
  if (t == null) return "—";
  const s = Math.max(0, Math.round(Number(t) * 60)), a = Math.floor(s / 60), r = s % 60;
  return a ? r ? `${a}s ${r}dk` : `${a}s` : `${r}dk`;
}
function bn({
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
  assigneeValue: x,
  projectValue: u,
  dueDateValue: h,
  startDateValue: m,
  tagsValue: d = [],
  progressPercent: b = 0,
  progressNote: f = "",
  onOpenTransfer: N,
  /* Düzenleme yetkisi yoksa ızgara salt okunur: tüm alanlar forma, oradan UpdateAsync'e
     gider; yetkisiz kullanıcı değiştirip Kaydet'te 403 alıyordu. */
  readOnly: y = !1,
  /* Doğrulama hataları (useTaskForm.errors): ilgili hücrenin altında gösterilir. */
  startDateError: w,
  dueDateError: c
}) {
  var C, g;
  const v = p.useId(), D = p.useId(), [$, K] = p.useState(""), [X, B] = p.useState(""), [O, q] = p.useState(""), [L, G] = p.useState(!1), [U, _] = p.useState(null), Y = l ?? t.status, Z = Ea(o), J = Ba(
    Z,
    Y,
    n === void 0 ? t.boardColumnId : n
  ), S = { ...he(Y), ...J ? { label: J.label } : {} }, M = (j) => {
    r("status", j.status), r("boardColumnId", j.boardColumnId);
  }, V = ft(i ?? t.priority), ae = x ?? t.assigneeId ?? null, ie = u ?? t.projectId ?? null, ce = ((C = s.find((j) => j.value === ae)) == null ? void 0 : C.label) || t.assigneeName || "Atanmamış", se = ((g = a.find((j) => j.value === ie)) == null ? void 0 : g.label) || t.projectName || "Projesiz", H = $a(h ?? t.dueDate), de = s.filter(
    (j) => !$ || j.label.toLowerCase().includes($.toLowerCase())
  ), P = a.filter(
    (j) => !X || j.label.toLowerCase().includes(X.toLowerCase())
  ), ee = () => {
    const j = O.trim();
    j && !d.includes(j) && r("tagNames", [...d, j]), q(""), G(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { ref: _, className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsx(
    "fieldset",
    {
      disabled: y,
      className: "m-0 p-0 border-0 min-w-0 [&:disabled_label]:pointer-events-none [&_:disabled]:pointer-events-none [&:disabled_.fa-chevron-down]:hidden",
      children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6", children: [
        /* @__PURE__ */ e.jsx(ge, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(De, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Te, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx(xa, { name: ae ? ce : null }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: ce }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(Se, { container: ze(U), children: /* @__PURE__ */ e.jsxs($e, { sideOffset: 6, align: "start", className: `${it} w-[264px]`, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: $,
                  onChange: (j) => K(j.target.value),
                  placeholder: "Kişi ara…",
                  className: da
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[230px] overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsx(we, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("assigneeId", null),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] text-left cursor-pointer ${ae ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary font-semibold"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "flex h-6 w-6 items-center justify-center rounded-full bg-neutral-subtle text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-user-slash text-[9px]" }) }),
                    /* @__PURE__ */ e.jsx("span", { children: "Atanmamış" })
                  ]
                }
              ) }),
              s.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-2 py-1.5 text-[12px] text-text-tertiary", children: "Kullanıcı listesi yükleniyor…" }),
              de.map((j) => /* @__PURE__ */ e.jsx(we, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("assigneeId", j.value),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${ae === j.value ? "bg-primary-subtle" : "hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx(xa, { name: j.label, size: 24 }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: j.label }),
                    ae === j.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
                  ]
                }
              ) }, j.value))
            ] })
          ] }) })
        ] }) }),
        /* @__PURE__ */ e.jsxs(ge, { label: "Son tarih", children: [
          /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-regular fa-calendar text-[13px] ${H.tone}` }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "date",
                value: (h ?? t.dueDate ?? "").slice(0, 10),
                onChange: (j) => r("dueDate", j.target.value),
                "aria-label": "Son tarih",
                "aria-invalid": !!c || void 0,
                "aria-describedby": c ? v : void 0,
                className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
              }
            )
          ] }),
          c ? /* @__PURE__ */ e.jsx("span", { id: v, role: "alert", className: "-mt-0.5 text-[10.5px] font-semibold text-negative", children: c }) : H.hint && /* @__PURE__ */ e.jsx("span", { className: `-mt-0.5 text-[10.5px] font-semibold ${H.tone}`, children: H.hint })
        ] }),
        /* @__PURE__ */ e.jsxs(ge, { label: "Başlangıç", children: [
          /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[13px] text-text-tertiary" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "date",
                value: (m ?? t.startDate ?? "").slice(0, 10),
                onChange: (j) => r("startDate", j.target.value),
                "aria-label": "Başlangıç",
                "aria-invalid": !!w || void 0,
                "aria-describedby": w ? D : void 0,
                className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
              }
            )
          ] }),
          w && /* @__PURE__ */ e.jsx("span", { id: D, role: "alert", className: "-mt-0.5 text-[10.5px] font-semibold text-negative", children: w })
        ] }),
        /* @__PURE__ */ e.jsx(ge, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 pt-[5px]", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
            /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: [
              "%",
              b
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-medium text-text-tertiary", children: f })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "h-1.5 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
            "div",
            {
              className: "h-full rounded-full bg-primary transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
              style: { width: `${b}%` }
            }
          ) })
        ] }) }),
        /* @__PURE__ */ e.jsx(ge, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(De, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Te, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${S.bg} ${S.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${S.icon} text-[11px]` }),
                /* @__PURE__ */ e.jsx("span", { children: S.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(Se, { container: ze(U), children: /* @__PURE__ */ e.jsxs($e, { sideOffset: 6, align: "start", className: `${it} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            Z.map((j) => {
              const F = (J == null ? void 0 : J.key) === j.key;
              return /* @__PURE__ */ e.jsx(we, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => M(j),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${F ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${j.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: j.label }),
                    F && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, j.key);
            })
          ] }) })
        ] }) }) }),
        /* @__PURE__ */ e.jsx(ge, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(De, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Te, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${V.bg} ${V.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${V.icon} text-[11px]` }),
                /* @__PURE__ */ e.jsx("span", { children: V.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(Se, { container: ze(U), children: /* @__PURE__ */ e.jsxs($e, { sideOffset: 6, align: "start", className: `${it} w-[184px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
            ks.map((j) => {
              const F = Cs[j], I = (i ?? t.priority) === j;
              return /* @__PURE__ */ e.jsx(we, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("priority", j),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${I ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${F.icon} text-[11px] w-[13px]` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: F.label }),
                    I && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, j);
            })
          ] }) })
        ] }) }) }),
        /* @__PURE__ */ e.jsx(ge, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap min-h-8", children: [
          d.map((j) => /* @__PURE__ */ e.jsxs(
            "span",
            {
              className: "inline-flex items-center gap-1.5 h-6 px-2 rounded-[7px] border border-primary bg-primary-subtle text-primary text-[11.5px] font-bold",
              children: [
                /* @__PURE__ */ e.jsx("span", { children: j }),
                !y && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Etiketi kaldır",
                    onClick: () => r("tagNames", d.filter((F) => F !== j)),
                    className: "flex items-center p-0 border-0 bg-transparent text-current opacity-55 hover:opacity-100 hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
                  }
                )
              ]
            },
            j
          )),
          y ? d.length === 0 && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "—" }) : L ? /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: O,
              onChange: (j) => q(j.target.value),
              onBlur: ee,
              onKeyDown: (j) => {
                j.key === "Enter" && ee(), j.key === "Escape" && (q(""), G(!1));
              },
              placeholder: "Etiket…",
              className: "h-6 w-24 px-2 rounded-[7px] border border-focus bg-surface-base text-text-primary text-[11.5px] shadow-focus focus:outline-none"
            }
          ) : /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              "aria-label": "Yeni etiket ekle",
              onClick: () => G(!0),
              className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-dashed border-strong bg-transparent text-text-tertiary text-[11.5px] font-semibold hover:border-focus hover:text-primary hover:bg-primary-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[9px]" }),
                "Etiket"
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ e.jsx(ge, { label: "Proje", children: /* @__PURE__ */ e.jsxs(De, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Te, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-[13px] text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: se }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(Se, { container: ze(U), children: /* @__PURE__ */ e.jsxs($e, { sideOffset: 6, align: "start", className: `${it} w-[250px]`, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: X,
                  onChange: (j) => B(j.target.value),
                  placeholder: "Proje ara…",
                  className: da
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[210px] overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsx(we, { children: /* @__PURE__ */ e.jsxs(
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
              P.map((j) => /* @__PURE__ */ e.jsx(we, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("projectId", j.value),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${ie === j.value ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-primary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: j.label }),
                    ie === j.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
                  ]
                }
              ) }, j.value))
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-[7px] pt-[7px] border-t border-subtle", children: [
              /* @__PURE__ */ e.jsx(we, { children: /* @__PURE__ */ e.jsxs(
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
              /* @__PURE__ */ e.jsx(we, { children: /* @__PURE__ */ e.jsxs(
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
        /* @__PURE__ */ e.jsx(ge, { label: "Harcanan / tahmin", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[9px] h-8", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock text-[13px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[13px] font-bold text-text-primary", children: ua(t.spentHours ?? 0) }),
          /* @__PURE__ */ e.jsxs("span", { className: "text-[12px] text-text-tertiary", children: [
            "/ ",
            t.estimatedHours != null ? ua(t.estimatedHours) : "—"
          ] })
        ] }) })
      ] })
    }
  ) });
}
const hn = "z-popover w-[225px] rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto";
function qt({ entries: t = [], onPick: s, children: a }) {
  const [r, l] = p.useState(null), o = ze(r);
  return /* @__PURE__ */ e.jsx("span", { ref: l, className: "contents", children: /* @__PURE__ */ e.jsxs(De, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(Te, { asChild: !0, children: a }),
    /* @__PURE__ */ e.jsx(Se, { container: o, children: /* @__PURE__ */ e.jsxs($e, { sideOffset: 6, align: "start", collisionPadding: 12, className: hn, children: [
      /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Özellik ekle" }),
      t.map((n) => /* @__PURE__ */ e.jsx(zt, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
function yn({
  activeTab: t,
  onTabChange: s,
  orderedTabs: a = [],
  draggingCode: r,
  onDragStart: l,
  onDragEnd: o,
  onReorderTo: n,
  onReorderDrop: i,
  pickerEntries: x = [],
  onPickFeature: u,
  counts: h = {},
  isDirty: m = !1,
  canAdd: d = !0
}) {
  const [b, f] = p.useState(!1);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-6 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 py-2.5 flex-1 min-w-0 overflow-x-auto custom-scrollbar", children: [
      a.map((N) => {
        const y = t === N.code, w = h[N.code] || 0;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            draggable: !0,
            title: "Sürükleyerek sırayı değiştirin",
            ...Ia(() => s(N.code)),
            onDragStart: (c) => {
              l(N.code);
              try {
                c.dataTransfer.effectAllowed = "move", c.dataTransfer.setData("text/plain", N.code);
              } catch {
              }
            },
            onDragOver: (c) => {
              c.preventDefault(), n(N.code);
            },
            onDrop: (c) => {
              c.preventDefault(), i == null || i();
            },
            onDragEnd: o,
            className: [
              "flex shrink-0 items-center gap-2 h-[34px] px-[13px] rounded-[10px]",
              "text-[12.5px] whitespace-nowrap cursor-grab active:cursor-grabbing",
              "transition-opacity duration-fast",
              y ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
              r === N.code ? "opacity-35" : "opacity-100"
            ].join(" "),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${N.icon} text-[11px] opacity-85` }),
              /* @__PURE__ */ e.jsx("span", { children: N.title }),
              w > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                "rounded-full text-[10px] font-extrabold",
                y ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
              ].join(" "), children: w })
            ]
          },
          N.code
        );
      }),
      d && /* @__PURE__ */ e.jsx(qt, { entries: x, onPick: u, children: /* @__PURE__ */ e.jsxs(
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
            b ? "px-[13px]" : "px-[11px]"
          ].join(" "),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            b && /* @__PURE__ */ e.jsx("span", { className: "animate-fade-in-fast", children: "Özellik ekle" })
          ]
        }
      ) })
    ] }),
    m && /* @__PURE__ */ e.jsxs("span", { className: "flex shrink-0 items-center gap-[7px] h-[26px] px-2.5 rounded-full bg-warning-subtle text-warning text-[11px] font-bold", children: [
      /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-warning animate-pulse" }),
      "Taslak"
    ] })
  ] });
}
function gn({
  activeTab: t,
  onTabChange: s,
  orderedTabs: a = [],
  draggingCode: r,
  onDragStart: l,
  onDragEnd: o,
  onReorderTo: n,
  onReorderDrop: i,
  pickerEntries: x = [],
  onPickFeature: u,
  counts: h = {},
  canAdd: m = !0
}) {
  return /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Görev özellikleri",
      className: "flex lt-860:hidden flex-col gap-[3px] w-[238px] shrink-0 py-4 px-3 border-r border-subtle bg-surface-base overflow-y-auto custom-scrollbar",
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "px-2.5 pt-1 pb-2 text-[10px] font-extrabold uppercase tracking-[.1em] text-text-tertiary", children: "Özellikler" }),
        a.map((d) => {
          const b = t === d.code, f = h[d.code] || 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              draggable: !0,
              title: "Sürükleyerek sırayı değiştirin",
              ...Ia(() => s(d.code)),
              onDragStart: (N) => {
                l(d.code);
                try {
                  N.dataTransfer.effectAllowed = "move", N.dataTransfer.setData("text/plain", d.code);
                } catch {
                }
              },
              onDragOver: (N) => {
                N.preventDefault(), n(d.code);
              },
              onDrop: (N) => {
                N.preventDefault(), i == null || i();
              },
              onDragEnd: o,
              className: [
                "flex shrink-0 items-center gap-[11px] h-9 px-[11px] rounded-[9px]",
                "text-[12.5px] text-left cursor-grab active:cursor-grabbing",
                "transition-opacity duration-fast",
                b ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
                r === d.code ? "opacity-35" : "opacity-100"
              ].join(" "),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.icon} text-[12px] w-[15px] opacity-85` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: d.title }),
                f > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                  "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                  "rounded-full text-[10px] font-extrabold",
                  b ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
                ].join(" "), children: f })
              ]
            },
            d.code
          );
        }),
        m && /* @__PURE__ */ e.jsx(qt, { entries: x, onPick: u, children: /* @__PURE__ */ e.jsxs(
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
function Fe({ label: t, value: s, avatarName: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 py-[9px] border-t border-subtle", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-tertiary shrink-0", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
      a && /* @__PURE__ */ e.jsx(
        "span",
        {
          className: "flex shrink-0 items-center justify-center h-[21px] w-[21px] rounded-full text-[color:var(--apya-avatar-fg)] text-[8.5px] font-bold",
          style: { background: et(a) },
          children: Xe(a)
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", title: typeof s == "string" ? s : void 0, children: s || "—" })
    ] })
  ] });
}
const pa = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "—";
function vn({ task: t = {}, nameById: s }) {
  const a = (o, n) => {
    var i;
    return o || n && ((i = s == null ? void 0 : s.get) == null ? void 0 : i.call(s, n)) || null;
  }, r = a(t.creatorName, t.creatorId), l = t.lastModificationTime ? a(t.lastModifierName, t.lastModifierId) : null;
  return /* @__PURE__ */ e.jsx("aside", { className: "flex flex-col gap-3.5 min-w-0", children: /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsx(Fe, { label: "Oluşturan", value: r || "Bilinmiyor", avatarName: r }),
    /* @__PURE__ */ e.jsx(Fe, { label: "Oluşturma tarihi", value: pa(t.creationTime) }),
    /* @__PURE__ */ e.jsx(Fe, { label: "Güncelleyen", value: l || "—", avatarName: l }),
    /* @__PURE__ */ e.jsx(Fe, { label: "Son güncelleme", value: pa(t.lastModificationTime) }),
    /* @__PURE__ */ e.jsx(Fe, { label: "Görev tipi", value: t.taskType }),
    /* @__PURE__ */ e.jsx(Fe, { label: "Sprint", value: t.sprint }),
    /* @__PURE__ */ e.jsx(Fe, { label: "İzleyenler", value: (t.watcherNames || []).join(", ") || "Kimse izlemiyor" })
  ] }) });
}
const ma = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
function kt({ name: t, size: s = 32 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: s, width: s, background: et(t), fontSize: s * 0.34 },
      children: Xe(t)
    }
  );
}
function fa({ open: t, onClick: s, label: a }) {
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
const Oe = (t) => [t == null ? void 0 : t.name, t == null ? void 0 : t.surname].filter(Boolean).join(" ") || (t == null ? void 0 : t.userName) || "", mt = "📎 ";
function jn({ text: t, attachments: s }) {
  const a = String(t ?? "").split(`
`);
  return /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[13px] leading-[1.65] text-text-secondary whitespace-pre-wrap", children: a.map((r, l) => {
    const o = r.startsWith(mt) ? r.slice(mt.length).trim() : null, n = o ? s.find((i) => i.fileName === o) : null;
    return /* @__PURE__ */ e.jsxs(Me.Fragment, { children: [
      l > 0 && `
`,
      n ? (
        /* Bağlantı belirteci (text-text-link): koyu temada text-primary 4,3:1 kalıyordu (AA 4,5). */
        /* @__PURE__ */ e.jsxs(
          "a",
          {
            href: n.downloadUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-center gap-1 font-semibold text-text-link hover:underline",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-[11px]", "aria-hidden": "true" }),
              o
            ]
          }
        )
      ) : r
    ] }, l);
  }) });
}
const ba = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function Nn({
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
  const n = t == null ? void 0 : t.id, i = ne(), [x, u] = p.useState(!0), [h, m] = p.useState(""), d = (r == null ? void 0 : r.items) ?? [], b = d.filter((g) => g.isDone).length, f = d.length ? Math.round(b / d.length * 100) : 0, N = async () => {
    const g = h.trim();
    if (!(!g || !n)) {
      m("");
      try {
        await r.addItem(g);
      } catch (j) {
        m((F) => F || g), E(j, "Madde eklenemedi.");
      }
    }
  }, [y, w] = p.useState(!0), [c, v] = p.useState(""), [D, $] = p.useState(!1), [K, X] = p.useState(!1), [B, O] = p.useState(null), [q, L] = p.useState(""), [G, U] = p.useState([]), [_, Y] = p.useState(!1), [Z, J] = p.useState(""), { data: S, isFetched: M } = Q({
    queryKey: ["task-users-lookup"],
    queryFn: () => {
      var g, j, F, I;
      return Promise.resolve((I = (F = (j = (g = window == null ? void 0 : window.apya) == null ? void 0 : g.platform) == null ? void 0 : j.tasks) == null ? void 0 : F.task) == null ? void 0 : I.getUsersLookup()).then((z) => (z == null ? void 0 : z.items) ?? []);
    },
    enabled: _,
    staleTime: 6e4,
    meta: { persist: !1 }
  }), V = Z.trim().toLocaleLowerCase("tr-TR"), ae = (S ?? []).filter((g) => !V || `${Oe(g)} ${g.userName ?? ""}`.toLocaleLowerCase("tr-TR").includes(V)), ie = (g) => {
    const j = Oe(g);
    v((F) => `${F && !/\s$/.test(F) ? `${F} ` : F}@${j} `), U((F) => F.some((I) => I.id === g.id) ? F : [...F, { id: g.id, label: j }]), Y(!1), J("");
  }, { data: ce = [] } = Q({
    queryKey: ["task-comments", n],
    queryFn: () => {
      var g, j, F, I;
      return Promise.resolve((I = (F = (j = (g = window == null ? void 0 : window.apya) == null ? void 0 : g.platform) == null ? void 0 : j.tasks) == null ? void 0 : F.task) == null ? void 0 : I.getComments(n));
    },
    enabled: !!n,
    staleTime: 1e4,
    meta: { persist: !1 }
  }), se = ht(n, {
    enabled: ce.some((g) => String(g.text ?? "").includes(mt))
  }), H = async (g) => {
    if (g)
      try {
        await se.upload(g), v((j) => (j && !j.endsWith(`
`) ? j + `
` : j) + mt + g.name);
      } catch (j) {
        E(j, "Dosya eklenemedi.");
      }
  }, de = async () => {
    await i.invalidateQueries({ queryKey: ["task-comments", n] }), await i.invalidateQueries({ queryKey: ["task-detail", n] });
  }, P = async () => {
    const g = c.trim();
    if (!(!g || !n || K)) {
      X(!0);
      try {
        const j = G.filter((F) => g.includes(`@${F.label}`)).map((F) => F.id);
        await Promise.resolve(window.apya.platform.tasks.task.addComment(n, g, j)), await de(), v(""), U([]);
      } catch (j) {
        E(j, "Yorum gönderilemedi.");
      } finally {
        X(!1);
      }
    }
  }, ee = async (g) => {
    const j = q.trim();
    if (!(!j || !n))
      try {
        let F = [];
        j.includes("@") && (F = (await i.fetchQuery({
          queryKey: ["task-users-lookup"],
          queryFn: () => {
            var z, R, xe, qe;
            return Promise.resolve((qe = (xe = (R = (z = window == null ? void 0 : window.apya) == null ? void 0 : z.platform) == null ? void 0 : R.tasks) == null ? void 0 : xe.task) == null ? void 0 : qe.getUsersLookup()).then((Ge) => (Ge == null ? void 0 : Ge.items) ?? []);
          },
          staleTime: 6e4
        }) ?? []).filter((z) => {
          const R = Oe(z);
          return R && j.includes(`@${R}`);
        }).map((z) => z.id)), await Promise.resolve(window.apya.platform.tasks.task.replyToComment(g, j, F)), await de(), L(""), O(null);
      } catch (F) {
        E(F, "Yanıt gönderilemedi.");
      }
  }, C = !!c.trim() && !K;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-[9px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Açıklama" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Zengin metin · WYSIWYG" })
      ] }),
      /* @__PURE__ */ e.jsx(
        Pa,
        {
          value: a ?? t.description ?? "",
          onChange: (g) => s("description", g),
          readOnly: o
        },
        n
      )
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: ma, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
            b,
            "/",
            d.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(fa, { label: "Kontrol listesi", open: x, onClick: () => u((g) => !g) })
      ] }),
      x && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 mt-3.5", children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
            style: { width: `${f}%` }
          }
        ) }),
        d.map((g) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              disabled: o,
              "aria-label": g.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
              onClick: () => r.toggleItem(g.id).catch((j) => E(j, "Durum güncellenemedi.")),
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
              onClick: () => r.removeItem(g.id).catch((j) => E(j, "Madde silinemedi.")),
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
            onChange: (g) => m(g.target.value),
            onKeyDown: (g) => {
              g.key === "Enter" && N();
            },
            placeholder: "Yeni madde yaz ve Enter'a bas…",
            className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: ma, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Yorumlar & güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: ce.length })
        ] }),
        /* @__PURE__ */ e.jsx(fa, { label: "Yorumlar", open: y, onClick: () => w((g) => !g) })
      ] }),
      y && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(kt, { name: l }),
          /* @__PURE__ */ e.jsxs("div", { className: `flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${D ? "border-focus bg-surface-base shadow-focus" : "border-default bg-surface-raised"}`, children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                rows: 2,
                value: c,
                onChange: (g) => v(g.target.value),
                onFocus: () => $(!0),
                onBlur: () => $(!1),
                onKeyDown: (g) => {
                  g.key === "Enter" && (g.ctrlKey || g.metaKey) && (g.preventDefault(), P());
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
                    onClick: () => Y((g) => !g),
                    className: `flex items-center justify-center h-7 w-7 rounded-[7px] hover:bg-surface-hover hover:text-primary cursor-pointer ${_ ? "text-primary" : "text-text-tertiary"}`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-at text-[12px]" })
                  }
                ),
                /* @__PURE__ */ e.jsxs(
                  "label",
                  {
                    title: "Dosya ekle",
                    onMouseDown: (g) => g.preventDefault(),
                    className: `flex items-center justify-center h-7 w-7 rounded-[7px] hover:bg-surface-hover hover:text-primary cursor-pointer ${se.isUploading ? "text-primary" : "text-text-tertiary"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${se.isUploading ? "fa-circle-notch fa-spin" : "fa-paperclip"} text-[12px]` }),
                      /* @__PURE__ */ e.jsx(
                        "input",
                        {
                          type: "file",
                          "aria-label": "Dosya ekle",
                          className: "sr-only",
                          disabled: se.isUploading || !n,
                          onChange: (g) => {
                            var j;
                            H((j = g.target.files) == null ? void 0 : j[0]), g.target.value = "";
                          }
                        }
                      )
                    ]
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
                    onClick: () => v((j) => j + g.add),
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
                  onClick: P,
                  disabled: !C,
                  className: `flex items-center gap-[7px] h-[30px] px-3.5 rounded-[9px] text-[12px] font-bold shadow-xs ${C ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${K ? "fa-circle-notch fa-spin" : "fa-paper-plane"} text-[10px]` }),
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
                g.currentTarget.contains(g.relatedTarget) || Y(!1);
              },
              className: "absolute left-[43px] top-full z-20 mt-1 w-64 min-w-[200px] max-w-[calc(100%-43px)] rounded-[11px] border border-default bg-surface-base p-1.5 shadow-lg",
              children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: Z,
                    onChange: (g) => J(g.target.value),
                    onKeyDown: (g) => {
                      g.key === "Escape" && (g.preventDefault(), Y(!1)), g.key === "Enter" && ae[0] && (g.preventDefault(), ie(ae[0]));
                    },
                    placeholder: "Kişi ara…",
                    "aria-label": "Kişi ara",
                    className: "mb-1 h-8 w-full rounded-[8px] border border-default bg-surface-raised px-2.5 text-[12px] text-text-primary focus:border-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsxs("ul", { className: "m-0 max-h-56 list-none overflow-y-auto p-0", children: [
                  ae.map((g) => /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => ie(g),
                      className: "w-full rounded-[7px] px-2.5 py-1.5 text-left text-[12.5px] text-text-primary hover:bg-surface-hover cursor-pointer",
                      children: [
                        Oe(g),
                        g.userName && Oe(g) !== g.userName && /* @__PURE__ */ e.jsxs("span", { className: "ml-1 text-[11px] text-text-tertiary", children: [
                          "(",
                          g.userName,
                          ")"
                        ] })
                      ]
                    }
                  ) }, g.id)),
                  !ae.length && /* @__PURE__ */ e.jsx("li", { className: "px-2.5 py-2 text-[12px] text-text-tertiary", children: M ? "Eşleşen kişi yok" : "Yükleniyor…" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1", children: ce.map((g) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start py-3 border-t border-subtle", children: [
          /* @__PURE__ */ e.jsx(kt, { name: g.authorName }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: g.authorName }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: ba(g.creationTime) })
            ] }),
            /* @__PURE__ */ e.jsx(jn, { text: g.text, attachments: se.attachments }),
            /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1.5 mt-[3px]", children: /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  O((j) => j === g.id ? null : g.id), L("");
                },
                className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-full text-text-tertiary text-[11px] font-semibold hover:bg-surface-hover hover:text-primary cursor-pointer",
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                  "Yanıtla"
                ]
              }
            ) }),
            B === g.id && /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 mt-2 animate-fade-in-fast", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: q,
                  onChange: (j) => L(j.target.value),
                  onKeyDown: (j) => {
                    j.key === "Enter" && ee(g.id);
                  },
                  placeholder: `@${g.authorName} kullanıcısına yanıt ver…`,
                  className: "flex-1 h-8 px-3 rounded-[9px] border border-focus bg-surface-base text-text-primary text-[12px] shadow-focus focus:outline-none"
                }
              ),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => ee(g.id),
                  className: "h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover",
                  children: "Yanıtla"
                }
              )
            ] }),
            (g.replies ?? []).map((j) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] mt-2.5 pl-3 border-l-2 border-default", children: [
              /* @__PURE__ */ e.jsx(kt, { name: j.authorName, size: 24 }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: j.authorName }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: ba(j.creationTime) })
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
function wn({
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
  }).format(new Date(t)) : "—", x = a ? "fa-solid fa-circle-notch fa-spin" : r ? "fa-solid fa-check" : "fa-regular fa-floppy-disk", u = a ? "Kaydediliyor…" : r ? "Kaydedildi" : "Kaydet", h = s && !a;
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
            /* @__PURE__ */ e.jsx("i", { className: `${x} text-[11px]` }),
            u
          ]
        }
      )
    ] })
  ] });
}
const kn = Object.fromEntries(tt.map((t) => [t.code, t])), Cn = {
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
}, Dn = /* @__PURE__ */ new Set([
  "risks",
  "dashboard",
  "comments",
  "emails",
  "custom-fields",
  "approvals",
  "ai",
  "automations"
]), Tn = (t) => Dn.has(t);
function Sn(t) {
  const s = kn[t], a = Cn[t];
  return s ? {
    code: t,
    title: s.title,
    icon: s.icon,
    desc: (a == null ? void 0 : a.desc) ?? "",
    bg: (a == null ? void 0 : a.bg) ?? "bg-neutral-subtle",
    fg: (a == null ? void 0 : a.fg) ?? "text-text-secondary"
  } : null;
}
tt.filter((t) => !t.hidden).length;
function ha({ code: t, onRemoveFeature: s, pickerEntries: a = [], onPickFeature: r, canRemove: l = !0, canAdd: o = !0 }) {
  const n = Sn(t) ?? { title: t, desc: "", icon: "fa-cube", bg: "bg-neutral-subtle", fg: "text-text-secondary" };
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
      o && /* @__PURE__ */ e.jsx(qt, { entries: a, onPick: r, children: /* @__PURE__ */ e.jsxs(
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
function Wa({ open: t, onClose: s, label: a, children: r }) {
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
const $n = [
  { key: "subtasks", label: "Alt görevler", countKey: "subtasks", unit: "alt görev" },
  { key: "checklist", label: "Kontrol listesi", countKey: "checklist", unit: "madde" },
  { key: "comments", label: "Yorumlar", countKey: "comments", unit: "yorum" },
  { key: "files", label: "Dosyalar", countKey: "files", unit: "dosya" },
  { key: "keepAssignee", label: "Sorumluyu koru", desc: "Aksi halde atanmamış gelir" },
  { key: "keepLinks", label: "Bağımlılıkları koru", desc: "Öncül / ardıl bağlantılar" },
  { key: "shiftDates", label: "Tarihleri bugüne kaydır", desc: "Başlangıç ve son tarih ötelenir" }
], ya = {
  subtasks: !0,
  checklist: !0,
  comments: !1,
  files: !0,
  keepAssignee: !0,
  keepLinks: !0,
  shiftDates: !1
};
function Pn({ on: t, onClick: s, label: a }) {
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
function En({
  open: t,
  mode: s = "move",
  onClose: a,
  onConfirm: r,
  projectOptions: l = [],
  currentProjectId: o,
  counts: n = {},
  onCreateProject: i
}) {
  const [x, u] = p.useState(s), [h, m] = p.useState([]), [d, b] = p.useState(""), [f, N] = p.useState(""), [y, w] = p.useState(ya), [c, v] = p.useState(!1);
  p.useEffect(() => {
    t && (u(s), m([]), b(""), N(""), w(ya));
  }, [t, s]);
  const D = p.useMemo(
    () => l.filter((S) => S.value && S.value !== o),
    [l, o]
  ), $ = D.filter((S) => !d || S.label.toLowerCase().includes(d.toLowerCase())), K = D.length > 0 && h.length === D.length;
  if (!t) return null;
  const X = (S) => m((M) => M.includes(S) ? M.filter((V) => V !== S) : [...M, S]), B = (S) => {
    var M;
    return ((M = l.find((V) => V.value === S)) == null ? void 0 : M.label) ?? "";
  }, O = async () => {
    const S = f.trim();
    if (!(!S || c)) {
      v(!0);
      try {
        const M = await (i == null ? void 0 : i(S));
        M && m((V) => [...V, M]), N("");
      } catch (M) {
        E(M, "Proje oluşturulamadı.");
      } finally {
        v(!1);
      }
    }
  }, q = async () => {
    if (!(!h.length || c)) {
      v(!0);
      try {
        await (r == null ? void 0 : r({ mode: x, targetProjectIds: h, include: y }));
      } finally {
        v(!1);
      }
    }
  }, L = x === "move", G = h.length, U = L ? G > 1 ? "Taşı ve kopyala" : "Taşı" : G > 1 ? `${G} projeye kopyala` : "Kopyala", _ = Object.values(y).filter(Boolean).length, Y = h.map(B).filter(Boolean), Z = Y.length ? `${Y.length > 2 ? `${Y.slice(0, 2).join(", ")} +${Y.length - 2}` : Y.join(", ")} · ${_} seçenek açık` : `Proje seçilmedi · ${_} seçenek açık`, J = (S) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${S ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return /* @__PURE__ */ e.jsx(Wa, { open: t, onClose: a, label: L ? "Başka projeye taşı" : "Başka projelere kopyala", children: /* @__PURE__ */ e.jsx(
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
          "aria-label": L ? "Başka projeye taşı" : "Başka projelere kopyala",
          onClick: (S) => S.stopPropagation(),
          className: "flex flex-col w-full max-w-[760px] max-h-[88vh] rounded-[20px] border border-default bg-surface-base shadow-xl overflow-hidden animate-dialog-in",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-4 px-[22px] pt-5 pb-4 border-b border-subtle", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-10 w-10 rounded-[13px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-tree text-base" }) }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsx("h3", { className: "m-0 text-base font-extrabold tracking-[-.02em] text-text-primary", children: L ? "Başka projeye taşı" : "Başka projelere kopyala" }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 mb-0 text-[12px] leading-[1.5] text-text-tertiary", children: L ? "Görev ilk seçtiğiniz projeye taşınır; birden fazla seçerseniz kalanlara kopya oluşturulur." : "Görevin kopyası seçtiğiniz her projede oluşturulur; bu görev yerinde kalır." })
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
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => u("move"), className: J(L), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[10px]" }),
                "Taşı"
              ] }),
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => u("copy"), className: J(!L), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clone text-[10px]" }),
                "Kopyala"
              ] })
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 grid grid-cols-2 lt-860:grid-cols-1 gap-5 items-start px-[22px] pt-4 pb-5 overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px] min-w-0", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5", children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.08em] text-text-tertiary", children: [
                    "Hedef projeler · ",
                    G
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => m(K ? [] : D.map((S) => S.value)),
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
                      value: d,
                      onChange: (S) => b(S.target.value),
                      placeholder: "Proje ara…",
                      className: "w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar", children: [
                  $.map((S) => {
                    const M = h.includes(S.value), V = L && h[0] === S.value;
                    return /* @__PURE__ */ e.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => X(S.value),
                        className: `flex items-center gap-[11px] px-3 py-[11px] rounded-[11px] border text-left cursor-pointer hover:border-focus ${M ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                        children: [
                          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] rounded-[5px] border-[1.5px] text-white ${M ? "bg-primary border-primary" : "bg-transparent border-strong"}`, children: M && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" }) }),
                          /* @__PURE__ */ e.jsx("span", { className: "h-2.5 w-2.5 shrink-0 rounded-[3px] bg-primary" }),
                          /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: S.label }),
                          V && /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center h-5 px-2 rounded-md bg-primary text-white text-[10px] font-extrabold", children: "TAŞINACAK" })
                        ]
                      },
                      S.value
                    );
                  }),
                  $.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "py-6 text-center text-[12px] text-text-tertiary", children: "Uygun proje bulunamadı." })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[7px] mt-1", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: f,
                      onChange: (S) => N(S.target.value),
                      onKeyDown: (S) => {
                        S.key === "Enter" && (S.preventDefault(), O());
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
                      onClick: O,
                      disabled: !f.trim() || c,
                      className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-plus text-[12px]" })
                    }
                  )
                ] }),
                L && G > 1 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle", children: [
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
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: $n.map((S) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-px", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary", children: S.label }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: S.countKey ? `${n[S.countKey] ?? 0} ${S.unit}` : S.desc })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    Pn,
                    {
                      on: y[S.key],
                      label: S.label,
                      onClick: () => w((M) => ({ ...M, [S.key]: !M[S.key] }))
                    }
                  )
                ] }, S.key)) })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3.5 px-[22px] py-3.5 border-t border-subtle bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("span", { className: "min-w-0 truncate text-[11.5px] text-text-tertiary", children: Z }),
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
                    disabled: !G || c,
                    className: `flex items-center gap-2 h-9 px-5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${G && !c ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c ? "fa-circle-notch fa-spin" : "fa-arrow-right"} text-[10px]` }),
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
const Bn = [
  { code: "general", title: "Genel", icon: "fa-circle-info" },
  { code: "checklist", title: "Kontrol", icon: "fa-square-check" },
  { code: "comments", title: "Yorumlar", icon: "fa-comments" },
  { code: "files", title: "Dosyalar", icon: "fa-paperclip" }
], Qe = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  img: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
};
function In(t = "") {
  var a;
  const s = (a = t.split(".").pop()) == null ? void 0 : a.toLowerCase();
  return s === "pdf" ? Qe.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(s) ? Qe.img : ["doc", "docx", "odt", "rtf"].includes(s) ? Qe.doc : ["json", "js", "ts", "cs", "xml", "yml", "yaml"].includes(s) ? Qe.code : Qe.other;
}
const Fn = (t) => t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : "—", An = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—", zn = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—";
function Ct({ name: t, size: s = 22 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: s, width: s, background: et(t), fontSize: s * 0.4 },
      children: Xe(t)
    }
  );
}
function lt({ label: t, children: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: t }),
    s
  ] });
}
function Ln({
  subtaskId: t,
  parentCode: s,
  onClose: a,
  onOpenFull: r,
  onDeleted: l,
  currentUserName: o = "Ben"
}) {
  var de, P, ee;
  const n = ne(), { data: i } = Lt(t), x = Rt(t), u = ht(t), [h, m] = p.useState("general"), [d, b] = p.useState(""), [f, N] = p.useState(""), [y, w] = p.useState(""), c = p.useRef(null), v = p.useRef(null);
  i && v.current !== i.id && (v.current = i.id, b(i.description ?? ""));
  const { data: D = [] } = Q({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var C, g, j, F;
      return Promise.resolve((F = (j = (g = (C = window == null ? void 0 : window.apya) == null ? void 0 : C.platform) == null ? void 0 : g.tasks) == null ? void 0 : j.task) == null ? void 0 : F.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4,
    meta: { persist: !1 }
  });
  if (p.useEffect(() => {
    const C = (g) => {
      g.key === "Escape" && (g.stopPropagation(), a == null || a());
    };
    return window.addEventListener("keydown", C), () => window.removeEventListener("keydown", C);
  }, [a]), !i) return null;
  const { canEdit: $, canChangeStatus: K, canDelete: X } = Je(i), B = (ee = (P = (de = window == null ? void 0 : window.apya) == null ? void 0 : de.platform) == null ? void 0 : P.tasks) == null ? void 0 : ee.task, O = he(i.status), q = ft(i.priority), L = x.items ?? [], G = L.filter((C) => C.isDone).length, U = L.length ? Math.round(G / L.length * 100) : 0, _ = u.attachments ?? [], Y = { checklist: L.length, comments: D.length, files: _.length }, Z = async () => {
    await n.invalidateQueries({ queryKey: ["task-detail", t] });
  }, J = async (C) => {
    try {
      await Promise.resolve(C()), await Z();
    } catch (g) {
      E(g, "Alt görev güncellenemedi.");
    }
  }, S = (C) => J(() => B.update(i.id, Bt(i, C))), M = () => J(() => B.updateStatus(i.id, i.status >= 4 ? 1 : i.status + 1)), V = () => J(() => B.setPriority(i.id, i.priority >= 4 ? 1 : i.priority + 1)), ae = () => {
    (i.description ?? "") !== d && S({ description: d || null });
  }, ie = async () => {
    const C = f.trim();
    if (C) {
      N("");
      try {
        await x.addItem(C);
      } catch (g) {
        E(g, "Madde eklenemedi.");
      }
    }
  }, ce = async () => {
    const C = y.trim();
    if (C) {
      w("");
      try {
        await Promise.resolve(B.addComment(i.id, C)), await n.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch (g) {
        E(g, "Yorum gönderilemedi.");
      }
    }
  }, se = async () => {
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(B.delete(i.id)), l == null || l(i.id), a == null || a();
      } catch (C) {
        E(C, "Alt görev silinemedi.");
      }
  }, H = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
  return /* @__PURE__ */ e.jsxs(Wa, { open: !0, onClose: a, label: `${i.code} alt görev detayı`, children: [
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
                    className: `${H} hover:bg-surface-hover hover:text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-up-right-from-square text-[11px]" })
                  }
                ),
                X && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Alt görevi sil",
                    onClick: se,
                    className: `${H} hover:bg-negative-subtle hover:text-negative`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Kapat",
                    onClick: a,
                    className: `${H} hover:bg-surface-hover hover:text-text-primary`,
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
                  onClick: M,
                  title: "Durumu değiştir",
                  disabled: !K,
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold ${K ? "cursor-pointer" : "cursor-default"} ${O.bg} ${O.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${O.icon} text-[10px]` }),
                    O.label
                  ]
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: V,
                  title: "Önceliği değiştir",
                  disabled: !$,
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold ${$ ? "cursor-pointer" : "cursor-default"} ${q.bg} ${q.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${q.icon} text-[10px]` }),
                    q.label
                  ]
                }
              ),
              (i.tags ?? []).map((C) => /* @__PURE__ */ e.jsx("span", { className: "flex items-center h-6 px-[9px] rounded-[7px] border border-default bg-neutral-subtle text-text-secondary text-[11px] font-semibold", children: C.name }, C.id ?? C.name)),
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
              /* @__PURE__ */ e.jsx(lt, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
                /* @__PURE__ */ e.jsx(Ct, { name: i.assigneeName }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", children: i.assigneeName || "Atanmamış" })
              ] }) }),
              /* @__PURE__ */ e.jsx(lt, { label: "Son tarih", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] h-[22px] text-[12.5px] font-semibold text-text-primary", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[11px] text-text-tertiary" }),
                zn(i.dueDate)
              ] }) }),
              /* @__PURE__ */ e.jsx(lt, { label: "Süre", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-[22px] font-mono text-[12.5px] font-bold text-text-primary", children: [
                i.spentHours ?? 0,
                "s",
                /* @__PURE__ */ e.jsxs("span", { className: "font-medium text-text-tertiary", children: [
                  " / ",
                  i.estimatedHours != null ? `${i.estimatedHours}s` : "—"
                ] })
              ] }) }),
              /* @__PURE__ */ e.jsx(lt, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-1.5 pt-[3px]", children: [
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
                  "%",
                  U
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: "block h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("span", { className: "block h-full rounded-full bg-success", style: { width: `${U}%` } }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: Bn.map((C) => {
            const g = h === C.code, j = Y[C.code] ?? 0;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => m(C.code),
                className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${g ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${C.icon} text-[11px] opacity-85` }),
                  /* @__PURE__ */ e.jsx("span", { children: C.title }),
                  j > 0 && /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-neutral-subtle text-text-tertiary text-[10px] font-extrabold", children: j })
                ]
              },
              C.code
            );
          }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar px-5 py-[18px] bg-surface-raised", children: [
            h === "general" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Açıklama" }),
              /* @__PURE__ */ e.jsx(
                "textarea",
                {
                  rows: 7,
                  value: d,
                  onChange: (C) => b(C.target.value),
                  onBlur: $ ? ae : void 0,
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
                  G,
                  "/",
                  L.length
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-success", style: { width: `${U}%` } }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px] mt-1", children: [
                L.map((C) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] border border-subtle bg-surface-base hover:border-default", children: [
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Tamamlandı işaretle",
                      onClick: () => x.toggleItem(C.id),
                      disabled: !$,
                      className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${$ ? "cursor-pointer" : "cursor-default"} ${C.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
                      children: C.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[12.5px] font-semibold ${C.isDone ? "line-through text-text-tertiary" : "text-text-primary"}`, children: C.text }),
                  $ && /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Maddeyi sil",
                      onClick: () => x.removeItem(C.id),
                      className: "flex shrink-0 items-center justify-center h-6 w-6 rounded-md text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[10px]" })
                    }
                  )
                ] }, C.id)),
                $ && /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "text",
                    value: f,
                    onChange: (C) => N(C.target.value),
                    onKeyDown: (C) => {
                      C.key === "Enter" && ie();
                    },
                    placeholder: "Yeni madde yaz ve Enter'a bas…",
                    className: "h-9 mt-1 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                )
              ] })
            ] }),
            h === "comments" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] items-start", children: [
                /* @__PURE__ */ e.jsx(Ct, { name: o, size: 30 }),
                /* @__PURE__ */ e.jsx(
                  "textarea",
                  {
                    rows: 2,
                    value: y,
                    onChange: (C) => w(C.target.value),
                    onKeyDown: (C) => {
                      C.key === "Enter" && !C.shiftKey && (C.preventDefault(), ce());
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
              D.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-[7px] py-7 rounded-xl border border-dashed border-default", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-comments text-xl text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Henüz yorum yok" })
              ] }) : D.map((C) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 items-start p-3 rounded-xl border border-subtle bg-surface-base", children: [
                /* @__PURE__ */ e.jsx(Ct, { name: C.authorName, size: 28 }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: C.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: An(C.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: C.text })
                ] })
              ] }, C.id))
            ] }),
            h === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  ref: c,
                  type: "file",
                  className: "hidden",
                  onChange: (C) => {
                    var j;
                    const g = (j = C.target.files) == null ? void 0 : j[0];
                    C.target.value = "", g && u.upload(g).catch((F) => E(F, "Dosya yüklenemedi."));
                  }
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    var C;
                    return (C = c.current) == null ? void 0 : C.click();
                  },
                  disabled: u.isUploading,
                  className: "flex flex-col items-center justify-center gap-[7px] p-6 rounded-[13px] border-2 border-dashed border-strong bg-surface-base cursor-pointer hover:border-focus hover:bg-primary-subtle disabled:opacity-60",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.isUploading ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-xl text-text-tertiary` }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: u.isUploading ? "Yükleniyor…" : "Dosya ekle" })
                  ]
                }
              ),
              _.map((C) => {
                const g = In(C.fileName);
                return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${g.bg} ${g.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${g.icon} text-[13px]` }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: C.fileName }),
                    /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                      Fn(C.fileSize),
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
                      onClick: () => u.remove(C.id).catch((j) => E(j, "Dosya silinemedi.")),
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
const Ja = "apya.taskDetail.tabOrder", Mn = "taskdetail";
function ga() {
  try {
    const t = localStorage.getItem(Ja);
    if (!t) return [];
    const s = JSON.parse(t);
    return Array.isArray(s) ? s.filter((a) => typeof a == "string") : [];
  } catch {
    return [];
  }
}
function Kn(t) {
  try {
    localStorage.setItem(Ja, JSON.stringify(t));
  } catch {
  }
}
function va() {
  const t = document.querySelector("[data-tab-order]"), s = t == null ? void 0 : t.getAttribute("data-tab-order");
  if (!s) return null;
  try {
    const a = JSON.parse(s);
    return Array.isArray(a) ? a.map((r) => r == null ? void 0 : r.kind).filter((r) => typeof r == "string") : null;
  } catch {
    return null;
  }
}
function ja(t) {
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
        scope: Mn,
        tabs: t.map((a) => ({ kind: a, ref: "", title: "" }))
      })
    }).catch(() => {
    });
  } catch {
  }
}
function Rn(t) {
  const [s, a] = p.useState(() => va() ?? ga()), [r, l] = p.useState(null);
  p.useEffect(() => {
    if (va() === null) {
      const u = ga();
      u.length && ja(u);
    }
  }, []);
  const o = p.useMemo(() => {
    const u = new Map(t.map((m) => [m.code, m])), h = [];
    for (const m of s) {
      const d = u.get(m);
      d && (h.push(d), u.delete(m));
    }
    for (const m of t)
      u.has(m.code) && h.push(m);
    return h;
  }, [t, s]), n = p.useCallback((u) => {
    a((h) => {
      const m = r;
      if (!m || m === u) return h;
      const d = h.length ? h.slice() : o.map((N) => N.code), b = d.indexOf(m), f = d.indexOf(u);
      return b === -1 || f === -1 ? h : (d.splice(b, 1), d.splice(f, 0, m), d);
    });
  }, [r, o]), i = p.useCallback((u) => l(u), []), x = p.useCallback(() => {
    l(null), a((u) => {
      const h = u.length ? u : o.map((m) => m.code);
      return Kn(h), ja(h), h;
    });
  }, [o]);
  return { orderedTabs: o, draggingCode: r, handleDragStart: i, handleDragEnd: x, reorderTo: n };
}
function qn(t) {
  const s = p.useRef(null);
  p.useEffect(() => {
    if (!(!t || typeof document > "u")) {
      if (s.current === null) {
        const a = document.title.lastIndexOf(" | ");
        s.current = a >= 0 ? document.title.slice(a) : "";
      }
      document.title = t + s.current;
    }
  }, [t]);
}
function Gn() {
  const [t, s] = p.useState(0), a = p.useRef(null), r = p.useCallback((l) => {
    var o;
    (o = a.current) == null || o.disconnect(), a.current = null, l && (s(l.getBoundingClientRect().width), !(typeof ResizeObserver > "u") && (a.current = new ResizeObserver((n) => {
      for (const i of n) s(i.contentRect.width);
    }), a.current.observe(l)));
  }, []);
  return p.useEffect(() => () => {
    var l;
    return (l = a.current) == null ? void 0 : l.disconnect();
  }, []), [r, t];
}
const Yn = 780;
function Un(t) {
  return t > 0 && t < Yn;
}
function _n() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Vn() {
  const t = Q({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: _n,
    staleTime: 3e5,
    retry: !1
  }), s = t.data ?? [], a = On(s), r = new Map(s.map((l) => [l.id, l.name]));
  return { options: a, nameById: r, isLoading: t.isLoading };
}
function On(t) {
  const s = /* @__PURE__ */ new Map();
  return t.forEach((a) => s.set(a.name, (s.get(a.name) ?? 0) + 1)), t.map((a) => ({
    value: a.id,
    label: s.get(a.name) > 1 && a.code ? `${a.name} · ${a.code}` : a.name
  }));
}
function Qn(t) {
  var a, r, l;
  const s = (l = (r = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : r.projects) == null ? void 0 : l.boardColumn;
  return s ? Promise.resolve(s.getListByProject(t, { abpHandleError: !1 })) : Promise.resolve([]);
}
function Hn(t) {
  const s = Q({
    queryKey: ["task-detail", "board-columns", t],
    queryFn: () => Qn(t),
    enabled: !!t,
    staleTime: 6e4,
    retry: !1,
    /* Kolonlar panoda her an yeniden adlandırılıp eklenebilir — kalıcı önbellekten
       bayat seçenek gelmesin. */
    meta: { persist: !1 }
  });
  return t ? s.data ?? [] : [];
}
const Na = "apya.taskDetail.fullscreen", pe = {
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
function Wn(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function wa() {
  var a;
  const t = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.currentUser;
  return [t == null ? void 0 : t.name, t == null ? void 0 : t.surName].filter((r) => r && String(r).trim()).join(" ").trim() || (t == null ? void 0 : t.userName) || "Ben";
}
function Za({ taskId: t, presentation: s = "modal", onClose: a, switchToTask: r }) {
  const [l, o] = p.useState(t), { data: n, isPending: i, isError: x, error: u, refetch: h } = Lt(l), m = ne(), d = Sa(), b = La(n), f = Ma(), N = Vn(), y = Hn(
    n != null && n.projectId && b.values.projectId === n.projectId ? n.projectId : null
  ), w = Ka(l), c = Rt(l), [v, D] = p.useState("general"), [$, K] = p.useState(!1), [X, B] = p.useState(!1), [O, q] = p.useState(!1), [L, G] = p.useState(null), [U, _] = p.useState(null), [Y, Z] = p.useState(!1), [J, S] = p.useState(!1), [M, V] = p.useState(() => {
    try {
      return localStorage.getItem(Na) === "true";
    } catch {
      return !1;
    }
  });
  Aa(s === "page" ? null : l), qn(s === "page" ? n == null ? void 0 : n.title : null);
  const [ae, ie] = Gn(), ce = Un(ie), [se, H] = p.useState(null);
  n != null && n.id && n.id !== se && (H(n.id), Z(!!n.isFavorite), S(!!n.isWatched)), p.useEffect(() => {
    b.isDirty ? d.markDirty() : d.markClean();
  }), p.useEffect(() => {
    const k = m.getQueryCache().subscribe((A) => {
      var le;
      A.type === "updated" && ((le = A.action) == null ? void 0 : le.type) === "invalidate" && !Is(A.query.queryKey) && W.markChanged();
    }), T = m.getMutationCache().subscribe((A) => {
      A.type === "added" && W.markChanged();
    });
    return () => {
      k(), T();
    };
  }, [m]);
  const de = p.useCallback(() => {
    Kt(), a == null || a();
  }, [a]), P = p.useCallback(() => {
    $ || (q(!1), d.requestClose(de));
  }, [d, de, $]), ee = (k) => {
    q(!1), d.requestClose(() => (r ?? o)(k));
  }, C = p.useCallback(() => {
    V((k) => {
      const T = !k;
      try {
        localStorage.setItem(Na, String(T));
      } catch {
      }
      return T;
    });
  }, []), g = p.useMemo(
    () => Oa(w.assignedCodes),
    [w.assignedCodes]
  ), j = Rn(g), F = p.useMemo(
    () => Qa(w.assignedCodes),
    [w.assignedCodes]
  ), I = (k, T) => {
    if (T) {
      D(k);
      return;
    }
    xs(k);
  }, z = p.useMemo(() => {
    var k, T, A, le, me;
    return {
      subtasks: ((k = n == null ? void 0 : n.subTasks) == null ? void 0 : k.length) ?? 0,
      files: ((T = n == null ? void 0 : n.attachments) == null ? void 0 : T.length) ?? 0,
      dependencies: ((A = n == null ? void 0 : n.predecessorIds) == null ? void 0 : A.length) ?? 0,
      comments: ((le = n == null ? void 0 : n.comments) == null ? void 0 : le.length) ?? 0,
      checklist: ((me = c.items) == null ? void 0 : me.length) ?? 0
    };
  }, [n, c.items]), R = tt.find((k) => k.code === v), xe = c.items ?? [], qe = xe.filter((k) => k.isDone).length, Ge = xe.length ? Math.round(qe / xe.length * 100) : 0, Gt = p.useRef(null), [Yt, es] = p.useState(0), Ut = () => b.validate() ? !0 : (pe.err(ue("Tasks:Detail:Validation:Summary", "Kaydedilemedi: işaretli alanları düzeltin.")), es((k) => k + 1), !1);
  p.useEffect(() => {
    var T, A;
    if (!Yt) return;
    const k = (T = Gt.current) == null ? void 0 : T.querySelector('[aria-invalid="true"]');
    k == null || k.focus(), (A = k == null ? void 0 : k.scrollIntoView) == null || A.call(k, { block: "nearest" });
  }, [Yt]);
  const at = p.useCallback(async () => {
    if (!Ut()) return !1;
    K(!0);
    try {
      const k = b.values, T = await Promise.resolve(window.apya.platform.tasks.task.update(l, b.toUpdateDto()));
      await m.invalidateQueries({ queryKey: ["task-detail", l] });
      const A = m.getQueryState(["task-detail", l]);
      return b.commitSaved(k, (A == null ? void 0 : A.status) === "success" ? A.data : T), W.emitResult(), B(!0), setTimeout(() => B(!1), 2e3), pe.ok("Görev başarıyla güncellendi."), !0;
    } catch (k) {
      return E(k, "Kaydedilemedi."), !1;
    } finally {
      K(!1);
    }
  }, [l, b, m]), ts = () => {
    q(!1), d.resolvePendingClose("stay");
  }, as = () => {
    q(!1), b.reset(), d.resolvePendingClose("discard");
  }, ss = async () => {
    if (q(!1), !Ut()) {
      d.resolvePendingClose("stay");
      return;
    }
    await at() ? d.resolvePendingClose("saved") : q(!0);
  };
  p.useEffect(() => {
    const k = (T) => {
      if ((T.ctrlKey || T.metaKey) && T.key.toLowerCase() === "s") {
        T.preventDefault(), b.isDirty && !$ && !d.pendingClose && at();
        return;
      }
      T.key === "Escape" && L && (T.stopPropagation(), G(null));
    };
    return window.addEventListener("keydown", k), () => window.removeEventListener("keydown", k);
  }, [at, b.isDirty, $, L, d.pendingClose]);
  const Be = () => {
    var k, T, A;
    return (A = (T = (k = window == null ? void 0 : window.apya) == null ? void 0 : k.platform) == null ? void 0 : T.tasks) == null ? void 0 : A.task;
  }, rs = async () => {
    var T;
    const k = !Y;
    Z(k), W.markChanged();
    try {
      await Promise.resolve((T = Be()) == null ? void 0 : T.toggleFavorite(l));
    } catch (A) {
      Z(!k), E(A, "Favori güncellenemedi.");
    }
  }, ns = () => {
    if (!l) return;
    const k = document.createElement("a");
    k.href = `/Tasks/Detail/${l}?handler=Pdf`, k.rel = "noopener", document.body.appendChild(k), k.click(), k.remove();
  }, is = async () => {
    var T;
    const k = !J;
    S(k), W.markChanged();
    try {
      await Promise.resolve((T = Be()) == null ? void 0 : T.toggleWatch(l)), pe.info(k ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (A) {
      S(!k), E(A, "Takip durumu güncellenemedi.");
    }
  }, ls = async () => {
    var k, T;
    W.markChanged();
    try {
      const A = await Promise.resolve((k = Be()) == null ? void 0 : k.transfer(l, {
        mode: 2,
        // Copy
        targetProjectIds: n != null && n.projectId ? [n.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await m.invalidateQueries({ queryKey: ["task-detail"] }), pe.ok("Görev çoğaltıldı.");
      const le = (T = A == null ? void 0 : A.createdTaskIds) == null ? void 0 : T[0];
      le && ee(le);
    } catch (A) {
      E(A, "Görev çoğaltılamadı.");
    }
  }, os = async (k, T, A, le) => {
    var me, fe;
    W.markChanged();
    try {
      await Promise.resolve(le ? le() : (me = Be()) == null ? void 0 : me.updateStatus(l, k)), await m.invalidateQueries({ queryKey: ["task-detail", l] }), b.setField("status", k), b.setField(
        "boardColumnId",
        ((fe = m.getQueryData(["task-detail", l])) == null ? void 0 : fe.boardColumnId) ?? null
      ), pe.info(T);
    } catch (je) {
      E(je, A);
    }
  }, cs = async () => {
    let k = null;
    if (window.Swal) {
      const T = await window.Swal.fire({
        title: "Görev iptal edilsin mi?",
        input: "text",
        inputLabel: "İptal nedeni (isteğe bağlı)",
        inputAttributes: { maxlength: 256 },
        showCancelButton: !0,
        confirmButtonText: "İptal et",
        cancelButtonText: "Vazgeç"
      });
      if (!T.isConfirmed) return;
      k = (T.value || "").trim() || null;
    }
    await os(
      0,
      "Görev iptal edildi.",
      "Görev iptal edilemedi.",
      () => {
        var T;
        return (T = Be()) == null ? void 0 : T.cancel(l, k);
      }
    );
  }, ds = async () => {
    var k;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?")) {
      W.markChanged();
      try {
        await Promise.resolve((k = Be()) == null ? void 0 : k.delete(l)), pe.info("Görev silindi."), d.markClean(), de();
      } catch (T) {
        E(T, "Görev silinemedi.");
      }
    }
  }, xs = async (k) => {
    try {
      await w.addFeature(k), D(k), pe.ok("Özellik başarıyla eklendi.");
    } catch (T) {
      E(T, "Özellik eklenemedi.");
    }
  }, _t = async (k) => {
    try {
      await w.removeFeature(k), D("general"), pe.info("Özellik görevden kaldırıldı.");
    } catch (T) {
      E(T, "Özellik kaldırılamadı.");
    }
  }, us = async (k) => {
    var le, me, fe, je, Ie, st, Ue;
    const T = ((je = (fe = (me = (le = window == null ? void 0 : window.apya) == null ? void 0 : le.platform) == null ? void 0 : me.application) == null ? void 0 : fe.projects) == null ? void 0 : je.project) ?? ((Ue = (st = (Ie = window == null ? void 0 : window.apya) == null ? void 0 : Ie.platform) == null ? void 0 : st.projects) == null ? void 0 : Ue.project);
    if (!(T != null && T.create)) throw new Error("Proje servisi yüklenmedi.");
    const A = await Promise.resolve(T.create({
      name: k,
      code: Wn(k),
      currency: "TRY"
    }));
    return await m.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), pe.ok(`“${k}” projesi oluşturuldu.`), (A == null ? void 0 : A.id) ?? A;
  }, ps = async ({ mode: k, targetProjectIds: T, include: A }) => {
    var le, me;
    W.markChanged();
    try {
      const fe = await Promise.resolve((le = Be()) == null ? void 0 : le.transfer(l, {
        mode: k === "move" ? 1 : 2,
        targetProjectIds: T,
        include: A
      }));
      await m.invalidateQueries({ queryKey: ["task-detail", l] }), k === "move" && b.setField("projectId", T[0]);
      const je = T.map((st) => {
        var Ue;
        return (Ue = N.options.find((hs) => hs.value === st)) == null ? void 0 : Ue.label;
      }).filter(Boolean), Ie = ((me = fe == null ? void 0 : fe.createdTaskIds) == null ? void 0 : me.length) ?? 0;
      pe.ok(k === "move" ? Ie ? `“${je[0]}” projesine taşındı, ${Ie} projeye kopyalandı.` : `Görev “${je[0]}” projesine taşındı.` : Ie > 1 ? `${Ie} projeye kopyalandı.` : `Kopya “${je[0]}” projesinde oluşturuldu.`), G(null);
    } catch (fe) {
      E(fe, "Transfer tamamlanamadı.");
    }
  }, { canEdit: be, canChangeStatus: ms, canDelete: fs } = Je(n), bs = v === "general" ? /* @__PURE__ */ e.jsxs(
    "div",
    {
      ref: ae,
      className: `grid gap-5 items-start ${ce ? "grid-cols-[minmax(0,1fr)]" : "grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)]"}`,
      children: [
        /* @__PURE__ */ e.jsx(
          Nn,
          {
            task: n,
            onFieldChange: b.setField,
            descriptionValue: b.values.description,
            checklist: c,
            readOnly: !be,
            currentUserName: wa()
          }
        ),
        /* @__PURE__ */ e.jsx(
          "div",
          {
            className: ce ? "w-full grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3.5" : "w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5",
            children: /* @__PURE__ */ e.jsx(vn, { task: n, nameById: f.nameById })
          }
        )
      ]
    }
  ) : Tn(v) ? /* @__PURE__ */ e.jsx(
    ha,
    {
      code: v,
      onRemoveFeature: _t,
      pickerEntries: F,
      onPickFeature: I,
      canRemove: be && !(R != null && R.isCore),
      canAdd: be
    }
  ) : /* @__PURE__ */ e.jsx(p.Suspense, { fallback: /* @__PURE__ */ e.jsx(Ce, { className: "h-48 w-full" }), children: R != null && R.component ? /* @__PURE__ */ e.jsx(
    R.component,
    {
      taskId: l,
      task: n,
      form: b,
      nameById: f.nameById,
      onOpenSubtask: _,
      readOnly: !be
    }
  ) : /* @__PURE__ */ e.jsx(
    ha,
    {
      code: v,
      onRemoveFeature: _t,
      pickerEntries: F,
      onPickFeature: I,
      canRemove: be && !(R != null && R.isCore),
      canAdd: be
    }
  ) }), Ye = x && ((u == null ? void 0 : u.status) === 404 || (u == null ? void 0 : u.status) === 403) ? u.status : null, Vt = i ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(Ce, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(Ce, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(Ce, { className: "h-64 w-full" })
  ] }) : Ye ? /* @__PURE__ */ e.jsx(
    ys,
    {
      variant: Ye === 404 ? "error" : "locked",
      icon: Ye === 404 ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-magnifying-glass" }) : void 0,
      title: Ye === 404 ? ue("Tasks:Detail:NotFound:Title", "Bu görev bulunamadı") : ue("Tasks:Detail:Forbidden:Title", "Bu görevi görüntüleyemezsiniz"),
      description: Ye === 404 ? ue("Tasks:Detail:NotFound:Body", "Görev silinmiş ya da bağlantı eskimiş olabilir.") : gs(u),
      action: s === "page" ? /* @__PURE__ */ e.jsx(re, { asChild: !0, size: "sm", children: /* @__PURE__ */ e.jsxs("a", { href: "/Tasks", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-left", "aria-hidden": "true" }),
        ue("Tasks:Detail:BackToList", "Görevlere dön")
      ] }) }) : /* @__PURE__ */ e.jsx(re, { variant: "secondary", size: "sm", onClick: P, children: ue("Common:Close", "Kapat") })
    }
  ) : x && !n ? (
    /* Yalnız İLK yükleme hatası. Görev ekrandayken düşen tazeleme (odak dönüşü, kayıt sonrası
       yeniden çekme; oturum düşünce 401) formu sökmez: yazılanlar görünür kalır, sonraki
       başarılı tazeleme forma işlenir (useTaskForm rebase). */
    /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
      /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
      /* @__PURE__ */ e.jsx(vs, { onRetry: h })
    ] })
  ) : /* @__PURE__ */ e.jsxs("div", { ref: Gt, className: "flex flex-col flex-1 min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      fn,
      {
        task: n,
        presentation: s,
        onClose: P,
        isFullscreen: M,
        onToggleFullscreen: C,
        onFieldChange: b.setField,
        statusValue: b.values.status,
        boardColumns: y,
        boardColumnValue: b.values.boardColumnId,
        titleValue: n == null ? void 0 : n.title,
        titleError: b.errors.title,
        isPrivateValue: b.values.isPrivate,
        isFavorite: Y,
        onToggleFavorite: rs,
        isWatched: J,
        onToggleWatch: is,
        onDuplicate: ls,
        onCancelTask: cs,
        onDelete: ds,
        onOpenTransfer: (k) => G({ mode: k }),
        onExportPdf: ns,
        canEdit: be,
        canChangeStatus: ms,
        canDelete: fs
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        bn,
        {
          task: n,
          assigneeOptions: oe("Platform.Tasks.Assign") ? f.options : f.options.filter((k) => {
            var T, A;
            return k.value === ((A = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.currentUser) == null ? void 0 : A.id) || k.value === (n == null ? void 0 : n.assigneeId);
          }),
          projectOptions: N.options,
          onFieldChange: b.setField,
          statusValue: b.values.status,
          boardColumns: y,
          boardColumnValue: b.values.boardColumnId,
          priorityValue: b.values.priority,
          assigneeValue: b.values.assigneeId,
          projectValue: b.values.projectId,
          dueDateValue: b.values.dueDate,
          startDateValue: b.values.startDate,
          startDateError: b.errors.startDate,
          dueDateError: b.errors.dueDate,
          tagsValue: b.values.tagNames,
          progressPercent: Ge,
          progressNote: `${qe}/${xe.length} madde`,
          onOpenTransfer: (k) => G({ mode: k }),
          readOnly: !be
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        s === "page" && /* @__PURE__ */ e.jsx(
          gn,
          {
            activeTab: v,
            onTabChange: D,
            orderedTabs: j.orderedTabs,
            draggingCode: j.draggingCode,
            onDragStart: j.handleDragStart,
            onDragEnd: j.handleDragEnd,
            onReorderTo: j.reorderTo,
            onReorderDrop: () => pe.info("Sekme sırası güncellendi."),
            pickerEntries: F,
            onPickFeature: I,
            counts: z,
            canAdd: be
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: s === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            yn,
            {
              activeTab: v,
              onTabChange: D,
              orderedTabs: j.orderedTabs,
              draggingCode: j.draggingCode,
              onDragStart: j.handleDragStart,
              onDragEnd: j.handleDragEnd,
              onReorderTo: j.reorderTo,
              onReorderDrop: () => pe.info("Sekme sırası güncellendi."),
              pickerEntries: F,
              onPickFeature: I,
              counts: z,
              isDirty: b.isDirty,
              canAdd: be
            }
          ) }),
          /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised", children: bs })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(
      wn,
      {
        lastSavedAt: n == null ? void 0 : n.lastModificationTime,
        isDirty: b.isDirty,
        isSaving: $,
        justSaved: X,
        onCancel: P,
        onSave: at,
        sticky: s === "page"
      }
    )
  ] }), Ot = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      En,
      {
        open: !!L,
        mode: (L == null ? void 0 : L.mode) ?? "move",
        onClose: () => G(null),
        onConfirm: ps,
        projectOptions: N.options,
        currentProjectId: b.values.projectId,
        counts: z,
        onCreateProject: us
      }
    ),
    U && /* @__PURE__ */ e.jsx(
      Ln,
      {
        subtaskId: U,
        parentCode: n == null ? void 0 : n.code,
        onClose: () => _(null),
        onOpenFull: (k) => {
          _(null), ee(k);
        },
        onDeleted: () => m.invalidateQueries({ queryKey: ["task-detail", l] }),
        currentUserName: wa()
      }
    ),
    /* @__PURE__ */ e.jsx(
      At,
      {
        open: d.pendingClose,
        isSaving: $,
        errorText: O ? ue("Common:Unsaved:SaveFailed", "Kaydedilemedi. Düzenlemeye dönebilir ya da değişiklikleri atabilirsiniz.") : void 0,
        onStay: ts,
        onDiscard: as,
        onSave: ss
      }
    )
  ] });
  return s === "page" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col w-full min-h-[calc(100vh-54px)] border-y border-subtle bg-surface-base", children: Vt }),
    Ot
  ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(It, { open: !0, onOpenChange: (k) => {
      k || P();
    }, children: /* @__PURE__ */ e.jsx(
      Ft,
      {
        title: n != null && n.title ? `Görev Detayı: ${n.title}` : "Görev Detayı",
        fullscreen: M,
        className: M ? "p-0 rounded-xl border border-default shadow-xl short:h-[100svh]" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl short:h-[100svh]",
        onInteractOutside: (k) => {
          var T, A;
          k.preventDefault(), !(L || U || d.pendingClose) && ((A = (T = k.target) == null ? void 0 : T.closest) != null && A.call(T, "[data-apya-overlay]") || P());
        },
        onEscapeKeyDown: (k) => {
          if (L || U) {
            k.preventDefault();
            return;
          }
          if (document.querySelector(".modal.show")) {
            k.preventDefault();
            return;
          }
          k.preventDefault(), P();
        },
        children: Vt
      }
    ) }),
    Ot
  ] });
}
function Jn(t) {
  window.location.assign("/Tasks/Detail/" + encodeURIComponent(t));
}
function Zn() {
  const t = p.useSyncExternalStore(
    W.subscribe,
    W.getSnapshot,
    () => null
  );
  return t ? /* @__PURE__ */ e.jsx(js, { name: "task-detail", fallback: (s) => /* @__PURE__ */ e.jsx(Xn, { ...s }), children: /* @__PURE__ */ e.jsx(ei, { taskId: t }) }) : null;
}
function Xn(t) {
  const s = () => {
    var a;
    Kt(), W.close(), (a = window.apya) != null && a.taskDetailV3Enabled ? W.emitResultIfChanged() : W.emitResult();
  };
  return /* @__PURE__ */ e.jsx(It, { open: !0, onOpenChange: (a) => {
    a || s();
  }, children: /* @__PURE__ */ e.jsx(
    Ft,
    {
      title: ue("Common:SectionError:Title", "Bu bölüm gösterilemedi"),
      className: "w-full max-w-[480px] h-auto tablet:min-h-0 justify-center p-6",
      children: /* @__PURE__ */ e.jsx(Ns, { ...t, onClose: s })
    }
  ) });
}
function ei({ taskId: t }) {
  var s;
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(dt, { children: /* @__PURE__ */ e.jsx(
    Za,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        W.close(), W.emitResultIfChanged();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(dt, { children: /* @__PURE__ */ e.jsx(
    Ha,
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
function Xa() {
  var a;
  try {
    const r = new URLSearchParams(window.location.search).get("taskui");
    if (r === "v1" || r === "v2" || r === "v3") return r;
  } catch {
  }
  const t = document.getElementById("task-detail-island"), s = (a = t == null ? void 0 : t.dataset) == null ? void 0 : a.taskui;
  return s === "v1" || s === "v2" ? s : "v3";
}
function ti() {
  return Xa() === "v2";
}
function ai() {
  return Xa() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = ai();
window.apya.taskDetailV2Enabled = ti() && !window.apya.taskDetailV3Enabled;
const ka = {
  open: (t) => {
    W.open(t);
  },
  close: () => W.close(),
  onResult: (t) => W.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(ka) : window.apya.taskDetail = ka;
function Ca() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = Da(t, "task-detail", /* @__PURE__ */ e.jsx(Zn, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const s = Fa();
    s && W.open(s);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Ca) : Ca();
function si({ taskId: t }) {
  var a;
  const s = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(dt, { children: /* @__PURE__ */ e.jsx(
    Za,
    {
      taskId: t,
      presentation: "page",
      onClose: s,
      switchToTask: Jn
    }
  ) }) : /* @__PURE__ */ e.jsx(dt, { children: /* @__PURE__ */ e.jsx(
    Ha,
    {
      taskId: t,
      presentation: "page",
      onClose: s
    }
  ) });
}
const Dt = document.getElementById("task-detail-page-island");
if (Dt) {
  const t = Dt.getAttribute("data-task-id");
  t && Da(Dt, "task-detail-page", /* @__PURE__ */ e.jsx(si, { taskId: t }));
}
