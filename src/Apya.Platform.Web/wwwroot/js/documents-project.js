import { r as l, j as e, b as ue } from "./react-vendor-D7YDiBbi.js";
import { E as _, m as H } from "./index-DgpuJ91w.js";
import { D as he, h as xe, B as T, e as F } from "./Dialog-BdrRxZcw.js";
import { S as Y } from "./SkeletonShape-Ds5M097Q.js";
import { E as q, D as Z, P as J } from "./ProcessRibbon-D9pM1s89.js";
const A = (a, s) => {
  var p, r, o;
  return (o = (r = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : r[a]) == null ? void 0 : o.call(r, s);
}, $ = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function P(a) {
  return new Promise((s, p) => {
    window.abp.ajax(a).done(s).fail(p);
  });
}
const w = (a, s, p = {}) => {
  const r = new URLSearchParams();
  Object.entries(p).forEach(([i, d]) => {
    d != null && d !== "" && r.append(i, d);
  });
  const o = r.toString();
  return `${$()}Documents/${a}?handler=${s}${o ? "&" + o : ""}`;
}, re = (a, s) => P({ url: a, type: "POST", contentType: "application/json", data: JSON.stringify(s) }), ye = (a) => P({ url: w("Timeline", "Timeline", { projectId: a }), type: "GET" }), fe = (a) => re(w("Timeline", "CreateRisk"), a), je = (a, s) => P({ url: w("Timeline", "SetRiskClosed", { id: a, isClosed: s }), type: "POST" }), ge = (a) => P({ url: w("Matching", "Board", { projectId: a }), type: "GET" }), ve = (a) => P({ url: w("Matching", "Candidates", { expenseId: a }), type: "GET" }), be = (a) => P({ url: w("Matching", "Matches", { projectId: a }), type: "GET" }), ke = (a) => re(w("Matching", "CreateMatch"), a), Ne = (a) => P({ url: w("Matching", "RemoveMatch", { matchId: a }), type: "POST" }), Se = () => P({ url: w("Scope", "Overview"), type: "GET" }), De = (a) => P({ url: w("Scope", "Branch", { projectId: a }), type: "GET" }), k = (a, s = "TRY") => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + " " + ({ TRY: "₺", USD: "$", EUR: "€" }[s] || s), ae = (a, s = 1) => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: s }).format(a), b = (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—", te = [1, 2, 3, 4, 5], ze = 200, we = 1e3, O = "mb-1 block text-[12px] font-semibold text-text-secondary", G = "w-full rounded-md border border-default bg-surface px-3 py-2 text-[13px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus";
function Ce({ open: a, busy: s, onClose: p, onSubmit: r }) {
  const [o, i] = l.useState(""), [d, h] = l.useState(3), [x, E] = l.useState(3), [N, g] = l.useState("");
  l.useEffect(() => {
    a && (i(""), h(3), E(3), g(""));
  }, [a]);
  const S = o.trim(), f = S.length > 0 && !s, B = (c) => {
    c.preventDefault(), f && r({
      title: S,
      likelihood: d,
      impact: x,
      mitigation: N.trim() || null
    });
  };
  return /* @__PURE__ */ e.jsx(he, { open: a, onOpenChange: (c) => {
    !c && !s && p();
  }, children: /* @__PURE__ */ e.jsx(xe, { title: "Risk ekle", className: "w-full max-w-[480px] p-0", children: /* @__PURE__ */ e.jsxs("form", { onSubmit: B, children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-center justify-between border-b border-subtle px-5 py-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[15px] font-semibold text-text-primary", children: "Risk ekle" }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: p,
          disabled: s,
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
            maxLength: ze,
            value: o,
            onChange: (c) => i(c.target.value)
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
              onChange: (c) => h(Number(c.target.value)),
              children: te.map((c) => /* @__PURE__ */ e.jsx("option", { value: c, children: c }, c))
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
              value: x,
              onChange: (c) => E(Number(c.target.value)),
              children: te.map((c) => /* @__PURE__ */ e.jsx("option", { value: c, children: c }, c))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("p", { className: "text-[12px] text-text-tertiary", "data-testid": "risk-score", children: [
        "Risk puanı: ",
        /* @__PURE__ */ e.jsx("strong", { className: "text-text-primary", children: d * x }),
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
            maxLength: we,
            value: N,
            onChange: (c) => g(c.target.value)
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("footer", { className: "flex justify-end gap-2 border-t border-subtle px-5 py-3", children: [
      /* @__PURE__ */ e.jsx(T, { type: "button", variant: "outline", size: "sm", disabled: s, onClick: p, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(T, { type: "submit", size: "sm", disabled: !f, children: "Riski ekle" })
    ] })
  ] }) }) });
}
function Te(a) {
  return a >= 15 ? "negative" : a >= 8 ? "warning" : "neutral";
}
function Pe({ step: a, projectStart: s, projectEnd: p }) {
  const r = a.startDate ? new Date(a.startDate) : null, o = a.endDate ? new Date(a.endDate) : null;
  if (!r || !o || !s || !p)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-gantt-track", children: /* @__PURE__ */ e.jsx("span", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)", paddingLeft: 6 }, children: "tarih girilmemiş" }) });
  const i = p - s, d = i > 0 ? (r - s) / i * 100 : 0, h = i > 0 ? Math.max((o - r) / i * 100, 2) : 100;
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
  const a = new URLSearchParams(window.location.search).get("projectId"), [s, p] = l.useState(null), [r, o] = l.useState(!0), [i, d] = l.useState(!1), h = l.useCallback(async () => {
    if (!a) {
      o(!1);
      return;
    }
    o(!0);
    try {
      p(await ye(a));
    } catch (t) {
      A("error", "Zaman çizelgesi yüklenemedi."), console.error("[Timeline] load", t);
    } finally {
      o(!1);
    }
  }, [a]);
  l.useEffect(() => {
    h();
  }, [h]);
  const [x, E] = l.useState(!1);
  l.useEffect(() => {
    if (x || !s || window.location.hash !== "#risk-kutugu")
      return;
    E(!0);
    const t = document.getElementById("risk-kutugu");
    t && t.scrollIntoView({ block: "start" });
  }, [s, x]);
  const [N, g] = l.useState(!1), S = async (t) => {
    d(!0);
    try {
      await fe({ projectId: a, ...t }), g(!1), await h();
    } catch {
      A("error", "Risk eklenemedi.");
    } finally {
      d(!1);
    }
  }, f = (t) => /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsx(
      Z,
      {
        title: (s == null ? void 0 : s.projectName) ?? "Zaman çizelgesi & bütçe",
        description: s ? `${b(s.startDate)} – ${b(s.endDate)} · ${s.steps.length} iş adımı` : "İş adımları, bütçe-belge kapsaması ve risk kütüğü"
      }
    ),
    /* @__PURE__ */ e.jsx(J, { active: null, projectId: a }),
    t
  ] });
  if (!a)
    return f(
      /* @__PURE__ */ e.jsx(
        _,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-diagram-project" }),
          title: "Proje bağlamı gerekiyor",
          description: "Bu sayfa bir proje bağlamından açılır (?projectId=...).",
          action: /* @__PURE__ */ e.jsx(
            q,
            {
              primary: /* @__PURE__ */ e.jsx(T, { asChild: !0, children: /* @__PURE__ */ e.jsx("a", { href: `${$()}Projects`, children: "Projelere git" }) }),
              link: { label: "veya proje kapsamını aç", href: `${$()}Documents/Scope` }
            }
          )
        }
      )
    );
  if (r) return f(/* @__PURE__ */ e.jsx(Y, { rows: 8 }));
  if (!s) return null;
  const B = s.startDate ? new Date(s.startDate) : null, c = s.endDate ? new Date(s.endDate) : null, j = s.budget;
  return f(
    /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpis", children: [
        s.budgetVisible && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
            /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Bütçe kullanımı" }),
            /* @__PURE__ */ e.jsxs("div", { className: "apya-numeric apya-doc-kpi-value", children: [
              "%",
              j.budgetUsedPercent
            ] }),
            /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              k(j.totalExpense, s.currency),
              " / ",
              k(j.totalBudget, s.currency)
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
            /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Belgelenen harcama" }),
            /* @__PURE__ */ e.jsxs("div", { className: "apya-numeric apya-doc-kpi-value", children: [
              "%",
              j.documentedPercent
            ] }),
            /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: k(j.documentedExpense, s.currency) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
            /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Belgesiz harcama" }),
            /* @__PURE__ */ e.jsx(
              "div",
              {
                className: "apya-numeric apya-doc-kpi-value",
                style: { color: j.undocumentedExpense > 0 ? "var(--apya-negative-500)" : void 0 },
                children: k(j.undocumentedExpense, s.currency)
              }
            ),
            /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              j.undocumentedCount,
              " kalem",
              j.undocumentedCount > 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                " · ",
                /* @__PURE__ */ e.jsx("a", { href: `${window.abp.appPath}Documents/Matching?projectId=${a}`, children: "eşleştir" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Adam-gün" }),
          /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: ae(s.capacity.loggedPersonDays) }),
          /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
            "tahmin ",
            ae(s.capacity.estimatedPersonDays),
            " gün"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card mb-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "İş planı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
            b(s.startDate),
            " — ",
            b(s.endDate)
          ] })
        ] }),
        s.steps.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Tanımlı iş adımı yok." }) : s.steps.map((t) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-gantt-row", children: [
          /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: [
            t.order,
            " · ",
            t.name
          ] }),
          /* @__PURE__ */ e.jsx(Pe, { step: t, projectStart: B, projectEnd: c }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, textAlign: "right" }, children: [
            "%",
            t.progressPercent
          ] }),
          /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11.5, textAlign: "right" }, children: [
            t.documentCount,
            " belge"
          ] })
        ] }, t.id))
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", id: "risk-kutugu", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "Risk kütüğü" }),
          /* @__PURE__ */ e.jsxs(T, { variant: "outline", size: "sm", disabled: i, onClick: () => g(!0), children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
            " Risk ekle"
          ] }),
          /* @__PURE__ */ e.jsx(
            Ce,
            {
              open: N,
              busy: i,
              onClose: () => g(!1),
              onSubmit: S
            }
          )
        ] }),
        s.risks.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Kayıtlı risk yok." }) : s.risks.map((t) => /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "apya-doc-check-row",
            style: { gridTemplateColumns: "70px minmax(0,1fr) 120px 110px", opacity: t.isClosed ? 0.55 : 1 },
            children: [
              /* @__PURE__ */ e.jsx(F, { variant: Te(t.score), size: "sm", children: t.score }),
              /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
                /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5 }, children: t.title }),
                t.mitigation && /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: t.mitigation })
              ] }),
              /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: [
                "olasılık ",
                t.likelihood,
                " · etki ",
                t.impact
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "text-end", children: /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "apya-doc-linkbtn",
                  disabled: i,
                  onClick: async () => {
                    d(!0), await je(t.id, !t.isClosed), await h(), d(!1);
                  },
                  children: t.isClosed ? "Aç" : "Kapat"
                }
              ) })
            ]
          },
          t.id
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
function U({ label: a, value: s, max: p }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
    /* @__PURE__ */ e.jsx("span", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)", width: 62 }, children: a }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-doc-progress", style: { flex: 1, height: 4 }, children: /* @__PURE__ */ e.jsx("div", { style: { width: `${s / p * 100}%`, background: "var(--apya-accent-500)" } }) }),
    /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 10.5, width: 26, textAlign: "right" }, children: s })
  ] });
}
function Me() {
  const a = new URLSearchParams(window.location.search).get("projectId"), [s, p] = l.useState(null), [r, o] = l.useState([]), [i, d] = l.useState(null), [h, x] = l.useState([]), [E, N] = l.useState(!0), [g, S] = l.useState(!1), f = l.useCallback(async () => {
    if (!a) {
      N(!1);
      return;
    }
    N(!0);
    try {
      const [t, z] = await Promise.all([ge(a), be(a)]);
      p(t), o(z ?? []);
    } catch (t) {
      A("error", "Eşleştirme tezgâhı yüklenemedi."), console.error("[Matching] load", t);
    } finally {
      N(!1);
    }
  }, [a]);
  l.useEffect(() => {
    f();
  }, [f]);
  const B = async (t) => {
    d(t), x([]);
    try {
      x(await ve(t.id) ?? []);
    } catch (z) {
      console.error("[Matching] candidates", z);
    }
  }, c = async (t) => {
    if (!i) return;
    const z = window.prompt("EK numarası (boş bırakılabilir):") || null;
    S(!0);
    try {
      await ke({ documentFileId: t, expenseId: i.id, annexNumber: z }), d(null), x([]), await f();
    } catch (I) {
      A("error", "Bağlama başarısız oldu."), console.error("[Matching] createMatch", I);
    } finally {
      S(!1);
    }
  }, j = (t) => /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsx(
      Z,
      {
        title: "Harcama ↔ belge eşleştirme",
        description: s ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          s.expenses.length,
          " belgesiz harcama · toplam",
          " ",
          /* @__PURE__ */ e.jsx("strong", { style: { color: "var(--apya-negative-500)" }, children: k(s.undocumentedTotal) })
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
    t
  ] });
  return a ? E ? j(/* @__PURE__ */ e.jsx(Y, { rows: 8 })) : s ? j(
    /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-matchboard", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
          /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Belgesiz harcamalar" }),
          s.expenses.length === 0 ? /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 12, color: "var(--apya-positive-500)" }, children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-check" }),
            " Tüm harcamalar belgeli."
          ] }) : s.expenses.map((t) => /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: Ie("apya-md-item", (i == null ? void 0 : i.id) === t.id && "selected"),
              style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 },
              onClick: () => B(t),
              children: [
                /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1, textAlign: "left" }, children: [
                  /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: t.title }),
                  /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                    b(t.expenseDate),
                    t.supplierName && ` · ${t.supplierName}`,
                    t.budgetLineName && ` · ${t.budgetLineName}`
                  ] })
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5 }, children: k(t.amount, t.currency) })
              ]
            },
            t.id
          ))
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
          /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: i ? `Aday belgeler · ${i.title}` : "Aday belgeler" }),
          i ? h.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Eşik üstünde aday yok. Sağdaki listeden elle bağlayabilirsiniz." }) : h.map((t, z) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-candidate", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start justify-content-between gap-2", children: [
              /* @__PURE__ */ e.jsxs("div", { style: { minWidth: 0 }, children: [
                /* @__PURE__ */ e.jsx("div", { className: "text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: t.displayName }),
                /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                  k(t.amount),
                  " · ",
                  b(t.documentDate)
                ] })
              ] }),
              /* @__PURE__ */ e.jsx(F, { variant: t.isStrong ? "positive" : "warning", size: "sm", children: t.score })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-1 mt-2", children: [
              /* @__PURE__ */ e.jsx(U, { label: "tutar", value: t.amountScore, max: 50 }),
              /* @__PURE__ */ e.jsx(U, { label: "tarih", value: t.dateScore, max: 30 }),
              /* @__PURE__ */ e.jsx(U, { label: "tedarikçi", value: t.supplierScore, max: 20 })
            ] }),
            t.reasons.length > 0 && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)", marginTop: 4 }, children: t.reasons.join(" · ") }),
            i.budgetLineName && /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 10.5, color: "var(--apya-accent-500)", marginTop: 4 }, children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa fa-link" }),
              " Bağlanınca «",
              i.budgetLineName,
              "» kalemi belgeli olur."
            ] }),
            /* @__PURE__ */ e.jsx(
              T,
              {
                variant: z === 0 ? "primary" : "outline",
                size: "sm",
                className: "mt-2 w-100",
                disabled: g,
                onClick: () => c(t.documentFileId),
                children: "Bağla + EK no ata"
              }
            )
          ] }, t.documentFileId)) : /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Soldan bir harcama seçin; sistem tutar, tarih ve tedarikçi yakınlığına göre aday sıralar." })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
          /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Bağlanmamış belgeler" }),
          s.documents.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bağlanmamış belge yok." }) : s.documents.map((t) => /* @__PURE__ */ e.jsxs("div", { className: "apya-md-item", style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 }, children: [
            /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1 }, children: [
              /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5 }, children: t.displayName }),
              /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                k(t.amount),
                " · ",
                b(t.documentDate),
                t.documentTypeName && ` · ${t.documentTypeName}`
              ] }),
              t.duplicateOf && /* @__PURE__ */ e.jsx(F, { variant: "negative", size: "sm", children: Be[t.duplicateOf] })
            ] }),
            i && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: g,
                onClick: () => c(t.id),
                children: "Bağla"
              }
            )
          ] }, t.id))
        ] })
      ] }),
      r.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card mt-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline", children: [
          "Kurulmuş eşleşmeler (",
          r.length,
          ")"
        ] }),
        r.map((t) => /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", style: { gridTemplateColumns: "70px minmax(0,1fr) minmax(0,1fr) 90px" }, children: [
          /* @__PURE__ */ e.jsx(F, { variant: "neutral", size: "sm", children: t.annexNumber || t.score }),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: t.documentFileName }),
          /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { fontSize: 12 }, children: [
            t.expenseTitle,
            " · ",
            k(t.expenseAmount)
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: "text-end", children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "apya-doc-linkbtn",
              disabled: g,
              onClick: async () => {
                S(!0), await Ne(t.id), await f(), S(!1);
              },
              children: "Kaldır"
            }
          ) })
        ] }, t.id))
      ] })
    ] })
  ) : null : j(
    /* @__PURE__ */ e.jsx(
      _,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-link" }),
        title: "Proje bağlamı gerekiyor",
        description: "Bu sayfa bir proje bağlamından açılır (?projectId=...).",
        action: /* @__PURE__ */ e.jsx(
          q,
          {
            primary: /* @__PURE__ */ e.jsx(T, { asChild: !0, children: /* @__PURE__ */ e.jsx("a", { href: `${window.abp.appPath}Projects`, children: "Projelere git" }) }),
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
}, $e = ["", "Project", "WorkStep", "UnassignedGroup", "Document", "MissingItem", "TaskGroup", "Task", "SubTask"], Ae = ["None", "Planned", "InProgress", "Done", "Late", "Cancelled", "Draft", "Final", "Matched", "Expired", "Missing"], V = (a) => typeof a.kind == "number" ? $e[a.kind] : a.kind, Fe = (a) => typeof a.status == "number" ? Ae[a.status] : a.status;
function Le(a) {
  return a >= 85 ? "var(--apya-positive-500)" : a >= 60 ? "var(--apya-warning-500)" : "var(--apya-negative-500)";
}
function Oe(a) {
  return a.startDate && a.endDate ? `${b(a.startDate)} — ${b(a.endDate)}` : a.startDate ? b(a.startDate) : a.endDate ? b(a.endDate) : "—";
}
function Ge({ row: a, isOpen: s, onToggle: p, currency: r }) {
  const o = V(a) || "Document", i = Re[Fe(a)], d = se[o] ?? se.Document, h = o === "Project" || o === "WorkStep" || o === "TaskGroup" || o === "UnassignedGroup";
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: W("apya-doc-row apya-doc-scope-row", h && "is-group", o === "MissingItem" && "is-missing"),
      style: { gridTemplateColumns: "minmax(0,1fr) 96px 104px 132px 156px 64px 128px 120px" },
      onClick: a.hasChildren ? p : void 0,
      role: a.hasChildren ? "button" : void 0,
      tabIndex: a.hasChildren ? 0 : void 0,
      onKeyDown: a.hasChildren ? (x) => {
        (x.key === "Enter" || x.key === " ") && (x.preventDefault(), p());
      } : void 0,
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2 text-truncate", style: { paddingLeft: a.depth * 20 }, children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-doc-scope-caret", children: a.hasChildren ? /* @__PURE__ */ e.jsx("i", { className: W("fa", s ? "fa-chevron-down" : "fa-chevron-right") }) : null }),
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
        /* @__PURE__ */ e.jsx("span", { children: i ? /* @__PURE__ */ e.jsx(F, { variant: i.variant, size: "sm", children: i.label }) : null }),
        /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 11.5, color: "var(--apya-text-secondary)" }, children: a.ownerName ?? "—" }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: Oe(a) }),
        /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11.5, textAlign: "center", color: "var(--apya-text-secondary)" }, children: a.documentCount > 0 ? a.documentCount : "—" }),
        /* @__PURE__ */ e.jsx(
          "span",
          {
            className: "apya-numeric",
            style: { fontSize: 11.5, textAlign: "right", color: a.amount ? "var(--apya-text-primary)" : "var(--apya-text-tertiary)" },
            children: a.amount ? k(a.amount, r) : "—"
          }
        ),
        a.compliancePercent === null || a.compliancePercent === void 0 ? /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)", textAlign: "right" }, children: "—" }) : /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("div", { className: "apya-doc-progress", style: { flex: 1 }, children: /* @__PURE__ */ e.jsx("div", { style: { width: `${a.compliancePercent}%`, background: Le(a.compliancePercent) } }) }),
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
  const a = new URLSearchParams(window.location.search).get("projectId"), [s, p] = l.useState(null), [r, o] = l.useState({}), [i, d] = l.useState(/* @__PURE__ */ new Set()), [h, x] = l.useState(!0), [E, N] = l.useState(!1), [g, S] = l.useState(a ?? null), [f, B] = l.useState(!1), [c, j] = l.useState(""), [t, z] = l.useState(""), I = ue.useRef(r);
  l.useEffect(() => {
    I.current = r;
  }, [r]);
  const R = l.useCallback(async (n) => {
    if (!(!n || I.current[n]))
      try {
        const m = await De(n);
        I.current = { ...I.current, [n]: m.rows }, o(I.current);
      } catch {
        A("error", "Proje dalı yüklenemedi.");
      }
  }, []);
  l.useEffect(() => {
    (async () => {
      try {
        const n = await Se();
        p(n);
        const m = a ? n.rows.find((y) => String(y.entityId).toLowerCase() === a.toLowerCase()) : null;
        m && (d(/* @__PURE__ */ new Set([m.id])), await R(m.entityId));
      } catch {
        A("error", "Kapsam yüklenemedi.");
      } finally {
        x(!1);
      }
    })();
  }, [a, R]);
  const ce = l.useCallback(async (n) => {
    const m = n.id, y = !i.has(m);
    d((M) => {
      const C = new Set(M);
      return C.has(m) ? C.delete(m) : C.add(m), C;
    }), y && V(n) === "Project" && S(n.entityId), y && n.isLazy && n.entityId && await R(n.entityId);
  }, [i, R]), oe = l.useCallback(async () => {
    if (!s) return;
    if (s.rows.every((m) => i.has(m.id))) {
      d(/* @__PURE__ */ new Set());
      return;
    }
    N(!0);
    try {
      await Promise.all(s.rows.filter((m) => m.entityId).map((m) => R(m.entityId))), d((m) => {
        const y = new Set(m);
        return s.rows.forEach((M) => y.add(M.id)), Object.values(I.current).forEach((M) => {
          M.forEach((C) => {
            C.hasChildren && y.add(C.id);
          });
        }), y;
      });
    } finally {
      N(!1);
    }
  }, [s, i, R]), de = l.useMemo(() => {
    if (!s) return [];
    const n = /* @__PURE__ */ new Map(), m = [], y = (v) => {
      n.set(v.id, v), m.push(v);
    };
    s.rows.forEach((v) => {
      y(v), (r[v.entityId] ?? []).forEach(y);
    });
    const M = (v) => {
      var ee;
      let D = v.parentId;
      for (; D; ) {
        if (!i.has(D)) return !1;
        D = ((ee = n.get(D)) == null ? void 0 : ee.parentId) ?? null;
      }
      return !0;
    }, C = (v) => {
      const D = V(v);
      return D === "Project" || D === "WorkStep" || D === "TaskGroup" || D === "UnassignedGroup" ? !0 : !(f && D !== "MissingItem" || c && D !== c || t && v.ownerName !== t);
    };
    return m.filter((v) => M(v) && C(v));
  }, [s, r, i, f, c, t]), me = l.useMemo(() => {
    const n = /* @__PURE__ */ new Set();
    return Object.values(r).forEach((m) => m.forEach((y) => {
      y.ownerName && n.add(y.ownerName);
    })), [...n].sort((m, y) => m.localeCompare(y, "tr"));
  }, [r]), L = !!((Q = s == null ? void 0 : s.rows) != null && Q.length), X = L && s.rows.every((n) => i.has(n.id)), pe = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      Z,
      {
        title: "Proje kapsamı",
        description: "Projeler, iş adımları, görevler ve bunlara bağlı belge · tutar · uygunluk",
        primary: L && (g ? /* @__PURE__ */ e.jsx(T, { asChild: !0, leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-export" }), children: /* @__PURE__ */ e.jsx("a", { href: `${$()}Documents/ReportBuilder?projectId=${g}`, children: "Kapsamı raporla" }) }) : /* @__PURE__ */ e.jsx(T, { disabled: !0, title: "Raporlamak için bir proje açın", leadingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-file-export" }), children: "Kapsamı raporla" })),
        menuItems: [
          L && {
            key: "expand",
            label: X ? "Hepsini kapat" : "Hepsini aç",
            icon: X ? "fa-compress" : "fa-expand",
            disabled: E,
            onSelect: oe
          }
        ]
      }
    ),
    /* @__PURE__ */ e.jsx(J, { active: "docs", projectId: g })
  ] }), K = (n) => /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    pe,
    n
  ] });
  if (h) return K(/* @__PURE__ */ e.jsx(Y, { rows: 8 }));
  if (!L)
    return K(
      /* @__PURE__ */ e.jsx(
        _,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-diagram-project" }),
          title: "Henüz proje yok",
          description: "Kapsam ağacı projelerden doğar; önce bir proje oluşturun.",
          action: /* @__PURE__ */ e.jsx(
            q,
            {
              primary: /* @__PURE__ */ e.jsx(T, { asChild: !0, children: /* @__PURE__ */ e.jsx("a", { href: `${$()}Projects`, children: "Projelere git" }) }),
              link: { label: "veya Dokümanlar'a dön", href: `${$()}Documents` }
            }
          )
        }
      )
    );
  const u = s.rollup;
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
              value: c,
              onChange: (n) => j(n.target.value),
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
              value: t,
              onChange: (n) => z(n.target.value),
              "aria-label": "Sorumlu süz",
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: "Sorumlu: tümü" }),
                me.map((n) => /* @__PURE__ */ e.jsx("option", { value: n, children: n }, n))
              ]
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: W("apya-doc-filterchip", f && "is-active"),
              onClick: () => B((n) => !n),
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
        de.map((n) => /* @__PURE__ */ e.jsx(
          Ge,
          {
            row: n,
            isOpen: i.has(n.id),
            onToggle: () => ce(n),
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
ne && H(ne, "documents-timeline", /* @__PURE__ */ e.jsx(Ee, {}));
const ie = document.getElementById("document-matching-island");
ie && H(ie, "documents-matching", /* @__PURE__ */ e.jsx(Me, {}));
const le = document.getElementById("project-scope-island");
le && H(le, "documents-scope", /* @__PURE__ */ e.jsx(We, {}));
