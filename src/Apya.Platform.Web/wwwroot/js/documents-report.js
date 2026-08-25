import { r as c, j as e, b as J } from "./react-vendor-D57GAUXd.js";
/* empty css               */
import { g as P, B as T, I as L } from "./Dialog-BdNKdiS6.js";
import { S as B } from "./SkeletonShape-CiCOe1YJ.js";
import { E as O } from "./EmptyState-Bhcx2Wdd.js";
const N = (a, n) => {
  var i, o, h;
  return (h = (o = (i = window == null ? void 0 : window.abp) == null ? void 0 : i.notify) == null ? void 0 : o[a]) == null ? void 0 : h.call(o, n);
}, R = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function v(a) {
  return new Promise((n, i) => {
    window.abp.ajax(a).done(n).fail(i);
  });
}
const k = (a, n = {}) => {
  const i = new URLSearchParams();
  Object.entries(n).forEach(([h, y]) => {
    y != null && y !== "" && i.append(h, y);
  });
  const o = i.toString();
  return `${R()}Documents/ReportBuilder?handler=${a}${o ? "&" + o : ""}`;
}, E = (a, n) => v({ url: a, type: "POST", contentType: "application/json", data: JSON.stringify(n) }), V = () => v({ url: k("Templates"), type: "GET" }), Q = (a) => E(k("UpdateSections"), a), X = (a) => E(k("CreateTemplate"), a), ee = (a) => v({ url: k("DuplicateTemplate", { id: a }), type: "POST" }), ae = (a) => v({ url: k("DeleteTemplate", { id: a }), type: "POST" }), te = () => v({ url: k("Projects"), type: "GET" }), se = (a, n, i) => v({ url: k("Preview", { projectId: a, templateId: n, periodCode: i }), type: "GET" }), ne = (a, n, i) => k("PreviewPdf", { projectId: a, templateId: n, periodCode: i }), ie = (a) => v({ url: k("Packages", { projectId: a }), type: "GET" }), A = (a) => v({ url: k("ShareLinks", { packageId: a }), type: "GET" }), le = (a) => E(k("CreateShareLink"), a), re = (a) => v({ url: k("RevokeShareLink", { id: a }), type: "POST" }), $ = (a, n = "TRY") => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + " " + ({ TRY: "₺", USD: "$", EUR: "€" }[n] || n), F = (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—", K = {
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
}, ce = {
  1: "Kurum",
  2: "Banka / finans",
  3: "Müşteri",
  4: "Denetçi · YMM",
  5: "İç kullanım"
}, oe = (a) => v({ url: k("Schedules", { projectId: a }), type: "GET" }), de = (a) => E(k("CreateSchedule"), a), me = (a, n) => v({ url: k("SetScheduleEnabled", { id: a, isEnabled: n }), type: "POST" }), ye = (a) => v({ url: k("DeleteSchedule", { id: a }), type: "POST" }), ue = (a, n) => E(k("AddSubscriber", { scheduleId: a }), n), pe = (a) => v({ url: k("RemoveSubscriber", { subscriberId: a }), type: "POST" });
function he({ projectId: a, template: n }) {
  const [i, o] = c.useState(null), [h, y] = c.useState(""), [u, x] = c.useState(!1), d = c.useCallback(async () => {
    if (!a) {
      o(null);
      return;
    }
    x(!0);
    try {
      o(await se(a, n == null ? void 0 : n.id, h));
    } catch (l) {
      N("error", "Önizleme üretilemedi."), console.error("[ReportBuilder] preview", l);
    } finally {
      x(!1);
    }
  }, [a, n == null ? void 0 : n.id, h]);
  if (c.useEffect(() => {
    d();
  }, [d]), !a)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx(
      O,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-eye" }),
        title: "Proje bağlamı gerekiyor",
        description: "Önizleme gerçek veriyle üretilir; üstteki listeden bir proje seçin."
      }
    ) });
  if (u) return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx(B, { rows: 6 }) });
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
            value: h,
            onChange: (l) => y(l.target.value),
            "aria-label": "Dönem kodu"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "a",
          {
            className: "apya-doc-linkbtn",
            target: "_blank",
            rel: "noreferrer",
            href: ne(a, n == null ? void 0 : n.id, h),
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
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", style: { fontSize: 16 }, children: $(m.documentedAmount, m.currency) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline", children: [
      "Çıktıya girecek bölümler (",
      i.sections.length,
      ")"
    ] }),
    i.sections.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Açık bölüm yok — Bölümler sekmesinden en az bir tane açın." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-1 mb-3", children: i.sections.map((l, b) => /* @__PURE__ */ e.jsxs(P, { variant: "neutral", size: "sm", children: [
      b + 1,
      ". ",
      K[l] ?? l
    ] }, `${l}-${b}`)) }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline", children: [
      "Ekler (",
      i.annexes.length,
      i.truncatedAnnexCount > 0 && ` · +${i.truncatedAnnexCount} gösterilmiyor`,
      ")"
    ] }),
    i.annexes.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu projede henüz belge yok; ek dizini boş çıkacak." }) : i.annexes.slice(0, 12).map((l) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "apya-doc-check-row",
        style: { gridTemplateColumns: "60px minmax(0,1fr) 90px 110px" },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11 }, children: l.annexNumber }),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: l.documentName }),
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: l.typeName ?? "—" }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric text-end", style: { fontSize: 11.5 }, children: l.amount != null ? $(l.amount) : F(l.documentDate) })
        ]
      },
      l.annexNumber + l.documentName
    )),
    i.missingDocuments.length > 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mt-3", children: [
        "Eksik belgeler (",
        i.missingDocuments.length,
        ")"
      ] }),
      i.missingDocuments.slice(0, 10).map((l, b) => /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 12, padding: "3px 0" }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation", style: { color: "var(--apya-warning-500)" } }),
        " ",
        l
      ] }, b))
    ] })
  ] });
}
const xe = [
  { value: 2, label: "Aylık" },
  { value: 3, label: "Üç aylık" },
  { value: 1, label: "Haftalık" }
], U = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"], W = (a) => a ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(a)) : "—";
function fe(a) {
  if (a.frequency === 1) return `Her ${U[a.dayOfWeek]}, ${a.hourOfDay}:00`;
  const n = a.frequency === 3 ? "üç ayda bir" : "her ay";
  return `Ayın ${a.dayOfMonth}'i, ${n}, ${a.hourOfDay}:00`;
}
function ke({ schedule: a, busy: n, onChanged: i }) {
  const [o, h] = c.useState(""), [y, u] = c.useState(""), [x, d] = c.useState(!1), m = async () => {
    var l, b;
    try {
      await ue(a.id, { name: o.trim(), email: y.trim(), userId: null }), h(""), u(""), d(!1), i();
    } catch (t) {
      N("error", ((b = (l = t == null ? void 0 : t.responseJSON) == null ? void 0 : l.error) == null ? void 0 : b.message) || "Abone eklenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-2", children: [
    /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Aboneler" }),
    a.subscribers.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)" }, children: "Abone yok — üretim yine yapılır, kimse haberdar edilmez." }) : a.subscribers.map((l) => /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", style: { fontSize: 12 }, children: [
      /* @__PURE__ */ e.jsxs("span", { className: "text-truncate", style: { flex: 1 }, children: [
        l.name,
        " ",
        /* @__PURE__ */ e.jsxs("span", { style: { color: "var(--apya-text-tertiary)" }, children: [
          "· ",
          l.email
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "apya-doc-linkbtn",
          disabled: n,
          onClick: async () => {
            await pe(l.id), i();
          },
          children: "Çıkar"
        }
      )
    ] }, l.id)),
    x ? /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-wrap gap-2", children: [
      /* @__PURE__ */ e.jsx(L, { size: "sm", placeholder: "Ad", value: o, onChange: (l) => h(l.target.value) }),
      /* @__PURE__ */ e.jsx(L, { size: "sm", type: "email", placeholder: "e-posta", value: y, onChange: (l) => u(l.target.value) }),
      /* @__PURE__ */ e.jsx(T, { size: "sm", disabled: !o.trim() || !y.trim(), onClick: m, children: "Ekle" }),
      /* @__PURE__ */ e.jsx(T, { size: "sm", variant: "outline", onClick: () => d(!1), children: "Vazgeç" })
    ] }) : /* @__PURE__ */ e.jsx("button", { type: "button", className: "apya-doc-linkbtn", onClick: () => d(!0), children: "+ Abone ekle" })
  ] });
}
function be({ projectId: a, packages: n }) {
  const [i, o] = c.useState([]), [h, y] = c.useState(!0), [u, x] = c.useState(!1), [d, m] = c.useState(null), l = c.useCallback(async () => {
    if (!a) {
      o([]), y(!1);
      return;
    }
    y(!0);
    try {
      o(await oe(a) ?? []);
    } catch (t) {
      N("error", "Zamanlamalar yüklenemedi."), console.error("[Documents] schedules", t);
    } finally {
      y(!1);
    }
  }, [a]);
  c.useEffect(() => {
    l();
  }, [l]);
  const b = async () => {
    x(!0);
    try {
      await de({
        deliveryPackageId: d.deliveryPackageId,
        frequency: Number(d.frequency),
        dayOfMonth: Number(d.dayOfMonth),
        dayOfWeek: Number(d.dayOfWeek),
        hourOfDay: Number(d.hourOfDay)
      }), m(null), await l();
    } catch (t) {
      N("error", "Zamanlama kurulamadı."), console.error("[Documents] createSchedule", t);
    } finally {
      x(!1);
    }
  };
  return a ? h ? /* @__PURE__ */ e.jsx(B, { rows: 3 }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
      /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "Zamanlanmış üretim" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
      !d && n.length > 0 && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "apya-doc-linkbtn",
          onClick: () => m({
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
          onChange: (t) => m({ ...d, deliveryPackageId: t.target.value }),
          "aria-label": "Paket",
          children: n.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.id, children: t.name }, t.id))
        }
      ),
      /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: d.frequency,
          onChange: (t) => m({ ...d, frequency: Number(t.target.value) }),
          "aria-label": "Sıklık",
          children: xe.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.value, children: t.label }, t.value))
        }
      ),
      Number(d.frequency) === 1 ? /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: d.dayOfWeek,
          onChange: (t) => m({ ...d, dayOfWeek: Number(t.target.value) }),
          "aria-label": "Gün",
          children: U.map((t, g) => /* @__PURE__ */ e.jsx("option", { value: g, children: t }, t))
        }
      ) : /* @__PURE__ */ e.jsx(
        "select",
        {
          className: "apya-doc-select",
          value: d.dayOfMonth,
          onChange: (t) => m({ ...d, dayOfMonth: Number(t.target.value) }),
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
          onChange: (t) => m({ ...d, hourOfDay: Number(t.target.value) }),
          "aria-label": "Saat",
          children: Array.from({ length: 24 }, (t, g) => g).map((t) => /* @__PURE__ */ e.jsxs("option", { value: t, children: [
            String(t).padStart(2, "0"),
            ":00"
          ] }, t))
        }
      ),
      /* @__PURE__ */ e.jsx(T, { size: "sm", isLoading: u, onClick: b, children: "Kur" }),
      /* @__PURE__ */ e.jsx(T, { size: "sm", variant: "outline", onClick: () => m(null), children: "Vazgeç" })
    ] }),
    i.map((t) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "d-flex flex-column gap-2 p-2",
        style: { background: "var(--apya-surface-sunken)", borderRadius: 10 },
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ e.jsx("span", { style: { fontSize: 12.5, fontWeight: 600 }, children: t.packageName }),
            /* @__PURE__ */ e.jsx(P, { variant: t.isEnabled ? "positive" : "neutral", size: "sm", children: t.isEnabled ? "açık" : "kapalı" }),
            /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11.5, color: "var(--apya-text-secondary)" }, children: fe(t) }),
            /* @__PURE__ */ e.jsx("div", { className: "flex-grow-1" }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: u,
                onClick: async () => {
                  x(!0);
                  try {
                    await me(t.id, !t.isEnabled), await l();
                  } finally {
                    x(!1);
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
                  await ye(t.id), await l();
                },
                children: "Sil"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-3 flex-wrap apya-numeric", style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
            /* @__PURE__ */ e.jsxs("span", { children: [
              "sıradaki: ",
              W(t.nextRunAt)
            ] }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              "son: ",
              W(t.lastRunAt)
            ] })
          ] }),
          t.lastError && /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-negative-500)" }, children: [
            "Son deneme başarısız: ",
            t.lastError
          ] }),
          /* @__PURE__ */ e.jsx(ke, { schedule: t, busy: u, onChanged: l })
        ]
      },
      t.id
    )),
    i.length === 0 && !d && n.length > 0 && /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Kurulu zamanlama yok." })
  ] }) : null;
}
function je({ projectId: a }) {
  const [n, i] = c.useState([]), [o, h] = c.useState(null), [y, u] = c.useState([]), [x, d] = c.useState(null), [m, l] = c.useState(!1), [b, t] = c.useState(!1), g = c.useCallback(async () => {
    if (!a) {
      i([]);
      return;
    }
    l(!0);
    try {
      i(await ie(a) ?? []);
    } catch (r) {
      N("error", "Paketler yüklenemedi."), console.error("[ReportBuilder] packages", r);
    } finally {
      l(!1);
    }
  }, [a]);
  c.useEffect(() => {
    g();
  }, [g]);
  const z = async (r) => {
    h(r), d(null);
    try {
      u(await A(r.id) ?? []);
    } catch (C) {
      console.error("[ReportBuilder] shareLinks", C);
    }
  }, w = async (r) => {
    if (o) {
      t(!0);
      try {
        const C = await le({
          targetType: 1,
          // DeliveryPackage
          targetId: o.id,
          lifetimeDays: 30,
          allowDownload: r,
          watermark: null
        });
        d(C), u(await A(o.id) ?? []);
      } catch {
        N("error", "Paylaşım linki oluşturulamadı.");
      } finally {
        t(!1);
      }
    }
  }, j = async (r) => {
    t(!0);
    try {
      await re(r), u(await A(o.id) ?? []);
    } catch {
      N("error", "Link iptal edilemedi.");
    } finally {
      t(!1);
    }
  };
  return a ? m ? /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx(B, { rows: 5 }) }) : /* @__PURE__ */ e.jsxs("div", { className: "d-flex flex-column gap-3", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
        /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "Üretilmiş paketler" }),
        /* @__PURE__ */ e.jsx(
          "a",
          {
            className: "apya-doc-linkbtn",
            href: `${R()}Documents/Deliveries?projectId=${a}`,
            children: "Teslimler ekranı"
          }
        )
      ] }),
      n.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu projede paket yok. Dağıtmak için önce Teslimler ekranından bir paket üretin." }) : n.map((r) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: `apya-md-item${(o == null ? void 0 : o.id) === r.id ? " selected" : ""}`,
          style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 },
          onClick: () => z(r),
          children: [
            /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1, textAlign: "left" }, children: [
              /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: r.name }),
              /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                r.reportTemplateName ?? "şablonsuz",
                r.periodCode && ` · ${r.periodCode}`
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(P, { variant: r.status === 2 ? "positive" : r.status === 3 ? "accent" : "neutral", size: "sm", children: r.status === 2 ? "üretildi" : r.status === 3 ? "gönderildi" : "taslak" })
          ]
        },
        r.id
      )),
      o && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mt-3", children: [
          "Paylaşım linkleri · ",
          o.name
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 mb-2", children: [
          /* @__PURE__ */ e.jsx(T, { variant: "outline", size: "sm", disabled: b, onClick: () => w(!1), children: "Salt görüntüleme linki" }),
          /* @__PURE__ */ e.jsx(T, { variant: "outline", size: "sm", disabled: b, onClick: () => w(!0), children: "İndirmeye açık link" })
        ] }),
        x && /* @__PURE__ */ e.jsxs("div", { style: {
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
            R(),
            "Share/",
            x.token
          ] })
        ] }),
        y.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu pakette link yok." }) : y.map((r) => /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "apya-doc-check-row",
            style: { gridTemplateColumns: "minmax(0,1fr) 110px 90px 70px" },
            children: [
              /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 12 }, children: [
                r.allowDownload ? "İndirilebilir" : "Salt görüntüleme",
                r.isRevoked && /* @__PURE__ */ e.jsx(P, { variant: "negative", size: "sm", children: "iptal" })
              ] }),
              /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
                F(r.expiresAt),
                " bitiyor"
              ] }),
              /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11 }, children: [
                r.accessCount ?? 0,
                " erişim"
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "text-end", children: !r.isRevoked && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "apya-doc-linkbtn",
                  disabled: b,
                  onClick: () => j(r.id),
                  children: "İptal"
                }
              ) })
            ]
          },
          r.id
        ))
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(be, { projectId: a, packages: n })
  ] }) : /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx(
    O,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-share-nodes" }),
      title: "Proje bağlamı gerekiyor",
      description: "Dağıtım üretilmiş paketler üzerinden yürür; üstteki listeden bir proje seçin."
    }
  ) });
}
const M = (...a) => a.filter(Boolean).join(" "), ge = [
  { key: "sections", label: "Bölümler" },
  { key: "preview", label: "Önizleme" },
  { key: "distribution", label: "Dağıtım" }
];
function ve({ section: a, onToggle: n, onMove: i, isFirst: o, isLast: h, busy: y }) {
  const u = K[a.sectionKey] ?? `Bölüm ${a.sectionKey}`;
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", style: { gridTemplateColumns: "34px minmax(0,1fr) auto auto" }, children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "checkbox",
        checked: a.isEnabled,
        disabled: y || !a.isAvailable,
        onChange: (x) => n(a.id, x.target.checked),
        "aria-label": `${u} bölümünü aç/kapa`
      }
    ),
    /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ e.jsx(
        "span",
        {
          className: "d-block text-truncate",
          style: { fontSize: 12.5, opacity: a.isAvailable ? 1 : 0.55 },
          children: u
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
          disabled: y || o,
          onClick: () => i(a.id, -1),
          "aria-label": "Yukarı taşı",
          children: "↑"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "apya-doc-linkbtn",
          disabled: y || h,
          onClick: () => i(a.id, 1),
          "aria-label": "Aşağı taşı",
          children: "↓"
        }
      )
    ] })
  ] });
}
function Se() {
  const a = new URLSearchParams(window.location.search), [n, i] = c.useState([]), [o, h] = c.useState([]), [y, u] = c.useState(null), [x, d] = c.useState((a.get("projectId") || "").toLowerCase()), [m, l] = c.useState("sections"), [b, t] = c.useState(!0), [g, z] = c.useState(!1), w = c.useCallback(async () => {
    t(!0);
    try {
      const [s, p] = await Promise.all([V(), te()]);
      i(s ?? []), h(p ?? []), u((f) => {
        var S;
        return f ?? ((S = s == null ? void 0 : s[0]) == null ? void 0 : S.id) ?? null;
      });
    } catch (s) {
      N("error", "Şablonlar yüklenemedi."), console.error("[ReportBuilder] load", s);
    } finally {
      t(!1);
    }
  }, []);
  c.useEffect(() => {
    w();
  }, [w]);
  const j = c.useMemo(
    () => n.find((s) => s.id === y) ?? null,
    [n, y]
  ), r = c.useMemo(
    () => j ? [...j.sections].sort((s, p) => s.order - p.order) : [],
    [j]
  ), C = async (s) => {
    if (j) {
      z(!0);
      try {
        const p = await Q({
          templateId: j.id,
          sections: s.map((f, S) => ({ sectionId: f.id, order: S + 1, isEnabled: f.isEnabled }))
        });
        i((f) => f.map((S) => S.id === p.id ? p : S));
      } catch (p) {
        N("error", "Bölümler kaydedilemedi."), console.error("[ReportBuilder] persistSections", p);
      } finally {
        z(!1);
      }
    }
  }, q = (s, p) => C(r.map((f) => f.id === s ? { ...f, isEnabled: p } : f)), G = (s, p) => {
    const f = [...r], S = f.findIndex((H) => H.id === s), D = S + p;
    S < 0 || D < 0 || D >= f.length || ([f[S], f[D]] = [f[D], f[S]], C(f));
  }, Y = async () => {
    const s = window.prompt("Şablon adı:");
    if (s) {
      z(!0);
      try {
        const p = await X({ name: s, recipient: 1, issuer: null, order: n.length + 1 });
        await w(), u(p.id);
      } catch {
        N("error", "Şablon oluşturulamadı.");
      } finally {
        z(!1);
      }
    }
  }, Z = async (s) => {
    z(!0);
    try {
      const p = await ee(s);
      await w(), u(p.id);
    } catch {
      N("error", "Şablon kopyalanamadı.");
    } finally {
      z(!1);
    }
  }, _ = async (s) => {
    if (window.confirm("Bu şablon silinsin mi? Üretilmiş paketler etkilenmez.")) {
      z(!0);
      try {
        await ae(s), u(null), await w();
      } catch {
        N("error", "Şablon silinemedi.");
      } finally {
        z(!1);
      }
    }
  };
  return b ? /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx(B, { rows: 8 }) }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h1", { style: { fontSize: 20, fontWeight: 700, margin: 0 }, children: "Rapor derleyici" }),
        /* @__PURE__ */ e.jsx("p", { style: { fontSize: 12, color: "var(--apya-text-tertiary)", margin: "4px 0 0" }, children: "Şablonun bölümlerini seç, önizle, alıcıya dağıt" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex align-items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs(
          "select",
          {
            className: "apya-doc-select",
            value: x,
            onChange: (s) => d(s.target.value),
            "aria-label": "Proje bağlamı",
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Proje seçin…" }),
              o.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.id, children: s.code ? `${s.code} · ${s.name}` : s.name }, s.id))
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(T, { variant: "outline", size: "sm", disabled: g, onClick: Y, children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
          " Yeni şablon"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-doc-tabs mb-3", role: "tablist", children: ge.map((s) => /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": m === s.key,
        className: M("apya-doc-tab", m === s.key && "active"),
        onClick: () => l(s.key),
        children: s.label
      },
      s.key
    )) }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-reportgrid", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Şablonlar" }),
        n.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Şablon yok." }) : n.map((s) => /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: M("apya-md-item", y === s.id && "selected"),
            style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 },
            onClick: () => u(s.id),
            children: [
              /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1, textAlign: "left" }, children: [
                /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: s.name }),
                /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                  ce[s.recipient] ?? "—",
                  s.issuer && ` · ${s.issuer}`
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-1", children: [
                s.isSystem && /* @__PURE__ */ e.jsx(P, { variant: "neutral", size: "sm", children: "sistem" }),
                /* @__PURE__ */ e.jsx(P, { variant: "accent", size: "sm", children: s.enabledSectionCount })
              ] })
            ]
          },
          s.id
        ))
      ] }),
      m === "sections" && /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: j ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: j.name }),
          /* @__PURE__ */ e.jsxs("span", { className: "d-flex gap-2", children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: g,
                onClick: () => Z(j.id),
                children: "Kopyala"
              }
            ),
            !j.isSystem && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: g,
                onClick: () => _(j.id),
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
        r.map((s, p) => /* @__PURE__ */ e.jsx(
          ve,
          {
            section: s,
            busy: g,
            isFirst: p === 0,
            isLast: p === r.length - 1,
            onToggle: q,
            onMove: G
          },
          s.id
        ))
      ] }) : /* @__PURE__ */ e.jsx(
        O,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check" }),
          title: "Şablon seçin",
          description: "Soldan bir şablon seçerek bölümlerini düzenleyin."
        }
      ) }),
      m === "preview" && /* @__PURE__ */ e.jsx(he, { projectId: x, template: j }),
      m === "distribution" && /* @__PURE__ */ e.jsx(je, { projectId: x })
    ] })
  ] });
}
const I = document.getElementById("report-builder-island");
I && J(I).render(/* @__PURE__ */ e.jsx(Se, {}));
