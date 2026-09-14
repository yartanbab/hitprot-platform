import { r, j as e, b as ie } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { B as C, e as D, I as U } from "./Dialog-Bky2XNdc.js";
import { S as $ } from "./SkeletonShape-BzeBQ1R3.js";
import { E as I } from "./EmptyState-D5m5kdmR.js";
import { E as Z, D as le, P as re } from "./ProcessRibbon-BtZ1ri4F.js";
import { g as ce, l as oe, a as de } from "./api-DE9auhlW.js";
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
}, A = (a, n) => S({ url: a, type: "POST", contentType: "application/json", data: JSON.stringify(n) }), me = () => S({ url: b("Templates"), type: "GET" }), ue = (a) => A(b("UpdateSections"), a), ye = (a) => A(b("CreateTemplate"), a), pe = (a) => S({ url: b("DuplicateTemplate", { id: a }), type: "POST" }), he = (a) => S({ url: b("DeleteTemplate", { id: a }), type: "POST" }), xe = () => S({ url: b("Projects"), type: "GET" }), fe = (a, n, l) => S({ url: b("Preview", { projectId: a, templateId: n, periodCode: l }), type: "GET" }), ke = (a, n, l) => b("PreviewPdf", { projectId: a, templateId: n, periodCode: l }), be = (a) => S({ url: b("Packages", { projectId: a }), type: "GET" }), O = (a) => S({ url: b("ShareLinks", { packageId: a }), type: "GET" }), ge = (a) => A(b("CreateShareLink"), a), je = (a) => S({ url: b("RevokeShareLink", { id: a }), type: "POST" }), q = (a, n = "TRY") => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + " " + ({ TRY: "₺", USD: "$", EUR: "€" }[n] || n), H = (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—", J = {
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
  12: "Kapak sayfası"
}, ve = {
  1: "Kurum",
  2: "Banka / finans",
  3: "Müşteri",
  4: "Denetçi · YMM",
  5: "İç kullanım"
}, Se = (a) => S({ url: b("Schedules", { projectId: a }), type: "GET" }), Ne = (a) => A(b("CreateSchedule"), a), we = (a, n) => S({ url: b("SetScheduleEnabled", { id: a, isEnabled: n }), type: "POST" }), ze = (a) => S({ url: b("DeleteSchedule", { id: a }), type: "POST" }), Ce = (a, n) => A(b("AddSubscriber", { scheduleId: a }), n), Pe = (a) => S({ url: b("RemoveSubscriber", { subscriberId: a }), type: "POST" }), Te = 1, De = 7, Ee = 160, Ae = (a, n) => String(a ?? "").toLowerCase() === String(n ?? "").toLowerCase();
function Re(a, n) {
  return (a ?? []).find((l) => l.status === Te && Ae(l.reportTemplateId, n)) ?? null;
}
function Be(a, n = /* @__PURE__ */ new Date()) {
  const i = ` · ${new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(n)}`;
  return `${a.slice(0, Ee - i.length)}${i}`;
}
async function Le({ projectId: a, template: n }) {
  const l = Re(await ce(a), n.id);
  return l ? { pkg: l, created: !1 } : { pkg: await oe({
    projectId: a,
    name: Be(n.name),
    reportTemplateId: n.id,
    formats: De
  }), created: !0 };
}
function $e({ projectId: a, template: n, onPickProject: l }) {
  const [i, p] = r.useState(null), [y, f] = r.useState(""), [h, o] = r.useState(!1), x = r.useCallback(async () => {
    if (!a) {
      p(null);
      return;
    }
    o(!0);
    try {
      p(await fe(a, n == null ? void 0 : n.id, y));
    } catch (u) {
      v("error", "Önizleme üretilemedi."), console.error("[ReportBuilder] preview", u);
    } finally {
      o(!1);
    }
  }, [a, n == null ? void 0 : n.id, y]);
  if (r.useEffect(() => {
    x();
  }, [x]), !a)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx(
      I,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-eye" }),
        title: "Proje bağlamı gerekiyor",
        description: "Önizleme gerçek veriyle üretilir; üstteki listeden bir proje seçin.",
        action: /* @__PURE__ */ e.jsx(
          Z,
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
            href: ke(a, n == null ? void 0 : n.id, y),
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
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", style: { fontSize: 16 }, children: q(d.documentedAmount, d.currency) })
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
      J[u] ?? u
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
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric text-end", style: { fontSize: 11.5 }, children: u.amount != null ? q(u.amount) : H(u.documentDate) })
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
const Oe = [
  { value: 2, label: "Aylık" },
  { value: 3, label: "Üç aylık" },
  { value: 1, label: "Haftalık" }
], V = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"], G = (a) => a ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(a)) : "—";
function Ie(a) {
  if (a.frequency === 1) return `Her ${V[a.dayOfWeek]}, ${a.hourOfDay}:00`;
  const n = a.frequency === 3 ? "üç ayda bir" : "her ay";
  return `Ayın ${a.dayOfMonth}'i, ${n}, ${a.hourOfDay}:00`;
}
function Me({ schedule: a, busy: n, onChanged: l }) {
  const [i, p] = r.useState(""), [y, f] = r.useState(""), [h, o] = r.useState(!1), x = async () => {
    var d, u;
    try {
      await Ce(a.id, { name: i.trim(), email: y.trim(), userId: null }), p(""), f(""), o(!1), l();
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
            await Pe(d.id), l();
          },
          children: "Çıkar"
        }
      )
    ] }, d.id)),
    h ? /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
      /* @__PURE__ */ e.jsx(U, { size: "sm", placeholder: "Ad", value: i, onChange: (d) => p(d.target.value) }),
      /* @__PURE__ */ e.jsx(U, { size: "sm", type: "email", placeholder: "e-posta", value: y, onChange: (d) => f(d.target.value) }),
      /* @__PURE__ */ e.jsx(C, { size: "sm", disabled: !i.trim() || !y.trim(), onClick: x, children: "Ekle" }),
      /* @__PURE__ */ e.jsx(C, { size: "sm", variant: "outline", onClick: () => o(!1), children: "Vazgeç" })
    ] }) : /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: () => o(!0), children: "+ Abone ekle" })
  ] });
}
function We({ projectId: a, packages: n }) {
  const [l, i] = r.useState([]), [p, y] = r.useState(!0), [f, h] = r.useState(!1), [o, x] = r.useState(null), d = r.useCallback(async () => {
    if (!a) {
      i([]), y(!1);
      return;
    }
    y(!0);
    try {
      i(await Se(a) ?? []);
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
      await Ne({
        deliveryPackageId: o.deliveryPackageId,
        frequency: Number(o.frequency),
        dayOfMonth: Number(o.dayOfMonth),
        dayOfWeek: Number(o.dayOfWeek),
        hourOfDay: Number(o.hourOfDay)
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
      !o && n.length > 0 && /* @__PURE__ */ e.jsx(
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
    o && /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2 align-items-center", children: [
      /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: o.deliveryPackageId,
          onChange: (s) => x({ ...o, deliveryPackageId: s.target.value }),
          "aria-label": "Paket",
          children: n.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.id, children: s.name }, s.id))
        }
      ),
      /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: o.frequency,
          onChange: (s) => x({ ...o, frequency: Number(s.target.value) }),
          "aria-label": "Sıklık",
          children: Oe.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.value, children: s.label }, s.value))
        }
      ),
      Number(o.frequency) === 1 ? /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: o.dayOfWeek,
          onChange: (s) => x({ ...o, dayOfWeek: Number(s.target.value) }),
          "aria-label": "Gün",
          children: V.map((s, g) => /* @__PURE__ */ e.jsx("option", { value: g, children: s }, s))
        }
      ) : /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: o.dayOfMonth,
          onChange: (s) => x({ ...o, dayOfMonth: Number(s.target.value) }),
          "aria-label": "Ayın günü",
          children: Array.from({ length: 28 }, (s, g) => g + 1).map((s) => /* @__PURE__ */ e.jsxs("option", { value: s, children: [
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
          value: o.hourOfDay,
          onChange: (s) => x({ ...o, hourOfDay: Number(s.target.value) }),
          "aria-label": "Saat",
          children: Array.from({ length: 24 }, (s, g) => g).map((s) => /* @__PURE__ */ e.jsxs("option", { value: s, children: [
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
            /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11.5, color: "var(--apya-text-secondary)" }, children: Ie(s) }),
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
                    await we(s.id, !s.isEnabled), await d();
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
                  await ze(s.id), await d();
                },
                children: "Sil"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-3 flex-wrap apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
            /* @__PURE__ */ e.jsxs("span", { children: [
              "sıradaki: ",
              G(s.nextRunAt)
            ] }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              "son: ",
              G(s.lastRunAt)
            ] })
          ] }),
          s.lastError && /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-negative-500)" }, children: [
            "Son deneme başarısız: ",
            s.lastError
          ] }),
          /* @__PURE__ */ e.jsx(Me, { schedule: s, busy: f, onChanged: d })
        ]
      },
      s.id
    )),
    l.length === 0 && !o && n.length > 0 && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Kurulu zamanlama yok." })
  ] }) : null;
}
function Fe({ projectId: a, onPickProject: n }) {
  const [l, i] = r.useState([]), [p, y] = r.useState(null), [f, h] = r.useState([]), [o, x] = r.useState(null), [d, u] = r.useState(!1), [s, g] = r.useState(!1), w = r.useCallback(async () => {
    if (!a) {
      i([]);
      return;
    }
    u(!0);
    try {
      i(await be(a) ?? []);
    } catch (c) {
      v("error", "Paketler yüklenemedi."), console.error("[ReportBuilder] packages", c);
    } finally {
      u(!1);
    }
  }, [a]);
  r.useEffect(() => {
    w();
  }, [w]);
  const P = async (c) => {
    y(c), x(null);
    try {
      h(await O(c.id) ?? []);
    } catch (z) {
      console.error("[ReportBuilder] shareLinks", z);
    }
  }, E = async (c) => {
    if (p) {
      g(!0);
      try {
        const z = await ge({
          targetType: 1,
          // DeliveryPackage
          targetId: p.id,
          lifetimeDays: 30,
          allowDownload: c,
          watermark: null
        });
        x(z), h(await O(p.id) ?? []);
      } catch {
        v("error", "Paylaşım linki oluşturulamadı.");
      } finally {
        g(!1);
      }
    }
  }, R = async (c) => {
    g(!0);
    try {
      await je(c), h(await O(p.id) ?? []);
    } catch {
      v("error", "Link iptal edilemedi.");
    } finally {
      g(!1);
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
      l.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu projede paket yok. Dağıtmak için önce Teslimler ekranından bir paket üretin." }) : l.map((c) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: `apya-md-item${(p == null ? void 0 : p.id) === c.id ? " selected" : ""}`,
          style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 },
          onClick: () => P(c),
          children: [
            /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1, textAlign: "left" }, children: [
              /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: c.name }),
              /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                c.reportTemplateName ?? "şablonsuz",
                c.periodCode && ` · ${c.periodCode}`
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(D, { variant: c.status === 2 ? "positive" : c.status === 3 ? "accent" : "neutral", size: "sm", children: c.status === 2 ? "üretildi" : c.status === 3 ? "gönderildi" : "taslak" })
          ]
        },
        c.id
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
        o && /* @__PURE__ */ e.jsxs("div", { style: {
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
            o.token
          ] })
        ] }),
        f.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu pakette link yok." }) : f.map((c) => /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "apya-doc-check-row",
            style: { gridTemplateColumns: "minmax(0,1fr) 110px 90px 70px" },
            children: [
              /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 12 }, children: [
                c.allowDownload ? "İndirilebilir" : "Salt görüntüleme",
                c.isRevoked && /* @__PURE__ */ e.jsx(D, { variant: "negative", size: "sm", children: "iptal" })
              ] }),
              /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
                H(c.expiresAt),
                " bitiyor"
              ] }),
              /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11 }, children: [
                c.accessCount ?? 0,
                " erişim"
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "text-end", children: !c.isRevoked && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "apya-doc-linkbtn",
                  disabled: s,
                  onClick: () => R(c.id),
                  children: "İptal"
                }
              ) })
            ]
          },
          c.id
        ))
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(We, { projectId: a, packages: l })
  ] }) : /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx(
    I,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-share-nodes" }),
      title: "Proje bağlamı gerekiyor",
      description: "Dağıtım üretilmiş paketler üzerinden yürür; üstteki listeden bir proje seçin.",
      action: /* @__PURE__ */ e.jsx(
        Z,
        {
          primary: /* @__PURE__ */ e.jsx(C, { size: "sm", onClick: n, children: "Proje seç" }),
          link: { label: "veya proje kapsamından seç", href: `${T()}Documents/Scope` }
        }
      )
    }
  ) });
}
const Y = (...a) => a.filter(Boolean).join(" "), Ke = [
  { key: "sections", label: "Bölümler" },
  { key: "preview", label: "Önizleme" },
  { key: "distribution", label: "Dağıtım" }
];
function Ue({ section: a, onToggle: n, onMove: l, isFirst: i, isLast: p, busy: y }) {
  const f = J[a.sectionKey] ?? `Bölüm ${a.sectionKey}`;
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", style: { gridTemplateColumns: "34px minmax(0,1fr) auto auto" }, children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "checkbox",
        checked: a.isEnabled,
        disabled: y || !a.isAvailable,
        onChange: (h) => n(a.id, h.target.checked),
        "aria-label": `${f} bölümünü aç/kapa`
      }
    ),
    /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e.jsx(
        "span",
        {
          className: "d-block text-truncate",
          style: { fontSize: 12.5, opacity: a.isAvailable ? 1 : 0.55 },
          children: f
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
          disabled: y || i,
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
          disabled: y || p,
          onClick: () => l(a.id, 1),
          "aria-label": "Aşağı taşı",
          children: "↓"
        }
      )
    ] })
  ] });
}
function qe() {
  const a = new URLSearchParams(window.location.search), [n, l] = r.useState([]), [i, p] = r.useState([]), [y, f] = r.useState(null), [h, o] = r.useState((a.get("projectId") || "").toLowerCase()), [x, d] = r.useState("sections"), [u, s] = r.useState(!0), [g, w] = r.useState(!1), [P, E] = r.useState(null), R = r.useRef(null), c = de("Platform.Documents.GenerateReports"), z = r.useCallback(async () => {
    s(!0);
    try {
      const [t, m] = await Promise.all([me(), xe()]);
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
  const j = r.useMemo(
    () => n.find((t) => t.id === y) ?? null,
    [n, y]
  ), B = r.useMemo(
    () => j ? [...j.sections].sort((t, m) => t.order - m.order) : [],
    [j]
  ), M = async (t) => {
    if (j) {
      w(!0);
      try {
        const m = await ue({
          templateId: j.id,
          sections: t.map((k, N) => ({ sectionId: k.id, order: N + 1, isEnabled: k.isEnabled }))
        });
        l((k) => k.map((N) => N.id === m.id ? m : N));
      } catch (m) {
        v("error", "Bölümler kaydedilemedi."), console.error("[ReportBuilder] persistSections", m);
      } finally {
        w(!1);
      }
    }
  }, Q = (t, m) => M(B.map((k) => k.id === t ? { ...k, isEnabled: m } : k)), X = (t, m) => {
    const k = [...B], N = k.findIndex((ne) => ne.id === t), L = N + m;
    N < 0 || L < 0 || L >= k.length || ([k[N], k[L]] = [k[L], k[N]], M(k));
  }, ee = async () => {
    const t = window.prompt("Şablon adı:");
    if (t) {
      w(!0);
      try {
        const m = await ye({ name: t, recipient: 1, issuer: null, order: n.length + 1 });
        await z(), f(m.id);
      } catch {
        v("error", "Şablon oluşturulamadı.");
      } finally {
        w(!1);
      }
    }
  }, ae = async (t) => {
    w(!0);
    try {
      const m = await pe(t);
      await z(), f(m.id);
    } catch {
      v("error", "Şablon kopyalanamadı.");
    } finally {
      w(!1);
    }
  }, te = async (t) => {
    if (window.confirm("Bu şablon silinsin mi? Üretilmiş paketler etkilenmez.")) {
      w(!0);
      try {
        await he(t), f(null), await z();
      } catch {
        v("error", "Şablon silinemedi.");
      } finally {
        w(!1);
      }
    }
  }, W = (t) => `${T()}Documents/Deliveries?projectId=${h}` + (t ? `&packageId=${t}` : ""), F = async ({ silent: t = !1 } = {}) => {
    E(t ? "deliver" : "save");
    try {
      const { pkg: m, created: k } = await Le({ projectId: h, template: j });
      return t || v(k ? "success" : "info", k ? `Taslak kaydedildi: ${m.name}` : `Bu şablonun taslağı zaten kayıtlı: ${m.name}`), m;
    } catch (m) {
      return v("error", "Taslak kaydedilemedi."), console.error("[ReportBuilder] saveDraft", m), null;
    } finally {
      E(null);
    }
  }, se = async () => {
    if (!c || !j) {
      window.location.assign(W(null));
      return;
    }
    const t = await F({ silent: !0 });
    t && window.location.assign(W(t.id));
  }, K = () => {
    var m;
    const t = R.current;
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
      le,
      {
        title: "Rapor derleyici",
        description: "Şablonun bölümlerini seç, önizle, alıcıya dağıt",
        aside: /* @__PURE__ */ e.jsxs(
          "select",
          {
            ref: R,
            className: "apya-doc-select",
            value: h,
            onChange: (t) => o(t.target.value),
            "aria-label": "Proje bağlamı",
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Proje seçin…" }),
              i.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.id, children: t.code ? `${t.code} · ${t.name}` : t.name }, t.id))
            ]
          }
        ),
        menuItems: [
          { key: "new-template", label: "Yeni şablon", icon: "fa-plus", disabled: g, onSelect: ee }
        ]
      }
    ),
    /* @__PURE__ */ e.jsx(re, { active: "report", projectId: h || null }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-doc-tabs mb-3", role: "tablist", children: Ke.map((t) => /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": x === t.key,
        className: Y("apya-doc-tab", x === t.key && "is-active"),
        onClick: () => d(t.key),
        children: t.label
      },
      t.key
    )) }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-subflow", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-doc-subflow-text", children: h ? "Bu ekranda: bölümleri seç ve sırala → önizle → üret. Ürettiğin rapor Teslim adımına geçer." : "Önce yukarıdan bir proje seçin — taslak ve teslim proje bağlamında çalışır." }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-subflow-actions", role: "group", "aria-label": "Rapor akışı", children: [
        c && /* @__PURE__ */ e.jsx(
          C,
          {
            variant: "secondary",
            size: "sm",
            isLoading: P === "save",
            disabled: !h || !j || P !== null,
            onClick: () => F(),
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
            onClick: se,
            children: c ? "Üret ve teslime geç" : "Teslime geç"
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
            className: Y("apya-md-item", y === t.id && "selected"),
            style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 },
            onClick: () => f(t.id),
            children: [
              /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1, textAlign: "left" }, children: [
                /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: t.name }),
                /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                  ve[t.recipient] ?? "—",
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
      x === "sections" && /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: j ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: j.name }),
          /* @__PURE__ */ e.jsxs("span", { className: "d-flex gap-2", children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: g,
                onClick: () => ae(j.id),
                children: "Kopyala"
              }
            ),
            !j.isSystem && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: g,
                onClick: () => te(j.id),
                children: "Sil"
              }
            )
          ] })
        ] }),
        j.isSystem && /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)", marginBottom: 6 }, children: [
          "Sistem şablonu tüm kiracılarda paylaşılır; künyesi düzenlenemez. Kendinize uyarlamak için ",
          /* @__PURE__ */ e.jsx("strong", { children: "Kopyala" }),
          "'yı kullanın."
        ] }),
        B.map((t, m) => /* @__PURE__ */ e.jsx(
          Ue,
          {
            section: t,
            busy: g,
            isFirst: m === 0,
            isLast: m === B.length - 1,
            onToggle: Q,
            onMove: X
          },
          t.id
        ))
      ] }) : /* @__PURE__ */ e.jsx(
        I,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check" }),
          title: "Şablon seçin",
          description: "Soldan bir şablon seçerek bölümlerini düzenleyin."
        }
      ) }),
      x === "preview" && /* @__PURE__ */ e.jsx($e, { projectId: h, template: j, onPickProject: K }),
      x === "distribution" && /* @__PURE__ */ e.jsx(Fe, { projectId: h, onPickProject: K })
    ] })
  ] });
}
const _ = document.getElementById("report-builder-island");
_ && ie(_).render(/* @__PURE__ */ e.jsx(qe, {}));
