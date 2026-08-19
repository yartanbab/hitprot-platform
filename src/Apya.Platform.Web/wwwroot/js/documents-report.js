import { r, j as e, b as q } from "./react-vendor.js";
/* empty css      */
import { g as C, B as E } from "./Dialog.js";
import { S as R } from "./SkeletonShape.js";
import { E as L } from "./EmptyState.js";
const g = (a, i) => {
  var t, l, p;
  return (p = (l = (t = window == null ? void 0 : window.abp) == null ? void 0 : t.notify) == null ? void 0 : l[a]) == null ? void 0 : p.call(l, i);
}, D = () => {
  var a;
  return ((a = window == null ? void 0 : window.abp) == null ? void 0 : a.appPath) ?? "/";
};
function v(a) {
  return new Promise((i, t) => {
    window.abp.ajax(a).done(i).fail(t);
  });
}
const k = (a, i = {}) => {
  const t = new URLSearchParams();
  Object.entries(i).forEach(([p, m]) => {
    m != null && m !== "" && t.append(p, m);
  });
  const l = t.toString();
  return `${D()}Documents/ReportBuilder?handler=${a}${l ? "&" + l : ""}`;
}, A = (a, i) => v({ url: a, type: "POST", contentType: "application/json", data: JSON.stringify(i) }), Z = () => v({ url: k("Templates"), type: "GET" }), H = (a) => A(k("UpdateSections"), a), J = (a) => A(k("CreateTemplate"), a), Q = (a) => v({ url: k("DuplicateTemplate", { id: a }), type: "POST" }), V = (a) => v({ url: k("DeleteTemplate", { id: a }), type: "POST" }), X = () => v({ url: k("Projects"), type: "GET" }), ee = (a, i, t) => v({ url: k("Preview", { projectId: a, templateId: i, periodCode: t }), type: "GET" }), ae = (a, i, t) => k("PreviewPdf", { projectId: a, templateId: i, periodCode: t }), se = (a) => v({ url: k("Packages", { projectId: a }), type: "GET" }), B = (a) => v({ url: k("ShareLinks", { packageId: a }), type: "GET" }), te = (a) => A(k("CreateShareLink"), a), ie = (a) => v({ url: k("RevokeShareLink", { id: a }), type: "POST" }), $ = (a, i = "TRY") => a == null ? "—" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(a) + " " + ({ TRY: "₺", USD: "$", EUR: "€" }[i] || i), F = (a) => a ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(a)) : "—", U = {
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
}, ne = {
  1: "Kurum",
  2: "Banka / finans",
  3: "Müşteri",
  4: "Denetçi · YMM",
  5: "İç kullanım"
};
function le({ projectId: a, template: i }) {
  const [t, l] = r.useState(null), [p, m] = r.useState(""), [u, f] = r.useState(!1), z = r.useCallback(async () => {
    if (!a) {
      l(null);
      return;
    }
    f(!0);
    try {
      l(await ee(a, i == null ? void 0 : i.id, p));
    } catch (c) {
      g("error", "Önizleme üretilemedi."), console.error("[ReportBuilder] preview", c);
    } finally {
      f(!1);
    }
  }, [a, i == null ? void 0 : i.id, p]);
  if (r.useEffect(() => {
    z();
  }, [z]), !a)
    return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx(
      L,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-eye" }),
        title: "Proje bağlamı gerekiyor",
        description: "Önizleme gerçek veriyle üretilir; üstteki listeden bir proje seçin."
      }
    ) });
  if (u) return /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx(R, { rows: 6 }) });
  if (!t) return null;
  const y = t.summary;
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
      /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: [
        t.projectName,
        t.templateName && /* @__PURE__ */ e.jsxs("span", { style: { fontWeight: 400, color: "var(--apya-text-tertiary)" }, children: [
          " · ",
          t.templateName
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            className: "apya-doc-input",
            style: { width: 110 },
            placeholder: "Dönem (ops.)",
            value: p,
            onChange: (c) => m(c.target.value),
            "aria-label": "Dönem kodu"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "a",
          {
            className: "apya-doc-linkbtn",
            target: "_blank",
            rel: "noreferrer",
            href: ae(a, i == null ? void 0 : i.id, p),
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
        /* @__PURE__ */ e.jsx("div", { className: "apya-numeric apya-doc-kpi-value", style: { fontSize: 16 }, children: $(y.documentedAmount, y.currency) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline", children: [
      "Çıktıya girecek bölümler (",
      t.sections.length,
      ")"
    ] }),
    t.sections.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Açık bölüm yok — Bölümler sekmesinden en az bir tane açın." }) : /* @__PURE__ */ e.jsx("div", { className: "d-flex flex-wrap gap-1 mb-3", children: t.sections.map((c, j) => /* @__PURE__ */ e.jsxs(C, { variant: "neutral", size: "sm", children: [
      j + 1,
      ". ",
      U[c] ?? c
    ] }, `${c}-${j}`)) }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline", children: [
      "Ekler (",
      t.annexes.length,
      t.truncatedAnnexCount > 0 && ` · +${t.truncatedAnnexCount} gösterilmiyor`,
      ")"
    ] }),
    t.annexes.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu projede henüz belge yok; ek dizini boş çıkacak." }) : t.annexes.slice(0, 12).map((c) => /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "apya-doc-check-row",
        style: { gridTemplateColumns: "60px minmax(0,1fr) 90px 110px" },
        children: [
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric", style: { fontSize: 11 }, children: c.annexNumber }),
          /* @__PURE__ */ e.jsx("span", { className: "text-truncate", style: { fontSize: 12.5 }, children: c.documentName }),
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: c.typeName ?? "—" }),
          /* @__PURE__ */ e.jsx("span", { className: "apya-numeric text-end", style: { fontSize: 11.5 }, children: c.amount != null ? $(c.amount) : F(c.documentDate) })
        ]
      },
      c.annexNumber + c.documentName
    )),
    t.missingDocuments.length > 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mt-3", children: [
        "Eksik belgeler (",
        t.missingDocuments.length,
        ")"
      ] }),
      t.missingDocuments.slice(0, 10).map((c, j) => /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 12, padding: "3px 0" }, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation", style: { color: "var(--apya-warning-500)" } }),
        " ",
        c
      ] }, j))
    ] })
  ] });
}
function re({ projectId: a }) {
  const [i, t] = r.useState([]), [l, p] = r.useState(null), [m, u] = r.useState([]), [f, z] = r.useState(null), [y, c] = r.useState(!1), [j, w] = r.useState(!1), T = r.useCallback(async () => {
    if (!a) {
      t([]);
      return;
    }
    c(!0);
    try {
      t(await se(a) ?? []);
    } catch (n) {
      g("error", "Paketler yüklenemedi."), console.error("[ReportBuilder] packages", n);
    } finally {
      c(!1);
    }
  }, [a]);
  r.useEffect(() => {
    T();
  }, [T]);
  const b = async (n) => {
    p(n), z(null);
    try {
      u(await B(n.id) ?? []);
    } catch (S) {
      console.error("[ReportBuilder] shareLinks", S);
    }
  }, N = async (n) => {
    if (l) {
      w(!0);
      try {
        const S = await te({
          targetType: 1,
          // DeliveryPackage
          targetId: l.id,
          lifetimeDays: 30,
          allowDownload: n,
          watermark: null
        });
        z(S), u(await B(l.id) ?? []);
      } catch {
        g("error", "Paylaşım linki oluşturulamadı.");
      } finally {
        w(!1);
      }
    }
  }, h = async (n) => {
    w(!0);
    try {
      await ie(n), u(await B(l.id) ?? []);
    } catch {
      g("error", "Link iptal edilemedi.");
    } finally {
      w(!1);
    }
  };
  return a ? y ? /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx(R, { rows: 5 }) }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
      /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: "Üretilmiş paketler" }),
      /* @__PURE__ */ e.jsx(
        "a",
        {
          className: "apya-doc-linkbtn",
          href: `${D()}Documents/Deliveries?projectId=${a}`,
          children: "Teslimler ekranı"
        }
      )
    ] }),
    i.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu projede paket yok. Dağıtmak için önce Teslimler ekranından bir paket üretin." }) : i.map((n) => /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        className: `apya-md-item${(l == null ? void 0 : l.id) === n.id ? " selected" : ""}`,
        style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 },
        onClick: () => b(n),
        children: [
          /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1, textAlign: "left" }, children: [
            /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: n.name }),
            /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
              n.reportTemplateName ?? "şablonsuz",
              n.periodCode && ` · ${n.periodCode}`
            ] })
          ] }),
          /* @__PURE__ */ e.jsx(C, { variant: n.status === 2 ? "positive" : n.status === 3 ? "accent" : "neutral", size: "sm", children: n.status === 2 ? "üretildi" : n.status === 3 ? "gönderildi" : "taslak" })
        ]
      },
      n.id
    )),
    l && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-md-overline mt-3", children: [
        "Paylaşım linkleri · ",
        l.name
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "d-flex gap-2 mb-2", children: [
        /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", disabled: j, onClick: () => N(!1), children: "Salt görüntüleme linki" }),
        /* @__PURE__ */ e.jsx(E, { variant: "outline", size: "sm", disabled: j, onClick: () => N(!0), children: "İndirmeye açık link" })
      ] }),
      f && /* @__PURE__ */ e.jsxs("div", { style: {
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
          D(),
          "Share/",
          f.token
        ] })
      ] }),
      m.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Bu pakette link yok." }) : m.map((n) => /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "apya-doc-check-row",
          style: { gridTemplateColumns: "minmax(0,1fr) 110px 90px 70px" },
          children: [
            /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 12 }, children: [
              n.allowDownload ? "İndirilebilir" : "Salt görüntüleme",
              n.isRevoked && /* @__PURE__ */ e.jsx(C, { variant: "negative", size: "sm", children: "iptal" })
            ] }),
            /* @__PURE__ */ e.jsxs("span", { style: { fontSize: 11, color: "var(--apya-text-tertiary)" }, children: [
              F(n.expiresAt),
              " bitiyor"
            ] }),
            /* @__PURE__ */ e.jsxs("span", { className: "apya-numeric", style: { fontSize: 11 }, children: [
              n.accessCount ?? 0,
              " erişim"
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "text-end", children: !n.isRevoked && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: j,
                onClick: () => h(n.id),
                children: "İptal"
              }
            ) })
          ]
        },
        n.id
      ))
    ] })
  ] }) : /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: /* @__PURE__ */ e.jsx(
    L,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-share-nodes" }),
      title: "Proje bağlamı gerekiyor",
      description: "Dağıtım üretilmiş paketler üzerinden yürür; üstteki listeden bir proje seçin."
    }
  ) });
}
const W = (...a) => a.filter(Boolean).join(" "), ce = [
  { key: "sections", label: "Bölümler" },
  { key: "preview", label: "Önizleme" },
  { key: "distribution", label: "Dağıtım" }
];
function oe({ section: a, onToggle: i, onMove: t, isFirst: l, isLast: p, busy: m }) {
  const u = U[a.sectionKey] ?? `Bölüm ${a.sectionKey}`;
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-row", style: { gridTemplateColumns: "34px minmax(0,1fr) auto auto" }, children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "checkbox",
        checked: a.isEnabled,
        disabled: m || !a.isAvailable,
        onChange: (f) => i(a.id, f.target.checked),
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
          disabled: m || l,
          onClick: () => t(a.id, -1),
          "aria-label": "Yukarı taşı",
          children: "↑"
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "apya-doc-linkbtn",
          disabled: m || p,
          onClick: () => t(a.id, 1),
          "aria-label": "Aşağı taşı",
          children: "↓"
        }
      )
    ] })
  ] });
}
function de() {
  const a = new URLSearchParams(window.location.search), [i, t] = r.useState([]), [l, p] = r.useState([]), [m, u] = r.useState(null), [f, z] = r.useState(a.get("projectId") || ""), [y, c] = r.useState("sections"), [j, w] = r.useState(!0), [T, b] = r.useState(!1), N = r.useCallback(async () => {
    w(!0);
    try {
      const [s, o] = await Promise.all([Z(), X()]);
      t(s ?? []), p(o ?? []), u((d) => {
        var x;
        return d ?? ((x = s == null ? void 0 : s[0]) == null ? void 0 : x.id) ?? null;
      });
    } catch (s) {
      g("error", "Şablonlar yüklenemedi."), console.error("[ReportBuilder] load", s);
    } finally {
      w(!1);
    }
  }, []);
  r.useEffect(() => {
    N();
  }, [N]);
  const h = r.useMemo(
    () => i.find((s) => s.id === m) ?? null,
    [i, m]
  ), n = r.useMemo(
    () => h ? [...h.sections].sort((s, o) => s.order - o.order) : [],
    [h]
  ), S = async (s) => {
    if (h) {
      b(!0);
      try {
        const o = await H({
          templateId: h.id,
          sections: s.map((d, x) => ({ sectionId: d.id, order: x + 1, isEnabled: d.isEnabled }))
        });
        t((d) => d.map((x) => x.id === o.id ? o : x));
      } catch (o) {
        g("error", "Bölümler kaydedilemedi."), console.error("[ReportBuilder] persistSections", o);
      } finally {
        b(!1);
      }
    }
  }, I = (s, o) => S(n.map((d) => d.id === s ? { ...d, isEnabled: o } : d)), K = (s, o) => {
    const d = [...n], x = d.findIndex((_) => _.id === s), P = x + o;
    x < 0 || P < 0 || P >= d.length || ([d[x], d[P]] = [d[P], d[x]], S(d));
  }, O = async () => {
    const s = window.prompt("Şablon adı:");
    if (s) {
      b(!0);
      try {
        const o = await J({ name: s, recipient: 1, issuer: null, order: i.length + 1 });
        await N(), u(o.id);
      } catch {
        g("error", "Şablon oluşturulamadı.");
      } finally {
        b(!1);
      }
    }
  }, Y = async (s) => {
    b(!0);
    try {
      const o = await Q(s);
      await N(), u(o.id);
    } catch {
      g("error", "Şablon kopyalanamadı.");
    } finally {
      b(!1);
    }
  }, G = async (s) => {
    if (window.confirm("Bu şablon silinsin mi? Üretilmiş paketler etkilenmez.")) {
      b(!0);
      try {
        await V(s), u(null), await N();
      } catch {
        g("error", "Şablon silinemedi.");
      } finally {
        b(!1);
      }
    }
  };
  return j ? /* @__PURE__ */ e.jsx("div", { className: "p-4", children: /* @__PURE__ */ e.jsx(R, { rows: 8 }) }) : /* @__PURE__ */ e.jsxs("div", { className: "apya-fade-in px-4 py-4 sm:px-7 sm:py-7 mx-auto", style: { maxWidth: 1560 }, children: [
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
            value: f,
            onChange: (s) => z(s.target.value),
            "aria-label": "Proje bağlamı",
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "Proje seçin…" }),
              l.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.id, children: s.code ? `${s.code} · ${s.name}` : s.name }, s.id))
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(E, { variant: "outline", size: "sm", disabled: T, onClick: O, children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus" }),
          " Yeni şablon"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "apya-doc-tabs mb-3", role: "tablist", children: ce.map((s) => /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": y === s.key,
        className: W("apya-doc-tab", y === s.key && "active"),
        onClick: () => c(s.key),
        children: s.label
      },
      s.key
    )) }),
    /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-reportgrid", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-card", children: [
        /* @__PURE__ */ e.jsx("div", { className: "apya-md-overline", children: "Şablonlar" }),
        i.length === 0 ? /* @__PURE__ */ e.jsx("div", { style: { fontSize: 12, color: "var(--apya-text-tertiary)" }, children: "Şablon yok." }) : i.map((s) => /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: W("apya-md-item", m === s.id && "selected"),
            style: { borderRadius: 8, height: "auto", paddingTop: 7, paddingBottom: 7 },
            onClick: () => u(s.id),
            children: [
              /* @__PURE__ */ e.jsxs("span", { style: { minWidth: 0, flex: 1, textAlign: "left" }, children: [
                /* @__PURE__ */ e.jsx("span", { className: "d-block text-truncate", style: { fontSize: 12.5, fontWeight: 500 }, children: s.name }),
                /* @__PURE__ */ e.jsxs("span", { className: "d-block", style: { fontSize: 10.5, color: "var(--apya-text-tertiary)" }, children: [
                  ne[s.recipient] ?? "—",
                  s.issuer && ` · ${s.issuer}`
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("span", { className: "d-flex align-items-center gap-1", children: [
                s.isSystem && /* @__PURE__ */ e.jsx(C, { variant: "neutral", size: "sm", children: "sistem" }),
                /* @__PURE__ */ e.jsx(C, { variant: "accent", size: "sm", children: s.enabledSectionCount })
              ] })
            ]
          },
          s.id
        ))
      ] }),
      y === "sections" && /* @__PURE__ */ e.jsx("div", { className: "apya-doc-check-card", children: h ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "apya-doc-check-head", children: [
          /* @__PURE__ */ e.jsx("span", { style: { fontSize: 13.5, fontWeight: 600 }, children: h.name }),
          /* @__PURE__ */ e.jsxs("span", { className: "d-flex gap-2", children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: T,
                onClick: () => Y(h.id),
                children: "Kopyala"
              }
            ),
            !h.isSystem && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "apya-doc-linkbtn",
                disabled: T,
                onClick: () => G(h.id),
                children: "Sil"
              }
            )
          ] })
        ] }),
        h.isSystem && /* @__PURE__ */ e.jsxs("div", { style: { fontSize: 11.5, color: "var(--apya-text-tertiary)", marginBottom: 6 }, children: [
          "Sistem şablonu tüm kiracılarda paylaşılır; künyesi düzenlenemez. Kendinize uyarlamak için ",
          /* @__PURE__ */ e.jsx("strong", { children: "Kopyala" }),
          "'yı kullanın."
        ] }),
        n.map((s, o) => /* @__PURE__ */ e.jsx(
          oe,
          {
            section: s,
            busy: T,
            isFirst: o === 0,
            isLast: o === n.length - 1,
            onToggle: I,
            onMove: K
          },
          s.id
        ))
      ] }) : /* @__PURE__ */ e.jsx(
        L,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check" }),
          title: "Şablon seçin",
          description: "Soldan bir şablon seçerek bölümlerini düzenleyin."
        }
      ) }),
      y === "preview" && /* @__PURE__ */ e.jsx(le, { projectId: f, template: h }),
      y === "distribution" && /* @__PURE__ */ e.jsx(re, { projectId: f })
    ] })
  ] });
}
const M = document.getElementById("report-builder-island");
M && q(M).render(/* @__PURE__ */ e.jsx(de, {}));
