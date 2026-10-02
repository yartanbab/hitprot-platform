import { j as e, r as f, b as _e } from "./react-vendor-D7YDiBbi.js";
import { t as de, n as $, E as gs, e as ys, R as vs, m as Ta, I as js, a as Ns } from "./index-DgpuJ91w.js";
import { D as $t, h as Pt, e as kt, B as re, I as Ue, M as ws, S as we } from "./Dialog-BdrRxZcw.js";
import { a as lt } from "./QueryProvider-D2Hvqdr9.js";
import { u as te, a as ne, b as ae } from "./query-vendor-Db2mwxYI.js";
import { C as Sa } from "./Combobox-BTNS1Ncj.js";
import { U as Et, u as $a } from "./useDirtyGuard-BU_DDlEJ.js";
import { i as He, a as Je, s as be, p as ut, d as Pa, b as ot, R as Ea, c as Pe, S as Ba, e as ks, P as Cs } from "./RichTextEditorV3-BMU9U7iD.js";
import { r as Ds } from "./httpClient-BNoyY5yK.js";
import { R as ke, T as Ce, P as De, C as Te, A as Ts, a as Bt, D as Ss, b as $s, c as Ps, d as Es, e as Bs } from "./ui-vendor-UYevF8mE.js";
import { d as Fa } from "./draggableActivation-Ybw9Upbh.js";
import { i as Fs } from "./dataChanged-CDwwWMH8.js";
function As({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: o,
  footer: l,
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
            o,
            /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: n }),
            l
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
const Ct = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, Dt = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function Ls({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: o,
  fullscreen: l = !1
}) {
  const [n, i] = f.useState(!1), p = f.useRef(null);
  f.useEffect(() => {
    if (!n) return;
    const c = (y) => {
      p.current && !p.current.contains(y.target) && i(!1);
    }, u = (y) => {
      y.key === "Escape" && i(!1);
    };
    return document.addEventListener("mousedown", c), document.addEventListener("keydown", u), () => {
      document.removeEventListener("mousedown", c), document.removeEventListener("keydown", u);
    };
  }, [n]);
  const d = Ct[t == null ? void 0 : t.status] ?? Ct[1], b = Dt[t == null ? void 0 : t.priority] ?? Dt[2], x = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), i(!1);
  }, m = () => {
    var u, y, h, g;
    const c = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (u = navigator.clipboard) == null || u.writeText(c), (g = (h = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : h.info) == null || g.call(h, "Bağlantı kopyalandı."), i(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(kt, { variant: d.variant, children: d.text }),
        /* @__PURE__ */ e.jsx(kt, { variant: b.variant, children: b.text }),
        /* @__PURE__ */ e.jsx(Is, { isPrivate: t == null ? void 0 : t.isPrivate })
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
const Ms = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function Ks({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: o }) {
  const l = Ms(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: l ? `Son kayıt: ${l}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(re, { variant: "secondary", onClick: r, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        re,
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
const Wt = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Rs = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function ve({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function Gs({ value: t, onChange: a }) {
  const [s, r] = f.useState(""), o = () => {
    const l = s.trim();
    l && !t.includes(l) && a([...t, l]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((l) => /* @__PURE__ */ e.jsxs(kt, { variant: "neutral", children: [
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
      Ue,
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
function qs({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: o = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(ve, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      Ue,
      {
        id: "task-title",
        value: t.title,
        onChange: (l) => s("title", l.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(ve, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (l) => s("status", Number(l.target.value)),
          className: Wt,
          children: Object.entries(Ct).map(([l, n]) => /* @__PURE__ */ e.jsx("option", { value: l, children: n.text }, l))
        }
      ) }),
      /* @__PURE__ */ e.jsx(ve, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (l) => s("priority", Number(l.target.value)),
          className: Wt,
          children: Object.entries(Dt).map(([l, n]) => /* @__PURE__ */ e.jsx("option", { value: l, children: n.text }, l))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(ve, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      Sa,
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
      /* @__PURE__ */ e.jsx(ve, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        Ue,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (l) => s("startDate", l.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(ve, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        Ue,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (l) => s("dueDate", l.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(ve, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(Gs, { value: t.tagNames, onChange: (l) => s("tagNames", l) }) }),
    /* @__PURE__ */ e.jsx(ve, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (l) => s("description", l.target.value),
        className: Rs
      }
    ) })
  ] });
}
const Zt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function Ge({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function Ys({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(Ge, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(Ge, { label: "Oluşturulma zamanı", value: Zt(t.creationTime) }),
      /* @__PURE__ */ e.jsx(Ge, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(Ge, { label: "Son güncelleme zamanı", value: Zt(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(Ge, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const _s = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", Us = "border-brand-500 text-text-primary";
function Vs({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: o }) {
  const l = f.useRef(/* @__PURE__ */ new Map()), n = (p) => {
    var d;
    s(p.code), (d = l.current.get(p.code)) == null || d.focus();
  }, i = (p, d) => {
    p.key === "ArrowRight" ? (p.preventDefault(), n(t[(d + 1) % t.length])) : p.key === "ArrowLeft" ? (p.preventDefault(), n(t[(d - 1 + t.length) % t.length])) : p.key === "Home" ? (p.preventDefault(), n(t[0])) : p.key === "End" && (p.preventDefault(), n(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((p, d) => {
      const b = p.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (x) => {
            x ? l.current.set(p.code, x) : l.current.delete(p.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${p.code}`,
          "aria-selected": b,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: b ? 0 : -1,
          onClick: () => s(p.code),
          onKeyDown: (x) => i(x, d),
          className: `${_s} ${b ? Us : ""}`,
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
const Os = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Qs({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [o, l] = f.useState(""), n = f.useMemo(() => {
    const i = o.trim().toLocaleLowerCase("tr-TR"), p = i ? t.filter((b) => b.title.toLocaleLowerCase("tr-TR").includes(i)) : t, d = /* @__PURE__ */ new Map();
    return p.forEach((b) => {
      const x = d.get(b.category) ?? [];
      x.push(b), d.set(b.category, x);
    }), d;
  }, [t, o]);
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
            value: o,
            onChange: (i) => l(i.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          n.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...n.entries()].map(([i, p]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: Os[i] ?? i }),
            p.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
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
function Hs({ trail: t = [], current: a, onNavigate: s }) {
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
function Js(t) {
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
function Ft(t) {
  return te({
    queryKey: ["task-detail", t],
    queryFn: () => Js(t),
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
function le(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
const Ws = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, At = "task";
function Aa() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(At);
  return t && Ws.test(t) ? t : null;
}
function zt() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(At), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function za(t, a) {
  const s = f.useRef(a);
  s.current = a, f.useEffect(() => {
    if (!t || Aa() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(At, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), f.useEffect(() => {
    const r = () => {
      var o;
      (o = s.current) == null || o.call(s);
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
  } : Zs;
}
const Ia = (t, a) => JSON.stringify(t) === JSON.stringify(a);
function ea(t, a, s) {
  const r = {};
  for (const o of Object.keys(s)) r[o] = Ia(t[o], a[o]) ? s[o] : t[o];
  return r;
}
function La(t) {
  const [a, s] = f.useState(t == null ? void 0 : t.id), r = f.useMemo(() => Xt(t), [t]), [o, l] = f.useState(r), [n, i] = f.useState(r), [p, d] = f.useState({});
  if ((t == null ? void 0 : t.id) !== a || r !== o && !Ia(r, o)) {
    const h = (t == null ? void 0 : t.id) !== void 0 && t.id === a;
    s(t == null ? void 0 : t.id), l(r), i(h ? ea(n, o, r) : r), h || d({});
  }
  const b = f.useCallback((h, g) => {
    i((N) => ({ ...N, [h]: g })), d((N) => {
      if (!N[h] && !(h === "startDate" && N.dueDate)) return N;
      const C = { ...N };
      return delete C[h], h === "startDate" && delete C.dueDate, C;
    });
  }, []), x = f.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(r),
    [n, r]
  ), m = f.useCallback(() => {
    const h = {};
    return n.title.trim() || (h.title = de("Tasks:Detail:Validation:TitleRequired", "Başlık zorunlu.")), n.startDate || (h.startDate = de("Tasks:Detail:Validation:StartDateRequired", "Başlangıç tarihi zorunlu.")), n.dueDate && n.startDate && n.dueDate < n.startDate && (h.dueDate = de("Tasks:Detail:Validation:DueBeforeStart", "Son tarih başlangıç tarihinden önce olamaz.")), d(h), Object.keys(h).length === 0;
  }, [n]), c = f.useCallback(() => ({
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
  }), [n, t]), u = f.useCallback(() => {
    i(r), d({});
  }, [r]), y = f.useCallback((h, g) => {
    if (!g) return;
    const N = Xt(g);
    i((C) => ea(C, h, N));
  }, []);
  return { values: n, setField: b, isDirty: x, errors: p, validate: m, toUpdateDto: c, reset: u, commitSaved: y };
}
function ta(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function Xs() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ma() {
  var o;
  const t = te({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Xs,
    staleTime: 3e5,
    retry: !1
  }), a = ((o = t.data) == null ? void 0 : o.items) ?? [], s = a.map((l) => ({ value: l.id, label: ta(l) })), r = new Map(a.map((l) => [l.id, ta(l)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function Tt() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function er(t) {
  const a = Tt();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ka(t) {
  const a = ne(), s = ["task-features", t], r = te({
    queryKey: s,
    queryFn: () => er(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: s }), l = ae({
    mutationFn: (i) => Promise.resolve(Tt().addFeature(t, i)),
    onSuccess: o
  }), n = ae({
    mutationFn: (i) => Promise.resolve(Tt().removeFeature(t, i)),
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
function Oe(t) {
  var r, o;
  const a = (o = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.currentUser) == null ? void 0 : o.id, s = !!(a && ((t == null ? void 0 : t.creatorId) === a || (t == null ? void 0 : t.assigneeId) === a)) || le("Platform.Projects.ManageTeam");
  return {
    canManage: s,
    canEdit: s && le("Platform.Tasks.Edit"),
    canChangeStatus: s && le("Platform.Tasks.ChangeStatus"),
    canDelete: s && le("Platform.Tasks.Delete")
  };
}
const Ra = "rounded-2xl border border-subtle bg-surface-base shadow-xs", Se = `${Ra} overflow-hidden`;
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
function ue({ icon: t, title: a, description: s }) {
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
function qa(t) {
  return t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : "0 KB";
}
function mt(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = Math.floor(a / 3600), r = Math.floor(a % 3600 / 60);
  return !s && !r ? `${a}sn` : s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function tr(t) {
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
}, aa = (t = "") => Ya(t) === Ne.image;
function Ya(t = "") {
  var s;
  const a = ((s = t.split(".").pop()) == null ? void 0 : s.toLowerCase()) ?? "";
  return a === "pdf" ? Ne.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(a) ? Ne.image : ["doc", "docx", "odt", "rtf", "txt"].includes(a) ? Ne.doc : ["xls", "xlsx", "csv", "ods"].includes(a) ? Ne.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(a) ? Ne.code : ["zip", "rar", "7z", "tar", "gz"].includes(a) ? Ne.zip : Ne.other;
}
function ar({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, o] = f.useState(""), [l, n] = f.useState(!1), i = ne(), p = (a == null ? void 0 : a.subTasks) ?? [], d = p.filter((c) => c.status === 4).length, b = () => i.invalidateQueries({ queryKey: ["task-detail", t] }), x = async () => {
    const c = r.trim();
    if (c) {
      n(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: c,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), o(""), await b();
      } catch (u) {
        $(u, "Alt görev eklenemedi.");
      } finally {
        n(!1);
      }
    }
  }, m = async (c, u) => {
    c.stopPropagation();
    try {
      await Promise.resolve(window.apya.platform.tasks.task.updateStatus(u.id, u.status === 4 ? 1 : 4)), await b();
    } catch (y) {
      $(y, "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        p.length > 0 && /* @__PURE__ */ e.jsxs(Ga, { children: [
          d,
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
    /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
      p.map((c) => {
        const u = be(c.status), y = c.status === 4, h = Oe(c).canChangeStatus;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => s == null ? void 0 : s(c.id, c.title),
            onKeyDown: (g) => {
              g.key === "Enter" && (s == null || s(c.id, c.title));
            },
            className: "flex items-center gap-3.5 px-4 py-3.5 border-t border-subtle first:border-t-0 hover:bg-surface-raised cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": `${c.title} tamamlandı işaretle`,
                  onClick: (g) => m(g, c),
                  disabled: !h,
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white ${h ? "cursor-pointer" : "cursor-default"} ${y ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: y && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: c.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${y ? "line-through text-text-tertiary" : "text-text-primary"}`, children: c.title }),
              /* @__PURE__ */ e.jsx(Ee, { bg: u.bg, fg: u.fg, children: u.label }),
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
          onChange: (c) => o(c.target.value),
          onKeyDown: (c) => {
            c.key === "Enter" && x();
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
function _a() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function sr(t) {
  const a = _a();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function rr(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, o = Ds();
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
function It(t) {
  const a = ne(), s = ["task-attachments", t], r = te({
    queryKey: s,
    queryFn: () => sr(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: s }), l = ae({
    mutationFn: (i) => rr(t, i),
    onSuccess: o
  }), n = ae({
    mutationFn: (i) => Promise.resolve(_a().deleteAttachment(i)),
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
function nr({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: o } = It(t), l = ne(), n = f.useRef(null), [i, p] = f.useState(!1), d = le("Platform.Tasks.ShareExternally"), b = async (c, u) => {
    try {
      await window.apya.platform.tasks.taskShare.setAttachmentGuestVisibility(c, u), l.invalidateQueries({ queryKey: ["task-attachments", t] });
    } catch (y) {
      $(y, "Görünürlük değiştirilemedi.");
    }
  }, x = async (c) => {
    var u, y, h;
    if (c)
      try {
        await s(c), (h = (y = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : y.success) == null || h.call(y, "Dosya yüklendi.");
      } catch (g) {
        $(g, "Dosya yüklenemedi.");
      } finally {
        n.current && (n.current.value = "");
      }
  }, m = async (c, u) => {
    try {
      await r(c);
    } catch (y) {
      $(y, `${u} silinemedi.`);
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
        disabled: o
      }
    ),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3", children: a.map((c) => {
      const u = Ya(c.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${u.bg} ${u.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: c.fileName, children: c.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: qa(c.fileSize) })
              ] })
            ] }),
            d && !c.isGuestUpload && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 text-[11px] text-text-tertiary cursor-pointer", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: !!c.isVisibleToGuests,
                  onChange: (y) => b(c.id, y.target.checked)
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
                    onClick: () => m(c.id, c.fileName),
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
          c.preventDefault(), i || p(!0);
        },
        onDragLeave: () => p(!1),
        onDrop: (c) => {
          var u, y;
          c.preventDefault(), p(!1), x((y = (u = c.dataTransfer) == null ? void 0 : u.files) == null ? void 0 : y[0]);
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
function nt() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function ir(t) {
  const a = nt();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Lt(t) {
  const a = ne(), s = ["task-checklist", t], r = te({
    queryKey: s,
    queryFn: () => ir(t),
    enabled: !!t,
    staleTime: 3e4,
    /* toggleChecklistItem ters çevirir; bayat gösterim yanlış yöne yazar (proje
       konsolu paneli aynı maddeyi React Query dışından değiştiriyor). */
    meta: { persist: !1 },
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: s }), l = ae({
    mutationFn: (p) => Promise.resolve(nt().addChecklistItem(t, p)),
    onSuccess: o
  }), n = ae({
    mutationFn: (p) => Promise.resolve(nt().toggleChecklistItem(p)),
    onSuccess: o
  }), i = ae({
    mutationFn: (p) => Promise.resolve(nt().deleteChecklistItem(p)),
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
function lr({ taskId: t, readOnly: a = !1 }) {
  const { items: s, isLoading: r, addItem: o, toggleItem: l, removeItem: n } = Lt(t), [i, p] = f.useState(""), d = s.filter((m) => m.isDone).length, b = s.length ? Math.round(d / s.length * 100) : 0, x = async () => {
    const m = i.trim();
    if (!(!m || !t)) {
      p("");
      try {
        await o(m);
      } catch (c) {
        p(m), $(c, "Madde eklenemedi.");
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
        b
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mt-3.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
      "div",
      {
        className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
        style: { width: `${b}%` }
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
            onClick: () => l(m.id).catch((c) => $(c, "Durum güncellenemedi.")),
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
            onClick: () => n(m.id).catch((c) => $(c, "Madde silinemedi.")),
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
function or({ taskId: t, task: a }) {
  const [s, r] = f.useState(""), [o, l] = f.useState(null), [n, i] = f.useState(""), [p, d] = f.useState(!1), b = ne(), x = (a == null ? void 0 : a.comments) ?? [], m = async (u) => {
    var y, h, g;
    if (u == null || u.preventDefault(), !(!s.trim() || p)) {
      d(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), b.invalidateQueries({ queryKey: ["task-detail", t] }), (g = (h = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : h.success) == null || g.call(h, "Yorum eklendi.");
      } catch (N) {
        $(N, "Yorum eklenemedi.");
      } finally {
        d(!1);
      }
    }
  }, c = async (u) => {
    var y, h, g;
    if (!(!n.trim() || p)) {
      d(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(u, n.trim())
        ), i(""), l(null), b.invalidateQueries({ queryKey: ["task-detail", t] }), (g = (h = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : h.success) == null || g.call(h, "Yanıt eklendi.");
      } catch (N) {
        $(N, "Yanıt eklenemedi.");
      } finally {
        d(!1);
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
        re,
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
        re,
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
            onChange: (y) => i(y.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(re, { variant: "ghost", size: "sm", onClick: () => l(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(re, { variant: "primary", size: "sm", disabled: !n.trim() || p, onClick: () => c(u.id), children: "Gönder" })
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
function ft() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.taskShare) ?? null;
}
function cr(t) {
  const a = ne(), s = ["task-share-links", t], r = te({
    queryKey: s,
    queryFn: () => {
      const i = ft();
      return i ? Promise.resolve(i.getList(t)) : Promise.reject(new Error("Paylaşım servisi yüklenmedi."));
    },
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: s }), l = ae({
    mutationFn: (i) => Promise.resolve(ft().create({ ...i, taskId: t })),
    onSuccess: o
  }), n = ae({
    mutationFn: (i) => Promise.resolve(ft().revoke(i)),
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
const sa = {
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
  const { links: a, isPending: s, create: r, revoke: o, isCreating: l } = cr(t), [n, i] = f.useState(sa), [p, d] = f.useState(null);
  if (!le("Platform.Tasks.ShareExternally"))
    return /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Görevi ekip dışıyla paylaşma yetkiniz yok." });
  const x = (h) => (g) => {
    const N = g.target.type === "checkbox" ? g.target.checked : g.target.value;
    i((C) => ({ ...C, [h]: N }));
  }, m = async (h) => {
    if (h.preventDefault(), !!n.recipientName.trim())
      try {
        const g = await r({
          ...n,
          lifetimeDays: Number(n.lifetimeDays) || 14
        });
        d(g), i(sa);
      } catch (g) {
        $(g, "Paylaşım linki üretilemedi.");
      }
  }, c = (h) => `${window.location.origin}${h}`, u = (h) => {
    var g, N, C, z;
    (g = navigator.clipboard) == null || g.writeText(c(h)), (z = (C = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : C.info) == null || z.call(C, "Bağlantı kopyalandı.");
  }, y = async (h) => {
    try {
      await o(h);
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
        /* @__PURE__ */ e.jsx("code", { className: "min-w-0 flex-1 truncate rounded-[8px] bg-surface-base px-2.5 py-2 font-mono text-[11.5px] text-text-secondary", children: c(p.url) }),
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
            onClick: () => d(null),
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
    s ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görev henüz kimseyle paylaşılmadı." }) : /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: a.map((h) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-subtle bg-surface-base p-3",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "truncate text-[12.5px] font-bold text-text-primary", children: [
              h.recipientName,
              h.recipientEmail ? /* @__PURE__ */ e.jsxs("span", { className: "font-normal text-text-tertiary", children: [
                " · ",
                h.recipientEmail
              ] }) : null
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "text-[11.5px] text-text-tertiary", children: [
              h.isActive ? `${dr(h.expiresAt)} tarihine kadar geçerli` : h.revokedAt ? "İptal edildi" : "Süresi doldu",
              " · ",
              h.accessCount,
              " erişim",
              " · ",
              h.uploadCount,
              " dosya"
            ] })
          ] }),
          h.isActive && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => y(h.id),
              className: "shrink-0 rounded-[8px] px-3 py-1.5 text-[12px] font-bold text-text-negative cursor-pointer hover:bg-negative-subtle",
              children: "İptal et"
            }
          )
        ]
      },
      h.id
    )) })
  ] });
}
function ur({ task: t }) {
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
const Ae = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : null;
function pr({ label: t, value: a, hint: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4 px-3.5 py-3", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[12.5px] font-semibold text-text-secondary", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 text-right", children: [
      /* @__PURE__ */ e.jsx("span", { className: "block text-[12.5px] font-bold text-text-primary break-words", children: a ?? "—" }),
      s && /* @__PURE__ */ e.jsx("span", { className: "block text-[11px] text-text-tertiary", children: s })
    ] })
  ] });
}
function mr({ task: t = {}, nameById: a }) {
  const s = (o) => {
    var l;
    return o && ((l = a == null ? void 0 : a.get) == null ? void 0 : l.call(a, o)) || null;
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
      /* @__PURE__ */ e.jsx("div", { className: "divide-y divide-subtle", children: r.map((o) => /* @__PURE__ */ e.jsx(pr, { ...o }, o.label)) })
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11.5px] text-text-tertiary", children: "Alan bazında değişiklik günlüğü (hangi alan, eski/yeni değer) henüz yayınlanmadı." })
  ] });
}
function fr(t) {
  var s, r, o;
  const a = (o = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.projectBudgets) == null ? void 0 : o.projectBudget;
  return a != null && a.getRecordFormLookup ? Promise.resolve(a.getRecordFormLookup(t)) : Promise.reject(new Error("Bütçe servisi yüklenmedi."));
}
function br(t) {
  var o;
  const a = le("Platform.Projects.ViewBudget"), s = te({
    queryKey: ["task-detail", "budget-lines", t],
    queryFn: () => fr(t),
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
function dt(t) {
  var s, r;
  const a = (r = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.ajax) == null ? void 0 : r.call(s, t);
  return a ? new Promise((o, l) => {
    a.done(o).fail(l);
  }) : Promise.reject(new Error("ABP köprüsü yüklenmedi."));
}
function xt(t, a = {}) {
  var o;
  const s = ((o = window == null ? void 0 : window.abp) == null ? void 0 : o.appPath) ?? "/", r = new URLSearchParams({ handler: t });
  return Object.entries(a).forEach(([l, n]) => {
    n != null && n !== "" && r.append(l, n);
  }), `${s}Documents/Matching?${r.toString()}`;
}
const Ua = () => le("Platform.Documents.Default"), hr = () => le("Platform.Documents.ManageMeta");
function gr(t) {
  const a = !!t && Ua(), s = te({
    queryKey: ["task-detail", "expense-matches", t],
    queryFn: () => dt({ url: xt("Matches", { projectId: t }), type: "GET" }),
    enabled: a,
    staleTime: 6e4,
    meta: { persist: !1 },
    retry: !1
  }), r = /* @__PURE__ */ new Map();
  return (s.data ?? []).forEach((o) => {
    r.has(o.expenseId) || r.set(o.expenseId, []), r.get(o.expenseId).push(o);
  }), { byExpense: r, enabled: a, isLoading: s.isLoading };
}
function yr(t, a) {
  const s = te({
    queryKey: ["task-detail", "expense-candidates", t],
    queryFn: () => dt({ url: xt("Candidates", { expenseId: t }), type: "GET" }),
    enabled: !!t && a && Ua(),
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  });
  return { candidates: s.data ?? [], isLoading: s.isLoading };
}
function vr(t) {
  const a = ne(), s = (l) => {
    a.invalidateQueries({ queryKey: ["task-detail", "expense-matches", t] }), a.invalidateQueries({ queryKey: ["task-detail", "expense-candidates", l] });
  }, r = ae({
    mutationFn: ({ documentFileId: l, expenseId: n, score: i }) => dt({
      url: xt("CreateMatch"),
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ documentFileId: l, expenseId: n, score: i ?? 0 })
    }),
    onSuccess: (l, n) => s(n.expenseId)
  }), o = ae({
    mutationFn: ({ matchId: l }) => dt({ url: xt("RemoveMatch", { matchId: l }), type: "POST" }),
    onSuccess: (l, n) => s(n.expenseId)
  });
  return { link: r, unlink: o, isBusy: r.isPending || o.isPending };
}
function jr(t) {
  return t == null ? "—" : new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 2 }).format(t);
}
function Nr({ expenseId: t, projectId: a, matches: s }) {
  const { candidates: r, isLoading: o } = yr(t, !0), { link: l, unlink: n, isBusy: i } = vr(a), p = hr(), d = new Set(s.map((x) => x.documentFileId)), b = r.filter((x) => !d.has(x.documentFileId));
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
          re,
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
      !o && b.length === 0 && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Eşleşen aday yok. Evrak Belgeler modülünden yüklenip buradan bağlanır." }),
      b.map((x) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[11px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12px] text-text-primary", children: x.displayName }),
        /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
          jr(x.amount),
          " · ",
          Me(x.documentDate)
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: `shrink-0 font-mono text-[11px] font-bold ${x.isStrong ? "text-success" : "text-text-tertiary"}`, children: [
          "%",
          x.score
        ] }),
        p && /* @__PURE__ */ e.jsx(
          re,
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
function fe(t, a) {
  const s = a || "TRY";
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: s, minimumFractionDigits: 2 }).format(t || 0);
  } catch {
    return `${(t || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${s}`.trim();
  }
}
function bt(t, a, s) {
  var n, i, p, d, b;
  const r = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.ModalManager;
  if (!r) {
    (d = (p = (i = window == null ? void 0 : window.abp) == null ? void 0 : i.notify) == null ? void 0 : p.error) == null || d.call(p, "Kayıt formu yüklenemedi.");
    return;
  }
  const o = ((b = window == null ? void 0 : window.abp) == null ? void 0 : b.appPath) ?? "/", l = new r({ viewUrl: `${o}${t}?TaskId=${a}` });
  l.onResult(() => s == null ? void 0 : s()), l.open();
}
function wr({ taskId: t }) {
  const a = ne(), s = le("Platform.Expenses.Create"), r = le("Platform.Incomes.Create"), o = le("Platform.Invoices.Create");
  if (!t || !s && !r && !o)
    return null;
  const l = () => a.invalidateQueries({ queryKey: ["task-detail", t] });
  return /* @__PURE__ */ e.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
    s && /* @__PURE__ */ e.jsxs(
      re,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => bt("Expenses/CreateModal", t, l),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-up text-[11px]" }),
          "Gider ekle"
        ]
      }
    ),
    r && /* @__PURE__ */ e.jsxs(
      re,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => bt("Incomes/CreateModal", t, l),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-down text-[11px]" }),
          "Gelir ekle"
        ]
      }
    ),
    o && /* @__PURE__ */ e.jsxs(
      re,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => bt("Invoices/CreateModal", t, l),
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
function kr({ invoices: t, action: a }) {
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
function Cr({ line: t, projectId: a, matches: s, docsEnabled: r }) {
  const [o, l] = f.useState(!1), n = t.kind === "income";
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
          "aria-expanded": o,
          onClick: () => l((i) => !i),
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
    r && o && /* @__PURE__ */ e.jsx(Nr, { expenseId: t.id, projectId: a, matches: s })
  ] });
}
function ht({ label: t, value: a, tone: s, note: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: `font-mono text-[22px] font-bold tracking-[-.02em] ${s}`, style: { fontVariantNumeric: "tabular-nums" }, children: a }),
    r && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
  ] });
}
function Dr({ options: t, isLoading: a, lineId: s, planned: r, onField: o }) {
  return a ? null : t.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12px] text-text-tertiary", children: "Bu projede bütçe kalemi tanımlı değil — kalemler Finans & Bütçe ekranından açılır." }) : /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Bütçe kalemi" }),
      /* @__PURE__ */ e.jsx(
        Sa,
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
        ws,
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
function Tr({ task: t, form: a, spentByCurrency: s, readOnly: r }) {
  const o = (a ? a.values.projectId : t == null ? void 0 : t.projectId) ?? null, { options: l, lines: n, canViewBudget: i, isLoading: p } = br(o), d = !!a && !r && i && !!o, b = (a ? a.values.budgetLineId : t == null ? void 0 : t.budgetLineId) ?? null, x = (a ? a.values.plannedAmount : t == null ? void 0 : t.plannedAmount) ?? null;
  if (!d && (!b || x == null))
    return null;
  const m = n.find((z) => z.id === b), c = m ? m.remainingAmount : t == null ? void 0 : t.budgetLineRemaining, u = s, y = !!b && x != null, h = (x ?? 0) - u, g = x > 0 ? Math.round(u / x * 100) : 0, N = h < 0, C = () => {
    a.setField("budgetLineId", null), a.setField("plannedAmount", null);
  };
  return (
    /* Kırpmayan kart ŞART: kalem seçicisinin listesi kartın içine absolute
       konumlanır, TAB_CARD'ın overflow-hidden'ı onu alt kenarda keserdi. */
    /* @__PURE__ */ e.jsxs("div", { className: Ra, children: [
      /* @__PURE__ */ e.jsx(
        Qe,
        {
          title: "Bütçe bağı",
          action: d && b ? /* @__PURE__ */ e.jsx(re, { type: "button", variant: "ghost", size: "sm", onClick: C, children: "Bağı kaldır" }) : null
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "px-4 pb-4 pt-1 flex flex-col gap-3", children: [
        d ? /* @__PURE__ */ e.jsx(
          Dr,
          {
            options: l,
            isLoading: p,
            lineId: b,
            planned: x,
            onField: a.setField
          }
        ) : /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-semibold text-accent", children: t.budgetLineName || "Bütçe kalemi" }) }),
        c != null && /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "kalemde kalan ",
          fe(c, "TRY")
        ] }),
        y && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3", children: [
            /* @__PURE__ */ e.jsx(gt, { label: "Görev bütçesi", value: fe(x, "TRY") }),
            /* @__PURE__ */ e.jsx(gt, { label: "Gerçekleşen", value: fe(u, "TRY") }),
            /* @__PURE__ */ e.jsx(
              gt,
              {
                label: "Kalan",
                value: fe(h, "TRY"),
                tone: N ? "text-negative" : "text-success"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
              "div",
              {
                className: `h-full rounded-full ${N ? "bg-negative" : g >= 80 ? "bg-warning" : "bg-success"}`,
                style: { width: `${Math.min(Math.max(g, 0), 100)}%` }
              }
            ) }),
            /* @__PURE__ */ e.jsxs("div", { className: "mt-1 text-[11.5px] text-text-tertiary", children: [
              "%",
              g,
              N && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative", children: "· görev bütçesi aşıldı" })
            ] })
          ] })
        ] })
      ] })
    ] })
  );
}
function gt({ label: t, value: a, tone: s }) {
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
  const o = (t == null ? void 0 : t.expenses) || [], l = (t == null ? void 0 : t.incomes) || [], n = (t == null ? void 0 : t.invoices) || [], i = (s ? s.values.projectId : t == null ? void 0 : t.projectId) ?? null, { byExpense: p, enabled: d } = gr(i), b = o.filter((h) => (h.currency || "TRY") === "TRY").reduce((h, g) => h + (g.amount || 0), 0), x = /* @__PURE__ */ e.jsx(Tr, { task: t, form: s, spentByCurrency: b, readOnly: r }), m = /* @__PURE__ */ e.jsx(wr, { taskId: a ?? (t == null ? void 0 : t.id) });
  if (o.length === 0 && l.length === 0 && n.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      x,
      /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
        /* @__PURE__ */ e.jsx(Qe, { title: "Görev Finansı", action: m }),
        /* @__PURE__ */ e.jsx(
          ue,
          {
            icon: "fa-coins",
            title: "Kayıt yok",
            description: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
          }
        )
      ] })
    ] });
  const u = Array.from(new Set([...o, ...l].map((h) => h.currency || "TRY"))).map((h) => {
    const g = l.filter((C) => (C.currency || "TRY") === h).reduce((C, z) => C + (z.amount || 0), 0), N = o.filter((C) => (C.currency || "TRY") === h).reduce((C, z) => C + (z.amount || 0), 0);
    return { cur: h, inc: g, exp: N, net: g - N };
  }), y = [
    ...l.map((h) => ({ ...h, kind: "income" })),
    ...o.map((h) => ({ ...h, kind: "expense" }))
  ].sort((h, g) => new Date(g.date || 0) - new Date(h.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    x,
    u.map(({ cur: h, inc: g, exp: N, net: C }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(ht, { label: `Toplam Gelir (${h})`, value: fe(g, h), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(ht, { label: `Toplam Gider (${h})`, value: fe(N, h), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        ht,
        {
          label: `Net Bakiye (${h})`,
          value: fe(C, h),
          tone: C >= 0 ? "text-success" : "text-negative",
          note: C >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, h)),
    n.length > 0 && /* @__PURE__ */ e.jsx(kr, { invoices: n, action: y.length === 0 ? m : null }),
    y.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
      /* @__PURE__ */ e.jsx(Qe, { title: "Finans kalemleri", action: m }),
      y.map((h) => /* @__PURE__ */ e.jsx(
        Cr,
        {
          line: h,
          projectId: i,
          matches: h.kind === "expense" ? p.get(h.id) ?? [] : [],
          docsEnabled: d && h.kind === "expense"
        },
        `${h.kind}-${h.id}`
      ))
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11px] text-text-tertiary", children: "Buradan eklenen kayıt göreve ve projesine etiketlenir; düzenleme/silme Finans modülünden yapılır. Evraklar Belgeler modülünde yaşar, buradan gidere bağlanır." })
  ] });
}
function $r({ taskId: t }) {
  const { attachments: a, isLoading: s, upload: r, remove: o, isUploading: l } = It(t), n = f.useRef(null), [i, p] = f.useState(!1), d = a.filter((m) => aa(m.fileName)), b = async (m) => {
    var c, u, y, h, g, N;
    if (m) {
      if (!aa(m.name)) {
        (y = (u = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : u.error) == null || y.call(u, "Galeriye yalnız görsel dosya yüklenebilir.");
        return;
      }
      try {
        await r(m), (N = (g = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : g.success) == null || N.call(g, "Görsel yüklendi.");
      } catch (C) {
        $(C, "Görsel yüklenemedi.");
      } finally {
        n.current && (n.current.value = "");
      }
    }
  }, x = async (m, c) => {
    try {
      await o(m);
    } catch (u) {
      $(u, `${c} silinemedi.`);
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
          var c;
          return b((c = m.target.files) == null ? void 0 : c[0]);
        },
        disabled: l
      }
    ),
    s && d.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
    !s && d.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Bu görevde henüz görsel yok. Yüklediğiniz görseller Dosyalar sekmesinde de görünür." }),
    d.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3", children: d.map((m) => /* @__PURE__ */ e.jsxs(
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
              /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: qa(m.fileSize) })
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
          var c;
          m.key === "Enter" && ((c = n.current) == null || c.click());
        },
        onDragOver: (m) => {
          m.preventDefault(), i || p(!0);
        },
        onDragLeave: () => p(!1),
        onDrop: (m) => {
          var c, u;
          m.preventDefault(), p(!1), b((u = (c = m.dataTransfer) == null ? void 0 : c.files) == null ? void 0 : u[0]);
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
const Pr = [
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
function Er(t, a, s, r) {
  const o = na(t, s), l = na(a, s), n = o === null || o === "", i = l === null || l === "";
  return n && i ? 0 : n ? 1 : i ? -1 : o === l ? 0 : (o < l ? -1 : 1) * (r === "asc" ? 1 : -1);
}
function Br({ task: t = {}, onOpenSubtask: a }) {
  const [s, r] = f.useState({ key: "dueDate", dir: "asc" }), o = (t == null ? void 0 : t.subTasks) ?? [], l = f.useMemo(
    () => [...o].sort((i, p) => Er(i, p, s.key, s.dir)),
    [o, s.key, s.dir]
  ), n = (i) => r((p) => p.key === i ? { key: i, dir: p.dir === "asc" ? "desc" : "asc" } : { key: i, dir: "asc" });
  return o.length === 0 ? /* @__PURE__ */ e.jsx(
    ue,
    {
      icon: "fa-table",
      title: "Alt görev yok",
      description: "Alt Görevler sekmesinden ekledikleriniz burada tablo olarak listelenir."
    }
  ) : /* @__PURE__ */ e.jsx("div", { className: `${Se} overflow-x-auto`, children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse text-[12.5px]", children: [
    /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsx("tr", { className: "bg-surface-raised", children: Pr.map((i) => {
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
      const p = be(i.status), d = ut(i.priority), b = Pa(i.dueDate);
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
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(Ee, { bg: p.bg, fg: p.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${p.icon} text-[9px] mr-1` }),
              p.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(Ee, { bg: d.bg, fg: d.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.icon} text-[9px] mr-1` }),
              d.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: i.assigneeName ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ e.jsx(pt, { name: i.assigneeName, size: 22 }),
              /* @__PURE__ */ e.jsx("span", { className: "truncate text-text-secondary", children: i.assigneeName })
            ] }) : /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: "Atanmadı" }) }),
            /* @__PURE__ */ e.jsxs("td", { className: `px-3.5 py-2.5 text-right whitespace-nowrap ${b.tone}`, children: [
              i.dueDate ? Me(i.dueDate) : "—",
              b.hint && /* @__PURE__ */ e.jsx("div", { className: "text-[11px]", children: b.hint })
            ] })
          ]
        },
        i.id
      );
    }) })
  ] }) });
}
function Fr({ taskId: t, task: a = {}, onOpenSubtask: s }) {
  const r = ne(), o = (a == null ? void 0 : a.subTasks) ?? [], [l, n] = f.useState(null), [i, p] = f.useState(null), d = async (b, x) => {
    const m = o.find((c) => c.id === b);
    if (!(!m || m.status === x || !Oe(m).canChangeStatus)) {
      p(b);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.updateStatus(b, x)), await r.invalidateQueries({ queryKey: ["task-detail", t] });
      } catch (c) {
        $(c, "Alt görev durumu güncellenemedi.");
      } finally {
        p(null);
      }
    }
  };
  return o.length === 0 ? /* @__PURE__ */ e.jsx(
    ue,
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 items-start", children: ot.map((b) => {
      const x = be(b), m = o.filter((u) => u.status === b), c = l === b;
      return /* @__PURE__ */ e.jsxs(
        "section",
        {
          "aria-label": `${x.label} sütunu`,
          onDragOver: (u) => {
            u.preventDefault(), l !== b && n(b);
          },
          onDragLeave: () => n((u) => u === b ? null : u),
          onDrop: (u) => {
            var h;
            u.preventDefault(), n(null);
            const y = (h = u.dataTransfer) == null ? void 0 : h.getData("text/plain");
            y && d(y, b);
          },
          className: `flex flex-col gap-2 p-2.5 rounded-2xl border bg-surface-raised min-h-[120px] transition-colors duration-fast ${c ? "border-focus bg-primary-subtle" : "border-subtle"}`,
          children: [
            /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-2 px-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${x.dot}` }),
              /* @__PURE__ */ e.jsx("h3", { className: "m-0 flex-1 text-[12px] font-bold text-text-primary", children: x.label }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: m.length })
            ] }),
            m.map((u) => {
              const y = ut(u.priority), h = Oe(u).canChangeStatus;
              return /* @__PURE__ */ e.jsxs(
                "article",
                {
                  draggable: h,
                  onDragStart: (g) => {
                    var N;
                    return (N = g.dataTransfer) == null ? void 0 : N.setData("text/plain", u.id);
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
                      /* @__PURE__ */ e.jsxs("span", { className: `text-[10.5px] font-bold ${y.fg}`, children: [
                        /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${y.icon} text-[9px] mr-1` }),
                        y.label
                      ] }),
                      u.dueDate && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: Me(u.dueDate) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2 border-t border-subtle", children: [
                      u.assigneeName ? /* @__PURE__ */ e.jsx(pt, { name: u.assigneeName, size: 20 }) : /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] text-text-tertiary", children: "Atanmadı" }),
                      /* @__PURE__ */ e.jsx(
                        "select",
                        {
                          "aria-label": `${u.title} durumunu değiştir`,
                          value: u.status,
                          onClick: (g) => g.stopPropagation(),
                          onChange: (g) => d(u.id, Number(g.target.value)),
                          disabled: !h,
                          className: `h-[24px] px-1.5 rounded-[6px] border border-subtle bg-surface-base text-[10.5px] text-text-secondary ${h ? "cursor-pointer" : "cursor-default"}`,
                          children: ot.map((g) => /* @__PURE__ */ e.jsx("option", { value: g, children: be(g).label }, g))
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
        b
      );
    }) })
  );
}
const Ar = [
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
], zr = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], ia = (t) => String(t).padStart(2, "0"), Va = (t, a, s) => `${t}-${ia(a + 1)}-${ia(s)}`;
function St(t) {
  if (!t) return null;
  const a = /^(\d{4}-\d{2}-\d{2})/.exec(String(t));
  return a ? a[1] : null;
}
function Ir(t, a) {
  const r = (new Date(t, a, 1).getDay() + 6) % 7, o = new Date(t, a + 1, 0).getDate(), l = [];
  for (let n = 0; n < 42; n++) {
    const i = n - r + 1;
    l.push(i >= 1 && i <= o ? { key: Va(t, a, i), day: i, inMonth: !0 } : { key: `bos-${n}`, day: null, inMonth: !1 });
  }
  return l;
}
function Lr(t) {
  const a = /* @__PURE__ */ new Map(), s = (r, o) => {
    const l = St(r);
    l && (a.has(l) || a.set(l, []), a.get(l).push(o));
  };
  s(t == null ? void 0 : t.startDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "start", isSelf: !0, status: t == null ? void 0 : t.status }), s(t == null ? void 0 : t.dueDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "due", isSelf: !0, status: t == null ? void 0 : t.status });
  for (const r of (t == null ? void 0 : t.subTasks) ?? [])
    s(r.startDate, { id: r.id, title: r.title, kind: "start", isSelf: !1, status: r.status }), s(r.dueDate, { id: r.id, title: r.title, kind: "due", isSelf: !1, status: r.status });
  return a;
}
function Mr({ task: t = {}, onOpenSubtask: a }) {
  const s = f.useMemo(() => Lr(t), [t]), [r, o] = f.useState(() => {
    const d = St(t == null ? void 0 : t.startDate) ?? St(t == null ? void 0 : t.dueDate);
    if (d) {
      const [x, m] = d.split("-").map(Number);
      return { year: x, month: m - 1 };
    }
    const b = /* @__PURE__ */ new Date();
    return { year: b.getFullYear(), month: b.getMonth() };
  }), l = f.useMemo(() => Ir(r.year, r.month), [r.year, r.month]), n = (d) => o(({ year: b, month: x }) => {
    const m = x + d;
    return { year: b + Math.floor(m / 12), month: (m % 12 + 12) % 12 };
  }), i = /* @__PURE__ */ new Date(), p = Va(i.getFullYear(), i.getMonth(), i.getDate());
  return s.size === 0 ? /* @__PURE__ */ e.jsx(
    ue,
    {
      icon: "fa-calendar",
      title: "Takvimde gösterilecek tarih yok",
      description: "Göreve başlangıç veya termin tarihi girildiğinde burada aylık takvimde görünür."
    }
  ) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-3.5 py-3 border-b border-subtle bg-surface-raised", children: [
      /* @__PURE__ */ e.jsxs("h2", { className: "m-0 text-[13.5px] font-bold text-text-primary", children: [
        Ar[r.month],
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-subtle bg-surface-raised", children: zr.map((d) => /* @__PURE__ */ e.jsx("span", { className: "px-2 py-1.5 text-center text-[11px] font-bold text-text-tertiary", children: d }, d)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: l.map((d) => {
      const b = d.inMonth ? s.get(d.key) ?? [] : [], x = d.key === p;
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: `flex flex-col gap-1 min-h-[76px] p-1.5 border-r border-b border-subtle last-of-type:border-r-0 ${d.inMonth ? "" : "bg-surface-sunken"}`,
          children: [
            d.inMonth && /* @__PURE__ */ e.jsx("span", { className: `self-end font-mono text-[11px] font-bold ${x ? "flex items-center justify-center h-[18px] w-[18px] rounded-full bg-primary text-white" : "text-text-tertiary"}`, children: d.day }),
            b.map((m, c) => {
              const u = be(m.status);
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
                `${m.id}-${m.kind}-${c}`
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
function Kr(t) {
  const a = Ve();
  return a ? Promise.resolve(a.getDocuments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Rr(t) {
  const a = ne(), s = ["task-documents", t], r = te({
    queryKey: s,
    queryFn: () => Kr(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: s }), l = ae({
    mutationFn: (p) => Promise.resolve(Ve().createDocument(t, p)),
    onSuccess: o
  }), n = ae({
    mutationFn: ({ id: p, title: d, content: b }) => Promise.resolve(Ve().updateDocument(p, { title: d, content: b })),
    onSuccess: (p) => {
      o(), p != null && p.id && a.setQueryData(["task-document", p.id], p);
    }
  }), i = ae({
    mutationFn: (p) => Promise.resolve(Ve().deleteDocument(p)),
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
function Gr(t) {
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
function qr({ taskId: t }) {
  const { documents: a, isLoading: s, createDocument: r, updateDocument: o, removeDocument: l, isSaving: n } = Rr(t), [i, p] = f.useState(null), [d, b] = f.useState(""), [x, m] = f.useState(""), [c, u] = f.useState(!1), [y, h] = f.useState(!1), { data: g, isFetching: N } = Gr(i);
  f.useEffect(() => {
    !g || g.id !== i || (b(g.title ?? ""), m(g.content ?? ""), u(!1));
  }, [g == null ? void 0 : g.id]);
  const C = async () => {
    try {
      const P = await r("Yeni belge");
      P != null && P.id && p(P.id);
    } catch (P) {
      $(P, "Belge oluşturulamadı.");
    }
  }, z = async () => {
    var O, K, G, F, R, Q;
    const P = d.trim();
    if (!P)
      return (G = (K = (O = window == null ? void 0 : window.abp) == null ? void 0 : O.notify) == null ? void 0 : K.error) == null || G.call(K, "Belge başlığı boş olamaz."), !1;
    try {
      return await o({ id: i, title: P, content: x }), u(!1), (Q = (R = (F = window == null ? void 0 : window.abp) == null ? void 0 : F.notify) == null ? void 0 : R.success) == null || Q.call(R, "Belge kaydedildi."), !0;
    } catch (U) {
      return $(U, "Belge kaydedilemedi."), !1;
    }
  }, E = async (P, O) => {
    try {
      await l(P), i === P && p(null);
    } catch (K) {
      $(K, `“${O}” silinemedi.`);
    }
  }, _ = () => {
    if (c) {
      h(!0);
      return;
    }
    p(null);
  };
  return i ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: _,
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
            b(P.target.value), u(!0);
          },
          className: "flex-1 min-w-0 h-9 px-3 rounded-[10px] border border-subtle bg-surface-base text-[13.5px] font-bold text-text-primary focus:border-focus focus:shadow-focus focus:outline-none"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: z,
          disabled: n || !c,
          className: `flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[12.5px] font-bold ${n || !c ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n ? "fa-circle-notch fa-spin" : "fa-floppy-disk"} text-[11px]` }),
            n ? "Kaydediliyor…" : c ? "Kaydet" : "Kaydedildi"
          ]
        }
      )
    ] }),
    N && !g ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Belge yükleniyor…" }) : /* @__PURE__ */ e.jsx(
      Ea,
      {
        value: x,
        placeholder: "Belgeyi buraya yazın…",
        onChange: (P) => {
          m(P), u(!0);
        }
      }
    ),
    /* @__PURE__ */ e.jsx(
      Et,
      {
        open: y,
        isSaving: n,
        onStay: () => h(!1),
        onDiscard: () => {
          h(!1), u(!1), p(null);
        },
        onSave: async () => {
          const P = await z();
          h(!1), P && p(null);
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
      ue,
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
              onClick: () => p(P.id),
              className: "flex-1 min-w-0 bg-transparent border-0 p-0 text-left cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[13px] font-bold text-text-primary", children: P.title }),
                /* @__PURE__ */ e.jsx("span", { className: "block text-[11.5px] text-text-tertiary", children: P.contentLength > 0 ? `${P.editorName} · ${ct(P.lastModificationTime ?? P.creationTime)}` : "Boş belge — açıp yazmaya başlayın" })
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
function Yr(t) {
  const a = Le();
  return a ? Promise.resolve(a.getLinkedForms(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function _r(t) {
  const a = ne(), s = ["task-forms", t], r = te({
    queryKey: s,
    queryFn: () => Yr(t),
    enabled: !!t,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: s }), l = ae({
    mutationFn: (p) => Promise.resolve(Le().linkForm(t, p)),
    onSuccess: o
  }), n = ae({
    mutationFn: (p) => Promise.resolve(Le().unlinkForm(p)),
    onSuccess: o
  }), i = ae({
    mutationFn: ({ linkId: p, value: d }) => Promise.resolve(Le().setFormGuestFillable(p, d)),
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
function Ur(t, a) {
  return te({
    queryKey: ["task-form-options", t],
    queryFn: () => Promise.resolve(Le().getFormOptions(t)),
    enabled: !!t && !!a,
    meta: { persist: !1 },
    retry: !1
  });
}
function Vr(t, a) {
  return te({
    queryKey: ["task-form-responses", t, a],
    queryFn: () => Promise.resolve(Le().getFormResponses(t, a)),
    enabled: !!t && !!a,
    meta: { persist: !1 },
    retry: !1
  });
}
function Or({ taskId: t, documentId: a }) {
  const { data: s, isLoading: r } = Vr(t, a);
  return r ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Yanıtlar yükleniyor…" }) : s != null && s.length ? /* @__PURE__ */ e.jsx("ul", { className: "m-0 list-none p-0", children: s.map((o) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-3 px-3.5 py-2 border-t border-subtle", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${o.isGuestSubmission ? "fa-user-clock" : "fa-user"} text-[10px] text-text-tertiary` }),
      /* @__PURE__ */ e.jsx("span", { className: "truncate text-[12.5px] text-text-primary", children: o.respondentName }),
      o.isGuestSubmission && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: "· dış" })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary", children: ct(o.creationTime) })
  ] }, o.id)) }) : /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Bu görevde henüz yanıt yok." });
}
function Qr({ taskId: t }) {
  const { forms: a, isLoading: s, linkForm: r, unlinkForm: o, setGuestFillable: l, isLinking: n } = _r(t), [i, p] = f.useState(!1), [d, b] = f.useState(null), { data: x, isLoading: m } = Ur(t, i), c = le("Platform.Tasks.ShareExternally"), u = async (g) => {
    try {
      await r(g), p(!1);
    } catch (N) {
      $(N, "Form bağlanamadı.");
    }
  }, y = async (g) => {
    if (window.confirm(`“${g.title}” bağlantısı kaldırılsın mı? Form ve toplanmış yanıtlar silinmez.`))
      try {
        await o(g.id);
      } catch (N) {
        $(N, "Bağlantı kaldırılamadı.");
      }
  }, h = async (g, N) => {
    try {
      await l({ linkId: g.id, value: N });
    } catch (C) {
      $(C, "Ayar değiştirilemedi.");
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
      ue,
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
            onClick: () => b((N) => N === g.documentId ? null : g.documentId),
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
        g.responseCount > 0 && /* @__PURE__ */ e.jsx(Ga, { children: g.responseCount }),
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
            onClick: () => y(g),
            className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[12px]" })
          }
        )
      ] }),
      c && g.isPublished && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 px-3.5 pb-3 text-[11.5px] text-text-secondary cursor-pointer", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: !!g.isGuestFillable,
            onChange: (N) => h(g, N.target.checked)
          }
        ),
        "Süreli paylaşım linkiyle ekip dışından da doldurulabilsin"
      ] }),
      d === g.documentId && /* @__PURE__ */ e.jsx(Or, { taskId: t, documentId: g.documentId })
    ] }, g.id))
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
const qe = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
function Jr({ task: t = {} }) {
  const a = f.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((n, i) => ({
    id: n.id || `row-${i}`,
    name: n.title || "Başlıksız görev",
    isMain: !!n.__main,
    start: yt(n.startDate),
    end: yt(n.dueDate) || yt(n.completedDate),
    status: n.status ?? 1
  })), [t]), { min: s, span: r } = f.useMemo(() => {
    const l = a.flatMap((p) => [p.start, p.end]).filter(Boolean).map((p) => p.getTime());
    if (l.length === 0) return { min: null, span: 0 };
    const n = Math.min(...l), i = Math.max(...l);
    return { min: n, span: Math.max(1, i - n) };
  }, [a]), o = f.useMemo(() => s === null ? [] : [0, 1, 2, 3].map((l) => new Date(s + r * l / 4)), [s, r]);
  return s === null ? /* @__PURE__ */ e.jsx("div", { className: Se, children: /* @__PURE__ */ e.jsx(
    ue,
    {
      icon: "fa-bars-staggered",
      title: "Zaman çizelgesi çizilemiyor",
      description: "Görevde veya alt görevlerde başlangıç–bitiş tarihi tanımlı olmalı."
    }
  ) }) : /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Zaman çizelgesi" }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] text-text-tertiary", children: [
        qe(new Date(s)),
        " – ",
        qe(new Date(s + r))
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-4 gap-0 pl-[170px] mb-2 lt-860:pl-[110px]", children: o.map((l, n) => /* @__PURE__ */ e.jsx(
      "span",
      {
        className: "pl-2 border-l border-subtle text-[10.5px] font-bold uppercase tracking-[.06em] text-text-tertiary",
        children: qe(l)
      },
      n
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: a.map((l) => {
      const n = l.start ? l.start.getTime() : s, i = l.end ? Math.max(l.end.getTime(), n) : n, p = (n - s) / r * 100, d = Math.max(2, (i - n) / r * 100), b = Math.max(1, Math.round((i - n) / 864e5));
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
            className: `absolute top-[7px] bottom-[7px] flex items-center px-2.5 rounded-[7px] shadow-xs ${Hr[l.status] || "bg-primary"}`,
            style: { left: `${p}%`, width: `${d}%` },
            title: `${qe(l.start)} – ${qe(l.end)}`,
            children: /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[10.5px] font-bold text-white", children: [
              b,
              "g"
            ] })
          }
        ) })
      ] }, l.id);
    }) })
  ] });
}
function Oa(t, a = {}) {
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
function la({ icon: t, iconTone: a, title: s, note: r, children: o }) {
  return /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[12px] ${a}` }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: s }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
    ] }),
    o
  ] });
}
function Wr({ task: t = {}, readOnly: a = !1 }) {
  const s = ne(), r = t.predecessorIds || [], o = () => {
    var d, b, x;
    return (x = (b = (d = window == null ? void 0 : window.apya) == null ? void 0 : d.platform) == null ? void 0 : b.tasks) == null ? void 0 : x.task;
  }, { data: l = [], isLoading: n } = te({
    queryKey: ["task-predecessors", t.id, r],
    queryFn: async () => {
      const d = o();
      return d ? Promise.all(
        r.map(
          (b) => Promise.resolve(d.get(b)).catch(() => ({ id: b, title: "(erişilemeyen görev)", status: null, code: "—" }))
        )
      ) : [];
    },
    enabled: r.length > 0,
    staleTime: 3e4,
    meta: { persist: !1 },
    retry: !1
  }), i = async (d) => {
    var b, x, m;
    try {
      await Promise.resolve(o().update(t.id, Oa(t, {
        predecessorIds: r.filter((c) => c !== d)
      }))), await s.invalidateQueries({ queryKey: ["task-detail", t.id] }), (m = (x = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : x.info) == null || m.call(x, "Bağlantı kaldırıldı.");
    } catch (c) {
      $(c, "Bağlantı kaldırılamadı.");
    }
  }, p = (d) => {
    var b, x, m;
    return (m = (x = (b = window == null ? void 0 : window.apya) == null ? void 0 : b.taskDetail) == null ? void 0 : x.open) == null ? void 0 : m.call(x, d);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsx(
      la,
      {
        icon: "fa-arrow-left-long",
        iconTone: "text-warning",
        title: "Öncül görevler",
        note: "bu görev başlamadan tamamlanmalı",
        children: r.length === 0 ? /* @__PURE__ */ e.jsx(ue, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : n ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : l.map((d) => {
          const b = d.status == null ? null : be(d.status);
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
                    onClick: () => p(d.id),
                    className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                    children: d.title || "Başlıksız görev"
                  }
                ),
                b && /* @__PURE__ */ e.jsx(Ee, { bg: b.bg, fg: b.fg, children: b.label }),
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
          ue,
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
function ze() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task) || null;
}
function Zr(t) {
  const a = ne(), s = ["task-timelogs", t], r = ["task-active-timelog"], o = te({
    queryKey: s,
    queryFn: () => {
      var d;
      return Promise.resolve((d = ze()) == null ? void 0 : d.getTimeLogs(t));
    },
    enabled: !!t && !!ze(),
    staleTime: 15e3,
    meta: { persist: !1 },
    retry: !1
  }), l = te({
    queryKey: r,
    /* Kayıt yokken uç 204 döner, proxy undefined çözer; TanStack v5 undefined'ı
       hata sayıp önceki çalışan kaydı ekranda bırakır (sayaç durmazdı). */
    queryFn: () => {
      var d;
      return Promise.resolve((d = ze()) == null ? void 0 : d.getActiveTimeLog()).then((b) => b ?? null);
    },
    enabled: !!ze(),
    staleTime: 5e3,
    /* Canlı sayaç kanbandan da başlatılıp durduruluyor; açılışlar arasında taşınmaz. */
    meta: { persist: !1 },
    retry: !1
  }), n = () => {
    a.invalidateQueries({ queryKey: s }), a.invalidateQueries({ queryKey: r });
  }, i = ae({
    mutationFn: () => {
      var d;
      return Promise.resolve((d = ze()) == null ? void 0 : d.startTimeTracking(t));
    },
    onSuccess: n
  }), p = ae({
    mutationFn: () => {
      var d;
      return Promise.resolve((d = ze()) == null ? void 0 : d.stopTimeTracking(t));
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
function oa(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function Xr({ taskId: t, task: a = {} }) {
  const s = Zr(t), r = s.activeLog && s.activeLog.taskId === t ? s.activeLog : null, [o, l] = f.useState(() => Date.now());
  f.useEffect(() => {
    if (!r) return;
    const u = setInterval(() => l(Date.now()), 1e3);
    return () => clearInterval(u);
  }, [r]);
  const n = r ? Math.max(0, Math.floor((o - new Date(r.startTime).getTime()) / 1e3)) : 0, p = s.logs.reduce((u, y) => u + (y.secondsSpent || 0), 0) + n, d = (a == null ? void 0 : a.estimatedHours) ?? null, b = d ? d * 3600 : 0, x = b ? Math.min(100, Math.round(p / b * 100)) : 0, m = b ? Math.max(0, b - p) : 0, c = async () => {
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
              children: tr(p)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary", children: r ? "Kayıt sürüyor" : "Sayaç duraklatıldı" })
        ] })
      ] }),
      b > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] font-bold text-text-secondary", children: "Tahmin kullanımı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
            mt(p),
            " / ",
            d,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-warning", style: { width: `${x}%` } }) }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "Kalan tahmini süre: ",
          mt(m)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: Se, children: [
      /* @__PURE__ */ e.jsx(Qe, { title: "Zaman kayıtları" }),
      s.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : s.logs.length === 0 ? /* @__PURE__ */ e.jsx(
        ue,
        {
          icon: "fa-stopwatch",
          title: "Henüz zaman kaydı yok",
          description: "Soldaki yeşil düğmeyle sayacı çalıştırın; durdurduğunuzda kayıt buraya düşer."
        }
      ) : s.logs.map((u) => {
        const y = !u.endTime;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
            children: [
              /* @__PURE__ */ e.jsx(pt, { name: u.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: u.note || u.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                oa(u.startTime),
                " → ",
                y ? "sürüyor" : oa(u.endTime)
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary", children: y ? "Aktif" : mt(u.secondsSpent || 0) })
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
    component: Fr,
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
    component: qr,
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
function Qa(t = []) {
  const a = new Set(t);
  return We.filter((s) => !s.hidden).filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function Ha(t = []) {
  const a = new Set(t);
  return We.filter((s) => !s.hidden).filter((s) => !s.isCore).filter((s) => !s.permission || le(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let tt = null;
const it = /* @__PURE__ */ new Set(), vt = /* @__PURE__ */ new Set();
let at = !1;
function ca() {
  it.forEach((t) => t());
}
function en(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const H = {
  open(t) {
    const a = en(t);
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
    typeof t == "function" && vt.add(t);
  },
  emitResult() {
    at = !1, vt.forEach((t) => t());
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
    tt = null, at = !1, it.clear(), vt.clear();
  }
}, da = "apya.taskDetail.fullscreen";
function Ja({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, o] = f.useState(t), [l, n] = f.useState([]), { data: i, isPending: p, isError: d, refetch: b } = Ft(r), x = $a(), m = La(i), c = Ma(), u = Ka(r), [y, h] = f.useState("general"), [g, N] = f.useState(!1), C = _e.useRef(null), z = f.useMemo(
    () => Qa(u.assignedCodes),
    [u.assignedCodes]
  ), E = f.useMemo(
    () => Ha(u.assignedCodes),
    [u.assignedCodes]
  ), _ = z.find((M) => M.code === y) ?? z[0];
  _e.useEffect(() => {
    _.code !== y && h(_.code);
  }, [_, y]);
  const P = _ == null ? void 0 : _.component, O = ne(), [K, G] = f.useState(
    () => {
      var M;
      return ((M = window.localStorage) == null ? void 0 : M.getItem(da)) === "1";
    }
  ), [F, R] = f.useState(!1), [Q, U] = f.useState(!1), q = f.useCallback(() => {
    zt(), s == null || s();
  }, [s]);
  za(a === "page" ? null : t, q), _e.useEffect(() => {
    m.isDirty ? x.markDirty() : x.markClean();
  });
  const W = f.useCallback(() => {
    F || (U(!1), x.requestClose(q));
  }, [x, q, F]), Z = f.useCallback(() => {
    G((M) => {
      var ee;
      const Y = !M;
      return (ee = window.localStorage) == null || ee.setItem(da, Y ? "1" : "0"), Y;
    });
  }, []), D = le("Platform.Tasks.Delete"), [L, j] = f.useState(!1), [B, I] = f.useState(!1), S = f.useCallback(async () => {
    var M, Y, ee;
    I(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (ee = (Y = (M = window == null ? void 0 : window.abp) == null ? void 0 : M.notify) == null ? void 0 : Y.info) == null || ee.call(Y, "Başarıyla silindi."), j(!1), x.markClean(), q();
    } catch (he) {
      $(he, "Görev silinemedi.");
    } finally {
      I(!1);
    }
  }, [r, x, q]), se = f.useCallback(async () => {
    var M, Y, ee;
    if (!m.validate()) return !1;
    R(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, m.toUpdateDto())
      ), await O.invalidateQueries({ queryKey: ["task-detail", r] }), H.emitResult(), (ee = (Y = (M = window == null ? void 0 : window.abp) == null ? void 0 : M.notify) == null ? void 0 : Y.success) == null || ee.call(Y, "Kaydedildi."), !0;
    } catch (he) {
      return $(he, "Kaydedilemedi."), !1;
    } finally {
      R(!1);
    }
  }, [r, m, x, O]), k = f.useCallback(() => {
    se();
  }, [se]), ie = f.useCallback(async () => {
    if (U(!1), !m.validate()) {
      x.resolvePendingClose("stay"), h("general");
      return;
    }
    await se() ? x.resolvePendingClose("saved") : U(!0);
  }, [x, m, se]), X = f.useCallback((M, Y) => {
    x.requestClose(() => {
      n((ee) => [...ee, { id: r, title: (i == null ? void 0 : i.title) ?? "" }]), o(M), h("general"), x.markClean();
    });
  }, [x, r, i]), pe = f.useCallback((M) => {
    x.requestClose(() => {
      n((Y) => {
        const ee = Y.findIndex((he) => he.id === M);
        return ee === -1 ? Y : Y.slice(0, ee);
      }), o(M), h("general"), x.markClean();
    });
  }, [x]), w = f.useCallback(async (M) => {
    try {
      await u.addFeature(M), h(M), N(!1);
    } catch (Y) {
      $(Y, "Özellik eklenemedi.");
    }
  }, [u]), V = f.useCallback(async (M) => {
    try {
      await u.removeFeature(M), h((Y) => Y === M ? "general" : Y);
    } catch (Y) {
      $(Y, "Özellik kaldırılamadı.");
    }
  }, [u]);
  _e.useEffect(() => {
    if (!g) return;
    const M = (ee) => {
      C.current && !C.current.contains(ee.target) && N(!1);
    }, Y = (ee) => {
      ee.key === "Escape" && N(!1);
    };
    return document.addEventListener("mousedown", M), document.addEventListener("keydown", Y), () => {
      document.removeEventListener("mousedown", M), document.removeEventListener("keydown", Y);
    };
  }, [g]);
  const J = p ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(we, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(we, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(we, { className: "h-24 w-full" })
  ] }) : d && !i ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(re, { variant: "ghost", onClick: () => b(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      Hs,
      {
        trail: l,
        current: { id: r, title: (i == null ? void 0 : i.title) ?? "" },
        onNavigate: pe
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: C, children: [
      /* @__PURE__ */ e.jsx(
        Vs,
        {
          tabs: z,
          activeCode: _.code,
          onSelect: (M) => {
            h(M), N(!1);
          },
          onOpenPicker: () => N((M) => !M),
          pickerOpen: g
        }
      ),
      g && /* @__PURE__ */ e.jsx(
        Qs,
        {
          entries: E,
          busyCode: u.isMutating ? u.mutatingCode : null,
          onAdd: w,
          onRemove: V
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${_.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          _.code === "general" ? /* @__PURE__ */ e.jsx(
            qs,
            {
              values: m.values,
              errors: m.errors,
              onFieldChange: m.setField,
              assigneeOptions: c.options,
              isLoadingAssignees: c.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(f.Suspense, { fallback: /* @__PURE__ */ e.jsx(we, { className: "h-24 w-full" }), children: P && /* @__PURE__ */ e.jsx(
            P,
            {
              taskId: r,
              task: i,
              form: m,
              onOpenSubtask: X
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
  ] }), xe = a === "page" ? zs : As;
  return /* @__PURE__ */ e.jsxs(
    xe,
    {
      open: !0,
      fullscreen: K,
      onRequestClose: W,
      title: i ? `Görev Detayı: ${i.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        Ls,
        {
          task: i ?? { title: "Yükleniyor…" },
          canDelete: D,
          fullscreen: K,
          onToggleFullscreen: Z,
          onClose: W,
          onDelete: () => j(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        Ks,
        {
          lastSavedAt: i == null ? void 0 : i.lastModificationTime,
          isDirty: x.isDirty,
          isSaving: F,
          onCancel: W,
          onSave: k
        }
      ),
      children: [
        J,
        /* @__PURE__ */ e.jsx(
          Et,
          {
            open: x.pendingClose,
            isSaving: F,
            errorText: Q ? de("Common:Unsaved:SaveFailed", "Kaydedilemedi. Düzenlemeye dönebilir ya da değişiklikleri atabilirsiniz.") : void 0,
            onStay: () => {
              U(!1), x.resolvePendingClose("stay");
            },
            onDiscard: () => {
              U(!1), m.reset(), x.resolvePendingClose("discard");
            },
            onSave: ie
          }
        ),
        L && /* @__PURE__ */ e.jsx(
          tn,
          {
            taskTitle: (i == null ? void 0 : i.title) ?? "",
            busy: B,
            onCancel: () => j(!1),
            onConfirm: S
          }
        )
      ]
    }
  );
}
function tn({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [o, l] = f.useState(""), n = o.trim() === "SİL";
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
function an({ label: t, title: a, description: s, children: r, actions: o }) {
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
const sn = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function rn({ isPrivate: t = !1, onChange: a = () => {
}, disabled: s = !1 }) {
  const r = !!t, [o, l] = f.useState(null);
  return /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
    /* @__PURE__ */ e.jsx(De, { container: Pe(o), children: /* @__PURE__ */ e.jsxs(
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
          /* @__PURE__ */ e.jsx(Ts, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const xa = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto", nn = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", ln = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" },
  { what: "Bağlantı kopyala", key: "⌘ L" }
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
  onToggleFullscreen: o,
  onFieldChange: l = () => {
  },
  statusValue: n,
  titleValue: i,
  /* Doğrulama hatası (useTaskForm.errors.title): başlığın altında gösterilir. */
  titleError: p,
  isPrivateValue: d,
  isFavorite: b,
  onToggleFavorite: x,
  isWatched: m,
  onToggleWatch: c,
  onDuplicate: u,
  onArchive: y,
  onDelete: h,
  onOpenTransfer: g,
  onSaveAsTemplate: N,
  onConvertToSubtask: C,
  onExportPdf: z,
  /* Yetki (root hesaplar; sunucudaki EnsureCanMutateTaskAsync ile aynı kural). Eskiden
     menü ve alanlar herkese açıktı, yetkisiz kullanıcı tıklayınca 403 alıyordu. */
  canEdit: E = !0,
  canChangeStatus: _ = !0,
  canDelete: P = !0
}) {
  const [O, K] = f.useState(!1), [G, F] = f.useState(null), [R, Q] = f.useState(!1), U = f.useRef(null), q = f.useId(), W = Pe(G), Z = be(n ?? t.status), D = t.code || "GRV-—", L = () => {
    var S;
    (S = navigator.clipboard) == null || S.writeText(D), K(!0), setTimeout(() => K(!1), 1800);
  }, j = () => {
    var S, se, k, ie;
    (S = navigator.clipboard) == null || S.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), (ie = (k = (se = window == null ? void 0 : window.abp) == null ? void 0 : se.notify) == null ? void 0 : k.success) == null || ie.call(k, "Görev bağlantısı panoya kopyalandı.");
  }, B = (S) => () => {
    Q(!1), S == null || S();
  }, I = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", kbd: "⌘L", onClick: B(j) },
    { label: "Çoğalt", icon: "fa-copy", kbd: "⌘D", allowed: E, onClick: B(u) },
    { label: "Başka projeye kopyala", icon: "fa-clone", allowed: E, onClick: B(() => g == null ? void 0 : g("copy")) },
    { label: "Şablon olarak kaydet", icon: "fa-bookmark", allowed: E, onClick: B(N) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, allowed: E, onClick: B(() => g == null ? void 0 : g("move")) },
    { label: "Alt göreve dönüştür", icon: "fa-diagram-project", allowed: E, onClick: B(C) },
    { label: m ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: B(c) },
    { label: "Arşivle", icon: "fa-box-archive", separator: !0, allowed: _, onClick: B(y) },
    { label: "Yazdır", icon: "fa-print", kbd: "⌘P", onClick: B(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: B(z) },
    { label: "Sil", icon: "fa-trash-can", kbd: "⌫", separator: !0, danger: !0, allowed: P, onClick: B(h) }
  ].filter((S) => S.allowed !== !1);
  return /* @__PURE__ */ e.jsxs("header", { ref: F, className: "shrink-0 px-6 lt-860:px-4 pt-[18px] pb-4 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: L,
            title: "Kodu kopyala",
            className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[11px] font-bold tracking-[.04em] cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[9px] opacity-70" }),
              /* @__PURE__ */ e.jsx("span", { children: D }),
              /* @__PURE__ */ e.jsx("i", { className: `${O ? "fa-solid fa-check" : "fa-regular fa-copy"} text-[9px] opacity-60` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              disabled: !E,
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] border border-default text-[12px] font-semibold ${E ? "cursor-pointer" : "cursor-default"} ${Z.bg} ${Z.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-current animate-pulse" }),
                /* @__PURE__ */ e.jsx("span", { children: Z.label }),
                E && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: W, children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${xa} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            ot.map((S) => {
              const se = Ba[S], k = (n ?? t.status) === S;
              return /* @__PURE__ */ e.jsx(on, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => l("status", S),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${k ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${se.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: se.label }),
                    k && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, S);
            })
          ] }) })
        ] }),
        m && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 h-[26px] px-2.5 rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11.5px] font-semibold", children: [
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
          rn,
          {
            isPrivate: d ?? !!t.isPrivate,
            onChange: (S) => l("isPrivate", S),
            disabled: !E
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
        /* @__PURE__ */ e.jsxs(ke, { modal: !0, open: R, onOpenChange: Q, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer seçenekler",
              className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${R ? "bg-surface-hover text-text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: W, children: /* @__PURE__ */ e.jsxs(
            Te,
            {
              sideOffset: 6,
              align: "end",
              collisionBoundary: W ?? [],
              collisionPadding: 12,
              className: `${xa} w-[244px]`,
              children: [
                I.map((S) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: S.onClick,
                    className: [
                      nn,
                      S.danger ? "text-negative" : "text-text-secondary",
                      S.separator ? "border-t border-subtle mt-[5px]" : ""
                    ].join(" "),
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${S.icon} text-[11px] w-[14px] opacity-75` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: S.label }),
                      S.kbd && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: S.kbd })
                    ]
                  },
                  S.label
                )),
                /* @__PURE__ */ e.jsxs("div", { className: "mt-1.5 pt-[9px] px-[9px] pb-[7px] border-t border-subtle", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 mb-[7px]", children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-keyboard text-[11px] text-text-tertiary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-[.09em] text-text-tertiary", children: "Kısayollar" })
                  ] }),
                  ln.map((S) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: S.what }),
                    /* @__PURE__ */ e.jsx(cn, { children: S.key })
                  ] }, S.what))
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
          ref: U,
          role: "textbox",
          "aria-label": de("Tasks:Detail:TitleLabel", "Görev başlığı"),
          "aria-readonly": !E || void 0,
          "aria-invalid": !!p || void 0,
          "aria-describedby": p ? q : void 0,
          contentEditable: E,
          suppressContentEditableWarning: !0,
          spellCheck: !1,
          onInput: E ? (S) => l("title", S.currentTarget.textContent.trim()) : void 0,
          onBlur: E ? (S) => l("title", S.currentTarget.textContent.trim()) : void 0,
          className: `flex-1 min-w-0 text-[24px] lt-560:text-[20px] font-extrabold tracking-[-.025em] leading-[1.2] text-text-primary px-2 -ml-2 py-[3px] rounded-[9px] border ${p ? "border-negative" : "border-transparent"} ${E ? `cursor-text hover:bg-neutral-subtle focus:bg-neutral-subtle focus:shadow-focus focus:outline-none ${p ? "" : "hover:border-subtle focus:border-focus"}` : ""}`,
          children: i ?? t.title ?? "Başlıksız görev"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: x,
          title: b ? "Favorilerden çıkar" : "Favorilere ekle",
          className: `flex items-center justify-center h-8 w-8 shrink-0 rounded-[9px] cursor-pointer ${b ? "bg-warning-subtle text-warning" : "text-text-tertiary hover:bg-surface-hover"}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${b ? "solid" : "regular"} fa-star text-[15px]` })
        }
      )
    ] }),
    p && /* @__PURE__ */ e.jsx("p", { id: q, role: "alert", className: "mt-1 mb-0 text-[12px] font-semibold text-negative", children: p })
  ] });
}
const st = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", ua = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function je({ children: t }) {
  return /* @__PURE__ */ e.jsx(Bt, { asChild: !0, children: t });
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
function xn({
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
  startDateValue: d,
  tagsValue: b = [],
  progressPercent: x = 0,
  progressNote: m = "",
  onOpenTransfer: c,
  /* Düzenleme yetkisi yoksa ızgara salt okunur: tüm alanlar forma, oradan UpdateAsync'e
     gider; yetkisiz kullanıcı değiştirip Kaydet'te 403 alıyordu. */
  readOnly: u = !1,
  /* Doğrulama hataları (useTaskForm.errors): ilgili hücrenin altında gösterilir. */
  startDateError: y,
  dueDateError: h
}) {
  var S, se;
  const g = f.useId(), N = f.useId(), [C, z] = f.useState(""), [E, _] = f.useState(""), [P, O] = f.useState(""), [K, G] = f.useState(!1), [F, R] = f.useState(null), Q = be(o ?? t.status), U = ut(l ?? t.priority), q = n ?? t.assigneeId ?? null, W = i ?? t.projectId ?? null, Z = ((S = a.find((k) => k.value === q)) == null ? void 0 : S.label) || t.assigneeName || "Atanmamış", D = ((se = s.find((k) => k.value === W)) == null ? void 0 : se.label) || t.projectName || "Projesiz", L = Pa(p ?? t.dueDate), j = a.filter(
    (k) => !C || k.label.toLowerCase().includes(C.toLowerCase())
  ), B = s.filter(
    (k) => !E || k.label.toLowerCase().includes(E.toLowerCase())
  ), I = () => {
    const k = P.trim();
    k && !b.includes(k) && r("tagNames", [...b, k]), O(""), G(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { ref: R, className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsx(
    "fieldset",
    {
      disabled: u,
      className: "m-0 p-0 border-0 min-w-0 [&:disabled_label]:pointer-events-none [&_:disabled]:pointer-events-none [&:disabled_.fa-chevron-down]:hidden",
      children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6", children: [
        /* @__PURE__ */ e.jsx(me, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx(pa, { name: q ? Z : null }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: Z }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: Pe(F), children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${st} w-[264px]`, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: C,
                  onChange: (k) => z(k.target.value),
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
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] text-left cursor-pointer ${q ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary font-semibold"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "flex h-6 w-6 items-center justify-center rounded-full bg-neutral-subtle text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-user-slash text-[9px]" }) }),
                    /* @__PURE__ */ e.jsx("span", { children: "Atanmamış" })
                  ]
                }
              ) }),
              a.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-2 py-1.5 text-[12px] text-text-tertiary", children: "Kullanıcı listesi yükleniyor…" }),
              j.map((k) => /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("assigneeId", k.value),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${q === k.value ? "bg-primary-subtle" : "hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx(pa, { name: k.label, size: 24 }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: k.label }),
                    q === k.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
                  ]
                }
              ) }, k.value))
            ] })
          ] }) })
        ] }) }),
        /* @__PURE__ */ e.jsxs(me, { label: "Son tarih", children: [
          /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-regular fa-calendar text-[13px] ${L.tone}` }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "date",
                value: (p ?? t.dueDate ?? "").slice(0, 10),
                onChange: (k) => r("dueDate", k.target.value),
                "aria-label": "Son tarih",
                "aria-invalid": !!h || void 0,
                "aria-describedby": h ? g : void 0,
                className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
              }
            )
          ] }),
          h ? /* @__PURE__ */ e.jsx("span", { id: g, role: "alert", className: "-mt-0.5 text-[10.5px] font-semibold text-negative", children: h }) : L.hint && /* @__PURE__ */ e.jsx("span", { className: `-mt-0.5 text-[10.5px] font-semibold ${L.tone}`, children: L.hint })
        ] }),
        /* @__PURE__ */ e.jsxs(me, { label: "Başlangıç", children: [
          /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[13px] text-text-tertiary" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "date",
                value: (d ?? t.startDate ?? "").slice(0, 10),
                onChange: (k) => r("startDate", k.target.value),
                "aria-label": "Başlangıç",
                "aria-invalid": !!y || void 0,
                "aria-describedby": y ? N : void 0,
                className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
              }
            )
          ] }),
          y && /* @__PURE__ */ e.jsx("span", { id: N, role: "alert", className: "-mt-0.5 text-[10.5px] font-semibold text-negative", children: y })
        ] }),
        /* @__PURE__ */ e.jsx(me, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 pt-[5px]", children: [
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
        /* @__PURE__ */ e.jsx(me, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${Q.bg} ${Q.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${Q.icon} text-[11px]` }),
                /* @__PURE__ */ e.jsx("span", { children: Q.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: Pe(F), children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${st} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            ot.map((k) => {
              const ie = Ba[k], X = (o ?? t.status) === k;
              return /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("status", k),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${X ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${ie.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: ie.label }),
                    X && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, k);
            })
          ] }) })
        ] }) }) }),
        /* @__PURE__ */ e.jsx(me, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
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
          /* @__PURE__ */ e.jsx(De, { container: Pe(F), children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${st} w-[184px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
            ks.map((k) => {
              const ie = Cs[k], X = (l ?? t.priority) === k;
              return /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("priority", k),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${X ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${ie.icon} text-[11px] w-[13px]` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: ie.label }),
                    X && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, k);
            })
          ] }) })
        ] }) }) }),
        /* @__PURE__ */ e.jsx(me, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap min-h-8", children: [
          b.map((k) => /* @__PURE__ */ e.jsxs(
            "span",
            {
              className: "inline-flex items-center gap-1.5 h-6 px-2 rounded-[7px] border border-primary bg-primary-subtle text-primary text-[11.5px] font-bold",
              children: [
                /* @__PURE__ */ e.jsx("span", { children: k }),
                !u && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Etiketi kaldır",
                    onClick: () => r("tagNames", b.filter((ie) => ie !== k)),
                    className: "flex items-center p-0 border-0 bg-transparent text-current opacity-55 hover:opacity-100 hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
                  }
                )
              ]
            },
            k
          )),
          u ? b.length === 0 && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "—" }) : K ? /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: P,
              onChange: (k) => O(k.target.value),
              onBlur: I,
              onKeyDown: (k) => {
                k.key === "Enter" && I(), k.key === "Escape" && (O(""), G(!1));
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
        /* @__PURE__ */ e.jsx(me, { label: "Proje", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-[13px] text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: D }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(De, { container: Pe(F), children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", className: `${st} w-[250px]`, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: E,
                  onChange: (k) => _(k.target.value),
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
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${W ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-neutral-400" }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Projesiz" })
                  ]
                }
              ) }),
              B.map((k) => /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => r("projectId", k.value),
                  className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${W === k.value ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-primary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: k.label }),
                    W === k.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
                  ]
                }
              ) }, k.value))
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-[7px] pt-[7px] border-t border-subtle", children: [
              /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => c == null ? void 0 : c("move"),
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
                  onClick: () => c == null ? void 0 : c("copy"),
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
const un = "z-popover w-[225px] rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto";
function Mt({ entries: t = [], onPick: a, children: s }) {
  const [r, o] = f.useState(null), l = Pe(r);
  return /* @__PURE__ */ e.jsx("span", { ref: o, className: "contents", children: /* @__PURE__ */ e.jsxs(ke, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(Ce, { asChild: !0, children: s }),
    /* @__PURE__ */ e.jsx(De, { container: l, children: /* @__PURE__ */ e.jsxs(Te, { sideOffset: 6, align: "start", collisionPadding: 12, className: un, children: [
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
  onDragStart: o,
  onDragEnd: l,
  onReorderTo: n,
  onReorderDrop: i,
  pickerEntries: p = [],
  onPickFeature: d,
  counts: b = {},
  isDirty: x = !1
}) {
  const [m, c] = f.useState(!1);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-6 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 py-2.5 flex-1 min-w-0 overflow-x-auto custom-scrollbar", children: [
      s.map((u) => {
        const y = t === u.code, h = b[u.code] || 0;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            draggable: !0,
            title: "Sürükleyerek sırayı değiştirin",
            ...Fa(() => a(u.code)),
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
              y ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
              r === u.code ? "opacity-35" : "opacity-100"
            ].join(" "),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-[11px] opacity-85` }),
              /* @__PURE__ */ e.jsx("span", { children: u.title }),
              h > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                "rounded-full text-[10px] font-extrabold",
                y ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
              ].join(" "), children: h })
            ]
          },
          u.code
        );
      }),
      /* @__PURE__ */ e.jsx(Mt, { entries: p, onPick: d, children: /* @__PURE__ */ e.jsxs(
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
function mn({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: o,
  onDragEnd: l,
  onReorderTo: n,
  onReorderDrop: i,
  pickerEntries: p = [],
  onPickFeature: d,
  counts: b = {}
}) {
  return /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Görev özellikleri",
      className: "flex lt-860:hidden flex-col gap-[3px] w-[238px] shrink-0 py-4 px-3 border-r border-subtle bg-surface-base overflow-y-auto custom-scrollbar",
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "px-2.5 pt-1 pb-2 text-[10px] font-extrabold uppercase tracking-[.1em] text-text-tertiary", children: "Özellikler" }),
        s.map((x) => {
          const m = t === x.code, c = b[x.code] || 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              draggable: !0,
              title: "Sürükleyerek sırayı değiştirin",
              ...Fa(() => a(x.code)),
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
                c > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                  "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                  "rounded-full text-[10px] font-extrabold",
                  m ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
                ].join(" "), children: c })
              ]
            },
            x.code
          );
        }),
        /* @__PURE__ */ e.jsx(Mt, { entries: p, onPick: d, children: /* @__PURE__ */ e.jsxs(
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
function Ie({ label: t, value: a, avatarName: s }) {
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
function fn({ task: t = {}, nameById: a }) {
  const s = (l, n) => {
    var i;
    return l || n && ((i = a == null ? void 0 : a.get) == null ? void 0 : i.call(a, n)) || null;
  }, r = s(t.creatorName, t.creatorId), o = t.lastModificationTime ? s(t.lastModifierName, t.lastModifierId) : null;
  return /* @__PURE__ */ e.jsx("aside", { className: "flex flex-col gap-3.5 min-w-0", children: /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsx(Ie, { label: "Oluşturan", value: r || "Bilinmiyor", avatarName: r }),
    /* @__PURE__ */ e.jsx(Ie, { label: "Oluşturma tarihi", value: fa(t.creationTime) }),
    /* @__PURE__ */ e.jsx(Ie, { label: "Güncelleyen", value: o || "—", avatarName: o }),
    /* @__PURE__ */ e.jsx(Ie, { label: "Son güncelleme", value: fa(t.lastModificationTime) }),
    /* @__PURE__ */ e.jsx(Ie, { label: "Görev tipi", value: t.taskType }),
    /* @__PURE__ */ e.jsx(Ie, { label: "Sprint", value: t.sprint })
  ] }) });
}
const ba = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
function jt({ name: t, size: a = 32 }) {
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
const ga = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
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
  currentUserName: o = "Ben",
  /* Düzenleme yetkisi yoksa açıklama ve kontrol listesi salt okunur. Yorumlar açık
     kalır: görevi görebilen herkes yorum yazabilir (ürün kararı, 2026-09-28). */
  readOnly: l = !1
}) {
  const n = t == null ? void 0 : t.id, i = ne(), [p, d] = f.useState(!0), [b, x] = f.useState(""), m = (r == null ? void 0 : r.items) ?? [], c = m.filter((j) => j.isDone).length, u = m.length ? Math.round(c / m.length * 100) : 0, y = async () => {
    const j = b.trim();
    if (!(!j || !n)) {
      x("");
      try {
        await r.addItem(j);
      } catch (B) {
        x((I) => I || j), $(B, "Madde eklenemedi.");
      }
    }
  }, [h, g] = f.useState(!0), [N, C] = f.useState(""), [z, E] = f.useState(!1), [_, P] = f.useState(!1), [O, K] = f.useState(null), [G, F] = f.useState(""), [R, Q] = f.useState({}), { data: U = [] } = te({
    queryKey: ["task-comments", n],
    queryFn: () => {
      var j, B, I, S;
      return Promise.resolve((S = (I = (B = (j = window == null ? void 0 : window.apya) == null ? void 0 : j.platform) == null ? void 0 : B.tasks) == null ? void 0 : I.task) == null ? void 0 : S.getComments(n));
    },
    enabled: !!n,
    staleTime: 1e4,
    meta: { persist: !1 }
  }), q = async () => {
    await i.invalidateQueries({ queryKey: ["task-comments", n] }), await i.invalidateQueries({ queryKey: ["task-detail", n] });
  }, W = async () => {
    const j = N.trim();
    if (!(!j || !n || _)) {
      P(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.addComment(n, j)), await q(), C("");
      } catch (B) {
        $(B, "Yorum gönderilemedi.");
      } finally {
        P(!1);
      }
    }
  }, Z = async (j) => {
    const B = G.trim();
    if (!(!B || !n))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.replyToComment(j, B)), await q(), F(""), K(null);
      } catch (I) {
        $(I, "Yanıt gönderilemedi.");
      }
  }, D = (j) => Q((B) => {
    const I = B[j] ?? { liked: !1, count: 0 };
    return { ...B, [j]: { liked: !I.liked, count: I.count + (I.liked ? -1 : 1) } };
  }), L = !!N.trim() && !_;
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
          onChange: (j) => a("description", j),
          mentionName: o,
          readOnly: l
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
            m.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(ha, { open: p, onClick: () => d((j) => !j) })
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
              onClick: () => r.toggleItem(j.id).catch((B) => $(B, "Durum güncellenemedi.")),
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
              onClick: () => r.removeItem(j.id).catch((B) => $(B, "Madde silinemedi.")),
              className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
            }
          )
        ] }, j.id)),
        !l && /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            value: b,
            onChange: (j) => x(j.target.value),
            onKeyDown: (j) => {
              j.key === "Enter" && y();
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
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: U.length })
        ] }),
        /* @__PURE__ */ e.jsx(ha, { open: h, onClick: () => g((j) => !j) })
      ] }),
      h && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(jt, { name: o }),
          /* @__PURE__ */ e.jsxs("div", { className: `flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${z ? "border-focus bg-surface-base shadow-focus" : "border-default bg-surface-raised"}`, children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                rows: 2,
                value: N,
                onChange: (j) => C(j.target.value),
                onFocus: () => E(!0),
                onBlur: () => E(!1),
                onKeyDown: (j) => {
                  j.key === "Enter" && (j.ctrlKey || j.metaKey) && (j.preventDefault(), W());
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
                  onMouseDown: (B) => B.preventDefault(),
                  onClick: () => C((B) => B + j.add),
                  className: "flex items-center justify-center h-7 w-7 rounded-[7px] text-text-tertiary hover:bg-surface-hover hover:text-primary cursor-pointer",
                  children: /* @__PURE__ */ e.jsx("i", { className: `${j.icon} text-[12px]` })
                },
                j.title
              )) }),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: W,
                  disabled: !L,
                  className: `flex items-center gap-[7px] h-[30px] px-3.5 rounded-[9px] text-[12px] font-bold shadow-xs ${L ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${_ ? "fa-circle-notch fa-spin" : "fa-paper-plane"} text-[10px]` }),
                    "Gönder"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1", children: U.map((j) => {
          const B = R[j.id] ?? { liked: !1, count: 0 };
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start py-3 border-t border-subtle", children: [
            /* @__PURE__ */ e.jsx(jt, { name: j.authorName }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: j.authorName }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: ga(j.creationTime) })
              ] }),
              /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[13px] leading-[1.65] text-text-secondary whitespace-pre-wrap", children: j.text }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 mt-[3px]", children: [
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => D(j.id),
                    className: `flex items-center gap-1.5 h-[26px] px-[9px] rounded-full border text-[11px] font-semibold cursor-pointer ${B.liked ? "border-primary bg-primary-subtle text-primary" : "border-default bg-transparent text-text-tertiary hover:border-focus"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-thumbs-up text-[10px]" }),
                      B.count
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      K((I) => I === j.id ? null : j.id), F("");
                    },
                    className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-full text-text-tertiary text-[11px] font-semibold hover:bg-surface-hover hover:text-primary cursor-pointer",
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                      "Yanıtla"
                    ]
                  }
                )
              ] }),
              O === j.id && /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 mt-2 animate-fade-in-fast", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: G,
                    onChange: (I) => F(I.target.value),
                    onKeyDown: (I) => {
                      I.key === "Enter" && Z(j.id);
                    },
                    placeholder: `@${j.authorName} kullanıcısına yanıt ver…`,
                    className: "flex-1 h-8 px-3 rounded-[9px] border border-focus bg-surface-base text-text-primary text-[12px] shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => Z(j.id),
                    className: "h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover",
                    children: "Yanıtla"
                  }
                )
              ] }),
              (j.replies ?? []).map((I) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] mt-2.5 pl-3 border-l-2 border-default", children: [
                /* @__PURE__ */ e.jsx(jt, { name: I.authorName, size: 24 }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: I.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: ga(I.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-[3px] mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: I.text })
                ] })
              ] }, I.id))
            ] })
          ] }, j.id);
        }) })
      ] })
    ] })
  ] });
}
function hn({
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
  }).format(new Date(t)) : "—", i = s ? "fa-solid fa-circle-notch fa-spin" : r ? "fa-solid fa-check" : "fa-regular fa-floppy-disk", p = s ? "Kaydediliyor…" : r ? "Kaydedildi" : "Kaydet", d = a && !s;
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
          disabled: s,
          className: "h-9 px-4 rounded-[10px] border border-default bg-surface-base text-text-secondary text-[13px] font-semibold hover:bg-surface-hover hover:text-text-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          children: "Vazgeç"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: l,
          disabled: !d,
          className: `flex items-center gap-2 h-9 px-[22px] rounded-[10px] text-white text-[13px] font-bold shadow-sm ${d ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `${i} text-[11px]` }),
            p
          ]
        }
      )
    ] })
  ] });
}
const gn = Object.fromEntries(We.map((t) => [t.code, t])), yn = {
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
  const a = gn[t], s = yn[t];
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
function ya({ code: t, onRemoveFeature: a, pickerEntries: s = [], onPickFeature: r, canRemove: o = !0 }) {
  const l = Nn(t) ?? { title: t, desc: "", icon: "fa-cube", bg: "bg-neutral-subtle", fg: "text-text-secondary" };
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
function Wa({ open: t, onClose: a, label: s, children: r }) {
  return /* @__PURE__ */ e.jsx(
    Ss,
    {
      open: t,
      onOpenChange: (o) => {
        o || a == null || a();
      },
      children: /* @__PURE__ */ e.jsxs($s, { children: [
        /* @__PURE__ */ e.jsx(Ps, { className: "fixed inset-0", style: { pointerEvents: "none" } }),
        /* @__PURE__ */ e.jsx(Es, { asChild: !0, "aria-describedby": void 0, children: /* @__PURE__ */ e.jsxs("div", { className: "fixed inset-0 z-modal", children: [
          /* @__PURE__ */ e.jsx(Bs, { className: "sr-only", children: s }),
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
], va = {
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
  projectOptions: o = [],
  currentProjectId: l,
  counts: n = {},
  onCreateProject: i
}) {
  const [p, d] = f.useState(a), [b, x] = f.useState([]), [m, c] = f.useState(""), [u, y] = f.useState(""), [h, g] = f.useState(va), [N, C] = f.useState(!1);
  f.useEffect(() => {
    t && (d(a), x([]), c(""), y(""), g(va));
  }, [t, a]);
  const z = f.useMemo(
    () => o.filter((D) => D.value && D.value !== l),
    [o, l]
  ), E = z.filter((D) => !m || D.label.toLowerCase().includes(m.toLowerCase())), _ = z.length > 0 && b.length === z.length;
  if (!t) return null;
  const P = (D) => x((L) => L.includes(D) ? L.filter((j) => j !== D) : [...L, D]), O = (D) => {
    var L;
    return ((L = o.find((j) => j.value === D)) == null ? void 0 : L.label) ?? "";
  }, K = async () => {
    const D = u.trim();
    if (!(!D || N)) {
      C(!0);
      try {
        const L = await (i == null ? void 0 : i(D));
        L && x((j) => [...j, L]), y("");
      } catch (L) {
        $(L, "Proje oluşturulamadı.");
      } finally {
        C(!1);
      }
    }
  }, G = async () => {
    if (!(!b.length || N)) {
      C(!0);
      try {
        await (r == null ? void 0 : r({ mode: p, targetProjectIds: b, include: h }));
      } finally {
        C(!1);
      }
    }
  }, F = p === "move", R = b.length, Q = F ? R > 1 ? "Taşı ve kopyala" : "Taşı" : R > 1 ? `${R} projeye kopyala` : "Kopyala", U = Object.values(h).filter(Boolean).length, q = b.map(O).filter(Boolean), W = q.length ? `${q.length > 2 ? `${q.slice(0, 2).join(", ")} +${q.length - 2}` : q.join(", ")} · ${U} seçenek açık` : `Proje seçilmedi · ${U} seçenek açık`, Z = (D) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${D ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return /* @__PURE__ */ e.jsx(Wa, { open: t, onClose: s, label: F ? "Başka projeye taşı" : "Başka projelere kopyala", children: /* @__PURE__ */ e.jsx(
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
          onClick: (D) => D.stopPropagation(),
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
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => d("move"), className: Z(F), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[10px]" }),
                "Taşı"
              ] }),
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => d("copy"), className: Z(!F), children: [
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
                      onClick: () => x(_ ? [] : z.map((D) => D.value)),
                      className: "p-0 border-0 bg-transparent text-primary text-[11px] font-bold cursor-pointer hover:underline",
                      children: _ ? "Seçimi temizle" : "Tümünü seç"
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
                      onChange: (D) => c(D.target.value),
                      placeholder: "Proje ara…",
                      className: "w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar", children: [
                  E.map((D) => {
                    const L = b.includes(D.value), j = F && b[0] === D.value;
                    return /* @__PURE__ */ e.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => P(D.value),
                        className: `flex items-center gap-[11px] px-3 py-[11px] rounded-[11px] border text-left cursor-pointer hover:border-focus ${L ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                        children: [
                          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] rounded-[5px] border-[1.5px] text-white ${L ? "bg-primary border-primary" : "bg-transparent border-strong"}`, children: L && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" }) }),
                          /* @__PURE__ */ e.jsx("span", { className: "h-2.5 w-2.5 shrink-0 rounded-[3px] bg-primary" }),
                          /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: D.label }),
                          j && /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center h-5 px-2 rounded-md bg-primary text-white text-[10px] font-extrabold", children: "TAŞINACAK" })
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
                      onChange: (D) => y(D.target.value),
                      onKeyDown: (D) => {
                        D.key === "Enter" && (D.preventDefault(), K());
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
                      disabled: !u.trim() || N,
                      className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-plus text-[12px]" })
                    }
                  )
                ] }),
                F && R > 1 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle", children: [
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
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: wn.map((D) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-px", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary", children: D.label }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: D.countKey ? `${n[D.countKey] ?? 0} ${D.unit}` : D.desc })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    kn,
                    {
                      on: h[D.key],
                      label: D.label,
                      onClick: () => g((L) => ({ ...L, [D.key]: !L[D.key] }))
                    }
                  )
                ] }, D.key)) })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3.5 px-[22px] py-3.5 border-t border-subtle bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("span", { className: "min-w-0 truncate text-[11.5px] text-text-tertiary", children: W }),
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
                    disabled: !R || N,
                    className: `flex items-center gap-2 h-9 px-5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${R && !N ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${N ? "fa-circle-notch fa-spin" : "fa-arrow-right"} text-[10px]` }),
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
function Nt({ name: t, size: a = 22 }) {
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
function En({
  subtaskId: t,
  parentCode: a,
  onClose: s,
  onOpenFull: r,
  onDeleted: o,
  currentUserName: l = "Ben"
}) {
  var ie, X, pe;
  const n = ne(), { data: i } = Ft(t), p = Lt(t), d = It(t), [b, x] = f.useState("general"), [m, c] = f.useState(""), [u, y] = f.useState(""), [h, g] = f.useState(""), N = f.useRef(null), C = f.useRef(null);
  i && C.current !== i.id && (C.current = i.id, c(i.description ?? ""));
  const { data: z = [] } = te({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var w, V, J, xe;
      return Promise.resolve((xe = (J = (V = (w = window == null ? void 0 : window.apya) == null ? void 0 : w.platform) == null ? void 0 : V.tasks) == null ? void 0 : J.task) == null ? void 0 : xe.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4,
    meta: { persist: !1 }
  });
  if (f.useEffect(() => {
    const w = (V) => {
      V.key === "Escape" && (V.stopPropagation(), s == null || s());
    };
    return window.addEventListener("keydown", w), () => window.removeEventListener("keydown", w);
  }, [s]), !i) return null;
  const { canEdit: E, canChangeStatus: _, canDelete: P } = Oe(i), O = (pe = (X = (ie = window == null ? void 0 : window.apya) == null ? void 0 : ie.platform) == null ? void 0 : X.tasks) == null ? void 0 : pe.task, K = be(i.status), G = ut(i.priority), F = p.items ?? [], R = F.filter((w) => w.isDone).length, Q = F.length ? Math.round(R / F.length * 100) : 0, U = d.attachments ?? [], q = { checklist: F.length, comments: z.length, files: U.length }, W = async () => {
    await n.invalidateQueries({ queryKey: ["task-detail", t] });
  }, Z = async (w) => {
    try {
      await Promise.resolve(w()), await W();
    } catch (V) {
      $(V, "Alt görev güncellenemedi.");
    }
  }, D = (w) => Z(() => O.update(i.id, Oa(i, w))), L = () => Z(() => O.updateStatus(i.id, i.status >= 4 ? 1 : i.status + 1)), j = () => Z(() => O.setPriority(i.id, i.priority >= 4 ? 1 : i.priority + 1)), B = () => {
    (i.description ?? "") !== m && D({ description: m || null });
  }, I = async () => {
    const w = u.trim();
    if (w) {
      y("");
      try {
        await p.addItem(w);
      } catch (V) {
        $(V, "Madde eklenemedi.");
      }
    }
  }, S = async () => {
    const w = h.trim();
    if (w) {
      g("");
      try {
        await Promise.resolve(O.addComment(i.id, w)), await n.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch (V) {
        $(V, "Yorum gönderilemedi.");
      }
    }
  }, se = async () => {
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(O.delete(i.id)), o == null || o(i.id), s == null || s();
      } catch (w) {
        $(w, "Alt görev silinemedi.");
      }
  }, k = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
  return /* @__PURE__ */ e.jsxs(Wa, { open: !0, onClose: s, label: `${i.code} alt görev detayı`, children: [
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
                    className: `${k} hover:bg-surface-hover hover:text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-up-right-from-square text-[11px]" })
                  }
                ),
                P && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Alt görevi sil",
                    onClick: se,
                    className: `${k} hover:bg-negative-subtle hover:text-negative`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Kapat",
                    onClick: s,
                    className: `${k} hover:bg-surface-hover hover:text-text-primary`,
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
                  disabled: !_,
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold ${_ ? "cursor-pointer" : "cursor-default"} ${K.bg} ${K.fg}`,
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
                  disabled: !E,
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold ${E ? "cursor-pointer" : "cursor-default"} ${G.bg} ${G.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${G.icon} text-[10px]` }),
                    G.label
                  ]
                }
              ),
              (i.tags ?? []).map((w) => /* @__PURE__ */ e.jsx("span", { className: "flex items-center h-6 px-[9px] rounded-[7px] border border-default bg-neutral-subtle text-text-secondary text-[11px] font-semibold", children: w.name }, w.id ?? w.name)),
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
                /* @__PURE__ */ e.jsx(Nt, { name: i.assigneeName }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", children: i.assigneeName || "Atanmamış" })
              ] }) }),
              /* @__PURE__ */ e.jsx(rt, { label: "Son tarih", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] h-[22px] text-[12.5px] font-semibold text-text-primary", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[11px] text-text-tertiary" }),
                Pn(i.dueDate)
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
                  Q
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: "block h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("span", { className: "block h-full rounded-full bg-success", style: { width: `${Q}%` } }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: Dn.map((w) => {
            const V = b === w.code, J = q[w.code] ?? 0;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => x(w.code),
                className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${V ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${w.icon} text-[11px] opacity-85` }),
                  /* @__PURE__ */ e.jsx("span", { children: w.title }),
                  J > 0 && /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-neutral-subtle text-text-tertiary text-[10px] font-extrabold", children: J })
                ]
              },
              w.code
            );
          }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar px-5 py-[18px] bg-surface-raised", children: [
            b === "general" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Açıklama" }),
              /* @__PURE__ */ e.jsx(
                "textarea",
                {
                  rows: 7,
                  value: m,
                  onChange: (w) => c(w.target.value),
                  onBlur: E ? B : void 0,
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
            b === "checklist" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px]", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Kontrol listesi" }),
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: [
                  R,
                  "/",
                  F.length
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-success", style: { width: `${Q}%` } }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px] mt-1", children: [
                F.map((w) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] border border-subtle bg-surface-base hover:border-default", children: [
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Tamamlandı işaretle",
                      onClick: () => p.toggleItem(w.id),
                      disabled: !E,
                      className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${E ? "cursor-pointer" : "cursor-default"} ${w.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
                      children: w.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[12.5px] font-semibold ${w.isDone ? "line-through text-text-tertiary" : "text-text-primary"}`, children: w.text }),
                  E && /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Maddeyi sil",
                      onClick: () => p.removeItem(w.id),
                      className: "flex shrink-0 items-center justify-center h-6 w-6 rounded-md text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[10px]" })
                    }
                  )
                ] }, w.id)),
                E && /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "text",
                    value: u,
                    onChange: (w) => y(w.target.value),
                    onKeyDown: (w) => {
                      w.key === "Enter" && I();
                    },
                    placeholder: "Yeni madde yaz ve Enter'a bas…",
                    className: "h-9 mt-1 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                )
              ] })
            ] }),
            b === "comments" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] items-start", children: [
                /* @__PURE__ */ e.jsx(Nt, { name: l, size: 30 }),
                /* @__PURE__ */ e.jsx(
                  "textarea",
                  {
                    rows: 2,
                    value: h,
                    onChange: (w) => g(w.target.value),
                    onKeyDown: (w) => {
                      w.key === "Enter" && !w.shiftKey && (w.preventDefault(), S());
                    },
                    placeholder: "Yorum yaz ve Enter'a bas…",
                    className: "flex-1 min-w-0 px-3 py-2.5 rounded-[11px] border border-default bg-surface-base text-text-primary text-[12.5px] leading-[1.6] resize-none focus:border-focus focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: S,
                    "aria-label": "Yorumu gönder",
                    className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] ${h.trim() ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paper-plane text-[11px]" })
                  }
                )
              ] }),
              z.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-[7px] py-7 rounded-xl border border-dashed border-default", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-comments text-xl text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Henüz yorum yok" })
              ] }) : z.map((w) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 items-start p-3 rounded-xl border border-subtle bg-surface-base", children: [
                /* @__PURE__ */ e.jsx(Nt, { name: w.authorName, size: 28 }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: w.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: $n(w.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: w.text })
                ] })
              ] }, w.id))
            ] }),
            b === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  ref: N,
                  type: "file",
                  className: "hidden",
                  onChange: (w) => {
                    var J;
                    const V = (J = w.target.files) == null ? void 0 : J[0];
                    w.target.value = "", V && d.upload(V).catch((xe) => $(xe, "Dosya yüklenemedi."));
                  }
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    var w;
                    return (w = N.current) == null ? void 0 : w.click();
                  },
                  disabled: d.isUploading,
                  className: "flex flex-col items-center justify-center gap-[7px] p-6 rounded-[13px] border-2 border-dashed border-strong bg-surface-base cursor-pointer hover:border-focus hover:bg-primary-subtle disabled:opacity-60",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.isUploading ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-xl text-text-tertiary` }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: d.isUploading ? "Yükleniyor…" : "Dosya ekle" })
                  ]
                }
              ),
              U.map((w) => {
                const V = Tn(w.fileName);
                return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${V.bg} ${V.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${V.icon} text-[13px]` }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: w.fileName }),
                    /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                      Sn(w.fileSize),
                      " · ",
                      w.uploaderName
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "a",
                    {
                      href: w.downloadUrl,
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
                      onClick: () => d.remove(w.id).catch((J) => $(J, "Dosya silinemedi.")),
                      className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                    }
                  )
                ] }, w.id);
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
const Za = "apya.taskDetail.tabOrder", Bn = "taskdetail";
function ja() {
  try {
    const t = localStorage.getItem(Za);
    if (!t) return [];
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.filter((s) => typeof s == "string") : [];
  } catch {
    return [];
  }
}
function Fn(t) {
  try {
    localStorage.setItem(Za, JSON.stringify(t));
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
        scope: Bn,
        tabs: t.map((s) => ({ kind: s, ref: "", title: "" }))
      })
    }).catch(() => {
    });
  } catch {
  }
}
function An(t) {
  const [a, s] = f.useState(() => Na() ?? ja()), [r, o] = f.useState(null);
  f.useEffect(() => {
    if (Na() === null) {
      const d = ja();
      d.length && wa(d);
    }
  }, []);
  const l = f.useMemo(() => {
    const d = new Map(t.map((x) => [x.code, x])), b = [];
    for (const x of a) {
      const m = d.get(x);
      m && (b.push(m), d.delete(x));
    }
    for (const x of t)
      d.has(x.code) && b.push(x);
    return b;
  }, [t, a]), n = f.useCallback((d) => {
    s((b) => {
      const x = r;
      if (!x || x === d) return b;
      const m = b.length ? b.slice() : l.map((y) => y.code), c = m.indexOf(x), u = m.indexOf(d);
      return c === -1 || u === -1 ? b : (m.splice(c, 1), m.splice(u, 0, x), m);
    });
  }, [r, l]), i = f.useCallback((d) => o(d), []), p = f.useCallback(() => {
    o(null), s((d) => {
      const b = d.length ? d : l.map((x) => x.code);
      return Fn(b), wa(b), b;
    });
  }, [l]);
  return { orderedTabs: l, draggingCode: r, handleDragStart: i, handleDragEnd: p, reorderTo: n };
}
function zn() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function In() {
  const t = te({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: zn,
    staleTime: 3e5,
    retry: !1
  }), a = t.data ?? [], s = a.map((o) => ({ value: o.id, label: o.name })), r = new Map(a.map((o) => [o.id, o.name]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
const ka = "apya.taskDetail.fullscreen", ce = {
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
function Ln(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function Xa({ taskId: t, presentation: a = "modal", onClose: s, switchToTask: r }) {
  var Yt, _t, Ut, Vt, Ot, Qt, Ht, Jt;
  const [o, l] = f.useState(t), { data: n, isPending: i, isError: p, error: d, refetch: b } = Ft(o), x = ne(), m = $a(), c = La(n), u = Ma(), y = In(), h = Ka(o), g = Lt(o), [N, C] = f.useState("general"), [z, E] = f.useState(!1), [_, P] = f.useState(!1), [O, K] = f.useState(!1), [G, F] = f.useState(null), [R, Q] = f.useState(null), [U, q] = f.useState(!1), [W, Z] = f.useState(!1), [D, L] = f.useState(() => {
    try {
      return localStorage.getItem(ka) === "true";
    } catch {
      return !1;
    }
  });
  za(a === "page" ? null : o);
  const [j, B] = f.useState(null);
  n != null && n.id && n.id !== j && (B(n.id), q(!!n.isFavorite), Z(!!n.isWatched)), f.useEffect(() => {
    c.isDirty ? m.markDirty() : m.markClean();
  }), f.useEffect(() => {
    const v = x.getQueryCache().subscribe((A) => {
      var oe;
      A.type === "updated" && ((oe = A.action) == null ? void 0 : oe.type) === "invalidate" && !Fs(A.query.queryKey) && H.markChanged();
    }), T = x.getMutationCache().subscribe((A) => {
      A.type === "added" && H.markChanged();
    });
    return () => {
      v(), T();
    };
  }, [x]);
  const I = f.useCallback(() => {
    zt(), s == null || s();
  }, [s]), S = f.useCallback(() => {
    z || (K(!1), m.requestClose(I));
  }, [m, I, z]), se = (v) => {
    K(!1), m.requestClose(() => (r ?? l)(v));
  }, k = f.useCallback(() => {
    L((v) => {
      const T = !v;
      try {
        localStorage.setItem(ka, String(T));
      } catch {
      }
      return T;
    });
  }, []), ie = f.useMemo(
    () => Qa(h.assignedCodes),
    [h.assignedCodes]
  ), X = An(ie), pe = f.useMemo(
    () => Ha(h.assignedCodes),
    [h.assignedCodes]
  ), w = (v, T) => {
    if (T) {
      C(v);
      return;
    }
    xs(v);
  }, V = f.useMemo(() => {
    var v, T, A, oe, ge;
    return {
      subtasks: ((v = n == null ? void 0 : n.subTasks) == null ? void 0 : v.length) ?? 0,
      files: ((T = n == null ? void 0 : n.attachments) == null ? void 0 : T.length) ?? 0,
      dependencies: ((A = n == null ? void 0 : n.predecessorIds) == null ? void 0 : A.length) ?? 0,
      comments: ((oe = n == null ? void 0 : n.comments) == null ? void 0 : oe.length) ?? 0,
      checklist: ((ge = g.items) == null ? void 0 : ge.length) ?? 0
    };
  }, [n, g.items]), J = We.find((v) => v.code === N), xe = g.items ?? [], M = xe.filter((v) => v.isDone).length, Y = xe.length ? Math.round(M / xe.length * 100) : 0, ee = f.useRef(null), [he, ts] = f.useState(0), Kt = () => c.validate() ? !0 : (ce.err(de("Tasks:Detail:Validation:Summary", "Kaydedilemedi: işaretli alanları düzeltin.")), ts((v) => v + 1), !1);
  f.useEffect(() => {
    var T, A;
    if (!he) return;
    const v = (T = ee.current) == null ? void 0 : T.querySelector('[aria-invalid="true"]');
    v == null || v.focus(), (A = v == null ? void 0 : v.scrollIntoView) == null || A.call(v, { block: "nearest" });
  }, [he]);
  const Ze = f.useCallback(async () => {
    if (!Kt()) return !1;
    E(!0);
    try {
      const v = c.values, T = await Promise.resolve(window.apya.platform.tasks.task.update(o, c.toUpdateDto()));
      await x.invalidateQueries({ queryKey: ["task-detail", o] });
      const A = x.getQueryState(["task-detail", o]);
      return c.commitSaved(v, (A == null ? void 0 : A.status) === "success" ? A.data : T), H.emitResult(), P(!0), setTimeout(() => P(!1), 2e3), ce.ok("Görev başarıyla güncellendi."), !0;
    } catch (v) {
      return $(v, "Kaydedilemedi."), !1;
    } finally {
      E(!1);
    }
  }, [o, c, x]), as = () => {
    K(!1), m.resolvePendingClose("stay");
  }, ss = () => {
    K(!1), c.reset(), m.resolvePendingClose("discard");
  }, rs = async () => {
    if (K(!1), !Kt()) {
      m.resolvePendingClose("stay");
      return;
    }
    await Ze() ? m.resolvePendingClose("saved") : K(!0);
  };
  f.useEffect(() => {
    const v = (T) => {
      if ((T.ctrlKey || T.metaKey) && T.key.toLowerCase() === "s") {
        T.preventDefault(), c.isDirty && !z && !m.pendingClose && Ze();
        return;
      }
      T.key === "Escape" && G && (T.stopPropagation(), F(null));
    };
    return window.addEventListener("keydown", v), () => window.removeEventListener("keydown", v);
  }, [Ze, c.isDirty, z, G, m.pendingClose]);
  const Be = () => {
    var v, T, A;
    return (A = (T = (v = window == null ? void 0 : window.apya) == null ? void 0 : v.platform) == null ? void 0 : T.tasks) == null ? void 0 : A.task;
  }, ns = async () => {
    var T;
    const v = !U;
    q(v), H.markChanged();
    try {
      await Promise.resolve((T = Be()) == null ? void 0 : T.toggleFavorite(o));
    } catch (A) {
      q(!v), $(A, "Favori güncellenemedi.");
    }
  }, is = () => {
    if (!o) return;
    const v = document.createElement("a");
    v.href = `/Tasks/Detail/${o}?handler=Pdf`, v.rel = "noopener", document.body.appendChild(v), v.click(), v.remove();
  }, ls = async () => {
    var T;
    const v = !W;
    Z(v), H.markChanged();
    try {
      await Promise.resolve((T = Be()) == null ? void 0 : T.toggleWatch(o)), ce.info(v ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (A) {
      Z(!v), $(A, "Takip durumu güncellenemedi.");
    }
  }, os = async () => {
    var v, T;
    H.markChanged();
    try {
      const A = await Promise.resolve((v = Be()) == null ? void 0 : v.transfer(o, {
        mode: 2,
        // Copy
        targetProjectIds: n != null && n.projectId ? [n.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await x.invalidateQueries({ queryKey: ["task-detail"] }), ce.ok("Görev çoğaltıldı.");
      const oe = (T = A == null ? void 0 : A.createdTaskIds) == null ? void 0 : T[0];
      oe && se(oe);
    } catch (A) {
      $(A, "Görev çoğaltılamadı.");
    }
  }, cs = async () => {
    var v;
    H.markChanged();
    try {
      await Promise.resolve((v = Be()) == null ? void 0 : v.updateStatus(o, 4)), await x.invalidateQueries({ queryKey: ["task-detail", o] }), c.setField("status", 4), ce.info("Görev arşivlendi (Tamamlandı).");
    } catch (T) {
      $(T, "Görev arşivlenemedi.");
    }
  }, ds = async () => {
    var v;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?")) {
      H.markChanged();
      try {
        await Promise.resolve((v = Be()) == null ? void 0 : v.delete(o)), ce.info("Görev silindi."), m.markClean(), I();
      } catch (T) {
        $(T, "Görev silinemedi.");
      }
    }
  }, xs = async (v) => {
    try {
      await h.addFeature(v), C(v), ce.ok("Özellik başarıyla eklendi.");
    } catch (T) {
      $(T, "Özellik eklenemedi.");
    }
  }, Rt = async (v) => {
    try {
      await h.removeFeature(v), C("general"), ce.info("Özellik görevden kaldırıldı.");
    } catch (T) {
      $(T, "Özellik kaldırılamadı.");
    }
  }, us = async (v) => {
    var oe, ge, ye, Fe, $e, et, Re;
    const T = ((Fe = (ye = (ge = (oe = window == null ? void 0 : window.apya) == null ? void 0 : oe.platform) == null ? void 0 : ge.application) == null ? void 0 : ye.projects) == null ? void 0 : Fe.project) ?? ((Re = (et = ($e = window == null ? void 0 : window.apya) == null ? void 0 : $e.platform) == null ? void 0 : et.projects) == null ? void 0 : Re.project);
    if (!(T != null && T.create)) throw new Error("Proje servisi yüklenmedi.");
    const A = await Promise.resolve(T.create({
      name: v,
      code: Ln(v),
      currency: "TRY"
    }));
    return await x.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), ce.ok(`“${v}” projesi oluşturuldu.`), (A == null ? void 0 : A.id) ?? A;
  }, ps = async ({ mode: v, targetProjectIds: T, include: A }) => {
    var oe, ge;
    H.markChanged();
    try {
      const ye = await Promise.resolve((oe = Be()) == null ? void 0 : oe.transfer(o, {
        mode: v === "move" ? 1 : 2,
        targetProjectIds: T,
        include: A
      }));
      await x.invalidateQueries({ queryKey: ["task-detail", o] }), v === "move" && c.setField("projectId", T[0]);
      const Fe = T.map((et) => {
        var Re;
        return (Re = y.options.find((hs) => hs.value === et)) == null ? void 0 : Re.label;
      }).filter(Boolean), $e = ((ge = ye == null ? void 0 : ye.createdTaskIds) == null ? void 0 : ge.length) ?? 0;
      ce.ok(v === "move" ? $e ? `“${Fe[0]}” projesine taşındı, ${$e} projeye kopyalandı.` : `Görev “${Fe[0]}” projesine taşındı.` : $e > 1 ? `${$e} projeye kopyalandı.` : `Kopya “${Fe[0]}” projesinde oluşturuldu.`), F(null);
    } catch (ye) {
      $(ye, "Transfer tamamlanamadı.");
    }
  }, { canEdit: Xe, canChangeStatus: ms, canDelete: fs } = Oe(n), bs = N === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)] gap-5 items-start", children: [
    /* @__PURE__ */ e.jsx(
      bn,
      {
        task: n,
        onFieldChange: c.setField,
        descriptionValue: c.values.description,
        checklist: g,
        readOnly: !Xe,
        currentUserName: ((_t = (Yt = window == null ? void 0 : window.abp) == null ? void 0 : Yt.currentUser) == null ? void 0 : _t.name) || ((Vt = (Ut = window == null ? void 0 : window.abp) == null ? void 0 : Ut.currentUser) == null ? void 0 : Vt.userName) || "Ben"
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5", children: /* @__PURE__ */ e.jsx(fn, { task: n, nameById: u.nameById }) })
  ] }) : jn(N) ? /* @__PURE__ */ e.jsx(
    ya,
    {
      code: N,
      onRemoveFeature: Rt,
      pickerEntries: pe,
      onPickFeature: w,
      canRemove: !(J != null && J.isCore)
    }
  ) : /* @__PURE__ */ e.jsx(f.Suspense, { fallback: /* @__PURE__ */ e.jsx(we, { className: "h-48 w-full" }), children: J != null && J.component ? /* @__PURE__ */ e.jsx(
    J.component,
    {
      taskId: o,
      task: n,
      form: c,
      nameById: u.nameById,
      onOpenSubtask: Q,
      readOnly: !Xe
    }
  ) : /* @__PURE__ */ e.jsx(
    ya,
    {
      code: N,
      onRemoveFeature: Rt,
      pickerEntries: pe,
      onPickFeature: w,
      canRemove: !(J != null && J.isCore)
    }
  ) }), Ke = p && ((d == null ? void 0 : d.status) === 404 || (d == null ? void 0 : d.status) === 403) ? d.status : null, Gt = i ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(we, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(we, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(we, { className: "h-64 w-full" })
  ] }) : Ke ? /* @__PURE__ */ e.jsx(
    gs,
    {
      variant: Ke === 404 ? "error" : "locked",
      icon: Ke === 404 ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-magnifying-glass" }) : void 0,
      title: Ke === 404 ? de("Tasks:Detail:NotFound:Title", "Bu görev bulunamadı") : de("Tasks:Detail:Forbidden:Title", "Bu görevi görüntüleyemezsiniz"),
      description: Ke === 404 ? de("Tasks:Detail:NotFound:Body", "Görev silinmiş ya da bağlantı eskimiş olabilir.") : ys(d),
      action: a === "page" ? /* @__PURE__ */ e.jsx(re, { asChild: !0, size: "sm", children: /* @__PURE__ */ e.jsxs("a", { href: "/Tasks", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-left", "aria-hidden": "true" }),
        de("Tasks:Detail:BackToList", "Görevlere dön")
      ] }) }) : /* @__PURE__ */ e.jsx(re, { variant: "secondary", size: "sm", onClick: S, children: de("Common:Close", "Kapat") })
    }
  ) : p && !n ? (
    /* Yalnız İLK yükleme hatası. Görev ekrandayken düşen tazeleme (odak dönüşü, kayıt sonrası
       yeniden çekme; oturum düşünce 401) formu sökmez: yazılanlar görünür kalır, sonraki
       başarılı tazeleme forma işlenir (useTaskForm rebase). */
    /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
      /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
      /* @__PURE__ */ e.jsx(vs, { onRetry: b })
    ] })
  ) : /* @__PURE__ */ e.jsxs("div", { ref: ee, className: "flex flex-col flex-1 min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      dn,
      {
        task: n,
        presentation: a,
        onClose: S,
        isFullscreen: D,
        onToggleFullscreen: k,
        onFieldChange: c.setField,
        statusValue: c.values.status,
        titleValue: n == null ? void 0 : n.title,
        titleError: c.errors.title,
        isPrivateValue: c.values.isPrivate,
        isFavorite: U,
        onToggleFavorite: ns,
        isWatched: W,
        onToggleWatch: ls,
        onDuplicate: os,
        onArchive: cs,
        onDelete: ds,
        onOpenTransfer: (v) => F({ mode: v }),
        onSaveAsTemplate: () => ce.info("Şablon olarak kaydetme yakında."),
        onConvertToSubtask: () => ce.info("Alt göreve dönüştürme yakında."),
        onExportPdf: is,
        canEdit: Xe,
        canChangeStatus: ms,
        canDelete: fs
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        xn,
        {
          task: n,
          assigneeOptions: u.options,
          projectOptions: y.options,
          onFieldChange: c.setField,
          statusValue: c.values.status,
          priorityValue: c.values.priority,
          assigneeValue: c.values.assigneeId,
          projectValue: c.values.projectId,
          dueDateValue: c.values.dueDate,
          startDateValue: c.values.startDate,
          startDateError: c.errors.startDate,
          dueDateError: c.errors.dueDate,
          tagsValue: c.values.tagNames,
          progressPercent: Y,
          progressNote: `${M}/${xe.length} madde`,
          onOpenTransfer: (v) => F({ mode: v }),
          readOnly: !Xe
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        a === "page" && /* @__PURE__ */ e.jsx(
          mn,
          {
            activeTab: N,
            onTabChange: C,
            orderedTabs: X.orderedTabs,
            draggingCode: X.draggingCode,
            onDragStart: X.handleDragStart,
            onDragEnd: X.handleDragEnd,
            onReorderTo: X.reorderTo,
            onReorderDrop: () => ce.info("Sekme sırası güncellendi."),
            pickerEntries: pe,
            onPickFeature: w,
            counts: V
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: a === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            pn,
            {
              activeTab: N,
              onTabChange: C,
              orderedTabs: X.orderedTabs,
              draggingCode: X.draggingCode,
              onDragStart: X.handleDragStart,
              onDragEnd: X.handleDragEnd,
              onReorderTo: X.reorderTo,
              onReorderDrop: () => ce.info("Sekme sırası güncellendi."),
              pickerEntries: pe,
              onPickFeature: w,
              counts: V,
              isDirty: c.isDirty
            }
          ) }),
          /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised", children: bs })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(
      hn,
      {
        lastSavedAt: n == null ? void 0 : n.lastModificationTime,
        isDirty: c.isDirty,
        isSaving: z,
        justSaved: _,
        onCancel: S,
        onSave: Ze
      }
    )
  ] }), qt = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      Cn,
      {
        open: !!G,
        mode: (G == null ? void 0 : G.mode) ?? "move",
        onClose: () => F(null),
        onConfirm: ps,
        projectOptions: y.options,
        currentProjectId: c.values.projectId,
        counts: V,
        onCreateProject: us
      }
    ),
    R && /* @__PURE__ */ e.jsx(
      En,
      {
        subtaskId: R,
        parentCode: n == null ? void 0 : n.code,
        onClose: () => Q(null),
        onOpenFull: (v) => {
          Q(null), se(v);
        },
        onDeleted: () => x.invalidateQueries({ queryKey: ["task-detail", o] }),
        currentUserName: ((Qt = (Ot = window == null ? void 0 : window.abp) == null ? void 0 : Ot.currentUser) == null ? void 0 : Qt.name) || ((Jt = (Ht = window == null ? void 0 : window.abp) == null ? void 0 : Ht.currentUser) == null ? void 0 : Jt.userName) || "Ben"
      }
    ),
    /* @__PURE__ */ e.jsx(
      Et,
      {
        open: m.pendingClose,
        isSaving: z,
        errorText: O ? de("Common:Unsaved:SaveFailed", "Kaydedilemedi. Düzenlemeye dönebilir ya da değişiklikleri atabilirsiniz.") : void 0,
        onStay: as,
        onDiscard: ss,
        onSave: rs
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col w-full min-h-[calc(100vh-54px)] border-y border-subtle bg-surface-base", children: Gt }),
    qt
  ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx($t, { open: !0, onOpenChange: (v) => {
      v || S();
    }, children: /* @__PURE__ */ e.jsx(
      Pt,
      {
        title: n != null && n.title ? `Görev Detayı: ${n.title}` : "Görev Detayı",
        fullscreen: D,
        className: D ? "p-0 rounded-xl border border-default shadow-xl short:h-[100svh]" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl short:h-[100svh]",
        onInteractOutside: (v) => {
          var T, A;
          v.preventDefault(), !(G || R || m.pendingClose) && ((A = (T = v.target) == null ? void 0 : T.closest) != null && A.call(T, "[data-apya-overlay]") || S());
        },
        onEscapeKeyDown: (v) => {
          if (G || R) {
            v.preventDefault();
            return;
          }
          v.preventDefault(), S();
        },
        children: Gt
      }
    ) }),
    qt
  ] });
}
function Mn() {
  const t = f.useSyncExternalStore(
    H.subscribe,
    H.getSnapshot,
    () => null
  );
  return t ? /* @__PURE__ */ e.jsx(js, { name: "task-detail", fallback: (a) => /* @__PURE__ */ e.jsx(Kn, { ...a }), children: /* @__PURE__ */ e.jsx(Rn, { taskId: t }) }) : null;
}
function Kn(t) {
  const a = () => {
    var s;
    zt(), H.close(), (s = window.apya) != null && s.taskDetailV3Enabled ? H.emitResultIfChanged() : H.emitResult();
  };
  return /* @__PURE__ */ e.jsx($t, { open: !0, onOpenChange: (s) => {
    s || a();
  }, children: /* @__PURE__ */ e.jsx(
    Pt,
    {
      title: de("Common:SectionError:Title", "Bu bölüm gösterilemedi"),
      className: "w-full max-w-[480px] h-auto tablet:min-h-0 justify-center p-6",
      children: /* @__PURE__ */ e.jsx(Ns, { ...t, onClose: a })
    }
  ) });
}
function Rn({ taskId: t }) {
  var a;
  return (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(lt, { children: /* @__PURE__ */ e.jsx(
    Xa,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        H.close(), H.emitResultIfChanged();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(lt, { children: /* @__PURE__ */ e.jsx(
    Ja,
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
function es() {
  var s;
  try {
    const r = new URLSearchParams(window.location.search).get("taskui");
    if (r === "v1" || r === "v2" || r === "v3") return r;
  } catch {
  }
  const t = document.getElementById("task-detail-island"), a = (s = t == null ? void 0 : t.dataset) == null ? void 0 : s.taskui;
  return a === "v1" || a === "v2" ? a : "v3";
}
function Gn() {
  return es() === "v2";
}
function qn() {
  return es() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = qn();
window.apya.taskDetailV2Enabled = Gn() && !window.apya.taskDetailV3Enabled;
const Ca = {
  open: (t) => {
    H.open(t);
  },
  close: () => H.close(),
  onResult: (t) => H.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(Ca) : window.apya.taskDetail = Ca;
function Da() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = Ta(t, "task-detail", /* @__PURE__ */ e.jsx(Mn, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = Aa();
    a && H.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Da) : Da();
function Yn({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(lt, { children: /* @__PURE__ */ e.jsx(
    Xa,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(lt, { children: /* @__PURE__ */ e.jsx(
    Ja,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) });
}
const wt = document.getElementById("task-detail-page-island");
if (wt) {
  const t = wt.getAttribute("data-task-id");
  t && Ta(wt, "task-detail-page", /* @__PURE__ */ e.jsx(Yn, { taskId: t }));
}
