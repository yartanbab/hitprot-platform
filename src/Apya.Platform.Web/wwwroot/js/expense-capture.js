import { j as e, r as u, d as _, b as pe } from "./react-vendor-D57GAUXd.js";
import { u as be, B as D, c as R, S as F, b as K, e as ye, M as ve, I as P, a as Q, T as je } from "./Dialog-Bky2XNdc.js";
import { a as ke } from "./QueryProvider-B4436sFh.js";
import { u as ce, r as we, T as Ce } from "./registerServiceWorker-MivfkJsD.js";
import { C as Se } from "./Combobox-D5mSMyzC.js";
import { t as N } from "./i18n-DkhYld-7.js";
import { u as ue, b as de } from "./query-vendor-Bf69L2iP.js";
import { a as B } from "./httpClient-DePjXdo1.js";
import { i as Ne, s as me } from "./permanentRejection-SvaBclz0.js";
/* empty css               */
const Le = {
  light: { key: "Theme:Light", fallback: "Açık tema (Sıradaki: Koyu)" },
  dark: { key: "Theme:Dark", fallback: "Koyu tema (Sıradaki: Sistem)" },
  system: { key: "Theme:System", fallback: "Sistem teması (Sıradaki: Açık)" }
};
function Te({ className: t = "" }) {
  const { preference: n, toggle: a } = be(), i = Le[n], r = i ? N(i.key, i.fallback) : N("Theme:Toggle", "Tema değiştir");
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: a,
      "aria-label": r,
      title: r,
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
        n === "light" && /* @__PURE__ */ e.jsx(Me, {}),
        n === "dark" && /* @__PURE__ */ e.jsx(Ee, {}),
        n === "system" && /* @__PURE__ */ e.jsx(Ie, {})
      ]
    }
  );
}
function Me() {
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
function Ee() {
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
  const n = u.useRef(null), [a, i] = _.useState(!1), r = ce(), l = u.useCallback(() => {
    var s;
    return (s = n.current) == null ? void 0 : s.click();
  }, []), d = u.useCallback((s) => {
    if (s) {
      if (!s.type.startsWith("image/")) {
        r.error("Resim dosyası gerekli", {
          description: "Lütfen JPG/PNG/HEIC fatura görseli seç."
        });
        return;
      }
      if (s.size > 10 * 1024 * 1024) {
        r.error("Dosya çok büyük", {
          description: "En fazla 10 MB. Lütfen daha düşük çözünürlükte çek."
        });
        return;
      }
      t(s);
    }
  }, [t, r]);
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
        var g;
        s.preventDefault(), i(!1), d((g = s.dataTransfer.files) == null ? void 0 : g[0]);
      },
      className: R(
        "flex flex-col items-center justify-center gap-4",
        "border-2 border-dashed rounded-xl p-8",
        "min-h-[60vh] mobile:min-h-[50vh]",
        "cursor-pointer select-none",
        "transition-colors duration-fast",
        "focus-visible:outline-none focus-visible:shadow-focus",
        a ? "border-brand-500 bg-brand-50" : "border-default bg-surface-raised hover:border-strong"
      ),
      children: [
        /* @__PURE__ */ e.jsx(Oe, {}),
        /* @__PURE__ */ e.jsxs("div", { className: "text-center max-w-xs pointer-events-none", children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-base font-semibold text-text-primary", children: "Faturayı çek" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-secondary mt-1", children: "Mobilde direkt kamera açılır. Masaüstünde dosya sürükle ya da tıkla. AI tutarı, tarihi ve tedarikçiyi otomatik okur." })
        ] }),
        /* @__PURE__ */ e.jsx(
          D,
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
              var g;
              return d((g = s.target.files) == null ? void 0 : g[0]);
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
function De({ previewUrl: t }) {
  const [n, a] = _.useState(0);
  return _.useEffect(() => {
    const i = setTimeout(() => a(1), 350), r = setTimeout(() => a(2), 800);
    return () => {
      clearTimeout(i), clearTimeout(r);
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
    /* @__PURE__ */ e.jsx("div", { className: "w-full max-w-xs flex flex-col gap-2", children: Re.map((i, r) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
      r < n && /* @__PURE__ */ e.jsx(ze, {}),
      r === n && /* @__PURE__ */ e.jsx(Be, {}),
      r > n && /* @__PURE__ */ e.jsx(qe, {}),
      /* @__PURE__ */ e.jsx("span", { className: r <= n ? "text-text-primary" : "text-text-tertiary", children: i })
    ] }, r)) }),
    /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-xs flex flex-col gap-2 mt-2", children: [
      /* @__PURE__ */ e.jsx(F, { height: 12 }),
      /* @__PURE__ */ e.jsx(F, { height: 12, className: "w-3/4" }),
      /* @__PURE__ */ e.jsx(F, { height: 12, className: "w-1/2" })
    ] })
  ] });
}
const ze = () => /* @__PURE__ */ e.jsx(
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
), qe = () => /* @__PURE__ */ e.jsx("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-neutral-300 mx-[2px] flex-none", "aria-hidden": "true" }), re = {
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
function W({ score: t, label: n, size: a = "md", showLabel: i = !0, className: r }) {
  const l = fe(t), d = xe(l), s = re[a] ?? re.md, g = n ?? d.label, c = Math.round(l * 100);
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: R("inline-flex items-center gap-1 text-xs text-text-tertiary", r),
      title: `${d.label} (%${c})`,
      children: [
        /* @__PURE__ */ e.jsx("span", { className: R("inline-flex items-center", s.gap), "aria-hidden": "true", children: Array.from({ length: 5 }, (p, C) => /* @__PURE__ */ e.jsx(
          "span",
          {
            className: R(
              "inline-block rounded-full",
              s.dot,
              C < d.dots ? "bg-ai-500" : "bg-neutral-200"
            )
          },
          C
        )) }),
        i && /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: g }),
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
W.bandFor = xe;
W.normalize = fe;
const se = (t) => new Promise((n) => setTimeout(n, t)), ie = [
  { vendor: "Migros A.Ş.", category: "Ofis Sarfiyat" },
  { vendor: "BSH Ev Aletleri", category: "Donanım" },
  { vendor: "Türk Telekom", category: "Internet/Telekom" },
  { vendor: "JetBrains s.r.o.", category: "Yazılım Lisansı" },
  { vendor: "Lufthansa", category: "Seyahat" }
];
function O(t, n) {
  const a = (n * 9301 + 49297) % 233280 / 233280;
  return Math.min(0.99, Math.max(0.4, t + (a - 0.5) * 0.2));
}
const Fe = {
  async ocr(t) {
    var r;
    await se(900 + Math.random() * 600);
    const n = t.size + (((r = t.name) == null ? void 0 : r.length) || 0), a = ie[n % ie.length], i = Math.round((50 + n % 5e5 / 100) * 100) / 100;
    return {
      confidence: O(0.8, n),
      fields: {
        amount: { value: i, confidence: O(0.92, n + 1) },
        currency: { value: "TRY", confidence: 0.99 },
        date: { value: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), confidence: O(0.86, n + 2) },
        vendor: { value: a.vendor, confidence: O(0.65, n + 3) },
        category: { value: a.category, confidence: O(0.58, n + 4) },
        taxRate: { value: 20, confidence: 0.95 }
      },
      rawText: `${a.vendor}
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
}, M = 0.7, Ke = [
  { value: "Ofis Sarfiyat", label: "Ofis Sarfiyat" },
  { value: "Donanım", label: "Donanım" },
  { value: "Yazılım Lisansı", label: "Yazılım Lisansı" },
  { value: "Internet/Telekom", label: "Internet/Telekom" },
  { value: "Seyahat", label: "Seyahat" },
  { value: "Yemek", label: "Yemek" },
  { value: "Kırtasiye", label: "Kırtasiye" },
  { value: "Diğer", label: "Diğer" }
], Pe = ["TRY", "USD", "EUR"], U = [
  "block w-full min-h-[44px] rounded-md border border-default bg-surface-base text-text-primary",
  "px-3 py-2 text-sm",
  "focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus"
].join(" ");
function Ue({
  open: t,
  onOpenChange: n,
  ocrResult: a,
  onSubmit: i,
  isSubmitting: r,
  context: l,
  lines: d,
  onProjectChange: s,
  isOffline: g
}) {
  var G, H, V, J, Z, X, ee, te, ne;
  const [c, p] = u.useState(() => oe(a)), [C, I] = u.useState(!1), y = u.useRef(null);
  u.useEffect(() => {
    p(oe(a));
  }, [a]), u.useEffect(() => {
    if (!t || !(a != null && a.fields)) return;
    const o = setTimeout(() => {
      var m, S;
      return (S = (m = y.current) == null ? void 0 : m.focus) == null ? void 0 : S.call(m);
    }, 80);
    return () => clearTimeout(o);
  }, [t, a]);
  const x = u.useMemo(
    () => (a == null ? void 0 : a.fields) ?? {},
    [a]
  ), h = u.useMemo(() => {
    var m;
    const o = ["vendor", "category", "date", "amount"];
    for (const S of o) {
      const ae = (m = x[S]) == null ? void 0 : m.confidence;
      if (ae != null && ae < M) return S;
    }
    return null;
  }, [x]), v = (o) => (m) => p((S) => ({ ...S, [o]: m != null && m.target ? m.target.value : m })), L = !!(d != null && d.requiresBudgetLine), q = !c.cashAccountId || L && !c.budgetLineId, A = async (o) => {
    if (o.preventDefault(), r || q) return;
    const m = {
      ...c,
      amount: typeof c.amount == "number" ? c.amount : parseFloat(c.amount),
      taxRate: typeof c.taxRate == "number" ? c.taxRate : parseFloat(c.taxRate)
    };
    await i(m);
  }, T = (a == null ? void 0 : a.confidence) ?? 0, f = T >= 0.85 ? "Yüksek güven" : T >= 0.65 ? "Orta güven" : "Düşük güven — kontrol edin", j = T >= 0.85 ? "positive" : T >= 0.65 ? "warning" : "critical";
  return /* @__PURE__ */ e.jsx(K, { open: t, onOpenChange: n, children: /* @__PURE__ */ e.jsx(K.Content, { title: "Masraf detayları", description: "AI tarafından okunan tutarları doğrulayın ve gönderin", children: /* @__PURE__ */ e.jsxs("form", { onSubmit: A, className: "flex flex-col h-full", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "px-4 pt-2 pb-3 border-b border-subtle flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-semibold", children: "Masraf Detayları" }),
      /* @__PURE__ */ e.jsx(ye, { variant: j, size: "sm", withDot: !0, children: f })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4", children: [
      g && /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-warning bg-warning-subtle px-3 py-2 text-[12.5px] text-warning", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-wifi-slash mr-1.5" }),
        "Bağlantı yok — kayıt ",
        /* @__PURE__ */ e.jsx("strong", { children: "cihazda saklanır" }),
        ", bağlantı gelince gönderilir. Fotoğraf kuyruğa girmez; kayıt belgesiz oluşur."
      ] }),
      /* @__PURE__ */ e.jsx(k, { label: "Proje", children: /* @__PURE__ */ e.jsxs(
        "select",
        {
          className: U,
          value: c.projectId || "",
          onChange: (o) => {
            v("projectId")(o), s == null || s(o.target.value);
          },
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "— Projesiz —" }),
            ((l == null ? void 0 : l.projects) ?? []).map((o) => /* @__PURE__ */ e.jsx("option", { value: o.id, children: o.name }, o.id))
          ]
        }
      ) }),
      c.projectId && (((G = d == null ? void 0 : d.lines) == null ? void 0 : G.length) ?? 0) > 0 && /* @__PURE__ */ e.jsx(k, { label: "Bütçe kalemi", required: L, children: /* @__PURE__ */ e.jsxs(
        "select",
        {
          className: U,
          value: c.budgetLineId || "",
          onChange: v("budgetLineId"),
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "— Kalem seçin —" }),
            d.lines.map((o) => /* @__PURE__ */ e.jsx("option", { value: o.id, children: o.label }, o.id))
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(k, { label: "Kasa / banka", required: !0, children: /* @__PURE__ */ e.jsxs(
        "select",
        {
          className: U,
          value: c.cashAccountId || "",
          onChange: v("cashAccountId"),
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
      /* @__PURE__ */ e.jsx(k, { label: "Tutar", required: !0, confidence: (H = x.amount) == null ? void 0 : H.confidence, children: /* @__PURE__ */ e.jsx(
        ve,
        {
          ref: h === "amount" ? y : void 0,
          value: c.amount,
          onValueChange: (o) => p((m) => ({ ...m, amount: o ?? "" })),
          currency: c.currency,
          currencies: Pe,
          onCurrencyChange: (o) => p((m) => ({ ...m, currency: o })),
          size: "lg",
          invalid: ((V = x.amount) == null ? void 0 : V.confidence) < M,
          required: !0,
          min: 0.01
        }
      ) }),
      /* @__PURE__ */ e.jsx(k, { label: "Tarih", required: !0, confidence: (J = x.date) == null ? void 0 : J.confidence, children: /* @__PURE__ */ e.jsx(
        P,
        {
          ref: h === "date" ? y : void 0,
          type: "date",
          required: !0,
          size: "lg",
          value: c.date,
          onChange: v("date"),
          invalid: ((Z = x.date) == null ? void 0 : Z.confidence) < M
        }
      ) }),
      /* @__PURE__ */ e.jsx(k, { label: "Tedarikçi", required: !0, confidence: (X = x.vendor) == null ? void 0 : X.confidence, children: /* @__PURE__ */ e.jsx(
        P,
        {
          ref: h === "vendor" ? y : void 0,
          type: "text",
          required: !0,
          size: "lg",
          value: c.vendor,
          onChange: v("vendor"),
          invalid: ((ee = x.vendor) == null ? void 0 : ee.confidence) < M,
          placeholder: "örn. Migros A.Ş."
        }
      ) }),
      /* @__PURE__ */ e.jsx(k, { label: "Kategori", confidence: (te = x.category) == null ? void 0 : te.confidence, children: /* @__PURE__ */ e.jsx(
        Se,
        {
          options: Ke,
          value: c.category,
          onChange: (o) => p((m) => ({ ...m, category: o })),
          invalid: ((ne = x.category) == null ? void 0 : ne.confidence) < M,
          placeholder: "Kategori seç"
        }
      ) }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => I((o) => !o),
          className: "self-start text-sm text-text-link hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
          children: C ? "Daha az alan" : "Daha fazla alan"
        }
      ),
      C && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(k, { label: "KDV Oranı (%)", children: /* @__PURE__ */ e.jsx(
          P,
          {
            type: "number",
            step: "0.1",
            value: c.taxRate,
            onChange: v("taxRate"),
            className: "font-tabular"
          }
        ) }),
        /* @__PURE__ */ e.jsx(k, { label: "Not", children: /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: c.note,
            onChange: v("note"),
            className: R(
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
        /* @__PURE__ */ e.jsx("span", { className: "font-tabular font-semibold text-text-primary", children: typeof c.amount == "number" && c.amount > 0 ? Q(c.amount, c.currency) : "—" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ e.jsx(K.Close, { asChild: !0, children: /* @__PURE__ */ e.jsx(D, { type: "button", variant: "ghost", size: "md", children: "İptal" }) }),
        /* @__PURE__ */ e.jsx(
          D,
          {
            type: "submit",
            variant: "primary",
            size: "md",
            isLoading: r,
            loadingText: "Gönderiliyor...",
            children: "Gönder"
          }
        )
      ] })
    ] })
  ] }) }) });
}
function k({ label: t, required: n, confidence: a, children: i }) {
  const r = a != null && a < 0.95, l = a != null && a < M;
  return /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "text-sm font-medium text-text-secondary", children: [
        t,
        n && /* @__PURE__ */ e.jsx("span", { className: "text-text-negative ml-0.5", children: "*" })
      ] }),
      r && /* @__PURE__ */ e.jsx(W, { score: a, showLabel: !1, size: "sm" })
    ] }),
    i,
    l && /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-warning", children: "AI bu alandan emin değil — doğrula." })
  ] });
}
function oe(t) {
  var a, i, r, l, d, s;
  const n = (t == null ? void 0 : t.fields) ?? {};
  return {
    amount: ((a = n.amount) == null ? void 0 : a.value) ?? "",
    currency: ((i = n.currency) == null ? void 0 : i.value) ?? "TRY",
    date: ((r = n.date) == null ? void 0 : r.value) ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    vendor: ((l = n.vendor) == null ? void 0 : l.value) ?? "",
    category: ((d = n.category) == null ? void 0 : d.value) ?? "",
    taxRate: ((s = n.taxRate) == null ? void 0 : s.value) ?? 20,
    note: ""
  };
}
function Ye({ result: t, onAddAnother: n, onClose: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center justify-center gap-4 py-12 px-6 text-center", children: [
    /* @__PURE__ */ e.jsx(_e, {}),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-xl font-semibold text-text-primary", children: "Masraf gönderildi" }),
      /* @__PURE__ */ e.jsxs("p", { className: "text-sm text-text-secondary mt-1", children: [
        (t == null ? void 0 : t.amount) && Q(t.amount, t.currency || "TRY"),
        (t == null ? void 0 : t.vendor) && ` · ${t.vendor}`
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary mt-1", children: "Onaya gitti. Bildirim ile durumu takip edebilirsin." })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 w-full max-w-xs", children: [
      /* @__PURE__ */ e.jsx(D, { variant: "primary", size: "lg", onClick: n, children: "Bir tane daha çek" }),
      /* @__PURE__ */ e.jsx(D, { variant: "ghost", size: "md", onClick: a, children: "Bitir" })
    ] })
  ] });
}
const _e = () => /* @__PURE__ */ e.jsxs(
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
async function $e() {
  const [t, n] = await Promise.all([
    B.get("/api/app/project?MaxResultCount=200&Sorting=name"),
    B.get("/api/app/cash-account?MaxResultCount=100")
  ]);
  return {
    projects: ((t == null ? void 0 : t.items) ?? []).map((a) => ({ id: a.id, name: a.name, currency: a.currency })),
    accounts: ((n == null ? void 0 : n.items) ?? []).map((a) => ({ id: a.id, name: a.name, currency: a.currency }))
  };
}
async function Qe(t) {
  if (!t)
    return { lines: [], requiresBudgetLine: !1 };
  const n = await B.get(`/api/app/project-budget/record-form-lookup/${t}`);
  return {
    lines: ((n == null ? void 0 : n.lines) ?? []).map((a) => ({
      id: a.id,
      label: a.code ? `${a.code} · ${a.name}` : a.name,
      remaining: a.remainingAmount
    })),
    requiresBudgetLine: !!(n != null && n.requiresBudgetLine)
  };
}
function he(t) {
  return B.post("/api/app/expense", {
    title: t.title,
    amount: t.amount,
    currency: t.currency || "TRY",
    expenseDate: t.date,
    category: t.category ?? 0,
    cashAccountId: t.cashAccountId,
    projectId: t.projectId || null,
    budgetLineId: t.budgetLineId || null,
    description: t.description || null
  });
}
const We = "apya.expenseQueue.v1", Ge = "apya.expenseQueue.rejected.v1", ge = () => me(We), $ = () => me(Ge);
function E(t = ge()) {
  try {
    const n = window.localStorage.getItem(t), a = n ? JSON.parse(n) : [];
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}
function z(t, n = ge()) {
  try {
    return window.localStorage.setItem(n, JSON.stringify(t)), !0;
  } catch {
    return !1;
  }
}
function He() {
  return "q_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
}
const w = {
  /** Kuyruktaki kayıtlar (en eski önce). */
  list: E,
  count() {
    return E().length;
  },
  /**
   * Kuyruğa ekler. Depoya yazılamadıysa false döner — çağıran kullanıcıya
   * "kaydedemedik" demeli, "kaydedildi" DEMEMELİ.
   */
  enqueue(t) {
    const n = E();
    return n.push({ clientId: He(), queuedAt: (/* @__PURE__ */ new Date()).toISOString(), payload: t }), z(n);
  },
  remove(t) {
    z(E().filter((n) => n.clientId !== t));
  },
  /** Sunucunun kalıcı olarak reddettiği (4xx) kayıtlar — silinmez, ayrı tutulur. */
  rejected() {
    return E($());
  },
  clear() {
    z([]);
  }
};
let Y = !1;
async function Ve(t) {
  if (Y)
    return { sent: 0, failed: 0, remaining: w.count() };
  Y = !0;
  let n = 0, a = 0, i = 0;
  try {
    for (const r of w.list())
      try {
        await t(r.payload), w.remove(r.clientId), n++;
      } catch (l) {
        if (Ne(l)) {
          z(E($()).concat({ ...r, rejectedAt: (/* @__PURE__ */ new Date()).toISOString(), error: (l == null ? void 0 : l.message) ?? null }), $()), w.remove(r.clientId), i++;
          continue;
        }
        a++;
        break;
      }
  } finally {
    Y = !1;
  }
  return { sent: n, failed: a, rejected: i, remaining: w.count() };
}
function Je() {
  return de({
    mutationFn: (t) => Fe.ocr(t)
  });
}
function Ze() {
  return ue({
    queryKey: ["expense-capture", "context"],
    queryFn: $e,
    staleTime: 5 * 60 * 1e3
  });
}
function Xe(t) {
  return ue({
    queryKey: ["expense-capture", "lines", t],
    queryFn: () => Qe(t),
    enabled: !!t,
    staleTime: 60 * 1e3
  });
}
function et() {
  const [t, n] = u.useState(() => typeof navigator > "u" ? !0 : navigator.onLine !== !1), [a, i] = u.useState(() => w.count()), r = u.useCallback(() => i(w.count()), []);
  return u.useEffect(() => {
    const l = () => n(!0), d = () => n(!1);
    return window.addEventListener("online", l), window.addEventListener("offline", d), () => {
      window.removeEventListener("online", l), window.removeEventListener("offline", d);
    };
  }, []), { isOnline: t, queued: a, refreshQueued: r };
}
function tt() {
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
function nt(t) {
  return u.useCallback(async () => {
    if (w.count() === 0)
      return null;
    const n = await Ve(he);
    return t == null || t(n), n;
  }, [t]);
}
const b = { CAPTURE: "capture", OCR: "ocr", FORM: "form", SUCCESS: "success" }, at = 1500;
function rt() {
  const [t, n] = u.useState(b.CAPTURE), [a, i] = u.useState(null), [r, l] = u.useState(null), [d, s] = u.useState(null), g = Ze(), c = Xe(d), { isOnline: p, queued: C, refreshQueued: I } = et(), y = Je(), x = tt(), h = ce(), v = u.useCallback(async (f) => {
    a && URL.revokeObjectURL(a), i(URL.createObjectURL(f)), n(b.OCR);
    try {
      await y.mutateAsync(f), n(b.FORM);
    } catch {
      h.warning("Otomatik okuma başarısız", {
        description: "Alanları manuel girebilirsin."
      }), n(b.FORM);
    }
  }, [a, y, h]), L = u.useCallback(() => {
    a && URL.revokeObjectURL(a), i(null), l(null), y.reset(), x.reset(), n(b.CAPTURE);
  }, [a, y, x]), q = u.useCallback(async (f) => {
    try {
      const j = await x.mutateAsync(f);
      l(j.result), n(b.SUCCESS), I(), j.queued ? h.warning("Kuyruğa alındı", {
        description: "Bağlantı yok — bağlantı gelince otomatik gönderilecek."
      }) : h.success("Masraf kaydedildi", {
        description: `${Q(f.amount, f.currency)} — ${f.vendor || "Kayıt"}`
      }), setTimeout(() => {
        L();
      }, at);
    } catch (j) {
      h.error("Kayıt başarısız", {
        description: (j == null ? void 0 : j.message) ?? "Tekrar deneyebilirsin."
      });
    }
  }, [x, h, L, I]), A = nt((f) => {
    I(), f.sent > 0 ? h.success(`${f.sent} kayıt gönderildi`, {
      description: f.remaining > 0 ? `${f.remaining} kayıt hâlâ kuyrukta.` : "Kuyruk boşaldı."
    }) : f.failed > 0 && h.error("Kuyruk gönderilemedi", {
      description: `${f.remaining} kayıt cihazda bekliyor.`
    });
  });
  u.useEffect(() => {
    p && A();
  }, [p, A]);
  const T = u.useCallback(() => {
    a && URL.revokeObjectURL(a), window.location.href = "/Dashboard";
  }, [a]);
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "sticky top-0 z-sticky bg-surface-raised/95 backdrop-blur-sm border-b border-default px-4 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h1", { className: "text-base font-semibold", children: "Masraf Yakala" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        !p && /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-warning-subtle px-2.5 py-1 text-[11.5px] font-semibold text-warning", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-wifi-slash" }),
          "Çevrimdışı"
        ] }),
        C > 0 && /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: A,
            className: "inline-flex min-h-[44px] items-center gap-1 rounded-full bg-accent-subtle px-3 text-[11.5px] font-semibold text-accent",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-cloud-arrow-up" }),
              C,
              " bekliyor"
            ]
          }
        ),
        /* @__PURE__ */ e.jsx(Te, {})
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("main", { className: "max-w-2xl mx-auto p-4", children: [
      t === b.CAPTURE && /* @__PURE__ */ e.jsx(Ae, { onFile: v }),
      t === b.OCR && /* @__PURE__ */ e.jsx(De, { previewUrl: a }),
      t === b.SUCCESS && /* @__PURE__ */ e.jsx(
        Ye,
        {
          result: r,
          onAddAnother: L,
          onClose: T
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(
      Ue,
      {
        open: t === b.FORM,
        onOpenChange: (f) => {
          f || n(b.CAPTURE);
        },
        ocrResult: y.data,
        onSubmit: q,
        isSubmitting: x.isPending,
        context: g.data,
        lines: c.data,
        onProjectChange: s,
        isOffline: !p
      }
    )
  ] });
}
we();
const le = document.getElementById("apya-expense-capture-root");
le && pe(le).render(
  /* @__PURE__ */ e.jsx(je, { children: /* @__PURE__ */ e.jsx(ke, { children: /* @__PURE__ */ e.jsx(Ce, { children: /* @__PURE__ */ e.jsx(rt, {}) }) }) })
);
