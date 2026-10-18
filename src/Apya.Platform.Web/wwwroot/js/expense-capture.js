import { j as e, r as l, b as G } from "./react-vendor-D7YDiBbi.js";
import { t as O, m as H } from "./index-DgpuJ91w.js";
import { u as J, B as N, c as F, S as R, M as V, I as U, a as z, T as X } from "./Dialog-D3HpJNIB.js";
import { a as Z } from "./QueryProvider-D2Hvqdr9.js";
import { u as Q, r as ee, T as te } from "./registerServiceWorker-CD7jAaT2.js";
import { C as ne } from "./Combobox-CHhgTuMW.js";
import { u as _, b as re } from "./query-vendor-Db2mwxYI.js";
import { a as I } from "./httpClient-BNoyY5yK.js";
import { i as ae, s as $ } from "./permanentRejection-SvaBclz0.js";
const se = {
  light: { key: "Theme:Light", fallback: "Açık tema (Sıradaki: Koyu)" },
  dark: { key: "Theme:Dark", fallback: "Koyu tema (Sıradaki: Sistem)" },
  system: { key: "Theme:System", fallback: "Sistem teması (Sıradaki: Açık)" }
};
function ie({ className: t = "" }) {
  const { preference: n, toggle: r } = J(), u = se[n], c = u ? O(u.key, u.fallback) : O("Theme:Toggle", "Tema değiştir");
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: r,
      "aria-label": c,
      title: c,
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
        n === "light" && /* @__PURE__ */ e.jsx(oe, {}),
        n === "dark" && /* @__PURE__ */ e.jsx(le, {}),
        n === "system" && /* @__PURE__ */ e.jsx(ce, {})
      ]
    }
  );
}
function oe() {
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
function le() {
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
function ce() {
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
  const n = l.useRef(null), [r, u] = G.useState(!1), c = Q(), o = l.useCallback(() => {
    var s;
    return (s = n.current) == null ? void 0 : s.click();
  }, []), m = l.useCallback((s) => {
    if (s) {
      if (!s.type.startsWith("image/")) {
        c.error("Resim dosyası gerekli", {
          description: "Lütfen JPG/PNG/HEIC fatura görseli seç."
        });
        return;
      }
      if (s.size > 10 * 1024 * 1024) {
        c.error("Dosya çok büyük", {
          description: "En fazla 10 MB. Lütfen daha düşük çözünürlükte çek."
        });
        return;
      }
      t(s);
    }
  }, [t, c]);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "button",
      tabIndex: 0,
      "aria-label": "Faturayı çek — kamerayı aç ya da görüntü sürükle",
      onClick: o,
      onKeyDown: (s) => {
        (s.key === "Enter" || s.key === " ") && (s.preventDefault(), o());
      },
      onDragOver: (s) => {
        s.preventDefault(), u(!0);
      },
      onDragLeave: () => u(!1),
      onDrop: (s) => {
        var p;
        s.preventDefault(), u(!1), m((p = s.dataTransfer.files) == null ? void 0 : p[0]);
      },
      className: F(
        "flex flex-col items-center justify-center gap-4",
        "border-2 border-dashed rounded-xl p-8",
        "min-h-[60vh] mobile:min-h-[50vh]",
        "cursor-pointer select-none",
        "transition-colors duration-fast",
        "focus-visible:outline-none focus-visible:shadow-focus",
        r ? "border-brand-500 bg-brand-50" : "border-default bg-surface-raised hover:border-strong"
      ),
      children: [
        /* @__PURE__ */ e.jsx(de, {}),
        /* @__PURE__ */ e.jsxs("div", { className: "text-center max-w-xs pointer-events-none", children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-base font-semibold text-text-primary", children: "Faturayı çek" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-secondary mt-1", children: "Mobilde direkt kamera açılır. Masaüstünde dosya sürükle ya da tıkla. Fotoğraf formun üstünde görünür; tutarı, tarihi ve tedarikçiyi ona bakarak girersin." })
        ] }),
        /* @__PURE__ */ e.jsx(
          N,
          {
            size: "lg",
            variant: "primary",
            onClick: (s) => {
              s.stopPropagation(), o();
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
              return m((p = s.target.files) == null ? void 0 : p[0]);
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
const me = [
  { value: "0", label: "Genel / Diğer" },
  { value: "1", label: "Ofis / Kira" },
  { value: "2", label: "Seyahat / Ulaşım" },
  { value: "3", label: "Personel / Maaş" },
  { value: "4", label: "Malzeme / Sarf" },
  { value: "5", label: "Hizmet / Danışmanlık" },
  { value: "6", label: "Vergi / Harç" }
], fe = ["TRY", "USD", "EUR"], A = [
  "block w-full min-h-[44px] rounded-md border border-default bg-surface-base text-text-primary",
  "px-3 py-2 text-sm",
  "focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus"
].join(" ");
function xe({
  open: t,
  onOpenChange: n,
  previewUrl: r,
  onSubmit: u,
  isSubmitting: c,
  context: o,
  lines: m,
  onProjectChange: s,
  isOffline: p
}) {
  var E;
  const [i, h] = l.useState(K), [w, C] = l.useState(!1);
  l.useEffect(() => {
    h(K());
  }, [r]);
  const x = (a) => (f) => h((d) => ({ ...d, [a]: f != null && f.target ? f.target.value : f })), g = !!(m != null && m.requiresBudgetLine), T = !i.cashAccountId || g && !i.budgetLineId, S = async (a) => {
    if (a.preventDefault(), c || T) return;
    const f = {
      ...i,
      amount: typeof i.amount == "number" ? i.amount : parseFloat(i.amount)
    };
    await u(f);
  };
  return /* @__PURE__ */ e.jsx(R, { open: t, onOpenChange: n, children: /* @__PURE__ */ e.jsx(R.Content, { title: "Masraf detayları", description: "Fişteki bilgileri girin ve gönderin", children: /* @__PURE__ */ e.jsxs("form", { onSubmit: S, className: "flex flex-col flex-1 min-h-0", children: [
    /* @__PURE__ */ e.jsx("header", { className: "px-4 pt-2 pb-3 border-b border-subtle flex items-center justify-between", children: /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-semibold", children: "Masraf Detayları" }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4", children: [
      p && /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-warning bg-warning-subtle px-3 py-2 text-[12.5px] text-warning", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-wifi-slash mr-1.5" }),
        "Bağlantı yok — kayıt ",
        /* @__PURE__ */ e.jsx("strong", { children: "cihazda saklanır" }),
        ", bağlantı gelince gönderilir."
      ] }),
      r && /* @__PURE__ */ e.jsxs("figure", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ e.jsx(
          "img",
          {
            src: r,
            alt: "Çekilen fiş fotoğrafı",
            className: "max-h-64 w-full rounded-md border border-subtle bg-surface-sunken object-contain"
          }
        ),
        /* @__PURE__ */ e.jsx("figcaption", { className: "text-xs text-text-tertiary", children: "Fotoğraf yalnız bu ekranda görünür, kayda eklenmez. Belgeyi sonradan Dokümanlar'dan bu gidere bağlayabilirsin." })
      ] }),
      /* @__PURE__ */ e.jsx(j, { label: "Proje", children: /* @__PURE__ */ e.jsxs(
        "select",
        {
          className: A,
          value: i.projectId || "",
          onChange: (a) => {
            x("projectId")(a), s == null || s(a.target.value);
          },
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "— Projesiz —" }),
            ((o == null ? void 0 : o.projects) ?? []).map((a) => /* @__PURE__ */ e.jsx("option", { value: a.id, children: a.name }, a.id))
          ]
        }
      ) }),
      i.projectId && (((E = m == null ? void 0 : m.lines) == null ? void 0 : E.length) ?? 0) > 0 && /* @__PURE__ */ e.jsx(j, { label: "Bütçe kalemi", required: g, children: /* @__PURE__ */ e.jsxs(
        "select",
        {
          className: A,
          value: i.budgetLineId || "",
          onChange: x("budgetLineId"),
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "— Kalem seçin —" }),
            m.lines.map((a) => /* @__PURE__ */ e.jsx("option", { value: a.id, children: a.label }, a.id))
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(j, { label: "Kasa / banka", required: !0, children: /* @__PURE__ */ e.jsxs(
        "select",
        {
          className: A,
          value: i.cashAccountId || "",
          onChange: x("cashAccountId"),
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "— Kasa seçin —" }),
            ((o == null ? void 0 : o.accounts) ?? []).map((a) => /* @__PURE__ */ e.jsxs("option", { value: a.id, children: [
              a.name,
              " (",
              a.currency,
              ")"
            ] }, a.id))
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(j, { label: "Tutar", required: !0, children: /* @__PURE__ */ e.jsx(
        V,
        {
          value: i.amount,
          onValueChange: (a) => h((f) => ({ ...f, amount: a ?? "" })),
          currency: i.currency,
          currencies: fe,
          onCurrencyChange: (a) => h((f) => ({ ...f, currency: a })),
          size: "lg",
          required: !0,
          min: 0.01
        }
      ) }),
      /* @__PURE__ */ e.jsx(j, { label: "Tarih", required: !0, children: /* @__PURE__ */ e.jsx(
        U,
        {
          type: "date",
          required: !0,
          size: "lg",
          value: i.date,
          onChange: x("date")
        }
      ) }),
      /* @__PURE__ */ e.jsx(j, { label: "Tedarikçi", required: !0, children: /* @__PURE__ */ e.jsx(
        U,
        {
          type: "text",
          required: !0,
          size: "lg",
          value: i.vendor,
          onChange: x("vendor"),
          placeholder: "örn. Migros A.Ş."
        }
      ) }),
      /* @__PURE__ */ e.jsx(j, { label: "Kategori", children: /* @__PURE__ */ e.jsx(
        ne,
        {
          options: me,
          value: i.category,
          onChange: (a) => h((f) => ({ ...f, category: a })),
          placeholder: "Kategori seç"
        }
      ) }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => C((a) => !a),
          className: "self-start text-sm text-text-link hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
          children: w ? "Daha az alan" : "Daha fazla alan"
        }
      ),
      w && /* @__PURE__ */ e.jsx(e.Fragment, { children: /* @__PURE__ */ e.jsx(j, { label: "Not", children: /* @__PURE__ */ e.jsx(
        "textarea",
        {
          rows: 2,
          value: i.note,
          onChange: x("note"),
          className: F(
            "block w-full rounded-md border border-default bg-surface-base text-text-primary",
            "px-3 py-2 text-sm resize-none",
            "focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus",
            "placeholder:text-text-tertiary"
          )
        }
      ) }) })
    ] }),
    /* @__PURE__ */ e.jsxs("footer", { className: "px-4 py-3 border-t border-subtle bg-surface-sunken flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "text-sm text-text-tertiary", children: [
        "Toplam:",
        " ",
        /* @__PURE__ */ e.jsx("span", { className: "font-tabular font-semibold text-text-primary", children: typeof i.amount == "number" && i.amount > 0 ? z(i.amount, i.currency) : "—" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ e.jsx(R.Close, { asChild: !0, children: /* @__PURE__ */ e.jsx(N, { type: "button", variant: "ghost", size: "md", children: "İptal" }) }),
        /* @__PURE__ */ e.jsx(
          N,
          {
            type: "submit",
            variant: "primary",
            size: "md",
            isLoading: c,
            loadingText: "Gönderiliyor...",
            children: "Gönder"
          }
        )
      ] })
    ] })
  ] }) }) });
}
function j({ label: t, required: n, children: r }) {
  return /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "text-sm font-medium text-text-secondary", children: [
      t,
      n && /* @__PURE__ */ e.jsx("span", { className: "text-text-negative ml-0.5", children: "*" })
    ] }),
    r
  ] });
}
function K() {
  return {
    amount: "",
    currency: "TRY",
    date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    vendor: "",
    category: "",
    note: ""
  };
}
function he({ result: t, onAddAnother: n, onClose: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center justify-center gap-4 py-12 px-6 text-center", children: [
    /* @__PURE__ */ e.jsx(pe, {}),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-xl font-semibold text-text-primary", children: "Masraf gönderildi" }),
      /* @__PURE__ */ e.jsxs("p", { className: "text-sm text-text-secondary mt-1", children: [
        (t == null ? void 0 : t.amount) && z(t.amount, t.currency || "TRY"),
        (t == null ? void 0 : t.vendor) && ` · ${t.vendor}`
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary mt-1", children: "Onaya gitti. Bildirim ile durumu takip edebilirsin." })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 w-full max-w-xs", children: [
      /* @__PURE__ */ e.jsx(N, { variant: "primary", size: "lg", onClick: n, children: "Bir tane daha çek" }),
      /* @__PURE__ */ e.jsx(N, { variant: "ghost", size: "md", onClick: r, children: "Bitir" })
    ] })
  ] });
}
const pe = () => /* @__PURE__ */ e.jsxs(
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
async function ge() {
  const [t, n] = await Promise.all([
    I.get("/api/app/project?MaxResultCount=200&Sorting=name"),
    I.get("/api/app/cash-account?MaxResultCount=100")
  ]);
  return {
    projects: ((t == null ? void 0 : t.items) ?? []).map((r) => ({ id: r.id, name: r.name, currency: r.currency })),
    accounts: ((n == null ? void 0 : n.items) ?? []).map((r) => ({ id: r.id, name: r.name, currency: r.currency }))
  };
}
async function be(t) {
  if (!t)
    return { lines: [], requiresBudgetLine: !1 };
  const n = await I.get(`/api/app/project-budget/record-form-lookup/${t}`);
  return {
    lines: ((n == null ? void 0 : n.lines) ?? []).map((r) => ({
      id: r.id,
      label: r.code ? `${r.code} · ${r.name}` : r.name,
      remaining: r.remainingAmount
    })),
    requiresBudgetLine: !!(n != null && n.requiresBudgetLine)
  };
}
function ye(t) {
  const n = Number.parseInt(t, 10);
  return Number.isInteger(n) && n >= 0 ? n : 0;
}
function W(t) {
  return I.post("/api/app/expense", {
    title: t.title || t.vendor,
    amount: t.amount,
    currency: t.currency || "TRY",
    expenseDate: t.date,
    category: ye(t.category),
    cashAccountId: t.cashAccountId,
    projectId: t.projectId || null,
    budgetLineId: t.budgetLineId || null,
    description: t.description || t.note || null
  });
}
const je = "apya.expenseQueue.v1", ke = "apya.expenseQueue.rejected.v1", Y = () => $(je), B = () => $(ke);
function v(t = Y()) {
  try {
    const n = window.localStorage.getItem(t), r = n ? JSON.parse(n) : [];
    return Array.isArray(r) ? r : [];
  } catch {
    return [];
  }
}
function L(t, n = Y()) {
  try {
    return window.localStorage.setItem(n, JSON.stringify(t)), !0;
  } catch {
    return !1;
  }
}
function ve() {
  return "q_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
}
const y = {
  /** Kuyruktaki kayıtlar (en eski önce). */
  list: v,
  count() {
    return v().length;
  },
  /**
   * Kuyruğa ekler. Depoya yazılamadıysa false döner — çağıran kullanıcıya
   * "kaydedemedik" demeli, "kaydedildi" DEMEMELİ.
   */
  enqueue(t) {
    const n = v();
    return n.push({ clientId: ve(), queuedAt: (/* @__PURE__ */ new Date()).toISOString(), payload: t }), L(n);
  },
  remove(t) {
    L(v().filter((n) => n.clientId !== t));
  },
  /** Sunucunun kalıcı olarak reddettiği (4xx) kayıtlar — silinmez, ayrı tutulur. */
  rejected() {
    return v(B());
  },
  clear() {
    L([]);
  }
};
let q = !1;
async function we(t) {
  if (q)
    return { sent: 0, failed: 0, remaining: y.count() };
  q = !0;
  let n = 0, r = 0, u = 0;
  try {
    for (const c of y.list())
      try {
        await t(c.payload), y.remove(c.clientId), n++;
      } catch (o) {
        if (ae(o)) {
          L(v(B()).concat({ ...c, rejectedAt: (/* @__PURE__ */ new Date()).toISOString(), error: (o == null ? void 0 : o.message) ?? null }), B()), y.remove(c.clientId), u++;
          continue;
        }
        r++;
        break;
      }
  } finally {
    q = !1;
  }
  return { sent: n, failed: r, rejected: u, remaining: y.count() };
}
function Ce() {
  return _({
    queryKey: ["expense-capture", "context"],
    queryFn: ge,
    staleTime: 5 * 60 * 1e3
  });
}
function Se(t) {
  return _({
    queryKey: ["expense-capture", "lines", t],
    queryFn: () => be(t),
    enabled: !!t,
    staleTime: 60 * 1e3
  });
}
function Ne() {
  const [t, n] = l.useState(() => typeof navigator > "u" ? !0 : navigator.onLine !== !1), [r, u] = l.useState(() => y.count()), c = l.useCallback(() => u(y.count()), []);
  return l.useEffect(() => {
    const o = () => n(!0), m = () => n(!1);
    return window.addEventListener("online", o), window.addEventListener("offline", m), () => {
      window.removeEventListener("online", o), window.removeEventListener("offline", m);
    };
  }, []), { isOnline: t, queued: r, refreshQueued: c };
}
function Ee() {
  return re({
    retry: !1,
    /* Finansal işlem — duplicate önlenir */
    mutationFn: async (t) => {
      if (typeof navigator > "u" || navigator.onLine !== !1)
        return { queued: !1, result: await W(t) };
      if (!y.enqueue(t))
        throw new Error("Cihazda yer kalmadı, kayıt saklanamadı. Bağlantı gelince tekrar deneyin.");
      return { queued: !0, result: null };
    }
  });
}
function Le(t) {
  return l.useCallback(async () => {
    if (y.count() === 0)
      return null;
    const n = await we(W);
    return t == null || t(n), n;
  }, [t]);
}
const k = { CAPTURE: "capture", FORM: "form", SUCCESS: "success" }, Ie = 1500;
function Te() {
  const [t, n] = l.useState(k.CAPTURE), [r, u] = l.useState(null), [c, o] = l.useState(null), [m, s] = l.useState(null), p = Ce(), i = Se(m), { isOnline: h, queued: w, refreshQueued: C } = Ne(), x = Ee(), g = Q(), T = l.useCallback((d) => {
    r && URL.revokeObjectURL(r), u(URL.createObjectURL(d)), n(k.FORM);
  }, [r]), S = l.useCallback(() => {
    r && URL.revokeObjectURL(r), u(null), o(null), x.reset(), n(k.CAPTURE);
  }, [r, x]), E = l.useCallback(async (d) => {
    try {
      const b = await x.mutateAsync(d);
      o(b.result), n(k.SUCCESS), C(), b.queued ? g.warning("Kuyruğa alındı", {
        description: "Bağlantı yok — bağlantı gelince otomatik gönderilecek."
      }) : g.success("Masraf kaydedildi", {
        description: `${z(d.amount, d.currency)} — ${d.vendor || "Kayıt"}`
      }), setTimeout(() => {
        S();
      }, Ie);
    } catch (b) {
      const D = ((b == null ? void 0 : b.validationErrors) ?? []).map((M) => M == null ? void 0 : M.message).filter(Boolean);
      g.error("Kayıt başarısız", {
        description: D.length ? D.join(" · ") : (b == null ? void 0 : b.message) ?? "Tekrar deneyebilirsin."
      });
    }
  }, [x, g, S, C]), a = Le((d) => {
    C(), d.sent > 0 ? g.success(`${d.sent} kayıt gönderildi`, {
      description: d.remaining > 0 ? `${d.remaining} kayıt hâlâ kuyrukta.` : "Kuyruk boşaldı."
    }) : d.failed > 0 && g.error("Kuyruk gönderilemedi", {
      description: `${d.remaining} kayıt cihazda bekliyor.`
    });
  });
  l.useEffect(() => {
    h && a();
  }, [h, a]);
  const f = l.useCallback(() => {
    r && URL.revokeObjectURL(r), window.location.href = "/Dashboard";
  }, [r]);
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "sticky top-0 z-sticky bg-surface-raised/95 backdrop-blur-sm border-b border-default px-4 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h1", { className: "text-base font-semibold", children: "Masraf Yakala" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        !h && /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-warning-subtle px-2.5 py-1 text-[11.5px] font-semibold text-warning", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-wifi-slash" }),
          "Çevrimdışı"
        ] }),
        w > 0 && /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: a,
            className: "inline-flex min-h-[44px] items-center gap-1 rounded-full bg-accent-subtle px-3 text-[11.5px] font-semibold text-accent",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-cloud-arrow-up" }),
              w,
              " bekliyor"
            ]
          }
        ),
        /* @__PURE__ */ e.jsx(ie, {})
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("main", { className: "max-w-2xl mx-auto p-4", children: [
      t === k.CAPTURE && /* @__PURE__ */ e.jsx(ue, { onFile: T }),
      t === k.SUCCESS && /* @__PURE__ */ e.jsx(
        he,
        {
          result: c,
          onAddAnother: S,
          onClose: f
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(
      xe,
      {
        open: t === k.FORM,
        onOpenChange: (d) => {
          d || n(k.CAPTURE);
        },
        previewUrl: r,
        onSubmit: E,
        isSubmitting: x.isPending,
        context: p.data,
        lines: i.data,
        onProjectChange: s,
        isOffline: !h
      }
    )
  ] });
}
ee();
const P = document.getElementById("apya-expense-capture-root");
P && H(
  P,
  "expense-capture",
  /* @__PURE__ */ e.jsx(X, { children: /* @__PURE__ */ e.jsx(Z, { children: /* @__PURE__ */ e.jsx(te, { children: /* @__PURE__ */ e.jsx(Te, {}) }) }) })
);
