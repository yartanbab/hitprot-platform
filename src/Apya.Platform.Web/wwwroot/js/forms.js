import { b as D, j as e, r as l } from "./react-vendor-D57GAUXd.js";
import { a as p } from "./httpClient-DePjXdo1.js";
import { H as M } from "./Hint-CNW95h3H.js";
import { p as O } from "./publicFormLink-CJ_6ABDU.js";
import { s as E, a as R, C as I } from "./formChoices-DAx-kYeM.js";
/* empty css               */
const F = {
  0: { label: "Taslak", cls: "bg-neutral-100 text-neutral-700" },
  1: { label: "Yayında", cls: "bg-positive-100 text-positive-700" },
  2: { label: "Arşiv", cls: "bg-warning-100 text-warning-700" }
}, K = (a) => {
  try {
    return new Date(a).toLocaleDateString("tr-TR");
  } catch {
    return a;
  }
}, L = (a) => {
  var n, o;
  return (o = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.auth) == null ? void 0 : o.isGranted(a);
}, z = (a, n) => (getComputedStyle(document.documentElement).getPropertyValue(a) || "").trim() || n, S = () => z("--apya-neutral-400", "#9CA3AF"), A = () => z("--apya-accent-500", "#4F46E5");
function T() {
  const [a, n] = l.useState([]), [o, s] = l.useState(!0), [x, g] = l.useState([]), [m, j] = l.useState(""), [k, b] = l.useState(!1), [v, y] = l.useState(!1), N = L("Platform.DynamicAssets.ManageCategories"), u = l.useRef(0), w = async (t) => {
    const d = ++u.current;
    s(!0);
    try {
      const i = new URLSearchParams({ MaxResultCount: "200", SkipCount: "0" });
      t && i.set("CategoryId", t);
      const h = await p.get(`/api/app/form?${i.toString()}`);
      if (d !== u.current) return;
      n(h.items || []);
    } catch (i) {
      if (d !== u.current) return;
      f("error", (i == null ? void 0 : i.message) || "Formlar yüklenemedi.");
    } finally {
      d === u.current && s(!1);
    }
  }, C = () => {
    p.get("/api/app/form-category?MaxResultCount=100").then((t) => g(t.items || [])).catch(() => {
    });
  };
  l.useEffect(() => {
    C();
  }, []), l.useEffect(() => {
    w(m);
  }, [m]);
  const r = (t) => x.find((d) => d.id === t), c = async (t) => {
    if (await _(t.title))
      try {
        await p.delete(`/api/app/form/${t.id}`), n((i) => i.filter((h) => h.id !== t.id)), f("success", "Form silindi.");
      } catch (i) {
        f("error", (i == null ? void 0 : i.message) || "Silme başarısız.");
      }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "text-text-primary", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h1", { className: "text-2xl font-bold text-text-primary", children: "Formlarım" }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-sm text-text-secondary", children: [
          a.length,
          " form"
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets/Builder", className: "rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-accent-600", children: "+ Yeni Form" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mb-5 flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          onClick: () => j(""),
          className: `rounded-full px-3 py-1.5 text-xs font-semibold transition ${m === "" ? "bg-accent text-white" : "bg-surface-sunken text-text-secondary hover:opacity-80"}`,
          children: "Tümü"
        }
      ),
      x.map((t) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          onClick: () => j(t.id),
          className: `rounded-full px-3 py-1.5 text-xs font-semibold transition ${m === t.id ? "text-white" : "text-text-secondary hover:opacity-80"}`,
          style: m === t.id ? { backgroundColor: t.color || A() } : { backgroundColor: `${t.color || S()}20` },
          children: [
            t.icon ? `${t.icon} ` : "",
            t.name
          ]
        },
        t.id
      )),
      N && /* @__PURE__ */ e.jsx("button", { onClick: () => b(!0), className: "ml-1 rounded-full border border-dashed border-default px-3 py-1.5 text-xs font-semibold text-text-secondary hover:border-strong hover:text-text-primary", children: "⚙ Kategoriler" }),
      /* @__PURE__ */ e.jsx("button", { onClick: () => y(!0), className: "rounded-full border border-dashed border-default px-3 py-1.5 text-xs font-semibold text-text-secondary hover:border-strong hover:text-text-primary", children: "⚡ Veri kaynakları" })
    ] }),
    o ? /* @__PURE__ */ e.jsx("div", { className: "py-16 text-center text-text-tertiary", children: "Formlar yükleniyor…" }) : a.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border-2 border-dashed border-default py-20 text-center", children: [
      /* @__PURE__ */ e.jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-3xl", children: "📝" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-bold text-text-primary", children: m ? "Bu kategoride form yok" : "Henüz formun yok" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-sm text-text-tertiary", children: m ? "Başka bir kategori seç veya yeni form oluştur." : "İlk formunu oluşturmak için başla." }),
      /* @__PURE__ */ e.jsx("a", { href: "/DynamicAssets/Builder", className: "mt-4 inline-block rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600", children: "+ Yeni Form Oluştur" })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3", children: a.map((t) => {
      var i, h;
      const d = t.categoryId ? r(t.categoryId) : null;
      return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col rounded-2xl border border-default bg-surface-raised p-5 transition hover:shadow-md", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "mb-2 flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("h3", { className: "line-clamp-2 font-bold text-text-primary", children: t.title }),
          /* @__PURE__ */ e.jsx("span", { className: `shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${(i = F[t.status]) == null ? void 0 : i.cls}`, children: (h = F[t.status]) == null ? void 0 : h.label })
        ] }),
        d && /* @__PURE__ */ e.jsxs("span", { className: "mb-2 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", style: { backgroundColor: `${d.color || S()}20`, color: d.color || "var(--apya-text-secondary)" }, children: [
          d.icon ? `${d.icon} ` : "",
          d.name
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
          /* @__PURE__ */ e.jsx("span", { className: "ml-auto whitespace-nowrap", children: K(t.creationTime) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Builder?id=${t.id}`, className: "min-w-0 flex-1 truncate rounded-lg border border-default px-3 py-1.5 text-center text-xs font-semibold text-text-secondary hover:bg-surface-sunken", children: "Düzenle" }),
          /* @__PURE__ */ e.jsx("a", { href: `/DynamicAssets/Responses?formId=${t.id}`, className: "min-w-0 flex-1 truncate rounded-lg border border-default px-3 py-1.5 text-center text-xs font-semibold text-text-secondary hover:bg-surface-sunken", children: "Yanıtlar" }),
          t.status === 1 && /* @__PURE__ */ e.jsx("a", { href: O(t.slug), target: "_blank", rel: "noreferrer", className: "shrink-0 rounded-lg border border-default px-2.5 py-1.5 text-xs hover:bg-surface-sunken", title: "Formu aç", children: "↗" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => c(t), className: "shrink-0 rounded-lg border border-negative-100 px-2.5 py-1.5 text-xs text-negative-500 hover:bg-negative-50", children: "🗑" }),
          /* @__PURE__ */ e.jsx(M, { placement: "left", text: "Formu siler ama mevcut yanıtları SİLMEZ — yanıtlar veritabanında kalır, sahipsiz kalır ve bir daha hiçbir ekrandan erişilemez." })
        ] })
      ] }, t.id);
    }) }),
    v && /* @__PURE__ */ e.jsx(B, { onClose: () => y(!1) }),
    k && /* @__PURE__ */ e.jsx(
      P,
      {
        categories: x,
        onClose: () => b(!1),
        onChanged: C
      }
    )
  ] });
}
function B({ onClose: a }) {
  const [n, o] = l.useState(null);
  return l.useEffect(() => {
    p.get("/api/app/form/choice-sources").then((s) => o(s || [])).catch((s) => {
      f("error", (s == null ? void 0 : s.message) || "Veri kaynakları yüklenemedi."), o([]);
    });
  }, []), /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4", onClick: a, children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-lg rounded-2xl border border-default bg-surface-elevated p-6 shadow-xl", onClick: (s) => s.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("div", { className: "mb-1 flex items-center justify-between", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-bold text-text-primary", children: "Veri kaynakları" }),
      /* @__PURE__ */ e.jsx("button", { onClick: a, className: "rounded p-1 text-text-tertiary hover:bg-surface-sunken", children: "✕" })
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "mb-4 text-sm text-text-secondary", children: "Açılır liste alanını bu listelerden birine bağlayabilirsiniz; seçenekler form her açıldığında güncel veriden gelir." }),
    n == null ? /* @__PURE__ */ e.jsx("p", { className: "py-8 text-center text-sm text-text-tertiary", children: "Yükleniyor…" }) : n.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "py-8 text-center text-sm text-text-tertiary", children: "Tanımlı veri kaynağı yok." }) : /* @__PURE__ */ e.jsx("div", { className: "flex max-h-80 flex-col gap-2 overflow-y-auto", children: n.map((s) => {
      var x;
      return /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle px-3 py-2", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: E(s.key) }),
          /* @__PURE__ */ e.jsx("span", { className: "rounded-full bg-surface-sunken px-2 py-0.5 text-[11px] font-semibold text-text-secondary", children: R[s.scope] || "Kapsam belirsiz" }),
          s.dependsOnSourceKey && /* @__PURE__ */ e.jsxs("span", { className: "rounded-full bg-primary-subtle px-2 py-0.5 text-[11px] font-semibold text-text-primary", children: [
            "⛓ ",
            E(s.dependsOnSourceKey),
            " alanına bağlı"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-xs text-text-secondary", children: ((x = I[s.key]) == null ? void 0 : x.hint) || "" }),
        /* @__PURE__ */ e.jsxs("p", { className: "mt-1 text-xs text-text-secondary", children: [
          s.recordCount == null ? "Kayıt sayısı firmaya göre değişir" : `${s.recordCount} kayıt`,
          " · ",
          s.usedInFormCount > 0 ? `${s.usedInFormCount} formda kullanılıyor` : "Henüz hiçbir formda kullanılmıyor"
        ] })
      ] }, s.key);
    }) })
  ] }) });
}
function P({ categories: a, onClose: n, onChanged: o }) {
  const [s, x] = l.useState(""), [g, m] = l.useState(A()), [j, k] = l.useState(!1), [b, v] = l.useState(null), [y, N] = l.useState(""), u = async () => {
    if (s.trim()) {
      k(!0);
      try {
        await p.post("/api/app/form-category", { name: s.trim(), color: g, icon: null, order: a.length }), x(""), o();
      } catch (r) {
        f("error", (r == null ? void 0 : r.message) || "Kategori eklenemedi.");
      } finally {
        k(!1);
      }
    }
  }, w = async (r) => {
    if (y.trim())
      try {
        await p.put(`/api/app/form-category/${r.id}`, { name: y.trim(), color: r.color, icon: r.icon, order: r.order }), v(null), o();
      } catch (c) {
        f("error", (c == null ? void 0 : c.message) || "Güncellenemedi.");
      }
  }, C = async (r) => {
    if (window.confirm(`"${r.name}" kategorisini silmek istediğinize emin misiniz?`))
      try {
        await p.delete(`/api/app/form-category/${r.id}`), o();
      } catch (c) {
        f("error", (c == null ? void 0 : c.message) || "Silinemedi.");
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
        b === r.id ? /* @__PURE__ */ e.jsx("input", { autoFocus: !0, value: y, onChange: (c) => N(c.target.value), onKeyDown: (c) => c.key === "Enter" && w(r), className: "min-w-0 flex-1 rounded border border-default bg-surface-base px-2 py-1 text-sm text-text-primary" }) : /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 truncate text-sm font-medium text-text-secondary", children: r.name }),
        b === r.id ? /* @__PURE__ */ e.jsx("button", { onClick: () => w(r), className: "shrink-0 text-xs font-semibold text-accent hover:text-accent-600", children: "Kaydet" }) : /* @__PURE__ */ e.jsx("button", { onClick: () => {
          v(r.id), N(r.name);
        }, className: "shrink-0 text-xs text-text-tertiary hover:text-text-primary", children: "Düzenle" }),
        /* @__PURE__ */ e.jsx("button", { onClick: () => C(r), className: "shrink-0 text-xs text-negative hover:opacity-80", children: "Sil" })
      ] }, r.id))
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex items-center gap-2 border-t border-subtle pt-4", children: [
      /* @__PURE__ */ e.jsx("input", { type: "color", value: g, onChange: (r) => m(r.target.value), className: "h-9 w-9 shrink-0 cursor-pointer rounded border border-default" }),
      /* @__PURE__ */ e.jsx("input", { value: s, onChange: (r) => x(r.target.value), onKeyDown: (r) => r.key === "Enter" && u(), placeholder: "Yeni kategori adı…", className: "min-w-0 flex-1 rounded-lg border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus:border-border-focus focus:outline-none" }),
      /* @__PURE__ */ e.jsx("button", { onClick: u, disabled: j || !s.trim(), className: "shrink-0 rounded-lg bg-accent px-3 py-2 text-sm font-bold text-white hover:bg-accent-600 disabled:opacity-50", children: "Ekle" })
    ] })
  ] }) });
}
function f(a, n) {
  const o = window.abp;
  o != null && o.notify && a === "success" ? o.notify.success(n) : o != null && o.message ? o.message[a === "error" ? "error" : "info"](n) : console.log(`[${a}] ${n}`);
}
function _(a) {
  var o;
  const n = window.abp;
  return (o = n == null ? void 0 : n.message) != null && o.confirm ? new Promise((s) => {
    n.message.confirm(`"${a}" formunu silmek istediğinize emin misiniz?`, "Onay", (x) => s(!!x));
  }) : Promise.resolve(window.confirm(`"${a}" formunu sil?`));
}
const $ = document.getElementById("forms-list-root");
$ && D($).render(/* @__PURE__ */ e.jsx(T, {}));
