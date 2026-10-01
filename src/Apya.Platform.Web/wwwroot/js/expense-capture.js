import { j as e, r as u, d as Q, b as pe } from "./react-vendor-D57GAUXd.js";
import { u as be, B, c as D, S as K, b as U, e as ye, M as ve, I as _, a as Y, T as je } from "./Dialog-Bky2XNdc.js";
import { a as ke } from "./QueryProvider-CMEXdgTM.js";
import { u as ce, r as we, T as Ce } from "./registerServiceWorker-MivfkJsD.js";
import { C as Se } from "./Combobox-D5mSMyzC.js";
import { t as N } from "./i18n-DkhYld-7.js";
import { u as ue, b as de } from "./query-vendor-Bf69L2iP.js";
import { a as F } from "./httpClient-DePjXdo1.js";
import { i as Ne, s as me } from "./permanentRejection-SvaBclz0.js";
/* empty css               */
const Le = {
  light: { key: "Theme:Light", fallback: "Açık tema (Sıradaki: Koyu)" },
  dark: { key: "Theme:Dark", fallback: "Koyu tema (Sıradaki: Sistem)" },
  system: { key: "Theme:System", fallback: "Sistem teması (Sıradaki: Açık)" }
};
function Me({ className: t = "" }) {
  const { preference: n, toggle: r } = be(), i = Le[n], a = i ? N(i.key, i.fallback) : N("Theme:Toggle", "Tema değiştir");
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: r,
      "aria-label": a,
      title: a,
      className: [
        "inline-flex items-center justify-center",
        "h-10 w-10 rounded-md",
        "bg-surface-raised text-text-secondary",
        "border border-default",
        "hover:bg-surface-elevated hover:text-text-primary",
        "focus-visible:outline-none focus-visible:shadow-focus",
        "transition-colors duration-fast ease-standard",
        t
      ].join(" "),
      children: [
        n === "light" && /* @__PURE__ */ e.jsx(Ee, {}),
        n === "dark" && /* @__PURE__ */ e.jsx(Te, {}),
        n === "system" && /* @__PURE__ */ e.jsx(Ie, {})
      ]
    }
  );
}
function Ee() {
  return /* @__PURE__ */ e.jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.75",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ e.jsx("circle", { cx: "12", cy: "12", r: "4" }),
        /* @__PURE__ */ e.jsx("path", { d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" })
      ]
    }
  );
}
function Te() {
  return /* @__PURE__ */ e.jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.75",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: /* @__PURE__ */ e.jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" })
    }
  );
}
function Ie() {
  return /* @__PURE__ */ e.jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.75",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ e.jsx("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", ry: "2" }),
        /* @__PURE__ */ e.jsx("path", { d: "M8 21h8M12 17v4" })
      ]
    }
  );
}
function Ae({ onFile: t }) {
  const n = u.useRef(null), [r, i] = Q.useState(!1), a = ce(), l = u.useCallback(() => {
    var s;
    return (s = n.current) == null ? void 0 : s.click();
  }, []), d = u.useCallback((s) => {
    if (s) {
      if (!s.type.startsWith("image/")) {
        a.error("Resim dosyası gerekli", {
          description: "Lütfen JPG/PNG/HEIC fatura görseli seç."
        });
        return;
      }
      if (s.size > 10 * 1024 * 1024) {
        a.error("Dosya çok büyük", {
          description: "En fazla 10 MB. Lütfen daha düşük çözünürlükte çek."
        });
        return;
      }
      t(s);
    }
  }, [t, a]);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "button",
      tabIndex: 0,
      "aria-label": "Faturayı çek — kamerayı aç ya da görüntü sürükle",
      onClick: l,
      onKeyDown: (s) => {
        (s.key === "Enter" || s.key === " ") && (s.preventDefault(), l());
      },
      onDragOver: (s) => {
        s.preventDefault(), i(!0);
      },
      onDragLeave: () => i(!1),
      onDrop: (s) => {
        var p;
        s.preventDefault(), i(!1), d((p = s.dataTransfer.files) == null ? void 0 : p[0]);
      },
      className: D(
        "flex flex-col items-center justify-center gap-4",
        "border-2 border-dashed rounded-xl p-8",
        "min-h-[60vh] mobile:min-h-[50vh]",
        "cursor-pointer select-none",
        "transition-colors duration-fast",
        "focus-visible:outline-none focus-visible:shadow-focus",
        r ? "border-brand-500 bg-brand-50" : "border-default bg-surface-raised hover:border-strong"
      ),
      children: [
        /* @__PURE__ */ e.jsx(Oe, {}),
        /* @__PURE__ */ e.jsxs("div", { className: "text-center max-w-xs pointer-events-none", children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-base font-semibold text-text-primary", children: "Faturayı çek" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-secondary mt-1", children: "Mobilde direkt kamera açılır. Masaüstünde dosya sürükle ya da tıkla. AI tutarı, tarihi ve tedarikçiyi otomatik okur." })
        ] }),
        /* @__PURE__ */ e.jsx(
          B,
          {
            size: "lg",
            variant: "primary",
            onClick: (s) => {
              s.stopPropagation(), l();
            },
            className: "min-w-[220px]",
            children: "Kamerayı Aç"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            ref: n,
            type: "file",
            accept: "image/*",
            capture: "environment",
            className: "sr-only",
            onChange: (s) => {
              var p;
              return d((p = s.target.files) == null ? void 0 : p[0]);
            }
          }
        )
      ]
    }
  );
}
function Oe() {
  return /* @__PURE__ */ e.jsxs(
    "svg",
    {
      width: "56",
      height: "56",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: "text-text-tertiary",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ e.jsx("path", { d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" }),
        /* @__PURE__ */ e.jsx("circle", { cx: "12", cy: "13", r: "4" })
      ]
    }
  );
}
const Re = [
  "Görüntü temizleniyor...",
  "Metin tanınıyor (OCR)...",
  "Alanlar çıkartılıyor..."
];
function ze({ previewUrl: t }) {
  const [n, r] = Q.useState(0);
  return Q.useEffect(() => {
    const i = setTimeout(() => r(1), 350), a = setTimeout(() => r(2), 800);
    return () => {
      clearTimeout(i), clearTimeout(a);
    };
  }, []), /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-4 p-6", children: [
    t && /* @__PURE__ */ e.jsx(
      "img",
      {
        src: t,
        alt: "Çekilen fatura",
        className: "max-h-48 rounded-md border border-default object-contain"
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "w-full max-w-xs flex flex-col gap-2", children: Re.map((i, a) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
      a < n && /* @__PURE__ */ e.jsx(De, {}),
      a === n && /* @__PURE__ */ e.jsx(Be, {}),
      a > n && /* @__PURE__ */ e.jsx(qe, {}),
      /* @__PURE__ */ e.jsx("span", { className: a <= n ? "text-text-primary" : "text-text-tertiary", children: i })
    ] }, a)) }),
    /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-xs flex flex-col gap-2 mt-2", children: [
      /* @__PURE__ */ e.jsx(K, { height: 12 }),
      /* @__PURE__ */ e.jsx(K, { height: 12, className: "w-3/4" }),
      /* @__PURE__ */ e.jsx(K, { height: 12, className: "w-1/2" })
    ] })
  ] });
}
const De = () => /* @__PURE__ */ e.jsx(
  "svg",
  {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "text-positive-500 flex-none",
    children: /* @__PURE__ */ e.jsx("path", { d: "M20 6 9 17l-5-5" })
  }
), Be = () => /* @__PURE__ */ e.jsx(
  "svg",
  {
    className: "animate-spin text-brand-500 flex-none",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    children: /* @__PURE__ */ e.jsx("path", { d: "M21 12a9 9 0 1 1-6.219-8.56", strokeLinecap: "round" })
  }
), qe = () => /* @__PURE__ */ e.jsx("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-neutral-300 mx-[2px] flex-none", "aria-hidden": "true" }), ae = {
  sm: { dot: "h-1 w-1", gap: "gap-0.5" },
  md: { dot: "h-1.5 w-1.5", gap: "gap-0.5" },
  lg: { dot: "h-2 w-2", gap: "gap-1" }
};
function fe(t) {
  return typeof t != "number" || !Number.isFinite(t) ? 0 : t > 1 ? Math.max(0, Math.min(100, t)) / 100 : Math.max(0, Math.min(1, t));
}
function xe(t) {
  return t >= 0.85 ? { dots: 5, label: N("Ai:Confidence:VeryHigh", "Çok yüksek güven") } : t >= 0.7 ? { dots: 4, label: N("Ai:Confidence:High", "Yüksek güven") } : t >= 0.5 ? { dots: 3, label: N("Ai:Confidence:Medium", "Orta güven") } : t >= 0.3 ? { dots: 2, label: N("Ai:Confidence:Low", "Düşük güven") } : { dots: 1, label: N("Ai:Confidence:VeryLow", "Çok düşük güven") };
}
function G({ score: t, label: n, size: r = "md", showLabel: i = !0, className: a }) {
  const l = fe(t), d = xe(l), s = ae[r] ?? ae.md, p = n ?? d.label, c = Math.round(l * 100);
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: D("inline-flex items-center gap-1 text-xs text-text-tertiary", a),
      title: `${d.label} (%${c})`,
      children: [
        /* @__PURE__ */ e.jsx("span", { className: D("inline-flex items-center", s.gap), "aria-hidden": "true", children: Array.from({ length: 5 }, (b, C) => /* @__PURE__ */ e.jsx(
          "span",
          {
            className: D(
              "inline-block rounded-full",
              s.dot,
              C < d.dots ? "bg-ai-500" : "bg-neutral-200"
            )
          },
          C
        )) }),
        i && /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: p }),
        /* @__PURE__ */ e.jsxs("span", { className: "sr-only", children: [
          "Güven düzeyi: ",
          d.label,
          " (%",
          c,
          ")"
        ] })
      ]
    }
  );
}
G.bandFor = xe;
G.normalize = fe;
const se = (t) => new Promise((n) => setTimeout(n, t)), ie = [
  { vendor: "Migros A.Ş.", category: "4" },
  // Malzeme / Sarf
  { vendor: "BSH Ev Aletleri", category: "4" },
  // Malzeme / Sarf
  { vendor: "Türk Telekom", category: "5" },
  // Hizmet
  { vendor: "JetBrains s.r.o.", category: "5" },
  // Hizmet
  { vendor: "Lufthansa", category: "2" }
  // Seyahat / Ulaşım
];
function z(t, n) {
  const r = (n * 9301 + 49297) % 233280 / 233280;
  return Math.min(0.99, Math.max(0.4, t + (r - 0.5) * 0.2));
}
const Fe = {
  async ocr(t) {
    var a;
    await se(900 + Math.random() * 600);
    const n = t.size + (((a = t.name) == null ? void 0 : a.length) || 0), r = ie[n % ie.length], i = Math.round((50 + n % 5e5 / 100) * 100) / 100;
    return {
      confidence: z(0.8, n),
      fields: {
        amount: { value: i, confidence: z(0.92, n + 1) },
        currency: { value: "TRY", confidence: 0.99 },
        date: { value: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), confidence: z(0.86, n + 2) },
        vendor: { value: r.vendor, confidence: z(0.65, n + 3) },
        category: { value: r.category, confidence: z(0.58, n + 4) },
        taxRate: { value: 20, confidence: 0.95 }
      },
      rawText: `${r.vendor}
Tutar: ${i.toFixed(2)} TL
KDV %20`
    };
  },
  async submit(t) {
    if (await se(600), !(t != null && t.amount) || t.amount <= 0) {
      const n = new Error("Tutar geçersiz.");
      throw n.status = 400, n;
    }
    return {
      id: "exp-" + Math.random().toString(36).slice(2, 9),
      ...t,
      status: "submitted",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
}, T = 0.7, Pe = [
  { value: "0", label: "Genel / Diğer" },
  { value: "1", label: "Ofis / Kira" },
  { value: "2", label: "Seyahat / Ulaşım" },
  { value: "3", label: "Personel / Maaş" },
  { value: "4", label: "Malzeme / Sarf" },
  { value: "5", label: "Hizmet / Danışmanlık" },
  { value: "6", label: "Vergi / Harç" }
], Ke = ["TRY", "USD", "EUR"], $ = [
  "block w-full min-h-[44px] rounded-md border border-default bg-surface-base text-text-primary",
  "px-3 py-2 text-sm",
  "focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus"
].join(" ");
function Ue({
  open: t,
  onOpenChange: n,
  ocrResult: r,
  onSubmit: i,
  isSubmitting: a,
  context: l,
  lines: d,
  onProjectChange: s,
  isOffline: p
}) {
  var R, E, V, J, Z, X, ee, te, ne;
  const [c, b] = u.useState(() => oe(r)), [C, A] = u.useState(!1), v = u.useRef(null);
  u.useEffect(() => {
    b(oe(r));
  }, [r]), u.useEffect(() => {
    if (!t || !(r != null && r.fields)) return;
    const o = setTimeout(() => {
      var m, S;
      return (S = (m = v.current) == null ? void 0 : m.focus) == null ? void 0 : S.call(m);
    }, 80);
    return () => clearTimeout(o);
  }, [t, r]);
  const x = u.useMemo(
    () => (r == null ? void 0 : r.fields) ?? {},
    [r]
  ), h = u.useMemo(() => {
    var m;
    const o = ["vendor", "category", "date", "amount"];
    for (const S of o) {
      const re = (m = x[S]) == null ? void 0 : m.confidence;
      if (re != null && re < T) return S;
    }
    return null;
  }, [x]), j = (o) => (m) => b((S) => ({ ...S, [o]: m != null && m.target ? m.target.value : m })), L = !!(d != null && d.requiresBudgetLine), P = !c.cashAccountId || L && !c.budgetLineId, O = async (o) => {
    if (o.preventDefault(), a || P) return;
    const m = {
      ...c,
      amount: typeof c.amount == "number" ? c.amount : parseFloat(c.amount),
      taxRate: typeof c.taxRate == "number" ? c.taxRate : parseFloat(c.taxRate)
    };
    await i(m);
  }, M = (r == null ? void 0 : r.confidence) ?? 0, f = M >= 0.85 ? "Yüksek güven" : M >= 0.65 ? "Orta güven" : "Düşük güven — kontrol edin", g = M >= 0.85 ? "positive" : M >= 0.65 ? "warning" : "critical";
  return /* @__PURE__ */ e.jsx(U, { open: t, onOpenChange: n, children: /* @__PURE__ */ e.jsx(U.Content, { title: "Masraf detayları", description: "AI tarafından okunan tutarları doğrulayın ve gönderin", children: /* @__PURE__ */ e.jsxs("form", { onSubmit: O, className: "flex flex-col flex-1 min-h-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "px-4 pt-2 pb-3 border-b border-subtle flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-semibold", children: "Masraf Detayları" }),
      /* @__PURE__ */ e.jsx(ye, { variant: g, size: "sm", withDot: !0, children: f })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4", children: [
      p && /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-warning bg-warning-subtle px-3 py-2 text-[12.5px] text-warning", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-wifi-slash mr-1.5" }),
        "Bağlantı yok — kayıt ",
        /* @__PURE__ */ e.jsx("strong", { children: "cihazda saklanır" }),
        ", bağlantı gelince gönderilir. Fotoğraf kuyruğa girmez; kayıt belgesiz oluşur."
      ] }),
      /* @__PURE__ */ e.jsx(k, { label: "Proje", children: /* @__PURE__ */ e.jsxs(
        "select",
        {
          className: $,
          value: c.projectId || "",
          onChange: (o) => {
            j("projectId")(o), s == null || s(o.target.value);
          },
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "— Projesiz —" }),
            ((l == null ? void 0 : l.projects) ?? []).map((o) => /* @__PURE__ */ e.jsx("option", { value: o.id, children: o.name }, o.id))
          ]
        }
      ) }),
      c.projectId && (((R = d == null ? void 0 : d.lines) == null ? void 0 : R.length) ?? 0) > 0 && /* @__PURE__ */ e.jsx(k, { label: "Bütçe kalemi", required: L, children: /* @__PURE__ */ e.jsxs(
        "select",
        {
          className: $,
          value: c.budgetLineId || "",
          onChange: j("budgetLineId"),
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "— Kalem seçin —" }),
            d.lines.map((o) => /* @__PURE__ */ e.jsx("option", { value: o.id, children: o.label }, o.id))
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(k, { label: "Kasa / banka", required: !0, children: /* @__PURE__ */ e.jsxs(
        "select",
        {
          className: $,
          value: c.cashAccountId || "",
          onChange: j("cashAccountId"),
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "— Kasa seçin —" }),
            ((l == null ? void 0 : l.accounts) ?? []).map((o) => /* @__PURE__ */ e.jsxs("option", { value: o.id, children: [
              o.name,
              " (",
              o.currency,
              ")"
            ] }, o.id))
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(k, { label: "Tutar", required: !0, confidence: (E = x.amount) == null ? void 0 : E.confidence, children: /* @__PURE__ */ e.jsx(
        ve,
        {
          ref: h === "amount" ? v : void 0,
          value: c.amount,
          onValueChange: (o) => b((m) => ({ ...m, amount: o ?? "" })),
          currency: c.currency,
          currencies: Ke,
          onCurrencyChange: (o) => b((m) => ({ ...m, currency: o })),
          size: "lg",
          invalid: ((V = x.amount) == null ? void 0 : V.confidence) < T,
          required: !0,
          min: 0.01
        }
      ) }),
      /* @__PURE__ */ e.jsx(k, { label: "Tarih", required: !0, confidence: (J = x.date) == null ? void 0 : J.confidence, children: /* @__PURE__ */ e.jsx(
        _,
        {
          ref: h === "date" ? v : void 0,
          type: "date",
          required: !0,
          size: "lg",
          value: c.date,
          onChange: j("date"),
          invalid: ((Z = x.date) == null ? void 0 : Z.confidence) < T
        }
      ) }),
      /* @__PURE__ */ e.jsx(k, { label: "Tedarikçi", required: !0, confidence: (X = x.vendor) == null ? void 0 : X.confidence, children: /* @__PURE__ */ e.jsx(
        _,
        {
          ref: h === "vendor" ? v : void 0,
          type: "text",
          required: !0,
          size: "lg",
          value: c.vendor,
          onChange: j("vendor"),
          invalid: ((ee = x.vendor) == null ? void 0 : ee.confidence) < T,
          placeholder: "örn. Migros A.Ş."
        }
      ) }),
      /* @__PURE__ */ e.jsx(k, { label: "Kategori", confidence: (te = x.category) == null ? void 0 : te.confidence, children: /* @__PURE__ */ e.jsx(
        Se,
        {
          options: Pe,
          value: c.category,
          onChange: (o) => b((m) => ({ ...m, category: o })),
          invalid: ((ne = x.category) == null ? void 0 : ne.confidence) < T,
          placeholder: "Kategori seç"
        }
      ) }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => A((o) => !o),
          className: "self-start text-sm text-text-link hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
          children: C ? "Daha az alan" : "Daha fazla alan"
        }
      ),
      C && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(k, { label: "KDV Oranı (%)", children: /* @__PURE__ */ e.jsx(
          _,
          {
            type: "number",
            step: "0.1",
            value: c.taxRate,
            onChange: j("taxRate"),
            className: "font-tabular"
          }
        ) }),
        /* @__PURE__ */ e.jsx(k, { label: "Not", children: /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: c.note,
            onChange: j("note"),
            className: D(
              "block w-full rounded-md border border-default bg-surface-base text-text-primary",
              "px-3 py-2 text-sm resize-none",
              "focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus",
              "placeholder:text-text-tertiary"
            )
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("footer", { className: "px-4 py-3 border-t border-subtle bg-surface-sunken flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "text-sm text-text-tertiary", children: [
        "Toplam:",
        " ",
        /* @__PURE__ */ e.jsx("span", { className: "font-tabular font-semibold text-text-primary", children: typeof c.amount == "number" && c.amount > 0 ? Y(c.amount, c.currency) : "—" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ e.jsx(U.Close, { asChild: !0, children: /* @__PURE__ */ e.jsx(B, { type: "button", variant: "ghost", size: "md", children: "İptal" }) }),
        /* @__PURE__ */ e.jsx(
          B,
          {
            type: "submit",
            variant: "primary",
            size: "md",
            isLoading: a,
            loadingText: "Gönderiliyor...",
            children: "Gönder"
          }
        )
      ] })
    ] })
  ] }) }) });
}
function k({ label: t, required: n, confidence: r, children: i }) {
  const a = r != null && r < 0.95, l = r != null && r < T;
  return /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "text-sm font-medium text-text-secondary", children: [
        t,
        n && /* @__PURE__ */ e.jsx("span", { className: "text-text-negative ml-0.5", children: "*" })
      ] }),
      a && /* @__PURE__ */ e.jsx(G, { score: r, showLabel: !1, size: "sm" })
    ] }),
    i,
    l && /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-warning", children: "AI bu alandan emin değil — doğrula." })
  ] });
}
function oe(t) {
  var r, i, a, l, d, s;
  const n = (t == null ? void 0 : t.fields) ?? {};
  return {
    amount: ((r = n.amount) == null ? void 0 : r.value) ?? "",
    currency: ((i = n.currency) == null ? void 0 : i.value) ?? "TRY",
    date: ((a = n.date) == null ? void 0 : a.value) ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    vendor: ((l = n.vendor) == null ? void 0 : l.value) ?? "",
    category: ((d = n.category) == null ? void 0 : d.value) ?? "",
    taxRate: ((s = n.taxRate) == null ? void 0 : s.value) ?? 20,
    note: ""
  };
}
function _e({ result: t, onAddAnother: n, onClose: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center justify-center gap-4 py-12 px-6 text-center", children: [
    /* @__PURE__ */ e.jsx($e, {}),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-xl font-semibold text-text-primary", children: "Masraf gönderildi" }),
      /* @__PURE__ */ e.jsxs("p", { className: "text-sm text-text-secondary mt-1", children: [
        (t == null ? void 0 : t.amount) && Y(t.amount, t.currency || "TRY"),
        (t == null ? void 0 : t.vendor) && ` · ${t.vendor}`
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary mt-1", children: "Onaya gitti. Bildirim ile durumu takip edebilirsin." })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 w-full max-w-xs", children: [
      /* @__PURE__ */ e.jsx(B, { variant: "primary", size: "lg", onClick: n, children: "Bir tane daha çek" }),
      /* @__PURE__ */ e.jsx(B, { variant: "ghost", size: "md", onClick: r, children: "Bitir" })
    ] })
  ] });
}
const $e = () => /* @__PURE__ */ e.jsxs(
  "svg",
  {
    width: "64",
    height: "64",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "text-positive-500",
    "aria-hidden": "true",
    children: [
      /* @__PURE__ */ e.jsx("circle", { cx: "12", cy: "12", r: "10" }),
      /* @__PURE__ */ e.jsx("path", { d: "m9 12 2 2 4-4" })
    ]
  }
);
async function He() {
  const [t, n] = await Promise.all([
    F.get("/api/app/project?MaxResultCount=200&Sorting=name"),
    F.get("/api/app/cash-account?MaxResultCount=100")
  ]);
  return {
    projects: ((t == null ? void 0 : t.items) ?? []).map((r) => ({ id: r.id, name: r.name, currency: r.currency })),
    accounts: ((n == null ? void 0 : n.items) ?? []).map((r) => ({ id: r.id, name: r.name, currency: r.currency }))
  };
}
async function Qe(t) {
  if (!t)
    return { lines: [], requiresBudgetLine: !1 };
  const n = await F.get(`/api/app/project-budget/record-form-lookup/${t}`);
  return {
    lines: ((n == null ? void 0 : n.lines) ?? []).map((r) => ({
      id: r.id,
      label: r.code ? `${r.code} · ${r.name}` : r.name,
      remaining: r.remainingAmount
    })),
    requiresBudgetLine: !!(n != null && n.requiresBudgetLine)
  };
}
function We(t) {
  const n = Number.parseInt(t, 10);
  return Number.isInteger(n) && n >= 0 ? n : 0;
}
function he(t) {
  return F.post("/api/app/expense", {
    title: t.title || t.vendor,
    amount: t.amount,
    currency: t.currency || "TRY",
    expenseDate: t.date,
    category: We(t.category),
    cashAccountId: t.cashAccountId,
    projectId: t.projectId || null,
    budgetLineId: t.budgetLineId || null,
    description: t.description || t.note || null
  });
}
const Ye = "apya.expenseQueue.v1", Ge = "apya.expenseQueue.rejected.v1", ge = () => me(Ye), W = () => me(Ge);
function I(t = ge()) {
  try {
    const n = window.localStorage.getItem(t), r = n ? JSON.parse(n) : [];
    return Array.isArray(r) ? r : [];
  } catch {
    return [];
  }
}
function q(t, n = ge()) {
  try {
    return window.localStorage.setItem(n, JSON.stringify(t)), !0;
  } catch {
    return !1;
  }
}
function Ve() {
  return "q_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
}
const w = {
  /** Kuyruktaki kayıtlar (en eski önce). */
  list: I,
  count() {
    return I().length;
  },
  /**
   * Kuyruğa ekler. Depoya yazılamadıysa false döner — çağıran kullanıcıya
   * "kaydedemedik" demeli, "kaydedildi" DEMEMELİ.
   */
  enqueue(t) {
    const n = I();
    return n.push({ clientId: Ve(), queuedAt: (/* @__PURE__ */ new Date()).toISOString(), payload: t }), q(n);
  },
  remove(t) {
    q(I().filter((n) => n.clientId !== t));
  },
  /** Sunucunun kalıcı olarak reddettiği (4xx) kayıtlar — silinmez, ayrı tutulur. */
  rejected() {
    return I(W());
  },
  clear() {
    q([]);
  }
};
let H = !1;
async function Je(t) {
  if (H)
    return { sent: 0, failed: 0, remaining: w.count() };
  H = !0;
  let n = 0, r = 0, i = 0;
  try {
    for (const a of w.list())
      try {
        await t(a.payload), w.remove(a.clientId), n++;
      } catch (l) {
        if (Ne(l)) {
          q(I(W()).concat({ ...a, rejectedAt: (/* @__PURE__ */ new Date()).toISOString(), error: (l == null ? void 0 : l.message) ?? null }), W()), w.remove(a.clientId), i++;
          continue;
        }
        r++;
        break;
      }
  } finally {
    H = !1;
  }
  return { sent: n, failed: r, rejected: i, remaining: w.count() };
}
function Ze() {
  return de({
    mutationFn: (t) => Fe.ocr(t)
  });
}
function Xe() {
  return ue({
    queryKey: ["expense-capture", "context"],
    queryFn: He,
    staleTime: 5 * 60 * 1e3
  });
}
function et(t) {
  return ue({
    queryKey: ["expense-capture", "lines", t],
    queryFn: () => Qe(t),
    enabled: !!t,
    staleTime: 60 * 1e3
  });
}
function tt() {
  const [t, n] = u.useState(() => typeof navigator > "u" ? !0 : navigator.onLine !== !1), [r, i] = u.useState(() => w.count()), a = u.useCallback(() => i(w.count()), []);
  return u.useEffect(() => {
    const l = () => n(!0), d = () => n(!1);
    return window.addEventListener("online", l), window.addEventListener("offline", d), () => {
      window.removeEventListener("online", l), window.removeEventListener("offline", d);
    };
  }, []), { isOnline: t, queued: r, refreshQueued: a };
}
function nt() {
  return de({
    retry: !1,
    /* Finansal işlem — duplicate önlenir */
    mutationFn: async (t) => {
      if (typeof navigator > "u" || navigator.onLine !== !1)
        return { queued: !1, result: await he(t) };
      if (!w.enqueue(t))
        throw new Error("Cihazda yer kalmadı, kayıt saklanamadı. Bağlantı gelince tekrar deneyin.");
      return { queued: !0, result: null };
    }
  });
}
function rt(t) {
  return u.useCallback(async () => {
    if (w.count() === 0)
      return null;
    const n = await Je(he);
    return t == null || t(n), n;
  }, [t]);
}
const y = { CAPTURE: "capture", OCR: "ocr", FORM: "form", SUCCESS: "success" }, at = 1500;
function st() {
  const [t, n] = u.useState(y.CAPTURE), [r, i] = u.useState(null), [a, l] = u.useState(null), [d, s] = u.useState(null), p = Xe(), c = et(d), { isOnline: b, queued: C, refreshQueued: A } = tt(), v = Ze(), x = nt(), h = ce(), j = u.useCallback(async (f) => {
    r && URL.revokeObjectURL(r), i(URL.createObjectURL(f)), n(y.OCR);
    try {
      await v.mutateAsync(f), n(y.FORM);
    } catch {
      h.warning("Otomatik okuma başarısız", {
        description: "Alanları manuel girebilirsin."
      }), n(y.FORM);
    }
  }, [r, v, h]), L = u.useCallback(() => {
    r && URL.revokeObjectURL(r), i(null), l(null), v.reset(), x.reset(), n(y.CAPTURE);
  }, [r, v, x]), P = u.useCallback(async (f) => {
    try {
      const g = await x.mutateAsync(f);
      l(g.result), n(y.SUCCESS), A(), g.queued ? h.warning("Kuyruğa alındı", {
        description: "Bağlantı yok — bağlantı gelince otomatik gönderilecek."
      }) : h.success("Masraf kaydedildi", {
        description: `${Y(f.amount, f.currency)} — ${f.vendor || "Kayıt"}`
      }), setTimeout(() => {
        L();
      }, at);
    } catch (g) {
      const R = ((g == null ? void 0 : g.validationErrors) ?? []).map((E) => E == null ? void 0 : E.message).filter(Boolean);
      h.error("Kayıt başarısız", {
        description: R.length ? R.join(" · ") : (g == null ? void 0 : g.message) ?? "Tekrar deneyebilirsin."
      });
    }
  }, [x, h, L, A]), O = rt((f) => {
    A(), f.sent > 0 ? h.success(`${f.sent} kayıt gönderildi`, {
      description: f.remaining > 0 ? `${f.remaining} kayıt hâlâ kuyrukta.` : "Kuyruk boşaldı."
    }) : f.failed > 0 && h.error("Kuyruk gönderilemedi", {
      description: `${f.remaining} kayıt cihazda bekliyor.`
    });
  });
  u.useEffect(() => {
    b && O();
  }, [b, O]);
  const M = u.useCallback(() => {
    r && URL.revokeObjectURL(r), window.location.href = "/Dashboard";
  }, [r]);
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "sticky top-0 z-sticky bg-surface-raised/95 backdrop-blur-sm border-b border-default px-4 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h1", { className: "text-base font-semibold", children: "Masraf Yakala" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        !b && /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-warning-subtle px-2.5 py-1 text-[11.5px] font-semibold text-warning", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-wifi-slash" }),
          "Çevrimdışı"
        ] }),
        C > 0 && /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: O,
            className: "inline-flex min-h-[44px] items-center gap-1 rounded-full bg-accent-subtle px-3 text-[11.5px] font-semibold text-accent",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-cloud-arrow-up" }),
              C,
              " bekliyor"
            ]
          }
        ),
        /* @__PURE__ */ e.jsx(Me, {})
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("main", { className: "max-w-2xl mx-auto p-4", children: [
      t === y.CAPTURE && /* @__PURE__ */ e.jsx(Ae, { onFile: j }),
      t === y.OCR && /* @__PURE__ */ e.jsx(ze, { previewUrl: r }),
      t === y.SUCCESS && /* @__PURE__ */ e.jsx(
        _e,
        {
          result: a,
          onAddAnother: L,
          onClose: M
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(
      Ue,
      {
        open: t === y.FORM,
        onOpenChange: (f) => {
          f || n(y.CAPTURE);
        },
        ocrResult: v.data,
        onSubmit: P,
        isSubmitting: x.isPending,
        context: p.data,
        lines: c.data,
        onProjectChange: s,
        isOffline: !b
      }
    )
  ] });
}
we();
const le = document.getElementById("apya-expense-capture-root");
le && pe(le).render(
  /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsx(ke, { children: /* @__PURE__ */ e.jsx(Ce, { children: /* @__PURE__ */ e.jsx(st, {}) }) }) })
);
