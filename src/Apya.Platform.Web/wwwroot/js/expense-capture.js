import { j as e, r as u, d as W, b as he } from "./react-vendor-D57GAUXd.js";
import { u as ge, B as D, c as z, S as P, b as U, e as pe, M as be, I as K, a as Y, T as ye } from "./Dialog-Bky2XNdc.js";
import { a as ve } from "./QueryProvider-B4436sFh.js";
import { u as le, r as je, T as ke } from "./registerServiceWorker-MivfkJsD.js";
import { C as we } from "./Combobox-D5mSMyzC.js";
import { t as N } from "./i18n-DkhYld-7.js";
import { u as ce, b as ue } from "./query-vendor-Bf69L2iP.js";
import { a as q } from "./httpClient-DePjXdo1.js";
/* empty css               */
const Ce = {
  light: { key: "Theme:Light", fallback: "Açık tema (Sıradaki: Koyu)" },
  dark: { key: "Theme:Dark", fallback: "Koyu tema (Sıradaki: Sistem)" },
  system: { key: "Theme:System", fallback: "Sistem teması (Sıradaki: Açık)" }
};
function Se({ className: t = "" }) {
  const { preference: n, toggle: r } = ge(), s = Ce[n], i = s ? N(s.key, s.fallback) : N("Theme:Toggle", "Tema değiştir");
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: r,
      "aria-label": i,
      title: i,
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
        n === "light" && /* @__PURE__ */ e.jsx(Ne, {}),
        n === "dark" && /* @__PURE__ */ e.jsx(Le, {}),
        n === "system" && /* @__PURE__ */ e.jsx(Me, {})
      ]
    }
  );
}
function Ne() {
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
function Le() {
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
        /* @__PURE__ */ e.jsx("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", ry: "2" }),
        /* @__PURE__ */ e.jsx("path", { d: "M8 21h8M12 17v4" })
      ]
    }
  );
}
function Te({ onFile: t }) {
  const n = u.useRef(null), [r, s] = W.useState(!1), i = le(), c = u.useCallback(() => {
    var a;
    return (a = n.current) == null ? void 0 : a.click();
  }, []), d = u.useCallback((a) => {
    if (a) {
      if (!a.type.startsWith("image/")) {
        i.error("Resim dosyası gerekli", {
          description: "Lütfen JPG/PNG/HEIC fatura görseli seç."
        });
        return;
      }
      if (a.size > 10 * 1024 * 1024) {
        i.error("Dosya çok büyük", {
          description: "En fazla 10 MB. Lütfen daha düşük çözünürlükte çek."
        });
        return;
      }
      t(a);
    }
  }, [t, i]);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "button",
      tabIndex: 0,
      "aria-label": "Faturayı çek — kamerayı aç ya da görüntü sürükle",
      onClick: c,
      onKeyDown: (a) => {
        (a.key === "Enter" || a.key === " ") && (a.preventDefault(), c());
      },
      onDragOver: (a) => {
        a.preventDefault(), s(!0);
      },
      onDragLeave: () => s(!1),
      onDrop: (a) => {
        var p;
        a.preventDefault(), s(!1), d((p = a.dataTransfer.files) == null ? void 0 : p[0]);
      },
      className: z(
        "flex flex-col items-center justify-center gap-4",
        "border-2 border-dashed rounded-xl p-8",
        "min-h-[60vh] mobile:min-h-[50vh]",
        "cursor-pointer select-none",
        "transition-colors duration-fast",
        "focus-visible:outline-none focus-visible:shadow-focus",
        r ? "border-brand-500 bg-brand-50" : "border-default bg-surface-raised hover:border-strong"
      ),
      children: [
        /* @__PURE__ */ e.jsx(Ee, {}),
        /* @__PURE__ */ e.jsxs("div", { className: "text-center max-w-xs pointer-events-none", children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-base font-semibold text-text-primary", children: "Faturayı çek" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-secondary mt-1", children: "Mobilde direkt kamera açılır. Masaüstünde dosya sürükle ya da tıkla. AI tutarı, tarihi ve tedarikçiyi otomatik okur." })
        ] }),
        /* @__PURE__ */ e.jsx(
          D,
          {
            size: "lg",
            variant: "primary",
            onClick: (a) => {
              a.stopPropagation(), c();
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
            onChange: (a) => {
              var p;
              return d((p = a.target.files) == null ? void 0 : p[0]);
            }
          }
        )
      ]
    }
  );
}
function Ee() {
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
const Ie = [
  "Görüntü temizleniyor...",
  "Metin tanınıyor (OCR)...",
  "Alanlar çıkartılıyor..."
];
function Ae({ previewUrl: t }) {
  const [n, r] = W.useState(0);
  return W.useEffect(() => {
    const s = setTimeout(() => r(1), 350), i = setTimeout(() => r(2), 800);
    return () => {
      clearTimeout(s), clearTimeout(i);
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
    /* @__PURE__ */ e.jsx("div", { className: "w-full max-w-xs flex flex-col gap-2", children: Ie.map((s, i) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
      i < n && /* @__PURE__ */ e.jsx(Oe, {}),
      i === n && /* @__PURE__ */ e.jsx(Re, {}),
      i > n && /* @__PURE__ */ e.jsx(ze, {}),
      /* @__PURE__ */ e.jsx("span", { className: i <= n ? "text-text-primary" : "text-text-tertiary", children: s })
    ] }, i)) }),
    /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-xs flex flex-col gap-2 mt-2", children: [
      /* @__PURE__ */ e.jsx(P, { height: 12 }),
      /* @__PURE__ */ e.jsx(P, { height: 12, className: "w-3/4" }),
      /* @__PURE__ */ e.jsx(P, { height: 12, className: "w-1/2" })
    ] })
  ] });
}
const Oe = () => /* @__PURE__ */ e.jsx(
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
), Re = () => /* @__PURE__ */ e.jsx(
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
), ze = () => /* @__PURE__ */ e.jsx("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-neutral-300 mx-[2px] flex-none", "aria-hidden": "true" }), re = {
  sm: { dot: "h-1 w-1", gap: "gap-0.5" },
  md: { dot: "h-1.5 w-1.5", gap: "gap-0.5" },
  lg: { dot: "h-2 w-2", gap: "gap-1" }
};
function de(t) {
  return typeof t != "number" || !Number.isFinite(t) ? 0 : t > 1 ? Math.max(0, Math.min(100, t)) / 100 : Math.max(0, Math.min(1, t));
}
function me(t) {
  return t >= 0.85 ? { dots: 5, label: N("Ai:Confidence:VeryHigh", "Çok yüksek güven") } : t >= 0.7 ? { dots: 4, label: N("Ai:Confidence:High", "Yüksek güven") } : t >= 0.5 ? { dots: 3, label: N("Ai:Confidence:Medium", "Orta güven") } : t >= 0.3 ? { dots: 2, label: N("Ai:Confidence:Low", "Düşük güven") } : { dots: 1, label: N("Ai:Confidence:VeryLow", "Çok düşük güven") };
}
function G({ score: t, label: n, size: r = "md", showLabel: s = !0, className: i }) {
  const c = de(t), d = me(c), a = re[r] ?? re.md, p = n ?? d.label, l = Math.round(c * 100);
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: z("inline-flex items-center gap-1 text-xs text-text-tertiary", i),
      title: `${d.label} (%${l})`,
      children: [
        /* @__PURE__ */ e.jsx("span", { className: z("inline-flex items-center", a.gap), "aria-hidden": "true", children: Array.from({ length: 5 }, (b, w) => /* @__PURE__ */ e.jsx(
          "span",
          {
            className: z(
              "inline-block rounded-full",
              a.dot,
              w < d.dots ? "bg-ai-500" : "bg-neutral-200"
            )
          },
          w
        )) }),
        s && /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: p }),
        /* @__PURE__ */ e.jsxs("span", { className: "sr-only", children: [
          "Güven düzeyi: ",
          d.label,
          " (%",
          l,
          ")"
        ] })
      ]
    }
  );
}
G.bandFor = me;
G.normalize = de;
const ae = (t) => new Promise((n) => setTimeout(n, t)), se = [
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
function R(t, n) {
  const r = (n * 9301 + 49297) % 233280 / 233280;
  return Math.min(0.99, Math.max(0.4, t + (r - 0.5) * 0.2));
}
const De = {
  async ocr(t) {
    var i;
    await ae(900 + Math.random() * 600);
    const n = t.size + (((i = t.name) == null ? void 0 : i.length) || 0), r = se[n % se.length], s = Math.round((50 + n % 5e5 / 100) * 100) / 100;
    return {
      confidence: R(0.8, n),
      fields: {
        amount: { value: s, confidence: R(0.92, n + 1) },
        currency: { value: "TRY", confidence: 0.99 },
        date: { value: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), confidence: R(0.86, n + 2) },
        vendor: { value: r.vendor, confidence: R(0.65, n + 3) },
        category: { value: r.category, confidence: R(0.58, n + 4) },
        taxRate: { value: 20, confidence: 0.95 }
      },
      rawText: `${r.vendor}
Tutar: ${s.toFixed(2)} TL
KDV %20`
    };
  },
  async submit(t) {
    if (await ae(600), !(t != null && t.amount) || t.amount <= 0) {
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
}, E = 0.7, Be = [
  { value: "0", label: "Genel / Diğer" },
  { value: "1", label: "Ofis / Kira" },
  { value: "2", label: "Seyahat / Ulaşım" },
  { value: "3", label: "Personel / Maaş" },
  { value: "4", label: "Malzeme / Sarf" },
  { value: "5", label: "Hizmet / Danışmanlık" },
  { value: "6", label: "Vergi / Harç" }
], qe = ["TRY", "USD", "EUR"], $ = [
  "block w-full min-h-[44px] rounded-md border border-default bg-surface-base text-text-primary",
  "px-3 py-2 text-sm",
  "focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus"
].join(" ");
function Fe({
  open: t,
  onOpenChange: n,
  ocrResult: r,
  onSubmit: s,
  isSubmitting: i,
  context: c,
  lines: d,
  onProjectChange: a,
  isOffline: p
}) {
  var O, T, Q, V, J, Z, X, ee, te;
  const [l, b] = u.useState(() => ie(r)), [w, I] = u.useState(!1), v = u.useRef(null);
  u.useEffect(() => {
    b(ie(r));
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
      const ne = (m = x[S]) == null ? void 0 : m.confidence;
      if (ne != null && ne < E) return S;
    }
    return null;
  }, [x]), j = (o) => (m) => b((S) => ({ ...S, [o]: m != null && m.target ? m.target.value : m })), L = !!(d != null && d.requiresBudgetLine), F = !l.cashAccountId || L && !l.budgetLineId, A = async (o) => {
    if (o.preventDefault(), i || F) return;
    const m = {
      ...l,
      amount: typeof l.amount == "number" ? l.amount : parseFloat(l.amount),
      taxRate: typeof l.taxRate == "number" ? l.taxRate : parseFloat(l.taxRate)
    };
    await s(m);
  }, M = (r == null ? void 0 : r.confidence) ?? 0, f = M >= 0.85 ? "Yüksek güven" : M >= 0.65 ? "Orta güven" : "Düşük güven — kontrol edin", g = M >= 0.85 ? "positive" : M >= 0.65 ? "warning" : "critical";
  return /* @__PURE__ */ e.jsx(U, { open: t, onOpenChange: n, children: /* @__PURE__ */ e.jsx(U.Content, { title: "Masraf detayları", description: "AI tarafından okunan tutarları doğrulayın ve gönderin", children: /* @__PURE__ */ e.jsxs("form", { onSubmit: A, className: "flex flex-col flex-1 min-h-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "px-4 pt-2 pb-3 border-b border-subtle flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-semibold", children: "Masraf Detayları" }),
      /* @__PURE__ */ e.jsx(pe, { variant: g, size: "sm", withDot: !0, children: f })
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
          value: l.projectId || "",
          onChange: (o) => {
            j("projectId")(o), a == null || a(o.target.value);
          },
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "— Projesiz —" }),
            ((c == null ? void 0 : c.projects) ?? []).map((o) => /* @__PURE__ */ e.jsx("option", { value: o.id, children: o.name }, o.id))
          ]
        }
      ) }),
      l.projectId && (((O = d == null ? void 0 : d.lines) == null ? void 0 : O.length) ?? 0) > 0 && /* @__PURE__ */ e.jsx(k, { label: "Bütçe kalemi", required: L, children: /* @__PURE__ */ e.jsxs(
        "select",
        {
          className: $,
          value: l.budgetLineId || "",
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
          value: l.cashAccountId || "",
          onChange: j("cashAccountId"),
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "— Kasa seçin —" }),
            ((c == null ? void 0 : c.accounts) ?? []).map((o) => /* @__PURE__ */ e.jsxs("option", { value: o.id, children: [
              o.name,
              " (",
              o.currency,
              ")"
            ] }, o.id))
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(k, { label: "Tutar", required: !0, confidence: (T = x.amount) == null ? void 0 : T.confidence, children: /* @__PURE__ */ e.jsx(
        be,
        {
          ref: h === "amount" ? v : void 0,
          value: l.amount,
          onValueChange: (o) => b((m) => ({ ...m, amount: o ?? "" })),
          currency: l.currency,
          currencies: qe,
          onCurrencyChange: (o) => b((m) => ({ ...m, currency: o })),
          size: "lg",
          invalid: ((Q = x.amount) == null ? void 0 : Q.confidence) < E,
          required: !0,
          min: 0.01
        }
      ) }),
      /* @__PURE__ */ e.jsx(k, { label: "Tarih", required: !0, confidence: (V = x.date) == null ? void 0 : V.confidence, children: /* @__PURE__ */ e.jsx(
        K,
        {
          ref: h === "date" ? v : void 0,
          type: "date",
          required: !0,
          size: "lg",
          value: l.date,
          onChange: j("date"),
          invalid: ((J = x.date) == null ? void 0 : J.confidence) < E
        }
      ) }),
      /* @__PURE__ */ e.jsx(k, { label: "Tedarikçi", required: !0, confidence: (Z = x.vendor) == null ? void 0 : Z.confidence, children: /* @__PURE__ */ e.jsx(
        K,
        {
          ref: h === "vendor" ? v : void 0,
          type: "text",
          required: !0,
          size: "lg",
          value: l.vendor,
          onChange: j("vendor"),
          invalid: ((X = x.vendor) == null ? void 0 : X.confidence) < E,
          placeholder: "örn. Migros A.Ş."
        }
      ) }),
      /* @__PURE__ */ e.jsx(k, { label: "Kategori", confidence: (ee = x.category) == null ? void 0 : ee.confidence, children: /* @__PURE__ */ e.jsx(
        we,
        {
          options: Be,
          value: l.category,
          onChange: (o) => b((m) => ({ ...m, category: o })),
          invalid: ((te = x.category) == null ? void 0 : te.confidence) < E,
          placeholder: "Kategori seç"
        }
      ) }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => I((o) => !o),
          className: "self-start text-sm text-text-link hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
          children: w ? "Daha az alan" : "Daha fazla alan"
        }
      ),
      w && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(k, { label: "KDV Oranı (%)", children: /* @__PURE__ */ e.jsx(
          K,
          {
            type: "number",
            step: "0.1",
            value: l.taxRate,
            onChange: j("taxRate"),
            className: "font-tabular"
          }
        ) }),
        /* @__PURE__ */ e.jsx(k, { label: "Not", children: /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: l.note,
            onChange: j("note"),
            className: z(
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
        /* @__PURE__ */ e.jsx("span", { className: "font-tabular font-semibold text-text-primary", children: typeof l.amount == "number" && l.amount > 0 ? Y(l.amount, l.currency) : "—" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ e.jsx(U.Close, { asChild: !0, children: /* @__PURE__ */ e.jsx(D, { type: "button", variant: "ghost", size: "md", children: "İptal" }) }),
        /* @__PURE__ */ e.jsx(
          D,
          {
            type: "submit",
            variant: "primary",
            size: "md",
            isLoading: i,
            loadingText: "Gönderiliyor...",
            children: "Gönder"
          }
        )
      ] })
    ] })
  ] }) }) });
}
function k({ label: t, required: n, confidence: r, children: s }) {
  const i = r != null && r < 0.95, c = r != null && r < E;
  return /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "text-sm font-medium text-text-secondary", children: [
        t,
        n && /* @__PURE__ */ e.jsx("span", { className: "text-text-negative ml-0.5", children: "*" })
      ] }),
      i && /* @__PURE__ */ e.jsx(G, { score: r, showLabel: !1, size: "sm" })
    ] }),
    s,
    c && /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-warning", children: "AI bu alandan emin değil — doğrula." })
  ] });
}
function ie(t) {
  var r, s, i, c, d, a;
  const n = (t == null ? void 0 : t.fields) ?? {};
  return {
    amount: ((r = n.amount) == null ? void 0 : r.value) ?? "",
    currency: ((s = n.currency) == null ? void 0 : s.value) ?? "TRY",
    date: ((i = n.date) == null ? void 0 : i.value) ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    vendor: ((c = n.vendor) == null ? void 0 : c.value) ?? "",
    category: ((d = n.category) == null ? void 0 : d.value) ?? "",
    taxRate: ((a = n.taxRate) == null ? void 0 : a.value) ?? 20,
    note: ""
  };
}
function Pe({ result: t, onAddAnother: n, onClose: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center justify-center gap-4 py-12 px-6 text-center", children: [
    /* @__PURE__ */ e.jsx(Ue, {}),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-xl font-semibold text-text-primary", children: "Masraf gönderildi" }),
      /* @__PURE__ */ e.jsxs("p", { className: "text-sm text-text-secondary mt-1", children: [
        (t == null ? void 0 : t.amount) && Y(t.amount, t.currency || "TRY"),
        (t == null ? void 0 : t.vendor) && ` · ${t.vendor}`
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary mt-1", children: "Onaya gitti. Bildirim ile durumu takip edebilirsin." })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 w-full max-w-xs", children: [
      /* @__PURE__ */ e.jsx(D, { variant: "primary", size: "lg", onClick: n, children: "Bir tane daha çek" }),
      /* @__PURE__ */ e.jsx(D, { variant: "ghost", size: "md", onClick: r, children: "Bitir" })
    ] })
  ] });
}
const Ue = () => /* @__PURE__ */ e.jsxs(
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
async function Ke() {
  const [t, n] = await Promise.all([
    q.get("/api/app/project?MaxResultCount=200&Sorting=name"),
    q.get("/api/app/cash-account?MaxResultCount=100")
  ]);
  return {
    projects: ((t == null ? void 0 : t.items) ?? []).map((r) => ({ id: r.id, name: r.name, currency: r.currency })),
    accounts: ((n == null ? void 0 : n.items) ?? []).map((r) => ({ id: r.id, name: r.name, currency: r.currency }))
  };
}
async function $e(t) {
  if (!t)
    return { lines: [], requiresBudgetLine: !1 };
  const n = await q.get(`/api/app/project-budget/record-form-lookup/${t}`);
  return {
    lines: ((n == null ? void 0 : n.lines) ?? []).map((r) => ({
      id: r.id,
      label: r.code ? `${r.code} · ${r.name}` : r.name,
      remaining: r.remainingAmount
    })),
    requiresBudgetLine: !!(n != null && n.requiresBudgetLine)
  };
}
function _e(t) {
  const n = Number.parseInt(t, 10);
  return Number.isInteger(n) && n >= 0 ? n : 0;
}
function fe(t) {
  return q.post("/api/app/expense", {
    title: t.title || t.vendor,
    amount: t.amount,
    currency: t.currency || "TRY",
    expenseDate: t.date,
    category: _e(t.category),
    cashAccountId: t.cashAccountId,
    projectId: t.projectId || null,
    budgetLineId: t.budgetLineId || null,
    description: t.description || t.note || null
  });
}
const xe = "apya.expenseQueue.v1";
function B() {
  try {
    const t = window.localStorage.getItem(xe), n = t ? JSON.parse(t) : [];
    return Array.isArray(n) ? n : [];
  } catch {
    return [];
  }
}
function _(t) {
  try {
    return window.localStorage.setItem(xe, JSON.stringify(t)), !0;
  } catch {
    return !1;
  }
}
function He() {
  return "q_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
}
const C = {
  /** Kuyruktaki kayıtlar (en eski önce). */
  list: B,
  count() {
    return B().length;
  },
  /**
   * Kuyruğa ekler. Depoya yazılamadıysa false döner — çağıran kullanıcıya
   * "kaydedemedik" demeli, "kaydedildi" DEMEMELİ.
   */
  enqueue(t) {
    const n = B();
    return n.push({ clientId: He(), queuedAt: (/* @__PURE__ */ new Date()).toISOString(), payload: t }), _(n);
  },
  remove(t) {
    _(B().filter((n) => n.clientId !== t));
  },
  clear() {
    _([]);
  }
};
let H = !1;
async function We(t) {
  if (H)
    return { sent: 0, failed: 0, remaining: C.count() };
  H = !0;
  let n = 0, r = 0;
  try {
    for (const s of C.list())
      try {
        await t(s.payload), C.remove(s.clientId), n++;
      } catch {
        r++;
        break;
      }
  } finally {
    H = !1;
  }
  return { sent: n, failed: r, remaining: C.count() };
}
function Ye() {
  return ue({
    mutationFn: (t) => De.ocr(t)
  });
}
function Ge() {
  return ce({
    queryKey: ["expense-capture", "context"],
    queryFn: Ke,
    staleTime: 5 * 60 * 1e3
  });
}
function Qe(t) {
  return ce({
    queryKey: ["expense-capture", "lines", t],
    queryFn: () => $e(t),
    enabled: !!t,
    staleTime: 60 * 1e3
  });
}
function Ve() {
  const [t, n] = u.useState(() => typeof navigator > "u" ? !0 : navigator.onLine !== !1), [r, s] = u.useState(() => C.count()), i = u.useCallback(() => s(C.count()), []);
  return u.useEffect(() => {
    const c = () => n(!0), d = () => n(!1);
    return window.addEventListener("online", c), window.addEventListener("offline", d), () => {
      window.removeEventListener("online", c), window.removeEventListener("offline", d);
    };
  }, []), { isOnline: t, queued: r, refreshQueued: i };
}
function Je() {
  return ue({
    retry: !1,
    /* Finansal işlem — duplicate önlenir */
    mutationFn: async (t) => {
      if (typeof navigator > "u" || navigator.onLine !== !1)
        return { queued: !1, result: await fe(t) };
      if (!C.enqueue(t))
        throw new Error("Cihazda yer kalmadı, kayıt saklanamadı. Bağlantı gelince tekrar deneyin.");
      return { queued: !0, result: null };
    }
  });
}
function Ze(t) {
  return u.useCallback(async () => {
    if (C.count() === 0)
      return null;
    const n = await We(fe);
    return t == null || t(n), n;
  }, [t]);
}
const y = { CAPTURE: "capture", OCR: "ocr", FORM: "form", SUCCESS: "success" }, Xe = 1500;
function et() {
  const [t, n] = u.useState(y.CAPTURE), [r, s] = u.useState(null), [i, c] = u.useState(null), [d, a] = u.useState(null), p = Ge(), l = Qe(d), { isOnline: b, queued: w, refreshQueued: I } = Ve(), v = Ye(), x = Je(), h = le(), j = u.useCallback(async (f) => {
    r && URL.revokeObjectURL(r), s(URL.createObjectURL(f)), n(y.OCR);
    try {
      await v.mutateAsync(f), n(y.FORM);
    } catch {
      h.warning("Otomatik okuma başarısız", {
        description: "Alanları manuel girebilirsin."
      }), n(y.FORM);
    }
  }, [r, v, h]), L = u.useCallback(() => {
    r && URL.revokeObjectURL(r), s(null), c(null), v.reset(), x.reset(), n(y.CAPTURE);
  }, [r, v, x]), F = u.useCallback(async (f) => {
    try {
      const g = await x.mutateAsync(f);
      c(g.result), n(y.SUCCESS), I(), g.queued ? h.warning("Kuyruğa alındı", {
        description: "Bağlantı yok — bağlantı gelince otomatik gönderilecek."
      }) : h.success("Masraf kaydedildi", {
        description: `${Y(f.amount, f.currency)} — ${f.vendor || "Kayıt"}`
      }), setTimeout(() => {
        L();
      }, Xe);
    } catch (g) {
      const O = ((g == null ? void 0 : g.validationErrors) ?? []).map((T) => T == null ? void 0 : T.message).filter(Boolean);
      h.error("Kayıt başarısız", {
        description: O.length ? O.join(" · ") : (g == null ? void 0 : g.message) ?? "Tekrar deneyebilirsin."
      });
    }
  }, [x, h, L, I]), A = Ze((f) => {
    I(), f.sent > 0 ? h.success(`${f.sent} kayıt gönderildi`, {
      description: f.remaining > 0 ? `${f.remaining} kayıt hâlâ kuyrukta.` : "Kuyruk boşaldı."
    }) : f.failed > 0 && h.error("Kuyruk gönderilemedi", {
      description: `${f.remaining} kayıt cihazda bekliyor.`
    });
  });
  u.useEffect(() => {
    b && A();
  }, [b, A]);
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
        w > 0 && /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: A,
            className: "inline-flex min-h-[44px] items-center gap-1 rounded-full bg-accent-subtle px-3 text-[11.5px] font-semibold text-accent",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-cloud-arrow-up" }),
              w,
              " bekliyor"
            ]
          }
        ),
        /* @__PURE__ */ e.jsx(Se, {})
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("main", { className: "max-w-2xl mx-auto p-4", children: [
      t === y.CAPTURE && /* @__PURE__ */ e.jsx(Te, { onFile: j }),
      t === y.OCR && /* @__PURE__ */ e.jsx(Ae, { previewUrl: r }),
      t === y.SUCCESS && /* @__PURE__ */ e.jsx(
        Pe,
        {
          result: i,
          onAddAnother: L,
          onClose: M
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(
      Fe,
      {
        open: t === y.FORM,
        onOpenChange: (f) => {
          f || n(y.CAPTURE);
        },
        ocrResult: v.data,
        onSubmit: F,
        isSubmitting: x.isPending,
        context: p.data,
        lines: l.data,
        onProjectChange: a,
        isOffline: !b
      }
    )
  ] });
}
je();
const oe = document.getElementById("apya-expense-capture-root");
oe && he(oe).render(
  /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsx(ve, { children: /* @__PURE__ */ e.jsx(ke, { children: /* @__PURE__ */ e.jsx(et, {}) }) }) })
);
