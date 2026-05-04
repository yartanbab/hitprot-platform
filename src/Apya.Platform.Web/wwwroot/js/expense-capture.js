import { r as f, e as b, j as e, d as F } from "./react-vendor.js";
import { h as j, c as w, S as N, l as S, B as L, g as E, T as U, r as P, i as z, j as B, k as I } from "./registerServiceWorker.js";
import { b as M } from "./query-vendor.js";
/* empty css      */
function Y({ onFile: t }) {
  const s = f.useRef(null), [n, r] = b.useState(!1), i = (a) => {
    if (a) {
      if (!a.type.startsWith("image/")) {
        alert("Lütfen bir resim dosyası seçin.");
        return;
      }
      t(a);
    }
  };
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: w(
        "flex flex-col items-center justify-center gap-4",
        "border-2 border-dashed rounded-xl p-8",
        "min-h-[60vh] mobile:min-h-[50vh]",
        "transition-colors duration-fast",
        n ? "border-brand-500 bg-brand-50" : "border-default bg-surface-raised"
      ),
      onDragOver: (a) => {
        a.preventDefault(), r(!0);
      },
      onDragLeave: () => r(!1),
      onDrop: (a) => {
        var o;
        a.preventDefault(), r(!1), i((o = a.dataTransfer.files) == null ? void 0 : o[0]);
      },
      children: [
        /* @__PURE__ */ e.jsx(q, {}),
        /* @__PURE__ */ e.jsxs("div", { className: "text-center max-w-xs", children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-base font-semibold text-text-primary", children: "Faturayı çek" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-secondary mt-1", children: "Kamerayı aç veya bilgisayardan resim sürükle. AI tutarı, tarihi ve tedarikçiyi otomatik okur." })
        ] }),
        /* @__PURE__ */ e.jsx(
          j,
          {
            size: "lg",
            variant: "primary",
            onClick: () => {
              var a;
              return (a = s.current) == null ? void 0 : a.click();
            },
            className: "min-w-[220px]",
            children: "Kamerayı Aç"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            ref: s,
            type: "file",
            accept: "image/*",
            capture: "environment",
            className: "sr-only",
            onChange: (a) => {
              var o;
              return i((o = a.target.files) == null ? void 0 : o[0]);
            }
          }
        )
      ]
    }
  );
}
function q() {
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
const W = [
  "Görüntü temizleniyor...",
  "Metin tanınıyor (OCR)...",
  "Alanlar çıkartılıyor..."
];
function K({ previewUrl: t }) {
  const [s, n] = b.useState(0);
  return b.useEffect(() => {
    const r = setTimeout(() => n(1), 350), i = setTimeout(() => n(2), 800);
    return () => {
      clearTimeout(r), clearTimeout(i);
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
    /* @__PURE__ */ e.jsx("div", { className: "w-full max-w-xs flex flex-col gap-2", children: W.map((r, i) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
      i < s && /* @__PURE__ */ e.jsx(V, {}),
      i === s && /* @__PURE__ */ e.jsx(G, {}),
      i > s && /* @__PURE__ */ e.jsx(H, {}),
      /* @__PURE__ */ e.jsx("span", { className: i <= s ? "text-text-primary" : "text-text-tertiary", children: r })
    ] }, i)) }),
    /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-xs flex flex-col gap-2 mt-2", children: [
      /* @__PURE__ */ e.jsx(N, { height: 12 }),
      /* @__PURE__ */ e.jsx(N, { height: 12, className: "w-3/4" }),
      /* @__PURE__ */ e.jsx(N, { height: 12, className: "w-1/2" })
    ] })
  ] });
}
const V = () => /* @__PURE__ */ e.jsx(
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
), G = () => /* @__PURE__ */ e.jsx(
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
), H = () => /* @__PURE__ */ e.jsx("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-neutral-300 mx-[2px] flex-none", "aria-hidden": "true" });
function $({
  open: t,
  onOpenChange: s,
  ocrResult: n,
  onSubmit: r,
  isSubmitting: i
}) {
  const [a, o] = f.useState(() => C(n)), [u, v] = f.useState(!1);
  b.useEffect(() => {
    o(C(n));
  }, [n]);
  const c = (p) => (k) => o((A) => ({ ...A, [p]: k.target.value })), y = async (p) => {
    p.preventDefault();
    const k = {
      ...a,
      amount: parseFloat(a.amount),
      taxRate: parseFloat(a.taxRate)
    };
    await r(k);
  }, m = (n == null ? void 0 : n.confidence) ?? 0, d = m >= 0.85 ? "Yüksek güven" : m >= 0.65 ? "Orta güven" : "Düşük güven — kontrol edin", g = m >= 0.85 ? "positive" : m >= 0.65 ? "warning" : "critical";
  return /* @__PURE__ */ e.jsx(S, { open: t, onOpenChange: s, children: /* @__PURE__ */ e.jsx(S.Content, { title: "Masraf detayları", description: "AI tarafından okunan tutarları doğrulayın ve gönderin", children: /* @__PURE__ */ e.jsxs("form", { onSubmit: y, className: "flex flex-col h-full", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "px-4 pt-2 pb-3 border-b border-subtle flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-semibold", children: "Masraf Detayları" }),
      /* @__PURE__ */ e.jsx(L, { variant: g, size: "sm", withDot: !0, children: d })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4", children: [
      /* @__PURE__ */ e.jsx(h, { label: "Tutar", required: !0, children: /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "number",
            step: "0.01",
            inputMode: "decimal",
            required: !0,
            value: a.amount,
            onChange: c("amount"),
            className: x + " font-tabular flex-1"
          }
        ),
        /* @__PURE__ */ e.jsxs(
          "select",
          {
            value: a.currency,
            onChange: c("currency"),
            className: w(x, "w-20"),
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "TRY", children: "TRY" }),
              /* @__PURE__ */ e.jsx("option", { value: "USD", children: "USD" }),
              /* @__PURE__ */ e.jsx("option", { value: "EUR", children: "EUR" })
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ e.jsx(h, { label: "Tarih", required: !0, children: /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          required: !0,
          value: a.date,
          onChange: c("date"),
          className: x
        }
      ) }),
      /* @__PURE__ */ e.jsx(h, { label: "Tedarikçi", required: !0, children: /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          required: !0,
          value: a.vendor,
          onChange: c("vendor"),
          className: x
        }
      ) }),
      /* @__PURE__ */ e.jsx(h, { label: "Kategori", children: /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: a.category,
          onChange: c("category"),
          className: x
        }
      ) }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => v((p) => !p),
          className: "self-start text-sm text-text-link hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
          children: u ? "Daha az alan" : "Daha fazla alan"
        }
      ),
      u && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(h, { label: "KDV Oranı (%)", children: /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "number",
            step: "0.1",
            value: a.taxRate,
            onChange: c("taxRate"),
            className: x + " font-tabular"
          }
        ) }),
        /* @__PURE__ */ e.jsx(h, { label: "Not", children: /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: a.note,
            onChange: c("note"),
            className: x + " resize-none"
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("footer", { className: "px-4 py-3 border-t border-subtle bg-surface-sunken flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "text-sm text-text-tertiary", children: [
        "Toplam:",
        " ",
        /* @__PURE__ */ e.jsx("span", { className: "font-tabular font-semibold text-text-primary", children: a.amount && !isNaN(parseFloat(a.amount)) ? E(parseFloat(a.amount), a.currency) : "—" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ e.jsx(S.Close, { asChild: !0, children: /* @__PURE__ */ e.jsx(j, { type: "button", variant: "ghost", size: "md", children: "İptal" }) }),
        /* @__PURE__ */ e.jsx(
          j,
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
function h({ label: t, required: s, children: n }) {
  return /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "text-sm font-medium text-text-secondary", children: [
      t,
      s && /* @__PURE__ */ e.jsx("span", { className: "text-text-negative ml-0.5", children: "*" })
    ] }),
    n
  ] });
}
const x = w(
  "h-10 px-3 rounded-md",
  "bg-surface-base text-text-primary",
  "border border-default",
  "focus-visible:outline-none focus-visible:shadow-focus focus:border-focus",
  "transition-colors duration-fast"
);
function C(t) {
  return {
    amount: (t == null ? void 0 : t.amount) ?? "",
    currency: (t == null ? void 0 : t.currency) ?? "TRY",
    date: (t == null ? void 0 : t.date) ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    vendor: (t == null ? void 0 : t.vendor) ?? "",
    category: (t == null ? void 0 : t.category) ?? "",
    taxRate: (t == null ? void 0 : t.taxRate) ?? 20,
    note: ""
  };
}
function _({ result: t, onAddAnother: s, onClose: n }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center justify-center gap-4 py-12 px-6 text-center", children: [
    /* @__PURE__ */ e.jsx(J, {}),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-xl font-semibold text-text-primary", children: "Masraf gönderildi" }),
      /* @__PURE__ */ e.jsxs("p", { className: "text-sm text-text-secondary mt-1", children: [
        (t == null ? void 0 : t.amount) && E(t.amount, t.currency || "TRY"),
        (t == null ? void 0 : t.vendor) && ` · ${t.vendor}`
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary mt-1", children: "Onaya gitti. Bildirim ile durumu takip edebilirsin." })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 w-full max-w-xs", children: [
      /* @__PURE__ */ e.jsx(j, { variant: "primary", size: "lg", onClick: s, children: "Bir tane daha çek" }),
      /* @__PURE__ */ e.jsx(j, { variant: "ghost", size: "md", onClick: n, children: "Bitir" })
    ] })
  ] });
}
const J = () => /* @__PURE__ */ e.jsxs(
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
), R = (t) => new Promise((s) => setTimeout(s, t)), T = [
  { vendor: "Migros A.Ş.", category: "Ofis Sarfiyat" },
  { vendor: "BSH Ev Aletleri", category: "Donanım" },
  { vendor: "Türk Telekom", category: "Internet/Telekom" },
  { vendor: "JetBrains s.r.o.", category: "Yazılım Lisansı" },
  { vendor: "Lufthansa", category: "Seyahat" }
], D = {
  /* OCR — gerçek hayatta Azure Form Recognizer veya Google Vision çağrılır.
     Burada deterministik mock: file size'a göre vendor seçer (test için
     reproducible). */
  async ocr(t) {
    var r;
    await R(900 + Math.random() * 600);
    const s = (t.size + (((r = t.name) == null ? void 0 : r.length) || 0)) % T.length, n = T[s];
    return {
      confidence: 0.78 + Math.random() * 0.18,
      amount: Math.round((50 + Math.random() * 5e3) * 100) / 100,
      currency: "TRY",
      date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      vendor: n.vendor,
      category: n.category,
      taxRate: 20,
      rawText: `${n.vendor}
Tutar: ${(50 + Math.random() * 5e3).toFixed(2)} TL
KDV %20`
    };
  },
  async submit(t) {
    if (await R(600), !(t != null && t.amount) || t.amount <= 0) {
      const s = new Error("Tutar geçersiz.");
      throw s.status = 400, s;
    }
    return {
      id: "exp-" + Math.random().toString(36).slice(2, 9),
      ...t,
      status: "submitted",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
};
function Q() {
  return M({
    mutationFn: (t) => D.ocr(t)
  });
}
function X() {
  return M({
    mutationFn: (t) => D.submit(t),
    retry: !1
    /* Finansal işlem — duplicate önlenir */
  });
}
const l = { CAPTURE: "capture", OCR: "ocr", FORM: "form", SUCCESS: "success" };
function Z() {
  const [t, s] = f.useState(l.CAPTURE), [n, r] = f.useState(null), [i, a] = f.useState(null), o = Q(), u = X(), v = async (d) => {
    n && URL.revokeObjectURL(n), r(URL.createObjectURL(d)), s(l.OCR);
    try {
      await o.mutateAsync(d), s(l.FORM);
    } catch {
      s(l.FORM);
    }
  }, c = async (d) => {
    const g = await u.mutateAsync(d);
    a(g), s(l.SUCCESS);
  }, y = () => {
    n && URL.revokeObjectURL(n), r(null), a(null), o.reset(), u.reset(), s(l.CAPTURE);
  }, m = () => {
    window.location.href = "/Dashboard";
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "sticky top-0 z-sticky bg-surface-raised/95 backdrop-blur-sm border-b border-default px-4 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h1", { className: "text-base font-semibold", children: "Masraf Yakala" }),
      /* @__PURE__ */ e.jsx(U, {})
    ] }),
    /* @__PURE__ */ e.jsxs("main", { className: "max-w-2xl mx-auto p-4", children: [
      t === l.CAPTURE && /* @__PURE__ */ e.jsx(Y, { onFile: v }),
      t === l.OCR && /* @__PURE__ */ e.jsx(K, { previewUrl: n }),
      t === l.SUCCESS && /* @__PURE__ */ e.jsx(
        _,
        {
          result: i,
          onAddAnother: y,
          onClose: m
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(
      $,
      {
        open: t === l.FORM,
        onOpenChange: (d) => {
          d || s(l.CAPTURE);
        },
        ocrResult: o.data,
        onSubmit: c,
        isSubmitting: u.isPending
      }
    )
  ] });
}
P();
const O = document.getElementById("apya-expense-capture-root");
O && F(O).render(
  /* @__PURE__ */ e.jsx(z, { children: /* @__PURE__ */ e.jsx(B, { children: /* @__PURE__ */ e.jsx(I, { children: /* @__PURE__ */ e.jsx(Z, {}) }) }) })
);
