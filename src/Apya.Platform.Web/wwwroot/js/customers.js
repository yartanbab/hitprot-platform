import { b as oe, j as e, r as l } from "./react-vendor.js";
/* empty css      */
const w = {
  money: (a) => new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a || 0) + " ₺",
  int: (a) => new Intl.NumberFormat("tr-TR").format(Math.round(a || 0))
}, y = (...a) => a.filter(Boolean).join(" "), K = () => {
  var a, s, r;
  return (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.customers) == null ? void 0 : r.customer;
}, R = (a) => {
  var s, r;
  return (r = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.auth) == null ? void 0 : r.isGranted(a);
}, U = (a, s) => {
  var r, n, c;
  return (c = (n = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.notify) == null ? void 0 : n[a]) == null ? void 0 : c.call(n, s);
}, $ = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function M({ w: a = "100%", h: s = 14, r = 6 }) {
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      "aria-hidden": "true",
      className: "apya-skeleton",
      style: { width: a, height: s, borderRadius: r, flexShrink: 0 }
    }
  );
}
function B({ label: a, value: s, icon: r, tone: n = "muted", loading: c, index: m = 0 }) {
  const i = { success: "text-green-500", danger: "text-red-500", muted: "text-[var(--apya-text-tertiary)]" }[n] ?? "";
  return c ? /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "rounded-xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)] p-4",
      style: { animationDelay: `${m * 50}ms` },
      children: [
        /* @__PURE__ */ e.jsx(M, { w: "55%", h: 11 }),
        /* @__PURE__ */ e.jsx(M, { w: "45%", h: 20, r: 4, style: { marginTop: 10 } })
      ]
    }
  ) : /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "apya-fade-in rounded-xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)] p-4",
      style: { animationDelay: `${m * 50}ms` },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[var(--apya-text-tertiary)] text-xs font-medium", children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa ${r}`, "aria-hidden": "true" }),
          a
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: y("mt-2 text-xl font-bold font-tabular", i || "text-[var(--apya-text-primary)]"), children: s })
      ]
    }
  );
}
function de({ label: a, count: s, active: r, onClick: n }) {
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: n,
      className: y(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
        r ? "bg-[var(--apya-accent-soft)] text-[var(--apya-accent-500)]" : "text-[var(--apya-text-tertiary)] hover:text-[var(--apya-text-secondary)]"
      ),
      children: [
        a,
        /* @__PURE__ */ e.jsx("span", { className: y(
          "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
          r ? "bg-[var(--apya-surface-base)] text-[var(--apya-accent-500)]" : "bg-[var(--apya-border-subtle)] text-[var(--apya-text-tertiary)]"
        ), children: s })
      ]
    }
  );
}
function H({ name: a = "", size: s = 34 }) {
  const r = [
    ["#6366F1", "#818CF8"],
    ["#0EA5E9", "#38BDF8"],
    ["#F59E0B", "#FBBF24"],
    ["#10B981", "#34D399"],
    ["#EC4899", "#F472B6"],
    ["#8B5CF6", "#A78BFA"]
  ], n = (a.split(" ").filter(Boolean).slice(0, 2).map((b) => b[0]).join("") || "?").toUpperCase(), c = (n.charCodeAt(0) || 65) + (n.charCodeAt(1) || 66), [m, i] = r[c % r.length];
  return /* @__PURE__ */ e.jsx("div", { "aria-hidden": "true", style: {
    width: s,
    height: s,
    borderRadius: Math.max(8, s * 0.22),
    flexShrink: 0,
    background: `linear-gradient(135deg, ${m}, ${i})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: s * 0.36,
    fontWeight: 600,
    letterSpacing: 0.2
  }, children: n });
}
function ce({ active: a }) {
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
function xe({ page: a, pageCount: s, pageSize: r, total: n, rangeFrom: c, rangeTo: m, onPage: i, onPageSize: b }) {
  const u = ({ label: p, onClick: f, disabled: j, ariaLabel: A }) => /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      disabled: j,
      onClick: f,
      "aria-label": A,
      className: y(
        "min-w-[30px] h-[30px] px-2 rounded-md text-xs font-semibold flex items-center justify-center transition-colors",
        !j && "text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)]",
        j && "text-[var(--apya-text-disabled)] cursor-default opacity-40"
      ),
      children: p
    }
  );
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2 px-3 py-2.5 border-t border-[var(--apya-border-subtle)] mt-auto", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[11px] text-[var(--apya-text-tertiary)]", children: [
      /* @__PURE__ */ e.jsxs("span", { children: [
        /* @__PURE__ */ e.jsx("strong", { className: "text-[var(--apya-text-secondary)] font-semibold", children: w.int(n) }),
        " ",
        "kayıttan ",
        c,
        "–",
        m
      ] }),
      /* @__PURE__ */ e.jsx(
        "select",
        {
          value: r,
          onChange: (p) => b(Number(p.target.value)),
          "aria-label": "Sayfa boyutu",
          className: "h-6 px-1.5 rounded-md border border-[var(--apya-border-default)] bg-transparent text-[var(--apya-text-secondary)] text-[11px] font-semibold cursor-pointer outline-none",
          children: [10, 25, 50].map((p) => /* @__PURE__ */ e.jsx("option", { value: p, children: p }, p))
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ e.jsx(u, { ariaLabel: "Önceki sayfa", label: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left", style: { fontSize: 11 } }), disabled: a === 1, onClick: () => i(a - 1) }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-[var(--apya-text-tertiary)] px-1 font-tabular", children: [
        a,
        "/",
        s
      ] }),
      /* @__PURE__ */ e.jsx(u, { ariaLabel: "Sonraki sayfa", label: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right", style: { fontSize: 11 } }), disabled: a === s, onClick: () => i(a + 1) })
    ] })
  ] });
}
function pe({ customer: a, onConfirm: s, onCancel: r }) {
  const [n, c] = l.useState(!1), m = async () => {
    c(!0), await s(), c(!1);
  };
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "apya-in fixed inset-0 z-[90] flex items-center justify-center p-5",
      style: { background: "var(--apya-surface-overlay)" },
      onClick: r,
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
                  onClick: r,
                  className: "h-9 px-4 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)] transition-colors",
                  children: "Vazgeç"
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: m,
                  disabled: n,
                  className: "h-9 px-4 rounded-lg text-xs font-medium text-white transition-colors disabled:opacity-50",
                  style: { background: "var(--apya-negative-500)" },
                  children: [
                    n ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-spinner fa-spin me-1" }) : null,
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
function me({ message: a, onDone: s }) {
  return l.useEffect(() => {
    const r = setTimeout(s, 2800);
    return () => clearTimeout(r);
  }, [s]), /* @__PURE__ */ e.jsxs(
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
function ue({ c: a, selected: s, onSelect: r }) {
  const n = a.balance > 0 ? "var(--apya-positive-500)" : a.balance < 0 ? "var(--apya-negative-500)" : "var(--apya-text-tertiary)";
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => r(a.id),
      "aria-current": s ? "true" : void 0,
      className: y(
        "w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors border-l-2",
        s ? "bg-[var(--apya-accent-soft)] border-[var(--apya-accent-500)]" : "border-transparent hover:bg-[var(--apya-border-subtle)]"
      ),
      children: [
        /* @__PURE__ */ e.jsx(H, { name: a.name, size: 34 }),
        /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: y(
            "text-[13px] font-semibold truncate",
            s ? "text-[var(--apya-accent-500)]" : "text-[var(--apya-text-primary)]"
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
        /* @__PURE__ */ e.jsx("div", { className: "text-right flex-shrink-0", children: /* @__PURE__ */ e.jsx("div", { className: "text-[12px] font-bold font-tabular", style: { color: n }, children: w.money(a.balance) }) })
      ]
    }
  );
}
function F({ icon: a, label: s, children: r, mono: n = !1 }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("div", { className: "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-[var(--apya-border-subtle)] text-[var(--apya-text-tertiary)]", children: /* @__PURE__ */ e.jsx("i", { className: `fa ${a}`, style: { fontSize: 12 }, "aria-hidden": "true" }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsx("div", { className: "text-[10.5px] font-bold uppercase tracking-wide text-[var(--apya-text-tertiary)]", children: s }),
      /* @__PURE__ */ e.jsx("div", { className: y("text-[12.5px] text-[var(--apya-text-primary)] mt-0.5 break-words", n && "font-tabular"), children: r || /* @__PURE__ */ e.jsx("span", { className: "text-[var(--apya-text-disabled)]", children: "—" }) })
    ] })
  ] });
}
function fe({ c: a, canEdit: s, canDelete: r, onBack: n, onEdit: c, onStatement: m, onDelete: i }) {
  const b = a.balance > 0 ? "var(--apya-positive-500)" : a.balance < 0 ? "var(--apya-negative-500)" : "var(--apya-text-tertiary)", u = a.balance > 0 ? "Alacak" : a.balance < 0 ? "Borç" : "Bakiye yok", p = ({ icon: f, label: j, onClick: A, danger: T = !1 }) => /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: A,
      className: y(
        "h-8 px-3 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors",
        T ? "border-transparent text-[var(--apya-negative-500)] hover:bg-[rgba(248,113,113,.1)]" : "border-[var(--apya-border-default)] text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)]"
      ),
      children: [
        /* @__PURE__ */ e.jsx("i", { className: `fa ${f}`, style: { fontSize: 12 }, "aria-hidden": "true" }),
        j
      ]
    }
  );
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in flex flex-col p-5 gap-5 min-w-0", children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        onClick: n,
        className: "lg:hidden self-start flex items-center gap-1.5 text-xs font-medium text-[var(--apya-text-secondary)] hover:text-[var(--apya-accent-500)]",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-left", style: { fontSize: 11 }, "aria-hidden": "true" }),
          "Listeye dön"
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5 min-w-0", children: [
        /* @__PURE__ */ e.jsx(H, { name: a.name, size: 52 }),
        /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ e.jsx("div", { className: "text-[17px] font-bold tracking-tight text-[var(--apya-text-primary)] truncate", children: a.name }),
          /* @__PURE__ */ e.jsx("div", { className: "mt-1", children: /* @__PURE__ */ e.jsx(ce, { active: a.isActive }) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex gap-1.5 flex-wrap", children: [
        s && /* @__PURE__ */ e.jsx(p, { icon: "fa-pencil", label: "Düzenle", onClick: c }),
        /* @__PURE__ */ e.jsx(p, { icon: "fa-file-text", label: "Cari Ekstre", onClick: m }),
        r && /* @__PURE__ */ e.jsx(p, { icon: "fa-trash", label: "Sil", onClick: i, danger: !0 })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-sunken)] px-4 py-3.5 flex items-baseline justify-between flex-wrap gap-2", children: [
      /* @__PURE__ */ e.jsx("div", { className: "text-[10.5px] font-bold uppercase tracking-wide text-[var(--apya-text-tertiary)]", children: "Güncel Bakiye" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[22px] font-bold font-tabular", style: { color: b }, children: w.money(a.balance) }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-semibold text-[var(--apya-text-tertiary)]", children: u })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ e.jsx(F, { icon: "fa-hashtag", label: "Vergi / TC No", mono: !0, children: a.taxNumber }),
      /* @__PURE__ */ e.jsx(F, { icon: "fa-building", label: "Vergi Dairesi", children: a.taxOffice }),
      /* @__PURE__ */ e.jsx(F, { icon: "fa-phone", label: "Telefon", mono: !0, children: a.phone && /* @__PURE__ */ e.jsx("a", { href: `tel:${a.phone}`, className: "hover:text-[var(--apya-accent-500)] transition-colors", children: a.phone }) }),
      /* @__PURE__ */ e.jsx(F, { icon: "fa-envelope", label: "E-posta", children: a.email && /* @__PURE__ */ e.jsx("a", { href: `mailto:${a.email}`, className: "hover:text-[var(--apya-accent-500)] transition-colors break-all", children: a.email }) })
    ] }),
    a.notes && /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsx("div", { className: "text-[10.5px] font-bold uppercase tracking-wide text-[var(--apya-text-tertiary)] mb-1.5", children: "Notlar" }),
      /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] leading-relaxed text-[var(--apya-text-secondary)] whitespace-pre-wrap rounded-xl border border-[var(--apya-border-subtle)] bg-[var(--apya-surface-base)] px-3.5 py-3", children: a.notes })
    ] })
  ] }, a.id);
}
function ye() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center gap-3 py-16 text-center px-6", children: [
    /* @__PURE__ */ e.jsx("div", { className: "w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--apya-border-subtle)] text-[var(--apya-text-tertiary)]", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-id-card text-2xl", "aria-hidden": "true" }) }),
    /* @__PURE__ */ e.jsx("div", { className: "text-sm font-semibold text-[var(--apya-text-primary)]", children: "Cari seçilmedi" }),
    /* @__PURE__ */ e.jsx("div", { className: "text-xs text-[var(--apya-text-tertiary)] max-w-[220px]", children: "Detaylarını görmek için soldaki listeden bir cari seçin." })
  ] });
}
const be = [
  { value: "name|asc", label: "Ad (A→Z)" },
  { value: "name|desc", label: "Ad (Z→A)" },
  { value: "balance|desc", label: "Bakiye (yüksek→düşük)" },
  { value: "balance|asc", label: "Bakiye (düşük→yüksek)" },
  { value: "taxOffice|asc", label: "Vergi dairesi (A→Z)" }
];
function ve() {
  const [a, s] = l.useState([]), [r, n] = l.useState(!0), [c, m] = l.useState(null), [i, b] = l.useState(""), [u, p] = l.useState("all"), [f, j] = l.useState({ key: "name", dir: "asc" }), [A, T] = l.useState(1), [N, Q] = l.useState(10), [g, D] = l.useState(null), [C, P] = l.useState(null), [O, V] = l.useState(null), W = l.useRef(null), Z = l.useCallback((t) => V(t), []), S = l.useCallback(async () => {
    n(!0), m(null);
    try {
      const t = await K().getList({
        maxResultCount: 1e3,
        skipCount: 0,
        sorting: "name asc"
      });
      s(t.items ?? []);
    } catch (t) {
      m("Cari listesi yüklenemedi."), console.error("[CustomersIsland] load error", t);
    } finally {
      n(!1);
    }
  }, []);
  l.useEffect(() => {
    S();
  }, [S]), l.useEffect(() => {
    const t = () => S();
    return window.addEventListener("customers:refresh", t), () => window.removeEventListener("customers:refresh", t);
  }, [S]);
  const z = l.useMemo(() => ({
    all: a.length,
    Aktif: a.filter((t) => t.isActive).length,
    Pasif: a.filter((t) => !t.isActive).length
  }), [a]), _ = l.useMemo(() => {
    const t = a.filter((d) => d.balance > 0).reduce((d, x) => d + x.balance, 0), o = a.filter((d) => d.balance < 0).reduce((d, x) => d + Math.abs(x.balance), 0);
    return { alacak: t, borc: o };
  }, [a]), v = l.useMemo(() => {
    const t = i.trim().toLocaleLowerCase("tr");
    let o = a.filter((x) => u === "Aktif" && !x.isActive || u === "Pasif" && x.isActive ? !1 : t ? [x.name, x.taxNumber, x.taxOffice, x.email, x.phone].filter(Boolean).some((L) => L.toLocaleLowerCase("tr").includes(t)) : !0);
    const d = f.dir === "asc" ? 1 : -1;
    return o = [...o].sort((x, L) => {
      const I = x[f.key] ?? "", G = L[f.key] ?? "";
      return typeof I == "number" ? (I - G) * d : String(I).localeCompare(String(G), "tr") * d;
    }), o;
  }, [a, i, u, f]), q = Math.max(1, Math.ceil(v.length / N)), E = Math.min(A, q), k = v.slice((E - 1) * N, E * N), J = v.length === 0 ? 0 : (E - 1) * N + 1, X = Math.min(E * N, v.length);
  l.useEffect(() => {
    T(1);
  }, [i, u, N]);
  const h = l.useMemo(
    () => a.find((t) => t.id === g) ?? null,
    [a, g]
  );
  l.useEffect(() => {
    var o;
    r || !window.matchMedia("(min-width: 1024px)").matches || g && v.some((d) => d.id === g) || D(((o = k[0]) == null ? void 0 : o.id) ?? null);
  }, [r, v, k, g]);
  const ee = (t) => {
    if (t.key !== "ArrowDown" && t.key !== "ArrowUp") return;
    t.preventDefault();
    const o = k.findIndex((x) => x.id === g), d = t.key === "ArrowDown" ? k[Math.min(o + 1, k.length - 1)] : k[Math.max(o - 1, 0)];
    d && D(d.id);
  }, ae = () => {
    const t = new window.abp.ModalManager($() + "Customers/CreateModal");
    t.open(), t.onResult(() => {
      S(), Z("Cari başarıyla oluşturuldu.");
    });
  }, te = () => {
    if (!h) return;
    const t = new window.abp.ModalManager($() + "Customers/EditModal");
    t.open({ id: h.id }), t.onResult(() => window.dispatchEvent(new CustomEvent("customers:refresh")));
  }, re = () => {
    h && new window.abp.ModalManager($() + "Customers/StatementModal").open({ customerId: h.id });
  }, se = async () => {
    try {
      await K().delete(C.id), s((t) => t.filter((o) => o.id !== C.id)), g === C.id && D(null), Z(`"${C.name}" silindi.`);
    } catch {
      U("error", "Silme işlemi başarısız oldu.");
    } finally {
      P(null);
    }
  }, ne = R("Platform.Customers.Create"), le = R("Platform.Customers.Edit"), ie = R("Platform.Customers.Delete");
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
              U("info", "Dışa aktarma yakında gelecek.");
            },
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa fa-download", "aria-hidden": "true" }),
              "Dışa Aktar"
            ]
          }
        ),
        ne && /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: "h-9 px-3.5 rounded-lg text-xs font-semibold text-white flex items-center gap-2 transition-colors hover:opacity-90",
            style: { background: "var(--apya-accent-500)" },
            onClick: ae,
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" }),
              "Yeni Cari"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid gap-3 mb-4", style: { gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }, children: [
      /* @__PURE__ */ e.jsx(B, { loading: r, index: 0, icon: "fa-id-card", label: "Toplam Cari", value: w.int(z.all) }),
      /* @__PURE__ */ e.jsx(B, { loading: r, index: 1, icon: "fa-check-circle", label: "Aktif Cari", value: w.int(z.Aktif) }),
      /* @__PURE__ */ e.jsx(B, { loading: r, index: 2, icon: "fa-arrow-up", label: "Toplam Alacak", value: w.money(_.alacak), tone: "success" }),
      /* @__PURE__ */ e.jsx(B, { loading: r, index: 3, icon: "fa-arrow-down", label: "Toplam Borç", value: w.money(_.borc), tone: "danger" })
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "rounded-2xl border border-[var(--apya-border-default)] bg-[var(--apya-surface-raised)] overflow-hidden grid lg:grid-cols-[minmax(320px,390px)_1fr]",
        style: { boxShadow: "var(--apya-shadow-sm)" },
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: y(
            "flex-col min-w-0 border-[var(--apya-border-subtle)] lg:border-r",
            h ? "hidden lg:flex" : "flex"
          ), children: [
            /* @__PURE__ */ e.jsxs("div", { className: "px-3 pt-3 pb-2.5 border-b border-[var(--apya-border-subtle)] flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--apya-text-tertiary)]", style: { fontSize: 13 } }),
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    value: i,
                    onChange: (t) => b(t.target.value),
                    placeholder: "Cari adı, vergi no, e-posta...",
                    "aria-label": "Cari ara",
                    className: "w-full h-9 pl-8 pr-8 rounded-lg border border-[var(--apya-border-default)] bg-[var(--apya-surface-base)] text-[var(--apya-text-primary)] outline-none transition-colors focus:border-[var(--apya-accent-500)]",
                    style: { fontSize: 12 }
                  }
                ),
                i && /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => b(""),
                    "aria-label": "Temizle",
                    className: "absolute right-2 top-1/2 -translate-y-1/2 text-[var(--apya-text-tertiary)] hover:text-[var(--apya-text-primary)]",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-times", style: { fontSize: 12 } })
                  }
                )
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
                /* @__PURE__ */ e.jsx("div", { className: "flex gap-1", children: [["all", "Tümü"], ["Aktif", "Aktif"], ["Pasif", "Pasif"]].map(([t, o]) => /* @__PURE__ */ e.jsx(de, { label: o, count: z[t] ?? z.all, active: u === t, onClick: () => p(t) }, t)) }),
                /* @__PURE__ */ e.jsx(
                  "select",
                  {
                    value: `${f.key}|${f.dir}`,
                    onChange: (t) => {
                      const [o, d] = t.target.value.split("|");
                      j({ key: o, dir: d });
                    },
                    "aria-label": "Sırala",
                    className: "h-7 px-1.5 rounded-lg border border-[var(--apya-border-default)] bg-transparent text-[var(--apya-text-secondary)] text-[11px] font-medium cursor-pointer outline-none max-w-[150px]",
                    children: be.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.value, children: t.label }, t.value))
                  }
                )
              ] })
            ] }),
            c ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-3 py-16 text-center px-4", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa fa-exclamation-circle text-[var(--apya-negative-500)] text-3xl" }),
              /* @__PURE__ */ e.jsx("p", { className: "text-sm text-[var(--apya-text-secondary)]", children: c }),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: S,
                  className: "h-8 px-4 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)] transition-colors",
                  children: "Tekrar Dene"
                }
              )
            ] }) : r ? /* @__PURE__ */ e.jsx("div", { className: "p-3 space-y-1", children: Array.from({ length: 8 }).map((t, o) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 py-2.5 px-1", children: [
              /* @__PURE__ */ e.jsx(M, { w: 34, h: 34, r: 8 }),
              /* @__PURE__ */ e.jsx("div", { className: "flex-1", children: /* @__PURE__ */ e.jsx(M, { w: "60%" }) }),
              /* @__PURE__ */ e.jsx(M, { w: 70 })
            ] }, o)) }) : v.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-3 py-16 text-center px-4", children: [
              /* @__PURE__ */ e.jsx("div", { className: "w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--apya-border-subtle)] text-[var(--apya-text-tertiary)]", children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-inbox text-2xl" }) }),
              /* @__PURE__ */ e.jsx("div", { className: "text-sm font-semibold text-[var(--apya-text-primary)]", children: i || u !== "all" ? "Eşleşen cari bulunamadı" : "Henüz cari kaydı yok" }),
              /* @__PURE__ */ e.jsx("div", { className: "text-xs text-[var(--apya-text-tertiary)] max-w-xs", children: i || u !== "all" ? "Arama veya filtre kriterlerinizi değiştirip tekrar deneyin." : "İlk cari kartınızı oluşturarak finans modülünü kullanmaya başlayın." }),
              (i || u !== "all") && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    b(""), p("all");
                  },
                  className: "h-8 px-3.5 rounded-lg border border-[var(--apya-border-default)] text-xs font-medium text-[var(--apya-text-secondary)] hover:bg-[var(--apya-border-subtle)] transition-colors",
                  children: "Filtreleri Temizle"
                }
              )
            ] }) : /* @__PURE__ */ e.jsx(
              "div",
              {
                ref: W,
                role: "listbox",
                "aria-label": "Cari listesi",
                tabIndex: 0,
                onKeyDown: ee,
                className: "flex-1 divide-y divide-[var(--apya-border-subtle)] outline-none focus-visible:ring-1 focus-visible:ring-[var(--apya-accent-500)]",
                children: k.map((t) => /* @__PURE__ */ e.jsx(ue, { c: t, selected: t.id === g, onSelect: D }, t.id))
              }
            ),
            !r && v.length > 0 && /* @__PURE__ */ e.jsx(
              xe,
              {
                page: E,
                pageCount: q,
                pageSize: N,
                total: v.length,
                rangeFrom: J,
                rangeTo: X,
                onPage: T,
                onPageSize: Q
              }
            )
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: y("flex-col min-w-0 bg-[var(--apya-surface-base)]", h ? "flex" : "hidden lg:flex"), children: h ? /* @__PURE__ */ e.jsx(
            fe,
            {
              c: h,
              canEdit: le,
              canDelete: ie,
              onBack: () => D(null),
              onEdit: te,
              onStatement: re,
              onDelete: () => P(h)
            }
          ) : /* @__PURE__ */ e.jsx(ye, {}) })
        ]
      }
    ),
    C && /* @__PURE__ */ e.jsx(pe, { customer: C, onConfirm: se, onCancel: () => P(null) }),
    O && /* @__PURE__ */ e.jsx(me, { message: O, onDone: () => V(null) })
  ] });
}
const Y = document.getElementById("customers-island");
Y && oe(Y).render(/* @__PURE__ */ e.jsx(ve, {}));
