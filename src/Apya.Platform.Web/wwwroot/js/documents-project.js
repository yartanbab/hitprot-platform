import { r as m, j as e, b as E } from "./react-vendor.js";
/* empty css      */
import { B as R, g as N } from "./Dialog.js";
import { S as C } from "./SkeletonShape.js";
import { E as M } from "./EmptyState.js";
const k = (a, t) => {
  var r, l, c;
  return (c = (l = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.notify) == null ? void 0 : l[a]) == null ? void 0 : c.call(l, t);
}, I = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function u(a) {
  return new Promise((t, r) => {
    window.abp.ajax(a).done(t).fail(r);
  });
}
const x = (a, t, r = {}) => {
  const l = new URLSearchParams();
  Object.entries(r).forEach(([i, d]) => {
    d != null && d !== "" && l.append(i, d);
  });
  const c = l.toString();
  return `${I()}Documents/${a}?handler=${t}${c ? "&" + c : ""}`;
}, P = (a, t) => u({ url: a, type: "POST", contentType: "application/json", data: JSON.stringify(t) }), A = (a) => u({ url: x("Timeline", "Timeline", { projectId: a }), type: "GET" }), W = (a) => P(x("Timeline", "CreateRisk"), a), F = (a, t) => u({ url: x("Timeline", "SetRiskClosed", { id: a, isClosed: t }), type: "POST" }), L = (a) => u({ url: x("Matching", "Board", { projectId: a }), type: "GET" }), O = (a) => u({ url: x("Matching", "Candidates", { expenseId: a }), type: "GET" }), U = (a) => u({ url: x("Matching", "Matches", { projectId: a }), type: "GET" }), K = (a) => P(x("Matching", "CreateMatch"), a), G = (a) => u({ url: x("Matching", "RemoveMatch", { matchId: a }), type: "POST" }), y = (a, t = "TRY") => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + " " + ({ TRY: "₺", USD: "$", EUR: "€" }[t] || t), D = (a, t = 1) => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: t }).format(a), h = (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—";
function q(a) {
  return a >= 15 ? "negative" : a >= 8 ? "warning" : "neutral";
}
function J({ step: a, projectStart: t, projectEnd: r }) {
  const l = a.startDate ? new Date(a.startDate) : null, c = a.endDate ? new Date(a.endDate) : null;
  if (!l || !c || !t || !r)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-gantt-track", children: /* @__PURE__ */ e.jsx("span", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)", paddingLeft: 6 }, children: "tarih girilmemiş" }) });
  const i = r - t, d = i > 0 ? (l - t) / i * 100 : 0, p = i > 0 ? Math.max((c - l) / i * 100, 2) : 100;
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-gantt-track", children: /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "apya-doc-gantt-bar",
      style: {
        left: `${Math.max(0, Math.min(d, 100))}%`,
        width: `${Math.min(p, 100)}%`,
        background: a.progressPercent >= 100 ? "var(--apya-positive-500)" : "var(--apya-accent-500)"
      },
      title: `${h(a.startDate)} – ${h(a.endDate)} · %${a.progressPercent}`
    }
  ) });
}
function Y() {
  const a = new URLSearchParams(window.location.search).get("projectId"), [t, r] = m.useState(null), [l, c] = m.useState(!0), [i, d] = m.useState(!1), p = m.useCallback(async () => {
    if (!a) {
      c(!1);
      return;
    }
    c(!0);
    try {
      r(await A(a));
    } catch (n) {
      k("error", "Zaman çizelgesi yüklenemedi."), console.error("[Timeline] load", n);
    } finally {
      c(!1);
    }
  }, [a]);
  m.useEffect(() => {
    p();
  }, [p]);
  const f = async () => {
    const n = window.prompt("Risk başlığı:");
    if (!n) return;
    const j = Number(window.prompt("Olasılık (1-5):", "3")) || 3, w = Number(window.prompt("Etki (1-5):", "3")) || 3, b = window.prompt("Önlem (boş bırakılabilir):") || null;
    d(!0);
    try {
      await W({ projectId: a, title: n, likelihood: j, impact: w, mitigation: b }), await p();
    } catch {
      k("error", "Risk eklenemedi.");
    } finally {
      d(!1);
    }
  };
  if (!a)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: /* @__PURE__ */ e.jsx(
      M,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-diagram-project" }),
        title: "Proje bağlamı gerekiyor",
        description: "Bu sayfa bir proje bağlamından açılır (?projectId=...)."
      }
    ) });
  if (l) return /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx(C, { rows: 8 }) });
  if (!t) return null;
  const S = t.startDate ? new Date(t.startDate) : null, g = t.endDate ? new Date(t.endDate) : null, o = t.budget;
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ e.jsx("h1", { style: { fontSize: 20, fontWeight: 700, margin: 0 }, children: t.projectName }),
      /* @__PURE__ */ e.jsxs("p", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", margin: "4px 0 0" }, children: [
        h(t.startDate),
        " – ",
        h(t.endDate),
        " · ",
        t.steps.length,
        " iş adımı"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpis", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Bütçe kullanımı" }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-numeric apya-doc-kpi-value", children: [
          "%",
          o.budgetUsedPercent
        ] }),
        /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
          y(o.totalExpense, t.currency),
          " / ",
          y(o.totalBudget, t.currency)
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Belgelenen harcama" }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-numeric apya-doc-kpi-value", children: [
          "%",
          o.documentedPercent
        ] }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: y(o.documentedExpense, t.currency) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Belgesiz harcama" }),
        /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "apya-numeric apya-doc-kpi-value",
            style: { color: o.undocumentedExpense > 0 ? "var(--apya-negative-500)" : void 0 },
            children: y(o.undocumentedExpense, t.currency)
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
          o.undocumentedCount,
          " kalem",
          o.undocumentedCount > 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            " · ",
            /* @__PURE__ */ e.jsx("a", { href: `${window.abp.appPath}Documents/Matching?projectId=${a}`, children: "eşleştir" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Adam-gün" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: D(t.capacity.loggedPersonDays) }),
        /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
          "tahmin ",
          D(t.capacity.estimatedPersonDays),
          " gün"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
        /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "İş planı" }),
        /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
          h(t.startDate),
          " — ",
          h(t.endDate)
        ] })
      ] }),
      t.steps.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Tanımlı iş adımı yok." }) : t.steps.map((n) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-gantt-row", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: [
          n.order,
          " · ",
          n.name
        ] }),
        /* @__PURE__ */ e.jsx(J, { step: n, projectStart: S, projectEnd: g }),
        /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, textAlign: "right" }, children: [
          "%",
          n.progressPercent
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, textAlign: "right" }, children: [
          n.documentCount,
          " belge"
        ] })
      ] }, n.id))
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
        /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "Risk kütüğü" }),
        /* @__PURE__ */ e.jsxs(R, { variant: "outline", size: "sm", disabled: i, onClick: f, children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
          " Risk ekle"
        ] })
      ] }),
      t.risks.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Kayıtlı risk yok." }) : t.risks.map((n) => /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "apya-doc-check-row",
          style: { gridTemplateColumns: "70px minmax(0,1fr) 120px 110px", opacity: n.isClosed ? 0.55 : 1 },
          children: [
            /* @__PURE__ */ e.jsx(N, { variant: q(n.score), size: "sm", children: n.score }),
            /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
              /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5 }, children: n.title }),
              n.mitigation && /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: n.mitigation })
            ] }),
            /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
              "olasılık ",
              n.likelihood,
              " · etki ",
              n.impact
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "text-end", children: /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: i,
                onClick: async () => {
                  d(!0), await F(n.id, !n.isClosed), await p(), d(!1);
                },
                children: n.isClosed ? "Aç" : "Kapat"
              }
            ) })
          ]
        },
        n.id
      ))
    ] })
  ] });
}
const Z = (...a) => a.filter(Boolean).join(" "), H = {
  1: "Aynı dosya başka bir belgede de var",
  2: "Bu harcamaya zaten belge bağlı",
  3: "Aynı tutar/tarih/tedarikçi başka belgede"
};
function z({ label: a, value: t, max: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)", width: 62 }, children: a }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-doc-progress", style: { flex: 1, height: 4 }, children: /* @__PURE__ */ e.jsx("div", { style: { width: `${t / r * 100}%`, background: "var(--apya-accent-500)" } }) }),
    /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 10.5, width: 26, textAlign: "right" }, children: t })
  ] });
}
function _() {
  const a = new URLSearchParams(window.location.search).get("projectId"), [t, r] = m.useState(null), [l, c] = m.useState([]), [i, d] = m.useState(null), [p, f] = m.useState([]), [S, g] = m.useState(!0), [o, n] = m.useState(!1), j = m.useCallback(async () => {
    if (!a) {
      g(!1);
      return;
    }
    g(!0);
    try {
      const [s, v] = await Promise.all([L(a), U(a)]);
      r(s), c(v ?? []);
    } catch (s) {
      k("error", "Eşleştirme tezgâhı yüklenemedi."), console.error("[Matching] load", s);
    } finally {
      g(!1);
    }
  }, [a]);
  m.useEffect(() => {
    j();
  }, [j]);
  const w = async (s) => {
    d(s), f([]);
    try {
      f(await O(s.id) ?? []);
    } catch (v) {
      console.error("[Matching] candidates", v);
    }
  }, b = async (s) => {
    if (!i) return;
    const v = window.prompt("EK numarası (boş bırakılabilir):") || null;
    n(!0);
    try {
      await K({ documentFileId: s, expenseId: i.id, annexNumber: v }), d(null), f([]), await j();
    } catch ($) {
      k("error", "Bağlama başarısız oldu."), console.error("[Matching] createMatch", $);
    } finally {
      n(!1);
    }
  };
  return a ? S ? /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx(C, { rows: 8 }) }) : t ? /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h1", { style: { fontSize: 20, fontWeight: 700, margin: 0 }, children: "Harcama ↔ belge eşleştirme" }),
        /* @__PURE__ */ e.jsxs("p", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", margin: "4px 0 0" }, children: [
          t.expenses.length,
          " belgesiz harcama · toplam",
          " ",
          /* @__PURE__ */ e.jsx("strong", { style: { color: "var(--apya-negative-500)" }, children: y(t.undocumentedTotal) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("a", { href: `${window.abp.appPath}Documents/Timeline?projectId=${a}`, className: "apya-doc-linkbtn", children: "Zaman çizelgesine dön" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-matchboard", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Belgesiz harcamalar" }),
        t.expenses.length === 0 ? /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 12, color: "var(--apya-positive-500)" }, children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-check" }),
          " Tüm harcamalar belgeli."
        ] }) : t.expenses.map((s) => /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: Z("apya-md-item", (i == null ? void 0 : i.id) === s.id && "selected"),
            style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 },
            onClick: () => w(s),
            children: [
              /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1, textAlign: "left" }, children: [
                /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: s.title }),
                /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                  h(s.expenseDate),
                  s.supplierName && ` · ${s.supplierName}`
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: y(s.amount, s.currency) })
            ]
          },
          s.id
        ))
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: i ? `Aday belgeler · ${i.title}` : "Aday belgeler" }),
        i ? p.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Eşik üstünde aday yok. Sağdaki listeden elle bağlayabilirsiniz." }) : p.map((s) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-candidate", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start justify-content-between gap-2", children: [
            /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
              /* @__PURE__ */ e.jsx("div", { className: "text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: s.displayName }),
              /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                y(s.amount),
                " · ",
                h(s.documentDate)
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(N, { variant: s.isStrong ? "positive" : "warning", size: "sm", children: s.score })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-1 mt-2", children: [
            /* @__PURE__ */ e.jsx(z, { label: "tutar", value: s.amountScore, max: 50 }),
            /* @__PURE__ */ e.jsx(z, { label: "tarih", value: s.dateScore, max: 30 }),
            /* @__PURE__ */ e.jsx(z, { label: "tedarikçi", value: s.supplierScore, max: 20 })
          ] }),
          s.reasons.length > 0 && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)", marginTop: 4 }, children: s.reasons.join(" · ") }),
          /* @__PURE__ */ e.jsx(
            R,
            {
              variant: "primary",
              size: "sm",
              className: "mt-2 w-100",
              disabled: o,
              onClick: () => b(s.documentFileId),
              children: "Bağla + EK no ata"
            }
          )
        ] }, s.documentFileId)) : /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Soldan bir harcama seçin; sistem tutar, tarih ve tedarikçi yakınlığına göre aday sıralar." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Bağlanmamış belgeler" }),
        t.documents.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bağlanmamış belge yok." }) : t.documents.map((s) => /* @__PURE__ */ e.jsxs("div", { className: "apya-md-item", style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 }, children: [
          /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1 }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5 }, children: s.displayName }),
            /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
              y(s.amount),
              " · ",
              h(s.documentDate),
              s.documentTypeName && ` · ${s.documentTypeName}`
            ] }),
            s.duplicateOf && /* @__PURE__ */ e.jsx(N, { variant: "negative", size: "sm", children: H[s.duplicateOf] })
          ] }),
          i && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "apya-doc-linkbtn",
              disabled: o,
              onClick: () => b(s.id),
              children: "Bağla"
            }
          )
        ] }, s.id))
      ] })
    ] }),
    l.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card mt-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline", children: [
        "Kurulmuş eşleşmeler (",
        l.length,
        ")"
      ] }),
      l.map((s) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", style: { gridTemplateColumns: "70px minmax(0,1fr) minmax(0,1fr) 90px" }, children: [
        /* @__PURE__ */ e.jsx(N, { variant: "neutral", size: "sm", children: s.annexNumber || s.score }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: s.documentFileName }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { fontSize: 12 }, children: [
          s.expenseTitle,
          " · ",
          y(s.expenseAmount)
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "text-end", children: /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: "apya-doc-linkbtn",
            disabled: o,
            onClick: async () => {
              n(!0), await G(s.id), await j(), n(!1);
            },
            children: "Kaldır"
          }
        ) })
      ] }, s.id))
    ] })
  ] }) : null : /* @__PURE__ */ e.jsx("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: /* @__PURE__ */ e.jsx(
    M,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-link" }),
      title: "Proje bağlamı gerekiyor",
      description: "Bu sayfa bir proje bağlamından açılır (?projectId=...)."
    }
  ) });
}
const T = document.getElementById("project-timeline-island");
T && E(T).render(/* @__PURE__ */ e.jsx(Y, {}));
const B = document.getElementById("document-matching-island");
B && E(B).render(/* @__PURE__ */ e.jsx(_, {}));
