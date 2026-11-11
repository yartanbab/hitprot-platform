import { r as o, j as e } from "./react-vendor-D7YDiBbi.js";
import { E as F, m as xe } from "./index-DgpuJ91w.js";
import { B as T, d as R, I as H } from "./Dialog-BHF0cPzq.js";
import { S as I } from "./SkeletonShape-DUlYVhf6.js";
import { E as ae, D as ke, P as be } from "./ProcessRibbon-DDNyGTmM.js";
import { g as ge, k as je, a as ve } from "./api-DzWAfcOg.js";
const S = (a, n) => {
  var r, i, m;
  return (m = (i = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.notify) == null ? void 0 : i[a]) == null ? void 0 : m.call(i, n);
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
  Object.entries(n).forEach(([m, c]) => {
    c != null && c !== "" && r.append(m, c);
  });
  const i = r.toString();
  return `${E()}Documents/ReportBuilder?handler=${a}${i ? "&" + i : ""}`;
}, A = (a, n) => N({ url: a, type: "POST", contentType: "application/json", data: JSON.stringify(n) }), Se = () => N({ url: j("Templates"), type: "GET" }), Ne = (a) => A(j("UpdateSections"), a), we = (a) => A(j("CreateTemplate"), a), ze = (a) => N({ url: j("DuplicateTemplate", { id: a }), type: "POST" }), Te = (a) => N({ url: j("DeleteTemplate", { id: a }), type: "POST" }), Ce = (a) => j("ExportTemplate", { id: a });
async function Pe(a) {
  var i;
  const n = new FormData();
  n.append("file", a), n.append("__RequestVerificationToken", ((i = document.querySelector('input[name="__RequestVerificationToken"]')) == null ? void 0 : i.value) || "");
  const r = await fetch(j("ImportTemplate"), { method: "POST", body: n, credentials: "same-origin" });
  return r.ok ? r.json() : { ok: !1, message: "Dosya işlenemedi. Lütfen tekrar deneyin." };
}
const De = () => N({ url: j("Projects"), type: "GET" }), Ee = (a, n, r) => N({ url: j("Preview", { projectId: a, templateId: n, periodCode: r }), type: "GET" }), Re = (a, n, r) => j("PreviewPdf", { projectId: a, templateId: n, periodCode: r }), Be = (a) => N({ url: j("Packages", { projectId: a }), type: "GET" }), M = (a) => N({ url: j("ShareLinks", { packageId: a }), type: "GET" }), Ae = (a) => A(j("CreateShareLink"), a), Le = (a) => N({ url: j("RevokeShareLink", { id: a }), type: "POST" }), Z = (a, n = "TRY") => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + " " + ({ TRY: "₺", USD: "$", EUR: "€" }[n] || n), te = (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—", ne = {
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
}, se = {
  1: "Kurum",
  2: "Banka / finans",
  3: "Müşteri",
  4: "Denetçi · YMM",
  5: "İç kullanım"
}, Oe = (a) => N({ url: j("Schedules", { projectId: a }), type: "GET" }), $e = (a) => A(j("CreateSchedule"), a), Ie = (a, n) => N({ url: j("SetScheduleEnabled", { id: a, isEnabled: n }), type: "POST" }), We = (a) => N({ url: j("DeleteSchedule", { id: a }), type: "POST" }), Me = (a, n) => A(j("AddSubscriber", { scheduleId: a }), n), Fe = (a) => N({ url: j("RemoveSubscriber", { subscriberId: a }), type: "POST" }), Ge = 1, Ke = 7, _e = 160, qe = (a, n) => String(a ?? "").toLowerCase() === String(n ?? "").toLowerCase();
function Ue(a, n) {
  return (a ?? []).find((r) => r.status === Ge && qe(r.reportTemplateId, n)) ?? null;
}
function Ye(a, n = /* @__PURE__ */ new Date()) {
  const i = ` · ${new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(n)}`;
  return `${a.slice(0, _e - i.length)}${i}`;
}
async function He({ projectId: a, template: n }) {
  const r = Ue(await ge(a), n.id);
  return r ? { pkg: r, created: !1 } : { pkg: await je({
    projectId: a,
    name: Ye(n.name),
    reportTemplateId: n.id,
    formats: Ke
  }), created: !0 };
}
function Ze({ projectId: a, template: n, onPickProject: r }) {
  const [i, m] = o.useState(null), [c, u] = o.useState(""), [f, d] = o.useState(!1), x = o.useCallback(async () => {
    if (!a) {
      m(null);
      return;
    }
    d(!0);
    try {
      m(await Ee(a, n == null ? void 0 : n.id, c));
    } catch (h) {
      S("error", "Önizleme üretilemedi."), console.error("[ReportBuilder] preview", h);
    } finally {
      d(!1);
    }
  }, [a, n == null ? void 0 : n.id, c]);
  if (o.useEffect(() => {
    x();
  }, [x]), !a)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx(
      F,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-eye" }),
        title: "Proje bağlamı gerekiyor",
        description: "Önizleme gerçek veriyle üretilir; üstteki listeden bir proje seçin.",
        action: /* @__PURE__ */ e.jsx(
          ae,
          {
            primary: /* @__PURE__ */ e.jsx(T, { size: "sm", onClick: r, children: "Proje seç" }),
            link: { label: "veya proje kapsamından seç", href: `${E()}Documents/Scope` }
          }
        )
      }
    ) });
  if (f) return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx(I, { rows: 6 }) });
  if (!i) return null;
  const y = i.summary;
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
            value: c,
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
            href: Re(a, n == null ? void 0 : n.id, c),
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
          y.compliancePercent
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Belge" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", children: y.documentCount })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Eksik" }),
        /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "apya-numeric apya-doc-kpi-value",
            style: { color: y.blockingCount > 0 ? "var(--apya-negative-500)" : void 0 },
            children: y.missingCount
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
          y.blockingCount,
          " bloke edici"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-kpi", children: [
        /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Belgelenen tutar" }),
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", style: { fontSize: 16 }, children: Z(y.documentedAmount, y.currency) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline", children: [
      "Çıktıya girecek bölümler (",
      i.sections.length,
      ")"
    ] }),
    i.sections.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Açık bölüm yok — Bölümler sekmesinden en az bir tane açın." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-1 mb-3", children: i.sections.map((h, t) => /* @__PURE__ */ e.jsxs(R, { variant: "neutral", size: "sm", children: [
      t + 1,
      ". ",
      ne[h] ?? h
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
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric text-end", style: { fontSize: 11.5 }, children: h.amount != null ? Z(h.amount) : te(h.documentDate) })
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
const Je = [
  { value: 2, label: "Aylık" },
  { value: 3, label: "Üç aylık" },
  { value: 1, label: "Haftalık" }
], ie = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"], J = (a) => a ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(a)) : "—";
function Ve(a) {
  if (a.frequency === 1) return `Her ${ie[a.dayOfWeek]}, ${a.hourOfDay}:00`;
  const n = a.frequency === 3 ? "üç ayda bir" : "her ay";
  return `Ayın ${a.dayOfMonth}'i, ${n}, ${a.hourOfDay}:00`;
}
function Qe({ schedule: a, busy: n, onChanged: r }) {
  const [i, m] = o.useState(""), [c, u] = o.useState(""), [f, d] = o.useState(!1), x = async () => {
    var y, h;
    try {
      await Me(a.id, { name: i.trim(), email: c.trim(), userId: null }), m(""), u(""), d(!1), r();
    } catch (t) {
      S("error", ((h = (y = t == null ? void 0 : t.responseJSON) == null ? void 0 : y.error) == null ? void 0 : h.message) || "Abone eklenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", children: [
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Aboneler" }),
    a.subscribers.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Abone yok — üretim yine yapılır, kimse haberdar edilmez." }) : a.subscribers.map((y) => /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", style: { fontSize: 12 }, children: [
      /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { flex: 1 }, children: [
        y.name,
        " ",
        /* @__PURE__ */ e.jsxs("span", { style: { color: "var(--apya-text-tertiary)" }, children: [
          "· ",
          y.email
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "apya-doc-linkbtn",
          disabled: n,
          onClick: async () => {
            await Fe(y.id), r();
          },
          children: "Çıkar"
        }
      )
    ] }, y.id)),
    f ? /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
      /* @__PURE__ */ e.jsx(H, { size: "sm", placeholder: "Ad", value: i, onChange: (y) => m(y.target.value) }),
      /* @__PURE__ */ e.jsx(H, { size: "sm", type: "email", placeholder: "e-posta", value: c, onChange: (y) => u(y.target.value) }),
      /* @__PURE__ */ e.jsx(T, { size: "sm", disabled: !i.trim() || !c.trim(), onClick: x, children: "Ekle" }),
      /* @__PURE__ */ e.jsx(T, { size: "sm", variant: "outline", onClick: () => d(!1), children: "Vazgeç" })
    ] }) : /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: () => d(!0), children: "+ Abone ekle" })
  ] });
}
function Xe({ projectId: a, packages: n }) {
  const [r, i] = o.useState([]), [m, c] = o.useState(!0), [u, f] = o.useState(!1), [d, x] = o.useState(null), y = o.useCallback(async () => {
    if (!a) {
      i([]), c(!1);
      return;
    }
    c(!0);
    try {
      i(await Oe(a) ?? []);
    } catch (t) {
      S("error", "Zamanlamalar yüklenemedi."), console.error("[Documents] schedules", t);
    } finally {
      c(!1);
    }
  }, [a]);
  o.useEffect(() => {
    y();
  }, [y]);
  const h = async () => {
    f(!0);
    try {
      await $e({
        deliveryPackageId: d.deliveryPackageId,
        frequency: Number(d.frequency),
        dayOfMonth: Number(d.dayOfMonth),
        dayOfWeek: Number(d.dayOfWeek),
        hourOfDay: Number(d.hourOfDay)
      }), x(null), await y();
    } catch (t) {
      S("error", "Zamanlama kurulamadı."), console.error("[Documents] createSchedule", t);
    } finally {
      f(!1);
    }
  };
  return a ? m ? /* @__PURE__ */ e.jsx(I, { rows: 3 }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
      /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "Zamanlanmış üretim" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      !d && n.length > 0 && /* @__PURE__ */ e.jsx(
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
    d && /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2 align-items-center", children: [
      /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: d.deliveryPackageId,
          onChange: (t) => x({ ...d, deliveryPackageId: t.target.value }),
          "aria-label": "Paket",
          children: n.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.id, children: t.name }, t.id))
        }
      ),
      /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: d.frequency,
          onChange: (t) => x({ ...d, frequency: Number(t.target.value) }),
          "aria-label": "Sıklık",
          children: Je.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.value, children: t.label }, t.value))
        }
      ),
      Number(d.frequency) === 1 ? /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: d.dayOfWeek,
          onChange: (t) => x({ ...d, dayOfWeek: Number(t.target.value) }),
          "aria-label": "Gün",
          children: ie.map((t, g) => /* @__PURE__ */ e.jsx("option", { value: g, children: t }, t))
        }
      ) : /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: d.dayOfMonth,
          onChange: (t) => x({ ...d, dayOfMonth: Number(t.target.value) }),
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
          value: d.hourOfDay,
          onChange: (t) => x({ ...d, hourOfDay: Number(t.target.value) }),
          "aria-label": "Saat",
          children: Array.from({ length: 24 }, (t, g) => g).map((t) => /* @__PURE__ */ e.jsxs("option", { value: t, children: [
            String(t).padStart(2, "0"),
            ":00"
          ] }, t))
        }
      ),
      /* @__PURE__ */ e.jsx(T, { size: "sm", isLoading: u, onClick: h, children: "Kur" }),
      /* @__PURE__ */ e.jsx(T, { size: "sm", variant: "outline", onClick: () => x(null), children: "Vazgeç" })
    ] }),
    r.map((t) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex flex-column gap-2 p-2",
        style: { background: "var(--apya-surface-sunken)", borderRadius: 10 },
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12.5, fontWeight: 600 }, children: t.packageName }),
            /* @__PURE__ */ e.jsx(R, { variant: t.isEnabled ? "positive" : "neutral", size: "sm", children: t.isEnabled ? "açık" : "kapalı" }),
            /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11.5, color: "var(--apya-text-secondary)" }, children: Ve(t) }),
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
                    await Ie(t.id, !t.isEnabled), await y();
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
                  await We(t.id), await y();
                },
                children: "Sil"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-3 flex-wrap apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
            /* @__PURE__ */ e.jsxs("span", { children: [
              "sıradaki: ",
              J(t.nextRunAt)
            ] }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              "son: ",
              J(t.lastRunAt)
            ] })
          ] }),
          t.lastError && /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-negative-500)" }, children: [
            "Son deneme başarısız: ",
            t.lastError
          ] }),
          /* @__PURE__ */ e.jsx(Qe, { schedule: t, busy: u, onChanged: y })
        ]
      },
      t.id
    )),
    r.length === 0 && !d && n.length > 0 && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Kurulu zamanlama yok." })
  ] }) : null;
}
function ea({ projectId: a, onPickProject: n }) {
  const [r, i] = o.useState([]), [m, c] = o.useState(null), [u, f] = o.useState([]), [d, x] = o.useState(null), [y, h] = o.useState(!1), [t, g] = o.useState(!1), k = o.useCallback(async () => {
    if (!a) {
      i([]);
      return;
    }
    h(!0);
    try {
      i(await Be(a) ?? []);
    } catch (p) {
      S("error", "Paketler yüklenemedi."), console.error("[ReportBuilder] packages", p);
    } finally {
      h(!1);
    }
  }, [a]);
  o.useEffect(() => {
    k();
  }, [k]);
  const C = async (p) => {
    c(p), x(null);
    try {
      f(await M(p.id) ?? []);
    } catch (w) {
      console.error("[ReportBuilder] shareLinks", w);
    }
  }, P = async (p) => {
    if (m) {
      g(!0);
      try {
        const w = await Ae({
          targetType: 1,
          // DeliveryPackage
          targetId: m.id,
          lifetimeDays: 30,
          allowDownload: p,
          watermark: null
        });
        x(w), f(await M(m.id) ?? []);
      } catch {
        S("error", "Paylaşım linki oluşturulamadı.");
      } finally {
        g(!1);
      }
    }
  }, D = async (p) => {
    g(!0);
    try {
      await Le(p), f(await M(m.id) ?? []);
    } catch {
      S("error", "Link iptal edilemedi.");
    } finally {
      g(!1);
    }
  };
  return a ? y ? /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx(I, { rows: 5 }) }) : /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-3", children: [
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
      r.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu projede paket yok. Dağıtmak için önce Teslimler ekranından bir paket üretin." }) : r.map((p) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: `apya-md-item${(m == null ? void 0 : m.id) === p.id ? " selected" : ""}`,
          style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 },
          onClick: () => C(p),
          children: [
            /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1, textAlign: "left" }, children: [
              /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: p.name }),
              /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                p.reportTemplateName ?? "şablonsuz",
                p.periodCode && ` · ${p.periodCode}`
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(R, { variant: p.status === 2 ? "positive" : p.status === 3 ? "accent" : "neutral", size: "sm", children: p.status === 2 ? "üretildi" : p.status === 3 ? "gönderildi" : "taslak" })
          ]
        },
        p.id
      )),
      m && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mt-3", children: [
          "Paylaşım linkleri · ",
          m.name
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 mb-2", children: [
          /* @__PURE__ */ e.jsx(T, { variant: "outline", size: "sm", disabled: t, onClick: () => P(!1), children: "Salt görüntüleme linki" }),
          /* @__PURE__ */ e.jsx(T, { variant: "outline", size: "sm", disabled: t, onClick: () => P(!0), children: "İndirmeye açık link" })
        ] }),
        d && /* @__PURE__ */ e.jsxs("div", { style: {
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
            d.token
          ] })
        ] }),
        u.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu pakette link yok." }) : u.map((p) => /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "apya-doc-check-row",
            style: { gridTemplateColumns: "minmax(0,1fr) 110px 90px 70px" },
            children: [
              /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 12 }, children: [
                p.allowDownload ? "İndirilebilir" : "Salt görüntüleme",
                p.isRevoked && /* @__PURE__ */ e.jsx(R, { variant: "negative", size: "sm", children: "iptal" })
              ] }),
              /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
                te(p.expiresAt),
                " bitiyor"
              ] }),
              /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11 }, children: [
                p.accessCount ?? 0,
                " erişim"
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "text-end", children: !p.isRevoked && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "apya-doc-linkbtn",
                  disabled: t,
                  onClick: () => D(p.id),
                  children: "İptal"
                }
              ) })
            ]
          },
          p.id
        ))
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(Xe, { projectId: a, packages: r })
  ] }) : /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx(
    F,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-share-nodes" }),
      title: "Proje bağlamı gerekiyor",
      description: "Dağıtım üretilmiş paketler üzerinden yürür; üstteki listeden bir proje seçin.",
      action: /* @__PURE__ */ e.jsx(
        ae,
        {
          primary: /* @__PURE__ */ e.jsx(T, { size: "sm", onClick: n, children: "Proje seç" }),
          link: { label: "veya proje kapsamından seç", href: `${E()}Documents/Scope` }
        }
      )
    }
  ) });
}
const B = "own", re = "general", aa = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };
function V(a) {
  return String(a ?? "").toLocaleLowerCase("tr-TR").replace(/[çğıöşü]/g, (n) => aa[n]).normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function le(a) {
  return a.isSystem ? a.issuer ? { key: `issuer:${a.issuer}`, title: a.issuer } : { key: re, title: "Genel şablonlar" } : { key: B, title: "Kendi şablonlarım" };
}
function ta(a, n) {
  const r = V(n).split(/\s+/).filter(Boolean);
  if (r.length === 0) return !0;
  const i = V([a.name, a.issuer, se[a.recipient]].join(" "));
  return r.every((m) => i.includes(m));
}
function na(a, n = "") {
  const r = /* @__PURE__ */ new Map();
  for (const c of a) {
    if (!ta(c, n)) continue;
    const { key: u, title: f } = le(c);
    r.has(u) || r.set(u, { key: u, title: f, items: [] }), r.get(u).items.push(c);
  }
  const i = [...r.values()];
  return [...i.filter((c) => c.key === B), ...i.filter((c) => c.key !== B)];
}
const oe = (...a) => a.filter(Boolean).join(" "), Q = { fontSize: 11, color: "var(--apya-text-tertiary)" }, X = {
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
}, sa = {
  fontSize: 12.5,
  fontWeight: 500,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  overflowWrap: "anywhere"
};
function ia(a, n) {
  const r = se[a.recipient] ?? "—";
  return n === B ? a.issuer ? `${r} · ${a.issuer}` : r : n === re ? r : null;
}
function ra({ template: a, selected: n, groupKey: r, onSelect: i }) {
  const m = ia(a, r);
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      className: oe("apya-md-item", n && "selected"),
      style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 },
      "aria-current": n || void 0,
      title: a.name,
      onClick: () => i(a.id),
      children: [
        /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1, textAlign: "left" }, children: [
          /* @__PURE__ */ e.jsx("span", { style: sa, children: a.name }),
          m && /* @__PURE__ */ e.jsx("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: m })
        ] }),
        /* @__PURE__ */ e.jsx(R, { variant: "accent", size: "sm", children: a.enabledSectionCount })
      ]
    }
  );
}
function la({ templates: a, selectedId: n, onSelect: r }) {
  const [i, m] = o.useState(""), c = a.find((t) => t.id === n) ?? null, u = c ? le(c).key : null, [f, d] = o.useState(
    () => new Set([B, u].filter(Boolean))
  );
  o.useEffect(() => {
    u && d((t) => t.has(u) ? t : new Set(t).add(u));
  }, [u]);
  const x = o.useMemo(() => na(a, i), [a, i]), y = i.trim().length > 0, h = (t) => d((g) => {
    const k = new Set(g);
    return k.has(t) ? k.delete(t) : k.add(t), k;
  });
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center justify-content-between", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-md-overline", children: "Şablonlar" }),
      /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: Q, children: a.length })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Şablon yok." }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("label", { className: "apya-console-search", style: { width: "100%", margin: 0 }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-magnifying-glass", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "search",
            value: i,
            onChange: (t) => m(t.target.value),
            onKeyDown: (t) => {
              t.key === "Escape" && m("");
            },
            placeholder: "Kurum ya da şablon ara…",
            "aria-label": "Şablon ara",
            style: { flex: 1, width: "auto", minWidth: 0 }
          }
        )
      ] }),
      x.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Aramaya uyan şablon yok." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-column", style: { gap: 2 }, children: x.map((t, g) => {
        const k = y || f.has(t.key), C = `report-template-group-${g}`, P = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(
            "i",
            {
              className: oe("fa", k ? "fa-chevron-down" : "fa-chevron-right"),
              "aria-hidden": "true",
              style: { width: 10, fontSize: 9 }
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { flex: 1, minWidth: 0 }, children: t.title }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: Q, children: t.items.length })
        ] });
        return /* @__PURE__ */ e.jsxs("div", { children: [
          y ? /* @__PURE__ */ e.jsx("div", { style: X, children: P }) : /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              style: { ...X, cursor: "pointer" },
              "aria-expanded": k,
              "aria-controls": C,
              onClick: () => h(t.key),
              children: P
            }
          ),
          k && /* @__PURE__ */ e.jsx("div", { id: C, role: "group", "aria-label": t.title, className: "d-flex flex-column", style: { gap: 2 }, children: t.items.map((D) => /* @__PURE__ */ e.jsx(
            ra,
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
const oa = (...a) => a.filter(Boolean).join(" "), ca = [
  { key: "sections", label: "Bölümler" },
  { key: "preview", label: "Önizleme" },
  { key: "distribution", label: "Dağıtım" }
];
function da({ section: a, onToggle: n, onMove: r, isFirst: i, isLast: m, busy: c, readOnly: u }) {
  const f = ne[a.sectionKey] ?? `Bölüm ${a.sectionKey}`;
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", style: { gridTemplateColumns: "34px minmax(0,1fr) auto auto" }, children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "checkbox",
        checked: a.isEnabled,
        disabled: c || u || !a.isAvailable,
        onChange: (d) => n(a.id, d.target.checked),
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
          disabled: c || u || i,
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
          disabled: c || u || m,
          onClick: () => r(a.id, 1),
          "aria-label": "Aşağı taşı",
          children: "↓"
        }
      )
    ] })
  ] });
}
function ma() {
  var U, Y;
  const a = new URLSearchParams(window.location.search), [n, r] = o.useState([]), [i, m] = o.useState([]), [c, u] = o.useState(null), [f, d] = o.useState((a.get("projectId") || "").toLowerCase()), [x, y] = o.useState("sections"), [h, t] = o.useState(!0), [g, k] = o.useState(!1), [C, P] = o.useState(null), D = o.useRef(null), p = ve("Platform.Documents.GenerateReports"), w = o.useCallback(async () => {
    t(!0);
    try {
      const [s, l] = await Promise.all([Se(), De()]);
      r(s ?? []), m(l ?? []), u((b) => {
        var z;
        return b ?? ((z = s == null ? void 0 : s[0]) == null ? void 0 : z.id) ?? null;
      });
    } catch (s) {
      S("error", "Şablonlar yüklenemedi."), console.error("[ReportBuilder] load", s);
    } finally {
      t(!1);
    }
  }, []);
  o.useEffect(() => {
    w();
  }, [w]);
  const v = o.useMemo(
    () => n.find((s) => s.id === c) ?? null,
    [n, c]
  ), W = v ? (v.tenantId ?? null) === (((Y = (U = window.abp) == null ? void 0 : U.currentTenant) == null ? void 0 : Y.id) ?? null) : !1, L = o.useMemo(
    () => v ? [...v.sections].sort((s, l) => s.order - l.order) : [],
    [v]
  ), G = async (s) => {
    if (!(!v || !W)) {
      k(!0);
      try {
        const l = await Ne({
          templateId: v.id,
          sections: s.map((b, z) => ({ sectionId: b.id, order: z + 1, isEnabled: b.isEnabled }))
        });
        r((b) => b.map((z) => z.id === l.id ? l : z));
      } catch (l) {
        S("error", "Bölümler kaydedilemedi."), console.error("[ReportBuilder] persistSections", l);
      } finally {
        k(!1);
      }
    }
  }, ce = (s, l) => G(L.map((b) => b.id === s ? { ...b, isEnabled: l } : b)), de = (s, l) => {
    const b = [...L], z = b.findIndex((fe) => fe.id === s), $ = z + l;
    z < 0 || $ < 0 || $ >= b.length || ([b[z], b[$]] = [b[$], b[z]], G(b));
  }, me = async () => {
    const s = window.prompt("Şablon adı:");
    if (s) {
      k(!0);
      try {
        const l = await we({ name: s, recipient: 1, issuer: null, order: n.length + 1 });
        await w(), u(l.id);
      } catch {
        S("error", "Şablon oluşturulamadı.");
      } finally {
        k(!1);
      }
    }
  }, ue = async (s) => {
    k(!0);
    try {
      const l = await ze(s);
      await w(), u(l.id);
    } catch {
      S("error", "Şablon kopyalanamadı.");
    } finally {
      k(!1);
    }
  }, O = o.useRef(null), ye = async (s) => {
    if (s) {
      k(!0);
      try {
        const l = await Pe(s);
        l.ok ? (S("success", l.message), await w(), u(l.id)) : S("error", l.message);
      } catch {
        S("error", "Dosya işlenemedi. Lütfen tekrar deneyin.");
      } finally {
        k(!1), O.current && (O.current.value = "");
      }
    }
  }, pe = async (s) => {
    if (window.confirm("Bu şablon silinsin mi? Üretilmiş paketler etkilenmez.")) {
      k(!0);
      try {
        await Te(s), u(null), await w();
      } catch {
        S("error", "Şablon silinemedi.");
      } finally {
        k(!1);
      }
    }
  }, K = (s) => `${E()}Documents/Deliveries?projectId=${f}` + (s ? `&packageId=${s}` : ""), _ = async ({ silent: s = !1 } = {}) => {
    P(s ? "deliver" : "save");
    try {
      const { pkg: l, created: b } = await He({ projectId: f, template: v });
      return s || S(b ? "success" : "info", b ? `Taslak kaydedildi: ${l.name}` : `Bu şablonun taslağı zaten kayıtlı: ${l.name}`), l;
    } catch (l) {
      return S("error", "Taslak kaydedilemedi."), console.error("[ReportBuilder] saveDraft", l), null;
    } finally {
      P(null);
    }
  }, he = async () => {
    if (!p || !v) {
      window.location.assign(K(null));
      return;
    }
    const s = await _({ silent: !0 });
    s && window.location.assign(K(s.id));
  }, q = () => {
    var l;
    const s = D.current;
    if (s) {
      s.focus();
      try {
        (l = s.showPicker) == null || l.call(s);
      } catch {
      }
    }
  };
  return h ? /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx(I, { rows: 8 }) }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsx(
      ke,
      {
        title: "Rapor derleyici",
        description: "Şablonun bölümlerini seç, önizle, alıcıya dağıt",
        aside: /* @__PURE__ */ e.jsxs(
          "select",
          {
            ref: D,
            className: "apya-doc-select",
            value: f,
            onChange: (s) => d(s.target.value),
            "aria-label": "Proje bağlamı",
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Proje seçin…" }),
              i.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.id, children: s.code ? `${s.code} · ${s.name}` : s.name }, s.id))
            ]
          }
        ),
        menuItems: [
          { key: "new-template", label: "Yeni şablon", icon: "fa-plus", disabled: g, onSelect: me },
          ...p ? [{
            key: "import-template",
            label: "Şablonu içe aktar (JSON)",
            icon: "fa-file-import",
            disabled: g,
            onSelect: () => {
              var s;
              return (s = O.current) == null ? void 0 : s.click();
            }
          }] : []
        ]
      }
    ),
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: O,
        type: "file",
        accept: ".json,application/json",
        className: "d-none",
        "aria-hidden": "true",
        tabIndex: -1,
        "data-testid": "template-import-input",
        onChange: (s) => {
          var l;
          return ye((l = s.target.files) == null ? void 0 : l[0]);
        }
      }
    ),
    /* @__PURE__ */ e.jsx(be, { active: "report", projectId: f || null }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-doc-tabs mb-3", role: "tablist", children: ca.map((s) => /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": x === s.key,
        className: oa("apya-doc-tab", x === s.key && "is-active"),
        onClick: () => y(s.key),
        children: s.label
      },
      s.key
    )) }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-subflow", children: [
      /* @__PURE__ */ e.jsx("span", { className: "apya-doc-subflow-text", children: f ? "Bu ekranda: bölümleri seç ve sırala → önizle → üret. Ürettiğin rapor Teslim adımına geçer." : "Önce yukarıdan bir proje seçin — taslak ve teslim proje bağlamında çalışır." }),
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-subflow-actions", role: "group", "aria-label": "Rapor akışı", children: [
        p && /* @__PURE__ */ e.jsx(
          T,
          {
            variant: "secondary",
            size: "sm",
            isLoading: C === "save",
            disabled: !f || !v || C !== null,
            onClick: () => _(),
            children: "Taslak kaydet"
          }
        ),
        /* @__PURE__ */ e.jsx(T, { variant: "secondary", size: "sm", disabled: x === "preview", onClick: () => y("preview"), children: "Önizle" }),
        /* @__PURE__ */ e.jsx(
          T,
          {
            variant: "primary",
            size: "sm",
            isLoading: C === "deliver",
            disabled: !f || C !== null,
            trailingIcon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right", "aria-hidden": "true" }),
            onClick: he,
            children: p ? "Üret ve teslime geç" : "Teslime geç"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-reportgrid", children: [
      /* @__PURE__ */ e.jsx(la, { templates: n, selectedId: c, onSelect: u }),
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
                onClick: () => ue(v.id),
                children: "Kopyala"
              }
            ),
            /* @__PURE__ */ e.jsx(
              "a",
              {
                className: "apya-doc-linkbtn",
                href: Ce(v.id),
                download: !0,
                title: "Şablonun künyesini ve bölüm düzenini .json olarak indir",
                children: "JSON"
              }
            ),
            !v.isSystem && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: g,
                onClick: () => pe(v.id),
                children: "Sil"
              }
            )
          ] })
        ] }),
        W ? v.isSystem && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)", marginBottom: 6 }, children: "Sistem şablonu tüm kiracılarda paylaşılır; künyesi düzenlenemez. Burada yaptığınız bölüm değişikliği bütün kiracıların raporuna yansır." }) : /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)", marginBottom: 6 }, children: [
          "Sistem şablonu tüm kiracılarda paylaşılır; bölümleri ve künyesi buradan değiştirilemez. Kendinize uyarlamak için ",
          /* @__PURE__ */ e.jsx("strong", { children: "Kopyala" }),
          "'yı kullanın."
        ] }),
        L.map((s, l) => /* @__PURE__ */ e.jsx(
          da,
          {
            section: s,
            busy: g,
            readOnly: !W,
            isFirst: l === 0,
            isLast: l === L.length - 1,
            onToggle: ce,
            onMove: de
          },
          s.id
        ))
      ] }) : /* @__PURE__ */ e.jsx(
        F,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check" }),
          title: "Şablon seçin",
          description: "Soldan bir şablon seçerek bölümlerini düzenleyin."
        }
      ) }),
      x === "preview" && /* @__PURE__ */ e.jsx(Ze, { projectId: f, template: v, onPickProject: q }),
      x === "distribution" && /* @__PURE__ */ e.jsx(ea, { projectId: f, onPickProject: q })
    ] })
  ] });
}
const ee = document.getElementById("report-builder-island");
ee && xe(ee, "documents-report", /* @__PURE__ */ e.jsx(ma, {}));
