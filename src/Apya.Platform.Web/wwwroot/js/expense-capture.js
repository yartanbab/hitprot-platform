import { j as e, r as d, b as X } from "./react-vendor-D7YDiBbi.js";
import { t as U, m as Z } from "./index-DgpuJ91w.js";
import { u as ee, B as T, c as Q, S as B, M as te, I as K, a as P, T as ne } from "./Dialog-BHF0cPzq.js";
import { a as re } from "./QueryProvider-D2Hvqdr9.js";
import { u as Y, r as ae, T as se } from "./registerServiceWorker-pidX-tlY.js";
import { C as ie } from "./Combobox-BsuZ2Fmj.js";
import { u as G, b as oe } from "./query-vendor-Db2mwxYI.js";
import { a as A, r as le } from "./httpClient-BNoyY5yK.js";
import { i as ce, s as W } from "./permanentRejection-SvaBclz0.js";
const ue = {
  light: { key: "Theme:Light", fallback: "Açık tema (Sıradaki: Koyu)" },
  dark: { key: "Theme:Dark", fallback: "Koyu tema (Sıradaki: Sistem)" },
  system: { key: "Theme:System", fallback: "Sistem teması (Sıradaki: Açık)" }
};
function de({ className: t = "" }) {
  const { preference: n, toggle: r } = ee(), a = ue[n], o = a ? U(a.key, a.fallback) : U("Theme:Toggle", "Tema değiştir");
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: r,
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
        n === "light" && /* @__PURE__ */ e.jsx(me, {}),
        n === "dark" && /* @__PURE__ */ e.jsx(fe, {}),
        n === "system" && /* @__PURE__ */ e.jsx(xe, {})
      ]
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
        /* @__PURE__ */ e.jsx("circle", { cx: "12", cy: "12", r: "4" }),
        /* @__PURE__ */ e.jsx("path", { d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" })
      ]
    }
  );
}
function fe() {
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
function he({ onFile: t }) {
  const n = d.useRef(null), [r, a] = X.useState(!1), o = Y(), l = d.useCallback(() => {
    var i;
    return (i = n.current) == null ? void 0 : i.click();
  }, []), c = d.useCallback((i) => {
    if (i) {
      if (!i.type.startsWith("image/")) {
        o.error("Resim dosyası gerekli", {
          description: "Lütfen JPG/PNG/HEIC fatura görseli seç."
        });
        return;
      }
      if (i.size > 10 * 1024 * 1024) {
        o.error("Dosya çok büyük", {
          description: "En fazla 10 MB. Lütfen daha düşük çözünürlükte çek."
        });
        return;
      }
      t(i);
    }
  }, [t, o]);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "button",
      tabIndex: 0,
      "aria-label": "Faturayı çek — kamerayı aç ya da görüntü sürükle",
      onClick: l,
      onKeyDown: (i) => {
        (i.key === "Enter" || i.key === " ") && (i.preventDefault(), l());
      },
      onDragOver: (i) => {
        i.preventDefault(), a(!0);
      },
      onDragLeave: () => a(!1),
      onDrop: (i) => {
        var x;
        i.preventDefault(), a(!1), c((x = i.dataTransfer.files) == null ? void 0 : x[0]);
      },
      className: Q(
        "flex flex-col items-center justify-center gap-4",
        "border-2 border-dashed rounded-xl p-8",
        "min-h-[60vh] mobile:min-h-[50vh]",
        "cursor-pointer select-none",
        "transition-colors duration-fast",
        "focus-visible:outline-none focus-visible:shadow-focus",
        r ? "border-brand-500 bg-brand-50" : "border-default bg-surface-raised hover:border-strong"
      ),
      children: [
        /* @__PURE__ */ e.jsx(pe, {}),
        /* @__PURE__ */ e.jsxs("div", { className: "text-center max-w-xs pointer-events-none", children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-base font-semibold text-text-primary", children: "Faturayı çek" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-secondary mt-1", children: "Mobilde direkt kamera açılır. Masaüstünde dosya sürükle ya da tıkla. Fotoğraf formun üstünde görünür; tutarı, tarihi ve tedarikçiyi ona bakarak girersin." })
        ] }),
        /* @__PURE__ */ e.jsx(
          T,
          {
            size: "lg",
            variant: "primary",
            onClick: (i) => {
              i.stopPropagation(), l();
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
            onChange: (i) => {
              var x;
              return c((x = i.target.files) == null ? void 0 : x[0]);
            }
          }
        )
      ]
    }
  );
}
function pe() {
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
  { value: "0", label: "Genel / Diğer" },
  { value: "1", label: "Ofis / Kira" },
  { value: "2", label: "Seyahat / Ulaşım" },
  { value: "3", label: "Personel / Maaş" },
  { value: "4", label: "Malzeme / Sarf" },
  { value: "5", label: "Hizmet / Danışmanlık" },
  { value: "6", label: "Vergi / Harç" }
], be = ["TRY", "USD", "EUR"], _ = {
  attach: "Fotoğraf kayda fiş olarak eklenir; Belgeler'de de görünür.",
  offline: "Bağlantı yokken fotoğraf kayda eklenmez. Gider gönderildikten sonra fişi gider düzenleme penceresinden ekleyebilirsin.",
  none: "Fotoğraf yalnız bu ekranda görünür, kayda eklenmez."
}, z = [
  "block w-full min-h-[44px] rounded-md border border-default bg-surface-base text-text-primary",
  "px-3 py-2 text-sm",
  "focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus"
].join(" ");
function ye({
  open: t,
  onOpenChange: n,
  previewUrl: r,
  onSubmit: a,
  isSubmitting: o,
  context: l,
  lines: c,
  onProjectChange: i,
  isOffline: x,
  receiptMode: C = "none"
}) {
  var M;
  const [u, j] = d.useState($), [I, v] = d.useState(!1);
  d.useEffect(() => {
    j($());
  }, [r]);
  const p = (s) => (f) => j((N) => ({ ...N, [s]: f != null && f.target ? f.target.value : f })), S = !!(c != null && c.requiresBudgetLine), w = !u.cashAccountId || S && !u.budgetLineId, g = async (s) => {
    if (s.preventDefault(), o || w) return;
    const f = {
      ...u,
      amount: typeof u.amount == "number" ? u.amount : parseFloat(u.amount)
    };
    await a(f);
  };
  return /* @__PURE__ */ e.jsx(B, { open: t, onOpenChange: n, children: /* @__PURE__ */ e.jsx(B.Content, { title: "Masraf detayları", description: "Fişteki bilgileri girin ve gönderin", children: /* @__PURE__ */ e.jsxs("form", { onSubmit: g, className: "flex flex-col flex-1 min-h-0", children: [
    /* @__PURE__ */ e.jsx("header", { className: "px-4 pt-2 pb-3 border-b border-subtle flex items-center justify-between", children: /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-semibold", children: "Masraf Detayları" }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4", children: [
      x && /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-warning bg-warning-subtle px-3 py-2 text-[12.5px] text-warning", children: [
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
        /* @__PURE__ */ e.jsx("figcaption", { className: "text-xs text-text-tertiary", children: _[C] ?? _.none })
      ] }),
      /* @__PURE__ */ e.jsx(y, { label: "Proje", children: /* @__PURE__ */ e.jsxs(
        "select",
        {
          className: z,
          value: u.projectId || "",
          onChange: (s) => {
            p("projectId")(s), i == null || i(s.target.value);
          },
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "— Projesiz —" }),
            ((l == null ? void 0 : l.projects) ?? []).map((s) => /* @__PURE__ */ e.jsx("option", { value: s.id, children: s.name }, s.id))
          ]
        }
      ) }),
      u.projectId && (((M = c == null ? void 0 : c.lines) == null ? void 0 : M.length) ?? 0) > 0 && /* @__PURE__ */ e.jsx(y, { label: "Bütçe kalemi", required: S, children: /* @__PURE__ */ e.jsxs(
        "select",
        {
          className: z,
          value: u.budgetLineId || "",
          onChange: p("budgetLineId"),
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "— Kalem seçin —" }),
            c.lines.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.id, children: s.label }, s.id))
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(y, { label: "Kasa / banka", required: !0, children: /* @__PURE__ */ e.jsxs(
        "select",
        {
          className: z,
          value: u.cashAccountId || "",
          onChange: p("cashAccountId"),
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "— Kasa seçin —" }),
            ((l == null ? void 0 : l.accounts) ?? []).map((s) => /* @__PURE__ */ e.jsxs("option", { value: s.id, children: [
              s.name,
              " (",
              s.currency,
              ")"
            ] }, s.id))
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(y, { label: "Tutar", required: !0, children: /* @__PURE__ */ e.jsx(
        te,
        {
          value: u.amount,
          onValueChange: (s) => j((f) => ({ ...f, amount: s ?? "" })),
          currency: u.currency,
          currencies: be,
          onCurrencyChange: (s) => j((f) => ({ ...f, currency: s })),
          size: "lg",
          required: !0,
          min: 0.01
        }
      ) }),
      /* @__PURE__ */ e.jsx(y, { label: "Tarih", required: !0, children: /* @__PURE__ */ e.jsx(
        K,
        {
          type: "date",
          required: !0,
          size: "lg",
          value: u.date,
          onChange: p("date")
        }
      ) }),
      /* @__PURE__ */ e.jsx(y, { label: "Tedarikçi", required: !0, children: /* @__PURE__ */ e.jsx(
        K,
        {
          type: "text",
          required: !0,
          size: "lg",
          value: u.vendor,
          onChange: p("vendor"),
          placeholder: "örn. Migros A.Ş."
        }
      ) }),
      /* @__PURE__ */ e.jsx(y, { label: "Kategori", children: /* @__PURE__ */ e.jsx(
        ie,
        {
          options: ge,
          value: u.category,
          onChange: (s) => j((f) => ({ ...f, category: s })),
          placeholder: "Kategori seç"
        }
      ) }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => v((s) => !s),
          className: "self-start text-sm text-text-link hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
          children: I ? "Daha az alan" : "Daha fazla alan"
        }
      ),
      I && /* @__PURE__ */ e.jsx(e.Fragment, { children: /* @__PURE__ */ e.jsx(y, { label: "Not", children: /* @__PURE__ */ e.jsx(
        "textarea",
        {
          rows: 2,
          value: u.note,
          onChange: p("note"),
          className: Q(
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
        /* @__PURE__ */ e.jsx("span", { className: "font-tabular font-semibold text-text-primary", children: typeof u.amount == "number" && u.amount > 0 ? P(u.amount, u.currency) : "—" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ e.jsx(B.Close, { asChild: !0, children: /* @__PURE__ */ e.jsx(T, { type: "button", variant: "ghost", size: "md", children: "İptal" }) }),
        /* @__PURE__ */ e.jsx(
          T,
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
function y({ label: t, required: n, children: r }) {
  return /* @__PURE__ */ e.jsxs("label", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsxs("span", { className: "text-sm font-medium text-text-secondary", children: [
      t,
      n && /* @__PURE__ */ e.jsx("span", { className: "text-text-negative ml-0.5", children: "*" })
    ] }),
    r
  ] });
}
function $() {
  return {
    amount: "",
    currency: "TRY",
    date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    vendor: "",
    category: "",
    note: ""
  };
}
function ke({ result: t, onAddAnother: n, onClose: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center justify-center gap-4 py-12 px-6 text-center", children: [
    /* @__PURE__ */ e.jsx(je, {}),
    /* @__PURE__ */ e.jsxs("div", { children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-xl font-semibold text-text-primary", children: "Masraf gönderildi" }),
      /* @__PURE__ */ e.jsxs("p", { className: "text-sm text-text-secondary mt-1", children: [
        (t == null ? void 0 : t.amount) && P(t.amount, t.currency || "TRY"),
        (t == null ? void 0 : t.vendor) && ` · ${t.vendor}`
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary mt-1", children: "Onaya gitti. Bildirim ile durumu takip edebilirsin." })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2 w-full max-w-xs", children: [
      /* @__PURE__ */ e.jsx(T, { variant: "primary", size: "lg", onClick: n, children: "Bir tane daha çek" }),
      /* @__PURE__ */ e.jsx(T, { variant: "ghost", size: "md", onClick: r, children: "Bitir" })
    ] })
  ] });
}
const je = () => /* @__PURE__ */ e.jsxs(
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
async function ve() {
  const [t, n] = await Promise.all([
    A.get("/api/app/project?MaxResultCount=200&Sorting=name"),
    A.get("/api/app/cash-account?MaxResultCount=100")
  ]);
  return {
    projects: ((t == null ? void 0 : t.items) ?? []).map((r) => ({ id: r.id, name: r.name, currency: r.currency })),
    accounts: ((n == null ? void 0 : n.items) ?? []).map((r) => ({ id: r.id, name: r.name, currency: r.currency }))
  };
}
async function we(t) {
  if (!t)
    return { lines: [], requiresBudgetLine: !1 };
  const n = await A.get(`/api/app/project-budget/record-form-lookup/${t}`);
  return {
    lines: ((n == null ? void 0 : n.lines) ?? []).map((r) => ({
      id: r.id,
      label: r.code ? `${r.code} · ${r.name}` : r.name,
      remaining: r.remainingAmount
    })),
    requiresBudgetLine: !!(n != null && n.requiresBudgetLine)
  };
}
function Ce(t) {
  const n = Number.parseInt(t, 10);
  return Number.isInteger(n) && n >= 0 ? n : 0;
}
function H(t) {
  return A.post("/api/app/expense", {
    title: t.title || t.vendor,
    amount: t.amount,
    currency: t.currency || "TRY",
    expenseDate: t.date,
    category: Ce(t.category),
    cashAccountId: t.cashAccountId,
    projectId: t.projectId || null,
    budgetLineId: t.budgetLineId || null,
    description: t.description || t.note || null
  });
}
const Se = { "image/jpeg": ".jpg", "image/png": ".png", "image/gif": ".gif" };
function Ee(t, n) {
  const r = (t == null ? void 0 : t.name) ?? "", a = r.lastIndexOf("."), o = a > 0 ? r.slice(a).toLowerCase() : Se[t == null ? void 0 : t.type] ?? ".jpg";
  return ["Fiş", (n == null ? void 0 : n.title) || (n == null ? void 0 : n.vendor), n == null ? void 0 : n.date].map((c) => String(c ?? "").replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim()).filter(Boolean).join(" - ").slice(0, 120) + o;
}
async function Ne(t, n, r) {
  var i, x;
  const a = new FormData();
  a.append("expenseId", t), a.append("file", n, Ee(n, r));
  const o = {}, l = le();
  l && (o.RequestVerificationToken = l);
  const c = await fetch("/Expenses/Capture?handler=AttachReceipt", {
    method: "POST",
    credentials: "include",
    headers: o,
    body: a
  });
  if (!c.ok) {
    let C = null;
    try {
      C = ((x = (i = await c.json()) == null ? void 0 : i.error) == null ? void 0 : x.message) ?? null;
    } catch {
    }
    throw new Error(C || `Fiş eklenemedi (${c.status}).`);
  }
}
const Le = "apya.expenseQueue.v1", Te = "apya.expenseQueue.rejected.v1", J = () => W(Le), F = () => W(Te);
function E(t = J()) {
  try {
    const n = window.localStorage.getItem(t), r = n ? JSON.parse(n) : [];
    return Array.isArray(r) ? r : [];
  } catch {
    return [];
  }
}
function R(t, n = J()) {
  try {
    return window.localStorage.setItem(n, JSON.stringify(t)), !0;
  } catch {
    return !1;
  }
}
function Ie() {
  return "q_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
}
const b = {
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
    return n.push({ clientId: Ie(), queuedAt: (/* @__PURE__ */ new Date()).toISOString(), payload: t }), R(n);
  },
  remove(t) {
    R(E().filter((n) => n.clientId !== t));
  },
  /** Sunucunun kalıcı olarak reddettiği (4xx) kayıtlar — silinmez, ayrı tutulur. */
  rejected() {
    return E(F());
  },
  clear() {
    R([]);
  }
};
let O = !1;
async function Me(t) {
  if (O)
    return { sent: 0, failed: 0, remaining: b.count() };
  O = !0;
  let n = 0, r = 0, a = 0;
  try {
    for (const o of b.list())
      try {
        await t(o.payload), b.remove(o.clientId), n++;
      } catch (l) {
        if (ce(l)) {
          R(E(F()).concat({ ...o, rejectedAt: (/* @__PURE__ */ new Date()).toISOString(), error: (l == null ? void 0 : l.message) ?? null }), F()), b.remove(o.clientId), a++;
          continue;
        }
        r++;
        break;
      }
  } finally {
    O = !1;
  }
  return { sent: n, failed: r, rejected: a, remaining: b.count() };
}
function Re() {
  return G({
    queryKey: ["expense-capture", "context"],
    queryFn: ve,
    staleTime: 5 * 60 * 1e3
  });
}
function Ae(t) {
  return G({
    queryKey: ["expense-capture", "lines", t],
    queryFn: () => we(t),
    enabled: !!t,
    staleTime: 60 * 1e3
  });
}
function qe() {
  const [t, n] = d.useState(() => typeof navigator > "u" ? !0 : navigator.onLine !== !1), [r, a] = d.useState(() => b.count()), o = d.useCallback(() => a(b.count()), []);
  return d.useEffect(() => {
    const l = () => n(!0), c = () => n(!1);
    return window.addEventListener("online", l), window.addEventListener("offline", c), () => {
      window.removeEventListener("online", l), window.removeEventListener("offline", c);
    };
  }, []), { isOnline: t, queued: r, refreshQueued: o };
}
function Be() {
  return oe({
    retry: !1,
    /* Finansal işlem — duplicate önlenir */
    mutationFn: async ({ payload: t, photo: n = null }) => {
      if (typeof navigator > "u" || navigator.onLine !== !1) {
        const a = await H(t);
        if (!n || !(a != null && a.id))
          return { queued: !1, result: a, receiptAttached: !1, receiptError: null };
        try {
          return await Ne(a.id, n, t), { queued: !1, result: a, receiptAttached: !0, receiptError: null };
        } catch (o) {
          return { queued: !1, result: a, receiptAttached: !1, receiptError: (o == null ? void 0 : o.message) ?? "Fiş eklenemedi." };
        }
      }
      if (!b.enqueue(t))
        throw new Error("Cihazda yer kalmadı, kayıt saklanamadı. Bağlantı gelince tekrar deneyin.");
      return { queued: !0, result: null };
    }
  });
}
function ze(t) {
  return d.useCallback(async () => {
    if (b.count() === 0)
      return null;
    const n = await Me(H);
    return t == null || t(n), n;
  }, [t]);
}
const k = { CAPTURE: "capture", FORM: "form", SUCCESS: "success" }, Oe = 1500;
function De({ canAttachReceipt: t = !1 }) {
  const [n, r] = d.useState(k.CAPTURE), [a, o] = d.useState(null), [l, c] = d.useState(null), [i, x] = d.useState(null), [C, u] = d.useState(null), j = Re(), I = Ae(C), { isOnline: v, queued: p, refreshQueued: S } = qe(), w = Be(), g = Y(), M = d.useCallback((m) => {
    a && URL.revokeObjectURL(a), o(URL.createObjectURL(m)), c(m), r(k.FORM);
  }, [a]), s = d.useCallback(() => {
    a && URL.revokeObjectURL(a), o(null), c(null), x(null), w.reset(), r(k.CAPTURE);
  }, [a, w]), f = d.useCallback(async (m) => {
    try {
      const h = await w.mutateAsync({ payload: m, photo: t ? l : null });
      x(h.result), r(k.SUCCESS), S();
      const L = `${P(m.amount, m.currency)} — ${m.vendor || "Kayıt"}`;
      h.queued ? g.warning("Kuyruğa alındı", {
        description: "Bağlantı yok — bağlantı gelince otomatik gönderilecek."
      }) : h.receiptError ? g.warning("Masraf kaydedildi, fiş eklenemedi", {
        description: `${h.receiptError} Fişi gider düzenleme penceresinden ekleyebilirsin.`
      }) : g.success("Masraf kaydedildi", {
        description: h.receiptAttached ? `${L} · fiş eklendi` : L
      }), setTimeout(() => {
        s();
      }, Oe);
    } catch (h) {
      const L = ((h == null ? void 0 : h.validationErrors) ?? []).map((q) => q == null ? void 0 : q.message).filter(Boolean);
      g.error("Kayıt başarısız", {
        description: L.length ? L.join(" · ") : (h == null ? void 0 : h.message) ?? "Tekrar deneyebilirsin."
      });
    }
  }, [w, g, s, S, t, l]), N = ze((m) => {
    S(), m.sent > 0 ? g.success(`${m.sent} kayıt gönderildi`, {
      description: m.remaining > 0 ? `${m.remaining} kayıt hâlâ kuyrukta.` : "Kuyruk boşaldı."
    }) : m.failed > 0 && g.error("Kuyruk gönderilemedi", {
      description: `${m.remaining} kayıt cihazda bekliyor.`
    });
  });
  d.useEffect(() => {
    v && N();
  }, [v, N]);
  const V = d.useCallback(() => {
    a && URL.revokeObjectURL(a), window.location.href = "/Dashboard";
  }, [a]);
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "sticky top-0 z-sticky bg-surface-raised/95 backdrop-blur-sm border-b border-default px-4 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h1", { className: "text-base font-semibold", children: "Masraf Yakala" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        !v && /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-warning-subtle px-2.5 py-1 text-[11.5px] font-semibold text-warning", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-wifi-slash" }),
          "Çevrimdışı"
        ] }),
        p > 0 && /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: N,
            className: "inline-flex min-h-[44px] items-center gap-1 rounded-full bg-accent-subtle px-3 text-[11.5px] font-semibold text-accent",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-cloud-arrow-up" }),
              p,
              " bekliyor"
            ]
          }
        ),
        /* @__PURE__ */ e.jsx(de, {})
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("main", { className: "max-w-2xl mx-auto p-4", children: [
      n === k.CAPTURE && /* @__PURE__ */ e.jsx(he, { onFile: M }),
      n === k.SUCCESS && /* @__PURE__ */ e.jsx(
        ke,
        {
          result: i,
          onAddAnother: s,
          onClose: V
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(
      ye,
      {
        open: n === k.FORM,
        onOpenChange: (m) => {
          m || r(k.CAPTURE);
        },
        previewUrl: a,
        onSubmit: f,
        isSubmitting: w.isPending,
        context: j.data,
        lines: I.data,
        onProjectChange: u,
        isOffline: !v,
        receiptMode: t ? v ? "attach" : "offline" : "none"
      }
    )
  ] });
}
ae();
const D = document.getElementById("apya-expense-capture-root");
if (D) {
  const t = D.dataset.canAttachDocuments === "true";
  Z(
    D,
    "expense-capture",
    /* @__PURE__ */ e.jsx(ne, { children: /* @__PURE__ */ e.jsx(re, { children: /* @__PURE__ */ e.jsx(se, { children: /* @__PURE__ */ e.jsx(De, { canAttachReceipt: t }) }) }) })
  );
}
