import { j as e, r as h, b as Ge } from "./react-vendor-D7YDiBbi.js";
import { n as $, E as os, t as Ae, e as cs, R as ds, m as ja, I as xs, a as us } from "./index-DgpuJ91w.js";
import { D as Ct, h as Dt, e as vt, B as J, I as qe, M as ps, S as ye } from "./Dialog-BEQtx1HL.js";
import { a as st } from "./QueryProvider-D2Hvqdr9.js";
import { u as W, a as X, b as Z } from "./query-vendor-Db2mwxYI.js";
import { C as Na } from "./Combobox-VWBB0dEF.js";
import { i as Ve, a as Oe, s as ue, p as ot, d as wa, b as rt, R as ka, c as Te, S as Ca, e as ms, P as fs } from "./RichTextEditorV3-no6ovBqq.js";
import { r as hs } from "./httpClient-BNoyY5yK.js";
import { R as ve, T as je, P as Ne, C as we, A as bs, a as Tt, D as gs, b as ys, c as vs, d as js, e as Ns } from "./ui-vendor-XElZ94hp.js";
import { d as Da } from "./draggableActivation-Ybw9Upbh.js";
import { i as ws } from "./dataChanged-CDwwWMH8.js";
function ks({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: o,
  footer: l,
  children: n
}) {
  return /* @__PURE__ */ e.jsx(
    Ct,
    {
      open: t,
      onOpenChange: (i) => {
        i || a();
      },
      children: /* @__PURE__ */ e.jsx(
        Dt,
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
            o,
            /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: n }),
            l
          ] })
        }
      )
    }
  );
}
function Cs({ title: t, header: a, footer: s, children: r }) {
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
function Ds({ isPrivate: t }) {
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
function Ts({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: o,
  fullscreen: l = !1
}) {
  const [n, i] = h.useState(!1), p = h.useRef(null);
  h.useEffect(() => {
    if (!n) return;
    const d = (v) => {
      p.current && !p.current.contains(v.target) && i(!1);
    }, u = (v) => {
      v.key === "Escape" && i(!1);
    };
    return document.addEventListener("mousedown", d), document.addEventListener("keydown", u), () => {
      document.removeEventListener("mousedown", d), document.removeEventListener("keydown", u);
    };
  }, [n]);
  const c = jt[t == null ? void 0 : t.status] ?? jt[1], f = Nt[t == null ? void 0 : t.priority] ?? Nt[2], x = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), i(!1);
  }, m = () => {
    var u, v, b, g;
    const d = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (u = navigator.clipboard) == null || u.writeText(d), (g = (b = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : b.info) == null || g.call(b, "Bağlantı kopyalandı."), i(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(vt, { variant: c.variant, children: c.text }),
        /* @__PURE__ */ e.jsx(vt, { variant: f.variant, children: f.text }),
        /* @__PURE__ */ e.jsx(Ds, { isPrivate: t == null ? void 0 : t.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": l ? "Küçült" : "Tam ekrana büyüt",
          onClick: o,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: l ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
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
            onClick: () => i((d) => !d),
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
                  onClick: m,
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
const Ss = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function $s({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: o }) {
  const l = Ss(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: l ? `Son kayıt: ${l}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(J, { variant: "secondary", onClick: r, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        J,
        {
          variant: "primary",
          onClick: () => o == null ? void 0 : o(),
          disabled: !a || !o,
          isLoading: s,
          loadingText: "Kaydediliyor…",
          children: "Kaydet"
        }
      )
    ] })
  ] }) });
}
const Ut = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Ps = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function he({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function Es({ value: t, onChange: a }) {
  const [s, r] = h.useState(""), o = () => {
    const l = s.trim();
    l && !t.includes(l) && a([...t, l]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((l) => /* @__PURE__ */ e.jsxs(vt, { variant: "neutral", children: [
      l,
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${l} etiketini kaldır`,
          onClick: () => a(t.filter((n) => n !== l)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, l)) }),
    /* @__PURE__ */ e.jsx(
      qe,
      {
        value: s,
        onChange: (l) => r(l.target.value),
        onKeyDown: (l) => {
          l.key === "Enter" || l.key === "," ? (l.preventDefault(), o()) : l.key === "Backspace" && !s && t.length && a(t.slice(0, -1));
        },
        onBlur: o,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function Bs({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: o = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(he, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      qe,
      {
        id: "task-title",
        value: t.title,
        onChange: (l) => s("title", l.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(he, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (l) => s("status", Number(l.target.value)),
          className: Ut,
          children: Object.entries(jt).map(([l, n]) => /* @__PURE__ */ e.jsx("option", { value: l, children: n.text }, l))
        }
      ) }),
      /* @__PURE__ */ e.jsx(he, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (l) => s("priority", Number(l.target.value)),
          className: Ut,
          children: Object.entries(Nt).map(([l, n]) => /* @__PURE__ */ e.jsx("option", { value: l, children: n.text }, l))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(he, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      Na,
      {
        id: "task-assignee",
        options: r,
        value: t.assigneeId,
        onChange: (l) => s("assigneeId", l),
        placeholder: o ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: o
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(he, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        qe,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (l) => s("startDate", l.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(he, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        qe,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (l) => s("dueDate", l.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(he, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(Es, { value: t.tagNames, onChange: (l) => s("tagNames", l) }) }),
    /* @__PURE__ */ e.jsx(he, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (l) => s("description", l.target.value),
        className: Ps
      }
    ) })
  ] });
}
const Vt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function Me({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function As({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(Me, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(Me, { label: "Oluşturulma zamanı", value: Vt(t.creationTime) }),
      /* @__PURE__ */ e.jsx(Me, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(Me, { label: "Son güncelleme zamanı", value: Vt(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(Me, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const Fs = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", zs = "border-brand-500 text-text-primary";
function Ls({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: o }) {
  const l = h.useRef(/* @__PURE__ */ new Map()), n = (p) => {
    var c;
    s(p.code), (c = l.current.get(p.code)) == null || c.focus();
  }, i = (p, c) => {
    p.key === "ArrowRight" ? (p.preventDefault(), n(t[(c + 1) % t.length])) : p.key === "ArrowLeft" ? (p.preventDefault(), n(t[(c - 1 + t.length) % t.length])) : p.key === "Home" ? (p.preventDefault(), n(t[0])) : p.key === "End" && (p.preventDefault(), n(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((p, c) => {
      const f = p.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (x) => {
            x ? l.current.set(p.code, x) : l.current.delete(p.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${p.code}`,
          "aria-selected": f,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: f ? 0 : -1,
          onClick: () => s(p.code),
          onKeyDown: (x) => i(x, c),
          className: `${Fs} ${f ? zs : ""}`,
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
        "aria-expanded": o,
        onClick: r,
        className: "mx-1 grid h-8 w-8 flex-none place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" })
      }
    )
  ] });
}
const Is = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Ms({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [o, l] = h.useState(""), n = h.useMemo(() => {
    const i = o.trim().toLocaleLowerCase("tr-TR"), p = i ? t.filter((f) => f.title.toLocaleLowerCase("tr-TR").includes(i)) : t, c = /* @__PURE__ */ new Map();
    return p.forEach((f) => {
      const x = c.get(f.category) ?? [];
      x.push(f), c.set(f.category, x);
    }), c;
  }, [t, o]);
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
            value: o,
            onChange: (i) => l(i.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          n.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...n.entries()].map(([i, p]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: Is[i] ?? i }),
            p.map((c) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
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
          ] }, i))
        ] })
      ]
    }
  );
}
function Ks({ trail: t = [], current: a, onNavigate: s }) {
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
function Rs(t) {
  var r, o, l;
  const a = (l = (o = (r = window == null ? void 0 : window.apya) == null ? void 0 : r.platform) == null ? void 0 : o.tasks) == null ? void 0 : l.task;
  if (!a) return Promise.reject(new Error("ABP görev servisi yüklenmedi."));
  const s = a.get(t);
  return Promise.resolve(s).catch((n) => {
    var p;
    const i = (p = s == null ? void 0 : s.jqXHR) == null ? void 0 : p.status;
    throw n && typeof n == "object" && n.status == null && i && (n.status = i), n;
  });
}
function St(t) {
  return W({
    queryKey: ["task-detail", t],
    queryFn: () => Rs(t),
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
function re(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
function Ta() {
  const [t, a] = h.useState(!1), [s, r] = h.useState(!1), o = h.useRef(null), l = h.useCallback(() => a(!0), []), n = h.useCallback(() => a(!1), []);
  h.useEffect(() => {
    if (!t) return;
    const c = (f) => {
      f.preventDefault(), f.returnValue = "";
    };
    return window.addEventListener("beforeunload", c), () => window.removeEventListener("beforeunload", c);
  }, [t]);
  const i = h.useCallback((c) => {
    if (!t) {
      c == null || c();
      return;
    }
    o.current = c ?? null, r(!0);
  }, [t]), p = h.useCallback((c) => {
    const f = o.current;
    return r(!1), o.current = null, c === "discard" && (a(!1), f == null || f()), c === "save" ? f : null;
  }, []);
  return { isDirty: t, markDirty: l, markClean: n, requestClose: i, pendingClose: s, resolvePendingClose: p };
}
const Gs = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, $t = "task";
function Sa() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get($t);
  return t && Gs.test(t) ? t : null;
}
function Pt() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete($t), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function $a(t, a) {
  const s = h.useRef(a);
  s.current = a, h.useEffect(() => {
    if (!t || Sa() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set($t, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), h.useEffect(() => {
    const r = () => {
      var o;
      (o = s.current) == null || o.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const qs = {
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
function Ot(t) {
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
  } : qs;
}
const Pa = (t, a) => JSON.stringify(t) === JSON.stringify(a);
function Qt(t, a, s) {
  const r = {};
  for (const o of Object.keys(s)) r[o] = Pa(t[o], a[o]) ? s[o] : t[o];
  return r;
}
function Ea(t) {
  const [a, s] = h.useState(t == null ? void 0 : t.id), r = h.useMemo(() => Ot(t), [t]), [o, l] = h.useState(r), [n, i] = h.useState(r), [p, c] = h.useState({});
  if ((t == null ? void 0 : t.id) !== a || r !== o && !Pa(r, o)) {
    const b = (t == null ? void 0 : t.id) !== void 0 && t.id === a;
    s(t == null ? void 0 : t.id), l(r), i(b ? Qt(n, o, r) : r), b || c({});
  }
  const f = h.useCallback((b, g) => {
    i((k) => ({ ...k, [b]: g }));
  }, []), x = h.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(r),
    [n, r]
  ), m = h.useCallback(() => {
    const b = {};
    return n.title.trim() || (b.title = "Başlık zorunlu."), n.startDate || (b.startDate = "Başlangıç tarihi zorunlu."), n.dueDate && n.startDate && n.dueDate < n.startDate && (b.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), c(b), Object.keys(b).length === 0;
  }, [n]), d = h.useCallback(() => ({
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
  }), [n, t]), u = h.useCallback(() => {
    i(r), c({});
  }, [r]), v = h.useCallback((b, g) => {
    if (!g) return;
    const k = Ot(g);
    i((D) => Qt(D, b, k));
  }, []);
  return { values: n, setField: f, isDirty: x, errors: p, validate: m, toUpdateDto: d, reset: u, commitSaved: v };
}
function Ht(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function Ys() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ba() {
  var o;
  const t = W({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Ys,
    staleTime: 3e5,
    retry: !1
  }), a = ((o = t.data) == null ? void 0 : o.items) ?? [], s = a.map((l) => ({ value: l.id, label: Ht(l) })), r = new Map(a.map((l) => [l.id, Ht(l)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function wt() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function _s(t) {
  const a = wt();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Aa(t) {
  const a = X(), s = ["task-features", t], r = W({
    queryKey: s,
    queryFn: () => _s(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: s }), l = Z({
    mutationFn: (i) => Promise.resolve(wt().addFeature(t, i)),
    onSuccess: o
  }), n = Z({
    mutationFn: (i) => Promise.resolve(wt().removeFeature(t, i)),
    onSuccess: o
  });
  return {
    assignedCodes: r.data ?? [],
    isLoading: r.isLoading,
    addFeature: l.mutateAsync,
    removeFeature: n.mutateAsync,
    mutatingCode: l.variables ?? n.variables ?? null,
    isMutating: l.isPending || n.isPending
  };
}
function _e(t) {
  var r, o;
  const a = (o = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.currentUser) == null ? void 0 : o.id, s = !!(a && ((t == null ? void 0 : t.creatorId) === a || (t == null ? void 0 : t.assigneeId) === a)) || re("Platform.Projects.ManageTeam");
  return {
    canManage: s,
    canEdit: s && re("Platform.Tasks.Edit"),
    canChangeStatus: s && re("Platform.Tasks.ChangeStatus"),
    canDelete: s && re("Platform.Tasks.Delete")
  };
}
const Fa = "rounded-2xl border border-subtle bg-surface-base shadow-xs", ke = `${Fa} overflow-hidden`;
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
function Se({ children: t, bg: a, fg: s }) {
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-[7px] text-[10.5px] font-bold ${a} ${s}`, children: t });
}
function oe({ icon: t, title: a, description: s }) {
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
const ze = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—", nt = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
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
function Us(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = (r) => String(r).padStart(2, "0");
  return `${s(Math.floor(a / 3600))}:${s(Math.floor(a / 60) % 60)}:${s(a % 60)}`;
}
const ge = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  image: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  sheet: { icon: "fa-file-excel", bg: "bg-success-subtle", fg: "text-success" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  zip: { icon: "fa-file-zipper", bg: "bg-warning-subtle", fg: "text-warning" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
}, Jt = (t = "") => Ia(t) === ge.image;
function Ia(t = "") {
  var s;
  const a = ((s = t.split(".").pop()) == null ? void 0 : s.toLowerCase()) ?? "";
  return a === "pdf" ? ge.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(a) ? ge.image : ["doc", "docx", "odt", "rtf", "txt"].includes(a) ? ge.doc : ["xls", "xlsx", "csv", "ods"].includes(a) ? ge.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(a) ? ge.code : ["zip", "rar", "7z", "tar", "gz"].includes(a) ? ge.zip : ge.other;
}
function Vs({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, o] = h.useState(""), [l, n] = h.useState(!1), i = X(), p = (a == null ? void 0 : a.subTasks) ?? [], c = p.filter((d) => d.status === 4).length, f = () => i.invalidateQueries({ queryKey: ["task-detail", t] }), x = async () => {
    const d = r.trim();
    if (d) {
      n(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: d,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), o(""), await f();
      } catch (u) {
        $(u, "Alt görev eklenemedi.");
      } finally {
        n(!1);
      }
    }
  }, m = async (d, u) => {
    d.stopPropagation();
    try {
      await Promise.resolve(window.apya.platform.tasks.task.updateStatus(u.id, u.status === 4 ? 1 : 4)), await f();
    } catch (v) {
      $(v, "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        p.length > 0 && /* @__PURE__ */ e.jsxs(za, { children: [
          c,
          "/",
          p.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: x,
          disabled: l || !r.trim(),
          className: `flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${l || !r.trim() ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            "Alt görev ekle"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: ke, children: [
      p.map((d) => {
        const u = ue(d.status), v = d.status === 4, b = _e(d).canChangeStatus;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => s == null ? void 0 : s(d.id, d.title),
            onKeyDown: (g) => {
              g.key === "Enter" && (s == null || s(d.id, d.title));
            },
            className: "flex items-center gap-3.5 px-4 py-3.5 border-t border-subtle first:border-t-0 hover:bg-surface-raised cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": `${d.title} tamamlandı işaretle`,
                  onClick: (g) => m(g, d),
                  disabled: !b,
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white ${b ? "cursor-pointer" : "cursor-default"} ${v ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: v && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: d.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${v ? "line-through text-text-tertiary" : "text-text-primary"}`, children: d.title }),
              /* @__PURE__ */ e.jsx(Se, { bg: u.bg, fg: u.fg, children: u.label }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: ze(d.dueDate) }),
              /* @__PURE__ */ e.jsx(ct, { name: d.assigneeName }),
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-right shrink-0 text-[10px] text-text-tertiary" })
            ]
          },
          d.id
        );
      }),
      /* @__PURE__ */ e.jsx("div", { className: "px-4 py-3 border-t border-subtle first:border-t-0", children: /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: r,
          onChange: (d) => o(d.target.value),
          onKeyDown: (d) => {
            d.key === "Enter" && x();
          },
          disabled: l,
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
function Os(t) {
  const a = Ma();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function Qs(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, o = hs();
  o && (r.RequestVerificationToken = o);
  const l = await fetch(`/api/tasks/attachments/upload/${t}`, {
    method: "POST",
    credentials: "include",
    headers: r,
    body: s
  });
  let n = null;
  try {
    n = await l.json();
  } catch {
  }
  if (!l.ok || (n == null ? void 0 : n.success) === !1)
    throw new Error((n == null ? void 0 : n.error) || "Dosya yüklenemedi.");
  return n;
}
function Et(t) {
  const a = X(), s = ["task-attachments", t], r = W({
    queryKey: s,
    queryFn: () => Os(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: s }), l = Z({
    mutationFn: (i) => Qs(t, i),
    onSuccess: o
  }), n = Z({
    mutationFn: (i) => Promise.resolve(Ma().deleteAttachment(i)),
    onSuccess: o
  });
  return {
    attachments: r.data ?? [],
    isLoading: r.isLoading,
    upload: l.mutateAsync,
    remove: n.mutateAsync,
    isUploading: l.isPending
  };
}
function Hs({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: o } = Et(t), l = X(), n = h.useRef(null), [i, p] = h.useState(!1), c = re("Platform.Tasks.ShareExternally"), f = async (d, u) => {
    try {
      await window.apya.platform.tasks.taskShare.setAttachmentGuestVisibility(d, u), l.invalidateQueries({ queryKey: ["task-attachments", t] });
    } catch (v) {
      $(v, "Görünürlük değiştirilemedi.");
    }
  }, x = async (d) => {
    var u, v, b;
    if (d)
      try {
        await s(d), (b = (v = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : v.success) == null || b.call(v, "Dosya yüklendi.");
      } catch (g) {
        $(g, "Dosya yüklenemedi.");
      } finally {
        n.current && (n.current.value = "");
      }
  }, m = async (d, u) => {
    try {
      await r(d);
    } catch (v) {
      $(v, `${u} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: n,
        type: "file",
        className: "hidden",
        onChange: (d) => {
          var u;
          return x((u = d.target.files) == null ? void 0 : u[0]);
        },
        disabled: o
      }
    ),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3", children: a.map((d) => {
      const u = Ia(d.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${u.bg} ${u.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: d.fileName, children: d.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: La(d.fileSize) })
              ] })
            ] }),
            c && !d.isGuestUpload && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 text-[11px] text-text-tertiary cursor-pointer", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: !!d.isVisibleToGuests,
                  onChange: (v) => f(d.id, v.target.checked)
                }
              ),
              "Dış paylaşımda görünsün"
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2.5 border-t border-subtle", children: [
              /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[11px] text-text-tertiary", children: [
                d.uploaderName,
                d.isGuestUpload ? " · dış" : ""
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-1 shrink-0", children: [
                /* @__PURE__ */ e.jsx(
                  "a",
                  {
                    href: d.downloadUrl,
                    target: "_blank",
                    rel: "noreferrer",
                    title: "İndir",
                    "aria-label": `${d.fileName} dosyasini indir`,
                    className: "flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-primary-subtle hover:text-primary",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-download text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Sil",
                    "aria-label": `${d.fileName} dosyasini sil`,
                    onClick: () => m(d.id, d.fileName),
                    className: "flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                )
              ] })
            ] })
          ]
        },
        d.id
      );
    }) }),
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
          var u;
          d.key === "Enter" && ((u = n.current) == null || u.click());
        },
        onDragOver: (d) => {
          d.preventDefault(), i || p(!0);
        },
        onDragLeave: () => p(!1),
        onDrop: (d) => {
          var u, v;
          d.preventDefault(), p(!1), x((v = (u = d.dataTransfer) == null ? void 0 : u.files) == null ? void 0 : v[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${i ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${o ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-[26px] ${i ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: o ? "Yükleniyor…" : i ? "Bırakın, yükleyelim" : "Dosyaları buraya sürükleyin veya tıklayın" }),
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
function Js(t) {
  const a = tt();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Bt(t) {
  const a = X(), s = ["task-checklist", t], r = W({
    queryKey: s,
    queryFn: () => Js(t),
    enabled: !!t,
    staleTime: 3e4,
    /* toggleChecklistItem ters çevirir; bayat gösterim yanlış yöne yazar (proje
       konsolu paneli aynı maddeyi React Query dışından değiştiriyor). */
    meta: { persist: !1 },
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: s }), l = Z({
    mutationFn: (p) => Promise.resolve(tt().addChecklistItem(t, p)),
    onSuccess: o
  }), n = Z({
    mutationFn: (p) => Promise.resolve(tt().toggleChecklistItem(p)),
    onSuccess: o
  }), i = Z({
    mutationFn: (p) => Promise.resolve(tt().deleteChecklistItem(p)),
    onSuccess: o
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: l.mutateAsync,
    toggleItem: n.mutateAsync,
    removeItem: i.mutateAsync
  };
}
function Ws({ taskId: t, readOnly: a = !1 }) {
  const { items: s, isLoading: r, addItem: o, toggleItem: l, removeItem: n } = Bt(t), [i, p] = h.useState(""), c = s.filter((m) => m.isDone).length, f = s.length ? Math.round(c / s.length * 100) : 0, x = async () => {
    const m = i.trim();
    if (!(!m || !t)) {
      p("");
      try {
        await o(m);
      } catch (d) {
        p(m), $(d, "Madde eklenemedi.");
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
        /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
          c,
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
      s.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            disabled: a,
            "aria-label": m.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
            onClick: () => l(m.id).catch((d) => $(d, "Durum güncellenemedi.")),
            className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${a ? "cursor-default" : "cursor-pointer"} transition-colors duration-fast ${m.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
            children: m.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${m.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: m.text }),
        !a && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            title: "Sil",
            "aria-label": `${m.text} maddesini sil`,
            onClick: () => n(m.id).catch((d) => $(d, "Madde silinemedi.")),
            className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
          }
        )
      ] }, m.id)),
      !a && /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: i,
          onChange: (m) => p(m.target.value),
          onKeyDown: (m) => {
            m.key === "Enter" && x();
          },
          placeholder: "Yeni madde yaz ve Enter'a bas…",
          "aria-label": "Yeni kontrol listesi maddesi",
          className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      )
    ] })
  ] });
}
function Zs({ taskId: t, task: a }) {
  const [s, r] = h.useState(""), [o, l] = h.useState(null), [n, i] = h.useState(""), [p, c] = h.useState(!1), f = X(), x = (a == null ? void 0 : a.comments) ?? [], m = async (u) => {
    var v, b, g;
    if (u == null || u.preventDefault(), !(!s.trim() || p)) {
      c(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), f.invalidateQueries({ queryKey: ["task-detail", t] }), (g = (b = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : b.success) == null || g.call(b, "Yorum eklendi.");
      } catch (k) {
        $(k, "Yorum eklenemedi.");
      } finally {
        c(!1);
      }
    }
  }, d = async (u) => {
    var v, b, g;
    if (!(!n.trim() || p)) {
      c(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(u, n.trim())
        ), i(""), l(null), f.invalidateQueries({ queryKey: ["task-detail", t] }), (g = (b = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : b.success) == null || g.call(b, "Yanıt eklendi.");
      } catch (k) {
        $(k, "Yanıt eklenemedi.");
      } finally {
        c(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("form", { onSubmit: m, className: "rounded-lg border border-default p-3 bg-surface-base", children: [
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
        J,
        {
          type: "submit",
          variant: "primary",
          disabled: !s.trim() || p,
          isLoading: p,
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
        J,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => l(o === u.id ? null : u.id),
          children: "Yanıtla"
        }
      ) }),
      o === u.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
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
          /* @__PURE__ */ e.jsx(J, { variant: "ghost", size: "sm", onClick: () => l(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(J, { variant: "primary", size: "sm", disabled: !n.trim() || p, onClick: () => d(u.id), children: "Gönder" })
        ] })
      ] }),
      u.replies && u.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: u.replies.map((v) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: v.creatorUserName || v.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: v.creationTime ? new Date(v.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: v.text })
      ] }, v.id)) })
    ] }, u.id)) })
  ] });
}
function xt() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.taskShare) ?? null;
}
function Xs(t) {
  const a = X(), s = ["task-share-links", t], r = W({
    queryKey: s,
    queryFn: () => {
      const i = xt();
      return i ? Promise.resolve(i.getList(t)) : Promise.reject(new Error("Paylaşım servisi yüklenmedi."));
    },
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: s }), l = Z({
    mutationFn: (i) => Promise.resolve(xt().create({ ...i, taskId: t })),
    onSuccess: o
  }), n = Z({
    mutationFn: (i) => Promise.resolve(xt().revoke(i)),
    onSuccess: o
  });
  return {
    links: r.data ?? [],
    /* isLoading DEĞİL isPending: kalıcı önbellek geri yüklenirken isLoading
       FALSE döner ama liste henüz yoktur; sekme o karede "henüz kimseyle
       paylaşılmadı" yazıyordu — paylaşımı olan görevde bile. */
    isPending: r.isPending,
    error: r.error,
    create: l.mutateAsync,
    revoke: n.mutateAsync,
    isCreating: l.isPending
  };
}
const Wt = {
  recipientName: "",
  recipientEmail: "",
  lifetimeDays: 14,
  allowComment: !0,
  allowUpload: !0,
  allowDownload: !0
};
function er(t) {
  return t ? new Date(t).toLocaleDateString("tr-TR") : "—";
}
function tr({ taskId: t }) {
  const { links: a, isPending: s, create: r, revoke: o, isCreating: l } = Xs(t), [n, i] = h.useState(Wt), [p, c] = h.useState(null);
  if (!re("Platform.Tasks.ShareExternally"))
    return /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Görevi ekip dışıyla paylaşma yetkiniz yok." });
  const x = (b) => (g) => {
    const k = g.target.type === "checkbox" ? g.target.checked : g.target.value;
    i((D) => ({ ...D, [b]: k }));
  }, m = async (b) => {
    if (b.preventDefault(), !!n.recipientName.trim())
      try {
        const g = await r({
          ...n,
          lifetimeDays: Number(n.lifetimeDays) || 14
        });
        c(g), i(Wt);
      } catch (g) {
        $(g, "Paylaşım linki üretilemedi.");
      }
  }, d = (b) => `${window.location.origin}${b}`, u = (b) => {
    var g, k, D, P;
    (g = navigator.clipboard) == null || g.writeText(d(b)), (P = (D = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : D.info) == null || P.call(D, "Bağlantı kopyalandı.");
  }, v = async (b) => {
    try {
      await o(b);
    } catch (g) {
      $(g, "Bağlantı iptal edilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    p && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 rounded-[14px] border border-focus bg-primary-subtle p-3.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "text-[12.5px] font-bold text-text-primary", children: [
        "Bağlantı hazır — ",
        /* @__PURE__ */ e.jsx("span", { className: "font-normal", children: "şimdi kopyalayın, bir daha gösterilmeyecek." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("code", { className: "min-w-0 flex-1 truncate rounded-[8px] bg-surface-base px-2.5 py-2 font-mono text-[11.5px] text-text-secondary", children: d(p.url) }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => u(p.url),
            className: "rounded-[8px] bg-primary px-3 py-2 text-[12px] font-bold text-white cursor-pointer",
            children: "Kopyala"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => c(null),
            className: "rounded-[8px] px-3 py-2 text-[12px] font-bold text-text-tertiary cursor-pointer hover:text-text-primary",
            children: "Kapat"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("form", { onSubmit: m, className: "flex flex-col gap-2.5 rounded-[14px] border border-subtle bg-surface-base p-3.5", children: [
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
            disabled: l,
            className: "shrink-0 rounded-[8px] bg-primary px-3.5 py-2 text-[12px] font-bold text-white cursor-pointer disabled:opacity-60",
            children: l ? "Üretiliyor…" : "Bağlantı üret"
          }
        )
      ] })
    ] }),
    s ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görev henüz kimseyle paylaşılmadı." }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: a.map((b) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-subtle bg-surface-base p-3",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "truncate text-[12.5px] font-bold text-text-primary", children: [
              b.recipientName,
              b.recipientEmail ? /* @__PURE__ */ e.jsxs("span", { className: "font-normal text-text-tertiary", children: [
                " · ",
                b.recipientEmail
              ] }) : null
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "text-[11.5px] text-text-tertiary", children: [
              b.isActive ? `${er(b.expiresAt)} tarihine kadar geçerli` : b.revokedAt ? "İptal edildi" : "Süresi doldu",
              " · ",
              b.accessCount,
              " erişim",
              " · ",
              b.uploadCount,
              " dosya"
            ] })
          ] }),
          b.isActive && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => v(b.id),
              className: "shrink-0 rounded-[8px] px-3 py-1.5 text-[12px] font-bold text-text-negative cursor-pointer hover:bg-negative-subtle",
              children: "İptal et"
            }
          )
        ]
      },
      b.id
    )) })
  ] });
}
function ar({ task: t }) {
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
    a.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Aktivite kaydı bulunamadı." }) }) : /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: a.map((r, o) => {
      const l = o === a.length - 1;
      return /* @__PURE__ */ e.jsxs("div", { className: `flex items-start gap-3.5 ${l ? "" : "pb-[18px]"}`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center shrink-0 self-stretch", children: [
          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-7 w-7 rounded-full ${r.bg} ${r.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r.icon} text-[11px]` }) }),
          !l && /* @__PURE__ */ e.jsx("span", { className: "flex-1 w-0.5 mt-1.5 rounded-sm bg-subtle" })
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
const Pe = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : null;
function sr({ label: t, value: a, hint: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4 px-3.5 py-3", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[12.5px] font-semibold text-text-secondary", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 text-right", children: [
      /* @__PURE__ */ e.jsx("span", { className: "block text-[12.5px] font-bold text-text-primary break-words", children: a ?? "—" }),
      s && /* @__PURE__ */ e.jsx("span", { className: "block text-[11px] text-text-tertiary", children: s })
    ] })
  ] });
}
function rr({ task: t = {}, nameById: a }) {
  const s = (o) => {
    var l;
    return o && ((l = a == null ? void 0 : a.get) == null ? void 0 : l.call(a, o)) || null;
  }, r = [
    { label: "Görev kodu", value: t.code || "—" },
    {
      label: "Oluşturulma",
      value: Pe(t.creationTime),
      hint: s(t.creatorId) ? `${s(t.creatorId)} tarafından` : null
    },
    {
      label: "Son güncelleme",
      value: Pe(t.lastModificationTime) ?? "Henüz güncellenmedi",
      hint: s(t.lastModifierId) ? `${s(t.lastModifierId)} tarafından` : null
    },
    { label: "Planlanan başlangıç", value: Pe(t.startDate) },
    { label: "Termin", value: Pe(t.dueDate) }
  ];
  return t.completedDate && r.push({ label: "Tamamlanma", value: Pe(t.completedDate) }), t.cancelledDate && r.push({
    label: "İptal",
    value: Pe(t.cancelledDate),
    hint: t.cancelReason || null
  }), /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-3.5 py-3 border-b border-subtle bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clock-rotate-left text-[13px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: "Kayıt bilgileri" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "divide-y divide-subtle", children: r.map((o) => /* @__PURE__ */ e.jsx(sr, { ...o }, o.label)) })
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11.5px] text-text-tertiary", children: "Alan bazında değişiklik günlüğü (hangi alan, eski/yeni değer) henüz yayınlanmadı." })
  ] });
}
function nr(t) {
  var s, r, o;
  const a = (o = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.projectBudgets) == null ? void 0 : o.projectBudget;
  return a != null && a.getRecordFormLookup ? Promise.resolve(a.getRecordFormLookup(t)) : Promise.reject(new Error("Bütçe servisi yüklenmedi."));
}
function ir(t) {
  var o;
  const a = re("Platform.Projects.ViewBudget"), s = W({
    queryKey: ["task-detail", "budget-lines", t],
    queryFn: () => nr(t),
    enabled: !!t && a,
    staleTime: 6e4,
    retry: !1
  }), r = ((o = s.data) == null ? void 0 : o.lines) ?? [];
  return {
    lines: r,
    options: r.map((l) => ({ value: l.id, label: l.code ? `${l.code} · ${l.name}` : l.name })),
    canViewBudget: a,
    isLoading: s.isLoading
  };
}
function it(t) {
  var s, r;
  const a = (r = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.ajax) == null ? void 0 : r.call(s, t);
  return a ? new Promise((o, l) => {
    a.done(o).fail(l);
  }) : Promise.reject(new Error("ABP köprüsü yüklenmedi."));
}
function lt(t, a = {}) {
  var o;
  const s = ((o = window == null ? void 0 : window.abp) == null ? void 0 : o.appPath) ?? "/", r = new URLSearchParams({ handler: t });
  return Object.entries(a).forEach(([l, n]) => {
    n != null && n !== "" && r.append(l, n);
  }), `${s}Documents/Matching?${r.toString()}`;
}
const Ka = () => re("Platform.Documents.Default"), lr = () => re("Platform.Documents.ManageMeta");
function or(t) {
  const a = !!t && Ka(), s = W({
    queryKey: ["task-detail", "expense-matches", t],
    queryFn: () => it({ url: lt("Matches", { projectId: t }), type: "GET" }),
    enabled: a,
    staleTime: 6e4,
    meta: { persist: !1 },
    retry: !1
  }), r = /* @__PURE__ */ new Map();
  return (s.data ?? []).forEach((o) => {
    r.has(o.expenseId) || r.set(o.expenseId, []), r.get(o.expenseId).push(o);
  }), { byExpense: r, enabled: a, isLoading: s.isLoading };
}
function cr(t, a) {
  const s = W({
    queryKey: ["task-detail", "expense-candidates", t],
    queryFn: () => it({ url: lt("Candidates", { expenseId: t }), type: "GET" }),
    enabled: !!t && a && Ka(),
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  });
  return { candidates: s.data ?? [], isLoading: s.isLoading };
}
function dr(t) {
  const a = X(), s = (l) => {
    a.invalidateQueries({ queryKey: ["task-detail", "expense-matches", t] }), a.invalidateQueries({ queryKey: ["task-detail", "expense-candidates", l] });
  }, r = Z({
    mutationFn: ({ documentFileId: l, expenseId: n, score: i }) => it({
      url: lt("CreateMatch"),
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ documentFileId: l, expenseId: n, score: i ?? 0 })
    }),
    onSuccess: (l, n) => s(n.expenseId)
  }), o = Z({
    mutationFn: ({ matchId: l }) => it({ url: lt("RemoveMatch", { matchId: l }), type: "POST" }),
    onSuccess: (l, n) => s(n.expenseId)
  });
  return { link: r, unlink: o, isBusy: r.isPending || o.isPending };
}
function xr(t) {
  return t == null ? "—" : new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 2 }).format(t);
}
function ur({ expenseId: t, projectId: a, matches: s }) {
  const { candidates: r, isLoading: o } = cr(t, !0), { link: l, unlink: n, isBusy: i } = dr(a), p = lr(), c = new Set(s.map((x) => x.documentFileId)), f = r.filter((x) => !c.has(x.documentFileId));
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
        p && /* @__PURE__ */ e.jsx(
          J,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            disabled: i,
            onClick: () => n.mutate(
              { matchId: x.id, expenseId: t },
              { onError: (m) => $(m, "Evrak bağı kaldırılamadı.") }
            ),
            children: "Kaldır"
          }
        )
      ] }, x.id))
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Aday evraklar" }),
      o && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Adaylar aranıyor…" }),
      !o && f.length === 0 && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Eşleşen aday yok. Evrak Belgeler modülünden yüklenip buradan bağlanır." }),
      f.map((x) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[11px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12px] text-text-primary", children: x.displayName }),
        /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
          xr(x.amount),
          " · ",
          ze(x.documentDate)
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: `shrink-0 font-mono text-[11px] font-bold ${x.isStrong ? "text-success" : "text-text-tertiary"}`, children: [
          "%",
          x.score
        ] }),
        p && /* @__PURE__ */ e.jsx(
          J,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            disabled: i,
            onClick: () => l.mutate(
              { documentFileId: x.documentFileId, expenseId: t, score: x.score },
              { onError: (m) => $(m, "Evrak bağlanamadı.") }
            ),
            children: "Bağla"
          }
        )
      ] }, x.documentFileId))
    ] })
  ] });
}
function xe(t, a) {
  const s = a || "TRY";
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: s, minimumFractionDigits: 2 }).format(t || 0);
  } catch {
    return `${(t || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${s}`.trim();
  }
}
function ut(t, a, s) {
  var n, i, p, c, f;
  const r = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.ModalManager;
  if (!r) {
    (c = (p = (i = window == null ? void 0 : window.abp) == null ? void 0 : i.notify) == null ? void 0 : p.error) == null || c.call(p, "Kayıt formu yüklenemedi.");
    return;
  }
  const o = ((f = window == null ? void 0 : window.abp) == null ? void 0 : f.appPath) ?? "/", l = new r({ viewUrl: `${o}${t}?TaskId=${a}` });
  l.onResult(() => s == null ? void 0 : s()), l.open();
}
function pr({ taskId: t }) {
  const a = X(), s = re("Platform.Expenses.Create"), r = re("Platform.Incomes.Create"), o = re("Platform.Invoices.Create");
  if (!t || !s && !r && !o)
    return null;
  const l = () => a.invalidateQueries({ queryKey: ["task-detail", t] });
  return /* @__PURE__ */ e.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
    s && /* @__PURE__ */ e.jsxs(
      J,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => ut("Expenses/CreateModal", t, l),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-up text-[11px]" }),
          "Gider ekle"
        ]
      }
    ),
    r && /* @__PURE__ */ e.jsxs(
      J,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => ut("Incomes/CreateModal", t, l),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-down text-[11px]" }),
          "Gelir ekle"
        ]
      }
    ),
    o && /* @__PURE__ */ e.jsxs(
      J,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => ut("Invoices/CreateModal", t, l),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-invoice text-[11px]" }),
          "Fatura ekle"
        ]
      }
    )
  ] });
}
const Zt = {
  0: { label: "Taslak", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  1: { label: "Gönderildi", bg: "bg-primary-subtle", fg: "text-primary" },
  2: { label: "Ödendi", bg: "bg-success-subtle", fg: "text-success" },
  3: { label: "İptal", bg: "bg-neutral-subtle", fg: "text-text-tertiary" },
  4: { label: "Gecikti", bg: "bg-negative-subtle", fg: "text-negative" }
};
function mr({ invoices: t, action: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: ke, children: [
    /* @__PURE__ */ e.jsx(Ue, { title: "Faturalar", action: a }),
    t.map((s) => {
      const r = Zt[s.status] ?? Zt[0];
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
              ze(s.dueDate)
            ] }),
            /* @__PURE__ */ e.jsx(Se, { bg: r.bg, fg: r.fg, children: r.label }),
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary",
                style: { fontVariantNumeric: "tabular-nums" },
                children: xe(s.totalAmount, s.currency)
              }
            )
          ]
        },
        s.id
      );
    })
  ] });
}
function fr({ line: t, projectId: a, matches: s, docsEnabled: r }) {
  const [o, l] = h.useState(!1), n = t.kind === "income";
  return /* @__PURE__ */ e.jsxs("div", { className: "border-t border-subtle first:border-t-0", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5 px-4 py-3 hover:bg-surface-raised", children: [
      /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-7 w-7 rounded-lg bg-neutral-subtle text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n ? "fa-arrow-down" : "fa-arrow-up"} text-[11px]` }) }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] font-semibold text-text-primary", children: t.title || (n ? "Gelir" : "Gider") }),
      r && /* @__PURE__ */ e.jsxs(
        J,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          "aria-expanded": o,
          onClick: () => l((i) => !i),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-[11px]" }),
            s.length > 0 ? `Evrak ${s.length}` : "Evrak"
          ]
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: ze(t.date) }),
      n ? /* @__PURE__ */ e.jsx(Se, { bg: "bg-success-subtle", fg: "text-success", children: "Gelir" }) : /* @__PURE__ */ e.jsx(Se, { bg: "bg-warning-subtle", fg: "text-warning", children: "Gider" }),
      /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: `shrink-0 font-mono text-[12.5px] font-bold ${n ? "text-success" : "text-text-primary"}`,
          style: { fontVariantNumeric: "tabular-nums" },
          children: [
            n ? "+" : "−",
            xe(t.amount, t.currency)
          ]
        }
      )
    ] }),
    r && o && /* @__PURE__ */ e.jsx(ur, { expenseId: t.id, projectId: a, matches: s })
  ] });
}
function pt({ label: t, value: a, tone: s, note: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: `font-mono text-[22px] font-bold tracking-[-.02em] ${s}`, style: { fontVariantNumeric: "tabular-nums" }, children: a }),
    r && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
  ] });
}
function hr({ options: t, isLoading: a, lineId: s, planned: r, onField: o }) {
  return a ? null : t.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12px] text-text-tertiary", children: "Bu projede bütçe kalemi tanımlı değil — kalemler Finans & Bütçe ekranından açılır." }) : /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Bütçe kalemi" }),
      /* @__PURE__ */ e.jsx(
        Na,
        {
          options: t,
          value: s ?? void 0,
          onChange: (l) => o("budgetLineId", l ?? null),
          placeholder: "Kalem seç",
          size: "sm"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Görev bütçesi" }),
      /* @__PURE__ */ e.jsx(
        ps,
        {
          value: r,
          onValueChange: (l) => o("plannedAmount", l),
          currency: "TRY",
          min: 0,
          size: "sm",
          disabled: !s
        }
      )
    ] })
  ] });
}
function br({ task: t, form: a, spentByCurrency: s, readOnly: r }) {
  const o = (a ? a.values.projectId : t == null ? void 0 : t.projectId) ?? null, { options: l, lines: n, canViewBudget: i, isLoading: p } = ir(o), c = !!a && !r && i && !!o, f = (a ? a.values.budgetLineId : t == null ? void 0 : t.budgetLineId) ?? null, x = (a ? a.values.plannedAmount : t == null ? void 0 : t.plannedAmount) ?? null;
  if (!c && (!f || x == null))
    return null;
  const m = n.find((P) => P.id === f), d = m ? m.remainingAmount : t == null ? void 0 : t.budgetLineRemaining, u = s, v = !!f && x != null, b = (x ?? 0) - u, g = x > 0 ? Math.round(u / x * 100) : 0, k = b < 0, D = () => {
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
          action: c && f ? /* @__PURE__ */ e.jsx(J, { type: "button", variant: "ghost", size: "sm", onClick: D, children: "Bağı kaldır" }) : null
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "px-4 pb-4 pt-1 flex flex-col gap-3", children: [
        c ? /* @__PURE__ */ e.jsx(
          hr,
          {
            options: l,
            isLoading: p,
            lineId: f,
            planned: x,
            onField: a.setField
          }
        ) : /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-semibold text-accent", children: t.budgetLineName || "Bütçe kalemi" }) }),
        d != null && /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "kalemde kalan ",
          xe(d, "TRY")
        ] }),
        v && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3", children: [
            /* @__PURE__ */ e.jsx(mt, { label: "Görev bütçesi", value: xe(x, "TRY") }),
            /* @__PURE__ */ e.jsx(mt, { label: "Gerçekleşen", value: xe(u, "TRY") }),
            /* @__PURE__ */ e.jsx(
              mt,
              {
                label: "Kalan",
                value: xe(b, "TRY"),
                tone: k ? "text-negative" : "text-success"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
              "div",
              {
                className: `h-full rounded-full ${k ? "bg-negative" : g >= 80 ? "bg-warning" : "bg-success"}`,
                style: { width: `${Math.min(Math.max(g, 0), 100)}%` }
              }
            ) }),
            /* @__PURE__ */ e.jsxs("div", { className: "mt-1 text-[11.5px] text-text-tertiary", children: [
              "%",
              g,
              k && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative", children: "· görev bütçesi aşıldı" })
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
function gr({ task: t, taskId: a, form: s, readOnly: r = !1 }) {
  const o = (t == null ? void 0 : t.expenses) || [], l = (t == null ? void 0 : t.incomes) || [], n = (t == null ? void 0 : t.invoices) || [], i = (s ? s.values.projectId : t == null ? void 0 : t.projectId) ?? null, { byExpense: p, enabled: c } = or(i), f = o.filter((b) => (b.currency || "TRY") === "TRY").reduce((b, g) => b + (g.amount || 0), 0), x = /* @__PURE__ */ e.jsx(br, { task: t, form: s, spentByCurrency: f, readOnly: r }), m = /* @__PURE__ */ e.jsx(pr, { taskId: a ?? (t == null ? void 0 : t.id) });
  if (o.length === 0 && l.length === 0 && n.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      x,
      /* @__PURE__ */ e.jsxs("div", { className: ke, children: [
        /* @__PURE__ */ e.jsx(Ue, { title: "Görev Finansı", action: m }),
        /* @__PURE__ */ e.jsx(
          oe,
          {
            icon: "fa-coins",
            title: "Kayıt yok",
            description: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
          }
        )
      ] })
    ] });
  const u = Array.from(new Set([...o, ...l].map((b) => b.currency || "TRY"))).map((b) => {
    const g = l.filter((D) => (D.currency || "TRY") === b).reduce((D, P) => D + (P.amount || 0), 0), k = o.filter((D) => (D.currency || "TRY") === b).reduce((D, P) => D + (P.amount || 0), 0);
    return { cur: b, inc: g, exp: k, net: g - k };
  }), v = [
    ...l.map((b) => ({ ...b, kind: "income" })),
    ...o.map((b) => ({ ...b, kind: "expense" }))
  ].sort((b, g) => new Date(g.date || 0) - new Date(b.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    x,
    u.map(({ cur: b, inc: g, exp: k, net: D }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(pt, { label: `Toplam Gelir (${b})`, value: xe(g, b), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(pt, { label: `Toplam Gider (${b})`, value: xe(k, b), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        pt,
        {
          label: `Net Bakiye (${b})`,
          value: xe(D, b),
          tone: D >= 0 ? "text-success" : "text-negative",
          note: D >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, b)),
    n.length > 0 && /* @__PURE__ */ e.jsx(mr, { invoices: n, action: v.length === 0 ? m : null }),
    v.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: ke, children: [
      /* @__PURE__ */ e.jsx(Ue, { title: "Finans kalemleri", action: m }),
      v.map((b) => /* @__PURE__ */ e.jsx(
        fr,
        {
          line: b,
          projectId: i,
          matches: b.kind === "expense" ? p.get(b.id) ?? [] : [],
          docsEnabled: c && b.kind === "expense"
        },
        `${b.kind}-${b.id}`
      ))
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11px] text-text-tertiary", children: "Buradan eklenen kayıt göreve ve projesine etiketlenir; düzenleme/silme Finans modülünden yapılır. Evraklar Belgeler modülünde yaşar, buradan gidere bağlanır." })
  ] });
}
function yr({ taskId: t }) {
  const { attachments: a, isLoading: s, upload: r, remove: o, isUploading: l } = Et(t), n = h.useRef(null), [i, p] = h.useState(!1), c = a.filter((m) => Jt(m.fileName)), f = async (m) => {
    var d, u, v, b, g, k;
    if (m) {
      if (!Jt(m.name)) {
        (v = (u = (d = window == null ? void 0 : window.abp) == null ? void 0 : d.notify) == null ? void 0 : u.error) == null || v.call(u, "Galeriye yalnız görsel dosya yüklenebilir.");
        return;
      }
      try {
        await r(m), (k = (g = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : g.success) == null || k.call(g, "Görsel yüklendi.");
      } catch (D) {
        $(D, "Görsel yüklenemedi.");
      } finally {
        n.current && (n.current.value = "");
      }
    }
  }, x = async (m, d) => {
    try {
      await o(m);
    } catch (u) {
      $(u, `${d} silinemedi.`);
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
        onChange: (m) => {
          var d;
          return f((d = m.target.files) == null ? void 0 : d[0]);
        },
        disabled: l
      }
    ),
    s && c.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !s && c.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görevde henüz görsel yok. Yüklediğiniz görseller Dosyalar sekmesinde de görünür." }),
    c.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3", children: c.map((m) => /* @__PURE__ */ e.jsxs(
      "figure",
      {
        className: "group relative m-0 flex flex-col overflow-hidden rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
        children: [
          /* @__PURE__ */ e.jsx(
            "a",
            {
              href: m.downloadUrl,
              target: "_blank",
              rel: "noreferrer",
              title: `${m.fileName} — tam boyutta aç`,
              className: "block aspect-[4/3] overflow-hidden bg-neutral-subtle",
              children: /* @__PURE__ */ e.jsx(
                "img",
                {
                  src: m.downloadUrl,
                  alt: m.fileName,
                  loading: "lazy",
                  className: "h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                }
              )
            }
          ),
          /* @__PURE__ */ e.jsxs("figcaption", { className: "flex items-center justify-between gap-2 p-2.5", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12px] font-bold text-text-primary", title: m.fileName, children: m.fileName }),
              /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: La(m.fileSize) })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                title: "Sil",
                "aria-label": `${m.fileName} gorselini sil`,
                onClick: () => x(m.id, m.fileName),
                className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
              }
            )
          ] })
        ]
      },
      m.id
    )) }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "button",
        tabIndex: 0,
        onClick: () => {
          var m;
          return (m = n.current) == null ? void 0 : m.click();
        },
        onKeyDown: (m) => {
          var d;
          m.key === "Enter" && ((d = n.current) == null || d.click());
        },
        onDragOver: (m) => {
          m.preventDefault(), i || p(!0);
        },
        onDragLeave: () => p(!1),
        onDrop: (m) => {
          var d, u;
          m.preventDefault(), p(!1), f((u = (d = m.dataTransfer) == null ? void 0 : d.files) == null ? void 0 : u[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${i ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l ? "fa-circle-notch fa-spin" : "fa-images"} text-[26px] ${i ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: l ? "Yükleniyor…" : i ? "Bırakın, yükleyelim" : "Görselleri buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, JPG, GIF, WEBP, SVG · max 25MB" })
        ]
      }
    )
  ] });
}
const vr = [
  { key: "title", label: "Başlık", align: "left" },
  { key: "status", label: "Durum", align: "left" },
  { key: "priority", label: "Öncelik", align: "left" },
  { key: "assignee", label: "Atanan", align: "left" },
  { key: "dueDate", label: "Termin", align: "right" }
];
function Xt(t, a) {
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
function jr(t, a, s, r) {
  const o = Xt(t, s), l = Xt(a, s), n = o === null || o === "", i = l === null || l === "";
  return n && i ? 0 : n ? 1 : i ? -1 : o === l ? 0 : (o < l ? -1 : 1) * (r === "asc" ? 1 : -1);
}
function Nr({ task: t = {}, onOpenSubtask: a }) {
  const [s, r] = h.useState({ key: "dueDate", dir: "asc" }), o = (t == null ? void 0 : t.subTasks) ?? [], l = h.useMemo(
    () => [...o].sort((i, p) => jr(i, p, s.key, s.dir)),
    [o, s.key, s.dir]
  ), n = (i) => r((p) => p.key === i ? { key: i, dir: p.dir === "asc" ? "desc" : "asc" } : { key: i, dir: "asc" });
  return o.length === 0 ? /* @__PURE__ */ e.jsx(
    oe,
    {
      icon: "fa-table",
      title: "Alt görev yok",
      description: "Alt Görevler sekmesinden ekledikleriniz burada tablo olarak listelenir."
    }
  ) : /* @__PURE__ */ e.jsx("div", { className: `${ke} overflow-x-auto`, children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse text-[12.5px]", children: [
    /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsx("tr", { className: "bg-surface-raised", children: vr.map((i) => {
      const p = s.key === i.key;
      return /* @__PURE__ */ e.jsx(
        "th",
        {
          scope: "col",
          "aria-sort": p ? s.dir === "asc" ? "ascending" : "descending" : "none",
          className: `px-3.5 py-2.5 border-b border-subtle font-bold text-text-secondary whitespace-nowrap ${i.align === "right" ? "text-right" : "text-left"}`,
          children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => n(i.key),
              className: `inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer font-bold ${p ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`,
              children: [
                i.label,
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid text-[9px] ${p ? s.dir === "asc" ? "fa-arrow-up-short-wide" : "fa-arrow-down-wide-short" : "fa-sort opacity-40"}` })
              ]
            }
          )
        },
        i.key
      );
    }) }) }),
    /* @__PURE__ */ e.jsx("tbody", { children: l.map((i) => {
      const p = ue(i.status), c = ot(i.priority), f = wa(i.dueDate);
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
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(Se, { bg: p.bg, fg: p.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${p.icon} text-[9px] mr-1` }),
              p.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(Se, { bg: c.bg, fg: c.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c.icon} text-[9px] mr-1` }),
              c.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: i.assigneeName ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ e.jsx(ct, { name: i.assigneeName, size: 22 }),
              /* @__PURE__ */ e.jsx("span", { className: "truncate text-text-secondary", children: i.assigneeName })
            ] }) : /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: "Atanmadı" }) }),
            /* @__PURE__ */ e.jsxs("td", { className: `px-3.5 py-2.5 text-right whitespace-nowrap ${f.tone}`, children: [
              i.dueDate ? ze(i.dueDate) : "—",
              f.hint && /* @__PURE__ */ e.jsx("div", { className: "text-[11px]", children: f.hint })
            ] })
          ]
        },
        i.id
      );
    }) })
  ] }) });
}
function wr({ taskId: t, task: a = {}, onOpenSubtask: s }) {
  const r = X(), o = (a == null ? void 0 : a.subTasks) ?? [], [l, n] = h.useState(null), [i, p] = h.useState(null), c = async (f, x) => {
    const m = o.find((d) => d.id === f);
    if (!(!m || m.status === x || !_e(m).canChangeStatus)) {
      p(f);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.updateStatus(f, x)), await r.invalidateQueries({ queryKey: ["task-detail", t] });
      } catch (d) {
        $(d, "Alt görev durumu güncellenemedi.");
      } finally {
        p(null);
      }
    }
  };
  return o.length === 0 ? /* @__PURE__ */ e.jsx(
    oe,
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 items-start", children: rt.map((f) => {
      const x = ue(f), m = o.filter((u) => u.status === f), d = l === f;
      return /* @__PURE__ */ e.jsxs(
        "section",
        {
          "aria-label": `${x.label} sütunu`,
          onDragOver: (u) => {
            u.preventDefault(), l !== f && n(f);
          },
          onDragLeave: () => n((u) => u === f ? null : u),
          onDrop: (u) => {
            var b;
            u.preventDefault(), n(null);
            const v = (b = u.dataTransfer) == null ? void 0 : b.getData("text/plain");
            v && c(v, f);
          },
          className: `flex flex-col gap-2 p-2.5 rounded-2xl border bg-surface-raised min-h-[120px] transition-colors duration-fast ${d ? "border-focus bg-primary-subtle" : "border-subtle"}`,
          children: [
            /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-2 px-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${x.dot}` }),
              /* @__PURE__ */ e.jsx("h3", { className: "m-0 flex-1 text-[12px] font-bold text-text-primary", children: x.label }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: m.length })
            ] }),
            m.map((u) => {
              const v = ot(u.priority), b = _e(u).canChangeStatus;
              return /* @__PURE__ */ e.jsxs(
                "article",
                {
                  draggable: b,
                  onDragStart: (g) => {
                    var k;
                    return (k = g.dataTransfer) == null ? void 0 : k.setData("text/plain", u.id);
                  },
                  role: "button",
                  tabIndex: 0,
                  onClick: () => s == null ? void 0 : s(u.id),
                  onKeyDown: (g) => {
                    g.key === "Enter" && (s == null || s(u.id));
                  },
                  className: `flex flex-col gap-2 p-2.5 rounded-[12px] border border-subtle bg-surface-base shadow-xs cursor-pointer hover:border-focus hover:shadow-md ${i === u.id ? "opacity-60" : ""}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary line-clamp-2", children: u.title }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                      /* @__PURE__ */ e.jsxs("span", { className: `text-[10.5px] font-bold ${v.fg}`, children: [
                        /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${v.icon} text-[9px] mr-1` }),
                        v.label
                      ] }),
                      u.dueDate && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: ze(u.dueDate) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2 border-t border-subtle", children: [
                      u.assigneeName ? /* @__PURE__ */ e.jsx(ct, { name: u.assigneeName, size: 20 }) : /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] text-text-tertiary", children: "Atanmadı" }),
                      /* @__PURE__ */ e.jsx(
                        "select",
                        {
                          "aria-label": `${u.title} durumunu değiştir`,
                          value: u.status,
                          onClick: (g) => g.stopPropagation(),
                          onChange: (g) => c(u.id, Number(g.target.value)),
                          disabled: !b,
                          className: `h-[24px] px-1.5 rounded-[6px] border border-subtle bg-surface-base text-[10.5px] text-text-secondary ${b ? "cursor-pointer" : "cursor-default"}`,
                          children: rt.map((g) => /* @__PURE__ */ e.jsx("option", { value: g, children: ue(g).label }, g))
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
const kr = [
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
], Cr = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], ea = (t) => String(t).padStart(2, "0"), Ra = (t, a, s) => `${t}-${ea(a + 1)}-${ea(s)}`;
function kt(t) {
  if (!t) return null;
  const a = /^(\d{4}-\d{2}-\d{2})/.exec(String(t));
  return a ? a[1] : null;
}
function Dr(t, a) {
  const r = (new Date(t, a, 1).getDay() + 6) % 7, o = new Date(t, a + 1, 0).getDate(), l = [];
  for (let n = 0; n < 42; n++) {
    const i = n - r + 1;
    l.push(i >= 1 && i <= o ? { key: Ra(t, a, i), day: i, inMonth: !0 } : { key: `bos-${n}`, day: null, inMonth: !1 });
  }
  return l;
}
function Tr(t) {
  const a = /* @__PURE__ */ new Map(), s = (r, o) => {
    const l = kt(r);
    l && (a.has(l) || a.set(l, []), a.get(l).push(o));
  };
  s(t == null ? void 0 : t.startDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "start", isSelf: !0, status: t == null ? void 0 : t.status }), s(t == null ? void 0 : t.dueDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "due", isSelf: !0, status: t == null ? void 0 : t.status });
  for (const r of (t == null ? void 0 : t.subTasks) ?? [])
    s(r.startDate, { id: r.id, title: r.title, kind: "start", isSelf: !1, status: r.status }), s(r.dueDate, { id: r.id, title: r.title, kind: "due", isSelf: !1, status: r.status });
  return a;
}
function Sr({ task: t = {}, onOpenSubtask: a }) {
  const s = h.useMemo(() => Tr(t), [t]), [r, o] = h.useState(() => {
    const c = kt(t == null ? void 0 : t.startDate) ?? kt(t == null ? void 0 : t.dueDate);
    if (c) {
      const [x, m] = c.split("-").map(Number);
      return { year: x, month: m - 1 };
    }
    const f = /* @__PURE__ */ new Date();
    return { year: f.getFullYear(), month: f.getMonth() };
  }), l = h.useMemo(() => Dr(r.year, r.month), [r.year, r.month]), n = (c) => o(({ year: f, month: x }) => {
    const m = x + c;
    return { year: f + Math.floor(m / 12), month: (m % 12 + 12) % 12 };
  }), i = /* @__PURE__ */ new Date(), p = Ra(i.getFullYear(), i.getMonth(), i.getDate());
  return s.size === 0 ? /* @__PURE__ */ e.jsx(
    oe,
    {
      icon: "fa-calendar",
      title: "Takvimde gösterilecek tarih yok",
      description: "Göreve başlangıç veya termin tarihi girildiğinde burada aylık takvimde görünür."
    }
  ) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-3.5 py-3 border-b border-subtle bg-surface-raised", children: [
      /* @__PURE__ */ e.jsxs("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: [
        kr[r.month],
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
            onClick: () => o({ year: i.getFullYear(), month: i.getMonth() }),
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-subtle bg-surface-raised", children: Cr.map((c) => /* @__PURE__ */ e.jsx("span", { className: "px-2 py-1.5 text-center text-[11px] font-bold text-text-tertiary", children: c }, c)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: l.map((c) => {
      const f = c.inMonth ? s.get(c.key) ?? [] : [], x = c.key === p;
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: `flex flex-col gap-1 min-h-[76px] p-1.5 border-r border-b border-subtle last-of-type:border-r-0 ${c.inMonth ? "" : "bg-surface-sunken"}`,
          children: [
            c.inMonth && /* @__PURE__ */ e.jsx("span", { className: `self-end font-mono text-[11px] font-bold ${x ? "flex items-center justify-center h-[18px] w-[18px] rounded-full bg-primary text-white" : "text-text-tertiary"}`, children: c.day }),
            f.map((m, d) => {
              const u = ue(m.status);
              return /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  title: `${m.title} — ${m.kind === "due" ? "termin" : "başlangıç"}`,
                  onClick: () => {
                    m.isSelf || a == null || a(m.id);
                  },
                  className: `flex items-center gap-1 w-full px-1.5 py-[3px] rounded-[6px] text-left text-[10.5px] font-semibold ${u.bg} ${u.fg} ${m.isSelf ? "cursor-default" : "cursor-pointer hover:brightness-95"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${m.kind === "due" ? "fa-flag-checkered" : "fa-play"} text-[8px] shrink-0` }),
                    /* @__PURE__ */ e.jsx("span", { className: "truncate", children: m.title })
                  ]
                },
                `${m.id}-${m.kind}-${d}`
              );
            })
          ]
        },
        c.key
      );
    }) })
  ] });
}
function Ye() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function $r(t) {
  const a = Ye();
  return a ? Promise.resolve(a.getDocuments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Pr(t) {
  const a = X(), s = ["task-documents", t], r = W({
    queryKey: s,
    queryFn: () => $r(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: s }), l = Z({
    mutationFn: (p) => Promise.resolve(Ye().createDocument(t, p)),
    onSuccess: o
  }), n = Z({
    mutationFn: ({ id: p, title: c, content: f }) => Promise.resolve(Ye().updateDocument(p, { title: c, content: f })),
    onSuccess: (p) => {
      o(), p != null && p.id && a.setQueryData(["task-document", p.id], p);
    }
  }), i = Z({
    mutationFn: (p) => Promise.resolve(Ye().deleteDocument(p)),
    onSuccess: o
  });
  return {
    documents: r.data ?? [],
    isLoading: r.isLoading,
    createDocument: l.mutateAsync,
    updateDocument: n.mutateAsync,
    removeDocument: i.mutateAsync,
    isSaving: n.isPending
  };
}
function Er(t) {
  return W({
    queryKey: ["task-document", t],
    queryFn: () => Promise.resolve(Ye().getDocument(t)),
    enabled: !!t,
    /* Kayıt tam değiştirir (updateDocument {id,title,content}); bayat gövdeden
       kaydetmek başka ekranda yapılan değişikliği ezer. */
    meta: { persist: !1 },
    retry: !1
  });
}
function Br({ taskId: t }) {
  const { documents: a, isLoading: s, createDocument: r, updateDocument: o, removeDocument: l, isSaving: n } = Pr(t), [i, p] = h.useState(null), [c, f] = h.useState(""), [x, m] = h.useState(""), [d, u] = h.useState(!1), { data: v, isFetching: b } = Er(i);
  h.useEffect(() => {
    !v || v.id !== i || (f(v.title ?? ""), m(v.content ?? ""), u(!1));
  }, [v == null ? void 0 : v.id]);
  const g = async () => {
    try {
      const T = await r("Yeni belge");
      T != null && T.id && p(T.id);
    } catch (T) {
      $(T, "Belge oluşturulamadı.");
    }
  }, k = async () => {
    var I, q, M, K, R, F;
    const T = c.trim();
    if (!T) {
      (M = (q = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : q.error) == null || M.call(q, "Belge başlığı boş olamaz.");
      return;
    }
    try {
      await o({ id: i, title: T, content: x }), u(!1), (F = (R = (K = window == null ? void 0 : window.abp) == null ? void 0 : K.notify) == null ? void 0 : R.success) == null || F.call(R, "Belge kaydedildi.");
    } catch (G) {
      $(G, "Belge kaydedilemedi.");
    }
  }, D = async (T, I) => {
    try {
      await l(T), i === T && p(null);
    } catch (q) {
      $(q, `“${I}” silinemedi.`);
    }
  }, P = () => {
    d && !window.confirm("Kaydedilmemiş değişiklikleriniz var. Yine de kapatılsın mı?") || p(null);
  };
  return i ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: P,
          "aria-label": "Belge listesine dön",
          className: "flex items-center justify-center h-8 w-8 rounded-[9px] border border-subtle bg-surface-base text-text-tertiary hover:text-text-primary cursor-pointer",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-left text-[12px]" })
        }
      ),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: c,
          "aria-label": "Belge başlığı",
          onChange: (T) => {
            f(T.target.value), u(!0);
          },
          className: "flex-1 min-w-0 h-9 px-3 rounded-[10px] border border-subtle bg-surface-base text-[13.5px] font-bold text-text-primary focus:border-focus focus:shadow-focus focus:outline-none"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: k,
          disabled: n || !d,
          className: `flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[12.5px] font-bold ${n || !d ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n ? "fa-circle-notch fa-spin" : "fa-floppy-disk"} text-[11px]` }),
            n ? "Kaydediliyor…" : d ? "Kaydet" : "Kaydedildi"
          ]
        }
      )
    ] }),
    b && !v ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Belge yükleniyor…" }) : /* @__PURE__ */ e.jsx(
      ka,
      {
        value: x,
        placeholder: "Belgeyi buraya yazın…",
        onChange: (T) => {
          m(T), u(!0);
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
          onClick: g,
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
      oe,
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
              onClick: () => D(T.id, T.title),
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
function Fe() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Ar(t) {
  const a = Fe();
  return a ? Promise.resolve(a.getLinkedForms(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Fr(t) {
  const a = X(), s = ["task-forms", t], r = W({
    queryKey: s,
    queryFn: () => Ar(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: s }), l = Z({
    mutationFn: (p) => Promise.resolve(Fe().linkForm(t, p)),
    onSuccess: o
  }), n = Z({
    mutationFn: (p) => Promise.resolve(Fe().unlinkForm(p)),
    onSuccess: o
  }), i = Z({
    mutationFn: ({ linkId: p, value: c }) => Promise.resolve(Fe().setFormGuestFillable(p, c)),
    onSuccess: o
  });
  return {
    forms: r.data ?? [],
    isLoading: r.isLoading,
    linkForm: l.mutateAsync,
    unlinkForm: n.mutateAsync,
    setGuestFillable: i.mutateAsync,
    isLinking: l.isPending
  };
}
function zr(t, a) {
  return W({
    queryKey: ["task-form-options", t],
    queryFn: () => Promise.resolve(Fe().getFormOptions(t)),
    enabled: !!t && !!a,
    meta: { persist: !1 },
    retry: !1
  });
}
function Lr(t, a) {
  return W({
    queryKey: ["task-form-responses", t, a],
    queryFn: () => Promise.resolve(Fe().getFormResponses(t, a)),
    enabled: !!t && !!a,
    meta: { persist: !1 },
    retry: !1
  });
}
function Ir({ taskId: t, documentId: a }) {
  const { data: s, isLoading: r } = Lr(t, a);
  return r ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Yanıtlar yükleniyor…" }) : s != null && s.length ? /* @__PURE__ */ e.jsx("ul", { className: "m-0 list-none p-0", children: s.map((o) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-3 px-3.5 py-2 border-t border-subtle", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${o.isGuestSubmission ? "fa-user-clock" : "fa-user"} text-[10px] text-text-tertiary` }),
      /* @__PURE__ */ e.jsx("span", { className: "truncate text-[12.5px] text-text-primary", children: o.respondentName }),
      o.isGuestSubmission && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: "· dış" })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary", children: nt(o.creationTime) })
  ] }, o.id)) }) : /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Bu görevde henüz yanıt yok." });
}
function Mr({ taskId: t }) {
  const { forms: a, isLoading: s, linkForm: r, unlinkForm: o, setGuestFillable: l, isLinking: n } = Fr(t), [i, p] = h.useState(!1), [c, f] = h.useState(null), { data: x, isLoading: m } = zr(t, i), d = re("Platform.Tasks.ShareExternally"), u = async (g) => {
    try {
      await r(g), p(!1);
    } catch (k) {
      $(k, "Form bağlanamadı.");
    }
  }, v = async (g) => {
    if (window.confirm(`“${g.title}” bağlantısı kaldırılsın mı? Form ve toplanmış yanıtlar silinmez.`))
      try {
        await o(g.id);
      } catch (k) {
        $(k, "Bağlantı kaldırılamadı.");
      }
  }, b = async (g, k) => {
    try {
      await l({ linkId: g.id, value: k });
    } catch (D) {
      $(D, "Ayar değiştirilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Formlar" }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => p((g) => !g),
          className: "flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${i ? "fa-xmark" : "fa-plus"} text-[11px]` }),
            i ? "Kapat" : "Form bağla"
          ]
        }
      )
    ] }),
    i && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-raised overflow-hidden", children: [
      m && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Formlar yükleniyor…" }),
      !m && !(x != null && x.length) && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Bağlanabilecek form yok. Önce Form Yönetimi'nden bir form oluşturun." }),
      x == null ? void 0 : x.map((g) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          disabled: g.isLinked || n,
          onClick: () => u(g.documentId),
          className: `flex items-center justify-between gap-3 px-3.5 py-2.5 border-b border-subtle last:border-b-0 text-left ${g.isLinked ? "cursor-not-allowed opacity-55" : "cursor-pointer hover:bg-surface-hover"}`,
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "truncate text-[12.5px] font-semibold text-text-primary", children: g.title }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[11px] text-text-tertiary", children: g.isLinked ? "zaten bağlı" : g.isPublished ? "yayında" : "taslak" })
          ]
        },
        g.documentId
      ))
    ] }),
    s && a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !s && a.length === 0 && !i && /* @__PURE__ */ e.jsx(
      oe,
      {
        icon: "fa-clipboard-list",
        title: "Göreve bağlı form yok",
        description: "Saha formu, kabul kontrol listesi ya da anket bağlayıp yanıtları bu görevin altında toplayabilirsiniz."
      }
    ),
    a.map((g) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-3.5 py-3", children: [
        /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clipboard-list text-[14px]" }) }),
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => f((k) => k === g.documentId ? null : g.documentId),
            className: "flex-1 min-w-0 bg-transparent border-0 p-0 text-left cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] font-bold text-text-primary", children: g.title }),
                !g.isPublished && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] font-bold text-warning", children: "taslak" })
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "block text-[11.5px] text-text-tertiary", children: g.responseCount > 0 ? `${g.responseCount} yanıt · bu görevde` : "Bu görevde henüz yanıt yok" })
            ]
          }
        ),
        g.responseCount > 0 && /* @__PURE__ */ e.jsx(za, { children: g.responseCount }),
        g.isPublished && g.slug && /* @__PURE__ */ e.jsx(
          "a",
          {
            href: `/f/${g.slug}?taskId=${g.taskId}`,
            target: "_blank",
            rel: "noreferrer",
            title: "Formu doldur",
            "aria-label": `${g.title} formunu doldur`,
            className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary hover:bg-primary-subtle hover:text-primary",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-up-right-from-square text-[11px]" })
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            title: "Bağlantıyı kaldır",
            "aria-label": `${g.title} bağlantısını kaldır`,
            onClick: () => v(g),
            className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[12px]" })
          }
        )
      ] }),
      d && g.isPublished && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 px-3.5 pb-3 text-[11.5px] text-text-secondary cursor-pointer", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: !!g.isGuestFillable,
            onChange: (k) => b(g, k.target.checked)
          }
        ),
        "Süreli paylaşım linkiyle ekip dışından da doldurulabilsin"
      ] }),
      c === g.documentId && /* @__PURE__ */ e.jsx(Ir, { taskId: t, documentId: g.documentId })
    ] }, g.id))
  ] });
}
const Kr = {
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
function Rr({ task: t = {} }) {
  const a = h.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((n, i) => ({
    id: n.id || `row-${i}`,
    name: n.title || "Başlıksız görev",
    isMain: !!n.__main,
    start: ft(n.startDate),
    end: ft(n.dueDate) || ft(n.completedDate),
    status: n.status ?? 1
  })), [t]), { min: s, span: r } = h.useMemo(() => {
    const l = a.flatMap((p) => [p.start, p.end]).filter(Boolean).map((p) => p.getTime());
    if (l.length === 0) return { min: null, span: 0 };
    const n = Math.min(...l), i = Math.max(...l);
    return { min: n, span: Math.max(1, i - n) };
  }, [a]), o = h.useMemo(() => s === null ? [] : [0, 1, 2, 3].map((l) => new Date(s + r * l / 4)), [s, r]);
  return s === null ? /* @__PURE__ */ e.jsx("div", { className: ke, children: /* @__PURE__ */ e.jsx(
    oe,
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-4 gap-0 pl-[170px] mb-2 lt-860:pl-[110px]", children: o.map((l, n) => /* @__PURE__ */ e.jsx(
      "span",
      {
        className: "pl-2 border-l border-subtle text-[10.5px] font-bold uppercase tracking-[.06em] text-text-tertiary",
        children: Ke(l)
      },
      n
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: a.map((l) => {
      const n = l.start ? l.start.getTime() : s, i = l.end ? Math.max(l.end.getTime(), n) : n, p = (n - s) / r * 100, c = Math.max(2, (i - n) / r * 100), f = Math.max(1, Math.round((i - n) / 864e5));
      return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-0 h-9", children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            className: `w-[170px] lt-860:w-[110px] shrink-0 pr-3 truncate text-[12.5px] ${l.isMain ? "font-bold text-text-primary" : "font-semibold text-text-secondary"}`,
            title: l.name,
            children: l.name
          }
        ),
        /* @__PURE__ */ e.jsx("div", { className: "relative flex-1 h-full rounded-lg bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: `absolute top-[7px] bottom-[7px] flex items-center px-2.5 rounded-[7px] shadow-xs ${Kr[l.status] || "bg-primary"}`,
            style: { left: `${p}%`, width: `${c}%` },
            title: `${Ke(l.start)} – ${Ke(l.end)}`,
            children: /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[10.5px] font-bold text-white", children: [
              f,
              "g"
            ] })
          }
        ) })
      ] }, l.id);
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
function ta({ icon: t, iconTone: a, title: s, note: r, children: o }) {
  return /* @__PURE__ */ e.jsxs("div", { className: ke, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[12px] ${a}` }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: s }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
    ] }),
    o
  ] });
}
function Gr({ task: t = {}, readOnly: a = !1 }) {
  const s = X(), r = t.predecessorIds || [], o = () => {
    var c, f, x;
    return (x = (f = (c = window == null ? void 0 : window.apya) == null ? void 0 : c.platform) == null ? void 0 : f.tasks) == null ? void 0 : x.task;
  }, { data: l = [], isLoading: n } = W({
    queryKey: ["task-predecessors", t.id, r],
    queryFn: async () => {
      const c = o();
      return c ? Promise.all(
        r.map(
          (f) => Promise.resolve(c.get(f)).catch(() => ({ id: f, title: "(erişilemeyen görev)", status: null, code: "—" }))
        )
      ) : [];
    },
    enabled: r.length > 0,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), i = async (c) => {
    var f, x, m;
    try {
      await Promise.resolve(o().update(t.id, Ga(t, {
        predecessorIds: r.filter((d) => d !== c)
      }))), await s.invalidateQueries({ queryKey: ["task-detail", t.id] }), (m = (x = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : x.info) == null || m.call(x, "Bağlantı kaldırıldı.");
    } catch (d) {
      $(d, "Bağlantı kaldırılamadı.");
    }
  }, p = (c) => {
    var f, x, m;
    return (m = (x = (f = window == null ? void 0 : window.apya) == null ? void 0 : f.taskDetail) == null ? void 0 : x.open) == null ? void 0 : m.call(x, c);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsx(
      ta,
      {
        icon: "fa-arrow-left-long",
        iconTone: "text-warning",
        title: "Öncül görevler",
        note: "bu görev başlamadan tamamlanmalı",
        children: r.length === 0 ? /* @__PURE__ */ e.jsx(oe, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : n ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : l.map((c) => {
          const f = c.status == null ? null : ue(c.status);
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
                    onClick: () => p(c.id),
                    className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                    children: c.title || "Başlıksız görev"
                  }
                ),
                f && /* @__PURE__ */ e.jsx(Se, { bg: f.bg, fg: f.fg, children: f.label }),
                !a && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Bağlantıyı kaldır",
                    "aria-label": `${c.title} bağlantısını kaldır`,
                    onClick: () => i(c.id),
                    className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link-slash text-[10px]" })
                  }
                )
              ]
            },
            c.id
          );
        })
      }
    ),
    /* @__PURE__ */ e.jsx(
      ta,
      {
        icon: "fa-arrow-right-long",
        iconTone: "text-primary",
        title: "Ardıl görevler",
        note: "bu görev bitince başlar",
        children: /* @__PURE__ */ e.jsx(
          oe,
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
function Ee() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task) || null;
}
function qr(t) {
  const a = X(), s = ["task-timelogs", t], r = ["task-active-timelog"], o = W({
    queryKey: s,
    queryFn: () => {
      var c;
      return Promise.resolve((c = Ee()) == null ? void 0 : c.getTimeLogs(t));
    },
    enabled: !!t && !!Ee(),
    staleTime: 15e3,
    meta: { persist: !1 },
    retry: !1
  }), l = W({
    queryKey: r,
    /* Kayıt yokken uç 204 döner, proxy undefined çözer; TanStack v5 undefined'ı
       hata sayıp önceki çalışan kaydı ekranda bırakır (sayaç durmazdı). */
    queryFn: () => {
      var c;
      return Promise.resolve((c = Ee()) == null ? void 0 : c.getActiveTimeLog()).then((f) => f ?? null);
    },
    enabled: !!Ee(),
    staleTime: 5e3,
    /* Canlı sayaç kanbandan da başlatılıp durduruluyor; açılışlar arasında taşınmaz. */
    meta: { persist: !1 },
    retry: !1
  }), n = () => {
    a.invalidateQueries({ queryKey: s }), a.invalidateQueries({ queryKey: r });
  }, i = Z({
    mutationFn: () => {
      var c;
      return Promise.resolve((c = Ee()) == null ? void 0 : c.startTimeTracking(t));
    },
    onSuccess: n
  }), p = Z({
    mutationFn: () => {
      var c;
      return Promise.resolve((c = Ee()) == null ? void 0 : c.stopTimeTracking(t));
    },
    onSuccess: n
  });
  return {
    logs: o.data ?? [],
    isLoading: o.isLoading,
    activeLog: l.data ?? null,
    start: i.mutateAsync,
    stop: p.mutateAsync,
    isMutating: i.isPending || p.isPending
  };
}
function aa(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function Yr({ taskId: t, task: a = {} }) {
  const s = qr(t), r = s.activeLog && s.activeLog.taskId === t ? s.activeLog : null, [o, l] = h.useState(() => Date.now());
  h.useEffect(() => {
    if (!r) return;
    const u = setInterval(() => l(Date.now()), 1e3);
    return () => clearInterval(u);
  }, [r]);
  const n = r ? Math.max(0, Math.floor((o - new Date(r.startTime).getTime()) / 1e3)) : 0, p = s.logs.reduce((u, v) => u + (v.secondsSpent || 0), 0) + n, c = (a == null ? void 0 : a.estimatedHours) ?? null, f = c ? c * 3600 : 0, x = f ? Math.min(100, Math.round(p / f * 100)) : 0, m = f ? Math.max(0, f - p) : 0, d = async () => {
    try {
      r ? await s.stop() : await s.start();
    } catch (u) {
      $(u, "Zaman takibi güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-5 flex-wrap p-[22px] rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[18px]", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: d,
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
              children: Us(p)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary", children: r ? "Kayıt sürüyor" : "Sayaç duraklatıldı" })
        ] })
      ] }),
      f > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] font-bold text-text-secondary", children: "Tahmin kullanımı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
            dt(p),
            " / ",
            c,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-warning", style: { width: `${x}%` } }) }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "Kalan tahmini süre: ",
          dt(m)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: ke, children: [
      /* @__PURE__ */ e.jsx(Ue, { title: "Zaman kayıtları" }),
      s.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : s.logs.length === 0 ? /* @__PURE__ */ e.jsx(
        oe,
        {
          icon: "fa-stopwatch",
          title: "Henüz zaman kaydı yok",
          description: "Soldaki yeşil düğmeyle sayacı çalıştırın; durdurduğunuzda kayıt buraya düşer."
        }
      ) : s.logs.map((u) => {
        const v = !u.endTime;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
            children: [
              /* @__PURE__ */ e.jsx(ct, { name: u.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: u.note || u.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                aa(u.startTime),
                " → ",
                v ? "sürüyor" : aa(u.endTime)
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary", children: v ? "Aktif" : dt(u.secondsSpent || 0) })
            ]
          },
          u.id
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
    component: Vs,
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
    component: Hs,
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
    component: Nr,
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
    component: wr,
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
    component: Sr,
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
    component: Ws,
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
    component: Rr,
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
    component: Gr,
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
    component: gr,
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
    component: rr,
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
    component: ar,
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
    component: Zs,
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
    component: tr,
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
    component: Yr,
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
    component: Br,
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
    component: Mr,
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
    component: yr,
    surfaces: ["task", "project", "tasks"]
  }
];
function qa(t = []) {
  const a = new Set(t);
  return Qe.filter((s) => !s.hidden).filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function Ya(t = []) {
  const a = new Set(t);
  return Qe.filter((s) => !s.hidden).filter((s) => !s.isCore).filter((s) => !s.permission || re(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let We = null;
const at = /* @__PURE__ */ new Set(), ht = /* @__PURE__ */ new Set();
let Ze = !1;
function sa() {
  at.forEach((t) => t());
}
function _r(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const V = {
  open(t) {
    const a = _r(t);
    a && (We = a, sa());
  },
  close() {
    We = null, sa();
  },
  subscribe(t) {
    return at.add(t), () => at.delete(t);
  },
  getSnapshot() {
    return We;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && ht.add(t);
  },
  emitResult() {
    Ze = !1, ht.forEach((t) => t());
  },
  /** Adada bir yazma oldu ya da başladı — kapanışta liste/kanban tazelensin. */
  markChanged() {
    Ze = !0;
  },
  /** Yalnız yazma olduysa sonuç yayınlar: salt bakıp kapatmak sayfayı yeniden yüklemez.
      'this' kullanılmaz; metot referansla da geçirilebilir. */
  emitResultIfChanged() {
    Ze && V.emitResult();
  },
  /** Yalnız testler için. */
  reset() {
    We = null, Ze = !1, at.clear(), ht.clear();
  }
}, ra = "apya.taskDetail.fullscreen";
function _a({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, o] = h.useState(t), [l, n] = h.useState([]), { data: i, isPending: p, isError: c, refetch: f } = St(r), x = Ta(), m = Ea(i), d = Ba(), u = Aa(r), [v, b] = h.useState("general"), [g, k] = h.useState(!1), D = Ge.useRef(null), P = h.useMemo(
    () => qa(u.assignedCodes),
    [u.assignedCodes]
  ), T = h.useMemo(
    () => Ya(u.assignedCodes),
    [u.assignedCodes]
  ), I = P.find((E) => E.code === v) ?? P[0];
  Ge.useEffect(() => {
    I.code !== v && b(I.code);
  }, [I, v]);
  const q = I == null ? void 0 : I.component, M = X(), [K, R] = h.useState(
    () => {
      var E;
      return ((E = window.localStorage) == null ? void 0 : E.getItem(ra)) === "1";
    }
  ), [F, G] = h.useState(!1), Q = h.useCallback(() => {
    Pt(), s == null || s();
  }, [s]);
  $a(t, Q), Ge.useEffect(() => {
    m.isDirty ? x.markDirty() : x.markClean();
  });
  const H = h.useCallback(() => x.requestClose(Q), [x, Q]), Y = h.useCallback(() => {
    R((E) => {
      var U;
      const z = !E;
      return (U = window.localStorage) == null || U.setItem(ra, z ? "1" : "0"), z;
    });
  }, []), ee = re("Platform.Tasks.Delete"), [te, C] = h.useState(!1), [A, j] = h.useState(!1), y = h.useCallback(async () => {
    var E, z, U;
    j(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (U = (z = (E = window == null ? void 0 : window.abp) == null ? void 0 : E.notify) == null ? void 0 : z.info) == null || U.call(z, "Başarıyla silindi."), C(!1), x.markClean(), Q();
    } catch (Ce) {
      $(Ce, "Görev silinemedi.");
    } finally {
      j(!1);
    }
  }, [r, x, Q]), B = h.useCallback(async () => {
    var E, z, U;
    if (!m.validate()) return !1;
    G(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, m.toUpdateDto())
      ), await M.invalidateQueries({ queryKey: ["task-detail", r] }), V.emitResult(), (U = (z = (E = window == null ? void 0 : window.abp) == null ? void 0 : E.notify) == null ? void 0 : z.success) == null || U.call(z, "Kaydedildi."), !0;
    } catch (Ce) {
      return $(Ce, "Kaydedilemedi."), !1;
    } finally {
      G(!1);
    }
  }, [r, m, x, M]), O = h.useCallback(() => {
    B();
  }, [B]), ae = h.useCallback(async () => {
    const E = x.resolvePendingClose("save");
    await B() && (E == null || E());
  }, [x, B]), le = h.useCallback((E, z) => {
    x.requestClose(() => {
      n((U) => [...U, { id: r, title: (i == null ? void 0 : i.title) ?? "" }]), o(E), b("general"), x.markClean();
    });
  }, [x, r, i]), ce = h.useCallback((E) => {
    x.requestClose(() => {
      n((z) => {
        const U = z.findIndex((Ce) => Ce.id === E);
        return U === -1 ? z : z.slice(0, U);
      }), o(E), b("general"), x.markClean();
    });
  }, [x]), pe = h.useCallback(async (E) => {
    try {
      await u.addFeature(E), b(E), k(!1);
    } catch (z) {
      $(z, "Özellik eklenemedi.");
    }
  }, [u]), se = h.useCallback(async (E) => {
    try {
      await u.removeFeature(E), b((z) => z === E ? "general" : z);
    } catch (z) {
      $(z, "Özellik kaldırılamadı.");
    }
  }, [u]);
  Ge.useEffect(() => {
    if (!g) return;
    const E = (U) => {
      D.current && !D.current.contains(U.target) && k(!1);
    }, z = (U) => {
      U.key === "Escape" && k(!1);
    };
    return document.addEventListener("mousedown", E), document.addEventListener("keydown", z), () => {
      document.removeEventListener("mousedown", E), document.removeEventListener("keydown", z);
    };
  }, [g]);
  const N = p ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(ye, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(ye, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(ye, { className: "h-24 w-full" })
  ] }) : c && !i ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(J, { variant: "ghost", onClick: () => f(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      Ks,
      {
        trail: l,
        current: { id: r, title: (i == null ? void 0 : i.title) ?? "" },
        onNavigate: ce
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: D, children: [
      /* @__PURE__ */ e.jsx(
        Ls,
        {
          tabs: P,
          activeCode: I.code,
          onSelect: (E) => {
            b(E), k(!1);
          },
          onOpenPicker: () => k((E) => !E),
          pickerOpen: g
        }
      ),
      g && /* @__PURE__ */ e.jsx(
        Ms,
        {
          entries: T,
          busyCode: u.isMutating ? u.mutatingCode : null,
          onAdd: pe,
          onRemove: se
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${I.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          I.code === "general" ? /* @__PURE__ */ e.jsx(
            Bs,
            {
              values: m.values,
              errors: m.errors,
              onFieldChange: m.setField,
              assigneeOptions: d.options,
              isLoadingAssignees: d.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(h.Suspense, { fallback: /* @__PURE__ */ e.jsx(ye, { className: "h-24 w-full" }), children: q && /* @__PURE__ */ e.jsx(
            q,
            {
              taskId: r,
              task: i,
              form: m,
              onOpenSubtask: le
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            As,
            {
              task: i,
              creatorName: d.nameById.get(i.creatorId),
              lastModifierName: d.nameById.get(i.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), _ = a === "page" ? Cs : ks;
  return /* @__PURE__ */ e.jsxs(
    _,
    {
      open: !0,
      fullscreen: K,
      onRequestClose: H,
      title: i ? `Görev Detayı: ${i.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        Ts,
        {
          task: i ?? { title: "Yükleniyor…" },
          canDelete: ee,
          fullscreen: K,
          onToggleFullscreen: Y,
          onClose: H,
          onDelete: () => C(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        $s,
        {
          lastSavedAt: i == null ? void 0 : i.lastModificationTime,
          isDirty: x.isDirty,
          isSaving: F,
          onCancel: H,
          onSave: O
        }
      ),
      children: [
        N,
        x.pendingClose && /* @__PURE__ */ e.jsx(
          Vr,
          {
            isSaving: F,
            onStay: () => x.resolvePendingClose("stay"),
            onDiscard: () => x.resolvePendingClose("discard"),
            onSaveAndClose: ae
          }
        ),
        te && /* @__PURE__ */ e.jsx(
          Ur,
          {
            taskTitle: (i == null ? void 0 : i.title) ?? "",
            busy: A,
            onCancel: () => C(!1),
            onConfirm: y
          }
        )
      ]
    }
  );
}
function Ur({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [o, l] = h.useState(""), n = o.trim() === "SİL";
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
        /* @__PURE__ */ e.jsx(J, { variant: "secondary", onClick: s, disabled: a, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          J,
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
            value: o,
            onChange: (i) => l(i.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function Ua({ label: t, title: a, description: s, children: r, actions: o }) {
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
        /* @__PURE__ */ e.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: o })
      ] })
    }
  );
}
function Vr({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    Ua,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(J, { variant: "secondary", onClick: a, disabled: t, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ e.jsx(J, { variant: "destructive", onClick: s, disabled: t, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ e.jsx(J, { variant: "primary", onClick: r, isLoading: t, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
const Or = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function Qr({ isPrivate: t = !1, onChange: a = () => {
}, disabled: s = !1 }) {
  const r = !!t, [o, l] = h.useState(null);
  return /* @__PURE__ */ e.jsxs(ve, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(je, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
      "button",
      {
        ref: l,
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
    /* @__PURE__ */ e.jsx(Ne, { container: Te(o), children: /* @__PURE__ */ e.jsxs(
      we,
      {
        sideOffset: 8,
        align: "end",
        className: "z-50 w-[360px] rounded-2xl border border-subtle bg-surface-base p-4 shadow-float animate-in fade-in-50 zoom-in-95",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle pb-3 mb-3", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shield-halved text-primary text-base" }),
            /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary", children: "Görünürlük" })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: Or.map((n) => {
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
          /* @__PURE__ */ e.jsx(bs, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const na = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto", Hr = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", Jr = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" },
  { what: "Bağlantı kopyala", key: "⌘ L" }
];
function Wr({ children: t }) {
  return /* @__PURE__ */ e.jsx(Tt, { asChild: !0, children: t });
}
function Zr({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "inline-flex items-center h-[19px] px-1.5 rounded-[5px] border border-default border-b-2 bg-neutral-subtle font-mono text-[10px] font-semibold text-text-secondary", children: t });
}
function Xr({
  task: t = {},
  presentation: a = "modal",
  onClose: s,
  isFullscreen: r,
  onToggleFullscreen: o,
  onFieldChange: l = () => {
  },
  statusValue: n,
  titleValue: i,
  isPrivateValue: p,
  isFavorite: c,
  onToggleFavorite: f,
  isWatched: x,
  onToggleWatch: m,
  onDuplicate: d,
  onArchive: u,
  onDelete: v,
  onOpenTransfer: b,
  onSaveAsTemplate: g,
  onConvertToSubtask: k,
  onExportPdf: D,
  /* Yetki (root hesaplar; sunucudaki EnsureCanMutateTaskAsync ile aynı kural). Eskiden
     menü ve alanlar herkese açıktı, yetkisiz kullanıcı tıklayınca 403 alıyordu. */
  canEdit: P = !0,
  canChangeStatus: T = !0,
  canDelete: I = !0
}) {
  const [q, M] = h.useState(!1), [K, R] = h.useState(null), [F, G] = h.useState(!1), Q = h.useRef(null), H = Te(K), Y = ue(n ?? t.status), ee = t.code || "GRV-—", te = () => {
    var y;
    (y = navigator.clipboard) == null || y.writeText(ee), M(!0), setTimeout(() => M(!1), 1800);
  }, C = () => {
    var y, B, O, ae;
    (y = navigator.clipboard) == null || y.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), (ae = (O = (B = window == null ? void 0 : window.abp) == null ? void 0 : B.notify) == null ? void 0 : O.success) == null || ae.call(O, "Görev bağlantısı panoya kopyalandı.");
  }, A = (y) => () => {
    G(!1), y == null || y();
  }, j = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", kbd: "⌘L", onClick: A(C) },
    { label: "Çoğalt", icon: "fa-copy", kbd: "⌘D", allowed: P, onClick: A(d) },
    { label: "Başka projeye kopyala", icon: "fa-clone", allowed: P, onClick: A(() => b == null ? void 0 : b("copy")) },
    { label: "Şablon olarak kaydet", icon: "fa-bookmark", allowed: P, onClick: A(g) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, allowed: P, onClick: A(() => b == null ? void 0 : b("move")) },
    { label: "Alt göreve dönüştür", icon: "fa-diagram-project", allowed: P, onClick: A(k) },
    { label: x ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: A(m) },
    { label: "Arşivle", icon: "fa-box-archive", separator: !0, allowed: T, onClick: A(u) },
    { label: "Yazdır", icon: "fa-print", kbd: "⌘P", onClick: A(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: A(D) },
    { label: "Sil", icon: "fa-trash-can", kbd: "⌫", separator: !0, danger: !0, allowed: I, onClick: A(v) }
  ].filter((y) => y.allowed !== !1);
  return /* @__PURE__ */ e.jsxs("header", { ref: R, className: "shrink-0 px-6 lt-860:px-4 pt-[18px] pb-4 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: te,
            title: "Kodu kopyala",
            className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[11px] font-bold tracking-[.04em] cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[9px] opacity-70" }),
              /* @__PURE__ */ e.jsx("span", { children: ee }),
              /* @__PURE__ */ e.jsx("i", { className: `${q ? "fa-solid fa-check" : "fa-regular fa-copy"} text-[9px] opacity-60` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(ve, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(je, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              disabled: !P,
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] border border-default text-[12px] font-semibold ${P ? "cursor-pointer" : "cursor-default"} ${Y.bg} ${Y.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-current animate-pulse" }),
                /* @__PURE__ */ e.jsx("span", { children: Y.label }),
                P && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(Ne, { container: H, children: /* @__PURE__ */ e.jsxs(we, { sideOffset: 6, align: "start", className: `${na} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            rt.map((y) => {
              const B = Ca[y], O = (n ?? t.status) === y;
              return /* @__PURE__ */ e.jsx(Wr, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => l("status", y),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${O ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${B.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: B.label }),
                    O && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, y);
            })
          ] }) })
        ] }),
        x && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 h-[26px] px-2.5 rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11.5px] font-semibold", children: [
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
          Qr,
          {
            isPrivate: p ?? !!t.isPrivate,
            onChange: (y) => l("isPrivate", y),
            disabled: !P
          }
        ) }),
        /* @__PURE__ */ e.jsx("div", { className: "h-5 w-px bg-border-default mx-1" }),
        a === "modal" && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: o,
            title: r ? "Küçült" : "Tam ekran",
            className: `mobile:hidden flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${r ? "bg-primary-subtle text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r ? "fa-compress" : "fa-expand"} text-[12px]` })
          }
        ),
        /* @__PURE__ */ e.jsxs(ve, { modal: !0, open: F, onOpenChange: G, children: [
          /* @__PURE__ */ e.jsx(je, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer seçenekler",
              className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${F ? "bg-surface-hover text-text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(Ne, { container: H, children: /* @__PURE__ */ e.jsxs(
            we,
            {
              sideOffset: 6,
              align: "end",
              collisionBoundary: H ?? [],
              collisionPadding: 12,
              className: `${na} w-[244px]`,
              children: [
                j.map((y) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: y.onClick,
                    className: [
                      Hr,
                      y.danger ? "text-negative" : "text-text-secondary",
                      y.separator ? "border-t border-subtle mt-[5px]" : ""
                    ].join(" "),
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${y.icon} text-[11px] w-[14px] opacity-75` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: y.label }),
                      y.kbd && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: y.kbd })
                    ]
                  },
                  y.label
                )),
                /* @__PURE__ */ e.jsxs("div", { className: "mt-1.5 pt-[9px] px-[9px] pb-[7px] border-t border-subtle", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 mb-[7px]", children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-keyboard text-[11px] text-text-tertiary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-[.09em] text-text-tertiary", children: "Kısayollar" })
                  ] }),
                  Jr.map((y) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: y.what }),
                    /* @__PURE__ */ e.jsx(Zr, { children: y.key })
                  ] }, y.what))
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
          contentEditable: P,
          suppressContentEditableWarning: !0,
          spellCheck: !1,
          onBlur: P ? (y) => l("title", y.currentTarget.textContent.trim()) : void 0,
          className: `flex-1 min-w-0 text-[24px] lt-560:text-[20px] font-extrabold tracking-[-.025em] leading-[1.2] text-text-primary px-2 -ml-2 py-[3px] rounded-[9px] border border-transparent ${P ? "cursor-text hover:bg-neutral-subtle hover:border-subtle focus:bg-neutral-subtle focus:border-focus focus:shadow-focus focus:outline-none" : ""}`,
          children: i ?? t.title ?? "Başlıksız görev"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: f,
          title: c ? "Favorilerden çıkar" : "Favorilere ekle",
          className: `flex items-center justify-center h-8 w-8 shrink-0 rounded-[9px] cursor-pointer ${c ? "bg-warning-subtle text-warning" : "text-text-tertiary hover:bg-surface-hover"}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${c ? "solid" : "regular"} fa-star text-[15px]` })
        }
      )
    ] })
  ] });
}
const Xe = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", ia = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function be({ children: t }) {
  return /* @__PURE__ */ e.jsx(Tt, { asChild: !0, children: t });
}
function de({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[7px] min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.08em] text-text-tertiary select-none", children: t }),
    a
  ] });
}
function la({ name: t, size: a = 26 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Oe(t), fontSize: a * 0.38 },
      children: Ve(t)
    }
  );
}
function oa(t) {
  if (t == null) return "—";
  const a = Math.max(0, Math.round(Number(t) * 60)), s = Math.floor(a / 60), r = a % 60;
  return s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function en({
  task: t = {},
  assigneeOptions: a = [],
  projectOptions: s = [],
  onFieldChange: r = () => {
  },
  statusValue: o,
  priorityValue: l,
  assigneeValue: n,
  projectValue: i,
  dueDateValue: p,
  startDateValue: c,
  tagsValue: f = [],
  progressPercent: x = 0,
  progressNote: m = "",
  onOpenTransfer: d,
  /* Düzenleme yetkisi yoksa ızgara salt okunur: tüm alanlar forma, oradan UpdateAsync'e
     gider; yetkisiz kullanıcı değiştirip Kaydet'te 403 alıyordu. */
  readOnly: u = !1
}) {
  var A, j;
  const [v, b] = h.useState(""), [g, k] = h.useState(""), [D, P] = h.useState(""), [T, I] = h.useState(!1), [q, M] = h.useState(null), K = ue(o ?? t.status), R = ot(l ?? t.priority), F = n ?? t.assigneeId ?? null, G = i ?? t.projectId ?? null, Q = ((A = a.find((y) => y.value === F)) == null ? void 0 : A.label) || t.assigneeName || "Atanmamış", H = ((j = s.find((y) => y.value === G)) == null ? void 0 : j.label) || t.projectName || "Projesiz", Y = wa(p ?? t.dueDate), ee = a.filter(
    (y) => !v || y.label.toLowerCase().includes(v.toLowerCase())
  ), te = s.filter(
    (y) => !g || y.label.toLowerCase().includes(g.toLowerCase())
  ), C = () => {
    const y = D.trim();
    y && !f.includes(y) && r("tagNames", [...f, y]), P(""), I(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { ref: M, className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsx(
    "fieldset",
    {
      disabled: u,
      className: "m-0 p-0 border-0 min-w-0 [&:disabled_label]:pointer-events-none [&_:disabled]:pointer-events-none [&:disabled_.fa-chevron-down]:hidden",
      children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6", children: [
        /* @__PURE__ */ e.jsx(de, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(ve, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(je, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx(la, { name: F ? Q : null }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: Q }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(Ne, { container: Te(q), children: /* @__PURE__ */ e.jsxs(we, { sideOffset: 6, align: "start", className: `${Xe} w-[264px]`, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: v,
                  onChange: (y) => b(y.target.value),
                  placeholder: "Kişi ara…",
                  className: ia
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[230px] overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("assigneeId", null),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] text-left cursor-pointer ${F ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary font-semibold"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "flex h-6 w-6 items-center justify-center rounded-full bg-neutral-subtle text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-user-slash text-[9px]" }) }),
                    /* @__PURE__ */ e.jsx("span", { children: "Atanmamış" })
                  ]
                }
              ) }),
              a.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-2 py-1.5 text-[12px] text-text-tertiary", children: "Kullanıcı listesi yükleniyor…" }),
              ee.map((y) => /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("assigneeId", y.value),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${F === y.value ? "bg-primary-subtle" : "hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx(la, { name: y.label, size: 24 }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: y.label }),
                    F === y.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
                  ]
                }
              ) }, y.value))
            ] })
          ] }) })
        ] }) }),
        /* @__PURE__ */ e.jsxs(de, { label: "Son tarih", children: [
          /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-regular fa-calendar text-[13px] ${Y.tone}` }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "date",
                value: (p ?? t.dueDate ?? "").slice(0, 10),
                onChange: (y) => r("dueDate", y.target.value),
                className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
              }
            )
          ] }),
          Y.hint && /* @__PURE__ */ e.jsx("span", { className: `-mt-0.5 text-[10.5px] font-semibold ${Y.tone}`, children: Y.hint })
        ] }),
        /* @__PURE__ */ e.jsx(de, { label: "Başlangıç", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[13px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "date",
              value: (c ?? t.startDate ?? "").slice(0, 10),
              onChange: (y) => r("startDate", y.target.value),
              className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
            }
          )
        ] }) }),
        /* @__PURE__ */ e.jsx(de, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 pt-[5px]", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
            /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: [
              "%",
              x
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-medium text-text-tertiary", children: m })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "h-1.5 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
            "div",
            {
              className: "h-full rounded-full bg-primary transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
              style: { width: `${x}%` }
            }
          ) })
        ] }) }),
        /* @__PURE__ */ e.jsx(de, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(ve, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(je, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${K.bg} ${K.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${K.icon} text-[11px]` }),
                /* @__PURE__ */ e.jsx("span", { children: K.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(Ne, { container: Te(q), children: /* @__PURE__ */ e.jsxs(we, { sideOffset: 6, align: "start", className: `${Xe} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            rt.map((y) => {
              const B = Ca[y], O = (o ?? t.status) === y;
              return /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("status", y),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${O ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${B.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: B.label }),
                    O && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, y);
            })
          ] }) })
        ] }) }) }),
        /* @__PURE__ */ e.jsx(de, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(ve, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(je, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
          /* @__PURE__ */ e.jsx(Ne, { container: Te(q), children: /* @__PURE__ */ e.jsxs(we, { sideOffset: 6, align: "start", className: `${Xe} w-[184px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
            ms.map((y) => {
              const B = fs[y], O = (l ?? t.priority) === y;
              return /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("priority", y),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${O ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${B.icon} text-[11px] w-[13px]` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: B.label }),
                    O && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, y);
            })
          ] }) })
        ] }) }) }),
        /* @__PURE__ */ e.jsx(de, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap min-h-8", children: [
          f.map((y) => /* @__PURE__ */ e.jsxs(
            "span",
            {
              className: "inline-flex items-center gap-1.5 h-6 px-2 rounded-[7px] border border-primary bg-primary-subtle text-primary text-[11.5px] font-bold",
              children: [
                /* @__PURE__ */ e.jsx("span", { children: y }),
                !u && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Etiketi kaldır",
                    onClick: () => r("tagNames", f.filter((B) => B !== y)),
                    className: "flex items-center p-0 border-0 bg-transparent text-current opacity-55 hover:opacity-100 hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
                  }
                )
              ]
            },
            y
          )),
          u ? f.length === 0 && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "—" }) : T ? /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: D,
              onChange: (y) => P(y.target.value),
              onBlur: C,
              onKeyDown: (y) => {
                y.key === "Enter" && C(), y.key === "Escape" && (P(""), I(!1));
              },
              placeholder: "Etiket…",
              className: "h-6 w-24 px-2 rounded-[7px] border border-focus bg-surface-base text-text-primary text-[11.5px] shadow-focus focus:outline-none"
            }
          ) : /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              "aria-label": "Yeni etiket ekle",
              onClick: () => I(!0),
              className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-dashed border-strong bg-transparent text-text-tertiary text-[11.5px] font-semibold hover:border-focus hover:text-primary hover:bg-primary-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[9px]" }),
                "Etiket"
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ e.jsx(de, { label: "Proje", children: /* @__PURE__ */ e.jsxs(ve, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(je, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-[13px] text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: H }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(Ne, { container: Te(q), children: /* @__PURE__ */ e.jsxs(we, { sideOffset: 6, align: "start", className: `${Xe} w-[250px]`, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: g,
                  onChange: (y) => k(y.target.value),
                  placeholder: "Proje ara…",
                  className: ia
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[210px] overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("projectId", null),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${G ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-neutral-400" }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Projesiz" })
                  ]
                }
              ) }),
              te.map((y) => /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("projectId", y.value),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${G === y.value ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-primary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: y.label }),
                    G === y.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
                  ]
                }
              ) }, y.value))
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-[7px] pt-[7px] border-t border-subtle", children: [
              /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => d == null ? void 0 : d("move"),
                  className: "flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left text-text-secondary hover:bg-surface-hover hover:text-primary cursor-pointer",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[11px] w-[14px] opacity-70" }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Başka projeye taşı…" })
                  ]
                }
              ) }),
              /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => d == null ? void 0 : d("copy"),
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
        /* @__PURE__ */ e.jsx(de, { label: "Harcanan / tahmin", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[9px] h-8", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock text-[13px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[13px] font-bold text-text-primary", children: oa(t.spentHours ?? 0) }),
          /* @__PURE__ */ e.jsxs("span", { className: "text-[12px] text-text-tertiary", children: [
            "/ ",
            t.estimatedHours != null ? oa(t.estimatedHours) : "—"
          ] })
        ] }) })
      ] })
    }
  ) });
}
const tn = "z-popover w-[225px] rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto";
function At({ entries: t = [], onPick: a, children: s }) {
  const [r, o] = h.useState(null), l = Te(r);
  return /* @__PURE__ */ e.jsx("span", { ref: o, className: "contents", children: /* @__PURE__ */ e.jsxs(ve, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(je, { asChild: !0, children: s }),
    /* @__PURE__ */ e.jsx(Ne, { container: l, children: /* @__PURE__ */ e.jsxs(we, { sideOffset: 6, align: "start", collisionPadding: 12, className: tn, children: [
      /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Özellik ekle" }),
      t.map((n) => /* @__PURE__ */ e.jsx(Tt, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
function an({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: o,
  onDragEnd: l,
  onReorderTo: n,
  onReorderDrop: i,
  pickerEntries: p = [],
  onPickFeature: c,
  counts: f = {},
  isDirty: x = !1
}) {
  const [m, d] = h.useState(!1);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-6 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 py-2.5 flex-1 min-w-0 overflow-x-auto custom-scrollbar", children: [
      s.map((u) => {
        const v = t === u.code, b = f[u.code] || 0;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            draggable: !0,
            title: "Sürükleyerek sırayı değiştirin",
            ...Da(() => a(u.code)),
            onDragStart: (g) => {
              o(u.code);
              try {
                g.dataTransfer.effectAllowed = "move", g.dataTransfer.setData("text/plain", u.code);
              } catch {
              }
            },
            onDragOver: (g) => {
              g.preventDefault(), n(u.code);
            },
            onDrop: (g) => {
              g.preventDefault(), i == null || i();
            },
            onDragEnd: l,
            className: [
              "flex shrink-0 items-center gap-2 h-[34px] px-[13px] rounded-[10px]",
              "text-[12.5px] whitespace-nowrap cursor-grab active:cursor-grabbing",
              "transition-opacity duration-fast",
              v ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
              r === u.code ? "opacity-35" : "opacity-100"
            ].join(" "),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-[11px] opacity-85` }),
              /* @__PURE__ */ e.jsx("span", { children: u.title }),
              b > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                "rounded-full text-[10px] font-extrabold",
                v ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
              ].join(" "), children: b })
            ]
          },
          u.code
        );
      }),
      /* @__PURE__ */ e.jsx(At, { entries: p, onPick: c, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          title: "Özellik ekle",
          onClick: () => d(!1),
          onMouseEnter: () => d(!0),
          onMouseLeave: () => d(!1),
          className: [
            "flex shrink-0 items-center gap-[7px] h-[34px] ml-1 rounded-[10px]",
            "border border-dashed border-primary bg-primary-subtle text-primary",
            "text-[12.5px] font-bold whitespace-nowrap cursor-pointer",
            "hover:border-solid",
            "transition-[padding] duration-[160ms] ease-[cubic-bezier(.16,1,.3,1)]",
            m ? "px-[13px]" : "px-[11px]"
          ].join(" "),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            m && /* @__PURE__ */ e.jsx("span", { className: "animate-fade-in-fast", children: "Özellik ekle" })
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
function sn({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: o,
  onDragEnd: l,
  onReorderTo: n,
  onReorderDrop: i,
  pickerEntries: p = [],
  onPickFeature: c,
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
          const m = t === x.code, d = f[x.code] || 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              draggable: !0,
              title: "Sürükleyerek sırayı değiştirin",
              ...Da(() => a(x.code)),
              onDragStart: (u) => {
                o(x.code);
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
              onDragEnd: l,
              className: [
                "flex shrink-0 items-center gap-[11px] h-9 px-[11px] rounded-[9px]",
                "text-[12.5px] text-left cursor-grab active:cursor-grabbing",
                "transition-opacity duration-fast",
                m ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
                r === x.code ? "opacity-35" : "opacity-100"
              ].join(" "),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${x.icon} text-[12px] w-[15px] opacity-85` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: x.title }),
                d > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                  "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                  "rounded-full text-[10px] font-extrabold",
                  m ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
                ].join(" "), children: d })
              ]
            },
            x.code
          );
        }),
        /* @__PURE__ */ e.jsx(At, { entries: p, onPick: c, children: /* @__PURE__ */ e.jsxs(
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
function Be({ label: t, value: a, avatarName: s }) {
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
const ca = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "—";
function rn({ task: t = {}, nameById: a }) {
  const s = (l, n) => {
    var i;
    return l || n && ((i = a == null ? void 0 : a.get) == null ? void 0 : i.call(a, n)) || null;
  }, r = s(t.creatorName, t.creatorId), o = t.lastModificationTime ? s(t.lastModifierName, t.lastModifierId) : null;
  return /* @__PURE__ */ e.jsx("aside", { className: "flex flex-col gap-3.5 min-w-0", children: /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsx(Be, { label: "Oluşturan", value: r || "Bilinmiyor", avatarName: r }),
    /* @__PURE__ */ e.jsx(Be, { label: "Oluşturma tarihi", value: ca(t.creationTime) }),
    /* @__PURE__ */ e.jsx(Be, { label: "Güncelleyen", value: o || "—", avatarName: o }),
    /* @__PURE__ */ e.jsx(Be, { label: "Son güncelleme", value: ca(t.lastModificationTime) }),
    /* @__PURE__ */ e.jsx(Be, { label: "Görev tipi", value: t.taskType }),
    /* @__PURE__ */ e.jsx(Be, { label: "Sprint", value: t.sprint })
  ] }) });
}
const da = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
function bt({ name: t, size: a = 32 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Oe(t), fontSize: a * 0.34 },
      children: Ve(t)
    }
  );
}
function xa({ open: t, onClick: a }) {
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
const ua = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function nn({
  task: t = {},
  onFieldChange: a = () => {
  },
  descriptionValue: s,
  checklist: r,
  currentUserName: o = "Ben",
  /* Düzenleme yetkisi yoksa açıklama ve kontrol listesi salt okunur. Yorumlar açık
     kalır: görevi görebilen herkes yorum yazabilir (ürün kararı, 2026-09-28). */
  readOnly: l = !1
}) {
  const n = t == null ? void 0 : t.id, i = X(), [p, c] = h.useState(!0), [f, x] = h.useState(""), m = (r == null ? void 0 : r.items) ?? [], d = m.filter((j) => j.isDone).length, u = m.length ? Math.round(d / m.length * 100) : 0, v = async () => {
    const j = f.trim();
    if (!(!j || !n)) {
      x("");
      try {
        await r.addItem(j);
      } catch (y) {
        x((B) => B || j), $(y, "Madde eklenemedi.");
      }
    }
  }, [b, g] = h.useState(!0), [k, D] = h.useState(""), [P, T] = h.useState(!1), [I, q] = h.useState(!1), [M, K] = h.useState(null), [R, F] = h.useState(""), [G, Q] = h.useState({}), { data: H = [] } = W({
    queryKey: ["task-comments", n],
    queryFn: () => {
      var j, y, B, O;
      return Promise.resolve((O = (B = (y = (j = window == null ? void 0 : window.apya) == null ? void 0 : j.platform) == null ? void 0 : y.tasks) == null ? void 0 : B.task) == null ? void 0 : O.getComments(n));
    },
    enabled: !!n,
    staleTime: 1e4,
    meta: { persist: !1 }
  }), Y = async () => {
    await i.invalidateQueries({ queryKey: ["task-comments", n] }), await i.invalidateQueries({ queryKey: ["task-detail", n] });
  }, ee = async () => {
    const j = k.trim();
    if (!(!j || !n || I)) {
      q(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.addComment(n, j)), await Y(), D("");
      } catch (y) {
        $(y, "Yorum gönderilemedi.");
      } finally {
        q(!1);
      }
    }
  }, te = async (j) => {
    const y = R.trim();
    if (!(!y || !n))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.replyToComment(j, y)), await Y(), F(""), K(null);
      } catch (B) {
        $(B, "Yanıt gönderilemedi.");
      }
  }, C = (j) => Q((y) => {
    const B = y[j] ?? { liked: !1, count: 0 };
    return { ...y, [j]: { liked: !B.liked, count: B.count + (B.liked ? -1 : 1) } };
  }), A = !!k.trim() && !I;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-[9px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Açıklama" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Zengin metin · WYSIWYG" })
      ] }),
      /* @__PURE__ */ e.jsx(
        ka,
        {
          value: s ?? t.description ?? "",
          onChange: (j) => a("description", j),
          mentionName: o,
          readOnly: l
        },
        n
      )
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: da, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
            d,
            "/",
            m.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(xa, { open: p, onClick: () => c((j) => !j) })
      ] }),
      p && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 mt-3.5", children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
            style: { width: `${u}%` }
          }
        ) }),
        m.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              disabled: l,
              "aria-label": j.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
              onClick: () => r.toggleItem(j.id).catch((y) => $(y, "Durum güncellenemedi.")),
              className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${l ? "cursor-default" : "cursor-pointer"} transition-colors duration-fast ${j.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
              children: j.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${j.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: j.text }),
          !l && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              onClick: () => r.removeItem(j.id).catch((y) => $(y, "Madde silinemedi.")),
              className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
            }
          )
        ] }, j.id)),
        !l && /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            value: f,
            onChange: (j) => x(j.target.value),
            onKeyDown: (j) => {
              j.key === "Enter" && v();
            },
            placeholder: "Yeni madde yaz ve Enter'a bas…",
            className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: da, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Yorumlar & güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: H.length })
        ] }),
        /* @__PURE__ */ e.jsx(xa, { open: b, onClick: () => g((j) => !j) })
      ] }),
      b && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(bt, { name: o }),
          /* @__PURE__ */ e.jsxs("div", { className: `flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${P ? "border-focus bg-surface-base shadow-focus" : "border-default bg-surface-raised"}`, children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                rows: 2,
                value: k,
                onChange: (j) => D(j.target.value),
                onFocus: () => T(!0),
                onBlur: () => T(!1),
                onKeyDown: (j) => {
                  j.key === "Enter" && (j.ctrlKey || j.metaKey) && (j.preventDefault(), ee());
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
              ].map((j) => /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  title: j.title,
                  onMouseDown: (y) => y.preventDefault(),
                  onClick: () => D((y) => y + j.add),
                  className: "flex items-center justify-center h-7 w-7 rounded-[7px] text-text-tertiary hover:bg-surface-hover hover:text-primary cursor-pointer",
                  children: /* @__PURE__ */ e.jsx("i", { className: `${j.icon} text-[12px]` })
                },
                j.title
              )) }),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: ee,
                  disabled: !A,
                  className: `flex items-center gap-[7px] h-[30px] px-3.5 rounded-[9px] text-[12px] font-bold shadow-xs ${A ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${I ? "fa-circle-notch fa-spin" : "fa-paper-plane"} text-[10px]` }),
                    "Gönder"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1", children: H.map((j) => {
          const y = G[j.id] ?? { liked: !1, count: 0 };
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start py-3 border-t border-subtle", children: [
            /* @__PURE__ */ e.jsx(bt, { name: j.authorName }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: j.authorName }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: ua(j.creationTime) })
              ] }),
              /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[13px] leading-[1.65] text-text-secondary whitespace-pre-wrap", children: j.text }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 mt-[3px]", children: [
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => C(j.id),
                    className: `flex items-center gap-1.5 h-[26px] px-[9px] rounded-full border text-[11px] font-semibold cursor-pointer ${y.liked ? "border-primary bg-primary-subtle text-primary" : "border-default bg-transparent text-text-tertiary hover:border-focus"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-thumbs-up text-[10px]" }),
                      y.count
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      K((B) => B === j.id ? null : j.id), F("");
                    },
                    className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-full text-text-tertiary text-[11px] font-semibold hover:bg-surface-hover hover:text-primary cursor-pointer",
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                      "Yanıtla"
                    ]
                  }
                )
              ] }),
              M === j.id && /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 mt-2 animate-fade-in-fast", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: R,
                    onChange: (B) => F(B.target.value),
                    onKeyDown: (B) => {
                      B.key === "Enter" && te(j.id);
                    },
                    placeholder: `@${j.authorName} kullanıcısına yanıt ver…`,
                    className: "flex-1 h-8 px-3 rounded-[9px] border border-focus bg-surface-base text-text-primary text-[12px] shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => te(j.id),
                    className: "h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover",
                    children: "Yanıtla"
                  }
                )
              ] }),
              (j.replies ?? []).map((B) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] mt-2.5 pl-3 border-l-2 border-default", children: [
                /* @__PURE__ */ e.jsx(bt, { name: B.authorName, size: 24 }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: B.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: ua(B.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-[3px] mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: B.text })
                ] })
              ] }, B.id))
            ] })
          ] }, j.id);
        }) })
      ] })
    ] })
  ] });
}
function ln({
  lastSavedAt: t,
  isDirty: a,
  isSaving: s,
  justSaved: r,
  onCancel: o,
  onSave: l
}) {
  const n = t ? new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(t)) : "—", i = s ? "fa-solid fa-circle-notch fa-spin" : r ? "fa-solid fa-check" : "fa-regular fa-floppy-disk", p = s ? "Kaydediliyor…" : r ? "Kaydedildi" : "Kaydet", c = a && !s;
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
          onClick: o,
          className: "h-9 px-4 rounded-[10px] border border-default bg-surface-base text-text-secondary text-[13px] font-semibold hover:bg-surface-hover hover:text-text-primary cursor-pointer",
          children: "Vazgeç"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: l,
          disabled: !c,
          className: `flex items-center gap-2 h-9 px-[22px] rounded-[10px] text-white text-[13px] font-bold shadow-sm ${c ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `${i} text-[11px]` }),
            p
          ]
        }
      )
    ] })
  ] });
}
const on = Object.fromEntries(Qe.map((t) => [t.code, t])), cn = {
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
}, dn = /* @__PURE__ */ new Set([
  "risks",
  "dashboard",
  "comments",
  "emails",
  "custom-fields",
  "approvals",
  "ai",
  "automations"
]), xn = (t) => dn.has(t);
function un(t) {
  const a = on[t], s = cn[t];
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
function pa({ code: t, onRemoveFeature: a, pickerEntries: s = [], onPickFeature: r, canRemove: o = !0 }) {
  const l = un(t) ?? { title: t, desc: "", icon: "fa-cube", bg: "bg-neutral-subtle", fg: "text-text-secondary" };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-3 py-14 px-6 rounded-2xl border border-dashed border-strong bg-surface-base text-center", children: [
    /* @__PURE__ */ e.jsx("span", { className: `flex items-center justify-center h-14 w-14 rounded-2xl ${l.bg} ${l.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l.icon} text-[22px]` }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-w-[420px]", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: l.title }),
      l.desc && /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] leading-[1.6] text-text-secondary", children: l.desc }),
      /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-center gap-[7px] mt-1.5 text-[11.5px] font-semibold text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-person-digging text-[11px]" }),
        "Bu sekme yapım aşamasında."
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 mt-1.5", children: [
      o && /* @__PURE__ */ e.jsxs(
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
      /* @__PURE__ */ e.jsx(At, { entries: s, onPick: r, children: /* @__PURE__ */ e.jsxs(
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
    gs,
    {
      open: t,
      onOpenChange: (o) => {
        o || a == null || a();
      },
      children: /* @__PURE__ */ e.jsxs(ys, { children: [
        /* @__PURE__ */ e.jsx(vs, { className: "fixed inset-0", style: { pointerEvents: "none" } }),
        /* @__PURE__ */ e.jsx(js, { asChild: !0, "aria-describedby": void 0, children: /* @__PURE__ */ e.jsxs("div", { className: "fixed inset-0 z-modal", children: [
          /* @__PURE__ */ e.jsx(Ns, { className: "sr-only", children: s }),
          r
        ] }) })
      ] })
    }
  );
}
const pn = [
  { key: "subtasks", label: "Alt görevler", countKey: "subtasks", unit: "alt görev" },
  { key: "checklist", label: "Kontrol listesi", countKey: "checklist", unit: "madde" },
  { key: "comments", label: "Yorumlar", countKey: "comments", unit: "yorum" },
  { key: "files", label: "Dosyalar", countKey: "files", unit: "dosya" },
  { key: "keepAssignee", label: "Sorumluyu koru", desc: "Aksi halde atanmamış gelir" },
  { key: "keepLinks", label: "Bağımlılıkları koru", desc: "Öncül / ardıl bağlantılar" },
  { key: "shiftDates", label: "Tarihleri bugüne kaydır", desc: "Başlangıç ve son tarih ötelenir" }
], ma = {
  subtasks: !0,
  checklist: !0,
  comments: !1,
  files: !0,
  keepAssignee: !0,
  keepLinks: !0,
  shiftDates: !1
};
function mn({ on: t, onClick: a, label: s }) {
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
function fn({
  open: t,
  mode: a = "move",
  onClose: s,
  onConfirm: r,
  projectOptions: o = [],
  currentProjectId: l,
  counts: n = {},
  onCreateProject: i
}) {
  const [p, c] = h.useState(a), [f, x] = h.useState([]), [m, d] = h.useState(""), [u, v] = h.useState(""), [b, g] = h.useState(ma), [k, D] = h.useState(!1);
  h.useEffect(() => {
    t && (c(a), x([]), d(""), v(""), g(ma));
  }, [t, a]);
  const P = h.useMemo(
    () => o.filter((C) => C.value && C.value !== l),
    [o, l]
  ), T = P.filter((C) => !m || C.label.toLowerCase().includes(m.toLowerCase())), I = P.length > 0 && f.length === P.length;
  if (!t) return null;
  const q = (C) => x((A) => A.includes(C) ? A.filter((j) => j !== C) : [...A, C]), M = (C) => {
    var A;
    return ((A = o.find((j) => j.value === C)) == null ? void 0 : A.label) ?? "";
  }, K = async () => {
    const C = u.trim();
    if (!(!C || k)) {
      D(!0);
      try {
        const A = await (i == null ? void 0 : i(C));
        A && x((j) => [...j, A]), v("");
      } catch (A) {
        $(A, "Proje oluşturulamadı.");
      } finally {
        D(!1);
      }
    }
  }, R = async () => {
    if (!(!f.length || k)) {
      D(!0);
      try {
        await (r == null ? void 0 : r({ mode: p, targetProjectIds: f, include: b }));
      } finally {
        D(!1);
      }
    }
  }, F = p === "move", G = f.length, Q = F ? G > 1 ? "Taşı ve kopyala" : "Taşı" : G > 1 ? `${G} projeye kopyala` : "Kopyala", H = Object.values(b).filter(Boolean).length, Y = f.map(M).filter(Boolean), ee = Y.length ? `${Y.length > 2 ? `${Y.slice(0, 2).join(", ")} +${Y.length - 2}` : Y.join(", ")} · ${H} seçenek açık` : `Proje seçilmedi · ${H} seçenek açık`, te = (C) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${C ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return /* @__PURE__ */ e.jsx(Va, { open: t, onClose: s, label: F ? "Başka projeye taşı" : "Başka projelere kopyala", children: /* @__PURE__ */ e.jsx(
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
          onClick: (C) => C.stopPropagation(),
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
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => c("move"), className: te(F), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[10px]" }),
                "Taşı"
              ] }),
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => c("copy"), className: te(!F), children: [
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
                      onClick: () => x(I ? [] : P.map((C) => C.value)),
                      className: "p-0 border-0 bg-transparent text-primary text-[11px] font-bold cursor-pointer hover:underline",
                      children: I ? "Seçimi temizle" : "Tümünü seç"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: m,
                      onChange: (C) => d(C.target.value),
                      placeholder: "Proje ara…",
                      className: "w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar", children: [
                  T.map((C) => {
                    const A = f.includes(C.value), j = F && f[0] === C.value;
                    return /* @__PURE__ */ e.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => q(C.value),
                        className: `flex items-center gap-[11px] px-3 py-[11px] rounded-[11px] border text-left cursor-pointer hover:border-focus ${A ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                        children: [
                          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] rounded-[5px] border-[1.5px] text-white ${A ? "bg-primary border-primary" : "bg-transparent border-strong"}`, children: A && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" }) }),
                          /* @__PURE__ */ e.jsx("span", { className: "h-2.5 w-2.5 shrink-0 rounded-[3px] bg-primary" }),
                          /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: C.label }),
                          j && /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center h-5 px-2 rounded-md bg-primary text-white text-[10px] font-extrabold", children: "TAŞINACAK" })
                        ]
                      },
                      C.value
                    );
                  }),
                  T.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "py-6 text-center text-[12px] text-text-tertiary", children: "Uygun proje bulunamadı." })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[7px] mt-1", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: u,
                      onChange: (C) => v(C.target.value),
                      onKeyDown: (C) => {
                        C.key === "Enter" && (C.preventDefault(), K());
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
                      onClick: K,
                      disabled: !u.trim() || k,
                      className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-plus text-[12px]" })
                    }
                  )
                ] }),
                F && G > 1 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle", children: [
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
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: pn.map((C) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-px", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary", children: C.label }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: C.countKey ? `${n[C.countKey] ?? 0} ${C.unit}` : C.desc })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    mn,
                    {
                      on: b[C.key],
                      label: C.label,
                      onClick: () => g((A) => ({ ...A, [C.key]: !A[C.key] }))
                    }
                  )
                ] }, C.key)) })
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
                    onClick: R,
                    disabled: !G || k,
                    className: `flex items-center gap-2 h-9 px-5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${G && !k ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${k ? "fa-circle-notch fa-spin" : "fa-arrow-right"} text-[10px]` }),
                      Q
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
const hn = [
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
function bn(t = "") {
  var s;
  const a = (s = t.split(".").pop()) == null ? void 0 : s.toLowerCase();
  return a === "pdf" ? Re.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(a) ? Re.img : ["doc", "docx", "odt", "rtf"].includes(a) ? Re.doc : ["json", "js", "ts", "cs", "xml", "yml", "yaml"].includes(a) ? Re.code : Re.other;
}
const gn = (t) => t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : "—", yn = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—", vn = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—";
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
function jn({
  subtaskId: t,
  parentCode: a,
  onClose: s,
  onOpenFull: r,
  onDeleted: o,
  currentUserName: l = "Ben"
}) {
  var ce, pe, se;
  const n = X(), { data: i } = St(t), p = Bt(t), c = Et(t), [f, x] = h.useState("general"), [m, d] = h.useState(""), [u, v] = h.useState(""), [b, g] = h.useState(""), k = h.useRef(null), D = h.useRef(null);
  i && D.current !== i.id && (D.current = i.id, d(i.description ?? ""));
  const { data: P = [] } = W({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var N, _, E, z;
      return Promise.resolve((z = (E = (_ = (N = window == null ? void 0 : window.apya) == null ? void 0 : N.platform) == null ? void 0 : _.tasks) == null ? void 0 : E.task) == null ? void 0 : z.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4,
    meta: { persist: !1 }
  });
  if (h.useEffect(() => {
    const N = (_) => {
      _.key === "Escape" && (_.stopPropagation(), s == null || s());
    };
    return window.addEventListener("keydown", N), () => window.removeEventListener("keydown", N);
  }, [s]), !i) return null;
  const { canEdit: T, canChangeStatus: I, canDelete: q } = _e(i), M = (se = (pe = (ce = window == null ? void 0 : window.apya) == null ? void 0 : ce.platform) == null ? void 0 : pe.tasks) == null ? void 0 : se.task, K = ue(i.status), R = ot(i.priority), F = p.items ?? [], G = F.filter((N) => N.isDone).length, Q = F.length ? Math.round(G / F.length * 100) : 0, H = c.attachments ?? [], Y = { checklist: F.length, comments: P.length, files: H.length }, ee = async () => {
    await n.invalidateQueries({ queryKey: ["task-detail", t] });
  }, te = async (N) => {
    try {
      await Promise.resolve(N()), await ee();
    } catch (_) {
      $(_, "Alt görev güncellenemedi.");
    }
  }, C = (N) => te(() => M.update(i.id, Ga(i, N))), A = () => te(() => M.updateStatus(i.id, i.status >= 4 ? 1 : i.status + 1)), j = () => te(() => M.setPriority(i.id, i.priority >= 4 ? 1 : i.priority + 1)), y = () => {
    (i.description ?? "") !== m && C({ description: m || null });
  }, B = async () => {
    const N = u.trim();
    if (N) {
      v("");
      try {
        await p.addItem(N);
      } catch (_) {
        $(_, "Madde eklenemedi.");
      }
    }
  }, O = async () => {
    const N = b.trim();
    if (N) {
      g("");
      try {
        await Promise.resolve(M.addComment(i.id, N)), await n.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch (_) {
        $(_, "Yorum gönderilemedi.");
      }
    }
  }, ae = async () => {
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(M.delete(i.id)), o == null || o(i.id), s == null || s();
      } catch (N) {
        $(N, "Alt görev silinemedi.");
      }
  }, le = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
  return /* @__PURE__ */ e.jsxs(Va, { open: !0, onClose: s, label: `${i.code} alt görev detayı`, children: [
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
                    className: `${le} hover:bg-surface-hover hover:text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-up-right-from-square text-[11px]" })
                  }
                ),
                q && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Alt görevi sil",
                    onClick: ae,
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
              /* @__PURE__ */ e.jsx("span", { className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[10.5px] font-bold tracking-[.04em]", children: i.code }),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: A,
                  title: "Durumu değiştir",
                  disabled: !I,
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold ${I ? "cursor-pointer" : "cursor-default"} ${K.bg} ${K.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${K.icon} text-[10px]` }),
                    K.label
                  ]
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: j,
                  title: "Önceliği değiştir",
                  disabled: !T,
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold ${T ? "cursor-pointer" : "cursor-default"} ${R.bg} ${R.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${R.icon} text-[10px]` }),
                    R.label
                  ]
                }
              ),
              (i.tags ?? []).map((N) => /* @__PURE__ */ e.jsx("span", { className: "flex items-center h-6 px-[9px] rounded-[7px] border border-default bg-neutral-subtle text-text-secondary text-[11px] font-semibold", children: N.name }, N.id ?? N.name)),
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
            /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[18px] font-extrabold tracking-[-.02em] leading-[1.3] text-text-primary", children: i.title }),
            /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 pt-1", children: [
              /* @__PURE__ */ e.jsx(et, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
                /* @__PURE__ */ e.jsx(gt, { name: i.assigneeName }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", children: i.assigneeName || "Atanmamış" })
              ] }) }),
              /* @__PURE__ */ e.jsx(et, { label: "Son tarih", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] h-[22px] text-[12.5px] font-semibold text-text-primary", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[11px] text-text-tertiary" }),
                vn(i.dueDate)
              ] }) }),
              /* @__PURE__ */ e.jsx(et, { label: "Süre", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-[22px] font-mono text-[12.5px] font-bold text-text-primary", children: [
                i.spentHours ?? 0,
                "s",
                /* @__PURE__ */ e.jsxs("span", { className: "font-medium text-text-tertiary", children: [
                  " / ",
                  i.estimatedHours != null ? `${i.estimatedHours}s` : "—"
                ] })
              ] }) }),
              /* @__PURE__ */ e.jsx(et, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-1.5 pt-[3px]", children: [
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
                  "%",
                  Q
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: "block h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("span", { className: "block h-full rounded-full bg-success", style: { width: `${Q}%` } }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: hn.map((N) => {
            const _ = f === N.code, E = Y[N.code] ?? 0;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => x(N.code),
                className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${_ ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${N.icon} text-[11px] opacity-85` }),
                  /* @__PURE__ */ e.jsx("span", { children: N.title }),
                  E > 0 && /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-neutral-subtle text-text-tertiary text-[10px] font-extrabold", children: E })
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
                  value: m,
                  onChange: (N) => d(N.target.value),
                  onBlur: T ? y : void 0,
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
            f === "checklist" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px]", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Kontrol listesi" }),
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: [
                  G,
                  "/",
                  F.length
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-success", style: { width: `${Q}%` } }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px] mt-1", children: [
                F.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] border border-subtle bg-surface-base hover:border-default", children: [
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Tamamlandı işaretle",
                      onClick: () => p.toggleItem(N.id),
                      disabled: !T,
                      className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${T ? "cursor-pointer" : "cursor-default"} ${N.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
                      children: N.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[12.5px] font-semibold ${N.isDone ? "line-through text-text-tertiary" : "text-text-primary"}`, children: N.text }),
                  T && /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Maddeyi sil",
                      onClick: () => p.removeItem(N.id),
                      className: "flex shrink-0 items-center justify-center h-6 w-6 rounded-md text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[10px]" })
                    }
                  )
                ] }, N.id)),
                T && /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "text",
                    value: u,
                    onChange: (N) => v(N.target.value),
                    onKeyDown: (N) => {
                      N.key === "Enter" && B();
                    },
                    placeholder: "Yeni madde yaz ve Enter'a bas…",
                    className: "h-9 mt-1 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                )
              ] })
            ] }),
            f === "comments" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] items-start", children: [
                /* @__PURE__ */ e.jsx(gt, { name: l, size: 30 }),
                /* @__PURE__ */ e.jsx(
                  "textarea",
                  {
                    rows: 2,
                    value: b,
                    onChange: (N) => g(N.target.value),
                    onKeyDown: (N) => {
                      N.key === "Enter" && !N.shiftKey && (N.preventDefault(), O());
                    },
                    placeholder: "Yorum yaz ve Enter'a bas…",
                    className: "flex-1 min-w-0 px-3 py-2.5 rounded-[11px] border border-default bg-surface-base text-text-primary text-[12.5px] leading-[1.6] resize-none focus:border-focus focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: O,
                    "aria-label": "Yorumu gönder",
                    className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] ${b.trim() ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paper-plane text-[11px]" })
                  }
                )
              ] }),
              P.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-[7px] py-7 rounded-xl border border-dashed border-default", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-comments text-xl text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Henüz yorum yok" })
              ] }) : P.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 items-start p-3 rounded-xl border border-subtle bg-surface-base", children: [
                /* @__PURE__ */ e.jsx(gt, { name: N.authorName, size: 28 }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: N.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: yn(N.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: N.text })
                ] })
              ] }, N.id))
            ] }),
            f === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  ref: k,
                  type: "file",
                  className: "hidden",
                  onChange: (N) => {
                    var E;
                    const _ = (E = N.target.files) == null ? void 0 : E[0];
                    N.target.value = "", _ && c.upload(_).catch((z) => $(z, "Dosya yüklenemedi."));
                  }
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    var N;
                    return (N = k.current) == null ? void 0 : N.click();
                  },
                  disabled: c.isUploading,
                  className: "flex flex-col items-center justify-center gap-[7px] p-6 rounded-[13px] border-2 border-dashed border-strong bg-surface-base cursor-pointer hover:border-focus hover:bg-primary-subtle disabled:opacity-60",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c.isUploading ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-xl text-text-tertiary` }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: c.isUploading ? "Yükleniyor…" : "Dosya ekle" })
                  ]
                }
              ),
              H.map((N) => {
                const _ = bn(N.fileName);
                return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${_.bg} ${_.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${_.icon} text-[13px]` }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: N.fileName }),
                    /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                      gn(N.fileSize),
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
                      onClick: () => c.remove(N.id).catch((E) => $(E, "Dosya silinemedi.")),
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
const Oa = "apya.taskDetail.tabOrder", Nn = "taskdetail";
function fa() {
  try {
    const t = localStorage.getItem(Oa);
    if (!t) return [];
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.filter((s) => typeof s == "string") : [];
  } catch {
    return [];
  }
}
function wn(t) {
  try {
    localStorage.setItem(Oa, JSON.stringify(t));
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
function ba(t) {
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
        scope: Nn,
        tabs: t.map((s) => ({ kind: s, ref: "", title: "" }))
      })
    }).catch(() => {
    });
  } catch {
  }
}
function kn(t) {
  const [a, s] = h.useState(() => ha() ?? fa()), [r, o] = h.useState(null);
  h.useEffect(() => {
    if (ha() === null) {
      const c = fa();
      c.length && ba(c);
    }
  }, []);
  const l = h.useMemo(() => {
    const c = new Map(t.map((x) => [x.code, x])), f = [];
    for (const x of a) {
      const m = c.get(x);
      m && (f.push(m), c.delete(x));
    }
    for (const x of t)
      c.has(x.code) && f.push(x);
    return f;
  }, [t, a]), n = h.useCallback((c) => {
    s((f) => {
      const x = r;
      if (!x || x === c) return f;
      const m = f.length ? f.slice() : l.map((v) => v.code), d = m.indexOf(x), u = m.indexOf(c);
      return d === -1 || u === -1 ? f : (m.splice(d, 1), m.splice(u, 0, x), m);
    });
  }, [r, l]), i = h.useCallback((c) => o(c), []), p = h.useCallback(() => {
    o(null), s((c) => {
      const f = c.length ? c : l.map((x) => x.code);
      return wn(f), ba(f), f;
    });
  }, [l]);
  return { orderedTabs: l, draggingCode: r, handleDragStart: i, handleDragEnd: p, reorderTo: n };
}
function Cn() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Dn() {
  const t = W({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: Cn,
    staleTime: 3e5,
    retry: !1
  }), a = t.data ?? [], s = a.map((o) => ({ value: o.id, label: o.name })), r = new Map(a.map((o) => [o.id, o.name]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
const ga = "apya.taskDetail.fullscreen", ie = {
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
function Tn(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function Qa({ taskId: t, presentation: a = "modal", onClose: s, switchToTask: r }) {
  var It, Mt, Kt, Rt, Gt, qt, Yt, _t;
  const [o, l] = h.useState(t), { data: n, isPending: i, isError: p, error: c, refetch: f } = St(o), x = X(), m = Ta(), d = Ea(n), u = Ba(), v = Dn(), b = Aa(o), g = Bt(o), [k, D] = h.useState("general"), [P, T] = h.useState(!1), [I, q] = h.useState(!1), [M, K] = h.useState(null), [R, F] = h.useState(null), [G, Q] = h.useState(!1), [H, Y] = h.useState(!1), [ee, te] = h.useState(() => {
    try {
      return localStorage.getItem(ga) === "true";
    } catch {
      return !1;
    }
  });
  $a(o);
  const [C, A] = h.useState(null);
  n != null && n.id && n.id !== C && (A(n.id), Q(!!n.isFavorite), Y(!!n.isWatched)), h.useEffect(() => {
    d.isDirty ? m.markDirty() : m.markClean();
  }), h.useEffect(() => {
    const w = x.getQueryCache().subscribe((L) => {
      var ne;
      L.type === "updated" && ((ne = L.action) == null ? void 0 : ne.type) === "invalidate" && !ws(L.query.queryKey) && V.markChanged();
    }), S = x.getMutationCache().subscribe((L) => {
      L.type === "added" && V.markChanged();
    });
    return () => {
      w(), S();
    };
  }, [x]);
  const j = h.useCallback(() => {
    Pt(), s == null || s();
  }, [s]), y = h.useCallback(() => m.requestClose(j), [m, j]), B = h.useCallback(() => {
    te((w) => {
      const S = !w;
      try {
        localStorage.setItem(ga, String(S));
      } catch {
      }
      return S;
    });
  }, []), O = h.useMemo(
    () => qa(b.assignedCodes),
    [b.assignedCodes]
  ), ae = kn(O), le = h.useMemo(
    () => Ya(b.assignedCodes),
    [b.assignedCodes]
  ), ce = (w, S) => {
    if (S) {
      D(w);
      return;
    }
    ts(w);
  }, pe = h.useMemo(() => {
    var w, S, L, ne, me;
    return {
      subtasks: ((w = n == null ? void 0 : n.subTasks) == null ? void 0 : w.length) ?? 0,
      files: ((S = n == null ? void 0 : n.attachments) == null ? void 0 : S.length) ?? 0,
      dependencies: ((L = n == null ? void 0 : n.predecessorIds) == null ? void 0 : L.length) ?? 0,
      comments: ((ne = n == null ? void 0 : n.comments) == null ? void 0 : ne.length) ?? 0,
      checklist: ((me = g.items) == null ? void 0 : me.length) ?? 0
    };
  }, [n, g.items]), se = Qe.find((w) => w.code === k), N = g.items ?? [], _ = N.filter((w) => w.isDone).length, E = N.length ? Math.round(_ / N.length * 100) : 0, z = h.useCallback(async () => {
    if (!d.validate())
      return ie.err("Zorunlu alanları kontrol edin."), !1;
    T(!0);
    try {
      const w = d.values, S = await Promise.resolve(window.apya.platform.tasks.task.update(o, d.toUpdateDto()));
      await x.invalidateQueries({ queryKey: ["task-detail", o] });
      const L = x.getQueryState(["task-detail", o]);
      return d.commitSaved(w, (L == null ? void 0 : L.status) === "success" ? L.data : S), V.emitResult(), q(!0), setTimeout(() => q(!1), 2e3), ie.ok("Görev başarıyla güncellendi."), !0;
    } catch (w) {
      return $(w, "Kaydedilemedi."), !1;
    } finally {
      T(!1);
    }
  }, [o, d, x]);
  h.useEffect(() => {
    const w = (S) => {
      if ((S.ctrlKey || S.metaKey) && S.key.toLowerCase() === "s") {
        S.preventDefault(), d.isDirty && !P && z();
        return;
      }
      S.key === "Escape" && M && (S.stopPropagation(), K(null));
    };
    return window.addEventListener("keydown", w), () => window.removeEventListener("keydown", w);
  }, [z, d.isDirty, P, M]);
  const U = () => {
    var w, S, L;
    return (L = (S = (w = window == null ? void 0 : window.apya) == null ? void 0 : w.platform) == null ? void 0 : S.tasks) == null ? void 0 : L.task;
  }, Ce = async () => {
    var S;
    const w = !G;
    Q(w), V.markChanged();
    try {
      await Promise.resolve((S = U()) == null ? void 0 : S.toggleFavorite(o));
    } catch (L) {
      Q(!w), $(L, "Favori güncellenemedi.");
    }
  }, Ja = () => {
    if (!o) return;
    const w = document.createElement("a");
    w.href = `/Tasks/Detail/${o}?handler=Pdf`, w.rel = "noopener", document.body.appendChild(w), w.click(), w.remove();
  }, Wa = async () => {
    var S;
    const w = !H;
    Y(w), V.markChanged();
    try {
      await Promise.resolve((S = U()) == null ? void 0 : S.toggleWatch(o)), ie.info(w ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (L) {
      Y(!w), $(L, "Takip durumu güncellenemedi.");
    }
  }, Za = async () => {
    var w, S;
    V.markChanged();
    try {
      const L = await Promise.resolve((w = U()) == null ? void 0 : w.transfer(o, {
        mode: 2,
        // Copy
        targetProjectIds: n != null && n.projectId ? [n.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await x.invalidateQueries({ queryKey: ["task-detail"] }), ie.ok("Görev çoğaltıldı.");
      const ne = (S = L == null ? void 0 : L.createdTaskIds) == null ? void 0 : S[0];
      ne && l(ne);
    } catch (L) {
      $(L, "Görev çoğaltılamadı.");
    }
  }, Xa = async () => {
    var w;
    V.markChanged();
    try {
      await Promise.resolve((w = U()) == null ? void 0 : w.updateStatus(o, 4)), await x.invalidateQueries({ queryKey: ["task-detail", o] }), d.setField("status", 4), ie.info("Görev arşivlendi (Tamamlandı).");
    } catch (S) {
      $(S, "Görev arşivlenemedi.");
    }
  }, es = async () => {
    var w;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?")) {
      V.markChanged();
      try {
        await Promise.resolve((w = U()) == null ? void 0 : w.delete(o)), ie.info("Görev silindi."), m.markClean(), j();
      } catch (S) {
        $(S, "Görev silinemedi.");
      }
    }
  }, ts = async (w) => {
    try {
      await b.addFeature(w), D(w), ie.ok("Özellik başarıyla eklendi.");
    } catch (S) {
      $(S, "Özellik eklenemedi.");
    }
  }, Ft = async (w) => {
    try {
      await b.removeFeature(w), D("general"), ie.info("Özellik görevden kaldırıldı.");
    } catch (S) {
      $(S, "Özellik kaldırılamadı.");
    }
  }, as = async (w) => {
    var ne, me, fe, $e, De, Je, Ie;
    const S = (($e = (fe = (me = (ne = window == null ? void 0 : window.apya) == null ? void 0 : ne.platform) == null ? void 0 : me.application) == null ? void 0 : fe.projects) == null ? void 0 : $e.project) ?? ((Ie = (Je = (De = window == null ? void 0 : window.apya) == null ? void 0 : De.platform) == null ? void 0 : Je.projects) == null ? void 0 : Ie.project);
    if (!(S != null && S.create)) throw new Error("Proje servisi yüklenmedi.");
    const L = await Promise.resolve(S.create({
      name: w,
      code: Tn(w),
      currency: "TRY"
    }));
    return await x.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), ie.ok(`“${w}” projesi oluşturuldu.`), (L == null ? void 0 : L.id) ?? L;
  }, ss = async ({ mode: w, targetProjectIds: S, include: L }) => {
    var ne, me;
    V.markChanged();
    try {
      const fe = await Promise.resolve((ne = U()) == null ? void 0 : ne.transfer(o, {
        mode: w === "move" ? 1 : 2,
        targetProjectIds: S,
        include: L
      }));
      await x.invalidateQueries({ queryKey: ["task-detail", o] }), w === "move" && d.setField("projectId", S[0]);
      const $e = S.map((Je) => {
        var Ie;
        return (Ie = v.options.find((ls) => ls.value === Je)) == null ? void 0 : Ie.label;
      }).filter(Boolean), De = ((me = fe == null ? void 0 : fe.createdTaskIds) == null ? void 0 : me.length) ?? 0;
      ie.ok(w === "move" ? De ? `“${$e[0]}” projesine taşındı, ${De} projeye kopyalandı.` : `Görev “${$e[0]}” projesine taşındı.` : De > 1 ? `${De} projeye kopyalandı.` : `Kopya “${$e[0]}” projesinde oluşturuldu.`), K(null);
    } catch (fe) {
      $(fe, "Transfer tamamlanamadı.");
    }
  }, { canEdit: He, canChangeStatus: rs, canDelete: ns } = _e(n), is = k === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)] gap-5 items-start", children: [
    /* @__PURE__ */ e.jsx(
      nn,
      {
        task: n,
        onFieldChange: d.setField,
        descriptionValue: d.values.description,
        checklist: g,
        readOnly: !He,
        currentUserName: ((Mt = (It = window == null ? void 0 : window.abp) == null ? void 0 : It.currentUser) == null ? void 0 : Mt.name) || ((Rt = (Kt = window == null ? void 0 : window.abp) == null ? void 0 : Kt.currentUser) == null ? void 0 : Rt.userName) || "Ben"
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5", children: /* @__PURE__ */ e.jsx(rn, { task: n, nameById: u.nameById }) })
  ] }) : xn(k) ? /* @__PURE__ */ e.jsx(
    pa,
    {
      code: k,
      onRemoveFeature: Ft,
      pickerEntries: le,
      onPickFeature: ce,
      canRemove: !(se != null && se.isCore)
    }
  ) : /* @__PURE__ */ e.jsx(h.Suspense, { fallback: /* @__PURE__ */ e.jsx(ye, { className: "h-48 w-full" }), children: se != null && se.component ? /* @__PURE__ */ e.jsx(
    se.component,
    {
      taskId: o,
      task: n,
      form: d,
      nameById: u.nameById,
      onOpenSubtask: F,
      readOnly: !He
    }
  ) : /* @__PURE__ */ e.jsx(
    pa,
    {
      code: k,
      onRemoveFeature: Ft,
      pickerEntries: le,
      onPickFeature: ce,
      canRemove: !(se != null && se.isCore)
    }
  ) }), Le = p && ((c == null ? void 0 : c.status) === 404 || (c == null ? void 0 : c.status) === 403) ? c.status : null, zt = i ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(ye, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(ye, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(ye, { className: "h-64 w-full" })
  ] }) : Le ? /* @__PURE__ */ e.jsx(
    os,
    {
      variant: Le === 404 ? "error" : "locked",
      icon: Le === 404 ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-magnifying-glass" }) : void 0,
      title: Le === 404 ? Ae("Tasks:Detail:NotFound:Title", "Bu görev bulunamadı") : Ae("Tasks:Detail:Forbidden:Title", "Bu görevi görüntüleyemezsiniz"),
      description: Le === 404 ? Ae("Tasks:Detail:NotFound:Body", "Görev silinmiş ya da bağlantı eskimiş olabilir.") : cs(c),
      action: a === "page" ? /* @__PURE__ */ e.jsx(J, { asChild: !0, size: "sm", children: /* @__PURE__ */ e.jsxs("a", { href: "/Tasks", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-left", "aria-hidden": "true" }),
        Ae("Tasks:Detail:BackToList", "Görevlere dön")
      ] }) }) : /* @__PURE__ */ e.jsx(J, { variant: "secondary", size: "sm", onClick: y, children: Ae("Common:Close", "Kapat") })
    }
  ) : p && !n ? (
    /* Yalnız İLK yükleme hatası. Görev ekrandayken düşen tazeleme (odak dönüşü, kayıt sonrası
       yeniden çekme; oturum düşünce 401) formu sökmez: yazılanlar görünür kalır, sonraki
       başarılı tazeleme forma işlenir (useTaskForm rebase). */
    /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
      /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
      /* @__PURE__ */ e.jsx(ds, { onRetry: f })
    ] })
  ) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col flex-1 min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      Xr,
      {
        task: n,
        presentation: a,
        onClose: y,
        isFullscreen: ee,
        onToggleFullscreen: B,
        onFieldChange: d.setField,
        statusValue: d.values.status,
        titleValue: n == null ? void 0 : n.title,
        isPrivateValue: d.values.isPrivate,
        isFavorite: G,
        onToggleFavorite: Ce,
        isWatched: H,
        onToggleWatch: Wa,
        onDuplicate: Za,
        onArchive: Xa,
        onDelete: es,
        onOpenTransfer: (w) => K({ mode: w }),
        onSaveAsTemplate: () => ie.info("Şablon olarak kaydetme yakında."),
        onConvertToSubtask: () => ie.info("Alt göreve dönüştürme yakında."),
        onExportPdf: Ja,
        canEdit: He,
        canChangeStatus: rs,
        canDelete: ns
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        en,
        {
          task: n,
          assigneeOptions: u.options,
          projectOptions: v.options,
          onFieldChange: d.setField,
          statusValue: d.values.status,
          priorityValue: d.values.priority,
          assigneeValue: d.values.assigneeId,
          projectValue: d.values.projectId,
          dueDateValue: d.values.dueDate,
          startDateValue: d.values.startDate,
          tagsValue: d.values.tagNames,
          progressPercent: E,
          progressNote: `${_}/${N.length} madde`,
          onOpenTransfer: (w) => K({ mode: w }),
          readOnly: !He
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        a === "page" && /* @__PURE__ */ e.jsx(
          sn,
          {
            activeTab: k,
            onTabChange: D,
            orderedTabs: ae.orderedTabs,
            draggingCode: ae.draggingCode,
            onDragStart: ae.handleDragStart,
            onDragEnd: ae.handleDragEnd,
            onReorderTo: ae.reorderTo,
            onReorderDrop: () => ie.info("Sekme sırası güncellendi."),
            pickerEntries: le,
            onPickFeature: ce,
            counts: pe
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: a === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            an,
            {
              activeTab: k,
              onTabChange: D,
              orderedTabs: ae.orderedTabs,
              draggingCode: ae.draggingCode,
              onDragStart: ae.handleDragStart,
              onDragEnd: ae.handleDragEnd,
              onReorderTo: ae.reorderTo,
              onReorderDrop: () => ie.info("Sekme sırası güncellendi."),
              pickerEntries: le,
              onPickFeature: ce,
              counts: pe,
              isDirty: d.isDirty
            }
          ) }),
          /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised", children: is })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(
      ln,
      {
        lastSavedAt: n == null ? void 0 : n.lastModificationTime,
        isDirty: d.isDirty,
        isSaving: P,
        justSaved: I,
        onCancel: y,
        onSave: z
      }
    )
  ] }), Lt = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      fn,
      {
        open: !!M,
        mode: (M == null ? void 0 : M.mode) ?? "move",
        onClose: () => K(null),
        onConfirm: ss,
        projectOptions: v.options,
        currentProjectId: d.values.projectId,
        counts: pe,
        onCreateProject: as
      }
    ),
    R && /* @__PURE__ */ e.jsx(
      jn,
      {
        subtaskId: R,
        parentCode: n == null ? void 0 : n.code,
        onClose: () => F(null),
        onOpenFull: (w) => {
          F(null), (r ?? l)(w);
        },
        onDeleted: () => x.invalidateQueries({ queryKey: ["task-detail", o] }),
        currentUserName: ((qt = (Gt = window == null ? void 0 : window.abp) == null ? void 0 : Gt.currentUser) == null ? void 0 : qt.name) || ((_t = (Yt = window == null ? void 0 : window.abp) == null ? void 0 : Yt.currentUser) == null ? void 0 : _t.userName) || "Ben"
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col w-full min-h-[calc(100vh-54px)] border-y border-subtle bg-surface-base", children: zt }),
    Lt
  ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(Ct, { open: !0, onOpenChange: (w) => {
      w || y();
    }, children: /* @__PURE__ */ e.jsx(
      Dt,
      {
        title: n != null && n.title ? `Görev Detayı: ${n.title}` : "Görev Detayı",
        fullscreen: ee,
        className: ee ? "p-0 rounded-xl border border-default shadow-xl short:h-[100svh]" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl short:h-[100svh]",
        onInteractOutside: (w) => {
          var S, L;
          w.preventDefault(), !(M || R) && ((L = (S = w.target) == null ? void 0 : S.closest) != null && L.call(S, "[data-apya-overlay]") || y());
        },
        onEscapeKeyDown: (w) => {
          if (M || R) {
            w.preventDefault();
            return;
          }
          w.preventDefault(), y();
        },
        children: zt
      }
    ) }),
    Lt
  ] });
}
function Sn() {
  const t = h.useSyncExternalStore(
    V.subscribe,
    V.getSnapshot,
    () => null
  );
  return t ? /* @__PURE__ */ e.jsx(xs, { name: "task-detail", fallback: (a) => /* @__PURE__ */ e.jsx($n, { ...a }), children: /* @__PURE__ */ e.jsx(Pn, { taskId: t }) }) : null;
}
function $n(t) {
  const a = () => {
    var s;
    Pt(), V.close(), (s = window.apya) != null && s.taskDetailV3Enabled ? V.emitResultIfChanged() : V.emitResult();
  };
  return /* @__PURE__ */ e.jsx(Ct, { open: !0, onOpenChange: (s) => {
    s || a();
  }, children: /* @__PURE__ */ e.jsx(
    Dt,
    {
      title: Ae("Common:SectionError:Title", "Bu bölüm gösterilemedi"),
      className: "w-full max-w-[480px] h-auto tablet:min-h-0 justify-center p-6",
      children: /* @__PURE__ */ e.jsx(us, { ...t, onClose: a })
    }
  ) });
}
function Pn({ taskId: t }) {
  var a;
  return (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(st, { children: /* @__PURE__ */ e.jsx(
    Qa,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        V.close(), V.emitResultIfChanged();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(st, { children: /* @__PURE__ */ e.jsx(
    _a,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        V.close(), V.emitResult();
      }
    },
    t
  ) });
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
function En() {
  return Ha() === "v2";
}
function Bn() {
  return Ha() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = Bn();
window.apya.taskDetailV2Enabled = En() && !window.apya.taskDetailV3Enabled;
const ya = {
  open: (t) => {
    V.open(t);
  },
  close: () => V.close(),
  onResult: (t) => V.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(ya) : window.apya.taskDetail = ya;
function va() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = ja(t, "task-detail", /* @__PURE__ */ e.jsx(Sn, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = Sa();
    a && V.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", va) : va();
function An({ taskId: t }) {
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
  t && ja(yt, "task-detail-page", /* @__PURE__ */ e.jsx(An, { taskId: t }));
}
