import { r, j as e, d as se, b as G } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { B, g as R } from "./Dialog-BdNKdiS6.js";
import { S as U } from "./SkeletonShape-CiCOe1YJ.js";
import { E as K } from "./EmptyState-Bhcx2Wdd.js";
const I = (a, t) => {
  var m, c, d;
  return (d = (c = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : c[a]) == null ? void 0 : d.call(c, t);
}, W = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function T(a) {
  return new Promise((t, m) => {
    window.abp.ajax(a).done(t).fail(m);
  });
}
const S = (a, t, m = {}) => {
  const c = new URLSearchParams();
  Object.entries(m).forEach(([i, p]) => {
    p != null && p !== "" && c.append(i, p);
  });
  const d = c.toString();
  return `${W()}Documents/${a}?handler=${t}${d ? "&" + d : ""}`;
}, Q = (a, t) => T({ url: a, type: "POST", contentType: "application/json", data: JSON.stringify(t) }), ne = (a) => T({ url: S("Timeline", "Timeline", { projectId: a }), type: "GET" }), ie = (a) => Q(S("Timeline", "CreateRisk"), a), le = (a, t) => T({ url: S("Timeline", "SetRiskClosed", { id: a, isClosed: t }), type: "POST" }), re = (a) => T({ url: S("Matching", "Board", { projectId: a }), type: "GET" }), ce = (a) => T({ url: S("Matching", "Candidates", { expenseId: a }), type: "GET" }), oe = (a) => T({ url: S("Matching", "Matches", { projectId: a }), type: "GET" }), de = (a) => Q(S("Matching", "CreateMatch"), a), pe = (a) => T({ url: S("Matching", "RemoveMatch", { matchId: a }), type: "POST" }), me = () => T({ url: S("Scope", "Overview"), type: "GET" }), ue = (a) => T({ url: S("Scope", "Branch", { projectId: a }), type: "GET" }), g = (a, t = "TRY") => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + " " + ({ TRY: "₺", USD: "$", EUR: "€" }[t] || t), Y = (a, t = 1) => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: t }).format(a), j = (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—";
function ye(a) {
  return a >= 15 ? "negative" : a >= 8 ? "warning" : "neutral";
}
function he({ step: a, projectStart: t, projectEnd: m }) {
  const c = a.startDate ? new Date(a.startDate) : null, d = a.endDate ? new Date(a.endDate) : null;
  if (!c || !d || !t || !m)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-gantt-track", children: /* @__PURE__ */ e.jsx("span", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)", paddingLeft: 6 }, children: "tarih girilmemiş" }) });
  const i = m - t, p = i > 0 ? (c - t) / i * 100 : 0, f = i > 0 ? Math.max((d - c) / i * 100, 2) : 100;
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-gantt-track", children: /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "apya-doc-gantt-bar",
      style: {
        left: `${Math.max(0, Math.min(p, 100))}%`,
        width: `${Math.min(f, 100)}%`,
        background: a.progressPercent >= 100 ? "var(--apya-positive-500)" : "var(--apya-accent-500)"
      },
      title: `${j(a.startDate)} – ${j(a.endDate)} · %${a.progressPercent}`
    }
  ) });
}
function xe() {
  const a = new URLSearchParams(window.location.search).get("projectId"), [t, m] = r.useState(null), [c, d] = r.useState(!0), [i, p] = r.useState(!1), f = r.useCallback(async () => {
    if (!a) {
      d(!1);
      return;
    }
    d(!0);
    try {
      m(await ne(a));
    } catch (l) {
      I("error", "Zaman çizelgesi yüklenemedi."), console.error("[Timeline] load", l);
    } finally {
      d(!1);
    }
  }, [a]);
  r.useEffect(() => {
    f();
  }, [f]);
  const v = async () => {
    const l = window.prompt("Risk başlığı:");
    if (!l) return;
    const N = Number(window.prompt("Olasılık (1-5):", "3")) || 3, A = Number(window.prompt("Etki (1-5):", "3")) || 3, z = window.prompt("Önlem (boş bırakılabilir):") || null;
    p(!0);
    try {
      await ie({ projectId: a, title: l, likelihood: N, impact: A, mitigation: z }), await f();
    } catch {
      I("error", "Risk eklenemedi.");
    } finally {
      p(!1);
    }
  };
  if (!a)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: /* @__PURE__ */ e.jsx(
      K,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-diagram-project" }),
        title: "Proje bağlamı gerekiyor",
        description: "Bu sayfa bir proje bağlamından açılır (?projectId=...)."
      }
    ) });
  if (c) return /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx(U, { rows: 8 }) });
  if (!t) return null;
  const M = t.startDate ? new Date(t.startDate) : null, C = t.endDate ? new Date(t.endDate) : null, y = t.budget;
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ e.jsx("h1", { style: { fontSize: 20, fontWeight: 700, margin: 0 }, children: t.projectName }),
      /* @__PURE__ */ e.jsxs("p", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", margin: "4px 0 0" }, children: [
        j(t.startDate),
        " – ",
        j(t.endDate),
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
          y.budgetUsedPercent
        ] }),
        /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
          g(y.totalExpense, t.currency),
          " / ",
          g(y.totalBudget, t.currency)
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Belgelenen harcama" }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-numeric apya-doc-kpi-value", children: [
          "%",
          y.documentedPercent
        ] }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: g(y.documentedExpense, t.currency) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Belgesiz harcama" }),
        /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "apya-numeric apya-doc-kpi-value",
            style: { color: y.undocumentedExpense > 0 ? "var(--apya-negative-500)" : void 0 },
            children: g(y.undocumentedExpense, t.currency)
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
          y.undocumentedCount,
          " kalem",
          y.undocumentedCount > 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            " · ",
            /* @__PURE__ */ e.jsx("a", { href: `${window.abp.appPath}Documents/Matching?projectId=${a}`, children: "eşleştir" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Adam-gün" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: Y(t.capacity.loggedPersonDays) }),
        /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
          "tahmin ",
          Y(t.capacity.estimatedPersonDays),
          " gün"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card mb-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
        /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "İş planı" }),
        /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
          j(t.startDate),
          " — ",
          j(t.endDate)
        ] })
      ] }),
      t.steps.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Tanımlı iş adımı yok." }) : t.steps.map((l) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-gantt-row", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: [
          l.order,
          " · ",
          l.name
        ] }),
        /* @__PURE__ */ e.jsx(he, { step: l, projectStart: M, projectEnd: C }),
        /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, textAlign: "right" }, children: [
          "%",
          l.progressPercent
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, textAlign: "right" }, children: [
          l.documentCount,
          " belge"
        ] })
      ] }, l.id))
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
        /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "Risk kütüğü" }),
        /* @__PURE__ */ e.jsxs(B, { variant: "outline", size: "sm", disabled: i, onClick: v, children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
          " Risk ekle"
        ] })
      ] }),
      t.risks.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Kayıtlı risk yok." }) : t.risks.map((l) => /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "apya-doc-check-row",
          style: { gridTemplateColumns: "70px minmax(0,1fr) 120px 110px", opacity: l.isClosed ? 0.55 : 1 },
          children: [
            /* @__PURE__ */ e.jsx(R, { variant: ye(l.score), size: "sm", children: l.score }),
            /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
              /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5 }, children: l.title }),
              l.mitigation && /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: l.mitigation })
            ] }),
            /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
              "olasılık ",
              l.likelihood,
              " · etki ",
              l.impact
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "text-end", children: /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: i,
                onClick: async () => {
                  p(!0), await le(l.id, !l.isClosed), await f(), p(!1);
                },
                children: l.isClosed ? "Aç" : "Kapat"
              }
            ) })
          ]
        },
        l.id
      ))
    ] })
  ] });
}
const fe = (...a) => a.filter(Boolean).join(" "), je = {
  1: "Aynı dosya başka bir belgede de var",
  2: "Bu harcamaya zaten belge bağlı",
  3: "Aynı tutar/tarih/tedarikçi başka belgede"
};
function O({ label: a, value: t, max: m }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)", width: 62 }, children: a }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-doc-progress", style: { flex: 1, height: 4 }, children: /* @__PURE__ */ e.jsx("div", { style: { width: `${t / m * 100}%`, background: "var(--apya-accent-500)" } }) }),
    /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 10.5, width: 26, textAlign: "right" }, children: t })
  ] });
}
function ge() {
  const a = new URLSearchParams(window.location.search).get("projectId"), [t, m] = r.useState(null), [c, d] = r.useState([]), [i, p] = r.useState(null), [f, v] = r.useState([]), [M, C] = r.useState(!0), [y, l] = r.useState(!1), N = r.useCallback(async () => {
    if (!a) {
      C(!1);
      return;
    }
    C(!0);
    try {
      const [s, k] = await Promise.all([re(a), oe(a)]);
      m(s), d(k ?? []);
    } catch (s) {
      I("error", "Eşleştirme tezgâhı yüklenemedi."), console.error("[Matching] load", s);
    } finally {
      C(!1);
    }
  }, [a]);
  r.useEffect(() => {
    N();
  }, [N]);
  const A = async (s) => {
    p(s), v([]);
    try {
      v(await ce(s.id) ?? []);
    } catch (k) {
      console.error("[Matching] candidates", k);
    }
  }, z = async (s) => {
    if (!i) return;
    const k = window.prompt("EK numarası (boş bırakılabilir):") || null;
    l(!0);
    try {
      await de({ documentFileId: s, expenseId: i.id, annexNumber: k }), p(null), v([]), await N();
    } catch (L) {
      I("error", "Bağlama başarısız oldu."), console.error("[Matching] createMatch", L);
    } finally {
      l(!1);
    }
  };
  return a ? M ? /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx(U, { rows: 8 }) }) : t ? /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h1", { style: { fontSize: 20, fontWeight: 700, margin: 0 }, children: "Harcama ↔ belge eşleştirme" }),
        /* @__PURE__ */ e.jsxs("p", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", margin: "4px 0 0" }, children: [
          t.expenses.length,
          " belgesiz harcama · toplam",
          " ",
          /* @__PURE__ */ e.jsx("strong", { style: { color: "var(--apya-negative-500)" }, children: g(t.undocumentedTotal) })
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
            className: fe("apya-md-item", (i == null ? void 0 : i.id) === s.id && "selected"),
            style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 },
            onClick: () => A(s),
            children: [
              /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1, textAlign: "left" }, children: [
                /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: s.title }),
                /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                  j(s.expenseDate),
                  s.supplierName && ` · ${s.supplierName}`,
                  s.budgetLineName && ` · ${s.budgetLineName}`
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: g(s.amount, s.currency) })
            ]
          },
          s.id
        ))
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: i ? `Aday belgeler · ${i.title}` : "Aday belgeler" }),
        i ? f.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Eşik üstünde aday yok. Sağdaki listeden elle bağlayabilirsiniz." }) : f.map((s) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-candidate", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start justify-content-between gap-2", children: [
            /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
              /* @__PURE__ */ e.jsx("div", { className: "text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: s.displayName }),
              /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                g(s.amount),
                " · ",
                j(s.documentDate)
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(R, { variant: s.isStrong ? "positive" : "warning", size: "sm", children: s.score })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-1 mt-2", children: [
            /* @__PURE__ */ e.jsx(O, { label: "tutar", value: s.amountScore, max: 50 }),
            /* @__PURE__ */ e.jsx(O, { label: "tarih", value: s.dateScore, max: 30 }),
            /* @__PURE__ */ e.jsx(O, { label: "tedarikçi", value: s.supplierScore, max: 20 })
          ] }),
          s.reasons.length > 0 && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)", marginTop: 4 }, children: s.reasons.join(" · ") }),
          i.budgetLineName && /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 10.5, color: "var(--apya-accent-500)", marginTop: 4 }, children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-link" }),
            " Bağlanınca «",
            i.budgetLineName,
            "» kalemi belgeli olur."
          ] }),
          /* @__PURE__ */ e.jsx(
            B,
            {
              variant: "primary",
              size: "sm",
              className: "mt-2 w-100",
              disabled: y,
              onClick: () => z(s.documentFileId),
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
              g(s.amount),
              " · ",
              j(s.documentDate),
              s.documentTypeName && ` · ${s.documentTypeName}`
            ] }),
            s.duplicateOf && /* @__PURE__ */ e.jsx(R, { variant: "negative", size: "sm", children: je[s.duplicateOf] })
          ] }),
          i && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "apya-doc-linkbtn",
              disabled: y,
              onClick: () => z(s.id),
              children: "Bağla"
            }
          )
        ] }, s.id))
      ] })
    ] }),
    c.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card mt-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline", children: [
        "Kurulmuş eşleşmeler (",
        c.length,
        ")"
      ] }),
      c.map((s) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", style: { gridTemplateColumns: "70px minmax(0,1fr) minmax(0,1fr) 90px" }, children: [
        /* @__PURE__ */ e.jsx(R, { variant: "neutral", size: "sm", children: s.annexNumber || s.score }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: s.documentFileName }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { fontSize: 12 }, children: [
          s.expenseTitle,
          " · ",
          g(s.expenseAmount)
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "text-end", children: /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: "apya-doc-linkbtn",
            disabled: y,
            onClick: async () => {
              l(!0), await pe(s.id), await N(), l(!1);
            },
            children: "Kaldır"
          }
        ) })
      ] }, s.id))
    ] })
  ] }) : null : /* @__PURE__ */ e.jsx("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: /* @__PURE__ */ e.jsx(
    K,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-link" }),
      title: "Proje bağlamı gerekiyor",
      description: "Bu sayfa bir proje bağlamından açılır (?projectId=...)."
    }
  ) });
}
const $ = (...a) => a.filter(Boolean).join(" "), q = {
  Project: { icon: "fa-diagram-project", label: "Proje" },
  WorkStep: { icon: "fa-list-check", label: "İş adımı" },
  UnassignedGroup: { icon: "fa-folder-open", label: "—" },
  Document: { icon: "fa-file-lines", label: "Belge" },
  MissingItem: { icon: "fa-triangle-exclamation", label: "Eksik" },
  TaskGroup: { icon: "fa-layer-group", label: "—" },
  Task: { icon: "fa-square-check", label: "Görev" },
  SubTask: { icon: "fa-turn-up", label: "Alt görev" }
}, ve = {
  None: null,
  Planned: { label: "Planlı", variant: "neutral" },
  InProgress: { label: "Devam", variant: "brand" },
  Done: { label: "Tamam", variant: "positive" },
  Late: { label: "Gecikti", variant: "negative" },
  Cancelled: { label: "İptal", variant: "neutral" },
  Draft: { label: "Taslak", variant: "neutral" },
  Final: { label: "Kesin", variant: "positive" },
  Matched: { label: "Eşleşti", variant: "positive" },
  Expired: { label: "Süre dolan", variant: "negative" },
  Missing: { label: "Eksik", variant: "negative" }
}, be = ["", "Project", "WorkStep", "UnassignedGroup", "Document", "MissingItem", "TaskGroup", "Task", "SubTask"], Ne = ["None", "Planned", "InProgress", "Done", "Late", "Cancelled", "Draft", "Final", "Matched", "Expired", "Missing"], F = (a) => typeof a.kind == "number" ? be[a.kind] : a.kind, ke = (a) => typeof a.status == "number" ? Ne[a.status] : a.status;
function Se(a) {
  return a >= 85 ? "var(--apya-positive-500)" : a >= 60 ? "var(--apya-warning-500)" : "var(--apya-negative-500)";
}
function ze(a) {
  return a.startDate && a.endDate ? `${j(a.startDate)} — ${j(a.endDate)}` : a.startDate ? j(a.startDate) : a.endDate ? j(a.endDate) : "—";
}
function we({ row: a, isOpen: t, onToggle: m, currency: c }) {
  const d = F(a) || "Document", i = ve[ke(a)], p = q[d] ?? q.Document, f = d === "Project" || d === "WorkStep" || d === "TaskGroup" || d === "UnassignedGroup";
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: $("apya-doc-row apya-doc-scope-row", f && "is-group", d === "MissingItem" && "is-missing"),
      style: { gridTemplateColumns: "minmax(0,1fr) 96px 104px 132px 156px 64px 128px 120px" },
      onClick: a.hasChildren ? m : void 0,
      role: a.hasChildren ? "button" : void 0,
      tabIndex: a.hasChildren ? 0 : void 0,
      onKeyDown: a.hasChildren ? (v) => {
        (v.key === "Enter" || v.key === " ") && (v.preventDefault(), m());
      } : void 0,
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2 text-truncate", style: { paddingLeft: a.depth * 20 }, children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-doc-scope-caret", children: a.hasChildren ? /* @__PURE__ */ e.jsx("i", { className: $("fa", t ? "fa-chevron-down" : "fa-chevron-right") }) : null }),
          /* @__PURE__ */ e.jsx("span", { className: $("apya-doc-scope-icon", `is-${d.toLowerCase()}`), children: /* @__PURE__ */ e.jsx("i", { className: `fa ${p.icon}` }) }),
          /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "text-truncate",
              style: { fontSize: 12.5, fontWeight: a.depth === 0 ? 600 : a.depth === 1 ? 500 : 400 },
              title: a.name,
              children: a.name
            }
          )
        ] }),
        /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11.5, color: "var(--apya-text-secondary)" }, className: "text-truncate", children: a.typeName ?? p.label }),
        /* @__PURE__ */ e.jsx("span", { children: i ? /* @__PURE__ */ e.jsx(R, { variant: i.variant, size: "sm", children: i.label }) : null }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 11.5, color: "var(--apya-text-secondary)" }, children: a.ownerName ?? "—" }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: ze(a) }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, textAlign: "center", color: "var(--apya-text-secondary)" }, children: a.documentCount > 0 ? a.documentCount : "—" }),
        /* @__PURE__ */ e.jsx(
          "span",
          {
            className: "apya-numeric",
            style: { fontSize: 11.5, textAlign: "right", color: a.amount ? "var(--apya-text-primary)" : "var(--apya-text-tertiary)" },
            children: a.amount ? g(a.amount, c) : "—"
          }
        ),
        a.compliancePercent === null || a.compliancePercent === void 0 ? /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)", textAlign: "right" }, children: "—" }) : /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("div", { className: "apya-doc-progress", style: { flex: 1 }, children: /* @__PURE__ */ e.jsx("div", { style: { width: `${a.compliancePercent}%`, background: Se(a.compliancePercent) } }) }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
            "%",
            a.compliancePercent
          ] })
        ] })
      ]
    }
  );
}
function Te() {
  const a = new URLSearchParams(window.location.search).get("projectId"), [t, m] = r.useState(null), [c, d] = r.useState({}), [i, p] = r.useState(/* @__PURE__ */ new Set()), [f, v] = r.useState(!0), [M, C] = r.useState(!1), [y, l] = r.useState(a ?? null), [N, A] = r.useState(!1), [z, s] = r.useState(""), [k, L] = r.useState(""), P = se.useRef(c);
  r.useEffect(() => {
    P.current = c;
  }, [c]);
  const E = r.useCallback(async (n) => {
    if (!(!n || P.current[n]))
      try {
        const o = await ue(n);
        P.current = { ...P.current, [n]: o.rows }, d(P.current);
      } catch {
        I("error", "Proje dalı yüklenemedi.");
      }
  }, []);
  r.useEffect(() => {
    (async () => {
      try {
        const n = await me();
        m(n);
        const o = a ? n.rows.find((h) => String(h.entityId).toLowerCase() === a.toLowerCase()) : null;
        o && (p(/* @__PURE__ */ new Set([o.id])), await E(o.entityId));
      } catch {
        I("error", "Kapsam yüklenemedi.");
      } finally {
        v(!1);
      }
    })();
  }, [a, E]);
  const X = r.useCallback(async (n) => {
    const o = n.id, h = !i.has(o);
    p((D) => {
      const w = new Set(D);
      return w.has(o) ? w.delete(o) : w.add(o), w;
    }), h && F(n) === "Project" && l(n.entityId), h && n.isLazy && n.entityId && await E(n.entityId);
  }, [i, E]), ee = r.useCallback(async () => {
    if (!t) return;
    if (t.rows.every((o) => i.has(o.id))) {
      p(/* @__PURE__ */ new Set());
      return;
    }
    C(!0);
    try {
      await Promise.all(t.rows.filter((o) => o.entityId).map((o) => E(o.entityId))), p((o) => {
        const h = new Set(o);
        return t.rows.forEach((D) => h.add(D.id)), Object.values(P.current).forEach((D) => {
          D.forEach((w) => {
            w.hasChildren && h.add(w.id);
          });
        }), h;
      });
    } finally {
      C(!1);
    }
  }, [t, i, E]), ae = r.useMemo(() => {
    if (!t) return [];
    const n = /* @__PURE__ */ new Map(), o = [], h = (x) => {
      n.set(x.id, x), o.push(x);
    };
    t.rows.forEach((x) => {
      h(x), (c[x.entityId] ?? []).forEach(h);
    });
    const D = (x) => {
      var H;
      let b = x.parentId;
      for (; b; ) {
        if (!i.has(b)) return !1;
        b = ((H = n.get(b)) == null ? void 0 : H.parentId) ?? null;
      }
      return !0;
    }, w = (x) => {
      const b = F(x);
      return b === "Project" || b === "WorkStep" || b === "TaskGroup" || b === "UnassignedGroup" ? !0 : !(N && b !== "MissingItem" || z && b !== z || k && x.ownerName !== k);
    };
    return o.filter((x) => D(x) && w(x));
  }, [t, c, i, N, z, k]), te = r.useMemo(() => {
    const n = /* @__PURE__ */ new Set();
    return Object.values(c).forEach((o) => o.forEach((h) => {
      h.ownerName && n.add(h.ownerName);
    })), [...n].sort((o, h) => o.localeCompare(h, "tr"));
  }, [c]);
  if (f) return /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx(U, { rows: 8 }) });
  if (!t || t.rows.length === 0)
    return /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx(
      K,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-diagram-project" }),
        title: "Henüz proje yok",
        description: "Kapsam ağacı projelerden doğar; önce bir proje oluşturun.",
        action: /* @__PURE__ */ e.jsx(B, { asChild: !0, children: /* @__PURE__ */ e.jsx("a", { href: `${W()}Projects`, children: "Projelere git" }) })
      }
    ) });
  const u = t.rollup, _ = t.rows.every((n) => i.has(n.id));
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-end gap-3 mb-4 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h1", { style: { fontSize: 20, fontWeight: 700, margin: 0 }, children: "Proje kapsamı" }),
        /* @__PURE__ */ e.jsx("p", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", margin: "4px 0 0" }, children: "Projeler, iş adımları, görevler ve bunlara bağlı belge · tutar · uygunluk" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      /* @__PURE__ */ e.jsxs(B, { variant: "outline", size: "sm", onClick: ee, isLoading: M, children: [
        /* @__PURE__ */ e.jsx("i", { className: $("fa", _ ? "fa-compress" : "fa-expand") }),
        _ ? " Hepsini kapat" : " Hepsini aç"
      ] }),
      y ? /* @__PURE__ */ e.jsx(B, { asChild: !0, size: "sm", children: /* @__PURE__ */ e.jsxs("a", { href: `${W()}Documents/ReportBuilder?projectId=${y}`, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-export" }),
        " Kapsamı raporla"
      ] }) }) : /* @__PURE__ */ e.jsxs(B, { size: "sm", disabled: !0, title: "Raporlamak için bir proje açın", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-export" }),
        " Kapsamı raporla"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpis", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Proje" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: u.projectCount })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Belge" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: u.documentCount })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Belgelenmiş tutar" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", style: { fontSize: 18 }, children: g(u.totalAmount, u.currency) }),
        u.hasMixedCurrency && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11, color: "var(--apya-warning-600, #B45309)" }, children: "Farklı para birimli kalemler toplama katılmadı." })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Ortalama uygunluk" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: u.averageCompliancePercent === null || u.averageCompliancePercent === void 0 ? "—" : `%${u.averageCompliancePercent}` }),
        /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: u.missingCount > 0 ? `${u.missingCount} eksik kalem` : "kontrol listesi olan projeler" })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card mt-3 p-0", style: { overflow: "hidden" }, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", style: { padding: "12px 14px" }, children: [
        /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "Proje → iş adımı → belge · görev" }),
        /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
        /* @__PURE__ */ e.jsxs(
          "select",
          {
            className: "apya-doc-select",
            value: z,
            onChange: (n) => s(n.target.value),
            "aria-label": "Tür süz",
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Tür: tümü" }),
              /* @__PURE__ */ e.jsx("option", { value: "Document", children: "Belge" }),
              /* @__PURE__ */ e.jsx("option", { value: "MissingItem", children: "Eksik kalem" }),
              /* @__PURE__ */ e.jsx("option", { value: "Task", children: "Görev" }),
              /* @__PURE__ */ e.jsx("option", { value: "SubTask", children: "Alt görev" })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(
          "select",
          {
            className: "apya-doc-select",
            value: k,
            onChange: (n) => L(n.target.value),
            "aria-label": "Sorumlu süz",
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Sorumlu: tümü" }),
              te.map((n) => /* @__PURE__ */ e.jsx("option", { value: n, children: n }, n))
            ]
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: $("apya-doc-filterchip", N && "is-active"),
            onClick: () => A((n) => !n),
            children: "Sadece eksikler"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "apya-doc-row apya-doc-row-head apya-doc-scope-row",
          style: { gridTemplateColumns: "minmax(0,1fr) 96px 104px 132px 156px 64px 128px 120px" },
          children: [
            /* @__PURE__ */ e.jsx("span", { children: "Kalem" }),
            /* @__PURE__ */ e.jsx("span", { children: "Tür" }),
            /* @__PURE__ */ e.jsx("span", { children: "Durum" }),
            /* @__PURE__ */ e.jsx("span", { children: "Sorumlu" }),
            /* @__PURE__ */ e.jsx("span", { children: "Tarih" }),
            /* @__PURE__ */ e.jsx("span", { style: { textAlign: "center" }, children: "Belge" }),
            /* @__PURE__ */ e.jsx("span", { style: { textAlign: "right" }, children: "Tutar" }),
            /* @__PURE__ */ e.jsx("span", { style: { textAlign: "right" }, children: "Uygunluk" })
          ]
        }
      ),
      ae.map((n) => /* @__PURE__ */ e.jsx(
        we,
        {
          row: n,
          isOpen: i.has(n.id),
          onToggle: () => X(n),
          currency: u.currency
        },
        n.id
      )),
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "apya-doc-row apya-doc-scope-row is-total",
          style: { gridTemplateColumns: "minmax(0,1fr) 96px 104px 132px 156px 64px 128px 120px", cursor: "default" },
          children: [
            /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 12, fontWeight: 600 }, children: [
              "Toplam · ",
              u.projectCount,
              " proje"
            ] }),
            /* @__PURE__ */ e.jsx("span", {}),
            /* @__PURE__ */ e.jsx("span", {}),
            /* @__PURE__ */ e.jsx("span", {}),
            /* @__PURE__ */ e.jsx("span", {}),
            /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, textAlign: "center" }, children: u.documentCount }),
            /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, textAlign: "right", fontWeight: 600 }, children: g(u.totalAmount, u.currency) }),
            /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, textAlign: "right" }, children: u.averageCompliancePercent === null || u.averageCompliancePercent === void 0 ? "—" : `%${u.averageCompliancePercent} ort.` })
          ]
        }
      )
    ] })
  ] });
}
const V = document.getElementById("project-timeline-island");
V && G(V).render(/* @__PURE__ */ e.jsx(xe, {}));
const J = document.getElementById("document-matching-island");
J && G(J).render(/* @__PURE__ */ e.jsx(ge, {}));
const Z = document.getElementById("project-scope-island");
Z && G(Z).render(/* @__PURE__ */ e.jsx(Te, {}));
