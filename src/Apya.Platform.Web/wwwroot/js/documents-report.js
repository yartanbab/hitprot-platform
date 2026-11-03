import { r as l, j as e } from "./react-vendor-D7YDiBbi.js";
import { E as M, m as he } from "./index-DgpuJ91w.js";
import { B as C, d as B, I as Y } from "./Dialog-DTcK6HxT.js";
import { S as $ } from "./SkeletonShape-BtsPQQr7.js";
import { E as ee, D as fe, P as xe } from "./ProcessRibbon-DWeCROTd.js";
import { g as ke, k as be, a as ge } from "./api-DzWAfcOg.js";
const S = (a, n) => {
  var r, i, d;
  return (d = (i = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.notify) == null ? void 0 : i[a]) == null ? void 0 : d.call(i, n);
}, E = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function N(a) {
  return new Promise((n, r) => {
    window.abp.ajax(a).done(n).fail(r);
  });
}
const j = (a, n = {}) => {
  const r = new URLSearchParams();
  Object.entries(n).forEach(([d, o]) => {
    o != null && o !== "" && r.append(d, o);
  });
  const i = r.toString();
  return `${E()}Documents/ReportBuilder?handler=${a}${i ? "&" + i : ""}`;
}, A = (a, n) => N({ url: a, type: "POST", contentType: "application/json", data: JSON.stringify(n) }), je = () => N({ url: j("Templates"), type: "GET" }), ve = (a) => A(j("UpdateSections"), a), Se = (a) => A(j("CreateTemplate"), a), Ne = (a) => N({ url: j("DuplicateTemplate", { id: a }), type: "POST" }), we = (a) => N({ url: j("DeleteTemplate", { id: a }), type: "POST" }), ze = () => N({ url: j("Projects"), type: "GET" }), Ce = (a, n, r) => N({ url: j("Preview", { projectId: a, templateId: n, periodCode: r }), type: "GET" }), Te = (a, n, r) => j("PreviewPdf", { projectId: a, templateId: n, periodCode: r }), Pe = (a) => N({ url: j("Packages", { projectId: a }), type: "GET" }), W = (a) => N({ url: j("ShareLinks", { packageId: a }), type: "GET" }), De = (a) => A(j("CreateShareLink"), a), Ee = (a) => N({ url: j("RevokeShareLink", { id: a }), type: "POST" }), H = (a, n = "TRY") => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + " " + ({ TRY: "₺", USD: "$", EUR: "€" }[n] || n), ae = (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—", te = {
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
  14: "Görev ilerlemesi",
  15: "Göstergeler"
}, ne = {
  1: "Kurum",
  2: "Banka / finans",
  3: "Müşteri",
  4: "Denetçi · YMM",
  5: "İç kullanım"
}, Be = (a) => N({ url: j("Schedules", { projectId: a }), type: "GET" }), Re = (a) => A(j("CreateSchedule"), a), Ae = (a, n) => N({ url: j("SetScheduleEnabled", { id: a, isEnabled: n }), type: "POST" }), Le = (a) => N({ url: j("DeleteSchedule", { id: a }), type: "POST" }), Oe = (a, n) => A(j("AddSubscriber", { scheduleId: a }), n), $e = (a) => N({ url: j("RemoveSubscriber", { subscriberId: a }), type: "POST" }), Ie = 1, We = 7, Me = 160, Fe = (a, n) => String(a ?? "").toLowerCase() === String(n ?? "").toLowerCase();
function Ge(a, n) {
  return (a ?? []).find((r) => r.status === Ie && Fe(r.reportTemplateId, n)) ?? null;
}
function Ke(a, n = /* @__PURE__ */ new Date()) {
  const i = ` · ${new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(n)}`;
  return `${a.slice(0, Me - i.length)}${i}`;
}
async function Ue({ projectId: a, template: n }) {
  const r = Ge(await ke(a), n.id);
  return r ? { pkg: r, created: !1 } : { pkg: await be({
    projectId: a,
    name: Ke(n.name),
    reportTemplateId: n.id,
    formats: We
  }), created: !0 };
}
function _e({ projectId: a, template: n, onPickProject: r }) {
  const [i, d] = l.useState(null), [o, u] = l.useState(""), [f, c] = l.useState(!1), x = l.useCallback(async () => {
    if (!a) {
      d(null);
      return;
    }
    c(!0);
    try {
      d(await Ce(a, n == null ? void 0 : n.id, o));
    } catch (h) {
      S("error", "Önizleme üretilemedi."), console.error("[ReportBuilder] preview", h);
    } finally {
      c(!1);
    }
  }, [a, n == null ? void 0 : n.id, o]);
  if (l.useEffect(() => {
    x();
  }, [x]), !a)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx(
      M,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-eye" }),
        title: "Proje bağlamı gerekiyor",
        description: "Önizleme gerçek veriyle üretilir; üstteki listeden bir proje seçin.",
        action: /* @__PURE__ */ e.jsx(
          ee,
          {
            primary: /* @__PURE__ */ e.jsx(C, { size: "sm", onClick: r, children: "Proje seç" }),
            link: { label: "veya proje kapsamından seç", href: `${E()}Documents/Scope` }
          }
        )
      }
    ) });
  if (f) return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx($, { rows: 6 }) });
  if (!i) return null;
  const m = i.summary;
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
            value: o,
            onChange: (h) => u(h.target.value),
            "aria-label": "Dönem kodu"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "a",
          {
            className: "apya-doc-linkbtn",
            target: "_blank",
            rel: "noreferrer",
            href: Te(a, n == null ? void 0 : n.id, o),
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
          m.compliancePercent
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Belge" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: m.documentCount })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Eksik" }),
        /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "apya-numeric apya-doc-kpi-value",
            style: { color: m.blockingCount > 0 ? "var(--apya-negative-500)" : void 0 },
            children: m.missingCount
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
          m.blockingCount,
          " bloke edici"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Belgelenen tutar" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", style: { fontSize: 16 }, children: H(m.documentedAmount, m.currency) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline", children: [
      "Çıktıya girecek bölümler (",
      i.sections.length,
      ")"
    ] }),
    i.sections.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Açık bölüm yok — Bölümler sekmesinden en az bir tane açın." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-1 mb-3", children: i.sections.map((h, t) => /* @__PURE__ */ e.jsxs(B, { variant: "neutral", size: "sm", children: [
      t + 1,
      ". ",
      te[h] ?? h
    ] }, `${h}-${t}`)) }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline", children: [
      "Ekler (",
      i.annexes.length,
      i.truncatedAnnexCount > 0 && ` · +${i.truncatedAnnexCount} gösterilmiyor`,
      ")"
    ] }),
    i.annexes.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu projede henüz belge yok; ek dizini boş çıkacak." }) : i.annexes.slice(0, 12).map((h) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "apya-doc-check-row",
        style: { gridTemplateColumns: "60px minmax(0,1fr) 90px 110px" },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11 }, children: h.annexNumber }),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: h.documentName }),
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: h.typeName ?? "—" }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric text-end", style: { fontSize: 11.5 }, children: h.amount != null ? H(h.amount) : ae(h.documentDate) })
        ]
      },
      h.annexNumber + h.documentName
    )),
    i.missingDocuments.length > 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mt-3", children: [
        "Eksik belgeler (",
        i.missingDocuments.length,
        ")"
      ] }),
      i.missingDocuments.slice(0, 10).map((h, t) => /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 12, padding: "3px 0" }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation", style: { color: "var(--apya-warning-500)" } }),
        " ",
        h
      ] }, t))
    ] })
  ] });
}
const qe = [
  { value: 2, label: "Aylık" },
  { value: 3, label: "Üç aylık" },
  { value: 1, label: "Haftalık" }
], se = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"], Z = (a) => a ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(a)) : "—";
function Ye(a) {
  if (a.frequency === 1) return `Her ${se[a.dayOfWeek]}, ${a.hourOfDay}:00`;
  const n = a.frequency === 3 ? "üç ayda bir" : "her ay";
  return `Ayın ${a.dayOfMonth}'i, ${n}, ${a.hourOfDay}:00`;
}
function He({ schedule: a, busy: n, onChanged: r }) {
  const [i, d] = l.useState(""), [o, u] = l.useState(""), [f, c] = l.useState(!1), x = async () => {
    var m, h;
    try {
      await Oe(a.id, { name: i.trim(), email: o.trim(), userId: null }), d(""), u(""), c(!1), r();
    } catch (t) {
      S("error", ((h = (m = t == null ? void 0 : t.responseJSON) == null ? void 0 : m.error) == null ? void 0 : h.message) || "Abone eklenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", children: [
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Aboneler" }),
    a.subscribers.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Abone yok — üretim yine yapılır, kimse haberdar edilmez." }) : a.subscribers.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", style: { fontSize: 12 }, children: [
      /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { flex: 1 }, children: [
        m.name,
        " ",
        /* @__PURE__ */ e.jsxs("span", { style: { color: "var(--apya-text-tertiary)" }, children: [
          "· ",
          m.email
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "apya-doc-linkbtn",
          disabled: n,
          onClick: async () => {
            await $e(m.id), r();
          },
          children: "Çıkar"
        }
      )
    ] }, m.id)),
    f ? /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
      /* @__PURE__ */ e.jsx(Y, { size: "sm", placeholder: "Ad", value: i, onChange: (m) => d(m.target.value) }),
      /* @__PURE__ */ e.jsx(Y, { size: "sm", type: "email", placeholder: "e-posta", value: o, onChange: (m) => u(m.target.value) }),
      /* @__PURE__ */ e.jsx(C, { size: "sm", disabled: !i.trim() || !o.trim(), onClick: x, children: "Ekle" }),
      /* @__PURE__ */ e.jsx(C, { size: "sm", variant: "outline", onClick: () => c(!1), children: "Vazgeç" })
    ] }) : /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: () => c(!0), children: "+ Abone ekle" })
  ] });
}
function Ze({ projectId: a, packages: n }) {
  const [r, i] = l.useState([]), [d, o] = l.useState(!0), [u, f] = l.useState(!1), [c, x] = l.useState(null), m = l.useCallback(async () => {
    if (!a) {
      i([]), o(!1);
      return;
    }
    o(!0);
    try {
      i(await Be(a) ?? []);
    } catch (t) {
      S("error", "Zamanlamalar yüklenemedi."), console.error("[Documents] schedules", t);
    } finally {
      o(!1);
    }
  }, [a]);
  l.useEffect(() => {
    m();
  }, [m]);
  const h = async () => {
    f(!0);
    try {
      await Re({
        deliveryPackageId: c.deliveryPackageId,
        frequency: Number(c.frequency),
        dayOfMonth: Number(c.dayOfMonth),
        dayOfWeek: Number(c.dayOfWeek),
        hourOfDay: Number(c.hourOfDay)
      }), x(null), await m();
    } catch (t) {
      S("error", "Zamanlama kurulamadı."), console.error("[Documents] createSchedule", t);
    } finally {
      f(!1);
    }
  };
  return a ? d ? /* @__PURE__ */ e.jsx($, { rows: 3 }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
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
          onChange: (t) => x({ ...c, deliveryPackageId: t.target.value }),
          "aria-label": "Paket",
          children: n.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.id, children: t.name }, t.id))
        }
      ),
      /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: c.frequency,
          onChange: (t) => x({ ...c, frequency: Number(t.target.value) }),
          "aria-label": "Sıklık",
          children: qe.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.value, children: t.label }, t.value))
        }
      ),
      Number(c.frequency) === 1 ? /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: c.dayOfWeek,
          onChange: (t) => x({ ...c, dayOfWeek: Number(t.target.value) }),
          "aria-label": "Gün",
          children: se.map((t, g) => /* @__PURE__ */ e.jsx("option", { value: g, children: t }, t))
        }
      ) : /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: c.dayOfMonth,
          onChange: (t) => x({ ...c, dayOfMonth: Number(t.target.value) }),
          "aria-label": "Ayın günü",
          children: Array.from({ length: 28 }, (t, g) => g + 1).map((t) => /* @__PURE__ */ e.jsxs("option", { value: t, children: [
            "Ayın ",
            t,
            "'i"
          ] }, t))
        }
      ),
      /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: c.hourOfDay,
          onChange: (t) => x({ ...c, hourOfDay: Number(t.target.value) }),
          "aria-label": "Saat",
          children: Array.from({ length: 24 }, (t, g) => g).map((t) => /* @__PURE__ */ e.jsxs("option", { value: t, children: [
            String(t).padStart(2, "0"),
            ":00"
          ] }, t))
        }
      ),
      /* @__PURE__ */ e.jsx(C, { size: "sm", isLoading: u, onClick: h, children: "Kur" }),
      /* @__PURE__ */ e.jsx(C, { size: "sm", variant: "outline", onClick: () => x(null), children: "Vazgeç" })
    ] }),
    r.map((t) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex flex-column gap-2 p-2",
        style: { background: "var(--apya-surface-sunken)", borderRadius: 10 },
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12.5, fontWeight: 600 }, children: t.packageName }),
            /* @__PURE__ */ e.jsx(B, { variant: t.isEnabled ? "positive" : "neutral", size: "sm", children: t.isEnabled ? "açık" : "kapalı" }),
            /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11.5, color: "var(--apya-text-secondary)" }, children: Ye(t) }),
            /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: u,
                onClick: async () => {
                  f(!0);
                  try {
                    await Ae(t.id, !t.isEnabled), await m();
                  } finally {
                    f(!1);
                  }
                },
                children: t.isEnabled ? "Duraklat" : "Sürdür"
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: u,
                onClick: async () => {
                  await Le(t.id), await m();
                },
                children: "Sil"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-3 flex-wrap apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
            /* @__PURE__ */ e.jsxs("span", { children: [
              "sıradaki: ",
              Z(t.nextRunAt)
            ] }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              "son: ",
              Z(t.lastRunAt)
            ] })
          ] }),
          t.lastError && /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-negative-500)" }, children: [
            "Son deneme başarısız: ",
            t.lastError
          ] }),
          /* @__PURE__ */ e.jsx(He, { schedule: t, busy: u, onChanged: m })
        ]
      },
      t.id
    )),
    r.length === 0 && !c && n.length > 0 && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Kurulu zamanlama yok." })
  ] }) : null;
}
function Qe({ projectId: a, onPickProject: n }) {
  const [r, i] = l.useState([]), [d, o] = l.useState(null), [u, f] = l.useState([]), [c, x] = l.useState(null), [m, h] = l.useState(!1), [t, g] = l.useState(!1), b = l.useCallback(async () => {
    if (!a) {
      i([]);
      return;
    }
    h(!0);
    try {
      i(await Pe(a) ?? []);
    } catch (y) {
      S("error", "Paketler yüklenemedi."), console.error("[ReportBuilder] packages", y);
    } finally {
      h(!1);
    }
  }, [a]);
  l.useEffect(() => {
    b();
  }, [b]);
  const T = async (y) => {
    o(y), x(null);
    try {
      f(await W(y.id) ?? []);
    } catch (z) {
      console.error("[ReportBuilder] shareLinks", z);
    }
  }, P = async (y) => {
    if (d) {
      g(!0);
      try {
        const z = await De({
          targetType: 1,
          // DeliveryPackage
          targetId: d.id,
          lifetimeDays: 30,
          allowDownload: y,
          watermark: null
        });
        x(z), f(await W(d.id) ?? []);
      } catch {
        S("error", "Paylaşım linki oluşturulamadı.");
      } finally {
        g(!1);
      }
    }
  }, D = async (y) => {
    g(!0);
    try {
      await Ee(y), f(await W(d.id) ?? []);
    } catch {
      S("error", "Link iptal edilemedi.");
    } finally {
      g(!1);
    }
  };
  return a ? m ? /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx($, { rows: 5 }) }) : /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-3", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
        /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "Üretilmiş paketler" }),
        /* @__PURE__ */ e.jsx(
          "a",
          {
            className: "apya-doc-linkbtn",
            href: `${E()}Documents/Deliveries?projectId=${a}`,
            children: "Teslimler ekranı"
          }
        )
      ] }),
      r.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu projede paket yok. Dağıtmak için önce Teslimler ekranından bir paket üretin." }) : r.map((y) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: `apya-md-item${(d == null ? void 0 : d.id) === y.id ? " selected" : ""}`,
          style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 },
          onClick: () => T(y),
          children: [
            /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1, textAlign: "left" }, children: [
              /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: y.name }),
              /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                y.reportTemplateName ?? "şablonsuz",
                y.periodCode && ` · ${y.periodCode}`
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(B, { variant: y.status === 2 ? "positive" : y.status === 3 ? "accent" : "neutral", size: "sm", children: y.status === 2 ? "üretildi" : y.status === 3 ? "gönderildi" : "taslak" })
          ]
        },
        y.id
      )),
      d && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mt-3", children: [
          "Paylaşım linkleri · ",
          d.name
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 mb-2", children: [
          /* @__PURE__ */ e.jsx(C, { variant: "outline", size: "sm", disabled: t, onClick: () => P(!1), children: "Salt görüntüleme linki" }),
          /* @__PURE__ */ e.jsx(C, { variant: "outline", size: "sm", disabled: t, onClick: () => P(!0), children: "İndirmeye açık link" })
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
            E(),
            "Share/",
            c.token
          ] })
        ] }),
        u.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu pakette link yok." }) : u.map((y) => /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "apya-doc-check-row",
            style: { gridTemplateColumns: "minmax(0,1fr) 110px 90px 70px" },
            children: [
              /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 12 }, children: [
                y.allowDownload ? "İndirilebilir" : "Salt görüntüleme",
                y.isRevoked && /* @__PURE__ */ e.jsx(B, { variant: "negative", size: "sm", children: "iptal" })
              ] }),
              /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
                ae(y.expiresAt),
                " bitiyor"
              ] }),
              /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11 }, children: [
                y.accessCount ?? 0,
                " erişim"
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "text-end", children: !y.isRevoked && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "apya-doc-linkbtn",
                  disabled: t,
                  onClick: () => D(y.id),
                  children: "İptal"
                }
              ) })
            ]
          },
          y.id
        ))
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(Ze, { projectId: a, packages: r })
  ] }) : /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx(
    M,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-share-nodes" }),
      title: "Proje bağlamı gerekiyor",
      description: "Dağıtım üretilmiş paketler üzerinden yürür; üstteki listeden bir proje seçin.",
      action: /* @__PURE__ */ e.jsx(
        ee,
        {
          primary: /* @__PURE__ */ e.jsx(C, { size: "sm", onClick: n, children: "Proje seç" }),
          link: { label: "veya proje kapsamından seç", href: `${E()}Documents/Scope` }
        }
      )
    }
  ) });
}
const R = "own", ie = "general", Je = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };
function Q(a) {
  return String(a ?? "").toLocaleLowerCase("tr-TR").replace(/[çğıöşü]/g, (n) => Je[n]).normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function re(a) {
  return a.isSystem ? a.issuer ? { key: `issuer:${a.issuer}`, title: a.issuer } : { key: ie, title: "Genel şablonlar" } : { key: R, title: "Kendi şablonlarım" };
}
function Ve(a, n) {
  const r = Q(n).split(/\s+/).filter(Boolean);
  if (r.length === 0) return !0;
  const i = Q([a.name, a.issuer, ne[a.recipient]].join(" "));
  return r.every((d) => i.includes(d));
}
function Xe(a, n = "") {
  const r = /* @__PURE__ */ new Map();
  for (const o of a) {
    if (!Ve(o, n)) continue;
    const { key: u, title: f } = re(o);
    r.has(u) || r.set(u, { key: u, title: f, items: [] }), r.get(u).items.push(o);
  }
  const i = [...r.values()];
  return [...i.filter((o) => o.key === R), ...i.filter((o) => o.key !== R)];
}
const le = (...a) => a.filter(Boolean).join(" "), J = { fontSize: 11, color: "var(--apya-text-tertiary)" }, V = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  width: "100%",
  padding: "6px 4px",
  border: 0,
  borderRadius: 6,
  background: "transparent",
  color: "var(--apya-text-secondary)",
  fontSize: 11.5,
  fontWeight: 600,
  textAlign: "left"
}, ea = {
  fontSize: 12.5,
  fontWeight: 500,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  overflowWrap: "anywhere"
};
function aa(a, n) {
  const r = ne[a.recipient] ?? "—";
  return n === R ? a.issuer ? `${r} · ${a.issuer}` : r : n === ie ? r : null;
}
function ta({ template: a, selected: n, groupKey: r, onSelect: i }) {
  const d = aa(a, r);
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      className: le("apya-md-item", n && "selected"),
      style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 },
      "aria-current": n || void 0,
      title: a.name,
      onClick: () => i(a.id),
      children: [
        /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1, textAlign: "left" }, children: [
          /* @__PURE__ */ e.jsx("span", { style: ea, children: a.name }),
          d && /* @__PURE__ */ e.jsx("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: d })
        ] }),
        /* @__PURE__ */ e.jsx(B, { variant: "accent", size: "sm", children: a.enabledSectionCount })
      ]
    }
  );
}
function na({ templates: a, selectedId: n, onSelect: r }) {
  const [i, d] = l.useState(""), o = a.find((t) => t.id === n) ?? null, u = o ? re(o).key : null, [f, c] = l.useState(
    () => new Set([R, u].filter(Boolean))
  );
  l.useEffect(() => {
    u && c((t) => t.has(u) ? t : new Set(t).add(u));
  }, [u]);
  const x = l.useMemo(() => Xe(a, i), [a, i]), m = i.trim().length > 0, h = (t) => c((g) => {
    const b = new Set(g);
    return b.has(t) ? b.delete(t) : b.add(t), b;
  });
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center justify-content-between", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Şablonlar" }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: J, children: a.length })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Şablon yok." }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("label", { className: "apya-console-search", style: { width: "100%", margin: 0 }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-magnifying-glass", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "search",
            value: i,
            onChange: (t) => d(t.target.value),
            onKeyDown: (t) => {
              t.key === "Escape" && d("");
            },
            placeholder: "Kurum ya da şablon ara…",
            "aria-label": "Şablon ara",
            style: { flex: 1, width: "auto", minWidth: 0 }
          }
        )
      ] }),
      x.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Aramaya uyan şablon yok." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column", style: { gap: 2 }, children: x.map((t, g) => {
        const b = m || f.has(t.key), T = `report-template-group-${g}`, P = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(
            "i",
            {
              className: le("fa", b ? "fa-chevron-down" : "fa-chevron-right"),
              "aria-hidden": "true",
              style: { width: 10, fontSize: 9 }
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { flex: 1, minWidth: 0 }, children: t.title }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: J, children: t.items.length })
        ] });
        return /* @__PURE__ */ e.jsxs("div", { children: [
          m ? /* @__PURE__ */ e.jsx("div", { style: V, children: P }) : /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              style: { ...V, cursor: "pointer" },
              "aria-expanded": b,
              "aria-controls": T,
              onClick: () => h(t.key),
              children: P
            }
          ),
          b && /* @__PURE__ */ e.jsx("div", { id: T, role: "group", "aria-label": t.title, className: "d-flex flex-column", style: { gap: 2 }, children: t.items.map((D) => /* @__PURE__ */ e.jsx(
            ta,
            {
              template: D,
              selected: D.id === n,
              groupKey: t.key,
              onSelect: r
            },
            D.id
          )) })
        ] }, t.key);
      }) })
    ] })
  ] });
}
const sa = (...a) => a.filter(Boolean).join(" "), ia = [
  { key: "sections", label: "Bölümler" },
  { key: "preview", label: "Önizleme" },
  { key: "distribution", label: "Dağıtım" }
];
function ra({ section: a, onToggle: n, onMove: r, isFirst: i, isLast: d, busy: o, readOnly: u }) {
  const f = te[a.sectionKey] ?? `Bölüm ${a.sectionKey}`;
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", style: { gridTemplateColumns: "34px minmax(0,1fr) auto auto" }, children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "checkbox",
        checked: a.isEnabled,
        disabled: o || u || !a.isAvailable,
        onChange: (c) => n(a.id, c.target.checked),
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
          disabled: o || u || i,
          onClick: () => r(a.id, -1),
          "aria-label": "Yukarı taşı",
          children: "↑"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "apya-doc-linkbtn",
          disabled: o || u || d,
          onClick: () => r(a.id, 1),
          "aria-label": "Aşağı taşı",
          children: "↓"
        }
      )
    ] })
  ] });
}
function la() {
  var _, q;
  const a = new URLSearchParams(window.location.search), [n, r] = l.useState([]), [i, d] = l.useState([]), [o, u] = l.useState(null), [f, c] = l.useState((a.get("projectId") || "").toLowerCase()), [x, m] = l.useState("sections"), [h, t] = l.useState(!0), [g, b] = l.useState(!1), [T, P] = l.useState(null), D = l.useRef(null), y = ge("Platform.Documents.GenerateReports"), z = l.useCallback(async () => {
    t(!0);
    try {
      const [s, p] = await Promise.all([je(), ze()]);
      r(s ?? []), d(p ?? []), u((k) => {
        var w;
        return k ?? ((w = s == null ? void 0 : s[0]) == null ? void 0 : w.id) ?? null;
      });
    } catch (s) {
      S("error", "Şablonlar yüklenemedi."), console.error("[ReportBuilder] load", s);
    } finally {
      t(!1);
    }
  }, []);
  l.useEffect(() => {
    z();
  }, [z]);
  const v = l.useMemo(
    () => n.find((s) => s.id === o) ?? null,
    [n, o]
  ), I = v ? (v.tenantId ?? null) === (((q = (_ = window.abp) == null ? void 0 : _.currentTenant) == null ? void 0 : q.id) ?? null) : !1, L = l.useMemo(
    () => v ? [...v.sections].sort((s, p) => s.order - p.order) : [],
    [v]
  ), F = async (s) => {
    if (!(!v || !I)) {
      b(!0);
      try {
        const p = await ve({
          templateId: v.id,
          sections: s.map((k, w) => ({ sectionId: k.id, order: w + 1, isEnabled: k.isEnabled }))
        });
        r((k) => k.map((w) => w.id === p.id ? p : w));
      } catch (p) {
        S("error", "Bölümler kaydedilemedi."), console.error("[ReportBuilder] persistSections", p);
      } finally {
        b(!1);
      }
    }
  }, oe = (s, p) => F(L.map((k) => k.id === s ? { ...k, isEnabled: p } : k)), ce = (s, p) => {
    const k = [...L], w = k.findIndex((pe) => pe.id === s), O = w + p;
    w < 0 || O < 0 || O >= k.length || ([k[w], k[O]] = [k[O], k[w]], F(k));
  }, de = async () => {
    const s = window.prompt("Şablon adı:");
    if (s) {
      b(!0);
      try {
        const p = await Se({ name: s, recipient: 1, issuer: null, order: n.length + 1 });
        await z(), u(p.id);
      } catch {
        S("error", "Şablon oluşturulamadı.");
      } finally {
        b(!1);
      }
    }
  }, me = async (s) => {
    b(!0);
    try {
      const p = await Ne(s);
      await z(), u(p.id);
    } catch {
      S("error", "Şablon kopyalanamadı.");
    } finally {
      b(!1);
    }
  }, ue = async (s) => {
    if (window.confirm("Bu şablon silinsin mi? Üretilmiş paketler etkilenmez.")) {
      b(!0);
      try {
        await we(s), u(null), await z();
      } catch {
        S("error", "Şablon silinemedi.");
      } finally {
        b(!1);
      }
    }
  }, G = (s) => `${E()}Documents/Deliveries?projectId=${f}` + (s ? `&packageId=${s}` : ""), K = async ({ silent: s = !1 } = {}) => {
    P(s ? "deliver" : "save");
    try {
      const { pkg: p, created: k } = await Ue({ projectId: f, template: v });
      return s || S(k ? "success" : "info", k ? `Taslak kaydedildi: ${p.name}` : `Bu şablonun taslağı zaten kayıtlı: ${p.name}`), p;
    } catch (p) {
      return S("error", "Taslak kaydedilemedi."), console.error("[ReportBuilder] saveDraft", p), null;
    } finally {
      P(null);
    }
  }, ye = async () => {
    if (!y || !v) {
      window.location.assign(G(null));
      return;
    }
    const s = await K({ silent: !0 });
    s && window.location.assign(G(s.id));
  }, U = () => {
    var p;
    const s = D.current;
    if (s) {
      s.focus();
      try {
        (p = s.showPicker) == null || p.call(s);
      } catch {
      }
    }
  };
  return h ? /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx($, { rows: 8 }) }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsx(
      fe,
      {
        title: "Rapor derleyici",
        description: "Şablonun bölümlerini seç, önizle, alıcıya dağıt",
        aside: /* @__PURE__ */ e.jsxs(
          "select",
          {
            ref: D,
            className: "apya-doc-select",
            value: f,
            onChange: (s) => c(s.target.value),
            "aria-label": "Proje bağlamı",
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Proje seçin…" }),
              i.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.id, children: s.code ? `${s.code} · ${s.name}` : s.name }, s.id))
            ]
          }
        ),
        menuItems: [
          { key: "new-template", label: "Yeni şablon", icon: "fa-plus", disabled: g, onSelect: de }
        ]
      }
    ),
    /* @__PURE__ */ e.jsx(xe, { active: "report", projectId: f || null }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-doc-tabs mb-3", role: "tablist", children: ia.map((s) => /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": x === s.key,
        className: sa("apya-doc-tab", x === s.key && "is-active"),
        onClick: () => m(s.key),
        children: s.label
      },
      s.key
    )) }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-subflow", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-doc-subflow-text", children: f ? "Bu ekranda: bölümleri seç ve sırala → önizle → üret. Ürettiğin rapor Teslim adımına geçer." : "Önce yukarıdan bir proje seçin — taslak ve teslim proje bağlamında çalışır." }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-subflow-actions", role: "group", "aria-label": "Rapor akışı", children: [
        y && /* @__PURE__ */ e.jsx(
          C,
          {
            variant: "secondary",
            size: "sm",
            isLoading: T === "save",
            disabled: !f || !v || T !== null,
            onClick: () => K(),
            children: "Taslak kaydet"
          }
        ),
        /* @__PURE__ */ e.jsx(C, { variant: "secondary", size: "sm", disabled: x === "preview", onClick: () => m("preview"), children: "Önizle" }),
        /* @__PURE__ */ e.jsx(
          C,
          {
            variant: "primary",
            size: "sm",
            isLoading: T === "deliver",
            disabled: !f || T !== null,
            trailingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right", "aria-hidden": "true" }),
            onClick: ye,
            children: y ? "Üret ve teslime geç" : "Teslime geç"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-reportgrid", children: [
      /* @__PURE__ */ e.jsx(na, { templates: n, selectedId: o, onSelect: u }),
      x === "sections" && /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: v ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: v.name }),
          /* @__PURE__ */ e.jsxs("span", { className: "d-flex gap-2", children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: g,
                onClick: () => me(v.id),
                children: "Kopyala"
              }
            ),
            !v.isSystem && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: g,
                onClick: () => ue(v.id),
                children: "Sil"
              }
            )
          ] })
        ] }),
        I ? v.isSystem && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)", marginBottom: 6 }, children: "Sistem şablonu tüm kiracılarda paylaşılır; künyesi düzenlenemez. Burada yaptığınız bölüm değişikliği bütün kiracıların raporuna yansır." }) : /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)", marginBottom: 6 }, children: [
          "Sistem şablonu tüm kiracılarda paylaşılır; bölümleri ve künyesi buradan değiştirilemez. Kendinize uyarlamak için ",
          /* @__PURE__ */ e.jsx("strong", { children: "Kopyala" }),
          "'yı kullanın."
        ] }),
        L.map((s, p) => /* @__PURE__ */ e.jsx(
          ra,
          {
            section: s,
            busy: g,
            readOnly: !I,
            isFirst: p === 0,
            isLast: p === L.length - 1,
            onToggle: oe,
            onMove: ce
          },
          s.id
        ))
      ] }) : /* @__PURE__ */ e.jsx(
        M,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check" }),
          title: "Şablon seçin",
          description: "Soldan bir şablon seçerek bölümlerini düzenleyin."
        }
      ) }),
      x === "preview" && /* @__PURE__ */ e.jsx(_e, { projectId: f, template: v, onPickProject: U }),
      x === "distribution" && /* @__PURE__ */ e.jsx(Qe, { projectId: f, onPickProject: U })
    ] })
  ] });
}
const X = document.getElementById("report-builder-island");
X && he(X, "documents-report", /* @__PURE__ */ e.jsx(la, {}));
