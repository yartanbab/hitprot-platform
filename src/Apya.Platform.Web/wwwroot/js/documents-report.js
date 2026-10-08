import { r, j as e } from "./react-vendor-D7YDiBbi.js";
import { E as M, m as ce } from "./index-DgpuJ91w.js";
import { B as C, e as D, I as Y } from "./Dialog-BdrRxZcw.js";
import { S as $ } from "./SkeletonShape-Ds5M097Q.js";
import { E as V, D as oe, P as de } from "./ProcessRibbon-D9pM1s89.js";
import { g as me, k as ue, a as ye } from "./api-DzWAfcOg.js";
const v = (a, n) => {
  var l, i, p;
  return (p = (i = (l = window == null ? void 0 : window.abp) == null ? void 0 : l.notify) == null ? void 0 : i[a]) == null ? void 0 : p.call(i, n);
}, T = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function S(a) {
  return new Promise((n, l) => {
    window.abp.ajax(a).done(n).fail(l);
  });
}
const b = (a, n = {}) => {
  const l = new URLSearchParams();
  Object.entries(n).forEach(([p, y]) => {
    y != null && y !== "" && l.append(p, y);
  });
  const i = l.toString();
  return `${T()}Documents/ReportBuilder?handler=${a}${i ? "&" + i : ""}`;
}, B = (a, n) => S({ url: a, type: "POST", contentType: "application/json", data: JSON.stringify(n) }), pe = () => S({ url: b("Templates"), type: "GET" }), he = (a) => B(b("UpdateSections"), a), xe = (a) => B(b("CreateTemplate"), a), fe = (a) => S({ url: b("DuplicateTemplate", { id: a }), type: "POST" }), ke = (a) => S({ url: b("DeleteTemplate", { id: a }), type: "POST" }), be = () => S({ url: b("Projects"), type: "GET" }), ge = (a, n, l) => S({ url: b("Preview", { projectId: a, templateId: n, periodCode: l }), type: "GET" }), je = (a, n, l) => b("PreviewPdf", { projectId: a, templateId: n, periodCode: l }), ve = (a) => S({ url: b("Packages", { projectId: a }), type: "GET" }), I = (a) => S({ url: b("ShareLinks", { packageId: a }), type: "GET" }), Se = (a) => B(b("CreateShareLink"), a), Ne = (a) => S({ url: b("RevokeShareLink", { id: a }), type: "POST" }), _ = (a, n = "TRY") => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + " " + ({ TRY: "₺", USD: "$", EUR: "€" }[n] || n), Q = (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—", X = {
  1: "Proje özeti",
  2: "İş adımı ilerlemesi",
  3: "Zaman çizelgesi",
  4: "Harcama ↔ belge eşleşmesi",
  5: "Ekip katkısı",
  6: "Eksik belgeler",
  7: "Uygunluk durumu",
  8: "Ek dizini",
  9: "Riskler",
  10: "Denetim izi",
  11: "Kilometre taşları",
  12: "Kapak sayfası",
  13: "Bütçe özeti",
  14: "Görev ilerlemesi"
}, we = {
  1: "Kurum",
  2: "Banka / finans",
  3: "Müşteri",
  4: "Denetçi · YMM",
  5: "İç kullanım"
}, ze = (a) => S({ url: b("Schedules", { projectId: a }), type: "GET" }), Ce = (a) => B(b("CreateSchedule"), a), Pe = (a, n) => S({ url: b("SetScheduleEnabled", { id: a, isEnabled: n }), type: "POST" }), Te = (a) => S({ url: b("DeleteSchedule", { id: a }), type: "POST" }), De = (a, n) => B(b("AddSubscriber", { scheduleId: a }), n), Ee = (a) => S({ url: b("RemoveSubscriber", { subscriberId: a }), type: "POST" }), Be = 1, Ae = 7, Re = 160, Le = (a, n) => String(a ?? "").toLowerCase() === String(n ?? "").toLowerCase();
function $e(a, n) {
  return (a ?? []).find((l) => l.status === Be && Le(l.reportTemplateId, n)) ?? null;
}
function Oe(a, n = /* @__PURE__ */ new Date()) {
  const i = ` · ${new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(n)}`;
  return `${a.slice(0, Re - i.length)}${i}`;
}
async function Ie({ projectId: a, template: n }) {
  const l = $e(await me(a), n.id);
  return l ? { pkg: l, created: !1 } : { pkg: await ue({
    projectId: a,
    name: Oe(n.name),
    reportTemplateId: n.id,
    formats: Ae
  }), created: !0 };
}
function Me({ projectId: a, template: n, onPickProject: l }) {
  const [i, p] = r.useState(null), [y, f] = r.useState(""), [h, c] = r.useState(!1), x = r.useCallback(async () => {
    if (!a) {
      p(null);
      return;
    }
    c(!0);
    try {
      p(await ge(a, n == null ? void 0 : n.id, y));
    } catch (u) {
      v("error", "Önizleme üretilemedi."), console.error("[ReportBuilder] preview", u);
    } finally {
      c(!1);
    }
  }, [a, n == null ? void 0 : n.id, y]);
  if (r.useEffect(() => {
    x();
  }, [x]), !a)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx(
      M,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-eye" }),
        title: "Proje bağlamı gerekiyor",
        description: "Önizleme gerçek veriyle üretilir; üstteki listeden bir proje seçin.",
        action: /* @__PURE__ */ e.jsx(
          V,
          {
            primary: /* @__PURE__ */ e.jsx(C, { size: "sm", onClick: l, children: "Proje seç" }),
            link: { label: "veya proje kapsamından seç", href: `${T()}Documents/Scope` }
          }
        )
      }
    ) });
  if (h) return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx($, { rows: 6 }) });
  if (!i) return null;
  const d = i.summary;
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
      /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: [
        i.projectName,
        i.templateName && /* @__PURE__ */ e.jsxs("span", { style: { fontWeight: 400, color: "var(--apya-text-tertiary)" }, children: [
          " · ",
          i.templateName
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            className: "apya-doc-input",
            style: { width: 110 },
            placeholder: "Dönem (ops.)",
            value: y,
            onChange: (u) => f(u.target.value),
            "aria-label": "Dönem kodu"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "a",
          {
            className: "apya-doc-linkbtn",
            target: "_blank",
            rel: "noreferrer",
            href: je(a, n == null ? void 0 : n.id, y),
            children: "PDF önizle"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { style: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: ".06em",
      color: "var(--apya-negative-500)",
      marginBottom: 8
    }, children: "ÖNİZLEME — TESLİM İÇİN KULLANMAYIN" }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpis", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Uygunluk" }),
        /* @__PURE__ */ e.jsxs("div", { className: "apya-numeric apya-doc-kpi-value", children: [
          "%",
          d.compliancePercent
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Belge" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: d.documentCount })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Eksik" }),
        /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "apya-numeric apya-doc-kpi-value",
            style: { color: d.blockingCount > 0 ? "var(--apya-negative-500)" : void 0 },
            children: d.missingCount
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
          d.blockingCount,
          " bloke edici"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Belgelenen tutar" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", style: { fontSize: 16 }, children: _(d.documentedAmount, d.currency) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline", children: [
      "Çıktıya girecek bölümler (",
      i.sections.length,
      ")"
    ] }),
    i.sections.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Açık bölüm yok — Bölümler sekmesinden en az bir tane açın." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-1 mb-3", children: i.sections.map((u, s) => /* @__PURE__ */ e.jsxs(D, { variant: "neutral", size: "sm", children: [
      s + 1,
      ". ",
      X[u] ?? u
    ] }, `${u}-${s}`)) }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline", children: [
      "Ekler (",
      i.annexes.length,
      i.truncatedAnnexCount > 0 && ` · +${i.truncatedAnnexCount} gösterilmiyor`,
      ")"
    ] }),
    i.annexes.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu projede henüz belge yok; ek dizini boş çıkacak." }) : i.annexes.slice(0, 12).map((u) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "apya-doc-check-row",
        style: { gridTemplateColumns: "60px minmax(0,1fr) 90px 110px" },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11 }, children: u.annexNumber }),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: u.documentName }),
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: u.typeName ?? "—" }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric text-end", style: { fontSize: 11.5 }, children: u.amount != null ? _(u.amount) : Q(u.documentDate) })
        ]
      },
      u.annexNumber + u.documentName
    )),
    i.missingDocuments.length > 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mt-3", children: [
        "Eksik belgeler (",
        i.missingDocuments.length,
        ")"
      ] }),
      i.missingDocuments.slice(0, 10).map((u, s) => /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 12, padding: "3px 0" }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation", style: { color: "var(--apya-warning-500)" } }),
        " ",
        u
      ] }, s))
    ] })
  ] });
}
const We = [
  { value: 2, label: "Aylık" },
  { value: 3, label: "Üç aylık" },
  { value: 1, label: "Haftalık" }
], ee = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"], Z = (a) => a ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(a)) : "—";
function Fe(a) {
  if (a.frequency === 1) return `Her ${ee[a.dayOfWeek]}, ${a.hourOfDay}:00`;
  const n = a.frequency === 3 ? "üç ayda bir" : "her ay";
  return `Ayın ${a.dayOfMonth}'i, ${n}, ${a.hourOfDay}:00`;
}
function Ke({ schedule: a, busy: n, onChanged: l }) {
  const [i, p] = r.useState(""), [y, f] = r.useState(""), [h, c] = r.useState(!1), x = async () => {
    var d, u;
    try {
      await De(a.id, { name: i.trim(), email: y.trim(), userId: null }), p(""), f(""), c(!1), l();
    } catch (s) {
      v("error", ((u = (d = s == null ? void 0 : s.responseJSON) == null ? void 0 : d.error) == null ? void 0 : u.message) || "Abone eklenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", children: [
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Aboneler" }),
    a.subscribers.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Abone yok — üretim yine yapılır, kimse haberdar edilmez." }) : a.subscribers.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", style: { fontSize: 12 }, children: [
      /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { flex: 1 }, children: [
        d.name,
        " ",
        /* @__PURE__ */ e.jsxs("span", { style: { color: "var(--apya-text-tertiary)" }, children: [
          "· ",
          d.email
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "apya-doc-linkbtn",
          disabled: n,
          onClick: async () => {
            await Ee(d.id), l();
          },
          children: "Çıkar"
        }
      )
    ] }, d.id)),
    h ? /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
      /* @__PURE__ */ e.jsx(Y, { size: "sm", placeholder: "Ad", value: i, onChange: (d) => p(d.target.value) }),
      /* @__PURE__ */ e.jsx(Y, { size: "sm", type: "email", placeholder: "e-posta", value: y, onChange: (d) => f(d.target.value) }),
      /* @__PURE__ */ e.jsx(C, { size: "sm", disabled: !i.trim() || !y.trim(), onClick: x, children: "Ekle" }),
      /* @__PURE__ */ e.jsx(C, { size: "sm", variant: "outline", onClick: () => c(!1), children: "Vazgeç" })
    ] }) : /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: () => c(!0), children: "+ Abone ekle" })
  ] });
}
function Ue({ projectId: a, packages: n }) {
  const [l, i] = r.useState([]), [p, y] = r.useState(!0), [f, h] = r.useState(!1), [c, x] = r.useState(null), d = r.useCallback(async () => {
    if (!a) {
      i([]), y(!1);
      return;
    }
    y(!0);
    try {
      i(await ze(a) ?? []);
    } catch (s) {
      v("error", "Zamanlamalar yüklenemedi."), console.error("[Documents] schedules", s);
    } finally {
      y(!1);
    }
  }, [a]);
  r.useEffect(() => {
    d();
  }, [d]);
  const u = async () => {
    h(!0);
    try {
      await Ce({
        deliveryPackageId: c.deliveryPackageId,
        frequency: Number(c.frequency),
        dayOfMonth: Number(c.dayOfMonth),
        dayOfWeek: Number(c.dayOfWeek),
        hourOfDay: Number(c.hourOfDay)
      }), x(null), await d();
    } catch (s) {
      v("error", "Zamanlama kurulamadı."), console.error("[Documents] createSchedule", s);
    } finally {
      h(!1);
    }
  };
  return a ? p ? /* @__PURE__ */ e.jsx($, { rows: 3 }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
      /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "Zamanlanmış üretim" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      !c && n.length > 0 && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "apya-doc-linkbtn",
          onClick: () => x({
            deliveryPackageId: n[0].id,
            frequency: 2,
            dayOfMonth: 1,
            dayOfWeek: 1,
            hourOfDay: 6
          }),
          children: "+ Zamanlama ekle"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Seçtiğiniz teslim paketi bu ritimde yeniden üretilir; her üretim sürüm arşivine yeni bir satır ekler. Abonelere dosya değil, arşive götüren bir bildirim gider." }),
    n.length === 0 && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Önce bir teslim paketi oluşturun — zamanlama mevcut bir paketi üretir." }),
    c && /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2 align-items-center", children: [
      /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: c.deliveryPackageId,
          onChange: (s) => x({ ...c, deliveryPackageId: s.target.value }),
          "aria-label": "Paket",
          children: n.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.id, children: s.name }, s.id))
        }
      ),
      /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: c.frequency,
          onChange: (s) => x({ ...c, frequency: Number(s.target.value) }),
          "aria-label": "Sıklık",
          children: We.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.value, children: s.label }, s.value))
        }
      ),
      Number(c.frequency) === 1 ? /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: c.dayOfWeek,
          onChange: (s) => x({ ...c, dayOfWeek: Number(s.target.value) }),
          "aria-label": "Gün",
          children: ee.map((s, j) => /* @__PURE__ */ e.jsx("option", { value: j, children: s }, s))
        }
      ) : /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: c.dayOfMonth,
          onChange: (s) => x({ ...c, dayOfMonth: Number(s.target.value) }),
          "aria-label": "Ayın günü",
          children: Array.from({ length: 28 }, (s, j) => j + 1).map((s) => /* @__PURE__ */ e.jsxs("option", { value: s, children: [
            "Ayın ",
            s,
            "'i"
          ] }, s))
        }
      ),
      /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: c.hourOfDay,
          onChange: (s) => x({ ...c, hourOfDay: Number(s.target.value) }),
          "aria-label": "Saat",
          children: Array.from({ length: 24 }, (s, j) => j).map((s) => /* @__PURE__ */ e.jsxs("option", { value: s, children: [
            String(s).padStart(2, "0"),
            ":00"
          ] }, s))
        }
      ),
      /* @__PURE__ */ e.jsx(C, { size: "sm", isLoading: f, onClick: u, children: "Kur" }),
      /* @__PURE__ */ e.jsx(C, { size: "sm", variant: "outline", onClick: () => x(null), children: "Vazgeç" })
    ] }),
    l.map((s) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex flex-column gap-2 p-2",
        style: { background: "var(--apya-surface-sunken)", borderRadius: 10 },
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12.5, fontWeight: 600 }, children: s.packageName }),
            /* @__PURE__ */ e.jsx(D, { variant: s.isEnabled ? "positive" : "neutral", size: "sm", children: s.isEnabled ? "açık" : "kapalı" }),
            /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11.5, color: "var(--apya-text-secondary)" }, children: Fe(s) }),
            /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: f,
                onClick: async () => {
                  h(!0);
                  try {
                    await Pe(s.id, !s.isEnabled), await d();
                  } finally {
                    h(!1);
                  }
                },
                children: s.isEnabled ? "Duraklat" : "Sürdür"
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: f,
                onClick: async () => {
                  await Te(s.id), await d();
                },
                children: "Sil"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-3 flex-wrap apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
            /* @__PURE__ */ e.jsxs("span", { children: [
              "sıradaki: ",
              Z(s.nextRunAt)
            ] }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              "son: ",
              Z(s.lastRunAt)
            ] })
          ] }),
          s.lastError && /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-negative-500)" }, children: [
            "Son deneme başarısız: ",
            s.lastError
          ] }),
          /* @__PURE__ */ e.jsx(Ke, { schedule: s, busy: f, onChanged: d })
        ]
      },
      s.id
    )),
    l.length === 0 && !c && n.length > 0 && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Kurulu zamanlama yok." })
  ] }) : null;
}
function qe({ projectId: a, onPickProject: n }) {
  const [l, i] = r.useState([]), [p, y] = r.useState(null), [f, h] = r.useState([]), [c, x] = r.useState(null), [d, u] = r.useState(!1), [s, j] = r.useState(!1), w = r.useCallback(async () => {
    if (!a) {
      i([]);
      return;
    }
    u(!0);
    try {
      i(await ve(a) ?? []);
    } catch (o) {
      v("error", "Paketler yüklenemedi."), console.error("[ReportBuilder] packages", o);
    } finally {
      u(!1);
    }
  }, [a]);
  r.useEffect(() => {
    w();
  }, [w]);
  const P = async (o) => {
    y(o), x(null);
    try {
      h(await I(o.id) ?? []);
    } catch (z) {
      console.error("[ReportBuilder] shareLinks", z);
    }
  }, E = async (o) => {
    if (p) {
      j(!0);
      try {
        const z = await Se({
          targetType: 1,
          // DeliveryPackage
          targetId: p.id,
          lifetimeDays: 30,
          allowDownload: o,
          watermark: null
        });
        x(z), h(await I(p.id) ?? []);
      } catch {
        v("error", "Paylaşım linki oluşturulamadı.");
      } finally {
        j(!1);
      }
    }
  }, A = async (o) => {
    j(!0);
    try {
      await Ne(o), h(await I(p.id) ?? []);
    } catch {
      v("error", "Link iptal edilemedi.");
    } finally {
      j(!1);
    }
  };
  return a ? d ? /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx($, { rows: 5 }) }) : /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-3", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
        /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "Üretilmiş paketler" }),
        /* @__PURE__ */ e.jsx(
          "a",
          {
            className: "apya-doc-linkbtn",
            href: `${T()}Documents/Deliveries?projectId=${a}`,
            children: "Teslimler ekranı"
          }
        )
      ] }),
      l.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu projede paket yok. Dağıtmak için önce Teslimler ekranından bir paket üretin." }) : l.map((o) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: `apya-md-item${(p == null ? void 0 : p.id) === o.id ? " selected" : ""}`,
          style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 },
          onClick: () => P(o),
          children: [
            /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1, textAlign: "left" }, children: [
              /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: o.name }),
              /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                o.reportTemplateName ?? "şablonsuz",
                o.periodCode && ` · ${o.periodCode}`
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(D, { variant: o.status === 2 ? "positive" : o.status === 3 ? "accent" : "neutral", size: "sm", children: o.status === 2 ? "üretildi" : o.status === 3 ? "gönderildi" : "taslak" })
          ]
        },
        o.id
      )),
      p && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mt-3", children: [
          "Paylaşım linkleri · ",
          p.name
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 mb-2", children: [
          /* @__PURE__ */ e.jsx(C, { variant: "outline", size: "sm", disabled: s, onClick: () => E(!1), children: "Salt görüntüleme linki" }),
          /* @__PURE__ */ e.jsx(C, { variant: "outline", size: "sm", disabled: s, onClick: () => E(!0), children: "İndirmeye açık link" })
        ] }),
        c && /* @__PURE__ */ e.jsxs("div", { style: {
          fontSize: 11.5,
          padding: 8,
          borderRadius: 8,
          background: "var(--apya-surface-sunken)",
          marginBottom: 8,
          wordBreak: "break-all"
        }, children: [
          /* @__PURE__ */ e.jsx("strong", { children: "Link yalnız şimdi gösterilir" }),
          " — kopyalayın, tekrar görüntülenemez:",
          /* @__PURE__ */ e.jsxs("div", { className: "apya-numeric mt-1", children: [
            window.location.origin,
            T(),
            "Share/",
            c.token
          ] })
        ] }),
        f.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu pakette link yok." }) : f.map((o) => /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "apya-doc-check-row",
            style: { gridTemplateColumns: "minmax(0,1fr) 110px 90px 70px" },
            children: [
              /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 12 }, children: [
                o.allowDownload ? "İndirilebilir" : "Salt görüntüleme",
                o.isRevoked && /* @__PURE__ */ e.jsx(D, { variant: "negative", size: "sm", children: "iptal" })
              ] }),
              /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
                Q(o.expiresAt),
                " bitiyor"
              ] }),
              /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11 }, children: [
                o.accessCount ?? 0,
                " erişim"
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "text-end", children: !o.isRevoked && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "apya-doc-linkbtn",
                  disabled: s,
                  onClick: () => A(o.id),
                  children: "İptal"
                }
              ) })
            ]
          },
          o.id
        ))
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(Ue, { projectId: a, packages: l })
  ] }) : /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx(
    M,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-share-nodes" }),
      title: "Proje bağlamı gerekiyor",
      description: "Dağıtım üretilmiş paketler üzerinden yürür; üstteki listeden bir proje seçin.",
      action: /* @__PURE__ */ e.jsx(
        V,
        {
          primary: /* @__PURE__ */ e.jsx(C, { size: "sm", onClick: n, children: "Proje seç" }),
          link: { label: "veya proje kapsamından seç", href: `${T()}Documents/Scope` }
        }
      )
    }
  ) });
}
const H = (...a) => a.filter(Boolean).join(" "), Ge = [
  { key: "sections", label: "Bölümler" },
  { key: "preview", label: "Önizleme" },
  { key: "distribution", label: "Dağıtım" }
];
function Ye({ section: a, onToggle: n, onMove: l, isFirst: i, isLast: p, busy: y, readOnly: f }) {
  const h = X[a.sectionKey] ?? `Bölüm ${a.sectionKey}`;
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", style: { gridTemplateColumns: "34px minmax(0,1fr) auto auto" }, children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "checkbox",
        checked: a.isEnabled,
        disabled: y || f || !a.isAvailable,
        onChange: (c) => n(a.id, c.target.checked),
        "aria-label": `${h} bölümünü aç/kapa`
      }
    ),
    /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e.jsx(
        "span",
        {
          className: "d-block text-truncate",
          style: { fontSize: 12.5, opacity: a.isAvailable ? 1 : 0.55 },
          children: h
        }
      ),
      !a.isAvailable && /* @__PURE__ */ e.jsx("span", { style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: "verisi henüz yok — açılamaz" })
    ] }),
    /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: a.order }),
    /* @__PURE__ */ e.jsxs("span", { className: "d-flex gap-1", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "apya-doc-linkbtn",
          disabled: y || f || i,
          onClick: () => l(a.id, -1),
          "aria-label": "Yukarı taşı",
          children: "↑"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "apya-doc-linkbtn",
          disabled: y || f || p,
          onClick: () => l(a.id, 1),
          "aria-label": "Aşağı taşı",
          children: "↓"
        }
      )
    ] })
  ] });
}
function _e() {
  var q, G;
  const a = new URLSearchParams(window.location.search), [n, l] = r.useState([]), [i, p] = r.useState([]), [y, f] = r.useState(null), [h, c] = r.useState((a.get("projectId") || "").toLowerCase()), [x, d] = r.useState("sections"), [u, s] = r.useState(!0), [j, w] = r.useState(!1), [P, E] = r.useState(null), A = r.useRef(null), o = ye("Platform.Documents.GenerateReports"), z = r.useCallback(async () => {
    s(!0);
    try {
      const [t, m] = await Promise.all([pe(), be()]);
      l(t ?? []), p(m ?? []), f((k) => {
        var N;
        return k ?? ((N = t == null ? void 0 : t[0]) == null ? void 0 : N.id) ?? null;
      });
    } catch (t) {
      v("error", "Şablonlar yüklenemedi."), console.error("[ReportBuilder] load", t);
    } finally {
      s(!1);
    }
  }, []);
  r.useEffect(() => {
    z();
  }, [z]);
  const g = r.useMemo(
    () => n.find((t) => t.id === y) ?? null,
    [n, y]
  ), O = g ? (g.tenantId ?? null) === (((G = (q = window.abp) == null ? void 0 : q.currentTenant) == null ? void 0 : G.id) ?? null) : !1, R = r.useMemo(
    () => g ? [...g.sections].sort((t, m) => t.order - m.order) : [],
    [g]
  ), W = async (t) => {
    if (!(!g || !O)) {
      w(!0);
      try {
        const m = await he({
          templateId: g.id,
          sections: t.map((k, N) => ({ sectionId: k.id, order: N + 1, isEnabled: k.isEnabled }))
        });
        l((k) => k.map((N) => N.id === m.id ? m : N));
      } catch (m) {
        v("error", "Bölümler kaydedilemedi."), console.error("[ReportBuilder] persistSections", m);
      } finally {
        w(!1);
      }
    }
  }, ae = (t, m) => W(R.map((k) => k.id === t ? { ...k, isEnabled: m } : k)), te = (t, m) => {
    const k = [...R], N = k.findIndex((re) => re.id === t), L = N + m;
    N < 0 || L < 0 || L >= k.length || ([k[N], k[L]] = [k[L], k[N]], W(k));
  }, se = async () => {
    const t = window.prompt("Şablon adı:");
    if (t) {
      w(!0);
      try {
        const m = await xe({ name: t, recipient: 1, issuer: null, order: n.length + 1 });
        await z(), f(m.id);
      } catch {
        v("error", "Şablon oluşturulamadı.");
      } finally {
        w(!1);
      }
    }
  }, ne = async (t) => {
    w(!0);
    try {
      const m = await fe(t);
      await z(), f(m.id);
    } catch {
      v("error", "Şablon kopyalanamadı.");
    } finally {
      w(!1);
    }
  }, ie = async (t) => {
    if (window.confirm("Bu şablon silinsin mi? Üretilmiş paketler etkilenmez.")) {
      w(!0);
      try {
        await ke(t), f(null), await z();
      } catch {
        v("error", "Şablon silinemedi.");
      } finally {
        w(!1);
      }
    }
  }, F = (t) => `${T()}Documents/Deliveries?projectId=${h}` + (t ? `&packageId=${t}` : ""), K = async ({ silent: t = !1 } = {}) => {
    E(t ? "deliver" : "save");
    try {
      const { pkg: m, created: k } = await Ie({ projectId: h, template: g });
      return t || v(k ? "success" : "info", k ? `Taslak kaydedildi: ${m.name}` : `Bu şablonun taslağı zaten kayıtlı: ${m.name}`), m;
    } catch (m) {
      return v("error", "Taslak kaydedilemedi."), console.error("[ReportBuilder] saveDraft", m), null;
    } finally {
      E(null);
    }
  }, le = async () => {
    if (!o || !g) {
      window.location.assign(F(null));
      return;
    }
    const t = await K({ silent: !0 });
    t && window.location.assign(F(t.id));
  }, U = () => {
    var m;
    const t = A.current;
    if (t) {
      t.focus();
      try {
        (m = t.showPicker) == null || m.call(t);
      } catch {
      }
    }
  };
  return u ? /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx($, { rows: 8 }) }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsx(
      oe,
      {
        title: "Rapor derleyici",
        description: "Şablonun bölümlerini seç, önizle, alıcıya dağıt",
        aside: /* @__PURE__ */ e.jsxs(
          "select",
          {
            ref: A,
            className: "apya-doc-select",
            value: h,
            onChange: (t) => c(t.target.value),
            "aria-label": "Proje bağlamı",
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Proje seçin…" }),
              i.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.id, children: t.code ? `${t.code} · ${t.name}` : t.name }, t.id))
            ]
          }
        ),
        menuItems: [
          { key: "new-template", label: "Yeni şablon", icon: "fa-plus", disabled: j, onSelect: se }
        ]
      }
    ),
    /* @__PURE__ */ e.jsx(de, { active: "report", projectId: h || null }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-doc-tabs mb-3", role: "tablist", children: Ge.map((t) => /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": x === t.key,
        className: H("apya-doc-tab", x === t.key && "is-active"),
        onClick: () => d(t.key),
        children: t.label
      },
      t.key
    )) }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-subflow", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-doc-subflow-text", children: h ? "Bu ekranda: bölümleri seç ve sırala → önizle → üret. Ürettiğin rapor Teslim adımına geçer." : "Önce yukarıdan bir proje seçin — taslak ve teslim proje bağlamında çalışır." }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-subflow-actions", role: "group", "aria-label": "Rapor akışı", children: [
        o && /* @__PURE__ */ e.jsx(
          C,
          {
            variant: "secondary",
            size: "sm",
            isLoading: P === "save",
            disabled: !h || !g || P !== null,
            onClick: () => K(),
            children: "Taslak kaydet"
          }
        ),
        /* @__PURE__ */ e.jsx(C, { variant: "secondary", size: "sm", disabled: x === "preview", onClick: () => d("preview"), children: "Önizle" }),
        /* @__PURE__ */ e.jsx(
          C,
          {
            variant: "primary",
            size: "sm",
            isLoading: P === "deliver",
            disabled: !h || P !== null,
            trailingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right", "aria-hidden": "true" }),
            onClick: le,
            children: o ? "Üret ve teslime geç" : "Teslime geç"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-reportgrid", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Şablonlar" }),
        n.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Şablon yok." }) : n.map((t) => /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: H("apya-md-item", y === t.id && "selected"),
            style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 },
            onClick: () => f(t.id),
            children: [
              /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1, textAlign: "left" }, children: [
                /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: t.name }),
                /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                  we[t.recipient] ?? "—",
                  t.issuer && ` · ${t.issuer}`
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-1", children: [
                t.isSystem && /* @__PURE__ */ e.jsx(D, { variant: "neutral", size: "sm", children: "sistem" }),
                /* @__PURE__ */ e.jsx(D, { variant: "accent", size: "sm", children: t.enabledSectionCount })
              ] })
            ]
          },
          t.id
        ))
      ] }),
      x === "sections" && /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: g ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: g.name }),
          /* @__PURE__ */ e.jsxs("span", { className: "d-flex gap-2", children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: j,
                onClick: () => ne(g.id),
                children: "Kopyala"
              }
            ),
            !g.isSystem && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: j,
                onClick: () => ie(g.id),
                children: "Sil"
              }
            )
          ] })
        ] }),
        O ? g.isSystem && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)", marginBottom: 6 }, children: "Sistem şablonu tüm kiracılarda paylaşılır; künyesi düzenlenemez. Burada yaptığınız bölüm değişikliği bütün kiracıların raporuna yansır." }) : /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)", marginBottom: 6 }, children: [
          "Sistem şablonu tüm kiracılarda paylaşılır; bölümleri ve künyesi buradan değiştirilemez. Kendinize uyarlamak için ",
          /* @__PURE__ */ e.jsx("strong", { children: "Kopyala" }),
          "'yı kullanın."
        ] }),
        R.map((t, m) => /* @__PURE__ */ e.jsx(
          Ye,
          {
            section: t,
            busy: j,
            readOnly: !O,
            isFirst: m === 0,
            isLast: m === R.length - 1,
            onToggle: ae,
            onMove: te
          },
          t.id
        ))
      ] }) : /* @__PURE__ */ e.jsx(
        M,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check" }),
          title: "Şablon seçin",
          description: "Soldan bir şablon seçerek bölümlerini düzenleyin."
        }
      ) }),
      x === "preview" && /* @__PURE__ */ e.jsx(Me, { projectId: h, template: g, onPickProject: U }),
      x === "distribution" && /* @__PURE__ */ e.jsx(qe, { projectId: h, onPickProject: U })
    ] })
  ] });
}
const J = document.getElementById("report-builder-island");
J && ce(J, "documents-report", /* @__PURE__ */ e.jsx(_e, {}));
