import { j as e, r as l } from "./react-vendor-D7YDiBbi.js";
import { m as O, u as A, E as R } from "./index-DgpuJ91w.js";
import { a as h } from "./httpClient-BNoyY5yK.js";
import { H as K } from "./Hint-BhMztyJX.js";
import { p as T } from "./publicFormLink-CJ_6ABDU.js";
import { s as F, a as B, C as P } from "./formChoices-CDoZfRj7.js";
const $ = {
  0: { label: "Taslak", cls: "bg-neutral-100 text-neutral-700" },
  1: { label: "Yayında", cls: "bg-positive-100 text-positive-700" },
  2: { label: "Arşiv", cls: "bg-warning-100 text-warning-700" }
}, _ = (a) => {
  try {
    return new Date(a).toLocaleDateString("tr-TR");
  } catch {
    return a;
  }
}, H = (a) => {
  var n, s;
  return (s = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.auth) == null ? void 0 : s.isGranted(a);
}, D = (a, n) => (getComputedStyle(document.documentElement).getPropertyValue(a) || "").trim() || n, S = () => D("--apya-neutral-400", "#9CA3AF"), I = () => D("--apya-accent-500", "#4F46E5");
function Y() {
  const [a, n] = l.useState([]), [s, d] = l.useState(!0), [x, p] = l.useState(null), [f, b] = l.useState([]), [i, o] = l.useState(""), [y, g] = l.useState(!1), [w, v] = l.useState(!1), C = H("Platform.DynamicAssets.ManageCategories"), j = l.useRef(0), r = async (t) => {
    const m = ++j.current;
    d(!0);
    try {
      const u = new URLSearchParams({ MaxResultCount: "200", SkipCount: "0" });
      t && u.set("CategoryId", t);
      const k = await h.get(`/api/app/form?${u.toString()}`);
      if (m !== j.current) return;
      n(k.items || []), p(null);
    } catch (u) {
      if (m !== j.current) return;
      p(u);
    } finally {
      m === j.current && d(!1);
    }
  }, c = () => {
    h.get("/api/app/form-category?MaxResultCount=100").then((t) => b(t.items || [])).catch(() => {
    });
  };
  l.useEffect(() => {
    c();
  }, []), l.useEffect(() => {
    r(i);
  }, [i]);
  const E = A(!s && !x), L = (t) => f.find((m) => m.id === t), M = async (t) => {
    if (await q(t.title))
      try {
        await h.delete(`/api/app/form/${t.id}`), n((u) => u.filter((k) => k.id !== t.id)), N("success", "Form silindi.");
      } catch (u) {
        N("error", (u == null ? void 0 : u.message) || "Silme başarısız.");
      }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "text-text-primary", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h1", { className: "text-2xl font-bold text-text-primary", children: "Formlarım" }),
        /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-secondary", children: s || x ? "—" : `${a.length} form` })
      ] }),
      /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets/Builder", className: "rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-accent-600", children: "+ Yeni Form" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mb-5 flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          onClick: () => o(""),
          className: `rounded-full px-3 py-1.5 text-xs font-semibold transition ${i === "" ? "bg-accent text-white" : "bg-surface-sunken text-text-secondary hover:opacity-80"}`,
          children: "Tümü"
        }
      ),
      f.map((t) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          onClick: () => o(t.id),
          className: `rounded-full px-3 py-1.5 text-xs font-semibold transition ${i === t.id ? "text-white" : "text-text-secondary hover:opacity-80"}`,
          style: i === t.id ? { backgroundColor: t.color || I() } : { backgroundColor: `${t.color || S()}20` },
          children: [
            t.icon ? `${t.icon} ` : "",
            t.name
          ]
        },
        t.id
      )),
      C && /* @__PURE__ */ e.jsx("button", { onClick: () => g(!0), className: "ml-1 rounded-full border border-dashed border-default px-3 py-1.5 text-xs font-semibold text-text-secondary hover:border-strong hover:text-text-primary", children: "⚙ Kategoriler" }),
      /* @__PURE__ */ e.jsx("button", { onClick: () => v(!0), className: "rounded-full border border-dashed border-default px-3 py-1.5 text-xs font-semibold text-text-secondary hover:border-strong hover:text-text-primary", children: "⚡ Veri kaynakları" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { ref: E.contentRef, tabIndex: -1, children: s && !x ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Formlar yükleniyor…" }) : x ? /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border-2 border-dashed border-default py-12", children: /* @__PURE__ */ e.jsx(R, { variant: "error", title: "Formlar yüklenemedi", error: x, onRetry: E.retry(() => r(i)), retrying: s }) }) : a.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border-2 border-dashed border-default py-20 text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-3xl", children: "📝" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-bold text-text-primary", children: i ? "Bu kategoride form yok" : "Henüz formun yok" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-text-tertiary", children: i ? "Başka bir kategori seç veya yeni form oluştur." : "İlk formunu oluşturmak için başla." }),
      /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets/Builder", className: "mt-4 inline-block rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600", children: "+ Yeni Form Oluştur" })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3", children: a.map((t) => {
      var u, k;
      const m = t.categoryId ? L(t.categoryId) : null;
      return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-default bg-surface-raised p-5 transition hover:shadow-md", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "mb-2 flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("h3", { className: "line-clamp-2 font-bold text-text-primary", children: t.title }),
          /* @__PURE__ */ e.jsx("span", { className: `shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${(u = $[t.status]) == null ? void 0 : u.cls}`, children: (k = $[t.status]) == null ? void 0 : k.label })
        ] }),
        m && /* @__PURE__ */ e.jsxs("span", { className: "mb-2 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", style: { backgroundColor: `${m.color || S()}20`, color: m.color || "var(--apya-text-secondary)" }, children: [
          m.icon ? `${m.icon} ` : "",
          m.name
        ] }),
        t.description && /* @__PURE__ */ e.jsx("p", { className: "mb-3 line-clamp-2 text-sm text-text-secondary", children: t.description }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-auto flex items-center gap-3 border-t border-subtle pt-3 text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsxs("span", { className: "whitespace-nowrap", children: [
            "📊 ",
            t.responseCount,
            " yanıt"
          ] }),
          /* @__PURE__ */ e.jsxs("span", { className: "whitespace-nowrap", children: [
            "👁 ",
            t.viewCount
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: "ml-auto whitespace-nowrap", children: _(t.creationTime) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Builder?id=${t.id}`, className: "min-w-0 flex-1 truncate rounded-lg border border-default px-3 py-1.5 text-center text-xs font-semibold text-text-secondary hover:bg-surface-sunken", children: "Düzenle" }),
          /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Responses?formId=${t.id}`, className: "min-w-0 flex-1 truncate rounded-lg border border-default px-3 py-1.5 text-center text-xs font-semibold text-text-secondary hover:bg-surface-sunken", children: "Yanıtlar" }),
          t.status === 1 && /* @__PURE__ */ e.jsx("a", { href: T(t.slug), target: "_blank", rel: "noreferrer", className: "shrink-0 rounded-lg border border-default px-2.5 py-1.5 text-xs hover:bg-surface-sunken", title: "Formu aç", children: "↗" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => M(t), className: "shrink-0 rounded-lg border border-negative-100 px-2.5 py-1.5 text-xs text-negative-500 hover:bg-negative-50", children: "🗑" }),
          /* @__PURE__ */ e.jsx(K, { placement: "left", text: "Formu siler ama mevcut yanıtları SİLMEZ — yanıtlar veritabanında kalır, sahipsiz kalır ve bir daha hiçbir ekrandan erişilemez." })
        ] })
      ] }, t.id);
    }) }) }),
    w && /* @__PURE__ */ e.jsx(U, { onClose: () => v(!1) }),
    y && /* @__PURE__ */ e.jsx(
      V,
      {
        categories: f,
        onClose: () => g(!1),
        onChanged: c
      }
    )
  ] });
}
function U({ onClose: a }) {
  const [n, s] = l.useState(null), [d, x] = l.useState(null), [p, f] = l.useState(!0), b = () => {
    f(!0), s(null), h.get("/api/app/form/choice-sources").then((o) => {
      s(o || []), x(null);
    }).catch((o) => x(o)).finally(() => f(!1));
  };
  l.useEffect(() => {
    b();
  }, []);
  const i = A(!p && !d);
  return /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4", onClick: a, children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-lg rounded-2xl border border-default bg-surface-elevated p-6 shadow-xl", onClick: (o) => o.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-1 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-text-primary", children: "Veri kaynakları" }),
      /* @__PURE__ */ e.jsx("button", { onClick: a, className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "mb-4 text-sm text-text-secondary", children: "Açılır liste alanını bu listelerden birine bağlayabilirsiniz; seçenekler form her açıldığında güncel veriden gelir." }),
    /* @__PURE__ */ e.jsx("div", { ref: i.contentRef, tabIndex: -1, children: d ? /* @__PURE__ */ e.jsx(R, { compact: !0, variant: "error", title: "Veri kaynakları yüklenemedi", error: d, onRetry: i.retry(b), retrying: p }) : n == null ? /* @__PURE__ */ e.jsx("p", { className: "py-8 text-center text-sm text-text-tertiary", children: "Yükleniyor…" }) : n.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "py-8 text-center text-sm text-text-tertiary", children: "Tanımlı veri kaynağı yok." }) : /* @__PURE__ */ e.jsx("div", { className: "flex max-h-80 flex-col gap-2 overflow-y-auto", children: n.map((o) => {
      var y;
      return /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle px-3 py-2", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: F(o.key) }),
          /* @__PURE__ */ e.jsx("span", { className: "rounded-full bg-surface-sunken px-2 py-0.5 text-[11px] font-semibold text-text-secondary", children: B[o.scope] || "Kapsam belirsiz" }),
          o.dependsOnSourceKey && /* @__PURE__ */ e.jsxs("span", { className: "rounded-full bg-primary-subtle px-2 py-0.5 text-[11px] font-semibold text-text-primary", children: [
            "⛓ ",
            F(o.dependsOnSourceKey),
            " alanına bağlı"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-xs text-text-secondary", children: ((y = P[o.key]) == null ? void 0 : y.hint) || "" }),
        /* @__PURE__ */ e.jsxs("p", { className: "mt-1 text-xs text-text-secondary", children: [
          o.recordCount == null ? "Kayıt sayısı firmaya göre değişir" : `${o.recordCount} kayıt`,
          " · ",
          o.usedInFormCount > 0 ? `${o.usedInFormCount} formda kullanılıyor` : "Henüz hiçbir formda kullanılmıyor"
        ] })
      ] }, o.key);
    }) }) })
  ] }) });
}
function V({ categories: a, onClose: n, onChanged: s }) {
  const [d, x] = l.useState(""), [p, f] = l.useState(I()), [b, i] = l.useState(!1), [o, y] = l.useState(null), [g, w] = l.useState(""), v = async () => {
    if (d.trim()) {
      i(!0);
      try {
        await h.post("/api/app/form-category", { name: d.trim(), color: p, icon: null, order: a.length }), x(""), s();
      } catch (r) {
        N("error", (r == null ? void 0 : r.message) || "Kategori eklenemedi.");
      } finally {
        i(!1);
      }
    }
  }, C = async (r) => {
    if (g.trim())
      try {
        await h.put(`/api/app/form-category/${r.id}`, { name: g.trim(), color: r.color, icon: r.icon, order: r.order }), y(null), s();
      } catch (c) {
        N("error", (c == null ? void 0 : c.message) || "Güncellenemedi.");
      }
  }, j = async (r) => {
    if (window.confirm(`"${r.name}" kategorisini silmek istediğinize emin misiniz?`))
      try {
        await h.delete(`/api/app/form-category/${r.id}`), s();
      } catch (c) {
        N("error", (c == null ? void 0 : c.message) || "Silinemedi.");
      }
  };
  return /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4", onClick: n, children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-2xl border border-default bg-surface-elevated p-6 shadow-xl", onClick: (r) => r.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-text-primary", children: "Kategoriler" }),
      /* @__PURE__ */ e.jsx("button", { onClick: n, className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex max-h-64 flex-col gap-2 overflow-y-auto", children: [
      a.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz kategori yok." }),
      a.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-subtle px-3 py-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "h-3 w-3 shrink-0 rounded-full", style: { backgroundColor: r.color || S() } }),
        o === r.id ? /* @__PURE__ */ e.jsx("input", { autoFocus: !0, value: g, onChange: (c) => w(c.target.value), onKeyDown: (c) => c.key === "Enter" && C(r), className: "min-w-0 flex-1 rounded border border-default bg-surface-base px-2 py-1 text-sm text-text-primary" }) : /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 truncate text-sm font-medium text-text-secondary", children: r.name }),
        o === r.id ? /* @__PURE__ */ e.jsx("button", { onClick: () => C(r), className: "shrink-0 text-xs font-semibold text-accent hover:text-accent-600", children: "Kaydet" }) : /* @__PURE__ */ e.jsx("button", { onClick: () => {
          y(r.id), w(r.name);
        }, className: "shrink-0 text-xs text-text-tertiary hover:text-text-primary", children: "Düzenle" }),
        /* @__PURE__ */ e.jsx("button", { onClick: () => j(r), className: "shrink-0 text-xs text-negative hover:opacity-80", children: "Sil" })
      ] }, r.id))
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex items-center gap-2 border-t border-subtle pt-4", children: [
      /* @__PURE__ */ e.jsx("input", { type: "color", value: p, onChange: (r) => f(r.target.value), className: "h-9 w-9 shrink-0 cursor-pointer rounded border border-default" }),
      /* @__PURE__ */ e.jsx("input", { value: d, onChange: (r) => x(r.target.value), onKeyDown: (r) => r.key === "Enter" && v(), placeholder: "Yeni kategori adı…", className: "min-w-0 flex-1 rounded-lg border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus:border-border-focus focus:outline-none" }),
      /* @__PURE__ */ e.jsx("button", { onClick: v, disabled: b || !d.trim(), className: "shrink-0 rounded-lg bg-accent px-3 py-2 text-sm font-bold text-white hover:bg-accent-600 disabled:opacity-50", children: "Ekle" })
    ] })
  ] }) });
}
function N(a, n) {
  const s = window.abp;
  s != null && s.notify && a === "success" ? s.notify.success(n) : s != null && s.message ? s.message[a === "error" ? "error" : "info"](n) : console.log(`[${a}] ${n}`);
}
function q(a) {
  var s;
  const n = window.abp;
  return (s = n == null ? void 0 : n.message) != null && s.confirm ? new Promise((d) => {
    n.message.confirm(`"${a}" formunu silmek istediğinize emin misiniz?`, "Onay", (x) => d(!!x));
  }) : Promise.resolve(window.confirm(`"${a}" formunu sil?`));
}
const z = document.getElementById("forms-list-root");
z && O(z, "forms", /* @__PURE__ */ e.jsx(Y, {}));
