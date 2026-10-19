import { j as e, r as f, b as Le } from "./react-vendor-D7YDiBbi.js";
import { t as ue, n as E, E as ys, e as gs, R as vs, m as Da, I as js, a as Ns } from "./index-DgpuJ91w.js";
import { D as It, g as Ft, d as Tt, B as re, I as Qe, M as ws } from "./Dialog-D3HpJNIB.js";
import { a as dt } from "./QueryProvider-D2Hvqdr9.js";
import { u as J, a as ne, b as te } from "./query-vendor-Db2mwxYI.js";
import { C as Ta } from "./Combobox-CHhgTuMW.js";
import { U as At, u as Sa } from "./useDirtyGuard-D_9NgM7w.js";
import { i as Ze, a as Xe, s as be, p as ft, d as $a, b as Qt, R as Pa, c as Fe, e as Ea, f as Ba, g as ks, P as Cs } from "./RichTextEditorV3-CsU1qQrh.js";
import { r as Ds } from "./httpClient-BNoyY5yK.js";
import { S as ke } from "./Skeleton-C92LWNeC.js";
import { R as Ce, T as De, P as Te, C as Se, A as Ts, a as zt, D as Ss, b as $s, c as Ps, d as Es, e as Bs } from "./ui-vendor-UYevF8mE.js";
import { d as Ia } from "./draggableActivation-Ybw9Upbh.js";
import { i as Is } from "./dataChanged-CDwwWMH8.js";
function Fs({
  open: t,
  onRequestClose: s,
  fullscreen: a,
  title: r,
  header: i,
  footer: o,
  children: n
}) {
  return /* @__PURE__ */ e.jsx(
    It,
    {
      open: t,
      onOpenChange: (l) => {
        l || s();
      },
      children: /* @__PURE__ */ e.jsx(
        Ft,
        {
          title: r,
          fullscreen: a,
          onInteractOutside: (l) => {
            l.preventDefault(), s();
          },
          onEscapeKeyDown: (l) => {
            l.preventDefault(), s();
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
  onToggleFullscreen: i,
  fullscreen: o = !1
}) {
  const [n, l] = f.useState(!1), x = f.useRef(null);
  f.useEffect(() => {
    if (!n) return;
    const c = (N) => {
      x.current && !x.current.contains(N.target) && l(!1);
    }, d = (N) => {
      N.key === "Escape" && l(!1);
    };
    return document.addEventListener("mousedown", c), document.addEventListener("keydown", d), () => {
      document.removeEventListener("mousedown", c), document.removeEventListener("keydown", d);
    };
  }, [n]);
  const m = St[t == null ? void 0 : t.status] ?? St[1], h = $t[t == null ? void 0 : t.priority] ?? $t[2], p = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), l(!1);
  }, u = () => {
    var d, N, y, b;
    const c = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (d = navigator.clipboard) == null || d.writeText(c), (b = (y = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : y.info) == null || b.call(y, "Bağlantı kopyalandı."), l(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(Tt, { variant: m.variant, children: m.text }),
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
          onClick: i,
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
            onClick: () => l((c) => !c),
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
                  onClick: u,
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
          onClick: a,
          className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] })
  ] }) });
}
const Ms = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function Ks({ lastSavedAt: t, isDirty: s, isSaving: a, onCancel: r, onSave: i }) {
  const o = Ms(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: o ? `Son kayıt: ${o}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(re, { variant: "secondary", onClick: r, disabled: a, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        re,
        {
          variant: "primary",
          onClick: () => i == null ? void 0 : i(),
          disabled: !s || !i,
          isLoading: a,
          loadingText: "Kaydediliyor…",
          children: "Kaydet"
        }
      )
    ] })
  ] }) });
}
const Ht = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Rs = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function je({ label: t, htmlFor: s, error: a, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: s, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    a && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: a })
  ] });
}
function qs({ value: t, onChange: s }) {
  const [a, r] = f.useState(""), i = () => {
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
      Qe,
      {
        value: a,
        onChange: (o) => r(o.target.value),
        onKeyDown: (o) => {
          o.key === "Enter" || o.key === "," ? (o.preventDefault(), i()) : o.key === "Backspace" && !a && t.length && s(t.slice(0, -1));
        },
        onBlur: i,
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
  isLoadingAssignees: i = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(je, { label: "Başlık", htmlFor: "task-title", error: s.title, children: /* @__PURE__ */ e.jsx(
      Qe,
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
          className: Ht,
          children: Object.entries(St).map(([o, n]) => /* @__PURE__ */ e.jsx("option", { value: o, children: n.text }, o))
        }
      ) }),
      /* @__PURE__ */ e.jsx(je, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
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
    /* @__PURE__ */ e.jsx(je, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      Ta,
      {
        id: "task-assignee",
        options: r,
        value: t.assigneeId,
        onChange: (o) => a("assigneeId", o),
        placeholder: i ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: i
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(je, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: s.startDate, children: /* @__PURE__ */ e.jsx(
        Qe,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (o) => a("startDate", o.target.value),
          invalid: !!s.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(je, { label: "Son Tarih", htmlFor: "task-due", error: s.dueDate, children: /* @__PURE__ */ e.jsx(
        Qe,
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
const _s = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", Us = "border-brand-500 text-text-primary";
function Vs({ tabs: t, activeCode: s, onSelect: a, onOpenPicker: r, pickerOpen: i }) {
  const o = f.useRef(/* @__PURE__ */ new Map()), n = (x) => {
    var m;
    a(x.code), (m = o.current.get(x.code)) == null || m.focus();
  }, l = (x, m) => {
    x.key === "ArrowRight" ? (x.preventDefault(), n(t[(m + 1) % t.length])) : x.key === "ArrowLeft" ? (x.preventDefault(), n(t[(m - 1 + t.length) % t.length])) : x.key === "Home" ? (x.preventDefault(), n(t[0])) : x.key === "End" && (x.preventDefault(), n(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((x, m) => {
      const h = x.code === s;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (p) => {
            p ? o.current.set(x.code, p) : o.current.delete(x.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${x.code}`,
          "aria-selected": h,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: h ? 0 : -1,
          onClick: () => a(x.code),
          onKeyDown: (p) => l(p, m),
          className: `${_s} ${h ? Us : ""}`,
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
        "aria-expanded": i,
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
  const [i, o] = f.useState(""), n = f.useMemo(() => {
    const l = i.trim().toLocaleLowerCase("tr-TR"), x = l ? t.filter((h) => h.title.toLocaleLowerCase("tr-TR").includes(l)) : t, m = /* @__PURE__ */ new Map();
    return x.forEach((h) => {
      const p = m.get(h.category) ?? [];
      p.push(h), m.set(h.category, p);
    }), m;
  }, [t, i]);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Özellik ekle",
      className: "absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl",
      children: [
        /* @__PURE__ */ e.jsx(
          Qe,
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
          [...n.entries()].map(([l, x]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: Os[l] ?? l }),
            x.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
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
          ] }, l))
        ] })
      ]
    }
  );
}
function Hs({ trail: t = [], current: s, onNavigate: a }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((r) => /* @__PURE__ */ e.jsxs(Le.Fragment, { children: [
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
  var r, i, o;
  const s = (o = (i = (r = window == null ? void 0 : window.apya) == null ? void 0 : r.platform) == null ? void 0 : i.tasks) == null ? void 0 : o.task;
  if (!s) return Promise.reject(new Error("ABP görev servisi yüklenmedi."));
  const a = s.get(t);
  return Promise.resolve(a).catch((n) => {
    var x;
    const l = (x = a == null ? void 0 : a.jqXHR) == null ? void 0 : x.status;
    throw n && typeof n == "object" && n.status == null && l && (n.status = l), n;
  });
}
function Lt(t) {
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
  const a = f.useRef(s);
  a.current = s, f.useEffect(() => {
    if (!t || Fa() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(Mt, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), f.useEffect(() => {
    const r = () => {
      var i;
      (i = a.current) == null || i.call(a);
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
  for (const i of Object.keys(a)) r[i] = za(t[i], s[i]) ? a[i] : t[i];
  return r;
}
function La(t) {
  const [s, a] = f.useState(t == null ? void 0 : t.id), r = f.useMemo(() => Jt(t), [t]), [i, o] = f.useState(r), [n, l] = f.useState(r), [x, m] = f.useState({});
  if ((t == null ? void 0 : t.id) !== s || r !== i && !za(r, i)) {
    const y = (t == null ? void 0 : t.id) !== void 0 && t.id === s;
    a(t == null ? void 0 : t.id), o(r), l(y ? Zt(n, i, r) : r), y || m({});
  }
  const h = f.useCallback((y, b) => {
    l((j) => ({ ...j, [y]: b })), m((j) => {
      if (!j[y] && !(y === "startDate" && j.dueDate)) return j;
      const w = { ...j };
      return delete w[y], y === "startDate" && delete w.dueDate, w;
    });
  }, []), p = f.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(r),
    [n, r]
  ), u = f.useCallback(() => {
    const y = {};
    return n.title.trim() || (y.title = ue("Tasks:Detail:Validation:TitleRequired", "Başlık zorunlu.")), n.startDate || (y.startDate = ue("Tasks:Detail:Validation:StartDateRequired", "Başlangıç tarihi zorunlu.")), n.dueDate && n.startDate && n.dueDate < n.startDate && (y.dueDate = ue("Tasks:Detail:Validation:DueBeforeStart", "Son tarih başlangıç tarihinden önce olamaz.")), m(y), Object.keys(y).length === 0;
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
    l(r), m({});
  }, [r]), N = f.useCallback((y, b) => {
    if (!b) return;
    const j = Jt(b);
    l((w) => Zt(w, y, j));
  }, []);
  return { values: n, setField: h, isDirty: p, errors: x, validate: u, toUpdateDto: c, reset: d, commitSaved: N };
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
  var i;
  const t = J({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Xs,
    staleTime: 3e5,
    retry: !1
  }), s = ((i = t.data) == null ? void 0 : i.items) ?? [], a = s.map((o) => ({ value: o.id, label: Xt(o) })), r = new Map(s.map((o) => [o.id, Xt(o)]));
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
  const s = ne(), a = ["task-features", t], r = J({
    queryKey: a,
    queryFn: () => er(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), i = () => s.invalidateQueries({ queryKey: a }), o = te({
    mutationFn: (l) => Promise.resolve(Pt().addFeature(t, l)),
    onSuccess: i
  }), n = te({
    mutationFn: (l) => Promise.resolve(Pt().removeFeature(t, l)),
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
function We(t) {
  var r, i;
  const s = (i = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.currentUser) == null ? void 0 : i.id, a = !!(s && ((t == null ? void 0 : t.creatorId) === s || (t == null ? void 0 : t.assigneeId) === s)) || de("Platform.Projects.ManageTeam");
  return {
    canManage: a,
    canEdit: a && de("Platform.Tasks.Edit"),
    canChangeStatus: a && de("Platform.Tasks.ChangeStatus"),
    canDelete: a && de("Platform.Tasks.Delete")
  };
}
const Ra = "rounded-2xl border border-subtle bg-surface-base shadow-xs", $e = `${Ra} overflow-hidden`;
function Je({ title: t, badge: s, action: a }) {
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
function bt({ name: t, size: s = 24 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: s, width: s, background: Xe(t), fontSize: s * 0.4 },
      title: t || void 0,
      children: Ze(t)
    }
  );
}
const Ke = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—", xt = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
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
const we = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  image: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  sheet: { icon: "fa-file-excel", bg: "bg-success-subtle", fg: "text-success" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  zip: { icon: "fa-file-zipper", bg: "bg-warning-subtle", fg: "text-warning" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
}, ea = (t = "") => Ya(t) === we.image;
function Ya(t = "") {
  var a;
  const s = ((a = t.split(".").pop()) == null ? void 0 : a.toLowerCase()) ?? "";
  return s === "pdf" ? we.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(s) ? we.image : ["doc", "docx", "odt", "rtf", "txt"].includes(s) ? we.doc : ["xls", "xlsx", "csv", "ods"].includes(s) ? we.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(s) ? we.code : ["zip", "rar", "7z", "tar", "gz"].includes(s) ? we.zip : we.other;
}
function ar({ taskId: t, task: s, onOpenSubtask: a }) {
  const [r, i] = f.useState(""), [o, n] = f.useState(!1), l = ne(), x = (s == null ? void 0 : s.subTasks) ?? [], m = x.filter((c) => c.status === 4).length, h = () => l.invalidateQueries({ queryKey: ["task-detail", t] }), p = async () => {
    const c = r.trim();
    if (c) {
      n(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: c,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: s == null ? void 0 : s.projectId
        })), i(""), await h();
      } catch (d) {
        E(d, "Alt görev eklenemedi.");
      } finally {
        n(!1);
      }
    }
  }, u = async (c, d) => {
    c.stopPropagation();
    try {
      await Promise.resolve(window.apya.platform.tasks.task.updateStatus(d.id, d.status === 4 ? 1 : 4)), await h();
    } catch (N) {
      E(N, "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        x.length > 0 && /* @__PURE__ */ e.jsxs(qa, { children: [
          m,
          "/",
          x.length
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
      x.map((c) => {
        const d = be(c.status), N = c.status === 4, y = We(c).canChangeStatus;
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
                  onClick: (b) => u(b, c),
                  disabled: !y,
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white ${y ? "cursor-pointer" : "cursor-default"} ${N ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: N && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: c.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${N ? "line-through text-text-tertiary" : "text-text-primary"}`, children: c.title }),
              /* @__PURE__ */ e.jsx(Pe, { bg: d.bg, fg: d.fg, children: d.label }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: Ke(c.dueDate) }),
              /* @__PURE__ */ e.jsx(bt, { name: c.assigneeName }),
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
          onChange: (c) => i(c.target.value),
          onKeyDown: (c) => {
            c.key === "Enter" && p();
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
function _a() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function sr(t) {
  const s = _a();
  return s ? Promise.resolve(s.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function rr(t, s) {
  const a = new FormData();
  a.append("file", s);
  const r = {}, i = Ds();
  i && (r.RequestVerificationToken = i);
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
  const a = ne(), r = ["task-attachments", t], i = J({
    queryKey: r,
    queryFn: () => sr(t),
    enabled: !!t && s,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: r }), n = te({
    mutationFn: (x) => rr(t, x),
    onSuccess: o
  }), l = te({
    mutationFn: (x) => Promise.resolve(_a().deleteAttachment(x)),
    onSuccess: o
  });
  return {
    attachments: i.data ?? [],
    isLoading: i.isLoading,
    upload: n.mutateAsync,
    remove: l.mutateAsync,
    isUploading: n.isPending
  };
}
function nr({ taskId: t }) {
  const { attachments: s, upload: a, remove: r, isUploading: i } = ht(t), o = ne(), n = f.useRef(null), [l, x] = f.useState(!1), m = de("Platform.Tasks.ShareExternally"), h = async (c, d) => {
    try {
      await window.apya.platform.tasks.taskShare.setAttachmentGuestVisibility(c, d), o.invalidateQueries({ queryKey: ["task-attachments", t] });
    } catch (N) {
      E(N, "Görünürlük değiştirilemedi.");
    }
  }, p = async (c) => {
    var d, N, y;
    if (c)
      try {
        await a(c), (y = (N = (d = window == null ? void 0 : window.abp) == null ? void 0 : d.notify) == null ? void 0 : N.success) == null || y.call(N, "Dosya yüklendi.");
      } catch (b) {
        E(b, "Dosya yüklenemedi.");
      } finally {
        n.current && (n.current.value = "");
      }
  }, u = async (c, d) => {
    try {
      await r(c);
    } catch (N) {
      E(N, `${d} silinemedi.`);
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
        disabled: i
      }
    ),
    s.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3", children: s.map((c) => {
      const d = Ya(c.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${d.bg} ${d.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: c.fileName, children: c.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: Ga(c.fileSize) })
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
                    onClick: () => u(c.id, c.fileName),
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
          c.preventDefault(), l || x(!0);
        },
        onDragLeave: () => x(!1),
        onDrop: (c) => {
          var d, N;
          c.preventDefault(), x(!1), p((N = (d = c.dataTransfer) == null ? void 0 : d.files) == null ? void 0 : N[0]);
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
  const s = ne(), a = ["task-checklist", t], r = J({
    queryKey: a,
    queryFn: () => ir(t),
    enabled: !!t,
    staleTime: 3e4,
    /* toggleChecklistItem ters çevirir; bayat gösterim yanlış yöne yazar (proje
       konsolu paneli aynı maddeyi React Query dışından değiştiriyor). */
    meta: { persist: !1 },
    retry: !1
  }), i = () => s.invalidateQueries({ queryKey: a }), o = te({
    mutationFn: (x) => Promise.resolve(ot().addChecklistItem(t, x)),
    onSuccess: i
  }), n = te({
    mutationFn: (x) => Promise.resolve(ot().toggleChecklistItem(x)),
    onSuccess: i
  }), l = te({
    mutationFn: (x) => Promise.resolve(ot().deleteChecklistItem(x)),
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
function lr({ taskId: t, readOnly: s = !1 }) {
  const { items: a, isLoading: r, addItem: i, toggleItem: o, removeItem: n } = Rt(t), [l, x] = f.useState(""), m = a.filter((u) => u.isDone).length, h = a.length ? Math.round(m / a.length * 100) : 0, p = async () => {
    const u = l.trim();
    if (!(!u || !t)) {
      x("");
      try {
        await i(u);
      } catch (c) {
        x(u), E(c, "Madde eklenemedi.");
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
      a.map((u) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            disabled: s,
            "aria-label": u.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
            onClick: () => o(u.id).catch((c) => E(c, "Durum güncellenemedi.")),
            className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${s ? "cursor-default" : "cursor-pointer"} transition-colors duration-fast ${u.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
            children: u.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${u.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: u.text }),
        !s && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            title: "Sil",
            "aria-label": `${u.text} maddesini sil`,
            onClick: () => n(u.id).catch((c) => E(c, "Madde silinemedi.")),
            className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
          }
        )
      ] }, u.id)),
      !s && /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: l,
          onChange: (u) => x(u.target.value),
          onKeyDown: (u) => {
            u.key === "Enter" && p();
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
  const [a, r] = f.useState(""), [i, o] = f.useState(null), [n, l] = f.useState(""), [x, m] = f.useState(!1), h = ne(), p = (s == null ? void 0 : s.comments) ?? [], u = async (d) => {
    var N, y, b;
    if (d == null || d.preventDefault(), !(!a.trim() || x)) {
      m(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, a.trim())
        ), r(""), h.invalidateQueries({ queryKey: ["task-detail", t] }), (b = (y = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : y.success) == null || b.call(y, "Yorum eklendi.");
      } catch (j) {
        E(j, "Yorum eklenemedi.");
      } finally {
        m(!1);
      }
    }
  }, c = async (d) => {
    var N, y, b;
    if (!(!n.trim() || x)) {
      m(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(d, n.trim())
        ), l(""), o(null), h.invalidateQueries({ queryKey: ["task-detail", t] }), (b = (y = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : y.success) == null || b.call(y, "Yanıt eklendi.");
      } catch (j) {
        E(j, "Yanıt eklenemedi.");
      } finally {
        m(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("form", { onSubmit: u, className: "rounded-lg border border-default p-3 bg-surface-base", children: [
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
          onClick: () => o(i === d.id ? null : d.id),
          children: "Yanıtla"
        }
      ) }),
      i === d.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: n,
            onChange: (N) => l(N.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(re, { variant: "ghost", size: "sm", onClick: () => o(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(re, { variant: "primary", size: "sm", disabled: !n.trim() || x, onClick: () => c(d.id), children: "Gönder" })
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
function gt() {
  var t, s, a;
  return ((a = (s = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : s.tasks) == null ? void 0 : a.taskShare) ?? null;
}
function cr(t) {
  const s = ne(), a = ["task-share-links", t], r = J({
    queryKey: a,
    queryFn: () => {
      const l = gt();
      return l ? Promise.resolve(l.getList(t)) : Promise.reject(new Error("Paylaşım servisi yüklenmedi."));
    },
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), i = () => s.invalidateQueries({ queryKey: a }), o = te({
    mutationFn: (l) => Promise.resolve(gt().create({ ...l, taskId: t })),
    onSuccess: i
  }), n = te({
    mutationFn: (l) => Promise.resolve(gt().revoke(l)),
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
  const { links: s, isPending: a, create: r, revoke: i, isCreating: o } = cr(t), [n, l] = f.useState(ta), [x, m] = f.useState(null);
  if (!de("Platform.Tasks.ShareExternally"))
    return /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Görevi ekip dışıyla paylaşma yetkiniz yok." });
  const p = (y) => (b) => {
    const j = b.target.type === "checkbox" ? b.target.checked : b.target.value;
    l((w) => ({ ...w, [y]: j }));
  }, u = async (y) => {
    if (y.preventDefault(), !!n.recipientName.trim())
      try {
        const b = await r({
          ...n,
          recipientName: n.recipientName.trim(),
          // QA-41: boş e-posta "yok" demektir; "" gönderilirse sunucu doğrulaması reddeder.
          recipientEmail: n.recipientEmail.trim() || null,
          lifetimeDays: Number(n.lifetimeDays) || 14
        });
        m(b), l(ta);
      } catch (b) {
        E(b, "Paylaşım linki üretilemedi.");
      }
  }, c = (y) => `${window.location.origin}${y}`, d = (y) => {
    var b, j, w, S;
    (b = navigator.clipboard) == null || b.writeText(c(y)), (S = (w = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : w.info) == null || S.call(w, "Bağlantı kopyalandı.");
  }, N = async (y) => {
    try {
      await i(y);
    } catch (b) {
      E(b, "Bağlantı iptal edilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    x && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 rounded-[14px] border border-focus bg-primary-subtle p-3.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "text-[12.5px] font-bold text-text-primary", children: [
        "Bağlantı hazır — ",
        /* @__PURE__ */ e.jsx("span", { className: "font-normal", children: "şimdi kopyalayın, bir daha gösterilmeyecek." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("code", { className: "min-w-0 flex-1 truncate rounded-[8px] bg-surface-base px-2.5 py-2 font-mono text-[11.5px] text-text-secondary", children: c(x.url) }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => d(x.url),
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
    /* @__PURE__ */ e.jsxs("form", { onSubmit: u, className: "flex flex-col gap-2.5 rounded-[14px] border border-subtle bg-surface-base p-3.5", children: [
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
    s.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Aktivite kaydı bulunamadı." }) }) : /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: s.map((r, i) => {
      const o = i === s.length - 1;
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
  const a = (i) => {
    var o;
    return i && ((o = s == null ? void 0 : s.get) == null ? void 0 : o.call(s, i)) || null;
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
      /* @__PURE__ */ e.jsx("div", { className: "divide-y divide-subtle", children: r.map((i) => /* @__PURE__ */ e.jsx(pr, { ...i }, i.label)) })
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11.5px] text-text-tertiary", children: "Alan bazında değişiklik günlüğü (hangi alan, eski/yeni değer) henüz yayınlanmadı." })
  ] });
}
function fr(t) {
  var a, r, i;
  const s = (i = (r = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : r.projectBudgets) == null ? void 0 : i.projectBudget;
  return s != null && s.getRecordFormLookup ? Promise.resolve(s.getRecordFormLookup(t)) : Promise.reject(new Error("Bütçe servisi yüklenmedi."));
}
function br(t) {
  var i;
  const s = de("Platform.Projects.ViewBudget"), a = J({
    queryKey: ["task-detail", "budget-lines", t],
    queryFn: () => fr(t),
    enabled: !!t && s,
    staleTime: 6e4,
    retry: !1
  }), r = ((i = a.data) == null ? void 0 : i.lines) ?? [];
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
  return s ? new Promise((i, o) => {
    s.done(i).fail(o);
  }) : Promise.reject(new Error("ABP köprüsü yüklenmedi."));
}
function pt(t, s = {}) {
  var i;
  const a = ((i = window == null ? void 0 : window.abp) == null ? void 0 : i.appPath) ?? "/", r = new URLSearchParams({ handler: t });
  return Object.entries(s).forEach(([o, n]) => {
    n != null && n !== "" && r.append(o, n);
  }), `${a}Documents/Matching?${r.toString()}`;
}
const Ua = () => de("Platform.Documents"), hr = () => de("Platform.Documents.ManageMeta");
function yr(t) {
  const s = !!t && Ua(), a = J({
    queryKey: ["task-detail", "expense-matches", t],
    queryFn: () => ut({ url: pt("Matches", { projectId: t }), type: "GET" }),
    enabled: s,
    staleTime: 6e4,
    meta: { persist: !1 },
    retry: !1
  }), r = /* @__PURE__ */ new Map();
  return (a.data ?? []).forEach((i) => {
    r.has(i.expenseId) || r.set(i.expenseId, []), r.get(i.expenseId).push(i);
  }), { byExpense: r, enabled: s, isLoading: a.isLoading };
}
function gr(t, s) {
  const a = J({
    queryKey: ["task-detail", "expense-candidates", t],
    queryFn: () => ut({ url: pt("Candidates", { expenseId: t }), type: "GET" }),
    enabled: !!t && s && Ua(),
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  });
  return { candidates: a.data ?? [], isLoading: a.isLoading };
}
function vr(t) {
  const s = ne(), a = (o) => {
    s.invalidateQueries({ queryKey: ["task-detail", "expense-matches", t] }), s.invalidateQueries({ queryKey: ["task-detail", "expense-candidates", o] });
  }, r = te({
    mutationFn: ({ documentFileId: o, expenseId: n, score: l }) => ut({
      url: pt("CreateMatch"),
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ documentFileId: o, expenseId: n, score: l ?? 0 })
    }),
    onSuccess: (o, n) => a(n.expenseId)
  }), i = te({
    mutationFn: ({ matchId: o }) => ut({ url: pt("RemoveMatch", { matchId: o }), type: "POST" }),
    onSuccess: (o, n) => a(n.expenseId)
  });
  return { link: r, unlink: i, isBusy: r.isPending || i.isPending };
}
function jr(t) {
  return t == null ? "—" : new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 2 }).format(t);
}
function Nr({ expenseId: t, projectId: s, matches: a }) {
  const { candidates: r, isLoading: i } = gr(t, !0), { link: o, unlink: n, isBusy: l } = vr(s), x = hr(), m = new Set(a.map((p) => p.documentFileId)), h = r.filter((p) => !m.has(p.documentFileId));
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
        x && /* @__PURE__ */ e.jsx(
          re,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            disabled: l,
            onClick: () => n.mutate(
              { matchId: p.id, expenseId: t },
              { onError: (u) => E(u, "Evrak bağı kaldırılamadı.") }
            ),
            children: "Kaldır"
          }
        )
      ] }, p.id))
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Aday evraklar" }),
      i && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Adaylar aranıyor…" }),
      !i && h.length === 0 && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Eşleşen aday yok. Evrak Belgeler modülünden yüklenip buradan bağlanır." }),
      h.map((p) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[11px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12px] text-text-primary", children: p.displayName }),
        /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
          jr(p.amount),
          " · ",
          Ke(p.documentDate)
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: `shrink-0 font-mono text-[11px] font-bold ${p.isStrong ? "text-success" : "text-text-tertiary"}`, children: [
          "%",
          p.score
        ] }),
        x && /* @__PURE__ */ e.jsx(
          re,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            disabled: l,
            onClick: () => o.mutate(
              { documentFileId: p.documentFileId, expenseId: t, score: p.score },
              { onError: (u) => E(u, "Evrak bağlanamadı.") }
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
  var x, m, h, p, u, c, d;
  const i = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.ModalManager;
  if (!i) {
    (p = (h = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : h.error) == null || p.call(h, "Kayıt formu yüklenemedi."), r == null || r();
    return;
  }
  const o = ((u = window == null ? void 0 : window.abp) == null ? void 0 : u.appPath) ?? "/";
  (d = (c = document.activeElement) == null ? void 0 : c.blur) == null || d.call(c);
  const n = new i({ viewUrl: `${o}${t}?TaskId=${s}` });
  n.onResult(() => a == null ? void 0 : a()), n.onOpen(() => r == null ? void 0 : r()), n.open();
  const l = document.getElementById(n.getModalId());
  l && (l.setAttribute("data-apya-overlay", "abp-modal"), l.style.pointerEvents = "auto", wr.forEach((N) => l.addEventListener(N, kr, { passive: !0 }))), setTimeout(() => r == null ? void 0 : r(), 1e4);
}
function Dr({ taskId: t }) {
  const s = ne(), [a, r] = f.useState(null), i = de("Platform.Expenses.Create"), o = de("Platform.Incomes.Create"), n = de("Platform.Invoices.Create");
  if (!t || !i && !o && !n)
    return null;
  const l = () => s.invalidateQueries({ queryKey: ["task-detail", t] }), x = (m) => {
    a || (r(m), Cr(m, t, l, () => r((h) => h === m ? null : h)));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
    i && /* @__PURE__ */ e.jsxs(
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
function Tr({ invoices: t, action: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
    /* @__PURE__ */ e.jsx(Je, { title: "Faturalar", action: s }),
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
              Ke(a.dueDate)
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
  const [i, o] = f.useState(!1), n = t.kind === "income";
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
          "aria-expanded": i,
          onClick: () => o((l) => !l),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-[11px]" }),
            a.length > 0 ? `Evrak ${a.length}` : "Evrak"
          ]
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: Ke(t.date) }),
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
    r && i && /* @__PURE__ */ e.jsx(Nr, { expenseId: t.id, projectId: s, matches: a })
  ] });
}
function vt({ label: t, value: s, tone: a, note: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: `font-mono text-[22px] font-bold tracking-[-.02em] ${a}`, style: { fontVariantNumeric: "tabular-nums" }, children: s }),
    r && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
  ] });
}
function $r({ options: t, isLoading: s, lineId: a, planned: r, onField: i }) {
  return s ? null : t.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12px] text-text-tertiary", children: "Bu projede bütçe kalemi tanımlı değil — kalemler Finans & Bütçe ekranından açılır." }) : /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Bütçe kalemi" }),
      /* @__PURE__ */ e.jsx(
        Ta,
        {
          options: t,
          value: a ?? void 0,
          onChange: (o) => i("budgetLineId", o ?? null),
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
          onValueChange: (o) => i("plannedAmount", o),
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
  const i = (s ? s.values.projectId : t == null ? void 0 : t.projectId) ?? null, { options: o, lines: n, canViewBudget: l, isLoading: x } = br(i), m = !!s && !r && l && !!i, h = (s ? s.values.budgetLineId : t == null ? void 0 : t.budgetLineId) ?? null, p = (s ? s.values.plannedAmount : t == null ? void 0 : t.plannedAmount) ?? null;
  if (!m && (!h || p == null))
    return null;
  const u = n.find((S) => S.id === h), c = u ? u.remainingAmount : t == null ? void 0 : t.budgetLineRemaining, d = a, N = !!h && p != null, y = (p ?? 0) - d, b = p > 0 ? Math.round(d / p * 100) : 0, j = y < 0, w = () => {
    s.setField("budgetLineId", null), s.setField("plannedAmount", null);
  };
  return (
    /* Kırpmayan kart ŞART: kalem seçicisinin listesi kartın içine absolute
       konumlanır, TAB_CARD'ın overflow-hidden'ı onu alt kenarda keserdi. */
    /* @__PURE__ */ e.jsxs("div", { className: Ra, children: [
      /* @__PURE__ */ e.jsx(
        Je,
        {
          title: "Bütçe bağı",
          action: m && h ? /* @__PURE__ */ e.jsx(re, { type: "button", variant: "ghost", size: "sm", onClick: w, children: "Bağı kaldır" }) : null
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "px-4 pb-4 pt-1 flex flex-col gap-3", children: [
        m ? /* @__PURE__ */ e.jsx(
          $r,
          {
            options: o,
            isLoading: x,
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
            /* @__PURE__ */ e.jsx(jt, { label: "Görev bütçesi", value: ge(p, "TRY") }),
            /* @__PURE__ */ e.jsx(jt, { label: "Gerçekleşen", value: ge(d, "TRY") }),
            /* @__PURE__ */ e.jsx(
              jt,
              {
                label: "Kalan",
                value: ge(y, "TRY"),
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
function Er({ task: t, taskId: s, form: a, readOnly: r = !1 }) {
  const i = (t == null ? void 0 : t.expenses) || [], o = (t == null ? void 0 : t.incomes) || [], n = (t == null ? void 0 : t.invoices) || [], l = (a ? a.values.projectId : t == null ? void 0 : t.projectId) ?? null, { byExpense: x, enabled: m } = yr(l), h = i.filter((y) => (y.currency || "TRY") === "TRY").reduce((y, b) => y + (b.amount || 0), 0), p = /* @__PURE__ */ e.jsx(Pr, { task: t, form: a, spentByCurrency: h, readOnly: r }), u = /* @__PURE__ */ e.jsx(Dr, { taskId: s ?? (t == null ? void 0 : t.id) });
  if (i.length === 0 && o.length === 0 && n.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      p,
      /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
        /* @__PURE__ */ e.jsx(Je, { title: "Görev Finansı", action: u }),
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
  const d = Array.from(new Set([...i, ...o].map((y) => y.currency || "TRY"))).map((y) => {
    const b = o.filter((w) => (w.currency || "TRY") === y).reduce((w, S) => w + (S.amount || 0), 0), j = i.filter((w) => (w.currency || "TRY") === y).reduce((w, S) => w + (S.amount || 0), 0);
    return { cur: y, inc: b, exp: j, net: b - j };
  }), N = [
    ...o.map((y) => ({ ...y, kind: "income" })),
    ...i.map((y) => ({ ...y, kind: "expense" }))
  ].sort((y, b) => new Date(b.date || 0) - new Date(y.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    p,
    d.map(({ cur: y, inc: b, exp: j, net: w }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(vt, { label: `Toplam Gelir (${y})`, value: ge(b, y), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(vt, { label: `Toplam Gider (${y})`, value: ge(j, y), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        vt,
        {
          label: `Net Bakiye (${y})`,
          value: ge(w, y),
          tone: w >= 0 ? "text-success" : "text-negative",
          note: w >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, y)),
    n.length > 0 && /* @__PURE__ */ e.jsx(Tr, { invoices: n, action: N.length === 0 ? u : null }),
    N.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
      /* @__PURE__ */ e.jsx(Je, { title: "Finans kalemleri", action: u }),
      N.map((y) => /* @__PURE__ */ e.jsx(
        Sr,
        {
          line: y,
          projectId: l,
          matches: y.kind === "expense" ? x.get(y.id) ?? [] : [],
          docsEnabled: m && y.kind === "expense"
        },
        `${y.kind}-${y.id}`
      ))
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11px] text-text-tertiary", children: "Buradan eklenen kayıt göreve ve projesine etiketlenir; düzenleme/silme Finans modülünden yapılır. Evraklar Belgeler modülünde yaşar, buradan gidere bağlanır." })
  ] });
}
function Br({ taskId: t }) {
  const { attachments: s, isLoading: a, upload: r, remove: i, isUploading: o } = ht(t), n = f.useRef(null), [l, x] = f.useState(!1), m = s.filter((u) => ea(u.fileName)), h = async (u) => {
    var c, d, N, y, b, j;
    if (u) {
      if (!ea(u.name)) {
        (N = (d = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : d.error) == null || N.call(d, "Galeriye yalnız görsel dosya yüklenebilir.");
        return;
      }
      try {
        await r(u), (j = (b = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : b.success) == null || j.call(b, "Görsel yüklendi.");
      } catch (w) {
        E(w, "Görsel yüklenemedi.");
      } finally {
        n.current && (n.current.value = "");
      }
    }
  }, p = async (u, c) => {
    try {
      await i(u);
    } catch (d) {
      E(d, `${c} silinemedi.`);
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
        onChange: (u) => {
          var c;
          return h((c = u.target.files) == null ? void 0 : c[0]);
        },
        disabled: o
      }
    ),
    a && m.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !a && m.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görevde henüz görsel yok. Yüklediğiniz görseller Dosyalar sekmesinde de görünür." }),
    m.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3", children: m.map((u) => /* @__PURE__ */ e.jsxs(
      "figure",
      {
        className: "group relative m-0 flex flex-col overflow-hidden rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
        children: [
          /* @__PURE__ */ e.jsx(
            "a",
            {
              href: u.downloadUrl,
              target: "_blank",
              rel: "noreferrer",
              title: `${u.fileName} — tam boyutta aç`,
              className: "block aspect-[4/3] overflow-hidden bg-neutral-subtle",
              children: /* @__PURE__ */ e.jsx(
                "img",
                {
                  src: u.downloadUrl,
                  alt: u.fileName,
                  loading: "lazy",
                  className: "h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                }
              )
            }
          ),
          /* @__PURE__ */ e.jsxs("figcaption", { className: "flex items-center justify-between gap-2 p-2.5", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12px] font-bold text-text-primary", title: u.fileName, children: u.fileName }),
              /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: Ga(u.fileSize) })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                title: "Sil",
                "aria-label": `${u.fileName} gorselini sil`,
                onClick: () => p(u.id, u.fileName),
                className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
              }
            )
          ] })
        ]
      },
      u.id
    )) }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "button",
        tabIndex: 0,
        onClick: () => {
          var u;
          return (u = n.current) == null ? void 0 : u.click();
        },
        onKeyDown: (u) => {
          var c;
          u.key === "Enter" && ((c = n.current) == null || c.click());
        },
        onDragOver: (u) => {
          u.preventDefault(), l || x(!0);
        },
        onDragLeave: () => x(!1),
        onDrop: (u) => {
          var c, d;
          u.preventDefault(), x(!1), h((d = (c = u.dataTransfer) == null ? void 0 : c.files) == null ? void 0 : d[0]);
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
const Ir = [
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
function Fr(t, s, a, r) {
  const i = sa(t, a), o = sa(s, a), n = i === null || i === "", l = o === null || o === "";
  return n && l ? 0 : n ? 1 : l ? -1 : i === o ? 0 : (i < o ? -1 : 1) * (r === "asc" ? 1 : -1);
}
function Ar({ task: t = {}, onOpenSubtask: s }) {
  const [a, r] = f.useState({ key: "dueDate", dir: "asc" }), i = (t == null ? void 0 : t.subTasks) ?? [], o = f.useMemo(
    () => [...i].sort((l, x) => Fr(l, x, a.key, a.dir)),
    [i, a.key, a.dir]
  ), n = (l) => r((x) => x.key === l ? { key: l, dir: x.dir === "asc" ? "desc" : "asc" } : { key: l, dir: "asc" });
  return i.length === 0 ? /* @__PURE__ */ e.jsx(
    he,
    {
      icon: "fa-table",
      title: "Alt görev yok",
      description: "Alt Görevler sekmesinden ekledikleriniz burada tablo olarak listelenir."
    }
  ) : /* @__PURE__ */ e.jsx("div", { className: `${$e} overflow-x-auto`, children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse text-[12.5px]", children: [
    /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsx("tr", { className: "bg-surface-raised", children: Ir.map((l) => {
      const x = a.key === l.key;
      return /* @__PURE__ */ e.jsx(
        "th",
        {
          scope: "col",
          "aria-sort": x ? a.dir === "asc" ? "ascending" : "descending" : "none",
          className: `px-3.5 py-2.5 border-b border-subtle font-bold text-text-secondary whitespace-nowrap ${l.align === "right" ? "text-right" : "text-left"}`,
          children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => n(l.key),
              className: `inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer font-bold ${x ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`,
              children: [
                l.label,
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid text-[9px] ${x ? a.dir === "asc" ? "fa-arrow-up-short-wide" : "fa-arrow-down-wide-short" : "fa-sort opacity-40"}` })
              ]
            }
          )
        },
        l.key
      );
    }) }) }),
    /* @__PURE__ */ e.jsx("tbody", { children: o.map((l) => {
      const x = be(l.status), m = ft(l.priority), h = $a(l.dueDate);
      return /* @__PURE__ */ e.jsxs(
        "tr",
        {
          onClick: () => s == null ? void 0 : s(l.id),
          className: "border-b border-subtle last:border-b-0 cursor-pointer hover:bg-surface-raised",
          children: [
            /* @__PURE__ */ e.jsxs("td", { className: "px-3.5 py-2.5 max-w-[320px]", children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: (p) => {
                    p.stopPropagation(), s == null || s(l.id);
                  },
                  title: l.title,
                  className: `block w-full truncate bg-transparent border-0 p-0 text-left font-semibold cursor-pointer ${l.status === 4 ? "line-through text-text-tertiary" : "text-text-primary"}`,
                  children: l.title
                }
              ),
              l.code && /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: l.code })
            ] }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(Pe, { bg: x.bg, fg: x.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x.icon} text-[9px] mr-1` }),
              x.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(Pe, { bg: m.bg, fg: m.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${m.icon} text-[9px] mr-1` }),
              m.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: l.assigneeName ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ e.jsx(bt, { name: l.assigneeName, size: 22 }),
              /* @__PURE__ */ e.jsx("span", { className: "truncate text-text-secondary", children: l.assigneeName })
            ] }) : /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: "Atanmadı" }) }),
            /* @__PURE__ */ e.jsxs("td", { className: `px-3.5 py-2.5 text-right whitespace-nowrap ${h.tone}`, children: [
              l.dueDate ? Ke(l.dueDate) : "—",
              h.hint && /* @__PURE__ */ e.jsx("div", { className: "text-[11px]", children: h.hint })
            ] })
          ]
        },
        l.id
      );
    }) })
  ] }) });
}
function zr({ taskId: t, task: s = {}, onOpenSubtask: a }) {
  const r = ne(), i = (s == null ? void 0 : s.subTasks) ?? [], [o, n] = f.useState(null), [l, x] = f.useState(null), m = async (h, p) => {
    const u = i.find((c) => c.id === h);
    if (!(!u || u.status === p || !We(u).canChangeStatus)) {
      x(h);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.updateStatus(h, p)), await r.invalidateQueries({ queryKey: ["task-detail", t] });
      } catch (c) {
        E(c, "Alt görev durumu güncellenemedi.");
      } finally {
        x(null);
      }
    }
  };
  return i.length === 0 ? /* @__PURE__ */ e.jsx(
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 items-start", children: Qt.map((h) => {
      const p = be(h), u = i.filter((d) => d.status === h), c = o === h;
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
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: u.length })
            ] }),
            u.map((d) => {
              const N = ft(d.priority), y = We(d).canChangeStatus;
              return /* @__PURE__ */ e.jsxs(
                "article",
                {
                  draggable: y,
                  onDragStart: (b) => {
                    var j;
                    return (j = b.dataTransfer) == null ? void 0 : j.setData("text/plain", d.id);
                  },
                  role: "button",
                  tabIndex: 0,
                  onClick: () => a == null ? void 0 : a(d.id),
                  onKeyDown: (b) => {
                    b.key === "Enter" && (a == null || a(d.id));
                  },
                  className: `flex flex-col gap-2 p-2.5 rounded-[12px] border border-subtle bg-surface-base shadow-xs cursor-pointer hover:border-focus hover:shadow-md ${l === d.id ? "opacity-60" : ""}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary line-clamp-2", children: d.title }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                      /* @__PURE__ */ e.jsxs("span", { className: `text-[10.5px] font-bold ${N.fg}`, children: [
                        /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${N.icon} text-[9px] mr-1` }),
                        N.label
                      ] }),
                      d.dueDate && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: Ke(d.dueDate) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2 border-t border-subtle", children: [
                      d.assigneeName ? /* @__PURE__ */ e.jsx(bt, { name: d.assigneeName, size: 20 }) : /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] text-text-tertiary", children: "Atanmadı" }),
                      /* @__PURE__ */ e.jsx(
                        "select",
                        {
                          "aria-label": `${d.title} durumunu değiştir`,
                          value: d.status,
                          onClick: (b) => b.stopPropagation(),
                          onChange: (b) => m(d.id, Number(b.target.value)),
                          disabled: !y,
                          className: `h-[24px] px-1.5 rounded-[6px] border border-subtle bg-surface-base text-[10.5px] text-text-secondary ${y ? "cursor-pointer" : "cursor-default"}`,
                          children: Qt.map((b) => /* @__PURE__ */ e.jsx("option", { value: b, children: be(b).label }, b))
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
], Mr = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], ra = (t) => String(t).padStart(2, "0"), Va = (t, s, a) => `${t}-${ra(s + 1)}-${ra(a)}`;
function Et(t) {
  if (!t) return null;
  const s = /^(\d{4}-\d{2}-\d{2})/.exec(String(t));
  return s ? s[1] : null;
}
function Kr(t, s) {
  const r = (new Date(t, s, 1).getDay() + 6) % 7, i = new Date(t, s + 1, 0).getDate(), o = [];
  for (let n = 0; n < 42; n++) {
    const l = n - r + 1;
    o.push(l >= 1 && l <= i ? { key: Va(t, s, l), day: l, inMonth: !0 } : { key: `bos-${n}`, day: null, inMonth: !1 });
  }
  return o;
}
function Rr(t) {
  const s = /* @__PURE__ */ new Map(), a = (r, i) => {
    const o = Et(r);
    o && (s.has(o) || s.set(o, []), s.get(o).push(i));
  };
  a(t == null ? void 0 : t.startDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "start", isSelf: !0, status: t == null ? void 0 : t.status }), a(t == null ? void 0 : t.dueDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "due", isSelf: !0, status: t == null ? void 0 : t.status });
  for (const r of (t == null ? void 0 : t.subTasks) ?? [])
    a(r.startDate, { id: r.id, title: r.title, kind: "start", isSelf: !1, status: r.status }), a(r.dueDate, { id: r.id, title: r.title, kind: "due", isSelf: !1, status: r.status });
  return s;
}
function qr({ task: t = {}, onOpenSubtask: s }) {
  const a = f.useMemo(() => Rr(t), [t]), [r, i] = f.useState(() => {
    const m = Et(t == null ? void 0 : t.startDate) ?? Et(t == null ? void 0 : t.dueDate);
    if (m) {
      const [p, u] = m.split("-").map(Number);
      return { year: p, month: u - 1 };
    }
    const h = /* @__PURE__ */ new Date();
    return { year: h.getFullYear(), month: h.getMonth() };
  }), o = f.useMemo(() => Kr(r.year, r.month), [r.year, r.month]), n = (m) => i(({ year: h, month: p }) => {
    const u = p + m;
    return { year: h + Math.floor(u / 12), month: (u % 12 + 12) % 12 };
  }), l = /* @__PURE__ */ new Date(), x = Va(l.getFullYear(), l.getMonth(), l.getDate());
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-subtle bg-surface-raised", children: Mr.map((m) => /* @__PURE__ */ e.jsx("span", { className: "px-2 py-1.5 text-center text-[11px] font-bold text-text-tertiary", children: m }, m)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: o.map((m) => {
      const h = m.inMonth ? a.get(m.key) ?? [] : [], p = m.key === x;
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: `flex flex-col gap-1 min-h-[76px] p-1.5 border-r border-b border-subtle last-of-type:border-r-0 ${m.inMonth ? "" : "bg-surface-sunken"}`,
          children: [
            m.inMonth && /* @__PURE__ */ e.jsx("span", { className: `self-end font-mono text-[11px] font-bold ${p ? "flex items-center justify-center h-[18px] w-[18px] rounded-full bg-primary text-white" : "text-text-tertiary"}`, children: m.day }),
            h.map((u, c) => {
              const d = be(u.status);
              return /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  title: `${u.title} — ${u.kind === "due" ? "termin" : "başlangıç"}`,
                  onClick: () => {
                    u.isSelf || s == null || s(u.id);
                  },
                  className: `flex items-center gap-1 w-full px-1.5 py-[3px] rounded-[6px] text-left text-[10.5px] font-semibold ${d.bg} ${d.fg} ${u.isSelf ? "cursor-default" : "cursor-pointer hover:brightness-95"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.kind === "due" ? "fa-flag-checkered" : "fa-play"} text-[8px] shrink-0` }),
                    /* @__PURE__ */ e.jsx("span", { className: "truncate", children: u.title })
                  ]
                },
                `${u.id}-${u.kind}-${c}`
              );
            })
          ]
        },
        m.key
      );
    }) })
  ] });
}
function He() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Gr(t) {
  const s = He();
  return s ? Promise.resolve(s.getDocuments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Yr(t) {
  const s = ne(), a = ["task-documents", t], r = J({
    queryKey: a,
    queryFn: () => Gr(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), i = () => s.invalidateQueries({ queryKey: a }), o = te({
    mutationFn: (x) => Promise.resolve(He().createDocument(t, x)),
    onSuccess: i
  }), n = te({
    mutationFn: ({ id: x, title: m, content: h }) => Promise.resolve(He().updateDocument(x, { title: m, content: h })),
    onSuccess: (x) => {
      i(), x != null && x.id && s.setQueryData(["task-document", x.id], x);
    }
  }), l = te({
    mutationFn: (x) => Promise.resolve(He().deleteDocument(x)),
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
function _r(t) {
  return J({
    queryKey: ["task-document", t],
    queryFn: () => Promise.resolve(He().getDocument(t)),
    enabled: !!t,
    /* Kayıt tam değiştirir (updateDocument {id,title,content}); bayat gövdeden
       kaydetmek başka ekranda yapılan değişikliği ezer. */
    meta: { persist: !1 },
    retry: !1
  });
}
function Ur({ taskId: t }) {
  const { documents: s, isLoading: a, createDocument: r, updateDocument: i, removeDocument: o, isSaving: n } = Yr(t), [l, x] = f.useState(null), [m, h] = f.useState(""), [p, u] = f.useState(""), [c, d] = f.useState(!1), [N, y] = f.useState(!1), { data: b, isFetching: j } = _r(l);
  f.useEffect(() => {
    !b || b.id !== l || (h(b.title ?? ""), u(b.content ?? ""), d(!1));
  }, [b == null ? void 0 : b.id]);
  const w = async () => {
    try {
      const I = await r("Yeni belge");
      I != null && I.id && x(I.id);
    } catch (I) {
      E(I, "Belge oluşturulamadı.");
    }
  }, S = async () => {
    var Q, G, Y, z, R, V;
    const I = m.trim();
    if (!I)
      return (Y = (G = (Q = window == null ? void 0 : window.abp) == null ? void 0 : Q.notify) == null ? void 0 : G.error) == null || Y.call(G, "Belge başlığı boş olamaz."), !1;
    try {
      return await i({ id: l, title: I, content: p }), d(!1), (V = (R = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : R.success) == null || V.call(R, "Belge kaydedildi."), !0;
    } catch (O) {
      return E(O, "Belge kaydedilemedi."), !1;
    }
  }, P = async (I, Q) => {
    try {
      await o(I), l === I && x(null);
    } catch (G) {
      E(G, `“${Q}” silinemedi.`);
    }
  }, q = () => {
    if (c) {
      y(!0);
      return;
    }
    x(null);
  };
  return l ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: q,
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
          onChange: (I) => {
            h(I.target.value), d(!0);
          },
          className: "flex-1 min-w-0 h-9 px-3 rounded-[10px] border border-subtle bg-surface-base text-[13.5px] font-bold text-text-primary focus:border-focus focus:shadow-focus focus:outline-none"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: S,
          disabled: n || !c,
          className: `flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[12.5px] font-bold ${n || !c ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n ? "fa-circle-notch fa-spin" : "fa-floppy-disk"} text-[11px]` }),
            n ? "Kaydediliyor…" : c ? "Kaydet" : "Kaydedildi"
          ]
        }
      )
    ] }),
    j && !b ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Belge yükleniyor…" }) : /* @__PURE__ */ e.jsx(
      Pa,
      {
        value: p,
        ariaLabel: "Belge içeriği",
        placeholder: "Belgeyi buraya yazın…",
        onChange: (I) => {
          u(I), d(!0);
        }
      }
    ),
    /* @__PURE__ */ e.jsx(
      At,
      {
        open: N,
        isSaving: n,
        onStay: () => y(!1),
        onDiscard: () => {
          y(!1), d(!1), x(null);
        },
        onSave: async () => {
          const I = await S();
          y(!1), I && x(null);
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
    s.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: s.map((I) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "group flex items-center gap-3 px-3.5 py-3 border-b border-subtle last:border-b-0 hover:bg-surface-raised",
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[14px]" }) }),
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => x(I.id),
              className: "flex-1 min-w-0 bg-transparent border-0 p-0 text-left cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[13px] font-bold text-text-primary", children: I.title }),
                /* @__PURE__ */ e.jsx("span", { className: "block text-[11.5px] text-text-tertiary", children: I.contentLength > 0 ? `${I.editorName} · ${xt(I.lastModificationTime ?? I.creationTime)}` : "Boş belge — açıp yazmaya başlayın" })
              ]
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              "aria-label": `${I.title} belgesini sil`,
              onClick: () => P(I.id, I.title),
              className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[12px]" })
            }
          )
        ]
      },
      I.id
    )) })
  ] });
}
function Me() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Vr(t) {
  const s = Me();
  return s ? Promise.resolve(s.getLinkedForms(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Or(t) {
  const s = ne(), a = ["task-forms", t], r = J({
    queryKey: a,
    queryFn: () => Vr(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), i = () => s.invalidateQueries({ queryKey: a }), o = te({
    mutationFn: (x) => Promise.resolve(Me().linkForm(t, x)),
    onSuccess: i
  }), n = te({
    mutationFn: (x) => Promise.resolve(Me().unlinkForm(x)),
    onSuccess: i
  }), l = te({
    mutationFn: ({ linkId: x, value: m }) => Promise.resolve(Me().setFormGuestFillable(x, m)),
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
function Qr(t, s) {
  return J({
    queryKey: ["task-form-options", t],
    queryFn: () => Promise.resolve(Me().getFormOptions(t)),
    enabled: !!t && !!s,
    meta: { persist: !1 },
    retry: !1
  });
}
function Hr(t, s) {
  return J({
    queryKey: ["task-form-responses", t, s],
    queryFn: () => Promise.resolve(Me().getFormResponses(t, s)),
    enabled: !!t && !!s,
    meta: { persist: !1 },
    retry: !1
  });
}
function Wr({ taskId: t, documentId: s }) {
  const { data: a, isLoading: r } = Hr(t, s);
  return r ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Yanıtlar yükleniyor…" }) : a != null && a.length ? /* @__PURE__ */ e.jsx("ul", { className: "m-0 list-none p-0", children: a.map((i) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-3 px-3.5 py-2 border-t border-subtle", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${i.isGuestSubmission ? "fa-user-clock" : "fa-user"} text-[10px] text-text-tertiary` }),
      /* @__PURE__ */ e.jsx("span", { className: "truncate text-[12.5px] text-text-primary", children: i.respondentName }),
      i.isGuestSubmission && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: "· dış" })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary", children: xt(i.creationTime) })
  ] }, i.id)) }) : /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Bu görevde henüz yanıt yok." });
}
function Jr({ taskId: t }) {
  const { forms: s, isLoading: a, linkForm: r, unlinkForm: i, setGuestFillable: o, isLinking: n } = Or(t), [l, x] = f.useState(!1), [m, h] = f.useState(null), { data: p, isLoading: u } = Qr(t, l), c = de("Platform.Tasks.ShareExternally"), d = async (b) => {
    try {
      await r(b), x(!1);
    } catch (j) {
      E(j, "Form bağlanamadı.");
    }
  }, N = async (b) => {
    if (window.confirm(`“${b.title}” bağlantısı kaldırılsın mı? Form ve toplanmış yanıtlar silinmez.`))
      try {
        await i(b.id);
      } catch (j) {
        E(j, "Bağlantı kaldırılamadı.");
      }
  }, y = async (b, j) => {
    try {
      await o({ linkId: b.id, value: j });
    } catch (w) {
      E(w, "Ayar değiştirilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Formlar" }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => x((b) => !b),
          className: "flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l ? "fa-xmark" : "fa-plus"} text-[11px]` }),
            l ? "Kapat" : "Form bağla"
          ]
        }
      )
    ] }),
    l && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-raised overflow-hidden", children: [
      u && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Formlar yükleniyor…" }),
      !u && !(p != null && p.length) && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Bağlanabilecek form yok. Önce Form Yönetimi'nden bir form oluşturun." }),
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
    !a && s.length === 0 && !l && /* @__PURE__ */ e.jsx(
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
            onClick: () => h((j) => j === b.documentId ? null : b.documentId),
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
        b.responseCount > 0 && /* @__PURE__ */ e.jsx(qa, { children: b.responseCount }),
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
            onChange: (j) => y(b, j.target.checked)
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
function Nt(t) {
  if (!t) return null;
  const s = new Date(t);
  return Number.isNaN(s.getTime()) ? null : s;
}
const Ue = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
function Xr({ task: t = {} }) {
  const s = f.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((n, l) => ({
    id: n.id || `row-${l}`,
    name: n.title || "Başlıksız görev",
    isMain: !!n.__main,
    start: Nt(n.startDate),
    end: Nt(n.dueDate) || Nt(n.completedDate),
    status: n.status ?? 1
  })), [t]), { min: a, span: r } = f.useMemo(() => {
    const o = s.flatMap((x) => [x.start, x.end]).filter(Boolean).map((x) => x.getTime());
    if (o.length === 0) return { min: null, span: 0 };
    const n = Math.min(...o), l = Math.max(...o);
    return { min: n, span: Math.max(1, l - n) };
  }, [s]), i = f.useMemo(() => a === null ? [] : [0, 1, 2, 3].map((o) => new Date(a + r * o / 4)), [a, r]);
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
        Ue(new Date(a)),
        " – ",
        Ue(new Date(a + r))
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-4 gap-0 pl-[170px] mb-2 lt-860:pl-[110px]", children: i.map((o, n) => /* @__PURE__ */ e.jsx(
      "span",
      {
        className: "pl-2 border-l border-subtle text-[10.5px] font-bold uppercase tracking-[.06em] text-text-tertiary",
        children: Ue(o)
      },
      n
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: s.map((o) => {
      const n = o.start ? o.start.getTime() : a, l = o.end ? Math.max(o.end.getTime(), n) : n, x = (n - a) / r * 100, m = Math.max(2, (l - n) / r * 100), h = Math.max(1, Math.round((l - n) / 864e5));
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
            style: { left: `${x}%`, width: `${m}%` },
            title: `${Ue(o.start)} – ${Ue(o.end)}`,
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
function na({ icon: t, iconTone: s, title: a, note: r, children: i }) {
  return /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[12px] ${s}` }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: a }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
    ] }),
    i
  ] });
}
function en({ task: t = {}, readOnly: s = !1 }) {
  const a = ne(), r = t.predecessorIds || [], i = () => {
    var j, w, S;
    return (S = (w = (j = window == null ? void 0 : window.apya) == null ? void 0 : j.platform) == null ? void 0 : w.tasks) == null ? void 0 : S.task;
  }, { data: o = [] } = J({
    queryKey: ["task-dependency-candidates", t.projectId ?? null],
    queryFn: async () => {
      var w;
      const j = await Promise.resolve((w = i()) == null ? void 0 : w.getList({ projectId: t.projectId || void 0, maxResultCount: 1e3 }));
      return (j == null ? void 0 : j.items) ?? [];
    },
    enabled: !!t.id,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), { data: n = [], isLoading: l } = J({
    queryKey: ["task-dependency-edges", t.projectId ?? null],
    queryFn: async () => {
      var j;
      return await Promise.resolve((j = i()) == null ? void 0 : j.getProjectDependencies(t.projectId || void 0)) ?? [];
    },
    enabled: !!t.id,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), x = f.useMemo(() => new Map(o.map((j) => [j.id, j])), [o]), m = n.filter((j) => j.predecessorTaskId === t.id).map((j) => j.taskId), h = o.filter((j) => j.id !== t.id && !r.includes(j.id) && !m.includes(j.id)), [p, u] = f.useState(""), { data: c = [], isLoading: d } = J({
    queryKey: ["task-predecessors", t.id, r],
    queryFn: async () => {
      const j = i();
      return j ? Promise.all(
        r.map(
          (w) => Promise.resolve(j.get(w)).catch(() => ({ id: w, title: "(erişilemeyen görev)", status: null, code: "—" }))
        )
      ) : [];
    },
    enabled: r.length > 0,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), N = async (j) => {
    var w, S, P;
    try {
      await Promise.resolve(i().update(t.id, Bt(t, {
        predecessorIds: r.filter((q) => q !== j)
      }))), await a.invalidateQueries({ queryKey: ["task-detail", t.id] }), await a.invalidateQueries({ queryKey: ["task-dependency-edges"] }), (P = (S = (w = window == null ? void 0 : window.abp) == null ? void 0 : w.notify) == null ? void 0 : S.info) == null || P.call(S, "Bağlantı kaldırıldı.");
    } catch (q) {
      E(q, "Bağlantı kaldırılamadı.");
    }
  }, y = async () => {
    var j, w, S;
    if (p)
      try {
        await Promise.resolve(i().update(t.id, Bt(t, {
          predecessorIds: [...r, p]
        }))), u(""), await a.invalidateQueries({ queryKey: ["task-detail", t.id] }), await a.invalidateQueries({ queryKey: ["task-dependency-edges"] }), (S = (w = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : w.success) == null || S.call(w, "Öncül eklendi.");
      } catch (P) {
        E(P, "Öncül eklenemedi.");
      }
  }, b = (j) => {
    var w, S, P;
    return (P = (S = (w = window == null ? void 0 : window.apya) == null ? void 0 : w.taskDetail) == null ? void 0 : S.open) == null ? void 0 : P.call(S, j);
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
          r.length === 0 ? /* @__PURE__ */ e.jsx(he, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : d ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : c.map((j) => {
            const w = j.status == null ? null : be(j.status);
            return /* @__PURE__ */ e.jsxs(
              "div",
              {
                className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
                children: [
                  /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: j.code || "—" }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => b(j.id),
                      className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                      children: j.title || "Başlıksız görev"
                    }
                  ),
                  w && /* @__PURE__ */ e.jsx(Pe, { bg: w.bg, fg: w.fg, children: w.label }),
                  !s && /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      title: "Bağlantıyı kaldır",
                      "aria-label": `${j.title} bağlantısını kaldır`,
                      onClick: () => N(j.id),
                      className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link-slash text-[10px]" })
                    }
                  )
                ]
              },
              j.id
            );
          }),
          !s && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-4 py-3 border-t border-subtle", children: [
            /* @__PURE__ */ e.jsxs(
              "select",
              {
                "aria-label": "Öncül görev seç",
                value: p,
                onChange: (j) => u(j.target.value),
                className: "flex-1 min-w-0 h-8 px-2.5 rounded-[9px] border border-default bg-surface-base text-text-primary text-[12.5px]",
                children: [
                  /* @__PURE__ */ e.jsx("option", { value: "", children: h.length ? "Öncül görev seçin…" : "Eklenebilecek görev yok" }),
                  h.map((j) => /* @__PURE__ */ e.jsx("option", { value: j.id, children: (j.code ? j.code + " · " : "") + (j.title || "Başlıksız görev") }, j.id))
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
      na,
      {
        icon: "fa-arrow-right-long",
        iconTone: "text-primary",
        title: "Ardıl görevler",
        note: "bu görev bitince başlar",
        children: l ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : m.length === 0 ? /* @__PURE__ */ e.jsx(he, { icon: "fa-diagram-project", title: "Ardıl görev yok", description: "Bu görevi öncül olarak gösteren bir görev yok." }) : m.map((j) => {
          const w = x.get(j), S = w && w.status != null ? be(w.status) : null;
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
                    onClick: () => b(j),
                    className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                    children: (w == null ? void 0 : w.title) || "(erişilemeyen görev)"
                  }
                ),
                S && /* @__PURE__ */ e.jsx(Pe, { bg: S.bg, fg: S.fg, children: S.label })
              ]
            },
            j
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
  const s = ne(), a = ["task-timelogs", t], r = ["task-active-timelog"], i = J({
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
  }, l = te({
    mutationFn: () => {
      var m;
      return Promise.resolve((m = ze()) == null ? void 0 : m.startTimeTracking(t));
    },
    onSuccess: n
  }), x = te({
    mutationFn: () => {
      var m;
      return Promise.resolve((m = ze()) == null ? void 0 : m.stopTimeTracking(t));
    },
    onSuccess: n
  });
  return {
    logs: i.data ?? [],
    isLoading: i.isLoading,
    activeLog: o.data ?? null,
    start: l.mutateAsync,
    stop: x.mutateAsync,
    isMutating: l.isPending || x.isPending
  };
}
function ia(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function an({ taskId: t, task: s = {} }) {
  const a = tn(t), r = a.activeLog && a.activeLog.taskId === t ? a.activeLog : null, [i, o] = f.useState(() => Date.now());
  f.useEffect(() => {
    if (!r) return;
    const d = setInterval(() => o(Date.now()), 1e3);
    return () => clearInterval(d);
  }, [r]);
  const n = r ? Math.max(0, Math.floor((i - new Date(r.startTime).getTime()) / 1e3)) : 0, x = a.logs.reduce((d, N) => d + (N.secondsSpent || 0), 0) + n, m = (s == null ? void 0 : s.estimatedHours) ?? null, h = m ? m * 3600 : 0, p = h ? Math.min(100, Math.round(x / h * 100)) : 0, u = h ? Math.max(0, h - x) : 0, c = async () => {
    try {
      r ? await a.stop() : await a.start();
    } catch (d) {
      E(d, "Zaman takibi güncellenemedi.");
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
            m,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-warning", style: { width: `${p}%` } }) }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "Kalan tahmini süre: ",
          yt(u)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
      /* @__PURE__ */ e.jsx(Je, { title: "Zaman kayıtları" }),
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
              /* @__PURE__ */ e.jsx(bt, { name: d.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: d.note || d.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                ia(d.startTime),
                " → ",
                N ? "sürüyor" : ia(d.endTime)
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary", children: N ? "Aktif" : yt(d.secondsSpent || 0) })
            ]
          },
          d.id
        );
      })
    ] })
  ] });
}
const et = [
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
function Oa(t = []) {
  const s = new Set(t);
  return et.filter((a) => !a.hidden).filter((a) => a.implemented && (a.isCore || s.has(a.code))).sort((a, r) => a.order - r.order);
}
function Qa(t = []) {
  const s = new Set(t);
  return et.filter((a) => !a.hidden).filter((a) => !a.isCore).filter((a) => !a.permission || de(a.permission)).map((a) => ({ ...a, isAssigned: s.has(a.code) })).sort((a, r) => a.order - r.order);
}
let rt = null;
const ct = /* @__PURE__ */ new Set(), wt = /* @__PURE__ */ new Set();
let nt = !1;
function la() {
  ct.forEach((t) => t());
}
function sn(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const W = {
  open(t) {
    const s = sn(t);
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
  const [r, i] = f.useState(t), [o, n] = f.useState([]), { data: l, isPending: x, isError: m, refetch: h } = Lt(r), p = Sa(), u = La(l), c = Ma(), d = Ka(r), [N, y] = f.useState("general"), [b, j] = f.useState(!1), w = Le.useRef(null), S = f.useMemo(
    () => Oa(d.assignedCodes),
    [d.assignedCodes]
  ), P = f.useMemo(
    () => Qa(d.assignedCodes),
    [d.assignedCodes]
  ), q = S.find((B) => B.code === N) ?? S[0];
  Le.useEffect(() => {
    q.code !== N && y(q.code);
  }, [q, N]);
  const I = q == null ? void 0 : q.component, Q = ne(), [G, Y] = f.useState(
    () => {
      var B;
      return ((B = window.localStorage) == null ? void 0 : B.getItem(oa)) === "1";
    }
  ), [z, R] = f.useState(!1), [V, O] = f.useState(!1), _ = f.useCallback(() => {
    Kt(), a == null || a();
  }, [a]);
  Aa(s === "page" ? null : t, _), Le.useEffect(() => {
    u.isDirty ? p.markDirty() : p.markClean();
  });
  const X = f.useCallback(() => {
    z || (O(!1), p.requestClose(_));
  }, [p, _, z]), Z = f.useCallback(() => {
    Y((B) => {
      var K;
      const A = !B;
      return (K = window.localStorage) == null || K.setItem(oa, A ? "1" : "0"), A;
    });
  }, []), D = de("Platform.Tasks.Delete"), [M, U] = f.useState(!1), [ae, ie] = f.useState(!1), oe = f.useCallback(async () => {
    var B, A, K;
    ie(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (K = (A = (B = window == null ? void 0 : window.abp) == null ? void 0 : B.notify) == null ? void 0 : A.info) == null || K.call(A, "Başarıyla silindi."), U(!1), p.markClean(), _();
    } catch (xe) {
      E(xe, "Görev silinemedi.");
    } finally {
      ie(!1);
    }
  }, [r, p, _]), se = f.useCallback(async () => {
    var B, A, K;
    if (!u.validate()) return !1;
    R(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, u.toUpdateDto())
      ), await Q.invalidateQueries({ queryKey: ["task-detail", r] }), W.emitResult(), (K = (A = (B = window == null ? void 0 : window.abp) == null ? void 0 : B.notify) == null ? void 0 : A.success) == null || K.call(A, "Kaydedildi."), !0;
    } catch (xe) {
      return E(xe, "Kaydedilemedi."), !1;
    } finally {
      R(!1);
    }
  }, [r, u, p, Q]), H = f.useCallback(() => {
    se();
  }, [se]), ce = f.useCallback(async () => {
    if (O(!1), !u.validate()) {
      p.resolvePendingClose("stay"), y("general");
      return;
    }
    await se() ? p.resolvePendingClose("saved") : O(!0);
  }, [p, u, se]), $ = f.useCallback((B, A) => {
    p.requestClose(() => {
      n((K) => [...K, { id: r, title: (l == null ? void 0 : l.title) ?? "" }]), i(B), y("general"), p.markClean();
    });
  }, [p, r, l]), ee = f.useCallback((B) => {
    p.requestClose(() => {
      n((A) => {
        const K = A.findIndex((xe) => xe.id === B);
        return K === -1 ? A : A.slice(0, K);
      }), i(B), y("general"), p.markClean();
    });
  }, [p]), C = f.useCallback(async (B) => {
    try {
      await d.addFeature(B), y(B), j(!1);
    } catch (A) {
      E(A, "Özellik eklenemedi.");
    }
  }, [d]), g = f.useCallback(async (B) => {
    try {
      await d.removeFeature(B), y((A) => A === B ? "general" : A);
    } catch (A) {
      E(A, "Özellik kaldırılamadı.");
    }
  }, [d]);
  Le.useEffect(() => {
    if (!b) return;
    const B = (K) => {
      w.current && !w.current.contains(K.target) && j(!1);
    }, A = (K) => {
      K.key === "Escape" && j(!1);
    };
    return document.addEventListener("mousedown", B), document.addEventListener("keydown", A), () => {
      document.removeEventListener("mousedown", B), document.removeEventListener("keydown", A);
    };
  }, [b]);
  const v = x ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(ke, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(ke, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(ke, { className: "h-24 w-full" })
  ] }) : m && !l ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(re, { variant: "ghost", onClick: () => h(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      Hs,
      {
        trail: o,
        current: { id: r, title: (l == null ? void 0 : l.title) ?? "" },
        onNavigate: ee
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: w, children: [
      /* @__PURE__ */ e.jsx(
        Vs,
        {
          tabs: S,
          activeCode: q.code,
          onSelect: (B) => {
            y(B), j(!1);
          },
          onOpenPicker: () => j((B) => !B),
          pickerOpen: b
        }
      ),
      b && /* @__PURE__ */ e.jsx(
        Qs,
        {
          entries: P,
          busyCode: d.isMutating ? d.mutatingCode : null,
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
        "aria-labelledby": `task-tab-${q.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          q.code === "general" ? /* @__PURE__ */ e.jsx(
            Gs,
            {
              values: u.values,
              errors: u.errors,
              onFieldChange: u.setField,
              assigneeOptions: c.options,
              isLoadingAssignees: c.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(f.Suspense, { fallback: /* @__PURE__ */ e.jsx(ke, { className: "h-24 w-full" }), children: I && /* @__PURE__ */ e.jsx(
            I,
            {
              taskId: r,
              task: l,
              form: u,
              onOpenSubtask: $
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            Ys,
            {
              task: l,
              creatorName: c.nameById.get(l.creatorId),
              lastModifierName: c.nameById.get(l.lastModifierId)
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
      fullscreen: G,
      onRequestClose: X,
      title: l ? `Görev Detayı: ${l.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        Ls,
        {
          task: l ?? { title: "Yükleniyor…" },
          canDelete: D,
          fullscreen: G,
          onToggleFullscreen: Z,
          onClose: X,
          onDelete: () => U(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        Ks,
        {
          lastSavedAt: l == null ? void 0 : l.lastModificationTime,
          isDirty: p.isDirty,
          isSaving: z,
          onCancel: X,
          onSave: H
        }
      ),
      children: [
        v,
        /* @__PURE__ */ e.jsx(
          At,
          {
            open: p.pendingClose,
            isSaving: z,
            errorText: V ? ue("Common:Unsaved:SaveFailed", "Kaydedilemedi. Düzenlemeye dönebilir ya da değişiklikleri atabilirsiniz.") : void 0,
            onStay: () => {
              O(!1), p.resolvePendingClose("stay");
            },
            onDiscard: () => {
              O(!1), u.reset(), p.resolvePendingClose("discard");
            },
            onSave: ce
          }
        ),
        M && /* @__PURE__ */ e.jsx(
          rn,
          {
            taskTitle: (l == null ? void 0 : l.title) ?? "",
            busy: ae,
            onCancel: () => U(!1),
            onConfirm: oe
          }
        )
      ]
    }
  );
}
function rn({ taskTitle: t, busy: s, onCancel: a, onConfirm: r }) {
  const [i, o] = f.useState(""), n = i.trim() === "SİL";
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
function nn({ label: t, title: s, description: a, children: r, actions: i }) {
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
        /* @__PURE__ */ e.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: i })
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
  const r = !!t, [i, o] = f.useState(null);
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
    /* @__PURE__ */ e.jsx(Te, { container: Fe(i), children: /* @__PURE__ */ e.jsxs(
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
            const l = r === n.value;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => s(n.value),
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
          /* @__PURE__ */ e.jsx(Ts, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const ca = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto", cn = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", dn = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" }
];
function xn({ children: t }) {
  return /* @__PURE__ */ e.jsx(zt, { asChild: !0, children: t });
}
function un({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "inline-flex items-center h-[19px] px-1.5 rounded-[5px] border border-default border-b-2 bg-neutral-subtle font-mono text-[10px] font-semibold text-text-secondary", children: t });
}
function pn({
  task: t = {},
  presentation: s = "modal",
  onClose: a,
  isFullscreen: r,
  onToggleFullscreen: i,
  onFieldChange: o = () => {
  },
  statusValue: n,
  /* Projenin kanban kolonları (useBoardColumns): özel kolon da bir durum seçeneğidir. */
  boardColumns: l,
  boardColumnValue: x,
  titleValue: m,
  /* Doğrulama hatası (useTaskForm.errors.title): başlığın altında gösterilir. */
  titleError: h,
  isPrivateValue: p,
  isFavorite: u,
  onToggleFavorite: c,
  isWatched: d,
  onToggleWatch: N,
  onDuplicate: y,
  onCancelTask: b,
  onDelete: j,
  onOpenTransfer: w,
  onExportPdf: S,
  /* Yetki (root hesaplar; sunucudaki EnsureCanMutateTaskAsync ile aynı kural). Eskiden
     menü ve alanlar herkese açıktı, yetkisiz kullanıcı tıklayınca 403 alıyordu. */
  canEdit: P = !0,
  canChangeStatus: q = !0,
  canDelete: I = !0
}) {
  const [Q, G] = f.useState(!1), [Y, z] = f.useState(null), [R, V] = f.useState(!1), O = f.useRef(null), _ = f.useId(), X = Fe(Y), Z = n ?? t.status, D = Ea(l), M = Ba(
    D,
    Z,
    x === void 0 ? t.boardColumnId : x
  ), U = { ...be(Z), ...M ? { label: M.label } : {} }, ae = ($) => {
    o("status", $.status), o("boardColumnId", $.boardColumnId);
  }, ie = t.code || "GRV-—", oe = () => {
    var $;
    ($ = navigator.clipboard) == null || $.writeText(ie), G(!0), setTimeout(() => G(!1), 1800);
  }, se = () => {
    var $, ee, C, g;
    ($ = navigator.clipboard) == null || $.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), (g = (C = (ee = window == null ? void 0 : window.abp) == null ? void 0 : ee.notify) == null ? void 0 : C.success) == null || g.call(C, "Görev bağlantısı panoya kopyalandı.");
  }, H = ($) => () => {
    V(!1), $ == null || $();
  }, ce = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", onClick: H(se) },
    { label: "Çoğalt", icon: "fa-copy", allowed: P, onClick: H(y) },
    { label: "Başka projeye kopyala", icon: "fa-clone", allowed: P, onClick: H(() => w == null ? void 0 : w("copy")) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, allowed: P, onClick: H(() => w == null ? void 0 : w("move")) },
    { label: d ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: H(N) },
    { label: "Görevi iptal et", icon: "fa-ban", separator: !0, allowed: q && t.status !== 0, onClick: H(b) },
    { label: "Yazdır", icon: "fa-print", kbd: "Ctrl P", onClick: H(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: H(S) },
    { label: "Sil", icon: "fa-trash-can", separator: !0, danger: !0, allowed: I, onClick: H(j) }
  ].filter(($) => $.allowed !== !1);
  return /* @__PURE__ */ e.jsxs("header", { ref: z, className: "shrink-0 px-6 lt-860:px-4 pt-[18px] pb-4 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: oe,
            title: "Kodu kopyala",
            className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[11px] font-bold tracking-[.04em] cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[9px] opacity-70" }),
              /* @__PURE__ */ e.jsx("span", { children: ie }),
              /* @__PURE__ */ e.jsx("i", { className: `${Q ? "fa-solid fa-check" : "fa-regular fa-copy"} text-[9px] opacity-60` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(Ce, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(De, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              disabled: !P,
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] border border-default text-[12px] font-semibold ${P ? "cursor-pointer" : "cursor-default"} ${U.bg} ${U.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-current animate-pulse" }),
                /* @__PURE__ */ e.jsx("span", { children: U.label }),
                P && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(Te, { container: X, children: /* @__PURE__ */ e.jsxs(Se, { sideOffset: 6, align: "start", className: `${ca} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            D.map(($) => {
              const ee = (M == null ? void 0 : M.key) === $.key;
              return /* @__PURE__ */ e.jsx(xn, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => ae($),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${ee ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${$.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: $.label }),
                    ee && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, $.key);
            })
          ] }) })
        ] }),
        d && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 h-[26px] px-2.5 rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11.5px] font-semibold", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-eye text-[10px]" }),
          "Takip ediliyor"
        ] }),
        !P && /* @__PURE__ */ e.jsxs(
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
            onChange: ($) => o("isPrivate", $),
            disabled: !P
          }
        ) }),
        /* @__PURE__ */ e.jsx("div", { className: "h-5 w-px bg-border-default mx-1" }),
        s === "modal" && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: i,
            title: r ? "Küçült" : "Tam ekran",
            className: `mobile:hidden flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${r ? "bg-primary-subtle text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r ? "fa-compress" : "fa-expand"} text-[12px]` })
          }
        ),
        /* @__PURE__ */ e.jsxs(Ce, { modal: !0, open: R, onOpenChange: V, children: [
          /* @__PURE__ */ e.jsx(De, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer seçenekler",
              className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${R ? "bg-surface-hover text-text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(Te, { container: X, children: /* @__PURE__ */ e.jsxs(
            Se,
            {
              sideOffset: 6,
              align: "end",
              collisionBoundary: X ?? [],
              collisionPadding: 12,
              className: `${ca} w-[244px]`,
              children: [
                ce.map(($) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: $.onClick,
                    className: [
                      cn,
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
                  dn.map(($) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: $.what }),
                    /* @__PURE__ */ e.jsx(un, { children: $.key })
                  ] }, $.what))
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
          ref: O,
          role: "textbox",
          "aria-label": ue("Tasks:Detail:TitleLabel", "Görev başlığı"),
          "aria-readonly": !P || void 0,
          "aria-invalid": !!h || void 0,
          "aria-describedby": h ? _ : void 0,
          contentEditable: P,
          suppressContentEditableWarning: !0,
          spellCheck: !1,
          onInput: P ? ($) => o("title", $.currentTarget.textContent.trim()) : void 0,
          onBlur: P ? ($) => o("title", $.currentTarget.textContent.trim()) : void 0,
          className: `flex-1 min-w-0 text-[24px] lt-560:text-[20px] font-extrabold tracking-[-.025em] leading-[1.2] text-text-primary px-2 -ml-2 py-[3px] rounded-[9px] border ${h ? "border-negative" : "border-transparent"} ${P ? `cursor-text hover:bg-neutral-subtle focus:bg-neutral-subtle focus:shadow-focus focus:outline-none ${h ? "" : "hover:border-subtle focus:border-focus"}` : ""}`,
          children: m ?? t.title ?? "Başlıksız görev"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: c,
          title: u ? "Favorilerden çıkar" : "Favorilere ekle",
          className: `flex items-center justify-center h-8 w-8 shrink-0 rounded-[9px] cursor-pointer ${u ? "bg-warning-subtle text-warning" : "text-text-tertiary hover:bg-surface-hover"}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${u ? "solid" : "regular"} fa-star text-[15px]` })
        }
      )
    ] }),
    h && /* @__PURE__ */ e.jsx("p", { id: _, role: "alert", className: "mt-1 mb-0 text-[12px] font-semibold text-negative", children: h })
  ] });
}
const it = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", da = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function Ne({ children: t }) {
  return /* @__PURE__ */ e.jsx(zt, { asChild: !0, children: t });
}
function ye({ label: t, children: s }) {
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
      style: { height: s, width: s, background: Xe(t), fontSize: s * 0.38 },
      children: Ze(t)
    }
  );
}
function ua(t) {
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
  statusValue: i,
  /* Projenin kanban kolonları (useBoardColumns): özel kolon da bir durum seçeneğidir. */
  boardColumns: o,
  boardColumnValue: n,
  priorityValue: l,
  assigneeValue: x,
  projectValue: m,
  dueDateValue: h,
  startDateValue: p,
  tagsValue: u = [],
  progressPercent: c = 0,
  progressNote: d = "",
  onOpenTransfer: N,
  /* Düzenleme yetkisi yoksa ızgara salt okunur: tüm alanlar forma, oradan UpdateAsync'e
     gider; yetkisiz kullanıcı değiştirip Kaydet'te 403 alıyordu. */
  readOnly: y = !1,
  /* Doğrulama hataları (useTaskForm.errors): ilgili hücrenin altında gösterilir. */
  startDateError: b,
  dueDateError: j
}) {
  var C, g;
  const w = f.useId(), S = f.useId(), [P, q] = f.useState(""), [I, Q] = f.useState(""), [G, Y] = f.useState(""), [z, R] = f.useState(!1), [V, O] = f.useState(null), _ = i ?? t.status, X = Ea(o), Z = Ba(
    X,
    _,
    n === void 0 ? t.boardColumnId : n
  ), D = { ...be(_), ...Z ? { label: Z.label } : {} }, M = (v) => {
    r("status", v.status), r("boardColumnId", v.boardColumnId);
  }, U = ft(l ?? t.priority), ae = x ?? t.assigneeId ?? null, ie = m ?? t.projectId ?? null, oe = ((C = s.find((v) => v.value === ae)) == null ? void 0 : C.label) || t.assigneeName || "Atanmamış", se = ((g = a.find((v) => v.value === ie)) == null ? void 0 : g.label) || t.projectName || "Projesiz", H = $a(h ?? t.dueDate), ce = s.filter(
    (v) => !P || v.label.toLowerCase().includes(P.toLowerCase())
  ), $ = a.filter(
    (v) => !I || v.label.toLowerCase().includes(I.toLowerCase())
  ), ee = () => {
    const v = G.trim();
    v && !u.includes(v) && r("tagNames", [...u, v]), Y(""), R(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { ref: O, className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsx(
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
                /* @__PURE__ */ e.jsx(xa, { name: ae ? oe : null }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: oe }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(Te, { container: Fe(V), children: /* @__PURE__ */ e.jsxs(Se, { sideOffset: 6, align: "start", className: `${it} w-[264px]`, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: P,
                  onChange: (v) => q(v.target.value),
                  placeholder: "Kişi ara…",
                  className: da
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[230px] overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
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
              ce.map((v) => /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("assigneeId", v.value),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${ae === v.value ? "bg-primary-subtle" : "hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx(xa, { name: v.label, size: 24 }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: v.label }),
                    ae === v.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
                  ]
                }
              ) }, v.value))
            ] })
          ] }) })
        ] }) }),
        /* @__PURE__ */ e.jsxs(ye, { label: "Son tarih", children: [
          /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-regular fa-calendar text-[13px] ${H.tone}` }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "date",
                value: (h ?? t.dueDate ?? "").slice(0, 10),
                onChange: (v) => r("dueDate", v.target.value),
                "aria-label": "Son tarih",
                "aria-invalid": !!j || void 0,
                "aria-describedby": j ? w : void 0,
                className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
              }
            )
          ] }),
          j ? /* @__PURE__ */ e.jsx("span", { id: w, role: "alert", className: "-mt-0.5 text-[10.5px] font-semibold text-negative", children: j }) : H.hint && /* @__PURE__ */ e.jsx("span", { className: `-mt-0.5 text-[10.5px] font-semibold ${H.tone}`, children: H.hint })
        ] }),
        /* @__PURE__ */ e.jsxs(ye, { label: "Başlangıç", children: [
          /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[13px] text-text-tertiary" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "date",
                value: (p ?? t.startDate ?? "").slice(0, 10),
                onChange: (v) => r("startDate", v.target.value),
                "aria-label": "Başlangıç",
                "aria-invalid": !!b || void 0,
                "aria-describedby": b ? S : void 0,
                className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
              }
            )
          ] }),
          b && /* @__PURE__ */ e.jsx("span", { id: S, role: "alert", className: "-mt-0.5 text-[10.5px] font-semibold text-negative", children: b })
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
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${D.bg} ${D.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${D.icon} text-[11px]` }),
                /* @__PURE__ */ e.jsx("span", { children: D.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(Te, { container: Fe(V), children: /* @__PURE__ */ e.jsxs(Se, { sideOffset: 6, align: "start", className: `${it} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            X.map((v) => {
              const F = (Z == null ? void 0 : Z.key) === v.key;
              return /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => M(v),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${F ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${v.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: v.label }),
                    F && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, v.key);
            })
          ] }) })
        ] }) }) }),
        /* @__PURE__ */ e.jsx(ye, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(Ce, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(De, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${U.bg} ${U.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${U.icon} text-[11px]` }),
                /* @__PURE__ */ e.jsx("span", { children: U.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(Te, { container: Fe(V), children: /* @__PURE__ */ e.jsxs(Se, { sideOffset: 6, align: "start", className: `${it} w-[184px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
            ks.map((v) => {
              const F = Cs[v], B = (l ?? t.priority) === v;
              return /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("priority", v),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${B ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${F.icon} text-[11px] w-[13px]` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: F.label }),
                    B && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, v);
            })
          ] }) })
        ] }) }) }),
        /* @__PURE__ */ e.jsx(ye, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap min-h-8", children: [
          u.map((v) => /* @__PURE__ */ e.jsxs(
            "span",
            {
              className: "inline-flex items-center gap-1.5 h-6 px-2 rounded-[7px] border border-primary bg-primary-subtle text-primary text-[11.5px] font-bold",
              children: [
                /* @__PURE__ */ e.jsx("span", { children: v }),
                !y && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Etiketi kaldır",
                    onClick: () => r("tagNames", u.filter((F) => F !== v)),
                    className: "flex items-center p-0 border-0 bg-transparent text-current opacity-55 hover:opacity-100 hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
                  }
                )
              ]
            },
            v
          )),
          y ? u.length === 0 && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "—" }) : z ? /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: G,
              onChange: (v) => Y(v.target.value),
              onBlur: ee,
              onKeyDown: (v) => {
                v.key === "Enter" && ee(), v.key === "Escape" && (Y(""), R(!1));
              },
              placeholder: "Etiket…",
              className: "h-6 w-24 px-2 rounded-[7px] border border-focus bg-surface-base text-text-primary text-[11.5px] shadow-focus focus:outline-none"
            }
          ) : /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              "aria-label": "Yeni etiket ekle",
              onClick: () => R(!0),
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
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: se }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(Te, { container: Fe(V), children: /* @__PURE__ */ e.jsxs(Se, { sideOffset: 6, align: "start", className: `${it} w-[250px]`, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: I,
                  onChange: (v) => Q(v.target.value),
                  placeholder: "Proje ara…",
                  className: da
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[210px] overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
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
              $.map((v) => /* @__PURE__ */ e.jsx(Ne, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("projectId", v.value),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${ie === v.value ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-primary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: v.label }),
                    ie === v.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
                  ]
                }
              ) }, v.value))
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
const fn = "z-popover w-[225px] rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto";
function qt({ entries: t = [], onPick: s, children: a }) {
  const [r, i] = f.useState(null), o = Fe(r);
  return /* @__PURE__ */ e.jsx("span", { ref: i, className: "contents", children: /* @__PURE__ */ e.jsxs(Ce, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(De, { asChild: !0, children: a }),
    /* @__PURE__ */ e.jsx(Te, { container: o, children: /* @__PURE__ */ e.jsxs(Se, { sideOffset: 6, align: "start", collisionPadding: 12, className: fn, children: [
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
function bn({
  activeTab: t,
  onTabChange: s,
  orderedTabs: a = [],
  draggingCode: r,
  onDragStart: i,
  onDragEnd: o,
  onReorderTo: n,
  onReorderDrop: l,
  pickerEntries: x = [],
  onPickFeature: m,
  counts: h = {},
  isDirty: p = !1
}) {
  const [u, c] = f.useState(!1);
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
            ...Ia(() => s(d.code)),
            onDragStart: (b) => {
              i(d.code);
              try {
                b.dataTransfer.effectAllowed = "move", b.dataTransfer.setData("text/plain", d.code);
              } catch {
              }
            },
            onDragOver: (b) => {
              b.preventDefault(), n(d.code);
            },
            onDrop: (b) => {
              b.preventDefault(), l == null || l();
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
      /* @__PURE__ */ e.jsx(qt, { entries: x, onPick: m, children: /* @__PURE__ */ e.jsxs(
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
            u ? "px-[13px]" : "px-[11px]"
          ].join(" "),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            u && /* @__PURE__ */ e.jsx("span", { className: "animate-fade-in-fast", children: "Özellik ekle" })
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
  onDragStart: i,
  onDragEnd: o,
  onReorderTo: n,
  onReorderDrop: l,
  pickerEntries: x = [],
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
          const u = t === p.code, c = h[p.code] || 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              draggable: !0,
              title: "Sürükleyerek sırayı değiştirin",
              ...Ia(() => s(p.code)),
              onDragStart: (d) => {
                i(p.code);
                try {
                  d.dataTransfer.effectAllowed = "move", d.dataTransfer.setData("text/plain", p.code);
                } catch {
                }
              },
              onDragOver: (d) => {
                d.preventDefault(), n(p.code);
              },
              onDrop: (d) => {
                d.preventDefault(), l == null || l();
              },
              onDragEnd: o,
              className: [
                "flex shrink-0 items-center gap-[11px] h-9 px-[11px] rounded-[9px]",
                "text-[12.5px] text-left cursor-grab active:cursor-grabbing",
                "transition-opacity duration-fast",
                u ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
                r === p.code ? "opacity-35" : "opacity-100"
              ].join(" "),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${p.icon} text-[12px] w-[15px] opacity-85` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: p.title }),
                c > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                  "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                  "rounded-full text-[10px] font-extrabold",
                  u ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
                ].join(" "), children: c })
              ]
            },
            p.code
          );
        }),
        /* @__PURE__ */ e.jsx(qt, { entries: x, onPick: m, children: /* @__PURE__ */ e.jsxs(
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
          style: { background: Xe(a) },
          children: Ze(a)
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
function yn({ task: t = {}, nameById: s }) {
  const a = (o, n) => {
    var l;
    return o || n && ((l = s == null ? void 0 : s.get) == null ? void 0 : l.call(s, n)) || null;
  }, r = a(t.creatorName, t.creatorId), i = t.lastModificationTime ? a(t.lastModifierName, t.lastModifierId) : null;
  return /* @__PURE__ */ e.jsx("aside", { className: "flex flex-col gap-3.5 min-w-0", children: /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsx(Ie, { label: "Oluşturan", value: r || "Bilinmiyor", avatarName: r }),
    /* @__PURE__ */ e.jsx(Ie, { label: "Oluşturma tarihi", value: pa(t.creationTime) }),
    /* @__PURE__ */ e.jsx(Ie, { label: "Güncelleyen", value: i || "—", avatarName: i }),
    /* @__PURE__ */ e.jsx(Ie, { label: "Son güncelleme", value: pa(t.lastModificationTime) }),
    /* @__PURE__ */ e.jsx(Ie, { label: "Görev tipi", value: t.taskType }),
    /* @__PURE__ */ e.jsx(Ie, { label: "Sprint", value: t.sprint }),
    /* @__PURE__ */ e.jsx(Ie, { label: "İzleyenler", value: (t.watcherNames || []).join(", ") || "Kimse izlemiyor" })
  ] }) });
}
const ma = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
function kt({ name: t, size: s = 32 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: s, width: s, background: Xe(t), fontSize: s * 0.34 },
      children: Ze(t)
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
const Ve = (t) => [t == null ? void 0 : t.name, t == null ? void 0 : t.surname].filter(Boolean).join(" ") || (t == null ? void 0 : t.userName) || "", mt = "📎 ";
function gn({ text: t, attachments: s }) {
  const a = String(t ?? "").split(`
`);
  return /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[13px] leading-[1.65] text-text-secondary whitespace-pre-wrap", children: a.map((r, i) => {
    const o = r.startsWith(mt) ? r.slice(mt.length).trim() : null, n = o ? s.find((l) => l.fileName === o) : null;
    return /* @__PURE__ */ e.jsxs(Le.Fragment, { children: [
      i > 0 && `
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
    ] }, i);
  }) });
}
const ba = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function vn({
  task: t = {},
  onFieldChange: s = () => {
  },
  descriptionValue: a,
  checklist: r,
  currentUserName: i = "Ben",
  /* Düzenleme yetkisi yoksa açıklama ve kontrol listesi salt okunur. Yorumlar açık
     kalır: görevi görebilen herkes yorum yazabilir (ürün kararı, 2026-09-28). */
  readOnly: o = !1
}) {
  const n = t == null ? void 0 : t.id, l = ne(), [x, m] = f.useState(!0), [h, p] = f.useState(""), u = (r == null ? void 0 : r.items) ?? [], c = u.filter((g) => g.isDone).length, d = u.length ? Math.round(c / u.length * 100) : 0, N = async () => {
    const g = h.trim();
    if (!(!g || !n)) {
      p("");
      try {
        await r.addItem(g);
      } catch (v) {
        p((F) => F || g), E(v, "Madde eklenemedi.");
      }
    }
  }, [y, b] = f.useState(!0), [j, w] = f.useState(""), [S, P] = f.useState(!1), [q, I] = f.useState(!1), [Q, G] = f.useState(null), [Y, z] = f.useState(""), [R, V] = f.useState([]), [O, _] = f.useState(!1), [X, Z] = f.useState(""), { data: D, isFetched: M } = J({
    queryKey: ["task-users-lookup"],
    queryFn: () => {
      var g, v, F, B;
      return Promise.resolve((B = (F = (v = (g = window == null ? void 0 : window.apya) == null ? void 0 : g.platform) == null ? void 0 : v.tasks) == null ? void 0 : F.task) == null ? void 0 : B.getUsersLookup()).then((A) => (A == null ? void 0 : A.items) ?? []);
    },
    enabled: O,
    staleTime: 6e4,
    meta: { persist: !1 }
  }), U = X.trim().toLocaleLowerCase("tr-TR"), ae = (D ?? []).filter((g) => !U || `${Ve(g)} ${g.userName ?? ""}`.toLocaleLowerCase("tr-TR").includes(U)), ie = (g) => {
    const v = Ve(g);
    w((F) => `${F && !/\s$/.test(F) ? `${F} ` : F}@${v} `), V((F) => F.some((B) => B.id === g.id) ? F : [...F, { id: g.id, label: v }]), _(!1), Z("");
  }, { data: oe = [] } = J({
    queryKey: ["task-comments", n],
    queryFn: () => {
      var g, v, F, B;
      return Promise.resolve((B = (F = (v = (g = window == null ? void 0 : window.apya) == null ? void 0 : g.platform) == null ? void 0 : v.tasks) == null ? void 0 : F.task) == null ? void 0 : B.getComments(n));
    },
    enabled: !!n,
    staleTime: 1e4,
    meta: { persist: !1 }
  }), se = ht(n, {
    enabled: oe.some((g) => String(g.text ?? "").includes(mt))
  }), H = async (g) => {
    if (g)
      try {
        await se.upload(g), w((v) => (v && !v.endsWith(`
`) ? v + `
` : v) + mt + g.name);
      } catch (v) {
        E(v, "Dosya eklenemedi.");
      }
  }, ce = async () => {
    await l.invalidateQueries({ queryKey: ["task-comments", n] }), await l.invalidateQueries({ queryKey: ["task-detail", n] });
  }, $ = async () => {
    const g = j.trim();
    if (!(!g || !n || q)) {
      I(!0);
      try {
        const v = R.filter((F) => g.includes(`@${F.label}`)).map((F) => F.id);
        await Promise.resolve(window.apya.platform.tasks.task.addComment(n, g, v)), await ce(), w(""), V([]);
      } catch (v) {
        E(v, "Yorum gönderilemedi.");
      } finally {
        I(!1);
      }
    }
  }, ee = async (g) => {
    const v = Y.trim();
    if (!(!v || !n))
      try {
        let F = [];
        v.includes("@") && (F = (await l.fetchQuery({
          queryKey: ["task-users-lookup"],
          queryFn: () => {
            var A, K, xe, Re;
            return Promise.resolve((Re = (xe = (K = (A = window == null ? void 0 : window.apya) == null ? void 0 : A.platform) == null ? void 0 : K.tasks) == null ? void 0 : xe.task) == null ? void 0 : Re.getUsersLookup()).then((qe) => (qe == null ? void 0 : qe.items) ?? []);
          },
          staleTime: 6e4
        }) ?? []).filter((A) => {
          const K = Ve(A);
          return K && v.includes(`@${K}`);
        }).map((A) => A.id)), await Promise.resolve(window.apya.platform.tasks.task.replyToComment(g, v, F)), await ce(), z(""), G(null);
      } catch (F) {
        E(F, "Yanıt gönderilemedi.");
      }
  }, C = !!j.trim() && !q;
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
            c,
            "/",
            u.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(fa, { label: "Kontrol listesi", open: x, onClick: () => m((g) => !g) })
      ] }),
      x && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 mt-3.5", children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
            style: { width: `${d}%` }
          }
        ) }),
        u.map((g) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              disabled: o,
              "aria-label": g.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
              onClick: () => r.toggleItem(g.id).catch((v) => E(v, "Durum güncellenemedi.")),
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
              onClick: () => r.removeItem(g.id).catch((v) => E(v, "Madde silinemedi.")),
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
    /* @__PURE__ */ e.jsxs("section", { className: ma, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Yorumlar & güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: oe.length })
        ] }),
        /* @__PURE__ */ e.jsx(fa, { label: "Yorumlar", open: y, onClick: () => b((g) => !g) })
      ] }),
      y && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(kt, { name: i }),
          /* @__PURE__ */ e.jsxs("div", { className: `flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${S ? "border-focus bg-surface-base shadow-focus" : "border-default bg-surface-raised"}`, children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                rows: 2,
                value: j,
                onChange: (g) => w(g.target.value),
                onFocus: () => P(!0),
                onBlur: () => P(!1),
                onKeyDown: (g) => {
                  g.key === "Enter" && (g.ctrlKey || g.metaKey) && (g.preventDefault(), $());
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
                    "aria-expanded": O,
                    onMouseDown: (g) => g.preventDefault(),
                    onClick: () => _((g) => !g),
                    className: `flex items-center justify-center h-7 w-7 rounded-[7px] hover:bg-surface-hover hover:text-primary cursor-pointer ${O ? "text-primary" : "text-text-tertiary"}`,
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
                            var v;
                            H((v = g.target.files) == null ? void 0 : v[0]), g.target.value = "";
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
                    onMouseDown: (v) => v.preventDefault(),
                    onClick: () => w((v) => v + g.add),
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
                  onClick: $,
                  disabled: !C,
                  className: `flex items-center gap-[7px] h-[30px] px-3.5 rounded-[9px] text-[12px] font-bold shadow-xs ${C ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${q ? "fa-circle-notch fa-spin" : "fa-paper-plane"} text-[10px]` }),
                    "Gönder"
                  ]
                }
              )
            ] })
          ] }),
          O && /* @__PURE__ */ e.jsxs(
            "div",
            {
              role: "dialog",
              "aria-label": "Bahsedilecek kişi",
              onBlur: (g) => {
                g.currentTarget.contains(g.relatedTarget) || _(!1);
              },
              className: "absolute left-[43px] top-full z-20 mt-1 w-64 min-w-[200px] max-w-[calc(100%-43px)] rounded-[11px] border border-default bg-surface-base p-1.5 shadow-lg",
              children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: X,
                    onChange: (g) => Z(g.target.value),
                    onKeyDown: (g) => {
                      g.key === "Escape" && (g.preventDefault(), _(!1)), g.key === "Enter" && ae[0] && (g.preventDefault(), ie(ae[0]));
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
                        Ve(g),
                        g.userName && Ve(g) !== g.userName && /* @__PURE__ */ e.jsxs("span", { className: "ml-1 text-[11px] text-text-tertiary", children: [
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
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1", children: oe.map((g) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start py-3 border-t border-subtle", children: [
          /* @__PURE__ */ e.jsx(kt, { name: g.authorName }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: g.authorName }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: ba(g.creationTime) })
            ] }),
            /* @__PURE__ */ e.jsx(gn, { text: g.text, attachments: se.attachments }),
            /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1.5 mt-[3px]", children: /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  G((v) => v === g.id ? null : g.id), z("");
                },
                className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-full text-text-tertiary text-[11px] font-semibold hover:bg-surface-hover hover:text-primary cursor-pointer",
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                  "Yanıtla"
                ]
              }
            ) }),
            Q === g.id && /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 mt-2 animate-fade-in-fast", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: Y,
                  onChange: (v) => z(v.target.value),
                  onKeyDown: (v) => {
                    v.key === "Enter" && ee(g.id);
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
            (g.replies ?? []).map((v) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] mt-2.5 pl-3 border-l-2 border-default", children: [
              /* @__PURE__ */ e.jsx(kt, { name: v.authorName, size: 24 }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: v.authorName }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: ba(v.creationTime) })
                ] }),
                /* @__PURE__ */ e.jsx("p", { className: "mt-[3px] mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: v.text })
              ] })
            ] }, v.id))
          ] })
        ] }, g.id)) })
      ] })
    ] })
  ] });
}
function jn({
  lastSavedAt: t,
  isDirty: s,
  isSaving: a,
  justSaved: r,
  onCancel: i,
  onSave: o,
  sticky: n = !1
}) {
  const l = t ? new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(t)) : "—", x = a ? "fa-solid fa-circle-notch fa-spin" : r ? "fa-solid fa-check" : "fa-regular fa-floppy-disk", m = a ? "Kaydediliyor…" : r ? "Kaydedildi" : "Kaydet", h = s && !a;
  return /* @__PURE__ */ e.jsxs("footer", { className: `${n ? "sticky bottom-0 z-10 " : ""}shrink-0 flex items-center justify-between gap-4 px-6 lt-860:px-4 py-3.5 border-t border-subtle bg-surface-base`, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5 min-w-0 lt-560:hidden", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] text-[11.5px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock text-[11px]" }),
        "Son kayıt: ",
        /* @__PURE__ */ e.jsx("strong", { className: "font-semibold text-text-secondary", children: l })
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
          onClick: i,
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
            m
          ]
        }
      )
    ] })
  ] });
}
const Nn = Object.fromEntries(et.map((t) => [t.code, t])), wn = {
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
  const s = Nn[t], a = wn[t];
  return s ? {
    code: t,
    title: s.title,
    icon: s.icon,
    desc: (a == null ? void 0 : a.desc) ?? "",
    bg: (a == null ? void 0 : a.bg) ?? "bg-neutral-subtle",
    fg: (a == null ? void 0 : a.fg) ?? "text-text-secondary"
  } : null;
}
et.filter((t) => !t.hidden).length;
function ha({ code: t, onRemoveFeature: s, pickerEntries: a = [], onPickFeature: r, canRemove: i = !0 }) {
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
      i && /* @__PURE__ */ e.jsxs(
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
      /* @__PURE__ */ e.jsx(qt, { entries: a, onPick: r, children: /* @__PURE__ */ e.jsxs(
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
      onOpenChange: (i) => {
        i || s == null || s();
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
const Tn = [
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
function Sn({ on: t, onClick: s, label: a }) {
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
function $n({
  open: t,
  mode: s = "move",
  onClose: a,
  onConfirm: r,
  projectOptions: i = [],
  currentProjectId: o,
  counts: n = {},
  onCreateProject: l
}) {
  const [x, m] = f.useState(s), [h, p] = f.useState([]), [u, c] = f.useState(""), [d, N] = f.useState(""), [y, b] = f.useState(ya), [j, w] = f.useState(!1);
  f.useEffect(() => {
    t && (m(s), p([]), c(""), N(""), b(ya));
  }, [t, s]);
  const S = f.useMemo(
    () => i.filter((D) => D.value && D.value !== o),
    [i, o]
  ), P = S.filter((D) => !u || D.label.toLowerCase().includes(u.toLowerCase())), q = S.length > 0 && h.length === S.length;
  if (!t) return null;
  const I = (D) => p((M) => M.includes(D) ? M.filter((U) => U !== D) : [...M, D]), Q = (D) => {
    var M;
    return ((M = i.find((U) => U.value === D)) == null ? void 0 : M.label) ?? "";
  }, G = async () => {
    const D = d.trim();
    if (!(!D || j)) {
      w(!0);
      try {
        const M = await (l == null ? void 0 : l(D));
        M && p((U) => [...U, M]), N("");
      } catch (M) {
        E(M, "Proje oluşturulamadı.");
      } finally {
        w(!1);
      }
    }
  }, Y = async () => {
    if (!(!h.length || j)) {
      w(!0);
      try {
        await (r == null ? void 0 : r({ mode: x, targetProjectIds: h, include: y }));
      } finally {
        w(!1);
      }
    }
  }, z = x === "move", R = h.length, V = z ? R > 1 ? "Taşı ve kopyala" : "Taşı" : R > 1 ? `${R} projeye kopyala` : "Kopyala", O = Object.values(y).filter(Boolean).length, _ = h.map(Q).filter(Boolean), X = _.length ? `${_.length > 2 ? `${_.slice(0, 2).join(", ")} +${_.length - 2}` : _.join(", ")} · ${O} seçenek açık` : `Proje seçilmedi · ${O} seçenek açık`, Z = (D) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${D ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return /* @__PURE__ */ e.jsx(Wa, { open: t, onClose: a, label: z ? "Başka projeye taşı" : "Başka projelere kopyala", children: /* @__PURE__ */ e.jsx(
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
          "aria-label": z ? "Başka projeye taşı" : "Başka projelere kopyala",
          onClick: (D) => D.stopPropagation(),
          className: "flex flex-col w-full max-w-[760px] max-h-[88vh] rounded-[20px] border border-default bg-surface-base shadow-xl overflow-hidden animate-dialog-in",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-4 px-[22px] pt-5 pb-4 border-b border-subtle", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-10 w-10 rounded-[13px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-tree text-base" }) }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsx("h3", { className: "m-0 text-base font-extrabold tracking-[-.02em] text-text-primary", children: z ? "Başka projeye taşı" : "Başka projelere kopyala" }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 mb-0 text-[12px] leading-[1.5] text-text-tertiary", children: z ? "Görev ilk seçtiğiniz projeye taşınır; birden fazla seçerseniz kalanlara kopya oluşturulur." : "Görevin kopyası seçtiğiniz her projede oluşturulur; bu görev yerinde kalır." })
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
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => m("move"), className: Z(z), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[10px]" }),
                "Taşı"
              ] }),
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => m("copy"), className: Z(!z), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clone text-[10px]" }),
                "Kopyala"
              ] })
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 grid grid-cols-2 lt-860:grid-cols-1 gap-5 items-start px-[22px] pt-4 pb-5 overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px] min-w-0", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5", children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.08em] text-text-tertiary", children: [
                    "Hedef projeler · ",
                    R
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => p(q ? [] : S.map((D) => D.value)),
                      className: "p-0 border-0 bg-transparent text-primary text-[11px] font-bold cursor-pointer hover:underline",
                      children: q ? "Seçimi temizle" : "Tümünü seç"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: u,
                      onChange: (D) => c(D.target.value),
                      placeholder: "Proje ara…",
                      className: "w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar", children: [
                  P.map((D) => {
                    const M = h.includes(D.value), U = z && h[0] === D.value;
                    return /* @__PURE__ */ e.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => I(D.value),
                        className: `flex items-center gap-[11px] px-3 py-[11px] rounded-[11px] border text-left cursor-pointer hover:border-focus ${M ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                        children: [
                          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] rounded-[5px] border-[1.5px] text-white ${M ? "bg-primary border-primary" : "bg-transparent border-strong"}`, children: M && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" }) }),
                          /* @__PURE__ */ e.jsx("span", { className: "h-2.5 w-2.5 shrink-0 rounded-[3px] bg-primary" }),
                          /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: D.label }),
                          U && /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center h-5 px-2 rounded-md bg-primary text-white text-[10px] font-extrabold", children: "TAŞINACAK" })
                        ]
                      },
                      D.value
                    );
                  }),
                  P.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "py-6 text-center text-[12px] text-text-tertiary", children: "Uygun proje bulunamadı." })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[7px] mt-1", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: d,
                      onChange: (D) => N(D.target.value),
                      onKeyDown: (D) => {
                        D.key === "Enter" && (D.preventDefault(), G());
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
                      onClick: G,
                      disabled: !d.trim() || j,
                      className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-plus text-[12px]" })
                    }
                  )
                ] }),
                z && R > 1 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle", children: [
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
                      onClick: () => b((M) => ({ ...M, [D.key]: !M[D.key] }))
                    }
                  )
                ] }, D.key)) })
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
                    onClick: Y,
                    disabled: !R || j,
                    className: `flex items-center gap-2 h-9 px-5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${R && !j ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${j ? "fa-circle-notch fa-spin" : "fa-arrow-right"} text-[10px]` }),
                      V
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
], Oe = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  img: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
};
function En(t = "") {
  var a;
  const s = (a = t.split(".").pop()) == null ? void 0 : a.toLowerCase();
  return s === "pdf" ? Oe.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(s) ? Oe.img : ["doc", "docx", "odt", "rtf"].includes(s) ? Oe.doc : ["json", "js", "ts", "cs", "xml", "yml", "yaml"].includes(s) ? Oe.code : Oe.other;
}
const Bn = (t) => t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : "—", In = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—", Fn = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—";
function Ct({ name: t, size: s = 22 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: s, width: s, background: Xe(t), fontSize: s * 0.4 },
      children: Ze(t)
    }
  );
}
function lt({ label: t, children: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: t }),
    s
  ] });
}
function An({
  subtaskId: t,
  parentCode: s,
  onClose: a,
  onOpenFull: r,
  onDeleted: i,
  currentUserName: o = "Ben"
}) {
  var ce, $, ee;
  const n = ne(), { data: l } = Lt(t), x = Rt(t), m = ht(t), [h, p] = f.useState("general"), [u, c] = f.useState(""), [d, N] = f.useState(""), [y, b] = f.useState(""), j = f.useRef(null), w = f.useRef(null);
  l && w.current !== l.id && (w.current = l.id, c(l.description ?? ""));
  const { data: S = [] } = J({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var C, g, v, F;
      return Promise.resolve((F = (v = (g = (C = window == null ? void 0 : window.apya) == null ? void 0 : C.platform) == null ? void 0 : g.tasks) == null ? void 0 : v.task) == null ? void 0 : F.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4,
    meta: { persist: !1 }
  });
  if (f.useEffect(() => {
    const C = (g) => {
      g.key === "Escape" && (g.stopPropagation(), a == null || a());
    };
    return window.addEventListener("keydown", C), () => window.removeEventListener("keydown", C);
  }, [a]), !l) return null;
  const { canEdit: P, canChangeStatus: q, canDelete: I } = We(l), Q = (ee = ($ = (ce = window == null ? void 0 : window.apya) == null ? void 0 : ce.platform) == null ? void 0 : $.tasks) == null ? void 0 : ee.task, G = be(l.status), Y = ft(l.priority), z = x.items ?? [], R = z.filter((C) => C.isDone).length, V = z.length ? Math.round(R / z.length * 100) : 0, O = m.attachments ?? [], _ = { checklist: z.length, comments: S.length, files: O.length }, X = async () => {
    await n.invalidateQueries({ queryKey: ["task-detail", t] });
  }, Z = async (C) => {
    try {
      await Promise.resolve(C()), await X();
    } catch (g) {
      E(g, "Alt görev güncellenemedi.");
    }
  }, D = (C) => Z(() => Q.update(l.id, Bt(l, C))), M = () => Z(() => Q.updateStatus(l.id, l.status >= 4 ? 1 : l.status + 1)), U = () => Z(() => Q.setPriority(l.id, l.priority >= 4 ? 1 : l.priority + 1)), ae = () => {
    (l.description ?? "") !== u && D({ description: u || null });
  }, ie = async () => {
    const C = d.trim();
    if (C) {
      N("");
      try {
        await x.addItem(C);
      } catch (g) {
        E(g, "Madde eklenemedi.");
      }
    }
  }, oe = async () => {
    const C = y.trim();
    if (C) {
      b("");
      try {
        await Promise.resolve(Q.addComment(l.id, C)), await n.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch (g) {
        E(g, "Yorum gönderilemedi.");
      }
    }
  }, se = async () => {
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(Q.delete(l.id)), i == null || i(l.id), a == null || a();
      } catch (C) {
        E(C, "Alt görev silinemedi.");
      }
  }, H = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
  return /* @__PURE__ */ e.jsxs(Wa, { open: !0, onClose: a, label: `${l.code} alt görev detayı`, children: [
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
        "aria-label": `${l.code} alt görev detayı`,
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
                    onClick: () => r == null ? void 0 : r(l.id),
                    className: `${H} hover:bg-surface-hover hover:text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-up-right-from-square text-[11px]" })
                  }
                ),
                I && /* @__PURE__ */ e.jsx(
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
              /* @__PURE__ */ e.jsx("span", { className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[10.5px] font-bold tracking-[.04em]", children: l.code }),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: M,
                  title: "Durumu değiştir",
                  disabled: !q,
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold ${q ? "cursor-pointer" : "cursor-default"} ${G.bg} ${G.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${G.icon} text-[10px]` }),
                    G.label
                  ]
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: U,
                  title: "Önceliği değiştir",
                  disabled: !P,
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold ${P ? "cursor-pointer" : "cursor-default"} ${Y.bg} ${Y.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${Y.icon} text-[10px]` }),
                    Y.label
                  ]
                }
              ),
              (l.tags ?? []).map((C) => /* @__PURE__ */ e.jsx("span", { className: "flex items-center h-6 px-[9px] rounded-[7px] border border-default bg-neutral-subtle text-text-secondary text-[11px] font-semibold", children: C.name }, C.id ?? C.name)),
              !P && /* @__PURE__ */ e.jsxs(
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
              /* @__PURE__ */ e.jsx(lt, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
                /* @__PURE__ */ e.jsx(Ct, { name: l.assigneeName }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", children: l.assigneeName || "Atanmamış" })
              ] }) }),
              /* @__PURE__ */ e.jsx(lt, { label: "Son tarih", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] h-[22px] text-[12.5px] font-semibold text-text-primary", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[11px] text-text-tertiary" }),
                Fn(l.dueDate)
              ] }) }),
              /* @__PURE__ */ e.jsx(lt, { label: "Süre", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-[22px] font-mono text-[12.5px] font-bold text-text-primary", children: [
                l.spentHours ?? 0,
                "s",
                /* @__PURE__ */ e.jsxs("span", { className: "font-medium text-text-tertiary", children: [
                  " / ",
                  l.estimatedHours != null ? `${l.estimatedHours}s` : "—"
                ] })
              ] }) }),
              /* @__PURE__ */ e.jsx(lt, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-1.5 pt-[3px]", children: [
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
                  "%",
                  V
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: "block h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("span", { className: "block h-full rounded-full bg-success", style: { width: `${V}%` } }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: Pn.map((C) => {
            const g = h === C.code, v = _[C.code] ?? 0;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => p(C.code),
                className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${g ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${C.icon} text-[11px] opacity-85` }),
                  /* @__PURE__ */ e.jsx("span", { children: C.title }),
                  v > 0 && /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-neutral-subtle text-text-tertiary text-[10px] font-extrabold", children: v })
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
                  value: u,
                  onChange: (C) => c(C.target.value),
                  onBlur: P ? ae : void 0,
                  readOnly: !P,
                  placeholder: P ? "Bu alt görevin detayları…" : "Açıklama yok.",
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
                  R,
                  "/",
                  z.length
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-success", style: { width: `${V}%` } }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px] mt-1", children: [
                z.map((C) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] border border-subtle bg-surface-base hover:border-default", children: [
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Tamamlandı işaretle",
                      onClick: () => x.toggleItem(C.id),
                      disabled: !P,
                      className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${P ? "cursor-pointer" : "cursor-default"} ${C.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
                      children: C.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[12.5px] font-semibold ${C.isDone ? "line-through text-text-tertiary" : "text-text-primary"}`, children: C.text }),
                  P && /* @__PURE__ */ e.jsx(
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
                P && /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "text",
                    value: d,
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
                    onChange: (C) => b(C.target.value),
                    onKeyDown: (C) => {
                      C.key === "Enter" && !C.shiftKey && (C.preventDefault(), oe());
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
              S.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-[7px] py-7 rounded-xl border border-dashed border-default", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-comments text-xl text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Henüz yorum yok" })
              ] }) : S.map((C) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 items-start p-3 rounded-xl border border-subtle bg-surface-base", children: [
                /* @__PURE__ */ e.jsx(Ct, { name: C.authorName, size: 28 }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: C.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: In(C.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: C.text })
                ] })
              ] }, C.id))
            ] }),
            h === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  ref: j,
                  type: "file",
                  className: "hidden",
                  onChange: (C) => {
                    var v;
                    const g = (v = C.target.files) == null ? void 0 : v[0];
                    C.target.value = "", g && m.upload(g).catch((F) => E(F, "Dosya yüklenemedi."));
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
                  disabled: m.isUploading,
                  className: "flex flex-col items-center justify-center gap-[7px] p-6 rounded-[13px] border-2 border-dashed border-strong bg-surface-base cursor-pointer hover:border-focus hover:bg-primary-subtle disabled:opacity-60",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${m.isUploading ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-xl text-text-tertiary` }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: m.isUploading ? "Yükleniyor…" : "Dosya ekle" })
                  ]
                }
              ),
              O.map((C) => {
                const g = En(C.fileName);
                return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${g.bg} ${g.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${g.icon} text-[13px]` }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: C.fileName }),
                    /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                      Bn(C.fileSize),
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
                      onClick: () => m.remove(C.id).catch((v) => E(v, "Dosya silinemedi.")),
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
const Ja = "apya.taskDetail.tabOrder", zn = "taskdetail";
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
function Ln(t) {
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
        scope: zn,
        tabs: t.map((a) => ({ kind: a, ref: "", title: "" }))
      })
    }).catch(() => {
    });
  } catch {
  }
}
function Mn(t) {
  const [s, a] = f.useState(() => va() ?? ga()), [r, i] = f.useState(null);
  f.useEffect(() => {
    if (va() === null) {
      const m = ga();
      m.length && ja(m);
    }
  }, []);
  const o = f.useMemo(() => {
    const m = new Map(t.map((p) => [p.code, p])), h = [];
    for (const p of s) {
      const u = m.get(p);
      u && (h.push(u), m.delete(p));
    }
    for (const p of t)
      m.has(p.code) && h.push(p);
    return h;
  }, [t, s]), n = f.useCallback((m) => {
    a((h) => {
      const p = r;
      if (!p || p === m) return h;
      const u = h.length ? h.slice() : o.map((N) => N.code), c = u.indexOf(p), d = u.indexOf(m);
      return c === -1 || d === -1 ? h : (u.splice(c, 1), u.splice(d, 0, p), u);
    });
  }, [r, o]), l = f.useCallback((m) => i(m), []), x = f.useCallback(() => {
    i(null), a((m) => {
      const h = m.length ? m : o.map((p) => p.code);
      return Ln(h), ja(h), h;
    });
  }, [o]);
  return { orderedTabs: o, draggingCode: r, handleDragStart: l, handleDragEnd: x, reorderTo: n };
}
function Kn(t) {
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
function Rn() {
  const [t, s] = f.useState(0), a = f.useRef(null), r = f.useCallback((i) => {
    var o;
    (o = a.current) == null || o.disconnect(), a.current = null, i && (s(i.getBoundingClientRect().width), !(typeof ResizeObserver > "u") && (a.current = new ResizeObserver((n) => {
      for (const l of n) s(l.contentRect.width);
    }), a.current.observe(i)));
  }, []);
  return f.useEffect(() => () => {
    var i;
    return (i = a.current) == null ? void 0 : i.disconnect();
  }, []), [r, t];
}
const qn = 780;
function Gn(t) {
  return t > 0 && t < qn;
}
function Yn() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function _n() {
  const t = J({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: Yn,
    staleTime: 3e5,
    retry: !1
  }), s = t.data ?? [], a = Un(s), r = new Map(s.map((i) => [i.id, i.name]));
  return { options: a, nameById: r, isLoading: t.isLoading };
}
function Un(t) {
  const s = /* @__PURE__ */ new Map();
  return t.forEach((a) => s.set(a.name, (s.get(a.name) ?? 0) + 1)), t.map((a) => ({
    value: a.id,
    label: s.get(a.name) > 1 && a.code ? `${a.name} · ${a.code}` : a.name
  }));
}
function Vn(t) {
  var a, r, i;
  const s = (i = (r = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : r.projects) == null ? void 0 : i.boardColumn;
  return s ? Promise.resolve(s.getListByProject(t, { abpHandleError: !1 })) : Promise.resolve([]);
}
function On(t) {
  const s = J({
    queryKey: ["task-detail", "board-columns", t],
    queryFn: () => Vn(t),
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
function Qn(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function wa() {
  var a;
  const t = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.currentUser;
  return [t == null ? void 0 : t.name, t == null ? void 0 : t.surName].filter((r) => r && String(r).trim()).join(" ").trim() || (t == null ? void 0 : t.userName) || "Ben";
}
function Za({ taskId: t, presentation: s = "modal", onClose: a, switchToTask: r }) {
  const [i, o] = f.useState(t), { data: n, isPending: l, isError: x, error: m, refetch: h } = Lt(i), p = ne(), u = Sa(), c = La(n), d = Ma(), N = _n(), y = On(
    n != null && n.projectId && c.values.projectId === n.projectId ? n.projectId : null
  ), b = Ka(i), j = Rt(i), [w, S] = f.useState("general"), [P, q] = f.useState(!1), [I, Q] = f.useState(!1), [G, Y] = f.useState(!1), [z, R] = f.useState(null), [V, O] = f.useState(null), [_, X] = f.useState(!1), [Z, D] = f.useState(!1), [M, U] = f.useState(() => {
    try {
      return localStorage.getItem(Na) === "true";
    } catch {
      return !1;
    }
  });
  Aa(s === "page" ? null : i), Kn(s === "page" ? n == null ? void 0 : n.title : null);
  const [ae, ie] = Rn(), oe = Gn(ie), [se, H] = f.useState(null);
  n != null && n.id && n.id !== se && (H(n.id), X(!!n.isFavorite), D(!!n.isWatched)), f.useEffect(() => {
    c.isDirty ? u.markDirty() : u.markClean();
  }), f.useEffect(() => {
    const k = p.getQueryCache().subscribe((L) => {
      var le;
      L.type === "updated" && ((le = L.action) == null ? void 0 : le.type) === "invalidate" && !Is(L.query.queryKey) && W.markChanged();
    }), T = p.getMutationCache().subscribe((L) => {
      L.type === "added" && W.markChanged();
    });
    return () => {
      k(), T();
    };
  }, [p]);
  const ce = f.useCallback(() => {
    Kt(), a == null || a();
  }, [a]), $ = f.useCallback(() => {
    P || (Y(!1), u.requestClose(ce));
  }, [u, ce, P]), ee = (k) => {
    Y(!1), u.requestClose(() => (r ?? o)(k));
  }, C = f.useCallback(() => {
    U((k) => {
      const T = !k;
      try {
        localStorage.setItem(Na, String(T));
      } catch {
      }
      return T;
    });
  }, []), g = f.useMemo(
    () => Oa(b.assignedCodes),
    [b.assignedCodes]
  ), v = Mn(g), F = f.useMemo(
    () => Qa(b.assignedCodes),
    [b.assignedCodes]
  ), B = (k, T) => {
    if (T) {
      S(k);
      return;
    }
    xs(k);
  }, A = f.useMemo(() => {
    var k, T, L, le, me;
    return {
      subtasks: ((k = n == null ? void 0 : n.subTasks) == null ? void 0 : k.length) ?? 0,
      files: ((T = n == null ? void 0 : n.attachments) == null ? void 0 : T.length) ?? 0,
      dependencies: ((L = n == null ? void 0 : n.predecessorIds) == null ? void 0 : L.length) ?? 0,
      comments: ((le = n == null ? void 0 : n.comments) == null ? void 0 : le.length) ?? 0,
      checklist: ((me = j.items) == null ? void 0 : me.length) ?? 0
    };
  }, [n, j.items]), K = et.find((k) => k.code === w), xe = j.items ?? [], Re = xe.filter((k) => k.isDone).length, qe = xe.length ? Math.round(Re / xe.length * 100) : 0, Gt = f.useRef(null), [Yt, es] = f.useState(0), _t = () => c.validate() ? !0 : (pe.err(ue("Tasks:Detail:Validation:Summary", "Kaydedilemedi: işaretli alanları düzeltin.")), es((k) => k + 1), !1);
  f.useEffect(() => {
    var T, L;
    if (!Yt) return;
    const k = (T = Gt.current) == null ? void 0 : T.querySelector('[aria-invalid="true"]');
    k == null || k.focus(), (L = k == null ? void 0 : k.scrollIntoView) == null || L.call(k, { block: "nearest" });
  }, [Yt]);
  const tt = f.useCallback(async () => {
    if (!_t()) return !1;
    q(!0);
    try {
      const k = c.values, T = await Promise.resolve(window.apya.platform.tasks.task.update(i, c.toUpdateDto()));
      await p.invalidateQueries({ queryKey: ["task-detail", i] });
      const L = p.getQueryState(["task-detail", i]);
      return c.commitSaved(k, (L == null ? void 0 : L.status) === "success" ? L.data : T), W.emitResult(), Q(!0), setTimeout(() => Q(!1), 2e3), pe.ok("Görev başarıyla güncellendi."), !0;
    } catch (k) {
      return E(k, "Kaydedilemedi."), !1;
    } finally {
      q(!1);
    }
  }, [i, c, p]), ts = () => {
    Y(!1), u.resolvePendingClose("stay");
  }, as = () => {
    Y(!1), c.reset(), u.resolvePendingClose("discard");
  }, ss = async () => {
    if (Y(!1), !_t()) {
      u.resolvePendingClose("stay");
      return;
    }
    await tt() ? u.resolvePendingClose("saved") : Y(!0);
  };
  f.useEffect(() => {
    const k = (T) => {
      if ((T.ctrlKey || T.metaKey) && T.key.toLowerCase() === "s") {
        T.preventDefault(), c.isDirty && !P && !u.pendingClose && tt();
        return;
      }
      T.key === "Escape" && z && (T.stopPropagation(), R(null));
    };
    return window.addEventListener("keydown", k), () => window.removeEventListener("keydown", k);
  }, [tt, c.isDirty, P, z, u.pendingClose]);
  const Ee = () => {
    var k, T, L;
    return (L = (T = (k = window == null ? void 0 : window.apya) == null ? void 0 : k.platform) == null ? void 0 : T.tasks) == null ? void 0 : L.task;
  }, rs = async () => {
    var T;
    const k = !_;
    X(k), W.markChanged();
    try {
      await Promise.resolve((T = Ee()) == null ? void 0 : T.toggleFavorite(i));
    } catch (L) {
      X(!k), E(L, "Favori güncellenemedi.");
    }
  }, ns = () => {
    if (!i) return;
    const k = document.createElement("a");
    k.href = `/Tasks/Detail/${i}?handler=Pdf`, k.rel = "noopener", document.body.appendChild(k), k.click(), k.remove();
  }, is = async () => {
    var T;
    const k = !Z;
    D(k), W.markChanged();
    try {
      await Promise.resolve((T = Ee()) == null ? void 0 : T.toggleWatch(i)), pe.info(k ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (L) {
      D(!k), E(L, "Takip durumu güncellenemedi.");
    }
  }, ls = async () => {
    var k, T;
    W.markChanged();
    try {
      const L = await Promise.resolve((k = Ee()) == null ? void 0 : k.transfer(i, {
        mode: 2,
        // Copy
        targetProjectIds: n != null && n.projectId ? [n.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await p.invalidateQueries({ queryKey: ["task-detail"] }), pe.ok("Görev çoğaltıldı.");
      const le = (T = L == null ? void 0 : L.createdTaskIds) == null ? void 0 : T[0];
      le && ee(le);
    } catch (L) {
      E(L, "Görev çoğaltılamadı.");
    }
  }, os = async (k, T, L, le) => {
    var me, fe;
    W.markChanged();
    try {
      await Promise.resolve(le ? le() : (me = Ee()) == null ? void 0 : me.updateStatus(i, k)), await p.invalidateQueries({ queryKey: ["task-detail", i] }), c.setField("status", k), c.setField(
        "boardColumnId",
        ((fe = p.getQueryData(["task-detail", i])) == null ? void 0 : fe.boardColumnId) ?? null
      ), pe.info(T);
    } catch (ve) {
      E(ve, L);
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
        return (T = Ee()) == null ? void 0 : T.cancel(i, k);
      }
    );
  }, ds = async () => {
    var k;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?")) {
      W.markChanged();
      try {
        await Promise.resolve((k = Ee()) == null ? void 0 : k.delete(i)), pe.info("Görev silindi."), u.markClean(), ce();
      } catch (T) {
        E(T, "Görev silinemedi.");
      }
    }
  }, xs = async (k) => {
    try {
      await b.addFeature(k), S(k), pe.ok("Özellik başarıyla eklendi.");
    } catch (T) {
      E(T, "Özellik eklenemedi.");
    }
  }, Ut = async (k) => {
    try {
      await b.removeFeature(k), S("general"), pe.info("Özellik görevden kaldırıldı.");
    } catch (T) {
      E(T, "Özellik kaldırılamadı.");
    }
  }, us = async (k) => {
    var le, me, fe, ve, Be, st, Ye;
    const T = ((ve = (fe = (me = (le = window == null ? void 0 : window.apya) == null ? void 0 : le.platform) == null ? void 0 : me.application) == null ? void 0 : fe.projects) == null ? void 0 : ve.project) ?? ((Ye = (st = (Be = window == null ? void 0 : window.apya) == null ? void 0 : Be.platform) == null ? void 0 : st.projects) == null ? void 0 : Ye.project);
    if (!(T != null && T.create)) throw new Error("Proje servisi yüklenmedi.");
    const L = await Promise.resolve(T.create({
      name: k,
      code: Qn(k),
      currency: "TRY"
    }));
    return await p.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), pe.ok(`“${k}” projesi oluşturuldu.`), (L == null ? void 0 : L.id) ?? L;
  }, ps = async ({ mode: k, targetProjectIds: T, include: L }) => {
    var le, me;
    W.markChanged();
    try {
      const fe = await Promise.resolve((le = Ee()) == null ? void 0 : le.transfer(i, {
        mode: k === "move" ? 1 : 2,
        targetProjectIds: T,
        include: L
      }));
      await p.invalidateQueries({ queryKey: ["task-detail", i] }), k === "move" && c.setField("projectId", T[0]);
      const ve = T.map((st) => {
        var Ye;
        return (Ye = N.options.find((hs) => hs.value === st)) == null ? void 0 : Ye.label;
      }).filter(Boolean), Be = ((me = fe == null ? void 0 : fe.createdTaskIds) == null ? void 0 : me.length) ?? 0;
      pe.ok(k === "move" ? Be ? `“${ve[0]}” projesine taşındı, ${Be} projeye kopyalandı.` : `Görev “${ve[0]}” projesine taşındı.` : Be > 1 ? `${Be} projeye kopyalandı.` : `Kopya “${ve[0]}” projesinde oluşturuldu.`), R(null);
    } catch (fe) {
      E(fe, "Transfer tamamlanamadı.");
    }
  }, { canEdit: at, canChangeStatus: ms, canDelete: fs } = We(n), bs = w === "general" ? /* @__PURE__ */ e.jsxs(
    "div",
    {
      ref: ae,
      className: `grid gap-5 items-start ${oe ? "grid-cols-[minmax(0,1fr)]" : "grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)]"}`,
      children: [
        /* @__PURE__ */ e.jsx(
          vn,
          {
            task: n,
            onFieldChange: c.setField,
            descriptionValue: c.values.description,
            checklist: j,
            readOnly: !at,
            currentUserName: wa()
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
  ) : Cn(w) ? /* @__PURE__ */ e.jsx(
    ha,
    {
      code: w,
      onRemoveFeature: Ut,
      pickerEntries: F,
      onPickFeature: B,
      canRemove: !(K != null && K.isCore)
    }
  ) : /* @__PURE__ */ e.jsx(f.Suspense, { fallback: /* @__PURE__ */ e.jsx(ke, { className: "h-48 w-full" }), children: K != null && K.component ? /* @__PURE__ */ e.jsx(
    K.component,
    {
      taskId: i,
      task: n,
      form: c,
      nameById: d.nameById,
      onOpenSubtask: O,
      readOnly: !at
    }
  ) : /* @__PURE__ */ e.jsx(
    ha,
    {
      code: w,
      onRemoveFeature: Ut,
      pickerEntries: F,
      onPickFeature: B,
      canRemove: !(K != null && K.isCore)
    }
  ) }), Ge = x && ((m == null ? void 0 : m.status) === 404 || (m == null ? void 0 : m.status) === 403) ? m.status : null, Vt = l ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(ke, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(ke, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(ke, { className: "h-64 w-full" })
  ] }) : Ge ? /* @__PURE__ */ e.jsx(
    ys,
    {
      variant: Ge === 404 ? "error" : "locked",
      icon: Ge === 404 ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-magnifying-glass" }) : void 0,
      title: Ge === 404 ? ue("Tasks:Detail:NotFound:Title", "Bu görev bulunamadı") : ue("Tasks:Detail:Forbidden:Title", "Bu görevi görüntüleyemezsiniz"),
      description: Ge === 404 ? ue("Tasks:Detail:NotFound:Body", "Görev silinmiş ya da bağlantı eskimiş olabilir.") : gs(m),
      action: s === "page" ? /* @__PURE__ */ e.jsx(re, { asChild: !0, size: "sm", children: /* @__PURE__ */ e.jsxs("a", { href: "/Tasks", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-left", "aria-hidden": "true" }),
        ue("Tasks:Detail:BackToList", "Görevlere dön")
      ] }) }) : /* @__PURE__ */ e.jsx(re, { variant: "secondary", size: "sm", onClick: $, children: ue("Common:Close", "Kapat") })
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
      pn,
      {
        task: n,
        presentation: s,
        onClose: $,
        isFullscreen: M,
        onToggleFullscreen: C,
        onFieldChange: c.setField,
        statusValue: c.values.status,
        boardColumns: y,
        boardColumnValue: c.values.boardColumnId,
        titleValue: n == null ? void 0 : n.title,
        titleError: c.errors.title,
        isPrivateValue: c.values.isPrivate,
        isFavorite: _,
        onToggleFavorite: rs,
        isWatched: Z,
        onToggleWatch: is,
        onDuplicate: ls,
        onCancelTask: cs,
        onDelete: ds,
        onOpenTransfer: (k) => R({ mode: k }),
        onExportPdf: ns,
        canEdit: at,
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
          progressPercent: qe,
          progressNote: `${Re}/${xe.length} madde`,
          onOpenTransfer: (k) => R({ mode: k }),
          readOnly: !at
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        s === "page" && /* @__PURE__ */ e.jsx(
          hn,
          {
            activeTab: w,
            onTabChange: S,
            orderedTabs: v.orderedTabs,
            draggingCode: v.draggingCode,
            onDragStart: v.handleDragStart,
            onDragEnd: v.handleDragEnd,
            onReorderTo: v.reorderTo,
            onReorderDrop: () => pe.info("Sekme sırası güncellendi."),
            pickerEntries: F,
            onPickFeature: B,
            counts: A
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: s === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            bn,
            {
              activeTab: w,
              onTabChange: S,
              orderedTabs: v.orderedTabs,
              draggingCode: v.draggingCode,
              onDragStart: v.handleDragStart,
              onDragEnd: v.handleDragEnd,
              onReorderTo: v.reorderTo,
              onReorderDrop: () => pe.info("Sekme sırası güncellendi."),
              pickerEntries: F,
              onPickFeature: B,
              counts: A,
              isDirty: c.isDirty
            }
          ) }),
          /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised", children: bs })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(
      jn,
      {
        lastSavedAt: n == null ? void 0 : n.lastModificationTime,
        isDirty: c.isDirty,
        isSaving: P,
        justSaved: I,
        onCancel: $,
        onSave: tt,
        sticky: s === "page"
      }
    )
  ] }), Ot = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      $n,
      {
        open: !!z,
        mode: (z == null ? void 0 : z.mode) ?? "move",
        onClose: () => R(null),
        onConfirm: ps,
        projectOptions: N.options,
        currentProjectId: c.values.projectId,
        counts: A,
        onCreateProject: us
      }
    ),
    V && /* @__PURE__ */ e.jsx(
      An,
      {
        subtaskId: V,
        parentCode: n == null ? void 0 : n.code,
        onClose: () => O(null),
        onOpenFull: (k) => {
          O(null), ee(k);
        },
        onDeleted: () => p.invalidateQueries({ queryKey: ["task-detail", i] }),
        currentUserName: wa()
      }
    ),
    /* @__PURE__ */ e.jsx(
      At,
      {
        open: u.pendingClose,
        isSaving: P,
        errorText: G ? ue("Common:Unsaved:SaveFailed", "Kaydedilemedi. Düzenlemeye dönebilir ya da değişiklikleri atabilirsiniz.") : void 0,
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
      k || $();
    }, children: /* @__PURE__ */ e.jsx(
      Ft,
      {
        title: n != null && n.title ? `Görev Detayı: ${n.title}` : "Görev Detayı",
        fullscreen: M,
        className: M ? "p-0 rounded-xl border border-default shadow-xl short:h-[100svh]" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl short:h-[100svh]",
        onInteractOutside: (k) => {
          var T, L;
          k.preventDefault(), !(z || V || u.pendingClose) && ((L = (T = k.target) == null ? void 0 : T.closest) != null && L.call(T, "[data-apya-overlay]") || $());
        },
        onEscapeKeyDown: (k) => {
          if (z || V) {
            k.preventDefault();
            return;
          }
          if (document.querySelector(".modal.show")) {
            k.preventDefault();
            return;
          }
          k.preventDefault(), $();
        },
        children: Vt
      }
    ) }),
    Ot
  ] });
}
function Hn(t) {
  window.location.assign("/Tasks/Detail/" + encodeURIComponent(t));
}
function Wn() {
  const t = f.useSyncExternalStore(
    W.subscribe,
    W.getSnapshot,
    () => null
  );
  return t ? /* @__PURE__ */ e.jsx(js, { name: "task-detail", fallback: (s) => /* @__PURE__ */ e.jsx(Jn, { ...s }), children: /* @__PURE__ */ e.jsx(Zn, { taskId: t }) }) : null;
}
function Jn(t) {
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
function Zn({ taskId: t }) {
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
function Xn() {
  return Xa() === "v2";
}
function ei() {
  return Xa() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = ei();
window.apya.taskDetailV2Enabled = Xn() && !window.apya.taskDetailV3Enabled;
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
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = Da(t, "task-detail", /* @__PURE__ */ e.jsx(Wn, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const s = Fa();
    s && W.open(s);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Ca) : Ca();
function ti({ taskId: t }) {
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
      switchToTask: Hn
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
  t && Da(Dt, "task-detail-page", /* @__PURE__ */ e.jsx(ti, { taskId: t }));
}
