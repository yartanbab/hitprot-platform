import { r as l, j as e, e as K, d as X } from "./react-vendor.js";
import { I as F, c as R, u as H, h as A, S as P, m as B, B as Z, M as ee, g as Y, i as te, T as ae, r as ne, j as re, k as se, l as ie } from "./registerServiceWorker.js";
import { b as V } from "./query-vendor.js";
/* empty css      */
function oe(t, n) {
  const a = n.trim().toLowerCase();
  return a ? t.filter((c) => String(c.label).toLowerCase().includes(a)) : t;
}
function le({
  options: t = [],
  value: n,
  onChange: a,
  placeholder: c = "Seçim yap",
  onSearch: o,
  /* opsiyonel — async/server-side filter caller'a */
  size: i,
  invalid: u,
  disabled: s,
  emptyMessage: v = "Eşleşme bulunamadı",
  className: j,
  listMaxHeight: b = 240,
  ...w
}) {
  const [h, f] = l.useState(!1), [p, S] = l.useState(""), [k, C] = l.useState(0), T = l.useRef(null), L = l.useRef(null), N = l.useId(), E = l.useMemo(
    () => t.find((r) => r.value === n),
    [t, n]
  ), g = l.useMemo(() => o ? t : oe(t, p), [t, p, o]), I = h ? p : (E == null ? void 0 : E.label) ?? "", z = l.useCallback((r) => {
    const x = r.target.value;
    S(x), f(!0), C(0), o == null || o(x);
  }, [o]), m = l.useCallback((r) => {
    var x;
    !r || r.disabled || (a == null || a(r.value), S(""), f(!1), (x = L.current) == null || x.blur());
  }, [a]), d = l.useCallback((r) => {
    s || (r.key === "ArrowDown" ? (r.preventDefault(), f(!0), C((x) => Math.min(x + 1, g.length - 1))) : r.key === "ArrowUp" ? (r.preventDefault(), C((x) => Math.max(x - 1, 0))) : r.key === "Enter" ? h && g[k] && (r.preventDefault(), m(g[k])) : r.key === "Escape" && h && (r.preventDefault(), f(!1), S("")));
  }, [h, k, g, m, s]);
  return l.useEffect(() => {
    if (!h) return;
    const r = (x) => {
      T.current && !T.current.contains(x.target) && (f(!1), S(""));
    };
    return document.addEventListener("mousedown", r), () => document.removeEventListener("mousedown", r);
  }, [h]), /* @__PURE__ */ e.jsxs(
    "div",
    {
      ref: T,
      className: R("relative", j),
      children: [
        /* @__PURE__ */ e.jsx(
          F,
          {
            ref: L,
            role: "combobox",
            "aria-controls": N,
            "aria-expanded": h,
            "aria-autocomplete": "list",
            "aria-activedescendant": h && g[k] ? `${N}-opt-${k}` : void 0,
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
            id: N,
            role: "listbox",
            style: { maxHeight: b },
            className: R(
              "absolute z-popover left-0 right-0 mt-1",
              "bg-surface-raised border border-default rounded-md shadow-lg",
              "overflow-y-auto",
              "py-1"
            ),
            children: g.length === 0 ? /* @__PURE__ */ e.jsx("li", { className: "px-3 py-2 text-sm text-text-tertiary", children: v }) : g.map((r, x) => {
              const U = r.value === n, J = x === k;
              return /* @__PURE__ */ e.jsxs(
                "li",
                {
                  id: `${N}-opt-${x}`,
                  role: "option",
                  "aria-selected": U,
                  "aria-disabled": r.disabled || void 0,
                  onMouseDown: (Q) => {
                    Q.preventDefault(), m(r);
                  },
                  onMouseEnter: () => C(x),
                  className: R(
                    "px-3 py-1.5 text-sm cursor-pointer flex items-center gap-2",
                    r.disabled && "text-text-disabled cursor-not-allowed",
                    J && !r.disabled && "bg-surface-elevated",
                    U && "font-medium text-brand-700"
                  ),
                  children: [
                    r.leading && /* @__PURE__ */ e.jsx("span", { className: "flex-none", children: r.leading }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate", children: r.label }),
                    U && /* @__PURE__ */ e.jsx("span", { className: "flex-none text-brand-600 text-xs", "aria-hidden": "true", children: "✓" })
                  ]
                },
                r.value ?? x
              );
            })
          }
        )
      ]
    }
  );
}
function ce({ onFile: t }) {
  const n = l.useRef(null), [a, c] = K.useState(!1), o = H(), i = l.useCallback(() => {
    var s;
    return (s = n.current) == null ? void 0 : s.click();
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
        var v;
        s.preventDefault(), c(!1), u((v = s.dataTransfer.files) == null ? void 0 : v[0]);
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
        /* @__PURE__ */ e.jsx(de, {}),
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
            ref: n,
            type: "file",
            accept: "image/*",
            capture: "environment",
            className: "sr-only",
            onChange: (s) => {
              var v;
              return u((v = s.target.files) == null ? void 0 : v[0]);
            }
          }
        )
      ]
    }
  );
}
function de() {
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
const ue = [
  "Görüntü temizleniyor...",
  "Metin tanınıyor (OCR)...",
  "Alanlar çıkartılıyor..."
];
function me({ previewUrl: t }) {
  const [n, a] = K.useState(0);
  return K.useEffect(() => {
    const c = setTimeout(() => a(1), 350), o = setTimeout(() => a(2), 800);
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
    /* @__PURE__ */ e.jsx("div", { className: "w-full max-w-xs flex flex-col gap-2", children: ue.map((c, o) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
      o < n && /* @__PURE__ */ e.jsx(xe, {}),
      o === n && /* @__PURE__ */ e.jsx(fe, {}),
      o > n && /* @__PURE__ */ e.jsx(he, {}),
      /* @__PURE__ */ e.jsx("span", { className: o <= n ? "text-text-primary" : "text-text-tertiary", children: c })
    ] }, o)) }),
    /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-xs flex flex-col gap-2 mt-2", children: [
      /* @__PURE__ */ e.jsx(P, { height: 12 }),
      /* @__PURE__ */ e.jsx(P, { height: 12, className: "w-3/4" }),
      /* @__PURE__ */ e.jsx(P, { height: 12, className: "w-1/2" })
    ] })
  ] });
}
const xe = () => /* @__PURE__ */ e.jsx(
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
), fe = () => /* @__PURE__ */ e.jsx(
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
), he = () => /* @__PURE__ */ e.jsx("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-neutral-300 mx-[2px] flex-none", "aria-hidden": "true" }), $ = (t) => new Promise((n) => setTimeout(n, t)), q = [
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
const W = {
  async ocr(t) {
    var o;
    await $(900 + Math.random() * 600);
    const n = t.size + (((o = t.name) == null ? void 0 : o.length) || 0), a = q[n % q.length], c = Math.round((50 + n % 5e5 / 100) * 100) / 100;
    return {
      confidence: O(0.8, n),
      fields: {
        amount: { value: c, confidence: O(0.92, n + 1) },
        currency: { value: "TRY", confidence: 0.99 },
        date: { value: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), confidence: O(0.86, n + 2) },
        vendor: { value: a.vendor, confidence: O(0.65, n + 3) },
        category: { value: a.category, confidence: O(0.58, n + 4) },
        taxRate: { value: 20, confidence: 0.95 }
      },
      rawText: `${a.vendor}
Tutar: ${c.toFixed(2)} TL
KDV %20`
    };
  },
  async submit(t) {
    if (await $(600), !(t != null && t.amount) || t.amount <= 0) {
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
}, M = 0.7, be = [
  { value: "Ofis Sarfiyat", label: "Ofis Sarfiyat" },
  { value: "Donanım", label: "Donanım" },
  { value: "Yazılım Lisansı", label: "Yazılım Lisansı" },
  { value: "Internet/Telekom", label: "Internet/Telekom" },
  { value: "Seyahat", label: "Seyahat" },
  { value: "Yemek", label: "Yemek" },
  { value: "Kırtasiye", label: "Kırtasiye" },
  { value: "Diğer", label: "Diğer" }
], ve = ["TRY", "USD", "EUR"];
function pe({
  open: t,
  onOpenChange: n,
  ocrResult: a,
  onSubmit: c,
  isSubmitting: o
}) {
  var C, T, L, N, E, g, I, z;
  const [i, u] = l.useState(() => _(a)), [s, v] = l.useState(!1), j = l.useRef(null);
  l.useEffect(() => {
    u(_(a));
  }, [a]), l.useEffect(() => {
    if (!t || !(a != null && a.fields)) return;
    const m = setTimeout(() => {
      var d, r;
      return (r = (d = j.current) == null ? void 0 : d.focus) == null ? void 0 : r.call(d);
    }, 80);
    return () => clearTimeout(m);
  }, [t, a]);
  const b = l.useMemo(
    () => (a == null ? void 0 : a.fields) ?? {},
    [a]
  ), w = l.useMemo(() => {
    var d;
    const m = ["vendor", "category", "date", "amount"];
    for (const r of m) {
      const x = (d = b[r]) == null ? void 0 : d.confidence;
      if (x != null && x < M) return r;
    }
    return null;
  }, [b]), h = (m) => (d) => u((r) => ({ ...r, [m]: d != null && d.target ? d.target.value : d })), f = async (m) => {
    if (m.preventDefault(), o) return;
    const d = {
      ...i,
      amount: typeof i.amount == "number" ? i.amount : parseFloat(i.amount),
      taxRate: typeof i.taxRate == "number" ? i.taxRate : parseFloat(i.taxRate)
    };
    await c(d);
  }, p = (a == null ? void 0 : a.confidence) ?? 0, S = p >= 0.85 ? "Yüksek güven" : p >= 0.65 ? "Orta güven" : "Düşük güven — kontrol edin", k = p >= 0.85 ? "positive" : p >= 0.65 ? "warning" : "critical";
  return /* @__PURE__ */ e.jsx(B, { open: t, onOpenChange: n, children: /* @__PURE__ */ e.jsx(B.Content, { title: "Masraf detayları", description: "AI tarafından okunan tutarları doğrulayın ve gönderin", children: /* @__PURE__ */ e.jsxs("form", { onSubmit: f, className: "flex flex-col h-full", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "px-4 pt-2 pb-3 border-b border-subtle flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-semibold", children: "Masraf Detayları" }),
      /* @__PURE__ */ e.jsx(Z, { variant: k, size: "sm", withDot: !0, children: S })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsx(D, { label: "Tutar", required: !0, confidence: (C = b.amount) == null ? void 0 : C.confidence, children: /* @__PURE__ */ e.jsx(
        ee,
        {
          ref: w === "amount" ? j : void 0,
          value: i.amount,
          onValueChange: (m) => u((d) => ({ ...d, amount: m ?? "" })),
          currency: i.currency,
          currencies: ve,
          onCurrencyChange: (m) => u((d) => ({ ...d, currency: m })),
          size: "md",
          invalid: ((T = b.amount) == null ? void 0 : T.confidence) < M,
          required: !0,
          min: 0.01
        }
      ) }),
      /* @__PURE__ */ e.jsx(D, { label: "Tarih", required: !0, confidence: (L = b.date) == null ? void 0 : L.confidence, children: /* @__PURE__ */ e.jsx(
        F,
        {
          ref: w === "date" ? j : void 0,
          type: "date",
          required: !0,
          value: i.date,
          onChange: h("date"),
          invalid: ((N = b.date) == null ? void 0 : N.confidence) < M
        }
      ) }),
      /* @__PURE__ */ e.jsx(D, { label: "Tedarikçi", required: !0, confidence: (E = b.vendor) == null ? void 0 : E.confidence, children: /* @__PURE__ */ e.jsx(
        F,
        {
          ref: w === "vendor" ? j : void 0,
          type: "text",
          required: !0,
          value: i.vendor,
          onChange: h("vendor"),
          invalid: ((g = b.vendor) == null ? void 0 : g.confidence) < M,
          placeholder: "örn. Migros A.Ş."
        }
      ) }),
      /* @__PURE__ */ e.jsx(D, { label: "Kategori", confidence: (I = b.category) == null ? void 0 : I.confidence, children: /* @__PURE__ */ e.jsx(
        le,
        {
          options: be,
          value: i.category,
          onChange: (m) => u((d) => ({ ...d, category: m })),
          invalid: ((z = b.category) == null ? void 0 : z.confidence) < M,
          placeholder: "Kategori seç"
        }
      ) }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => v((m) => !m),
          className: "self-start text-sm text-text-link hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
          children: s ? "Daha az alan" : "Daha fazla alan"
        }
      ),
      s && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(D, { label: "KDV Oranı (%)", children: /* @__PURE__ */ e.jsx(
          F,
          {
            type: "number",
            step: "0.1",
            value: i.taxRate,
            onChange: h("taxRate"),
            className: "font-tabular"
          }
        ) }),
        /* @__PURE__ */ e.jsx(D, { label: "Not", children: /* @__PURE__ */ e.jsx(
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
function D({ label: t, required: n, confidence: a, children: c }) {
  const o = a != null && a < 0.95, i = a != null && a < M;
  return /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "text-sm font-medium text-text-secondary", children: [
        t,
        n && /* @__PURE__ */ e.jsx("span", { className: "text-text-negative ml-0.5", children: "*" })
      ] }),
      o && /* @__PURE__ */ e.jsx(te, { score: a, showLabel: !1, size: "sm" })
    ] }),
    c,
    i && /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-warning", children: "AI bu alandan emin değil — doğrula." })
  ] });
}
function _(t) {
  var a, c, o, i, u, s;
  const n = (t == null ? void 0 : t.fields) ?? {};
  return {
    amount: ((a = n.amount) == null ? void 0 : a.value) ?? "",
    currency: ((c = n.currency) == null ? void 0 : c.value) ?? "TRY",
    date: ((o = n.date) == null ? void 0 : o.value) ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    vendor: ((i = n.vendor) == null ? void 0 : i.value) ?? "",
    category: ((u = n.category) == null ? void 0 : u.value) ?? "",
    taxRate: ((s = n.taxRate) == null ? void 0 : s.value) ?? 20,
    note: ""
  };
}
function ye({ result: t, onAddAnother: n, onClose: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center justify-center gap-4 py-12 px-6 text-center", children: [
    /* @__PURE__ */ e.jsx(ge, {}),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-xl font-semibold text-text-primary", children: "Masraf gönderildi" }),
      /* @__PURE__ */ e.jsxs("p", { className: "text-sm text-text-secondary mt-1", children: [
        (t == null ? void 0 : t.amount) && Y(t.amount, t.currency || "TRY"),
        (t == null ? void 0 : t.vendor) && ` · ${t.vendor}`
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary mt-1", children: "Onaya gitti. Bildirim ile durumu takip edebilirsin." })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 w-full max-w-xs", children: [
      /* @__PURE__ */ e.jsx(A, { variant: "primary", size: "lg", onClick: n, children: "Bir tane daha çek" }),
      /* @__PURE__ */ e.jsx(A, { variant: "ghost", size: "md", onClick: a, children: "Bitir" })
    ] })
  ] });
}
const ge = () => /* @__PURE__ */ e.jsxs(
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
function je() {
  return V({
    mutationFn: (t) => W.ocr(t)
  });
}
function ke() {
  return V({
    mutationFn: (t) => W.submit(t),
    retry: !1
    /* Finansal işlem — duplicate önlenir */
  });
}
const y = { CAPTURE: "capture", OCR: "ocr", FORM: "form", SUCCESS: "success" }, we = 1500;
function Ce() {
  const [t, n] = l.useState(y.CAPTURE), [a, c] = l.useState(null), [o, i] = l.useState(null), u = je(), s = ke(), v = H(), j = l.useCallback(async (f) => {
    a && URL.revokeObjectURL(a), c(URL.createObjectURL(f)), n(y.OCR);
    try {
      await u.mutateAsync(f), n(y.FORM);
    } catch {
      v.warning("Otomatik okuma başarısız", {
        description: "Alanları manuel girebilirsin."
      }), n(y.FORM);
    }
  }, [a, u, v]), b = l.useCallback(() => {
    a && URL.revokeObjectURL(a), c(null), i(null), u.reset(), s.reset(), n(y.CAPTURE);
  }, [a, u, s]), w = l.useCallback(async (f) => {
    try {
      const p = await s.mutateAsync(f);
      i(p), n(y.SUCCESS), v.success("Masraf kaydedildi", {
        description: `${Y(f.amount, f.currency)} — ${f.vendor || "Kayıt"}`
      }), setTimeout(() => {
        b();
      }, we);
    } catch (p) {
      v.error("Kayıt başarısız", {
        description: (p == null ? void 0 : p.message) ?? "Tekrar deneyebilirsin."
      });
    }
  }, [s, v, b]), h = l.useCallback(() => {
    a && URL.revokeObjectURL(a), window.location.href = "/Dashboard";
  }, [a]);
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "sticky top-0 z-sticky bg-surface-raised/95 backdrop-blur-sm border-b border-default px-4 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h1", { className: "text-base font-semibold", children: "Masraf Yakala" }),
      /* @__PURE__ */ e.jsx(ae, {})
    ] }),
    /* @__PURE__ */ e.jsxs("main", { className: "max-w-2xl mx-auto p-4", children: [
      t === y.CAPTURE && /* @__PURE__ */ e.jsx(ce, { onFile: j }),
      t === y.OCR && /* @__PURE__ */ e.jsx(me, { previewUrl: a }),
      t === y.SUCCESS && /* @__PURE__ */ e.jsx(
        ye,
        {
          result: o,
          onAddAnother: b,
          onClose: h
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(
      pe,
      {
        open: t === y.FORM,
        onOpenChange: (f) => {
          f || n(y.CAPTURE);
        },
        ocrResult: u.data,
        onSubmit: w,
        isSubmitting: s.isPending
      }
    )
  ] });
}
ne();
const G = document.getElementById("apya-expense-capture-root");
G && X(G).render(
  /* @__PURE__ */ e.jsx(re, { children: /* @__PURE__ */ e.jsx(se, { children: /* @__PURE__ */ e.jsx(ie, { children: /* @__PURE__ */ e.jsx(Ce, {}) }) }) })
);
