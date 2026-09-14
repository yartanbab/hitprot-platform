import { r, j as e, d as de, b as K } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { B as I, e as L } from "./Dialog-Bky2XNdc.js";
import { S as H } from "./SkeletonShape-BzeBQ1R3.js";
import { E as _ } from "./EmptyState-D5m5kdmR.js";
import { E as Y, D as q, P as V } from "./ProcessRibbon-BtZ1ri4F.js";
const A = (a, t) => {
  var m, c, d;
  return (d = (c = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : c[a]) == null ? void 0 : d.call(c, t);
}, $ = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function D(a) {
  return new Promise((t, m) => {
    window.abp.ajax(a).done(t).fail(m);
  });
}
const k = (a, t, m = {}) => {
  const c = new URLSearchParams();
  Object.entries(m).forEach(([l, p]) => {
    p != null && p !== "" && c.append(l, p);
  });
  const d = c.toString();
  return `${$()}Documents/${a}?handler=${t}${d ? "&" + d : ""}`;
}, se = (a, t) => D({ url: a, type: "POST", contentType: "application/json", data: JSON.stringify(t) }), pe = (a) => D({ url: k("Timeline", "Timeline", { projectId: a }), type: "GET" }), me = (a) => se(k("Timeline", "CreateRisk"), a), ue = (a, t) => D({ url: k("Timeline", "SetRiskClosed", { id: a, isClosed: t }), type: "POST" }), ye = (a) => D({ url: k("Matching", "Board", { projectId: a }), type: "GET" }), he = (a) => D({ url: k("Matching", "Candidates", { expenseId: a }), type: "GET" }), xe = (a) => D({ url: k("Matching", "Matches", { projectId: a }), type: "GET" }), je = (a) => se(k("Matching", "CreateMatch"), a), fe = (a) => D({ url: k("Matching", "RemoveMatch", { matchId: a }), type: "POST" }), ge = () => D({ url: k("Scope", "Overview"), type: "GET" }), ve = (a) => D({ url: k("Scope", "Branch", { projectId: a }), type: "GET" }), g = (a, t = "TRY") => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + " " + ({ TRY: "₺", USD: "$", EUR: "€" }[t] || t), X = (a, t = 1) => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: t }).format(a), f = (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—";
function be(a) {
  return a >= 15 ? "negative" : a >= 8 ? "warning" : "neutral";
}
function ke({ step: a, projectStart: t, projectEnd: m }) {
  const c = a.startDate ? new Date(a.startDate) : null, d = a.endDate ? new Date(a.endDate) : null;
  if (!c || !d || !t || !m)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-gantt-track", children: /* @__PURE__ */ e.jsx("span", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)", paddingLeft: 6 }, children: "tarih girilmemiş" }) });
  const l = m - t, p = l > 0 ? (c - t) / l * 100 : 0, j = l > 0 ? Math.max((d - c) / l * 100, 2) : 100;
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-gantt-track", children: /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "apya-doc-gantt-bar",
      style: {
        left: `${Math.max(0, Math.min(p, 100))}%`,
        width: `${Math.min(j, 100)}%`,
        background: a.progressPercent >= 100 ? "var(--apya-positive-500)" : "var(--apya-accent-500)"
      },
      title: `${f(a.startDate)} – ${f(a.endDate)} · %${a.progressPercent}`
    }
  ) });
}
function Ne() {
  const a = new URLSearchParams(window.location.search).get("projectId"), [t, m] = r.useState(null), [c, d] = r.useState(!0), [l, p] = r.useState(!1), j = r.useCallback(async () => {
    if (!a) {
      d(!1);
      return;
    }
    d(!0);
    try {
      m(await pe(a));
    } catch (i) {
      A("error", "Zaman çizelgesi yüklenemedi."), console.error("[Timeline] load", i);
    } finally {
      d(!1);
    }
  }, [a]);
  r.useEffect(() => {
    j();
  }, [j]);
  const v = async () => {
    const i = window.prompt("Risk başlığı:");
    if (!i) return;
    const R = Number(window.prompt("Olasılık (1-5):", "3")) || 3, S = Number(window.prompt("Etki (1-5):", "3")) || 3, E = window.prompt("Önlem (boş bırakılabilir):") || null;
    p(!0);
    try {
      await me({ projectId: a, title: i, likelihood: R, impact: S, mitigation: E }), await j();
    } catch {
      A("error", "Risk eklenemedi.");
    } finally {
      p(!1);
    }
  }, T = (i) => /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsx(
      q,
      {
        title: (t == null ? void 0 : t.projectName) ?? "Zaman çizelgesi & bütçe",
        description: t ? `${f(t.startDate)} – ${f(t.endDate)} · ${t.steps.length} iş adımı` : "İş adımları, bütçe-belge kapsaması ve risk kütüğü"
      }
    ),
    /* @__PURE__ */ e.jsx(V, { active: null, projectId: a }),
    i
  ] });
  if (!a)
    return T(
      /* @__PURE__ */ e.jsx(
        _,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-diagram-project" }),
          title: "Proje bağlamı gerekiyor",
          description: "Bu sayfa bir proje bağlamından açılır (?projectId=...).",
          action: /* @__PURE__ */ e.jsx(
            Y,
            {
              primary: /* @__PURE__ */ e.jsx(I, { asChild: !0, children: /* @__PURE__ */ e.jsx("a", { href: `${$()}Projects`, children: "Projelere git" }) }),
              link: { label: "veya proje kapsamını aç", href: `${$()}Documents/Scope` }
            }
          )
        }
      )
    );
  if (c) return T(/* @__PURE__ */ e.jsx(H, { rows: 8 }));
  if (!t) return null;
  const C = t.startDate ? new Date(t.startDate) : null, N = t.endDate ? new Date(t.endDate) : null, y = t.budget;
  return T(
    /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
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
          /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: X(t.capacity.loggedPersonDays) }),
          /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
            "tahmin ",
            X(t.capacity.estimatedPersonDays),
            " gün"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card mb-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "İş planı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
            f(t.startDate),
            " — ",
            f(t.endDate)
          ] })
        ] }),
        t.steps.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Tanımlı iş adımı yok." }) : t.steps.map((i) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-gantt-row", children: [
          /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: [
            i.order,
            " · ",
            i.name
          ] }),
          /* @__PURE__ */ e.jsx(ke, { step: i, projectStart: C, projectEnd: N }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, textAlign: "right" }, children: [
            "%",
            i.progressPercent
          ] }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, textAlign: "right" }, children: [
            i.documentCount,
            " belge"
          ] })
        ] }, i.id))
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "Risk kütüğü" }),
          /* @__PURE__ */ e.jsxs(I, { variant: "outline", size: "sm", disabled: l, onClick: v, children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
            " Risk ekle"
          ] })
        ] }),
        t.risks.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Kayıtlı risk yok." }) : t.risks.map((i) => /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "apya-doc-check-row",
            style: { gridTemplateColumns: "70px minmax(0,1fr) 120px 110px", opacity: i.isClosed ? 0.55 : 1 },
            children: [
              /* @__PURE__ */ e.jsx(L, { variant: be(i.score), size: "sm", children: i.score }),
              /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
                /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5 }, children: i.title }),
                i.mitigation && /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: i.mitigation })
              ] }),
              /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
                "olasılık ",
                i.likelihood,
                " · etki ",
                i.impact
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "text-end", children: /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "apya-doc-linkbtn",
                  disabled: l,
                  onClick: async () => {
                    p(!0), await ue(i.id, !i.isClosed), await j(), p(!1);
                  },
                  children: i.isClosed ? "Aç" : "Kapat"
                }
              ) })
            ]
          },
          i.id
        ))
      ] })
    ] })
  );
}
const Se = (...a) => a.filter(Boolean).join(" "), we = {
  1: "Aynı dosya başka bir belgede de var",
  2: "Bu harcamaya zaten belge bağlı",
  3: "Aynı tutar/tarih/tedarikçi başka belgede"
};
function W({ label: a, value: t, max: m }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)", width: 62 }, children: a }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-doc-progress", style: { flex: 1, height: 4 }, children: /* @__PURE__ */ e.jsx("div", { style: { width: `${t / m * 100}%`, background: "var(--apya-accent-500)" } }) }),
    /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 10.5, width: 26, textAlign: "right" }, children: t })
  ] });
}
function ze() {
  const a = new URLSearchParams(window.location.search).get("projectId"), [t, m] = r.useState(null), [c, d] = r.useState([]), [l, p] = r.useState(null), [j, v] = r.useState([]), [T, C] = r.useState(!0), [N, y] = r.useState(!1), i = r.useCallback(async () => {
    if (!a) {
      C(!1);
      return;
    }
    C(!0);
    try {
      const [n, w] = await Promise.all([ye(a), xe(a)]);
      m(n), d(w ?? []);
    } catch (n) {
      A("error", "Eşleştirme tezgâhı yüklenemedi."), console.error("[Matching] load", n);
    } finally {
      C(!1);
    }
  }, [a]);
  r.useEffect(() => {
    i();
  }, [i]);
  const R = async (n) => {
    p(n), v([]);
    try {
      v(await he(n.id) ?? []);
    } catch (w) {
      console.error("[Matching] candidates", w);
    }
  }, S = async (n) => {
    if (!l) return;
    const w = window.prompt("EK numarası (boş bırakılabilir):") || null;
    y(!0);
    try {
      await je({ documentFileId: n, expenseId: l.id, annexNumber: w }), p(null), v([]), await i();
    } catch (P) {
      A("error", "Bağlama başarısız oldu."), console.error("[Matching] createMatch", P);
    } finally {
      y(!1);
    }
  }, E = (n) => /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsx(
      q,
      {
        title: "Harcama ↔ belge eşleştirme",
        description: t ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          t.expenses.length,
          " belgesiz harcama · toplam",
          " ",
          /* @__PURE__ */ e.jsx("strong", { style: { color: "var(--apya-negative-500)" }, children: g(t.undocumentedTotal) })
        ] }) : "Belgesiz harcamaları belgelerle eşleştirin",
        menuItems: [
          a && {
            key: "timeline",
            label: "Zaman çizelgesine dön",
            icon: "fa-arrow-left",
            href: `${window.abp.appPath}Documents/Timeline?projectId=${a}`
          }
        ]
      }
    ),
    /* @__PURE__ */ e.jsx(V, { active: "docs", projectId: a }),
    n
  ] });
  return a ? T ? E(/* @__PURE__ */ e.jsx(H, { rows: 8 })) : t ? E(
    /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-matchboard", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
          /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Belgesiz harcamalar" }),
          t.expenses.length === 0 ? /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 12, color: "var(--apya-positive-500)" }, children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-check" }),
            " Tüm harcamalar belgeli."
          ] }) : t.expenses.map((n) => /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: Se("apya-md-item", (l == null ? void 0 : l.id) === n.id && "selected"),
              style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 },
              onClick: () => R(n),
              children: [
                /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1, textAlign: "left" }, children: [
                  /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: n.title }),
                  /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                    f(n.expenseDate),
                    n.supplierName && ` · ${n.supplierName}`,
                    n.budgetLineName && ` · ${n.budgetLineName}`
                  ] })
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: g(n.amount, n.currency) })
              ]
            },
            n.id
          ))
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
          /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: l ? `Aday belgeler · ${l.title}` : "Aday belgeler" }),
          l ? j.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Eşik üstünde aday yok. Sağdaki listeden elle bağlayabilirsiniz." }) : j.map((n, w) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-candidate", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start justify-content-between gap-2", children: [
              /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
                /* @__PURE__ */ e.jsx("div", { className: "text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: n.displayName }),
                /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                  g(n.amount),
                  " · ",
                  f(n.documentDate)
                ] })
              ] }),
              /* @__PURE__ */ e.jsx(L, { variant: n.isStrong ? "positive" : "warning", size: "sm", children: n.score })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-1 mt-2", children: [
              /* @__PURE__ */ e.jsx(W, { label: "tutar", value: n.amountScore, max: 50 }),
              /* @__PURE__ */ e.jsx(W, { label: "tarih", value: n.dateScore, max: 30 }),
              /* @__PURE__ */ e.jsx(W, { label: "tedarikçi", value: n.supplierScore, max: 20 })
            ] }),
            n.reasons.length > 0 && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)", marginTop: 4 }, children: n.reasons.join(" · ") }),
            l.budgetLineName && /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 10.5, color: "var(--apya-accent-500)", marginTop: 4 }, children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa fa-link" }),
              " Bağlanınca «",
              l.budgetLineName,
              "» kalemi belgeli olur."
            ] }),
            /* @__PURE__ */ e.jsx(
              I,
              {
                variant: w === 0 ? "primary" : "outline",
                size: "sm",
                className: "mt-2 w-100",
                disabled: N,
                onClick: () => S(n.documentFileId),
                children: "Bağla + EK no ata"
              }
            )
          ] }, n.documentFileId)) : /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Soldan bir harcama seçin; sistem tutar, tarih ve tedarikçi yakınlığına göre aday sıralar." })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
          /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Bağlanmamış belgeler" }),
          t.documents.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bağlanmamış belge yok." }) : t.documents.map((n) => /* @__PURE__ */ e.jsxs("div", { className: "apya-md-item", style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 }, children: [
            /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1 }, children: [
              /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5 }, children: n.displayName }),
              /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                g(n.amount),
                " · ",
                f(n.documentDate),
                n.documentTypeName && ` · ${n.documentTypeName}`
              ] }),
              n.duplicateOf && /* @__PURE__ */ e.jsx(L, { variant: "negative", size: "sm", children: we[n.duplicateOf] })
            ] }),
            l && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: N,
                onClick: () => S(n.id),
                children: "Bağla"
              }
            )
          ] }, n.id))
        ] })
      ] }),
      c.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card mt-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline", children: [
          "Kurulmuş eşleşmeler (",
          c.length,
          ")"
        ] }),
        c.map((n) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", style: { gridTemplateColumns: "70px minmax(0,1fr) minmax(0,1fr) 90px" }, children: [
          /* @__PURE__ */ e.jsx(L, { variant: "neutral", size: "sm", children: n.annexNumber || n.score }),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: n.documentFileName }),
          /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { fontSize: 12 }, children: [
            n.expenseTitle,
            " · ",
            g(n.expenseAmount)
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: "text-end", children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "apya-doc-linkbtn",
              disabled: N,
              onClick: async () => {
                y(!0), await fe(n.id), await i(), y(!1);
              },
              children: "Kaldır"
            }
          ) })
        ] }, n.id))
      ] })
    ] })
  ) : null : E(
    /* @__PURE__ */ e.jsx(
      _,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-link" }),
        title: "Proje bağlamı gerekiyor",
        description: "Bu sayfa bir proje bağlamından açılır (?projectId=...).",
        action: /* @__PURE__ */ e.jsx(
          Y,
          {
            primary: /* @__PURE__ */ e.jsx(I, { asChild: !0, children: /* @__PURE__ */ e.jsx("a", { href: `${window.abp.appPath}Projects`, children: "Projelere git" }) }),
            link: { label: "veya proje kapsamını aç", href: `${window.abp.appPath}Documents/Scope` }
          }
        )
      }
    )
  );
}
const O = (...a) => a.filter(Boolean).join(" "), ee = {
  Project: { icon: "fa-diagram-project", label: "Proje" },
  WorkStep: { icon: "fa-list-check", label: "İş adımı" },
  UnassignedGroup: { icon: "fa-folder-open", label: "—" },
  Document: { icon: "fa-file-lines", label: "Belge" },
  MissingItem: { icon: "fa-triangle-exclamation", label: "Eksik" },
  TaskGroup: { icon: "fa-layer-group", label: "—" },
  Task: { icon: "fa-square-check", label: "Görev" },
  SubTask: { icon: "fa-turn-up", label: "Alt görev" }
}, De = {
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
}, Ce = ["", "Project", "WorkStep", "UnassignedGroup", "Document", "MissingItem", "TaskGroup", "Task", "SubTask"], Pe = ["None", "Planned", "InProgress", "Done", "Late", "Cancelled", "Draft", "Final", "Matched", "Expired", "Missing"], U = (a) => typeof a.kind == "number" ? Ce[a.kind] : a.kind, Te = (a) => typeof a.status == "number" ? Pe[a.status] : a.status;
function Ee(a) {
  return a >= 85 ? "var(--apya-positive-500)" : a >= 60 ? "var(--apya-warning-500)" : "var(--apya-negative-500)";
}
function Be(a) {
  return a.startDate && a.endDate ? `${f(a.startDate)} — ${f(a.endDate)}` : a.startDate ? f(a.startDate) : a.endDate ? f(a.endDate) : "—";
}
function Ie({ row: a, isOpen: t, onToggle: m, currency: c }) {
  const d = U(a) || "Document", l = De[Te(a)], p = ee[d] ?? ee.Document, j = d === "Project" || d === "WorkStep" || d === "TaskGroup" || d === "UnassignedGroup";
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: O("apya-doc-row apya-doc-scope-row", j && "is-group", d === "MissingItem" && "is-missing"),
      style: { gridTemplateColumns: "minmax(0,1fr) 96px 104px 132px 156px 64px 128px 120px" },
      onClick: a.hasChildren ? m : void 0,
      role: a.hasChildren ? "button" : void 0,
      tabIndex: a.hasChildren ? 0 : void 0,
      onKeyDown: a.hasChildren ? (v) => {
        (v.key === "Enter" || v.key === " ") && (v.preventDefault(), m());
      } : void 0,
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2 text-truncate", style: { paddingLeft: a.depth * 20 }, children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-doc-scope-caret", children: a.hasChildren ? /* @__PURE__ */ e.jsx("i", { className: O("fa", t ? "fa-chevron-down" : "fa-chevron-right") }) : null }),
          /* @__PURE__ */ e.jsx("span", { className: O("apya-doc-scope-icon", `is-${d.toLowerCase()}`), children: /* @__PURE__ */ e.jsx("i", { className: `fa ${p.icon}` }) }),
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
        /* @__PURE__ */ e.jsx("span", { children: l ? /* @__PURE__ */ e.jsx(L, { variant: l.variant, size: "sm", children: l.label }) : null }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 11.5, color: "var(--apya-text-secondary)" }, children: a.ownerName ?? "—" }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: Be(a) }),
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
          /* @__PURE__ */ e.jsx("div", { className: "apya-doc-progress", style: { flex: 1 }, children: /* @__PURE__ */ e.jsx("div", { style: { width: `${a.compliancePercent}%`, background: Ee(a.compliancePercent) } }) }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
            "%",
            a.compliancePercent
          ] })
        ] })
      ]
    }
  );
}
function Me() {
  var J;
  const a = new URLSearchParams(window.location.search).get("projectId"), [t, m] = r.useState(null), [c, d] = r.useState({}), [l, p] = r.useState(/* @__PURE__ */ new Set()), [j, v] = r.useState(!0), [T, C] = r.useState(!1), [N, y] = r.useState(a ?? null), [i, R] = r.useState(!1), [S, E] = r.useState(""), [n, w] = r.useState(""), P = de.useRef(c);
  r.useEffect(() => {
    P.current = c;
  }, [c]);
  const M = r.useCallback(async (s) => {
    if (!(!s || P.current[s]))
      try {
        const o = await ve(s);
        P.current = { ...P.current, [s]: o.rows }, d(P.current);
      } catch {
        A("error", "Proje dalı yüklenemedi.");
      }
  }, []);
  r.useEffect(() => {
    (async () => {
      try {
        const s = await ge();
        m(s);
        const o = a ? s.rows.find((h) => String(h.entityId).toLowerCase() === a.toLowerCase()) : null;
        o && (p(/* @__PURE__ */ new Set([o.id])), await M(o.entityId));
      } catch {
        A("error", "Kapsam yüklenemedi.");
      } finally {
        v(!1);
      }
    })();
  }, [a, M]);
  const ie = r.useCallback(async (s) => {
    const o = s.id, h = !l.has(o);
    p((B) => {
      const z = new Set(B);
      return z.has(o) ? z.delete(o) : z.add(o), z;
    }), h && U(s) === "Project" && y(s.entityId), h && s.isLazy && s.entityId && await M(s.entityId);
  }, [l, M]), le = r.useCallback(async () => {
    if (!t) return;
    if (t.rows.every((o) => l.has(o.id))) {
      p(/* @__PURE__ */ new Set());
      return;
    }
    C(!0);
    try {
      await Promise.all(t.rows.filter((o) => o.entityId).map((o) => M(o.entityId))), p((o) => {
        const h = new Set(o);
        return t.rows.forEach((B) => h.add(B.id)), Object.values(P.current).forEach((B) => {
          B.forEach((z) => {
            z.hasChildren && h.add(z.id);
          });
        }), h;
      });
    } finally {
      C(!1);
    }
  }, [t, l, M]), re = r.useMemo(() => {
    if (!t) return [];
    const s = /* @__PURE__ */ new Map(), o = [], h = (x) => {
      s.set(x.id, x), o.push(x);
    };
    t.rows.forEach((x) => {
      h(x), (c[x.entityId] ?? []).forEach(h);
    });
    const B = (x) => {
      var Q;
      let b = x.parentId;
      for (; b; ) {
        if (!l.has(b)) return !1;
        b = ((Q = s.get(b)) == null ? void 0 : Q.parentId) ?? null;
      }
      return !0;
    }, z = (x) => {
      const b = U(x);
      return b === "Project" || b === "WorkStep" || b === "TaskGroup" || b === "UnassignedGroup" ? !0 : !(i && b !== "MissingItem" || S && b !== S || n && x.ownerName !== n);
    };
    return o.filter((x) => B(x) && z(x));
  }, [t, c, l, i, S, n]), ce = r.useMemo(() => {
    const s = /* @__PURE__ */ new Set();
    return Object.values(c).forEach((o) => o.forEach((h) => {
      h.ownerName && s.add(h.ownerName);
    })), [...s].sort((o, h) => o.localeCompare(h, "tr"));
  }, [c]), F = !!((J = t == null ? void 0 : t.rows) != null && J.length), Z = F && t.rows.every((s) => l.has(s.id)), oe = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      q,
      {
        title: "Proje kapsamı",
        description: "Projeler, iş adımları, görevler ve bunlara bağlı belge · tutar · uygunluk",
        primary: F && (N ? /* @__PURE__ */ e.jsx(I, { asChild: !0, leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-export" }), children: /* @__PURE__ */ e.jsx("a", { href: `${$()}Documents/ReportBuilder?projectId=${N}`, children: "Kapsamı raporla" }) }) : /* @__PURE__ */ e.jsx(I, { disabled: !0, title: "Raporlamak için bir proje açın", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-export" }), children: "Kapsamı raporla" })),
        menuItems: [
          F && {
            key: "expand",
            label: Z ? "Hepsini kapat" : "Hepsini aç",
            icon: Z ? "fa-compress" : "fa-expand",
            disabled: T,
            onSelect: le
          }
        ]
      }
    ),
    /* @__PURE__ */ e.jsx(V, { active: "docs", projectId: N })
  ] }), G = (s) => /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    oe,
    s
  ] });
  if (j) return G(/* @__PURE__ */ e.jsx(H, { rows: 8 }));
  if (!F)
    return G(
      /* @__PURE__ */ e.jsx(
        _,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-diagram-project" }),
          title: "Henüz proje yok",
          description: "Kapsam ağacı projelerden doğar; önce bir proje oluşturun.",
          action: /* @__PURE__ */ e.jsx(
            Y,
            {
              primary: /* @__PURE__ */ e.jsx(I, { asChild: !0, children: /* @__PURE__ */ e.jsx("a", { href: `${$()}Projects`, children: "Projelere git" }) }),
              link: { label: "veya Dokümanlar'a dön", href: `${$()}Documents` }
            }
          )
        }
      )
    );
  const u = t.rollup;
  return G(
    /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
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
              value: S,
              onChange: (s) => E(s.target.value),
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
              value: n,
              onChange: (s) => w(s.target.value),
              "aria-label": "Sorumlu süz",
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: "Sorumlu: tümü" }),
                ce.map((s) => /* @__PURE__ */ e.jsx("option", { value: s, children: s }, s))
              ]
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: O("apya-doc-filterchip", i && "is-active"),
              onClick: () => R((s) => !s),
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
        re.map((s) => /* @__PURE__ */ e.jsx(
          Ie,
          {
            row: s,
            isOpen: l.has(s.id),
            onToggle: () => ie(s),
            currency: u.currency
          },
          s.id
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
    ] })
  );
}
const ae = document.getElementById("project-timeline-island");
ae && K(ae).render(/* @__PURE__ */ e.jsx(Ne, {}));
const te = document.getElementById("document-matching-island");
te && K(te).render(/* @__PURE__ */ e.jsx(ze, {}));
const ne = document.getElementById("project-scope-island");
ne && K(ne).render(/* @__PURE__ */ e.jsx(Me, {}));
