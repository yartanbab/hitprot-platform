import { r as l, j as e, d as K, b as Z } from "./react-vendor.js";
import { I as F, c as R, m as ee, u as H, B as A, S as P, j as B, e as te, M as ne, h as Y, i as ae, r as re, T as se, k as ie, l as oe } from "./registerServiceWorker.js";
import { b as V } from "./query-vendor.js";
/* empty css      */
function le(t, a) {
  const n = a.trim().toLowerCase();
  return n ? t.filter((c) => String(c.label).toLowerCase().includes(n)) : t;
}
function ce({
  options: t = [],
  value: a,
  onChange: n,
  placeholder: c = "Seçim yap",
  onSearch: o,
  /* opsiyonel — async/server-side filter caller'a */
  size: i,
  invalid: u,
  disabled: s,
  emptyMessage: b = "Eşleşme bulunamadı",
  className: j,
  listMaxHeight: v = 240,
  ...w
}) {
  const [h, f] = l.useState(!1), [p, N] = l.useState(""), [k, C] = l.useState(0), M = l.useRef(null), D = l.useRef(null), S = l.useId(), T = l.useMemo(
    () => t.find((r) => r.value === a),
    [t, a]
  ), y = l.useMemo(() => o ? t : le(t, p), [t, p, o]), I = h ? p : (T == null ? void 0 : T.label) ?? "", z = l.useCallback((r) => {
    const m = r.target.value;
    N(m), f(!0), C(0), o == null || o(m);
  }, [o]), x = l.useCallback((r) => {
    var m;
    !r || r.disabled || (n == null || n(r.value), N(""), f(!1), (m = D.current) == null || m.blur());
  }, [n]), d = l.useCallback((r) => {
    s || (r.key === "ArrowDown" ? (r.preventDefault(), f(!0), C((m) => Math.min(m + 1, y.length - 1))) : r.key === "ArrowUp" ? (r.preventDefault(), C((m) => Math.max(m - 1, 0))) : r.key === "Enter" ? h && y[k] && (r.preventDefault(), x(y[k])) : r.key === "Escape" && h && (r.preventDefault(), f(!1), N("")));
  }, [h, k, y, x, s]);
  return l.useEffect(() => {
    if (!h) return;
    const r = (m) => {
      M.current && !M.current.contains(m.target) && (f(!1), N(""));
    };
    return document.addEventListener("mousedown", r), () => document.removeEventListener("mousedown", r);
  }, [h]), /* @__PURE__ */ e.jsxs(
    "div",
    {
      ref: M,
      className: R("relative", j),
      children: [
        /* @__PURE__ */ e.jsx(
          F,
          {
            ref: D,
            role: "combobox",
            "aria-controls": S,
            "aria-expanded": h,
            "aria-autocomplete": "list",
            "aria-activedescendant": h && y[k] ? `${S}-opt-${k}` : void 0,
            value: I,
            placeholder: c,
            disabled: s,
            invalid: u,
            size: i,
            onFocus: () => f(!0),
            onChange: z,
            onKeyDown: d,
            trailing: /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary text-xs", "aria-hidden": "true", children: h ? "▲" : "▼" }),
            ...w
          }
        ),
        h && /* @__PURE__ */ e.jsx(
          "ul",
          {
            id: S,
            role: "listbox",
            style: { maxHeight: v },
            className: R(
              "absolute z-popover left-0 right-0 mt-1",
              "bg-surface-raised border border-default rounded-md shadow-lg",
              "overflow-y-auto",
              "py-1"
            ),
            children: y.length === 0 ? /* @__PURE__ */ e.jsx("li", { className: "px-3 py-2 text-sm text-text-tertiary", children: b }) : y.map((r, m) => {
              const U = r.value === a, Q = m === k;
              return /* @__PURE__ */ e.jsxs(
                "li",
                {
                  id: `${S}-opt-${m}`,
                  role: "option",
                  "aria-selected": U,
                  "aria-disabled": r.disabled || void 0,
                  onMouseDown: (X) => {
                    X.preventDefault(), x(r);
                  },
                  onMouseEnter: () => C(m),
                  className: R(
                    "px-3 py-1.5 text-sm cursor-pointer flex items-center gap-2",
                    r.disabled && "text-text-disabled cursor-not-allowed",
                    Q && !r.disabled && "bg-surface-elevated",
                    U && "font-medium text-brand-700"
                  ),
                  children: [
                    r.leading && /* @__PURE__ */ e.jsx("span", { className: "flex-none", children: r.leading }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate", children: r.label }),
                    U && /* @__PURE__ */ e.jsx("span", { className: "flex-none text-brand-600 text-xs", "aria-hidden": "true", children: "✓" })
                  ]
                },
                r.value ?? m
              );
            })
          }
        )
      ]
    }
  );
}
const W = {
  light: "Açık tema (Sıradaki: Koyu)",
  dark: "Koyu tema (Sıradaki: Sistem)",
  system: "Sistem teması (Sıradaki: Açık)"
};
function de({ className: t = "" }) {
  const { preference: a, toggle: n } = ee();
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: n,
      "aria-label": W[a] ?? "Tema değiştir",
      title: W[a] ?? "Tema değiştir",
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
        a === "dark" && /* @__PURE__ */ e.jsx(xe, {}),
        a === "system" && /* @__PURE__ */ e.jsx(me, {})
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
function xe() {
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
function me() {
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
  const a = l.useRef(null), [n, c] = K.useState(!1), o = H(), i = l.useCallback(() => {
    var s;
    return (s = a.current) == null ? void 0 : s.click();
  }, []), u = l.useCallback((s) => {
    if (s) {
      if (!s.type.startsWith("image/")) {
        o.error("Resim dosyası gerekli", {
          description: "Lütfen JPG/PNG/HEIC fatura görseli seç."
        });
        return;
      }
      if (s.size > 10 * 1024 * 1024) {
        o.error("Dosya çok büyük", {
          description: "En fazla 10 MB. Lütfen daha düşük çözünürlükte çek."
        });
        return;
      }
      t(s);
    }
  }, [t, o]);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "button",
      tabIndex: 0,
      "aria-label": "Faturayı çek — kamerayı aç ya da görüntü sürükle",
      onClick: i,
      onKeyDown: (s) => {
        (s.key === "Enter" || s.key === " ") && (s.preventDefault(), i());
      },
      onDragOver: (s) => {
        s.preventDefault(), c(!0);
      },
      onDragLeave: () => c(!1),
      onDrop: (s) => {
        var b;
        s.preventDefault(), c(!1), u((b = s.dataTransfer.files) == null ? void 0 : b[0]);
      },
      className: R(
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
          A,
          {
            size: "lg",
            variant: "primary",
            onClick: (s) => {
              s.stopPropagation(), i();
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
            onChange: (s) => {
              var b;
              return u((b = s.target.files) == null ? void 0 : b[0]);
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
const ve = [
  "Görüntü temizleniyor...",
  "Metin tanınıyor (OCR)...",
  "Alanlar çıkartılıyor..."
];
function be({ previewUrl: t }) {
  const [a, n] = K.useState(0);
  return K.useEffect(() => {
    const c = setTimeout(() => n(1), 350), o = setTimeout(() => n(2), 800);
    return () => {
      clearTimeout(c), clearTimeout(o);
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
    /* @__PURE__ */ e.jsx("div", { className: "w-full max-w-xs flex flex-col gap-2", children: ve.map((c, o) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
      o < a && /* @__PURE__ */ e.jsx(pe, {}),
      o === a && /* @__PURE__ */ e.jsx(ge, {}),
      o > a && /* @__PURE__ */ e.jsx(ye, {}),
      /* @__PURE__ */ e.jsx("span", { className: o <= a ? "text-text-primary" : "text-text-tertiary", children: c })
    ] }, o)) }),
    /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-xs flex flex-col gap-2 mt-2", children: [
      /* @__PURE__ */ e.jsx(P, { height: 12 }),
      /* @__PURE__ */ e.jsx(P, { height: 12, className: "w-3/4" }),
      /* @__PURE__ */ e.jsx(P, { height: 12, className: "w-1/2" })
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
), ge = () => /* @__PURE__ */ e.jsx(
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
), ye = () => /* @__PURE__ */ e.jsx("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-neutral-300 mx-[2px] flex-none", "aria-hidden": "true" }), $ = (t) => new Promise((a) => setTimeout(a, t)), q = [
  { vendor: "Migros A.Ş.", category: "Ofis Sarfiyat" },
  { vendor: "BSH Ev Aletleri", category: "Donanım" },
  { vendor: "Türk Telekom", category: "Internet/Telekom" },
  { vendor: "JetBrains s.r.o.", category: "Yazılım Lisansı" },
  { vendor: "Lufthansa", category: "Seyahat" }
];
function O(t, a) {
  const n = (a * 9301 + 49297) % 233280 / 233280;
  return Math.min(0.99, Math.max(0.4, t + (n - 0.5) * 0.2));
}
const J = {
  async ocr(t) {
    var o;
    await $(900 + Math.random() * 600);
    const a = t.size + (((o = t.name) == null ? void 0 : o.length) || 0), n = q[a % q.length], c = Math.round((50 + a % 5e5 / 100) * 100) / 100;
    return {
      confidence: O(0.8, a),
      fields: {
        amount: { value: c, confidence: O(0.92, a + 1) },
        currency: { value: "TRY", confidence: 0.99 },
        date: { value: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), confidence: O(0.86, a + 2) },
        vendor: { value: n.vendor, confidence: O(0.65, a + 3) },
        category: { value: n.category, confidence: O(0.58, a + 4) },
        taxRate: { value: 20, confidence: 0.95 }
      },
      rawText: `${n.vendor}
Tutar: ${c.toFixed(2)} TL
KDV %20`
    };
  },
  async submit(t) {
    if (await $(600), !(t != null && t.amount) || t.amount <= 0) {
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
}, E = 0.7, je = [
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
  onSubmit: c,
  isSubmitting: o
}) {
  var C, M, D, S, T, y, I, z;
  const [i, u] = l.useState(() => _(n)), [s, b] = l.useState(!1), j = l.useRef(null);
  l.useEffect(() => {
    u(_(n));
  }, [n]), l.useEffect(() => {
    if (!t || !(n != null && n.fields)) return;
    const x = setTimeout(() => {
      var d, r;
      return (r = (d = j.current) == null ? void 0 : d.focus) == null ? void 0 : r.call(d);
    }, 80);
    return () => clearTimeout(x);
  }, [t, n]);
  const v = l.useMemo(
    () => (n == null ? void 0 : n.fields) ?? {},
    [n]
  ), w = l.useMemo(() => {
    var d;
    const x = ["vendor", "category", "date", "amount"];
    for (const r of x) {
      const m = (d = v[r]) == null ? void 0 : d.confidence;
      if (m != null && m < E) return r;
    }
    return null;
  }, [v]), h = (x) => (d) => u((r) => ({ ...r, [x]: d != null && d.target ? d.target.value : d })), f = async (x) => {
    if (x.preventDefault(), o) return;
    const d = {
      ...i,
      amount: typeof i.amount == "number" ? i.amount : parseFloat(i.amount),
      taxRate: typeof i.taxRate == "number" ? i.taxRate : parseFloat(i.taxRate)
    };
    await c(d);
  }, p = (n == null ? void 0 : n.confidence) ?? 0, N = p >= 0.85 ? "Yüksek güven" : p >= 0.65 ? "Orta güven" : "Düşük güven — kontrol edin", k = p >= 0.85 ? "positive" : p >= 0.65 ? "warning" : "critical";
  return /* @__PURE__ */ e.jsx(B, { open: t, onOpenChange: a, children: /* @__PURE__ */ e.jsx(B.Content, { title: "Masraf detayları", description: "AI tarafından okunan tutarları doğrulayın ve gönderin", children: /* @__PURE__ */ e.jsxs("form", { onSubmit: f, className: "flex flex-col h-full", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "px-4 pt-2 pb-3 border-b border-subtle flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-semibold", children: "Masraf Detayları" }),
      /* @__PURE__ */ e.jsx(te, { variant: k, size: "sm", withDot: !0, children: N })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsx(L, { label: "Tutar", required: !0, confidence: (C = v.amount) == null ? void 0 : C.confidence, children: /* @__PURE__ */ e.jsx(
        ne,
        {
          ref: w === "amount" ? j : void 0,
          value: i.amount,
          onValueChange: (x) => u((d) => ({ ...d, amount: x ?? "" })),
          currency: i.currency,
          currencies: ke,
          onCurrencyChange: (x) => u((d) => ({ ...d, currency: x })),
          size: "md",
          invalid: ((M = v.amount) == null ? void 0 : M.confidence) < E,
          required: !0,
          min: 0.01
        }
      ) }),
      /* @__PURE__ */ e.jsx(L, { label: "Tarih", required: !0, confidence: (D = v.date) == null ? void 0 : D.confidence, children: /* @__PURE__ */ e.jsx(
        F,
        {
          ref: w === "date" ? j : void 0,
          type: "date",
          required: !0,
          value: i.date,
          onChange: h("date"),
          invalid: ((S = v.date) == null ? void 0 : S.confidence) < E
        }
      ) }),
      /* @__PURE__ */ e.jsx(L, { label: "Tedarikçi", required: !0, confidence: (T = v.vendor) == null ? void 0 : T.confidence, children: /* @__PURE__ */ e.jsx(
        F,
        {
          ref: w === "vendor" ? j : void 0,
          type: "text",
          required: !0,
          value: i.vendor,
          onChange: h("vendor"),
          invalid: ((y = v.vendor) == null ? void 0 : y.confidence) < E,
          placeholder: "örn. Migros A.Ş."
        }
      ) }),
      /* @__PURE__ */ e.jsx(L, { label: "Kategori", confidence: (I = v.category) == null ? void 0 : I.confidence, children: /* @__PURE__ */ e.jsx(
        ce,
        {
          options: je,
          value: i.category,
          onChange: (x) => u((d) => ({ ...d, category: x })),
          invalid: ((z = v.category) == null ? void 0 : z.confidence) < E,
          placeholder: "Kategori seç"
        }
      ) }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => b((x) => !x),
          className: "self-start text-sm text-text-link hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
          children: s ? "Daha az alan" : "Daha fazla alan"
        }
      ),
      s && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(L, { label: "KDV Oranı (%)", children: /* @__PURE__ */ e.jsx(
          F,
          {
            type: "number",
            step: "0.1",
            value: i.taxRate,
            onChange: h("taxRate"),
            className: "font-tabular"
          }
        ) }),
        /* @__PURE__ */ e.jsx(L, { label: "Not", children: /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: i.note,
            onChange: h("note"),
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
        /* @__PURE__ */ e.jsx("span", { className: "font-tabular font-semibold text-text-primary", children: typeof i.amount == "number" && i.amount > 0 ? Y(i.amount, i.currency) : "—" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ e.jsx(B.Close, { asChild: !0, children: /* @__PURE__ */ e.jsx(A, { type: "button", variant: "ghost", size: "md", children: "İptal" }) }),
        /* @__PURE__ */ e.jsx(
          A,
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
function L({ label: t, required: a, confidence: n, children: c }) {
  const o = n != null && n < 0.95, i = n != null && n < E;
  return /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "text-sm font-medium text-text-secondary", children: [
        t,
        a && /* @__PURE__ */ e.jsx("span", { className: "text-text-negative ml-0.5", children: "*" })
      ] }),
      o && /* @__PURE__ */ e.jsx(ae, { score: n, showLabel: !1, size: "sm" })
    ] }),
    c,
    i && /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-warning", children: "AI bu alandan emin değil — doğrula." })
  ] });
}
function _(t) {
  var n, c, o, i, u, s;
  const a = (t == null ? void 0 : t.fields) ?? {};
  return {
    amount: ((n = a.amount) == null ? void 0 : n.value) ?? "",
    currency: ((c = a.currency) == null ? void 0 : c.value) ?? "TRY",
    date: ((o = a.date) == null ? void 0 : o.value) ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    vendor: ((i = a.vendor) == null ? void 0 : i.value) ?? "",
    category: ((u = a.category) == null ? void 0 : u.value) ?? "",
    taxRate: ((s = a.taxRate) == null ? void 0 : s.value) ?? 20,
    note: ""
  };
}
function Ce({ result: t, onAddAnother: a, onClose: n }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center justify-center gap-4 py-12 px-6 text-center", children: [
    /* @__PURE__ */ e.jsx(Se, {}),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-xl font-semibold text-text-primary", children: "Masraf gönderildi" }),
      /* @__PURE__ */ e.jsxs("p", { className: "text-sm text-text-secondary mt-1", children: [
        (t == null ? void 0 : t.amount) && Y(t.amount, t.currency || "TRY"),
        (t == null ? void 0 : t.vendor) && ` · ${t.vendor}`
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary mt-1", children: "Onaya gitti. Bildirim ile durumu takip edebilirsin." })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 w-full max-w-xs", children: [
      /* @__PURE__ */ e.jsx(A, { variant: "primary", size: "lg", onClick: a, children: "Bir tane daha çek" }),
      /* @__PURE__ */ e.jsx(A, { variant: "ghost", size: "md", onClick: n, children: "Bitir" })
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
  return V({
    mutationFn: (t) => J.ocr(t)
  });
}
function Me() {
  return V({
    mutationFn: (t) => J.submit(t),
    retry: !1
    /* Finansal işlem — duplicate önlenir */
  });
}
const g = { CAPTURE: "capture", OCR: "ocr", FORM: "form", SUCCESS: "success" }, Te = 1500;
function Le() {
  const [t, a] = l.useState(g.CAPTURE), [n, c] = l.useState(null), [o, i] = l.useState(null), u = Ne(), s = Me(), b = H(), j = l.useCallback(async (f) => {
    n && URL.revokeObjectURL(n), c(URL.createObjectURL(f)), a(g.OCR);
    try {
      await u.mutateAsync(f), a(g.FORM);
    } catch {
      b.warning("Otomatik okuma başarısız", {
        description: "Alanları manuel girebilirsin."
      }), a(g.FORM);
    }
  }, [n, u, b]), v = l.useCallback(() => {
    n && URL.revokeObjectURL(n), c(null), i(null), u.reset(), s.reset(), a(g.CAPTURE);
  }, [n, u, s]), w = l.useCallback(async (f) => {
    try {
      const p = await s.mutateAsync(f);
      i(p), a(g.SUCCESS), b.success("Masraf kaydedildi", {
        description: `${Y(f.amount, f.currency)} — ${f.vendor || "Kayıt"}`
      }), setTimeout(() => {
        v();
      }, Te);
    } catch (p) {
      b.error("Kayıt başarısız", {
        description: (p == null ? void 0 : p.message) ?? "Tekrar deneyebilirsin."
      });
    }
  }, [s, b, v]), h = l.useCallback(() => {
    n && URL.revokeObjectURL(n), window.location.href = "/Dashboard";
  }, [n]);
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "sticky top-0 z-sticky bg-surface-raised/95 backdrop-blur-sm border-b border-default px-4 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h1", { className: "text-base font-semibold", children: "Masraf Yakala" }),
      /* @__PURE__ */ e.jsx(de, {})
    ] }),
    /* @__PURE__ */ e.jsxs("main", { className: "max-w-2xl mx-auto p-4", children: [
      t === g.CAPTURE && /* @__PURE__ */ e.jsx(fe, { onFile: j }),
      t === g.OCR && /* @__PURE__ */ e.jsx(be, { previewUrl: n }),
      t === g.SUCCESS && /* @__PURE__ */ e.jsx(
        Ce,
        {
          result: o,
          onAddAnother: v,
          onClose: h
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
        ocrResult: u.data,
        onSubmit: w,
        isSubmitting: s.isPending
      }
    )
  ] });
}
re();
const G = document.getElementById("apya-expense-capture-root");
G && Z(G).render(
  /* @__PURE__ */ e.jsx(se, { children: /* @__PURE__ */ e.jsx(ie, { children: /* @__PURE__ */ e.jsx(oe, { children: /* @__PURE__ */ e.jsx(Le, {}) }) }) })
);
