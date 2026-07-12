import { b as ae, j as e, r as o } from "./react-vendor.js";
/* empty css      */
const k = {
  money: (a) => new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a || 0) + " ₺",
  int: (a) => new Intl.NumberFormat("tr-TR").format(Math.round(a || 0))
}, u = (...a) => a.filter(Boolean).join(" "), W = () => {
  var a, n, t;
  return (t = (n = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : n.customers) == null ? void 0 : t.customer;
}, P = (a) => {
  var n, t;
  return (t = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.auth) == null ? void 0 : t.isGranted(a);
}, Y = (a, n) => {
  var t, l, c;
  return (c = (l = (t = window == null ? void 0 : window.abp) == null ? void 0 : t.notify) == null ? void 0 : l[a]) == null ? void 0 : c.call(l, n);
}, L = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function N({ w: a = "100%", h: n = 14, r: t = 6 }) {
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      "aria-hidden": "true",
      className: "apya-skeleton",
      style: { width: a, height: n, borderRadius: t, flexShrink: 0 }
    }
  );
}
function M({ label: a, value: n, icon: t, tone: l = "muted", loading: c, index: x = 0 }) {
  const i = { success: "text-green-500", danger: "text-red-500", muted: "text-[var(--apya-text-tertiary)]" }[l] ?? "";
  return c ? /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "rounded-xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)] p-4",
      style: { animationDelay: `${x * 50}ms` },
      children: [
        /* @__PURE__ */ e.jsx(N, { w: "55%", h: 11 }),
        /* @__PURE__ */ e.jsx(N, { w: "45%", h: 20, r: 4, style: { marginTop: 10 } })
      ]
    }
  ) : /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-fade-in rounded-xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)] p-4",
      style: { animationDelay: `${x * 50}ms` },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[var(--apya-text-tertiary)] text-xs font-medium", children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa ${t}`, "aria-hidden": "true" }),
          a
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: u("mt-2 text-xl font-bold tabular-nums", i || "text-[var(--apya-text-primary)]"), children: n })
      ]
    }
  );
}
function te({ label: a, count: n, active: t, onClick: l }) {
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: l,
      className: u(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
        t ? "bg-[var(--apya-accent-soft)] text-[var(--apya-accent-500)]" : "text-[var(--apya-text-tertiary)] hover:text-[var(--apya-text-secondary)]"
      ),
      children: [
        a,
        /* @__PURE__ */ e.jsx("span", { className: u(
          "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
          t ? "bg-[var(--apya-surface-base)] text-[var(--apya-accent-500)]" : "bg-[var(--apya-border-subtle)] text-[var(--apya-text-tertiary)]"
        ), children: n })
      ]
    }
  );
}
function re({ name: a = "", size: n = 34 }) {
  const t = [
    ["#6366F1", "#818CF8"],
    ["#0EA5E9", "#38BDF8"],
    ["#F59E0B", "#FBBF24"],
    ["#10B981", "#34D399"],
    ["#EC4899", "#F472B6"],
    ["#8B5CF6", "#A78BFA"]
  ], l = (a.split(" ").filter(Boolean).slice(0, 2).map((f) => f[0]).join("") || "?").toUpperCase(), c = (l.charCodeAt(0) || 65) + (l.charCodeAt(1) || 66), [x, i] = t[c % t.length];
  return /* @__PURE__ */ e.jsx("div", { "aria-hidden": "true", style: {
    width: n,
    height: n,
    borderRadius: 8,
    flexShrink: 0,
    background: `linear-gradient(135deg, ${x}, ${i})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: n * 0.36,
    fontWeight: 600,
    letterSpacing: 0.2
  }, children: l });
}
function se({ customer: a, onDelete: n }) {
  const [t, l] = o.useState(!1), c = o.useRef(null);
  o.useEffect(() => {
    if (!t) return;
    const s = (h) => {
      c.current && !c.current.contains(h.target) && l(!1);
    };
    return document.addEventListener("mousedown", s), () => document.removeEventListener("mousedown", s);
  }, [t]);
  const x = P("Platform.Customers.Edit"), i = P("Platform.Customers.Delete"), f = () => {
    l(!1);
    const s = new window.abp.ModalManager(L() + "Customers/EditModal");
    s.open({ id: a.id }), s.onResult(() => window.dispatchEvent(new CustomEvent("customers:refresh")));
  }, p = () => {
    l(!1), new window.abp.ModalManager(L() + "Customers/StatementModal").open({ customerId: a.id });
  }, b = () => {
    l(!1), n(a);
  };
  return /* @__PURE__ */ e.jsxs("div", { ref: c, className: "relative", children: [
    /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        onClick: () => l((s) => !s),
        className: u(
          "apya-row-actions w-8 h-8 rounded-lg flex items-center justify-center text-[var(--apya-text-tertiary)]",
          "border transition-colors",
          t ? "bg-[var(--apya-border-subtle)] border-[var(--apya-border-strong)]" : "bg-transparent border-transparent hover:border-[var(--apya-border-default)] hover:bg-[var(--apya-border-subtle)]"
        ),
        "aria-label": `${a.name} işlemleri`,
        "aria-haspopup": "menu",
        "aria-expanded": t,
        children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-ellipsis-h", style: { fontSize: 14 }, "aria-hidden": "true" })
      }
    ),
    t && /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "menu",
        className: "apya-pop-in absolute right-0 z-50 mt-1 w-48 rounded-xl border border-[var(--apya-border-strong)] bg-[var(--apya-surface-elevated)] p-1",
        style: { boxShadow: "var(--apya-shadow-lg)" },
        children: [
          x && /* @__PURE__ */ e.jsx(F, { icon: "fa-pencil", label: "Düzenle", onClick: f }),
          /* @__PURE__ */ e.jsx(F, { icon: "fa-file-text", label: "Cari Ekstre", onClick: p }),
          i && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("div", { className: "my-1 h-px bg-[var(--apya-border-subtle)]" }),
            /* @__PURE__ */ e.jsx(F, { icon: "fa-trash", label: "Sil", onClick: b, danger: !0 })
          ] })
        ]
      }
    )
  ] });
}
function F({ icon: a, label: n, onClick: t, danger: l = !1 }) {
  const [c, x] = o.useState(!1);
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      role: "menuitem",
      onClick: t,
      onMouseEnter: () => x(!0),
      onMouseLeave: () => x(!1),
      className: "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors",
      style: {
        background: c ? l ? "var(--apya-negative-soft, rgba(248,113,113,.1))" : "var(--apya-border-subtle)" : "transparent",
        color: c ? l ? "var(--apya-negative-500)" : "var(--apya-text-primary)" : l ? "var(--apya-negative-500)" : "var(--apya-text-secondary)"
      },
      children: [
        /* @__PURE__ */ e.jsx("i", { className: `fa ${a}`, style: { width: 14, textAlign: "center" }, "aria-hidden": "true" }),
        n
      ]
    }
  );
}
function ne({ page: a, pageCount: n, pageSize: t, total: l, rangeFrom: c, rangeTo: x, onPage: i, onPageSize: f }) {
  const p = [];
  for (let s = 1; s <= n; s++)
    s === 1 || s === n || Math.abs(s - a) <= 1 ? p.push(s) : p[p.length - 1] !== "…" && p.push("…");
  const b = ({ label: s, onClick: h, disabled: C, active: S }) => /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      disabled: C,
      onClick: h,
      className: u(
        "min-w-[30px] h-[30px] px-2 rounded-md text-xs font-semibold flex items-center justify-center transition-colors",
        S && "bg-[var(--apya-accent-500)] text-white",
        !S && !C && "text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)]",
        C && "text-[var(--apya-text-disabled)] cursor-default opacity-40"
      ),
      children: s
    }
  );
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3 px-4 py-3 border-t border-[var(--apya-border-subtle)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-xs text-[var(--apya-text-tertiary)]", children: [
      /* @__PURE__ */ e.jsxs("span", { children: [
        /* @__PURE__ */ e.jsx("strong", { className: "text-[var(--apya-text-secondary)] font-semibold", children: k.int(l) }),
        " ",
        "kayıttan ",
        c,
        "–",
        x
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[var(--apya-border-default)]", children: "|" }),
      /* @__PURE__ */ e.jsx(
        "select",
        {
          value: t,
          onChange: (s) => f(Number(s.target.value)),
          className: "h-7 px-2 rounded-lg border border-[var(--apya-border-default)] bg-transparent text-[var(--apya-text-secondary)] text-xs font-semibold cursor-pointer outline-none",
          children: [10, 25, 50].map((s) => /* @__PURE__ */ e.jsxs("option", { value: s, children: [
            s,
            " / sayfa"
          ] }, s))
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ e.jsx(b, { label: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left", style: { fontSize: 12 } }), disabled: a === 1, onClick: () => i(a - 1) }),
      p.map(
        (s, h) => s === "…" ? /* @__PURE__ */ e.jsx("span", { className: "text-[var(--apya-text-tertiary)] px-1 text-xs", children: "…" }, `e${h}`) : /* @__PURE__ */ e.jsx(b, { label: s, onClick: () => i(s), active: s === a }, `p${s}`)
      ),
      /* @__PURE__ */ e.jsx(b, { label: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right", style: { fontSize: 12 } }), disabled: a === n, onClick: () => i(a + 1) })
    ] })
  ] });
}
function le({ customer: a, onConfirm: n, onCancel: t }) {
  const [l, c] = o.useState(!1), x = async () => {
    c(!0), await n(), c(!1);
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
          onClick: (i) => i.stopPropagation(),
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
                  onClick: x,
                  disabled: l,
                  className: "h-9 px-4 rounded-lg text-xs font-medium text-white transition-colors disabled:opacity-50",
                  style: { background: "var(--apya-negative-500)" },
                  children: [
                    l ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-spinner fa-spin me-1" }) : null,
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
function ie({ message: a, onDone: n }) {
  return o.useEffect(() => {
    const t = setTimeout(n, 2800);
    return () => clearTimeout(t);
  }, [n]), /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-pop-in fixed bottom-5 right-5 z-[95] flex items-center gap-2.5 px-4 py-3 rounded-xl border",
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
function oe() {
  const [a, n] = o.useState([]), [t, l] = o.useState(!0), [c, x] = o.useState(null), [i, f] = o.useState(""), [p, b] = o.useState("all"), [s, h] = o.useState({ key: "name", dir: "asc" }), [C, S] = o.useState(1), [v, Q] = o.useState(10), [A, T] = o.useState(null), [$, R] = o.useState(null), I = o.useCallback((r) => R(r), []), w = o.useCallback(async () => {
    l(!0), x(null);
    try {
      const r = await W().getList({
        maxResultCount: 1e3,
        skipCount: 0,
        sorting: "name asc"
      });
      n(r.items ?? []);
    } catch (r) {
      x("Cari listesi yüklenemedi."), console.error("[CustomersIsland] load error", r);
    } finally {
      l(!1);
    }
  }, []);
  o.useEffect(() => {
    w();
  }, [w]), o.useEffect(() => {
    const r = () => w();
    return window.addEventListener("customers:refresh", r), () => window.removeEventListener("customers:refresh", r);
  }, [w]);
  const z = o.useMemo(() => ({
    all: a.length,
    Aktif: a.filter((r) => r.isActive).length,
    Pasif: a.filter((r) => !r.isActive).length
  }), [a]), O = o.useMemo(() => {
    const r = a.filter((y) => y.balance > 0).reduce((y, m) => y + m.balance, 0), d = a.filter((y) => y.balance < 0).reduce((y, m) => y + Math.abs(m.balance), 0);
    return { alacak: r, borc: d };
  }, [a]), g = o.useMemo(() => {
    const r = i.trim().toLocaleLowerCase("tr");
    let d = a.filter((m) => p === "Aktif" && !m.isActive || p === "Pasif" && m.isActive ? !1 : r ? [m.name, m.taxNumber, m.taxOffice, m.email, m.phone].filter(Boolean).some((B) => B.toLocaleLowerCase("tr").includes(r)) : !0);
    const y = s.dir === "asc" ? 1 : -1;
    return d = [...d].sort((m, B) => {
      const D = m[s.key] ?? "", q = B[s.key] ?? "";
      return typeof D == "number" ? (D - q) * y : String(D).localeCompare(String(q), "tr") * y;
    }), d;
  }, [a, i, p, s]), H = Math.max(1, Math.ceil(g.length / v)), E = Math.min(C, H), U = g.slice((E - 1) * v, E * v), _ = g.length === 0 ? 0 : (E - 1) * v + 1, J = Math.min(E * v, g.length);
  o.useEffect(() => {
    S(1);
  }, [i, p, v]);
  const V = (r) => h((d) => d.key === r ? { key: r, dir: d.dir === "asc" ? "desc" : "asc" } : { key: r, dir: "asc" }), X = () => {
    const r = new window.abp.ModalManager(L() + "Customers/CreateModal");
    r.open(), r.onResult(() => {
      w(), I("Cari başarıyla oluşturuldu.");
    });
  }, Z = async () => {
    try {
      await W().delete(A.id), n((r) => r.filter((d) => d.id !== A.id)), I(`"${A.name}" silindi.`);
    } catch {
      Y("error", "Silme işlemi başarısız oldu.");
    } finally {
      T(null);
    }
  }, K = ({ k: r }) => s.key !== r ? null : /* @__PURE__ */ e.jsx("i", { className: `fa fa-sort-${s.dir === "asc" ? "asc" : "desc"} ms-1`, style: { fontSize: 10 }, "aria-hidden": "true" }), j = ({ label: r, sortKey: d, align: y = "left", width: m }) => /* @__PURE__ */ e.jsx("th", { className: "px-4 h-10 bg-[var(--apya-surface-raised)]", style: { textAlign: y, width: m }, children: /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      disabled: !d,
      onClick: () => d && V(d),
      className: u(
        "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide",
        d && "cursor-pointer",
        s.key === d ? "text-[var(--apya-text-primary)]" : "text-[var(--apya-text-tertiary)]"
      ),
      children: [
        r,
        /* @__PURE__ */ e.jsx(K, { k: d })
      ]
    }
  ) }), ee = P("Platform.Customers.Create");
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
              Y("info", "Dışa aktarma yakında gelecek.");
            },
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa fa-download", "aria-hidden": "true" }),
              "Dışa Aktar"
            ]
          }
        ),
        ee && /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: "h-9 px-3.5 rounded-lg text-xs font-semibold text-white flex items-center gap-2 transition-colors hover:opacity-90",
            style: { background: "var(--apya-accent-500)" },
            onClick: X,
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" }),
              "Yeni Cari"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid gap-3 mb-4", style: { gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }, children: [
      /* @__PURE__ */ e.jsx(M, { loading: t, index: 0, icon: "fa-id-card", label: "Toplam Cari", value: k.int(z.all) }),
      /* @__PURE__ */ e.jsx(M, { loading: t, index: 1, icon: "fa-check-circle", label: "Aktif Cari", value: k.int(z.Aktif) }),
      /* @__PURE__ */ e.jsx(M, { loading: t, index: 2, icon: "fa-arrow-up", label: "Toplam Alacak", value: k.money(O.alacak), tone: "success" }),
      /* @__PURE__ */ e.jsx(M, { loading: t, index: 3, icon: "fa-arrow-down", label: "Toplam Borç", value: k.money(O.borc), tone: "danger" })
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "rounded-2xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)] overflow-visible",
        style: { boxShadow: "var(--apya-shadow-sm)" },
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3 px-3.5 py-3 border-b border-[var(--apya-border-subtle)]", children: [
            /* @__PURE__ */ e.jsx("div", { className: "flex gap-1", children: [["all", "Tümü"], ["Aktif", "Aktif"], ["Pasif", "Pasif"]].map(([r, d]) => /* @__PURE__ */ e.jsx(te, { label: d, count: z[r] ?? z.all, active: p === r, onClick: () => b(r) }, r)) }),
            /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ e.jsxs("div", { className: "relative w-64", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--apya-text-tertiary)]", style: { fontSize: 13 } }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  value: i,
                  onChange: (r) => f(r.target.value),
                  placeholder: "Cari adı, vergi no, e-posta...",
                  "aria-label": "Cari ara",
                  className: "w-full h-9 pl-8 pr-8 rounded-lg border border-[var(--apya-border-default)] bg-[var(--apya-surface-base)] text-[var(--apya-text-primary)] text-xs outline-none transition-colors focus:border-[var(--apya-accent-500)]",
                  style: { fontSize: 12 }
                }
              ),
              i && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => f(""),
                  "aria-label": "Temizle",
                  className: "absolute right-2 top-1/2 -translate-y-1/2 text-[var(--apya-text-tertiary)] hover:text-[var(--apya-text-primary)]",
                  children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-times", style: { fontSize: 12 } })
                }
              )
            ] }) })
          ] }),
          c ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-3 py-16 text-center", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-exclamation-circle text-[var(--apya-negative-500)] text-3xl" }),
            /* @__PURE__ */ e.jsx("p", { className: "text-sm text-[var(--apya-text-secondary)]", children: c }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: w,
                className: "h-8 px-4 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)] transition-colors",
                children: "Tekrar Dene"
              }
            )
          ] }) : t ? /* @__PURE__ */ e.jsx("div", { className: "p-4 space-y-1", children: Array.from({ length: 8 }).map((r, d) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 py-3 px-2", children: [
            /* @__PURE__ */ e.jsx(N, { w: 34, h: 34, r: 8 }),
            /* @__PURE__ */ e.jsx(N, { w: "22%" }),
            /* @__PURE__ */ e.jsx(N, { w: 60, h: 20, r: 6 }),
            /* @__PURE__ */ e.jsx("div", { className: "flex-1" }),
            /* @__PURE__ */ e.jsx(N, { w: "12%" }),
            /* @__PURE__ */ e.jsx(N, { w: 90 })
          ] }, d)) }) : g.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-3 py-16 text-center", children: [
            /* @__PURE__ */ e.jsx("div", { className: "w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--apya-border-subtle)] text-[var(--apya-text-tertiary)]", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-inbox text-2xl" }) }),
            /* @__PURE__ */ e.jsx("div", { className: "text-sm font-semibold text-[var(--apya-text-primary)]", children: i || p !== "all" ? "Eşleşen cari bulunamadı" : "Henüz cari kaydı yok" }),
            /* @__PURE__ */ e.jsx("div", { className: "text-xs text-[var(--apya-text-tertiary)] max-w-xs", children: i || p !== "all" ? "Arama veya filtre kriterlerinizi değiştirip tekrar deneyin." : "İlk cari kartınızı oluşturarak finans modülünü kullanmaya başlayın." }),
            (i || p !== "all") && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  f(""), b("all");
                },
                className: "h-8 px-3.5 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)] transition-colors",
                children: "Filtreleri Temizle"
              }
            )
          ] }) : /* @__PURE__ */ e.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse", style: { minWidth: 860 }, children: [
            /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { className: "border-b border-[var(--apya-border-subtle)]", children: [
              /* @__PURE__ */ e.jsx(j, { label: "Cari Adı", sortKey: "name" }),
              /* @__PURE__ */ e.jsx(j, { label: "Durum", sortKey: "isActive", width: 110 }),
              /* @__PURE__ */ e.jsx(j, { label: "Vergi / TC No", width: 130 }),
              /* @__PURE__ */ e.jsx(j, { label: "Vergi Dairesi", sortKey: "taxOffice", width: 140 }),
              /* @__PURE__ */ e.jsx(j, { label: "İletişim", width: 230 }),
              /* @__PURE__ */ e.jsx(j, { label: "Bakiye", sortKey: "balance", align: "right", width: 145 }),
              /* @__PURE__ */ e.jsx(j, { label: "", width: 52 })
            ] }) }),
            /* @__PURE__ */ e.jsx("tbody", { children: U.map((r) => /* @__PURE__ */ e.jsx(ce, { c: r, onSort: V, onDelete: T }, r.id)) })
          ] }) }),
          !t && g.length > 0 && /* @__PURE__ */ e.jsx(
            ne,
            {
              page: E,
              pageCount: H,
              pageSize: v,
              total: g.length,
              rangeFrom: _,
              rangeTo: J,
              onPage: S,
              onPageSize: Q
            }
          )
        ]
      }
    ),
    A && /* @__PURE__ */ e.jsx(le, { customer: A, onConfirm: Z, onCancel: () => T(null) }),
    $ && /* @__PURE__ */ e.jsx(ie, { message: $, onDone: () => R(null) })
  ] });
}
function ce({ c: a, onDelete: n }) {
  const [t, l] = o.useState(!1), c = a.balance > 0 ? "var(--apya-positive-500)" : a.balance < 0 ? "var(--apya-negative-500)" : "var(--apya-text-tertiary)", x = a.balance > 0 ? "Alacak" : a.balance < 0 ? "Borç" : "", i = "px-4 border-b border-[var(--apya-border-subtle)] transition-colors", f = t ? "var(--apya-border-subtle)" : "transparent";
  return /* @__PURE__ */ e.jsxs("tr", { onMouseEnter: () => l(!0), onMouseLeave: () => l(!1), style: { background: f }, children: [
    /* @__PURE__ */ e.jsx("td", { className: u(i, "py-3"), children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ e.jsx(re, { name: a.name, size: 34 }),
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("div", { className: "text-[13px] font-semibold text-[var(--apya-text-primary)] truncate", children: a.name }),
        a.notes && /* @__PURE__ */ e.jsx("div", { className: "text-[11px] text-[var(--apya-text-tertiary)] truncate max-w-[220px]", children: a.notes })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsx("td", { className: u(i, "py-3"), children: /* @__PURE__ */ e.jsxs(
      "span",
      {
        className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold",
        style: {
          background: a.isActive ? "rgba(52,211,153,.12)" : "var(--apya-border-subtle)",
          color: a.isActive ? "var(--apya-positive-500)" : "var(--apya-text-tertiary)"
        },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-1.5 h-1.5 rounded-full flex-shrink-0", style: { background: "currentColor" } }),
          a.isActive ? "Aktif" : "Pasif"
        ]
      }
    ) }),
    /* @__PURE__ */ e.jsx("td", { className: u(i, "py-3 text-[12px] text-[var(--apya-text-secondary)] tabular-nums"), children: a.taxNumber || /* @__PURE__ */ e.jsx("span", { className: "text-[var(--apya-text-disabled)]", children: "—" }) }),
    /* @__PURE__ */ e.jsx("td", { className: u(i, "py-3 text-[12px] text-[var(--apya-text-secondary)]"), children: a.taxOffice || /* @__PURE__ */ e.jsx("span", { className: "text-[var(--apya-text-disabled)]", children: "—" }) }),
    /* @__PURE__ */ e.jsx("td", { className: u(i, "py-3"), children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
      a.phone && /* @__PURE__ */ e.jsxs("a", { href: `tel:${a.phone}`, className: "flex items-center gap-1.5 text-[11.5px] text-[var(--apya-text-secondary)] hover:text-[var(--apya-accent-500)]", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-phone text-[var(--apya-text-tertiary)]", style: { fontSize: 11, width: 12 } }),
        a.phone
      ] }),
      a.email && /* @__PURE__ */ e.jsxs("a", { href: `mailto:${a.email}`, className: "flex items-center gap-1.5 text-[11px] text-[var(--apya-text-tertiary)] hover:text-[var(--apya-accent-500)] truncate max-w-[200px]", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-envelope", style: { fontSize: 11, width: 12 } }),
        a.email
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsxs("td", { className: u(i, "py-3 text-right"), children: [
      /* @__PURE__ */ e.jsx("div", { className: "text-[13px] font-bold tabular-nums", style: { color: c }, children: k.money(a.balance) }),
      x && /* @__PURE__ */ e.jsx("div", { className: "text-[10px] text-[var(--apya-text-tertiary)] mt-0.5", children: x })
    ] }),
    /* @__PURE__ */ e.jsx("td", { className: u(i, "py-3 pr-3 text-right"), children: /* @__PURE__ */ e.jsx(se, { customer: a, onDelete: n }) })
  ] });
}
const G = document.getElementById("customers-island");
G && ae(G).render(/* @__PURE__ */ e.jsx(oe, {}));
