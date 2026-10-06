import { r, j as e, b as ue } from "./react-vendor-D7YDiBbi.js";
import { E as H, m as V } from "./index-DgpuJ91w.js";
import { D as he, h as xe, B as P, e as L } from "./Dialog-BdrRxZcw.js";
import { S as Y } from "./SkeletonShape-Ds5M097Q.js";
import { E as q, D as Z, P as J } from "./ProcessRibbon-D9pM1s89.js";
const A = (a, t) => {
  var p, c, o;
  return (o = (c = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : c[a]) == null ? void 0 : o.call(c, t);
}, $ = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function E(a) {
  return new Promise((t, p) => {
    window.abp.ajax(a).done(t).fail(p);
  });
}
const D = (a, t, p = {}) => {
  const c = new URLSearchParams();
  Object.entries(p).forEach(([l, d]) => {
    d != null && d !== "" && c.append(l, d);
  });
  const o = c.toString();
  return `${$()}Documents/${a}?handler=${t}${o ? "&" + o : ""}`;
}, re = (a, t) => E({ url: a, type: "POST", contentType: "application/json", data: JSON.stringify(t) }), ye = (a) => E({ url: D("Timeline", "Timeline", { projectId: a }), type: "GET" }), fe = (a) => re(D("Timeline", "CreateRisk"), a), je = (a, t) => E({ url: D("Timeline", "SetRiskClosed", { id: a, isClosed: t }), type: "POST" }), ge = (a) => E({ url: D("Matching", "Board", { projectId: a }), type: "GET" }), ve = (a) => E({ url: D("Matching", "Candidates", { expenseId: a }), type: "GET" }), be = (a) => E({ url: D("Matching", "Matches", { projectId: a }), type: "GET" }), ke = (a) => re(D("Matching", "CreateMatch"), a), Ne = (a) => E({ url: D("Matching", "RemoveMatch", { matchId: a }), type: "POST" }), Se = () => E({ url: D("Scope", "Overview"), type: "GET" }), ze = (a) => E({ url: D("Scope", "Branch", { projectId: a }), type: "GET" }), k = (a, t = "TRY") => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + " " + ({ TRY: "₺", USD: "$", EUR: "€" }[t] || t), ae = (a, t = 1) => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: t }).format(a), b = (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—", te = [1, 2, 3, 4, 5], Ce = 200, De = 1e3, O = "mb-1 block text-[12px] font-semibold text-text-secondary", G = "w-full rounded-md border border-default bg-surface px-3 py-2 text-[13px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus";
function Te({ open: a, busy: t, onClose: p, onSubmit: c }) {
  const [o, l] = r.useState(""), [d, h] = r.useState(3), [y, C] = r.useState(3), [N, j] = r.useState("");
  r.useEffect(() => {
    a && (l(""), h(3), C(3), j(""));
  }, [a]);
  const S = o.trim(), v = S.length > 0 && !t, f = (n) => {
    n.preventDefault(), v && c({
      title: S,
      likelihood: d,
      impact: y,
      mitigation: N.trim() || null
    });
  };
  return /* @__PURE__ */ e.jsx(he, { open: a, onOpenChange: (n) => {
    !n && !t && p();
  }, children: /* @__PURE__ */ e.jsx(xe, { title: "Risk ekle", className: "w-full max-w-[480px] p-0", children: /* @__PURE__ */ e.jsxs("form", { onSubmit: f, children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-center justify-between border-b border-subtle px-5 py-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[15px] font-semibold text-text-primary", children: "Risk ekle" }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: p,
          disabled: t,
          "aria-label": "Kapat",
          className: "rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3 px-5 py-4", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: O, htmlFor: "risk-title", children: "Risk başlığı" }),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            id: "risk-title",
            type: "text",
            className: G,
            autoFocus: !0,
            maxLength: Ce,
            value: o,
            onChange: (n) => l(n.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: O, htmlFor: "risk-likelihood", children: "Olasılık (1-5)" }),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              id: "risk-likelihood",
              className: G,
              value: d,
              onChange: (n) => h(Number(n.target.value)),
              children: te.map((n) => /* @__PURE__ */ e.jsx("option", { value: n, children: n }, n))
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: O, htmlFor: "risk-impact", children: "Etki (1-5)" }),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              id: "risk-impact",
              className: G,
              value: y,
              onChange: (n) => C(Number(n.target.value)),
              children: te.map((n) => /* @__PURE__ */ e.jsx("option", { value: n, children: n }, n))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("p", { className: "text-[12px] text-text-tertiary", "data-testid": "risk-score", children: [
        "Risk puanı: ",
        /* @__PURE__ */ e.jsx("strong", { className: "text-text-primary", children: d * y }),
        " / 25"
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("label", { className: O, htmlFor: "risk-mitigation", children: "Önlem (boş bırakılabilir)" }),
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            id: "risk-mitigation",
            rows: 3,
            className: G,
            maxLength: De,
            value: N,
            onChange: (n) => j(n.target.value)
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("footer", { className: "flex justify-end gap-2 border-t border-subtle px-5 py-3", children: [
      /* @__PURE__ */ e.jsx(P, { type: "button", variant: "outline", size: "sm", disabled: t, onClick: p, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(P, { type: "submit", size: "sm", disabled: !v, children: "Riski ekle" })
    ] })
  ] }) }) });
}
function we(a) {
  return a >= 15 ? "negative" : a >= 8 ? "warning" : "neutral";
}
function Pe({ step: a, projectStart: t, projectEnd: p }) {
  const c = a.startDate ? new Date(a.startDate) : null, o = a.endDate ? new Date(a.endDate) : null;
  if (!c || !o || !t || !p)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-gantt-track", children: /* @__PURE__ */ e.jsx("span", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)", paddingLeft: 6 }, children: "tarih girilmemiş" }) });
  const l = p - t, d = l > 0 ? (c - t) / l * 100 : 0, h = l > 0 ? Math.max((o - c) / l * 100, 2) : 100;
  return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-gantt-track", children: /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "apya-doc-gantt-bar",
      style: {
        left: `${Math.max(0, Math.min(d, 100))}%`,
        width: `${Math.min(h, 100)}%`,
        background: a.progressPercent >= 100 ? "var(--apya-positive-500)" : "var(--apya-accent-500)"
      },
      title: `${b(a.startDate)} – ${b(a.endDate)} · %${a.progressPercent}`
    }
  ) });
}
function Ee() {
  const a = new URLSearchParams(window.location.search).get("projectId"), [t, p] = r.useState(null), [c, o] = r.useState(!0), [l, d] = r.useState(!1), h = r.useCallback(async () => {
    if (!a) {
      o(!1);
      return;
    }
    o(!0);
    try {
      p(await ye(a));
    } catch (n) {
      A("error", "Zaman çizelgesi yüklenemedi."), console.error("[Timeline] load", n);
    } finally {
      o(!1);
    }
  }, [a]);
  r.useEffect(() => {
    h();
  }, [h]);
  const [y, C] = r.useState(!1), N = async (n) => {
    d(!0);
    try {
      await fe({ projectId: a, ...n }), C(!1), await h();
    } catch {
      A("error", "Risk eklenemedi.");
    } finally {
      d(!1);
    }
  }, j = (n) => /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsx(
      Z,
      {
        title: (t == null ? void 0 : t.projectName) ?? "Zaman çizelgesi & bütçe",
        description: t ? `${b(t.startDate)} – ${b(t.endDate)} · ${t.steps.length} iş adımı` : "İş adımları, bütçe-belge kapsaması ve risk kütüğü"
      }
    ),
    /* @__PURE__ */ e.jsx(J, { active: null, projectId: a }),
    n
  ] });
  if (!a)
    return j(
      /* @__PURE__ */ e.jsx(
        H,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-diagram-project" }),
          title: "Proje bağlamı gerekiyor",
          description: "Bu sayfa bir proje bağlamından açılır (?projectId=...).",
          action: /* @__PURE__ */ e.jsx(
            q,
            {
              primary: /* @__PURE__ */ e.jsx(P, { asChild: !0, children: /* @__PURE__ */ e.jsx("a", { href: `${$()}Projects`, children: "Projelere git" }) }),
              link: { label: "veya proje kapsamını aç", href: `${$()}Documents/Scope` }
            }
          )
        }
      )
    );
  if (c) return j(/* @__PURE__ */ e.jsx(Y, { rows: 8 }));
  if (!t) return null;
  const S = t.startDate ? new Date(t.startDate) : null, v = t.endDate ? new Date(t.endDate) : null, f = t.budget;
  return j(
    /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpis", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Bütçe kullanımı" }),
          /* @__PURE__ */ e.jsxs("div", { className: "apya-numeric apya-doc-kpi-value", children: [
            "%",
            f.budgetUsedPercent
          ] }),
          /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
            k(f.totalExpense, t.currency),
            " / ",
            k(f.totalBudget, t.currency)
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Belgelenen harcama" }),
          /* @__PURE__ */ e.jsxs("div", { className: "apya-numeric apya-doc-kpi-value", children: [
            "%",
            f.documentedPercent
          ] }),
          /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: k(f.documentedExpense, t.currency) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Belgesiz harcama" }),
          /* @__PURE__ */ e.jsx(
            "div",
            {
              className: "apya-numeric apya-doc-kpi-value",
              style: { color: f.undocumentedExpense > 0 ? "var(--apya-negative-500)" : void 0 },
              children: k(f.undocumentedExpense, t.currency)
            }
          ),
          /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
            f.undocumentedCount,
            " kalem",
            f.undocumentedCount > 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              " · ",
              /* @__PURE__ */ e.jsx("a", { href: `${window.abp.appPath}Documents/Matching?projectId=${a}`, children: "eşleştir" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Adam-gün" }),
          /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: ae(t.capacity.loggedPersonDays) }),
          /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
            "tahmin ",
            ae(t.capacity.estimatedPersonDays),
            " gün"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card mb-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "İş planı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
            b(t.startDate),
            " — ",
            b(t.endDate)
          ] })
        ] }),
        t.steps.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Tanımlı iş adımı yok." }) : t.steps.map((n) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-gantt-row", children: [
          /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: [
            n.order,
            " · ",
            n.name
          ] }),
          /* @__PURE__ */ e.jsx(Pe, { step: n, projectStart: S, projectEnd: v }),
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
          /* @__PURE__ */ e.jsxs(P, { variant: "outline", size: "sm", disabled: l, onClick: () => C(!0), children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
            " Risk ekle"
          ] }),
          /* @__PURE__ */ e.jsx(
            Te,
            {
              open: y,
              busy: l,
              onClose: () => C(!1),
              onSubmit: N
            }
          )
        ] }),
        t.risks.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Kayıtlı risk yok." }) : t.risks.map((n) => /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "apya-doc-check-row",
            style: { gridTemplateColumns: "70px minmax(0,1fr) 120px 110px", opacity: n.isClosed ? 0.55 : 1 },
            children: [
              /* @__PURE__ */ e.jsx(L, { variant: we(n.score), size: "sm", children: n.score }),
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
                  disabled: l,
                  onClick: async () => {
                    d(!0), await je(n.id, !n.isClosed), await h(), d(!1);
                  },
                  children: n.isClosed ? "Aç" : "Kapat"
                }
              ) })
            ]
          },
          n.id
        ))
      ] })
    ] })
  );
}
const Ie = (...a) => a.filter(Boolean).join(" "), Be = {
  1: "Aynı dosya başka bir belgede de var",
  2: "Bu harcamaya zaten belge bağlı",
  3: "Aynı tutar/tarih/tedarikçi başka belgede"
};
function U({ label: a, value: t, max: p }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)", width: 62 }, children: a }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-doc-progress", style: { flex: 1, height: 4 }, children: /* @__PURE__ */ e.jsx("div", { style: { width: `${t / p * 100}%`, background: "var(--apya-accent-500)" } }) }),
    /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 10.5, width: 26, textAlign: "right" }, children: t })
  ] });
}
function Me() {
  const a = new URLSearchParams(window.location.search).get("projectId"), [t, p] = r.useState(null), [c, o] = r.useState([]), [l, d] = r.useState(null), [h, y] = r.useState([]), [C, N] = r.useState(!0), [j, S] = r.useState(!1), v = r.useCallback(async () => {
    if (!a) {
      N(!1);
      return;
    }
    N(!0);
    try {
      const [s, T] = await Promise.all([ge(a), be(a)]);
      p(s), o(T ?? []);
    } catch (s) {
      A("error", "Eşleştirme tezgâhı yüklenemedi."), console.error("[Matching] load", s);
    } finally {
      N(!1);
    }
  }, [a]);
  r.useEffect(() => {
    v();
  }, [v]);
  const f = async (s) => {
    d(s), y([]);
    try {
      y(await ve(s.id) ?? []);
    } catch (T) {
      console.error("[Matching] candidates", T);
    }
  }, n = async (s) => {
    if (!l) return;
    const T = window.prompt("EK numarası (boş bırakılabilir):") || null;
    S(!0);
    try {
      await ke({ documentFileId: s, expenseId: l.id, annexNumber: T }), d(null), y([]), await v();
    } catch (I) {
      A("error", "Bağlama başarısız oldu."), console.error("[Matching] createMatch", I);
    } finally {
      S(!1);
    }
  }, M = (s) => /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsx(
      Z,
      {
        title: "Harcama ↔ belge eşleştirme",
        description: t ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          t.expenses.length,
          " belgesiz harcama · toplam",
          " ",
          /* @__PURE__ */ e.jsx("strong", { style: { color: "var(--apya-negative-500)" }, children: k(t.undocumentedTotal) })
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
    /* @__PURE__ */ e.jsx(J, { active: "docs", projectId: a }),
    s
  ] });
  return a ? C ? M(/* @__PURE__ */ e.jsx(Y, { rows: 8 })) : t ? M(
    /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
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
              className: Ie("apya-md-item", (l == null ? void 0 : l.id) === s.id && "selected"),
              style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 },
              onClick: () => f(s),
              children: [
                /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1, textAlign: "left" }, children: [
                  /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: s.title }),
                  /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                    b(s.expenseDate),
                    s.supplierName && ` · ${s.supplierName}`,
                    s.budgetLineName && ` · ${s.budgetLineName}`
                  ] })
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: k(s.amount, s.currency) })
              ]
            },
            s.id
          ))
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
          /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: l ? `Aday belgeler · ${l.title}` : "Aday belgeler" }),
          l ? h.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Eşik üstünde aday yok. Sağdaki listeden elle bağlayabilirsiniz." }) : h.map((s, T) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-candidate", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start justify-content-between gap-2", children: [
              /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
                /* @__PURE__ */ e.jsx("div", { className: "text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: s.displayName }),
                /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                  k(s.amount),
                  " · ",
                  b(s.documentDate)
                ] })
              ] }),
              /* @__PURE__ */ e.jsx(L, { variant: s.isStrong ? "positive" : "warning", size: "sm", children: s.score })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-1 mt-2", children: [
              /* @__PURE__ */ e.jsx(U, { label: "tutar", value: s.amountScore, max: 50 }),
              /* @__PURE__ */ e.jsx(U, { label: "tarih", value: s.dateScore, max: 30 }),
              /* @__PURE__ */ e.jsx(U, { label: "tedarikçi", value: s.supplierScore, max: 20 })
            ] }),
            s.reasons.length > 0 && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)", marginTop: 4 }, children: s.reasons.join(" · ") }),
            l.budgetLineName && /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 10.5, color: "var(--apya-accent-500)", marginTop: 4 }, children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa fa-link" }),
              " Bağlanınca «",
              l.budgetLineName,
              "» kalemi belgeli olur."
            ] }),
            /* @__PURE__ */ e.jsx(
              P,
              {
                variant: T === 0 ? "primary" : "outline",
                size: "sm",
                className: "mt-2 w-100",
                disabled: j,
                onClick: () => n(s.documentFileId),
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
                k(s.amount),
                " · ",
                b(s.documentDate),
                s.documentTypeName && ` · ${s.documentTypeName}`
              ] }),
              s.duplicateOf && /* @__PURE__ */ e.jsx(L, { variant: "negative", size: "sm", children: Be[s.duplicateOf] })
            ] }),
            l && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: j,
                onClick: () => n(s.id),
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
          /* @__PURE__ */ e.jsx(L, { variant: "neutral", size: "sm", children: s.annexNumber || s.score }),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: s.documentFileName }),
          /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { fontSize: 12 }, children: [
            s.expenseTitle,
            " · ",
            k(s.expenseAmount)
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: "text-end", children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "apya-doc-linkbtn",
              disabled: j,
              onClick: async () => {
                S(!0), await Ne(s.id), await v(), S(!1);
              },
              children: "Kaldır"
            }
          ) })
        ] }, s.id))
      ] })
    ] })
  ) : null : M(
    /* @__PURE__ */ e.jsx(
      H,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-link" }),
        title: "Proje bağlamı gerekiyor",
        description: "Bu sayfa bir proje bağlamından açılır (?projectId=...).",
        action: /* @__PURE__ */ e.jsx(
          q,
          {
            primary: /* @__PURE__ */ e.jsx(P, { asChild: !0, children: /* @__PURE__ */ e.jsx("a", { href: `${window.abp.appPath}Projects`, children: "Projelere git" }) }),
            link: { label: "veya proje kapsamını aç", href: `${window.abp.appPath}Documents/Scope` }
          }
        )
      }
    )
  );
}
const W = (...a) => a.filter(Boolean).join(" "), se = {
  Project: { icon: "fa-diagram-project", label: "Proje" },
  WorkStep: { icon: "fa-list-check", label: "İş adımı" },
  UnassignedGroup: { icon: "fa-folder-open", label: "—" },
  Document: { icon: "fa-file-lines", label: "Belge" },
  MissingItem: { icon: "fa-triangle-exclamation", label: "Eksik" },
  TaskGroup: { icon: "fa-layer-group", label: "—" },
  Task: { icon: "fa-square-check", label: "Görev" },
  SubTask: { icon: "fa-turn-up", label: "Alt görev" }
}, Re = {
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
}, $e = ["", "Project", "WorkStep", "UnassignedGroup", "Document", "MissingItem", "TaskGroup", "Task", "SubTask"], Ae = ["None", "Planned", "InProgress", "Done", "Late", "Cancelled", "Draft", "Final", "Matched", "Expired", "Missing"], _ = (a) => typeof a.kind == "number" ? $e[a.kind] : a.kind, Le = (a) => typeof a.status == "number" ? Ae[a.status] : a.status;
function Fe(a) {
  return a >= 85 ? "var(--apya-positive-500)" : a >= 60 ? "var(--apya-warning-500)" : "var(--apya-negative-500)";
}
function Oe(a) {
  return a.startDate && a.endDate ? `${b(a.startDate)} — ${b(a.endDate)}` : a.startDate ? b(a.startDate) : a.endDate ? b(a.endDate) : "—";
}
function Ge({ row: a, isOpen: t, onToggle: p, currency: c }) {
  const o = _(a) || "Document", l = Re[Le(a)], d = se[o] ?? se.Document, h = o === "Project" || o === "WorkStep" || o === "TaskGroup" || o === "UnassignedGroup";
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: W("apya-doc-row apya-doc-scope-row", h && "is-group", o === "MissingItem" && "is-missing"),
      style: { gridTemplateColumns: "minmax(0,1fr) 96px 104px 132px 156px 64px 128px 120px" },
      onClick: a.hasChildren ? p : void 0,
      role: a.hasChildren ? "button" : void 0,
      tabIndex: a.hasChildren ? 0 : void 0,
      onKeyDown: a.hasChildren ? (y) => {
        (y.key === "Enter" || y.key === " ") && (y.preventDefault(), p());
      } : void 0,
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2 text-truncate", style: { paddingLeft: a.depth * 20 }, children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-doc-scope-caret", children: a.hasChildren ? /* @__PURE__ */ e.jsx("i", { className: W("fa", t ? "fa-chevron-down" : "fa-chevron-right") }) : null }),
          /* @__PURE__ */ e.jsx("span", { className: W("apya-doc-scope-icon", `is-${o.toLowerCase()}`), children: /* @__PURE__ */ e.jsx("i", { className: `fa ${d.icon}` }) }),
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
        /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11.5, color: "var(--apya-text-secondary)" }, className: "text-truncate", children: a.typeName ?? d.label }),
        /* @__PURE__ */ e.jsx("span", { children: l ? /* @__PURE__ */ e.jsx(L, { variant: l.variant, size: "sm", children: l.label }) : null }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 11.5, color: "var(--apya-text-secondary)" }, children: a.ownerName ?? "—" }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: Oe(a) }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, textAlign: "center", color: "var(--apya-text-secondary)" }, children: a.documentCount > 0 ? a.documentCount : "—" }),
        /* @__PURE__ */ e.jsx(
          "span",
          {
            className: "apya-numeric",
            style: { fontSize: 11.5, textAlign: "right", color: a.amount ? "var(--apya-text-primary)" : "var(--apya-text-tertiary)" },
            children: a.amount ? k(a.amount, c) : "—"
          }
        ),
        a.compliancePercent === null || a.compliancePercent === void 0 ? /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)", textAlign: "right" }, children: "—" }) : /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("div", { className: "apya-doc-progress", style: { flex: 1 }, children: /* @__PURE__ */ e.jsx("div", { style: { width: `${a.compliancePercent}%`, background: Fe(a.compliancePercent) } }) }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
            "%",
            a.compliancePercent
          ] })
        ] })
      ]
    }
  );
}
function We() {
  var Q;
  const a = new URLSearchParams(window.location.search).get("projectId"), [t, p] = r.useState(null), [c, o] = r.useState({}), [l, d] = r.useState(/* @__PURE__ */ new Set()), [h, y] = r.useState(!0), [C, N] = r.useState(!1), [j, S] = r.useState(a ?? null), [v, f] = r.useState(!1), [n, M] = r.useState(""), [s, T] = r.useState(""), I = ue.useRef(c);
  r.useEffect(() => {
    I.current = c;
  }, [c]);
  const R = r.useCallback(async (i) => {
    if (!(!i || I.current[i]))
      try {
        const m = await ze(i);
        I.current = { ...I.current, [i]: m.rows }, o(I.current);
      } catch {
        A("error", "Proje dalı yüklenemedi.");
      }
  }, []);
  r.useEffect(() => {
    (async () => {
      try {
        const i = await Se();
        p(i);
        const m = a ? i.rows.find((x) => String(x.entityId).toLowerCase() === a.toLowerCase()) : null;
        m && (d(/* @__PURE__ */ new Set([m.id])), await R(m.entityId));
      } catch {
        A("error", "Kapsam yüklenemedi.");
      } finally {
        y(!1);
      }
    })();
  }, [a, R]);
  const ce = r.useCallback(async (i) => {
    const m = i.id, x = !l.has(m);
    d((B) => {
      const w = new Set(B);
      return w.has(m) ? w.delete(m) : w.add(m), w;
    }), x && _(i) === "Project" && S(i.entityId), x && i.isLazy && i.entityId && await R(i.entityId);
  }, [l, R]), oe = r.useCallback(async () => {
    if (!t) return;
    if (t.rows.every((m) => l.has(m.id))) {
      d(/* @__PURE__ */ new Set());
      return;
    }
    N(!0);
    try {
      await Promise.all(t.rows.filter((m) => m.entityId).map((m) => R(m.entityId))), d((m) => {
        const x = new Set(m);
        return t.rows.forEach((B) => x.add(B.id)), Object.values(I.current).forEach((B) => {
          B.forEach((w) => {
            w.hasChildren && x.add(w.id);
          });
        }), x;
      });
    } finally {
      N(!1);
    }
  }, [t, l, R]), de = r.useMemo(() => {
    if (!t) return [];
    const i = /* @__PURE__ */ new Map(), m = [], x = (g) => {
      i.set(g.id, g), m.push(g);
    };
    t.rows.forEach((g) => {
      x(g), (c[g.entityId] ?? []).forEach(x);
    });
    const B = (g) => {
      var ee;
      let z = g.parentId;
      for (; z; ) {
        if (!l.has(z)) return !1;
        z = ((ee = i.get(z)) == null ? void 0 : ee.parentId) ?? null;
      }
      return !0;
    }, w = (g) => {
      const z = _(g);
      return z === "Project" || z === "WorkStep" || z === "TaskGroup" || z === "UnassignedGroup" ? !0 : !(v && z !== "MissingItem" || n && z !== n || s && g.ownerName !== s);
    };
    return m.filter((g) => B(g) && w(g));
  }, [t, c, l, v, n, s]), me = r.useMemo(() => {
    const i = /* @__PURE__ */ new Set();
    return Object.values(c).forEach((m) => m.forEach((x) => {
      x.ownerName && i.add(x.ownerName);
    })), [...i].sort((m, x) => m.localeCompare(x, "tr"));
  }, [c]), F = !!((Q = t == null ? void 0 : t.rows) != null && Q.length), X = F && t.rows.every((i) => l.has(i.id)), pe = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      Z,
      {
        title: "Proje kapsamı",
        description: "Projeler, iş adımları, görevler ve bunlara bağlı belge · tutar · uygunluk",
        primary: F && (j ? /* @__PURE__ */ e.jsx(P, { asChild: !0, leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-export" }), children: /* @__PURE__ */ e.jsx("a", { href: `${$()}Documents/ReportBuilder?projectId=${j}`, children: "Kapsamı raporla" }) }) : /* @__PURE__ */ e.jsx(P, { disabled: !0, title: "Raporlamak için bir proje açın", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-export" }), children: "Kapsamı raporla" })),
        menuItems: [
          F && {
            key: "expand",
            label: X ? "Hepsini kapat" : "Hepsini aç",
            icon: X ? "fa-compress" : "fa-expand",
            disabled: C,
            onSelect: oe
          }
        ]
      }
    ),
    /* @__PURE__ */ e.jsx(J, { active: "docs", projectId: j })
  ] }), K = (i) => /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    pe,
    i
  ] });
  if (h) return K(/* @__PURE__ */ e.jsx(Y, { rows: 8 }));
  if (!F)
    return K(
      /* @__PURE__ */ e.jsx(
        H,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-diagram-project" }),
          title: "Henüz proje yok",
          description: "Kapsam ağacı projelerden doğar; önce bir proje oluşturun.",
          action: /* @__PURE__ */ e.jsx(
            q,
            {
              primary: /* @__PURE__ */ e.jsx(P, { asChild: !0, children: /* @__PURE__ */ e.jsx("a", { href: `${$()}Projects`, children: "Projelere git" }) }),
              link: { label: "veya Dokümanlar'a dön", href: `${$()}Documents` }
            }
          )
        }
      )
    );
  const u = t.rollup;
  return K(
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
          /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", style: { fontSize: 18 }, children: k(u.totalAmount, u.currency) }),
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
              value: n,
              onChange: (i) => M(i.target.value),
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
              value: s,
              onChange: (i) => T(i.target.value),
              "aria-label": "Sorumlu süz",
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: "Sorumlu: tümü" }),
                me.map((i) => /* @__PURE__ */ e.jsx("option", { value: i, children: i }, i))
              ]
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: W("apya-doc-filterchip", v && "is-active"),
              onClick: () => f((i) => !i),
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
        de.map((i) => /* @__PURE__ */ e.jsx(
          Ge,
          {
            row: i,
            isOpen: l.has(i.id),
            onToggle: () => ce(i),
            currency: u.currency
          },
          i.id
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
              /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, textAlign: "right", fontWeight: 600 }, children: k(u.totalAmount, u.currency) }),
              /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, textAlign: "right" }, children: u.averageCompliancePercent === null || u.averageCompliancePercent === void 0 ? "—" : `%${u.averageCompliancePercent} ort.` })
            ]
          }
        )
      ] })
    ] })
  );
}
const ne = document.getElementById("project-timeline-island");
ne && V(ne, "documents-timeline", /* @__PURE__ */ e.jsx(Ee, {}));
const ie = document.getElementById("document-matching-island");
ie && V(ie, "documents-matching", /* @__PURE__ */ e.jsx(Me, {}));
const le = document.getElementById("project-scope-island");
le && V(le, "documents-scope", /* @__PURE__ */ e.jsx(We, {}));
