import { b as ce, j as e, r as l } from "./react-vendor-D57GAUXd.js";
import { H as F } from "./Hint-CNW95h3H.js";
/* empty css               */
const h = {
  money: (a) => new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a || 0) + " ₺",
  int: (a) => new Intl.NumberFormat("tr-TR").format(Math.round(a || 0))
}, g = (...a) => a.filter(Boolean).join(" "), Z = () => {
  var a, n, t;
  return (t = (n = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : n.customers) == null ? void 0 : t.customer;
}, xe = () => {
  var a, n, t;
  return (t = (n = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : n.invoices) == null ? void 0 : t.invoice;
}, me = () => {
  var a, n, t;
  return (t = (n = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : n.customerLedger) == null ? void 0 : t.customerLedger;
}, G = (a) => {
  var n, t;
  return (t = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.auth) == null ? void 0 : t.isGranted(a);
}, O = (a, n) => {
  var t, i, d;
  return (d = (i = (t = window == null ? void 0 : window.abp) == null ? void 0 : t.notify) == null ? void 0 : i[a]) == null ? void 0 : d.call(i, n);
}, I = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function S({ w: a = "100%", h: n = 14, r: t = 6 }) {
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      "aria-hidden": "true",
      className: "apya-skeleton",
      style: { width: a, height: n, borderRadius: t, flexShrink: 0 }
    }
  );
}
function M({ label: a, value: n, icon: t, tone: i = "muted", loading: d, index: c = 0, hint: s }) {
  const x = { success: "text-positive", danger: "text-negative", muted: "text-text-tertiary" }[i] ?? "";
  return d ? /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "rounded-xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)] p-4",
      style: { animationDelay: `${c * 50}ms` },
      children: [
        /* @__PURE__ */ e.jsx(S, { w: "55%", h: 11 }),
        /* @__PURE__ */ e.jsx(S, { w: "45%", h: 20, r: 4, style: { marginTop: 10 } })
      ]
    }
  ) : /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-fade-in rounded-xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)] p-4",
      style: { animationDelay: `${c * 50}ms` },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[var(--apya-text-tertiary)] text-xs font-medium", children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa ${t}`, "aria-hidden": "true" }),
          a,
          /* @__PURE__ */ e.jsx(F, { text: s })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: g("mt-2 text-xl font-bold font-tabular", x || "text-[var(--apya-text-primary)]"), children: n })
      ]
    }
  );
}
function pe({ label: a, count: n, active: t, onClick: i }) {
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: i,
      className: g(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
        t ? "bg-[var(--apya-accent-soft)] text-[var(--apya-accent-500)]" : "text-[var(--apya-text-tertiary)] hover:text-[var(--apya-text-secondary)]"
      ),
      children: [
        a,
        /* @__PURE__ */ e.jsx("span", { className: g(
          "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
          t ? "bg-[var(--apya-surface-base)] text-[var(--apya-accent-500)]" : "bg-[var(--apya-border-subtle)] text-[var(--apya-text-tertiary)]"
        ), children: n })
      ]
    }
  );
}
function Q({ name: a = "", size: n = 34 }) {
  const t = [
    ["#6366F1", "#818CF8"],
    ["#0EA5E9", "#38BDF8"],
    ["#F59E0B", "#FBBF24"],
    ["#10B981", "#34D399"],
    ["#EC4899", "#F472B6"],
    ["#8B5CF6", "#A78BFA"]
  ], i = (a.split(" ").filter(Boolean).slice(0, 2).map((x) => x[0]).join("") || "?").toUpperCase(), d = (i.charCodeAt(0) || 65) + (i.charCodeAt(1) || 66), [c, s] = t[d % t.length];
  return /* @__PURE__ */ e.jsx("div", { "aria-hidden": "true", style: {
    width: n,
    height: n,
    borderRadius: Math.max(8, n * 0.22),
    flexShrink: 0,
    background: `linear-gradient(135deg, ${c}, ${s})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: n * 0.36,
    fontWeight: 600,
    letterSpacing: 0.2
  }, children: i });
}
function ue({ active: a }) {
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold",
      style: {
        background: a ? "rgba(52,211,153,.12)" : "var(--apya-border-subtle)",
        color: a ? "var(--apya-positive-500)" : "var(--apya-text-tertiary)"
      },
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "w-1.5 h-1.5 rounded-full flex-shrink-0", style: { background: "currentColor" } }),
        a ? "Aktif" : "Pasif"
      ]
    }
  );
}
function fe({ page: a, pageCount: n, pageSize: t, total: i, rangeFrom: d, rangeTo: c, onPage: s, onPageSize: x }) {
  const m = ({ label: u, onClick: f, disabled: b, ariaLabel: v }) => /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      disabled: b,
      onClick: f,
      "aria-label": v,
      className: g(
        "min-w-[40px] h-[40px] px-2 rounded-md text-xs font-semibold flex items-center justify-center transition-colors",
        !b && "text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)]",
        b && "text-[var(--apya-text-disabled)] cursor-default opacity-40"
      ),
      children: u
    }
  );
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2 px-3 py-2.5 border-t border-[var(--apya-border-subtle)] mt-auto", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[11px] text-[var(--apya-text-tertiary)]", children: [
      /* @__PURE__ */ e.jsxs("span", { children: [
        /* @__PURE__ */ e.jsx("strong", { className: "text-[var(--apya-text-secondary)] font-semibold", children: h.int(i) }),
        " ",
        "kayıttan ",
        d,
        "–",
        c
      ] }),
      /* @__PURE__ */ e.jsx(
        "select",
        {
          value: t,
          onChange: (u) => x(Number(u.target.value)),
          "aria-label": "Sayfa boyutu",
          className: "h-6 px-1.5 rounded-md border border-[var(--apya-border-default)] bg-transparent text-[var(--apya-text-secondary)] text-[11px] font-semibold cursor-pointer outline-none",
          children: [10, 25, 50].map((u) => /* @__PURE__ */ e.jsx("option", { value: u, children: u }, u))
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ e.jsx(m, { ariaLabel: "Önceki sayfa", label: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left", style: { fontSize: 11 } }), disabled: a === 1, onClick: () => s(a - 1) }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-[var(--apya-text-tertiary)] px-1 font-tabular", children: [
        a,
        "/",
        n
      ] }),
      /* @__PURE__ */ e.jsx(m, { ariaLabel: "Sonraki sayfa", label: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right", style: { fontSize: 11 } }), disabled: a === n, onClick: () => s(a + 1) })
    ] })
  ] });
}
function ye({ customer: a, onConfirm: n, onCancel: t }) {
  const [i, d] = l.useState(!1), c = async () => {
    d(!0), await n(), d(!1);
  };
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "apya-in fixed inset-0 z-[90] flex items-center justify-center p-5",
      style: { background: "var(--apya-surface-overlay)" },
      onClick: t,
      children: /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "apya-pop-in w-full max-w-sm rounded-2xl border border-[var(--apya-border-strong)] p-6",
          style: { background: "var(--apya-surface-elevated)", boxShadow: "var(--apya-shadow-xl)" },
          onClick: (s) => s.stopPropagation(),
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
              /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                  style: { background: "rgba(248,113,113,.12)", color: "var(--apya-negative-500)" },
                  children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash", style: { fontSize: 16 }, "aria-hidden": "true" })
                }
              ),
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("div", { className: "text-sm font-semibold text-[var(--apya-text-primary)]", children: "Cari Silinecek" }),
                /* @__PURE__ */ e.jsxs("div", { className: "text-xs text-[var(--apya-text-tertiary)] mt-1", children: [
                  /* @__PURE__ */ e.jsx("strong", { className: "text-[var(--apya-text-primary)]", children: a == null ? void 0 : a.name }),
                  " kalıcı olarak silinecek. Bu işlem geri alınamaz."
                ] })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 justify-end", children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: t,
                  className: "h-9 px-4 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)] transition-colors",
                  children: "Vazgeç"
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: c,
                  disabled: i,
                  className: "h-9 px-4 rounded-lg text-xs font-medium text-white transition-colors disabled:opacity-50",
                  style: { background: "var(--apya-negative-500)" },
                  children: [
                    i ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-spinner fa-spin me-1" }) : null,
                    "Evet, Sil"
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function be({ message: a, onDone: n }) {
  return l.useEffect(() => {
    const t = setTimeout(n, 2800);
    return () => clearTimeout(t);
  }, [n]), /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-pop-in fixed bottom-5 right-5 left-5 sm:left-auto z-[95] flex items-center gap-2.5 px-4 py-3 rounded-xl border max-w-[calc(100vw-2.5rem)] sm:max-w-sm",
      style: { background: "var(--apya-surface-elevated)", borderColor: "var(--apya-border-strong)", boxShadow: "var(--apya-shadow-lg)" },
      role: "status",
      children: [
        /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0",
            style: { background: "rgba(52,211,153,.15)", color: "var(--apya-positive-500)" },
            children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-check", style: { fontSize: 11 } })
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: "text-xs text-[var(--apya-text-primary)]", children: a })
      ]
    }
  );
}
function he({ c: a, selected: n, onSelect: t }) {
  const i = a.balance > 0 ? "var(--apya-positive-500)" : a.balance < 0 ? "var(--apya-negative-500)" : "var(--apya-text-tertiary)";
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => t(a.id),
      "aria-current": n ? "true" : void 0,
      className: g(
        "w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors border-l-2",
        n ? "bg-[var(--apya-accent-soft)] border-[var(--apya-accent-500)]" : "border-transparent hover:bg-[var(--apya-border-subtle)]"
      ),
      children: [
        /* @__PURE__ */ e.jsx(Q, { name: a.name, size: 34 }),
        /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: g(
            "text-[13px] font-semibold truncate",
            n ? "text-[var(--apya-accent-500)]" : "text-[var(--apya-text-primary)]"
          ), children: a.name }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-[var(--apya-text-tertiary)] truncate", children: [
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: "w-1.5 h-1.5 rounded-full flex-shrink-0",
                style: { background: a.isActive ? "var(--apya-positive-500)" : "var(--apya-text-disabled)" }
              }
            ),
            a.taxNumber || a.email || (a.isActive ? "Aktif" : "Pasif")
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "text-right flex-shrink-0", children: /* @__PURE__ */ e.jsx("div", { className: "text-[12px] font-bold font-tabular", style: { color: i }, children: h.money(a.balance) }) })
      ]
    }
  );
}
function L({ icon: a, label: n, children: t, mono: i = !1 }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("div", { className: "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-[var(--apya-border-subtle)] text-[var(--apya-text-tertiary)]", children: /* @__PURE__ */ e.jsx("i", { className: `fa ${a}`, style: { fontSize: 12 }, "aria-hidden": "true" }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsx("div", { className: "text-[10.5px] font-bold uppercase tracking-wide text-[var(--apya-text-tertiary)]", children: n }),
      /* @__PURE__ */ e.jsx("div", { className: g("text-[12.5px] text-[var(--apya-text-primary)] mt-0.5 break-words", i && "font-tabular"), children: t || /* @__PURE__ */ e.jsx("span", { className: "text-[var(--apya-text-disabled)]", children: "—" }) })
    ] })
  ] });
}
const q = [
  { key: "b0", label: "0-30 gün", color: "var(--apya-positive-500)", max: 30 },
  { key: "b30", label: "31-60 gün", color: "#0EA5E9", max: 60 },
  { key: "b60", label: "61-90 gün", color: "var(--apya-warning-500)", max: 90 },
  { key: "b90", label: "90+ gün", color: "var(--apya-negative-500)", max: 1 / 0 }
];
function ve({ customerId: a }) {
  const [n, t] = l.useState(!0), [i, d] = l.useState(null);
  if (l.useEffect(() => {
    let s = !1;
    t(!0);
    const x = xe();
    if (!x) {
      t(!1);
      return;
    }
    return x.getList({ maxResultCount: 1e3, sorting: "dueDate asc" }).then((m) => {
      if (s) return;
      const u = /* @__PURE__ */ new Date(), f = { b0: 0, b30: 0, b60: 0, b90: 0 };
      (m.items || []).forEach((b) => {
        if (b.customerId !== a) return;
        const v = (b.totalAmount || 0) - (b.paidAmount || 0);
        if (v <= 5e-3) return;
        const w = Math.floor((u - new Date(b.dueDate)) / 864e5);
        w <= 30 ? f.b0 += v : w <= 60 ? f.b30 += v : w <= 90 ? f.b60 += v : f.b90 += v;
      }), d(f);
    }).catch(() => {
      s || d(null);
    }).finally(() => {
      s || t(!1);
    }), () => {
      s = !0;
    };
  }, [a]), n)
    return /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsx(S, { w: "35%", h: 11 }),
      /* @__PURE__ */ e.jsx(S, { w: "100%", h: 8, r: 4, style: { marginTop: 8 } })
    ] });
  if (!i) return null;
  const c = i.b0 + i.b30 + i.b60 + i.b90;
  return c <= 5e-3 ? null : /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsxs("div", { className: "text-[10.5px] font-bold uppercase tracking-wide text-[var(--apya-text-tertiary)] mb-1.5 flex items-center", children: [
      "Yaşlandırma",
      /* @__PURE__ */ e.jsx(F, { text: "Ödenmemiş faturaların bekleme süresine göre dağılımı. Gün sayısı vade tarihinden bugüne kadar geçen süredir; vadesi henüz gelmemiş faturalar da 0-30 gün diliminde görünür." })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "flex h-2 rounded-full overflow-hidden", style: { background: "var(--apya-border-subtle)" }, children: q.map((s) => i[s.key] > 0 && /* @__PURE__ */ e.jsx(
      "div",
      {
        style: { width: `${i[s.key] / c * 100}%`, background: s.color },
        title: `${s.label}: ${h.money(i[s.key])}`
      },
      s.key
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-1.5 mt-2.5", children: q.map((s) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 text-[11px] min-w-0", children: [
      /* @__PURE__ */ e.jsx("span", { className: "w-1.5 h-1.5 rounded-full flex-shrink-0", style: { background: s.color } }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[var(--apya-text-tertiary)] truncate", children: s.label }),
      /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-[var(--apya-text-secondary)] font-tabular ms-auto", children: h.money(i[s.key]) })
    ] }, s.key)) })
  ] });
}
function ge({ customerId: a, onViewAll: n }) {
  const [t, i] = l.useState(!0), [d, c] = l.useState([]);
  return l.useEffect(() => {
    let s = !1;
    i(!0);
    const x = me();
    if (!x) {
      i(!1);
      return;
    }
    return x.getStatement(a).then((m) => {
      s || c(((m == null ? void 0 : m.lines) || []).slice(-5).reverse());
    }).catch(() => {
      s || c([]);
    }).finally(() => {
      s || i(!1);
    }), () => {
      s = !0;
    };
  }, [a]), /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
      /* @__PURE__ */ e.jsx("div", { className: "text-[10.5px] font-bold uppercase tracking-wide text-[var(--apya-text-tertiary)]", children: "Hesap Ekstresi" }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: n,
          className: "text-[11px] font-medium text-[var(--apya-accent-500)] hover:underline",
          children: "Tümünü gör"
        }
      )
    ] }),
    t ? /* @__PURE__ */ e.jsx("div", { className: "space-y-1.5", children: Array.from({ length: 3 }).map((s, x) => /* @__PURE__ */ e.jsx(S, { h: 26, r: 6 }, x)) }) : d.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "text-[12px] text-[var(--apya-text-tertiary)] py-3 text-center rounded-xl border border-[var(--apya-border-subtle)]", children: "Hareket yok" }) : /* @__PURE__ */ e.jsx("div", { className: "rounded-xl border border-[var(--apya-border-subtle)] overflow-hidden overflow-x-auto", children: /* @__PURE__ */ e.jsxs("table", { className: "w-full text-[11.5px]", style: { minWidth: 380 }, children: [
      /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { style: { background: "var(--apya-surface-sunken)" }, children: [
        /* @__PURE__ */ e.jsx("th", { className: "text-left font-semibold px-2.5 py-1.5 text-[var(--apya-text-tertiary)]", children: "Tarih" }),
        /* @__PURE__ */ e.jsx("th", { className: "text-left font-semibold px-2.5 py-1.5 text-[var(--apya-text-tertiary)]", children: "Açıklama" }),
        /* @__PURE__ */ e.jsx("th", { className: "text-right font-semibold px-2.5 py-1.5 text-[var(--apya-text-tertiary)]", children: "Borç/Alacak" }),
        /* @__PURE__ */ e.jsx("th", { className: "text-right font-semibold px-2.5 py-1.5 text-[var(--apya-text-tertiary)]", children: "Bakiye" })
      ] }) }),
      /* @__PURE__ */ e.jsx("tbody", { children: d.map((s) => /* @__PURE__ */ e.jsxs("tr", { className: "border-t border-[var(--apya-border-subtle)]", children: [
        /* @__PURE__ */ e.jsx("td", { className: "px-2.5 py-1.5 text-[var(--apya-text-secondary)] whitespace-nowrap", children: new Date(s.entryDate).toLocaleDateString("tr-TR") }),
        /* @__PURE__ */ e.jsx("td", { className: "px-2.5 py-1.5 text-[var(--apya-text-primary)] truncate max-w-[160px]", children: s.description || "—" }),
        /* @__PURE__ */ e.jsx(
          "td",
          {
            className: "px-2.5 py-1.5 text-right font-tabular",
            style: { color: s.debit > 0 ? "var(--apya-negative-500)" : "var(--apya-positive-500)" },
            children: s.debit > 0 ? h.money(s.debit) : "−" + h.money(s.credit)
          }
        ),
        /* @__PURE__ */ e.jsx("td", { className: "px-2.5 py-1.5 text-right font-tabular text-[var(--apya-text-primary)]", children: h.money(s.runningBalance) })
      ] }, s.id)) })
    ] }) })
  ] });
}
function je({ c: a, canEdit: n, canDelete: t, onBack: i, onEdit: d, onStatement: c, onDelete: s }) {
  const x = a.balance > 0 ? "var(--apya-positive-500)" : a.balance < 0 ? "var(--apya-negative-500)" : "var(--apya-text-tertiary)", m = a.balance > 0 ? "Alacak" : a.balance < 0 ? "Borç" : "Bakiye yok", u = ({ icon: b, label: v, onClick: w, danger: j = !1 }) => /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: w,
      className: g(
        "h-10 px-3 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors",
        j ? "border-transparent text-[var(--apya-negative-500)] hover:bg-[rgba(248,113,113,.1)]" : "border-[var(--apya-border-default)] text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)]"
      ),
      children: [
        /* @__PURE__ */ e.jsx("i", { className: `fa ${b}`, style: { fontSize: 12 }, "aria-hidden": "true" }),
        v
      ]
    }
  ), f = () => {
    window.location.href = I() + "Invoices?customerId=" + a.id;
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in flex flex-col p-5 gap-5 min-w-0", children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: i,
        className: "lg:hidden self-start flex items-center gap-1.5 text-xs font-medium text-[var(--apya-text-secondary)] hover:text-[var(--apya-accent-500)]",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-left", style: { fontSize: 11 }, "aria-hidden": "true" }),
          "Listeye dön"
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5 min-w-0", children: [
        /* @__PURE__ */ e.jsx(Q, { name: a.name, size: 52 }),
        /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ e.jsx("div", { className: "text-[17px] font-bold tracking-tight text-[var(--apya-text-primary)] truncate", children: a.name }),
          /* @__PURE__ */ e.jsx("div", { className: "mt-1", children: /* @__PURE__ */ e.jsx(ue, { active: a.isActive }) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex gap-1.5 flex-wrap", children: [
        n && /* @__PURE__ */ e.jsx(u, { icon: "fa-pencil", label: "Düzenle", onClick: d }),
        /* @__PURE__ */ e.jsx(u, { icon: "fa-file-text", label: "Cari Ekstre", onClick: c }),
        /* @__PURE__ */ e.jsx(F, { className: "self-center", text: "Carinin tüm hesap hareketlerini (fatura, tahsilat, açılış) tarih sırasıyla listeler; toplam borç, toplam alacak ve net bakiyeyi gösterir.", placement: "bottom" }),
        t && /* @__PURE__ */ e.jsx(u, { icon: "fa-trash", label: "Sil", onClick: s, danger: !0 })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-sunken)] px-4 py-3.5 flex items-baseline justify-between flex-wrap gap-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "text-[10.5px] font-bold uppercase tracking-wide text-[var(--apya-text-tertiary)] flex items-center", children: [
        "Güncel Bakiye",
        /* @__PURE__ */ e.jsx(F, { text: "Artı bakiye carinin size olan borcunu (sizin alacağınızı), eksi bakiye sizin ona olan borcunuzu gösterir." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[22px] font-bold font-tabular", style: { color: x }, children: h.money(a.balance) }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-semibold text-[var(--apya-text-tertiary)]", children: m })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(ve, { customerId: a.id }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ e.jsx(L, { icon: "fa-hashtag", label: "Vergi / TC No", mono: !0, children: a.taxNumber }),
      /* @__PURE__ */ e.jsx(L, { icon: "fa-building", label: "Vergi Dairesi", children: a.taxOffice }),
      /* @__PURE__ */ e.jsx(L, { icon: "fa-phone", label: "Telefon", mono: !0, children: a.phone && /* @__PURE__ */ e.jsx("a", { href: `tel:${a.phone}`, className: "hover:text-[var(--apya-accent-500)] transition-colors", children: a.phone }) }),
      /* @__PURE__ */ e.jsx(L, { icon: "fa-envelope", label: "E-posta", children: a.email && /* @__PURE__ */ e.jsx("a", { href: `mailto:${a.email}`, className: "hover:text-[var(--apya-accent-500)] transition-colors break-all", children: a.email }) })
    ] }),
    /* @__PURE__ */ e.jsx(ge, { customerId: a.id, onViewAll: c }),
    a.notes && /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsx("div", { className: "text-[10.5px] font-bold uppercase tracking-wide text-[var(--apya-text-tertiary)] mb-1.5", children: "Notlar" }),
      /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] leading-relaxed text-[var(--apya-text-secondary)] whitespace-pre-wrap rounded-xl border border-[var(--apya-border-subtle)] bg-[var(--apya-surface-base)] px-3.5 py-3", children: a.notes })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 pt-1 border-t border-[var(--apya-border-subtle)] mt-1", children: [
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => O("info", "E-posta ile ekstre gönderimi yakında eklenecek."),
          className: "h-10 px-3.5 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] flex items-center gap-2 hover:bg-[var(--apya-border-subtle)] transition-colors mt-3",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-paper-plane", "aria-hidden": "true" }),
            "Ekstre Gönder"
          ]
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: f,
          className: "h-10 px-3.5 rounded-lg text-xs font-semibold text-white flex items-center gap-2 transition-colors hover:opacity-90 mt-3",
          style: { background: "var(--apya-accent-500)" },
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" }),
            "Yeni Fatura"
          ]
        }
      )
    ] })
  ] }, a.id);
}
function ke() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center gap-3 py-16 text-center px-6", children: [
    /* @__PURE__ */ e.jsx("div", { className: "w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--apya-border-subtle)] text-[var(--apya-text-tertiary)]", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-id-card text-2xl", "aria-hidden": "true" }) }),
    /* @__PURE__ */ e.jsx("div", { className: "text-sm font-semibold text-[var(--apya-text-primary)]", children: "Cari seçilmedi" }),
    /* @__PURE__ */ e.jsx("div", { className: "text-xs text-[var(--apya-text-tertiary)] max-w-[220px]", children: "Detaylarını görmek için soldaki listeden bir cari seçin." })
  ] });
}
const Ne = [
  { value: "name|asc", label: "Ad (A→Z)" },
  { value: "name|desc", label: "Ad (Z→A)" },
  { value: "balance|desc", label: "Bakiye (yüksek→düşük)" },
  { value: "balance|asc", label: "Bakiye (düşük→yüksek)" },
  { value: "taxOffice|asc", label: "Vergi dairesi (A→Z)" }
];
function we() {
  const [a, n] = l.useState([]), [t, i] = l.useState(!0), [d, c] = l.useState(null), [s, x] = l.useState(""), [m, u] = l.useState("all"), [f, b] = l.useState({ key: "name", dir: "asc" }), [v, w] = l.useState(1), [j, J] = l.useState(10), [C, E] = l.useState(null), [D, P] = l.useState(null), [H, V] = l.useState(null), X = l.useRef(null), _ = l.useCallback((r) => V(r), []), z = l.useCallback(async () => {
    i(!0), c(null);
    try {
      const r = await Z().getList({
        maxResultCount: 1e3,
        skipCount: 0,
        sorting: "name asc"
      });
      n(r.items ?? []);
    } catch (r) {
      c("Cari listesi yüklenemedi."), console.error("[CustomersIsland] load error", r);
    } finally {
      i(!1);
    }
  }, []);
  l.useEffect(() => {
    z();
  }, [z]), l.useEffect(() => {
    const r = () => z();
    return window.addEventListener("customers:refresh", r), () => window.removeEventListener("customers:refresh", r);
  }, [z]), l.useEffect(() => {
    if (t) return;
    const o = new URLSearchParams(window.location.search).get("selectCustomerId");
    o && a.some((p) => p.id === o) && E(o);
  }, [t, a]);
  const T = l.useMemo(() => ({
    all: a.length,
    Aktif: a.filter((r) => r.isActive).length,
    Pasif: a.filter((r) => !r.isActive).length
  }), [a]), U = l.useMemo(() => {
    const r = a.filter((p) => p.balance > 0).reduce((p, y) => p + y.balance, 0), o = a.filter((p) => p.balance < 0).reduce((p, y) => p + Math.abs(y.balance), 0);
    return { alacak: r, borc: o };
  }, [a]), k = l.useMemo(() => {
    const r = s.trim().toLocaleLowerCase("tr");
    let o = a.filter((y) => m === "Aktif" && !y.isActive || m === "Pasif" && y.isActive ? !1 : r ? [y.name, y.taxNumber, y.taxOffice, y.email, y.phone].filter(Boolean).some((R) => R.toLocaleLowerCase("tr").includes(r)) : !0);
    const p = f.dir === "asc" ? 1 : -1;
    return o = [...o].sort((y, R) => {
      const $ = y[f.key] ?? "", K = R[f.key] ?? "";
      return typeof $ == "number" ? ($ - K) * p : String($).localeCompare(String(K), "tr") * p;
    }), o;
  }, [a, s, m, f]), Y = Math.max(1, Math.ceil(k.length / j)), B = Math.min(v, Y), A = k.slice((B - 1) * j, B * j), ee = k.length === 0 ? 0 : (B - 1) * j + 1, ae = Math.min(B * j, k.length);
  l.useEffect(() => {
    w(1);
  }, [s, m, j]);
  const N = l.useMemo(
    () => a.find((r) => r.id === C) ?? null,
    [a, C]
  );
  l.useEffect(() => {
    var o;
    t || !window.matchMedia("(min-width: 1024px)").matches || C && k.some((p) => p.id === C) || E(((o = A[0]) == null ? void 0 : o.id) ?? null);
  }, [t, k, A, C]);
  const te = (r) => {
    if (r.key !== "ArrowDown" && r.key !== "ArrowUp") return;
    r.preventDefault();
    const o = A.findIndex((y) => y.id === C), p = r.key === "ArrowDown" ? A[Math.min(o + 1, A.length - 1)] : A[Math.max(o - 1, 0)];
    p && E(p.id);
  }, re = () => {
    const r = new window.abp.ModalManager(I() + "Customers/CreateModal");
    r.open(), r.onResult(() => {
      z(), _("Cari başarıyla oluşturuldu.");
    });
  }, se = () => {
    if (!N) return;
    const r = new window.abp.ModalManager(I() + "Customers/EditModal");
    r.open({ id: N.id }), r.onResult(() => window.dispatchEvent(new CustomEvent("customers:refresh")));
  }, ne = () => {
    N && new window.abp.ModalManager(I() + "Customers/StatementModal").open({ customerId: N.id });
  }, ie = async () => {
    try {
      await Z().delete(D.id), n((r) => r.filter((o) => o.id !== D.id)), C === D.id && E(null), _(`"${D.name}" silindi.`);
    } catch {
      O("error", "Silme işlemi başarısız oldu.");
    } finally {
      P(null);
    }
  }, le = G("Platform.Customers.Create"), oe = G("Platform.Customers.Edit"), de = G("Platform.Customers.Delete");
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-7 py-7 max-w-[1440px] mx-auto", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between flex-wrap gap-4 mb-5", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h1", { className: "text-xl font-bold tracking-tight text-[var(--apya-text-primary)] m-0", children: "Cari Yönetimi" }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-xs text-[var(--apya-text-tertiary)] m-0", children: "Müşteri ve tedarikçi cari kartlarını tek yerden yönetin" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: "h-9 px-3.5 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] flex items-center gap-2 hover:bg-[var(--apya-border-subtle)] transition-colors",
            onClick: () => {
              O("info", "Dışa aktarma yakında gelecek.");
            },
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa fa-download", "aria-hidden": "true" }),
              "Dışa Aktar"
            ]
          }
        ),
        le && /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: "h-9 px-3.5 rounded-lg text-xs font-semibold text-white flex items-center gap-2 transition-colors hover:opacity-90",
            style: { background: "var(--apya-accent-500)" },
            onClick: re,
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" }),
              "Yeni Cari"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid gap-3 mb-4", style: { gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }, children: [
      /* @__PURE__ */ e.jsx(M, { loading: t, index: 0, icon: "fa-id-card", label: "Toplam Cari", value: h.int(T.all) }),
      /* @__PURE__ */ e.jsx(M, { loading: t, index: 1, icon: "fa-check-circle", label: "Aktif Cari", value: h.int(T.Aktif) }),
      /* @__PURE__ */ e.jsx(
        M,
        {
          loading: t,
          index: 2,
          icon: "fa-arrow-up",
          label: "Toplam Alacak",
          value: h.money(U.alacak),
          tone: "success",
          hint: "Bakiyesi artıda olan carilerin toplamı — sizin tahsil edeceğiniz tutar."
        }
      ),
      /* @__PURE__ */ e.jsx(
        M,
        {
          loading: t,
          index: 3,
          icon: "fa-arrow-down",
          label: "Toplam Borç",
          value: h.money(U.borc),
          tone: "danger",
          hint: "Bakiyesi eksideki carilerin toplamı — sizin ödeyeceğiniz tutar."
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "rounded-2xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)] overflow-hidden grid lg:grid-cols-[minmax(320px,390px)_1fr]",
        style: { boxShadow: "var(--apya-shadow-sm)" },
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: g(
            "flex-col min-w-0 border-[var(--apya-border-subtle)] lg:border-r",
            N ? "hidden lg:flex" : "flex"
          ), children: [
            /* @__PURE__ */ e.jsxs("div", { className: "px-3 pt-3 pb-2.5 border-b border-[var(--apya-border-subtle)] flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--apya-text-tertiary)]", style: { fontSize: 13 } }),
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    value: s,
                    onChange: (r) => x(r.target.value),
                    placeholder: "Cari adı, vergi no, e-posta...",
                    "aria-label": "Cari ara",
                    className: "w-full h-9 pl-8 pr-8 rounded-lg border border-[var(--apya-border-default)] bg-[var(--apya-surface-base)] text-[var(--apya-text-primary)] outline-none transition-colors focus:border-[var(--apya-accent-500)]",
                    style: { fontSize: 12 }
                  }
                ),
                s && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => x(""),
                    "aria-label": "Temizle",
                    className: "absolute right-0 top-1/2 h-9 w-9 -translate-y-1/2 flex items-center justify-center text-[var(--apya-text-tertiary)] hover:text-[var(--apya-text-primary)]",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-times", style: { fontSize: 12 } })
                  }
                )
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
                /* @__PURE__ */ e.jsx("div", { className: "flex gap-1", children: [["all", "Tümü"], ["Aktif", "Aktif"], ["Pasif", "Pasif"]].map(([r, o]) => /* @__PURE__ */ e.jsx(pe, { label: o, count: T[r] ?? T.all, active: m === r, onClick: () => u(r) }, r)) }),
                /* @__PURE__ */ e.jsx(
                  "select",
                  {
                    value: `${f.key}|${f.dir}`,
                    onChange: (r) => {
                      const [o, p] = r.target.value.split("|");
                      b({ key: o, dir: p });
                    },
                    "aria-label": "Sırala",
                    className: "h-7 px-1.5 rounded-lg border border-[var(--apya-border-default)] bg-transparent text-[var(--apya-text-secondary)] text-[11px] font-medium cursor-pointer outline-none max-w-[150px]",
                    children: Ne.map((r) => /* @__PURE__ */ e.jsx("option", { value: r.value, children: r.label }, r.value))
                  }
                )
              ] })
            ] }),
            d ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-3 py-16 text-center px-4", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa fa-exclamation-circle text-[var(--apya-negative-500)] text-3xl" }),
              /* @__PURE__ */ e.jsx("p", { className: "text-sm text-[var(--apya-text-secondary)]", children: d }),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: z,
                  className: "h-8 px-4 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)] transition-colors",
                  children: "Tekrar Dene"
                }
              )
            ] }) : t ? /* @__PURE__ */ e.jsx("div", { className: "p-3 space-y-1", children: Array.from({ length: 8 }).map((r, o) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 py-2.5 px-1", children: [
              /* @__PURE__ */ e.jsx(S, { w: 34, h: 34, r: 8 }),
              /* @__PURE__ */ e.jsx("div", { className: "flex-1", children: /* @__PURE__ */ e.jsx(S, { w: "60%" }) }),
              /* @__PURE__ */ e.jsx(S, { w: 70 })
            ] }, o)) }) : k.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-3 py-16 text-center px-4", children: [
              /* @__PURE__ */ e.jsx("div", { className: "w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--apya-border-subtle)] text-[var(--apya-text-tertiary)]", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-inbox text-2xl" }) }),
              /* @__PURE__ */ e.jsx("div", { className: "text-sm font-semibold text-[var(--apya-text-primary)]", children: s || m !== "all" ? "Eşleşen cari bulunamadı" : "Henüz cari kaydı yok" }),
              /* @__PURE__ */ e.jsx("div", { className: "text-xs text-[var(--apya-text-tertiary)] max-w-xs", children: s || m !== "all" ? "Arama veya filtre kriterlerinizi değiştirip tekrar deneyin." : "İlk cari kartınızı oluşturarak finans modülünü kullanmaya başlayın." }),
              (s || m !== "all") && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    x(""), u("all");
                  },
                  className: "h-8 px-3.5 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)] transition-colors",
                  children: "Filtreleri Temizle"
                }
              )
            ] }) : /* @__PURE__ */ e.jsx(
              "div",
              {
                ref: X,
                role: "listbox",
                "aria-label": "Cari listesi",
                tabIndex: 0,
                onKeyDown: te,
                className: "flex-1 divide-y divide-[var(--apya-border-subtle)] outline-none focus-visible:ring-1 focus-visible:ring-[var(--apya-accent-500)]",
                children: A.map((r) => /* @__PURE__ */ e.jsx(he, { c: r, selected: r.id === C, onSelect: E }, r.id))
              }
            ),
            !t && k.length > 0 && /* @__PURE__ */ e.jsx(
              fe,
              {
                page: B,
                pageCount: Y,
                pageSize: j,
                total: k.length,
                rangeFrom: ee,
                rangeTo: ae,
                onPage: w,
                onPageSize: J
              }
            )
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: g("flex-col min-w-0 bg-[var(--apya-surface-base)]", N ? "flex" : "hidden lg:flex"), children: N ? /* @__PURE__ */ e.jsx(
            je,
            {
              c: N,
              canEdit: oe,
              canDelete: de,
              onBack: () => E(null),
              onEdit: se,
              onStatement: ne,
              onDelete: () => P(N)
            }
          ) : /* @__PURE__ */ e.jsx(ke, {}) })
        ]
      }
    ),
    D && /* @__PURE__ */ e.jsx(ye, { customer: D, onConfirm: ie, onCancel: () => P(null) }),
    H && /* @__PURE__ */ e.jsx(be, { message: H, onDone: () => V(null) })
  ] });
}
const W = document.getElementById("customers-island");
W && ce(W).render(/* @__PURE__ */ e.jsx(we, {}));
