import { j as e, r as y, d as Ge, b as pa } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { a as et } from "./QueryProvider-B4436sFh.js";
import { u as te, a as se, b as ae } from "./query-vendor-Bf69L2iP.js";
import { D as ma, h as fa, e as ht, B as ee, I as qe, M as Qa, S as je } from "./Dialog-Bky2XNdc.js";
import { C as ba } from "./Combobox-D5mSMyzC.js";
import { i as Ue, a as Oe, s as be, p as nt, d as ha, b as tt, R as ya, c as $e, S as ga, e as Ja, P as Wa } from "./RichTextEditorV3-D3Amhpsv.js";
import { r as Za } from "./httpClient-DePjXdo1.js";
import { R as Ne, T as we, P as ke, C as Ce, A as Xa, a as Nt, D as es, b as ts, c as as, d as ss, e as rs } from "./ui-vendor-DaE-uom6.js";
import { d as va } from "./draggableActivation-Ybw9Upbh.js";
function ns({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: n,
  footer: i,
  children: o
}) {
  return /* @__PURE__ */ e.jsx(
    ma,
    {
      open: t,
      onOpenChange: (l) => {
        l || a();
      },
      children: /* @__PURE__ */ e.jsx(
        fa,
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
            n,
            /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: o }),
            i
          ] })
        }
      )
    }
  );
}
function is({ title: t, header: a, footer: s, children: r }) {
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
function ls({ isPrivate: t }) {
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
const yt = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, gt = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function os({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: n,
  fullscreen: i = !1
}) {
  const [o, l] = y.useState(!1), x = y.useRef(null);
  y.useEffect(() => {
    if (!o) return;
    const m = (u) => {
      x.current && !x.current.contains(u.target) && l(!1);
    }, c = (u) => {
      u.key === "Escape" && l(!1);
    };
    return document.addEventListener("mousedown", m), document.addEventListener("keydown", c), () => {
      document.removeEventListener("mousedown", m), document.removeEventListener("keydown", c);
    };
  }, [o]);
  const d = yt[t == null ? void 0 : t.status] ?? yt[1], b = gt[t == null ? void 0 : t.priority] ?? gt[2], f = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), l(!1);
  }, p = () => {
    var c, u, h, g;
    const m = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (c = navigator.clipboard) == null || c.writeText(m), (g = (h = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : h.info) == null || g.call(h, "Bağlantı kopyalandı."), l(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(ht, { variant: d.variant, children: d.text }),
        /* @__PURE__ */ e.jsx(ht, { variant: b.variant, children: b.text }),
        /* @__PURE__ */ e.jsx(ls, { isPrivate: t == null ? void 0 : t.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": i ? "Küçült" : "Tam ekrana büyüt",
          onClick: n,
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
            onClick: () => l((m) => !m),
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
                  onClick: f,
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
const cs = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function ds({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: n }) {
  const i = cs(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: i ? `Son kayıt: ${i}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(ee, { variant: "secondary", onClick: r, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        ee,
        {
          variant: "primary",
          onClick: () => n == null ? void 0 : n(),
          disabled: !a || !n,
          isLoading: s,
          loadingText: "Kaydediliyor…",
          children: "Kaydet"
        }
      )
    ] })
  ] }) });
}
const Mt = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", xs = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function ye({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function us({ value: t, onChange: a }) {
  const [s, r] = y.useState(""), n = () => {
    const i = s.trim();
    i && !t.includes(i) && a([...t, i]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((i) => /* @__PURE__ */ e.jsxs(ht, { variant: "neutral", children: [
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
      qe,
      {
        value: s,
        onChange: (i) => r(i.target.value),
        onKeyDown: (i) => {
          i.key === "Enter" || i.key === "," ? (i.preventDefault(), n()) : i.key === "Backspace" && !s && t.length && a(t.slice(0, -1));
        },
        onBlur: n,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function ps({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: n = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(ye, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      qe,
      {
        id: "task-title",
        value: t.title,
        onChange: (i) => s("title", i.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(ye, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (i) => s("status", Number(i.target.value)),
          className: Mt,
          children: Object.entries(yt).map(([i, o]) => /* @__PURE__ */ e.jsx("option", { value: i, children: o.text }, i))
        }
      ) }),
      /* @__PURE__ */ e.jsx(ye, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (i) => s("priority", Number(i.target.value)),
          className: Mt,
          children: Object.entries(gt).map(([i, o]) => /* @__PURE__ */ e.jsx("option", { value: i, children: o.text }, i))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(ye, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      ba,
      {
        id: "task-assignee",
        options: r,
        value: t.assigneeId,
        onChange: (i) => s("assigneeId", i),
        placeholder: n ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: n
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(ye, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        qe,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (i) => s("startDate", i.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(ye, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        qe,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (i) => s("dueDate", i.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(ye, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(us, { value: t.tagNames, onChange: (i) => s("tagNames", i) }) }),
    /* @__PURE__ */ e.jsx(ye, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (i) => s("description", i.target.value),
        className: xs
      }
    ) })
  ] });
}
const Rt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function Ke({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function ms({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(Ke, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(Ke, { label: "Oluşturulma zamanı", value: Rt(t.creationTime) }),
      /* @__PURE__ */ e.jsx(Ke, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(Ke, { label: "Son güncelleme zamanı", value: Rt(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(Ke, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const fs = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", bs = "border-brand-500 text-text-primary";
function hs({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: n }) {
  const i = y.useRef(/* @__PURE__ */ new Map()), o = (x) => {
    var d;
    s(x.code), (d = i.current.get(x.code)) == null || d.focus();
  }, l = (x, d) => {
    x.key === "ArrowRight" ? (x.preventDefault(), o(t[(d + 1) % t.length])) : x.key === "ArrowLeft" ? (x.preventDefault(), o(t[(d - 1 + t.length) % t.length])) : x.key === "Home" ? (x.preventDefault(), o(t[0])) : x.key === "End" && (x.preventDefault(), o(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((x, d) => {
      const b = x.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (f) => {
            f ? i.current.set(x.code, f) : i.current.delete(x.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${x.code}`,
          "aria-selected": b,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: b ? 0 : -1,
          onClick: () => s(x.code),
          onKeyDown: (f) => l(f, d),
          className: `${fs} ${b ? bs : ""}`,
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
        "aria-expanded": n,
        onClick: r,
        className: "mx-1 grid h-8 w-8 flex-none place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" })
      }
    )
  ] });
}
const ys = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function gs({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [n, i] = y.useState(""), o = y.useMemo(() => {
    const l = n.trim().toLocaleLowerCase("tr-TR"), x = l ? t.filter((b) => b.title.toLocaleLowerCase("tr-TR").includes(l)) : t, d = /* @__PURE__ */ new Map();
    return x.forEach((b) => {
      const f = d.get(b.category) ?? [];
      f.push(b), d.set(b.category, f);
    }), d;
  }, [t, n]);
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
            value: n,
            onChange: (l) => i(l.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          o.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...o.entries()].map(([l, x]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: ys[l] ?? l }),
            x.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
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
          ] }, l))
        ] })
      ]
    }
  );
}
function vs({ trail: t = [], current: a, onNavigate: s }) {
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
function js(t) {
  var s, r, n;
  const a = (n = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : n.task;
  return a ? Promise.resolve(a.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function wt(t) {
  return te({
    queryKey: ["task-detail", t],
    queryFn: () => js(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function de(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
function ja() {
  const [t, a] = y.useState(!1), [s, r] = y.useState(!1), n = y.useRef(null), i = y.useCallback(() => a(!0), []), o = y.useCallback(() => a(!1), []);
  y.useEffect(() => {
    if (!t) return;
    const d = (b) => {
      b.preventDefault(), b.returnValue = "";
    };
    return window.addEventListener("beforeunload", d), () => window.removeEventListener("beforeunload", d);
  }, [t]);
  const l = y.useCallback((d) => {
    if (!t) {
      d == null || d();
      return;
    }
    n.current = d ?? null, r(!0);
  }, [t]), x = y.useCallback((d) => {
    const b = n.current;
    return r(!1), n.current = null, d === "discard" && (a(!1), b == null || b()), d === "save" ? b : null;
  }, []);
  return { isDirty: t, markDirty: i, markClean: o, requestClose: l, pendingClose: s, resolvePendingClose: x };
}
const Ns = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, kt = "task";
function Na() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(kt);
  return t && Ns.test(t) ? t : null;
}
function wa() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(kt), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function ka(t, a) {
  const s = y.useRef(a);
  s.current = a, y.useEffect(() => {
    if (!t || Na() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(kt, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), y.useEffect(() => {
    const r = () => {
      var n;
      (n = s.current) == null || n.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const ws = {
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
function ks(t) {
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
  } : ws;
}
function Ca(t) {
  const [a, s] = y.useState(t == null ? void 0 : t.id), r = y.useMemo(() => ks(t), [t]), [n, i] = y.useState(r), [o, l] = y.useState({});
  (t == null ? void 0 : t.id) !== a && (s(t == null ? void 0 : t.id), i(r), l({}));
  const x = y.useCallback((m, c) => {
    i((u) => ({ ...u, [m]: c }));
  }, []), d = y.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(r),
    [n, r]
  ), b = y.useCallback(() => {
    const m = {};
    return n.title.trim() || (m.title = "Başlık zorunlu."), n.startDate || (m.startDate = "Başlangıç tarihi zorunlu."), n.dueDate && n.startDate && n.dueDate < n.startDate && (m.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), l(m), Object.keys(m).length === 0;
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
  }), [n, t]), p = y.useCallback(() => {
    i(r), l({});
  }, [r]);
  return { values: n, setField: x, isDirty: d, errors: o, validate: b, toUpdateDto: f, reset: p };
}
function Gt(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function Cs() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Da() {
  var n;
  const t = te({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Cs,
    staleTime: 3e5,
    retry: !1
  }), a = ((n = t.data) == null ? void 0 : n.items) ?? [], s = a.map((i) => ({ value: i.id, label: Gt(i) })), r = new Map(a.map((i) => [i.id, Gt(i)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function vt() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function Ds(t) {
  const a = vt();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ta(t) {
  const a = se(), s = ["task-features", t], r = te({
    queryKey: s,
    queryFn: () => Ds(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = ae({
    mutationFn: (l) => Promise.resolve(vt().addFeature(t, l)),
    onSuccess: n
  }), o = ae({
    mutationFn: (l) => Promise.resolve(vt().removeFeature(t, l)),
    onSuccess: n
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
const Sa = "rounded-2xl border border-subtle bg-surface-base shadow-xs", De = `${Sa} overflow-hidden`;
function _e({ title: t, badge: a, action: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3.5 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: t }),
      a
    ] }),
    s
  ] });
}
function $a({ children: t, tone: a = "positive" }) {
  const s = a === "positive" ? "bg-success-subtle text-success" : "bg-neutral-subtle text-text-secondary";
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-full font-mono text-[11px] font-bold ${s}`, children: t });
}
function Pe({ children: t, bg: a, fg: s }) {
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-[7px] text-[10.5px] font-bold ${a} ${s}`, children: t });
}
function ue({ icon: t, title: a, description: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 px-6 py-10 text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-xl text-text-tertiary` }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: a }),
    s && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] leading-[1.55] text-text-tertiary max-w-[420px]", children: s })
  ] });
}
function it({ name: t, size: a = 24 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Oe(t), fontSize: a * 0.4 },
      title: t || void 0,
      children: Ue(t)
    }
  );
}
const Ie = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—", at = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function Pa(t) {
  return t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : "0 KB";
}
function lt(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = Math.floor(a / 3600), r = Math.floor(a % 3600 / 60);
  return !s && !r ? `${a}sn` : s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function Ts(t) {
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
}, qt = (t = "") => Ea(t) === ve.image;
function Ea(t = "") {
  var s;
  const a = ((s = t.split(".").pop()) == null ? void 0 : s.toLowerCase()) ?? "";
  return a === "pdf" ? ve.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(a) ? ve.image : ["doc", "docx", "odt", "rtf", "txt"].includes(a) ? ve.doc : ["xls", "xlsx", "csv", "ods"].includes(a) ? ve.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(a) ? ve.code : ["zip", "rar", "7z", "tar", "gz"].includes(a) ? ve.zip : ve.other;
}
function Ss({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, n] = y.useState(""), [i, o] = y.useState(!1), l = se(), x = (a == null ? void 0 : a.subTasks) ?? [], d = x.filter((m) => m.status === 4).length, b = () => l.invalidateQueries({ queryKey: ["task-detail", t] }), f = async () => {
    var c, u, h;
    const m = r.trim();
    if (m) {
      o(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: m,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), n(""), await b();
      } catch (g) {
        (h = (u = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : u.error) == null || h.call(u, (g == null ? void 0 : g.message) || "Alt görev eklenemedi.");
      } finally {
        o(!1);
      }
    }
  }, p = async (m, c) => {
    var u, h, g;
    m.stopPropagation();
    try {
      await Promise.resolve(window.apya.platform.tasks.task.updateStatus(c.id, c.status === 4 ? 1 : 4)), await b();
    } catch (j) {
      (g = (h = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : h.error) == null || g.call(h, (j == null ? void 0 : j.message) || "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        x.length > 0 && /* @__PURE__ */ e.jsxs($a, { children: [
          d,
          "/",
          x.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: f,
          disabled: i || !r.trim(),
          className: `flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${i || !r.trim() ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            "Alt görev ekle"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: De, children: [
      x.map((m) => {
        const c = be(m.status), u = m.status === 4;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => s == null ? void 0 : s(m.id, m.title),
            onKeyDown: (h) => {
              h.key === "Enter" && (s == null || s(m.id, m.title));
            },
            className: "flex items-center gap-3.5 px-4 py-3.5 border-t border-subtle first:border-t-0 hover:bg-surface-raised cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": `${m.title} tamamlandı işaretle`,
                  onClick: (h) => p(h, m),
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white cursor-pointer ${u ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: u && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: m.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${u ? "line-through text-text-tertiary" : "text-text-primary"}`, children: m.title }),
              /* @__PURE__ */ e.jsx(Pe, { bg: c.bg, fg: c.fg, children: c.label }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: Ie(m.dueDate) }),
              /* @__PURE__ */ e.jsx(it, { name: m.assigneeName }),
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-right shrink-0 text-[10px] text-text-tertiary" })
            ]
          },
          m.id
        );
      }),
      /* @__PURE__ */ e.jsx("div", { className: "px-4 py-3 border-t border-subtle first:border-t-0", children: /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: r,
          onChange: (m) => n(m.target.value),
          onKeyDown: (m) => {
            m.key === "Enter" && f();
          },
          disabled: i,
          placeholder: "Yeni alt görev başlığı",
          className: "w-full h-9 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      ) })
    ] }),
    x.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz alt görev yok." })
  ] });
}
function Aa() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function $s(t) {
  const a = Aa();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function Ps(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, n = Za();
  n && (r.RequestVerificationToken = n);
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
function Ct(t) {
  const a = se(), s = ["task-attachments", t], r = te({
    queryKey: s,
    queryFn: () => $s(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = ae({
    mutationFn: (l) => Ps(t, l),
    onSuccess: n
  }), o = ae({
    mutationFn: (l) => Promise.resolve(Aa().deleteAttachment(l)),
    onSuccess: n
  });
  return {
    attachments: r.data ?? [],
    isLoading: r.isLoading,
    upload: i.mutateAsync,
    remove: o.mutateAsync,
    isUploading: i.isPending
  };
}
function Es({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: n } = Ct(t), i = se(), o = y.useRef(null), [l, x] = y.useState(!1), d = de("Platform.Tasks.ShareExternally"), b = async (m, c) => {
    var u, h, g;
    try {
      await window.apya.platform.tasks.taskShare.setAttachmentGuestVisibility(m, c), i.invalidateQueries({ queryKey: ["task-attachments", t] });
    } catch (j) {
      (g = (h = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : h.error) == null || g.call(h, (j == null ? void 0 : j.message) || "Görünürlük değiştirilemedi.");
    }
  }, f = async (m) => {
    var c, u, h, g, j, C;
    if (m)
      try {
        await s(m), (h = (u = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : u.success) == null || h.call(u, "Dosya yüklendi.");
      } catch (S) {
        (C = (j = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : j.error) == null || C.call(j, (S == null ? void 0 : S.message) || "Dosya yüklenemedi.");
      } finally {
        o.current && (o.current.value = "");
      }
  }, p = async (m, c) => {
    var u, h, g;
    try {
      await r(m);
    } catch (j) {
      (g = (h = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : h.error) == null || g.call(h, (j == null ? void 0 : j.message) || `${c} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: o,
        type: "file",
        className: "hidden",
        onChange: (m) => {
          var c;
          return f((c = m.target.files) == null ? void 0 : c[0]);
        },
        disabled: n
      }
    ),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3", children: a.map((m) => {
      const c = Ea(m.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${c.bg} ${c.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: m.fileName, children: m.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: Pa(m.fileSize) })
              ] })
            ] }),
            d && !m.isGuestUpload && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 text-[11px] text-text-tertiary cursor-pointer", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: !!m.isVisibleToGuests,
                  onChange: (u) => b(m.id, u.target.checked)
                }
              ),
              "Dış paylaşımda görünsün"
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2.5 border-t border-subtle", children: [
              /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[11px] text-text-tertiary", children: [
                m.uploaderName,
                m.isGuestUpload ? " · dış" : ""
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-1 shrink-0", children: [
                /* @__PURE__ */ e.jsx(
                  "a",
                  {
                    href: m.downloadUrl,
                    target: "_blank",
                    rel: "noreferrer",
                    title: "İndir",
                    "aria-label": `${m.fileName} dosyasini indir`,
                    className: "flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-primary-subtle hover:text-primary",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-download text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Sil",
                    "aria-label": `${m.fileName} dosyasini sil`,
                    onClick: () => p(m.id, m.fileName),
                    className: "flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                )
              ] })
            ] })
          ]
        },
        m.id
      );
    }) }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "button",
        tabIndex: 0,
        onClick: () => {
          var m;
          return (m = o.current) == null ? void 0 : m.click();
        },
        onKeyDown: (m) => {
          var c;
          m.key === "Enter" && ((c = o.current) == null || c.click());
        },
        onDragOver: (m) => {
          m.preventDefault(), l || x(!0);
        },
        onDragLeave: () => x(!1),
        onDrop: (m) => {
          var c, u;
          m.preventDefault(), x(!1), f((u = (c = m.dataTransfer) == null ? void 0 : c.files) == null ? void 0 : u[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${l ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-[26px] ${l ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: n ? "Yükleniyor…" : l ? "Bırakın, yükleyelim" : "Dosyaları buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, PDF, DOCX · max 25MB" })
        ]
      }
    )
  ] });
}
function Ze() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function As(t) {
  const a = Ze();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Dt(t) {
  const a = se(), s = ["task-checklist", t], r = te({
    queryKey: s,
    queryFn: () => As(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = ae({
    mutationFn: (x) => Promise.resolve(Ze().addChecklistItem(t, x)),
    onSuccess: n
  }), o = ae({
    mutationFn: (x) => Promise.resolve(Ze().toggleChecklistItem(x)),
    onSuccess: n
  }), l = ae({
    mutationFn: (x) => Promise.resolve(Ze().deleteChecklistItem(x)),
    onSuccess: n
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: i.mutateAsync,
    toggleItem: o.mutateAsync,
    removeItem: l.mutateAsync
  };
}
function Bs({ taskId: t }) {
  const { items: a, isLoading: s, addItem: r, toggleItem: n, removeItem: i } = Dt(t), [o, l] = y.useState(""), x = a.filter((f) => f.isDone).length, d = a.length ? Math.round(x / a.length * 100) : 0, b = async () => {
    var p, m, c;
    const f = o.trim();
    if (!(!f || !t)) {
      l("");
      try {
        await r(f);
      } catch (u) {
        l(f), (c = (m = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : m.error) == null || c.call(m, (u == null ? void 0 : u.message) || "Madde eklenemedi.");
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
          a.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: [
        "%",
        d
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mt-3.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
      "div",
      {
        className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
        style: { width: `${d}%` }
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
      s && a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 py-2 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }),
      !s && a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 py-2 text-[12.5px] text-text-tertiary", children: "Henüz madde yok. Aşağıdan ilk maddeyi ekleyin." }),
      a.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": f.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
            onClick: () => n(f.id).catch((p) => {
              var m, c, u;
              return (u = (c = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : c.error) == null ? void 0 : u.call(c, (p == null ? void 0 : p.message) || "Durum güncellenemedi.");
            }),
            className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white cursor-pointer transition-colors duration-fast ${f.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
            children: f.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${f.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: f.text }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            title: "Sil",
            "aria-label": `${f.text} maddesini sil`,
            onClick: () => i(f.id).catch((p) => {
              var m, c, u;
              return (u = (c = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : c.error) == null ? void 0 : u.call(c, (p == null ? void 0 : p.message) || "Madde silinemedi.");
            }),
            className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
          }
        )
      ] }, f.id)),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: o,
          onChange: (f) => l(f.target.value),
          onKeyDown: (f) => {
            f.key === "Enter" && b();
          },
          placeholder: "Yeni madde yaz ve Enter'a bas…",
          "aria-label": "Yeni kontrol listesi maddesi",
          className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      )
    ] })
  ] });
}
function Fs({ taskId: t, task: a }) {
  const [s, r] = y.useState(""), [n, i] = y.useState(null), [o, l] = y.useState(""), [x, d] = y.useState(!1), b = se(), f = (a == null ? void 0 : a.comments) ?? [], p = async (c) => {
    var u, h, g, j, C, S;
    if (c == null || c.preventDefault(), !(!s.trim() || x)) {
      d(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), b.invalidateQueries({ queryKey: ["task-detail", t] }), (g = (h = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : h.success) == null || g.call(h, "Yorum eklendi.");
      } catch (T) {
        (S = (C = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : C.error) == null || S.call(C, (T == null ? void 0 : T.message) || "Yorum eklenemedi.");
      } finally {
        d(!1);
      }
    }
  }, m = async (c) => {
    var u, h, g, j, C, S;
    if (!(!o.trim() || x)) {
      d(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(c, o.trim())
        ), l(""), i(null), b.invalidateQueries({ queryKey: ["task-detail", t] }), (g = (h = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : h.success) == null || g.call(h, "Yanıt eklendi.");
      } catch (T) {
        (S = (C = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : C.error) == null || S.call(C, (T == null ? void 0 : T.message) || "Yanıt eklenemedi.");
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
          onChange: (c) => r(c.target.value),
          placeholder: "Bir yorum veya güncelleme yazın...",
          className: "w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ e.jsx(
        ee,
        {
          type: "submit",
          variant: "primary",
          disabled: !s.trim() || x,
          isLoading: x,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    f.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: f.map((c) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: c.creatorUserName || c.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: c.creationTime ? new Date(c.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: c.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        ee,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => i(n === c.id ? null : c.id),
          children: "Yanıtla"
        }
      ) }),
      n === c.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: o,
            onChange: (u) => l(u.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(ee, { variant: "ghost", size: "sm", onClick: () => i(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(ee, { variant: "primary", size: "sm", disabled: !o.trim() || x, onClick: () => m(c.id), children: "Gönder" })
        ] })
      ] }),
      c.replies && c.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: c.replies.map((u) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: u.creatorUserName || u.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: u.creationTime ? new Date(u.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: u.text })
      ] }, u.id)) })
    ] }, c.id)) })
  ] });
}
function ot() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.taskShare) ?? null;
}
function zs(t) {
  const a = se(), s = ["task-share-links", t], r = te({
    queryKey: s,
    queryFn: () => {
      const l = ot();
      return l ? Promise.resolve(l.getList(t)) : Promise.reject(new Error("Paylaşım servisi yüklenmedi."));
    },
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = ae({
    mutationFn: (l) => Promise.resolve(ot().create({ ...l, taskId: t })),
    onSuccess: n
  }), o = ae({
    mutationFn: (l) => Promise.resolve(ot().revoke(l)),
    onSuccess: n
  });
  return {
    links: r.data ?? [],
    /* isLoading DEĞİL isPending: kalıcı önbellek geri yüklenirken isLoading
       FALSE döner ama liste henüz yoktur; sekme o karede "henüz kimseyle
       paylaşılmadı" yazıyordu — paylaşımı olan görevde bile. */
    isPending: r.isPending,
    error: r.error,
    create: i.mutateAsync,
    revoke: o.mutateAsync,
    isCreating: i.isPending
  };
}
const Yt = {
  recipientName: "",
  recipientEmail: "",
  lifetimeDays: 14,
  allowComment: !0,
  allowUpload: !0,
  allowDownload: !0
};
function Is(t) {
  return t ? new Date(t).toLocaleDateString("tr-TR") : "—";
}
function Ls({ taskId: t }) {
  const { links: a, isPending: s, create: r, revoke: n, isCreating: i } = zs(t), [o, l] = y.useState(Yt), [x, d] = y.useState(null);
  if (!de("Platform.Tasks.ShareExternally"))
    return /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Görevi ekip dışıyla paylaşma yetkiniz yok." });
  const f = (h) => (g) => {
    const j = g.target.type === "checkbox" ? g.target.checked : g.target.value;
    l((C) => ({ ...C, [h]: j }));
  }, p = async (h) => {
    var g, j, C;
    if (h.preventDefault(), !!o.recipientName.trim())
      try {
        const S = await r({
          ...o,
          lifetimeDays: Number(o.lifetimeDays) || 14
        });
        d(S), l(Yt);
      } catch (S) {
        (C = (j = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : j.error) == null || C.call(j, (S == null ? void 0 : S.message) || "Paylaşım linki üretilemedi.");
      }
  }, m = (h) => `${window.location.origin}${h}`, c = (h) => {
    var g, j, C, S;
    (g = navigator.clipboard) == null || g.writeText(m(h)), (S = (C = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : C.info) == null || S.call(C, "Bağlantı kopyalandı.");
  }, u = async (h) => {
    var g, j, C;
    try {
      await n(h);
    } catch (S) {
      (C = (j = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : j.error) == null || C.call(j, (S == null ? void 0 : S.message) || "Bağlantı iptal edilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    x && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 rounded-[14px] border border-focus bg-primary-subtle p-3.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "text-[12.5px] font-bold text-text-primary", children: [
        "Bağlantı hazır — ",
        /* @__PURE__ */ e.jsx("span", { className: "font-normal", children: "şimdi kopyalayın, bir daha gösterilmeyecek." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("code", { className: "min-w-0 flex-1 truncate rounded-[8px] bg-surface-base px-2.5 py-2 font-mono text-[11.5px] text-text-secondary", children: m(x.url) }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => c(x.url),
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
            value: o.recipientName,
            onChange: f("recipientName"),
            placeholder: "Kime? (ad soyad)",
            className: "min-w-0 flex-[2_1_180px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "email",
            value: o.recipientEmail,
            onChange: f("recipientEmail"),
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
            value: o.lifetimeDays,
            onChange: f("lifetimeDays"),
            title: "Geçerlilik (gün)",
            className: "w-[92px] rounded-[8px] border border-default bg-surface-raised px-2.5 py-2 text-[12.5px] text-text-primary"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: o.allowComment, onChange: f("allowComment") }),
          "Yorum yazabilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: o.allowUpload, onChange: f("allowUpload") }),
          "Dosya yükleyebilsin"
        ] }),
        /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: o.allowDownload, onChange: f("allowDownload") }),
          "Dosya indirebilsin"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: "Bağlantı bu görevi ve alt görevlerini açar. Ekip içi yorumlar gösterilmez." }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "submit",
            disabled: i,
            className: "shrink-0 rounded-[8px] bg-primary px-3.5 py-2 text-[12px] font-bold text-white cursor-pointer disabled:opacity-60",
            children: i ? "Üretiliyor…" : "Bağlantı üret"
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
              h.isActive ? `${Is(h.expiresAt)} tarihine kadar geçerli` : h.revokedAt ? "İptal edildi" : "Süresi doldu",
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
              onClick: () => u(h.id),
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
function Ks({ task: t }) {
  var s;
  const a = [];
  return t != null && t.creationTime && a.push({
    id: "created",
    icon: "fa-plus",
    bg: "bg-success-subtle",
    fg: "text-success",
    actor: t.creatorUserName || t.creatorName || "Sistem / Kullanıcı",
    event: "görevi oluşturdu",
    time: at(t.creationTime)
  }), t != null && t.lastModificationTime && a.push({
    id: "modified",
    icon: "fa-pen",
    bg: "bg-warning-subtle",
    fg: "text-warning",
    actor: t.lastModifierUserName || t.lastModifierName || "Kullanıcı",
    event: "görevi güncelledi",
    time: at(t.lastModificationTime)
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
    a.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Aktivite kaydı bulunamadı." }) }) : /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: a.map((r, n) => {
      const i = n === a.length - 1;
      return /* @__PURE__ */ e.jsxs("div", { className: `flex items-start gap-3.5 ${i ? "" : "pb-[18px]"}`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center shrink-0 self-stretch", children: [
          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-7 w-7 rounded-full ${r.bg} ${r.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r.icon} text-[11px]` }) }),
          !i && /* @__PURE__ */ e.jsx("span", { className: "flex-1 w-0.5 mt-1.5 rounded-sm bg-subtle" })
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
function Ms({ label: t, value: a, hint: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4 px-3.5 py-3", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[12.5px] font-semibold text-text-secondary", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 text-right", children: [
      /* @__PURE__ */ e.jsx("span", { className: "block text-[12.5px] font-bold text-text-primary break-words", children: a ?? "—" }),
      s && /* @__PURE__ */ e.jsx("span", { className: "block text-[11px] text-text-tertiary", children: s })
    ] })
  ] });
}
function Rs({ task: t = {}, nameById: a }) {
  const s = (n) => {
    var i;
    return n && ((i = a == null ? void 0 : a.get) == null ? void 0 : i.call(a, n)) || null;
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
      /* @__PURE__ */ e.jsx("div", { className: "divide-y divide-subtle", children: r.map((n) => /* @__PURE__ */ e.jsx(Ms, { ...n }, n.label)) })
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11.5px] text-text-tertiary", children: "Alan bazında değişiklik günlüğü (hangi alan, eski/yeni değer) henüz yayınlanmadı." })
  ] });
}
function Gs(t) {
  var s, r, n;
  const a = (n = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.projectBudgets) == null ? void 0 : n.projectBudget;
  return a != null && a.getRecordFormLookup ? Promise.resolve(a.getRecordFormLookup(t)) : Promise.reject(new Error("Bütçe servisi yüklenmedi."));
}
function qs(t) {
  var n;
  const a = de("Platform.Projects.ViewBudget"), s = te({
    queryKey: ["task-detail", "budget-lines", t],
    queryFn: () => Gs(t),
    enabled: !!t && a,
    staleTime: 6e4,
    retry: !1
  }), r = ((n = s.data) == null ? void 0 : n.lines) ?? [];
  return {
    lines: r,
    options: r.map((i) => ({ value: i.id, label: i.code ? `${i.code} · ${i.name}` : i.name })),
    canViewBudget: a,
    isLoading: s.isLoading
  };
}
function st(t) {
  var s, r;
  const a = (r = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.ajax) == null ? void 0 : r.call(s, t);
  return a ? new Promise((n, i) => {
    a.done(n).fail(i);
  }) : Promise.reject(new Error("ABP köprüsü yüklenmedi."));
}
function rt(t, a = {}) {
  var n;
  const s = ((n = window == null ? void 0 : window.abp) == null ? void 0 : n.appPath) ?? "/", r = new URLSearchParams({ handler: t });
  return Object.entries(a).forEach(([i, o]) => {
    o != null && o !== "" && r.append(i, o);
  }), `${s}Documents/Matching?${r.toString()}`;
}
const Ba = () => de("Platform.Documents.Default"), Ys = () => de("Platform.Documents.ManageMeta");
function _s(t) {
  const a = !!t && Ba(), s = te({
    queryKey: ["task-detail", "expense-matches", t],
    queryFn: () => st({ url: rt("Matches", { projectId: t }), type: "GET" }),
    enabled: a,
    staleTime: 6e4,
    retry: !1
  }), r = /* @__PURE__ */ new Map();
  return (s.data ?? []).forEach((n) => {
    r.has(n.expenseId) || r.set(n.expenseId, []), r.get(n.expenseId).push(n);
  }), { byExpense: r, enabled: a, isLoading: s.isLoading };
}
function Us(t, a) {
  const s = te({
    queryKey: ["task-detail", "expense-candidates", t],
    queryFn: () => st({ url: rt("Candidates", { expenseId: t }), type: "GET" }),
    enabled: !!t && a && Ba(),
    staleTime: 3e4,
    retry: !1
  });
  return { candidates: s.data ?? [], isLoading: s.isLoading };
}
function Os(t) {
  const a = se(), s = (i) => {
    a.invalidateQueries({ queryKey: ["task-detail", "expense-matches", t] }), a.invalidateQueries({ queryKey: ["task-detail", "expense-candidates", i] });
  }, r = ae({
    mutationFn: ({ documentFileId: i, expenseId: o, score: l }) => st({
      url: rt("CreateMatch"),
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ documentFileId: i, expenseId: o, score: l ?? 0 })
    }),
    onSuccess: (i, o) => s(o.expenseId)
  }), n = ae({
    mutationFn: ({ matchId: i }) => st({ url: rt("RemoveMatch", { matchId: i }), type: "POST" }),
    onSuccess: (i, o) => s(o.expenseId)
  });
  return { link: r, unlink: n, isBusy: r.isPending || n.isPending };
}
function Vs(t) {
  return t == null ? "—" : new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 2 }).format(t);
}
function Hs({ expenseId: t, projectId: a, matches: s }) {
  const { candidates: r, isLoading: n } = Us(t, !0), { link: i, unlink: o, isBusy: l } = Os(a), x = Ys(), d = new Set(s.map((p) => p.documentFileId)), b = r.filter((p) => !d.has(p.documentFileId)), f = (p, m) => {
    var c, u, h;
    return (h = (u = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : u.error) == null ? void 0 : h.call(u, (p == null ? void 0 : p.message) || m);
  };
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
        x && /* @__PURE__ */ e.jsx(
          ee,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            disabled: l,
            onClick: () => o.mutate(
              { matchId: p.id, expenseId: t },
              { onError: (m) => f(m, "Evrak bağı kaldırılamadı.") }
            ),
            children: "Kaldır"
          }
        )
      ] }, p.id))
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Aday evraklar" }),
      n && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Adaylar aranıyor…" }),
      !n && b.length === 0 && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Eşleşen aday yok. Evrak Belgeler modülünden yüklenip buradan bağlanır." }),
      b.map((p) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-lines text-[11px] text-text-tertiary" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12px] text-text-primary", children: p.displayName }),
        /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
          Vs(p.amount),
          " · ",
          Ie(p.documentDate)
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: `shrink-0 font-mono text-[11px] font-bold ${p.isStrong ? "text-success" : "text-text-tertiary"}`, children: [
          "%",
          p.score
        ] }),
        x && /* @__PURE__ */ e.jsx(
          ee,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            disabled: l,
            onClick: () => i.mutate(
              { documentFileId: p.documentFileId, expenseId: t, score: p.score },
              { onError: (m) => f(m, "Evrak bağlanamadı.") }
            ),
            children: "Bağla"
          }
        )
      ] }, p.documentFileId))
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
function ct(t, a, s) {
  var o, l, x, d, b;
  const r = (o = window == null ? void 0 : window.abp) == null ? void 0 : o.ModalManager;
  if (!r) {
    (d = (x = (l = window == null ? void 0 : window.abp) == null ? void 0 : l.notify) == null ? void 0 : x.error) == null || d.call(x, "Kayıt formu yüklenemedi.");
    return;
  }
  const n = ((b = window == null ? void 0 : window.abp) == null ? void 0 : b.appPath) ?? "/", i = new r({ viewUrl: `${n}${t}?TaskId=${a}` });
  i.onResult(() => s == null ? void 0 : s()), i.open();
}
function Qs({ taskId: t }) {
  const a = se(), s = de("Platform.Expenses.Create"), r = de("Platform.Incomes.Create"), n = de("Platform.Invoices.Create");
  if (!t || !s && !r && !n)
    return null;
  const i = () => a.invalidateQueries({ queryKey: ["task-detail", t] });
  return /* @__PURE__ */ e.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
    s && /* @__PURE__ */ e.jsxs(
      ee,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => ct("Expenses/CreateModal", t, i),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-up text-[11px]" }),
          "Gider ekle"
        ]
      }
    ),
    r && /* @__PURE__ */ e.jsxs(
      ee,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => ct("Incomes/CreateModal", t, i),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-arrow-down text-[11px]" }),
          "Gelir ekle"
        ]
      }
    ),
    n && /* @__PURE__ */ e.jsxs(
      ee,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => ct("Invoices/CreateModal", t, i),
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-file-invoice text-[11px]" }),
          "Fatura ekle"
        ]
      }
    )
  ] });
}
const _t = {
  0: { label: "Taslak", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  1: { label: "Gönderildi", bg: "bg-primary-subtle", fg: "text-primary" },
  2: { label: "Ödendi", bg: "bg-success-subtle", fg: "text-success" },
  3: { label: "İptal", bg: "bg-neutral-subtle", fg: "text-text-tertiary" },
  4: { label: "Gecikti", bg: "bg-negative-subtle", fg: "text-negative" }
};
function Js({ invoices: t, action: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: De, children: [
    /* @__PURE__ */ e.jsx(_e, { title: "Faturalar", action: a }),
    t.map((s) => {
      const r = _t[s.status] ?? _t[0];
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
              Ie(s.dueDate)
            ] }),
            /* @__PURE__ */ e.jsx(Pe, { bg: r.bg, fg: r.fg, children: r.label }),
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
function Ws({ line: t, projectId: a, matches: s, docsEnabled: r }) {
  const [n, i] = y.useState(!1), o = t.kind === "income";
  return /* @__PURE__ */ e.jsxs("div", { className: "border-t border-subtle first:border-t-0", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5 px-4 py-3 hover:bg-surface-raised", children: [
      /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-7 w-7 rounded-lg bg-neutral-subtle text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${o ? "fa-arrow-down" : "fa-arrow-up"} text-[11px]` }) }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] font-semibold text-text-primary", children: t.title || (o ? "Gelir" : "Gider") }),
      r && /* @__PURE__ */ e.jsxs(
        ee,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          "aria-expanded": n,
          onClick: () => i((l) => !l),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-[11px]" }),
            s.length > 0 ? `Evrak ${s.length}` : "Evrak"
          ]
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: Ie(t.date) }),
      o ? /* @__PURE__ */ e.jsx(Pe, { bg: "bg-success-subtle", fg: "text-success", children: "Gelir" }) : /* @__PURE__ */ e.jsx(Pe, { bg: "bg-warning-subtle", fg: "text-warning", children: "Gider" }),
      /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: `shrink-0 font-mono text-[12.5px] font-bold ${o ? "text-success" : "text-text-primary"}`,
          style: { fontVariantNumeric: "tabular-nums" },
          children: [
            o ? "+" : "−",
            fe(t.amount, t.currency)
          ]
        }
      )
    ] }),
    r && n && /* @__PURE__ */ e.jsx(Hs, { expenseId: t.id, projectId: a, matches: s })
  ] });
}
function dt({ label: t, value: a, tone: s, note: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: `font-mono text-[22px] font-bold tracking-[-.02em] ${s}`, style: { fontVariantNumeric: "tabular-nums" }, children: a }),
    r && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
  ] });
}
function Zs({ options: t, isLoading: a, lineId: s, planned: r, onField: n }) {
  return a ? null : t.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12px] text-text-tertiary", children: "Bu projede bütçe kalemi tanımlı değil — kalemler Finans & Bütçe ekranından açılır." }) : /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Bütçe kalemi" }),
      /* @__PURE__ */ e.jsx(
        ba,
        {
          options: t,
          value: s ?? void 0,
          onChange: (i) => n("budgetLineId", i ?? null),
          placeholder: "Kalem seç",
          size: "sm"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: "Görev bütçesi" }),
      /* @__PURE__ */ e.jsx(
        Qa,
        {
          value: r,
          onValueChange: (i) => n("plannedAmount", i),
          currency: "TRY",
          min: 0,
          size: "sm",
          disabled: !s
        }
      )
    ] })
  ] });
}
function Xs({ task: t, form: a, spentByCurrency: s }) {
  const r = (a ? a.values.projectId : t == null ? void 0 : t.projectId) ?? null, { options: n, lines: i, canViewBudget: o, isLoading: l } = qs(r), x = !!a && o && !!r, d = (a ? a.values.budgetLineId : t == null ? void 0 : t.budgetLineId) ?? null, b = (a ? a.values.plannedAmount : t == null ? void 0 : t.plannedAmount) ?? null;
  if (!x && (!d || b == null))
    return null;
  const f = i.find((C) => C.id === d), p = f ? f.remainingAmount : t == null ? void 0 : t.budgetLineRemaining, m = s, c = !!d && b != null, u = (b ?? 0) - m, h = b > 0 ? Math.round(m / b * 100) : 0, g = u < 0, j = () => {
    a.setField("budgetLineId", null), a.setField("plannedAmount", null);
  };
  return (
    /* Kırpmayan kart ŞART: kalem seçicisinin listesi kartın içine absolute
       konumlanır, TAB_CARD'ın overflow-hidden'ı onu alt kenarda keserdi. */
    /* @__PURE__ */ e.jsxs("div", { className: Sa, children: [
      /* @__PURE__ */ e.jsx(
        _e,
        {
          title: "Bütçe bağı",
          action: x && d ? /* @__PURE__ */ e.jsx(ee, { type: "button", variant: "ghost", size: "sm", onClick: j, children: "Bağı kaldır" }) : null
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "px-4 pb-4 pt-1 flex flex-col gap-3", children: [
        x ? /* @__PURE__ */ e.jsx(
          Zs,
          {
            options: n,
            isLoading: l,
            lineId: d,
            planned: b,
            onField: a.setField
          }
        ) : /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-semibold text-accent", children: t.budgetLineName || "Bütçe kalemi" }) }),
        p != null && /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "kalemde kalan ",
          fe(p, "TRY")
        ] }),
        c && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3", children: [
            /* @__PURE__ */ e.jsx(xt, { label: "Görev bütçesi", value: fe(b, "TRY") }),
            /* @__PURE__ */ e.jsx(xt, { label: "Gerçekleşen", value: fe(m, "TRY") }),
            /* @__PURE__ */ e.jsx(
              xt,
              {
                label: "Kalan",
                value: fe(u, "TRY"),
                tone: g ? "text-negative" : "text-success"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
              "div",
              {
                className: `h-full rounded-full ${g ? "bg-negative" : h >= 80 ? "bg-warning" : "bg-success"}`,
                style: { width: `${Math.min(Math.max(h, 0), 100)}%` }
              }
            ) }),
            /* @__PURE__ */ e.jsxs("div", { className: "mt-1 text-[11.5px] text-text-tertiary", children: [
              "%",
              h,
              g && /* @__PURE__ */ e.jsx("span", { className: "ml-1 text-negative", children: "· görev bütçesi aşıldı" })
            ] })
          ] })
        ] })
      ] })
    ] })
  );
}
function xt({ label: t, value: a, tone: s }) {
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
function er({ task: t, taskId: a, form: s }) {
  const r = (t == null ? void 0 : t.expenses) || [], n = (t == null ? void 0 : t.incomes) || [], i = (t == null ? void 0 : t.invoices) || [], o = (s ? s.values.projectId : t == null ? void 0 : t.projectId) ?? null, { byExpense: l, enabled: x } = _s(o), d = r.filter((u) => (u.currency || "TRY") === "TRY").reduce((u, h) => u + (h.amount || 0), 0), b = /* @__PURE__ */ e.jsx(Xs, { task: t, form: s, spentByCurrency: d }), f = /* @__PURE__ */ e.jsx(Qs, { taskId: a ?? (t == null ? void 0 : t.id) });
  if (r.length === 0 && n.length === 0 && i.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
      b,
      /* @__PURE__ */ e.jsxs("div", { className: De, children: [
        /* @__PURE__ */ e.jsx(_e, { title: "Görev Finansı", action: f }),
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
  const m = Array.from(new Set([...r, ...n].map((u) => u.currency || "TRY"))).map((u) => {
    const h = n.filter((j) => (j.currency || "TRY") === u).reduce((j, C) => j + (C.amount || 0), 0), g = r.filter((j) => (j.currency || "TRY") === u).reduce((j, C) => j + (C.amount || 0), 0);
    return { cur: u, inc: h, exp: g, net: h - g };
  }), c = [
    ...n.map((u) => ({ ...u, kind: "income" })),
    ...r.map((u) => ({ ...u, kind: "expense" }))
  ].sort((u, h) => new Date(h.date || 0) - new Date(u.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    b,
    m.map(({ cur: u, inc: h, exp: g, net: j }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(dt, { label: `Toplam Gelir (${u})`, value: fe(h, u), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(dt, { label: `Toplam Gider (${u})`, value: fe(g, u), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        dt,
        {
          label: `Net Bakiye (${u})`,
          value: fe(j, u),
          tone: j >= 0 ? "text-success" : "text-negative",
          note: j >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, u)),
    i.length > 0 && /* @__PURE__ */ e.jsx(Js, { invoices: i, action: c.length === 0 ? f : null }),
    c.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: De, children: [
      /* @__PURE__ */ e.jsx(_e, { title: "Finans kalemleri", action: f }),
      c.map((u) => /* @__PURE__ */ e.jsx(
        Ws,
        {
          line: u,
          projectId: o,
          matches: u.kind === "expense" ? l.get(u.id) ?? [] : [],
          docsEnabled: x && u.kind === "expense"
        },
        `${u.kind}-${u.id}`
      ))
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11px] text-text-tertiary", children: "Buradan eklenen kayıt göreve ve projesine etiketlenir; düzenleme/silme Finans modülünden yapılır. Evraklar Belgeler modülünde yaşar, buradan gidere bağlanır." })
  ] });
}
function tr({ taskId: t }) {
  const { attachments: a, isLoading: s, upload: r, remove: n, isUploading: i } = Ct(t), o = y.useRef(null), [l, x] = y.useState(!1), d = a.filter((p) => qt(p.fileName)), b = async (p) => {
    var m, c, u, h, g, j, C, S, T;
    if (p) {
      if (!qt(p.name)) {
        (u = (c = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : c.error) == null || u.call(c, "Galeriye yalnız görsel dosya yüklenebilir.");
        return;
      }
      try {
        await r(p), (j = (g = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : g.success) == null || j.call(g, "Görsel yüklendi.");
      } catch (E) {
        (T = (S = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : S.error) == null || T.call(S, (E == null ? void 0 : E.message) || "Görsel yüklenemedi.");
      } finally {
        o.current && (o.current.value = "");
      }
    }
  }, f = async (p, m) => {
    var c, u, h;
    try {
      await n(p);
    } catch (g) {
      (h = (u = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : u.error) == null || h.call(u, (g == null ? void 0 : g.message) || `${m} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: o,
        type: "file",
        accept: "image/*",
        className: "hidden",
        onChange: (p) => {
          var m;
          return b((m = p.target.files) == null ? void 0 : m[0]);
        },
        disabled: i
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
              /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: Pa(p.fileSize) })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                title: "Sil",
                "aria-label": `${p.fileName} gorselini sil`,
                onClick: () => f(p.id, p.fileName),
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
          return (p = o.current) == null ? void 0 : p.click();
        },
        onKeyDown: (p) => {
          var m;
          p.key === "Enter" && ((m = o.current) == null || m.click());
        },
        onDragOver: (p) => {
          p.preventDefault(), l || x(!0);
        },
        onDragLeave: () => x(!1),
        onDrop: (p) => {
          var m, c;
          p.preventDefault(), x(!1), b((c = (m = p.dataTransfer) == null ? void 0 : m.files) == null ? void 0 : c[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${l ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${i ? "fa-circle-notch fa-spin" : "fa-images"} text-[26px] ${l ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: i ? "Yükleniyor…" : l ? "Bırakın, yükleyelim" : "Görselleri buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, JPG, GIF, WEBP, SVG · max 25MB" })
        ]
      }
    )
  ] });
}
const ar = [
  { key: "title", label: "Başlık", align: "left" },
  { key: "status", label: "Durum", align: "left" },
  { key: "priority", label: "Öncelik", align: "left" },
  { key: "assignee", label: "Atanan", align: "left" },
  { key: "dueDate", label: "Termin", align: "right" }
];
function Ut(t, a) {
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
function sr(t, a, s, r) {
  const n = Ut(t, s), i = Ut(a, s), o = n === null || n === "", l = i === null || i === "";
  return o && l ? 0 : o ? 1 : l ? -1 : n === i ? 0 : (n < i ? -1 : 1) * (r === "asc" ? 1 : -1);
}
function rr({ task: t = {}, onOpenSubtask: a }) {
  const [s, r] = y.useState({ key: "dueDate", dir: "asc" }), n = (t == null ? void 0 : t.subTasks) ?? [], i = y.useMemo(
    () => [...n].sort((l, x) => sr(l, x, s.key, s.dir)),
    [n, s.key, s.dir]
  ), o = (l) => r((x) => x.key === l ? { key: l, dir: x.dir === "asc" ? "desc" : "asc" } : { key: l, dir: "asc" });
  return n.length === 0 ? /* @__PURE__ */ e.jsx(
    ue,
    {
      icon: "fa-table",
      title: "Alt görev yok",
      description: "Alt Görevler sekmesinden ekledikleriniz burada tablo olarak listelenir."
    }
  ) : /* @__PURE__ */ e.jsx("div", { className: `${De} overflow-x-auto`, children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse text-[12.5px]", children: [
    /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsx("tr", { className: "bg-surface-raised", children: ar.map((l) => {
      const x = s.key === l.key;
      return /* @__PURE__ */ e.jsx(
        "th",
        {
          scope: "col",
          "aria-sort": x ? s.dir === "asc" ? "ascending" : "descending" : "none",
          className: `px-3.5 py-2.5 border-b border-subtle font-bold text-text-secondary whitespace-nowrap ${l.align === "right" ? "text-right" : "text-left"}`,
          children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => o(l.key),
              className: `inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer font-bold ${x ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`,
              children: [
                l.label,
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid text-[9px] ${x ? s.dir === "asc" ? "fa-arrow-up-short-wide" : "fa-arrow-down-wide-short" : "fa-sort opacity-40"}` })
              ]
            }
          )
        },
        l.key
      );
    }) }) }),
    /* @__PURE__ */ e.jsx("tbody", { children: i.map((l) => {
      const x = be(l.status), d = nt(l.priority), b = ha(l.dueDate);
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
                  onClick: (f) => {
                    f.stopPropagation(), a == null || a(l.id);
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
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ e.jsx("span", { className: "flex", children: /* @__PURE__ */ e.jsxs(Pe, { bg: d.bg, fg: d.fg, children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.icon} text-[9px] mr-1` }),
              d.label
            ] }) }) }),
            /* @__PURE__ */ e.jsx("td", { className: "px-3.5 py-2.5", children: l.assigneeName ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ e.jsx(it, { name: l.assigneeName, size: 22 }),
              /* @__PURE__ */ e.jsx("span", { className: "truncate text-text-secondary", children: l.assigneeName })
            ] }) : /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary", children: "Atanmadı" }) }),
            /* @__PURE__ */ e.jsxs("td", { className: `px-3.5 py-2.5 text-right whitespace-nowrap ${b.tone}`, children: [
              l.dueDate ? Ie(l.dueDate) : "—",
              b.hint && /* @__PURE__ */ e.jsx("div", { className: "text-[11px]", children: b.hint })
            ] })
          ]
        },
        l.id
      );
    }) })
  ] }) });
}
function nr({ taskId: t, task: a = {}, onOpenSubtask: s }) {
  const r = se(), n = (a == null ? void 0 : a.subTasks) ?? [], [i, o] = y.useState(null), [l, x] = y.useState(null), d = async (b, f) => {
    var m, c, u;
    const p = n.find((h) => h.id === b);
    if (!(!p || p.status === f)) {
      x(b);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.updateStatus(b, f)), await r.invalidateQueries({ queryKey: ["task-detail", t] });
      } catch (h) {
        (u = (c = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : c.error) == null || u.call(c, (h == null ? void 0 : h.message) || "Alt görev durumu güncellenemedi.");
      } finally {
        x(null);
      }
    }
  };
  return n.length === 0 ? /* @__PURE__ */ e.jsx(
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 items-start", children: tt.map((b) => {
      const f = be(b), p = n.filter((c) => c.status === b), m = i === b;
      return /* @__PURE__ */ e.jsxs(
        "section",
        {
          "aria-label": `${f.label} sütunu`,
          onDragOver: (c) => {
            c.preventDefault(), i !== b && o(b);
          },
          onDragLeave: () => o((c) => c === b ? null : c),
          onDrop: (c) => {
            var h;
            c.preventDefault(), o(null);
            const u = (h = c.dataTransfer) == null ? void 0 : h.getData("text/plain");
            u && d(u, b);
          },
          className: `flex flex-col gap-2 p-2.5 rounded-2xl border bg-surface-raised min-h-[120px] transition-colors duration-fast ${m ? "border-focus bg-primary-subtle" : "border-subtle"}`,
          children: [
            /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-2 px-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${f.dot}` }),
              /* @__PURE__ */ e.jsx("h3", { className: "m-0 flex-1 text-[12px] font-bold text-text-primary", children: f.label }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: p.length })
            ] }),
            p.map((c) => {
              const u = nt(c.priority);
              return /* @__PURE__ */ e.jsxs(
                "article",
                {
                  draggable: !0,
                  onDragStart: (h) => {
                    var g;
                    return (g = h.dataTransfer) == null ? void 0 : g.setData("text/plain", c.id);
                  },
                  role: "button",
                  tabIndex: 0,
                  onClick: () => s == null ? void 0 : s(c.id),
                  onKeyDown: (h) => {
                    h.key === "Enter" && (s == null || s(c.id));
                  },
                  className: `flex flex-col gap-2 p-2.5 rounded-[12px] border border-subtle bg-surface-base shadow-xs cursor-pointer hover:border-focus hover:shadow-md ${l === c.id ? "opacity-60" : ""}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary line-clamp-2", children: c.title }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                      /* @__PURE__ */ e.jsxs("span", { className: `text-[10.5px] font-bold ${u.fg}`, children: [
                        /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-[9px] mr-1` }),
                        u.label
                      ] }),
                      c.dueDate && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: Ie(c.dueDate) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2 border-t border-subtle", children: [
                      c.assigneeName ? /* @__PURE__ */ e.jsx(it, { name: c.assigneeName, size: 20 }) : /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] text-text-tertiary", children: "Atanmadı" }),
                      /* @__PURE__ */ e.jsx(
                        "select",
                        {
                          "aria-label": `${c.title} durumunu değiştir`,
                          value: c.status,
                          onClick: (h) => h.stopPropagation(),
                          onChange: (h) => d(c.id, Number(h.target.value)),
                          className: "h-[24px] px-1.5 rounded-[6px] border border-subtle bg-surface-base text-[10.5px] text-text-secondary cursor-pointer",
                          children: tt.map((h) => /* @__PURE__ */ e.jsx("option", { value: h, children: be(h).label }, h))
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
        b
      );
    }) })
  );
}
const ir = [
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
], lr = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], Ot = (t) => String(t).padStart(2, "0"), Fa = (t, a, s) => `${t}-${Ot(a + 1)}-${Ot(s)}`;
function jt(t) {
  if (!t) return null;
  const a = /^(\d{4}-\d{2}-\d{2})/.exec(String(t));
  return a ? a[1] : null;
}
function or(t, a) {
  const r = (new Date(t, a, 1).getDay() + 6) % 7, n = new Date(t, a + 1, 0).getDate(), i = [];
  for (let o = 0; o < 42; o++) {
    const l = o - r + 1;
    i.push(l >= 1 && l <= n ? { key: Fa(t, a, l), day: l, inMonth: !0 } : { key: `bos-${o}`, day: null, inMonth: !1 });
  }
  return i;
}
function cr(t) {
  const a = /* @__PURE__ */ new Map(), s = (r, n) => {
    const i = jt(r);
    i && (a.has(i) || a.set(i, []), a.get(i).push(n));
  };
  s(t == null ? void 0 : t.startDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "start", isSelf: !0, status: t == null ? void 0 : t.status }), s(t == null ? void 0 : t.dueDate, { id: t == null ? void 0 : t.id, title: t == null ? void 0 : t.title, kind: "due", isSelf: !0, status: t == null ? void 0 : t.status });
  for (const r of (t == null ? void 0 : t.subTasks) ?? [])
    s(r.startDate, { id: r.id, title: r.title, kind: "start", isSelf: !1, status: r.status }), s(r.dueDate, { id: r.id, title: r.title, kind: "due", isSelf: !1, status: r.status });
  return a;
}
function dr({ task: t = {}, onOpenSubtask: a }) {
  const s = y.useMemo(() => cr(t), [t]), [r, n] = y.useState(() => {
    const d = jt(t == null ? void 0 : t.startDate) ?? jt(t == null ? void 0 : t.dueDate);
    if (d) {
      const [f, p] = d.split("-").map(Number);
      return { year: f, month: p - 1 };
    }
    const b = /* @__PURE__ */ new Date();
    return { year: b.getFullYear(), month: b.getMonth() };
  }), i = y.useMemo(() => or(r.year, r.month), [r.year, r.month]), o = (d) => n(({ year: b, month: f }) => {
    const p = f + d;
    return { year: b + Math.floor(p / 12), month: (p % 12 + 12) % 12 };
  }), l = /* @__PURE__ */ new Date(), x = Fa(l.getFullYear(), l.getMonth(), l.getDate());
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
        ir[r.month],
        " ",
        r.year
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Önceki ay",
            onClick: () => o(-1),
            className: "flex items-center justify-center h-7 w-7 rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-left text-[11px]" })
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => n({ year: l.getFullYear(), month: l.getMonth() }),
            className: "h-7 px-2.5 rounded-lg border border-subtle bg-surface-base text-[11.5px] font-semibold text-text-secondary hover:text-text-primary cursor-pointer",
            children: "Bugün"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Sonraki ay",
            onClick: () => o(1),
            className: "flex items-center justify-center h-7 w-7 rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-right text-[11px]" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-subtle bg-surface-raised", children: lr.map((d) => /* @__PURE__ */ e.jsx("span", { className: "px-2 py-1.5 text-center text-[11px] font-bold text-text-tertiary", children: d }, d)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: i.map((d) => {
      const b = d.inMonth ? s.get(d.key) ?? [] : [], f = d.key === x;
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: `flex flex-col gap-1 min-h-[76px] p-1.5 border-r border-b border-subtle last-of-type:border-r-0 ${d.inMonth ? "" : "bg-surface-sunken"}`,
          children: [
            d.inMonth && /* @__PURE__ */ e.jsx("span", { className: `self-end font-mono text-[11px] font-bold ${f ? "flex items-center justify-center h-[18px] w-[18px] rounded-full bg-primary text-white" : "text-text-tertiary"}`, children: d.day }),
            b.map((p, m) => {
              const c = be(p.status);
              return /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  title: `${p.title} — ${p.kind === "due" ? "termin" : "başlangıç"}`,
                  onClick: () => {
                    p.isSelf || a == null || a(p.id);
                  },
                  className: `flex items-center gap-1 w-full px-1.5 py-[3px] rounded-[6px] text-left text-[10.5px] font-semibold ${c.bg} ${c.fg} ${p.isSelf ? "cursor-default" : "cursor-pointer hover:brightness-95"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${p.kind === "due" ? "fa-flag-checkered" : "fa-play"} text-[8px] shrink-0` }),
                    /* @__PURE__ */ e.jsx("span", { className: "truncate", children: p.title })
                  ]
                },
                `${p.id}-${p.kind}-${m}`
              );
            })
          ]
        },
        d.key
      );
    }) })
  ] });
}
function Ye() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function xr(t) {
  const a = Ye();
  return a ? Promise.resolve(a.getDocuments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ur(t) {
  const a = se(), s = ["task-documents", t], r = te({
    queryKey: s,
    queryFn: () => xr(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = ae({
    mutationFn: (x) => Promise.resolve(Ye().createDocument(t, x)),
    onSuccess: n
  }), o = ae({
    mutationFn: ({ id: x, title: d, content: b }) => Promise.resolve(Ye().updateDocument(x, { title: d, content: b })),
    onSuccess: (x) => {
      n(), x != null && x.id && a.setQueryData(["task-document", x.id], x);
    }
  }), l = ae({
    mutationFn: (x) => Promise.resolve(Ye().deleteDocument(x)),
    onSuccess: n
  });
  return {
    documents: r.data ?? [],
    isLoading: r.isLoading,
    createDocument: i.mutateAsync,
    updateDocument: o.mutateAsync,
    removeDocument: l.mutateAsync,
    isSaving: o.isPending
  };
}
function pr(t) {
  return te({
    queryKey: ["task-document", t],
    queryFn: () => Promise.resolve(Ye().getDocument(t)),
    enabled: !!t,
    retry: !1
  });
}
function mr({ taskId: t }) {
  const { documents: a, isLoading: s, createDocument: r, updateDocument: n, removeDocument: i, isSaving: o } = ur(t), [l, x] = y.useState(null), [d, b] = y.useState(""), [f, p] = y.useState(""), [m, c] = y.useState(!1), { data: u, isFetching: h } = pr(l);
  y.useEffect(() => {
    !u || u.id !== l || (b(u.title ?? ""), p(u.content ?? ""), c(!1));
  }, [u == null ? void 0 : u.id]);
  const g = async () => {
    var T, E, I;
    try {
      const B = await r("Yeni belge");
      B != null && B.id && x(B.id);
    } catch (B) {
      (I = (E = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : E.error) == null || I.call(E, (B == null ? void 0 : B.message) || "Belge oluşturulamadı.");
    }
  }, j = async () => {
    var E, I, B, Y, R, G, O, Q, V;
    const T = d.trim();
    if (!T) {
      (B = (I = (E = window == null ? void 0 : window.abp) == null ? void 0 : E.notify) == null ? void 0 : I.error) == null || B.call(I, "Belge başlığı boş olamaz.");
      return;
    }
    try {
      await n({ id: l, title: T, content: f }), c(!1), (G = (R = (Y = window == null ? void 0 : window.abp) == null ? void 0 : Y.notify) == null ? void 0 : R.success) == null || G.call(R, "Belge kaydedildi.");
    } catch (J) {
      (V = (Q = (O = window == null ? void 0 : window.abp) == null ? void 0 : O.notify) == null ? void 0 : Q.error) == null || V.call(Q, (J == null ? void 0 : J.message) || "Belge kaydedilemedi.");
    }
  }, C = async (T, E) => {
    var I, B, Y;
    try {
      await i(T), l === T && x(null);
    } catch (R) {
      (Y = (B = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : B.error) == null || Y.call(B, (R == null ? void 0 : R.message) || `“${E}” silinemedi.`);
    }
  }, S = () => {
    m && !window.confirm("Kaydedilmemiş değişiklikleriniz var. Yine de kapatılsın mı?") || x(null);
  };
  return l ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: S,
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
          onChange: (T) => {
            b(T.target.value), c(!0);
          },
          className: "flex-1 min-w-0 h-9 px-3 rounded-[10px] border border-subtle bg-surface-base text-[13.5px] font-bold text-text-primary focus:border-focus focus:shadow-focus focus:outline-none"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: j,
          disabled: o || !m,
          className: `flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[12.5px] font-bold ${o || !m ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${o ? "fa-circle-notch fa-spin" : "fa-floppy-disk"} text-[11px]` }),
            o ? "Kaydediliyor…" : m ? "Kaydet" : "Kaydedildi"
          ]
        }
      )
    ] }),
    h && !u ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Belge yükleniyor…" }) : /* @__PURE__ */ e.jsx(
      ya,
      {
        value: f,
        placeholder: "Belgeyi buraya yazın…",
        onChange: (T) => {
          p(T), c(!0);
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
      ue,
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
              onClick: () => x(T.id),
              className: "flex-1 min-w-0 bg-transparent border-0 p-0 text-left cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[13px] font-bold text-text-primary", children: T.title }),
                /* @__PURE__ */ e.jsx("span", { className: "block text-[11.5px] text-text-tertiary", children: T.contentLength > 0 ? `${T.editorName} · ${at(T.lastModificationTime ?? T.creationTime)}` : "Boş belge — açıp yazmaya başlayın" })
              ]
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              "aria-label": `${T.title} belgesini sil`,
              onClick: () => C(T.id, T.title),
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
function fr(t) {
  const a = ze();
  return a ? Promise.resolve(a.getLinkedForms(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function br(t) {
  const a = se(), s = ["task-forms", t], r = te({
    queryKey: s,
    queryFn: () => fr(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), n = () => a.invalidateQueries({ queryKey: s }), i = ae({
    mutationFn: (x) => Promise.resolve(ze().linkForm(t, x)),
    onSuccess: n
  }), o = ae({
    mutationFn: (x) => Promise.resolve(ze().unlinkForm(x)),
    onSuccess: n
  }), l = ae({
    mutationFn: ({ linkId: x, value: d }) => Promise.resolve(ze().setFormGuestFillable(x, d)),
    onSuccess: n
  });
  return {
    forms: r.data ?? [],
    isLoading: r.isLoading,
    linkForm: i.mutateAsync,
    unlinkForm: o.mutateAsync,
    setGuestFillable: l.mutateAsync,
    isLinking: i.isPending
  };
}
function hr(t, a) {
  return te({
    queryKey: ["task-form-options", t],
    queryFn: () => Promise.resolve(ze().getFormOptions(t)),
    enabled: !!t && !!a,
    retry: !1
  });
}
function yr(t, a) {
  return te({
    queryKey: ["task-form-responses", t, a],
    queryFn: () => Promise.resolve(ze().getFormResponses(t, a)),
    enabled: !!t && !!a,
    retry: !1
  });
}
function gr({ taskId: t, documentId: a }) {
  const { data: s, isLoading: r } = yr(t, a);
  return r ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Yanıtlar yükleniyor…" }) : s != null && s.length ? /* @__PURE__ */ e.jsx("ul", { className: "m-0 list-none p-0", children: s.map((n) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-3 px-3.5 py-2 border-t border-subtle", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n.isGuestSubmission ? "fa-user-clock" : "fa-user"} text-[10px] text-text-tertiary` }),
      /* @__PURE__ */ e.jsx("span", { className: "truncate text-[12.5px] text-text-primary", children: n.respondentName }),
      n.isGuestSubmission && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: "· dış" })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary", children: at(n.creationTime) })
  ] }, n.id)) }) : /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-2.5 text-[12px] text-text-tertiary", children: "Bu görevde henüz yanıt yok." });
}
function vr({ taskId: t }) {
  const { forms: a, isLoading: s, linkForm: r, unlinkForm: n, setGuestFillable: i, isLinking: o } = br(t), [l, x] = y.useState(!1), [d, b] = y.useState(null), { data: f, isLoading: p } = hr(t, l), m = de("Platform.Tasks.ShareExternally"), c = async (g) => {
    var j, C, S;
    try {
      await r(g), x(!1);
    } catch (T) {
      (S = (C = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : C.error) == null || S.call(C, (T == null ? void 0 : T.message) || "Form bağlanamadı.");
    }
  }, u = async (g) => {
    var j, C, S;
    if (window.confirm(`“${g.title}” bağlantısı kaldırılsın mı? Form ve toplanmış yanıtlar silinmez.`))
      try {
        await n(g.id);
      } catch (T) {
        (S = (C = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : C.error) == null || S.call(C, (T == null ? void 0 : T.message) || "Bağlantı kaldırılamadı.");
      }
  }, h = async (g, j) => {
    var C, S, T;
    try {
      await i({ linkId: g.id, value: j });
    } catch (E) {
      (T = (S = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : S.error) == null || T.call(S, (E == null ? void 0 : E.message) || "Ayar değiştirilemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Formlar" }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => x((g) => !g),
          className: "flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${l ? "fa-xmark" : "fa-plus"} text-[11px]` }),
            l ? "Kapat" : "Form bağla"
          ]
        }
      )
    ] }),
    l && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-raised overflow-hidden", children: [
      p && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Formlar yükleniyor…" }),
      !p && !(f != null && f.length) && /* @__PURE__ */ e.jsx("p", { className: "m-0 px-3.5 py-3 text-[12.5px] text-text-tertiary", children: "Bağlanabilecek form yok. Önce Form Yönetimi'nden bir form oluşturun." }),
      f == null ? void 0 : f.map((g) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          disabled: g.isLinked || o,
          onClick: () => c(g.documentId),
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
    !s && a.length === 0 && !l && /* @__PURE__ */ e.jsx(
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
            onClick: () => b((j) => j === g.documentId ? null : g.documentId),
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
        g.responseCount > 0 && /* @__PURE__ */ e.jsx($a, { children: g.responseCount }),
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
            onClick: () => u(g),
            className: "flex shrink-0 items-center justify-center h-[28px] w-[28px] rounded-[8px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[12px]" })
          }
        )
      ] }),
      m && g.isPublished && /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 px-3.5 pb-3 text-[11.5px] text-text-secondary cursor-pointer", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: !!g.isGuestFillable,
            onChange: (j) => h(g, j.target.checked)
          }
        ),
        "Süreli paylaşım linkiyle ekip dışından da doldurulabilsin"
      ] }),
      d === g.documentId && /* @__PURE__ */ e.jsx(gr, { taskId: t, documentId: g.documentId })
    ] }, g.id))
  ] });
}
const jr = {
  0: "bg-neutral-400",
  1: "bg-text-tertiary",
  2: "bg-warning",
  3: "bg-primary",
  4: "bg-success"
};
function ut(t) {
  if (!t) return null;
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? null : a;
}
const Me = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
function Nr({ task: t = {} }) {
  const a = y.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((o, l) => ({
    id: o.id || `row-${l}`,
    name: o.title || "Başlıksız görev",
    isMain: !!o.__main,
    start: ut(o.startDate),
    end: ut(o.dueDate) || ut(o.completedDate),
    status: o.status ?? 1
  })), [t]), { min: s, span: r } = y.useMemo(() => {
    const i = a.flatMap((x) => [x.start, x.end]).filter(Boolean).map((x) => x.getTime());
    if (i.length === 0) return { min: null, span: 0 };
    const o = Math.min(...i), l = Math.max(...i);
    return { min: o, span: Math.max(1, l - o) };
  }, [a]), n = y.useMemo(() => s === null ? [] : [0, 1, 2, 3].map((i) => new Date(s + r * i / 4)), [s, r]);
  return s === null ? /* @__PURE__ */ e.jsx("div", { className: De, children: /* @__PURE__ */ e.jsx(
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
        Me(new Date(s)),
        " – ",
        Me(new Date(s + r))
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-4 gap-0 pl-[170px] mb-2 lt-860:pl-[110px]", children: n.map((i, o) => /* @__PURE__ */ e.jsx(
      "span",
      {
        className: "pl-2 border-l border-subtle text-[10.5px] font-bold uppercase tracking-[.06em] text-text-tertiary",
        children: Me(i)
      },
      o
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: a.map((i) => {
      const o = i.start ? i.start.getTime() : s, l = i.end ? Math.max(i.end.getTime(), o) : o, x = (o - s) / r * 100, d = Math.max(2, (l - o) / r * 100), b = Math.max(1, Math.round((l - o) / 864e5));
      return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-0 h-9", children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            className: `w-[170px] lt-860:w-[110px] shrink-0 pr-3 truncate text-[12.5px] ${i.isMain ? "font-bold text-text-primary" : "font-semibold text-text-secondary"}`,
            title: i.name,
            children: i.name
          }
        ),
        /* @__PURE__ */ e.jsx("div", { className: "relative flex-1 h-full rounded-lg bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: `absolute top-[7px] bottom-[7px] flex items-center px-2.5 rounded-[7px] shadow-xs ${jr[i.status] || "bg-primary"}`,
            style: { left: `${x}%`, width: `${d}%` },
            title: `${Me(i.start)} – ${Me(i.end)}`,
            children: /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[10.5px] font-bold text-white", children: [
              b,
              "g"
            ] })
          }
        ) })
      ] }, i.id);
    }) })
  ] });
}
function Vt({ icon: t, iconTone: a, title: s, note: r, children: n }) {
  return /* @__PURE__ */ e.jsxs("div", { className: De, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[12px] ${a}` }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: s }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
    ] }),
    n
  ] });
}
function wr({ task: t = {} }) {
  const a = se(), s = t.predecessorIds || [], r = () => {
    var x, d, b;
    return (b = (d = (x = window == null ? void 0 : window.apya) == null ? void 0 : x.platform) == null ? void 0 : d.tasks) == null ? void 0 : b.task;
  }, { data: n = [], isLoading: i } = te({
    queryKey: ["task-predecessors", t.id, s],
    queryFn: async () => {
      const x = r();
      return x ? Promise.all(
        s.map(
          (d) => Promise.resolve(x.get(d)).catch(() => ({ id: d, title: "(erişilemeyen görev)", status: null, code: "—" }))
        )
      ) : [];
    },
    enabled: s.length > 0,
    staleTime: 3e4,
    retry: !1
  }), o = async (x) => {
    var d, b, f, p, m, c;
    try {
      await Promise.resolve(r().update(t.id, {
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
        predecessorIds: s.filter((u) => u !== x),
        tagNames: (t.tags ?? []).map((u) => u.name),
        estimatedHours: t.estimatedHours ?? null,
        taskType: t.taskType ?? null,
        sprint: t.sprint ?? null
      })), await a.invalidateQueries({ queryKey: ["task-detail", t.id] }), (f = (b = (d = window == null ? void 0 : window.abp) == null ? void 0 : d.notify) == null ? void 0 : b.info) == null || f.call(b, "Bağlantı kaldırıldı.");
    } catch (u) {
      (c = (m = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : m.error) == null || c.call(m, (u == null ? void 0 : u.message) || "Bağlantı kaldırılamadı.");
    }
  }, l = (x) => {
    var d, b, f;
    return (f = (b = (d = window == null ? void 0 : window.apya) == null ? void 0 : d.taskDetail) == null ? void 0 : b.open) == null ? void 0 : f.call(b, x);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsx(
      Vt,
      {
        icon: "fa-arrow-left-long",
        iconTone: "text-warning",
        title: "Öncül görevler",
        note: "bu görev başlamadan tamamlanmalı",
        children: s.length === 0 ? /* @__PURE__ */ e.jsx(ue, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : i ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : n.map((x) => {
          const d = x.status == null ? null : be(x.status);
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
                    onClick: () => l(x.id),
                    className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                    children: x.title || "Başlıksız görev"
                  }
                ),
                d && /* @__PURE__ */ e.jsx(Pe, { bg: d.bg, fg: d.fg, children: d.label }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Bağlantıyı kaldır",
                    "aria-label": `${x.title} bağlantısını kaldır`,
                    onClick: () => o(x.id),
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
      Vt,
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
function Be() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task) || null;
}
function kr(t) {
  const a = se(), s = ["task-timelogs", t], r = ["task-active-timelog"], n = te({
    queryKey: s,
    queryFn: () => {
      var d;
      return Promise.resolve((d = Be()) == null ? void 0 : d.getTimeLogs(t));
    },
    enabled: !!t && !!Be(),
    staleTime: 15e3,
    retry: !1
  }), i = te({
    queryKey: r,
    queryFn: () => {
      var d;
      return Promise.resolve((d = Be()) == null ? void 0 : d.getActiveTimeLog());
    },
    enabled: !!Be(),
    staleTime: 5e3,
    retry: !1
  }), o = () => {
    a.invalidateQueries({ queryKey: s }), a.invalidateQueries({ queryKey: r });
  }, l = ae({
    mutationFn: () => {
      var d;
      return Promise.resolve((d = Be()) == null ? void 0 : d.startTimeTracking(t));
    },
    onSuccess: o
  }), x = ae({
    mutationFn: () => {
      var d;
      return Promise.resolve((d = Be()) == null ? void 0 : d.stopTimeTracking(t));
    },
    onSuccess: o
  });
  return {
    logs: n.data ?? [],
    isLoading: n.isLoading,
    activeLog: i.data ?? null,
    start: l.mutateAsync,
    stop: x.mutateAsync,
    isMutating: l.isPending || x.isPending
  };
}
function Ht(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function Cr({ taskId: t, task: a = {} }) {
  const s = kr(t), r = s.activeLog && s.activeLog.taskId === t ? s.activeLog : null, [n, i] = y.useState(() => Date.now());
  y.useEffect(() => {
    if (!r) return;
    const c = setInterval(() => i(Date.now()), 1e3);
    return () => clearInterval(c);
  }, [r]);
  const o = r ? Math.max(0, Math.floor((n - new Date(r.startTime).getTime()) / 1e3)) : 0, x = s.logs.reduce((c, u) => c + (u.secondsSpent || 0), 0) + o, d = (a == null ? void 0 : a.estimatedHours) ?? null, b = d ? d * 3600 : 0, f = b ? Math.min(100, Math.round(x / b * 100)) : 0, p = b ? Math.max(0, b - x) : 0, m = async () => {
    var c, u, h;
    try {
      r ? await s.stop() : await s.start();
    } catch (g) {
      (h = (u = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : u.error) == null || h.call(u, (g == null ? void 0 : g.message) || "Zaman takibi güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-5 flex-wrap p-[22px] rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[18px]", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: m,
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
              children: Ts(x)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary", children: r ? "Kayıt sürüyor" : "Sayaç duraklatıldı" })
        ] })
      ] }),
      b > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] font-bold text-text-secondary", children: "Tahmin kullanımı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
            lt(x),
            " / ",
            d,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-warning", style: { width: `${f}%` } }) }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "Kalan tahmini süre: ",
          lt(p)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: De, children: [
      /* @__PURE__ */ e.jsx(_e, { title: "Zaman kayıtları" }),
      s.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : s.logs.length === 0 ? /* @__PURE__ */ e.jsx(
        ue,
        {
          icon: "fa-stopwatch",
          title: "Henüz zaman kaydı yok",
          description: "Soldaki yeşil düğmeyle sayacı çalıştırın; durdurduğunuzda kayıt buraya düşer."
        }
      ) : s.logs.map((c) => {
        const u = !c.endTime;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
            children: [
              /* @__PURE__ */ e.jsx(it, { name: c.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: c.note || c.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                Ht(c.startTime),
                " → ",
                u ? "sürüyor" : Ht(c.endTime)
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary", children: u ? "Aktif" : lt(c.secondsSpent || 0) })
            ]
          },
          c.id
        );
      })
    ] })
  ] });
}
const Ve = [
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
    component: Ss,
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
    component: Es,
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
    component: rr,
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
    component: nr,
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
    component: dr,
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
    component: Bs,
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
    component: Nr,
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
    component: wr,
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
    component: er,
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
    component: Rs,
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
    component: Ks,
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
    component: Fs,
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
    component: Ls,
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
    component: Cr,
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
    component: mr,
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
    component: vr,
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
    component: tr,
    surfaces: ["task", "project", "tasks"]
  }
];
function za(t = []) {
  const a = new Set(t);
  return Ve.filter((s) => !s.hidden).filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function Ia(t = []) {
  const a = new Set(t);
  return Ve.filter((s) => !s.hidden).filter((s) => !s.isCore).filter((s) => !s.permission || de(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let Qe = null;
const Xe = /* @__PURE__ */ new Set(), pt = /* @__PURE__ */ new Set();
function Qt() {
  Xe.forEach((t) => t());
}
function Dr(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const le = {
  open(t) {
    const a = Dr(t);
    a && (Qe = a, Qt());
  },
  close() {
    Qe = null, Qt();
  },
  subscribe(t) {
    return Xe.add(t), () => Xe.delete(t);
  },
  getSnapshot() {
    return Qe;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && pt.add(t);
  },
  emitResult() {
    pt.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    Qe = null, Xe.clear(), pt.clear();
  }
}, Jt = "apya.taskDetail.fullscreen";
function La({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, n] = y.useState(t), [i, o] = y.useState([]), { data: l, isPending: x, isError: d, refetch: b } = wt(r), f = ja(), p = Ca(l), m = Da(), c = Ta(r), [u, h] = y.useState("general"), [g, j] = y.useState(!1), C = Ge.useRef(null), S = y.useMemo(
    () => za(c.assignedCodes),
    [c.assignedCodes]
  ), T = y.useMemo(
    () => Ia(c.assignedCodes),
    [c.assignedCodes]
  ), E = S.find((z) => z.code === u) ?? S[0];
  Ge.useEffect(() => {
    E.code !== u && h(E.code);
  }, [E, u]);
  const I = E == null ? void 0 : E.component, B = se(), [Y, R] = y.useState(
    () => {
      var z;
      return ((z = window.localStorage) == null ? void 0 : z.getItem(Jt)) === "1";
    }
  ), [G, O] = y.useState(!1), Q = y.useCallback(() => {
    wa(), s == null || s();
  }, [s]);
  ka(t, Q), Ge.useEffect(() => {
    p.isDirty ? f.markDirty() : f.markClean();
  });
  const V = y.useCallback(() => f.requestClose(Q), [f, Q]), J = y.useCallback(() => {
    R((z) => {
      var U;
      const M = !z;
      return (U = window.localStorage) == null || U.setItem(Jt, M ? "1" : "0"), M;
    });
  }, []), W = de("Platform.Tasks.Delete"), [re, w] = y.useState(!1), [N, v] = y.useState(!1), $ = y.useCallback(async () => {
    var z, M, U, ne, X, Te;
    v(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (U = (M = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : M.info) == null || U.call(M, "Başarıyla silindi."), w(!1), f.markClean(), Q();
    } catch (pe) {
      (Te = (X = (ne = window == null ? void 0 : window.abp) == null ? void 0 : ne.notify) == null ? void 0 : X.error) == null || Te.call(X, (pe == null ? void 0 : pe.message) || "Görev silinemedi.");
    } finally {
      v(!1);
    }
  }, [r, f, Q]), A = y.useCallback(async () => {
    var z, M, U, ne, X, Te;
    if (!p.validate()) return !1;
    O(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, p.toUpdateDto())
      ), await B.invalidateQueries({ queryKey: ["task-detail", r] }), le.emitResult(), (U = (M = (z = window == null ? void 0 : window.abp) == null ? void 0 : z.notify) == null ? void 0 : M.success) == null || U.call(M, "Kaydedildi."), !0;
    } catch (pe) {
      return (Te = (X = (ne = window == null ? void 0 : window.abp) == null ? void 0 : ne.notify) == null ? void 0 : X.error) == null || Te.call(X, (pe == null ? void 0 : pe.message) || "Kaydedilemedi."), !1;
    } finally {
      O(!1);
    }
  }, [r, p, f, B]), L = y.useCallback(() => {
    A();
  }, [A]), ie = y.useCallback(async () => {
    const z = f.resolvePendingClose("save");
    await A() && (z == null || z());
  }, [f, A]), k = y.useCallback((z, M) => {
    f.requestClose(() => {
      o((U) => [...U, { id: r, title: (l == null ? void 0 : l.title) ?? "" }]), n(z), h("general"), f.markClean();
    });
  }, [f, r, l]), K = y.useCallback((z) => {
    f.requestClose(() => {
      o((M) => {
        const U = M.findIndex((ne) => ne.id === z);
        return U === -1 ? M : M.slice(0, U);
      }), n(z), h("general"), f.markClean();
    });
  }, [f]), F = y.useCallback(async (z) => {
    var M, U, ne;
    try {
      await c.addFeature(z), h(z), j(!1);
    } catch (X) {
      (ne = (U = (M = window == null ? void 0 : window.abp) == null ? void 0 : M.notify) == null ? void 0 : U.error) == null || ne.call(U, (X == null ? void 0 : X.message) || "Özellik eklenemedi.");
    }
  }, [c]), _ = y.useCallback(async (z) => {
    var M, U, ne;
    try {
      await c.removeFeature(z), h((X) => X === z ? "general" : X);
    } catch (X) {
      (ne = (U = (M = window == null ? void 0 : window.abp) == null ? void 0 : M.notify) == null ? void 0 : U.error) == null || ne.call(U, (X == null ? void 0 : X.message) || "Özellik kaldırılamadı.");
    }
  }, [c]);
  Ge.useEffect(() => {
    if (!g) return;
    const z = (U) => {
      C.current && !C.current.contains(U.target) && j(!1);
    }, M = (U) => {
      U.key === "Escape" && j(!1);
    };
    return document.addEventListener("mousedown", z), document.addEventListener("keydown", M), () => {
      document.removeEventListener("mousedown", z), document.removeEventListener("keydown", M);
    };
  }, [g]);
  const H = x ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(je, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(je, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(je, { className: "h-24 w-full" })
  ] }) : d ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(ee, { variant: "ghost", onClick: () => b(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      vs,
      {
        trail: i,
        current: { id: r, title: (l == null ? void 0 : l.title) ?? "" },
        onNavigate: K
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: C, children: [
      /* @__PURE__ */ e.jsx(
        hs,
        {
          tabs: S,
          activeCode: E.code,
          onSelect: (z) => {
            h(z), j(!1);
          },
          onOpenPicker: () => j((z) => !z),
          pickerOpen: g
        }
      ),
      g && /* @__PURE__ */ e.jsx(
        gs,
        {
          entries: T,
          busyCode: c.isMutating ? c.mutatingCode : null,
          onAdd: F,
          onRemove: _
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
            ps,
            {
              values: p.values,
              errors: p.errors,
              onFieldChange: p.setField,
              assigneeOptions: m.options,
              isLoadingAssignees: m.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(y.Suspense, { fallback: /* @__PURE__ */ e.jsx(je, { className: "h-24 w-full" }), children: I && /* @__PURE__ */ e.jsx(
            I,
            {
              taskId: r,
              task: l,
              form: p,
              onOpenSubtask: k
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            ms,
            {
              task: l,
              creatorName: m.nameById.get(l.creatorId),
              lastModifierName: m.nameById.get(l.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), oe = a === "page" ? is : ns;
  return /* @__PURE__ */ e.jsxs(
    oe,
    {
      open: !0,
      fullscreen: Y,
      onRequestClose: V,
      title: l ? `Görev Detayı: ${l.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        os,
        {
          task: l ?? { title: "Yükleniyor…" },
          canDelete: W,
          fullscreen: Y,
          onToggleFullscreen: J,
          onClose: V,
          onDelete: () => w(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        ds,
        {
          lastSavedAt: l == null ? void 0 : l.lastModificationTime,
          isDirty: f.isDirty,
          isSaving: G,
          onCancel: V,
          onSave: L
        }
      ),
      children: [
        H,
        f.pendingClose && /* @__PURE__ */ e.jsx(
          Sr,
          {
            isSaving: G,
            onStay: () => f.resolvePendingClose("stay"),
            onDiscard: () => f.resolvePendingClose("discard"),
            onSaveAndClose: ie
          }
        ),
        re && /* @__PURE__ */ e.jsx(
          Tr,
          {
            taskTitle: (l == null ? void 0 : l.title) ?? "",
            busy: N,
            onCancel: () => w(!1),
            onConfirm: $
          }
        )
      ]
    }
  );
}
function Tr({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [n, i] = y.useState(""), o = n.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    Ka,
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
        /* @__PURE__ */ e.jsx(ee, { variant: "secondary", onClick: s, disabled: a, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          ee,
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
            value: n,
            onChange: (l) => i(l.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function Ka({ label: t, title: a, description: s, children: r, actions: n }) {
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
        /* @__PURE__ */ e.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: n })
      ] })
    }
  );
}
function Sr({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    Ka,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(ee, { variant: "secondary", onClick: a, disabled: t, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ e.jsx(ee, { variant: "destructive", onClick: s, disabled: t, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ e.jsx(ee, { variant: "primary", onClick: r, isLoading: t, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
const $r = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function Pr({ isPrivate: t = !1, onChange: a = () => {
} }) {
  const s = !!t, [r, n] = y.useState(null);
  return /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
      "button",
      {
        ref: n,
        type: "button",
        className: "flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-default transition-all shadow-sm",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${s ? "fa-lock" : "fa-globe"} text-[11px] text-text-tertiary` }),
          /* @__PURE__ */ e.jsx("span", { children: s ? "Özel görev" : "Herkese açık" }),
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[10px] ml-0.5 text-text-tertiary" })
        ]
      }
    ) }),
    /* @__PURE__ */ e.jsx(ke, { container: $e(r), children: /* @__PURE__ */ e.jsxs(
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
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: $r.map((i) => {
            const o = s === i.value;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => a(i.value),
                className: `flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${o ? "border-primary bg-primary-subtle/40" : "border-subtle hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${i.icon} text-base mt-0.5 ${o ? "text-primary" : "text-text-tertiary"}` }),
                  /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ e.jsx("h4", { className: "text-[13px] font-semibold text-text-primary", children: i.title }),
                      o && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ] }),
                    /* @__PURE__ */ e.jsx("p", { className: "text-[12px] text-text-tertiary mt-0.5", children: i.desc })
                  ] })
                ]
              },
              String(i.value)
            );
          }) }),
          /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-text-tertiary mt-3", children: "Değişiklik “Kaydet” ile uygulanır." }),
          /* @__PURE__ */ e.jsx(Xa, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const Wt = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto", Er = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", Ar = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" },
  { what: "Bağlantı kopyala", key: "⌘ L" }
];
function Br({ children: t }) {
  return /* @__PURE__ */ e.jsx(Nt, { asChild: !0, children: t });
}
function Fr({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "inline-flex items-center h-[19px] px-1.5 rounded-[5px] border border-default border-b-2 bg-neutral-subtle font-mono text-[10px] font-semibold text-text-secondary", children: t });
}
function zr({
  task: t = {},
  presentation: a = "modal",
  onClose: s,
  isFullscreen: r,
  onToggleFullscreen: n,
  onFieldChange: i = () => {
  },
  statusValue: o,
  titleValue: l,
  isPrivateValue: x,
  isFavorite: d,
  onToggleFavorite: b,
  isWatched: f,
  onToggleWatch: p,
  onDuplicate: m,
  onArchive: c,
  onDelete: u,
  onOpenTransfer: h,
  onSaveAsTemplate: g,
  onConvertToSubtask: j,
  onExportPdf: C
}) {
  const [S, T] = y.useState(!1), [E, I] = y.useState(null), [B, Y] = y.useState(!1), R = y.useRef(null), G = $e(E), O = be(o ?? t.status), Q = t.code || "GRV-—", V = () => {
    var w;
    (w = navigator.clipboard) == null || w.writeText(Q), T(!0), setTimeout(() => T(!1), 1800);
  }, J = () => {
    var w, N, v, $;
    (w = navigator.clipboard) == null || w.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), ($ = (v = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : v.success) == null || $.call(v, "Görev bağlantısı panoya kopyalandı.");
  }, W = (w) => () => {
    Y(!1), w == null || w();
  }, re = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", kbd: "⌘L", onClick: W(J) },
    { label: "Çoğalt", icon: "fa-copy", kbd: "⌘D", onClick: W(m) },
    { label: "Başka projeye kopyala", icon: "fa-clone", onClick: W(() => h == null ? void 0 : h("copy")) },
    { label: "Şablon olarak kaydet", icon: "fa-bookmark", onClick: W(g) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, onClick: W(() => h == null ? void 0 : h("move")) },
    { label: "Alt göreve dönüştür", icon: "fa-diagram-project", onClick: W(j) },
    { label: f ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: W(p) },
    { label: "Arşivle", icon: "fa-box-archive", separator: !0, onClick: W(c) },
    { label: "Yazdır", icon: "fa-print", kbd: "⌘P", onClick: W(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: W(C) },
    { label: "Sil", icon: "fa-trash-can", kbd: "⌫", separator: !0, danger: !0, onClick: W(u) }
  ];
  return /* @__PURE__ */ e.jsxs("header", { ref: I, className: "shrink-0 px-6 lt-860:px-4 pt-[18px] pb-4 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: V,
            title: "Kodu kopyala",
            className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[11px] font-bold tracking-[.04em] cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[9px] opacity-70" }),
              /* @__PURE__ */ e.jsx("span", { children: Q }),
              /* @__PURE__ */ e.jsx("i", { className: `${S ? "fa-solid fa-check" : "fa-regular fa-copy"} text-[9px] opacity-60` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] border border-default text-[12px] font-semibold cursor-pointer ${O.bg} ${O.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-current animate-pulse" }),
                /* @__PURE__ */ e.jsx("span", { children: O.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(ke, { container: G, children: /* @__PURE__ */ e.jsxs(Ce, { sideOffset: 6, align: "start", className: `${Wt} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            tt.map((w) => {
              const N = ga[w], v = (o ?? t.status) === w;
              return /* @__PURE__ */ e.jsx(Br, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => i("status", w),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${v ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${N.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: N.label }),
                    v && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, w);
            })
          ] }) })
        ] }),
        f && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 h-[26px] px-2.5 rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11.5px] font-semibold", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-eye text-[10px]" }),
          "Takip ediliyor"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
        /* @__PURE__ */ e.jsx("div", { className: "lt-860:hidden", children: /* @__PURE__ */ e.jsx(
          Pr,
          {
            isPrivate: x ?? !!t.isPrivate,
            onChange: (w) => i("isPrivate", w)
          }
        ) }),
        /* @__PURE__ */ e.jsx("div", { className: "h-5 w-px bg-border-default mx-1" }),
        a === "modal" && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: n,
            title: r ? "Küçült" : "Tam ekran",
            className: `mobile:hidden flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${r ? "bg-primary-subtle text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r ? "fa-compress" : "fa-expand"} text-[12px]` })
          }
        ),
        /* @__PURE__ */ e.jsxs(Ne, { modal: !0, open: B, onOpenChange: Y, children: [
          /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Diğer seçenekler",
              className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${B ? "bg-surface-hover text-text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
            }
          ) }),
          /* @__PURE__ */ e.jsx(ke, { container: G, children: /* @__PURE__ */ e.jsxs(
            Ce,
            {
              sideOffset: 6,
              align: "end",
              collisionBoundary: G ?? [],
              collisionPadding: 12,
              className: `${Wt} w-[244px]`,
              children: [
                re.map((w) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: w.onClick,
                    className: [
                      Er,
                      w.danger ? "text-negative" : "text-text-secondary",
                      w.separator ? "border-t border-subtle mt-[5px]" : ""
                    ].join(" "),
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${w.icon} text-[11px] w-[14px] opacity-75` }),
                      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: w.label }),
                      w.kbd && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: w.kbd })
                    ]
                  },
                  w.label
                )),
                /* @__PURE__ */ e.jsxs("div", { className: "mt-1.5 pt-[9px] px-[9px] pb-[7px] border-t border-subtle", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 mb-[7px]", children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-keyboard text-[11px] text-text-tertiary" }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-[.09em] text-text-tertiary", children: "Kısayollar" })
                  ] }),
                  Ar.map((w) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: w.what }),
                    /* @__PURE__ */ e.jsx(Fr, { children: w.key })
                  ] }, w.what))
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
          ref: R,
          contentEditable: !0,
          suppressContentEditableWarning: !0,
          spellCheck: !1,
          onBlur: (w) => i("title", w.currentTarget.textContent.trim()),
          className: "flex-1 min-w-0 text-[24px] lt-560:text-[20px] font-extrabold tracking-[-.025em] leading-[1.2] text-text-primary px-2 -ml-2 py-[3px] rounded-[9px] border border-transparent cursor-text hover:bg-neutral-subtle hover:border-subtle focus:bg-neutral-subtle focus:border-focus focus:shadow-focus focus:outline-none",
          children: l ?? t.title ?? "Başlıksız görev"
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
    ] })
  ] });
}
const Je = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", Zt = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function ge({ children: t }) {
  return /* @__PURE__ */ e.jsx(Nt, { asChild: !0, children: t });
}
function me({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[7px] min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.08em] text-text-tertiary select-none", children: t }),
    a
  ] });
}
function Xt({ name: t, size: a = 26 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Oe(t), fontSize: a * 0.38 },
      children: Ue(t)
    }
  );
}
function ea(t) {
  if (t == null) return "—";
  const a = Math.max(0, Math.round(Number(t) * 60)), s = Math.floor(a / 60), r = a % 60;
  return s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function Ir({
  task: t = {},
  assigneeOptions: a = [],
  projectOptions: s = [],
  onFieldChange: r = () => {
  },
  statusValue: n,
  priorityValue: i,
  assigneeValue: o,
  projectValue: l,
  dueDateValue: x,
  startDateValue: d,
  tagsValue: b = [],
  progressPercent: f = 0,
  progressNote: p = "",
  onOpenTransfer: m
}) {
  var w, N;
  const [c, u] = y.useState(""), [h, g] = y.useState(""), [j, C] = y.useState(""), [S, T] = y.useState(!1), [E, I] = y.useState(null), B = be(n ?? t.status), Y = nt(i ?? t.priority), R = o ?? t.assigneeId ?? null, G = l ?? t.projectId ?? null, O = ((w = a.find((v) => v.value === R)) == null ? void 0 : w.label) || t.assigneeName || "Atanmamış", Q = ((N = s.find((v) => v.value === G)) == null ? void 0 : N.label) || t.projectName || "Projesiz", V = ha(x ?? t.dueDate), J = a.filter(
    (v) => !c || v.label.toLowerCase().includes(c.toLowerCase())
  ), W = s.filter(
    (v) => !h || v.label.toLowerCase().includes(h.toLowerCase())
  ), re = () => {
    const v = j.trim();
    v && !b.includes(v) && r("tagNames", [...b, v]), C(""), T(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { ref: I, className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6", children: [
    /* @__PURE__ */ e.jsx(me, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx(Xt, { name: R ? O : null }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: O }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ke, { container: $e(E), children: /* @__PURE__ */ e.jsxs(Ce, { sideOffset: 6, align: "start", className: `${Je} w-[264px]`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: c,
              onChange: (v) => u(v.target.value),
              placeholder: "Kişi ara…",
              className: Zt
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[230px] overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ e.jsx(ge, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("assigneeId", null),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] text-left cursor-pointer ${R ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary font-semibold"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex h-6 w-6 items-center justify-center rounded-full bg-neutral-subtle text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-user-slash text-[9px]" }) }),
                /* @__PURE__ */ e.jsx("span", { children: "Atanmamış" })
              ]
            }
          ) }),
          a.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-2 py-1.5 text-[12px] text-text-tertiary", children: "Kullanıcı listesi yükleniyor…" }),
          J.map((v) => /* @__PURE__ */ e.jsx(ge, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("assigneeId", v.value),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${R === v.value ? "bg-primary-subtle" : "hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx(Xt, { name: v.label, size: 24 }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: v.label }),
                R === v.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
              ]
            }
          ) }, v.value))
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ e.jsxs(me, { label: "Son tarih", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
        /* @__PURE__ */ e.jsx("i", { className: `fa-regular fa-calendar text-[13px] ${V.tone}` }),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "date",
            value: (x ?? t.dueDate ?? "").slice(0, 10),
            onChange: (v) => r("dueDate", v.target.value),
            className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
          }
        )
      ] }),
      V.hint && /* @__PURE__ */ e.jsx("span", { className: `-mt-0.5 text-[10.5px] font-semibold ${V.tone}`, children: V.hint })
    ] }),
    /* @__PURE__ */ e.jsx(me, { label: "Başlangıç", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[13px] text-text-tertiary" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          value: (d ?? t.startDate ?? "").slice(0, 10),
          onChange: (v) => r("startDate", v.target.value),
          className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(me, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 pt-[5px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: [
          "%",
          f
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-medium text-text-tertiary", children: p })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "h-1.5 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "h-full rounded-full bg-primary transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
          style: { width: `${f}%` }
        }
      ) })
    ] }) }),
    /* @__PURE__ */ e.jsx(me, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(we, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${B.bg} ${B.fg}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${B.icon} text-[11px]` }),
            /* @__PURE__ */ e.jsx("span", { children: B.label }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ke, { container: $e(E), children: /* @__PURE__ */ e.jsxs(Ce, { sideOffset: 6, align: "start", className: `${Je} w-[196px]`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
        tt.map((v) => {
          const $ = ga[v], A = (n ?? t.status) === v;
          return /* @__PURE__ */ e.jsx(ge, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("status", v),
              className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${A ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${$.dot}` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: $.label }),
                A && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
              ]
            }
          ) }, v);
        })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(me, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
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
      /* @__PURE__ */ e.jsx(ke, { container: $e(E), children: /* @__PURE__ */ e.jsxs(Ce, { sideOffset: 6, align: "start", className: `${Je} w-[184px]`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
        Ja.map((v) => {
          const $ = Wa[v], A = (i ?? t.priority) === v;
          return /* @__PURE__ */ e.jsx(ge, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("priority", v),
              className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${A ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${$.icon} text-[11px] w-[13px]` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: $.label }),
                A && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
              ]
            }
          ) }, v);
        })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(me, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap min-h-8", children: [
      b.map((v) => /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "inline-flex items-center gap-1.5 h-6 px-2 rounded-[7px] border border-primary bg-primary-subtle text-primary text-[11.5px] font-bold",
          children: [
            /* @__PURE__ */ e.jsx("span", { children: v }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Etiketi kaldır",
                onClick: () => r("tagNames", b.filter(($) => $ !== v)),
                className: "flex items-center p-0 border-0 bg-transparent text-current opacity-55 hover:opacity-100 hover:text-negative cursor-pointer",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
              }
            )
          ]
        },
        v
      )),
      S ? /* @__PURE__ */ e.jsx(
        "input",
        {
          autoFocus: !0,
          type: "text",
          value: j,
          onChange: (v) => C(v.target.value),
          onBlur: re,
          onKeyDown: (v) => {
            v.key === "Enter" && re(), v.key === "Escape" && (C(""), T(!1));
          },
          placeholder: "Etiket…",
          className: "h-6 w-24 px-2 rounded-[7px] border border-focus bg-surface-base text-text-primary text-[11.5px] shadow-focus focus:outline-none"
        }
      ) : /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          "aria-label": "Yeni etiket ekle",
          onClick: () => T(!0),
          className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-dashed border-strong bg-transparent text-text-tertiary text-[11.5px] font-semibold hover:border-focus hover:text-primary hover:bg-primary-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[9px]" }),
            "Etiket"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(me, { label: "Proje", children: /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
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
      /* @__PURE__ */ e.jsx(ke, { container: $e(E), children: /* @__PURE__ */ e.jsxs(Ce, { sideOffset: 6, align: "start", className: `${Je} w-[250px]`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: h,
              onChange: (v) => g(v.target.value),
              placeholder: "Proje ara…",
              className: Zt
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[210px] overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ e.jsx(ge, { children: /* @__PURE__ */ e.jsxs(
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
          W.map((v) => /* @__PURE__ */ e.jsx(ge, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("projectId", v.value),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${G === v.value ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-primary" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: v.label }),
                G === v.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
              ]
            }
          ) }, v.value))
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-[7px] pt-[7px] border-t border-subtle", children: [
          /* @__PURE__ */ e.jsx(ge, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => m == null ? void 0 : m("move"),
              className: "flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left text-text-secondary hover:bg-surface-hover hover:text-primary cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[11px] w-[14px] opacity-70" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Başka projeye taşı…" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(ge, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => m == null ? void 0 : m("copy"),
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
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[13px] font-bold text-text-primary", children: ea(t.spentHours ?? 0) }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[12px] text-text-tertiary", children: [
        "/ ",
        t.estimatedHours != null ? ea(t.estimatedHours) : "—"
      ] })
    ] }) })
  ] }) });
}
const Lr = "z-popover w-[225px] rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast max-h-[var(--radix-popover-content-available-height)] overflow-y-auto";
function Tt({ entries: t = [], onPick: a, children: s }) {
  const [r, n] = y.useState(null), i = $e(r);
  return /* @__PURE__ */ e.jsx("span", { ref: n, className: "contents", children: /* @__PURE__ */ e.jsxs(Ne, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(we, { asChild: !0, children: s }),
    /* @__PURE__ */ e.jsx(ke, { container: i, children: /* @__PURE__ */ e.jsxs(Ce, { sideOffset: 6, align: "start", collisionPadding: 12, className: Lr, children: [
      /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Özellik ekle" }),
      t.map((o) => /* @__PURE__ */ e.jsx(Nt, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => a == null ? void 0 : a(o.code, o.isAssigned),
          className: [
            "flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px]",
            "text-[12.5px] font-semibold text-left cursor-pointer",
            o.isAssigned ? "text-text-tertiary hover:bg-surface-hover" : "text-text-primary hover:bg-surface-hover"
          ].join(" "),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${o.icon} text-[12px] w-[15px] opacity-85`, "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: o.title }),
            o.isAssigned && /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10px] font-extrabold text-primary", children: "✓ açık" })
          ]
        }
      ) }, o.code)),
      t.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-[9px] py-[7px] text-[11.5px] text-text-tertiary", children: "Eklenecek başka özellik yok." })
    ] }) })
  ] }) });
}
function Kr({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: n,
  onDragEnd: i,
  onReorderTo: o,
  onReorderDrop: l,
  pickerEntries: x = [],
  onPickFeature: d,
  counts: b = {},
  isDirty: f = !1
}) {
  const [p, m] = y.useState(!1);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-6 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 py-2.5 flex-1 min-w-0 overflow-x-auto custom-scrollbar", children: [
      s.map((c) => {
        const u = t === c.code, h = b[c.code] || 0;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            draggable: !0,
            title: "Sürükleyerek sırayı değiştirin",
            ...va(() => a(c.code)),
            onDragStart: (g) => {
              n(c.code);
              try {
                g.dataTransfer.effectAllowed = "move", g.dataTransfer.setData("text/plain", c.code);
              } catch {
              }
            },
            onDragOver: (g) => {
              g.preventDefault(), o(c.code);
            },
            onDrop: (g) => {
              g.preventDefault(), l == null || l();
            },
            onDragEnd: i,
            className: [
              "flex shrink-0 items-center gap-2 h-[34px] px-[13px] rounded-[10px]",
              "text-[12.5px] whitespace-nowrap cursor-grab active:cursor-grabbing",
              "transition-opacity duration-fast",
              u ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
              r === c.code ? "opacity-35" : "opacity-100"
            ].join(" "),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c.icon} text-[11px] opacity-85` }),
              /* @__PURE__ */ e.jsx("span", { children: c.title }),
              h > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                "rounded-full text-[10px] font-extrabold",
                u ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
              ].join(" "), children: h })
            ]
          },
          c.code
        );
      }),
      /* @__PURE__ */ e.jsx(Tt, { entries: x, onPick: d, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          title: "Özellik ekle",
          onClick: () => m(!1),
          onMouseEnter: () => m(!0),
          onMouseLeave: () => m(!1),
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
    f && /* @__PURE__ */ e.jsxs("span", { className: "flex shrink-0 items-center gap-[7px] h-[26px] px-2.5 rounded-full bg-warning-subtle text-warning text-[11px] font-bold", children: [
      /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-warning animate-pulse" }),
      "Taslak"
    ] })
  ] });
}
function Mr({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: n,
  onDragEnd: i,
  onReorderTo: o,
  onReorderDrop: l,
  pickerEntries: x = [],
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
        s.map((f) => {
          const p = t === f.code, m = b[f.code] || 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              draggable: !0,
              title: "Sürükleyerek sırayı değiştirin",
              ...va(() => a(f.code)),
              onDragStart: (c) => {
                n(f.code);
                try {
                  c.dataTransfer.effectAllowed = "move", c.dataTransfer.setData("text/plain", f.code);
                } catch {
                }
              },
              onDragOver: (c) => {
                c.preventDefault(), o(f.code);
              },
              onDrop: (c) => {
                c.preventDefault(), l == null || l();
              },
              onDragEnd: i,
              className: [
                "flex shrink-0 items-center gap-[11px] h-9 px-[11px] rounded-[9px]",
                "text-[12.5px] text-left cursor-grab active:cursor-grabbing",
                "transition-opacity duration-fast",
                p ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
                r === f.code ? "opacity-35" : "opacity-100"
              ].join(" "),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${f.icon} text-[12px] w-[15px] opacity-85` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: f.title }),
                m > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                  "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                  "rounded-full text-[10px] font-extrabold",
                  p ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
                ].join(" "), children: m })
              ]
            },
            f.code
          );
        }),
        /* @__PURE__ */ e.jsx(Tt, { entries: x, onPick: d, children: /* @__PURE__ */ e.jsxs(
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
          children: Ue(s)
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", title: typeof a == "string" ? a : void 0, children: a || "—" })
    ] })
  ] });
}
const ta = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "—";
function Rr({ task: t = {}, nameById: a }) {
  const s = (i, o) => {
    var l;
    return i || o && ((l = a == null ? void 0 : a.get) == null ? void 0 : l.call(a, o)) || null;
  }, r = s(t.creatorName, t.creatorId), n = t.lastModificationTime ? s(t.lastModifierName, t.lastModifierId) : null;
  return /* @__PURE__ */ e.jsx("aside", { className: "flex flex-col gap-3.5 min-w-0", children: /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsx(Fe, { label: "Oluşturan", value: r || "Bilinmiyor", avatarName: r }),
    /* @__PURE__ */ e.jsx(Fe, { label: "Oluşturma tarihi", value: ta(t.creationTime) }),
    /* @__PURE__ */ e.jsx(Fe, { label: "Güncelleyen", value: n || "—", avatarName: n }),
    /* @__PURE__ */ e.jsx(Fe, { label: "Son güncelleme", value: ta(t.lastModificationTime) }),
    /* @__PURE__ */ e.jsx(Fe, { label: "Görev tipi", value: t.taskType }),
    /* @__PURE__ */ e.jsx(Fe, { label: "Sprint", value: t.sprint })
  ] }) });
}
const aa = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
function mt({ name: t, size: a = 32 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Oe(t), fontSize: a * 0.34 },
      children: Ue(t)
    }
  );
}
function sa({ open: t, onClick: a }) {
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
const ra = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function Gr({
  task: t = {},
  onFieldChange: a = () => {
  },
  descriptionValue: s,
  checklist: r,
  currentUserName: n = "Ben"
}) {
  const i = t == null ? void 0 : t.id, o = se(), [l, x] = y.useState(!0), [d, b] = y.useState(""), f = (r == null ? void 0 : r.items) ?? [], p = f.filter((N) => N.isDone).length, m = f.length ? Math.round(p / f.length * 100) : 0, c = async () => {
    var v, $, A;
    const N = d.trim();
    if (!(!N || !i)) {
      b("");
      try {
        await r.addItem(N);
      } catch (L) {
        (A = ($ = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : $.error) == null || A.call($, (L == null ? void 0 : L.message) || "Madde eklenemedi.");
      }
    }
  }, [u, h] = y.useState(!0), [g, j] = y.useState(""), [C, S] = y.useState(!1), [T, E] = y.useState(!1), [I, B] = y.useState(null), [Y, R] = y.useState(""), [G, O] = y.useState({}), { data: Q = [] } = te({
    queryKey: ["task-comments", i],
    queryFn: () => {
      var N, v, $, A;
      return Promise.resolve((A = ($ = (v = (N = window == null ? void 0 : window.apya) == null ? void 0 : N.platform) == null ? void 0 : v.tasks) == null ? void 0 : $.task) == null ? void 0 : A.getComments(i));
    },
    enabled: !!i,
    staleTime: 1e4
  }), V = async () => {
    await o.invalidateQueries({ queryKey: ["task-comments", i] }), await o.invalidateQueries({ queryKey: ["task-detail", i] });
  }, J = async () => {
    var v, $, A;
    const N = g.trim();
    if (!(!N || !i || T)) {
      E(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.addComment(i, N)), await V(), j("");
      } catch (L) {
        (A = ($ = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : $.error) == null || A.call($, (L == null ? void 0 : L.message) || "Yorum gönderilemedi.");
      } finally {
        E(!1);
      }
    }
  }, W = async (N) => {
    var $, A, L;
    const v = Y.trim();
    if (!(!v || !i))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.replyToComment(N, v)), await V(), R(""), B(null);
      } catch (ie) {
        (L = (A = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : A.error) == null || L.call(A, (ie == null ? void 0 : ie.message) || "Yanıt gönderilemedi.");
      }
  }, re = (N) => O((v) => {
    const $ = v[N] ?? { liked: !1, count: 0 };
    return { ...v, [N]: { liked: !$.liked, count: $.count + ($.liked ? -1 : 1) } };
  }), w = !!g.trim() && !T;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-[9px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Açıklama" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Zengin metin · WYSIWYG" })
      ] }),
      /* @__PURE__ */ e.jsx(
        ya,
        {
          value: s ?? t.description ?? "",
          onChange: (N) => a("description", N),
          mentionName: n
        },
        i
      )
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: aa, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
            p,
            "/",
            f.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(sa, { open: l, onClick: () => x((N) => !N) })
      ] }),
      l && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 mt-3.5", children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
            style: { width: `${m}%` }
          }
        ) }),
        f.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              "aria-label": N.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
              onClick: () => r.toggleItem(N.id).catch((v) => {
                var $, A, L;
                return (L = (A = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : A.error) == null ? void 0 : L.call(A, (v == null ? void 0 : v.message) || "Durum güncellenemedi.");
              }),
              className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white cursor-pointer transition-colors duration-fast ${N.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
              children: N.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${N.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: N.text }),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              onClick: () => r.removeItem(N.id).catch((v) => {
                var $, A, L;
                return (L = (A = ($ = window == null ? void 0 : window.abp) == null ? void 0 : $.notify) == null ? void 0 : A.error) == null ? void 0 : L.call(A, (v == null ? void 0 : v.message) || "Madde silinemedi.");
              }),
              className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
            }
          )
        ] }, N.id)),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            value: d,
            onChange: (N) => b(N.target.value),
            onKeyDown: (N) => {
              N.key === "Enter" && c();
            },
            placeholder: "Yeni madde yaz ve Enter'a bas…",
            className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: aa, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Yorumlar & güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: Q.length })
        ] }),
        /* @__PURE__ */ e.jsx(sa, { open: u, onClick: () => h((N) => !N) })
      ] }),
      u && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(mt, { name: n }),
          /* @__PURE__ */ e.jsxs("div", { className: `flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${C ? "border-focus bg-surface-base shadow-focus" : "border-default bg-surface-raised"}`, children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                rows: 2,
                value: g,
                onChange: (N) => j(N.target.value),
                onFocus: () => S(!0),
                onBlur: () => S(!1),
                onKeyDown: (N) => {
                  N.key === "Enter" && (N.ctrlKey || N.metaKey) && (N.preventDefault(), J());
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
                  onClick: () => j((v) => v + N.add),
                  className: "flex items-center justify-center h-7 w-7 rounded-[7px] text-text-tertiary hover:bg-surface-hover hover:text-primary cursor-pointer",
                  children: /* @__PURE__ */ e.jsx("i", { className: `${N.icon} text-[12px]` })
                },
                N.title
              )) }),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: J,
                  disabled: !w,
                  className: `flex items-center gap-[7px] h-[30px] px-3.5 rounded-[9px] text-[12px] font-bold shadow-xs ${w ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${T ? "fa-circle-notch fa-spin" : "fa-paper-plane"} text-[10px]` }),
                    "Gönder"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1", children: Q.map((N) => {
          const v = G[N.id] ?? { liked: !1, count: 0 };
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start py-3 border-t border-subtle", children: [
            /* @__PURE__ */ e.jsx(mt, { name: N.authorName }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: N.authorName }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: ra(N.creationTime) })
              ] }),
              /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[13px] leading-[1.65] text-text-secondary whitespace-pre-wrap", children: N.text }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 mt-[3px]", children: [
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => re(N.id),
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
                      B(($) => $ === N.id ? null : N.id), R("");
                    },
                    className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-full text-text-tertiary text-[11px] font-semibold hover:bg-surface-hover hover:text-primary cursor-pointer",
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                      "Yanıtla"
                    ]
                  }
                )
              ] }),
              I === N.id && /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 mt-2 animate-fade-in-fast", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: Y,
                    onChange: ($) => R($.target.value),
                    onKeyDown: ($) => {
                      $.key === "Enter" && W(N.id);
                    },
                    placeholder: `@${N.authorName} kullanıcısına yanıt ver…`,
                    className: "flex-1 h-8 px-3 rounded-[9px] border border-focus bg-surface-base text-text-primary text-[12px] shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => W(N.id),
                    className: "h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover",
                    children: "Yanıtla"
                  }
                )
              ] }),
              (N.replies ?? []).map(($) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] mt-2.5 pl-3 border-l-2 border-default", children: [
                /* @__PURE__ */ e.jsx(mt, { name: $.authorName, size: 24 }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: $.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: ra($.creationTime) })
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
function qr({
  lastSavedAt: t,
  isDirty: a,
  isSaving: s,
  justSaved: r,
  onCancel: n,
  onSave: i
}) {
  const o = t ? new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(t)) : "—", l = s ? "fa-solid fa-circle-notch fa-spin" : r ? "fa-solid fa-check" : "fa-regular fa-floppy-disk", x = s ? "Kaydediliyor…" : r ? "Kaydedildi" : "Kaydet", d = a && !s;
  return /* @__PURE__ */ e.jsxs("footer", { className: "shrink-0 flex items-center justify-between gap-4 px-6 lt-860:px-4 py-3.5 border-t border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5 min-w-0 lt-560:hidden", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] text-[11.5px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock text-[11px]" }),
        "Son kayıt: ",
        /* @__PURE__ */ e.jsx("strong", { className: "font-semibold text-text-secondary", children: o })
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
          onClick: n,
          className: "h-9 px-4 rounded-[10px] border border-default bg-surface-base text-text-secondary text-[13px] font-semibold hover:bg-surface-hover hover:text-text-primary cursor-pointer",
          children: "Vazgeç"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: i,
          disabled: !d,
          className: `flex items-center gap-2 h-9 px-[22px] rounded-[10px] text-white text-[13px] font-bold shadow-sm ${d ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `${l} text-[11px]` }),
            x
          ]
        }
      )
    ] })
  ] });
}
const Yr = Object.fromEntries(Ve.map((t) => [t.code, t])), _r = {
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
}, Ur = /* @__PURE__ */ new Set([
  "risks",
  "dashboard",
  "comments",
  "emails",
  "custom-fields",
  "approvals",
  "ai",
  "automations"
]), Or = (t) => Ur.has(t);
function Vr(t) {
  const a = Yr[t], s = _r[t];
  return a ? {
    code: t,
    title: a.title,
    icon: a.icon,
    desc: (s == null ? void 0 : s.desc) ?? "",
    bg: (s == null ? void 0 : s.bg) ?? "bg-neutral-subtle",
    fg: (s == null ? void 0 : s.fg) ?? "text-text-secondary"
  } : null;
}
Ve.filter((t) => !t.hidden).length;
function na({ code: t, onRemoveFeature: a, pickerEntries: s = [], onPickFeature: r, canRemove: n = !0 }) {
  const i = Vr(t) ?? { title: t, desc: "", icon: "fa-cube", bg: "bg-neutral-subtle", fg: "text-text-secondary" };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-3 py-14 px-6 rounded-2xl border border-dashed border-strong bg-surface-base text-center", children: [
    /* @__PURE__ */ e.jsx("span", { className: `flex items-center justify-center h-14 w-14 rounded-2xl ${i.bg} ${i.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${i.icon} text-[22px]` }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-w-[420px]", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: i.title }),
      i.desc && /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] leading-[1.6] text-text-secondary", children: i.desc }),
      /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-center gap-[7px] mt-1.5 text-[11.5px] font-semibold text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-person-digging text-[11px]" }),
        "Bu sekme yapım aşamasında."
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 mt-1.5", children: [
      n && /* @__PURE__ */ e.jsxs(
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
      /* @__PURE__ */ e.jsx(Tt, { entries: s, onPick: r, children: /* @__PURE__ */ e.jsxs(
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
function Ma({ open: t, onClose: a, label: s, children: r }) {
  return /* @__PURE__ */ e.jsx(
    es,
    {
      open: t,
      onOpenChange: (n) => {
        n || a == null || a();
      },
      children: /* @__PURE__ */ e.jsxs(ts, { children: [
        /* @__PURE__ */ e.jsx(as, { className: "fixed inset-0", style: { pointerEvents: "none" } }),
        /* @__PURE__ */ e.jsx(ss, { asChild: !0, "aria-describedby": void 0, children: /* @__PURE__ */ e.jsxs("div", { className: "fixed inset-0 z-modal", children: [
          /* @__PURE__ */ e.jsx(rs, { className: "sr-only", children: s }),
          r
        ] }) })
      ] })
    }
  );
}
const Hr = [
  { key: "subtasks", label: "Alt görevler", countKey: "subtasks", unit: "alt görev" },
  { key: "checklist", label: "Kontrol listesi", countKey: "checklist", unit: "madde" },
  { key: "comments", label: "Yorumlar", countKey: "comments", unit: "yorum" },
  { key: "files", label: "Dosyalar", countKey: "files", unit: "dosya" },
  { key: "keepAssignee", label: "Sorumluyu koru", desc: "Aksi halde atanmamış gelir" },
  { key: "keepLinks", label: "Bağımlılıkları koru", desc: "Öncül / ardıl bağlantılar" },
  { key: "shiftDates", label: "Tarihleri bugüne kaydır", desc: "Başlangıç ve son tarih ötelenir" }
], ia = {
  subtasks: !0,
  checklist: !0,
  comments: !1,
  files: !0,
  keepAssignee: !0,
  keepLinks: !0,
  shiftDates: !1
};
function Qr({ on: t, onClick: a, label: s }) {
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
function Jr({
  open: t,
  mode: a = "move",
  onClose: s,
  onConfirm: r,
  projectOptions: n = [],
  currentProjectId: i,
  counts: o = {},
  onCreateProject: l
}) {
  const [x, d] = y.useState(a), [b, f] = y.useState([]), [p, m] = y.useState(""), [c, u] = y.useState(""), [h, g] = y.useState(ia), [j, C] = y.useState(!1);
  y.useEffect(() => {
    t && (d(a), f([]), m(""), u(""), g(ia));
  }, [t, a]);
  const S = y.useMemo(
    () => n.filter((w) => w.value && w.value !== i),
    [n, i]
  ), T = S.filter((w) => !p || w.label.toLowerCase().includes(p.toLowerCase())), E = S.length > 0 && b.length === S.length;
  if (!t) return null;
  const I = (w) => f((N) => N.includes(w) ? N.filter((v) => v !== w) : [...N, w]), B = (w) => {
    var N;
    return ((N = n.find((v) => v.value === w)) == null ? void 0 : N.label) ?? "";
  }, Y = async () => {
    var N, v, $;
    const w = c.trim();
    if (!(!w || j)) {
      C(!0);
      try {
        const A = await (l == null ? void 0 : l(w));
        A && f((L) => [...L, A]), u("");
      } catch (A) {
        ($ = (v = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : v.error) == null || $.call(v, (A == null ? void 0 : A.message) || "Proje oluşturulamadı.");
      } finally {
        C(!1);
      }
    }
  }, R = async () => {
    if (!(!b.length || j)) {
      C(!0);
      try {
        await (r == null ? void 0 : r({ mode: x, targetProjectIds: b, include: h }));
      } finally {
        C(!1);
      }
    }
  }, G = x === "move", O = b.length, Q = G ? O > 1 ? "Taşı ve kopyala" : "Taşı" : O > 1 ? `${O} projeye kopyala` : "Kopyala", V = Object.values(h).filter(Boolean).length, J = b.map(B).filter(Boolean), W = J.length ? `${J.length > 2 ? `${J.slice(0, 2).join(", ")} +${J.length - 2}` : J.join(", ")} · ${V} seçenek açık` : `Proje seçilmedi · ${V} seçenek açık`, re = (w) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${w ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return /* @__PURE__ */ e.jsx(Ma, { open: t, onClose: s, label: G ? "Başka projeye taşı" : "Başka projelere kopyala", children: /* @__PURE__ */ e.jsx(
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
          "aria-label": G ? "Başka projeye taşı" : "Başka projelere kopyala",
          onClick: (w) => w.stopPropagation(),
          className: "flex flex-col w-full max-w-[760px] max-h-[88vh] rounded-[20px] border border-default bg-surface-base shadow-xl overflow-hidden animate-dialog-in",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-4 px-[22px] pt-5 pb-4 border-b border-subtle", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-10 w-10 rounded-[13px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-tree text-base" }) }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsx("h3", { className: "m-0 text-base font-extrabold tracking-[-.02em] text-text-primary", children: G ? "Başka projeye taşı" : "Başka projelere kopyala" }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 mb-0 text-[12px] leading-[1.5] text-text-tertiary", children: G ? "Görev ilk seçtiğiniz projeye taşınır; birden fazla seçerseniz kalanlara kopya oluşturulur." : "Görevin kopyası seçtiğiniz her projede oluşturulur; bu görev yerinde kalır." })
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
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => d("move"), className: re(G), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[10px]" }),
                "Taşı"
              ] }),
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => d("copy"), className: re(!G), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clone text-[10px]" }),
                "Kopyala"
              ] })
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 grid grid-cols-2 lt-860:grid-cols-1 gap-5 items-start px-[22px] pt-4 pb-5 overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px] min-w-0", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5", children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.08em] text-text-tertiary", children: [
                    "Hedef projeler · ",
                    O
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => f(E ? [] : S.map((w) => w.value)),
                      className: "p-0 border-0 bg-transparent text-primary text-[11px] font-bold cursor-pointer hover:underline",
                      children: E ? "Seçimi temizle" : "Tümünü seç"
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
                      onChange: (w) => m(w.target.value),
                      placeholder: "Proje ara…",
                      className: "w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar", children: [
                  T.map((w) => {
                    const N = b.includes(w.value), v = G && b[0] === w.value;
                    return /* @__PURE__ */ e.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => I(w.value),
                        className: `flex items-center gap-[11px] px-3 py-[11px] rounded-[11px] border text-left cursor-pointer hover:border-focus ${N ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                        children: [
                          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] rounded-[5px] border-[1.5px] text-white ${N ? "bg-primary border-primary" : "bg-transparent border-strong"}`, children: N && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" }) }),
                          /* @__PURE__ */ e.jsx("span", { className: "h-2.5 w-2.5 shrink-0 rounded-[3px] bg-primary" }),
                          /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: w.label }),
                          v && /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center h-5 px-2 rounded-md bg-primary text-white text-[10px] font-extrabold", children: "TAŞINACAK" })
                        ]
                      },
                      w.value
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
                      onChange: (w) => u(w.target.value),
                      onKeyDown: (w) => {
                        w.key === "Enter" && (w.preventDefault(), Y());
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
                      disabled: !c.trim() || j,
                      className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-plus text-[12px]" })
                    }
                  )
                ] }),
                G && O > 1 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle", children: [
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
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: Hr.map((w) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-px", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary", children: w.label }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: w.countKey ? `${o[w.countKey] ?? 0} ${w.unit}` : w.desc })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    Qr,
                    {
                      on: h[w.key],
                      label: w.label,
                      onClick: () => g((N) => ({ ...N, [w.key]: !N[w.key] }))
                    }
                  )
                ] }, w.key)) })
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
                    onClick: R,
                    disabled: !O || j,
                    className: `flex items-center gap-2 h-9 px-5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${O && !j ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${j ? "fa-circle-notch fa-spin" : "fa-arrow-right"} text-[10px]` }),
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
const Wr = [
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
function Zr(t = "") {
  var s;
  const a = (s = t.split(".").pop()) == null ? void 0 : s.toLowerCase();
  return a === "pdf" ? Re.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(a) ? Re.img : ["doc", "docx", "odt", "rtf"].includes(a) ? Re.doc : ["json", "js", "ts", "cs", "xml", "yml", "yaml"].includes(a) ? Re.code : Re.other;
}
const Xr = (t) => t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : "—", en = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—", tn = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—";
function ft({ name: t, size: a = 22 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold",
      style: { height: a, width: a, background: Oe(t), fontSize: a * 0.4 },
      children: Ue(t)
    }
  );
}
function We({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: t }),
    a
  ] });
}
function an({
  subtaskId: t,
  parentCode: a,
  onClose: s,
  onOpenFull: r,
  onDeleted: n,
  currentUserName: i = "Ben"
}) {
  var A, L, ie;
  const o = se(), { data: l } = wt(t), x = Dt(t), d = Ct(t), [b, f] = y.useState("general"), [p, m] = y.useState(""), [c, u] = y.useState(""), [h, g] = y.useState(""), j = y.useRef(null), C = y.useRef(null);
  l && C.current !== l.id && (C.current = l.id, m(l.description ?? ""));
  const { data: S = [] } = te({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var k, K, F, _;
      return Promise.resolve((_ = (F = (K = (k = window == null ? void 0 : window.apya) == null ? void 0 : k.platform) == null ? void 0 : K.tasks) == null ? void 0 : F.task) == null ? void 0 : _.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4
  });
  if (y.useEffect(() => {
    const k = (K) => {
      K.key === "Escape" && (K.stopPropagation(), s == null || s());
    };
    return window.addEventListener("keydown", k), () => window.removeEventListener("keydown", k);
  }, [s]), !l) return null;
  const T = (ie = (L = (A = window == null ? void 0 : window.apya) == null ? void 0 : A.platform) == null ? void 0 : L.tasks) == null ? void 0 : ie.task, E = be(l.status), I = nt(l.priority), B = x.items ?? [], Y = B.filter((k) => k.isDone).length, R = B.length ? Math.round(Y / B.length * 100) : 0, G = d.attachments ?? [], O = { checklist: B.length, comments: S.length, files: G.length }, Q = async () => {
    await o.invalidateQueries({ queryKey: ["task-detail", t] });
  }, V = async (k) => {
    var K, F, _;
    try {
      await Promise.resolve(T.update(l.id, {
        title: l.title,
        description: l.description ?? null,
        startDate: (l.startDate ?? "").slice(0, 10),
        dueDate: l.dueDate ? l.dueDate.slice(0, 10) : null,
        status: l.status,
        priority: l.priority,
        assigneeId: l.assigneeId ?? null,
        boardColumnId: l.boardColumnId ?? null,
        projectId: l.projectId ?? null,
        parentTaskId: l.parentTaskId ?? null,
        isPrivate: !!l.isPrivate,
        predecessorIds: l.predecessorIds ?? [],
        tagNames: (l.tags ?? []).map((H) => H.name),
        estimatedHours: l.estimatedHours ?? null,
        taskType: l.taskType ?? null,
        sprint: l.sprint ?? null,
        ...k
      })), await Q();
    } catch (H) {
      (_ = (F = (K = window == null ? void 0 : window.abp) == null ? void 0 : K.notify) == null ? void 0 : F.error) == null || _.call(F, (H == null ? void 0 : H.message) || "Alt görev güncellenemedi.");
    }
  }, J = () => V({ status: l.status >= 4 ? 1 : l.status + 1 }), W = () => V({ priority: l.priority >= 4 ? 1 : l.priority + 1 }), re = () => {
    (l.description ?? "") !== p && V({ description: p || null });
  }, w = async () => {
    var K, F, _;
    const k = c.trim();
    if (k) {
      u("");
      try {
        await x.addItem(k);
      } catch (H) {
        (_ = (F = (K = window == null ? void 0 : window.abp) == null ? void 0 : K.notify) == null ? void 0 : F.error) == null || _.call(F, (H == null ? void 0 : H.message) || "Madde eklenemedi.");
      }
    }
  }, N = async () => {
    var K, F, _;
    const k = h.trim();
    if (k) {
      g("");
      try {
        await Promise.resolve(T.addComment(l.id, k)), await o.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch (H) {
        (_ = (F = (K = window == null ? void 0 : window.abp) == null ? void 0 : K.notify) == null ? void 0 : F.error) == null || _.call(F, (H == null ? void 0 : H.message) || "Yorum gönderilemedi.");
      }
    }
  }, v = async () => {
    var k, K, F;
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(T.delete(l.id)), n == null || n(l.id), s == null || s();
      } catch (_) {
        (F = (K = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : K.error) == null || F.call(K, (_ == null ? void 0 : _.message) || "Alt görev silinemedi.");
      }
  }, $ = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
  return /* @__PURE__ */ e.jsxs(Ma, { open: !0, onClose: s, label: `${l.code} alt görev detayı`, children: [
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
                    className: `${$} hover:bg-surface-hover hover:text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-up-right-from-square text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Alt görevi sil",
                    onClick: v,
                    className: `${$} hover:bg-negative-subtle hover:text-negative`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Kapat",
                    onClick: s,
                    className: `${$} hover:bg-surface-hover hover:text-text-primary`,
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
                  onClick: J,
                  title: "Durumu değiştir",
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold cursor-pointer ${E.bg} ${E.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${E.icon} text-[10px]` }),
                    E.label
                  ]
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: W,
                  title: "Önceliği değiştir",
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold cursor-pointer ${I.bg} ${I.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${I.icon} text-[10px]` }),
                    I.label
                  ]
                }
              ),
              (l.tags ?? []).map((k) => /* @__PURE__ */ e.jsx("span", { className: "flex items-center h-6 px-[9px] rounded-[7px] border border-default bg-neutral-subtle text-text-secondary text-[11px] font-semibold", children: k.name }, k.id ?? k.name))
            ] }),
            /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[18px] font-extrabold tracking-[-.02em] leading-[1.3] text-text-primary", children: l.title }),
            /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 pt-1", children: [
              /* @__PURE__ */ e.jsx(We, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
                /* @__PURE__ */ e.jsx(ft, { name: l.assigneeName }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", children: l.assigneeName || "Atanmamış" })
              ] }) }),
              /* @__PURE__ */ e.jsx(We, { label: "Son tarih", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] h-[22px] text-[12.5px] font-semibold text-text-primary", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[11px] text-text-tertiary" }),
                tn(l.dueDate)
              ] }) }),
              /* @__PURE__ */ e.jsx(We, { label: "Süre", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-[22px] font-mono text-[12.5px] font-bold text-text-primary", children: [
                l.spentHours ?? 0,
                "s",
                /* @__PURE__ */ e.jsxs("span", { className: "font-medium text-text-tertiary", children: [
                  " / ",
                  l.estimatedHours != null ? `${l.estimatedHours}s` : "—"
                ] })
              ] }) }),
              /* @__PURE__ */ e.jsx(We, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-1.5 pt-[3px]", children: [
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
                  "%",
                  R
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: "block h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("span", { className: "block h-full rounded-full bg-success", style: { width: `${R}%` } }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: Wr.map((k) => {
            const K = b === k.code, F = O[k.code] ?? 0;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => f(k.code),
                className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${K ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${k.icon} text-[11px] opacity-85` }),
                  /* @__PURE__ */ e.jsx("span", { children: k.title }),
                  F > 0 && /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-neutral-subtle text-text-tertiary text-[10px] font-extrabold", children: F })
                ]
              },
              k.code
            );
          }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar px-5 py-[18px] bg-surface-raised", children: [
            b === "general" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Açıklama" }),
              /* @__PURE__ */ e.jsx(
                "textarea",
                {
                  rows: 7,
                  value: p,
                  onChange: (k) => m(k.target.value),
                  onBlur: re,
                  placeholder: "Bu alt görevin detayları…",
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
                  Y,
                  "/",
                  B.length
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-success", style: { width: `${R}%` } }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px] mt-1", children: [
                B.map((k) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] border border-subtle bg-surface-base hover:border-default", children: [
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Tamamlandı işaretle",
                      onClick: () => x.toggleItem(k.id),
                      className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white cursor-pointer ${k.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
                      children: k.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[12.5px] font-semibold ${k.isDone ? "line-through text-text-tertiary" : "text-text-primary"}`, children: k.text }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Maddeyi sil",
                      onClick: () => x.removeItem(k.id),
                      className: "flex shrink-0 items-center justify-center h-6 w-6 rounded-md text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[10px]" })
                    }
                  )
                ] }, k.id)),
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "text",
                    value: c,
                    onChange: (k) => u(k.target.value),
                    onKeyDown: (k) => {
                      k.key === "Enter" && w();
                    },
                    placeholder: "Yeni madde yaz ve Enter'a bas…",
                    className: "h-9 mt-1 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                )
              ] })
            ] }),
            b === "comments" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] items-start", children: [
                /* @__PURE__ */ e.jsx(ft, { name: i, size: 30 }),
                /* @__PURE__ */ e.jsx(
                  "textarea",
                  {
                    rows: 2,
                    value: h,
                    onChange: (k) => g(k.target.value),
                    onKeyDown: (k) => {
                      k.key === "Enter" && !k.shiftKey && (k.preventDefault(), N());
                    },
                    placeholder: "Yorum yaz ve Enter'a bas…",
                    className: "flex-1 min-w-0 px-3 py-2.5 rounded-[11px] border border-default bg-surface-base text-text-primary text-[12.5px] leading-[1.6] resize-none focus:border-focus focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: N,
                    "aria-label": "Yorumu gönder",
                    className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] ${h.trim() ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paper-plane text-[11px]" })
                  }
                )
              ] }),
              S.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-[7px] py-7 rounded-xl border border-dashed border-default", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-comments text-xl text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Henüz yorum yok" })
              ] }) : S.map((k) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 items-start p-3 rounded-xl border border-subtle bg-surface-base", children: [
                /* @__PURE__ */ e.jsx(ft, { name: k.authorName, size: 28 }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: k.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: en(k.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: k.text })
                ] })
              ] }, k.id))
            ] }),
            b === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  ref: j,
                  type: "file",
                  className: "hidden",
                  onChange: (k) => {
                    var F;
                    const K = (F = k.target.files) == null ? void 0 : F[0];
                    k.target.value = "", K && d.upload(K).catch((_) => {
                      var H, oe, z;
                      return (z = (oe = (H = window == null ? void 0 : window.abp) == null ? void 0 : H.notify) == null ? void 0 : oe.error) == null ? void 0 : z.call(oe, (_ == null ? void 0 : _.message) || "Dosya yüklenemedi.");
                    });
                  }
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    var k;
                    return (k = j.current) == null ? void 0 : k.click();
                  },
                  disabled: d.isUploading,
                  className: "flex flex-col items-center justify-center gap-[7px] p-6 rounded-[13px] border-2 border-dashed border-strong bg-surface-base cursor-pointer hover:border-focus hover:bg-primary-subtle disabled:opacity-60",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.isUploading ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-xl text-text-tertiary` }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: d.isUploading ? "Yükleniyor…" : "Dosya ekle" })
                  ]
                }
              ),
              G.map((k) => {
                const K = Zr(k.fileName);
                return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${K.bg} ${K.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${K.icon} text-[13px]` }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: k.fileName }),
                    /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                      Xr(k.fileSize),
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
                      onClick: () => d.remove(k.id).catch((F) => {
                        var _, H, oe;
                        return (oe = (H = (_ = window == null ? void 0 : window.abp) == null ? void 0 : _.notify) == null ? void 0 : H.error) == null ? void 0 : oe.call(H, (F == null ? void 0 : F.message) || "Dosya silinemedi.");
                      }),
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
const Ra = "apya.taskDetail.tabOrder", sn = "taskdetail";
function la() {
  try {
    const t = localStorage.getItem(Ra);
    if (!t) return [];
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.filter((s) => typeof s == "string") : [];
  } catch {
    return [];
  }
}
function rn(t) {
  try {
    localStorage.setItem(Ra, JSON.stringify(t));
  } catch {
  }
}
function oa() {
  const t = document.querySelector("[data-tab-order]"), a = t == null ? void 0 : t.getAttribute("data-tab-order");
  if (!a) return null;
  try {
    const s = JSON.parse(a);
    return Array.isArray(s) ? s.map((r) => r == null ? void 0 : r.kind).filter((r) => typeof r == "string") : null;
  } catch {
    return null;
  }
}
function ca(t) {
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
        scope: sn,
        tabs: t.map((s) => ({ kind: s, ref: "", title: "" }))
      })
    }).catch(() => {
    });
  } catch {
  }
}
function nn(t) {
  const [a, s] = y.useState(() => oa() ?? la()), [r, n] = y.useState(null);
  y.useEffect(() => {
    if (oa() === null) {
      const d = la();
      d.length && ca(d);
    }
  }, []);
  const i = y.useMemo(() => {
    const d = new Map(t.map((f) => [f.code, f])), b = [];
    for (const f of a) {
      const p = d.get(f);
      p && (b.push(p), d.delete(f));
    }
    for (const f of t)
      d.has(f.code) && b.push(f);
    return b;
  }, [t, a]), o = y.useCallback((d) => {
    s((b) => {
      const f = r;
      if (!f || f === d) return b;
      const p = b.length ? b.slice() : i.map((u) => u.code), m = p.indexOf(f), c = p.indexOf(d);
      return m === -1 || c === -1 ? b : (p.splice(m, 1), p.splice(c, 0, f), p);
    });
  }, [r, i]), l = y.useCallback((d) => n(d), []), x = y.useCallback(() => {
    n(null), s((d) => {
      const b = d.length ? d : i.map((f) => f.code);
      return rn(b), ca(b), b;
    });
  }, [i]);
  return { orderedTabs: i, draggingCode: r, handleDragStart: l, handleDragEnd: x, reorderTo: o };
}
function ln() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function on() {
  const t = te({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: ln,
    staleTime: 3e5,
    retry: !1
  }), a = t.data ?? [], s = a.map((n) => ({ value: n.id, label: n.name })), r = new Map(a.map((n) => [n.id, n.name]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
const da = "apya.taskDetail.fullscreen", Z = {
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
function cn(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function Ga({ taskId: t, presentation: a = "modal", onClose: s, switchToTask: r }) {
  var Et, At, Bt, Ft, zt, It, Lt, Kt;
  const [n, i] = y.useState(t), { data: o, isPending: l, isError: x, refetch: d } = wt(n), b = se(), f = ja(), p = Ca(o), m = Da(), c = on(), u = Ta(n), h = Dt(n), [g, j] = y.useState("general"), [C, S] = y.useState(!1), [T, E] = y.useState(!1), [I, B] = y.useState(null), [Y, R] = y.useState(null), [G, O] = y.useState(!1), [Q, V] = y.useState(!1), [J, W] = y.useState(() => {
    try {
      return localStorage.getItem(da) === "true";
    } catch {
      return !1;
    }
  });
  ka(n);
  const [re, w] = y.useState(null);
  o != null && o.id && o.id !== re && (w(o.id), O(!!o.isFavorite), V(!!o.isWatched)), y.useEffect(() => {
    p.isDirty ? f.markDirty() : f.markClean();
  });
  const N = y.useCallback(() => {
    wa(), s == null || s();
  }, [s]), v = y.useCallback(() => f.requestClose(N), [f, N]), $ = y.useCallback(() => {
    W((D) => {
      const P = !D;
      try {
        localStorage.setItem(da, String(P));
      } catch {
      }
      return P;
    });
  }, []), A = y.useMemo(
    () => za(u.assignedCodes),
    [u.assignedCodes]
  ), L = nn(A), ie = y.useMemo(
    () => Ia(u.assignedCodes),
    [u.assignedCodes]
  ), k = (D, P) => {
    if (P) {
      j(D);
      return;
    }
    _a(D);
  }, K = y.useMemo(() => {
    var D, P, q, ce, he;
    return {
      subtasks: ((D = o == null ? void 0 : o.subTasks) == null ? void 0 : D.length) ?? 0,
      files: ((P = o == null ? void 0 : o.attachments) == null ? void 0 : P.length) ?? 0,
      dependencies: ((q = o == null ? void 0 : o.predecessorIds) == null ? void 0 : q.length) ?? 0,
      comments: ((ce = o == null ? void 0 : o.comments) == null ? void 0 : ce.length) ?? 0,
      checklist: ((he = h.items) == null ? void 0 : he.length) ?? 0
    };
  }, [o, h.items]), F = Ve.find((D) => D.code === g), _ = h.items ?? [], H = _.filter((D) => D.isDone).length, oe = _.length ? Math.round(H / _.length * 100) : 0, z = y.useCallback(async () => {
    if (!p.validate())
      return Z.err("Zorunlu alanları kontrol edin."), !1;
    S(!0);
    try {
      return await Promise.resolve(window.apya.platform.tasks.task.update(n, p.toUpdateDto())), await b.invalidateQueries({ queryKey: ["task-detail", n] }), le.emitResult(), E(!0), setTimeout(() => E(!1), 2e3), Z.ok("Görev başarıyla güncellendi."), !0;
    } catch (D) {
      return Z.err((D == null ? void 0 : D.message) || "Kaydedilemedi."), !1;
    } finally {
      S(!1);
    }
  }, [n, p, b]);
  y.useEffect(() => {
    const D = (P) => {
      if ((P.ctrlKey || P.metaKey) && P.key.toLowerCase() === "s") {
        P.preventDefault(), p.isDirty && !C && z();
        return;
      }
      P.key === "Escape" && I && (P.stopPropagation(), B(null));
    };
    return window.addEventListener("keydown", D), () => window.removeEventListener("keydown", D);
  }, [z, p.isDirty, C, I]);
  const M = () => {
    var D, P, q;
    return (q = (P = (D = window == null ? void 0 : window.apya) == null ? void 0 : D.platform) == null ? void 0 : P.tasks) == null ? void 0 : q.task;
  }, U = async () => {
    var P;
    const D = !G;
    O(D);
    try {
      await Promise.resolve((P = M()) == null ? void 0 : P.toggleFavorite(n));
    } catch (q) {
      O(!D), Z.err((q == null ? void 0 : q.message) || "Favori güncellenemedi.");
    }
  }, ne = () => {
    if (!n) return;
    const D = document.createElement("a");
    D.href = `/Tasks/Detail/${n}?handler=Pdf`, D.rel = "noopener", document.body.appendChild(D), D.click(), D.remove();
  }, X = async () => {
    var P;
    const D = !Q;
    V(D);
    try {
      await Promise.resolve((P = M()) == null ? void 0 : P.toggleWatch(n)), Z.info(D ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (q) {
      V(!D), Z.err((q == null ? void 0 : q.message) || "Takip durumu güncellenemedi.");
    }
  }, Te = async () => {
    var D, P;
    try {
      const q = await Promise.resolve((D = M()) == null ? void 0 : D.transfer(n, {
        mode: 2,
        // Copy
        targetProjectIds: o != null && o.projectId ? [o.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await b.invalidateQueries({ queryKey: ["task-detail"] }), Z.ok("Görev çoğaltıldı.");
      const ce = (P = q == null ? void 0 : q.createdTaskIds) == null ? void 0 : P[0];
      ce && i(ce);
    } catch (q) {
      Z.err((q == null ? void 0 : q.message) || "Görev çoğaltılamadı.");
    }
  }, pe = async () => {
    var D;
    try {
      await Promise.resolve((D = M()) == null ? void 0 : D.updateStatus(n, 4)), await b.invalidateQueries({ queryKey: ["task-detail", n] }), Z.info("Görev arşivlendi (Tamamlandı).");
    } catch (P) {
      Z.err((P == null ? void 0 : P.message) || "Görev arşivlenemedi.");
    }
  }, Ya = async () => {
    var D;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?"))
      try {
        await Promise.resolve((D = M()) == null ? void 0 : D.delete(n)), Z.info("Görev silindi."), f.markClean(), N();
      } catch (P) {
        Z.err((P == null ? void 0 : P.message) || "Görev silinemedi.");
      }
  }, _a = async (D) => {
    try {
      await u.addFeature(D), j(D), Z.ok("Özellik başarıyla eklendi.");
    } catch (P) {
      Z.err((P == null ? void 0 : P.message) || "Özellik eklenemedi.");
    }
  }, St = async (D) => {
    try {
      await u.removeFeature(D), j("general"), Z.info("Özellik görevden kaldırıldı.");
    } catch (P) {
      Z.err((P == null ? void 0 : P.message) || "Özellik kaldırılamadı.");
    }
  }, Ua = async (D) => {
    var ce, he, xe, Ee, Se, He, Le;
    const P = ((Ee = (xe = (he = (ce = window == null ? void 0 : window.apya) == null ? void 0 : ce.platform) == null ? void 0 : he.application) == null ? void 0 : xe.projects) == null ? void 0 : Ee.project) ?? ((Le = (He = (Se = window == null ? void 0 : window.apya) == null ? void 0 : Se.platform) == null ? void 0 : He.projects) == null ? void 0 : Le.project);
    if (!(P != null && P.create)) throw new Error("Proje servisi yüklenmedi.");
    const q = await Promise.resolve(P.create({
      name: D,
      code: cn(D),
      currency: "TRY"
    }));
    return await b.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), Z.ok(`“${D}” projesi oluşturuldu.`), (q == null ? void 0 : q.id) ?? q;
  }, Oa = async ({ mode: D, targetProjectIds: P, include: q }) => {
    var ce, he;
    try {
      const xe = await Promise.resolve((ce = M()) == null ? void 0 : ce.transfer(n, {
        mode: D === "move" ? 1 : 2,
        targetProjectIds: P,
        include: q
      }));
      await b.invalidateQueries({ queryKey: ["task-detail", n] });
      const Ee = P.map((He) => {
        var Le;
        return (Le = c.options.find((Ha) => Ha.value === He)) == null ? void 0 : Le.label;
      }).filter(Boolean), Se = ((he = xe == null ? void 0 : xe.createdTaskIds) == null ? void 0 : he.length) ?? 0;
      Z.ok(D === "move" ? Se ? `“${Ee[0]}” projesine taşındı, ${Se} projeye kopyalandı.` : `Görev “${Ee[0]}” projesine taşındı.` : Se > 1 ? `${Se} projeye kopyalandı.` : `Kopya “${Ee[0]}” projesinde oluşturuldu.`), B(null);
    } catch (xe) {
      Z.err((xe == null ? void 0 : xe.message) || "Transfer tamamlanamadı.");
    }
  }, Va = g === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)] gap-5 items-start", children: [
    /* @__PURE__ */ e.jsx(
      Gr,
      {
        task: o,
        onFieldChange: p.setField,
        descriptionValue: p.values.description,
        checklist: h,
        currentUserName: ((At = (Et = window == null ? void 0 : window.abp) == null ? void 0 : Et.currentUser) == null ? void 0 : At.name) || ((Ft = (Bt = window == null ? void 0 : window.abp) == null ? void 0 : Bt.currentUser) == null ? void 0 : Ft.userName) || "Ben"
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5", children: /* @__PURE__ */ e.jsx(Rr, { task: o, nameById: m.nameById }) })
  ] }) : Or(g) ? /* @__PURE__ */ e.jsx(
    na,
    {
      code: g,
      onRemoveFeature: St,
      pickerEntries: ie,
      onPickFeature: k,
      canRemove: !(F != null && F.isCore)
    }
  ) : /* @__PURE__ */ e.jsx(y.Suspense, { fallback: /* @__PURE__ */ e.jsx(je, { className: "h-48 w-full" }), children: F != null && F.component ? /* @__PURE__ */ e.jsx(
    F.component,
    {
      taskId: n,
      task: o,
      form: p,
      nameById: m.nameById,
      onOpenSubtask: R
    }
  ) : /* @__PURE__ */ e.jsx(
    na,
    {
      code: g,
      onRemoveFeature: St,
      pickerEntries: ie,
      onPickFeature: k,
      canRemove: !(F != null && F.isCore)
    }
  ) }), $t = l ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(je, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(je, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(je, { className: "h-64 w-full" })
  ] }) : x ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(ee, { variant: "ghost", onClick: () => d(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col flex-1 min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      zr,
      {
        task: o,
        presentation: a,
        onClose: v,
        isFullscreen: J,
        onToggleFullscreen: $,
        onFieldChange: p.setField,
        statusValue: p.values.status,
        titleValue: o == null ? void 0 : o.title,
        isPrivateValue: p.values.isPrivate,
        isFavorite: G,
        onToggleFavorite: U,
        isWatched: Q,
        onToggleWatch: X,
        onDuplicate: Te,
        onArchive: pe,
        onDelete: Ya,
        onOpenTransfer: (D) => B({ mode: D }),
        onSaveAsTemplate: () => Z.info("Şablon olarak kaydetme yakında."),
        onConvertToSubtask: () => Z.info("Alt göreve dönüştürme yakında."),
        onExportPdf: ne
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        Ir,
        {
          task: o,
          assigneeOptions: m.options,
          projectOptions: c.options,
          onFieldChange: p.setField,
          statusValue: p.values.status,
          priorityValue: p.values.priority,
          assigneeValue: p.values.assigneeId,
          projectValue: p.values.projectId,
          dueDateValue: p.values.dueDate,
          startDateValue: p.values.startDate,
          tagsValue: p.values.tagNames,
          progressPercent: oe,
          progressNote: `${H}/${_.length} madde`,
          onOpenTransfer: (D) => B({ mode: D })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        a === "page" && /* @__PURE__ */ e.jsx(
          Mr,
          {
            activeTab: g,
            onTabChange: j,
            orderedTabs: L.orderedTabs,
            draggingCode: L.draggingCode,
            onDragStart: L.handleDragStart,
            onDragEnd: L.handleDragEnd,
            onReorderTo: L.reorderTo,
            onReorderDrop: () => Z.info("Sekme sırası güncellendi."),
            pickerEntries: ie,
            onPickFeature: k,
            counts: K
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: a === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            Kr,
            {
              activeTab: g,
              onTabChange: j,
              orderedTabs: L.orderedTabs,
              draggingCode: L.draggingCode,
              onDragStart: L.handleDragStart,
              onDragEnd: L.handleDragEnd,
              onReorderTo: L.reorderTo,
              onReorderDrop: () => Z.info("Sekme sırası güncellendi."),
              pickerEntries: ie,
              onPickFeature: k,
              counts: K,
              isDirty: p.isDirty
            }
          ) }),
          /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised", children: Va })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(
      qr,
      {
        lastSavedAt: o == null ? void 0 : o.lastModificationTime,
        isDirty: p.isDirty,
        isSaving: C,
        justSaved: T,
        onCancel: v,
        onSave: z
      }
    )
  ] }), Pt = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      Jr,
      {
        open: !!I,
        mode: (I == null ? void 0 : I.mode) ?? "move",
        onClose: () => B(null),
        onConfirm: Oa,
        projectOptions: c.options,
        currentProjectId: p.values.projectId,
        counts: K,
        onCreateProject: Ua
      }
    ),
    Y && /* @__PURE__ */ e.jsx(
      an,
      {
        subtaskId: Y,
        parentCode: o == null ? void 0 : o.code,
        onClose: () => R(null),
        onOpenFull: (D) => {
          R(null), (r ?? i)(D);
        },
        onDeleted: () => b.invalidateQueries({ queryKey: ["task-detail", n] }),
        currentUserName: ((It = (zt = window == null ? void 0 : window.abp) == null ? void 0 : zt.currentUser) == null ? void 0 : It.name) || ((Kt = (Lt = window == null ? void 0 : window.abp) == null ? void 0 : Lt.currentUser) == null ? void 0 : Kt.userName) || "Ben"
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col w-full min-h-[calc(100vh-54px)] border-y border-subtle bg-surface-base", children: $t }),
    Pt
  ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(ma, { open: !0, onOpenChange: (D) => {
      D || v();
    }, children: /* @__PURE__ */ e.jsx(
      fa,
      {
        title: o != null && o.title ? `Görev Detayı: ${o.title}` : "Görev Detayı",
        fullscreen: J,
        className: J ? "p-0 rounded-xl border border-default shadow-xl short:h-[100svh]" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl short:h-[100svh]",
        onInteractOutside: (D) => {
          var P, q;
          D.preventDefault(), !(I || Y) && ((q = (P = D.target) == null ? void 0 : P.closest) != null && q.call(P, "[data-apya-overlay]") || v());
        },
        onEscapeKeyDown: (D) => {
          if (I || Y) {
            D.preventDefault();
            return;
          }
          D.preventDefault(), v();
        },
        children: $t
      }
    ) }),
    Pt
  ] });
}
function dn() {
  var a;
  const t = y.useSyncExternalStore(
    le.subscribe,
    le.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(et, { children: /* @__PURE__ */ e.jsx(
    Ga,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        le.close(), le.emitResult();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(et, { children: /* @__PURE__ */ e.jsx(
    La,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        le.close(), le.emitResult();
      }
    },
    t
  ) }) : null;
}
function qa() {
  var s;
  try {
    const r = new URLSearchParams(window.location.search).get("taskui");
    if (r === "v1" || r === "v2" || r === "v3") return r;
  } catch {
  }
  const t = document.getElementById("task-detail-island"), a = (s = t == null ? void 0 : t.dataset) == null ? void 0 : s.taskui;
  return a === "v1" || a === "v2" ? a : "v3";
}
function xn() {
  return qa() === "v2";
}
function un() {
  return qa() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = un();
window.apya.taskDetailV2Enabled = xn() && !window.apya.taskDetailV3Enabled;
const xa = {
  open: (t) => {
    le.open(t);
  },
  close: () => le.close(),
  onResult: (t) => le.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(xa) : window.apya.taskDetail = xa;
function ua() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = pa(t), t._reactRoot.render(/* @__PURE__ */ e.jsx(dn, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = Na();
    a && le.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", ua) : ua();
function pn({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(et, { children: /* @__PURE__ */ e.jsx(
    Ga,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(et, { children: /* @__PURE__ */ e.jsx(
    La,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) });
}
const bt = document.getElementById("task-detail-page-island");
if (bt) {
  const t = bt.getAttribute("data-task-id");
  t && pa(bt).render(/* @__PURE__ */ e.jsx(pn, { taskId: t }));
}
