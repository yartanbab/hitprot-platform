import { j as e, r as d, d as E, b as ee } from "./react-vendor-D57GAUXd.js";
import { u as te, t as y, B as N, c as S, S as M, d as T, g as ne, M as ae, I as L, b as O, T as re } from "./Dialog-CkwGYc9B.js";
import { a as se } from "./QueryProvider-B2D_02u4.js";
import { u as V, r as oe, T as ie } from "./registerServiceWorker-CDEE3OMo.js";
import { C as le } from "./Combobox-C65C_5XI.js";
import { b as $ } from "./query-vendor-D4__WO2j.js";
/* empty css               */
const ce = {
  light: { key: "Theme:Light", fallback: "Açık tema (Sıradaki: Koyu)" },
  dark: { key: "Theme:Dark", fallback: "Koyu tema (Sıradaki: Sistem)" },
  system: { key: "Theme:System", fallback: "Sistem teması (Sıradaki: Açık)" }
};
function de({ className: t = "" }) {
  const { preference: a, toggle: n } = te(), i = ce[a], o = i ? y(i.key, i.fallback) : y("Theme:Toggle", "Tema değiştir");
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: n,
      "aria-label": o,
      title: o,
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
        a === "light" && /* @__PURE__ */ e.jsx(ue, {}),
        a === "dark" && /* @__PURE__ */ e.jsx(me, {}),
        a === "system" && /* @__PURE__ */ e.jsx(xe, {})
      ]
    }
  );
}
function ue() {
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
function me() {
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
function xe() {
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
function fe({ onFile: t }) {
  const a = d.useRef(null), [n, i] = E.useState(!1), o = V(), s = d.useCallback(() => {
    var r;
    return (r = a.current) == null ? void 0 : r.click();
  }, []), l = d.useCallback((r) => {
    if (r) {
      if (!r.type.startsWith("image/")) {
        o.error("Resim dosyası gerekli", {
          description: "Lütfen JPG/PNG/HEIC fatura görseli seç."
        });
        return;
      }
      if (r.size > 10 * 1024 * 1024) {
        o.error("Dosya çok büyük", {
          description: "En fazla 10 MB. Lütfen daha düşük çözünürlükte çek."
        });
        return;
      }
      t(r);
    }
  }, [t, o]);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "button",
      tabIndex: 0,
      "aria-label": "Faturayı çek — kamerayı aç ya da görüntü sürükle",
      onClick: s,
      onKeyDown: (r) => {
        (r.key === "Enter" || r.key === " ") && (r.preventDefault(), s());
      },
      onDragOver: (r) => {
        r.preventDefault(), i(!0);
      },
      onDragLeave: () => i(!1),
      onDrop: (r) => {
        var u;
        r.preventDefault(), i(!1), l((u = r.dataTransfer.files) == null ? void 0 : u[0]);
      },
      className: S(
        "flex flex-col items-center justify-center gap-4",
        "border-2 border-dashed rounded-xl p-8",
        "min-h-[60vh] mobile:min-h-[50vh]",
        "cursor-pointer select-none",
        "transition-colors duration-fast",
        "focus-visible:outline-none focus-visible:shadow-focus",
        n ? "border-brand-500 bg-brand-50" : "border-default bg-surface-raised hover:border-strong"
      ),
      children: [
        /* @__PURE__ */ e.jsx(he, {}),
        /* @__PURE__ */ e.jsxs("div", { className: "text-center max-w-xs pointer-events-none", children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-base font-semibold text-text-primary", children: "Faturayı çek" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-secondary mt-1", children: "Mobilde direkt kamera açılır. Masaüstünde dosya sürükle ya da tıkla. AI tutarı, tarihi ve tedarikçiyi otomatik okur." })
        ] }),
        /* @__PURE__ */ e.jsx(
          N,
          {
            size: "lg",
            variant: "primary",
            onClick: (r) => {
              r.stopPropagation(), s();
            },
            className: "min-w-[220px]",
            children: "Kamerayı Aç"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            ref: a,
            type: "file",
            accept: "image/*",
            capture: "environment",
            className: "sr-only",
            onChange: (r) => {
              var u;
              return l((u = r.target.files) == null ? void 0 : u[0]);
            }
          }
        )
      ]
    }
  );
}
function he() {
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
const ge = [
  "Görüntü temizleniyor...",
  "Metin tanınıyor (OCR)...",
  "Alanlar çıkartılıyor..."
];
function be({ previewUrl: t }) {
  const [a, n] = E.useState(0);
  return E.useEffect(() => {
    const i = setTimeout(() => n(1), 350), o = setTimeout(() => n(2), 800);
    return () => {
      clearTimeout(i), clearTimeout(o);
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
    /* @__PURE__ */ e.jsx("div", { className: "w-full max-w-xs flex flex-col gap-2", children: ge.map((i, o) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
      o < a && /* @__PURE__ */ e.jsx(pe, {}),
      o === a && /* @__PURE__ */ e.jsx(ve, {}),
      o > a && /* @__PURE__ */ e.jsx(ye, {}),
      /* @__PURE__ */ e.jsx("span", { className: o <= a ? "text-text-primary" : "text-text-tertiary", children: i })
    ] }, o)) }),
    /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-xs flex flex-col gap-2 mt-2", children: [
      /* @__PURE__ */ e.jsx(M, { height: 12 }),
      /* @__PURE__ */ e.jsx(M, { height: 12, className: "w-3/4" }),
      /* @__PURE__ */ e.jsx(M, { height: 12, className: "w-1/2" })
    ] })
  ] });
}
const pe = () => /* @__PURE__ */ e.jsx(
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
), ve = () => /* @__PURE__ */ e.jsx(
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
), ye = () => /* @__PURE__ */ e.jsx("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-neutral-300 mx-[2px] flex-none", "aria-hidden": "true" }), K = {
  sm: { dot: "h-1 w-1", gap: "gap-0.5" },
  md: { dot: "h-1.5 w-1.5", gap: "gap-0.5" },
  lg: { dot: "h-2 w-2", gap: "gap-1" }
};
function q(t) {
  return typeof t != "number" || !Number.isFinite(t) ? 0 : t > 1 ? Math.max(0, Math.min(100, t)) / 100 : Math.max(0, Math.min(1, t));
}
function J(t) {
  return t >= 0.85 ? { dots: 5, label: y("Ai:Confidence:VeryHigh", "Çok yüksek güven") } : t >= 0.7 ? { dots: 4, label: y("Ai:Confidence:High", "Yüksek güven") } : t >= 0.5 ? { dots: 3, label: y("Ai:Confidence:Medium", "Orta güven") } : t >= 0.3 ? { dots: 2, label: y("Ai:Confidence:Low", "Düşük güven") } : { dots: 1, label: y("Ai:Confidence:VeryLow", "Çok düşük güven") };
}
function A({ score: t, label: a, size: n = "md", showLabel: i = !0, className: o }) {
  const s = q(t), l = J(s), r = K[n] ?? K.md, u = a ?? l.label, b = Math.round(s * 100);
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: S("inline-flex items-center gap-1 text-xs text-text-tertiary", o),
      title: `${l.label} (%${b})`,
      children: [
        /* @__PURE__ */ e.jsx("span", { className: S("inline-flex items-center", r.gap), "aria-hidden": "true", children: Array.from({ length: 5 }, (m, p) => /* @__PURE__ */ e.jsx(
          "span",
          {
            className: S(
              "inline-block rounded-full",
              r.dot,
              p < l.dots ? "bg-ai-500" : "bg-neutral-200"
            )
          },
          p
        )) }),
        i && /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: u }),
        /* @__PURE__ */ e.jsxs("span", { className: "sr-only", children: [
          "Güven düzeyi: ",
          l.label,
          " (%",
          b,
          ")"
        ] })
      ]
    }
  );
}
A.bandFor = J;
A.normalize = q;
const W = (t) => new Promise((a) => setTimeout(a, t)), _ = [
  { vendor: "Migros A.Ş.", category: "Ofis Sarfiyat" },
  { vendor: "BSH Ev Aletleri", category: "Donanım" },
  { vendor: "Türk Telekom", category: "Internet/Telekom" },
  { vendor: "JetBrains s.r.o.", category: "Yazılım Lisansı" },
  { vendor: "Lufthansa", category: "Seyahat" }
];
function C(t, a) {
  const n = (a * 9301 + 49297) % 233280 / 233280;
  return Math.min(0.99, Math.max(0.4, t + (n - 0.5) * 0.2));
}
const Q = {
  async ocr(t) {
    var o;
    await W(900 + Math.random() * 600);
    const a = t.size + (((o = t.name) == null ? void 0 : o.length) || 0), n = _[a % _.length], i = Math.round((50 + a % 5e5 / 100) * 100) / 100;
    return {
      confidence: C(0.8, a),
      fields: {
        amount: { value: i, confidence: C(0.92, a + 1) },
        currency: { value: "TRY", confidence: 0.99 },
        date: { value: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), confidence: C(0.86, a + 2) },
        vendor: { value: n.vendor, confidence: C(0.65, a + 3) },
        category: { value: n.category, confidence: C(0.58, a + 4) },
        taxRate: { value: 20, confidence: 0.95 }
      },
      rawText: `${n.vendor}
Tutar: ${i.toFixed(2)} TL
KDV %20`
    };
  },
  async submit(t) {
    if (await W(600), !(t != null && t.amount) || t.amount <= 0) {
      const a = new Error("Tutar geçersiz.");
      throw a.status = 400, a;
    }
    return {
      id: "exp-" + Math.random().toString(36).slice(2, 9),
      ...t,
      status: "submitted",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
}, w = 0.7, je = [
  { value: "Ofis Sarfiyat", label: "Ofis Sarfiyat" },
  { value: "Donanım", label: "Donanım" },
  { value: "Yazılım Lisansı", label: "Yazılım Lisansı" },
  { value: "Internet/Telekom", label: "Internet/Telekom" },
  { value: "Seyahat", label: "Seyahat" },
  { value: "Yemek", label: "Yemek" },
  { value: "Kırtasiye", label: "Kırtasiye" },
  { value: "Diğer", label: "Diğer" }
], ke = ["TRY", "USD", "EUR"];
function we({
  open: t,
  onOpenChange: a,
  ocrResult: n,
  onSubmit: i,
  isSubmitting: o
}) {
  var D, R, z, I, F, U, P, B;
  const [s, l] = d.useState(() => G(n)), [r, u] = d.useState(!1), b = d.useRef(null);
  d.useEffect(() => {
    l(G(n));
  }, [n]), d.useEffect(() => {
    if (!t || !(n != null && n.fields)) return;
    const x = setTimeout(() => {
      var c, v;
      return (v = (c = b.current) == null ? void 0 : c.focus) == null ? void 0 : v.call(c);
    }, 80);
    return () => clearTimeout(x);
  }, [t, n]);
  const m = d.useMemo(
    () => (n == null ? void 0 : n.fields) ?? {},
    [n]
  ), p = d.useMemo(() => {
    var c;
    const x = ["vendor", "category", "date", "amount"];
    for (const v of x) {
      const Y = (c = m[v]) == null ? void 0 : c.confidence;
      if (Y != null && Y < w) return v;
    }
    return null;
  }, [m]), j = (x) => (c) => l((v) => ({ ...v, [x]: c != null && c.target ? c.target.value : c })), f = async (x) => {
    if (x.preventDefault(), o) return;
    const c = {
      ...s,
      amount: typeof s.amount == "number" ? s.amount : parseFloat(s.amount),
      taxRate: typeof s.taxRate == "number" ? s.taxRate : parseFloat(s.taxRate)
    };
    await i(c);
  }, h = (n == null ? void 0 : n.confidence) ?? 0, Z = h >= 0.85 ? "Yüksek güven" : h >= 0.65 ? "Orta güven" : "Düşük güven — kontrol edin", X = h >= 0.85 ? "positive" : h >= 0.65 ? "warning" : "critical";
  return /* @__PURE__ */ e.jsx(T, { open: t, onOpenChange: a, children: /* @__PURE__ */ e.jsx(T.Content, { title: "Masraf detayları", description: "AI tarafından okunan tutarları doğrulayın ve gönderin", children: /* @__PURE__ */ e.jsxs("form", { onSubmit: f, className: "flex flex-col h-full", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "px-4 pt-2 pb-3 border-b border-subtle flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-semibold", children: "Masraf Detayları" }),
      /* @__PURE__ */ e.jsx(ne, { variant: X, size: "sm", withDot: !0, children: Z })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsx(k, { label: "Tutar", required: !0, confidence: (D = m.amount) == null ? void 0 : D.confidence, children: /* @__PURE__ */ e.jsx(
        ae,
        {
          ref: p === "amount" ? b : void 0,
          value: s.amount,
          onValueChange: (x) => l((c) => ({ ...c, amount: x ?? "" })),
          currency: s.currency,
          currencies: ke,
          onCurrencyChange: (x) => l((c) => ({ ...c, currency: x })),
          size: "lg",
          invalid: ((R = m.amount) == null ? void 0 : R.confidence) < w,
          required: !0,
          min: 0.01
        }
      ) }),
      /* @__PURE__ */ e.jsx(k, { label: "Tarih", required: !0, confidence: (z = m.date) == null ? void 0 : z.confidence, children: /* @__PURE__ */ e.jsx(
        L,
        {
          ref: p === "date" ? b : void 0,
          type: "date",
          required: !0,
          size: "lg",
          value: s.date,
          onChange: j("date"),
          invalid: ((I = m.date) == null ? void 0 : I.confidence) < w
        }
      ) }),
      /* @__PURE__ */ e.jsx(k, { label: "Tedarikçi", required: !0, confidence: (F = m.vendor) == null ? void 0 : F.confidence, children: /* @__PURE__ */ e.jsx(
        L,
        {
          ref: p === "vendor" ? b : void 0,
          type: "text",
          required: !0,
          size: "lg",
          value: s.vendor,
          onChange: j("vendor"),
          invalid: ((U = m.vendor) == null ? void 0 : U.confidence) < w,
          placeholder: "örn. Migros A.Ş."
        }
      ) }),
      /* @__PURE__ */ e.jsx(k, { label: "Kategori", confidence: (P = m.category) == null ? void 0 : P.confidence, children: /* @__PURE__ */ e.jsx(
        le,
        {
          options: je,
          value: s.category,
          onChange: (x) => l((c) => ({ ...c, category: x })),
          invalid: ((B = m.category) == null ? void 0 : B.confidence) < w,
          placeholder: "Kategori seç"
        }
      ) }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => u((x) => !x),
          className: "self-start text-sm text-text-link hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
          children: r ? "Daha az alan" : "Daha fazla alan"
        }
      ),
      r && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(k, { label: "KDV Oranı (%)", children: /* @__PURE__ */ e.jsx(
          L,
          {
            type: "number",
            step: "0.1",
            value: s.taxRate,
            onChange: j("taxRate"),
            className: "font-tabular"
          }
        ) }),
        /* @__PURE__ */ e.jsx(k, { label: "Not", children: /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: s.note,
            onChange: j("note"),
            className: S(
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
        /* @__PURE__ */ e.jsx("span", { className: "font-tabular font-semibold text-text-primary", children: typeof s.amount == "number" && s.amount > 0 ? O(s.amount, s.currency) : "—" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ e.jsx(T.Close, { asChild: !0, children: /* @__PURE__ */ e.jsx(N, { type: "button", variant: "ghost", size: "md", children: "İptal" }) }),
        /* @__PURE__ */ e.jsx(
          N,
          {
            type: "submit",
            variant: "primary",
            size: "md",
            isLoading: o,
            loadingText: "Gönderiliyor...",
            children: "Gönder"
          }
        )
      ] })
    ] })
  ] }) }) });
}
function k({ label: t, required: a, confidence: n, children: i }) {
  const o = n != null && n < 0.95, s = n != null && n < w;
  return /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "text-sm font-medium text-text-secondary", children: [
        t,
        a && /* @__PURE__ */ e.jsx("span", { className: "text-text-negative ml-0.5", children: "*" })
      ] }),
      o && /* @__PURE__ */ e.jsx(A, { score: n, showLabel: !1, size: "sm" })
    ] }),
    i,
    s && /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-warning", children: "AI bu alandan emin değil — doğrula." })
  ] });
}
function G(t) {
  var n, i, o, s, l, r;
  const a = (t == null ? void 0 : t.fields) ?? {};
  return {
    amount: ((n = a.amount) == null ? void 0 : n.value) ?? "",
    currency: ((i = a.currency) == null ? void 0 : i.value) ?? "TRY",
    date: ((o = a.date) == null ? void 0 : o.value) ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    vendor: ((s = a.vendor) == null ? void 0 : s.value) ?? "",
    category: ((l = a.category) == null ? void 0 : l.value) ?? "",
    taxRate: ((r = a.taxRate) == null ? void 0 : r.value) ?? 20,
    note: ""
  };
}
function Ce({ result: t, onAddAnother: a, onClose: n }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center justify-center gap-4 py-12 px-6 text-center", children: [
    /* @__PURE__ */ e.jsx(Se, {}),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-xl font-semibold text-text-primary", children: "Masraf gönderildi" }),
      /* @__PURE__ */ e.jsxs("p", { className: "text-sm text-text-secondary mt-1", children: [
        (t == null ? void 0 : t.amount) && O(t.amount, t.currency || "TRY"),
        (t == null ? void 0 : t.vendor) && ` · ${t.vendor}`
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary mt-1", children: "Onaya gitti. Bildirim ile durumu takip edebilirsin." })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 w-full max-w-xs", children: [
      /* @__PURE__ */ e.jsx(N, { variant: "primary", size: "lg", onClick: a, children: "Bir tane daha çek" }),
      /* @__PURE__ */ e.jsx(N, { variant: "ghost", size: "md", onClick: n, children: "Bitir" })
    ] })
  ] });
}
const Se = () => /* @__PURE__ */ e.jsxs(
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
function Ne() {
  return $({
    mutationFn: (t) => Q.ocr(t)
  });
}
function Me() {
  return $({
    mutationFn: (t) => Q.submit(t),
    retry: !1
    /* Finansal işlem — duplicate önlenir */
  });
}
const g = { CAPTURE: "capture", OCR: "ocr", FORM: "form", SUCCESS: "success" }, Te = 1500;
function Le() {
  const [t, a] = d.useState(g.CAPTURE), [n, i] = d.useState(null), [o, s] = d.useState(null), l = Ne(), r = Me(), u = V(), b = d.useCallback(async (f) => {
    n && URL.revokeObjectURL(n), i(URL.createObjectURL(f)), a(g.OCR);
    try {
      await l.mutateAsync(f), a(g.FORM);
    } catch {
      u.warning("Otomatik okuma başarısız", {
        description: "Alanları manuel girebilirsin."
      }), a(g.FORM);
    }
  }, [n, l, u]), m = d.useCallback(() => {
    n && URL.revokeObjectURL(n), i(null), s(null), l.reset(), r.reset(), a(g.CAPTURE);
  }, [n, l, r]), p = d.useCallback(async (f) => {
    try {
      const h = await r.mutateAsync(f);
      s(h), a(g.SUCCESS), u.success("Masraf kaydedildi", {
        description: `${O(f.amount, f.currency)} — ${f.vendor || "Kayıt"}`
      }), setTimeout(() => {
        m();
      }, Te);
    } catch (h) {
      u.error("Kayıt başarısız", {
        description: (h == null ? void 0 : h.message) ?? "Tekrar deneyebilirsin."
      });
    }
  }, [r, u, m]), j = d.useCallback(() => {
    n && URL.revokeObjectURL(n), window.location.href = "/Dashboard";
  }, [n]);
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "sticky top-0 z-sticky bg-surface-raised/95 backdrop-blur-sm border-b border-default px-4 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h1", { className: "text-base font-semibold", children: "Masraf Yakala" }),
      /* @__PURE__ */ e.jsx(de, {})
    ] }),
    /* @__PURE__ */ e.jsxs("main", { className: "max-w-2xl mx-auto p-4", children: [
      t === g.CAPTURE && /* @__PURE__ */ e.jsx(fe, { onFile: b }),
      t === g.OCR && /* @__PURE__ */ e.jsx(be, { previewUrl: n }),
      t === g.SUCCESS && /* @__PURE__ */ e.jsx(
        Ce,
        {
          result: o,
          onAddAnother: m,
          onClose: j
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(
      we,
      {
        open: t === g.FORM,
        onOpenChange: (f) => {
          f || a(g.CAPTURE);
        },
        ocrResult: l.data,
        onSubmit: p,
        isSubmitting: r.isPending
      }
    )
  ] });
}
oe();
const H = document.getElementById("apya-expense-capture-root");
H && ee(H).render(
  /* @__PURE__ */ e.jsx(re, { children: /* @__PURE__ */ e.jsx(se, { children: /* @__PURE__ */ e.jsx(ie, { children: /* @__PURE__ */ e.jsx(Le, {}) }) }) })
);
