import { j as e, r as d, d as M, b as J } from "./react-vendor.js";
import { u as Q, t as P, B as C, c as _, S, j as T, e as X, M as Z, I as N, i as L, T as ee } from "./Dialog.js";
import { a as te } from "./QueryProvider.js";
import { u as G, C as ne, r as ae, T as re } from "./registerServiceWorker.js";
import { C as se } from "./Combobox.js";
import { b as q } from "./query-vendor.js";
/* empty css      */
const oe = {
  light: { key: "Theme:Light", fallback: "Açık tema (Sıradaki: Koyu)" },
  dark: { key: "Theme:Dark", fallback: "Koyu tema (Sıradaki: Sistem)" },
  system: { key: "Theme:System", fallback: "Sistem teması (Sıradaki: Açık)" }
};
function ie({ className: t = "" }) {
  const { preference: a, toggle: n } = Q(), i = oe[a], o = i ? P(i.key, i.fallback) : P("Theme:Toggle", "Tema değiştir");
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
        a === "light" && /* @__PURE__ */ e.jsx(le, {}),
        a === "dark" && /* @__PURE__ */ e.jsx(ce, {}),
        a === "system" && /* @__PURE__ */ e.jsx(de, {})
      ]
    }
  );
}
function le() {
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
function ce() {
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
function de() {
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
function ue({ onFile: t }) {
  const a = d.useRef(null), [n, i] = M.useState(!1), o = G(), s = d.useCallback(() => {
    var r;
    return (r = a.current) == null ? void 0 : r.click();
  }, []), c = d.useCallback((r) => {
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
        var x;
        r.preventDefault(), i(!1), c((x = r.dataTransfer.files) == null ? void 0 : x[0]);
      },
      className: _(
        "flex flex-col items-center justify-center gap-4",
        "border-2 border-dashed rounded-xl p-8",
        "min-h-[60vh] mobile:min-h-[50vh]",
        "cursor-pointer select-none",
        "transition-colors duration-fast",
        "focus-visible:outline-none focus-visible:shadow-focus",
        n ? "border-brand-500 bg-brand-50" : "border-default bg-surface-raised hover:border-strong"
      ),
      children: [
        /* @__PURE__ */ e.jsx(me, {}),
        /* @__PURE__ */ e.jsxs("div", { className: "text-center max-w-xs pointer-events-none", children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-base font-semibold text-text-primary", children: "Faturayı çek" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-secondary mt-1", children: "Mobilde direkt kamera açılır. Masaüstünde dosya sürükle ya da tıkla. AI tutarı, tarihi ve tedarikçiyi otomatik okur." })
        ] }),
        /* @__PURE__ */ e.jsx(
          C,
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
              var x;
              return c((x = r.target.files) == null ? void 0 : x[0]);
            }
          }
        )
      ]
    }
  );
}
function me() {
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
const xe = [
  "Görüntü temizleniyor...",
  "Metin tanınıyor (OCR)...",
  "Alanlar çıkartılıyor..."
];
function fe({ previewUrl: t }) {
  const [a, n] = M.useState(0);
  return M.useEffect(() => {
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
    /* @__PURE__ */ e.jsx("div", { className: "w-full max-w-xs flex flex-col gap-2", children: xe.map((i, o) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
      o < a && /* @__PURE__ */ e.jsx(he, {}),
      o === a && /* @__PURE__ */ e.jsx(be, {}),
      o > a && /* @__PURE__ */ e.jsx(pe, {}),
      /* @__PURE__ */ e.jsx("span", { className: o <= a ? "text-text-primary" : "text-text-tertiary", children: i })
    ] }, o)) }),
    /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-xs flex flex-col gap-2 mt-2", children: [
      /* @__PURE__ */ e.jsx(S, { height: 12 }),
      /* @__PURE__ */ e.jsx(S, { height: 12, className: "w-3/4" }),
      /* @__PURE__ */ e.jsx(S, { height: 12, className: "w-1/2" })
    ] })
  ] });
}
const he = () => /* @__PURE__ */ e.jsx(
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
), be = () => /* @__PURE__ */ e.jsx(
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
), pe = () => /* @__PURE__ */ e.jsx("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-neutral-300 mx-[2px] flex-none", "aria-hidden": "true" }), B = (t) => new Promise((a) => setTimeout(a, t)), K = [
  { vendor: "Migros A.Ş.", category: "Ofis Sarfiyat" },
  { vendor: "BSH Ev Aletleri", category: "Donanım" },
  { vendor: "Türk Telekom", category: "Internet/Telekom" },
  { vendor: "JetBrains s.r.o.", category: "Yazılım Lisansı" },
  { vendor: "Lufthansa", category: "Seyahat" }
];
function w(t, a) {
  const n = (a * 9301 + 49297) % 233280 / 233280;
  return Math.min(0.99, Math.max(0.4, t + (n - 0.5) * 0.2));
}
const H = {
  async ocr(t) {
    var o;
    await B(900 + Math.random() * 600);
    const a = t.size + (((o = t.name) == null ? void 0 : o.length) || 0), n = K[a % K.length], i = Math.round((50 + a % 5e5 / 100) * 100) / 100;
    return {
      confidence: w(0.8, a),
      fields: {
        amount: { value: i, confidence: w(0.92, a + 1) },
        currency: { value: "TRY", confidence: 0.99 },
        date: { value: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), confidence: w(0.86, a + 2) },
        vendor: { value: n.vendor, confidence: w(0.65, a + 3) },
        category: { value: n.category, confidence: w(0.58, a + 4) },
        taxRate: { value: 20, confidence: 0.95 }
      },
      rawText: `${n.vendor}
Tutar: ${i.toFixed(2)} TL
KDV %20`
    };
  },
  async submit(t) {
    if (await B(600), !(t != null && t.amount) || t.amount <= 0) {
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
}, j = 0.7, ve = [
  { value: "Ofis Sarfiyat", label: "Ofis Sarfiyat" },
  { value: "Donanım", label: "Donanım" },
  { value: "Yazılım Lisansı", label: "Yazılım Lisansı" },
  { value: "Internet/Telekom", label: "Internet/Telekom" },
  { value: "Seyahat", label: "Seyahat" },
  { value: "Yemek", label: "Yemek" },
  { value: "Kırtasiye", label: "Kırtasiye" },
  { value: "Diğer", label: "Diğer" }
], ge = ["TRY", "USD", "EUR"];
function ye({
  open: t,
  onOpenChange: a,
  ocrResult: n,
  onSubmit: i,
  isSubmitting: o
}) {
  var E, O, R, D, A, I, z, F;
  const [s, c] = d.useState(() => Y(n)), [r, x] = d.useState(!1), v = d.useRef(null);
  d.useEffect(() => {
    c(Y(n));
  }, [n]), d.useEffect(() => {
    if (!t || !(n != null && n.fields)) return;
    const u = setTimeout(() => {
      var l, p;
      return (p = (l = v.current) == null ? void 0 : l.focus) == null ? void 0 : p.call(l);
    }, 80);
    return () => clearTimeout(u);
  }, [t, n]);
  const m = d.useMemo(
    () => (n == null ? void 0 : n.fields) ?? {},
    [n]
  ), k = d.useMemo(() => {
    var l;
    const u = ["vendor", "category", "date", "amount"];
    for (const p of u) {
      const U = (l = m[p]) == null ? void 0 : l.confidence;
      if (U != null && U < j) return p;
    }
    return null;
  }, [m]), g = (u) => (l) => c((p) => ({ ...p, [u]: l != null && l.target ? l.target.value : l })), f = async (u) => {
    if (u.preventDefault(), o) return;
    const l = {
      ...s,
      amount: typeof s.amount == "number" ? s.amount : parseFloat(s.amount),
      taxRate: typeof s.taxRate == "number" ? s.taxRate : parseFloat(s.taxRate)
    };
    await i(l);
  }, h = (n == null ? void 0 : n.confidence) ?? 0, V = h >= 0.85 ? "Yüksek güven" : h >= 0.65 ? "Orta güven" : "Düşük güven — kontrol edin", $ = h >= 0.85 ? "positive" : h >= 0.65 ? "warning" : "critical";
  return /* @__PURE__ */ e.jsx(T, { open: t, onOpenChange: a, children: /* @__PURE__ */ e.jsx(T.Content, { title: "Masraf detayları", description: "AI tarafından okunan tutarları doğrulayın ve gönderin", children: /* @__PURE__ */ e.jsxs("form", { onSubmit: f, className: "flex flex-col h-full", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "px-4 pt-2 pb-3 border-b border-subtle flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-semibold", children: "Masraf Detayları" }),
      /* @__PURE__ */ e.jsx(X, { variant: $, size: "sm", withDot: !0, children: V })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsx(y, { label: "Tutar", required: !0, confidence: (E = m.amount) == null ? void 0 : E.confidence, children: /* @__PURE__ */ e.jsx(
        Z,
        {
          ref: k === "amount" ? v : void 0,
          value: s.amount,
          onValueChange: (u) => c((l) => ({ ...l, amount: u ?? "" })),
          currency: s.currency,
          currencies: ge,
          onCurrencyChange: (u) => c((l) => ({ ...l, currency: u })),
          size: "md",
          invalid: ((O = m.amount) == null ? void 0 : O.confidence) < j,
          required: !0,
          min: 0.01
        }
      ) }),
      /* @__PURE__ */ e.jsx(y, { label: "Tarih", required: !0, confidence: (R = m.date) == null ? void 0 : R.confidence, children: /* @__PURE__ */ e.jsx(
        N,
        {
          ref: k === "date" ? v : void 0,
          type: "date",
          required: !0,
          value: s.date,
          onChange: g("date"),
          invalid: ((D = m.date) == null ? void 0 : D.confidence) < j
        }
      ) }),
      /* @__PURE__ */ e.jsx(y, { label: "Tedarikçi", required: !0, confidence: (A = m.vendor) == null ? void 0 : A.confidence, children: /* @__PURE__ */ e.jsx(
        N,
        {
          ref: k === "vendor" ? v : void 0,
          type: "text",
          required: !0,
          value: s.vendor,
          onChange: g("vendor"),
          invalid: ((I = m.vendor) == null ? void 0 : I.confidence) < j,
          placeholder: "örn. Migros A.Ş."
        }
      ) }),
      /* @__PURE__ */ e.jsx(y, { label: "Kategori", confidence: (z = m.category) == null ? void 0 : z.confidence, children: /* @__PURE__ */ e.jsx(
        se,
        {
          options: ve,
          value: s.category,
          onChange: (u) => c((l) => ({ ...l, category: u })),
          invalid: ((F = m.category) == null ? void 0 : F.confidence) < j,
          placeholder: "Kategori seç"
        }
      ) }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => x((u) => !u),
          className: "self-start text-sm text-text-link hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
          children: r ? "Daha az alan" : "Daha fazla alan"
        }
      ),
      r && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(y, { label: "KDV Oranı (%)", children: /* @__PURE__ */ e.jsx(
          N,
          {
            type: "number",
            step: "0.1",
            value: s.taxRate,
            onChange: g("taxRate"),
            className: "font-tabular"
          }
        ) }),
        /* @__PURE__ */ e.jsx(y, { label: "Not", children: /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: s.note,
            onChange: g("note"),
            className: _(
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
        /* @__PURE__ */ e.jsx("span", { className: "font-tabular font-semibold text-text-primary", children: typeof s.amount == "number" && s.amount > 0 ? L(s.amount, s.currency) : "—" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ e.jsx(T.Close, { asChild: !0, children: /* @__PURE__ */ e.jsx(C, { type: "button", variant: "ghost", size: "md", children: "İptal" }) }),
        /* @__PURE__ */ e.jsx(
          C,
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
function y({ label: t, required: a, confidence: n, children: i }) {
  const o = n != null && n < 0.95, s = n != null && n < j;
  return /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "text-sm font-medium text-text-secondary", children: [
        t,
        a && /* @__PURE__ */ e.jsx("span", { className: "text-text-negative ml-0.5", children: "*" })
      ] }),
      o && /* @__PURE__ */ e.jsx(ne, { score: n, showLabel: !1, size: "sm" })
    ] }),
    i,
    s && /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-warning", children: "AI bu alandan emin değil — doğrula." })
  ] });
}
function Y(t) {
  var n, i, o, s, c, r;
  const a = (t == null ? void 0 : t.fields) ?? {};
  return {
    amount: ((n = a.amount) == null ? void 0 : n.value) ?? "",
    currency: ((i = a.currency) == null ? void 0 : i.value) ?? "TRY",
    date: ((o = a.date) == null ? void 0 : o.value) ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    vendor: ((s = a.vendor) == null ? void 0 : s.value) ?? "",
    category: ((c = a.category) == null ? void 0 : c.value) ?? "",
    taxRate: ((r = a.taxRate) == null ? void 0 : r.value) ?? 20,
    note: ""
  };
}
function je({ result: t, onAddAnother: a, onClose: n }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center justify-center gap-4 py-12 px-6 text-center", children: [
    /* @__PURE__ */ e.jsx(ke, {}),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-xl font-semibold text-text-primary", children: "Masraf gönderildi" }),
      /* @__PURE__ */ e.jsxs("p", { className: "text-sm text-text-secondary mt-1", children: [
        (t == null ? void 0 : t.amount) && L(t.amount, t.currency || "TRY"),
        (t == null ? void 0 : t.vendor) && ` · ${t.vendor}`
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary mt-1", children: "Onaya gitti. Bildirim ile durumu takip edebilirsin." })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 w-full max-w-xs", children: [
      /* @__PURE__ */ e.jsx(C, { variant: "primary", size: "lg", onClick: a, children: "Bir tane daha çek" }),
      /* @__PURE__ */ e.jsx(C, { variant: "ghost", size: "md", onClick: n, children: "Bitir" })
    ] })
  ] });
}
const ke = () => /* @__PURE__ */ e.jsxs(
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
function we() {
  return q({
    mutationFn: (t) => H.ocr(t)
  });
}
function Ce() {
  return q({
    mutationFn: (t) => H.submit(t),
    retry: !1
    /* Finansal işlem — duplicate önlenir */
  });
}
const b = { CAPTURE: "capture", OCR: "ocr", FORM: "form", SUCCESS: "success" }, Se = 1500;
function Te() {
  const [t, a] = d.useState(b.CAPTURE), [n, i] = d.useState(null), [o, s] = d.useState(null), c = we(), r = Ce(), x = G(), v = d.useCallback(async (f) => {
    n && URL.revokeObjectURL(n), i(URL.createObjectURL(f)), a(b.OCR);
    try {
      await c.mutateAsync(f), a(b.FORM);
    } catch {
      x.warning("Otomatik okuma başarısız", {
        description: "Alanları manuel girebilirsin."
      }), a(b.FORM);
    }
  }, [n, c, x]), m = d.useCallback(() => {
    n && URL.revokeObjectURL(n), i(null), s(null), c.reset(), r.reset(), a(b.CAPTURE);
  }, [n, c, r]), k = d.useCallback(async (f) => {
    try {
      const h = await r.mutateAsync(f);
      s(h), a(b.SUCCESS), x.success("Masraf kaydedildi", {
        description: `${L(f.amount, f.currency)} — ${f.vendor || "Kayıt"}`
      }), setTimeout(() => {
        m();
      }, Se);
    } catch (h) {
      x.error("Kayıt başarısız", {
        description: (h == null ? void 0 : h.message) ?? "Tekrar deneyebilirsin."
      });
    }
  }, [r, x, m]), g = d.useCallback(() => {
    n && URL.revokeObjectURL(n), window.location.href = "/Dashboard";
  }, [n]);
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "sticky top-0 z-sticky bg-surface-raised/95 backdrop-blur-sm border-b border-default px-4 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h1", { className: "text-base font-semibold", children: "Masraf Yakala" }),
      /* @__PURE__ */ e.jsx(ie, {})
    ] }),
    /* @__PURE__ */ e.jsxs("main", { className: "max-w-2xl mx-auto p-4", children: [
      t === b.CAPTURE && /* @__PURE__ */ e.jsx(ue, { onFile: v }),
      t === b.OCR && /* @__PURE__ */ e.jsx(fe, { previewUrl: n }),
      t === b.SUCCESS && /* @__PURE__ */ e.jsx(
        je,
        {
          result: o,
          onAddAnother: m,
          onClose: g
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(
      ye,
      {
        open: t === b.FORM,
        onOpenChange: (f) => {
          f || a(b.CAPTURE);
        },
        ocrResult: c.data,
        onSubmit: k,
        isSubmitting: r.isPending
      }
    )
  ] });
}
ae();
const W = document.getElementById("apya-expense-capture-root");
W && J(W).render(
  /* @__PURE__ */ e.jsx(ee, { children: /* @__PURE__ */ e.jsx(te, { children: /* @__PURE__ */ e.jsx(re, { children: /* @__PURE__ */ e.jsx(Te, {}) }) }) })
);
